myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        $stateProvider
            .state('app.customerPortal', {
                url: '/customer-portal',
                title: 'Customer Portal',
                templateUrl: helper.basepath('customerPortal/customerPortal.html'),
                controller: 'customerPortalController'
            })
            .state('app.getCustomerStatementReport', {
                url: '/statements/:module',
                title: 'Customer Statement',
                templateUrl: helper.basepath('customerPortal/agedReport.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'CustomerStatementReportController'
            })
            .state('app.sale-invoice-portal', {
                url: '/sale-invoice',
                title: 'Sales Invoice',
                templateUrl: helper.basepath('customerPortal/salesorders.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.sale-return-invoice-portal', {
                url: '/sale-return-invoice',
                title: 'Sales Return',
                templateUrl: helper.basepath('customerPortal/salesreturnorders.html'),//../views/
                controller: 'SaleReturnInvoicePortalController',
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.sale-activity-portal', {
                url: '/sale-activity',
                title: 'Sales Activity',
                templateUrl: helper.basepath('customerPortal/get_balance_result.html'),
                controller: 'SaleActivityPortalController',
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.price-list-portal', {
                url: '/price-list',
                title: 'Price List',
                templateUrl: helper.basepath('customerPortal/customerPriceListReport.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'CustomerPriceListPortalController'
            })
        /* .state('app.home', {
            url: '/Home',
            title: 'Home',
            templateUrl: helper.basepath('customerPortal/get_balance_result.html'),
            controller: 'SaleActivityPortalController',
            resolve: helper.resolveFor('ngTable', 'ngDialog')
            controller: 'HomeController'
        }) */
    }]);

myApp.factory('jsreportService', ['$rootScope', '$http',
    function ($rootScope, $http) {
        return {
            downloadXlsx: function (_data, _shortId) {
                return $http({
                    url: $rootScope.jsreports,
                    method: 'POST',
                    params: {},
                    data: {
                        "template": {
                            "shortid": _shortId,
                            "recipe": "html-to-xlsx",
                        },
                        "data": _data
                    },
                    headers: {
                        "Authorization": "Basic " + btoa("admin:admin123"),
                    },
                    responseType: 'arraybuffer'
                })

            },
            downloadXlsxNative: function (_data, _shortId) {
                return $http({
                    url: $rootScope.jsreports,
                    method: 'POST',
                    params: {},
                    data: {
                        "template": {
                            "shortid": _shortId,
                            "recipe": "xlsx",
                        },
                        "data": _data
                    },
                    headers: {
                        "Authorization": "Basic " + btoa("admin:admin123"),
                    },
                    responseType: 'arraybuffer'
                })

            },
            downloadPdf: function (_data, _shortId) {
                return $http({
                    url: $rootScope.jsreports,
                    method: 'POST',
                    params: {},
                    data: {
                        "template": {
                            "shortid": _shortId
                        },
                        "data": _data
                    },
                    headers: {
                        "Authorization": "Basic " + btoa("admin:admin123"),
                    },
                    responseType: 'arraybuffer'
                })

            }
        };
    }]);

/* myApp.controller('HomeController', ["$scope", "$filter", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$stateParams", "$state", "$rootScope", "ModalService", function HomeController($scope, $filter, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams, $state, $rootScope, ModalService) {
    'use strict';

    console.log('HomeController');
    $rootScope.showLoader = true;
    window.location.href = $rootScope.homeURL;
    $rootScope.loginCustPortal = false;

}]); */

myApp.controller('customerPortalController', ["$scope", "$filter", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$stateParams", "$state", "$rootScope", "ModalService", function customerPortalController($scope, $filter, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams, $state, $rootScope, ModalService) {
    'use strict';
    $scope.breadcrumbs = [{ 'name': 'Reports', 'url': '#', 'isActive': false }, { 'name': 'All Reports', 'url': '#', 'isActive': false }];
    $scope.widgetRoles = [];
    $scope.dontShowModal = false;

    console.log('customerPortalController');

    $rootScope.hideHomeDetails = true;
    $rootScope.loginCustPortal = false;

    $rootScope.hideCustPortal = false;

    $rootScope.custName = '';
    $rootScope.custCode = '';
    $rootScope.custID = 0;

    $rootScope.company_name = '';
    $rootScope.defaultLogo = '';
    $rootScope.compURL = '';
    $rootScope.address = '';
    $rootScope.address_2 = '';
    $rootScope.county = '';
    $rootScope.postcode = '';
    $rootScope.telephone = '';
    $rootScope.fax = '';
    $rootScope.city = '';

    $rootScope.showLoader = true;

    $rootScope.getCUSTDetails = function () {

        var apiCUSTDetails = $rootScope.setup + "crm/get-details-cust-portal";
        var postData = {
            'token': $rootScope.token,
            'selCust': $rootScope.selCust
        };
        $http
            .post(apiCUSTDetails, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $rootScope.custName = res.data.custName;
                    $rootScope.custCode = res.data.custCode;
                    $rootScope.custID = res.data.customerID;

                    $rootScope.company_name = res.data.compName;
                    $rootScope.defaultLogo = res.data.logo;
                    $rootScope.compURL = res.data.compURL;
                    $rootScope.address = res.data.address;
                    $rootScope.address_2 = res.data.address_2;
                    $rootScope.county = res.data.county;
                    $rootScope.postcode = res.data.postcode;
                    $rootScope.telephone = res.data.telephone;
                    $rootScope.fax = res.data.fax;
                    $rootScope.city = res.data.city;

                    // $rootScope.company_logo_url = window.location.hostname + "/upload/company_logo_temp/" + $rootScope.defaultLogo;

                    // let currentUrl = window.location.href;
                    // $rootScope.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;

                    // console.log(currentUrl.substring(0, currentUrl.indexOf('#')) );

                    let currentUrl = window.location.origin + window.location.pathname;

                    var pathURL = (currentUrl).split("customerPortal.html");
                    // console.log(pathURL[0]);

                    $rootScope.company_logo_url = pathURL[0] + "upload/company_logo_temp/" + $rootScope.defaultLogo;
                    $rootScope.invoiceLogoUrl = pathURL[0] + "upload/company_logo_temp/invoice.png";
                    $rootScope.statementLogoUrl = pathURL[0] + "upload/company_logo_temp/statement.png";
                    $rootScope.activityLogoUrl = pathURL[0] + "upload/company_logo_temp/activity.png";
                    $rootScope.homeLogoUrl = pathURL[0] + "upload/company_logo_temp/home.png";
                    $rootScope.priceLogoUrl = pathURL[0] + "upload/company_logo_temp/price.png";

                    $rootScope.showLoader = false;
                }
                else
                    $rootScope.showLoader = false;
            });
    }

    $rootScope.getCUSTDetails();

    $scope.goToCompLink = function () {
        // window.location.href = $rootScope.compURL;
        window.open($rootScope.compURL, '_blank');
    }

}]);


