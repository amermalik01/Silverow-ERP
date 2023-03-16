myApp.directive('expressionEval', ['toaster', function(toaster) {
    return {
        replace: true,
        restrict: "E",
        scope: {
            result: "=",
            value: "=",
            enablePercentage: '=',
            notNegative: '='
        },
        templateUrl: 'app/shared/directives/expression_eval.directive.html',
        link: linkFunction
    };

    function linkFunction(scope) {
        loc_value = scope.value;

        scope.Evaluate = function (input) { 
            
            input = String(input);

            if (scope.value == undefined) {
                scope.value = loc_value;
                        return;
            } else if (input.match(/[a-zA-Z]/g) != null) {
                scope.value = loc_value;
                toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(305))
                        return;
            } else if (input.match(/[!"^£$&[{}\]?\\@#~<>_'|`¬:;,=]/g) != null) {
                scope.value = loc_value;
                toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(306))
                        return;
            } else if (input.match(/[0-9]+[+\-\/*]$/g) != null) {
                scope.value = loc_value;
                toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(307))
                        return;
            } else if (input.match(/\.\d*\.+/g) || (input.match(/\.{2,}/g)) != null) { 
                scope.value = loc_value;
                toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(308))
                        return; 
            } else if (input.match(/^\)/g) || (input.match(/^\(/g)) != null) {
                scope.value = loc_value;
                toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(309))
                        return; 
            } else if (input.match(/^[\/*%+]+/g) != null) {
                scope.value = loc_value;
                toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(310))
                        return; 
            } else if (input.match(/[\/\-*+]{2}/g) != null) {
                scope.value = loc_value;
                toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(311))
                        return;
            } else if (input.match(/\){2,}/g) || 
                      (input.match(/\({2,}/g)) || 
                      (input.match(/\(\d+$/g)) || 
                      (input.match(/\(\d$/g)) || 
                      (input.match(/\(\d+[\/\-%+*]/g)) || 
                      (input.match(/^\d+\)+/g)) || 
                      (input.match(/[\/\-%+*]\)/g)) || 
                      (input.match(/[\/\-%+*]\(/g)) || 
                      (input.match(/\([\/\-%*+]+/g)) ||
                      (input.match(/\([\/\-*+%]+\)/g)) ||
                      (input.match(/[\(\)][\d\/\-%*+]+[\(]/g)) ||
                      (input.match(/\d+\($/g)) ||
                      (input.match(/\d+\(\)$/g)) != null) { 
                scope.value = loc_value;
                toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(312))
                        return;
            } 
            
            var expressionResults = input.match(/[0-9]*\.?[0-9]+%/g);
            if (scope.enablePercentage) { 
                if (expressionResults != null) { 
                    if (expressionResults.length > 1) { 
                        scope.value = loc_value;
                        toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(313))
                                return;
                    } else {
                        var percentageValue = parseFloat(expressionResults) * loc_value / 100;
                        input = input.replace(expressionResults, percentageValue);
                    }
                }
            } else if (expressionResults != null) { 
                scope.value = loc_value;
                toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(314))
                        return;
            }

            scope.value = math.eval(input);
            if (scope.notNegative){
                if (scope.value < 0){
                    toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(315));
                    scope.value = loc_value;
                } 
            } else {
                loc_value = scope.value;
            }
        }

    }
}]);
