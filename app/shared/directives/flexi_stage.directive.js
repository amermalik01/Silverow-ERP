myApp.directive("stageStatusBar",  ['toaster', 'OrderStages', 'ngDialog', '$rootScope', function (toaster, OrderStages, ngDialog, $rootScope) {
    return {
        restrict: "E",
        scope: {
            stages: '=',
            readOnly: '=',
        },
        templateUrl: "app/shared/directives/flexi_stage.directive.html",
        link: linkFunction
    };

    function linkFunction(scope, elem, attrs) {
        
        var noneSequencial = ("noneSequencial" in attrs) ? 0 : 1;
        var active = {
            index: 0,
            previousState: "outstanding"
        };


        scope.selectStage = function (index) {
            if (noneSequencial && !scope.stages[index - 1].chk) return;

            if (active.index != null)
                scope.stages[active.index].state = active.previousState;
            active.index = index;
            active.previousState = scope.stages[index].state;
            scope.stages[index].state = "active";

            OrderStages.addOrderStages(scope.stages)
                .then(function (result) {
                    if (result.ack == true) {
                        // item.id = result.id;
                        // console.log(item);
                    }
                }, function (error) {
                    console.log(error);
                });
        }

        scope.completeStage = function (index) {
            var skip = false;
            if (scope.stages[index].chk) {
                scope.stages[index].state = "completed";
                active.index = null;
                for (var i = scope.stages.length - 1; i > -1; i--) {
                    if (scope.stages[i].state != "completed" && skip) {
                        scope.stages[i].state = "skipped";
                    } else if (scope.stages[i].state == "completed") {
                        skip = true;
                    } else {
                        scope.stages[i].state = "outstanding";
                    }
                }
            } else {
                scope.stages[index].state = "active";
                if (scope.stages[index].chk == false) {

                    ngDialog.openConfirm({
                        template: 'confirm_order_stage_unchecked_message',
                        className: 'ngdialog-theme-default-custom'
                    }).then(function (value) {
                        for (var i = scope.stages.length - 1; i > -1; i--) {
                            if (scope.stages[i].state != "completed" && skip) {
                                scope.stages[i].state = "skipped";
                            } else if (scope.stages[i].state == "completed") {
                                skip = true;
                            } else {
                                scope.stages[i].state = "outstanding";
                            }
                        }
                        scope.stages[index].state = "active";
                    }, function (reason) {
                        scope.stages[index].chk = true;
                        // console.log('Modal promise rejected. Reason: ', reason);
                    });


                    // var alert = confirm("Unticking will mean that this stage is uncompleted. Are you sure you want to do this?");
                    // if (alert == true) {
                    //     for (var i = scope.stages.length - 1; i > -1; i--) {
                    //         if (scope.stages[i].state != "completed" && skip) {
                    //             scope.stages[i].state = "skipped";
                    //         } else if (scope.stages[i].state == "completed") {
                    //             skip = true;
                    //         } else {
                    //             scope.stages[i].state = "outstanding";
                    //         }
                    //     }
                    // } else {
                    //     scope.stages[index].chk = true;
                    // }
                }
                active.previousState = scope.stages[index].state;
                scope.selectStage(index);
            }
            OrderStages.addOrderStages(scope.stages)
                .then(function (result) {
                    if (result.ack == true) {
                        // item.id = result.id;
                        // console.log(item);
                    }
                }, function (error) {
                    console.log(error);
            });
        }
    }

    /* ngDialog.openConfirm({
                template: 'modalleave',
                // template: 'app/views/_conform_leave.html',
                className: 'ngdialog-theme-default',
                scope: $scope
            }).then(function (result) {

                setTimeout(function () {
                    // $scope.getPromotion();
                    //  $state.go('app.crm');
                }, 1000);
            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
 */
}]);