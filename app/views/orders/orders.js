myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
<<<<<<< HEAD
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
=======
    function($stateProvider, $locationProvider, $urlRouterProvider, helper) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.orders', {
                url: '/orders/:query_filter',
                title: 'Sales',
                templateUrl: helper.basepath('orders/orders.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.addOrder', {
                url: '/orders/add',
                title: 'Sales',
                templateUrl: helper.basepath('addTabs.html'),
                controller: 'OrderEditController',
                resolve: helper.resolveFor('ngTable', 'ngDialog')

            })
            .state('app.viewOrder', {
                url: '/orders/:id/view?isInvoice',
                title: 'Sales',
                templateUrl: helper.basepath('addTabs.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'OrderEditController'
            })
            .state('app.editOrder', {
                url: '/orders/:id/edit',
                title: 'Sales',
                templateUrl: helper.basepath('addTabs.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'OrderEditController'
            })
            .state('app.sale-invoice', {
                url: '/sale-invoice/:query_filter',
                title: 'Sales',
                templateUrl: helper.basepath('orders/salesorders.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })

<<<<<<< HEAD
            .state('app.salesQuotes', {
=======
        .state('app.salesQuotes', {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                url: '/sales-quotes',
                title: 'Sales',
                templateUrl: helper.basepath('orders/quotes.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.addSaleQuote', {
                url: '/sales-quotes/add',
                title: 'Sales',
                templateUrl: helper.basepath('addTabs.html'),
                controller: 'OrderEditController',
                resolve: helper.resolveFor('ngTable', 'ngDialog')

            })
            .state('app.viewSaleQuote', {
                url: '/sales-quotes/:id/view',
                title: 'Sales',
                templateUrl: helper.basepath('addTabs.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'OrderEditController'
            })
            .state('app.editSaleQuote', {
                url: '/sales-quotes/:id/edit',
                title: 'Sales',
                templateUrl: helper.basepath('addTabs.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'OrderEditController'
            })
<<<<<<< HEAD
    }]);
SaleInvoiceController.$inject = ["$scope", "$stateParams", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$rootScope", "moduleTracker"];
myApp.controller('SaleInvoiceController', SaleInvoiceController);
=======
    }
]);
SaleInvoiceController.$inject = ["$scope", "$stateParams", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$rootScope", "moduleTracker"];
myApp.controller('SaleInvoiceController', SaleInvoiceController);

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
function SaleInvoiceController($scope, $stateParams, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $rootScope, moduleTracker) {
    'use strict';

    moduleTracker.updateName("sales");
    moduleTracker.updateAdditional("sales invoice");
    moduleTracker.updateRecord("");



<<<<<<< HEAD
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            // { 'name': 'Setup', 'url': '#', 'isActive': false },
            { 'name': 'Sales', 'url': '#', 'isActive': false },
            { 'name': 'Customers', 'url': 'app.customer', 'isActive': false },
            { 'name': 'Sales Invoices', 'url': '#', 'isActive': false }];
=======
    $scope.breadcrumbs = [ //{'name':'Dashboard','url':'app.dashboard','isActive':false},
        // { 'name': 'Setup', 'url': '#', 'isActive': false },
        { 'name': 'Sales', 'url': '#', 'isActive': false },
        { 'name': 'Customers', 'url': 'app.customer', 'isActive': false },
        { 'name': 'Sales Invoices', 'url': '#', 'isActive': false }
    ];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    var vm = this;
    var Api = $scope.$root.sales + "customer/order/listings";
    // var postData = {
    //     'token': $scope.$root.token,
    //     'all': "1",
    //     'type': 2
    // };

    // $scope.$watch("MyCustomeFilters", function () {
    //     if ($scope.MyCustomeFilters && $scope.table.tableParams5) {
    //         $scope.table.tableParams5.reload();
    //     }
    // }, true);

    // $scope.MyCustomeFilters = {};

    // vm.tableParams5 = new ngParams({
    //     page: 1, // show first page
    //     count: $scope.$root.pagination_limit, // count per page
    //     sorting: { Code: 'Desc' },
    //     filter: {
    //         name: '',
    //         age: ''
    //     }
    // }, {
    //         total: 0, // length of data
    //         counts: [], // hide page counts control

    //         getData: function ($defer, params) {

    //             // ngDataService.getData( $defer, params, Api,$filter,$scope,postData);
    //             ngDataService.getDataCustom($defer, params, Api, $filter, $scope, postData);
    //         }
    //     });

    $scope.searchKeyword = {};
    $scope.selectedRecBulkEmail = [];



<<<<<<< HEAD
    $scope.getSalesInvoiceListing = function (item_paging, sort_column, sortform) {
=======
    $scope.getSalesInvoiceListing = function(item_paging, sort_column, sortform) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.postData = {};
        $scope.postData = {
            'token': $scope.$root.token,
            'all': "1",
            'type': 2
        };

        if (item_paging == 1)
            $scope.item_paging.spage = 1

        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
            $scope.record_data = {};
        }


        if ($stateParams.query_filter != undefined && $stateParams.query_filter.length > 0) {
            var query_string = window.atob($stateParams.query_filter);
            var query_arr = query_string.split('^^^^');
            $scope.searchKeyword.posting_date = {};
            $scope.searchKeyword.sale_person = {};

            $scope.searchKeyword.posting_date.lowerLimit = query_arr[0];
            $scope.searchKeyword.posting_date.upperLimit = query_arr[1];
            $scope.searchKeyword.sale_person.type = "drop_down";
            $scope.searchKeyword.sale_person.value = query_arr[2];
        }
        $scope.postData.searchKeyword = $scope.searchKeyword;

        /*$scope.sortform=sortform;
         $scope.reversee = ('desc' === $scope.sortform) ? !$scope.reversee : false;
         $scope.sort_column=sort_column;
         */
        $scope.showLoader = true;
        $http
            .post(Api, $scope.postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.tableData = res;
                $scope.showLoader = false;
                $scope.columns = [];
                $scope.record = {};
                $scope.recordArray = [];
                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;
<<<<<<< HEAD
                    angular.forEach(res.data.response, function (value, key) {
=======
                    angular.forEach(res.data.response, function(value, key) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (key != "tbl_meta_data") {
                            $scope.recordArray.push(value);
                        }
                    });
                    $scope.record = res.data.response;
<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (index != 'chk' && index != 'id') {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }
                    });
                }
                //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
<<<<<<< HEAD
            }).catch(function (message) {
=======
            }).catch(function(message) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.showLoader = false;
                // toaster.pop('error', 'info', 'Server is not Acknowledging');
                throw new Error(message.data);
                console.log(message.data);
            });
    }



    // $scope.getSalesInvoiceListing(1);


<<<<<<< HEAD
    $scope.getItem = function (parm) {
=======
    $scope.getItem = function(parm) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.rec.token = $scope.$root.token;
        //$scope.rec.warehouse_id = $scope.rec.warehouse !=undefined? $scope.rec.warehouse.id:'';
        //$scope.rec.category_id = $scope.rec.category !=undefined? $scope.rec.category.id:'';
        if (parm == 'all') {
            $scope.rec = {};
            $scope.rec.token = $scope.$root.token;
        }
        $scope.rec.type = 2;
        $scope.rec.account_type = 1;
        $scope.postData = $scope.rec;

        $scope.$root.$broadcast("myReload");
    }

<<<<<<< HEAD
    $scope.$on("myReload", function (event) {
=======
    $scope.$on("myReload", function(event) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        //var ApiAjax = $resource('api/company/get_listing_ajax/:module_id/:module_table/:filter_id/:more_fields/:condition');

        // ngDataService.getDataCustom( $scope.MainDefer, $scope.mainParams, Api,$scope.mainFilter,$scope,$scope.postData);
        // ngDataService.getDataCustom($defer, params, Api, $filter, $scope, $scope.postData);
        $scope.table.tableParams5.reload();
        //return;
    });


    $scope.$data = {};
<<<<<<< HEAD
    $scope.delete = function (id, index, $data) {
=======
    $scope.delete = function(id, index, $data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var delUrl = $scope.$root.sales + "customer/order/delete-order";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        $data.splice(index, 1);
                    }
                    else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
=======
        }).then(function(value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function(res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        $data.splice(index, 1);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };


<<<<<<< HEAD
    $scope.convert = function (id, index, $data) {
=======
    $scope.convert = function(id, index, $data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var delUrl = $scope.$root.sales + "customer/order/convert-to-invoice";
        ngDialog.openConfirm({
            template: 'app/views/srm_order/_confirm_convert_modal.html',
            className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, type: 2, 'module': 1, 'token': $scope.$root.token })
                .then(function (res) {
=======
        }).then(function(value) {
            $http
                .post(delUrl, { id: id, type: 2, 'module': 1, 'token': $scope.$root.token })
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(229, ['Order']));
                        $data.splice(index, 1);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(235));
                    }
                });
<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

<<<<<<< HEAD
    $scope.ShowLinkToPO = function (id) {
=======
    $scope.ShowLinkToPO = function(id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // $scope.showLoader = true;
        $scope.filterPurchaseOrder = {};
        var prodApi = $scope.$root.sales + "crm/crm/get-purchase-order-by-sale-id";
        var postData = {
            'token': $scope.$root.token,
            'id': id,
            'all': "1",
            'type': 2,
        };

        $scope.selectedAllPurchaseOrder = false;
        $scope.PurchaseOrderArr = [];

        $http
            .post(prodApi, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.showLoader = false;

                if (res.data.ack == true) {

                    $scope.PurchaseOrderArr = res.data.response;
                    for (var i = 0; i < $scope.PurchaseOrderArr.length; i++) {
                        $scope.PurchaseOrderArr[i].disableCheck = 1;
                        $scope.PurchaseOrderArr[i].chk = true;
                    }
                    angular.element('#_PurchaseOrdersModal').modal({ show: true });
<<<<<<< HEAD
                }
                else
=======
                } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(389));
            });

    }
<<<<<<< HEAD
    $scope.clearPendingPurchaseOrder = function () {
=======
    $scope.clearPendingPurchaseOrder = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // $scope.PendingSelectedPurchaseOrder = [];
        angular.element('#_PurchaseOrdersModal').modal('hide');
    }


<<<<<<< HEAD
    $scope.bulkEmailOption = function () {
        // console.log($scope.selectedRecBulkEmail);

        $scope.emailOrderList = $scope.recordArray.filter(function (o, i) {
=======
    $scope.bulkEmailOption = function() {
        // console.log($scope.selectedRecBulkEmail);

        $scope.emailOrderList = $scope.recordArray.filter(function(o, i) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            return ($scope.selectedRecBulkEmail.findIndex(s => s.key == o.id) > -1);
        });

        // console.log($scope.emailOrderList);

        $scope.bulkOptionChk = {};

        if ($scope.emailOrderList.length > 0) {

            angular.element('#_bulkOptionsModal').modal({ show: true });

        } else {
            $rootScope.animateBulkEmail = false;
            $rootScope.animateBulkEmailText = '';
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(236, ['Sales Invoice']));
        }
    }

    $rootScope.BulkEmailMessage = "";




<<<<<<< HEAD
    $scope.bulkOptionConfirm = function (bulkOptionChk) {
=======
    $scope.bulkOptionConfirm = function(bulkOptionChk) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564






        // console.log(bulkOptionChk); return false;

        angular.element('#_bulkOptionsModal').modal('hide');

        let currentUrl = window.location.href;
        $scope.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;

        // if (bulkOptionChk.saveAsPdf == true) {





        if (bulkOptionChk == 'saveAsPdf') {

            $rootScope.animateBulkEmail = true;
            $rootScope.animateBulkEmailText = 'Downloading PDF(s)';

            console.log("downloading pdfs...")
<<<<<<< HEAD
            // console.log($scope.emailOrderList.length);
=======
                // console.log($scope.emailOrderList.length);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            var prntInvoiceUrl = $scope.$root.sales + "customer/order/bulk-print-invoice";
            $http
                .post(prntInvoiceUrl, {
                    'emailOrderList': $scope.emailOrderList,
                    'module': 'SalesInvoices',
                    'Option': 'saveAsPdf',
                    'OptionType': 1,
                    'company_logo_url': $scope.company_logo_url,
                    'token': $scope.$root.token
                })
<<<<<<< HEAD
                .then(function (res) {
=======
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    $rootScope.animateBulkEmail = false;
                    $rootScope.animateBulkEmailText = '';


                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', 'PDF(s) Generated Successfully.');

                        var link = document.createElement('a');

                        link.setAttribute('download', null);
                        link.style.display = 'none';

                        link.setAttribute('href', res.data.file_url);
                        link.click();
<<<<<<< HEAD
                    }
                    else {
                        toaster.pop('error', 'Info', "PDF(s) Generation Failed.");
                    }
                }, function (err) {
                    console.log(err);
                });

        }
        else if (bulkOptionChk == 'email') {
=======
                    } else {
                        toaster.pop('error', 'Info', "PDF(s) Generation Failed.");
                    }
                }, function(err) {
                    console.log(err);
                });

        } else if (bulkOptionChk == 'email') {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            // else if (bulkOptionChk.email == true){


            $rootScope.BulkEmailMessage = "Sales Invoice(s)";

            ngDialog.openConfirm({
                template: 'BulkEmailConfirmationMessage',
                className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
            }).then(function (value) {
=======
            }).then(function(value) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                $rootScope.animateBulkEmail = true;
                $rootScope.animateBulkEmailText = 'Sending Email(s)';

                // console.log($scope.emailOrderList.length);
                var prntInvoiceUrl = $scope.$root.sales + "customer/order/bulk-print-invoice";
                $http
                    .post(prntInvoiceUrl, {
                        'emailOrderList': $scope.emailOrderList,
                        'module': 'SalesInvoices',
                        'Option': 'email',
                        'OptionType': 1,
                        'company_logo_url': $scope.company_logo_url,
                        'token': $scope.$root.token
                    })
<<<<<<< HEAD
                    .then(function (res) {
=======
                    .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        $rootScope.animateBulkEmail = false;
                        $rootScope.animateBulkEmailText = '';

                        if (res.data.ack == 2) {
                            // toaster.pop('warning', 'Info', res.data.rejectedInvoicesCounter + ' Email(s) sending Failed!');
                            toaster.pop({
                                type: "warning",
                                title: "Info",
                                body: "Email could not be sent for the following Sales Invoices <br/>" + res.data.error.toString(),
                                timeout: 0,
                                bodyOutputType: 'trustedHtml',
                                tapToDismiss: false
                            });
<<<<<<< HEAD
                        }
                        else if (res.data.ack == true) {
                            toaster.pop('success', 'Info', 'Email(s) Sent Successfully.');

                            $timeout(function () {
                                $scope.getSalesInvoiceListing();
                            }, 500);
                        }
                        else {
=======
                        } else if (res.data.ack == true) {
                            toaster.pop('success', 'Info', 'Email(s) Sent Successfully.');

                            $timeout(function() {
                                $scope.getSalesInvoiceListing();
                            }, 500);
                        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            // toaster.pop('error', 'Info', "Email(s) Sending Failed.");
                            toaster.pop('warning', 'Info', "Email(s) Sending Failed. " + res.data.error);
                        }
                    });
<<<<<<< HEAD
            }, function (reason) {
=======
            }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                $rootScope.animateBulkEmail = false;
                $rootScope.animateBulkEmailText = '';
                console.log('Modal promise rejected. Reason: ', reason);
            });
<<<<<<< HEAD
        }
        else if (bulkOptionChk == 'xml'){

            $rootScope.animateBulkEmail = true;
            $rootScope.animateBulkEmailText = 'Uploading E-Invoice';//Creating Xml(s)

            console.log("creatign xml...")
            // console.log($scope.emailOrderList.length);
=======
        } else if (bulkOptionChk == 'xml') {

            $rootScope.animateBulkEmail = true;
            $rootScope.animateBulkEmailText = 'Uploading E-Invoice'; //Creating Xml(s)

            console.log("creatign xml...")
                // console.log($scope.emailOrderList.length);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            var prntInvoiceUrl = $scope.$root.sales + "customer/order/bulk-xml-invoice";
            $http
                .post(prntInvoiceUrl, {
                    'emailOrderList': $scope.emailOrderList,
                    'module': 'SalesInvoices',
                    'Option': 'xml',
                    'OptionType': 1,
                    'company_logo_url': $scope.company_logo_url,
                    'token': $scope.$root.token
                })
<<<<<<< HEAD
                .then(function (res) {
=======
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    $rootScope.animateBulkEmail = false;
                    $rootScope.animateBulkEmailText = '';


                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', 'E-Invoice Uploaded Successfully.');

<<<<<<< HEAD
                        if(res.data.rejectedXMLCounter>0)
                            toaster.pop('warning', 'Info', res.data.rejectedXMLMsg);
                                  
=======
                        if (res.data.rejectedXMLCounter > 0)
                            toaster.pop('warning', 'Info', res.data.rejectedXMLMsg);

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        /* var link = document.createElement('a');

                        link.setAttribute('download', null);
                        link.style.display = 'none';

                        link.setAttribute('href', res.data.file_url);
                        link.click();  */
<<<<<<< HEAD
                    }
                    else {
                        toaster.pop('error', 'Info', "E-Invoice Uploading Failed.");

                        if(res.data.rejectedXMLCounter>0)
                            toaster.pop('warning', 'Info', res.data.rejectedXMLMsg);
                    }
                }, function (err) {
=======
                    } else {
                        toaster.pop('error', 'Info', "E-Invoice Uploading Failed.");

                        if (res.data.rejectedXMLCounter > 0)
                            toaster.pop('warning', 'Info', res.data.rejectedXMLMsg);
                    }
                }, function(err) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    console.log(err);
                });

        }

    }
}

OrdersController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$stateParams", "$state", "$rootScope", "moduleTracker"];
myApp.controller('OrdersController', OrdersController);
<<<<<<< HEAD
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
function OrdersController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams, $state, $rootScope, moduleTracker) {
    'use strict';

    var vm = this;
    var Api = $scope.$root.sales + "customer/order/listings";

    moduleTracker.updateName("sales");
    moduleTracker.updateRecord("");

    if ($state.current.name.match("Quote")) {
        moduleTracker.updateAdditional("sales quote");
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
            'type': 0
        };
<<<<<<< HEAD
        $scope.breadcrumbs =
            [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
                // { 'name': 'Setup', 'url': '#', 'isActive': false },
                { 'name': 'Sales', 'url': '#', 'isActive': false },
                { 'name': 'Customers', 'url': 'app.customer', 'isActive': false },
                { 'name': 'Sales Quotes', 'url': '#', 'isActive': false }];
=======
        $scope.breadcrumbs = [ //{'name':'Dashboard','url':'app.dashboard','isActive':false},
            // { 'name': 'Setup', 'url': '#', 'isActive': false },
            { 'name': 'Sales', 'url': '#', 'isActive': false },
            { 'name': 'Customers', 'url': 'app.customer', 'isActive': false },
            { 'name': 'Sales Quotes', 'url': '#', 'isActive': false }
        ];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    } else {
        moduleTracker.updateAdditional("sales order");
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
            'type': 1
        };
<<<<<<< HEAD
        $scope.breadcrumbs =
            [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
                // { 'name': 'Setup', 'url': '#', 'isActive': false },
                { 'name': 'Sales', 'url': '#', 'isActive': false },
                { 'name': 'Customers', 'url': 'app.customer', 'isActive': false },
                { 'name': 'Sales Orders', 'url': '#', 'isActive': false }];
=======
        $scope.breadcrumbs = [ //{'name':'Dashboard','url':'app.dashboard','isActive':false},
            // { 'name': 'Setup', 'url': '#', 'isActive': false },
            { 'name': 'Sales', 'url': '#', 'isActive': false },
            { 'name': 'Customers', 'url': 'app.customer', 'isActive': false },
            { 'name': 'Sales Orders', 'url': '#', 'isActive': false }
        ];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    }
    $scope.searchKeyword = {};
    $scope.selectedRecBulkEmail = [];

<<<<<<< HEAD
    $scope.getOrderListing = function (item_paging, sort_column, sortform) {
=======
    $scope.getOrderListing = function(item_paging, sort_column, sortform) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.postData = {};
        if ($state.current.name.match("Quote")) {
            $scope.postData = {
                'token': $scope.$root.token,
                'all': "1",
                'type': 0
            };

        } else {
            $scope.postData = {
                'token': $scope.$root.token,
                'all': "1",
                'type': 1
            };

        }

        if (item_paging == 1)
            $scope.item_paging.spage = 1

        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
            $scope.record_data = {};
        }

        if ($stateParams.query_filter != undefined && $stateParams.query_filter.length > 0) {
            var query_string = window.atob($stateParams.query_filter);
            var query_arr = query_string.split('^^^^');
            $scope.searchKeyword.posting_date = {};
            $scope.searchKeyword.sale_person = {};

            if (query_arr && query_arr[0] != "i×") {
                $scope.searchKeyword.posting_date.lowerLimit = query_arr[0];
                $scope.searchKeyword.posting_date.upperLimit = query_arr[1];
                $scope.searchKeyword.sale_person.type = "drop_down";
                $scope.searchKeyword.sale_person.value = query_arr[2];
            }

        }

        $scope.postData.searchKeyword = $scope.searchKeyword;

        /*$scope.sortform=sortform;
         $scope.reversee = ('desc' === $scope.sortform) ? !$scope.reversee : false;
         $scope.sort_column=sort_column;
         */
        $scope.showLoader = true;
        $http
            .post(Api, $scope.postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.tableData = res;
                $scope.showLoader = false;
                $scope.columns = [];
                $scope.recordArray = [];
                $scope.record = {};
                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

<<<<<<< HEAD
                    angular.forEach(res.data.response, function (value, key) {
=======
                    angular.forEach(res.data.response, function(value, key) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (key != "tbl_meta_data") {
                            $scope.recordArray.push(value);
                        }
                    });

                    $scope.record = res.data.response;
<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (index != 'chk' && index != 'id') {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }
                    });
                }
                //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
<<<<<<< HEAD
            }).catch(function (message) {
=======
            }).catch(function(message) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.showLoader = false;
                // toaster.pop('error', 'info', 'Server is not Acknowledging');
                throw new Error(message.data);
                console.log(message.data);
            });
    }



    // $scope.getOrderListing(1);

    // $scope.$watch("MyCustomeFilters", function () {
    //     if ($scope.MyCustomeFilters && $scope.table.tableParams5) {
    //         $scope.table.tableParams5.reload();
    //     }
    // }, true);

    // $scope.MyCustomeFilters = {};

    // vm.tableParams5 = new ngParams({
    //     page: 1, // show first page
    //     count: $scope.$root.pagination_limit, // count per page
    //     filter: {
    //         name: '',
    //         age: ''
    //     }
    // }, {
    //         total: 0, // length of data
    //         counts: [], // hide page counts control

    //         getData: function ($defer, params) {
    //             // ngDataService.getData( $defer, params, Api,$filter,$scope,postData);
    //             ngDataService.getDataCustom($defer, params, Api, $filter, $scope, postData);
    //         }
    //     });


<<<<<<< HEAD
    $scope.getItem = function (parm) {
=======
    $scope.getItem = function(parm) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.rec.token = $scope.$root.token;
        //$scope.rec.warehouse_id = $scope.rec.warehouse !=undefined? $scope.rec.warehouse.id:'';
        //$scope.rec.category_id = $scope.rec.category !=undefined? $scope.rec.category.id:'';
        if (parm == 'all') {
            $scope.rec = {};
            $scope.rec.token = $scope.$root.token;
        }
        $scope.rec.type = 1;
        $scope.postData = $scope.rec;

        $scope.$root.$broadcast("myReload");
    }

<<<<<<< HEAD
    $scope.$on("myReload", function (event) {
=======
    $scope.$on("myReload", function(event) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        //var ApiAjax = $resource('api/company/get_listing_ajax/:module_id/:module_table/:filter_id/:more_fields/:condition');

        // ngDataService.getDataCustom( $scope.MainDefer, $scope.mainParams, Api,$scope.mainFilter,$scope,$scope.postData);
        // ngDataService.getDataCustom($defer, params, Api, $filter, $scope, $scope.postData);
        $scope.table.tableParams5.reload();
        //return;
    });


    $scope.$data = {};
<<<<<<< HEAD
    $scope.delete = function (id, index, $data) {
=======
    $scope.delete = function(id, index, $data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var delUrl = $scope.$root.sales + "customer/order/delete-order";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        $data.splice(index, 1);
                    }
                    else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
=======
        }).then(function(value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function(res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        $data.splice(index, 1);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };


<<<<<<< HEAD
    $scope.convert = function (id, index, $data) {
=======
    $scope.convert = function(id, index, $data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var delUrl = $scope.$root.sales + "customer/order/convert-to-invoice";
        ngDialog.openConfirm({
            template: 'app/views/srm_order/_confirm_convert_modal.html',
            className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, type: 2, 'module': 1, 'token': $scope.$root.token })
                .then(function (res) {
=======
        }).then(function(value) {
            $http
                .post(delUrl, { id: id, type: 2, 'module': 1, 'token': $scope.$root.token })
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(229, ['Order']));
                        $data.splice(index, 1);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(235, ['to Order']));
                    }
                });
<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };



<<<<<<< HEAD
    $scope.ShowLinkToPO = function (id) {
=======
    $scope.ShowLinkToPO = function(id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // $scope.showLoader = true;
        $scope.filterPurchaseOrder = {};
        var prodApi = $scope.$root.sales + "crm/crm/get-purchase-order-by-sale-id";
        var postData = {
            'token': $scope.$root.token,
            'id': id,
            'all': "1",
            'type': 2,
        };

        $scope.selectedAllPurchaseOrder = false;
        $scope.PurchaseOrderArr = [];

        $http
            .post(prodApi, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.showLoader = false;

                if (res.data.ack == true) {

                    $scope.PurchaseOrderArr = res.data.response;
                    for (var i = 0; i < $scope.PurchaseOrderArr.length; i++) {
                        $scope.PurchaseOrderArr[i].disableCheck = 1;
                        $scope.PurchaseOrderArr[i].chk = true;
                    }
                    angular.element('#_PurchaseOrdersModal').modal({ show: true });
<<<<<<< HEAD
                }
                else
=======
                } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(389));
            });

    }
<<<<<<< HEAD
    $scope.clearPendingPurchaseOrder = function () {
=======
    $scope.clearPendingPurchaseOrder = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // $scope.PendingSelectedPurchaseOrder = [];
        angular.element('#_PurchaseOrdersModal').modal('hide');
    }


<<<<<<< HEAD
    $scope.PostAllOrders = function () {
        var postUrl = $scope.$root.sales + "customer/order/post-all-orders";
        var ids = '';
        if ($scope.tableData.data.total > 0) {
            angular.forEach($scope.tableData.data.response, function (order) {
=======
    $scope.PostAllOrders = function() {
        var postUrl = $scope.$root.sales + "customer/order/post-all-orders";
        var ids = '';
        if ($scope.tableData.data.total > 0) {
            angular.forEach($scope.tableData.data.response, function(order) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (order.id != undefined)
                    ids += order.id + ',';
            });
            ids = ids.substring(0, ids.length - 1);
        }
        if (ids.length > 0) {
            $rootScope.post_all_order_msg = "Are you sure you want to post these " + (ids.split(',').length) + " Sale Orders?";

            ngDialog.openConfirm({
                template: '_confirm_all_order_posting',
                className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
            }).then(function (value) {
                $scope.showLoader = true;
                $http
                    .post(postUrl, { 'token': $scope.$root.token, 'ids': ids, 'type': '1' })
                    .then(function (res) {
=======
            }).then(function(value) {
                $scope.showLoader = true;
                $http
                    .post(postUrl, { 'token': $scope.$root.token, 'ids': ids, 'type': '1' })
                    .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (res.data.ack == true) {
                            $scope.showLoader = false;
                            toaster.pop('warning', 'Info', res.data.success_count + ' posted successfully out of ' + res.data.all_count);
                            $scope.getOrderListing();
                        }
                    });
<<<<<<< HEAD
            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
        }
        else {
=======
            }, function(reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(390));
        }
    }

<<<<<<< HEAD
    $scope.bulkEmailOption = function () {
        // console.log($scope.selectedRecBulkEmail);
        $scope.emailOrderList = $scope.recordArray.filter(function (o, i) {
=======
    $scope.bulkEmailOption = function() {
        // console.log($scope.selectedRecBulkEmail);
        $scope.emailOrderList = $scope.recordArray.filter(function(o, i) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            return ($scope.selectedRecBulkEmail.findIndex(s => s.key == o.id) > -1);
        });

        // console.log($scope.emailOrderList);

        $scope.bulkOptionChk = {};

        if ($scope.emailOrderList.length > 0) {

            angular.element('#_bulkOptionsModal').modal({ show: true });

        } else {
            $rootScope.animateBulkEmail = false;
            $rootScope.animateBulkEmailText = '';
            if ($scope.$state.$current.name == 'app.orders')
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(236, ['Sales Order']));
            else
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(236, ['Sales Quote']));
        }

        /* if ($scope.emailOrderList.length > 0) {

            
            

            ngDialog.openConfirm({
                template: 'BulkEmailConfirmationMessage',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {

                $rootScope.animateBulkEmail = true;
                $rootScope.animateBulkEmailText = 'Sending Email(s)';

                // console.log($scope.emailOrderList.length);
                var prntInvoiceUrl = $scope.$root.sales + "customer/order/bulk-print-invoice";
                $http
                    .post(prntInvoiceUrl, {
                        'emailOrderList': $scope.emailOrderList,
                        'module': 'SalesOrders',
                        'token': $scope.$root.token
                    })
                    .then(function (res) {

                        $rootScope.animateBulkEmail = false;
                        $rootScope.animateBulkEmailText = '';

                        if (res.data.ack == 2) {
                            // toaster.pop('warning', 'Info', res.data.rejectedInvoicesCounter + ' Email(s) sending Failed!');
                            toaster.pop({
                                type: "warning",
                                title: "Info",
                                body: "Email could not be sent for the following invoices <br/>" + res.data.rejectedInvoices.toString(),
                                timeout: 0,
                                bodyOutputType: 'trustedHtml',
                                tapToDismiss: false
                            });
                        }
                        else if (res.data.ack == true) {
                            toaster.pop('success', 'Info', 'Email(s) Sent Successfully.');

                            $timeout(function () {
                                $scope.getOrderListing();
                            }, 500);
                        }
                        else {
                            toaster.pop('error', 'Info', "Email(s) Sending Failed.");
                        }
                    });
            }, function (reason) {

                $rootScope.animateBulkEmail = false;
                $rootScope.animateBulkEmailText = '';
                console.log('Modal promise rejected. Reason: ', reason);
            });

        } else {
            $rootScope.animateBulkEmail = false;
            $rootScope.animateBulkEmailText = '';
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(236, ['Sales Orders']));
        } */
    }

    $rootScope.BulkEmailMessage = "";

<<<<<<< HEAD
    $scope.bulkOptionConfirm = function (bulkOptionChk) {
=======
    $scope.bulkOptionConfirm = function(bulkOptionChk) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        // console.log(bulkOptionChk); return false;

        angular.element('#_bulkOptionsModal').modal('hide');

        let currentUrl = window.location.href;
        $scope.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;

        // if (bulkOptionChk.saveAsPdf == true) {
        if (bulkOptionChk == 'saveAsPdf') {

            $rootScope.animateBulkEmail = true;
            $rootScope.animateBulkEmailText = 'Downloading PDF(s)';

            if ($state.current.name.match("Quote")) {
                $scope.module = "SalesQuotes";
            } else {
                $scope.module = "SalesOrders";
            }

            // console.log($scope.emailOrderList.length);
            var prntInvoiceUrl = $scope.$root.sales + "customer/order/bulk-print-invoice";
            $http
                .post(prntInvoiceUrl, {
                    'emailOrderList': $scope.emailOrderList,
                    'module': $scope.module,
                    'Option': 'saveAsPdf',
                    'OptionType': 1,
                    'company_logo_url': $scope.company_logo_url,
                    'token': $scope.$root.token
                })
<<<<<<< HEAD
                .then(function (res) {
=======
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    $rootScope.animateBulkEmail = false;
                    $rootScope.animateBulkEmailText = '';

                    console.log(res);


                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', 'PDF(s) Generated Successfully.');

                        /* angular.forEach(res.data.PdfLinks,function(rec){
                            window.open(rec, '_blank');
                        });  */

                        var link = document.createElement('a');
                        link.setAttribute('download', null);
                        link.style.display = 'none';
                        document.body.appendChild(link);
                        // angular.forEach(res.data.PdfLinks, function (rec, idx) {
                        // console.log("downloading: ", rec, " | ", idx);
                        // link.setAttribute('id', "");
                        link.setAttribute('href', res.data.file_url);
                        link.click();

                        // });
                        document.body.removeChild(link);

<<<<<<< HEAD
                    }
                    else {
=======
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        toaster.pop('error', 'Info', "PDF(s) Generation Failed.");
                    }
                });

<<<<<<< HEAD
        }
        else if (bulkOptionChk == 'email') {
=======
        } else if (bulkOptionChk == 'email') {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            // else if (bulkOptionChk.email == true) {


            if ($state.current.name.match("Quote")) {
                $rootScope.BulkEmailMessage = "Sales Quote(s)";
            } else {
                $rootScope.BulkEmailMessage = "Sales Order(s)";
            }

            if ($state.current.name.match("Quote")) {
                $scope.module = "SalesQuotes";
                $scope.module2 = "Sales Quotes";
            } else {
                $scope.module = "SalesOrders";
                $scope.module2 = "Sales Orders";
            }

            ngDialog.openConfirm({
                template: 'BulkEmailConfirmationMessage',
                className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
            }).then(function (value) {
=======
            }).then(function(value) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                $rootScope.animateBulkEmail = true;
                $rootScope.animateBulkEmailText = 'Sending Email(s)';

                // console.log($scope.emailOrderList.length);
                var prntInvoiceUrl = $scope.$root.sales + "customer/order/bulk-print-invoice";
                $http
                    .post(prntInvoiceUrl, {
                        'emailOrderList': $scope.emailOrderList,
                        'module': $scope.module,
                        'Option': 'email',
                        'OptionType': 1,
                        'company_logo_url': $scope.company_logo_url,
                        'token': $scope.$root.token
                    })
<<<<<<< HEAD
                    .then(function (res) {
=======
                    .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        $rootScope.animateBulkEmail = false;
                        $rootScope.animateBulkEmailText = '';

                        if (res.data.ack == 2) {
                            // toaster.pop('warning', 'Info', res.data.rejectedInvoicesCounter + ' Email(s) sending Failed!');
                            toaster.pop({
                                type: "warning",
                                title: "Info",
                                body: "Email could not be sent for the following " + $scope.module2 + " <br/>" + res.data.error.toString(),
                                timeout: 0,
                                bodyOutputType: 'trustedHtml',
                                tapToDismiss: false
                            });
<<<<<<< HEAD
                        }
                        else if (res.data.ack == true) {
                            toaster.pop('success', 'Info', 'Email(s) Sent Successfully.');

                            $timeout(function () {
                                $scope.getOrderListing();
                            }, 500);
                        }
                        else {
                            toaster.pop('warning', 'Info', "Email(s) Sending Failed. " + res.data.error);
                        }
                    });
            }, function (reason) {
=======
                        } else if (res.data.ack == true) {
                            toaster.pop('success', 'Info', 'Email(s) Sent Successfully.');

                            $timeout(function() {
                                $scope.getOrderListing();
                            }, 500);
                        } else {
                            toaster.pop('warning', 'Info', "Email(s) Sending Failed. " + res.data.error);
                        }
                    });
            }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                $rootScope.animateBulkEmail = false;
                $rootScope.animateBulkEmailText = '';
                console.log('Modal promise rejected. Reason: ', reason);
            });
        }

    }
}

myApp.controller('OrderEditController', OrderEditController);
<<<<<<< HEAD
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
function OrderEditController($scope, $stateParams, $http, $state, $resource, toaster, ngDialog, $rootScope, $timeout, $filter, serviceVariables, moduleTracker) {
    // emailButtonFlag.$watch(function(){

    // })
    $scope.serviceVariables = serviceVariables;
    $scope.show_recieve_list = true;
    // $rootScope.updateSelectedGlobalData("item");
    $scope.check_so_readonly = false;
<<<<<<< HEAD
=======
    $scope.check_si_readonly = false;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    $scope.waitFormarginAnalysis = false;
    moduleTracker.updateName("sales");
    moduleTracker.updateRecord($stateParams.id);


    if ($stateParams.id > 0)
        $scope.check_so_readonly = true;

    if ($rootScope.show_sales_add_btn == 0 && $state.current.name.match("addOrder")) {
        $state.go('app.addSaleQuote');
    }

    if ($state.current.name.match("Quote")) {
        $scope.isSaleQuote = 1;
    } else {
        $scope.isSaleQuote = 0;
    }


<<<<<<< HEAD
    $scope.showEditForm = function () {
        $scope.check_so_readonly = false;
        $scope.show_recieve_list = false;
         $scope.waitFormarginAnalysis = true;
=======
    $scope.showEditForm = function() {
        $scope.check_so_readonly = false;
        $scope.show_recieve_list = false;
        $scope.waitFormarginAnalysis = true;
    }

    $scope.showInvoiceEditForm = function() {
        $scope.check_si_readonly = true;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $scope.show_btn_dispatch_stuff = false;
    $scope.submit_show_invoicee = true;


    $rootScope.delivery_terms_arr = [
<<<<<<< HEAD
        {'id': '1','name': '(CFR) COST AND FREIGHT'},
        {'id': '2','name': '(CIF) COST, INSURANCE AND FREIGHT'},
        {'id': '3','name': '(CIP) CARRIAGE AND INSURANCE PAID TO'},
        {'id': '4','name': '(CPT) CARRIAGE PAID TO'},
        {'id': '5','name': '(DAF) DELIVERED AT FRONTIER'},
        {'id': '6','name': '(DDP) DELIVERED DUTY PAID'},
        {'id': '7','name': '(DDU) DELIVERED DUTY UNPAID'},
        {'id': '8','name': '(DEQ) DELIVERED EX QUAY'},
        {'id': '9','name': '(DES) DELIVERED EX SHIP'},
        {'id': '10','name': '(EXW) EX WORKS'},
        {'id': '11','name': '(FAS) FREE ALONG SHIP'},
        {'id': '12','name': '(FCA) FREE CARRIER'},
        {'id': '13','name': '(FOB) FREE ON BOARD'}];


    $rootScope.transport_mode_arr = [
        {'id': '0','name': 'Transport mode not specified'},
        {'id': '1','name': 'Maritime transport'},
        {'id': '2','name': 'Rail transport'},
        {'id': '3','name': 'Road transport'},
        {'id': '4','name': 'Air transport'},
        {'id': '5','name': 'Mail'},
        {'id': '6','name': 'Multimodal transport'},
        {'id': '7','name': 'Fixed transport installations'},
        {'id': '8','name': 'Inland water transport'},
        {'id': '9','name': 'Transport mode not applicable'}];

    $scope.rec = {};

    $scope.GetApprovalPreData = function () {
        var APIUrl = $scope.$root.sales + "customer/order/get-approval-pre-data";
        var postData = {
            'token': $scope.$root.token
        };
        $http
            .post(APIUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.rec.credit_limit_approval_req = res.data.credit_limit_approval_req;
                    $scope.credit_limit_approval_req = res.data.credit_limit_approval_req;
                    $scope.margin_analysis_approval_req = res.data.margin_analysis_approval_req;
                    $scope.rec.credit_limit_approval_status = 0;
                    $scope.rec.is_whole_seller = res.data.is_whole_seller;
                }
                else {
                    $scope.rec.credit_limit_approval_req = 0;
                    $scope.credit_limit_approval_req = 0;
                    $scope.rec.credit_limit_approval_status = 0;
                    $scope.margin_analysis_approval_req = 0;
                    $scope.rec.is_whole_seller = res.data.is_whole_seller;
                }
            });
    }
    // if (!($stateParams.id > 0))
=======
        { 'id': '1', 'name': '(CFR) COST AND FREIGHT' },
        { 'id': '2', 'name': '(CIF) COST, INSURANCE AND FREIGHT' },
        { 'id': '3', 'name': '(CIP) CARRIAGE AND INSURANCE PAID TO' },
        { 'id': '4', 'name': '(CPT) CARRIAGE PAID TO' },
        { 'id': '5', 'name': '(DAF) DELIVERED AT FRONTIER' },
        { 'id': '6', 'name': '(DDP) DELIVERED DUTY PAID' },
        { 'id': '7', 'name': '(DDU) DELIVERED DUTY UNPAID' },
        { 'id': '8', 'name': '(DEQ) DELIVERED EX QUAY' },
        { 'id': '9', 'name': '(DES) DELIVERED EX SHIP' },
        { 'id': '10', 'name': '(EXW) EX WORKS' },
        { 'id': '11', 'name': '(FAS) FREE ALONG SHIP' },
        { 'id': '12', 'name': '(FCA) FREE CARRIER' },
        { 'id': '13', 'name': '(FOB) FREE ON BOARD' }
    ];


    $rootScope.transport_mode_arr = [
        { 'id': '0', 'name': 'Transport mode not specified' },
        { 'id': '1', 'name': 'Maritime transport' },
        { 'id': '2', 'name': 'Rail transport' },
        { 'id': '3', 'name': 'Road transport' },
        { 'id': '4', 'name': 'Air transport' },
        { 'id': '5', 'name': 'Mail' },
        { 'id': '6', 'name': 'Multimodal transport' },
        { 'id': '7', 'name': 'Fixed transport installations' },
        { 'id': '8', 'name': 'Inland water transport' },
        { 'id': '9', 'name': 'Transport mode not applicable' }
    ];

    $scope.rec = {};

    $scope.GetApprovalPreData = function() {
            var APIUrl = $scope.$root.sales + "customer/order/get-approval-pre-data";
            var postData = {
                'token': $scope.$root.token
            };
            $http
                .post(APIUrl, postData)
                .then(function(res) {
                    if (res.data.ack == true) {
                        $scope.rec.credit_limit_approval_req = res.data.credit_limit_approval_req;
                        $scope.credit_limit_approval_req = res.data.credit_limit_approval_req;
                        $scope.margin_analysis_approval_req = res.data.margin_analysis_approval_req;
                        $scope.rec.credit_limit_approval_status = 0;
                        $scope.rec.is_whole_seller = res.data.is_whole_seller;
                    } else {
                        $scope.rec.credit_limit_approval_req = 0;
                        $scope.credit_limit_approval_req = 0;
                        $scope.rec.credit_limit_approval_status = 0;
                        $scope.margin_analysis_approval_req = 0;
                        $scope.rec.is_whole_seller = res.data.is_whole_seller;
                    }
                });
        }
        // if (!($stateParams.id > 0))
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    $scope.GetApprovalPreData();


    if ($scope.isSaleQuote == 1)
        $scope.rec.type2 = 0;
    else
        $scope.rec.type2 = 1;




    if ($stateParams.isInvoice != undefined) {
        $scope.isInvoice = 1;
        $scope.rec.type2 = 3;
<<<<<<< HEAD
    }
    else
=======
    } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.isInvoice = 0;

    if ($scope.rec.type2 == 0) {
        var link_order = 'app.salesQuotes';
        var name_link = 'Sales Quotes';
        moduleTracker.updateAdditional("sales quote");
<<<<<<< HEAD
    }
    else if ($scope.rec.type2 == 1) {
        var link_order = 'app.orders';
        var name_link = 'Sales Orders';
        moduleTracker.updateAdditional("sales order");
    }
    else {
=======
    } else if ($scope.rec.type2 == 1) {
        var link_order = 'app.orders';
        var name_link = 'Sales Orders';
        moduleTracker.updateAdditional("sales order");
    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var link_order = 'app.sale-invoice';
        var name_link = 'Sales Invoices';
        moduleTracker.updateAdditional("sales invoice");
    }



    if ($scope.rec.type2 == 0) {
<<<<<<< HEAD
        $scope.$root.breadcrumbs =
            [//{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
                { 'name': 'Sales', 'url': '#', 'isActive': false },
                { 'name': 'Customers', 'url': 'app.customer', 'isActive': false },
                { 'name': name_link, 'url': link_order, 'isActive': false }
            ];
    }
    else if ($scope.rec.type2 == 1) {
        $scope.$root.breadcrumbs =
            [//{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
                { 'name': 'Sales', 'url': '#', 'isActive': false },
                { 'name': 'Customers', 'url': 'app.customer', 'isActive': false },
                { 'name': name_link, 'url': link_order, 'isActive': false }
            ];

    }
    else {
        $scope.$root.breadcrumbs =
            [//{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
                { 'name': 'Sales', 'url': '#', 'isActive': false },
                { 'name': 'Customers', 'url': 'app.customer', 'isActive': false },
                { 'name': name_link, 'url': link_order, 'isActive': false }
            ];
=======
        $scope.$root.breadcrumbs = [ //{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
            { 'name': 'Sales', 'url': '#', 'isActive': false },
            { 'name': 'Customers', 'url': 'app.customer', 'isActive': false },
            { 'name': name_link, 'url': link_order, 'isActive': false }
        ];
    } else if ($scope.rec.type2 == 1) {
        $scope.$root.breadcrumbs = [ //{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
            { 'name': 'Sales', 'url': '#', 'isActive': false },
            { 'name': 'Customers', 'url': 'app.customer', 'isActive': false },
            { 'name': name_link, 'url': link_order, 'isActive': false }
        ];

    } else {
        $scope.$root.breadcrumbs = [ //{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
            { 'name': 'Sales', 'url': '#', 'isActive': false },
            { 'name': 'Customers', 'url': 'app.customer', 'isActive': false },
            { 'name': name_link, 'url': link_order, 'isActive': false }
        ];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    }

    $scope.rec.account_type = 1;

    $scope.rec.crm_id = false;
    $scope.rec.freight_charges
    if ($stateParams.id > 0) {
        $scope.rec.id = $stateParams.id;
        $scope.$root.order_id = $stateParams.id;
<<<<<<< HEAD
    }
    else {
=======
    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.$root.order_id = 0;
        $scope.rec.id = 0;
        $scope.selectedPurchaseOrderArr = [];
        $scope.selectedPurchaseOrderModal = [];
    }

    if (!($stateParams.id > 0)) {

        $scope.rec.posting_date = $scope.$root.get_current_date();
        $scope.rec.offer_date = $scope.$root.get_current_date();
        $scope.rec.dispatch_date = $scope.$root.get_current_date();
        $scope.rec.delivery_date = $scope.$root.get_current_date();
    }


<<<<<<< HEAD
    $scope.$on('InvoicePosted', function (event, data) {
=======
    $scope.$on('InvoicePosted', function(event, data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var current_type = data.type2;
        $scope.rec2 = {};
        $scope.rec = {};

        $scope.rec.type2 = 1;
        $scope.rec.account_type = 1;
        $scope.selectedPurchaseOrders = "";
        $scope.check_so_readonly = false;
        $scope.show_btn_dispatch_stuff = false;
        $scope.submit_show_invoicee = true;
        $scope.showEditForm();

        $scope.rec.id = 0;
        $scope.$root.order_id = 0;
        $scope.$root.crm_id = 0;

        $scope.rec.posting_date = $scope.$root.get_current_date();
        $scope.rec.offer_date = $scope.$root.get_current_date();
        $scope.rec.dispatch_date = $scope.$root.get_current_date();
        $scope.rec.delivery_date = $scope.$root.get_current_date();
        $scope.GetSalesOrderStages(0);

    });

    /* 
    $scope.getCustomerInit = function (item_paging) {

        var custUrl = $scope.$root.sales + "customer/customer/getCustomerListings";

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.postData.all = 1;
        $scope.postData.type = 99;
        if (item_paging == 1)
            $rootScope.item_paging.spage = 1;

        $scope.postData.page = $rootScope.item_paging.spage;
        $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;
        
        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword_cust = {};
            $scope.record_data = {};
        }
        
        $http
            .post(custUrl, $scope.postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.columns = [];
                    $scope.record = {};
                    // $scope.columns = res.data.columns;
                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.total_paging_record = res.data.total_paging_record;
                    //$scope.showLoader = false;

                    $scope.record = res.data.response;
                    
                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }
            });
    }
    $scope.getCustomerInit(); */
    $rootScope.get_posting_vat();
    $scope.arrSalesperson = [];

<<<<<<< HEAD
    $scope.$on("myEvent", function (event, args) {
=======
    $scope.$on("myEvent", function(event, args) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (args.order_id != undefined)
            $stateParams.id = args.order_id;

        $scope.rec.country_ids = $scope.rec.country_ids;


        if (args.arr_contact != undefined) {
            $scope.rec.bill_to_contact_no = args.arr_contact.sell_to_contact_no;
            $scope.rec.bill_to_contact_id = args.arr_contact.contact_id;
        }
        if (args.objCust != undefined) {
            //  $scope.rec.id = args.objCust.order_id;
            $scope.rec.bill_to_cust_no = args.objCust.sell_to_cust_no;
            $scope.rec.bill_to_cust_id = args.objCust.bill_to_cust_id;
            // $scope.rec.sell_to_cust_id = args.objCust.sell_to_cust_id;

            $scope.rec.bill_to_name = args.objCust.bill_to_customer;
            $scope.rec.bill_to_address = args.objCust.bill_to_address;
            $scope.rec.bill_to_address2 = args.objCust.bill_to_address2;
            $scope.rec.bill_to_city = args.objCust.bill_to_city;
            $scope.rec.bill_to_county = args.objCust.bill_to_county;
            $scope.rec.bill_to_post_code = args.objCust.bill_to_post_code;
            /// shipping
            $scope.rec.ship_to_name = args.objCust.bill_to_customer;
            $scope.rec.ship_to_address = args.objCust.bill_to_address;
            $scope.rec.ship_to_address2 = args.objCust.bill_to_address2;
            $scope.rec.ship_to_city = args.objCust.bill_to_city;
            $scope.rec.ship_to_county = args.objCust.bill_to_county;
            $scope.rec.ship_to_post_code = args.objCust.bill_to_post_code;

        }
        return false;
    });

    // $rootScope.get_currency_list();
    // $scope.arr_sublistcurrency = {};
    // $timeout(function () {
    // $scope.arr_sublistcurrency = $rootScope.arr_currency;

    /* angular.forEach($scope.arr_sublistcurrency, function (elem) {
        if ((elem.id == $scope.$root.defaultCurrency) && ($stateParams.id == undefined))
            $scope.rec.currency_id = elem;
    }); */

    // }, 2000);

    //	$rootScope.get_country_list();
    // $rootScope.get_country_list();


    $scope.class = 'block';
    $scope.check_readonly = true;
    $scope.finance_read_only = false;
<<<<<<< HEAD
    $scope.formUrl = function () {
        return "app/views/orders/_form.html";
    }
    /*angular.element('.finance_order,.invoice_information,.shiping_information,.comments,.images,.documents').removeClass('dont-click');
     */
=======
    $scope.formUrl = function() {
            return "app/views/orders/_form.html";
        }
        /*angular.element('.finance_order,.invoice_information,.shiping_information,.comments,.images,.documents').removeClass('dont-click');
         */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


    // $scope.arr_payment_terms = {};

    var getPaymentTerms = $scope.$root.setup + "crm/get-payment-terms-list";
    var getPaymentMethods = $scope.$root.setup + "crm/get-payment-methods-list";

    /*  $http
         .post(getPaymentTerms, { token: $scope.$root.token })
         .then(function (res) {
             $scope.arr_payment_terms = res.data.response;
         }); */
    /* $http
        .post(getPaymentMethods, { token: $scope.$root.token })
        .then(function (res) {
            $scope.arr_payment_methods = res.data.response;
        }); */

<<<<<<< HEAD
    $scope.$on('SalesLines', function (event, data) {
=======
    $scope.$on('SalesLines', function(event, data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.items = data;
    });

    $scope.searchKeyword_cust = {};

<<<<<<< HEAD
    $scope.getCustomer = function (item_paging) {
=======
    $scope.getCustomer = function(item_paging) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (item_paging) {
            $scope.searchKeyword_cust = {};
        }
        //$scope.rec.type2 !=0 && 

        if ($scope.items != undefined && $scope.items.length > 0 && !($scope.rec.ref_po_id > 0)) {

            if ($scope.rec.type2 != 0)
                toaster.pop('error', 'Error', 'Please delete the added item(s) or GL before changing customer in this sales order.');
            else
                toaster.pop('error', 'Error', 'Please delete the added item(s) or GL before changing customer in this sales quote.');

            return false;
        }
        // $scope.searchKeyword_cust = {};
        if ($scope.rec.account_type == 1)
            $scope.title = 'Customer Listing';
        else if ($scope.rec.account_type == 2)
            $scope.title = 'CRM Listing';

        if (Number($scope.rec.sell_to_cust_id) > 0)
            $scope.removeCustOption = 1;
        else
            $scope.removeCustOption = 0;

        /* $scope.columns = [];
        $scope.record = {};
        $scope.record = $rootScope.customer_arr; */

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.postData.account_type = $scope.rec.account_type;

        $scope.postData.searchKeyword = $scope.searchKeyword_cust;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword_cust = {};
            $scope.record_data = {};
        }


        var customerListingApi = $scope.$root.sales + "customer/order/customer-popup";

        $scope.showLoader = true;

        $http
            .post(customerListingApi, $scope.postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.customerTableData = res;
                if (res.data.ack == true) {

                    angular.element('#customer_modal_single').modal({ show: true });

                    $scope.showLoader = false;
<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.showLoader = false;
                }
            });
    }

<<<<<<< HEAD
    $scope.confirmCustomer = function (result) {
=======
    $scope.confirmCustomer = function(result) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if ($scope.$root.breadcrumbs.length > 3) {

            if ($scope.rec.sale_quote_code) {
                $scope.$root.model_code = result.name + '(' + $scope.rec.sale_quote_code + ')';
            } else if ($scope.rec.sale_order_code) {
                $scope.$root.model_code = result.name + '(' + $scope.rec.sale_order_code + ')';
<<<<<<< HEAD
            }
            else {
=======
            } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.$root.model_code = result.name;
            }
            $scope.$root.breadcrumbs[3].name = $scope.$root.model_code;
        }

        if ($scope.$root.breadcrumbs.length == 3) {
            if ($scope.rec.sale_quote_code) {
                $scope.$root.model_code = result.name + '(' + $scope.rec.sale_quote_code + ')';
            } else if ($scope.rec.sale_order_code) {
                $scope.$root.model_code = result.name + '(' + $scope.rec.sale_order_code + ')';
<<<<<<< HEAD
            }
            else {
=======
            } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.$root.model_code = result.name;
            }

            $scope.$root.breadcrumbs.push({ 'name': $scope.$root.model_code, 'url': '#', 'isActive': false });
        }



        angular.element('#customer_modal_single').modal('hide');
        var custUrl = $scope.$root.sales + "customer/customer/getCustomerForOrder";
        $scope.showLoader = true;
        $http
            .post(custUrl, { id: result.id, 'token': $scope.$root.token, 'account_type': $scope.rec.account_type })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    result = res.data.response;

                    if (res.data.response) {
                        try {
                            $scope.customerInvoiceEmail = res.data.response.invoice_email;
                            $scope.customerStatementEmail = res.data.response.statement_email;
                            $scope.customerReminderEmail = res.data.response.reminder_email;
<<<<<<< HEAD
                        }
                        catch (ex) {
=======
                        } catch (ex) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            console.log(ex);
                        }
                    }

                    if (res.data.response.customer_emails) {
                        var customerEmails = [];
<<<<<<< HEAD
                        angular.forEach(res.data.response.customer_emails.split(","), function (obj, i) {
=======
                        angular.forEach(res.data.response.customer_emails.split(","), function(obj, i) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (obj)
                                customerEmails.push({ id: i, username: obj.trim() })
                        });
                        $scope.rec.customer_emails = customerEmails;
                    }

                    var objCust = {};

                    $scope.currency_arr_local = res.data.response.currency_arr_local;

<<<<<<< HEAD
                    angular.forEach($scope.currency_arr_local, function (obj) {
=======
                    angular.forEach($scope.currency_arr_local, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (obj.id === result.currency_id)
                            $scope.rec.currency_id = obj;
                    });

                    $scope.rec.currency_rate = res.data.response.currency_rate;

                    $scope.rec.sell_to_cust_no = result.code;
                    $scope.rec.sell_to_cust_name = result.title;
                    $scope.rec.sell_to_address = result.address_1;
                    $scope.rec.sell_to_address2 = result.address_2;
                    $scope.rec.sell_to_city = result.city;
                    $scope.rec.sell_to_county = result.county;
                    $scope.rec.sell_to_post_code = result.postcode;
                    $scope.rec.segment_id = result.segment_id;
                    $scope.rec.region_id = result.region_id;
                    $scope.rec.buying_grp_id = result.buying_id;

                    $rootScope.arr_vat_post_grp_sales = res.data.response.arr_vat_post_grp_sales;
                    $rootScope.arr_posting_grp = res.data.response.arr_posting_grp;
                    $rootScope.arr_paymentTerms = res.data.response.arr_paymentTerms;
                    $rootScope.arr_paymentMethods = res.data.response.arr_paymentMethods;

                    console.log($rootScope.arr_vat_post_grp_sales);

<<<<<<< HEAD
                    angular.forEach($rootScope.country_type_arr, function (elems) {
=======
                    angular.forEach($rootScope.country_type_arr, function(elems) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (elems.id == result.country_id)
                            $scope.rec.country_ids = elems;
                    });

                    $scope.rec.sell_to_cust_id = objCust.bill_to_cust_id = result.id;
                    $scope.$root.crm_id = result.id;
                    //contact info
                    $scope.rec.sell_to_contact_no = result.contact_person;
                    $scope.rec.cust_phone = result.Telephone;
                    $scope.rec.cust_fax = result.fax;
                    $scope.rec.cust_email = result.email;

                    $scope.rec.sale_person = result.empname;
                    $scope.rec.sale_person_id = result.sale_person_id;
                    $scope.rec.customer_balance = result.customer_balance;
                    $scope.rec.credit_limit = result.credit_limit;
                    $scope.rec.anonymous_customer = Number(result.anonymous_customer);

<<<<<<< HEAD
=======
                    $scope.rec.payable_number = res.data.response.account_payable_number;
                    $scope.rec.account_payable_number = res.data.response.account_payable_number;
                    $scope.rec.account_payable_id = res.data.response.account_payable_id;



>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    // // if ($scope.rec.id == undefined) 
                    // {
                    //     /* ================= */
                    //     /* Finance details */
                    //     /* ================= */

                    //     if (result.account_payable_number == null && result.purchase_code_number == null) {
                    //         toaster.pop('error', 'Error', 'No Finance details available for this customer !');
                    //         $scope.rec.bill_to_cust_no = '';

                    //         $scope.rec.contact_person = '';
                    //         $scope.rec.email = '';
                    //         $scope.rec.phone = '';
                    //         $scope.rec.fax = '';
                    //         $scope.rec.bill_to_address = '';
                    //         $scope.rec.bill_to_address2 = '';
                    //         $scope.rec.alt_contact_person = '';
                    //         $scope.rec.alt_contact_email = '';
                    //         $scope.drp.payment_terms_ids = '';
                    //         $scope.rec.due_date = '';
                    //         $scope.drp.payment_method_ids = '';
                    //         $scope.drp.vat_bus_posting_group = '';
                    //         $scope.drp.finance_charges_ids = '';
                    //         $scope.drp.insurance_charges_ids = '';
                    //         $scope.rec.company_reg_no = '';
                    //         $scope.bill_to_bank_name = '';
                    //         $scope.rec.account_name = '';
                    //         $scope.rec.account_no = '';
                    //         $scope.rec.swift_no = '';
                    //         $scope.rec.iban = '';
                    //         $scope.rec.sort_code = '';
                    //         $scope.rec.bill_bank_name = '';
                    //         $scope.rec.vat_number = '';
                    //         $scope.rec.bill_to_customer = 0;
                    //     }
                    //     else
                    $scope.confirmFinance(result);

                    /* ============================= */
                    /* Sales Order Invoice detail */
                    /* ============================= */

                    if (result.billing_address_details != undefined) {
                        $scope.rec.bill_to_address = result.billing_address_details.address_1;
                        $scope.rec.bill_to_address2 = result.billing_address_details.address_2;
                        $scope.rec.bill_to_city = result.billing_address_details.city;
                        $scope.rec.bill_to_county = result.billing_address_details.county;
                        $scope.rec.bill_to_post_code = result.billing_address_details.postcode;

<<<<<<< HEAD
                        angular.forEach($rootScope.country_type_arr, function (elems) {
                            if (elems.id == result.billing_address_details.country)
                                $scope.rec.bill_to_country_ids = elems;
                        });
                    }
                    else {
=======
                        angular.forEach($rootScope.country_type_arr, function(elems) {
                            if (elems.id == result.billing_address_details.country)
                                $scope.rec.bill_to_country_ids = elems;
                        });
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.rec.bill_to_address = '';
                        $scope.rec.bill_to_address2 = '';
                        $scope.rec.bill_to_city = '';
                        $scope.rec.bill_to_county = '';
                        $scope.rec.bill_to_post_code = '';
                    }
                    $scope.rec.bill_to_cust_no = result.code;
                    $scope.rec.bill_to_name = result.title;


                    $scope.rec.bill_to_contact_no = result.contact_person;
                    $scope.rec.bill_to_contact_phone = result.fphone;
                    $scope.rec.bill_fax = result.fax;
                    $scope.rec.bill_to_email = result.femail;
                    $scope.rec.bill_to_cust_id = result.id;
                    $scope.rec.bill_to_contact_id = result.contact_id;
                    $scope.rec.bill_to_contact_email = result.femail;

                    /* angular.forEach($rootScope.arr_payment_terms, function (elem2) {
                        if (elem2.id == result.payment_term)
                            $scope.rec.payment_terms_codes = elem2;
                    });

                    angular.forEach($rootScope.arr_payment_methods, function (elem3) {
                        if (elem3.id == result.payment_method)
                            $scope.rec.payment_method_ids = elem3;
                    }); */

<<<<<<< HEAD
                    angular.forEach($rootScope.arr_paymentTerms, function (elem2) {
=======
                    angular.forEach($rootScope.arr_paymentTerms, function(elem2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (elem2.id == result.payment_term)
                            $scope.rec.payment_terms_codes = elem2;
                    });

<<<<<<< HEAD
                    angular.forEach($rootScope.arr_paymentMethods, function (elem3) {
=======
                    angular.forEach($rootScope.arr_paymentMethods, function(elem3) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (elem3.id == result.payment_method)
                            $scope.rec.payment_method_ids = elem3;
                    });

                    /* ============================== */
                    /* Sales Order Shipping detail */
                    /* ============================== */

                    // if (result.clid != undefined)
                    {
                        $scope.rec.ship_to_name = result.cldepot;
                        $scope.rec.ship_to_address = result.claddress;
                        $scope.rec.ship_to_address2 = result.claddress_2;
                        $scope.rec.ship_to_city = result.clcity;
                        $scope.rec.ship_to_county = result.clcounty;
                        $scope.rec.ship_to_post_code = result.clpostcode;
<<<<<<< HEAD
                        angular.forEach($rootScope.country_type_arr, function (elems) {
=======
                        angular.forEach($rootScope.country_type_arr, function(elems) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (elems.id == result.clcountry)
                                $scope.rec.ship_to_country_ids = elems;
                        });
                        $scope.rec.comm_book_in_contact = result.cldirect_line;
                        $scope.rec.ship_to_contact = result.clcontact_name;
                        $scope.rec.book_in_tel = result.clphone;
                        $scope.rec.book_in_email = result.clemail;
                        $scope.rec.alt_depo_id = result.clid;
                    }
                    // else {
                    //     $scope.rec.ship_to_name = '';
                    //     $scope.rec.ship_to_address = '';
                    //     $scope.rec.ship_to_address2 = '';
                    //     $scope.rec.ship_to_city = '';
                    //     $scope.rec.ship_to_county = '';
                    //     $scope.rec.ship_to_post_code = '';
                    //     $scope.rec.comm_book_in_contact = '';
                    //     $scope.rec.ship_to_contact = '';
                    //     $scope.rec.book_in_tel = '';
                    //     $scope.rec.book_in_email = '';
                    //     $scope.rec.alt_depo_id = '';
                    // }
                    // }
                    $scope.showLoader = false;
                }
            });

    }

<<<<<<< HEAD
    $scope.RemoveCustomerFromOrder = function () {
=======
    $scope.RemoveCustomerFromOrder = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var check_approvals = $scope.$root.setup + "general/check-for-approvals-before-delete";

        $http
            .post(check_approvals, {
                'object_id': $scope.$root.order_id,
                'type': '1,2',
                'token': $scope.$root.token
            })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                if (res.data.ack == 1) {

                    // if ($scope.rec.type2 != 0 && ($scope.rec.credit_limit_approval_req > 0 || $scope.margin_analysis_approval_req > 0)) {

<<<<<<< HEAD
                        $rootScope.order_post_invoice_msg = "Do you want to delete the Approval history as well?";

                        var postUrl = $scope.$root.setup + "general/delete-approval-history";

                        ngDialog.openConfirm({
                            template: '_confirm_order_invoice_modal',
                            className: 'ngdialog-theme-default-custom'
                        }).then(function (value) {
                            $scope.showLoader = true;

                            $http
                                .post(postUrl, { 'token': $scope.$root.token, 'object_id': $scope.$root.order_id, 'type': '1,2' })
                                .then(function (res) {
                                    if (res.data.ack != undefined) {
                                        $scope.showLoader = false;
                                        // $scope.add_general($scope.rec, 1);
                                    }
                                });
                        }, function (reason) {
                            console.log('Modal promise rejected. Reason: ', reason);
                        });
=======
                    $rootScope.order_post_invoice_msg = "Do you want to delete the Approval history as well?";

                    var postUrl = $scope.$root.setup + "general/delete-approval-history";

                    ngDialog.openConfirm({
                        template: '_confirm_order_invoice_modal',
                        className: 'ngdialog-theme-default-custom'
                    }).then(function(value) {
                        $scope.showLoader = true;

                        $http
                            .post(postUrl, { 'token': $scope.$root.token, 'object_id': $scope.$root.order_id, 'type': '1,2' })
                            .then(function(res) {
                                if (res.data.ack != undefined) {
                                    $scope.showLoader = false;
                                    // $scope.add_general($scope.rec, 1);
                                }
                            });
                    }, function(reason) {
                        console.log('Modal promise rejected. Reason: ', reason);
                    });
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    // }
                }

                $scope.rec.currency_id = 0;
                $scope.rec.currency_rate = 1;

                $scope.rec.sell_to_cust_no = '';
                $scope.rec.sell_to_cust_name = '';
                $scope.rec.sell_to_address = '';
                $scope.rec.sell_to_address2 = '';
                $scope.rec.sell_to_city = '';
                $scope.rec.sell_to_county = '';
                $scope.rec.sell_to_post_code = '';
                $scope.rec.country_ids = 0;

                $scope.rec.sell_to_cust_id = 0;
                $scope.$root.crm_id = 0

                $scope.rec.segment_id = 0;
                $scope.rec.region_id = 0;
                $scope.rec.buying_grp_id = 0;
                //contact info
                $scope.rec.sell_to_contact_no = '';
                $scope.rec.cust_phone = '';
                $scope.rec.cust_fax = '';
                $scope.rec.cust_email = '';

                $scope.rec.sale_person = '';
                $scope.rec.sale_person_id = 0;
                $scope.rec.customer_balance = 0;
                $scope.rec.credit_limit = 0;
                $scope.rec.anonymous_customer = 0;

                $scope.rec.alt_contact_person = '';
                $scope.rec.alt_contact_email = '';
                $scope.rec.bill_to_posting_group_id = 0;
                $scope.$root.c_currency_id = '';
                $scope.drp.payment_terms_ids = '';

                $scope.rec.due_date = '';
                $scope.drp.payment_method_ids = '';
                $scope.drp.vat_bus_posting_group = '';
                $rootScope.order_posting_group_id = 0;
                $scope.rec.bill_to_insurance_charges = '';
                $scope.rec.bill_to_insurance_charges_type = '';

                $scope.rec.bill_to_finance_charges = '';
                $scope.rec.bill_to_finance_charges_type = '';


                $scope.rec.company_reg_no = '';
                $scope.bank_name = '';
                $scope.rec.bank_name = '';
                $scope.rec.account_name = '';
                $scope.rec.account_no = '';
                $scope.rec.swift_no = '';
                $scope.rec.iban = '';
                $scope.rec.sort_code = '';
                $scope.rec.bill_to_bank_name = '';
                $scope.rec.bill_to_bank_id = 0;
                $scope.rec.vat_number = 0;

                // arr_contact.contact_person = elem;

                $scope.rec.bill_to_customer = '';

                $scope.rec.bill_to_cust_id = 0;

                $scope.rec.bill_to_address = '';
                $scope.rec.bill_to_address2 = '';
                $scope.rec.bill_to_city = '';
                $scope.rec.bill_to_county = '';
                $scope.rec.bill_to_post_code = '';

                $scope.rec.bill_to_cust_no = '';
                $scope.rec.bill_to_name = '';


                $scope.rec.bill_to_contact_no = '';
                $scope.rec.bill_to_contact_phone = '';
                $scope.rec.bill_fax = '';
                $scope.rec.bill_to_email = '';
                $scope.rec.bill_to_cust_id = 0;
                $scope.rec.bill_to_contact_id = 0;
                $scope.rec.bill_to_contact_email = '';
                $scope.rec.bill_to_contact = '';
                $scope.rec.bill_to_country_ids = '';

                $scope.rec.payment_terms_codes = '';

                $scope.rec.payment_method_ids = '';
                $scope.rec.ship_to_name = '';
                $scope.rec.ship_to_address = '';
                $scope.rec.ship_to_address2 = '';
                $scope.rec.ship_to_city = '';
                $scope.rec.ship_to_county = '';
                $scope.rec.ship_to_post_code = '';
                $scope.rec.ship_to_country_ids
                $scope.rec.comm_book_in_contact = '';
                $scope.rec.ship_to_contact = '';
                $scope.rec.book_in_tel = '';
                $scope.rec.book_in_email = '';
                $scope.rec.alt_depo_id = '';
                $scope.PurchaseOrderArr = [];
                $scope.selectedPurchaseOrderArr = [];
                $scope.selectedPurchaseOrderModal = [];
                $scope.selectedPurchaseOrders = "";
                $scope.selectedPOs = [];
<<<<<<< HEAD
            });        
    }

    $scope.getCustomer3 = function () {
=======
            });
    }

    $scope.getCustomer3 = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.columns = [];
        $scope.record = {};
        var custUrl = $scope.$root.sales + "customer/customer/listings";
        var custUrl2 = $scope.$root.sales + "customer/customer/check-customer-limit";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
            'more_fields': "currency_id*credit_limit*address_2*fax*email"
        };
        $http
            .post(custUrl, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.columns = res.data.columns;
                $scope.record = res.data.record.result;
            });

        $scope.animationsEnabled = true;


        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'customerModalDialogId',
            controller: 'ModalInstanceCtrl',
            resolve: {
<<<<<<< HEAD
                columns: function () {
                    return $scope.columns;
                },
                record: function () {
=======
                columns: function() {
                    return $scope.columns;
                },
                record: function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    return $scope.record;
                }
            }
        });
    }

<<<<<<< HEAD
    $scope.getAltContactByCustomer = function (crm_id) {
=======
    $scope.getAltContactByCustomer = function(crm_id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.postData = { 'crm_id': crm_id, token: $scope.$root.token }
        var ApiAjax = $scope.$root.sales + "crm/crm/get-alt-contacts-list";
        $http
            .post(ApiAjax, $scope.postData)
<<<<<<< HEAD
            .then(function (alt_res) {
=======
            .then(function(alt_res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (alt_res.data.ack == true) {
                    $scope.rec.sell_to_contact_no = alt_res.data.response[0].name;
                    $scope.rec.cust_phone = alt_res.data.response[0].phone;
                    $scope.rec.cust_fax = alt_res.data.response[0].fax;
                    $scope.rec.cust_email = alt_res.data.response[0].email;
                    $scope.rec.sell_to_contact_id = alt_res.data.response[0].id;
                }
            });

    }

    $scope.searchKeyword_inv = {};

<<<<<<< HEAD
    $scope.getCustomer_invoice = function (item_paging) {
=======
    $scope.getCustomer_invoice = function(item_paging) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.title = 'Customer Listing';
        //  $scope.columns = [];
        $scope.record = {};
        var custUrl = $scope.$root.sales + "customer/customer/getCustomerListings";
        /* var custUrl2 = $scope.$root.sales + "customer/customer/check-customer-limit";
         var postData = {
         'token': $scope.$root.token,
         'all': "1",
         'type':"99"
         };*/
        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.postData.all = 1;
        $scope.postData.type = 99;

        if (item_paging == 1)
            $rootScope.item_paging.spage = 1;

        $scope.postData.page = $rootScope.item_paging.spage;
        $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;
        $scope.postData.searchKeyword_inv = $scope.searchKeyword_inv.$;

        if ($scope.searchKeyword_inv.region !== undefined && $scope.searchKeyword_inv.region !== null) {
            $scope.postData.regions = $scope.searchKeyword_inv.region.id;
        }

        if ($scope.searchKeyword_inv.segment !== undefined && $scope.searchKeyword_inv.segment !== null)
            $scope.postData.segments = $scope.searchKeyword_inv.segment.id;

        if ($scope.searchKeyword_inv.buying_group !== undefined && $scope.searchKeyword_inv.buying_group !== null)
            $scope.postData.buying_groups = $scope.searchKeyword_inv.buying_group.id;


        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword_inv = {};
            $scope.record_data = {};
        }


        $scope.showLoader = true;
<<<<<<< HEAD
        $timeout(function () {
            $http
                .post(custUrl, $scope.postData)
                .then(function (res) {
=======
        $timeout(function() {
            $http
                .post(custUrl, $scope.postData)
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.columns = [];
                    // $scope.columns = res.data.columns;
                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.total_paging_record = res.data.total_paging_record;
                    //$scope.showLoader = false;
                    $scope.record_invoice = res.data.response;

                    angular.element('#customer_modal_single_invoice').modal({ show: true });
<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                });

            $scope.showLoader = false;
        }, 1000);
    }

<<<<<<< HEAD
    $scope.confirmInvoice = function (result) {
=======
    $scope.confirmInvoice = function(result) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.rec.bill_to_cust_no = result.code;
        $scope.rec.bill_to_name = result.title;
        if (result.BillingLocation.id != undefined) {

            $scope.rec.bill_to_city = result.BillingLocation.city;
            $scope.rec.bill_to_county = result.BillingLocation.county;
            $scope.rec.bill_to_post_code = result.BillingLocation.postcode;
            $scope.rec.cust_email = result.BillingLocation.email;
            $scope.rec.cust_phone = result.BillingLocation.phone;
            $scope.rec.cust_fax = result.BillingLocation.fax;
            $scope.rec.bill_to_address = result.BillingLocation.address_2;
            $scope.rec.bill_to_address2 = result.BillingLocation.address_2;
            $scope.rec.bill_to_contact_no = result.BillingLocation.mobile;
            // arr_contact.contact_person = result.BillingLocation.mobile;
<<<<<<< HEAD
        }
        else {
=======
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(500));
            $scope.rec.bill_to_city = '';
            $scope.rec.bill_to_county = '';
            $scope.rec.bill_to_post_code = '';
            $scope.rec.cust_email = '';
            $scope.rec.cust_phone = '';
            $scope.rec.cust_fax = '';
            $scope.rec.bill_to_address = '';
            $scope.rec.bill_to_address2 = '';
            $scope.rec.bill_to_contact_no = '';
        }
        /* 
            $.each(result, function (index, elem) {
                if (index == 'code')
                    $scope.rec.bill_to_cust_no = elem;
                if (index == 'name')
                    $scope.rec.bill_to_name = elem;
                if (index == 'email')
                    $scope.rec.cust_email = elem;
                if (index == 'phone')
                    $scope.rec.cust_phone = elem;
                if (index == 'fax')
                    $scope.rec.cust_fax = elem;
                if (index == 'address_2')
                    $scope.rec.bill_to_address = elem;
                if (index == 'address_2')
                    $scope.rec.bill_to_address2 = elem;
                if (index == 'mobile') {
                    $scope.rec.bill_to_contact_no = elem;
                    arr_contact.contact_person = elem;
                }
        
        
            }); */
        $scope.rec.bill_to_cust_id = result.id;

        /* var finUrl = $scope.$root.sales + "customer/customer/get-customer-finance";//get-finance-by-customer-id";
         $http
         .post(finUrl, {customer_id: result.id, token: $scope.$root.token})
         .then(function (fres) {
         $scope.rec.account_payable_number = fres.data.response.account_payable_number;
         $scope.rec.account_payable_id = fres.data.response.account_payable_id;
         });*/
        angular.element('#customer_modal_single_invoice').modal('hide');
    }


<<<<<<< HEAD
    $scope.getAltDepot = function () {
=======
    $scope.getAltDepot = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.title = 'Alt Delivery Location';
        //var id = $scope.rec.bill_to_cust_id;
        /*$resource('api/company/get_listing_ajax/:module_id/:module_table/:filter_id/:more_fields/:conditon')
         .get({module_id:69,module_table:'crm_alt_depot',filter_id:106,more_fields:'address*address_2*city*county*post_code',conditon:'crm_id*'+id},function(data){
         $scope.columns = data.columns;
         $scope.record = data.record.result;
         });*/
        var ApiAjax = $scope.$root.sales + "crm/crm/get-delivery-locations";

        var postData = {
            'token': $scope.$root.token,
            'acc_id': $scope.$root.crm_id,
            'module_type': '1'
        };
        $http
            .post(ApiAjax, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.columns = [];
                $scope.record = {};

                if (res.data.record.ack == true) {
                    $scope.record = res.data.record.result;

<<<<<<< HEAD
                    angular.forEach(res.data.record.result[0], function (val, index) {
=======
                    angular.forEach(res.data.record.result[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    angular.element('#_orderLocationModal').modal({ show: true });

<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                    return;
                }
            });
    }

<<<<<<< HEAD
    $scope.confirm_location = function (result) {
=======
    $scope.confirm_location = function(result) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.rec.ship_to_name = result.location;
        $scope.rec.ship_to_address = result.address_1;
        $scope.rec.ship_to_address2 = result.address_2;
        $scope.rec.ship_to_city = result.city;
        $scope.rec.ship_to_county = result.county;
        $scope.rec.ship_to_post_code = result.postcode;
<<<<<<< HEAD
        angular.forEach($rootScope.country_type_arr, function (elems) {
=======
        angular.forEach($rootScope.country_type_arr, function(elems) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (elems.id == result.country)
                $scope.rec.ship_to_country_ids = elems;
        });
        $scope.rec.comm_book_in_contact = result.cldirect_line;
        $scope.rec.ship_to_contact = result.clcontact_name;
        $scope.rec.book_in_tel = result.clphone;
        $scope.rec.book_in_email = result.clemail;
        $scope.rec.alt_depo_id = result.id;
        angular.element('#_orderLocationModal').modal('hide');
    }

<<<<<<< HEAD
    $scope.showOrderTrail = function (stock, list_type, entries_type) {
=======
    $scope.showOrderTrail = function(stock, list_type, entries_type) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.searchKeyword_2 = {};
        var stock_trail_url = $scope.$root.setup + "warehouse/sale-stock-trial";
        /*if (single_item != undefined) {
            if (single_item == 1) {
                var postData = {
                    'token': $scope.$root.token,
                    'prod_id': stock,
                    'only_so': 1
                }; 
            }
        }
        else { */
        var prod_id = (stock.product_id != undefined) ? stock.product_id : stock.id;
        var postData = {
            'token': $scope.$root.token,
            'prod_id': prod_id,
            'list_type': list_type,
            'entries_type': entries_type,

            'warehouse_id': stock.warehouse_id
        };
        // }

        if (list_type == 'current_stock') {
            $scope.stock_activity_title = 'Current Stock';
<<<<<<< HEAD
        }
        else if (list_type == 'available_stock') {
            $scope.stock_activity_title = 'Available Stock';
        }
        else if (list_type == 'allocated_stock') {
=======
        } else if (list_type == 'available_stock') {
            $scope.stock_activity_title = 'Available Stock';
        } else if (list_type == 'allocated_stock') {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.stock_activity_title = 'Allocated Stock';
        }

        if (entries_type == 'si_dn_nij') {
            $scope.stock_activity_title = 'Sold Stock';
<<<<<<< HEAD
        }
        else if (entries_type == 'pi_ob_pij') {
=======
        } else if (entries_type == 'pi_ob_pij') {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.stock_activity_title = 'Total Stock';
        }


        if (entries_type != undefined)
            postData.item_trace_unique_id = stock.item_trace_unique_id;
        /* if (isSingleTrail) {
            postData.id = stock.id;
            postData.sale_return_status = stock.sale_return_status;
            postData.item_trace_unique_id = stock.item_trace_unique_id;
            postData.entry_type = stock.type;
            if (isSingleTrail == 1) // total qty => purchase orders
            {
                postData.type = 1;
            }
            else if (isSingleTrail == 2) // sold qty => sales orders
            {
                postData.type = 2;
                postData.sale_status = '2, 3';
            }
            else if (isSingleTrail == 3) // allocated qty => allocated orders
            {
                postData.type = 2;
                postData.sale_status = 1;
            }
            else if (isSingleTrail == 4) // returned qty => Credit Notes
            {
                postData.type = 1;
                postData.only_cn = 1;
            }
        } */

        $scope.prod_warehouse_trail_data = [];

        $http
            .post(stock_trail_url, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                $scope.columns2 = [];


                if (res.data.response != null) {
                    $scope.prod_warehouse_trail_data = res.data.response;
<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.columns2.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }
            });
        $scope.searchKeyword_2 = {};
        angular.element('#order_trail_modal').modal({ show: true });
    }

<<<<<<< HEAD
    $scope.show_warehouse_loc_info = function (loc_id, warehouse_id, storage_loc_id, prod_id) {
=======
    $scope.show_warehouse_loc_info = function(loc_id, warehouse_id, storage_loc_id, prod_id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        /*console.log(loc_id);
         console.log(warehouse_id);
         console.log(prod_id);*/
        var prod_warehouse_loc_Url = $scope.$root.setup + "warehouse/get-prod-WH-loc-for-stock-alloc";

        $http
            .post(prod_warehouse_loc_Url, {
                'token': $scope.$root.token,
                'prod_id': prod_id,
                'loc_wrh_id': loc_id
            })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                if (res.data.response != null) {
                    $scope.warehouse_location_details_data = res.data.response;
                    //console.log($scope.warehouse_location_details_data);
                }
            });

        //get bin loc additional cost for product module start


        var bin_loc_add_cost_Url = $scope.$root.setup + "warehouse/alt-bin-loc-add-cost";

        $http
            .post(bin_loc_add_cost_Url, {
                'token': $scope.$root.token,
                'wrh_id': warehouse_id,
                'bin_loc_wrh_id': storage_loc_id
            })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.columns1 = [];
                $scope.bin_loc_add_cost_data = [];

                if (res.data.response != null) {
                    $scope.bin_loc_add_cost_data = res.data.response;
                    // console.log(res.data.response);
<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.columns1.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    // $scope.warehouse_loc_add_cost_setup_Show = true;
                }
            });

        //get bin loc additional cost for product module end

        //get product loc additional cost start

        /*
         *
         'prod_id': prod_id,
         'warehouse_id': warehouse_id,
         'warehouse_loc_id': loc_id
         */
        //var prod_warehouse_loc_add_cost_Url = $scope.$root.setup + "warehouse/get-prod-WH-loc-add-cost-in-stock-alloc";
        var prod_warehouse_loc_add_cost_Url = $scope.$root.setup + "warehouse/alt-prod-warehouse-loc-add-cost";

        $http
            .post(prod_warehouse_loc_add_cost_Url, {
                'token': $scope.$root.token,
                'prod_id': prod_id,
                'warehouse_loc_id': loc_id
            })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                $scope.columns2 = [];
                $scope.prod_warehouse_loc_add_cost_data = [];

                if (res.data.response != null) {
                    $scope.prod_warehouse_loc_add_cost_data = res.data.response;
                    console.log(res.data.response);
<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.columns2.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }
            });

        //get product loc additional cost end

        angular.element('#location_modal').modal({ show: true });
    }
<<<<<<< HEAD
    $scope.getShipmentMethods = function () {
=======
    $scope.getShipmentMethods = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.title = 'Shipment Methods';
        var ApiAjax = $scope.$root.setup + "crm/shipment-methods";
        var postData = { token: $scope.$root.token }

        $http
            .post(ApiAjax, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.columns = res.data.columns;
                $scope.record = res.data.record.result;
            });
        ngDialog.openConfirm({
            template: 'modalDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
<<<<<<< HEAD
        }).then(function (result) {
            $.each(result, function (index, elem) {
=======
        }).then(function(result) {
            $.each(result, function(index, elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (index == 'Description')
                    $scope.rec.shipment_method_code = elem;
            });
            $scope.rec.shipment_method_id = result.id;
<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.searchKeywordSupp = {};
    //getShippingAgents

<<<<<<< HEAD
    $scope.get_supplier = function (item_paging) {
=======
    $scope.get_supplier = function(item_paging) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.title = 'Supplier Listing';
        var supplierUrl = $scope.$root.pr + "supplier/supplier/supplierListings";

        $scope.columns = [];
        $scope.record = {};
        $scope.record_invoice = {};
        // console.log($scope.items);
        // console.log($scope.items.length);

        //pass in API
        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.postData.type = 1;

        if (item_paging == 1)
            $scope.item_paging.spage = 1

        $scope.postData.page = $scope.item_paging.spage;
        $scope.postData.searchKeyword = $scope.searchKeywordSupp;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeywordSupp = {};
            $scope.record_data = {};
        }

        $scope.showLoader = true;
        $http
            .post(supplierUrl, $scope.postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.columns = [];
                $scope.record = {};
                $scope.supplierTableData = res;
                $scope.showLoader = false;

                if (res.data.ack == true) {
                    /* 
                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.total_paging_record = res.data.total_paging_record; */

                    angular.element('#listing_sp_single_Modal').modal({ show: true });

                    // $scope.record = res.data.response;
                    // $scope.record_invoice = res.data.response;
<<<<<<< HEAD
                }
                else {
                    $scope.showLoader = false;
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
            }).catch(function (message) {
=======
                } else {
                    $scope.showLoader = false;
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
            }).catch(function(message) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.showLoader = false;
                // toaster.pop('error', 'info', 'Server is not Acknowledging');
                throw new Error(message.data);
            });

        /* $scope.title = 'Shipping Agents';
         var ApiAjax = $scope.$root.setup + "crm/shipping-agents";
         var postData = { token: $scope.$root.token }
     
         $http
             .post(ApiAjax, postData)
             .then(function (res) {
                 $scope.columns = res.data.columns;
                 $scope.record = res.data.record.result;
             });
         ngDialog.openConfirm({
             template: 'modalDialogId',
             className: 'ngdialog-theme-default',
             scope: $scope
         }).then(function (result) {
             $.each(result, function (index, elem) {
                 if (index == 'Description')
                     $scope.rec.shipping_agent_code = elem;
             });
             $scope.rec.shipping_agent_id = result.id;
         }, function (reason) {
             console.log('Modal promise rejected. Reason: ', reason);
         }); */
    }
<<<<<<< HEAD
    $scope.confirm_supp_single = function (result) {
=======
    $scope.confirm_supp_single = function(result) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.rec.shipping_agent_code = result.name;
        $scope.rec.shipping_agent_id = result.id;
        angular.element('#listing_sp_single_Modal').modal('hide');
    }
<<<<<<< HEAD
    var checkCreditLimit = function (id) {
        $resource('api/company/check_customer_limit/:id')
            .get({ id: id }, function (data) {
                if (data == false) {
                    return 1;
                }
                else {
=======
    var checkCreditLimit = function(id) {
        $resource('api/company/check_customer_limit/:id')
            .get({ id: id }, function(data) {
                if (data == false) {
                    return 1;
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.credit_limit = data.credit_limit;
                    $scope.balance = data.balance;
                }
            });

        ngDialog.openConfirm({
            template: 'checkCreditLimit',
            className: 'ngdialog-theme-default',
            scope: $scope,
            size: 'lg'
<<<<<<< HEAD
        }).then(function (result) {
            return 2;
        }, function (reason) {
=======
        }).then(function(result) {
            return 2;
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
            return 3;
        });
    }

<<<<<<< HEAD
    $scope.getAltContact = function (arg) {
=======
    $scope.getAltContact = function(arg) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.contactArg = arg;

        if ($scope.rec.sell_to_cust_id == 0 || $scope.rec.sell_to_cust_id == undefined) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Customer No.']));
            return;
<<<<<<< HEAD
        }
        else {
=======
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.columns = [];
            $scope.record = {};
            var altContactUrl = $scope.$root.sales + "crm/crm/alt-contacts";
            $scope.title = 'Alt Contact';
            var id = $scope.rec.sell_to_cust_id;
            var postAltCData = {
                'column': 'crm_id',
                'value': $scope.$root.crm_id,
                'module_type': '1',
                'token': $scope.$root.token,
                'more_fields': 'phone*fax'
            }
            $http
                .post(altContactUrl, postAltCData)
<<<<<<< HEAD
                .then(function (res) {
=======
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    //  $scope.columns = res.data.columns;
                    //  $scope.record = res.data.record.result;
                    if (res.data.record.ack == true) {
                        $scope.columns = [];
                        $scope.record = res.data.record.result;
<<<<<<< HEAD
                        angular.forEach(res.data.record.result[0], function (val, index) {
=======
                        angular.forEach(res.data.record.result[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });
                        angular.element('#_orderContactModal').modal({ show: true });

<<<<<<< HEAD
                    }
                    else {
=======
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(501, ['contact person', 'customer']));
                        return;
                    }
                });
<<<<<<< HEAD
        }/* 
    ngDialog.openConfirm({
        template: 'modalDialogId',
        className: 'ngdialog-theme-default',
        scope: $scope
    }).then(function (result) {
        var arr_contact = {};
        $.each(result, function (index, elem) {
            
            if (index == 'email')
                $scope.rec.cust_email = arr_contact.email = elem;
            if (index == 'phone')
                $scope.rec.cust_phone = arr_contact.phone = elem;
            if (index == 'fax')
                $scope.rec.cust_fax = arr_contact.fax = elem;

            if (index == 'name')
                $scope.rec.sell_to_contact_no = arr_contact.sell_to_contact_no = elem;
            if (index == 'Location_Name')
                $scope.rec.bill_to_address = arr_contact.bill_to_address = elem;
            if (index == 'Location_Name')
                $scope.rec.bill_to_address2 = arr_contact.bill_to_address2 = elem;

            if (index == 'mobile') {
                $scope.rec.bill_to_contact_no = arr_contact.bill_to_contact_no = elem;
                arr_contact.contact_person = elem;
            }
            arr_contact.contact_id = result.id;
            $scope.$root.$broadcast("myEvent", { arr_contact: arr_contact });
        });

        $scope.rec.bill_to_cust_id = result.id;
    }, function (reason) {
        console.log('Modal promise rejected. Reason: ', reason);
    }); */
    }


    $scope.confirm_contact = function (result) {
=======
        }
        /* 
            ngDialog.openConfirm({
                template: 'modalDialogId',
                className: 'ngdialog-theme-default',
                scope: $scope
            }).then(function (result) {
                var arr_contact = {};
                $.each(result, function (index, elem) {
                    
                    if (index == 'email')
                        $scope.rec.cust_email = arr_contact.email = elem;
                    if (index == 'phone')
                        $scope.rec.cust_phone = arr_contact.phone = elem;
                    if (index == 'fax')
                        $scope.rec.cust_fax = arr_contact.fax = elem;

                    if (index == 'name')
                        $scope.rec.sell_to_contact_no = arr_contact.sell_to_contact_no = elem;
                    if (index == 'Location_Name')
                        $scope.rec.bill_to_address = arr_contact.bill_to_address = elem;
                    if (index == 'Location_Name')
                        $scope.rec.bill_to_address2 = arr_contact.bill_to_address2 = elem;

                    if (index == 'mobile') {
                        $scope.rec.bill_to_contact_no = arr_contact.bill_to_contact_no = elem;
                        arr_contact.contact_person = elem;
                    }
                    arr_contact.contact_id = result.id;
                    $scope.$root.$broadcast("myEvent", { arr_contact: arr_contact });
                });

                $scope.rec.bill_to_cust_id = result.id;
            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            }); */
    }


    $scope.confirm_contact = function(result) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.rec.sell_to_contact_id = result.id;
        $scope.rec.sell_to_contact_no = result.name;
        $scope.rec.cust_phone = result.phone;
        $scope.rec.cust_email = result.email;
        $scope.rec.cust_fax = result.fax;

        angular.element('#_orderContactModal').modal('hide');
    }

    $scope.columns = [];
<<<<<<< HEAD
    $scope.getSalePerson = function (arg) {
        if ($scope.rec.sell_to_cust_id == 0 || $scope.rec.sell_to_cust_id == undefined) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Customer No.']));
            return;
        }
        else {
=======
    $scope.getSalePerson = function(arg) {
        if ($scope.rec.sell_to_cust_id == 0 || $scope.rec.sell_to_cust_id == undefined) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Customer No.']));
            return;
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.columns = [];
            $scope.record = {};
            $scope.title = 'Salesperson';
            // var empUrl = $scope.$root.hr + "employee/listings";
            var empUrl = $scope.$root.sales + "crm/crm/get-crm-salesperson-orders";
            var postData = {
                'token': $scope.$root.token,
                'crm_id': $scope.rec.sell_to_cust_id,
                'type': '2'
            };
            $http
                .post(empUrl, postData)
<<<<<<< HEAD
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.columns = [];
                        $scope.record = res.data.response;
                        angular.forEach(res.data.response[0], function (val, index) {
=======
                .then(function(res) {
                    if (res.data.ack == true) {
                        $scope.columns = [];
                        $scope.record = res.data.response;
                        angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });
                        angular.element('#_orderSalesPersonModal').modal({ show: true });

<<<<<<< HEAD
                    }
                    else {
=======
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                        return;
                    }
                });
        }

        /* ngDialog.openConfirm({
            template: 'modalDialogId2',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (result) {
            $scope.rec.sale_person = result.name;
            $scope.rec.sale_person_id = result.id;
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        }); */
    }

<<<<<<< HEAD
    $scope.confirm_sale_person = function (result) {
=======
    $scope.confirm_sale_person = function(result) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.rec.sale_person = result.name;
        $scope.rec.sale_person_id = result.id;
        angular.element('#_orderSalesPersonModal').modal('hide');
    }


    $scope.pOrders = [];
<<<<<<< HEAD
    $scope.getPurchaseOrders = function () {
        var ordrUrl = $scope.$root.pr + "srm/srminvoice/listings";
        $http
            .post(ordrUrl, { 'all': 1, type: 3, token: $scope.$root.token })
            .then(function (res) {
=======
    $scope.getPurchaseOrders = function() {
        var ordrUrl = $scope.$root.pr + "srm/srminvoice/listings";
        $http
            .post(ordrUrl, { 'all': 1, type: 3, token: $scope.$root.token })
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.pOrders = res.data.response;
            });
        angular.element('#purchaseOrderModal').modal({ show: true });
    }

<<<<<<< HEAD
    $scope.addPurchaseOrder = function (ordr) {
=======
    $scope.addPurchaseOrder = function(ordr) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.rec.purchase_code_number = ordr.order_code;
        $scope.rec.purchase_order_id = ordr.id;
        angular.element('#purchaseOrderModal').modal('hide');
    }

    //////////////////////////////////////////////////////////////////////////////////


    $scope.list_order = true;
    /* 
    $scope.PurchaseOrderArr = [];
    $scope.selectedPurchaseOrderArr = [];

    $scope.show_list_order = function () {

        $scope.showLoader = true;
        $scope.filterPurchaseOrder = {};
        $scope.PurchaseOrderArr = [];
        
        //var prodApi = $scope.$root.sales + "customer/order/listings";
        var prodApi = $scope.$root.sales + "crm/crm/get-purchase-order";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
            'type': 2,
        };

        $scope.selectedAllPurchaseOrder = false;

        if ($scope.PurchaseOrderArr.length > 0) {
            angular.forEach($scope.PurchaseOrderArr, function (obj2) {
                obj2.chk = false;

                angular.forEach($scope.selectedPurchaseOrderArr, function (obj) {
                    if (obj.id == obj2.id)
                        obj2.chk = true;
                });
            });

            $scope.showLoader = false;
            angular.element('#_PurchaseOrdersModal').modal({ show: true });
        }
        else {
            $http
                .post(prodApi, postData)
                .then(function (res) {
                    $scope.showLoader = false;

                    if (res.data.ack == true) {

                        $scope.PurchaseOrderArr = res.data.response;
                        //console.log($scope.PurchaseOrderArr);

                        for (var i = 0; i < $scope.PurchaseOrderArr.length; i++) {
                            if ($scope.PurchaseOrderArr[i].chk) {
                                // $scope.PurchaseOrderArr[i].disableCheck = 1;
                            }
                        }

                        angular.forEach($scope.PurchaseOrderArr, function (obj2) {
                            obj2.chk = false;

                            angular.forEach($scope.selectedPurchaseOrdersIDs, function (obj) {

                                if (obj == obj2.id)
                                    obj2.chk = true;
                            });
                        });

                        angular.element('#_PurchaseOrdersModal').modal({ show: true });
                    }
                    else
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(389));
                });
        }
    }

    $scope.PendingSelectedPurchaseOrder = [];

    $scope.checkedPurchaseOrder = function (PurchaseOrder) {
        $scope.selectedAllPurchaseOrder = 0;

        for (var i = 0; i < $scope.PurchaseOrderArr.length; i++) {

            if (PurchaseOrder == $scope.PurchaseOrderArr[i].id) {
                if ($scope.PurchaseOrderArr[i].chk == true)
                    $scope.PurchaseOrderArr[i].chk = false;
                else
                    $scope.PurchaseOrderArr[i].chk = true;
            }
        }
    }

    $scope.checkAllPurchaseOrder = function (val) {
        var selection_filter = $filter('filter');
		var filtered = selection_filter($scope.PurchaseOrderArr, $scope.filterPurchaseOrder.search);

        $scope.PendingSelectedPurchaseOrder = [];

        if (val == true) {

            angular.forEach(filtered, function (obj) {
                obj.chk = true;
                $scope.PendingSelectedPurchaseOrder.push(obj);
            });

        } else {

            angular.forEach($scope.PurchaseOrderArr, function (obj) {
                if (!obj.disableCheck)
                    obj.chk = false;
            });
            $scope.PendingSelectedPurchaseOrder = [];
        }
    }

    $scope.addPurchaseOrder = function () {
        $scope.selectedPurchaseOrderArr = [];
        $scope.selectedPurchaseOrdersIDs = [];
        $scope.PendingSelectedPurchaseOrder = [];

        $scope.selectedPurchaseOrders = "";
        var selectedPurchaseOrders_name = "";

        angular.forEach($scope.PurchaseOrderArr, function (obj) {
            if (obj.chk == true) {
                //console.log(obj);
                $scope.PendingSelectedPurchaseOrder.push(obj);
                $scope.selectedPurchaseOrdersIDs.push(obj.id);
                selectedPurchaseOrders_name += obj.order_code + "; ";
            }
        });

        $scope.selectedPurchaseOrders = selectedPurchaseOrders_name.substring(0, selectedPurchaseOrders_name.length - 2);
        $scope.selectedPurchaseOrderArr = $scope.PendingSelectedPurchaseOrder;
        angular.element('#_PurchaseOrdersModal').modal('hide');
    }

    $scope.clearPendingPurchaseOrder = function () {
        $scope.PendingSelectedPurchaseOrder = [];
        angular.element('#_PurchaseOrdersModal').modal('hide');
    } */

<<<<<<< HEAD
    $scope.openPurchaseOrderLink = function (record) {
=======
    $scope.openPurchaseOrderLink = function(record) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var mainRecord = record;
        var record = mainRecord.record;
        var index = mainRecord.index;
        var url;
        url = $state.href("app.viewsrmorder", ({ id: record.id }));
        window.open(url, '_blank');
    }

<<<<<<< HEAD
    $scope.openPurchaseInvoiceLink = function (record) {
=======
    $scope.openPurchaseInvoiceLink = function(record) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var mainRecord = record;
        var record = mainRecord.record;
        var index = mainRecord.index;
        var url;
        url = $state.href("app.viewsrminvoice", ({ id: record.id }));
        window.open(url, '_blank');
    }

    $scope.searchKeywordPurchaseOrder = {};
    $scope.selectedSaleOrders = '';
    $scope.tableDataPO = [];

<<<<<<< HEAD
    $scope.show_list_order = function (inv) {
=======
    $scope.show_list_order = function(inv) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.searchKeywordPurchaseOrder = {};

        $scope.linkfromInv = 0;

<<<<<<< HEAD
        if(inv && inv>0){
            $scope.linkfromInv = 1;
        }
        
        $scope.selectPurchaseOrders();
    }

    $scope.selectPurchaseOrders = function (item_paging, sort_column, sortform) {
=======
        if (inv && inv > 0) {
            $scope.linkfromInv = 1;
        }

        $scope.selectPurchaseOrders();
    }

    $scope.selectPurchaseOrders = function(item_paging, sort_column, sortform) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;

        if (item_paging == 1)
            $scope.item_paging.spage = 1;

        $scope.postData.page = $scope.item_paging.spage;
        $scope.postData.searchKeyword = $scope.searchKeywordPurchaseOrder;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeywordPurchaseOrder = {};
            $scope.record_data = {};
        }

        if ((sort_column != undefined) && (sort_column != null)) {
            $scope.postData.sort_column = sort_column;
            $scope.postData.sortform = sortform;
            $rootScope.sortform = sortform;
            $rootScope.reversee = ('desc' === $scope.sortform) ? !$scope.reversee : false;
            $rootScope.sort_column = sort_column;
            $rootScope.save_single_value($rootScope.sort_column, 'order_code');
        }

        var purchaseOrderListingApi = $scope.$root.sales + "crm/crm/get-purchase-order-for-SO";
        $scope.showLoader = true;
        $http
            .post(purchaseOrderListingApi, $scope.postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.tableDataPO = res;
                $scope.columns = [];
                $scope.record_data = {};
                $scope.recordArray = [];
                $scope.tempPOList = [];

                if (res.data.ack == true) {
                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.record_data = res.data.response;
                    $scope.tempPOList = res.data;

<<<<<<< HEAD
                    angular.forEach($scope.record_data.tbl_meta_data.response.colMeta, function (obj, index) {
=======
                    angular.forEach($scope.record_data.tbl_meta_data.response.colMeta, function(obj, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    });

<<<<<<< HEAD
                    angular.forEach(res.data.response, function (value, key) {
=======
                    angular.forEach(res.data.response, function(value, key) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (key != "tbl_meta_data") {
                            $scope.recordArray.push(value);
                        }
                    });

                    if ($scope.tempPOList.response)
                        angular.element('#_PurchaseOrdersModal').modal({ show: true });

<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
                $scope.showLoader = false;
            });
    }

<<<<<<< HEAD
    $scope.clearPendingPurchaseOrder = function () {
        angular.element('#_PurchaseOrdersModal').modal('hide');
    }

    $scope.addPurchaseOrder = function () {
        var selPurchaseOrdersList = [];

        angular.forEach($scope.selectedPurchaseOrderModal, function (obj) {
=======
    $scope.clearPendingPurchaseOrder = function() {
        angular.element('#_PurchaseOrdersModal').modal('hide');
    }

    $scope.addPurchaseOrder = function() {
        var selPurchaseOrdersList = [];

        angular.forEach($scope.selectedPurchaseOrderModal, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            selPurchaseOrdersList.push(obj.record);
        });

        $scope.selectedPurchaseOrderArr = [];
        $scope.selectedPurchaseOrders = "";

<<<<<<< HEAD
        angular.forEach(selPurchaseOrdersList, function (recData) {
=======
        angular.forEach(selPurchaseOrdersList, function(recData) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.selectedPurchaseOrderArr.push(recData);

            if ($scope.selectedPurchaseOrders == "")
                $scope.selectedPurchaseOrders = recData.order_code;
            else
                $scope.selectedPurchaseOrders = $scope.selectedPurchaseOrders + '; ' + recData.order_code;
        });

        angular.element('#_PurchaseOrdersModal').modal('hide');

<<<<<<< HEAD
        if($scope.linkfromInv && $scope.linkfromInv>0){
=======
        if ($scope.linkfromInv && $scope.linkfromInv > 0) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            var rec = {};
            rec.id = $stateParams.id;
            rec.token = $scope.$root.token;
            rec.PurchaseOrderArr = {};
            rec.PurchaseOrderArr = $scope.selectedPurchaseOrderArr;
            $scope.showLoader = true;

            var updateOrderforPOlinkUrl = $scope.$root.sales + "customer/order/update-link-po";
            $http
                .post(updateOrderforPOlinkUrl, rec)
<<<<<<< HEAD
                .then(function (res) {
=======
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        $scope.showLoader = false;
                        toaster.pop('success', 'Info', 'Link PO(s) updated');
                    }

<<<<<<< HEAD
                }); 
=======
                });
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        }
    }


    /////////////////////////////////////////////////////
    // check for if Quantity is greater than available stock than make the quantity empty.
<<<<<<< HEAD
    $scope.check_min_max = function (item) {
=======
    $scope.check_min_max = function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        /* if (item.allocated_stock > 0 && $scope.rec.type2 != 0 && item.item_type == 0 && Number(item.warehouses) != 0) { // don't check for quotes
            // var item_ = $filter("filter")(item.arr_warehouse, { id: item.warehouses.id });
            var item_ = $filter("filter")(item.arr_warehouse, { id: item.warehouses });
            if (item_.length > 0) {
                if (Number(item_[0].available_quantity) < Number(item.qty)) {
                    toaster.pop('warning', 'Info', 'Available quantity is less than item quantity!');
                    if (item.sale_status > 0)
                    {
                        item.qty = item.allocated_stock;
                        item.prev_qty = item.allocated_stock;

                    }
                    else
                    {
                        item.qty = "";
                        item.prev_qty = "";
                    }
                    return false;
                }
            }

        } */
    }

    //var getCrmCodeUrl = $scope.$root.sales+"customer/order/get-order-code";
    $scope.show_invoice = false;
    $scope.show_order = true;
    $scope.title_code = 'Order Code';

    $scope.product_type = true;
    $scope.count_result = 0;

    //var getCrmCodeUrl = $scope.$root.sales+"customer/order/get-order-code";
    $scope.show_invoice = false;
    $scope.show_order = true;
    $scope.title_code = 'Order Code';
    $scope.product_type = true;
    $scope.count_result = 0;


<<<<<<< HEAD
=======
    $scope.chkInvPaymentStatus = function(id) {

        $scope.paymentData = {};

        $scope.paymentData.customerId = $scope.rec.bill_to_cust_id;
        $scope.paymentData.customerCode = $scope.rec.bill_to_cust_no;
        $scope.paymentData.customer = $scope.rec.bill_to_name;
        $scope.paymentData.posting_group_id = $rootScope.order_posting_group_id;
        $scope.paymentData.doc_type = 2;
        $scope.paymentData.module_type = 3;
        $scope.paymentData.grand_total = $scope.rec.grand_total;
        $scope.paymentData.currency = $scope.rec.currency_id.code;

        $scope.paymentData.invoice_id = id;


        var chkOrdPaymentUrl = $scope.$root.sales + "customer/order/chk-order-payment";
        $http
            .post(chkOrdPaymentUrl, { 'invoice_id': id, 'token': $scope.$root.token })
            .then(function(res) {
                if (res.data.ack == true) {

                    $scope.rec.currentAllocatedPayment = res.data.response.amount_allocated;

                    var resData = res.data.response;

                    $scope.paymentData.cnv_rate = resData.cnv_rate;
                    $scope.paymentData.glcode = resData.glcode;
                    $scope.paymentData.acc_code = resData.glcode;
                    $scope.paymentData.postedStatus = resData.postedStatus;
                    $scope.paymentData.invoice_date = resData.posting_date;
                    $scope.paymentData.allocation_date = resData.allocation_date;
                    $scope.paymentData.credit_amount = resData.credit_amount;
                    $scope.paymentData.allocated_amount = resData.allocated_amount;
                    $scope.paymentData.converted_price = resData.converted_price;
                    $scope.paymentData.total_remaining = Number(resData.credit_amount) - Number(resData.amount_allocated);
                    $scope.paymentData.total_setteled_other = 0;
                    $scope.paymentData.parent_id = resData.parent_id;
                    $scope.paymentData.payment_detail_id = resData.payment_detail_id;
                    $scope.paymentData.paid = resData.paid;
                    $scope.paymentData.document_no = resData.document_no;

                    $scope.paymentData.balancing_account_code = resData.balancing_account_code;
                    $scope.paymentData.balancing_account_name = resData.balancing_account_name;
                    $scope.paymentData.balancing_account_id = resData.balancing_account_id;
                    $scope.paymentData.balancing_account = resData.balancing_account_code + ' - ' + resData.balancing_account_name;

                    // $scope.getInvoicesForPaymentsList($scope.paymentData);

                    if (Number($scope.paymentData.credit_amount) == Number($scope.paymentData.credit_amount)) $scope.paymentData.allocate_full = 1;


                } else {

                    $scope.rec.currentAllocatedPayment = 0;

                    $scope.paymentData.cnv_rate = $scope.rec.currency_rate;
                    $scope.paymentData.glcode = '';
                    $scope.paymentData.acc_code = '';
                    $scope.paymentData.postedStatus = 0;
                    $scope.paymentData.invoice_date = $scope.rec.posting_date;
                    $scope.paymentData.allocation_date = $scope.rec.posting_date;
                    $scope.paymentData.credit_amount = $scope.rec.grand_total;
                    $scope.paymentData.allocated_amount = 0;
                    $scope.paymentData.converted_price = $scope.rec.grand_total_converted;
                    // $scope.paymentData.total_setteled = rec.grand_total;
                    $scope.paymentData.total_remaining = 0;
                    $scope.paymentData.total_setteled_other = 0;
                    $scope.paymentData.parent_id = 0;
                    $scope.paymentData.payment_detail_id = 0;
                    $scope.paymentData.paid = 0;
                    $scope.paymentData.allocate_full = 1;
                    $scope.paymentData.document_no = $scope.rec.sale_order_code;

                    if (rec.payable_number && rec.account_payable_id) {

                        let accountStr = rec.payable_number.split(' - ');
                        let accountName = accountStr.slice(1, 10);

                        $scope.paymentData.balancing_account_code = accountStr[0];
                        $scope.paymentData.balancing_account_name = accountName.join(' - ');
                        $scope.paymentData.balancing_account_id = $scope.rec.account_payable_id;
                        $scope.paymentData.balancing_account = $scope.rec.payable_number;
                    }
                }
            });

    }


>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    /* if ($stateParams.id == undefined)
        $scope.getCode(); */

    $scope.on_hold_order = 0;

    var id = $stateParams.id;
    $scope.rec.crm_id = $stateParams.id;
    if ($stateParams.id > 0) {

        $scope.display_required = true;
        angular.element('.display_required').attr("required", true);

        $scope.showLoader = true;

        if ($scope.rec.type2 == 0) {
            $moduleName = "sale_quote";
<<<<<<< HEAD
        }
        else if ($scope.rec.type2 == 1) {
            $moduleName = "sale_order";
        }
        else {
=======
        } else if ($scope.rec.type2 == 1) {
            $moduleName = "sale_order";
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $moduleName = "sale_invoice";
        }

        var getOrderUrl = $scope.$root.sales + "customer/order/get-order";
        $http
            .post(getOrderUrl, { 'id': id, 'token': $scope.$root.token, moduleName: $moduleName })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    $scope.marginAnalysisView = Number(res.data.marginAnalysisView); // 1-> sales person, 0-> original
                    $scope.rec = res.data.response;

                    if (res.data.response) {
                        try {
                            $scope.customerInvoiceEmail = res.data.response.invoice_email;
                            $scope.customerStatementEmail = res.data.response.statement_email;
                            $scope.customerReminderEmail = res.data.response.reminder_email;
<<<<<<< HEAD
                        }
                        catch (ex) {
=======
                        } catch (ex) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            console.log(ex);
                        }
                    }

                    if ($scope.rec.customer_emails) {
                        var customerEmails = [];
<<<<<<< HEAD
                        angular.forEach($scope.rec.customer_emails.split(","), function (obj, i) {
=======
                        angular.forEach($scope.rec.customer_emails.split(","), function(obj, i) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (obj)
                                customerEmails.push({ id: i, username: obj.trim() })
                        });
                        $scope.rec.customer_emails = customerEmails;
                    }



                    // $scope.$root.order_id = $scope.rec.id;
                    if (res.data.response.approval_type_1 == 2 && res.data.response.approval_type_2 == 2) {
                        $scope.approvals_lock_order = 1;
<<<<<<< HEAD
                    }
                    else if (res.data.response.approval_type_1 == 0 || res.data.response.approval_type_2 == 0) {
                        $scope.approvals_lock_order = -1;
                    }
                    else
=======
                    } else if (res.data.response.approval_type_1 == 0 || res.data.response.approval_type_2 == 0) {
                        $scope.approvals_lock_order = -1;
                    } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.approvals_lock_order = 0;

                    $scope.on_hold_order = (res.data.response.approval_type_1 == 7 || res.data.response.approval_type_2 == 7) ? 1 : 0;

                    $scope.$root.crm_id = res.data.response.sell_to_cust_id;
                    $scope.$root.model_code = (res.data.response.sale_invioce_code != '' && res.data.response.sale_invioce_code != null) ? res.data.response.sale_invioce_code : res.data.response.sale_order_code;
                    moduleTracker.updateRecord(res.data.response.id);
                    moduleTracker.updateRecordName((res.data.response.sale_quote_code ? res.data.response.sale_quote_code : '') + ((res.data.response.sale_quote_code ? res.data.response.sale_quote_code : '') && res.data.response.sale_order_code ? "/" : "") + res.data.response.sale_order_code + ((res.data.response.sale_order_code && res.data.response.sale_invioce_code) ? "/" : "") + (res.data.response.sale_invioce_code ? res.data.response.sale_invioce_code : ''));
                    $scope.sale_quote_code = res.data.response.sale_quote_code;
                    $scope.sale_order_code = res.data.response.sale_order_code;
                    $scope.sale_invioce_code = res.data.response.sale_invioce_code;
                    $scope.rec.anonymous_customer = Number($scope.rec.anonymous_customer);
                    $scope.module_code = $scope.$root.model_code;
                    $scope.GetSalesOrderStages();
                    $scope.rec.freight_charges = Number($scope.rec.freight_charges);

                    $rootScope.arr_vat_post_grp_sales = res.data.response.arr_vat_post_grp_sales;
                    $rootScope.arr_posting_grp = res.data.response.arr_posting_grp;
                    $rootScope.arr_paymentTerms = res.data.response.arr_paymentTerms;
                    $rootScope.arr_paymentMethods = res.data.response.arr_paymentMethods;
<<<<<<< HEAD
=======
                    $scope.rec.payable_number = res.data.response.account_payable_number;

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    console.log($rootScope.arr_vat_post_grp_sales);

                    $scope.currency_arr_local = res.data.response.currency_arr_local;

                    var model_codeSQ2 = $scope.rec.sell_to_cust_name + ' (' + $scope.sale_quote_code + ')';
                    var model_codeSO2 = $scope.rec.sell_to_cust_name + ' (' + $scope.sale_order_code + ')';
                    var model_codeSI2 = $scope.rec.sell_to_cust_name + ' (' + $scope.sale_invioce_code + ')';

                    if ($scope.rec.type == 0)
                        $scope.$root.breadcrumbs.push({ 'name': model_codeSQ2, 'url': '#', 'isActive': false });
                    else if ($scope.rec.type == 1)
                        $scope.$root.breadcrumbs.push({ 'name': model_codeSO2, 'url': '#', 'isActive': false });
                    else if ($scope.rec.type == 2 || $scope.rec.type2 == 3) {
                        $scope.$root.breadcrumbs.pop();

                        $scope.$root.breadcrumbs.push({ 'name': 'Sales Invoices', 'url': 'app.sale-invoice', 'isActive': false });
                        $scope.$root.breadcrumbs.push({ 'name': model_codeSI2, 'url': '#', 'isActive': false });
                    }

                    if (res.data.response.offer_date == 0)
                        $scope.rec.order_date = null;
                    else
                        $scope.rec.offer_date = $scope.$root.convert_unix_date_to_angular(res.data.response.offer_date);
                    $scope.$root.offer_date = $scope.rec.offer_date;
                    if (res.data.response.order_date == 0)
                        $scope.rec.order_date = null;
                    else
                        $scope.rec.order_date = $scope.$root.convert_unix_date_to_angular(res.data.response.order_date);


                    if (res.data.response.requested_delivery_date == 0)
                        $scope.rec.requested_delivery_date = null;
                    else
                        $scope.rec.requested_delivery_date = $scope.$root.convert_unix_date_to_angular(res.data.response.requested_delivery_date);

                    if (res.data.response.delivery_date == 0)
                        $scope.rec.delivery_date = null;
                    else
                        $scope.rec.delivery_date = $scope.$root.convert_unix_date_to_angular(res.data.response.delivery_date);

                    if (res.data.response.dispatch_date == 0)
                        $scope.rec.dispatch_date = null;
                    else
                        $scope.rec.dispatch_date = $scope.$root.convert_unix_date_to_angular(res.data.response.dispatch_date);

                    if (res.data.response.due_date == 0)
                        $scope.rec.due_date = null;
                    else
                        $scope.rec.due_date = $scope.$root.convert_unix_date_to_angular(res.data.response.due_date);

                    if (res.data.response.shipment_date == 0)
                        $scope.rec.shipment_date = null;
                    else
                        $scope.rec.shipment_date = $scope.$root.convert_unix_date_to_angular(res.data.response.shipment_date);
                    /*  if (res.data.response.bill_to_contact_id != undefined)
                    $scope.rec.bill_to_contact_no = $scope.Contprefix + $scope.getOrderNo(res.data.response.bill_to_contact_id);*/


                    // $timeout(function () {
                    //     $scope.$root.$apply(function () {

                    /* angular.forEach($rootScope.arr_payment_terms, function (elem) {
                        if (elem.id == res.data.response.payment_terms_code)
                            $scope.rec.payment_terms_codes = elem;
                    });
                    angular.forEach($rootScope.arr_payment_methods, function (elem) {
                        if (elem.id == res.data.response.payment_method_id)
                            $scope.rec.payment_method_ids = elem;
                    }); */

<<<<<<< HEAD
                    angular.forEach($rootScope.arr_paymentTerms, function (elem) {
                        if (elem.id == res.data.response.payment_terms_code)
                            $scope.rec.payment_terms_codes = elem;
                    });
                    angular.forEach($rootScope.arr_paymentMethods, function (elem) {
=======
                    angular.forEach($rootScope.arr_paymentTerms, function(elem) {
                        if (elem.id == res.data.response.payment_terms_code)
                            $scope.rec.payment_terms_codes = elem;
                    });
                    angular.forEach($rootScope.arr_paymentMethods, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (elem.id == res.data.response.payment_method_id)
                            $scope.rec.payment_method_ids = elem;
                    });

<<<<<<< HEAD
                    angular.forEach($scope.currency_arr_local, function (elem) {
=======
                    angular.forEach($scope.currency_arr_local, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (elem.id == $scope.rec.currency_id)
                            $scope.rec.currency_id = elem;
                    });

<<<<<<< HEAD
                    angular.forEach($scope.$root.country_type_arr, function (obj) {
=======
                    angular.forEach($scope.$root.country_type_arr, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (obj.id == $scope.rec.country_id)
                            $scope.rec.country_ids = obj;
                    });

<<<<<<< HEAD
                    if($rootScope.defaultCompany == 133 && $scope.rec.country_id !=218 ){
                        angular.forEach($rootScope.delivery_terms_arr, function (elem) {
=======
                    if ($rootScope.defaultCompany == 133 && $scope.rec.country_id != 218) {
                        angular.forEach($rootScope.delivery_terms_arr, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (elem.id == $scope.rec.shipment_method_id)
                                $scope.rec.shipment_method = elem;
                        });


<<<<<<< HEAD
                        angular.forEach($rootScope.transport_mode_arr, function (elem) {
=======
                        angular.forEach($rootScope.transport_mode_arr, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (elem.id == $scope.rec.shipping_agent_id)
                                $scope.rec.shipping_agent = elem;
                        });

<<<<<<< HEAD
                    }
                    else{
                        angular.forEach($rootScope.crm_shippment_methods_arr, function (elem) {
=======
                    } else {
                        angular.forEach($rootScope.crm_shippment_methods_arr, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (elem.id == $scope.rec.shipment_method_id)
                                $scope.rec.shipment_method = elem;
                        });
                    }



                    // $scope.$root.customer_country = $scope.rec.country_ids;

                    // if (res.data.response.comment != null)
                    //     $scope.$root.$broadcast("orderTabEvent", res.data.response.comment);
                    //     $scope.get_order_status();

                    // }, 2000);

                    $scope.rec.type2 = $scope.rec.type;

                    $scope.isInvoice = ($scope.rec.type == 2) ? 1 : 0;
                    $scope.$root.c_currency_id = (res.data.response.currency_id != undefined && res.data.response.currency_id.id != undefined) ? res.data.response.currency_id.id : 0;
                    $scope.$root.posting_date = res.data.response.posting_date;

                    if ($scope.rec.type2 == 3) {
                        link_order = 'app.sale-invoice';
                        name_link = 'Invoice';
                    }

                    // $scope.confirmFinance(res.data.order_finance_details.response);
                    // $scope.rec.credit_limit = 0;
                    // $scope.rec.customer_balance = 0;

<<<<<<< HEAD
                    angular.forEach($scope.$root.country_type_arr, function (elems) {
=======
                    angular.forEach($scope.$root.country_type_arr, function(elems) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (elems.id == res.data.response.ship_to_country_id)
                            $scope.rec.ship_to_country_ids = elems;
                    });

<<<<<<< HEAD
                    
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    if (res.data.response.primary_address_details != undefined && Number(res.data.response.primary_address_details.id) > 0) {

                        $scope.primary_address_details = res.data.response.primary_address_details;
                        $scope.rec.sell_to_loc_id = $scope.primary_address_details.id;
                        $scope.rec.sell_to_address = $scope.primary_address_details.address_1;
                        $scope.rec.sell_to_address2 = $scope.primary_address_details.address_2;
                        $scope.rec.sell_to_city = $scope.primary_address_details.city;
                        $scope.rec.sell_to_county = $scope.primary_address_details.county,
                            $scope.rec.sell_to_post_code = $scope.primary_address_details.postcode;

<<<<<<< HEAD
                        angular.forEach($rootScope.country_type_arr, function (obj) {
=======
                        angular.forEach($rootScope.country_type_arr, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (obj.id == $scope.primary_address_details.country)
                                $scope.rec.country_ids = obj;
                        });
                    }

                    if (res.data.response.delivery_address_details != undefined && $scope.rec.anonymous_customer == 0) {
                        $scope.rec.delivery_address_details = res.data.response.delivery_address_details.response;

                        $scope.rec.ship_to_name = $scope.rec.delivery_address_details.depot;
                        $scope.rec.ship_to_address = $scope.rec.delivery_address_details.address;
                        $scope.rec.ship_to_address2 = $scope.rec.delivery_address_details.address_2;
                        $scope.rec.ship_to_city = $scope.rec.delivery_address_details.city;
                        $scope.rec.ship_to_county = $scope.rec.delivery_address_details.county;
                        $scope.rec.ship_to_post_code = $scope.rec.delivery_address_details.postcode;
<<<<<<< HEAD
                        angular.forEach($rootScope.country_type_arr, function (elems) {
=======
                        angular.forEach($rootScope.country_type_arr, function(elems) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (elems.id == $scope.rec.delivery_address_details.country)
                                $scope.rec.ship_to_country_ids = elems;
                        });
                        $scope.rec.comm_book_in_contact = $scope.rec.delivery_address_details.cldirect_line;
                        $scope.rec.ship_to_contact = $scope.rec.delivery_address_details.clcontact_name;
                        $scope.rec.book_in_tel = $scope.rec.delivery_address_details.clphone;
                        $scope.rec.book_in_email = $scope.rec.delivery_address_details.clemail;
                        $scope.rec.alt_depo_id = $scope.rec.delivery_address_details.id;
                    }

                    $scope.rec.customer_fin_p_id = 0;
                    if (res.data.response.order_finance_details != undefined) {
                        $scope.finance_response = {};
                        $scope.finance_read_only = true;
                        $scope.finance_response = res.data.response.order_finance_details.response;

                        $scope.rec.credit_limit = $scope.finance_response.credit_limit;
                        $scope.rec.customer_balance = $scope.finance_response.customer_balance;
                        $scope.rec.customer_fin_p_id = $scope.finance_response.id;

                        $scope.rec.is_whole_seller = $scope.finance_response.is_whole_seller;
                        $scope.rec.posting_start_date = $scope.finance_response.posting_start_date;
                        $scope.rec.posting_end_date = $scope.finance_response.posting_end_date;

                        // $scope.rec_finance = {};
                        // $scope.$root.c_currency_id = res.data.response.order_finance_details.response.currency_id;
                        $scope.rec.bill_to_cust_no = $scope.finance_response.customer_code;
                        $scope.rec.bill_to_contact = $scope.finance_response.contact_person;

                        if ($scope.rec.anonymous_customer == 0) {
                            $scope.rec.bill_to_contact_email = ($scope.finance_response.invoice_email != undefined && $scope.finance_response.invoice_email != "") ? $scope.finance_response.invoice_email : $scope.finance_response.email;
                            $scope.rec.bill_to_contact_phone = $scope.finance_response.fphone;
                            $scope.rec.fax = $scope.finance_response.ffax;
                            $scope.rec.bill_to_location_id = $scope.finance_response.blid;
                            $scope.rec.bill_to_name = $scope.finance_response.name;
                            $scope.rec.bill_to_loc_name = $scope.finance_response.blname;
                            $scope.rec.bill_to_address = $scope.finance_response.bladdress;
                            $scope.rec.bill_to_address2 = $scope.finance_response.bladdress2;
                            $scope.rec.bill_to_city = $scope.finance_response.blcity;
                            $scope.rec.bill_to_county = $scope.finance_response.blcounty,
                                $scope.rec.bill_to_post_code = $scope.finance_response.blpostcode;

                            // $scope.rec.bill_to_country  = $scope.finance_response.blcountry;
<<<<<<< HEAD
                            angular.forEach($rootScope.country_type_arr, function (elems) {
=======
                            angular.forEach($rootScope.country_type_arr, function(elems) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (elems.id == $scope.finance_response.blcountry)
                                    $scope.rec.bill_to_country_ids = elems;
                            });

                            $scope.rec.alt_contact_person = $scope.finance_response.alt_contact_person;
                            $scope.rec.alt_contact_email = $scope.finance_response.alt_contact_email;
                        }

                        if (res.data.response.bill_to_bank_id != 0) {
                            $scope.rec.bill_to_bank_name = res.data.response.bill_to_bank_name;
                            $scope.rec.bill_to_bank_id = res.data.response.bill_to_bank_id;
<<<<<<< HEAD
                        }
                        else {
=======
                        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            $scope.rec.bill_to_bank_name = $scope.finance_response.bank_name;
                            $scope.rec.bill_to_bank_id = $scope.finance_response.bill_to_bank_id;
                        }

                        var payment_term_id = 0;
                        if (res.data.response.payment_discount != '') {
                            payment_discount = res.data.response.payment_discount;
<<<<<<< HEAD
                        }
                        else {
=======
                        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            payment_discount = $scope.finance_response.payment_terms_id;
                        }

                        /* 
                        angular.forEach($rootScope.arr_payment_terms, function (elem, index) {
                            if (elem.id == payment_discount) {
                                $scope.drp.payment_terms_ids = elem;
                            }
                        }); */

<<<<<<< HEAD
                        angular.forEach($rootScope.arr_paymentTerms, function (elem, index) {
=======
                        angular.forEach($rootScope.arr_paymentTerms, function(elem, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (elem.id == payment_discount) {
                                $scope.drp.payment_terms_ids = elem;
                            }
                        });

                        var payment_method_id = 0;
                        if (res.data.response.payment_method_id != '') {
                            payment_method_id = res.data.response.payment_method_id;
<<<<<<< HEAD
                        }
                        else {
=======
                        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            payment_method_id = $scope.finance_response.payment_method_id;
                        }
                        /* 
                        angular.forEach($rootScope.arr_payment_methods, function (elem, index) {
                            if (elem.id == payment_method_id) {
                                $scope.drp.payment_method_ids = elem;
                            }
                        }); */

<<<<<<< HEAD
                        angular.forEach($rootScope.arr_paymentMethods, function (elem, index) {
=======
                        angular.forEach($rootScope.arr_paymentMethods, function(elem, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (elem.id == payment_method_id) {
                                $scope.drp.payment_method_ids = elem;
                            }
                        });

                        if ($rootScope.arr_posting_grp) {
<<<<<<< HEAD
                            angular.forEach($rootScope.arr_posting_grp, function (obj) {
=======
                            angular.forEach($rootScope.arr_posting_grp, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (obj.id == $scope.finance_response.posting_group_id) {
                                    $scope.drp.vat_bus_posting_group = obj;
                                    $scope.drp.vat_bus_posting_group_id = obj.id;
                                    $rootScope.order_posting_group_id = obj.id;
                                }
                            });
                        }
                        /* 
                            angular.forEach($rootScope.arr_posting_group_ids, function (obj) {
                                if (obj.id == $scope.finance_response.posting_group_id) {
                                    $scope.drp.vat_bus_posting_group = obj;
                                    $scope.drp.vat_bus_posting_group_id = obj.id;
                                    $rootScope.order_posting_group_id = obj.id;
                                }
                            });
                        */

                        /* angular.forEach($scope.arr_finance_charges, function (elem, index) {
                            if (elem.id == $scope.finance_response.finance_charges_id) {
                                $scope.drp.finance_charges_ids = elem;
                            }
                        });
                        angular.forEach($scope.arr_insurance_charges, function (elem, index) {
                            if (elem.id == $scope.finance_response.insurance_charges_id) {
                                $scope.drp.insurance_charges_ids = elem;
                            }
                        }); */
                        if ($scope.finance_response.insurance_check == 1)
                            $scope.rec.bill_to_insurance_charges = $scope.finance_response.inscharges;
                        else
                            $scope.rec.bill_to_insurance_charges = 0;
                        $scope.rec.bill_to_insurance_charges_type = $scope.finance_response.inschargetype;

                        if ($scope.finance_response.finance_check == 1)
                            $scope.rec.bill_to_finance_charges = $scope.finance_response.fincharges;
                        else
                            $scope.rec.bill_to_finance_charges = 0;
                        $scope.rec.bill_to_finance_charges_type = $scope.finance_response.finchargetype;


                        /* 
                        if ($scope.finance_response.generate != undefined) {
                            var arrGen = $scope.finance_response.generate.split(',');
                            angular.forEach($scope.arr_generate, function (elem, index) {
                                var indx = arrGen.indexOf(elem.id) == -1;
                                if (!indx) {
                                    $scope.arr_generate[index].chk = true;
                                }
                            })
                        } */
<<<<<<< HEAD
                    }
                    else {
=======
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        /* angular.forEach($rootScope.arr_payment_terms, function (elem, index) {
                            if (elem.id == res.data.response.payment_discount) {
                                $scope.drp.payment_terms_ids = elem;
                            }
                        });

                        angular.forEach($rootScope.arr_payment_methods, function (elem, index) {
                            if (elem.id == res.data.response.payment_method_id) {
                                $scope.drp.payment_method_ids = elem;
                            }
                        }); */

<<<<<<< HEAD
                        angular.forEach($rootScope.arr_paymentTerms, function (elem, index) {
=======
                        angular.forEach($rootScope.arr_paymentTerms, function(elem, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (elem.id == res.data.response.payment_discount) {
                                $scope.drp.payment_terms_ids = elem;
                            }
                        });

<<<<<<< HEAD
                        angular.forEach($rootScope.arr_paymentMethods, function (elem, index) {
=======
                        angular.forEach($rootScope.arr_paymentMethods, function(elem, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (elem.id == res.data.response.payment_method_id) {
                                $scope.drp.payment_method_ids = elem;
                            }
                        });

                        if ($rootScope.arr_posting_grp) {
<<<<<<< HEAD
                            angular.forEach($rootScope.arr_posting_grp, function (elem) {
=======
                            angular.forEach($rootScope.arr_posting_grp, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (elem.id == res.data.response.bill_to_posting_group_id) {
                                    $scope.drp.vat_bus_posting_group = elem;
                                    $scope.drp.vat_bus_posting_group_id = elem.id;
                                    $rootScope.order_posting_group_id = elem.id;
                                }
                            });
                        }

                        /* angular.forEach($rootScope.arr_posting_group_ids, function (elem, index) {
                            if (elem.id == res.data.response.bill_to_posting_group_id) {
                                $scope.drp.vat_bus_posting_group = elem;
                                $scope.drp.vat_bus_posting_group_id = elem.id;
                                $rootScope.order_posting_group_id = elem.id;
                            }
                        }); */

                        /* angular.forEach($scope.arr_finance_charges, function (elem, index) {
                            if (elem.id == res.data.response.bill_to_finance_charges_id) {
                                $scope.drp.finance_charges_ids = elem;
                            }
                        });
                        angular.forEach($scope.arr_insurance_charges, function (elem, index) {
                            if (elem.id == res.data.response.bill_to_insurance_charges_id) {
                                $scope.drp.insurance_charges_ids = elem;
                            }
                        }); */

<<<<<<< HEAD
                        angular.forEach($rootScope.country_type_arr, function (obj) {
=======
                        angular.forEach($rootScope.country_type_arr, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (obj.id == res.data.response.bill_to_country_id)
                                $scope.rec.bill_to_country_ids = obj;
                        });

                    }

                    if (res.data.response.type == 0 && !$scope.drp.vat_bus_posting_group_id) {

                        if (res.data.response.bill_to_posting_group_id) {

                            /* 
                            angular.forEach($rootScope.arr_posting_group_ids, function (elem, index) {
                                if (elem.id == res.data.response.bill_to_posting_group_id) {
                                    $scope.drp.vat_bus_posting_group = elem;
                                    $scope.drp.vat_bus_posting_group_id = elem.id;
                                    $rootScope.order_posting_group_id = elem.id;
                                }
                            });   
                            */

                            if ($rootScope.arr_posting_grp) {
<<<<<<< HEAD
                                angular.forEach($rootScope.arr_posting_grp, function (elem) {
=======
                                angular.forEach($rootScope.arr_posting_grp, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    if (elem.id == res.data.response.bill_to_posting_group_id) {
                                        $scope.drp.vat_bus_posting_group = elem;
                                        $scope.drp.vat_bus_posting_group_id = elem.id;
                                        $rootScope.order_posting_group_id = elem.id;
                                    }
                                });
                            }
<<<<<<< HEAD
                        }
                        else {
=======
                        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            console.log($rootScope.arr_posting_grp);
                            console.log($rootScope.arr_posting_group_ids);
                        }
                    }

                    $scope.selectedPurchaseOrders = res.data.response.selectedPurchaseOrders;
                    $scope.selectedPurchaseOrdersIDs = res.data.response.selectedPurchaseOrdersIDs;

                    if (res.data.response.selectedPOs && res.data.response.selectedPOs.response)
                        $scope.selectedPOs = res.data.response.selectedPOs.response;

                    $scope.selectedPurchaseOrderArr = [];
                    $scope.selectedPurchaseOrderModal = [];

<<<<<<< HEAD
                    angular.forEach($scope.selectedPurchaseOrdersIDs, function (obj) {
=======
                    angular.forEach($scope.selectedPurchaseOrdersIDs, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.selectedPurchaseOrderArr.push({ 'id': obj });

                        /* var selRecord = {};
                        selRecord.key = obj.id;
                        selRecord.record = obj;
                        selRecord.value = obj.order_code;							

                        $scope.selectedPurchaseOrderModal.push(selRecord);  */
                    });

<<<<<<< HEAD
                    angular.forEach($scope.selectedPOs, function (obj) {
=======
                    angular.forEach($scope.selectedPOs, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        var selRecord = {};
                        selRecord.key = obj.id;
                        selRecord.record = obj;
                        selRecord.value = obj.order_code;

                        $scope.selectedPurchaseOrderModal.push(selRecord);
                    });


                    if (res.data.response.posting_date == 0)
                        $scope.rec.posting_date = null;
                    else {
                        $scope.rec.posting_date = $scope.$root.convert_unix_date_to_angular(res.data.response.posting_date);
                        $scope.CalculateDueDate();
                    }

                    /* $scope.selectedPurchaseOrders = "";
                    var selectedPurchaseOrders_name = "";

                    $scope.PurchaseOrderArr = res.data.response.PurchaseOrderslisting.response;

                    if (res.data.response.PurchaseOrders != undefined && $scope.PurchaseOrderArr != undefined) {

                        if ($scope.PurchaseOrderArr.length > 0) {

                            angular.forEach(res.data.response.PurchaseOrderslisting.response, function (obj) {
                                angular.forEach(res.data.response.PurchaseOrders, function (obj2) {
                                    if (obj2.purchaseOrderID == obj.id) {
                                        $scope.selectedPurchaseOrderArr.push(obj);
                                        selectedPurchaseOrders_name += obj.order_code + "; ";
                                    }
                                });
                            });
                            $scope.selectedPurchaseOrders = selectedPurchaseOrders_name.substring(0, selectedPurchaseOrders_name.length - 2);
                        }
                    } */
                    /* if (Number($scope.rec.no_of_items) > 0)
                    {
                        // $scope.$broadcast('LoadOderItems');
                        $timeout(function () {
                            $scope.$broadcast('LoadOderItems');
                        }, 500);
                    } */
                    $scope.showLoader = false;
<<<<<<< HEAD
=======

                    $scope.chkInvPaymentStatus($stateParams.id);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                }

                // 2nd tab
                /* $scope.rec.company_reg_no = $scope.finance_response.company_reg_no;
                $scope.bank_name = $scope.finance_response.bill_bank_name;
                $scope.rec.account_name = $scope.finance_response.account_name;
                $scope.rec.account_no = $scope.finance_response.account_no;
                $scope.rec.swift_no = $scope.finance_response.swift_no;
                $scope.rec.iban = $scope.finance_response.iban;
                $scope.rec.sort_code = $scope.finance_response.sort_code;
                $scope.rec.bill_bank_name = $scope.finance_response.bill_bank_name;
                $scope.rec.vat_number = $scope.finance_response.vat_number;
                $scope.bill_to_cust_id = $scope.finance_response.customer_id;
 */

            });

    }



<<<<<<< HEAD
    $scope.$on('NetValue', function (event, data) {
        $scope.net_val = data;
    });
    $scope.$on('ItemsNetValue', function (event, data) {
        $scope.items_net_val = data;
    });
    $scope.$on('NetVAT', function (event, data) {
        $scope.net_vat = data;
    });
    $scope.$on('NetDiscount', function (event, data) {
        $scope.net_discount = data;
    });
    $scope.$on('GrandTotal', function (event, data) {
        $scope.grand_total = data;
    });

    $scope.generalInformation = function () {
        // $scope.$root.breadcrumbs.name = 'General';
    }
    $scope.invoice_information = function () {
        // $scope.$root.breadcrumbs[3].name = 'Invoice';
    }

    $scope.shiping_information = function () {
        // $scope.$root.breadcrumbs[3].name = 'Shipping';
    }

    $scope.save_sale_order = function (rec, rec2, flag) {
=======
    $scope.$on('NetValue', function(event, data) {
        $scope.net_val = data;
    });
    $scope.$on('ItemsNetValue', function(event, data) {
        $scope.items_net_val = data;
    });
    $scope.$on('NetVAT', function(event, data) {
        $scope.net_vat = data;
    });
    $scope.$on('NetDiscount', function(event, data) {
        $scope.net_discount = data;
    });
    $scope.$on('GrandTotal', function(event, data) {
        $scope.grand_total = data;

        // console.log('rec.currentAllocatedPayment == ', parseFloat($scope.rec.currentAllocatedPayment).toFixed(2));
        // console.log('grand_total == ', parseFloat($scope.grand_total).toFixed(2));
        // console.log('currentAllocatedPayment == ', parseFloat($scope.rec.currentAllocatedPayment).toFixed(2) < parseFloat($scope.grand_total).toFixed(2));

        if (parseFloat($scope.rec.currentAllocatedPayment) > 0 && parseFloat($scope.rec.currentAllocatedPayment).toFixed(2) == parseFloat($scope.grand_total).toFixed(2))
            $scope.customerPaymentStatus = 'allocated';
        else if (parseFloat($scope.rec.currentAllocatedPayment) > 0 && parseFloat($scope.rec.currentAllocatedPayment) < parseFloat($scope.grand_total))
            $scope.customerPaymentStatus = 'partial';
        else
            $scope.customerPaymentStatus = '';
    });

    $scope.$on('updatePaymentStatus', function(event, data) {
        $scope.chkInvPaymentStatus(data);
    });

    $scope.$on('currency_rate', function(event, data) {
        $scope.rec.currency_rate = data;
    });


    $scope.generalInformation = function() {
        // $scope.$root.breadcrumbs.name = 'General';
    }
    $scope.invoice_information = function() {
        // $scope.$root.breadcrumbs[3].name = 'Invoice';
    }

    $scope.shiping_information = function() {
        // $scope.$root.breadcrumbs[3].name = 'Shipping';
    }

    $scope.save_sale_order = function(rec, rec2, flag) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.stats_information(void 0, 0, rec, rec2, flag);
    }

<<<<<<< HEAD
    $scope.stats_information = function (org_vals, is_post_request, rec, rec2, queue_for_approval) {
        // org_vals = !(parseInt($scope.marginAnalysisView) ? false : true)
        if (org_vals == undefined) {
            org_vals = ($scope.marginAnalysisView == 0) ? 1 : 0;
        }
        else {
=======
    $scope.stats_information = function(org_vals, is_post_request, rec, rec2, queue_for_approval) {
        // org_vals = !(parseInt($scope.marginAnalysisView) ? false : true)
        if (org_vals == undefined) {
            org_vals = ($scope.marginAnalysisView == 0) ? 1 : 0;
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            org_vals = !org_vals;
        }
        if ($scope.rec.type == 2) {

            // org_vals = (org_vals == undefined) ? parseInt($scope.marginAnalysisView) 

            $scope.stats = {};
            $scope.stats.show_org = (org_vals == 0) ? false : true;
            $scope.stats.sales_vale_ex_vat = (Number($scope.net_val) / Number($scope.rec.currency_rate)).toFixed(2);

            if (org_vals == 0) {
                $scope.stats.total_purchase_cost = Number($scope.rec.purchase_cost).toFixed(2);
                $scope.stats.original_additional_cost = 0;
<<<<<<< HEAD
            }
            else {
=======
            } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.stats.total_purchase_cost = Number($scope.rec.org_purchase_cost).toFixed(2);
                $scope.stats.original_additional_cost = Number($scope.rec.items_original_additional_cost).toFixed(2);
            }

            $scope.stats.storage_cost = Number($scope.rec.storage_cost).toFixed(2);
            $scope.stats.finance_charges = Number($scope.rec.finance_charges).toFixed(2);
            $scope.stats.insurance_charges = Number($scope.rec.insurance_charges).toFixed(2);
            $scope.stats.rebate_price = Number($scope.rec.rebate_price).toFixed(2);
            $scope.stats.other_costs = Number($scope.rec.other_costs).toFixed(2);

            var cost_items = $filter("filter")($scope.items, { item_type: 0 });
<<<<<<< HEAD
            angular.forEach(cost_items, function (item) {
                // accumulative margin analysis
                if (org_vals != 1) {
                    item.cost = item.item_org_cost;
                }
                else {
=======
            angular.forEach(cost_items, function(item) {
                // accumulative margin analysis
                if (org_vals != 1) {
                    item.cost = item.item_org_cost;
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    item.cost = item.item_cost;
                }
            });

            $scope.stats.vat = ($scope.net_vat / Number($scope.rec.currency_rate)).toFixed(2);
            $scope.stats.promo_discount = Number($scope.rec.promo_discount).toFixed(2);

            /* if ($scope.rec.bill_to_finance_charges_type == 1) {
                $scope.stats.finance_charges = ((Number($scope.grand_total) * Number($scope.rec.bill_to_finance_charges)) / 100).toFixed(2);
            }
            else {
                $scope.stats.finance_charges = (Number($scope.grand_total) - ((Number($scope.grand_total) - Number($scope.rec.bill_to_finance_charges)))).toFixed(2);
            }

            if ($scope.rec.bill_to_insurance_charges_type == 1) {
                $scope.stats.insurance_charges = ((Number($scope.grand_total) * Number($scope.rec.bill_to_insurance_charges)) / 100).toFixed(2);
            }
            else {
                $scope.stats.insurance_charges = (Number($scope.grand_total) - ((Number($scope.grand_total) - Number($scope.rec.bill_to_insurance_charges)))).toFixed(2);
            } */

            $scope.stats.freight_charges = 0;
            if ($scope.rec.freight_charges != undefined)
                $scope.stats.freight_charges = Number($scope.rec.freight_charges).toFixed(2);

            $scope.stats.sales_value = (Number($scope.grand_total) / Number($scope.rec.currency_rate)).toFixed(2);

            $scope.stats.item_additional_cost = [];


            var item = {};
            item.value = 0;
            $scope.stats.item_additional_cost.push(item); // Will be removed as item cost 

            var item = {};
            item.name = $scope.rec.stats_item_additional_cost_1_name;
            item.value = Number($scope.rec.stats_item_additional_cost_1);
            $scope.stats.item_additional_cost.push(item);

            var item = {};
            item.name = $scope.rec.stats_item_additional_cost_2_name;
            item.value = Number($scope.rec.stats_item_additional_cost_2);
            $scope.stats.item_additional_cost.push(item);

            var item = {};
            item.name = $scope.rec.stats_item_additional_cost_3_name;
            item.value = Number($scope.rec.stats_item_additional_cost_3);
            $scope.stats.item_additional_cost.push(item);

            var item = {};
            item.name = $scope.rec.stats_item_additional_cost_4_name;
            item.value = Number($scope.rec.stats_item_additional_cost_4);
            $scope.stats.item_additional_cost.push(item);

            /* var item = {};
            item.name = $scope.rec.stats_item_additional_cost_5_name;
            item.value = Number($scope.rec.stats_item_additional_cost_5);
            $scope.stats.item_additional_cost.push(item); */


            var total_item_costs = 0;
<<<<<<< HEAD
            angular.forEach($scope.stats.item_additional_cost, function (obj) {
=======
            angular.forEach($scope.stats.item_additional_cost, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                total_item_costs = total_item_costs + Number(obj.value);
                obj.value = Number(obj.value).toFixed(2);
            });

            /* angular.forEach($scope.items, function (obj) {
                if (obj.item_type == 1 && obj.ref_prod_id > 0)
                    $scope.stats.promo_discount = $scope.stats.promo_discount + Number(obj.total_price);
            }); */


            $scope.stats.total_cost = Number($scope.stats.total_purchase_cost) +
                Number($scope.stats.promo_discount) + Number($scope.stats.storage_cost) + Number($scope.stats.finance_charges) + Number($scope.stats.insurance_charges) +
                Number($scope.stats.freight_charges) + Number($scope.stats.rebate_price);

            if (!org_vals) {
                $scope.stats.total_cost = $scope.stats.total_cost + Number($scope.stats.other_costs) + Number(total_item_costs);
<<<<<<< HEAD
            }
            else {
=======
            } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.stats.total_cost = $scope.stats.total_cost + Number($scope.stats.original_additional_cost);
            }

            $scope.stats.total_cost = $scope.stats.total_cost.toFixed(2);

            $scope.stats.profit = Number($scope.stats.sales_vale_ex_vat) - Number($scope.stats.total_cost);

            $scope.stats.profit = $scope.stats.profit.toFixed(2);
            $scope.stats.profit_percentage = ((Number($scope.stats.profit) / Number($scope.stats.sales_vale_ex_vat)) * 100).toFixed(2);

            if (isNaN($scope.stats.profit_percentage) || !isFinite($scope.stats.profit_percentage))
                $scope.stats.profit_percentage = (0).toFixed(2);

            $scope.stats.sales_value = $scope.stats.sales_value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            $scope.stats.sales_vale_ex_vat = $scope.stats.sales_vale_ex_vat.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            $scope.stats.vat = $scope.stats.vat.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            $scope.stats.promo_discount = $scope.stats.promo_discount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            $scope.stats.rebate_price = $scope.stats.rebate_price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            $scope.stats.storage_cost = $scope.stats.storage_cost.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            $scope.stats.finance_charges = $scope.stats.finance_charges.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            $scope.stats.insurance_charges = $scope.stats.insurance_charges.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            $scope.stats.freight_charges = $scope.stats.freight_charges.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            $scope.stats.total_purchase_cost = $scope.stats.total_purchase_cost.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            $scope.stats.other_costs = $scope.stats.other_costs.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            $scope.stats.profit = $scope.stats.profit.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            $scope.stats.total_cost = $scope.stats.total_cost.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

<<<<<<< HEAD
        }
        else {
=======
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.stats = {};

            if ($scope.net_val < 0) {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(502, ['Order value ', '0']));

                return;
            }
            // org_vals = parseInt($scope.marginAnalysisView);
            $scope.stats.show_org = (org_vals == 0) ? false : true;
            // var order_stats = $scope.$root.sales + "customer/order/get-sales-order-stats"; // get accumulative stats
            var order_stats = $scope.$root.setup + "ledger-group/get-all-item-additional-cost";

            // $scope.showLoader = true;
            $scope.stats.item_additional_cost = [];
            $http
                .post(order_stats, { 'token': $scope.$root.token, 'order_id': $scope.$root.order_id, 'type': '2', 'defaults': '1', 'check_status': 1, 'get_rebate': '1', 'crm_id': $scope.$root.crm_id, 'order_date': $scope.rec.offer_date })
<<<<<<< HEAD
                .then(function (res) {
=======
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        /* 
                            // get in case  of accumulative stats
                            if(res.data.response.item_additional_cost.ack == 1)
                            $scope.stats.item_additional_cost = res.data.response.item_additional_cost.response; */
                        $scope.stats.item_additional_cost = res.data.response;
                        $scope.stats.universal_rebate = res.data.universal_rebate.response;
                    }

                    if (res.data.ack != undefined) {
                        // $scope.showLoader = false;
                        $scope.stats.other_costs = 0;
                        $scope.stats.storage_cost = 0;
                        $scope.stats.total_purchase_cost = 0;
                        $scope.stats.org_purchase_cost = 0;
                        $scope.stats.purchase_cost = 0;
                        $scope.stats.margin_analysis_cost = 0;

                        $scope.stats.sales_vale_ex_vat = (Number($scope.net_val) / Number($scope.rec.currency_rate)).toFixed(2);
                        // var total_without_items = $scope.stats.sales_vale_ex_vat - (Number($scope.items_net_val)/Number($scope.rec.currency_rate));
                        $scope.stats.rebate_price = 0;

                        if ($scope.stats.universal_rebate.length > 0) // universal rebate is already added into item level we will do it total excluding items
                        {
                            console.log($scope.stats.universal_rebate);
<<<<<<< HEAD
                            angular.forEach($scope.stats.universal_rebate, function (reb) {
=======
                            angular.forEach($scope.stats.universal_rebate, function(reb) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                // for universal rebate for the customer i.e rebate type==1
                                if (reb.rebate_type == 1) {
                                    if (reb.rebate_price_type == 1) // percentage //items_net_val
                                        $scope.stats.rebate_price = parseFloat($scope.stats.rebate_price) + parseFloat($scope.net_val) * (parseFloat(reb.rebate_price) / 100);
                                    if (reb.rebate_price_type == 2) // value
                                        $scope.stats.rebate_price = parseFloat($scope.stats.rebate_price) + parseFloat(reb.rebate_price);
                                }

                                // for Separate Rebate for Category(ies) i.e rebate_type=2
                                if (reb.rebate_type == 2) {
<<<<<<< HEAD
                                    angular.forEach(reb.cat_items.response, function (itm) {
                                        var reb_cat_items = $filter("filter")($scope.items, { item_type: 0, id: itm.id });
                                        if (reb_cat_items.length > 0) {
                                            angular.forEach(reb_cat_items, function (itm) {
=======
                                    angular.forEach(reb.cat_items.response, function(itm) {
                                        var reb_cat_items = $filter("filter")($scope.items, { item_type: 0, id: itm.id });
                                        if (reb_cat_items.length > 0) {
                                            angular.forEach(reb_cat_items, function(itm) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                var item_total_price = itm.total_price;
                                                if (reb.rebate_price_type == 1) {
                                                    $scope.stats.rebate_price = parseFloat($scope.stats.rebate_price) + (parseFloat(item_total_price) * (parseFloat(reb.rebate_price)) / 100);
                                                }
                                                if (reb.rebate_price_type == 2) {
                                                    $scope.stats.rebate_price = parseFloat($scope.stats.rebate_price) + parseFloat(reb.rebate_price);
                                                }
                                            });
                                        }
                                    });
                                }

                                // for Separate Rebate for Items i.e rebate type=3
                                if (reb.rebate_type == 3) {
<<<<<<< HEAD
                                    angular.forEach(reb.items.response, function (itm) {
                                        var reb_items = $filter("filter")($scope.items, { item_type: 0, id: itm.id });
                                        if (reb_items.length > 0) {
                                            angular.forEach(reb_items, function (itm) {
=======
                                    angular.forEach(reb.items.response, function(itm) {
                                        var reb_items = $filter("filter")($scope.items, { item_type: 0, id: itm.id });
                                        if (reb_items.length > 0) {
                                            angular.forEach(reb_items, function(itm) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                var item_total_price = itm.total_price;
                                                if (reb.rebate_price_type == 1) {
                                                    $scope.stats.rebate_price = parseFloat($scope.stats.rebate_price) + (parseFloat(item_total_price) * (parseFloat(reb.rebate_price)) / 100);
                                                }
                                                if (reb.rebate_price_type == 2) {
                                                    $scope.stats.rebate_price = parseFloat($scope.stats.rebate_price) + parseFloat(reb.rebate_price);
                                                }
                                            });
                                        }
                                    });
                                }

                                /* if (reb.universal_type == 1) {
                                    if (reb.rebate_price_type == 1) // percentage //items_net_val
                                        $scope.stats.rebate_price = parseFloat($scope.stats.rebate_price) + parseFloat($scope.net_val) * (parseFloat(reb.rebate_price) / 100);
                                    if (reb.rebate_price_type == 2) // value
                                        $scope.stats.rebate_price = parseFloat($scope.stats.rebate_price) + parseFloat(reb.rebate_price);
                                } else {
                                    //if(reb.items.length>0){
                                    angular.forEach(reb.items.response, function (itm) {
                                        // console.log(itm.id);
                                        var reb_items = $filter("filter")($scope.items, { item_type: 0, id: itm.id });
                                        if (reb_items.length > 0) {
                                            //console.log('rebate items');
                                            //console.log(reb_items);
                                            angular.forEach(reb_items, function (itm) {
                                                var item_qty = itm.qty;
                                                var item_total_price = itm.total_price;
                                                var count = 0;
                                                console.log('reb.revenueVolume.length');
                                                console.log(reb.revenueVolume.length);
                                                angular.forEach(reb.revenueVolume, function (revVol) {
                                                    // for volume
                                                    if (reb.universal_type == 2) {
                                                        if (item_qty >= revVol.revenue_volume_from && count == 0) {
                                                            console.log(revVol.rebate);
                                                            if (reb.rebate_price_type == 1) {
                                                                $scope.stats.rebate_price = parseFloat($scope.stats.rebate_price) + (parseFloat(item_total_price) * (parseFloat(revVol.rebate)) / 100);
                                                            }
                                                            if (reb.rebate_price_type == 2) {
                                                                $scope.stats.rebate_price = parseFloat($scope.stats.rebate_price) + parseFloat(revVol.rebate);
                                                            }
                                                            count++;
                                                        }
                                                    }
                                                    // for revenue
                                                    if (reb.universal_type == 3) {
                                                        if (item_total_price >= revVol.revenue_volume_from && count == 0) {
                                                            console.log(revVol.rebate);
                                                            if (reb.rebate_price_type == 1) {
                                                                console.log((parseFloat(item_total_price) * (parseFloat(revVol.rebate)) / 100));
                                                                $scope.stats.rebate_price = parseFloat($scope.stats.rebate_price) + (parseFloat(item_total_price) * (parseFloat(revVol.rebate)) / 100);
                                                            }
                                                            console.log($scope.stats.rebate_price);
                                                            if (reb.rebate_price_type == 2) {
                                                                $scope.stats.rebate_price = parseFloat($scope.stats.rebate_price) + parseFloat(revVol.rebate);
                                                            }
                                                            count++;
                                                        }
                                                    }
                                                });
                                            });
                                        }
                                    });
                                    //}
                                } */
                            });

                        }
                        $scope.stats.rebate_price = Number($scope.stats.rebate_price) / Number($scope.rec.currency_rate); // doing conversion here because item rebates are already converted to lcy
                        var cost_items = $filter("filter")($scope.items, { item_type: 0 });
                        var total_items_qty = 0;
<<<<<<< HEAD
                        angular.forEach(cost_items, function (item) {
=======
                        angular.forEach(cost_items, function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                            total_items_qty += Number(item.qty);
                            // accumulative margin analysis
                            item.item_additional_cost = 0;
                            $scope.stats.org_purchase_cost = $scope.stats.org_purchase_cost + (Number(item.org_purchase_cost) * Number(item.qty));

                            if (item.margin_analysis != undefined) {
<<<<<<< HEAD
                                angular.forEach(item.margin_analysis, function (mrg_an) {
                                    if (mrg_an.ref_id == null)// && org_vals == 0) // don't count if untick (*UPDATE* NO COUNT IT BUT DON'T SHOW IT)
                                    {
                                        $scope.stats.other_costs = $scope.stats.other_costs + (Number(mrg_an.amount) * Number(item.qty));
                                        item.item_additional_cost += Number(mrg_an.amount) * Number(item.qty);
                                    }
                                    else if (mrg_an.ref_id == 1) // 1 is for purchase cost
=======
                                angular.forEach(item.margin_analysis, function(mrg_an) {
                                    if (mrg_an.ref_id == null) // && org_vals == 0) // don't count if untick (*UPDATE* NO COUNT IT BUT DON'T SHOW IT)
                                    {
                                        $scope.stats.other_costs = $scope.stats.other_costs + (Number(mrg_an.amount) * Number(item.qty));
                                        item.item_additional_cost += Number(mrg_an.amount) * Number(item.qty);
                                    } else if (mrg_an.ref_id == 1) // 1 is for purchase cost
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    {
                                        // if (org_vals == 1) // for orginial
                                        // $scope.stats.org_purchase_cost = $scope.stats.org_purchase_cost + (Number(item.org_purchase_cost) * Number(item.qty)); // caluated in outer loop
                                        // else
                                        $scope.stats.purchase_cost = $scope.stats.purchase_cost + (Number(item.purchase_cost) * Number(item.qty));
<<<<<<< HEAD
                                    }
                                    else {
                                        // if (org_vals == 0) // don't count if untick (*UPDATE* NO COUNT IT BUT DON'T SHOW IT)
                                        {
                                            angular.forEach($scope.stats.item_additional_cost, function (ref_mrg_an) {
=======
                                    } else {
                                        // if (org_vals == 0) // don't count if untick (*UPDATE* NO COUNT IT BUT DON'T SHOW IT)
                                        {
                                            angular.forEach($scope.stats.item_additional_cost, function(ref_mrg_an) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                if (mrg_an.marginal_analysis_id == ref_mrg_an.id) {
                                                    ref_mrg_an.value = Number(ref_mrg_an.value) + (Number(mrg_an.amount) * Number(item.qty));
                                                    $scope.stats.margin_analysis_cost = Number($scope.stats.margin_analysis_cost) + (Number(mrg_an.amount) * Number(item.qty));
                                                    item.item_additional_cost += Number(mrg_an.amount) * Number(item.qty);
                                                    ref_mrg_an.value = ref_mrg_an.value.toFixed(2);
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                            // accumulative storage cost
<<<<<<< HEAD
                            $scope.stats.storage_cost = Number($scope.stats.storage_cost) + (Number(item.storage_cost));// * Number(item.qty));
=======
                            $scope.stats.storage_cost = Number($scope.stats.storage_cost) + (Number(item.storage_cost)); // * Number(item.qty));
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                            // accumulative purchase cost
                            // calcualte org cost
                            item.org_cost = 0;
                            /* angular.forEach(item.margin_analysis, function (obj1) {
                                if (obj1.ref_id != 1) // already calculated as purchase cost
                                    item.org_cost = item.org_cost + Number(obj1.amount);
                            }); */
                            item.org_cost = Number(item.org_purchase_cost) * Number(item.qty);
                            item.org_cost = Number(item.org_cost) + Number(item.item_org_additional_cost) + Number(item.storage_cost);

                            item.item_org_cost = item.org_cost;

                            // calculate non-org cost
                            item._cost = 0;
                            /* angular.forEach(item.margin_analysis, function (obj1) {
                                if (obj1.ref_id != 1) // already calculated as purchase cost
                                    item._cost = item._cost + Number(obj1.amount);
                            }); */
                            item._cost = Number(item._cost) + Number(item.purchase_cost) * Number(item.qty);
                            item._cost = Number(item._cost) + Number(item.item_additional_cost) + Number(item.storage_cost);
                            item.item_cost = item._cost;


                            if (org_vals != 1) {
                                item.cost = item._cost;
<<<<<<< HEAD
                            }
                            else {
=======
                            } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                item.cost = item.org_cost;
                            }

                        });

                        $scope.stats.items_original_additional_cost = ($rootScope.items_original_additional_cost) ? $rootScope.items_original_additional_cost : 0;
                        if (org_vals == 1) {
                            $scope.stats.total_purchase_cost = $scope.stats.org_purchase_cost;
                            $scope.stats.original_additional_cost = $scope.stats.items_original_additional_cost; // for calculation and display
<<<<<<< HEAD
                        }
                        else {
=======
                        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            $scope.stats.total_purchase_cost = $scope.stats.purchase_cost;
                            $scope.stats.original_additional_cost = 0; // for calculation and display
                        }

                        $scope.stats.promo_discount = 0;

<<<<<<< HEAD
                        angular.forEach($scope.items, function (obj) {
=======
                        angular.forEach($scope.items, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (obj.item_type == 1 && obj.ref_prod_id > 0)
                                $scope.stats.promo_discount = $scope.stats.promo_discount + Number(obj.total_price);

                            // // as we are looping on items so do the rebates here
                            // $scope.stats.rebate_price += Number(obj.rebate);

                            // accumulative rebate cost
                            var other_rebates = obj.rebate_type.split(',');
                            other_rebates.pop();
                            const idx = other_rebates.indexOf("1");

                            if (idx !== -1) {
                                other_rebates.splice(idx, 1);
                            }
<<<<<<< HEAD
                            angular.forEach(other_rebates, function (obj1) {
=======
                            angular.forEach(other_rebates, function(obj1) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                //if (obj1 != 1) // universal rebate is already calculated ( NOT INCLUDED ON ITEM LEVEL)
                                // $scope.stats.rebate_price = Number($scope.stats.rebate_price) + ((Number(obj.rebate) / Number($scope.rec.currency_rate)) * Number(obj.qty));

                                obj.item_rebate = Number(obj.item_rebate) + ((Number(obj.rebate) / Number($scope.rec.currency_rate)) * Number(obj.qty));
                            });

                        });

                        if (isNaN($scope.stats.total_purchase_cost) || !isFinite($scope.stats.total_purchase_cost))
                            $scope.stats.total_purchase_cost = (0).toFixed(2);
                        else
                            $scope.stats.total_purchase_cost = Number($scope.stats.total_purchase_cost).toFixed(2);

                        $scope.stats.original_additional_cost = Number($scope.stats.original_additional_cost).toFixed(2);
                        $scope.stats.storage_cost = Number($scope.stats.storage_cost).toFixed(2);
                        $scope.stats.rebate_price = Number($scope.stats.rebate_price).toFixed(2);
                        $scope.stats.other_costs = Number($scope.stats.other_costs).toFixed(2);

                        $scope.stats.vat = ($scope.net_vat / Number($scope.rec.currency_rate)).toFixed(2);
                        // $scope.stats.promo_discount = $scope.stats.promo_discount + Number($scope.net_discount);
                        $scope.stats.promo_discount = ($scope.stats.promo_discount / Number($scope.rec.currency_rate)).toFixed(2);


                        if ($scope.rec.bill_to_finance_charges_type == 1) {
<<<<<<< HEAD
                            $scope.stats.finance_charges = ((Number($scope.grand_total) * Number($scope.rec.bill_to_finance_charges)) / 100);//.toFixed(2);
                            $scope.stats.finance_charges = Number($scope.stats.finance_charges) / Number($scope.rec.currency_rate);
                        }
                        else {
                            $scope.stats.finance_charges = ((Number($scope.grand_total) / Number($scope.rec.currency_rate)) - (((Number($scope.grand_total) / Number($scope.rec.currency_rate)) - Number($scope.rec.bill_to_finance_charges))));//.toFixed(2);
                        }

                        if ($scope.rec.bill_to_insurance_charges_type == 1) {
                            $scope.stats.insurance_charges = ((Number($scope.grand_total) * Number($scope.rec.bill_to_insurance_charges)) / 100);//.toFixed(2);
                            $scope.stats.insurance_charges = Number($scope.stats.insurance_charges) / Number($scope.rec.currency_rate);
                        }
                        else {
                            $scope.stats.insurance_charges = ((Number($scope.grand_total) / Number($scope.rec.currency_rate)) - (((Number($scope.grand_total) / Number($scope.rec.currency_rate)) - Number($scope.rec.bill_to_insurance_charges))));//.toFixed(2);
=======
                            $scope.stats.finance_charges = ((Number($scope.grand_total) * Number($scope.rec.bill_to_finance_charges)) / 100); //.toFixed(2);
                            $scope.stats.finance_charges = Number($scope.stats.finance_charges) / Number($scope.rec.currency_rate);
                        } else {
                            $scope.stats.finance_charges = ((Number($scope.grand_total) / Number($scope.rec.currency_rate)) - (((Number($scope.grand_total) / Number($scope.rec.currency_rate)) - Number($scope.rec.bill_to_finance_charges)))); //.toFixed(2);
                        }

                        if ($scope.rec.bill_to_insurance_charges_type == 1) {
                            $scope.stats.insurance_charges = ((Number($scope.grand_total) * Number($scope.rec.bill_to_insurance_charges)) / 100); //.toFixed(2);
                            $scope.stats.insurance_charges = Number($scope.stats.insurance_charges) / Number($scope.rec.currency_rate);
                        } else {
                            $scope.stats.insurance_charges = ((Number($scope.grand_total) / Number($scope.rec.currency_rate)) - (((Number($scope.grand_total) / Number($scope.rec.currency_rate)) - Number($scope.rec.bill_to_insurance_charges)))); //.toFixed(2);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        }

                        $scope.stats.finance_charges = Number($scope.stats.finance_charges).toFixed(2);
                        $scope.stats.insurance_charges = Number($scope.stats.insurance_charges).toFixed(2);

                        $scope.stats.freight_charges = Number(0).toFixed(2);
                        if ($scope.rec.freight_charges != undefined)
                            $scope.stats.freight_charges = Number($scope.rec.freight_charges).toFixed(2);

                        var unit_frieght_charge = (total_items_qty > 0) ? (Number($scope.stats.freight_charges) / Number(total_items_qty)) : 0;

<<<<<<< HEAD
                        angular.forEach(cost_items, function (item) {
=======
                        angular.forEach(cost_items, function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            item.item_frieght_charges = Number(unit_frieght_charge) * Number(item.qty);
                        });


                        $scope.stats.shipment_cost = 0;
                        $scope.stats.sales_value = (Number($scope.grand_total) / Number($scope.rec.currency_rate)).toFixed(2);
                        /* var total_item_costs = 0;
                        angular.forEach($scope.stats.item_additional_cost, function (obj) {
                            total_item_costs = total_item_costs + Number(obj.value);
                            obj.value = obj.value.toFixed(2);
                        }); */

                        $scope.stats.total_cost = Number($scope.stats.total_purchase_cost) +
                            Number($scope.stats.promo_discount) +
                            Number($scope.stats.storage_cost) +
                            Number($scope.stats.finance_charges) +
                            Number($scope.stats.insurance_charges) +
                            Number($scope.stats.freight_charges) +

                            Number($scope.stats.rebate_price);

                        if (!org_vals) {
<<<<<<< HEAD
                            $scope.stats.total_cost = Number($scope.stats.total_cost) + Number($scope.stats.other_costs) + Number($scope.stats.margin_analysis_cost);// + Number(total_item_costs);
                        }
                        else {
                            $scope.stats.total_cost = Number($scope.stats.total_cost) + Number($scope.stats.original_additional_cost);// + Number($scope.stats.margin_analysis_cost);
=======
                            $scope.stats.total_cost = Number($scope.stats.total_cost) + Number($scope.stats.other_costs) + Number($scope.stats.margin_analysis_cost); // + Number(total_item_costs);
                        } else {
                            $scope.stats.total_cost = Number($scope.stats.total_cost) + Number($scope.stats.original_additional_cost); // + Number($scope.stats.margin_analysis_cost);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        }
                        $scope.stats.total_cost = $scope.stats.total_cost.toFixed(2);

                        $scope.stats.profit = Number($scope.stats.sales_vale_ex_vat) - Number($scope.stats.total_cost);


                        $scope.stats.profit = $scope.stats.profit.toFixed(2);
                        $scope.stats.profit_percentage = ((Number($scope.stats.profit) / Number($scope.stats.sales_vale_ex_vat)) * 100).toFixed(2);
                        if (isNaN($scope.stats.profit_percentage) || !isFinite($scope.stats.profit_percentage))
                            $scope.stats.profit_percentage = (0).toFixed(2);
                        $scope.rec.stats = $scope.stats;

                        $scope.stats.sales_value = $scope.stats.sales_value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        $scope.stats.sales_vale_ex_vat = $scope.stats.sales_vale_ex_vat.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        $scope.stats.vat = $scope.stats.vat.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        $scope.stats.promo_discount = $scope.stats.promo_discount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        $scope.stats.rebate_price = $scope.stats.rebate_price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        $scope.stats.storage_cost = $scope.stats.storage_cost.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        $scope.stats.finance_charges = $scope.stats.finance_charges.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        $scope.stats.insurance_charges = $scope.stats.insurance_charges.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        $scope.stats.freight_charges = $scope.stats.freight_charges.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        $scope.stats.total_purchase_cost = $scope.stats.total_purchase_cost.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        $scope.stats.other_costs = $scope.stats.other_costs.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        $scope.stats.profit = $scope.stats.profit.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        $scope.stats.total_cost = $scope.stats.total_cost.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                        if (is_post_request != undefined && is_post_request == 0)
                            $scope.OnSavingOrder(rec, rec2, 1);
<<<<<<< HEAD
                        else if (is_post_request != undefined && is_post_request == 1){
                            $scope.OnPostOrder(rec, rec2, queue_for_approval);
                            $scope.waitFormarginAnalysis = false;
                        }
                        else if (is_post_request != undefined && is_post_request == 2){
=======
                        else if (is_post_request != undefined && is_post_request == 1) {
                            $scope.OnPostOrder(rec, rec2, queue_for_approval);
                            $scope.waitFormarginAnalysis = false;
                        } else if (is_post_request != undefined && is_post_request == 2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            $scope.OnDispatchOrder();
                        }
                    }

<<<<<<< HEAD
                    
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                });
        }

    }

    /*  order status code start */

    $scope.order_stages_array = [];
<<<<<<< HEAD
    $scope.GetSalesOrderStages = function (flg) {
=======
    $scope.GetSalesOrderStages = function(flg) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.order_stages_array = [];
        var postData = '';
        if (flg == 0) {
            var order_stages = $scope.$root.setup + "crm/get-order-stages-list";
            postData = {
                'token': $scope.$root.token,
                'order_id': $scope.$root.order_id,
                'isAllowed': 1 //this parameter is to allow without permission validation
            };
<<<<<<< HEAD
        }
        else {
=======
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            var order_stages = $scope.$root.sales + "customer/order/get-sales-order-stages";
            postData = {
                'token': $scope.$root.token,
                'order_id': $scope.$root.order_id
            };
        }

        $http
            .post(order_stages, postData)
<<<<<<< HEAD
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.order_stages_array = res.data.response;
                    if ($scope.rec.id == undefined) {
                        angular.forEach($scope.order_stages_array, function (obj) {
=======
            .then(function(res) {
                if (res.data.ack == true) {
                    $scope.order_stages_array = res.data.response;
                    if ($scope.rec.id == undefined) {
                        angular.forEach($scope.order_stages_array, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            obj.id = 0;
                        });
                    }
                }
            });
    }
    if ($stateParams.id == undefined)
        $scope.GetSalesOrderStages(0);

<<<<<<< HEAD
    $scope.get_order_status = function (checkid) {
=======
    $scope.get_order_status = function(checkid) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.assigned_order_stages_array = {};
        $scope.selected_status = "";

        var assigned_order_stages = $scope.$root.sales + "customer/order/get-all-order-status";
        $http
            .post(assigned_order_stages, { 'token': $scope.$root.token, 'rec_id': $stateParams.id })
<<<<<<< HEAD
            .then(function (res) {
                if (res.data.ack == true) {


                    $.each($scope.order_stages_array, function (indx, obj) {
                        obj.chk = false;

                        $.each(res.data.response, function (indx, obj2) {
=======
            .then(function(res) {
                if (res.data.ack == true) {


                    $.each($scope.order_stages_array, function(indx, obj) {
                        obj.chk = false;

                        $.each(res.data.response, function(indx, obj2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            //console.log(obj.id == obj2.status_id);
                            if (obj.id == obj2.status_id) {
                                obj.chk = true;

                            }
                        });
                        // $scope.order_stages_array.push(obj.chk);
                    });


                }
            });
    }

    /* $scope.submit_order_status = function (checkid) {

        var curr_rank = checkid.rank;
        var error = 0;

        if (angular.element('#order_state_' + curr_rank).is(':checked')) {

            for (var i = 1; i < curr_rank; i++) {
                if (!angular.element('#order_state_' + i).is(':checked')) {
                    error = 1;
                    angular.element('#order_state_' + curr_rank).attr('checked', false);
                }
            }
            if (error > 0)
                toaster.pop('error', 'Edit', 'Previous Stage is not updated.');

            var addstateUrl = $scope.$root.sales + "customer/order/add-order-status";
        }
        else {
            for (var k = curr_rank; k < $scope.order_stages_total + 1; k++) {
                if (angular.element('#order_state_' + k).is(':checked')) {
                    error = 1;
                    angular.element('#order_state_' + curr_rank).prop('checked', true);
                }
            }
            if (error > 0)
                toaster.pop('error', 'Edit', 'Next Stage is not updated.');

            var addstateUrl = $scope.$root.sales + "customer/order/del-order-status";
        }

        var rec = {};


        if (error == 0) {
            rec.token = $scope.$root.token;
            rec.id = $stateParams.id;
            rec.type = 1;
            rec.rec_id = checkid.id;

            $http
                .post(addstateUrl, rec)
                .then(function (res) {
                    if (res.data.ack == 1) {
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    }
                    else if (res.data.ack == 0) {
                        toaster.pop('error', 'Edit', 'Record already selected!');
                    }
                });
        }

    } */
    /*  order status code end */


    $scope.constants = [];
    $scope.customer = [];
    $scope.general = [];
    // $scope.paymentmet = [];

    $scope.generate = [];
    //$scope.rec = {};

<<<<<<< HEAD
    $scope.gotoEdit = function () {
=======
    $scope.gotoEdit = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // $scope.check_readonly = false;
        $scope.finance_read_only = false;
    }

<<<<<<< HEAD
    $scope.$on("orderTabEvent", function (event, resp) {
=======
    $scope.$on("orderTabEvent", function(event, resp) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (resp != null)
            $scope.rec.type = resp.type;
    });


<<<<<<< HEAD
    $scope.$on("setBillToCustomer", function (event, arg) {
=======
    $scope.$on("setBillToCustomer", function(event, arg) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (arg.bill_to_cust != '')
            $scope.bill_to_cust_no = arg.bill_to_cust;
        if (arg.id > 0)
            $scope.rec.bill_to_customer = arg.id;
    });

    $scope.arr_generate = [{ 'id': '1', 'name': 'E-Rem.', 'title': 'E-Reminder', 'chk': false }, {
        'id': '2',
        'name': 'E-St.',
        'title': 'E-Statement',
        'chk': false
    }, { 'id': '3', 'name': 'E-Invoice', 'title': 'E-Inv.', 'chk': false }];

    var constUrl = $scope.$root.setup + "ledger-group/get-predefine-by-type";
    /* $http
        .post(constUrl, { 'token': $scope.$root.token, type: 'VAT_BUS_POSTING_GROUP' })
        .then(function (res) {
            if (res.data.ack == true) {
                $scope.constants = res.data.response;
            }
            //$scope.constants.push({'id':'-1','name':'++ Add New ++'});
        });
    
    $http
        .post(constUrl, { 'token': $scope.$root.token, type: 'CUST_POSTING_GROUP' })
        .then(function (res) {
            if (res.data.ack == true) {
                $scope.customer = res.data.response;
            }
            //$scope.customer.push({'id':'-1','name':'++ Add New ++'});
        });
    
    $http
        .post(constUrl, { 'token': $scope.$root.token, type: 'GEN_BUS_POSTING_GROUP' })
        .then(function (res) {
            if (res.data.ack == true) {
                $scope.general = res.data.response;
            }
            //$scope.general.push({'id':'-1','name':'++ Add New ++'});
        }); */

    /* var paymentUrl = $scope.$root.setup + "crm/payment-methods";
    $http
        .post(paymentUrl, { 'token': $scope.$root.token })
        .then(function (res) {
            $scope.paymentmet = res.data.response;//res.data.record.result;
            //			$scope.paymentmet.push({'id':'-1','Description':'++ Add New ++'});
        }); */
    /* 
        var getTermUrl = $scope.$root.setup + "crm/payment-terms";
        $http
            .post(getTermUrl, { 'token': $scope.$root.token })
            .then(function (res) {
                $scope.arr_payment_terms = res.data.response;//res.data.record.result;
                //	$scope.arr_payment_terms.push({'id':'-1','Description':'++ Add New ++'});
            }); */
    $scope.searchKeyword_fin = {};
    $scope.record_finance = {};
<<<<<<< HEAD
    $scope.getCustomer_finance = function (item_paging) {
=======
    $scope.getCustomer_finance = function(item_paging) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.title = 'Customer Listing';
        //  $scope.columns = [];
        $scope.record_finance = {};
        var custUrl = $scope.$root.sales + "customer/customer/getCustomerListings";
        /* var custUrl2 = $scope.$root.sales + "customer/customer/check-customer-limit";
         var postData = {
         'token': $scope.$root.token,
         'all': "1",
         'type':"99"
         };*/
        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.postData.all = 1;
        $scope.postData.type = 99;

        if (item_paging == 1)
            $rootScope.item_paging.spage = 1;

        $scope.postData.page = $rootScope.item_paging.spage;
        $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;
        $scope.postData.searchKeyword_fin = $scope.searchKeyword_fin.$;

        if ($scope.searchKeyword_fin.region !== undefined && $scope.searchKeyword_fin.region !== null) {
            $scope.postData.regions = $scope.searchKeyword_fin.region.id;
        }

        if ($scope.searchKeyword_inv.segment !== undefined && $scope.searchKeyword_fin.segment !== null)
            $scope.postData.segments = $scope.searchKeyword_inv.segment.id;

        if ($scope.searchKeyword_fin.buying_group !== undefined && $scope.searchKeyword_fin.buying_group !== null)
            $scope.postData.buying_groups = $scope.searchKeyword_fin.buying_group.id;


        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword_fin = {};
            $scope.record_data = {};
        }
        $scope.showLoader = true;

        // $timeout(function () {
        $http
            .post(custUrl, $scope.postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.columns_fin = [];
                // $scope.columns = res.data.columns;
                $scope.total = res.data.total;
                $scope.item_paging.total_pages = res.data.total_pages;
                $scope.item_paging.cpage = res.data.cpage;
                $scope.item_paging.ppage = res.data.ppage;
                $scope.item_paging.npage = res.data.npage;
                $scope.item_paging.pages = res.data.pages;
                $scope.total_paging_record = res.data.total_paging_record;
                //$scope.showLoader = false;
                $scope.record_finance = res.data.response;

                angular.element('#customer_modal_single_finance').modal({ show: true });
<<<<<<< HEAD
                angular.forEach(res.data.response[0], function (val, index) {
=======
                angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.columns_fin.push({
                        'title': toTitleCase(index),
                        'field': index,
                        'visible': true
                    });
                });
            });

        $scope.showLoader = false;
        // }, 1000);
    }
<<<<<<< HEAD
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    function padNumber(number) {
        var string = '' + number;
        string = string.length < 2 ? '0' + string : string;
        return string;
    }
<<<<<<< HEAD
    $scope.CalculateDueDate = function () {
=======
    $scope.CalculateDueDate = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if ($scope.rec.posting_date != null) {

            // console.log($scope.rec.posting_date);
            if ($scope.drp.payment_terms_ids == undefined || $scope.drp.payment_terms_ids == "" || $scope.drp.payment_terms_ids.days == undefined)
                return;

            if ($scope.drp.payment_terms_ids.days == 0) {
                $scope.rec.due_date = $scope.rec.posting_date;
                return;
            }

            var date_parts = $scope.rec.posting_date.trim().split('/');

            var invoice_date = new Date(date_parts[2], date_parts[1] - 1, Number(date_parts[0]) + 1);

            var calculated_date = 0;
            calculated_date = new Date(invoice_date.setDate(invoice_date.getDate() + Number($scope.drp.payment_terms_ids.days)));
            formatted_date = padNumber(calculated_date.getUTCDate()) + '/' + padNumber(calculated_date.getUTCMonth() + 1) + '/' + calculated_date.getUTCFullYear();
            $scope.rec.due_date = formatted_date;
<<<<<<< HEAD
        }
        else
=======
        } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(503));
        return;
    }

<<<<<<< HEAD
    $scope.OnBlurFreightCharges = function () {
        var total_items_qty = 0;
        angular.forEach($scope.items, function (item) {
=======
    $scope.OnBlurFreightCharges = function() {
        var total_items_qty = 0;
        angular.forEach($scope.items, function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (item.item_type == 0)
                total_items_qty += Number(item.qty);
        });

        $scope.rec.freight_charges = ($scope.rec.freight_charges != undefined) ? Number($scope.rec.freight_charges) : 0;
        var unit_frieght_charge = (total_items_qty > 0) ? ($scope.rec.freight_charges / Number(total_items_qty)) : 0;

<<<<<<< HEAD
        angular.forEach($scope.items, function (item) {
=======
        angular.forEach($scope.items, function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (item.item_type == 0)
                item.item_frieght_charges = Number(unit_frieght_charge) * Number(item.qty);
        });

    }

<<<<<<< HEAD
    $scope.confirmFinance = function (result) {
=======
    $scope.confirmFinance = function(result) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // if (result.account_payable_number == null && result.purchase_code_number == null) {
        if ($scope.rec.account_type != 2 && result.finance_id == null) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(504));
            return;
        }

        $scope.check_readonly = true;
        // $scope.rec_finance = {};

        $scope.rec.bill_to_cust_no = result.code;
        $scope.rec.bill_to_location_id = result.id;
        $scope.rec.bill_to_name = result.title;
        $scope.rec.bill_to_address = result.address_1;
        $scope.rec.bill_to_address2 = result.address_2;
        $scope.rec.bill_to_contact = result.fcontact_person;

        $scope.rec.bill_to_contact_email = (result.invoice_email != undefined && result.invoice_email != "") ? result.invoice_email : result.femail;
        $scope.rec.bill_to_contact_phone = result.fphone;
        // $scope.rec.fax = result.ffax;
        $scope.rec.alt_contact_person = result.falt_contact_person;
        $scope.rec.alt_contact_email = result.falt_contact_email;
        $scope.rec.bill_to_posting_group_id = result.posting_group_id;
        $scope.$root.c_currency_id = result.currency_id;
        /* angular.forEach($rootScope.arr_payment_terms, function (elem, index) {
            if (elem.id == result.payment_terms_id) {
                $scope.drp.payment_terms_ids = elem;
            }
        }); */

<<<<<<< HEAD
        angular.forEach($rootScope.arr_paymentTerms, function (elem, index) {
=======
        angular.forEach($rootScope.arr_paymentTerms, function(elem, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (elem.id == result.payment_terms_id) {
                $scope.drp.payment_terms_ids = elem;
            }
        });

        if ($scope.rec.posting_date != undefined) {
            $scope.CalculateDueDate();
        }

        /* angular.forEach($rootScope.arr_payment_methods, function (elem, index) {
            if (elem.id == result.payment_method_id) {
                $scope.drp.payment_method_ids = elem;
            }
        }); */

<<<<<<< HEAD
        angular.forEach($rootScope.arr_paymentMethods, function (elem, index) {
=======
        angular.forEach($rootScope.arr_paymentMethods, function(elem, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (elem.id == result.payment_method_id) {
                $scope.drp.payment_method_ids = elem;
            }
        });


        /* 
        angular.forEach($rootScope.arr_posting_group_ids, function (elem, index) {
            if (elem.id == result.posting_group_id) {
                $scope.drp.vat_bus_posting_group = elem;
                $scope.drp.vat_bus_posting_group_id = elem.id;
                $rootScope.order_posting_group_id = elem.id;
            }
        });
        */

        if ($rootScope.arr_posting_grp) {
<<<<<<< HEAD
            angular.forEach($rootScope.arr_posting_grp, function (elem) {
=======
            angular.forEach($rootScope.arr_posting_grp, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (elem.id == result.posting_group_id) {
                    $scope.drp.vat_bus_posting_group = elem;
                    $scope.drp.vat_bus_posting_group_id = elem.id;
                    $rootScope.order_posting_group_id = elem.id;
                }
            });
        }

        /* angular.forEach($scope.arr_finance_charges, function (elem, index) {
            if (elem.id == result.finance_charges_id) {
                $scope.drp.finance_charges_ids = elem;
            }
        }); */
        if (result.insurance_check == 1)
            $scope.rec.bill_to_insurance_charges = result.inscharges;
        else
            $scope.rec.bill_to_insurance_charges = 0;
        $scope.rec.bill_to_insurance_charges_type = result.inschargetype;

        if (result.finance_check == 1)
            $scope.rec.bill_to_finance_charges = result.fincharges;
        else
            $scope.rec.bill_to_finance_charges = 0;
        $scope.rec.bill_to_finance_charges_type = result.finchargetype;

        /* angular.forEach($scope.arr_insurance_charges, function (elem, index) {
            if (elem.id == result.insurance_charges_id) {
                $scope.drp.insurance_charges_ids = elem;
            }
        }); */

        /* var arrGen = result.generate.split(',');
        angular.forEach($scope.arr_generate, function (elem, index) {
            var indx = arrGen.indexOf(elem.id) == -1;
            if (!indx) {
                $scope.arr_generate[index].chk = true;
            }
        }) */

        $scope.rec.company_reg_no = result.company_reg_no;
        $scope.bank_name = result.bill_bank_name;
        $scope.rec.bank_name = result.bill_bank_name;
        $scope.rec.account_name = result.account_name;
        $scope.rec.account_no = result.account_no;
        $scope.rec.swift_no = result.swift_no;
        $scope.rec.iban = result.iban;
        $scope.rec.sort_code = result.sort_code;
        $scope.rec.bill_to_bank_name = result.bill_bank_name;
        $scope.rec.bill_to_bank_id = result.bill_to_bank_id;
        $scope.rec.vat_number = result.vat_number;

        // arr_contact.contact_person = elem;

        $scope.rec.bill_to_customer = result.id;

        $scope.rec.bill_to_cust_id = result.id;

        /* var finUrl = $scope.$root.sales + "customer/customer/get-finance-by-customer-id";
        $http
            .post(finUrl, { customer_id: result.id, token: $scope.$root.token })
            .then(function (fres) {
                $scope.rec.account_payable_number = fres.data.response.account_payable_number;
                $scope.rec.account_payable_id = fres.data.response.account_payable_id;
            }); */
        angular.element('#customer_modal_single_finance').modal('hide');
    }

    /*	$scope.$on("openCrmPromotionFormEvent", function (event, id) {
     $timeout(function() {
     //angular.element('.promotions a').trigger('click');
     angular.element('.accordion-toggle').trigger('click');
     
     var table = 'crm';
     $resource('api/company/get_record/:id/:table').get({id:id,table:table},function(data){
     $scope.rec = data;
     $scope.rec.update_id = data.id;
     //$.each($scope.arr_discount_type,function(index,elem){if(elem.value == data.discount_type){$scope.discount_type_id = elem;}});
     });
     }, 100);
     
     });*/
    /*$resource('api/company/fill_combo/:table/:label/:value/:condition/:order_by/:selected/:is_company')
     .get({table:'currency',label:'code',value:'id',condition:0,order_by:'code',selected:14,is_company:1},function(data){
     $scope.currencies = data.combo_data;
     $scope.rec.currency = $scope.currencies[data.selected_value];
     });*/


    /*$scope.checkPosting = function(posting_module,posting_type,drp){
     var posting_group_value = drp.id;
     $http
     .post('api/posting_setup/check_posting', {posting_module:posting_module,posting_type:posting_type,posting_group_value:posting_group_value})
     .then(function (res) {
     var check = res.data.check;
     var not_set_value = res.data.not_set_value;
     var not_set_type = res.data.not_set_type;
     if(check == false){
     toaster.pop('error', 'Error', not_set_type +' Product Posting is not set in Posting Setup');
     if(posting_type == 1)
     $scope.drp.gen_bus_posting_group = undefined;
     else
     $scope.drp.vat_bus_posting_group = undefined;
     }
     else if(posting_type == 2){
     $scope.check_vat(posting_group_value,posting_module,posting_type);
     }
     });
     }*/

    /*$scope.check_vat = function(posting_group_value,posting_module,posting_type){
     $http
     .post('api/vat/check_vat', {posting_module:posting_module,posting_group_value:posting_group_value})
     .then(function (res) {
     var check = res.data.check;
     var not_set_value = res.data.not_set_value;
     var not_set_type = res.data.not_set_type;
     if(check == false){
     toaster.pop('error', 'Error', not_set_type +' Product Posting is not set in VAT Setup');
     if(posting_type == 1)
     $scope.drp.gen_bus_posting_group = undefined;
     else
     $scope.drp.vat_bus_posting_group = undefined;
     }
     });
     }*/

    $scope.columns = [];
    $scope.arr_finance_charges = [];
    var postFCData = { 'token': $scope.$root.token, 'all': "1", 'order_by': 'Charge ASC' };
    var getChargesUrl = $scope.$root.setup + "crm/finance-charges";
    $http
        .post(getChargesUrl, postFCData)
<<<<<<< HEAD
        .then(function (res) {
            $scope.arr_finance_charges = res.data.response;//res.data.record.result;
=======
        .then(function(res) {
            $scope.arr_finance_charges = res.data.response; //res.data.record.result;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            // $scope.arr_finance_charges.push({ 'id': '-1', 'Charge': '++ Add New ++' });
        });

    $scope.arr_insurance_charges = [];
    var postICData = { 'token': $scope.$root.token, 'all': "1", 'order_by': 'Charge ASC' };
    var getIChargesUrl = $scope.$root.setup + "crm/insurance-charges";
    $http
        .post(getIChargesUrl, postICData)
<<<<<<< HEAD
        .then(function (res) {
            $scope.arr_insurance_charges = res.data.response;//res.data.record.result;
=======
        .then(function(res) {
            $scope.arr_insurance_charges = res.data.response; //res.data.record.result;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            // $scope.arr_insurance_charges.push({ 'id': '-1', 'Charge': '++ Add New ++' });
        });

    /*$scope.arr_overrider = [];
     var postICData = {'token': $scope.$root.token,'all': "1",};
     var getOverUrl = $scope.$root.setup+"crm/overrider";
     $http
     .post(getOverUrl, postICData)
     .then(function (res) {
     $scope.arr_overrider = res.data.response;
     $scope.arr_overrider.push({'id':'-1','charge':'++ Add New ++'});
     });*/


<<<<<<< HEAD
    $scope.getCharges = function (arg) {
=======
    $scope.getCharges = function(arg) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (arg == 'finance')
            var getChargesUrl = $scope.$root.setup + "crm/finance-charges";
        else
            var getChargesUrl = $scope.$root.setup + "crm/insurance-charges";
        postData = {
            'token': $scope.$root.token,
            'all': "1",
        };
        $http
            .post(getChargesUrl, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.columns = [];
                $scope.columns = res.data.columns;
                $scope.record = res.data.record.result;

            });

        ngDialog.openConfirm({
            template: 'modalCustDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
<<<<<<< HEAD
        }).then(function (result) {
            if (arg == 'finance') {
                $scope.finance_charges_value = result['Description'];
                $scope.rec.finance_charges_id = result.id;
            }
            else {
=======
        }).then(function(result) {
            if (arg == 'finance') {
                $scope.finance_charges_value = result['Description'];
                $scope.rec.finance_charges_id = result.id;
            } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.insurance_charges_value = result['Description'];
                $scope.rec.insurance_charges_id = result.id;
            }

<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

<<<<<<< HEAD
    $scope.getPaymentTerms = function (arg) {
=======
    $scope.getPaymentTerms = function(arg) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var getTermUrl = $scope.$root.setup + "crm/payment-terms";

        postData = {
            'token': $scope.$root.token,
            'all': "1",
        };
        $http
            .post(getTermUrl, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.columns = [];
                $scope.columns = res.data.columns;
                $scope.record = res.data.record.result;
            });

        ngDialog.openConfirm({
            template: 'modalCustDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
<<<<<<< HEAD
        }).then(function (result) {
            $scope.payment_term = result['Description'];
            $scope.rec.payment_terms_id = result.id;
        }, function (reason) {
=======
        }).then(function(result) {
            $scope.payment_term = result['Description'];
            $scope.rec.payment_terms_id = result.id;
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    /* $scope.getBankAccount = function (arg) {
        var getBankUrl = $scope.$root.setup + "general/bank-accounts";
        $scope.title = "Payable Bank";
        var postData = { 'token': $scope.$root.token};
        $http
            .post(getBankUrl, postData)
            .then(function (res) {
                $scope.columns = [];
                $scope.columns = res.data.columns;
                $scope.record = res.data.record.result;
    
            });
    
        ngDialog.openConfirm({
            template: 'ngdialog1',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (elem) {
            $scope.bank_name = elem['Account Name'];
            $scope.rec.bill_to_bank_id = elem.id;
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    } */
<<<<<<< HEAD
    $scope.getBankAccount = function (arg) {
=======
    $scope.getBankAccount = function(arg) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.title = 'Payable Bank';
        var getBankUrl = $scope.$root.setup + "general/bank-accounts";

        //arr_bank

        var postData = { 'token': $scope.$root.token, 'filter_id': 152 };
        $http
            .post(getBankUrl, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.columns = [];
                //	$scope.columns = res.data.columns;
                $scope.record = res.data.response;


<<<<<<< HEAD
                angular.forEach(res.data.response[0], function (val, index) {
=======
                angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.columns.push({
                        'title': toTitleCase(index),
                        'field': index,
                        'visible': true
                    });
                });


                angular.element('#_model_modal_bank_order').modal({ show: true });

            });


        /* ngDialog.openConfirm({
            template: 'modalCustDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (elem) {
            $scope.bank_name = elem.account_name;//elem['Account_Name'];
            $scope.recfinance.bill_to_bank_id = elem.id;
        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
        }); */
    }


<<<<<<< HEAD
    $scope.confirm_bank = function (btc) {
=======
    $scope.confirm_bank = function(btc) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // $scope.rec.bill_to_bank_name = btc.account_name;
        $scope.rec.bill_to_bank_name = btc.bank_name;
        // $scope.rec.bill_to_bank_name = btc.preferred_name;
        $scope.rec.bill_to_bank_id = btc.id;
        angular.element('#_model_modal_bank_order').modal('hide');
    }
    var getFinance = $scope.$root.sales + 'customer/order/get-order-finance'
<<<<<<< HEAD
    //$scope.rec = {};
=======
        //$scope.rec = {};
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    $scope.drp = {};
    /* if ($stateParams.id != undefined) {
        $http
            .post(getFinance, { 'token': $scope.$root.token, order_id: $scope.$root.order_id })
            .then(function (res) {
                if (res.data.ack == true) {
                    // $scope.rec_finance = res.data.response;
                    // $scope.rec_finance.update_id = res.data.response.id;
                    $scope.bill_to_bank_name = res.data.response.bill_to_bank_name;
                    $scope.payment_term = res.data.response.payment_term;
                    
                    $timeout(function () {
                        var arrGen = res.data.response.generate.split(',');
                        angular.forEach($scope.arr_generate, function (elem, index) {
                            var indx = arrGen.indexOf(elem.id) == -1;
                            if (!indx) {
                                $scope.arr_generate[index].chk = true;
                            }
                        })
    
    
                        angular.forEach($scope.general, function (elem, index) {
                            if (elem.id == res.data.response.gen_bus_posting_group) {
                                $scope.drp.gen_bus_posting_group = elem;
                            }
                        })
                        angular.forEach($scope.constants, function (elem, index) {
                            if (elem.id == res.data.response.vat_bus_posting_group) {
                                $scope.drp.vat_bus_posting_group = elem;
                            }
                        })
                        angular.forEach($scope.customer, function (elem, index) {
                            if (elem.id == res.data.response.customer_posting_group) {
                                $scope.drp.customer_posting_group = elem;
                            }
                        })
                        angular.forEach($rootScope.arr_payment_methods, function (elem, index) {
                            if (elem.id == res.data.response.payment_method_id) {
                                $scope.drp.payment_method_ids = elem;
                            }
                        })
                        angular.forEach($rootScope.arr_payment_terms, function (elem, index) {
                            if (elem.id == res.data.response.payment_terms_id) {
                                $scope.drp.payment_terms_ids = elem;
                            }
                        })
    
                        $.each($scope.arr_finance_charges, function (index, elem) {
                            if (elem.id == res.data.response.finance_charges_id)
                                $scope.drp.finance_charges_ids = elem;
                        });
                        $.each($scope.arr_insurance_charges, function (index, elem) {
                            if (elem.id == res.data.response.insurance_charges_id)
                                $scope.drp.insurance_charges_ids = elem;
                        });
                        $.each($scope.arr_overrider, function (index, elem) {
                            if (elem.id == res.data.response.rebate)
                                $scope.drp.overrider_ids = elem;
                        });
    
                    }, 3000);
                }
            });
    } */

<<<<<<< HEAD
    $scope.setGenerate = function (id) {
=======
    $scope.setGenerate = function(id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        for (var i = 0; i < $scope.arr_generate.length; i++) {
            if (id == $scope.arr_generate[i].id) {
                if ($scope.arr_generate[i].chk == true)
                    $scope.arr_generate[i].chk = false
                else
                    $scope.arr_generate[i].chk = true
            }
        }
    }

    /*angular.element(document).on('click','.generate',function(event){
     event.preventDefault();
     var id = $(this).attr('id');
     console.log($(this).is(':checked'));
     if($(this).is(':checked')){
     $scope.drp.generate.splice(index,1);
     }
     else
     $scope.drp.generate.push(id);
     });*/

<<<<<<< HEAD
    $scope.add_invoice = function (rec, drp) {
=======
    $scope.add_invoice = function(rec, drp) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        rec.id = $scope.rec.id;
        var addFinance = $scope.$root.sales + 'customer/order/update-order-invoice';
        $http
            .post(addFinance, rec)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $scope.finance_read_only = true;
                    //$scope.$root.$broadcast("myEventReload", {});
<<<<<<< HEAD
                }
                else
=======
                } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(105));
            });
    }

<<<<<<< HEAD
    $scope.add_finance = function (rec, drp) {
=======
    $scope.add_finance = function(rec, drp) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        console.log("inside");
        /* var addFinance = $scope.$root.sales + 'customer/order/add-order-finance';
        if (rec.update_id > 0) {
            rec.id = rec.update_id;
        } */
        rec.id = $scope.rec.id;
        var addFinance = $scope.$root.sales + 'customer/order/update-order-finance';
        $http
            .post(addFinance, rec)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $scope.finance_read_only = true;
                    //$scope.$root.$broadcast("myEventReload", {});
<<<<<<< HEAD
                }
                else
=======
                } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(105));
            });
        /* //rec.generate = $scope.drp.generate != undefined?$scope.drp.generate.id:0;
        rec.gen_bus_posting_group = $scope.drp.gen_bus_posting_group != undefined ? $scope.drp.gen_bus_posting_group.id : 0;
        rec.vat_bus_posting_group = $scope.drp.vat_bus_posting_group != undefined ? $scope.drp.vat_bus_posting_group.id : 0;
        rec.customer_posting_group = $scope.drp.customer_posting_group != undefined ? $scope.drp.customer_posting_group.id : 0;
        rec.payment_method_id = $scope.drp.payment_method_ids != undefined ? $scope.drp.payment_method_ids.id : 0;
        rec.finance_charges_id = $scope.drp.finance_charges_ids != undefined ? $scope.drp.finance_charges_ids.id : 0;
        rec.insurance_charges_id = $scope.drp.insurance_charges_ids != undefined ? $scope.drp.insurance_charges_ids.id : 0;
        rec.payment_terms_id = $scope.drp.payment_terms_ids != undefined ? $scope.drp.payment_terms_ids.id : 0;
        rec.type = 'order';
        rec.order_id = $scope.$root.order_id;
        rec.token = $scope.$root.token;
    
        if (rec.update_id > 0) {
            addFinance = $scope.$root.sales + 'customer/order/update-order-finance';
            rec.id = rec.update_id;
        }
    
        var strGen = [];
        for (var i = 0; i < $scope.arr_generate.length; i++) {
            if ($scope.arr_generate[i].chk == true)
                strGen.push($scope.arr_generate[i].id);
        }
    
        rec.generate = strGen.toString();
        
        $http
            .post(addFinance, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    if (rec.update_id > 0)
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    else {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        rec.update_id = res.data.id;
                    }
    
                    //$scope.$root.$broadcast("myEventReload", {});
                }
                else
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(105));
            }); */
    }

<<<<<<< HEAD
    $scope.addNewPredefinedPopup = function (drpdown, type, title, drp) {
=======
    $scope.addNewPredefinedPopup = function(drpdown, type, title, drp) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var id = drpdown.id;
        if (id > 0)
            return false;

        $scope.popup_title = title;
        $scope.pedefined = {};

        ngDialog.openConfirm({
            template: 'app/views/customer/add_predefined.html',
            className: 'ngdialog-theme-default-custom-large',
            scope: $scope
<<<<<<< HEAD
        }).then(function (pedefined) {
=======
        }).then(function(pedefined) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            /*console.log(pedefined);
             return false;*/

            pedefined.token = $scope.$root.token;
            pedefined.type = type;
            var postUrl = $scope.$root.setup + "ledger-group/add-predefine";
            $http
                .post(postUrl, pedefined)
<<<<<<< HEAD
                .then(function (ress) {
=======
                .then(function(ress) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (ress.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        var constUrl = $scope.$root.setup + "ledger-group/get-predefine-by-type";
                        $http
                            .post(constUrl, { 'token': $scope.$root.token, type: type })
<<<<<<< HEAD
                            .then(function (res) {
=======
                            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (res.data.ack == true) {

                                    if (type == 'GEN_BUS_POSTING_GROUP') {
                                        $scope.general = res.data.response;
                                        /*$scope.general.push({'id':'-1','name':'++ Add New ++'});*/
<<<<<<< HEAD
                                        $timeout(function () {
                                            $.each($scope.general, function (index, elem) {
=======
                                        $timeout(function() {
                                            $.each($scope.general, function(index, elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                if (elem.id == ress.data.id)
                                                    drp.gen_bus_posting_group = elem;
                                            });
                                        }, 3000);
                                    }

                                    if (type == 'CUST_POSTING_GROUP') {
                                        $scope.customer = res.data.response;
                                        //$scope.customer.push({'id':'-1','name':'++ Add New ++'});
<<<<<<< HEAD
                                        $timeout(function () {
                                            $.each($scope.customer, function (index, elem) {
=======
                                        $timeout(function() {
                                            $.each($scope.customer, function(index, elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                if (elem.id == ress.data.id)
                                                    drp.customer_posting_group = elem;
                                            });
                                        }, 3000);
                                    }
                                    if (type == 'VAT_BUS_POSTING_GROUP') {
                                        $scope.constants = res.data.response;
                                        //$scope.constants.push({'id':'-1','name':'++ Add New ++'});
<<<<<<< HEAD
                                        $timeout(function () {
                                            $.each($scope.constants, function (index, elem) {
=======
                                        $timeout(function() {
                                            $.each($scope.constants, function(index, elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                if (elem.id == ress.data.id)
                                                    drp.vat_bus_posting_group = elem;
                                            });
                                        }, 3000);
                                    }
                                }

                            });
                    }

                });

<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

<<<<<<< HEAD
    $scope.addNewCharges = function (drpdown, type, title, drp) {
=======
    $scope.addNewCharges = function(drpdown, type, title, drp) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var id = drpdown.id;
        if (id > 0)
            return false;

        $scope.popup_title = title;
        $scope.pedefined = {};

        ngDialog.openConfirm({
            template: 'app/views/finance_order/add_new_charges.html',
            className: 'ngdialog-theme-default',
            scope: $scope
<<<<<<< HEAD
        }).then(function (pedefined) {
=======
        }).then(function(pedefined) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            /*console.log(pedefined);
             return false;*/

            pedefined.token = $scope.$root.token;
            pedefined.type = type;
            if (type == 1)
                var postUrl = $scope.$root.setup + "crm/add-finance-charges";
            if (type == 2)
                var postUrl = $scope.$root.setup + "crm/add-insurance-charges";
            if (type == 3)
                var postUrl = $scope.$root.setup + "crm/add-payment-term";

            $http
                .post(postUrl, pedefined)
<<<<<<< HEAD
                .then(function (ress) {
=======
                .then(function(ress) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (ress.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        if (type == 1)
                            var constUrl = $scope.$root.setup + "crm/finance-charges";
                        if (type == 2)
                            var constUrl = $scope.$root.setup + "crm/insurance-charges";
                        if (type == 3)
                            var constUrl = $scope.$root.setup + "crm/payment-terms";

                        $http
                            .post(constUrl, { 'token': $scope.$root.token, 'all': 1 })
<<<<<<< HEAD
                            .then(function (res) {
=======
                            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (type == 1) {
                                    $scope.arr_finance_charges = res.data.record.result;
                                    $scope.arr_finance_charges.push({ 'id': '-1', 'Charge': '++ Add New ++' });
                                    //$timeout(function(){
<<<<<<< HEAD
                                    $.each($scope.arr_finance_charges, function (index, elem) {
=======
                                    $.each($scope.arr_finance_charges, function(index, elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                        if (elem.id == ress.data.id)
                                            drp.finance_charges_ids = elem;
                                    });

                                    //},3000);
                                }

                                if (type == 2) {
                                    $scope.arr_insurance_charges = res.data.record.result;
                                    $scope.arr_insurance_charges.push({ 'id': '-1', 'Charge': '++ Add New ++' });
                                    //$timeout(function(){
<<<<<<< HEAD
                                    $.each($scope.arr_insurance_charges, function (index, elem) {
=======
                                    $.each($scope.arr_insurance_charges, function(index, elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                        if (elem.id == ress.data.id)
                                            drp.insurance_charges_ids = elem;
                                    });
                                    //},3000);
                                }

                                /* if (type == 3) {
                                    $scope.arr_payment_terms = res.data.record.result;
                                    $scope.arr_payment_terms.push({ 'id': '-1', 'Charge': '++ Add New ++' });
                                    //$timeout(function(){
                                    $.each($scope.arr_payment_terms, function (index, elem) {
                                        if (elem.id == ress.data.id)
                                            drp.payment_terms_ids = elem;
                                    });
                                    //},3000);
                                } */

                            });
<<<<<<< HEAD
                    }
                    else {
=======
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        toaster.pop('error', 'Error', ress.data.error);
                        if (type == 1)
                            drp.finance_charges_ids = '';
                        if (type == 2)
                            drp.insurance_charges_ids = '';
                    }
                });


<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (type == 1)
                drp.finance_charges_ids = '';
            if (type == 2)
                drp.insurance_charges_ids = '';
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

<<<<<<< HEAD
    $scope.addNewPaymentTerm = function (drpdown, type, title, drp) {
=======
    $scope.addNewPaymentTerm = function(drpdown, type, title, drp) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var id = drpdown.id;
        if (id > 0)
            return false;

        $scope.popup_title = title;
        $scope.pedefined = {};

        ngDialog.openConfirm({
            template: 'app/views/payment_terms/add_payment_term.html',
            className: 'ngdialog-theme-default',
            scope: $scope
<<<<<<< HEAD
        }).then(function (pedefined) {
=======
        }).then(function(pedefined) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            /*console.log(pedefined);
             return false;*/

            pedefined.token = $scope.$root.token;
            /* var postUrl = $scope.$root.setup + "crm/add-payment-term";
    
            $http
                .post(postUrl, pedefined)
                .then(function (ress) {
                    if (ress.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        var constUrl = $scope.$root.setup + "crm/payment-terms";
    
                        $http
                            .post(constUrl, { 'token': $scope.$root.token, 'all': 1 })
                            .then(function (res) {
                                $scope.arr_payment_terms = res.data.record.result;
                                $scope.arr_payment_terms.push({ 'id': '-1', 'Description': '++ Add New ++' });
                                //$timeout(function(){
                                $.each($scope.arr_payment_terms, function (index, elem) {
                                    if (elem.id == ress.data.id)
                                        drp.payment_terms_ids = elem;
                                });
                                //},3000);
    
    
                            });
                    }
                    else {
                        toaster.pop('error', 'Error', ress.data.error);
                        drp.payment_terms_ids = '';
                    }
                });
    */

<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            drp.payment_terms_ids = '';
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

<<<<<<< HEAD
    $scope.addNewPaymentMethod = function (drpdown, type, title, drp) {
=======
    $scope.addNewPaymentMethod = function(drpdown, type, title, drp) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var id = drpdown.id;
        if (id > 0)
            return false;

        $scope.popup_title = title;
        $scope.pedefined = {};

        ngDialog.openConfirm({
            template: 'app/views/payment_methods/add_payment_method.html',
            className: 'ngdialog-theme-default',
            scope: $scope
<<<<<<< HEAD
        }).then(function (pedefined) {
=======
        }).then(function(pedefined) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            /*console.log(pedefined);
             return false;*/

            pedefined.token = $scope.$root.token;
            var postUrl = $scope.$root.setup + "crm/add-payment-method";

            $http
                .post(postUrl, pedefined)
<<<<<<< HEAD
                .then(function (ress) {
=======
                .then(function(ress) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (ress.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        var constUrl = $scope.$root.setup + "crm/payment-methods";

<<<<<<< HEAD
                        angular.forEach($rootScope.arr_payment_methods, function (elem) {
=======
                        angular.forEach($rootScope.arr_payment_methods, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (elem.id == ress.data.id)
                                drp.payment_method_ids = elem;
                        });
                        /* $http
                            .post(constUrl, { 'token': $scope.$root.token, 'all': 1 })
                            .then(function (res) {
                                $scope.paymentmet = res.data.record.result;
                                $scope.paymentmet.push({ 'id': '-1', 'Description': '++ Add New ++' });
                                //$timeout(function(){
                                $.each($scope.paymentmet, function (index, elem) {
                                    if (elem.id == ress.data.id)
                                        drp.payment_method_ids = elem;
                                });
                                //},3000);
    
    
                            }); */
<<<<<<< HEAD
                    }
                    else {
=======
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        toaster.pop('error', 'Error', ress.data.error);
                        drp.payment_method_ids = '';
                    }
                });


<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            drp.payment_method_ids = '';
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }


    $scope.$root.load_date_picker('sale order');

<<<<<<< HEAD
    $scope.deleteSalesOrder = function () {
=======
    $scope.deleteSalesOrder = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var delUrl = $scope.$root.sales + "customer/order/delete-order";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
        }).then(function (value) {
            $http
                .post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));

                        $timeout(function () {
                            $state.go('app.orders');
                        }, 1000);
                    }
                    else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
=======
        }).then(function(value) {
            $http
                .post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token })
                .then(function(res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));

                        $timeout(function() {
                            $state.go('app.orders');
                        }, 1000);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            //console.log('Modal promise rejected. Reason: ', reason);
        });

    };


<<<<<<< HEAD
    $scope.OnChangeOrderDate = function () {
        $scope.$broadcast('OnChangeOrderDateEvent');
    }
    $scope.OnChangeDeliveryDate = function () {
=======
    $scope.OnChangeOrderDate = function() {
        $scope.$broadcast('OnChangeOrderDateEvent');
    }
    $scope.OnChangeDeliveryDate = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.rec.posting_date = $scope.rec.delivery_date;
    }

<<<<<<< HEAD
    $scope.OnChangeAccountType = function () {
=======
    $scope.OnChangeAccountType = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        /* if ($scope.items != undefined && $scope.items.length > 0) {
            if($scope.rec.type2 == 0)
                order_type= 'sales quote';
            toaster.pop('error', 'Error', 'Please delete the added item(s) or GL before changing customer in this '+order_type+'.');

            $scope.rec.account_type = ($scope.rec.account_type == 1) ? 2 : 1;
            return false;
        }
        */
        $scope.rec.currency_id = 0;
        $scope.rec.currency_rate = 1;

        $scope.rec.sell_to_cust_no = '';
        $scope.rec.sell_to_cust_name = '';
        $scope.rec.sell_to_address = '';
        $scope.rec.sell_to_address2 = '';
        $scope.rec.sell_to_city = '';
        $scope.rec.sell_to_county = '';
        $scope.rec.sell_to_post_code = '';
        $scope.rec.country_ids = 0;

        $scope.rec.sell_to_cust_id = 0;
        $scope.$root.crm_id = 0

        $scope.rec.segment_id = 0;
        $scope.rec.region_id = 0;
        $scope.rec.buying_grp_id = 0;
        //contact info
        $scope.rec.sell_to_contact_no = '';
        $scope.rec.cust_phone = '';
        $scope.rec.cust_fax = '';
        $scope.rec.cust_email = '';

        $scope.rec.sale_person = '';
        $scope.rec.sale_person_id = 0;
        $scope.rec.customer_balance = 0;
        $scope.rec.credit_limit = 0;
        $scope.rec.anonymous_customer = 0;

        $scope.rec.alt_contact_person = '';
        $scope.rec.alt_contact_email = '';
        $scope.rec.bill_to_posting_group_id = 0;
        $scope.$root.c_currency_id = '';
        $scope.drp.payment_terms_ids = '';

        $scope.rec.due_date = '';
        $scope.drp.payment_method_ids = '';
        $scope.drp.vat_bus_posting_group = '';
        $scope.drp.vat_bus_posting_group_id = 0;
        $rootScope.order_posting_group_id = 0;
        $scope.rec.bill_to_insurance_charges = '';
        $scope.rec.bill_to_insurance_charges_type = '';

        $scope.rec.bill_to_finance_charges = '';
        $scope.rec.bill_to_finance_charges_type = '';


        $scope.rec.company_reg_no = '';
        $scope.bank_name = '';
        $scope.rec.bank_name = '';
        $scope.rec.account_name = '';
        $scope.rec.account_no = '';
        $scope.rec.swift_no = '';
        $scope.rec.iban = '';
        $scope.rec.sort_code = '';
        $scope.rec.bill_to_bank_name = '';
        $scope.rec.bill_to_bank_id = 0;
        $scope.rec.vat_number = 0;

        // arr_contact.contact_person = elem;

        $scope.rec.bill_to_customer = '';

        $scope.rec.bill_to_cust_id = 0;

        $scope.rec.bill_to_address = '';
        $scope.rec.bill_to_address2 = '';
        $scope.rec.bill_to_city = '';
        $scope.rec.bill_to_county = '';
        $scope.rec.bill_to_post_code = '';

        $scope.rec.bill_to_cust_no = '';
        $scope.rec.bill_to_name = '';


        $scope.rec.bill_to_contact_no = '';
        $scope.rec.bill_to_contact_phone = '';
        $scope.rec.bill_fax = '';
        $scope.rec.bill_to_email = '';
        $scope.rec.bill_to_cust_id = 0;
        $scope.rec.bill_to_contact_id = 0;
        $scope.rec.bill_to_contact_email = '';
        $scope.rec.bill_to_contact = '';
        $scope.rec.bill_to_country_ids = '';

        $scope.rec.payment_terms_codes = '';

        $scope.rec.payment_method_ids = '';
        $scope.rec.ship_to_name = '';
        $scope.rec.ship_to_address = '';
        $scope.rec.ship_to_address2 = '';
        $scope.rec.ship_to_city = '';
        $scope.rec.ship_to_county = '';
        $scope.rec.ship_to_post_code = '';
        $scope.rec.ship_to_country_ids
        $scope.rec.comm_book_in_contact = '';
        $scope.rec.ship_to_contact = '';
        $scope.rec.book_in_tel = '';
        $scope.rec.book_in_email = '';
        $scope.rec.alt_depo_id = '';
        $scope.PurchaseOrderArr = [];
        $scope.selectedPurchaseOrderArr = [];
        $scope.selectedPurchaseOrders = "";
        $scope.selectedPurchaseOrdersIDs = [];
        $scope.selectedPOs = [];
    }

<<<<<<< HEAD
    $scope.OnSavingOrder = function (rec, rec2, queue_for_approval) {
=======
    $scope.OnSavingOrder = function(rec, rec2, queue_for_approval) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var opt = {};
        opt.rec = rec;
        opt.rec2 = rec2;
        opt.queue_for_approval = queue_for_approval;

        $scope.$broadcast('OnSavingOrderEvent', opt);
    }

<<<<<<< HEAD
    $scope.OnPostOrder = function (rec, rec2, queue_for_approval) {
=======
    $scope.OnPostOrder = function(rec, rec2, queue_for_approval) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var opt = {};
        opt.rec = rec;
        opt.rec2 = rec2;
        opt.queue_for_approval = queue_for_approval;

        $scope.$broadcast('OnPostOrderEvent', opt);
    }
<<<<<<< HEAD
    $scope.OnDispatchOrder = function (rec, rec2) {
=======
    $scope.OnDispatchOrder = function(rec, rec2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var opt = {};
        opt.rec = rec;
        opt.rec2 = rec2;
        $scope.$broadcast('OnDispatchOrderEvent', opt);
    }
<<<<<<< HEAD
}

OrderTabController.$inject = ["$scope", "$filter", "$rootScope", "$stateParams", "$http", "$state", "$resource", "toaster", "ngDialog", "$timeout", "myService", "ModalService", "generatePdf", "moduleTracker", "jsreportService"]
myApp.controller('OrderTabController', OrderTabController);
function OrderTabController($scope, $filter, $rootScope, $stateParams, $http, $state, $resource, toaster, ngDialog, $timeout, myService, ModalService, generatePdf, moduleTracker, jsreportService) {
=======

    $scope.autoFillInvShipp = function(rec) {

        $scope.rec.bill_to_name = rec.sell_to_cust_name;
        $scope.rec.bill_to_address = rec.sell_to_address;
        $scope.rec.bill_to_address2 = rec.sell_to_address2;
        $scope.rec.bill_to_city = rec.sell_to_city;
        $scope.rec.bill_to_county = rec.sell_to_county;
        $scope.rec.bill_to_post_code = rec.sell_to_post_code;

        angular.forEach($rootScope.country_type_arr, function(elems) {
            if (elems.id == rec.country_ids.id) {
                $scope.rec.bill_to_country_ids = elems;
                $scope.rec.ship_to_country_ids = elems;
            }
        });


        $scope.rec.ship_to_name = rec.sell_to_cust_name;
        $scope.rec.ship_to_address = rec.sell_to_address;
        $scope.rec.ship_to_address2 = rec.sell_to_address2;
        $scope.rec.ship_to_city = rec.sell_to_city;
        $scope.rec.ship_to_county = rec.sell_to_county;
        $scope.rec.ship_to_post_code = rec.sell_to_post_code;
    }

    $scope.saveSaleInvoice = function(rec) {
        /* 
        if ($scope.rec.order_date == null || $scope.rec.order_date == '' || $scope.rec.order_date == undefined) {
            $scope.rec.order_date = $scope.$root.get_current_date();
        }

        if ($scope.showReceiveStuff == true && ($scope.rec.receiptDate == null || $scope.rec.receiptDate == '' || $scope.rec.receiptDate == undefined)) {
            $scope.rec.receiptDate = $scope.$root.get_current_date();
            $scope.updateReceiptDateChk(1);
        } */

        $scope.showLoader = true;

        var invoiceRec = {};

        invoiceRec.sell_to_cust_name = rec.sell_to_cust_name;
        invoiceRec.sell_to_address = rec.sell_to_address;
        invoiceRec.sell_to_address2 = rec.sell_to_address2;
        invoiceRec.sell_to_city = rec.sell_to_city;

        invoiceRec.sell_to_county = rec.sell_to_county;
        invoiceRec.sell_to_post_code = rec.sell_to_post_code;
        invoiceRec.cust_phone = rec.cust_phone;
        invoiceRec.cust_email = rec.cust_email;
        invoiceRec.cust_order_no = rec.cust_order_no;
        invoiceRec.country_id = (rec.country_ids != undefined && rec.country_ids.id != undefined) ? rec.country_ids.id : 0;

        invoiceRec.sale_person = rec.sale_person;
        invoiceRec.sale_person_id = rec.sale_person_id;
        invoiceRec.sell_to_contact_id = rec.sell_to_contact_id;
        invoiceRec.sell_to_contact_no = rec.sell_to_contact_no;

        invoiceRec.PurchaseOrderArr = {};
        invoiceRec.PurchaseOrderArr = $scope.selectedPurchaseOrderArr;

        invoiceRec.bill_to_name = rec.bill_to_name;
        invoiceRec.bill_to_address = rec.bill_to_address;
        invoiceRec.bill_to_address2 = rec.bill_to_address2;
        invoiceRec.bill_to_city = rec.bill_to_city;
        invoiceRec.bill_to_county = rec.bill_to_county;
        invoiceRec.bill_to_post_code = rec.bill_to_post_code;
        invoiceRec.bill_to_country_id = (rec.bill_to_country_ids != undefined && rec.bill_to_country_ids.id != undefined) ? rec.bill_to_country_ids.id : 0;

        invoiceRec.bill_to_contact = rec.bill_to_contact;
        invoiceRec.bill_to_contact_phone = rec.bill_to_contact_phone;
        invoiceRec.bill_to_contact_email = rec.bill_to_contact_email;
        invoiceRec.bank_account_id = rec.bank_account_id;
        invoiceRec.bill_to_bank_name = rec.bill_to_bank_name;
        invoiceRec.bill_to_bank_id = rec.bill_to_bank_id;
        invoiceRec.payment_method_code = rec.payment_method_code;
        invoiceRec.payment_discount = rec.payment_discount;

        invoiceRec.payment_terms_code = (rec.payment_terms_codes != undefined && rec.payment_terms_codes != '') ? rec.payment_terms_codes.id : 0;
        invoiceRec.payment_method_id = (rec.payment_method_ids != undefined && rec.payment_method_ids != '') ? rec.payment_method_ids.id : 0;


        invoiceRec.ship_to_name = rec.ship_to_name;
        invoiceRec.ship_to_address = rec.ship_to_address;
        invoiceRec.ship_to_address2 = rec.ship_to_address2;
        invoiceRec.ship_to_city = rec.ship_to_city;
        invoiceRec.ship_to_county = rec.ship_to_county;
        invoiceRec.ship_to_post_code = rec.ship_to_post_code;

        invoiceRec.ship_to_contact = rec.ship_to_contact;
        invoiceRec.comm_book_in_contact = rec.comm_book_in_contact;
        invoiceRec.book_in_tel = rec.book_in_tel;
        invoiceRec.book_in_email = rec.book_in_email;
        invoiceRec.alt_depo_id = rec.alt_depo_id;

        invoiceRec.shipment_method_id = (rec.shipment_method != undefined && rec.shipment_method.id != undefined) ? rec.shipment_method.id : 0;
        invoiceRec.shipment_method_code = (rec.shipment_method != undefined && rec.shipment_method.name != undefined) ? rec.shipment_method.name : 0;
        invoiceRec.shipping_agent_id = (rec.shipping_agent != undefined && rec.shipping_agent.id != undefined) ? rec.shipping_agent.id : 0;
        invoiceRec.shipping_agent_code = (rec.shipping_agent != undefined && rec.shipping_agent.name != undefined) ? rec.shipping_agent.name : 0;
        invoiceRec.ship_to_country_id = (rec.ship_to_country_ids != undefined && rec.ship_to_country_ids.id != undefined) ? rec.ship_to_country_ids.id : 0;


        invoiceRec.container_no = rec.container_no;
        invoiceRec.freight_charges = rec.freight_charges;
        invoiceRec.warehouse_booking_ref = rec.warehouse_booking_ref;
        invoiceRec.customer_warehouse_ref = rec.customer_warehouse_ref;

        invoiceRec.ship_delivery_time = rec.ship_delivery_time;
        invoiceRec.delivery_date = rec.delivery_date;
        invoiceRec.note = rec.note;
        invoiceRec.externalnote = rec.externalnote;

        invoiceRec.token = $scope.$root.token;
        invoiceRec.id = $stateParams.id;

        /* console.log('rec == ', rec);
        console.log('invoiceRec == ', invoiceRec);
        return false; */

        var updateInvoiceUrl = $scope.$root.sales + "customer/order/update-posted-sale-invoice";

        return $http
            .post(updateInvoiceUrl, invoiceRec)
            .then(function(res) {
                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.check_si_readonly = false;
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                } else
                    return res.data.error;

            }).catch(function(message) {
                $scope.showLoader = false;

                throw new Error(message.data);
            });
    }
}

OrderTabController.$inject = ["$scope", "$filter", "$rootScope", "$stateParams", "$http", "$state", "$resource", "toaster", "ngDialog", "$timeout", "myService", "ModalService", "generatePdf", "moduleTracker", "$q", "jsreportService"]
myApp.controller('OrderTabController', OrderTabController);

function OrderTabController($scope, $filter, $rootScope, $stateParams, $http, $state, $resource, toaster, ngDialog, $timeout, myService, ModalService, generatePdf, moduleTracker, $q, jsreportService) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    $scope.generatePdf = generatePdf;
    moduleTracker.updateName("sales");
    moduleTracker.updateRecord($stateParams.id);

    $scope.tempProdArr = [];

    var itemListingApi = $scope.$root.stock + "products-listing/item-popup";

    $scope.showLoader = true;

    $http
        .post(itemListingApi, { 'token': $scope.$root.token, 'sale_order_id': $rootScope.order_id, 'no_permission': 1, 'no_limits': 1 })
<<<<<<< HEAD
        .then(function (res) {
            if (res.data.ack == true) {
                angular.forEach(res.data.response, function (value, key) {
=======
        .then(function(res) {
            if (res.data.ack == true) {
                angular.forEach(res.data.response, function(value, key) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (key != "tbl_meta_data") {
                        $scope.tempProdArr.push(value);
                    }
                });

                if ($scope.tempProdArr.length == 0)
                    $scope.tempProdArr.push({ 'id': 0 });

                $scope.getOrdersDetail(1);
                // $scope.showLoader = false;
<<<<<<< HEAD
            }
            else {
=======
            } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.tempProdArr.push({ 'id': 0 });
                $scope.showLoader = false;
            }
        });

    // $rootScope.updateSelectedGlobalData("item");
    /* $scope.tempProdArr = [];
    var refreshId = setInterval(function () {
        if (($rootScope.prooduct_arr != undefined && $rootScope.prooduct_arr.length > 0)) {
            angular.copy($rootScope.prooduct_arr, $scope.tempProdArr);
            clearInterval(refreshId);
        }
    }, 500);
    

    for (var i = 0; i < $scope.tempProdArr.length; i++) {
        $scope.tempProdArr[i].chk = false;
        $scope.tempProdArr[i].calc_current_stock = Number($scope.tempProdArr[i].allocated_stock) + Number($scope.tempProdArr[i].available_stock);
    } */



    if ($stateParams.id > 0)
        $scope.check_so_readonly = true;

<<<<<<< HEAD
    $scope.showEditForm = function () {
=======
    $scope.showEditForm = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if ($scope.approvals_lock_order == 1) {
            $rootScope.approval_message = "The order is already approved. \n 1) Press Unlock to enable complete edit access to the document. It will need to be send for approval again. \n 2) Press Edit to edit general information only.";
            $rootScope.approval_type = "Unlock";
            ngDialog.openConfirm({
                template: '_confirm_approval_confirmation_modal2',
                className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
            }).then(function (value) {
                $scope.showLoader = true;
                var postUrl = $scope.$root.setup + "general/unlock-approved-order";
                //'warehouse_id': item.warehouses.id
                $http
                    .post(postUrl, {
                        'object_id': $scope.$root.order_id,
                        'type': "1, 2",
                        'token': $scope.$root.token
                    })
                    .then(function (res) {
                        if (res.data.ack == true) {
                            $scope.showLoader = false;
                            $scope.check_so_readonly = false;
                            $scope.$parent.check_so_readonly = false;
                            $scope.approvals_lock_order = 0;
                        }
                        else {
                            $scope.showLoader = false;
                            $scope.check_so_readonly = false;
                            $scope.$parent.check_so_readonly = false;
                        }
                    });
            },
                function (reason) {
=======
            }).then(function(value) {
                    $scope.showLoader = true;
                    var postUrl = $scope.$root.setup + "general/unlock-approved-order";
                    //'warehouse_id': item.warehouses.id
                    $http
                        .post(postUrl, {
                            'object_id': $scope.$root.order_id,
                            'type': "1, 2",
                            'token': $scope.$root.token
                        })
                        .then(function(res) {
                            if (res.data.ack == true) {
                                $scope.showLoader = false;
                                $scope.check_so_readonly = false;
                                $scope.$parent.check_so_readonly = false;
                                $scope.approvals_lock_order = 0;
                            } else {
                                $scope.showLoader = false;
                                $scope.check_so_readonly = false;
                                $scope.$parent.check_so_readonly = false;
                            }
                        });
                },
                function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.showLoader = false;
                    $scope.check_so_readonly = false;
                    $scope.$parent.check_so_readonly = false;
                    console.log('Modal promise rejected. Reason: ', reason);
                });
<<<<<<< HEAD
        }
        else {
=======
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.check_so_readonly = false;
            $scope.$parent.check_so_readonly = false;
            $scope.waitFormarginAnalysis = true;
        }
    }

    $scope.submit_show_invoicee = true;

    //  { 'label': 'Service(s)', 'value': 2   },
<<<<<<< HEAD
    $scope.arrItems =
        [{ 'label': 'Select item', 'value': 3 }, { 'label': 'Item(s)', 'value': 0 }, { 'label': 'G/L Account', 'value': 1 }];
=======
    $scope.arrItems = [{ 'label': 'Select item', 'value': 3 }, { 'label': 'Item(s)', 'value': 0 }, { 'label': 'G/L Account', 'value': 1 }];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


    $scope.arr_discount_type = [{
        'name': '',
        'id': "None"
    }, {
        'name': 'Value',
        'id': "Value"
    }, {
        'name': 'Percentage',
        'id': "Percentage"
    }, {
        'name': 'Unit',
        'id': "Unit"
    }];

    $scope.ec_goods_list = [{ 'title': 'Goods (and related services)', 'id': "1" }, { 'title': 'Services (standalone)', 'id': "2" }, { 'title': 'Traingulation', 'id': "3" }];
    $scope.ec_description_list = [{ 'title': 'This supply is an intra-community supply', 'id': "1" }, { 'title': 'This supply is exempt from VAT', 'id': "2" },
<<<<<<< HEAD
    { 'title': 'This is a Zero rated EC Supply', 'id': "3" }, { 'title': 'This supply is outside the scope of VAT', 'id': "4" }];
=======
        { 'title': 'This is a Zero rated EC Supply', 'id': "3" }, { 'title': 'This supply is outside the scope of VAT', 'id': "4" }
    ];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    $scope.default_currency_code = $rootScope.defaultCurrencyCode;
    $scope.company_name = $rootScope.company_name;
    $scope.currency_code = '';
    $scope.products = [];
    $scope.items = [];
    $scope.arr_categories = {};
    $scope.recs = {};
    // $scope.rec = {};
    $scope.wordsLength = 0;
    $scope.rec.item_types = $scope.arrItems[0];
    $scope.enable_btn_dispatch = false;
    $scope.enable_btn_invoice = false;
    $scope.enable_btn_submit = false;


<<<<<<< HEAD
    $scope.$on("orderTabEvent", function (event, comment) {
=======
    $scope.$on("orderTabEvent", function(event, comment) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (comment != null) {
            $scope.rec.note = comment;
            $scope.wordsLength = comment.length;
        }
    });
    /* 
        $scope.glarr_units = [];
        var gl_unitUrl_item = $scope.$root.setup + "general/get-all-gl-units-of-measure";
        $http
            .post(gl_unitUrl_item, { 'token': $scope.$root.token })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.glarr_units = res.data.response;
                }
            });
     */
    $scope.search_data = '';
    var drpCat = null;
    $scope.searchKeyword_pro = {};
<<<<<<< HEAD
    $scope.getProducts = function (recs, parm, item_paging, clr) {
=======
    $scope.getProducts = function(recs, parm, item_paging, clr) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var cat_id = '';
        $scope.postData = {};

        $scope.showLoader = true;

        if (parm != '') {
            //$scope.postData = {'all': "1", token: $scope.$root.token, 'crm_id': $scope.$root.crm_id};
            $scope.postData.token = $scope.$root.token;
            $scope.postData.all = 1;
            $scope.postData.crm_id = $scope.$root.crm_id;
            recs.category = '';
            recs.search_data = '';
<<<<<<< HEAD
        }
        else {
=======
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            cat_id = recs.category != null ? recs.category.id : '';
            $scope.search_data = recs.search_data;
            /*  $scope.postData = {
             'search_string': $scope.search_data,
             'category_id': cat_id,
             'all': "1",
             token: $scope.$root.token,
             'crm_id': $scope.$root.crm_id
             };*/
            $scope.postData.crm_id = $scope.$root.crm_id;
            $scope.postData.token = $scope.$root.token;
            $scope.postData.category_id = cat_id;
            $scope.postData.search_string = $scope.search_data;
            $scope.postData.all = 1;

        }


        if (item_paging == 1)
            $rootScope.item_paging.spage = 1;

        $scope.postData.page = $rootScope.item_paging.spage;
        $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;

        $scope.postData.searchKeyword_pro = $scope.searchKeyword_pro.$;

        if ($scope.searchKeyword_pro.category_name !== undefined && $scope.searchKeyword_pro.category_name !== null) {
            $scope.postData.category_names = $scope.searchKeyword_pro.category_name.id;
        }

        if ($scope.searchKeyword_pro.brand_name !== undefined && $scope.searchKeyword_pro.brand_name !== null)
            $scope.postData.brand_names = $scope.searchKeyword_pro.brand_name.id;

        if ($scope.searchKeyword_pro.unit !== undefined && $scope.searchKeyword_pro.unit !== null)
            $scope.postData.units = $scope.searchKeyword_pro.unit.id;


        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword_fin = {};
            $scope.record_data = {};
        }
        if (clr == 1) {
            $scope.searchKeyword_pro = {};
        }
        $scope.record = {};

        var order_date = angular.element('#offer_date').val();
        // var ship_to_name = angular.element('#ship_to_name').val();

        // console.log(order_date);
        // console.log(ship_to_name);
        // console.log($scope.rec.offer_date);
        $scope.postData.order_date = order_date;
        // $scope.postData.ship_to_name = ship_to_name;

        var prodApi = $scope.$root.stock + "products-listing/get-products-setup-list";
        $scope.filterOrderItem = {};
        $scope.filterOrderItem.search = '';
        $scope.filterOrderItem.category = '';
        $scope.filterOrderItem.brand = '';
        $scope.filterOrderItem.units = '';

        //var prodApi = $scope.$root.sales + "stock/products-listing/get-purchased-products-popup";
        // $timeout(function () {
        $http
            .post(prodApi, $scope.postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    $scope.products = [];
                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.total_paging_record = res.data.total_paging_record;
<<<<<<< HEAD
                    $.each(res.data.response, function (index, obj) {
=======
                    $.each(res.data.response, function(index, obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        obj.chk = false;
                        $scope.products[index] = obj;
                    });

<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.products = [];
                    $scope.showLoader = false;
                }
            });
        $scope.showLoader = false;
        // }, 1000);

    }


<<<<<<< HEAD
    $scope.getServices = function (recs, parm) {
=======
    $scope.getServices = function(recs, parm) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var cat_id = '';
        if (parm != '') {
            $scope.postData = { 'all': "1", token: $scope.$root.token };
            recs.category = '';
            recs.search_data = '';
<<<<<<< HEAD
        }
        else {
=======
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            cat_id = recs.category != null ? recs.category.id : '';
            $scope.search_data = recs.search_data;
            $scope.postData = {
                'search_string': $scope.search_data,
                'category_id': cat_id,
                'all': "1",
                token: $scope.$root.token
            };
        }

        $scope.record = {};
        var prodApi = $scope.$root.setup + "service/products-listing/get-products-popup";
        $http
            .post(prodApi, $scope.postData)
<<<<<<< HEAD
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.products = [];
                    $.each(res.data.response, function (index, obj) {
                        obj.chk = false;
                        $scope.products[index] = obj;
                    });
                }
                else {
=======
            .then(function(res) {
                if (res.data.ack == true) {
                    $scope.products = [];
                    $.each(res.data.response, function(index, obj) {
                        obj.chk = false;
                        $scope.products[index] = obj;
                    });
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.products = [];
                }
            });
    }

<<<<<<< HEAD
    angular.element(document).on('click', '.checkAll', function () {
=======
    angular.element(document).on('click', '.checkAll', function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (angular.element('.checkAll').is(':checked') == true) {
            for (var i = 0; i < $scope.products.length; i++) {
                $scope.products[i].chk = true;
            }
<<<<<<< HEAD
        }
        else {
=======
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            for (var i = 0; i < $scope.products.length; i++) {
                $scope.products[i].chk = false;
            }
        }
<<<<<<< HEAD
        $scope.$root.$apply(function () {
=======
        $scope.$root.$apply(function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.products;
        })
    });

<<<<<<< HEAD
    $scope.OnBlurQuantity = function (item, order_date_change) {
=======
    $scope.OnBlurQuantity = function(item, order_date_change) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // validate quantity
        var current_temp_price = item.standard_price;

        if (Number(item.minSaleQty) != 0 && Number(item.maxSaleQty) != 0 && item.type == 0) {
            if (Number(item.qty) < Number(item.minSaleQty) || Number(item.qty) > Number(item.maxSaleQty)) {

                item.qty = Number(item.minSaleQty);
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(573, [item.product_code, item.minSaleQty, item.maxSaleQty]));


                // return;
            }
        }

        if (item.qty < item.allocated_stock) {
            if (Number(item.qty) < 0) {
                var str = (Number(item.allocated_stock > 0)) ? ', ' + item.allocated_stock + ' already allocated ' : '';
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(574, [str]));
                item.qty = (Number(item.allocated_stock)) ? item.allocated_stock : 1;
                item.remainig_qty = 0;
                item.sale_status = 1;
                return;
<<<<<<< HEAD
            }
            else {
=======
            } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                toaster.pop('warning', 'Info', String(item.allocated_stock) + ' quantity is already allocated for item ' + item.product_code);
                item.qty = item.allocated_stock;
                item.remainig_qty = 0;
                item.sale_status = 1;
            }
            // return false;
        }


        if (item.qty >= item.allocated_stock) {
            item.remainig_qty = item.qty - item.allocated_stock;
        }

        // check promotion quantity
        if (item.promotion_id > 0) {
            var promo = $filter("filter")($scope.items, { ref_prod_id: item.update_id, item_type: 1 });
            if (promo.length != undefined && promo.length > 0)
                promo[0].qty = item.qty;
        }

        if (Number(item.item_type) == 1) // further checks not appilcable for gls
        {
            item.prev_qty = item.qty;
            return;
        }

        if (Number(item.promotion_id) == 0 || (item.promotion != undefined && (item.promotion.strategy == 3 || item.promotion.strategy == 4))) {
            // Validation for price offers
            if (item.arr_volume_discounts != undefined && item.arr_volume_discounts.length && item.qty != item.prev_qty) {
                var flg = 0;
                var discountType = 0;
                var volumeDiscount = 0;
<<<<<<< HEAD
                angular.forEach(item.arr_volume_discounts, function (obj) {
=======
                angular.forEach(item.arr_volume_discounts, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (Number(item.qty) >= Number(obj.min_qty)) {
                        flg = 1;
                        discountType = obj.discount_type;
                        volumeDiscount = obj.volume_discount;
                    }
                });
                if (!flg)
                    item.standard_price = Number(item.price_offer);
                else {
                    if (discountType == 1) // %
                        item.standard_price = parseFloat(item.price_offer) - parseFloat(item.price_offer) * (parseFloat(volumeDiscount) / 100);
                    else // value
                        item.standard_price = parseFloat(item.price_offer) - parseFloat(volumeDiscount);
                    item.standard_price = Number(item.standard_price.toFixed(2));

                    if (Number(current_temp_price) != Number(item.standard_price))
<<<<<<< HEAD
                        toaster.pop('warning', 'Info', 'Unit Price for item ' + item.product_code + ' has changed to '
                            + $rootScope.defaultCurrencyCode + ' ' + (String(item.standard_price)) + ' (Customer Specific Price) following date change.');
                }
            }
            else if (item.sales_prices.arr_sales_price != undefined && item.sales_prices.arr_sales_price.length > 0 && item.qty != item.prev_qty) {
=======
                        toaster.pop('warning', 'Info', 'Unit Price for item ' + item.product_code + ' has changed to ' +
                            $rootScope.defaultCurrencyCode + ' ' + (String(item.standard_price)) + ' (Customer Specific Price) following date change.');
                }
            } else if (item.sales_prices.arr_sales_price != undefined && item.sales_prices.arr_sales_price.length > 0 && item.qty != item.prev_qty) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                var discountType = item.sales_prices.discountType;
                var volumeDiscount = 0;
                var flg = 0;
<<<<<<< HEAD
                angular.forEach(item.sales_prices.arr_sales_price, function (obj1) {
=======
                angular.forEach(item.sales_prices.arr_sales_price, function(obj1) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (Number(item.qty) >= Number(obj1.min)) {
                        flg = 1;
                        volumeDiscount = obj1.discount;
                    }
                });

                if (!flg) {
                    // var ischanged = 0;
                    // temp_standard_price -> set at the time of getting sales price
                    // if(item.standard_price != Number(item.temp_standard_price))
                    //     ischanged = 1;
                    item.standard_price = Number(item.org_standard_price);
                    if (Number(current_temp_price) != Number(item.standard_price))
                        toaster.pop('warning', 'Info', 'Standard price changed to ' + (String(item.standard_price)) + ' for order date ' + $scope.rec.offer_date + ' for item ' + item.product_code + '.');
<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (discountType == 1) // %
                        item.standard_price = parseFloat(item.org_standard_price) - parseFloat(item.org_standard_price) * (parseFloat(volumeDiscount) / 100);
                    else // value
                        item.standard_price = parseFloat(item.org_standard_price) - parseFloat(volumeDiscount);
                    item.standard_price = Number(item.standard_price.toFixed(2));
                    if (Number(current_temp_price) != Number(item.standard_price))
                        toaster.pop('warning', 'Info', 'Standard price changed to ' + (String(item.standard_price)) + ' for order date ' + $scope.rec.offer_date + ' for item ' + item.product_code + '.');
                }
                /* var flg = 0;
                var discountType = item.arr_sales_price.discountType;
                var volumeDiscount = 0;
                
                angular.forEach(item.arr_sales_price, function (obj) {
                    if (Number(item.qty) >= Number(obj.min)) {
                        flg = 1;
                        volumeDiscount = obj.discount;
                    }
                });
                if (!flg)
                    item.standard_price = Number(item.org_standard_price);
                else {
                    if (discountType == 1) // %
                        item.standard_price = parseFloat(item.standard_price) - parseFloat(item.standard_price) * (parseFloat(volumeDiscount) / 100);
                    else // value
                        item.standard_price = parseFloat(item.standard_price) - parseFloat(volumeDiscount);
                    item.standard_price = Number(item.standard_price.toFixed(2));
                    toaster.pop('warning', 'Info', 'Standard price changed to ' + (String(item.standard_price)) + ' from item sales price');
                } */
            }
        }
        if (item.promotion != undefined)
            $scope.CalculatePromotion(item, promo[0]);
        else if (item.qty != item.prev_qty || (order_date_change != undefined && order_date_change == 1)) {
            // price offer checks
            if (item.arr_volume_discounts != undefined && item.arr_volume_discounts.length) {
                var flg = 0;
                var discountType = 0;
                var volumeDiscount = 0;
                var temp_std_price = Number(item.standard_price);

<<<<<<< HEAD
                angular.forEach(item.arr_volume_discounts, function (obj) {
=======
                angular.forEach(item.arr_volume_discounts, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (Number(item.qty) >= Number(obj.min_qty)) {
                        flg = 1;
                        discountType = obj.discount_type;
                        volumeDiscount = obj.volume_discount;
                    }
                });
                if (!flg)
                    item.standard_price = Number(item.price_offer);
                else {
                    if (discountType == 1) // %
                        item.standard_price = parseFloat(item.price_offer) - parseFloat(item.price_offer) * (parseFloat(volumeDiscount) / 100);
                    else // value
                        item.standard_price = parseFloat(item.price_offer) - parseFloat(volumeDiscount);
                    item.standard_price = Number(item.standard_price.toFixed(2));
                    // toaster.pop('warning', 'Info', 'Standard price changed to ' + (String(prodData.standard_price)) + ' from customer price offer');
                }

                if (temp_std_price != item.standard_price)

<<<<<<< HEAD
                    toaster.pop('warning', 'Info', 'Unit Price for item ' + item.product_code + ' has changed to '
                        + $rootScope.defaultCurrencyCode + ' ' + (String(item.standard_price)) + ' (Customer Specific Price) following date change.');
            }
            else {
                if (item.price_offer > 0) {
                    if (item.price_offer != item.standard_price) {
                        item.standard_price = Number(item.price_offer);
                        toaster.pop('warning', 'Info', 'Unit Price for item ' + item.product_code + ' has changed to '
                            + $rootScope.defaultCurrencyCode + ' ' + (String(item.standard_price)) + ' (Customer Specific Price) following date change.');
=======
                    toaster.pop('warning', 'Info', 'Unit Price for item ' + item.product_code + ' has changed to ' +
                    $rootScope.defaultCurrencyCode + ' ' + (String(item.standard_price)) + ' (Customer Specific Price) following date change.');
            } else {
                if (item.price_offer > 0) {
                    if (item.price_offer != item.standard_price) {
                        item.standard_price = Number(item.price_offer);
                        toaster.pop('warning', 'Info', 'Unit Price for item ' + item.product_code + ' has changed to ' +
                            $rootScope.defaultCurrencyCode + ' ' + (String(item.standard_price)) + ' (Customer Specific Price) following date change.');
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    }
                }
            }
        }
        item.prev_qty = item.qty;
    }


<<<<<<< HEAD
    $scope.selectProd = function (id) {
=======
    $scope.selectProd = function(id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        for (var i = 0; i < $scope.products.length; i++) {
            if (id == $scope.products[i].id) {
                if ($scope.products[i].chk == true)
                    $scope.products[i].chk = false
                else
                    $scope.products[i].chk = true
            }
        }
    }

<<<<<<< HEAD
    $scope.getPriceOffers = function (type) // 1-> do not change value, 2-> change value, 3=> do not call the item price offer
    {
        if ($rootScope.crm_id == 0) return;
        var getpriceOffersUrl = $rootScope.sales + "crm/crm/get-items-price-offers-by-custid";

        $scope.price_offer_arr = [];
        $http
            .post(getpriceOffersUrl, { 'token': $rootScope.token, 'crm_id': $rootScope.crm_id, 'order_date': $scope.rec.offer_date })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.price_offer_arr = res.data.response;
                    // if (type == 1) 
                    {
                        angular.forEach($scope.price_offer_arr, function (obj) {
                            var item = $filter("filter")($scope.tempProdArr, { id: obj.item_id });
                            var idx = $scope.tempProdArr.indexOf(item[0]);
                            if (idx != -1) {
                                $scope.tempProdArr[idx].price_offer = obj.price_offer;
                                $scope.tempProdArr[idx].minSaleQty = obj.minSaleQty;
                                $scope.tempProdArr[idx].maxSaleQty = obj.maxSaleQty;
                                $scope.tempProdArr[idx].price_offer_id = obj.id;
                                $scope.tempProdArr[idx].arr_volume_discounts = obj.arr_volume_discounts;
                            }
                        });
                    }
                    // else 
                    {
                        angular.forEach($scope.price_offer_arr, function (obj) {
                            var item = $filter("filter")($scope.items, { id: obj.item_id, item_type: 0 });
                            if (item.length > 0) {
                                angular.forEach(item, function (obj1) {
                                    var idx = $scope.items.indexOf(obj1);
                                    if (idx != -1) {
                                        $scope.items[idx].is_price_offer = 1;
                                        $scope.items[idx].price_offer = obj.price_offer;
                                        $scope.items[idx].minSaleQty = obj.minSaleQty;
                                        $scope.items[idx].maxSaleQty = obj.maxSaleQty;
                                        /* 
                                        if (Number($scope.items[idx].qty) < Number($scope.items[idx].minSaleQty) || Number($scope.items[idx].qty) > Number($scope.items[idx].maxSaleQty)) {
                                            $scope.items[idx].qty = Number($scope.items[idx].minSaleQty);
                                            toaster.pop('warning', 'Warning', 'Minimum order quantity for ' + $scope.items[idx].product_code + ' must be between ' + $scope.items[idx].minSaleQty + ' and ' + $scope.items[idx].maxSaleQty);
                                        } */
                                        $scope.items[idx].price_offer_id = obj.id;
                                        $scope.items[idx].arr_volume_discounts = obj.arr_volume_discounts;
                                        if (type == 2)
                                            $scope.OnBlurQuantity($scope.items[idx], 1);
                                    }
                                });
                            }
                        });
                        // if there is a price for some of item and some don't have so we have revert the price to the standard
                        if (type == 2) {
                            var isExist = false;
                            angular.forEach($scope.items, function (obj) {
                                if ((obj.is_price_offer == undefined || obj.is_price_offer == 0) && Number(obj.item_type) == 0) {
                                    isExist = true;
                                    obj.is_price_offer = 0;
                                    obj.arr_volume_discounts = [];
                                    obj.price_offer = 0;
                                    if (Number(obj.standard_price) != Number(obj.org_standard_price)) {
                                        toaster.pop('warning', 'Info', 'Unit Price for item ' + obj.product_code + ' has changed to '
                                            + $rootScope.defaultCurrencyCode + ' ' + (String(obj.org_standard_price)) + ' (Standard Price) following date change.');

                                        obj.standard_price = Number(obj.org_standard_price);
                                    }
                                }
                            });
                            if (isExist) // may be we need to remove this condidtion if we are dealing with multiple items and some have price and some don't have, depends on testing
                            {
                                $scope.getItemsSalesPrice(3);
                            }
                        }
                    }
                }
                if (res.data.ack == 0) {
                    if (type == 2) {
                        angular.forEach($scope.items, function (obj) {
                            obj.arr_volume_discounts = [];
                            obj.price_offer = 0;
                            if (Number(obj.standard_price) != Number(obj.org_standard_price) && Number(obj.item_type) == 0) {
                                toaster.pop('warning', 'Info', 'Unit Price for item ' + obj.product_code + ' has changed to '
                                    + $rootScope.defaultCurrencyCode + ' ' + (String(obj.org_standard_price)) + ' (Standard Price) following date change.');
                                obj.standard_price = Number(obj.org_standard_price);
                            }
                        });
                    }
                    /* else
                    {
                        $scope.getItemsSalesPrice(3);
                    } */
                }
            });
    }

    $scope.getPromotions = function (type) { // type is not used anywhere
=======
    $scope.getPriceOffers = function(type) // 1-> do not change value, 2-> change value, 3=> do not call the item price offer
        {
            if ($rootScope.crm_id == 0) return;
            var getpriceOffersUrl = $rootScope.sales + "crm/crm/get-items-price-offers-by-custid";

            $scope.price_offer_arr = [];
            $http
                .post(getpriceOffersUrl, { 'token': $rootScope.token, 'crm_id': $rootScope.crm_id, 'order_date': $scope.rec.offer_date })
                .then(function(res) {
                    if (res.data.ack == true) {
                        $scope.price_offer_arr = res.data.response;
                        // if (type == 1) 
                        {
                            angular.forEach($scope.price_offer_arr, function(obj) {
                                var item = $filter("filter")($scope.tempProdArr, { id: obj.item_id });
                                var idx = $scope.tempProdArr.indexOf(item[0]);
                                if (idx != -1) {
                                    $scope.tempProdArr[idx].price_offer = obj.price_offer;
                                    $scope.tempProdArr[idx].minSaleQty = obj.minSaleQty;
                                    $scope.tempProdArr[idx].maxSaleQty = obj.maxSaleQty;
                                    $scope.tempProdArr[idx].price_offer_id = obj.id;
                                    $scope.tempProdArr[idx].arr_volume_discounts = obj.arr_volume_discounts;
                                }
                            });
                        }
                        // else 
                        {
                            angular.forEach($scope.price_offer_arr, function(obj) {
                                var item = $filter("filter")($scope.items, { id: obj.item_id, item_type: 0 });
                                if (item.length > 0) {
                                    angular.forEach(item, function(obj1) {
                                        var idx = $scope.items.indexOf(obj1);
                                        if (idx != -1) {
                                            $scope.items[idx].is_price_offer = 1;
                                            $scope.items[idx].price_offer = obj.price_offer;
                                            $scope.items[idx].minSaleQty = obj.minSaleQty;
                                            $scope.items[idx].maxSaleQty = obj.maxSaleQty;
                                            /* 
                                            if (Number($scope.items[idx].qty) < Number($scope.items[idx].minSaleQty) || Number($scope.items[idx].qty) > Number($scope.items[idx].maxSaleQty)) {
                                                $scope.items[idx].qty = Number($scope.items[idx].minSaleQty);
                                                toaster.pop('warning', 'Warning', 'Minimum order quantity for ' + $scope.items[idx].product_code + ' must be between ' + $scope.items[idx].minSaleQty + ' and ' + $scope.items[idx].maxSaleQty);
                                            } */
                                            $scope.items[idx].price_offer_id = obj.id;
                                            $scope.items[idx].arr_volume_discounts = obj.arr_volume_discounts;
                                            if (type == 2)
                                                $scope.OnBlurQuantity($scope.items[idx], 1);
                                        }
                                    });
                                }
                            });
                            // if there is a price for some of item and some don't have so we have revert the price to the standard
                            if (type == 2) {
                                var isExist = false;
                                angular.forEach($scope.items, function(obj) {
                                    if ((obj.is_price_offer == undefined || obj.is_price_offer == 0) && Number(obj.item_type) == 0) {
                                        isExist = true;
                                        obj.is_price_offer = 0;
                                        obj.arr_volume_discounts = [];
                                        obj.price_offer = 0;
                                        if (Number(obj.standard_price) != Number(obj.org_standard_price)) {
                                            toaster.pop('warning', 'Info', 'Unit Price for item ' + obj.product_code + ' has changed to ' +
                                                $rootScope.defaultCurrencyCode + ' ' + (String(obj.org_standard_price)) + ' (Standard Price) following date change.');

                                            obj.standard_price = Number(obj.org_standard_price);
                                        }
                                    }
                                });
                                if (isExist) // may be we need to remove this condidtion if we are dealing with multiple items and some have price and some don't have, depends on testing
                                {
                                    $scope.getItemsSalesPrice(3);
                                }
                            }
                        }
                    }
                    if (res.data.ack == 0) {
                        if (type == 2) {
                            angular.forEach($scope.items, function(obj) {
                                obj.arr_volume_discounts = [];
                                obj.price_offer = 0;
                                if (Number(obj.standard_price) != Number(obj.org_standard_price) && Number(obj.item_type) == 0) {
                                    toaster.pop('warning', 'Info', 'Unit Price for item ' + obj.product_code + ' has changed to ' +
                                        $rootScope.defaultCurrencyCode + ' ' + (String(obj.org_standard_price)) + ' (Standard Price) following date change.');
                                    obj.standard_price = Number(obj.org_standard_price);
                                }
                            });
                        }
                        /* else
                        {
                            $scope.getItemsSalesPrice(3);
                        } */
                    }
                });
        }

    $scope.getPromotions = function(type) { // type is not used anywhere
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var getPromotionsUrl = $rootScope.sales + "crm/crm/get-items-promotions-by-custid";

        var promotion_applies = 0;
        $scope.price_offer_arr = [];
        $http
            .post(getPromotionsUrl, { 'token': $rootScope.token, 'crm_id': $rootScope.crm_id, 'order_date': $scope.rec.offer_date })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    $scope.promotions = res.data.response;
                    // if (type == 1) 
                    // {
                    //     angular.forEach($scope.promotions, function (obj) {
                    //         var item = $filter("filter")($scope.tempProdArr, { id: obj.product_id });
                    //         var idx = $scope.tempProdArr.indexOf(item[0]);
                    //         if (idx != -1) {
                    //             $scope.tempProdArr[idx].promotion = {};
                    //             $scope.tempProdArr[idx].promotion_id = obj.id;
                    //             $scope.tempProdArr[idx].promotion.gl_id = obj.promotion_gl_id;
                    //             $scope.tempProdArr[idx].promotion.gl_code = obj.promotion_gl_code;
                    //             $scope.tempProdArr[idx].promotion.gl_name = obj.promotion_gl_name;
                    //             $scope.tempProdArr[idx].promotion.discount_type = obj.discount_type;
                    //             $scope.tempProdArr[idx].promotion.discount = obj.discount;
                    //             $scope.tempProdArr[idx].promotion.strategy_type = obj.strategy_type;
                    //             $scope.tempProdArr[idx].promotion.strategy = obj.strategy;
                    //             $scope.tempProdArr[idx].promotion.start_date = obj.start_date;
                    //             $scope.tempProdArr[idx].promotion.end_date = obj.end_date;

                    //         }
                    //     });
                    // }
                    // else if (type == 2) 
                    {
<<<<<<< HEAD
                        angular.forEach($scope.promotions, function (obj) {
=======
                        angular.forEach($scope.promotions, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            var item = $filter("filter")($scope.items, { id: obj.product_id });
                            var idx = $scope.items.indexOf(item[0]);
                            if (idx != -1) {
                                $scope.items[idx].promotion = {};
                                $scope.items[idx].promotion_id = obj.id;
                                $scope.items[idx].promotion.gl_id = obj.promotion_gl_id;
                                $scope.items[idx].promotion.gl_code = obj.promotion_gl_code;
                                $scope.items[idx].promotion.gl_name = obj.promotion_gl_name;
                                $scope.items[idx].promotion.discount_type = obj.discount_type;
                                $scope.items[idx].promotion.discount = obj.discount;
                                $scope.items[idx].promotion.strategy_type = obj.strategy_type;
                                $scope.items[idx].promotion.strategy = obj.strategy;
                                $scope.items[idx].promotion.start_date = obj.start_date;
                                $scope.items[idx].promotion.end_date = obj.end_date;

                                // check if promotion is not added previously
                                /* var check_promo = $filter("filter")($scope.items, { type:1, promotion_id: obj.id, ref_prod_id: item[0].update_id });
                                var promo_idx = $scope.items.indexOf(check_promo[0]);
                                if(promo_idx == -1)
                                {
                                    $scope.acItem = {};
                                    $scope.acItem.ref_prod_id = item[0].update_id;
                                    $scope.acItem.product_id = item[0].promotion.gl_id;
                                    $scope.acItem.id = item[0].promotion.gl_id;
                                    $scope.acItem.product_code = item[0].promotion.gl_code;
                                    $scope.acItem.description = item[0].promotion.gl_name;
                                    $scope.acItem.product_name = item[0].promotion.gl_name;
                                    $scope.acItem.item_type = 1;
                                    $scope.acItem.qty = item[0].qty;

                                    angular.forEach($rootScope.arr_vat_post_grp_sales, function (obj) {
                                        if (obj.id == item[0].vat_id)
                                            $scope.acItem.vats = obj;
                                    });

                                    angular.forEach($rootScope.gl_arr_units, function (obj) {
                                        if (obj.id == item[0].unit_id)
                                            $scope.acItem.units = obj;
                                    });

                                    promotion_applies = $scope.CalculatePromotion(item[0], $scope.acItem);
                                } */
                            }
                        });

                    }
                    // console.log($scope.tempProdArr);
                }
            });
    }
    $scope.category_list_final = {};
    $scope.category_sub = {};
    $scope.category_list_data_one = {};
    $scope.category_list_data_second = {};
    $scope.category_list_data_third = {};
    $scope.gl_account = {};
    var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";
    $scope.item_type = '';

    $scope.selectedRecFromModalsItem = [];
    $scope.searchKeywordItem = {};

    $scope.productsArr = [];

<<<<<<< HEAD
    $scope.selectItem = function (item_paging, sort_column, sortform) {
=======
    $scope.selectItem = function(item_paging, sort_column, sortform) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (item_paging) {
            $scope.selectedRecFromModalsItem = [];
            $scope.searchKeywordItem = {};
        }
        $scope.filterOrderItem = {};
<<<<<<< HEAD
        $scope.item_type = 0;//item_type;// rec.item_types.value;
=======
        $scope.item_type = 0; //item_type;// rec.item_types.value;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (!($scope.rec.id > 0)) {
            //console.log("updating");
            $scope.saverecord = $scope.add_general($scope.rec, 1);
        }

        // if ($scope.item_type == 0) 
        {
            /* var getListUrl = $scope.$root.sales + "stock/categories";
            $http
                 .post(getListUrl, {'token': $scope.$root.token})
                 .then(function (res) {
                     if (res.data.ack == true) {
                         $scope.arr_categories = {};
                         $scope.arr_categories = res.data.response;
                     }
                 });
            $scope.getProducts('', 'all', 1);  */

            $scope.filterSalesItem = {};
            /*
            if($scope.tempProdArr == undefined)
            {
                $scope.tempProdArr = [];
                angular.copy($rootScope.prooduct_arr, $scope.tempProdArr);
            }

             for (var i = 0; i < $scope.tempProdArr.length; i++) {
                if($scope.tempProdArr[i].chk)
                    $scope.tempProdArr[i].disableCheck = true;
            } */

            /* $rootScope.updateSelectedGlobalData("item");
            $scope.tempProdArr = [];
            angular.copy($rootScope.prooduct_arr, $scope.tempProdArr);

            for (var i = 0; i < $scope.tempProdArr.length; i++) {
                $scope.tempProdArr[i].chk = false;
                $scope.tempProdArr[i].calc_current_stock = Number($scope.tempProdArr[i].allocated_stock) + Number($scope.tempProdArr[i].available_stock);
            } */
            $scope.postData = {};
            $scope.postData.token = $scope.$root.token;
            $scope.postData.order_date = $scope.rec.offer_date;
            $scope.postData.customer_id = $scope.rec.sell_to_cust_id;

            $scope.productsArr = [];

            $scope.postData.searchKeyword = $scope.searchKeywordItem;


            var itemListingApi = $scope.$root.stock + "products-listing/item-popup";
            // $scope.itemTableData ={};
            $scope.showLoader = true;
            $http
                .post(itemListingApi, $scope.postData)
<<<<<<< HEAD
                .then(function (res) {
=======
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.itemTableData = res;
                    $scope.columns = [];
                    $scope.record_data = {};
                    $scope.recordArray = [];
                    $scope.showLoader = false;
                    $scope.productsArr = [];
                    // $scope.selectedRecFromModalsItem = [];
                    $scope.PendingSelectedItems = [];

                    if (res.data.ack == true) {
                        $scope.total = res.data.total;
                        $scope.item_paging.total_pages = res.data.total_pages;
                        $scope.item_paging.cpage = res.data.cpage;
                        $scope.item_paging.ppage = res.data.ppage;
                        $scope.item_paging.npage = res.data.npage;
                        $scope.item_paging.pages = res.data.pages;

                        $scope.total_paging_record = res.data.total_paging_record;

                        $scope.record_data = $scope.tempProdArr;

<<<<<<< HEAD
                        angular.forEach(res.data.response, function (value, key) {
=======
                        angular.forEach(res.data.response, function(value, key) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (key != "tbl_meta_data") {
                                $scope.productsArr.push(value);
                            }
                        });

<<<<<<< HEAD
                        angular.forEach($scope.itemTableData.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
=======
                        angular.forEach($scope.itemTableData.data.response.tbl_meta_data.response.colMeta, function(obj, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (obj.event && obj.event.name && obj.event.trigger) {
                                obj.generatedEvent = $scope[obj.event.name];
                            }
                        });
                        angular.element('#productModal').modal({ show: true });


                        // $scope.getItemsPricesAndVolumeDiscounts(); 

                        // $scope.getPriceOffers(1);
                        // $scope.getPromotions(1);


                        // $scope.getItemsSalesPrice(1);
                        $scope.showLoader = false;

<<<<<<< HEAD
                    }
                    else {
=======
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                    }
                });


        }
    }

<<<<<<< HEAD
    $scope.selectGL = function (item_type, rec) {
        $scope.filterOrderItem = {};
        $scope.item_type = item_type;// rec.item_types.value;
=======
    $scope.selectGL = function(item_type, rec) {
        $scope.filterOrderItem = {};
        $scope.item_type = item_type; // rec.item_types.value;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (!($scope.rec.id > 0)) {
            //console.log("updating");
            $scope.saverecord = $scope.add_general(rec, 1);
        }


        if ($scope.item_type == 1) {
            $scope.gl_account = {};
            $scope.gl_accounts(1, 77);
<<<<<<< HEAD
        }
        else if ($scope.item_type == 2) {
            var getListUrl = $scope.$root.setup + "service/categories/get-all-categories";
            $http
                .post(getListUrl, { 'token': $scope.$root.token })
                .then(function (res) {
=======
        } else if ($scope.item_type == 2) {
            var getListUrl = $scope.$root.setup + "service/categories/get-all-categories";
            $http
                .post(getListUrl, { 'token': $scope.$root.token })
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        $scope.arr_categories = {};
                        $scope.arr_categories = res.data.response;
                    }
                });
            $scope.getServices('', 'all');
            angular.element('#serviceModal').modal({ show: true });
        }
    }

<<<<<<< HEAD
    $scope.openDocumentLink = function () {
=======
    $scope.openDocumentLink = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        // getCustomerPrice
        var url = $state.href("app.editCustomer", ({ 'id': $scope.rec.sell_to_cust_id, 'isPriceOffer': 1 }));
        window.open(url, '_blank');
    }

    $scope.searchKeyword_sup_gl_code = {};

<<<<<<< HEAD
    $scope.callbackAfterItemsMigration = function () {
        $scope.showLoader = true;
        $timeout(function () {
=======
    $scope.callbackAfterItemsMigration = function() {
        $scope.showLoader = true;
        $timeout(function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if ($scope.rec.type2 == 0)
                $state.go("app.editSaleQuote", { id: $scope.rec.id }, { reload: true });
            else
                $state.go("app.editOrder", { id: $scope.rec.id }, { reload: true });
            // $state.go($state.current, $stateParams, { reload: true })
        }, 1500)
    }

<<<<<<< HEAD
    $scope.callbackBeforeItemsMigration = function (data) {
        if ($scope.rec.type == 0) {
            data.additionalParams = [{ type: "Number", sourceTable: "", sourceField: "", targetTable: "order_details", targetField: "order_id", columnName: "Sales Quote Number", value: $scope.rec.id }];
        }
        else if ($scope.rec.type == 1) {
=======
    $scope.callbackBeforeItemsMigration = function(data) {
        if ($scope.rec.type == 0) {
            data.additionalParams = [{ type: "Number", sourceTable: "", sourceField: "", targetTable: "order_details", targetField: "order_id", columnName: "Sales Quote Number", value: $scope.rec.id }];
        } else if ($scope.rec.type == 1) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            data.additionalParams = [{ type: "Number", sourceTable: "", sourceField: "", targetTable: "order_details", targetField: "order_id", columnName: "Sales Order Number", value: $scope.rec.id }];
        }
        return data;
    }
<<<<<<< HEAD
    $scope.gl_accounts = function (item_paging, clr) {
=======
    $scope.gl_accounts = function(item_paging, clr) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        //console.log($scope.item_type);
        $scope.showLoader = true;
        $scope.postData = {};

        //{'token': $scope.$root.token, 'display_id': 10}

        $scope.postData.token = $scope.$root.token;
        $scope.postData.display_id = 10;

        if (item_paging == 1)
            $rootScope.item_paging.spage = 1;
        $scope.postData.page = $rootScope.item_paging.spage;

        $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;

        $scope.postData.searchKeyword = "";

        $scope.postData.searchKeyword = $scope.searchKeyword_sup_gl_code.$;
        if (clr == 77) {
            $scope.searchKeyword_sup_gl_code = {};
        }

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
            $scope.record_data = {};
        }
        var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";

        $http
            .post(postUrl_cat, $scope.postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.showLoader = false;
                if (res.data.ack == true) {
                    $scope.gl_account = res.data.response;
                    $scope.category_sub = res.data.response_new;
                    $scope.category_list_data_one = res.data.response_account;
                    $scope.category_list_data_second = res.data.response_account;
                    $scope.category_list_data_third = res.data.response_account;
                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.total_paging_record = res.data.total_paging_record;
                    $scope.filterGL = {};
                    $scope.filterGL.search = "";
                    angular.element('#accthead_modal').modal({ show: true });
                }
            });
    }
<<<<<<< HEAD
    $scope.show_add_pop = function (id) {
=======
    $scope.show_add_pop = function(id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var DetailsURL = $scope.$root.gl + "chart-accounts/get-account-heads";
        $http
            .post(DetailsURL, { 'token': $scope.$root.token, 'gl_id': id })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {

                    $scope.acItem = {};
                    $scope.acItem.product_code = res.data.response.number;
                    $scope.acItem.description = res.data.response.name;
                    $scope.acItem.item_type = 1;
                    $scope.acItem.qty = 1;
                    $scope.acItem.Price = 0;
                    $scope.acItem.Vat = res.data.response.vat_list_id;

<<<<<<< HEAD
                    angular.forEach($rootScope.arr_vat_post_grp_sales, function (obj) {
=======
                    angular.forEach($rootScope.arr_vat_post_grp_sales, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (obj.id == $scope.acItem.Vat)
                            $scope.acItem.vats = obj;
                    });

                    console.log($rootScope.arr_vat_post_grp_sales);
                    console.log($scope.acItem.vats + ' SELECTED VAT ');

                    $scope.items.push($scope.acItem);
                    ///$scope.$root.return_status = true;
                }
            });

        $('#accthead_modal').modal('hide');

    };

    $scope.wordsLength = 0;
<<<<<<< HEAD
    $scope.showWordsLimits_invoice = function () {
        $scope.wordsLength = $scope.rec.note.length;
    }

    $scope.checkAllOrderItem = function (val, category, brand, unit) {
=======
    $scope.showWordsLimits_invoice = function() {
        $scope.wordsLength = $scope.rec.note.length;
    }

    $scope.checkAllOrderItem = function(val, category, brand, unit) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        console.log("brands: ", brand);
        let filtered;
        var selection_filter = $filter('filter');
        filtered = selection_filter($scope.tempProdArr, $scope.filterOrderItem.search);
        filtered = selection_filter(filtered, category);
        filtered = selection_filter(filtered, brand);
        filtered = selection_filter(filtered, unit);
        $scope.PendingSelectedOrderItems = [];

        if (val == true) {
<<<<<<< HEAD
            angular.forEach(filtered, function (obj) {
=======
            angular.forEach(filtered, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                obj.chk = true;

                // if (category != undefined && category == obj.category_id && brand != undefined && brand == obj.brand_id && unit != undefined && unit == obj.unit_id) {
                //     obj.chk = true;
                // } else if (category != undefined && category == obj.category_id && brand != undefined && brand == obj.brand_id) {
                //     obj.chk = true;
                // } else if (category != undefined && category == obj.category_id && unit != undefined && unit == obj.unit_id) {
                //     obj.chk = true;
                // } else if (brand != undefined && brand == obj.brand_id && unit != undefined && unit == obj.unit_id) {
                //     obj.chk = true;
                // } else if (category != undefined && category == obj.category_id) {
                //     obj.chk = true;
                // } else if (brand != undefined && brand == obj.brand_id) {
                //     obj.chk = true;
                // } else if (unit != undefined && unit == obj.unit_id) {
                //     obj.chk = true;
                // } else if (category == undefined && brand == undefined && unit == undefined) {
                //     obj.chk = true;
                // }
                $scope.PendingSelectedOrderItems.push(obj);
            });
        } else {
<<<<<<< HEAD
            angular.forEach($scope.tempProdArr, function (obj) {
=======
            angular.forEach($scope.tempProdArr, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (!obj.disableCheck)
                    obj.chk = false;
            });
            $scope.PendingSelectedOrderItems = [];
        }
    }
<<<<<<< HEAD
    $scope.CalculatePromotion = function (prodData, promoItem) {
=======
    $scope.CalculatePromotion = function(prodData, promoItem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (promoItem == undefined) return;

        var promotionApplies = 0;
        if (prodData.promotion.strategy_type == 1) // Standard and customer specific
        {
            if (prodData.promotion.strategy == 1) // Volume Discount Applies and Promotion only for Customers without Volume Discount
            {
                //prodData.price_offer == undefined && 
                if (prodData.arr_volume_discounts == undefined) {
                    prodData.standard_price = Number(prodData.price_offer) > 0 ? Number(prodData.price_offer) : Number(prodData.standard_price);

                    promotionApplies = 1;
                    if (prodData.promotion.discount_type == 1) // percentage
                    {
                        promoItem.standard_price = (Number(prodData.standard_price) * Number(prodData.promotion.discount) / 100);
<<<<<<< HEAD
                    }
                    else if (prodData.promotion.discount_type == 2) // value
=======
                    } else if (prodData.promotion.discount_type == 2) // value
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    {
                        promoItem.standard_price = Number(prodData.standard_price) - ((Number(prodData.standard_price) - Number(prodData.promotion.discount)));
                    }
                }
<<<<<<< HEAD
            }
            else if (prodData.promotion.strategy == 2) // Apply Promotion Only and Ignore Any Volume Discount
=======
            } else if (prodData.promotion.strategy == 2) // Apply Promotion Only and Ignore Any Volume Discount
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            {
                promotionApplies = 1;
                prodData.standard_price = Number(prodData.price_offer) > 0 ? Number(prodData.price_offer) : Number(prodData.standard_price);

                // apply promotion
                if (prodData.promotion.discount_type == 1) // percentage
                {
                    promoItem.standard_price = (Number(prodData.standard_price) * Number(prodData.promotion.discount) / 100);
<<<<<<< HEAD
                }
                else if (prodData.promotion.discount_type == 2) // value
                {
                    promoItem.standard_price = Number(prodData.standard_price) - ((Number(prodData.standard_price) - Number(prodData.promotion.discount)));
                }
            }
            else if (prodData.promotion.strategy == 3) // Promotion applies after Volume Discount
=======
                } else if (prodData.promotion.discount_type == 2) // value
                {
                    promoItem.standard_price = Number(prodData.standard_price) - ((Number(prodData.standard_price) - Number(prodData.promotion.discount)));
                }
            } else if (prodData.promotion.strategy == 3) // Promotion applies after Volume Discount
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            {
                promotionApplies = 1;
                prodData.standard_price = Number(prodData.price_offer) > 0 ? Number(prodData.price_offer) : Number(prodData.standard_price);

                // apply volume discount
                if (prodData.arr_volume_discounts != undefined && prodData.arr_volume_discounts.length) {
                    var flg = 0;
                    var discountType = 0;
                    var volumeDiscount = 0;
<<<<<<< HEAD
                    angular.forEach(prodData.arr_volume_discounts, function (obj) {
=======
                    angular.forEach(prodData.arr_volume_discounts, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (Number(prodData.qty) >= Number(obj.min_qty)) {
                            flg = 1;
                            discountType = obj.discount_type;
                            volumeDiscount = obj.volume_discount;
                        }
                    });
                    if (!flg)
                        prodData.standard_price = Number(prodData.price_offer);
                    else {
                        if (discountType == 1) // %
                            prodData.standard_price = parseFloat(prodData.price_offer) - parseFloat(prodData.price_offer) * (parseFloat(volumeDiscount) / 100);
                        else // value
                            prodData.standard_price = parseFloat(prodData.price_offer) - parseFloat(volumeDiscount);
                        prodData.standard_price = Number(prodData.standard_price.toFixed(2));
                        // toaster.pop('warning', 'Info', 'Standard price changed to ' + (String(prodData.standard_price)) + ' from customer price offer');
                    }
                }

                // then apply promotion
                if (prodData.promotion.discount_type == 1) // percentage
                {
                    promoItem.standard_price = (Number(prodData.standard_price) * Number(prodData.promotion.discount) / 100);
<<<<<<< HEAD
                }
                else if (prodData.promotion.discount_type == 2) // value
=======
                } else if (prodData.promotion.discount_type == 2) // value
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                {
                    // promoItem.standard_price = (Number(prodData.standard_price) - Number(prodData.promotion.discount));
                    promoItem.standard_price = Number(prodData.standard_price) - ((Number(prodData.standard_price) - Number(prodData.promotion.discount)));
                }
<<<<<<< HEAD
            }
            else if (prodData.promotion.strategy == 4) // Promotion Applies Before Volume Discount
=======
            } else if (prodData.promotion.strategy == 4) // Promotion Applies Before Volume Discount
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            {
                promotionApplies = 1;
                prodData.standard_price = Number(prodData.price_offer) > 0 ? Number(prodData.price_offer) : Number(prodData.standard_price);

                // apply promotion
                if (prodData.promotion.discount_type == 1) // percentage
                {
                    promoItem.standard_price = (Number(prodData.standard_price) * Number(prodData.promotion.discount) / 100);
<<<<<<< HEAD
                }
                else if (prodData.promotion.discount_type == 2) // value
=======
                } else if (prodData.promotion.discount_type == 2) // value
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                {
                    // promoItem.standard_price = (Number(prodData.standard_price) - Number(prodData.promotion.discount));
                    promoItem.standard_price = Number(prodData.standard_price) - ((Number(prodData.standard_price) - Number(prodData.promotion.discount)));
                }
                // then apply volume discount
                if (prodData.arr_volume_discounts != undefined && prodData.arr_volume_discounts.length) {
                    var flg = 0;
                    var discountType = 0;
                    var volumeDiscount = 0;
<<<<<<< HEAD
                    angular.forEach(prodData.arr_volume_discounts, function (obj) {
=======
                    angular.forEach(prodData.arr_volume_discounts, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (Number(prodData.qty) >= Number(obj.min_qty)) {
                            flg = 1;
                            discountType = obj.discount_type;
                            volumeDiscount = obj.volume_discount;
                        }
                    });
                    if (!flg)
                        prodData.standard_price = Number(prodData.price_offer);
                    else {
                        if (discountType == 1) // %
                            prodData.standard_price = parseFloat(prodData.price_offer) - parseFloat(prodData.price_offer) * (parseFloat(volumeDiscount) / 100);
                        else // value
                            prodData.standard_price = parseFloat(prodData.price_offer) - parseFloat(volumeDiscount);
                        prodData.standard_price = Number(prodData.standard_price.toFixed(2));
                        // toaster.pop('warning', 'Info', 'Standard price changed to ' + (String(prodData.standard_price)) + ' from customer price offer');
                    }

                }
            }
<<<<<<< HEAD
        }
        else if (prodData.promotion.strategy_type == 2 && prodData.temp_standard_price > 0) // Standard Sale Price
        {
            if (prodData.promotion.strategy == 1) // Volume Discount Applies and Promotion only for Customers without Volume Discount
            {
                if (prodData.price_offer == undefined && prodData.arr_volume_discounts == undefined) {// && prodData.arr_volume_discounts.length) {
=======
        } else if (prodData.promotion.strategy_type == 2 && prodData.temp_standard_price > 0) // Standard Sale Price
        {
            if (prodData.promotion.strategy == 1) // Volume Discount Applies and Promotion only for Customers without Volume Discount
            {
                if (prodData.price_offer == undefined && prodData.arr_volume_discounts == undefined) { // && prodData.arr_volume_discounts.length) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    prodData.standard_price = Number(prodData.temp_standard_price);
                    promotionApplies = 1;
                    if (prodData.promotion.discount_type == 1) // percentage
                    {
                        promoItem.standard_price = (Number(prodData.standard_price) * Number(prodData.promotion.discount) / 100);
<<<<<<< HEAD
                    }
                    else if (prodData.promotion.discount_type == 2) // value
=======
                    } else if (prodData.promotion.discount_type == 2) // value
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    {
                        // promoItem.standard_price = (Number(prodData.standard_price) - Number(prodData.promotion.discount));
                        promoItem.standard_price = Number(prodData.standard_price) - ((Number(prodData.standard_price) - Number(prodData.promotion.discount)));
                    }
                }
<<<<<<< HEAD
            }
            else if (prodData.promotion.strategy == 2) // Apply Promotion Only and Ignore Any Volume Discount
=======
            } else if (prodData.promotion.strategy == 2) // Apply Promotion Only and Ignore Any Volume Discount
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            {
                promotionApplies = 1;
                prodData.standard_price = Number(prodData.temp_standard_price);
                // apply promotion
                if (prodData.promotion.discount_type == 1) // percentage
                {
                    promoItem.standard_price = (Number(prodData.standard_price) * Number(prodData.promotion.discount) / 100);
<<<<<<< HEAD
                }
                else if (prodData.promotion.discount_type == 2) // value
=======
                } else if (prodData.promotion.discount_type == 2) // value
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                {
                    // promoItem.standard_price = (Number(prodData.standard_price) - Number(prodData.promotion.discount));
                    promoItem.standard_price = Number(prodData.standard_price) - ((Number(prodData.standard_price) - Number(prodData.promotion.discount)));

                }
<<<<<<< HEAD
            }
            else if (prodData.promotion.strategy == 3) // Promotion applies after Volume Discount
=======
            } else if (prodData.promotion.strategy == 3) // Promotion applies after Volume Discount
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            {
                prodData.standard_price = Number(prodData.temp_standard_price);
                promotionApplies = 1;

                // apply volume discount
                if (prodData.arr_volume_discounts != undefined && prodData.arr_volume_discounts.length) {
                    var flg = 0;
                    var discountType = 0;
                    var volumeDiscount = 0;
<<<<<<< HEAD
                    angular.forEach(prodData.arr_volume_discounts, function (obj) {
=======
                    angular.forEach(prodData.arr_volume_discounts, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (Number(prodData.qty) >= Number(obj.min_qty)) {
                            flg = 1;
                            discountType = obj.discount_type;
                            volumeDiscount = obj.volume_discount;
                        }
                    });
                    if (!flg)
                        prodData.standard_price = Number(prodData.price_offer);
                    else {
                        if (discountType == 1) // %
                            prodData.standard_price = parseFloat(prodData.price_offer) - parseFloat(prodData.price_offer) * (parseFloat(volumeDiscount) / 100);
                        else // value
                            prodData.standard_price = parseFloat(prodData.price_offer) - parseFloat(volumeDiscount);
                        prodData.standard_price = Number(prodData.standard_price.toFixed(2));
                        // toaster.pop('warning', 'Info', 'Standard price changed to ' + (String(prodData.standard_price)) + ' from customer price offer');
                    }
                }

                // then apply promotion
                if (prodData.promotion.discount_type == 1) // percentage
                {
                    promoItem.standard_price = (Number(prodData.standard_price) * Number(prodData.promotion.discount) / 100);
<<<<<<< HEAD
                }
                else if (prodData.promotion.discount_type == 2) // value
=======
                } else if (prodData.promotion.discount_type == 2) // value
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                {
                    // promoItem.standard_price = (Number(prodData.standard_price) - Number(prodData.promotion.discount));
                    promoItem.standard_price = Number(prodData.standard_price) - ((Number(prodData.standard_price) - Number(prodData.promotion.discount)));
                }
<<<<<<< HEAD
            }
            else if (prodData.promotion.strategy == 4) // Promotion Applies Before Volume Discount
=======
            } else if (prodData.promotion.strategy == 4) // Promotion Applies Before Volume Discount
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            {
                promotionApplies = 1;
                prodData.standard_price = Number(prodData.temp_standard_price);
                // apply promotion
                if (prodData.promotion.discount_type == 1) // percentage
                {
                    promoItem.standard_price = (Number(prodData.standard_price) * Number(prodData.promotion.discount) / 100);
<<<<<<< HEAD
                }
                else if (prodData.promotion.discount_type == 2) // value
=======
                } else if (prodData.promotion.discount_type == 2) // value
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                {
                    // promoItem.standard_price = (Number(prodData.standard_price) - Number(prodData.promotion.discount));
                    promoItem.standard_price = Number(prodData.standard_price) - ((Number(prodData.standard_price) - Number(prodData.promotion.discount)));
                }
                // then apply volume discount
                if (prodData.arr_volume_discounts != undefined && prodData.arr_volume_discounts.length) {
                    var flg = 0;
                    var discountType = 0;
                    var volumeDiscount = 0;
<<<<<<< HEAD
                    angular.forEach(prodData.arr_volume_discounts, function (obj) {
=======
                    angular.forEach(prodData.arr_volume_discounts, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (Number(prodData.qty) >= Number(obj.min_qty)) {
                            flg = 1;
                            discountType = obj.discount_type;
                            volumeDiscount = obj.volume_discount;
                        }
                    });
                    if (!flg)
                        prodData.standard_price = Number(prodData.price_offer);
                    else {
                        if (discountType == 1) // %
                            prodData.standard_price = parseFloat(prodData.price_offer) - parseFloat(prodData.price_offer) * (parseFloat(volumeDiscount) / 100);
                        else // value
                            prodData.standard_price = parseFloat(prodData.price_offer) - parseFloat(volumeDiscount);
                        prodData.standard_price = Number(prodData.standard_price.toFixed(2));
                        // toaster.pop('warning', 'Info', 'Standard price changed to ' + (String(prodData.standard_price)) + ' from customer price offer');
                    }

                }
            }
<<<<<<< HEAD
        }
        else if (prodData.promotion.strategy_type == 3 && prodData.price_offer != undefined) // Customer specific price
=======
        } else if (prodData.promotion.strategy_type == 3 && prodData.price_offer != undefined) // Customer specific price
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        {
            if (prodData.promotion.strategy == 1) // Volume Discount Applies and Promotion only for Customers without Volume Discount
            {
                if (prodData.price_offer != undefined && prodData.arr_volume_discounts == undefined) {
                    prodData.standard_price = Number(prodData.price_offer);
                    promotionApplies = 1;
                    if (prodData.promotion.discount_type == 1) // percentage
                    {
                        promoItem.standard_price = (Number(prodData.standard_price) * Number(prodData.promotion.discount) / 100);
<<<<<<< HEAD
                    }
                    else if (prodData.promotion.discount_type == 2) // value
=======
                    } else if (prodData.promotion.discount_type == 2) // value
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    {
                        // promoItem.standard_price = (Number(prodData.standard_price) - Number(prodData.promotion.discount));
                        promoItem.standard_price = Number(prodData.standard_price) - ((Number(prodData.standard_price) - Number(prodData.promotion.discount)));
                    }
                }
<<<<<<< HEAD
            }
            else if (prodData.promotion.strategy == 2) // Apply Promotion Only and Ignore Any Volume Discount
=======
            } else if (prodData.promotion.strategy == 2) // Apply Promotion Only and Ignore Any Volume Discount
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            {
                promotionApplies = 1;
                prodData.standard_price = Number(prodData.price_offer);
                // apply promotion
                if (prodData.promotion.discount_type == 1) // percentage
                {
                    promoItem.standard_price = (Number(prodData.standard_price) * Number(prodData.promotion.discount) / 100);
<<<<<<< HEAD
                }
                else if (prodData.promotion.discount_type == 2) // value
=======
                } else if (prodData.promotion.discount_type == 2) // value
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                {
                    // promoItem.standard_price = (Number(prodData.standard_price) - Number(prodData.promotion.discount));
                    promoItem.standard_price = Number(prodData.standard_price) - ((Number(prodData.standard_price) - Number(prodData.promotion.discount)));
                }
<<<<<<< HEAD
            }
            else if (prodData.promotion.strategy == 3) // Promotion applies after Volume Discount
=======
            } else if (prodData.promotion.strategy == 3) // Promotion applies after Volume Discount
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            {
                prodData.standard_price = Number(prodData.price_offer);
                promotionApplies = 1;

                // apply volume discount
                if (prodData.arr_volume_discounts != undefined && prodData.arr_volume_discounts.length) {
                    var flg = 0;
                    var discountType = 0;
                    var volumeDiscount = 0;
<<<<<<< HEAD
                    angular.forEach(prodData.arr_volume_discounts, function (obj) {
=======
                    angular.forEach(prodData.arr_volume_discounts, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (Number(prodData.qty) >= Number(obj.min_qty)) {
                            flg = 1;
                            discountType = obj.discount_type;
                            volumeDiscount = obj.volume_discount;
                        }
                    });
                    if (!flg)
                        prodData.standard_price = Number(prodData.price_offer);
                    else {
                        if (discountType == 1) // %
                            prodData.standard_price = parseFloat(prodData.price_offer) - parseFloat(prodData.price_offer) * (parseFloat(volumeDiscount) / 100);
                        else // value
                            prodData.standard_price = parseFloat(prodData.price_offer) - parseFloat(volumeDiscount);
                        prodData.standard_price = Number(prodData.standard_price.toFixed(2));
                        // toaster.pop('warning', 'Info', 'Standard price changed to ' + (String(prodData.standard_price)) + ' from customer price offer');
                    }
                }

                // then apply promotion
                if (prodData.promotion.discount_type == 1) // percentage
                {
                    promoItem.standard_price = (Number(prodData.standard_price) * Number(prodData.promotion.discount) / 100);
<<<<<<< HEAD
                }
                else if (prodData.promotion.discount_type == 2) // value
=======
                } else if (prodData.promotion.discount_type == 2) // value
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                {
                    // promoItem.standard_price = (Number(prodData.standard_price) - Number(prodData.promotion.discount));
                    promoItem.standard_price = Number(prodData.standard_price) - ((Number(prodData.standard_price) - Number(prodData.promotion.discount)));
                }
<<<<<<< HEAD
            }
            else if (prodData.promotion.strategy == 4) // Promotion Applies Before Volume Discount
=======
            } else if (prodData.promotion.strategy == 4) // Promotion Applies Before Volume Discount
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            {
                promotionApplies = 1;
                prodData.standard_price = Number(prodData.price_offer);

                // apply promotion
                if (prodData.promotion.discount_type == 1) // percentage
                {
                    promoItem.standard_price = (Number(prodData.standard_price) * Number(prodData.promotion.discount) / 100);
<<<<<<< HEAD
                }
                else if (prodData.promotion.discount_type == 2) // value
=======
                } else if (prodData.promotion.discount_type == 2) // value
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                {
                    // promoItem.standard_price = (Number(prodData.standard_price) - Number(prodData.promotion.discount));
                    promoItem.standard_price = Number(prodData.standard_price) - ((Number(prodData.standard_price) - Number(prodData.promotion.discount)));
                }
                // then apply volume discount
                if (prodData.arr_volume_discounts != undefined && prodData.arr_volume_discounts.length) {
                    var flg = 0;
                    var discountType = 0;
                    var volumeDiscount = 0;
<<<<<<< HEAD
                    angular.forEach(prodData.arr_volume_discounts, function (obj) {
=======
                    angular.forEach(prodData.arr_volume_discounts, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (Number(prodData.qty) >= Number(obj.min_qty)) {
                            flg = 1;
                            discountType = obj.discount_type;
                            volumeDiscount = obj.volume_discount;
                        }
                    });
                    if (!flg)
                        prodData.standard_price = Number(prodData.price_offer);
                    else {
                        if (discountType == 1) // %
                            prodData.standard_price = parseFloat(prodData.price_offer) - parseFloat(prodData.price_offer) * (parseFloat(volumeDiscount) / 100);
                        else // value
                            prodData.standard_price = parseFloat(prodData.price_offer) - parseFloat(volumeDiscount);
                        prodData.standard_price = Number(prodData.standard_price.toFixed(2));
                        // toaster.pop('warning', 'Info', 'Standard price changed to ' + (String(prodData.standard_price)) + ' from customer price offer');
                    }

                }
            }
        }

        if (promotionApplies == 1) {
            if (promoItem.update_id == undefined) {
                if ($rootScope.c_currency_id != $rootScope.defaultCurrency)
                    promoItem.standard_price = Math.round(promoItem.standard_price * $scope.rec.currency_rate);

                $scope.items.splice($scope.items.indexOf(prodData) + 1, 0, promoItem);
                // $scope.items.push(promoItem);
            }
<<<<<<< HEAD
        }
        else if (promotionApplies == 0)
=======
        } else if (promotionApplies == 0)
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            prodData.promotion_id = 0;

        return promotionApplies;
    }


<<<<<<< HEAD
    $scope.$on('LoadOderItems', function (e) {
        $scope.load_item_counter = 0;
        $scope.showLoader = true;
        var refreshId = setInterval(function () {
=======
    $scope.$on('LoadOderItems', function(e) {
        $scope.load_item_counter = 0;
        $scope.showLoader = true;
        var refreshId = setInterval(function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (($scope.tempProdArr != undefined && $scope.tempProdArr.length > 0)) {
                $scope.getOrdersDetail(1);
                clearInterval(refreshId);
                $scope.showLoader = false;
            }
            $scope.showLoader = true;
            $scope.load_item_counter += 1;

            if ($scope.load_item_counter > 50) {
<<<<<<< HEAD
                $timeout(function () {
=======
                $timeout(function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    toaster.pop('error', 'Error', 'Server is not responding');
                    $scope.load_item_counter = 0;
                    location.reload(true); // true for clear the cache
                }, 1000);
            }
        }, 500);

        // $scope.$parent.itempromotion = $scope.OnChangeOrderDateUpdatePromotion();
    });


<<<<<<< HEAD
    $scope.$on('OnChangeOrderDateEvent', function (e) {
=======
    $scope.$on('OnChangeOrderDateEvent', function(e) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.$parent.itemsalepromotion = $scope.getItemsSalesPrice(2);
        $scope.$parent.itempromotion = $scope.OnChangeOrderDateUpdatePromotion();
    });

<<<<<<< HEAD
    $scope.$on('OnSavingOrderEvent', function (e, opt) {
         $scope.add_general(opt.rec, opt.rec2, 1); // in case of direct posting only , to save margin analysis

    });

    $scope.$on('OnPostOrderEvent', function (e, opt) {
=======
    $scope.$on('OnSavingOrderEvent', function(e, opt) {
        $scope.add_general(opt.rec, opt.rec2, 1); // in case of direct posting only , to save margin analysis

    });

    $scope.$on('OnPostOrderEvent', function(e, opt) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // if($stateParams.id == undefined) // save margin analysis, was not saving when allocate and directly post
        {
            // $scope.add_general(opt.rec, opt.rec2, void 0, 1); // in case of direct posting only , to save margin analysis
        }

        $scope.convert_post_invoice_org(opt.rec, opt.rec2, opt.queue_for_approval);
    });
<<<<<<< HEAD
    $scope.$on('OnDispatchOrderEvent', function (e, opt) {
=======
    $scope.$on('OnDispatchOrderEvent', function(e, opt) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.dispatchStockOrg();
    });


<<<<<<< HEAD
    $scope.OnChangeOrderDateUpdatePromotion = function () {
        // remove previous items
        var promotions_to_delete = [];
        angular.forEach($scope.items, function (item, index) {
=======
    $scope.OnChangeOrderDateUpdatePromotion = function() {
        // remove previous items
        var promotions_to_delete = [];
        angular.forEach($scope.items, function(item, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (item.ref_prod_id > 0) {
                var update_id = (item.update_id != undefined) ? item.update_id : 0;
                promotions_to_delete.push({ 'index': index, 'id': update_id, 'item_id': item.id });
            }
        });
        if (promotions_to_delete.length > 0) {
            $rootScope.promotion_delete_error_msg = "Some Promotions will be deleted. Do you want to change the order date?";

            ngDialog.openConfirm({
                template: '_confirm_promotion_delete_modal',
                className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
            }).then(function (value) {
=======
            }).then(function(value) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.$root.offer_date = $scope.$parent.rec.offer_date;
                var deleteMultItems = $scope.$root.sales + "customer/order/delete-multiple-order-item";
                var postData = {};
                postData.token = $scope.$root.token;
                var ids = '';
<<<<<<< HEAD
                angular.forEach(promotions_to_delete, function (obj) {
=======
                angular.forEach(promotions_to_delete, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (obj.id > 0)
                        ids += obj.id + ', ';
                });

                postData.delete_ids = ids.slice(0, -2);

                $http
                    .post(deleteMultItems, postData)
<<<<<<< HEAD
                    .then(function (res) {
                        if (res.data.ack == true) {
                            angular.forEach(promotions_to_delete, function (obj) {
=======
                    .then(function(res) {
                        if (res.data.ack == true) {
                            angular.forEach(promotions_to_delete, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (Number(obj.id) > 0) {
                                    var item = $filter("filter")($scope.items, { id: obj.item_id, item_type: 0 });
                                    if (item != undefined && item.length > 0) {
                                        item[0].promotion_id = 0;
                                    }

                                    var item_ = $filter("filter")($scope.items, { update_id: obj.id, item_type: 1 });
                                    if (item_ != undefined && item_.length > 0) {
                                        $scope.items.splice($scope.items.indexOf(item_[0]), 1)
                                    }
                                }
                            });

                            var getpriceOffersUrl = $rootScope.sales + "crm/crm/get-items-promotions-by-custid";
                            $scope.showLoader = true;

                            $scope.price_offer_arr = [];
                            $http
                                .post(getpriceOffersUrl, { 'token': $scope.$root.token, 'crm_id': $scope.$root.crm_id, 'order_date': $scope.rec.offer_date })
<<<<<<< HEAD
                                .then(function (res) {
                                    if (res.data.ack == true) {
                                        $scope.promotions = res.data.response;
                                        angular.forEach($scope.promotions, function (obj) {
=======
                                .then(function(res) {
                                    if (res.data.ack == true) {
                                        $scope.promotions = res.data.response;
                                        angular.forEach($scope.promotions, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                            var item = $filter("filter")($scope.items, { id: obj.product_id });
                                            var idx = $scope.items.indexOf(item[0]);
                                            if (idx != -1) {
                                                $scope.items[idx].promotion = {};
                                                $scope.items[idx].promotion_id = obj.id;
                                                $scope.items[idx].promotion.gl_id = obj.promotion_gl_id;
                                                $scope.items[idx].promotion.gl_code = obj.promotion_gl_code;
                                                $scope.items[idx].promotion.gl_name = obj.promotion_gl_name;
                                                $scope.items[idx].promotion.discount_type = obj.discount_type;
                                                $scope.items[idx].promotion.discount = obj.discount;
                                                $scope.items[idx].promotion.strategy_type = obj.strategy_type;
                                                $scope.items[idx].promotion.strategy = obj.strategy;
                                                $scope.items[idx].promotion.start_date = obj.start_date;
                                                $scope.items[idx].promotion.end_date = obj.end_date;
                                            }
                                        });


<<<<<<< HEAD
                                        angular.forEach($scope.items, function (prodData, index) {
=======
                                        angular.forEach($scope.items, function(prodData, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                            if (prodData.promotion != undefined) {
                                                $scope.acItem = {};

                                                $scope.acItem.ref_prod_id = prodData.update_id;
                                                $scope.acItem.product_id = prodData.promotion.gl_id;
                                                $scope.acItem.id = prodData.promotion.gl_id;
                                                $scope.acItem.product_code = prodData.promotion.gl_code;
                                                $scope.acItem.description = prodData.promotion.gl_name;
                                                $scope.acItem.product_name = prodData.promotion.gl_name;
                                                $scope.acItem.item_type = 1;
                                                $scope.acItem.qty = prodData.qty;

<<<<<<< HEAD
                                                angular.forEach($rootScope.arr_vat_post_grp_sales, function (obj) {
=======
                                                angular.forEach($rootScope.arr_vat_post_grp_sales, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                    if (obj.id == prodData.vat_id) {
                                                        $scope.acItem.vats = obj;
                                                        $scope.acItem.vat_id = obj.id;

                                                    }
                                                });

                                                console.log($rootScope.arr_vat_post_grp_sales);
                                                console.log($scope.acItem.vat_id + ' SELECTED VAT ');

<<<<<<< HEAD
                                                angular.forEach($rootScope.gl_arr_units, function (obj) {
=======
                                                angular.forEach($rootScope.gl_arr_units, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                    if (obj.id == prodData.unit_id)
                                                        $scope.acItem.units = obj;
                                                });

                                                // $scope.items.splice(index, 0, prodData);
                                                $scope.CalculatePromotion(prodData, $scope.acItem);
                                            }
                                        });

                                        if ($scope.items.length > 0) {
                                            var rec2 = {};
                                            $scope.addsublist(rec2);
                                        }
                                    }

                                    $scope.showLoader = false;
                                });
                            /* if ($scope.items.length > 0) {
                               var rec2 = {};
                               $scope.addsublist(rec2);
                           }  */
                        }
                    });
<<<<<<< HEAD
            }, function (reason) {
                $scope.$parent.rec.offer_date = $scope.$root.offer_date;
                console.log('Modal promise rejected. Reason: ', reason);
            });
        }
        else {
=======
            }, function(reason) {
                $scope.$parent.rec.offer_date = $scope.$root.offer_date;
                console.log('Modal promise rejected. Reason: ', reason);
            });
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            var getpriceOffersUrl = $rootScope.sales + "crm/crm/get-items-promotions-by-custid";
            $scope.showLoader = true;
            var promotion_applies = 0;
            $scope.price_offer_arr = [];
            $http
                .post(getpriceOffersUrl, { 'token': $scope.$root.token, 'crm_id': $scope.$root.crm_id, 'order_date': $scope.rec.offer_date })
<<<<<<< HEAD
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.promotions = res.data.response;
                        angular.forEach($scope.promotions, function (obj) {
=======
                .then(function(res) {
                    if (res.data.ack == true) {
                        $scope.promotions = res.data.response;
                        angular.forEach($scope.promotions, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            var item = $filter("filter")($scope.items, { id: obj.product_id });
                            var idx = $scope.items.indexOf(item[0]);
                            if (idx != -1) {
                                $scope.items[idx].promotion = {};
                                $scope.items[idx].promotion_id = obj.id;
                                $scope.items[idx].promotion.gl_id = obj.promotion_gl_id;
                                $scope.items[idx].promotion.gl_code = obj.promotion_gl_code;
                                $scope.items[idx].promotion.gl_name = obj.promotion_gl_name;
                                $scope.items[idx].promotion.discount_type = obj.discount_type;
                                $scope.items[idx].promotion.discount = obj.discount;
                                $scope.items[idx].promotion.strategy_type = obj.strategy_type;
                                $scope.items[idx].promotion.strategy = obj.strategy;
                                $scope.items[idx].promotion.start_date = obj.start_date;
                                $scope.items[idx].promotion.end_date = obj.end_date;
                            }
                        });


<<<<<<< HEAD
                        angular.forEach($scope.items, function (prodData, index) {
=======
                        angular.forEach($scope.items, function(prodData, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (prodData.promotion != undefined) {
                                $scope.acItem = {};

                                $scope.acItem.ref_prod_id = prodData.update_id;
                                $scope.acItem.product_id = prodData.promotion.gl_id;
                                $scope.acItem.id = prodData.promotion.gl_id;
                                $scope.acItem.product_code = prodData.promotion.gl_code;
                                $scope.acItem.description = prodData.promotion.gl_name;
                                $scope.acItem.product_name = prodData.promotion.gl_name;
                                $scope.acItem.item_type = 1;
                                $scope.acItem.qty = prodData.qty;

<<<<<<< HEAD
                                angular.forEach($rootScope.arr_vat_post_grp_sales, function (obj) {
=======
                                angular.forEach($rootScope.arr_vat_post_grp_sales, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    if (obj.id == prodData.vat_id) {
                                        $scope.acItem.vats = obj;
                                        $scope.acItem.vat_id = obj.id;

                                    }
                                });

                                console.log($rootScope.arr_vat_post_grp_sales);
                                console.log($scope.acItem.vat_id + ' SELECTED VAT ');

<<<<<<< HEAD
                                angular.forEach($rootScope.gl_arr_units, function (obj) {
=======
                                angular.forEach($rootScope.gl_arr_units, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    if (obj.id == prodData.unit_id)
                                        $scope.acItem.units = obj;
                                });

                                // $scope.items.splice(index, 0, prodData);
                                promotion_applies = $scope.CalculatePromotion(prodData, $scope.acItem);
                            }
                        });

                        if (promotion_applies > 0) { //$scope.items.length > 0) {
                            var rec2 = {};
                            $scope.addsublist(rec2);
                        }
                    }
                    $scope.showLoader = false;
                });
        }
    }

<<<<<<< HEAD
    $scope.getItemsPricesAndVolumeDiscounts = function () {
=======
    $scope.getItemsPricesAndVolumeDiscounts = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var getItemSalesPriceUrl = $rootScope.sales + "crm/crm/get-items-sale-price";
        // $scope.showLoader = true;
        var item_ids = '';
        var price_offer_item_ids = '';
        if ($scope.items.length > 0) {
<<<<<<< HEAD
            angular.forEach($scope.items, function (obj) {
=======
            angular.forEach($scope.items, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                item_ids += obj.id + ',';
            });
            item_ids = item_ids.substring(0, item_ids.length - 1);
        }

        if (item_ids.length > 0) {
            $http
                .post(getItemSalesPriceUrl, { 'token': $rootScope.token, 'order_date': $scope.rec.offer_date, 'currency_id': $rootScope.c_currency_id, 'item_ids': item_ids })
<<<<<<< HEAD
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.item_sale_price = res.data.response;

                        angular.forEach($scope.item_sale_price, function (obj, index) {
                            var items = $filter("filter")($scope.items, { id: index });

                            angular.forEach(items, function (item) {
=======
                .then(function(res) {
                    if (res.data.ack == true) {
                        $scope.item_sale_price = res.data.response;

                        angular.forEach($scope.item_sale_price, function(obj, index) {
                            var items = $filter("filter")($scope.items, { id: index });

                            angular.forEach(items, function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                var idx = $scope.items.indexOf(item);

                                if (idx != -1) {
                                    item.sales_prices = obj;
                                    // item.standard_price      = Number(obj.standard_price);
                                    item.org_standard_price = Number(obj.standard_price);
                                    item.sales_prices.min_sale_price = Number(obj.min_sale_price);
                                    item.minSaleQty = Number(obj.min_sale_qty);
                                    item.maxSaleQty = Number(obj.max_sale_qty);
                                    if (item.qty < item.sales_prices.min_sale_qty) {
                                        item.qty = Number(item.minSaleQty);
                                        item.prev_qty = Number(item.minSaleQty);
                                    }
                                }
                            });
                        });
<<<<<<< HEAD
                    }
                    else if (res.data.ack == 0) {
                        angular.forEach($scope.items, function (obj) {
=======
                    } else if (res.data.ack == 0) {
                        angular.forEach($scope.items, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (obj.item_type == 0) {
                                obj.sales_prices = {};
                                // obj.standard_price = '';
                                // obj.qty = '';
                                obj.discountType = 0;
                                obj.minSaleQty = 0;
                                obj.maxSaleQty = 0;
                            }
                        });
                    }
                });
        }

    }
<<<<<<< HEAD
    $scope.getItemsSalesPrice = function (flg) {
=======
    $scope.getItemsSalesPrice = function(flg) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // return;
        var getItemSalesPriceUrl = $rootScope.sales + "crm/crm/get-items-sale-price";
        // $scope.showLoader = true;
        var item_ids = '';
        var price_offer_item_ids = '';
        if ($scope.items.length > 0) {
<<<<<<< HEAD
            angular.forEach($scope.items, function (obj) {
=======
            angular.forEach($scope.items, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if ((obj.item_type == 0 && (obj.price_offer == undefined || Number(obj.price_offer) == 0)) || flg == 2)
                    item_ids += obj.id + ',';

                if (obj.item_type == 0 && Number(obj.price_offer) > 0)
                    price_offer_item_ids += obj.id + ',';

            });
            item_ids = item_ids.substring(0, item_ids.length - 1);
            if (item_ids.length > 0) {
                $http
                    .post(getItemSalesPriceUrl, { 'token': $rootScope.token, 'order_date': $scope.rec.offer_date, 'currency_id': $rootScope.c_currency_id, 'item_ids': item_ids })
<<<<<<< HEAD
                    .then(function (res) {
                        if (res.data.ack == true) {
                            $scope.item_sale_price = res.data.response;

                            angular.forEach($scope.items, function (obj) {
=======
                    .then(function(res) {
                        if (res.data.ack == true) {
                            $scope.item_sale_price = res.data.response;

                            angular.forEach($scope.items, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (obj.item_type == 0) {
                                    obj.sales_prices = {};
                                    // obj.standard_price = '';
                                    obj.discountType = 0;
                                    obj.minSaleQty = 0;
                                    obj.maxSaleQty = 0;
                                }
                            });
<<<<<<< HEAD
                            angular.forEach($scope.item_sale_price, function (obj, index) {
                                var items = $filter("filter")($scope.items, { id: index, item_type: 0 });
                                angular.forEach(items, function (item) {
=======
                            angular.forEach($scope.item_sale_price, function(obj, index) {
                                var items = $filter("filter")($scope.items, { id: index, item_type: 0 });
                                angular.forEach(items, function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                                    var idx = $scope.items.indexOf(item);
                                    if (idx != -1) {
                                        item.sales_prices = obj;
                                        // item.standard_price      = Number(obj.standard_price);
                                        item.org_standard_price = Number(obj.standard_price);
                                        item.sales_prices.min_sale_price = Number(obj.min_sale_price);
                                        item.minSaleQty = Number(obj.min_sale_qty);
                                        item.maxSaleQty = Number(obj.max_sale_qty);
                                        if (item.qty < item.sales_prices.min_sale_qty) {
                                            item.qty = Number(item.minSaleQty);
                                            item.prev_qty = Number(item.minSaleQty);
                                        }
                                        if (flg != 1)
                                            $scope.OnBlurQuantity(item, 1);
                                    }
                                });
                            });
<<<<<<< HEAD
                        }
                        else if (res.data.ack == 0) {
                            angular.forEach($scope.items, function (obj) {
=======
                        } else if (res.data.ack == 0) {
                            angular.forEach($scope.items, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (obj.item_type == 0) {
                                    obj.sales_prices = {};
                                    // obj.standard_price = '';
                                    // obj.qty = '';
                                    obj.discountType = 0;
                                    obj.minSaleQty = 0;
                                    obj.maxSaleQty = 0;
                                }
                            });
                        }
                        if (res.data.ack != undefined && flg == 2) {
                            // $scope.OnChangeOrderDateUpdatePromotion();
                        }
                    });
            }
            // if(item_ids.length == 0 && price_offer_item_ids.length > 0) // if only item with price offer
            // we have to call this method in any case there is no price offer but for the current date change there might be 1
            if (flg == 2) {
                $scope.getPriceOffers(2);
            }
        }
    }

<<<<<<< HEAD
    $scope.getItemMarginCost = function (flg) {
=======
    $scope.getItemMarginCost = function(flg) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var getItemMarginCostUrl = $rootScope.sales + "crm/crm/get-items-margin-cost";
        if (flg == undefined)
            $scope.showLoader = true;

        $rootScope.items_original_additional_cost = 0;
        var item_ids = '';
        if ($scope.items.length > 0) {
<<<<<<< HEAD
            angular.forEach($scope.items, function (obj) {
=======
            angular.forEach($scope.items, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (obj.item_type == 0)
                    item_ids += obj.id + ',';
            });
            item_ids = item_ids.substring(0, item_ids.length - 1);
            if (item_ids.length > 0) {

                $http
                    .post(getItemMarginCostUrl, {
                        'token': $rootScope.token,
                        'item_ids': item_ids,
                        'order_id': $rootScope.order_id,
                        'crm_id': $rootScope.crm_id,
                        'order_date': $scope.$parent.rec.offer_date,
                        'currency_id': $rootScope.c_currency_id
                    })
<<<<<<< HEAD
                    .then(function (res) {
                        if (res.data.ack == true) {
                            
=======
                    .then(function(res) {
                        if (res.data.ack == true) {

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            $scope.item_margin_analysis = res.data.response.margin_analysis;
                            $scope.item_purchase_cost = res.data.response.purchase_cost;
                            $scope.item_storage_cost = res.data.response.storage_cost;
                            $scope.items_rebate = res.data.response.items_rebate;
                            $rootScope.items_original_additional_cost = 0;
<<<<<<< HEAD
                            angular.forEach(res.data.response.original_additional_cost, function (obj) {
                                var __item = $filter("filter")($scope.items, { id: obj.item_id });

                                angular.forEach(__item, function (__obj_item) {
=======
                            angular.forEach(res.data.response.original_additional_cost, function(obj) {
                                var __item = $filter("filter")($scope.items, { id: obj.item_id });

                                angular.forEach(__item, function(__obj_item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    __obj_item.item_org_additional_cost = Number(obj.additional_cost) * Number(__obj_item.qty);
                                    $rootScope.items_original_additional_cost += Number(obj.additional_cost) * Number(__obj_item.qty);
                                });
                            });

                            if (res.data.conversion_rate == -1)
                                toaster.pop('warning', 'Warning', 'Currency exchange rate not found for current order date');

                            var MA_exchange_rate = $filter("filter")($scope.item_margin_analysis, { margin_analysis_conversion_rate: -1 });

                            if (MA_exchange_rate.length > 0)
                                toaster.pop('warning', 'Warning', 'Currency exchange rate for all the margin analysis is not set');

                            /* angular.forEach($scope.item_margin_analysis, function (obj, index) {
                                var items = $filter("filter")($scope.items, { id: index, item_type: 0 });
                                angular.forEach(items, function (item) {
                                    var idx = $scope.items.indexOf(item);
                                    if (idx != -1) {
                                        item.margin_analysis = obj;
                                        item.cost = 0;
                                        angular.forEach(item.margin_analysis, function(obj1){
                                            item.cost = item.cost + Number(obj1.amount);
                                        });
                                    }
                                });
                            }); */
                            var items = $filter("filter")($scope.items, { item_type: 0 });
<<<<<<< HEAD
                            angular.forEach(items, function (item) {
=======
                            angular.forEach(items, function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                // margin_analysis
                                item.margin_analysis = ($scope.item_margin_analysis[item.id] != undefined) ? $scope.item_margin_analysis[item.id] : [];
                                item.org_purchase_cost = ($scope.item_purchase_cost[item.id] != undefined) ? $scope.item_purchase_cost[item.id] : 0;
                                item.org_purchase_cost = item.org_purchase_cost;

                                var purchase_cost_analysis = $filter("filter")(item.margin_analysis, { ref_id: 1 });

                                if (purchase_cost_analysis.length > 0)
                                    item.purchase_cost = purchase_cost_analysis[0].amount;
                                else
<<<<<<< HEAD
                                    item.purchase_cost = 0;//item.standard_price;
=======
                                    item.purchase_cost = 0; //item.standard_price;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                                item.storage_cost = ($scope.item_storage_cost[item.update_id] != undefined) ? $scope.item_storage_cost[item.update_id] : 0;
                                item.item_cost = 0;
                                item.item_additional_cost = 0;
<<<<<<< HEAD
                                angular.forEach(item.margin_analysis, function (obj1) {
=======
                                angular.forEach(item.margin_analysis, function(obj1) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    if (obj1.ref_id != 1) // already calculated as purchase cost
                                        item.item_additional_cost = item.item_additional_cost + Number(obj1.amount);
                                });

                                item.item_org_cost = (Number(item.org_purchase_cost) * Number(item.qty)) + Number(item.item_org_additional_cost) + Number(item.storage_cost);
                                item.item_cost = Number(item.item_cost) + Number(item.item_additional_cost) + (Number(item.purchase_cost) * Number(item.qty)) + Number(item.storage_cost);
                                // item.cost = item.cost + Number(item.storage_cost);                                     
                                item.cost = item.item_cost;

                                if ($scope.marginAnalysisView == 0)
                                    item.cost = item.item_org_cost;

                            });

                            var items = $scope.items;

<<<<<<< HEAD
                            angular.forEach(items, function (obj) {
                                obj.rebate = 0;
                            });

                            angular.forEach($scope.items_rebate, function (rebate) {
=======
                            angular.forEach(items, function(obj) {
                                obj.rebate = 0;
                            });

                            angular.forEach($scope.items_rebate, function(rebate) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                // if(rebate.rebate_type == 1) // 1=Universal Rebate for the Customer, 2=Separate Rebate for Categoryies 3=Separate Rebate for Items
                                {
                                    if (rebate.universal_type == 1) //1='Universal Rebate' , 2='Volume Based Rebate', 3= 'Revenue Based Rebate'
                                    {

<<<<<<< HEAD
                                        angular.forEach(items, function (i_item) {
=======
                                        angular.forEach(items, function(i_item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                            i_item.rebate_type += "1,";
                                            i_item.rebate_price_type = rebate.rebate_price_type;
                                            if (rebate.rebate_price_type == 1) // percentage
                                            {
                                                i_item.rebate = i_item.rebate + parseFloat(i_item.standard_price) * (parseFloat(rebate.rebate_price) / 100);
                                                // i_item.cost     = parseFloat(i_item.cost) - parseFloat(i_item.rebate);
<<<<<<< HEAD
                                            }
                                            else if (rebate.rebate_price_type == 2) // value
=======
                                            } else if (rebate.rebate_price_type == 2) // value
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                            {
                                                i_item.rebate = i_item.rebate + parseFloat(rebate.rebate_price);
                                                // i_item.cost = parseFloat(i_item.cost) - parseFloat(i_item.rebate);
                                            }
                                        });
<<<<<<< HEAD
                                    }
                                    else if (rebate.universal_type == 2) {
                                        if (rebate.items_rebate.ack == 1) {
                                            angular.forEach(rebate.items_rebate.response, function (obj1) {
                                                var included_item = $filter("filter")(items, { id: obj1.id });
                                                if (included_item.length > 0) {
                                                    angular.forEach(included_item, function (i_item) {
                                                        i_item.rebate_type += "2,";
                                                        var rebate_type = rebate.universal_type;
                                                        var rebate_val = 0;
                                                        angular.forEach(rebate.revenue_volume_rebate, function (obj2) {
=======
                                    } else if (rebate.universal_type == 2) {
                                        if (rebate.items_rebate.ack == 1) {
                                            angular.forEach(rebate.items_rebate.response, function(obj1) {
                                                var included_item = $filter("filter")(items, { id: obj1.id });
                                                if (included_item.length > 0) {
                                                    angular.forEach(included_item, function(i_item) {
                                                        i_item.rebate_type += "2,";
                                                        var rebate_type = rebate.universal_type;
                                                        var rebate_val = 0;
                                                        angular.forEach(rebate.revenue_volume_rebate, function(obj2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                            if (Number(i_item.qty) >= Number(obj2.revenue_volume_from)) {
                                                                // rebate_type = obj2.rebate_type;
                                                                rebate_val = obj2.rebate;
                                                            }
                                                        });
                                                        if (rebate_type == 1) {
                                                            i_item.rebate = i_item.rebate + parseFloat(i_item.standard_price) * (parseFloat(rebate_val) / 100);
                                                            // i_item.cost     = parseFloat(i_item.cost) - parseFloat(i_item.rebate);
<<<<<<< HEAD
                                                        }
                                                        else if (rebate_type == 2) {
=======
                                                        } else if (rebate_type == 2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                            i_item.rebate = i_item.rebate + parseFloat(rebate_val);
                                                            // i_item.cost = parseFloat(i_item.cost) - parseFloat(i_item.rebate);
                                                        }
                                                    });

                                                }
                                            });
                                        }
<<<<<<< HEAD
                                    }
                                    else if (rebate.universal_type == 3) {
                                        angular.forEach(rebate.items_rebate.response, function (obj1) {
                                            var included_item = $filter("filter")(items, { id: obj1.id });
                                            if (included_item.length > 0) {
                                                angular.forEach(included_item, function (i_item) {
                                                    i_item.rebate_type += "3,";
                                                    var rebate_type = 0;
                                                    var rebate_val = 0;
                                                    angular.forEach(rebate.revenue_volume_rebate, function (obj2) {
=======
                                    } else if (rebate.universal_type == 3) {
                                        angular.forEach(rebate.items_rebate.response, function(obj1) {
                                            var included_item = $filter("filter")(items, { id: obj1.id });
                                            if (included_item.length > 0) {
                                                angular.forEach(included_item, function(i_item) {
                                                    i_item.rebate_type += "3,";
                                                    var rebate_type = 0;
                                                    var rebate_val = 0;
                                                    angular.forEach(rebate.revenue_volume_rebate, function(obj2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                        if (Number(i_item.total_price) >= Number(obj2.revenue_volume_from)) {
                                                            rebate_type = obj2.universal_type;
                                                            rebate_val = obj2.rebate;
                                                        }
                                                    });
                                                    if (rebate_type == 1) {
                                                        i_item.rebate = i_item.rebate + parseFloat(i_item.standard_price) * (parseFloat(rebate_val) / 100);
                                                        // i_item.cost     = parseFloat(i_item.cost) - parseFloat(i_item.rebate);
<<<<<<< HEAD
                                                    }
                                                    else if (rebate_type == 2) {
=======
                                                    } else if (rebate_type == 2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                        i_item.rebate = i_item.rebate + parseFloat(rebate_val);
                                                        // i_item.cost     = parseFloat(i_item.cost) - parseFloat(i_item.rebate);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                                /* else if(rebate.rebate_type == 2)
                                {
                                    if(rebate.categories_rebate.ack == 1)
                                    {
                                        angular.forEach(rebate.categories_rebate.response, function (obj1){
                                            var included_item = $filter("filter")(items, { category_id: obj1.category_id });
                                            if(included_item.length > 0)
                                            {
                                                angular.forEach(included_item, function(i_item){
                                                    // i_item.rebate_type = 2;
                                                    i_item.rebate_type += "2,"
                                                    if(rebate.rebate_price_type == 1) // percentage
                                                    {
                                                        i_item.rebate   = i_item.rebate + parseFloat(i_item.standard_price) * (parseFloat(rebate.rebate_price) / 100);
                                                        // i_item.cost     = parseFloat(i_item.cost) - parseFloat(i_item.rebate);
                                                    }
                                                    else if(rebate.rebate_price_type == 2) // value
                                                    {
                                                        i_item.rebate = i_item.rebate + parseFloat(rebate.rebate_price);
                                                        // i_item.cost = parseFloat(i_item.cost) - parseFloat(i_item.rebate);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                                else if(rebate.rebate_type == 3)
                                {
                                    if(rebate.items_rebate.ack == 1)
                                    {
                                        angular.forEach(rebate.items_rebate.response, function (obj1){
                                            var included_item = $filter("filter")(items, { id: obj1.item_id });
                                            if(included_item.length > 0)
                                            {
                                                angular.forEach(included_item, function(i_item){
                                                    // i_item.rebate_type = 3;
                                                    i_item.rebate_type += "3,"
                                                    if(rebate.rebate_price_type == 1) // percentage
                                                    {
                                                        i_item.rebate = i_item.rebate + parseFloat(i_item.standard_price) * (parseFloat(rebate.rebate_price) / 100);
                                                        // i_item.cost = parseFloat(i_item.cost) - parseFloat(i_item.rebate);
                                                    }
                                                    else if(rebate.rebate_price_type == 2) // value
                                                    {
                                                        i_item.rebate = i_item.rebate + parseFloat(rebate.rebate_price);
                                                        // i_item.cost = parseFloat(i_item.cost) - parseFloat(i_item.rebate);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                } */
                            });
                        }
                        $scope.waitFormarginAnalysis = false;
                    });
            }
        }
    }
<<<<<<< HEAD
    $scope.clearPendingOrderItems = function () {
=======
    $scope.clearPendingOrderItems = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.PendingSelectedOrderItems = [];
        angular.element('#productModal').modal('hide');
    }
    $scope.selectedRecFromModalsItem = [];
<<<<<<< HEAD
    $scope.addProduct = function () {

        if ($scope.item_type == 0) {
            var finUrl = $scope.$root.sales + "customer/customer/get-customer-finance";//get-finance-by-customer-id";
=======
    $scope.addProduct = function() {

        if ($scope.item_type == 0) {
            var finUrl = $scope.$root.sales + "customer/customer/get-customer-finance"; //get-finance-by-customer-id";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            //console.log($scope.rec.sell_to_cust_id );
            //console.log($scope.$root.crm_id);
            //console.log($scope.rec.bill_to_cust_id);
            $scope.hide_dispatch_btn = false;
            $http
                .post(finUrl, { 'customer_id': $scope.$root.crm_id, token: $rootScope.token })
<<<<<<< HEAD
                .then(function (res) {
                    if (res.data.ack == true) {
                    }
                    else {
=======
                .then(function(res) {
                    if (res.data.ack == true) {} else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(505));
                        return;
                    }
                });
            // console.log($scope.tempProdArr);
            // console.log($scope.products);
            var selected_products = $filter("filter")($scope.itemTableData.data, { chk: true });
<<<<<<< HEAD
            angular.forEach($scope.selectedRecFromModalsItem, function (obj, key) {
=======
            angular.forEach($scope.selectedRecFromModalsItem, function(obj, key) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (obj) {
                    key = obj.key;
                    var item = obj.record;
                    // var item = $filter("filter")($scope.productsArr, { id: key }, true);

                    var prodData = item;

                    var temp_item = $filter("filter")($scope.tempProdArr, { id: key }, true);
                    if (temp_item.length == 0)
                        $scope.tempProdArr.push(prodData);


                    // if (prodData.chk == true) 
                    {
                        if ($scope.$root.crm_id == 0) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Customer No.']));

                            $scope.$root.return_status = false;
                            return;
                        }

                        prodData.rebate_type = '';
                        prodData.rebate = 0;

                        prodData.standard_price_lcy = Number(prodData.standard_price);
                        prodData.standard_price = Number(prodData.standard_price) * Number($scope.rec.currency_rate);
                        prodData.temp_standard_price = Number(prodData.standard_price);
                        prodData.minSaleQty = Number(prodData.sales_prices.min_sale_qty);
                        prodData.maxSaleQty = Number(prodData.sales_prices.max_sale_qty);
                        prodData.org_standard_price_lcy = Number(prodData.sales_prices.standard_price);
                        prodData.org_standard_price = Number(prodData.sales_prices.standard_price) * Number($scope.rec.currency_rate);
                        prodData.temp_standard_price = Number(prodData.sales_prices.standard_price) * Number($scope.rec.currency_rate);

<<<<<<< HEAD
                        if (prodData.sales_prices != undefined) {// && prodData.sales_prices.ack != undefined && prodData.sales_prices.ack == 1) {
=======
                        if (prodData.sales_prices != undefined) { // && prodData.sales_prices.ack != undefined && prodData.sales_prices.ack == 1) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            prodData.sales_prices = prodData.sales_prices;
                            prodData.org_standard_price_lcy = Number(prodData.sales_prices.standard_price);
                            prodData.org_standard_price = Number(prodData.sales_prices.standard_price) * Number($scope.rec.currency_rate);
                            prodData.temp_standard_price = Number(prodData.sales_prices.standard_price) * Number($scope.rec.currency_rate);
                            prodData.minSaleQty = Number(prodData.sales_prices.min_sale_qty);
                            prodData.maxSaleQty = Number(prodData.sales_prices.max_sale_qty);

                            if (!(prodData.sales_prices.arr_sales_price != undefined && prodData.sales_prices.arr_sales_price.length > 0))
                                prodData.sales_prices.arr_sales_price = [];
<<<<<<< HEAD
                        }
                        else {
=======
                        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            prodData.sales_prices = {};
                            prodData.sales_prices.arr_sales_price = [];
                        }

                        prodData.standard_price_lcy = Number(prodData.price_offer) > 0 ? Number(prodData.price_offer) / Number($scope.rec.currency_rate) : Number(prodData.standard_price_lcy);
                        prodData.standard_price = Number(prodData.price_offer) > 0 ? Number(prodData.price_offer) : Number(prodData.standard_price);
                        prodData.org_standard_price_lcy = Number(prodData.price_offer) > 0 ? Number(prodData.price_offer) / Number($scope.rec.currency_rate) : Number(prodData.standard_price_lcy); // for backup
                        prodData.org_standard_price = Number(prodData.price_offer) > 0 ? Number(prodData.price_offer) : Number(prodData.standard_price); // for backup

                        /* if (prodData.sales_prices != undefined && prodData.sales_prices.arr_sales_price.length > 0) {
                            prodData.sales_prices.arr_sales_price = prodData.sales_prices.arr_sales_price;
                        }
                        else  {
                            prodData.sales_prices.arr_sales_price = [];
                        } */

                        prodData.ec_goods = $scope.ec_goods_list[0];
                        prodData.ec_description = $scope.ec_description_list[0];
                        prodData.qty = (Number(prodData.minSaleQty) > 0) ? Number(prodData.minSaleQty) : 1;
                        prodData.prev_qty = (Number(prodData.minSaleQty) > 0) ? Number(prodData.minSaleQty) : 1;
                        prodData.item_type = $scope.item_type;
                        prodData.vat = '';
                        prodData.vat_value = '';
                        prodData.vat_id = '';
                        prodData.allocated_stock = 0;
<<<<<<< HEAD
                        angular.forEach($rootScope.arr_vat_post_grp_sales, function (obj) {
=======
                        angular.forEach($rootScope.arr_vat_post_grp_sales, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (obj.id == prodData.vat_rate_id) {
                                prodData.vat = obj.name;
                                prodData.vat_value = obj.vat_value;
                                prodData.vat_id = obj.id;
                                prodData.vats = obj;
                            }
                        });

                        prodData.sale_unit_id = prodData.unit_id;
                        prodData.purchase_unit_id = prodData.purchase_measure;
                        if (prodData.arr_units.response != undefined) {
                            prodData.arr_units = prodData.arr_units.response;
                            prodData.units = prodData.arr_units[0];
                        }

<<<<<<< HEAD
                        angular.forEach($scope.arr_discount_type, function (obj) {
=======
                        angular.forEach($scope.arr_discount_type, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (obj.id == prodData.discount_type)
                                prodData.discount_type_id = obj;
                        });
                        /* angular.forEach($rootScope.arr_vat_post_grp_sales, function (obj) {
                            if (obj.id == prodData.vat_id)
                            {
                                prodData.vats = obj;
                                prodData.vat_id = obj.id;
                            }
                        }); */

                        console.log($rootScope.arr_vat_post_grp_sales);
                        console.log(prodData.vat_id + ' SELECTED VAT ');


                        if (prodData.arr_warehouse != undefined && $scope.rec.type2 != 0) {
                            var default_wh = 0;
                            if (prodData.arr_warehouse.default_wh != undefined)
                                default_wh = prodData.arr_warehouse.default_wh;
                            prodData.arr_warehouse = prodData.arr_warehouse.response;

                            if (default_wh > 0) {
                                // if(prodData.qty < prodData.arr_warehouse[default_wh].)

                                var wh = $filter("filter")(prodData.arr_warehouse, { id: default_wh });
                                if (wh.length > 0 && wh[0].available_quantity >= prodData.qty) {
                                    prodData.warehouses = default_wh;
                                    prodData.warehouse_name = wh[0].name;
                                }
<<<<<<< HEAD
                            }
                            else if (prodData.arr_warehouse.length == 1 && prodData.arr_warehouse[0].available_quantity >= prodData.qty) {
=======
                            } else if (prodData.arr_warehouse.length == 1 && prodData.arr_warehouse[0].available_quantity >= prodData.qty) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                prodData.warehouses = prodData.arr_warehouse[0].id;
                                prodData.warehouse_name = prodData.arr_warehouse[0].name;

                            }

                            var in_active_wh = $filter("filter")(prodData.arr_warehouse, { wh_status: 2 });
                            if (in_active_wh != undefined && in_active_wh.length > 0)
<<<<<<< HEAD
                                angular.forEach(in_active_wh, function (obj) {
=======
                                angular.forEach(in_active_wh, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    var idx = prodData.arr_warehouse.indexOf(obj);
                                    if (idx != -1) {
                                        // check for previously exist in order
                                        var isExist = 0;
                                        if ($scope.items.length > 0) {
                                            var in_active_wh = $filter("filter")($scope.items, { warehouses: obj.id });
                                            if (in_active_wh != undefined && in_active_wh.length > 0)
                                                isExist = 1;
                                        }
                                        if (isExist == 0)
                                            prodData.arr_warehouse.splice(idx, 1);
                                        else
                                            detail.arr_warehouse[idx].disabled = 1;
                                    }
                                });

<<<<<<< HEAD
                        }
                        else
=======
                        } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            prodData.arr_warehouse = [];

                        /* angular.forEach($scope.items, function (obj) {
                            if (obj.id == prodData.id) {
                                // var item = $filter("filter")(prodData.arr_warehouse, { id: obj.warehouses.id });
                                var item = $filter("filter")(prodData.arr_warehouse, { id: obj.warehouses });
                                if(item.length > 0)
                                {
                                    var idx = prodData.arr_warehouse.indexOf(item[0]);
                                    if (idx != -1)
                                        prodData.arr_warehouse[idx].disabled = true;
                                }
                            }
                        }); */

                        var count = $scope.items.length - 1;
                        prodData.primary_unit_of_measure_id = prodData.unit_id;
                        prodData.primary_unit_of_measure_name = prodData.unit_of_measure_name;


                        prodData.stock_check = prodData.stock_check;
                        prodData.rawMaterialProduct = prodData.rawMaterialProduct;
                        prodData.raw_material_gl_id = prodData.raw_material_gl_id;
                        prodData.raw_material_gl_code = prodData.raw_material_gl_code;
                        prodData.raw_material_gl_name = prodData.raw_material_gl_name;

                        if (prodData.arr_volume_discounts != undefined) {
                            prodData.arr_volume_discounts = prodData.arr_volume_discounts;
                        }

                        // $scope.items.push(prodData);

                        // check for promotions
                        if (prodData.promotion != undefined) {
                            $scope.acItem = {};

                            $scope.acItem.ref_prod_id = prodData.id; // before inserting the actual update id of item will be assigned while inserting 
                            $scope.acItem.product_id = prodData.promotion.gl_id;
                            $scope.acItem.id = prodData.promotion.gl_id;
                            $scope.acItem.product_code = prodData.promotion.gl_code;
                            $scope.acItem.description = prodData.promotion.gl_name;
                            $scope.acItem.product_name = prodData.promotion.gl_name;
                            $scope.acItem.item_type = 1;
                            $scope.acItem.qty = prodData.qty;

                            /* if(prodData.promotion.discount_type == 1 ) // percentage
                            {
                                $scope.acItem.standard_price = (Number(prodData.standard_price) * Number(prodData.promotion.discount) /100 );
                            }  
                            else if(prodData.promotion.discount_type == 2 ) // value
                            {
                                $scope.acItem.standard_price = (Number(prodData.standard_price) - Number(prodData.promotion.discount));
                            } */

<<<<<<< HEAD
                            angular.forEach($rootScope.arr_vat_post_grp_sales, function (obj) {
=======
                            angular.forEach($rootScope.arr_vat_post_grp_sales, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (obj.id == prodData.vat_id) {
                                    $scope.acItem.vats = obj;
                                    $scope.acItem.vat_id = obj.id;

                                }
                            });

                            console.log($rootScope.arr_vat_post_grp_sales);
                            console.log($scope.acItem.vat_id + ' SELECTED VAT ');

<<<<<<< HEAD
                            angular.forEach($rootScope.gl_arr_units, function (obj) {
=======
                            angular.forEach($rootScope.gl_arr_units, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (obj.id == prodData.unit_id)
                                    $scope.acItem.units = obj;
                            });

                            $scope.items.push(prodData);

                            $scope.CalculatePromotion(prodData, $scope.acItem);
<<<<<<< HEAD
                        }
                        else
                            $scope.items.push(prodData);

                        angular.forEach($scope.items, function (obj) {
=======
                        } else
                            $scope.items.push(prodData);

                        angular.forEach($scope.items, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (prodData.id == obj.id) {
                                obj.arr_warehouse = prodData.arr_warehouse;
                            }
                        });
                        /* var item = $filter("filter")($scope.items, { id: prodData.id });
                        var idx = $scope.items.indexOf(item[0]);
                        if (idx == -1) {
                            $scope.items.push(prodData);
                        }  */

                        $scope.$root.return_status = true;
                    }
                }
            });
            $scope.$emit('SalesLines', $scope.items);
            //if($scope.$root.return_status == true)

            var item = $filter("filter")($scope.items, { item_type: 0, stock_check: 1 });
            if (item != undefined && item.length) {
                $scope.show_btn_dispatch_stuff = true;
<<<<<<< HEAD
            }
            else
=======
            } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.show_btn_dispatch_stuff = false;

            var rec2 = {};
            $scope.addsublist(rec2);
            angular.element('#productModal').modal('hide');
<<<<<<< HEAD
        }
        else if ($scope.item_type == 2) {

            $.each($scope.products, function (index, prodData) {
=======
        } else if ($scope.item_type == 2) {

            $.each($scope.products, function(index, prodData) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (prodData.chk == true) {
                    if ($scope.$root.crm_id == 0) {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Customer No.']));
                        //return false;
                        $scope.$root.return_status = false;
                    }


                    prodData.item_type = $scope.item_type;

<<<<<<< HEAD
                    var finApi = $scope.$root.sales + "customer/customer/get-customer-finance";//get-finance-by-customer-id";
                    $http
                        .post(finApi, { 'customer_id': $scope.$root.crm_id, token: $rootScope.token })
                        .then(function (res) {
=======
                    var finApi = $scope.$root.sales + "customer/customer/get-customer-finance"; //get-finance-by-customer-id";
                    $http
                        .post(finApi, { 'customer_id': $scope.$root.crm_id, token: $rootScope.token })
                        .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (res.data.ack == true) {
                                /*if(res.data.response.vat_bus_posting_group == undefined){
                                 toaster.pop('error','Error','Vat Bus. Posting Group is not defined!');
                                 $scope.$root.return_status = false;
                                 }
                                 else if(prodData.v_product_positing == undefined){
                                 toaster.pop('error','Error','Vat Prod. Posting Group is not defined!');
                                 $scope.$root.return_status = false;
                                 }
                                 else{*/
                                var vatApi = $scope.$root.setup + "ledger-group/get-vat";
                                $http
                                    .post(vatApi, { token: $rootScope.token, 'id': prodData.vat_rate_id })
<<<<<<< HEAD
                                    .then(function (vtData) {
=======
                                    .then(function(vtData) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


                                        var catUnit = $scope.$root.setup + "service/cat-unit/get-cat-unit-by-cat-nd-unit_id";
                                        $http
                                            .post(catUnit, {
                                                'item_id': prodData.category_id,
                                                'unit_id': prodData.unit_id,
                                                token: $rootScope.token
                                            })
<<<<<<< HEAD
                                            .then(function (cumData) {
=======
                                            .then(function(cumData) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                if (cumData.data.ack != true) {
                                                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(575, [prodData.description]));

                                                    $scope.$root.return_status = false;
                                                    //return false;
<<<<<<< HEAD
                                                }
                                                else {
                                                    var umUrl = $scope.$root.setup + "service/unit-measure/get-unit";
                                                    $http
                                                        .post(umUrl, { id: prodData.unit_id, token: $rootScope.token })
                                                        .then(function (umData) {
=======
                                                } else {
                                                    var umUrl = $scope.$root.setup + "service/unit-measure/get-unit";
                                                    $http
                                                        .post(umUrl, { id: prodData.unit_id, token: $rootScope.token })
                                                        .then(function(umData) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                            if (umData.data.ack != true) {
                                                                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(576, [prodData.description]));
                                                                $scope.$root.return_status = false;
                                                                //return false;
<<<<<<< HEAD
                                                            }
                                                            else {
=======
                                                            } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                                if (umData.data.response.parent_id !== '0') {
                                                                    $http
                                                                        .post(catUnit, {
                                                                            'category_id': prodData.category_id,
                                                                            'unit_id': umData.data.response.parent_id,
                                                                            token: $rootScope.token
                                                                        })
<<<<<<< HEAD
                                                                        .then(function (c2umData) {
=======
                                                                        .then(function(c2umData) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                                            if (c2umData.data.ack != true) {
                                                                                toaster.pop('error', 'Error2', $scope.$root.getErrorMessageByCode(577, [prodData.description]));
                                                                                $scope.$root.return_status = false;
                                                                                //return false;

<<<<<<< HEAD
                                                                            }
                                                                            else
                                                                                prodData.sale_unit_qty = c2umData.data.response.value;
                                                                        });
                                                                }
                                                                else {
=======
                                                                            } else
                                                                                prodData.sale_unit_qty = c2umData.data.response.value;
                                                                        });
                                                                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                                    prodData.sale_unit_qty = cumData.data.response.value;

                                                                }
                                                            }

                                                            //$timeout(function(){
                                                            /*console.log('chec2==>>'+$scope.$root.return_status);
                                                             if($scope.$root.return_status == false){
                                                             return false;
                                                             }*/
                                                            prodData.product_code = prodData.code;
                                                            prodData.vat = vtData.data.response != undefined ? vtData.data.response.vat_name : '';
                                                            prodData.vat_value = vtData.data.response != undefined ? vtData.data.response.vat_value : 0;
                                                            prodData.vat_id = vtData.data.response != undefined ? vtData.data.response.id : 0;
                                                            prodData.qty = 1;
                                                            prodData.prev_qty = 1;
                                                            prodData.sale_unit_id = prodData.unit_id;
                                                            prodData.purchase_unit_id = prodData.purchase_measure;
                                                            prodData.unit_parent = umData.data.response.parent_id;

<<<<<<< HEAD
                                                            angular.forEach($rootScope.arr_vat_post_grp_sales, function (obj) {
=======
                                                            angular.forEach($rootScope.arr_vat_post_grp_sales, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                                if (obj.id == prodData.vat_id) {
                                                                    prodData.vats = obj;
                                                                    prodData.vat_id = obj.id;
                                                                }
                                                            });

                                                            console.log($rootScope.arr_vat_post_grp_sales);
                                                            console.log(prodData.vat_id + ' SELECTED VAT ');

<<<<<<< HEAD
                                                            $.each($scope.arr_units, function (index, obj) {
=======
                                                            $.each($scope.arr_units, function(index, obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                                if (obj.id == prodData.sale_unit_id)
                                                                    prodData.units = obj;
                                                            });

                                                            /*var umUrl = $scope.$root.stock+"unit-measure/get-unit";
                                                             $http
                                                             .post(umUrl, {customer_id:$scope.$root.crm_id,product_id:prodData.id,token:$rootScope.token})
                                                             .then(function (promoData) {
                                                             if(promoData.data.ack == true){
                                                             console.log('add promotion record');
                                                             }
                                                             else
                                                             console.log('no promotion record');
                                                             });*/

                                                            $scope.items.push(prodData);

                                                            $scope.$root.return_status = true;
                                                            //},1000);

                                                        });

                                                }
                                            });

                                        //}
                                    });

                                //}
<<<<<<< HEAD
                            }
                            else {
=======
                            } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(505));
                            }
                        });
                }
            });
            $scope.$emit('SalesLines', $scope.items);
            //if($scope.$root.return_status == true)
            angular.element('#serviceModal').modal('hide');

<<<<<<< HEAD
        }
        else {
=======
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            var acItem = {};
            if (prodData.account_type != 1) {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(506));
                return false;
            }
            var accUrl = $scope.$root.setup + "ledger-group/get-ledger-posting";
            $http
                .post(accUrl, {
<<<<<<< HEAD
                    'account': prodData.number, 'order_type': prodData.account_type, token: $rootScope.token
                })
                .then(function (acData) {
                    if (acData.data.ack == false) {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                        $scope.$root.return_status = false;
                    }
                    else {
=======
                    'account': prodData.number,
                    'order_type': prodData.account_type,
                    token: $rootScope.token
                })
                .then(function(acData) {
                    if (acData.data.ack == false) {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                        $scope.$root.return_status = false;
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        var ledgEntryUrl = $scope.$root.setup + "ledger-group/get-general-ledger-entry";
                        $http
                            .post(ledgEntryUrl, {
                                'business_posting_title': acData.result.vat_bus_posting,
                                'product_posting_title': acData.result.vat_prod_posting,
                                token: $rootScope.token
                            })
<<<<<<< HEAD
                            .then(function (gData) {
                                if (gData.data.ack == false) {
                                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                                    $scope.$root.return_status = false;
                                }
                                else {
=======
                            .then(function(gData) {
                                if (gData.data.ack == false) {
                                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                                    $scope.$root.return_status = false;
                                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                                    var vatsetpUrl = $scope.$root.setup + "ledger-group/get-account-head";
                                    $http
                                        .post(vatsetpUrl, {
                                            'customer': gData.result.business_posting,
                                            'product': gData.result.product_posting,
                                            token: $rootScope.token
                                        })
<<<<<<< HEAD
                                        .then(function (vtData) {
                                            if (gData.data.ack == false) {
                                                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['VAT']));
                                                $scope.$root.return_status = false;
                                            }
                                            else {
=======
                                        .then(function(vtData) {
                                            if (gData.data.ack == false) {
                                                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['VAT']));
                                                $scope.$root.return_status = false;
                                            } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                                                var vatsetpUrl = $scope.$root.setup + "ledger-group/get-account-head";
                                                $http
                                                    .post(vatsetpUrl, {
                                                        'number': prodData.number,
                                                        'account_type': 'Posting',
                                                        token: $rootScope.token
                                                    })
<<<<<<< HEAD
                                                    .then(function (acHead) {
=======
                                                    .then(function(acHead) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                        acItem.Code = prodData.number;
                                                        acItem.Description = acHead.data.response.name;
                                                        acItem.item_type = $scope.item_type;
                                                        acItem.qty = 1;
                                                        acItem.Price = 0;
                                                        acItem.Vat = vtData.data.response.vat;
                                                        $scope.items.push(acItem);
                                                        $scope.$root.return_status = true;
                                                    });
                                            }
                                        });
                                }
                            });
                    }

                });

        }

        /*$timeout(function(){
         return $scope.$root.return_status;
         },2000);*/

        $scope.rec.item_types = $scope.arrItems[0];
    }

<<<<<<< HEAD
    $scope.add_gl_account_values = function (gl_data) {
=======
    $scope.add_gl_account_values = function(gl_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if ($scope.$root.crm_id == 0) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Customer No.']));
            $scope.$root.return_status = false;
            return;
        }


<<<<<<< HEAD
        var finUrl = $scope.$root.sales + "customer/customer/get-customer-finance";//get-finance-by-customer-id";
=======
        var finUrl = $scope.$root.sales + "customer/customer/get-customer-finance"; //get-finance-by-customer-id";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        //console.log($scope.rec.sell_to_cust_id );
        //console.log($scope.$root.crm_id);
        //console.log($scope.rec.bill_to_cust_id);
        $http
            .post(finUrl, { 'customer_id': $scope.$root.crm_id, token: $rootScope.token })
<<<<<<< HEAD
            .then(function (res) {
                if (res.data.ack == true) {
                    //console.log("heee");
                }
                else {
=======
            .then(function(res) {
                if (res.data.ack == true) {
                    //console.log("heee");
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(505));
                    return;
                }
            });

<<<<<<< HEAD
        angular.forEach($scope.gl_account, function (gl_data) {
=======
        angular.forEach($scope.gl_account, function(gl_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            if (gl_data.chk == true) {

                // console.log(gl_data);

                $scope.acItem = {};
                $scope.acItem.product_id = gl_data.id;
                $scope.acItem.id = gl_data.id;
                $scope.acItem.product_code = gl_data.code;
                $scope.acItem.description = gl_data.name;
                $scope.acItem.product_name = gl_data.name;
                $scope.acItem.item_type = 1;
                $scope.acItem.qty = "";
                $scope.acItem.Price = "";
                $scope.acItem.ec_goods = $scope.ec_goods_list[0];
                $scope.acItem.ec_description = $scope.ec_description_list[0];

                if (gl_data.vat_id == 1 || gl_data.vat_id == 2 || gl_data.vat_id == 3 || gl_data.vat_id == 4) {
                    $scope.acItem.vats = $rootScope.arr_vat[gl_data.vat_id - 1];
                    $scope.acItem.vat_id = $rootScope.arr_vat[gl_data.vat_id - 1].id;
<<<<<<< HEAD
                }
                else {
                    angular.forEach($rootScope.arr_vat, function (obj) {
=======
                } else {
                    angular.forEach($rootScope.arr_vat, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (obj.id == gl_data.vat_id) {
                            $scope.acItem.vats = obj;
                            $scope.acItem.vat_id = obj.id;

                        }
                    });
                }

<<<<<<< HEAD
                angular.forEach($rootScope.gl_arr_units, function (obj) {
=======
                angular.forEach($rootScope.gl_arr_units, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (obj.id == gl_data.ref_id)
                        $scope.acItem.units = obj;
                });

                $scope.items.push($scope.acItem);
            }
        });

        var rec2 = {};
        $scope.addsublist(rec2);
        angular.element('#accthead_modal').modal('hide');
        // gl_data.id;
        /* console.log(gl_data.code);
         console.log(gl_data.name);*/

        /* $scope.acItem = {};
        $scope.acItem.product_id = gl_data.id;
        $scope.acItem.id = gl_data.id;
        $scope.acItem.product_code = gl_data.code;
        $scope.acItem.description = gl_data.name;
        $scope.acItem.product_name = gl_data.name;
        $scope.acItem.item_type = 1;
        $scope.acItem.qty = 1;
        $scope.acItem.Price = "";
        //$scope.acItem.arr_vat = "";


        angular.forEach($rootScope.arr_vat_post_grp_sales, function (obj) {
            if (obj.id == gl_data.vat_id)
                $scope.acItem.vats = obj;
        });

        $scope.items.push($scope.acItem);

        $scope.show_recieve_list = false;
        angular.element('#accthead_modal').modal('hide');

        $scope.rec.item_types = $scope.arrItems[0]; */
        /*var gl_table="";
         
         var DetailsURL = $scope.$root.gl + "chart-accounts/get-account-heads";
         $http
         .post(DetailsURL, {'token': $scope.$root.token, 'gl_id': id})
         .then(function (res) {
         if (res.data.ack == true) {
         
         $scope.acItem = {};
         $scope.acItem.product_code = res.data.response.number;
         $scope.acItem.description = res.data.response.name;
         $scope.acItem.item_type = 1;
         $scope.acItem.qty = 1;
         $scope.acItem.Price = 0;
         $scope.acItem.Vat = res.data.response.vat_list_id;
         
         $.each($scope.arr_vat, function (index, obj) {
         if (obj.id == $scope.acItem.Vat)
         $scope.acItem.vats = obj;
         });
         
         $scope.items.push($scope.acItem);
         ///$scope.$root.return_status = true;
         }
         });
         
         $('#accthead_modal').modal('hide');*/

    };


<<<<<<< HEAD
    $scope.checkAllGL = function (val, category, brand, unit) {
        $scope.PendingSelectedGLItems = [];

        if (val == true) {
            angular.forEach($scope.gl_account, function (obj) {
=======
    $scope.checkAllGL = function(val, category, brand, unit) {
        $scope.PendingSelectedGLItems = [];

        if (val == true) {
            angular.forEach($scope.gl_account, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (obj.status > 0)
                    obj.chk = true;
                $scope.PendingSelectedGLItems.push(obj);
            });
        } else {
<<<<<<< HEAD
            angular.forEach($scope.gl_account, function (obj) {
=======
            angular.forEach($scope.gl_account, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (!obj.disableCheck)
                    obj.chk = false;
            });
            $scope.PendingSelectedGLItems = [];
        }
    }

<<<<<<< HEAD
    $scope.clearPendingGLitems = function () {
        $scope.PendingSelectedGLItems = [];
        angular.element('#accthead_modal').modal('hide');
    }
    $scope.checkedGL = function (glid) {
=======
    $scope.clearPendingGLitems = function() {
        $scope.PendingSelectedGLItems = [];
        angular.element('#accthead_modal').modal('hide');
    }
    $scope.checkedGL = function(glid) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        for (var i = 0; i < $scope.gl_account.length; i++) {

            if (glid == $scope.gl_account[i].id) {
                if ($scope.gl_account[i].chk == true)
                    $scope.gl_account[i].chk = false;
                else
                    $scope.gl_account[i].chk = true;
            }
        }
    }

<<<<<<< HEAD
    $scope.calcRowProfit = function (item) {
=======
    $scope.calcRowProfit = function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        // if (item.item_type == 0 || (item.item_type == 1 && item.ref_id == 0))
        {
            if ($scope.rec.bill_to_finance_charges_type == 1)
                item.item_finance_charges = ((Number(item.total_price) + Number($scope.rowVat(item))) / Number($scope.rec.currency_rate)) * (Number($scope.rec.bill_to_finance_charges) / 100);
            else
                item.item_finance_charges = ((Number(item.total_price) + Number($scope.rowVat(item))) / Number($scope.rec.currency_rate)) * (Number($scope.rec.bill_to_finance_charges) / Number($scope.rec.grand_total));

            if ($scope.rec.bill_to_insurance_charges_type == 1)
                item.item_insurance_charges = ((Number(item.total_price) + Number($scope.rowVat(item))) / Number($scope.rec.currency_rate)) * (Number($scope.rec.bill_to_insurance_charges) / 100);
            else
                item.item_insurance_charges = ((Number(item.total_price) + Number($scope.rowVat(item))) / Number($scope.rec.currency_rate)) * (Number($scope.rec.bill_to_insurance_charges) / Number($scope.rec.grand_total));

            var linked_gls = $filter("filter")($scope.items, { ref_id: item.update_id, item_type: 1 });
            var linked_gls_profit = 0;
            var linked_gls_val = 0;
            if (linked_gls.length > 0) {
<<<<<<< HEAD
                angular.forEach(linked_gls, function (gl) {
=======
                angular.forEach(linked_gls, function(gl) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    linked_gls_profit += $scope.calcRowProfit(gl);
                    linked_gls_val += (Number(gl.standard_price) / Number($scope.rec.currency_rate)) * Number(gl.qty);
                });
                // linked_gls_profit = (Math.abs(Number(linked_gls_profit)) > 0) ? (Number(linked_gls_profit) / Number($scope.rec.currency_rate)) : 0;
            }
            item.profit = (Number(item.total_price) / Number($scope.rec.currency_rate)) + Number(linked_gls_profit) - (Number(item.cost) +
                Number(item.item_frieght_charges) +
                Number(item.item_finance_charges) +
                Number(item.item_insurance_charges) +
                (Number(item.rebate) * Number(item.qty)));
            // if (Number(item.total_price) > 0)
            item.profit_percentage = ((Number(item.profit) / ((Number(item.total_price) + Number(linked_gls_val)) / Number($scope.rec.currency_rate))) * 100);
            // else
            //     item.profit_percentage = 0;

            return item.profit;
        }
    }
<<<<<<< HEAD
    $scope.rowTotal = function (item) {
=======
    $scope.rowTotal = function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        /* 
        var total = 0;

        if (item.item_type != 1) {

            if (item.units != undefined)
                total = item.qty * item.standard_price;
            else
                total = item.qty * Number(item.standard_price);

        } else {
            if (item.qty > 0)
                total = item.qty * Number(item.standard_price);
            else
                total = Number(item.standard_price);
        }


        if (item.discount_type_id != undefined && item.discount > 0) {
            if (item.discount_type_id.id == 'Percentage')
                total = total - (total * item.discount / 100);
            else if (item.discount_type_id.id == 'Value')
                total = total - item.discount;
            else
                total = (total/item.qty) - item.discount;
        }
         */
        var total = 0;

        /* if (item.item_type != 1) {

            if (item.units != undefined)
                total = item.qty * parseFloat(item.standard_price);
            else
                total = item.qty * parseFloat(item.standard_price);

        } else {
            if (item.qty > 0)
                total = item.qty * parseFloat(item.standard_price);
            else
                total = parseFloat(item.standard_price);
        } */

        if (parseFloat(item.qty) > 0)
            total = parseFloat(item.qty) * parseFloat(item.standard_price);
        else
<<<<<<< HEAD
            total = 0;//parseFloat(item.standard_price);
=======
            total = 0; //parseFloat(item.standard_price);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var discount = 0;
        if (item.discount_type_id != undefined) {
            if (item.discount_type_id.id == 'Percentage')
                discount = (parseFloat(total) * parseFloat(item.discount) / 100);
            else if (item.discount_type_id.id == 'Value')
                discount = parseFloat(item.discount);
            else if (item.discount_type_id.id == 'Unit')
                discount = (parseFloat(item.discount) * parseFloat(item.qty));
        }
        if (isNaN(discount)) {
            discount = 0;
        }

        total = parseFloat(total) - discount;

        if (isNaN(total)) {
            return 0;
        }
        if (item.isGLVat == true) {
            total = 0;
        }
        total = total.toFixed(2);
        total = Number(total);
        item.total_price = total;

        return total;
    }

<<<<<<< HEAD
    $scope.rowDiscount = function (item) {
=======
    $scope.rowDiscount = function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var total = 0;
        if (item.qty > 0)
            total = parseFloat(item.qty) * parseFloat(item.standard_price);
        else
            total = parseFloat(item.standard_price);

        var discount = 0;

        if (item.discount_type_id != undefined) {
            if (item.discount_type_id.id == 'Percentage')
                discount = parseFloat(total) * parseFloat(item.discount) / 100;
            else if (item.discount_type_id.id == 'Value')
                discount = item.discount;
            else if (item.discount_type_id.id == 'Unit')
                discount = parseFloat(item.discount) * parseFloat(item.qty);
        }
        if (isNaN(discount)) {
            discount = 0;
        }
        item.discount_price = discount;
        if (item.isGLVat == true) {
            discount = 0;
        }
        return discount;
    }

<<<<<<< HEAD
    $scope.rowVat = function (item) {
=======
    $scope.rowVat = function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var arrVat = [];
        var total = 0;
        var rowVat = 0;

        if (item.qty > 0)
            total = Number(item.qty) * Number(item.standard_price);
        else
<<<<<<< HEAD
            total = 0;//Number(item.standard_price);
=======
            total = 0; //Number(item.standard_price);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if (item.isGLVat == true) {
            var price = total;
            if (arrVat[vat_value] != undefined && arrVat[vat_value].length > 0)
                arrVat[vat_value] = arrVat[vat_value] + price;
            else if (vat_value > 0)
                arrVat[vat_value] = price;
            else
                arrVat[vat_value] = price;

            // if (Number((vat_value / 100) * arrVat[vat_value]).toFixed(2) > 0)
            rowVat = arrVat[vat_value].toFixed(2);
        }
        if (item.vats != undefined && item.vats.vat_value > 0) {

            if (item.discount_type_id != undefined && item.discount > 0) {
                if (item.discount_type_id.id == 'Percentage')
                    total = Number(total) - (Number(total) * Number(item.discount) / 100);
                else if (item.discount_type_id.id == 'Value')
                    total = Number(total) - Number(item.discount);
                else
                    total = Number(total) - (Number(item.discount) * Number(item.qty));
            }

            var price = total;
            var vat_value = item.vats.vat_value;

            if (arrVat[vat_value] != undefined && arrVat[vat_value].length > 0)
                arrVat[vat_value] = arrVat[vat_value] + price;
            else if (vat_value > 0)
                arrVat[vat_value] = price;

            // if (Number((vat_value / 100) * arrVat[vat_value]).toFixed(2) > 0)
            rowVat = Number((vat_value / 100) * arrVat[vat_value]).toFixed(2);
        }
        if (isNaN(rowVat)) {
            item.vat_price = 0;
            return 0;
<<<<<<< HEAD
        }
        else
=======
        } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            item.vat_price = rowVat;

        return rowVat;
    }

<<<<<<< HEAD
    $scope.calcDiscount = function () {
=======
    $scope.calcDiscount = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var TotalDiscount = 0;
        var ItemsDiscount = 0;

        var total = 0;
        if ($scope.items.length > 0) {
<<<<<<< HEAD
            angular.forEach($scope.items, function (item) {
=======
            angular.forEach($scope.items, function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (item.discount_type_id == undefined) {
                    item.discount = "";
                }

                if (item.discount_type_id != undefined && item.discount > 0) {

                    // var total = item.standard_price;
                    var total = 0;
                    if (item.qty > 0)
                        total = parseFloat(item.qty) * parseFloat(item.standard_price);
                    else
<<<<<<< HEAD
                        total = 0;//parseFloat(item.standard_price);
=======
                        total = 0; //parseFloat(item.standard_price);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (item.discount_type_id != undefined && item.discount > 0) {

                        if (item.discount_type_id.id == 'Percentage')
                            total = parseFloat(total) * (parseFloat(item.discount) / 100);
                        else if (item.discount_type_id.id == 'Value')
                            total = item.discount;
                        else
                            total = item.discount * item.qty;

                        if (item.item_type == 0)
                            ItemsDiscount += parseFloat(total);

                        TotalDiscount += parseFloat(total);
                    }
                }
            });
        }
        if (isNaN(ItemsDiscount)) {
            ItemsDiscount = 0;
        }
        if (isNaN(TotalDiscount)) {
            TotalDiscount = 0;
        }

        $scope.rec.items_net_discount = ItemsDiscount.toFixed(2);
        $scope.rec.total_discount = TotalDiscount.toFixed(2);
        $scope.$emit('NetDiscount', $scope.rec.total_discount);
        $rootScope.discountedSalesOrder = $scope.rec.total_discount;
        return $scope.rec.total_discount;
    }
<<<<<<< HEAD
    $scope.exportStoPDF = function (data) {
=======
    $scope.exportStoPDF = function(data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.showLoader = true;
        // let currentUrl = window.location.href;
        // $scope.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;
        // data.company_logo_url = $scope.company_logo_url;
        // data.totalVolume = 0;
        // data.totalvolume_unit = 0;
        // for(_volume of data.volume_total){
        //     data.totalVolume = data.totalVolume + _volume.total_qty; // data.volume_total[0].total_qty;
        //     data.totalvolume_unit = _volume.volume_unit;
        // }

        // data.totalweight = 0;
        // data.totalweightunit = 0;
        // for (_weight of data.weight_total){
        //     data.totalweight = data.totalweight+ _weight.total_qty;
        //     data.totalweightunit = _weight.weightunit;
        // }



        // data.volume_permission = data.volumePermission;
        // data.weight_permission = data.weightPermission;

        jsreportService.downloadPdf({
            response: data
<<<<<<< HEAD
        }, "r1gu5oJ13N").success(function (_data) {
=======
        }, "r1gu5oJ13N").success(function(_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            let file = new Blob([_data], { type: 'application/pdf' });
            if (data.isPerforma) {
                saveAs(file, "PerformaInvoice.pdf");

            } else {
                saveAs(file, data.templateType + ".pdf");
            }
            $scope.showLoader = false;
        })
    }

<<<<<<< HEAD
    $scope.calcVolume = function (_items) {
        $scope.TOTAL_VOLUME = 0;
        $scope.TOTAL_WEIGHT = 0;
        angular.forEach(_items, function (item) {
=======
    $scope.calcVolume = function(_items) {
        $scope.TOTAL_VOLUME = 0;
        $scope.TOTAL_WEIGHT = 0;
        angular.forEach(_items, function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (item.volume !== null) {
                $scope.TOTAL_VOLUME = $scope.TOTAL_VOLUME + (parseFloat(item.volume) * parseFloat(item.qty));
                if (isNaN($scope.TOTAL_VOLUME)) {
                    $scope.TOTAL_VOLUME = 0;
                }
            }

            if (item.weight !== null) {
                $scope.TOTAL_WEIGHT = $scope.TOTAL_WEIGHT + (parseFloat(item.weight) * parseFloat(item.qty));
                if (isNaN($scope.TOTAL_WEIGHT)) {
                    $scope.TOTAL_WEIGHT = 0;
                }
            }
        })

    }

<<<<<<< HEAD
    $scope.netTotal = function () {
        var s_total = 0;
        var items_net_total = 0;

        angular.forEach($scope.items, function (item) {
=======
    $scope.netTotal = function() {
        var s_total = 0;
        var items_net_total = 0;

        angular.forEach($scope.items, function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            var total = 0;

            if (item.item_type != 1) {

                if (item.qty > 0)
                    total = parseFloat(item.qty) * parseFloat(item.standard_price);
                else
<<<<<<< HEAD
                    total = 0;//parseFloat(item.qty) * parseFloat(item.standard_price);
=======
                    total = 0; //parseFloat(item.qty) * parseFloat(item.standard_price);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            } else if (item.isGLVat == false) {
                if (item.qty > 0)
                    total = parseFloat(item.qty) * parseFloat(item.standard_price);
                else
<<<<<<< HEAD
                    total = 0;//parseFloat(item.standard_price);
=======
                    total = 0; //parseFloat(item.standard_price);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            }
            if (item.item_type == 0)
                items_net_total += parseFloat(total);

            if (item.discount_type_id != undefined && item.discount > 0) {
                if (item.discount_type_id.id == 'Percentage')
                    total = parseFloat(total) - (parseFloat(total) * parseFloat(item.discount) / 100);
                else if (item.discount_type_id.id == 'Value')
                    total = parseFloat(total) - parseFloat(item.discount);
                else
                    total = parseFloat(total) - (parseFloat(item.discount) * parseFloat(item.qty));
            }
            if (!isNaN(total)) {
                if (item.ref_prod_id > 0)
                    s_total = s_total - total;
                else
                    s_total = s_total + total;
            }
        });
        $scope.rec.items_net_total = items_net_total;
        $scope.NetTotal_val = s_total;
        $scope.$emit('NetValue', s_total);
        $scope.$emit('ItemsNetValue', $scope.rec.items_net_total);
        return s_total;
    }

<<<<<<< HEAD
    $scope.calcVat = function () {
=======
    $scope.calcVat = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var arrVat = [];
        var arrTotalVat = [];
        var TotalVat = 0;
        var TotalItemVat = 0;
        var total = 0;
        if ($scope.items.length > 0) {

<<<<<<< HEAD
            angular.forEach($scope.items, function (item) {
=======
            angular.forEach($scope.items, function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                if (item.qty > 0)
                    var subtotal = Number(item.qty) * Number(item.standard_price);
                else
<<<<<<< HEAD
                    var subtotal = 0;//Number(item.standard_price);
=======
                    var subtotal = 0; //Number(item.standard_price);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                if (isNaN(subtotal))
                    subtotal = 0;
                //if (item.item_type == 1)
                //	var subtotal =  item.standard_price;
                /*if(item.sale_unit_id !== item.purchase_unit_id){
                 if(item.unit_parent !== '0')  total += subtotal * item.sale_unit_qty;
                 else  total += subtotal / item.sale_unit_qty;
                 }
                 else  total += subtotal;
                 */
                var total = 0;
                total += Number(subtotal);
                if (item.discount_type_id != undefined && item.discount > 0) {
                    if (item.discount_type_id.id == 'Percentage')
                        total = Number(total) - (Number(total) * item.discount / 100);
                    else if (item.discount_type_id.id == 'Value')
                        total = Number(total) - Number(item.discount);
                    else
                        total = Number(total) - (Number(item.discount) * Number(item.qty));
                }


                var price = total;
                if (item.isGLVat == true) {


                    if (arrVat[vat_value] != undefined && arrVat[vat_value].length > 0)
                        arrVat[vat_value] = arrVat[vat_value] + price;
                    else if (vat_value > 0)
                        arrVat[vat_value] = price;
                    else
                        arrVat[vat_value] = price;

                    //console.log(arrVat[vat_value]);
                    //console.log(vat_value);

                    // if (Number(Math.round(((vat_value / 100) * arrVat[vat_value])).toFixed(2)) > 0)
                    if (item.ref_prod_id > 0)
                        TotalVat = TotalVat - Number((arrVat[vat_value]).toFixed(2));
                    else
                        TotalVat = TotalVat + Number((arrVat[vat_value]).toFixed(2));


                    if (item.item_type == 0)
                        TotalItemVat += Number(((vat_value / 100) * arrVat[vat_value]).toFixed(2));

                    //arrTotalVat[vat_value] = Math.round(arrVat[vat_value] * (vat_value/ 100 )).toFixed(2);
                }

                if (item.vats != undefined && item.vats.vat_value > 0) {

                    var vat_value = item.vats.vat_value;

                    if (arrVat[vat_value] != undefined && arrVat[vat_value].length > 0)
                        arrVat[vat_value] = arrVat[vat_value] + price;
                    else if (vat_value > 0)
                        arrVat[vat_value] = price;

                    //console.log(arrVat[vat_value]);
                    //console.log(vat_value);

                    // if (Number(Math.round(((vat_value / 100) * arrVat[vat_value])).toFixed(2)) > 0)
                    if (item.ref_prod_id > 0)
                        TotalVat -= Number(((vat_value / 100) * arrVat[vat_value]).toFixed(2));
                    else
                        TotalVat += Number(((vat_value / 100) * arrVat[vat_value]).toFixed(2));


                    if (item.item_type == 0)
                        TotalItemVat += Number(((vat_value / 100) * arrVat[vat_value]).toFixed(2));

                    //arrTotalVat[vat_value] = Math.round(arrVat[vat_value] * (vat_value/ 100 )).toFixed(2);
                }

            });

            /* for (var i = 0; i < arrVat.length; i++) {
             value = arrVat[i];	//console.log(value);
             index = arrVat.indexOf(value, i);//console.log(index);
             
             
             if (arrTotalVat[index] > 0 && arrTotalVat[index]!=undefined)
             TotalVat += Number(Math.round( arrTotalVat[index] ).toFixed(2));
             
             //if (Number(index) > 0)  TotalVat = Math.round( TotalVat +index ).toFixed(2);
             } */

        }
        $scope.rec.items_net_vat = TotalItemVat;

        $scope.$emit('NetVAT', TotalItemVat);
        return TotalVat;
    }

<<<<<<< HEAD
    $scope.grandTotal = function () {
=======
    $scope.grandTotal = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.rec.grand_total = $scope.netTotal() + $scope.calcVat();
        if (!isNaN($scope.rec.grand_total))
            $scope.rec.grand_total = Number($scope.rec.grand_total).toFixed(2);

<<<<<<< HEAD
        $scope.rec.grand_total_converted = ($scope.rec.currency_rate != undefined && Number($scope.rec.currency_rate) > 0) ? $scope.rec.grand_total / $scope.rec.currency_rate : $scope.rec.grand_total;//$scope.netTotal() + $scope.calcVat();
=======
        $scope.rec.grand_total_converted = ($scope.rec.currency_rate != undefined && Number($scope.rec.currency_rate) > 0) ? $scope.rec.grand_total / $scope.rec.currency_rate : $scope.rec.grand_total; //$scope.netTotal() + $scope.calcVat();
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if (!isNaN($scope.rec.grand_total_converted))
            $scope.rec.grand_total_converted = Number($scope.rec.grand_total_converted).toFixed(2);
        else
            $scope.rec.grand_total_converted = $scope.rec.grand_total;

        $scope.$emit('GrandTotal', $scope.rec.grand_total);
        return $scope.rec.grand_total;
    }

<<<<<<< HEAD
=======
    $scope.onChangeCurrencyRate = function() {

        if ($scope.rec.currency_rate && $scope.rec.currency_rate != 1)
            $scope.rec.grand_total_converted = Number($scope.rec.grand_total / $scope.rec.currency_rate).toFixed(2);
        else
            $scope.rec.grand_total_converted = $scope.rec.grand_total;

        // $scope.$emit('GrandTotal', $scope.rec.grand_total);
        $scope.$emit('currency_rate', $scope.rec.currency_rate);
        return $scope.rec.grand_total_converted;
    }

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    /* $scope.$watch(function () {
        var chk = true;
        if ($scope.items.length == 0)
            chk = false;
        $.each($scope.items, function (index, elem) {
            if (elem.total_price <= 0 || isNaN(elem.total_price)) {
                chk = false;
            }
        });
        $scope.enable_btn_submit = chk;
    }); */

<<<<<<< HEAD
    $scope.UpdateGrandTotal = function () {
=======
    $scope.UpdateGrandTotal = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if ($scope.rec.type2 == 2) {
            return;
        }

        var orderUrl = $scope.$root.sales + "customer/order/update-grand-total";
        $scope.grandTotal();
        $scope.netTotal();

        var postData = {};
        postData.token = $scope.$root.token;
        postData.order_id = $scope.$root.order_id;
        postData.total_discount = $scope.rec.total_discount;
        postData.grand_total = $scope.rec.grand_total;
        postData.grand_total_converted = $scope.rec.grand_total_converted;
        postData.net_amount = Number($scope.NetTotal_val).toFixed(2);

        var currency_rate = (Number($scope.rec.currency_rate) > 0) ? Number($scope.rec.currency_rate) : 1;
        postData.net_amount_converted = Number($scope.NetTotal_val / currency_rate).toFixed(2);

        postData.items_net_val = Number($scope.rec.items_net_total).toFixed(2);
        postData.items_net_discount = $scope.rec.items_net_discount;
        postData.items_net_vat = $scope.rec.items_net_vat;
        postData.currency_rate = currency_rate;

        postData.tax_amount = $scope.calcVat();
        postData.currency_id = ($scope.rec.currency_id != undefined) ? $scope.rec.currency_id.id : 0;
        postData.converted_currency_id = $scope.$root.defaultCurrency;
        postData.offer_date = $scope.rec.offer_date;

        postData.type = 1;

        $http
            .post(orderUrl, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    console.log('updated grand total');
                }
            });
    }
<<<<<<< HEAD
    $scope.delete = function (index, item, promo) {
=======
    $scope.delete = function(index, item, promo) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if (item.update_id == undefined) {

            // delete related promotion
            if (item.item_type == 0 && item.promotion_id != undefined) {
                var promo = $filter("filter")($scope.items, { ref_prod_id: item.update_id, item_type: 1 });
                var idx = $scope.items.indexOf(promo[0]);
                if (idx != -1)
                    $scope.delete(idx, promo[0]);
            }

            $scope.items.splice(index, 1);
            $scope.calcVolume($scope.items);
            /* var item = $filter("filter")($scope.tempProdArr, { id: item.id }, true);
            var idx = $scope.tempProdArr.indexOf(item[0]);
            $scope.tempProdArr[idx].disableCheck = 0;
            $scope.tempProdArr[idx].chk = false;
 */
            var item = $filter("filter")($scope.items, { item_type: 0, stock_check: 1 });
            if (item != undefined && item.length) {
                $scope.show_btn_dispatch_stuff = true;
<<<<<<< HEAD
            }
            else
                $scope.show_btn_dispatch_stuff = false;


        }
        else {
            ngDialog.openConfirm({
                template: 'modalDeleteDialogId',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
=======
            } else
                $scope.show_btn_dispatch_stuff = false;


        } else {
            ngDialog.openConfirm({
                template: 'modalDeleteDialogId',
                className: 'ngdialog-theme-default-custom'
            }).then(function(value) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                var orderUrl = $scope.$root.sales + "customer/order/delete-order-item";
                var param_item = {};
                angular.copy(item, param_item);
                $scope.showLoader = true;
                $http
                    .post(orderUrl, { 'item': item, 'token': $scope.$root.token })
<<<<<<< HEAD
                    .then(function (res) {
=======
                    .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (res.data.ack == true) {
                            $scope.items.splice(index, 1);
                            $scope.UpdateGrandTotal();
                            $scope.calcVolume($scope.items);

                            if (param_item.item_type == 0 && param_item.promotion_id != undefined) {
                                var promo = $filter("filter")($scope.items, { ref_prod_id: param_item.update_id, item_type: 1 });
                                var idx = $scope.items.indexOf(promo[0]);
                                if (idx != -1) {
                                    var orderUrl = $scope.$root.sales + "customer/order/delete-order-item";
                                    $http
                                        .post(orderUrl, { 'item': promo[0], 'token': $scope.$root.token })
<<<<<<< HEAD
                                        .then(function (res) {
                                            if (res.data.ack == true) {
                                                $scope.items.splice(idx, 1);//$scope.delete(idx, promo[0]);
                                                $scope.UpdateGrandTotal();
                                                $scope.calcVolume($scope.items);
                                            }
                                            else if (promo == undefined) {
=======
                                        .then(function(res) {
                                            if (res.data.ack == true) {
                                                $scope.items.splice(idx, 1); //$scope.delete(idx, promo[0]);
                                                $scope.UpdateGrandTotal();
                                                $scope.calcVolume($scope.items);
                                            } else if (promo == undefined) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                                                return;
                                            }
                                        });

                                }

                            }
                            // remove the link from the gl's
                            if (param_item.item_type == 0 && param_item.ref_id != undefined) {
                                var linked_gls = $filter("filter")($scope.items, { ref_id: param_item.update_id, item_type: 1 });
                                var linked_gls_val = 0;
                                if (linked_gls.length > 0) {
<<<<<<< HEAD
                                    angular.forEach(linked_gls, function (gl) {
=======
                                    angular.forEach(linked_gls, function(gl) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                        gl.ref_id = 0;
                                    });
                                }
                            }
                            if (promo == undefined)
                                toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));

                            /* var item = $filter("filter")($scope.tempProdArr, { id: item.id });
                            var idx = $scope.tempProdArr.indexOf(item[0]);
                            $scope.tempProdArr[idx].disableCheck = 0;
                            $scope.tempProdArr[idx].chk = false; */
                            var item = $filter("filter")($scope.items, { item_type: 0, stock_check: 1 });
                            if (item != undefined && item.length) {
                                $scope.show_btn_dispatch_stuff = true;
<<<<<<< HEAD
                            }
                            else
=======
                            } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                $scope.show_btn_dispatch_stuff = false;


                            if ($scope.items.length == 0) {
                                $scope.enable_btn_dispatch = false;
                                $scope.enable_btn_invoice = false;
                            }
                            $scope.showLoader = false;
<<<<<<< HEAD
                        }
                        else if (promo == undefined) {
=======
                        } else if (promo == undefined) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                            $scope.showLoader = false;
                        }
                    });
<<<<<<< HEAD
            }, function (reason) {
=======
            }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                console.log('Modal promise rejected. Reason: ', reason);
            });
        }
    }


    /*  $scope.arr_vat = [];
     var vatUrl = $scope.$root.hr + "hr_values/get-vat";
     $http
         .post(vatUrl, { 'token': $scope.$root.token })
         .then(function (res) {
             if (res.data.ack == true) {
                 $scope.arr_vat = res.data.response;
             }
         }); */

    $scope.arr_units = [];
    $scope.arr_service_units = [];
    /* var unitUrl = $scope.$root.stock+"unit-measure/units";
     $http
     .post(unitUrl, {'token':$scope.$root.token})
     .then(function (res) {
     if(res.data.ack == true){
     $scope.arr_units = res.data.response;
     } 
     });*/

    /* var unitsUrl = $scope.$root.setup + "service/unit-measure/units";
    $http
        .post(unitsUrl, { 'token': $scope.$root.token })
        .then(function (res) {
            if (res.data.ack == true) {
                $scope.arr_service_units = res.data.response;
            }
        }); */

    /* $scope.arr_warehouse = [];
    var whUrl = $scope.$root.setup + "warehouse/get-all-list";
    $http
        .post(whUrl, { 'token': $scope.$root.token })
        .then(function (res) {
            if (res.data.ack == true) {
                $scope.arr_warehouse = res.data.response;
            }
        }); */


    var counter = 1;
    $scope.check_order_complete = $scope.check_readonly;

    //$scope.$on("OrderTabEvent", function (event, args) {
    //if(counter == 1){
    if ($scope.$root.order_status == 'ORDER_COMPLETED')
        $scope.check_order_complete = 0;

    /*$resource('api/company/get_currency_code/:id')
     .get({id:$scope.$root.cust_currency_id},function(data){
     $scope.currency_code = data.code;
     });*/


<<<<<<< HEAD
    $scope.getCode = function (rec, rec2, flg) {
=======
    $scope.getCode = function(rec, rec2, flg) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        // var getCrmCodeUrl = $scope.$root.pr + "srm/srminvoice/get-quote-code";
        var getCodeUrl = $scope.$root.stock + "products-listing/get-code";


        if ($scope.$parent.rec.type2 == 0)
            var name = $scope.$root.base64_encode('quotations');
        else
            var name = $scope.$root.base64_encode('orders');


        var module_category_id = 2;
        /*if( $scope.formData.brand_ids != 0)  module_category_id=1;
         if( $scope.formData.brand_ids == 0)
         {
         if( $scope.formData.category_ids != 0) module_category_id=3;
         }*/
        if ($stateParams.id === undefined) {

            $http
                .post(getCodeUrl, {
                    'is_increment': 1,
                    'token': $scope.$root.token,
                    'tb': name,
                    'category': '',
                    'brand': '',
                    'module_category_id': module_category_id,
                    'type': '1,2'
                })
<<<<<<< HEAD
                .then(function (res) {
=======
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    if (res.data.ack == 1) {

                        if ($scope.$parent.rec.type2 == 0)
                            $scope.rec.sale_quote_code = res.data.code;
                        else
                            $scope.rec.sale_order_code = res.data.code;

                        $scope.$root.model_code = res.data.code;
                        $scope.rec.sale_order_no = res.data.nubmer;
<<<<<<< HEAD
                        $scope.rec.code_type = module_category_id;//res.data.code_type;
=======
                        $scope.rec.code_type = module_category_id; //res.data.code_type;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.count_result++;

                        if (res.data.type == 1) {
                            $scope.product_type = false;
<<<<<<< HEAD
                        }
                        else {
=======
                        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            $scope.product_type = true;
                        }

                        if ($scope.count_result > 0) {
                            console.log($scope.count_result);
                            $scope.UpdateForm(rec, rec2, flg);
                            return true;
<<<<<<< HEAD
                        }
                        else {
=======
                        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            console.log($scope.count_result + 'd');
                            return false;
                        }

<<<<<<< HEAD
                    }
                    else {
=======
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        toaster.pop('error', 'Error', res.data.error);
                        return false;
                    }
                });
        }

    }

<<<<<<< HEAD
    $scope.UpdateForm = function (rec, rec2, flg, invoice_post) {
=======
    $scope.UpdateForm = function(rec, rec2, flg, invoice_post) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var addOrderUrl = $scope.$root.sales + "customer/order/add-order";

        if (flg && Number($scope.rec.grand_total) > 0) {
            var str = '';
            if (Number(rec.credit_limit_approval_req) > 0 && Number(rec.credit_limit_approval_status) != 2) {
                str = ', It will require approval on posting';
            }

            var converted_credit_limit = Number($scope.rec.credit_limit) / Number($scope.$parent.rec.currency_rate);
            if (Number(converted_credit_limit) > 0 && Number($scope.rec.customer_balance) + (Number($scope.rec.grand_total) / Number($scope.$parent.rec.currency_rate)) > Number(converted_credit_limit)) {
                var exceded_by = ((Number($scope.rec.customer_balance) + (Number($scope.rec.grand_total) / Number($scope.$parent.rec.currency_rate))) - Number(converted_credit_limit)).toFixed(2);
                // toaster.pop('warning', 'Warning', 'Invoice value exceeded Credit limit of the customer ' + $scope.rec.sell_to_cust_no + ' by ' + exceded_by + str);
                toaster.pop('warning', 'Warning', 'Credit limit exceeds, authorised limit of ' + $scope.rec.credit_limit + ' ' + $scope.rec.currency_id.code + str);
            }
        }
        $scope.showLoader = true;
        $http
            .post(addOrderUrl, rec)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    // 

                    // if ($stateParams.id === undefined) {
                    //  $scope.$root.crm_id = rec.sell_to_cust_id;

                    var id = res.data.id;
                    $scope.rec.id = res.data.id;
                    $scope.rec.sale_quote_code = res.data.sale_quote_code;
                    $scope.rec.sale_order_code = res.data.sale_order_code;
                    $scope.$root.order_id = id;
                    $scope.$root.order_date = res.data.order_date;
                    $scope.$root.posting_date = res.data.posting_date;

                    moduleTracker.updateRecord(res.data.id);
                    moduleTracker.updateRecordName(res.data.sale_quote_code ? res.data.sale_quote_code : "" + (res.data.sale_quote_code && res.data.sale_order_code ? "/" : "") + res.data.sale_order_code + ((res.data.sale_order_code && res.data.sale_invioce_code) ? "/" : "") + (res.data.sale_invioce_code ? res.data.sale_invioce_code : ''));


                    $scope.$root.crm_id = rec.sell_to_cust_id;
                    if ($scope.items.length > 0) {
                        $scope.add_sublist(rec2, rec, flg, invoice_post);
<<<<<<< HEAD
                    }
                    else if (flg == 1) {
=======
                    } else if (flg == 1) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.showLoader = false;
                        $scope.$parent.check_so_readonly = true;
                        $scope.check_so_readonly = true;
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));
                        /* if(rec.type2 == 0)
                            $state.go("app.editSaleQuote", { id: $scope.$root.order_id });
                        else
                            $state.go("app.editOrder", { id: $scope.$root.order_id }); */

                        $scope.UpdateGrandTotal();
<<<<<<< HEAD
                    }
                    else
=======
                    } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.UpdateGrandTotal();

                    if (Number(rec2) == 1)
                        $scope.GetSalesOrderStages();



                    // #updating breadcrumb
                    if ($scope.$root.breadcrumbs.length > 3) {
                        if ($scope.rec.sale_quote_code && $scope.rec.type == "0") {
                            $scope.$root.model_code = $scope.rec.sell_to_cust_name + '(' + $scope.rec.sale_quote_code + ')';
                        } else if ($scope.rec.sale_order_code && $scope.rec.type == "1") {
                            $scope.$root.model_code = $scope.rec.sell_to_cust_name + '(' + $scope.rec.sale_order_code + ')';
<<<<<<< HEAD
                        }
                        else {
=======
                        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            $scope.$root.model_code = $scope.rec.sell_to_cust_name;
                        }

                        $scope.$root.breadcrumbs[3].name = $scope.$root.model_code;
                    }

                    if ($scope.$root.breadcrumbs.length == 3) {
                        // $scope.$root.model_code = $scope.rec.sell_to_cust_name + '(' + $scope.rec.order_code + ')';
                        if ($scope.rec.sale_quote_code && $scope.rec.type == "0") {
                            $scope.$root.model_code = $scope.rec.sell_to_cust_name + '(' + $scope.rec.sale_quote_code + ')';
                        } else if ($scope.rec.sale_order_code && $scope.rec.type == "1") {
                            $scope.$root.model_code = $scope.rec.sell_to_cust_name + '(' + $scope.rec.sale_order_code + ')';
<<<<<<< HEAD
                        }
                        else {
=======
                        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            $scope.$root.model_code = $scope.rec.sell_to_cust_name;
                        }


                        $scope.$root.breadcrumbs.push({ 'name': $scope.$root.model_code, 'url': '#', 'isActive': false });
                    }
                    // end updating breadcrumb
                    // $rootScope.updateSelectedGlobalData("item");
                    // angular.element('#orders_tabs ul li').removeClass('dont-click');
                    // //$scope.$root.$broadcast("myEvent", {order_id: id});
                    // $state.go("app.editOrder", { id: res.data.id });
                    // console.log('d');
                    return true;
                    // }

<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    // toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(106));
                    return false;
                }

            });

    }

<<<<<<< HEAD
    $scope.add_general = function (rec, rec2, flg, invoice_post) {
=======
    $scope.add_general = function(rec, rec2, flg, invoice_post) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (Number($scope.NetTotal_val < 0)) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(316, ['Invoice Total', '0']));
            // return;
        }

        if ($scope.rec.id == 0 && ($scope.rec.sell_to_cust_id == undefined || $scope.rec.sell_to_cust_id == null || $scope.rec.sell_to_cust_id == '')) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Customer No.']));
            return;
        }
        if ($scope.rec.offer_date == undefined || $scope.rec.offer_date == null || $scope.rec.offer_date == '') {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Order Date']));
            return;
        }
        var addOrderUrl = $scope.$root.sales + "customer/order/add-order";
        // if ($stateParams.id != undefined)
        //     addOrderUrl = $scope.$root.sales + "customer/order/update-order";
        $scope.waitFormarginAnalysis = true;
        rec.token = $scope.$root.token;
        //rec.id = $stateParams.id;
        rec.type = $scope.rec.type2;

        rec.payment_terms_code = (rec.payment_terms_codes != undefined && rec.payment_terms_codes.id != undefined) ? rec.payment_terms_codes.id : 0;
        rec.payment_method_id = (rec.payment_method_ids != undefined && rec.payment_method_ids.id != undefined) ? rec.payment_method_ids.id : 0;
        rec.country_id = (rec.country_ids != undefined && rec.country_ids.id != undefined) ? rec.country_ids.id : 0;
        rec.currency_ids = (rec.currency_id != undefined && rec.currency_id.id != undefined) ? rec.currency_id.id : 0;
        rec.bill_to_country_id = ($scope.rec.bill_to_country_ids != undefined && $scope.rec.bill_to_country_ids.id != undefined) ? $scope.rec.bill_to_country_ids.id : 0;
        rec.ship_to_country_id = ($scope.rec.ship_to_country_ids != undefined && $scope.rec.ship_to_country_ids.id != undefined) ? $scope.rec.ship_to_country_ids.id : 0;
        rec.bill_to_finance_charges_id = ($scope.drp.finance_charges_ids != undefined && $scope.drp.finance_charges_ids.id != undefined) ? $scope.drp.finance_charges_ids.id : 0;
        rec.bill_to_finance_charges_name = ($scope.drp.finance_charges_ids != undefined && $scope.drp.finance_charges_ids.id != undefined) ? $scope.drp.finance_charges_ids.Charge : '';
        rec.bill_to_insurance_charges_id = ($scope.drp.insurance_charges_ids != undefined && $scope.drp.insurance_charges_ids.id != undefined) ? $scope.drp.insurance_charges_ids.id : 0;
        rec.bill_to_insurance_charges_name = ($scope.drp.insurance_charges_ids != undefined && $scope.drp.insurance_charges_ids.Charge != undefined) ? $scope.drp.insurance_charges_ids.Charge : '';
        rec.bill_to_posting_group_id = ($scope.drp.vat_bus_posting_group != undefined && $scope.drp.vat_bus_posting_group.id != undefined) ? $scope.drp.vat_bus_posting_group.id : 0;
        rec.bill_to_posting_group_name = ($scope.drp.vat_bus_posting_group != undefined && $scope.drp.vat_bus_posting_group.name != undefined) ? $scope.drp.vat_bus_posting_group.name : '';
        rec.payment_method_id = ($scope.drp.payment_method_ids != undefined && $scope.drp.payment_method_ids.id != undefined) ? $scope.drp.payment_method_ids.id : 0;
        rec.payment_method_code = ($scope.drp.payment_method_ids != undefined && $scope.drp.payment_method_ids.description != undefined) ? $scope.drp.payment_method_ids.description : '';
        rec.payment_discount = ($scope.drp.payment_terms_ids != undefined && $scope.drp.payment_terms_ids.id != undefined) ? $scope.drp.payment_terms_ids.id : 0;
        rec.payment_terms_code = ($scope.drp.payment_terms_ids != undefined) && $scope.drp.payment_terms_ids.description != undefined ? $scope.drp.payment_terms_ids.description : '';
        // $scope.$root.c_currency_id = rec.currency_ids;
        $scope.$root.posting_date = rec.posting_date;

<<<<<<< HEAD
        if($rootScope.defaultCompany == 133 && $scope.rec.country_id !=218 ){
=======
        if ($rootScope.defaultCompany == 133 && $scope.rec.country_id != 218) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            rec.shipment_method_id = ($scope.rec.shipment_method != undefined && $scope.rec.shipment_method.id != undefined) ? $scope.rec.shipment_method.id : 0;

            rec.shipment_method_code = ($scope.rec.shipment_method != undefined && $scope.rec.shipment_method.name != undefined) ? $scope.rec.shipment_method.name : 0;

            rec.shipping_agent_id = ($scope.rec.shipping_agent != undefined && $scope.rec.shipping_agent.id != undefined) ? $scope.rec.shipping_agent.id : 0;

<<<<<<< HEAD
            rec.shipping_agent_code = ($scope.rec.shipping_agent != undefined && $scope.rec.shipping_agent.name != undefined) ? $scope.rec.shipping_agent.name : 0; 
        }       
=======
            rec.shipping_agent_code = ($scope.rec.shipping_agent != undefined && $scope.rec.shipping_agent.name != undefined) ? $scope.rec.shipping_agent.name : 0;
        }
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        /*
         $scope.$root.$broadcast("shift1",rec.bill_to_cust_no,rec.ship_to_name,rec.invoice_date,rec.requested_delivery_date
         ,rec.comm_book_in_no,rec.type,rec.order_code,rec.payable_number,rec.purchase_number);
         */
        rec.PurchaseOrderArr = {};
        rec.PurchaseOrderArr = $scope.selectedPurchaseOrderArr;

        /* if ($scope.rec.sale_order_code == undefined) {
            $scope.getCode(rec, rec2, flg);
        }
        else  */
        {
            $scope.UpdateForm(rec, rec2, flg, invoice_post);
        }

    }

    var rec2 = {};
<<<<<<< HEAD
    $scope.add_sublist = function (rec2, rec, flg, invoice_post) {
=======
    $scope.add_sublist = function(rec2, rec, flg, invoice_post) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        /* $scope.saverecord = 1;
        $scope.saverecord = $scope.add_general(rec);

        if ($scope.saverecord == 0)
        {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(106));
            return false;
        }
        */
        var rec2 = {};
        //||$scope.items.length==0
        /*  if (rec.posting_date == undefined || rec.posting_date == null) {
             toaster.pop('error', 'Error', 'Invoice Date is Not Defined');
             return;
         } */

        // if ($scope.items.length==0)
        // {
        //     return;
        // } 

        rec2.net_amount = $scope.netTotal();
        rec2.tax_amount = $scope.calcVat();
        rec2.grand_total = $scope.grandTotal();
        rec2.items_net_total = $scope.rec.items_net_total;
        rec2.items_net_discount = $scope.rec.items_net_discount;
        rec2.items_net_vat = $scope.rec.items_net_vat;
        $scope.$root.c_currency_id = (rec.currency_id != undefined && rec.currency_id.id != undefined) ? rec.currency_id.id : 0;
        rec2.order_date = $scope.$root.posting_date;

        if ($scope.$root.c_currency_id == $scope.$root.defaultCurrency) {
            rec2.net_amount_converted = Number(rec2.net_amount);
            rec2.tax_amount_converted = Number(rec2.tax_amount);
            rec2.grand_total_converted = Number(rec2.grand_total);
            rec2.converted_currency_id = $scope.$root.defaultCurrency;
            rec2.converted_currency_code = $scope.$root.defaultCurrencyCode;
            rec2.currency_rate = 1;
            $scope.rec.currency_rate = 1;
            // $scope.add_general(rec, rec2);
            $scope.addsublist(rec2, flg, invoice_post);
<<<<<<< HEAD
        }
        else {
            //  $rootScope.get_currency_list($scope.$root.posting_date);
=======
        } else {
            //  $rootScope.get_currency_list($scope.$root.posting_date);
            console.log('rec.currency_rate == ', $scope.rec.currency_rate);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            if (invoice_post != undefined && invoice_post == 1) {
                rec2.net_amount_converted = Number(rec2.net_amount) / Number($scope.rec.currency_rate);
                rec2.tax_amount_converted = Number(rec2.tax_amount) / Number($scope.rec.currency_rate);
                rec2.grand_total_converted = Number(rec2.grand_total) / Number($scope.rec.currency_rate);
                rec2.converted_currency_id = $scope.$root.defaultCurrency;
                rec2.converted_currency_code = $scope.$root.defaultCurrencyCode;
                rec2.currency_rate = $scope.rec.currency_rate;
                if (rec2.net_amount > 0 && rec2.net_amount_converted <= 0 || rec2.net_amount_converted == undefined || rec2.tax_amount_converted == undefined || rec2.tax_amount_converted == undefined || rec2.grand_total_converted == undefined || rec2.grand_total_converted == undefined) {
                    toaster.pop('error', 'Error', 'Please Select Currency Rate.');
                    isValide = false;
                    $scope.waitFormarginAnalysis = false;
                    return;
                } else {
                    $scope.addsublist(rec2, flg, invoice_post);
                }
            }
<<<<<<< HEAD
            else {
                var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
                $scope.items_converted_arr = [];
                $http
                    .post(currencyURL, {
                        'id': $scope.$root.c_currency_id,
                        token: $scope.$root.token,
                        or_date: $scope.rec.posting_date
                    })
                    .then(function (res) {
                        if (res.data.ack == true) {
                            if (res.data.response.conversion_rate != null) {

                                $scope.showLoader = true;
                                // $timeout(function () {

                                $scope.showLoader = false;

                                rec2.net_amount_converted = Number(rec2.net_amount) / Number(res.data.response.conversion_rate);
                                rec2.tax_amount_converted = Number(rec2.tax_amount) / Number(res.data.response.conversion_rate);
                                rec2.grand_total_converted = Number(rec2.grand_total) / Number(res.data.response.conversion_rate);
                                rec2.converted_currency_id = $scope.$root.defaultCurrency;
                                rec2.converted_currency_code = $scope.$root.defaultCurrencyCode;
                                $scope.rec.currency_rate = res.data.response.conversion_rate;
                                rec2.currency_rate = $scope.rec.currency_rate;

                                if (rec2.net_amount > 0 && rec2.net_amount_converted <= 0 || rec2.net_amount_converted == undefined || rec2.tax_amount_converted == undefined || rec2.tax_amount_converted == undefined || rec2.grand_total_converted == undefined || rec2.grand_total_converted == undefined) {
                                    toaster.pop('error', 'Error', 'Please Select Currency Rate.');
                                    $scope.waitFormarginAnalysis = false;
                                    isValide = false;
                                    return;
                                } else {
                                    $scope.addsublist(rec2, flg, invoice_post);
                                    // $scope.add_general(rec, rec2);
                                }

                                // }, 2000);

                            }
                        }
                        else {
                            $scope.showLoader = false;
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Currency Conversion Rate']));
                        }
                    });
            }
        }
    }
    $scope.addsublist = function (rec2, flg, invoice_post) {
        // invoice_post-> 1 for converting to sales invoice, 2 for converting to quote
        var temp_valid = 1;
        angular.forEach($scope.items, function (obj) {
=======
            /* else {
                           var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
                           $scope.items_converted_arr = [];
                           $http
                               .post(currencyURL, {
                                   'id': $scope.$root.c_currency_id,
                                   token: $scope.$root.token,
                                   or_date: $scope.rec.posting_date
                               })
                               .then(function(res) {
                                   if (res.data.ack == true) {
                                       if (res.data.response.conversion_rate != null) {

                                           $scope.showLoader = true;
                                           // $timeout(function () {

                                           $scope.showLoader = false;

                                           rec2.net_amount_converted = Number(rec2.net_amount) / Number(res.data.response.conversion_rate);
                                           rec2.tax_amount_converted = Number(rec2.tax_amount) / Number(res.data.response.conversion_rate);
                                           rec2.grand_total_converted = Number(rec2.grand_total) / Number(res.data.response.conversion_rate);
                                           rec2.converted_currency_id = $scope.$root.defaultCurrency;
                                           rec2.converted_currency_code = $scope.$root.defaultCurrencyCode;
                                           $scope.rec.currency_rate = res.data.response.conversion_rate;
                                           rec2.currency_rate = $scope.rec.currency_rate;

                                           if (rec2.net_amount > 0 && rec2.net_amount_converted <= 0 || rec2.net_amount_converted == undefined || rec2.tax_amount_converted == undefined || rec2.tax_amount_converted == undefined || rec2.grand_total_converted == undefined || rec2.grand_total_converted == undefined) {
                                               toaster.pop('error', 'Error', 'Please Select Currency Rate.');
                                               $scope.waitFormarginAnalysis = false;
                                               isValide = false;
                                               return;
                                           } else {
                                               $scope.addsublist(rec2, flg, invoice_post);
                                               // $scope.add_general(rec, rec2);
                                           }

                                           // }, 2000);

                                       }
                                   } else {
                                       $scope.showLoader = false;
                                       toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Currency Conversion Rate']));
                                   }
                               });
                       } */
        }
    }
    $scope.addsublist = function(rec2, flg, invoice_post) {
        // invoice_post-> 1 for converting to sales invoice, 2 for converting to quote
        var temp_valid = 1;
        angular.forEach($scope.items, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (isNaN(obj.qty)) {
                temp_valid = 0;
            }
        });

        if (!temp_valid) {
            toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(508, ['Quantity']));
            $scope.$parent.check_so_readonly = false;
            $scope.check_so_readonly = false;
            $scope.waitFormarginAnalysis = false;
            return;
        }
        var temp_valid = 1;
<<<<<<< HEAD
        angular.forEach($scope.items, function (obj) {
=======
        angular.forEach($scope.items, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (obj.standard_price != null && isNaN(obj.standard_price)) {
                temp_valid = 0;
            }
        });

        if (!temp_valid) {
            toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(508, ['Standard Price']));
            $scope.$parent.check_so_readonly = false;
            $scope.check_so_readonly = false;
            $scope.waitFormarginAnalysis = false;
            return;
        }


        var orderUrl = $scope.$root.sales + "customer/order/add-order-items";
        //$timeout(function () {
        if (rec2.grand_total == undefined) {
            rec2.net_amount = $scope.netTotal();
            rec2.tax_amount = $scope.calcVat();
            rec2.grand_total = $scope.grandTotal();
            rec2.items_net_total = $scope.rec.items_net_total;
            rec2.items_net_discount = $scope.rec.items_net_discount;
            rec2.items_net_vat = $scope.rec.items_net_vat;
            $scope.$root.c_currency_id = ($scope.rec.currency_id != undefined && $scope.rec.currency_id.id != undefined) ? $scope.rec.currency_id.id : 0;
            rec2.order_date = $scope.$root.posting_date;

            rec2.net_amount_converted = Number(rec2.net_amount) / Number($scope.rec.currency_rate);
            rec2.tax_amount_converted = Number(rec2.tax_amount) / Number($scope.rec.currency_rate);
            rec2.grand_total_converted = Number(rec2.grand_total) / Number($scope.rec.currency_rate);
            rec2.converted_currency_id = $scope.$root.defaultCurrency;
            rec2.converted_currency_code = $scope.$root.defaultCurrencyCode;
            rec2.currency_rate = $scope.rec.currency_rate;
        }
        rec2.items = $scope.items;
        rec2.order_id = $scope.$root.order_id;
        rec2.order_date = $scope.$root.posting_date;
        rec2.offer_date = $scope.rec.offer_date;
        rec2.currency_id = $scope.$root.c_currency_id;
        rec2.currency_rate = $scope.rec.currency_rate;
        // console.log($scope.rec.currency_rate);
        rec2.token = $rootScope.token;
        rec2.note = $scope.rec.note;

        $scope.showLoader = true;
        $http
            .post(orderUrl, rec2)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    if (invoice_post != 1) // do not hide loader while posting, to prevent a chance to post an invoice twice
                        $scope.showLoader = false;

                    if (flg) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));
                        $scope.$parent.check_so_readonly = true;
                        $scope.check_so_readonly = true;
                        $scope.waitFormarginAnalysis = false;
                        /* if ($scope.$parent.rec.type2 == 1)
                            $state.go("app.editOrder", { id: $scope.$root.order_id });
                        else
                            $state.go("app.editSaleQuote", { id: $scope.$root.order_id }); */

                    }
                    if (invoice_post != undefined) {
                        if (invoice_post == 1) {
                            $scope.showLoader = false;
                            // $scope.load_invoice();
                            // $scope.convert_post_invoice_org($scope.rec, $scope.rec2); // handeled in stats information
<<<<<<< HEAD
                        }
                        else if (invoice_post == 2)
=======
                        } else if (invoice_post == 2)
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            $scope.load_quote();
                        else if (invoice_post == 3)
                            $scope.dispatchStockOrg();
                        // invoice_post == 4 to prevent the $scope.getOrdersDetail();, this function hide the loader so there is a chance to post an invoice twice
<<<<<<< HEAD
                    }
                    else
=======
                    } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.getOrdersDetail();

                    $scope.UpdateGrandTotal();

                } else {
                    // $scope.$parent.check_so_readonly = false;
                    // $scope.check_so_readonly = false;
                    $scope.showLoader = false;
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(104));
                }
            });
<<<<<<< HEAD
            
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    }


<<<<<<< HEAD
    $scope.chk_allocation_nd_dispatch = function () {
=======
    $scope.chk_allocation_nd_dispatch = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var chkDis = false;
        var chkInv = false;

        // $timeout(function () {
<<<<<<< HEAD
        $.each($scope.items, function (index, obj) {
=======
        $.each($scope.items, function(index, obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (obj.remainig_qty == 0)
                chkDis = true;
            else
                chkDis = false;

            if (obj.sale_status == 2)
                chkInv = true;
            else
                chkInv = false;
        });

        // $scope.$root.$apply(function () {
        $scope.enable_btn_dispatch = chkDis;
        $scope.enable_btn_invoice = chkInv;
        if (chkInv)
            $scope.enable_btn_dispatch = false;
        // });

        // }, 2000);
    }


<<<<<<< HEAD
    $scope.getOrdersDetail = function (flg) {
=======
    $scope.getOrdersDetail = function(flg) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.filterOrderItem = {};
        /* $scope.tempProdArr = [];
        angular.copy($rootScope.prooduct_arr, $scope.tempProdArr);

        for (var i = 0; i < $scope.tempProdArr.length; i++) {
            $scope.tempProdArr[i].chk = false;
            $scope.tempProdArr[i].calc_current_stock = Number($scope.tempProdArr[i].allocated_stock) + Number($scope.tempProdArr[i].available_stock);
        } */

        // if (flg == undefined)
        $scope.hide_dispatch_btn = false;

        $scope.volume = 0;
        $scope.weight = 0;
        $scope.volume_unit = '';
        $scope.weightunit = '';
        $scope.weight_permission = 0;
        $scope.volume_permission = 0;
        $scope.showVolumeWeight = 0;


        var total_rec_recvie = total_rec_invice = 0;
        var getOrderProduct = $scope.$root.sales + 'customer/order/get-order-items';
        $scope.showLoader = true;
        // start response handling
        $http
            .post(getOrderProduct, { order_id: $scope.$root.order_id, token: $scope.$root.token })
<<<<<<< HEAD
            .then(function (rsQtItem) {
=======
            .then(function(rsQtItem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (rsQtItem.data.ack == true) {
                    // console.log(rsQtItem.data.response);

                    $scope.items = [];
                    $scope.allWarehouseEmails = [];
                    var total_items_qty = 0;
                    $scope.calcVolume(rsQtItem.data.response);

                    if (!$rootScope.arr_vat_post_grp_sales) {

                        $rootScope.arr_vat_post_grp_sales = rsQtItem.data.arr_vat_post_grp_sales;
                        console.log('here for VAT');
                    }
                    console.log($rootScope.arr_vat_post_grp_sales + ' AFTER LOADING');

<<<<<<< HEAD
                    angular.forEach(rsQtItem.data.response, function (elem, detIndex) {
=======
                    angular.forEach(rsQtItem.data.response, function(elem, detIndex) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        var detail = {};

                        detail.item_type = elem.type;
                        detail.linked_item = '';
                        detail.ref_id = elem.ref_id;
                        detail.volume = elem.volume;
                        detail.weight = elem.weight;
                        if (elem.type == 0)
                            total_items_qty += Number(elem.qty);
                        /* if (item) {
                            var idx = $scope.tempProdArr.indexOf(item[0]);
                            // $scope.tempProdArr[idx].disableCheck = 1;
                            $scope.tempProdArr[idx].chk = true;
                        } */

                        detail.rebate = 0;
                        detail.rebate_type = '';
                        detail.storage_cost = 0;
                        detail.cost = 0;
                        detail.item_org_additional_cost = 0;
                        detail.item_additional_cost = 0;
                        detail.item_frieght_charges = 0;
                        detail.item_finance_charges = 0;
                        detail.item_insurance_charges = 0;

                        detail.order_id = elem.order_id;
                        detail.update_id = elem.id;
                        detail.id = elem.item_id;
                        detail.warehouse_id = elem.warehouse_id;
                        // detail.warehouse_email = "abc@def.com,ghi@jkl.com";
                        detail.warehouse_email = elem.warehouse_email;
                        try {
                            detail.warehouse_email = detail.warehouse_email.split(";");
<<<<<<< HEAD
                            angular.forEach(detail.warehouse_email, function (emailObj, index) {
                                var filteredWarehouseEmail = $scope.allWarehouseEmails.filter(function (o) {
=======
                            angular.forEach(detail.warehouse_email, function(emailObj, index) {
                                var filteredWarehouseEmail = $scope.allWarehouseEmails.filter(function(o) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    return o.username == emailObj;
                                })
                                if (filteredWarehouseEmail.length == 0)
                                    $scope.allWarehouseEmails.push({ id: $scope.allWarehouseEmails.length, username: emailObj });
                            });
<<<<<<< HEAD
                        }
                        catch (msg) {
=======
                        } catch (msg) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            console.log("no warehouse email set or e-dispatch note turned off..");
                        }

                        detail.description = elem.item_name;
                        detail.product_code = elem.product_code;
                        detail['No.'] = elem.product_code;

                        detail.costing_method_id = elem.costing_method_id;
                        detail.standard_purchase_cost = elem.standard_purchase_cost;
                        detail.stock_check = elem.stock_check;
                        detail.rawMaterialProduct = elem.rawMaterialProduct;
                        detail.raw_material_gl_id = elem.raw_material_gl_id;
                        detail.raw_material_gl_code = elem.raw_material_gl_code;
                        detail.raw_material_gl_name = elem.raw_material_gl_name;

                        detail.cd_goods = elem.cd_goods;
                        detail.cd_description = elem.cd_description;
<<<<<<< HEAD
                        detail.standard_price = Number(elem.unit_price);//(Number(elem.unit_price) > 0) ? Number(elem.unit_price) : '';
=======
                        detail.standard_price = Number(elem.unit_price); //(Number(elem.unit_price) > 0) ? Number(elem.unit_price) : '';
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        detail.qty = (Number(elem.qty) > 0) ? Number(elem.qty) : '';
                        detail.prev_qty = (Number(elem.qty) > 0) ? Number(elem.qty) : '';
                        detail.unit_of_measure_name = elem.unit_measure;
                        detail.unit_id = elem.unit_measure_id;
                        detail.unit_parent = elem.unit_parent_id;
                        detail.sale_unit_qty = elem.unit_qty;
                        detail.category_id = elem.cat_id;
                        detail.discount = Number(elem.discount) > 0 ? Number(elem.discount) : '';
                        detail.sale_unit_id = elem.sale_unit_id;
                        detail.purchase_unit_id = elem.purchase_unit_id;
                        detail.primary_unit_of_measure_id = elem.primary_unit_of_measure_id;
                        detail.primary_unit_of_measure_name = elem.primary_unit_of_measure_name;
                        detail.promotion_id = elem.promotion_id;
                        detail.ref_prod_id = elem.ref_prod_id;

                        detail.item_org_additional_cost = Number(elem.item_org_additional_cost);

                        detail.item_additional_cost = Number(elem.item_additional_cost);
                        detail.item_frieght_charges = Number(elem.item_frieght_charges);
                        detail.item_finance_charges = Number(elem.item_finance_charges);
                        detail.item_insurance_charges = Number(elem.item_insurance_charges);

                        detail.item_cost = Number(elem.item_cost);
                        detail.item_org_cost = Number(elem.item_org_cost);

                        detail.cost = detail.item_cost;
                        if ($scope.marginAnalysisView == 0)
                            detail.cost = detail.item_org_cost;


                        detail.rebate = Number(elem.item_rebate); // will be calculated anyways

                        // detail.profit = 5;
<<<<<<< HEAD
                        angular.forEach($scope.arr_discount_type, function (obj) {
=======
                        angular.forEach($scope.arr_discount_type, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (obj.id == elem.discount_type)
                                detail.discount_type_id = obj;
                        });

<<<<<<< HEAD
                        angular.forEach($scope.ec_goods_list, function (obj) {
=======
                        angular.forEach($scope.ec_goods_list, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (obj.id == elem.ec_goods)
                                detail.ec_goods = obj;
                        });

<<<<<<< HEAD
                        angular.forEach($scope.ec_description_list, function (obj) {
=======
                        angular.forEach($scope.ec_description_list, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (obj.id == elem.ec_description)
                                detail.ec_description = obj;
                        });

<<<<<<< HEAD
                        angular.forEach($rootScope.arr_vat_post_grp_sales, function (obj) {
=======
                        angular.forEach($rootScope.arr_vat_post_grp_sales, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (obj.id == elem.vat_id) {
                                detail.vats = obj;
                                detail.vat_id = obj.id;
                            }
                        });
                        console.log($rootScope.arr_vat_post_grp_sales);
                        console.log(detail.vat_id + ' SELECTED VAT ');

                        //vat reversed code
                        /* $scope.vat_refresh_counter = 1;	
                         var vat_refreshId = setInterval(function () {	
                            if (($rootScope.arr_vat_post_grp != undefined && $rootScope.arr_vat_post_grp[$rootScope.order_posting_group_id].length > 0)) {	
                                angular.forEach($rootScope.arr_vat_post_grp[$rootScope.order_posting_group_id], function (obj) {	
                                    if (obj.id == elem.vat_id)	
                                        detail.vats = obj;	
                                });	
                                clearInterval(vat_refreshId);	
                            }	
                            $scope.vat_refresh_counter += 1;	
                            if ($scope.vat_refresh_counter > 50) // wait for 25 seconds then efresh	
                            {	
                                $timeout(function () {	
                                    toaster.pop('error', 'Error', 'Server is not responding');	
                                    location.reload(true); // true for clear the cache	
                                }, 1000);	
                            }	
                        }, 500); */


                        detail.isGLVat = false;

                        if (elem.type == 1) {
                            //PBI: check is vat gl code.
                            if ($rootScope.defaultCompany == 133) {

<<<<<<< HEAD
                                
                                if (detail.product_code == elem.vatRange.gl1AccountCode || 
                                    detail.product_code == elem.vatRange.gl2AccountCode || 
                                    detail.product_code == elem.vatRange.gl3AccountCode) {
                                    detail.isGLVat = true;
                                }
                                else {
                                    detail.isGLVat = false;
                                }
                                
=======

                                if (detail.product_code == elem.vatRange.gl1AccountCode ||
                                    detail.product_code == elem.vatRange.gl2AccountCode ||
                                    detail.product_code == elem.vatRange.gl3AccountCode) {
                                    detail.isGLVat = true;
                                } else {
                                    detail.isGLVat = false;
                                }

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                detail.startVatRange = '';
                                detail.endVatRange = '';

                            } else {
                                if (detail.product_code >= elem.vatRange.startRangeCode && detail.product_code <= elem.vatRange.endRangeCode) {
                                    detail.isGLVat = true;
<<<<<<< HEAD
                                }
                                else {
=======
                                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    detail.isGLVat = false;
                                }
                                //vat ranges for gli listing
                                detail.startVatRange = elem.vatRange.startRangeCode;
                                detail.endVatRange = elem.vatRange.endRangeCode;
                            }
                        }

                        if (elem.type == 2) {
<<<<<<< HEAD
                            angular.forEach($scope.arr_service_units, function (index, _obj) {
=======
                            angular.forEach($scope.arr_service_units, function(index, _obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (_obj.id == elem.unit_measure_id)
                                    detail.units = _obj;
                            });
                        }
                        if (detail.item_type == 0) {
                            var item = $filter("filter")($scope.tempProdArr, { id: elem.item_id });
                            var idx = $scope.tempProdArr.indexOf(item[0]);
                            if (item.length > 0) {
                                /* if (item[0].arr_sales_price.response.length > 0)
                                   detail.arr_sales_price = item[0].arr_sales_price.response;
                               else 
                                   detail.arr_sales_price = [];
                                */


                                ///  un comment
                                if (item[0].sales_prices != undefined) {
                                    detail.sales_prices = item[0].sales_prices;
                                    // detail.standard_price   = detail.sales_prices.standard_price;
                                    detail.org_standard_price = detail.sales_prices.standard_price;
                                    detail.minSaleQty = detail.sales_prices.min_sale_qty;
                                    detail.maxSaleQty = detail.sales_prices.max_sale_qty;
                                }

                                if (detail.sales_prices && !(detail.sales_prices.arr_sales_price != undefined && detail.sales_prices.arr_sales_price.length > 0)) {
                                    detail.sales_prices.arr_sales_price = [];
                                }

                                // promotions
                                if (item[0].promotion != undefined) {
                                    detail.promotion = {};
                                    detail.promotion.gl_id = item[0].promotion.gl_id;
                                    detail.promotion.gl_code = item[0].promotion.gl_code;
                                    detail.promotion.gl_name = item[0].promotion.gl_name;
                                    detail.promotion.discount_type = item[0].promotion.discount_type;
                                    detail.promotion.discount_type = item[0].promotion.discount;
                                    detail.promotion.strategy_type = item[0].promotion.strategy_type;
                                    detail.promotion.strategy = item[0].promotion.strategy;
                                }
                                // volume discount
                                if (item[0].price_offer != undefined)
                                    detail.price_offer = item[0].price_offer;

                                if (item[0].price_offer_id != undefined)
                                    detail.price_offer_id = item[0].price_offer_id;

                                if (item[0].arr_volume_discounts != undefined)
                                    detail.arr_volume_discounts = item[0].arr_volume_discounts;

                                detail.minSaleQty = (Number(item[0].minSaleQty) > 0) ? Number(item[0].minSaleQty) : 1;
                                detail.maxSaleQty = (Number(item[0].maxSaleQty) > 0) ? Number(item[0].maxSaleQty) : 999999;
                                detail.org_standard_price = item[0].standard_price;
                                detail.temp_standard_price = item[0].standard_price;
<<<<<<< HEAD
                            }
                            else
=======
                            } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                detail.arr_sales_price = [];



                            detail.remainig_qty = detail.qty;
                            detail.sale_status = 0;

                            /*  var getAllStockUrl = $scope.$root.sales + "warehouse/get-order-stock-allocation";	
                             $http	
                                .post(getAllStockUrl, {	
                                    type: 2,	
                                    item_id: elem.item_id,	
                                    order_id: $scope.$root.order_id,	
                                    wh_id: elem.warehouse_id,	
                                    'token': $scope.$root.token	
                                })	
                                .then(function (res) {	
                                    if (res.data.ack == true) {	
                                        detail.sale_status = res.data.response[0].sale_status;	
                                        var ordqty = 0;	
                                        angular.forEach(res.data.response, function (elem) {	
                                            ordqty = Number(ordqty) + Number(elem.quantity);	
	
                                            if (flg == undefined && detail.stock_check == 1 && detail.sale_status == 1) {	
                                                $scope.hide_dispatch_btn = false;	
                                            }	
                                        });	
                                        if (ordqty > 0)	
                                            $scope.hide_btn_delete = true;	
                                        else	
                                            $scope.hide_btn_delete = false;	
	
                                        detail.remainig_qty = Number(detail.qty) - Number(ordqty);	
                                    }	
                                    else {	
                                        if (detail.stock_check == 1)	
                                            $scope.hide_dispatch_btn = false;	
                                        detail.remainig_qty = detail.qty;	
                                        detail.sale_status = 0;	
                                    }	
                                }); */

                            detail.allocated_stock = 0;
                            $scope.hide_dispatch_btn = true;
                            if (elem.item_stock_allocation != undefined) {
                                detail.item_stock_allocation = Number(elem.item_stock_allocation);

                                detail.sale_status = elem.sale_status;
                                if (detail.stock_check == 1 && detail.sale_status == 1) { //flg == undefined && 
                                    $scope.hide_dispatch_btn = false;
                                }

                                var ordqty = 0;
                                // angular.forEach(detail.item_stock_allocation, function (elem) {
                                //     ordqty = Number(ordqty) + Number(elem.quantity);

                                /* if (detail.stock_check == 1 && detail.sale_status == 1) { //flg == undefined && 
                                    $scope.hide_dispatch_btn = false;
                                } */
                                // });
                                if (Number(detail.item_stock_allocation) > 0)
                                    $scope.hide_btn_delete = true;
                                else
                                    $scope.hide_btn_delete = false;

                                detail.remainig_qty = Number(detail.qty) - Number(detail.item_stock_allocation);
                                detail.allocated_stock = Number(detail.item_stock_allocation);
<<<<<<< HEAD
                            }
                            else {
=======
                            } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                /* if (detail.stock_check == 1)
                                    $scope.hide_dispatch_btn = false; */
                                detail.remainig_qty = detail.qty;
                                detail.sale_status = 0;
                            }

<<<<<<< HEAD
                            if (item.length > 0)// && item[0].arr_warehouse != undefined)
=======
                            if (item.length > 0) // && item[0].arr_warehouse != undefined)
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            {
                                if (item[0].arr_warehouse != undefined)
                                    detail.arr_warehouse = (item[0].arr_warehouse != undefined && item[0].arr_warehouse.response != undefined) ? item[0].arr_warehouse.response : item[0].arr_warehouse;
                                if (item[0].arr_units != undefined)
                                    detail.arr_units = (item[0].arr_units != undefined && item[0].arr_units.response != undefined) ? item[0].arr_units.response : item[0].arr_units;
<<<<<<< HEAD
                            }
                            else {
=======
                            } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                detail.arr_warehouse = [];
                                detail.arr_units = [];
                            }

                            // if(detail.arr_warehouse.response)	
                            //     detail.arr_warehouse = detail.arr_warehouse.response;	
                            /* var waurl = $scope.$root.sales + "warehouse/get-items-warehouse";	
                            $http	
                                .post(waurl, { 'token': $scope.$root.token, 'item_id': detail.id })	
                                .then(function (res) {	
                                    if (res.data.ack == true) {	
                                        detail.arr_warehouse = res.data.response;	
                                    }	
                                });	
                             */
                            //  detail.arr_units = (item[0].arr_units.response != undefined) ? item[0].arr_units.response : item[0].arr_units;	

                            // if(detail.arr_units.response)	
                            //     detail.arr_units = detail.arr_units.response;	

                            /* var unitUrl_item = $scope.$root.sales + "stock/unit-measure/get-unit-setup-list-category";	
                           $http	
                               .post(unitUrl_item, { 'token': $scope.$root.token, 'item_id': detail.id })	
                               .then(function (res) {	
                                   if (res.data.ack == true)	
                                       detail.arr_units = res.data.response;	
                                }); */
                            // $timeout(function () {	
                            //     $scope.$root.$apply(function () {



<<<<<<< HEAD
                            angular.forEach(detail.arr_warehouse, function (obj, idx) {
=======
                            angular.forEach(detail.arr_warehouse, function(obj, idx) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (obj.id == elem.warehouse_id) {
                                    detail.warehouses = obj.id;
                                    detail.warehouse_name = obj.name;
                                    detail.selectedWarehouse = obj;
<<<<<<< HEAD
                                }
                                else if (obj.wh_status == 2) {
=======
                                } else if (obj.wh_status == 2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    var isExist = 0;
                                    if ($scope.items.length > 0) {
                                        var in_active_wh = $filter("filter")($scope.items, { warehouses: obj.id });
                                        if (in_active_wh != undefined && in_active_wh.length > 0)
                                            isExist = 1;
                                    }
                                    if (isExist == 0)
                                        detail.arr_warehouse.splice(idx, 1);
                                    else
                                        detail.arr_warehouse[idx].disabled = 1;
                                }
                            });


                            var count = $scope.items.length - 1;
<<<<<<< HEAD
                            angular.forEach(detail.arr_units, function (_obj) {
=======
                            angular.forEach(detail.arr_units, function(_obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (_obj.id == elem.unit_measure_id)
                                    detail.units = _obj;
                            });

<<<<<<< HEAD
                            angular.forEach(detail.arr_units, function (obj) {
=======
                            angular.forEach(detail.arr_units, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (obj.id == elem.default_unit_measure_id)
                                    $scope.items[detIndex].default_units = obj;
                            });



                            if (detail.sale_status == 1 && detail.stock_check == 1)
                                total_rec_recvie++;
                            if (detail.sale_status == 2)
                                total_rec_invice++;
                            if (detail.sale_status == 3) {
                                total_rec_recvie++;
                                total_rec_invice++;
                            }
                            if (detail.item_type == 1)
                                total_rec_invice++;


                            total_rec_recvie++;
                            total_rec_invice++;

                        }
                        if (detail.item_type == 1) {

                            // $timeout(function () {
                            //     $scope.$root.$apply(function () {

                            var count = $scope.items.length - 1;
<<<<<<< HEAD
                            angular.forEach($rootScope.gl_arr_units, function (_obj) {
=======
                            angular.forEach($rootScope.gl_arr_units, function(_obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (_obj.id == elem.unit_measure_id)
                                    detail.units = _obj;

                            });
                            //     });

                            // }, 2000);

                            total_rec_invice++;
                        }
                        //  console.log(detail.arr_warehouse);
                        $scope.items.push(detail);


<<<<<<< HEAD
                        if (detail.sale_status == 0)// || detail.sale_status == 1)
=======
                        if (detail.sale_status == 0) // || detail.sale_status == 1)
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            $scope.checkDuplWHItem(detail, detIndex);
                    });
                    // console.table($scope.allWarehouseEmails);
                    if ($scope.isInvoice == 0) { //&& flg == undefined
                        $scope.getPriceOffers(1);
                        $scope.getPromotions(2); // parameter (2) is not used
                        $scope.getItemMarginCost();
                        $scope.getItemsPricesAndVolumeDiscounts();

                        var unit_frieght_charge = (total_items_qty > 0 && Number($scope.rec.freight_charges) > 0) ? (Number($scope.rec.freight_charges) / Number(total_items_qty)) : 0;

<<<<<<< HEAD
                        angular.forEach($scope.items, function (item) {
                            if (item.item_type == 0) {
                                item.item_frieght_charges = Number(unit_frieght_charge) * Number(item.qty);
                            }
                            else {
=======
                        angular.forEach($scope.items, function(item) {
                            if (item.item_type == 0) {
                                item.item_frieght_charges = Number(unit_frieght_charge) * Number(item.qty);
                            } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                item.item_frieght_charges = 0;
                            }
                        });
                    }

                    // $scope.getItemsSalesPrice(1);

                    $scope.$emit('SalesLines', $scope.items);
                    var item = $filter("filter")($scope.items, { item_type: 0, stock_check: 1 });
                    if (item != undefined && item.length) {
                        $scope.show_btn_dispatch_stuff = true;
<<<<<<< HEAD
                    }
                    else
=======
                    } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.show_btn_dispatch_stuff = false;

                    /* var item_check_dispatched = $filter("filter")($scope.items, { item_type: 0, stock_check: 1, sale_status:0 });
                    if (item_check_dispatched != undefined && item_check_dispatched.length) {
                        $scope.hide_dispatch_btn = false;
                    }
                    else
                        $scope.hide_dispatch_btn = true; */
<<<<<<< HEAD
                    var item_check_dispatched = $filter('filter')($scope.items, function (value) {
=======
                    var item_check_dispatched = $filter('filter')($scope.items, function(value) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        return value.item_type == 0 && value.stock_check == 1 && value.sale_status <= 1;
                    });

                    if (item_check_dispatched != undefined && item_check_dispatched.length) {
                        $scope.hide_dispatch_btn = false;
<<<<<<< HEAD
                    }
                    else
=======
                    } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.hide_dispatch_btn = true;

                    if (total_rec_recvie > 0) {
                        $scope.enable_btn_dispatch = true;
                        //$scope.show_recieve_list = true;
                        $scope.show_recieve_list_anchor = false;
                    }
                    if (total_rec_invice > 0) {
                        $scope.enable_btn_invoice = true;
                        //$scope.show_recieve_list = true;
                        $scope.show_recieve_list_anchor = false;
                    }
                    if (rsQtItem.data.total == 0) {
                        $scope.submit_show_invoicee = true;
                        $scope.show_recieve_list_anchor = true;
                    }


                    $scope.volume = rsQtItem.data.volume;
                    $scope.weight = rsQtItem.data.weight;
                    $scope.volume_unit = rsQtItem.data.volume_unit;
                    $scope.weightunit = rsQtItem.data.weightunit;
                    $scope.weight_permission = rsQtItem.data.weight_permission;
                    $scope.volume_permission = rsQtItem.data.volume_permission;

                    if (($scope.weight_permission > 0 && $scope.weight && $scope.weight != 0) || ($scope.volume_permission > 0 && $scope.volume && $scope.volume != 0))
                        $scope.showVolumeWeight = 1;

                    $scope.showLoader = false;
<<<<<<< HEAD
                }
                else
=======
                } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.showLoader = false;
            });
        // end response handling
        $scope.chk_allocation_nd_dispatch();
    }
    $scope.linkedItemShowCols = [
        "No.", "description", "warehouse_name"
    ];
<<<<<<< HEAD
    $scope.LinkGLToItem = function (item, gl) {
=======
    $scope.LinkGLToItem = function(item, gl) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        gl.ref_id = item.update_id;
        console.log($scope.items);
    }

<<<<<<< HEAD
    $scope.NavigateOrder = function (rec) {
=======
    $scope.NavigateOrder = function(rec) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.searchKeyword = {};
        $scope.searchKeyword.navigate_search = "";

        $scope.navigate_data = {};
        $scope.navigate_title = 'Sales Invoice No. ' + $scope.$root.model_code;
        $scope.navigate_type = 1;

        $scope.navigatePostingDate = '';
        $scope.navigatePostingByName = '';

        var navigate_url = $scope.$root.sales + "customer/order/navigate-invoice";
        var postData = {
            'token': $scope.$root.token,
            'type': 1,
            'object_id': rec.id
        };
        $scope.showLoader = true;
        $http
            .post(navigate_url, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == 1) {
                    $scope.navigate_data = res.data.response;
                    $scope.navigatePostingDate = res.data.posted_on;
                    $scope.navigatePostingByName = res.data.posted_by_name;
                }

                if (res.data.ack != undefined)
                    $scope.showLoader = false;

            });

        angular.element('#order_navigate_modal').modal({ show: true });
    }
<<<<<<< HEAD
    $scope.orderCompete = function () {
        var completeOrder = [];
        angular.forEach($scope.items, function (elem, index) {
=======
    $scope.orderCompete = function() {
        var completeOrder = [];
        angular.forEach($scope.items, function(elem, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            var cmpOrder = {};
            cmpOrder.product_id = elem.id;
            cmpOrder.type = elem.item_type;
            cmpOrder.g_product_positing = elem.g_product_positing;
            cmpOrder.v_product_positing = elem.v_product_positing;
            cmpOrder.inventory_positing = elem.inventory_positing;
            cmpOrder.g_customer_positing = elem.g_customer_positing;
            cmpOrder.vat_customer_positing = elem.vat_customer_positing;
            cmpOrder.customer_positing = elem.customer_positing;
            cmpOrder.unit_mesure = elem.unit_measure_id;
            cmpOrder.amount = $scope.rowTotal(elem);
            cmpOrder.vat = elem.Vat;
            cmpOrder.qty = elem.qty;
            cmpOrder.posting_date = $scope.$root.posting_date;
            cmpOrder.cust_id = $scope.$root.crm_id;
            cmpOrder.order_id = $scope.$root.order_id;
            cmpOrder.sale_order_no = $scope.$root.sale_order_no;
            completeOrder.push(cmpOrder);
        });

        $http
            .post('api/chart_of_accounts/general_ledger_entry', completeOrder)
<<<<<<< HEAD
            .then(function (result) {
                if (result.data == '0') {
                    toaster.pop("error", "Error", "Order can't be completed! Product head is not set!");
                }
                else {
=======
            .then(function(result) {
                if (result.data == '0') {
                    toaster.pop("error", "Error", "Order can't be completed! Product head is not set!");
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    toaster.pop("success", "Completed", "Order completed.");
                    $scope.check_order_complete = 0;
                }
            });

    }

    $scope.stock_item = [];
    $scope.all_wh_stock = [];
    $scope.all_order_stock = {};
    $scope.remainig_qty = 0;
    $scope.order_qty = 0;
    $scope.current_stock = 0;
<<<<<<< HEAD
    $scope.getAllocatStock = function (warehouse_id, item_id, order_id, sale_order_detail_id, show_popup) {
=======
    $scope.getAllocatStock = function(warehouse_id, item_id, order_id, sale_order_detail_id, show_popup) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var isInvoice = 0;
        if ($scope.rec.type2 == 2) {
            isInvoice = 1;
        }
        $scope.all_wh_stock = [];
        var getStockUrl = $scope.$root.sales + "warehouse/get-purchase-stock";
        $scope.showLoader = true;
        $http
            .post(getStockUrl, {
                'warehouse_id': warehouse_id,
                type: 1,
                'sale_order_detail_id': sale_order_detail_id,
                item_id: item_id,
                order_id: order_id,
                isInvoice: isInvoice,
                'token': $scope.$root.token
            })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                //console.log(res.data.remaining_stock);
                if (res.data.ack == true) {
                    $scope.all_wh_stock = res.data.response;
                    $scope.stock_item.total_available_qty = 0;
<<<<<<< HEAD
                    angular.forEach($scope.all_wh_stock, function (obj) {
=======
                    angular.forEach($scope.all_wh_stock, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.stock_item.total_available_qty += Number(obj.avail_qty);
                    });
                    $scope.showLoader = false;
                    if (show_popup != undefined && show_popup == 1)
                        angular.element('#stockAllocationModal').modal({ show: true });
<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.showLoader = false;
                    $scope.all_wh_stock = [];
                    $scope.stock_item.total_available_qty = 0;
                    toaster.pop('error', 'Error', "No records found !");
                }
            });

    }

<<<<<<< HEAD
    $scope.stock_allocate_detail = function (item_id, show, warehouse_id, update_id) {
=======
    $scope.stock_allocate_detail = function(item_id, show, warehouse_id, update_id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.all_order_stock = [];
        var getAllStockUrl = $scope.$root.sales + "warehouse/get-order-stock-allocation";
        $http
            .post(getAllStockUrl, {
                type: 2,
                item_id: item_id,
                order_id: $scope.$root.order_id,
                sale_order: '1',
                'sale_order_detail_id': update_id,
                wh_id: warehouse_id,
                'token': $scope.$root.token
            })
<<<<<<< HEAD
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.all_order_stock = res.data.response;
                    var ordqty = 0;
                    angular.forEach(res.data.response, function (elem) {
=======
            .then(function(res) {
                if (res.data.ack == true) {
                    $scope.all_order_stock = res.data.response;
                    var ordqty = 0;
                    angular.forEach(res.data.response, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        ordqty = Number(ordqty) + Number(elem.quantity);
                    });
                    if (ordqty > 0)
                        $scope.hide_btn_delete = true;
                    else
                        $scope.hide_btn_delete = false;

                    $scope.remainig_qty = Number($scope.order_qty) - Number(ordqty);
                    console.log($scope.remainig_qty);
                    if (show == 3) {
<<<<<<< HEAD
                        angular.forEach($scope.items, function (obj, index) {
=======
                        angular.forEach($scope.items, function(obj, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (obj.id == item_id && (obj.warehouse_id == warehouse_id || obj.warehouses == warehouse_id) && obj.update_id == update_id) {
                                $scope.items[index].remainig_qty = $scope.remainig_qty;
                                $scope.items[index].sale_status = res.data.response[0].sale_status;
                            }
                        });

                    }
<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.all_order_stock = [];
                    $scope.hide_btn_delete = false;
                    $scope.remainig_qty = $scope.order_qty;
                    if (show == 3) {
<<<<<<< HEAD
                        angular.forEach($scope.items, function (obj, index) {
=======
                        angular.forEach($scope.items, function(obj, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (obj.id == item_id && (obj.warehouse_id == warehouse_id || obj.warehouses == warehouse_id) && obj.update_id == update_id) {
                                $scope.items[index].remainig_qty = $scope.order_qty;
                                $scope.items[index].sale_status = 0;
                            }
                        });
                    }
                }
            });

        if (show == 1)
            angular.element('#stockAllocationDetailModal').modal({ show: true });
    }
<<<<<<< HEAD
    $scope.current_stock_by_id = function (warehouse_id, item_id) {
=======
    $scope.current_stock_by_id = function(warehouse_id, item_id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.all_order_stock = [];
        var getAllStockUrl = $scope.$root.sales + "warehouse/get-curent-stock-by-product-id-warehouse";
        $http
            .post(getAllStockUrl, {
                'item_id': item_id,
                'warehouse_id': warehouse_id,
                'token': $scope.$root.token
            })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true)
                    $scope.current_stock = res.data.current_stock;

                if ((res.data.ack == false || $scope.current_stock == 0) && $scope.rec.type2 != 2)
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(509));


            });

    }

<<<<<<< HEAD
    $scope.allocateStock = function (drpWH, item) {
=======
    $scope.allocateStock = function(drpWH, item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (item.units == undefined || Number(item.units) == 0) {
            toaster.pop('error', 'Info', 'Please select Unit Of Measure');
            return;
        }

        if (item.qty == undefined || Number(item.qty) == 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Quantity']));
            return;
        }

        if (item.warehouses == undefined || Number(item.warehouses) == 0) {
            toaster.pop('error', 'Info', 'Please select Warehouse');
            return;
        }
        /* var chk_item = $filter("filter")(item.arr_warehouse, { id: item.warehouses });
        
        if (chk_item[0].available_quantity == undefined || Number(chk_item[0].available_quantity) < Number(item.qty)) {
            toaster.pop('error', 'Info', 'Available quantity ' + chk_item[0].available_quantity + ' is less then requested quantity ' + item.qty);
            return;
        } */

        /*  if (Number(item.standard_price) == 0) {
             toaster.pop('error', 'Info', 'Plase specify Standard Price');
             return;
         } */


        var orderUrl = $scope.$root.sales + "customer/order/add-single-order-item";
        //$timeout(function () {
        $scope.showLoader = true;
        item.order_id = $scope.$root.order_id;
        item.order_date = $scope.$root.posting_date;
        item.currency_id = $scope.$root.c_currency_id;
        item.comment = $scope.rec.note;

        var rec2 = {};
        rec2.item = item;
        rec2.token = $rootScope.token;

        $scope.allocation_title = ($scope.$parent.rec.type2 == 2) ? 'Sales Invoice' : 'Sales Order';
        $scope.$root.model_code = ($scope.$parent.rec.sale_invioce_code != '' && $scope.$parent.rec.sale_invioce_code != null) ? $scope.$parent.rec.sale_invioce_code : $scope.$parent.rec.sale_order_code;

        if ($scope.rec.type2 != 2) {
            $http
                .post(orderUrl, rec2)
<<<<<<< HEAD
                .then(function (res) {
=======
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        // $scope.showLoader = false;
                        item.update_id = res.data.id;
                        $scope.$root.load_date_picker('sale order');
                        $scope.stock_item = item;
                        $scope.order_qty = item.qty;
                        $scope.getAllocatStock(drpWH, item.id, item.order_id, item.update_id, 1);
                        $scope.stock_allocate_detail(item.id, 0, drpWH, item.update_id);
                        $scope.current_stock_by_id(drpWH, item.id);
                        $scope.UpdateGrandTotal();
                        $scope.searchKeyword = {};
                        // angular.element('#stockAllocationModal').modal({ show: true });
                    } else {
                        // $scope.showLoader = false;
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(104));
                    }
                });
<<<<<<< HEAD
        }
        else {
=======
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            // $scope.showLoader = false;
            $scope.$root.load_date_picker('sale order');
            $scope.stock_item = item;
            $scope.order_qty = item.qty;
            $scope.getAllocatStock(drpWH, item.id, item.order_id, item.update_id, 1);
            $scope.stock_allocate_detail(item.id, 0, drpWH, item.update_id);
            $scope.current_stock_by_id(drpWH, item.id);
            $scope.searchKeyword = {};
            angular.element('#stockAllocationModal').modal({ show: true });
        }

    }
<<<<<<< HEAD
    $scope.OnFocusQty = function (stock_item) {
        stock_item.active_line = true;
    }
    $scope.OnBlurQty = function (stock_item) {
        stock_item.active_line = false;
    }

    $scope.addStockItem = function (stock, stock_item) {
=======
    $scope.OnFocusQty = function(stock_item) {
        stock_item.active_line = true;
    }
    $scope.OnBlurQty = function(stock_item) {
        stock_item.active_line = false;
    }

    $scope.addStockItem = function(stock, stock_item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        stock.active_line = false;

        if (Number(stock.req_qty) <= 0 || stock.req_qty == undefined) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(238, ['Quantity ', '0']));
            return false;
        }
        if (Number(stock.req_qty) > Number(stock.avail_qty)) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(359));
            return false;
        }
        if (Number($scope.remainig_qty) == 0) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(510));
            return false;
        }
        if (Number(stock.req_qty) > Number($scope.remainig_qty)) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(359));
            return false;
        }


        var addStockUrl = $scope.$root.sales + "warehouse/add-order-stock-allocation";
        stock.token = $scope.$root.token;
        // stock.source_type = stock.type;
        stock.type = 2;
        stock.sale_order_detail_id = stock_item.update_id;
        stock.order_id = $scope.$root.order_id;
        stock.bl_shipment_no = stock.bl_shipment_no;
        stock.item_id = stock_item.id;
        // stock.warehouse_id = stock_item.warehouses.id;
        stock.warehouse_id = stock_item.warehouses;
        stock.order_date = $scope.$root.order_date;
        stock.units = stock_item.units;
        stock.default_units = stock_item.default_units;

        stock.primary_unit_id = stock_item.primary_unit_of_measure_id;
        stock.primary_unit_name = stock_item.primary_unit_of_measure_name;
        stock.sale_return_status = 0;
        $scope.showLoader = true;
        $http
            .post(addStockUrl, stock)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                if (res.data.ack == true) {

                    stock.active_line = true;
                    if (stock.id > 0) {
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                        if ($rootScope.ConvertDateToUnixTimestamp(stock.use_by_date) < $rootScope.ConvertDateToUnixTimestamp($scope.$root.get_current_date()))
                            toaster.pop('warning', 'Warning', 'Used by date of allocated item has already passed');
<<<<<<< HEAD
                    }
                    else
=======
                    } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        toaster.pop('success', 'Add', 'Record  Inserted  .');

                    // $scope.getAllocatStock(stock_item.warehouses, stock_item.id, $scope.$root.order_id);
                    stock.allocated_qty = Number(stock.allocated_qty) + Number(stock.req_qty);
                    stock.currently_allocated_qty = Number(stock.currently_allocated_qty) + Number(stock.req_qty);
                    stock.avail_qty = Number(stock.avail_qty) - Number(stock.req_qty);
                    stock_item.total_available_qty = Number(stock_item.total_available_qty) - Number(stock.req_qty);
                    stock_item.allocated_stock = stock_item.allocated_stock + stock.req_qty;

                    // $scope.stock_allocate_detail(stock_item.id, 3, stock_item.warehouses, stock_item.update_id);

                    var selected_current_items = $filter("filter")($scope.items, { id: stock.item_id });
                    var global_items = $filter("filter")($scope.tempProdArr, { id: stock.item_id });

                    /* angular.forEach(selected_current_items, function (item, obj_index) {
                        var chk_item = $filter("filter")(item.arr_warehouse, { id: stock.warehouse_id });
                        var idx = item.arr_warehouse.indexOf(chk_item[0]);
                        item.arr_warehouse[idx].available_quantity = item.arr_warehouse[idx].available_quantity - stock.req_qty;
                    });

                    angular.forEach(global_items, function (item, obj_index) {
                        var arr_warehouse = (item.arr_warehouse != undefined && item.arr_warehouse.response != undefined) ? item.arr_warehouse.response : item.arr_warehouse;
                        var chk_item = $filter("filter")(arr_warehouse, { id: stock.warehouse_id });
                        var idx = arr_warehouse.indexOf(chk_item[0]);
                        arr_warehouse[idx].available_quantity = arr_warehouse[idx].available_quantity - stock.req_qty;
                    }); */
                    stock.req_qty = '';

                    // $scope.getAllocatStock(stock_item.warehouses, stock_item.id, $scope.$root.order_id, stock_item.update_id,0);
                    $scope.stock_allocate_detail(stock_item.id, 3, stock_item.warehouses, stock_item.update_id);
                    $scope.current_stock_by_id(stock_item.warehouses, stock_item.id);
                    $scope.getItemMarginCost(1);
                    $scope.showLoader = false;
<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    // $scope.stock_allocate_detail(stock_item.id, 3, stock_item.warehouses, stock_item.update_id);
                    // $scope.getAllocatStock(stock_item.warehouses, stock_item.id, $scope.$root.order_id);

                    $scope.getAllocatStock(stock_item.warehouses, stock_item.id, $scope.$root.order_id, stock_item.update_id, 0);
                    $scope.stock_allocate_detail(stock_item.id, 0, stock_item.warehouses, stock_item.update_id);
                    $scope.current_stock_by_id(stock_item.warehouses, stock_item.id);
                    $scope.showLoader = false;
                    toaster.pop('error', 'Edit', res.data.error);
                }
            });
    }

<<<<<<< HEAD
    $scope.delStockItem = function (stock, stock_item) {
=======
    $scope.delStockItem = function(stock, stock_item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        stock.active_line = false;

        if (isNaN(stock.req_qty)) {
            stock.req_qty = 0;
            toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(319, ['Quantity', '0']));
            return;
        }

        if (Number(stock.req_qty) <= 0) {
            stock.req_qty = 0;
            toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(319, ['Quantity', '0']));
            return;
        }

        if (Number(stock.req_qty) > Number(stock.currently_allocated_qty)) {
            toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(364));
            return;
        }

        var postData = stock;
        postData.order_id = $scope.$root.order_id;
        stock.sale_order_detail_id = stock_item.update_id;
        stock.item_id = stock_item.id;
        // stock.source_type = stock.type;
        stock.sale_return_status = 0 // will be zero when we allocate stock to sales order;

        postData.token = $scope.$root.token;
        if (stock.req_qty == stock.currently_allocated_qty)
            var delStockUrl = $scope.$root.sales + "warehouse/delete-sale-order-stock";
        else
            var delStockUrl = $scope.$root.sales + "warehouse/deallocate-sale-order-stock";
        /*console.log(stock);
         return;*/
        $scope.showLoader = true;
        $http
            .post(delStockUrl, { 'postData': postData, 'token': $scope.$root.token })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    stock.active_line = true;
                    // $scope.getAllocatStock(stock.warehouse_id, stock.product_id, stock.order_id);
                    stock.allocated_qty = Number(stock.allocated_qty) - Number(stock.req_qty);
                    stock.currently_allocated_qty = Number(stock.currently_allocated_qty) - Number(stock.req_qty);
                    stock.avail_qty = Number(stock.avail_qty) + Number(stock.req_qty);
                    stock_item.total_available_qty = Number(stock_item.total_available_qty) + Number(stock.req_qty);
                    stock_item.allocated_stock = stock_item.allocated_stock - Number(stock.req_qty);

                    // $scope.stock_allocate_detail(stock.product_id, 3, stock.warehouse_id, stock_item.update_id);
                    // $scope.chk_allocation_nd_dispatch();

                    var selected_current_items = $filter("filter")($scope.items, { id: stock.item_id });
                    var global_items = $filter("filter")($scope.tempProdArr, { id: stock.item_id });

                    /* angular.forEach(selected_current_items, function (item, obj_index) {
                        var chk_item = $filter("filter")(item.arr_warehouse, { id: stock.warehouse_id });
                        var idx = item.arr_warehouse.indexOf(chk_item[0]);
                        item.arr_warehouse[idx].available_quantity = item.arr_warehouse[idx].available_quantity + stock.req_qty;
                    });

                    angular.forEach(global_items, function (item, obj_index) {
                        var arr_warehouse = (item.arr_warehouse != undefined && item.arr_warehouse.response != undefined) ? item.arr_warehouse.response : item.arr_warehouse;
                        var chk_item = $filter("filter")(arr_warehouse, { id: stock.warehouse_id });
                        var idx = arr_warehouse.indexOf(chk_item[0]);
                        arr_warehouse[idx].available_quantity = arr_warehouse[idx].available_quantity + stock.req_qty;
                    }); */

                    stock.req_qty = '';

                    $scope.getAllocatStock(stock_item.warehouses, stock_item.id, $scope.$root.order_id, stock_item.update_id, 0);
                    $scope.stock_allocate_detail(stock_item.id, 3, stock_item.warehouses, stock_item.update_id);
                    $scope.current_stock_by_id(stock_item.warehouses, stock_item.id);
                    $scope.getItemMarginCost(1);
                    $scope.showLoader = false;
<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.getAllocatStock(stock_item.warehouses, stock_item.id, $scope.$root.order_id, stock_item.update_id, 0);
                    $scope.stock_allocate_detail(stock_item.id, 0, stock_item.warehouses, stock_item.update_id);
                    $scope.current_stock_by_id(stock_item.warehouses, stock_item.id);
                    $scope.showLoader = false;
                    toaster.pop('error', 'Edit', res.data.error);
                }

            });

    }

<<<<<<< HEAD
    $scope.AllocateInFull = function (stock, stock_item) {
        console.log(stock);
        console.log($scope.remainig_qty);

        var already_allocated = 0;
        /* angular.forEach($scope.all_wh_stock, function(obj){
            if(Number(obj.req_qty) > 0)
                already_allocated = already_allocated + Number(obj.req_qty);
        }); */

        if (stock.allocate_in_full) {
            if (Number($scope.remainig_qty - already_allocated) == 0) {
                toaster.pop('error', 'error', $scope.$root.getErrorMessageByCode(630));
                stock.allocate_in_full = false;
                return;
            }

            console.log('true');
            if (($scope.remainig_qty - already_allocated) <= stock.avail_qty) {
                stock.req_qty = Number($scope.remainig_qty - already_allocated);
                $scope.addStockItem(stock, stock_item);
            }
            else if (Number(stock.avail_qty) > 0) {
                stock.req_qty = Number(stock.avail_qty);
                $scope.addStockItem(stock, stock_item);
            }
            else {
                toaster.pop('error', 'error', $scope.$root.getErrorMessageByCode(630));
                stock.allocate_in_full = false;
            }
        }
        else {
            stock.req_qty = stock.currently_allocated_qty;
            $scope.delStockItem(stock, stock_item);
            console.log('false');
        }
    }
    /* $scope.delAllocateStockItem = function (ostk) {
        var delStockUrl = $scope.$root.sales + "warehouse/delete-sale-order-stock";
        $http
            .post(delStockUrl, { id: ostk.id, token: $scope.$root.token })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.getAllocatStock(ostk.warehouse_id, ostk.product_id, ostk.order_id);
                    $scope.stock_allocate_detail(ostk.product_id, 3, ostk.warehouse_id);
                    $scope.chk_allocation_nd_dispatch();
                }

            });

    } */
=======
    $scope.AllocateInFull = function(stock, stock_item) {
            console.log(stock);
            console.log($scope.remainig_qty);

            var already_allocated = 0;
            /* angular.forEach($scope.all_wh_stock, function(obj){
                if(Number(obj.req_qty) > 0)
                    already_allocated = already_allocated + Number(obj.req_qty);
            }); */

            if (stock.allocate_in_full) {
                if (Number($scope.remainig_qty - already_allocated) == 0) {
                    toaster.pop('error', 'error', $scope.$root.getErrorMessageByCode(630));
                    stock.allocate_in_full = false;
                    return;
                }

                console.log('true');
                if (($scope.remainig_qty - already_allocated) <= stock.avail_qty) {
                    stock.req_qty = Number($scope.remainig_qty - already_allocated);
                    $scope.addStockItem(stock, stock_item);
                } else if (Number(stock.avail_qty) > 0) {
                    stock.req_qty = Number(stock.avail_qty);
                    $scope.addStockItem(stock, stock_item);
                } else {
                    toaster.pop('error', 'error', $scope.$root.getErrorMessageByCode(630));
                    stock.allocate_in_full = false;
                }
            } else {
                stock.req_qty = stock.currently_allocated_qty;
                $scope.delStockItem(stock, stock_item);
                console.log('false');
            }
        }
        /* $scope.delAllocateStockItem = function (ostk) {
            var delStockUrl = $scope.$root.sales + "warehouse/delete-sale-order-stock";
            $http
                .post(delStockUrl, { id: ostk.id, token: $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.getAllocatStock(ostk.warehouse_id, ostk.product_id, ostk.order_id);
                        $scope.stock_allocate_detail(ostk.product_id, 3, ostk.warehouse_id);
                        $scope.chk_allocation_nd_dispatch();
                    }

                });

        } */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


    /*$http
     .post(convInvoiceUrl, {id:$scope.$root.order_id,purchase_code_number:fres.data.response.purchase_code_number,purchase_code_id:fres.data.response.purchase_code_id,token:$scope.$root.token})
     .then(function (res) {
     if(res.data.ack == true){
     toaster.pop('success', 'Info', "Invoice posted successfully.");
     var finUrl = $scope.$root.sales + "customer/customer/get-customer-finance";//get-finance-by-customer-id";
     $http
     .post(finUrl, {customer_id:$scope.$root.crm_id,token:$scope.$root.token})
     .then(function (fres) {
     
     });
     angular.element("#goToNewOrder").click();
     }
     });*/

    // convert to purchase Order
<<<<<<< HEAD
    $scope.convertToPurchaseOrder = function (rec, rec2) {
=======
    $scope.convertToPurchaseOrder = function(rec, rec2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $rootScope.quote_post_invoice_msg = "Are you sure you want to convert this quote to a Purchase Order?";
        $scope.add_general(rec, rec2);

        ngDialog.openConfirm({
            template: '_confirm_quote_to_order_invoice_modal',
            className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
        }).then(function (value) {
=======
        }).then(function(value) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


            var convertUrl = $scope.$root.sales + "customer/order/convert-quote-to-purchase-order";

            $http
                .post(convertUrl, { 'id': $scope.$root.order_id, 'token': $scope.$root.token })
<<<<<<< HEAD
                .then(function (res2) {
=======
                .then(function(res2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res2.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(229, ['Purchase Order']));
                        $state.go("app.editsrmorder", {
                            id: res2.data.id
                        });
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(235, ['to Purchase Order']));
                    }
                });

<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

<<<<<<< HEAD
    $scope.convert_to_sale_order = function (rec, rec2) {
=======
    $scope.convert_to_sale_order = function(rec, rec2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if ($scope.rec.account_type == 2) {
            toaster.pop('error', 'error', $scope.$root.getErrorMessageByCode(662));
            return;

        }
        $rootScope.quote_post_invoice_msg = "Are you sure you want to convert this quote to a Sales Order?";


        ngDialog.openConfirm({
            template: '_confirm_quote_to_order_invoice_modal',
            className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
        }).then(function (value) {
=======
        }).then(function(value) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            // $scope.add_general(rec, rec2, void 0, 2);

            $scope.load_quote();

<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

<<<<<<< HEAD
    $scope.load_quote = function () {
=======
    $scope.load_quote = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var convertUrl = $scope.$root.sales + "customer/order/convert-quote-to-sale-order";
        $scope.showLoader = true;
        $http
            .post(convertUrl, { 'id': $scope.$root.order_id, 'token': $scope.$root.token })
<<<<<<< HEAD
            .then(function (res2) {
=======
            .then(function(res2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res2.data.ack == true) {
                    $scope.showLoader = false;
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(229, ['Sales Order']));

                    //10 seconds delay
<<<<<<< HEAD
                    $timeout(function () {
=======
                    $timeout(function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.UpdateGrandTotal();

                        $state.go("app.viewOrder", {
                            id: $scope.$root.order_id
                        });
                    }, 500);

                } else {
                    $scope.showLoader = false;
                    toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(235, ['to Sales Order']));
                }
            });
        /* var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
        var name = $scope.$root.base64_encode('orders');
        var module_category_id = 2;
        $http
            .post(getCodeUrl, {
                'is_increment': 1,
                'token': $scope.$root.token,
                'tb': name,
                'category': '',
                'brand': '',
                'module_category_id': module_category_id,
                'type': '1,2'
            })
            .then(function (res) {

                if (res.data.ack == 1) {
                    $http
                        .post(convertUrl, { 'id': $scope.$root.order_id, 'code': res.data.code, 'token': $scope.$root.token })
                        .then(function (res2) {
                            if (res2.data.ack == true) {
                                
                                $state.go("app.viewOrder", {
                                    id: $scope.$root.order_id
                                });
                            } else {
                                toaster.pop('error', 'Deleted', 'Can\'t converted to Sales Order!');
                            }
                        });
                }
            }); */
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
<<<<<<< HEAD
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    function findObjectByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return i;
            }
        }
        return null;
    }


<<<<<<< HEAD
    $scope.showInvoiceModal = function (templateType, noModal, _options) {
=======
    $scope.showInvoiceModal = function(templateType, noModal, _options) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $rootScope.printinvoiceFlag = false;
        if (templateType == "salesDelivery") {
            var tempIdName = '#delivery_note_modal';
        } else if (templateType == "salesWarehouse") {
            var tempIdName = '#warehouse_instructions_modal';
        } else if (templateType == "salesOrder") {
            var tempIdName = '#sales_order_modal';
        } else if (templateType == "salesQuote") {
            var tempIdName = '#sales_order_modal';
        } else if (templateType == "salesInvoice") {
            var tempIdName = '#sales_order_modal';
        } else if (templateType == "purchaseOrder") {
            var tempIdName = '#purchase_order_modal';
        } else if (templateType == "purchaseDelivery") {
            var tempIdName = '#delivery_note_modal';
        } else if (templateType == "purchaseWarehouse") {
            var tempIdName = '#warehouse_instructions_modal';
        } else if (templateType == "purchaseInvoice") {
            var tempIdName = '#purchase_invoice_modal';
        } else if (templateType == "creditNote") {
            var tempIdName = '#credit_note_modal';
        } else if (templateType == "postedCreditNote") {
            var tempIdName = '#credit_note_modal';
        } else if (templateType == "debitNote") {
            var tempIdName = '#debit_note_modal';
        } else if (templateType == "postedDebitNote") {
            var tempIdName = '#debit_note_modal';
        } else if (templateType == "receiptNote") {
            var tempIdName = '#receipt_note_modal';
        }

        document.querySelectorAll(tempIdName).forEach(e => e.parentNode.removeChild(e));
        /* if ($scope.check_so_readonly == false){
            toaster.pop('error', 'Error', 'Please Save');     
            return;
        } */
        /* if (($scope.rec.bill_to_bank_name == null || $scope.rec.bill_to_bank_name == "") && (noModal == undefined || noModal != 2)){
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Payable Bank']));     
            return;
        } */
        $scope.showLoader = true;
        $scope.print_invoice_vals = {};
        var prntInvoiceUrl = $scope.$root.sales + "customer/order/print-invoice";
        var separate_by_warehouse = 0;
        if (templateType == 'salesDelivery' || templateType == 'salesWarehouse')
            separate_by_warehouse = 1;

        var separate_by_allocation = 0;
        if (templateType == 'salesWarehouse')
            separate_by_allocation = 1;
        $http
            .post(prntInvoiceUrl, {
                id: $scope.$root.order_id,
                'type': '1',
                'templateType': templateType,
                'separate_by_warehouse': separate_by_warehouse,
                'separate_by_allocation': separate_by_allocation,
                token: $scope.$root.token
            })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    $scope.showLoader = false;
                    $scope.print_invoice_vals = res.data.response;
                    $scope.print_invoice_vals.discountedValue = $rootScope.discountedSalesOrder;
                    $scope.print_invoice_vals.templateType = templateType;
                    $scope.print_invoice_vals.total_records = Object.keys($scope.print_invoice_vals.doc_details_arr);
                    /* if ($scope.print_invoice_vals.address_1 == $scope.print_invoice_vals.ship_address_1 
                        && $scope.print_invoice_vals.address_2 == $scope.print_invoice_vals.ship_address_2
                        && $scope.print_invoice_vals.postcode == $scope.print_invoice_vals.ship_postcode){
                        $scope.print_invoice_vals.ship_address_1 = '';
                        $scope.print_invoice_vals.ship_address_2 = '';
                        $scope.print_invoice_vals.ship_city = '';
                        $scope.print_invoice_vals.ship_county = '';
                        $scope.print_invoice_vals.ship_postcode = '';
                    } */
                    // console.log($scope.print_invoice_vals);
                    // console.log($scope.print_invoice_vals.doc_details_arr);
                    $scope.print_invoice_vals.uom_qty_total = new Array();
                    /* if ($scope.print_invoice_vals.templateType == 'salesWarehouse'){
                        var qty = [];
                        var uom_qty = [];
                        var total_pallet_qty = [];

                        angular.forEach($scope.print_invoice_vals.doc_details_arr, function(obj, index) {
                            qty.push(Number(obj.quantity));
                            uom_qty.push(Number(obj.uom_qty));
                            total_pallet_qty.push(Number(obj.pallet_qty));

                            idx = findObjectByKey($scope.print_invoice_vals.uom_qty_total, 'uom', obj.uom);
                            if (idx == null) {
                                $scope.print_invoice_vals.uom_qty_total.push({ 'uom': obj.uom, 'total_qty': 0 });
                                $scope.print_invoice_vals.uom_qty_total[findObjectByKey($scope.print_invoice_vals.uom_qty_total, 'uom', obj.uom)].total_qty += Number(obj.quantity);
                            }
                            else
                                $scope.print_invoice_vals.uom_qty_total[idx].total_qty += Number(obj.quantity);

                            if (obj.uom == 'Each')
                                console.log(obj.quantity);
                        });
                        $scope.print_invoice_vals.totalQty = sumArray(qty);
                        $scope.print_invoice_vals.totalUomQty = sumArray(uom_qty);
                        $scope.print_invoice_vals.sumOfPallets = sumArray(total_pallet_qty);
                        
                    }
                    else */
                    if ($scope.print_invoice_vals.templateType == 'salesDelivery' ||
                        $scope.print_invoice_vals.templateType == 'salesWarehouse') { // add or condition when warehouse pdf is done

<<<<<<< HEAD
                        angular.forEach($scope.print_invoice_vals.doc_details_arr, function (obj1, index1) {
=======
                        angular.forEach($scope.print_invoice_vals.doc_details_arr, function(obj1, index1) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            obj1.qty = [];
                            obj1.uom_qty = [];
                            obj1.total_pallet_qty = [];
                            obj1.uom_qty_total = new Array();
                            obj1.volume_total = new Array();
                            obj1.weight_total = new Array();

                            obj1.volume = [];
                            obj1.volume_unit = [];
                            obj1.weight = [];
                            obj1.weightunit = [];


<<<<<<< HEAD
                            angular.forEach(obj1, function (obj, index) {
=======
                            angular.forEach(obj1, function(obj, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                obj1.qty.push(Number(obj.quantity));
                                obj1.uom_qty.push(Number(obj.uom_qty));
                                obj1.total_pallet_qty.push(Number(obj.pallet_qty));

                                obj1.volume.push(Number(obj.volume));
                                obj1.weight.push(Number(obj.weight));

                                obj1.volume_unit.push(obj.volume_unit);
                                obj1.weightunit.push(obj.weightunit);

                                idx = findObjectByKey(obj1.uom_qty_total, 'uom', obj.uom);
                                if (idx == null) {
                                    obj1.uom_qty_total.push({ 'uom': obj.uom, 'total_qty': 0 });
                                    obj1.uom_qty_total[findObjectByKey(obj1.uom_qty_total, 'uom', obj.uom)].total_qty += Number(obj.quantity);
<<<<<<< HEAD
                                }
                                else
=======
                                } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    obj1.uom_qty_total[idx].total_qty += Number(obj.quantity);

                                idx2 = findObjectByKey(obj1.volume_total, 'volume_unit', obj.volumeUnit);
                                if (idx2 == null) {
                                    obj1.volume_total.push({ 'volume_unit': obj.volumeUnit, 'total_qty': 0 });
                                    obj1.volume_total[findObjectByKey(obj1.volume_total, 'volume_unit', obj.volumeUnit)].total_qty += Number(obj.volume);
<<<<<<< HEAD
                                }
                                else
=======
                                } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    obj1.volume_total[idx2].total_qty += Number(obj.volume);

                                idx3 = findObjectByKey(obj1.weight_total, 'weightunit', obj.weightUnit2);
                                if (idx3 == null) {
                                    obj1.weight_total.push({ 'weightunit': obj.weightUnit2, 'total_qty': 0 });
                                    obj1.weight_total[findObjectByKey(obj1.weight_total, 'weightunit', obj.weightUnit2)].total_qty += Number(obj.weight);
<<<<<<< HEAD
                                }
                                else
=======
                                } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    obj1.weight_total[idx3].total_qty += Number(obj.weight);


                                // if (obj.uom == 'Each')
                                //     console.log(obj1.quantity);
                            });

                            obj1.totalQty = sumArray(obj1.qty);
                            obj1.totalUomQty = sumArray(obj1.uom_qty);
                            obj1.sumOfPallets = sumArray(obj1.total_pallet_qty);

                        });

                    }

                    if ($scope.print_invoice_vals.templateType == 'salesQuote' ||
                        $scope.print_invoice_vals.templateType == 'salesOrder' ||
                        $scope.print_invoice_vals.templateType == 'salesInvoice') { // add or condition when warehouse pdf is done

                        if (_options && _options.isPerforma) {
                            $scope.print_invoice_vals.isPerforma = true;
                        } else {
                            $scope.print_invoice_vals.isPerforma = false;
                        }
                        $scope.print_invoice_vals.volume_total = new Array();
                        $scope.print_invoice_vals.weight_total = new Array();

<<<<<<< HEAD
                        angular.forEach($scope.print_invoice_vals.doc_details_arr, function (obj1, index1) {
=======
                        angular.forEach($scope.print_invoice_vals.doc_details_arr, function(obj1, index1) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                            idx2 = findObjectByKey($scope.print_invoice_vals.volume_total, 'volume_unit', obj1.volumeUnit);
                            if (idx2 == null) {
                                $scope.print_invoice_vals.volume_total.push({ 'volume_unit': obj1.volumeUnit, 'total_qty': 0 });
                                $scope.print_invoice_vals.volume_total[findObjectByKey($scope.print_invoice_vals.volume_total, 'volume_unit', obj1.volumeUnit)].total_qty += Number(obj1.volume);
<<<<<<< HEAD
                            }
                            else
=======
                            } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                $scope.print_invoice_vals.volume_total[idx2].total_qty += Number(obj1.volume);

                            idx3 = findObjectByKey($scope.print_invoice_vals.weight_total, 'weightunit', obj1.weightUnit2);
                            if (idx3 == null) {
                                $scope.print_invoice_vals.weight_total.push({ 'weightunit': obj1.weightUnit2, 'total_qty': 0 });
                                $scope.print_invoice_vals.weight_total[findObjectByKey($scope.print_invoice_vals.weight_total, 'weightunit', obj1.weightUnit2)].total_qty += Number(obj1.weight);
<<<<<<< HEAD
                            }
                            else
=======
                            } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                $scope.print_invoice_vals.weight_total[idx3].total_qty += Number(obj1.weight);

                        });


                        //for sales quote and sales performa
                        if ($scope.print_invoice_vals.templateType == 'salesQuote') {

                            let currentUrl = window.location.href;
                            $scope.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;
                            $scope.print_invoice_vals.company_logo_url = $scope.company_logo_url;
                            $scope.print_invoice_vals.totalVolume = 0;
                            $scope.print_invoice_vals.totalvolume_unit = 0;
                            $scope.print_invoice_vals.totalweight = 0;
                            $scope.print_invoice_vals.totalweightunit = 0;

                            for (_volume of $scope.print_invoice_vals.volume_total) {
                                $scope.print_invoice_vals.totalVolume = $scope.print_invoice_vals.totalVolume + _volume.total_qty; // data.volume_total[0].total_qty;
                                $scope.print_invoice_vals.totalvolume_unit = _volume.volume_unit;
                            }

                            for (_weight of $scope.print_invoice_vals.weight_total) {
                                $scope.print_invoice_vals.totalweight = $scope.print_invoice_vals.totalweight + _weight.total_qty;
                                $scope.print_invoice_vals.totalweightunit = _weight.weightunit;
                            }
                            $scope.print_invoice_vals.volume_permission = $scope.print_invoice_vals.volumePermission;
                            $scope.print_invoice_vals.weight_permission = $scope.print_invoice_vals.weightPermission;
                        }

                    }


                    if ($scope.print_invoice_vals.templateType == 'salesDelivery') {
                        var templateurl = 'app/views/invoice_templates/delivery_note_modal.html';
                    } else if ($scope.print_invoice_vals.templateType == 'salesWarehouse') {
                        var templateurl = 'app/views/invoice_templates/warehouse_instructions_modal.html';
                    } else {
                        var templateurl = 'app/views/invoice_templates/sales_order_modal.html';
                    }

                    if (_options && _options.exportToPdf) {
                        $scope.exportStoPDF($scope.print_invoice_vals);
                    }

                    // else if (_options && _options.directMail) {
                    //         $scope.openEmailer('emailerBtnSales_SalesQuotes');
                    // }
                    else {
                        var invoicePdfModal = ModalService.showModal({
                            templateUrl: templateurl,
                            controller: 'invoiceModalController',
                            inputs: {
                                noModal: noModal,
                                print_invoice_vals: $scope.print_invoice_vals,
                                print_invoice_obj: $scope.rec,
                                openEmailer: $scope.openEmailer
                            }
                        });


<<<<<<< HEAD
                        invoicePdfModal.then(function (res) {
=======
                        invoicePdfModal.then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                            res.element.modal();
                            if (noModal) {
                                res.element.modal("hide");
                            }



                            $scope.showLoader = false;
                            if (noModal) {
                                generatePdf.showLoader = false;
<<<<<<< HEAD
                                $timeout(function () {
                                    generatePdf.generatePdf($scope.print_invoice_vals.templateType, $scope.print_invoice_vals, '', noModal).then(function () {
=======
                                $timeout(function() {
                                    generatePdf.generatePdf($scope.print_invoice_vals.templateType, $scope.print_invoice_vals, '', noModal).then(function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                        // console.log("pdf generation done")
                                        // if (_options && _options.directMail) {
                                        //     // $timeout(function () {
                                        //         $scope.openEmailer('emailerBtnSales_SalesQuotes');
                                        //         console.log("open emailer done")
                                        //     // }, 3000)
                                        // }
                                    });

                                }, 200)
                            }

                        });
                    }


<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.showLoader = false;
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(511));
                }
            });

    }

<<<<<<< HEAD
    $scope.openEmailer = function (val) {
        setTimeout(function () {
=======
    $scope.openEmailer = function(val) {
        setTimeout(function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            document.getElementById(val).click();
        }, 0)
    }

<<<<<<< HEAD
    $scope.convert_post_invoice = function (rec, rec2, queue_for_approval) {

        $scope.stats_information(void 0, 1, rec, rec2, queue_for_approval);
    }
    $scope.convert_post_invoice_org = function (rec, rec2, queue_for_approval) {
        //this object is to create and send the invoice to the customer
        $scope.emailData = {
            customerEmail: rec.cust_email,
            orderNo: rec.sale_order_code
        }
        //$scope.customerEmail = rec.cust_email;
=======
    $scope.convert_post_invoice = function(rec, rec2, queue_for_approval) {

        $scope.stats_information(void 0, 1, rec, rec2, queue_for_approval);
    }
    $scope.convert_post_invoice_org = function(rec, rec2, queue_for_approval) {
        //this object is to create and send the invoice to the customer
        $scope.emailData = {
                customerEmail: rec.cust_email,
                orderNo: rec.sale_order_code
            }
            //$scope.customerEmail = rec.cust_email;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var valid = 1;
        var wh_valid = 1;
        var quantity_count = 0;
        var valid_dispatch_check = 1;
        var include_item = 0;
        var total_rec = 0;
        var item_count = 0;
        var gl_count = 0;

<<<<<<< HEAD
        angular.forEach($scope.items, function (obj) {
=======
        angular.forEach($scope.items, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (obj.item_type == 0 && obj.stock_check == 1 && (obj.remainig_qty == undefined || obj.remainig_qty > 0))
                valid = 0;

            if (obj.item_type == 0 && obj.stock_check == 0 && Number(obj.warehouses) == 0)
                wh_valid = 0;

            if (Number(obj.qty) == 0)
                quantity_count++;

            // if (obj.sale_status == '1' && obj.item_type == 0 && obj.stock_check == 1)
            //     valid_dispatch_check = 0;

            if ((obj.sale_status == '1' && obj.remainig_qty > 0))
                total_rec++;

            if (obj.item_type == 0)
                item_count++;
            if (obj.item_type == 1)
                gl_count++;
        });
        if (!valid) {
            toaster.pop("error", "Error", "Please allocate all the stock before dispatch");
            $scope.showLoader = false;
            return;
        }
        if (!wh_valid) {
            toaster.pop("error", "Error", "Please select the warehouse for all the items");
            $scope.showLoader = false;
            return;
        }

        if ($scope.rec.grand_total < 0) {
            toaster.pop("error", "Error", "Invoice value should not be less than zero");
            $scope.showLoader = false;
            return;
        }


        if (Number(item_count) > 0 && Number($scope.rec.alt_depo_id) == 0) {
            toaster.pop("error", "Error", $scope.$root.getErrorMessageByCode(230, ['Shipping Address']));
            $scope.showLoader = false;
            return;
        }

        if ($rootScope.ConvertDateToUnixTimestamp($scope.$parent.rec.posting_date) < $scope.$parent.rec.posting_start_date ||
            $rootScope.ConvertDateToUnixTimestamp($scope.$parent.rec.posting_date) > $scope.$parent.rec.posting_end_date) {
            toaster.pop("error", "Error", "Invoice date does not lies in Posting Date range");
            $scope.showLoader = false;
            return;
        }

        /* if ($scope.$parent.rec.posting_date != null && $scope.$parent.rec.offer_date != null) {
            var startDate = new Date($scope.rec.offer_date);
            var endDate = new Date($scope.rec.posting_date);
            if (Date.parse(startDate) > Date.parse(endDate)) {
                toaster.pop('error', 'Info', 'Invoice Date is Earlier then Order Date!');
                return;
            }
        }
        else {
            toaster.pop('error', 'Info', 'Invoice Date is Null');
            return;
        } */


        var error_count = 0;
        var error_msg = '';
        if ($scope.$parent.rec.posting_date == null) {
            if (error_count > 0)
                error_msg = error_msg + ', Invoice date';
            else
                error_msg = error_msg + 'Invoice date';
            error_count++;
        }
        if ($scope.$parent.rec.offer_date == null) {
            if (error_count > 0)
                error_msg = error_msg + ', Order date';
            else
                error_msg = error_msg + 'Order date';
            error_count++;
        }
        if (item_count > 0 && $scope.$parent.rec.dispatch_date == null) {
            if (error_count > 0)
                error_msg = error_msg + ', Dispatch date';
            else
                error_msg = error_msg + 'Dispatch date';
            error_count++;
        }

        if (item_count > 0 && $scope.$parent.rec.delivery_date == null) {
            if (error_count > 0)
                error_msg = error_msg + ', Delivery date';
            else
                error_msg = error_msg + 'Delivery date';
            error_count++;
        }


        if (quantity_count > 0) {
            if (quantity_count == 1)
                toaster.pop('error', 'Error', 'Quantity not specified for 1 Line');
            else
                toaster.pop('error', 'Error', 'Quantity not specified for ' + String(quantity_count) + ' Lines');
            return;
        }

        var converted_credit_limit = Number($scope.rec.credit_limit) / Number($scope.$parent.rec.currency_rate);
        $scope.rec.grand_total_converted = $scope.$parent.rec.grand_total / Number($scope.$parent.rec.currency_rate);
        var exceded_by = (Number($scope.rec.customer_balance) + Number($scope.rec.grand_total_converted)) - Number(converted_credit_limit);
        //alert($scope.rec.credit_limit+' - '+converted_credit_limit);
        var check_approvals = $scope.$root.setup + "general/check-for-approvals";
        //'warehouse_id': item.warehouses.id

        var types_to_check = '';
        converted_credit_limit = converted_credit_limit.toFixed(2);

        if (converted_credit_limit > 0)
            types_to_check = '1, 2';
        else
            types_to_check = '1';

        $http
            .post(check_approvals, {
                'object_id': $scope.$root.order_id,
                'type': types_to_check,
                'profit_percentage': $scope.stats.profit_percentage,
                'credit_limit_exceded_by': exceded_by,
                'token': $scope.$root.token
            })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    if (queue_for_approval == undefined) // do normal operations
                    {
                        $scope.rec.credit_limit_approval = 0; // approved
                        if (!$scope.hide_dispatch_btn) {
                            if (error_count > 0) {
                                $rootScope.order_post_invoice_msg = "Are you sure you want to convert this order to a Sales Invoice? The " + error_msg + " not specified, will be set to current date.";
<<<<<<< HEAD
                            }
                            else {
=======
                            } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                $rootScope.order_post_invoice_msg = "Are you sure you want to convert this order to a Sales Invoice?";
                            }

                            if (item_count > 0)
                                $rootScope.order_post_invoice_msg += " Stock will be automatically dispatched.";
<<<<<<< HEAD
                        }
                        else {
=======
                        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (error_count > 0)
                                $rootScope.order_post_invoice_msg = "Are you sure you want to convert this order to a Sales Invoice? . The " + error_msg + " not specified, will be set to current date.";
                            else
                                $rootScope.order_post_invoice_msg = "Are you sure you want to convert this order to a Sales Invoice?";
                        }


                        ngDialog.openConfirm({
                            template: '_confirm_order_invoice_modal',
                            className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
                        }).then(function (value) {
                            $scope.showLoader = true;

                            /////////////////////////////////////////////////////////////////////////////////////////
                            /////////////////////////CHECK CURRENCY RATE AVAILABILITY///////////////////////////////
                            var rec3 = {};
                            var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
                            $scope.items_converted_arr = [];
                            $http
                                .post(currencyURL, {
                                    'id': $scope.$root.c_currency_id,
                                    token: $scope.$root.token,
                                    or_date: $scope.$parent.rec.posting_date
                                })
                                .then(function (res) {

                                    if (res.data.ack != undefined) {
                                        var conv_rate = 1;
                                        if ($scope.$root.c_currency_id == $scope.$root.defaultCurrency) {
                                            var currChk = true;
                                            conv_rate = 1;
                                            var current_conv_rate = 1;

                                        }
                                        else if (res.data.ack == true) {
                                            var currChk = false;
                                            conv_rate = res.data.response.conversion_rate;
                                            var current_conv_rate = res.data.response.current_conversion_rate; //res.data.response.current_conversion_rate;

                                        }
                                        else {
                                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(507) + $scope.$parent.rec.posting_date + '.');
                                            $scope.showLoader = false;
                                            return;
                                        }

                                        // if (currChk == false) 
                                        {

                                            var selected_conversion_rate = 0;
                                            /* if (current_conv_rate != conv_rate) {
                                                // var retVal = confirm("The currency exchange rate for invoice date " + $scope.$parent.rec.posting_date +
                                                //     " was " + conv_rate + " and current exchange rate is " + current_conv_rate +
                                                //     ". Do you want to use the invoice date currency exchange rate?");


                                                $scope.data = {
                                                    conv_rate: conv_rate,
                                                    current_conv_rate: current_conv_rate,
                                                    posting_date: $scope.$parent.rec.posting_date,
                                                };

                                                var dialog = ngDialog.openConfirm({
                                                    template: '_order_date_currency_exchange_confirmation_modal',
                                                    className: 'ngdialog-theme-default-custom',
                                                    scope: $scope
                                                }).then(function (retVal) {

                                                    console.log('resolved case conv_rate: ', conv_rate);
=======
                        }).then(function(value) {
                                $scope.showLoader = true;

                                /////////////////////////////////////////////////////////////////////////////////////////
                                /////////////////////////CHECK CURRENCY RATE AVAILABILITY///////////////////////////////
                                var rec3 = {};
                                var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
                                $scope.items_converted_arr = [];
                                $http
                                    .post(currencyURL, {
                                        'id': $scope.$root.c_currency_id,
                                        token: $scope.$root.token,
                                        or_date: $scope.$parent.rec.posting_date
                                    })
                                    .then(function(res) {

                                        if (res.data.ack != undefined) {
                                            var conv_rate = 1;
                                            if ($scope.$root.c_currency_id == $scope.$root.defaultCurrency) {
                                                var currChk = true;
                                                conv_rate = 1;
                                                var current_conv_rate = 1;

                                            } else if (res.data.ack == true) {
                                                var currChk = false;
                                                conv_rate = res.data.response.conversion_rate;
                                                var current_conv_rate = res.data.response.current_conversion_rate; //res.data.response.current_conversion_rate;

                                            } else {
                                                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(507) + $scope.$parent.rec.posting_date + '.');
                                                $scope.showLoader = false;
                                                return;
                                            }

                                            // if (currChk == false) 
                                            {

                                                var selected_conversion_rate = 0;
                                                /* if (current_conv_rate != conv_rate) {
                                                    // var retVal = confirm("The currency exchange rate for invoice date " + $scope.$parent.rec.posting_date +
                                                    //     " was " + conv_rate + " and current exchange rate is " + current_conv_rate +
                                                    //     ". Do you want to use the invoice date currency exchange rate?");


                                                    $scope.data = {
                                                        conv_rate: conv_rate,
                                                        current_conv_rate: current_conv_rate,
                                                        posting_date: $scope.$parent.rec.posting_date,
                                                    };

                                                    var dialog = ngDialog.openConfirm({
                                                        template: '_order_date_currency_exchange_confirmation_modal',
                                                        className: 'ngdialog-theme-default-custom',
                                                        scope: $scope
                                                    }).then(function (retVal) {

                                                        console.log('resolved case conv_rate: ', conv_rate);
                                                        $scope.$parent.rec.currency_rate = conv_rate;
                                                        $scope.rec.grand_total_converted = Number($scope.rec.grand_total) / conv_rate;

                                                        $scope.rec.bill_to_posting_group_id = ($scope.drp.vat_bus_posting_group != undefined) ? $scope.drp.vat_bus_posting_group.id : 0;
                                                        if (Number($scope.rec.bill_to_posting_group_id) == 0) {
                                                            toaster.pop('error', 'Error', ' Select Posting Group of Customer ');
                                                            $scope.showLoader = false;
                                                            return;
                                                        }
                                                        if (Number($scope.rec.sale_person_id) == 0) {
                                                            toaster.pop('error', 'Error', ' Select Salesperson for the Sales Order ');
                                                            $scope.showLoader = false;
                                                            return;
                                                        }
                                                        // var converted_credit_limit = Number($scope.rec.credit_limit) / Number($scope.$parent.rec.currency_rate);
                                                        // if (Number($scope.rec.customer_balance) + Number($scope.rec.grand_total_converted) > Number(converted_credit_limit)) {
                                                        //     var exceded_by = ((Number($scope.rec.customer_balance) + Number($scope.rec.grand_total_converted)) - Number(converted_credit_limit)).toFixed(2);
                                                        //     toaster.pop('warning', 'Warning', 'Invoice value exceeded Credit limit of the customer ' + $scope.rec.sell_to_cust_no + ' by ' + exceded_by);
                                                        // }
                                                        // $scope.stats_information(1, 1, rec, rec2);
                                                        $scope.add_general(rec, rec2, void 0, 1);
                                                    }, function (retVal) {

                                                        console.log('reject case current_conv_rate: ', current_conv_rate);

                                                        $scope.$parent.rec.currency_rate = current_conv_rate;
                                                        $scope.rec.grand_total_converted = Number($scope.rec.grand_total) / current_conv_rate;

                                                        $scope.rec.bill_to_posting_group_id = ($scope.drp.vat_bus_posting_group != undefined) ? $scope.drp.vat_bus_posting_group.id : 0;
                                                        if (Number($scope.rec.bill_to_posting_group_id) == 0) {
                                                            toaster.pop('error', 'Error', ' Select Posting Group of Customer ');
                                                            $scope.showLoader = false;
                                                            return;
                                                        }
                                                        if (Number($scope.rec.sale_person_id) == 0) {
                                                            toaster.pop('error', 'Error', ' Select Salesperson for the Sales Order ');
                                                            $scope.showLoader = false;
                                                            return;
                                                        }
                                                        // var converted_credit_limit = Number($scope.rec.credit_limit) / Number($scope.$parent.rec.currency_rate);
                                                        // if (Number($scope.rec.customer_balance) + Number($scope.rec.grand_total_converted) > Number(converted_credit_limit)) {
                                                        //     var exceded_by = ((Number($scope.rec.customer_balance) + Number($scope.rec.grand_total_converted)) - Number(converted_credit_limit)).toFixed(2);
                                                        //     toaster.pop('warning', 'Warning', 'Invoice value exceeded Credit limit of the customer ' + $scope.rec.sell_to_cust_no + ' by ' + exceded_by);
                                                        // }
                                                        // $scope.stats_information(1, 1, rec, rec2);
                                                        $scope.add_general(rec, rec2, void 0, 1);
                                                    });
                                                }
                                                else */
                                                {

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                    $scope.$parent.rec.currency_rate = conv_rate;
                                                    $scope.rec.grand_total_converted = Number($scope.rec.grand_total) / conv_rate;

                                                    $scope.rec.bill_to_posting_group_id = ($scope.drp.vat_bus_posting_group != undefined) ? $scope.drp.vat_bus_posting_group.id : 0;
                                                    if (Number($scope.rec.bill_to_posting_group_id) == 0) {
                                                        toaster.pop('error', 'Error', ' Select Posting Group of Customer ');
                                                        $scope.showLoader = false;
                                                        return;
                                                    }
<<<<<<< HEAD
                                                    if (Number($scope.rec.sale_person_id) == 0) {
                                                        toaster.pop('error', 'Error', ' Select Salesperson for the Sales Order ');
                                                        $scope.showLoader = false;
                                                        return;
                                                    }
                                                    // var converted_credit_limit = Number($scope.rec.credit_limit) / Number($scope.$parent.rec.currency_rate);
                                                    // if (Number($scope.rec.customer_balance) + Number($scope.rec.grand_total_converted) > Number(converted_credit_limit)) {
                                                    //     var exceded_by = ((Number($scope.rec.customer_balance) + Number($scope.rec.grand_total_converted)) - Number(converted_credit_limit)).toFixed(2);
                                                    //     toaster.pop('warning', 'Warning', 'Invoice value exceeded Credit limit of the customer ' + $scope.rec.sell_to_cust_no + ' by ' + exceded_by);
                                                    // }
                                                    // $scope.stats_information(1, 1, rec, rec2);
                                                    $scope.add_general(rec, rec2, void 0, 1);
                                                }, function (retVal) {

                                                    console.log('reject case current_conv_rate: ', current_conv_rate);

                                                    $scope.$parent.rec.currency_rate = current_conv_rate;
                                                    $scope.rec.grand_total_converted = Number($scope.rec.grand_total) / current_conv_rate;

                                                    $scope.rec.bill_to_posting_group_id = ($scope.drp.vat_bus_posting_group != undefined) ? $scope.drp.vat_bus_posting_group.id : 0;
                                                    if (Number($scope.rec.bill_to_posting_group_id) == 0) {
                                                        toaster.pop('error', 'Error', ' Select Posting Group of Customer ');
                                                        $scope.showLoader = false;
                                                        return;
                                                    }
                                                    if (Number($scope.rec.sale_person_id) == 0) {
                                                        toaster.pop('error', 'Error', ' Select Salesperson for the Sales Order ');
                                                        $scope.showLoader = false;
                                                        return;
                                                    }
                                                    // var converted_credit_limit = Number($scope.rec.credit_limit) / Number($scope.$parent.rec.currency_rate);
                                                    // if (Number($scope.rec.customer_balance) + Number($scope.rec.grand_total_converted) > Number(converted_credit_limit)) {
                                                    //     var exceded_by = ((Number($scope.rec.customer_balance) + Number($scope.rec.grand_total_converted)) - Number(converted_credit_limit)).toFixed(2);
                                                    //     toaster.pop('warning', 'Warning', 'Invoice value exceeded Credit limit of the customer ' + $scope.rec.sell_to_cust_no + ' by ' + exceded_by);
                                                    // }
                                                    // $scope.stats_information(1, 1, rec, rec2);
                                                    $scope.add_general(rec, rec2, void 0, 1);
                                                });
                                            }
                                            else */
                                            {

                                                $scope.$parent.rec.currency_rate = conv_rate;
                                                $scope.rec.grand_total_converted = Number($scope.rec.grand_total) / conv_rate;

                                                $scope.rec.bill_to_posting_group_id = ($scope.drp.vat_bus_posting_group != undefined) ? $scope.drp.vat_bus_posting_group.id : 0;
                                                if (Number($scope.rec.bill_to_posting_group_id) == 0) {
                                                    toaster.pop('error', 'Error', ' Select Posting Group of Customer ');
                                                    $scope.showLoader = false;
                                                    return;
                                                }
                                                /* if (Number($scope.rec.sale_person_id) == 0) {
                                                    toaster.pop('error', 'Error', ' Select Salesperson for the Sales Order ');
                                                    $scope.showLoader = false;
                                                    return;
                                                } */
                                                /* var converted_credit_limit = Number($scope.rec.credit_limit) / Number($scope.$parent.rec.currency_rate);
                                                if (Number($scope.rec.customer_balance) + Number($scope.rec.grand_total_converted) > Number(converted_credit_limit)) {
                                                    var exceded_by = ((Number($scope.rec.customer_balance) + Number($scope.rec.grand_total_converted)) - Number(converted_credit_limit)).toFixed(2);
                                                    toaster.pop('warning', 'Warning', 'Invoice value exceeded Credit limit of the customer ' + $scope.rec.sell_to_cust_no + ' by ' + exceded_by);
                                                } */
                                                // $scope.stats_information(1, 1, rec, rec2);

                                                // $scope.add_general(rec, rec2, void 0, 1);

                                                $scope.load_invoice();

                                            }
                                        }

                                    }
                                });
                        },
                            function (reason) {
=======
                                                    /* if (Number($scope.rec.sale_person_id) == 0) {
                                                        toaster.pop('error', 'Error', ' Select Salesperson for the Sales Order ');
                                                        $scope.showLoader = false;
                                                        return;
                                                    } */
                                                    /* var converted_credit_limit = Number($scope.rec.credit_limit) / Number($scope.$parent.rec.currency_rate);
                                                    if (Number($scope.rec.customer_balance) + Number($scope.rec.grand_total_converted) > Number(converted_credit_limit)) {
                                                        var exceded_by = ((Number($scope.rec.customer_balance) + Number($scope.rec.grand_total_converted)) - Number(converted_credit_limit)).toFixed(2);
                                                        toaster.pop('warning', 'Warning', 'Invoice value exceeded Credit limit of the customer ' + $scope.rec.sell_to_cust_no + ' by ' + exceded_by);
                                                    } */
                                                    // $scope.stats_information(1, 1, rec, rec2);

                                                    // $scope.add_general(rec, rec2, void 0, 1);

                                                    $scope.load_invoice();

                                                }
                                            }

                                        }
                                    });
                            },
                            function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                $scope.showLoader = false;
                                console.log('Modal promise rejected. Reason: ', reason);
                            });

<<<<<<< HEAD
                    }
                    else {
=======
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        toaster.pop('success', 'Success', $scope.$root.getErrorMessageByCode(666, ['Sales Order']));
                        $scope.showLoader = false;
                    }
                    $scope.add_general(rec, rec2, void 0, 1);
<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    var response = res.data.response;
                    var already_checked = 0;
                    if (Number(response[0].type) == 1 && Number(response[0].criteria) >= Number($scope.stats.profit_percentage)) {
                        if (Number(response[0].prev_status) == -1 || Number(response[0].prev_status) == 3 || Number(response[0].prev_status) == 6) {
                            var str = '';
                            if (Number(response[0].prev_status) == 3) {
                                str = "Previously disapproved by " + response[0].responded_by + ", ";

                            }
                            $rootScope.approval_message = str + "The profit % for this order is less than or equal to " + response[0].criteria + ", You need approval for it.";
                            already_checked = 1;
                            ngDialog.openConfirm({
                                template: '_confirm_approval_required_modal',
                                className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
                            }).then(function (value) {
                                $scope.showLoader = true;
                                var check_approvals = $scope.$root.setup + "general/send-for-approval";
                                //'warehouse_id': item.warehouses.id
                                $http
                                    .post(check_approvals, {
                                        'object_id': $scope.$root.order_id,
                                        'object_code': $scope.rec.sale_order_code,
                                        'source_name': $scope.rec.sell_to_cust_name,
                                        'source_code': $scope.rec.sell_to_cust_no,
                                        'detail_id': 0,
                                        'approval_id': response[0].id,
                                        'code': $scope.rec.sale_order_code,
                                        'criteria': response[0].criteria,
                                        'current_value': $scope.stats.profit_percentage,
                                        'currency_code': $scope.rec.currency_id.code,
                                        'type': "1",
                                        'emp_id_1': response[0].emp_id_1,
                                        'emp_id_2': response[0].emp_id_2,
                                        'emp_id_3': response[0].emp_id_3,
                                        'emp_id_4': response[0].emp_id_4,
                                        'emp_id_5': response[0].emp_id_5,
                                        'emp_id_6': response[0].emp_id_6,
                                        'emp_email_1': response[0].emp_email_1,
                                        'emp_email_2': response[0].emp_email_2,
                                        'emp_email_3': response[0].emp_email_3,
                                        'emp_email_4': response[0].emp_email_4,
                                        'emp_email_5': response[0].emp_email_5,
                                        'emp_email_6': response[0].emp_email_6,
                                        'token': $scope.$root.token
                                    })
                                    .then(function (res) {
                                        if (res.data.ack == true) {
                                            $scope.showLoader = false;
                                            toaster.pop('success', 'Success', $scope.$root.getErrorMessageByCode(622));
                                            return;
                                        }
                                        else {
                                            $scope.showLoader = false;
                                            if (res.data.error != undefined)
                                                toaster.pop('error', 'Error', res.data.error);
                                            else
                                                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(371));
                                            return;
                                        }
                                    });
                            },
                                function (reason) {
                                    $scope.showLoader = false;
                                    console.log('Modal promise rejected. Reason: ', reason);
                                });
                        }
                        else if (Number(response[0].prev_status) == 1) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(513, ['Awaiting']));
                            return;
                        }
                        else if (Number(response[0].prev_status) == 0) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(513, ['Queued']));
                            return;
                        }
                        else if (Number(response[0].prev_status) == 7) {
=======
                            }).then(function(value) {
                                    $scope.showLoader = true;
                                    var check_approvals = $scope.$root.setup + "general/send-for-approval";
                                    //'warehouse_id': item.warehouses.id
                                    $http
                                        .post(check_approvals, {
                                            'object_id': $scope.$root.order_id,
                                            'object_code': $scope.rec.sale_order_code,
                                            'source_name': $scope.rec.sell_to_cust_name,
                                            'source_code': $scope.rec.sell_to_cust_no,
                                            'detail_id': 0,
                                            'approval_id': response[0].id,
                                            'code': $scope.rec.sale_order_code,
                                            'criteria': response[0].criteria,
                                            'current_value': $scope.stats.profit_percentage,
                                            'currency_code': $scope.rec.currency_id.code,
                                            'type': "1",
                                            'emp_id_1': response[0].emp_id_1,
                                            'emp_id_2': response[0].emp_id_2,
                                            'emp_id_3': response[0].emp_id_3,
                                            'emp_id_4': response[0].emp_id_4,
                                            'emp_id_5': response[0].emp_id_5,
                                            'emp_id_6': response[0].emp_id_6,
                                            'emp_email_1': response[0].emp_email_1,
                                            'emp_email_2': response[0].emp_email_2,
                                            'emp_email_3': response[0].emp_email_3,
                                            'emp_email_4': response[0].emp_email_4,
                                            'emp_email_5': response[0].emp_email_5,
                                            'emp_email_6': response[0].emp_email_6,
                                            'token': $scope.$root.token
                                        })
                                        .then(function(res) {
                                            if (res.data.ack == true) {
                                                $scope.showLoader = false;
                                                toaster.pop('success', 'Success', $scope.$root.getErrorMessageByCode(622));
                                                return;
                                            } else {
                                                $scope.showLoader = false;
                                                if (res.data.error != undefined)
                                                    toaster.pop('error', 'Error', res.data.error);
                                                else
                                                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(371));
                                                return;
                                            }
                                        });
                                },
                                function(reason) {
                                    $scope.showLoader = false;
                                    console.log('Modal promise rejected. Reason: ', reason);
                                });
                        } else if (Number(response[0].prev_status) == 1) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(513, ['Awaiting']));
                            return;
                        } else if (Number(response[0].prev_status) == 0) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(513, ['Queued']));
                            return;
                        } else if (Number(response[0].prev_status) == 7) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(392, ['Sales Order']));
                            return;
                        }

                    }

                    var response2 = {};
                    if (response.length == 1)
                        response2 = response[0];
                    else if (response.length == 2)
                        response2 = response[1];
                    else
                        return;

                    if (already_checked == 0 && Number(response2.type) == 2 && converted_credit_limit > 0 && (Number($scope.rec.customer_balance) + Number($scope.rec.grand_total_converted) > Number(converted_credit_limit))) {
                        if (Number(response2.prev_status) == -1 || Number(response2.prev_status) == 3 || Number(response2.prev_status) == 6) {
                            var str = '';
                            if (Number(response2.prev_status) == 3) {
                                str = "Previously disapproved by " + response2.responded_by + ", ";

                            }
                            $rootScope.approval_message = str + "The outstanding amount exceeds the aurthosied credit limit of " + converted_credit_limit + " " + $rootScope.defaultCurrencyCode + ", you need to queue this Sales Order for approval.";
                            ngDialog.openConfirm({
                                template: '_confirm_approval_required_modal',
                                className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
                            }).then(function (value) {
                                $scope.showLoader = true;
                                var check_approvals = $scope.$root.setup + "general/send-for-approval";
                                //'warehouse_id': item.warehouses.id
                                $http
                                    .post(check_approvals, {
                                        'object_id': $scope.$root.order_id,
                                        'object_code': $scope.rec.sale_order_code,
                                        'source_name': $scope.rec.sell_to_cust_name,
                                        'source_code': $scope.rec.sell_to_cust_no,
                                        'detail_id': 0,
                                        'approval_id': response2.id,
                                        'code': $scope.rec.sale_order_code,
                                        'current_value': exceded_by,
                                        'currency_code': $scope.rec.currency_id.code,
                                        'type': "2",
                                        'emp_id_1': response2.emp_id_1,
                                        'emp_id_2': response2.emp_id_2,
                                        'emp_id_3': response2.emp_id_3,
                                        'emp_id_4': response2.emp_id_4,
                                        'emp_id_5': response2.emp_id_5,
                                        'emp_id_6': response2.emp_id_6,
                                        'emp_email_1': response2.emp_email_1,
                                        'emp_email_2': response2.emp_email_2,
                                        'emp_email_3': response2.emp_email_3,
                                        'emp_email_4': response2.emp_email_4,
                                        'emp_email_5': response2.emp_email_5,
                                        'emp_email_6': response2.emp_email_6,
                                        'token': $scope.$root.token
                                    })
                                    .then(function (res) {
                                        if (res.data.ack == true) {
                                            $scope.showLoader = false;
                                            toaster.pop('success', 'Success', $scope.$root.getErrorMessageByCode(622));
                                            return;
                                        }
                                        else {
                                            $scope.showLoader = false;
                                            if (res.data.error != undefined)
                                                toaster.pop('error', 'Error', res.data.error);
                                            else
                                                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(371));
                                            // return;
                                        }
                                    });
                            },
                                function (reason) {
                                    $scope.showLoader = false;
                                    console.log('Modal promise rejected. Reason: ', reason);
                                });
                        }
                        else if (Number(response2.prev_status) == 1) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(514, ['Awaiting']));
                            // return;
                        }
                        else if (Number(response2.prev_status) == 0) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(514, ['Queued']));
                            // return;
                        }
                        else if (Number(response2.prev_status) == 7) {
=======
                            }).then(function(value) {
                                    $scope.showLoader = true;
                                    var check_approvals = $scope.$root.setup + "general/send-for-approval";
                                    //'warehouse_id': item.warehouses.id
                                    $http
                                        .post(check_approvals, {
                                            'object_id': $scope.$root.order_id,
                                            'object_code': $scope.rec.sale_order_code,
                                            'source_name': $scope.rec.sell_to_cust_name,
                                            'source_code': $scope.rec.sell_to_cust_no,
                                            'detail_id': 0,
                                            'approval_id': response2.id,
                                            'code': $scope.rec.sale_order_code,
                                            'current_value': exceded_by,
                                            'currency_code': $scope.rec.currency_id.code,
                                            'type': "2",
                                            'emp_id_1': response2.emp_id_1,
                                            'emp_id_2': response2.emp_id_2,
                                            'emp_id_3': response2.emp_id_3,
                                            'emp_id_4': response2.emp_id_4,
                                            'emp_id_5': response2.emp_id_5,
                                            'emp_id_6': response2.emp_id_6,
                                            'emp_email_1': response2.emp_email_1,
                                            'emp_email_2': response2.emp_email_2,
                                            'emp_email_3': response2.emp_email_3,
                                            'emp_email_4': response2.emp_email_4,
                                            'emp_email_5': response2.emp_email_5,
                                            'emp_email_6': response2.emp_email_6,
                                            'token': $scope.$root.token
                                        })
                                        .then(function(res) {
                                            if (res.data.ack == true) {
                                                $scope.showLoader = false;
                                                toaster.pop('success', 'Success', $scope.$root.getErrorMessageByCode(622));
                                                return;
                                            } else {
                                                $scope.showLoader = false;
                                                if (res.data.error != undefined)
                                                    toaster.pop('error', 'Error', res.data.error);
                                                else
                                                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(371));
                                                // return;
                                            }
                                        });
                                },
                                function(reason) {
                                    $scope.showLoader = false;
                                    console.log('Modal promise rejected. Reason: ', reason);
                                });
                        } else if (Number(response2.prev_status) == 1) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(514, ['Awaiting']));
                            // return;
                        } else if (Number(response2.prev_status) == 0) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(514, ['Queued']));
                            // return;
                        } else if (Number(response2.prev_status) == 7) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(392, ['Sales Order']));
                            // return;
                        }
                    }

                    $scope.add_general(rec, rec2, void 0, 1);

                }

                $scope.waitFormarginAnalysis = false;
            });


    }

<<<<<<< HEAD
    $scope.ChangeApprovalStatus = function (status, comments) {
=======
    $scope.ChangeApprovalStatus = function(status, comments) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var update_approvals_status = $scope.$root.setup + "general/update-approval-status";
        var id = $scope.approval_history[$scope.approval_history.length - 1].id;
        var req_by_email = $scope.approval_history[$scope.approval_history.length - 1].requested_by_email;
        var object_code = $scope.approval_history[$scope.approval_history.length - 1].object_code;
        var current_value = $scope.approval_history[$scope.approval_history.length - 1].current_value;
        var currency_code = $scope.approval_history[$scope.approval_history.length - 1].currency_code;

        if (status == 3 && (comments == undefined || comments.length == 0)) {
            toaster.pop('error', 'error', $scope.$root.getErrorMessageByCode(664));
            return;
        }

        $scope.disableDisapprovalBtn = true;

        $http
            .post(update_approvals_status, {
                'object_id': $scope.$root.order_id,
                'detail_id': 0,
                'object_code': object_code,
                'id': id,
                'requested_by_email': req_by_email,
                'current_value': current_value,
                'currency_code': currency_code,
                'type': "2",
                'status': status,
                'comments': comments,
                'token': $scope.$root.token
            })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    $scope.showLoader = false;
                    angular.element('#_approval_history').modal('hide');

                    if (status == 2)
                        toaster.pop('success', 'Success', $scope.$root.getErrorMessageByCode(623));
                    else
                        toaster.pop('success', 'Success', $scope.$root.getErrorMessageByCode(624));
                    return;
<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.showLoader = false;
                    $scope.disableDisapprovalBtn = false;
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(371));
                    // return;
                }
            });
    }
<<<<<<< HEAD
    $scope.load_invoice = function () {
=======
    $scope.load_invoice = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var dispStockUrl = $scope.$root.sales + "warehouse/invoice-stock";
        $scope.invoice_params = {};
        $scope.invoice_params.token = $scope.$root.token;
        $scope.invoice_params.order_id = $scope.$root.order_id;
        $scope.invoice_params.type = 1;
        $scope.invoice_params.posting_grp = $scope.rec.bill_to_posting_group_id;
        $scope.invoice_params.items_net_amt = $scope.rec.items_net_total;
        $scope.invoice_params.items_net_vat = $scope.rec.items_net_vat;
        $scope.invoice_params.items_net_disc = $scope.rec.items_net_discount;
        $scope.invoice_params.grand_total = $scope.rec.grand_total;
        $scope.showLoader = true;
        $http
            .post(dispStockUrl, $scope.invoice_params)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {



                    $scope.showLoader = false;
                    $scope.showInvoiceModal('salesInvoice', 2);
<<<<<<< HEAD

                    $timeout(function () {
=======
                    $scope.postJournal(1);

                    $timeout(function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.hide_dispatch_btn = true;

                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(625));

                        // $state.go("app.addOrder");
                        $scope.check_so_readonly = false;
                        $scope.$parent.check_so_readonly = false;

                        if ($rootScope.show_sales_add_btn == 1)
                            $state.go("app.addOrder");
                        else
                            $state.go("app.addSaleQuote");

                        $scope.items = [];
                        $scope.$emit('SalesLines', $scope.items);
                        $scope.$emit('InvoicePosted', $scope.$parent.rec);
                        var link_order = 'app.orders';
                        var name_link = 'Sales Orders';
<<<<<<< HEAD
                        $scope.$root.breadcrumbs =
                            [
                                { 'name': 'Sales', 'url': '#', 'isActive': false },
                                { 'name': 'Customers', 'url': 'app.customer', 'isActive': false },
                                { 'name': name_link, 'url': link_order, 'isActive': false }
                            ];

                    }, 500);

                }
                else {
=======
                        $scope.$root.breadcrumbs = [
                            { 'name': 'Sales', 'url': '#', 'isActive': false },
                            { 'name': 'Customers', 'url': 'app.customer', 'isActive': false },
                            { 'name': name_link, 'url': link_order, 'isActive': false }
                        ];

                    }, 500);

                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.showLoader = false;
                    toaster.pop('error', 'Error', res.data.error);
                }

            });


        /* $scope.product_type = true;
        $scope.count_result = 0;
        var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
        var name = $scope.$root.base64_encode('invoices');
        var no = $scope.$root.base64_encode('sale_invioce_no');
        var module_category_id = 2;
        $scope.showLoader = true;
        $http
            .post(getCodeUrl, {
                'is_increment': 1,
                'token': $scope.$root.token,
                'tb': name,
                'm_id': 110,
                'no': no,
                'category': '',
                'brand': '',
                'module_category_id': module_category_id,
                'type': '2,3'
            })
            .then(function (res) {
                if (res.data.ack == 1) {
                    var sale_invoice_code = res.data.code;
                    var sale_invoice_no = res.data.nubmer;

                    $scope.rec.code_type = module_category_id;//res.data.code_type;
                    //	 $scope.count_result++;

                    if (res.data.type == 1)
                        $scope.product_type = false;
                    else
                        $scope.product_type = true;


                    var convInvoiceUrl = $scope.$root.sales + "customer/order/convert-to-invoice";
                    $http
                        .post(convInvoiceUrl, {
                            id: $scope.$root.order_id,
                            type: 2,
                            'module': 1,
                            'token': $scope.$root.token,
                            'sale_invoice_code': sale_invoice_code,
                            'sale_invoice_no': sale_invoice_no
                        })
                        .then(function (res) {
                            if (res.data.ack == true) {
                                // codemark triggering email invoice after it is converted
                                // state will be updated inside email invoice function
                                //$scope.emailInvoice(1);
                                toaster.pop('success', 'Info', 'Posted to Invoice');
                                $scope.showLoader = false;
                               
                                $state.go("app.addOrder");
                                $scope.items = [];
                                $scope.$emit('SalesLines', $scope.items);
                                $scope.$emit('InvoicePosted', $scope.$parent.rec);
                                var link_order = 'app.orders';
                                var name_link = 'Orders';
                                $scope.$root.breadcrumbs =
                                    [
                                        { 'name': 'Sales', 'url': '#', 'isActive': false },
                                        { 'name': 'Customers', 'url': 'app.customer', 'isActive': false },
                                        { 'name': name_link, 'url': link_order, 'isActive': false }
                                    ];
                            }
                            else {
                                $scope.showLoader = false;
                                toaster.pop('error', 'Error', 'Can\'t Converted into Invoice!');
                            }
                        });


                }
                else {
                    toaster.pop('error', 'Error', res.data.error);
                    return false;
                }
            }); */
    }


<<<<<<< HEAD
    $scope.dispatchStock = function (rec, rec2) {
        var valid = 1;
        angular.forEach($scope.items, function (obj) {
=======
    $scope.dispatchStock = function(rec, rec2) {
        var valid = 1;
        angular.forEach($scope.items, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (obj.item_type == "0" && obj.stock_check == "1" && (obj.remainig_qty == undefined || obj.remainig_qty > 0 || isNaN(obj.remainig_qty)))
                valid = 0;
        });
        if (!valid) {
            toaster.pop("error", "Error", "Please allocate all the stock before dispatch");
            return;
        }


        if (Number($scope.rec.alt_depo_id) == 0) {
            toaster.pop("error", "Error", $scope.$root.getErrorMessageByCode(230, ['Shipping Address']));
            return;
        }

        if ($rootScope.ConvertDateToUnixTimestamp($scope.$parent.rec.posting_date) < $scope.$parent.rec.posting_start_date ||
            $rootScope.ConvertDateToUnixTimestamp($scope.$parent.rec.posting_date) > $scope.$parent.rec.posting_end_date) {
            toaster.pop("error", "Error", "Invoice date does not lies in Posting Date range");
            return;
        }
        // $scope.add_general(rec, rec2); // commenting this don't save the recent changes in sales order (G/l) values becomes zero
        // $scope.add_general(rec, rec2, void 0, 3);

        $scope.stats_information(void 0, 2, rec, rec2);
    }
<<<<<<< HEAD
    $scope.dispatchStockFinal = function () {
=======
    $scope.dispatchStockFinal = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.dsptch = {};

        var dispStockUrl = $scope.$root.sales + "warehouse/dispatch-stock";
        ngDialog.openConfirm({
            template: 'app/views/orders/_confirm_dispatch_order_modal.html',
            className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
        }).then(function (value) {
=======
        }).then(function(value) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.dsptch.token = $scope.$root.token;
            $scope.dsptch.order_id = $scope.$root.order_id;
            $scope.dsptch.return_type = 1;
            $scope.dsptch.sale_return_status = 0;
            $http
                .post(dispStockUrl, $scope.dsptch)
<<<<<<< HEAD
                .then(function (res) {
=======
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        $scope.hide_dispatch_btn = true;
                        $scope.$parent.check_so_readonly = true;
                        $scope.check_so_readonly = true;
                        $scope.getOrdersDetail(1);
                        toaster.pop("success", "Info", "Stock has been dispatched.");
                    }

                });
<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

<<<<<<< HEAD
    $scope.dispatchStockOrg = function () {
=======
    $scope.dispatchStockOrg = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // 
        var converted_credit_limit = Number($scope.rec.credit_limit) / Number($scope.$parent.rec.currency_rate);
        $scope.rec.grand_total_converted = $scope.$parent.rec.grand_total / Number($scope.$parent.rec.currency_rate);
        var exceded_by = (Number($scope.rec.customer_balance) + Number($scope.rec.grand_total_converted)) - Number(converted_credit_limit);
        //alert($scope.rec.credit_limit+' - '+converted_credit_limit);
        var check_approvals = $scope.$root.setup + "general/check-for-approvals";
        //'warehouse_id': item.warehouses.id

        var types_to_check = '';
        converted_credit_limit = converted_credit_limit.toFixed(2);

        if (converted_credit_limit > 0)
            types_to_check = '1, 2';
        else
            types_to_check = '1';

        $http
            .post(check_approvals, {
                'object_id': $scope.$root.order_id,
                'type': types_to_check,
                'profit_percentage': $scope.stats.profit_percentage,
                'credit_limit_exceded_by': exceded_by,
                'token': $scope.$root.token
            })
<<<<<<< HEAD
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.dispatchStockFinal();
                }
                else {
=======
            .then(function(res) {
                if (res.data.ack == true) {
                    $scope.dispatchStockFinal();
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    var response = res.data.response;
                    var already_checked = 0;
                    if (Number(response[0].type) == 1 && Number(response[0].criteria) >= Number($scope.stats.profit_percentage)) {
                        if (Number(response[0].prev_status) == -1 || Number(response[0].prev_status) == 3 || Number(response[0].prev_status) == 6) {
                            var str = '';
                            if (Number(response[0].prev_status) == 3) {
                                str = "Previously disapproved by " + response[0].responded_by + ", ";

                            }
                            $rootScope.approval_message = str + "The profit % for this order is less than or equal to " + response[0].criteria + ", You need approval for it.";
                            already_checked = 1;
                            ngDialog.openConfirm({
                                template: '_confirm_approval_required_modal',
                                className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
                            }).then(function (value) {
                                $scope.showLoader = true;
                                var check_approvals = $scope.$root.setup + "general/send-for-approval";
                                //'warehouse_id': item.warehouses.id
                                $http
                                    .post(check_approvals, {
                                        'object_id': $scope.$root.order_id,
                                        'object_code': $scope.rec.sale_order_code,
                                        'source_name': $scope.rec.sell_to_cust_name,
                                        'source_code': $scope.rec.sell_to_cust_no,
                                        'detail_id': 0,
                                        'approval_id': response[0].id,
                                        'code': $scope.rec.sale_order_code,
                                        'criteria': response[0].criteria,
                                        'current_value': $scope.stats.profit_percentage,
                                        'currency_code': $scope.rec.currency_id.code,
                                        'type': "1",
                                        'emp_id_1': response[0].emp_id_1,
                                        'emp_id_2': response[0].emp_id_2,
                                        'emp_id_3': response[0].emp_id_3,
                                        'emp_id_4': response[0].emp_id_4,
                                        'emp_id_5': response[0].emp_id_5,
                                        'emp_id_6': response[0].emp_id_6,
                                        'emp_email_1': response[0].emp_email_1,
                                        'emp_email_2': response[0].emp_email_2,
                                        'emp_email_3': response[0].emp_email_3,
                                        'emp_email_4': response[0].emp_email_4,
                                        'emp_email_5': response[0].emp_email_5,
                                        'emp_email_6': response[0].emp_email_6,
                                        'token': $scope.$root.token
                                    })
                                    .then(function (res) {
                                        if (res.data.ack == true) {
                                            $scope.showLoader = false;
                                            toaster.pop('success', 'Success', $scope.$root.getErrorMessageByCode(622));
                                            return;
                                        }
                                        else {
                                            $scope.showLoader = false;
                                            if (res.data.error != undefined)
                                                toaster.pop('error', 'Error', res.data.error);
                                            else
                                                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(371));
                                            return;
                                        }
                                    });
                            },
                                function (reason) {
                                    $scope.showLoader = false;
                                    console.log('Modal promise rejected. Reason: ', reason);
                                });
                        }
                        else if (Number(response[0].prev_status) == 1) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(513, ['Awaiting']));
                            return;
                        }
                        else if (Number(response[0].prev_status) == 0) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(513, ['Queued']));
                            return;
                        }
                        else if (Number(response[0].prev_status) == 7) {
=======
                            }).then(function(value) {
                                    $scope.showLoader = true;
                                    var check_approvals = $scope.$root.setup + "general/send-for-approval";
                                    //'warehouse_id': item.warehouses.id
                                    $http
                                        .post(check_approvals, {
                                            'object_id': $scope.$root.order_id,
                                            'object_code': $scope.rec.sale_order_code,
                                            'source_name': $scope.rec.sell_to_cust_name,
                                            'source_code': $scope.rec.sell_to_cust_no,
                                            'detail_id': 0,
                                            'approval_id': response[0].id,
                                            'code': $scope.rec.sale_order_code,
                                            'criteria': response[0].criteria,
                                            'current_value': $scope.stats.profit_percentage,
                                            'currency_code': $scope.rec.currency_id.code,
                                            'type': "1",
                                            'emp_id_1': response[0].emp_id_1,
                                            'emp_id_2': response[0].emp_id_2,
                                            'emp_id_3': response[0].emp_id_3,
                                            'emp_id_4': response[0].emp_id_4,
                                            'emp_id_5': response[0].emp_id_5,
                                            'emp_id_6': response[0].emp_id_6,
                                            'emp_email_1': response[0].emp_email_1,
                                            'emp_email_2': response[0].emp_email_2,
                                            'emp_email_3': response[0].emp_email_3,
                                            'emp_email_4': response[0].emp_email_4,
                                            'emp_email_5': response[0].emp_email_5,
                                            'emp_email_6': response[0].emp_email_6,
                                            'token': $scope.$root.token
                                        })
                                        .then(function(res) {
                                            if (res.data.ack == true) {
                                                $scope.showLoader = false;
                                                toaster.pop('success', 'Success', $scope.$root.getErrorMessageByCode(622));
                                                return;
                                            } else {
                                                $scope.showLoader = false;
                                                if (res.data.error != undefined)
                                                    toaster.pop('error', 'Error', res.data.error);
                                                else
                                                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(371));
                                                return;
                                            }
                                        });
                                },
                                function(reason) {
                                    $scope.showLoader = false;
                                    console.log('Modal promise rejected. Reason: ', reason);
                                });
                        } else if (Number(response[0].prev_status) == 1) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(513, ['Awaiting']));
                            return;
                        } else if (Number(response[0].prev_status) == 0) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(513, ['Queued']));
                            return;
                        } else if (Number(response[0].prev_status) == 7) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(392, ['Sales Order']));
                            return;
                        }
                    }

                    var response2 = {};
                    if (response.length == 1)
                        response2 = response[0];
                    else if (response.length == 2)
                        response2 = response[1];
                    else
                        return;

                    if (already_checked == 0 && Number(response2.type) == 2 && converted_credit_limit > 0 && (Number($scope.rec.customer_balance) + Number($scope.rec.grand_total_converted) > Number(converted_credit_limit))) {
                        if (Number(response2.prev_status) == -1 || Number(response2.prev_status) == 3 || Number(response2.prev_status) == 6) {
                            var str = '';
                            if (Number(response2.prev_status) == 3) {
                                str = "Previously disapproved by " + response2.responded_by + ", ";

                            }
                            $rootScope.approval_message = str + "The outstanding amount exceeds the aurthosied credit limit of " + converted_credit_limit + " " + $rootScope.defaultCurrencyCode + ", you need to queue this Sales Order for approval.";
                            ngDialog.openConfirm({
                                template: '_confirm_approval_required_modal',
                                className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
                            }).then(function (value) {
                                $scope.showLoader = true;
                                var check_approvals = $scope.$root.setup + "general/send-for-approval";
                                //'warehouse_id': item.warehouses.id
                                $http
                                    .post(check_approvals, {
                                        'object_id': $scope.$root.order_id,
                                        'object_code': $scope.rec.sale_order_code,
                                        'source_name': $scope.rec.sell_to_cust_name,
                                        'source_code': $scope.rec.sell_to_cust_no,
                                        'detail_id': 0,
                                        'approval_id': response2.id,
                                        'code': $scope.rec.sale_order_code,
                                        'current_value': exceded_by,
                                        'currency_code': $scope.rec.currency_id.code,
                                        'type': "2",
                                        'emp_id_1': response2.emp_id_1,
                                        'emp_id_2': response2.emp_id_2,
                                        'emp_id_3': response2.emp_id_3,
                                        'emp_id_4': response2.emp_id_4,
                                        'emp_id_5': response2.emp_id_5,
                                        'emp_id_6': response2.emp_id_6,
                                        'emp_email_1': response2.emp_email_1,
                                        'emp_email_2': response2.emp_email_2,
                                        'emp_email_3': response2.emp_email_3,
                                        'emp_email_4': response2.emp_email_4,
                                        'emp_email_5': response2.emp_email_5,
                                        'emp_email_6': response2.emp_email_6,
                                        'token': $scope.$root.token
                                    })
                                    .then(function (res) {
                                        if (res.data.ack == true) {
                                            $scope.showLoader = false;
                                            toaster.pop('success', 'Success', $scope.$root.getErrorMessageByCode(622));
                                            return;
                                        }
                                        else {
                                            $scope.showLoader = false;
                                            if (res.data.error != undefined)
                                                toaster.pop('error', 'Error', res.data.error);
                                            else
                                                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(371));
                                            // return;
                                        }
                                    });
                            },
                                function (reason) {
                                    $scope.showLoader = false;
                                    console.log('Modal promise rejected. Reason: ', reason);
                                });
                        }
                        else if (Number(response2.prev_status) == 1) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(514, ['Awaiting']));
                            // return;
                        }
                        else if (Number(response2.prev_status) == 0) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(514, ['Queued']));
                            // return;
                        }

                        else if (Number(response[0].prev_status) == 7) {
=======
                            }).then(function(value) {
                                    $scope.showLoader = true;
                                    var check_approvals = $scope.$root.setup + "general/send-for-approval";
                                    //'warehouse_id': item.warehouses.id
                                    $http
                                        .post(check_approvals, {
                                            'object_id': $scope.$root.order_id,
                                            'object_code': $scope.rec.sale_order_code,
                                            'source_name': $scope.rec.sell_to_cust_name,
                                            'source_code': $scope.rec.sell_to_cust_no,
                                            'detail_id': 0,
                                            'approval_id': response2.id,
                                            'code': $scope.rec.sale_order_code,
                                            'current_value': exceded_by,
                                            'currency_code': $scope.rec.currency_id.code,
                                            'type': "2",
                                            'emp_id_1': response2.emp_id_1,
                                            'emp_id_2': response2.emp_id_2,
                                            'emp_id_3': response2.emp_id_3,
                                            'emp_id_4': response2.emp_id_4,
                                            'emp_id_5': response2.emp_id_5,
                                            'emp_id_6': response2.emp_id_6,
                                            'emp_email_1': response2.emp_email_1,
                                            'emp_email_2': response2.emp_email_2,
                                            'emp_email_3': response2.emp_email_3,
                                            'emp_email_4': response2.emp_email_4,
                                            'emp_email_5': response2.emp_email_5,
                                            'emp_email_6': response2.emp_email_6,
                                            'token': $scope.$root.token
                                        })
                                        .then(function(res) {
                                            if (res.data.ack == true) {
                                                $scope.showLoader = false;
                                                toaster.pop('success', 'Success', $scope.$root.getErrorMessageByCode(622));
                                                return;
                                            } else {
                                                $scope.showLoader = false;
                                                if (res.data.error != undefined)
                                                    toaster.pop('error', 'Error', res.data.error);
                                                else
                                                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(371));
                                                // return;
                                            }
                                        });
                                },
                                function(reason) {
                                    $scope.showLoader = false;
                                    console.log('Modal promise rejected. Reason: ', reason);
                                });
                        } else if (Number(response2.prev_status) == 1) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(514, ['Awaiting']));
                            // return;
                        } else if (Number(response2.prev_status) == 0) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(514, ['Queued']));
                            // return;
                        } else if (Number(response[0].prev_status) == 7) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(392, ['Sales Order']));
                            // return;
                        }
                    }
                }

            });



    }
<<<<<<< HEAD
    $scope.OnChangeUnitPrice = function (item) {
=======
    $scope.OnChangeUnitPrice = function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        /* if (item.item_type == 0 && Number(item.standard_price) < 0) {
            toaster.pop("error", "Error", "Standard price value can not be negative for items");
            item.standard_price = '';
        } */
        if (item.item_type == 0) {
            if (item.sales_prices.min_sale_price != undefined) {
                if (Number(item.sales_prices.min_sale_price) > Number(item.standard_price)) {
                    item.standard_price = Number(item.sales_prices.min_sale_price);
                    toaster.pop('warning', 'Info', 'Standard price cannot be less than ' + (item.sales_prices.min_sale_price).toFixed(3));
                }
            }
        }
        item.standard_price = Number(item.standard_price);
    }
<<<<<<< HEAD
    $scope.onChangeDiscountType = function (item) {
=======
    $scope.onChangeDiscountType = function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (item.discount != '') {
            if (isNaN(item.discount)) {
                item.discount = '';
            }
        }
        if (item.discount_type_id != undefined) {

            if (item.discount_type_id.id == 'None') {
                item.discount = '';
<<<<<<< HEAD
            }
            else if (item.discount_type_id.id == 'Percentage') {
                if (item.discount != '' && Number(item.discount) > 100) {
                    item.discount = '';//item.discount.slice(0, -1);
=======
            } else if (item.discount_type_id.id == 'Percentage') {
                if (item.discount != '' && Number(item.discount) > 100) {
                    item.discount = ''; //item.discount.slice(0, -1);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(515));
                }
            }
        }
    }
<<<<<<< HEAD
    $scope.checkDuplWHItem = function (param_item, index) {
=======
    $scope.checkDuplWHItem = function(param_item, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (param_item.item_type == 0 && Number(param_item.warehouses) != 0) {
            var chk_item = $filter("filter")(param_item.arr_warehouse, { id: param_item.warehouses }, true);
            if (chk_item != undefined && chk_item.length > 0) {
                param_item.warehouse_name = chk_item[0].name;
                param_item.warehouse_name_qty = chk_item[0].name + ' (' + chk_item[0].available_quantity + ')';
                if (Number(chk_item[0].available_quantity) < (Number(param_item.qty) - Number(param_item.allocated_stock))) {
                    toaster.pop('warning', 'Info', 'Available quantity is less than item quantity!');
                    $scope.items[index].warehouses = 0;
                    // return false;
                }
<<<<<<< HEAD
            }
            else
=======
            } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                param_item.warehouse_name = "";

            /* var SelectedWH = [];
            angular.forEach($scope.items, function (item, obj_index) {
                if (param_item.id == item.id) {
                    var chk_item = $filter("filter")(item.arr_warehouse, { id: item.warehouses }, true);
                    if (chk_item != undefined && chk_item.length > 0) {
                        var idx = item.arr_warehouse.indexOf(chk_item[0]);
                        if (idx != -1)
                            SelectedWH.push(idx);
                    }
                }
            });
    
            angular.forEach($scope.items, function (item) {
                if (param_item.id == item.id) {
                    angular.forEach(item.arr_warehouse, function (obj, idx) {
                        if (SelectedWH.indexOf(idx) != -1) {
                            obj.disabled = true;
                        }
                        else
                            obj.disabled = false;
                    });
                }
            }); */
        }
        /* 
        var chk_item = $filter("filter")(param_item.arr_warehouse, { id: param_item.warehouses });
        var idx = param_item.arr_warehouse.indexOf(chk_item[0]);
        param_item.arr_warehouse[idx].disabled = true;
    
        angular.forEach($scope.items, function(item, obj_index){
            if(param_item.id == item.id && index != obj_index)
            {
                var chk_item = $filter("filter")(item.arr_warehouse, { id: param_item.warehouses });
                var idx = item.arr_warehouse.indexOf(chk_item[0]);
                item.arr_warehouse[idx].disabled = true;
            }
        }); */


        /* angular.forEach(param_item.arr_warehouse, function(obj){
            if(obj.id != param_item.warehouses)
            {
                obj.disabled = false;
            }
            else
                obj.disabled = true;
        }); */

        /* var chk = true;
        var count = 0;
        angular.forEach($scope.items, function (itm, indx) {
            if ((item.warehouses.id == itm.warehouses.id) && (itm.id == item.id) && indx != index) {
                toaster.pop('error', 'Error', 'This item has already been allocated in this location!');
                $scope.items[index].warehouses = 0;
                chk = false;
            }
            count++;
        });
        var item_ = $filter("filter")(item.arr_warehouse, { id: item.warehouses.id });
        if(item_[0].available_quantity  < item.qty)
        {
            toaster.pop('warning', 'Info', 'Available quantity is less than item quantity!');
            $scope.items[index].warehouses = 0;
            return false;
        } */
        /*
        var idx = item.arr_warehouse.indexOf(item[0]);
        console.log(item);
         
        if ($scope.items.length == count) {
            if (chk == true) {
                $scope.checkStock(item, index);
            }
        } */
    }


<<<<<<< HEAD
    $scope.checkStock = function (item, index) {
=======
    $scope.checkStock = function(item, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var chkStockUrl = $scope.$root.sales + 'customer/order/get-warehouse-avail-stock';
        //'warehouse_id': item.warehouses.id
        $http
            .post(chkStockUrl, {
                'warehouse_id': item.warehouses,
                type: 1,
                item_id: item.id,
                'token': $scope.$root.token
            })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    if (res.data.avail_qty < item.qty) {
                        toaster.pop('warning', 'Info', 'Available quantity is less than item quantity!');
                        $scope.items[index].warehouses = 0;
                        return false;
                    }
<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    toaster.pop('warning', 'Info', 'No stock availabe!');
                    $scope.items[index].warehouses = 0;
                    return false;
                }
            });
    }

<<<<<<< HEAD
    $scope.GetApprovalStatus = function () {
=======
    $scope.GetApprovalStatus = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.approval_history = [];
        $scope.show_approval_btn = false;
        $scope.show_disapproval_btn = false;
        $scope.disableDisapprovalBtn = false;

        var postUrl_ref_cat = $scope.$root.setup + "general/get-approval-status";
        $http
            .post(postUrl_ref_cat, {
                'object_id': $scope.$root.order_id,
                type: "1, 2",
                'token': $scope.$root.token
            })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    $scope.approval_history = res.data.response;
                    if ($scope.approval_history[$scope.approval_history.length - 1].statuss == 'Awaiting Approval' && Number($scope.approval_history[$scope.approval_history.length - 1].approver) == 1) {
                        $scope.show_approval_btn = true;
                        $scope.show_disapproval_btn = true;
                    }

                    if ($scope.approval_history[$scope.approval_history.length - 1].statuss == 'Approved' && Number($scope.approval_history[$scope.approval_history.length - 1].approver) == 1)
                        $scope.show_disapproval_btn = true;
                }
            });
        angular.element('#_approval_history').modal({ show: true });
    }

<<<<<<< HEAD
    $scope.emailInvoice = function (changeState) {
=======
    $scope.emailInvoice = function(changeState) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        //codemark email invoice
        var prntInvoiceUrl = $scope.$root.sales + "customer/order/print-invoice";

        $rootScope.printinvoiceFlag = false;
        $http
            .post(prntInvoiceUrl, {
                id: $scope.$root.order_id,
                'type': '1',
                token: $scope.$root.token
            })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    $scope.print_invoice_vals = res.data.response;
                    /* 
                    console.log($scope.print_invoice_vals);
                    console.log($scope.print_invoice_vals.doc_details_arr); */
                    // angular.element('#sales_order_modal').modal({ 
                    //     show: true
                    // });
                    var invoicePdfModal = ModalService.showModal({
                        templateUrl: 'app/views/invoice_templates/sales_order_modal.html',
                        controller: 'invoiceModalController',
                        inputs: {
                            print_invoice_vals: $scope.print_invoice_vals
                        }
                        //     resolve: {
                        //         params: function(){
                        //             return {
                        //                 print_invoice_vals: scope.print_invoice_vals
                        //             };
                        //         }
                        //     }
                    });
<<<<<<< HEAD
                    invoicePdfModal.then(function (res) {
                        res.element.modal("hide");
                        console.log('Returned results2: ', res);
                        console.log("Modal succesfully closed!");
                        $timeout(function () {
=======
                    invoicePdfModal.then(function(res) {
                        res.element.modal("hide");
                        console.log('Returned results2: ', res);
                        console.log("Modal succesfully closed!");
                        $timeout(function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            $scope.showLoader = false;
                            var targetPdf = angular.element('#sales_order_modal')[0].innerHTML;

                            let currentUrl = window.location.href;
                            $scope.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;

                            //console.log("target PDF", targetPdf);
                            var pdfInvoice = $scope.$root.setup + "general/print-pdf-invoice";
                            $http
<<<<<<< HEAD
                                .post(pdfInvoice, { 'emailData': $scope.emailData, 'email': true, 'emailType': 'salesInvoice', 'company_logo_url': $scope.company_logo_url,'dataPdf': targetPdf, 'type': 2, 'filename': 'Sale_Order', token: $scope.$root.token })
                                .then(function (res) {
=======
                                .post(pdfInvoice, { 'emailData': $scope.emailData, 'email': true, 'emailType': 'salesInvoice', 'company_logo_url': $scope.company_logo_url, 'dataPdf': targetPdf, 'type': 2, 'filename': 'Sale_Order', token: $scope.$root.token })
                                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    if (res.data.ack == true) {
                                        $rootScope.printinvoiceFlag = true;
                                        var toasterMsg = "Invoice Sent.";
                                        // toaster.pop('success', 'Info', toasterMsg);
<<<<<<< HEAD
                                    }
                                    else {
=======
                                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                        console.log('Fail');
                                        var toasterMsg = "Something went wrong while sending the email.";
                                        toaster.pop('error', 'Error', toasterMsg);
                                    }
                                    if (changeState) {
<<<<<<< HEAD
                                        $timeout(function () {
=======
                                        $timeout(function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                            $state.go("app.addOrder");
                                        }, 1500);
                                    }
                                });
                        })

                    });
<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.showLoader = false;
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(511));
                }
            });

    }


<<<<<<< HEAD
=======
    $scope.searchKeywordInv = {};
    $scope.paymentDetailRec = {};

    $scope.getInvoicesForPaymentsList = function(rec, index, parent_id) {

        $scope.disable_save = false;

        var postUrl = $scope.$root.sales + "customer/order/invoice-for-refund-listings";

        $scope.postData = {};

        // $scope.postData.searchKeywordInv = {};

        $scope.postData.parent_id = parent_id; //rec.parent_id;
        $scope.postData.doc_type = 2;
        $scope.postData.account_id = $scope.rec.bill_to_cust_id;
        $scope.postData.posting_date = $scope.paymentData.invoice_date; // rec.invoice_date;
        $scope.postData.currency_id = ($scope.rec.currency_id) ? $scope.rec.currency_id.id : 0;
        $scope.postData.sell_to_cust_id = $scope.rec.bill_to_cust_id;
        $scope.postData.token = $scope.$root.token;
        $scope.postData.more_fields = 1;
        $scope.postData.type = 1;

        if (rec.payment_detail_id > 0) {

            $scope.paymentDetailRec = rec;
            $scope.current_index = index;

            $scope.showLoader = true;

            $scope.ReciptInvoiceModalarr = [];

            $http
                .post(postUrl, $scope.postData)
                .then(function(res) {

                    if (res.data.ack == true) {
                        $scope.total = res.data.total;
                        $scope.item_paging.total_pages = res.data.total_pages;
                        $scope.item_paging.cpage = res.data.cpage;
                        $scope.item_paging.ppage = res.data.ppage;
                        $scope.item_paging.npage = res.data.npage;
                        $scope.item_paging.pages = res.data.pages;
                        $scope.total_paging_record = res.data.total_paging_record;
                        $scope.showLoader = false;
                        $scope.ReciptInvoiceModalarr = res.data.response;
                        $scope.currency_code = res.data.response[0].currency_code;

                        angular.element('#payment_alloc_modal').modal({ show: true });
                        //InvoicesForPayments
                    } else {
                        $scope.showLoader = false;
                        $scope.paymentDetailRec = {};
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                    }
                });

        } else {

            $scope.savePaymentModal(rec, 1)
                .then(function() {
                    $scope.showLoader = false;

                    $scope.paymentDetailRec = rec;
                    $scope.current_index = index;

                    $scope.showLoader = true;

                    $scope.ReciptInvoiceModalarr = [];

                    $http
                        .post(postUrl, $scope.postData)
                        .then(function(res) {

                            if (res.data.ack == true) {
                                $scope.total = res.data.total;
                                $scope.item_paging.total_pages = res.data.total_pages;
                                $scope.item_paging.cpage = res.data.cpage;
                                $scope.item_paging.ppage = res.data.ppage;
                                $scope.item_paging.npage = res.data.npage;
                                $scope.item_paging.pages = res.data.pages;
                                $scope.total_paging_record = res.data.total_paging_record;
                                $scope.showLoader = false;
                                $scope.ReciptInvoiceModalarr = res.data.response;
                                $scope.currency_code = res.data.response[0].currency_code;

                                angular.element('#payment_alloc_modal').modal({ show: true });
                                //InvoicesForPayments
                            } else {
                                $scope.showLoader = false;
                                $scope.paymentDetailRec = {};
                                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                            }
                        });

                })
                .catch(function(message) {
                    $scope.showLoader = false;
                    toaster.pop('error', 'info', message);
                });
        }
    }

    // $scope.amount_total = 0;

    $scope.netTotalPayment = function(paymentDetailRec) {

        if (paymentDetailRec) {

            var ctotal = 0;
            angular.forEach($scope.ReciptInvoiceModalarr, function(item) {

                if (item.amount >= 0)
                    ctotal += parseFloat(item.amount);
            });
            // console.log('$scope.paymentData.credit_amount == ', $scope.paymentData.credit_amount);
            console.log('paymentDetailRec.credit_amount == ', paymentDetailRec.credit_amount);
            // console.log('$scope.paymentData.allocated_amount == ', $scope.paymentData.allocated_amount);
            console.log('paymentDetailRec.allocated_amount == ', paymentDetailRec.allocated_amount);
            console.log('ctotal == ', ctotal);

            // $scope.amount_left = Number(Number($scope.paymentData.credit_amount).toFixed(2) - Number(ctotal).toFixed(2) - Number($scope.paymentData.allocated_amount).toFixed(2)).toFixed(2);
            $scope.amount_left = parseFloat(parseFloat(paymentDetailRec.credit_amount).toFixed(2) - parseFloat(ctotal).toFixed(2) - parseFloat(paymentDetailRec.allocated_amount).toFixed(2)).toFixed(2);
            // console.log('$scope.amount_left == ', $scope.amount_left);
        } else
            $scope.amount_left = 0;

        return $scope.amount_left;

    }

    $scope.setremainingamount = function(item, index) {

        var amount2 = 0;

        if (item.is_infull == true) {

            if ((item.grand_total - item.paid_amount) == 0)
                item.amount = item.grand_total;
            else if (item.grand_total - item.paid_amount > 0)
                item.amount = (item.grand_total - item.paid_amount);

            if ($scope.amount_left < item.amount) item.amount = parseFloat($scope.amount_left);

        } else if (item.amount) { //  != undefined

            if ((item.grand_total - item.paid_amount) == 0)
                item.amount = 0;
            else if (item.grand_total - item.paid_amount > 0)
                amount2 = (item.grand_total - item.paid_amount);

            if (item.amount > parseFloat(amount2)) item.amount = parseFloat(amount2);
            else
                item.amount = 0;
        } else {
            item.amount = 0;
        }

        item.amount = Number(item.amount).toFixed(2);
        $scope.ReciptInvoiceModalarr[index].amount = item.amount;

        // item.amount = Number(item.amount);
    }

    $scope.postJournal = function(flag = null) {


        $scope.postponeVATCHK = 0;

        if (flag == 1) {

            var post = {};
            post.token = $scope.$root.token;
            post.postponed_vat = $scope.postponed_vat;

            console.log('$scope.paymentData.parent_id == ', $scope.paymentData.parent_id);

            if ($scope.postData.parent_id && $scope.postData.parent_id > 0)
                post.parent = $scope.postData.parent_id;
            else
                post.parent = $scope.paymentData.parent_id;


            var editUrl = $scope.$root.gl + "chart-accounts/convert-posting-receipt";

            $http
                .post(editUrl, post)
                .then(function(res) {

                    if (res.data.ack == true) {
                        $scope.backend_data = 0;
                    } else {
                        $scope.showLoader = false;
                        toaster.pop('error', 'Error', res.data.error);
                    }
                });

        } else {

            ngDialog.openConfirm({
                template: 'modalcontinueid',
                className: 'ngdialog-theme-default-custom'
            }).then(function(value) {
                var post = {};
                post.token = $scope.$root.token;
                post.parent = $scope.postData.parent_id;
                // post.items = $scope.receipt_sub_list;

                var editUrl = $scope.$root.gl + "chart-accounts/convert-posting-receipt";
                $scope.showLoader = true;
                $http
                    .post(editUrl, post)
                    .then(function(res) {
                        if (res.data.ack == true) {
                            toaster.pop('success', 'info', 'Record Posted Successfully');
                            $scope.backend_data = 0;
                            $scope.showLoader = false;
                            angular.element('#payment_modal').modal('hide');
                        } else {
                            $scope.showLoader = false;
                            toaster.pop('error', 'Error', res.data.error);
                        }
                    });
            }, function(reason) {
                $scope.showLoader = false;
                console.log('Modal promise rejected. Reason: ', reason);
            });
        }
    }

    $scope.deletePaymentAllocation = function() {

        $scope.disable_save = true;
        $scope.showLoader = true;

        var postData = {};
        postData.transaction_type = 1;
        postData.module_type = 1;
        postData.invoice_type = 5;

        postData.token = $scope.$root.token;

        if ($scope.postData.parent_id && $scope.postData.parent_id > 0)
            postData.payment_id = $scope.postData.parent_id;
        else
            postData.payment_id = $scope.paymentData.parent_id;

        postData.payment_detail_id = $scope.paymentData.payment_detail_id;


        var allocation_url = $scope.$root.gl + "chart-accounts/delete-all-payment-allocations";

        $http
            .post(allocation_url, postData)
            .then(function(res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $scope.customerPayment($scope.rec);
                    $scope.disable_save = false;
                    $scope.showLoader = false;

                } else {
                    $scope.disable_save = false;
                    $scope.showLoader = false;
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(105));
                }
            });
        // }

    }

    $scope.AddPaymentAllocation = function(flag = 0) {

        $scope.disable_save = true;
        $scope.showLoader = true;

        var postData = {};
        postData.transaction_type = 1;
        postData.module_type = 1;
        postData.invoice_type = 5;

        postData.token = $scope.$root.token;

        var currentRec = $scope.receipt_sub_list[$scope.current_index];

        postData.payment_id = currentRec.parent_id;
        postData.payment_detail_id = currentRec.payment_detail_id;
        postData.payment_id = currentRec.parent_id;
        postData.payment_detail_id = currentRec.payment_detail_id;
        postData.account_name = currentRec.customer;

        postData.balancing_account_code = currentRec.balancing_account_code;
        postData.balancing_account_name = currentRec.balancing_account_name;
        postData.balancing_account_id = currentRec.balancing_account_id;
        postData.document_no = currentRec.document_no;
        postData.posting_date = currentRec.invoice_date;

        if (!(currentRec.balancing_account_id > 0)) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Balancing Account']));
            $scope.showLoader = false;
            return false;
        }


        /* var payData = {};

        payData.token = $scope.$root.token;

        payData.payment_id = currentRec.parent_id;
        payData.payment_detail_id = currentRec.payment_detail_id;
        payData.account_name = currentRec.customer;

        payData.balancing_account_code = currentRec.balancing_account_code;
        payData.balancing_account_name = currentRec.balancing_account_name;
        payData.balancing_account_id = currentRec.balancing_account_id;
        payData.document_no = currentRec.document_no;
        payData.posting_date = currentRec.invoice_date;

        var journalUpdateUrl = $scope.$root.sales + 'customer/order/update-customer-journal-for-invoice';

        $http
            .post(journalUpdateUrl, payData)
            .then(function(res) {
                if (res.data.ack == true) {
                    // $scope.showLoader = false;

                } else {
                    $scope.showLoader = false;
                    return false;
                }
            }); */

        var selected_items = [];

        console.log('$scope.ReciptInvoiceModalarr == ', $scope.ReciptInvoiceModalarr);

        angular.forEach($scope.ReciptInvoiceModalarr, function(obj) {

            if (obj.amount > 0) {
                var invoice_type = 1;
                selected_items.push({
                    'invoice_id': obj.order_id,
                    'amount_allocated': obj.amount,
                    'document_type': invoice_type,
                    'cust_payment_id': obj.cust_payment_id,
                    'allocation_date': obj.allocation_date
                });
            }
        });

        postData.items = selected_items;
        var allocation_url = $scope.$root.gl + "chart-accounts/add-payment-allocation";

        $http
            .post(allocation_url, postData)
            .then(function(res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $scope.receipt_sub_list[$scope.current_index].allocated_amount = parseFloat($scope.receipt_sub_list[$scope.current_index].allocated_amount) + parseFloat(res.data.total_allocated);


                    // $scope.paymentData.allocated_amount = Number($scope.paymentData.allocated_amount) + Number(res.data.total_allocated);

                    // $scope.paymentData.total_remaining = Number(Number($scope.paymentData.credit_amount) - Number($scope.paymentData.allocated_amount)).toFixed(2);

                    $scope.$emit('updatePaymentStatus', $scope.rec.id);

                    if (flag == 1) {
                        $scope.postJournal();
                    } else if (flag == 2) {
                        $scope.postJournal(1); // Direct Posting From Invoice
                    } else {
                        $scope.showLoader = false;
                        angular.element('#payment_modal').modal('hide');
                    }

                } else {
                    $scope.disable_save = false;
                    $scope.showLoader = false;
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(105));
                }
            });
        // }

    }



    $scope.sendforJournalPost = function() {
        $scope.showLoader = true;
        $scope.AddPaymentAllocation(1); // flag and is_post
    }

    $scope.AddReceiptRow = function() {

        var subListObj = {};

        subListObj.invoice_id = $scope.rec.id;
        subListObj.customerId = $scope.rec.bill_to_cust_id;
        subListObj.customerCode = $scope.rec.bill_to_cust_no;
        subListObj.posting_group_id = $rootScope.order_posting_group_id;

        subListObj.doc_type = 2;
        subListObj.module_type = 3;
        subListObj.grand_total = $scope.rec.grand_total;
        subListObj.currency = $scope.paymentData.currency;

        subListObj.customer = $scope.rec.bill_to_name;
        subListObj.glcode = '';
        subListObj.acc_code = '';
        subListObj.cnv_rate = $scope.rec.currency_rate;
        subListObj.postedStatus = 0;
        subListObj.invoice_date = $scope.rec.posting_date;
        subListObj.allocation_date = $scope.rec.posting_date;
        subListObj.credit_amount = parseFloat($scope.rec.grand_total);
        subListObj.allocated_amount = 0;
        subListObj.converted_price = parseFloat($scope.rec.grand_total_converted);
        subListObj.total_remaining = 0;
        subListObj.total_setteled_other = 0;
        subListObj.parent_id = $scope.paymentData.parent_id;
        subListObj.payment_detail_id = 0;
        subListObj.paid = 0;
        subListObj.document_no = $scope.rec.sale_order_code;

        if ($scope.rec.payable_number && $scope.rec.account_payable_id) {

            let accountStr = $scope.rec.payable_number.split(' - ');
            let accountName = accountStr.slice(1, 10);

            subListObj.balancing_account_code = accountStr[0];
            subListObj.balancing_account_name = accountName.join(' - ');
            subListObj.balancing_account_id = $scope.rec.account_payable_id;
            subListObj.balancing_account = $scope.rec.payable_number;
        }

        $scope.receipt_sub_list.push(subListObj);
    }


    $scope.deletReceiptRow = function(payment_detail_id, index) {
        if (!(payment_detail_id > 0)) {
            $scope.receipt_sub_list.splice(index, 1);

            if ($scope.receipt_sub_list.length == 0)
                $scope.AddReceiptRow();

        } else {

            var delReceiptRowUrl = $scope.$root.gl + "chart-accounts/delete-jl-journal-receipt";

            ngDialog.openConfirm({
                template: 'modalDeleteDialogId',
                className: 'ngdialog-theme-default-custom'
            }).then(function(value) {
                $scope.showLoader = true;

                $http
                    .post(delReceiptRowUrl, { id: payment_detail_id, 'token': $scope.$root.token })
                    .then(function(res) {

                        if (res.data.ack == true) {
                            $scope.showLoader = false;
                            toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                            $scope.receipt_sub_list.splice(index, 1);
                            if ($scope.receipt_sub_list.length == 0)
                                $scope.AddReceiptRow();
                        } else {
                            $scope.showLoader = false;
                            toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                        }
                    });
            }, function(reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
        }
    }

    $scope.customerPayment = function(rec) {
        console.log('rec == ', rec);

        $scope.showLoader = true;
        var journalGetUrl = $scope.$root.sales + 'customer/order/get-customer-journal-for-invoice';

        let postData = {};
        postData.token = $scope.$root.token;
        postData.invoice_id = rec.id;


        $scope.receipt_sub_list = [];
        /* $scope.receipt_sub_list.push({ 'id': '', 'allocated_amount': 0 });

        $scope.receipt_sub_list[$scope.receipt_sub_list.length - 1].posting_date = rec.posting_date;
        // $scope.receipt_sub_list[$scope.receipt_sub_list.length - 1].doc_type = $scope.receipt_sub_list[$scope.receipt_sub_list.length - 2].doc_type;
        $scope.receipt_sub_list[$scope.receipt_sub_list.length - 1].document_no = $scope.rec.sale_order_code; */

        $scope.paymentData = {};
        $scope.paymentDataSearch = {}


        $scope.paymentData.customerId = rec.bill_to_cust_id;
        $scope.paymentData.customerCode = rec.bill_to_cust_no;

        $scope.paymentData.posting_group_id = $rootScope.order_posting_group_id;

        $scope.paymentData.doc_type = 2;
        $scope.paymentData.module_type = 3;
        $scope.paymentData.grand_total = rec.grand_total;
        $scope.paymentData.currency = rec.currency_id.code;

        $scope.paymentData.invoice_id = rec.id;


        $http
            .post(journalGetUrl, postData)
            .then(function(res) {
                $scope.showLoader = false;



                if (!($rootScope.order_posting_group_id > 0)) {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Customer Posting Group']));
                    $scope.showLoader = false;
                    return;
                }

                $scope.receipt_sub_list = [];



                if (res.data.ack == true) {
                    var resData = res.data.response;



                    angular.forEach(resData, function(element) {

                        $scope.paymentData.customer = element.account_name;
                        $scope.paymentData.parent_id = element.parent_id;
                        $scope.rec.currentAllocatedPayment = element.amount_allocated;
                        $scope.paymentData.acc_code = element.glcode;

                        var subListObj = {};

                        subListObj.invoice_id = $scope.rec.id;
                        subListObj.customerId = $scope.rec.bill_to_cust_id;
                        subListObj.customerCode = $scope.rec.bill_to_cust_no;
                        subListObj.posting_group_id = $rootScope.order_posting_group_id;

                        subListObj.doc_type = 2;
                        subListObj.module_type = 3;
                        subListObj.grand_total = $scope.paymentData.grand_total;
                        subListObj.currency = $scope.paymentData.currency;



                        subListObj.customer = element.account_name;
                        subListObj.glcode = element.glcode;
                        subListObj.acc_code = element.glcode;
                        subListObj.cnv_rate = element.cnv_rate;
                        subListObj.postedStatus = element.postedStatus;
                        subListObj.invoice_date = element.posting_date;
                        subListObj.allocation_date = element.allocation_date;
                        subListObj.credit_amount = parseFloat(element.credit_amount);
                        subListObj.allocated_amount = parseFloat(element.allocated_amount);
                        subListObj.converted_price = parseFloat(element.converted_price);
                        subListObj.total_remaining = parseFloat(element.credit_amount) - parseFloat(element.amount_allocated);
                        subListObj.total_setteled_other = 0;
                        subListObj.parent_id = element.parent_id;
                        subListObj.payment_detail_id = element.payment_detail_id;
                        subListObj.paid = element.paid;
                        subListObj.document_no = element.document_no;

                        subListObj.balancing_account_code = element.balancing_account_code;
                        subListObj.balancing_account_name = element.balancing_account_name;
                        subListObj.balancing_account_id = element.balancing_account_id;
                        subListObj.balancing_account = element.balancing_account_code + ' - ' + element.balancing_account_name;

                        // if (Number($scope.paymentData.credit_amount) == Number($scope.paymentData.credit_amount)) $scope.paymentData.allocate_full = 1;

                        $scope.receipt_sub_list.push(subListObj);
                    });


                    /* 
                    $scope.paymentData.glcode = resData.glcode;
                    $scope.paymentData.acc_code = resData.glcode;
                    $scope.paymentData.postedStatus = resData.postedStatus;
                    $scope.paymentData.invoice_date = resData.posting_date;
                    $scope.paymentData.allocation_date = resData.allocation_date;
                    $scope.paymentData.credit_amount = resData.credit_amount;
                    // $scope.paymentData.allocated_amount = resData.amount_allocated;
                    $scope.paymentData.allocated_amount = resData.allocated_amount;
                    $scope.paymentData.converted_price = resData.converted_price;
                    $scope.paymentData.total_remaining = Number(resData.credit_amount) - Number(resData.amount_allocated);
                    $scope.paymentData.total_setteled_other = 0;
                    // $scope.paymentData.total_setteled_other = resData.grand_total;
                    $scope.paymentData.parent_id = resData.parent_id;
                    $scope.paymentData.payment_detail_id = resData.payment_detail_id;
                    $scope.paymentData.paid = resData.paid;
                    $scope.paymentData.document_no = resData.document_no;

                    $scope.paymentData.balancing_account_code = resData.balancing_account_code;
                    $scope.paymentData.balancing_account_name = resData.balancing_account_name;
                    $scope.paymentData.balancing_account_id = resData.balancing_account_id;
                    $scope.paymentData.balancing_account = resData.balancing_account_code + ' - ' + resData.balancing_account_name;

                    

                    if (Number($scope.paymentData.credit_amount) == Number($scope.paymentData.credit_amount)) $scope.paymentData.allocate_full = 1; */

                } else {

                    $scope.paymentData.customer = rec.bill_to_name;
                    $scope.rec.currentAllocatedPayment = 0;
                    $scope.paymentData.acc_code = '';

                    var subListObj = {};

                    subListObj.invoice_id = $scope.rec.id;
                    subListObj.customerId = $scope.rec.bill_to_cust_id;
                    subListObj.customerCode = $scope.rec.bill_to_cust_no;
                    subListObj.posting_group_id = $rootScope.order_posting_group_id;

                    subListObj.doc_type = 2;
                    subListObj.module_type = 3;
                    subListObj.grand_total = $scope.paymentData.grand_total;
                    subListObj.currency = $scope.paymentData.currency;

                    subListObj.customer = rec.bill_to_name;
                    subListObj.glcode = '';
                    subListObj.acc_code = '';
                    subListObj.cnv_rate = rec.currency_rate;
                    subListObj.postedStatus = 0;
                    subListObj.invoice_date = rec.posting_date;
                    subListObj.allocation_date = rec.posting_date;
                    subListObj.credit_amount = parseFloat(rec.grand_total);
                    subListObj.allocated_amount = 0;
                    subListObj.converted_price = parseFloat(rec.grand_total_converted);
                    subListObj.total_remaining = 0;
                    subListObj.total_setteled_other = 0;
                    subListObj.parent_id = 0;
                    subListObj.payment_detail_id = 0;
                    subListObj.paid = 0;
                    subListObj.document_no = $scope.rec.sale_order_code;

                    if (rec.payable_number && rec.account_payable_id) {

                        let accountStr = rec.payable_number.split(' - ');
                        let accountName = accountStr.slice(1, 10);

                        subListObj.balancing_account_code = accountStr[0];
                        subListObj.balancing_account_name = accountName.join(' - ');
                        subListObj.balancing_account_id = rec.account_payable_id;
                        subListObj.balancing_account = rec.payable_number;
                    }

                    $scope.receipt_sub_list.push(subListObj);

                    /* $scope.paymentData.customer = rec.bill_to_name;

                    $scope.rec.currentAllocatedPayment = 0;
                    $scope.paymentData.cnv_rate = rec.currency_rate;
                    $scope.paymentData.glcode = '';
                    $scope.paymentData.acc_code = '';
                    $scope.paymentData.postedStatus = 0;
                    $scope.paymentData.invoice_date = rec.posting_date;
                    $scope.paymentData.allocation_date = rec.posting_date;
                    $scope.paymentData.credit_amount = rec.grand_total;
                    $scope.paymentData.allocated_amount = 0;
                    $scope.paymentData.converted_price = rec.grand_total_converted;
                    $scope.paymentData.total_remaining = 0;
                    $scope.paymentData.total_setteled_other = 0;
                    $scope.paymentData.parent_id = 0;
                    $scope.paymentData.payment_detail_id = 0;
                    $scope.paymentData.paid = 0;
                    $scope.paymentData.allocate_full = 1;
                    $scope.paymentData.document_no = $scope.rec.sale_order_code;

                    if (rec.payable_number && rec.account_payable_id) {

                        let accountStr = rec.payable_number.split(' - ');
                        let accountName = accountStr.slice(1, 10);

                        $scope.paymentData.balancing_account_code = accountStr[0];
                        $scope.paymentData.balancing_account_name = accountName.join(' - ');
                        $scope.paymentData.balancing_account_id = rec.account_payable_id;
                        $scope.paymentData.balancing_account = rec.payable_number;
                    } */
                }

                // $scope.receipt_sub_list = $scope.paymentData;
                angular.element('#payment_modal').modal({ show: true });
            });

    }


    $scope.savePaymentModal = function(rec, mode) {

        var deferred = $q.defer();

        $scope.showLoader = true;



        if (!(rec.customerId > 0)) {

            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Customer No.']));
            $scope.showLoader = false;
            if (mode > 0) deferred.reject($scope.$root.getErrorMessageByCode(230, ['Customer No.']));
            return false;
        }

        if (!($rootScope.order_posting_group_id > 0)) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Customer Posting Group']));
            $scope.showLoader = false;
            if (mode > 0) deferred.reject($scope.$root.getErrorMessageByCode(230, ['Customer Posting Group']));
            return;
        }


        $errorFound = 0;

        let post = {};
        // post.selectdata = payData;
        post.token = $scope.$root.token;
        post.parent_id = $scope.paymentData.parent_id;
        post.type = 1;

        post.selectdata = [];


        angular.forEach($scope.receipt_sub_list, function(obj) {

            if (!(obj.balancing_account_id > 0)) {
                toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Balancing Account']));
                $scope.showLoader = false;
                if (mode > 0) deferred.reject($scope.$root.getErrorMessageByCode(230, ['Balancing Account']));

                $errorFound = 1;
                return false;
            }


            if (!(obj.cnv_rate > 0)) {
                toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Conversion Rate']));
                $scope.showLoader = false;
                if (mode > 0) deferred.reject($scope.$root.getErrorMessageByCode(230, ['Conversion Rate']));

                $errorFound = 1;
                return false;
            }

            if (!(obj.credit_amount > 0)) {
                toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Amount']));
                $scope.showLoader = false;
                if (mode > 0) deferred.reject($scope.$root.getErrorMessageByCode(230, ['Amount']));

                $errorFound = 1;
                return false;
            }

            var payData = {};

            payData.invoice_id = rec.invoice_id;
            payData.account_id = rec.customerId;
            payData.account_no = rec.customerCode;
            payData.account_name = rec.customer;

            payData.allocated_amount = rec.allocated_amount;
            payData.temp_allocated_amount = rec.allocated_amount;


            payData.balancing_account_code = rec.balancing_account_code;
            payData.balancing_account_name = rec.balancing_account_name;
            payData.balancing_account_id = rec.balancing_account_id;

            payData.cnv_rate = rec.cnv_rate;
            payData.converted_price = rec.converted_price;
            payData.created_date = rec.invoice_date;
            payData.transaction_type = 2;
            payData.credit_amount = 0;
            payData.credit_amount = rec.credit_amount;
            payData.currency_id = $scope.rec.currency_id;
            payData.converted_currency_id = $scope.$root.defaultCurrency;

            payData.document_no = rec.document_no;
            payData.doc_type = { id: "2", name: "Payment" };
            payData.document_type = payData.doc_type.id;

            payData.paid = rec.paid;
            payData.parent_id = $scope.paymentData.parent_id;
            payData.payment_detail_id = rec.payment_detail_id;

            payData.posting_date = rec.invoice_date;
            payData.allocation_date = rec.allocation_date;
            payData.posting_group_id = $rootScope.order_posting_group_id;

            post.selectdata.push();

        });

        /* 
        
        
        */

        if ($errorFound > 0) return false;






        console.log('payData === ', payData);

        if ($scope.paymentData.acc_code && $scope.paymentData.acc_code.length > 0) {

            console.log('acc_code == ', $scope.paymentData.acc_code);

            payData.acc_code = $scope.paymentData.acc_code;
            var journalAddUrl = $scope.$root.sales + 'customer/order/add-customer-journal-for-invoice';



            $http
                .post(journalAddUrl, post)
                .then(function(res) {
                    if (res.data.ack == true) {
                        // $scope.showLoader = false;


                        $scope.paymentData.parent_id = res.data.parent_id;
                        $scope.paymentData.payment_detail_id = res.data.payment_detail_id;

                        if (mode > 0) {
                            deferred.resolve();
                        } else {
                            toaster.pop('success', 'Add', res.data.error);
                            $scope.customerPayment($scope.rec);

                            // $scope.get_gl_recipt_sublist($scope.parent_id, is_post);
                            return true;
                        }
                    } else {
                        $scope.showLoader = false;
                        if (mode > 0) deferred.reject($scope.$root.getErrorMessageByCode(230, ['Error']));
                        return false;
                    }
                });


        } else {

            console.log('acc_code 1 == ', $scope.paymentData.acc_code);

            $scope.rec.module_type = 1;
            var table = 'gl_journal_receipt_cust';
            var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
            var name = $scope.$root.base64_encode(table);
            var no = $scope.$root.base64_encode('acc_no');
            var module_category_id = 2;

            $http
                .post(getCodeUrl, {
                    'is_increment': 1,
                    'token': $scope.$root.token,
                    'tb': name,
                    'module_type': $scope.rec.module_type,
                    'm_id': 54,
                    'no': no,
                    'category': '',
                    'brand': '',
                    'module_category_id': module_category_id
                })
                .then(function(res) {
                    if (res.data.ack == 1) {
                        payData.acc_code = res.data.code;

                        var journalAddUrl = $scope.$root.sales + 'customer/order/add-customer-journal-for-invoice';

                        /* let post = {};
                        post.selectdata = payData;
                        post.token = $scope.$root.token;
                        post.parent_id = $scope.paymentData.parent_id;
                        post.type = 1; */

                        $http
                            .post(journalAddUrl, post)
                            .then(function(res) {
                                if (res.data.ack == true) {
                                    // $scope.showLoader = false;
                                    $scope.paymentData.parent_id = res.data.parent_id;

                                    if (mode > 0) {
                                        deferred.resolve();
                                    } else {
                                        toaster.pop('success', 'Add', res.data.error);
                                        $scope.customerPayment($scope.rec);
                                        // $scope.get_gl_recipt_sublist($scope.parent_id, is_post);

                                        return true;
                                    }
                                } else {
                                    $scope.showLoader = false;
                                    if (mode > 0) deferred.reject($scope.$root.getErrorMessageByCode(230, ['Error']));
                                    return false;
                                }
                            });

                    } else {
                        $scope.showLoader = false;
                        toaster.pop('error', 'info', res.data.error);
                        if (mode > 0) deferred.reject($scope.$root.getErrorMessageByCode(230, ['Error']));
                        return false;
                    }
                });
        }

        return deferred.promise;

    }

    $scope.getGLcode = function(index) {

        var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";
        $scope.postData = {};
        $scope.title = 'G/L Accounts';
        $scope.postData.token = $scope.$root.token;
        $scope.searchKeyword2 = {};

        $scope.type_id = 2;

        $scope.showLoader = true;
        $scope.showAllOption = true;

        $scope.account_index = index;

        $http
            .post(postUrl_cat, $scope.postData)
            .then(function(res) {
                $scope.gl_account = [];
                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.gl_account = res.data.response;
                    angular.element('#finance_set_gl_account').modal({ show: true });
                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });
    }

    $scope.assignCodes = function(gl_data) {

        angular.forEach($scope.receipt_sub_list, function(obj_rec, index) {

            if (index === $scope.account_index) {
                obj_rec.balancing_account_code = gl_data.code;
                obj_rec.balancing_account_name = gl_data.name;
                obj_rec.balancing_account_id = gl_data.id;
                obj_rec.balancing_account = gl_data.code + " - " + gl_data.name;
            }
        });

        /* 
        $scope.paymentData.balancing_account_code = gl_data.code;
        $scope.paymentData.balancing_account_name = gl_data.name;
        $scope.paymentData.balancing_account_id = gl_data.id;
        $scope.paymentData.balancing_account = gl_data.code + " - " + gl_data.name; 
        */

        angular.element('#finance_set_gl_account').modal('hide');
    };

    $scope.allocateFullAmount = function(rec, flag) {

        if (flag > 0)
            $scope.paymentData.allocate_full = 0;

        if ($scope.paymentData.allocate_full > 0 && Number($scope.paymentData.total_remaining) >= Number($scope.paymentData.grand_total)) {
            $scope.paymentData.allocated_amount = Number($scope.paymentData.grand_total).toFixed(2);

        } else if (Number($scope.paymentData.allocated_amount) > Number(Number($scope.paymentData.credit_amount) - Number($scope.paymentData.total_setteled_other)).toFixed(2)) {
            toaster.pop('error', 'info', 'Allocated amount exceeds than payment');

            if (Number($scope.paymentData.total_remaining) >= Number($scope.paymentData.grand_total)) {
                $scope.paymentData.allocated_amount = Number($scope.paymentData.grand_total).toFixed(2);
            } else {
                $scope.paymentData.allocated_amount = Number(Number($scope.paymentData.credit_amount) - Number($scope.paymentData.total_setteled_other)).toFixed(2);
            }
        }

        $scope.paymentData.total_remaining = Number(Number($scope.paymentData.credit_amount) - (Number($scope.paymentData.total_setteled_other) + Number($scope.paymentData.allocated_amount))).toFixed(2);
    }

    $scope.ValidateAllocationDate = function() {
        var date_parts = $scope.paymentData.allocation_date.trim().split('/');
        var doc_to_alloc_date_parts = $scope.rec.posting_date.trim().split('/');
        var doc_from_alloc_date_parts = $scope.paymentData.invoice_date.trim().split('/');
        var alloc_date = new Date(date_parts[2], date_parts[1] - 1, date_parts[0]);
        var doc_to_alloc_date = new Date(doc_to_alloc_date_parts[2], doc_to_alloc_date_parts[1] - 1, doc_to_alloc_date_parts[0]);
        var doc_from_alloc_date = new Date(doc_from_alloc_date_parts[2], doc_from_alloc_date_parts[1] - 1, doc_from_alloc_date_parts[0]);

        if (doc_from_alloc_date >= doc_to_alloc_date && alloc_date < doc_from_alloc_date) {
            toaster.pop('error', 'Error', 'Allocation date can not be earlier than ' + $scope.paymentData.invoice_date);
            $scope.paymentData.allocation_date = $scope.paymentData.invoice_date;

        } else if (doc_to_alloc_date >= doc_from_alloc_date && alloc_date < doc_to_alloc_date) {
            toaster.pop('error', 'Error', 'Allocation date can not be earlier than ' + $scope.rec.posting_date);
            $scope.paymentData.allocation_date = $scope.rec.posting_date;
        }
    }

    $scope.convert_amount = function() {

        console.log('cnv_rate ==  ', $scope.paymentData.cnv_rate);

        if ($scope.paymentData.cnv_rate && $scope.paymentData.cnv_rate != 1)
            $scope.paymentData.converted_price = Number($scope.paymentData.credit_amount / $scope.paymentData.cnv_rate).toFixed(2);
        else
            $scope.paymentData.converted_price = $scope.paymentData.credit_amount;
    }



    $scope.closePaymentModal = function() {
        angular.element('#payment_modal').modal('hide');
    }

    $scope.closePaymentAllocModal = function() {
        angular.element('#payment_alloc_modal').modal('hide');
    }


>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    $scope.$root.load_date_picker('sale order');

}

myApp.value("serviceVariables", { generatedPDF: false });


invoiceModalController.$inject = ["$scope", "$http", "print_invoice_vals", "print_invoice_obj", "openEmailer", "noModal", "toaster", "$rootScope", "serviceVariables", "fileAuthentication", "generatePdf"]
myApp.controller('invoiceModalController', invoiceModalController);
<<<<<<< HEAD
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
function invoiceModalController($scope, $http, print_invoice_vals, print_invoice_obj, openEmailer, noModal, toaster, $rootScope, serviceVariables, fileAuthentication, generatePdf) {

    $scope.print_invoice_vals = print_invoice_vals;
    $scope.print_invoice_obj = print_invoice_obj;
    $scope.openEmailer = openEmailer;
    $scope.noModal = noModal;
    $scope.fileAuthentication = fileAuthentication;

<<<<<<< HEAD
    $scope.generatePDFandDownload = function (templateType, invoiceVals, x) {
=======
    $scope.generatePDFandDownload = function(templateType, invoiceVals, x) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        generatePdf.showLoader = true;
        generatePdf.generatePdf(templateType, invoiceVals, x);
    }

<<<<<<< HEAD
    $scope.generateJSReportPDF = function (templateType, invoiceVals, x) {
=======
    $scope.generateJSReportPDF = function(templateType, invoiceVals, x) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        generatePdf.showLoader = true;
        generatePdf.genJSReport(templateType, invoiceVals, x);
    }

<<<<<<< HEAD
    $scope.destroyPdfModal = function (modalName) {
        angular.element(document.querySelector("#" + modalName)).remove();
    }
    // $scope.generatePdf = function () {
    //     var pdfInvoice = $scope.$root.setup + "general/print-pdf-invoice";
=======
    $scope.destroyPdfModal = function(modalName) {
            angular.element(document.querySelector("#" + modalName)).remove();
        }
        // $scope.generatePdf = function () {
        //     var pdfInvoice = $scope.$root.setup + "general/print-pdf-invoice";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    //     if ($scope.print_invoice_vals.templateType == "delivery"){
    //         var targetPdf = angular.element('#delivery_note_modal')[0].innerHTML;            
    //     } else if ($scope.print_invoice_vals.templateType == "warehouse") {
    //         var targetPdf = angular.element('#warehouse_instructions_modal')[0].innerHTML;
    //     } else{
    //         var targetPdf = angular.element('#sales_order_modal')[0].innerHTML;
    //     }

    //     if ($scope.print_invoice_vals.templateType == "order") {
    //         var fileName = "SO." + $scope.print_invoice_vals.order_no + "." + $scope.print_invoice_vals.company_id;
    //     } else if ($scope.print_invoice_vals.templateType == "invoice") {
    //         var fileName = "SI." + $scope.print_invoice_vals.invoice_no+ "." + $scope.print_invoice_vals.company_id;
    //     } else if ($scope.print_invoice_vals.templateType == "delivery") {
    //         var fileName = "DLN." + $scope.print_invoice_vals.order_no+ "." + $scope.print_invoice_vals.company_id;
    //     } else if ($scope.print_invoice_vals.templateType == "warehouse") {
    //         var fileName = "WHI." + $scope.print_invoice_vals.order_no+ "." + $scope.print_invoice_vals.company_id;
    //     } else {
    //         var fileName = "SQ." + $scope.print_invoice_vals.quote_no+ "." + $scope.print_invoice_vals.company_id;
    //     }

    //     $http
    //         .post(pdfInvoice, { 'dataPdf': targetPdf, 'type': 1, 'filename': fileName, token: $scope.$root.token, 'doc_id': $scope.print_invoice_vals.doc_id, attachmentsType: 2})
    //         .then(function (res) {
    //             if (res.data.ack == true) {
    //                 $rootScope.printinvoiceFlag = true;
    //                 toaster.pop('success', 'Info', 'PDF Generated Successfully');
    //                 serviceVariables.generatedPDF = res.data.path;
    //             } else if (res.data.SQLack == false) {
    //                 toaster.pop('warning', 'Important', 'PDF Generated Successfully');
    //                 toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(105));
    //             }
    //             else {
    //                 toaster.pop('error', 'Error', "PDF Not Generated");
    //             }
    //         });
    // }
<<<<<<< HEAD
}
=======
}
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
