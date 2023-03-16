
ProfitMarginAnalysis.$inject = ["$scope", "$http", "toaster"];
myApp.config(['$stateProvider', 'RouteHelpersProvider',
	function ($stateProvider, helper) {
		/* specific routes here (see file config.js) */
		$stateProvider
			.state('app.profit-margin-analysis', {
				url: '/profit-margin-analysis',/* -methods */
				title: 'Setup',
                templateUrl: helper.basepath('profit_margin_analysis/_form.html'),
				controller: 'ProfitMarginAnalysis'                
			})
	}]);

myApp.controller('ProfitMarginAnalysis', ProfitMarginAnalysis);
function ProfitMarginAnalysis($scope, $http, toaster) {
	'use strict';

	$scope.breadcrumbs =
	[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
		{ 'name': 'Profit Margin Analysis View', 'url': '#', 'isActive': false }];

	
	$scope.profitMarginReadonly = true;
	$scope.toggleReadonly = function(){
		$scope.profitMarginReadonly = !$scope.profitMarginReadonly;
	}

	$scope.getState = function(){
		$scope.showLoader = true;
		var apiURL = $scope.$root.setup + "general/getProfitMarginView";		
		var postData = { 'token': $scope.$root.token };
		$http
			.post(apiURL, postData)
			.then(function (res) {
				if (res.data.ack){
					$scope.marginAnalysisView = res.data.marginAnalysisView;
				}
				$scope.showLoader = false;
		});
	}();

	$scope.setState = function(){
		$scope.showLoader = true;
		var apiURL = $scope.$root.setup + "general/setProfitMarginView";

		var postData = { 'token': $scope.$root.token, 'marginAnalysisView': $scope.marginAnalysisView };
		$http
			.post(apiURL, postData)
			.then(function (res) {
				if (res.data.ack){
					toaster.pop('success', 'Update', 'Default Margin Analysis View Updated Successfully.')
				}
				$scope.toggleReadonly();
				$scope.showLoader = false;
		});
	}
}