myApp.directive("ngDroppable2", [function () {
    return {
        restrict: 'A',
        scope: {
            header: "=",
            dIndex: '@',
            handleDrop: '&',
            outputFunc: '&',
            f1: '&',
            allHeaders: "="
        },
        replace: true,
        templateUrl: "app/shared/directives/_modalFlexiTable/flexi_table_options.directive.html",
        link: function (scope, elem) {


            scope.handleRadio = function (x) {
                for (var i = 0; i < scope.allHeaders.length; i++) {
                    scope.allHeaders[i].pinned = false;
                }
                x.pinned = true;
            }

            scope.draggable = elem[0];
            scope.handle = scope.draggable.getElementsByClassName("handle")[0];
            scope.target = false;
            elem.bind('mousedown', function (e) {
                scope.target = e.target;
            })
            elem.bind('change', function (e) {
                scope.outputFunc();
            })
            // scope.makeParentDraggable = function(e){
            //   debugger
            //   console.log("yes");
            //   e.parentElement.draggable = true;
            // }
            elem.attr("draggable", "true");
            elem.bind('dragstart', function (e) {
                if (scope.handle.contains(scope.target)) {
                    elem.addClass("moving");
                    if (e.stopPropagation) e.stopPropagation();
                    e.dataTransfer = e.originalEvent.dataTransfer;
                    e.dataTransfer.setData('sIndex', scope.dIndex);
                }
                else {
                    e.preventDefault();
                }
            });
            elem.bind('dragenter', function (e) {
                e.currentTarget.classList.add("over")
            });
            elem.bind('dragleave', function (e) {
                e.currentTarget.classList.remove("over")
            })
            elem.bind('dragover', function (e) {
                if (e.preventDefault) e.preventDefault();
                if (e.stopPropagation) e.stopPropagation();
            });
            elem.bind('dragend', function (e) {
                elem.removeClass("moving");

            });
            elem.bind('drop', function (e) {
                e.dataTransfer = e.originalEvent.dataTransfer;
                e.currentTarget.classList.remove("over");
                var sIndex = e.dataTransfer.getData("sIndex");
                if (e.stopPropagation) { e.stopPropagation(); }
                scope.handleDrop({ s: sIndex, d: scope.dIndex });
            });
        }
    }
}]);