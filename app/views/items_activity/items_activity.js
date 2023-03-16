itemsActivityController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "$state", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {

		$stateProvider
			.state('app.items-activity', {
				url: '/items-activity',
				title: 'Items Activity',
				templateUrl: helper.basepath('items_activity/items_activity.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog'),
				controller: 'itemsActivityController'
			})
	}]);

myApp.controller('itemsActivityController', itemsActivityController);

function itemsActivityController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, $state, ngDialog, toaster) {
	'use strict';

	$scope.breadcrumbs = [{ 'name': 'Inventory', 'url': '#', 'isActive': false },
	{ 'name': 'Items Activity', 'url': '#', 'isActive': false }];

	$scope.searchKeyword = {};
	$scope.account_activity = function (item_paging) {
        $scope.showLoader = true;
        // $scope.$root.breadcrumbs[3].name = 'Activity';//$scope.$root.product_id
        var get_account_activity_url = $scope.$root.gl + "chart-accounts/get-all-items-activity";
        $scope.postData = {};
        if (item_paging == 1) $scope.item_paging.spage = 1;
        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;

        $scope.postData.token = $scope.$root.token;
        $scope.postData.product_id = 0;
        if (!$scope.searchKeyword.totalRecords)
            $scope.searchKeyword.totalRecords = 50;
        $scope.postData.searchKeyword = $scope.searchKeyword;
        $http
            .post(get_account_activity_url, $scope.postData)
            .then(function (res) {
                //console.log(res);
                $scope.account_activity_data = [];

                if (res.data.ack == true) {
                    $scope.tableData = res;
                    $scope.columns = [];
                    $scope.account_activity_data = res.data.response;

                    angular.forEach($scope.tableData.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    })

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }
                $scope.showLoader = false;
            });
	}
	$scope.account_activity(1);

	
    $scope.openDocumentLink = function (record) {
        var mainRecord = record;
        var record = mainRecord.record;
        var index = mainRecord.index;
        var url;
        if (record.docType == 'Sales Order') {
            url = $state.href("app.editOrder", ({ id: record.order_id }));
        }
        else if (record.docType == 'Sales Invoice') {
            url = $state.href("app.viewOrder", ({ id: record.order_id, isInvoice: 1 }));
        }
        else if (record.docType == 'Credit Note') {
            url = $state.href("app.viewReturnOrder", ({ id: record.order_id, isInvoice: 1 }));
        }
        else if (record.docType == 'Purchase Order' || record.docType == 'PO Finished Good') {
            url = $state.href("app.viewsrmorder", ({ id: record.order_id }));
        }
        else if (record.docType == 'Purchase Invoice' || record.docType == 'PI Finished Good') {
            url = $state.href("app.viewsrminvoice", ({ id: record.order_id }));
        }
        else if (record.docType == 'Debit Note') {
            url = $state.href("app.viewsrmorderreturninvoice", ({ id: record.order_id }));
        }
        else if (record.docType == 'Item Journal') {
            url = $state.href("app.view-receipt-journal-gl-item", ({ id: record.order_id }));
        }
        else if (record.docType == 'Transfer Stock') {
            url = $state.href("app.view-transfer-order", ({ id: record.order_id }));
        }
        else if (record.docType == 'Stock Opening Balance')
        {
            url = $state.href("app.openingBalances", ({module:'stock'}));
        }
        else{
            return;
        }
        window.open(url, '_blank');

    }

    $scope.openItemLink = function (record) {
        var mainRecord = record;
        var record = mainRecord.record;
        var index = mainRecord.index;
        var url;
        url = $state.href("app.edit-item", ({ id: record.item_id }));
        window.open(url, '_blank');

    }

}