myApp.controller('CustomerStatementReportController', ["$scope", "$sce", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$stateParams", "$state", "$rootScope", "ModalService", "fileAuthentication", "jsreportService", function CustomerStatementReportController($scope, $sce, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams, $state, $rootScope, ModalService, fileAuthentication, jsreportService) {
    'use strict';

    //"generatePdf", , generatePdf

    $rootScope.hideCustPortal = true;
    $rootScope.hideHomeDetails = true;
    $rootScope.loginCustPortal = false;

    let currentUrl = window.location.href;
    $scope.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;
    $scope.dontShowModal = false;


    // $scope.module = $stateParams.module;
    $scope.searchKeyword = {};
    $scope.fileAuthentication = fileAuthentication;

    $scope.goToCompLink = function () {
        // window.location.href = $rootScope.compURL;
        window.open($rootScope.compURL, '_blank');
    }

    var fields = $stateParams.module.split('-');
    $scope.module = fields[0];
    $scope.selCust = fields[1];


    //setting the title and breadcrumbs

    if ($scope.module == 'customerStatement') {
        $scope.reportModalTitle = 'customerStatementReport';
        $scope.reportTitle = 'Customer Statement';
        $scope.breadcrumbs = [{ 'name': 'Reports', 'url': '#', 'isActive': false }, { 'name': 'All Reports', 'url': 'app.allReports', 'isActive': false }, { 'name': 'Customer Statement', 'url': '#', 'isActive': false }];

		/* if ($rootScope.reports_permission == undefined || !($rootScope.reports_permission.customer_statement)) {
			toaster.pop('error', 'Error', "You are not authorized for this report");
			$state.go('app.allReports');
		} */

    }
    //end setting the title and breadcrumbs

    $rootScope.CustomerPortalTitle = 'Customer Statement';

    $scope.filterReport = {};
    $scope.filterReport.upToDate = $scope.$root.get_current_date();

    $rootScope.notSendEmail = true;

    $scope.agedReportListing = {};
    $scope.agedReportListing.token = $rootScope.token;
    $scope.agedReportListing.upToDate = $scope.filterReport.upToDate;
    $scope.agedReportListing.module = $stateParams.module;

    $scope.searchKeyword = {};
    $scope.selectedRecFromModals = [];


    $scope.columns_general = [];
    $scope.general = {};
    $scope.arr_uom = [];
    $scope.stockTitle = '';


    $scope.customers = [];
    $scope.searchKeywordCUST = {};
    $scope.selectedRecFromModalsCUST = [];
    // $scope.selCust = ;

    // Customer Module

    if ($rootScope.selCust) {

        $scope.filterCustomer = {};
        $scope.tempCustomerArr = [];
        $scope.customerListing = {};
        $scope.customerListing.token = $rootScope.token;
        // $scope.customerListing.selCust = $scope.selCust;
        $scope.customerListing.selCust = $rootScope.selCust;

        // console.log($rootScope.selCust);return false;

        $rootScope.showLoader = true;

        var customerListingApi = $scope.$root.reports + "module/sel-customer-for-statement-report";
        $http
            .post(customerListingApi, $scope.customerListing)
            .then(function (res) {
                $rootScope.showLoader = false;
                $scope.tempCustomerArr = [];
                $scope.PendingSelectedCustomers = [];

                $scope.CustomerArr = [];
                $scope.customers = [];

                if (res.data.ack == true) {

                    $scope.CustomerArr = res.data.response;//customerID

                    angular.forEach($scope.CustomerArr, function (recData) {

                        if (recData.id == res.data.customerID) {

                            var selRecord = {};
                            selRecord.key = recData.id;
                            selRecord.record = recData;
                            selRecord.value = recData.customer_code;

                            $scope.selectedRecFromModalsCUST.push(selRecord);

                            recData.moduleNo = recData.customer_code;
                            recData.title = recData.name;
                            recData.custID = recData.id;
                            recData.company_id = recData.company_id;
                            $scope.customers.push(recData);

                            $rootScope.generateCustomerStatementReport();

                        }
                    });
                }
            });

    }

    $rootScope.decimal_range = 2;

    $rootScope.toTitleCase = function (input) {

        input = input || '';

        input = input.replace(/_/, " ");

        // console.log(input);

        return input.replace(/\w\S*/g, function (txt) {
            // console.log(txt.substr(1).toLowerCase());
            // console.log(txt.charAt(0));
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }


    $rootScope.generateCustomerStatementReport = function (_reportType = 'pdf') {
        $scope.printPdfVals = {};

        $rootScope.printinvoiceFlag = false;
        $rootScope.showLoader = true;

        // if ($scope.module == 'customerStatement') {
        var postData = {};
        postData.token = $rootScope.token;

        if ($scope.customers.length != 1) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['customer']));
            $rootScope.showLoader = false;
            return false;
        }

        $rootScope.company_name = '';
        $rootScope.defaultLogo = '';
        $rootScope.compURL = '';
        $rootScope.address = '';
        $rootScope.address_2 = '';
        $rootScope.county = '';
        $rootScope.postcode = '';
        $rootScope.telephone = '';
        $rootScope.fax = '';
        $rootScope.city = '';

        var statementApi = $scope.$root.reports + "module/customer-statement-report";
        postData.customers = $scope.customers;
        postData.companyID = $scope.customers[0].company_id;

        if ($scope.filterReport.upToDate != '' && $scope.filterReport.upToDate != undefined)
            postData.upToDate = $scope.filterReport.upToDate;
        else {
            postData.upToDate = $scope.$root.get_current_date();
            $scope.filterReport.upToDate = $scope.$root.get_current_date();
        }

        $http
            .post(statementApi, postData)
            .then(function (res) {
                $rootScope.showLoader = false;
                $scope.reportsDataArr = [];
                $scope.columns = [];

                if (res.data.ack == true) {

                    $scope.printPdfVals.columns = [];
                    $scope.printPdfVals.summaryColumns = [];
                    $scope.printPdfVals.reportsDataArr2 = [];
                    $scope.printPdfVals.reportsSummaryDataArr = [];
                    $scope.printPdfVals.reportName = $scope.reportModalTitle;
                    $scope.printPdfVals._reportType = _reportType;

                    $scope.printPdfVals.reportsDataArr = res.data.response;

                    if (res.data.response[0].res != undefined) {

                        angular.forEach(res.data.response[0].res[0], function (val, index) {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });

                            $scope.printPdfVals.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });
                    }

                    angular.forEach(res.data.response[0].summary, function (val, index) {

                        $scope.printPdfVals.summaryColumns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    angular.forEach(res.data.response, function (rec, index) {
                        angular.forEach(rec.res, function (inv_val) {
                            $scope.reportsDataArr.push(inv_val);
                        });
                    });

                    $scope.printPdfVals.currentDate = $scope.$root.get_current_date();
                    $scope.printPdfVals.company_reg_no = $scope.filterReport.company_reg_no;
                    $scope.printPdfVals.upToDate = $scope.filterReport.upToDate;
                    $rootScope.company_name = res.data.company_name;//$rootScope.company_name;
                    $rootScope.defaultLogo = res.data.company_logo;//$rootScope.company_name;
                    $scope.printPdfVals._reportType = _reportType;

                    if (_reportType == 'xlsx') {
                        $rootScope.showLoader = true;
                        jsreportService.downloadXlsx($scope.printPdfVals, "r1xR33185V").success(function (data) {
                            let file = new Blob([data], { type: 'application/xlsx' });
                            saveAs(file, $scope.printPdfVals.reportName + ".xlsx");
                            $rootScope.showLoader = false;
                        })
                    } else {
                        var invoicePdfModal = ModalService.showModal({
                            templateUrl: 'app/views/customerPortal/customerStatementPDF.html',
                            controller: 'pdfPrintCustPortalModalController',
                            inputs: {
                                printPdfVals: $scope.printPdfVals
                            }
                        });

                        invoicePdfModal.then(function (res) {
                            res.element.modal();
                        });
                    }
                }
                else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
            });
        // }
    }
}]);

