myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.return-orders', {
                url: '/return-orders',
                title: 'Sales',
                templateUrl: helper.basepath('return_orders/orders.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.addReturnOrder', {
                url: '/return-orders/add',
                title: 'Sales',
                templateUrl: helper.basepath('addTabs.html'),
                resolve: helper.resolveFor('ngDialog'),
                controller: 'ReturnOrderEditController'

            })
            .state('app.viewReturnOrder', {
                url: '/return-orders/:id/view?isInvoice',
                title: 'Sales',
                templateUrl: helper.basepath('addTabs.html'),
                resolve: helper.resolveFor('ngDialog'),
                controller: 'ReturnOrderEditController'
            })
            .state('app.editReturnOrder', {
                url: '/return-orders/:id/edit',
                title: 'Sales',
                templateUrl: helper.basepath('addTabs.html'),
                resolve: helper.resolveFor('ngDialog'),
                controller: 'ReturnOrderEditController'
            })

            .state('app.sale-return-invoice', {
                url: '/sale-return-invoice',
                title: 'Sales',
                templateUrl: helper.basepath('return_orders/salesreturnorders.html'),
                controller: 'SaleReturnInvoiceController',
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })

    }]);

SaleReturnInvoiceController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$rootScope", "moduleTracker"];
myApp.controller('SaleReturnInvoiceController', SaleReturnInvoiceController);
function SaleReturnInvoiceController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $rootScope, moduleTracker) {
    'use strict';

    moduleTracker.updateName("credit_note");
    moduleTracker.updateAdditional("credit_note posted");
    moduleTracker.updateRecord("");

    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Sales', 'url': '#', 'isActive': false },
            { 'name': 'Customers', 'url': 'app.customer', 'isActive': false },
            { 'name': 'Posted Credit Notes', 'url': '#', 'isActive': false }];

    var vm = this;
    var Api = $scope.$root.sales + "customer/return-order/listings";
    var postData = {
        'token': $scope.$root.token,
        'all': "1",
        'type': 2
    };

    $scope.searchKeyword = {};
    $scope.selectedRecBulkEmail = [];
    $scope.recordArray = [];

    $scope.getReturnInvoiceListing = function (item_paging, sort_column, sortform) {
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

                    angular.forEach(res.data.response, function (value, key) {
                        if (key != "tbl_meta_data") {
                            $scope.recordArray.push(value);
                        }
                    });

                    $scope.record = res.data.response;
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
                // toaster.pop('error', 'info', 'Server is not Acknowledging');
                throw new Error(message.data);
                console.log(message.data);
            });
    }
 
    $scope.getItem = function (parm) {
        $scope.rec.token = $scope.$root.token;
        //$scope.rec.warehouse_id = $scope.rec.warehouse !=undefined? $scope.rec.warehouse.id:'';
        //$scope.rec.category_id = $scope.rec.category !=undefined? $scope.rec.category.id:'';
        if (parm == 'all') {
            $scope.rec = {};
            $scope.rec.token = $scope.$root.token;
        }
        $scope.rec.type = 2;
        $scope.postData = $scope.rec;

        $scope.$root.$broadcast("myReload");
    }

    $scope.$on("myReload", function (event) {
        //var ApiAjax = $resource('api/company/get_listing_ajax/:module_id/:module_table/:filter_id/:more_fields/:condition');

        // ngDataService.getDataCustom( $scope.MainDefer, $scope.mainParams, Api,$scope.mainFilter,$scope,$scope.postData);
        // ngDataService.getDataCustom($defer, params, Api, $filter, $scope, $scope.postData);
        $scope.table.tableParams5.reload();
        //return;
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
            $rootScope.animateBulkEmailText = '';
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(236, ['Posted Credit Notes']));
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
                    'module': 'PostedCreditNotes',
                    'Option': 'saveAsPdf',
                    'OptionType': 4,
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
                        //     $scope.getReturnInvoiceListing();
                        // }, 500);
                    }
                    else {
                        toaster.pop('error', 'Info', "PDF(s) Generation Failed.");
                    }
                });

        }
        else if (bulkOptionChk == 'email') {
        // else if (bulkOptionChk.email == true) {

            $rootScope.BulkEmailMessage = "Posted Credit Note(s)";

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
                        'module': 'PostedCreditNotes',
                        'Option': 'email',
                        'OptionType': 4,
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
                                body: "Email could not be sent for the following Posted Credit Note(s) <br/>" + res.data.error.toString(),
                                timeout: 0,
                                bodyOutputType: 'trustedHtml',
                                tapToDismiss: false
                            });
                        }
                        else if (res.data.ack == true) {
                            toaster.pop('success', 'Info', 'Email(s) Sent Successfully.');


                            $timeout(function () {
                                $scope.getReturnInvoiceListing();
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

myApp.controller('ReturnOrdersController', ReturnOrdersController);
ReturnOrdersController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", '$filter', "$rootScope", "moduleTracker"];
function ReturnOrdersController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams, $rootScope, moduleTracker) {
    'use strict';

    moduleTracker.updateName("credit_note");
    moduleTracker.updateAdditional("credit_note unposted");
    moduleTracker.updateRecord("");

    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            // { 'name': 'Setup', 'url': '#', 'isActive': false },
            { 'name': 'Sales', 'url': '#', 'isActive': false },
            { 'name': 'Customers', 'url': 'app.customer', 'isActive': false },
            { 'name': 'Credit Notes', 'url': '#', 'isActive': false }];

    var vm = this;
    var Api = $scope.$root.sales + "customer/return-order/listings";

    $scope.postData = {};
    $scope.postData = {
        'token': $scope.$root.token,
        'all': "1",
        'type': 1
    };

    $scope.searchKeyword = {};
    $scope.selectedRecBulkEmail = [];
    $scope.recordArray = [];

    $scope.getReturnOrdersListing = function (item_paging, sort_column, sortform) {
        $scope.postData = {};
        $scope.postData = {
            'token': $scope.$root.token,
            'all': "1",
            'type': 1
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

                    angular.forEach(res.data.response, function (value, key) {
                        if (key != "tbl_meta_data") {
                            $scope.recordArray.push(value);
                        }
                    });

                    $scope.record = res.data.response;
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
                // toaster.pop('error', 'info', 'Server is not Acknowledging');
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

    $scope.$data = {};
    $scope.delete = function (id, index, $data) {
        console.log('inside delete');
        var delUrl = $scope.$root.pr + "srm/srmorderreturn/delete-order-return";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        $data.splice(index, 1);
                    }
                    else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

    
    
    $scope.PostAllOrders = function()
    {
        var postUrl = $scope.$root.sales + "customer/order/post-all-orders";
        var ids = '';
        if($scope.tableData.data.total > 0)
        {
            angular.forEach($scope.tableData.data.response, function(order){
                if(order.id != undefined)
                    ids += order.id + ',';
            });
            ids = ids.substring(0, ids.length - 1);
        }
        if(ids.length > 0)
        {
            $rootScope.post_all_order_msg = "Are you sure you want to post these "+(ids.split(',').length)+" Credit Notes?";
            
            ngDialog.openConfirm({
                template: '_confirm_all_order_posting',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                $scope.showLoader = true;
                $http
                    .post(postUrl, {'token': $scope.$root.token, 'ids':ids, 'type':'2' })
                    .then(function (res) {
                        if (res.data.ack == true) {
                            $scope.showLoader = false;
                            toaster.pop('warning', 'Info', res.data.success_count+' posted successfully out of '+res.data.all_count);
                            $scope.getReturnOrdersListing(1);
                        }
                    });
                }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
        }
        else 
        {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(390));
        }
    }

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
            $rootScope.animateBulkEmailText = '';
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(236, ['Credit Notes']));
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
                    'module': 'CreditNotes',
                    'Option': 'saveAsPdf',
                    'OptionType': 4,
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
                        //     $scope.getReturnOrdersListing();
                        // }, 500);
                    }
                    else {
                        toaster.pop('error', 'Info', "PDF(s) Generation Failed.");
                    }
                });

        }
        else if (bulkOptionChk == 'email') {
        // else if (bulkOptionChk.email == true) {

            $rootScope.BulkEmailMessage = "Credit Note(s)";

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
                        'module': 'CreditNotes',
                        'Option': 'email',
                        'OptionType': 4,
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
                                body: "Email could not be sent for the following Credit Note(s)<br/>" + res.data.error.toString(),
                                timeout: 0,
                                bodyOutputType: 'trustedHtml',
                                tapToDismiss: false
                            });
                        }
                        else if (res.data.ack == true) {
                            toaster.pop('success', 'Info', 'Email(s) Sent Successfully.');


                            $timeout(function () {
                                $scope.getReturnOrdersListing();
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


myApp.controller('ReturnOrderEditController', ReturnOrderEditController);
function ReturnOrderEditController($scope, $filter, $resource, $timeout, $http, ngDialog, toaster, $stateParams, $state, $rootScope, ModalService, serviceVariables, generatePdf, moduleTracker) {
    'use strict';
    $scope.generatePdf = generatePdf;

    moduleTracker.updateName("credit_note");
    moduleTracker.updateRecord("");
    
    $scope.serviceVariables = serviceVariables;
    
    
    // $rootScope.updateSelectedGlobalData("item");
    
    if ($stateParams.id > 0){
        $scope.check_so_readonly = true;
        moduleTracker.updateRecord($stateParams.id);
    }
    
    $scope.rec = {};
    
    if ($stateParams.isInvoice != undefined) {
        $scope.isInvoice = 1;
        $scope.rec.type2 = 2;
    }
    else
    {
        $scope.isInvoice = 0;
        $scope.rec.type2 = 1;
    }

    
   if ($scope.rec.type2 == 1){
        var link_order = 'app.return-orders';
        var name_link = 'Credit Notes';
        moduleTracker.updateAdditional("credit_note unposted");
    }
    else {
        var link_order = 'app.sale-return-invoice';
        var name_link = 'Posted Credit Notes';
        moduleTracker.updateAdditional("credit_note posted");
    }


    if($scope.rec.type2 == 1) {
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

    }

    $scope.GetApprovalPreData = function () {
        var APIUrl = $scope.$root.sales + "customer/order/get-approval-pre-data";
        var postData = {
            'token': $scope.$root.token
        };
        $http
            .post(APIUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.credit_note_approval_req = res.data.credit_note_approval_req;
                }
                else {
                    $scope.credit_note_approval_req = 0;

                }
            });
    }
    // if (!($stateParams.id > 0))
    $scope.GetApprovalPreData();


    /* $scope.showEditForm = function () {
        $scope.check_so_readonly = false;
    }
    
    $scope.showEditorderForm = function () {
        $scope.check_so_readonly = false;
    }
    */
    $scope.show_btn_dispatch_stuff = false;
    $scope.submit_show_invoicee = true;

    $scope.record = [];
    var vm = this;
    $scope.class = 'block';
    $scope.drp = {};
    $scope.items = [];
    $scope.check_readonly = true;
    $scope.crm_no = '';
    var crm_name = '';
    $scope.customer_no = '';
    var table = 'order';
    $scope.title = 'Order Listing';
    $scope.btnCancelUrl = 'app.return-orders';

    if (!($stateParams.id > 0)) {

        var id = $stateParams.id;
        $scope.rec.id = 0;
        $scope.$root.order_id = 0;
        $scope.$root.crm_id = id;

        $scope.rec.posting_date = $scope.$root.get_current_date();
        $scope.rec.offer_date = $scope.$root.get_current_date();
        $scope.rec.delivery_date = $scope.$root.get_current_date();
    }
    else
    {
        $scope.rec.id = $stateParams.id;
        $scope.$root.order_id = $stateParams.id;
    } 


    $scope.$on('InvoicePosted', function (event, data) {

        $scope.rec2 = {};
        $scope.rec = {};
        $scope.rec.type2 = 1;
        $scope.selectedPurchaseOrders = "";
        $scope.check_so_readonly = false;
        $scope.show_btn_dispatch_stuff = false;
        $scope.submit_show_invoicee = true;

        $scope.$root.order_id = 0;
        $scope.$root.crm_id = 0;

        $scope.$root.breadcrumbs =
            [//{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
                { 'name': 'Sales', 'url': '#', 'isActive': false },
                { 'name': 'Customers', 'url': 'app.customer', 'isActive': false },
                { 'name': 'Credit Notes', 'url': 'app.return-orders', 'isActive': false }
            ];

        $scope.rec.posting_date = $scope.$root.get_current_date();
        $scope.rec.offer_date = $scope.$root.get_current_date();
        $scope.rec.delivery_date = $scope.$root.get_current_date();
        $scope.GetSalesOrderStages(0);
    });

    $scope.product_type = true;
    $scope.count_result = 0;
    /* $scope.getCode = function (rec) {

        // var getCodeUrl = $scope.$root.pr+"srm/srmorderreturn/get-order-return-code";
        var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
        var name = $scope.$root.base64_encode('return_orders');
        var no = $scope.$root.base64_encode('return_order_no');
        var module_category_id = 2;
        $http
            .post(getCodeUrl, {
                'is_increment': 1,
                'token': $scope.$root.token,
                'tb': name,
                'm_id': 112,
                'no': no,
                'module_category_id': module_category_id,
                'type': '1,2'
            })
            .then(function (res) {

                if (res.data.ack == 1) {

                    $scope.rec.return_order_code = res.data.code;
                    $scope.rec.return_order_no = res.data.nubmer;

                    //console.log($scope.rec.ret_invoice_no);

                    $scope.rec.code_type = module_category_id;//res.data.code_type;
                    $scope.count_result++;

                    if (res.data.type == 1) {
                        $scope.product_type = false;
                    }
                    else {
                        $scope.product_type = true;
                    }

                    if ($scope.count_result > 0) {
                        console.log($scope.count_result);
                        return true;
                    }
                    else {
                        console.log($scope.count_result + 'd');
                        return false;
                    }

                }
                else {
                    toaster.pop('error', 'info', res.data.error);
                    return false;
                }
            });

    } */

    // if ($stateParams.id === undefined)   $scope.getCode();

    $rootScope.get_posting_vat();

    $scope.$on("myEvent", function (event, args) {
        if (args.order_id != undefined)
            $stateParams.id = args.order_id;
        if (args.arr_contact != undefined) {
            $scope.rec.bill_to_contact_no = args.arr_contact.sell_to_contact_no;
            $scope.rec.bill_to_contact_id = args.arr_contact.contact_id;
        }
        if (args.objCust != undefined) {
            $scope.rec.id = args.objCust.order_id;
            $scope.rec.bill_to_cust_no = args.objCust.sell_to_cust_no;
            $scope.rec.bill_to_cust_id = args.objCust.bill_to_cust_id;
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

    /* angular.forEach($rootScope.arr_currency, function (elem) {
        if ((elem.id == $scope.$root.defaultCurrency) && ($stateParams.id == undefined))
            $scope.rec.currency_id = elem;
    }); */
    // }, 2000);

    $scope.$root.paid_amount = 0;
    $scope.GetRemainingAmount = function () {


        var RAmountUrl = $scope.$root.gl + "chart-accounts/get-invoice-remaining-payment";

        $http
            .post(RAmountUrl, { 'doc_type': 4, 'invoice_id': $stateParams.id, 'token': $scope.$root.token })
            .then(function (res) {
                if (res.data.ack == true) {


                    $scope.$root.paid_amount = res.data.response.payed_amount;

                    if (res.data.response.payed_amount == null)
                        $scope.$root.paid_amount = 0;
                    //console.log( );
                }

                else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                    $scope.$root.paid_amount = 0;
                }
            });
    }

    //	$rootScope.get_country_list();



    $scope.getAltDepot = function () {
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
            .then(function (res) {
                $scope.columns = [];
                $scope.record = {};

                if (res.data.record.ack == true) {
                    $scope.record = res.data.record.result;

                    angular.forEach(res.data.record.result[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    angular.element('#_orderLocationModal').modal({ show: true });

                }
                else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(501, ['delivery location ', 'customer']));
                    return;
                }
            });
    }

    $scope.confirm_location = function (result) {

        $scope.rec.ship_to_name = result.location;
        $scope.rec.ship_to_address = result.address_1;
        $scope.rec.ship_to_address2 = result.address_2;
        $scope.rec.ship_to_city = result.city;
        $scope.rec.ship_to_county = result.county;
        $scope.rec.ship_to_post_code = result.postcode;
        angular.forEach($rootScope.country_type_arr, function (elems) {
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


    $scope.showOrderTrail = function (stock, isSingleTrail) {
        $scope.searchKeyword_2 = {};
        var stock_trail_url = $scope.$root.setup + "warehouse/sale-stock-trial";
        var postData = {
            'token': $scope.$root.token,
            'prod_id': stock.product_id,
            'order_id': $scope.$root.order_id,
            // 'warehose_id': stock.warehouse_id
        };

        $scope.stock_activity_title = 'Stock Activity';

        if (isSingleTrail) {
            postData.id = stock.id;
            if (isSingleTrail == 1) // total qty => purchase orders
            {
                postData.type = 1;
            }
            else if (isSingleTrail == 2) // sold qty => sales orders
            {
                postData.type = 2
                postData.sale_status = '2, 3';
            }
            else if (isSingleTrail == 3) // allocated qty => allocated orders
            {
                postData.type = 2;
                postData.sale_status = 1;
            }
            else if (isSingleTrail == 4) // Credit Notes
            {
                postData.type = 1;
                postData.only_cn = 1;
                postData.sale_status = '2, 3';
                postData.sale_return_status = 1;
            }
        }
        
        postData.item_trace_unique_id = stock.item_trace_unique_id;
        $http
            .post(stock_trail_url, postData)
            .then(function (res) {

                $scope.columns2 = [];
                $scope.prod_warehouse_trail_data = [];

                if (res.data.response != null) {
                    $scope.prod_warehouse_trail_data = res.data.response;
                    angular.forEach(res.data.response[0], function (val, index) {
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

    $scope.getShipmentMethods = function () {
        $scope.title = 'Shipment Methods';
        var ApiAjax = $scope.$root.setup + "crm/shipment-methods";
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
                    $scope.rec.shipment_method_code = elem;
            });
            $scope.rec.shipment_method_id = result.id;
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.searchKeywordSupp = {};
    //getShippingAgents

    $scope.get_supplier = function (item_paging) {
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
            .then(function (res) {
                $scope.columns = [];
                $scope.record = {};
                $scope.supplierTableData = res;
                $scope.showLoader = false;

                if (res.data.ack == true) {
                    // $scope.total = res.data.total;
                    // $scope.item_paging.total_pages = res.data.total_pages;
                    // $scope.item_paging.cpage = res.data.cpage;
                    // $scope.item_paging.ppage = res.data.ppage;
                    // $scope.item_paging.npage = res.data.npage;
                    // $scope.item_paging.pages = res.data.pages;
                    // $scope.total_paging_record = res.data.total_paging_record;

                    angular.element('#listing_sp_single_Modal').modal({ show: true });

                    // $scope.record = res.data.response;
                    // $scope.record_invoice = res.data.response;
                }
                else
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            }).catch(function (message) {
                $scope.showLoader = false;
                // toaster.pop('error', 'info', 'Server is not Acknowledging');
                throw new Error(message.data);
            });

    }

    $scope.confirm_supp_single = function (result) {
        $scope.rec.shipping_agent_code = result.name;
        $scope.rec.shipping_agent_id = result.id;
        angular.element('#listing_sp_single_Modal').modal('hide');
    }

    $scope.getAltContact = function (arg) {
        $scope.contactArg = arg;

        if ($scope.rec.sell_to_cust_id == undefined) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Customer No.']));
            return;
        }
        else {
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
                .then(function (res) {
                    //  $scope.columns = res.data.columns;
                    //  $scope.record = res.data.record.result;
                    if (res.data.record.ack == true) {
                        $scope.columns = [];
                        $scope.record = res.data.record.result;
                        angular.forEach(res.data.record.result[0], function (val, index) {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });
                        angular.element('#_orderContactModal').modal({ show: true });

                    }
                    else {
                        toaster.pop('error', 'Error',$scope.$root.getErrorMessageByCode(501, ['contact person ', 'customer']));
                        return;
                    }
                });
        }
    }

    $scope.confirm_contact = function (result) {
        $scope.rec.sell_to_contact_id = result.id;
        $scope.rec.sell_to_contact_no = result.name;
        $scope.rec.bill_to_contact = result.name;        
        $scope.rec.cust_phone = result.phone;
        $scope.rec.cust_email = result.email;
        $scope.rec.cust_fax = result.fax;

        angular.element('#_orderContactModal').modal('hide');
    }
    function toTitleCase(str) {
        var title = str.replace('_', ' ');
        return title.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }


    /* $scope.columns = [];
    $scope.getSalePerson = function (arg) {
        $scope.columns = [];
        $scope.record = {};
        var empUrl = $scope.$root.hr + "employee/listings";
        postData = {
            'token': $scope.$root.token,
            'all': "1",
        };
        $http
            .post(empUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.columns = [];
                    $scope.record = res.data.response;
                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }
                else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            });

        ngDialog.openConfirm({
            template: 'modalDialogId2',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (result) {
            $scope.rec.sale_person = result.first_name + ' ' + result.last_name;
            $scope.rec.sale_person_id = result.id;
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    } */

    $scope.columns = [];
    $scope.getSalePerson = function (arg) {
        if ($scope.rec.sell_to_cust_id == undefined) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Customer No.']));
            return;
        }
        else {
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
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.columns = [];
                        $scope.record = res.data.response;
                        angular.forEach(res.data.response[0], function (val, index) {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });
                        angular.element('#_orderSalesPersonModal').modal({ show: true });

                    }
                    else {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                        return;
                    }
                });
        }
    }
    $scope.show_order = true;

    $scope.confirm_sale_person = function (result) {
        $scope.rec.sale_person = result.name;
        $scope.rec.sale_person_id = result.id;
        angular.element('#_orderSalesPersonModal').modal('hide');
    }

    $scope.columns = [];
    $scope.getSalesInvoices = function (arg) {
        if ($scope.rec.sell_to_cust_id == undefined) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Customer No.']));
            return;
        }
        else if ($scope.items != undefined && $scope.items.length > 0) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(650));
            return false;
        }
        else {
            $scope.columns = [];
            $scope.record = {};
            $scope.title = 'Sales Invoices';
            $scope.customer_code = $scope.rec.sell_to_cust_no;
            $scope.customer_name = $scope.rec.sell_to_cust_name;

            // var empUrl = $scope.$root.hr + "employee/listings";
            var getInvrUrl = $scope.$root.sales + "customer/return-order/get-invoices-for-credit-notes";
            $scope.filterInvoices = {};

            var postData = {
                'token': $scope.$root.token,
                'crm_id': $scope.rec.sell_to_cust_id
            };
            $http
                .post(getInvrUrl, postData)
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.columns = [];
                        $scope.record = res.data.response;
                        angular.forEach(res.data.response[0], function (val, index) {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });
                        angular.element('#_invoicesModal').modal({ show: true });

                    }
                    else {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                        return;
                    }
                });
        }
    }
    $scope.show_order = true;

    $scope.confirm_sale_invoice = function (result) {
        $scope.rec.sale_invoice = result.invoice_code;
        $scope.rec.sale_invoice_id = result.id;
        $scope.rec.sale_invoice_type = result.type;
        angular.element('#_invoicesModal').modal('hide');
    }


    $scope.class = 'block';
    // $scope.check_readonly = false;
    $scope.$root.type = 1;
    $scope.on_hold_order = 0;

    if ($stateParams.id > 0) {
        $scope.showLoader = true;

        $scope.code = '';

        var id = $stateParams.id;

        var getOrderUrl = $scope.$root.sales + "customer/return-order/get-order";
        $http
            .post(getOrderUrl, { 'id': id, 'token': $scope.$root.token })
            .then(function (res) {
                if (res.data.ack == true) {


                    // email list for emailer directive
                    if (res.data.response) {
                        try {
                            $scope.customerInvoiceEmail = res.data.response.invoice_email;
                            $scope.customerStatementEmail = res.data.response.statement_email;
                            $scope.customerReminderEmail = res.data.response.reminder_email;
                        }
                        catch (ex) {
                            console.log(ex);
                        }
                    }

                    if (res.data.response.customer_emails) {
                        var customerEmails = [];
                        angular.forEach(res.data.response.customer_emails.split(","), function (obj, i) {
                            if (obj)
                                customerEmails.push({ id: i, username: obj.trim() })
                        });
                        res.data.response.customer_emails = customerEmails;
                    }

                    if(res.data.response.approval_type_1 == 2 && res.data.response.approval_type_2 == 2)
                    {
                        $scope.approvals_lock_order = 1;
                    }
                    else if(res.data.response.approval_type_1 == 0 || res.data.response.approval_type_2 == 0)
                    {
                        $scope.approvals_lock_order = -1;
                    }
                    else
                        $scope.approvals_lock_order = 0;
                        
                    $scope.on_hold_order = (res.data.response.approval_type_1 == 7 || res.data.response.approval_type_2 == 7) ? 1 : 0;

                    moduleTracker.updateRecord(id);
                    moduleTracker.updateRecordName(res.data.response.return_order_code + ((res.data.response.return_order_code && res.data.response.return_invoice_code) ? "/" : "") + (res.data.response.return_invoice_code ? res.data.response.return_invoice_code : ""));
                    $scope.rec = res.data.response;
                    $scope.$root.type = $scope.rec.type;
                    $scope.$root.crm_id = res.data.response.sell_to_cust_id;
                    $scope.$root.model_code = res.data.response.return_order_code;
                    $scope.module_code = $scope.$root.model_code;
                    $scope.rec.anonymous_customer = Number($scope.rec.anonymous_customer);
                    $scope.GetSalesOrderStages();
                    $scope.rec.freight_charges = Number($scope.rec.freight_charges);

                    $rootScope.arr_vat_post_grp_sales = res.data.response.arr_vat_post_grp_sales;
                    $scope.currency_arr_local = res.data.response.currency_arr_local;

                    if ($scope.rec.type == 1)
                        $scope.$root.breadcrumbs.push({ 'name': $scope.rec.sell_to_cust_name + ' (' + $scope.rec.return_order_code + ')', 'url': '#', 'isActive': false });
                    else if ($scope.rec.type == 2)
                        $scope.$root.breadcrumbs.push({ 'name': $scope.rec.sell_to_cust_name + ' (' + $scope.rec.return_invoice_code + ')', 'url': '#', 'isActive': false });
                    // if ($scope.$root.type == 2) // only for posted invoice
                    //     $scope.GetRemainingAmount();


                    //+$scope.getOrderNo(res.data.response.order_no);
                    //	$scope.return_order_no = res.data.response.return_order_no;
                    /*   if (res.data.response.purchase_order_id != null) {
                     var getQuoteUrl = $scope.$root.pr + "srm/srminvoice/get-invoice";
                     $http
                     .post(getQuoteUrl, {id: res.data.response.purchase_order_id, token: $scope.$root.token})
                     .then(function (pRes) {
                     if (pRes.data.response.quotation_no < 10)
                     $scope.rec.purchase_order = 'PO00' + pRes.data.response.quotation_no;
                     else if (pRes.data.response.quotation_no > 10 && pRes.data.response.quotation_no < 100)
                     $scope.rec.purchase_order = 'PO0' + pRes.data.response.quotation_no;
                     else
                     $scope.rec.purchase_order = 'PO' + pRes.data.response.quotation_no;
                     $scope.rec.purchase_order_id = pRes.data.response.id;
                     });
                     }*/
                    //if(res.data.response.order_no != undefined)
                    //	$scope.code = $scope.prefix+$scope.getOrderNo(res.data.response.return_order_no);
                    /*if(res.data.response.sell_to_contact_id != undefined)
                     $scope.rec.sell_to_contact_no = $scope.Contprefix+$scope.getOrderNo(res.data.response.sell_to_contact_id);*/

                    $scope.rec.update_id = $stateParams.id;
                    $scope.code = (res.data.response.invoice_no);

                    $scope.$root.model_code = res.data.response.ret_invoice_code;
                    $scope.module_code = $scope.$root.model_code;


                    $scope.$root.c_currency_id = res.data.response.currency_id;
                    $scope.$root.posting_date = res.data.response.posting_date;

                    /* if (res.data.response.bill_to_contact_id != undefined)
                        $scope.rec.bill_to_contact_no = $scope.Contprefix + $scope.getOrderNo(res.data.response.bill_to_contact_id); */


                    if (res.data.response.requested_delivery_date == 0)
                        $scope.rec.requested_delivery_date = null;
                    else
                        $scope.rec.requested_delivery_date = $scope.$root.convert_unix_date_to_angular(res.data.response.requested_delivery_date);

                    if (res.data.response.delivery_date == 0)
                        $scope.rec.delivery_date = null;
                    else
                        $scope.rec.delivery_date = $scope.$root.convert_unix_date_to_angular(res.data.response.delivery_date);

                    if (res.data.response.posting_date == 0)
                        $scope.rec.posting_date = null;
                    else
                        $scope.rec.posting_date = $scope.$root.convert_unix_date_to_angular(res.data.response.posting_date);

                    if (res.data.response.order_date == 0)
                        $scope.rec.order_date = null;
                    else
                        $scope.rec.order_date = $scope.$root.convert_unix_date_to_angular(res.data.response.order_date);


                    if (res.data.response.order_return_date == 0)
                        $scope.rec.order_return_date = null;
                    else
                        $scope.rec.order_return_date = $scope.$root.convert_unix_date_to_angular(res.data.response.order_return_date);

                    angular.forEach($rootScope.arr_payment_terms, function (elem) {
                        if (elem.id == res.data.response.payment_terms_code)
                            $scope.rec.payment_terms_codes = elem;
                    });
                    angular.forEach($rootScope.arr_payment_methods, function (elem) {
                        if (elem.id == res.data.response.payment_method_id)
                            $scope.rec.payment_method_ids = elem;
                    });
                    angular.forEach($rootScope.country_type_arr, function (obj) {
                        if (obj.id == res.data.response.country_id)
                            $scope.rec.country_ids = obj;
                    });

                    angular.forEach($scope.currency_arr_local, function (elem) {
                        if (elem.id == $scope.rec.currency_id)
                            $scope.rec.currency_id = elem;
                    })
                    // $scope.$root.customer_country = $scope.rec.country_ids;

                    // $timeout(function () {
                    //     $scope.$root.$apply(function () {

                    /* angular.forEach($scope.$root.country_type_arr, function (obj) {
                        if (obj.id === res.data.response.country_id)
                            $scope.rec.country_ids = obj;
                    });
 */
                    angular.forEach($scope.currency_arr_local, function (elem) {
                        if (elem.id == $scope.rec.currency_id) $scope.rec.currency_id = elem;
                    });

                    angular.forEach($rootScope.crm_shippment_methods_arr, function (elem) {
                        if (elem.id == $scope.rec.shipment_method_id)
                            $scope.rec.shipment_method = elem;
                    });

                
                    // });
                    //console.log($scope.rec.currency_id);
                    // $scope.showLoader = false;
                    // }, 2000);
                    if (res.data.response.comment != null)
                        $scope.$root.$broadcast("orderTabEvent", res.data.response.comment);

                    $scope.$root.$broadcast("getSaleOrderId", res.data.response.order_id);


                    $scope.rec.type2 = $scope.rec.type;


                    /* if ($scope.rec.type2 == 3) {
                        link_order = 'app.sale-invoice';
                        name_link = 'Invoice';
                    } */
                    //  $scope.GetRemainingAmount();
                    angular.forEach($rootScope.country_type_arr, function (elems) {
                        if (elems.id == res.data.response.ship_to_country_id)
                            $scope.rec.ship_to_country_ids = elems;
                    });

                    if (res.data.response.order_finance_details != undefined) {
                        $scope.finance_response = {};
                        $scope.finance_read_only = true;
                        $scope.finance_response = res.data.response.order_finance_details.response;
                        // $scope.rec_finance = {};
                        $scope.$root.c_currency_id = res.data.response.order_finance_details.response.currency_id;
                    
                        $scope.rec.bill_to_cust_no = $scope.finance_response.customer_code;

                        if($scope.rec.anonymous_customer == 0)
                        {
                            $scope.rec.bill_to_contact = $scope.finance_response.contact_person;
                            $scope.rec.bill_to_contact_email = ($scope.finance_response.invoice_email != undefined) ? $scope.finance_response.invoice_email : $scope.finance_response.email;
                        
                            $scope.rec.bill_to_contact_phone = $scope.finance_response.fphone;
                            $scope.rec.fax = $scope.finance_response.ffax;

                            $scope.rec.bill_to_name = $scope.finance_response.name;
                            $scope.rec.bill_to_loc_name = $scope.finance_response.blname;
                            $scope.rec.bill_to_address = $scope.finance_response.bladdress;
                            $scope.rec.bill_to_address2 = $scope.finance_response.bladdress2;
                            $scope.rec.bill_to_city = $scope.finance_response.blcity;
                            $scope.rec.bill_to_county = $scope.finance_response.blcounty,
                                $scope.rec.bill_to_post_code = $scope.finance_response.blpostcode;

                            // $scope.rec.bill_to_country  = $scope.finance_response.blcountry;
                            angular.forEach($rootScope.country_type_arr, function (elems) {
                                if (elems.id == $scope.finance_response.blcountry)
                                    $scope.rec.bill_to_country_ids = elems;
                            });

                            $scope.rec.alt_contact_person = $scope.finance_response.alt_contact_person;
                            $scope.rec.alt_contact_email = $scope.finance_response.alt_contact_email;
                            $scope.rec.bank_name = $scope.finance_response.bank_name;
                            $scope.rec.bank_account_id = $scope.finance_response.bank_account_id;
                        }
                        angular.forEach($rootScope.arr_payment_terms, function (elem, index) {
                            if (elem.id == $scope.finance_response.payment_terms_id) {
                                $scope.drp.payment_terms_ids = elem;
                            }
                        });

                        angular.forEach($rootScope.arr_payment_methods, function (elem, index) {
                            if (elem.id == $scope.finance_response.payment_method_id) {
                                $scope.drp.payment_method_ids = elem;
                            }
                        });
                        angular.forEach($rootScope.arr_posting_group_ids, function (elem, index) {
                            if (elem.id == $scope.finance_response.posting_group_id) {
                                $scope.drp.vat_bus_posting_group = elem;
                                $rootScope.order_posting_group_id = elem.id;
                            }
                        });
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
                        // $scope.rec.bill_to_finance_charges_type = $scope.finance_response.finchargetype;
                        // $scope.rec.bill_to_insurance_charges = $scope.finance_response.inscharges;
                        // $scope.rec.bill_to_insurance_charges_type = $scope.finance_response.inschargetype;
                        // $scope.rec.bill_to_finance_charges = $scope.finance_response.fincharges;
                        // $scope.rec.bill_to_finance_charges_type = $scope.finance_response.finchargetype;

                        if ($scope.finance_response.generate != undefined) {
                            var arrGen = $scope.finance_response.generate.split(',');
                            angular.forEach($scope.arr_generate, function (elem, index) {
                                var indx = arrGen.indexOf(elem.id) == -1;
                                if (!indx) {
                                    $scope.arr_generate[index].chk = true;
                                }
                            })
                        }
                    }
                    else {
                        angular.forEach($rootScope.arr_posting_group_ids, function (elem, index) {
                            if (elem.id == res.data.response.bill_to_posting_group_id) {
                                $scope.drp.vat_bus_posting_group = elem;
                                $rootScope.order_posting_group_id = elem.id;
                            }
                        });

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

                        angular.forEach($rootScope.country_type_arr, function (obj) {
                            if (obj.id == res.data.response.bill_to_country_id)
                                $scope.rec.bill_to_country_ids = obj;
                        });
                    }
                    
                    //some time broadcast call but previouse $digest not end , result it products not load on some cases. this is temporary fixation. 
                    // To overcome it we must set one digest for all asyncronously calls. digest wait for to speedup the system.
                    /* setTimeout(function(){
                        $scope.$apply(function(){
                            $scope.$broadcast('LoadOderItems');
                        });
                    }, 1000); */
                    /* if (Number($scope.rec.no_of_items) > 0)
                    {
                        $timeout(function () {
                            $scope.$broadcast('LoadOderItems');
                        }, 500);
                    } */
                    $scope.showLoader = false;
                    
                    // $scope.showLoader = false;
                    
                    $scope.selectedPurchaseOrders = "";
                    var selectedPurchaseOrders_name = "";

                    /* $scope.PurchaseOrderArr = res.data.response.PurchaseOrderslisting.response;

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

                }
            });


    }
    if ($stateParams.id == undefined)
        $scope.rec.type2 = 1;
/* 
    $scope.$root.breadcrumbs =
        [//{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
            { 'name': 'Sales', 'url': '#', 'isActive': false },
            { 'name': 'Customers', 'url': 'app.customer', 'isActive': false },
            { 'name': 'Credit Notes', 'url': 'app.return-orders', 'isActive': false }
        ]; */


    $scope.generalInformation = function () {
        $scope.$root.breadcrumbs.name = 'General';
    }
    $scope.invoice_information = function () {
        $scope.$root.breadcrumbs[3].name = 'Invoice';
    }

    $scope.shiping_information = function () {
        // $scope.$root.breadcrumbs[3].name = 'Shipping';

    }


    $scope.order_stages_array = [];
    $scope.GetSalesOrderStages = function (flg) {

        $scope.order_stages_array = [];
        var postData = '';
        if (flg == 0){
            var order_stages = $scope.$root.setup + "crm/get-order-stages-list";
            postData = {
                'token': $scope.$root.token, 
                'order_id': $scope.$root.order_id, 
                'type':4 ,
                'isAllowed': 1 //this parameter is to allow without permission validation
            };
        }else{
            var order_stages = $scope.$root.sales + "customer/order/get-sales-order-stages";
            postData = {
                'token': $scope.$root.token, 
                'order_id': $scope.$root.order_id, 
                'type':4 
            };
        }
        $http
            .post(order_stages, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.order_stages_array = res.data.response;
                    if ($scope.rec.id == undefined) {
                        angular.forEach($scope.order_stages_array, function (obj) {
                            obj.id = 0;
                        });
                    }
                }
            });
    }
    if ($stateParams.id == undefined)
        $scope.GetSalesOrderStages(0);


    //--------------------- start General   ------------------------------------------

    $scope.add = function (rec) {

        var addOrderUrl = $scope.$root.sales + "customer/return-order/add-order";
        if ($stateParams.id > 0) var addOrderUrl = $scope.$root.sales + "customer/return-order/update-order";


        rec.token = $scope.$root.token;
        //rec.return_order_no = $scope.return_order_no;
        rec.id = $stateParams.id;
        // rec.payment_terms_code = rec.payment_terms_codes != undefined?rec.payment_terms_codes.id:0;
        //rec.payment_method_id = rec.payment_method_ids != undefined?rec.payment_method_ids.id:0;
        // rec.country_id = rec.country_ids != undefined?rec.country_ids.id:0;
        //rec.price_including_vat = $scope.price_inc_vat;

        rec.currency_ids = rec.currency_id != undefined ? rec.currency_id.id : 0;
        $scope.$root.c_currency_id = rec.currency_ids;
        $scope.$root.posting_date = rec.posting_date;
        rec.type = 1;


        $http
            .post(addOrderUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $scope.$root.crm_id = rec.sell_to_cust_id;

                    if ($stateParams.id === undefined) $timeout(function () {
                        $state.go("app.editReturnOrder", { id: res.data.id });
                    }, 1000);
                }
                else toaster.pop('error', 'Edit', res.data.error);


            });
    }

    //--------------------- end General   ------------------------------------------
    $scope.list_order = true;

    $scope.PurchaseOrderArr = [];
    $scope.selectedPurchaseOrderArr = [];

    $scope.show_list_order = function () {

        $scope.showLoader = true;
        $scope.filterPurchaseOrder = {};
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

                            angular.forEach($scope.selectedPurchaseOrderArr, function (obj) {

                                if (obj.id == obj2.id)
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
        $scope.PendingSelectedPurchaseOrder = [];

        if (val == true) {

            angular.forEach($scope.PurchaseOrderArr, function (obj) {
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

    /*  $scope.selectItem = function (id) {
         //    console.log("Items::");
         for (var i = 0; i < $scope.items.length; i++) {
             if (id == $scope.items[i].id) {
                 if ($scope.items[i].chk == true)
                     $scope.items[i].chk = false;
                 else
                     $scope.items[i].chk = true;
             }
         }
     }; */

    $scope.IsVisible = true;
    $scope.show_view_data = function (classname) {
        // 		 console.log(classname);
        //	 $(".new_button_" + classname).hide();
        //	 $(".replace_button_" + classname).show();


        // console.log($scope.IsVisible);
        $scope.IsVisible = $scope.IsVisible ? false : true;
        // $scope.IsHidden = $scope.IsVisible ? true : false;

    }

    $scope.check_number = function () {
        // var id = this.rec.supp_order_no.value;
        var id = document.getElementById('supp_order_no').value;

        var Url = $scope.$root.pr + "srm/srmorderreturn/get-invoice-number";
        $http
            .post(Url, { 'id': id, 'token': $scope.$root.token })
            .then(function (res) {
                if (res.data.ack == false) {
                    toaster.pop('error', 'Info', 'Already Exists !');

                    $('.pic_block').attr("disabled", true);
                }
                else $('.pic_block').attr("disabled", false);
            });
    }


    $scope.$root.load_date_picker('srm order');


    $scope.item_paging = {};
    $scope.itemselectPage = function (pageno) {
        $scope.item_paging.spage = pageno;
    };
    //$timeout(function () {

    $scope.row_id = $stateParams.id;
    $scope.module_id = 112;
    $scope.subtype = 4;
    $scope.module = "Purchase  Order  Return";
    $scope.module_name = "Order  Return";
    //$scope.module_code= $scope.$root.model_code ;
    //console.log( $scope.module_id+'call'+$scope.module+'call'+$scope.module_name+'call'+$scope.module_code);
    $scope.$root.$broadcast("image_module", $scope.row_id, $scope.module, $scope.module_id, $scope.module_name, $scope.module_code, $scope.subtype);

    //  }, 1000);


    $scope.$on('SalesLines', function (event, data) {
        $scope.items = data;
    });
    $scope.saleOrders = [];
    $scope.rec2 = {};
    $scope.searchKeyword_si = {};
    $scope.searchKeyword_cust = {};
    $scope.getCustomer = function (item_paging) {
        if (item_paging){
            $scope.searchKeyword_cust = {};
        }
        if ($scope.items != undefined && $scope.items.length > 0) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(537));
            return false;
        }

        //$scope.searchKeyword_cust = {};
        $scope.title = 'Customer Listing';
        $scope.removeCustOption = 1;
      /*   $scope.columns = [];
        $scope.record = {};
        $scope.record = $rootScope.customer_arr; */
        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;

        $scope.postData.searchKeyword = $scope.searchKeyword_cust;


        var customerListingApi = $scope.$root.sales + "customer/order/customer-popup";

        $scope.showLoader = true;
        
        $http
        .post(customerListingApi, $scope.postData)
        .then(function (res) {
            $scope.customerTableData = res;
            if (res.data.ack == true) {            
        
                angular.element('#customer_modal_single').modal({ show: true });

                $scope.showLoader = false;
            }
            else
            {
                $scope.showLoader = false;
            }
        });
        
        /* 
                $scope.title = 'Customer Listing';
                var custUrl = $scope.$root.sales + "customer/customer/getCustomerListings";
        
                $scope.postData = {};
                $scope.postData.token = $scope.$root.token;
                $scope.postData.all = 1;
                $scope.postData.type = 99;
        
                if (item_paging == 1)
                    $rootScope.item_paging.spage = 1;
        
                $scope.postData.page = $rootScope.item_paging.spage;
                $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;
                $scope.postData.searchKeyword_cust = $scope.searchKeyword_cust.$;
        
                if ($scope.searchKeyword_cust.region !== undefined && $scope.searchKeyword_cust.region !== null) {
                    $scope.postData.regions = $scope.searchKeyword.region.id;
                }
        
                if ($scope.searchKeyword_cust.segment !== undefined && $scope.searchKeyword_cust.segment !== null)
                    $scope.postData.segments = $scope.searchKeyword_cust.segment.id;
        
                if ($scope.searchKeyword_cust.buying_group !== undefined && $scope.searchKeyword_cust.buying_group !== null)
                    $scope.postData.buying_groups = $scope.searchKeyword_cust.buying_group.id;
        
        
                if ($scope.postData.pagination_limits == -1) {
                    $scope.postData.page = -1;
                    $scope.searchKeyword_cust = {};
                    $scope.record_data = {};
                }
        
        
                $scope.showLoader = true;
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
                            // console.log(res.data.response[0]);
        
                            angular.forEach(res.data.response[0], function (val, index) {
                                $scope.columns.push({
                                    'title': toTitleCase(index),
                                    'field': index,
                                    'visible': true
                                });
                            });
                            angular.element('#customer_modal_single').modal({ show: true });
                        }
                    });
        
                $scope.showLoader = false; */

    }

    $scope.confirmCustomer = function (result) {

        var custUrl = $scope.$root.sales + "customer/customer/getCustomerForOrder";

        $http
            .post(custUrl, { id: result.id, 'token': $scope.$root.token })
            .then(function (res) {
                if (res.data.ack == true) {
                    result = res.data.response;
                    $scope.rec.sale_invoice = '';
                    $scope.rec.sale_invoice_id = 0;
                    $scope.rec.sale_invoice_type = 0;

                    $scope.currency_arr_local = res.data.response.currency_arr_local;

                    var objCust = {};
                    angular.forEach($scope.currency_arr_local, function (obj) {
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
                    

                    angular.forEach($rootScope.country_type_arr, function (elems) {
                        if (elems.id == result.country_id)
                            $scope.rec.country_ids = elems;
                    });

                    $scope.rec.sell_to_cust_id = objCust.bill_to_cust_id = result.id;
                    $scope.$root.crm_id = result.id;
                    //contact info
                    $scope.rec.sell_to_contact_no = result.fcontact_person;
                    $scope.rec.bill_to_contact = result.fcontact_person;
                    $scope.rec.cust_phone = result.Telephone;
                    $scope.rec.cust_fax = result.fax;
                    $scope.rec.cust_email = result.email;

                    $scope.rec.anonymous_customer = Number(result.anonymous_customer);
                    /* if (result.crmsaleperson.response.length) {
                        var item = $filter("filter")(result.crmsaleperson.response, { is_primary: 1 });
                        var idx = result.crmsaleperson.response.indexOf(item[0]);
                        if (idx != -1) {
                            $scope.rec.sale_person = item[0].name;
                            $scope.rec.sale_person_id = item[0].id;
                        }
                        else
                            toaster.pop('error', 'Error', 'No Primary sales person for this customer!');
                    }
                    else {
                        toaster.pop('error', 'Error', 'No sales person found for this customer!');
                        $scope.rec.sale_person = '';
                        $scope.rec.sale_person_id = 0;
                    } */
                    $scope.rec.sale_person = result.empname;
                    $scope.rec.sale_person_id = result.sale_person_id;

                    // if ($scope.rec.id == undefined) {
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
                    //         $scope.bank_name = '';
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

                    if (result.billing_address_details != undefined) {
                        $scope.rec.bill_to_address = result.billing_address_details.address_1;
                        $scope.rec.bill_to_address2 = result.billing_address_details.address_2;
                        $scope.rec.bill_to_city = result.billing_address_details.city;
                        $scope.rec.bill_to_county = result.billing_address_details.county;
                        $scope.rec.bill_to_post_code = result.billing_address_details.postcode;

                        angular.forEach($rootScope.country_type_arr, function (elems) {
                            if (elems.id == result.billing_address_details.country)
                                $scope.rec.bill_to_country_ids = elems;
                        });
                    }
                    else {
                        $scope.rec.bill_to_address = '';
                        $scope.rec.bill_to_address2 = '';
                        $scope.rec.bill_to_city = '';
                        $scope.rec.bill_to_county = '';
                        $scope.rec.bill_to_post_code = '';
                    }

                    /* ============================= */
                    /* Sales Order Invoice detail */
                    /* ============================= */


                    $scope.rec.bill_to_cust_no = result.code;
                    $scope.rec.bill_to_name = result.title;
                    
                    $scope.rec.contact_person = result.fcontact_person;
                    $scope.rec.bill_to_contact_no = result.fcontact_person;
                    $scope.rec.bill_phone = result.Telephone;
                    $scope.rec.bill_fax = result.fax;
                    $scope.rec.bill_email = result.email;
                    $scope.rec.bill_to_cust_id = result.id;
                    $scope.rec.bill_to_contact_id = result.contact_id;

                    angular.forEach($rootScope.arr_payment_terms, function (elem2) {
                        if (elem2.id == result.payment_term)
                            $scope.rec.payment_terms_codes = elem2;
                    });

                    angular.forEach($rootScope.arr_payment_methods, function (elem3) {
                        if (elem3.id == result.payment_method)
                            $scope.rec.payment_method_ids = elem3;
                    });
                    angular.forEach($rootScope.country_type_arr, function (elems) {
                        if (elems.id == result.country_id)
                            $scope.rec.bill_to_country_ids = elems;
                    });

                    /* ============================== */
                    /* Sales Order Shipping detail */
                    /* ============================== */

                    // if (result.clid != undefined) {
                    $scope.rec.ship_to_name = result.cldepot;
                    $scope.rec.ship_to_address = result.claddress;
                    $scope.rec.ship_to_address2 = result.claddress_2;
                    $scope.rec.ship_to_city = result.clcity;
                    $scope.rec.ship_to_county = result.clcounty;
                    $scope.rec.ship_to_post_code = result.clpostcode;
                    angular.forEach($rootScope.country_type_arr, function (elems) {
                        if (elems.id == result.clcountry)
                            $scope.rec.ship_to_country_ids = elems;
                    });
                    $scope.rec.comm_book_in_contact = result.cldirect_line;
                    $scope.rec.ship_to_contact = result.clcontact_name;
                    $scope.rec.book_in_tel = result.clphone;
                    $scope.rec.book_in_email = result.clemail;
                    $scope.rec.alt_depo_id = result.clid;
                    // }

                    // }


                    if ($scope.$root.breadcrumbs.length > 3) {

                        if (result.type == 1) {

                            if ($scope.rec.sell_to_cust_name != null)
                                $scope.$root.model_code = $scope.rec.sell_to_cust_name + ' (' + $scope.rec.return_order_code + ')';
                            else
                                $scope.$root.model_code = $scope.rec.return_order_code;
                        }
                        else {
                            if ($scope.rec.sell_to_cust_name != null)
                                $scope.$root.model_code = $scope.rec.sell_to_cust_name + ' (' + $scope.rec.return_order_code + ')';
                            else
                                $scope.$root.model_code = $scope.rec.return_order_code;
                        }

                        $scope.$root.breadcrumbs[3].name = $scope.$root.model_code;
                    }

                    if ($scope.$root.breadcrumbs.length == 3) {
                        if ($scope.rec.return_order_code)
                            $scope.$root.model_code = $scope.rec.sell_to_cust_name + ' (' + $scope.rec.return_order_code + ')';
                        else
                            $scope.$root.model_code = $scope.rec.sell_to_cust_name;

                        $scope.$root.breadcrumbs.push({ 'name': $scope.$root.model_code, 'url': '#', 'isActive': false });
                    }



                    angular.element('#customer_modal_single').modal('hide');
                }
            });

    }


    $scope.RemoveCustomerFromOrder = function () {

        var check_approvals = $scope.$root.setup + "general/check-for-approvals-before-delete";

        $http
            .post(check_approvals, {
                'object_id': $scope.$root.order_id,
                'type': '3, 8',
                'token': $scope.$root.token
            })
            .then(function (res) {

                if (res.data.ack == 1) {

                    $rootScope.order_post_invoice_msg = "Do you want the delete the Approval history as well?";
        
                    var postUrl = $scope.$root.setup + "general/delete-approval-history";
                    
                    ngDialog.openConfirm({
                        template: '_confirm_order_invoice_modal',
                        className: 'ngdialog-theme-default-custom'
                    }).then(function (value) {
                        $scope.showLoader = true;
                        
                        $http
                            .post(postUrl, {'token': $scope.$root.token, 'object_id':$scope.$root.order_id, 'type': '3, 8' })
                            .then(function (res) {
                                if (res.data.ack != undefined) {
                                    $scope.showLoader = false;
                                    // $scope.add_general($scope.rec, 1);
                                }
                            });
                        }, function (reason) {
                        console.log('Modal promise rejected. Reason: ', reason);
                    });
                }            

                $scope.rec.currency_id = 0;
                $scope.rec.currency_rate = 1;
                $scope.rec.sale_invoice = '';
                $scope.rec.sale_invoice_id = 0;
                $scope.rec.sale_invoice_type = 0;

                $scope.rec.sell_to_cust_no = '';
                $scope.rec.sell_to_cust_name = '';
                $scope.rec.sell_to_address = '';
                $scope.rec.sell_to_address2 = '';
                $scope.rec.sell_to_city = '';
                $scope.rec.sell_to_county = '';
                $scope.rec.sell_to_post_code = '';
                $scope.rec.country_ids = '';

                $scope.rec.sell_to_cust_id = 0;
                $scope.$root.crm_id = 0;
                //contact info
                $scope.rec.sell_to_contact_no = '';
                $scope.rec.cust_phone = '';
                $scope.rec.cust_fax = '';
                $scope.rec.cust_email = '';

                $scope.rec.anonymous_customer = 0;
                
                $scope.rec.sale_person = '';
                $scope.rec.sale_person_id = '';

                $scope.rec.bill_to_contact_email = '';
                $scope.rec.bill_to_contact = '';
                $scope.rec.bill_to_contact_phone = '';
                // $scope.rec.fax = result.ffax;
                $scope.rec.alt_contact_person = '';
                $scope.rec.alt_contact_email = '';
                $scope.rec.bill_to_posting_group_id = '';
                $scope.$root.c_currency_id = 0;
                
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
                $scope.rec.account_name = '';
                $scope.rec.account_no = '';
                $scope.rec.swift_no = '';
                $scope.rec.iban = '';
                $scope.rec.sort_code = '';
                $scope.rec.bill_bank_name = '';
                $scope.rec.vat_number = '';

                // arr_contact.contact_person = elem;

                $scope.rec.bill_to_customer = 0;

                $scope.rec.bill_to_cust_id = 0;


                $scope.rec.bill_to_address = '';
                $scope.rec.bill_to_address2 = '';
                $scope.rec.bill_to_city = '';
                $scope.rec.bill_to_county = '';
                $scope.rec.bill_to_post_code = '';
                $scope.rec.bill_to_country_ids = '';
            

                $scope.rec.bill_to_cust_no = '';
                $scope.rec.bill_to_name = '';

                $scope.rec.contact_person = '';
                $scope.rec.bill_to_contact_no = '';
                $scope.rec.bill_phone = '';
                $scope.rec.bill_fax = '';
                $scope.rec.bill_email = '';
                $scope.rec.bill_to_cust_id = 0
                $scope.rec.bill_to_contact_id = 0;

                $scope.rec.payment_terms_codes = '';
                $scope.rec.payment_method_ids = '';
                $scope.rec.bill_to_country_ids = '';
                
                $scope.rec.ship_to_name = '';
                $scope.rec.ship_to_address = '';
                $scope.rec.ship_to_address2 = '';
                $scope.rec.ship_to_city = '';
                $scope.rec.ship_to_county = '';
                $scope.rec.ship_to_post_code = '';
                $scope.rec.ship_to_country_ids = '';
                $scope.rec.comm_book_in_contact = '';
                $scope.rec.ship_to_contact = '';
                $scope.rec.book_in_tel = '';
                $scope.rec.book_in_email =  '';
                $scope.rec.alt_depo_id = '';
            });    
    }

    function padNumber(number) {
        var string = '' + number;
        string = string.length < 2 ? '0' + string : string;
        return string;
    }
    $scope.CalculateDueDate = function () {
        if ($scope.rec.posting_date != null) {
            var date_parts = $scope.rec.posting_date.trim().split('/');
            var invoice_date = new Date(date_parts[2], date_parts[1] - 1, date_parts[0]);
            if ($scope.drp.payment_terms_ids == undefined)
                return;
            var calculated_date = 0;
            var formatted_date = 0;
            calculated_date = new Date(invoice_date.setDate(invoice_date.getDate() + Number($scope.drp.payment_terms_ids.days)));
            formatted_date = padNumber(calculated_date.getUTCDate()) + '/' + padNumber(calculated_date.getUTCMonth() + 1) + '/' + calculated_date.getUTCFullYear();
            $scope.rec.due_date = formatted_date;
        }
        else
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(538));
        return;
    }

    $scope.confirmFinance = function (result) {
        // if (result.account_payable_number == null && result.purchase_code_number == null) {
        if (result.finance_id == null) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(504));
            return;
        }

        $scope.check_readonly = true;
        // $scope.rec_finance = {};        
        $scope.rec.bill_to_cust_no = result.code;
        $scope.rec.bill_to_name = result.title;
        $scope.rec.bill_to_address = result.address_1;
        $scope.rec.bill_to_address2 = result.address_2;
        $scope.rec.bill_to_contact = result.fcontact_person;
        $scope.rec.bill_to_contact_email = (result.invoice_email != undefined) ? result.invoice_email : result.email;
        
        $scope.rec.bill_to_contact_phone = result.fphone;
        // $scope.rec.fax = result.ffax;
        $scope.rec.alt_contact_person = result.falt_contact_person;
        $scope.rec.alt_contact_email = result.falt_contact_email;
        $scope.rec.bill_to_posting_group_id = result.posting_group_id;
        $scope.$root.c_currency_id = result.currency_id;
        

        angular.forEach($rootScope.arr_payment_terms, function (elem, index) {
            if (elem.id == result.payment_terms_id) {
                $scope.drp.payment_terms_ids = elem;
            }
        });

        if ($scope.rec.posting_date != undefined) {
            $scope.CalculateDueDate();
        }

        angular.forEach($rootScope.arr_payment_methods, function (elem, index) {
            if (elem.id == result.payment_method_id) {
                $scope.drp.payment_method_ids = elem;
            }
        });
        angular.forEach($rootScope.arr_posting_group_ids, function (elem, index) {
            if (elem.id == result.posting_group_id) {
                $scope.drp.vat_bus_posting_group = elem;
                $rootScope.order_posting_group_id = elem.id;
            }
        });
        /* 
        angular.forEach($scope.arr_finance_charges, function (elem, index) {
            if (elem.id == result.finance_charges_id) {
                $scope.drp.finance_charges_ids = elem;
            }
        });
        angular.forEach($scope.arr_insurance_charges, function (elem, index) {
            if (elem.id == result.insurance_charges_id) {
                $scope.drp.insurance_charges_ids = elem;
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
        
        // $scope.rec.bill_to_insurance_charges = result.inscharges;
        // $scope.rec.bill_to_insurance_charges_type = result.inschargetype;
        // $scope.rec.bill_to_finance_charges = result.fincharges;
        // $scope.rec.bill_to_finance_charges_type = result.finchargetype;

        /* var arrGen = result.generate.split(',');
        angular.forEach($scope.arr_generate, function (elem, index) {
            var indx = arrGen.indexOf(elem.id) == -1;
            if (!indx) {
                $scope.arr_generate[index].chk = true;
            }
        }) */

        $scope.rec.company_reg_no = result.company_reg_no;
        $scope.bank_name = result.bill_bank_name;
        $scope.rec.account_name = result.account_name;
        $scope.rec.account_no = result.account_no;
        $scope.rec.swift_no = result.swift_no;
        $scope.rec.iban = result.iban;
        $scope.rec.sort_code = result.sort_code;
        $scope.rec.bill_bank_name = result.bill_bank_name;
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
    $scope.arr_finance_charges = [];
    var postFCData = { 'token': $scope.$root.token, 'all': "1", 'order_by': 'Charge ASC' };
    var getChargesUrl = $scope.$root.setup + "crm/finance-charges";
    $http
        .post(getChargesUrl, postFCData)
        .then(function (res) {
            $scope.arr_finance_charges = res.data.response;//res.data.record.result;
            // $scope.arr_finance_charges.push({ 'id': '-1', 'Charge': '++ Add New ++' });
        });

    $scope.arr_insurance_charges = [];
    var postICData = { 'token': $scope.$root.token, 'all': "1", 'order_by': 'Charge ASC' };
    var getIChargesUrl = $scope.$root.setup + "crm/insurance-charges";
    $http
        .post(getIChargesUrl, postICData)
        .then(function (res) {
            $scope.arr_insurance_charges = res.data.response;//res.data.record.result;
            // $scope.arr_insurance_charges.push({ 'id': '-1', 'Charge': '++ Add New ++' });
        });
    /* $scope.getOrders = function (item_paging) {

        //var custUrl = $scope.$root.pr + "srm/srminvoice/listing_order";
        var custUrl = $scope.$root.sales + "customer/customer/popup-listing";

        // var custUrl = $scope.$root.sales + "customer/customer/popup-listing-for-cust-sales-return";
        // $scope.$root.sales + "customer/order/all-orders";
        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.postData.all = 1;
        $scope.postData.type = 99;//2;

        if (item_paging == 1)$rootScope.item_paging.spage = 1;
        $scope.postData.page = $rootScope.item_paging.spage;
        $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;

        $scope.postData.searchKeyword_si = $scope.searchKeyword_si.searchBox;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword_si = {};
        }


        if (item_paging == 1)$rootScope.item_paging.spage = 1;

        $scope.postData.page = $rootScope.item_paging.spage;
        $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;
        $scope.postData.searchKeyword_cust = $scope.searchKeyword_cust.$;

        if ($scope.searchKeyword_cust.region !== undefined && $scope.searchKeyword_cust.region !== null) {
            $scope.postData.regions = $scope.searchKeyword.region.id;
        }

        if ($scope.searchKeyword_cust.segment !== undefined && $scope.searchKeyword_cust.segment !== null)
            $scope.postData.segments = $scope.searchKeyword_cust.segment.id;

        if ($scope.searchKeyword_cust.buying_group !== undefined && $scope.searchKeyword_cust.buying_group !== null)
            $scope.postData.buying_groups = $scope.searchKeyword_cust.buying_group.id;


        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword_cust = {};
            $scope.record_data = {};
        }


        $scope.showLoader = true;
        $timeout(function () {
            $http
                .post(custUrl, $scope.postData)
                .then(function (res) {
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
                    // $scope.saleOrders = res.data.response;
                    $scope.record = res.data.response;
                    angular.element('#customer_modal_single').modal({show: true});
                    angular.forEach(res.data.response['0'], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                });

            $scope.showLoader = false;
        }, 1000);
        // angular.element('#saleOrdersModal').modal({show: true});
    }

    $scope.confirmCustomer = function (result) {

        $scope.arrSalesperson = [];
        $scope.arrSalesperson.push(result.internal_sales);
        $scope.arrSalesperson.push(result.salesperson_id);
        $scope.arrSalesperson.push(result.support_person);
        $scope.rec.sale_person_id = result.salesperson_id;
        //console.log(result.salesperson_id);
        var empUrl = $scope.$root.hr + "employee/get-employee";
        if (result.salesperson_id > 0) {
            $http
                .post(empUrl, {id: result.salesperson_id, 'token': $scope.$root.token})
                .then(function (emp_data) {
                    if (emp_data.data.ack == true)
                        $scope.rec.sale_person = emp_data.data.response.first_name + ' ' + emp_data.data.response.last_name;
                });
        }
        // console.log(result);
        var objCust = {};
        $.each(result, function (index, elem) {
            // console.log($rootScope.arr_currency);
            if (index == 'currency_id') {
                $.each($rootScope.arr_currency, function (index, obj) {
                    if (obj.id === elem) $scope.rec.currency_id = obj;
                });
            }

            if (index == 'code') {
                $scope.rec.sell_to_cust_no = objCust.sell_to_cust_no = elem;
            }
            if (index == 'title') {
                $scope.rec.sell_to_cust_name = objCust.bill_to_customer = elem;
                $scope.$root.$broadcast("myEvent", {bill_to_customer: elem});
            }
            if (index == 'address_2')
                $scope.rec.sell_to_address = objCust.bill_to_address = elem;
            if (index == 'address_2')
                $scope.rec.sell_to_address2 = objCust.bill_to_address2 = elem;
            if (index == 'city')
                $scope.rec.sell_to_city = objCust.bill_to_city = elem;
            if (index == 'county')
                $scope.rec.sell_to_county = objCust.bill_to_county = elem;
            if (index == 'postcode')
                $scope.rec.sell_to_post_code = objCust.bill_to_post_code = elem;
            // if(index == 'phone')
            //  $scope.rec.cust_phone= objCust.cust_phone  = elem;
            //  if(index == 'fax')
            //  $scope.rec.cust_fax= objCust.cust_fax  = elem;
            //  if(index == 'email')
            //  $scope.rec.cust_email = objCust.cust_email = elem;
            if (index == 'country_id') {
                $.each($rootScope.country_type_arr, function (index, elems) {
                    if (elems.id == elem) $scope.rec.country_ids = elems;
                });
            }
        });
        $scope.rec.sell_to_cust_id = objCust.bill_to_cust_id = result.id;
        //$scope.$root.sell_to_cust_id = result.id;

        $scope.getAltContactByCustomer(result.id);

        $scope.$root.$broadcast("myEvent", {objCust: objCust});
        $scope.$root.$broadcast("setBillToCustomer", {bill_to_cust: objCust.bill_to_customer, id: result.id});

        /*   var finUrl = $scope.$root.sales + "customer/customer/get-customer-finance";//get-finance-by-customer-id";
         $http
         .post(finUrl, {customer_id: result.id, token: $scope.$root.token})
         .then(function (fres) {
         $scope.rec.account_payable_number = fres.data.response.account_payable_number;
         $scope.rec.account_payable_id = fres.data.response.account_payable_id;
         });
        angular.element('#customer_modal_single').modal('hide');

    } */

    $scope.getAltContactByCustomer = function (crm_id) {
        $scope.postData = { 'crm_id': crm_id, token: $scope.$root.token }
        var ApiAjax = $scope.$root.sales + "crm/crm/get-alt-contacts-list";
        $http
            .post(ApiAjax, $scope.postData)
            .then(function (alt_res) {
                if (alt_res.data.ack == true) {
                    $scope.rec.sell_to_contact_no = alt_res.data.response[0].name;
                    $scope.rec.cust_phone = alt_res.data.response[0].phone;
                    $scope.rec.cust_fax = alt_res.data.response[0].fax;
                    $scope.rec.cust_email = alt_res.data.response[0].email;
                    $scope.rec.sell_to_contact_id = alt_res.data.response[0].id;
                }
            });

    }

    $scope.addSaleOrder = function (ordr) {

        $scope.rec2.return_order_code = $scope.rec.return_order_code;
        $scope.rec2.return_order_no = $scope.rec.return_order_no;

        $scope.rec = ordr;

        $scope.rec.return_order_code = $scope.rec2.return_order_code;
        $scope.rec.return_order_no = $scope.rec2.return_order_no;

        $scope.rec.code = ordr.return_order_code;
        $scope.rec.order_id = ordr.id;
        $scope.rec.id = undefined;


        if (ordr.posting_date == 0)
            $scope.rec.posting_date = null;
        else
            $scope.rec.posting_date = $scope.$root.convert_unix_date_to_angular(ordr.posting_date);

        /*if (ordr.order_date == 0)
            $scope.rec.order_date = null;
        else
            $scope.rec.order_date = $scope.$root.convert_unix_date_to_angular(ordr.order_date);*/

        /*if (ordr.requested_delivery_date == 0)
            $scope.rec.requested_delivery_date = null;
        else
            $scope.rec.requested_delivery_date = $scope.$root.convert_unix_date_to_angular(ordr.requested_delivery_date);*/


        /* if (ordr.delivery_date == 0)
             $scope.rec.delivery_date = null;
         else
             $scope.rec.delivery_date = $scope.$root.convert_unix_date_to_angular(ordr.delivery_date);
 */

        $.each($rootScope.arr_currency, function (index, obj) {
            if (obj.id === ordr.currency_id) $scope.rec.currency_id = obj;
        });

        $.each($rootScope.country_type_arr, function (index, obj) {
            if (obj.id === ordr.country_id) $scope.rec.country_ids = obj;
        });

        angular.element('#saleOrdersModal').modal('hide');
        return;

        /* var getQuoteUrl = $scope.$root.pr + "srm/srminvoice/get-invoice";
         $http
         .post(getQuoteUrl, {id: ordr.purchase_order_id, token: $scope.$root.token})
         .then(function (pRes) {
         // /	if(pRes.data.response.quotation_no < 10)  	$scope.rec.purchase_order = 'PO00'+pRes.data.response.quotation_no;
         //                 else if(pRes.data.response.quotation_no > 10 && pRes.data.response.quotation_no < 100)
         //                 $scope.rec.purchase_order = 'PO0'+pRes.data.response.quotation_no;
         //                 else
         //                 $scope.rec.purchase_order = 'PO'+pRes.data.response.quotation_no;

         $scope.rec.purchase_order_id = pRes.data.response.id;
         });
         */
    }

    // $rootScope.get_country_list();

    $scope.formUrl = function () {
        return "app/views/return_orders/_form.html";
    }

    $scope.pOrders = [];
    $scope.getPurchaseOrders = function () {
        var ordrUrl = $scope.$root.pr + "srm/srminvoice/listings";
        $http
            .post(ordrUrl, { 'all': 1, type: 3, token: $scope.$root.token })
            .then(function (res) {
                $scope.pOrders = res.data.response;
            });
        angular.element('#purchaseOrderModal').modal({ show: true });
    }

    $scope.addPurchaseOrder = function (ordr) {
        /* $scope.rec.purchase_order = ordr.Code;
        $scope.rec.purchase_order_id = ordr.id;
        angular.element('#purchaseOrderModal').modal('hide'); */
        $scope.selectedPurchaseOrderArr = [];
        $scope.PendingSelectedPurchaseOrder = [];

        $scope.selectedPurchaseOrders = "";
        var selectedPurchaseOrders_name = "";

        angular.forEach($scope.PurchaseOrderArr, function (obj) {
            if (obj.chk == true) {
                //console.log(obj);
                /* $scope.substitueobj = {};
                $scope.substitueobj.description = obj.description;
                $scope.substitueobj.product_id = $scope.formData.product_id;
                $scope.substitueobj.rec_id = obj.id;
                $scope.substitueobj.substitute_product_id = obj.id; 
                $scope.PendingSelectedPurchaseOrder.push($scope.substitueobj);*/
                $scope.PendingSelectedPurchaseOrder.push(obj);
                //selectedPurchaseOrders_name += obj.description + "(" + obj.return_order_code + "); ";
                selectedPurchaseOrders_name += obj.order_code + "; ";
            }
        });

        $scope.selectedPurchaseOrders = selectedPurchaseOrders_name.substring(0, selectedPurchaseOrders_name.length - 2);
        $scope.selectedPurchaseOrderArr = $scope.PendingSelectedPurchaseOrder;
        angular.element('#_PurchaseOrdersModal').modal('hide');
    }

    /*-------------------------------------Pay Invoice--------------------------------*/

    var price = 0;
    var price_a = 0;
    var currency_id = 0;
    var converted_price = 0;
    $scope.cnv_rate = 0;
    $scope.validatePrice = function (order_date, total) {
        var price_a = 0
        var cnv_rate = 1;
        $scope.cnv_rate = 1;
        price_a = total;

        /*   if (item.credit_amount > 0 && type == 'lev1') {
               price_a = item.credit_amount;
               item.debit_amount = null;
           }
           else if (item.debit_amount > 0 && type == 'lev2') {
               price_a = item.debit_amount;
               item.credit_amount = null;
           }*/
        /*  else if (type == 'loop') {
              price_a = item.orignal_amount;
              /!*  angular.forEach($scope.receipt_sub_list, function (index, item) {
               if (index1 == index) {
               if (item.credit_amount > 0)   price_a = Number(item.credit_amount);
               else if (item.debit_amount > 0)    price_a = Number(item.debit_amount);
               }
               });*!/
          }*/

        currency_id = $scope.$root.c_currency_id;


        if (currency_id == $scope.$root.defaultCurrency) {
            $scope.converted_price = Number(price_a);

            //if (item.chk_credit) item.credit_amount = Number(price_a);

            // if (item.chk_debit)   item.debit_amount = Number(price_a);


            return;
        }
        //console.log(currency_id + order_date);

        var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
        $http
            .post(currencyURL, { 'id': $scope.$root.c_currency_id, token: $scope.$root.token, or_date: order_date })
            .then(function (res) {
                if (res.data.ack == true) {

                    if (res.data.response.conversion_rate == null) {
                        item.converted_price = null;
                        item.cnv_rate = null;
                        $scope.cnv_rate = null;
                        price.converted_price = null;

                        // if (item.chk_credit)  item.credit_amount = null;
                        // if (item.chk_debit)     item.debit_amount = null;

                        toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                        $('.cur_block').attr("disabled", true);
                        return;
                    }
                    else {

                        var newPrice1 = Number(price_a);
                        var newPrice = 0;

                        if (currency_id != $scope.$root.defaultCurrency)
                            newPrice = Number(newPrice1) / Number(res.data.response.conversion_rate);
                        else
                            newPrice = Number(newPrice1);

                        if (newPrice > 0)
                            converted_price = Number(newPrice).toFixed(2);
                        else
                            newPrice = 0;

                        
                        $scope.converted_price = converted_price;

                        $scope.cnv_rate = res.data.response.conversion_rate;
                        $scope.rec.currency_rate = res.data.response.conversion_rate;
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
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Conversion Rate in Setup']));
                    $('.cur_block').attr("disabled", true);
                    return;
                }

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
            var finUrl = $scope.$root.sales + "customer/customer/get-customer-finance";
            $http
                .post(finUrl, { 'customer_id': $scope.$root.crm_id, token: $scope.$root.token })
                .then(function (resp) {
                    if (resp.data.ack == true) {


                        if (resp.data.response.posting_group_id === undefined || resp.data.response.posting_group_id === null || resp.data.response.posting_group_id == 0) {

                            obj_rec.account_code = '';
                            obj_rec.account_id = '';
                            obj_rec.posting_group_id = '';

                            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(505));
                            return;
                        }

                        else {

                            obj_rec.account_code = $scope.rec.sell_to_cust_name + " - " + $scope.rec.sell_to_cust_no;
                            obj_rec.account_id = resp.data.response.bill_to_customer_id;
                            obj_rec.posting_group_id = resp.data.response.posting_group_id;

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
                        $scope.module_type = { 'value': 2, 'name': 'Customer' };

                        $scope.module_type_main = $scope.module_type.value;
                        $scope.doc_type = { 'id': 4, 'name': 'Credit Note' };
                        $scope.journal_datemain = $scope.$root.posting_date;
                        $scope.posting_groupmain = obj_rec.posting_group_id;

                        $scope.curency_code = obj_rec.currency_id.code;
                        $scope.select_curency_id = obj_rec.currency_id.id;


                        /*  if (item.cnv_rate)
                              $scope.cnv_rate = item.cnv_rate;
                          else
                              $scope.cnv_rate = 0;
                  
                          if (item.cnv_rate === undefined || item.cnv_rate === null || item.cnv_rate === 0) {
                              toaster.pop('error', 'info', 'Please Set convertion Rate');
                              return;
                          }*/


                        if ($scope.module_type === undefined) {
                            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Account Type']));
                            return;
                        }
                        else {


                            $scope.postData = {};
                            if (obj_rec.account_id == undefined) {
                                toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(231, ['Customer','Supplier']));
                                return;
                            }

                            $scope.cust_id = obj_rec.account_id;
                            //$scope.doc_type = $scope.doc_type.id;

                            if ($scope.module_type.value == 2) {
                                $scope.postData.type = 2;
                                $scope.postData.title = 'Customer ' + $scope.doc_type.name + ' (' + obj_rec.account_code + ')';
                            }

                            /* $scope.total_amount = total;
                              if ( $scope.total_amount  > 0)
                                 $scope.amount_total =  $scope.total_amount ;*/


                            $scope.final_amount = total;

                            // $scope.amount_total = Number(item.converted_price);
                            $scope.amount_total = $scope.final_amount;
                            $scope.payment_currency = $scope.select_curency_id

                            /* if (item.currency_id != $scope.$root.defaultCurrency)
                             $scope.converted_total_amount = item.converted_price;
                             */
                            $scope.current_currency_id = $scope.$root.c_currency_id;
                            $scope.journal_date = $scope.$root.posting_date;

                            $scope.postData.sell_to_cust_id = $scope.cust_id;
                            $scope.postData.token = $scope.$root.token;
                            $scope.postData.more_fields = 1;

                            if ($scope.module_type.value == 2 && $scope.doc_type.id == 4) {

                                var postUrl = $scope.$root.sales + "customer/order/listings";

                            }


                            $scope.postData.parent_id = $scope.$root.order_id;
                            $scope.postData.doc_type = $scope.doc_type.id;
                            $scope.postData.cust_id = $scope.cust_id;

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

            if (item.amount > Number(amount2))
                item.amount = Number(amount2);

        }

        if ($scope.amount_total < item.amount)
            item.amount = $scope.amount_total;


        //save conversion price in RECEIPt Journal for  Profit & Loss Accounts
        item.converted_price = (Number(item.amount) / Number(item.currency_rate)) - (Number(item.amount) / Number($scope.cnv_rate));
        /* //item.converted_price = (Number(item.amount) / Number(item.currency_rate));*/


        console.log(item.currency_rate);
        console.log($scope.cnv_rate);

        console.log(item.converted_price);

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
                new_amount = Number(obj.amount);
                temp.push({
                    id: obj.id, amount: obj.amount, total_allocatin: new_amount, posting_group: obj.posting_group,
                    allocate_id: obj.allocate_id, converted_price: obj.converted_price
                });

                //  if ($scope.doc_type == 1)
                if (obj.amount)
                    amount += Number(obj.amount);

                //save conversion price in RECEIPt Journal for  Profit & Loss Accounts
                // Foreign Currency Movement Gain & Loss
                //Indiviaual Entry  and Total sum entry on backend

                if ($scope.doc_type.id == 4 && $scope.select_curency_id !== $rootScope.defaultCurrency && (obj.converted_price != 0)) {


                    if (($scope.module_type.value == 2) && ($scope.posting_groupmain == 1))
                        account_id = $scope.postfianancedata.sales_gl_ac_uk_debators;
                    if (($scope.module_type.value == 2) && ($scope.posting_groupmain == 2))
                        account_id = $scope.postfianancedata.sales_gl_ac_eu_debators;
                    if (($scope.module_type.value == 2) && ($scope.posting_groupmain == 3))
                        account_id = $scope.postfianancedata.sales_gl_ac_eu_out_debators;


                    if (Number(obj.converted_price) > 0) {

                        if ($scope.module_type.value == 2) {
                            var inv_trans_type = 2;
                            var inv_trans_type_secnd = 1;
                        }
                        var account_debit = account_id;
                        var payed_account = $scope.postfianancedata.realised_movement_gl_ac;
                        //unrealised_movement_gl_ac;
                        console.log("Gain s");

                    }
                    else {


                        if ($scope.module_type.value == 2) {
                            var inv_trans_type = 1;
                            var inv_trans_type_secnd = 2;
                        }
                        var account_debit = account_id;
                        var payed_account = $scope.postfianancedata.realised_movement_gl_ac;
                        console.log(payed_account + '-' + account_debit);

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

        $timeout(function () {

            if (totalrelizecount) {
                toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(365));
                return;
            }

            if (amount > Number($scope.amount_total)) {
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
                post.cust_id = $scope.cust_id;
                post.invoice_id = $scope.$root.order_id;
                post.parent_id = $scope.$root.order_id;
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

                    });
            }
        }, 2000);

    }

    $scope.netTotalAmount = function () {
        var ctotal = 0;
        angular.forEach($scope.ReciptInvoiceModalarr, function (item) {
            if (item.amount >= 0)
                ctotal += Number(item.amount);
        });

        // return Number(Math.round($scope.amount_total - ctotal).toFixed($scope.$root.decimal_range));
        return Number(($scope.amount_total - ctotal));
    }



    /*------------------------------------*Pay Invoice*--------------------------------*/

    /*------------------------------------*Print Credit Note*--------------------------------*/

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
        // console.log('inside function');
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

        $scope.print_invoice_vals = {};
        var prntInvoiceUrl = $scope.$root.sales + "customer/order/print-invoice";

        $rootScope.printinvoiceFlag = false;
        $scope.showLoader = true;

        $http
            .post(prntInvoiceUrl, {
                id: $scope.$root.order_id,
                'type': '4',
                'templateType': templateType,
                token: $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    serviceVariables.generatedPDF = res.data.path;
                    $scope.print_invoice_vals = res.data.response;
                    $scope.print_invoice_vals.discountedValue = $rootScope.discountedCreditNote;
                    $scope.print_invoice_vals.netValue = $rootScope.netValueCreditNote;
                    $scope.print_invoice_vals.vatValue = $rootScope.vatValueCreditNote;
                    $scope.print_invoice_vals.grandTotal = $rootScope.grandTotalCreditNote;
                    $scope.print_invoice_vals.templateType = templateType;
                    
                    console.log($scope.print_invoice_vals);
                    console.log($scope.print_invoice_vals.doc_details_arr);

                    /* if ($scope.print_invoice_vals.address_1 == $scope.print_invoice_vals.ship_address_1 
                        && $scope.print_invoice_vals.address_2 == $scope.print_invoice_vals.ship_address_2
                        && $scope.print_invoice_vals.postcode == $scope.print_invoice_vals.ship_postcode){
                        $scope.print_invoice_vals.ship_address_1 = '';
                        $scope.print_invoice_vals.ship_address_2 = '';
                        $scope.print_invoice_vals.ship_city = '';
                        $scope.print_invoice_vals.ship_county = '';
                        $scope.print_invoice_vals.ship_postcode = '';
                    } */

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
                        templateUrl: 'app/views/invoice_templates/credit_note_modal.html',
                        controller: 'creditNoteModalController',
                        inputs: {
                            noModal: noModal,
                            print_invoice_vals: $scope.print_invoice_vals,
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

myApp.controller('ReturnOrderTabController', ReturnOrderTabController);
function ReturnOrderTabController($scope, $rootScope, $stateParams, $http, $state, $resource, toaster, ngDialog, $timeout, myService, $filter, ModalService, generatePdf, moduleTracker) {


    moduleTracker.updateName("credit_note");
    // moduleTracker.updateRecord("");

    /* $rootScope.updateSelectedGlobalData("item");
    $scope.tempProdArr = [];
    var refreshId = setInterval(function () {
        if (($rootScope.prooduct_arr != undefined && $rootScope.prooduct_arr.length > 0)) {
            angular.copy($rootScope.prooduct_arr, $scope.tempProdArr);
            clearInterval(refreshId);
        }
    }, 500); */

    $scope.tempProdArr = [];
    var itemListingApi = $scope.$root.stock + "products-listing/item-popup";

    $scope.showLoader = true;

    $http
    .post(itemListingApi, { 'token': $scope.$root.token, 'credit_note_id':$rootScope.order_id, 'no_permission':1 })
    .then(function (res) {
        if (res.data.ack == true) {
            angular.forEach(res.data.response, function (value, key) {
                if (key != "tbl_meta_data") {
                    $scope.tempProdArr.push(value);
                }
            });                
    
            if($scope.tempProdArr.length == 0)
                $scope.tempProdArr.push({'id':0});
            
            $scope.getOrdersDetail(1); 
            $scope.showLoader = false;
        }
        else
        {
            $scope.tempProdArr.push({'id':0});
            $scope.showLoader = false;
        }
    });


    if ($stateParams.id > 0)
        $scope.check_so_readonly = true;
    $scope.$root.order_id = $stateParams.id;
    $scope.showEditForm = function () {
        if($scope.approvals_lock_order == 1)
        {
            $rootScope.approval_message = "The Credit Note is already approved. \n 1) Press Unlock to enable complete edit access to the document. It will need to be send for approval again. \n 2) Press Edit to edit general information only.";
            $rootScope.approval_type = "Unlock";
            ngDialog.openConfirm({
                template: '_confirm_approval_confirmation_modal2',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                $scope.showLoader = true;
                var postUrl = $scope.$root.setup + "general/unlock-approved-order";
                //'warehouse_id': item.warehouses.id
                $http
                    .post(postUrl, {
                        'object_id': $scope.$root.order_id,
                        'type': "3, 8",
                        'token': $scope.$root.token
                    })
                    .then(function (res) {
                        if (res.data.ack == true) {
                            $scope.showLoader = false;
                            $scope.check_so_readonly = false;
                            $scope.$parent.check_so_readonly = false;
                            $scope.approvals_lock_order = 0;
                        }
                        else
                        {
                            $scope.showLoader = false;
                            $scope.check_so_readonly = false;
                            $scope.$parent.check_so_readonly = false;
                        }
                    });
            },
            function (reason) {
                $scope.showLoader = false;
                $scope.check_so_readonly = false;
                $scope.$parent.check_so_readonly = false;
                console.log('Modal promise rejected. Reason: ', reason);
            });
        }
        else
        {
            $scope.check_so_readonly = false;
            $scope.$parent.check_so_readonly = false;
        }
    }

    $scope.submit_show_invoicee = true;

    //$scope.arrItems = [{'label':' ','value':3},{'label':'Item(s)','value':0},{'label':'Service(s)','value':2}}];
    $scope.arrItems = [{ 'label': ' ', 'value': 3 }, { 'label': 'Item(s)', 'value': 0 }, {
        'label': 'G/L Account',
        'value': 1
    }];

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
                                  { 'title': 'This is a Zero rated EC Supply', 'id': "3" }, { 'title': 'This supply is outside the scope of VAT', 'id': "4" }];

    $scope.default_currency_code = $rootScope.defaultCurrencyCode;
    $scope.company_name = $rootScope.company_name;
    $scope.currency_code = '';
    $scope.products = [];
    $scope.arr_categories = {};
    $scope.recs = {};
    // $scope.rec = {};
    $scope.wordsLength = 0;
    $scope.rec.item_types = $scope.arrItems[0];
    $scope.enable_btn_dispatch = false;
    $scope.enable_btn_invoice = false;
    $scope.sale_order_id = 0;

    $scope.title = 'Order Return';
    $scope.btnCancelUrl = 'app.srm_order_return';


    $scope.$on("orderTabEvent", function (event, comment) {
        if (comment != null) {
            $scope.rec.note = comment;
            $scope.wordsLength = comment.length;
        }
    });

    $scope.$on("getSaleOrderId", function (event, sale_order_id) {
        $scope.sale_order_id = sale_order_id;
    });

    /* 
        $scope.service_arr_units = [];
        var umUrl = $scope.$root.setup + "service/unit-measure/units";
        $http
            .post(umUrl, { 'token': $scope.$root.token })
            .then(function (res) {
                if (res.data.ack == true) $scope.service_arr_units = res.data.response;
    
            });
    
    
        $scope.arr_warehouse = [];
        var whUrl = $scope.$root.setup + "warehouse/get-all-list";
    
        $http
            .post(whUrl, { 'token': $scope.$root.token })
            .then(function (res) {
                if (res.data.ack == true) $scope.arr_warehouse = res.data.response;
    
            });
    
    
        $scope.glarr_units = [];
        var gl_unitUrl_item = $scope.$root.setup + "general/get-all-gl-units-of-measure";
        $http
            .post(gl_unitUrl_item, { 'token': $scope.$root.token })
            .then(function (res) {
                if (res.data.ack == true) $scope.glarr_units = res.data.response;
    
            }); */

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
                token: $scope.$root.token
            };
        }

        $scope.record = {};
        // var prodApi = $scope.$root.sales + 'customer/order/get-order-items'
        //var prodApi = $scope.$root.stock+"products-listing/get-purchase-products-popup";
        //var prodApi = $scope.$root.stock + "products-listing/get-products-setup-list";
        //sales invoices products of specific customer
        var prodApi = $scope.$root.stock + "products-listing/get-sales-products-popup";
        //console.log($scope.$root.crm_id);
        $http
            .post(prodApi, {
                cust_id: $scope.$root.crm_id,
                or_date: $scope.$root.posting_date,
                token: $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.products = [];
                    $.each(res.data.response, function (index, obj) {
                        obj.chk = false;
                        $scope.products[index] = obj;
                    });
                }
                else {
                    $scope.products = [];
                }
            });


    }


    //------------- Services ---------------------

    $scope.getServices = function (recs, parm) {
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
                token: $scope.$root.token
            };
        }

        $scope.record = {};
        var prodApi = $scope.$root.setup + "service/products-listing/get-products-popup";
        $http
            .post(prodApi, $scope.postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.products = [];
                    $.each(res.data.response, function (index, obj) {
                        obj.chk = false;
                        $scope.products[index] = obj;
                    });
                }
                else {
                    $scope.products = [];
                }
            });


    }

    angular.element(document).on('click', '.checkAll', function () {
        if (angular.element('.checkAll').is(':checked') == true) {
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

    $scope.selectProd = function (id) {
        for (var i = 0; i < $scope.products.length; i++) {
            if (id == $scope.products[i].id) {
                if ($scope.products[i].chk == true)
                    $scope.products[i].chk = false
                else
                    $scope.products[i].chk = true
            }
        }
    }


    $scope.getPriceOffers = function (type) // 1-> popup, 2-> order_items
    {
        var getpriceOffersUrl = $rootScope.sales + "crm/crm/get-items-price-offers-by-custid";
        $scope.price_offer_arr = [];
        $http
            .post(getpriceOffersUrl, { 'token': $rootScope.token, 'crm_id': $rootScope.crm_id })
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

    $scope.category_list_final = {};
    $scope.category_sub = {};
    $scope.category_list_data_one = {};
    $scope.category_list_data_second = {};
    $scope.category_list_data_third = {};
    //var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";
    $scope.selectItem = function (item_type, rec) {

        if (!(Number($scope.rec.sale_invoice_id) > 0) && item_type==0) {
            toaster.pop('error', 'Error', 'Please select an invoice first');
            return false;
        }
        $scope.item_type = item_type;// rec.item_types.value;
        $scope.selectedAllOrderItem = false;
        if (!($scope.rec.id > 0)) {
            //console.log("updating");
            $scope.saverecord = $scope.add_general(rec, 1);
        }
        $scope.invoice_code = $scope.rec.sale_invoice;
        if ($scope.item_type == 0) {
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

            // $rootScope.updateSelectedGlobalData("item");

            $scope.tempProdArr = [];
            var getCreditNodeItems = $scope.$root.sales + "customer/return-order/get-credit-note-items";
            $scope.showLoader = true;
            $http
                .post(getCreditNodeItems, { 'token': $scope.$root.token, 'crm_id': $scope.rec.sell_to_cust_id, 'invoice_id': $scope.rec.sale_invoice_id })
                .then(function (res) {
                    if (res.data.ack == true) {

                        $scope.tempProdArr = res.data.response;
                        // $scope.getPriceOffers(1);

                        for (var i = 0; i < $scope.tempProdArr.length; i++) {
                            $scope.tempProdArr[i].chk = false;
                        }
                        angular.element('#productModal').modal({ show: true });
                        
                        $scope.showLoader = false;
                    }
                    else
                    {
                        $scope.showLoader = false;
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                    }    
                });

            // $scope.showLoader = false;
        }
        else if ($scope.item_type == 1) {
            $scope.gl_accounts(1, 77);
            $scope.filterGL= {};
            $scope.filterGL.search = "";
            angular.element('#accthead_modal').modal({ show: true });
        }
        else if ($scope.item_type == 2) {
            var getListUrl = $scope.$root.setup + "service/categories/get-all-categories";
            $http
                .post(getListUrl, { 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.arr_categories = {};
                        $scope.arr_categories = res.data.response;
                    }
                });
            $scope.getServices('', 'all');
            angular.element('#serviceModal').modal({ show: true });
        }
    }

    /* $scope.selectItem = function (rec) {
        $scope.item_type = rec.item_types.value;
        if ($scope.item_type == 0) {
            var getListUrl = $scope.$root.sales + "stock/categories";
            $http
                .post(getListUrl, {'token': $scope.$root.token})
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.arr_categories = {};
                        $scope.arr_categories = res.data.response;
                    }
                });
            $scope.getProducts('', 'all');
            angular.element('#productModal').modal({show: true});
        }
        else if ($scope.item_type == 1) {
            $scope.gl_accounts(1, 77);
            angular.element('#accthead_modal').modal({show: true});
        }
        else if ($scope.item_type == 2) {
            var getListUrl = $scope.$root.setup + "service/categories/get-all-categories";
            $http
                .post(getListUrl, {'token': $scope.$root.token})
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.arr_categories = {};
                        $scope.arr_categories = res.data.response;
                    }
                });
            $scope.getServices('', 'all');
            angular.element('#serviceModal').modal({show: true});
        }
    } */
    $scope.searchKeyword_sup_gl_code = {};

    $scope.gl_accounts = function (item_paging, clr) {
        //console.log($scope.item_type);
        $scope.showLoader = true;
        $scope.postData = {};

        //{'token': $scope.$root.token, 'display_id': 10}

        $scope.postData.token = $scope.$root.token;
        $scope.postData.display_id = 10;

        if (item_paging == 1) $rootScope.item_paging.spage = 1;
        $scope.postData.page = $rootScope.item_paging.spage;

        $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;

        $scope.postData.searchKeyword = "";

        $scope.postData.searchKeyword = $scope.searchKeyword_sup_gl_code.$;
        if (clr == 77) $scope.searchKeyword_sup_gl_code = {};


        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword_sup_gl_code = {};
            $scope.record_data = {};
        }
        var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";
        // $timeout(function () {
        $http
            .post(postUrl_cat, $scope.postData)
            .then(function (res) {
                if (res.data.ack == true)
                {
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
                }
            });
        $scope.showLoader = false;
        // }, 1000);
    }

    $scope.getCode = function (rec, rec2, flg) {

        // var getCrmCodeUrl = $scope.$root.pr + "srm/srminvoice/get-quote-code";
        var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
        var name = $scope.$root.base64_encode('return_orders');
        var no = $scope.$root.base64_encode('return_order_no');

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
                    'm_id': 110,
                    'no': no,
                    'category': '',
                    'brand': '',
                    'module_category_id': module_category_id,
                    'type': '1,2'
                })
                .then(function (res) {

                    if (res.data.ack == 1) {


                        $scope.rec.return_order_code = res.data.code;
                        $scope.$root.model_code = res.data.code;
                        $scope.rec.return_order_no = res.data.nubmer;
                        $scope.rec.code_type = module_category_id;//res.data.code_type;
                        $scope.count_result++;

                        if (res.data.type == 1) {
                            $scope.product_type = false;
                        }
                        else {
                            $scope.product_type = true;
                        }

                        if ($scope.count_result > 0) {
                            console.log($scope.count_result);
                            $scope.UpdateForm(rec, rec2, flg);
                            return true;
                        }
                        else {
                            console.log($scope.count_result + 'd');
                            return false;
                        }

                    }
                    else {
                        toaster.pop('error', 'Error', res.data.error);
                        return false;
                    }
                });
        }

    }

    $scope.UpdateForm = function (rec, rec2, flg, invoice_post) {

        var addOrderUrl = $scope.$root.sales + "customer/return-order/add-order";

        $http
            .post(addOrderUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    // 

                    // if ($stateParams.id === undefined) {
                    //  $scope.$root.crm_id = rec.sell_to_cust_id;
                    moduleTracker.updateRecord(res.data.id);
                    moduleTracker.updateRecordName(res.data.return_order_code);

                    var id = res.data.id;
                    $scope.rec.id = res.data.id;
                    $scope.rec.return_order_code = res.data.return_order_code;
            
                    $scope.$root.order_id = id;
                    $scope.$root.order_date = res.data.order_date;
                    $scope.$root.posting_date = res.data.posting_date;

                    $scope.$root.crm_id = rec.sell_to_cust_id;
                    if ($scope.items.length > 0) {
                        $scope.add_sublist(rec2, flg, invoice_post);
                    }
                    else if (flg == 1) {
                        $scope.$parent.check_so_readonly = true;
                        $scope.check_so_readonly = true;
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));
                        // $state.go("app.editReturnOrder", { id: $scope.$root.order_id });
                    }
                    if(Number(rec2) == 1)
                        $scope.GetSalesOrderStages();


                    if ($scope.$root.breadcrumbs.length > 3) {

                        if ($scope.rec.return_order_code)
                            $scope.$root.model_code = $scope.rec.sell_to_cust_name + ' (' + $scope.rec.return_order_code + ')';
                        else
                            $scope.$root.model_code = $scope.rec.sell_to_cust_name;

                        $scope.$root.breadcrumbs[3].name = $scope.$root.model_code;
                    }


                    // $rootScope.updateSelectedGlobalData("item");
                    // angular.element('#orders_tabs ul li').removeClass('dont-click');
                    // //$scope.$root.$broadcast("myEvent", {order_id: id});
                    // $state.go("app.editOrder", { id: res.data.id });
                    // console.log('d');
                    return true;
                    // }

                }
                else {
                     toaster.pop('error', 'Error', res.data.error);
                    return false;
                }

            });

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

                    $.each($rootScope.arr_vat_post_grp_sales, function (index, obj) {
                        if (obj.id == $scope.acItem.Vat)
                        {
                            $scope.acItem.vats = obj;
                            $scope.acItem.vat_id = obj.id;
                        }
                    });

                    $scope.items.push($scope.acItem);
                    ///$scope.$root.return_status = true;
                }
            });

        $('#accthead_modal').modal('hide');

    };
    $scope.wordsLength = 0;
    $scope.showWordsLimits_invoice = function (val) {
        $scope.wordsLength = val;
    }

    /* $scope.addProduct = function () {
        //var return_value;
        if ($scope.rec.item_types.value == 0) {

            $.each($scope.products, function (index, elem) {
                if (elem.chk == true) {
                    var detail = {};
                    //detail.order_id = elem.order_id;
                    //detail.update_id = elem.id;
                    detail.id = elem.item_id;
                    detail.id = elem.id;
                    detail.description = elem.product_description;//item_name;
                    detail.product_code = elem.product_code;

                    

                    detail.stock_check = elem.stock_check;
                    detail.standard_price = elem.unit_price;
                    detail.qty = Number(elem.qty);
                    detail.soled_qty = Number(elem.qty);
                    detail.unit_of_measure_name = elem.unit_measure;
                    detail.unit_id = elem.unit_measure_id;
                    detail.unit_parent = elem.unit_parent_id;
                    detail.sale_unit_qty = elem.unit_qty;
                    detail.category_id = elem.cat_id;
                    detail.item_type = 0;//elem.type;
                    detail.discount = Number(elem.discount);
                    detail.sale_unit_id = elem.sale_unit_id;
                    detail.purchase_unit_id = elem.purchase_unit_id;


                    detail.arr_units = [];
                    var unitUrl_item = $scope.$root.sales + "stock/unit-measure/get-unit-setup-list-category";
                    $http
                        .post(unitUrl_item, {'token': $scope.$root.token, 'item_id': detail.id})
                        .then(function (res) {
                            if (res.data.ack == true) {
                                detail.arr_units = res.data.response;
                            }
                        });

                    
                    //console.log(detail.arr_warehouse);
                    detail.primary_unit_of_measure_id = elem.primary_unit_of_measure_id;
                    detail.primary_unit_of_measure_name = elem.primary_unit_of_measure_name;

                    $.each($scope.arr_discount_type, function (index, obj) {
                        if (obj.id == elem.discount_type)
                            detail.discount_type_id = obj;
                    });
                    $.each($scope.arr_vat, function (index, obj) {
                        if (obj.id == elem.vat_rate_id)
                            detail.vats = obj;
                    });

                    if (elem.type == 2) {
                        $.each($scope.arr_service_units, function (index, obj) {
                            if (obj.id == elem.unit_measure_id)
                                detail.units = obj;
                        });
                    }
                    $.each($scope.arr_warehouse, function (index, obj) {
                        if (obj.id == elem.warehouse_id)
                            detail.warehouses = obj;
                    });
                    $timeout(function () {
                        $scope.$root.$apply(function () {

                            var count = $scope.items.length - 1;
                            $.each(detail.arr_units, function (index, obj) {
                                if (obj.id == elem.unit_measure_id) {
                                    //$scope.items[detIndex].units = obj;
                                    detail.units = obj;
                                }
                            });
                            $.each(detail.arr_units, function (index, obj) {
                                if (obj.id == elem.default_unit_measure_id)
                                    $scope.items[detIndex].default_units = obj;
                            });

                            // console.log(detail.arr_warehouse);
                            //detail.warehouses= detail.arr_warehouse[0];
                        });
                    }, 2000);
                    detail.remainig_qty = detail.qty;
                    detail.sale_status = 0;
                    var getAllStockUrl = $scope.$root.sales + "warehouse/get-order-stock-allocation";
                    $http
                        .post(getAllStockUrl, {
                            type: 2,
                            item_id: elem.item_id,
                            order_id: $scope.$root.order_id,
                            'token': $scope.$root.token
                        })
                        .then(function (res) {
                            if (res.data.ack == true) {
                                detail.sale_status = res.data.response[0].sale_status;
                                var ordqty = 0;
                                $.each(res.data.response, function (index, elem) {
                                    ordqty = Number(ordqty) + Number(elem.quantity);
                                });
                                detail.remainig_qty = Number(detail.qty) - Number(ordqty);
                            }
                            else {
                                detail.remainig_qty = detail.qty;
                                detail.sale_status = 0;
                            }
                        });

                    $scope.items.push(detail);
                }
            });

            // $scope.rec.item_types = $scope.arrItems[0];
            angular.element('#productModal').modal('hide');
        }
        else if ($scope.rec.item_types.value == 2) {


            $.each($scope.products, function (index, prodData) {
                if (prodData.chk == true) {
                    if ($scope.$root.crm_id == 0) {
                        toaster.pop('error', 'Error', 'Please select customer first!');
                        //return false;
                        $scope.$root.return_status = false;
                    }


                    prodData.item_type = $scope.rec.item_types.value;

                    var finApi = $scope.$root.sales + "customer/customer/get-finance-by-customer-id";
                    $http
                        .post(finApi, {'customer_id': $scope.$root.crm_id, token: $rootScope.token})
                        .then(function (res) {
                            if (res.data.ack == true) {
                                
                                var vatApi = $scope.$root.setup + "ledger-group/get-vat";
                                $http
                                    .post(vatApi, {token: $rootScope.token, 'id': prodData.vat_rate_id})
                                    .then(function (vtData) {
                                        

                                        var catUnit = $scope.$root.setup + "service/cat-unit/get-cat-unit-by-cat-nd-unit_id";
                                        $http
                                            .post(catUnit, {
                                                'item_id': prodData.category_id,
                                                'unit_id': prodData.unit_id,
                                                token: $rootScope.token
                                            })
                                            .then(function (cumData) {
                                                if (cumData.data.ack != true) {
                                                    toaster.pop('error', 'Info', 'Please set the units of measure for ' + prodData.description + '!');
                                                    $scope.$root.return_status = false;
                                                    //return false;
                                                }
                                                else {
                                                    var umUrl = $scope.$root.setup + "service/unit-measure/get-unit";
                                                    $http
                                                        .post(umUrl, {id: prodData.unit_id, token: $rootScope.token})
                                                        .then(function (umData) {
                                                            if (umData.data.ack != true) {
                                                                toaster.pop('error', 'Info', 'Please set the record in units of measure for ' + prodData.description + '!');
                                                                $scope.$root.return_status = false;
                                                                //return false;
                                                            }
                                                            else {
                                                                if (umData.data.response.parent_id !== '0') {
                                                                    $http
                                                                        .post(catUnit, {
                                                                            'category_id': prodData.category_id,
                                                                            'unit_id': umData.data.response.parent_id,
                                                                            token: $rootScope.token
                                                                        })
                                                                        .then(function (c2umData) {
                                                                            if (c2umData.data.ack != true) {
                                                                                toaster.pop('error', 'Error2', 'Please set the record in category units of measure for ' + prodData.description + '!');
                                                                                $scope.$root.return_status = false;
                                                                                //return false;

                                                                            }
                                                                            else
                                                                                prodData.sale_unit_qty = c2umData.data.response.value;
                                                                        });
                                                                }
                                                                else {
                                                                    prodData.sale_unit_qty = cumData.data.response.value;

                                                                }
                                                            }
                                                            prodData.stock_check = prodData.stock_check;

                                                            prodData.product_code = prodData.code;
                                                            prodData.vat = vtData.data.response != undefined ? vtData.data.response.vat_name : '';
                                                            prodData.vat_value = vtData.data.response != undefined ? vtData.data.response.vat_value : 0;
                                                            prodData.vat_id = vtData.data.response != undefined ? vtData.data.response.id : 0;
                                                            prodData.qty = 1;
                                                            prodData.sale_unit_id = prodData.unit_id;
                                                            prodData.purchase_unit_id = prodData.purchase_measure;
                                                            prodData.unit_parent = umData.data.response.parent_id;

                                                            $.each($scope.arr_vat, function (index, obj) {
                                                                if (obj.id == prodData.vat_id)
                                                                    prodData.vats = obj;
                                                            });

                                                            $.each($scope.arr_units, function (index, obj) {
                                                                if (obj.id == prodData.sale_unit_id)
                                                                    prodData.units = obj;
                                                            });

                                                            

                                                            $scope.items.push(prodData);

                                                            $scope.$root.return_status = true;
                                                            //},1000);

                                                        });

                                                }
                                            });

                                        //}
                                    });

                                //}
                            }
                            else {
                                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(505));
                            }
                        });
                }
            });
            $scope.rec.item_types = $scope.arrItems[0];
            //if($scope.$root.return_status == true)
            angular.element('#serviceModal').modal('hide');

        }
        else {

            var acItem = {};
            if (prodData.account_type != 1) {
                toaster.pop('error', 'Error', 'Account Type must be posting!');
                return false;
            }
            var accUrl = $scope.$root.setup + "ledger-group/get-ledger-posting";
            $http
                .post(accUrl, {
                    'account': prodData.number,
                    'order_type': prodData.account_type,
                    token: $rootScope.token
                })
                .then(function (acData) {
                    if (acData.data.ack == false) {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                        $scope.$root.return_status = false;
                    }
                    else {
                        var ledgEntryUrl = $scope.$root.setup + "ledger-group/get-general-ledger-entry";
                        $http
                            .post(ledgEntryUrl, {
                                'business_posting_title': acData.result.vat_bus_posting,
                                'product_posting_title': acData.result.vat_prod_posting,
                                token: $rootScope.token
                            })
                            .then(function (gData) {
                                if (gData.data.ack == false) {
                                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                                    $scope.$root.return_status = false;
                                }
                                else {

                                    var vatsetpUrl = $scope.$root.setup + "ledger-group/get-account-head";
                                    $http
                                        .post(vatsetpUrl, {
                                            'customer': gData.result.business_posting,
                                            'product': gData.result.product_posting,
                                            token: $rootScope.token
                                        })
                                        .then(function (vtData) {
                                            if (gData.data.ack == false) {
                                                toaster.pop('error', 'Error', 'Please set the VAT first!');
                                                $scope.$root.return_status = false;
                                            }
                                            else {

                                                var vatsetpUrl = $scope.$root.setup + "ledger-group/get-account-head";
                                                $http
                                                    .post(vatsetpUrl, {
                                                        'number': prodData.number,
                                                        'account_type': 'Posting',
                                                        token: $rootScope.token
                                                    })
                                                    .then(function (acHead) {
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


        $scope.rec.item_types = $scope.arrItems[0];
    }
 */

    $scope.checkAllOrderItem = function (val, category, brand, unit) {
        $scope.PendingSelectedOrderItems = [];
        let filtered;
        var selection_filter = $filter('filter');
		filtered = selection_filter($scope.tempProdArr, $scope.filterOrderItem.search);
		filtered = selection_filter(filtered, category);
		filtered = selection_filter(filtered, brand);
		filtered = selection_filter(filtered, unit);
        if (val == true) {
            angular.forEach(filtered, function (obj) {

                obj.chk = val;

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
            angular.forEach($scope.tempProdArr, function (obj) {
                if (!obj.disableCheck)
                    obj.chk = false;
            });
            $scope.PendingSelectedOrderItems = [];
        }
    }

    $scope.clearPendingOrderItems = function () {
        $scope.PendingSelectedOrderItems = [];
        angular.element('#productModal').modal('hide');
    }
    $scope.validate_allocated_qty = function (item) {
        if(Number(item.qty) < 0)
        {
            var str = (Number(item.allocated_stock > 0)) ? ', '+item.allocated_stock+' already allocated ' : '';
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(574, [str]));
            item.qty = (Number(item.allocated_stock)) ? item.allocated_stock : 1;
            item.remainig_qty = 0;
            item.sale_status = 1;
            return;
        }
        
        if (item.qty < item.allocated_stock) {
            toaster.pop('warning', 'Info', String(item.allocated_stock) + ' quantity is already allocated');
            item.qty = item.allocated_stock;
            item.sale_status = 1;
            item.remainig_qty = 0;
        }
        else if (item.qty == item.allocated_stock) {
            item.remainig_qty = 0;
        }
    }
    $scope.check_min_max = function (item) {
        /* 
        if (item.item_type == 0) {
            // var item_ = $filter("filter")(item.arr_warehouse, { id: item.warehouses.id });
            var item_ = $filter("filter")(item.arr_warehouse, { id: item.warehouses });
            if (item_.length > 0) {
                if (Number(item_[0].available_quantity) < Number(item.qty)) {
                    toaster.pop('warning', 'Info', 'Available quantity is less than item quantity!');
                    item.qty = "";
                    return false;
                }
            }
        } */
        // Validation for price offers
        /* if (item.arr_volume_discounts != undefined && item.arr_volume_discounts.length) {
            var flg = 0;
            angular.forEach(item.arr_volume_discounts, function (obj) {
                if (Number(item.qty) >= Number(obj.min_qty)) {
                    flg = 1;
                    if (obj.discount_type == 1) // %
                        item.standard_price = parseFloat(item.price_offer) - parseFloat(item.price_offer) * (parseFloat(obj.volume_discount) / 100);
                    else // value
                        item.standard_price = parseFloat(item.price_offer) - parseFloat(obj.volume_discount);
                    item.standard_price = Number(item.standard_price.toFixed(2));
                }
            });
            if (!flg)
                item.standard_price = Number(item.price_offer);
        } */

        // Validation for price offers
        /* if (item.item_type == 0) {
            if (item.arr_volume_discounts != undefined && item.arr_volume_discounts.length) 
            {
                var flg = 0;
                angular.forEach(item.arr_volume_discounts, function (obj) {
                    if (Number(item.qty) >= Number(obj.min_qty)) {
                        flg = 1;
                        if (obj.discount_type == 1) // %
                            item.standard_price = parseFloat(item.price_offer) - parseFloat(item.price_offer) * (parseFloat(obj.volume_discount) / 100);
                        else // value
                            item.standard_price = parseFloat(item.price_offer) - parseFloat(obj.volume_discount);
                        item.standard_price = Number(item.standard_price.toFixed(2));
                    }
                });
                if (!flg)
                    item.standard_price = Number(item.price_offer);            
                else
                    toaster.pop('warning', 'Info', 'Standard price changed to ' +(String(item.standard_price)) +' from customer price offer');
            }
            else if(item.arr_sales_price.length > 0)
            {
                var flg = 0;
                angular.forEach(item.arr_sales_price, function (obj) {
                    if (Number(item.qty) >= Number(obj.min)) {
                        flg = 1;
                        if (obj.discountType == 1) // %
                            item.standard_price = parseFloat(item.standard_price) - parseFloat(item.standard_price) * (parseFloat(obj.discount) / 100);
                        else // value
                            item.standard_price = parseFloat(item.standard_price) - parseFloat(obj.discount);
                        item.standard_price = Number(item.standard_price.toFixed(2));
                    }
                });
                if (!flg)
                    item.standard_price = Number(item.standard_price);
                else
                    toaster.pop('warning', 'Info', 'Standard price changed to ' +(String(item.standard_price)) +' from item sales price');
            }
        } */
    }

    
    $scope.$on('LoadOderItems', function (e) {
        // $scope.getOrdersDetail(1);
        $scope.load_item_counter = 0;
        $scope.showLoader = true;
        var refreshId = setInterval(function () {
            if (($scope.tempProdArr != undefined && $scope.tempProdArr.length > 0)) {
                $scope.getOrdersDetail(1);
                clearInterval(refreshId);
                $scope.showLoader = false;
            }
            $scope.showLoader = true;
            $scope.load_item_counter += 1;
            if ($scope.load_item_counter > 20) {
                $timeout(function () {
                    toaster.pop('error', 'Error', 'Server is not responding');
                    location.reload(true); // true for clear the cache
                }, 1000);
            }
        }, 500);

        // $scope.$parent.itempromotion = $scope.OnChangeOrderDateUpdatePromotion();
    });
    
    $scope.addProduct = function () {

        if ($scope.item_type == 0) {
            var finUrl = $scope.$root.sales + "customer/customer/get-customer-finance";//get-finance-by-customer-id";
            //console.log($scope.rec.sell_to_cust_id );
            //console.log($scope.$root.crm_id);
            //console.log($scope.rec.bill_to_cust_id);
            $scope.hide_dispatch_btn = false;
            $http
                .post(finUrl, { 'customer_id': $scope.$root.crm_id, token: $rootScope.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                    }
                    else {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(505));
                        return;
                    }
                });
            // console.log($scope.tempProdArr);
            // console.log($scope.products);

            angular.forEach($scope.tempProdArr, function (prodData) {
                if (prodData.chk == true) {
                    if ($scope.$root.crm_id == 0) {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Customer No.']));

                        $scope.$root.return_status = false;
                        return;
                    }
                    /* 
                    prodData.standard_price = Number(prodData.price_offer) > 0 ? Number(prodData.price_offer) : Number(prodData.standard_price);
                    
                    if(prodData.arr_sales_price.response.length > 0)
                    {
                        prodData.arr_sales_price = prodData.arr_sales_price.response;
                    }  
                    else
                    {
                        prodData.arr_sales_price = [];
                    }
                     */
                    $scope.org_qty = Number(prodData.qty);

                    prodData.qty = Number(prodData.qty);
                    prodData.standard_price = (prodData.promotion_id == 0) ? Number(prodData.unit_price) : '';
                    prodData.discount = Number(prodData.discount);
                    prodData.item_type = $scope.item_type;
                    prodData.vat = '';
                    prodData.vat_value = '';
                    prodData.vat_id = '';

                    prodData.ec_goods = $scope.ec_goods_list[0];
                    prodData.ec_description = $scope.ec_description_list[0];

                    angular.forEach($rootScope.arr_vat_post_grp_sales, function (obj) {
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

                    angular.forEach($scope.arr_discount_type, function (obj) {
                        if (obj.id == prodData.discount_type)
                            prodData.discount_type_id = obj;
                    });
                    angular.forEach($rootScope.arr_vat_post_grp_sales, function (obj) {
                        if (obj.id == prodData.vat_id)
                        {
                            prodData.vats = obj;
                            prodData.vat_id = obj.id;
                        }
                    });

                    angular.forEach(prodData.arr_warehouse.response, function (obj) {
                        if (obj.id == prodData.warehouse_id)
                        {
                            prodData.warehouses = obj.id;
                            prodData.warehouse_name = obj.name;

                        }else if(obj.wh_status == 2){
                            var isExist = 0;
                            if($scope.items.length > 0)
                            {
                                var in_active_wh = $filter("filter")($scope.items, { warehouses: obj.id });
                                if(in_active_wh != undefined && in_active_wh.length >0)
                                    isExist = 1;
                            }
                            if(isExist == 0)
                                prodData.arr_warehouse.response.splice(idx, 1);
                            else
                                prodData.arr_warehouse.response[idx].disabled = 1;
                        }
                    });
                    /* if (prodData.arr_warehouse != undefined) {
                        var default_wh = 0;
                        if (prodData.arr_warehouse.default_wh != undefined)
                            default_wh = prodData.arr_warehouse.default_wh;
                        prodData.arr_warehouse = prodData.arr_warehouse.response;

                        var item = $filter("filter")($scope.items, { id: prodData.id });
                        if (item.length == 0 || 1) {
                            if (default_wh > 0) {
                                prodData.warehouses = default_wh;
                                var wh = $filter("filter")(prodData.arr_warehouse, { id: default_wh });
                                if(wh.length>0)
                                    prodData.warehouse_name = wh[0].name;
                            }
                            else if (prodData.arr_warehouse.length == 1)
                            {    
                                prodData.warehouses = prodData.arr_warehouse[0].id;
                                prodData.warehouse_name = prodData.arr_warehouse[0].name;
                            }
                        }
                    } */

                    /* angular.forEach($scope.items, function (obj) {
                        if (obj.id == prodData.id) {
                            // var item = $filter("filter")(prodData.arr_warehouse, { id: obj.warehouses.id });
                            var item = $filter("filter")(prodData.arr_warehouse, { id: obj.warehouses });
                            var idx = prodData.arr_warehouse.indexOf(item[0]);
                            if (idx != -1)
                                prodData.arr_warehouse[idx].disabled = true;
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

                    $scope.items.push(prodData);

                    angular.forEach($scope.items, function (obj) {
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
            });
            $scope.$emit('SalesLines', $scope.items);
            //if($scope.$root.return_status == true)

            var item = $filter("filter")($scope.items, { item_type: 0, stock_check: 1 });
            if (item != undefined && item.length) {
                $scope.show_btn_dispatch_stuff = true;
            }
            else
                $scope.show_btn_dispatch_stuff = false;

            var rec2 = {};
            $scope.addsublist(rec2);
            angular.element('#productModal').modal('hide');

        }
        else if ($scope.item_type == 2) {

            $.each($scope.products, function (index, prodData) {
                if (prodData.chk == true) {
                    if ($scope.$root.crm_id == 0) {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Customer No.']));
                        //return false;
                        $scope.$root.return_status = false;
                    }


                    prodData.item_type = $scope.item_type;

                    var finApi = $scope.$root.sales + "customer/customer/get-customer-finance";//get-finance-by-customer-id";
                    $http
                        .post(finApi, { 'customer_id': $scope.$root.crm_id, token: $rootScope.token })
                        .then(function (res) {
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
                                    .then(function (vtData) {
                                       

                                        var catUnit = $scope.$root.setup + "service/cat-unit/get-cat-unit-by-cat-nd-unit_id";
                                        $http
                                            .post(catUnit, {
                                                'item_id': prodData.category_id,
                                                'unit_id': prodData.unit_id,
                                                token: $rootScope.token
                                            })
                                            .then(function (cumData) {
                                                if (cumData.data.ack != true) {
                                                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(575, [prodData.description]));
                                                    $scope.$root.return_status = false;
                                                    //return false;
                                                }
                                                else {
                                                    var umUrl = $scope.$root.setup + "service/unit-measure/get-unit";
                                                    $http
                                                        .post(umUrl, { id: prodData.unit_id, token: $rootScope.token })
                                                        .then(function (umData) {
                                                            if (umData.data.ack != true) {
                                                                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(576, [prodData.description]));
                                                                
                                                                $scope.$root.return_status = false;
                                                                //return false;
                                                            }
                                                            else {
                                                                if (umData.data.response.parent_id !== '0') {
                                                                    $http
                                                                        .post(catUnit, {
                                                                            'category_id': prodData.category_id,
                                                                            'unit_id': umData.data.response.parent_id,
                                                                            token: $rootScope.token
                                                                        })
                                                                        .then(function (c2umData) {
                                                                            if (c2umData.data.ack != true) {
                                                                                toaster.pop('error', 'Error2', $scope.$root.getErrorMessageByCode(577, [prodData.description]));
                                                                                
                                                                                $scope.$root.return_status = false;
                                                                                //return false;

                                                                            }
                                                                            else
                                                                                prodData.sale_unit_qty = c2umData.data.response.value;
                                                                        });
                                                                }
                                                                else {
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
                                                            prodData.sale_unit_id = prodData.unit_id;
                                                            prodData.purchase_unit_id = prodData.purchase_measure;
                                                            prodData.unit_parent = umData.data.response.parent_id;

                                                            angular.forEach($rootScope.arr_vat_post_grp_sales, function (obj) {
                                                                if (obj.id == prodData.vat_id)
                                                                {
                                                                    prodData.vats = obj;
                                                                    prodData.vat_id = obj.id;

                                                                }
                                                            });

                                                            $.each($scope.arr_units, function (index, obj) {
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
                            }
                            else {
                                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(505));
                            }
                        });
                }
            });
            $scope.$emit('SalesLines', $scope.items);
            //if($scope.$root.return_status == true)

            var rec2 = {};
            $scope.addsublist(rec2);
            angular.element('#serviceModal').modal('hide');

        }
        else {

            var acItem = {};
            if (prodData.account_type != 1) {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(506));
                return false;
            }
            var accUrl = $scope.$root.setup + "ledger-group/get-ledger-posting";
            $http
                .post(accUrl, {
                    'account': prodData.number, 'order_type': prodData.account_type, token: $rootScope.token
                })
                .then(function (acData) {
                    if (acData.data.ack == false) {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                        $scope.$root.return_status = false;
                    }
                    else {
                        var ledgEntryUrl = $scope.$root.setup + "ledger-group/get-general-ledger-entry";
                        $http
                            .post(ledgEntryUrl, {
                                'business_posting_title': acData.result.vat_bus_posting,
                                'product_posting_title': acData.result.vat_prod_posting,
                                token: $rootScope.token
                            })
                            .then(function (gData) {
                                if (gData.data.ack == false) {
                                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                                    $scope.$root.return_status = false;
                                }
                                else {

                                    var vatsetpUrl = $scope.$root.setup + "ledger-group/get-account-head";
                                    $http
                                        .post(vatsetpUrl, {
                                            'customer': gData.result.business_posting,
                                            'product': gData.result.product_posting,
                                            token: $rootScope.token
                                        })
                                        .then(function (vtData) {
                                            if (gData.data.ack == false) {
                                                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['VAT']));
                                                $scope.$root.return_status = false;
                                            }
                                            else {

                                                var vatsetpUrl = $scope.$root.setup + "ledger-group/get-account-head";
                                                $http
                                                    .post(vatsetpUrl, {
                                                        'number': prodData.number,
                                                        'account_type': 'Posting',
                                                        token: $rootScope.token
                                                    })
                                                    .then(function (acHead) {
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



    $scope.add_gl_account_values = function (gl_data) {

        if ($scope.$root.crm_id == 0) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Customer No.']));
            $scope.$root.return_status = false;
            return;
        }


        var finUrl = $scope.$root.sales + "customer/customer/get-customer-finance";//get-finance-by-customer-id";

        //console.log($scope.rec.sell_to_cust_id );
        //console.log($scope.$root.crm_id);
        //console.log($scope.rec.bill_to_cust_id);
        $http
            .post(finUrl, { 'customer_id': $scope.$root.crm_id, token: $rootScope.token })
            .then(function (res) {
                if (res.data.ack == true) {
                    // console.log("heee");
                }
                else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(505));
                    return;
                }
            });

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
                $scope.acItem.qty = '';
                $scope.acItem.standard_price = '';
                $scope.acItem.Price = '';
                
                $scope.acItem.ec_goods = $scope.ec_goods_list[0];
                $scope.acItem.ec_description = $scope.ec_description_list[0];

                /* angular.forEach($rootScope.arr_vat_post_grp_sales, function (obj) {
                    if (obj.id == gl_data.vat_id)
                        $scope.acItem.vats = obj;
                }); */
                
                if (gl_data.vat_id == 1 || gl_data.vat_id == 2 || gl_data.vat_id == 3 || gl_data.vat_id == 4) {
                     $scope.acItem.vats = $rootScope.arr_vat[gl_data.vat_id-1];
                     $scope.acItem.vat_id = $rootScope.arr_vat[gl_data.vat_id-1].id;
                }
                else {
                    angular.forEach($rootScope.arr_vat, function (obj) {
                         if (obj.id == gl_data.vat_id)
                         {
                            $scope.acItem.vats = obj;
                            $scope.acItem.vat_id = obj.id;
                         }
                    });
                }
                angular.forEach($rootScope.gl_arr_units, function (obj) {
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


    $scope.checkAllGL = function (val, category, brand, unit) {
        $scope.PendingSelectedGLItems = [];

        if (val == true) {
            angular.forEach($scope.gl_account, function (obj) {
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


    $scope.rowTotal = function (item) {

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
            total = parseFloat(item.standard_price);

        var discount = 0;
        if (item.discount_type_id != undefined) {
            if (item.discount_type_id.id == 'Percentage')
                discount = (parseFloat(total) * parseFloat(item.discount) / 100);
            else if (item.discount_type_id.id == 'Value')
                discount =  parseFloat(item.discount);
            else if (item.discount_type_id.id == 'Unit')
                discount =  (parseFloat(item.discount) * parseFloat(item.qty));
        }
        if (isNaN(discount)) {
            discount = 0;
        }

        total = parseFloat(total) - discount;

        if (isNaN(total))
        {
            return 0;
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

    $scope.rowVat = function (item) {
        var arrVat = [];
        var total = 0;
        var rowVat = 0;

        var total = 0;
        if (item.qty > 0)
            total = parseFloat(item.qty) * parseFloat(item.standard_price);
        else
            total = parseFloat(item.standard_price);

        if (item.isGLVat == true) {
            var price = total;
            if (arrVat[vat_value] != undefined && arrVat[vat_value].length > 0)
                arrVat[vat_value] = arrVat[vat_value] + price;
            else if (vat_value > 0)
                arrVat[vat_value] = price;
            else
                arrVat[vat_value] = price;

            // if (parseFloat((vat_value / 100) * arrVat[vat_value]).toFixed(2) > 0)
            rowVat = arrVat[vat_value].toFixed(2);
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

            // if (parseFloat((vat_value / 100) * arrVat[vat_value]).toFixed(2) > 0)
            rowVat = parseFloat((vat_value / 100) * arrVat[vat_value]).toFixed(2);
        }
        if (isNaN(rowVat)) {
            item.vat_price = 0;
            return 0;
        }
        else
            item.vat_price = rowVat;

        return rowVat;
    }

    $scope.calcDiscount = function () {
        var TotalDiscount = 0;
        var ItemsDiscount = 0;

        var total = 0;
        if ($scope.items.length > 0) {
            angular.forEach($scope.items, function (item) {
                if (item.discount_type_id == undefined) {
                    item.discount = "";
                }

                if (item.discount_type_id != undefined && item.discount > 0) {

                    // var total = item.standard_price;
                    var total = 0;
                    if (item.qty > 0)
                        total = parseFloat(item.qty) * parseFloat(item.standard_price);
                    else
                        total = parseFloat(item.standard_price);
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
        $rootScope.discountedCreditNote = $scope.rec.total_discount;
        return $scope.rec.total_discount;
    }

    $scope.netTotal = function () {
        var s_total = 0;
        var items_net_total = 0;

        angular.forEach($scope.items, function (item) {
            var total = 0;

            if (item.item_type != 1) {

                if (item.qty > 0)
                    total = parseFloat(item.qty) * parseFloat(item.standard_price);
                else
                    total = parseFloat(item.qty) * parseFloat(item.standard_price);

            } else if (item.isGLVat == false) {
                if (item.qty > 0)
                    total = parseFloat(item.qty) * parseFloat(item.standard_price);
                else
                    total = parseFloat(item.standard_price);
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
            if (!isNaN(total))
                s_total = s_total + total;
        });
        $scope.rec.items_net_total = items_net_total;

        $scope.$emit('NetValue', s_total);
        $rootScope.netValueCreditNote = s_total;
        return s_total;
    }

    $scope.calcVat = function () {
        var arrVat = [];
        var arrTotalVat = [];
        var TotalVat = 0;
        var TotalItemVat = 0;
        var total = 0;
        if ($scope.items.length > 0) {

            angular.forEach($scope.items, function (item) {

                if (item.qty > 0)
                    var subtotal = Number(item.qty) * Number(item.standard_price);
                else
                    var subtotal = Number(item.standard_price);

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

                    // if (parseFloat(Math.round(((vat_value / 100) * arrVat[vat_value])).toFixed(2)) > 0)
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

                    // if (parseFloat(Math.round(((vat_value / 100) * arrVat[vat_value])).toFixed(2)) > 0)
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
        $rootScope.vatValueCreditNote = TotalVat;
        return TotalVat;
    }

    $scope.grandTotal = function () {
        $scope.rec.grand_total = $scope.netTotal() + $scope.calcVat();
        if (!isNaN($scope.rec.grand_total))
            $scope.rec.grand_total = Number($scope.rec.grand_total).toFixed(2);

        $rootScope.grandTotalCreditNote = $scope.rec.grand_total;
        // $scope.rec.grand_total_converted = $scope.rec.grand_total / $scope.rec.currency_rate;
        $scope.rec.grand_total_converted = ($scope.rec.currency_rate != undefined && Number($scope.rec.currency_rate) > 0) ? $scope.rec.grand_total / $scope.rec.currency_rate : $scope.rec.grand_total;
        if (!isNaN($scope.rec.grand_total_converted))
            $scope.rec.grand_total_converted = Number($scope.rec.grand_total_converted).toFixed(2);
        else
            $scope.rec.grand_total_converted = $scope.rec.grand_total;

        return $scope.rec.grand_total;
    }


    $scope.UpdateGrandTotal = function () {

        if($scope.rec.type2 == 2)
        {
            return;
        }
        var orderUrl = $scope.$root.sales + "customer/order/update-grand-total";
        $scope.grandTotal();
        var postData = {};
        postData.token = $scope.$root.token;
        postData.order_id = $scope.$root.order_id;
        postData.grand_total = $scope.rec.grand_total;
        postData.grand_total_converted = $scope.rec.grand_total_converted;
        postData.net_amount = Number($rootScope.netValueCreditNote).toFixed(2);
        postData.net_amount_converted = Number($rootScope.netValueCreditNote / $scope.rec.currency_rate).toFixed(2);

        postData.items_net_val = Number($scope.rec.items_net_total).toFixed(2);
        postData.items_net_discount = Number($scope.rec.items_net_discount).toFixed(2);
        postData.items_net_vat = $scope.rec.items_net_vat;
        postData.currency_rate = $scope.rec.currency_rate;

        postData.tax_amount = $scope.calcVat();
        postData.currency_id = ($scope.rec.currency_id != undefined) ? $scope.rec.currency_id.id : 0;
        postData.converted_currency_id = $scope.$root.defaultCurrency;
        postData.offer_date = $scope.rec.offer_date;


        postData.type = 2;
        
        $http
            .post(orderUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    console.log('updated grand total');
                }
            });
    }
    
    $scope.delete = function (index, item) {

        if (item.update_id == undefined) {
            $scope.items.splice(index, 1);
            /* var item = $filter("filter")($scope.tempProdArr, { id: item.id });
            var idx = $scope.tempProdArr.indexOf(item[0]);
            $scope.tempProdArr[idx].disableCheck = 0;
            $scope.tempProdArr[idx].chk = false; */

            var item = $filter("filter")($scope.items, { item_type: 0, stock_check: 1 });
            if (item != undefined && item.length) {
                $scope.show_btn_dispatch_stuff = true;
            }
            else
                $scope.show_btn_dispatch_stuff = false;

        }
        else {

            
            ngDialog.openConfirm({
                template: 'modalDeleteDialogId',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                var orderUrl = $scope.$root.sales + "customer/return-order/delete-order-item";
                item.token = $scope.$root.token;
                $scope.showLoader = true;
                $http
                    .post(orderUrl, item)
                    .then(function (res) {

                        $scope.volume = 0;
                        $scope.weight = 0; 
                        $scope.volume_unit = '';
                        $scope.weightunit = '';
                        $scope.weight_permission = 0;
                        $scope.volume_permission = 0;
                        $scope.showVolumeWeight = 0;

                        if (res.data.ack == true) {
                            $scope.showLoader = false;
                            $scope.items.splice(index, 1);
                            toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                            $scope.UpdateGrandTotal();
                            /* var item = $filter("filter")($scope.tempProdArr, { id: item.id });
                            var idx = $scope.tempProdArr.indexOf(item[0]);
                            $scope.tempProdArr[idx].disableCheck = 0;
                            $scope.tempProdArr[idx].chk = false; */
                            var item = $filter("filter")($scope.items, { item_type: 0, stock_check: 1 });
                            if (item != undefined && item.length) {
                                $scope.show_btn_dispatch_stuff = true;
                            }
                            else
                                $scope.show_btn_dispatch_stuff = false;

                            if ($scope.items.length == 0) {
                                $scope.enable_btn_dispatch = false;
                                $scope.enable_btn_invoice = false;
                            }
                        }
                        else {
                            $scope.showLoader = false;
                            toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                        }

                        $scope.volume = res.data.volume;
                        $scope.weight = res.data.weight;
                        $scope.volume_unit = res.data.volume_unit;
                        $scope.weightunit = res.data.weightunit;                    
                        $scope.weight_permission = res.data.weight_permission; 
                        $scope.volume_permission = res.data.volume_permission; 

                        if(($scope.weight_permission >0 && $scope.weight && $scope.weight!=0) || ($scope.volume_permission>0 && $scope.volume && $scope.volume!=0))
                            $scope.showVolumeWeight = 1;

                    });
            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
        }
    }


    $scope.delete_sub = function (index, item, items) {


        if (item.update_id == undefined) items.splice(index, 1);
        else {
            ngDialog.openConfirm({
                template: 'modalDeleteDialogId',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                var orderUrl = $scope.$root.sales + "customer/return-order/delete-order-item";
                $http
                    .post(orderUrl, { id: item.update_id, token: $scope.$root.token })
                    .then(function (res) {
                        if (res.data.ack == true) {
                            toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                            items.splice(index, 1);
                            if ($scope.items.length == 0) {
                                $scope.enable_btn_dispatch = false;
                                $scope.enable_btn_invoice = false;
                            }
                            // $scope.getOrdersDetail();
                        }
                        else {
                            toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                        }
                    });
            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
        }
    }
    var rec2 = {};
    $scope.add_general = function (rec, rec2, flg, invoice_post) {

        if ($scope.rec.id == 0 && ($scope.rec.sell_to_cust_id == undefined || $scope.rec.sell_to_cust_id == null || $scope.rec.sell_to_cust_id == '')) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Customer No.']));
            return;
        }
        if ($scope.rec.offer_date == undefined || $scope.rec.offer_date == null || $scope.rec.offer_date == '') {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Order Date']));
            return;
        }
        var addOrderUrl = $scope.$root.sales + "customer/return-order/add-order";
        // if ($stateParams.id != undefined)
        //     addOrderUrl = $scope.$root.sales + "customer/order/update-order";

        rec.token = $scope.$root.token;
        //rec.id = $stateParams.id;
        rec.type = 1;
        rec.payment_terms_code = rec.payment_terms_codes != undefined ? rec.payment_terms_codes.id : 0;
        rec.payment_method_id = rec.payment_method_ids != undefined ? rec.payment_method_ids.id : 0;
        rec.country_id = rec.country_ids != undefined ? rec.country_ids.id : 0;
        rec.currency_ids = rec.currency_id != undefined ? rec.currency_id.id : 0;
        rec.bill_to_country_id = ($scope.rec.bill_to_country_ids != undefined) ? $scope.rec.bill_to_country_ids.id : 0;
        rec.ship_to_country_id = ($scope.rec.ship_to_country_ids != undefined) ? $scope.rec.ship_to_country_ids.id : 0;
        rec.bill_to_finance_charges_id = ($scope.drp.finance_charges_ids != undefined) ? $scope.drp.finance_charges_ids.id : 0;
        rec.bill_to_finance_charges_name = ($scope.drp.finance_charges_ids != undefined) ? $scope.drp.finance_charges_ids.Charge : '';
        rec.bill_to_insurance_charges_id = ($scope.drp.insurance_charges_ids != undefined) ? $scope.drp.insurance_charges_ids.id : 0;
        rec.bill_to_insurance_charges_name = ($scope.drp.insurance_charges_ids != undefined) ? $scope.drp.insurance_charges_ids.Charge : '';
        rec.bill_to_posting_group_id = ($scope.drp.vat_bus_posting_group != undefined) ? $scope.drp.vat_bus_posting_group.id : 0;
        rec.bill_to_posting_group_name = ($scope.drp.vat_bus_posting_group != undefined) ? $scope.drp.vat_bus_posting_group.name : '';
        
        
        // $scope.$root.c_currency_id = rec.currency_ids;
        $scope.$root.posting_date = rec.posting_date;

        /*
         $scope.$root.$broadcast("shift1",rec.bill_to_cust_no,rec.ship_to_name,rec.invoice_date,rec.requested_delivery_date
         ,rec.comm_book_in_no,rec.type,rec.order_code,rec.payable_number,rec.purchase_number);
         */
        rec.PurchaseOrderArr = {};
        rec.PurchaseOrderArr = $scope.selectedPurchaseOrderArr;

        /* if ($scope.rec.return_order_code == undefined) {
            $scope.getCode(rec, rec2, flg);
        }
        else */
            $scope.UpdateForm(rec, rec2, flg, invoice_post);

    }

    $scope.add_sublist = function (rec2, flg, invoice_post) {
        var rec2 = {};
        /* if ($scope.$root.posting_date == undefined || $scope.$root.posting_date == null) {
            toaster.pop('error', 'Error', 'Invoice Date is Not Defined');
            return;
        }
 */
        rec2.net_amount = $scope.netTotal();
        rec2.tax_amount = $scope.calcVat();
        rec2.grand_total = $scope.grandTotal();
        rec2.items_net_total = $scope.rec.items_net_total;
        rec2.items_net_discount = $scope.rec.items_net_discount;
        rec2.items_net_vat = $scope.rec.items_net_vat;
        $scope.$root.c_currency_id = ($scope.rec.currency_id.id != undefined) ? $scope.rec.currency_id.id : 0;
        if ($scope.$root.c_currency_id == $scope.$root.defaultCurrency) {
            rec2.net_amount_converted = Number(rec2.net_amount);
            rec2.tax_amount_converted = Number(rec2.tax_amount);
            rec2.grand_total_converted = Number(rec2.grand_total);
            rec2.converted_currency_id = $scope.$root.defaultCurrency;
            rec2.converted_currency_code = $scope.$root.defaultCurrencyCode;
            rec2.currency_rate = 1;
            $scope.addsublist(rec2, flg, invoice_post);
        }
        else {
            //$rootScope.get_currency_list($scope.$root.posting_date);

            var currencyURL = $rootScope.sales + "customer/customer/get-currency-conversion-rate";
            $scope.items_converted_arr = [];
            $http
                .post(currencyURL, {
                    'id': $rootScope.c_currency_id,
                    token: $rootScope.token,
                    or_date: $scope.rec.posting_date
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        if (res.data.response.conversion_rate != null) {

                            $scope.showLoader = true;

                            $scope.showLoader = false;

                            rec2.net_amount_converted = Number(rec2.net_amount) / Number(res.data.response.conversion_rate);
                            rec2.tax_amount_converted = Number(rec2.tax_amount) / Number(res.data.response.conversion_rate);
                            rec2.grand_total_converted = Number(rec2.grand_total) / Number(res.data.response.conversion_rate);
                            rec2.converted_currency_id = $rootScope.defaultCurrency;
                            rec2.converted_currency_code = $rootScope.defaultCurrencyCode;
                            $scope.rec.currency_rate = res.data.response.conversion_rate;
                            rec2.currency_rate = $scope.rec.currency_rate;

                            if (rec2.net_amount_converted <= 0 || rec2.net_amount_converted == undefined || rec2.tax_amount_converted == undefined || rec2.tax_amount_converted == undefined || rec2.grand_total_converted == undefined || rec2.grand_total_converted == undefined) {
                                // toaster.pop('error', 'Info', 'Please Select Currency Rate.');
                                isValide = false;
                                // return;
                            } 
                            // else
                                $scope.addsublist(rec2, flg, invoice_post);
                        }
                    } else toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                }
                );


        }

    }

    $scope.addsublist = function (rec2, flg, invoice_post) {
        var temp_valid = 1;
        angular.forEach($scope.items, function (obj) {
            if (isNaN(obj.qty)) {
                temp_valid = 0;
            }
        });

        if (!temp_valid) {
            toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(508, ['Quantity']));
            $scope.$parent.check_so_readonly = false;
            $scope.check_so_readonly = false;
            return;
        }
        var temp_valid = 1;
        angular.forEach($scope.items, function (obj) {
            if (obj.standard_price != null && isNaN(obj.standard_price)) {
                temp_valid = 0;
            }
        });

        if (!temp_valid) {
            toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(508, ['Standard Price']));
            $scope.$parent.check_so_readonly = false;
            $scope.check_so_readonly = false;
            return;
        }


        // var orderUrl = $scope.$root.sales + "customer/return-order/add-order-items";
        var orderUrl = $rootScope.sales + "customer/return-order/add-order-items";
        //$timeout(function () {
        rec2.items = $scope.items;
        rec2.order_id = $rootScope.order_id;
        rec2.order_date = $rootScope.posting_date;
        rec2.offer_date = $scope.$parent.rec.offer_date;
        rec2.currency_id = $rootScope.currency_id.id;
        rec2.currency_rate = $scope.rec.currency_rate;

        rec2.token = $rootScope.token;
        rec2.note = $scope.rec.note;
        if(Number($rootScope.order_id) == 0)
            return;
        $scope.showLoader = true;
        $http
            .post(orderUrl, rec2)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.showLoader = false;
                    if (flg) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));
                        $scope.$parent.check_so_readonly = true;
                        $scope.check_so_readonly = true;
                        // $state.go("app.editReturnOrder", { id: $rootScope.order_id });
                    }
                    if(invoice_post != undefined && invoice_post == 1)
                        $scope.load_invoice();
                    else
                        $scope.getOrdersDetail(1);
                } else {
                    // $scope.$parent.check_so_readonly = false;
                    // $scope.check_so_readonly = false;
                    $scope.showLoader = false;
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(104));
                }
            });

    }

    //Edit and View

    var counter = 1;
    $scope.check_order_complete = $scope.check_readonly;

    //$scope.$on("OrderTabEvent", function (event, args) {
    //if(counter == 1){
    if ($scope.$root.order_status == 'ORDER_COMPLETED')
        $scope.check_order_complete = 0;

    var total_rec_recvie = 0;
    var total_rec_invice = 0;




    $scope.chk_allocation_nd_dispatch = function () {
        var chkDis = false;
        var chkInv = false;

        // $timeout(function () {
        $.each($scope.items, function (index, obj) {
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

    
    $scope.getOrdersDetail_org = function (flg) {
        // if (flg == undefined)
            $scope.hide_dispatch_btn = true;

        $scope.volume = 0;
        $scope.weight = 0; 
        $scope.volume_unit = '';
        $scope.weightunit = '';
        $scope.weight_permission = 0;
        $scope.volume_permission = 0;
        $scope.showVolumeWeight = 0;

        var total_rec_recvie = total_rec_invice = 0;
        var getOrderProduct = $rootScope.sales + 'customer/return-order/get-order-items';
        $scope.showLoader = true;
        $http
            .post(getOrderProduct, { order_id: $rootScope.order_id, token: $rootScope.token })
            .then(function (rsQtItem) {
                if (rsQtItem.data.ack == true) {
                    // console.log(rsQtItem.data.response);
                    $scope.showLoader = false;
                    $scope.items = [];
                    angular.forEach(rsQtItem.data.response, function (elem, detIndex) {
                        var item = $filter("filter")($scope.tempProdArr, { id: elem.item_id });
                        var detail = {};
                        /* if (item) {
                            var idx = $scope.tempProdArr.indexOf(item[0]);
                            // $scope.tempProdArr[idx].disableCheck = 1;
                            $scope.tempProdArr[idx].chk = true;
                        } */

                        detail.order_id = elem.order_id;
                        detail.update_id = elem.id;
                        detail.id = elem.item_id;
                        detail.warehouse_id = elem.warehouse_id;


                        detail.description = elem.item_name;
                        detail.product_code = elem.product_code;
                        detail.costing_method_id = elem.costing_method_id;
                        detail.standard_purchase_cost = elem.standard_purchase_cost;
                        detail.stock_check = elem.stock_check;
                        detail.rawMaterialProduct = elem.rawMaterialProduct;
                        detail.raw_material_gl_id = elem.raw_material_gl_id;
                        detail.raw_material_gl_code = elem.raw_material_gl_code;
                        detail.raw_material_gl_name = elem.raw_material_gl_name;

                        detail.standard_price = Number(elem.unit_price); // (Number(elem.unit_price) > 0) ? Number(elem.unit_price) : '';
                        detail.qty = (Number(elem.qty) > 0) ? Number(elem.qty) : '';
                        detail.unit_of_measure_name = elem.unit_measure;
                        detail.unit_id = elem.unit_measure_id;
                        detail.unit_parent = elem.unit_parent_id;
                        detail.sale_unit_qty = elem.unit_qty;
                        detail.category_id = elem.cat_id;
                        detail.item_type = elem.type;
                        detail.discount = Number(elem.discount) > 0 ? Number(elem.discount) : '';
                        detail.sale_unit_id = elem.sale_unit_id;
                        detail.purchase_unit_id = elem.purchase_unit_id;
                        detail.primary_unit_of_measure_id = elem.primary_unit_of_measure_id;
                        detail.primary_unit_of_measure_name = elem.primary_unit_of_measure_name;

                        detail.minSaleQty = 1;
                        detail.maxSaleQty = $scope.org_qty;

                        angular.forEach($scope.arr_discount_type, function (obj) {
                            if (obj.id == elem.discount_type)
                                detail.discount_type_id = obj;
                        });

                        angular.forEach($scope.ec_goods_list, function (obj) {
                            if (obj.id == elem.ec_goods)
                                detail.ec_goods = obj;
                        });

                        angular.forEach($scope.ec_description_list, function (obj) {
                            if (obj.id == elem.ec_description)
                                detail.ec_description = obj;
                        });

                        angular.forEach($rootScope.arr_vat_post_grp_sales, function (obj) {
                            if (obj.id == elem.vat_id)
                            {
                                detail.vats = obj;
                                detail.vat_id = obj.id;

                            }
                        });
                        
                        /* $scope.vat_refresh_counter = 1;
                        var vat_refreshId = setInterval(function () {
                            if (($rootScope.arr_vat_post_grp_sales != undefined && $rootScope.arr_vat_post_grp_sales.length > 0)) {
                                angular.forEach($rootScope.arr_vat_post_grp_sales, function (obj) {
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

                                
                                if (detail.product_code == elem.vatRange.gl1AccountCode || 
                                    detail.product_code == elem.vatRange.gl2AccountCode || 
                                    detail.product_code == elem.vatRange.gl3AccountCode) {
                                    detail.isGLVat = true;
                                }
                                else {
                                    detail.isGLVat = false;
                                }
                                
                                detail.startVatRange = '';
                                detail.endVatRange = '';

                            } else {

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

                        if (elem.type == 2) {
                            angular.forEach($scope.arr_service_units, function (index, obj) {
                                if (obj.id == elem.unit_measure_id)
                                    detail.units = obj;
                            });
                        }
                        if (detail.item_type == 0) {


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
                            if (elem.item_stock_allocation.response != undefined) {
                                detail.item_stock_allocation = elem.item_stock_allocation.response;

                                detail.sale_status = detail.item_stock_allocation[0].sale_status;
                                var ordqty = 0;
                                angular.forEach(detail.item_stock_allocation, function (elem) {
                                    ordqty = Number(ordqty) + Number(elem.quantity);

                                    if (detail.stock_check == 1 && detail.sale_status == 1) //flg == undefined && 
                                    {
                                        $scope.hide_dispatch_btn = false;
                                    }
                                });
                                if (ordqty > 0)
                                    $scope.hide_btn_delete = true;
                                else
                                    $scope.hide_btn_delete = false;

                                detail.remainig_qty = Number(detail.qty) - Number(ordqty);
                                detail.allocated_stock = ordqty;
                            }
                            else {
                                if (detail.stock_check == 1)
                                    $scope.hide_dispatch_btn = false;
                                detail.remainig_qty = detail.qty;
                                detail.sale_status = 0;
                            }
                            if (item.length > 0)// && item[0].arr_warehouse != undefined)
                            {
                                if(item[0].arr_warehouse != undefined)
                                    detail.arr_warehouse = (item[0].arr_warehouse.response != undefined) ? item[0].arr_warehouse.response : item[0].arr_warehouse;
                                if(item[0].arr_units != undefined)
                                    detail.arr_units = (item[0].arr_units.response != undefined) ? item[0].arr_units.response : item[0].arr_units;
                            }
                            else
                            {
                                detail.arr_warehouse = [];
                                detail.arr_units = [];
                            }
                            // detail.arr_warehouse = item[0].arr_warehouse.response;
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
                            // detail.arr_units = item[0].arr_units.response;
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

                            angular.forEach(detail.arr_warehouse, function (obj, idx) {
                                if (obj.id == elem.warehouse_id) {
                                    detail.warehouses = obj.id;
                                    detail.warehouse_name = obj.name;
                                    detail.selectedWarehouse = obj;
                                }
                                else if(obj.wh_status == 2){
                                    var isExist = 0;
                                    if($scope.items.length > 0)
                                    {
                                        var in_active_wh = $filter("filter")($scope.items, { warehouses: obj.id });
                                        if(in_active_wh != undefined && in_active_wh.length >0)
                                            isExist = 1;
                                    }
                                    if(isExist == 0)
                                        detail.arr_warehouse.splice(idx, 1);
                                    else
                                        detail.arr_warehouse[idx].disabled = 1;
                                }
                            });

                            var count = $scope.items.length - 1;
                            angular.forEach(detail.arr_units, function (obj) {
                                if (obj.id == elem.unit_measure_id)
                                    detail.units = obj;
                            });

                            angular.forEach(detail.arr_units, function (obj) {
                                if (obj.id == elem.default_unit_measure_id)
                                    $scope.items[detIndex].default_units = obj;
                            });

                            //     });
                            // }, 2000);


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
                            angular.forEach($rootScope.gl_arr_units, function (obj) {
                                if (obj.id == elem.unit_measure_id)
                                    detail.units = obj;

                            });
                            //     });

                            // }, 2000);

                            total_rec_invice++;
                        }
                        //  console.log(detail.arr_warehouse);
                        $scope.items.push(detail);
                        if ($scope.isInvoice == 0 && detail.item_type == 0)
                            $scope.checkDuplWHItem(detail, detIndex);
                    });
                    // $scope.getPriceOffers(2); //for order items

                    $scope.$emit('SalesLines', $scope.items);
                    var item = $filter("filter")($scope.items, { item_type: 0, stock_check: 1 });
                    if (item != undefined && item.length) {
                        $scope.show_btn_dispatch_stuff = true;
                    }
                    else
                        $scope.show_btn_dispatch_stuff = false;


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

                    // if($scope.weight_permission >0 || $scope.volume_permission>0)
                    //     $scope.showVolumeWeight = 1;
                    if(($scope.weight_permission >0 && $scope.weight && $scope.weight!=0) || ($scope.volume_permission>0 && $scope.volume && $scope.volume!=0))
                        $scope.showVolumeWeight = 1;
                }
                else
                    $scope.showLoader = false;
            });

        $scope.chk_allocation_nd_dispatch();
    }
    
    $scope.filterOrderItem = {};
    $scope.getOrdersDetail = function (flg) {

        $scope.filterOrderItem = {};
        /* $scope.tempProdArr = [];

        angular.copy($rootScope.prooduct_arr, $scope.tempProdArr);

        for (var i = 0; i < $scope.tempProdArr.length; i++) {
            $scope.tempProdArr[i].chk = false;
        } */

        $scope.tempProdArr = [];
        var itemListingApi = $scope.$root.stock + "products-listing/item-popup";

        $scope.showLoader = true;

        $http
        .post(itemListingApi, { 'token': $scope.$root.token, 'credit_note_id':$rootScope.order_id, 'no_permission':1 })
        .then(function (res) {
            if (res.data.ack == true) {
                angular.forEach(res.data.response, function (value, key) {
                    if (key != "tbl_meta_data") {
                        $scope.tempProdArr.push(value);
                    }
                });                
        
                if($scope.tempProdArr.length == 0)
                    $scope.tempProdArr.push({'id':0});
                
                $scope.getOrdersDetail_org(flg);
                $scope.showLoader = false;
            }
            else
            {
                $scope.tempProdArr.push({'id':0});
                $scope.showLoader = false;
            }
        });
    }
    
    // $timeout(function () {
    /* if ($stateParams.id !== undefined)
        $scope.getOrdersDetail(); */

    // }, 2000);

    
    $scope.NavigateOrder = function(rec){
        $scope.searchKeyword = {};
        $scope.searchKeyword.navigate_search = "";

        $scope.navigate_data = {};
        
        $scope.navigate_title = 'Credit Note No. ' + $scope.$parent.rec.return_invoice_code;
        $scope.navigate_type = 1;

        $scope.navigatePostingDate = '';
        $scope.navigatePostingByName = '';

        var navigate_url = $scope.$root.sales + "customer/order/navigate-invoice";
        var postData = {
            'token': $scope.$root.token,
            'type':2,
            'object_id':rec.id
        };
        $scope.showLoader = true;
        $http
            .post(navigate_url, postData)
            .then(function (res) {
                if(res.data.ack == 1)
                {
                    $scope.navigate_data = res.data.response;
                    $scope.navigatePostingDate = res.data.posted_on;
                    $scope.navigatePostingByName = res.data.posted_by_name;
                }

                if(res.data.ack != undefined)
                    $scope.showLoader = false;

            });
        
        angular.element('#order_navigate_modal').modal({ show: true });
    }

    $scope.orderCompete = function () {
        var completeOrder = [];
        angular.forEach($scope.items, function (elem, index) {
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
            cmpOrder.order_no = $scope.$root.order_no;
            completeOrder.push(cmpOrder);
        });

        $http
            .post('api/chart_of_accounts/general_ledger_entry', completeOrder)
            .then(function (result) {
                if (result.data == '0') {
                    toaster.pop("error", "Error", "Order can't be completed! Product head is not set!");
                }
                else {
                    toaster.pop("success", "Completed", "Order completed.");
                    $scope.check_order_complete = 0;
                }
            });

    }

    $scope.stock_item = [];
    $scope.all_wh_stock = [];
    $scope.selected_wh_locations = [];
    $scope.all_order_stock = {};
    $scope.remainig_qty = 0;
    $scope.order_qty = 0;
    $scope.getAllocatStock = function (warehouse_id, item_id, order_id, order_detail_id) {
        $scope.all_wh_stock = [];
        var getStockUrl = $scope.$root.sales + "warehouse/get-sale-stock";
        $http
            .post(getStockUrl, {
                'warehouse_id': warehouse_id,
                'order_detail_id': order_detail_id,
                'type': 2,
                'item_id': item_id,
                'order_id': order_id,
                'user_id': $scope.$root.crm_id,
                'sale_invoice_id': $scope.rec.sale_invoice_id,
                'token': $scope.$root.token
            })
            .then(function (res) {
                // console.log(res.data.remaining_stock);
                if (res.data.ack == true) {
                    $scope.all_wh_stock = res.data.response.sales_activities;
                    $scope.selected_wh_locations = res.data.response.warehouse_locations.response;

                }
                else {
                    $scope.all_wh_stock = [];
                    $scope.selected_wh_locations = [];
                }

            });

    }

    /* $scope.stock_allocate_detail = function (item_id, show, warehouse_id) {
        $scope.all_order_stock = [];
        var getAllStockUrl = $scope.$root.sales + "warehouse/get-order-stock-allocation";
        $http
            .post(getAllStockUrl, {
                type: 2,
                item_id: item_id,
                sale_return: '1',
                order_id: $scope.$root.order_id,
                wh_id: warehouse_id,
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.all_order_stock = res.data.response;
                    var ordqty = 0;
                    angular.forEach(res.data.response, function (elem) {
                        ordqty = Number(ordqty) + Number(elem.quantity);
                    });
                    if (ordqty > 0)
                        $scope.hide_btn_delete = true;
                    else
                        $scope.hide_btn_delete = false;

                    $scope.remainig_qty = Number($scope.order_qty) - Number(ordqty);
                    if (show == 3) {
                        angular.forEach($scope.items, function (obj, index) {
                            if (obj.id == item_id) {
                                $scope.items[index].remainig_qty = $scope.remainig_qty;
                                $scope.items[index].sale_status = res.data.response[0].sale_status;
                            }
                        });

                    }
                }
                else {
                    $scope.all_order_stock = [];
                    $scope.hide_btn_delete = false;
                    $scope.remainig_qty = $scope.order_qty;
                    if (show == 3) {
                        angular.forEach($scope.items, function (obj, index) {
                            if (obj.id == item_id) {
                                $scope.items[index].remainig_qty = $scope.order_qty;
                                $scope.items[index].sale_status = 0;
                            }
                        });
                    }
                }
            });

        if (show == 1)
            angular.element('#stockAllocationDetailModal').modal({ show: true });
    } */

    $scope.stock_allocate_detail = function (item_id, show, warehouse_id, update_id) {
        $scope.all_order_stock = [];
        var getAllStockUrl = $scope.$root.sales + "warehouse/get-order-stock-allocation";
        $http
            .post(getAllStockUrl, {
                'type': 2,
                'item_id': item_id,
                'order_id': $scope.$root.order_id,
                'sale_return': '1',
                'sale_order_detail_id': update_id,
                'wh_id': warehouse_id,
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.all_order_stock = res.data.response;
                    var ordqty = 0;
                    angular.forEach(res.data.response, function (elem) {
                        ordqty = Number(ordqty) + Number(elem.quantity);
                    });
                    if (ordqty > 0)
                        $scope.hide_btn_delete = true;
                    else
                        $scope.hide_btn_delete = false;

                    $scope.remainig_qty = Number($scope.order_qty) - Number(ordqty);
                    console.log($scope.remainig_qty);
                    if (show == 3) {
                        angular.forEach($scope.items, function (obj, index) {
                            if (obj.id == item_id && (obj.warehouse_id == warehouse_id || obj.warehouses == warehouse_id) && obj.update_id == update_id) {
                                $scope.items[index].remainig_qty = $scope.remainig_qty;
                                $scope.items[index].sale_status = res.data.response[0].sale_status;
                            }
                        });

                    }
                }
                else {
                    $scope.all_order_stock = [];
                    $scope.hide_btn_delete = false;
                    $scope.remainig_qty = $scope.order_qty;
                    if (show == 3) {
                        angular.forEach($scope.items, function (obj, index) {
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

    $scope.current_stock_by_id = function (warehouse_id, item_id) {
        $scope.all_order_stock = [];
        var getAllStockUrl = $scope.$root.sales + "warehouse/get-curent-stock-by-product-id-warehouse";
        $http
            .post(getAllStockUrl, {
                'item_id': item_id,
                'warehouse_id': warehouse_id,
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true)
                    $scope.current_stock = res.data.current_stock;
            });
    }

    $scope.allocateStock = function (drpWH, item) {
        if (item.units == null) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Unit Of Measure']));
            return;
        }

        if (Number(item.qty) == 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Quantity']));
            return;
        }

        if (item.warehouses == null) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Warehouse']));
            return;
        }

        if (Number(item.standard_price) == 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Standard Price']));
            return;
        }


        var orderUrl = $scope.$root.sales + "customer/return-order/add-single-order-item";
        //$timeout(function () {
        $scope.showLoader = true;
        item.order_id = $scope.$root.order_id;
        item.order_date = $scope.$root.posting_date;
        item.currency_id = $scope.$root.c_currency_id;
        // item.comment        = $scope.rec2.note;

        var rec2 = {};
        rec2.item = item;
        rec2.token = $rootScope.token;

        if($scope.rec.type2 != 2)
        {
            $http
                .post(orderUrl, rec2)
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.showLoader = false;
                        item.update_id = res.data.id;
                        $scope.$root.load_date_picker('sale order');
                        $scope.stock_item = item;
                        $scope.order_qty = item.qty;
                        $scope.getAllocatStock(drpWH, item.id, item.order_id, item.update_id);
                        $scope.stock_allocate_detail(item.id, 0, drpWH, item.update_id);
                        $scope.current_stock_by_id(drpWH, item.id);
                        angular.element('#stockAllocationModal').modal({ show: true });
                        $scope.UpdateGrandTotal();

                        /* $scope.showLoader = false;
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        // $scope.items = [];
                        $scope.check_so_readonly = true;
                        $scope.getOrdersDetail(); */
                    } else {
                        $scope.showLoader = false;
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(104));
                    }
                });
        }
        else
        {
            $scope.showLoader = false;
            $scope.$root.load_date_picker('sale order');
            $scope.stock_item = item;
            $scope.order_qty = item.qty;
            $scope.getAllocatStock(drpWH, item.id, item.order_id, item.update_id);
            $scope.stock_allocate_detail(item.id, 0, drpWH, item.update_id);
            $scope.current_stock_by_id(drpWH, item.id);
            $scope.searchKeyword = {};
            angular.element('#stockAllocationModal').modal({ show: true });
        }
    }


    $scope.OnFocusQty = function (stock_item) {
        stock_item.active_line = true;
    }
    $scope.OnBlurQty = function (stock_item) {
        stock_item.active_line = false;
    }


    $scope.addStockItem = function (stock, stock_item) {
        stock.active_line = false;

        if (Number(stock.req_qty) <= 0 || stock.req_qty == undefined) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(319, ['Quantity ', '0']));
            return false;
        }
        if (stock.wh_location == undefined) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Target Location']));
            return false;
        }
        if (Number(stock.req_qty) > Number(stock.qty_sold)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(540));
            return false;
        }
        if (Number($scope.remainig_qty) == 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(510));
            return false;
        }
        if (Number(stock.req_qty) > Number($scope.remainig_qty)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(541));
            return false;
        }
        if (Number(stock.req_qty) > (Number(stock.qty_sold) - Number(stock.qty_returned) - Number(stock.qty_currently_returned))) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(599, [(String(Number(stock.qty_sold) - Number(stock.qty_returned)))]));
            
            return false;
        }

        // $scope.remainig_qty = $scope.remainig_qty - stock.req_qty;
        var addStockUrl = $scope.$root.sales + "warehouse/add-order-stock-allocation";
        stock.token = $scope.$root.token;
        stock.source_type = stock.type;
        stock.type = 2;
        stock.sale_order_detail_id = stock_item.update_id;
        stock.order_detail_id = stock_item.update_id;
        
        stock.order_id = $scope.$root.order_id;
        stock.bl_shipment_no = stock.bl_shipment_no;
        stock.item_id = stock_item.id;
        stock.warehouse_id = stock_item.warehouses;
        stock.order_date = $scope.$root.posting_date;
        stock.targeted_warehouse_id = stock_item.warehouses;
        //stock.unit_id = stock_item.units;
        //stock.unit_measure = stock_item.unit_of_measure_name;
        stock.sale_return_status = 1;
        stock.user_id = $scope.$root.crm_id;
        stock.sale_invoice_id = $scope.rec.sale_invoice_id;
        
        stock.units = stock_item.units;
        stock.primary_unit_id = stock_item.primary_unit_of_measure_id;
        stock.primary_unit_name = stock_item.primary_unit_of_measure_name;
        $scope.showLoader = true;
        $http
            .post(addStockUrl, stock)
            .then(function (res) {


                if (res.data.ack == true) {
                    stock.active_line = true;
                    if (stock.id > 0)
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    else
                        toaster.pop('success', 'Add', 'Record  Inserted  .');

                    stock.qty_currently_returned = Number(stock.qty_currently_returned) + Number(stock.req_qty);
                    stock.avail_qty = Number(stock.avail_qty) + Number(stock.req_qty);
                    stock_item.allocated_stock = stock_item.allocated_stock + Number(stock.req_qty);
                    stock.req_qty = '';

                    $scope.getAllocatStock(stock_item.warehouses, stock_item.id, $scope.$root.order_id, stock_item.update_id);
                    $scope.stock_allocate_detail(stock.product_id, 3, stock_item.warehouses, stock_item.update_id);//stock.warehouse_id);
                    $scope.current_stock_by_id(stock_item.warehouses, stock_item.id);
                    $scope.showLoader = false;
                }
                else
                {
                    $scope.getAllocatStock(stock_item.warehouses, stock_item.id, $scope.$root.order_id, stock_item.update_id);
                    $scope.stock_allocate_detail(stock_item.id, 0, stock_item.warehouses, stock_item.update_id);
                    $scope.current_stock_by_id(stock_item.warehouses, stock_item.id);
                    $scope.showLoader = false;
                    toaster.pop('error', 'Error', res.data.error);
                }


            });

    }

    $scope.delStockItem = function (stock, stock_item) {
        stock.active_line = false;

        if (isNaN(stock.req_qty)) {
            stock.req_qty = 0;
            toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(319, ['Quantity','0']));
            return;
        }

        if (Number(stock.req_qty) <= 0) {
            stock.req_qty = 0;
            toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(319, ['Quantity','0']));
            return;
        }

        if (Number(stock.req_qty) > Number(stock.qty_currently_returned)) {
            toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(542));
            return;
        }

        var postData = stock;
        postData.order_id = $scope.$root.order_id;
        stock.sale_order_detail_id = stock_item.update_id;
        stock.item_id = stock_item.id;
        postData.token = $scope.$root.token;
        postData.sale_return_status = 1;
        postData.WH_loc_id = stock.wh_location;
        postData.targeted_warehouse_id = stock_item.warehouses;
        postData.sale_invoice_id = $scope.rec.sale_invoice_id;

        if (stock.req_qty == stock.qty_currently_returned)
            var delStockUrl = $scope.$root.sales + "warehouse/delete-sale-order-stock";
        else
            var delStockUrl = $scope.$root.sales + "warehouse/deallocate-sale-order-stock";
        /*console.log(stock);
         return;*/
        $scope.showLoader = true;
        $http
            .post(delStockUrl, { 'token': $scope.$root.token, 'postData': postData })
            .then(function (res) {
                if (res.data.ack == true) {
                    stock.active_line = true;
                    // $scope.getAllocatStock(stock.warehouse_id, stock.product_id, stock.order_id);
                    // stock.qty_returned = Number(stock.qty_returned) - Number(stock.req_qty);
                    stock.qty_currently_returned = Number(stock.qty_currently_returned) - Number(stock.req_qty);
                    stock.avail_qty = Number(stock.avail_qty) - Number(stock.req_qty);
                    stock_item.allocated_stock = stock_item.allocated_stock - Number(stock.req_qty);
                    stock.req_qty = '';

                    $scope.getAllocatStock(stock_item.warehouses, stock_item.id, $scope.$root.order_id, stock_item.update_id);
                    $scope.stock_allocate_detail(stock.product_id, 3, stock_item.warehouses, stock_item.update_id);//stock.warehouse_id);
                    $scope.current_stock_by_id(stock_item.warehouses, stock_item.id);
                    $scope.chk_allocation_nd_dispatch();
                    $scope.showLoader = false;
                }
                else
                {
                    $scope.getAllocatStock(stock_item.warehouses, stock_item.id, $scope.$root.order_id, stock_item.update_id);
                    $scope.stock_allocate_detail(stock_item.id, 0, stock_item.warehouses, stock_item.update_id);
                    $scope.current_stock_by_id(stock_item.warehouses, stock_item.id);
                    $scope.showLoader = false;
                    toaster.pop('error', 'Error', res.data.error);
                }

            });
        /* var delStockUrl = $scope.$root.sales + "warehouse/delete-sale-order-stock";
        $http
            .post(delStockUrl, { id: ostk.id, token: $scope.$root.token })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.getAllocatStock(ostk.warehouse_id, ostk.item_id, ostk.order_id);
                    $scope.stock_allocate_detail(ostk.item_id, 3);
                    $scope.chk_allocation_nd_dispatch();
                }

            }); */
    }

    /*--------------------------------stock-----------------------------------*/


    $scope.edit_recive_stock = function () {
        $scope.show_recieve_list = false;
        $scope.show_recieve_list_anchor = true;
        $scope.show_recieve_list_anchor_allocate = false;

    }


    $scope.get_aisle_location = function (zone_id) {

        $scope.formData.aisle = 0;
        $scope.formData.bin = 0;

        var aisle_postUrl = $scope.$root.setup + "warehouse/get-warehouse-sub-location";

        $http
            .post(aisle_postUrl, {
                'token': $scope.$root.token,
                'wrh_id': $scope.formData.warehouses_id,
                'parent_id': zone_id
            })
            .then(function (res) {
                // console.log(res);

                if (res.data.ack == true) {
                    // console.log(res.data.response);
                    $scope.aisle = [];
                    $scope.aisle = res.data.response;
                    $scope.formData.aisle = 1;
                }
                else {

                    var cost_uom_postUrl = $scope.$root.setup + "warehouse/get-warehouse-sub-loc-cost-uom";

                    $http
                        .post(cost_uom_postUrl, {
                            'token': $scope.$root.token,
                            'wrh_id': $scope.formData.warehouses_id,
                            'location_id': zone_id
                        })
                        .then(function (res) {

                            if (res.data.ack == true) {
                                //console.log(res.data.response);
                                $scope.formData.uom = res.data.response.uom;
                                $scope.formData.cost = res.data.response.cost;
                                $scope.formData.currency = res.data.response.currency;
                            }
                        });

                }
            });
    }

    $scope.get_bin_location = function (aisle_id) {

        $scope.formData.bin = 0;

        var bin_postUrl = $scope.$root.setup + "warehouse/get-warehouse-sub-location";

        $http
            .post(bin_postUrl, {
                'token': $scope.$root.token,
                'wrh_id': $scope.formData.warehouses_id,
                'parent_id': aisle_id
            })
            .then(function (res) {
                // console.log(res);

                if (res.data.ack == true) {
                    // console.log(res.data.response);
                    $scope.bin = [];
                    $scope.bin = res.data.response;
                    $scope.formData.bin = 1;
                }
                else {

                    var cost_uom_postUrl = $scope.$root.setup + "warehouse/get-warehouse-sub-loc-cost-uom";

                    $http
                        .post(cost_uom_postUrl, {
                            'token': $scope.$root.token,
                            'wrh_id': $scope.formData.warehouses_id,
                            'location_id': aisle_id
                        })
                        .then(function (res) {

                            if (res.data.ack == true) {
                                //console.log(res.data.response);
                                $scope.formData.uom = res.data.response.uom;
                                $scope.formData.cost = res.data.response.cost;
                                $scope.formData.currency = res.data.response.currency;
                            }
                        });

                }
            });
    }

    $scope.get_cost_uom_location = function (bin_id) {

        var cost_uom_postUrl = $scope.$root.setup + "warehouse/get-warehouse-sub-loc-cost-uom";

        $http
            .post(cost_uom_postUrl, {
                'token': $scope.$root.token,
                'wrh_id': $scope.formData.warehouses_id,
                'location_id': bin_id
            })
            .then(function (res) {

                if (res.data.ack == true) {
                    //console.log(res.data.response);
                    $scope.formData.uom = res.data.response.uom;
                    $scope.formData.cost = res.data.response.cost;
                    $scope.formData.currency = res.data.response.currency;
                }
            });

    }


    $scope.get_warehouse = function (item) {

        //console.log(item);
        $scope.$root.load_date_picker('sale order');
        $('.wr_date_block').attr("disabled", false);

        if (item.units == null) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Unit Of Measure']));
            return;
        }
        if (item.qty == 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Quantity']));
            return;
        }
        if (item.warehouses == null) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Location']));
            return;
        }

        $scope.formData = {};
        $scope.record = {};
        $scope.columns = [];
        $scope.total_remaing = 0;

        //$scope.formData.item_qty=Number(item.units.quantity) * Number(item.qty);
        //$scope.formData.stock_qty=Number(item.units.quantity) * Number(item.qty);


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

        $scope.formData.order_id = $stateParams.id;

        $scope.formData.product_id = item.id;
        $scope.formData.product_code = item.product_code;
        $scope.formData.product_name = item.product_name;
        $scope.formData.type = 2;
        $scope.formData.warehouses_id = item.warehouses;
        $scope.formData.warehouses_name = item.warehouses.name;

        $scope.formData.bl_shipment_no = $scope.rec.comm_book_in_no;//  $scope.bl_no;
        $scope.formData.order_no = $scope.rec.sell_to_cust_no; //$scope.code;
        $scope.formData.order_date = $scope.rec.posting_date; //$scope.order_date;


        $scope.formData.aisle = 0;
        $scope.formData.bin = 0;

        var zone_postUrl = $scope.$root.setup + "warehouse/get-warehouse-sub-location";

        $http
            .post(zone_postUrl, { 'token': $scope.$root.token, 'wrh_id': $scope.formData.warehouses_id })
            .then(function (res2) {
                // console.log(res);

                if (res2.data.ack == true) {
                    // console.log(res.data.response);
                    $scope.zone = [];
                    $scope.zone = res2.data.response;
                }
            });


        var postUrl = $scope.$root.setup + "warehouse/stk-allocation";
        $http
            .post(postUrl, {
                'token': $scope.$root.token,
                'product_id': $scope.formData.product_id,
                'order_id': $scope.formData.order_id,
                'warehouses_id': $scope.formData.warehouses_id,
                'type_id': $scope.formData.type
            })
            .then(function (res) {
                $scope.record = {};
                $scope.columns = [];

                $scope.record = res.data.response;

                if (res.data.total == null) $scope.total_remaing = $scope.formData.item_qty;
                else {

                    $scope.total_remaing = (Number($scope.formData.item_qty)) - (Number(res.data.total));
                    if ($scope.total_remaing < 0) $scope.total_remaing = 0;
                    $scope.formData.stock_qty = $scope.total_remaing;

                }

                angular.forEach(res.data.response[0], function (val, index) {
                    $scope.columns.push({
                        'title': toTitleCase(index),
                        'field': index,
                        'visible': true
                    });
                });

            });
        $scope.show_import_div = false;

        angular.element('#return_ware_modal').modal({ show: true });
    }

    $scope.get_warehouse_list = function () {
        var postUrl = $scope.$root.setup + "warehouse/stk-allocation";
        $http
            .post(postUrl, {
                'token': $scope.$root.token,
                'product_id': $scope.formData.product_id,
                'order_id': $scope.formData.order_id,
                'warehouses_id': $scope.formData.warehouses_id,
                'type_id': $scope.formData.type
            })
            .then(function (res) {
                $scope.record = {};
                $scope.columns = [];

                $scope.record = res.data.response;

                if (res.data.total == null) $scope.total_remaing = $scope.formData.item_qty;
                else {

                    $scope.total_remaing = (Number($scope.formData.item_qty)) - (Number(res.data.total));
                    if ($scope.total_remaing < 0) $scope.total_remaing = 0;
                    $scope.formData.stock_qty = $scope.total_remaing;

                }

                angular.forEach(res.data.response[0], function (val, index) {
                    $scope.columns.push({
                        'title': toTitleCase(index),
                        'field': index,
                        'visible': true
                    });
                });

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
        $scope.formData.zone_location = '';
        $scope.formData.stock_qty = '';
        $scope.formData.currency = '';
        $scope.formData.uom = '';
        $scope.formData.aisle = 0;
        $scope.formData.bin = 0;
        $scope.formData.cost = '';

    }

    $scope.add_warehouse = function (formData) {

        if (Number($scope.formData.stock_qty <= 0)) {
            toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(360, ['Quantity ', '0']));
            return;
        }

        if (parseInt($scope.formData.stock_qty) > parseInt($scope.total_remaing)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(359));
            return;
        }
        //console.log(formData);return;
        formData.purchase_return_status = 0;
        formData.purchase_status = 1;

        formData.zone_id = 0;
        formData.aisle_id = 0;
        formData.bin_id = 0;

        if (formData.zone_location !== undefined)
            formData.zone_id = formData.zone_location.id;

        if (formData.aisle_location !== undefined)
            formData.aisle_id = formData.aisle_location.id;

        if (formData.bin_location !== undefined)
            formData.bin_id = formData.bin_location.id;

        formData.location = "";

        if (formData.zone_id > 0) {
            formData.location = formData.zone_id;

            if (formData.aisle_id > 0) {
                formData.location = formData.location + "," + formData.aisle_id;

                if (formData.bin_id > 0)
                    formData.location = formData.location + "," + formData.bin_id;
            }
        }

        /*console.log(formData);
         return false;*/


        formData.order_date1 = $scope.$root.posting_date;
        formData.token = $scope.$root.token;
        formData.supplier_id = $scope.rec.sell_to_cust_id;

        var addcrmUrl = $scope.$root.setup + "warehouse/add-stk-allocation";
        if (formData.id !== undefined)
            addcrmUrl = $scope.$root.setup + "warehouse/update-stk-allocation";
        $http
            .post(addcrmUrl, formData)
            .then(function (res) {
                if (res.data.ack == 1) {
                    $scope.get_warehouse_list();
                    $scope.clear_form();
                    //$scope.formData={};
                    if (formData.id > 0)
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    else
                        toaster.pop('success', 'Add', 'Record  Inserted  .');

                    //$scope.$root.rec_id = res.data.id;
                    //toaster.pop('success', res.data.info,res.data.msg);
                    //  $timeout(function(){ $state.go("app.edit-srm",{id:res.data.id} ); }, 1000);


                }
                else {
                    if (formData.id > 0)
                        toaster.pop('error', 'Edit', res.data.error);
                    else
                        toaster.pop('error', 'Error', res.data.error);
                }
            });

    }

    $scope.edit_ware = function (id) {

        //  var altcontUrl = $scope.$root.setup + "warehouse/get-stk-allocation";
        var altcontUrl = $scope.$root.setup + "warehouse/get-stk-allocation-by-id";

        var postViewData = {
            'token': $scope.$root.token,
            'id': id
        };
        $http
            .post(altcontUrl, postViewData)
            .then(function (res) {
                //console.log(res);
                // $scope.formData = res.data.response;
                $scope.formData.id = res.data.response.id;
                $scope.formData.container_no = res.data.response.container_no;
                $scope.formData.batch_no = res.data.response.batch_no;
                $scope.formData.stock_qty = res.data.response.quantity;
                $scope.formData.warehouses_id = res.data.response.warehouse_id;
                $scope.formData.cost = res.data.response.cost;

                $scope.allocated_locations_array = res.data.response.location.split(",");
                // console.log($scope.allocated_locations_array);
                $scope.allocated_locations_length = $scope.allocated_locations_array.length;

                $scope.formData.aisle = 0;
                $scope.formData.bin = 0;
                $scope.formData.zone_location = "";

                $.each($scope.zone, function (index, elem) {
                    if (elem.id == $scope.allocated_locations_array[0])
                        $scope.formData.zone_location = elem;
                });

                if ($scope.allocated_locations_length == 2) {


                    var aisle_postUrl = $scope.$root.setup + "warehouse/get-warehouse-sub-location";

                    $http
                        .post(aisle_postUrl, {
                            'token': $scope.$root.token,
                            'wrh_id': $scope.formData.warehouses_id,
                            'parent_id': $scope.allocated_locations_array[0]
                        })
                        .then(function (res) {
                            // console.log(res);

                            if (res.data.ack == true) {
                                // console.log(res.data.response);
                                $scope.aisle = [];
                                $scope.aisle = res.data.response;
                                $scope.formData.aisle = 1;

                                $.each($scope.aisle, function (index, elem) {
                                    if (elem.id == $scope.allocated_locations_array[1])
                                        $scope.formData.aisle_location = elem;
                                });
                            }
                        });

                } else if ($scope.allocated_locations_length == 3) {

                    $scope.formData.aisle = 0;
                    $scope.formData.bin = 0;

                    var aisle_postUrl = $scope.$root.setup + "warehouse/get-warehouse-sub-location";

                    $http
                        .post(aisle_postUrl, {
                            'token': $scope.$root.token,
                            'wrh_id': $scope.formData.warehouses_id,
                            'parent_id': $scope.allocated_locations_array[0]
                        })
                        .then(function (res) {
                            // console.log(res);

                            if (res.data.ack == true) {
                                // console.log(res.data.response);
                                $scope.aisle = [];
                                $scope.aisle = res.data.response;
                                $scope.formData.aisle = 1;

                                // $scope.formData.aisle_location = $scope.aisle[$scope.allocated_locations_array[1]];
                                $.each($scope.aisle, function (index, elem) {
                                    if (elem.id == $scope.allocated_locations_array[1])
                                        $scope.formData.aisle_location = elem;
                                });
                            }
                        });


                    var bin_postUrl = $scope.$root.setup + "warehouse/get-warehouse-sub-location";

                    $http
                        .post(bin_postUrl, {
                            'token': $scope.$root.token,
                            'wrh_id': $scope.formData.warehouses_id,
                            'parent_id': $scope.allocated_locations_array[1]
                        })
                        .then(function (res) {
                            // console.log(res);

                            if (res.data.ack == true) {
                                // console.log(res.data.response);
                                $scope.bin = [];
                                $scope.bin = res.data.response;
                                $scope.formData.bin = 1;

                                // $scope.formData.bin_location = $scope.bin[$scope.allocated_locations_array[2]];
                                $.each($scope.bin, function (index, elem) {
                                    if (elem.id == $scope.allocated_locations_array[2])
                                        $scope.formData.bin_location = elem;
                                });
                            }
                        });
                }


                if ($scope.total_remaing == null) $scope.total_remaing = res.data.response.quantity;
                else {
                    $scope.total_remaing = (Number(res.data.response.quantity)) - Number($scope.total_remaing);
                    if ($scope.total_remaing < 0) $scope.total_remaing = 0;
                }

                if (res.data.response.prod_date == 0) $scope.formData.prod_date = null;
                else $scope.formData.prod_date = $scope.$root.convert_unix_date_to_angular(res.data.response.prod_date);

                if (res.data.response.use_by_date == 0) $scope.formData.use_by_date = null;
                else $scope.formData.use_by_date = $scope.$root.convert_unix_date_to_angular(res.data.response.use_by_date);

                if (res.data.response.date_received == 0) $scope.formData.date_received = null;
                else $scope.formData.date_received = $scope.$root.convert_unix_date_to_angular(res.data.response.date_received);


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
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });


    }
    /*--------------------------------stockend--------------------------------*/

    $scope.convert_post_invoice = function (rec, rec2, queue_for_approval) {

        /* var convInvoiceUrl = $scope.$root.sales + "customer/return-order/convert-to-invoice";
        $http
            .post(convInvoiceUrl, {
                id: $stateParams.id,
                token: $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', "Post Invoice successfully.");
                    angular.element("#goToNewOrder").click();
                }
            }); */

        var check_approvals = $scope.$root.setup + "general/check-for-approvals";
        //'warehouse_id': item.warehouses.id
        $http
            .post(check_approvals, {
                'object_id': $scope.$root.order_id,
                type: "3, 8",
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {

                    if(queue_for_approval == undefined)
                    {
                        var valid = 1;
                        var quantity_count = 0;
                        var valid_dispatch_check = 1;
                        var include_item = 0;
                        var total_rec = 0;
                        var item_count = 0;
                        var gl_count = 0;

                        angular.forEach($scope.items, function (obj) {
                            if (obj.item_type == 0 && obj.stock_check == 1 && (obj.remainig_qty == undefined || obj.remainig_qty > 0))
                                valid = 0;

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
                            toaster.pop("error", "Error", "Please allocate all the stock before receiving");
                            return;
                        }

                        
                        if($scope.rec.grand_total < 0)
                        {
                            toaster.pop("error", "Error", "Invoice value should not be less than zero");
                            return;
                        }

                        
                        if(Number(item_count) > 0 && Number($scope.rec.alt_depo_id) == 0)
                        {
                            toaster.pop("error", "Error", $scope.$root.getErrorMessageByCode(230, ['Shipping Address']));
                            return;
                        }

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

                        if (item_count > 0 && $scope.$parent.rec.delivery_date == null) {
                            if (error_count > 0)
                                error_msg = error_msg + ', Receipt date';
                            else
                                error_msg = error_msg + 'Receipt date';
                            error_count++;
                        }


                        if (quantity_count > 0) {
                            if (quantity_count == 1)
                                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(543));
                            else
                                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(600, [String(quantity_count)]));
                            
                            return;
                        }


                        if (!$scope.hide_dispatch_btn) {
                            if (error_count > 0) {
                                $rootScope.credit_note_post_invoice_msg = "Are you sure you want to post this Credit Note?";
                            }
                            else
                                $rootScope.credit_note_post_invoice_msg = "Are you sure you want to post this Credit Note?";

                            
                            if (item_count > 0)
                                $rootScope.credit_note_post_invoice_msg += " Stock will be automatically received.";
                        }
                        else {
                            if (error_count > 0)
                                $rootScope.credit_note_post_invoice_msg = "Are you sure you want to post this Credit Note? . The " + error_msg + " not specified, will be set to current date";
                            else
                                $rootScope.credit_note_post_invoice_msg = "Are you sure you want to post this Credit Note?";
                        }


                        ngDialog.openConfirm({
                            template: '_confirm_credit_note_invoice_modal',
                            className: 'ngdialog-theme-default-custom'
                        }).then(function (value) {
                            // $timeout(function () {

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
                                    or_date: $scope.rec.posting_date
                                })
                                .then(function (res) {
                                    if (res.data.ack != undefined)
                                    {
                                        var conv_rate = 1;
                                        if ($scope.$root.c_currency_id == $scope.$root.defaultCurrency)
                                        {    
                                            var currChk = true;
                                            conv_rate = 1; //$scope.$parent.rec.currency_rate;
                                            $scope.$parent.rec.currency_rate = 1;
                                        }
                                        else if (res.data.ack == true)
                                        {
                                            var currChk = false;
                                            conv_rate = res.data.response.conversion_rate;
                                            $scope.$parent.rec.currency_rate = res.data.response.conversion_rate;
                                        }
                                        else
                                        {
                                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(601, [$scope.$parent.rec.posting_date]));
                                            
                                            $scope.showLoader = false;
                                            return;
                                        }
                                        // if (currChk == true) 
                                        {
                                            //	if (res.data.response.conversion_rate != null || currChk == true ) {
                                            $scope.$parent.rec.currency_rate = conv_rate;
                                            $scope.rec.grand_total_converted = Number($scope.rec.grand_total) / conv_rate;

                                            $scope.rec.bill_to_posting_group_id = ($scope.drp.vat_bus_posting_group != undefined) ? $scope.drp.vat_bus_posting_group.id : 0;
                                            if (Number($scope.rec.bill_to_posting_group_id) == 0)
                                            {
                                                toaster.pop('error', 'Error', ' Select Posting Group of Customer ');
                                                $scope.showLoader = false;
                                                return;
                                            }
                                            /* if(Number($scope.rec.sale_person_id) == 0)
                                            {
                                                toaster.pop('error', 'Error', ' Select Salesperson for the Credit Note. ');
                                                $scope.showLoader = false;
                                                return;
                                            } */
                                            
                                            // $scope.add_general(rec, rec2, void 0, 1);
                                            $scope.load_invoice();
                                        } 
                                        /* else 
                                        {
                                            $scope.showLoader = false;
                                            toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                                        } */
                                    } 
                                    /* else {
                                        $scope.showLoader = false;
                                        toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                                    } */
                                });


                            // $scope.showLoader = false;
                            // }, 1000);

                        },
                            function (reason) {
                                console.log('Modal promise rejected. Reason: ', reason);
                            });
                    }
                    else
                    {
                        toaster.pop('success', 'Success', $scope.$root.getErrorMessageByCode(666, ['Credit Note']));
                    }
                }
                else
                {
                    var already_checked = 0;
                    var response = res.data.response;
                    if (Number(response[0].type) == 3) {
                        if (Number(response[0].prev_status) == -1 || Number(response[0].prev_status) == 3 || Number(response[0].prev_status) == 6) {
                            var str = '';
                            if (Number(response[0].prev_status) == 3) {
                                str = "Previously disapproved by " + response[0].responded_by + ", ";

                            }
                            $rootScope.approval_message = str + "You need an Credit Note Level 1 Approval before posting this credit note.";
                            already_checked = 1;
                            ngDialog.openConfirm({
                                template: '_confirm_approval_required_modal',
                                className: 'ngdialog-theme-default-custom'
                            }).then(function (value) {
                                $scope.showLoader = true;
                                var check_approvals = $scope.$root.setup + "general/send-for-approval";
                                //'warehouse_id': item.warehouses.id
                                $http
                                    .post(check_approvals, {
                                        'object_id': $scope.$root.order_id,
                                        'object_code': $scope.rec.return_order_code,
                                        'source_name': $scope.rec.sell_to_cust_name,
                                        'source_code': $scope.rec.sell_to_cust_no,
                                        'detail_id':0,
                                        'approval_id': response[0].id,
                                        'code': $scope.rec.return_order_code,
                                        'currency_code': $scope.rec.currency_id.code,
                                        'type': "3",
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
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(372));
                            return;
                        }
                        else if (Number(response[0].prev_status) == 0) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(391));
                            return;
                        }
                        else if (Number(response[0].prev_status) == 7) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(392, ['Credit Note']));
                            return;
                        }
                    }


                    var response2 = {};
                    if (response.length == 1)
                        response2 = response[0];
                    else if (response.length == 2)
                        response2 = response[1];


                    if (already_checked == 0 && Number(response2.type) == 8) {
                        if (Number(response2.prev_status) == -1 || Number(response2.prev_status) == 3 || Number(response2.prev_status) == 6) {
                            var str = '';
                            if (Number(response2.prev_status) == 3) {
                                str = "Previously disapproved by " + response2.responded_by + ", ";

                            }
                            $rootScope.approval_message = str + "You need an Credit Note Level 2 Approval before posting this credit note.";
                            already_checked = 1;
                            ngDialog.openConfirm({
                                template: '_confirm_approval_required_modal',
                                className: 'ngdialog-theme-default-custom'
                            }).then(function (value) {
                                $scope.showLoader = true;
                                var check_approvals = $scope.$root.setup + "general/send-for-approval";
                                //'warehouse_id': item.warehouses.id
                                $http
                                    .post(check_approvals, {
                                        'object_id': $scope.$root.order_id,
                                        'object_code': $scope.rec.return_order_code,
                                        'source_name': $scope.rec.sell_to_cust_name,
                                        'source_code': $scope.rec.sell_to_cust_no,
                                        'detail_id':0,
                                        'approval_id': response2.id,
                                        'code': $scope.rec.return_order_code,
                                        'currency_code': $scope.rec.currency_id.code,
                                        'type': "8",
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
                        else if (Number(response2.prev_status) == 1) {
                            $scope.showLoader = false;
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(372));
                            return;
                        }
                        else if (Number(response2.prev_status) == 0) {
                            $scope.showLoader = false;
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(391));
                            return;
                        }
                        else if (Number(response2.prev_status) == 7) {
                            $scope.showLoader = false;
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(392, ['Credit Note']));
                            return;
                        }
                    }
                }
            });
    }

    $scope.dsptch = {}

    $scope.receiveStock_org = function (rec, rec2) {


        var valid = 1;
        angular.forEach($scope.items, function (obj) {
            if (obj.item_type == "0" && obj.stock_check == "1" && (obj.remainig_qty == undefined || obj.remainig_qty > 0 || isNaN(obj.remainig_qty)))
                valid = 0;
        });
        if (!valid) {
            toaster.pop("error", "Error", "Please allocate all the stock before receiving");
            return;
        }
        // $scope.add_general(rec, rec2);

        var dispStockUrl = $scope.$root.sales + "warehouse/dispatch-stock";
        $rootScope.credit_note_receive_stock_msg = "Are you sure you want to receive the credit note stock?";

        ngDialog.openConfirm({
            template: '_confirm_credit_note_receive',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $scope.dsptch.token = $scope.$root.token;
            $scope.dsptch.order_id = $scope.$root.order_id;
            $scope.dsptch.return_type = 1;
            $scope.dsptch.sale_return_status = 1;
            $http
                .post(dispStockUrl, $scope.dsptch)
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.hide_dispatch_btn = true;
                        $scope.$parent.check_so_readonly = true;
                        $scope.check_so_readonly = true;
                        $scope.getOrdersDetail();
                        toaster.pop("success", "Info", "Stock has been received");
                    }

                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    
    $scope.receiveStock = function (rec, rec2) {
        var check_approvals = $scope.$root.setup + "general/check-for-approvals";
        //'warehouse_id': item.warehouses.id
        $http
            .post(check_approvals, {
                'object_id': $scope.$root.order_id,
                type: "3, 8",
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.receiveStock_org(rec, rec2);
                }
                else
                {
                    var response = res.data.response;
                    var already_checked = 0;
                    if (Number(response[0].type) == 3) {
                        if (Number(response[0].prev_status) == -1 || Number(response[0].prev_status) == 3 || Number(response[0].prev_status) == 6) {
                            var str = '';
                            if (Number(response[0].prev_status) == 3) {
                                str = "Previously disapproved by " + response[0].responded_by + ", ";

                            }
                            $rootScope.approval_message = str + "You need an Approval before posting this credit note.";
                            already_checked = 1;
                            ngDialog.openConfirm({
                                template: '_confirm_approval_required_modal',
                                className: 'ngdialog-theme-default-custom'
                            }).then(function (value) {
                                $scope.showLoader = true;
                                var check_approvals = $scope.$root.setup + "general/send-for-approval";
                                //'warehouse_id': item.warehouses.id
                                $http
                                    .post(check_approvals, {
                                        'object_id': $scope.$root.order_id,
                                        'object_code': $scope.rec.return_order_code,
                                        'source_name': $scope.rec.sell_to_cust_name,
                                        'source_code': $scope.rec.sell_to_cust_no,
                                        'detail_id':0,
                                        'approval_id': response[0].id,
                                        'code': $scope.rec.return_order_code,
                                        'currency_code': $scope.rec.currency_id.code,
                                        'type': "3",
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
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(372));
                            return;
                        }
                        else if (Number(response[0].prev_status) == 0) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(391));
                            return;
                        }
                        else if (Number(response[0].prev_status) == 7) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(392, ['Credit Note']));
                            return;
                        }
                    }

                    

                    var response2 = {};
                    if (response.length == 1)
                        response2 = response[0];
                    else if (response.length == 2)
                        response2 = response[1];


                    if (already_checked == 0 && Number(response2.type) == 8) {
                        if (Number(response2.prev_status) == -1 || Number(response2.prev_status) == 3 || Number(response2.prev_status) == 6) {
                            var str = '';
                            if (Number(response2.prev_status) == 3) {
                                str = "Previously disapproved by " + response2.responded_by + ", ";

                            }
                            $rootScope.approval_message = str + "You need an Credit Note Level 2 Approval before posting this credit note.";
                            already_checked = 1;
                            ngDialog.openConfirm({
                                template: '_confirm_approval_required_modal',
                                className: 'ngdialog-theme-default-custom'
                            }).then(function (value) {
                                $scope.showLoader = true;
                                var check_approvals = $scope.$root.setup + "general/send-for-approval";
                                //'warehouse_id': item.warehouses.id
                                $http
                                    .post(check_approvals, {
                                        'object_id': $scope.$root.order_id,
                                        'object_code': $scope.rec.return_order_code,
                                        'source_name': $scope.rec.sell_to_cust_name,
                                        'source_code': $scope.rec.sell_to_cust_no,
                                        'detail_id':0,
                                        'approval_id': response2.id,
                                        'code': $scope.rec.return_order_code,
                                        'currency_code': $scope.rec.currency_id.code,
                                        'type': "8",
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
                        else if (Number(response2.prev_status) == 1) {
                            $scope.showLoader = false;
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(372));
                            return;
                        }
                        else if (Number(response2.prev_status) == 0) {
                            $scope.showLoader = false;
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(391));
                            return;
                        }
                        else if (Number(response2.prev_status) == 7) {
                            $scope.showLoader = false;
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(392, ['Credit Note']));
                            return;
                        }
                    }
                }
            });
    }

    $scope.load_invoice = function (nettotal, vat, grand) {
       
        var dispStockUrl = $scope.$root.sales + "warehouse/invoice-stock";
        $scope.invoice_params = {};
        $scope.invoice_params.token         = $scope.$root.token;
        $scope.invoice_params.order_id      = $scope.$root.order_id;
        $scope.invoice_params.type          = 2;
        $scope.invoice_params.posting_grp   = $scope.rec.bill_to_posting_group_id;
        $scope.invoice_params.items_net_amt = $scope.rec.items_net_total;
        $scope.invoice_params.items_net_vat = $scope.rec.items_net_vat;
        $scope.invoice_params.items_net_disc= $scope.rec.items_net_discount;
        $scope.invoice_params.grand_total   = $scope.rec.grand_total;
        $scope.showLoader = true;
        $http
            .post(dispStockUrl, $scope.invoice_params)
            .then(function (res) {
                if (res.data.ack == true) {
                      
                    $scope.showLoader = false;
                    $scope.hide_dispatch_btn = true; 
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(628));
                    $scope.items = [];
                    $scope.showVolumeWeight = 0;
                    $scope.$emit('SalesLines', $scope.items);
                    $scope.$emit('InvoicePosted', $scope.$parent.rec);
                    $state.go("app.addReturnOrder");
                    
                }
                else
                {
                    $scope.showLoader = false;
                    toaster.pop('error', 'Info', res.data.error);
                }

            });
                       
/* $scope.product_type = true;
        $scope.count_result = 0;
        var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
        var name = $scope.$root.base64_encode('return_orders');
        var no = $scope.$root.base64_encode('sale_invioce_no');
        var module_category_id = 2;
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
                    


                    var convInvoiceUrl = $scope.$root.sales + "customer/return-order/convert-to-invoice";
                    $http
                        .post(convInvoiceUrl, {
                            id: $scope.$root.order_id,
                            type: 2,
                            'module': 1,
                            'token': $scope.$root.token,
                            'return_invoice_code': sale_invoice_code,
                            'sale_invoice_no': sale_invoice_no
                        })
                        .then(function (res) {
                            if (res.data.ack == true) {
                                toaster.pop('success', 'Info', 'Posted to Credit Note');
                                $scope.items = [];
                                $scope.$emit('SalesLines', $scope.items);
                                $scope.$emit('InvoicePosted', $scope.$parent.rec);
                                $state.go("app.addReturnOrder");
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
        /* console.log(nettotal);
        var total = 0;
        angular.forEach($scope.items, function (item) {
            //Gl 1  item 0 //account_number, tran_type, module_type, amt, posting_date, mid, currency_id, statuschk,reference_id
            if (item.item_type == 1) $scope.$root.accountentry(item.id, 2, 4, item.qty * item.standard_price, $scope.$root.posting_date, $stateParams.id, $scope.$root.c_currency_id);

            else if (item.item_type == 0) {
                if (item.units != undefined && item.units.quantity != undefined)
                    var subtotal = item.qty * item.standard_price * item.units.quantity;
                else
                    var subtotal = item.qty * item.standard_price;


                total += subtotal;
                if (item.discount_type_id != undefined && item.discount > 0) {
                    if (item.discount_type_id.id == 'Percentage')
                        total = total - (total * item.discount / 100);
                    else
                        total = total - item.discount;
                }

            }
        });

        if (Number(total) > 0)
            $scope.$root.accountentry(nettotal, 2, 4, total, $scope.$root.posting_date, $stateParams.id, $scope.$root.c_currency_id);//$scope.netTotal()

        // acount number .tranction type(credit,debit) , modue type ,amount  (total vat grand)
        $scope.$root.accountentry(vat, 2, 4, $scope.calcVat(), $scope.$root.posting_date, $stateParams.id, $scope.$root.c_currency_id);
        $scope.$root.accountentry(grand, 1, 4, $scope.grandTotal(), $scope.$root.posting_date, $stateParams.id, $scope.$root.c_currency_id);

        //return;
        var dispStockUrl = $scope.$root.sales + "warehouse/dispatch-stock";
        $scope.dsptch.token = $scope.$root.token;
        $scope.dsptch.sale_return_status = '1';
        $scope.dsptch.order_id = $stateParams.id;// $scope.sale_order_id;//$scope.$root.order_id;
        $http
            .post(dispStockUrl, $scope.dsptch)
            .then(function (res) {

                $scope.postInvoice();
                toaster.pop("success", "Info", "Stock has been returned.");
                $state.go("app.return-orders");


            });
 */
    }
    
    $scope.OnChangeUnitPrice = function (item) {
        item.standard_price = Number(item.standard_price).toFixed(3);
        item.standard_price = Number(item.standard_price);
    }

    $scope.onChangeDiscountType = function (item) {
        if (item.discount != '') {
            if (isNaN(item.discount)) {
                item.discount = '';
            }
        }
        if (item.discount_type_id != undefined) {

            if (item.discount_type_id.id == 'None') {
                item.discount = '';
            }
            else if (item.discount_type_id.id == 'Percentage') {
                if (item.discount != '' && Number(item.discount) > 100) {
                    item.discount = '';//item.discount.slice(0, -1);
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(515));
                }
            }
        }
    }
    $scope.checkDuplWHItem = function (param_item, index) {
        if (param_item.item_type == 0) {
            var chk_item = $filter("filter")(param_item.arr_warehouse, { id: param_item.warehouses }, true);
            if (chk_item != undefined && chk_item.length > 0) {
                param_item.warehouse_name = chk_item[0].name;
                param_item.warehouse_name_qty = chk_item[0].name + ' (' + chk_item[0].available_quantity + ')';
                /* if (Number(chk_item[0].available_quantity) < Number(param_item.qty)) {
                    toaster.pop('warning', 'Info', 'Available quantity is less than item quantity!');
                    $scope.items[index].warehouses = 0;
                    // return false;
                } */
            }
            else
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


    $scope.checkDuplWHLocation = function (stock_item) {
        console.log('onchange');
    }
    $scope.checkStock = function (item, index) {
        var chkStockUrl = $scope.$root.sales + 'customer/order/get-warehouse-avail-stock';
        $http
            .post(chkStockUrl, {
                'warehouse_id': item.warehouses,
                type: 1,
                item_id: item.id,
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    if (res.data.avail_qty < item.qty) {
                        toaster.pop('warning', 'Info', 'Available quantity is less than item quantity!');
                        $scope.items[index].warehouses = 0;
                        return false;
                    }
                }
                else {
                    toaster.pop('warning', 'Info', 'No stock availabe!');
                    $scope.items[index].warehouses = 0;
                    return false;
                }
            });
    }

    $scope.checkQty = function (item, index) {
        if (item.qty > item.soled_qty) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(602, [item.soled_qty]));
            
            $scope.items[index].qty = item.soled_qty;
            return;
        }
    }


    $scope.GetApprovalStatus = function () {
        $scope.approval_history = [];
        var postUrl_ref_cat = $scope.$root.setup + "general/get-approval-status";
        $scope.show_approval_btn = false;
        $scope.show_disapproval_btn = false;
        $scope.disableDisapprovalBtn = false;

        $http
            .post(postUrl_ref_cat, {
                'object_id': $scope.$root.order_id,
                type: "3, 8",
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.approval_history = res.data.response;
                    if ($scope.approval_history[$scope.approval_history.length - 1].statuss == 'Awaiting Approval' && Number($scope.approval_history[$scope.approval_history.length - 1].approver) == 1)
                    {
                        $scope.show_approval_btn = true;
                        $scope.show_disapproval_btn = true;
                    }

                    if($scope.approval_history[$scope.approval_history.length - 1].statuss == 'Approved' && Number($scope.approval_history[$scope.approval_history.length - 1].approver) == 1)
                        $scope.show_disapproval_btn = true;
                }
            });
        angular.element('#_approval_history').modal({ show: true });
    }


    $scope.ChangeApprovalStatus = function (status, comments) {
        var update_approvals_status = $scope.$root.setup + "general/update-approval-status";
        var id = $scope.approval_history[$scope.approval_history.length - 1].id;
        var object_code = $scope.approval_history[$scope.approval_history.length - 1].object_code;
        var type = $scope.approval_history[$scope.approval_history.length - 1].type;
        var source_name = $scope.approval_history[$scope.approval_history.length - 1].source_name;
        var source_code = $scope.approval_history[$scope.approval_history.length - 1].source_code;
        var requested_by_email = $scope.approval_history[$scope.approval_history.length - 1].requested_by_email;
        var current_value = $scope.approval_history[$scope.approval_history.length - 1].current_value;
        var currency_code = $scope.approval_history[$scope.approval_history.length - 1].currency_code;
        
        if(status == 3 && (comments == undefined || comments.length == 0))
        {
            toaster.pop('error', 'error', $scope.$root.getErrorMessageByCode(664));
            return;
        }
        $scope.disableDisapprovalBtn = true;

        $http
            .post(update_approvals_status, {
                'object_id': $scope.$root.order_id,
                'detail_id':0,
                'source_name': source_name,
                'source_code': source_code,
                'id': id,
                'object_code': object_code,
                'requested_by_email': requested_by_email,
                'current_value':current_value,
                'currency_code':currency_code,
                'type': type,
                'status': status,
                'comments': comments,
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.showLoader = false;
                    if (status == 2)
                        toaster.pop('success', 'Success', $scope.$root.getErrorMessageByCode(623));
                    else
                        toaster.pop('success', 'Success', $scope.$root.getErrorMessageByCode(624));

                    if(status == 3)
                        angular.element('#_approval_history').modal('hide');

                    return;
                }
                else {
                    $scope.showLoader = false;
                    $scope.disableDisapprovalBtn = false;
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(371));
                    // return;
                }
            });
    }


}

