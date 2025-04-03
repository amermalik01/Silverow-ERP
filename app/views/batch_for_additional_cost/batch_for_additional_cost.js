BatchAdditionalCostController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$stateParams", "$state", "$rootScope", "myService", "ModalService"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {

		$stateProvider
			.state('app.batch-for-additional-cost', {
				url: '/batch-for-additional-cost',
				title: 'Setup',
				templateUrl: helper.basepath('batch_for_additional_cost/batch_for_additional_cost.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
		
	
	}]);

myApp.controller('BatchAdditionalCostController', BatchAdditionalCostController);
function BatchAdditionalCostController($scope, $filter, ngTableParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams, $state, $rootScope, myService, ModalService) {
	'use strict';
	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Finance', 'url': 'app.setup', 'isActive': false, 'tabIndex': '2' },
		{ 'name': 'Batch for Additional Cost', 'url': '#', 'isActive': false }];

	$scope.module = $stateParams.module;
	$scope.searchKeyword = {};
	$scope.moduleType = 'entries';

	$scope.searchKeywordHistory = {};

	$scope.filterReport = {};
	$scope.filterReport2 = {};

	$scope.filterReport.token = $rootScope.token;
	$scope.filterReport.reportType = $scope.module;
	$scope.filterReport.dateTo = $scope.$root.get_current_date();

	if ($scope.module == 'summary' || $scope.module == 'detail') {

		var getUrl = $scope.$root.gl + "chart-accounts/get-all-gl-account-no";
		var postData1 = { 'token': $scope.$root.token };
		$scope.glAccountArr = [];

		$http
			.post(getUrl, postData1)
			.then(function (res) {
				if (res.data.ack == true) {
					$scope.glAccountArr = res.data.response;
				}
				else
					toaster.pop('warning', 'Info', "No GL Account Exists!");
			});
	}

	// get all Batch Entries 
	$scope.getEntries = function () {

		$scope.filterReport.token = $rootScope.token;
		$scope.filterReport.reportType = $scope.module;

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
					toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(333, ['Date To','Date From']));
					return false;
				}
			}
		} else {
			$scope.filterReport.dateFrom = '';
			toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Date From']));
			return false;
		}


		// $scope.showLoader = true;

		var getEntriesApi = $scope.$root.setup + "general/get-additional-cost-entries";
		// var getEntriesApi = "api/setup/general/entries";

		$http
			.post(getEntriesApi, $scope.filterReport)
			.then(function (res) {
				$scope.showLoader = false;
				$scope.entityDataArr = [];
				$scope.columns = [];

				if (res.data != null && res.data.ack == true) {
					$scope.entityDataArr = res.data.response;

					console.log('entityDataArr===============', $scope.entityDataArr);
					angular.forEach(res.data.response[0], function (val, index) {
						$scope.columns.push({
							'title': toTitleCase(index),
							'field': index,
							'visible': true
						});
					});
				}
				else
					toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
			});
	}

	// check batch for additional cost
	$scope.checkBatchForAddCost = function () {
		var postUrl_ref_cat = $scope.$root.setup + "general/check-batch-for-add-cost";

        $http
            .post(postUrl_ref_cat, {
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {

                } 
            else
            {
               
            }
                // toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            });
    }

    if($state.current.name == "app.batch-for-additional-cost"){
        $scope.checkBatchForAddCost();
    }

	// Run Batch  
	$scope.runBatch = function () {
		$scope.printPdfVals = {};
		// $scope.moduleType = 'runBatch';

		$scope.filterReport.token = $rootScope.token;
		$rootScope.printinvoiceFlag = false;

		$scope.filterReport.reportType = $scope.module;

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
					toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(333, ['Date To','Date From']));
					return false;
				}
			}
		}
		else {
			$scope.filterReport.dateFrom = '';
			toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Date From']));
			return false;
		}

		$scope.showLoader = true;

		var runBactchApi = $scope.$root.setup + "general/run-additional-cost-batch";
		$http
			.post(runBactchApi, $scope.filterReport)
			.then(function (res) {
				$scope.showLoader = false;
				$scope.account_list = [];

				if (res.data.ack == true) {
					$scope.account_list = res.data.response;
					toaster.pop('success', 'Update', 'Batch Posted Successfully');
				}
				else
					toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(639));
			});
	}
}
