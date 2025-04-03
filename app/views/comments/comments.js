/* commentsController Controller created by Ahmad for Comments Module */
myApp.controller('commentsController', commentsController);

function commentsController($scope, $filter, $http, $state, $resource, toaster, $timeout, $rootScope, $stateParams, Upload, moduleTracker, ngDialog, $sce) {

    $scope.moduleTracker = moduleTracker;
    $scope.bringingAllRecords = moduleTracker.module.record ? false : true;
    $scope.bringingLimitedRecords = !$scope.bringingAllRecords;

    // $scope.$watch("moduleTracker", function (a,b) {
    //     console.log("hello from comments watcher..",a,b);
    //     $scope.getComments(undefined, 1);
    // })

    $scope.$watch(function () {
        return moduleTracker.buildNotes;
    }, function (newVal, oldVal) {
            if (newVal && moduleTracker.record) $scope.getComments(undefined, 1); moduleTracker.buildNotes = false;
    });
    
    $scope.openNotesModal = function () {
        angular.element('#sidebar-notes').modal({
            show: true
        });
        $scope.getComments();
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

    $scope.editThis = function (id) {
        angular.forEach($scope.recod_coments, function (comment) {
            if (comment.id == id) {
                $scope.coment_data = comment;
                $scope.addNote = true;
                $scope.editMode = true;
            }
        })
    }

    $scope.clearNotesVars = function () {
        $scope.addNote = false;
        $scope.editMode = false;
        $scope.selectedNotesModule = "";
        $scope.request_module_name = "";
        if ($scope.allNames) $scope.allNames.length = 0;
        if ($scope.selectedNotesRecord) {
            Object.keys($scope.selectedNotesRecord).forEach(function (prop) {
                delete $scope.selectedNotesRecord[prop];
            });
        }
        // if (!moduleTracker.module.name) {
        //     angular.element('#sidebar-notes').modal("hide");
        // }
        // else {
        //     $scope.getComments();
        // }
        $scope.resetPageAndGetComments($scope.lastAllRecords);
        // $scope.getComments($scope.lastAllRecords);

    }

    $scope.showAddNote = function () {
        $scope.editMode = false;
        if ($scope.addNote){
            $scope.addNote = false;
            $scope.clearNotesVars();
        }
        else {
            $scope.addNote = true;
        }
    }

    $scope.updateNotesRecord = function (val) {
        $scope.selectedNotesRecord = val;
    }

    $scope.selectedNotesModule = "";
    $scope.selectedNotesRecord = {};

    $scope.bringNamesForNotes = function (module) {
        if (module) {
            $scope.selectedNotesModule = module;
        }
        if ($scope.selectedNotesModule == "crm" || $scope.selectedNotesModule == "customer") {
            $scope.module_type = 4;
        }
        else if ($scope.selectedNotesModule == "srm" || $scope.selectedNotesModule == "supplier") {
            $scope.module_type = 3;
        }
        else if ($scope.selectedNotesModule == "hr") {
            $scope.module_type = 1;
        }
        else if ($scope.selectedNotesModule == "items") {
            $scope.module_type = 2;
        }
        else if ($scope.selectedNotesModule == "warehouse") {
            $scope.module_type = 5;
        }else if ($scope.selectedNotesModule == "sales") {
            $scope.module_type = 6;
        }else if ($scope.selectedNotesModule == "credit_note") {
            $scope.module_type = 7;
        }else if ($scope.selectedNotesModule == "debit_note") {
            $scope.module_type = 8;
        }else if ($scope.selectedNotesModule == "purchase") {
            $scope.module_type = 9;
        }

        if ($scope.selectedNotesRecord) {
            Object.keys($scope.selectedNotesRecord).forEach(function (prop) {
                delete $scope.selectedNotesRecord[prop];
            });
        }

        $scope.showLoader = true;

        console.log("Selected Notes Module", $scope.selectedNotesModule);
        $scope.allEmails = [];
        var RecordListingAPI = $rootScope.setup + "general/bringNamesFromModule";
        var postData = {
            token: $rootScope.token,
            module: $scope.selectedNotesModule,
            noRoleAssigned: $rootScope.noRoleAssigned
        }
        $http
            .post(RecordListingAPI, postData)
            .then(function (res) {
                if (res.data.ack) {
                    $scope.allNames = res.data.response;
                    console.log(res.data.response);
                    if (moduleTracker.module.record) {
                        angular.forEach($scope.allNames, function (obj, ind) {
                            if (obj.id == moduleTracker.module.record) {
                                $scope.selectedNotesRecord.id = obj.id;
                                $scope.selectedNotesRecord.name = obj.name;
                            }
                        })
                    }
                    $scope.showLoader = false;
                }
                else
                    $scope.showLoader = false;
            });
    }

    $scope.updateFocusedNote = function (note) {
        $scope.focused = note;
    }


    // assigning permissions module name based
    $scope.getPermissions = function () {
        $scope.addPerm = $rootScope["allowadd" + $scope.commentsData.module_name + "_comments"];
        $scope.editPerm = $rootScope["allowedit" + $scope.commentsData.module_name + "_comments"];
        $scope.viewPerm = $rootScope["allowview" + $scope.commentsData.module_name + "_comments"];
        $scope.deletePerm = $rootScope["allowdelete" + $scope.commentsData.module_name + "_comments"];
    }


    $scope.showEditForm_document_general = function () {
        $scope.check_doc_readonly = false;
    }

    $scope.coment_data = {};
    $scope.coment_data.checkTitle = false;
    $scope.showWordsLimits = function () {
        $scope.wordsLength = $scope.coment_data.description.length;
    }
    $scope.searchKeyword = {};
    $scope.item_paging = {};
    $scope.filterObject = {};

    $scope.resetPageAndGetComments = (lastAllRecords) =>{
        $scope.filterObject.selectedPage = 1;
        $scope.getComments(lastAllRecords);
    }
    $scope.clearFilterAndGetComments = () => {
        $scope.filterObject = {};
        $scope.getComments();
    }
    $scope.getComments = function (all_records, countOnly) {
        $scope.lastAllRecords = all_records;
        $scope.bringingAllRecords = all_records ? true : false;
        $scope.bringingLimitedRecords = !$scope.bringingAllRecords;

        // $scope.getPermissions();
        $scope.coment_data.checkTitle = false;
        $scope.wordsLength = 0;
        $scope.coment_data = {};
        // $scope.$root.breadcrumbs =
        //     [//{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
        //         { 'name': $scope.module, 'url': '#', 'isActive': false },
        //         { 'name': $scope.module_name, 'url': "#", 'isActive': false },
        //         { 'name': $scope.module_code, 'url': '#', 'isActive': false },
        //         { 'name': 'Notes', 'url': '#', 'isActive': false }];
        // $scope.breadcrumbs[3].name = 'Notes';
        $scope.show_coments_list = true;
        $scope.show_coments_form = false;
        $scope.perreadonly = true;
        $scope.coment_data.create_date = $scope.$root.get_current_date();
        var API = $scope.$root.com + "document/comments-listings";

        $scope.request_module_name = moduleTracker.module.name;
        $scope.request_module_record = all_records ? "" : moduleTracker.module.record;

        $scope.request_module_name = $scope.request_module_name;
        // $scope.request_module_name = $scope.request_module_name == "supplier" ? "srm" : $scope.request_module_name;
        var postData = {
            module_name: $scope.request_module_name,
            record_id: $scope.request_module_record,
            token: $rootScope.token,
            countOnly: countOnly,
            searchKeyword: $scope.filterObject
        }

        $scope.formatComment = function(input){
            if (input == undefined){
                return '';
            }
            return $sce.trustAsHtml(input.replace(/(?:\r\n|\r|\n)/g, '<br>'));
        }



        // var postData = {
        //     'token': $scope.$root.token,
        //     'row_id': $scope.commentsData.typeId,
        //     'sub_type': $scope.commentsData.subType,
        //     'page': $scope.item_paging.spage,
        //     //'country_keyword': angular.element('#search_sale_listing_data').val()
        // };
        if (countOnly == undefined)
        $scope.showLoader = true;
        $http
            .post(API, postData)
            .then(function (res) {
                $scope.columns = [];
                $scope.recod_coments = [];
                $scope.focused = {};
                $scope.total = res.data.total ? res.data.total : 0;
                if (res.data.ack == true) {
                    if (countOnly == undefined){
                        if ($scope.total == 0 && $scope.filterObject.selectedPage != 1){
                            $scope.resetPageAndGetComments();
                        }
                        $scope.item_paging.total_pages = res.data.total_pages;
                        $scope.item_paging.cpage = res.data.cpage;
                        $scope.item_paging.ppage = res.data.ppage;
                        $scope.item_paging.npage = res.data.npage;
                        $scope.item_paging.pages = res.data.pages;
                        $scope.total = res.data.total;
                        $scope.recod_coments = res.data.response;
                        $scope.focused = angular.copy($scope.recod_coments[0]);
                        angular.forEach(res.data.response[0], function (val, index) {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });
                    }

                    $scope.showLoader = false;
                }
                else {
                    $scope.showLoader = false; 
                }
            });
    }
    $scope.showLoader = false;
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
        
        $scope.commentsData = coment_data;

        if ($scope.commentsData.subject.length > 100) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(331, ['subject', '100']), null, null, null, 3);
            return;
        }

        if ($scope.commentsData.description.length > 1000) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(331, ['comment', '1000']), null, null, null, 3);
            return;
        }
        
        if (coment_data.id == undefined) {
            
            if ($scope.selectedNotesModule == "crm") {
                $scope.module_type = 4;
                $scope.moduleName = "CRM";
            }
            else if ($scope.selectedNotesModule == "customer") {
                $scope.module_type = 4;
                $scope.moduleName = "Customer";
            }
            else if ($scope.selectedNotesModule == "srm") {
                $scope.module_type = 3;
                $scope.moduleName = "SRM";
            }
            else if ($scope.selectedNotesModule == "supplier") {
                $scope.module_type = 3;
                $scope.moduleName = "Supplier";
            }
            else if ($scope.selectedNotesModule == "hr") {
                $scope.module_type = 1;
                $scope.moduleName = "HR";
            }
            else if ($scope.selectedNotesModule == "items") {
                $scope.module_type = 2;
                $scope.moduleName = "Items";
            }
            else if ($scope.selectedNotesModule == "warehouse") {
                $scope.module_type = 5;
                $scope.moduleName = "Warehouse";
            }else if ($scope.selectedNotesModule == "sales") {
                $scope.module_type = 6;
                $scope.moduleName = "Sales";
            }else if ($scope.selectedNotesModule == "credit_note") {
                $scope.module_type = 7;
                $scope.moduleName = "Credit Note";
            }else if ($scope.selectedNotesModule == "debit_note") {
                $scope.module_type = 8;
                $scope.moduleName = "Debit Note";
        }else if ($scope.selectedNotesModule == "purchase") {
            $scope.module_type = 9;
            $scope.moduleName = "Purchase";
        }

            $scope.coment_data.sub_type = $scope.module_type;
            $scope.coment_data.moduleName = $scope.moduleName;


            //$scope.sub_type = 4;
            $scope.coment_data.row_id = $scope.selectedNotesRecord.id;
            $scope.coment_data.recordName = $scope.selectedNotesRecord.name;
            // $scope.coment_data.module_id = $scope.commentsData.type;
            $scope.coment_data.type = 1;
        }
        // $scope.coment_data.sub_type = $scope.commentsData.subType;
        $scope.coment_data.token = $scope.$root.token;
        //  console.log(coment_data);return;
        var add_comet_url = $scope.$root.com + "document/update-comments";
        $scope.showLoader = true;
        $http
            .post(add_comet_url, $scope.commentsData)
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {
                    toaster.pop('success', res.data.info, res.data.msg);
                    $scope.clearNotesVars();
                    $scope.wordsLength = 0;
                }
                else
                    toaster.pop('error', 'info', res.data.msg);
            });
    }

    $scope.delete_coment = function (id) {
        // var confirmation = confirm("Are you sure you want to delete this note?");
        // if (confirmation){
        //     var delUrl = $scope.$root.com + "document/delete-comments";
        //     $http
        //         .post(delUrl, { id: id, 'token': $scope.$root.token })
        //         .then(function (res) {
        //             if (res.data.ack == true) {
        //                 toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103), null, null, null, 3);
        //                 $scope.showAddNote();
        //             } else {
        //                 toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108), null, null, null, 3);
        //             }
        //             $scope.getComments($scope.lastAllRecords);
        //         });
        // }

        var delUrl = $scope.$root.com + "document/delete-comments";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103), null, null, null, 3);
                        $scope.showAddNote();
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108), null, null, null, 3);
                        $scope.getComments($scope.lastAllRecords);
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    };
    $scope.show_coments_list = true;
    $scope.show_coments_form = false;
    $scope.show_add_comment_form = function () {
        $scope.show_coments_list = false;
        $scope.show_coments_form = true;
        $scope.check_doc_readonly = false;
    }
}