myApp.service('GenericModalListing', function () {
    this.supplier = {
        postData: {
            token: $scope.$root.token
        },
        getListing: function (item_paging, sort_column, sortform) {
            $scope.postData.token = $scope.$root.token;
            $scope.moduleType = 'SuppDetail';

            if (item_paging == 1)
                $scope.item_paging.spage = 1

            $scope.postData.page = $scope.item_paging.spage;

            $scope.postData.searchKeyword = $scope.searchKeywordSupp;

            if ($scope.postData.pagination_limits == -1) {
                $scope.postData.page = -1;
                $scope.searchKeywordSupp = {};
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

            var supplierListingApi = $scope.$root.reports + "module/supplier-data-for-report";

            $rootScope.showLoader = true;
            $http
                .post(supplierListingApi, $scope.postData)
                .then(function (res) {
                    $scope.tableData = res;
                    $scope.columns = [];
                    $scope.record_data = {};
                    $scope.recordArray = [];
                    $scope.tempSuppliersArr2 = [];

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
                        $scope.tempSuppliersArr2 = res.data;

                        angular.forEach(res.data.response, function (value, key) {
                            if (key != "tbl_meta_data") {
                                $scope.recordArray.push(value);
                            }
                        });

                        angular.element('#_supplierModal').modal({ show: true });

                    }
                    else {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                    }
                    $rootScope.showLoader = false;
                });
        }
    }
});


