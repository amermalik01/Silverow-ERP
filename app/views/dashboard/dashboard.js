myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
<<<<<<< HEAD
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
=======
    function($stateProvider, $locationProvider, $urlRouterProvider, helper) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $stateProvider
            .state('app.widgetRoles', {
                url: '/widget_roles_setup/:type',
                params: { type: null },
                title: 'Setup',
                templateUrl: helper.basepath('dashboard/widget_roles_setup.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })

<<<<<<< HEAD
    }]);

myApp.controller('DashboardController', ['$scope', '$window', '$stateParams', '$filter', '$http', '$rootScope', "toaster", "$timeout", "$interpolate", "$compile", "moduleTracker",
    function ($scope, $window, $stateParams, $filter, $http, $rootScope, toaster, $timeout, $interpolate, $compile, moduleTracker) {
        
        $scope.$root.silverowVersionNumber = "1.0.20";
        $scope.$root.silverowVersionDate = "22th July 2020";
=======
    }
]);

myApp.controller('DashboardController', ['$scope', '$window', '$stateParams', '$filter', '$http', '$rootScope', "toaster", "$timeout", "$interpolate", "$compile", "moduleTracker",
    function($scope, $window, $stateParams, $filter, $http, $rootScope, toaster, $timeout, $interpolate, $compile, moduleTracker) {

        $scope.$root.nevicoVersionNumber = "1.0.20";
        $scope.$root.nevicoVersionDate = "22th July 2022";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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
<<<<<<< HEAD
        $scope.features = []; 
=======
        $scope.features = [];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.versionAdd = {};
        // $scope.versionAdd.date = $scope.$root.get_current_date();
        $scope.table = {};
        // $scope.months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
        $scope.months = [{ "value": 1, "month": "Jan" },
<<<<<<< HEAD
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
        { "value": 12, "month": "Dec" }];
        
        $scope.quarters = [{ "value": 1, "label": "Q1" },
        { "value": 2, "label": "Q2" },
        { "value": 3, "label": "Q3" },
        { "value": 4, "label": "Q4" }];
=======
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
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


        var sortable = Sortable.create(simpleList, {
            group: "dashboardWidgets",
            ghostClass: "sortable-ghost",
            animation: 100,
            handle: ".klip-toolbar",
            disabled: true,
            store: {
<<<<<<< HEAD
                get: function (sortable) {
                    var order = localStorage.getItem(sortable.options.group.name);
                    return order ? order.split('|') : [];
                },
                set: function (sortable) {
=======
                get: function(sortable) {
                    var order = localStorage.getItem(sortable.options.group.name);
                    return order ? order.split('|') : [];
                },
                set: function(sortable) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    var order = sortable.toArray();
                    localStorage.setItem(sortable.options.group.name, order.join('|'));
                    activeWidgetPos = [];
                    for (i = 0; i < sortable.el.children.length; i++) {
                        activeWidgetPos.push(sortable.el.children[i].children[0].id);
                    }
                }
            }
        });
<<<<<<< HEAD
        
        var vUrl = $scope.$root.dashboard + "get-version-data";
        $http.post(vUrl, { token: $scope.$root.token })
            .then(function (res) {
=======

        var vUrl = $scope.$root.dashboard + "get-version-data";
        $http.post(vUrl, { token: $scope.$root.token })
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    $scope.versions = res.data.response;
                } else {
                    toaster.pop('error', 'Info', res.data.error);
                }
            });

<<<<<<< HEAD
        $scope.checkCacheClear = function () {

        var chUrl = $scope.$root.dashboard + "check-released-version";
        $http.post(chUrl, { token: $scope.$root.token })
            .then(function (res) {
                if (res.data.ack == true) {
                    //toaster.pop('success', 'Dashboard', res.data.success);
                } else {
                    // toaster.pop('error', 'Dashboard', res.data.error);                            
                    toaster.pop('warning', 'Dashboard', 'Please Wait, Your cache is being cleared.');
                    $rootScope.showLoader = true;
                    $timeout(function () {
                        $scope.clearCache();                      
                    }, 1000)
                }
            });
        }
        $scope.checkCacheClear(); 

        $scope.clearCache = function(){            

                var scripts = [];
                $("script").each(function(i,e){
                    scripts.push(e);
                })

                $("script").each(function(i,e){
                    var src = $(e).attr("src");

                    if (src && src.indexOf("app/views/") > -1)
                    $(e).remove();
                })
                
                $timeout(function () {
                    scripts.forEach(function(e){
                        var src = $(e).attr("src");
                        if (src && src.indexOf("app/views/") > -1)
                        $("body").append(`<script async src='${src}'></script>`);
                       
                    })
                    var cacheInterval = setInterval(function(){
                        if (window.abc){
                            clearInterval(cacheInterval);
                            $rootScope.showLoader = false;
                            $timeout(function(){
                                toaster.pop('success', 'Dashboard', 'Application cache cleared successfully. Thank you for waiting.');
                            },0)
                            
                        }
                        console.log("cache status:",window.abc);
                    },500)               
                }, 500)
               
        }

        $scope.checkUserWidgetsRoles = function () {
=======
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
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.moduleTracker = moduleTracker;
            moduleTracker.updateName("");
            moduleTracker.updateRecord("");
            moduleTracker.updateRecordName("");
            var chUrl = $scope.$root.dashboard + "check-user-widgets-roles";
<<<<<<< HEAD
            $http.post(chUrl, { token: $scope.$root.token, 'userType': $rootScope.user_type, 'type':1 })
                .then(function (res) {
=======
            $http.post(chUrl, { token: $scope.$root.token, 'userType': $rootScope.user_type, 'type': 1 })
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        $scope.checkUserWidgets();
                    } else {
                        $scope.checkUserWidgets();
                    }
                });
        }
        $scope.checkUserWidgetsRoles();


<<<<<<< HEAD
        $scope.checkUserWidgets = function () {
            var cUrl = $scope.$root.dashboard + "check-user-widgets";
            $http.post(cUrl, { token: $scope.$root.token, 'userType': $rootScope.user_type, 'type': 1  })
                .then(function (res) {
=======
        $scope.checkUserWidgets = function() {
            var cUrl = $scope.$root.dashboard + "check-user-widgets";
            $http.post(cUrl, { token: $scope.$root.token, 'userType': $rootScope.user_type, 'type': 1 })
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        $scope.getUserWidgets();
                    } else {
                        $scope.getUserWidgets();
                    }
                });
        }


<<<<<<< HEAD
        $scope.checkUserReportsRoles = function () {
            var chUrl = $scope.$root.dashboard + "check-user-widgets-roles";
            $http.post(chUrl, { token: $scope.$root.token, 'userType': $rootScope.user_type, 'type': 2  })
                .then(function (res) {
=======
        $scope.checkUserReportsRoles = function() {
            var chUrl = $scope.$root.dashboard + "check-user-widgets-roles";
            $http.post(chUrl, { token: $scope.$root.token, 'userType': $rootScope.user_type, 'type': 2 })
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        /* $scope.checkUserWidgets();
                    } else {
                        $scope.checkUserWidgets(); */
                    }
                });
        }
        $scope.checkUserReportsRoles();



<<<<<<< HEAD
        
        $scope.getUserWidgets = function(){
            var url = $scope.$root.dashboard + "get-user-widgets";
            $http.post(url, { token: $scope.$root.token})
                .then(function (res) {
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
                        $scope.activeWidgets = $scope.allWidgets.filter(function (widget) {
                            return widget.active == 1;
                        });
                        console.log(typeof (totalSalesValue2));
                        $scope.salesWidgets = filterWidgetsForTabs($scope.salesWidgets, 0);
                        $scope.purchaseWidgets = filterWidgetsForTabs($scope.purchaseWidgets, 1);
                        $scope.managementWidget = filterWidgetsForTabs($scope.managementWidget, 2);
                        $scope.humanResources = filterWidgetsForTabs($scope.humanResources, 3);
    
                        angular.forEach($scope.allWidgets, function (obj) {
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
    
                        angular.forEach($scope.topCustSales, function (obj) {
                            $scope.totalSalesValue.push(Number(obj.value));
                        });
                        angular.forEach($scope.topSuppSales, function (obj) {
                            $scope.totalPurchaseValue.push(Number(obj.value));
                        });
                        angular.forEach($scope.salespersonPerformance, function (obj) {
                            $scope.totalSalespersonValue.push(Number(obj.value));
                        });
                        angular.forEach($scope.purchaserPerformance, function (obj) {
                            $scope.totalPurchaserValue.push(Number(obj.value));
                        });
                        angular.forEach($scope.topItemRevenue, function (obj) {
                            $scope.totalItemRevenue.push(Number(obj.revenue));
                            $scope.totalItemQty.push(Number(obj.qtysold));
                        });
                        angular.forEach($scope.outstandSalesOrder, function (obj) {
                            $scope.totalOutstandingSales.push(Number(obj.value));
                        });

                        angular.forEach($scope.outstandPurchaseOrder, function (obj) {
                            $scope.totalOutstandingPurchase.push(Number(obj.value));
                        });
                        
    
                        if ($scope.totalSalesValue.length > 0 ) 
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
                        angular.forEach($scope.oppoCycleWidget, function (obj) {
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

        

        $scope.addVersion = function () {
=======

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
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.versionAdd.date = $scope.$root.get_current_date();
            $scope.showAddForm = true;
        }

<<<<<<< HEAD
        $scope.cancelVersionModal = function () {
=======
        $scope.cancelVersionModal = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.showAddForm = false;
            $scope.bugs = [];
            $scope.features = [];
            $scope.versionAdd = {};
        }

<<<<<<< HEAD
        $scope.addBugToArray = function () {
=======
        $scope.addBugToArray = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            var temp = $scope.versionAdd.bugs;
            if (temp.length > 0) {
                $scope.bugs.push(temp);
                $scope.versionAdd.bugs = '';
            }
        }

<<<<<<< HEAD
        $scope.addFeatureToArray = function () {
=======
        $scope.addFeatureToArray = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            var temp = $scope.versionAdd.features;
            if (temp.length > 0) {
                $scope.features.push(temp);
                $scope.versionAdd.features = '';
            }
        }

<<<<<<< HEAD
        $scope.updateVersionData = function () {
            var url = $scope.$root.dashboard + "update-version-data";
            $http.post(url, { token: $scope.$root.token, 'data': $scope.versionAdd, 'bugs': $scope.bugs, 'features': $scope.features})
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Dashboard', res.data.success);
                        $timeout(function () {
                            $scope.showAddForm = false;  
                            $scope.viewVersion();                      
=======
        $scope.updateVersionData = function() {
            var url = $scope.$root.dashboard + "update-version-data";
            $http.post(url, { token: $scope.$root.token, 'data': $scope.versionAdd, 'bugs': $scope.bugs, 'features': $scope.features })
                .then(function(res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Dashboard', res.data.success);
                        $timeout(function() {
                            $scope.showAddForm = false;
                            $scope.viewVersion();
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        }, 500)
                    } else {
                        toaster.pop('error', 'Dashboard', res.data.error);
                    }
                });
        }





        function sumArray(arrayName) {
<<<<<<< HEAD
            arrayName = arrayName.reduce(function (a, b) {
=======
            arrayName = arrayName.reduce(function(a, b) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                return a + b;
            });
            return arrayName;
        };

        function filterWidgetsForTabs(arrayName, type) {
<<<<<<< HEAD
            arrayName = $scope.allWidgets.filter(function (widget) {
=======
            arrayName = $scope.allWidgets.filter(function(widget) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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

<<<<<<< HEAD
        $scope.openWidgetOptions = function (id) {
=======
        $scope.openWidgetOptions = function(id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.options = {};
            $scope.selectedWidgetId = id;
            var url = $scope.$root.dashboard + "open-widget-options-modal";
            $http.post(url, { token: $scope.$root.token, 'widgetID': id })
<<<<<<< HEAD
                .then(function (res) {
                    if (res.data.ack == true) {
                        
                        $scope.widgetYears = res.data.response;

                        $scope.widgetDefinedOptions = res.data.widgetOptionData;
                        if ($scope.widgetDefinedOptions != undefined){
=======
                .then(function(res) {
                    if (res.data.ack == true) {

                        $scope.widgetYears = res.data.response;

                        $scope.widgetDefinedOptions = res.data.widgetOptionData;
                        if ($scope.widgetDefinedOptions != undefined) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                            if ($scope.widgetDefinedOptions.yearOnly === "0") {
                                $scope.options.yearOnly = false;
                            } else {
<<<<<<< HEAD
                                $scope.options.yearOnly = true;                                
=======
                                $scope.options.yearOnly = true;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            }

                            $scope.options.periodId = $scope.widgetDefinedOptions.periodId;
                            $scope.options.current = $scope.widgetDefinedOptions.current;

<<<<<<< HEAD
                            angular.forEach($scope.widgetYears,function(obj){
=======
                            angular.forEach($scope.widgetYears, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (obj == $scope.widgetDefinedOptions.years)
                                    $scope.options.year = obj;
                            });

<<<<<<< HEAD
                            angular.forEach($scope.quarters, function (obj) {
                                if (obj.value == $scope.widgetDefinedOptions.quarters)
                                    $scope.options.quarters = obj.value ;
                            });

                            angular.forEach($scope.months, function (obj) {
                                if (obj.value == $scope.widgetDefinedOptions.months)
                                    $scope.options.months = obj.value ;
                            });
                            angular.element('#widgetOptions').modal({ show: true });
                        }
                        
=======
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

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    } else {
                        toaster.pop('error', 'Dashboard', res.data.error);
                    }
                });

        }

<<<<<<< HEAD
        $scope.getCurrentQuarter = function () {
=======
        $scope.getCurrentQuarter = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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


<<<<<<< HEAD
        var currentdate = new Date(); 
        var currentYear = '' + currentdate.getFullYear();
        $scope.setDefaultPeriod = function (period){
=======
        var currentdate = new Date();
        var currentYear = '' + currentdate.getFullYear();
        $scope.setDefaultPeriod = function(period) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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

<<<<<<< HEAD
        $scope.defaultWidgetOptions = function () {
=======
        $scope.defaultWidgetOptions = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.options.months = currentdate.getMonth() + 1;
            $scope.options.year = currentYear;
            $scope.options.current = '2';
            $scope.options.quarters = '';
            $scope.options.yearOnly = false;
        }

<<<<<<< HEAD
        $scope.emptyCurrent = function () {
            if ($scope.options.year == currentYear && $scope.options.yearOnly == true){
                $scope.options.current = "0";
            } else if ($scope.options.year == currentYear && $scope.options.months == currentdate.getMonth() + 1){
                $scope.options.current = '2';
            } else if ($scope.options.year == currentYear && $scope.options.quarters == $scope.getCurrentQuarter()){
=======
        $scope.emptyCurrent = function() {
            if ($scope.options.year == currentYear && $scope.options.yearOnly == true) {
                $scope.options.current = "0";
            } else if ($scope.options.year == currentYear && $scope.options.months == currentdate.getMonth() + 1) {
                $scope.options.current = '2';
            } else if ($scope.options.year == currentYear && $scope.options.quarters == $scope.getCurrentQuarter()) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.options.current = '1';
            } else {
                $scope.options.current = '';
            }
        }


<<<<<<< HEAD
        $scope.setPeriod = function (periodId) {
=======
        $scope.setPeriod = function(periodId) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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




<<<<<<< HEAD
        $scope.updateWidgetContents = function () {
            var url = $scope.$root.dashboard + "update-widget-contents";
            $http.post(url, { token: $scope.$root.token, 'widgetID': $scope.selectedWidgetId, 'options': $scope.options })
                .then(function (res) {
=======
        $scope.updateWidgetContents = function() {
            var url = $scope.$root.dashboard + "update-widget-contents";
            $http.post(url, { token: $scope.$root.token, 'widgetID': $scope.selectedWidgetId, 'options': $scope.options })
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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

<<<<<<< HEAD
        $scope.setPeriodLabel = function () {
            switch ($scope.options.periodId) {
                case 'year':
                    $scope.periodLabel = $scope.options.year;                    
=======
        $scope.setPeriodLabel = function() {
            switch ($scope.options.periodId) {
                case 'year':
                    $scope.periodLabel = $scope.options.year;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    break;
                case 'month':
                    $scope.periodLabel = $scope.months.value[$scope.options.months] + ' ' + $scope.options.year;
                    break;
<<<<<<< HEAD
                case 'quarter': 
=======
                case 'quarter':
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.periodLabel = $scope.months.value[$scope.options.quarters] + ' ' + $scope.options.year;
            }
        }


<<<<<<< HEAD
        $scope.destroyPdfModal = function (modalName) {
            angular.element(document.querySelector("#" + modalName)).remove();
        }

        $scope.reorderWidget = function () {
=======
        $scope.destroyPdfModal = function(modalName) {
            angular.element(document.querySelector("#" + modalName)).remove();
        }

        $scope.reorderWidget = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.allowReorder = !$scope.allowReorder;
            $scope.removeFromDashboard = false;
            var state = sortable.option("disabled");
            sortable.option("disabled", !state);
        };
<<<<<<< HEAD
        $scope.removeWidget = function () {
=======
        $scope.removeWidget = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.removeFromDashboard = !$scope.removeFromDashboard;
            $scope.allowReorder = false;
        };

<<<<<<< HEAD
        $scope.saveWidgetPos = function () {
            var url = $scope.$root.dashboard + "save-widget-pos";
            $http.post(url, { token: $scope.$root.token, 'activeWidgetPos': activeWidgetPos })
                .then(function (res) {
=======
        $scope.saveWidgetPos = function() {
            var url = $scope.$root.dashboard + "save-widget-pos";
            $http.post(url, { token: $scope.$root.token, 'activeWidgetPos': activeWidgetPos })
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Widgets', res.data.success);
                    } else {
                        toaster.pop('error', 'Widgets', res.data.error);
                    }
                });
        }

<<<<<<< HEAD
        $scope.addRemoveWidgetToDashboard = function (candidateWidget, active, index) {
=======
        $scope.addRemoveWidgetToDashboard = function(candidateWidget, active, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            var url = $scope.$root.dashboard + "update-widget-active";
            $scope.loadingWidget = true;
            $scope.loadingWidget_index = index;
            $http.post(url, { widgetId: candidateWidget.id, token: $scope.$root.token, active: active })
<<<<<<< HEAD
                .then(function (res) {
=======
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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



<<<<<<< HEAD
    }]);

myApp.controller('DashboardSetupController', ['$scope', '$window', '$stateParams', '$filter', '$http', '$rootScope', "toaster", "$timeout", "$interpolate", "$compile",
    function ($scope, $window, $stateParams, $filter, $http, $rootScope, toaster, $timeout, $interpolate, $compile) {

        $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
        { 'name': 'General', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
        { 'name': 'Widget Roles', 'url': '#', 'isActive': false }];
=======
    }
]);

myApp.controller('DashboardSetupController', ['$scope', '$window', '$stateParams', '$filter', '$http', '$rootScope', "toaster", "$timeout", "$interpolate", "$compile",
    function($scope, $window, $stateParams, $filter, $http, $rootScope, toaster, $timeout, $interpolate, $compile) {

        $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'General', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Widget Roles', 'url': '#', 'isActive': false }
        ];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.setupWidgets = [];
        $scope.setupModule = 1;
        $scope.show_widget_readonly = true;
        // if ($stateParams.obj != undefined && $stateParams.obj.type != undefined && $stateParams.obj.type == 2)
<<<<<<< HEAD
        if ($stateParams.type != undefined && $stateParams.type == 2)
        {
            $scope.setupModule = $stateParams.type;
            $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'General', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Reports Roles', 'url': '#', 'isActive': false }];
        }

    }]);
=======
        if ($stateParams.type != undefined && $stateParams.type == 2) {
            $scope.setupModule = $stateParams.type;
            $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
                { 'name': 'General', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
                { 'name': 'Reports Roles', 'url': '#', 'isActive': false }
            ];
        }

    }
]);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
