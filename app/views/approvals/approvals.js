ApprovalsController.$inject = ["$rootScope", "$scope", "$stateParams", "$state", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
        .state('app.pending-approvals', {
            url: '/pending_approvals',
            title: 'Awaiting Approvals',
            templateUrl: helper.basepath('approvals/approvals.html'),
            resolve: helper.resolveFor('ngTable', 'ngDialog'),
            controller: 'ApprovalsController'
        })
        .state('app.awaiting-approvals', {
            url: '/queued_approvals',
            title: 'Queued Approvals',
            templateUrl: helper.basepath('approvals/awaiting_approvals.html'),
            resolve: helper.resolveFor('ngTable', 'ngDialog'),
            controller: 'ApprovalsController'
        })
            
    }
]);

myApp.controller('ApprovalsController', ApprovalsController);

function ApprovalsController($rootScope, $scope, $stateParams, $state, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
    'use strict';

    // console.log($stateParams);
    
    $scope.searchKeyword = {};
    $scope.selectedRecords = [];

    $scope.searchKeyword_awaiting = {};
    $scope.selectedRecords_awaiting = [];

    $scope.getPendingApprovals = function (item_paging) {
        
        // if (item_paging == undefined)
        {
            // $scope.searchKeyword = {};
            $scope.selectedRecords = [];
        }

        var Api = $scope.$root.setup + "general/get-pending-approvals";
        $scope.showLoader = true;

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;

        $scope.postData.searchKeyword = $scope.searchKeyword;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
            $scope.record_data = {};
        }



        $http
            .post(Api, $scope.postData)
            .then(function (res) {
                // console.log('el');
                $scope.tableData = res;
                $scope.showLoader = false;
                $scope.columns = [];
                $scope.recordArray = [];
                $scope.record = {};
                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;


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

                    
                    angular.forEach($scope.tableData.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    });
                }
                else
                    $scope.total = 0;
            });
    }

    $scope.getAwaitingApprovals = function (item_paging) {
        
        // if (item_paging == undefined)
        {
            // $scope.searchKeyword_awaiting = {};
            $scope.selectedRecords_awaiting = [];
        }

        var Api = $scope.$root.setup + "general/get-awaiting-approvals";
        $scope.showLoader = true;

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;

        $scope.postData.searchKeyword = $scope.searchKeyword_awaiting;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword_awaiting = {};
            $scope.record_data = {};
        }

        $http
            .post(Api, $scope.postData)
            .then(function (res) {
                // console.log('el');
                $scope.tableData = res;
                $scope.showLoader = false;
                $scope.columns = [];
                $scope.recordArray = [];
                $scope.record = {};
                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;


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

                    angular.forEach($scope.tableData.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    });
                }
                else
                    $scope.total = 0;
            });
    }

    if ($state.current.name.match("app.pending-approvals")) {
        $scope.breadcrumbs = [{'name': 'Awaiting Approvals', 'url': '#', 'isActive': false}];
        $scope.getPendingApprovals();
        $scope.list_type = 1; 
    }
    else if ($state.current.name.match("app.awaiting-approvals")) {
        $scope.breadcrumbs = [{'name': 'Queued Approvals', 'url': '#', 'isActive': false}];
        $scope.getAwaitingApprovals();
        $scope.list_type = 2;
    }


    $scope.BulkApprove = function (status)
    {
        // type=> 2-> Approve, 3-> Disapprove

        if($scope.selectedRecords.length > 0)
        {
            $rootScope.approval_type = (status == 2) ? 'Approve' : 'Disapprove';
            $rootScope.approval_typed = (status == 2) ? 'Approved' : 'Disapproved';
            $rootScope.approval_message = "Are you sure you want to "+$rootScope.approval_type+" the selected document(s)?";
            
            var invalid = 0;
            if($rootScope.approval_type == 'Disapprove')
            {
                
                angular.forEach($scope.selectedRecords, function (obj, index) {
                    if(obj.record.comments == undefined || obj.record.comments.length == 0)
                    {
                        invalid = 1;
                    }
                });
            }
            if(invalid == 1)
            {
                toaster.pop('error', 'error', $scope.$root.getErrorMessageByCode(663));
                return;
            }

            ngDialog.openConfirm({
                template: '_confirm_approval_confirmation_modal',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                $scope.showLoader = true;
                var postUrl = $scope.$root.setup + "general/update-approvals-status-bulk";
                $http
                    .post(postUrl, {'token': $scope.$root.token, 'selected_data':$scope.selectedRecords, 'status': status })
                    .then(function (res) {
                        if (res.data.ack == true) {
                            $scope.showLoader = false;
                            toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(661, [$rootScope.approval_typed]));
                            $scope.getPendingApprovals();
                        }
                        else
                        {
                            $scope.showLoader = false;
                            toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(106));
                        }
                    });
                }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
        }
        else
        {
            toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(241, ['Documents for Approval']));
        }

    }   

    $scope.SendBulkApproveOrg = function()
    {
        var emails_to = [];
        if($scope.approval_status == 1)
        {
            angular.forEach($scope.approvals_list, function(obj){
                if(obj.chk == true)
                {
                    emails_to.push(obj);
                }
            });
            if(emails_to.length == 0)
            {
                toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(230, ["Approver(s)"]));
                return;
            }
        }
        
        var postUrl = $scope.$root.setup + "general/send-for-approval-bulk";
        $http
            .post(postUrl, {'token': $scope.$root.token, 'selected_data':$scope.selectedRecords_awaiting, 'status': $scope.approval_status, 'emails_to':emails_to })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.showLoader = false;
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(661, [$rootScope.approval_typed]));
                    angular.element('#approvers_list').modal('hide');
                    $scope.getAwaitingApprovals();
                }
                else
                {
                    $scope.showLoader = false;
                    angular.element('#approvers_list').modal('hide');
                    toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106));
                }
            });
    }

    $scope.SendBulkApprove = function (status)
    {
        // type=> 2-> Approve, 3-> Disapprove

        if($scope.selectedRecords_awaiting.length > 0)
        {
            $scope.approval_status = status;
            $rootScope.approval_type = (status == 1) ? 'Send for Approval' : 'Cancel Approval';
            $rootScope.approval_typed = (status == 1) ? 'Sent for Approval' : 'Canceled Approval';
            $rootScope.approval_message = "Are you sure you want the selected document(s) to "+$rootScope.approval_type+"?";
            
            $scope.approvals_list = [];

            ngDialog.openConfirm({
                template: '_confirm_approval_confirmation_modal',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                $scope.showLoader = true;
                
                if($scope.approval_status == 1)
                {
                    var approval_types = "";
                    angular.forEach($scope.selectedRecords_awaiting, function (obj, index) {
                        if(!(approval_types.includes(obj.record.type)))
                            approval_types += obj.record.type + ", ";
                    });

                    if(approval_types.length > 0)
                    {
                        approval_types = approval_types.substring(0, approval_types.length - 2);
                    }
                    var postUrl1 = $scope.$root.setup + "general/get-approvers-list";
                    $http
                        .post(postUrl1, {'token': $scope.$root.token, 'approval_types':approval_types })
                        .then(function (res) {
                            if (res.data.ack == true) {
                                $scope.showLoader = false;
                                $scope.approvals_list = res.data.approvers;
                                angular.element('#approvers_list').modal({ show: true });

                            }
                            else
                            {
                                $scope.showLoader = false;
                                toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(665));
                            }
                        });
                }
                else
                {
                    $scope.SendBulkApproveOrg();
                }

            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
        }
        else
        {
            toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(241, ['Documents for Approval']));
        }

    }

    $scope.checkAllApprovers = function(flg)
    {
        angular.forEach($scope.approvals_list, function(obj){
            obj.chk = flg;
        });
    }

    $scope.CancelBulkApprove = function()
    {
        $scope.selectedRecords_awaiting = [];
        angular.element('#approvers_list').modal('hide');

    }

    $scope.openDocumentLink = function(record){
        var mainRecord = record;
        var record = mainRecord.record;
        var index = mainRecord.index;
        var url;
        if (record.type == '1' || record.type == '2'){
            url = $state.href("app.viewOrder", ({ id: record.object_id }));
        }
        else if (record.type == '3' || record.type == '8'){
            url = $state.href("app.viewReturnOrder", ({ id: record.object_id }));
        }
        else if (record.type == '4' || record.type == '7'){
            url = $state.href("app.viewsrmorder", ({ id: record.object_id }));
        }
        else if (record.type == '5'){
            url = $state.href("app.edithrvalues", ({ id: record.detail_id, isTab:2 }));
        }
        else if ( record.type == '6' || record.type == '9'){
            // url = $state.href("app.edithrvalues", ({ id: record.detail_id, isTab:1 }));
            url = $state.href("app.holidayForm", ({ id: record.detail_id, isTab:1, hid:record.object_id }));
        }
        window.open(url, '_blank');

    }
    $scope.openLinkedDocumentLink = function(record)
    {
        var mainRecord = record;
        var record = mainRecord.record;
        var index = mainRecord.index;
        var url;
        if (record.type == '1' || record.type == '2'){
            url = $state.href("app.viewsrmorder", ({ id: record.linked_so_po_id }));
        }
        else if (record.type == '3' || record.type == '8'){
            if(record.invoice_type == 2)
            {
                url = $state.href("app.openingBalances", ({ module: 'customer' }));
            }
            else
            {
                url = $state.href("app.viewOrder", ({ id: record.linked_so_po_id }));
            }
        }
        else if(record.type == '4' || record.type == '7'){
            url = $state.href("app.viewOrder", ({ id: record.linked_so_po_id }));
        }
        
        window.open(url, '_blank');
    }
    
    $scope.CheckComments = function(record)
    {
        var mainRecord = record;
        $scope.record = mainRecord.record;
        // var index = mainRecord.index;
        $scope.comments = {};
        $scope.comments.comment = $scope.record.comments;
        $scope.comments.id = $scope.record.id;
        angular.element('#approval_comments').modal({ show: true });
    }

    $scope.submit_comments = function(status)
    {
        if($scope.comments.comment ==  null || $scope.comments.comment.length == 0)
        {
            toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(230, ['Comment']));
        }
        else
        {

            var updateUrl = $scope.$root.setup + "general/update-approval-comments";
            $http
                .post(updateUrl, { id: $scope.comments.id, comments: $scope.comments.comment, status: status, 'token': $scope.$root.token})
                .then(function (res) {
                    if (res.data.ack == true) {
                        angular.element('#approval_comments').modal('hide');
                        if ($state.current.name.match("app.pending-approvals")) {
                            $scope.getPendingApprovals();
                        }
                        else if ($state.current.name.match("app.awaiting-approvals")) {
                            $scope.getAwaitingApprovals();
                        }
                    }
                    else
                    {
                        toaster.pop('warning', 'Edit', $scope.$root.getErrorMessageByCode(106));
                    }

                });
        }
    }

}
