/* Module Email Controller will be responsible to show email listings inside every module */
myApp.controller('moduleEmailController', ["$scope", "$filter", "$http", "$state", "$resource", "toaster", "$timeout", "$rootScope", "$stateParams", "Upload", "moduleTracker", "emailConfig", "fileAuthentication", function ($scope, $filter, $http, $state, $resource, toaster, $timeout, $rootScope, $stateParams, Upload, moduleTracker, emailConfig, fileAuthentication) {

    $scope.downloadFileSecure = function (_filename, _path, _fileType) {
        fileAuthentication.getFile({
            fileName: /[^/]*$/.exec(_path)[0],
            downloadName: _filename+'.'+_fileType
        })
    }
    $scope.user_type = $rootScope.user_type;

    $scope.moduleTracker = moduleTracker;
    $scope.emailLoader = emailConfig.globalVars;

    $scope.bringingAllRecords = moduleTracker.module.record ? false : true;
    $scope.bringingLimitedRecords = !$scope.bringingAllRecords;

    $rootScope.com = 'api/communication/';

    $scope.openEmailModal = function () {
        $scope.moduleEmails = [];
        angular.element('#sidebar-mail').modal({
            show: true
        });
        
        $scope.getVirtualAccounts();
        $scope.getModuleEmails();
    }

    $scope.removeAssociation = function(record){
        if ($scope.focused.association && $scope.focused.association.length == 1){
            return;
        }
        $scope.showLoader = true;
        var removeAssociationAPI = $rootScope.com + "mail/unlinkRecord";
        var postData = {};
        postData.associationType = "email";
        postData.token = $scope.$root.token;
        postData.record = record;
        postData.associationId = $scope.focused.id;

        var $httpPromise = $http
            .post(removeAssociationAPI, postData)
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {
                    angular.forEach($scope.focused.association, function(obj, i){
                        if (obj.assName == record.assName && obj.assId == record.assId && obj.assModule == record.assModule){
                            $scope.focused.association.splice(i, 1);
                        }
                    })
                    if ($scope.focused.association.length) {
                        $scope.focused.receiver_name = $scope.focused.association[0].assName;
                    }
                    else {
                        $scope.focused.receiver_name = "N/A";
                    }
                    toaster.pop('success', 'Info', 'Email Unlinked Successfully.');
                }
                else if (res.data.error == 111) {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(649, ['Email']))
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

    $scope.currentUser = $scope.$root.currentUser;

    $scope.replyThis = function(email){
        $scope.reply = true;
        $scope.genericEmail = true;
        if (email.main_module_name)
        $scope.selectedEmailModule = email.main_module_name.toLowerCase();
        else{
            $scope.selectedEmailModule = "";
        }
        if (email.type == 2){
            $scope.config.to = email.email_address_from.split("(")[1].split(")")[0];
        }
        else{
            $scope.config.to = email.email_address_from;
        }
        $scope.config.cc = email.cc;
        $scope.module_type = email.module_type || 0;
        $scope.parentRecordId = email.account_id || 0;
        
        $scope.config.templateSubject = "RE: " + email.email_subject;
        $scope.config.templateBody = "-----\n" + email.email_body;
        $scope.showComposeEmail();
    }

    $scope.forwardThis = function (email) {
        $scope.forward = true;
        $scope.genericEmail = true;
        // $scope.selectedEmailModule = email.main_module_name.toLowerCase();
        // $scope.bringNames($scope.selectedEmailModule);
        // $scope.selectedRecord = email.account_id;
        $scope.module_type = email.module_type;
        $scope.parentRecordId = email.account_id;
        $scope.config.templateSubject = "FW: " + email.email_subject;
        $scope.config.templateBody = "-----\n" + email.email_body;
        if (email.attachments && email.attachments.length){
            $scope.forwardAttachments = email.attachments;
            // $scope.attachmentFileFinder = email.attachments[0].path.split("/")[email.attachments[0].path.split("/").length - 1].split("_0.")[0];
            $scope.attachmentFileFinder = email.attachments.map(function(obj){
                return obj.id;
            });
            $scope.artificialFiles = [];
            angular.forEach($scope.forwardAttachments, function(obj){
                var path = obj.path.split("/")[obj.path.split("/").length - 1];
                // path = path.split('.').slice(0, -1).join('.');
                path = path.split(".");
                var tempExt = path.pop();
                obj.fileName = path.join(".");
                $scope.artificialFiles.push({name: obj.alias, size: obj.size})
            })
        }
        $scope.showComposeEmail();
    }

    $scope.selectThisBox = function (index, box) {
        $scope.isAll = false;
        if ($scope.moduleEmails)
            $scope.moduleEmails.length = 0;
        if ($scope.inboxEmails)
            $scope.inboxEmails.length = 0;
        $scope.selectedBox.forEach(function (obj) {
            obj.inbox = false;
            obj.outbox = false;
            obj.draft = false;
        });
        $scope.selectedBox[index][box] = true;
        $scope.ifInboxEmails = (box == "inbox") ? true : false;
        $scope.ifDraftEmails = (box == "draft") ? true : false;
        $scope.ifSentEmails = (box == "outbox") ? true: false;
        if (index != 0 && index != 1) {
            $scope.selectedAccount = $scope.virtualAccounts.filter(function (obj2, ind) {
                return ind == index - 2 ? obj2 : '';
            })[0].id;
        }
        else {
            $scope.selectedAccount = index;
        }

    }

    $scope.getVirtualAccounts = function () {

        $scope.ifSentEmails = true;

        $scope.selectedBox = [
            {
                inbox: false,
                outbox: false
            }
        ]

        $scope.isAll = true;
        $scope.selectedBox[1] = {
            inbox: false,
            outbox: true,
            draft: false
        }


        $scope.showLoader = true;
        var accountsAPI = $rootScope.com + "mail/getVirtualAccounts";
        var postData = {};
        postData.token = $scope.$root.token;
        $http
            .post(accountsAPI, postData)
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {
                    $scope.virtualAccounts = res.data.response;
                    for (var i = 0; i < $scope.virtualAccounts.length; i++) {
                        $scope.selectedBox.push({
                            inbox: false,
                            outbox: false,
                            draft: false
                        });
                    }
                }
                $scope.showLoader = false;
                //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });
    }


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

    $scope.clearEmailVars = function (dontFetch) {
        // $scope.config.senderEmail = "";
        $scope.showLoader = false;
        $scope.showAssignto = false;
        if ($scope.config){
            $scope.config.to = "";
            $scope.config.cc = "";
            $scope.config.additionalCC = "";
            $scope.config.additionalTo = "";
            $scope.config.templateSubject = "";
            $scope.config.templateBody = "";

        }
        $scope.fileData = [];
        $scope.to = [];
        $scope.cc = [];
        $scope.composeEmail = false;
        $scope.reply = false;
        $scope.forward = false;
        $scope.genericEmail = false;
        $scope.selectedEmailModule = "";
        $scope.request_module_name = "";
        $scope.forwardAttachments = "";
        $scope.toBeSelectedTo = "";
        $scope.toBeSelectedCC = "";
        $scope.isDraft = "";
        $scope.artificialFiles = [];
        $scope.ifDraftEmails = false;
        $scope.ifSentEmails = false;
        Object.keys($scope.selectedRecord).forEach(function (prop) {
            delete $scope.selectedRecord[prop];
        });
        if ($scope.fileData && $scope.fileData.file) {
            $scope.fileData.file.length = 0;
            $scope.artificialFiles.length = 0;
            $scope.fileData.attachmentFile = null;
        }
        // $scope.selectedRecord = undefined;
        
        angular.element("input[type='file']").val(null);
        if ($scope.allNames) $scope.allNames.length = 0;
        if ($scope.allEmails) $scope.allEmails.length = 0;
        // if (!moduleTracker.module.name) {
        //     angular.element('#sidebar-mail').modal("hide");
        // }
        // else {
        //     $scope.getModuleEmails();
        // }
        if (dontFetch){
            return;
        }
        $scope.focused = {};
        if ($scope.ifDraftEmails){
            $scope.getDraftEmails();
        }
        // else if ($scope.ifInboxEmails){
        //     $scope.getInboxEmails();
        // }
        else{
            $scope.ifSentEmails = true;
            $scope.selectThisBox(1, 'outbox');
            $scope.isAll = true;
            $scope.getModuleEmails(1, null, null, $scope.lastAllRecords);
        }
    }

    $scope.updateDefaultEmail = function () {
        emailConfig.updateDefaultEmail("general", $scope.config.senderEmail.username);
        $scope.config.defaultEmail = $scope.config.senderEmail.username;

    }

    $scope.uploadAttachments = function () {

        $scope.fileData.image_token = $scope.$root.token;
        $scope.fileData.emailAttachment = true;
        $scope.fileData.attachmentFile = $rootScope.userId + "_" + $rootScope.defaultCompany + "_" + Date.now();
        $scope.fileData.recordId = $scope.parentRecordId;
        if ($scope.selectedEmailModule == "crm") {
            $scope.moduleTypeForAttachments = 1;
            $scope.moduleName = "CRM";
        }
        if ($scope.selectedEmailModule == "customer") {
            $scope.moduleTypeForAttachments = 1;
            $scope.moduleName = "Customer";
        }
        else if ($scope.selectedEmailModule == "srm") {
            $scope.moduleTypeForAttachments = 7;
            $scope.moduleName = "SRM";
        }
        else if ($scope.selectedEmailModule == "supplier") {
            $scope.moduleTypeForAttachments = 7;
            $scope.moduleName = "Supplier";
        }
        else if ($scope.selectedEmailModule == "warehouse") {
            $scope.moduleTypeForAttachments = 8;
            $scope.moduleName = "Warehouse";
        }
        else if ($scope.selectedEmailModule == "hr") {
            $scope.moduleTypeForAttachments = 9;
            $scope.moduleName = "HR";
        }
        else{
            $scope.moduleTypeForAttachments = 0;
        }
        $scope.fileData.moduleTypeForAttachments = $scope.moduleTypeForAttachments;
        $scope.fileData.moduleName = $scope.moduleName;
        $scope.fileData.recordName = $scope.selectedRecord.name;


        var fileUploadAPI = $rootScope.setup + "attachments/attachments/uploadFile";

        var attachmentsPromise = Upload.upload({
            url: fileUploadAPI,
            data: $scope.fileData
        })

        return attachmentsPromise;
    }

    $scope.saveAsDraft = function(){
            var genericEmail = true;

        if (($scope.fileData && $scope.fileData.file && $scope.fileData.file.length) || $scope.artificialFiles && $scope.artificialFiles.length){
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(380), null, null, null, 1);
            if ($scope.artificialFiles) $scope.artificialFiles.length = 0;
        }

            $scope.showLoader = true;

        if ($scope.reply) {
            $scope.to = $scope.config.to ? $scope.config.to.split(";") : "";
            $scope.cc = $scope.config.cc ? $scope.config.cc.split(";") : "";
        }
        else {
            if ($scope.config.to) {
                var tempTo = [];
                angular.forEach($scope.config.to, function (obj) {
                    tempTo.push(obj.username);
                })
                $scope.to = tempTo;
            }

            if ($scope.config.cc) {
                var tempCC = [];
                angular.forEach($scope.config.cc, function (obj) {
                    tempCC.push(obj.username);
                })
                $scope.cc = tempCC;
            }
        }

        $scope.config.to = $scope.to;
        $scope.config.cc = $scope.cc;


        $scope.selectedRecord && $scope.selectedRecord.name ? ($scope.recordName = $scope.selectedRecord.name) : ($scope.recordName = "");
        $scope.selectedRecord && $scope.selectedRecord.id ? ($scope.parentRecordId = $scope.selectedRecord.id) : ($scope.parentRecordId = "");            

        emailConfig.saveAsDraft($scope.config.senderEmail, $scope.config.to?$scope.config.to : "", ($scope.config.additionalTo && $scope.config.additionalTo.length) ? $scope.config.additionalTo : "", ($scope.config.cc && $scope.config.cc.length) ? $scope.config.cc : "", ($scope.config.additionalCC && $scope.config.additionalCC.length) ? $scope.config.additionalCC : "", $scope.config.templateSubject, $scope.config.templateBody, ($scope.forward && $scope.artificialFiles && $scope.artificialFiles.length) ? $scope.attachmentFileFinder : "", $scope.parentRecordId ? $scope.parentRecordId : 0, $scope.recordName, $scope.module_type, 9, $scope.moduleName, genericEmail, $scope.isDraft).then(function (resp) {
            if (resp.success) {
                toaster.pop('success', 'Success', 'Draft Saved Successfully', null, null, null, 1);
            }
            else {
                toaster.pop('error', 'Info', resp.message, null, null, null, 1);
            }
            $scope.clearEmailVars();
        });
    }

    $scope.sendEmail = function () {

        if ($scope.selectedRecord && $scope.selectedRecord.name){
            $scope.recordName = $scope.selectedRecord.name;
        }
        else{
            $scope.recordName = "";
        }

        if ($scope.config.templateSubject.length >= 100) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(381), null, null, null, 3);
            return;
        }

        if ($scope.reply){
            $scope.to = $scope.config.to ? $scope.config.to.split(";") : "";
            $scope.cc = $scope.config.cc ? $scope.config.cc.split(";") : "";
        }
        else{
            if ($scope.config.to) {
                var tempTo = [];
                angular.forEach($scope.config.to, function (obj) {
                    tempTo.push(obj.username);
                })
                $scope.to = tempTo;
            }

            if ($scope.config.cc) {
                var tempCC = [];
                angular.forEach($scope.config.cc, function (obj) {
                    tempCC.push(obj.username);
                })
                $scope.cc = tempCC;
            }
        }

        

        if ($scope.config.senderEmail && $scope.config.senderEmail.username && $scope.config && $scope.config.to && $scope.config.templateSubject && $scope.config.templateBody) {
            var genericEmail = true;


            $scope.showLoader = true;

            $scope.selectedRecord && $scope.selectedRecord.name ? ($scope.recordName = $scope.selectedRecord.name) : ($scope.recordName = "");
            $scope.selectedRecord && $scope.selectedRecord.id ? ($scope.parentRecordId = $scope.selectedRecord.id) : ($scope.parentRecordId = "");      



            if ($scope.fileData && $scope.fileData.file && $scope.fileData.file.length) {
                $scope.uploadAttachments().then(function (data, status, headers, config) {
                    // file is uploaded successfully

                    toaster.pop("success", "Info", "File(s) uploaded successfully!", null, null, null, 1);
                    $scope.lastId = data.data.lastId;
                    $scope.uploadedFileIds = data.data.uploadedFiles;

                    emailConfig.sendEmail($scope.config.senderEmail, $scope.to, ($scope.config.additionalTo && $scope.config.additionalTo.length) ? $scope.config.additionalTo : "", ($scope.config.cc && $scope.config.cc.length) ? $scope.cc : "", ($scope.config.additionalCC && $scope.config.additionalCC.length) ? $scope.config.additionalCC : "", $scope.config.templateSubject, $scope.config.templateBody, ($scope.fileData && $scope.fileData.attachmentFile) ? $scope.uploadedFileIds : "", $scope.parentRecordId ? $scope.parentRecordId : 0, $scope.recordName, $scope.module_type, 9, $scope.moduleName, genericEmail, $scope.isDraft).then(function (resp) {
                        if (resp.success) {
                            toaster.pop('success', 'Success', 'Email Sent Successfully', null, null, null, 1);
                        }
                        else {
                            toaster.pop('error', 'Info', resp.message, null, null, null, 1);
                        }
                        $scope.clearEmailVars();
                    });

                });


            }
            else {

                emailConfig.sendEmail($scope.config.senderEmail, $scope.to, ($scope.config.additionalTo && $scope.config.additionalTo.length) ? $scope.config.additionalTo : "", ($scope.config.cc && $scope.config.cc.length) ? $scope.cc : "", ($scope.config.additionalCC && $scope.config.additionalCC.length) ? $scope.config.additionalCC : "", $scope.config.templateSubject, $scope.config.templateBody, ($scope.forward && $scope.artificialFiles && $scope.artificialFiles.length) ? $scope.attachmentFileFinder : "", $scope.parentRecordId ? $scope.parentRecordId : 0, $scope.recordName, $scope.module_type, 9, $scope.moduleName, genericEmail, $scope.isDraft).then(function (resp) {
                    if (resp.success) {
                        toaster.pop('success', 'Success', 'Email Sent Successfully', null, null, null, 1);
                    }
                    else {
                        toaster.pop('error', 'Info', resp.message, null, null, null, 1);
                    }
                    $scope.clearEmailVars();
                });
            }





        }
        else {
            toaster.pop('error', 'Info', 'Please fill the mandatory fields.', null, null, null, 1);
            $scope.showLoader = false;
            return;
        }

        //angular.element('#confirmModal_' + scope.pageName).modal('hide');
    }

    $scope.focused = {};
    $scope.searchKeyword = {};
    $scope.tableData = {};

    emailConfig.getEmailConfig('general').then(function (resp) {
        $scope.config = resp;

        $scope.fromEmails = [];
        $scope.config.senderEmail = { id: 0, username: $scope.$root.currentUser };

    });

    $scope.selectedEmailModule = "";
    $scope.selectedRecord = {};

    $scope.updateEmailRecord = function (val) {
        $scope.selectedRecord = val;
    }

    $scope.toggleShowAssign = function(e, emailId){
        $scope.showAssignto = $scope.showAssignto ? false : true;
        e.stopPropagation();
        if (!$scope.showAssignto) {
            return;
        }
        $scope.showLoader = true;
        var getAssociationAPI = $rootScope.com + "mail/getAssociations";
        var postData = {
            associationType: "email",
            associationId: emailId,
            moduleName: moduleTracker.module.name,
            token: $scope.$root.token
        };

        var $httpPromise = $http
            .post(getAssociationAPI, postData)
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {
                    $scope.focused.association = [];
                    angular.forEach(res.data.response, function (obj) {
                        $scope.focused.association.push(obj);
                    })
                }
                $scope.showLoader = false;

            });
        return $httpPromise;
    }

    $scope.showAssignto = false;

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
            value: "hr",
            name: "HR"
        },
        {
            value: "warehouse",
            name: "Warehouse"
        }
    ]

    $scope.selectedInboxRecord = {};

    $scope.updateInboxRecord = function (){

        if ($scope.inboxEmailModule && $scope.selectedInboxRecord.record && $scope.selectedInboxRecord.record.id){
            $scope.showLoader = true;
            var alreadyExists = false;
            angular.forEach($scope.focused.association, function(obj){
                if (obj.assModule == $scope.inboxModuleName && obj.assId == $scope.selectedInboxRecord.record.id){
                    alreadyExists = true;
                }
            })
            if (alreadyExists){
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(382));
                return;
            }
            var val = $scope.selectedInboxRecord.record;
            var postData = {
                associationType: 'email',
                emailId: $scope.focused.id,
                moduleName: $scope.inboxModuleName,
                moduleType: $scope.module_type,
                recordId: val.id,
                recordName: val.name,
                additional : val.additional,
                token: $rootScope.token
            }

            var unreadStatusUpdateAPI = $rootScope.com + "mail/updateInboxEmailSender";
            var $httpPromise = $http
                .post(unreadStatusUpdateAPI, postData)
                .then(function (res) {
                    $scope.showLoader = false;
                    if (res.data.ack == true) {
                        $scope.focused.main_module_name = $scope.inboxModuleName;
                        $scope.focused.receiver_name = val.name;
                        $scope.focused.account_id = val.id;
                        $scope.focused.module_name = "General";
                        if ($scope.focused.association == undefined){
                            $scope.focused.association = [];
                        }
                        $scope.focused.association.push({assModule: $scope.inboxModuleName, assName: val.name, assId: val.id})
                        toaster.pop('success', 'Info', 'Email Linked');

                    }
                    else {
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(379));
                    }
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

        else{
            return;
        }
        
    }


    $scope.bringNames = function (module) {

        if (module) {
            $scope.selectedEmailModule = module;
        }
        if ($scope.selectedEmailModule == "crm") {
            $scope.module_type = 1;
            $scope.moduleName = "CRM";
        }
        if ($scope.selectedEmailModule == "customer") {
            $scope.module_type = 1;
            $scope.moduleName = "Customer";
        }
        if ($scope.selectedEmailModule == "srm") {
            $scope.module_type = 2;
            $scope.moduleName = "SRM";
        }
        if ($scope.selectedEmailModule == "supplier") {
            $scope.module_type = 2;
            $scope.moduleName = "Supplier";
        }
        else if ($scope.selectedEmailModule == "hr") {
            $scope.module_type = 7;
            $scope.moduleName = "HR";
        }
        else if ($scope.selectedEmailModule == "item") {
            $scope.module_type = 6;
            $scope.moduleName = "Item";
        }
        else if ($scope.selectedEmailModule == "warehouse") {
            $scope.module_type = 8;
            $scope.moduleName = "Warehouse";
        }
        else if ($scope.selectedEmailModule == "sales") {
            $scope.module_type = 9;
            $scope.moduleName = "Sales";
        }
        else if ($scope.selectedEmailModule == "credit_note") {
            $scope.module_type = 10;
            $scope.moduleName = "Credit Note";
        }
        else if ($scope.selectedEmailModule == "purchase") {
            $scope.module_type = 11;
            $scope.moduleName = "Purchase";
        }
        else if ($scope.selectedEmailModule == "debit_note") {
            $scope.module_type = 12;
            $scope.moduleName = "Debit Note";
        }

        if ($scope.selectedEmailModule == undefined || $scope.selectedEmailModule == ''){
            return;
        }

        if ($scope.selectedRecord) {
            Object.keys($scope.selectedRecord).forEach(function (prop) {
                delete $scope.selectedRecord[prop];
            });
            if ($scope.config && $scope.config.to) {
                $scope.config.to.length = 0;
            }
        }

        $scope.showLoader = true;
        $scope.allEmails = [];
        console.log($rootScope.noRoleAssigned);
        var RecordListingAPI = $rootScope.setup + "general/bringNamesFromModule";
        var postData = {
            token: $rootScope.token,
            module: $scope.selectedEmailModule,
            noRoleAssigned: $rootScope.noRoleAssigned
        }
        $http
            .post(RecordListingAPI, postData)
            .then(function (res) {
                if (res.data.ack) {
                    $scope.allNames = res.data.response;
                    if (module && module == moduleTracker.module.name) {
                        if ($scope.forward){
                            $scope.bringEmails($scope.selectedRecord);
                        }
                        else
                        $scope.bringEmails(moduleTracker.module.record);
                    }
                    if ($scope.selectedRecord.constructor === String && $scope.selectedRecord){
                        angular.forEach($scope.allNames, function(obj){
                            if (obj.id == $scope.selectedRecord){
                                $scope.selectedRecord = obj;
                            }
                        });
                        $scope.bringEmails($scope.selectedRecord.id);
                    }
                    $scope.showLoader = false;
                }
                else{
                    toaster.pop("error", "info", "No Records found!", null, null, null, 1);                    
                    $scope.showLoader = false;
                }
                if ($scope.bringingNamesForInbox){
                    $scope.bringingNamesForInbox = false;
                    $scope.selectedEmailModule = "";
                    $scope.inboxModuleName = $scope.moduleName;
                }
            });
    }
    $scope.allEmails = [];
    $scope.bringEmployeeEmailsAddresses = function(){
        var postData = {
            token: $rootScope.token
        }
        var bringEmployeeEmailsAPI = $rootScope.setup + "general/bringEmployeeEmailsAddresses";
        $http
            .post(bringEmployeeEmailsAPI, postData)
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {
                    $scope.employeeEmailAddresses = res.data.response;
                }
                $scope.showLoader = false;
                //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            }).catch(function (message) {
                $scope.showLoader = false;
                // toaster.pop('error', 'info', 'Server is not Acknowledging', null, null, null, 1);
                throw new Error(message.data);
            });
    }();

    $scope.tagTransform = function(tag){
        var id = 99999 + $scope.allEmails.length;
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(tag)) {
            return { id: id, username: tag, type: "New" };
        }
        else {
            return null;
        }
    }
    
    $scope.bringEmails = function (id) {
        if (id == undefined) {
            return;
        }
        else {
            if ($scope.selectedRecord.id == undefined) {
                angular.forEach($scope.allNames, function (obj) {
                    if (obj.id == id) {
                        $scope.selectedRecord = {};
                        $scope.selectedRecord.id = obj.id;
                        $scope.selectedRecord.name = obj.name;
                    }
                })
            }
            if ($scope.config && $scope.config.to) {
                $scope.config.to.length = 0;
            }
        }
        $scope.showLoader = true;
        var EmailsListingAPI = $rootScope.setup + "general/bringEmailsFromModule";
        var postData = {
            token: $rootScope.token,
            module: $scope.selectedEmailModule,
            id: id ? id : ''
        }
        if (id) {
            $http
                .post(EmailsListingAPI, postData)
                .then(function (res) {
                    $scope.allEmails = [];
                    if (res.data.ack) {

                        $scope.parentRecordId = res.data.id;

                        angular.forEach(res.data.Emails, function (obj, index) {
                            $scope.allEmails.push({ id: $scope.allEmails.length, username: obj, type: $scope.moduleName  })
                        });

                        
                        
                    }
                    else {
                        toaster.pop("error", "info", "No email addresses found!", null, null, null, 1);
                        // $scope.selectedRecord = null;
                    }

                    angular.forEach($scope.employeeEmailAddresses, function (obj) {
                        $scope.allEmails.push({ id: $scope.allEmails.length, username: obj.user_email, type: "Employee" })
                    });

                    try{
                        if ($scope.toBeSelectedTo) {
                            $scope.config.to = [];
                            $scope.toBeSelectedTo = $scope.toBeSelectedTo.split(";");
                            angular.forEach($scope.allEmails, function (obj) {
                                angular.forEach($scope.toBeSelectedTo, function (obj2) {
                                    if (obj.username == obj2) {
                                        $scope.config.to.push(obj);
                                    }
                                })
                            });
                        }
                        
                    }
                    catch(error){

                    }
                    try {
                        if ($scope.toBeSelectedCC) {
                            $scope.config.cc = [];
                            $scope.toBeSelectedCC = $scope.toBeSelectedCC.split(";");
                            angular.forEach($scope.allEmails, function (obj) {
                                angular.forEach($scope.toBeSelectedCC, function (obj2) {
                                    if (obj.username == obj2) {
                                        $scope.config.cc.push(obj);
                                    }
                                })
                            });
                        }
                    } catch (error) {
                        
                    }
                    
                    $scope.showLoader = false;
                });
        }

    }


    $scope.getTotalSize = function () {
        if ($scope.forward){
            var totalAttachmentSize = 0;
            if ($scope.artificialFiles && $scope.artificialFiles.length) {
                angular.forEach($scope.artificialFiles, function (file) {
                    totalAttachmentSize += (parseFloat(file.size)) / 1000;
                });
            }
        }
        else{
            var totalAttachmentSize = 0;
            if ($scope.fileData && $scope.fileData.file && $scope.fileData.file.length) {
                angular.forEach($scope.fileData.file, function (file) {
                    totalAttachmentSize += (parseFloat(file.size)) / 1000;
                });
            }
        }
        return totalAttachmentSize.toFixed(2);
    }

    $scope.updateArtificialFiles = function () {
        $scope.artificialFiles = [];
        angular.forEach($scope.fileData.file, function (file) {
            if ($scope.getTotalSize() > 5000) {
                $scope.removeAttachment(null, 1);
            }
            else {
                $scope.artificialFiles.push({ name: file.name, size: file.size });
            }
        })
    }

    $scope.removeAttachment = function (fileName, popLast) {
        if (popLast) {
            $scope.fileData.file.pop();
        }
        angular.forEach($scope.fileData.file, function (file, index) {
            if (file.name == fileName) {
                $scope.fileData.file.splice(index, 1);
            }
        })
        $scope.updateArtificialFiles();
    }


    $scope.onFileSelect = function ($files, $invalidFiles, fileData) {
        
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

        /* if ($invalidFiles.length) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(383), null, null, null, 1);
            angular.element("input[type='file']").val(null);
            return;
        } */
        /* if ($invalidFiles.length) {
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
        } */
        /* 
            type: 1 = CRM, 2 = Customer, 3 = SRM, 4 = Supplier, 5 = Item, 6 = HR
            subtype: 0 = Attachments, 1 = OpportunityCycle
            typeID: CRM_id
            subtypeID: OpportunityCycle_id
         */
        if ($files && $files.length) {

            if (fileData == undefined) {
                if ($scope.fileData != undefined)
                    fileData = $scope.fileData;
                else
                    fileData = {};

                // fileData.type = $scope.type;
                // fileData.subType = $scope.subType;
                // fileData.subTypeId = $scope.subTypeId;
                // fileData.typeId = $scope.typeId;
            }
            else {
                fileData = {};
            }

            /* if ($scope.artificialFiles)
                $scope.artificialFiles.length = 0;
            if ($scope.fileData && $scope.fileData.file){
                $scope.fileData.file.length = 0;
            }*/
            $scope.fileData = fileData; 

            if (fileData.file) {
                angular.forEach($files, function (obj) {
                    var match = false;
                    var exceeding = false;
                    angular.forEach($scope.fileData.file, function (file, index) {
                        if (file.name == obj.name) {
                            match = true;
                        }
                        else {
                            if ((parseFloat($scope.getTotalSize()) + (parseFloat(obj.size) / 1000)) > 5000) {
                                exceeding = true;
                            }
                        }
                    })
                    if (!match && !exceeding && fileData.file.length < 20) {
                        fileData.file.push(obj);
                    }
                    if (exceeding) {

                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(383), null, null, null, 1);
                    }
                    if (match) {

                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(384), null, null, null, 1);
                    }
                    if (fileData.file.length > 20){
                        toaster.pop("error", "info", `There are some issue(s) while uploading the files.<br/>maxFiles`, null, 'trustedHtml', null, 2);
                    }


                })
            }
            else {
                fileData.file = $files;
            }

            $scope.updateArtificialFiles();



            // angular.element('#attachmentUploadModal_' + $scope.fileData.typeId + '_' + $scope.fileData.subTypeId).modal({ show: true });

            // var fileData = {
            //     type: fileData.type,
            //     subType: fileData.subType,
            //     subTypeId: fileData.subTypeId,
            //     typeId: fileData.typeId,
            //     file: $files,
            //     image_token: $scope.$root.token
            // };

        }


    }



    $scope.deleteFile = function (event, id) {

        event.stopPropagation();


        var fileListingAPI = $rootScope.setup + "attachments/attachments/deleteFileById";
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
                        $scope.getFileListing();
                    }
                });

            $scope.showLoader = false;

        });

    }

    $scope.getShortName = function (moduleName) {
        if (!moduleName) return '';
        var splittedName = moduleName.split(" ");
        var returnStr = "";
        for (var i = 0; i < splittedName.length; i++) {
            returnStr += splittedName[i].charAt(0);
        }
        return returnStr;
    }

    $scope.composeEmail = false;
    $scope.localSearch = "";

    $scope.draftCompose = function(focused){
        $scope.showComposeEmail();
        $scope.isDraft = focused.id;
        if (focused.main_module_name){
            if (focused.main_module_name == "CRM") {
                $scope.selectedEmailModule = "crm";
                $scope.moduleTypeForAttachments = 1;
                $scope.moduleName = "CRM";
            }
            else if (focused.main_module_name == "Customer"){
                $scope.selectedEmailModule = "customer";
                $scope.moduleTypeForAttachments = 1;
                $scope.moduleName = "Customer";
            }
            else if (focused.main_module_name == "SRM") {
                $scope.selectedEmailModule = "srm";
                $scope.moduleTypeForAttachments = 7;
                $scope.moduleName = "SRM";
            }
            else if (focused.main_module_name == "Supplier") {
                $scope.selectedEmailModule = "supplier";
                $scope.moduleTypeForAttachments = 7;
                $scope.moduleName = "Supplier";
            }
            else if (focused.main_module_name == "Warehouse") {
                $scope.selectedEmailModule = "warehouse";
                $scope.moduleTypeForAttachments = 8;
                $scope.moduleName = "Warehouse";
            }
            else if (focused.main_module_name == "HR") {
                $scope.selectedEmailModule = "hr";
                $scope.moduleTypeForAttachments = 9;
                $scope.moduleName = "HR";
            }
        }
        if (focused.account_id){
            $scope.selectedRecord = focused.account_id;
        }
        if (focused.email_address_to){
            $scope.toBeSelectedTo = focused.email_address_to;
        }
        if (focused.cc) {
            $scope.toBeSelectedCC = focused.cc;
        }
        if (focused.email_subject){
            $scope.config.templateSubject = focused.email_subject;
        }
        if (focused.email_body) {
            $scope.config.templateBody = focused.email_body;
        }
        $scope.bringNames();
    }

    $scope.showComposeEmail = function () {
        if ($scope.composeEmail)
            $scope.composeEmail = false;
        else {
            $scope.composeEmail = true;
        }
    }
    $scope.updateFocused = function (email) {
        $scope.showAssignto = false;
        $scope.focused = email;
        angular.element('#emailInfoModal').modal();
        // angular.element('#emailInfoModal').modal("hide");
    }

    $scope.searchKeyword = {};


    $scope.downloadPDF = function downloadPDF() {
        var dlnk = document.getElementById('dwnldLnk');
        // if ($scope.focused.email_attachment_data) {
        //     dlnk.href = "data:application/octet-stream;base64," + $scope.focused.email_attachment_data;
        //     dlnk.click();
        // }
        if ($scope.focused.attachments.length) {
            var attachments = $scope.focused.attachments;
            for (var i = 0; i < attachments.length; i++) {
                dlnk.href = attachments[i].path;
                dlnk.download = attachments[i].alias + "." + attachments[i].fileType;
                dlnk.click();
            }
        }
    }


    // this flag will handle All Emails or Current Record's Emails from inside a record..
    $scope.all_records = false;

    $scope.resetTableData = function () {

        if ($scope.tableData.data) {
            // for all properties
            Object.getOwnPropertyNames($scope.tableData.data.response).forEach(function (prop) {
                delete $scope.tableData.data.response[prop];
            });
            Object.getOwnPropertyNames($scope.focused).forEach(function (prop) {
                delete $scope.focused[prop];
            });

        }

    }

    $scope.getAssociatedModuleName = function(email){
        if (email.association == undefined || email.association.length == 0){
            return "";
        }
        if (email.association.length == 1){
            return email.association[0].assModule;
        }
        else{
            return email.association[0].assModule + "...";
        }
    }

    $scope.conditionalUpperCase = function (val, limit) {
        if (val == "N/A") {
            return val;
        }
        if (val){
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

    $scope.unreadStatusUpdate = function(id, val){

        var postData = {
            id: id,
            val: val,
            token: $rootScope.token
        }
        var unreadStatusUpdateAPI = $rootScope.com + "mail/unreadStatusUpdate";
        var $httpPromise = $http
            .post(unreadStatusUpdateAPI, postData)
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {

                }
                $scope.showLoader = false;
                //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            }).catch(function (message) {
                $scope.showLoader = false;
                // toaster.pop('error', 'info', 'Server is not Acknowledging', null, null, null, 1);
                throw new Error(message.data);

            });

            return $httpPromise;

    }

    $scope.focusIt = function (email) {
        $scope.showAssignto = false;
        if (email == undefined){
            return;
        }
        /* if (email.type == 2 && email.unreadStatus == 1) {
            $scope.unreadStatusUpdate(email.id, 0);
        } */
        email.unreadStatus = 0;
        $scope.focused = email;
    }

    // $scope.getHTML = function(){
    //     return $('#summernote_email').summernote('code');
    // }

    $scope.summernoteEmailBodyConfig = {
        callbacks: {
            onImageUpload: function (data) {
                // this will prevent user pasting images inside the email body or drag and drop
                data.pop();
            }
        },
        disableDragAndDrop: true,
        shortcuts: false,
        fontNames: ['Arial', 'Arial Black', 'Courier New'],
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['fontsize', ['fontsize']],
            ['fontname', ['fontname']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']]
        ]
    }

    $scope.getDraftEmails = function (accountId, all_records) {
        $scope.showAssignto = false;
        $scope.focused = {};
        $scope.lastAllRecords = all_records;
        $scope.bringingAllRecords = all_records ? true : false;
        $scope.bringingLimitedRecords = !$scope.bringingAllRecords;



        $scope.request_module_name = moduleTracker.module.name;
        $scope.request_module_record = all_records ? "" : moduleTracker.module.record;

        $scope.request_module_name = $scope.request_module_name;
        // $scope.request_module_name = $scope.request_module_name == "supplier" ? "srm" : $scope.request_module_name;


        var postData = {
            module_name: $scope.request_module_name,
            record_id: $scope.request_module_record,
            token: $rootScope.token,
            selectedAccount: accountId,
            isAll: $scope.isAll
        };

        $scope.showLoader = true;
        $scope.draftEmails = [];
        var emailListingAPI = $rootScope.com + "mail/getDraftEmails";
        $http
            .post(emailListingAPI, postData)
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {
                    $scope.draftEmails = res.data.response;
                    $scope.focused = $scope.draftEmails[0];
                }
                $scope.showLoader = false;
                //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            }).catch(function (message) {
                $scope.showLoader = false;
                // toaster.pop('error', 'info', 'Server is not Acknowledging', null, null, null, 1);
                throw new Error(message.data);

            });

    }

    $scope.getInboxEmails = function (accountId, all_records) {
        $scope.showAssignto = false;
        $scope.focused = {};
        $scope.lastAllRecords = all_records;
        $scope.bringingAllRecords = all_records ? true : false;
        $scope.bringingLimitedRecords = !$scope.bringingAllRecords;
        
        

        $scope.request_module_name = moduleTracker.module.name;
        $scope.request_module_record = all_records ? "" : moduleTracker.module.record;

        $scope.request_module_name = $scope.request_module_name;
        // $scope.request_module_name = $scope.request_module_name == "supplier" ? "srm" : $scope.request_module_name;


        var postData = {
            module_name: $scope.request_module_name,
            record_id: $scope.request_module_record,
            token: $rootScope.token,
            selectedAccount: accountId,
            isAll: $scope.isAll
        };

        $scope.showLoader = true;
        $scope.inboxEmails = [];
        var emailListingAPI = $rootScope.com + "mail/getInboxEmails";
        $http
            .post(emailListingAPI, postData)
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {
                    $scope.inboxEmails = res.data.response;
                    $scope.focused = $scope.inboxEmails[0];
                }
                $scope.showLoader = false;
                //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            }).catch(function (message) {
                $scope.showLoader = false;
                // toaster.pop('error', 'info', 'Server is not Acknowledging', null, null, null, 1);
                throw new Error(message.data);

            });

    }


    $scope.getModuleEmails = function (item_paging, sort_column, sortform, all_records) {
        $scope.showAssignto = false;
        $scope.focused = {};
        $scope.lastAllRecords = all_records;
        $scope.bringingAllRecords = all_records ? true : false;
        $scope.bringingLimitedRecords = !$scope.bringingAllRecords;
        //$scope.getPermissions();
//return;
        // if (!moduleTracker.module.name) {
        //     return;
        // }

        $scope.showLoader = true;
        var emailListingAPI = $rootScope.com + "mail/getModuleEmails";
        $scope.request_module_name = moduleTracker.module.name;
        $scope.request_module_record = all_records ? "" : moduleTracker.module.record;

        $scope.request_module_name = $scope.request_module_name;
        // $scope.request_module_name = $scope.request_module_name == "supplier" ? "srm" : $scope.request_module_name;
        $scope.postData = {
            module_name: $scope.request_module_name,
            record_id: $scope.request_module_record,
            token: $rootScope.token
        }
        $scope.item_paging = {};
        if (item_paging == 1) $scope.item_paging.spage = 1;
        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;

        $scope.postData.searchKeyword = $scope.searchKeyword;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
            $scope.record_data = {};
        }

        $scope.postData.selectedAccount = $scope.selectedAccount;
        $scope.postData.isAll = $scope.isAll;





        $http
            .post(emailListingAPI, $scope.postData)
            .then(function (res) {
                $scope.tableData = [];
                $scope.moduleEmails = [];
                //$scope.moduleEmails = res.data.response;
                angular.forEach(res.data.response, function (value, key) {
                    if (key != "tbl_meta_data") {
                        $scope.moduleEmails.push(value);

                    }
                });
                // $scope.focusIt($scope.moduleEmails[0]);

                // angular.forEach($scope.tableData.data.response.tbl_meta_data.response, function (obj, index) {
                //     if (obj.event && obj.event.length) {
                //         if (typeof eval(obj.event) == "function")
                //             obj.event = eval(obj.event);
                //         else
                //             $scope.tableData.data.response.tbl_meta_data.response.splice(index, 1);
                //     }
                // })
                $scope.showLoader = false;
                $scope.columns = [];
                $scope.record_data = {};
                $scope.focused = {};
                if (res.data.ack == true) {

                    // $scope.focused = $scope.moduleEmails[0];

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

                    angular.forEach($scope.record_data, function (obj) {
                        if (obj.name != undefined)
                            obj.name = obj.name.substring(0, obj.name.indexOf('.'));
                    });
                    $scope.focusIt($scope.moduleEmails[0]);

                }
                //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            }).catch(function (message) {
                $scope.showLoader = false;
                // toaster.pop('error', 'info', 'Server is not Acknowledging', null, null, null, 1);
                throw new Error(message.data);

            });
    }



    // This is called every time the user selects a file

    var tempFiles = [];


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


}]);