creditNoteModalController.$inject = ["$scope", "$http", "print_invoice_vals", "openEmailer", "noModal", "toaster", "$rootScope", "serviceVariables", "fileAuthentication", "generatePdf"]
myApp.controller('creditNoteModalController', creditNoteModalController);
function creditNoteModalController($scope, $http, print_invoice_vals, openEmailer, noModal, toaster, $rootScope, serviceVariables, fileAuthentication, generatePdf) {

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
    //     var targetPdf = angular.element('#credit_note_modal')[0].innerHTML;
    //     var pdfInvoice = $scope.$root.setup + "general/print-pdf-invoice";
    //     if($scope.print_invoice_vals.templateType == "credit"){
    //         var fileName = "CN."+$scope.print_invoice_vals.order_no+ "." + $scope.print_invoice_vals.company_id;
    //     } else {
    //         var fileName = "PCN."+$scope.print_invoice_vals.invoice_no+ "." + $scope.print_invoice_vals.company_id;
    //     }
    //     $http
    //         .post(pdfInvoice, { 'dataPdf': targetPdf, 'type': 4, 'filename': fileName, token: $scope.$root.token, 'doc_id': $scope.print_invoice_vals.doc_id, attachmentsType: 5 })
    //         .then(function (res) {
    //             if (res.data.ack == true) {
    //                 serviceVariables.generatedPDF = res.data.path;
    //                 $rootScope.printinvoiceFlag = true;
    //                 toaster.pop('success', 'Info', 'PDF Generated Successfully');
    //             } else if(res.data.SQLack == false){
    //                 toaster.pop('warning', 'Important', 'PDF Generated Successfully');
    //                 toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(105)); 
    //             }
    //             else {
    //                 toaster.pop('error', 'Error', "PDF Not Generated");
    //             }
    //         });
    // }

}
