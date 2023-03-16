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