myApp.controller('pdfPrintCustPortalModalController', ["$scope", "$filter", "$timeout", "$http", "toaster", "$stateParams", "$state", "$rootScope", "ngDialog", "printPdfVals", "fileAuthentication", function pdfPrintCustPortalModalController($scope, $filter, $timeout, $http, toaster, $stateParams, $state, $rootScope, ngDialog, printPdfVals, fileAuthentication) {
    'use strict';


    $scope.isNumber = function (number) {
        return angular.isNumber(number) && !isNaN(number);
    }
    $scope.dontShowModal = false;
    $rootScope.loginCustPortal = false;
    // let currentUrl = window.location.href;
    // $scope.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;

    let currentUrl = window.location.origin + window.location.pathname;
    var pathURL = (currentUrl).split("customerPortal.html");

    $scope.company_logo_url = pathURL[0] + "upload/company_logo_temp/" + $rootScope.defaultLogo;

    printPdfVals.company_name = $rootScope.company_name;
    printPdfVals.company_logo_url = $scope.company_logo_url;
    printPdfVals.known_as = $rootScope.known_as;
    printPdfVals.defaultCurrencyCode = $rootScope.defaultCurrencyCode;
    // console.log("pdf printing: ", printPdfVals);
    $scope.phantomSettings = {
        orientation: "portrait"
    }

    $scope.updatePageOrientation = function (_orientation) {

        _orientation ? $scope.pageOrientation = "landscape" : $scope.pageOrientation = "portrait";
        $scope.phantomSettings = {
            orientation: $scope.pageOrientation
        }
    }

    $scope.jsreportLoading = false;
    $scope.renderReportAging = function (_reportData, _shortId) {
        _reportData.renderingType = "pdf";
        _reportData.company_name = $rootScope.company_name;
        _reportData.company_logo_url = $scope.company_logo_url;
        $http({
            url: $rootScope.jsreports,
            method: 'POST',
            params: {},
            data: {
                "template": {
                    "shortid": _shortId,
                    "recipe": "html",
                },

                "data": _reportData

            },
            headers: {
                "Authorization": "Basic " + btoa("admin:admin123"),
            },
        })
            .success(function (data) {
                $rootScope.showLoader = false;
                $scope.customerAgingReportHtml = data;

            });
    }

    $scope.downloadCustPortalReport = function (_reportData) {
        $scope.jsreportLoading = true;
        _reportData.company_name = $rootScope.company_name;
        _reportData.company_logo_url = $scope.company_logo_url;

        if (_reportData.reportName != 'supplierStatementReport') {

            console.log("Customer Statement: ", _reportData);

            // // jsreport direct solution
            $http({
                url: $rootScope.jsreports,
                method: 'POST',
                params: {},
                data: {
                    "template": {
                        "phantom": $scope.phantomSettings,
                        "shortid": "r1gSoJRhD4"
                    },
                    "data": _reportData
                },
                headers: {
                    'Content-type': 'application/json', "Authorization": "Basic " + btoa("admin:admin123")
                },
                responseType: 'arraybuffer'
            }).success(function (data) {
                $scope.jsreportLoading = false;
                // console.log("success jsreport...", typeof (data));

                var file = new Blob([data], { type: 'application/pdf' });
                saveAs(file, _reportData.reportName + '.pdf');

            });
        }

    }

    $scope.generateReportPriceListPDF = function (_reportData) {

        $scope.jsreportLoading = true;
        _reportData.company_name = $rootScope.company_name;
        _reportData.company_logo_url = $scope.company_logo_url;

        if (_reportData.reportName != 'supplierStatementReport') {

            // // jsreport direct solution
            $http({
                url: $rootScope.jsreports,
                method: 'POST',
                params: {},
                data: {
                    "template": {
                        "phantom": $scope.phantomSettings,
                        "shortid": "rJl5i2Nrrr"
                    },
                    "data": _reportData
                },
                headers: {
                    'Content-type': 'application/json', "Authorization": "Basic " + btoa("admin:admin123")
                },
                responseType: 'arraybuffer'
            }).success(function (data) {
                $scope.jsreportLoading = false;
                // console.log("success jsreport...", typeof (data));

                var file = new Blob([data], { type: 'application/pdf' });
                saveAs(file, _reportData.reportName + '.pdf');

            });

            // jsreportService.downloadPdf($scope.printPdfVals, "rJl5i2Nrrr").success(function (data) {
            //                 let file = new Blob([data], { type: 'application/pdf' });
            //                 saveAs(file, $scope.printPdfVals.reportName + ".pdf");
            //                 $scope.showLoader = false;
            //             })
        }


        /* var priceListApi = $scope.$root.reports + "module/customer-price-list-report-portal";
        $http
            .post(priceListApi, $scope.filterReport)
            .then(function (res) {
                $scope.showLoader = false;

                if (res.data.ack == 1 && res.data.response) {
                    $scope.reportsDataArr = res.data.response;

                    $scope.remittenceDataArr = [];
                    $scope.remittenceSelSuppArr = [];
                    $scope.reportsDataArrLength = 0;

                    $scope.printPdfVals = {};
                    $scope.printPdfVals.columns = [];
                    $scope.printPdfVals.reportName = 'CustomerPriceListReport';
                    let customersPriceListData = groupBy($scope.reportsDataArr, customers => customers.Customer_Code );

                    // $scope.printPdfVals.dateTo = $scope.filterReport.dateTo;
                    // $scope.printPdfVals.dateFrom = $scope.filterReport.dateFrom;                    
                    
                    $scope.printPdfVals.dateFrom = res.data.dateFrom;
                    $scope.printPdfVals.dateTo = res.data.dateTo;

					$scope.printPdfVals.suppliers = $scope.filterReport.suppliers;
					$scope.printPdfVals.known_as = $rootScope.known_as;
                
                    $scope.printPdfVals.reportsDataArr = [];
                    $scope.printPdfVals.company_name = $rootScope.company_name;
                    $scope.printPdfVals._reportType = _reportType;

                    let currentUrl = window.location.href;
                    $scope.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;
					$scope.printPdfVals.company_logo_url = $scope.company_logo_url;					

					console.log(customersPriceListData);
            
                     if (_reportType == 'xlsx') {
                        $scope.showLoader = true;
                        customersPriceListData.forEach(function(value, key, map){
                            $scope.printPdfVals.reportsDataArr.push(value);
                        })
                        jsreportService.downloadXlsx($scope.printPdfVals, "B1xIaayxLH").success(function (data) {
                            let file = new Blob([data], { type: 'application/xlsx' });
                            saveAs(file, $scope.printPdfVals.reportName + ".xlsx");
                            $scope.showLoader = false;
                        })

                    } else if(_reportType == 'pdf') {
                        $scope.showLoader = true;

                        customersPriceListData.forEach(function(value, key, map){
                            $scope.printPdfVals.reportsDataArr.push(value);
                        })

                        jsreportService.downloadPdf($scope.printPdfVals, "rJl5i2Nrrr").success(function (data) {
                            let file = new Blob([data], { type: 'application/pdf' });
                            saveAs(file, $scope.printPdfVals.reportName + ".pdf");
                            $scope.showLoader = false;
                        })

                    }  else {

                        customersPriceListData.forEach(function(value, key, map){
                            $scope.printPdfVals.reportsDataArr.push(value);
                        });

                        var invoicePdfModal = ModalService.showModal({
                            templateUrl: 'app/views/customerPortal/customerPriceListModal.html',
                            controller: 'pdfPrintCustPortalModalController',
                            inputs: {
                                printPdfVals: $scope.printPdfVals
                            }
                        });

                        invoicePdfModal.then(function (res) {
                            res.element.modal();
                        });
                    } 
                }
                else{
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
					$scope.printPdfVals = {};
					$scope.printPdfVals.columns = [];
					$scope.reportsDataArr =  [];
				}
            }); */
    }

    $scope.generatePdf = function (reportName) {

        var targetPdf = angular.element('#' + reportName)[0].innerHTML;
        var pdfReport = $scope.$root.setup + "general/print-pdf-invoice";
        $rootScope.printinvoiceFlag = false;
        $rootScope.showLoader = true;
        $scope.generatingPDF = true;

        $http
            .post(pdfReport, { 'dataPdf': targetPdf, 'attachmentsType': 6, 'filename': reportName, token: $scope.$root.token })
            .then(function (res) {
                if (res.data.ack == true) {
                    // console.log('Success');
                    $rootScope.showLoader = false;
                    $rootScope.printinvoiceFlag = true;
                    toaster.pop('success', 'Info', 'PDF Generated Successfully');

                    fileAuthentication.getFile({
                        fileName: reportName + '.pdf',
                        downloadName: reportName + '.pdf',
                        report: 1
                    });
                }
                else {
                    console.log('Fail');
                }
                $scope.generatingPDF = false;
            });
    }

    $scope.destroyPdfModalCustPortal = function (modalName) {
        //angular.element(document.querySelector("#" + modalName)).remove();
        $rootScope.showLoader = true;

        // var redirectUrl = window.location.origin + window.location.pathname;
        // console.log(window.location.origin + window.location.pathname);
        console.log($rootScope.homeURL);

        // window.location.href = $rootScope.homeURL;//redirectUrl;
        // $state.go("app.home");
        $state.go("app.customerPortal");

        // console.log(window.location);

    }

    $scope.printPdfVals = printPdfVals;

    return { message: 'Hello' };
}]);

