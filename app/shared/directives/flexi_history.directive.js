myApp.directive("flexiHistory", ["toaster", "$filter", "$rootScope", "$http", function (toaster, $filter, $rootScope, $http) {
    return {
        restrict: 'E',
        scope: {
            screenName: "@",
            params: "@"
        },
        replace: false,
        templateUrl: "app/shared/directives/flexi_history.directive.html",
        link: function (scope, elem, attrs) {
           
            scope.getHistory = function(){
                scope.showLoader = true;
                var tempArr = [];
                var tempObj = {};
                var params = JSON.parse(scope.params);
                for (var key in params) {
                    tempObj.key = key;
                    tempObj.value = params[key];
                    tempArr.push(tempObj);
                }

                var getHistoryURL = scope.$root.setup + "general/getHistory";

                var postData = { 'token': scope.$root.token, 'params': tempArr, 'screen': scope.screenName };
                $http
                    .post(getHistoryURL, postData)
                    .then(function (res) {
                        scope.showLoader = false;
                        scope.tableData = res.data.response;
                    angular.element('#fieldsHistory').modal('show');

                    });
            }

            scope.visibleView = "table";
            scope.toggleView = function(view){
                scope.visibleView = view;
            }
        }
        
    }
}])