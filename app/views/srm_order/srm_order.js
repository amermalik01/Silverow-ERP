myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.srmorder', {
                url: '/purchase_order',
                title: 'Purchases',
                templateUrl: helper.basepath('srm_order/srm_order.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.addsrmorder', {
                url: '/purchase_order/add',
                title: 'Purchases',
                templateUrl: helper.basepath('srm_order/_form.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'SrmOrderEditController'
            })
            .state('app.viewsrmorder', {
                url: '/purchase_order/:id/view',
                title: 'Purchases',
                templateUrl: helper.basepath('srm_order/_form.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'SrmOrderEditController'
            })
            .state('app.editsrmorder', {
                url: '/purchase_order/:id/edit',
                title: 'Purchases',
                templateUrl: helper.basepath('srm_order/_form.html'), //addTabs 
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'SrmOrderEditController'
            })
            .state('app.srminvoice', {
                url: '/purchase_invoice',
                title: 'Purchases',
                templateUrl: helper.basepath('srm_order/srm_invoice.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.viewsrminvoice', {
                url: '/purchase_invoice/:id/view',
                title: 'Purchases',
                templateUrl: helper.basepath('srm_order/_form.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'SrmOrderEditController'
            })
    }
]);


/* templateUrl: helper.basepath('srm_order/add_form.html'), */

SRMInvoiceController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "ngTableDataService", "$http", "ngDialog", "toaster", "$rootScope", '$stateParams', 'moduleTracker', "$timeout"];
myApp.controller('SRMInvoiceController', SRMInvoiceController);

function SRMInvoiceController($scope, $filter, ngParams, $resource, ngDataService, $http, ngDialog, toaster, $rootScope, $stateParams, moduleTracker, $timeout) {
    'use strict';

    moduleTracker.updateName("purchase");
    moduleTracker.updateAdditional("purchase invoice");
    moduleTracker.updateRecord("");


    // $scope.$root.breadcrumbs = [{ 'name': 'Purchases & Invoice', 'url': '#', 'isActive': false }, { 'name': 'Invoice', 'url': '#', 'isActive': false }];
    $scope.$root.breadcrumbs = [{ 'name': 'Purchases', 'url': '#', 'isActive': false }, { 'name': 'Suppliers', 'url': 'app.supplier', 'isActive': false }, { 'name': 'Purchase Invoices', 'url': '#', 'isActive': false }];
    var vm = this;
    var Api = $scope.$root.pr + "srm/srminvoice/listings";

    $scope.postData = {};
    $scope.postData = {
        'token': $scope.$root.token,
        'all': "1",
        'type': 1
    };

    var SrmInvoiceListingCount;

    $scope.check_pi_readonly = false;

    $scope.searchKeyword = {};
    $scope.selectedRecBulkEmail = [];
    $scope.getSrmInvoiceListing = function(item_paging, sort_column, sortform, SrmInvoiceListingCount) {
        $scope.postData = {};
        $scope.postData = {
            'token': $scope.$root.token,
            'all': "1",
            'type': 2
        };
        if (item_paging == 1)
            $scope.item_paging.spage = 1

        $scope.postData.page = $scope.item_paging.spage;

        // $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;
        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
            $scope.record_data = {};
        }
        $scope.postData.searchKeyword = $scope.searchKeyword;
        $scope.showLoader = true;

        $scope.postData.tableMetaData = 'PurchaseInvoice';

        if (SrmInvoiceListingCount == undefined) SrmInvoiceListingCount = $rootScope.maxHttpRepeatCount;
        $http
            .post(Api, $scope.postData)
            .then(function(res) {
                $scope.tableData = res;
                $scope.columns = [];
                $scope.recordArray = [];
                $scope.record = {};

                $scope.$data = [];
                $scope.record_data = {};
                $scope.showLoader = false;

                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.record = res.data.response;
                    $scope.record_data = res.data.response;
                    $scope.$data = res.data.response;

                    angular.forEach(res.data.response, function(value, key) {
                        if (key != "tbl_meta_data") {
                            $scope.recordArray.push(value);
                        }
                    });

                    angular.forEach(res.data.response[0], function(val, index) {
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
            }).catch(function(e) {
                if (SrmInvoiceListingCount != 0) return $scope.getSrmInvoiceListing(item_paging, sort_column, sortform, SrmInvoiceListingCount - 1);

                $scope.showLoader = false;

                throw new Error(e.data);
            });
    }

    // $scope.getSrmInvoiceListing(1);

    $scope.getItem = function(parm) {
        $scope.rec.token = $scope.$root.token;

        if (parm == 'all') {
            $scope.rec = {};
            $scope.rec.id = 0;
            $scope.rec.token = $scope.$root.token;
        }
        $scope.rec.type = 1;
        $scope.postData = $scope.rec;
        $scope.$root.$broadcast("myReload");
    }


    $scope.$on("myReload", function(event) {
        $scope.table.tableParams5.reload();
    });


    var showLinkToSOCount;

    $scope.ShowLinkToSO = function(id, showLinkToSOCount) {
        // $scope.showLoader = true;
        $scope.filterPurchaseOrder = {};

        var prodApi = $scope.$root.pr + "srm/srminvoice/getSalesOrderbyPurchaseID";
        var postData = {
            'token': $scope.$root.token,
            'id': id
        };

        $scope.SaleOrderArr = [];
        $scope.SaleOrderArrlistingchk = true;

        if (showLinkToSOCount == undefined) showLinkToSOCount = $rootScope.maxHttpRepeatCount;
        $http
            .post(prodApi, postData)
            .then(function(res) {
                $scope.showLoader = false;

                if (res.data.ack == true) {

                    $scope.SaleOrderArr = res.data.response;
                    for (var i = 0; i < $scope.SaleOrderArr.length; i++) {
                        $scope.SaleOrderArr[i].disableCheck = 1;
                        $scope.SaleOrderArr[i].chk = true;
                    }
                    angular.element('#_saleOrdersModal').modal({ show: true });
                } else
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(561));
            }).catch(function(e) {
                if (showLinkToSOCount != 0) return $scope.ShowLinkToSO(id, showLinkToSOCount - 1);

                $scope.showLoader = false;

                throw new Error(e.data);
            });

    }

    $scope.bulkEmailOption = function() {

        $scope.emailOrderList = $scope.recordArray.filter(function(o, i) {
            return ($scope.selectedRecBulkEmail.findIndex(s => s.key == o.id) > -1);
        });

        if ($scope.emailOrderList.length > 0) {

            angular.element('#_bulkOptionsModal').modal({ show: true });

        } else {
            $rootScope.animateBulkEmail = false;
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(236, ['Purchase Invoice']));
        }
    }

    $rootScope.BulkEmailMessage = "";

    $scope.bulkOptionConfirm = function(bulkOptionChk) {

        angular.element('#_bulkOptionsModal').modal('hide');

        let currentUrl = window.location.href;
        $scope.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;

        // if (bulkOptionChk.saveAsPdf == true) {
        if (bulkOptionChk == 'saveAsPdf') {

            $rootScope.animateBulkEmail = true;
            $rootScope.animateBulkEmailText = 'Downloading PDF(s)';

            var prntInvoiceUrl = $scope.$root.sales + "customer/order/bulk-print-invoice";
            $http
                .post(prntInvoiceUrl, {
                    'emailOrderList': $scope.emailOrderList,
                    'module': 'purchaseInvoice',
                    'Option': 'saveAsPdf',
                    'OptionType': 2,
                    'company_logo_url': $scope.company_logo_url,
                    'token': $scope.$root.token
                })
                .then(function(res) {

                    $rootScope.animateBulkEmail = false;
                    $rootScope.animateBulkEmailText = '';

                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', 'PDF(s) Generated Successfully.');

                        /* angular.forEach(res.data.PdfLinks,function(rec){
                            window.open(rec, '_blank');
                        });  */

                        var link = document.createElement('a');

                        link.setAttribute('download', null);
                        link.style.display = 'none';

                        document.body.appendChild(link);

                        // angular.forEach(res.data.PdfLinks, function (rec) {
                        link.setAttribute('href', res.data.file_url);
                        link.click();
                        // });

                        document.body.removeChild(link);

                        // $timeout(function () {
                        //     $scope.getSrmInvoiceListing();
                        // }, 500);
                    } else {
                        toaster.pop('error', 'Info', "PDF(s) Generation Failed.");
                    }
                });

        } else if (bulkOptionChk == 'email') {
            // else if (bulkOptionChk.email == true) {

            $rootScope.BulkEmailMessage = "Purchase Invoice(s)";

            ngDialog.openConfirm({
                template: 'BulkEmailConfirmationMessage',
                className: 'ngdialog-theme-default-custom'
            }).then(function(value) {

                $rootScope.animateBulkEmail = true;
                $rootScope.animateBulkEmailText = 'Sending Email(s)';

                var prntInvoiceUrl = $scope.$root.sales + "customer/order/bulk-print-invoice";
                $http
                    .post(prntInvoiceUrl, {
                        'emailOrderList': $scope.emailOrderList,
                        'module': 'purchaseInvoice',
                        'Option': 'email',
                        'OptionType': 2,
                        'company_logo_url': $scope.company_logo_url,
                        'token': $scope.$root.token
                    })
                    .then(function(res) {

                        $rootScope.animateBulkEmail = false;
                        $rootScope.animateBulkEmailText = '';

                        if (res.data.ack == 2) {

                            toaster.pop({
                                type: "warning",
                                title: "Info",
                                body: "Email could not be sent for the following Purchase Invoice(s) <br/>" + res.data.error.toString(),
                                timeout: 0,
                                bodyOutputType: 'trustedHtml',
                                tapToDismiss: false
                            });
                        } else if (res.data.ack == true) {
                            toaster.pop('success', 'Info', 'Email(s) Sent Successfully.');


                            $timeout(function() {
                                $scope.getSrmInvoiceListing();
                            }, 500);
                        } else {
                            toaster.pop('warning', 'Info', "Email(s) Sending Failed. " + res.data.error);
                        }
                    });
            }, function(reason) {
                $rootScope.animateBulkEmail = false;
                $rootScope.animateBulkEmailText = '';
                console.log('Modal promise rejected. Reason: ', reason);
            });
        } else if (bulkOptionChk == 'xml') {

            $rootScope.animateBulkEmail = true;
            $rootScope.animateBulkEmailText = 'Uploading E-Archive'; //Creating Xml(s)

            console.log("creatign xml...")
                // console.log($scope.emailOrderList.length);
            var prntInvoiceUrl = $scope.$root.sales + "customer/order/bulk-xml-invoice";
            $http
                .post(prntInvoiceUrl, {
                    'emailOrderList': $scope.emailOrderList,
                    'module': 'purchaseInvoice',
                    'Option': 'xml',
                    'OptionType': 2,
                    'company_logo_url': $scope.company_logo_url,
                    'token': $scope.$root.token
                })
                .then(function(res) {

                    $rootScope.animateBulkEmail = false;
                    $rootScope.animateBulkEmailText = '';


                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', 'E-Archive Uploaded Successfully.');

                        if (res.data.rejectedXMLCounter > 0)
                            toaster.pop('warning', 'Info', res.data.rejectedXMLMsg);

                        /* var link = document.createElement('a');

                        link.setAttribute('download', null);
                        link.style.display = 'none';

                        link.setAttribute('href', res.data.file_url);
                        link.click();  */
                    } else {
                        toaster.pop('error', 'Info', "E-Archive Uploading Failed.");

                        if (res.data.rejectedXMLCounter > 0)
                            toaster.pop('warning', 'Info', res.data.rejectedXMLMsg);
                    }
                }, function(err) {
                    console.log(err);
                });

        }
    }
}


SRMOrderController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "ngTableDataService", "$http", "ngDialog", "toaster", "$rootScope", '$stateParams', 'moduleTracker', "$timeout"];
myApp.controller('SRMOrderController', SRMOrderController);

function SRMOrderController($scope, $filter, ngParams, $resource, ngDataService, $http, ngDialog, toaster, $rootScope, $stateParams, moduleTracker, $timeout) {
    'use strict';

    moduleTracker.updateName("purchase");
    moduleTracker.updateAdditional("purchase order");
    moduleTracker.updateRecord("");

    $scope.$root.breadcrumbs = [{ 'name': 'Purchases', 'url': '#', 'isActive': false }, { 'name': 'Suppliers', 'url': 'app.supplier', 'isActive': false }, { 'name': 'Purchase Orders', 'url': '#', 'isActive': false }];

    $scope.searchKeyword = {};
    $scope.selectedRecBulkEmail = [];

    var SRMOrderlistCount;

    $scope.getSRMOrderlist = function(item_paging, sort_column, sortform, SRMOrderlistCount) {

        var Api = $scope.$root.pr + "srm/srminvoice/listings";
        // var Api = $rootScope.pr + "srm/srminvoice/listings";

        $scope.postData = {};
        $scope.postData = {
            'token': $scope.$root.token,
            'all': "1",
            'type': 3
        };


        if ($scope.item_paging == 1)
            $scope.item_paging.spage = 1

        $scope.postData.page = $scope.item_paging.spage;

        // $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;

        $scope.postData.searchKeyword = $scope.searchKeyword;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
            $scope.record_data = {};
        }

        $scope.showLoader = true;

        $scope.postData.tableMetaData = 'PurchaseOrder'; //SRMOrder

        if (SRMOrderlistCount == undefined) SRMOrderlistCount = $rootScope.maxHttpRepeatCount;
        $http
            .post(Api, $scope.postData)
            .then(function(res) {
                $scope.tableData = res;
                $scope.columns = [];
                $scope.recordArray = [];
                $scope.$data = [];
                $scope.record_data = {};
                $scope.showLoader = false;

                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.record_data = res.data.response;
                    $scope.$data = res.data.response;

                    angular.forEach(res.data.response, function(value, key) {
                        if (key != "tbl_meta_data") {
                            $scope.recordArray.push(value);
                        }
                    });
                    angular.forEach(res.data.response[0], function(val, index) {
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
            }).catch(function(e) {
                if (SRMOrderlistCount != 0) return $scope.getSRMOrderlist(item_paging, sort_column, sortform, SRMOrderlistCount - 1);

                $scope.showLoader = false;

                throw new Error(e.data);
            });
    }

    // $scope.getSRMOrderlist(1);


    $scope.getItem = function(parm) {
        $scope.rec.token = $scope.$root.token;

        if (parm == 'all') {
            $scope.rec = {};
            $scope.rec.id = 0;
            $scope.rec.token = $scope.$root.token;
        }
        $scope.rec.type = 3;
        $scope.postData = $scope.rec;
        $scope.$root.$broadcast("myReload");
    }

    $scope.$on("myReload", function(event) {
        $scope.table.tableParams5.reload();
    });

    var ShowLinkToSOCount;

    $scope.ShowLinkToSO = function(id, ShowLinkToSOCount) {
        // $scope.showLoader = true;
        $scope.filterPurchaseOrder = {};
        $scope.SaleOrderArrlistingchk = true;

        var prodApi = $scope.$root.pr + "srm/srminvoice/getSalesOrderbyPurchaseID";
        var postData = {
            'token': $scope.$root.token,
            'id': id
        };

        $scope.SaleOrderArr = [];

        if (ShowLinkToSOCount == undefined) ShowLinkToSOCount = $rootScope.maxHttpRepeatCount;
        $http
            .post(prodApi, postData)
            .then(function(res) {
                $scope.showLoader = false;

                if (res.data.ack == true) {

                    $scope.SaleOrderArr = res.data.response;
                    for (var i = 0; i < $scope.SaleOrderArr.length; i++) {
                        $scope.SaleOrderArr[i].disableCheck = 1;
                        $scope.SaleOrderArr[i].chk = true;
                    }
                    angular.element('#_saleOrdersModal').modal({ show: true });
                } else
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(561));
            }).catch(function(e) {
                if (ShowLinkToSOCount != 0) return $scope.ShowLinkToSO(id, ShowLinkToSOCount - 1);

                $scope.showLoader = false;

                throw new Error(e.data);
            });
    }

    $scope.bulkEmailOption = function() {

        $scope.emailOrderList = $scope.recordArray.filter(function(o, i) {
            return ($scope.selectedRecBulkEmail.findIndex(s => s.key == o.id) > -1);
        });

        if ($scope.emailOrderList.length > 0) {

            angular.element('#_bulkOptionsModal').modal({ show: true });

        } else {
            $rootScope.animateBulkEmail = false;
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(236, ['Purchase Orders']));
        }
    }

    $rootScope.BulkEmailMessage = "";

    $scope.bulkOptionConfirm = function(bulkOptionChk) {

        angular.element('#_bulkOptionsModal').modal('hide');

        let currentUrl = window.location.href;
        $scope.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;

        // if (bulkOptionChk.saveAsPdf == true) {
        if (bulkOptionChk == 'saveAsPdf') {

            $rootScope.animateBulkEmail = true;
            $rootScope.animateBulkEmailText = 'Downloading PDF(s)';

            var prntInvoiceUrl = $scope.$root.sales + "customer/order/bulk-print-invoice";
            $http
                .post(prntInvoiceUrl, {
                    'emailOrderList': $scope.emailOrderList,
                    'module': 'purchaseOrder',
                    'Option': 'saveAsPdf',
                    'OptionType': 2,
                    'company_logo_url': $scope.company_logo_url,
                    'token': $scope.$root.token
                })
                .then(function(res) {

                    $rootScope.animateBulkEmail = false;
                    $rootScope.animateBulkEmailText = '';

                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', 'PDF(s) Generated Successfully.');

                        /* angular.forEach(res.data.PdfLinks,function(rec){
                            window.open(rec, '_blank');
                        });  */

                        var link = document.createElement('a');

                        link.setAttribute('download', null);
                        link.style.display = 'none';

                        document.body.appendChild(link);

                        // angular.forEach(res.data.PdfLinks, function (rec) {
                        link.setAttribute('href', res.data.file_url);
                        link.click();
                        // });

                        document.body.removeChild(link);

                        // $timeout(function () {
                        //     $scope.getSRMOrderlist();
                        // }, 500);
                    } else {
                        toaster.pop('error', 'Info', "PDF(s) Generation Failed.");
                    }
                });

        } else if (bulkOptionChk == 'email') {
            //else if (bulkOptionChk.email == true) {

            $rootScope.BulkEmailMessage = "Purchase Order(s)";

            ngDialog.openConfirm({
                template: 'BulkEmailConfirmationMessage',
                className: 'ngdialog-theme-default-custom'
            }).then(function(value) {

                $rootScope.animateBulkEmail = true;
                $rootScope.animateBulkEmailText = 'Sending Email(s)';

                var prntInvoiceUrl = $scope.$root.sales + "customer/order/bulk-print-invoice";
                $http
                    .post(prntInvoiceUrl, {
                        'emailOrderList': $scope.emailOrderList,
                        'module': 'purchaseOrder',
                        'Option': 'email',
                        'OptionType': 2,
                        'company_logo_url': $scope.company_logo_url,
                        'token': $scope.$root.token
                    })
                    .then(function(res) {

                        $rootScope.animateBulkEmail = false;
                        $rootScope.animateBulkEmailText = '';

                        if (res.data.ack == 2) {

                            toaster.pop({
                                type: "warning",
                                title: "Info",
                                body: "Email could not be sent for the following Purchase Order(s) <br/>" + res.data.error.toString(),
                                timeout: 0,
                                bodyOutputType: 'trustedHtml',
                                tapToDismiss: false
                            });
                        } else if (res.data.ack == true) {
                            toaster.pop('success', 'Info', 'Email(s) Sent Successfully.');

                            $timeout(function() {
                                $scope.getSRMOrderlist();
                            }, 500);
                        } else {
                            toaster.pop('warning', 'Info', "Email(s) Sending Failed. " + res.data.error);
                        }
                    });
            }, function(reason) {
                $rootScope.animateBulkEmail = false;
                $rootScope.animateBulkEmailText = '';
                console.log('Modal promise rejected. Reason: ', reason);
            });
        }
    }
}

SrmOrderEditController.$inject = ["$scope", "$filter", "$resource", "$http", "ngDialog", "toaster", "$stateParams", "$state", "$rootScope", "ModalService", "serviceVariables", "generatePdf", "moduleTracker", "$timeout"];
myApp.controller('SrmOrderEditController', SrmOrderEditController);

function SrmOrderEditController($scope, $filter, $resource, $http, ngDialog, toaster, $stateParams, $state, $rootScope, ModalService, serviceVariables, generatePdf, moduleTracker, $timeout) {
    'use strict'

    moduleTracker.updateName("purchase");
    moduleTracker.updateRecord("");

    $scope.serviceVariables = serviceVariables;

    $scope.generatePdf = generatePdf;

    $scope.recnew = 0;
    // console.log($state.current.name);
    // console.log($stateParams);
    $scope.show_order = false;
    $scope.show_invoice = false;

    if ($state.current.name == 'app.viewsrminvoice') {
        $scope.show_invoice = true;
        $scope.title_code = 'Invoice No.';
        $scope.invoiceRec = 1;
        $rootScope.orderType = 1;
        moduleTracker.updateAdditional("purchase invoice");

    } else {
        $scope.show_order = true;
        $scope.title_code = 'Order No.';
        $scope.invoiceRec = 0;
        $rootScope.orderType = 0;
        moduleTracker.updateAdditional("purchase order");
    }

    $scope.check_pi_readonly = false;

    $scope.showInvoiceEditForm = function() {
        $scope.check_pi_readonly = true;
    }

    if ($stateParams.id > 0) {
        $scope.check_srm_readonly = true;
        $scope.recnew = $stateParams.id;
        moduleTracker.updateRecord($stateParams.id);
    } else {
        $scope.selectedSaleOrderArr = [];
        $scope.selectedSaleOrderModal = [];
    }

    $scope.$on('InvoicePosted', function(event, data) {

        $scope.rec2 = {};
        $scope.rec = {};
        $scope.rec.id = 0;
        $scope.items = [];
        $scope.rec.type = 3;
        $scope.selectedPurchaseOrders = "";
        $scope.check_srm_readonly = false;
        $scope.submit_show_invoicee = true;
        $scope.show_recieve_list = false;

        $scope.$root.crm_id = 0;
        $scope.$root.breadcrumbs.splice(-1, 1);

        $scope.rec.order_date = $scope.$root.get_current_date();
        $scope.rec.invoice_date = $scope.$root.get_current_date();
        $scope.rec.receiptDate = $scope.$root.get_current_date();
    });

    $scope.GetApprovalPreData = function() {
            var APIUrl = $scope.$root.sales + "customer/order/get-approval-pre-data";
            var postData = {
                'token': $scope.$root.token
            };
            $http
                .post(APIUrl, postData)
                .then(function(res) {
                    if (res.data.ack == true) {
                        $scope.purchase_order_approval_req = res.data.purchase_order_approval_req;
                    } else {
                        $scope.purchase_order_approval_req = 0;

                    }
                });
        }
        // if (!($stateParams.id > 0))
    $scope.GetApprovalPreData();

    $scope.SaleOrderArrlistingchk = false;

    $scope.showEditForm = function() {
        $scope.check_srm_readonly = false;
        //$scope.perreadonly = true;
    }
    $rootScope.updateSelectedGlobalData("uom");
    // $rootScope.updateSelectedGlobalData('item');

    $scope.showReceiveStuff = false;

    $scope.$on('showReceiveStuff', function(event, data) {
        $scope.showReceiveStuff = data;
    });

    $scope.showEditorderForm = function(flg) {

        toaster.pop('warning', 'Info', 'On order update the payment will be deallocated');

        if (flg != undefined && flg == 1) {
            if ($scope.approvals_lock_order == 1) {
                $rootScope.approval_message = "The purchase order is already approved. \n 1) Press Unlock to enable complete edit access to the document. It will need to be send for approval again. \n 2) Press Edit to edit general information only.";
                $rootScope.approval_type = "Unlock";
                ngDialog.openConfirm({
                    template: '_confirm_approval_confirmation_modal2',
                    className: 'ngdialog-theme-default-custom'
                }).then(function(value) {
                        $scope.showLoader = true;
                        var postUrl = $scope.$root.setup + "general/unlock-approved-order";
                        //'warehouse_id': item.warehouses.id
                        $http
                            .post(postUrl, {
                                'object_id': $scope.rec.id,
                                'type': "4, 7",
                                'token': $scope.$root.token
                            })
                            .then(function(res) {
                                if (res.data.ack == true) {
                                    $scope.showLoader = false;
                                    $scope.check_srm_readonly = false;
                                    $scope.approvals_lock_order = 0;
                                } else {
                                    $scope.showLoader = false;
                                    $scope.check_srm_readonly = false;
                                }
                            });
                    },
                    function(reason) {
                        $scope.showLoader = false;
                        $scope.check_srm_readonly = false;
                        console.log('Modal promise rejected. Reason: ', reason);
                    });
            } else
                $scope.check_srm_readonly = false;
        } else
            $scope.check_srm_readonly = false;
    }

    $scope.makeInvoiceFormReadonly = function() {
        $scope.check_srm_readonly = true;
    }
    $scope.arrItems = [{ 'label': 'Please select type', 'value': 3 }, { 'label': 'Item', 'value': 0 }, { 'label': 'G/L Account', 'value': 1 }, { 'label': 'Item Additional cost', 'value': 2 }];

    $scope.submit_show_invoicee = true;
    $scope.record = [];
    var vm = this;
    $scope.class = 'block';
    $scope.rec = {};
    $scope.rec.id = 0;
    $scope.drp = {};
    $scope.crm_no = '';
    var crm_name = '';
    $scope.customer_no = '';
    var id = $stateParams.id;
    $scope.$root.crm_id = id;
    var table = 'order';
    $scope.btnCancelUrl = 'app.srmorder';
    $scope.btnInvoiceCancelUrl = 'app.srminvoice';


    //$scope.title_code = 'Order Code';
    //$scope.title_code = 'P.O Code';


    $scope.product_type = true;
    $scope.count_result = 0;

    $scope.purchaseOrderDeleteBtn = false;

    if ($stateParams.id === undefined) {
        $scope.rec.invoice_date = $rootScope.get_current_date();
        $scope.rec.order_date = $rootScope.get_current_date();
        $scope.rec.receiptDate = $rootScope.get_current_date();
        $scope.purchaseOrderDeleteBtn = true;

        angular.forEach($rootScope.arr_currency, function(elem) {
            if (elem.id == $scope.$root.defaultCurrency)
                $scope.rec.currency_id = elem;
        });

        $scope.rec.shippingPONotReq = 1;
        $scope.rec.ReasonForshippingNotReq = 'n/a';
    }

    $scope.add_general = function(rec) {

        rec.token = $scope.$root.token;
        rec.id = $stateParams.id;
        rec.type = 3;

        /* if (rec.sell_to_cust_no == undefined || rec.sell_to_cust_no == null) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Supplier No.']));
            $scope.showLoader = false;
            return false;
        } */

        if (!$scope.rec.sell_to_cust_no && (!$scope.rec.order_code || $scope.items.length > 0)) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Supplier No.']));
            $scope.showLoader = false;
            return false;
        }

        if (rec.order_date == undefined || rec.order_date == null) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Order Date']));
            $scope.showLoader = false;
            return false;
        }

        // if ($scope.rec.currencyExchangeRateDate == undefined || $scope.rec.currencyExchangeRateDate == null || $scope.rec.currencyExchangeRateDate == '') {
        //     rec.currencyExchangeRateDate = $scope.rec.receiptDate;
        // }
        rec.currencyExchangeRateDate = $scope.rec.receiptDate;

        rec.countrys = (rec.country != undefined && rec.country != '') ? rec.country.id : 0;
        // rec.countrys = (rec.country.id != undefined && rec.country.id != '') ? rec.country.id : 0;
        rec.billToSupplierCountrys = (rec.billToSupplierCountry != undefined && rec.billToSupplierCountry != '') ? rec.billToSupplierCountry.id : 0;
        rec.shipToSupplierLocCountrys = (rec.shipToSupplierLocCountry != undefined && rec.shipToSupplierLocCountry != '') ? rec.shipToSupplierLocCountry.id : 0;
        rec.currency_ids = (rec.currency_id != undefined && rec.currency_id != '') ? rec.currency_id.id : 0;

        rec.payment_terms_code = (rec.payment_terms_codes != undefined && rec.payment_terms_codes != '') ? rec.payment_terms_codes.id : 0;
        rec.payment_method_id = (rec.payment_method_ids != undefined && rec.payment_method_ids != '') ? rec.payment_method_ids.id : 0;
        rec.shipment_method_id = (rec.shipment_method_code != undefined && rec.shipment_method_code != '') ? rec.shipment_method_code.id : 0;
        rec.shipment_method = (rec.shipment_method_code != undefined && rec.shipment_method_code != '') ? rec.shipment_method_code.name : 0;

        angular.forEach($rootScope.arr_currency, function(obj) {
            if (obj.id === rec.currency_ids)
                $rootScope.currencyID_PO = obj;
            // $rootScope.currency_id = obj;
        });

        //$rootScope.posting_date = rec.invoice_date;

        rec.SaleOrderArr = {};
        rec.SaleOrderArr = $scope.selectedSaleOrderArr;

        if ($scope.rec.order_code != undefined) {

            rec.posting_group_id = $rootScope.order_posting_group_id;

            rec.net_amount = $rootScope.netValuePurchaseOrder;
            rec.tax_amount = $rootScope.vatValuePurchaseOrder;
            rec.grand_total = $rootScope.grandTotalPurchaseOrder;
            rec.defaultCurrencyID = $scope.$root.defaultCurrency;

            rec.items_net_total = $scope.rec.items_net_total;
            rec.items_net_discount = $scope.rec.items_net_discount;
            rec.items_net_vat = $scope.rec.items_net_vat;

            var addQuoteUrl = $scope.$root.pr + "srm/srminvoice/update-srminvoice";

            return $http
                .post(addQuoteUrl, rec)
                .then(function(res) {
                    if (res.data.ack == true) {
                        $stateParams.id = res.data.id;
                        $scope.recnew = res.data.id;
                        $scope.rec.id = res.data.id;
                        $scope.rec.update_id = res.data.id;
                        return 1;
                    } else
                        return res.data.error;

                }).catch(function(message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                });
        } else {

            var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
            var name = $scope.$root.base64_encode('srm_order');
            var no = $scope.$root.base64_encode('order_no');

            var module_category_id = 2;

            return $http
                .post(getCodeUrl, {
                    'is_increment': 1,
                    'token': $scope.$root.token,
                    'tb': name,
                    'm_id': 110,
                    'no': no,
                    'category': '',
                    'brand': '',
                    'module_category_id': module_category_id,
                    'type': '3,2'
                })
                .then(function(res) {

                    if (res.data.ack == 1) {
                        $scope.rec.order_code = res.data.code;
                        $scope.rec.code_type = module_category_id; //res.data.code_type;
                        $scope.count_result++;

                        if ($scope.$root.breadcrumbs.length > 3) {

                            if ($scope.rec.order_code)
                                $scope.$root.model_code = $scope.rec.sell_to_cust_name + '(' + $scope.rec.order_code + ')';
                            else
                                $scope.$root.model_code = $scope.rec.sell_to_cust_name;

                            $scope.$root.breadcrumbs[3].name = $scope.$root.model_code;
                        }

                        if (res.data.type == 1) {
                            $scope.product_type = false;
                        } else {
                            $scope.product_type = true;
                        }


                        if ($scope.count_result > 0) {

                            rec.posting_group_id = $rootScope.order_posting_group_id;

                            rec.net_amount = $rootScope.netValuePurchaseOrder;
                            rec.tax_amount = $rootScope.vatValuePurchaseOrder;
                            rec.grand_total = $rootScope.grandTotalPurchaseOrder;
                            rec.defaultCurrencyID = $scope.$root.defaultCurrency;

                            rec.items_net_total = $scope.rec.items_net_total;
                            rec.items_net_discount = $scope.rec.items_net_discount;
                            rec.items_net_vat = $scope.rec.items_net_vat;

                            var addQuoteUrl = $scope.$root.pr + "srm/srminvoice/update-srminvoice";

                            return $http
                                .post(addQuoteUrl, rec)
                                .then(function(res) {
                                    if (res.data.ack == true) {

                                        $stateParams.id = res.data.id;

                                        $scope.recnew = res.data.id;
                                        $scope.rec.id = res.data.id;
                                        $scope.rec.update_id = res.data.id;
                                        $scope.rec.is_whole_seller = res.data.is_whole_seller;
                                        moduleTracker.updateRecord($stateParams.id);
                                        moduleTracker.updateRecordName($scope.rec.order_code);
                                        return 1;
                                    } else
                                        return res.data.error;

                                }).catch(function(message) {
                                    $scope.showLoader = false;

                                    throw new Error(message.data);
                                });
                        } else {
                            console.log($scope.count_result + 'd');
                            return $scope.count_result + 'd';
                        }
                    } else {
                        toaster.pop('error', 'info', res.data.error);
                        return false;
                    }
                }).catch(function(message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                });
        }
    }

    $scope.show_recieve_list = false;

    $scope.$on('show_recieve_list', function(event, data) {
        $scope.show_recieve_list = data;
    });


    var custUrl = $scope.$root.pr + "supplier/supplier/listings";

    $scope.searchKeyword = {};
    $scope.searchKeyword_sup = {};
    $scope.items = [];

    $scope.$on('PurchaseLines', function(event, data) {
        $scope.items = data;
    });

    $scope.PurchaseStatus = 0;
    $scope.removeSupp = 0;

    $scope.$on('PurchaseStatus', function(event, data) {
        $scope.PurchaseStatus = data;
    });


    var get_supplierCount;
    $scope.marketPromotionCustomer = {};
    $scope.confirmCustomer = function(result) {
        $scope.marketPromotionCustomer = result;
        $scope.rec.linktoCustID = result.id;
        $scope.rec.linktoCustName = result.customer_code;
        angular.element("#customer_modal_single").modal("hide");
        // var custUrl = $scope.$root.sales + "customer/customer/getCustomerForOrder";
        // $scope.showLoader = true;
        // $http
        //     .post(custUrl, { id: result.id, 'token': $scope.$root.token })
        //     .then(function (res) {
        //         if (res.data.ack == true) {
        //             result = res.data.response;

        //         }
        //     });
    };

    $scope.searchKeyword_cust = {};

    $scope.getCustomer = function(item_paging) {
        if (item_paging) {
            $scope.searchKeyword_cust = {};
        }
        $scope.title = "Customer Listing";
        /* $scope.columns = [];
        $scope.record = {};
        $scope.record = $rootScope.customer_arr; */

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;

        $scope.postData.searchKeyword = $scope.searchKeyword_cust;

        var customerListingApi = $scope.$root.sales + "customer/order/customer-popup";

        $scope.showLoader = true;

        $http
            .post(customerListingApi, $scope.postData)
            .then(function(res) {
                $scope.customerTableData = res;
                if (res.data.ack == true) {

                    angular.element('#customer_modal_single').modal({ show: true });

                    $scope.showLoader = false;
                } else {
                    $scope.showLoader = false;
                }
            });
    }

    $scope.searchKeywordSupp = {};

    $scope.get_supplier = function(item_paging, shipagent, get_supplierCount) {
        if (item_paging) {
            $scope.searchKeywordSupp = {};
        }
        $scope.title = 'Supplier Listing';

        if (Number($scope.rec.sell_to_cust_id) > 0 && shipagent != 1)
            $scope.removeSupp = 1;
        else
            $scope.removeSupp = 0;

        $scope.columns = [];
        $scope.record = {};
        $scope.record_invoice = {};
        $scope.shipagent = shipagent;
        //sell_to_cust_id 

        if ($scope.items.length > 0 && $scope.shipagent != 1 && !($scope.rec.refSaleQuoteID > 0 && !($scope.rec.refSaleQuoteStatus > 0))) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(562));
            return false;
        }

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
        // $scope.searchKeyword_sup = {};
        $scope.showLoader = true;

        var supplierUrl = $scope.$root.pr + "supplier/supplier/supplierListings";

        if (get_supplierCount == undefined) get_supplierCount = $rootScope.maxHttpRepeatCount;
        $http
            .post(supplierUrl, $scope.postData)
            .then(function(res) {
                // $scope.columns = [];
                $scope.record = {};
                $scope.showLoader = false;
                $scope.supplierTableData = res;

                if (res.data.ack == true) {

                    $rootScope.currencyArrPurchase = res.data.currency_arr_local;
                    // $scope.record = res.data.response;
                    angular.element('#listing_sp_single_Modal').modal({ show: true });
                } else
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));

            }).catch(function(e) {
                if (get_supplierCount != 0) return $scope.get_supplier(item_paging, shipagent, get_supplierCount - 1);

                $scope.showLoader = false;

                throw new Error(e.data);
            });
    }

    $rootScope.saveRecAfterAddSupp = 0;

    $scope.confirm_supp_single = function(result) {
        var objCust = {};
        var counter_rec = 0;

        $scope.removeSupp = 1;
        if ($scope.shipagent == 1) {
            $scope.rec.shipping_agent_id = result.id;
            $scope.rec.shipping_agent = result.name;

            angular.element('#listing_sp_single_Modal').modal('hide');
            return;
        }
        /* else{

            $scope.Update

        } */

        if (!(result.posting_group_id > 0)) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Supplier Posting Group']));
            return;
        }

        if (!($scope.rec.update_id > 0) || !($scope.rec.purchase_code_id > 0)) {
            $scope.rec.srm_purchase_code = result.purchase_code;
            $scope.rec.purchase_code_id = result.purchase_code_id;
        }

        $rootScope.arrVATPostGrpPurchase = undefined;

        $rootScope.order_posting_group_id = result.posting_group_id;

        $scope.rec.payable_number = result.anumber;
        $scope.rec.purchase_number = result.pnumber;
        $scope.rec.account_payable_id = result.account_payable_id;
        $scope.rec.sell_to_cust_no = objCust.sell_to_cust_no = result.code;
        $scope.rec.sell_to_cust_name = objCust.bill_to_customer = result.name;

        if ($scope.$root.breadcrumbs.length > 3) {

            if ($scope.rec.order_code)
                $scope.$root.model_code = $scope.rec.sell_to_cust_name + '(' + $scope.rec.order_code + ')';
            else
                $scope.$root.model_code = $scope.rec.sell_to_cust_name;

            $scope.$root.breadcrumbs[3].name = $scope.$root.model_code;
        }

        if ($scope.$root.breadcrumbs.length == 3) {
            // $scope.$root.model_code = $scope.rec.sell_to_cust_name + '(' + $scope.rec.order_code + ')';
            if ($scope.rec.order_code)
                $scope.$root.model_code = $scope.rec.sell_to_cust_name + '(' + $scope.rec.order_code + ')';
            else
                $scope.$root.model_code = $scope.rec.sell_to_cust_name;

            $scope.$root.breadcrumbs.push({ 'name': $scope.$root.model_code, 'url': '#', 'isActive': false });
        }

        $scope.rec.sell_to_address = objCust.bill_to_address = result.address_1;
        $scope.rec.sell_to_address2 = objCust.bill_to_address2 = result.address_2;
        $scope.rec.sell_to_city = objCust.bill_to_city = result.city;
        $scope.rec.sell_to_county = objCust.bill_to_county = result.county;
        $scope.rec.sell_to_post_code = objCust.bill_to_post_code = result.postcode;

        $scope.rec.sell_to_contact_no = result.contact_person;
        $scope.rec.cust_phone = result.Telephone;
        $scope.rec.cust_fax = result.fax;
        $scope.rec.cust_email = result.email;
        $scope.rec.sell_to_anonymous_supplier = result.anonymous_supplier;

        if (result.anonymous_supplier == 1)
            $scope.anonymousSupplierFlag = false;
        else
            $scope.anonymousSupplierFlag = true;

        angular.forEach($rootScope.country_type_arr, function(obj) {
            if (obj.id === result.country_id) {
                $scope.rec.billToSupplierCountry = obj;
                $scope.rec.country = obj;
            }
        });

        /* ================================= */
        /* Purchase Order Invoice tab detail */
        /* ================================= */

        $scope.rec.bill_to_cust_no = result.code;
        $scope.rec.bill_to_name = result.name;
        $scope.rec.bill_to_address = result.billing_address_1;
        $scope.rec.bill_to_address2 = result.billing_address_2;
        $scope.rec.bill_to_city = result.billing_city;
        $scope.rec.bill_to_county = result.billing_county;
        $scope.rec.bill_to_post_code = result.billing_postcode;
        $scope.rec.bill_to_anonymous_supplier = result.anonymous_supplier;

        if (result.anonymous_supplier == 1)
            $scope.bill_anonymousSupplierFlag = false;
        else
            $scope.bill_anonymousSupplierFlag = true;

        $scope.rec.bill_to_contact_no = result.contact_person;
        $scope.rec.bill_phone = result.Telephone;
        $scope.rec.bill_fax = result.fax;
        $scope.rec.bill_email = result.email;
        $scope.rec.bill_to_cust_id = result.id;
        $scope.rec.bill_to_contact_id = result.contact_id;

        angular.forEach($rootScope.country_type_arr, function(obj) {
            if (obj.id === result.billing_country)
                $scope.rec.billToSupplierCountry = obj;
        });

        angular.forEach($rootScope.currencyArrPurchase, function(obj) {
            if (obj.id === result.currency_id) {
                $rootScope.currencyID_PO = obj;
                $scope.rec.currency_id = obj;
            }
        });

        /* angular.forEach($rootScope.arr_currency, function (obj) {
            if (obj.id === result.currency_id) {
                $rootScope.currencyID_PO = obj;
                $scope.rec.currency_id = obj;
            }
        }); */

        angular.forEach($rootScope.arr_srm_payment_terms, function(elem2) {
            if (elem2.id == result.payment_term)
                $scope.rec.payment_terms_codes = elem2;
        });

        angular.forEach($rootScope.arr_srm_payment_methods, function(elem3) {
            if (elem3.id == result.payment_method)
                $scope.rec.payment_method_ids = elem3;
        });

        $scope.rec.payable_bank = result.bank_name;
        $scope.rec.bank_account_id = result.bank_account_id;

        if ($scope.rec.invoice_date != null && $scope.rec.payment_terms_codes != undefined) {

            $scope.updateDueDate($scope.rec.invoice_date);

            /* var date_parts = $scope.rec.invoice_date.trim().split('/');
            var invoice_date = new Date(date_parts[2], date_parts[1] - 1, date_parts[0]);

            if ($scope.rec.payment_terms_codes.days != undefined) {
                var calculated_date = 0;
                calculated_date = new Date(invoice_date.setDate(invoice_date.getDate() + Number($scope.rec.payment_terms_codes.days)));
                $scope.rec.due_date = padNumber(calculated_date.getUTCDate()) + '/' + padNumber(calculated_date.getUTCMonth() + 1) + '/' + calculated_date.getUTCFullYear();
            } */
        }

        /* ================================== */
        /* Purchase Order Shipping tab detail */
        /* ================================== */

        if (result.anonymous_supplier != 1) {

            $scope.rec.ship_to_name = result.locationDepot;
            $scope.rec.ship_to_address = result.locationAddress;
            $scope.rec.ship_to_address2 = result.locationAddress2;
            $scope.rec.ship_to_city = result.locationCity;
            $scope.rec.ship_to_county = result.locationCounty;
            $scope.rec.ship_to_post_code = result.locationPostcode;

            $scope.rec.alt_depo_id = result.locationID;
            $scope.rec.ship_to_contact = result.ship_to_contact_shiping;
            $scope.rec.ship_to_contact_shiping = result.direct_line;
            $scope.rec.ship_to_email = result.ship_to_email;
            $scope.rec.ship_to_phone = result.booking_telephone;

            angular.forEach($rootScope.country_type_arr, function(obj) {
                if (obj.id === result.country_id)
                    $scope.rec.shipToSupplierLocCountry = obj;
            });
        }

        $scope.rec.sell_to_cust_id = objCust.bill_to_cust_id = result.id;

        $rootScope.saveRecAfterAddSupp = 1;
        angular.element('#listing_sp_single_Modal').modal('hide');

        $scope.supplier_emails(result.id);
    }

    $scope.supplier_emails = function(supplier_id) {
        var postData = { 'token': $scope.$root.token, 'supplier_id': supplier_id };
        var supplierEmailUrl = $scope.$root.pr + "srm/srminvoice/get-supplier-emails";;
        $http
            .post(supplierEmailUrl, postData)
            .then(function(res) {
                if (res.data.ack == true) {

                    if (Number(supplier_id) > 0)
                        $scope.removeSupp = 1;
                    else
                        $scope.removeSupp = 0;

                    if (res.data.response.e_emails) {
                        try {
                            $scope.supplierOrderEmail = res.data.response.e_emails.response.purchaseOrderEmail;
                            $scope.supplierDebitEmail = res.data.response.e_emails.response.debitNoteEmail;
                            $scope.supplierRemittanceEmail = res.data.response.e_emails.response.remittanceAdviceEmail;
                            //alert($scope.supplierOrderEmail);
                        } catch (ex) {
                            console.log(ex);
                        }
                    }
                    $scope.rec.supplier_emails = [];
                    if (res.data.response.supplier_emails && res.data.response.supplier_emails.Emails) {
                        var supplierEmails = [];
                        angular.forEach(res.data.response.supplier_emails.Emails, function(obj, i) {
                            supplierEmails.push({ id: i, username: obj.trim() })
                        });
                        $scope.rec.supplier_emails['Emails'] = supplierEmails;
                    }
                    console.log($scope.rec);
                }

            }).catch(function(e) {
                $scope.showLoader = false;
                throw new Error(e.data);
            });
    }

    $scope.RemoveSupplier = function() {
        // $scope.rec.currency_id = 0;
        // $scope.rec.currency_rate = 1;        

        var check_approvals = $scope.$root.setup + "general/check-for-approvals-before-delete";

        $http
            .post(check_approvals, {
                'object_id': $scope.rec.id,
                'type': "4, 7",
                'token': $scope.$root.token
            })
            .then(function(res) {

                if (res.data.ack == 1) {

                    $rootScope.order_post_invoice_msg = "Do you want the delete the Approval history as well?";

                    var postUrl = $scope.$root.setup + "general/delete-approval-history";

                    ngDialog.openConfirm({
                        template: '_confirm_order_invoice_modal',
                        className: 'ngdialog-theme-default-custom'
                    }).then(function(value) {
                        $scope.showLoader = true;

                        $http
                            .post(postUrl, { 'token': $scope.$root.token, 'object_id': $scope.rec.id, 'type': '4,7' })
                            .then(function(res) {
                                if (res.data.ack != undefined) {
                                    $scope.showLoader = false;
                                }
                            });
                    }, function(reason) {
                        console.log('Modal promise rejected. Reason: ', reason);
                    });
                }

                $scope.removeSupp = 0;

                $rootScope.order_posting_group_id = 0;
                $scope.rec.payable_number = 0;
                $scope.rec.purchase_number = 0;
                $scope.rec.account_payable_id = 0;
                $scope.rec.sell_to_cust_no = '';
                $scope.rec.sell_to_cust_name = '';

                $rootScope.arrVATPostGrpPurchase = undefined;

                if ($scope.$root.breadcrumbs.length > 3) {

                    if ($scope.rec.order_code) {
                        $scope.$root.model_code = $scope.rec.order_code;
                        $scope.$root.breadcrumbs[3].name = $scope.$root.model_code;
                    }
                }

                $scope.rec.sell_to_address = '';
                $scope.rec.sell_to_address2 = '';
                $scope.rec.sell_to_city = '';
                $scope.rec.sell_to_county = '';
                $scope.rec.sell_to_post_code = '';
                $scope.rec.sell_to_contact_no = '';
                $scope.rec.cust_phone = '';
                $scope.rec.cust_fax = '';
                $scope.rec.cust_email = '';
                $scope.rec.sell_to_anonymous_supplier = '';
                $scope.rec.billToSupplierCountry = $scope.rec.country = $scope.rec.shipToSupplierLocCountry = {};

                $scope.rec.srm_purchase_code = '';
                $scope.rec.purchase_code_id = 0;

                $scope.rec.shipping_agent_id = 0;
                $scope.rec.shipping_agent = '';
                $scope.rec.container_no = '';
                $scope.rec.warehouse_booking_ref = '';
                $scope.rec.prev_code = '';
                $scope.rec.due_date = '';
                $scope.rec.supp_order_no = '';
                $scope.rec.cust_order_no = '';
                $scope.rec.comm_book_in_no = '';

                $scope.selectedSaleOrderArr = [];
                $scope.selectedSaleOrderModal = [];
                $scope.PendingSelectedSaleOrder = [];

                $scope.selectedSaleOrders = "";

                /* ================================= */
                /* Purchase Order Invoice tab detail */
                /* ================================= */

                $scope.rec.bill_to_cust_no = '';
                $scope.rec.bill_to_name = '';
                $scope.rec.bill_to_address = '';
                $scope.rec.bill_to_address2 = '';
                $scope.rec.bill_to_city = '';
                $scope.rec.bill_to_county = '';
                $scope.rec.bill_to_post_code = '';
                $scope.rec.bill_to_anonymous_supplier = '';
                $scope.rec.bill_to_contact_no = '';
                $scope.rec.bill_phone = '';
                $scope.rec.bill_fax = '';
                $scope.rec.bill_email = '';
                $scope.rec.bill_to_cust_id = 0;
                $scope.rec.bill_to_contact_id = 0;

                $rootScope.currencyID_PO = $scope.rec.currency_id = {};
                $scope.rec.payment_terms_codes = $scope.rec.payment_method_ids = {};

                $scope.rec.payable_bank = '';
                $scope.rec.bank_account_id = 0;

                /* ================================== */
                /* Purchase Order Shipping tab detail */
                /* ================================== */


                $scope.rec.ship_to_name = '';
                $scope.rec.ship_to_address = '';
                $scope.rec.ship_to_address2 = '';
                $scope.rec.ship_to_city = '';
                $scope.rec.ship_to_county = '';
                $scope.rec.ship_to_post_code = '';

                $scope.rec.alt_depo_id = 0;
                $scope.rec.ship_to_contact = '';
                $scope.rec.ship_to_contact_shiping = '';
                $scope.rec.ship_to_email = '';
                $scope.rec.ship_to_phone = '';

                $scope.rec.sell_to_cust_id = 0;

                /* ============= */

                angular.element('#listing_sp_single_Modal').modal('hide');

            });



    }


    $scope.searchKeywordshippingAgent = {};

    $scope.selectshippingAgent = function(item_paging, get_supplierCount) {

        $scope.title = 'Shipping Agent';
        $scope.columns = [];
        $scope.record = {};
        $scope.record_invoice = {};

        //pass in API
        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.postData.type = 1;

        if (item_paging == 1)
            $scope.item_paging.spage = 1

        $scope.postData.page = $scope.item_paging.spage;
        $scope.postData.searchKeyword = $scope.searchKeywordshippingAgent;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeywordshippingAgent = {};
            $scope.record_data = {};
        }
        // $scope.searchKeyword_sup = {};
        $scope.showLoader = true;

        var supplierUrl = $scope.$root.pr + "supplier/supplier/supplierListings";

        if (get_supplierCount == undefined) get_supplierCount = $rootScope.maxHttpRepeatCount;
        $http
            .post(supplierUrl, $scope.postData)
            .then(function(res) {
                // $scope.columns = [];
                $scope.record = {};
                $scope.showLoader = false;
                $scope.shippingAgentTableData = res;

                if (res.data.ack == true) {
                    angular.element('#listing_shippingAgents_Modal').modal({ show: true });
                } else
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));

            }).catch(function(e) {
                if (get_supplierCount != 0) return $scope.get_supplier(item_paging, get_supplierCount - 1);

                $scope.showLoader = false;
                throw new Error(e.data);
            });
    }

    $scope.confirmshippingAgent = function(result) {

        $scope.rec.shipping_agent_id = result.id;
        $scope.rec.shipping_agent = result.name;
        angular.element('#listing_shippingAgents_Modal').modal('hide');
        return;
    }

    var get_empl_listCount;

    $scope.get_empl_list = function(arg, get_empl_listCount) {
        $scope.showLoader = true;
        $scope.columns_pr = [];
        $scope.record_pr = {};
        $scope.searchKeyword_offered = {};
        $scope.searchKeyword = {};
        $scope.title = 'Recieved By';
        $scope.empListType = 'general';

        if (arg == 'purchaser_code') {
            $scope.title = 'Employee List';
            $scope.empListType = 'purchaser_code';
        }

        var empUrl = $scope.$root.hr + "employee/listings";

        var postData = {
            'token': $scope.$root.token,
            'limit': 9999
        };

        if (get_empl_listCount == undefined) get_empl_listCount = $rootScope.maxHttpRepeatCount;
        $http
            .post(empUrl, postData)
            .then(function(res) {

                if (res.data.ack == true) {
                    $scope.columns_pr = [];
                    $scope.record_pr = {};
                    $scope.record_pr = res.data.response;
                    $scope.showLoader = false;

                    angular.forEach(res.data.response[0], function(val, index) {
                        $scope.columns_pr.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    angular.element('#_SrmEmplisting_model').modal({ show: true });
                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            }).catch(function(e) {
                if (get_empl_listCount != 0) return $scope.get_empl_list(arg, get_empl_listCount - 1);

                $scope.showLoader = false;

                throw new Error(e.data);
            });
    }

    $scope.confirm_employeeList = function(result, emptype) {

        if (emptype == 'purchaser_code') {
            //$scope.rec.purchaser_code = result.name;
            $scope.rec.srm_purchase_code = result.name;
            $scope.rec.purchase_code_id = result.id;
        }
        angular.element('#_SrmEmplisting_model').modal('hide');
    }

    $scope.get_supplier3 = function() {
        $scope.columns = [];
        $scope.record = {};
        $scope.title = 'Supplier Listing';

        var custUrl2 = $scope.$root.pr + "supplier/srminvoice/check-customer-limit";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
            'more_fields': "currency_id*credit_limit*address_2*fax*email"
        };
        $http
            .post(custUrl, postData)
            .then(function(res) {
                $scope.columns = [];
                $scope.record = {};
                $scope.record = res.data.response;

                angular.forEach(res.data.response[0], function(val, index) {
                    if (index != "country" && index != "purchase_code") {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    }
                });
            }).catch(function(message) {
                $scope.showLoader = false;

                throw new Error(message.data);
            });

        $scope.animationsEnabled = true;
        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'customerModalDialogId',
            controller: 'ModalInstanceCtrl',
            resolve: {
                columns: function() {
                    return $scope.columns;
                },
                record: function() {
                    return $scope.record;
                }
            }
        });
    }

    function padNumber(number) {
        var string = '' + number;
        string = string.length < 2 ? '0' + string : string;
        return string;
    }

    $scope.updateDueDate = function(invoiceDate) {

        if (invoiceDate != null) {
            var date_parts = invoiceDate.trim().split('/');
            var invoice_date = new Date(date_parts[2], date_parts[1] - 1, date_parts[0]);

            if ($scope.rec.payment_terms_codes != undefined) {

                if ($scope.rec.payment_terms_codes.days != undefined) {
                    var calculated_date = 0;
                    calculated_date = new Date(invoice_date.setDate(invoice_date.getDate() + Number($scope.rec.payment_terms_codes.days)));
                    calculated_date.setHours(0, 0, 0, 0);
                    // calculated_date = calculated_date.getTime();
                    // $scope.rec.due_date = padNumber(calculated_date.getUTCDate()) + '/' + padNumber(calculated_date.getUTCMonth() + 1) + '/' + calculated_date.getUTCFullYear();
                    $scope.rec.due_date = padNumber(calculated_date.getDate()) + '/' + padNumber(calculated_date.getMonth() + 1) + '/' + calculated_date.getFullYear();
                }
            }
        } else
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(503));

        return;
    }

    $scope.searchKeywordSuppInv = {};

    var get_suppliers_invoicingCount;
    $scope.get_suppliers_invoicing = function(item_paging, get_suppliers_invoicingCount) {

        $scope.recordSuppInvoice = {};

        //pass in API
        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;

        if (item_paging == 1)
            $scope.item_paging.spage = 1

        $scope.postData.page = $scope.item_paging.spage;
        $scope.postData.searchKeyword = $scope.searchKeywordSuppInv;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeywordSuppInv = {};
            $scope.record_data = {};
        }

        $scope.showLoader = true;
        var supplierUrl = $scope.$root.pr + "supplier/supplier/supplierInvListings";

        if (get_suppliers_invoicingCount == undefined) get_suppliers_invoicingCount = $rootScope.maxHttpRepeatCount;
        $http
            .post(supplierUrl, $scope.postData)
            .then(function(res) {
                $scope.showLoader = false;
                $scope.supplierInvTableData = res;

                if (res.data.ack == true) {
                    // $scope.recordSuppInvoice = res.data.response;
                    angular.element('#listing_sp_single_invoice_Modal').modal({ show: true });
                } else
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            }).catch(function(e) {
                if (get_suppliers_invoicingCount != 0) return $scope.get_suppliers_invoicing(arg, get_suppliers_invoicingCount - 1);

                $scope.showLoader = false;

                throw new Error(e.data);
            });
    }

    $scope.confirm_supp_invoicing_single = function(result) {

        $scope.rec.bill_to_cust_no = result.code;
        $scope.rec.bill_to_name = result.name;
        $scope.rec.bill_to_address = result.address_1;
        $scope.rec.bill_to_address2 = result.address_2;
        $scope.rec.bill_to_city = result.city;
        $scope.rec.bill_to_county = result.county;
        $scope.rec.bill_to_post_code = result.postcode;
        $scope.rec.bill_to_anonymous_supplier = result.anonymous_supplier;

        if (result.anonymous_supplier == 1)
            $scope.bill_anonymousSupplierFlag = false;
        else
            $scope.bill_anonymousSupplierFlag = true;

        angular.forEach($rootScope.arr_srm_payment_terms, function(elem2) {
            if (elem2.id == result.payment_term)
                $scope.rec.payment_terms_codes = elem2;
        });

        angular.forEach($rootScope.arr_srm_payment_methods, function(elem3) {
            if (elem3.id == result.payment_method)
                $scope.rec.payment_method_ids = elem3;
        });

        angular.forEach($rootScope.country_type_arr, function(obj) {
            if (obj.id === result.country_id)
                $scope.rec.billToSupplierCountry = obj;
        });

        $scope.rec.payable_bank = result.bank_name;
        $scope.rec.bank_account_id = result.bank_account_id;

        if ($scope.rec.invoice_date != null && $scope.rec.payment_terms_codes != undefined) {

            $scope.updateDueDate($scope.rec.invoice_date);

            /* var date_parts = $scope.rec.invoice_date.trim().split('/');
            var invoice_date = new Date(date_parts[2], date_parts[1] - 1, date_parts[0]);

            if ($scope.rec.payment_terms_codes.days != undefined) {
                var calculated_date = 0;
                calculated_date = new Date(invoice_date.setDate(invoice_date.getDate() + Number($scope.rec.payment_terms_codes.days)));
                $scope.rec.due_date = padNumber(calculated_date.getUTCDate()) + '/' + padNumber(calculated_date.getUTCMonth() + 1) + '/' + calculated_date.getUTCFullYear();
            } */
        }

        $scope.rec.bill_to_contact_no = result.contact_person;
        $scope.rec.bill_phone = result.Telephone;
        $scope.rec.bill_fax = result.fax;
        $scope.rec.bill_email = result.email;
        $scope.rec.bill_to_cust_id = result.id;
        $scope.rec.bill_to_contact_id = result.contact_id;

        angular.element('#listing_sp_single_invoice_Modal').modal('hide');
    }

    var getBankAccountCount;

    $scope.getBankAccount = function(getBankAccountCount) {

        $scope.searchKeyword = '';
        $scope.showLoader = true;

        $scope.title = 'Payable Bank';
        var getBankUrl = $scope.$root.setup + "general/bank-accounts";

        var postData = { 'token': $scope.$root.token, 'filter_id': 152 };

        if (getBankAccountCount == undefined) getBankAccountCount = $rootScope.maxHttpRepeatCount;
        $http
            .post(getBankUrl, postData)
            .then(function(res) {
                $scope.showLoader = false;

                $scope.columns = [];
                $scope.record = [];

                if (res.data.ack > 0) {

                    $scope.record = res.data.response;

                    angular.forEach(res.data.response[0], function(val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    angular.element('#_model_modal_bank_order').modal({ show: true });
                }
            }).catch(function(e) {
                if (getBankAccountCount != 0) return $scope.getBankAccount(getBankAccountCount - 1);

                $scope.showLoader = false;

                throw new Error(e.data);
            });
    }

    $scope.confirm_bank = function(btc) {
        $scope.rec.payable_bank = btc.bank_name;
        // $scope.rec.payable_bank = btc.preferred_name;
        $scope.rec.bank_account_id = btc.id;
        angular.element('#_model_modal_bank_order').modal('hide');
    }

    $scope.selected_count = 0;
    var get_purchase_code_empCount;

    $scope.get_purchase_code_emp = function(arg, id, get_purchase_code_empCount) {

        var postData_sale = {
            'token': $scope.$root.token,
            'edit_id': arg,
            'id': id
        };

        var emp_Url = $scope.$root.hr + "hr_values/get-all-employee-purchase-code";

        if (get_purchase_code_empCount == undefined) get_purchase_code_empCount = $rootScope.maxHttpRepeatCount;
        $http
            .post(emp_Url, postData_sale)
            .then(function(res) {
                $scope.selection_record_del = {};
                $scope.columnss = [];

                if (res.data.ack == true) {
                    $scope.selected_count = res.data.selected_count;
                    $scope.selection_record_del = res.data.response;
                    var test_name = '';

                    angular.forEach(res.data.response, function(value, key) {
                        if (value.checked == 1) {
                            test_name += value.name + ",";
                        }
                    });

                    $scope.rec.srm_purchase_code = test_name.substring(0, test_name.length - 1);
                }
            }).catch(function(e) {
                if (get_purchase_code_empCount != 0) return $scope.get_purchase_code_emp(arg, id, get_purchase_code_empCount - 1);

                $scope.showLoader = false;

                throw new Error(e.data);
            });
    }

    var getAltDepotCount;

    $scope.getAltDepot = function(getAltDepotCount) {
        $scope.title = 'Location Listing';

        if ($scope.rec.sell_to_cust_id == undefined) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Supplier']));
            return;
        } else {
            $scope.showLoader = true;
            var ApiAjax = $scope.$root.pr + "srm/srm/alt-delivery-depots";
            var postData = {
                'token': $scope.$root.token,
                'acc_id': $scope.rec.sell_to_cust_id,
                'module_type': 2
            }

            if (getAltDepotCount == undefined) getAltDepotCount = $rootScope.maxHttpRepeatCount;
            $http
                .post(ApiAjax, postData)
                .then(function(res) {
                    $scope.columns = [];
                    $scope.record = {};
                    $scope.filterLoc = {};
                    $scope.showLoader = false;

                    if (res.data.record.ack == true) {
                        $scope.record = res.data.record.result;

                        angular.forEach(res.data.record.result[0], function(val, index) {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });

                        angular.element('#deliveryLocationsModal').modal({ show: true });
                    } else
                        toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(563));

                }).catch(function(e) {
                    if (getAltDepotCount != 0) return $scope.getAltDepot(getAltDepotCount - 1);

                    $scope.showLoader = false;

                    throw new Error(e.data);
                });
        }
    }

    $scope.confirmLocation = function(result) {

        $scope.rec.ship_to_name = result.location;
        $scope.rec.ship_to_address = result.address_1;
        $scope.rec.ship_to_address2 = result.address_2;
        $scope.rec.ship_to_city = result.city;
        $scope.rec.ship_to_post_code = result.postcode;
        $scope.rec.alt_depo_id = result.id;

        $scope.rec.ship_to_contact_shiping = result.clcontact_name;
        $scope.rec.ship_to_phone = result.clphone;
        $scope.rec.ship_to_email = result.clemail;
        $scope.rec.ship_to_contact = result.cldirect_line;
        $scope.rec.ship_to_county = result.county;

        angular.forEach($rootScope.country_type_arr, function(obj) {
            // if (obj.id === result.shipToSupplierLocCountry)
            if (obj.id === result.country_id)
                $scope.rec.shipToSupplierLocCountry = obj;
        });

        angular.element('#deliveryLocationsModal').modal('hide');
    }

    $scope.getShippingAgents = function() {
        $scope.columns = [];
        $scope.record = {};
        $scope.title = 'Shipping Agents';
        var ApiAjax = $scope.$root.setup + "crm/shipping-agents";
        var postData = { 'token': $scope.$root.token }

        $http
            .post(ApiAjax, postData)
            .then(function(res) {

                $scope.columns = [];
                $scope.record = {};
                $scope.record = res.data.response;
                angular.forEach(res.data.response[0], function(val, index) {
                    $scope.columns.push({
                        'title': toTitleCase(index),
                        'field': index,
                        'visible': true
                    });
                });
            }).catch(function(message) {
                $scope.showLoader = false;

                throw new Error(message.data);
            });

        ngDialog.openConfirm({
            template: 'modalDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function(result) {
            angular.forEach(result, function(elem, index) {
                if (index == 'Name')
                    $scope.rec.shipping_agent_code = elem;
            });
            $scope.rec.shipping_agent_id = result.id;
        }, function(reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    var getAltContactCount;
    $scope.getAltContact = function(arg, getAltContactCount) {

        $scope.title = 'Contacts';
        $scope.contactArg = arg;

        if ($scope.rec.sell_to_cust_id == undefined) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Supplier']));
            return;
        } else {
            $scope.showLoader = true;
            var postAltCData = {
                'acc_id': $scope.rec.sell_to_cust_id,
                'module_type': 2,
                'token': $scope.$root.token
            };

            var altContactUrl = $scope.$root.pr + "srm/srm/alt-contacts";

            if (getAltContactCount == undefined) getAltContactCount = $rootScope.maxHttpRepeatCount;
            $http
                .post(altContactUrl, postAltCData)
                .then(function(res) {

                    $scope.columns = [];
                    $scope.record = {};
                    $scope.filtercontact = {};
                    $scope.showLoader = false;

                    if (res.data.record.ack == true) {
                        $scope.record = res.data.record.result;

                        angular.forEach(res.data.record.result[0], function(val, index) {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });

                        angular.element('#orderContactModal').modal({ show: true });
                    } else
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(564));
                }).catch(function(e) {
                    if (getAltContactCount != 0) return $scope.getAltContact(arg, getAltContactCount - 1);

                    $scope.showLoader = false;

                    throw new Error(e.data);
                });
        }
    }
    $scope.callbackAfterItemsMigration = function() {
        $scope.showLoader = true;
        $timeout(function() {
            $state.go("app.editsrmorder", { id: $scope.rec.id }, { reload: true });
            // $state.go($state.current, $stateParams, { reload: true })
        }, 1500)
    }
    $scope.callbackBeforeItemsMigration = function(data) {

        data.additionalParams = [
            { type: "Number", sourceTable: "", sourceField: "", targetTable: "srm_invoice_detail", targetField: "invoice_id", columnName: "Purchase Order Number", value: $scope.rec.id },
            { type: "String", sourceTable: "", sourceField: "", targetTable: "srm_invoice_detail", targetField: "invoice_code", columnName: "Purchase Order Number", value: $scope.rec.order_code },
            { type: "Number", sourceTable: "", sourceField: "", targetTable: "srm_invoice_detail", targetField: "supplier_id", columnName: "Supplier ID", value: $scope.rec.sell_to_cust_id }
        ]
        return data;
    }
    $scope.confirm_contact = function(result) {

        if ($scope.contactArg == 1) {

            $scope.rec.sell_to_contact_id = result.id;
            $scope.rec.sell_to_contact_no = result.name;
            $scope.rec.cust_phone = result.phone;
            $scope.rec.cust_email = result.email;
            $scope.rec.cust_fax = result.fax;
        }

        if ($scope.contactArg == 2) {
            $scope.rec.bill_to_contact_id = result.id;
            $scope.rec.bill_to_contact_no = result.name;
            $scope.rec.bill_phone = result.phone;
            $scope.rec.bill_email = result.email;
            $scope.rec.bill_fax = result.fax;
        }

        angular.element('#orderContactModal').modal('hide');
    }

    var getSalePersonCount;

    $scope.getSalePerson = function(arg, getSalePersonCount) {
        $scope.columns = [];
        $scope.record = {};
        var empUrl = $scope.$root.hr + "employee/listings";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
        };

        if (getSalePersonCount == undefined) getSalePersonCount = $rootScope.maxHttpRepeatCount;
        $http
            .post(empUrl, postData)
            .then(function(res) {

                if (res.data.ack == true) {
                    $scope.columns = [];
                    $scope.record = {};
                    $scope.record = res.data.response;

                    angular.forEach(res.data.response[0], function(val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                } else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            }).catch(function(e) {
                if (getSalePersonCount != 0) return $scope.getSalePerson(arg, getSalePersonCount - 1);

                $scope.showLoader = false;

                throw new Error(e.data);
            });

        ngDialog.openConfirm({
            template: 'modalDialogId_cus',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function(result) {
            $scope.rec.sale_person = result.first_name + ' ' + result.last_name;
            $scope.rec.sale_person_id = result.id;
        }, function(reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    /*  order status code start */
    var OrderStagesCounter;

    $scope.order_stages_array = [];
    $scope.GetSalesOrderStages = function(flg, OrderStagesCounter) {

        if (OrderStagesCounter == undefined) OrderStagesCounter = 3;

        $scope.order_stages_array = [];
        var postData = '';
        if (flg == 0) {
            var order_stages = $scope.$root.setup + "crm/get-order-stages-list";
            postData = {
                'token': $scope.$root.token,
                'type': 2,
                'order_id': $stateParams.id,
                'isAllowed': 1 //this parameter is to allow without permission validation
            };
        } else {
            var order_stages = $scope.$root.sales + "customer/order/get-sales-order-stages";
            postData = {
                'token': $scope.$root.token,
                'type': 2,
                'order_id': $stateParams.id
            };
        }

        $http
            .post(order_stages, postData)
            .then(function(res) {
                if (res.data.ack == true) {
                    $scope.order_stages_array = res.data.response;
                    // if ($scope.rec.id == undefined) {
                    if ($stateParams.id == undefined) {
                        angular.forEach($scope.order_stages_array, function(obj) {
                            obj.id = 0;
                        });
                    }
                }
            }).catch(function(message) {
                if (--OrderStagesCounter != 0) return $scope.GetSalesOrderStages(flg, OrderStagesCounter);
                $scope.showLoader = false;

                throw new Error(message.data);
            });
    }


    if ($stateParams.id == undefined)
        $scope.GetSalesOrderStages(0);
    else
        $scope.GetSalesOrderStages();


    var link_order = 'app.srminvoice';
    var name_link = '';
    // var name_link = 'Purchase Invoices';

    $scope.on_hold_order = 0;

    if ($stateParams.id == undefined)
        $scope.rec.type = 3;

    if ($scope.rec.type == 3) {
        link_order = 'app.srmorder';
        name_link = 'Purchase Orders';
    }

    $scope.$root.breadcrumbs = [{ 'name': 'Purchases', 'url': '#', 'isActive': false }, { 'name': 'Suppliers', 'url': 'app.supplier', 'isActive': false }, { 'name': name_link, 'url': link_order, 'isActive': false }];

    var getMainInvDataCount;
    $scope.getMainInvData = function(getMainInvDataCount) {
        $scope.showLoader = true;

        var getQuoteUrl = $scope.$root.pr + "srm/srminvoice/get-invoice";

        if (getMainInvDataCount == undefined) getMainInvDataCount = $rootScope.maxHttpRepeatCount;
        $http
            .post(getQuoteUrl, { 'id': $stateParams.id, 'token': $scope.$root.token })
            .then(function(res) {

                if (res.data.ack == true) {
                    $scope.rec = res.data.response;
                    $scope.rec.update_id = $stateParams.id;
                    moduleTracker.updateRecord($stateParams.id);
                    // $scope.removeSupp = 1;

                    $scope.currencyConversionRatePO = $scope.rec.currency_rate;

                    if (Number($scope.rec.sell_to_cust_id) > 0)
                        $scope.removeSupp = 1;
                    else
                        $scope.removeSupp = 0;

                    moduleTracker.updateRecordName(res.data.response.order_code +
                        ((res.data.response.invoice_code != null && res.data.response.invoice_code != "0") ? "/" : "") + ((res.data.response.invoice_code != null && res.data.response.invoice_code != "0") ? res.data.response.invoice_code : ""));

                    if (res.data.response.e_emails) {
                        try {
                            $scope.supplierOrderEmail = res.data.response.e_emails.response.purchaseOrderEmail;
                            $scope.supplierDebitEmail = res.data.response.e_emails.response.debitNoteEmail;
                            $scope.supplierRemittanceEmail = res.data.response.e_emails.response.remittanceAdviceEmail;
                        } catch (ex) {
                            console.log(ex);
                        }
                    }

                    if ($scope.rec.supplier_emails && $scope.rec.supplier_emails.Emails) {
                        var supplierEmails = [];
                        angular.forEach($scope.rec.supplier_emails.Emails, function(obj, i) {
                            supplierEmails.push({ id: i, username: obj.trim() })
                        });
                        $scope.rec.supplier_emails.Emails = supplierEmails;
                    }

                    // $scope.rec.sell_to_anonymous_supplier = res.data.response.sell_to_anonymous_supplier;

                    if ($scope.rec.sell_to_anonymous_supplier == 1)
                        $scope.anonymousSupplierFlag = false;
                    else
                        $scope.anonymousSupplierFlag = true;

                    if (res.data.response.bill_to_anonymous_supplier == 1)
                        $scope.bill_anonymousSupplierFlag = false;
                    else
                        $scope.bill_anonymousSupplierFlag = true;

                    if ($scope.rec.type == 3) {

                        if (res.data.response.sell_to_cust_name != null)
                            $scope.$root.model_code = res.data.response.sell_to_cust_name + '(' + res.data.response.order_code + ')';
                        else
                            $scope.$root.model_code = res.data.response.order_code;
                    } else {
                        if (res.data.response.sell_to_cust_name != null)
                            $scope.$root.model_code = res.data.response.sell_to_cust_name + '(' + res.data.response.invoice_code + ')';
                        else
                            $scope.$root.model_code = res.data.response.invoice_code;
                    }

                    // $scope.$root.order_id = $scope.rec.id;
                    if (res.data.response.approval_type_1 == 2 && res.data.response.approval_type_2 == 2) {
                        $scope.approvals_lock_order = 1;
                    } else if (res.data.response.approval_type_1 == 0 || res.data.response.approval_type_2 == 0) {
                        $scope.approvals_lock_order = -1;
                    } else
                        $scope.approvals_lock_order = 0;

                    $scope.on_hold_order = (res.data.response.approval_type_1 == 7 || res.data.response.approval_type_2 == 7) ? 1 : 0;

                    $scope.module_code = $scope.$root.model_code;

                    if ($scope.rec.type == 3) {
                        link_order = 'app.srmorder';
                        name_link = 'Purchase Orders';

                        $scope.$root.breadcrumbs = [{ 'name': 'Purchases', 'url': '#', 'isActive': false }, { 'name': 'Suppliers', 'url': 'app.supplier', 'isActive': false }, { 'name': name_link, 'url': link_order, 'isActive': false }];
                    } else if ($scope.rec.type == 2) {

                        var link_order = 'app.srminvoice';

                        $scope.$root.breadcrumbs = [{ 'name': 'Purchases', 'url': '#', 'isActive': false }, { 'name': 'Suppliers', 'url': 'app.supplier', 'isActive': false }, { 'name': 'Purchase Invoices', 'url': link_order, 'isActive': false }];
                    }

                    $scope.$root.breadcrumbs.push({ 'name': $scope.$root.model_code, 'url': '#', 'isActive': false }); //, { 'name': 'General', 'url': '#', 'isActive': false }

                    if (res.data.response.invoice_date == 0)
                        $scope.rec.invoice_date = null;
                    else
                        $scope.rec.invoice_date = res.data.response.invoice_date;

                    if (res.data.response.requested_delivery_date == 0)
                        $scope.rec.requested_delivery_date = null;
                    else
                        $scope.rec.requested_delivery_date = res.data.response.requested_delivery_date;


                    if (res.data.response.order_date == 0)
                        $scope.rec.order_date = null;
                    else
                        $scope.rec.order_date = res.data.response.order_date;

                    if (res.data.response.recpt_date == 0)
                        $scope.rec.recpt_date = null;
                    else
                        $scope.rec.recpt_date = res.data.response.recpt_date;

                    $rootScope.order_posting_group_id = res.data.response.bill_to_posting_group_id;
                    $rootScope.arrVATPostGrpPurchase = res.data.arrVATPostGrpPurchase;

                    if (res.data.response.shipment_date == 0)
                        $scope.rec.shipment_date = null;
                    else
                        $scope.rec.shipment_date = res.data.response.shipment_date;

                    $scope.selectedSaleOrders = "";
                    var selectedSaleOrders_name = "";

                    // $scope.SaleOrderArr = res.data.response.SaleOrderslisting.response;

                    /* if (res.data.response.SaleOrders != undefined && $scope.SaleOrderArr != undefined) {

                        if ($scope.SaleOrderArr.length > 0) {

                            angular.forEach(res.data.response.SaleOrderslisting.response, function (obj) {
                                angular.forEach(res.data.response.SaleOrders, function (obj2) {
                                    if (obj2.saleOrderID == obj.id) {
                                        $scope.selectedSaleOrderArr.push(obj);
                                        selectedSaleOrders_name += obj.sale_order_code + "; ";
                                    }
                                });
                            });
                            $scope.selectedSaleOrders = selectedSaleOrders_name.substring(0, selectedSaleOrders_name.length - 2);
                        }
                    } */

                    $scope.selectedSaleOrderArr = [];
                    $scope.selectedSaleOrderModal = [];

                    if (res.data.response.selSaleOrderslisting && res.data.response.selSaleOrderslisting.response) {

                        angular.forEach(res.data.response.selSaleOrderslisting.response, function(obj) {
                            if (obj.id > 0) {
                                $scope.selectedSaleOrderArr.push(obj);

                                var selRecord = {};
                                selRecord.key = obj.id;
                                selRecord.record = obj;
                                selRecord.value = obj.sale_order_code;

                                $scope.selectedSaleOrderModal.push(selRecord);

                                selectedSaleOrders_name += obj.sale_order_code + "; ";
                            }
                        });

                        $scope.selectedSaleOrders = selectedSaleOrders_name.substring(0, selectedSaleOrders_name.length - 2);
                    }

                    angular.forEach($rootScope.srm_shippment_methods_arr, function(elem) {
                        if (elem.id == res.data.response.shipment_method_id)
                            $scope.rec.shipment_method_code = elem;
                    });

                    angular.forEach($rootScope.arr_srm_payment_terms, function(elem) {
                        if (elem.id == res.data.response.payment_terms_code)
                            $scope.rec.payment_terms_codes = elem;
                    });

                    angular.forEach($rootScope.arr_srm_payment_methods, function(elem) {
                        if (elem.id == res.data.response.payment_method_id)
                            $scope.rec.payment_method_ids = elem;
                    });

                    $rootScope.currencyArrPurchase = res.data.currency_arr_local;

                    // angular.forEach($rootScope.arr_currency, function (elem) {
                    angular.forEach($rootScope.currencyArrPurchase, function(elem) {
                        if (elem.id == $scope.rec.currency_id) {
                            // $rootScope.currency_id = elem;
                            $rootScope.currencyID_PO = elem;
                            $scope.rec.currency_id = elem;
                        }
                    });

                    angular.forEach($rootScope.country_type_arr, function(obj) {
                        if (obj.id === res.data.response.country)
                            $scope.rec.country = obj;

                        if (obj.id === res.data.response.billToSupplierCountry)
                            $scope.rec.billToSupplierCountry = obj;

                        if (obj.id === res.data.response.shipToSupplierLocCountry)
                            $scope.rec.shipToSupplierLocCountry = obj;
                    });

                    $rootScope.posting_date = res.data.response.invoice_date;

                    // if (!Number($scope.rec.sell_to_cust_id) > 0)
                    //     $rootScope.order_posting_group_id = res.data.response.bill_to_posting_group_id;
                }

                //     $scope.showLoader = false;

            }).catch(function(e) {
                if (getMainInvDataCount != 0) return $scope.getMainInvData(getMainInvDataCount - 1);

                $scope.showLoader = false;

                throw new Error(e.data);
            });
    }

    $scope.$on('turnOnLoader', function(event, data) {
        $scope.showLoader = false;
    });

    if ($stateParams.id > 0) $scope.getMainInvData();


    $scope.generalInformation = function() {

        if ($scope.$root.breadcrumbs.length == 2) {
            // $scope.$root.model_code = $scope.rec.sell_to_cust_name + '(' + $scope.rec.order_code + ')';

            if ($scope.rec.type == 3) {

                if ($scope.rec.sell_to_cust_name != null)
                    $scope.$root.model_code = $scope.rec.sell_to_cust_name + '(' + $scope.rec.order_code + ')';
                else
                    $scope.$root.model_code = $scope.rec.order_code;
            } else {
                if ($scope.rec.sell_to_cust_name != null)
                    $scope.$root.model_code = $scope.rec.sell_to_cust_name + '(' + $scope.rec.invoice_code + ')';
                else
                    $scope.$root.model_code = $scope.rec.invoice_code;
            }

            $scope.$root.breadcrumbs.push({ 'name': $scope.$root.model_code, 'url': '#', 'isActive': false }); //, { 'name': 'General', 'url': '#', 'isActive': false }
        }
    }

    $scope.invoice_information = function() {

        if ($scope.$root.breadcrumbs.length == 2) {
            // $scope.$root.model_code = $scope.rec.sell_to_cust_name + '(' + $scope.rec.order_code + ')';

            if ($scope.rec.type == 3) {

                if ($scope.rec.sell_to_cust_name != null)
                    $scope.$root.model_code = $scope.rec.sell_to_cust_name + '(' + $scope.rec.order_code + ')';
                else
                    $scope.$root.model_code = $scope.rec.order_code;
            } else {
                if ($scope.rec.sell_to_cust_name != null)
                    $scope.$root.model_code = $scope.rec.sell_to_cust_name + '(' + $scope.rec.invoice_code + ')';
                else
                    $scope.$root.model_code = $scope.rec.invoice_code;
            }

            $scope.$root.breadcrumbs.push({ 'name': $scope.$root.model_code, 'url': '#', 'isActive': false }); //, { 'name': 'Shipping', 'url': '#', 'isActive': false }
        }
    }

    $scope.shiping_information = function() {

        if ($scope.$root.breadcrumbs.length == 2) {
            // $scope.$root.model_code = $scope.rec.sell_to_cust_name + '(' + $scope.rec.order_code + ')';

            if ($scope.rec.type == 3) {

                if ($scope.rec.sell_to_cust_name != null)
                    $scope.$root.model_code = $scope.rec.sell_to_cust_name + '(' + $scope.rec.order_code + ')';
                else
                    $scope.$root.model_code = $scope.rec.order_code;
            } else {
                if ($scope.rec.sell_to_cust_name != null)
                    $scope.$root.model_code = $scope.rec.sell_to_cust_name + '(' + $scope.rec.invoice_code + ')';
                else
                    $scope.$root.model_code = $scope.rec.invoice_code;
            }

            $scope.$root.breadcrumbs.push({ 'name': $scope.$root.model_code, 'url': '#', 'isActive': false }); //, { 'name': 'Shipping', 'url': '#', 'isActive': false }
        }
    }

    $scope.list_order = true;

    $scope.openSaleOrderLink = function(record) {
        var mainRecord = record;
        var record = mainRecord.record;
        var index = mainRecord.index;
        var url;
        url = $state.href("app.viewOrder", ({ id: record.id })); //app.viewOrder({id:SaleOrder.id})
        window.open(url, '_blank');
    }

    $scope.openSaleInvoiceLink = function(record) {
        var mainRecord = record;
        var record = mainRecord.record;
        var index = mainRecord.index;
        var url;
        url = $state.href("app.viewOrder", ({ id: record.id, isInvoice: 1 })); //app.viewOrder({id:SaleOrder.id})
        window.open(url, '_blank');
    }

    $scope.searchKeywordSaleOrder = {};
    $scope.selectedSaleOrders = '';
    $scope.tableDataSO = [];

    $scope.show_list_order = function() {
        $scope.searchKeywordSaleOrder = {};
        $scope.selectSaleOrders();
    }

    $scope.selectSaleOrders = function(item_paging, sort_column, sortform) {

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;

        if (item_paging == 1)
            $scope.item_paging.spage = 1

        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.searchKeyword = $scope.searchKeywordSaleOrder;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeywordSaleOrder = {};
            $scope.record_data = {};
        }

        if ((sort_column != undefined) && (sort_column != null)) {
            //sort by column
            $scope.postData.sort_column = sort_column;
            $scope.postData.sortform = sortform;

            $rootScope.sortform = sortform;
            $rootScope.reversee = ('desc' === $scope.sortform) ? !$scope.reversee : false;
            $rootScope.sort_column = sort_column;

            $rootScope.save_single_value($rootScope.sort_column, 'sale_invioce_code');
        }

        var saleOrderListingApi = $scope.$root.pr + "srm/srminvoice/getSalesOrderforPO";

        $scope.showLoader = true;
        $http
            .post(saleOrderListingApi, $scope.postData)
            .then(function(res) {
                $scope.tableDataSO = res;
                $scope.columns = [];
                $scope.record_data = {};
                $scope.recordArray = [];
                $scope.tempSOList = [];

                if (res.data.ack == true) {
                    //console.log(res.data);
                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.record_data = res.data.response;
                    $scope.tempSOList = res.data;

                    angular.forEach($scope.record_data.tbl_meta_data.response.colMeta, function(obj, index) {
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    });

                    angular.forEach(res.data.response, function(value, key) {
                        if (key != "tbl_meta_data") {
                            $scope.recordArray.push(value);
                        }
                    });

                    if ($scope.tempSOList.response)
                        angular.element('#_saleOrdersModal').modal({ show: true });

                } else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
                $scope.showLoader = false;
            });
    }

    $scope.clearPendingSaleOrder = function() {
        angular.element('#_saleOrdersModal').modal('hide');
    }

    $scope.addSaleOrder = function() {
        var selSaleOrdersList = [];

        angular.forEach($scope.selectedSaleOrderModal, function(obj) {
            selSaleOrdersList.push(obj.record);
        });

        $scope.selectedSaleOrderArr = [];
        $scope.selectedSaleOrders = "";

        angular.forEach(selSaleOrdersList, function(recData) {
            $scope.selectedSaleOrderArr.push(recData);

            if ($scope.selectedSaleOrders == "")
                $scope.selectedSaleOrders = recData.sale_order_code;
            else
                $scope.selectedSaleOrders = $scope.selectedSaleOrders + '; ' + recData.sale_order_code;
        });

        angular.element('#_saleOrdersModal').modal('hide');
    }

    //////////////////////////////////////////////////////////////////////////////////

    $scope.showlistPOorder = function() {

        var invoice_id = 0;

        if ($stateParams.id > 0)
            invoice_id = $stateParams.id;
        else
            invoice_id = $scope.rec.id;

        $scope.showLoader = true;
        $scope.filterPurchaseOrder = {};
        $scope.PurchaseOrderArr = [];
        var prodApi = $scope.$root.sales + "crm/crm/get-purchase-order";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
            'type': 2,
            'invoice_id': invoice_id
        };

        $scope.selectedAllPurchaseOrder = false;

        if ($scope.PurchaseOrderArr.length > 0) {
            angular.forEach($scope.PurchaseOrderArr, function(obj2) {
                obj2.chk = false;

                angular.forEach($scope.selectedPurchaseOrderArr, function(obj) {
                    if (obj.id == obj2.id)
                        obj2.chk = true;
                });
            });

            $scope.showLoader = false;
            angular.element('#_PurchaseOrdersModal').modal({ show: true });
        } else {
            $http
                .post(prodApi, postData)
                .then(function(res) {
                    $scope.showLoader = false;

                    if (res.data.ack == true) {

                        $scope.PurchaseOrderArr = res.data.response;
                        //console.log($scope.PurchaseOrderArr);

                        for (var i = 0; i < $scope.PurchaseOrderArr.length; i++) {
                            if ($scope.PurchaseOrderArr[i].chk) {
                                // $scope.PurchaseOrderArr[i].disableCheck = 1;
                            }
                        }

                        angular.forEach($scope.PurchaseOrderArr, function(obj2) {
                            obj2.chk = false;

                            angular.forEach($scope.selectedPurchaseOrdersIDs, function(obj) {

                                if (obj == obj2.id)
                                    obj2.chk = true;
                            });
                        });

                        angular.element('#_PurchaseOrdersModal').modal({ show: true });
                    } else
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(389));
                });
        }
    }

    $scope.selectShippingPO = function(rec) {
        // console.log(rec);
        $scope.rec.selectedShippingPO = rec.order_code;
        $scope.rec.selectedShippingPOid = rec.id;

        angular.element('#_PurchaseOrdersModal').modal('hide');
    }

    $scope.removeLinkedPO = function() {
        $scope.rec.selectedShippingPO = '';
        $scope.rec.selectedShippingPOid = 0;

        angular.element('#_PurchaseOrdersModal').modal('hide');
        toaster.pop('success', 'Success', 'Linked PO Removed Successfully');
    }
    $scope.disableShippingPOLink = false;

    $scope.changeshippingPONotReq = function(mode) {

        // console.log(mode);

        if (mode == 1) {
            $scope.rec.selectedShippingPO = '';
            $scope.rec.selectedShippingPOid = 0;
            $scope.disableShippingPOLink = true;
        } else
            $scope.disableShippingPOLink = false;
    }

    /////////////////////////////////////////////////////

    angular.element(document).on('click', '#checkAll', function() {
        if (angular.element('#checkAll').is(':checked') == true) {
            for (var i = 0; i < $scope.items.length; i++) {
                $scope.items[i].chk = true;
            }
        } else {
            for (var i = 0; i < $scope.items.length; i++) {
                $scope.items[i].chk = false;
            }
        }
        $scope.$root.$apply(function() {
            $scope.items;
        })
    });

    $scope.IsVisible = true;
    $scope.show_view_data = function(classname) {
        $scope.IsVisible = $scope.IsVisible ? false : true;
    }

    $scope.check_number = function() {
        // var id = this.rec.supp_order_no.value;
        var id = document.getElementById('supp_order_no').value;

        var Url = $scope.$root.pr + "srm/srminvoice/get-invoice-number";
        $http
            .post(Url, { 'id': id, 'token': $scope.$root.token })
            .then(function(res) {
                if (res.data.ack == false) {
                    toaster.pop('error', 'Info', 'Already Exists !');

                    angular.element('.pic_block').attr("disabled", true);
                } else angular.element('.pic_block').attr("disabled", false);
            }).catch(function(message) {
                $scope.showLoader = false;

                throw new Error(message.data);
            });
    }

    $scope.submit_show_invoicee = true;

    // Customer Module

    $scope.customers = [];

    $scope.getlinkToCUST = function() {

        $scope.columns = [];
        $scope.tempCustomerArr = [];
        $scope.customerListing = {};
        $scope.customerListing.token = $rootScope.token;
        $scope.searchKeywords6 = {};

        $scope.showLoader = true;

        var customerListingApi = $scope.$root.reports + "module/customer-data-for-report";
        $http
            .post(customerListingApi, $scope.customerListing)
            .then(function(res) {
                $scope.showLoader = false;

                if (res.data.ack == true) {
                    // $scope.tempCustomerArr = res.data.response;

                    angular.forEach(res.data.response, function(obj) {
                        if (obj.id > 0)
                            $scope.tempCustomerArr.push(obj);
                    });

                    angular.forEach(res.data.response[0], function(val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    if ($scope.tempCustomerArr[0].id)
                        angular.element('#_customerModal').modal({ show: true });
                } else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
            });
    }

    $scope.clearCustomers = function() {
        angular.element('#_customerModal').modal('hide');
    }

    $scope.addCustomers = function(recData) {

        angular.forEach($scope.tempCustomerArr, function(obj) {

            if (obj.id == recData.id) {
                $scope.rec.linktoCustName = recData.name;
                $scope.rec.linktoCustID = recData.id;
            }
        });

        angular.element('#_customerModal').modal('hide');
    }

    $scope.getPriceOffers = function(type, ChkPurchasePrice, getPriceOffersCount) {
        // for Item Recomended Purchase Price

        if ($scope.rec.order_date != undefined)
            var orderDate = $scope.rec.order_date;
        else
            var orderDate = $scope.$root.get_current_date();

        var itemArray = [];

        if (ChkPurchasePrice > 0) {

            var getpricePurchasePriceUrl = $scope.$root.stock + "products-listing/get-recomended-purchase-price";
            $scope.pricePurchasePriceArr = [];

            if (getPriceOffersCount == undefined) getPriceOffersCount = $rootScope.maxHttpRepeatCount;
            $http
                .post(getpricePurchasePriceUrl, { 'token': $scope.$root.token, 'orderDate': orderDate })
                .then(function(res) {

                    if (res.data.ack == true) {
                        $scope.pricePurchasePriceArr = res.data.response;
                    }

                    // for Supplier Price Offer
                    var getpriceOffersUrl = $scope.$root.sales + "crm/crm/get-items-price-offers-by-custid";
                    $scope.price_offer_arr = [];
                    $http
                        .post(getpriceOffersUrl, { 'token': $scope.$root.token, 'srm_id': $scope.rec.sell_to_cust_id, 'order_date': orderDate })
                        .then(function(res) {
                            if (res.data.ack == true) {
                                $scope.price_offer_arr = res.data.response;

                                if (type == 1) {

                                    angular.forEach($scope.items, function(obja, index) {

                                        if (obja.item_type == 0) {

                                            var item2 = $filter("filter")($scope.pricePurchasePriceArr, { product_id: obja.id });

                                            var idx2 = $scope.pricePurchasePriceArr.indexOf(item2[0]);
                                            if (idx2 != -1) {

                                                if (Number($scope.items[index].standard_price) != Number(item2[0].standard_price)) {
                                                    $scope.items[index].standard_price = item2[0].standard_price;

                                                    var rec = $scope.items[index];
                                                    rec.type = 1;
                                                    itemArray.push(rec);
                                                }
                                            }
                                        }
                                    });

                                    angular.forEach($scope.items, function(obja, index) {

                                        if (obja.item_type == 0) {

                                            var item2 = $filter("filter")($scope.price_offer_arr, { item_id: obja.id });

                                            var idx2 = $scope.price_offer_arr.indexOf(item2[0]);
                                            if (idx2 != -1) {

                                                var flg = 0;

                                                if ($scope.items[index].qty && $scope.items[index].arr_volume_discounts) {
                                                    angular.forEach($scope.items[index].arr_volume_discounts, function(obj) {
                                                        if (Number($scope.items[index].qty) >= Number(obj.min_qty)) {
                                                            flg = 1;

                                                            if (obj.discount_type == 1) // %
                                                                var updatedPrice = parseFloat($scope.items[index].price_offer) - parseFloat($scope.items[index].price_offer) * (parseFloat(obj.volume_discount) / 100);
                                                            else // value
                                                                var updatedPrice = parseFloat($scope.items[index].price_offer) - parseFloat(obj.volume_discount);

                                                            if (Number($scope.items[index].standard_price) != Number(updatedPrice)) {
                                                                $scope.items[index].standard_price = updatedPrice;

                                                                var item3 = $filter("filter")(itemArray, { id: obj.item_id });

                                                                if (item3.length > 0) {

                                                                    angular.forEach(itemArray, function(rec) {
                                                                        if (rec.id == obja.id)
                                                                            rec.type = 2;
                                                                    });

                                                                } else if (item3.length == 0) {
                                                                    var rec = $scope.items[index];
                                                                    rec.type = 2;
                                                                    itemArray.push(rec);
                                                                }
                                                            }
                                                        }
                                                    });
                                                }

                                                if (!flg && Number($scope.items[index].standard_price) != Number(item2[0].price_offer)) {
                                                    $scope.items[index].standard_price = item2[0].price_offer;

                                                    var item3 = $filter("filter")(itemArray, { id: obja.id });

                                                    if (item3.length > 0) {

                                                        angular.forEach(itemArray, function(rec) {
                                                            if (rec.id == obja.id)
                                                                rec.type = 2;
                                                        });

                                                    } else if (item3.length == 0) {
                                                        var rec = $scope.items[index];
                                                        rec.type = 2;
                                                        itemArray.push(rec);
                                                    }
                                                }
                                            }
                                        }
                                    });
                                } else {
                                    angular.forEach($scope.items, function(obja, index) {

                                        if (obja.item_type == 0) {

                                            var item2 = $filter("filter")($scope.price_offer_arr, { item_id: obja.id });

                                            var idx2 = $scope.price_offer_arr.indexOf(item2[0]);
                                            if (idx2 != -1) {

                                                var flg = 0;

                                                if ($scope.items[index].qty && $scope.items[index].arr_volume_discounts) {
                                                    angular.forEach($scope.items[index].arr_volume_discounts, function(obj) {
                                                        if (Number($scope.items[index].qty) >= Number(obj.min_qty)) {
                                                            flg = 1;

                                                            if (obj.discount_type == 1) // %
                                                                var updatedPrice = parseFloat($scope.items[index].price_offer) - parseFloat($scope.items[index].price_offer) * (parseFloat(obj.volume_discount) / 100);
                                                            else // value
                                                                var updatedPrice = parseFloat($scope.items[index].price_offer) - parseFloat(obj.volume_discount);

                                                            if (Number($scope.items[index].standard_price) != Number(updatedPrice)) {
                                                                $scope.items[index].standard_price = updatedPrice;

                                                                var item3 = $filter("filter")(itemArray, { id: obj.item_id });

                                                                if (item3.length > 0) {

                                                                    angular.forEach(itemArray, function(rec) {
                                                                        if (rec.id == obja.id)
                                                                            rec.type = 2;
                                                                    });

                                                                } else if (item3.length == 0) {
                                                                    var rec = $scope.items[index];
                                                                    rec.type = 2;
                                                                    itemArray.push(rec);
                                                                }
                                                            }
                                                        }
                                                    });
                                                }

                                                if (!flg && Number($scope.items[index].standard_price) != Number(item2[0].price_offer)) {
                                                    $scope.items[index].standard_price = item2[0].price_offer;

                                                    var item3 = $filter("filter")(itemArray, { id: obja.id });

                                                    if (item3.length > 0) {

                                                        angular.forEach(itemArray, function(rec) {
                                                            if (rec.id == obja.id)
                                                                rec.type = 2;
                                                        });

                                                    } else if (item3.length == 0) {
                                                        var rec = $scope.items[index];
                                                        rec.type = 2;
                                                        itemArray.push(rec);
                                                    }
                                                    // itemArray.push($scope.items[index]);
                                                }
                                            }
                                        }
                                    });
                                }

                                angular.forEach(itemArray, function(obj2) {
                                    /* toaster.pop('warning', 'Info', 'Standard price changed to ' + (String(obj2.standard_price)) + ' for item ' + obj2.product_code); */

                                    if (obj2.type == 2)

                                        toaster.pop('warning', 'Info', 'Unit Price for item ' + obj2.product_code + ' has changed to ' +
                                        $rootScope.defaultCurrencyCode + ' ' + (parseFloat(obj2.standard_price).toFixed(3)) + ' (Supplier Specific Price) following date change.'); //String(obj2.standard_price)

                                    else
                                        toaster.pop('warning', 'Info', 'Unit Price for item ' + obj2.product_code + ' has changed to ' +
                                            $rootScope.defaultCurrencyCode + ' ' + (parseFloat(obj2.standard_price).toFixed(3)) + ' (Standard Price) following date change.');

                                });
                            } else {
                                if (type == 1) {

                                    angular.forEach($scope.items, function(obja, index) {

                                        if (obja.item_type == 0) {

                                            var item2 = $filter("filter")($scope.pricePurchasePriceArr, { product_id: obja.id });

                                            var idx2 = $scope.pricePurchasePriceArr.indexOf(item2[0]);
                                            if (idx2 != -1) {

                                                if (Number($scope.items[index].standard_price) != Number(item2[0].standard_price)) {
                                                    $scope.items[index].standard_price = item2[0].standard_price;

                                                    itemArray.push($scope.items[index]);
                                                }
                                            }
                                        }
                                    });

                                    angular.forEach(itemArray, function(obj2) {

                                        toaster.pop('warning', 'Info', 'Unit Price for item ' + obj2.product_code + ' has changed to ' +
                                            (String($scope.rec.currency_id.code)) + ' ' + (parseFloat(obj2.standard_price).toFixed(3)) + ' (Standard Price) following date change.');
                                    });
                                }
                            }
                        });
                }).catch(function(e) {
                    if (getPriceOffersCount != 0) return $scope.getPriceOffers(type, ChkPurchasePrice, getPriceOffersCount - 1);

                    $scope.showLoader = false;

                    throw new Error(e.data);
                });
        }
    }

    $scope.updateReceiptDateChk = function(getReceiptDateChkCount) {

        $scope.showLoader = true;

        if ($stateParams.id > 0)
            var invoice_id = $stateParams.id;
        else
            var invoice_id = $scope.rec.id;

        var updateReceiptDateAlloc = 0;

        angular.forEach($scope.items, function(obja, index) {

            if (obja.item_type == 0 && parseFloat(obja.qtyItemAllocated) > 0)
                updateReceiptDateAlloc++;
        });

        if (updateReceiptDateAlloc > 0) {

            if ($scope.rec.receiptDate)
                var receiptDate = $scope.rec.receiptDate;
            else
                var receiptDate = 0; //$scope.$root.get_current_date();

            var updateReceiptDateUrl = $scope.$root.stock + "products-listing/update-receipt-date-chk";

            if (getReceiptDateChkCount == undefined) getReceiptDateChkCount = $rootScope.maxHttpRepeatCount;

            $http
                .post(updateReceiptDateUrl, { 'token': $scope.$root.token, 'receiptDate': receiptDate, 'invoice_id': invoice_id })
                .then(function(res) {
                    $scope.showLoader = false;

                    if (res.data.ack == true) {
                        toaster.pop('warning', 'Info', 'Since Receipt Date has been changed, Date Received for Items allocation has also been changed.');
                    }

                }).catch(function(e) {
                    if (getReceiptDateChkCount != 0) return $scope.updateReceiptDateChk(param, getReceiptDateChkCount - 1);
                    $scope.showLoader = false;
                    throw new Error(e.data);
                });
        } else {
            $scope.showLoader = false;
        }
    }
};

SrmOrderTabController.$inject = ["$scope", "$filter", "Upload", "$resource", "$http", "ngDialog", "$stateParams", "toaster", "$state", "$rootScope", "$timeout", "ModalService", "$q", "generatePdf"];
myApp.controller('SrmOrderTabController', SrmOrderTabController);

function SrmOrderTabController($scope, $filter, Upload, $resource, $http, ngDialog, $stateParams, toaster, $state, $rootScope, $timeout, ModalService, $q, generatePdf) {

    if ($stateParams.id > 0)
        $scope.check_srm_readonly = true;

    $scope.orderDispatchedStatus = false;
    $scope.show_recieve_list = false;
    $scope.showReceiveStuff = false;
    $scope.$emit('showReceiveStuff', $scope.showReceiveStuff);

    $scope.showEditForm = function() {
        $scope.check_srm_readonly = false;
        //$scope.perreadonly = true;

        // it will unlock all purchase order status.
        // $scope.show_recieve_list = false;
        $scope.show_recieve_list_anchor = true;
        $scope.show_recieve_list_anchor_allocate = false;
    }

    $scope.submit_show_invoicee = true;
    $scope.arrItems = [{ 'label': 'Please select type', 'value': 3 }, { 'label': 'Item', 'value': 0 }, { 'label': 'G/L Account', 'value': 1 }, { 'label': 'Item Additional cost', 'value': 2 }];


    /* {  'label': 'Services',  'value': 2 },*/

    $scope.arr_discount_type = [{ 'name': '', 'id': "None" }, { 'name': 'Value', 'id': "Value" }, { 'name': 'Percentage', 'id': "Percentage" }, { 'name': 'Unit', 'id': "Unit" }];

    $scope.default_currency_code = $rootScope.defaultCurrencyCode;
    $scope.company_name = $rootScope.company_name;
    $scope.currency_code = '';
    $scope.products = [];
    $scope.items = [];
    $scope.arr_categories = {};
    $scope.recs = {};

    $scope.title = 'Purchase Order';
    $scope.btnCancelUrl = 'app.srmorder';
    $scope.btnInvoiceCancelUrl = 'app.srminvoice';

    $scope.search_data = '';
    var drpCat = null;

    $scope.updateReceiptDateChk = function(param, getReceiptDateChkCount) {

        $scope.showLoader = true;

        if ($stateParams.id > 0)
            var invoice_id = $stateParams.id;
        else
            var invoice_id = $scope.rec.id;

        var updateReceiptDateAlloc = 0;

        angular.forEach($scope.items, function(obja, index) {

            if (obja.item_type == 0 && parseFloat(obja.qtyItemAllocated) > 0)
                updateReceiptDateAlloc++;
        });

        if (updateReceiptDateAlloc > 0) {

            if ($scope.rec.receiptDate)
                var receiptDate = $scope.rec.receiptDate;
            else
                var receiptDate = 0; //$scope.$root.get_current_date();

            var updateReceiptDateUrl = $scope.$root.stock + "products-listing/update-receipt-date-chk";

            if (getReceiptDateChkCount == undefined) getReceiptDateChkCount = $rootScope.maxHttpRepeatCount;

            $http
                .post(updateReceiptDateUrl, { 'token': $scope.$root.token, 'receiptDate': receiptDate, 'invoice_id': invoice_id })
                .then(function(res) {

                    if (param != 1)
                        $scope.showLoader = false;

                    if (res.data.ack == true) {
                        toaster.pop('warning', 'Info', 'Since Receipt Date has been changed, Date Received for Items allocation has also been changed.');
                    }

                }).catch(function(e) {
                    if (getReceiptDateChkCount != 0) return $scope.updateReceiptDateChk(param, getReceiptDateChkCount - 1);
                    $scope.showLoader = false;
                    throw new Error(e.data);
                });
        }
    }

    $scope.getProducts = function(recs, parm) {
        var cat_id = '';

        if (parm != '') {
            $scope.postData = { 'all': "1", 'token': $scope.$root.token, 'suppler_id': $scope.rec.sell_to_cust_id };
            recs.category = '';
            recs.search_data = '';
        } else {
            cat_id = recs.category != null ? recs.category.id : '';
            $scope.search_data = recs.search_data;
            $scope.postData = {
                'search_string': $scope.search_data,
                'category_id': cat_id,
                'suppler_id': $scope.rec.sell_to_cust_id,
                'all': "1",
                'token': $scope.$root.token
            };
        }

        $scope.record = {};
        var order_date = angular.element('#offer_date').val();
        $scope.postData.order_date = order_date;

        var prodApi = $scope.$root.sales + "stock/products-listing/get-purchased-products-supplier-price-popup";
        $http
            .post(prodApi, $scope.postData)
            .then(function(res) {
                $scope.products = [];
                if (res.data.ack == true) {
                    angular.forEach(res.data.response, function(obj, index) {
                        obj.chk = false;
                        $scope.products[index] = obj;
                    });
                } else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            }).catch(function(message) {
                $scope.showLoader = false;

                throw new Error(message.data);
            });
    }

    $scope.getServicepop = function(recs, parm) {
        var cat_id = '';
        if (parm != '') {
            $scope.postData = { 'all': "1", 'token': $scope.$root.token };
            recs.category = '';
            recs.search_data = '';
        } else {
            cat_id = recs.category != null ? recs.category.id : '';
            $scope.search_data = recs.search_data;
            $scope.postData = {
                'search_string': $scope.search_data,
                'category_id': cat_id,
                'all': "1",
                'token': $scope.$root.token
            };
        }

        $scope.record = {};
        var prodApi = $scope.$root.setup + "service/products-listing/get-products-popup";
        $http
            .post(prodApi, $scope.postData)
            .then(function(res) {
                if (res.data.ack == true) {
                    $scope.products = [];
                    angular.forEach(res.data.response, function(obj, index) {
                        obj.chk = false;
                        $scope.products[index] = obj;
                    });
                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            }).catch(function(message) {
                $scope.showLoader = false;

                throw new Error(message.data);
            });
    }


    angular.element(document).on('click', '#checkAll_price', function() {
        if (angular.element('#checkAll_price').is(':checked') == true) {
            for (var i = 0; i < $scope.products.length; i++) {
                $scope.products[i].chk = true;
            }
        } else {
            for (var i = 0; i < $scope.products.length; i++) {
                $scope.products[i].chk = false;
            }
        }
        $scope.$root.$apply(function() {
            $scope.products;
        })
    });

    $scope.checkAll = function() {
        var bool = angular.element("#selecctall").is(':checked');
        var i = 0;
        angular.forEach($scope.products, function(item) {
            $scope.products[i].chk = bool;
            i++;
        });
    }

    $scope.arrSpread = {};
    $scope.arrSpread = [{ 'id': '1', 'name': 'Weighted Average' }, { 'id': '2', 'name': 'Equal' }, { 'id': '3', 'name': 'Custom' }];

    $scope.applySpread = function(selSpread, Amount) {

        if (selSpread != undefined) {

            if (selSpread.id == 1) {

                var countQty = 0;
                var emptyQty = 0;

                angular.forEach($scope.itemAddCostPurchaseOrder, function(obj) {

                    if (obj.chk == true) {
                        if (parseInt(obj.qty) > 0) {
                            countQty = parseInt(countQty) + parseInt(obj.qty);
                        } else {
                            emptyQty++;
                        }
                    }
                });

                if (emptyQty > 0) {
                    toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Quantity']));
                    return false;
                }

                var totalCalAmount = parseFloat(Amount) / countQty;

                var ttlAdditionAmount = 0;
                var totalCalAmountFixed = parseFloat(totalCalAmount);

                angular.forEach($scope.itemAddCostPurchaseOrder, function(obj) {

                    if (obj.chk == true) {

                        var calcAmount = parseFloat(totalCalAmountFixed) * obj.qty;
                        var additionAmount = parseFloat(calcAmount) / obj.qty;

                        obj.calcAmount = parseFloat(calcAmount);
                        obj.calcAmount2 = parseFloat(calcAmount).toFixed(4);
                        obj.additionAmount = parseFloat(additionAmount);
                        obj.additionAmount2 = parseFloat(additionAmount).toFixed(4);

                        ttlAdditionAmount = parseFloat(ttlAdditionAmount) + parseFloat(obj.calcAmount);
                    } else {
                        obj.calcAmount = '';
                        obj.additionAmount = '';

                        obj.calcAmount2 = '';
                        obj.additionAmount2 = '';
                    }
                });

                $scope.formData.allocatedAdditionalCost = parseFloat(ttlAdditionAmount);
                $scope.formData.remainingAdditionalCost = parseFloat($scope.formData.additionalCost) - parseFloat(ttlAdditionAmount);
            } else if (selSpread.id == 2) {

                var countRec = 0;
                var emptyQty = 0;

                angular.forEach($scope.itemAddCostPurchaseOrder, function(obj) {

                    if (obj.chk == true) {
                        if (parseInt(obj.qty) > 0) {
                            countRec++;
                        } else {
                            emptyQty++;
                        }
                    }
                });

                if (emptyQty > 0) {
                    toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Quantity']));
                    return false;
                }

                var totalCalAmount = parseFloat(Amount) / countRec;

                var ttlAdditionAmount = 0;

                angular.forEach($scope.itemAddCostPurchaseOrder, function(obj) {

                    if (obj.chk == true) {

                        obj.calcAmount = parseFloat(totalCalAmount);
                        obj.calcAmount2 = parseFloat(totalCalAmount).toFixed(2);

                        var additionAmount = parseFloat(totalCalAmount) / obj.qty;

                        obj.additionAmount = parseFloat(additionAmount);
                        obj.additionAmount2 = parseFloat(additionAmount).toFixed(2);

                        ttlAdditionAmount = parseFloat(ttlAdditionAmount) + parseFloat(obj.calcAmount);
                    } else {
                        obj.calcAmount = '';
                        obj.additionAmount = '';

                        obj.calcAmount2 = '';
                        obj.additionAmount2 = '';
                    }
                });

                $scope.formData.allocatedAdditionalCost = ttlAdditionAmount;
                $scope.formData.remainingAdditionalCost = parseFloat($scope.formData.additionalCost).toFixed(2) - parseFloat(ttlAdditionAmount).toFixed(2);

            } else if (selSpread.id == 3) {

                var ttlAdditionAmount = 0;

                angular.forEach($scope.itemAddCostPurchaseOrder, function(obj) {

                    if (obj.chk == true) {
                        obj.calcAmount = 0;
                        obj.additionAmount = 0;

                        obj.calcAmount2 = 0;
                        obj.additionAmount2 = 0;
                    } else {
                        obj.calcAmount = '';
                        obj.additionAmount = '';

                        obj.calcAmount2 = '';
                        obj.additionAmount2 = '';
                    }

                    if (obj.calcAmount != undefined && obj.calcAmount != '')
                        ttlAdditionAmount = parseFloat(ttlAdditionAmount) + parseFloat(obj.calcAmount);
                });

                $scope.formData.allocatedAdditionalCost = parseFloat(ttlAdditionAmount).toFixed(2);

                var remAdditionalCost = parseFloat($scope.formData.additionalCost) - parseFloat(ttlAdditionAmount);
                $scope.formData.remainingAdditionalCost = parseFloat(remAdditionalCost).toFixed(2);

            }
        } else {
            toaster.pop('warning', 'info', $scope.$root.getErrorMessageByCode(230, ['Spread']));
        }
    }

    $scope.clearAdditionalCostFilter = function() {

        if ($scope.rec.purchaseStatus != 3) {
            angular.forEach($scope.itemAddCostPurchaseOrder, function(obj) {
                obj.chk = false;
            });
        }

        $scope.additionalCostSearch = {};
    }

    $scope.checkIfAllChecked = function() {
        if ($scope.itemAddCostPurchaseOrderFiltered) {
            var temp = $scope.itemAddCostPurchaseOrderFiltered.filter(function(obj) {
                return obj.chk == true;
            });

            if ($scope.itemAddCostPurchaseOrderFiltered.length == temp.length) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    $scope.checkedItemAddCostPurchaseOrder = function(rec) {
        $scope.selectedAllItemAddCostPurchaseOrder = false;

        var ttlAdditionAmount = 0;

        angular.forEach($scope.itemAddCostPurchaseOrder, function(obj) {

            if (rec.allocationRecID == obj.allocationRecID) {
                obj.calcAmount = '';
                obj.additionAmount = '';

                obj.calcAmount2 = '';
                obj.additionAmount2 = '';
            }

            if (obj.calcAmount != undefined && obj.calcAmount != '')
                ttlAdditionAmount = parseFloat(ttlAdditionAmount) + parseFloat(obj.calcAmount);
        });

        $scope.formData.allocatedAdditionalCost = parseFloat(ttlAdditionAmount).toFixed(2);

        var remAdditionalCost = parseFloat($scope.formData.additionalCost) - parseFloat(ttlAdditionAmount);
        $scope.formData.remainingAdditionalCost = parseFloat(remAdditionalCost).toFixed(2);
    }

    $scope.checkAllItemAddCostPurchaseOrder = function(selectedAll) {

        if (selectedAll == true) {

            angular.forEach($scope.itemAddCostPurchaseOrderFiltered, function(obj) {
                if (!(obj.postedChk > 0))
                    obj.chk = true;
            });
        } else {
            angular.forEach($scope.itemAddCostPurchaseOrderFiltered, function(obj) {
                obj.chk = false;
            });
        }
    }

    $scope.category_list_final = {};
    $scope.category_sub = {};
    $scope.category_list_data_one = {};
    $scope.category_list_data_second = {};
    $scope.category_list_data_third = {};
    $scope.searchKeyword_sup_item = {};
    $scope.searchKeyword_sup_gl_code = {};

    $scope.openDocumentLink = function() { // getSupplierPrice

        var url = $state.href("app.edit-supplier", ({ 'id': $scope.rec.sell_to_cust_id, 'isPriceOffer': 1 }));
        window.open(url, '_blank');

        // $state.goNewTab("app.edit-supplier", { 'id' : $scope.rec.sell_to_cust_id, 'isPriceOffer':1});

        // $state.go("app.edit-supplier",{id:$scope.rec.sell_to_cust_id, 'isPriceOffer':1});

    }

    $scope.searchKeywordItem = {};
    $scope.selectedRecFromModalsItem = [];

    $scope.moduleType = '';
    $scope.clearAndSearchItems = function() {
        $scope.searchKeywordItem = {};
        // $scope.searchKeywordItem = {};
        $scope.selectedRecFromModalsItem = [];

        $rootScope.updateSelectedGlobalData("uom");
        // $rootScope.updateSelectedGlobalData("item");

        $scope.selectOnlyItem();
    }

    $scope.tableDataItmList = [];
    $scope.tempProdArr = [];

    $scope.selectOnlyItem = function(item_paging, sort_column, sortform) {

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.moduleType = 'ItemDetail';

        // $scope.tempProdArr = [];
        // $scope.tempProdArr2 = []
        // $scope.tempProdArr2.response = [];

        if (item_paging == 1)
            $scope.item_paging.spage = 1

        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.searchKeyword = $scope.searchKeywordItem;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeywordItem = {};
            $scope.record_data = {};
        }

        if ((sort_column != undefined) && (sort_column != null)) {
            //sort by column
            $scope.postData.sort_column = sort_column;
            $scope.postData.sortform = sortform;

            $rootScope.sortform = sortform;
            $rootScope.reversee = ('desc' === $scope.sortform) ? !$scope.reversee : false;
            $rootScope.sort_column = sort_column;

            $rootScope.save_single_value($rootScope.sort_column, 'srmsort_name');
        }

        $scope.postData.cond = 'Detail';

        if ($scope.rec.order_date != undefined)
            $scope.postData.orderDate = $scope.rec.order_date;
        else
            $scope.postData.orderDate = $scope.$root.get_current_date();

        $scope.showLoader = true;

        if ($scope.rec.sell_to_cust_no == undefined || $scope.rec.sell_to_cust_no == null) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Supplier No.']));
            $scope.showLoader = false;
            return false;
        }

        $scope.postData.srm_id = $scope.rec.sell_to_cust_id;
        $scope.saverecord = 1;

        if (!($scope.rec.update_id > 0) || $rootScope.saveRecAfterAddSupp == 1) {
            $scope.showLoader = true;

            $scope.add_general($scope.rec)
                .then(function(resAA) {

                    $scope.item_type = 0;

                    if (resAA == 1) {

                        $scope.GetSalesOrderStages();

                        $rootScope.saveRecAfterAddSupp = 0;

                        if ($scope.item_type == 0) {

                            $scope.filterPurchaseItem = {};
                            var itemListingApi = $scope.$root.stock + "products-listing/item-details-price-qty";

                            $scope.showLoader = true;
                            $http
                                .post(itemListingApi, $scope.postData)
                                .then(function(res) {
                                    $scope.tableDataItmList = res;
                                    $scope.columns = [];
                                    $scope.record_data = {};
                                    $scope.recordArray = [];
                                    $scope.showLoader = false;
                                    // $scope.tempProdArr = [];
                                    $scope.PendingSelectedItems = [];

                                    if (res.data.ack == true) {
                                        $scope.total = res.data.total;
                                        $scope.item_paging.total_pages = res.data.total_pages;
                                        $scope.item_paging.cpage = res.data.cpage;
                                        $scope.item_paging.ppage = res.data.ppage;
                                        $scope.item_paging.npage = res.data.npage;
                                        $scope.item_paging.pages = res.data.pages;

                                        $scope.total_paging_record = res.data.total_paging_record;

                                        $scope.record_data = res.data.response;
                                        $scope.tempProdArr = res.data;

                                        angular.forEach($scope.tempProdArr, function(value, key) {
                                            if (key != "tbl_meta_data") {
                                                $scope.recordArray.push(value);
                                            }
                                        });

                                        for (var i = 0; i < $scope.tempProdArr.length; i++) {

                                            $scope.tempProdArr[i].chk = false;
                                            $scope.tempProdArr[i].calc_current_stock = Number($scope.tempProdArr[i].allocated_stock) + Number($scope.tempProdArr[i].available_stock);
                                        }

                                        angular.forEach($scope.tableDataItmList.data.response.tbl_meta_data.response.colMeta, function(obj, index) {
                                            if (obj.event && obj.event.name && obj.event.trigger) {
                                                obj.generatedEvent = $scope[obj.event.name];
                                            }
                                        });

                                        // if ($scope.tempProdArr[0].id)
                                        if ($scope.tempProdArr.response)
                                            angular.element('#productModal').modal({ show: true });

                                        // $scope.getPriceOffers(1, 1);

                                    } else {
                                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                                    }
                                });
                        }

                        $scope.rec.item_types = $scope.arrItems[0];
                    } else {
                        toaster.pop('error', 'info', resAA);
                        $scope.showLoader = false;
                        return false;
                    }
                });
        } else {
            $scope.item_type = 0;

            $scope.showLoader = true;

            if ($scope.item_type == 0) {

                $scope.filterPurchaseItem = {};

                // var itemListingApi = $scope.$root.reports + "module/item-data-for-report";
                var itemListingApi = $scope.$root.stock + "products-listing/item-details-price-qty";

                $scope.showLoader = true;
                $http
                    .post(itemListingApi, $scope.postData)
                    .then(function(res) {
                        $scope.tableDataItmList = res;
                        $scope.columns = [];
                        $scope.record_data = {};
                        $scope.recordArray = [];
                        $scope.showLoader = false;
                        $scope.PendingSelectedItems = [];

                        if (res.data.ack == true) {
                            $scope.total = res.data.total;
                            $scope.item_paging.total_pages = res.data.total_pages;
                            $scope.item_paging.cpage = res.data.cpage;
                            $scope.item_paging.ppage = res.data.ppage;
                            $scope.item_paging.npage = res.data.npage;
                            $scope.item_paging.pages = res.data.pages;

                            $scope.total_paging_record = res.data.total_paging_record;

                            $scope.record_data = res.data.response;
                            $scope.tempProdArr = res.data;

                            angular.forEach($scope.tempProdArr, function(value, key) {
                                if (key != "tbl_meta_data") {
                                    $scope.recordArray.push(value);
                                }
                            });

                            for (var i = 0; i < $scope.tempProdArr.length; i++) {

                                $scope.tempProdArr[i].chk = false;
                                $scope.tempProdArr[i].calc_current_stock = Number($scope.tempProdArr[i].allocated_stock) + Number($scope.tempProdArr[i].available_stock);
                            }
                            angular.forEach($scope.tableDataItmList.data.response.tbl_meta_data.response.colMeta, function(obj, index) {
                                if (obj.event && obj.event.name && obj.event.trigger) {
                                    obj.generatedEvent = $scope[obj.event.name];
                                }
                            });

                            if ($scope.tempProdArr.response)
                                angular.element('#productModal').modal({ show: true });

                            //  $scope.getPriceOffers(1, 1);

                        } else {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                        }
                    });
            }

            $scope.rec.item_types = $scope.arrItems[0];
        }
    }



    $scope.selectItem = function(drp, item_paging, rec) {

        $scope.showLoader = true;

        if ($scope.rec.sell_to_cust_no == undefined || $scope.rec.sell_to_cust_no == null) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Supplier No.']));
            $scope.showLoader = false;
            return false;
        }

        $scope.saverecord = 1;

        if (!($scope.rec.update_id > 0)) {
            $scope.showLoader = true;

            $scope.add_general($scope.rec)
                .then(function(resAA) {

                    if (drp == 4)
                        $scope.item_type = 0;
                    else if (drp == 6)
                        $scope.item_type = 1;
                    else
                        $scope.item_type = drp;

                    $scope.GetSalesOrderStages();

                    if ($scope.item_type == 0) {

                        $scope.filterPurchaseItem = {};

                        $rootScope.updateSelectedGlobalData("uom");
                        // $rootScope.updateSelectedGlobalData("item");

                        // var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";

                        $scope.tempProdArr = [];
                        angular.copy($rootScope.prooduct_arr, $scope.tempProdArr);

                        for (var i = 0; i < $scope.tempProdArr.length; i++) {

                            $scope.tempProdArr[i].chk = false;
                            $scope.tempProdArr[i].calc_current_stock = Number($scope.tempProdArr[i].allocated_stock) + Number($scope.tempProdArr[i].available_stock);
                        }
                        $scope.showLoader = false;
                        angular.element('#productModal').modal({ show: true });

                        // $scope.item_types = $scope.arrItems[0];
                        $scope.getPriceOffers(1, 1);


                    } else if ($scope.item_type == 1) {

                        $scope.title = 'G/L No.';
                        $scope.filterGL = {};
                        var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";

                        $scope.postData = {};
                        $scope.postData.token = $scope.$root.token;
                        $scope.postData.suppler_id = $scope.rec.sell_to_cust_id;

                        /* if (item_paging == 1)
                            $rootScope.item_paging.spage = 1;
                        $scope.postData.page = $rootScope.item_paging.spage;
                        $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;
                        $scope.postData.searchKeyword = "";
                        $scope.postData.searchKeyword = $scope.searchKeyword_sup_gl_code.$;

                        if ($scope.postData.pagination_limits == -1) {
                            $scope.postData.page = -1;
                            $scope.searchKeyword = {};
                            $scope.record_data = {};
                        } */

                        $http
                            .post(postUrl_cat, $scope.postData) //{'token': $scope.$root.token, 'display_id': 10},
                            .then(function(res) {

                                $scope.gl_account = [];
                                $scope.showLoader = false;

                                if (res.data.ack == true) {

                                    /* $scope.total = res.data.total;
                                    $scope.item_paging.total_pages = res.data.total_pages;
                                    $scope.item_paging.cpage = res.data.cpage;
                                    $scope.item_paging.ppage = res.data.ppage;
                                    $scope.item_paging.npage = res.data.npage;
                                    $scope.item_paging.pages = res.data.pages;
                                    $scope.total_paging_record = res.data.total_paging_record; */

                                    // $scope.record = res.data.response;
                                    // $scope.record_data = res.data.response;
                                    // $scope.category_list = res.data.response;

                                    angular.element('#accthead_modal').modal({ show: true });
                                    $scope.gl_account = res.data.response;
                                } else
                                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));


                            }).catch(function(message) {
                                $scope.showLoader = false;

                                throw new Error(message.data);
                            });


                    } else if ($scope.item_type == 2) {


                        $scope.addCostRec = {};
                        $scope.title = 'Item Additional Cost';

                        var addCostRecUrl = $scope.$root.stock + "products-listing/get-add-cost-list";
                        $http
                            .post(addCostRecUrl, { 'token': $scope.$root.token })
                            .then(function(res) {
                                $scope.showLoader = false;
                                if (res.data.ack == true) {
                                    $scope.addCostRec = res.data.response;

                                    for (var i = 0; i < $scope.addCostRec.length; i++) {
                                        if ($scope.addCostRec[i].chk)
                                            $scope.addCostRec[i].disableCheck = 1;
                                        else
                                            $scope.addCostRec[i].disableCheck = 0;

                                        angular.forEach($scope.items, function(obj) {

                                            if (obj.id == $scope.addCostRec[i].id && obj.item_type == 2) {
                                                $scope.addCostRec[i].chk = 1;
                                                $scope.addCostRec[i].disableCheck = 1;
                                            }
                                        });
                                        // $scope.addCostRec[i].chk = false;
                                    }

                                    angular.element('#listingAdditionalCostModal').modal({ show: true });
                                } else
                                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                            }).catch(function(message) {
                                $scope.showLoader = false;

                                throw new Error(message.data);
                            });
                    }

                    $scope.rec.item_types = $scope.arrItems[0];
                });
        } else {
            if (drp == 4)
                $scope.item_type = 0;
            else if (drp == 6)
                $scope.item_type = 1;
            else
                $scope.item_type = drp;
            //$scope.item_type = drp.value;

            $scope.showLoader = true;

            if ($scope.item_type == 0) {

                $scope.filterPurchaseItem = {};

                $rootScope.updateSelectedGlobalData("uom");
                // $rootScope.updateSelectedGlobalData("item");

                // var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";

                $scope.tempProdArr = [];
                angular.copy($rootScope.prooduct_arr, $scope.tempProdArr);

                for (var i = 0; i < $scope.tempProdArr.length; i++) {

                    $scope.tempProdArr[i].chk = false;
                    $scope.tempProdArr[i].calc_current_stock = Number($scope.tempProdArr[i].allocated_stock) + Number($scope.tempProdArr[i].available_stock);
                }

                $scope.showLoader = false;
                angular.element('#productModal').modal({ show: true });
                $scope.getPriceOffers(1, 1);

            } else if ($scope.item_type == 1) {

                $scope.title = 'G/L No.';
                $scope.filterGL = {};
                var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";

                $scope.postData = {};
                $scope.postData.token = $scope.$root.token;
                $scope.postData.suppler_id = $scope.rec.sell_to_cust_id;

                /* if (item_paging == 1)
                    $rootScope.item_paging.spage = 1;
                $scope.postData.page = $rootScope.item_paging.spage;
                $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;
                $scope.postData.searchKeyword = "";
                $scope.postData.searchKeyword = $scope.searchKeyword_sup_gl_code.$;

                if ($scope.postData.pagination_limits == -1) {
                    $scope.postData.page = -1;
                    $scope.searchKeyword = {};
                    $scope.record_data = {};
                } */

                $http
                    .post(postUrl_cat, $scope.postData) //{'token': $scope.$root.token, 'display_id': 10},
                    .then(function(res) {

                        $scope.gl_account = [];
                        $scope.showLoader = false;


                        if (res.data.ack == true) {

                            /* $scope.total = res.data.total;
                            $scope.item_paging.total_pages = res.data.total_pages;
                            $scope.item_paging.cpage = res.data.cpage;
                            $scope.item_paging.ppage = res.data.ppage;
                            $scope.item_paging.npage = res.data.npage;
                            $scope.item_paging.pages = res.data.pages;
                            $scope.total_paging_record = res.data.total_paging_record;

                            $scope.record = res.data.response;
                            $scope.record_data = res.data.response;
                            $scope.category_list = res.data.response; */

                            // $scope.showLoader = false;
                            angular.element('#accthead_modal').modal({ show: true });
                            $scope.gl_account = res.data.response;
                        } else
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                    }).catch(function(message) {
                        $scope.showLoader = false;

                        throw new Error(message.data);
                    });


            } else if ($scope.item_type == 2) {

                $scope.addCostRec = {};
                $scope.title = 'Item Additional Cost';

                var addCostRecUrl = $scope.$root.stock + "products-listing/get-add-cost-list";
                $http
                    .post(addCostRecUrl, { 'token': $scope.$root.token })
                    .then(function(res) {
                        $scope.showLoader = false;
                        if (res.data.ack == true) {
                            $scope.addCostRec = res.data.response;

                            for (var i = 0; i < $scope.addCostRec.length; i++) {
                                if ($scope.addCostRec[i].chk)
                                    $scope.addCostRec[i].disableCheck = 1;
                                else
                                    $scope.addCostRec[i].disableCheck = 0;

                                angular.forEach($scope.items, function(obj) {

                                    if (obj.id == $scope.addCostRec[i].id && obj.item_type == 2) {
                                        $scope.addCostRec[i].chk = 1;
                                        $scope.addCostRec[i].disableCheck = 1;
                                    }
                                });
                                // $scope.addCostRec[i].chk = false;
                            }

                            angular.element('#listingAdditionalCostModal').modal({ show: true });
                        } else
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                    }).catch(function(message) {
                        $scope.showLoader = false;

                        throw new Error(message.data);
                    });
            }

            $scope.rec.item_types = $scope.arrItems[0];
        }
    }

    $scope.PendingSelectedPurchaseItems = [];

    $scope.checkedPurchaseItem = function(priceitem) {
        $scope.selectedAllPurchaseItem = false;

        for (var i = 0; i < $scope.tempProdArr.length; i++) {

            if (priceitem == $scope.tempProdArr[i].id) {
                if ($scope.tempProdArr[i].chk == true)
                    $scope.tempProdArr[i].chk = false;
                else
                    $scope.tempProdArr[i].chk = true;
            }
        }
    }


    $scope.checkAllPurchaseItem = function(val, category, brand, unit) {
        var selection_filter = $filter('filter');
        var filtered = selection_filter($scope.tempProdArr, $scope.filterPurchaseItem.search);
        var filtered2 = selection_filter(filtered, category);
        var filtered3 = selection_filter(filtered2, brand);
        var filtered4 = selection_filter(filtered3, unit);
        $scope.PendingSelectedPurchaseItems = [];

        if (val == true) {
            angular.forEach(filtered4, function(obj) {

                obj.chk = false;

                if (category != undefined && category == obj.category_id && brand != undefined && brand == obj.brand_id && unit != undefined && unit == obj.unit_id) {
                    obj.chk = true;
                } else if (category != undefined && category == obj.category_id && brand != undefined && brand == obj.brand_id) {
                    obj.chk = true;
                } else if (category != undefined && category == obj.category_id && unit != undefined && unit == obj.unit_id) {
                    obj.chk = true;
                } else if (brand != undefined && brand == obj.brand_id && unit != undefined && unit == obj.unit_id) {
                    obj.chk = true;
                } else if (category != undefined && category == obj.category_id) {
                    obj.chk = true;
                } else if (brand != undefined && brand == obj.brand_id) {
                    obj.chk = true;
                } else if (unit != undefined && unit == obj.unit_id) {
                    obj.chk = true;
                } else if (category == undefined && brand == undefined && unit == undefined) {
                    obj.chk = true;
                }
                $scope.PendingSelectedPurchaseItems.push(obj);
            });
        } else {
            angular.forEach($scope.tempProdArr, function(obj) {
                if (!obj.disableCheck)
                    obj.chk = false;
            });
            $scope.PendingSelectedPurchaseItems = [];
        }
    }

    $scope.clearPendingPurchaseItems = function() {
        $scope.PendingSelectedPurchaseItems = [];
        angular.element('#productModal').modal('hide');
    }

    $scope.PendingSelectedAdditionalCost = [];

    $scope.checkedAdditionalCost = function(addCost) {
        $scope.selectedAllAdditionalCost = false;

        for (var i = 0; i < $scope.addCostRec.length; i++) {

            if (addCost == $scope.addCostRec[i].id) {
                if ($scope.addCostRec[i].chk == true)
                    $scope.addCostRec[i].chk = false;
                else
                    $scope.addCostRec[i].chk = true;
            }
        }
    }
    $scope.filterAddCost = {}
    $scope.checkAllAdditionalCost = function(val) {

        var selection_filter = $filter('filter');
        var filtered = selection_filter($scope.addCostRec, $scope.filterAddCost.search);

        $scope.PendingSelectedAdditionalCost = [];

        if (val == true) {
            angular.forEach(filtered, function(obj) {
                obj.chk = true;
                $scope.PendingSelectedAdditionalCost.push(obj);
            });
        } else {
            angular.forEach($scope.addCostRec, function(obj) {
                if (!obj.disableCheck)
                    obj.chk = false;
            });
            $scope.PendingSelectedAdditionalCost = [];
        }
    }

    $scope.clearPendingAdditionalCost = function() {
        $scope.PendingSelectedAdditionalCost = [];
        angular.element('#listingAdditionalCostModal').modal('hide');
    }

    $scope.PendingSelectedGLItems = [];

    $scope.checkedGL = function(glid) {

        for (var i = 0; i < $scope.gl_account.length; i++) {

            if (glid == $scope.gl_account[i].id) {
                if ($scope.gl_account[i].chk == true)
                    $scope.gl_account[i].chk = false;
                else
                    $scope.gl_account[i].chk = true;
            }
        }
    }

    $scope.checkAllGL = function(val, category, brand, unit) {
        $scope.PendingSelectedGLItems = [];

        if (val == true) {
            angular.forEach($scope.gl_account, function(obj) {
                if (obj.status > 0)
                    obj.chk = true;
                $scope.PendingSelectedGLItems.push(obj);
            });
        } else {
            angular.forEach($scope.gl_account, function(obj) {
                if (!obj.disableCheck)
                    obj.chk = false;
            });
            $scope.PendingSelectedGLItems = [];
        }
    }


    $scope.clearPendingGLitems = function() {
        $scope.PendingSelectedGLItems = [];
        angular.element('#accthead_modal').modal('hide');
    }

    var getPriceOffersCount;

    $scope.pricePurchasePriceArr = [];

    $scope.getPriceOffers = function(type, ChkPurchasePrice, getPriceOffersCount) // 1-> popup, 2-> order_items
        {
            // for Item Recomended Purchase Price

            if ($scope.rec.order_date != undefined)
                var orderDate = $scope.rec.order_date;
            else
                var orderDate = $scope.$root.get_current_date();

            if (ChkPurchasePrice > 0) {

                var getpricePurchasePriceUrl = $scope.$root.stock + "products-listing/get-recomended-purchase-price";
                // $scope.pricePurchasePriceArr = [];


                if (getPriceOffersCount == undefined) getPriceOffersCount = $rootScope.maxHttpRepeatCount;
                $http
                    .post(getpricePurchasePriceUrl, { 'token': $scope.$root.token, 'orderDate': orderDate })
                    .then(function(res) {

                        if (res.data.ack == true) {
                            $scope.pricePurchasePriceArr = res.data.response;

                            if (type == 1) {
                                var tempArr2 = [];
                                Object.keys($scope.tempProdArr.response).forEach(function(key) {
                                    if (key != "tbl_meta_data") {
                                        tempArr2.push($scope.tempProdArr.response[key]);
                                    }

                                });

                                angular.forEach($scope.pricePurchasePriceArr, function(obj) {

                                    var item = $filter("filter")(tempArr2, { id: obj.item_id }); //product_id

                                    var idx = tempArr2.indexOf(item[0]);
                                    if (idx != -1) {
                                        tempArr2[idx].standard_purchase_cost = obj.standard_price;
                                        tempArr2[idx].minPurchaseQty = obj.min_qty;
                                        tempArr2[idx].maxPurchaseQty = obj.max_qty;
                                    }

                                    var item2 = $filter("filter")($scope.items, { product_id: obj.product_id, item_type: 0 });
                                    var idx2 = $scope.items.indexOf(item2[0]);
                                    if (idx2 != -1) {
                                        $scope.items[idx2].standard_price = obj.standard_price;
                                    }

                                });
                                $scope.tempProdArr.response = tempArr2;
                            }
                        }

                        // for Supplier Price Offer
                        var getpriceOffersUrl = $scope.$root.sales + "crm/crm/get-items-price-offers-by-custid";
                        $scope.price_offer_arr = [];
                        $http
                            .post(getpriceOffersUrl, { 'token': $scope.$root.token, 'srm_id': $scope.rec.sell_to_cust_id, 'order_date': orderDate })
                            .then(function(res) {
                                if (res.data.ack == true) {
                                    $scope.price_offer_arr = res.data.response;

                                    var tempArr2 = [];
                                    Object.keys($scope.tempProdArr.response).forEach(function(key) {
                                        if (key != "tbl_meta_data") {
                                            tempArr2.push($scope.tempProdArr.response[key]);
                                        }

                                    });

                                    if (type == 1) {
                                        angular.forEach($scope.price_offer_arr, function(obj) {

                                            var item = $filter("filter")(tempArr2, { id: obj.item_id }); //product_id

                                            var idx = tempArr2.indexOf(item[0]);
                                            if (idx != -1) {
                                                tempArr2[idx].price_offer = obj.price_offer;
                                                tempArr2[idx].price_offer_id = obj.id;
                                                tempArr2[idx].minPurchaseQty = obj.minSaleQty;
                                                tempArr2[idx].maxPurchaseQty = obj.maxSaleQty;
                                                tempArr2[idx].arr_volume_discounts = obj.arr_volume_discounts;
                                            }

                                            var item2 = $filter("filter")($scope.items, { product_id: obj.item_id, item_type: 0 });
                                            var idx2 = $scope.items.indexOf(item2[0]);
                                            if (idx2 != -1) {
                                                $scope.items[idx2].standard_price = obj.price_offer;
                                            }
                                        });

                                        $scope.tempProdArr.response = tempArr2;
                                    } else {
                                        angular.forEach($scope.price_offer_arr, function(obj) {
                                            var item = $filter("filter")($scope.items, { id: obj.item_id });
                                            if (item.length > 0) {
                                                angular.forEach(item, function(obj1) {
                                                    var idx = $scope.items.indexOf(obj1);
                                                    if (idx != -1) {
                                                        $scope.items[idx].price_offer = obj.price_offer;
                                                        $scope.items[idx].price_offer_id = obj.id;
                                                        $scope.items[idx].minPurchaseQty = obj.minSaleQty;
                                                        $scope.items[idx].maxPurchaseQty = obj.maxSaleQty;
                                                        $scope.items[idx].arr_volume_discounts = obj.arr_volume_discounts;
                                                    }
                                                });

                                                var item2 = $filter("filter")($scope.items, { product_id: obj.item_id, item_type: 0 });
                                                var idx2 = $scope.items.indexOf(item2[0]);
                                                if (idx2 != -1) {
                                                    $scope.items[idx2].standard_price = obj.price_offer;
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                    }).catch(function(e) {
                        if (getPriceOffersCount != 0) return $scope.getPriceOffers(type, ChkPurchasePrice, getPriceOffersCount - 1);

                        $scope.showLoader = false;

                        throw new Error(e.data);
                    });
            } else {

                // for Supplier Price Offer
                var getpriceOffersUrl = $scope.$root.sales + "crm/crm/get-items-price-offers-by-custid";
                $scope.price_offer_arr = [];

                if (getPriceOffersCount == undefined) getPriceOffersCount = $rootScope.maxHttpRepeatCount;
                $http
                    .post(getpriceOffersUrl, { 'token': $scope.$root.token, 'srm_id': $scope.rec.sell_to_cust_id, 'order_date': orderDate })
                    .then(function(res) {

                        if (res.data.ack == true) {
                            $scope.price_offer_arr = res.data.response;

                            if (type == 1) {

                                var tempArr2 = [];
                                Object.keys($scope.tempProdArr.response).forEach(function(key) {
                                    if (key != "tbl_meta_data") {
                                        tempArr2.push($scope.tempProdArr.response[key]);
                                    }

                                });


                                angular.forEach($scope.price_offer_arr, function(obj) {
                                    var item = $filter("filter")(tempArr2, { id: obj.item_id });
                                    var idx = tempArr2.indexOf(item[0]);
                                    if (idx != -1) {
                                        tempArr2[idx].price_offer = obj.price_offer;
                                        tempArr2[idx].price_offer_id = obj.id;
                                        tempArr2[idx].minPurchaseQty = obj.minSaleQty;
                                        tempArr2[idx].maxPurchaseQty = obj.maxSaleQty;
                                        tempArr2[idx].arr_volume_discounts = obj.arr_volume_discounts;
                                    }
                                });
                                $scope.tempProdArr.response = tempArr2;
                            } else {
                                angular.forEach($scope.price_offer_arr, function(obj) {
                                    var item = $filter("filter")($scope.items, { id: obj.item_id });
                                    if (item.length > 0) {
                                        angular.forEach(item, function(obj1) {
                                            var idx = $scope.items.indexOf(obj1);
                                            if (idx != -1) {
                                                $scope.items[idx].price_offer = obj.price_offer;
                                                $scope.items[idx].price_offer_id = obj.id;
                                                $scope.items[idx].minPurchaseQty = obj.minSaleQty;
                                                $scope.items[idx].maxPurchaseQty = obj.maxSaleQty;
                                                $scope.items[idx].arr_volume_discounts = obj.arr_volume_discounts;
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    }).catch(function(e) {
                        if (getPriceOffersCount != 0) return $scope.getPriceOffers(type, ChkPurchasePrice, getPriceOffersCount - 1);

                        $scope.showLoader = false;

                        throw new Error(e.data);
                    });
            }
        }

    // ############ ADD GL code for purchase-cost-detail ##############

    $scope.addProduct = function() {

        $scope.tempOrderLineitems = [];
        var tempOrderData = {};

        tempOrderData.orderID = $scope.rec.id;
        tempOrderData.supplier_id = $scope.rec.sell_to_cust_id;
        tempOrderData.invoice_code = $scope.rec.order_code;
        tempOrderData.invoice_type = $scope.rec.type;
        tempOrderData.type_id = $scope.rec.type;
        $scope.showLoader = true;

        if ($scope.item_type == 0) {

            //$scope.PendingSelectedPurchaseItems = [];

            if ($stateParams.id == 0) {
                toaster.pop('error', 'Error', 'Please select Supplier first!');
                $scope.$root.return_status = false;
                $scope.showLoader = false;
                return false;
            }

            if ($scope.selectedRecFromModalsItem && !($scope.selectedRecFromModalsItem.length > 0)) {
                toaster.pop('error', 'Error', 'Please select item(s) first.');
                $scope.$root.return_status = false;
                $scope.showLoader = false;
                return false;
            }

            /* if (!$rootScope.arrVATPostGrpPurchase) {//[$rootScope.order_posting_group_id]

                toaster.pop('error', 'Error', 'VAT is missing');
                $scope.$root.return_status = false;
                $scope.showLoader = false;
                return false;
            } */

            if (!$rootScope.arrVATPostGrpPurchase) {

                var finApi = $scope.$root.pr + 'supplier/supplier/get-supplier-finance';
                $http
                    .post(finApi, { 'supplier_id': $scope.rec.sell_to_cust_id, 'token': $rootScope.token })
                    .then(function(res) {

                        if (res.data.ack != true) {
                            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(536));
                            angular.element('#productModal').modal('hide');
                            $scope.showLoader = false;
                            return false;
                        } else {
                            if (!$rootScope.arrVATPostGrpPurchase)
                                $rootScope.arrVATPostGrpPurchase = res.data.arrVATPostGrpPurchase;

                            $scope.newItemAddition(tempOrderData);
                        }

                    }).catch(function(message) {
                        $scope.showLoader = false;

                        throw new Error(message.data);
                    });
            } else {

                var finApi = $scope.$root.pr + 'supplier/supplier/get-supplier-finance';
                $http
                    .post(finApi, { 'supplier_id': $scope.rec.sell_to_cust_id, 'token': $rootScope.token })
                    .then(function(res) {

                        if (res.data.ack != true) {
                            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(536));
                            angular.element('#productModal').modal('hide');
                            $scope.showLoader = false;
                            return false;
                        } else {
                            if (!$rootScope.arrVATPostGrpPurchase)
                                $rootScope.arrVATPostGrpPurchase = res.data.arrVATPostGrpPurchase;
                        }

                    }).catch(function(message) {
                        $scope.showLoader = false;

                        throw new Error(message.data);
                    });

                $scope.newItemAddition(tempOrderData);
            }
        }
        /* else if ($scope.item_type == 1) {

            var acItem = {};

            if (prodData.account_type != 1) {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(506));
                $scope.showLoader = false;
                return false;
            }

            var accUrl = $scope.$root.setup + "ledger-group/get-ledger-posting";
            $http
                .post(accUrl, {
                    'account': prodData.number,
                    'order_type': prodData.account_type,
                    'token': $rootScope.token
                })
                .then(function (acData) {
                    if (acData.data.ack == false) {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                        $scope.$root.return_status = false;
                        $scope.showLoader = false;
                    }
                    else {
                        var ledgEntryUrl = $scope.$root.setup + "ledger-group/get-general-ledger-entry";
                        $http
                            .post(ledgEntryUrl, {
                                'business_posting_title': acData.result.vat_bus_posting,
                                'product_posting_title': acData.result.vat_prod_posting,
                                'token': $rootScope.token
                            })
                            .then(function (gData) {
                                if (gData.data.ack == false) {
                                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                                    $scope.$root.return_status = false;
                                    $scope.showLoader = false;
                                }
                                else {

                                    var vatsetpUrl = $scope.$root.setup + "ledger-group/get-account-head";
                                    $http
                                        .post(vatsetpUrl, {
                                            'customer': gData.result.business_posting,
                                            'product': gData.result.product_posting,
                                            'token': $rootScope.token
                                        })
                                        .then(function (vtData) {
                                            if (gData.data.ack == false) {
                                                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['VAT']));
                                                $scope.$root.return_status = false;
                                                $scope.showLoader = false;
                                            }
                                            else {
                                                var vatsetpUrl = $scope.$root.setup + "ledger-group/get-account-head";
                                                $http
                                                    .post(vatsetpUrl, {
                                                        'number': prodData.number,
                                                        'account_type': 'Posting',
                                                        'token': $rootScope.token
                                                    })
                                                    .then(function (acHead) {

                                                        acItem.product_id = prodData.id;
                                                        acItem.Code = prodData.number;
                                                        acItem.Description = acHead.data.response.name;
                                                        acItem.item_type = $scope.item_type;
                                                        acItem.qty = 1;
                                                        acItem.Price = 0;
                                                        acItem.Vat = vtData.data.response.vat;
                                                        // $scope.items.push(acItem);
                                                        $scope.tempOrderLineitems.push(acItem);
                                                        $scope.$root.return_status = true;
                                                        $scope.showLoader = false;
                                                    });
                                            }
                                        });
                                }
                            });
                    }

                    $scope.insertNewOrderLine($scope.tempOrderLineitems, tempOrderData)
                        .then(function (res) {

                            $scope.showLoader = false;

                            angular.forEach($scope.tempOrderLineitems2, function (elem) {
                                $scope.items.push(elem);
                            });

                            $scope.updateGrandTotal();

                            $scope.$emit('PurchaseLines', $scope.items);

                        });
                }).catch(function (message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                });
        } */
        else if ($scope.item_type == 2) {

            if ($stateParams.id == 0) {
                toaster.pop('error', 'Error', 'Please select Supplier first!');
                $scope.$root.return_status = false;
                $scope.showLoader = false;
                return false;
            }

            if (!$rootScope.arrVATPostGrpPurchase) {

                var finApi = $scope.$root.pr + 'supplier/supplier/get-supplier-finance'
                $http
                    .post(finApi, { 'supplier_id': $scope.rec.sell_to_cust_id, 'token': $rootScope.token })
                    .then(function(res) {

                        if (res.data.ack != true) {
                            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(536));
                            angular.element('#productModal').modal('hide');
                            $scope.showLoader = false;
                            return false;
                        } else {
                            if (!$rootScope.arrVATPostGrpPurchase)
                                $rootScope.arrVATPostGrpPurchase = res.data.arrVATPostGrpPurchase;

                            $scope.newAdditionalCostAddition(tempOrderData);
                        }
                    }).catch(function(message) {
                        $scope.showLoader = false;

                        throw new Error(message.data);
                    });

            } else {

                var finApi = $scope.$root.pr + 'supplier/supplier/get-supplier-finance'
                $http
                    .post(finApi, { 'supplier_id': $scope.rec.sell_to_cust_id, 'token': $rootScope.token })
                    .then(function(res) {

                        if (res.data.ack != true) {
                            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(536));
                            angular.element('#productModal').modal('hide');
                            $scope.showLoader = false;
                            return false;
                        } else {
                            if (!$rootScope.arrVATPostGrpPurchase)
                                $rootScope.arrVATPostGrpPurchase = res.data.arrVATPostGrpPurchase;
                        }
                    }).catch(function(message) {
                        $scope.showLoader = false;

                        throw new Error(message.data);
                    });

                $scope.newAdditionalCostAddition(tempOrderData);
            }
        }
        // $scope.item_types = $scope.arrItems[0];
    }

    $scope.newItemAddition = function(tempOrderData) {

        var currencyID = parseFloat($scope.rec.currency_id.id);
        var currencyConversionRate = 1;

        $scope.currencyConversionRatePO = 1;

        if (currencyID != $scope.$root.defaultCurrency) {

            var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
            $http
                .post(currencyURL, {
                    'id': currencyID,
                    'or_date': $scope.rec.order_date,
                    'token': $scope.$root.token
                })
                .then(function(res) {
                    if (res.data.ack == true) {
                        if (res.data.response.conversion_rate == null) {
                            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(590, [$scope.rec.currency_id.name]));
                            $scope.showLoader = false;
                            return;
                        }

                        currencyConversionRate = parseFloat(res.data.response.conversion_rate);

                        $scope.currencyConversionRatePO = currencyConversionRate;
                    } else {
                        $scope.showLoader = false;
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(590, [$scope.rec.currency_id.name]));
                        return;
                    }

                    $scope.items_array = [];

                    angular.copy($scope.tempProdArr.response, $scope.items_array);

                    // angular.forEach($scope.items_array, function (prodData) {

                    // if (prodData.chk == true) {

                    var selItemList = [];

                    angular.forEach($scope.selectedRecFromModalsItem, function(obj) {
                        selItemList.push(obj.record);
                    });

                    // angular.forEach($scope.selectedRecFromModalsItem, function (obj,key) {
                    angular.forEach(selItemList, function(prodData) {

                        // var key = obj.key;
                        // var prodData = obj.record;
                        // var resRec = $filter("filter")($scope.items_array, { id: key });
                        /* var chk_item = $filter("filter")($scope.items_array, function(rec){
                                            if(rec == prodData.id) return true;
                                        }); */


                        if (prodData) {
                            // var prodData = resRec[0];                         

                            $scope.PendingSelectedPurchaseItems.push(prodData);
                            prodData.item_type = $scope.item_type;
                            prodData.product_name = prodData.description;

                            if (parseFloat(prodData.minPurchaseQty) > 0)
                                prodData.qty = parseFloat(prodData.minPurchaseQty);
                            else
                                prodData.qty = 1;

                            prodData.standard_price = 0;
                            var itemPrice = '';

                            if (prodData.price_offer != undefined) {
                                prodData.standard_price = parseFloat(prodData.price_offer);
                            } else {
                                if (prodData.unit_price == null || prodData.unit_price == undefined) {
                                    if (prodData.standard_purchase_cost != undefined)
                                        itemPrice = parseFloat(prodData.standard_purchase_cost) * parseFloat(currencyConversionRate);
                                    else
                                        itemPrice = 0;
                                    // prodData.standard_price = parseFloat(prodData.standard_purchase_cost);
                                } else
                                    itemPrice = parseFloat(prodData.unit_price) * parseFloat(currencyConversionRate);
                                // prodData.standard_price = parseFloat(prodData.unit_price);

                                prodData.standard_price = parseFloat(itemPrice).toFixed(4);
                            }

                            prodData.total_price = parseFloat(prodData.standard_price);


                            if (prodData.arr_units != undefined) {

                                if (prodData.arr_units.response != undefined)
                                    prodData.arr_units = prodData.arr_units.response;
                                else
                                    prodData.arr_units = '';
                                // prodData.units = prodData.arr_units[0];

                                if (prodData.arr_units.length[0])
                                    prodData.units = prodData.arr_units[0];
                                else
                                    prodData.units = '';
                            } else {
                                prodData.arr_units = '';
                                prodData.units = '';
                            }

                            if (prodData.arr_warehouse != undefined) {
                                prodData.arr_prod_warehouse = prodData.arr_warehouse.response;

                                if (prodData.arr_prod_warehouse != undefined) {
                                    angular.forEach(prodData.arr_prod_warehouse, function(obj) {
                                        if (obj.id == prodData.arr_warehouse.default_wh)
                                            prodData.warehouses = obj;
                                    });

                                    if ((prodData.warehouses == undefined) && (prodData.arr_prod_warehouse[0].id > 0))
                                        prodData.warehouses = prodData.arr_prod_warehouse[0];
                                }
                            }

                            prodData.vat = '';
                            prodData.vat_value = '';
                            prodData.vat_id = '';


                            if ($rootScope.arrVATPostGrpPurchase) { // != undefined

                                angular.forEach($rootScope.arrVATPostGrpPurchase, function(obj) {
                                    if (obj.id == prodData.vat_rate_id) {
                                        prodData.vat = obj.name;
                                        prodData.vat_value = obj.vat_value;
                                        prodData.vat_id = obj.id;
                                        prodData.vats = obj;
                                    }
                                });
                            }

                            prodData.purchase_unit = prodData.uom_id;
                            prodData.total_landing_cost = 0;
                            prodData.supplier_id = $scope.rec.sell_to_cust_id;

                            var count = $scope.items.length - 1;
                            $scope.tempOrderLineitems.push(prodData);
                            $scope.$root.return_status = true;
                        }
                    });

                    $scope.showReceiveStuff = true;
                    $scope.$emit('showReceiveStuff', $scope.showReceiveStuff);
                    angular.element('#productModal').modal('hide');

                    $scope.insertNewOrderLine($scope.tempOrderLineitems, tempOrderData)
                        .then(function(res) {


                            $scope.showLoader = false;

                            angular.forEach($scope.tempOrderLineitems2, function(elem) {

                                if (elem.item_type == 0) {
                                    if (elem.arr_units != undefined) {
                                        //elem.arr_units = elem.arr_units.response;
                                        elem.units = elem.arr_units[0];
                                    }


                                    if (elem.arr_prod_warehouse != undefined) {
                                        angular.forEach(elem.arr_prod_warehouse, function(obj) {
                                            if (obj.id == elem.arr_warehouse.default_wh)
                                                elem.warehouses = obj;
                                        });

                                        if ((elem.warehouses == undefined) && (elem.arr_prod_warehouse[0].id > 0))
                                            elem.warehouses = elem.arr_prod_warehouse[0];
                                    }

                                    elem.standard_price = parseFloat(elem.standard_price);

                                    if (parseFloat(elem.qty) > 0)
                                        elem.qty = parseFloat(elem.qty);
                                    else
                                        elem.qty = 1;

                                    if ($rootScope.arrVATPostGrpPurchase) { // != undefined

                                        angular.forEach($rootScope.arrVATPostGrpPurchase, function(obj) {
                                            if (obj.id == elem.vat_rate_id) {
                                                elem.vat = obj.name;
                                                elem.vat_value = obj.vat_value;
                                                elem.vat_id = obj.id;
                                                elem.vats = obj;
                                            }
                                        });
                                    }
                                }

                                elem.isGLVat = false;

                                $scope.items.push(elem);
                            });

                            $scope.updateGrandTotal();
                            $scope.getPriceOffers(0, 1);
                            $scope.$emit('PurchaseLines', $scope.items);
                        });
                });

        } else {
            $scope.items_array = [];

            angular.copy($scope.tempProdArr.response, $scope.items_array);

            // angular.forEach($scope.items_array, function (prodData) {


            var selItemList = [];

            angular.forEach($scope.selectedRecFromModalsItem, function(obj) {
                selItemList.push(obj.record);
            });

            // angular.forEach($scope.selectedRecFromModalsItem, function (chk_item,key) {
            angular.forEach(selItemList, function(prodData) {

                // var resRec = $filter("filter")($scope.items_array, { id: key });
                /* var chk_item = $filter("filter")($scope.items_array, function(rec){
                                    if(rec == prodData.id) return true;
                                }); */

                // if (resRec[0]) {

                // var prodData = resRec[0];

                $scope.PendingSelectedPurchaseItems.push(prodData);
                prodData.item_type = $scope.item_type;
                prodData.product_name = prodData.description;
                // prodData.qty = 1;

                if (parseFloat(prodData.minPurchaseQty) > 0)
                    prodData.qty = parseFloat(prodData.minPurchaseQty);
                else
                    prodData.qty = 1;

                prodData.standard_price = 0;


                if (prodData.price_offer != undefined)
                    prodData.standard_price = parseFloat(prodData.price_offer);
                else {
                    if (prodData.unit_price == null) {
                        if (prodData.standard_purchase_cost != undefined)
                            prodData.standard_price = parseFloat(prodData.standard_purchase_cost);
                        else
                            itemPrice = 0;
                    } else
                        prodData.standard_price = parseFloat(prodData.unit_price);
                }

                prodData.total_price = parseFloat(prodData.standard_price);

                if (prodData.arr_units != undefined) {

                    if (prodData.arr_units.response != undefined)
                        prodData.arr_units = prodData.arr_units.response;
                    else
                        prodData.arr_units = '';

                    if (prodData.arr_units.length[0])
                        prodData.units = prodData.arr_units[0];
                    else
                        prodData.units = '';
                } else {
                    prodData.arr_units = '';
                    prodData.units = '';
                }

                if (prodData.arr_warehouse != undefined) {
                    prodData.arr_prod_warehouse = prodData.arr_warehouse.response;

                    if (prodData.arr_prod_warehouse != undefined) {
                        angular.forEach(prodData.arr_prod_warehouse, function(obj) {
                            if (obj.id == prodData.arr_warehouse.default_wh)
                                prodData.warehouses = obj;
                        });

                        if ((prodData.warehouses == undefined) && (prodData.arr_prod_warehouse[0].id > 0))
                            prodData.warehouses = prodData.arr_prod_warehouse[0];
                    }
                }

                prodData.vat = '';
                prodData.vat_value = '';
                prodData.vat_id = '';


                if ($rootScope.arrVATPostGrpPurchase) { // != undefined

                    angular.forEach($rootScope.arrVATPostGrpPurchase, function(obj) {
                        if (obj.id == prodData.vat_rate_id) {
                            prodData.vat = obj.name;
                            prodData.vat_value = obj.vat_value;
                            prodData.vat_id = obj.id;
                            prodData.vats = obj;
                        }
                    });
                }

                prodData.purchase_unit = prodData.uom_id;
                prodData.total_landing_cost = 0;
                prodData.supplier_id = $scope.rec.sell_to_cust_id;

                var count = $scope.items.length - 1;

                $scope.tempOrderLineitems.push(prodData);
                $scope.$root.return_status = true;
                // }
            });

            $scope.showReceiveStuff = true;
            $scope.$emit('showReceiveStuff', $scope.showReceiveStuff);
            angular.element('#productModal').modal('hide');

            $scope.insertNewOrderLine($scope.tempOrderLineitems, tempOrderData)
                .then(function(res) {

                    $scope.showLoader = false;

                    angular.forEach($scope.tempOrderLineitems2, function(elem) {

                        if (elem.item_type == 0) {
                            if (elem.arr_units != undefined) {
                                //elem.arr_units = elem.arr_units.response;
                                elem.units = elem.arr_units[0];
                            }


                            if (elem.arr_prod_warehouse != undefined) {
                                angular.forEach(elem.arr_prod_warehouse, function(obj) {
                                    if (obj.id == elem.arr_warehouse.default_wh)
                                        elem.warehouses = obj;
                                });

                                if ((elem.warehouses == undefined) && (elem.arr_prod_warehouse[0].id > 0))
                                    elem.warehouses = elem.arr_prod_warehouse[0];
                            }

                            elem.standard_price = parseFloat(elem.standard_price);

                            if (parseFloat(elem.qty) > 0)
                                elem.qty = parseFloat(elem.qty);
                            else
                                elem.qty = 1;

                            if ($rootScope.arrVATPostGrpPurchase) { // != undefined

                                angular.forEach($rootScope.arrVATPostGrpPurchase, function(obj) {
                                    if (obj.id == elem.vat_rate_id) {
                                        elem.vat = obj.name;
                                        elem.vat_value = obj.vat_value;
                                        elem.vat_id = obj.id;
                                        elem.vats = obj;
                                    }
                                });
                            }
                        }
                        elem.isGLVat = false;

                        $scope.items.push(elem);
                    });

                    $scope.updateGrandTotal();
                    $scope.getPriceOffers(0, 1);
                    $scope.$emit('PurchaseLines', $scope.items);

                });
        }
    }

    $scope.newAdditionalCostAddition = function(tempOrderData) {

        $scope.addCostRecarray = [];
        angular.copy($scope.addCostRec, $scope.addCostRecarray);

        angular.forEach($scope.addCostRecarray, function(addCost) {

            if (addCost.chk == true && addCost.disableCheck == false) {

                $scope.PendingSelectedAdditionalCost.push(addCost);
                addCost.item_type = $scope.item_type;
                addCost.descriptionID = addCost.descriptionID;
                addCost.product_name = addCost.description;
                addCost.uomID = addCost.uomID;
                addCost.qty = 1;
                addCost.standard_price = 0;
                addCost.units = addCost.uom;
                addCost.supplier_id = $scope.rec.sell_to_cust_id;

                var vatRate = addCost.vatRateID;

                if (vatRate == 1 || vatRate == 2 || vatRate == 3 || vatRate == 4) {

                    if ($rootScope.arrVATPostGrpPurchase) // != undefined
                        addCost.vats = $rootScope.arrVATPostGrpPurchase[vatRate - 1];
                } else {

                    if ($rootScope.arrVATPostGrpPurchase) {
                        angular.forEach($rootScope.arrVATPostGrpPurchase, function(obj) {
                            if (obj.id == addCost.vatRateID)
                                addCost.vats = obj;
                        });
                    }
                }

                // $scope.items.push(addCost);
                $scope.tempOrderLineitems.push(addCost);
                $scope.$root.return_status = true;
            }
        });

        // $scope.showReceiveStuff = true;

        angular.element('#listingAdditionalCostModal').modal('hide');

        $scope.insertNewOrderLine($scope.tempOrderLineitems, tempOrderData)
            .then(function(res) {

                $scope.showLoader = false;

                angular.forEach($scope.tempOrderLineitems2, function(elem) {

                    var vatRate = elem.vatRateID;

                    if (vatRate == 1 || vatRate == 2 || vatRate == 3 || vatRate == 4) {

                        if ($rootScope.arrVATPostGrpPurchase) // != undefined
                            elem.vats = $rootScope.arrVATPostGrpPurchase[vatRate - 1];
                    } else {
                        if ($rootScope.arrVATPostGrpPurchase) {
                            angular.forEach($rootScope.arrVATPostGrpPurchase, function(obj) {
                                if (obj.id == elem.vatRateID)
                                    elem.vats = obj;
                            });
                        }
                    }

                    $scope.items.push(elem);
                });

                $scope.updateGrandTotal();
                $scope.$emit('PurchaseLines', $scope.items);
            });
    }

    $scope.add_gl_account_values = function() { //gl_data

        $scope.showLoader = true;

        if ($stateParams.id == 0) {
            toaster.pop('error', 'Error', 'Please select Supplier first!');
            $scope.showLoader = false;
            $scope.$root.return_status = false;
            return false;
        }

        if ($rootScope.arrVATPostGrpPurchase) {

            var finApi = $scope.$root.pr + 'supplier/supplier/get-supplier-finance'
            $http
                .post(finApi, { 'supplier_id': $scope.rec.sell_to_cust_id, 'token': $rootScope.token })
                .then(function(res) {

                    if (res.data.ack == true) {
                        if (!$rootScope.arrVATPostGrpPurchase)
                            $rootScope.arrVATPostGrpPurchase = res.data.arrVATPostGrpPurchase;
                    } else {
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(536));
                        angular.element('#productModal').modal('hide');
                        $scope.showLoader = false;
                        return false;
                    }
                }).catch(function(message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                });

            $scope.newGlAccountAddition();

        } else {
            var finApi = $scope.$root.pr + 'supplier/supplier/get-supplier-finance'
            $http
                .post(finApi, { 'supplier_id': $scope.rec.sell_to_cust_id, 'token': $rootScope.token })
                .then(function(res) {

                    if (res.data.ack == true) {
                        if (!$rootScope.arrVATPostGrpPurchase)
                            $rootScope.arrVATPostGrpPurchase = res.data.arrVATPostGrpPurchase;

                        $scope.newGlAccountAddition();
                    } else {
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(536));
                        angular.element('#productModal').modal('hide');
                        $scope.showLoader = false;
                        return false;
                    }
                }).catch(function(message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                });
        }
    }

    $scope.newGlAccountAddition = function() {

        $scope.tempOrderLineitems = [];

        var tempOrderData = {};

        tempOrderData.orderID = $scope.rec.id;
        tempOrderData.supplier_id = $scope.rec.sell_to_cust_id;
        tempOrderData.invoice_code = $scope.rec.order_code;
        tempOrderData.invoice_type = $scope.rec.type;
        tempOrderData.type_id = $scope.rec.type;

        angular.forEach($scope.gl_account, function(gl_data) {

            if (gl_data.chk == true) {

                $scope.acItem = {};
                $scope.acItem.product_id = gl_data.id;
                $scope.acItem.id = gl_data.id;
                $scope.acItem.product_code = gl_data.code;
                $scope.acItem.description = gl_data.name;
                $scope.acItem.product_name = gl_data.name;
                $scope.acItem.item_type = 1;
                $scope.acItem.qty = 1;
                $scope.acItem.vat_id = gl_data.vat_id;
                $scope.acItem.ref_id = gl_data.ref_id;
                $scope.acItem.Price = 0; //"";
                var vatRate = gl_data.vat_id;

                if (vatRate == 1 || vatRate == 2 || vatRate == 3 || vatRate == 4) {

                    if ($rootScope.arrVATPostGrpPurchase)
                        $scope.acItem.vats = $rootScope.arrVATPostGrpPurchase[vatRate - 1];
                } else {
                    angular.forEach($rootScope.arrVATPostGrpPurchase, function(obj) {
                        if (obj.id == gl_data.vat_id)
                            $scope.acItem.vats = obj;
                    });
                }

                angular.forEach($rootScope.gl_arr_units, function(obj) {
                    if (obj.id == gl_data.ref_id)
                        $scope.acItem.units = obj;
                });



                // $scope.items.push($scope.acItem);
                $scope.tempOrderLineitems.push($scope.acItem);
            }
        });

        angular.element('#accthead_modal').modal('hide');

        $scope.insertNewOrderLine($scope.tempOrderLineitems, tempOrderData)
            .then(function(res) {

                $scope.showLoader = false;

                angular.forEach($scope.tempOrderLineitems2, function(elem) {

                    // if ($rootScope.arr_vat_post_grp != undefined && $rootScope.order_posting_group_id != undefined) {
                    if ($rootScope.arrVATPostGrpPurchase) {

                        var vatRate = elem.vat_id;

                        if (vatRate == 1 || vatRate == 2 || vatRate == 3 || vatRate == 4) {
                            elem.vats = $rootScope.arrVATPostGrpPurchase[vatRate - 1];
                        } else {
                            angular.forEach($rootScope.arrVATPostGrpPurchase, function(obj) {

                                if (obj.id == elem.vat_id) {
                                    elem.vat = obj.name;
                                    elem.vat_value = obj.vat_value;
                                    elem.vat_id = obj.id;
                                    elem.vats = obj;
                                }
                            });
                        }
                    }
                    elem.qty = 1;
                    elem.standard_price = elem.Price;

                    angular.forEach($rootScope.gl_arr_units, function(obj) {
                        if (obj.id == elem.ref_id)
                            elem.units = obj;
                    });

                    elem.isGLVat = false;

                    if ($rootScope.defaultCompany == 133) {

                        if (elem.item_type == 1) {
                            //PBI: check is vat gl code.
                            if (elem.product_code == $scope.VatRange.gl1AccountCode ||
                                elem.product_code == $scope.VatRange.gl2AccountCode ||
                                elem.product_code == $scope.VatRange.gl3AccountCode) {
                                elem.isGLVat = true;
                            } else {
                                elem.isGLVat = false;
                            }
                            //vat ranges for gli listing
                            // elem.startVatRange = $scope.VatRange.startRangeCode;
                            // elem.endVatRange = $scope.VatRange.endRangeCode;
                        }

                    } else {

                        if (elem.item_type == 1) {
                            //PBI: check is vat gl code.
                            if (elem.product_code >= $scope.VatRange.startRangeCode && elem.product_code <= $scope.VatRange.endRangeCode) {
                                elem.isGLVat = true;
                            } else {
                                elem.isGLVat = false;
                            }
                            //vat ranges for gli listing
                            elem.startVatRange = $scope.VatRange.startRangeCode;
                            elem.endVatRange = $scope.VatRange.endRangeCode;
                        }
                    }

                    $scope.items.push(elem);
                    // if(elem.item_type)
                });

                $scope.updateGrandTotal();
            });
    }

    var newLineCount;

    $scope.insertNewOrderLine = function(tempOrderLineitems, tempOrderData, newLineCount) {

        var insertNewOrderLine = $scope.$root.pr + "srm/srminvoice/insert-new-order-line";

        if (newLineCount == undefined) newLineCount = $rootScope.maxHttpRepeatCount;
        return $http
            .post(insertNewOrderLine, {
                'token': $scope.$root.token,
                'tempOrderData': tempOrderData,
                'tempOrderLineitems': tempOrderLineitems
            })
            .then(function(result) {

                $scope.tempOrderLineitems2 = [];

                if (result.data.ack == true)
                    $scope.tempOrderLineitems2 = result.data.allitemArray;
                else {
                    $scope.showLoader = false;
                    toaster.pop('error', 'info', result.data.error);
                }
                return result.data.ack;

            }).catch(function(e) {
                if (newLineCount != 0) return $scope.insertNewOrderLine(tempOrderLineitems, tempOrderData, newLineCount - 1);

                $scope.showLoader = false;

                throw new Error(e.data);
            });

    }

    $scope.arr_units = [];
    var getSetupItemListCount;

    $scope.get_setup_item_list = function(product_id, getSetupItemListCount) {

        if (getSetupItemListCount == undefined) getSetupItemListCount = $rootScope.maxHttpRepeatCount;
        $http
            .post(unitUrl_item, { 'token': $scope.$root.token, 'product_id': product_id })
            .then(function(res) {

                if (res.data.ack == true) {
                    $scope.arr_units = res.data.response;
                    //  $scope.item.units = $scope.arr_units[0];
                }
            }).catch(function(e) {
                if (getSetupItemListCount != 0) return $scope.get_setup_item_list(product_id, getSetupItemListCount - 1);

                $scope.showLoader = false;

                throw new Error(e.data);
            });
    }

    var show_add_popCount;

    $scope.show_add_pop = function(id, show_add_popCount) {

        var DetailsURL = $scope.$root.gl + "chart-accounts/get-account-heads";

        if (show_add_popCount == undefined) show_add_popCount = $rootScope.maxHttpRepeatCount;
        $http
            .post(DetailsURL, { 'token': $scope.$root.token, 'gl_id': id })
            .then(function(res) {

                if (res.data.ack == true) {

                    $scope.acItem = {};
                    $scope.acItem.product_code = res.data.response.number;
                    $scope.acItem.description = res.data.response.name;
                    $scope.acItem.item_type = 1;
                    $scope.acItem.qty = 1;
                    $scope.acItem.Price = 0;
                    $scope.acItem.Vat = res.data.response.vat_list_id;

                    angular.forEach($rootScope.arrVATPostGrpPurchase, function(obj) {

                        if (obj.id == $scope.acItem.Vat)
                            $scope.acItem.vats = obj;
                    });

                    $scope.items.push($scope.acItem);
                    ///$scope.$root.return_status = true;
                }
            }).catch(function(e) {
                if (show_add_popCount != 0) return $scope.show_add_pop(id, show_add_popCount - 1);

                $scope.showLoader = false;

                throw new Error(e.data);
            });

        angular.element('#accthead_modal').modal('hide');
    }



    $scope.wordsLength = 0;
    $scope.showWordsLimits_invoice = function() {
        $scope.wordsLength = $scope.rec.note.length;
    }

    // ############ Show-landing-cost-setup-modal ##############

    $scope.check_quantity = function(item) {

        var produnit = $scope.$root.stock + "unit-measure/get-unit-quanitity-record-popup";
        item.quantity_unit_price = $scope.rec.item_price = $scope.rec.item_quantity = 0;

        $http
            .post(produnit, { 'token': $scope.$root.token, 'unit_id': item.units.id, 'product_id': item.id })
            .then(function(res) {
                if (res.data.ack == true) {
                    angular.element('.pic_block').attr("disabled", false);
                    item.quantity_unit_price = (Number(item.standard_price)) * (Number(res.data.quantity));
                    item.quantity_limit = res.data.quantity;
                    $scope.rec.item_price = (Number(item.standard_price));
                    $scope.rec.item_quantity = (Number(res.data.quantity));
                } else if (res.data.ack == 0) {
                    angular.element('.pic_block').attr("disabled", true);
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(565));
                }
            }).catch(function(message) {
                $scope.showLoader = false;

                throw new Error(message.data);
            });
    }

    $scope.rowTotal = function(item) {

        var total = 0;

        if (item.item_type != 1) {

            if (item.units != undefined)
                total = item.qty * parseFloat(item.standard_price); //.toFixed(3)
            else
                total = item.qty * parseFloat(item.standard_price); //.toFixed(3)

        } else {
            if (item.qty > 0)
                total = item.qty * parseFloat(item.standard_price);
            else
                total = parseFloat(item.standard_price);
        }
        total = parseFloat(total).toFixed(2);

        if (item.discount_type_id != undefined && item.discount > 0) {
            if (item.discount_type_id.id == 'Percentage')
                total = parseFloat(total) - (parseFloat(total) * item.discount / 100);
            else if (item.discount_type_id.id == 'Value')
                total = parseFloat(total) - item.discount;
            else
                total = parseFloat(total) - (parseFloat(item.discount) * parseFloat(item.qty)); // 
            //parseFloat(total) - (item.discount * item.qty);
            /* else
                total = Number(total) - Number(item.discount); */
        }
        if (item.isGLVat == true) {
            total = 0;
        }
        total = parseFloat(total).toFixed(2);
        return total;
    }

    $scope.rowOriginalAmount = function(item) {

        var rowOriginalAmount = 0;

        if (item.isGLVat != true) {

            if (item.qty > 0)
                rowOriginalAmount = parseFloat(parseFloat(item.qty) * parseFloat(item.standard_price)).toFixed(3);
            else
                rowOriginalAmount = parseFloat(item.standard_price).toFixed(3);
        }

        return rowOriginalAmount;
    }

    $scope.rowDiscount = function(item) {
        var total = 0;
        if (item.qty > 0)
            total = parseFloat(parseFloat(item.qty) * parseFloat(item.standard_price)).toFixed(3);
        else
            total = parseFloat(item.standard_price).toFixed(3);

        var discount = 0;
        if (item.discount_type_id != undefined && item.discount > 0) {
            if (item.discount_type_id.id == 'Percentage')
                discount = parseFloat(total) * parseFloat(item.discount) / 100;
            else if (item.discount_type_id.id == 'Value')
                discount = item.discount;
            else
                discount = (parseFloat(item.discount) * parseFloat(item.qty)); //parseFloat(total) - 
        } //parseFloat(item.discount) * parseFloat(item.qty);
        item.discount_price = discount;

        if (item.isGLVat == true) {
            total = 0;
        }
        return discount;
    }

    $scope.rowVat = function(item) {
        var arrVat = [];
        var rowVat = 0;
        var total = 0;

        if (item.qty > 0)
            total = parseFloat(parseFloat(item.qty) * parseFloat(item.standard_price)); //.toFixed(3)
        else
            total = parseFloat(item.standard_price); //.toFixed(3)

        total = parseFloat(total).toFixed(2);

        if (item.isGLVat == true) {
            var price = total;
            if (arrVat[vat_value] != undefined && arrVat[vat_value].length > 0)
                arrVat[vat_value] = arrVat[vat_value] + price;
            else if (vat_value > 0)
                arrVat[vat_value] = price;
            else
                arrVat[vat_value] = price;

            // rowVat = arrVat[vat_value].toFixed(2);
            rowVat = arrVat[vat_value];
        }

        if (item.vats != undefined && item.vats.vat_value > 0) {

            if (item.discount_type_id != undefined && item.discount > 0) {
                if (item.discount_type_id.id == 'Percentage')
                    total = parseFloat(total) - (parseFloat(total) * parseFloat(item.discount) / 100);
                else if (item.discount_type_id.id == 'Value')
                    total = parseFloat(total) - parseFloat(item.discount);
                else
                    total = parseFloat(total) - (parseFloat(item.discount) * parseFloat(item.qty));
            }

            var price = total;
            var vat_value = item.vats.vat_value;

            if (arrVat[vat_value] != undefined && arrVat[vat_value].length > 0)
                arrVat[vat_value] = arrVat[vat_value] + price;
            else if (vat_value > 0)
                arrVat[vat_value] = price;

            rowVat = parseFloat((vat_value * arrVat[vat_value]) / 100).toFixed(2); // For 5 digit decimals case
        }

        if (isNaN(rowVat)) {
            item.vat_price = 0;
            return 0;
        } else
            item.vat_price = rowVat;
        return rowVat;
    }

    $scope.netTotal = function() {
        // var total = 0;
        var netTotal = 0;
        var s_total = 0;
        var items_net_total = 0;

        angular.forEach($scope.items, function(item) {

            var total = 0;

            var unitPrice = (item.standard_price != undefined && item.standard_price != '' && isNaN(item.standard_price) == false) ? item.standard_price : 0;

            /* if (item.item_type != 1) {

                if (item.units != undefined && (item.standard_price == null || item.qty == null))
                    total = 0;
                else if (item.units != undefined)
                    total = parseFloat(item.qty) * parseFloat(unitPrice);
                else
                    total = parseFloat(item.qty) * parseFloat(unitPrice);

            } else if (item.isGLVat == false) {
                if (item.qty > 0 && item.standard_price == null)
                    total = 0;
                else if (item.qty > 0)
                    total = (item.qty) * parseFloat(unitPrice);
                else
                    total = parseFloat(unitPrice);
            } */

            if (item.item_type != 1) {

                if (item.units != undefined && (unitPrice == 0 || item.qty == null || item.qty == '' || item.qty == undefined || isNaN(item.qty) == true))
                    total = 0;
                else if (item.units != undefined)
                    total = parseFloat(item.qty) * parseFloat(unitPrice);
                else
                    total = parseFloat(item.qty) * parseFloat(unitPrice);

            } else if (item.isGLVat == false) {
                if (item.qty > 0 && unitPrice == 0)
                    total = 0;
                else if (item.qty > 0)
                    total = (item.qty) * parseFloat(unitPrice);
                else
                    total = parseFloat(unitPrice);
            }

            var netItemsLineTotal = parseFloat(total).toFixed(2);

            if (item.item_type == 0)
                items_net_total += parseFloat(netItemsLineTotal);

            //total += Number(subtotal);

            if (item.discount_type_id != undefined && item.discount > 0) {
                /* if (item.discount_type_id.id == 'Percentage')
                    total = total - (total * item.discount / 100);
                else
                    total = total - item.discount; */

                if (item.discount_type_id.id == 'Percentage')
                    total = parseFloat(total) - (parseFloat(total) * item.discount / 100);
                else if (item.discount_type_id.id == 'Value')
                    total = parseFloat(total) - item.discount;
                else
                    total = parseFloat(total) - (parseFloat(item.discount) * parseFloat(item.qty)); // //parseFloat(total) - (item.discount * item.qty);
            }

            if (total > 0)
                s_total = s_total + total;

            var netLineTotal = parseFloat(total).toFixed(2);
            netTotal += parseFloat(netLineTotal);
        });


        $scope.rec.items_net_total = items_net_total;
        $rootScope.netValuePurchaseOrder = netTotal;
        return (parseFloat(netTotal).toFixed(2));
        // return netTotal;
    }


    $scope.calcVat = function() {
        var arrVat = [];
        var arrTotalVat = [];
        var TotalVat = 0;
        var TotalItemVat = 0;
        var total = 0;

        if ($scope.items.length > 0) {
            angular.forEach($scope.items, function(item) {

                // var unitPrice = (item.standard_price != undefined && item.standard_price != '') ? item.standard_price : 0;
                var unitPrice = (item.standard_price != undefined && item.standard_price != '' && isNaN(item.standard_price) == false) ? item.standard_price : 0;

                if (item.qty > 0)
                    var subtotal = parseFloat(item.qty) * parseFloat(unitPrice);
                else
                    var subtotal = parseFloat(unitPrice);

                if (isNaN(subtotal))
                    subtotal = 0;

                var total = 0;
                // total += Number(subtotal);
                total += parseFloat(parseFloat(subtotal).toFixed(2)); //parseFloat(subtotal).toFixed(2);

                if (item.discount_type_id != undefined && item.discount > 0) {
                    /* if (item.discount_type_id.id == 'Percentage')
                        total = total - (total * item.discount / 100);
                    else
                        total = total - item.discount; */

                    if (item.discount_type_id.id == 'Percentage')
                        total = parseFloat(total) - (parseFloat(total) * item.discount / 100);
                    else if (item.discount_type_id.id == 'Value')
                        total = parseFloat(total) - item.discount;
                    else
                        total = parseFloat(total) - (parseFloat(item.discount) * parseFloat(item.qty)); //  
                    //parseFloat(total) - (item.discount * item.qty);
                }

                var price = total;

                if (item.isGLVat == true) {

                    if (arrVat[vat_value] != undefined && arrVat[vat_value].length > 0)
                        arrVat[vat_value] = parseFloat(arrVat[vat_value]) + price;
                    else if (vat_value > 0)
                        arrVat[vat_value] = price;
                    else
                        arrVat[vat_value] = price;

                    if (item.ref_prod_id > 0)
                        TotalVat = TotalVat - parseFloat(arrVat[vat_value]); //.toFixed(2))
                    else
                        TotalVat = TotalVat + parseFloat(arrVat[vat_value]); //.toFixed(2))

                    var itemVatVal = parseFloat((vat_value / 100) * arrVat[vat_value]).toFixed(2);


                    if (item.item_type == 0)
                        TotalItemVat += parseFloat(itemVatVal);

                }

                if (item.vats != undefined && item.vats.vat_value > 0) {
                    //calculate Vat for Each Item sepratly

                    var vat_value = item.vats.vat_value;

                    if (arrVat[vat_value] != undefined && arrVat[vat_value].length > 0)
                        arrVat[vat_value] = parseFloat(arrVat[vat_value]) + parseFloat(price);
                    else if (vat_value > 0) arrVat[vat_value] = price;

                    // TotalVat += parseFloat((vat_value / 100) * arrVat[vat_value]);//.toFixed(2))

                    var itemVatVal2 = parseFloat((vat_value * arrVat[vat_value]) / 100).toFixed(2);

                    TotalVat += parseFloat(itemVatVal2);

                    if (item.item_type == 0 || item.item_type == 2)
                        TotalItemVat += parseFloat(itemVatVal2);
                }
            });
        }

        $scope.rec.items_net_vat = TotalItemVat;
        $rootScope.vatValuePurchaseOrder = TotalItemVat;
        return (parseFloat(TotalVat).toFixed(2));
        // return TotalVat;
    }


    $scope.calcDiscount = function() {

        var TotalDiscount = 0;
        var ItemsDiscount = 0;
        var total = 0;

        if ($scope.items.length > 0) {
            angular.forEach($scope.items, function(item) {

                // var unitPrice = (item.standard_price != undefined && item.standard_price != '') ? item.standard_price : 0;
                var unitPrice = (item.standard_price != undefined && item.standard_price != '' && isNaN(item.standard_price) == false) ? item.standard_price : 0;

                if (item.discount_type_id != undefined && item.discount > 0) {

                    var subtotal = item.qty * unitPrice;

                    var total = Number(subtotal);
                    if (item.discount_type_id != undefined && item.discount > 0) {

                        var total = 0;
                        if (item.qty > 0)
                            total = parseFloat(item.qty) * parseFloat(unitPrice);
                        else
                            total = parseFloat(unitPrice);

                        if (item.discount_type_id.id == 'Percentage')
                            total = parseFloat(total) * item.discount / 100;
                        else if (item.discount_type_id.id == 'Value')
                            total = item.discount;
                        else
                            total = (parseFloat(item.discount) * parseFloat(item.qty)); //parseFloat(total) - (item.discount * item.qty);//item.discount * item.qty;

                        if (item.item_type == 0 || item.item_type == 2)
                            ItemsDiscount += parseFloat(total.toFixed(2));

                        TotalDiscount += parseFloat(total.toFixed(2));
                    }
                }
            });
        }
        // return ($scope.grand_total - TotalDiscount);

        TotalDiscount = (parseFloat(TotalDiscount).toFixed(2));

        $scope.rec.items_net_discount = ItemsDiscount; //.toFixed(2)
        $scope.rec.total_discount = TotalDiscount; //.toFixed(2)
        $rootScope.discountedPurchaseOrder = TotalDiscount; //.toFixed(2)
        return TotalDiscount; //.toFixed(2)
    }


    $scope.onChangeDiscountType = function(item) {

        // var unitPrice = (item.standard_price != undefined && item.standard_price != '') ? item.standard_price : 0;
        var unitPrice = (item.standard_price != undefined && item.standard_price != '' && isNaN(item.standard_price) == false) ? item.standard_price : 0;

        if (item.discount != '') {
            if (isNaN(item.discount))
                item.discount = 0;
        }

        if (item.discount_type_id != undefined) {

            var actualPrice = parseFloat(item.qty) * parseFloat(unitPrice);

            if (item.discount_type_id.id == 'None')
                item.discount = '';
            else if (item.discount_type_id.id == 'Percentage') {
                if (item.discount != '' && actualPrice > 0 && parseFloat(item.discount) > 100) {
                    item.discount = '';
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(515));
                }
            } else if (item.discount_type_id.id == 'Value') {

                if (item.discount != '' && actualPrice > 0 && parseFloat(item.discount) > actualPrice) {
                    item.discount = '';
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(321, ['Maximim Value', 'Original Amount']));
                }
            } else if (item.discount_type_id.id == 'Unit') {

                if (item.qty != '') {
                    if (item.discount != '' && (parseFloat(item.discount) * parseFloat(item.qty)) > actualPrice) {
                        item.discount = '';
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(321, ['Maximim Unit', 'total']));
                    }
                }
            }
        }
    }

    $scope.checkItemPrice = function(item) {

        if (item.standard_price != '' && Number(item.standard_price) > 999999999999999999) {
            item.standard_price = '';
            toaster.pop('error', 'Error', 'Maximum Value can not be greater than 999,999,999,999,999,999');
        }

        console.log('$scope.currencyConversionRatePO == ', $scope.currencyConversionRatePO);

        if (item.pricePurchaseInfoArray && item.pricePurchaseInfoArray.maxPurchasePrice)
            var convMaxPurchasePrice = parseFloat(item.pricePurchaseInfoArray.maxPurchasePrice) * parseFloat($scope.currencyConversionRatePO);
        // else if(item.pricePurchaseInfoArray && item.pricePurchaseInfoArray.maxPurchasePrice)
        //     var convMaxPurchasePrice = item.pricePurchaseInfoArray.maxPurchasePrice;

        if (item.standard_price && item.pricePurchaseInfoArray && convMaxPurchasePrice && parseFloat(item.standard_price) > convMaxPurchasePrice) {
            item.standard_price = convMaxPurchasePrice;
            toaster.pop('error', 'Error', 'Maximum Unit Price can not be greater than ' + convMaxPurchasePrice);
        }

        if (item.MaxPrice && $scope.currencyConversionRatePO)
            var convMaxPurchasePrice = parseFloat(item.MaxPrice) * parseFloat($scope.currencyConversionRatePO);
        else if (item.MaxPrice)
            var convMaxPurchasePrice = item.MaxPrice;

        if (item.standard_price && item.MaxPrice && parseFloat(item.standard_price) > convMaxPurchasePrice) {
            item.standard_price = convMaxPurchasePrice;
            toaster.pop('error', 'Error', 'Maximum Unit Price can not be greater than ' + convMaxPurchasePrice);
        }
    }


    $scope.grandTotal = function() {

        var netTotal = Number($scope.netTotal());
        var calcVat = Number($scope.calcVat());

        // $scope.rec.grand_total = +(Number(netTotal).toFixed(2)) + +(Number(calcVat).toFixed(2));
        $scope.rec.grand_total = Number(+(netTotal) + +(calcVat)).toFixed(2);

        $rootScope.grandTotalPurchaseOrder = $scope.rec.grand_total;
        return $scope.rec.grand_total;
    }

    $scope.rec.grand_total_converted = Number($scope.$parent.rec.grand_total / $scope.rec.currency_rate).toFixed(2);

    $scope.onChangeCurrencyRate = function() {

        console.log('rec.currency_rate == ', $scope.rec.currency_rate);

        if ($scope.rec.currency_rate && $scope.rec.currency_rate != 1)
            $scope.rec.grand_total_converted = Number($scope.rec.grand_total / $scope.rec.currency_rate).toFixed(2);
        else
            $scope.rec.grand_total_converted = $scope.rec.grand_total;

        // $scope.rec.grand_total_converted = ($scope.rec.currency_rate != undefined && Number($scope.rec.currency_rate) > 0) ? $scope.rec.grand_total / $scope.rec.currency_rate : $scope.rec.grand_total;

        /* if (!isNaN($scope.rec.grand_total_converted))
            $scope.rec.grand_total_converted = Number($scope.rec.grand_total_converted).toFixed(2);
        else
            $scope.rec.grand_total_converted = $scope.rec.grand_total; */

        // $rootScope.grandTotalPurchaseOrder = $scope.rec.grand_total;
        return $scope.rec.grand_total_converted;
    }

    $scope.updateGrandTotal = function() {
        var updateGrandTotalUrl = $scope.$root.pr + "srm/srminvoice/update-grand-total";

        var postData = {};
        postData.token = $scope.$root.token;
        postData.order_id = $scope.rec.id;
        postData.grandTotal = $scope.grandTotal();
        postData.netTotal = $scope.netTotal();
        postData.calcVat = $scope.calcVat();
        postData.order_date = $scope.rec.order_date;
        postData.defaultCurrencyID = $scope.$root.defaultCurrency;
        postData.invoiceCurrencyID = $rootScope.currencyID_PO.id;

        postData.type = 1;

        $http
            .post(updateGrandTotalUrl, postData)
            .then(function(res) {
                if (res.data.ack == true) {}
            });
    }

    $scope.deleteOrderLine = function(index, item, items) {

        /* if ($scope.rec.sell_to_cust_no == undefined || $scope.rec.sell_to_cust_no == null) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Supplier No.']));
            return false;
        } */

        var update_id = item.update_id;
        var warehouse_id = '';

        if (item.warehouses != undefined)
            var warehouse_id = item.warehouses.id;

        var productid = item.id;
        var orderid = $scope.rec.update_id;

        // var item_type = item.item_type;

        var del_sub_exp = $scope.$root.pr + "srm/srminvoice/delete-Purchase-order-item";

        if (update_id == undefined) {
            $scope.items.splice(index, 1);
            $scope.showReceiveStuff = false;


            angular.forEach($scope.items, function(obj) {
                if (obj.item_type == 0)
                    $scope.showReceiveStuff = true; // || obj.item_type == 2
            });

            $scope.$emit('showReceiveStuff', $scope.showReceiveStuff);
        } else {
            ngDialog.openConfirm({
                template: 'modalDeleteDialogId',
                className: 'ngdialog-theme-default-custom'
            }).then(function(value) {
                $http
                    .post(del_sub_exp, {
                        'id': update_id,
                        'productid': productid,
                        'warehouse_id': warehouse_id,
                        'orderid': orderid,
                        'table': 'srm_invoice_detail',
                        'item_type': item.item_type,
                        'token': $scope.$root.token
                    })
                    .then(function(res) {
                        if (res.data.ack == true) {
                            // $scope.items.splice(index);
                            $scope.items.splice(index, 1);
                            // $scope.getOrdersDetail(1);
                            $scope.showReceiveStuff = false;

                            angular.forEach($scope.items, function(obj) {
                                if (obj.item_type == 0)
                                    $scope.showReceiveStuff = true; //|| obj.item_type == 2
                            });

                            $scope.$emit('showReceiveStuff', $scope.showReceiveStuff);

                            $scope.volume = res.data.volume;
                            $scope.weight = res.data.weight;
                            $scope.volume_unit = res.data.volume_unit;
                            $scope.weightunit = res.data.weightunit;
                            $scope.weight_permission = res.data.weight_permission;
                            $scope.volume_permission = res.data.volume_permission;
                            if (($scope.weight_permission > 0 && $scope.weight && $scope.weight != 0) || ($scope.volume_permission > 0 && $scope.volume && $scope.volume != 0))
                                $scope.showVolumeWeight = 1;

                            $scope.updateGrandTotal();

                            toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        } else if (res.data.ack == 2) {

                            toaster.pop('success', 'Deleted', res.data.error);

                        } else toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(108));
                    }).catch(function(message) {
                        $scope.showLoader = false;

                        throw new Error(message.data);
                    });
            }, function(reason) {
                $scope.showLoader = false;
                console.log('Modal promise rejected. Reason: ', reason);
            });
        }
    }

    $scope.check_min_max = function(item) {

        // Validation for price offers
        if (item.arr_volume_discounts != undefined && item.arr_volume_discounts.length) {
            var flg = 0;
            angular.forEach(item.arr_volume_discounts, function(obj) {
                if (Number(item.qty) >= Number(obj.min_qty)) {
                    flg = 1;
                    if (obj.discount_type == 1) // %
                        item.standard_price = parseFloat(item.price_offer) - parseFloat(item.price_offer) * (parseFloat(obj.volume_discount) / 100);
                    else // value
                        item.standard_price = parseFloat(item.price_offer) - parseFloat(obj.volume_discount);
                    item.standard_price = parseFloat(item.standard_price); //.toFixed(2) //Number
                }
            });
            if (!flg)
                item.standard_price = parseFloat(item.price_offer);
            // item.standard_price = Number(item.price_offer);
        }
    }

    $scope.UpdateQty = function(item) {

        if (parseFloat(item.minPurchaseQty) != 0 && parseFloat(item.maxPurchaseQty) != 0) {

            if (item.item_type == 0 && (parseFloat(item.qty) < parseFloat(item.minPurchaseQty))) {
                toaster.pop('error', 'Info', 'Min Qty for this item is ' + item.minPurchaseQty + '!');
                item.qty = parseFloat(item.minPurchaseQty);
            }

            if (item.item_type == 0 && (parseFloat(item.qty) > parseFloat(item.maxPurchaseQty))) {
                toaster.pop('error', 'Info', 'Max Qty for this item is ' + item.maxPurchaseQty + '!');
                item.qty = parseFloat(item.maxPurchaseQty);
            }
        }

        if (item.item_type == 0 && parseFloat(item.qty) < 0) {
            item.remainig_qty = 0;
        } else if (item.item_type == 0 && item.qty != item.qtyItemAllocated) {
            if (item.qty < item.qtyItemAllocated) {
                toaster.pop('warning', 'Info', String(item.qtyItemAllocated) + ' quantity is already allocated!');
                item.qty = item.qtyItemAllocated;
            }

            if (item.qty == item.qtyItemAllocated)
                item.remainig_qty = 0;
            else
                item.remainig_qty = parseFloat(item.qty) - parseFloat(item.qtyItemAllocated);
        } else if (item.item_type == 0 && item.qty == item.qtyItemAllocated)
            item.remainig_qty = 0;

        if (item.item_type == 2) {

            var ttlCalcAdditionalCost = parseFloat(item.qty) * parseFloat(item.standard_price);
            var remainingAdditionalCost = parseFloat(ttlCalcAdditionalCost) - parseFloat(item.alreadyAddedAmount);

            if (remainingAdditionalCost < 0) {
                toaster.pop('warning', 'Info', String(item.alreadyAddedAmount) + ' Amount is already allocated!');
                item.qty = parseFloat(item.alreadyAddedAmount) / parseFloat(item.standard_price);
                item.remainingAdditionalCost = 0;
            } else
                item.remainingAdditionalCost = parseFloat(remainingAdditionalCost).toFixed(2);
        }
    }

    $scope.UpdateStandardPrice = function(item, discountOpt) {

        if (item.item_type == 2) {

            var ttlCalcAdditionalCost = parseFloat(item.total_price); //parseFloat(item.qty) * parseFloat(item.standard_price);
            var remainingAdditionalCost = parseFloat(ttlCalcAdditionalCost) - parseFloat(item.alreadyAddedAmount);

            if (remainingAdditionalCost < 0) {
                toaster.pop('warning', 'Info', String(item.alreadyAddedAmount) + ' Amount is already allocated!');

                if (discountOpt == 1) {

                    /* var total = 0;

                    if (item.qty > 0)
                        total = parseFloat(parseFloat(item.qty) * parseFloat(item.standard_price)).toFixed(3);
                    else
                        total = parseFloat(item.standard_price).toFixed(3);

                    var discountAmount = (-1) * parseFloat(remainingAdditionalCost);

                    if (item.discount_type_id && item.discount > 0) {

                        if (item.discount_type_id.id == 'Percentage') {
                            item.discount = (parseFloat(discountAmount) / parseFloat(total)) * 100;
                            // discount = parseFloat(total) * parseFloat(item.discount) / 100;
                        }
                        else if (item.discount_type_id.id == 'Value')
                            item.discount = parseFloat(discountAmount) - parseFloat(total);
                        else
                            item.discount = parseFloat(discountAmount) / parseFloat(item.qty);
                        // discount = (parseFloat(item.discount) * parseFloat(item.qty));
                    } */
                    // discount = item.discount;

                    item.discount = '';
                } else
                    item.standard_price = parseFloat(item.alreadyAddedAmount) / parseFloat(item.qty);

                item.remainingAdditionalCost = 0;
            } else
                item.remainingAdditionalCost = parseFloat(remainingAdditionalCost).toFixed(2);
        }

        item.standard_price = Number(item.standard_price);
    }

    var rec2 = {};
    $scope.get_vat_range = function() {
        // setup/srm/getVatRange
        var apiurl = $scope.$root.setup + 'srm/getVatRange';
        $scope.showLoader = true;
        $http
            .post(apiurl, { token: $rootScope.token })
            .then(function(res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {
                    $scope.VatRange = res.data.response[0];

                }

            });
    }

    $scope.get_vat_range();

    $scope.savePurchaseOrder = function(rec2, rec, mode) {

        $scope.showLoader = true;

        if (!$scope.rec.sell_to_cust_no && (!$scope.rec.order_code || $scope.items.length > 0)) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Supplier No.']));
            $scope.showLoader = false;
            return false;
        }

        $scope.netTotalAmount = $scope.netTotal();
        $scope.grand_totalAmount = $scope.grandTotal();

        if ($scope.rec.marketingProm == 1 && (!$scope.rec.linktoCustName)) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Link to Customer']));
            $scope.showLoader = false;
            return false;
        }

        if (parseFloat($scope.netTotalAmount) < 0 || parseFloat($scope.grand_totalAmount) < 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(566));
            $scope.showLoader = false;
            return false;
        }

        if ($scope.rec.order_date == null || $scope.rec.order_date == '' || $scope.rec.order_date == undefined) {
            $scope.rec.order_date = $scope.$root.get_current_date();
        }

        if ($scope.showReceiveStuff == true && ($scope.rec.receiptDate == null || $scope.rec.receiptDate == '' || $scope.rec.receiptDate == undefined)) {
            $scope.rec.receiptDate = $scope.$root.get_current_date();
            $scope.updateReceiptDateChk(1);
        }

        if (!$scope.rec.sell_to_cust_no && $scope.rec.order_code) {

            $scope.add_general(rec)
                .then(function(resAA) {

                    var rec2 = {};

                    if (!(mode > 0))
                        mode = 0;

                    if ($stateParams.id > 0)
                        rec2.invoice_id = $stateParams.id;
                    else
                        rec2.invoice_id = rec.id;

                    if ($scope.items.length == 0) {
                        $scope.purchaseOrderDeleteBtn = false;
                        $scope.check_srm_readonly = true;
                        $scope.showLoader = false;
                        $scope.makeInvoiceFormReadonly();
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));

                        /* $timeout(function () {
                            $state.go("app.editsrmorder", { id: rec2.invoice_id });
                        }, 500); */

                        return false;
                    }

                    rec2.net_amount = $scope.netTotal();
                    rec2.tax_amount = $scope.calcVat();
                    rec2.grand_total = $scope.grandTotal();

                    rec2.items_net_total = $scope.rec.items_net_total;
                    rec2.items_net_discount = $scope.rec.items_net_discount;
                    rec2.items_net_vat = $scope.rec.items_net_vat;

                    rec2.order_date = rec.invoice_date;
                    rec2.orderDate = rec.order_date;
                    rec2.note = rec.note;
                    rec2.defaultCurrencyID = $scope.$root.defaultCurrency;

                    rec2.currency_id = $rootScope.currencyID_PO.id; // $rootScope.currency_id.id;
                    rec2.posting_date = $rootScope.posting_date;
                    rec2.order_date = $scope.rec.order_date;

                    rec2.supplier_id = $scope.rec.sell_to_cust_id;
                    rec2.invoice_type = $scope.rec.type;



                    rec2.invoice_no = $scope.rec.order_no;
                    rec2.invoice_code = $scope.rec.order_code;

                    rec2.items = $scope.items;
                    rec2.token = $rootScope.token;

                    var validationchk = 0;
                    $scope.supplierLocMandatory = 0;

                    angular.forEach($scope.items, function(obj) {

                        if (obj.item_type == 0)
                            $scope.supplierLocMandatory = 1;

                        if (obj.discount_type_id != undefined && (obj.discount == null || obj.discount == undefined)) {
                            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(591, [obj.product_name]));
                            $scope.showLoader = false;
                            obj.discount = "";
                            validationchk++;
                        } else if (obj.discount_type_id == undefined && obj.discount != null && obj.discount != '' && obj.discount != undefined) {
                            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(592, [obj.product_name]));
                            $scope.showLoader = false;
                            obj.discount = "";
                            validationchk++;
                        }
                    });

                    /* if (rec2.invoice_id > 0) {

                        if ($scope.supplierLocMandatory == 1 && $scope.rec.ship_to_name != undefined) {

                            if (!($scope.rec.ship_to_name.length > 0)) {
                                $scope.disablePostInvBtn = false;
                                $scope.showLoader = false;
                                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(560));
                                return false;
                            }
                        }
                        else if ($scope.supplierLocMandatory == 1 && $scope.rec.ship_to_name == undefined) {
                            $scope.showLoader = false;
                            $scope.disablePostInvBtn = false;
                            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(560));
                            return false;
                        }
                    } */

                    if (validationchk > 0) {
                        $scope.showLoader = false;
                        return false;
                    }


                    /* var updateOrderUrl = $scope.$root.pr + "srm/srminvoice/update-purchase-order";

                    $scope.returnItems = [];

                    $http
                        .post(updateOrderUrl, rec2)
                        .then(function (res2) {


                            if (res2.data.ack == true) {
                                if (!(mode > 0)) {

                                    $rootScope.updateSelectedGlobalData("uom");
                                    $rootScope.updateSelectedGlobalData('item');
                                    // $scope.showLoader = true;
                                    $scope.getOrdersDetail()
                                        .then(function () {
                                            $scope.showLoader = false;
                                            toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));

                                            $scope.purchaseOrderDeleteBtn = false;
                                            $scope.check_srm_readonly = true;
                                            $scope.makeInvoiceFormReadonly();
                                        });

                                } else {
                                    $scope.showLoader = false;
                                    $rootScope.updateSelectedGlobalData("uom");
                                    $rootScope.updateSelectedGlobalData('item');
                                    $scope.returnItems = res2.data.returnItems;
                                    return true;
                                }
                            }
                            else if (res2.data.ack == 2) {

                                if (!(mode > 0)) {

                                    $scope.getOrdersDetail()
                                        .then(function () {
                                            $scope.showLoader = false;
                                            toaster.pop('success', 'Edit', res2.data.error);
                                            $scope.purchaseOrderDeleteBtn = false;
                                            $scope.check_srm_readonly = true;
                                            $scope.makeInvoiceFormReadonly();
                                        });

                                } else {
                                    $scope.showLoader = false;
                                    $scope.returnItems = res2.data.returnItems;
                                    return true;
                                }
                            }
                            else {

                                $scope.getOrdersDetail()
                                    .then(function () {
                                        $scope.showLoader = false;
                                        toaster.pop('error', 'Edit', res2.data.error);
                                    });
                                return false;
                            }

                        })
                        .catch(function (message) {
                            $scope.showLoader = false;

                            throw new Error(message.data);
                        }); */
                }).catch(function(message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                });
        } else {

            var check_approvals = $scope.$root.setup + "general/check-for-approvals";

            $http
                .post(check_approvals, {
                    'object_id': $scope.rec.id,
                    'purchase_order_total': $scope.grand_totalAmount,
                    'currency_id': $rootScope.currencyID_PO.id,
                    'order_date': $scope.rec.order_date,
                    'type': "4, 7",
                    'token': $scope.$root.token
                })
                .then(function(res) {

                    if (res.data.ack == 0) {
                        var response = res.data.response;
                        var already_checked = 0;
                        if (Number(response[0].type) == 4) { // && Number(response[0].criteria) < Number($scope.rec.grand_total)) {
                            if (Number(response[0].prev_status) == -1 || Number(response[0].prev_status) == 3 || Number(response[0].prev_status) == 6) {

                                var str = '';

                                if (Number(response[0].prev_status) == 3) {
                                    str = "Previously disapproved by " + response[0].responded_by + ", ";
                                }

                                $rootScope.approval_message = str + "The value of this Purchase Order exceeds the Purchase Order Level 1 limit of " + response[0].criteria + ", you need to queue this for approval.";
                                already_checked = 1;
                                toaster.pop('warning', 'Info', $rootScope.approval_message);
                            }
                        }

                        var response2 = {};
                        if (response.length == 1)
                            response2 = response[0];
                        else if (response.length == 2)
                            response2 = response[1];

                        if (already_checked == 0 && Number(response2.type) == 7 && Number(response2.criteria) < Number($scope.rec.grand_total)) {
                            if (Number(response2.prev_status) == -1 || Number(response2.prev_status) == 3 || Number(response2.prev_status) == 6) {

                                var str = '';

                                if (Number(response2.prev_status) == 3) {
                                    str = "Previously disapproved by " + response2.responded_by + ", ";
                                }

                                $rootScope.approval_message = str + "The value of this Purchase Order exceeds the Purchase Order Level 2 limit of " + response2.criteria + ", you need to queue this for approval.";

                                toaster.pop('warning', 'Info', $rootScope.approval_message);
                            }
                        }
                    }

                    $scope.add_general(rec)
                        .then(function(resAA) {

                            var rec2 = {};

                            if (!(mode > 0))
                                mode = 0;

                            if ($stateParams.id > 0)
                                rec2.invoice_id = $stateParams.id;
                            else
                                rec2.invoice_id = rec.id;

                            if ($scope.items.length == 0) {
                                $scope.purchaseOrderDeleteBtn = false;
                                $scope.check_srm_readonly = true;
                                $scope.showLoader = false;
                                $scope.makeInvoiceFormReadonly();
                                toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));

                                /* $timeout(function () {
                                    $state.go("app.editsrmorder", { id: rec2.invoice_id });
                                }, 500); */

                                return false;
                            }

                            rec2.net_amount = $scope.netTotal();
                            rec2.tax_amount = $scope.calcVat();
                            rec2.grand_total = $scope.grandTotal();

                            rec2.items_net_total = $scope.rec.items_net_total;
                            rec2.items_net_discount = $scope.rec.items_net_discount;
                            rec2.items_net_vat = $scope.rec.items_net_vat;

                            rec2.order_date = rec.invoice_date;
                            rec2.orderDate = rec.order_date;
                            rec2.note = rec.note;
                            rec2.defaultCurrencyID = $scope.$root.defaultCurrency;

                            rec2.currency_id = $rootScope.currencyID_PO.id; // $rootScope.currency_id.id;
                            rec2.posting_date = $rootScope.posting_date;
                            rec2.order_date = $scope.rec.order_date;

                            rec2.supplier_id = $scope.rec.sell_to_cust_id;
                            rec2.invoice_type = $scope.rec.type;
                            rec2.currency_rate = $scope.rec.currency_rate;



                            rec2.invoice_no = $scope.rec.order_no;
                            rec2.invoice_code = $scope.rec.order_code;

                            rec2.items = $scope.items;
                            rec2.token = $rootScope.token;

                            var validationchk = 0;
                            $scope.supplierLocMandatory = 0;

                            angular.forEach($scope.items, function(obj) {

                                if (obj.item_type == 0)
                                    $scope.supplierLocMandatory = 1;

                                if (obj.discount_type_id != undefined && (obj.discount == null || obj.discount == undefined)) {
                                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(591, [obj.product_name]));
                                    $scope.showLoader = false;
                                    obj.discount = "";
                                    validationchk++;
                                } else if (obj.discount_type_id == undefined && obj.discount != null && obj.discount != '' && obj.discount != undefined) {
                                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(592, [obj.product_name]));
                                    $scope.showLoader = false;
                                    obj.discount = "";
                                    validationchk++;
                                }
                            });


                            /* if (rec2.invoice_id > 0) {

                                if ($scope.supplierLocMandatory == 1 && $scope.rec.ship_to_name != undefined) {

                                    if (!($scope.rec.ship_to_name.length > 0)) {
                                        $scope.disablePostInvBtn = false;
                                        $scope.showLoader = false;
                                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(560));
                                        return false;
                                    }
                                }
                                else if ($scope.supplierLocMandatory == 1 && $scope.rec.ship_to_name == undefined) {
                                    $scope.showLoader = false;
                                    $scope.disablePostInvBtn = false;
                                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(560));
                                    return false;
                                }
                            } */

                            if (validationchk > 0) {
                                $scope.showLoader = false;
                                return false;
                            }


                            var updateOrderUrl = $scope.$root.pr + "srm/srminvoice/update-purchase-order";

                            $scope.returnItems = [];

                            $http
                                .post(updateOrderUrl, rec2)
                                .then(function(res2) {


                                    if (res2.data.ack == true) {

                                        if (!(mode > 0)) {

                                            $rootScope.updateSelectedGlobalData("uom");
                                            // $rootScope.updateSelectedGlobalData('item');
                                            // $scope.showLoader = true;
                                            $scope.getOrdersDetail()
                                                .then(function() {
                                                    $scope.showLoader = false;
                                                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));

                                                    $scope.purchaseOrderDeleteBtn = false;
                                                    $scope.check_srm_readonly = true;
                                                    $scope.makeInvoiceFormReadonly();
                                                });

                                        } else {
                                            $scope.showLoader = false;
                                            $rootScope.updateSelectedGlobalData("uom");
                                            // $rootScope.updateSelectedGlobalData('item');
                                            $scope.returnItems = res2.data.returnItems;
                                            return true;
                                        }
                                    } else if (res2.data.ack == 2) {

                                        if (!(mode > 0)) {

                                            $scope.getOrdersDetail()
                                                .then(function() {
                                                    $scope.showLoader = false;
                                                    toaster.pop('success', 'Edit', res2.data.error);
                                                    $scope.purchaseOrderDeleteBtn = false;
                                                    $scope.check_srm_readonly = true;
                                                    $scope.makeInvoiceFormReadonly();
                                                });

                                        } else {
                                            $scope.showLoader = false;
                                            $scope.returnItems = res2.data.returnItems;
                                            return true;
                                        }
                                    } else {

                                        $scope.getOrdersDetail()
                                            .then(function() {
                                                $scope.showLoader = false;
                                                toaster.pop('error', 'Edit', res2.data.error);
                                            });
                                        return false;
                                    }

                                })
                                .catch(function(message) {
                                    $scope.showLoader = false;

                                    throw new Error(message.data);
                                });
                        });
                });
        }
    }

    $scope.savePurchaseInvoice = function(rec) {

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

        invoiceRec.srm_purchase_code = rec.srm_purchase_code;
        invoiceRec.purchase_code_id = rec.purchase_code_id;
        invoiceRec.comm_book_in_no = rec.comm_book_in_no;
        invoiceRec.cust_order_no = rec.cust_order_no;
        invoiceRec.SaleOrderArr = {};
        invoiceRec.SaleOrderArr = $scope.selectedSaleOrderArr;

        invoiceRec.supp_order_no = rec.supp_order_no;
        invoiceRec.payable_bank = rec.payable_bank;
        invoiceRec.bank_account_id = rec.bank_account_id;

        invoiceRec.payment_terms_code = (rec.payment_terms_codes != undefined && rec.payment_terms_codes != '') ? rec.payment_terms_codes.id : 0;
        invoiceRec.payment_method_id = (rec.payment_method_ids != undefined && rec.payment_method_ids != '') ? rec.payment_method_ids.id : 0;

        invoiceRec.due_date = rec.due_date;
        invoiceRec.prev_code = rec.prev_code;
        invoiceRec.linktoCustID = rec.linktoCustID;
        invoiceRec.linktoCustName = rec.linktoCustName;
        invoiceRec.marketingProm = rec.marketingProm;
        invoiceRec.ship_to_phone = rec.ship_to_phone;
        invoiceRec.ship_to_contact = rec.ship_to_contact;
        invoiceRec.ship_to_email = rec.ship_to_email;

        invoiceRec.shipment_method_id = (rec.shipment_method_code != undefined && rec.shipment_method_code != '') ? rec.shipment_method_code.id : 0;
        invoiceRec.shipment_method = (rec.shipment_method_code != undefined && rec.shipment_method_code != '') ? rec.shipment_method_code.name : 0;

        invoiceRec.shipping_agent_id = rec.shipping_agent_id;
        invoiceRec.shipping_agent = rec.shipping_agent;
        invoiceRec.container_no = rec.container_no;
        invoiceRec.warehouse_booking_ref = rec.warehouse_booking_ref;
        invoiceRec.shippingPONotReq = rec.shippingPONotReq;
        invoiceRec.ReasonForshippingNotReq = rec.ReasonForshippingNotReq;

        invoiceRec.selectedShippingPO = rec.selectedShippingPO;
        invoiceRec.selectedShippingPOid = rec.selectedShippingPOid;

        invoiceRec.sale_person = rec.sale_person;
        invoiceRec.sale_person_id = rec.sale_person_id;

        invoiceRec.token = $scope.$root.token;
        invoiceRec.id = $stateParams.id;
        invoiceRec.note = rec.note;
        invoiceRec.externalnote = rec.externalnote;

        console.log('invoiceRec == ', invoiceRec);

        var updateInvoiceUrl = $scope.$root.pr + "srm/srminvoice/update-posted-invoice";

        return $http
            .post(updateInvoiceUrl, invoiceRec)
            .then(function(res) {
                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.check_pi_readonly = false;
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                } else
                    return res.data.error;

            }).catch(function(message) {
                $scope.showLoader = false;

                throw new Error(message.data);
            });
    }

    $scope.add_sublist = function(rec2, rec, mode) {
        var deferred = $q.defer();

        // $scope.showLoader = true;


        // rec.comment = rec.note;
        $scope.netTotalAmount = $scope.netTotal();
        $scope.grand_totalAmount = $scope.grandTotal();

        if (parseFloat($scope.netTotalAmount) < 0 || parseFloat($scope.grand_totalAmount) < 0) {
            // toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(566));
            $scope.showLoader = false;
            $scope.disablePostInvBtn = false;
            $scope.disableReceiveBtn = false;
            // return false;
            deferred.reject($scope.$root.getErrorMessageByCode(566));
        }

        /* $scope.saverecord = 1;
        $scope.saverecord = $scope.add_general(rec);

        if ($scope.saverecord == 0)
            return false; */
        $scope.add_general(rec)
            .then(function(resAA) {

                var rec2 = {};

                if (!(mode > 0))
                    mode = 0;

                if ($scope.items.length == 0) {
                    $scope.purchaseOrderDeleteBtn = false;
                    $scope.disablePostInvBtn = false;
                    $scope.disableReceiveBtn = false;
                    $scope.check_srm_readonly = true;
                    $scope.showLoader = false;
                    $scope.makeInvoiceFormReadonly();
                    // toaster.pop('success', 'Info', 'Order Saved Successfully');
                    deferred.reject('Order Saved Successfully!');
                    // return false;
                }

                rec2.net_amount = $scope.netTotal();
                rec2.tax_amount = $scope.calcVat();
                rec2.grand_total = $scope.grandTotal();

                rec2.items_net_total = $scope.rec.items_net_total;
                rec2.items_net_discount = $scope.rec.items_net_discount;
                rec2.items_net_vat = $scope.rec.items_net_vat;

                rec2.order_date = rec.invoice_date;
                rec2.orderDate = rec.order_date;
                rec2.note = rec.note;
                rec2.defaultCurrencyID = $scope.$root.defaultCurrency;

                rec2.currency_id = $rootScope.currencyID_PO.id; //$rootScope.currency_id.id;
                rec2.posting_date = $rootScope.posting_date;
                rec2.order_date = $scope.rec.order_date;
                rec2.currency_rate = $scope.rec.currency_rate;

                rec2.supplier_id = $scope.rec.sell_to_cust_id;
                rec2.invoice_type = $scope.rec.type;

                if ($stateParams.id > 0)
                    rec2.invoice_id = $stateParams.id;
                else
                    rec2.invoice_id = rec.id;

                rec2.invoice_no = $scope.rec.order_no;
                rec2.invoice_code = $scope.rec.order_code;

                rec2.items = $scope.items;
                rec2.token = $rootScope.token;

                var validationchk = 0;
                $scope.supplierLocMandatory = 0;

                angular.forEach($scope.items, function(obj) {

                    if (obj.item_type == 0)
                        $scope.supplierLocMandatory = 1;

                    if (obj.discount_type_id != undefined && (obj.discount == null || obj.discount == undefined)) {
                        // toaster.pop('error', 'Info', 'Discount price for Item ' + obj.product_name + ' is invalid!');
                        $scope.showLoader = false;
                        $scope.disablePostInvBtn = false;
                        $scope.disableReceiveBtn = false;
                        deferred.reject('Discount price for Item ' + obj.product_name + ' is invalid!');
                        obj.discount = "";
                        validationchk++;
                    } else if (obj.discount_type_id == undefined && obj.discount != null && obj.discount != '' && obj.discount != undefined) {
                        // toaster.pop('error', 'Info', 'Discount Type for Item ' + obj.product_name + ' is not Selected!');
                        $scope.showLoader = false;
                        $scope.disablePostInvBtn = false;
                        $scope.disableReceiveBtn = false;
                        deferred.reject('Discount Type for Item ' + obj.product_name + ' is not Selected!');
                        obj.discount = "";
                        validationchk++;
                    }

                    if (obj.standard_price == '' || obj.standard_price == undefined) {
                        obj.standard_price = 0;
                    }

                    if (obj.price == '' || obj.price == undefined) {
                        obj.price = 0;
                    }
                });

                if (rec2.invoice_id > 0) {

                    if ($scope.supplierLocMandatory == 1 && $scope.rec.ship_to_name) { // != undefined

                        if (!($scope.rec.ship_to_name.length > 0)) {
                            // toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(560));
                            $scope.showLoader = false;
                            $scope.disableReceiveBtn = false;
                            $scope.disablePostInvBtn = false;
                            // deferred.reject('Please add shipping data in shipping tab!');
                            deferred.reject('Please add shipping location!');
                            // return false;
                        } else if (mode != 2) {
                            $scope.showLoader = false;
                            $scope.disableReceiveBtn = false;
                            $scope.disablePostInvBtn = false;
                        }
                    } else if ($scope.supplierLocMandatory == 1 && !$scope.rec.ship_to_name) { // == undefined
                        // toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(560));
                        $scope.showLoader = false;
                        $scope.disableReceiveBtn = false;
                        $scope.disablePostInvBtn = false;
                        // deferred.reject('Please add shipping data in shipping tab!');
                        deferred.reject('Please add shipping location!');
                        // return false;
                    } else if ($scope.supplierLocMandatory == 0 && mode != 2) {
                        $scope.disableReceiveBtn = false;
                        $scope.disablePostInvBtn = false;
                    }

                    if ($scope.supplierLocMandatory == 1 && $scope.rec.shippingPONotReq == 1) {

                        if (!$scope.rec.ReasonForshippingNotReq || !($scope.rec.ReasonForshippingNotReq.length > 0)) {
                            $scope.showLoader = false;
                            $scope.disableReceiveBtn = false;
                            $scope.disablePostInvBtn = false;
                            deferred.reject('Please add reason for shipment not required.');
                        }
                    } else if ($scope.supplierLocMandatory == 1 && (!$scope.rec.shippingPONotReq || $scope.rec.shippingPONotReq == 0) && !($scope.rec.selectedShippingPOid > 0)) {
                        $scope.showLoader = false;
                        $scope.disableReceiveBtn = false;
                        $scope.disablePostInvBtn = false;
                        deferred.reject('Please add Linked PO(For Shipping)');
                    }
                }

                if (validationchk > 0) {
                    $scope.showLoader = false;
                    deferred.resolve();
                }


                var updateOrderUrl = $scope.$root.pr + "srm/srminvoice/update-purchase-order";

                $scope.returnItems = [];
                $scope.showLoader = true;

                return $http
                    .post(updateOrderUrl, rec2)
                    .then(function(res2) {
                        // $scope.showLoader = false;

                        if (res2.data.ack == true) {

                            if (!(mode > 0)) {
                                toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                                $rootScope.updateSelectedGlobalData("uom");
                                // $rootScope.updateSelectedGlobalData('item');
                                $scope.getOrdersDetail();

                            } else {
                                $rootScope.updateSelectedGlobalData("uom");
                                // $rootScope.updateSelectedGlobalData('item');
                                $scope.returnItems = res2.data.returnItems;
                                // return true;
                                deferred.resolve();
                            }
                        } else if (res2.data.ack == 2) {

                            if (!(mode > 0)) {
                                toaster.pop('success', 'Edit', res2.data.error);
                                $scope.getOrdersDetail();
                            } else {
                                $scope.returnItems = res2.data.returnItems;
                                // return true;
                                deferred.resolve();
                            }
                        } else {
                            // toaster.pop('error', 'Edit', res2.data.error);
                            $scope.getOrdersDetail();
                            $scope.disableReceiveBtn = false;
                            $scope.disablePostInvBtn = false;
                            deferred.reject(res2.data.error);

                            // return false;
                        }

                        $scope.purchaseOrderDeleteBtn = false;
                        $scope.check_srm_readonly = true;
                        $scope.makeInvoiceFormReadonly();

                        deferred.resolve();

                    })
                    .catch(function(message) {
                        $scope.showLoader = false;
                        $scope.disablePostInvBtn = false;
                        $scope.disableReceiveBtn = false;
                        // deferred.reject('Server is not Acknowledging');

                        // 
                        throw new Error(message.data);
                    });
            });

        return deferred.promise;
    }


    $scope.openEmailer = function(val) {
        setTimeout(function() {
            document.getElementById(val).click();
        }, 0)
    }

    function sumArray(arrayName) {
        arrayName = arrayName.reduce(function(a, b) {
            return a + b;
        });
        return arrayName;
    };

    function findObjectByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return i;
            }
        }
        return null;
    }


    $scope.showInvoiceModal = function(templateType, noModal) {

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


        /* 
        if (($scope.rec.bill_to_bank_name == null || $scope.rec.bill_to_bank_name == "") && (noModal == undefined || noModal != 2)){
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Payable Bank']));     
            return;
        }
        */

        if ($scope.check_srm_readonly == false) {
            toaster.pop('error', 'Error', 'Please Save');
            return;
        }
        $scope.showLoader = true;
        $scope.print_invoice_vals = {};
        var prntInvoiceUrl = $scope.$root.sales + "customer/order/print-invoice";

        var separate_by_warehouse = 0;
        if (templateType == 'purchaseDelivery' || templateType == 'purchaseWarehouse' || templateType == 'receiptNote')
            separate_by_warehouse = 1;

        var separate_by_allocation = 0;
        if (templateType == 'purchaseWarehouse')
            separate_by_allocation = 1;

        var postOptions = {
            id: $scope.rec.update_id,
            'type': '2',
            'separate_by_warehouse': separate_by_warehouse,
            'separate_by_allocation': separate_by_allocation,
            'templateType': templateType,
            token: $scope.$root.token
        }

        /* if(templateType == 'receiptNote'){
            postOptions.separate_by_warehouse = 1;
        } */

        $rootScope.printinvoiceFlag = false;
        $http
            .post(prntInvoiceUrl, postOptions)
            .then(function(res) {
                if (res.data.ack == true) {
                    $scope.print_invoice_vals = res.data.response;
                    $scope.print_invoice_vals.discountedValue = $rootScope.discountedPurchaseOrder;
                    $scope.print_invoice_vals.netValue = $rootScope.netValuePurchaseOrder;
                    $scope.print_invoice_vals.vatValue = $rootScope.vatValuePurchaseOrder;
                    $scope.print_invoice_vals.grandTotal = $rootScope.grandTotalPurchaseOrder;
                    $scope.print_invoice_vals.templateType = templateType;
                    $scope.print_invoice_vals.itemExists = $scope.showReceiveStuff;


                    /* if ($scope.print_invoice_vals.address_1 == $scope.print_invoice_vals.ship_address_1
                        && $scope.print_invoice_vals.address_2 == $scope.print_invoice_vals.ship_address_2
                        && $scope.print_invoice_vals.postcode == $scope.print_invoice_vals.ship_postcode) {
                        $scope.print_invoice_vals.ship_address_1 = '';
                        $scope.print_invoice_vals.ship_address_2 = '';
                        $scope.print_invoice_vals.ship_city = '';
                        $scope.print_invoice_vals.ship_county = '';
                        $scope.print_invoice_vals.ship_postcode = '';
                    } */


                    $scope.showShipFrom = 0;

                    angular.forEach($scope.print_invoice_vals.doc_details_arr, function(obj) {

                        if (obj.type == 0)
                            $scope.showShipFrom = 1;
                    });


                    if ($scope.print_invoice_vals.templateType == 'purchaseDelivery' ||
                        $scope.print_invoice_vals.templateType == 'purchaseWarehouse' ||
                        $scope.print_invoice_vals.templateType == "receiptNote") {

                        let currentUrl = window.location.href;
                        $scope.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;
                        $scope.print_invoice_vals.company_name = $rootScope.company_name;
                        $scope.print_invoice_vals.company_logo_url = $scope.company_logo_url;



                        $scope.print_invoice_vals.itemsSummary = [];
                        $scope.print_invoice_vals.total_records = Object.keys($scope.print_invoice_vals.doc_details_arr);

                        $scope.print_invoice_vals.uom_qty_total = new Array();

                        angular.forEach($scope.print_invoice_vals.doc_details_arr, function(obj1, index1) {
                            var itemsSummary = {};
                            itemsSummary.qty = [];
                            itemsSummary.uom_qty = [];
                            itemsSummary.total_pallet_qty = [];
                            itemsSummary.uom_qty_total = new Array();
                            itemsSummary.volume_total = new Array();
                            itemsSummary.weight_total = new Array();

                            itemsSummary.volume = [];
                            itemsSummary.volume_unit = [];
                            itemsSummary.weight = [];
                            itemsSummary.weightunit = [];


                            angular.forEach(obj1, function(obj, index) {
                                itemsSummary.qty.push(Number(obj.quantity));
                                itemsSummary.uom_qty.push(Number(obj.uom_qty));
                                itemsSummary.total_pallet_qty.push(Number(obj.pallet_qty));

                                itemsSummary.volume.push(Number(obj.volume));
                                itemsSummary.weight.push(Number(obj.weight));

                                itemsSummary.volume_unit.push(obj.volume_unit);
                                itemsSummary.weightunit.push(obj.weightunit);

                                idx = findObjectByKey(itemsSummary.uom_qty_total, 'uom', obj.uom);
                                if (idx == null) {
                                    itemsSummary.uom_qty_total.push({ 'uom': obj.uom, 'total_qty': 0 });
                                    itemsSummary.uom_qty_total[findObjectByKey(itemsSummary.uom_qty_total, 'uom', obj.uom)].total_qty += Number(obj.quantity);
                                } else
                                    itemsSummary.uom_qty_total[idx].total_qty += Number(obj.quantity);

                                idx2 = findObjectByKey(itemsSummary.volume_total, 'volume_unit', obj.volumeUnit);
                                if (idx2 == null) {
                                    itemsSummary.volume_total.push({ 'volume_unit': obj.volumeUnit, 'total_qty': 0 });
                                    itemsSummary.volume_total[findObjectByKey(itemsSummary.volume_total, 'volume_unit', obj.volumeUnit)].total_qty += Number(obj.volume);
                                } else
                                    itemsSummary.volume_total[idx2].total_qty += Number(obj.volume);

                                idx3 = findObjectByKey(itemsSummary.weight_total, 'weightunit', obj.weightUnit2);
                                if (idx3 == null) {
                                    itemsSummary.weight_total.push({ 'weightunit': obj.weightUnit2, 'total_qty': 0 });
                                    itemsSummary.weight_total[findObjectByKey(itemsSummary.weight_total, 'weightunit', obj.weightUnit2)].total_qty += Number(obj.weight);
                                } else
                                    itemsSummary.weight_total[idx3].total_qty += Number(obj.weight);
                            });

                            itemsSummary.totalQty = sumArray(itemsSummary.qty);
                            itemsSummary.totalUomQty = sumArray(itemsSummary.uom_qty);
                            itemsSummary.sumOfPallets = sumArray(itemsSummary.total_pallet_qty);
                            $scope.print_invoice_vals.itemsSummary.push(itemsSummary);
                        });

                    }

                    if ($scope.print_invoice_vals.templateType == "purchaseOrder" ||
                        $scope.print_invoice_vals.templateType == "purchaseInvoice") {

                        $scope.print_invoice_vals.total_records = Object.keys($scope.print_invoice_vals.doc_details_arr);

                        $scope.print_invoice_vals.uom_qty_total = new Array();

                        /* obj1.qty = [];
                        obj1.uom_qty = [];
                        obj1.total_pallet_qty = [];
                        obj1.uom_qty_total = new Array();
                        obj1.volume_total = new Array();
                        obj1.weight_total = new Array();

                        obj1.volume = [];
                        obj1.volume_unit = [];
                        obj1.weight = [];
                        obj1.weightunit = []; */

                        $scope.print_invoice_vals.volume_total = new Array();
                        $scope.print_invoice_vals.weight_total = new Array();


                        angular.forEach($scope.print_invoice_vals.doc_details_arr, function(obj1, index1) {

                            // obj1.volume.push(Number(obj1.volume));
                            // obj1.weight.push(Number(obj1.weight));

                            // obj1.volume_unit.push(obj1.volume_unit);
                            // obj1.weightunit.push(obj1.weightunit);

                            idx2 = findObjectByKey($scope.print_invoice_vals.volume_total, 'volume_unit', obj1.volumeUnit);
                            if (idx2 == null) {
                                $scope.print_invoice_vals.volume_total.push({ 'volume_unit': obj1.volumeUnit, 'total_qty': 0 });
                                $scope.print_invoice_vals.volume_total[findObjectByKey($scope.print_invoice_vals.volume_total, 'volume_unit', obj1.volumeUnit)].total_qty += Number(obj1.volume);
                            } else
                                $scope.print_invoice_vals.volume_total[idx2].total_qty += Number(obj1.volume);

                            idx3 = findObjectByKey($scope.print_invoice_vals.weight_total, 'weightunit', obj1.weightUnit2);
                            if (idx3 == null) {
                                $scope.print_invoice_vals.weight_total.push({ 'weightunit': obj1.weightUnit2, 'total_qty': 0 });
                                $scope.print_invoice_vals.weight_total[findObjectByKey($scope.print_invoice_vals.weight_total, 'weightunit', obj1.weightUnit2)].total_qty += Number(obj1.weight);
                            } else
                                $scope.print_invoice_vals.weight_total[idx3].total_qty += Number(obj1.weight);

                        });
                    }

                    if (templateType == "purchaseInvoice") {
                        templateUrl = "app/views/invoice_templates/purchase_invoice_modal.html"
                    } else if (templateType == "purchaseOrder") {
                        templateUrl = "app/views/invoice_templates/purchase_order_modal.html"
                    } else if (templateType == "purchaseDelivery" || templateType == "purchaseWarehouse" || templateType == "receiptNote") {

                        if (templateType == 'purchaseDelivery') {
                            templateUrl = 'app/views/invoice_templates/delivery_note_modal.html';
                        } else if (templateType == 'purchaseWarehouse') {
                            templateUrl = 'app/views/invoice_templates/warehouse_instructions_modal.html';
                        } else if (templateType == 'receiptNote') {
                            templateUrl = "app/views/invoice_templates/receipt_note_modal.html";
                        }

                        $scope.print_invoice_vals.detailed = {
                            delivery_date: $scope.rec.delivery_date,
                            delivery_time: $scope.rec.delivery_time,
                            shipping_agent: $scope.rec.shipping_agent,
                            shipping_agent_ref_no: $scope.rec.container_no,
                            ship_to_address: $scope.rec.ship_to_address,
                            ship_to_name: $scope.rec.ship_to_name,
                            ship_to_address2: $scope.rec.ship_to_address2,
                            ship_to_post_code: $scope.rec.ship_to_post_code,
                            ship_to_city: $scope.rec.ship_to_city

                        };
                    }

                    var invoicePdfModal = ModalService.showModal({
                        templateUrl: templateUrl,
                        controller: 'purchaseInvoiceModalController',
                        inputs: {
                            print_invoice_vals: $scope.print_invoice_vals,
                            noModal: noModal,
                            openEmailer: $scope.openEmailer
                        }
                    });

                    invoicePdfModal.then(function(res) {
                        res.element.modal();
                        if (noModal) {
                            res.element.modal("hide");
                        }
                        // if (templateType == "purchaseOrder") {
                        $scope.showLoader = false;
                        if (noModal) {
                            generatePdf.showLoader = true;
                            $timeout(function() {
                                generatePdf.generatePdf($scope.print_invoice_vals.templateType, $scope.print_invoice_vals, '', noModal);
                            }, 200)
                        }
                        // }
                        $scope.showLoader = false;
                    });
                } else {
                    $scope.showLoader = false;
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(511));
                }
            });

    }

    $scope.ReciptInvoiceModalarr = [];
    $scope.searchKeywordInv = {};

    $scope.getInvoicesForPaymentsList = function(rec) {

        $scope.disable_save = false;

        var postUrl = $scope.$root.pr + "srm/srminvoice/invoice-for-refund-listings";
        // invoice-for-payment-listings

        $scope.postData = {};

        // $scope.postData.searchKeywordInv = {};

        $scope.postData.parent_id = rec.parent_id;
        $scope.postData.doc_type = 2;
        $scope.postData.account_id = $scope.rec.bill_to_cust_id;
        $scope.postData.posting_date = $scope.paymentData.invoice_date; // rec.invoice_date;
        $scope.postData.currency_id = ($scope.rec.currency_id) ? $scope.rec.currency_id.id : 0;
        $scope.postData.sell_to_cust_id = $scope.rec.bill_to_cust_id;
        $scope.postData.token = $scope.$root.token;
        $scope.postData.more_fields = 1;
        $scope.postData.type = 1;

        $scope.showLoader = true;

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

                    // $scope.total_setteled = 0;

                    /*  $scope.paymentData.allocated_amount = 0
                    angular.forEach($scope.ReciptInvoiceModalarr, function(obj) {
                        $scope.paymentData.allocated_amount += Number(obj.paid_amount);
                    }); */

                    $scope.currency_code = res.data.response[0].currency_code;
                    // angular.element('#InvoicesForPayments').modal({ show: true });
                } else {
                    $scope.showLoader = false;
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            });

    }

    // $scope.amount_total = 0;

    $scope.netTotalPayment = function() {

        if ($scope.paymentData) {

            var ctotal = 0;
            angular.forEach($scope.ReciptInvoiceModalarr, function(item) {

                if (item.amount >= 0)
                    ctotal += Number(item.amount);
            });
            console.log('$scope.paymentData.debit_amount == ', $scope.paymentData.debit_amount);
            console.log('$scope.paymentData.allocated_amount == ', $scope.paymentData.allocated_amount);
            console.log('ctotal == ', ctotal);

            $scope.amount_left = Number(Number($scope.paymentData.debit_amount).toFixed(2) - Number(ctotal).toFixed(2) - Number($scope.paymentData.allocated_amount).toFixed(2)).toFixed(2);
            // console.log('$scope.amount_left == ', $scope.amount_left);
        } else
            $scope.amount_left = 0;

        return $scope.amount_left;

    }

    $scope.setremainingamount = function(item) {

        var amount2 = 0;

        if (item.is_infull == true) {

            if ((item.grand_total - item.paid_amount) == 0)
                item.amount = item.grand_total;
            else if (item.grand_total - item.paid_amount > 0)
                item.amount = (item.grand_total - item.paid_amount);

            if ($scope.amount_left < item.amount) item.amount = Number($scope.amount_left);

        } else if (item.amount != undefined) {

            if ((item.grand_total - item.paid_amount) == 0)
                item.amount = 0;
            else if (item.grand_total - item.paid_amount > 0)
                amount2 = (item.grand_total - item.paid_amount);

            if (item.amount > Number(amount2)) item.amount = Number(amount2);
        }

        item.amount = Number(item.amount).toFixed(2);
        // item.amount = Number(item.amount);
    }

    $scope.postJournal = function() {
        var dates_arr = [];
        var unbalanced_dates = '';
        var in_valid_entries = "";
        $scope.postponeVATCHK = 0;

        if ($scope.postponeVATCHK == 1) {

            ngDialog.openConfirm({
                template: 'app/views/srm_order/_confirm_postponed_vat.html',
                className: 'ngdialog-theme-default-custom'
            }).then(function(value) {
                $scope.showLoader = true;

                console.log(value);

                if (value == 1) $scope.postponed_vat = 1;
                else $scope.postponed_vat = 0;

                ngDialog.openConfirm({
                    // template: 'app/views/_confirm_modal.html',
                    template: 'modalcontinueid',
                    className: 'ngdialog-theme-default-custom'
                }).then(function(value) {

                    var post = {};
                    post.token = $scope.$root.token;
                    post.parent = $scope.postData.parent_id;
                    // post.items = $scope.receipt_sub_list;
                    post.postponed_vat = $scope.postponed_vat;

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

            }, function(reason) {

                $scope.disablePostInvBtn = false;
                $scope.showLoader = false;
                console.log('Modal promise rejected. Reason: ', reason);
            });
        } else {

            ngDialog.openConfirm({
                // template: 'app/views/_confirm_modal.html',
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
                            //$scope.get_gl_recipt_;sublist(1);
                            // $scope.get_receipt_main_list(1);
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

    $scope.AddPaymentAllocation = function(flag = 0) {

        $scope.disable_save = true;
        $scope.showLoader = true;

        var postData = {};
        postData.transaction_type = 1;
        postData.module_type = 2;
        postData.invoice_type = 5;

        postData.token = $scope.$root.token;
        postData.payment_id = $scope.postData.parent_id
        postData.payment_detail_id = $scope.paymentData.payment_detail_id;


        /* if (module_type == 2) // customer
        {
            postData.module_type = 1; //customer

            if (doc_type == 2)
                postData.invoice_type = 5; // sales invoice -> payment
            else if (doc_type == 3)
                postData.invoice_type = 6; // credit  invoice -> refund
        }
        */

        var selected_items = [];

        console.log('$scope.ReciptInvoiceModalarr == ', $scope.ReciptInvoiceModalarr);

        if ($scope.ReciptInvoiceModalarr) {

            angular.forEach($scope.ReciptInvoiceModalarr, function(obj) {

                if (obj.amount > 0) {
                    var invoice_type = 3;
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

                        // $scope.receipt_sub_list[$scope.current_index].allocated_amount = Number($scope.receipt_sub_list[$scope.current_index].allocated_amount) + Number(res.data.total_allocated);
                        // $scope.paymentData.allocated_amount = Number($scope.paymentData.allocated_amount) + Number(res.data.total_allocated);

                        // $scope.paymentData.total_remaining = Number(Number($scope.paymentData.debit_amount) - Number($scope.paymentData.allocated_amount)).toFixed(2);

                        if (flag > 0) {
                            $scope.postJournal();
                        } else {
                            $scope.showLoader = false;
                            angular.element('#payment_modal').modal('hide');
                        }

                    } else {
                        $scope.disable_save = false;
                        $scope.showLoader = false;
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(105));
                        // angular.element('#payment_modal').modal('hide');
                    }
                });
        }

    }

    $scope.sendforJournalPost = function() {
        $scope.showLoader = true;
        $scope.AddPaymentAllocation(1); // flag and is_post
    }

    $scope.supplierPayment = function(rec) {
        console.log('rec == ', rec);

        $scope.showLoader = true;

        var journalGetUrl = $scope.$root.pr + "srm/srminvoice/get-supplier-journal-for-invoice";

        let postData = {};
        postData.token = $scope.$root.token;
        postData.invoice_id = rec.id;

        $http
            .post(journalGetUrl, postData)
            .then(function(res) {
                $scope.showLoader = false;

                $scope.paymentData = {};
                $scope.paymentDataSearch = {}

                if (!($rootScope.order_posting_group_id > 0)) {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Supplier Posting Group']));
                    $scope.showLoader = false;
                    return;
                }

                $scope.paymentData.supplierId = rec.bill_to_cust_id;
                $scope.paymentData.supplierCode = rec.bill_to_cust_no;

                $scope.paymentData.posting_group_id = $rootScope.order_posting_group_id;

                $scope.paymentData.doc_type = 2;
                $scope.paymentData.module_type = 3;
                $scope.paymentData.grand_total = rec.grand_total;
                $scope.paymentData.currency = rec.currency_id.code;

                $scope.paymentData.invoice_id = rec.id;

                if (rec.currency_id.code == $scope.$root.defaultCurrencyCode)
                    rec.currency_rate = 1;

                if (res.data.ack == true) {
                    var resData = res.data.response;
                    $scope.paymentData.cnv_rate = resData.cnv_rate;
                    // $scope.paymentData.currency_id = rec.currency_id.id;
                    // $scope.paymentData.net_amount = rec.net_amount;

                    $scope.paymentData.supplier = resData.account_name;
                    $scope.paymentData.glcode = resData.glcode;
                    $scope.paymentData.acc_code = resData.glcode;
                    $scope.paymentData.postedStatus = resData.postedStatus;
                    $scope.paymentData.invoice_date = resData.posting_date;
                    $scope.paymentData.allocation_date = resData.allocation_date;
                    $scope.paymentData.debit_amount = resData.debit_amount;
                    $scope.paymentData.allocated_amount = resData.allocated_amount;
                    $scope.paymentData.converted_price = resData.converted_price;
                    $scope.paymentData.total_remaining = Number(resData.debit_amount) - Number(resData.allocated_amount);
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

                    $scope.getInvoicesForPaymentsList($scope.paymentData);

                    if (Number($scope.paymentData.debit_amount) == Number($scope.paymentData.debit_amount)) $scope.paymentData.allocate_full = 1;

                } else {

                    $scope.paymentData.supplier = rec.bill_to_name;
                    $scope.paymentData.cnv_rate = rec.currency_rate;
                    // $scope.paymentData.currency_id = rec.currency_id.id;                    
                    // $scope.paymentData.net_amount = rec.net_amount;                    
                    // $scope.paymentData.order_date = rec.order_date;
                    $scope.paymentData.glcode = '';
                    $scope.paymentData.acc_code = '';
                    $scope.paymentData.postedStatus = 0;
                    $scope.paymentData.invoice_date = rec.invoice_date;
                    $scope.paymentData.allocation_date = rec.invoice_date;
                    $scope.paymentData.debit_amount = rec.grand_total;
                    $scope.paymentData.allocated_amount = 0;
                    $scope.paymentData.converted_price = rec.grand_total_converted;
                    // $scope.paymentData.total_setteled = rec.grand_total;
                    $scope.paymentData.total_remaining = 0;
                    $scope.paymentData.total_setteled_other = 0;
                    $scope.paymentData.parent_id = 0;
                    $scope.paymentData.payment_detail_id = 0;
                    $scope.paymentData.paid = 0;
                    $scope.paymentData.allocate_full = 1;
                    $scope.paymentData.document_no = $scope.rec.order_code;

                    if (rec.payable_number && rec.account_payable_id) {

                        let accountStr = rec.payable_number.split(' - ');
                        let accountName = accountStr.slice(1, 10);

                        $scope.paymentData.balancing_account_code = accountStr[0];
                        $scope.paymentData.balancing_account_name = accountName.join(' - ');
                        $scope.paymentData.balancing_account_id = rec.account_payable_id;
                        $scope.paymentData.balancing_account = rec.payable_number;
                    }
                }
                angular.element('#payment_modal').modal({ show: true });
            });

        // $scope.get_invoice_list();
    }



    $scope.savePaymentModal = function(rec) {

        $scope.showLoader = true;
        payData = {};

        if (!(rec.supplierId > 0)) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Supplier No.']));
            $scope.showLoader = false;
            return false;
        }

        if (!(rec.balancing_account_id > 0)) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Balancing Account']));
            $scope.showLoader = false;
            return false;
        }

        if (!(rec.cnv_rate > 0)) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Conversion Rate']));
            $scope.showLoader = false;
            return false;
        }

        if (!(rec.debit_amount > 0)) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Amount']));
            $scope.showLoader = false;
            return false;
        }

        if (!($rootScope.order_posting_group_id > 0)) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Supplier Posting Group']));
            $scope.showLoader = false;
            return;
        }

        payData.invoice_id = rec.invoice_id;
        payData.account_id = rec.supplierId;
        payData.account_no = rec.supplierCode;
        payData.account_name = rec.supplier;

        payData.allocated_amount = rec.allocated_amount;
        payData.temp_allocated_amount = rec.allocated_amount;


        payData.balancing_account_code = rec.balancing_account_code;
        payData.balancing_account_name = rec.balancing_account_name;
        payData.balancing_account_id = rec.balancing_account_id;

        payData.cnv_rate = rec.cnv_rate;
        payData.converted_price = rec.converted_price;
        payData.created_date = rec.invoice_date;
        payData.transaction_type = 3;
        payData.credit_amount = 0;
        payData.debit_amount = rec.debit_amount;
        payData.currency_id = $scope.rec.currency_id;
        payData.converted_currency_id = $scope.$root.defaultCurrency;

        payData.document_no = rec.document_no;
        payData.doc_type = { id: "2", name: "Payment" };
        payData.document_type = payData.doc_type.id;

        payData.paid = rec.paid;
        payData.parent_id = rec.parent_id;
        payData.payment_detail_id = rec.payment_detail_id;

        payData.posting_date = rec.invoice_date;
        payData.allocation_date = rec.allocation_date;
        payData.posting_group_id = $rootScope.order_posting_group_id;

        console.log('payData === ', payData);

        if ($scope.paymentData.acc_code && $scope.paymentData.acc_code.length > 0) {

            console.log('acc_code == ', $scope.paymentData.acc_code);

            payData.acc_code = $scope.paymentData.acc_code;

            var journalAddUrl = $scope.$root.pr + "srm/srminvoice/add-supplier-journal-for-invoice";

            let post = {};
            post.selectdata = payData;
            post.token = $scope.$root.token;

            $http
                .post(journalAddUrl, post)
                .then(function(res) {
                    if (res.data.ack == true) {
                        // $scope.showLoader = false;
                        toaster.pop('success', 'Add', res.data.error);

                        $scope.paymentData.parent_id = res.data.parent_id;
                        // angular.element('#payment_modal').modal('hide');

                        $scope.supplierPayment($scope.rec);
                        // $scope.getInvoicesForPaymentsList(rec);

                        // $scope.get_gl_recipt_sublist($scope.parent_id, is_post);


                        return true;
                    } else {
                        $scope.showLoader = false;
                        return false;
                    }
                });


        } else {

            console.log('acc_code 1 == ', $scope.paymentData.acc_code);

            $scope.rec.module_type = 2;
            var table = 'gl_journal_receipt_supp';
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

                        var journalAddUrl = $scope.$root.pr + "srm/srminvoice/add-supplier-journal-for-invoice";

                        let post = {};
                        post.selectdata = payData;
                        post.token = $scope.$root.token;

                        $http
                            .post(journalAddUrl, post)
                            .then(function(res) {
                                if (res.data.ack == true) {
                                    $scope.showLoader = false;

                                    toaster.pop('success', 'Add', res.data.error);
                                    // angular.element('#payment_modal').modal('hide');
                                    $scope.paymentData.parent_id = res.data.parent_id;

                                    $scope.supplierPayment($scope.rec);
                                    // $scope.getInvoicesForPaymentsList(rec);

                                    // $scope.get_gl_recipt_sublist($scope.parent_id, is_post);

                                    return true;
                                } else {
                                    $scope.showLoader = false;
                                    return false;
                                }
                            });

                    } else {
                        $scope.showLoader = false;
                        toaster.pop('error', 'info', res.data.error);
                        return false;
                    }
                });
        }

        // $scope.showLoader = false;

    }


    $scope.getGLcode = function() {

        var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";
        $scope.postData = {};
        $scope.title = 'G/L Accounts';
        $scope.postData.token = $scope.$root.token;
        $scope.searchKeyword2 = {};

        $scope.type_id = 2;

        $scope.showLoader = true;
        $scope.showAllOption = true;

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

        $scope.paymentData.balancing_account_code = gl_data.code;
        $scope.paymentData.balancing_account_name = gl_data.name;
        $scope.paymentData.balancing_account_id = gl_data.id;
        $scope.paymentData.balancing_account = gl_data.code + " - " + gl_data.name;

        angular.element('#finance_set_gl_account').modal('hide');
    };

    $scope.allocateFullAmount = function(rec, flag) {
        /* 
        console.log('rec ==  ', rec);
        console.log('flag ==  ', flag);
        console.log('paymentData.allocated_amount ', $scope.paymentData.allocated_amount); 
        */

        /* if (flag > 0)
            $scope.paymentData.allocate_full = 0;

        if ($scope.paymentData.allocate_full > 0 && Number($scope.paymentData.total_remaining) >= Number($scope.paymentData.grand_total)) {
            $scope.paymentData.allocated_amount = Number($scope.paymentData.grand_total).toFixed(2);

            // $scope.paymentData.total_remaining = Number($scope.paymentData.total_remaining - $scope.paymentData.grand_total).toFixed(2);
        } else if (Number($scope.paymentData.allocated_amount) > Number(Number($scope.paymentData.debit_amount) - Number($scope.paymentData.total_setteled_other)).toFixed(2)) {
            toaster.pop('error', 'info', 'Allocated amount exceeds than payment');

            // console.log('total_remaining == ', $scope.paymentData.total_remaining, ', grand_total == ', $scope.paymentData.grand_total);
            // console.log('debit_amount == ', $scope.paymentData.debit_amount, ', total_setteled_other == ', $scope.paymentData.total_setteled_other);

            if (Number($scope.paymentData.total_remaining) >= Number($scope.paymentData.grand_total)) {
                $scope.paymentData.allocated_amount = Number($scope.paymentData.grand_total).toFixed(2);
            } else {
                $scope.paymentData.allocated_amount = Number(Number($scope.paymentData.debit_amount) - Number($scope.paymentData.total_setteled_other)).toFixed(2);
            }
        } */
        // else{
        // $scope.paymentData.total_remaining = Number($scope.paymentData.debit_amount - ($scope.paymentData.total_setteled_other + $scope.paymentData.grand_total)).toFixed(2); 
        // }
        // $scope.paymentData.total_remaining = Number(Number($scope.paymentData.debit_amount) - (Number($scope.paymentData.total_setteled_other) + Number($scope.paymentData.allocated_amount))).toFixed(2);
    }

    $scope.chk_allocate_amount = function() {

        /* var amount2 = 0;
        if ($scope.paymentData.allocate_full = 1) {
            if (($scope.paymentData.debit_amount - $scope.paymentData.total_setteled) == 0)
                $scope.paymentData.total_setteled = $scope.paymentData.debit_amount;
            else if ($scope.paymentData.debit_amount - $scope.paymentData.total_setteled > 0)
                item.amount = ($scope.paymentData.debit_amount - $scope.paymentData.total_setteled);
            if ($scope.amount_left < item.amount)
                item.amount = Number($scope.amount_left);
            // if (($scope.paymentData.debit_amount - $scope.paymentData.total_setteled) == 0)
            //     $scope.paymentData.total_setteled = $scope.paymentData.debit_amount;
            // else if ($scope.paymentData.debit_amount - $scope.paymentData.total_setteled > 0)
            //     item.amount = ($scope.paymentData.debit_amount - item.paid_amount);
            // if ($scope.amount_left < item.amount)
            //     item.amount = Number($scope.amount_left);
        } else if ($scope.paymentData.debit_amount) {
            if (($scope.paymentData.debit_amount - item.paid_amount) == 0)
                item.amount = 0;
            else if ($scope.paymentData.debit_amount - item.paid_amount > 0)
                amount2 = ($scope.paymentData.debit_amount - item.paid_amount);
            if (item.amount > Number(amount2))
                item.amount = Number(amount2);
        }

        item.amount = Number(item.amount).toFixed(2);
        $scope.amount_left = Number(Number($scope.amount_total.toFixed(2)) - Number(ctotal.toFixed(2)) - Number($scope.allocated_amount).toFixed(2)).toFixed(2); */
        // return $scope.amount_left;
    }

    $scope.ValidateAllocationDate = function() {
        var date_parts = $scope.paymentData.allocation_date.trim().split('/');
        var doc_to_alloc_date_parts = $scope.rec.invoice_date.trim().split('/');
        var doc_from_alloc_date_parts = $scope.paymentData.invoice_date.trim().split('/');
        var alloc_date = new Date(date_parts[2], date_parts[1] - 1, date_parts[0]);
        var doc_to_alloc_date = new Date(doc_to_alloc_date_parts[2], doc_to_alloc_date_parts[1] - 1, doc_to_alloc_date_parts[0]);
        var doc_from_alloc_date = new Date(doc_from_alloc_date_parts[2], doc_from_alloc_date_parts[1] - 1, doc_from_alloc_date_parts[0]);

        if (doc_from_alloc_date >= doc_to_alloc_date && alloc_date < doc_from_alloc_date) {
            toaster.pop('error', 'Error', 'Allocation date can not be earlier than ' + $scope.paymentData.invoice_date);
            $scope.paymentData.allocation_date = $scope.paymentData.invoice_date;

        } else if (doc_to_alloc_date >= doc_from_alloc_date && alloc_date < doc_to_alloc_date) {
            toaster.pop('error', 'Error', 'Allocation date can not be earlier than ' + $scope.rec.invoice_date);
            $scope.paymentData.allocation_date = $scope.rec.invoice_date;
        }
    }

    $scope.convert_amount = function() {

        console.log('cnv_rate ==  ', $scope.paymentData.cnv_rate);

        if ($scope.paymentData.cnv_rate && $scope.paymentData.cnv_rate != 1)
            $scope.paymentData.converted_price = Number($scope.paymentData.debit_amount / $scope.paymentData.cnv_rate).toFixed(2);
        else
            $scope.paymentData.converted_price = $scope.paymentData.debit_amount;
    }



    $scope.closePaymentModal = function() {
        angular.element('#payment_modal').modal('hide');
    }

    $scope.get_invoice_list = function(item, index) {

        $scope.disable_save = false;

        var singleSaveUrl = $scope.$root.gl + "chart-accounts/add-jl-journal-receipt-single";

        var item_data = {};

        item_data.token = $scope.$root.token;



        $scope.selected_doc_posting_date = item.posting_date;



        if (item.module_type != undefined)

            item.transaction_type = item.module_type.value;

        else

            item.transaction_type = 0;



        if (item.doc_type != undefined)

            item.document_type = item.doc_type.id;

        else

            item.document_type = 0;





        item_data.item = item;

        item_data.parent_id = $scope.parent_id;



        $http

            .post(singleSaveUrl, item_data)

        .then(function(res) {

            if (res.data.ack == true) {

                $scope.backend_data = 1;

                item.id = res.data.id;

                item.parent_id = $scope.parent_id;

                $scope.columns = [];

                $scope.ReciptInvoiceModalarr = [];

                //$scope.title = 'Salesperson';



                $scope.current_index = index;

                $scope.module_type = item.module_type;



                $scope.module_type_main = item.module_type;

                $scope.doc_type_main = (item.doc_type != undefined && item.doc_type.id > 0) ? item.doc_type.id : 0;

                $scope.balance_id_main = item.balance_id;

                $scope.journal_datemain = item.journal_date;

                $scope.posting_groupmain = item.posting_group_id;

                $scope.allocated_amount = item.allocated_amount;



                $scope.curency_code = (item.currency_id != undefined && item.currency_id.code != '') ? item.currency_id.code : '';

                $scope.select_curency_id = (item.currency_id != undefined && item.currency_id.id != '') ? item.currency_id.id : 0;



                $scope.payment_id = item.parent_id;

                $scope.payment_detail_id = item.id;



                if (item.cnv_rate)

                    $scope.cnv_rate = item.cnv_rate;

                else

                    $scope.cnv_rate = 0;





                if (item.posting_date === undefined || item.posting_date === null || item.posting_date === 0) {

                    toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Posting Date']));

                    return;

                }



                if (item.cnv_rate === undefined || item.cnv_rate === null || item.cnv_rate === 0) {

                    toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Converion Rate']));

                    return;

                }



                if (item.doc_type == undefined) {

                    toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Doc Type']));

                    return;

                }



                if (item.module_type === undefined) {

                    toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Transaction Type']));

                    return;

                } else {





                    $scope.postData = {};



                    $scope.cust_id = item.account_id;

                    $scope.doc_type = item.doc_type.id;



                    if (item.module_type.value == 1) {

                        toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(231, ['Customer', 'Supplier']));

                        return;

                    } else if (item.module_type.value == 2) {

                        $scope.postData.type = 2;

                        $scope.postData.title = 'Customer ' + item.doc_type.name + ' (' + item.account_no + ')';

                    } else if (item.module_type.value == 3) {



                        $scope.postData.type = 1;

                        $scope.postData.title = 'Supplier  ' + item.doc_type.name + ' (' + item.account_no + ')';

                    }



                    if (item.account_id == undefined || item.account_no == undefined || item.account_no == "" || Number(item.account_id) == 0) {

                        if ($scope.postData.type == 1)

                            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Supplier']));

                        else

                            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Customer']));

                        return;

                    }



                    if (item.credit_amount > 0)

                        $scope.amount_total = item.credit_amount;

                    if (item.debit_amount > 0)

                        $scope.amount_total = item.debit_amount;



                    $scope.final_amount = $scope.amount_total;
                    $scope.payment_currency = item.currency_id;
                    $scope.current_currency_id = item.currency_id;
                    $scope.journal_date = item.journal_date;
                    $scope.postData.sell_to_cust_id = item.account_id;
                    $scope.postData.token = $scope.$root.token;
                    $scope.postData.more_fields = 1;

                    /* if (item.module_type.value == 2) { // customer
                    
                                            if (item.doc_type.id == 2) // payment
                    
                                                var postUrl = $scope.$root.sales + "customer/order/invoice-for-refund-listings";
                    
                                            if (item.doc_type.id == 3) // refund
                    
                                                var postUrl = $scope.$root.sales + "customer/order/invoice-for-payment-listings";
                    
                                        } else if (item.module_type.value == 3) { // supplier
                    
                                            if (item.doc_type.id == 2) // payment */

                    var postUrl = $scope.$root.pr + "srm/srminvoice/invoice-for-refund-listings";

                    /*     if (item.doc_type.id == 3) // refund
                    
                                                var postUrl = $scope.$root.pr + "srm/srminvoice/invoice-for-payment-listings";
                    
                                        } */



                    $scope.postData.parent_id = $scope.parent_id;
                    $scope.postData.doc_type = item.doc_type.id;
                    $scope.postData.account_id = item.account_id;
                    $scope.postData.posting_date = item.posting_date;
                    $scope.postData.currency_id = item.currency_id.id;
                    $scope.showLoader = true;

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
                                angular.element('#InvoicesForPayments').modal({ show: true });
                            } else {
                                $scope.showLoader = false;
                                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                            }
                        });
                }
            } else
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
        });
    }



    $scope.deletePurchaseOrder = function() {
        var deletePurchaseOrderUrl = $scope.$root.pr + "srm/srminvoice/delete-Purchase-Order-before-save";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function(value) {
            $http
                .post(deletePurchaseOrderUrl, { 'id': $scope.rec.id, 'token': $scope.$root.token })
                .then(function(res) {

                    if (res.data.ack == true) {
                        $state.go("app.srmorder");
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }

                }).catch(function(message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                });
        }, function(reason) {
            $scope.showLoader = false;
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.discardPurchaseOrder = function(rec2, rec) {

        var deletePurchaseOrderUrl = $scope.$root.pr + "srm/srminvoice/delete-Purchase-Order-before-save";

        ngDialog.openConfirm({
            template: 'modalDiscardPurchaseOrderDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function(value) {
                $http
                    .post(deletePurchaseOrderUrl, { 'id': $scope.rec.id, 'token': $scope.$root.token })
                    .then(function(res) {

                        $state.go("app.srmorder");
                        /* if (res.data.ack == true) {
                            toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        }
                        else {
                            toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                        } */
                    }).catch(function(message) {
                        $scope.showLoader = false;

                        throw new Error(message.data);
                    });
            },
            function(reason) {
                $scope.showLoader = false;
                console.log('Modal promise rejected. Reason: ', reason);
            });
    }



    //var rec = {};
    $scope.formData = {};
    $scope.record = {};

    $scope.InvoiceChk = false;

    var counter = 1;
    $scope.check_order_complete = $scope.check_readonly;

    var getOrdersDetailCount;




    $scope.getOrdersDetail = function(readonlyModeFalse, additionalCostMode, getOrdersDetailCount) {

        var total_rec_recvie = total_rec_invice = 0;
        var StillNeedAllocation = 0;

        $scope.show_stock = true;
        $scope.show_invoice = true;
        $scope.show_recieve_list_anchor = true;
        $scope.showReceiveStuff = false;
        $scope.allWarehouseEmails = [];

        $scope.$emit('showReceiveStuff', $scope.showReceiveStuff);

        $scope.volume = 0;
        $scope.weight = 0;
        $scope.volume_unit = '';
        $scope.weightunit = '';
        $scope.weight_permission = 0;
        $scope.volume_permission = 0;

        $scope.showVolumeWeight = 0;

        if ($stateParams.id > 0 && !(readonlyModeFalse > 0)) {
            $scope.makeInvoiceFormReadonly();
            $scope.check_srm_readonly = true;
            var invoiceid = $stateParams.id;
        } else
            var invoiceid = $scope.rec.update_id;

        // if(readonlyModeFalse == -1) 
        //     $scope.showLoader = true;

        var getProduct = $scope.$root.pr + "srm/srminvoice/get-invoice-sublist";

        if (getOrdersDetailCount == undefined) getOrdersDetailCount = $rootScope.maxHttpRepeatCount;
        return $http
            .post(getProduct, {
                'invoice_id': invoiceid,
                'orderType': $rootScope.orderType,
                'token': $scope.$root.token
            })
            .then(function(rsQtItem) {
                $scope.items = [];

                // if(readonlyModeFalse == -1) 
                //     $scope.showLoader = false;
                $scope.$emit('turnOnLoader', $scope.turnOnLoader);

                if (rsQtItem.data.ack == true) {

                    if (!$rootScope.arrVATPostGrpPurchase)
                        $rootScope.arrVATPostGrpPurchase = rsQtItem.data.arrVATPostGrpPurchase;

                    angular.forEach(rsQtItem.data.response, function(elem, detIndex) {
                        var detail = {};
                        detail.warehouse_email = elem.warehouse_email;
                        try {
                            detail.warehouse_email = detail.warehouse_email.split(";");
                            angular.forEach(detail.warehouse_email, function(emailObj, index) {
                                var filteredWarehouseEmail = $scope.allWarehouseEmails.filter(function(o) {
                                    return o.username == emailObj;
                                })
                                if (filteredWarehouseEmail.length == 0)
                                    $scope.allWarehouseEmails.push({ id: $scope.allWarehouseEmails.length, username: emailObj });
                            });
                        } catch (msg) {
                            console.log("no warehouse email set or e-dispatch note turned off..");
                        }


                        detail.purchase_status = elem.purchase_status;
                        detail.stock_check = elem.stock_check;
                        detail.rawMaterialProduct = elem.rawMaterialProduct;
                        detail.raw_material_gl_id = elem.raw_material_gl_id;
                        detail.raw_material_gl_code = elem.raw_material_gl_code;
                        detail.raw_material_gl_name = elem.raw_material_gl_name;
                        detail.update_id = elem.id;

                        detail.id = elem.product_id;
                        detail.product_name = elem.product_name;
                        detail.product_code = elem.product_code;

                        detail.min_quantity = elem.min_quantity;
                        detail.max_quantity = elem.max_quantity;
                        detail.purchase_unit = elem.unit_measure_id;
                        detail.uomID = elem.uom_id;
                        detail.currentStock = elem.currentStock;

                        detail.unit_of_measure_name = elem.unit_measure;
                        detail.unit_id = elem.unit_measure_id;
                        detail.unit_parent = elem.unit_parent_id;
                        detail.sale_unit_qty = elem.unit_qty;
                        detail.category_id = elem.cat_id;
                        detail.item_type = elem.type;

                        if (detail.item_type == 0) {
                            detail.minPurchaseQty = elem.min_quantity;
                            detail.maxPurchaseQty = elem.max_quantity;
                        }

                        if (detail.item_type == 2) {
                            detail.units = elem.unit_measure;
                            detail.uom = elem.unit_measure;
                            detail.descriptionID = elem.descriptionID;
                        }

                        detail.isGLVat = false;

                        if ($rootScope.defaultCompany == 133) {

                            if (detail.item_type == 1) {
                                //PBI: check is vat gl code.
                                if (detail.product_code == elem.vatRange.gl1AccountCode ||
                                    detail.product_code == elem.vatRange.gl2AccountCode ||
                                    detail.product_code == elem.vatRange.gl3AccountCode) {
                                    detail.isGLVat = true;
                                } else {
                                    detail.isGLVat = false;
                                }
                            }
                        } else {

                            if (detail.item_type == 1) {
                                //PBI: check is vat gl code.
                                if (detail.product_code >= elem.vatRange.startRangeCode && detail.product_code <= elem.vatRange.endRangeCode) {
                                    detail.isGLVat = true;
                                } else {
                                    detail.isGLVat = false;
                                }
                                //vat ranges for gli listing
                                detail.startVatRange = elem.vatRange.startRangeCode;
                                detail.endVatRange = elem.vatRange.endRangeCode;
                            }
                        }

                        // if (parseFloat(elem.qty) > 0)
                        detail.qty = parseFloat(elem.qty);

                        if (elem.unit_price)
                            detail.standard_price = parseFloat(elem.unit_price);
                        else
                            detail.standard_price = 0;

                        if (parseFloat(elem.discount) > 0)
                            detail.discount = parseFloat(elem.discount);
                        else
                            detail.discount = '';

                        detail.sale_unit_id = elem.sale_unit_id;
                        detail.purchase_unit_id = elem.purchase_unit_id;

                        detail.primary_unit_of_measure_id = elem.primary_unit_of_measure_id;
                        detail.primary_unit_of_measure_name = elem.primary_unit_of_measure_name;

                        angular.forEach($scope.arr_discount_type, function(obj) {
                            if (obj.id == elem.discount_type)
                                detail.discount_type_id = obj;
                        });

                        /* angular.forEach($rootScope.arr_vat, function (obj) {
                            if (obj.id == elem.vat_id)
                                detail.vats = obj;
                        }); */

                        if (!($rootScope.order_posting_group_id)) {
                            $rootScope.order_posting_group_id = elem.bill_to_posting_group_id;
                        }

                        angular.forEach($rootScope.arrVATPostGrpPurchase, function(obj) {

                            if (obj.id == elem.vat_id) {
                                detail.vat = obj.name;
                                detail.vat_value = obj.vat_value;
                                detail.vat_id = obj.id;
                                detail.vats = obj;
                            }
                        });

                        detail.warehouse_id = elem.warehouse_id;

                        detail.qtyItemAllocated = 0;

                        if (detail.item_type == 0) {

                            detail.arr_units = [];
                            detail.arr_units = elem.arr_units.response;

                            detail.arr_prod_warehouse = [];
                            detail.arr_prod_warehouse = elem.arr_warehouse.response;

                            detail.pricePurchaseInfoArray = [];
                            detail.pricePurchaseInfoArray = elem.pricePurchaseInfoArray;

                            if (detail.arr_units != undefined) {

                                angular.forEach(detail.arr_units, function(obj) {
                                    if (obj.id == elem.unit_measure_id)
                                        detail.units = obj;
                                });
                            }

                            if (detail.arr_prod_warehouse != undefined) {
                                angular.forEach(detail.arr_prod_warehouse, function(obj) {
                                    if (obj.id == elem.warehouse_id)
                                        detail.warehouses = obj;
                                });
                            }

                            detail.qtyItemAllocated = elem.allocQty;
                            // detail.arr_volume_discounts = [];

                            if (elem.priceOfferArray && elem.priceOfferArray[0]) {
                                detail.price_offer = elem.priceOfferArray[0].price_offer;
                                detail.price_offer_id = elem.priceOfferArray[0].id;
                                detail.minPurchaseQty = elem.priceOfferArray[0].minSaleQty;
                                detail.maxPurchaseQty = elem.priceOfferArray[0].maxSaleQty;
                                detail.arr_volume_discounts = elem.priceOfferArray[0].arr_volume_discounts;
                            }

                            detail.remainig_qty = parseFloat(detail.qty) - parseFloat(elem.allocQty);

                            if (detail.remainig_qty < 0)
                                detail.remainig_qty = 0;

                            if (detail.purchase_status == 0)
                                StillNeedAllocation++;

                            if (detail.purchase_status == 1)
                                total_rec_recvie++;

                            if (detail.purchase_status == 2)
                                total_rec_invice++;

                            if (detail.purchase_status == 3) {
                                total_rec_recvie++;
                                total_rec_invice++;
                            }

                            $scope.showReceiveStuff = true;
                            $scope.$emit('showReceiveStuff', $scope.showReceiveStuff);
                        }

                        if (detail.item_type == 1) {
                            // total_rec_invice++;
                            var count = $scope.items.length - 1;

                            angular.forEach($rootScope.gl_arr_units, function(obj) {
                                if (obj.id == elem.unit_measure_id)
                                    detail.units = obj;
                            });
                        }

                        if (detail.item_type == 2) {
                            var ttlCalcAdditionalCost = parseFloat(detail.qty) * parseFloat(detail.standard_price);

                            var remainingAdditionalCost = parseFloat(ttlCalcAdditionalCost) - parseFloat(elem.alreadyAddedAmount);
                            detail.remainingAdditionalCost = parseFloat(remainingAdditionalCost).toFixed(2);

                            detail.alreadyAddedAmount = parseFloat(elem.alreadyAddedAmount).toFixed(2);

                            // $scope.showReceiveStuff = true;
                        }

                        $scope.items.push(detail);
                        // $scope.checkDuplWHItem(detail, detIndex);
                    });

                    $scope.$emit('PurchaseLines', $scope.items);
                    $scope.$emit('PurchaseStatus', total_rec_invice);

                    if (total_rec_recvie > 0) {
                        //$scope.enable_btn_dispatch = true;
                        $scope.show_recieve_list = true;
                        $scope.show_recieve_list_anchor = false;
                        $scope.enable_btn_invoice = true;
                    }

                    if (total_rec_invice > 0) {
                        $scope.enable_btn_invoice = true;
                        $scope.show_recieve_list = true;
                        $scope.InvoiceChk = true;
                        //$scope.show_recieve_list_anchor = false;
                        $scope.show_recieve_list_anchor = true;
                    }

                    if (rsQtItem.data.total == 0) {
                        $scope.submit_show_invoicee = true;
                        $scope.show_recieve_list_anchor = true;
                    }

                    if (StillNeedAllocation > 0)
                        $scope.show_recieve_list = false;


                    $scope.$emit('show_recieve_list', $scope.show_recieve_list);

                    // $scope.netTotalAmount = $scope.netTotal();
                    // $scope.grand_totalAmount = $scope.grandTotal();

                    $scope.volume = rsQtItem.data.volume;
                    $scope.weight = rsQtItem.data.weight;
                    $scope.volume_unit = rsQtItem.data.volume_unit;
                    $scope.weightunit = rsQtItem.data.weightunit;
                    $scope.weight_permission = rsQtItem.data.weight_permission;
                    $scope.volume_permission = rsQtItem.data.volume_permission;

                    // if($scope.weight_permission >0 || $scope.volume_permission>0)
                    //     $scope.showVolumeWeight = 1;
                    if (($scope.weight_permission > 0 && $scope.weight && $scope.weight != 0) || ($scope.volume_permission > 0 && $scope.volume && $scope.volume != 0))
                        $scope.showVolumeWeight = 1;
                }


            }).catch(function(e) {
                if (getOrdersDetailCount != 0) return $scope.getOrdersDetail(readonlyModeFalse, additionalCostMode, getOrdersDetailCount - 1);

                $scope.showLoader = false;

                throw new Error(e.data);
            });
    }



    if ($scope.$root.order_status == 'ORDER_COMPLETED')
        $scope.check_order_complete = 0;

    var total_rec_recvie = total_rec_invice = 0;
    $scope.items = [];
    var total_rec_recvie = total_rec_invice = 0;
    $scope.show_stock = true;
    $scope.show_invoice = true;
    $scope.show_recieve_list_anchor = true;

    if ($stateParams.id !== undefined) {
        $scope.getOrdersDetail();
    }



    $scope.edit_recive_stock = function() {
        // $scope.show_recieve_list = false;
        $scope.show_recieve_list_anchor = true;
        $scope.show_recieve_list_anchor_allocate = false;
    }

    var getStorageLocCount;



    $scope.get_storage_location_data = function(loc_id, getStorageLocCount) {

        var cost_uom_postUrl = $scope.$root.setup + "warehouse/get-warehouse-sub-loc-cost-uom";

        if (getStorageLocCount == undefined) getStorageLocCount = $rootScope.maxHttpRepeatCount;
        $http
            .post(cost_uom_postUrl, {
                'token': $scope.$root.token,
                'wrh_id': $scope.formData.warehouses_id,
                'location_id': loc_id
            })
            .then(function(res) {

                if (res.data.ack == true) {
                    $scope.formData.uom = res.data.response.uom;
                    $scope.formData.cost = res.data.response.cost;
                    $scope.formData.currency = res.data.response.currency;
                }
            }).catch(function(e) {
                if (getStorageLocCount != 0) return $scope.get_storage_location_data(loc_id, getStorageLocCount - 1);

                $scope.showLoader = false;

                throw new Error(e.data);
            });
    }

    var getCostUomLocCount;



    $scope.get_cost_uom_location = function(bin_id, getCostUomLocCount) {

        var cost_uom_postUrl = $scope.$root.setup + "warehouse/get-warehouse-sub-loc-cost-uom";

        if (getCostUomLocCount == undefined) getCostUomLocCount = $rootScope.maxHttpRepeatCount;
        $http
            .post(cost_uom_postUrl, {
                'token': $scope.$root.token,
                'wrh_id': $scope.formData.warehouses_id,
                'location_id': bin_id
            })
            .then(function(res) {

                if (res.data.ack == true) {
                    $scope.formData.uom = res.data.response.uom;
                    $scope.formData.cost = res.data.response.cost;
                    $scope.formData.currency = res.data.response.currency;
                }
            }).catch(function(e) {
                if (getCostUomLocCount != 0) return $scope.get_cost_uom_location(bin_id, getCostUomLocCount - 1);

                $scope.showLoader = false;

                throw new Error(e.data);
            });
    }

    $scope.callbackBeforeStockAllocationMigration = function(data) {
        var storageLocList = []
        angular.forEach($scope.storage_loc, function(obj) {
            storageLocList.push(`${obj.id}/${obj.Storage_location.split("(")[0]}`)
        });
        storageLocList = storageLocList.join(",");
        data.additionalParams = [{
                type: "Number",
                sourceTable: "",
                sourceField: "",
                targetTable: "warehouse_allocation",
                targetField: "order_id",
                columnName: "Purchase Order Number",
                value: $scope.formData.order_id
            },
            {
                type: "Number",
                sourceTable: "",
                sourceField: "",
                targetTable: "warehouse_allocation",
                targetField: "purchase_order_detail_id",
                columnName: "Item Line ID",
                value: $scope.formData.orderLineID
            },
            {
                type: "Number",
                sourceTable: "",
                sourceField: "",
                targetTable: "warehouse_allocation",
                targetField: "product_id",
                columnName: "Product ID",
                value: $scope.formData.product_id
            },
            {
                type: "Number",
                sourceTable: "",
                sourceField: "",
                targetTable: "warehouse_allocation",
                targetField: "warehouse_id",
                columnName: "Warehouse ID",
                value: $scope.formData.warehouses_id
            },
            {
                type: "Number",
                sourceTable: "",
                sourceField: "",
                targetTable: "warehouse_allocation",
                targetField: "type",
                columnName: "Stock Allocation ID",
                value: 1
            },
            {
                type: "Number",
                sourceTable: "",
                sourceField: "",
                targetTable: "warehouse_allocation",
                targetField: "supplier_id",
                columnName: "Supplier ID",
                value: $scope.rec.sell_to_cust_id
            },
            {
                type: "Date2UNIX",
                sourceTable: "",
                sourceField: "",
                targetTable: "warehouse_allocation",
                targetField: "order_date",
                columnName: "Purchase Order Date",
                value: $scope.rec.order_date
            },
            {
                type: "String",
                sourceTable: "",
                sourceField: "",
                targetTable: "warehouse_allocation",
                targetField: "unit_measure",
                columnName: "Unit Of Measure Name",
                value: $scope.formData.unit_of_measure_name
            },
            {
                type: "Number",
                sourceTable: "",
                sourceField: "",
                targetTable: "warehouse_allocation",
                targetField: "primary_unit_id",
                columnName: "Primary Unit ID",
                value: $scope.formData.primary_unit_id
            },
            {
                type: "String",
                sourceTable: "",
                sourceField: "",
                targetTable: "warehouse_allocation",
                targetField: "primary_unit_name",
                columnName: "Primary Unit Name",
                value: $scope.formData.primary_unit_name
            },
            {
                type: "Number",
                sourceTable: "",
                sourceField: "",
                targetTable: "warehouse_allocation",
                targetField: "primary_unit_qty",
                columnName: "Primary Unit Quantity",
                value: $scope.formData.primary_unit_qty
            },
            {
                type: "Number",
                sourceTable: "",
                sourceField: "",
                targetTable: "warehouse_allocation",
                targetField: "unit_measure_id",
                columnName: "Unit ID",
                value: $scope.formData.unit_of_measure_id
            },
            {
                type: "String",
                sourceTable: "",
                sourceField: "",
                targetTable: "warehouse_allocation",
                targetField: "unit_measure_name",
                columnName: "Unit Name",
                value: $scope.formData.unit_of_measure_name
            },
            {
                type: "Number",
                sourceTable: "",
                sourceField: "",
                targetTable: "warehouse_allocation",
                targetField: "unit_measure_qty",
                columnName: "Unit Qty",
                value: $scope.formData.unit_of_measure_qty
            },
            {
                type: "Number",
                sourceTable: "",
                sourceField: "",
                targetTable: "localVariable",
                targetField: "qty_to_allocate",
                columnName: "Unit Qty",
                value: $scope.total_remaing || 0
            },
            {
                type: "Number",
                sourceTable: "",
                sourceField: "",
                targetTable: "warehouse_allocation",
                targetField: "purchase_status",
                columnName: "Purchase Status",
                value: 1
            },
            {
                type: "DefinedList2",
                sourceTable: storageLocList,
                sourceField: "",
                targetTable: "warehouse_allocation",
                targetField: "location",
                columnName: "Storage Location*",
                value: "**"
            },
        ]
        return data;
    }

    var get_warehouseCount;


    $scope.get_warehouse = function(item, rec, index, get_warehouseCount) {

        if (rec.sell_to_cust_no == undefined || rec.sell_to_cust_no == null) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Supplier No.']));
            return false;
        }
        if (item.units == null) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Unit Of Measure']));
            return;
        }

        if (!(item.qty > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Quantity']));
            return;
        }

        if (item.warehouses == null) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Warehouse']));
            return;
        }

        if (item.standard_price == '' || item.standard_price == undefined) {
            item.standard_price = 0;
            toaster.pop('warning', 'Info', $scope.$root.getErrorMessageByCode(230, ['Standard Price']));
            // return;
        }

        $scope.formData = {};
        $scope.record = {};
        $scope.columns = [];
        $scope.total_remaing = 0;

        //$scope.formData.item_qty=Number(item.units.quantity) * Number(item.qty);
        //$scope.formData.stock_qty=Number(item.units.quantity) * Number(item.qty);
        $scope.formData.primary_unit_id = (item.primary_unit_of_measure_id != undefined && item.primary_unit_of_measure_id != '' && item.primary_unit_of_measure_id != 0) ? item.primary_unit_of_measure_id : item.units.unit_id;
        $scope.formData.primary_unit_name = (item.primary_unit_of_measure_name != undefined && item.primary_unit_of_measure_name != '') ? item.primary_unit_of_measure_name : item.units.name;

        // $scope.formData.primary_unit_id = item.primary_unit_of_measure_id;
        // $scope.formData.primary_unit_name = item.primary_unit_of_measure_name;
        $scope.formData.primary_unit_qty = 1;

        $scope.formData.unit_of_measure_id = item.units.id;
        $scope.formData.unit_of_measure_name = item.units.name;
        $scope.formData.unit_of_measure_qty = item.units.quantity;

        $scope.formData.min_quantity = item.min_quantity;
        $scope.formData.max_quantity = item.max_quantity;

        $scope.formData.item_qty = item.qty;
        $scope.formData.stock_qty = item.qty;

        if ($stateParams.id > 0)
            $scope.formData.order_id = $stateParams.id;
        else
            $scope.formData.order_id = $scope.rec.id;

        $scope.formData.product_id = item.id;
        $scope.formData.product_code = item.product_code;
        $scope.formData.product_name = item.product_name;
        $scope.formData.purchase_status = item.purchase_status;

        if (item.current_stock > 0)
            $scope.formData.currentStock = item.current_stock;
        else
            $scope.formData.currentStock = item.currentStock;

        $scope.formData.type = 1;
        $scope.formData.warehouses_id = item.warehouses.id;
        $scope.formData.warehouses_name = item.warehouses.name;
        $scope.formData.receiptDate = rec.receiptDate;
        item.orderID = $scope.rec.id;
        item.supplier_id = $scope.rec.sell_to_cust_id;
        item.invoice_code = $scope.rec.order_code;
        item.invoice_type = $scope.rec.type;
        item.type_id = $scope.rec.type;
        item.id;

        $scope.formData.bl_shipment_no = $scope.rec.comm_book_in_no;
        $scope.formData.order_no = $scope.rec.sell_to_cust_no;
        $scope.formData.order_date = $scope.rec.requested_delivery_date;
        $scope.showLoader = true;

        // get warehouse storage locations assigned in item start
        $scope.storage_loc = [];
        $scope.items[index].chk = 2;

        if ($scope.check_srm_readonly == false || $scope.check_srm_readonly == undefined) {

            // save order detail rec and load stock allocation predata.
            var saveOrderLine = $scope.$root.pr + "srm/srminvoice/save-order-line";

            if (get_warehouseCount == undefined) get_warehouseCount = $rootScope.maxHttpRepeatCount;
            $http
                .post(saveOrderLine, {
                    'token': $scope.$root.token,
                    'itemData': item,
                    'itemDataArr': $scope.items
                })
                .then(function(result) {

                    $scope.stockAllocationRecord = {};
                    $scope.stockAllocationcolumns = [];


                    if (result.data.ack == true) {
                        $scope.storage_loc = result.data.storage_loc.response;

                        /* $scope.items = [];
                        $scope.items = result.data.allitemArray;
                        $scope.makeInvoice44444444FormReadonly();
                        $scope.check_srm_readonly = true; */

                        $scope.updateGrandTotal();

                        $scope.getOrdersDetail()
                            .then(function() {


                                $scope.check_srm_readonly = false;
                                $scope.showEditorderForm();

                                // get warehouse storage locations assigned in item end
                                $scope.stockAllocationRecord = result.data.stockAlloc.response;
                                $scope.stockAllocationTotal = result.data.stockAlloc.total;

                                $scope.formData.orderLineID = result.data.orderLineID;
                                item.update_id = result.data.orderLineID;

                                angular.forEach($scope.items, function(obj) {
                                    if (obj.update_id == result.data.orderLineID && obj.currentStock) {
                                        $scope.formData.currentStock = obj.currentStock;
                                    }
                                });

                                angular.forEach($scope.stockAllocationRecord, function(obj) {

                                    /* angular.forEach($scope.storage_loc, function (elem) {
                                        if (elem.wh_loc_id == obj.storage_loc_id)
                                            obj.storage_location = elem;
                                    }); */

                                    if ($scope.storage_loc.length == 1)
                                        obj.storage_location = $scope.storage_loc[0];
                                    else {
                                        angular.forEach($scope.storage_loc, function(elem) {
                                            if (elem.wh_loc_id == obj.storage_loc_id)
                                                obj.storage_location = elem;
                                        });
                                    }

                                    obj.unit_of_measure_name = $scope.formData.unit_of_measure_name;
                                    obj.warehouse = $scope.formData.warehouses_name;
                                    obj.stock_qty = obj.quantity;
                                    obj.editchk = 0;
                                });

                                if ($scope.stockAllocationTotal == null)
                                    $scope.total_remaing = $scope.formData.item_qty;
                                else {
                                    $scope.total_remaing = (Number($scope.formData.item_qty)) - (Number($scope.stockAllocationTotal));

                                    if ($scope.total_remaing < 0)
                                        $scope.total_remaing = 0;

                                    $scope.formData.stock_qty = $scope.total_remaing;
                                }

                                angular.forEach(result.data.stockAlloc.response[0], function(val, index) {
                                    $scope.stockAllocationcolumns.push({
                                        'title': toTitleCase(index),
                                        'field': index,
                                        'visible': true
                                    });
                                });

                                $scope.getAllocatStock(item.warehouses.id, item.id, $scope.formData.order_id)
                                    .then(function() {
                                        $scope.showLoader = false;

                                        if ($scope.formData.purchase_status == undefined)
                                            $scope.formData.purchase_status = 0;


                                        $scope.selStorageLoc = '';

                                        if ($scope.storage_loc.length == 1)
                                            $scope.selStorageLoc = $scope.storage_loc[0];

                                        if ($scope.stockAllocationTotal != null) {
                                            if ($scope.formData.stock_qty > 0) {
                                                $scope.stockAllocationRecord.push({
                                                    'warehouse': $scope.formData.warehouses_name,
                                                    'storage_location': $scope.selStorageLoc,
                                                    'container_no': '',
                                                    'batch_no': '',
                                                    'unit_of_measure_name': $scope.formData.unit_of_measure_name,
                                                    'prod_date': '',
                                                    'date_received': $scope.formData.receiptDate,
                                                    'use_by_date': '',
                                                    'id': '',
                                                    'stock_qty': $scope.formData.stock_qty,
                                                    'editchk': 1
                                                });
                                            }
                                        } else {
                                            $scope.stockAllocationRecord = [{
                                                'warehouse': $scope.formData.warehouses_name,
                                                'storage_location': $scope.selStorageLoc,
                                                'container_no': '',
                                                'batch_no': '',
                                                'unit_of_measure_name': $scope.formData.unit_of_measure_name,
                                                'prod_date': '',
                                                'date_received': $scope.formData.receiptDate,
                                                'use_by_date': '',
                                                'id': '',
                                                'stock_qty': $scope.formData.stock_qty,
                                                'editchk': 1
                                            }];

                                            angular.forEach($scope.stockAllocationRecord[0], function(val, index) {
                                                $scope.stockAllocationcolumns.push({
                                                    'title': toTitleCase(index),
                                                    'field': index,
                                                    'visible': true
                                                });
                                            });
                                        }

                                        $scope.stockAllocationSearch = {};

                                        // $scope.stockAllocationSearch = '';
                                        $scope.show_import_div = false;
                                        angular.element('#ware_modal').modal({ show: true });
                                    });
                            });

                    } else {
                        $scope.showLoader = false;
                        toaster.pop('error', 'info', result.data.error);
                    }

                }).catch(function(e) {
                    if (get_warehouseCount != 0) return $scope.get_warehouse(item, rec, index, get_warehouseCount - 1);

                    $scope.showLoader = false;

                    throw new Error(e.data);
                });
        } else {
            var getWarehouseAllocOrderLine = $scope.$root.pr + "srm/srminvoice/get-warehouse-alloc-order-line";

            if (get_warehouseCount == undefined) get_warehouseCount = $rootScope.maxHttpRepeatCount;
            $http
                .post(getWarehouseAllocOrderLine, {
                    'token': $scope.$root.token,
                    'itemData': item,
                })
                .then(function(result) {

                    $scope.stockAllocationRecord = {};
                    $scope.stockAllocationcolumns = [];

                    if (result.data.ack == true) {
                        $scope.storage_loc = result.data.storage_loc.response;

                        // get warehouse storage locations assigned in item end
                        $scope.stockAllocationRecord = result.data.stockAlloc.response;
                        $scope.stockAllocationTotal = result.data.stockAlloc.total;

                        $scope.formData.orderLineID = result.data.orderLineID;
                        item.update_id = result.data.orderLineID;

                        angular.forEach($scope.items, function(obj) {
                            if (obj.update_id == result.data.orderLineID && obj.currentStock) {
                                $scope.formData.currentStock = obj.currentStock;
                            }
                        });

                        angular.forEach($scope.stockAllocationRecord, function(obj) {


                            angular.forEach($scope.storage_loc, function(elem) {
                                if (elem.wh_loc_id == obj.storage_loc_id)
                                    obj.storage_location = elem;
                            });


                            obj.unit_of_measure_name = $scope.formData.unit_of_measure_name;
                            obj.warehouse = $scope.formData.warehouses_name;
                            obj.stock_qty = obj.quantity;
                            obj.editchk = 0;
                        });



                        if ($scope.stockAllocationTotal == null)
                            $scope.total_remaing = $scope.formData.item_qty;
                        else {
                            $scope.total_remaing = (Number($scope.formData.item_qty)) - (Number($scope.stockAllocationTotal));

                            if ($scope.total_remaing < 0)
                                $scope.total_remaing = 0;

                            $scope.formData.stock_qty = $scope.total_remaing;
                        }

                        angular.forEach(result.data.stockAlloc.response[0], function(val, index) {
                            $scope.stockAllocationcolumns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });

                        // $scope.getAllocatStock(item.warehouses.id, item.id, $scope.formData.order_id);

                        $scope.getAllocatStock(item.warehouses.id, item.id, $scope.formData.order_id)
                            .then(function() {

                                $scope.showLoader = false;

                                if ($scope.formData.purchase_status == undefined)
                                    $scope.formData.purchase_status = 0;

                                // if (!($scope.formData.purchase_status > 0))
                                //     $scope.formData.purchase_status = 0;

                                $scope.selStorageLoc = '';

                                if ($scope.storage_loc.length == 1)
                                    $scope.selStorageLoc = $scope.storage_loc[0];

                                if ($scope.stockAllocationTotal != null) {
                                    if ($scope.formData.stock_qty > 0) {
                                        $scope.stockAllocationRecord.push({
                                            'warehouse': $scope.formData.warehouses_name,
                                            'storage_location': $scope.selStorageLoc,
                                            'container_no': '',
                                            'batch_no': '',
                                            'unit_of_measure_name': $scope.formData.unit_of_measure_name,
                                            'prod_date': '',
                                            'date_received': $scope.formData.receiptDate,
                                            'use_by_date': '',
                                            'id': '',
                                            'stock_qty': $scope.formData.stock_qty,
                                            'editchk': 1
                                        });
                                    }
                                } else {
                                    $scope.stockAllocationRecord = [{
                                        'warehouse': $scope.formData.warehouses_name,
                                        'storage_location': $scope.selStorageLoc,
                                        'container_no': '',
                                        'batch_no': '',
                                        'unit_of_measure_name': $scope.formData.unit_of_measure_name,
                                        'prod_date': '',
                                        'date_received': $scope.formData.receiptDate,
                                        'use_by_date': '',
                                        'id': '',
                                        'stock_qty': $scope.formData.stock_qty,
                                        'editchk': 1
                                    }];

                                    angular.forEach($scope.stockAllocationRecord[0], function(val, index) {
                                        $scope.stockAllocationcolumns.push({
                                            'title': toTitleCase(index),
                                            'field': index,
                                            'visible': true
                                        });
                                    });
                                }

                                $scope.stockAllocationSearch = {};
                                // $scope.stockAllocationSearch = '';
                                $scope.show_import_div = false;
                                angular.element('#ware_modal').modal({ show: true });
                            });
                    } else {
                        $scope.showLoader = false;
                        toaster.pop('error', 'info', result.data.error);
                    }


                }).catch(function(e) {
                    if (get_warehouseCount != 0) return $scope.get_warehouse(item, rec, index, get_warehouseCount - 1);

                    $scope.showLoader = false;

                    throw new Error(e.data);
                });

        }
    }

    $scope.searchKeyword = {};
    $scope.searchKeyword.wa = {};
    $scope.searchKeyword.si = {};
    $scope.itemAddCostPurchaseOrderFiltered = [];

    var getAdditionalItemCostCount;




    $scope.getAdditionalItemCost = function(item, rec, index, getAdditionalItemCostCount) {
        // $scope.lastParams = {};

        if (item && rec && index != undefined) { // && index
            var justGetTheInfoWithoutSaving = false;
            $scope.lastParams = { item: item, rec: rec, index: index };
        } else {
            var justGetTheInfoWithoutSaving = true;
            item = $scope.lastParams.item;
            rec = $scope.lastParams.rec;
            index = $scope.lastParams.index;
        }

        if (!(item.qty > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Quantity']));
            return;
        }

        if (item.standard_price == '' || item.standard_price == undefined) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Price']));
            return;
        }

        $scope.additionalCostSearch = {};

        $scope.formData = {};

        $scope.formData.item_qty = item.qty;
        $scope.formData.additionalCost = item.total_price;
        $scope.formData.allocatedAdditionalCost = 0;
        $scope.formData.remainingAdditionalCost = item.total_price;

        item.allocatedAdditionalCost = 0;
        // item.remainingAdditionalCost = item.total_price;

        $scope.formData.uom = item.uom;
        $scope.formData.uomID = item.uomID;

        if ($stateParams.id > 0)
            $scope.formData.order_id = $stateParams.id;
        else
            $scope.formData.order_id = $scope.rec.id;

        $scope.formData.product_id = item.id;
        $scope.formData.product_name = item.description;
        $scope.formData.purchase_status = item.purchase_status;

        $scope.formData.type = 1;
        $scope.formData.receiptDate = rec.receiptDate;
        item.orderID = $scope.rec.id;
        item.supplier_id = $scope.rec.sell_to_cust_id;
        item.invoice_code = $scope.rec.order_code;
        item.invoice_type = $scope.rec.type;
        item.type_id = $scope.rec.type;

        $scope.formData.bl_shipment_no = $scope.rec.comm_book_in_no;
        $scope.formData.order_no = $scope.rec.sell_to_cust_no;
        $scope.formData.order_date = $scope.rec.requested_delivery_date;
        $scope.showLoader = true;
        // $scope.showLoader = false;

        // get warehouse storage locations assigned in item start
        // $scope.itemAddCostPurchaseOrder = [];

        $scope.items[index].chk = 2;


        $scope.formData.orderLineID = item.orderLineID;
        // $scope.searchKeyword = {};
        $scope.searchKeyword.wa = {};
        $scope.searchKeyword.si = {};

        if (($scope.check_srm_readonly == false || $scope.check_srm_readonly == undefined) && justGetTheInfoWithoutSaving == false) {

            // save order detail rec and load Additional Cost predata.
            var saveOrderLine = $scope.$root.pr + "srm/srminvoice/save-additional-cost-order-line";

            if (getAdditionalItemCostCount == undefined) getAdditionalItemCostCount = $rootScope.maxHttpRepeatCount;
            $http
                .post(saveOrderLine, {
                    'token': $scope.$root.token,
                    'currenctOrderLineID': item.update_id,
                    'itemData': item,
                    'itemDataArr': $scope.items,
                    'invoiceRec': $scope.invoiceRec,
                    'searchKeyword': $scope.searchKeyword
                })
                .then(function(result) {

                    if ($scope.itemAddCostPurchaseOrder == undefined)
                        $scope.itemAddCostPurchaseOrder = {};
                    if ($scope.itemAddCostPurchaseOrderColumns == undefined)
                        $scope.itemAddCostPurchaseOrderColumns = [];

                    if (result.data.ack == true) {

                        $scope.itemAddCostPurchaseOrder = result.data.itemAddCostPurchaseOrder.response;

                        $scope.formData.orderLineID = result.data.orderLineID;
                        item.update_id = result.data.orderLineID;

                        $scope.getOrdersDetail(1, 1)
                            .then(function() {

                                $scope.showLoader = false;

                                // $scope.getOrdersDetail(1, 1);
                                $scope.check_srm_readonly = false;
                                $scope.showEditorderForm();

                                if ($scope.itemAddCostPurchaseOrder.length > 0) {

                                    angular.forEach($scope.itemAddCostPurchaseOrder[0], function(val, index) {
                                        $scope.itemAddCostPurchaseOrderColumns.push({
                                            'title': toTitleCase(index),
                                            'field': index,
                                            'visible': true
                                        });
                                    });

                                    // $scope.ttlAdditionAmount = 0;
                                    var ttlAdditionAmount = 0;


                                    angular.forEach($scope.itemAddCostPurchaseOrder, function(obj) {
                                        if (obj.calcAmount != undefined) {
                                            if (parseFloat(obj.calcAmount) > 0) {
                                                obj.chk = true;
                                            }
                                            ttlAdditionAmount = parseFloat(ttlAdditionAmount) + parseFloat(obj.calcAmount);
                                        }

                                        if (parseInt(obj.allocatedQty) > 0)
                                            obj.qty = obj.allocatedQty;

                                        if (parseFloat(obj.calcAmount) > 0) {
                                            obj.calcAmount2 = parseFloat(obj.calcAmount).toFixed(4);
                                        } else {
                                            obj.calcAmount2 = '';
                                        }

                                        if (parseFloat(obj.additionAmount) > 0) {
                                            obj.additionAmount2 = parseFloat(obj.additionAmount).toFixed(4);
                                        } else {
                                            obj.additionAmount2 = '';
                                        }

                                        /* if (parseInt(obj.postedQty) > 0)
                                            obj.qty = obj.postedQty;
                                        else
                                            obj.qty = ''; */
                                    });

                                    $scope.applyLocalFilterAdditionalItemCost();

                                    angular.forEach($scope.items, function(obj) {

                                        if (obj.update_id == item.orderLineID) {
                                            obj.ttlCalcAdditionalCost = parseFloat(obj.qty) * parseFloat(obj.standard_price);
                                            obj.ttlAddAmountAllocated = ttlAdditionAmount;
                                            // obj.remainingAdditionalCost = parseFloat(obj.ttlCalcAdditionalCost) - parseFloat(ttlAdditionAmount);

                                            var remainingAdditionalCost = parseFloat(obj.ttlCalcAdditionalCost) - parseFloat(ttlAdditionAmount);
                                            obj.remainingAdditionalCost = parseFloat(remainingAdditionalCost).toFixed(4);

                                            // obj.remainingAdditionalCost = parseFloat($scope.formData.additionalCost) - parseFloat($scope.ttlAdditionAmount);
                                        }
                                    });

                                    $scope.formData.allocatedAdditionalCost = parseFloat(ttlAdditionAmount).toFixed(4);
                                    $scope.formData.remainingAdditionalCost = parseFloat($scope.formData.additionalCost) - parseFloat(ttlAdditionAmount);


                                    // $scope.getAllocatStock(item.warehouses.id, item.id, $scope.formData.order_id);
                                    if ($scope.formData.purchase_status == undefined)
                                        $scope.formData.purchase_status = 0;

                                    angular.element('#additionalCostModal').modal({ show: true });
                                } else
                                    toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(567));

                                $scope.updateGrandTotal();

                            });
                    } else {
                        $scope.showLoader = false;
                        toaster.pop('error', 'info', result.data.error);
                    }

                }).catch(function(e) {
                    if (getAdditionalItemCostCount != 0) return $scope.getAdditionalItemCost(item, rec, index, getAdditionalItemCostCount - 1);

                    $scope.showLoader = false;

                    throw new Error(e.data);
                });
        } else {
            var getItemAddCostOrderLine = $scope.$root.pr + "srm/srminvoice/get-additional-cost-purchase-order";

            if ($stateParams.id > 0)
                var order_id = $stateParams.id;
            else
                var order_id = $scope.rec.id;

            if (getAdditionalItemCostCount == undefined) getAdditionalItemCostCount = $rootScope.maxHttpRepeatCount;
            $http
                .post(getItemAddCostOrderLine, {
                    'token': $scope.$root.token,
                    'order_id': order_id,
                    'currenctOrderLineID': item.update_id,
                    'descriptionID': item.descriptionID,
                    'uomID': item.uomID,
                    'invoiceRec': $scope.invoiceRec,
                    'searchKeyword': $scope.searchKeyword
                })
                .then(function(result) {
                    $scope.itemAddCostPurchaseOrder = {};
                    $scope.itemAddCostPurchaseOrderColumns = [];
                    $scope.showLoader = false;

                    if (result.data.ack == true) {

                        $scope.itemAddCostPurchaseOrder = result.data.response;

                        if ($scope.itemAddCostPurchaseOrder.length > 0) {

                            angular.forEach($scope.itemAddCostPurchaseOrder[0], function(val, index) {
                                $scope.itemAddCostPurchaseOrderColumns.push({
                                    'title': toTitleCase(index),
                                    'field': index,
                                    'visible': true
                                });
                            });

                            // $scope.ttlAdditionAmount = 0;
                            var ttlAdditionAmount = 0;

                            angular.forEach($scope.itemAddCostPurchaseOrder, function(obj) {
                                if (obj.calcAmount != undefined) {

                                    if (parseFloat(obj.calcAmount) > 0) {
                                        obj.chk = true;
                                    }
                                    ttlAdditionAmount = parseFloat(ttlAdditionAmount) + parseFloat(obj.calcAmount);
                                }

                                if (parseInt(obj.allocatedQty) > 0)
                                    obj.qty = obj.allocatedQty;
                                // else
                                //     obj.qty = '';

                                if (parseFloat(obj.calcAmount) > 0) {
                                    obj.calcAmount2 = parseFloat(obj.calcAmount).toFixed(2);
                                } else {
                                    obj.calcAmount2 = '';
                                }

                                if (parseFloat(obj.additionAmount) > 0) {
                                    obj.additionAmount2 = parseFloat(obj.additionAmount).toFixed(2);
                                } else {
                                    obj.additionAmount2 = '';
                                }

                            });

                            angular.forEach($scope.items, function(obj) {

                                if (obj.update_id == item.update_id) {
                                    obj.ttlCalcAdditionalCost = parseFloat(obj.qty) * parseFloat(obj.standard_price);
                                    obj.ttlAddAmountAllocated = ttlAdditionAmount;

                                    var remainingAdditionalCost = parseFloat(obj.ttlCalcAdditionalCost) - parseFloat(ttlAdditionAmount);
                                    obj.remainingAdditionalCost = parseFloat(remainingAdditionalCost).toFixed(2);
                                    // obj.remainingAdditionalCost = parseFloat($scope.formData.additionalCost) - parseFloat($scope.ttlAdditionAmount);
                                }
                            });

                            $scope.formData.allocatedAdditionalCost = parseFloat(ttlAdditionAmount).toFixed(2); //ttlAdditionAmount;
                            $scope.formData.remainingAdditionalCost = parseFloat($scope.formData.additionalCost) - parseFloat(ttlAdditionAmount);


                            if ($scope.formData.purchase_status == undefined)
                                $scope.formData.purchase_status = 0;

                            angular.element('#additionalCostModal').modal({ show: true });
                        }
                    } else {

                        angular.forEach($scope.items, function(obj) {

                            if (obj.update_id == item.update_id) {
                                obj.ttlCalcAdditionalCost = parseFloat(obj.qty) * parseFloat(obj.standard_price);
                                obj.remainingAdditionalCost = parseFloat(obj.ttlCalcAdditionalCost).toFixed(2);
                            }
                        });

                        toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(400));
                    }
                    // else
                    //     toaster.pop('error', 'info', result.data.error);

                }).catch(function(e) {
                    if (getAdditionalItemCostCount != 0) return $scope.getAdditionalItemCost(item, rec, index, getAdditionalItemCostCount - 1);

                    $scope.showLoader = false;

                    throw new Error(e.data);
                });
        }
    }

    $scope.searchParam = 0;

    $scope.clearSearchFilter = function() {
        $scope.itemAddCostPurchaseOrderFiltered.length = 0;

        if ($scope.searchKeyword.si.invoice_code == undefined && $scope.searchKeyword.si.consignment_no == undefined && $scope.searchKeyword.wa.container_no == undefined) {
            return false;
        }

        $scope.searchKeyword.wa = {};
        $scope.searchKeyword.si = {};
        $scope.searchParam = 1;
        $scope.applyFilterAdditionalItemCost();
    }

    $scope.checkChecked = function() {
        var flag = false;
        angular.forEach($scope.itemAddCostPurchaseOrder, function(obj, ind) {
            if (obj.chk) {
                flag = true;
                return true;
            }
        });
        return flag;
    }

    $scope.checkUnchecked = function() {
        var flag = false;
        angular.forEach($scope.itemAddCostPurchaseOrderFiltered, function(obj, ind) {
            if (!obj.chk) {
                flag = true;
                return true;
            }
        });
        return flag;
    }

    $scope.applyLocalFilterAdditionalItemCost = function(param) {
        $scope.itemAddCostPurchaseOrderFiltered = [];
        $scope.searchKeyword.si == undefined ? '' : $scope.searchKeyword.si;
        $scope.searchKeyword.wa == undefined ? '' : $scope.searchKeyword.wa;
        /* angular.forEach($scope.itemAddCostPurchaseOrder, function (obj, ind) {
            if (($scope.searchKeyword.si.invoice_code && obj.invoice_code.indexOf($scope.searchKeyword.si.invoice_code) > -1) ||
                ($scope.searchKeyword.wa.container_no && obj.ref_no.indexOf($scope.searchKeyword.wa.container_no) > -1) ||
                ($scope.searchKeyword.si.consignment_no && obj.consignmentNo.indexOf($scope.searchKeyword.si.consignment_no) > -1)) {
                $scope.itemAddCostPurchaseOrderFiltered.push(obj);
            }
        }); 
        ($scope.searchKeyword.si.invoice_code && obj.invoice_code.toLowerCase().indexOf($scope.searchKeyword.si.invoice_code.toLowerCase()) > -1) ||
        ($scope.searchKeyword.wa.container_no && obj.ref_no.toLowerCase().indexOf($scope.searchKeyword.wa.container_no.toLowerCase()) > -1) ||
        ($scope.searchKeyword.si.consignment_no && obj.consignmentNo.toLowerCase().indexOf($scope.searchKeyword.si.consignment_no.toLowerCase()) > -1)
        */

        angular.forEach($scope.itemAddCostPurchaseOrder, function(obj, ind) {
            if (
                ($scope.searchKeyword.si.invoice_code && obj.invoice_code.toLowerCase().indexOf($scope.searchKeyword.si.invoice_code.toLowerCase()) > -1) &&
                ($scope.searchKeyword.wa.container_no && obj.ref_no.toLowerCase().indexOf($scope.searchKeyword.wa.container_no.toLowerCase()) > -1) &&
                ($scope.searchKeyword.si.consignment_no && obj.consignmentNo.toLowerCase().indexOf($scope.searchKeyword.si.consignment_no.toLowerCase()) > -1)
            ) {

                $scope.itemAddCostPurchaseOrderFiltered.push(obj);
            } else if (!$scope.searchKeyword.si.invoice_code &&
                ($scope.searchKeyword.wa.container_no && obj.ref_no.toLowerCase().indexOf($scope.searchKeyword.wa.container_no.toLowerCase()) > -1) &&
                ($scope.searchKeyword.si.consignment_no && obj.consignmentNo.toLowerCase().indexOf($scope.searchKeyword.si.consignment_no.toLowerCase()) > -1)
            ) {

                $scope.itemAddCostPurchaseOrderFiltered.push(obj);
            } else if (
                ($scope.searchKeyword.si.invoice_code && obj.invoice_code.toLowerCase().indexOf($scope.searchKeyword.si.invoice_code.toLowerCase()) > -1) &&
                ($scope.searchKeyword.si.consignment_no && obj.consignmentNo.toLowerCase().indexOf($scope.searchKeyword.si.consignment_no.toLowerCase()) > -1) && !$scope.searchKeyword.wa.container_no
            ) {

                $scope.itemAddCostPurchaseOrderFiltered.push(obj);
            } else if (
                ($scope.searchKeyword.si.invoice_code && obj.invoice_code.toLowerCase().indexOf($scope.searchKeyword.si.invoice_code.toLowerCase()) > -1) &&
                ($scope.searchKeyword.wa.container_no && obj.ref_no.toLowerCase().indexOf($scope.searchKeyword.wa.container_no.toLowerCase()) > -1) && !$scope.searchKeyword.si.consignment_no
            ) {

                $scope.itemAddCostPurchaseOrderFiltered.push(obj);
            } else if (!$scope.searchKeyword.si.invoice_code &&
                !$scope.searchKeyword.wa.container_no &&
                ($scope.searchKeyword.si.consignment_no && obj.consignmentNo.toLowerCase().indexOf($scope.searchKeyword.si.consignment_no.toLowerCase()) > -1)
            ) {

                $scope.itemAddCostPurchaseOrderFiltered.push(obj);
            } else if (!$scope.searchKeyword.si.invoice_code &&
                ($scope.searchKeyword.wa.container_no && obj.ref_no.toLowerCase().indexOf($scope.searchKeyword.wa.container_no.toLowerCase()) > -1) && !$scope.searchKeyword.si.consignment_no) {

                $scope.itemAddCostPurchaseOrderFiltered.push(obj);
            } else if (($scope.searchKeyword.si.invoice_code && obj.invoice_code.toLowerCase().indexOf($scope.searchKeyword.si.invoice_code.toLowerCase()) > -1) && !$scope.searchKeyword.wa.container_no &&
                !$scope.searchKeyword.si.consignment_no) {

                $scope.itemAddCostPurchaseOrderFiltered.push(obj);
            }

        });

        if ($scope.itemAddCostPurchaseOrderFiltered.length > 500) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(568));
        }

        if ($scope.itemAddCostPurchaseOrderFiltered.length == 1) {

            var PurchaseInvOrders = '';

            angular.forEach($scope.itemAddCostPurchaseOrderFiltered, function(obj, index) {

                if (obj.AllocPurchaseCode != '0' && obj.AllocPurchaseInv == '0') {
                    $scope.itemAddCostPurchaseOrderFiltered.splice(index, 1);
                    PurchaseInvOrders = PurchaseInvOrders + "'" + obj.AllocPurchaseCode + "', ";
                }

                if (obj.AllocPurchaseInv != '0') {
                    $scope.itemAddCostPurchaseOrderFiltered.splice(index, 1);
                    PurchaseInvOrders = PurchaseInvOrders + "'" + obj.AllocPurchaseInv + "', ";
                }
            });

            if (PurchaseInvOrders.length > 0)
                toaster.pop('error', 'Info', 'Additional Cost already allocated to ' + PurchaseInvOrders.substring(0, PurchaseInvOrders.length - 2));
        } else if ($scope.itemAddCostPurchaseOrderFiltered.length == 0 && param == 1)
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
    }

    $scope.applyFilterAdditionalItemCost = function(item, rec, index) {
        // $scope.applyFilterAdditionalItemCost = function (param) {
        // $scope.lastParams = {};

        $scope.showLoader = true;

        $scope.searchParam = 0;

        if (item && rec && index != undefined) { // && index
            var justGetTheInfoWithoutSaving = false;
            $scope.lastParams = { item: item, rec: rec, index: index };
        } else {
            var justGetTheInfoWithoutSaving = true;
            item = $scope.lastParams.item;
            rec = $scope.lastParams.rec;
            index = $scope.lastParams.index;
        }


        if (!(item.qty > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Quantity']));
            return;
        }

        if (item.standard_price == '' || item.standard_price == undefined) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Price']));
            return;
        }

        $scope.additionalCostSearch = {};

        item.orderID = $scope.rec.id;
        item.supplier_id = $scope.rec.sell_to_cust_id;
        item.invoice_code = $scope.rec.order_code;
        item.invoice_type = $scope.rec.type;
        item.type_id = $scope.rec.type;
        // $scope.showLoader = true;

        $scope.items[index].chk = 2;
        // $scope.formData.orderLineID = item.orderLineID;

        var getItemAddCostOrderLine = $scope.$root.pr + "srm/srminvoice/get-item-add-cost-purchase-order";

        if ($stateParams.id > 0)
            var order_id = $stateParams.id;
        else
            var order_id = $scope.rec.id;

        $http
            .post(getItemAddCostOrderLine, {
                'token': $scope.$root.token,
                'order_id': order_id,
                'currenctOrderLineID': item.update_id,
                'descriptionID': item.descriptionID,
                'uomID': item.uomID,
                'invoiceRec': $scope.invoiceRec,
                'defaultCurrencyID': $scope.$root.defaultCurrency,
                'searchKeyword': $scope.searchKeyword
            })
            .then(function(result) {
                $scope.itemAddCostPurchaseOrder = {};
                $scope.itemAddCostPurchaseOrderColumns = [];
                $scope.showLoader = false;

                if (result.data.ack == true) {

                    $scope.itemAddCostPurchaseOrder = result.data.response;

                    if ($scope.itemAddCostPurchaseOrder.length > 0) {

                        angular.forEach($scope.itemAddCostPurchaseOrder[0], function(val, index) {
                            $scope.itemAddCostPurchaseOrderColumns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });

                        // $scope.ttlAdditionAmount = 0;
                        var ttlAdditionAmount = 0;

                        angular.forEach($scope.itemAddCostPurchaseOrder, function(obj) {
                            if (obj.calcAmount != undefined) {

                                if (parseFloat(obj.calcAmount) > 0) {
                                    obj.chk = true;
                                }
                                ttlAdditionAmount = parseFloat(ttlAdditionAmount) + parseFloat(obj.calcAmount);
                            }

                            if (parseInt(obj.allocatedQty) > 0)
                                obj.qty = obj.allocatedQty;
                            // else
                            //     obj.qty = '';

                            if (parseFloat(obj.calcAmount) > 0) {
                                obj.calcAmount2 = parseFloat(obj.calcAmount).toFixed(2);
                            } else {
                                obj.calcAmount2 = '';
                            }

                            if (parseFloat(obj.additionAmount) > 0) {
                                obj.additionAmount2 = parseFloat(obj.additionAmount).toFixed(2);
                            } else {
                                obj.additionAmount2 = '';
                            }

                        });

                        $scope.formData.allocatedAdditionalCost = parseFloat(ttlAdditionAmount).toFixed(2); //ttlAdditionAmount;
                        $scope.formData.remainingAdditionalCost = parseFloat($scope.formData.additionalCost) - parseFloat(ttlAdditionAmount);

                    } else {
                        // $scope.formData.item_qty = item.qty;
                        $scope.formData.allocatedAdditionalCost = 0;
                        $scope.formData.remainingAdditionalCost = $scope.formData.additionalCost;
                    }
                } else
                    toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(400));

            }).catch(function(message) {
                $scope.showLoader = false;

                throw new Error(message.data);
            });
    }



    $scope.calculateAdditionalAmount = function(rec, type, selSpread) {

        if (rec.chk != true) {
            rec.calcAmount = '';
            rec.additionAmount = '';

            rec.calcAmount2 = '';
            rec.additionAmount2 = '';

            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(569));
            return false;
        }

        if (!(rec.qty > 0)) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Quantity']));
            return false;
        }

        if (type == 1) {

            rec.additionAmount = rec.additionAmount2;

            if (!(parseFloat(rec.additionAmount) < 0) && !(isNaN(rec.additionAmount)) && rec.additionAmount != '') {

                var calcAmount = parseFloat(rec.additionAmount) * parseFloat(rec.qty);


                rec.calcAmount = parseFloat(calcAmount);
                rec.calcAmount2 = parseFloat(calcAmount).toFixed(2);

                var ttlAdditionAmount2 = 0;

                angular.forEach($scope.itemAddCostPurchaseOrder, function(obj) {

                    if (obj.calcAmount != undefined && obj.calcAmount != '')
                        ttlAdditionAmount2 = parseFloat(ttlAdditionAmount2) + parseFloat(obj.calcAmount);
                });


                var remAdditionalCost = parseFloat($scope.formData.additionalCost) - parseFloat(ttlAdditionAmount2);

                $scope.formData.allocatedAdditionalCost = ttlAdditionAmount2;
                $scope.formData.remainingAdditionalCost = parseFloat(remAdditionalCost).toFixed(2);

                if (remAdditionalCost < 0) {
                    rec.calcAmount = 0;
                    rec.additionAmount = 0;

                    rec.calcAmount2 = 0;
                    rec.additionAmount2 = 0;

                    var ttlAdditionAmount = 0;

                    angular.forEach($scope.itemAddCostPurchaseOrder, function(obj) {
                        if (obj.calcAmount != undefined && obj.calcAmount != '')
                            ttlAdditionAmount = parseFloat(ttlAdditionAmount) + parseFloat(obj.calcAmount);
                    });

                    $scope.formData.allocatedAdditionalCost = ttlAdditionAmount;

                    var remAdditionalCost2 = parseFloat($scope.formData.additionalCost) - parseFloat(ttlAdditionAmount);
                    $scope.formData.remainingAdditionalCost = parseFloat(remAdditionalCost2).toFixed(2);

                    toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(570));
                }
            } else {
                rec.calcAmount = '';
                rec.calcAmount2 = '';

                var ttlAdditionAmount2 = 0;

                angular.forEach($scope.itemAddCostPurchaseOrder, function(obj) {

                    if (obj.calcAmount != undefined && obj.calcAmount != '')
                        ttlAdditionAmount2 = parseFloat(ttlAdditionAmount2) + parseFloat(obj.calcAmount);
                });


                var remAdditionalCost = parseFloat($scope.formData.additionalCost) - parseFloat(ttlAdditionAmount2);

                $scope.formData.allocatedAdditionalCost = ttlAdditionAmount2;
                $scope.formData.remainingAdditionalCost = parseFloat(remAdditionalCost).toFixed(2);

                if (remAdditionalCost < 0) {
                    rec.calcAmount = 0;
                    rec.additionAmount = 0;

                    rec.calcAmount2 = 0;
                    rec.additionAmount2 = 0;

                    var ttlAdditionAmount = 0;

                    angular.forEach($scope.itemAddCostPurchaseOrder, function(obj) {
                        if (obj.calcAmount != undefined && obj.calcAmount != '')
                            ttlAdditionAmount = parseFloat(ttlAdditionAmount) + parseFloat(obj.calcAmount);
                    });

                    $scope.formData.allocatedAdditionalCost = ttlAdditionAmount;

                    var remAdditionalCost2 = parseFloat($scope.formData.additionalCost) - parseFloat(ttlAdditionAmount);
                    $scope.formData.remainingAdditionalCost = parseFloat(remAdditionalCost2).toFixed(2);

                    toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(570));
                }
            }

        } else if (type == 2) {

            rec.calcAmount = rec.calcAmount2;

            if (!(parseFloat(rec.calcAmount) < 0) && !(isNaN(rec.calcAmount)) && rec.calcAmount != '') {

                var additionAmount = parseFloat(rec.calcAmount) / parseFloat(rec.qty);

                rec.additionAmount = parseFloat(additionAmount);
                rec.additionAmount2 = parseFloat(additionAmount).toFixed(2);

                var ttlAdditionAmount2 = 0;

                angular.forEach($scope.itemAddCostPurchaseOrder, function(obj) {

                    if (obj.calcAmount != undefined && obj.calcAmount != '')
                        ttlAdditionAmount2 = parseFloat(ttlAdditionAmount2) + parseFloat(obj.calcAmount);
                });


                $scope.formData.allocatedAdditionalCost = ttlAdditionAmount2;

                var remAdditionalCost = parseFloat($scope.formData.additionalCost) - parseFloat(ttlAdditionAmount2);
                $scope.formData.remainingAdditionalCost = parseFloat(remAdditionalCost).toFixed(2);


                if (remAdditionalCost < 0) {
                    rec.calcAmount = 0;
                    rec.additionAmount = 0;

                    rec.calcAmount2 = 0;
                    rec.additionAmount2 = 0;

                    var ttlAdditionAmount = 0;

                    angular.forEach($scope.itemAddCostPurchaseOrder, function(obj) {
                        if (obj.calcAmount != undefined && obj.calcAmount != '')
                            ttlAdditionAmount = parseFloat(ttlAdditionAmount) + parseFloat(obj.calcAmount);
                    });

                    $scope.formData.allocatedAdditionalCost = ttlAdditionAmount;

                    var remAdditionalCost2 = parseFloat($scope.formData.additionalCost) - parseFloat(ttlAdditionAmount);
                    $scope.formData.remainingAdditionalCost = parseFloat(remAdditionalCost2).toFixed(2);

                    toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(570));
                }
            } else {
                rec.additionAmount = '';
                rec.additionAmount2 = '';

                var ttlAdditionAmount2 = 0;

                angular.forEach($scope.itemAddCostPurchaseOrder, function(obj) {

                    if (obj.calcAmount != undefined && obj.calcAmount != '')
                        ttlAdditionAmount2 = parseFloat(ttlAdditionAmount2) + parseFloat(obj.calcAmount);
                });


                var remAdditionalCost = parseFloat($scope.formData.additionalCost) - parseFloat(ttlAdditionAmount2);

                $scope.formData.allocatedAdditionalCost = ttlAdditionAmount2;
                $scope.formData.remainingAdditionalCost = parseFloat(remAdditionalCost).toFixed(2);

                if (remAdditionalCost < 0) {
                    rec.calcAmount = 0;
                    rec.additionAmount = 0;

                    rec.calcAmount2 = 0;
                    rec.additionAmount2 = 0;

                    var ttlAdditionAmount = 0;

                    angular.forEach($scope.itemAddCostPurchaseOrder, function(obj) {
                        if (obj.calcAmount != undefined && obj.calcAmount != '')
                            ttlAdditionAmount = parseFloat(ttlAdditionAmount) + parseFloat(obj.calcAmount);
                    });

                    $scope.formData.allocatedAdditionalCost = ttlAdditionAmount;

                    var remAdditionalCost2 = parseFloat($scope.formData.additionalCost) - parseFloat(ttlAdditionAmount);
                    $scope.formData.remainingAdditionalCost = parseFloat(remAdditionalCost2).toFixed(2);

                    toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(570));
                }
            }
        } else {

            if (!(parseFloat(rec.calcAmount) < 0) && !(parseFloat(rec.additionAmount) < 0)) {
                var additionAmount = parseFloat(rec.calcAmount) / parseFloat(rec.qty);

                rec.additionAmount = parseFloat(additionAmount).toFixed(2);

                var ttlAdditionAmount = 0;

                angular.forEach($scope.itemAddCostPurchaseOrder, function(obj) {

                    if (obj.calcAmount != undefined && obj.calcAmount != '')
                        ttlAdditionAmount = parseFloat(ttlAdditionAmount) + parseFloat(obj.calcAmount);
                });


                $scope.formData.allocatedAdditionalCost = ttlAdditionAmount;

                var remAdditionalCost = parseFloat($scope.formData.additionalCost) - parseFloat(ttlAdditionAmount);
                $scope.formData.remainingAdditionalCost = parseFloat(remAdditionalCost).toFixed(2);

                if ($scope.formData.remainingAdditionalCost < 0) {
                    rec.calcAmount = 0;
                    rec.additionAmount = 0;

                    rec.calcAmount2 = 0;
                    rec.additionAmount2 = 0;

                    var ttlAdditionAmount2 = 0;

                    angular.forEach($scope.itemAddCostPurchaseOrder, function(obj) {
                        if (obj.calcAmount != undefined && obj.calcAmount != '')
                            ttlAdditionAmount2 = parseFloat(ttlAdditionAmount2) + parseFloat(obj.calcAmount);
                    });

                    $scope.formData.allocatedAdditionalCost = ttlAdditionAmount2;

                    var remAdditionalCost2 = parseFloat($scope.formData.additionalCost) - parseFloat(ttlAdditionAmount2);
                    $scope.formData.remainingAdditionalCost = parseFloat(remAdditionalCost2).toFixed(2);


                    toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(570));
                }
            }
        }
    }

    $scope.updateAdditionalCostResults = function() {
        $scope.searchKeyword.wa = {};
        $scope.searchKeyword.si = {};
        $scope.seladditionalcostPurchaseOrder = [];
        // $scope.ttlAdditionAmount = 0;
        var ttlAdditionAmount = 0;

        angular.forEach($scope.itemAddCostPurchaseOrder, function(obj) {

            if (parseFloat(obj.calcAmount) != undefined && parseFloat(obj.calcAmount) > 0) {
                ttlAdditionAmount = parseFloat(ttlAdditionAmount) + parseFloat(obj.calcAmount);
                $scope.seladditionalcostPurchaseOrder.push(obj);
            }
        });

        angular.forEach($scope.items, function(obj) {

            if (obj.update_id == $scope.formData.orderLineID) {
                // obj.ttlCalcAdditionalCost = parseFloat(obj.qty) * parseFloat(obj.standard_price);
                obj.ttlCalcAdditionalCost = parseFloat(obj.total_price);
                obj.ttlAddAmountAllocated = ttlAdditionAmount;
                obj.remainingAdditionalCost = parseFloat(obj.ttlCalcAdditionalCost) - parseFloat(ttlAdditionAmount);
                // obj.remainingAdditionalCost = parseFloat($scope.formData.additionalCost) - parseFloat($scope.ttlAdditionAmount);
                obj.alreadyAddedAmount = parseFloat(ttlAdditionAmount);
                // obj.alreadyAddedAmount = parseFloat(obj.ttlCalcAdditionalCost) - parseFloat(ttlAdditionAmount);
            }
        });

        $scope.formData.allocatedAdditionalCost = ttlAdditionAmount;

        var remAdditionalCost = parseFloat($scope.formData.additionalCost) - parseFloat(ttlAdditionAmount);
        $scope.formData.remainingAdditionalCost = parseFloat(remAdditionalCost).toFixed(2);

        if ($scope.formData.remainingAdditionalCost < 0) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(571));
            return false;
        }

        if ($stateParams.id > 0)
            var order_id = $stateParams.id;
        else
            var order_id = $scope.rec.update_id;

        // if ($scope.seladditionalcostPurchaseOrder.length > 0) {

        var saveAdditionalcostPurchaseOrder = $scope.$root.pr + "srm/srminvoice/save-sel-additional-cost-purchase-order";

        $http
            .post(saveAdditionalcostPurchaseOrder, {
                'token': $scope.$root.token,
                'seladditionalcostPurchaseOrder': $scope.seladditionalcostPurchaseOrder,
                'supplierID': $scope.rec.sell_to_cust_id,
                'defaultCurrencyID': $scope.$root.defaultCurrency,
                'order_id': order_id,
                'orderLineID': $scope.formData.orderLineID
            })
            .then(function(result) {

                // $scope.itemAddCostPurchaseOrder = {};
                // $scope.itemAddCostPurchaseOrderColumns = [];
                $scope.showLoader = false;

                if (result.data.ack == true) {

                    if ($scope.formData.remainingAdditionalCost > 0) {
                        var addCostModalCloseChk = 0;

                        angular.forEach($scope.itemAddCostPurchaseOrder, function(obj) {
                            if (obj.postedChk == 0) addCostModalCloseChk++;
                        });

                        if (addCostModalCloseChk > 0) {
                            toaster.pop('warning', 'info', $scope.formData.remainingAdditionalCost + ' Amount is still remaining!');
                            return false;
                        }

                    } else {
                        angular.element('#additionalCostModal').modal('hide');
                    }
                } else
                    toaster.pop('error', 'info', result.data.error);

            }).catch(function(message) {
                $scope.showLoader = false;

                throw new Error(message.data);
            });
        // }
        // else
        angular.element('#additionalCostModal').modal('hide');
    }

    $scope.NavigateOrder = function(rec) {
        $scope.searchKeyword = {};
        $scope.searchKeyword.navigate_search = "";

        $scope.navigate_data = {};

        $scope.navigate_title = 'Purchase Invoice No. ';
        $scope.navigate_type = 3;

        $scope.navigatePostingDate = '';
        $scope.navigatePostingByName = '';

        var navigate_url = $scope.$root.sales + "customer/order/navigate-invoice";
        var postData = {
            'token': $scope.$root.token,
            'type': 3,
            'object_id': rec.id
        };
        $scope.showLoader = true;
        $http
            .post(navigate_url, postData)
            .then(function(res) {
                if (res.data.ack == 1) {
                    $scope.navigate_data = res.data.response;
                    $scope.navigatePostingDate = res.data.posted_on;
                    $scope.navigatePostingByName = res.data.posted_by_name;

                    $scope.navigate_title = $scope.navigate_title + $scope.navigate_data[0].document_no;
                }

                if (res.data.ack != undefined)
                    $scope.showLoader = false;

            });

        angular.element('#order_navigate_modal').modal({ show: true });
    }

    $scope.getAllocatStock = function(warehouse_id, item_id, order_id, getAllocatStockCount) {
        $scope.all_wh_stock = [];
        var getStockUrl = $scope.$root.sales + "warehouse/get-purchase-stock";

        var postdata = {
            'warehouse_id': warehouse_id,
            'type': 1,
            'item_id': item_id,
            'order_id': order_id,
            'token': $scope.$root.token
        };

        if (getAllocatStockCount == undefined) getAllocatStockCount = $rootScope.maxHttpRepeatCount;
        return $http
            .post(getStockUrl, postdata)
            .then(function(res) {
                $scope.formData.total_available_qty = 0;

                if (res.data.ack == true) {
                    $scope.all_wh_stock = res.data.response;

                    angular.forEach($scope.all_wh_stock, function(obj) {
                        $scope.formData.total_available_qty += Number(obj.avail_qty);
                    });
                }
            }).catch(function(e) {
                if (getAllocatStockCount != 0) return $scope.getAllocatStock(warehouse_id, item_id, order_id, getAllocatStockCount - 1);

                $scope.showLoader = false;

                throw new Error(e.data);
            });
    }

    var showOrderTrailCount;

    $scope.showOrderTrail = function(stock, list_type, entries_type) {
        $scope.searchKeyword_2 = {};
        var stock_trail_url = $scope.$root.setup + "warehouse/sale-stock-trial";
        var postData = {
            'token': $scope.$root.token,
            'prod_id': $scope.formData.product_id,
            'order_id': $scope.formData.order_id,
            'list_type': list_type,
            'entries_type': entries_type,
            'warehose_id': $scope.formData.warehouses_id
        };

        if (list_type == 'current_stock') {
            $scope.stock_activity_title = 'Current Stock';
        } else if (list_type == 'available_stock') {
            $scope.stock_activity_title = 'Available Stock';
        } else if (list_type == 'allocated_stock') {
            $scope.stock_activity_title = 'Allocated Stock';
        }

        if (stock == undefined) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(362, ['stock']));
            return false;
        }

        postData.item_trace_unique_id = stock.item_trace_unique_id;

        if (showOrderTrailCount == undefined) showOrderTrailCount = $rootScope.maxHttpRepeatCount;
        $http
            .post(stock_trail_url, postData)
            .then(function(res) {

                $scope.columns2 = [];
                $scope.prod_warehouse_trail_data = [];



                if (res.data.response != null) {
                    $scope.prod_warehouse_trail_data = res.data.response;
                    angular.forEach(res.data.response[0], function(val, index) {
                        $scope.columns2.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }
            }).catch(function(e) {
                if (showOrderTrailCount != 0) return $scope.showOrderTrail(stock, formData, showOrderTrailCount - 1);

                $scope.showLoader = false;

                throw new Error(e.data);
            });
        $scope.searchKeyword_2 = {};
        angular.element('#order_trail_modal').modal({ show: true });
    }

    $scope.updateAllocationResults = function() {

            angular.forEach($scope.items, function(obj) {

                if (obj.update_id == $scope.formData.orderLineID) {
                    obj.remainig_qty = $scope.total_remaing;
                    obj.qtyItemAllocated = parseFloat($scope.formData.item_qty) - parseFloat($scope.total_remaing);
                }
            });

            angular.element('#ware_modal').modal('hide');
        }
        // $scope.downloadpath = $rootScope.basePath + 'download/migrationSamples/';
        // $scope.show_migrate_pop = function (arg) {
        //     $scope.disableBtn = true;

    //     $scope.file = {};
    //     $scope.file_data = {};

    //     $scope.title = 'Stock Allocation';
    //     $scope.migrationName = arg;
    //     $scope.postUrl = $scope.$root.com + 'migration/import-migration';


    //         $scope.sample = $scope.downloadpath + 'stock_alloc.xlsx';

    //     $scope.sampledownload = $scope.sample;
    //     $scope.errorfiledownload = 0;
    //     $scope.errorLog = 0;

    //     angular.element('#model_file_migration').modal({
    //         show: true
    //     });
    // }

    var get_warehouse_listCount;

    $scope.get_warehouse_list = function(get_warehouse_listCount) {
        var postUrl = $scope.$root.setup + "warehouse/stk-allocation";

        if (get_warehouse_listCount == undefined) get_warehouse_listCount = $rootScope.maxHttpRepeatCount;
        $http
            .post(postUrl, {
                'token': $scope.$root.token,
                'product_id': $scope.formData.product_id,
                'order_id': $scope.formData.order_id,
                'warehouses_id': $scope.formData.warehouses_id,
                'type_id': $scope.formData.type
            })
            .then(function(res) {
                $scope.record = {};
                $scope.columns = [];
                $scope.record = res.data.response;



                if (res.data.total == null)
                    $scope.total_remaing = $scope.formData.item_qty;
                else {
                    $scope.total_remaing = (Number($scope.formData.item_qty)) - (Number(res.data.total));
                    if ($scope.total_remaing < 0)
                        $scope.total_remaing = 0;
                    $scope.formData.stock_qty = $scope.total_remaing;
                }
                angular.forEach(res.data.response[0], function(val, index) {
                    $scope.columns.push({
                        'title': toTitleCase(index),
                        'field': index,
                        'visible': true
                    });
                });
            }).catch(function(e) {
                if (get_warehouse_listCount != 0) return $scope.get_warehouse_list(get_warehouse_listCount - 1);

                $scope.showLoader = false;

                throw new Error(e.data);
            });
    }

    $scope.clear_form = function(formData) {
        $scope.formData.id = '';
        $scope.formData.container_no = '';
        $scope.formData.batch_no = '';
        $scope.formData.prod_date = '';
        $scope.formData.date_received = '';
        $scope.formData.use_by_date = '';
        $scope.formData.stock_qty = '';
        // $scope.formData.zone_location = '';
        $scope.formData.storage_location = '';
        $scope.formData.stock_qty = '';
        $scope.formData.currency = '';
        $scope.formData.uom = '';
        $scope.formData.aisle = 0;
        $scope.formData.bin = 0;
        $scope.formData.cost = '';
    }

    $scope.validateDates = function(prod_date, date_received, use_by_date) {
        var prod, received, useby;

        prod = prod_date.split("/")[2] + "-" + prod_date.split("/")[1] + "-" + prod_date.split("/")[0];
        received = date_received.split("/")[2] + "-" + date_received.split("/")[1] + "-" + date_received.split("/")[0];
        useby = use_by_date.split("/")[2] + "-" + use_by_date.split("/")[1] + "-" + use_by_date.split("/")[0];

        if (prod != null || received != null || useby != null) {

            var prod1, useby1, received1;
            prod1 = new Date(prod.replace(/\s/g, ''));
            received1 = new Date(received.replace(/\s/g, ''));
            useby1 = new Date(useby.replace(/\s/g, ''));

            var fDate, lDate, cDate;
            fDate = Date.parse(prod1);
            lDate = Date.parse(received1);
            cDate = Date.parse(useby1);

            if (fDate > lDate) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(361, ['Date Received', 'Prod. Date']));
                return false;
            }

            if (lDate > cDate) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(361, ['Use By Date', 'Date Recieved']));
                return false;
            }

            if (cDate < fDate) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(361, ['Use By Date', 'Prod. Date']));
                return false;
            }
            return true;
        }
    }

    $scope.editModeAllocation = function(rec) {
        rec.editchk = 1;
    }

    $scope.disableWarehouseAllocRowBtn = false;

    $scope.allocateQty = function(rec, update) {
        $scope.disableWarehouseAllocRowBtn = true;

        var ttlqty = 0;
        var allocationError = 0;

        angular.forEach($scope.stockAllocationRecord, function(obj) {

            if (obj.id > 0 && Number(obj.stock_qty) > 0)
                ttlqty += Number(obj.stock_qty);
            else if (!(obj.stock_qty > 0))
                allocationError++;
        });

        if (Number(rec.stock_qty) <= 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(238, ['Quantity', '0']));
            $scope.disableWarehouseAllocRowBtn = false;
            return;
        }

        if (allocationError > 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Quantity']));
            $scope.disableWarehouseAllocRowBtn = false;
            return;
        }

        if (rec.stock_qty == undefined || rec.stock_qty == '') {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(360, ['Quantity', '0']));
            $scope.disableWarehouseAllocRowBtn = false;
            return;
        }

        if (!(update > 0))
            $scope.currentttlqty = parseFloat(ttlqty) + parseFloat(rec.stock_qty);
        else
            $scope.currentttlqty = parseFloat(ttlqty);


        if (Number($scope.currentttlqty) > parseFloat($scope.formData.item_qty)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(572));
            $scope.disableWarehouseAllocRowBtn = false;
            return;
        }

        $scope.tmpTotalQtyLeft = parseFloat($scope.formData.item_qty) - parseFloat($scope.currentttlqty);

        $validDates = $scope.validateDates(rec.prod_date, rec.date_received, rec.use_by_date);

        if ($validDates == 0) {
            $scope.disableWarehouseAllocRowBtn = false;
            return false;
        }


        // $scope.tmpStockQty = parseInt($scope.formData.stock_qty) - parseInt(rec.stock_qty);
        $scope.tmpStockQty = parseFloat($scope.tmpTotalQtyLeft);

        if ($scope.tmpStockQty < 0)
            $scope.tmpStockQty = 0;

        $scope.formData.stock_qty = $scope.tmpStockQty;

        rec.purchase_return_status = 0;
        rec.purchase_status = 1;
        rec.location = "";

        if (rec.storage_location !== undefined)
            rec.storage_loc_id = rec.storage_location.id;

        rec.location = rec.storage_loc_id;
        rec.order_date1 = $rootScope.posting_date;
        rec.token = $scope.$root.token;
        rec.supplier_id = $scope.rec.sell_to_cust_id;
        rec.order_id = $scope.formData.order_id;
        rec.product_id = $scope.formData.product_id;
        rec.warehouses_id = $scope.formData.warehouses_id;
        rec.orderLineID = $scope.formData.orderLineID;

        rec.type = 1;

        rec.primary_unit_id = $scope.formData.primary_unit_id;
        rec.primary_unit_name = $scope.formData.primary_unit_name;
        rec.primary_unit_qty = $scope.formData.primary_unit_qty;

        rec.unit_of_measure_id = $scope.formData.unit_of_measure_id;
        rec.unit_of_measure_name = $scope.formData.unit_of_measure_name;
        rec.unit_of_measure_qty = $scope.formData.unit_of_measure_qty;

        if (!(rec.storage_loc_id > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Storage Location']));
            $scope.disableWarehouseAllocRowBtn = false;
            return;
        }

        if (!rec.date_received) { //  == undefined
            // toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Date Received']));
            toaster.pop('error', 'Info', 'Please select Receipt Date from the General Tab.');
            $scope.disableWarehouseAllocRowBtn = false;
            return;
        }

        var addcrmUrl = $scope.$root.setup + "warehouse/add-stk-allocation";

        if (rec.id !== undefined)
            addcrmUrl = $scope.$root.setup + "warehouse/update-stk-allocation";

        $http
            .post(addcrmUrl, rec)
            .then(function(res) {
                if (res.data.ack == 1) {
                    //$scope.get_warehouse_list();
                    // $scope.clear_form();

                    if (rec.id > 0) {
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                        $scope.disableWarehouseAllocRowBtn = false;

                        if ($scope.stockAllocationRecord[$scope.stockAllocationRecord.length - 1].id > 0 && $scope.tmpTotalQtyLeft > 0) {
                            $scope.stockAllocationRecord.push({
                                'warehouse': $scope.formData.warehouses_name,
                                'storage_location': '',
                                'container_no': '',
                                'batch_no': '',
                                'unit_of_measure_name': $scope.formData.unit_of_measure_name,
                                'prod_date': '',
                                'date_received': '',
                                'use_by_date': '',
                                'id': '',
                                'stock_qty': $scope.tmpTotalQtyLeft,
                                'editchk': 1
                            });

                        } else if ($scope.tmpTotalQtyLeft > 0)
                            $scope.stockAllocationRecord[$scope.stockAllocationRecord.length - 1].stock_qty = $scope.tmpTotalQtyLeft;

                        if ($scope.stockAllocationRecord[$scope.stockAllocationRecord.length - 1].stock_qty > 0 &&
                            $scope.tmpTotalQtyLeft == 0 &&
                            $scope.stockAllocationRecord[$scope.stockAllocationRecord.length - 1].editchk == 1 &&
                            !($scope.stockAllocationRecord[$scope.stockAllocationRecord.length - 1].id > 0))
                            $scope.stockAllocationRecord.splice(-1, 1);

                    } else {
                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(630));
                        $scope.disableWarehouseAllocRowBtn = false;
                        rec.id = res.data.id;

                        if ($scope.formData.stock_qty > 0) {
                            $scope.stockAllocationRecord.push({
                                'warehouse': $scope.formData.warehouses_name,
                                'storage_location': '',
                                'container_no': '',
                                'batch_no': '',
                                'unit_of_measure_name': $scope.formData.unit_of_measure_name,
                                'prod_date': '',
                                'date_received': '',
                                'use_by_date': '',
                                'id': '',
                                'stock_qty': $scope.formData.stock_qty,
                                'editchk': 1
                            });
                        }
                    }
                    rec.editchk = 0;
                    $scope.total_remaing = $scope.tmpTotalQtyLeft;

                    if ($scope.total_remaing == 0) {
                        $scope.formData.purchase_status = 1;
                        $scope.formData.remainig_qty = 0;
                    }
                } else if (res.data.ack == 2) {
                    toaster.pop('error', 'Error', res.data.error);
                    $scope.disableWarehouseAllocRowBtn = false;
                } else {
                    if (rec.id > 0)
                        toaster.pop('error', 'Edit', res.data.error);
                    else
                        toaster.pop('error', 'Error', res.data.error);
                    $scope.disableWarehouseAllocRowBtn = false;
                }
            }).catch(function(message) {
                $scope.showLoader = false;
                $scope.disableWarehouseAllocRowBtn = false;

                throw new Error(message.data);
            });
    }


    $scope.show_warehouse_loc_info = function(loc_id, warehouse_id, storage_loc_id, prod_id) {

        var prod_warehouse_loc_Url = $scope.$root.setup + "warehouse/get-prod-WH-loc-for-stock-alloc";

        $http
            .post(prod_warehouse_loc_Url, {
                'token': $scope.$root.token,
                'prod_id': prod_id,
                'loc_wrh_id': loc_id
            })
            .then(function(res) {

                if (res.data.response != null) {
                    $scope.warehouse_location_details_data = res.data.response;
                }
            }).catch(function(message) {
                $scope.showLoader = false;

                throw new Error(message.data);
            });

        //get bin loc additional cost for product module start


        var bin_loc_add_cost_Url = $scope.$root.setup + "warehouse/alt-bin-loc-add-cost";

        $http
            .post(bin_loc_add_cost_Url, {
                'token': $scope.$root.token,
                'wrh_id': warehouse_id,
                'bin_loc_wrh_id': storage_loc_id
            })
            .then(function(res) {
                $scope.columns1 = [];
                $scope.bin_loc_add_cost_data = [];

                if (res.data.response != null) {
                    $scope.bin_loc_add_cost_data = res.data.response;
                    angular.forEach(res.data.response[0], function(val, index) {
                        $scope.columns1.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    // $scope.warehouse_loc_add_cost_setup_Show = true;
                }
            }).catch(function(message) {
                $scope.showLoader = false;

                throw new Error(message.data);
            });

        //get bin loc additional cost for product module end

        //get product loc additional cost start

        var prod_warehouse_loc_add_cost_Url = $scope.$root.setup + "warehouse/alt-prod-warehouse-loc-add-cost";

        $http
            .post(prod_warehouse_loc_add_cost_Url, {
                'token': $scope.$root.token,
                'prod_id': prod_id,
                'warehouse_loc_id': loc_id
            })
            .then(function(res) {

                $scope.columns2 = [];
                $scope.prod_warehouse_loc_add_cost_data = [];

                if (res.data.response != null) {
                    $scope.prod_warehouse_loc_add_cost_data = res.data.response;

                    angular.forEach(res.data.response[0], function(val, index) {
                        $scope.columns2.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }
            }).catch(function(message) {
                $scope.showLoader = false;

                throw new Error(message.data);
            });

        //get product loc additional cost end
        angular.element('#location_modal').modal({ show: true });
    }



    $scope.checkDuplWHItem = function(param_item, index) {
        console.log(param_item.warehouses);
        return;

        if (param_item.item_type == 0 && param_item.warehouses != undefined) {
            var chk_item = $filter("filter")(param_item.arr_prod_warehouse, { id: param_item.warehouses.id }, true);

            if (chk_item != undefined) {

                if (chk_item.length > 0)
                    param_item.warehouse_name = chk_item[0].name;
                else
                    param_item.warehouse_name = "";

                var SelectedWH = [];

                angular.forEach($scope.items, function(item, obj_index) {
                    if (param_item.id == item.id && item.warehouses != undefined) {
                        var chk_item = $filter("filter")(item.arr_prod_warehouse, { id: item.warehouses.id }, true);

                        var idx = item.arr_prod_warehouse.indexOf(chk_item[0]);

                        SelectedWH.push(idx);
                    }
                });

                angular.forEach($scope.items, function(item) {
                    if (param_item.id == item.id) {
                        angular.forEach(item.arr_prod_warehouse, function(obj, idx) {

                            if (SelectedWH.indexOf(idx) != -1) {
                                obj.disabled = true;
                            } else
                                obj.disabled = false;
                        });
                    }
                });
            }
        } else if ($scope.items != undefined) {

            var SelectedWH = [];

            angular.forEach($scope.items, function(item, obj_index) {
                if (param_item.id == item.id && item.warehouses != undefined) {
                    var chk_item = $filter("filter")(item.arr_prod_warehouse, { id: item.warehouses.id }, true);

                    var idx = item.arr_prod_warehouse.indexOf(chk_item[0]);

                    SelectedWH.push(idx);
                }
            });

            angular.forEach($scope.items, function(item) {
                if (param_item.id == item.id) {
                    angular.forEach(item.arr_prod_warehouse, function(obj, idx) {

                        if (SelectedWH.indexOf(idx) != -1) {
                            obj.disabled = true;
                        } else
                            obj.disabled = false;
                    });
                }
            });
        }
    }



    $scope.delete_ware = function(id, index, arr_data) {

        $scope.disableWarehouseAllocRowBtn = true;
        var delStockAllocationUrl = $scope.$root.setup + "warehouse/delete-stk-allocation";

        $scope.tmpStockQty = parseInt($scope.formData.stock_qty) + parseInt(arr_data[index].stock_qty);

        if ($scope.tmpStockQty < 0)
            $scope.tmpStockQty = 0;

        ngDialog.openConfirm({
            template: 'modalUnallocateDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function(value) {
            $http
                .post(delStockAllocationUrl, { 'id': id, 'order_id': $scope.rec.id, 'token': $scope.$root.token })
                .then(function(res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        $scope.disableWarehouseAllocRowBtn = false;

                        arr_data.splice(index, 1);

                        $scope.formData.stock_qty = $scope.tmpStockQty;
                        $scope.total_remaing = $scope.tmpStockQty;

                        if (arr_data.length > 0) {
                            if (!(arr_data[arr_data.length - 1].id > 0))
                                arr_data.splice(-1, 1);
                        }

                        if (arr_data.length > 0) {


                            if ($scope.stockAllocationRecord[$scope.stockAllocationRecord.length - 1].id > 0 && $scope.tmpStockQty > 0) {
                                $scope.stockAllocationRecord.push({
                                    'warehouse': $scope.formData.warehouses_name,
                                    'storage_location': '',
                                    'container_no': '',
                                    'batch_no': '',
                                    'unit_of_measure_name': $scope.formData.unit_of_measure_name,
                                    'prod_date': '',
                                    'date_received': '',
                                    'use_by_date': '',
                                    'id': '',
                                    'stock_qty': $scope.tmpStockQty,
                                    'editchk': 1
                                });
                            } else
                                $scope.stockAllocationRecord[$scope.stockAllocationRecord.length - 1].stock_qty = $scope.tmpStockQty;

                        } else if ($scope.tmpStockQty > 0) {
                            $scope.stockAllocationRecord.push({
                                'warehouse': $scope.formData.warehouses_name,
                                'storage_location': '',
                                'container_no': '',
                                'batch_no': '',
                                'unit_of_measure_name': $scope.formData.unit_of_measure_name,
                                'prod_date': '',
                                'date_received': '',
                                'use_by_date': '',
                                'id': '',
                                'stock_qty': $scope.tmpStockQty,
                                'editchk': 1
                            });
                        }
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));

                    }
                }).catch(function(message) {
                    $scope.showLoader = false;
                    $scope.disableWarehouseAllocRowBtn = false;

                    throw new Error(message.data);
                });
        }, function(reason) {
            $scope.showLoader = false;
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }


    $scope.check_min_max_war = function(item) {}

    $scope.disableReceiveBtn = false;

    $scope.reciveStock = function(rec2, rec, mode, recReceivedMode) {

        $scope.showLoader = true;
        $scope.disableReceiveBtn = true;
        $scope.disablePostInvBtn = true;

        if ($scope.rec.sell_to_cust_no == undefined || $scope.rec.sell_to_cust_no == null) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Supplier No.']));
            $scope.showLoader = false;
            $scope.disableReceiveBtn = false;
            $scope.disablePostInvBtn = false;
            return false;
        }

        $scope.netTotalAmount = $scope.netTotal();
        $scope.grand_totalAmount = $scope.grandTotal();

        if (parseFloat($scope.netTotalAmount) < 0 || parseFloat($scope.grand_totalAmount) < 0) {
            $scope.disableReceiveBtn = false;
            $scope.disablePostInvBtn = false;
            $scope.showLoader = false;
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(566));
            return false;
        }

        if ($scope.rec.order_date == null || $scope.rec.order_date == '' || $scope.rec.order_date == undefined) {
            $scope.disableReceiveBtn = false;
            $scope.disablePostInvBtn = false;
            $scope.showLoader = false;
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Order Date']));
            return false;
        }


        if ($scope.showReceiveStuff == true && ($scope.rec.receiptDate == null || $scope.rec.receiptDate == '' || $scope.rec.receiptDate == undefined)) {
            $scope.disableReceiveBtn = false;
            $scope.disablePostInvBtn = false;
            $scope.showLoader = false;
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Receipt Date']));
            return false;
        }

        $scope.supplierLocMandatory = 0;

        angular.forEach($scope.items, function(obj) {
            if (obj.item_type == 0)
                $scope.supplierLocMandatory = 1;
        });

        if ($scope.supplierLocMandatory == 1 && $scope.rec.shippingPONotReq == 1) {

            if (!$scope.rec.ReasonForshippingNotReq || !($scope.rec.ReasonForshippingNotReq.length > 0)) {
                $scope.showLoader = false;
                $scope.disableReceiveBtn = false;
                $scope.disablePostInvBtn = false;
                toaster.pop('error', 'Info', 'Please add reason for shipment not required.');
                return false;
            }
        } else if ($scope.supplierLocMandatory == 1 && (!$scope.rec.shippingPONotReq || $scope.rec.shippingPONotReq == 0) && !($scope.rec.selectedShippingPOid > 0)) {
            $scope.showLoader = false;
            $scope.disableReceiveBtn = false;
            $scope.disablePostInvBtn = false;
            toaster.pop('error', 'Info', 'Please add Linked PO(For Shipping).');
            return false;
        }

        $scope.rec.currencyExchangeRateDate = $scope.rec.receiptDate;
        rec.currencyExchangeRateDate = $scope.rec.receiptDate;

        // check for if goods received but not invoiced.
        $scope.recGoodsReceived = 0;

        if ($scope.show_recieve_list != false)
            $scope.recGoodsReceived = 1;


        $scope.add_sublist(rec2, rec, 1)
            .then(function() {

                if ($scope.rec.invoice_date != null && $scope.rec.order_date != null) {

                    var dateValidationRes = $rootScope.dateValidation($scope.rec.order_date, $scope.rec.invoice_date);

                    if (dateValidationRes > 0) {
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(333, ['Invoice Date', 'Order Date']));
                        $scope.showLoader = false;
                        $scope.disableReceiveBtn = false;
                        $scope.disablePostInvBtn = false;
                        return;
                    }
                } else if ($scope.rec.order_date == null) {
                    toaster.pop('error', 'Info', 'Order Date is Null');
                    $scope.showLoader = false;
                    $scope.disableReceiveBtn = false;
                    $scope.disablePostInvBtn = false;
                    return;
                }

                var convertRecievedStockUrl = $scope.$root.pr + "srm/srminvoice/update-purchase-status";

                if (!($scope.returnItems.length > 0)) {
                    $scope.returnItems = $scope.items;
                }

                ngDialog.openConfirm({
                    template: 'app/views/srm_order/_confirm_purchase_status_modal.html',
                    className: 'ngdialog-theme-default-custom'
                }).then(function(value) {
                    $scope.allItemsArray = [];
                    $scope.receivedItemsArray = [];
                    $scope.NoStockAllocReqArray = [];
                    var receivedItems = "";
                    var stockCheckConfirm = 0;
                    $scope.showLoader = true;


                    angular.forEach($scope.returnItems, function(obj) {

                        if (isNaN(parseFloat(obj.remainig_qty))) {
                            obj.remainig_qty = obj.qty;
                        }

                        if (obj.stock_check > 0 && obj.remainig_qty == 0 && obj.purchase_status == 0) {

                            var detail = {};
                            detail.productid = obj.id;
                            detail.warehouse_id = obj.warehouse_id;
                            detail.update_id = obj.update_id;
                            detail.supplier_id = $scope.rec.sell_to_cust_id;

                            receivedItems += obj.update_id + ",";
                            $scope.receivedItemsArray.push(detail);
                        } else if (obj.stock_check > 0 && ((obj.remainig_qty > 0) || ((obj.remainig_qty == undefined || obj.remainig_qty == null) && parseFloat(obj.qty) > 0))) {
                            toaster.pop('error', 'Error', 'Stock Allocation is Required for ' + obj.product_name);
                            $scope.showLoader = false;
                            $scope.disableReceiveBtn = false;
                            $scope.disablePostInvBtn = false;
                            stockCheckConfirm++;
                            return false;
                        }


                        if (obj.standard_price == '' || obj.standard_price == undefined) {
                            obj.standard_price = 0;
                            toaster.pop('warning', 'Info', obj.product_name + ' Price is empty');
                            $scope.showLoader = false;
                            $scope.disableReceiveBtn = false;
                            $scope.disablePostInvBtn = false;
                            return false;
                        }

                        if (!(obj.qty > 0)) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(593, [obj.product_name]));
                            $scope.showLoader = false;
                            stockCheckConfirm++;
                            $scope.disableReceiveBtn = false;
                            $scope.disablePostInvBtn = false;
                            return false;
                        }

                        if (!(obj.stock_check > 0)) {

                            var NoStockAllocation = {};
                            NoStockAllocation.productid = obj.id;

                            if ($stateParams.id > 0)
                                NoStockAllocation.invoice_id = $stateParams.id;
                            else
                                NoStockAllocation.invoice_id = $scope.rec.id;

                            if (obj.warehouses != undefined)
                                NoStockAllocation.warehouse_id = obj.warehouses.id;
                            else
                                NoStockAllocation.warehouse_id = 0;

                            NoStockAllocation.update_id = obj.update_id;
                            NoStockAllocation.qty = obj.qty;


                            if (obj.item_type == 0)
                                NoStockAllocation.type = 1;
                            else
                                NoStockAllocation.type = obj.item_type;

                            NoStockAllocation.primary_unit_id = obj.primary_unit_of_measure_id;
                            NoStockAllocation.primary_unit_name = obj.primary_unit_of_measure_name;
                            NoStockAllocation.primary_unit_qty = obj.primary_unit_qty;
                            NoStockAllocation.unit_measure_id = obj.unit_id;
                            NoStockAllocation.unit_measure_name = obj.unit_of_measure_name;
                            NoStockAllocation.unit_measure_qty = obj.sale_unit_qty;
                            NoStockAllocation.order_date = $scope.rec.order_date;
                            NoStockAllocation.supplier_id = $scope.rec.sell_to_cust_id;

                            $scope.NoStockAllocReqArray.push(NoStockAllocation);
                        }

                        var itemArray = {};
                        itemArray.productid = obj.id;
                        itemArray.product_name = obj.product_name;
                        itemArray.code = obj.code;
                        itemArray.qty = obj.qty;
                        itemArray.price = obj.standard_price;
                        itemArray.supplier_id = $scope.rec.sell_to_cust_id;
                        itemArray.item_type = obj.item_type;
                        itemArray.consignmentNo = $scope.rec.comm_book_in_no;
                        itemArray.update_id = obj.update_id;
                        itemArray.unit_measure_id = obj.unit_id;
                        itemArray.VATID = obj.vat_id;
                        itemArray.VATName = obj.vat;

                        /* if (obj.rawMaterialProduct > 0) {

                            if (!obj.raw_material_gl_code || !obj.raw_material_gl_name || !(obj.raw_material_gl_id>0) ) {

                                toaster.pop('error', 'Error', obj.product_name + ' raw material G/L is not setup!');
                                $scope.showLoader = false;
                                stockCheckConfirm++;
                                $scope.disableReceiveBtn = false;
                                $scope.disablePostInvBtn = false;
                                return false;

                            }
                        } */

                        itemArray.rawMaterialProduct = obj.rawMaterialProduct;
                        itemArray.raw_material_gl_id = obj.raw_material_gl_id;
                        itemArray.raw_material_gl_code = obj.raw_material_gl_code;
                        itemArray.raw_material_gl_name = obj.raw_material_gl_name;

                        // itemArray.itemDiscountAmount = $scope.rowTotal(obj);
                        var itemDiscountAmount = parseFloat(obj.qty) * parseFloat(obj.standard_price);
                        itemArray.itemDiscountAmount = parseFloat(itemDiscountAmount).toFixed(2);

                        if ($stateParams.id > 0)
                            itemArray.invoice_id = $stateParams.id;
                        else
                            itemArray.invoice_id = $scope.rec.id;

                        if (obj.warehouses != undefined)
                            itemArray.warehouse_id = obj.warehouses.id;
                        else
                            itemArray.warehouse_id = 0;

                        $scope.allItemsArray.push(itemArray);
                        // stockCheckConfirm++;
                    });

                    if (stockCheckConfirm > 0) {
                        $scope.getOrdersDetail();
                        $scope.showLoader = false;
                        $scope.disableReceiveBtn = false;
                        $scope.disablePostInvBtn = false;
                        return false;
                    }


                    if (receivedItems.length > 0)
                        receivedItems = receivedItems.substring(0, receivedItems.length - 1);

                    if ($stateParams.id > 0)
                        var invoice_id = $stateParams.id;
                    else
                        var invoice_id = $scope.rec.id;

                    $http
                        .post(convertRecievedStockUrl, {
                            'invoice_id': invoice_id,
                            'type': 2,
                            'token': $scope.$root.token,
                            'receivedItems': receivedItems,
                            'receivedItemsArray': $scope.receivedItemsArray,
                            'NoStockAllocReqArray': $scope.NoStockAllocReqArray,
                            'allItemsArray': $scope.allItemsArray,
                            'supplierID': rec.bill_to_cust_id,
                            'suppInvNo': $scope.rec.supp_order_no,
                            'recReceivedMode': recReceivedMode, // 1 means Goods are going to be received first but not invoiced
                            'recGoodsReceived': $scope.recGoodsReceived,
                            'invoiceCurrencyID': $rootScope.currencyID_PO.id, //$rootScope.currency_id.id,
                            'defaultCurrencyID': $scope.$root.defaultCurrency,
                            'currencyExchangeRateDate': $scope.rec.currencyExchangeRateDate,
                            'orderDate': $scope.rec.order_date,
                            'directInvoice': mode
                        })
                        .then(function(res) {

                            $scope.showLoader = false;
                            $scope.disableReceiveBtn = false;
                            $scope.disablePostInvBtn = false;

                            if (res.data.ack == true) {
                                toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(631, ['Received Stock']));
                                $scope.getOrdersDetail();
                                // $scope.show_recieve_list = true;
                                $scope.purchaseOrderDeleteBtn = false;
                            } else {

                                toaster.pop('error', 'Info', res.data.error);

                                $timeout(function() {
                                    $state.go("app.viewsrmorder", { id: $scope.rec.id });
                                }, 1500);
                                return;
                            }
                            // toaster.pop('error', 'Info', 'Can\'t Receive Stock!');

                        }).catch(function(message) {
                            $scope.showLoader = false;
                            $scope.disableReceiveBtn = false;
                            $scope.disablePostInvBtn = false;

                            throw new Error(message.data);
                        });
                }, function(reason) {
                    $scope.showLoader = false;
                    $scope.disableReceiveBtn = false;
                    $scope.disablePostInvBtn = false;
                    console.log('Modal promise rejected. Reason: ', reason);
                });
            })
            .catch(function(message) {
                $scope.disableReceiveBtn = false;
                $scope.disablePostInvBtn = false;
                $scope.showLoader = false;
                toaster.pop('error', 'info', message);
            });
    }

    $scope.convert_to_sales_order = function(rec2, rec) {

        if ($scope.rec.sell_to_cust_no == undefined || $scope.rec.sell_to_cust_no == null) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Supplier No.']));
            return false;
        }

        $rootScope.quote_post_invoice_msg = "Are you sure you want to convert this Purchase Order to a Sales Order?";

        ngDialog.openConfirm({
            template: '_confirm_quote_to_order_invoice_modal',
            className: 'ngdialog-theme-default-custom'
        }).then(function(value) {

            var order_id = rec.id;

            var convertApi = $scope.$root.pr + "srm/srminvoice/convertPurchaseToSalesOrder";
            var postData = {
                'token': $scope.$root.token,
                'order_id': order_id
            };
            $scope.showLoader = true;
            $http
                .post(convertApi, postData)
                .then(function(res) {
                    $scope.showLoader = false;

                    if (res.data.ack == true) {
                        var sale_order_id = res.data.SaleOrderID;
                        $state.go("app.viewOrder", {
                            id: sale_order_id
                        });
                    } else
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(235, ['to Sales Order']));
                });
        }, function(reason) {
            $scope.showLoader = false;
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }


    $scope.recivedStockBeforePosting = function(rec2, rec, mode, recReceivedMode) {

        var deferred = $q.defer();
        $scope.showLoader = true;

        $scope.netTotalAmount = $scope.netTotal();
        $scope.grand_totalAmount = $scope.grandTotal();

        if (parseFloat($scope.netTotalAmount) < 0 || parseFloat($scope.grand_totalAmount) < 0) {
            $scope.showLoader = false;
            $scope.disablePostInvBtn = false;
            deferred.reject($scope.$root.getErrorMessageByCode(566));
        }

        if ($scope.showReceiveStuff == true && ($scope.rec.receiptDate == null || $scope.rec.receiptDate == '' || $scope.rec.receiptDate == undefined)) {
            $scope.disablePostInvBtn = false;
            $scope.showLoader = false;
            deferred.reject('Receipt Date is required');
        }


        // check for if goods received but not invoiced.
        $scope.recGoodsReceived = 0;

        if ($scope.show_recieve_list != false)
            $scope.recGoodsReceived = 1;


        $scope.add_sublist(rec2, rec, 2)
            .then(function() {

                $scope.showLoader = true;

                if ($scope.rec.invoice_date != null && $scope.rec.order_date != null) {

                    var dateValidationRes = $rootScope.dateValidation($scope.rec.order_date, $scope.rec.invoice_date);

                    if (dateValidationRes > 0) {
                        $scope.disablePostInvBtn = false;
                        deferred.reject('Invoice Date is Earlier than Order Date!');
                    }
                } else if ($scope.rec.order_date == null) {
                    $scope.disablePostInvBtn = false;
                    deferred.reject('Order Date is Null');
                }

                var convertRecievedStockUrl = $scope.$root.pr + "srm/srminvoice/update-purchase-status";

                if (!($scope.returnItems.length > 0)) {
                    $scope.returnItems = $scope.items;
                }

                if (mode > 0) {

                    $scope.allItemsArray = [];
                    $scope.receivedItemsArray = [];
                    $scope.NoStockAllocReqArray = [];
                    var receivedItems = "";
                    var stockCheckConfirm = 0;

                    angular.forEach($scope.returnItems, function(obj) {

                        if (isNaN(parseFloat(obj.remainig_qty))) {
                            obj.remainig_qty = obj.qty;
                        }

                        if (obj.stock_check > 0 && obj.remainig_qty == 0 && obj.purchase_status == 0) {

                            var detail = {};
                            detail.productid = obj.id;
                            detail.warehouse_id = obj.warehouse_id;
                            detail.update_id = obj.update_id;
                            detail.supplier_id = $scope.rec.sell_to_cust_id;
                            receivedItems += obj.update_id + ",";
                            $scope.receivedItemsArray.push(detail);
                        } else if (obj.stock_check > 0 && ((obj.remainig_qty > 0) || ((obj.remainig_qty == undefined || obj.remainig_qty == null) && parseFloat(obj.qty) > 0))) {
                            // toaster.pop('error', 'Error', 'Stock Allocation is Mandatory for ' + obj.product_name);
                            $scope.disablePostInvBtn = false;
                            deferred.reject('Stock Allocation is Required for ' + obj.product_name);
                            stockCheckConfirm++;
                            // return false;
                        }
                        // else if (obj.stock_check > 0 && (parseFloat(obj.remainig_qty) > 0 || (parseFloat(obj.remainig_qty) == undefined && parseFloat(obj.qty) > 0))) {

                        if (!(obj.stock_check > 0)) {

                            // if (!(obj.standard_price > 0)) {
                            if (obj.standard_price == '' || obj.standard_price == undefined) {
                                obj.standard_price = 0;
                                $scope.disablePostInvBtn = false;
                                // toaster.pop('warning', 'Info', obj.product_name + ' Price is empty');
                                deferred.reject(obj.product_name + ' Price is empty');
                            }


                            if (!(obj.qty > 0)) {
                                // toaster.pop('error', 'Error', obj.product_name + ' Qty is empty');
                                $scope.disablePostInvBtn = false;
                                deferred.reject(obj.product_name + ' Qty is empty');
                                stockCheckConfirm++;
                                // return false;
                            }

                            var NoStockAllocation = {};
                            NoStockAllocation.productid = obj.id;

                            if ($stateParams.id > 0)
                                NoStockAllocation.invoice_id = $stateParams.id;
                            else
                                NoStockAllocation.invoice_id = $scope.rec.id;

                            if (obj.warehouses != undefined)
                                NoStockAllocation.warehouse_id = obj.warehouses.id;
                            else
                                NoStockAllocation.warehouse_id = 0;

                            NoStockAllocation.update_id = obj.update_id;
                            NoStockAllocation.qty = obj.qty;


                            if (obj.item_type == 0)
                                NoStockAllocation.type = 1;
                            else
                                NoStockAllocation.type = obj.item_type;

                            NoStockAllocation.primary_unit_id = obj.primary_unit_of_measure_id;
                            NoStockAllocation.primary_unit_name = obj.primary_unit_of_measure_name;
                            NoStockAllocation.primary_unit_qty = obj.primary_unit_qty;
                            NoStockAllocation.unit_measure_id = obj.unit_id;
                            NoStockAllocation.unit_measure_name = obj.unit_of_measure_name;
                            NoStockAllocation.unit_measure_qty = obj.sale_unit_qty;
                            NoStockAllocation.order_date = $scope.rec.order_date;
                            NoStockAllocation.supplier_id = $scope.rec.sell_to_cust_id;

                            $scope.NoStockAllocReqArray.push(NoStockAllocation);
                        }

                        var itemArray = {};
                        itemArray.productid = obj.id;
                        itemArray.product_name = obj.product_name;
                        itemArray.code = obj.product_code;
                        itemArray.qty = obj.qty;
                        itemArray.price = obj.standard_price;
                        itemArray.item_type = obj.item_type;
                        itemArray.supplier_id = $scope.rec.sell_to_cust_id;
                        itemArray.consignmentNo = $scope.rec.comm_book_in_no;
                        // itemArray.itemDiscountAmount = $scope.rowTotal(obj);
                        // itemArray.itemDiscountAmount = parseFloat(obj.qty) * parseFloat(obj.standard_price);
                        var itemDiscountAmount = parseFloat(obj.qty) * parseFloat(obj.standard_price);
                        itemArray.itemDiscountAmount = parseFloat(itemDiscountAmount).toFixed(2);

                        itemArray.unit_measure_id = obj.unit_id;
                        itemArray.update_id = obj.update_id;

                        itemArray.VATID = obj.vat_id;
                        itemArray.VATName = obj.vat;

                        /* if (obj.rawMaterialProduct > 0) {

                            if (!obj.raw_material_gl_code || !obj.raw_material_gl_name || !(obj.raw_material_gl_id>0) ) {
                                $scope.disablePostInvBtn = false;
                                stockCheckConfirm++;
                                deferred.reject(obj.product_name + ' raw material G/L is not setup!');
                            }
                        } */

                        itemArray.rawMaterialProduct = obj.rawMaterialProduct;
                        itemArray.raw_material_gl_id = obj.raw_material_gl_id;
                        itemArray.raw_material_gl_code = obj.raw_material_gl_code;
                        itemArray.raw_material_gl_name = obj.raw_material_gl_name;

                        if ($stateParams.id > 0)
                            itemArray.invoice_id = $stateParams.id;
                        else
                            itemArray.invoice_id = $scope.rec.id;
                        $scope.allItemsArray.push(itemArray);
                    });

                    if (stockCheckConfirm > 0) {
                        $scope.getOrdersDetail();
                        // return false;
                        $scope.disablePostInvBtn = false;
                        deferred.reject();
                    }

                    if (receivedItems.length > 0)
                        receivedItems = receivedItems.substring(0, receivedItems.length - 1);

                    if ($stateParams.id > 0)
                        var invoice_id = $stateParams.id;
                    else
                        var invoice_id = $scope.rec.id;

                    $scope.rec.grandTotal = $scope.grandTotal();

                    return $http
                        .post(convertRecievedStockUrl, {
                            'invoice_id': invoice_id,
                            'type': 2,
                            'token': $scope.$root.token,
                            'receivedItems': receivedItems,
                            'receivedItemsArray': $scope.receivedItemsArray,
                            'NoStockAllocReqArray': $scope.NoStockAllocReqArray,
                            'grand_total': $scope.rec.grandTotal,
                            'allItemsArray': $scope.allItemsArray,
                            'recReceivedMode': recReceivedMode, // 1 means Goods are going to be received first but not invoiced
                            'recGoodsReceived': $scope.recGoodsReceived,
                            'supplierID': $scope.rec.bill_to_cust_id,
                            'suppInvNo': $scope.rec.supp_order_no,
                            'invoiceCurrencyID': $rootScope.currencyID_PO.id, //$rootScope.currency_id.id,
                            'defaultCurrencyID': $scope.$root.defaultCurrency,
                            'orderDate': $scope.rec.order_date,
                            'directInvoice': mode
                        })
                        .then(function(res) {
                            if (res.data != undefined && res.data.ack == true) {
                                $scope.purchaseOrderDeleteBtn = false;
                                // toaster.pop('success', 'Info', 'Received Stock Successfully');
                                // return true;
                                deferred.resolve();
                            } else {
                                // toaster.pop('error', 'Info', 'Can\'t Receive Stock!');
                                $scope.disablePostInvBtn = false;
                                deferred.reject(res.data.error);
                                // deferred.reject('Can\'t Receive Stock!');
                                // return false;
                                // return 0;
                            }

                        }).catch(function(message) {
                            $scope.disablePostInvBtn = false;
                            $scope.showLoader = false;

                            throw new Error(message.data);
                        });

                }

            })
            .catch(function(message) {
                $scope.showLoader = false;
                $scope.disablePostInvBtn = false;
                toaster.pop('error', 'info', message);
            });

        return deferred.promise;

    }

    $scope.disablePostInvBtn = false;

    $scope.convert_post_invoice = function(rec2, rec, queue_for_approval) {

        $scope.netTotalAmount = $scope.netTotal();
        $scope.grand_totalAmount = $scope.grandTotal();
        $scope.disablePostInvBtn = true;
        $scope.showLoader = true;

        if ($scope.rec.sell_to_cust_no == undefined || $scope.rec.sell_to_cust_no == null) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Supplier No.']));
            $scope.disablePostInvBtn = false;
            $scope.showLoader = false;
            return false;
        }

        if (parseFloat($scope.netTotalAmount) < 0 || parseFloat($scope.grand_totalAmount) < 0) {
            $scope.disablePostInvBtn = false;
            $scope.showLoader = false;
            toaster.pop('error', 'Info', 'Purchase Order Can\'t be Post with negative total Amount!');
            return false;
        }

        if ($scope.rec.order_date == null || $scope.rec.order_date == '' || $scope.rec.order_date == undefined) {
            $scope.disablePostInvBtn = false;
            $scope.showLoader = false;
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Order Date']));
            $scope.showEditForm();
            $scope.showEditorderForm();
            return;
        }

        if ($scope.showReceiveStuff == true && ($scope.rec.receiptDate == null || $scope.rec.receiptDate == '' || $scope.rec.receiptDate == undefined)) {
            $scope.disablePostInvBtn = false;
            $scope.showLoader = false;
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Receipt Date']));
            $scope.showEditForm();
            $scope.showEditorderForm();
            return;
        }

        if ($scope.rec.invoice_date == undefined || $scope.rec.invoice_date == null) {
            $scope.disablePostInvBtn = false;
            $scope.showLoader = false;
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Invoice Date']));
            $scope.showEditForm();
            $scope.showEditorderForm();
            return false;
        } else {

            var dateValidationRes = $rootScope.dateValidation($scope.rec.order_date, $scope.rec.invoice_date);

            if (dateValidationRes > 0) {
                $scope.disablePostInvBtn = false;
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(333, ['Invoice Date', 'Order Date']));
                $scope.showEditForm();
                $scope.showEditorderForm();
                return;
            }
        }

        $scope.rec.currencyExchangeRateDate = $scope.rec.invoice_date;

        if (($scope.rec.supp_order_no == undefined || $scope.rec.supp_order_no == '') && queue_for_approval == undefined) {
            $scope.disablePostInvBtn = false;
            $scope.showLoader = false;
            toaster.pop('error', 'info', 'Supplier Invoice No. is Empty');
            $scope.showEditForm();
            $scope.showEditorderForm();
            return false;
        }

        if ($rootScope.currencyID_PO == null && $rootScope.currencyID_PO == undefined) {
            $scope.disablePostInvBtn = false; //$rootScope.currency_id
            $scope.showLoader = false;
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Currency']));
            $scope.showEditForm();
            $scope.showEditorderForm();
            return;
        }

        var stockCheckConfirm = 0; // Check for stock allocation required  
        $scope.supplierLocMandatory = 0;
        $scope.postponeVATCHK = 0;
        // in case when a user directly post the invoice without doing stock allocation for items

        angular.forEach($scope.items, function(obj) {


            if (isNaN(parseFloat(obj.remainig_qty))) {
                obj.remainig_qty = obj.qty;
            }

            if (obj.isGLVat == true)
                $scope.postponeVATCHK = 1;

            if (obj.stock_check > 0 && (parseFloat(obj.remainig_qty) > 0 || (obj.remainig_qty == undefined && parseFloat(obj.qty) > 0))) {
                $scope.disablePostInvBtn = false;
                $scope.showLoader = false;
                toaster.pop('error', 'Error', 'Stock Allocation is Required for ' + obj.product_name);
                stockCheckConfirm++;
                return false;
            }

            if (obj.standard_price == '' || obj.standard_price == undefined) {
                obj.standard_price = 0;
                toaster.pop('warning', 'Info', obj.product_name + ' Price is empty!');
                // stockCheckConfirm++;
                // return false;
            }

            if (!(obj.qty > 0)) {
                $scope.disablePostInvBtn = false;
                $scope.showLoader = false;
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(593, [obj.product_name]));
                stockCheckConfirm++;
                return false;
            }

            if (obj.item_type == 0 && (!(obj.warehouses) || !(obj.warehouses.id > 0))) {
                $scope.disablePostInvBtn = false;
                $scope.showLoader = false;
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(660, [obj.product_name]));
                stockCheckConfirm++;
                return false;
            }

            if (obj.item_type == 2 && obj.remainingAdditionalCost != 0) {
                $scope.disablePostInvBtn = false;
                $scope.showLoader = false;
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(594, [obj.product_name]));
                stockCheckConfirm++;
                return false;
            }

            if (obj.item_type == 0)
                $scope.supplierLocMandatory = 1;
        });

        if (stockCheckConfirm > 0) {
            $scope.disablePostInvBtn = false;
            $scope.showLoader = false;
            return false;
        }

        if ($scope.supplierLocMandatory == 1 && !$scope.rec.ship_to_name) {
            $scope.disablePostInvBtn = false;
            $scope.disableReceiveBtn = false;
            $scope.showLoader = false;
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(560));
            return false;
        }

        if ($scope.supplierLocMandatory == 1 && $scope.rec.shippingPONotReq == 1) {

            if (!$scope.rec.ReasonForshippingNotReq || !($scope.rec.ReasonForshippingNotReq.length > 0)) {
                $scope.showLoader = false;
                $scope.disableReceiveBtn = false;
                $scope.disablePostInvBtn = false;
                toaster.pop('error', 'Info', 'Please add reason for shipment not required.');
                return false;
            }
        } else if ($scope.supplierLocMandatory == 1 && (!$scope.rec.shippingPONotReq || $scope.rec.shippingPONotReq == 0) && !($scope.rec.selectedShippingPOid > 0)) {
            $scope.showLoader = false;
            $scope.disableReceiveBtn = false;
            $scope.disablePostInvBtn = false;
            toaster.pop('error', 'Info', 'Please add Linked PO(For Shipping).');
            return false;
        }

        // check for if goods not received before but now received and invoiced.
        $scope.recReceivedMode = 0;

        if ($scope.show_recieve_list == false) //if (!$scope.show_recieve_list)
            $scope.recReceivedMode = 1;

        var error_count = 0;
        var error_msg = '';

        if ($scope.$parent.rec.invoice_date == null) {
            error_msg = error_msg + 'Invoice date';
            error_count++;
        }

        // Check for Currency Rate by Date start
        /* var checkCurrencyRate = $scope.$root.pr + 'srm/srminvoice/check-currency-rate';

        $http
            .post(checkCurrencyRate, {
                'recID': $scope.rec.id,
                'currencyID': $rootScope.currencyID_PO.id,
                'defaultCurrencyID': $scope.$root.defaultCurrency, 
                'orderDate': $scope.rec.order_date,
                'invoiceDate': $scope.rec.invoice_date,
                'token': $scope.$root.token
            })
            .then(function (res) {
            }); */

        // Check for Currency Rate by Date End


        var grand_total = ($scope.rec.grand_total != undefined && $scope.rec.grand_total != '') ? $scope.rec.grand_total : 0;

        var check_approvals = $scope.$root.setup + "general/check-for-approvals";
        //'warehouse_id': item.warehouses.id //$scope.rec.currency_id.id,
        $http
            .post(check_approvals, {
                'object_id': $scope.rec.id,
                'purchase_order_total': grand_total,
                'currency_id': $rootScope.currencyID_PO.id,
                'order_date': $scope.rec.order_date,
                'type': "4, 7",
                'token': $scope.$root.token
            })
            .then(function(res) {
                if (res.data.ack == true) {

                    if (queue_for_approval == undefined) {
                        if (!$scope.show_recieve_list && $scope.showReceiveStuff == true) {
                            if (error_count > 0) {
                                $rootScope.order_post_invoice_msg = "Are you sure you want to convert this order to a Purchase Invoice? Stock will be automatically Received. The " + error_msg + " not specified, will be set to current date";
                            } else
                                $rootScope.order_post_invoice_msg = "Are you sure you want to convert this order to a Purchase Invoice? Stock will be automatically Received.";
                        } else {
                            if (error_count > 0)
                                $rootScope.order_post_invoice_msg = "Are you sure you want to convert this order to a Purchase Invoice? . The " + error_msg + " not specified, will be set to current date";
                            else
                                $rootScope.order_post_invoice_msg = "Are you sure you want to convert this order to a Purchase Invoice?";
                        }

                        if ($scope.postponeVATCHK == 1) {

                            ngDialog.openConfirm({
                                template: 'app/views/srm_order/_confirm_postponed_vat.html',
                                className: 'ngdialog-theme-default-custom'
                            }).then(function(value) {
                                $scope.showLoader = true;

                                console.log(value);

                                if (value == 1) rec.postponed_vat = 1;
                                else rec.postponed_vat = 0;

                                ngDialog.openConfirm({
                                    template: 'app/views/srm_order/_confirm_convert_modal.html',
                                    className: 'ngdialog-theme-default-custom'
                                }).then(function(value) {
                                    $scope.showLoader = true;

                                    $scope.recivedStockBeforePosting(rec2, rec, 1, $scope.recReceivedMode)
                                        .then(function() {

                                            if ($scope.$parent.rec.invoice_date == null) {
                                                $scope.$parent.rec.invoice_date = $scope.$root.get_current_date();
                                            }

                                            var rec3 = {};

                                            rec3.net_amount = $scope.netTotal();
                                            rec3.tax_amount = $scope.calcVat();
                                            rec3.grand_total = $scope.grandTotal();
                                            rec3.items_net_total = $scope.rec.items_net_total;
                                            rec3.items_net_vat = $scope.rec.items_net_vat;
                                            rec3.items_net_discount = $scope.rec.items_net_discount;

                                            // Check if there is no item
                                            $scope.noItemExist = 1;
                                            angular.forEach($scope.items, function(obj) {

                                                if (obj.item_type == 0)
                                                    $scope.noItemExist = 0;
                                            });

                                            if ($stateParams.id > 0)
                                                rec3.order_id = $stateParams.id;
                                            else
                                                rec3.order_id = $scope.rec.id;

                                            var updateUrl = $scope.$root.pr + 'srm/srminvoice/post-purchase-invoice';

                                            $http
                                                .post(updateUrl, {
                                                    'itemsArray': $scope.items,
                                                    'rec': rec3,
                                                    'token': $rootScope.token,
                                                    'supplier_id': $scope.rec.sell_to_cust_id,
                                                    'invoiceCurrencyID': $rootScope.currencyID_PO.id, //$rootScope.currency_id.id,
                                                    'defaultCurrencyID': $scope.$root.defaultCurrency,
                                                    'currencyExchangeRateDate': $scope.rec.currencyExchangeRateDate,
                                                    'orderDate': $scope.rec.order_date,
                                                    'suppInvNo': $scope.rec.supp_order_no,
                                                    'noItemExist': $scope.noItemExist,
                                                    'recReceivedMode': $scope.recReceivedMode
                                                }).then(function(res) {

                                                    $scope.showLoader = false;

                                                    if (res.data.ack == true) {

                                                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(229, ['Invoice']));
                                                        $scope.items = [];
                                                        $scope.returnItems = [];

                                                        $scope.rec2 = {};
                                                        $scope.rec = {};
                                                        $scope.rec.type = 3;
                                                        $scope.rec.id = 0;
                                                        $scope.selectedPurchaseOrders = "";
                                                        $scope.check_srm_readonly = false;
                                                        $scope.submit_show_invoicee = true;
                                                        $scope.show_recieve_list = false;

                                                        $scope.$emit('InvoicePosted', $scope.$parent.rec);

                                                        $timeout(function() {
                                                            if ($state.current.name == "app.addsrmorder")
                                                                $state.reload();
                                                            else
                                                                $state.go("app.addsrmorder");
                                                        }, 1500);
                                                        return;
                                                    } else if (res.data.ack == 2 || res.data.ack == 3) {
                                                        toaster.pop('error', 'error', res.data.error);
                                                        /* $scope.items = [];
                                                        $scope.returnItems = [];

                                                        $scope.rec2 = {};
                                                        $scope.rec = {};
                                                        $scope.rec.type = 3;
                                                        $scope.rec.id = 0;
                                                        $scope.selectedPurchaseOrders = "";
                                                        $scope.check_srm_readonly = false;
                                                        $scope.submit_show_invoicee = true;
                                                        $scope.show_recieve_list = false;

                                                        $scope.$emit('InvoicePosted', $scope.$parent.rec); */

                                                        $timeout(function() {
                                                            $state.go("app.srmorder");
                                                        }, 1500);
                                                        return;

                                                    } else {
                                                        $scope.disablePostInvBtn = false;
                                                        $scope.showLoader = false;
                                                        toaster.pop('error', 'error', res.data.error);
                                                        return false;
                                                    }

                                                }).catch(function(message) {
                                                    $scope.showLoader = false;
                                                    $scope.disablePostInvBtn = false;

                                                    throw new Error(message.data);
                                                });
                                        }).catch(function(message) {
                                            $scope.showLoader = false;
                                            $scope.disablePostInvBtn = false;
                                            toaster.pop('error', 'info', message);
                                            throw new Error(message.data);
                                        });
                                }, function(reason) {

                                    $scope.disablePostInvBtn = false;
                                    $scope.showLoader = false;
                                    console.log('Modal promise rejected. Reason: ', reason);
                                });

                            }, function(reason) {

                                $scope.disablePostInvBtn = false;
                                $scope.showLoader = false;
                                console.log('Modal promise rejected. Reason: ', reason);
                            });

                        } else {

                            rec.postponed_vat = 0;

                            ngDialog.openConfirm({
                                template: 'app/views/srm_order/_confirm_convert_modal.html',
                                className: 'ngdialog-theme-default-custom'
                            }).then(function(value) {
                                $scope.showLoader = true;

                                $scope.recivedStockBeforePosting(rec2, rec, 1, $scope.recReceivedMode)
                                    .then(function() {

                                        if ($scope.$parent.rec.invoice_date == null) {
                                            $scope.$parent.rec.invoice_date = $scope.$root.get_current_date();
                                        }

                                        var rec3 = {};

                                        rec3.net_amount = $scope.netTotal();
                                        rec3.tax_amount = $scope.calcVat();
                                        rec3.grand_total = $scope.grandTotal();
                                        rec3.items_net_total = $scope.rec.items_net_total;
                                        rec3.items_net_vat = $scope.rec.items_net_vat;
                                        rec3.items_net_discount = $scope.rec.items_net_discount;

                                        // Check if there is no item
                                        $scope.noItemExist = 1;
                                        angular.forEach($scope.items, function(obj) {

                                            if (obj.item_type == 0)
                                                $scope.noItemExist = 0;
                                        });

                                        if ($stateParams.id > 0)
                                            rec3.order_id = $stateParams.id;
                                        else
                                            rec3.order_id = $scope.rec.id;

                                        var updateUrl = $scope.$root.pr + 'srm/srminvoice/post-purchase-invoice';

                                        $http
                                            .post(updateUrl, {
                                                'itemsArray': $scope.items,
                                                'rec': rec3,
                                                'token': $rootScope.token,
                                                'supplier_id': $scope.rec.sell_to_cust_id,
                                                'invoiceCurrencyID': $rootScope.currencyID_PO.id, //$rootScope.currency_id.id,
                                                'defaultCurrencyID': $scope.$root.defaultCurrency,
                                                'currencyExchangeRateDate': $scope.rec.currencyExchangeRateDate,
                                                'orderDate': $scope.rec.order_date,
                                                'suppInvNo': $scope.rec.supp_order_no,
                                                'noItemExist': $scope.noItemExist,
                                                'recReceivedMode': $scope.recReceivedMode
                                            }).then(function(res) {

                                                $scope.showLoader = false;

                                                if (res.data.ack == true) {

                                                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(229, ['Invoice']));
                                                    $scope.items = [];
                                                    $scope.returnItems = [];

                                                    $scope.rec2 = {};
                                                    $scope.rec = {};
                                                    $scope.rec.type = 3;
                                                    $scope.rec.id = 0;
                                                    $scope.selectedPurchaseOrders = "";
                                                    $scope.check_srm_readonly = false;
                                                    $scope.submit_show_invoicee = true;
                                                    $scope.show_recieve_list = false;

                                                    $scope.$emit('InvoicePosted', $scope.$parent.rec);

                                                    $timeout(function() {
                                                        if ($state.current.name == "app.addsrmorder")
                                                            $state.reload();
                                                        else
                                                            $state.go("app.addsrmorder");
                                                    }, 1500);
                                                    return;
                                                } else if (res.data.ack == 2 || res.data.ack == 3) {
                                                    toaster.pop('error', 'error', res.data.error);
                                                    /* $scope.items = [];
                                                    $scope.returnItems = [];

                                                    $scope.rec2 = {};
                                                    $scope.rec = {};
                                                    $scope.rec.type = 3;
                                                    $scope.rec.id = 0;
                                                    $scope.selectedPurchaseOrders = "";
                                                    $scope.check_srm_readonly = false;
                                                    $scope.submit_show_invoicee = true;
                                                    $scope.show_recieve_list = false;

                                                    $scope.$emit('InvoicePosted', $scope.$parent.rec); */

                                                    $timeout(function() {
                                                        $state.go("app.srmorder");
                                                    }, 1500);
                                                    return;

                                                } else {
                                                    $scope.disablePostInvBtn = false;
                                                    $scope.showLoader = false;
                                                    toaster.pop('error', 'error', res.data.error);
                                                    return false;
                                                }

                                            }).catch(function(message) {
                                                $scope.showLoader = false;
                                                $scope.disablePostInvBtn = false;

                                                throw new Error(message.data);
                                            });
                                    }).catch(function(message) {
                                        $scope.showLoader = false;
                                        $scope.disablePostInvBtn = false;
                                        toaster.pop('error', 'info', message);
                                        throw new Error(message.data);
                                    });
                            }, function(reason) {

                                $scope.disablePostInvBtn = false;
                                $scope.showLoader = false;
                                console.log('Modal promise rejected. Reason: ', reason);
                            });

                        }
                    } else {
                        toaster.pop('success', 'Success', $scope.$root.getErrorMessageByCode(666, ['Purchase Order']));
                        $scope.disablePostInvBtn = false;
                        $scope.showLoader = false;
                    }
                } else {
                    var response = res.data.response;
                    already_checked = 0;
                    $scope.add_sublist(rec2, rec, 1)
                        .then(function() {

                            if (Number(response[0].type) == 4) { // && Number(response[0].criteria) <= Number($scope.rec.grand_total)) {
                                if (Number(response[0].prev_status) == -1 || Number(response[0].prev_status) == 3 || Number(response[0].prev_status) == 6) {
                                    var str = '';
                                    if (Number(response[0].prev_status) == 3) {
                                        str = "Previously disapproved by " + response[0].responded_by + ", ";

                                    }
                                    $rootScope.approval_message = str + "The value of this Purchase Order exceeds the Purchase Order Level 1 limit of " + response[0].criteria + ", you need to queue this for approval.";
                                    already_checked = 1;
                                    ngDialog.openConfirm({
                                        template: '_confirm_approval_required_modal',
                                        className: 'ngdialog-theme-default-custom'
                                    }).then(function(value) {
                                            $scope.showLoader = true;
                                            var check_approvals = $scope.$root.setup + "general/send-for-approval";
                                            //'warehouse_id': item.warehouses.id
                                            $http
                                                .post(check_approvals, {
                                                    'object_id': $scope.rec.id,
                                                    'object_code': $scope.rec.order_code,
                                                    'source_name': $scope.rec.sell_to_cust_name,
                                                    'source_code': $scope.rec.sell_to_cust_no,
                                                    'detail_id': 0,
                                                    'approval_id': response[0].id,
                                                    'code': $scope.rec.order_code,
                                                    'criteria': response[0].criteria,
                                                    'type': "4",
                                                    'current_value': $scope.grand_totalAmount,
                                                    'currency_code': $scope.rec.currency_id.code,
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
                                    already_checked = 1;
                                    $scope.showLoader = false;
                                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(372));
                                    // return;
                                } else if (Number(response[0].prev_status) == 0) {
                                    already_checked = 1;
                                    $scope.showLoader = false;
                                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(391));
                                    // return;
                                } else if (Number(response[0].prev_status) == 7) {
                                    already_checked = 1;
                                    $scope.showLoader = false;
                                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(392, ['Purchase Order']));
                                    // return;
                                }
                            }

                            var response2 = {};
                            if (response.length == 1)
                                response2 = response[0];
                            else if (response.length == 2)
                                response2 = response[1];


                            if (already_checked == 0 && Number(response2.type) == 7 && Number(response2.criteria) <= Number($scope.rec.grand_total)) {
                                if (Number(response2.prev_status) == -1 || Number(response2.prev_status) == 3 || Number(response2.prev_status) == 6) {
                                    var str = '';
                                    if (Number(response2.prev_status) == 3) {
                                        str = "Previously disapproved by " + response2.responded_by + ", ";

                                    }
                                    $rootScope.approval_message = str + "The value of this Purchase Order exceeds the Purchase Order Level 2 limit of " + response2.criteria + ", you need to queue this for approval.";
                                    check_profit = 1;
                                    ngDialog.openConfirm({
                                        template: '_confirm_approval_required_modal',
                                        className: 'ngdialog-theme-default-custom'
                                    }).then(function(value) {
                                            $scope.showLoader = true;
                                            var check_approvals = $scope.$root.setup + "general/send-for-approval";
                                            //'warehouse_id': item.warehouses.id
                                            $http
                                                .post(check_approvals, {
                                                    'object_id': $scope.rec.id,
                                                    'object_code': $scope.rec.order_code,
                                                    'source_name': $scope.rec.sell_to_cust_name,
                                                    'source_code': $scope.rec.sell_to_cust_no,
                                                    'detail_id': 0,
                                                    'approval_id': response2.id,
                                                    'code': $scope.rec.order_code,
                                                    'criteria': response2.criteria,
                                                    'type': "7",
                                                    'current_value': $scope.grand_totalAmount,
                                                    'currency_code': $scope.rec.currency_id.code,
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
                                                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(371));
                                                        return;
                                                    }
                                                });
                                        },
                                        function(reason) {
                                            $scope.showLoader = false;
                                            console.log('Modal promise rejected. Reason: ', reason);
                                        });
                                } else if (Number(response2.prev_status) == 1) {
                                    $scope.showLoader = false;
                                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(372));
                                    return;
                                } else if (Number(response2.prev_status) == 0) {
                                    $scope.showLoader = false;
                                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(391));
                                    return;
                                } else if (Number(response2.prev_status) == 7) {
                                    $scope.showLoader = false;
                                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(392, ['Purchase Order']));
                                    return;
                                }
                            }

                        });
                }
            });
    }


    $scope.GetApprovalStatus = function() {
        $scope.approval_history = [];
        var postUrl_ref_cat = $scope.$root.setup + "general/get-approval-status";
        $scope.show_approval_btn = false;
        $scope.show_disapproval_btn = false;
        $scope.disableDisapprovalBtn = false;

        $http
            .post(postUrl_ref_cat, {
                'object_id': $scope.rec.id,
                'expense_id': $scope.rec.expense_id,
                'type': "4, 7",
                'token': $scope.$root.token
            })
            .then(function(res) {
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


    $scope.ChangeApprovalStatus = function(status, comments) {
        var update_approvals_status = $scope.$root.setup + "general/update-approval-status";
        var id = $scope.approval_history[$scope.approval_history.length - 1].id;
        var object_code = $scope.approval_history[$scope.approval_history.length - 1].object_code;
        var type = $scope.approval_history[$scope.approval_history.length - 1].type;
        var source_name = $scope.approval_history[$scope.approval_history.length - 1].source_name;
        var source_code = $scope.approval_history[$scope.approval_history.length - 1].source_code;
        var requested_by_email = $scope.approval_history[$scope.approval_history.length - 1].requested_by_email;
        var current_value = $scope.approval_history[$scope.approval_history.length - 1].current_value;
        var currency_code = $scope.approval_history[$scope.approval_history.length - 1].currency_code;

        if (status == 3 && (comments == undefined || comments.length == 0)) {
            toaster.pop('error', 'error', $scope.$root.getErrorMessageByCode(664));
            return;
        }
        $scope.disableDisapprovalBtn = true;

        $http
            .post(update_approvals_status, {
                'object_id': $scope.rec.id,
                'detail_id': 0,
                'source_name': source_name,
                'source_code': source_code,
                'requested_by_email': requested_by_email,
                'current_value': current_value,
                'currency_code': currency_code,
                'id': id,
                'object_code': object_code,
                'type': type,
                'status': status,
                'comments': comments,
                'token': $scope.$root.token
            })
            .then(function(res) {
                if (res.data.ack == true) {
                    $scope.showLoader = false;
                    if (status == 2)
                        toaster.pop('success', 'Success', $scope.$root.getErrorMessageByCode(623));
                    else
                        toaster.pop('success', 'Success', $scope.$root.getErrorMessageByCode(624));


                    if (status == 3)
                        angular.element('#_approval_history').modal('hide');

                    return;
                } else {
                    $scope.showLoader = false;
                    $scope.disableDisapprovalBtn = false;
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(371));
                    // return;
                }
            });
    }

    $scope.list_post_invoice = true;
    $scope.submit_show_invoicee = true;

    // generate pdf code

}

purchaseInvoiceModalController.$inject = ["$scope", "$http", "print_invoice_vals", "openEmailer", "noModal", "toaster", "$rootScope", 'serviceVariables', 'fileAuthentication', 'generatePdf']
myApp.controller('purchaseInvoiceModalController', purchaseInvoiceModalController);

function purchaseInvoiceModalController($scope, $http, print_invoice_vals, openEmailer, noModal, toaster, $rootScope, serviceVariables, fileAuthentication, generatePdf) {

    $scope.print_invoice_vals = print_invoice_vals;
    // $scope.print_invoice_obj = print_invoice_obj;
    $scope.openEmailer = openEmailer;
    $scope.noModal = noModal;
    $scope.fileAuthentication = fileAuthentication;

    function sumArray(arrayName) {
        arrayName = arrayName.reduce(function(a, b) {
            return a + b;
        });
        return arrayName;
    };

    function findObjectByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return i;
            }
        }
        return null;
    }

    $scope.generatePDFandDownload = function(templateType, invoiceVals, x) {

        if (templateType == 'purchaseDelivery') {

            $scope.showLoader = true;
            let currentUrl = window.location.href;
            $scope.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;
            invoiceVals.company_name = $rootScope.company_name;
            invoiceVals.company_logo_url = $scope.company_logo_url;
            invoiceVals.known_as = $rootScope.known_as;

            $http({
                    url: $rootScope.jsreports,
                    method: 'POST',
                    params: {},
                    data: {
                        "template": {
                            "shortid": "HklYDxY9pE"
                        },
                        "data": invoiceVals
                    },
                    headers: {
                        'Content-type': 'application/json',
                        "Authorization": "Basic " + btoa("admin:admin123"),
                    },
                    responseType: 'arraybuffer'
                })
                .success(function(data) {
                    $scope.showLoader = false;
                    var file = new Blob([data], { type: 'application/pdf' });
                    saveAs(file, 'DeliveryNote-' + invoiceVals.order_no + '.pdf');

                });
        } else if (templateType == 'purchaseWarehouse') {

            $scope.showLoader = true;
            let currentUrl = window.location.href;
            $scope.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;
            invoiceVals.company_name = $rootScope.company_name;
            invoiceVals.company_logo_url = $scope.company_logo_url;
            invoiceVals.known_as = $rootScope.known_as;

            $http({
                    url: $rootScope.jsreports,
                    method: 'POST',
                    params: {},
                    data: {
                        "template": {
                            "shortid": "BJeo2KYcpN"
                        },
                        "data": invoiceVals
                    },
                    headers: {
                        'Content-type': 'application/json',
                        "Authorization": "Basic " + btoa("admin:admin123"),
                    },
                    responseType: 'arraybuffer'
                })
                .success(function(data) {
                    $scope.showLoader = false;
                    var file = new Blob([data], { type: 'application/pdf' });
                    saveAs(file, 'WarehouseInstructions-' + invoiceVals.order_no + '.pdf');

                });
        } else if (templateType == 'receiptNote') {

            $scope.showLoader = true;
            let currentUrl = window.location.href;
            $scope.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;
            invoiceVals.company_name = $rootScope.company_name;
            invoiceVals.company_logo_url = $scope.company_logo_url;
            invoiceVals.known_as = $rootScope.known_as;


            invoiceVals.total_records = Object.keys(invoiceVals.doc_details_arr);

            // invoiceVals.itemsSummary = [];
            // invoiceVals.uom_qty_total = new Array();
            // angular.forEach(invoiceVals.doc_details_arr, function (obj1) {
            //     angular.forEach(obj1, function (obj2) {
            //         obj2 = { ...obj2 };
            //         obj2.notes = invoiceVals.notes;
            //         invoiceVals.itemsSummary.push(obj2);
            //     });
            // });


            $http({
                    url: $rootScope.jsreports,
                    method: 'POST',
                    params: {},
                    data: {
                        "template": {
                            "shortid": "SJeL63wRAV"
                        },
                        "data": invoiceVals
                    },
                    headers: {
                        'Content-type': 'application/json',
                        "Authorization": "Basic " + btoa("admin:admin123"),
                    },
                    responseType: 'arraybuffer'
                })
                .success(function(data) {
                    $scope.showLoader = false;
                    var file = new Blob([data], { type: 'application/pdf' });
                    saveAs(file, 'receiptNote-' + invoiceVals.order_no + '.pdf');

                });
        } else {
            generatePdf.showLoader = true;
            generatePdf.generatePdf(templateType, invoiceVals, x);

        }

    }

    $scope.generateJSReportPDF = function(templateType, invoiceVals, x) {
        generatePdf.showLoader = true;
        generatePdf.genJSReport(templateType, invoiceVals, x);
    }

    $scope.destroyPdfModal = function(modalName) {
        angular.element(document.querySelector("#" + modalName)).remove();
    }

    /* $scope.generatePdf = function () {
        $scope.showLoader = true;
        var targetPdf = angular.element('#purchase_order_modal')[0].innerHTML;
        var pdfInvoice = $scope.$root.setup + "general/print-pdf-invoice";

        com_name = $scope.print_invoice_vals.com_name.replace(/\s/g, '');
        if ($scope.print_invoice_vals.templateType == "order") {
            $scope.fileName = "PO." + $scope.print_invoice_vals.order_no + "." + $scope.print_invoice_vals.company_id;
        } else {
            $scope.fileName = "PI." + $scope.print_invoice_vals.invoice_no + "." + $scope.print_invoice_vals.company_id;
        }

        $http
            .post(pdfInvoice, { 'dataPdf': targetPdf, 'type': 2, 'filename': $scope.fileName, token: $scope.$root.token, 'doc_id': $scope.print_invoice_vals.doc_id, attachmentsType: 3 })
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {
                    $rootScope.printinvoiceFlag = true;
                    toaster.pop('success', 'Info', 'PDF Generated Successfully');
                    serviceVariables.generatedPDF = res.data.path;
                } else if (res.data.SQLack == false) {
                    toaster.pop('warning', 'Important', 'PDF Generated Successfully');
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(105));
                } else {
                    toaster.pop('error', 'Error', "PDF Not Generated");
                }
            });
    } */

}