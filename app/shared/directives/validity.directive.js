myApp.directive("validity", ["$compile", function ($compile, $rootScope) {

    return {
        restrict: 'A',
        scope: {
            validity: "="
        },
        replace: false,
        link: function (scope, elem, attrs) {
            elem.removeAttr("x-validity");
            elem.attr("pattern", scope.validity);
            elem.attr("ng-pattern", scope.validity);
            if (scope.$root.regx.placeholders[attrs.validity.split(".")[1]]) {
                elem.attr("title", scope.$root.regx.placeholders[attrs.validity.split(".")[1]]);
            }
            if (scope.$root.regx.parsleyMessages[attrs.validity.split(".")[1]]) {
                elem.attr("data-parsley-pattern-message", scope.$root.regx.parsleyMessages[attrs.validity.split(".")[1]]);
            }
            $compile(elem)(scope.$parent);
        }
    }
}])