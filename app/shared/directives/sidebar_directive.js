myApp.directive("dataTypeManager2", ['$rootScope', function () {
    return {
        restrict: 'A',
        scope: {
            cellConf: "=",
            cellData: "=",
            selectSingleRec: "&",
        },
        replace: false,
        templateUrl: "app/shared/directives/_modalFlexiTable/flexi_table_data_type_manager.directive.html",
        link: function (scope, elem) {
            scope.convert_unix_date_to_angular = function (start_date) {
                //return start_date;

                /* var yyyy =start_date.split("/")[2];
                 var  mm=start_date.split("/")[1];
                 var dd=start_date.split("/")[0];
                 */

                //add 1 month  unix time issue  cannot convert exxact date  ('0' + (d.getMonth() + 1)),

                var d = new Date(start_date * 1000), // Convert the passed timestamp to milliseconds
                    yyyy = d.getFullYear(),
                    mm = ('0' + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
                    dd = ('0' + d.getDate()).slice(-2), // Add leading 0.
                    hh = d.getHours(),
                    h = hh,
                    min = ('0' + d.getMinutes()).slice(-2), // Add leading 0.
                    ampm = 'AM',
                    time;

                if (hh > 12) {
                    h = hh - 12;
                    ampm = 'PM';
                } else if (hh === 12) {
                    h = 12;
                    ampm = 'PM';
                } else if (hh == 0)
                    h = 12;

                return dd + "/" + mm + "/" + yyyy;
            }
        }
    }
}]);

myApp.directive("validity", ["$compile", function ($compile, $rootScope) {

    return {
        restrict: 'A',
        scope: {
            validity: "="
        },
        replace: false,
        link: function (scope, elem, attrs) {
            elem.removeAttr("x-validity");
            elem.attr("pattern", scope.validity);
            elem.attr("ng-pattern", scope.validity);
            if (scope.$root.regx.placeholders[attrs.validity.split(".")[1]]) {
                elem.attr("title", scope.$root.regx.placeholders[attrs.validity.split(".")[1]]);
            }
            if (scope.$root.regx.parsleyMessages[attrs.validity.split(".")[1]]) {
                elem.attr("data-parsley-pattern-message", scope.$root.regx.parsleyMessages[attrs.validity.split(".")[1]]);
            }
            $compile(elem)(scope.$parent);
        }
    }
}]);

myApp.directive("viewAttachments", [function ($scope) {
    return {
        restrict: 'E',
        scope: {
            type: "@",
            typeId: "=",
            subType: "@",
            subTypeId: "="
        },
        replace: false,
        controller: "fileUploadController",
        templateUrl: "app/shared/directives/view_attachments.directive.html",
        link: function (scope, elem, attrs) {
            scope.fileData = {
                type: scope.type,
                typeId: scope.typeId,
                subType: scope.subType,
                subTypeId: scope.subTypeId
            }
            console.log(scope.fileData);
            scope.getFileListing(1);
        }
    }
}]);

myApp.directive("attachmentUpload", [function () {
    return {
        restrict: 'E',
        scope: {
            type: "@",
            typeId: "=",
            subType: "@",
            subTypeId: "="
        },
        replace: false,
        controller: "fileUploadController",
        templateUrl: "app/shared/directives/upload_attachments.directive.html",
        link: function (scope, elem, attrs) {
            console.log(scope);
            scope.fileData = {
                type: scope.type,
                typeId: scope.typeId,
                subType: scope.subType,
                subTypeId: scope.subTypeId
            }
        }
    }
}]);

myApp.directive("sidebarEmail", ["moduleTracker", function (moduleTracker) {
    return {
        restrict: "E",
        controller: "moduleEmailController",
        templateUrl: 'app/shared/directives/sidebar_email.directive.html',
        scope:{

        },
        link: function (scope, elem, attrs) {
            
        }
    }

}]);

myApp.directive("sidebarAttachment", ["moduleTracker", function (moduleTracker) {
    return {
        restrict: "E",
        controller: "fileUploadController",
        templateUrl: 'app/shared/directives/sidebar_attachment.directive.html',
        scope:{

        },
        link: function (scope, elem, attrs) {
            
        }
    }
}]);

myApp.directive("sidebarNotes", ["moduleTracker", function (moduleTracker) {
    return {
        restrict: "E",
        controller: "commentsController",
        templateUrl: 'app/shared/directives/sidebar_notes.directive.html',
        scope:{

        },
        link: function (scope, elem, attrs) {
            
        }
    }

}]);

myApp.directive('widgets', function ($interpolate, $http, toaster, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            widgets: '=',
            chartData: '=',
            chartLabel: '='
        },
        // controller: 'DashboardController',
        templateUrl: 'app/shared/directives/widgets.directive.html',
        link: function (scope, elem, attrs) {
            
            /* var checkExist = setInterval(function () {
                if ($('#chart-area').length && scope.chartData.length > 0) {
                    var colours = [
                        "#FF5733",
                        "#FFD376",
                        "#A4EEFF",
                        "#FB8BE7",
                        "#69DFD8",
                        "#9496F9",
                        "#FF5733",
                        "#FFD376",
                        "#A4EEFF",
                        "#FB8BE7",
                        "#69DFD8",
                        "#9496F9",
                    ];

                    var bg_colours = [
                        "#FF8E76",
                        "#FFE2A4",
                        "#CFF6FF",
                        "#FFB1F1",
                        "#9AEEE9",
                        "#CACBFF",
                        "#FF8E76",
                        "#FFE2A4",
                        "#CFF6FF",
                        "#FFB1F1",
                        "#9AEEE9",
                        "#CACBFF",
                    ];
                    var config = {
                        type: 'funnel',
                        data: {
                            datasets: [{
                                data: scope.chartData, // [10, 20, 90], //
                                backgroundColor:
                                    // [
                                    //     "#FF6384",
                                    //     "#36A2EB",
                                    //     "#FFCE56"
                                    // ]
                                colours.slice(0, scope.chartData.length),
                                hoverBackgroundColor: bg_colours.slice(0, scope.chartData.length),
                                // [
                                //     "#FF6384",
                                //     "#36A2EB",
                                //     "#FFCE56"
                                // ]
                            }],
                            labels: scope.chartLabel
                            // [
                            //     "Red",
                            //     "Blue",
                            //     "Yellow"
                            // ]
                        },
                        options: {
                            sort: 'desc',
                            maintainAspectRatio: false,
                            gap:4,
                            responsive: true,
                            //keep: 'left',
                            legend: {
                                position: 'left'
                            },
                            title: {
                                display: false,
                                text: 'Chart.js Funnel Chart'
                            },
                            animation: {
                                animateScale: true,
                                animateRotate: true
                            }
                        }
                    };
                    ctx = document.getElementById("chart-area").getContext("2d");
                    window.myDoughnut = new Chart(ctx, config)
                    clearInterval(checkExist);
                }
            }, 100); */
        }
    }

});

