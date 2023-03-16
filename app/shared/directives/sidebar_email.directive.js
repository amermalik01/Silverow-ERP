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