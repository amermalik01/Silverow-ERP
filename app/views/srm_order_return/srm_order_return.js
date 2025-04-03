myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',

    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {

        /* specific routes here (see file config.js) */

        $stateProvider

            .state('app.srm_order_return', {

                url: '/debit-note',

                title: 'Purchases',

                templateUrl: helper.basepath('srm_order_return/srm_order_return.html'),

                resolve: helper.resolveFor('ngTable', 'ngDialog')

            })

            .state('app.addsrmorderreturn', {

                url: '/debit-note/add',

                title: 'Purchases',

                templateUrl: helper.basepath('srm_order_return/_form.html'),

                resolve: helper.resolveFor('ngTable', 'ngDialog'),

                controller: 'SrmOrderReturnEditController'

            })

            .state('app.viewsrmorderreturn', {

                url: '/debit-note/:id/view',

                title: 'Purchases',

                templateUrl: helper.basepath('srm_order_return/_form.html'),

                resolve: helper.resolveFor('ngTable', 'ngDialog'),

                controller: 'SrmOrderReturnEditController'

            })

            .state('app.editorderreturn', {

                url: '/debit-note/:id/edit',

                title: 'Purchases',

                templateUrl: helper.basepath('srm_order_return/_form.html'),

                resolve: helper.resolveFor('ngTable', 'ngDialog'),

                controller: 'SrmOrderReturnEditController'

            })

            .state('app.purchase-return-invoice', {

                url: '/debit-note-invoice',

                title: 'Purchases',

                templateUrl: helper.basepath('srm_order_return/srm_order_return_invoice.html'),

                controller: 'PurchaseReturnInvoiceController',

                resolve: helper.resolveFor('ngTable', 'ngDialog')

            })

            .state('app.viewsrmorderreturninvoice', {

                url: '/debit-note-invoice/:id/view',

                title: 'Purchases',

                templateUrl: helper.basepath('srm_order_return/_form.html'),

                resolve: helper.resolveFor('ngTable', 'ngDialog'),

                controller: 'SrmOrderReturnEditController'

            })

    }]);



PurchaseReturnInvoiceController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$rootScope", '$filter', 'moduleTracker'];

myApp.controller('PurchaseReturnInvoiceController', PurchaseReturnInvoiceController);



function PurchaseReturnInvoiceController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $rootScope, $stateParams, moduleTracker) {

    'use strict';



    moduleTracker.updateName("debit_note");

    moduleTracker.updateAdditional("debit_note posted");



    moduleTracker.updateRecord("");



    $scope.breadcrumbs = [{ 'name': 'Purchases', 'url': '#', 'isActive': false }, { 'name': 'Suppliers', 'url': 'app.supplier', 'isActive': false }, { 'name': 'Posted Debit Notes', 'url': '#', 'isActive': false }];



    var vm = this;

    var Api = $scope.$root.pr + "srm/srmorderreturn/listings";

    $scope.postData = {};

    $scope.postData = {

        'token': $scope.$root.token,

        'all': "1",

        'type': 2

    };

    $scope.searchKeyword = {};

    $scope.selectedRecBulkEmail = [];



    $scope.getPurchaseReturnInvoiceListing = function (item_paging, sort_column, sortform) {

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



        /*$scope.sortform=sortform;

         $scope.reversee = ('desc' === $scope.sortform) ? !$scope.reversee : false;

         $scope.sort_column=sort_column;

         */

        $scope.showLoader = true;

        $http

            .post(Api, $scope.postData)

            .then(function (res) {

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



                    $scope.record = res.data.response;



                    angular.forEach(res.data.response, function (value, key) {

                        if (key != "tbl_meta_data") {

                            $scope.recordArray.push(value);

                        }

                    });



                    angular.forEach(res.data.response[0], function (val, index) {

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

            }).catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

                console.log(message.data);

            });

    }



    $scope.getItem = function (parm) {

        $scope.rec.token = $scope.$root.token;



        if (parm == 'all') {

            $scope.rec = {};

            $scope.rec.token = $scope.$root.token;

        }



        $scope.rec.type = 1;

        $scope.postData = $scope.rec;

        $scope.$root.$broadcast("myReload");

    }



    $scope.$on("myReload", function (event) {

        $scope.table.tableParams5.reload();

    });



    $scope.bulkEmailOption = function () {

        // console.log($scope.selectedRecBulkEmail);



        $scope.emailOrderList = $scope.recordArray.filter(function (o, i) {

            return ($scope.selectedRecBulkEmail.findIndex( s => s.key == o.id ) > -1);

        });



        // console.log($scope.emailOrderList);



        if ($scope.emailOrderList.length > 0) {



            angular.element('#_bulkOptionsModal').modal({ show: true });           



        } else {

            $rootScope.animateBulkEmail = false;

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(236, ['Posted Debit Notes']));

        }

    }



    $rootScope.BulkEmailMessage = "";



    $scope.bulkOptionConfirm = function (bulkOptionChk) {



        // console.log(bulkOptionChk); return false;



        angular.element('#_bulkOptionsModal').modal('hide');



        let currentUrl = window.location.href;

        $scope.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;



        // if (bulkOptionChk.saveAsPdf == true) {

        if (bulkOptionChk == 'saveAsPdf') {



            $rootScope.animateBulkEmail = true;

            $rootScope.animateBulkEmailText = 'Downloading PDF(s)';



            // console.log($scope.emailOrderList.length);

            var prntInvoiceUrl = $scope.$root.sales + "customer/order/bulk-print-invoice";

            $http

                .post(prntInvoiceUrl, {

                    'emailOrderList': $scope.emailOrderList,

                    'module': 'PostedDebitNotes',

                    'Option': 'saveAsPdf',

                    'OptionType': 3,

                    'company_logo_url': $scope.company_logo_url,

                    'token': $scope.$root.token

                })

                .then(function (res) {



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

                        //     $scope.getPurchaseReturnInvoiceListing();

                        // }, 500);

                    }

                    else {

                        toaster.pop('error', 'Info', "PDF(s) Generation Failed.");

                    }

                });



        }

        else if (bulkOptionChk == 'email') {

        // else if (bulkOptionChk.email == true) {



            $rootScope.BulkEmailMessage = "Posted Debit Note(s)";



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

                        'module': 'PostedDebitNotes',

                        'Option': 'email',

                        'OptionType': 3,

                        'company_logo_url': $scope.company_logo_url,

                        'token': $scope.$root.token

                    })

                    .then(function (res) {



                        $rootScope.animateBulkEmail = false;

                        $rootScope.animateBulkEmailText = '';



                        if (res.data.ack == 2) {



                            toaster.pop({

                                type: "warning",

                                title: "Info",

                                body: "Email could not be sent for the following Posted Debit Note(s) <br/>" + res.data.error.toString(),

                                timeout: 0,

                                bodyOutputType: 'trustedHtml',

                                tapToDismiss: false

                            });

                        }

                        else if (res.data.ack == true) {

                            toaster.pop('success', 'Info', 'Email(s) Sent Successfully.');





                            $timeout(function () {

                                $scope.getPurchaseReturnInvoiceListing();

                            }, 500);

                        }

                        else {

                            toaster.pop('warning', 'Info', "Email(s) Sending Failed. " + res.data.error);

                        }

                    });

            }, function (reason) {

                $rootScope.animateBulkEmail = false;

                $rootScope.animateBulkEmailText = '';

                console.log('Modal promise rejected. Reason: ', reason);

            });

        }

    }

}



SRMOrderReturnController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$rootScope", '$filter', 'moduleTracker'];

myApp.controller('SRMOrderReturnController', SRMOrderReturnController);

function SRMOrderReturnController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $rootScope, $stateParams, moduleTracker) {

    'use strict';



    moduleTracker.updateName("debit_note");

    moduleTracker.updateAdditional("debit_note unposted");

    moduleTracker.updateRecord("");



    $scope.$root.breadcrumbs = [{ 'name': 'Purchases', 'url': '#', 'isActive': false }, { 'name': 'Suppliers', 'url': 'app.supplier', 'isActive': false }, { 'name': 'Debit Notes', 'url': '#', 'isActive': false }];



    var vm = this;

    var Api = $scope.$root.pr + "srm/srmorderreturn/listings";

    $scope.postData = {};

    $scope.postData = {

        'token': $scope.$root.token,

        'all': "1",

        'type': 1

    };

    $scope.searchKeyword = {};

    $scope.selectedRecBulkEmail = [];



    $scope.getSrmOrderReturnListing = function (item_paging, sort_column, sortform) {

        $scope.postData = {};

        $scope.postData = {

            'token': $scope.$root.token,

            'all': "1",

            'type': 1

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



        /*$scope.sortform=sortform;

         $scope.reversee = ('desc' === $scope.sortform) ? !$scope.reversee : false;

         $scope.sort_column=sort_column;

         */

        $scope.showLoader = true;

        $http

            .post(Api, $scope.postData)

            .then(function (res) {

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



                    $scope.record = res.data.response;



                    angular.forEach(res.data.response, function (value, key) {

                        if (key != "tbl_meta_data") {

                            $scope.recordArray.push(value);

                        }

                    });



                    angular.forEach(res.data.response[0], function (val, index) {

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

            }).catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

                console.log(message.data);

            });

    }





    $scope.getItem = function (parm) {

        $scope.rec.token = $scope.$root.token;



        if (parm == 'all') {

            $scope.rec = {};

            $scope.rec.token = $scope.$root.token;

        }



        $scope.rec.type = 1;

        $scope.postData = $scope.rec;

        $scope.$root.$broadcast("myReload");

    }



    $scope.$on("myReload", function (event) {

        $scope.table.tableParams5.reload();

    });



    $scope.bulkEmailOption = function () {

        // console.log($scope.selectedRecBulkEmail);



        $scope.emailOrderList = $scope.recordArray.filter(function (o, i) {

            return ($scope.selectedRecBulkEmail.findIndex( s => s.key == o.id ) > -1);

        });



        // console.log($scope.emailOrderList);



        if ($scope.emailOrderList.length > 0) {

            angular.element('#_bulkOptionsModal').modal({ show: true });             



        } else {

            $rootScope.animateBulkEmail = false;

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(236, ['Debit Notes']));

        }

    }



    $rootScope.BulkEmailMessage = "";



    $scope.bulkOptionConfirm = function (bulkOptionChk) {



        // console.log(bulkOptionChk); return false;



        angular.element('#_bulkOptionsModal').modal('hide');



        let currentUrl = window.location.href;

        $scope.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;



        // if (bulkOptionChk.saveAsPdf == true) {

        if (bulkOptionChk == 'saveAsPdf') {



            $rootScope.animateBulkEmail = true;

            $rootScope.animateBulkEmailText = 'Downloading PDF(s)';



            // console.log($scope.emailOrderList.length);

            var prntInvoiceUrl = $scope.$root.sales + "customer/order/bulk-print-invoice";

            $http

                .post(prntInvoiceUrl, {

                    'emailOrderList': $scope.emailOrderList,

                    'module': 'DebitNotes',

                    'Option': 'saveAsPdf',

                    'OptionType': 3,

                    'company_logo_url': $scope.company_logo_url,

                    'token': $scope.$root.token

                })

                .then(function (res) {



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

                        //     $scope.getSrmOrderReturnListing();

                        // }, 500);

                    }

                    else {

                        toaster.pop('error', 'Info', "PDF(s) Generation Failed.");

                    }

                });



        }

        else if (bulkOptionChk == 'email') {

        // else if (bulkOptionChk.email == true) {



            $rootScope.BulkEmailMessage = "Debit Note(s)";



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

                        'module': 'DebitNotes',

                        'Option': 'email',

                        'OptionType': 3,

                        'company_logo_url': $scope.company_logo_url,

                        'token': $scope.$root.token

                    })

                    .then(function (res) {



                        $rootScope.animateBulkEmail = false;

                        $rootScope.animateBulkEmailText = '';



                        if (res.data.ack == 2) {



                            toaster.pop({

                                type: "warning",

                                title: "Info",

                                body: "Email could not be sent for the following Debit Note(s) <br/>" + res.data.error.toString(),

                                timeout: 0,

                                bodyOutputType: 'trustedHtml',

                                tapToDismiss: false

                            });

                        }

                        else if (res.data.ack == true) {

                            toaster.pop('success', 'Info', 'Email(s) Sent Successfully.');





                            $timeout(function () {

                                $scope.getSrmOrderReturnListing();

                            }, 500);

                        }

                        else {

                            toaster.pop('warning', 'Info', "Email(s) Sending Failed. " + res.data.error);

                        }

                    });

            }, function (reason) {

                $rootScope.animateBulkEmail = false;

                $rootScope.animateBulkEmailText = '';

                console.log('Modal promise rejected. Reason: ', reason);

            });

        }

    }



}



SrmOrderReturnEditController.$inject = ["$scope", "$filter", "$resource", "$timeout", "$http", "ngDialog", "toaster", "$stateParams", "$state", "$rootScope", "ModalService", "serviceVariables", "$q", "generatePdf", "moduleTracker"];

myApp.controller('SrmOrderReturnEditController', SrmOrderReturnEditController);