myApp.directive("sidebarTasks", ["$http", "moduleTracker", "toaster", "ngDialog", "$rootScope", function ($http, moduleTracker, toaster, ngDialog, $rootScope) {
    return {
        restrict: "E",
        templateUrl: 'app/shared/directives/sidebar_tasks.directive.html',
        scope: {
            name: "@",
            modules: "=",
            getRecords: "&",
            setRecords: "&",
            submit: "&",
            delete: "&",
            preFocusedRecord: "@",
            focusedTemplate: "@",
            addTemplate: "@",
            editTemplate: "@"
        },
        link: function (scope, elem, attrs) {

            scope.verifyRangeFilters = function (ck_startDate, ck_end_date, div_id, type) {
                if (type == "date") {
                    from = $("#" + ck_startDate).val().split("/")[2] + "-" + $("#" + ck_startDate).val().split("/")[1] + "-" + $("#" + ck_startDate).val().split("/")[0];
                    to = $("#" + ck_end_date).val().split("/")[2] + "-" + $("#" + ck_end_date).val().split("/")[1] + "-" + $("#" + ck_end_date).val().split("/")[0];
                    if (from != null && to != null) {
                        var from1, to1, check1;
                        from1 = new Date(from.replace(/\s/g, ''));
                        to1 = new Date(to.replace(/\s/g, ''));
                        var fDate, lDate, cDate;
                        fDate = Date.parse(from1);
                        lDate = Date.parse(to1);

                    }
                }
                else if (type == "number") {
                    from = $("#" + ck_startDate).val();
                    to = $("#" + ck_end_date).val();
                    if (from && to) {
                        fDate = parseFloat(from); lDate = parseFloat(to);
                    }
                }
                if (fDate > lDate) {
                    toaster.pop('error', 'Error', div_id);
                }
            }

            scope.formData = {};
            scope.uiselectHandler = {};

            scope.moduleTracker = moduleTracker;

            scope.prepareToSubmit = function () {

                if (scope.uiselectHandler.selectedMainModule != undefined)
                    scope.formData.module = scope.uiselectHandler.selectedMainModule.val;
                if (scope.uiselectHandler.selectedRecord != undefined)
                    scope.formData.record = scope.uiselectHandler.selectedRecord.id;


                if (scope.formData.subject == undefined || scope.formData.subject == '') {
                    toaster.pop('error', 'info', $rootScope.getErrorMessageByCode(230, ['Subject']), null, null, null, 4);
                    return;
                }
                if (scope.formData.date == undefined || scope.formData.date == '') {
                    toaster.pop('error', 'info', $rootScope.getErrorMessageByCode(230, ['Due Date']), null, null, null, 4);
                    return;
                }
                if (scope.formData.time == undefined || scope.formData.time == '') {
                    toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(230, ['Due Time']), null, null, null, 4);
                    return;
                }
                scope.showLoader = true;
                scope.submit({ formData: scope.formData }).then(function (resp) {
                    scope.clearVars();
                    scope.bringRecords();
                    scope.$root.setNotifications();
                    scope.showLoader = false;
                })
            }

            scope.conditionalUpperCase = function (val, limit) {
                if (val == "N/A") {
                    return val;
                }
                if (val) {
                    if (val.length <= limit) {
                        val = val.toUpperCase();
                    }
                    else {
                        str = val.replace('_', ' ');
                        var splitStr = str.split(' ');
                        for (var i = 0; i < splitStr.length; i++) {
                            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
                        }
                        str = splitStr.join(' ');
                        val = str;
                    }
                    return val;
                }
            }

            scope.deleteThis = function (id) {
                scope.showLoader = true;
                ngDialog.openConfirm({
                    template: 'modalDeleteDialogId',
                    className: 'ngdialog-theme-default-custom'
                }).then(function (value) {
                    scope.delete({ id: id }).then(function (res) {
                        scope.showLoader = false;
                        if (res.ack == true) {
                            toaster.pop('success', 'Deleted', $rootScope.getErrorMessageByCode(103), null, null, null, 3);
                            scope.clearVars();
                            scope.bringRecords();
                            scope.$root.setNotifications();
                        } else {
                            toaster.pop('error', 'Deleted', $rootScope.getErrorMessageByCode(108), null, null, null, 3);
                            scope.clearVars();
                            scope.bringRecords();
                            scope.$root.setNotifications();
                        }
                    })
                }, function (reason) {
                    scope.showLoader = false;
                    console.log('Modal promise rejected. Reason: ', reason);
                });
                
            }

            scope.date2UNIX = function (date) {
                var year = date.split("/")[2];
                var month = parseInt(date.split("/")[1]) - 1;
                var day = date.split("/")[0];
                var UNIXDate = new Date(year, month, day);
                return date ? ((UNIXDate.getTime()) / 1000) : "";
            }

            scope.searchDate = {};

            scope.$watch("[searchDate.start, searchDate.end]", function () {

                if (scope.searchDate.start)
                    var start = scope.date2UNIX(scope.searchDate.start);
                if (scope.searchDate.end)
                    var end = scope.date2UNIX(scope.searchDate.end);

                if (scope.allRecords == undefined) {
                    return;
                }
                if (!start && !end) {
                    scope.filteredRecords = scope.allRecords.filter(function (obj) {
                        return 1;
                    });
                }
                else if (start && end) {
                    scope.filteredRecords = scope.allRecords.filter(function (obj) {
                        return (start <= obj.date && end >= obj.date);
                    });
                }
                else if (start && !end) {
                    scope.filteredRecords = scope.allRecords.filter(function (obj) {
                        return (start <= obj.date);
                    });
                }
                else if (!start && end) {
                    scope.filteredRecords = scope.allRecords.filter(function (obj) {
                        return (end >= obj.date);
                    });
                }

                angular.forEach(scope.filteredRecords, function (obj2) {
                });

            })

            scope.editThis = function (task) {

                var now = (Date.now() / 1000).toFixed();
                if (parseInt(task.date) < parseInt(now)) {
                    task.oldTask = true;
                }
                else{
                    task.oldTask = false;
                }

                scope.showLoader = true;
                scope.formData = task;
                scope.formData.reminder = parseInt(task.reminder);
                scope.formData.recurrence = parseInt(task.recurrence);
                scope.formData.sell_to_cust_no =task.linkedRecordName;
                angular.forEach(scope.modules, function (obj) {
                    if (obj.val == task.module) {
                        scope.uiselectHandler.selectedMainModule = obj;
                        scope.uiselectHandler.selectedMainModule.getter(scope.uiselectHandler.selectedMainModule.val).then(function (resp) {
                            scope.mainModuleRecords = resp;
                            angular.forEach(scope.mainModuleRecords, function (obj) {
                                if (obj.id == task.record) {
                                    scope.uiselectHandler.selectedRecord = obj;
                                    scope.showLoader = false;
                                }
                            })
                        });
                    }
                })
                // if (!task.record)
                    scope.showLoader = false;
                scope.compose = true;
            }

            scope.selectTab = function (tabNo) {
                for (var i = 0; i < scope.tabArr.length; i++) {
                    scope.tabArr[i] = false;
                }
                scope.tabArr[tabNo] = true;
            }

            scope.updateMainModule = function (selectedModule) {
               /*  scope.formData={};
                scope.formData.status = 1;
                scope.formData.priority = ""; */
                scope.formData.sell_to_cust_no = '';
                scope.formData.record = '';
                scope.uiselectHandler.selectedMainModule = selectedModule;
                scope.showLoader = true;
                scope.uiselectHandler.selectedMainModule.getter(scope.uiselectHandler.selectedMainModule.val).then(function (resp) {
                    scope.mainModuleRecords = resp;
                    scope.showLoader = false;
                });
                scope.uiselectHandler.selectedRecord = '';
            }
            // customer popup start
            scope.searchKeyword_cust = {}; 
            scope.getCustomerLeftSide = function (item_paging) {
                if (item_paging){
                    scope.searchKeyword_cust = {};
                }
                scope.postData = {};
                scope.postData.token = scope.$root.token;
                scope.postData.account_type = 1;
                scope.title = 'Customer Listing';
                scope.postData.searchKeyword = scope.searchKeyword_cust;

                    if (scope.postData.pagination_limits == -1) {
                        scope.postData.page = -1;
                        scope.searchKeyword_cust = {};
                        scope.record_data = {};
                    }
                    //angular.element('#customer_modal_lefside').modal('hide');
                    var customerListingApi = scope.$root.sales + "customer/order/customer-popup";

                    scope.showLoader = true;
                    
                    $http
                    .post(customerListingApi, scope.postData)
                    .then(function (res) {
                        scope.customerTableData = res;
                        console.log(scope.customerTableData);
                        if (res.data.ack == true) {            
                    
                            angular.element('#customer_modal_lefside').modal({ show: true });

                            scope.showLoader = false;
                        }
                        else
                        {
                            scope.showLoader = false;
                        }
                    });
            }

            scope.confirmLeftCustomer = function (result) {
                console.log(result);
                scope.formData.sell_to_cust_no = result.customer_code+' - '+result.name;
                scope.formData.record = result.id;
                scope.uiselectHandler.selectedRecord = result;
                angular.element('#customer_modal_lefside').modal('hide');
                
            }
            // customer popup end
            // crm popup start
            scope.searchKeyword_crm = {}; 
            scope.getCrmLeftSide = function (item_paging) {
                if (item_paging){
                    scope.searchKeyword_crm = {};
                }
                scope.postData = {};
                scope.postData.token = scope.$root.token;
                scope.postData.account_type = 2;
                scope.title = 'CRM Listing';
                scope.postData.searchKeyword = scope.searchKeyword_crm;

                if (scope.postData.pagination_limits == -1) {
                    scope.postData.page = -1;
                    scope.searchKeyword_crm = {};
                    scope.record_data = {};
                }
                // angular.element('#crm_modal_lefside').modal('hide');
                var customerListingApi = scope.$root.sales + "customer/order/customer-popup";

                scope.showLoader = true;
                
                $http
                .post(customerListingApi, scope.postData)
                .then(function (res) {
                    scope.customerTableData = res;
                    console.log(scope.customerTableData);
                    if (res.data.ack == true) {            
                
                        angular.element('#crm_modal_lefside').modal({ show: true });

                        scope.showLoader = false;
                    }
                    else
                    {
                        scope.showLoader = false;
                    }
                });
            }

            scope.confirmLeftCrm = function (result) {
                console.log(result);
                scope.formData.sell_to_cust_no = result.customer_code+' - '+result.name;
                scope.formData.record = result.id;
                scope.uiselectHandler.selectedRecord = result;
                angular.element('#crm_modal_lefside').modal('hide');
                
            }
            // crm popup end

            // Retailer CRM popup start searchKeyword_retailer_crm
            scope.searchKeyword_retailer_crm = {};
            scope.getRetailerCrmLeftSide = function (item_paging) {
                if (item_paging) {
                    scope.searchKeyword_retailer_crm = {};
                }
                scope.postData = {};
                scope.postData.token = scope.$root.token;
                scope.postData.account_type = 2;
                scope.title = 'Retailer CRM Listing';
                scope.postData.searchKeyword = scope.searchKeyword_retailer_crm;

                if (scope.postData.pagination_limits == -1) {
                    scope.postData.page = -1;
                    scope.searchKeyword_retailer_crm = {};
                    scope.record_data = {};
                }

                var retailerCrmListingApi = scope.$root.sales + "customer/order/retailer-customer-popup";
                scope.showLoader = true;

                $http
                    .post(retailerCrmListingApi, scope.postData)
                    .then(function (res) {
                        scope.customerTableData = res;
                        console.log(scope.customerTableData);
                        if (res.data.ack == true) {
                            angular.element('#retailer_crm_modal_lefside').modal({ show: true });
                            scope.showLoader = false;
                        }
                        else {
                            scope.showLoader = false;
                        }
                    });
            }

            scope.confirmLeftRetailerCrm = function (result) {
                console.log(result);
                scope.formData.sell_to_cust_no = result.crm_code + ' - ' + result.name;
                scope.formData.record = result.id;
                scope.uiselectHandler.selectedRecord = result;
                angular.element('#retailer_crm_modal_lefside').modal('hide');
            }

            // Retailer CRM popup end

            // supplier popup start
            scope.searchKeywordSupp = {};

            scope.getSupplierLeft = function (item_paging, shipagent, get_supplierCount) {
                if (item_paging) {
                    scope.searchKeywordSupp = {};
                }
                scope.title = 'Supplier Listing';


                scope.columns = [];
                scope.record = {};
                scope.record_invoice = {};
                scope.shipagent = shipagent;
                //sell_to_cust_id 

                //pass in API
                scope.postData = {};
                scope.postData.token = scope.$root.token;
                scope.postData.type = 1;


                scope.postData.searchKeyword = scope.searchKeywordSupp;

                if (scope.postData.pagination_limits == -1) {
                    scope.postData.page = -1;
                    scope.searchKeywordSupp = {};
                    scope.record_data = {};
                }
                // $scope.searchKeyword_sup = {};
                scope.showLoader = true;

                var supplierUrl = scope.$root.pr + "supplier/supplier/supplierListings";

                if (get_supplierCount == undefined) get_supplierCount = $rootScope.maxHttpRepeatCount;
                $http
                    .post(supplierUrl, scope.postData)
                    .then(function (res) {
                        // $scope.columns = [];
                        scope.record = {};
                        scope.showLoader = false;
                        scope.supplierTableData = res;

                        if (res.data.ack == true) {

                            $rootScope.currencyArrPurchase = res.data.currency_arr_local;
                            // $scope.record = res.data.response;
                            angular.element('#supplier_Modal_Left').modal({ show: true });
                        }
                        else
                            toaster.pop('error', 'Error', scope.$root.getErrorMessageByCode(400));

                    }).catch(function (e) {
                        scope.showLoader = false;
                        throw new Error(e.data);
                    });
            }

            scope.confirm_supp_single = function (result) {
                console.log(result);
                scope.formData.sell_to_cust_no = result.code + ' - ' + result.name;
                scope.formData.record = result.id;
                scope.uiselectHandler.selectedRecord = result;
                angular.element('#supplier_Modal_Left').modal('hide');

            }
            // supplier popup end
            // SRM popup start
            scope.searchKeywordSrm = {};

            scope.getSRMLeft = function (item_paging, shipagent, get_supplierCount) {
                if (item_paging) {
                    scope.searchKeywordSrm = {};
                }
                scope.title = 'SRM Listing';


                scope.columns = [];
                scope.record = {};
                scope.record_invoice = {};
                scope.shipagent = shipagent;
                //sell_to_cust_id 

                //pass in API
                scope.postData = {};
                scope.postData.token = scope.$root.token;
                scope.postData.type = 1;


                scope.postData.searchKeyword = scope.searchKeywordSrm;

                if (scope.postData.pagination_limits == -1) {
                    scope.postData.page = -1;
                    scope.searchKeywordSrm = {};
                    scope.record_data = {};
                }
                // $scope.searchKeyword_sup = {};
                scope.showLoader = true;

                var supplierUrl = scope.$root.pr + "srm/srm/listings";

                if (get_supplierCount == undefined) get_supplierCount = $rootScope.maxHttpRepeatCount;
                $http
                    .post(supplierUrl, scope.postData)
                    .then(function (res) {
                        // $scope.columns = [];
                        scope.record = {};
                        scope.showLoader = false;
                        scope.srmTableData = res;

                        if (res.data.ack == true) {

                            $rootScope.currencyArrPurchase = res.data.currency_arr_local;
                            // $scope.record = res.data.response;
                            angular.element('#srm_Modal_Left').modal({ show: true });
                        }
                        else
                            toaster.pop('error', 'Error', scope.$root.getErrorMessageByCode(400));

                    }).catch(function (e) {
                        scope.showLoader = false;
                        throw new Error(e.data);
                    });
            }

            scope.confirm_Srm_single = function (result) {
                console.log(result);
                scope.formData.sell_to_cust_no = result.srm_code + ' - ' + result.name;
                scope.formData.record = result.id;
                scope.uiselectHandler.selectedRecord = result;
                angular.element('#srm_Modal_Left').modal('hide');

            }
            // srm popup end

            // HR popup start
            scope.searchKeywordHr = {};

            scope.getHRLeft = function (item_paging, shipagent, get_supplierCount) {
                if (item_paging){
                    scope.searchKeywordHr = {};
                }
                scope.postData = {};
                scope.postData.token = scope.$root.token;
                scope.postData.account_type = 2;
                scope.title = 'Employee Listing';
                scope.postData.searchKeyword = scope.searchKeywordHr;

                    if (scope.postData.pagination_limits == -1) {
                        scope.postData.page = -1;
                        scope.searchKeywordHr = {};
                        scope.record_data = {};
                    }
                    var customerListingApi = scope.$root.setup + "general/bringEmployeesLeft";

                    scope.showLoader = true;
                    
                    $http
                    .post(customerListingApi, scope.postData)
                    .then(function (res) {
                        scope.hrTableData = res;
                        console.log(scope.customerTableData);
                        if (res.data.ack == true) {            
                    
                            angular.element('#hr_Modal_Left').modal({ show: true });

                            scope.showLoader = false;
                        }
                        else
                        {
                            scope.showLoader = false;
                        }
                    });
            }

            scope.confirm_hr = function (result) {
                console.log(result);
                scope.formData.sell_to_cust_no = result.code + ' - ' + result.name;
                scope.formData.record = result.id;
                scope.uiselectHandler.selectedRecord = result;
                angular.element('#hr_Modal_Left').modal('hide');

            }
            // srm popup end

            scope.updateSubModule = function (selectedModule) {
                scope.uiselectHandler.selectedSubModule = selectedModule;
            }

            scope.updateRecord = function (selectedRecord) {
                scope.uiselectHandler.selectedRecord = selectedRecord;
            }

            scope.updateEmployee = function (selectedEmployee) {
                scope.formData.assign_to = selectedEmployee;
            }

            scope.getEmployees = function () {
                var RecordListingAPI = scope.$root.setup + "general/bringEmployees";
                var postData = {
                    token: scope.$root.token,
                    module: module
                }
                $http
                    .post(RecordListingAPI, postData)
                    .then(function (res) {
                        if (res.data.ack) {
                            scope.allEmployees = res.data.response;
                        }
                        scope.showLoader = false;
                    });
            }
            scope.getEmployees();



            scope.tabArr = [false, false, false, false, false];

            scope.getSelectedTab = function () {
                var obj = {};
                for (var i = 0; i < scope.tabArr.length; i++) {
                    if (scope.tabArr[i] == true) {
                        obj.selectedTabIndex = i;
                        switch (i) {
                            case 0: obj.msg = "all modules"; break;
                            case 1: obj.msg = "one mdule"; break;
                            case 2: obj.msg = "module record"; break;
                            case 3: obj.msg = "tab name"; break;
                            case 4: obj.msg = "tab records"; break;
                        }
                    }
                }
                return obj;
            }

            scope.updateFocused = function (record) {
                scope.focused = record;
                angular.forEach(scope.allEmployees, function (obj) {
                    if (obj.id == scope.focused.assign_to) {
                        scope.focused.assign_to = obj;
                    }
                });
                // if (scope.focused.module && scope.focused.record){
                //     angular.forEach(scope.modules, function (obj) {
                //         if (obj.val == scope.focused.module) {
                //             obj.getter(obj.val).then(function (resp) {
                //                 angular.forEach(resp, function (obj2) {
                //                     if (obj2.id == scope.focused.record){
                //                         scope.focused.linkedRecordName = obj2.name;
                //                     }
                //                 });
                //             })
                //         }
                //     })
                // }

            }

            scope.showCompose = function () {
                scope.formData.recurrenceUnit = 1;
                scope.formData.reminderUnit = 1;
                scope.formData.recurrence = 0;
                scope.formData.reminder = 0;
                scope.formData.priority = "";
                scope.formData.status = 1;
            }

            scope.refreshListing = function () {
                angular.forEach(scope.allRecords, function (obj) {
                    if (obj.status == "3") obj.completed = true;
                    else obj.completed = false;

                    // obj.date = new Date(obj.date.trim().split(""), 11, 17);

                    var reminderSeconds = 0;
                    if (obj.reminder && obj.reminderUnit) {
                        if (obj.reminderUnit == "1") {
                            reminderSeconds = obj.reminder * 60;
                        }
                        else if (obj.reminderUnit == "2") {
                            reminderSeconds = obj.reminder * 60 * 60;
                        }
                        else if (obj.reminderUnit == "3") {
                            reminderSeconds = obj.reminder * 60 * 60 * 24;
                        }
                    }

                    var reminderUnix = parseInt(obj.date) + parseInt(obj.time2seconds) - reminderSeconds;

                    var currentTime = (Date.now() / 1000 | 0);

                    // var tempDate = new Date(Date.UTC(obj.reminderTime * 1000));
                    if ((reminderUnix - currentTime) > 0 && !obj.completed) {
                        obj.condition = "due";
                    }
                    else if (obj.completed) {
                        // old
                        obj.condition = "old";
                    }
                    else if ((reminderUnix - currentTime) < 0 && !obj.completed) {
                        obj.condition = "overdue";
                    }

                    obj.tempDate = new Date(obj.date * 1000);
                    obj.tempDate = obj.tempDate.getDate() + "/" + (parseInt(obj.tempDate.getMonth()) + 1) + "/" + obj.tempDate.getFullYear();
                });
            }

            scope.markCompleted = function (task) {
                if (task.status == 3) {
                    task.status = 2;
                }
                else {
                    task.status = 3;
                }
                var Api = scope.$root.com + "task/markChecked";
                $http
                    .post(Api, { task: task, token: scope.$root.token })
                    .then(function (res) {
                        if (res.data.ack == true) {
                            scope.refreshListing();
                        }
                    });
            }

            scope.bringRecords = function (countOnly) {
                scope.showLoader = true;
                var postData = {};
                postData.token = scope.$root.token;
                var selectedTab = scope.getSelectedTab();
                if (selectedTab.selectedTabIndex == 0) {
                }
                else if (selectedTab.selectedTabIndex == 1) {
                    postData.module_name = moduleTracker.module.name;
                }
                else if (selectedTab.selectedTabIndex == 2) {
                    postData.module_name = moduleTracker.module.name;
                    postData.record_id = moduleTracker.module.record;
                }
                else if (selectedTab.selectedTabIndex == 3) {
                    postData.module_name = moduleTracker.module.name;
                    postData.record_id = moduleTracker.module.record;
                    postData.tab = moduleTracker.module.tab;
                }
                else if (selectedTab.selectedTabIndex == 4 || countOnly) {
                    postData.module_name = moduleTracker.module.name;
                    postData.record_id = moduleTracker.module.record;
                    postData.tab = moduleTracker.module.tab;
                    postData.tab_id = moduleTracker.module.tabId;
                }
                postData.countOnly = countOnly;
                scope.getRecords({ q: postData }).then(function (data) {
                    if(postData.record_id){
                    scope.total = data.total;
                    }
                    if (!countOnly){
                        scope.allRecords = data.response;
                        scope.filteredRecords = scope.allRecords;
                        scope.refreshListing();
                        scope.showLoader = false;
                        scope.focused = scope.allRecords[0];
                    }
                })
            }

            scope.$watch(function () {
                return moduleTracker.buildTasks;
            }, function (newVal, oldVal) {
                    if (newVal && moduleTracker.record) scope.bringRecords(1); moduleTracker.buildTasks = false;
            });

            scope.openModal = function (countOnly) {
                scope.showLoader = true;
                if (moduleTracker.module.name == "") {
                    // no module is selected, show all records
                    scope.selectTab(0);
                }
                if (moduleTracker.module.name) {
                    angular.forEach(scope.modules, function (obj) {
                        if (obj.val == moduleTracker.module.name) {
                            scope.uiselectHandler.selectedMainModule = obj;
                            scope.uiselectHandler.selectedMainModule.getter(scope.uiselectHandler.selectedMainModule.val).then(function (resp) {
                                scope.mainModuleRecords = resp;
                                angular.forEach(scope.mainModuleRecords, function (obj2) {                                    
                                    if (moduleTracker.module.record && obj2.id == moduleTracker.module.record) {
                                        scope.uiselectHandler.selectedRecord = obj2;
                                        scope.formData.sell_to_cust_no = obj2.name;
                                        scope.formData.record = obj2.id;
                                    }
                                });
                                scope.showLoader = false;
                            });
                            return false;
                        }
                    })
                    // only module name is what we know
                    scope.selectTab(1);
                }
                if (moduleTracker.module.record) {
                    // module name + record Id
                    scope.selectTab(2);
                }
                if (moduleTracker.module.tab) {
                    // module name + record Id + tab name
                    scope.selectTab(3);
                }
                if (moduleTracker.module.tabId) {
                    // module name + record Id + tab name + tab Id
                    scope.selectTab(4);
                }
                scope.bringRecords(countOnly);
                // this will open the modal on press of the button..
                if (countOnly == undefined) {
                    angular.element('#sidebar-tasks').modal({
                        show: true
                    });
                }
            };

            scope.clearVars = function () {
                scope.compose = false;
                scope.formData = {};
                scope.uiselectHandler.selectedMainModule = null;
                scope.uiselectHandler.selectedEmployee = null;
                scope.uiselectHandler.selectedRecord = null;
                scope.uiselectHandler.selectedSubModule = null;
                scope.selectedTab = null;
            }

            scope.getRecordNames = function () {
            }

            // scope.addTemplate = function(){
            //     // this will load the template for new record

            // };

            // scope.editTemplate = function(){
            //     // this will load the template for edit record

            // };

            // scope.focusedTemplate = function(){
            //     // this will load the template for focused record

            // };



        }
    }
}]);

