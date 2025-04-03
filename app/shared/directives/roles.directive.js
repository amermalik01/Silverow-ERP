myApp.directive('roles', function ($interpolate, $rootScope, $http, toaster, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            array: '=',
            module: '=',
            readonly: '='
        },
        // controller: 'DashboardController',y
        templateUrl: 'app/shared/directives/roles.directive.html',
        link: function (scope) {

            // if (scope.module == "1") 
            {
                var url = scope.$root.dashboard + "get-widget-roles-for-setup";
                $http.post(url, { token: scope.$root.token, type: scope.module })
                    .then(function (res) {
                        if (res.data.ack == true) {
                            scope.array = res.data.widgets;
                            scope.roles = res.data.roles;
                            scope.widgetRoles = res.data.widgetRoles;

                            scope.array.forEach(function (w, wIndex) {
                                w.roles = [];
                                scope.roles.forEach(function (d, dIndex) {
                                    var abs_index = (wIndex * scope.roles.length) + dIndex;
                                    w.roles.push(scope.widgetRoles[abs_index]);
                                    scope.widgetRoles[abs_index].permission = (scope.widgetRoles[abs_index].permission == '1') ? true : false;
                                });
                            });


                            // angular.forEach(scope.array, function (obj) {
                            //     angular.forEach(obj.roles, function (obj2) {
                            //         if (obj2.permission = true) {
                            //             // scope.chckAll = true;
                            //         }
                            //     });
                            // });


                        } else {
                            toaster.pop('error', 'Info', res.data.error);
                        }
                    })
                    .catch(function (error) {
                        // alert('Setup Widgets Error: \n' + error);
                    });
            }

            scope.CheckAll = function (roleID, cond) {
                angular.forEach(scope.array, function (obj) {
                    angular.forEach(obj.roles, function (obj2) {
                        if (obj2.role_id == roleID) {
                            if (cond == true)
                                obj2.permission = true;
                            else
                                obj2.permission = false;
                        }
                    });
                });
            }

            scope.showEditForm = function () {
                scope.readonly = false;
            }

            scope.saveWidgetRoles = function () {
                scope.showLoader = true;
                var url = scope.$root.dashboard + "save-widget-role-in-setup";
                $http.post(url, { token: scope.$root.token, 'widgetRoles': scope.widgetRoles, type: scope.module })
                    .then(function (res) {
                        if (res.data.ack == true) {
                            scope.showLoader = false;
                            toaster.pop('success', 'Info', $rootScope.getErrorMessageByCode(102));                            
                            scope.readonly = true;
                            $rootScope.getReportsRole(0);
                        } else {
                            scope.showLoader = false;
                            toaster.pop('error', 'Info', res.data.error);
                        }
                    })
            }
        }
    }
});