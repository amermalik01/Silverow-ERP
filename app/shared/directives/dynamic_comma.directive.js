myApp.directive("commaDirective", function () {

    return {
        replace: true,
        restrict: "A",
        scope: {
            numberField: "=",
            editStatus: "=",
            region: "@"
        },
        templateUrl: 'template.html',
        link: linkFunction
    };
    function linkFunction(scope) {

        scope.insertCommas = function () {
            if (typeof(scope.numberField) != "number") return alert("Please enter a valid number");

            if (scope.numberField > 10000000000000000){
                alert("Please enter a number less than 10,000,000,000,000,000")
            } else if (scope.region == null || scope.region == "Europe" || scope.region == ""){
                scope.numberWithCommas = scope.numberField.toLocaleString();
                console.log(scope.numberWithCommas);
            } else {
                scope.numberWithCommas = scope.numberField.toLocaleString();
                scope.numberWithCommas = scope.numberWithCommas.replace(/,/g , "x") 
                                                               .replace(/\./g, ',') 
                                                               .replace(/x/g, '.'); 
                console.log(scope.numberWithCommas);
            }
        }
    }
});