function SrmOrderReturnEditController($scope, $filter, $resource, $timeout, $http, ngDialog, toaster, $stateParams, $state, $rootScope, ModalService, serviceVariables, $q, generatePdf, moduleTracker) {

    'use strict';



    moduleTracker.updateName("debit_note");

    moduleTracker.updateRecord("");



    $scope.recnew = 0;



    $scope.generatePdf = generatePdf;



    $scope.itemExists = false;



    $scope.serviceVariables = serviceVariables;



    $scope.show_order = false;

    $scope.showLoader = false;

    $scope.show_invoiceLabel = false;

    $scope.showReceiveStuff = false;



    if ($state.current.name == 'app.viewsrmorderreturninvoice') {

        $scope.show_invoiceLabel = true;

        // $scope.title_code = 'Invoice No.';

        $scope.title_code = 'Posted DN No.';

        moduleTracker.updateAdditional("debit_note posted");

        $scope.moduleNameForRoles = "posted_debit_note";

    } else {

        $scope.show_order = true;

        // $scope.showLoader = true;

        $scope.title_code = 'Debit Note No.';

        moduleTracker.updateAdditional("debit_note unposted");

        $scope.moduleNameForRoles = "purchase_return";

    }







    if ($stateParams.id > 0) {

        $scope.check_sr_readonly = true;

        $scope.recnew = $stateParams.id;

        moduleTracker.updateRecord($stateParams.id);

    }



    $scope.showEditForm = function () {

        $scope.check_sr_readonly = false;

    }



    $rootScope.updateSelectedGlobalData("uom");

    // $rootScope.updateSelectedGlobalData('item');



    $scope.showEditorderForm = function () {

        $scope.check_sr_readonly = false;

    }



    $scope.makeInvoiceFormReadonly = function () {

        $scope.check_sr_readonly = true;

    }



    $scope.record = [];

    var vm = this;

    $scope.class = 'block';

    $scope.rec = {};

    $scope.rec.type = 1;

    $scope.drp = {};

    var postData = {};

    $scope.crm_no = '';

    var crm_name = '';

    $scope.customer_no = '';

    var id = $stateParams.id;

    $scope.$root.crm_id = id;

    var table = 'order';

    $scope.title = 'Order Listing';



    $scope.btnCancelUrl = 'app.srm_order_return';

    $scope.product_type = true;

    $scope.count_result = 0;

    $scope.debitNoteDeleteBtn = false;



    if ($stateParams.id === undefined) {

        $scope.debitNoteDeleteBtn = true;

        $scope.rec.supplierCreditNoteDate = $scope.$root.get_current_date();



        angular.forEach($rootScope.arr_currency, function (elem) {

            if (elem.id == $scope.$root.defaultCurrency)

                $scope.rec.currency_id = elem;

        });

    }



    /*  order status code start */



    $scope.order_stages_array = [];

    $scope.GetSalesOrderStages = function (flg) {



        $scope.order_stages_array = [];

        var postData = '';

        if (flg == 0){

            var order_stages = $scope.$root.setup + "crm/get-order-stages-list";

            postData = {

                'token': $scope.$root.token, 

                'type': 3, 

                'order_id': $stateParams.id,

                'isAllowed': 1 //this parameter is to allow without permission validation

            };

        }else{

            var order_stages = $scope.$root.sales + "customer/order/get-sales-order-stages";

            postData = {

                'token': $scope.$root.token, 

                'type': 3, 

                'order_id': $stateParams.id

            };

        }

        $http

            .post(order_stages, postData)

            .then(function (res) {

                if (res.data.ack == true) {

                    $scope.order_stages_array = res.data.response;

                    // if ($scope.rec.id == undefined) {

                    if ($stateParams.id == undefined) {

                        angular.forEach($scope.order_stages_array, function (obj) {

                            obj.id = 0;

                        });

                    }

                }

            });

    }



    if ($stateParams.id == undefined)

        $scope.GetSalesOrderStages(0);

    else

        $scope.GetSalesOrderStages();



    $scope.get_order_status = function (checkid) {



        $scope.assigned_order_stages_array = {};

        $scope.selected_status = "";



        var assigned_order_stages = $scope.$root.sales + "customer/order/get-all-order-status";

        $http

            .post(assigned_order_stages, { 'token': $scope.$root.token, 'type': 3, 'rec_id': $stateParams.id })

            .then(function (res) {

                if (res.data.ack == true) {

                    angular.forEach($scope.order_stages_array, function (obj) {

                        obj.chk = false;

                        angular.forEach(res.data.response, function (obj2) {

                            if (obj.id == obj2.status_id) {

                                obj.chk = true;

                            }

                        });

                    });

                }

            });

    }



    /*  order status code end */



    /*  Get Actual VAT Code Range Start */

    $scope.get_vat_range = function () {

        var apiurl = $scope.$root.setup + 'srm/getVatRange';

        // $scope.showLoader = true;

        $http

            .post(apiurl, { token: $rootScope.token })

            .then(function (res) {

                // $scope.showLoader = false;

                if (res.data.ack == true) {

                    $scope.VatRange = res.data.response[0];

                    // console.log($scope.VatRange);

                }

                else {

                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(556));

                }

            });

    }



    /*  Get Actual VAT Code Range End */





    $scope.get_vat_range();



    $scope.removeSupp = 0;



    var custUrl = $scope.$root.pr + "supplier/supplier/listings";

    // var custUrl = $scope.$root.pr + "srm/srminvoice/listing_order";

    $scope.searchKeyword = {};

    $scope.searchKeywordSupp = {};



    $scope.get_supplier = function (item_paging, shipagent) {

        if (item_paging){

            $scope.searchKeywordSupp = {};            

        }

        $scope.title = 'Supplier Listing';



        $scope.columns = [];

        $scope.record = {};

        $scope.record_invoice = {};

        $scope.shipagent = shipagent;



        if (Number($scope.rec.supplierID) > 0 && shipagent != 1)

            $scope.removeSupp = 1;

        else

            $scope.removeSupp = 0;



        if ($scope.items.length > 0 && $scope.shipagent != 1) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(557));

            return false;

        }



        //pass in API

        $scope.postData = {};

        $scope.postData.token = $scope.$root.token;

        $scope.postData.type = 1;



        $scope.postData.searchKeyword = $scope.searchKeywordSupp;



        $scope.showLoader = true;

        var supplierUrl = $scope.$root.pr + "supplier/supplier/supplierListings";



        $http

            .post(supplierUrl, $scope.postData)

            .then(function (res) {

                $scope.columns = [];

                $scope.record = {};



                $scope.showLoader = false;

                $scope.supplierTableData = res;



                if (res.data.ack == true) {

                    $rootScope.currencyArrPurchase = res.data.currency_arr_local;



                    // $scope.record = res.data.response;

                    angular.element('#listing_sp_single_Modal').modal({ show: true });

                }

                else

                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));

            })

            .catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

            });

    }



    $scope.confirm_supp_single = function (result) {

        var counter_rec = 0;

        // console.log(result);



        if ($scope.shipagent == 1) {

            $scope.rec.shipping_agent_id = result.id;

            $scope.rec.shipping_agent_code = result.name;

            angular.element('#listing_sp_single_Modal').modal('hide');

            return;

        }



        if (!(result.posting_group_id > 0)) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Supplier Posting Group']));

            return;

        }



        $scope.removeSupp = 1;



        $scope.rec.purchaseInvoice = "";

        $scope.rec.purchaseInvoiceID = "";

        $scope.rec.purchaseInvoiceType = '';



        // $scope.rec.Purchaser = result.purchase_code;



        // if (!($scope.rec.update_id > 0)) {

        if (!($scope.rec.update_id > 0) || !($scope.rec.purchaserID > 0)) {

            $scope.rec.Purchaser = result.purchase_code;

            // $scope.rec.purchase_code_id = result.purchase_code_id;

            $scope.rec.purchaserID = result.purchase_code_id;

        }



        $rootScope.order_posting_group_id = result.posting_group_id;

        $rootScope.arrVATPostGrpPurchase = undefined;



        /* if (result.anumber == null) {

            toaster.pop('error', 'Info', ' Account Payable is Empty !');

            return;

        }



        if (result.pnumber == null) {

            toaster.pop('error', 'Info', ' Purchase Code is Empty !');

            return;

        } */



        $scope.rec.payable_number = result.anumber;

        $scope.rec.purchase_number = result.pnumber;

        $scope.rec.account_payable_id = result.account_payable_id;



        $scope.rec.supplierID = result.id;

        $scope.rec.supplierNo = result.code;

        $scope.rec.supplierName = result.name;

        $scope.rec.supplierAddress = result.address_1;

        $scope.rec.supplierAddress2 = result.address_2;

        $scope.rec.supplierCity = result.city;

        $scope.rec.supplierCounty = result.county;

        $scope.rec.supplierPostCode = result.postcode;



        $scope.rec.supplierContactID = result.contact_id;

        $scope.rec.supplierContactName = result.contact_person;

        $scope.rec.supplierContactTelephone = result.Telephone;

        $scope.rec.supplierContactFax = result.fax;

        $scope.rec.supplierContactEmail = result.email;





        if ($scope.$root.breadcrumbs.length > 3) {



            /* if ($scope.rec.debitNoteCode)

                $scope.$root.model_code = $scope.rec.supplierName + '(' + $scope.rec.debitNoteCode + ')';

            else

                $scope.$root.model_code = $scope.rec.supplierName; */



            if ($scope.rec.type == 1) {



                if ($scope.rec.supplierName  != null)

                    $scope.$root.model_code = $scope.rec.supplierName + '(' + $scope.rec.debitNoteCode + ')';

                else

                    $scope.$root.model_code = $scope.rec.debitNoteCode;

            }

            else {

                if ($scope.rec.supplierName != null)

                    $scope.$root.model_code = $scope.rec.supplierName + '(' + $scope.rec.invoice_code + ')';

                else

                    $scope.$root.model_code = $scope.rec.invoice_code;

            }



            $scope.$root.breadcrumbs[3].name = $scope.$root.model_code;

        }



        if ($scope.$root.breadcrumbs.length == 3) {

            if ($scope.rec.debitNoteCode)

                $scope.$root.model_code = $scope.rec.supplierName + '(' + $scope.rec.debitNoteCode + ')';

            else

                $scope.$root.model_code = $scope.rec.supplierName;



            $scope.$root.breadcrumbs.push({ 'name': $scope.$root.model_code, 'url': '#', 'isActive': false });

        }





        $scope.rec.supplierAnonymousSupplier = result.anonymous_supplier;



        if (result.anonymous_supplier == 1)

            $scope.anonymousSupplierFlag = false;

        else

            $scope.anonymousSupplierFlag = true;



        angular.forEach($rootScope.country_type_arr, function (obj) {

            if (obj.id === result.country_id)

                $scope.rec.supplierCountry = obj;

        });



        // if ($scope.rec.update_id == undefined) {



        /* ============================= */

        /* Debit Note Invoice tab detail */

        /* ============================= */



        $scope.rec.billToSupplierID = result.id;

        $scope.rec.billToSupplierNo = result.code;

        $scope.rec.billToSupplierName = result.name;





        $scope.rec.billToSupplierAddress = result.billing_address_1;

        $scope.rec.billToSupplierAddress2 = result.billing_address_2;

        $scope.rec.billToSupplierCity = result.billing_city;

        $scope.rec.billToSupplierCounty = result.billing_county;

        $scope.rec.billToSupplierPostCode = result.billing_postcode;

        $scope.rec.bill_to_anonymous_supplier = result.anonymous_supplier;



        if (result.anonymous_supplier == 1)

            $scope.bill_anonymousSupplierFlag = false;

        else

            $scope.bill_anonymousSupplierFlag = true;





        // $scope.rec.billToSupplierAddress = result.address_1;

        // $scope.rec.billToSupplierAddress2 = result.address_2;

        // $scope.rec.billToSupplierCity = result.city;

        // $scope.rec.billToSupplierCounty = result.county;

        // $scope.rec.billToSupplierPostCode = result.postcode;



        $scope.rec.billToSupplierContactID = result.contact_id;

        $scope.rec.billToSupplierContact = result.contact_person;

        $scope.rec.billToSupplierTelephone = result.Telephone;

        $scope.rec.billToSupplierFax = result.fax;

        $scope.rec.billToSupplierEmail = result.email;



        angular.forEach($rootScope.country_type_arr, function (obj) {

            if (obj.id === result.billing_country)

                $scope.rec.billToSupplierCountry = obj;

        });



        // angular.forEach($rootScope.country_type_arr, function (obj) {

        //     if (obj.id === result.country_id)

        //         $scope.rec.billToSupplierCountry = obj;

        // });



        angular.forEach($rootScope.currencyArrPurchase, function (obj) {

            if (obj.id === result.currency_id)

                $scope.rec.currency_id = obj;

        });



        /* angular.forEach($rootScope.arr_currency, function (obj) {

            if (obj.id === result.currency_id)

                $scope.rec.currency_id = obj;

        }); */



        angular.forEach($rootScope.arr_srm_payment_terms, function (elem2) {

            if (elem2.id == result.payment_term)

                $scope.rec.payment_terms_codes = elem2;

        });



        angular.forEach($rootScope.arr_srm_payment_methods, function (elem3) {

            if (elem3.id == result.payment_method)

                $scope.rec.payment_method_ids = elem3;

        });



        $scope.rec.payable_bank = result.bank_name;

        $scope.rec.bank_account_id = result.bank_account_id;



        /* ============================== */

        /* Debit Note Shipping tab detail */

        /* ============================== */



        if (result.anonymous_supplier != 1) {



            $scope.rec.shipToSupplierLocName = result.locationDepot;

            $scope.rec.shipToSupplierLocAddress = result.locationAddress;

            $scope.rec.shipToSupplierLocAaddress2 = result.locationAddress2;

            $scope.rec.shipToSupplierLocCity = result.locationCity;

            $scope.rec.shipToSupplierLocCounty = result.locationCounty;

            $scope.rec.shipToSupplierLocPostCode = result.locationPostcode;



            // $scope.rec.shipToSupplierLocID = result.locationID;

            // $scope.rec.book_in_contact = result.ship_to_contact_shiping;

            // $scope.rec.shipToSupplierLocContact = result.direct_line;

            // $scope.rec.book_in_email = result.ship_to_email;

            // $scope.rec.book_in_tel = result.booking_telephone;



            $scope.rec.shipToSupplierLocID = result.locationID;

            $scope.rec.book_in_contact = result.booking_telephone;

            $scope.rec.shipToSupplierLocContact = result.ship_to_contact_shiping;

            $scope.rec.book_in_email = result.ship_to_email;

            $scope.rec.book_in_tel = result.booking_telephone;



            //     $scope.rec.shipToSupplierLocContact = result.clcontact_name;

            // $scope.rec.book_in_tel = result.clphone;

            // $scope.rec.book_in_email = result.clemail;

            // $scope.rec.book_in_contact = result.cldirect_line;



            angular.forEach($rootScope.country_type_arr, function (obj) {

                if (obj.id === result.country_id)

                    $scope.rec.shipToSupplierLocCountry = obj;

            });



        }



        /* if (result.DefaultLocation.length == undefined) {

            $scope.rec.shipToSupplierLocName = result.DefaultLocation.depot;

            $scope.rec.shipToSupplierLocAddress = result.DefaultLocation.address;

            $scope.rec.shipToSupplierLocAaddress2 = result.DefaultLocation.address_2;

            $scope.rec.shipToSupplierLocCity = result.DefaultLocation.city;

            $scope.rec.shipToSupplierLocCounty = result.DefaultLocation.county;

            $scope.rec.shipToSupplierLocPostCode = result.DefaultLocation.postcode;



            $scope.rec.book_in_contact = result.DefaultLocation.ship_to_contact_shiping;

            $scope.rec.shipToSupplierLocContact = result.DefaultLocation.direct_line;

            $scope.rec.book_in_email = result.DefaultLocation.ship_to_email;

            $scope.rec.book_in_tel = result.DefaultLocation.booking_telephone;



            // $scope.rec.ship_to_contact_shiping = result.DefaultLocation.contact_name;

            $scope.rec.shipToSupplierLocID = result.DefaultLocation.id;



            angular.forEach($rootScope.country_type_arr, function (obj) {

                if (obj.id === result.country_id)

                    $scope.rec.shipToSupplierLocCountry = obj;

            });

        } */

        // }

        angular.element('#listing_sp_single_Modal').modal('hide');

        $scope.supplier_emails(result.id);

    }



    $scope.supplier_emails = function(supplier_id){

        var postData = { 'token': $scope.$root.token, 'supplier_id': supplier_id };

        var supplierEmailUrl = $scope.$root.pr + "srm/srminvoice/get-supplier-emails";;

        $http

            .post(supplierEmailUrl, postData)

            .then(function (res) {

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

                    }

                    catch (ex) {

                        console.log(ex);

                    }

                }

                $scope.rec.supplier_emails = [];

                if (res.data.response.supplier_emails && res.data.response.supplier_emails.Emails) {

                    var supplierEmails = [];

                    angular.forEach(res.data.response.supplier_emails.Emails, function (obj, i) {

                        supplierEmails.push({ id: i, username: obj.trim() })

                    });

                    $scope.rec.supplier_emails['Emails'] = supplierEmails;

                }

                console.log($scope.rec);

                }



            }).catch(function (e) {

               $scope.showLoader = false;

                throw new Error(e.data);

            });

    }





    $scope.RemoveSupplier = function () {



        $rootScope.order_posting_group_id = 0;

        $scope.rec.payable_number = 0;

        $scope.rec.purchase_number = 0;

        $scope.rec.account_payable_id = 0;



        $scope.rec.purchaseInvoice = "";

        $scope.rec.purchaseInvoiceID = "";

        $scope.rec.purchaseInvoiceType = '';



        $rootScope.arrVATPostGrpPurchase = undefined;



        $scope.removeSupp = 0;



        if ($scope.$root.breadcrumbs.length > 3) {



            if ($scope.rec.debitNoteCode) {

                $scope.$root.model_code = $scope.rec.debitNoteCode;

                $scope.$root.breadcrumbs[3].name = $scope.$root.model_code;

            }

        }



        $scope.rec.Purchaser = '';

        $scope.rec.purchaserID = 0;

        $scope.rec.supplierID = 0;

        $scope.rec.supplierNo = '';

        $scope.rec.supplierReferenceNo = '';

        $scope.rec.supplierCreditNoteNo = '';

        $scope.rec.supplierName = '';

        $scope.rec.supplierAddress = '';

        $scope.rec.supplierAddress2 = '';

        $scope.rec.supplierCity = '';

        $scope.rec.supplierCounty = '';

        $scope.rec.supplierPostCode = '';



        $scope.rec.supplierContactID = 0;

        $scope.rec.supplierContactName = '';

        $scope.rec.supplierContactTelephone = '';

        $scope.rec.supplierContactFax = '';

        $scope.rec.supplierContactEmail = '';        

        

        $scope.rec.sell_to_anonymous_supplier = '';

        $scope.rec.supplierCountry = $scope.rec.billToSupplierCountry = $scope.rec.country = $scope.rec.shipToSupplierLocCountry = {};



        $scope.rec.srm_purchase_code = '';

        $scope.rec.purchase_code_id = 0;



        $scope.rec.shipping_agent_id = 0;

        $scope.rec.freight_charges = 0;

        $scope.rec.shipping_agent_code = '';

        $scope.rec.shippingAgentRefNo = '';

        $scope.rec.ship_delivery_time = '';

        $scope.rec.container_no = ''; 

        $scope.rec.warehouse_booking_ref = '';

        $scope.rec.customer_warehouse_ref = '';

        $scope.rec.prev_code = '';

        $scope.rec.due_date = '';

        $scope.rec.supp_order_no = '';

        $scope.rec.cust_order_no = '';

        $scope.rec.comm_book_in_no = '';



        $scope.selectedSaleOrderArr = [];

        $scope.PendingSelectedSaleOrder = [];



        $scope.selectedSaleOrders = "";



        /* ============================= */

        /* Debit Note Invoice tab detail */

        /* ============================= */



        $scope.rec.billToSupplierID = 0;

        $scope.rec.billToSupplierNo = '';

        $scope.rec.billToSupplierName = '';



        $scope.rec.billToSupplierAddress = '';

        $scope.rec.billToSupplierAddress2 = '';

        $scope.rec.billToSupplierCity = '';

        $scope.rec.billToSupplierCounty = '';

        $scope.rec.billToSupplierPostCode = '';

        $scope.rec.bill_to_anonymous_supplier = 0;



        $scope.rec.billToSupplierContactID = 0;

        $scope.rec.billToSupplierContact = '';

        $scope.rec.billToSupplierTelephone = '';

        $scope.rec.billToSupplierFax = '';

        $scope.rec.billToSupplierEmail = '';



        $rootScope.currencyID_PO = $scope.rec.currency_id = {};

        $scope.rec.payment_terms_codes = $scope.rec.payment_method_ids = {};



        $scope.rec.payable_bank = '';

        $scope.rec.bank_account_id = 0;



        /* ============================== */

        /* Debit Note Shipping tab detail */

        /* ============================== */



        $scope.rec.shipToSupplierLocName = '';

        $scope.rec.shipToSupplierLocAddress = '';

        $scope.rec.shipToSupplierLocAaddress2 = '';

        $scope.rec.shipToSupplierLocCity = '';

        $scope.rec.shipToSupplierLocCounty = '';

        $scope.rec.shipToSupplierLocPostCode = '';



        $scope.rec.shipToSupplierLocID = 0;

        $scope.rec.book_in_contact = '';

        $scope.rec.shipToSupplierLocContact = '';

        $scope.rec.book_in_email = '';

        $scope.rec.book_in_tel = '';

        $scope.rec.shipment_date = '';



        /* ============= */



        angular.element('#listing_sp_single_Modal').modal('hide');

    }



    $scope.searchKeywordshippingAgent = {};



    $scope.selectshippingAgent = function (item_paging,get_supplierCount) {



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

            .then(function (res) {

                // $scope.columns = [];

                $scope.record = {};

                $scope.showLoader = false;

                $scope.shippingAgentTableData = res;



                if (res.data.ack == true) {

                    angular.element('#listing_shippingAgents_Modal').modal({ show: true });

                }

                else

                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));



            }).catch(function (e) {

                if (get_supplierCount != 0) return $scope.get_supplier(item_paging, get_supplierCount - 1);



                $scope.showLoader = false;

                throw new Error(e.data);

            });

    }



    $scope.confirmshippingAgent = function (result) {

        $scope.rec.shipping_agent_id = result.id;

        $scope.rec.shipping_agent_code = result.name;

        angular.element('#listing_shippingAgents_Modal').modal('hide');

        return;

    }



    $scope.getAltContact = function (arg) {



        $scope.title = 'Contacts';

        $scope.contactArg = arg;



        if ($scope.rec.supplierID == undefined) {

            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Supplier']));

            return;

        }

        else {

            var postAltCData = {

                'acc_id': $scope.rec.supplierID,

                'module_type': 2,

                'token': $scope.$root.token

            };



            $scope.showLoader = true;



            var altContactUrl = $scope.$root.pr + "srm/srm/alt-contacts";

            $http

                .post(altContactUrl, postAltCData)

                .then(function (res) {



                    $scope.columns = [];

                    $scope.record = {};

                    $scope.filtercontact = {};

                    $scope.showLoader = false;



                    if (res.data.record.ack == true) {

                        $scope.record = res.data.record.result;



                        angular.forEach(res.data.record.result[0], function (val, index) {

                            $scope.columns.push({

                                'title': toTitleCase(index),

                                'field': index,

                                'visible': true

                            });

                        });



                        angular.element('#orderContactModal').modal({ show: true });

                    }

                    else

                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(558));

                })

                .catch(function (message) {

                    $scope.showLoader = false;



                    throw new Error(message.data);

                });

        }

    }



    $scope.confirm_contact = function (result) {



        if ($scope.contactArg == 1) {



            $scope.rec.supplierContactID = result.id;

            $scope.rec.supplierContactName = result.name;

            $scope.rec.supplierContactTelephone = result.phone;

            $scope.rec.supplierContactEmail = result.email;

            $scope.rec.supplierContactFax = result.fax;

        }



        /* if ($scope.contactArg == 2) {

            $scope.rec.billToSupplierContactID = result.id;

            $scope.rec.billToSupplierContact = result.name;

            $scope.rec.billToSupplierTelephone = result.phone;

            $scope.rec.billToSupplierEmail = result.email;

            $scope.rec.billToSupplierFax = result.fax;

        } */



        angular.element('#orderContactModal').modal('hide');

    }



    $scope.getAltDepot = function () {

        $scope.title = 'Location Listing';



        if ($scope.rec.supplierID == undefined) {

            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Supplier']));

            return;

        }

        else {

            $scope.showLoader = true;

            var ApiAjax = $scope.$root.pr + "srm/srm/alt-delivery-depots";

            var postData = {

                'token': $scope.$root.token,

                'acc_id': $scope.rec.supplierID,

                'module_type': 2

            }

            $http

                .post(ApiAjax, postData)

                .then(function (res) {

                    $scope.columns = [];

                    $scope.record = {};

                    $scope.filterLoc = {};

                    $scope.showLoader = false;



                    if (res.data.record.ack == true) {

                        $scope.record = res.data.record.result;



                        angular.forEach(res.data.record.result[0], function (val, index) {

                            $scope.columns.push({

                                'title': toTitleCase(index),

                                'field': index,

                                'visible': true

                            });

                        });



                        angular.element('#deliveryLocationsModal').modal({ show: true });

                    }

                    else

                        toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(563));

                })

                .catch(function (message) {

                    $scope.showLoader = false;



                    throw new Error(message.data);

                });

        }

    }



    $scope.confirmLocation = function (result) {



        $scope.rec.shipToSupplierLocName = result.location;

        $scope.rec.shipToSupplierLocAddress = result.address_1;

        $scope.rec.shipToSupplierLocAaddress2 = result.address_2;

        $scope.rec.shipToSupplierLocCity = result.city;

        // shipToSupplierLocCounty

        $scope.rec.shipToSupplierLocPostCode = result.postcode;

        $scope.rec.shipToSupplierLocID = result.id;



        $scope.rec.shipToSupplierLocContact = result.clcontact_name;

        $scope.rec.book_in_tel = result.clphone;

        $scope.rec.book_in_email = result.clemail;

        $scope.rec.book_in_contact = result.cldirect_line;

        $scope.rec.shipToSupplierLocCounty = result.county;



        // $scope.rec.book_in_contact = result.clcontact_name;

        // $scope.rec.book_in_tel = result.clphone;

        // $scope.rec.book_in_email = result.clemail;



        angular.forEach($rootScope.country_type_arr, function (obj) {

            if (obj.id === result.country)

                $scope.rec.shipToSupplierLocCountry = obj;

        });

        angular.element('#deliveryLocationsModal').modal('hide');

    }



    $scope.get_empl_list = function (arg) {



        $scope.showLoader = true;

        $scope.columns_pr = [];

        $scope.record_pr = {};

        $scope.searchKeyword_offered = {};

        $scope.searchKeyword = {};

        $scope.title = 'Recieved By';

        $scope.empListType = 'general';



        if (arg == 'Purchaser') {

            $scope.title = 'Employee List';

            $scope.empListType = 'Purchaser';

        }



        var empUrl = $scope.$root.hr + "employee/listings";



        var postData = {

            'token': $scope.$root.token

        };



        $http

            .post(empUrl, postData)

            .then(function (res) {

                if (res.data.ack == true) {

                    $scope.columns_pr = [];

                    $scope.record_pr = {};

                    $scope.record_pr = res.data.response;

                    $scope.showLoader = false;



                    angular.forEach(res.data.response[0], function (val, index) {

                        $scope.columns_pr.push({

                            'title': toTitleCase(index),

                            'field': index,

                            'visible': true

                        });

                    });



                    angular.element('#_SrmEmplisting_model').modal({ show: true });

                } else

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

            }).catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

            });

    }



    $scope.confirm_employeeList = function (result, emptype) {



        if (emptype == 'Purchaser') {

            $scope.rec.Purchaser = result.name;

            $scope.rec.purchaserID = result.id;

        }

        angular.element('#_SrmEmplisting_model').modal('hide');

    }



    $scope.discardDebitNote = function () {



        // var deletePurchaseOrderUrl = $scope.$root.pr + "srm/srminvoice/delete-Purchase-Order-before-save";

        if (!($scope.rec.id > 0)) {

            $state.go("app.srm_order_return");

            return false;

        }





        var deleteDebitNoteUrl = $scope.$root.pr + "srm/srmorderreturn/delete-debit-note-before-save";



        ngDialog.openConfirm({

            template: 'modalDiscardPurchaseOrderDialogId',

            className: 'ngdialog-theme-default-custom'

        }).then(function (value) {

            $http

                .post(deleteDebitNoteUrl, { 'id': $scope.rec.id, 'token': $scope.$root.token })

                .then(function (res) {

                    $state.go("app.srm_order_return");

                })

                .catch(function (message) {

                    $scope.showLoader = false;



                    throw new Error(message.data);

                });

        }, function (reason) {

            $scope.showLoader = false;

            console.log('Modal promise rejected. Reason: ', reason);

        });

    }



    $scope.searchKeywordSuppInv = {};



    $scope.get_suppliers_invoicing = function (item_paging) {

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



        $http

            .post(supplierUrl, $scope.postData)

            .then(function (res) {

                $scope.showLoader = false;

                $scope.supplierInvTableData = res;



                if (res.data.ack == true) {

                    // $scope.recordSuppInvoice = res.data.response;

                    angular.element('#listing_sp_single_invoice_Modal').modal({ show: true });

                }

                else

                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));

            }).catch(function (message) {

                $scope.showLoader = false;

                throw new Error(message.data);

            });

    }



    $scope.confirm_supp_invoicing_single = function (result) {



        if (result.anumber == null) {

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Account Payable']));

            return;

        }



        if (result.pnumber == null) {

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Purchase Code']));

            return;

        }



        $scope.rec.billToSupplierID = result.id;

        $scope.rec.billToSupplierNo = result.code;

        $scope.rec.billToSupplierName = result.name;

        $scope.rec.billToSupplierAddress = result.address_1;

        $scope.rec.billToSupplierAddress2 = result.address_2;

        $scope.rec.billToSupplierCity = result.city;

        $scope.rec.billToSupplierCounty = result.county;

        $scope.rec.billToSupplierPostCode = result.postcode;



        $scope.rec.billToSupplierContactID = result.contact_id;

        $scope.rec.billToSupplierContact = result.contact_person;

        $scope.rec.billToSupplierTelephone = result.Telephone;

        $scope.rec.billToSupplierFax = result.fax;

        $scope.rec.billToSupplierEmail = result.email;



        $scope.rec.bill_to_anonymous_supplier = result.anonymous_supplier;



        if (result.anonymous_supplier == 1)

            $scope.bill_anonymousSupplierFlag = false;

        else

            $scope.bill_anonymousSupplierFlag = true;



        angular.forEach($rootScope.country_type_arr, function (obj) {

            if (obj.id === result.country_id)

                $scope.rec.billToSupplierCountry = obj;

        });



        angular.forEach($rootScope.arr_currency, function (obj) {

            if (obj.id === result.currency_id)

                $scope.rec.currency_id = obj;

        });



        angular.forEach($rootScope.arr_srm_payment_terms, function (elem2) {

            if (elem2.id == result.payment_term)

                $scope.rec.payment_terms_codes = elem2;

        });



        angular.forEach($rootScope.arr_srm_payment_methods, function (elem3) {

            if (elem3.id == result.payment_method)

                $scope.rec.payment_method_ids = elem3;

        });



        $scope.rec.payable_bank = result.bank_name;

        $scope.rec.bank_account_id = result.bank_account_id;



        angular.element('#listing_sp_single_invoice_Modal').modal('hide');

    }



    $scope.getBankAccount = function () {



        $scope.searchKeyword = '';

        $scope.columns = [];

        $scope.record = [];

        $scope.title = 'Payable Bank';

        var getBankUrl = $scope.$root.setup + "general/bank-accounts";



        var postData = { 'token': $scope.$root.token, 'filter_id': 152 };

        $http

            .post(getBankUrl, postData)

            .then(function (res) {



                if (res.data.ack > 0) {



                    $scope.record = res.data.response;



                    angular.forEach(res.data.response[0], function (val, index) {

                        $scope.columns.push({

                            'title': toTitleCase(index),

                            'field': index,

                            'visible': true

                        });

                    });

                    angular.element('#_model_modal_bank_order').modal({ show: true });

                }

            });

    }



    $scope.confirm_bank = function (btc) {

        // $scope.rec.payable_bank = btc.account_name;

        $scope.rec.payable_bank = btc.bank_name;

        // $scope.rec.payable_bank = btc.preferred_name;

        $scope.rec.bank_account_id = btc.id;

        angular.element('#_model_modal_bank_order').modal('hide');

    }



    $scope.$root.paid_amount = 0;

    $scope.GetRemainingAmount = function () {



        var RAmountUrl = $scope.$root.gl + "chart-accounts/get-invoice-remaining-payment";



        $http

            .post(RAmountUrl, { 'doc_type': 5, 'invoice_id': $stateParams.id, 'token': $scope.$root.token })

            .then(function (res) {

                if (res.data.ack == true) {

                    $scope.$root.paid_amount = res.data.response.payed_amount;



                    if (res.data.response.payed_amount == null)

                        $scope.$root.paid_amount = 0;

                }

                else {

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

                    $scope.$root.paid_amount = 0;

                }

            })

            .catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

            });

    }



    $scope.getSalePerson = function (arg) {

        $scope.columns = [];

        $scope.record = {};

        var empUrl = $scope.$root.hr + "employee/listings";

        var postData = {

            'token': $scope.$root.token,

            'all': "1",

        };

        $http

            .post(empUrl, postData)

            .then(function (res) {

                if (res.data.ack == true) {

                    $scope.columns = [];

                    $scope.record = {};

                    $scope.record = res.data.response;



                    angular.forEach(res.data.response[0], function (val, index) {

                        $scope.columns.push({

                            'title': toTitleCase(index),

                            'field': index,

                            'visible': true

                        });

                    });

                }

                else

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

            })

            .catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

            });



        ngDialog.openConfirm({

            template: 'modalDialogId_cus',

            className: 'ngdialog-theme-default',

            scope: $scope

        }).then(function (result) {

            //console.log(result);

            $scope.rec.sale_person = result.first_name + ' ' + result.last_name;

            //console.log($scope.rec.sale_person);

            $scope.rec.sale_person_id = result.id;

        }, function (reason) {

            console.log('Modal promise rejected. Reason: ', reason);

        });

    }



    if ($state.current.name == 'app.viewsrmorderreturninvoice') {

        $scope.$root.breadcrumbs = [{ 'name': 'Purchases', 'url': '#', 'isActive': false }, { 'name': 'Suppliers', 'url': 'app.supplier', 'isActive': false }, { 'name': 'Posted Debit Notes', 'url': 'app.purchase-return-invoice', 'isActive': false }];



    } else {

        $scope.$root.breadcrumbs = [{ 'name': 'Purchases', 'url': '#', 'isActive': false }, { 'name': 'Suppliers', 'url': 'app.supplier', 'isActive': false }, { 'name': 'Debit Notes', 'url': 'app.srm_order_return', 'isActive': false }];



    }







    // check for if Quantity is greater than available stock than make the quantity empty.

    $scope.check_valid_qty = function (item) {

        if (parseFloat(item.qty) > parseFloat(item.current_stock)) {

            item.qty = "";

            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(559, ['Quantity  ', 'available stock']));

        }

    }



    $scope.submit_show_invoice = false;

    //$scope.$root.order_type=$scope.rec.type;

    //if($scope.$root.order_type==1) $scope.submit_show_invoice=true;



    if ($stateParams.id === undefined)

        $scope.submit_show_invoice = true;



    $scope.getformdatabyId = function () {

        $scope.showLoader = true;



        /* $scope.volume = 0;

        $scope.weight = 0;

        $scope.volume_unit = '';

        $scope.weightunit = '';

        $scope.weight_permission = 0;

        $scope.volume_permission = 0;

        $scope.showVolumeWeight = 0; */



        var getQuoteUrl = $scope.$root.pr + "srm/srmorderreturn/get-order-return-by-id";

        $http

            .post(getQuoteUrl, { 'id': $stateParams.id, 'token': $scope.$root.token, 'moduleName': $scope.moduleNameForRoles })

            .then(function (res) {

                //+$scope.getQuoteNo(res.data.response.invoice_no);                



                if (res.data.ack == true) {

                    /* $scope.$root.type = res.data.response.type;



                    if ($scope.$root.type == 2)

                        $scope.GetRemainingAmount(); */

                    $scope.rec = res.data.response;

                    $rootScope.currencyArrPurchase = res.data.currency_arr_local;

                    // $scope.removeSupp = 1;



                    $rootScope.arrVATPostGrpPurchase = res.data.arrVATPostGrpPurchase;



                    if (Number($scope.rec.supplierID) > 0)

                        $scope.removeSupp = 1;

                    else

                        $scope.removeSupp = 0;



                    if (res.data.response.e_emails) {

                        try {

                            $scope.supplierOrderEmail = res.data.response.e_emails.response.purchaseOrderEmail;

                            $scope.supplierDebitEmail = res.data.response.e_emails.response.debitNoteEmail;

                            $scope.supplierRemittanceEmail = res.data.response.e_emails.response.remittanceAdviceEmail;

                        }

                        catch (ex) {

                            console.log(ex);

                        }

                    }



                    if ($scope.rec.supplier_emails && $scope.rec.supplier_emails.Emails) {

                        var supplierEmails = [];

                        angular.forEach($scope.rec.supplier_emails.Emails, function (obj, i) {

                            supplierEmails.push({ id: i, username: obj.trim() })

                        });

                        $scope.rec.supplier_emails.Emails = supplierEmails;

                    }



                    $rootScope.order_posting_group_id = $scope.rec.bill_to_posting_group_id;

                    $scope.rec.update_id = $stateParams.id;



                    moduleTracker.updateRecord($stateParams.id);

                    moduleTracker.updateRecordName(res.data.response.debitNoteCode + ((res.data.response.debitNoteCode && res.data.response.invoice_code) ? "/" : "") + (res.data.response.invoice_code ? res.data.response.invoice_code : ""));



                    $scope.rec.Purchaser = $scope.rec.purchaser;

                    $scope.rec.freight_charges = parseFloat(res.data.response.freight_charges);

                    // $scope.rec.purchaserID = result.purchaserID;





                    $scope.rec.supplierAnonymousSupplier = res.data.response.anonymous_supplier;



                    if (res.data.response.anonymous_supplier == 1)

                        $scope.anonymousSupplierFlag = false;

                    else

                        $scope.anonymousSupplierFlag = true;



                    $scope.rec.bill_anonymousSupplierFlag = res.data.response.bill_anonymousSupplier;



                    if (res.data.response.bill_anonymousSupplierFlag == 1)

                        $scope.bill_anonymousSupplierFlag = false;

                    else

                        $scope.bill_anonymousSupplierFlag = true;





                    // $scope.$root.model_code = res.data.response.supplierName + '(' + res.data.response.supplierNo + ')';

                    // $scope.$root.model_code = res.data.response.supplierName + '(' + res.data.response.debitNoteCode + ')';



                    if ($state.current.name == 'app.viewsrmorderreturninvoice') {

                        $scope.$root.model_code = res.data.response.supplierName + '(' + res.data.response.invoice_code + ')';



                    } else {

                        $scope.$root.model_code = res.data.response.supplierName + '(' + res.data.response.debitNoteCode + ')';

                    }





                    $scope.module_code = $scope.$root.model_code;



                    $scope.$root.breadcrumbs.push({ 'name': $scope.$root.model_code, 'url': '#', 'isActive': false });



                    if (res.data.response.supplierCreditNoteDate == 0)

                        $scope.rec.supplierCreditNoteDate = null;

                    else

                        $scope.rec.supplierCreditNoteDate = res.data.response.supplierCreditNoteDate;



                    if (res.data.response.dispatchDate == 0)

                        $scope.rec.dispatchDate = null;

                    else

                        $scope.rec.dispatchDate = res.data.response.dispatchDate;



                    if (res.data.response.supplierReceiptDate == 0)

                        $scope.rec.supplierReceiptDate = null;

                    else

                        $scope.rec.supplierReceiptDate = res.data.response.supplierReceiptDate;



                    if (res.data.response.shipment_date == 0)

                        $scope.rec.shipment_date = null;

                    else

                        $scope.rec.shipment_date = res.data.response.shipment_date;



                    if (res.data.response.deliveryDate == 0)

                        $scope.rec.deliveryDate = null;

                    else

                        $scope.rec.deliveryDate = res.data.response.deliveryDate;





                    angular.forEach($rootScope.srm_shippment_methods_arr, function (elem) {

                        if (elem.id == res.data.response.shipment_method_id)

                            $scope.rec.shipment_method_code = elem;

                    });



                    angular.forEach($rootScope.arr_srm_payment_terms, function (elem) {

                        if (elem.id == res.data.response.payment_terms_code)

                            $scope.rec.payment_terms_codes = elem;

                    });



                    angular.forEach($rootScope.arr_srm_payment_methods, function (elem) {

                        if (elem.id == res.data.response.payment_method_id)

                            $scope.rec.payment_method_ids = elem;

                    });



                    angular.forEach($rootScope.currencyArrPurchase, function (elem) {

                        if (elem.id == $scope.rec.currency_id) {

                            $rootScope.currency_id = elem;

                            $scope.rec.currency_id = elem;

                        }

                    });



                    /* angular.forEach($rootScope.arr_currency, function (elem) {

                        if (elem.id == $scope.rec.currency_id) {

                            $rootScope.currency_id = elem;

                            $scope.rec.currency_id = elem;

                        }

                    }); */



                    angular.forEach($rootScope.country_type_arr, function (obj) {



                        if (obj.id === res.data.response.supplierCountry)

                            $scope.rec.supplierCountry = obj;



                        if (obj.id === res.data.response.billToSupplierCountry)

                            $scope.rec.billToSupplierCountry = obj;



                        if (obj.id === res.data.response.shipToSupplierLocCountry)

                            $scope.rec.shipToSupplierLocCountry = obj;

                    });



                    /* $scope.volume = res.data.volume;

                    $scope.weight = res.data.weight;

                    $scope.volume_unit = res.data.volume_unit;

                    $scope.weightunit = res.data.weightunit;                    

                    $scope.weight_permission = res.data.weight_permission; 

                    $scope.volume_permission = res.data.volume_permission; 



                    if($scope.weight_permission >0 || $scope.volume_permission>0)

                        $scope.showVolumeWeight = 1; */



                    $scope.get_srm_order_items();

                }

                else

                     $scope.showLoader = false;



            }).catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

            });

    }



    if ($stateParams.id !== undefined)

        $scope.getformdatabyId();



    $scope.gotoEdit = function () {

        $scope.check_readonly = false;

    }



    $scope.generalInformation = function () {



        if ($scope.$root.breadcrumbs.length == 2) {

            // $scope.$root.model_code = $scope.rec.supplierName + '(' + $scope.rec.debitNoteCode + ')';

            if ($state.current.name == 'app.viewsrmorderreturninvoice') {

                $scope.$root.model_code = $scope.rec.supplierName + '(' + $scope.rec.invoice_code + ')';



            } else {

                $scope.$root.model_code = $scope.rec.supplierName + '(' + $scope.rec.debitNoteCode + ')';

            }



            $scope.$root.breadcrumbs.push({ 'name': $scope.$root.model_code, 'url': '#', 'isActive': false });

        }

    }



    $scope.invoice_information = function () {



        if ($scope.$root.breadcrumbs.length == 2) {

            // $scope.$root.model_code = $scope.rec.supplierName + '(' + $scope.rec.supplierNo + ')';

            // $scope.$root.model_code = $scope.rec.supplierName + '(' + $scope.rec.debitNoteCode + ')';



            if ($state.current.name == 'app.viewsrmorderreturninvoice') {

                $scope.$root.model_code = $scope.rec.supplierName + '(' + $scope.rec.invoice_code + ')';



            } else {

                $scope.$root.model_code = $scope.rec.supplierName + '(' + $scope.rec.debitNoteCode + ')';

            }



            $scope.$root.breadcrumbs.push({ 'name': $scope.$root.model_code, 'url': '#', 'isActive': false });

        }

    }



    $scope.shiping_information = function () {



        if ($scope.$root.breadcrumbs.length == 2) {

            // $scope.$root.model_code = $scope.rec.supplierName + '(' + $scope.rec.supplierNo + ')';

            // $scope.$root.model_code = $scope.rec.supplierName + '(' + $scope.rec.debitNoteCode + ')';



            if ($state.current.name == 'app.viewsrmorderreturninvoice') {

                $scope.$root.model_code = $scope.rec.supplierName + '(' + $scope.rec.invoice_code + ')';



            } else {

                $scope.$root.model_code = $scope.rec.supplierName + '(' + $scope.rec.debitNoteCode + ')';

            }



            $scope.$root.breadcrumbs.push({ 'name': $scope.$root.model_code, 'url': '#', 'isActive': false });

        }

    }





    //--------------------- start General   ------------------------------------------



    if ($stateParams.id > 0)

        $scope.debitNoteDeleteBtn = false;



    $scope.add_general = function (rec, rec2) {



        rec.token = $scope.$root.token;

        rec.id = $stateParams.id;

        rec.type = 1;



        if (rec.supplierNo == undefined || rec.supplierNo == null) {

            $scope.showLoader = false;

            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Supplier No.']));

            return false;

        }



        rec.supplierCountrys = (rec.supplierCountry != undefined && rec.supplierCountry != '') ? rec.supplierCountry.id : 0;

        rec.billToSupplierCountrys = (rec.billToSupplierCountry != undefined && rec.billToSupplierCountry != '') ? rec.billToSupplierCountry.id : 0;

        rec.shipToSupplierLocCountrys = (rec.shipToSupplierLocCountry != undefined && rec.shipToSupplierLocCountry != '') ? rec.shipToSupplierLocCountry.id : 0;

        rec.currency_ids = (rec.currency_id != undefined && rec.currency_id != '') ? rec.currency_id.id : 0;



        rec.payment_terms_code = (rec.payment_terms_codes != undefined && rec.payment_terms_codes != '') ? rec.payment_terms_codes.id : 0;

        rec.payment_method_id = (rec.payment_method_ids != undefined && rec.payment_method_ids != '') ? rec.payment_method_ids.id : 0;

        rec.shipment_method_id = (rec.shipment_method_code != undefined && rec.shipment_method_code != '') ? rec.shipment_method_code.id : 0;

        rec.shipment_method = (rec.shipment_method_code != undefined && rec.shipment_method_code != '') ? rec.shipment_method_code.name : 0;



        angular.forEach($rootScope.arr_currency, function (obj) {

            if (obj.id === rec.currency_ids)

                $rootScope.currency_id = obj;

        });



        if ($scope.rec.debitNoteCode != undefined) {

            // $scope.UpdateForm(rec);



            var addQuoteUrl = $scope.$root.pr + "srm/srmorderreturn/update-order-return";



            rec.posting_group_id = $rootScope.order_posting_group_id;



            rec.net_amount = $rootScope.netValuedebitNote;

            rec.tax_amount = $rootScope.vatValueDebitNote;

            rec.grand_total = $rootScope.grandTotalDebitNote;

            rec.defaultCurrencyID = $scope.$root.defaultCurrency;



            rec.items_net_total = $scope.rec.items_net_total;

            rec.items_net_discount = $scope.rec.items_net_discount;

            rec.items_net_vat = $scope.rec.items_net_vat;







            return $http

                .post(addQuoteUrl, rec)

                .then(function (res) {

                    if (res.data.ack == true) {

                        moduleTracker.updateRecord(res.data.id);

                        moduleTracker.updateRecordName($scope.rec.debitNoteCode);

                        $scope.$root.rec_id = res.data.id;

                        $stateParams.id = res.data.id;

                        $scope.recnew = res.data.id;

                        $scope.rec.id = res.data.id;

                        $scope.rec.update_id = res.data.id;

                        $scope.debitNoteDeleteBtn = true;

                        return true;

                    }

                    else if (res.data.id >0) {

                        moduleTracker.updateRecord(res.data.id);

                        moduleTracker.updateRecordName($scope.rec.debitNoteCode);

                        $scope.$root.rec_id = res.data.id;

                        $stateParams.id = res.data.id;

                        $scope.recnew = res.data.id;

                        $scope.rec.id = res.data.id;

                        $scope.rec.update_id = res.data.id;

                        $scope.debitNoteDeleteBtn = true;

                        return true;

                    }

                    else {

                        $scope.showLoader = false;

                        // return true;

                        toaster.pop('error', 'info', res.data.error);

                        return false;

                    }





                }).catch(function (message) {

                    $scope.showLoader = false;



                    throw new Error(message.data);

                });

        }

        else {

            var getCodeUrl = $scope.$root.stock + "products-listing/get-code";

            var name = $scope.$root.base64_encode('srm_order_return');

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

                .then(function (res) {



                    if (res.data.ack == 1) {

                        $scope.rec.debitNoteCode = res.data.code;



                        // if ($scope.rec.debitNoteCode != undefined)

                        //     $scope.UpdateForm(rec);

                        if ($scope.rec.debitNoteCode != undefined) {

                            // $scope.UpdateForm(rec);



                            var addQuoteUrl = $scope.$root.pr + "srm/srmorderreturn/update-order-return";



                            rec.posting_group_id = $rootScope.order_posting_group_id;



                            if ($scope.$root.breadcrumbs.length > 3) {



                                if ($scope.rec.debitNoteCode)

                                    $scope.$root.model_code = $scope.rec.supplierName+ '(' + $scope.rec.debitNoteCode + ')';

                                else

                                    $scope.$root.model_code = $scope.rec.supplierName;



                                $scope.$root.breadcrumbs[3].name = $scope.$root.model_code;

                            }



                            rec.net_amount = $rootScope.netValuedebitNote;

                            rec.tax_amount = $rootScope.vatValueDebitNote;

                            rec.grand_total = $rootScope.grandTotalDebitNote;

                            rec.defaultCurrencyID = $scope.$root.defaultCurrency;



                            rec.items_net_total = $scope.rec.items_net_total;

                            rec.items_net_discount = $scope.rec.items_net_discount;

                            rec.items_net_vat = $scope.rec.items_net_vat;







                            return $http

                                .post(addQuoteUrl, rec)

                                .then(function (res) {

                                    if (res.data.ack == true) {

                                        moduleTracker.updateRecord(res.data.id);

                                        moduleTracker.updateRecordName($scope.rec.debitNoteCode);

                                        $scope.$root.rec_id = res.data.id;

                                        $stateParams.id = res.data.id;

                                        $scope.recnew = res.data.id;

                                        $scope.rec.id = res.data.id;

                                        $scope.rec.update_id = res.data.id;

                                        $scope.debitNoteDeleteBtn = true;

                                        return true;

                                    }                                    

                                    else if(res.data.id >0) {

                                        moduleTracker.updateRecord(res.data.id);

                                        moduleTracker.updateRecordName($scope.rec.debitNoteCode);

                                        $scope.$root.rec_id = res.data.id;

                                        $stateParams.id = res.data.id;

                                        $scope.recnew = res.data.id;

                                        $scope.rec.id = res.data.id;

                                        $scope.rec.update_id = res.data.id;

                                        $scope.debitNoteDeleteBtn = true;

                                        return true;

                                    }

                                    else {

                                        $scope.showLoader = false;

                                        toaster.pop('error', 'info', res.data.error);

                                        return false;

                                    }





                                }).catch(function (message) {

                                    $scope.showLoader = false;



                                    throw new Error(message.data);

                                });

                        }

                        else{

                            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['SRM Code']));

                            return false;

                        }

                    }

                    else {

                        toaster.pop('error', 'info', res.data.error);

                        return false;

                    }

                }).catch(function (message) {

                    $scope.showLoader = false;



                    throw new Error(message.data);

                });

        }

    }





    $scope.list_order = true;

    $scope.show_list_order = function () {



        var prodApi = $scope.$root.sales + "customer/order/listings";

        postData = {

            'token': $scope.$root.token,

            'all': "1",

            'type': 1,

        };

        $http

            .post(prodApi, postData)

            .then(function (res) {



                //   if (res.data.ack == true) {

                $scope.record = {};

                $scope.columns = [];

                $scope.record = res.data.record.result;

                $scope.columns = res.data.columns;

                //  }

            }).catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

            });



        ngDialog.openConfirm({

            template: 'app/views/srm_order_return/_listing_employee_modal.html',

            className: 'ngdialog-theme-default',

            scope: $scope,

            size: 'lg'

        }).then(function (result) {



            $scope.rec.order_list_name = result['Code'];

            $scope.rec.order_list_id = result.id;

        }, function (reason) {

            // console.log('Modal promise rejected. Reason: ', reason);

        });

    }



    angular.element(document).on('click', '#checkAll', function () {

        if (angular.element('#checkAll').is(':checked') == true) {

            for (var i = 0; i < $scope.items.length; i++) {

                $scope.items[i].chk = true;

            }

        } else {

            for (var i = 0; i < $scope.items.length; i++) {

                $scope.items[i].chk = false;

            }

        }

        $scope.$root.$apply(function () {

            $scope.items;

        })

    });





    $scope.IsVisible = true;

    $scope.show_view_data = function (classname) {

        $scope.IsVisible = $scope.IsVisible ? false : true;

    }



    $scope.check_number = function () {

        var id = document.getElementById('supp_order_no').value;



        var Url = $scope.$root.pr + "srm/srmorderreturn/get-invoice-number";

        $http

            .post(Url, { 'id': id, 'token': $scope.$root.token })

            .then(function (res) {

                if (res.data.ack == false) {

                    toaster.pop('error', 'Info', 'Already Exits !');



                    $('.pic_block').attr("disabled", true);

                }

                else

                    $('.pic_block').attr("disabled", false);

            }).catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

            });

    }





    $scope.saveOrderSublist = function (rec2, rec, mode) {

        var quoteUrl = $scope.$root.pr + "srm/srmorderreturn/update-sublist";



        rec2.note = rec.note;



        rec2.items = $scope.items;

        rec2.invoice_id = $stateParams.id

        rec2.token = $rootScope.token;

        rec2.debitNoteCode = $scope.rec.debitNoteCode;

        // console.log(rec);

        // console.log(rec2);



        if (rec == 0)

            rec = $scope.rec;



        // console.log($scope.rec);

        // console.log(rec);



        var validationchk = 0;

        $scope.supplierLocMandatory = 0;



        angular.forEach($scope.items, function (obj) {



            // console.log(obj);

            if (obj.item_type == 0)

                $scope.supplierLocMandatory = 1;



            /* if (obj.discount_type_id != undefined && (obj.discount == null || obj.discount == undefined)) {



                $scope.showLoader = false;

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(603, [obj.product_name]));

                obj.discount = "";

                validationchk++;

                return false;

            }

            else if (obj.discount_type_id == undefined && obj.discount != null && obj.discount != '' && obj.discount != undefined) {



                $scope.showLoader = false;

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(604, [obj.product_name]));

                obj.discount = "";

                validationchk++;

                $scope.showLoader = false;

                return false;

            } */



            if (obj.discount_type_id && !(obj.discount)) {



                $scope.showLoader = false;

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(603, [obj.product_name]));

                obj.discount = "";

                validationchk++;

                return false;

            }

            else if (!(obj.discount_type_id) && obj.discount) {



                $scope.showLoader = false;

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(604, [obj.product_name]));

                obj.discount = "";

                validationchk++;

                $scope.showLoader = false;

                return false;

            }



            // if (!(obj.standard_price > 0) && obj.item_type) {

            /* if ((obj.standard_price == 0 || obj.standard_price == '') && obj.item_type) {



                $scope.showLoader = false;



                if (obj.item_type > 0)

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(605, [obj.product_name]));

                else

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(606, [obj.product_name]));



                validationchk++;

                return false;

            } */

            // console.log(obj);

        });



        // console.log($scope.rec.shipToSupplierLocName);



        /* if ($scope.rec.shipToSupplierLocName != undefined) {

            if ($scope.supplierLocMandatory == 1 && !($scope.rec.shipToSupplierLocName.length > 0)) {



                $scope.showLoader = false;

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(560));

                return false;

            }

        } */



        if (validationchk > 0) {

            $scope.showLoader = false;

            return false;

        }





        rec2.currency_id = $rootScope.currency_id.id;

        /* rec2.posting_date = $rootScope.posting_date;

        rec2.order_date = $scope.rec.order_date; */



        if ($stateParams.id > 0)

            rec2.invoice_id = $stateParams.id;

        else

            rec2.invoice_id = rec.id;



        if (rec2.invoice_id > 0) {



            if ($scope.supplierLocMandatory == 1 && $scope.rec.shipToSupplierLocName != undefined) {



                if (!($scope.rec.shipToSupplierLocName.length > 0)) {

                    $scope.showLoader = false;

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(560));

                    return false;

                }

            }

            else if ($scope.supplierLocMandatory == 1 && $scope.rec.shipToSupplierLocName == undefined) {

                $scope.showLoader = false;

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(560));

                return false;

            }

        }



        rec2.supplier_id = $scope.rec.supplierID;

        rec2.invoice_type = $scope.rec.type;

        rec2.mode = mode;



        // console.log(rec2);return;

        return $http

            .post(quoteUrl, rec2)

            .then(function (res) {

                // $scope.showLoader = false;



                // $scope.debitNoteDeleteBtn = false;



            }).catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

            });

    }



    $scope.disablePostInvBtn = false;



    /* $scope.convert_post_invoice = function (rec, rec2) {

        var valid = 1;

        var quantity_count = 0;

        var valid_dispatch_check = 1;

        var include_item = 0;

        var total_rec = 0;

        var item_count = 0;

        var gl_count = 0;

        $scope.disablePostInvBtn = true;

        $scope.showLoader = true;



        if ($scope.rec.supplierCreditNoteDate == null) {

            $scope.disablePostInvBtn = false;

            $scope.showLoader = false;

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Supplier Credit Note Date']));

            return false;

        }



        $scope.netTotalAmount = $scope.netTotal();

        $scope.grand_totalAmount = $scope.grandTotal();



        if (parseFloat($scope.netTotalAmount) < 0 || parseFloat($scope.grand_totalAmount) < 0) {

            $scope.disablePostInvBtn = false;

            $scope.showLoader = false;

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(582));

            return false;

        }



        var uomFlag = 0; // Check for unit of measure        



        var stockCheckConfirm = 0;// Check for stock allocation required  

        // in case when a user directly post the invoice without doing stock allocation for items



        $scope.supplierLocMandatory = 0;



        angular.forEach($scope.items, function (obj) {



            if (isNaN(parseFloat(obj.remainig_qty))) {

                obj.remainig_qty = obj.qty;

            }



            if (obj.item_type == 0)

                $scope.supplierLocMandatory = 1;



            if (obj.stock_check > 0 && (parseFloat(obj.remainig_qty) > 0 || (obj.remainig_qty == undefined && parseFloat(obj.qty) > 0))) {

                $scope.disablePostInvBtn = false;

                $scope.showLoader = false;

                toaster.pop('error', 'Error', 'Stock Allocation is Required for ' + obj.product_name);

                stockCheckConfirm++;

                return false;

            }



            if (!(obj.stock_check > 0)) {

                // console.log(obj);

                if (obj.standard_price == '')

                    toaster.pop('warning', 'Info', obj.product_name + ' Price is empty!');



                if (!(obj.qty > 0)) {

                    $scope.disablePostInvBtn = false;

                    $scope.showLoader = false;

                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(593, [obj.product_name]));

                    stockCheckConfirm++;

                    return false;

                }

            }



            if (obj.units != undefined && obj.item_type == 0) {

                if (!(obj.units.id > 0)) {

                    $scope.disablePostInvBtn = false;

                    $scope.showLoader = false;

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Unit Of Measure']));

                    uomFlag++;

                    return false;

                }

            }

            else if (obj.units == undefined && obj.item_type == 0) {

                $scope.disablePostInvBtn = false;

                $scope.showLoader = false;

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Unit Of Measure']));

                uomFlag++;

                return false;

            }



            if ((obj.standard_price == 0 || obj.standard_price == '') && obj.item_type) {

                $scope.disablePostInvBtn = false;

                $scope.showLoader = false;



                if (obj.item_type > 0)

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(605, [obj.product_name]));

                else

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(606, [obj.product_name]));



                uomFlag++;

                return false;

            }





            // if (obj.item_type == 0 && obj.stock_check == 1 && (obj.remainig_qty == undefined || obj.remainig_qty > 0))

            //     valid = 0;



            if (parseFloat(obj.qty) == 0)

                quantity_count++;



            if ((obj.sale_status == '1' && obj.remainig_qty > 0))

                total_rec++;



            if (obj.item_type == 0)

                item_count++;



            if (obj.item_type == 1)

                gl_count++;

        });



        if (stockCheckConfirm > 0) {

            $scope.disablePostInvBtn = false;

            $scope.showLoader = false;

            // toaster.pop("error", "Error", "Please allocate all the stock before receiving");

            return false;

        }



        if (uomFlag > 0) {

            $scope.disablePostInvBtn = false;

            $scope.showLoader = false;

            return false;

        }



        if ($scope.rec.shipToSupplierLocName != undefined) {

            if ($scope.supplierLocMandatory == 1 && !($scope.rec.shipToSupplierLocName.length > 0)) {



                $scope.disablePostInvBtn = false;

                $scope.showLoader = false;

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(560));

                return false;

            }

        }

        else if ($scope.supplierLocMandatory == 1 && $scope.rec.shipToSupplierLocName == undefined) {



            $scope.disablePostInvBtn = false;

            $scope.showLoader = false;

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(560));

            return false;

        }

        



        // console.log(rec);

        // console.log(rec2);



        var error_count = 0;

        var error_msg = '';

        if ($scope.rec.supplierCreditNoteDate == null) {

            if (error_count > 0)

                error_msg = error_msg + ', Supplier Credit Note Date';

            else

                error_msg = error_msg + 'Supplier Credit Note Date';

            error_count++;

        }



        if ($scope.itemExists == true && !$scope.show_recieve_list) {



            if ($scope.rec.dispatchDate == null) {

                if (error_count > 0)

                    error_msg = error_msg + ', dispatch date';

                else

                    error_msg = error_msg + 'dispatch date';

                error_count++;

            }

        }



        if (item_count > 0 && $scope.rec.supplierReceiptDate == null) {

            if (error_count > 0)

                error_msg = error_msg + ' and receipt date';

            else

                error_msg = error_msg + 'receipt date';

            error_count++;

        }



        if (quantity_count > 0) {

            $scope.disablePostInvBtn = false;

            $scope.showLoader = false;

            if (quantity_count == 1)

                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(543));

            else

                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(600, [String(quantity_count)]));

            return;

        }

        // console.log($scope.$root.get_current_date());





        // if (!$scope.hide_dispatch_btn) {

        if ($scope.itemExists == true && !$scope.show_recieve_list) {



            var mode = 1;

            if (error_count > 0) {

                $rootScope.credit_note_post_invoice_msg = "Are you sure you want to post this Debit Note? Stock will be automatically Dispatched. The " + error_msg + " not specified, will be set to current date";

            }

            else

                $rootScope.credit_note_post_invoice_msg = "Are you sure you want to post this Debit Note? Stock will be automatically Dispatched?";

        }

        else {

            var mode = 0;

            if (error_count > 0)

                $rootScope.credit_note_post_invoice_msg = "Are you sure you want to post this Debit Note? The " + error_msg + " not specified, will be set to current date";

            else

                $rootScope.credit_note_post_invoice_msg = "Are you sure you want to post this Debit Note?";

        }





        ngDialog.openConfirm({

            template: '_confirm_credit_note_invoice_modal',

            className: 'ngdialog-theme-default-custom'

        }).then(function (value) {



            if ($scope.rec.supplierCreditNoteDate == null) {

                $scope.rec.supplierCreditNoteDate = $scope.$root.get_current_date();

            }

            if ($scope.rec.dispatchDate == null) {

                $scope.rec.dispatchDate = $scope.$root.get_current_date();

            }

            if (item_count > 0 && $scope.rec.supplierReceiptDate == null) {

                $scope.rec.supplierReceiptDate = $scope.$root.get_current_date();

            }



            $scope.showLoader = true;

            var rec2 = {};



            // $scope.add_sublist($scope.rec, rec2);

            $scope.add_general($scope.rec, rec2)

                .then(function () {



                    /////////////////////////////////////////////////////////////////////////////////////////

                    /////////////////////////CHECK CURRENCY RATE AVAILABILITY///////////////////////////////



                    var rec3 = {};

                    var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";



                    if (typeof $scope.$root.currency_id === 'object')

                        var currencyID = $scope.$root.currency_id.id;

                    else

                        var currencyID = $scope.$root.currency_id;



                    $scope.items_converted_arr = [];





                    if (currencyID != $scope.$root.defaultCurrency) {



                        $http

                            .post(currencyURL, {

                                'id': currencyID,

                                'token': $scope.$root.token,

                                'or_date': $scope.rec.supplierCreditNoteDate

                            })

                            .then(function (res) {





                                if (currencyID == $scope.$root.defaultCurrency)

                                    var currChk = true;

                                else var currChk = false;



                                if (res.data.ack == true || currChk == true) {



                                    angular.forEach($scope.items, function (item) {

                                        if (currChk == false) {

                                            $scope.item_converted_rate = item.standard_price / res.data.response.conversion_rate;

                                            $scope.items_converted_arr.push({

                                                update_id: item.update_id,

                                                item_converted_price: $scope.item_converted_rate

                                            });

                                        }

                                        else {

                                            $scope.item_converted_rate = item.standard_price;



                                            $scope.items_converted_arr.push({

                                                update_id: item.update_id,

                                                item_converted_price: $scope.item_converted_rate

                                            });

                                        }

                                    });



                                    rec3.table = 'srm_order_return';

                                    rec3.net_amount = $scope.netTotal();

                                    rec3.tax_amount = $scope.calcVat();

                                    rec3.grand_total = $scope.grandTotal();



                                    // rec3.order_id = $stateParams.id;



                                    if ($stateParams.id > 0)

                                        rec3.order_id = $stateParams.id;

                                    else

                                        rec3.order_id = $scope.rec.id;



                                    if (currChk == true) {

                                        rec3.net_amount_converted = parseFloat(rec3.net_amount);

                                        rec3.tax_amount_converted = parseFloat(rec3.tax_amount);

                                        rec3.grand_total_converted = parseFloat(rec3.grand_total);

                                        rec3.currency_rate = 1;

                                    }

                                    else {

                                        rec3.net_amount_converted = parseFloat(rec3.net_amount) / res.data.response.conversion_rate;

                                        rec3.tax_amount_converted = parseFloat(rec3.tax_amount) / res.data.response.conversion_rate;

                                        rec3.grand_total_converted = parseFloat(rec3.grand_total) / res.data.response.conversion_rate;

                                        rec3.currency_rate = res.data.response.conversion_rate;

                                    }



                                    rec2.net_amount = rec3.net_amount;

                                    rec2.tax_amount = rec3.tax_amount;

                                    rec2.grand_total = rec3.grand_total;



                                    rec2.net_amount_converted = rec3.net_amount_converted;

                                    rec2.tax_amount_converted = rec3.tax_amount_converted;

                                    rec2.grand_total_converted = rec3.grand_total_converted;

                                    rec2.currency_rate = rec3.currency_rate;



                                    //console.log(rec3);

                                    var updateUrl = $scope.$root.pr + 'srm/srminvoice/update_converted_items_price'



                                    $http

                                        .post(updateUrl, {

                                            'items_rate': $scope.items_converted_arr,

                                            'tbs': 'srm_order_return_detail',

                                            'currency_data': rec3,

                                            'token': $rootScope.token

                                        })

                                        .then(function (update_res) {



                                            if (update_res.data.ack == true) {



                                                // var finUrl = $scope.$root.sales + "customer/customer/get-customer-finance";//get-finance-by-customer-id";

                                                var finApi = $scope.$root.pr + 'supplier/supplier/get-supplier-finance'

                                                $http

                                                    .post(finApi, {

                                                        'supplier_id': $scope.rec.supplierID,

                                                        'token': $rootScope.token

                                                    })

                                                    .then(function (fres2) {

                                                        if (fres2.data.ack == true) {



                                                            $scope.rec.posting_group_id = fres2.data.response.posting_group_id;

                                                            $scope.rec.ref_posting = fres2.data.response.ref_posting;

                                                            // console.log($scope.rec.posting_group_id);



                                                            if ($scope.rec.posting_group_id === undefined || $scope.rec.posting_group_id === null || parseFloat($scope.rec.posting_group_id) === 0) {

                                                                $scope.showLoader = false;

                                                                toaster.pop('error', 'info', ' Select Posting Group of Supplier ');

                                                            }

                                                            else {

                                                                $scope.saveOrderSublist(rec2, $scope.rec, mode)

                                                                    .then(function () {



                                                                        // $scope.load_invoice();

                                                                        $scope.product_type = true;

                                                                        $scope.count_result = 0;



                                                                        if ($stateParams.id > 0)

                                                                            var invoice_id = $stateParams.id;

                                                                        else

                                                                            var invoice_id = $scope.rec.id;



                                                                        $scope.rec.grandTotal = $scope.grandTotal();



                                                                        var convInvoiceUrl = $scope.$root.pr + "srm/srmorderreturn/convert-to-invoice";

                                                                        $scope.showLoader = true;



                                                                        $http

                                                                            .post(convInvoiceUrl, {

                                                                                'id': invoice_id,

                                                                                'type': 2,

                                                                                'token': $scope.$root.token,

                                                                                'posting_grp': $scope.rec.posting_group_id,

                                                                                'items_net_amt': $scope.rec.items_net_total,

                                                                                'items_net_vat': $scope.rec.items_net_vat,

                                                                                'items_net_disc': $scope.rec.items_net_discount,

                                                                                'grand_total': $scope.rec.grandTotal,

                                                                                'ref_posting': $scope.rec.ref_posting,

                                                                                'converted_currency_id': $rootScope.defaultCurrency

                                                                            })

                                                                            .then(function (res) {





                                                                                $scope.disablePostInvBtn = false;

                                                                                $scope.showLoader = false;



                                                                                if (res.data.ack == true) {

                                                                                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(632));



                                                                                    $scope.rec2 = {};

                                                                                    $scope.rec = {};

                                                                                    $scope.rec.type = 3;

                                                                                    $scope.selectedPurchaseOrders = "";

                                                                                    $scope.check_sr_readonly = false;

                                                                                    $scope.submit_show_invoicee = true;



                                                                                    $scope.$root.crm_id = 0;

                                                                                    $scope.items = [];



                                                                                    $timeout(function () {

                                                                                        if ($state.current.name == "app.addsrmorderreturn")

                                                                                            $state.reload();

                                                                                        else

                                                                                            $state.go("app.addsrmorderreturn");

                                                                                    }, 1500);

                                                                                    return;

                                                                                }

                                                                                else {



                                                                                    $scope.disablePostInvBtn = false;

                                                                                    $scope.showLoader = false;

                                                                                    toaster.pop('error', 'Error', res.data.error);

                                                                                }

                                                                            });



                                                                    }).catch(function (message) {



                                                                        $scope.disablePostInvBtn = false;

                                                                        $scope.showLoader = false;

                                                                        toaster.pop('error', 'info', message);

                                                                        throw new Error(message.data);

                                                                    });

                                                            }

                                                        }

                                                        else {



                                                            $scope.disablePostInvBtn = false;

                                                            $scope.showLoader = false;

                                                            toaster.pop('error', 'info', ' Select Posting Group of Supplier ');

                                                        }

                                                    });

                                            }

                                            else {



                                                $scope.disablePostInvBtn = false;

                                                $scope.showLoader = false;

                                            }

                                        });

                                } else {

                                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Currency Conversion Rate']));



                                    $scope.disablePostInvBtn = false;

                                    $scope.showLoader = false;

                                }

                            });

                    }

                    else {

                        angular.forEach($scope.items, function (item) {



                            $scope.item_converted_rate = item.standard_price;



                            $scope.items_converted_arr.push({

                                update_id: item.update_id,

                                item_converted_price: $scope.item_converted_rate

                            });

                        });



                        rec3.table = 'srm_order_return';

                        rec3.net_amount = $scope.netTotal();

                        rec3.tax_amount = $scope.calcVat();

                        rec3.grand_total = $scope.grandTotal();



                        // rec3.order_id = $stateParams.id;



                        if ($stateParams.id > 0)

                            rec3.order_id = $stateParams.id;

                        else

                            rec3.order_id = $scope.rec.id;



                        rec3.net_amount_converted = parseFloat(rec3.net_amount);

                        rec3.tax_amount_converted = parseFloat(rec3.tax_amount);

                        rec3.grand_total_converted = parseFloat(rec3.grand_total);

                        rec3.currency_rate = 1;



                        rec2.net_amount = rec3.net_amount;

                        rec2.tax_amount = rec3.tax_amount;

                        rec2.grand_total = rec3.grand_total;



                        rec2.net_amount_converted = rec3.net_amount_converted;

                        rec2.tax_amount_converted = rec3.tax_amount_converted;

                        rec2.grand_total_converted = rec3.grand_total_converted;

                        rec2.currency_rate = rec3.currency_rate;



                        //console.log(rec3);

                        var updateUrl = $scope.$root.pr + 'srm/srminvoice/update_converted_items_price'



                        $http

                            .post(updateUrl, {

                                'items_rate': $scope.items_converted_arr,

                                'tbs': 'srm_order_return_detail',

                                'currency_data': rec3,

                                'token': $rootScope.token

                            })

                            .then(function (update_res) {



                                if (update_res.data.ack == true) {



                                    var finApi = $scope.$root.pr + 'supplier/supplier/get-supplier-finance'

                                    $http

                                        .post(finApi, {

                                            'supplier_id': $scope.rec.supplierID,

                                            'token': $rootScope.token

                                        })

                                        .then(function (fres2) {

                                            if (fres2.data.ack == true) {



                                                $scope.rec.posting_group_id = fres2.data.response.posting_group_id;

                                                $scope.rec.ref_posting = fres2.data.response.ref_posting;



                                                if ($scope.rec.posting_group_id === undefined || $scope.rec.posting_group_id === null || parseFloat($scope.rec.posting_group_id) === 0) {

                                                    $scope.showLoader = false;

                                                    toaster.pop('error', 'info', ' Select Posting Group of Supplier ');

                                                }

                                                else {

                                                    $scope.saveOrderSublist(rec2, $scope.rec, mode)

                                                        .then(function () {



                                                            // $scope.load_invoice();

                                                            $scope.product_type = true;

                                                            $scope.count_result = 0;



                                                            if ($stateParams.id > 0)

                                                                var invoice_id = $stateParams.id;

                                                            else

                                                                var invoice_id = $scope.rec.id;



                                                            $scope.rec.grandTotal = $scope.grandTotal();



                                                            var convInvoiceUrl = $scope.$root.pr + "srm/srmorderreturn/convert-to-invoice";

                                                            $scope.showLoader = true;



                                                            $http

                                                                .post(convInvoiceUrl, {

                                                                    'id': invoice_id,

                                                                    'type': 2,

                                                                    'token': $scope.$root.token,

                                                                    'posting_grp': $scope.rec.posting_group_id,

                                                                    'items_net_amt': $scope.rec.items_net_total,

                                                                    'items_net_vat': $scope.rec.items_net_vat,

                                                                    'items_net_disc': $scope.rec.items_net_discount,

                                                                    'grand_total': $scope.rec.grandTotal,

                                                                    'ref_posting': $scope.rec.ref_posting,

                                                                    'converted_currency_id': $rootScope.defaultCurrency

                                                                })

                                                                .then(function (res) {





                                                                    $scope.disablePostInvBtn = false;

                                                                    $scope.showLoader = false;



                                                                    if (res.data.ack == true) {

                                                                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(632));



                                                                        $scope.rec2 = {};

                                                                        $scope.rec = {};

                                                                        $scope.rec.type = 3;

                                                                        $scope.selectedPurchaseOrders = "";

                                                                        $scope.check_sr_readonly = false;

                                                                        $scope.submit_show_invoicee = true;



                                                                        $scope.$root.crm_id = 0;

                                                                        $scope.items = [];



                                                                        $timeout(function () {

                                                                            if ($state.current.name == "app.addsrmorderreturn")

                                                                                $state.reload();

                                                                            else

                                                                                $state.go("app.addsrmorderreturn");

                                                                        }, 1500);

                                                                        return;

                                                                    }

                                                                    else {



                                                                        $scope.disablePostInvBtn = false;

                                                                        $scope.showLoader = false;

                                                                        toaster.pop('error', 'Error', res.data.error);

                                                                    }

                                                                });



                                                        }).catch(function (message) {



                                                            $scope.disablePostInvBtn = false;

                                                            $scope.showLoader = false;

                                                            toaster.pop('error', 'info', message);

                                                            throw new Error(message.data);

                                                        });

                                                }

                                            }

                                            else {



                                                $scope.disablePostInvBtn = false;

                                                $scope.showLoader = false;

                                                toaster.pop('error', 'info', ' Select Posting Group of Supplier ');

                                            }

                                        });

                                }

                                else {



                                    $scope.disablePostInvBtn = false;

                                    $scope.showLoader = false;

                                }

                            });



                    }





                }).catch(function (message) {



                    $scope.disablePostInvBtn = false;

                    $scope.showLoader = false;

                    toaster.pop('error', 'info', message);

                    throw new Error(message);

                });

        },

            function (reason) {

                $scope.showLoader = false;

                $scope.disablePostInvBtn = false;

                console.log('Modal promise rejected. Reason: ', reason);

            });

    } */



    $scope.convert_post_invoice = function (rec, rec2) {
        var valid = 1;
        var quantity_count = 0;
        var valid_dispatch_check = 1;
        var include_item = 0;
        var total_rec = 0;
        var item_count = 0;
        var gl_count = 0;
        $scope.disablePostInvBtn = true;
        $scope.disableReceiveBtn = true;
        $scope.showLoader = true;

        if ($scope.rec.supplierCreditNoteDate == undefined || $scope.rec.supplierCreditNoteDate == null || $scope.rec.supplierCreditNoteDate == '' || $scope.rec.supplierCreditNoteDate == 0) {
            $scope.disablePostInvBtn = false;
            $scope.disableReceiveBtn = false;
            $scope.showLoader = false;
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Supplier Credit Note Date']));
            return false;
        }

        $scope.netTotalAmount = $scope.netTotal();
        $scope.grand_totalAmount = $scope.grandTotal();

        if (parseFloat($scope.netTotalAmount) < 0 || parseFloat($scope.grand_totalAmount) < 0) {
            $scope.disablePostInvBtn = false;
            $scope.disableReceiveBtn = false;
            $scope.showLoader = false;
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(582));
            return false;
        }

        var uomFlag = 0; // Check for unit of measure 
        var stockCheckConfirm = 0;// Check for stock allocation required  
        // in case when a user directly post the invoice without doing stock allocation for items

        $scope.supplierLocMandatory = 0;
        $scope.postponeVATCHK = 0;

        angular.forEach($scope.items, function (obj) {
            if (isNaN(parseFloat(obj.remainig_qty))) {
                obj.remainig_qty = obj.qty;
            }

            if (obj.item_type == 0)
                $scope.supplierLocMandatory = 1;

            if (obj.stock_check > 0 && (parseFloat(obj.remainig_qty) > 0 || (obj.remainig_qty == undefined && parseFloat(obj.qty) > 0))) {
                $scope.disablePostInvBtn = false;
                $scope.disableReceiveBtn = false;
                $scope.showLoader = false;
                toaster.pop('error', 'Error', 'Stock Deallocation is Required for ' + obj.product_name);
                stockCheckConfirm++;
                return false;
            }

            if (obj.isGLVat == true)
                $scope.postponeVATCHK = 1;

            if (!(obj.stock_check > 0)) {

                // console.log(obj);

                if (obj.standard_price == '')
                    toaster.pop('warning', 'Info', obj.product_name + ' Price is empty!');

                if (obj.qty<0) {
                    $scope.disablePostInvBtn = false;
                    $scope.disableReceiveBtn = false;
                    $scope.showLoader = false;
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(658, [obj.product_name]));
                    stockCheckConfirm++;
                    return false;
                }

                if (!(obj.qty > 0) && !(obj.qty<0)) {
                    $scope.disablePostInvBtn = false;
                    $scope.disableReceiveBtn = false;
                    $scope.showLoader = false;
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(593, [obj.product_name]));
                    stockCheckConfirm++;
                    return false;
                }
            }

            if (obj.units != undefined && obj.item_type == 0) {
                if (!(obj.units.id > 0)) {
                    $scope.disablePostInvBtn = false;
                    $scope.disableReceiveBtn = false;
                    $scope.showLoader = false;
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Unit Of Measure']));
                    uomFlag++;
                    return false;
                }
            }
            else if (obj.units == undefined && obj.item_type == 0) {
                $scope.disablePostInvBtn = false;
                $scope.disableReceiveBtn = false;
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Unit Of Measure']));
                uomFlag++;
                return false;
            }

            if (parseFloat(obj.qty) == 0)
                quantity_count++;

            if ((obj.sale_status == '1' && obj.remainig_qty > 0))
                total_rec++;

            if (obj.item_type == 0)
                item_count++;

            if (obj.item_type == 1)
                gl_count++;
        });

        if (stockCheckConfirm > 0) {
            $scope.disablePostInvBtn = false;
            $scope.disableReceiveBtn = false;
            $scope.showLoader = false;
            return false;
        }

        if (uomFlag > 0) {
            $scope.disablePostInvBtn = false;
            $scope.disableReceiveBtn = false;
            $scope.showLoader = false;
            return false;
        }

        if ($scope.supplierLocMandatory == 1 && $scope.rec.shipToSupplierLocName != undefined) {
            if (!($scope.rec.shipToSupplierLocName.length > 0)) {
                $scope.disablePostInvBtn = false;
                $scope.disableReceiveBtn = false;
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(560));
                return false;
            }
        }
        else if ($scope.supplierLocMandatory == 1 && $scope.rec.shipToSupplierLocName == undefined) {
            $scope.disablePostInvBtn = false;
            $scope.disableReceiveBtn = false;
            $scope.showLoader = false;
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(560));
            return false;
        }

        // console.log(rec);
        // console.log(rec2);

        var error_count = 0;
        var error_msg = '';

        // if ($scope.rec.supplierCreditNoteDate == null) {

        if ($scope.rec.supplierCreditNoteDate == undefined || $scope.rec.supplierCreditNoteDate == null || $scope.rec.supplierCreditNoteDate == '' || $scope.rec.supplierCreditNoteDate == 0) {
            if (error_count > 0)
                error_msg = error_msg + ', Supplier Credit Note Date';
            else
                error_msg = error_msg + 'Supplier Credit Note Date';

            error_count++;
        }

        if ($scope.itemExists == true && !$scope.show_recieve_list) {

            if ($scope.rec.dispatchDate == null) {
                if (error_count > 0)
                    error_msg = error_msg + ', dispatch date';
                else
                    error_msg = error_msg + 'dispatch date';
                error_count++;
            }
        }

        if (item_count > 0 && ($scope.rec.supplierReceiptDate == undefined || $scope.rec.supplierReceiptDate == null || $scope.rec.supplierReceiptDate == '' || $scope.rec.supplierReceiptDate == 0)) {
            if (error_count > 0)
                error_msg = error_msg + ' and receipt date';
            else
                error_msg = error_msg + 'receipt date';
            error_count++;
        }

        if (quantity_count > 0) {
            $scope.disablePostInvBtn = false;
            $scope.disableReceiveBtn = false;
            $scope.showLoader = false;

            if (quantity_count == 1)
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(543));
            else
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(600, [String(quantity_count)]));
            return;
        }

        if ($scope.itemExists == true && !$scope.show_recieve_list) {

            var mode = 1;
            if (error_count > 0) {
                $rootScope.credit_note_post_invoice_msg = "Are you sure you want to post this Debit Note? Stock will be automatically Dispatched. The " + error_msg + " not specified, will be set to current date.";
            }
            else
                $rootScope.credit_note_post_invoice_msg = "Are you sure you want to post this Debit Note? Stock will be automatically Dispatched.";
        }
        else {
            var mode = 0;
            if (error_count > 0)
                $rootScope.credit_note_post_invoice_msg = "Are you sure you want to post this Debit Note? The " + error_msg + " not specified, will be set to current date.";
            else
                $rootScope.credit_note_post_invoice_msg = "Are you sure you want to post this Debit Note?";
        }

        if($scope.postponeVATCHK == 1){      

            ngDialog.openConfirm({
                template: 'app/views/srm_order/_confirm_postponed_vat.html',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                $scope.showLoader = true;

                console.log(value);
                // return false;

                if (value == 1) $scope.rec.postponed_vat = 1;
                else $scope.rec.postponed_vat = 0;

                ngDialog.openConfirm({

                    template: '_confirm_credit_note_invoice_modal',

                    className: 'ngdialog-theme-default-custom'

                }).then(function (value) {

                    if ($scope.rec.supplierCreditNoteDate == null) {
                        $scope.rec.supplierCreditNoteDate = $scope.$root.get_current_date();
                    }

                    if ($scope.rec.dispatchDate == null) {
                        $scope.rec.dispatchDate = $scope.$root.get_current_date();
                    }

                    if (item_count > 0 && $scope.rec.supplierReceiptDate == null) {
                        $scope.rec.supplierReceiptDate = $scope.$root.get_current_date();
                    }

                    $scope.showLoader = true;
                    var rec2 = {};
                    // $scope.add_sublist($scope.rec, rec2);
                    $scope.add_general($scope.rec, rec2)

                        .then(function () {
                            var rec3 = {};

                            if (typeof $scope.$root.currency_id === 'object')
                                var currencyID = $scope.$root.currency_id.id;
                            else
                                var currencyID = $scope.$root.currency_id;

                            $scope.saveOrderSublist(rec2, $scope.rec, mode)
                                .then(function () {
                                    $scope.product_type = true;
                                    $scope.count_result = 0;

                                    if ($stateParams.id > 0)
                                        var invoice_id = $stateParams.id;
                                    else
                                        var invoice_id = $scope.rec.id;

                                    $scope.rec.net_amount = $scope.netTotal();
                                    $scope.rec.tax_amount = $scope.calcVat();
                                    $scope.rec.grandTotal = $scope.grandTotal();

                                    var convInvoiceUrl = $scope.$root.pr + "srm/srmorderreturn/convert-to-invoice";
                                    $scope.showLoader = true;

                                    $http
                                        .post(convInvoiceUrl, {
                                            'id': invoice_id,
                                            'type': 2,
                                            'token': $scope.$root.token,
                                            // 'posting_grp': $scope.rec.posting_group_id,
                                            'items_net_amt': $scope.rec.items_net_total,
                                            'items_net_vat': $scope.rec.items_net_vat,
                                            'items_net_disc': $scope.rec.items_net_discount,

                                            'grand_total': $scope.rec.grand_total,
                                            'net_amount': $scope.rec.net_amount,
                                            'tax_amount': $scope.rec.tax_amount,
                                            // 'ref_posting': $scope.rec.ref_posting,
                                            'supplierCreditNoteDate': $scope.rec.supplierCreditNoteDate,
                                            'supplierCreditNoteNo': $scope.rec.supplierCreditNoteNo,
                                            'converted_currency_id': $rootScope.defaultCurrency,
                                            'invoiceCurrencyID': currencyID,
                                            'supplier_id': $scope.rec.supplierID,
                                            'purchaseInvoiceID': $scope.rec.purchaseInvoiceID,
                                            'allItemsArray': $scope.items
                                        })
                                        .then(function (res) {

                                            $scope.disablePostInvBtn = false;
                                            $scope.disableReceiveBtn = false;
                                            $scope.showLoader = false;

                                            if (res.data.ack == true) {
                                                toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(632));

                                                $scope.rec2 = {};
                                                $scope.rec = {};
                                                $scope.rec.type = 3;
                                                $scope.selectedPurchaseOrders = "";
                                                $scope.check_sr_readonly = false;
                                                $scope.submit_show_invoicee = true;

                                                $scope.$root.crm_id = 0;
                                                $scope.items = [];

                                                $timeout(function () {
                                                    if ($state.current.name == "app.addsrmorderreturn")
                                                        $state.reload();
                                                    else
                                                        $state.go("app.addsrmorderreturn");
                                                }, 1500);
                                                return;
                                            }
                                            else {

                                                $scope.disablePostInvBtn = false;
                                                $scope.disableReceiveBtn = false;
                                                $scope.showLoader = false;
                                                toaster.pop('error', 'Error', res.data.error);
                                            }
                                        });

                                }).catch(function (message) {

                                    $scope.disablePostInvBtn = false;
                                    $scope.disableReceiveBtn = false;
                                    $scope.showLoader = false;
                                    toaster.pop('error', 'info', message);
                                    throw new Error(message.data);
                                });

                        }).catch(function (message) {

                            $scope.disablePostInvBtn = false;
                            $scope.disableReceiveBtn = false;
                            $scope.showLoader = false;
                            toaster.pop('error', 'info', message);
                            throw new Error(message);
                        });

                }, function (reason) {

                    $scope.showLoader = false;
                    $scope.disablePostInvBtn = false;
                    $scope.disableReceiveBtn = false;
                    console.log('Modal promise rejected. Reason: ', reason);

                });
            }, function (reason) {

                $scope.showLoader = false;
                $scope.disablePostInvBtn = false;
                $scope.disableReceiveBtn = false;
                console.log('Modal promise rejected. Reason: ', reason); 
            });
        }
        else{

            $scope.rec.postponed_vat = 0;

            ngDialog.openConfirm({

                template: '_confirm_credit_note_invoice_modal',

                className: 'ngdialog-theme-default-custom'

            }).then(function (value) {

                if ($scope.rec.supplierCreditNoteDate == null) {
                    $scope.rec.supplierCreditNoteDate = $scope.$root.get_current_date();
                }

                if ($scope.rec.dispatchDate == null) {
                    $scope.rec.dispatchDate = $scope.$root.get_current_date();
                }

                if (item_count > 0 && $scope.rec.supplierReceiptDate == null) {
                    $scope.rec.supplierReceiptDate = $scope.$root.get_current_date();
                }

                $scope.showLoader = true;
                var rec2 = {};
                // $scope.add_sublist($scope.rec, rec2);
                $scope.add_general($scope.rec, rec2)

                    .then(function () {
                        var rec3 = {};

                        if (typeof $scope.$root.currency_id === 'object')
                            var currencyID = $scope.$root.currency_id.id;
                        else
                            var currencyID = $scope.$root.currency_id;

                        $scope.saveOrderSublist(rec2, $scope.rec, mode)
                            .then(function () {
                                $scope.product_type = true;
                                $scope.count_result = 0;

                                if ($stateParams.id > 0)
                                    var invoice_id = $stateParams.id;
                                else
                                    var invoice_id = $scope.rec.id;

                                $scope.rec.net_amount = $scope.netTotal();
                                $scope.rec.tax_amount = $scope.calcVat();
                                $scope.rec.grandTotal = $scope.grandTotal();

                                var convInvoiceUrl = $scope.$root.pr + "srm/srmorderreturn/convert-to-invoice";
                                $scope.showLoader = true;

                                $http
                                    .post(convInvoiceUrl, {
                                        'id': invoice_id,
                                        'type': 2,
                                        'token': $scope.$root.token,
                                        // 'posting_grp': $scope.rec.posting_group_id,
                                        'items_net_amt': $scope.rec.items_net_total,
                                        'items_net_vat': $scope.rec.items_net_vat,
                                        'items_net_disc': $scope.rec.items_net_discount,

                                        'grand_total': $scope.rec.grand_total,
                                        'net_amount': $scope.rec.net_amount,
                                        'tax_amount': $scope.rec.tax_amount,
                                        // 'ref_posting': $scope.rec.ref_posting,
                                        'supplierCreditNoteDate': $scope.rec.supplierCreditNoteDate,
                                        'supplierCreditNoteNo': $scope.rec.supplierCreditNoteNo,
                                        'converted_currency_id': $rootScope.defaultCurrency,
                                        'invoiceCurrencyID': currencyID,
                                        'supplier_id': $scope.rec.supplierID,
                                        'purchaseInvoiceID': $scope.rec.purchaseInvoiceID,
                                        'allItemsArray': $scope.items
                                    })
                                    .then(function (res) {

                                        $scope.disablePostInvBtn = false;
                                        $scope.disableReceiveBtn = false;
                                        $scope.showLoader = false;

                                        if (res.data.ack == true) {
                                            toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(632));

                                            $scope.rec2 = {};
                                            $scope.rec = {};
                                            $scope.rec.type = 3;
                                            $scope.selectedPurchaseOrders = "";
                                            $scope.check_sr_readonly = false;
                                            $scope.submit_show_invoicee = true;

                                            $scope.$root.crm_id = 0;
                                            $scope.items = [];

                                            $timeout(function () {
                                                if ($state.current.name == "app.addsrmorderreturn")
                                                    $state.reload();
                                                else
                                                    $state.go("app.addsrmorderreturn");
                                            }, 1500);
                                            return;
                                        }
                                        else {

                                            $scope.disablePostInvBtn = false;
                                            $scope.disableReceiveBtn = false;
                                            $scope.showLoader = false;
                                            toaster.pop('error', 'Error', res.data.error);
                                        }
                                    });

                            }).catch(function (message) {

                                $scope.disablePostInvBtn = false;
                                $scope.disableReceiveBtn = false;
                                $scope.showLoader = false;
                                toaster.pop('error', 'info', message);
                                throw new Error(message.data);
                            });

                    }).catch(function (message) {

                        $scope.disablePostInvBtn = false;
                        $scope.disableReceiveBtn = false;
                        $scope.showLoader = false;
                        toaster.pop('error', 'info', message);
                        throw new Error(message);
                    });

            }, function (reason) {

                $scope.showLoader = false;
                $scope.disablePostInvBtn = false;
                $scope.disableReceiveBtn = false;
                console.log('Modal promise rejected. Reason: ', reason);

            });
        }
    }

    /*-------------------------------------Pay Invoice--------------------------------*/
    var price = 0;
    var price_a = 0;
    var currency_id = 0;
    var converted_price = 0;
    $scope.cnv_rate = 0;

    $scope.validatePrice = function (order_date, total) {
        var price_a = 0;
        var cnv_rate = 1;
        $scope.cnv_rate = 1;
        price_a = total;
        // currency_id = $scope.$root.currency_id;

        if (typeof $scope.$root.currency_id === 'object')
            var currency_id = $scope.$root.currency_id.id;
        else
            var currency_id = $scope.$root.currency_id;

        if (currency_id == $scope.$root.defaultCurrency) {
            $scope.converted_price = parseFloat(price_a);
            //if (item.chk_credit) item.credit_amount = Number(price_a);
            // if (item.chk_debit)   item.debit_amount = Number(price_a);
            return;
        }
        //console.log(currency_id + order_date);
        var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";

        $http

            .post(currencyURL, { 'id': currency_id, token: $scope.$root.token, or_date: order_date })

            .then(function (res) {

                if (res.data.ack == true) {



                    if (res.data.response.conversion_rate == null) {

                        item.converted_price = null;

                        item.cnv_rate = null;

                        $scope.cnv_rate = null;

                        price.converted_price = null;

                        $scope.showLoader = false;

                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Currency Conversion Rate']));

                        $('.cur_block').attr("disabled", true);

                        return;

                    }

                    else {



                        var newPrice1 = parseFloat(price_a);

                        var newPrice = 0;



                        if (currency_id != $scope.$root.defaultCurrency)

                            newPrice = parseFloat(newPrice1) / parseFloat(res.data.response.conversion_rate);

                        else

                            newPrice = parseFloat(newPrice1);



                        if (newPrice > 0)

                            converted_price = parseFloat(newPrice);//.toFixed(2)

                        else

                            newPrice = 0;



                        $scope.converted_price = converted_price;

                        $scope.cnv_rate = res.data.response.conversion_rate;

                        cnv_rate = res.data.response.conversion_rate;



                        // if (item.chk_credit)  item.credit_amount = item.converted_price;

                        /// if (item.chk_debit)  item.debit_amount = item.converted_price;

                        return;

                    }

                }

                else {

                    $scope.converted_price = null;

                    cnv_rate = null;

                    $scope.cnv_rate = null;

                    // if (item.chk_credit)  item.credit_amount = null;

                    // if (item.chk_debit)     item.debit_amount = null;

                    toaster.pop('error', 'Info', 'Please set the conversion rate in setup.');

                    $('.cur_block').attr("disabled", true);

                    return;

                }

            }).catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

            });

    }



    $scope.isSalePerersonChanged = false;

    $scope.ReciptInvoiceModalarr = [];

    $scope.ReciptInvoiceModalSelectarr = [];



    $scope.searchKeyword = {};

    $scope.curent_cust_index = '';

    $scope.amount_total = 0;

    $scope.module_type = 0;

    $scope.doc_type = 0;

    $scope.final_amount = 0;



    $scope.get_invoice_list = function (total) {



        console.log(total); //return;

        var obj_rec = {};

        /*--------------payment of invoice---------------*/

        if ($scope.rec.type == 2) {



            $scope.get_finance_entry_account();

            var finUrl = $scope.$root.pr + 'supplier/supplier/get-supplier-finance'

            $http

                .post(finUrl, { 'supplier_id': $scope.rec.supplierID, token: $scope.$root.token })

                .then(function (resp) {

                    if (resp.data.ack == true) {



                        // console.log(resp.data.response); return;

                        if (resp.data.response.posting_group_id === undefined || resp.data.response.posting_group_id === null || resp.data.response.posting_group_id == 0) {



                            obj_rec.account_code = '';

                            obj_rec.account_id = '';

                            obj_rec.posting_group_id = '';



                            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(505));

                            return;

                        }

                        else {

                            obj_rec.account_code = $scope.rec.sell_to_cust_name + " - " + $scope.rec.sell_to_cust_no;

                            obj_rec.account_id = resp.data.response.supplier_id;

                            obj_rec.posting_group_id = resp.data.response.posting_group_id;

                            $scope.$root.supplier_id = obj_rec.account_id;

                            //console.log(res.data.response.currency_id);

                            //console.log(res.data.response.posting_group_id);





                            if (resp.data.response.currency_id > 0) {

                                $scope.supplier_currency = true;

                            }



                            $.each($rootScope.arr_currency, function (index, elem3) {

                                if (elem3.id == resp.data.response.currency_id)

                                    obj_rec.currency_id = elem3;

                            });

                        }

                        $scope.columns = [];

                        $scope.ReciptInvoiceModalarr = [];

                        //$scope.title = 'Salesperson';



                        //$scope.curent_cust_index = index;

                        $scope.module_type = { 'value': 3, 'name': 'Supplier' };



                        $scope.module_type_main = $scope.module_type.value;

                        $scope.doc_type = { 'id': 5, 'name': 'Debit Note' };

                        $scope.journal_datemain = $scope.$root.posting_date;

                        $scope.posting_groupmain = obj_rec.posting_group_id;



                        $scope.curency_code = obj_rec.currency_id.code;

                        $scope.select_curency_id = obj_rec.currency_id.id;



                        if ($scope.module_type === undefined) {

                            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Account Type']));

                            return;

                        }

                        else {

                            $scope.postData = {};

                            if (obj_rec.account_id == undefined) {

                                toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(231, ['Customer', 'Supplier']));

                                return;

                            }



                            $scope.supp_id = obj_rec.account_id;

                            //$scope.doc_type = $scope.doc_type.id;



                            if ($scope.module_type.value == 2) {

                                $scope.postData.type = 2;

                                $scope.postData.title = 'Supplier ' + $scope.doc_type.name + ' (' + obj_rec.account_code + ')';

                            }



                            $scope.final_amount = total;

                            // $scope.amount_total = parseFloat(item.converted_price);

                            $scope.amount_total = $scope.final_amount;

                            $scope.payment_currency = $scope.select_curency_id;

                            $scope.current_currency_id = $scope.$root.currency_id;

                            $scope.journal_date = $scope.$root.posting_date;



                            $scope.postData.supplierID = $scope.rec.supplierID;

                            $scope.postData.token = $scope.$root.token;

                            $scope.postData.more_fields = 1;



                            if ($scope.module_type.value == 3 && $scope.doc_type.id == 5)

                                var postUrl = $scope.$root.pr + "srm/srminvoice/listings";



                            $scope.postData.parent_id = $stateParams.id;

                            $scope.postData.doc_type = $scope.doc_type.id;

                            $scope.postData.supp_id = $scope.rec.supplierID;



                            $http

                                .post(postUrl, $scope.postData)

                                .then(function (res) {

                                    if (res.data.ack == true) {

                                        $scope.total = res.data.total;

                                        $scope.item_paging.total_pages = res.data.total_pages;

                                        $scope.item_paging.cpage = res.data.cpage;

                                        $scope.item_paging.ppage = res.data.ppage;

                                        $scope.item_paging.npage = res.data.npage;

                                        $scope.item_paging.pages = res.data.pages;



                                        $scope.total_paging_record = res.data.total_paging_record;



                                        $scope.ReciptInvoiceModalarr = res.data.response;





                                        angular.element('#CreditNoteInvoiceModal').modal({ show: true });

                                    }

                                    else

                                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

                                });

                        }

                    }

                    else

                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(505));

                }).catch(function (message) {

                    $scope.showLoader = false;



                    throw new Error(message.data);

                });

        }

    }



    $scope.get_payed_list = function (item) {



        $scope.Recipt_payed = [];

        $scope.title_payed = 'Invoice Payment';

        $scope.item_detail = item;

        $scope.postData = {};

        $scope.postData.invoice = item.id;//item.account_id;

        $scope.postData.token = $scope.$root.token;

        $scope.postData.more_fields = 1;

        var personUrledit = $scope.$root.gl + "chart-accounts/get-invoice-receipt-payment";



        $http

            .post(personUrledit, $scope.postData)

            .then(function (res) {

                if (res.data.ack == true) {

                    $scope.Recipt_payed = res.data.response;

                    //         angular.element('#RecptAccountpop').modal({show: true});

                    angular.element('#RecptAccountpop_payed_list').modal({ show: true });

                }



                else

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

            }).catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

            });

    }



    $scope.change_amount_invoice = function (item) {

        if (item.amount > 0)

            item.chk = true;

    }



    $scope.postfianancedata = {};

    $scope.get_finance_entry_account = function () {



        var getaccountcompany = $scope.$root.setup + "general/get-financial-setting";

        $http

            .post(getaccountcompany, { 'token': $scope.$root.token, 'id': $scope.$root.defaultCompany })

            .then(function (res) {

                if (res.data.ack == true)

                    $scope.postfianancedata = res.data.response;

                else

                    toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(539));

            }).catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

            });

    }



    $scope.setremainingamount = function (item) {



        $scope.validatePrice(item.invoice_date, $scope.amount_total);

        //console.log(item);

        var amount2 = 0;



        if (angular.element('#checkremaingamount_' + item.id).is(':checked') == true) {

            if ((item.orignal_grand_total - item.outstanding) == 0)

                item.amount = item.orignal_grand_total;

            else if (item.orignal_grand_total - item.outstanding > 0)

                item.amount = (item.orignal_grand_total - item.outstanding);

        }

        else if (item.amount != undefined) {

            if ((item.orignal_grand_total - item.outstanding) == 0)

                amount2 = item.grand_total;

            else if (item.orignal_grand_total - item.outstanding > 0)

                amount2 = (item.orignal_grand_total - item.outstanding);



            if (parseFloat(item.amount) > parseFloat(amount2))

                item.amount = parseFloat(amount2);

        }



        if ($scope.amount_total < item.amount)

            item.amount = $scope.amount_total;



        //save conversion price in RECEIPt Journal for  Profit & Loss Accounts

        item.converted_price = (parseFloat(item.amount) / parseFloat(item.currency_rate)) - (parseFloat(item.amount) / parseFloat($scope.cnv_rate));

        /* //item.converted_price = (parseFloat(item.amount) / parseFloat(item.currency_rate));*/

        // console.log(item.currency_rate);

        // console.log($scope.cnv_rate);

        // console.log(item.converted_price);



    }



    $scope.addrecptget_invoice = function (id) {



        var post = {};

        var temp = [];

        var amount = 0;

        var new_amount = 0;

        var totalrelizecount = 0

        var account_id = 0;



        $.each($scope.ReciptInvoiceModalarr, function (index, obj) {

            if (obj.amount > 0) {

                console.log($scope.ReciptInvoiceModalarr); //return;

                //if($scope.doc_type==1)

                new_amount = parseFloat(obj.amount);



                temp.push({

                    id: obj.id, amount: obj.amount, total_allocatin: new_amount, posting_group: obj.posting_group,

                    allocate_id: obj.allocate_id, converted_price: obj.converted_price

                });



                //  if ($scope.doc_type == 1)

                if (obj.amount)

                    amount += parseFloat(obj.amount);



                //save conversion price in RECEIPt Journal for  Profit & Loss Accounts

                // Foreign Currency Movement Gain & Loss

                //Indiviaual Entry  and Total sum entry on backend



                if ($scope.doc_type.id == 5 && $scope.select_curency_id !== $rootScope.defaultCurrency && (obj.converted_price != 0)) {



                    if (($scope.module_type.value == 3) && ($scope.posting_groupmain == 1))

                        account_id = $scope.postfianancedata.Purchase_gl_ac_uk_creditors;



                    if (($scope.module_type.value == 3) && ($scope.posting_groupmain == 2))

                        account_id = $scope.postfianancedata.Purchase_gl_ac_eu_creditors;



                    if (($scope.module_type.value == 3) && ($scope.posting_groupmain == 3))

                        account_id = $scope.postfianancedata.Purchase_gl_ac_eu_out_creditors;



                    if (parseFloat(obj.converted_price) > 0) {



                        if ($scope.module_type.value == 3) {

                            var inv_trans_type = 1;

                            var inv_trans_type_secnd = 2;

                        }

                        var account_debit = account_id;

                        var payed_account = $scope.postfianancedata.realised_movement_gl_ac;

                        //unrealised_movement_gl_ac;

                        console.log("Gain s");

                    }

                    else {



                        if ($scope.module_type.value == 3) {

                            var inv_trans_type = 2;

                            var inv_trans_type_secnd = 1;

                        }

                        var account_debit = account_id;

                        var payed_account = $scope.postfianancedata.realised_movement_gl_ac;

                        console.log("Loss s");

                    }



                    if ((payed_account != undefined) && (account_debit != undefined) && (obj.converted_price != 0)) {

                        $scope.$root.accountentry(payed_account, inv_trans_type, 5, obj.converted_price, $scope.journal_datemain, $scope.parent_id, 0, 'Gain', 0);



                        $scope.$root.accountentry(account_debit, inv_trans_type_secnd, 5, obj.converted_price, $scope.journal_datemain, $scope.parent_id, 0, 'loss', $scope.parent_id);

                    }

                    else

                        totalrelizecount++;

                }

            }

        });



        if (totalrelizecount) {

            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(365));

            return;

        }



        if (amount > parseFloat($scope.amount_total)) {

            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(366));

            return;

        }

        else {



            var excUrl = $scope.$root.gl + "chart-accounts/add-invoice-receipt";

            post.type_allocatin = 1;

            post.total_allocatin = $scope.netTotalAmount();



            post.id = $scope.curent_cust_index;//id;

            post.type = 1;

            post.doc_type = $scope.doc_type.id;

            post.cust_id = $scope.rec.supplierID;

            post.invoice_id = $stateParams.id;

            post.parent_id = $stateParams.id;

            post.selected = temp;

            post.token = $scope.$root.token;



            $http

                .post(excUrl, post)

                .then(function (res) {

                    if (res.data.ack == true) {

                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));

                        angular.element('#ReciptInvoiceModal').modal('hide');

                    }

                    else

                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(105));

                }).catch(function (message) {

                    $scope.showLoader = false;



                    throw new Error(message.data);

                });

        }

    }



    $scope.netTotalAmount = function () {

        var ctotal = 0;

        var netTotal = 0;

        angular.forEach($scope.ReciptInvoiceModalarr, function (item) {

            if (item.amount >= 0)

                ctotal += parseFloat(item.amount);

        });



        // return parseFloat(Math.round($scope.amount_total - ctotal).toFixed($scope.$root.decimal_range));

        return netTotal = parseFloat($scope.amount_total) - parseFloat(ctotal);

    }

    /*------------------------------------*Pay Invoice*--------------------------------*/



    if ($stateParams.id > 0)

        $scope.check_sr_readonly = true;

    else

        $scope.check_sr_readonly = false;



    $scope.submit_show_invoicee = true;



    $scope.showEditForm = function () {

        $scope.check_sr_readonly = false;

    }



    $scope.arrItems = [{ 'label': ' ', 'value': 3 }, { 'label': 'Item(s)', 'value': 0 }, { 'label': 'G/L Account', 'value': 1 }];



    $scope.arr_discount_type = [{ 'name': '', 'id': "None" }, { 'name': 'Value', 'id': "Value" }, { 'name': 'Percentage', 'id': "Percentage" }, { 'name': 'Unit', 'id': "Unit" }];



    $scope.item_types = $scope.arrItems[0];

    $scope.default_currency_code = $rootScope.defaultCurrencyCode;

    $scope.company_name = $rootScope.company_name;

    $scope.currency_code = '';

    $scope.products = [];

    $scope.items = [];

    $scope.arr_categories = {};

    $scope.recs = {};



    $scope.$on("order_returndata", function (event, invoice_rec, shiping_rec, invoice_date, order_date, base_ship, type, code, payable_number, purchase_number) {

        $scope.bl_no = base_ship;

        $scope.type = type;

        $scope.code = code;

        $scope.payable_number = payable_number;

        $scope.purchase_number = purchase_number;

        $scope.order_date = order_date;

        $scope.invoice_date = invoice_date;

        $scope.invoice_rec = invoice_rec;

        $scope.shiping_rec = shiping_rec;



        $scope.submit_show_invoice = false;



        if ($scope.type == 1)

            $scope.submit_show_invoice = true;

    });



    $scope.title = 'Purchase Order Return';

    $scope.btnCancelUrl = 'app.srm_order_return';



    $scope.search_data = '';

    var drpCat = null;



    $scope.getProducts = function (recs, parm) {

        var cat_id = '';



        if (parm != '') {

            $scope.postData = { 'all': "1", token: $scope.$root.token };

            recs.category = '';

            recs.search_data = '';

        }

        else {

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

        var order_date = angular.element('#offer_date').val();

        $scope.postData.order_date = order_date;



        var prodApi = $scope.$root.stock + "products-listing/get-products-setup-list";

        $http

            .post(prodApi, $scope.postData)

            .then(function (res) {

                $scope.products = [];

                if (res.data.ack == true) {

                    $.each(res.data.response, function (index, obj) {

                        obj.chk = false;

                        $scope.products[index] = obj;

                    });

                }

                else

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

            }).catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

            });

    }



    $scope.getServicepop = function (recs, parm) {

        var cat_id = '';

        if (parm != '') {

            $scope.postData = { 'all': "1", 'token': $scope.$root.token };

            recs.category = '';

            recs.search_data = '';

        }

        else {

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

            .then(function (res) {

                if (res.data.ack == true) {

                    $scope.products = [];

                    angular.forEach(res.data.response, function (obj, index) {

                        obj.chk = false;

                        $scope.products[index] = obj;

                    });

                }

                else

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

            }).catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

            });

    }



    angular.element(document).on('click', '#checkAll_price', function () {

        if (angular.element('#checkAll_price').is(':checked') == true) {

            for (var i = 0; i < $scope.products.length; i++) {

                $scope.products[i].chk = true;

            }

        }

        else {

            for (var i = 0; i < $scope.products.length; i++) {

                $scope.products[i].chk = false;

            }

        }

        $scope.$root.$apply(function () {

            $scope.products;

        })

    });



    $scope.checkAll = function () {

        var bool = angular.element("#selecctall").is(':checked');

        var i = 0;

        angular.forEach($scope.products, function (item) {

            $scope.products[i].chk = bool;

            i++;

        });

    }



    $scope.category_list_final = {};

    $scope.category_sub = {};

    $scope.category_list_data_one = {};

    $scope.category_list_data_second = {};

    $scope.category_list_data_third = {};



    $scope.getPurchaseInvoices = function (arg) {

        if ($scope.rec.supplierID == undefined) {

            toaster.pop('error', 'Error', 'Please select a Supplier first');

            return;

        }

        else if ($scope.items.length > 0) { // && $scope.shipagent != 1

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(557));

            return false;

        }

        else {

            $scope.columns = [];

            $scope.record = {};

            $scope.title = 'Purchase Invoices';

            // $scope.supplierNo = $scope.rec.supplierNo;

            // $scope.supplierName = $scope.rec.supplierName;



            var getInvrUrl = $scope.$root.pr + "srm/srmorderreturn/get-purchase-invoices-for-debit-note";

            $scope.filterInvoices = {};



            var postData = {

                'token': $scope.$root.token,

                'supplierID': $scope.rec.supplierID

            };

            $http

                .post(getInvrUrl, postData)

                .then(function (res) {

                    if (res.data.ack == true) {

                        $scope.columns = [];

                        $scope.record = res.data.response;

                        /* angular.forEach(res.data.response[0], function (val, index) {

                            $scope.columns.push({

                                'title': toTitleCase(index),

                                'field': index,

                                'visible': true

                            });

                        }); */

                        angular.element('#_invoicesModal').modal({ show: true });



                    }

                    else {

                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));

                        return;

                    }

                });

        }

    }





    $scope.confirmPurchaseInvoice = function (result) {

        $scope.rec.purchaseInvoice = result.invoice_code;

        $scope.rec.purchaseInvoiceID = result.id;

        $scope.rec.purchaseInvoiceType = result.docType;

        // $scope.rec.purchaseInvoiceID = result.id;

        console.log(result);

        angular.element('#_invoicesModal').modal('hide');

    }



    $scope.selectItem = function (drp, item_paging, rec) {



        $scope.showLoader = true;



        if (!(Number($scope.rec.purchaseInvoiceID) > 0) && drp==0) {

            toaster.pop('error', 'Error', 'Please select an invoice first');

            $scope.showLoader = false;

            return false;

        }



        if (!($scope.rec.update_id > 0)) {



            $scope.add_general(rec, $scope.rec2)

                .then(function (retRes) {

                    // console.log(retRes);



                    if (retRes == false) {

                        return false;

                    }

                    if (drp == 4)

                        $scope.item_type = 0;

                    else if (drp == 6)

                        $scope.item_type = 1;

                    else

                        $scope.item_type = drp;



                    $scope.showLoader = true;



                    $scope.GetSalesOrderStages();



                    if ($scope.item_type == 0) {



                        $scope.filterPurchaseItem = {};

                        var getDebitNoteItems = $scope.$root.pr + "srm/srmorderreturn/get-debit-note-items";



                        $scope.postData = {};

                        $scope.postData.token = $scope.$root.token;

                        $scope.postData.supplierID = $scope.rec.supplierID;

                        $scope.postData.purchaseInvoiceID = $scope.rec.purchaseInvoiceID;

                        $scope.postData.purchaseInvoiceType = $scope.rec.purchaseInvoiceType;



                        $http

                            .post(getDebitNoteItems, $scope.postData)

                            .then(function (res) {

                                $scope.tempProdArr = [];

                                $scope.showLoader = false;



                                if (res.data.ack == true) {

                                    $scope.tempProdArr = res.data.response;

                                    console.log($scope.tempProdArr);



                                    for (var i = 0; i < $scope.tempProdArr.length; i++) {

                                        $scope.tempProdArr[i].chk = false;

                                    }



                                    $scope.title = 'Select Item';

                                    $scope.selectedAllPurchaseItem = false;

                                    angular.element('#selectedAllPurchaseItem').attr('checked', false);

                                    // console.log($scope.selectedAllPurchaseItem);



                                    // $scope.getPriceOffers(1);

                                    // angular.element('#productModal').modal({ show: true });

                                    angular.element('#_purchase_item_modal').modal({ show: true });

                                }

                                else

                                    toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(583));



                            }).catch(function (message) {

                                $scope.showLoader = false;



                                throw new Error(message.data);

                            });



                    }

                    else if ($scope.item_type == 1) {



                        $scope.title = 'G/L No.';

                        $scope.filterGL = {};

                        var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";



                        $scope.postData = {};

                        $scope.postData.token = $scope.$root.token;

                        $scope.postData.supplierID = $scope.rec.supplierID;



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

                            .post(postUrl_cat, $scope.postData)//{'token': $scope.$root.token, 'display_id': 10},

                            .then(function (res) {



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

                                    angular.element('#accthead_modal').modal({ show: true });

                                    $scope.gl_account = res.data.response;

                                }





                            }).catch(function (message) {

                                $scope.showLoader = false;



                                throw new Error(message.data);

                            });



                        // angular.element('#accthead_modal').modal({ show: true });

                    }

                    else if ($scope.item_type == 2) {

                        $scope.record = {};

                        $scope.title = 'Services';

                        var prodApi = $scope.$root.setup + "service/products-listing/get-products-popup";

                        var postData = {

                            'token': $scope.$root.token,

                            'all': "1",

                        };

                        $http

                            .post(prodApi, postData)

                            .then(function (res) {

                                $scope.showLoader = false;

                                if (res.data.ack == true) {

                                    $scope.products = [];

                                    angular.forEach(res.data.response, function (obj, index) {

                                        obj.chk = false;

                                        $scope.products[index] = obj;

                                    });

                                }

                            }).catch(function (message) {

                                $scope.showLoader = false;



                                throw new Error(message.data);

                            });



                        var getListUrl = $scope.$root.setup + "service/categories/get-all-categories";

                        $http

                            .post(getListUrl, { 'token': $scope.$root.token })

                            .then(function (res) {

                                $scope.showLoader = false;

                                if (res.data.ack == true) {

                                    $scope.arr_categories = {};

                                    $scope.arr_categories = res.data.response;

                                }

                            }).catch(function (message) {

                                $scope.showLoader = false;



                                throw new Error(message.data);

                            });

                        angular.element('#serviceModal').modal({ show: true });

                    }

                    $scope.rec.item_types = $scope.arrItems[0];

                }).catch(function (message) {

                    $scope.showLoader = false;

                    toaster.pop('error', 'info', message);

                    throw new Error(message);

                });

        }

        else {

            if (drp == 4)

                $scope.item_type = 0;

            else if (drp == 6)

                $scope.item_type = 1;

            else

                $scope.item_type = drp;



            $scope.showLoader = true;



            if ($scope.item_type == 0) {



                $scope.filterPurchaseItem = {};

                var getDebitNoteItems = $scope.$root.pr + "srm/srmorderreturn/get-debit-note-items";



                $scope.postData = {};

                $scope.postData.token = $scope.$root.token;

                $scope.postData.supplierID = $scope.rec.supplierID;

                $scope.postData.purchaseInvoiceID = $scope.rec.purchaseInvoiceID;

                $scope.postData.purchaseInvoiceType = $scope.rec.purchaseInvoiceType;



                $http

                    .post(getDebitNoteItems, $scope.postData)

                    .then(function (res) {

                        $scope.tempProdArr = [];

                        $scope.showLoader = false;



                        if (res.data.ack == true) {

                            $scope.tempProdArr = res.data.response;

                            console.log($scope.tempProdArr);



                            for (var i = 0; i < $scope.tempProdArr.length; i++) {

                                $scope.tempProdArr[i].chk = false;

                            }



                            $scope.title = 'Select Item';

                            $scope.selectedAllPurchaseItem = false;

                            angular.element('#selectedAllPurchaseItem').attr('checked', false);

                            // console.log($scope.selectedAllPurchaseItem);



                            // $scope.getPriceOffers(1);

                            // angular.element('#productModal').modal({ show: true });

                            angular.element('#_purchase_item_modal').modal({ show: true });

                        }

                        else

                            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(583));



                    }).catch(function (message) {

                        $scope.showLoader = false;



                        throw new Error(message.data);

                    });



            }

            else if ($scope.item_type == 1) {



                $scope.title = 'G/L No.';

                $scope.filterGL = {};

                var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";



                $scope.postData = {};

                $scope.postData.token = $scope.$root.token;

                $scope.postData.supplierID = $scope.rec.supplierID;



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

                    .post(postUrl_cat, $scope.postData)//{'token': $scope.$root.token, 'display_id': 10},

                    .then(function (res) {



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

                            angular.element('#accthead_modal').modal({ show: true });

                            $scope.gl_account = res.data.response;

                        }



                    }).catch(function (message) {

                        $scope.showLoader = false;



                        throw new Error(message.data);

                    });





            }

            else if ($scope.item_type == 2) {

                $scope.record = {};

                $scope.title = 'Services';

                var prodApi = $scope.$root.setup + "service/products-listing/get-products-popup";

                var postData = {

                    'token': $scope.$root.token,

                    'all': "1",

                };

                $http

                    .post(prodApi, postData)

                    .then(function (res) {

                        $scope.showLoader = false;

                        if (res.data.ack == true) {

                            $scope.products = [];

                            angular.forEach(res.data.response, function (obj, index) {

                                obj.chk = false;

                                $scope.products[index] = obj;

                            });

                        }

                    }).catch(function (message) {

                        $scope.showLoader = false;



                        throw new Error(message.data);

                    });



                var getListUrl = $scope.$root.setup + "service/categories/get-all-categories";

                $http

                    .post(getListUrl, { 'token': $scope.$root.token })

                    .then(function (res) {

                        if (res.data.ack == true) {

                            $scope.arr_categories = {};

                            $scope.arr_categories = res.data.response;

                        }

                    }).catch(function (message) {

                        $scope.showLoader = false;



                        throw new Error(message.data);

                    });

                angular.element('#serviceModal').modal({ show: true });

            }

            $scope.rec.item_types = $scope.arrItems[0];

        }

    }



    $scope.PendingSelectedDebitNoteItems = [];



    $scope.checkedPurchaseItem = function (priceitem) {



        $scope.selectedAllPurchaseItem = false;

        angular.element('#selectedAllPurchaseItem').attr('checked', false);



        for (var i = 0; i < $scope.tempProdArr.length; i++) {



            if (priceitem == $scope.tempProdArr[i].id) {

                if ($scope.tempProdArr[i].chk == true)

                    $scope.tempProdArr[i].chk = false;

                else

                    $scope.tempProdArr[i].chk = true;

            }

            // console.log($scope.tempProdArr[i]);

        }

    }



    $scope.checkAllPurchaseItem = function (val, category, brand, unit) {

        var selection_filter = $filter('filter');

        var filtered = selection_filter($scope.tempProdArr, $scope.filterPurchaseItem.search);

        var filtered2 = selection_filter(filtered, category);

        var filtered3 = selection_filter(filtered2, brand);

        var filtered4 = selection_filter(filtered3, unit);

        // console.log(val);



        $scope.PendingSelectedDebitNoteItems = [];



        if (val == true) {

            angular.forEach(filtered4, function (obj) {



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

                $scope.PendingSelectedDebitNoteItems.push(obj);

            });

        } else {

            angular.forEach($scope.tempProdArr, function (obj) {

                if (!obj.disableCheck)

                    obj.chk = false;

            });

            $scope.PendingSelectedDebitNoteItems = [];

        }

    }



    $scope.clearPendingPurchaseItems = function () {

        $scope.PendingSelectedDebitNoteItems = [];

        $scope.selectedAllPurchaseItem = false;

        angular.element('#selectedAllPurchaseItem').attr('checked', false);

        // angular.element('#productModal').modal('hide');

        angular.element('#_purchase_item_modal').modal('hide');

    }



    $scope.PendingSelectedGLItems = [];



    $scope.checkedGL = function (glid) {



        for (var i = 0; i < $scope.gl_account.length; i++) {



            if (glid == $scope.gl_account[i].id) {

                if ($scope.gl_account[i].chk == true)

                    $scope.gl_account[i].chk = false;

                else

                    $scope.gl_account[i].chk = true;

            }

        }

    }



    $scope.checkAllGL = function (val, category, brand, unit) {

        $scope.PendingSelectedGLItems = [];



        if (val == true) {

            angular.forEach($scope.gl_account, function (obj) {

                if (obj.status > 0)

                    obj.chk = true;

                $scope.PendingSelectedGLItems.push(obj);

            });

        } else {

            angular.forEach($scope.gl_account, function (obj) {

                if (!obj.disableCheck)

                    obj.chk = false;

            });

            $scope.PendingSelectedGLItems = [];

        }

    }



    $scope.clearPendingGLitems = function () {

        $scope.PendingSelectedGLItems = [];

        angular.element('#accthead_modal').modal('hide');

    }



    $scope.getPriceOffers = function (type) // 1-> popup, 2-> order_items

    {

        var getpriceOffersUrl = $scope.$root.sales + "crm/crm/get-items-price-offers-by-custid";

        $scope.price_offer_arr = [];

        $http

            .post(getpriceOffersUrl, { 'token': $scope.$root.token, 'srm_id': $scope.rec.supplierID })

            .then(function (res) {

                if (res.data.ack == true) {

                    $scope.price_offer_arr = res.data.response;



                    if (type == 1) {

                        angular.forEach($scope.price_offer_arr, function (obj) {

                            var item = $filter("filter")($scope.tempProdArr, { id: obj.item_id });

                            var idx = $scope.tempProdArr.indexOf(item[0]);

                            if (idx != -1) {

                                $scope.tempProdArr[idx].price_offer = obj.price_offer;

                                $scope.tempProdArr[idx].price_offer_id = obj.id;

                                $scope.tempProdArr[idx].arr_volume_discounts = obj.arr_volume_discounts;

                            }

                        });

                    }

                    else {

                        angular.forEach($scope.price_offer_arr, function (obj) {

                            var item = $filter("filter")($scope.items, { id: obj.item_id });

                            if (item.length > 0) {

                                angular.forEach(item, function (obj1) {

                                    var idx = $scope.items.indexOf(obj1);

                                    if (idx != -1) {

                                        $scope.items[idx].price_offer = obj.price_offer;

                                        $scope.items[idx].price_offer_id = obj.id;

                                        $scope.items[idx].arr_volume_discounts = obj.arr_volume_discounts;

                                    }

                                });

                            }

                        });

                    }

                }

            });

    }



    // ############ ADD GL code for purchase-cost-detail ##############





    $scope.addProduct = function () {



        $scope.tempOrderLineitems = [];

        var tempOrderData = {};



        tempOrderData.orderID = $scope.rec.id;

        tempOrderData.supplier_id = $scope.rec.supplierID;

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

            }



            if(!$rootScope.arrVATPostGrpPurchase){



                var finApi = $scope.$root.pr + 'supplier/supplier/get-supplier-finance'

                $http

                    .post(finApi, { 'supplier_id': $scope.rec.supplierID, 'token': $rootScope.token })

                    .then(function (res) {



                        if (res.data.ack != true) {

                            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(536));

                            angular.element('#_purchase_item_modal').modal('hide');

                            $scope.showLoader = false;

                            return false;

                        }

                        else{

                            if(!$rootScope.arrVATPostGrpPurchase) 

                                $rootScope.arrVATPostGrpPurchase = res.data.arrVATPostGrpPurchase;



                            $scope.newItemAddition(tempOrderData);

                        }

                    }).catch(function (message) {

                        $scope.showLoader = false;



                        throw new Error(message.data);

                    });

            }

            else{



                var finApi = $scope.$root.pr + 'supplier/supplier/get-supplier-finance'

                $http

                    .post(finApi, { 'supplier_id': $scope.rec.supplierID, 'token': $rootScope.token })

                    .then(function (res) {



                        if (res.data.ack != true) {

                            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(536));

                            angular.element('#_purchase_item_modal').modal('hide');

                            $scope.showLoader = false;

                            return false;

                        }

                        else{

                            if(!$rootScope.arrVATPostGrpPurchase) 

                                $rootScope.arrVATPostGrpPurchase = res.data.arrVATPostGrpPurchase;

                        }

                    }).catch(function (message) {

                        $scope.showLoader = false;



                        throw new Error(message.data);

                    });

                $scope.newItemAddition(tempOrderData);

            }

        }        

    }



    $scope.newItemAddition = function(tempOrderData){



        // console.log($scope.rec.currency_id);

        // console.log($scope.rec.order_date);

        // console.log($scope.$root.defaultCurrency);



        var currencyID = ($scope.rec.currency_id !== undefined && $scope.rec.currency_id !== null) ? $scope.rec.currency_id.id : 0;

        // var currencyID = parseFloat($scope.rec.currency_id.id);

        var currencyConversionRate = 1;



        if (currencyID == 0) {

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(607));

            return;

        }



        if (currencyID != $scope.$root.defaultCurrency) {



            var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";

            $http

                .post(currencyURL, {

                    'id': currencyID,

                    'or_date': $scope.rec.dispatchDate,

                    'token': $scope.$root.token

                })

                .then(function (res) {

                    if (res.data.ack == true) {

                        if (res.data.response.conversion_rate == null) {

                            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(590, [$scope.rec.currency_id.name]));

                            return;

                        }



                        currencyConversionRate = parseFloat(res.data.response.conversion_rate);

                    } else {

                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(590, [$scope.rec.currency_id.name]));

                        return;

                    }



                    $scope.items_array = [];



                    angular.copy($scope.tempProdArr, $scope.items_array);



                    angular.forEach($scope.items_array, function (prodData) {

                        // console.log(prodData);



                        if (prodData.chk == true) {



                            $scope.PendingSelectedDebitNoteItems.push(prodData);

                            prodData.item_type = $scope.item_type;

                            prodData.product_id = prodData.product_id;

                            prodData.product_name = prodData.product_name;

                            prodData.invoiceDetailID = prodData.id;

                            // prodData.product_name = prodData.description;



                            /* *********** */

                            prodData.purchase_status = 0;

                            prodData.prodQty = Number(prodData.qty);

                            prodData.prdInvQty = Number(prodData.qty);

                            prodData.qty = 1;



                            // prodData.standard_price = "";

                            prodData.actualPrice = parseFloat(prodData.unit_price);

                            prodData.standard_price = parseFloat(prodData.unit_price);



                            if (prodData.arr_units != undefined) {



                                if (prodData.arr_units.response != undefined)

                                    prodData.arr_units = prodData.arr_units.response;

                                else

                                    prodData.arr_units = '';



                                /* if (prodData.arr_units.length[0])

                                    prodData.units = prodData.arr_units[0];

                                else

                                    prodData.units = ''; */



                                angular.forEach(prodData.arr_units, function (obj) {

                                    if (obj.id == prodData.uom_id)

                                        prodData.units = obj;

                                });

                            }

                            else {

                                prodData.arr_units = '';

                                prodData.units = '';

                            }



                            $scope.tmpWarehouseArr = [];



                            if (prodData.arr_warehouse != undefined) {



                                angular.forEach(prodData.arr_warehouse, function (obj) {

                                    if (parseFloat(obj.available_quantity) > 0)

                                        $scope.tmpWarehouseArr.push(obj);

                                });



                                prodData.arr_warehouse = $scope.tmpWarehouseArr;

                                prodData.warehouses = prodData.warehouse_id;

                            }



                            /*  prodData.vat = '';

                                prodData.vat_value = '';

                                prodData.vat_id = ''; */



                            if ($rootScope.arrVATPostGrpPurchase) {// != undefined



                                angular.forEach($rootScope.arrVATPostGrpPurchase, function (obj) {

                                    if (obj.id == prodData.vat_id) {

                                        prodData.vat = obj.name;

                                        prodData.vat_value = obj.vat_value;

                                        prodData.vat_id = obj.id;

                                        prodData.vats = obj;

                                    }

                                });

                            }



                            /* angular.forEach($scope.arr_discount_type, function (obj) {

                                if (obj.id == prodData.discount_type)

                                    prodData.discount_type_id = obj;

                            });





                            if (!(prodData.discount_type > 0))

                                prodData.discount = ''; */



                            prodData.discount = '';

                            prodData.discount_price = '';

                            prodData.discount_type = '';



                            prodData.total_landing_cost = 0;

                            prodData.supplier_id = $scope.rec.supplierID;



                            var count = $scope.items.length - 1;



                            if (prodData.arr_volume_discounts != undefined) {

                                prodData.arr_volume_discounts = prodData.arr_volume_discounts;

                            }



                            $scope.tempOrderLineitems.push(prodData);

                            $scope.$root.return_status = true;

                        }

                    });



                    $scope.showReceiveStuff = true;

                    angular.element('#_purchase_item_modal').modal('hide');



                    $scope.insertNewOrderLine($scope.tempOrderLineitems, tempOrderData)

                        .then(function () {



                            $scope.showLoader = false;



                            angular.forEach($scope.tempOrderLineitems2, function (elem) {



                                // console.log(elem);



                                if (elem.item_type == 0) {

                                    /* if (elem.arr_units != undefined) {

                                        //elem.arr_units = elem.arr_units.response;

                                        elem.units = elem.arr_units[0];

                                    } */



                                    if (elem.arr_units != undefined) {

                                        // elem.arr_units = elem.arr_units.response;



                                        angular.forEach(elem.arr_units, function (obj) {

                                            if (obj.id == elem.uom_id)

                                                elem.units = obj;

                                        });

                                    }



                                    elem.qty = 1;





                                    /* if (elem.arr_prod_warehouse != undefined) {

                                        angular.forEach(elem.arr_prod_warehouse, function (obj) {

                                            if (obj.id == elem.arr_warehouse.default_wh)

                                                elem.warehouses = obj;

                                        });



                                        if ((elem.warehouses == undefined) && (elem.arr_prod_warehouse[0].id > 0))

                                            elem.warehouses = elem.arr_prod_warehouse[0];

                                    } */



                                    $scope.tmpWarehouseArr = [];



                                    if (elem.arr_warehouse != undefined) {



                                        angular.forEach(elem.arr_warehouse, function (obj) {

                                            if (parseFloat(obj.available_quantity) > 0)

                                                $scope.tmpWarehouseArr.push(obj);

                                        });



                                        elem.arr_warehouse = $scope.tmpWarehouseArr;

                                        elem.warehouses = elem.warehouse_id;

                                    }



                                    elem.standard_price = parseFloat(elem.standard_price);



                                    // console.log(elem.vat_rate_id);



                                    if ($rootScope.arrVATPostGrpPurchase) {// != undefined



                                        // console.log(elem.vat_rate_id);

                                        // console.log($rootScope.arrVATPostGrpPurchase);



                                        angular.forEach($rootScope.arrVATPostGrpPurchase, function (obj) {

                                            /* if (obj.id == elem.vat_rate_id) {

                                                elem.vat = obj.name;

                                                elem.vat_value = obj.vat_value;

                                                elem.vat_id = obj.id;

                                                elem.vats = obj;

                                            } */

                                            if (obj.id == elem.vat_id) {

                                                elem.vat = obj.name;

                                                elem.vat_value = obj.vat_value;

                                                elem.vat_id = obj.id;

                                                elem.vats = obj;

                                            }

                                        });

                                    }

                                }



                                $scope.items.push(elem);

                            });



                            var item = $filter("filter")($scope.items, { item_type: 0, stock_check: 1 });



                            if (item != undefined && item.length) {

                                $scope.show_btn_dispatch_stuff = true;

                            }

                            else

                                $scope.show_btn_dispatch_stuff = false;



                            var rec2 = {};



                            $scope.updateGrandTotal();



                            $scope.showReceiveStuff = true;



                            // $scope.$emit('PurchaseLines', $scope.items);



                        });





                });



        } else {

            $scope.items_array = [];

            //angular.copy($rootScope.prooduct_arr,  $scope.items_array);



            angular.copy($scope.tempProdArr, $scope.items_array);





            angular.forEach($scope.items_array, function (prodData) {



                // console.log(prodData);



                if (prodData.chk == true) {



                    $scope.PendingSelectedDebitNoteItems.push(prodData);

                    prodData.item_type = $scope.item_type;

                    // prodData.product_name = prodData.description;

                    prodData.product_id = prodData.product_id;

                    prodData.product_name = prodData.product_name;

                    // prodData.qty = 1;



                    /* *********** */

                    prodData.purchase_status = 0;

                    prodData.prodQty = Number(prodData.qty);

                    prodData.prdInvQty = Number(prodData.qty);

                    prodData.qty = 1;



                    prodData.invoiceDetailID = prodData.id;



                    prodData.standard_price = "";



                    if (prodData.arr_units != undefined) {



                        if (prodData.arr_units.response != undefined)

                            prodData.arr_units = prodData.arr_units.response;

                        else

                            prodData.arr_units = '';



                        /* if (prodData.arr_units.length[0])

                            prodData.units = prodData.arr_units[0];

                        else

                            prodData.units = ''; */



                        angular.forEach(prodData.arr_units, function (obj) {

                            if (obj.id == prodData.uom_id)

                                prodData.units = obj;

                        });

                    }

                    else {

                        prodData.arr_units = '';

                        prodData.units = '';

                    }



                    $scope.tmpWarehouseArr = [];



                    if (prodData.arr_warehouse != undefined) {



                        angular.forEach(prodData.arr_warehouse, function (obj) {

                            if (parseFloat(obj.available_quantity) > 0)

                                $scope.tmpWarehouseArr.push(obj);

                        });



                        prodData.arr_warehouse = $scope.tmpWarehouseArr;

                        prodData.warehouses = prodData.warehouse_id;

                    }



                    /* prodData.vat = '';

                    prodData.vat_value = '';

                    prodData.vat_id = '';

                    console.log(prodData.vat_rate_id); */





                    if ($rootScope.arrVATPostGrpPurchase) {// != undefined



                        // 

                        // console.log($rootScope.arrVATPostGrpPurchase);



                        angular.forEach($rootScope.arrVATPostGrpPurchase, function (obj) {

                            /* if (obj.id == prodData.vat_rate_id) {

                                prodData.vat = obj.name;

                                prodData.vat_value = obj.vat_value;

                                prodData.vat_id = obj.id;

                                prodData.vats = obj;

                            } */



                            /* if (prodData.vat_rate_id == undefined) {

                                

                            }

                            else {

                                if (obj.id == prodData.vat_rate_id) {

                                    prodData.vat = obj.name;

                                    prodData.vat_value = obj.vat_value;

                                    prodData.vat_id = obj.id;

                                    prodData.vats = obj;

                                }

                            } */



                            if (obj.id == prodData.vat_id) {

                                prodData.vat = obj.name;

                                prodData.vat_value = obj.vat_value;

                                prodData.vat_id = obj.id;

                                prodData.vats = obj;

                            }

                        });

                    }



                    /* angular.forEach($scope.arr_discount_type, function (obj) {

                        if (obj.id == prodData.discount_type)

                            prodData.discount_type_id = obj;

                    });





                    if (!(prodData.discount_type > 0))

                        prodData.discount = ''; */



                    prodData.discount = '';

                    prodData.discount_price = '';

                    prodData.discount_type = '';



                    prodData.total_landing_cost = 0;

                    prodData.supplier_id = $scope.rec.supplierID;



                    var count = $scope.items.length - 1;



                    if (prodData.arr_volume_discounts != undefined) {

                        prodData.arr_volume_discounts = prodData.arr_volume_discounts;

                    }





                    $scope.tempOrderLineitems.push(prodData);

                    $scope.$root.return_status = true;

                }

            });



            $scope.showReceiveStuff = true;

            angular.element('#_purchase_item_modal').modal('hide');



            $scope.insertNewOrderLine($scope.tempOrderLineitems, tempOrderData)

                .then(function () {



                    $scope.showLoader = false;



                    angular.forEach($scope.tempOrderLineitems2, function (elem) {



                        // console.log(elem);



                        if (elem.item_type == 0) {

                            /* if (elem.arr_units != undefined) {

                                //elem.arr_units = elem.arr_units.response;

                                elem.units = elem.arr_units[0];

                            } */



                            if (elem.arr_units != undefined) {

                                // elem.arr_units = elem.arr_units.response;

                                // elem.arr_units = elem.arr_units[0];



                                angular.forEach(elem.arr_units, function (obj) {

                                    if (obj.id == elem.uom_id)

                                        elem.units = obj;

                                });

                            }



                            elem.qty = 1;





                            /* if (elem.arr_prod_warehouse != undefined) {

                                angular.forEach(elem.arr_prod_warehouse, function (obj) {

                                    if (obj.id == elem.arr_warehouse.default_wh)

                                        elem.warehouses = obj;

                                });



                                if ((elem.warehouses == undefined) && (elem.arr_prod_warehouse[0].id > 0))

                                    elem.warehouses = elem.arr_prod_warehouse[0];

                            } */

                            $scope.tmpWarehouseArr = [];



                            if (elem.arr_warehouse != undefined) {



                                angular.forEach(elem.arr_warehouse, function (obj) {

                                    if (parseFloat(obj.available_quantity) > 0)

                                        $scope.tmpWarehouseArr.push(obj);

                                });



                                elem.arr_warehouse = $scope.tmpWarehouseArr;

                                elem.warehouses = elem.warehouse_id;

                            }

                            // console.log(elem.vat_rate_id);



                            if ($rootScope.arrVATPostGrpPurchase) {// != undefined

                                angular.forEach($rootScope.arrVATPostGrpPurchase, function (obj) {

                                    /* if (obj.id == elem.vat_rate_id) {

                                        elem.vat = obj.name;

                                        elem.vat_value = obj.vat_value;

                                        elem.vat_id = obj.id;

                                        elem.vats = obj;

                                    } */

                                    if (obj.id == elem.vat_id) {

                                        elem.vat = obj.name;

                                        elem.vat_value = obj.vat_value;

                                        elem.vat_id = obj.id;

                                        elem.vats = obj;

                                    }

                                });

                            }

                        }



                        $scope.items.push(elem);

                    });



                    var item = $filter("filter")($scope.items, { item_type: 0, stock_check: 1 });



                    if (item != undefined && item.length) {

                        $scope.show_btn_dispatch_stuff = true;

                    }

                    else

                        $scope.show_btn_dispatch_stuff = false;



                    var rec2 = {};

                    $scope.updateGrandTotal();

                    $scope.showReceiveStuff = true;



                    // $scope.$emit('PurchaseLines', $scope.items);



                });

        }



        $scope.itemExists = false;



        angular.forEach($scope.items, function (obj) {

            if (obj.item_type == 0)

                $scope.itemExists = true;

        });

    }





    var newLineCount;



    $scope.insertNewOrderLine = function (tempOrderLineitems, tempOrderData, newLineCount) {



        // var insertNewOrderLine = $scope.$root.pr + "srm/srminvoice/insert-new-order-line";

        var insertNewOrderLine = $scope.$root.pr + "srm/srmorderreturn/insert-debit-note-new-order-line";





        if (newLineCount == undefined) newLineCount = $rootScope.maxHttpRepeatCount;

        return $http

            .post(insertNewOrderLine, {

                'token': $scope.$root.token,

                'tempOrderData': tempOrderData,

                'tempOrderLineitems': tempOrderLineitems

            })

            .then(function (result) {



                $scope.tempOrderLineitems2 = [];



                if (result.data.ack == true)

                    $scope.tempOrderLineitems2 = result.data.allitemArray;



            }).catch(function (e) {

                if (newLineCount != 0) return $scope.insertNewOrderLine(tempOrderLineitems, tempOrderData, newLineCount - 1);



                $scope.showLoader = false;



                throw new Error(e.data);

            });



    }



    $scope.ValidateItemPrice = function (item) {

        // console.log(item);

        var actualPrice = parseFloat(item.actualPrice);



        if (actualPrice > 0 && parseFloat(item.standard_price) > actualPrice) {

            item.standard_price = actualPrice;

            toaster.pop('warning', 'Info', 'Max per unit Price for this item is ' + actualPrice + '!');

        }

    }



    $scope.updateAllocationResults = function () {

        // console.log($scope.stock_item.remainig_qty);



        angular.forEach($scope.items, function (obj) {

            // console.log(obj.update_id);

            // console.log($scope.formData.orderLineID);



            if (obj.update_id == $scope.formData.orderLineID) {

                obj.remainig_qty = $scope.stock_item.remainig_qty;



                // console.log(obj.remainig_qty);

                obj.qtyItemAllocated = parseFloat($scope.formData.item_qty) - parseFloat($scope.stock_item.remainig_qty);

            }

        });



        angular.element('#stockAllocationModal').modal('hide');

    }



    $scope.searchKeyword_sup_gl_code = {};



    $scope.add_gl_account_values = function (gl_data) {



        $scope.showLoader = true;



        if ($stateParams.id == 0) {

            $scope.showLoader = false;

            toaster.pop('error', 'Error', 'Please select Supplier first!');

            $scope.$root.return_status = false;

        }



        if ($rootScope.arrVATPostGrpPurchase){

            var finApi = $scope.$root.pr + 'supplier/supplier/get-supplier-finance'

            $http

                .post(finApi, { 'supplier_id': $scope.rec.supplierID, 'token': $rootScope.token })

                .then(function (res) {



                    if (res.data.ack == true) {

                    }

                    else {

                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(536));

                        angular.element('#accthead_modal').modal('hide');

                        $scope.showLoader = false;

                        return false;

                    }

                }).catch(function (message) {

                    $scope.showLoader = false;



                    throw new Error(message.data);

                });

            

            $scope.newGlAccountAddition();



        }

        else{

            var finApi = $scope.$root.pr + 'supplier/supplier/get-supplier-finance'

            $http

                .post(finApi, { 'supplier_id': $scope.rec.supplierID, 'token': $rootScope.token })

                .then(function (res) {



                    if (res.data.ack == true) {



                        if(!$rootScope.arrVATPostGrpPurchase) 

                                $rootScope.arrVATPostGrpPurchase = res.data.arrVATPostGrpPurchase;



                        $scope.newGlAccountAddition();

                    }

                    else {

                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(536));

                        angular.element('#accthead_modal').modal('hide');

                        $scope.showLoader = false;

                        return false;

                    }

                }).catch(function (message) {

                    $scope.showLoader = false;



                    throw new Error(message.data);

                });

        }    

    }



    $scope.newGlAccountAddition = function(){



        /* ==================== */



        $scope.tempOrderLineitems = [];



        var tempOrderData = {};



        tempOrderData.orderID = $scope.rec.id;

        tempOrderData.supplier_id = $scope.rec.sell_to_cust_id;

        tempOrderData.invoice_code = $scope.rec.order_code;

        tempOrderData.invoice_type = $scope.rec.type;

        tempOrderData.type_id = $scope.rec.type;



        /* ==================== */





        angular.forEach($scope.gl_account, function (gl_data) {



            if (gl_data.chk == true) {



                // console.log(gl_data);

                $scope.acItem = {};

                $scope.acItem.product_id = gl_data.id;

                $scope.acItem.id = gl_data.id;

                $scope.acItem.product_code = gl_data.code;

                $scope.acItem.description = gl_data.name;

                $scope.acItem.product_name = gl_data.name;

                $scope.acItem.item_type = 1;

                $scope.acItem.qty = 1;

                $scope.acItem.Price = "";



                /* angular.forEach($rootScope.arr_vat, function (obj) {

                    if (obj.id == gl_data.vat_id)

                        $scope.acItem.vats = obj;

                }); */

                var vatRate = gl_data.vat_id;



                // console.log($rootScope.arr_vat);



                if (vatRate == 1 || vatRate == 2 || vatRate == 3 || vatRate == 4) {



                    if ($rootScope.arrVATPostGrpPurchase != undefined)

                        $scope.acItem.vats = $rootScope.arrVATPostGrpPurchase[vatRate - 1];

                }

                else {

                    angular.forEach($rootScope.arrVATPostGrpPurchase, function (obj) {

                        if (obj.id == gl_data.vat_id)

                            $scope.acItem.vats = obj;

                    });

                }



                angular.forEach($rootScope.gl_arr_units, function (obj) {

                    if (obj.id == gl_data.ref_id)

                        $scope.acItem.units = obj;

                });





                $scope.tempOrderLineitems.push($scope.acItem);

            }

        });







        // $scope.show_recieve_list = false;

        angular.element('#accthead_modal').modal('hide');



        // $scope.rec.item_types = $scope.arrItems[0];



        $scope.insertNewOrderLine($scope.tempOrderLineitems, tempOrderData)

            .then(function () {



                $scope.showLoader = false;



                angular.forEach($scope.tempOrderLineitems2, function (elem) {



                    // if ($rootScope.arr_vat_post_grp != undefined && $rootScope.order_posting_group_id != undefined) {

                    if ($rootScope.arrVATPostGrpPurchase) {



                        var vatRate = elem.vat_id;



                        if (vatRate == undefined) vatRate = elem.vats.id;



                        if (vatRate == 1 || vatRate == 2 || vatRate == 3 || vatRate == 4) {

                            elem.vats = $rootScope.arrVATPostGrpPurchase[vatRate - 1];

                        }

                        else {

                            angular.forEach($rootScope.arrVATPostGrpPurchase, function (obj) {



                                if (elem.vat_id == undefined) elem.vat_id = elem.vats.id;



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



                    angular.forEach($rootScope.gl_arr_units, function (obj) {

                        if (obj.id == elem.ref_id)

                            elem.units = obj;

                    });



                    elem.isGLVat = false;



                    if ($rootScope.defaultCompany == 133) {



                        if (elem.item_type == 1) {

                            //PBI: check is vat gl code.

                            if (elem.product_code == $scope.VatRange.gl1AccountCode || 

                                elem.product_code == $scope.VatRange.gl2AccountCode || 

                                elem.product_code == $scope.VatRange.gl3AccountCode) 

                            {

                                elem.isGLVat = true;

                            }

                            else {

                                elem.isGLVat = false;

                            }

                            //vat ranges for gli listing

                            // elem.startVatRange = $scope.VatRange.startRangeCode;

                            // elem.endVatRange = $scope.VatRange.endRangeCode;

                        }



                    }

                    else{



                        if (elem.item_type == 1) {

                            //PBI: check is vat gl code.

                            if (elem.product_code >= $scope.VatRange.startRangeCode && elem.product_code <= $scope.VatRange.endRangeCode) {

                                elem.isGLVat = true;

                            }

                            else {

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



                $scope.itemExists = false;



                angular.forEach($scope.items, function (obj) {

                    if (obj.item_type == 0)

                        $scope.itemExists = true;

                });



                $scope.updateGrandTotal();



                var rec2 = {};

                // console.log($scope.items);

            });



    }



    $scope.arr_units = [];

    $scope.get_setup_item_list = function (product_id) {



        $http

            .post(unitUrl_item, { 'token': $scope.$root.token, 'product_id': product_id })

            .then(function (res) {

                if (res.data.ack == true) {

                    $scope.arr_units = res.data.response;

                }

            }).catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

            });

    }



    $scope.updateGrandTotal = function () {

        var updateGrandTotalUrl = $scope.$root.pr + "srm/srmorderreturn/update-grand-total";



        var postData = {};

        postData.token = $scope.$root.token;



        if ($stateParams.id > 0)

            var invoice_id = $stateParams.id;

        else

            var invoice_id = $scope.rec.id;



        postData.order_id = invoice_id;

        postData.grandTotal = $scope.grandTotal();

        postData.netTotal = $scope.netTotal();

        postData.calcVat = $scope.calcVat();



        postData.supplierCreditNoteDate = $scope.rec.supplierCreditNoteDate;

        postData.defaultCurrencyID = $scope.$root.defaultCurrency;



        if (typeof $scope.$root.currency_id === 'object')

            var currencyID = $scope.$root.currency_id.id;

        else

            var currencyID = $scope.$root.currency_id;



        postData.invoiceCurrencyID = currencyID;



        postData.type = 1;



        $http

            .post(updateGrandTotalUrl, postData)

            .then(function (res) {

                if (res.data.ack == true) {

                    // console.log('updated grand total');

                }

            });

    }



    $scope.deleteOrderLine = function (index, item, items) {



        var update_id = item.update_id;

        var warehouse_id = '';



        if (item.warehouses != undefined)

            var warehouse_id = item.warehouses.id;



        var productid = item.id;

        var invoice_id = $scope.rec.update_id;



        var del_sub_exp = $scope.$root.pr + "srm/srmorderreturn/delete-debit-note-item";



        if (update_id == undefined)

            $scope.items.splice(index, 1);

        else {

            ngDialog.openConfirm({

                template: 'modalDeleteDialogId',

                className: 'ngdialog-theme-default-custom'

            }).then(function (value) {

                $http

                    .post(del_sub_exp, {

                        'id': update_id,

                        'productid': productid,

                        'warehouse_id': warehouse_id,

                        'invoice_id': invoice_id,

                        'table': 'srm_order_return_detail',

                        'token': $scope.$root.token

                    })

                    .then(function (res) {

                        if (res.data.ack == true) {

                            // items.splice(index);

                            $scope.items.splice(index, 1);



                            $scope.volume = res.data.volume;

                            $scope.weight = res.data.weight;

                            $scope.volume_unit = res.data.volume_unit;

                            $scope.weightunit = res.data.weightunit;                    

                            $scope.weight_permission = res.data.weight_permission; 

                            $scope.volume_permission = res.data.volume_permission; 

                            if(($scope.weight_permission >0 && $scope.weight && $scope.weight!=0) || ($scope.volume_permission>0 && $scope.volume && $scope.volume!=0))

                                    $scope.showVolumeWeight = 1;



                            $scope.updateGrandTotal();

                            toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));

                        }

                        else

                            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(108));

                    }).catch(function (message) {

                        $scope.showLoader = false;



                        throw new Error(message.data);

                    });

            }, function (reason) {

                console.log('Modal promise rejected. Reason: ', reason);

            });

        }

    }



    $scope.show_add_pop = function (id) {



        var DetailsURL = $scope.$root.gl + "chart-accounts/get-account-heads";

        $http

            .post(DetailsURL, { 'token': $scope.$root.token, 'gl_id': id })

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

            }).catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

            });



        $('#accthead_modal').modal('hide');



    }

    $scope.wordsLength = 0;



    $scope.showWordsLimits_invoice = function () {

        $scope.wordsLength = $scope.rec.note.length;

    }



    $scope.selectProd = function (id) {

        // console.log(id);

        for (var i = 0; i < $scope.products.length; i++) {

            if (id == $scope.products[i].id) {

                if ($scope.products[i].chk == true)

                    $scope.products[i].chk = false

                else

                    $scope.products[i].chk = true

            }

        }

    }



    // ############ Show-landing-cost-setup-modal ##############



    $scope.show_landing_cost_detail = function (suppler_id, prod_id) {



        $scope.total_landing_cost = "";

        var get_purchase_cost_rec_url = $scope.$root.stock + "products-listing/get-purchase-cost-detail-list";

        $scope.purchase_cost_detail_record = [];



        $http

            .post(get_purchase_cost_rec_url, {

                'token': $scope.$root.token,

                'product_id': prod_id,

                'supp_id': suppler_id

            })

            .then(function (res) {

                $scope.default_value_readonly = false;



                if (res.data.ack == true) {

                    //console.log(res.data.sum);

                    $scope.total_landing_cost = res.data.sum;



                    $.each(res.data.response, function (index, obj_rec) {

                        $scope.purchase_cost_detail_record.push(obj_rec);

                    });

                }

            }).catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

            });



        $('#product_landing_cost_setup').modal({ show: true });

    }



    // ############ ADD GL code for purchase-cost-detail ##############



    $scope.check_quantity = function (item) {



        var produnit = $scope.$root.stock + "unit-measure/get-unit-quanitity-record-popup";

        item.quantity_unit_price = $scope.rec.item_price = $scope.rec.item_quantity = 0;



        $http

            .post(produnit, { 'token': $scope.$root.token, 'unit_id': item.units.id, 'product_id': item.id })

            .then(function (res) {

                //	console.log(res.data.ack );

                if (res.data.ack == true) {

                    $('.pic_block').attr("disabled", false);

                    item.quantity_unit_price = (Number(item.standard_price)) * (Number(res.data.quantity));

                    item.quantity_limit = res.data.quantity;



                    $scope.rec.item_price = (Number(item.standard_price));

                    $scope.rec.item_quantity = (Number(res.data.quantity));



                }

                else if (res.data.ack == 0) {

                    $('.pic_block').attr("disabled", true);

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(565));

                }

            }).catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

            });

    }





    $scope.enable_btn_submit = false;



    $scope.check_min_max = function (item) {



        // console.log(item);

        // console.log(item.qty);

        // console.log(item.prodQty);



        // if (item.item_type == 0 && Number(item.qty) > Number(item.prodQty)) {

        if (item.item_type == 0 && (Number(item.qty) > Number(item.prodQty))) {



            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(584));

            

            if (item.prodQty > 0)

                item.qty = Number(item.prodQty);//item.prodQty2;

            else

                item.qty = 0;



            return;

        }



        if (item.item_type == 0 &&  item.warehouses && Number(item.qty) > (Number(item.warehouses.available_quantity) + Number(item.qtyItemAllocated))) {



            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(584));

            item.qty = (Number(item.warehouses.available_quantity) + Number(item.qtyItemAllocated));

            return;

        }



        if (item.arr_volume_discounts != undefined && item.arr_volume_discounts.length) {

            var flg = 0;

            angular.forEach(item.arr_volume_discounts, function (obj) {

                if (Number(item.qty) >= Number(obj.min_qty)) {

                    flg = 1;

                    if (obj.discount_type == 1) // %

                        item.standard_price = parseFloat(item.price_offer) - parseFloat(item.price_offer) * (parseFloat(obj.volume_discount) / 100);

                    else // value

                        item.standard_price = parseFloat(item.price_offer) - parseFloat(obj.volume_discount);

                    // item.standard_price = Number(item.standard_price.toFixed(2));

                    item.standard_price = parseFloat(item.standard_price);

                }

            });



            if (!flg)

                item.standard_price = Number(item.price_offer);

        }



        /* if (item.item_type == 0 && item.qty != item.qtyItemAllocated) {

            if (item.qty < item.qtyItemAllocated) {

                toaster.pop('warning', 'Info', String(item.qtyItemAllocated) + ' quantity is already allocated!');

                item.qty = item.qtyItemAllocated;

            }



            if (item.qty == item.qtyItemAllocated)

                item.remainig_qty = 0;

        } */

    }



    $scope.show_warehouse_loc_info = function (loc_id, warehouse_id, storage_loc_id, prod_id) {

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

            .then(function (res) {



                if (res.data.response != null) {

                    $scope.warehouse_location_details_data = res.data.response;

                    //console.log($scope.warehouse_location_details_data);

                }

            }).catch(function (message) {

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

            .then(function (res) {

                $scope.columns1 = [];

                $scope.bin_loc_add_cost_data = [];



                if (res.data.response != null) {

                    $scope.bin_loc_add_cost_data = res.data.response;

                    // console.log(res.data.response);

                    angular.forEach(res.data.response[0], function (val, index) {

                        $scope.columns1.push({

                            'title': toTitleCase(index),

                            'field': index,

                            'visible': true

                        });

                    });

                    // $scope.warehouse_loc_add_cost_setup_Show = true;

                }

            }).catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

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

            .then(function (res) {



                $scope.columns2 = [];

                $scope.prod_warehouse_loc_add_cost_data = [];



                if (res.data.response != null) {

                    $scope.prod_warehouse_loc_add_cost_data = res.data.response;

                    //console.log(res.data.response);

                    angular.forEach(res.data.response[0], function (val, index) {

                        $scope.columns2.push({

                            'title': toTitleCase(index),

                            'field': index,

                            'visible': true

                        });

                    });

                }

            }).catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

            });



        //get product loc additional cost end



        angular.element('#location_modal').modal({ show: true });

    }



    var rec2 = {};



    $scope.add_sublist = function (rec, rec2, mode) {





        $scope.netTotalAmount = $scope.netTotal();

        $scope.grand_totalAmount = $scope.grandTotal();



        var uomFlag = 0;



        angular.forEach($scope.items, function (obj) {

            if (obj.units != undefined && obj.item_type == 0) {

                if (!(obj.units.id > 0)) {

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Unit Of Measure']));

                    uomFlag++;

                    return false;

                }

            }

            else if (obj.units == undefined && obj.item_type == 0) {

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Unit Of Measure']));

                uomFlag++;

                return false;

            }



            /* if ((!(obj.standard_price) || obj.standard_price == 0 || obj.standard_price == '') && obj.item_type) {



                if (obj.item_type > 0)

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(605, [obj.product_name]));

                else

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(606, [obj.product_name]));



                uomFlag++;

                return false;

            } *///toaster.pop('warning', 'Info', obj.product_name + ' Price is empty!');



            if (obj.qty<0) {

                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(658, [obj.product_name]));

                uomFlag++;

                return false;

            }



            if (!(obj.qty) && !(obj.qty<0)) {

                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(593, [obj.product_name]));

                uomFlag++;

                return false;

            }

        });



        if (uomFlag > 0) return false;





        if (parseFloat($scope.netTotalAmount) < 0 || parseFloat($scope.grand_totalAmount) < 0) {

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(585));

            return false;

        }



        // $scope.saverecord = $scope.add_general(rec);



        $scope.showLoader = true;



        $scope.add_general(rec, rec2)

            .then(function (result) {



                console.log(result);



                if(result == false){

                    $scope.showLoader = false;

                    return false;

                }



                var rec2 = {};



                if (!(mode > 1))

                    mode = 0;



                if ($scope.items.length == 0) {

                    $scope.debitNoteDeleteBtn = false;

                    $scope.check_sr_readonly = true;

                    $scope.showLoader = false;

                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));

                    return false;

                }



                rec2.net_amount = $scope.netTotal();

                rec2.tax_amount = $scope.calcVat();

                rec2.grand_total = $scope.grandTotal();



                rec2.items_net_total = $scope.rec.items_net_total;

                rec2.items_net_discount = $scope.rec.items_net_discount;

                rec2.items_net_vat = $scope.rec.items_net_vat;



                rec2.order_date = $scope.$root.posting_date;



                // console.log($scope.rec.currency_id);



                if ($scope.rec.currency_id == undefined || $scope.rec.currency_id == 0) {

                    $scope.showLoader = false;

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Supplier Currency']));

                    return;

                }



                if ($rootScope.currency_id.id == $scope.$root.defaultCurrency) {

                    rec2.net_amount_converted = Number(rec2.net_amount);

                    rec2.tax_amount_converted = Number(rec2.tax_amount);

                    rec2.grand_total_converted = Number(rec2.grand_total);



                    $scope.addsublist(rec2, rec, mode);

                }

                else {





                    // $rootScope.get_currency_list($scope.$root.posting_date);

                    var isValide = true;

                    var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";

                    // console.log('hey');



                    if (typeof $scope.$root.currency_id === 'object')

                        var currencyID = $scope.$root.currency_id.id;

                    else

                        var currencyID = $scope.$root.currency_id;



                    // if ($scope.rec.currency_id != undefined)

                    //     var currencyID = $scope.rec.currency_id.id;

                    // else

                    //     var currencyID = $rootScope.currency_id.id;





                    $scope.items_converted_arr = []; //'id': $scope.$root.currency_id,

                    $http

                        .post(currencyURL, {

                            'id': currencyID,

                            'token': $scope.$root.token,

                            'or_date': $scope.rec.dispatchDate

                        })

                        .then(function (res) {

                            // $scope.showLoader = false;

                            if (res.data.ack == true) {



                                if (res.data.response.conversion_rate != null) {



                                    rec2.net_amount_converted = Number(rec2.net_amount) / Number(res.data.response.conversion_rate);

                                    rec2.tax_amount_converted = Number(rec2.tax_amount) / Number(res.data.response.conversion_rate);

                                    rec2.grand_total_converted = Number(rec2.grand_total) / Number(res.data.response.conversion_rate);



                                    //rec2.net_amount_converted <= 0 || 



                                    if (rec2.net_amount_converted == undefined || rec2.tax_amount_converted == undefined || rec2.grand_total_converted == undefined) {

                                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Currency Rate']));

                                        $scope.showLoader = false;

                                        isValide = false;

                                        return;

                                    }

                                    else

                                        $scope.addsublist(rec2, rec, mode);

                                }

                            }

                            else {

                                $scope.showLoader = false;

                                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Currency Conversion Rate']));

                            }

                        }).catch(function (message) {

                            $scope.showLoader = false;



                            throw new Error(message.data);

                        });

                }

            }).catch(function (message) {

                $scope.showLoader = false;

                toaster.pop('error', 'info', message);

                throw new Error(message);

            });

    }



    $scope.addsublist = function (rec2, rec, mode) {

        var quoteUrl = $scope.$root.pr + "srm/srmorderreturn/update-sublist";



        rec2.note = rec.note;

        rec2.items = $scope.items;

        rec2.invoice_id = $stateParams.id

        rec2.token = $rootScope.token;

        rec2.debitNoteCode = $scope.rec.debitNoteCode;

        // console.log(rec);

        // console.log(rec2);



        if (rec == 0)

            rec = $scope.rec;



        // console.log($scope.rec);

        // console.log(rec);



        var validationchk = 0;

        $scope.supplierLocMandatory = 0;



        angular.forEach($scope.items, function (obj) {



            // console.log(obj);

            if (obj.item_type == 0)

                $scope.supplierLocMandatory = 1;



            /* if (obj.discount_type_id != undefined && (obj.discount == null || obj.discount == undefined)) {



                $scope.showLoader = false;

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(603, [obj.product_name]));

                obj.discount = "";

                validationchk++;

                return false;

            }

            else if (obj.discount_type_id == undefined && obj.discount != null && obj.discount != '' && obj.discount != undefined) {



                $scope.showLoader = false;

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(604, [obj.product_name]));

                obj.discount = "";

                validationchk++;

                $scope.showLoader = false;

                return false;

            } */



            if (obj.discount_type_id && !(obj.discount)) {



                $scope.showLoader = false;

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(603, [obj.product_name]));

                obj.discount = "";

                validationchk++;

                return false;

            }

            else if (!(obj.discount_type_id) && obj.discount) {



                $scope.showLoader = false;

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(604, [obj.product_name]));

                obj.discount = "";

                validationchk++;

                $scope.showLoader = false;

                return false;

            }



            // if (!(obj.standard_price > 0) && obj.item_type) {

            /* if ((obj.standard_price == 0 || obj.standard_price == '') && obj.item_type) {



                $scope.showLoader = false;



                if (obj.item_type > 0)

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(605, [obj.product_name]));

                else

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(606, [obj.product_name]));



                validationchk++;

                return false;

            } */

            // console.log(obj);

        });



        // console.log($scope.rec.shipToSupplierLocName);



        // if ($scope.supplierLocMandatory == 1 && $scope.rec.shipToSupplierLocName != undefined) {



        //     if (!($scope.rec.shipToSupplierLocName.length > 0)) {

        //         $scope.showLoader = false;

        //         toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(560));

        //         return false;

        //     }

        // }

        // else if ($scope.supplierLocMandatory == 1 && $scope.rec.shipToSupplierLocName == undefined) {

        //     $scope.showLoader = false;

        //     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(560));

        //     return false;

        // }



        if (validationchk > 0) {

            $scope.showLoader = false;

            return false;

        }





        rec2.currency_id = $rootScope.currency_id.id;

        /* rec2.posting_date = $rootScope.posting_date;

        rec2.order_date = $scope.rec.order_date; */



        if ($stateParams.id > 0)

            rec2.invoice_id = $stateParams.id;

        else

            rec2.invoice_id = rec.id;



        rec2.supplier_id = $scope.rec.supplierID;

        rec2.invoice_type = $scope.rec.type;



        // console.log(rec2);return;

        $http

            .post(quoteUrl, rec2)

            .then(function (res) {

                $scope.showLoader = false;



                // console.log(mode);



                if (res.data.ack == true) {



                    if (!(mode > 0))

                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));



                    // console.log(mode);



                    $rootScope.updateSelectedGlobalData("uom");

                    // $rootScope.updateSelectedGlobalData('item');

                    $scope.get_srm_order_items(mode);

                }

                else if (res.data.ack == 2) {



                    $scope.get_srm_order_items(mode);



                    if (!(mode > 0))

                        toaster.pop('success', 'Edit', res.data.error);

                }

                else

                    toaster.pop('error', 'Edit', res.data.error);



                $scope.debitNoteDeleteBtn = false;



            }).catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

            });

    }



    $scope.formData = {};

    $scope.record = {};



    $scope.saveSublistBeforePosting = function (rec, rec2, mode) {



        // var deferred = $q.defer();



        var quoteUrl = $scope.$root.pr + "srm/srmorderreturn/update-sublist";



        rec2.note = rec.note;

        rec2.items = $scope.items;

        rec2.invoice_id = $stateParams.id

        rec2.token = $rootScope.token;

        rec2.debitNoteCode = $scope.rec.debitNoteCode;

        // console.log(rec);

        // console.log(rec2);



        if (rec == 0)

            rec = $scope.rec;



        // console.log($scope.rec);

        // console.log(rec);



        var validationchk = 0;

        $scope.supplierLocMandatory = 0;



        angular.forEach($scope.items, function (obj) {



            // console.log(obj);

            if (obj.item_type == 0)

                $scope.supplierLocMandatory = 1;



            /* if (obj.discount_type_id != undefined && (obj.discount == null || obj.discount == undefined)) {



                $scope.showLoader = false;

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(603, [obj.product_name]));

                obj.discount = "";

                validationchk++;

                return false;

            }

            else if (obj.discount_type_id == undefined && obj.discount != null && obj.discount != '' && obj.discount != undefined) {



                $scope.showLoader = false;

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(604, [obj.product_name]));

                obj.discount = "";

                validationchk++;

                $scope.showLoader = false;

                return false;

            } */



            if (obj.discount_type_id && !(obj.discount)) {



                $scope.showLoader = false;

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(603, [obj.product_name]));

                obj.discount = "";

                validationchk++;

                return false;

            }

            else if (!(obj.discount_type_id) && obj.discount) {



                $scope.showLoader = false;

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(604, [obj.product_name]));

                obj.discount = "";

                validationchk++;

                $scope.showLoader = false;

                return false;

            } 



            // if (!(obj.standard_price > 0) && obj.item_type) {

            /* if ((obj.standard_price == 0 || obj.standard_price == '') && obj.item_type) {



                $scope.showLoader = false;



                if (obj.item_type > 0)

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(605, [obj.product_name]));

                else

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(606, [obj.product_name]));



                validationchk++;

                return false;

            } */

            // console.log(obj);

        });



        // console.log($scope.rec.shipToSupplierLocName);



        if ($scope.supplierLocMandatory == 1 && $scope.rec.shipToSupplierLocName != undefined) {



            if (!($scope.rec.shipToSupplierLocName.length > 0)) {

                $scope.showLoader = false;

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(560));

                return false;

            }

        }

        else if ($scope.supplierLocMandatory == 1 && $scope.rec.shipToSupplierLocName == undefined) {

            $scope.showLoader = false;

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(560));

            return false;

        }



        if (validationchk > 0) {

            $scope.showLoader = false;

            return false;

        }





        rec2.currency_id = $rootScope.currency_id.id;

        /* rec2.posting_date = $rootScope.posting_date;

        rec2.order_date = $scope.rec.order_date; */



        if ($stateParams.id > 0)

            rec2.invoice_id = $stateParams.id;

        else

            rec2.invoice_id = rec.id;



        rec2.supplier_id = $scope.rec.supplierID;

        rec2.invoice_type = $scope.rec.type;



        // console.log(rec2);return;

        return $http

            .post(quoteUrl, rec2)

            .then(function (res) {

                $scope.showLoader = false;



                // console.log(mode);



                if (res.data.ack == true) {



                    /* if (!(mode > 0))

                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102)); */



                    // console.log(mode);



                    $rootScope.updateSelectedGlobalData("uom");

                    // $rootScope.updateSelectedGlobalData('item');

                    $scope.get_srm_order_items(mode);

                }

                else if (res.data.ack == 2) {



                    $scope.get_srm_order_items(mode);



                    /* if (!(mode > 0))

                        toaster.pop('success', 'Edit', res.data.error); */

                }

                else

                    toaster.pop('error', 'Edit', res.data.error);



                $scope.debitNoteDeleteBtn = false;



            }).catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

            });





        /* $scope.showLoader = true;



        $scope.add_general(rec, rec2)

            .then(function () {



                var rec2 = {};



                if (!(mode > 1))

                    mode = 0;



                if ($scope.items.length == 0) {

                    $scope.debitNoteDeleteBtn = false;

                    $scope.check_sr_readonly = true;

                    $scope.showLoader = false;

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



                rec2.order_date = $scope.$root.posting_date;



                // console.log($scope.rec.currency_id);



                if ($scope.rec.currency_id == undefined || $scope.rec.currency_id == 0) {

                    $scope.showLoader = false;

                    // toaster.pop('error', 'Info', 'Supplier Currency is not Selected!');

                    deferred.reject('Supplier Currency is not Selected!');

                    // return;

                }



                if ($rootScope.currency_id.id == $scope.$root.defaultCurrency) {

                    rec2.net_amount_converted = Number(rec2.net_amount);

                    rec2.tax_amount_converted = Number(rec2.tax_amount);

                    rec2.grand_total_converted = Number(rec2.grand_total);



                    $scope.addsublist(rec2, rec, mode);

                }

                else {





                    // $rootScope.get_currency_list($scope.$root.posting_date);

                    var isValide = true;

                    var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";

                    // console.log('hey');



                    if (typeof $scope.$root.currency_id === 'object')

                        var currencyID = $scope.$root.currency_id.id;

                    else

                        var currencyID = $scope.$root.currency_id;



                    // if ($scope.rec.currency_id != undefined)

                    //     var currencyID = $scope.rec.currency_id.id;

                    // else

                    //     var currencyID = $rootScope.currency_id.id;





                    $scope.items_converted_arr = []; //'id': $scope.$root.currency_id,

                    $http

                        .post(currencyURL, {

                            'id': currencyID,

                            'token': $scope.$root.token,

                            'or_date': $scope.rec.dispatchDate

                        })

                        .then(function (res) {

                            // $scope.showLoader = false;

                            if (res.data.ack == true) {



                                if (res.data.response.conversion_rate != null) {



                                    rec2.net_amount_converted = Number(rec2.net_amount) / Number(res.data.response.conversion_rate);

                                    rec2.tax_amount_converted = Number(rec2.tax_amount) / Number(res.data.response.conversion_rate);

                                    rec2.grand_total_converted = Number(rec2.grand_total) / Number(res.data.response.conversion_rate);



                                    if (rec2.net_amount_converted <= 0 || rec2.net_amount_converted == undefined || rec2.tax_amount_converted == undefined || rec2.tax_amount_converted == undefined || rec2.grand_total_converted == undefined || rec2.grand_total_converted == undefined) {

                                        // toaster.pop('error', 'Info', 'Please Select Currency Rate.');

                                        deferred.reject('Please Select Currency Rate.');

                                        $scope.showLoader = false;

                                        isValide = false;

                                        // return;

                                    }

                                    else

                                        $scope.addsublist(rec2, rec, mode);

                                }

                            }

                            else {

                                $scope.showLoader = false;

                                // toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));

                                deferred.reject('Please set the conversion rate.');

                            }

                        }).catch(function (message) {

                            $scope.showLoader = false;

                            // 

                            // deferred.reject('Server is not Acknowledging');

                            throw new Error(message.data);

                        });

                }

            }).catch(function (message) {

                $scope.showLoader = false;

                toaster.pop('error', 'info', message);

                throw new Error(message);

            }); */

    }





    var counter = 1;

    $scope.check_order_complete = $scope.check_readonly;



    var counter = 1;

    $scope.check_order_complete = $scope.check_readonly;

    var total_rec_recvie = 0;

    var total_rec_invice = 0;



    $scope.get_srm_order_items = function (mode) {



        // console.log($rootScope.prooduct_arr);

        var total_rec_recvie = total_rec_invice = 0;

        var StillNeedAllocation = 0;





        $scope.show_stock = true;

        $scope.show_invoice = true;



        $scope.show_recieve_list_anchor = true;

        $scope.showReceiveStuff = false;



        $scope.volume = 0;

        $scope.weight = 0;

        $scope.volume_unit = '';

        $scope.weightunit = '';

        $scope.weight_permission = 0;

        $scope.volume_permission = 0;

        $scope.showVolumeWeight = 0;







        if ($stateParams.id > 0 && !(mode > 0)) {



            $scope.makeInvoiceFormReadonly();

            $scope.check_sr_readonly = true;

            var invoiceid = $stateParams.id;

        }

        else

            var invoiceid = $scope.rec.update_id;



        /* if ($stateParams.id > 0 && !(readonlyModeFalse > 0)) {

            $scope.makeInvoiceFormReadonly();

            $scope.check_srm_readonly = true;

            var invoiceid = $stateParams.id;

        }

        else

            var invoiceid = $scope.rec.update_id; */



        // console.log($scope.rec);

        // console.log($scope.rec.purchaseInvoiceID);



        $scope.showLoader = true;



        var getQuoteProduct = $scope.$root.pr + "srm/srmorderreturn/get-sublist";



        $http

            .post(getQuoteProduct,

            {

                'invoice_id': invoiceid,

                'purchaseInvoiceID': $scope.rec.purchaseInvoiceID,

                'token': $scope.$root.token

            })

            .then(function (rsQtItem) {



                $scope.rec.record_total = rsQtItem.data.total;



                



                if (rsQtItem.data.ack == true) {

                    $scope.items = [];

                    angular.forEach(rsQtItem.data.response, function (elem, detIndex) {

                        var detail = {};

                        //$scope.get_setup_item_list(elem.product_id);



                        detail.purchase_status = elem.purchase_status;

                        detail.stock_check = elem.stock_check;

                        detail.update_id = elem.id;

                        detail.id = elem.product_id;

                        detail.pid = elem.product_id;



                        detail.invoiceDetailID = elem.srm_invoice_detail;

                        detail.product_id = elem.product_id;

                        detail.product_name = elem.product_name;

                        detail.product_code = elem.product_code;



                        detail.purchase_unit = elem.unit_measure_id;

                        detail.currentStock = elem.currentStock;



                        detail.unit_of_measure_name = elem.unit_measure;

                        detail.unit_id = elem.unit_measure_id;

                        detail.unit_parent = elem.unit_parent_id;

                        detail.sale_unit_qty = elem.unit_qty;

                        detail.category_id = elem.cat_id;

                        detail.item_type = elem.type;

                        detail.item_trace_unique_id = elem.item_trace_unique_id



                        if (parseFloat(elem.qty) > 0)

                            detail.qty = parseFloat(elem.qty);

                        else

                            detail.qty = '';





                        detail.isGLVat = false;



                        if ($rootScope.defaultCompany == 133) {



                            if (detail.item_type == 1) {

                                //PBI: check is vat gl code.

                                if (detail.product_code == elem.vatRange.gl1AccountCode || 

                                    detail.product_code == elem.vatRange.gl2AccountCode || 

                                    detail.product_code == elem.vatRange.gl3AccountCode) 

                                {

                                    detail.isGLVat = true;

                                }

                                else {

                                    detail.isGLVat = false;

                                }

                            }

                        }

                        else{



                            if (detail.item_type == 1) {

                                //PBI: check is vat gl code.

                                if (detail.product_code >= elem.vatRange.startRangeCode && detail.product_code <= elem.vatRange.endRangeCode) {

                                    detail.isGLVat = true;

                                }

                                else {

                                    detail.isGLVat = false;

                                }

                                //vat ranges for gli listing

                                detail.startVatRange = elem.vatRange.startRangeCode;

                                detail.endVatRange = elem.vatRange.endRangeCode;

                            }

                        }



                        // console.log(elem.prdInvQty);



                        /* if (parseFloat(elem.prodQty) > 0)

                            detail.prodQty = parseFloat(elem.prodQty);

                        else

                            detail.prodQty = ''; */



                        if (parseFloat(elem.prdInvQty) > 0)

                            detail.prodQty = parseFloat(elem.prdInvQty);

                        else

                            detail.prodQty = '';



                        detail.prdInvQty = parseFloat(elem.prdInvQty);



                        // console.log(detail.prodQty);



                        // if (parseFloat(elem.unit_price) > 0)

                        //     detail.standard_price = parseFloat(elem.unit_price);

                        // else

                        //     detail.standard_price = '';



                        detail.standard_price = parseFloat(elem.unit_price);



                        if (parseFloat(elem.discount) > 0)

                            detail.discount = parseFloat(elem.discount);

                        else

                            detail.discount = '';



                        detail.sale_unit_id = elem.sale_unit_id;

                        detail.purchase_unit_id = elem.purchase_unit_id;



                        detail.primary_unit_of_measure_id = elem.primary_unit_of_measure_id;

                        detail.primary_unit_of_measure_name = elem.primary_unit_of_measure_name;



                        // console.log(elem.discount_type);



                        angular.forEach($scope.arr_discount_type, function (obj) {

                            if (obj.id == elem.discount_type)

                                detail.discount_type_id = obj;

                        });



                        /* angular.forEach($rootScope.arr_vat, function (obj) {

                            if (obj.id == elem.vat_id)

                                detail.vats = obj;

                        }); */





                        if (elem.item_stock_allocation.response != undefined) {

                            detail.item_stock_allocation = elem.item_stock_allocation.response;



                            detail.purchase_status = detail.item_stock_allocation[0].purchase_status;



                            // console.log(detail.purchase_status);

                            var ordqty = 0;



                            angular.forEach(detail.item_stock_allocation, function (elem) {

                                ordqty = parseFloat(ordqty) + parseFloat(elem.quantity);

                            });



                            detail.remainig_qty = parseFloat(detail.qty) - parseFloat(ordqty);



                            detail.qtyItemAllocated = ordqty;



                            // console.log(detail.remainig_qty);

                            // console.log(detail.qty);

                            // console.log(ordqty);

                        }

                        else {

                            detail.remainig_qty = detail.qty;



                            // console.log(detail.remainig_qty);

                            // console.log(detail.qty);

                            detail.qtyItemAllocated = 0;



                            detail.purchase_status = 0;

                        }



                        detail.warehouse_id = elem.warehouse_id;

                        detail.warehouse = elem.warehouse;

                        detail.warehouse_name = elem.warehouse;



                        detail.vat = '';

                        detail.vat_value = '';

                        detail.vat_id = '';

                        // console.log(elem.vat_id);





                        if ($rootScope.arrVATPostGrpPurchase) {// != undefined

                            // console.log($rootScope.arrVATPostGrpPurchase);



                            angular.forEach($rootScope.arrVATPostGrpPurchase, function (obj) {

                                if (obj.id == elem.vat_id) {

                                    detail.vat = obj.name;

                                    detail.vat_value = obj.vat_value;

                                    detail.vat_id = obj.id;

                                    detail.vats = obj;

                                }

                            });

                        }



                        if (detail.item_type == 0) {



                            detail.arr_units = [];

                            detail.arr_units = elem.arr_units.response;



                            if (detail.arr_units != undefined) {



                                angular.forEach(detail.arr_units, function (obj) {

                                    if (obj.id == elem.unit_measure_id)

                                        detail.units = obj;

                                });

                            }



                            detail.arr_warehouse = [];

                            detail.arr_warehouse = elem.arr_warehouse.response;



                            // console.log(detail.arr_warehouse);



                            angular.forEach(detail.arr_warehouse, function (obj) {



                                if (obj.id == elem.warehouse_id)

                                    detail.warehouses = obj;

                                    // detail.warehouses = obj.id;

                            });



                            detail.rawMaterialProduct = elem.rawMaterialProduct;

                            detail.raw_material_gl_id = elem.raw_material_gl_id;

                            detail.raw_material_gl_code = elem.raw_material_gl_code;

                            detail.raw_material_gl_name = elem.raw_material_gl_name;



                            // console.log(detail);



                            // check for stock already selected for deallocation start



                            // check for stock already selected for deallocation end



                            // console.log(detail.purchase_status);





                            if (detail.purchase_status == 0)

                                StillNeedAllocation++;



                            /* if (detail.purchase_status == 1)

                                total_rec_recvie++;



                            if (detail.purchase_status == 2)

                                total_rec_invice++; */



                            if (detail.purchase_status == 2)

                                total_rec_recvie++;



                            if (detail.purchase_status == 3) {

                                total_rec_recvie++;

                                total_rec_invice++;

                            }

                            $scope.showReceiveStuff = true;

                        }



                        if (detail.item_type == 1) {

                            // total_rec_invice++;

                            var count = $scope.items.length - 1;



                            angular.forEach($rootScope.gl_arr_units, function (obj) {

                                if (obj.id == elem.unit_measure_id)

                                    detail.units = obj;

                            });





                        }

                        $scope.items.push(detail);

                    });

                }



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

                    $scope.show_recieve_list_anchor = true;

                }

                if (rsQtItem.data.total == 0) {

                    $scope.submit_show_invoicee = true;

                    $scope.show_recieve_list_anchor = true;

                }



                // console.log(StillNeedAllocation);



                $scope.itemExists = false;



                angular.forEach($scope.items, function (obj) {

                    if (obj.item_type == 0)

                        $scope.itemExists = true;

                });



                if (StillNeedAllocation > 0)

                    $scope.show_recieve_list = false;



                if (mode > 0)

                    $scope.check_sr_readonly = false;



                $scope.volume = rsQtItem.data.volume;

                $scope.weight = rsQtItem.data.weight;

                $scope.volume_unit = rsQtItem.data.volume_unit;

                $scope.weightunit = rsQtItem.data.weightunit;                    

                $scope.weight_permission = rsQtItem.data.weight_permission; 

                $scope.volume_permission = rsQtItem.data.volume_permission; 



                // if($scope.weight_permission >0 || $scope.volume_permission>0)

                //     $scope.showVolumeWeight = 1;

                if(($scope.weight_permission >0 && $scope.weight && $scope.weight!=0) || ($scope.volume_permission>0 && $scope.volume && $scope.volume!=0))

                        $scope.showVolumeWeight = 1;



                $scope.showLoader = false;



            }).catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

            });

    }



    $scope.checkDuplWHItem = function (param_item, index) {

        if (param_item.item_type == 0) {

            var chk_item = $filter("filter")(param_item.arr_warehouse, { id: param_item.warehouses }, true);

            if (chk_item != undefined && chk_item.length > 0) {

                param_item.warehouse_name = chk_item[0].name;

                param_item.warehouse_name_qty = chk_item[0].name + ' (' + chk_item[0].available_quantity + ')';

            }

            else

                param_item.warehouse_name = "";

        }

    }



    if ($scope.$root.order_status == 'ORDER_COMPLETED')

        $scope.check_order_complete = 0;



    $scope.show_stock = true;

    $scope.show_invoice = true;

    $scope.show_recieve_list_anchor = true;





    $scope.edit_recive_stock = function () {

        $scope.show_recieve_list = false;

        $scope.show_recieve_list_anchor = true;

        $scope.show_recieve_list_anchor_allocate = false;

    }



    $scope.display_same_ware_info_from_order = function (pid, wid) {



        var altcontUrl = $scope.$root.setup + "warehouse/get-stk-allocation-same-info";

        var postViewData = {

            'token': $scope.$root.token,

            'item_id': pid,

            'order_id': $scope.rec.invoice_id,

            'ware_id': wid,

        };

        $http

            .post(altcontUrl, postViewData)

            .then(function (res) {

                if (res.data.ack == true) {



                    $scope.formData.container_no = res.data.response[0].container_no;

                    $scope.formData.batch_no = res.data.response[0].batch_no;

                    //$scope.formData.stock_qty = res.data.response[0].quantity;





                    if (res.data.response[0].prod_date == 0) $scope.formData.prod_date = null;

                    else $scope.formData.prod_date = $scope.$root.convert_unix_date_to_angular(res.data.response[0].prod_date);



                    if (res.data.response[0].use_by_date == 0) $scope.formData.use_by_date = null;

                    else $scope.formData.use_by_date = $scope.$root.convert_unix_date_to_angular(res.data.response[0].use_by_date);



                    if (res.data.response[0].date_received == 0) $scope.formData.date_received = null;

                    else $scope.formData.date_received = $scope.$root.convert_unix_date_to_angular(res.data.response[0].date_received);

                }

            }).catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

            });

    }



    $scope.allocateStock = function (item, rec, index) {



        if (item.units == null) {

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Unit Of Measure']));

            return;

        }



        if (!(item.qty) || parseFloat(item.qty) == 0 || parseFloat(item.qty) == '') {

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Quantity']));

            return;

        }



        if (!(item.warehouses) || item.warehouses == null) {

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Warehouse']));

            return;

        }



        /* if (!(item.standard_price) || item.standard_price == '') {

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Standard Price']));

            return;

        } */



        $scope.formData = {};

        $scope.record = {};

        $scope.columns = [];

        $scope.total_remaing = 0;



        $scope.formData.primary_unit_id = item.primary_unit_of_measure_id;

        $scope.formData.primary_unit_name = item.primary_unit_of_measure_name;

        $scope.formData.primary_unit_qty = 1;



        $scope.formData.unit_of_measure_id = item.units.id;

        $scope.formData.unit_of_measure_name = item.units.name;

        $scope.formData.unit_of_measure_qty = item.units.quantity;



        $scope.formData.min_quantity = item.min_quantity;

        $scope.formData.max_quantity = item.max_quantity;



        $scope.formData.item_qty = item.qty;

        $scope.formData.stock_qty = item.qty;

        // $scope.current_stock = item.prodQty;



        $scope.showLoader = true;



        if ($stateParams.id > 0) {

            // item.order_id = $scope.$root.order_id;

            item.order_id = $stateParams.id;

            $scope.formData.order_id = $stateParams.id;

        }

        else {

            item.order_id = $scope.rec.id;

            $scope.formData.order_id = $scope.rec.id;

        }



        // $scope.formData.product_id = item.id;

        $scope.formData.product_id = item.product_id;

        $scope.formData.product_code = item.product_code;

        $scope.formData.product_name = item.product_name;

        $scope.formData.purchase_status = item.purchase_status;

        // console.log(item);

        $scope.formData.currentStock = item.currentStock;

        $scope.formData.type = 1;

        // $scope.formData.warehouses_id = item.warehouses.id;



        if(item.warehouses){

            $scope.formData.warehouses_id = item.warehouses.id;



            /* angular.forEach(item.arr_warehouse, function (obj) {

                if (obj.id == item.warehouses) {

                    item.warehouse_name = obj.name;

                    item.warehouse_id = obj.id;

                }

            }); */



            $scope.formData.warehouses_name = item.warehouses.name;//item.warehouse_name;



        }

        



        $scope.formData.receiptDate = rec.receiptDate;

        item.orderID = $scope.rec.id;

        item.supplier_id = $scope.rec.supplierID;

        item.invoice_code = $scope.rec.order_code;

        item.invoice_type = $scope.rec.type;

        item.type_id = $scope.rec.type;



        $scope.formData.bl_shipment_no = $scope.rec.comm_book_in_no;

        $scope.formData.order_no = $scope.rec.sell_to_cust_no;

        $scope.formData.order_date = $scope.rec.requested_delivery_date;



        // get warehouse storage locations assigned in item start

        $scope.storage_loc = [];



        // console.log(index);

        $scope.items[index].chk = 2;

        // console.log(item);



        item.order_date = $scope.$root.posting_date;

        item.currency_id = $scope.$root.currency_id.id;



        var rec2 = {};

        rec2.item = item;

        rec2.token = $rootScope.token;

        rec2.itemDataArr = $scope.items;

        $scope.searchKeyword = {};



        if ($scope.check_sr_readonly == false || $scope.check_sr_readonly == undefined) {



            var saveOrderLine = $scope.$root.pr + "srm/srmorderreturn/save-debit-note-line";



            $http

                .post(saveOrderLine, rec2)

                .then(function (res) {

                    $scope.showLoader = false;

                    $scope.selected_wh_locations = [];



                    if (res.data.ack == true) {



                        $scope.stock_item = item;

                        $scope.order_qty = item.qty;

                        $scope.get_srm_order_items();



                        $scope.stockAllocationRecord = res.data.stockAlloc.response;

                        $scope.stockAllocationTotal = res.data.stockAlloc.total;



                        $scope.formData.orderLineID = res.data.orderLineID;

                        item.update_id = res.data.orderLineID;

                        item.invoice_id = $stateParams.id;//res.data.invoice_id;



                        var whID = 0;

                    

                        if(item.warehouses)

                            whID = item.warehouses.id;



                        $scope.getAllocatStock(whID, item.product_id, item.invoice_id, item.update_id, item.item_trace_unique_id,item.invoiceDetailID);

                        $scope.stock_allocate_detail(item.product_id, 0, item.invoice_id, whID, item.update_id);

                        $scope.check_sr_readonly = false;



                        $scope.updateGrandTotal();



                        angular.element('#stockAllocationModal').modal({ show: true });

                    } else

                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(104));

                });

        } else {

            $scope.showLoader = false;



            $scope.stock_item = item;

            $scope.order_qty = item.qty;

            // $scope.check_sr_readonly = false;



            item.invoice_id = $stateParams.id;//res.data.invoice_id;



            var whID = 0;



            if(item.warehouses)

                whID = item.warehouses.id;



            $scope.getAllocatStock(whID, item.product_id, item.invoice_id, item.update_id, item.item_trace_unique_id,item.invoiceDetailID);

            $scope.stock_allocate_detail(item.product_id, 0, item.invoice_id, whID, item.update_id);



            angular.element('#stockAllocationModal').modal({ show: true });

        }

    }



    $scope.stock_item = [];



    $scope.selected_wh_locations = [];

    $scope.all_order_stock = {};

    $scope.remainig_qty = 0;

    $scope.order_qty = 0;



    $scope.OnFocusQty = function (stock_item) {

        stock_item.active_line = true;

    }

    $scope.OnBlurQty = function (stock_item) {

        stock_item.active_line = false;

    }



    $scope.getAllocatStock = function (warehouse_id, item_id, order_id, order_detail_id, item_trace_unique_id,purchaseInvoiceDetailID) {



        $scope.current_stock = 0;



        var getStockUrl = $scope.$root.sales + "warehouse/get-purchase-stock-for-debit-note";



        $http

            .post(getStockUrl, {

                'warehouse_id': warehouse_id,

                'order_detail_id': order_detail_id,

                'supplierID': $scope.rec.supplierID,

                'transitID': item_trace_unique_id,

                'type': 1,

                'item_id': item_id,

                'order_id': order_id,

                'purchaseInvoiceID': $scope.rec.purchaseInvoiceID,

                'purchaseInvoiceDetailID': purchaseInvoiceDetailID,

                'token': $scope.$root.token

            })

            .then(function (res) {

                // console.log(res.data.remaining_stock);

                $scope.all_wh_stock = [];

                

                if (res.data.ack == true) {

                    $scope.all_wh_stock = res.data.response;



                    $scope.current_stock = res.data.currentStock;

                }

            });

    }





    $scope.NavigateOrder = function (rec) {

        $scope.searchKeyword = {};

        $scope.searchKeyword.navigate_search = "";



        $scope.navigate_data = {};



        $scope.navigate_title = 'Debit Note - ' + rec.invoice_code;

        $scope.navigate_type = 4;



        $scope.navigatePostingDate = '';

        $scope.navigatePostingByName = '';



        var navigate_url = $scope.$root.sales + "customer/order/navigate-invoice";

        var postData = {

            'token': $scope.$root.token,

            'type': 4,

            'object_id': rec.id

        };

        $scope.showLoader = true;

        $http

            .post(navigate_url, postData)

            .then(function (res) {

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



    $scope.stock_allocate_detail = function (item_id, show, order_id, warehouse_id, purchase_detail_id) {



        var getAllStockUrl = $scope.$root.sales + "warehouse/get-purchase-order-stock-allocation";





        var order_id = $stateParams.id;



        $http

            .post(getAllStockUrl, {

                'type': 1,

                'item_id': item_id,

                'order_id': order_id,

                'purchase_return': '1',

                'purchase_order_detail_id': purchase_detail_id,

                'wh_id': warehouse_id,

                'token': $scope.$root.token

            })

            .then(function (res) {



                if (res.data.ack == true) {

                    $scope.all_order_stock = [];

                    $scope.all_order_stock = res.data.response;

                    var ordqty = 0;



                    angular.forEach(res.data.response, function (elem) {

                        ordqty = parseFloat(ordqty) + parseFloat(elem.quantity);

                    });



                    if (ordqty > 0)

                        $scope.hide_btn_delete = true;

                    else

                        $scope.hide_btn_delete = false;



                    var remainig_qty = parseFloat($scope.order_qty) - parseFloat(ordqty);

                    // console.log(remainig_qty);

                    // console.log($scope.order_qty);

                    // console.log(ordqty);

                    $scope.stock_item.remainig_qty = remainig_qty;



                    $scope.stock_item.qtyItemAllocated = ordqty;



                    if (show == 3) {

                        angular.forEach($scope.items, function (obj, index) {

                            /* if (obj.id == item_id && (obj.warehouse_id == warehouse_id || obj.warehouses == warehouse_id)) {

                                $scope.items[index].remainig_qty = remainig_qty;

                                $scope.items[index].sale_status = res.data.response[0].sale_status;

                            } */



                            if (obj.update_id == purchase_detail_id) {

                                $scope.items[index].remainig_qty = remainig_qty;

                                $scope.items[index].sale_status = res.data.response[0].sale_status;

                            }

                        });

                    }

                }

                else {

                    $scope.all_order_stock = [];

                    $scope.hide_btn_delete = false;

                    var remainig_qty = $scope.order_qty;

                    // console.log(remainig_qty);                    

                    $scope.stock_item.remainig_qty = remainig_qty;

                    $scope.stock_item.qtyItemAllocated = 0;



                    if (show == 3) {

                        angular.forEach($scope.items, function (obj, index) {

                            /* if (obj.id == item_id && (obj.warehouse_id == warehouse_id || obj.warehouses == warehouse_id)) {

                                $scope.items[index].remainig_qty = $scope.order_qty;

                                $scope.items[index].sale_status = 0;

                            } */



                            if (obj.update_id == purchase_detail_id) {

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



    $scope.disableBtnStock = false;



    $scope.addStockItem = function (stock, stock_item) {



        // console.log(stock);

        // console.log(stock_item);



        $scope.disableBtnStock = true;



        if (parseFloat(stock.req_qty) <= 0 || stock.req_qty == undefined) {

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(238, ['Quantity', '0']));

            $scope.disableBtnStock = false;

            return false;

        }



        if (parseFloat(stock.req_qty) > parseFloat(stock_item.qty)) {

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(359));

            $scope.disableBtnStock = false;

            return false;

        }

        // console.log($scope.remainig_qty);



        if (parseFloat(stock_item.remainig_qty) == 0) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(510));

            $scope.disableBtnStock = false;

            return false;

        }



        if (parseFloat(stock.req_qty) > parseFloat(stock_item.remainig_qty)) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(359));

            $scope.disableBtnStock = false;

            return false;

        }//Number(stock.qty_sold) - Number(stock.qty_returned) - 



        if (parseFloat(stock.req_qty) > (parseFloat(stock.avail_qty) - parseFloat(stock.qty_currently_returned))) {

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(599, [(parseFloat(stock.avail_qty) - parseFloat(stock.qty_currently_returned))]));

            $scope.disableBtnStock = false;

            return false;

        }





        var addStockUrl = $scope.$root.sales + "warehouse/add-purchase-order-stock-allocation";

        stock.token = $scope.$root.token;



        stock.purchase_order_detail_id = stock_item.update_id;

        stock.order_id = $stateParams.id;

        stock.bl_shipment_no = stock.bl_shipment_no;

        // stock.item_id = stock_item.id;

        stock.item_id = stock_item.product_id;

        stock.warehouse_id = stock_item.warehouses.id;

        stock.order_date = $scope.$root.order_date;

        // stock.units = stock_item.units;

        // stock.default_units = stock_item.default_units;



        stock.primary_unit_id = stock_item.primary_unit_of_measure_id;

        stock.primary_unit_name = stock_item.primary_unit_of_measure_name;



        //second aprove  as like in sale order

        stock.type = 1;

        stock.purchase_return_status = 1;

        stock.purchase_status = 1;

        stock.deduction_from_purchase = 1;

        stock.supplier_id = $scope.rec.supplierID;

        // stock.warehouse_id = stock_item.warehouse_id;

        stock.unit_id = stock_item.unit_id;

        stock.unit_of_measure_name = stock_item.unit_of_measure_name;



        if (stock.unit_id == 0 || stock.unit_id == undefined) {

            stock.unit_id = stock_item.units.id;

            stock.unit_of_measure_name = stock_item.units.name;

        }



        stock.supplierCreditNoteDate = $scope.rec.supplierCreditNoteDate;

        stock.unit_parent = stock_item.unit_parent;

        $scope.showLoader = true;



        // console.log(stock);

        // console.log(stock_item);



        $http

            .post(addStockUrl, stock)

            .then(function (res) {



                $scope.disableBtnStock = false;

                $scope.showLoader = false;



                if (res.data.ack == true) {

                    if (stock.id > 0)

                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));

                    else

                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));



                    var whID = 0;



                    if(stock_item.warehouses)

                        whID = stock_item.warehouses.id;



                    $scope.getAllocatStock(whID, stock_item.product_id, stock_item.order_id, stock_item.update_id, stock.item_trace_unique_id,stock_item.invoiceDetailID);

                    $scope.stock_allocate_detail(stock_item.product_id, 3, stock_item.invoice_id, whID, stock_item.update_id);

                }

                else

                    toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(105));

            }).catch(function (message) {

                $scope.showLoader = false;

                $scope.disableBtnStock = false;



                throw new Error(message.data);

            });

    }





    $scope.delStockItem = function (stock, stock_item) {



        $scope.disableBtnStock = true;

        $scope.disableBtnStock = false;

        // console.log(stock);

        // console.log(stock_item);



        stock.active_line = false;



        if (isNaN(stock.req_qty)) {

            stock.req_qty = 0;

            toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(319, ['Quantity', '0']));

            return;

        }



        if (parseFloat(stock.req_qty) <= 0 || stock.req_qty == undefined) {

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(319, ['Quantity', '0']));

            $scope.disableBtnStock = false;

            return false;

        }



        if (parseFloat(stock.req_qty) > parseFloat(stock.qty_currently_returned)) {

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(608, [parseFloat(stock.qty_currently_returned)]));

            $scope.disableBtnStock = false;

            return false;

        }



        var postData = stock;

        // postData.order_id = $scope.$root.order_id;

        postData.order_id = $stateParams.id;

        postData.purchase_order_detail_id = stock_item.update_id;

        postData.ref_po_id = stock.id;



        postData.sale_return_status = 1;

        postData.warehouse_id = stock_item.warehouses.id;

        postData.storage_loc_id = stock.WH_loc_id;

        // postData.orderLineID = stock_item.update_id;



        postData.bl_shipment_no = stock.bl_shipment_no;

        // postData.item_id = stock_item.id;

        postData.item_id = stock_item.product_id;

        postData.order_date = $scope.$root.order_date;



        postData.primary_unit_id = stock_item.primary_unit_of_measure_id;

        postData.primary_unit_name = stock_item.primary_unit_of_measure_name;



        //second aprove  as like in sale order

        postData.type = 1;

        postData.purchase_return_status = 1;

        postData.purchase_status = 1;

        postData.deduction_from_purchase = 1;

        postData.supplier_id = $scope.rec.supplierID;

        // postData.warehouse_id = stock_item.warehouse_id;

        postData.unit_id = stock_item.unit_id;

        postData.unit_of_measure_name = stock_item.unit_of_measure_name;

        postData.unit_parent = stock_item.unit_parent;





        postData.token = $scope.$root.token;



        if (stock.req_qty == stock.qty_currently_returned)

            var delStockUrl = $scope.$root.sales + "warehouse/delete-debit-note-stock";

        else

            var delStockUrl = $scope.$root.sales + "warehouse/deallocate-debit-note-stock";





        $http

            .post(delStockUrl, postData)

            .then(function (res) {



                $scope.disableBtnStock = false;

                $scope.showLoader = false;



                if (res.data.ack == true) {

                    if (stock.id > 0)

                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));

                    else

                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));



                    var whID = 0;

                    

                    if(stock_item.warehouses)

                        whID = stock_item.warehouses.id;



                    $scope.getAllocatStock(whID, stock_item.product_id, stock_item.order_id, stock_item.update_id, stock.item_trace_unique_id,stock_item.invoiceDetailID);

                    $scope.stock_allocate_detail(stock_item.product_id, 3, stock_item.invoice_id, whID, stock_item.update_id);

                }

                else

                    toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(105));

            }).catch(function (message) {

                $scope.showLoader = false;

                $scope.disableBtnStock = false;



                throw new Error(message.data);

            });

    }





    /* $scope.delStockItem = function (stock, stock_item) {

        stock.active_line = false;



        if (isNaN(stock.req_qty)) {

            stock.req_qty = 0;

            toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(319, ['Quantity','0']));

            return;

        }



        if (parseFloat(stock.req_qty) <= 0 || stock.req_qty == undefined) {

            toaster.pop('error', 'Info', "Quantity must be greater than zero!");

            return false;

        }





        if (parseFloat(stock.req_qty) > parseFloat(stock.qty_currently_returned)) {

            toaster.pop('error', 'Edit', 'Quantity limit is exceeding order quantity ');

            return;

        }

        // console.log(stock);

        // console.log(stock_item);



        var postData = stock;

        // postData.order_id = $scope.$root.order_id;

        postData.order_id = stock_item.orderID;

        postData.supplier_id = stock_item.supplier_id;

        //  postData.order_id = stock_item.orderID;

        // postData.order_id = stock_item.orderID;

        // postData.order_id = stock_item.orderID; 

        postData.token = $scope.$root.token;

        postData.sale_return_status = 1;

        postData.WH_loc_id = stock.location;

        postData.storage_loc_id = stock.WH_loc_id;

        postData.orderLineID = stock_item.update_id;



        postData.targeted_warehouse_id = stock_item.warehouses;

        postData.targeted_warehouse_id = stock_item.warehouses;



        if (stock.req_qty == stock.qty_currently_returned)

            var delStockUrl = $scope.$root.sales + "warehouse/delete-debit-note-stock";

        else

            var delStockUrl = $scope.$root.sales + "warehouse/deallocate-debit-note-stock";



        $http

            .post(delStockUrl, { 'token': $scope.$root.token, postData })

            .then(function (res) {

                if (res.data.ack == true) {

                    stock.active_line = true;

                    stock.qty_currently_returned = parseFloat(stock.qty_currently_returned) - parseFloat(stock.req_qty);

                    stock.avail_qty = parseFloat(stock.avail_qty) - parseFloat(stock.req_qty);

                    stock_item.allocated_stock = parseFloat(stock_item.allocated_stock) - parseFloat(stock.req_qty);

                    stock.req_qty = '';



                    // $scope.stock_allocate_detail(stock.product_id, 3, stock_item.warehouses, stock_item.update_id);//stock.warehouse_id);

                    $scope.stock_allocate_detail(stock_item.id, 3, stock_item.invoice_id, stock_item.warehouses, stock_item.update_id);

                }

            });

    } */



    $scope.UpdateQty = function (item) {



        // console.log(item);



        if (item.item_type == 0 && parseFloat(item.qty) < 0 && item.stock_check>0) {

            item.remainig_qty = 0;

        }

        else if (item.item_type == 0 && item.qty != item.qtyItemAllocated && item.stock_check>0) {

            if (item.qty < item.qtyItemAllocated) {

                toaster.pop('warning', 'Info', String(item.qtyItemAllocated) + ' quantity is already allocated!');

                item.qty = item.qtyItemAllocated;

            }



            if (item.qty == item.qtyItemAllocated)

                item.remainig_qty = 0;

            else

                item.remainig_qty = parseFloat(item.qty) - parseFloat(item.qtyItemAllocated);

        }

        else if (item.item_type == 0 && item.qty == item.qtyItemAllocated && item.stock_check>0)

            item.remainig_qty = 0;

    }



    //second aprove  as like in sale order



    $scope.get_warehouse_list = function () {

        $scope.clear_form();

        var postUrl = $scope.$root.setup + "warehouse/stk-allocation";

        $http

            .post(postUrl, {

                'token': $scope.$root.token,

                'product_id': $scope.formData.product_id,

                'order_id': $scope.rec.invoice_id,

                'warehouses_id': $scope.formData.warehouses_id,

                'type_id': $scope.formData.type,

                'purchase_return_status': 1

            })

            .then(function (res) {



                $scope.record = {};

                $scope.columns = [];



                $scope.record = res.data.response;



                if (res.data.total == null)

                    $scope.total_remaing = $scope.formData.item_qty;

                else {

                    //$scope.total_remaing = (parseFloat($scope.formData.item_qty)) - (parseFloat(res.data.total)) ;

                    $scope.formData.item_qty = res.data.total;

                    $scope.total_remaing = (parseFloat(res.data.total)) - parseFloat(res.data.total_pr);



                    if ($scope.total_remaing < 0) $scope.total_remaing = 0;

                    //$scope.formData.stock_qty =$scope.total_remaing ;

                }



                angular.forEach(res.data.response[0], function (val, index) {

                    $scope.columns.push({

                        'title': toTitleCase(index),

                        'field': index,

                        'visible': true

                    });

                });



            }).catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

            });

    }



    $scope.clear_form = function (formData) {

        $scope.formData.id = '';

        $scope.formData.container_no = '';

        $scope.formData.batch_no = '';

        $scope.formData.prod_date = '';

        $scope.formData.date_received = '';

        $scope.formData.use_by_date = '';

        $scope.formData.stock_qty = '';

    }



    $scope.add_warehouse = function (formData) {



        if (parseFloat($scope.formData.stock_qty <= 0)) {

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(360, ['Quantity ', '0']));

            return;

        }



        if (parseInt($scope.formData.stock_qty) > parseInt($scope.total_remaing)) {

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(572));

            return;

        }

        formData.purchase_return_status = 1;

        //  formData.item_id =formData.item_id ;

        formData.purchase_status = 2;

        formData.deduction_from_purchase = 1;

        formData.token = $scope.$root.token;

        formData.supplier_id = $scope.rec.supplierID;



        var addcrmUrl = $scope.$root.setup + "warehouse/add-stk-allocation";



        if (formData.id != undefined)

            var addcrmUrl = $scope.$root.setup + "warehouse/update-stk-allocation";



        //	console.log($scope.formData);return;

        $http

            .post(addcrmUrl, formData)

            .then(function (res) {

                if (res.data.ack == 1) {

                    $scope.get_warehouse_list();

                    $scope.clear_form();



                    if (formData.id > 0)

                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));

                    else

                        toaster.pop('success', 'Add', 'Record  Inserted  .');

                }

                else {

                    if (formData.id > 0)

                        toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(105));

                    else

                        toaster.pop('error', 'Error', res.data.error);

                }

            }).catch(function (message) {

                $scope.showLoader = false;



                throw new Error(message.data);

            });

    }



    $scope.edit_ware = function (id) {



        var altcontUrl = $scope.$root.setup + "warehouse/get-stk-allocation";

        var postViewData = {

            'token': $scope.$root.token,

            'id': id

        };

        $http

            .post(altcontUrl, postViewData)

            .then(function (res) {

                // $scope.formData = res.data.response;

                $scope.formData.id = res.data.response.id;

                $scope.formData.container_no = res.data.response.container_no;

                $scope.formData.batch_no = res.data.response.batch_no;

                $scope.formData.stock_qty = res.data.response.quantity;





                if ($scope.total_remaing == null)

                    $scope.total_remaing = res.data.response.quantity;

                else {

                    $scope.total_remaing = (parseFloat(res.data.response.quantity)) - parseFloat($scope.total_remaing);

                    if ($scope.total_remaing < 0)

                        $scope.total_remaing = 0;

                }



                if (res.data.response.prod_date == 0)

                    $scope.formData.prod_date = null;

                else

                    $scope.formData.prod_date = $scope.$root.convert_unix_date_to_angular(res.data.response.prod_date);



                if (res.data.response.use_by_date == 0)

                    $scope.formData.use_by_date = null;

                else

                    $scope.formData.use_by_date = $scope.$root.convert_unix_date_to_angular(res.data.response.use_by_date);



                if (res.data.response.date_received == 0)

                    $scope.formData.date_received = null;

                else

                    $scope.formData.date_received = $scope.$root.convert_unix_date_to_angular(res.data.response.date_received);



            });

    }



    $scope.delete_ware = function (id, index, arr_data) {

        var delUrl = $scope.$root.setup + "warehouse/delete-stk-allocation";



        ngDialog.openConfirm({

            template: 'modalDeleteDialogId',

            className: 'ngdialog-theme-default-custom'

        }).then(function (value) {

            $http

                .post(delUrl, { id: id, 'token': $scope.$root.token })

                .then(function (res) {

                    if (res.data.ack == true) {

                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));

                        arr_data.splice(index, 1);

                        $scope.get_warehouse_list();

                    }

                    else {

                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));

                    }

                }).catch(function (message) {

                    $scope.showLoader = false;



                    throw new Error(message.data);

                });

        }, function (reason) {

            console.log('Modal promise rejected. Reason: ', reason);

        });

    }





    $scope.dsptch = {};

    $scope.disableReceiveBtn = false;



    $scope.allocation_saved = function (rec, rec2) {



        if (rec2 == undefined)

            var rec2 = {};



        $scope.netTotalAmount = $scope.netTotal();

        $scope.grand_totalAmount = $scope.grandTotal();

        $scope.disableReceiveBtn = true;

        $scope.showLoader = true;



        if (parseFloat($scope.netTotalAmount) < 0 || parseFloat($scope.grand_totalAmount) < 0) {

            $scope.disableReceiveBtn = false;

            $scope.showLoader = false;

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(585));

            return false;

        }



        var uomFlag = 0; // check for unit of measure

        var stockCheckConfirm = 0;

        $scope.supplierLocMandatory = 0;



        angular.forEach($scope.items, function (obj) {



            if (isNaN(parseFloat(obj.remainig_qty))) {

                obj.remainig_qty = obj.qty;

            }



            if (obj.item_type == 0)

                $scope.supplierLocMandatory = 1;



            if (obj.stock_check > 0 && (parseFloat(obj.remainig_qty) > 0 || (obj.remainig_qty == undefined && parseFloat(obj.qty) > 0))) {

                $scope.disableReceiveBtn = false;

                $scope.showLoader = false;

                toaster.pop('error', 'Error', 'Stock Deallocation is Required for ' + obj.product_name);

                stockCheckConfirm++;

                return false;

            }



            /* if (obj.rawMaterialProduct > 0) {



                if (!obj.raw_material_gl_code || !obj.raw_material_gl_name || !(obj.raw_material_gl_id>0) ) {

                    $scope.disableReceiveBtn = false;

                    $scope.showLoader = false;

                    toaster.pop('error', 'Error', obj.product_name + ' raw material G/L is not setup!');

                    stockCheckConfirm++;

                    return false;

                }

            } */



            /* if (obj.item_type == "0" && obj.stock_check == "1" && (obj.remainig_qty == undefined || obj.remainig_qty > 0 || isNaN(obj.remainig_qty)))

                valid = 0; */



            if (!(obj.stock_check > 0)) {

                // console.log(obj);



                // if (!(obj.standard_price > 0)) {

                if (obj.standard_price == '') {

                    $scope.disableReceiveBtn = false;

                    $scope.showLoader = false;

                    toaster.pop('warning', 'Info', obj.product_name + ' Price is empty!');

                    // stockCheckConfirm++;

                    // return false;

                }

            }



            if (obj.qty<0) {

                $scope.disableReceiveBtn = false;

                $scope.showLoader = false;

                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(658, [obj.product_name]));

                stockCheckConfirm++;

                return false;

            }



            if (!(obj.qty > 0) && !(obj.qty<0)) {

                $scope.disableReceiveBtn = false;

                $scope.showLoader = false;

                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(593, [obj.product_name]));

                stockCheckConfirm++;

                return false;

            }







            if (obj.units != undefined && obj.item_type == 0) {

                if (!(obj.units.id > 0)) {

                    $scope.disableReceiveBtn = false;

                    $scope.showLoader = false;

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Unit Of Measure']));

                    uomFlag++;

                    return false;

                }

            }

            else if (obj.units == undefined && obj.item_type == 0) {

                $scope.disableReceiveBtn = false;

                $scope.showLoader = false;

                toaster.pop('error', 'Info', 'Unit Of Measure is required for' + obj.product_name);

                uomFlag++;

                return false;

            }



            /* if ((obj.standard_price == 0 || obj.standard_price == '') && obj.item_type) {

                $scope.disableReceiveBtn = false;

                $scope.showLoader = false;



                if (obj.item_type > 0)

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(605, [obj.product_name]));

                else

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(606, [obj.product_name]));



                uomFlag++;

                return false;

            } */

        });



        if (stockCheckConfirm > 0) {

            $scope.showLoader = false;

            // toaster.pop("error", "Error", "Please allocate all the stock before dispatch!");

            $scope.disableReceiveBtn = false;

            return false;

        }



        if (uomFlag > 0) {

            $scope.disableReceiveBtn = false;

            $scope.showLoader = false;

            return false;

        }



        if ($scope.supplierLocMandatory == 1 && $scope.rec.shipToSupplierLocName != undefined) {



            if (!($scope.rec.shipToSupplierLocName.length > 0)) {

                $scope.disableReceiveBtn = false;

                $scope.showLoader = false;

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(560));

                return false;

            }

        }

        else if ($scope.supplierLocMandatory == 1 && $scope.rec.shipToSupplierLocName == undefined) {

            $scope.disableReceiveBtn = false;

            $scope.showLoader = false;

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(560));

            return false;

        }



        /* if (!valid) {

            toaster.pop("error", "Error", "Please allocate all the stock before dispatch!");

            return;

        } */



        // $scope.showLoader = true;

        // $scope.add_sublist(rec, rec2)

        $scope.add_general(rec, rec2)

            .then(function () {



                $scope.saveSublistBeforePosting(rec, rec2, 1).then(function () {



                    $scope.showLoader = false;

                    var dispStockUrl = $scope.$root.sales + "warehouse/dispatch-debit-note-stock";

                    $rootScope.credit_note_receive_stock_msg = "Are you sure you want to dispatch the Debit note stock?";



                    ngDialog.openConfirm({

                        template: '_confirm_credit_note_receive',

                        className: 'ngdialog-theme-default-custom'

                    }).then(function (value) {

                        $scope.dsptch.token = $scope.$root.token;

                        $scope.dsptch.order_id = $stateParams.id;

                        $scope.dsptch.purchaseInvoiceID = $scope.rec.purchaseInvoiceID;



                        $scope.showLoader = true;

                        $http

                            .post(dispStockUrl, $scope.dsptch)

                            .then(function (res) {



                                if (res.data.ack == true) {

                                    $scope.hide_dispatch_btn = true;

                                    // $scope.$parent.check_so_readonly = true;

                                    $scope.check_sr_readonly = true;

                                    $scope.get_srm_order_items();

                                    $scope.showLoader = false;

                                    toaster.pop("success", "Info", "Stock has dispatched!");

                                }

                                else if (res.data.ack == 2) {

                                    $scope.disableReceiveBtn = false;

                                    $scope.showLoader = false;

                                    toaster.pop('error', 'Info', res.data.error);

                                    return 0;

                                }

                                else {

                                    $scope.disableReceiveBtn = false;

                                    $scope.showLoader = false;

                                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(586));

                                    return 0;

                                }

                            });

                    }, function (reason) {

                        $scope.showLoader = false;

                        $scope.disableReceiveBtn = false;

                        console.log('Modal promise rejected. Reason: ', reason);

                    });

                });





            }).catch(function (message) {

                $scope.showLoader = false;

                $scope.disableReceiveBtn = false;

                toaster.pop('error', 'info', message);

                throw new Error(message);

            });

    }



    $scope.list_post_invoice = true;





    $scope.delete_sub = function (index, update_id, items) {



        var del_sub_exp = $scope.$root.pr + "srm/srmorderreturn/delete-srm-order-item";

        if (update_id == undefined)

            $scope.items.splice(index, 1);

        else {

            ngDialog.openConfirm({

                template: 'modalDeleteDialogId',

                className: 'ngdialog-theme-default-custom'

            }).then(function (value) {

                $http

                    .post(del_sub_exp, { id: update_id, 'table': 'srm_order_return_detail', 'token': $scope.$root.token })

                    .then(function (res) {

                        if (res.data.ack == true) {

                            items.splice(index);



                            toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));

                        }

                        else toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(108));

                    })

                    .catch(function (message) {

                        $scope.showLoader = false;



                        throw new Error(message.data);

                    });

            }, function (reason) {

                console.log('Modal promise rejected. Reason: ', reason);

            });

        }

    }



    $scope.rowDiscountmodal = function (item) {

        var total = 0;



        if (item.qty > 0)

            total = parseFloat(item.qty) * parseFloat(item.unit_price);

        else

            total = parseFloat(item.unit_price);



        var discount = 0;



        if (item.discount_type != undefined && item.discount > 0) {

            if (item.discount_type == 'Percentage')

                discount = parseFloat(total) * parseFloat(item.discount) / 100;

            else if (item.discount_type == 'Value')

                discount = item.discount;

            else

                discount = parseFloat(item.discount) * parseFloat(item.qty);

        }

        return discount;

    }



    $scope.rowTotalModal = function (item) {



        var total = 0;



        if (item.item_type != 1) {



            if (item.units != undefined)

                total = item.qty * parseFloat(item.unit_price);

            else

                total = item.qty * parseFloat(item.unit_price);



        } else {

            if (item.qty > 0)

                total = item.qty * parseFloat(item.unit_price);

            else

                total = parseFloat(item.unit_price);

        }



        if (item.discount_type != undefined && item.discount > 0) {

            if (item.discount_type == 'Percentage')

                total = parseFloat(total) - (parseFloat(total) * item.discount / 100);

            else if (item.discount_type == 'Value')

                total = parseFloat(total) - item.discount;

            else

                total = parseFloat(total) - (item.discount * item.qty);

        }

        return total;

    }



    $scope.rowTotal = function (item) {



        var total = 0;



        if (item.item_type != 1) {



            if (item.units != undefined)

                total = item.qty * parseFloat(item.standard_price);

            else

                total = item.qty * parseFloat(item.standard_price);



        } else {

            if (item.qty > 0)

                total = item.qty * parseFloat(item.standard_price);

            else

                total = parseFloat(item.standard_price);

        }



        if (item.discount_type_id != undefined && item.discount > 0) {

            if (item.discount_type_id.id == 'Percentage')

                total = parseFloat(total) - (parseFloat(total) * item.discount / 100);

            else if (item.discount_type_id.id == 'Value')

                total = parseFloat(total) - item.discount;

            else

                total = parseFloat(total) - (parseFloat(item.discount) * parseFloat(item.qty));

            /* else

                total = parseFloat(total) - (item.discount * item.qty); */

            /* else

                total = parseFloat(total) - parseFloat(item.discount); */

        }

        if (item.isGLVat == true) {

            total = 0;

        }

        return total;

    }



    $scope.rowDiscount = function (item) {

        var total = 0;



        if (item.qty > 0)

            total = parseFloat(item.qty) * parseFloat(item.standard_price);

        else

            total = parseFloat(item.standard_price);



        var discount = 0;

        if (item.discount_type_id != undefined && item.discount > 0) {

            if (item.discount_type_id.id == 'Percentage')

                discount = parseFloat(total) * parseFloat(item.discount) / 100;

            else if (item.discount_type_id.id == 'Value')

                discount = item.discount;

            else

                discount = parseFloat(item.discount) * parseFloat(item.qty);

        }

        item.discount_price = discount;

        $rootScope.discountedAmountDebitNote = discount;



        if (item.isGLVat == true) {

            total = 0;

        }

        return discount;

    }



    $scope.rowVat = function (item) {

        var arrVat = [];

        var total = 0;

        var rowVat = 0;



        if (item.qty > 0)

            total = parseFloat(parseFloat(item.qty) * parseFloat(item.standard_price)).toFixed(3);

        else

            total = parseFloat(item.standard_price).toFixed(3);



        if (item.isGLVat == true) {

            var price = total;

            if (arrVat[vat_value] != undefined && arrVat[vat_value].length > 0)

                arrVat[vat_value] = arrVat[vat_value] + price;

            else if (vat_value > 0)

                arrVat[vat_value] = price;

            else

                arrVat[vat_value] = price;



            rowVat = arrVat[vat_value];//.toFixed(2)

        }



        if (item.vats != undefined && item.vats.vat_value > 0) {





            /* var total = 0;

            if (item.qty > 0)

                total = parseFloat(item.qty) * parseFloat(item.standard_price);

            else

                total = parseFloat(item.standard_price); */



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



            // rowVat = parseFloat((vat_value / 100) * arrVat[vat_value]).toFixed(2);

            rowVat = parseFloat((vat_value * arrVat[vat_value]) / 100).toFixed(2);// For 5 digit decimals case

        }



        if (isNaN(rowVat)) {

            item.vat_price = 0;

            return 0;

        }

        else

            item.vat_price = rowVat;



        return rowVat;

    }



    $scope.netTotal = function () {

        // var total = 0;

        var netTotal = 0;

        var s_total = 0;

        var items_net_total = 0;



        angular.forEach($scope.items, function (item) {



            var total = 0;



            var unitPrice = (item.standard_price != undefined && item.standard_price != '' && isNaN(item.standard_price) == false) ? item.standard_price : 0;



            if (item.item_type != 1) {



                if (item.units != undefined && (unitPrice == null || item.qty == null))

                    total = parseFloat(item.qty) * parseFloat(unitPrice);

                else

                    total = parseFloat(item.qty) * parseFloat(unitPrice);



            } else if (item.isGLVat == false) {

                if (item.qty > 0 && unitPrice == null)

                    total = 0;

                else if (item.qty > 0)

                    total = (item.qty) * parseFloat(unitPrice);

                else

                    total = parseFloat(unitPrice);

            }/* else {

                if (item.qty > 0)

                    total = (item.qty) * parseFloat(item.standard_price);

                else

                    total = parseFloat(item.standard_price);

            } */



            if (item.item_type == 0)

                items_net_total += parseFloat(total);



            //total += parseFloat(subtotal);



            if (item.discount_type_id != undefined && item.discount > 0) {



                if (item.discount_type_id.id == 'Percentage')

                    total = parseFloat(total) - (parseFloat(total) * item.discount / 100);

                else if (item.discount_type_id.id == 'Value')

                    total = parseFloat(total) - item.discount;

                else

                    total = parseFloat(total) - (parseFloat(item.discount) * parseFloat(item.qty));

                /* else

                    total = parseFloat(total) - (item.discount * item.qty); */

            }



            if (total > 0)

                s_total = s_total + total;



            // console.log(total);

            // console.log(netTotal);

            netTotal += parseFloat(total);

        });



        // $scope.rec.items_net_total = Number(items_net_total).toFixed(2); // items_net_total;

        // $rootScope.netValuedebitNote = Number(netTotal).toFixed(2); // netTotal;



        $scope.rec.items_net_total = items_net_total;

        $rootScope.netValuedebitNote = netTotal;

        



        // return (Number(netTotal).toFixed(2));

        return (Number(netTotal).toFixed(2));

        // return netTotal;

    }



    $scope.calcVat = function () {

        var arrVat = [];

        var arrTotalVat = [];

        var TotalVat = 0;

        var TotalItemVat = 0;

        var total = 0;



        if ($scope.items.length > 0) {

            angular.forEach($scope.items, function (item) {



                var unitPrice = (item.standard_price != undefined && item.standard_price != '' && isNaN(item.standard_price) == false) ? item.standard_price : 0;



                if (item.qty > 0)

                    var subtotal = parseFloat(item.qty) * parseFloat(unitPrice);

                else

                    var subtotal = parseFloat(unitPrice);



                if (isNaN(subtotal))

                    subtotal = 0;



                var total = 0;

                // total += Number(subtotal);

                // total += parseFloat(subtotal);

                total += parseFloat(parseFloat(subtotal).toFixed(2));



                if (item.discount_type_id != undefined && item.discount > 0) {



                    if (item.discount_type_id.id == 'Percentage')

                        total = parseFloat(total) - (parseFloat(total) * item.discount / 100);

                    else if (item.discount_type_id.id == 'Value')

                        total = parseFloat(total) - item.discount;

                    else

                        total = parseFloat(total) - (parseFloat(item.discount) * parseFloat(item.qty));

                    /* else

                        total = parseFloat(total) - (item.discount * item.qty); */

                }



                var price = total;



                if (item.isGLVat == true) {



                    if (arrVat[vat_value] != undefined && arrVat[vat_value].length > 0)

                        arrVat[vat_value] = arrVat[vat_value] + price;

                    else if (vat_value > 0)

                        arrVat[vat_value] = price;

                    else

                        arrVat[vat_value] = price;



                    if (item.ref_prod_id > 0)

                        TotalVat = TotalVat - parseFloat(arrVat[vat_value]);//.toFixed(2))

                    else

                        TotalVat = TotalVat + parseFloat(arrVat[vat_value]);//.toFixed(2))





                    if (item.item_type == 0)

                        TotalItemVat += parseFloat((vat_value / 100) * arrVat[vat_value]);//.toFixed(2))



                    //arrTotalVat[vat_value] = Math.round(arrVat[vat_value] * (vat_value/ 100 )).toFixed(2);

                }





                if (item.vats != undefined && item.vats.vat_value > 0) {



                    var vat_value = item.vats.vat_value;



                    if (arrVat[vat_value] != undefined && arrVat[vat_value].length > 0)

                        arrVat[vat_value] = arrVat[vat_value] + price;

                    else if

                        (vat_value > 0) arrVat[vat_value] = price;



                    /* TotalVat += parseFloat(((vat_value / 100) * arrVat[vat_value]).toFixed(2));



                    if (item.item_type == 0)

                        TotalItemVat += parseFloat(((vat_value / 100) * arrVat[vat_value]).toFixed(2)); */



                    var itemVatVal2 = parseFloat((vat_value * arrVat[vat_value])/ 100).toFixed(2);



                    TotalVat += parseFloat(itemVatVal2);



                    if (item.item_type == 0)

                        TotalItemVat += parseFloat(itemVatVal2);

                }

            });

        }



        // $scope.rec.items_net_vat = Number(TotalItemVat).toFixed(2); // TotalItemVat;

        // $rootScope.vatValueDebitNote = Number(TotalVat).toFixed(2); //TotalVat;





        $scope.rec.items_net_vat = TotalItemVat;

        $rootScope.vatValueDebitNote = TotalVat;



        return (Number(TotalVat).toFixed(2));

        // return TotalVat;

    }



    $scope.calcDiscount = function () {

        var TotalDiscount = 0;

        var ItemsDiscount = 0;

        var total = 0;



        if ($scope.items.length > 0) {

            angular.forEach($scope.items, function (item) {



                var unitPrice = (item.standard_price != undefined && item.standard_price != '' && isNaN(item.standard_price) == false) ? item.standard_price : 0;



                if (item.discount_type_id != undefined && item.discount > 0) {

                    // console.log(item);

                    // var subtotal = item.qty * item.standard_price;

                    var subtotal = item.qty * unitPrice;



                    var total = parseFloat(subtotal);



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

                            total = (parseFloat(item.discount) * parseFloat(item.qty));//item.discount * item.qty;



                        if (item.item_type == 0)

                            ItemsDiscount += parseFloat(total);



                        TotalDiscount += parseFloat(total);

                    }

                }

            });

            // console.log(TotalDiscount);

        }

        // return ($scope.grand_total - TotalDiscount);



        TotalDiscount = (Number(TotalDiscount).toFixed(2));

        $scope.rec.items_net_discount = ItemsDiscount;//.toFixed(4);

        $scope.rec.total_discount = TotalDiscount;//.toFixed(4);

        $rootScope.discountedDebitNote = TotalDiscount;//.toFixed(4);

        return TotalDiscount;//.toFixed(4)

    }



    $scope.onChangeDiscountType = function (item) {



        var unitPrice = (item.standard_price != undefined && item.standard_price != '' && isNaN(item.standard_price) == false) ? item.standard_price : 0;



        if (item.discount != '') {

            if (isNaN(item.discount))

                item.discount = 0;

        }



        /* if (item.discount_type_id != undefined) {



            if (item.discount_type_id.id == 'None')

                item.discount = '';

            else if (item.discount_type_id.id == 'Percentage') {

                if (item.discount != '' && parseFloat(item.discount) > 100) {

                    item.discount = item.discount.slice(0, -1);

                    toaster.pop('error', 'Error', 'Maximum percentage can not be greater than 100');

                }

            }

        } */



        if (item.discount_type_id != undefined) {



            var actualPrice = parseFloat(item.qty) * parseFloat(unitPrice);



            if (item.discount_type_id.id == 'None')

                item.discount = '';

            else if (item.discount_type_id.id == 'Percentage') {

                if (item.discount != '' && actualPrice > 0 && parseFloat(item.discount) > 100) {

                    item.discount = '';

                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(515));

                }

            }

            else if (item.discount_type_id.id == 'Value') {



                if (item.discount != '' && actualPrice > 0 && parseFloat(item.discount) > actualPrice) {

                    // console.log('item.discount : ', item.discount);                        

                    item.discount = '';

                    toaster.pop('error', 'Error', 'Maximum Value can not be greater than Original Amount!');

                }

            }

            else if (item.discount_type_id.id == 'Unit') {



                if (item.qty != '') {

                    if (item.discount != '' && (parseFloat(item.discount) * parseFloat(item.qty)) > actualPrice) {

                        item.discount = '';

                        toaster.pop('error', 'Error', 'Maximum Unit can not be greater than by total!');

                    }

                }

            }

        }

    }



    $scope.grandTotal = function () {

        // return ($scope.netTotal() + $scope.calcVat());

        // $scope.rec.grand_total = $scope.netTotal() + $scope.calcVat();



        var netTotal = Number($scope.netTotal());//$scope.netTotal();

        var calcVat = Number($scope.calcVat()); //$scope.calcVat();



        // $scope.rec.grand_total = +(Number(netTotal).toFixed(2)) + +(Number(calcVat).toFixed(2));

        $scope.rec.grand_total = Number(+(netTotal) + +(calcVat)).toFixed(2);



        // console.log($scope.rec.grand_total);

        $rootScope.grandTotalDebitNote = $scope.rec.grand_total;

        return $scope.rec.grand_total;

    }



    $scope.openEmailer = function (val) {

        setTimeout(function () {

            document.getElementById(val).click();

        }, 0)

    }



    function sumArray(arrayName) {

        arrayName = arrayName.reduce(function (a, b) {

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



    $scope.showInvoiceModal = function (templateType, noModal) {



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

        // console.log('inside function');

        $scope.showLoader = true;

        $scope.print_invoice_vals = {};

        var prntInvoiceUrl = $scope.$root.sales + "customer/order/print-invoice";



        $rootScope.printinvoiceFlag = false;

        $http

            .post(prntInvoiceUrl, {

                id: $scope.rec.update_id,

                'type': '3',

                'templateType': templateType,

                token: $scope.$root.token

            })

            .then(function (res) {

                if (res.data.ack == true) {

                    $scope.print_invoice_vals = res.data.response;

                    $scope.print_invoice_vals.debitDiscount = $rootScope.discountedDebitNote;

                    $scope.print_invoice_vals.debitVat = $rootScope.vatValueDebitNote;

                    $scope.print_invoice_vals.netValue = $rootScope.netValuedebitNote

                    $scope.print_invoice_vals.grandTotalDebit = $rootScope.grandTotalDebitNote;

                    $scope.print_invoice_vals.discountedAmountDebitNote = $rootScope.discountedAmountDebitNote;

                    $scope.print_invoice_vals.filename = $rootScope.filename;

                    $scope.print_invoice_vals.templateType = templateType;

                    $scope.print_invoice_vals.itemExists = $scope.itemExists;





                    // console.log($scope.print_invoice_vals);

                    // console.log($scope.print_invoice_vals.doc_details_arr);



                    /* $scope.showShipFrom = 0;



                    angular.forEach($scope.print_invoice_vals.doc_details_arr, function (obj) {



                        if (obj.type == 0)

                            $scope.showShipFrom = 1;

                    }); */



                    $scope.print_invoice_vals.volume_total = new Array();

                    $scope.print_invoice_vals.weight_total = new Array();                        



                    angular.forEach($scope.print_invoice_vals.doc_details_arr, function (obj1, index1) {                           



                        var idx2 = findObjectByKey($scope.print_invoice_vals.volume_total, 'volume_unit', obj1.volumeUnit);

                        if (idx2 == null) {

                            $scope.print_invoice_vals.volume_total.push({ 'volume_unit': obj1.volumeUnit, 'total_qty': 0 });

                            $scope.print_invoice_vals.volume_total[findObjectByKey($scope.print_invoice_vals.volume_total, 'volume_unit', obj1.volumeUnit)].total_qty += Number(obj1.volume);

                        }

                        else

                            $scope.print_invoice_vals.volume_total[idx2].total_qty += Number(obj1.volume);



                        var idx3 = findObjectByKey($scope.print_invoice_vals.weight_total, 'weightunit', obj1.weightUnit2);

                        if (idx3 == null) {

                            $scope.print_invoice_vals.weight_total.push({ 'weightunit': obj1.weightUnit2, 'total_qty': 0 });

                            $scope.print_invoice_vals.weight_total[findObjectByKey($scope.print_invoice_vals.weight_total, 'weightunit', obj1.weightUnit2)].total_qty += Number(obj1.weight);

                        }

                        else

                            $scope.print_invoice_vals.weight_total[idx3].total_qty += Number(obj1.weight);

                        

                    });



                    var invoicePdfModal = ModalService.showModal({

                        templateUrl: 'app/views/invoice_templates/debit_note_modal.html',

                        controller: 'debitNoteModalController',

                        inputs: {

                            print_invoice_vals: $scope.print_invoice_vals,

                            noModal: noModal,

                            openEmailer: $scope.openEmailer

                        }

                    });

                    invoicePdfModal.then(function (res) {

                        res.element.modal();

                        if (noModal) {

                            res.element.modal("hide");

                        }

                        $scope.showLoader = false;

                        if (noModal) {

                            generatePdf.showLoader = true;

                            $timeout(function () {

                                generatePdf.generatePdf($scope.print_invoice_vals.templateType, $scope.print_invoice_vals, '', noModal);

                            }, 200)

                        }

                        console.log('Returned results: ', res);

                        console.log("Modal succesfully closed!");

                    });

                }

                else {

                    $scope.showLoader = false;

                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(511));

                }

            });



    }

}



debitNoteModalController.$inject = ["$scope", "$http", "print_invoice_vals", "toaster", "openEmailer", "noModal", "$rootScope", "serviceVariables", "fileAuthentication", "generatePdf"]

myApp.controller('debitNoteModalController', debitNoteModalController);

function debitNoteModalController($scope, $http, print_invoice_vals, toaster, openEmailer, noModal, $rootScope, serviceVariables, fileAuthentication, generatePdf) {



    $scope.print_invoice_vals = print_invoice_vals;

    $scope.openEmailer = openEmailer;

    $scope.noModal = noModal;

    $scope.fileAuthentication = fileAuthentication;



    $scope.generatePDFandDownload = function (templateType, invoiceVals, x) {

        generatePdf.showLoader = true;

        generatePdf.generatePdf(templateType, invoiceVals, x);

    }



    $scope.generateJSReportPDF = function (templateType, invoiceVals, x) {

        generatePdf.showLoader = true;

        generatePdf.genJSReport(templateType, invoiceVals, x);

    }



    $scope.destroyPdfModal = function (modalName) {

        angular.element(document.querySelector("#" + modalName)).remove();

    }





    // $scope.generatePdf = function () {

    //     var targetPdf = angular.element('#debit_note_modal')[0].innerHTML;

    //     var pdfInvoice = $scope.$root.setup + "general/print-pdf-invoice";

    //     if ($scope.print_invoice_vals.templateType == "debit") {

    //         var fileName = "DN." + $scope.print_invoice_vals.order_no + "." + $scope.print_invoice_vals.company_id;

    //     } else {

    //         var fileName = "PDN." + $scope.print_invoice_vals.invoice_no + "." + $scope.print_invoice_vals.company_id;

    //     }



    //     $http

    //         .post(pdfInvoice, { 'dataPdf': targetPdf, 'type': 3, 'filename': fileName, token: $scope.$root.token, 'doc_id': $scope.print_invoice_vals.doc_id, attachmentsType: 4 })

    //         .then(function (res) {

    //             if (res.data.ack == true) {

    //                 console.log('Success');

    //                 $rootScope.printinvoiceFlag = true;

    //                 toaster.pop('success', 'Info', 'PDF Generated Successfully');

    //                 serviceVariables.generatedPDF = res.data.path;                    

    //             } else if (res.data.SQLack == false) {

    //                 toaster.pop('warning', 'Important','PDF Generated Successfully');

    //                 toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(105));

    //             }

    //             else {

    //                 toaster.pop('error', 'Error', "PDF Not Generated");

    //             }

    //         });

    // }

}