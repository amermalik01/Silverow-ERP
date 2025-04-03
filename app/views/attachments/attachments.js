/* fileUploadController Controller created by Ahmad for Attachments Module */
myApp.controller('fileUploadController', fileUploadController);

function fileUploadController($scope, $filter, $http, $state, $resource, toaster, $timeout, $rootScope, $stateParams, Upload, moduleTracker, ngDialog, fileAuthentication) {


    $scope.downloadFileSecure = function(_filename, _path, _fileType){
        fileAuthentication.getFile({
            fileName: /[^/]*$/.exec(_path)[0], 
            downloadName: _filename+'.'+_fileType
        })
    }
    $scope.moduleTracker = moduleTracker;

    $scope.$watch(function () {
        return moduleTracker.buildDocs;
    }, function (newVal, oldVal) {
            if (newVal && moduleTracker.record) $scope.getFileListing(undefined, undefined, undefined, undefined, 1); moduleTracker.buildDocs = false;
    });

    $scope.bringingAllRecords = moduleTracker.module.record ? false : true;
    $scope.bringingLimitedRecords = !$scope.bringingAllRecords;
    $scope.bringingMoreLimitedRecords = moduleTracker.module.tab ? true : false;
    // $scope.emailLoader = emailConfig.globalVars;

    if (moduleTracker.module.name == "crm"){
        $scope.attachmentSubModules = [
            {
                name: "Competitors",
                tab_id: "crm_competetor_module"
            },
            {
                name: "Opportunity Cycles",
                tab_id: "crm_oop_cycle_tab_module"
            }
        ]
    }

    if (moduleTracker.module.name == "customer"){
        $scope.attachmentSubModules = [
            {
                name: "Competitors",
                tab_id: "cust_competetor_tab_module"
            },
            {
                name: "Opportunity Cycles",
                tab_id: "cust_oop_cycle_tab_module"
            },
            {
                name: "Rebate",
                tab_id: "cust_price_tab_module"
            },
            {
                name: "Promotion",
                tab_id: "cust_promotion_tab_module"
            }
        ]
    }

    // $rootScope.com = 'api/communication/';
    // // console.log(moduleTracker.module);
    $scope.openAttachmentModal = function () {
        angular.element('#sidebar-attachment').modal({
            show: true
        });

        $scope.getFileListing();
    }

    $scope.showUploadDocument = function () {
        if ($scope.uploadDocument)
            $scope.uploadDocument = false;
        else {
            $scope.uploadDocument = true;
        }
    }

    $scope.clearAttachmentVars = function () {
        // $scope.config.senderEmail = "";

        // $scope.config.to = "";
        // $scope.config.templateSubject = "";
        // $scope.config.templateBody = "";
        $scope.showAssignto = false;
        $scope.request_module_name = "";
        $scope.uploadDocument = false;
        $scope.selectedAttachmentModule = "";
        angular.element("input[type='file']").val(null);
        if ($scope.selectedAttachmentRecord) {
            Object.keys($scope.selectedAttachmentRecord).forEach(function (prop) {
                delete $scope.selectedAttachmentRecord[prop];
            });
        }

        if ($scope.allNames) $scope.allNames.length = 0;
        // if ($scope.allEmails) $scope.allEmails.length = 0;
        // if (!moduleTracker.module.name) {
        //     angular.element('#sidebar-attachment').modal("hide");
        // }
        // else {
        //     $scope.getFileListing();
        // }
        $scope.getFileListing(1, null, null, $scope.lastAllRecords);
    }

    $scope.selectedAttachmentModule = "";
    $scope.selectedAttachmentRecord = {};

    $scope.updateAttachmentRecord = function (val) {
        $scope.selectedAttachmentRecord = val;
    }

    $scope.updateAttachmentSubModuleRecord = function (val) {
        $scope.selectedAttachmentSubModuleRecord = val;
    }

    $scope.selectedAttachmentSubModule = "";
    $scope.selectedAttachmentSubModuleRecord = "";

    $scope.bringSubModuleNamesForAttachments = function () {
        if ($scope.selectedAttachmentRecord == undefined) return;
        $scope.showLoader = true;
        console.log($scope.selectedAttachmentSubModule);
        var subModuleRetriever = $rootScope.setup + "general/bringNamesFromSubModule";
        var postData = {
            token: $rootScope.token,
            module: $scope.selectedAttachmentModule,
            record: $scope.selectedAttachmentRecord.id,
            subModule: $scope.selectedAttachmentSubModule
        }
        $http
            .post(subModuleRetriever, postData)
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack){
                    if (res.data.response.length == 1 && res.data.response[0].length == 0){
                        toaster.pop("error", "Info", "No records found!", null, null, null, 2);
                        $scope.selectedAttachmentSubModuleRecord = undefined;
                        $scope.selectedAttachmentSubModule = undefined;
                        return;
                    }
                    $scope.subModuleRecordsForAttachments = res.data.response;
                    $scope.selectedAttachmentSubModuleRecord.id = "";
                    $scope.selectedAttachmentSubModuleRecord.name = "";
                }
            });

    }

    $scope.bringNamesForAttachments = function (module) {
        $scope.attachmentSubModules = [];
        if (module) {
            $scope.selectedAttachmentModule = module;
        }
        if ($scope.selectedAttachmentModule == "crm" || $scope.selectedAttachmentModule == "customer") {
            $scope.module_type = 1;
            if ($scope.selectedAttachmentModule == "crm"){
                $scope.moduleName = "CRM";
                $scope.attachmentSubModules = [
                    {
                        name: "Competitors",
                        tab_id: "crm_competetor_module"
                    },
                    {
                        name: "Opportunity Cycles",
                        tab_id: "crm_oop_cycle_tab_module"
                    }
                ]
            }
            else{
                $scope.moduleName = "Customer";
                $scope.attachmentSubModules = [
                    {
                        name: "Competitors",
                        tab_id: "cust_competetor_tab_module"
                    },
                    {
                        name: "Opportunity Cycles",
                        tab_id: "cust_oop_cycle_tab_module"
                    },
                    {
                        name: "Rebate",
                        tab_id: "cust_price_tab_module"
                    },
                    {
                        name: "Promotion",
                        tab_id: "cust_promotion_tab_module"
                    }
                ]
            }
        }
        else if ($scope.selectedAttachmentModule == "srm") {
            $scope.moduleName = "SRM";
            $scope.module_type = 2;
        }
        else if ($scope.selectedAttachmentModule == "supplier") {
            $scope.moduleName = "Supplier";
            $scope.module_type = 2;
        }
        else if ($scope.selectedAttachmentModule == "hr") {
            $scope.moduleName = "HR";
            $scope.module_type = 9;
        }
        else if ($scope.selectedAttachmentModule == "items") {
            $scope.moduleName = "Items";
            $scope.module_type = 8;
        }
        else if ($scope.selectedAttachmentModule == "warehouse") {
            $scope.module_type = 10;
            $scope.moduleName = "Warehouse";
        }
        else if ($scope.selectedAttachmentModule == "sales") {
            $scope.module_type = 11;
            $scope.moduleName = "Sales";
        }
        else if ($scope.selectedAttachmentModule == "credit_note") {
            $scope.module_type = 12;
            $scope.moduleName = "Credit Note";
        }
        else if ($scope.selectedAttachmentModule == "purchase") {
            $scope.module_type = 13;
            $scope.moduleName = "Purchase";
        }
        else if ($scope.selectedAttachmentModule == "debit_note") {
            $scope.module_type = 14;
            $scope.moduleName = "Debit Note";
        }

        if ($scope.selectedAttachmentRecord) {
            angular.element("input[type='file']").val(null);
            Object.keys($scope.selectedAttachmentRecord).forEach(function (prop) {
                delete $scope.selectedAttachmentRecord[prop];
            });
        }

        $scope.showLoader = true;
        $scope.allEmails = [];
        $scope.allNames  = [];

        var RecordListingAPI = $rootScope.setup + "general/bringNamesFromModule";
        var postData = {
            token: $rootScope.token,
            module: $scope.selectedAttachmentModule,
            noRoleAssigned: $rootScope.noRoleAssigned
        }
        $http
            .post(RecordListingAPI, postData)
            .then(function (res) {
                if (res.data.ack) {
                    $scope.allNames = res.data.response;
                    if (moduleTracker.module.record) {
                        angular.forEach($scope.allNames, function (obj, ind) {
                            if (obj.id == moduleTracker.module.record) {
                                $scope.selectedAttachmentRecord.id = obj.id;
                                $scope.selectedAttachmentRecord.name = obj.name;
                            }
                        })
                    }
                    $scope.showLoader = false;
                }
                else
                $scope.showLoader = false;
            });
    }
    // $scope.allEmails = [];
    // $scope.bringEmails = function (id) {
    //     if (id == undefined){
    //         return;
    //     }
    //     else{
    //         angular.forEach($scope.allNames, function(obj){
    //             if (obj.id == id){
    //                 $scope.selectedRecord = obj;
    //             }
    //         })
    //     }
    //     $scope.showLoader = true;
    //     var EmailsListingAPI = $rootScope.setup + "general/bringEmailsFromModule";
    //     var postData = {
    //         token: $rootScope.token,
    //         module: $scope.selectedAttachmentModule,
    //         id: id ? id : ''
    //     }
    //     $http
    //         .post(EmailsListingAPI, postData)
    //         .then(function (res) {
    //             $scope.allEmails = [];
    //             if (res.data.ack) {

    //                 $scope.parentRecordId = res.data.id;

    //                 angular.forEach(res.data.Emails, function (obj, index) {
    //                     $scope.allEmails.push({ id: index + 1, email: obj })
    //                 })
    //             }
    //             $scope.showLoader = false;
    //         });
    // }

    $scope.getPermissions = function () {
        if ($scope.attachmentsData == undefined) {
            $scope.addPerm = true;
            $scope.editPerm = true;
            $scope.viewPerm = true;
            $scope.deletePerm = true;
        }
        else {
            $scope.addPerm = $rootScope["allowadd" + $scope.attachmentsData.module_name + "_attachments"];
            $scope.editPerm = $rootScope["allowedit" + $scope.attachmentsData.module_name + "_attachments"];
            $scope.viewPerm = $rootScope["allowview" + $scope.attachmentsData.module_name + "_attachments"];
            $scope.deletePerm = $rootScope["allowdelete" + $scope.attachmentsData.module_name + "_attachments"];
        }
    }

    $scope.focused = {};
    $scope.searchKeyword = {};
    $scope.tableData = {};

    $scope.removeFocused = function () {
        $scope.focused = {};
    }



    $scope.deleteFile = function (event, id) {

        event.stopPropagation();


        var fileListingAPI = $rootScope.setup + "attachments/attachments/deleteFileById";
        $scope.postData = {
            token: $rootScope.token,
            id: id
        }

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $scope.showLoader = true;
            $http
                .post(fileListingAPI, $scope.postData)
                .then(function (res) {
                    if (res.data.ack) {
                        toaster.pop('success','Info', 'Document Deleted Successfully', null, null, null, 2);
                        $scope.getFileListing();
                    }
                    else if (res.data.error == "Document in use"){
                        toaster.pop('error','Error', 'Document in use', null, null, null, 2);
                    }
                    else{
                        toaster.pop('error','Error', 'Something went wrong', null, null, null, 2);

                    }
                    $scope.showLoader = false;
                });


        });

    }

    $scope.updateFocusedAttachment = function (file) {
        $scope.inboxEmailModule = "";
        $scope.focused = file;
    }



    $scope.getFileListing = function (item_paging, sort_column, sortform, all_records, countOnly) {
        // $scope.getPermissions();
        //all_records == 1 ? All Records, all_records == 2 ? Current Record, all_records == 3 ? Current Tab
        // switch (all_records){
        //     case 1: $scope.bringingAllRecords = true; $scope.bringingLimitedRecords = false; $scope.
        // }
        $scope.lastAllRecords = all_records;
        // $scope.bringingAllRecords = all_records ? true : false;
        // $scope.bringingLimitedRecords = !$scope.bringingAllRecords;
        // $scope.bringingMoreLimitedRecords = moduleTracker.module.tab ? true : false;


        var fileListingAPI = $rootScope.setup + "attachments/attachments/getFileListing";
        $scope.request_module_name = moduleTracker.module.name;
        $scope.request_module_tab = moduleTracker.module.tab;
        $scope.request_module_record = moduleTracker.module.record;

        // $scope.request_module_name = $scope.request_module_name;
        // $scope.request_module_tab = $scope.request_module_tab;
        // $scope.request_module_name = $scope.request_module_name == "supplier" ? "srm" : $scope.request_module_name;
        if (all_records == undefined){
            if (moduleTracker.module.tabId){
                $scope.bringingMoreLimitedRecords = true;
            }
            if (moduleTracker.module.record){
                $scope.bringingLimitedRecords = true;
            }
            if (moduleTracker.module.name == ""){
                $scope.bringingAllRecords = true;
            }
            
            $scope.postData = {
                module_name: $scope.request_module_name,
                record_id: $scope.request_module_record,
                sub_type: $scope.request_module_tab,
                token: $rootScope.token,
                sub_type_id: moduleTracker.module.tabId
            }
        }
        else if (all_records == 1){
            $scope.bringingMoreLimitedRecords = true;
            $scope.bringingLimitedRecords = true;
            $scope.bringingAllRecords = false;
            $scope.postData = {
                module_name: $scope.request_module_name,
                record_id: $scope.request_module_record,
                sub_type: $scope.request_module_tab,
                token: $rootScope.token,
                sub_type_id: moduleTracker.module.tabId
            }
        }
        else if (all_records == 2){
            $scope.bringingMoreLimitedRecords = false;
            $scope.bringingLimitedRecords = true;
            $scope.bringingAllRecords = false;
            $scope.postData = {
                module_name: $scope.request_module_name,
                record_id: $scope.request_module_record,
                token: $rootScope.token
            }
        }
        else if (all_records == 3){
            $scope.bringingMoreLimitedRecords = false;
            $scope.bringingLimitedRecords = false;
            $scope.bringingAllRecords = true;
            $scope.postData = {
                module_name: $scope.request_module_name,
                token: $rootScope.token
            }
        }
        $scope.postData.countOnly = countOnly;
        $scope.postData.additional = moduleTracker.module.additional;
        // $scope.postData = {
        //     module_name: $scope.request_module_name,
        //     record_id: $scope.request_module_record,
        //     tab: $scope.request_module_tab,
        //     token: $rootScope.token
        // }

        $scope.item_paging = {};
        if (item_paging == 1) $scope.item_paging.spage = 1;
        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;

        $scope.postData.searchKeyword = $scope.searchKeyword;
        // $scope.postData.deprtments = $scope.searchKeyword.deprtment !== undefined ? $scope.searchKeyword.deprtment.id : 0;
        // $scope.postData.emp_types = $scope.searchKeyword.emp_type !== undefined ? $scope.searchKeyword.emp_type.id : 0;
        // $scope.postData.filter_status = $scope.searchKeyword.status !== undefined ? $scope.searchKeyword.status.id : "";
        // $scope.postData.job_titles = $scope.searchKeyword.job_title !== undefined ? $scope.searchKeyword.job_title.id : 0;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
            $scope.record_data = {};
        }

        // $scope.fileData = {
        //     type: $scope.type,
        //     typeId: $scope.typeId,
        //     subType: $scope.subType,
        //     subTypeId: $scope.subTypeId
        // }




        $scope.postData.fileData = $scope.fileData;

        if (countOnly == undefined)
            $scope.showLoader = true;
        $http
            .post(fileListingAPI, $scope.postData)
            .then(function (res) {
                $scope.tableData = res;
                $scope.moduleAttachments = [];
                //$scope.moduleEmails = res.data.response;
                angular.forEach(res.data.response, function (value, key) {
                    if (key != "tbl_meta_data") {
                        $scope.moduleAttachments.push(value);

                    }
                });
                // console.log($scope.tableData);
                // angular.forEach($scope.tableData.data.response.tbl_meta_data.response, function (obj, index) {
                //     if (obj.event != undefined && obj.event.delete != undefined) {
                //         if (typeof eval(obj.event.delete) == "function")
                //             obj.event.delete = eval(obj.event.delete);
                //         else
                //             $scope.tableData.data.response.tbl_meta_data.response.splice(index, 1);
                //     }
                //     if (obj.event != undefined && obj.event.edit != undefined) {
                //         if (typeof eval(obj.event.edit) == "function")
                //             obj.event.edit = eval(obj.event.edit);
                //         else
                //             $scope.tableData.data.response.tbl_meta_data.response.splice(index, 1);
                //     }
                // })
                $scope.showLoader = false;
                $scope.columns = [];
                $scope.record_data = {};
                $scope.focused = {};
                $scope.total = res.data.total;
                if (res.data.ack == true) {
                    if (countOnly == undefined) {
                        $scope.item_paging.total_pages = res.data.total_pages;
                        $scope.item_paging.cpage = res.data.cpage;
                        $scope.item_paging.ppage = res.data.ppage;
                        $scope.item_paging.npage = res.data.npage;
                        $scope.item_paging.pages = res.data.pages;

                        $scope.total_paging_record = res.data.total_paging_record;

                        $scope.record_data = res.data.response;
                        $scope.focused = angular.copy($scope.record_data[0]);

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
                    

                    // angular.forEach($scope.record_data, function (obj) {
                    //     if (obj.name != undefined)
                    //         obj.name = obj.name.substring(0, obj.name.indexOf('.'));
                    // });
                }
                //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            }).catch(function (message) {
                $scope.showLoader = false;
                
                throw new Error(message.data);
                console.log(message.data);
            });
    }


    // This is called every time the user selects a file

    var tempFiles = [];

    $scope.toggleShowAssign = function (e, documentId) {
        $scope.showAssignto = $scope.showAssignto ? false : true;
        e.stopPropagation();
        if (!$scope.showAssignto){
            return;
        }
        $scope.showLoader = true;
        var getAssociationAPI = $rootScope.com + "mail/getAssociations";
        var postData = {
            associationType: "document",
            associationId: documentId,
            moduleName: moduleTracker.module.name,
            token: $scope.$root.token
        };

        var $httpPromise = $http
            .post(getAssociationAPI, postData)
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {
                    $scope.focused.association = [];
                    angular.forEach(res.data.response, function(obj){
                        $scope.focused.association.push(obj);
                    })
                }
                $scope.showLoader = false;

            });
            return $httpPromise;

    }

    $scope.removeAssociation = function (record) {
        if ($scope.focused.association && $scope.focused.association.length == 1) {
            return;
        }
        $scope.showLoader = true;
        var removeAssociationAPI = $rootScope.com + "mail/unlinkRecord";
        var postData = {};
        postData.associationType = "document";
        postData.token = $scope.$root.token;
        postData.record = record;
        postData.associationId = $scope.focused.id;

        var $httpPromise = $http
            .post(removeAssociationAPI, postData)
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {
                    angular.forEach($scope.focused.association, function (obj, i) {
                        if (obj.assName == record.assName && obj.assId == record.assId && obj.assModule == record.assModule) {
                            $scope.focused.association.splice(i, 1);
                        }
                    })
                    if ($scope.focused.association.length){
                        $scope.focused.receiver_name = $scope.focused.association[0].assName;
                    }
                    else{
                        $scope.focused.receiver_name = "N/A";
                    }
                    toaster.pop('success', 'Info', 'Document Unlinked Successfully');
                }
                else if (res.data.error == 111){
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(649, ['Document']))
                }
                else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(379));
                }
                //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            }).catch(function (message) {
                $scope.showLoader = false;
                // toaster.pop('error', 'info', 'Server is not Acknowledging', null, null, null, 1);
                throw new Error(message.data);
            });

        return $httpPromise;
    }

    $scope.associationModules = [
        {
            value: "crm",
            name: "CRM"
        },
        {
            value: "customer",
            name: "Customer"
        },
        {
            value: "sales",
            name: "Sales"
        },
        {
            value: "credit_note",
            name: "Credit Note"
        },
        {
            value: "srm",
            name: "SRM"
        },
        {
            value: "supplier",
            name: "Supplier"
        },
        {
            value: "purchase",
            name: "Purchase"
        },
        {
            value: "debit_note",
            name: "Debit Note"
        },
        {
            value: "items",
            name: "Items"
        },
        {
            value: "hr",
            name: "HR"
        },
        {
            value: "warehouse",
            name: "Warehouse"
        }
    ]


    $scope.selectedInboxRecord = {};
    $scope.updateInboxRecord = function () {

        if ($scope.inboxEmailModule && $scope.selectedInboxRecord.record && $scope.selectedInboxRecord.record.id) {
            $scope.showLoader = true;
            var alreadyExists = false;
            angular.forEach($scope.focused.association, function (obj) {
                if (obj.assModule == $scope.moduleName && obj.assId == $scope.selectedInboxRecord.record.id) {
                    alreadyExists = true;
                }
            })
            if (alreadyExists) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(382));
                $scope.moduleName = "";
                $scope.inboxEmailModule = "";
                $scope.inboxModuleName = "";
                $scope.module_type = "";
                $scope.selectedInboxRecord.record = "";
                $scope.editModule = 0;


                return;
            }
            var val = $scope.selectedInboxRecord.record;
            var postData = {
                associationType: 'document',
                emailId: $scope.focused.id,
                moduleName: $scope.moduleName,
                moduleType: $scope.module_type,
                recordId: val.id,
                recordName: val.name,
                additional : val.additional,
                token: $rootScope.token
            }
            console.log(postData);

            var unreadStatusUpdateAPI = $rootScope.com + "mail/updateInboxEmailSender";
            var $httpPromise = $http
                .post(unreadStatusUpdateAPI, postData)
                .then(function (res) {
                    $scope.showLoader = false;
                    if (res.data.ack == true) {
                        $scope.focused.main_module_name = $scope.moduleName;
                        $scope.focused.receiver_name = val.name;
                        $scope.focused.account_id = val.id;
                        $scope.focused.module_name = "General";
                        if ($scope.focused.association == undefined) {
                            $scope.focused.association = [];
                        }
                        $scope.focused.association.push({ assModule: $scope.moduleName, assName: val.name, assId: val.id })
                        toaster.pop('success', 'Info', 'Document Linked Successfully');

                    }
                    else {
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(379));
                    }
                    $scope.moduleName = "";
                    $scope.inboxEmailModule = "";
                    $scope.inboxModuleName = "";
                    $scope.module_type = "";
                    $scope.selectedInboxRecord.record = "";
                    $scope.editModule = 0;
                    //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }).catch(function (message) {
                    $scope.showLoader = false;
                    // toaster.pop('error', 'info', 'Server is not Acknowledging', null, null, null, 1);
                    throw new Error(message.data);
                });

            return $httpPromise;
        }

        else {
            return;
        }

    }

    $scope.getAssociatedModuleName = function (email) {
        if (email.association == undefined || email.association.length == 0) {
            return "";
        }
        if (email.association.length == 1) {
            return email.association[0].assModule;
        }
        else {
            return email.association[0].assModule + "...";
        }
    }

    $scope.conditionalUpperCase = function (val, limit) {
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


    $scope.saveChanges = function () {
        var fileDataUpdateAPI = $rootScope.setup + "attachments/attachments/updateFile";
        var postData = {};
        postData.currentFile = $scope.currentFile;
        postData.lastId = $scope.lastId;
        postData.token = $scope.$root.token;

        $http
            .post(fileDataUpdateAPI, postData)
            .then(function (res) {
                if (res.data.ack) {
                    angular.element('#attachmentUploadModal_' + $scope.fileData.typeId + '_' + $scope.fileData.subTypeId).modal("hide");
                    $scope.getFileListing();
                }
            });

    }

    var fileUploadAPI = $rootScope.setup + "attachments/attachments/uploadFile";


    $scope.onFileSelectFromOutside = function ($files, $invalidFiles, fileData) {

        // console.log($scope.selectedAttachmentSubModuleRecord);return;
        if ($invalidFiles.length) {
            let resultErrors = [];
            const map = new Map();
            for (const item of $invalidFiles) {
                if(!map.has(item.$error)){
                    map.set(item.$error, true);    // set any value to Map
                    resultErrors.push(item.$error);
                }
            }
            console.log(resultErrors)
            resultErrors = resultErrors.join("<br/>");
            // var sizeCheck = false;
            // angular.forEach($invalidFiles, function (file) {
            //     if (!sizeCheck && parseFloat(file.size) / 1000 > 5000) {
            //         sizeCheck = true;
            //     }
            // })
            // if (sizeCheck) {
            toaster.pop("error", "info", `There are some issue(s) while uploading the files.<br/>${resultErrors}`, null, 'trustedHtml', null, 2);
            // }
            angular.element("input[type='file']").val(null);
            return;
        }

        $scope.showLoader = true;
        console.log($files, $invalidFiles, fileData);



        if ($scope.selectedAttachmentModule == "crm") {
            $scope.module_type = 1;
            $scope.moduleName = "CRM";
        }
        if ($scope.selectedAttachmentModule == "customer") {
            $scope.module_type = 1;
            $scope.moduleName = "Customer";
        }
        else if ($scope.selectedAttachmentModule == "srm") {
            $scope.module_type = 7;
            $scope.moduleName = "SRM";
        }
        else if ($scope.selectedAttachmentModule == "supplier") {
            $scope.module_type = 7;
            $scope.moduleName = "Supplier";
        }
        else if ($scope.selectedAttachmentModule == "items") {
            $scope.module_type = 8;
            $scope.moduleName = "Items";
        }
        else if ($scope.selectedAttachmentModule == "hr") {
            $scope.module_type = 9;
            $scope.moduleName = "HR";
        }
        else if ($scope.selectedAttachmentModule == "warehouse") {
            $scope.module_type = 10;
            $scope.moduleName = "Warehouse";
        }
        else if ($scope.selectedAttachmentModule == "sales") {
            $scope.module_type = 11;
            $scope.moduleName = "Sales";
        }
        else if ($scope.selectedAttachmentModule == "credit_note") {
            $scope.module_type = 12;
            $scope.moduleName = "Credit Note";
        }
        else if ($scope.selectedAttachmentModule == "purchase") {
            $scope.module_type = 13;
            $scope.moduleName = "Purchase";
        }
        else if ($scope.selectedAttachmentModule == "debit_note") {
            $scope.module_type = 14;
            $scope.moduleName = "Debit Note";
        }

        $scope.tabRecordId = 0;

        if ($scope.lastAllRecords == undefined && $scope.selectedAttachmentSubModuleRecord && $scope.selectedAttachmentSubModuleRecord.id){
            $scope.uploadTab = $scope.selectedAttachmentSubModule.tab_id;
            $scope.tabRecordId = $scope.selectedAttachmentSubModuleRecord.id;
        }
        else if ($scope.lastAllRecords == 1 && $scope.selectedAttachmentSubModuleRecord && $scope.selectedAttachmentSubModuleRecord.id){
            $scope.uploadTab = $scope.selectedAttachmentSubModule.tab_id;
            $scope.tabRecordId = $scope.selectedAttachmentSubModuleRecord.id;
        }
        else if ($scope.lastAllRecords == 2){
            $scope.uploadTab = "";
        }
        else if ($scope.lastAllRecords == 3){
            $scope.uploadTab = "";
        }


        var fileData = {
            subType: $scope.uploadTab,
            subTypeId: $scope.tabRecordId,
            type: $scope.module_type,
            moduleName: $scope.moduleName,
            typeId: $scope.selectedAttachmentRecord.id,
            recordName: $scope.selectedAttachmentRecord.name
        }
        // fileData.additional = moduleTracker.module.additional;
        if (moduleTracker.module.additional)
            fileData.additional = moduleTracker.module.additional;
        else
            fileData.additional = $scope.selectedAttachmentRecord.additional;

        if ($files) {
            $scope.currentFile = {};
            $scope.currentFile.name = $files[0].name;
            $scope.currentFile.size = $files[0].size;
            $scope.currentFile.type = $files[0].type;
            $scope.currentFile.desc = "";
            var fileType = $scope.currentFile.name.split(".");
            $scope.currentFile.ext = "app/img/filetype/" + fileType.pop() + ".svg";
            console.log($scope.currentFile);

            // if (fileData == undefined) {
            //     if ($scope.fileData != undefined)
            //         fileData = $scope.fileData;
            //     else
            //         fileData = {};

            // }
            // else {
            //     fileData = {};
            // }

            fileData.file = $files;
            fileData.image_token = $scope.$root.token;

            // angular.element('#attachmentUploadModal_' + $scope.fileData.typeId + '_' + $scope.fileData.subTypeId).modal({ show: true });

            Upload.upload({
                url: fileUploadAPI,
                data: fileData
            }).progress(function (e) {
                $scope.progress = parseFloat(e.loaded) / parseFloat(e.total) * 100;
            }).then(function (res, status, headers, config) {
                // file is uploaded successfully
                $scope.lastId = res.data.lastId;
                if (res.data.failedFiles.length){
                    toaster.pop({
                        type: "warning",
                        title: "Info",
                        body: "Some files couldn't be uploaded. <br/>" + res.data.failedFiles.join(", "),
                        timeout: 0,
                        bodyOutputType: 'trustedHtml',
                        tapToDismiss: false
                    });
                }
                toaster.pop("success", "Info", "File(s) uploaded successfully!", null, null, null, 2);
                // $scope.getFileListing(1);
                $scope.showLoader = false;
                $scope.uploadDocument = false;
                $scope.clearAttachmentVars();

            });
        }



    }
}