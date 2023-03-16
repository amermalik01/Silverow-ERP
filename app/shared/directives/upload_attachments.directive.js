myApp.directive("attachmentUpload", [function () {
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
        templateUrl: "app/shared/directives/upload_attachments.directive.html",
        link: function (scope, elem, attrs) {
            console.log(scope);
            scope.fileData = {
                type: scope.type,
                typeId: scope.typeId,
                subType: scope.subType,
                subTypeId: scope.subTypeId
            }
        }
    }
}]);