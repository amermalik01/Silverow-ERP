myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        $stateProvider
            .state('app.widgetRoles', {
                url: '/widget_roles_setup/:type',
                params: { type: null },
                title: 'Setup',
                templateUrl: helper.basepath('dashboard/widget_roles_setup.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })

    }
]);

myApp.controller('DashboardController', ['$scope', '$window', '$stateParams', '$filter', '$http', '$rootScope', "toaster", "$timeout", "$interpolate", "$compile", "moduleTracker",
    function($scope, $window, $stateParams, $filter, $http, $rootScope, toaster, $timeout, $interpolate, $compile, moduleTracker) {

        $scope.$root.nevicoVersionNumber = "1.0.20";
        $scope.$root.nevicoVersionDate = "22th July 2022";
        $scope.preferredName = $rootScope.known_as;
        activeWidgetPos = [];
        $scope.widthTypes = ['25%', '33%', '50%'];
        $scope.heightTypes = ['1X', '2X'];
        $scope.allowReorder = false;
        $scope.removeFromDashboard = false;
        $scope.showAddForm = false;
        $scope.oppoCyclelabels = [];
        $scope.oppoCycleData = [];
        $scope.bugs = [];
        $scope.features = [];
        $scope.versionAdd = {};
        // $scope.versionAdd.date = $scope.$root.get_current_date();
        $scope.table = {};
        // $scope.months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
        $scope.months = [{ "value": 1, "month": "Jan" },
            { "value": 2, "month": "Feb" },
            { "value": 3, "month": "Mar" },
            { "value": 4, "month": "Apr" },
            { "value": 5, "month": "May" },
            { "value": 6, "month": "June" },
            { "value": 7, "month": "July" },
            { "value": 8, "month": "Aug" },
            { "value": 9, "month": "Sept" },
            { "value": 10, "month": "Oct" },
            { "value": 11, "month": "Nov" },
            { "value": 12, "month": "Dec" }
        ];

        $scope.quarters = [{ "value": 1, "label": "Q1" },
            { "value": 2, "label": "Q2" },
            { "value": 3, "label": "Q3" },
            { "value": 4, "label": "Q4" }
        ];


        var sortable = Sortable.create(simpleList, {
            group: "dashboardWidgets",
            ghostClass: "sortable-ghost",
            animation: 100,
            handle: ".klip-toolbar",
            disabled: true,
            store: {
                get: function(sortable) {
                    var order = localStorage.getItem(sortable.options.group.name);
                    return order ? order.split('|') : [];
                },
                set: function(sortable) {
                    var order = sortable.toArray();
                    localStorage.setItem(sortable.options.group.name, order.join('|'));
                    activeWidgetPos = [];
                    for (i = 0; i < sortable.el.children.length; i++) {
                        activeWidgetPos.push(sortable.el.children[i].children[0].id);
                    }
                }
            }
        });

        var vUrl = $scope.$root.dashboard + "get-version-data";
        $http.post(vUrl, { token: $scope.$root.token })
            .then(function(res) {
                if (res.data.ack == true) {
                    $scope.versions = res.data.response;
                } else {
                    toaster.pop('error', 'Info', res.data.error);
                }
            });

        $scope.checkCacheClear = function() {

            var chUrl = $scope.$root.dashboard + "check-released-version";
            $http.post(chUrl, { token: $scope.$root.token })
                .then(function(res) {
                    if (res.data.ack == true) {
                        //toaster.pop('success', 'Dashboard', res.data.success);
                    } else {
                        // toaster.pop('error', 'Dashboard', res.data.error);                            
                        toaster.pop('warning', 'Dashboard', 'Please Wait, Your cache is being cleared.');
                        $rootScope.showLoader = true;
                        $timeout(function() {
                            $scope.clearCache();
                        }, 1000)
                    }
                });
        }
        $scope.checkCacheClear();

        $scope.clearCache = function() {

            var scripts = [];
            $("script").each(function(i, e) {
                scripts.push(e);
            })

            $("script").each(function(i, e) {
                var src = $(e).attr("src");

                if (src && src.indexOf("app/views/") > -1)
                    $(e).remove();
            })

            $timeout(function() {
                scripts.forEach(function(e) {
                    var src = $(e).attr("src");
                    if (src && src.indexOf("app/views/") > -1)
                        $("body").append(`<script async src='${src}'></script>`);

                })
                var cacheInterval = setInterval(function() {
                    if (window.abc) {
                        clearInterval(cacheInterval);
                        $rootScope.showLoader = false;
                        $timeout(function() {
                            toaster.pop('success', 'Dashboard', 'Application cache cleared successfully. Thank you for waiting.');
                        }, 0)

                    }
                    console.log("cache status:", window.abc);
                }, 500)
            }, 500)

        }

        $scope.checkUserWidgetsRoles = function() {
            $scope.moduleTracker = moduleTracker;
            moduleTracker.updateName("");
            moduleTracker.updateRecord("");
            moduleTracker.updateRecordName("");
            var chUrl = $scope.$root.dashboard + "check-user-widgets-roles";
            $http.post(chUrl, { token: $scope.$root.token, 'userType': $rootScope.user_type, 'type': 1 })
                .then(function(res) {
                    if (res.data.ack == true) {
                        $scope.checkUserWidgets();
                    } else {
                        $scope.checkUserWidgets();
                    }
                });
        }
        $scope.checkUserWidgetsRoles();


        $scope.checkUserWidgets = function() {
            var cUrl = $scope.$root.dashboard + "check-user-widgets";
            $http.post(cUrl, { token: $scope.$root.token, 'userType': $rootScope.user_type, 'type': 1 })
                .then(function(res) {
                    if (res.data.ack == true) {
                        $scope.getUserWidgets();
                    } else {
                        $scope.getUserWidgets();
                    }
                });
        }


        $scope.checkUserReportsRoles = function() {
            var chUrl = $scope.$root.dashboard + "check-user-widgets-roles";
            $http.post(chUrl, { token: $scope.$root.token, 'userType': $rootScope.user_type, 'type': 2 })
                .then(function(res) {
                    if (res.data.ack == true) {
                        /* $scope.checkUserWidgets();
                    } else {
                        $scope.checkUserWidgets(); */
                    }
                });
        }
        $scope.checkUserReportsRoles();




        $scope.getUserWidgets = function() {
                var url = $scope.$root.dashboard + "get-user-widgets";
                $http.post(url, { token: $scope.$root.token })
                    .then(function(res) {
                        if (res.data.ack == true) {

                            $scope.totalSalesValue = [];
                            $scope.totalPurchaseValue = [];
                            $scope.totalSalespersonValue = [];
                            $scope.totalPurchaserValue = [];
                            $scope.totalItemRevenue = [];
                            $scope.totalOutstandingSales = [];
                            $scope.totalItemQty = [];
                            $scope.totalOutstandingPurchase = [];

                            $scope.oppoCycleData = [];
                            $scope.oppoCyclelabels = [];

                            $scope.allWidgets = res.data.response;
                            $scope.activeWidgets = $scope.allWidgets.filter(function(widget) {
                                return widget.active == 1;
                            });
                            console.log(typeof(totalSalesValue2));
                            $scope.salesWidgets = filterWidgetsForTabs($scope.salesWidgets, 0);
                            $scope.purchaseWidgets = filterWidgetsForTabs($scope.purchaseWidgets, 1);
                            $scope.managementWidget = filterWidgetsForTabs($scope.managementWidget, 2);
                            $scope.humanResources = filterWidgetsForTabs($scope.humanResources, 3);

                            angular.forEach($scope.allWidgets, function(obj) {
                                if (obj.id == 1) {
                                    $scope.topCustSales = obj.query;
                                } else if (obj.id == 2) {
                                    $scope.topItemRevenue = obj.query;
                                } else if (obj.id == 3) {
                                    $scope.outstandSalesOrder = obj.query;
                                } else if (obj.id == 4) {
                                    $scope.oppoCycleWidget = obj.query;
                                } else if (obj.id == 5) {
                                    $scope.salesPromo = obj.query;
                                } else if (obj.id == 6) {
                                    $scope.salesQuote = obj.query;
                                } else if (obj.id == 7) {
                                    $scope.userTasks = obj.query;
                                } else if (obj.id == 8) {
                                    $scope.acceptance = obj.query;
                                } else if (obj.id == 9) {
                                    $scope.outstandPurchaseOrder = obj.query;
                                } else if (obj.id == 10) {
                                    $scope.topSuppSales = obj.query;
                                } else if (obj.id == 11) {
                                    $scope.salespersonPerformance = obj.query;
                                } else if (obj.id == 12) {
                                    $scope.purchaserPerformance = obj.query;
                                } else if (obj.id == 13) {
                                    $scope.companyRevenue = obj.query;
                                }
                            });

                            // console.log($scope.companyRevenue);

                            $scope.currencyCode = $rootScope.defaultCurrencyCode;

                            angular.forEach($scope.topCustSales, function(obj) {
                                $scope.totalSalesValue.push(Number(obj.value));
                            });
                            angular.forEach($scope.topSuppSales, function(obj) {
                                $scope.totalPurchaseValue.push(Number(obj.value));
                            });
                            angular.forEach($scope.salespersonPerformance, function(obj) {
                                $scope.totalSalespersonValue.push(Number(obj.value));
                            });
                            angular.forEach($scope.purchaserPerformance, function(obj) {
                                $scope.totalPurchaserValue.push(Number(obj.value));
                            });
                            angular.forEach($scope.topItemRevenue, function(obj) {
                                $scope.totalItemRevenue.push(Number(obj.revenue));
                                $scope.totalItemQty.push(Number(obj.qtysold));
                            });
                            angular.forEach($scope.outstandSalesOrder, function(obj) {
                                $scope.totalOutstandingSales.push(Number(obj.value));
                            });

                            angular.forEach($scope.outstandPurchaseOrder, function(obj) {
                                $scope.totalOutstandingPurchase.push(Number(obj.value));
                            });


                            if ($scope.totalSalesValue.length > 0)
                                $scope.totalSalesValueSum = Math.round(sumArray($scope.totalSalesValue) * 100) / 100;
                            if ($scope.totalItemRevenue.length > 0)
                                $scope.totalItemRevenueSum = Math.round(sumArray($scope.totalItemRevenue) * 100) / 100;
                            if ($scope.totalOutstandingSales.length > 0)
                                $scope.totalOutstandingSalesSum = Math.round(sumArray($scope.totalOutstandingSales) * 100) / 100;
                            if ($scope.totalOutstandingPurchase.length > 0)
                                $scope.totalOutstandingPurchaseSum = Math.round(sumArray($scope.totalOutstandingPurchase) * 100) / 100;
                            if ($scope.totalPurchaseValue.length > 0)
                                $scope.totalPurchaseValueSum = Math.round(sumArray($scope.totalPurchaseValue) * 100) / 100;
                            if ($scope.totalSalespersonValue.length > 0)
                                $scope.totalSalespersonValueSum = Math.round(sumArray($scope.totalSalespersonValue) * 100) / 100;
                            if ($scope.totalPurchaserValue.length > 0)
                                $scope.totalPurchaserValueSum = Math.round(sumArray($scope.totalPurchaserValue) * 100) / 100;
                            if ($scope.totalItemQty.length > 0)
                                $scope.totalItemQty = sumArray($scope.totalItemQty);

                            if ($scope.totalSalesValue)
                                $scope.totalSalesValueRound = thousandsAddLetter($scope.totalSalesValueSum);
                            if ($scope.totalItemRevenue)
                                $scope.totalItemRevenueRound = thousandsAddLetter($scope.totalItemRevenueSum);
                            if ($scope.totalOutstandingSales)
                                $scope.totalOutstandingSalesRound = thousandsAddLetter($scope.totalOutstandingSalesSum);
                            if ($scope.totalOutstandingPurchase)
                                $scope.totalOutstandingPurchaseRound = thousandsAddLetter($scope.totalOutstandingPurchaseSum);
                            if ($scope.totalPurchaseValue)
                                $scope.totalPurchaseValueRound = thousandsAddLetter($scope.totalPurchaseValueSum);
                            if ($scope.totalSalespersonValue)
                                $scope.totaltotalSalespersonRound = thousandsAddLetter($scope.totalSalespersonValueSum);
                            if ($scope.totalPurchaserValue)
                                $scope.totalPurchaserRound = thousandsAddLetter($scope.totalPurchaserValueSum);


                            /* ChartJs */
                            angular.forEach($scope.oppoCycleWidget, function(obj) {
                                $scope.oppoCyclelabels.push(obj.name + ' - ' + obj.percentage);
                                $scope.oppoCycleData.push(obj.percentage);
                            });
                            //$scope.oppoCyclelabels.pop();

                            $scope.oppoCycleOptions = {
                                legend: {
                                    display: true,
                                    position: 'left',
                                    labels: {
                                        fontSize: 10,
                                        usePointStyle: true,
                                    }
                                },
                                maintainAspectRatio: false,
                                responsive: false,
                            };
                            /* ChartJs */


                            // $scope.allWidgets = $scope.allWidgets.map( function(widget){
                            //     for (i=0; i<widget.queryDef.length; i++){
                            //         var iScope = {p1: widget.queryDef[i].QtySold};
                            //         // console.log(widget.queryDef[i]);
                            //         // console.log(widget.queryDef[i].QtySold);
                            //         widget.template = $compile(widget.template)(iScope);
                            //     }
                            //     return widget;
                            // });
                        } else {
                            toaster.pop('error', 'Info', res.data.error);
                        }
                    });
            }
            // $scope.getUserWidgets();



        $scope.addVersion = function() {
            $scope.versionAdd.date = $scope.$root.get_current_date();
            $scope.showAddForm = true;
        }

        $scope.cancelVersionModal = function() {
            $scope.showAddForm = false;
            $scope.bugs = [];
            $scope.features = [];
            $scope.versionAdd = {};
        }

        $scope.addBugToArray = function() {
            var temp = $scope.versionAdd.bugs;
            if (temp.length > 0) {
                $scope.bugs.push(temp);
                $scope.versionAdd.bugs = '';
            }
        }

        $scope.addFeatureToArray = function() {
            var temp = $scope.versionAdd.features;
            if (temp.length > 0) {
                $scope.features.push(temp);
                $scope.versionAdd.features = '';
            }
        }

        $scope.updateVersionData = function() {
            var url = $scope.$root.dashboard + "update-version-data";
            $http.post(url, { token: $scope.$root.token, 'data': $scope.versionAdd, 'bugs': $scope.bugs, 'features': $scope.features })
                .then(function(res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Dashboard', res.data.success);
                        $timeout(function() {
                            $scope.showAddForm = false;
                            $scope.viewVersion();
                        }, 500)
                    } else {
                        toaster.pop('error', 'Dashboard', res.data.error);
                    }
                });
        }





        function sumArray(arrayName) {
            arrayName = arrayName.reduce(function(a, b) {
                return a + b;
            });
            return arrayName;
        };

        function filterWidgetsForTabs(arrayName, type) {
            arrayName = $scope.allWidgets.filter(function(widget) {
                return widget.type == type;
            });
            return arrayName;
        }

        function thousandsAddLetter(input) {
            if (parseFloat(input) > 949 && parseFloat(input) <= 994999) {
                input = Math.round(parseFloat(input) / 1000) + "k";
            } else if (parseFloat(input) > 994999 && parseFloat(input) <= 999499999) {
                input = Math.round(parseFloat(input) / 1000000) + "m";
            } else if (parseFloat(input) > 999499999 && parseFloat(input) < 999949999999) {
                input = Math.round(parseFloat(input) / 1000000000) + "b";
            } else if (parseFloat(input) >= 999949999999) {
                input = "100b+";
            }
            return input;
        }

        $scope.openWidgetOptions = function(id) {
            $scope.options = {};
            $scope.selectedWidgetId = id;
            var url = $scope.$root.dashboard + "open-widget-options-modal";
            $http.post(url, { token: $scope.$root.token, 'widgetID': id })
                .then(function(res) {
                    if (res.data.ack == true) {

                        $scope.widgetYears = res.data.response;

                        $scope.widgetDefinedOptions = res.data.widgetOptionData;
                        if ($scope.widgetDefinedOptions != undefined) {

                            if ($scope.widgetDefinedOptions.yearOnly === "0") {
                                $scope.options.yearOnly = false;
                            } else {
                                $scope.options.yearOnly = true;
                            }

                            $scope.options.periodId = $scope.widgetDefinedOptions.periodId;
                            $scope.options.current = $scope.widgetDefinedOptions.current;

                            angular.forEach($scope.widgetYears, function(obj) {
                                if (obj == $scope.widgetDefinedOptions.years)
                                    $scope.options.year = obj;
                            });

                            angular.forEach($scope.quarters, function(obj) {
                                if (obj.value == $scope.widgetDefinedOptions.quarters)
                                    $scope.options.quarters = obj.value;
                            });

                            angular.forEach($scope.months, function(obj) {
                                if (obj.value == $scope.widgetDefinedOptions.months)
                                    $scope.options.months = obj.value;
                            });
                            angular.element('#widgetOptions').modal({ show: true });
                        }

                    } else {
                        toaster.pop('error', 'Dashboard', res.data.error);
                    }
                });

        }

        $scope.getCurrentQuarter = function() {
            var today = new Date();
            var month = today.getMonth();
            var quarter;

            if (month < 4)
                quarter = 1;
            else if (month < 7)
                quarter = 2;
            else if (month < 10)
                quarter = 3;
            else if (month < 13)
                quarter = 4;

            return quarter;
        }


        var currentdate = new Date();
        var currentYear = '' + currentdate.getFullYear();
        $scope.setDefaultPeriod = function(period) {
            switch (period) {
                case 'year':
                    $scope.options.year = currentYear;
                    $scope.options.yearOnly = true;
                    $scope.options.quarters = '';
                    $scope.options.months = '';
                    break;
                case 'month':
                    $scope.options.months = currentdate.getMonth() + 1;
                    $scope.options.yearOnly = false;
                    $scope.options.quarters = '';
                    break;
                case 'quarter':
                    $scope.options.quarters = $scope.getCurrentQuarter();
                    $scope.options.year = currentYear;
                    $scope.options.yearOnly = false;
                    $scope.options.months = '';
            }
        }

        $scope.defaultWidgetOptions = function() {
            $scope.options.months = currentdate.getMonth() + 1;
            $scope.options.year = currentYear;
            $scope.options.current = '2';
            $scope.options.quarters = '';
            $scope.options.yearOnly = false;
        }

        $scope.emptyCurrent = function() {
            if ($scope.options.year == currentYear && $scope.options.yearOnly == true) {
                $scope.options.current = "0";
            } else if ($scope.options.year == currentYear && $scope.options.months == currentdate.getMonth() + 1) {
                $scope.options.current = '2';
            } else if ($scope.options.year == currentYear && $scope.options.quarters == $scope.getCurrentQuarter()) {
                $scope.options.current = '1';
            } else {
                $scope.options.current = '';
            }
        }


        $scope.setPeriod = function(periodId) {
            $scope.options.periodId = periodId;
            switch (periodId) {
                case 'year':
                    $scope.options.quarters = '';
                    $scope.options.months = '';
                    break;
                case 'month':
                    $scope.options.quarters = '';
                    $scope.options.yearOnly = '';
                    break;
                case 'quarter':
                    $scope.options.months = '';
                    $scope.options.yearOnly = '';
            }
        }




        $scope.updateWidgetContents = function() {
            var url = $scope.$root.dashboard + "update-widget-contents";
            $http.post(url, { token: $scope.$root.token, 'widgetID': $scope.selectedWidgetId, 'options': $scope.options })
                .then(function(res) {
                    if (res.data.ack == true) {
                        $scope.newQueryResults = res.data.newQueryResults;
                        angular.element('#widgetOptions').modal('hide');
                        $scope.getUserWidgets();
                    } else if (res.data.ack == 2) {
                        angular.element('#widgetOptions').modal('hide');
                        toaster.pop('error', 'Error', res.data.error);
                    } else if (res.data.ack == 3) {
                        // alert(res.data.error);
                        toaster.pop('error', 'Error', res.data.error);
                    } else {
                        toaster.pop('error', 'Widgets', res.data.error);
                    }
                });
        }

        $scope.setPeriodLabel = function() {
            switch ($scope.options.periodId) {
                case 'year':
                    $scope.periodLabel = $scope.options.year;
                    break;
                case 'month':
                    $scope.periodLabel = $scope.months.value[$scope.options.months] + ' ' + $scope.options.year;
                    break;
                case 'quarter':
                    $scope.periodLabel = $scope.months.value[$scope.options.quarters] + ' ' + $scope.options.year;
            }
        }


        $scope.destroyPdfModal = function(modalName) {
            angular.element(document.querySelector("#" + modalName)).remove();
        }

        $scope.reorderWidget = function() {
            $scope.allowReorder = !$scope.allowReorder;
            $scope.removeFromDashboard = false;
            var state = sortable.option("disabled");
            sortable.option("disabled", !state);
        };
        $scope.removeWidget = function() {
            $scope.removeFromDashboard = !$scope.removeFromDashboard;
            $scope.allowReorder = false;
        };

        $scope.saveWidgetPos = function() {
            var url = $scope.$root.dashboard + "save-widget-pos";
            $http.post(url, { token: $scope.$root.token, 'activeWidgetPos': activeWidgetPos })
                .then(function(res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Widgets', res.data.success);
                    } else {
                        toaster.pop('error', 'Widgets', res.data.error);
                    }
                });
        }

        $scope.addRemoveWidgetToDashboard = function(candidateWidget, active, index) {
            var url = $scope.$root.dashboard + "update-widget-active";
            $scope.loadingWidget = true;
            $scope.loadingWidget_index = index;
            $http.post(url, { widgetId: candidateWidget.id, token: $scope.$root.token, active: active })
                .then(function(res) {
                    if (res.data.ack == true) {
                        candidateWidget.active = active;
                        $scope.loadingWidget = false;
                        if (active == 0) {
                            var pos = $scope.activeWidgets.indexOf(candidateWidget)
                            $scope.activeWidgets.splice(pos, 1);
                        } else {
                            $scope.activeWidgets.push(candidateWidget);
                        }
                    } else {
                        $scope.loadingWidget = false;
                        toaster.pop('error', 'Info', res.data.error);
                    }
                });
        };



    }
]);

myApp.controller('DashboardSetupController', ['$scope', '$window', '$stateParams', '$filter', '$http', '$rootScope', "toaster", "$timeout", "$interpolate", "$compile",
    function($scope, $window, $stateParams, $filter, $http, $rootScope, toaster, $timeout, $interpolate, $compile) {

        $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'General', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Widget Roles', 'url': '#', 'isActive': false }
        ];

        $scope.setupWidgets = [];
        $scope.setupModule = 1;
        $scope.show_widget_readonly = true;
        // if ($stateParams.obj != undefined && $stateParams.obj.type != undefined && $stateParams.obj.type == 2)
        if ($stateParams.type != undefined && $stateParams.type == 2) {
            $scope.setupModule = $stateParams.type;
            $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
                { 'name': 'General', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
                { 'name': 'Reports Roles', 'url': '#', 'isActive': false }
            ];
        }

    }
]);