SaleInvoicePortalController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$rootScope", "moduleTracker"];
myApp.controller('SaleInvoicePortalController', SaleInvoicePortalController);
function SaleInvoicePortalController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $rootScope, moduleTracker) {
    'use strict';

    // $scope.breadcrumbs =
    //     [{ 'name': 'Sales', 'url': '#', 'isActive': false },
    //         { 'name': 'Customers', 'url': 'app.customer', 'isActive': false },
    //         { 'name': 'Sales Invoices', 'url': '#', 'isActive': false }];

    $scope.goToCompLink = function () {
        // window.location.href = $rootScope.compURL;
        window.open($rootScope.compURL, '_blank');
    }

    $rootScope.hideCustPortal = true;
    $rootScope.hideHomeDetails = true;
    $rootScope.loginCustPortal = false;
    $rootScope.CustomerPortalTitle = 'Sales Invoices';//Posted 

    var vm = this;
    var Api = $scope.$root.sales + "customer/order/sel-cust-listings";

    $scope.searchKeyword = {};
    $scope.selectedRecBulkEmail = [];


    $scope.getSalesInvoiceListing = function (item_paging, sort_column, sortform) {

        $scope.postData = {};
        $scope.postData = {
            'token': $scope.$root.token,
            'all': "1",
            'type': 2
        };

        if (!$rootScope.selCust) return false;

        $scope.postData.selCust = $rootScope.selCust;


        if (item_paging == 1)
            $scope.item_paging.spage = 1

        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
            $scope.record_data = {};
        }

        $rootScope.company_name = '';
        $rootScope.defaultLogo = '';
        $rootScope.compURL = '';
        $rootScope.address = '';
        $rootScope.address_2 = '';
        $rootScope.county = '';
        $rootScope.postcode = '';
        $rootScope.telephone = '';
        $rootScope.fax = '';
        $rootScope.city = '';

        $scope.postData.searchKeyword = $scope.searchKeyword;
        $rootScope.showLoader = true;
        $http
            .post(Api, $scope.postData)
            .then(function (res) {
                $scope.tableData = res;
                $rootScope.showLoader = false;
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
                else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }

                $rootScope.company_name = res.data.compName;
                $rootScope.defaultLogo = res.data.logo;
                $rootScope.compURL = res.data.compURL;
                $rootScope.address = res.data.address;
                $rootScope.address_2 = res.data.address_2;
                $rootScope.county = res.data.county;
                $rootScope.postcode = res.data.postcode;
                $rootScope.telephone = res.data.telephone;
                $rootScope.fax = res.data.fax;
                $rootScope.city = res.data.city;

                let currentUrl = window.location.origin + window.location.pathname;

                var pathURL = (currentUrl).split("customerPortal.html");
                // console.log(pathURL[0]);

                $rootScope.company_logo_url = pathURL[0] + "upload/company_logo_temp/" + $rootScope.defaultLogo;
                $rootScope.invoiceLogoUrl = pathURL[0] + "upload/company_logo_temp/invoice.png";
                $rootScope.statementLogoUrl = pathURL[0] + "upload/company_logo_temp/statement.png";
                $rootScope.activityLogoUrl = pathURL[0] + "upload/company_logo_temp/activity.png";
                $rootScope.homeLogoUrl = pathURL[0] + "upload/company_logo_temp/home.png";
                $rootScope.priceLogoUrl = pathURL[0] + "upload/company_logo_temp/price.png";

            }).catch(function (message) {
                $rootScope.showLoader = false;
                // toaster.pop('error', 'info', 'Server is not Acknowledging');
                throw new Error(message.data);
                console.log(message.data);
            });
    }

    $scope.bulkEmailOption = function () {
        // console.log($scope.selectedRecBulkEmail);

        $scope.emailOrderList = $scope.recordArray.filter(function (o, i) {
            return ($scope.selectedRecBulkEmail.findIndex(s => s.key == o.id) > -1);
        });

        // console.log($scope.emailOrderList);

        $scope.bulkOptionChk = {};

        if ($scope.emailOrderList.length > 15) {
            $rootScope.animateBulkEmail = false;
            $rootScope.animateBulkEmailText = '';
            toaster.pop('error', 'Error', 'Only less than 15 Invoices Pdf can be generated at a time');

        } else if ($scope.emailOrderList.length > 0) {

            angular.element('#_bulkOptionsModal').modal({ show: true });

        } else {
            $rootScope.animateBulkEmail = false;
            $rootScope.animateBulkEmailText = '';
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(236, ['Sales Invoice']));
        }
    }

    $rootScope.BulkEmailMessage = "";

    $scope.bulkOptionConfirm = function (bulkOptionChk) {

        angular.element('#_bulkOptionsModal').modal('hide');

        // let currentUrl = window.location.href;
        // $scope.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;

        let currentUrl = window.location.origin + window.location.pathname;
        var pathURL = (currentUrl).split("customerPortal.html");
        // console.log(pathURL[0]);

        $scope.company_logo_url = pathURL[0] + "upload/company_logo_temp/" + $rootScope.defaultLogo;


        if (bulkOptionChk == 'saveAsPdf') {

            $rootScope.animateBulkEmail = true;
            $rootScope.showLoader = true;
            $rootScope.animateBulkEmailText = 'Downloading PDF(s)';

            console.log("downloading pdfs...")
            // console.log($scope.emailOrderList.length);
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
                .then(function (res) {

                    $rootScope.animateBulkEmail = false;
                    $rootScope.animateBulkEmailText = '';


                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', 'PDF(s) Generated Successfully.');

                        var link = document.createElement('a');

                        link.setAttribute('download', null);
                        link.style.display = 'none';

                        link.setAttribute('href', res.data.file_url);
                        link.click();
                    }
                    else {
                        toaster.pop('error', 'Info', "PDF(s) Generation Failed.");
                    }

                    $rootScope.showLoader = false;
                }, function (err) {
                    console.log(err);
                });

        }
    }
}


