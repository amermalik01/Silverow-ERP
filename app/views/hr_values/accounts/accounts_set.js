myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        $stateProvider

            .state('app.edit_account_setting', {
                url: '/edit_account_setting/:id/edit/:tab',
                title: 'Edit Employee',
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

            //.state('app.hr_setting', {
            //    url: '/hr_setting/:id/edit/:tab',
            //    title: 'Edit HR Setting',
            //    templateUrl: helper.basepath('hr_values/accounts/hr_setting_tabs.html'),
            //    resolve: helper.resolveFor('ngTable', "ngDialog")
            //})

    }]);


myApp.controller('edit_account_controller', edit_account_controller);
function edit_account_controller($scope, $stateParams, $http, $state, toaster, $rootScope, ngDialog,    $window,    $resource,$timeout) {


    if ($stateParams.id > 0)  $scope.check_hrvalues_readonly = true;


    $scope.showEditForm = function () {
        $scope.check_hrvalues_readonly = false;
    }


    $scope.arr_vehicle_expense = [];
    $scope.arr_vehicle_expense = [{'name': 'Personal Vehicle', 'id': 1}, {'name': 'Company Vehicle', 'id': 2}];
    $scope.showroleslist = true;
    $scope.check_hrvalues_readonly = false;
    $scope.perreadonly = true;

    $scope.showroleslist = true;
    $scope.formTitle = 'HR Value';
    $scope.btnCancelUrl = '#';

    $scope.arr_car_fuel_type = [];
    $scope.arr_car_fuel_type = [{'label': 'Petrol', 'value': 1}, {'label': 'Diesel', 'value': 2}
        , {'label': 'LPG', 'value': 3}];

    $scope.arr_car_enngine = [];
    $scope.arr_car_enngine = [
        {'label': '1400cc or less', 'value': 1, 'type': 1},
        {'label': '1401cc to 2000cc', 'value': 2, 'type': 1},
        {'label': 'Over 2000cc', 'value': 3, 'type': 1},
        {'label': '1600cc or less', 'value': 4, 'type': 2},
        {'label': '1601cc to 2000cc', 'value': 5, 'type': 2},
        {'label': 'Over 2000cc', 'value': 6, 'type': 2},
        {'label': '1400cc or less', 'value': 7, 'type': 3},
        {'label': '1401cc to 2000cc', 'value': 8, 'type': 3},
        {'label': 'Over 2000cc', 'value': 9, 'type': 3},];

    $scope.arr_vehicle_rate = [];
    $scope.arr_vehicle_rate = [{name: 'Car and Van', id: '0.45'}, {name: 'Motor cycles', id: '0.24'}
        , {name: 'Bicycle', id: '0.20'}];
    $scope.arr_vehicle_expense = [];
    $scope.arr_vehicle_expense = [{'name': 'Personal Vehicle', 'id': 1}, {'name': 'Company Vehicle', 'id': 2}];

    $scope.entitle_holiday_option = [];
    $scope.entitle_holiday_option = [{'label': 'Week', 'value': 1}, {'label': 'Days', 'value': 2}
        , {'label': 'Hours', 'value': 3}];
    $scope.arr_holiday_type = [];
    $scope.arr_holiday_type = [{'name': 'Paid', 'id': 1}, {'name': 'Unpaid', 'id': 2}];

    //Show Hide Password		 default

    $scope.inputType = 'password'; //'text';
    $scope.hideShowPassword = function () {
        if ($scope.inputType == 'password')  $scope.inputType = 'text';
        else  $scope.inputType = 'password';
    };

    $scope.formData = {};
    $scope.formData2 = {};
    $scope.formData3 = {};
    $scope.formData4 = {};
    $scope.formData5 = {};
    $scope.formData6 = {};
    $scope.formsubData = {};
    $scope.expenses = {};
    $scope.employee_type_list = [];
    $scope.dept_list = [];

    $scope.religion_list = [];

    $scope.user_types = [];
    $scope.salary_type = [];

    $scope.leave_types = [];
    $scope.resign_type = [];
    $scope.documents = {};

    $scope.list_folder = [];
    $scope.salary_type_list_final_two = [];
    $scope.salary_type_list_final_one = [];

    $scope.roless = [];
    $scope.module_list = [];
    $scope.role_list = [];

    $scope.formData.holiday_id = '';
    $scope.holiday_id = '';

    $scope.emp_full_name = '';
    $scope.total_final = {};
    $scope.total_sub = {};
    $scope.total_sub = 0;
    $scope.total_final = 0;
    $scope.image_path = '1878331758.png';


    // ---------  General Tab	 -----------------------



    $scope.user_types = [{'label': 'Company User', 'value': 2}, {'label': 'Normal User', 'value': 3}];
    if ($scope.user_type == 1)    $scope.user_types.push({'label': 'Super Admin', 'value': '1'});


    $scope.$root.breadcrumbs =
        [////{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
            {'name': 'Account Setting', 'url': '#', 'isActive': false},
            {'name': 'HR', 'url': '#', 'isActive': false}];


    if ($stateParams.id !== undefined) {

        var HRDetailsURL = $scope.$root.hr + "hr_values/get-employee-details";
        $timeout(function () {
            $http
                .post(HRDetailsURL, {'token': $scope.$root.token, 'employee_id': $stateParams.id})
                .then(function (res) {
                    if (res.data.ack == true) {


                        $scope.$root.model_code =
                            res.data.response.first_name + ' ' + res.data.response.last_name + '( ' + res.data.response.user_code + ' )';

                        $scope.module_code = $scope.$root.model_code;

                        $scope.$root.breadcrumbs.push(
                            {'name': $scope.$root.model_code, 'url': '#', 'isActive': false}
                            , {'name': 'General', 'url': '#', 'isActive': false});


                        $scope.formData = res.data.response;
                        $.each($scope.entitle_holiday_option, function (index, obj) {
                            if (obj.value == res.data.response.entitle_holiday_opti) {
                                $scope.entitled_label = obj.label;
                                //console.log($scope.entitled_label);
                            }

                        });
                        if (res.data.response.entitle_holiday_opti > 0) $scope.formData.annual_allownce = res.data.response.entitle_holiday + " " + $scope.entitled_label;

                        if (res.data.response.case_date == 0) {
                            $scope.formData.case_date = null;
                        } else {
                            $scope.formData.case_date = $scope.$root.convert_unix_date_to_angular(res.data.response.case_date);
                        }


                        if (res.data.response.status_date == 0) {
                            $scope.formData.status_date = null;
                        } else {
                            $scope.formData.status_date = $scope.$root.convert_unix_date_to_angular(res.data.response.status_date);
                        }


                        if (res.data.response.status_inactive_date == 0) {
                            $scope.formData.status_inactive_date = null;
                        } else {
                            $scope.formData.status_inactive_date = $scope.$root.convert_unix_date_to_angular(res.data.response.status_inactive_date);
                        }

                        if (res.data.response.start_date == 0) {
                            $scope.formData.start_date = null;
                        } else {
                            $scope.formData.start_date = $scope.$root.convert_unix_date_to_angular(res.data.response.start_date);
                        }

                        if (res.data.response.leave_date == 0) {
                            $scope.formData.leave_date = null;
                        } else {
                            $scope.formData.leave_date = $scope.$root.convert_unix_date_to_angular(res.data.response.leave_date);
                        }

                        if (res.data.response.date_of_birth == 0) {
                            $scope.formData.date_of_birth = null;
                        } else {
                            $scope.formData.date_of_birth = $scope.$root.convert_unix_date_to_angular(res.data.response.date_of_birth);
                        }




                        if ($scope.formData.employee_type.id == 2) {
                            $scope.$root.salary_type_one = true;

                            $.each($scope.salary_type_list_final_one, function (index, obj) {
                                if (obj.value == res.data.response.salary_type) {
                                    $scope.formData.salary_type = $scope.salary_type_list_final_one[index];
                                }
                            });
                        }
                        else {
                            $scope.$root.salary_type_two = true;
                            $.each($scope.salary_type_list_final_two, function (index, obj) {
                                if (obj.value == res.data.response.salary_type) {
                                    $scope.formData.salary_type = $scope.salary_type_list_final_two[index];
                                }
                            });
                        }



                        if ((res.data.response.status_date != 0) && (res.data.response.status == 1))   $scope.is_status = true;



                        if (res.data.response.other_leave != 0)  $scope.is_leave_other = true;

                        if ((res.data.response.other_case != 0) && (res.data.response.case_of_inactivity == 4))    $scope.is_case_no = true;


                        if (res.data.response.other_ethinic != 0)   $scope.is_ethinic = true;

                        if ((res.data.response.status == 1))     $scope.is_status = true;


                        //$.each($scope.status_data, function (index, obj) {
                        //    // console.log( res.data.response.status );
                        //    if (obj.id == res.data.response.status) {
                        //        $scope.formData.status = $scope.status_data[index];
                        //
                        //    }
                        //});




                    }

                });

            $scope.showLoader = false;
        }, 1000);
        $scope.showLoader = false;

    }


    $scope.generalInformation = function () {

        $scope.$root.breadcrumbs[3].name = 'General Information';

    }


    //var updateUrl = $scope.$root.hr + "hr_values/update-tab-col-val";
    $scope.addGeneral = function (formData) {

        $scope.formData.employee_id = $stateParams.id;
        //	$scope.formData.employee_id = $scope.$root.employee_id;
        $scope.formData.data = $scope.formFields;
        $scope.formData.tab_id_2 = 1;
        $scope.formData.token = $scope.$root.token;


        $scope.formData.user_ids = $scope.formData.user_id !== undefined ? $scope.formData.user_id.value : 0;
        $scope.formData.departments = $scope.formData.department !== undefined ? $scope.formData.department.id : 0;
        $scope.formData.employee_types = $scope.formData.employee_type !== undefined ? $scope.formData.employee_type.id : 0;
        $scope.formData.case_of_inactivitys = $scope.formData.case_of_inactivity !== undefined ? $scope.formData.case_of_inactivity.value : 0;
        $scope.formData.reason_of_leavings = $scope.formData.reason_of_leaving !== undefined ? $scope.formData.reason_of_leaving.value : 0;
        // $scope.formData.statuss = $scope.formData.status !== undefined ? $scope.formData.status.id : 0;
// console.log($scope.formData);

        var updategeral = $scope.$root.hr + "hr_values/update-hr-general";
        // var updateUrl = $scope.$root.hr + "hr_values/update-tab-col-val";
        $http
            .post(updategeral, $scope.formData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.employee_id = res.data.employee_id;
                    toaster.pop('success', res.data.info, res.data.msg);

                    if (res.data.info == 'insert') {
                        $timeout(function () {
                            $state.go("app.edithrvalues", {id: res.data.employee_id});
                        }, 1000);
                    }


                } else
                    toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(102));

            });


    }


    //History Popup


    $scope.history_title = "";
    $scope.history_type = "";

    $scope.historyHrTab = function (type) {
        $scope.history_type = type;
        if (type == "employeestatus") {
            $scope.history_title = "Employee Status History";
            var Url = $scope.$root.hr + "hr_values/employee-status-history";
        } else if (type == "salarystatus") {
            $scope.history_title = "Employee Salary History";
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

                    angular.element('#hr_history_modal').modal({show: true});

                } else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

                }

            });


    };

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
