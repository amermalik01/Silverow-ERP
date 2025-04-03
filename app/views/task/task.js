

// myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
//     function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
//         /* specific routes here (see file config.js) */
//         $stateProvider
//                 .state('app.task', {
//                     url: '/task',
//                     title: 'Task',
//                     templateUrl: helper.basepath('task/task.html'),
//                     resolve: helper.resolveFor('event-calendar'), //,'redicator'
//                     controller: 'TaskController',
//                 })
//     }]);

TaskController.$inject = ["$scope", "$state", "$filter", "$resource", "$timeout", "$http", "toaster", "Calendar", "$rootScope", "$stateParams"];
myApp.controller('TaskController', TaskController);

function TaskController($scope, $state, $filter, $resource, $timeout, $http, toaster, Calendar, $rootScope, $stateParams) {
    $scope.breadcrumbs =
        [{ 'name': 'Tasks', 'url': '#', 'isActive': false }];


    var vm = this;

    $scope.showLoader = true;

    $scope.getMainRecordNames = function (module) {
        var RecordListingAPI = $rootScope.setup + "general/bringNamesFromModule";
        var postData = {
            token: $rootScope.token,
            module: module,
            noRoleAssigned: $rootScope.noRoleAssigned
        }
        $httpPromise = $http
            .post(RecordListingAPI, postData)
            .then(function (res) {
                if (res.data.ack) {
                    $scope.showLoader = false;
                    return res.data.response;
                    // if (moduleTracker.module.record) {
                    //     angular.forEach($scope.allNames, function (obj, ind) {
                    //         if (obj.id == moduleTracker.module.record) {
                    //             $scope.selectedAttachmentRecord.id = obj.id;
                    //             $scope.selectedAttachmentRecord.name = obj.name;
                    //         }
                    //     })
                    // }
                }
                else
                    $scope.showLoader = false;
            });
        return $httpPromise;
    }

    /* $scope.sidebarModules = [{ name: "CRM", val: "crm", getter: $scope.getMainRecordNames, type: 1, sub_types: [{ name: "Competitor", val: "competitor", type: "crm_competetor_module" }, { name: "Opportunity Cycle", val: "opp", type: "crm_oop_cycle_tab_module" }] }, { name: "Customer", val: "customer", getter: $scope.getMainRecordNames, type: 2, }, { name: "SRM", val: "srm", getter: $scope.getMainRecordNames, type: 1, }, { name: "Supplier", val: "supplier", getter: $scope.getMainRecordNames, type: 1, }, { name: "HR", val: "hr", getter: $scope.getMainRecordNames, type: 1, }]; */

    $scope.sidebarModules = [
        {
            name: "CRM",
            val: "crm",
            getter: $scope.getMainRecordNames,
            type: 1
        },
        
        {
            name: "Customer",
            val: "customer",
            getter: $scope.getMainRecordNames,
            type: 2,
        },
        {
            name: "SRM",
            val: "srm",
            getter: $scope.getMainRecordNames,
            type: 1,
        },
        {
            name: "Supplier",
            val: "supplier",
            getter: $scope.getMainRecordNames,
            type: 1,
        },
        {
            name: "HR",
            val: "hr",
            getter: $scope.getMainRecordNames,
            type: 1,
        }
    ];


    $scope.formData = {};
    $scope.status_data = [];
    $scope.task_status = [];


    $scope.opp_task_data = {};
    $scope.opp_cycle_id = 0;
    $scope.$on("showTasksEvent", function (event, opp_cycle_id) {
        $scope.opp_cycle_id = opp_cycle_id;
        $scope.tasks();
    });

    $scope.allStatus = {};
    $scope.getAllStatus = function () {

        $scope.allStatus = {};
        var Api = $scope.$root.com + "task/status";
        $http
            .post(Api, { token: $scope.$root.token })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.allStatus = res.data.response;
                }
            });


        $scope.showLoader = false;
    };


    $scope.setPriority = function(priority){
        $scope.formData.priority = priority;
    }

    $scope.deleteTask = function(id){
        var postUrl = $scope.$root.com + "task/deleteTask";
        var postData = {};
        postData.token = $scope.$root.token;
        postData.id = id;
        $httpPromise = $http
            .post(postUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    return res.data;
                    
                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(547));
            });
        return $httpPromise;
    }

    $scope.addTask = function (formData) {
        var postUrl = $scope.$root.com + "task/add_task";
        // formData.start_date = $scope.jqDateToUnix(formData.t_date);
        // formData.end_date = $scope.jqDateToUnix(formData.e_date);
        formData.token = $scope.$root.token;
        // formData.opp_cycle_id = $scope.opp_cycle_id;
        // console.log(formData.t_status);
        // return;
        if (formData.id) formData.date = formData.tempDate;
        var tempYear = formData.date.split("/")[2];
        var tempMonth = formData.date.split("/")[1];
        var tempDay = formData.date.split("/")[0];
        var now = new Date(); 
        var startOfDay = new Date(tempYear, tempMonth - 1, tempDay);
        var timestamp = startOfDay / 1000;
        formData.jsDate = timestamp;

        $httpPromise = $http
            .post(postUrl, formData)
            .then(function (res) {
                if (res.data.ack == true) {
                    return res.data;
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    // $state.go("app.task") ;
                    $scope.add_task();
                    $scope.tasks();
                    $rootScope.setNotifications();
                    //$timeout(function(){ $state.reload();}, 3000);
                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(104));
            });
            return $httpPromise;
    }

    $scope.companyEmployees = {};

    $scope.getCompanyEmployees = function () {

        $scope.companyEmployees = {};
        var Api = $scope.$root.com + "task/employees";
        $http
            .post(Api, { token: $scope.$root.token })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.companyEmployees = res.data.response;
                }
            });


        $scope.showLoader = false;
    };

    $scope.tasktest = 'hello';

    $scope.addEmployee = function (id, fname, lname, jobtitle, obj) {
        $scope.formData.assign_to = id;
        if (jobtitle != "") {
            angular.element('#assignval').val(fname + ' ' + lname + ' ( ' + jobtitle + ' )');
        } else {
            angular.element('#assignval').val(fname + ' ' + lname);
        }
    };

    $scope.showCompanyEmployees = function () {
        angular.element('#companyEmployeesModal').modal({
            show: true
        });
    };
    $scope.hideCompanyEmployees = function () {
        angular.element('#companyEmployeesModal').modal('hide');
    };

    $scope.tasks = function (q) {
        if (q == undefined){
            var q = {};
        }
        q.token = $scope.$root.token;
        $scope.task_data = {};
        $scope.opp_task_data = {};
        var Api = $scope.$root.com + "task/task_list";
        $scope.task_data = {};
        $httpPromise = $http
            .post(Api, q)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.task_data = res.data.response;
                    return res.data;
                    angular.forEach($scope.task_data, function (obj) {
                        obj.monthName = $scope.taskStartDate(convertTimestamp(Number(obj.t_date)));
                        obj.monthDay = $scope.taskStartDay(convertTimestamp(Number(obj.t_date)));
                        var str_date = convertTimestamp(Number(obj.t_date));
                        var arr = str_date.split('/');
                        obj.monthDate = arr[0];
                        obj.taskStartTime = $scope.formData.t_time;
                    });

                    if ($scope.opp_cycle_id > 0)
                        $scope.opp_task_data = res.data.response;
                    //console.log($scope.task_data);

                }
            });


        $scope.showLoader = false;
        return $httpPromise;
    }
    $scope.tasks();


    $scope.add_task_new = true;
    $scope.perreadonly = true;
    $scope.titile = 'Add Task';



    $scope.status_data = [{ label: 'Active', id: '1' }, { label: 'Inactive', id: '0' }];

    $scope.task_status = [{ label: 'Flag', id: '1' }, { label: 'Schedule', id: '2' }];




    $scope.jqDateToUnix = function (date) {
        var tD = date.split("/");
        var newDate = new Date(tD[2], tD[1] - 1, tD[0]);
        var convertedDate = newDate.getTime() / 1000;
        return convertedDate;
    }

    function convertTimestamp(timestamp) {
        var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
            yyyy = d.getFullYear(),
            mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
            dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
            time;
        time = dd + '/' + mm + '/' + yyyy;
        return time;
    }

    $scope.taskStartDate = function (date) {
        var tD = date.split("/");
        var newDate = new Date(tD[2], tD[1] - 1, tD[0]);
        d = newDate.getMonth();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        $scope.month_name = monthNames[d];
        return monthNames[d];
    }

    $scope.taskStartDay = function (date) {
        var tD = date.split("/");
        var newDate = new Date(tD[2], tD[1] - 1, tD[0]);
        d = newDate.getDay();
        const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        $scope.day_name = dayNames[d];
        return dayNames[d];
    }

    $scope.showEditForm = function () {
        $scope.titile = 'Edit Task';
        $scope.check_task_readonly = false;
        $scope.perreadonly = true;
    }

    $scope.submit_add_task = function (formData) {
        // var url = window.location.href;
        // var match = url.match(/([^\/]+)\/?$/)[1];
        // return console.log(match);

        var postUrl = $scope.$root.com + "task/add_task";
        formData.start_date = $scope.jqDateToUnix(formData.t_date);
        formData.end_date = $scope.jqDateToUnix(formData.e_date);
        formData.token = $scope.$root.token;
        formData.opp_cycle_id = $scope.opp_cycle_id;
        console.log(formData.t_status);
        // return;

        $http
            .post(postUrl, formData)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    // $state.go("app.task") ;
                    $scope.add_task();
                    $scope.tasks();
                    //$timeout(function(){ $state.reload();}, 3000);
                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(104));
            });
    };


    $scope.setNotification = function () {
        if ($scope.formData.notify) {
            if ($scope.formData.t_title == undefined) {
                toaster.pop("error", "Error", "Please add a Title");
                $scope.formData.notify = false;
                return;
            }
            if ($scope.formData.t_date == undefined) {
                toaster.pop("error", "Error", "Please choose a Start Date");
                $scope.formData.notify = false;
                return;
            }
            if ($scope.formData.t_time == '') {
                toaster.pop("error", "Error", "Please choose a Start time");
                $scope.formData.notify = false;
                return;
            }

            var tD = $scope.formData.t_date.split("/");
            var tHour = Number($scope.formData.t_time.substring(0, 2));
            var tMin = Number($scope.formData.t_time.substring(3, 5));
            if ($scope.formData.t_time[6] == 'P') tHour += 12;
            var targetTime = new Date(tD[2], tD[1] - 1, tD[0], tHour, tMin);
            var now = new Date();
            var notificationDelay = targetTime.getTime() - now.getTime();
            $scope.formData.timeoutHandle = $timeout(function () {
                // alert('Your task '+$scope.formData.t_title+' has started');
                $rootScope.goToTaskMsg = 'Your task ' + $scope.formData.t_title + ' has started';
                $rootScope.goToTaskId = $scope.formData.id;
                ngDialog.openConfirm({
                    template: 'modalToGoToTask',
                    className: 'ngdialog-theme-default-custom'
                })
            }, notificationDelay);
        } else {
            $timeout.cancel($scope.formData.timeoutHandle);
        }

    }

    $scope.formData.t_time = "";
    $scope.formData.e_time = "";
    $scope.testttt = "dsada";



    $scope.add_task = function () {
        $scope.formData.t_time = "";
        $scope.formData.e_time = "";



        $scope.add_task_new = true;
        $scope.perreadonly = true;
        $scope.check_task_readonly = false;

        // $('#add_task_new').show(); 
        // console.log( $scope.add_task_new);

        $scope.formData.id = '';
        $scope.formData.t_title = '';
        $scope.formData.t_date = '';
        $scope.formData.e_date = '';
        $scope.formData.assign_to = '';
        angular.element('#assignval').val('');
        //$scope.formData.t_time='';
        $scope.getAllStatus();
        $scope.getCompanyEmployees();

        $scope.formData.t_image = '';
        $scope.formData.status = '';
        $scope.formData.t_description = '';
        angular.element('#redactor_content').val('');
        $("#redactor_content").val('');


    };

    $scope.hide_add_task = function () {
        $scope.add_task_new = false;

    };
    $scope.edit_task = function (tdid, popup) {
        $scope.showLoader = true;
        // $scope.titile = 'View Task';
        $scope.perreadonly = false;
        $scope.check_task_readonly = true;
        $scope.hide_cancel = false;

        $scope.add_task_new = true;

        var postUrl = $scope.$root.com + "task/get_task";
        var postData = { 'token': $scope.$root.token, 'id': tdid };
        $http
            .post(postUrl, postData)
            .then(function (res) {
                $scope.formData = res.data.response;

                $scope.formData.t_date = convertTimestamp(res.data.response.t_date);

                $scope.formData.e_date = convertTimestamp(res.data.response.e_date);

                $scope.formData.notify = res.data.response.reminder_id;

                $scope.formData.t_status = res.data.response.t_status;
                if ($scope.formData.t_status == 1) {
                    $scope.formData.t_status = 'incompleted';
                }
                else {
                    $scope.formData.t_status = 'completed';
                }
                return console.log($scope.formData.t_status);

                // $.each($scope.status_data, function (index, obj) {
                //     if (obj.id == res.data.response.status) {
                //         $scope.formData.status = $scope.status_data[index];

                //     }
                // });

                // $.each($scope.task_status, function (index, obj) {
                //     if (obj.id == res.data.response.t_status) {
                //         $scope.formData.t_status = $scope.task_status[index];

                //     }
                // });

                //console.log($scope.formData);
                if (popup != undefined) {
                    //	console.log($scope.formData);
                    $scope.hide_cancel = true;
                    //$('#model_btn_task').modal('hide');
                    angular.element('#model_btn_task').modal({
                        show: true,
                    });
                }
                angular.forEach($scope.companyEmployees, function (obj, value) {
                    if (obj.id == res.data.response.assign_to) {
                        if (obj.job_title != "") {
                            angular.element('#assignval').val(obj.first_name + ' ' + obj.last_name + ' ( ' + obj.job_title + ' )');
                        } else {
                            angular.element('#assignval').val(obj.first_name + ' ' + obj.last_name);
                        }
                    }
                });
                // $.each($scope.allStatus, function (index, obj) {
                //     if (obj.id == res.data.response.t_status) {
                //         $scope.$root.$apply(function(){
                //             $scope.formData.t_status = $scope.allStatus[index];
                //             $scope.showLoader = false;
                //         });
                //     }
                // });

            });





    };

    if ($stateParams.id != undefined) {
        $scope.edit_task($stateParams.id);
    }

    $scope.tiny_value = function () {
        var tiny_body = document.getElementById('tiny_body').value;
        concole.log(tiny_body);
        var tiny_body2 = this.formData.tiny_body.id;
        concole.log(tiny_body2);
    }

    $scope.delete = function (id, index, opp_task_data) {
        var delUrl = $scope.$root.com + "task/delete_task";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));

                        //$scope.add_task();    $scope.tasks();
                        //  var index = arr_data.indexOf(rec.id);
                        opp_task_data.splice(index, 1);
                        // $state.go("app.task") ; 
                        //$timeout(function(){ $state.reload();}, 2000);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

    $scope.formData.t_time = "";
    $scope.formData.e_time = "";



    $scope.$root.load_date_picker('task');
}