SaleReturnInvoicePortalController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$rootScope", "moduleTracker"];
myApp.controller('SaleReturnInvoicePortalController', SaleReturnInvoicePortalController);
function SaleReturnInvoicePortalController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $rootScope, moduleTracker) {
    'use strict';

    // $scope.breadcrumbs =
    //     [{ 'name': 'Sales', 'url': '#', 'isActive': false },
    //         { 'name': 'Customers', 'url': 'app.customer', 'isActive': false },
    //         { 'name': 'Posted Credit Notes', 'url': '#', 'isActive': false }];

    $scope.goToCompLink = function () {
        // window.location.href = $rootScope.compURL;
        window.open($rootScope.compURL, '_blank');
    }

    var vm = this;
    var Api = $scope.$root.sales + "customer/return-order/sel-cust-listings";
    var postData = {
        'token': $scope.$root.token,
        'all': "1",
        'type': 2
    };

    $scope.searchKeyword = {};
    $scope.selectedRecBulkEmail = [];
    $scope.recordArray = [];

    $rootScope.hideCustPortal = true;
    $rootScope.hideHomeDetails = true;
    $rootScope.loginCustPortal = false;
    $rootScope.CustomerPortalTitle = 'Credit Notes';//Posted

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

        if (!$rootScope.selCust) return false;

        $scope.postData.selCust = $rootScope.selCust;

        $rootScope.company_name = '';
        $rootScope.defaultLogo = '';
        $rootScope.compURL = '';
        $rootScope.address = '';
        $rootScope.address_2 = '';
        $rootScope.county = '';
        $rootScope.postcode = '';
        $rootScope.telephone = '';
        $rootScope.fax = '';
        $rootScope.city = '';

        $rootScope.showLoader = true;
        $http
            .post(Api, $scope.postData)
            .then(function (res) {
                $scope.tableData = res;
                $rootScope.showLoader = false;
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
                else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }

                $rootScope.company_name = res.data.compName;
                $rootScope.defaultLogo = res.data.logo;
                $rootScope.compURL = res.data.compURL;
                $rootScope.address = res.data.address;
                $rootScope.address_2 = res.data.address_2;
                $rootScope.county = res.data.county;
                $rootScope.postcode = res.data.postcode;
                $rootScope.telephone = res.data.telephone;
                $rootScope.fax = res.data.fax;
                $rootScope.city = res.data.city;

                let currentUrl = window.location.origin + window.location.pathname;

                var pathURL = (currentUrl).split("customerPortal.html");
                // console.log(pathURL[0]);

                $rootScope.company_logo_url = pathURL[0] + "upload/company_logo_temp/" + $rootScope.defaultLogo;
                $rootScope.invoiceLogoUrl = pathURL[0] + "upload/company_logo_temp/invoice.png";
                $rootScope.statementLogoUrl = pathURL[0] + "upload/company_logo_temp/statement.png";
                $rootScope.activityLogoUrl = pathURL[0] + "upload/company_logo_temp/activity.png";
                $rootScope.homeLogoUrl = pathURL[0] + "upload/company_logo_temp/home.png";
                $rootScope.priceLogoUrl = pathURL[0] + "upload/company_logo_temp/price.png";

                //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            }).catch(function (message) {
                $rootScope.showLoader = false;
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
        $scope.rec.type = 2;
        $scope.postData = $scope.rec;

        $scope.$root.$broadcast("myReload");
    }


    $scope.bulkEmailOption = function () {
        // console.log($scope.selectedRecBulkEmail);

        $scope.emailOrderList = $scope.recordArray.filter(function (o, i) {
            return ($scope.selectedRecBulkEmail.findIndex(s => s.key == o.id) > -1);
        });

        // console.log($scope.emailOrderList);

        if ($scope.emailOrderList.length > 15) {
            $rootScope.animateBulkEmail = false;
            $rootScope.animateBulkEmailText = '';
            toaster.pop('error', 'Error', 'Only less than 15 Invoices Pdf can be generated at a time');

        } else if ($scope.emailOrderList.length > 0) {

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

        // let currentUrl = window.location.href;
        // $scope.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;

        let currentUrl = window.location.origin + window.location.pathname;
        var pathURL = (currentUrl).split("customerPortal.html");
        // console.log(pathURL[0]);

        $scope.company_logo_url = pathURL[0] + "upload/company_logo_temp/" + $rootScope.defaultLogo;

        // if (bulkOptionChk.saveAsPdf == true) {
        if (bulkOptionChk == 'saveAsPdf') {

            $rootScope.animateBulkEmail = true;
            $rootScope.animateBulkEmailText = 'Downloading PDF(s)';
            $rootScope.showLoader = true;

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

                    $rootScope.showLoader = false;
                });

        }
    }
}

