myApp.directive("sidebarNotes", ["moduleTracker", function (moduleTracker) {
    return {
        restrict: "E",
        controller: "commentsController",
        templateUrl: 'app/shared/directives/sidebar_notes.directive.html',
        scope:{

        },
        link: function (scope, elem, attrs) {
            
        }
    }

}]);