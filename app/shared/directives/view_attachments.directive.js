myApp.directive("viewAttachments", [function ($scope) {
    return {
        restrict: 'E',
        scope: {
            type: "@",
            typeId: "=",
            subType: "@",
            subTypeId: "="
        },
        replace: false,
        controller: "fileUploadController",
        templateUrl: "app/shared/directives/view_attachments.directive.html",
        link: function (scope, elem, attrs) {
            scope.fileData = {
                type: scope.type,
                typeId: scope.typeId,
                subType: scope.subType,
                subTypeId: scope.subTypeId
            }
            console.log(scope.fileData);
            scope.getFileListing(1);
        }
    }
}]);