SaleActivityPortalController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$rootScope", "moduleTracker"];
myApp.controller('SaleActivityPortalController', SaleActivityPortalController);
function SaleActivityPortalController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $rootScope, moduleTracker) {
    'use strict';

    // $scope.breadcrumbs =
    //     [{ 'name': 'Sales', 'url': '#', 'isActive': false },
    //         { 'name': 'Customers', 'url': 'app.customer', 'isActive': false },
    //         { 'name': 'Posted Credit Notes', 'url': '#', 'isActive': false }];

    $scope.goToCompLink = function () {
        // window.location.href = $rootScope.compURL;

        // console.log($rootScope.compURL);
        window.open($rootScope.compURL, '_blank');
    }

    var vm = this;

    $rootScope.CustomerPortalTitle = 'Customer Activity';

    $scope.searchKeyword = {};
    $scope.selectedRecBulkEmail = [];
    $scope.recordArray = [];

    $rootScope.hideCustPortal = true;
    $rootScope.hideHomeDetails = true;
    $rootScope.loginCustPortal = false;

    $scope.filterReport = {};
    $scope.filterReport.dateTo = $scope.$root.get_current_date();

    $scope.get_balance_info = function (item_paging, sort_column, sortform) {

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        if (item_paging == 1)
            $scope.item_paging.spage = 1;
        $scope.postData.page = $rootScope.item_paging.spage;

        $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;
        // $scope.postData.cust_id = id;
        $scope.postData.module_type = $scope.module_type_account;
        $scope.postData.external_module = 1;

        if (!$rootScope.selCust) return false;

        $scope.postData.selCust = $rootScope.selCust;


        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
        }

        // $scope.cust_id = id;

        if (!$scope.searchKeyword.totalRecords)
            $scope.searchKeyword.totalRecords = 50;

        $scope.searchKeyword.posting_date = { lowerLimit: $scope.filterReport.dateFrom, upperLimit: $scope.filterReport.dateTo }
        $scope.postData.searchKeyword = $scope.searchKeyword;

        // $scope.postData.dateFrom = $scope.filterReport.dateFrom;
        // $scope.postData.dateTo = $scope.filterReport.dateTo;

        $rootScope.company_name = '';
        $rootScope.defaultLogo = '';
        $rootScope.compURL = '';
        $rootScope.address = '';
        $rootScope.address_2 = '';
        $rootScope.county = '';
        $rootScope.postcode = '';
        $rootScope.telephone = '';
        $rootScope.fax = '';
        $rootScope.city = '';

        var getUrl = $scope.$root.gl + "chart-accounts/get-customer-activity-portal";
        $rootScope.showLoader = true;

        $http
            .post(getUrl, $scope.postData)
            .then(function (res) {
                $scope.receipt_sub_list = [];
                if (res.data.ack == true) {
                    $scope.tableData = res;
                    angular.forEach(res.data.response, function (obj, index) {
                        obj.on_hold = obj.on_hold == 1 ? true : false
                    })
                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;
                    // $scope.customer_balance = (res.data.customer_balance != undefined) ? res.data.customer_balance : 0;
                    // $scope.custAvgPaymentDays = (res.data.custAvgPaymentDays != undefined) ? res.data.custAvgPaymentDays : 0;

                    // if (res.data.response.length > 0)
                    $scope.receipt_sub_list = res.data.response;
                    angular.forEach($scope.tableData.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    })

                }
                else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }

                $rootScope.company_name = res.data.compName;
                $rootScope.defaultLogo = res.data.logo;
                $rootScope.compURL = res.data.compURL;
                $rootScope.address = res.data.address;
                $rootScope.address_2 = res.data.address_2;
                $rootScope.county = res.data.county;
                $rootScope.postcode = res.data.postcode;
                $rootScope.telephone = res.data.telephone;
                $rootScope.fax = res.data.fax;
                $rootScope.city = res.data.city;
                $rootScope.showLoader = false;

                let currentUrl = window.location.origin + window.location.pathname;

                var pathURL = (currentUrl).split("customerPortal.html");
                // console.log(pathURL[0]);

                $rootScope.company_logo_url = pathURL[0] + "upload/company_logo_temp/" + $rootScope.defaultLogo;
                $rootScope.invoiceLogoUrl = pathURL[0] + "upload/company_logo_temp/invoice.png";
                $rootScope.statementLogoUrl = pathURL[0] + "upload/company_logo_temp/statement.png";
                $rootScope.activityLogoUrl = pathURL[0] + "upload/company_logo_temp/activity.png";
                $rootScope.homeLogoUrl = pathURL[0] + "upload/company_logo_temp/home.png";
                $rootScope.priceLogoUrl = pathURL[0] + "upload/company_logo_temp/price.png";
            });
    }

    $scope.clearReport = function () {

        $scope.filterReport = {};
        $scope.searchKeyword = {};
        $scope.filterReport.dateTo = $scope.$root.get_current_date();
        $scope.get_balance_info();
    }

    $scope.exportAsCSV = function () {

        $scope.searchKeyword.exportAsCSV = "CustomerActivityPortal";
        $scope.get_balance_info();
    }
}


/* Customer Price List report controller start */

myApp.controller('CustomerPriceListPortalController', ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$stateParams", "$state", "$rootScope", "ModalService", "jsreportService", function CustomerPriceListPortalController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams, $state, $rootScope, ModalService, jsreportService) {
    'use strict';

    $scope.module = $stateParams.module;
    $scope.searchKeyword = {};
    $scope.dontShowModal = false;
    $scope.reportTitle = 'Customer Price List';
    $scope.reportType = 'Customer-Price-List';
    $scope.breadcrumbs = [{ 'name': 'Reports', 'url': '#', 'isActive': false }, { 'name': 'All Reports', 'url': 'app.allReports', 'isActive': false }, { 'name': 'Customer Price List', 'url': '#', 'isActive': false }];


    $rootScope.CustomerPortalTitle = 'Price List';

    $scope.pdfGenerate = false;
    $scope.filterReport = {};
    $scope.customers = [];
    $scope.columns = [];
    $scope.filterReport.dateTo = $scope.$root.get_current_date();

    $rootScope.hideCustPortal = true;
    $rootScope.hideHomeDetails = true;
    $rootScope.loginCustPortal = false;

    $scope.customers = [];
    $scope.searchKeywordCUST = {};
    $scope.selectedRecFromModalsCUST = [];
    // $scope.selCust = ;
    // Customer Module

    if ($rootScope.selCust) {

        $scope.filterCustomer = {};
        $scope.tempCustomerArr = [];
        $scope.customerListing = {};
        $scope.customerListing.token = $rootScope.token;
        // $scope.customerListing.selCust = $scope.selCust;
        $scope.customerListing.selCust = $rootScope.selCust;
        // console.log($rootScope.selCust);return false;
        $rootScope.showLoader = true;

        var customerListingApi = $scope.$root.reports + "module/sel-customer-for-statement-report";
        $http
            .post(customerListingApi, $scope.customerListing)
            .then(function (res) {

                $scope.tempCustomerArr = [];
                $scope.PendingSelectedCustomers = [];
                $scope.CustomerArr = [];
                $scope.customers = [];

                if (res.data.ack == true) {
                    $scope.CustomerArr = res.data.response;//customerID

                    angular.forEach($scope.CustomerArr, function (recData) {

                        if (recData.id == res.data.customerID) {

                            var selRecord = {};
                            selRecord.key = recData.id;
                            selRecord.record = recData;
                            selRecord.value = recData.customer_code;
                            $scope.selectedRecFromModalsCUST.push(selRecord);
                            recData.moduleNo = recData.customer_code;
                            recData.title = recData.name;
                            recData.custID = recData.id;
                            recData.company_id = recData.company_id;
                            $scope.customers.push(recData);

                            $rootScope.CustomerPortalTitle = recData.name + '(' + recData.customer_code + ') - Price List';
                            $scope.generateReport();
                        }
                    });
                }
                else {
                    $rootScope.showLoader = false;
                }
            });
    }

    $rootScope.decimal_range = 2;

    $rootScope.toTitleCase = function (input) {
        input = input || '';
        input = input.replace(/_/, " ");
        // console.log(input);
        return input.replace(/\w\S*/g, function (txt) {
            // console.log(txt.substr(1).toLowerCase());
            // console.log(txt.charAt(0));
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    $scope.generateReport = function (_reportType = 'txt') {

        if (!$rootScope.selCust) return false;

        $scope.filterReport.token = $rootScope.token;
        $scope.filterReport.module = $scope.module;
        $scope.filterReport.customers = $scope.customers;
        $scope.filterReport.selCust = $rootScope.selCust;
        $scope.showLoader = true;

        $rootScope.company_name = '';
        $rootScope.defaultLogo = '';
        $rootScope.compURL = '';
        $rootScope.address = '';
        $rootScope.address_2 = '';
        $rootScope.county = '';
        $rootScope.postcode = '';
        $rootScope.telephone = '';
        $rootScope.fax = '';
        $rootScope.city = '';

        var priceListApi = $scope.$root.reports + "module/customer-price-list-report-portal";
        $http
            .post(priceListApi, $scope.filterReport)
            .then(function (res) {

                if (res.data.ack == 1 && res.data.response) {

                    $scope.reportsDataArr = res.data.response;
                    $scope.remittenceDataArr = [];
                    $scope.remittenceSelSuppArr = [];
                    $scope.reportsDataArrLength = 0;

                    $scope.printPdfVals = {};
                    $scope.printPdfVals.columns = [];
                    $scope.printPdfVals.reportName = 'CustomerPriceListReport';
                    let customersPriceListData = groupBy($scope.reportsDataArr, customers => customers.Customer_Code);

                    $scope.printPdfVals.dateFrom = res.data.dateFrom;
                    $scope.printPdfVals.dateTo = res.data.dateTo;

                    if ($scope.filterReport.customers[0]) {
                        $scope.printPdfVals.custCode = $scope.filterReport.customers[0].customer_code;
                        $scope.printPdfVals.custName = $scope.filterReport.customers[0].name;
                    }

                    $scope.printPdfVals.suppliers = $scope.filterReport.suppliers;
                    $scope.printPdfVals.known_as = $rootScope.known_as;                    

                    $rootScope.company_name = res.data.company_name;
                    $rootScope.defaultLogo = res.data.company_logo;

                    $scope.printPdfVals.reportsDataArr = [];
                    $scope.printPdfVals.company_name = $rootScope.company_name;
                    $scope.printPdfVals._reportType = _reportType;

                    /* let currentUrl = window.location.href;
                    $scope.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;
                    $scope.printPdfVals.company_logo_url = $scope.company_logo_url; */

                    let currentUrl = window.location.origin + window.location.pathname;

                    var pathURL = (currentUrl).split("customerPortal.html");

                    $rootScope.company_logo_url = pathURL[0] + "upload/company_logo_temp/" + $rootScope.defaultLogo;
                    $scope.printPdfVals.company_logo_url = $rootScope.company_logo_url;                   

                    // console.log(customersPriceListData);

                    if (_reportType == 'xlsx') {
                        $scope.showLoader = true;
                        customersPriceListData.forEach(function (value, key, map) {
                            $scope.printPdfVals.reportsDataArr.push(value);
                        })
                        jsreportService.downloadXlsx($scope.printPdfVals, "B1xIaayxLH").success(function (data) {
                            let file = new Blob([data], { type: 'application/xlsx' });
                            saveAs(file, $scope.printPdfVals.reportName + ".xlsx");
                            $scope.showLoader = false;
                        })

                    } else if (_reportType == 'pdf') {
                        $scope.showLoader = true;

                        customersPriceListData.forEach(function (value, key, map) {
                            $scope.printPdfVals.reportsDataArr.push(value);
                        })

                        jsreportService.downloadPdf($scope.printPdfVals, "rJl5i2Nrrr").success(function (data) {
                            let file = new Blob([data], { type: 'application/pdf' });
                            saveAs(file, $scope.printPdfVals.reportName + ".pdf");
                            $scope.showLoader = false;
                        })

                    } else {

                        customersPriceListData.forEach(function (value, key, map) {
                            $scope.printPdfVals.reportsDataArr.push(value);
                        });

                        var invoicePdfModal = ModalService.showModal({
                            templateUrl: 'app/views/customerPortal/customerPriceListModal.html',
                            controller: 'pdfPrintCustPortalModalController',
                            inputs: {
                                printPdfVals: $scope.printPdfVals
                            }
                        });

                        invoicePdfModal.then(function (res) {
                            res.element.modal();
                        });
                        $scope.showLoader = false;
                    }
                }
                else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                    $scope.printPdfVals = {};
                    $scope.printPdfVals.columns = [];
                    $scope.reportsDataArr = [];
                    $scope.showLoader = false;
                }

                $rootScope.company_name = res.data.compName;
                $rootScope.defaultLogo = res.data.logo;
                $rootScope.compURL = res.data.compURL;
                $rootScope.address = res.data.address;
                $rootScope.address_2 = res.data.address_2;
                $rootScope.county = res.data.county;
                $rootScope.postcode = res.data.postcode;
                $rootScope.telephone = res.data.telephone;
                $rootScope.fax = res.data.fax;
                $rootScope.city = res.data.city;
                $rootScope.showLoader = false;

                let currentUrl = window.location.origin + window.location.pathname;

                var pathURL = (currentUrl).split("customerPortal.html");
                // console.log(pathURL[0]);

                $rootScope.company_logo_url = pathURL[0] + "upload/company_logo_temp/" + $rootScope.defaultLogo;
                $rootScope.invoiceLogoUrl = pathURL[0] + "upload/company_logo_temp/invoice.png";
                $rootScope.statementLogoUrl = pathURL[0] + "upload/company_logo_temp/statement.png";
                $rootScope.activityLogoUrl = pathURL[0] + "upload/company_logo_temp/activity.png";
                $rootScope.homeLogoUrl = pathURL[0] + "upload/company_logo_temp/home.png";
                $rootScope.priceLogoUrl = pathURL[0] + "upload/company_logo_temp/price.png";
            });
    }

    function groupBy(list, keyGetter) {
        const map = new Map();
        list.forEach((item) => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    }

}]);

/* Customer Price List report controller end */
