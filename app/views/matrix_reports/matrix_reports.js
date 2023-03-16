myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.finance-matrix', {
                url: '/finance-matrix',
                title: 'Finance Matrix',
                templateUrl: helper.basepath('matrix_reports/finance_matrix.html'),
                controller: 'MatrixReportsController',
                resolve: helper.resolveFor('ngTable', 'ngDialog')

            })
            .state('app.sales-matrix', {
                url: '/sales-matrix',
                title: 'Sales Matrix',
                templateUrl: helper.basepath('matrix_reports/sales_matrix.html'),
                controller: 'MatrixReportsController',
                resolve: helper.resolveFor('ngTable', 'ngDialog')

            })
            .state('app.purchase-matrix', {
                url: '/purchase-matrix',
                title: 'Purchase Matrix',
                templateUrl: helper.basepath('matrix_reports/purchase_matrix.html'),
                controller: 'MatrixReportsController',
                resolve: helper.resolveFor('ngTable', 'ngDialog')

            })
            .state('app.inventory-matrix', {
                url: '/inventory-matrix',
                title: 'Inventory Matrix',
                templateUrl: helper.basepath('matrix_reports/inventory_matrix.html'),
                controller: 'MatrixReportsController',
                resolve: helper.resolveFor('ngTable', 'ngDialog')

            })
            .state('app.hr-matrix', {
                url: '/hr-matrix',
                title: 'HR Matrix',
                templateUrl: helper.basepath('matrix_reports/hr_matrix.html'),
                controller: 'MatrixReportsController',
                resolve: helper.resolveFor('ngTable', 'ngDialog')

            })
    }]);

MatrixReportsController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$stateParams", "$state", "$rootScope", "moduleTracker", "jsreportService"];
myApp.controller('MatrixReportsController', MatrixReportsController);

function MatrixReportsController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams, $state, $rootScope, moduleTracker, jsreportService) {
    

    $scope.rec = {};
    
    var current_date = new Date(), y = current_date.getFullYear(), m = current_date.getMonth();
    var month = current_date.getMonth() + 1;
    var year = current_date.getFullYear();
    $scope.rec.month = $scope.$root.get_obj_frm_arry($rootScope.arrMonths, month);
    $scope.rec.year = year;
    
    var current_firstDay = new Date(y, m, 1);
    var current_lastDay = new Date(y, m + 1, 0);
    $scope.start_day = current_firstDay.getDay()-1;

    var leading_zero = ((current_firstDay.getMonth() + 1) < 10) ? '0' : '';

    $scope.rec.current_year_start_date  = '01/01/' + current_firstDay.getFullYear();
    $scope.rec.current_year_end_date    = '31/12/' + current_firstDay.getFullYear();
    $scope.rec.prev_year_start_date     = '01/01/' + current_firstDay.getFullYear();
    
    $scope.rec.current_month_start_date = '0' + current_firstDay.getDate() + '/' + leading_zero + (current_firstDay.getMonth() + 1) + '/' + current_firstDay.getFullYear();
    $scope.rec.current_month_end_date = current_lastDay.getDate() + '/' + leading_zero + (current_lastDay.getMonth() + 1) + '/' + current_lastDay.getFullYear();


    $scope.rec.start_date = $scope.rec.current_month_start_date;
    $scope.rec.end_date = $scope.rec.current_month_end_date

    $scope.rec.prev_start_date = '0' + current_firstDay.getDate() + '/' + leading_zero + (current_firstDay.getMonth() + 1) + '/' + (current_firstDay.getFullYear()-1);
    $scope.rec.prev_end_date = current_lastDay.getDate() + '/' + leading_zero + (current_lastDay.getMonth() + 1) + '/' + (current_lastDay.getFullYear()-1);

    $scope.onChangeMonth = function(){

        //var firstDay = new Date(2019, $scope.rec.month.id-1, 1);
        var current_year = new Date().getFullYear();
        var firstDay = new Date(current_year, $scope.rec.month.id-1, 1);
        var year = current_year;

        $scope.rec.year     = year;
        $scope.start_day    = firstDay.getDay()-1;

        $scope.getHRMatrix(1);
    }

    $scope.searchKeyword = {};
    $scope.searchKeywordSales = {};
    $scope.searchKeywordPurchase = {};
    $scope.searchKeywordInventory = {};

    let currentUrl = window.location.href;
    $scope.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;
    $scope.matrixData = {
        pdfColumnLimit: 13,
        data : [],
        columns : [],
        company_name : $rootScope.company_name,
        dateRange: $scope.rec.start_date + " - " + $scope.rec.end_date,
        company_logo_url: $scope.company_logo_url
    };
    $scope.callexportMatrix = function(_exportType = 'pdf'){
        let cSum =0;
        for (let c of $scope.matrixData.columns){
            if(c.visible)
                cSum++;
        }        
    
    if (_exportType == "pdf") {
      $scope.showLoader = true;
      $scope.matrixData._reportType = _exportType;
      jsreportService
        .downloadPdf($scope.matrixData, "BkxxGjAkT4")
        .success(function(data) {
          let file = new Blob([data], { type: "application/pdf" });
          saveAs(file, $scope.matrixData.fileName + ".pdf");
          if (cSum >= $scope.matrixData.pdfColumnLimit) {
            toaster.pop(
              "warning",
              "Warning",
              $scope.$root.getErrorMessageByCode(655, [
                $scope.matrixData.pdfColumnLimit
              ])
            );
          }

          $scope.showLoader = false;
        })
        .error(function(err) {
          $scope.showLoader = false;
          toaster.pop(
            "error",
            "Info",
            "Failed to export PDF due to large amount of data."
          );
        });
    } else {
      $scope.matrixData._reportType = _exportType;
      $scope.showLoader = true;
      jsreportService
        .downloadXlsx($scope.matrixData, "BkxxGjAkT4")
        .success(function(data) {
          let file = new Blob([data], { type: "application/pdf" });
          saveAs(file, $scope.matrixData.fileName + ".xlsx");
          $scope.showLoader = false;
        })
        .error(function(err) {
          $scope.showLoader = false;
          toaster.pop(
            "error",
            "Info",
            "Failed to export PDF due to large amount of data."
          );
        });
    }
    }

    $scope.exportMatrix = function(_exportType = 'pdf'){
        //suming the visible columns and limiting them on pdf
        // console.log
        switch($scope.matrixData.fileName){
            case "FinanceMatrix":
                    $scope.getFinanceMatrix(1, null , null, true).then(function(){
                        $scope.callexportMatrix(_exportType)
                    });
                    break;
            case "SalesMatrix":
                    $scope.getSalesMatrix(1, null , null, true).then(function(){
                        $scope.callexportMatrix(_exportType)
                    });
                    break;
            case "PurchaseMatrix":
                    $scope.getPurchaseMatrix(1, null , null, true).then(function(){
                        $scope.callexportMatrix(_exportType)
                    });
                    break;
            case "InventoryMatrix":
                    $scope.getInventoryMatrix(1, true).then(function(){
                        $scope.callexportMatrix(_exportType)
                    });
                    break;
        }
        
        
    }

    $scope.getFinanceMatrix = function (item_paging, sort_column, sortform,_isAllData = false) {

        $scope.matrixData.matrixTitle= "Finance Matrix";
        $scope.matrixData.fileName = "FinanceMatrix";

        if (!($scope.rec.start_date.length > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Start Date']));
            return;
        }
        if (!($scope.rec.end_date.length > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['End Date']));
            return;
        }

        var start_date_parts = $scope.rec.start_date.trim().split('/');
        var end_date_parts = $scope.rec.end_date.trim().split('/');

        $scope.rec.prev_start_date = start_date_parts[0].toString() + '/' + start_date_parts[1].toString() + '/' + (start_date_parts[2] - 1).toString();
        $scope.rec.prev_end_date = end_date_parts[0].toString() + '/' + end_date_parts[1].toString() + '/' + (end_date_parts[2] - 1).toString();

        var d_start_date = new Date(start_date_parts[2], start_date_parts[1] - 1, start_date_parts[0]);
        var d_end_date = new Date(end_date_parts[2], end_date_parts[1] - 1, end_date_parts[0]);

        if (d_start_date > d_end_date) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(333, ['Start Date', 'End Date']));
            return;
        }

        var Api = $scope.$root.gl + "chart-accounts/get-finance-matrix";
        $scope.postData = {};
        $scope.postData.current_year_start_date     = $scope.rec.current_year_start_date;
        $scope.postData.prev_year_start_date        = $scope.rec.prev_year_start_date;
        $scope.postData.current_month_start_date    = $scope.rec.current_month_start_date;
        $scope.postData.current_month_end_date      = $scope.rec.current_month_end_date;
        $scope.postData.fin_year_start_date         = $scope.rec.fin_year_start_date;
        $scope.postData.fin_year_end_date           = $scope.rec.fin_year_end_date;
        $scope.postData.prev_fin_year_start_date    = $scope.rec.prev_fin_year_start_date;
        
        $scope.postData.start_date                  = $scope.rec.start_date;
        $scope.postData.end_date                    = $scope.rec.end_date;
        $scope.postData.token                       = $scope.$root.token;
        $scope.postData.searchKeyword               = $scope.searchKeyword;

        if(_isAllData){
            var prev_pagination_value = $scope.postData.searchKeyword.totalRecords;            
            $scope.postData.searchKeyword.totalRecords = 9999;
            var prev_selectedPage = $scope.postData.searchKeyword.selectedPage;
            $scope.postData.searchKeyword.selectedPage = 1;
        }else if ($scope.postData.searchKeyword.totalRecords == undefined){
            $scope.postData.searchKeyword.totalRecords = 50;
        }


        if (item_paging == 1)
            $scope.item_paging.spage = 1

        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;


        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
        }

        // $scope.tableData = {};
        // if(!_isAllData){
            $scope.showLoader = true;
        // }
        
        return $http
            .post(Api, $scope.postData)
            .then(function (res) {
                // $scope.tableData_main = res;
                if (res.data.ack == true && !_isAllData) {
                    $scope.tableData_main = res;
                    $scope.showLoader = false;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    
                    $scope.total_paging_record = res.data.total_paging_record;

                    // $scope.matrixData.data = $scope.tableData_main.data;
                    // $scope.matrixData.columns = $scope.tableData_main.data.response.tbl_meta_data.response.colMeta;
                    
                    angular.forEach($scope.tableData_main.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
                        // $scope.matrixData.columns[index].title = $scope.matrixData.columns[index].title.replace(/\s+/g, '&nbsp;');
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    });
                }
                else if(_isAllData && res.data.ack == true){
                    $scope.postData.searchKeyword.totalRecords = prev_pagination_value ;
                    $scope.showLoader = false;
              
                    $scope.matrixData.data = res.data;
                    $scope.matrixData.columns = res.data.response.tbl_meta_data.response.colMeta;
                } 
                else {
                    $scope.showLoader = false;
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            }).catch(function (message) {
                $scope.showLoader = false;
                // toaster.pop('error', 'info', 'Server is not Acknowledging');
                throw new Error(message.data);
                console.log(message.data);
            });
    }
    $scope.getSalesMatrix = function (item_paging, sort_column, sortform, _isAllData = false) {

        $scope.matrixData.matrixTitle = "Sales Matrix";
        $scope.matrixData.fileName = "SalesMatrix";

        if (!($scope.rec.start_date.length > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Start Date']));
            return;
        }
        if (!($scope.rec.end_date.length > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['End Date']));
            return;
        }

        var start_date_parts = $scope.rec.start_date.trim().split('/');
        var end_date_parts = $scope.rec.end_date.trim().split('/');

        $scope.rec.prev_start_date = start_date_parts[0].toString() + '/' + start_date_parts[1].toString() + '/' + (start_date_parts[2] - 1).toString();
        $scope.rec.prev_end_date = end_date_parts[0].toString() + '/' + end_date_parts[1].toString() + '/' + (end_date_parts[2] - 1).toString();

        var d_start_date = new Date(start_date_parts[2], start_date_parts[1] - 1, start_date_parts[0]);
        var d_end_date = new Date(end_date_parts[2], end_date_parts[1] - 1, end_date_parts[0]);

        if (d_start_date > d_end_date) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(333, ['Start Date', 'End Date']));
            return;
        }

        var Api = $scope.$root.gl + "chart-accounts/get-sales-matrix";
        let postData = {};
        postData.current_year_start_date     = $scope.rec.current_year_start_date;
        postData.prev_year_start_date        = $scope.rec.prev_year_start_date;
        postData.current_month_start_date    = $scope.rec.current_month_start_date;
        postData.current_month_end_date      = $scope.rec.current_month_end_date;
        postData.fin_year_start_date         = $scope.rec.fin_year_start_date;
        postData.fin_year_end_date           = $scope.rec.fin_year_end_date;
        postData.prev_fin_year_start_date    = $scope.rec.prev_fin_year_start_date;
        
        postData.start_date                  = $scope.rec.start_date;
        postData.end_date                    = $scope.rec.end_date;
        postData.token                       = $scope.$root.token;
        postData.searchKeyword               = $scope.searchKeywordSales;

        if(_isAllData){
            var prev_pagination_value = postData.searchKeyword.totalRecords;
            postData.searchKeyword.totalRecords = 9999;
            var prev_selectedPage = postData.searchKeyword.selectedPage;
            postData.searchKeyword.selectedPage = 1;
        }
        else if (postData.searchKeyword.totalRecords == undefined) {
            postData.searchKeyword.totalRecords = 50;
        }

        if (item_paging == 1)
            $scope.item_paging.spage = 1

        postData.page = $scope.item_paging.spage;

        postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;


        if (postData.pagination_limits == -1) {
            postData.page = -1;
        }

        // $scope.tableData = {};
        // if(!_isAllData){
            $scope.showLoader = true;
        // }
        
        $scope.record = [];
        return $http
            .post(Api, postData)
            .then(function (res) {
                
                if (res.data.ack == true && !_isAllData) {
                    $scope.tableData_sales = res;
                    // $scope.tableData_grand_data = res.data.grand;
                    $scope.record = res.data.response;
                    $scope.showLoader = false;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    // $scope.matrixData.data = $scope.tableData_sales.data;
                    // $scope.matrixData.columns = $scope.tableData_sales.data.response.tbl_meta_data.response.colMeta;


                    angular.forEach($scope.tableData_sales.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    });
                } 
                else if(_isAllData && res.data.ack == true){
                    postData.searchKeyword.totalRecords = prev_pagination_value ;
                    $scope.showLoader = false;
              
                    $scope.matrixData.data = res.data;
                    $scope.matrixData.columns = res.data.response.tbl_meta_data.response.colMeta;
                } else {

                    $scope.showLoader = false;
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }

                // if(!_isAllData){
                //     $scope.getSalesMatrix(1, null , null, true);
                // }
                
            }).catch(function (message) {
                $scope.showLoader = false;
                // toaster.pop('error', 'info', 'Server is not Acknowledging');
                throw new Error(message.data);
                console.log(message.data);
            });
    }


    $scope.getPurchaseMatrix = function (item_paging, sort_column, sortform, _isAllData = false) {

        $scope.matrixData.matrixTitle = "Purchase Matrix";
        $scope.matrixData.fileName = "PurchaseMatrix";

        if (!($scope.rec.start_date.length > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Start Date']));
            return;
        }
        if (!($scope.rec.end_date.length > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['End Date']));
            return;
        }

        var start_date_parts = $scope.rec.start_date.trim().split('/');
        var end_date_parts = $scope.rec.end_date.trim().split('/');

        $scope.rec.prev_start_date = start_date_parts[0].toString() + '/' + start_date_parts[1].toString() + '/' + (start_date_parts[2] - 1).toString();
        $scope.rec.prev_end_date = end_date_parts[0].toString() + '/' + end_date_parts[1].toString() + '/' + (end_date_parts[2] - 1).toString();

        var d_start_date = new Date(start_date_parts[2], start_date_parts[1] - 1, start_date_parts[0]);
        var d_end_date = new Date(end_date_parts[2], end_date_parts[1] - 1, end_date_parts[0]);

        if (d_start_date > d_end_date) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(333, ['Start Date', 'End Date']));
            return;
        }

        var Api = $scope.$root.gl + "chart-accounts/get-purchase-matrix";
        $scope.postData = {};
        $scope.postData.current_year_start_date     = $scope.rec.current_year_start_date;
        $scope.postData.prev_year_start_date        = $scope.rec.prev_year_start_date;
        $scope.postData.current_month_start_date    = $scope.rec.current_month_start_date;
        $scope.postData.current_month_end_date      = $scope.rec.current_month_end_date;
        $scope.postData.start_date                  = $scope.rec.start_date;
        $scope.postData.end_date                    = $scope.rec.end_date;
        $scope.postData.fin_year_start_date         = $scope.rec.fin_year_start_date;
        $scope.postData.fin_year_end_date           = $scope.rec.fin_year_end_date;
        $scope.postData.prev_fin_year_start_date    = $scope.rec.prev_fin_year_start_date;

        $scope.postData.token                       = $scope.$root.token;
        $scope.postData.searchKeyword               = $scope.searchKeywordPurchase;

        if(_isAllData){
            var prev_pagination_value = $scope.postData.searchKeyword.totalRecords;
            $scope.postData.searchKeyword.totalRecords = 9999;
            var prev_selectedPage = $scope.postData.searchKeyword.selectedPage;
            $scope.postData.searchKeyword.selectedPage = 1;
        }
        else if($scope.postData.searchKeyword.totalRecords == undefined) {
            $scope.postData.searchKeyword.totalRecords = 50;
        }

        if (item_paging == 1)
            $scope.item_paging.spage = 1

        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;


        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
        }

        // $scope.tableData = {};
        // if(!_isAllData){
            $scope.showLoader = true;
        // }
        $scope.record = [];
        return $http
            .post(Api, $scope.postData)
            .then(function (res) {
                // $scope.tableData_purchase = res;
                if (res.data.ack == true && !_isAllData) {
                    $scope.tableData_purchase = res;
                    $scope.record = res.data.response;
                    $scope.showLoader = false;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    // $scope.matrixData.data = $scope.tableData_purchase.data;
                    // $scope.matrixData.columns = $scope.tableData_purchase.data.response.tbl_meta_data.response.colMeta;


                    angular.forEach($scope.tableData_purchase.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    });
                }else if(_isAllData && res.data.ack == true){
                    $scope.postData.searchKeyword.totalRecords = prev_pagination_value ;
                    $scope.showLoader = false;
              
                    $scope.matrixData.data = res.data;
                    $scope.matrixData.columns = res.data.response.tbl_meta_data.response.colMeta;
                } 
                else {
                    $scope.showLoader = false;
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            }).catch(function (message) {
                $scope.showLoader = false;
                // toaster.pop('error', 'info', 'Server is not Acknowledging');
                throw new Error(message.data);
                console.log(message.data);
            });
    }

    $scope.getInventoryMatrix = function (item_paging, _isAllData = false) {

        $scope.matrixData.matrixTitle = "Inventory Matrix";
        $scope.matrixData.fileName = "InventoryMatrix";

        if (!($scope.rec.start_date.length > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Start Date']));
            return;
        }
        if (!($scope.rec.end_date.length > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['End Date']));
            return;
        }

        var start_date_parts = $scope.rec.start_date.trim().split('/');
        var end_date_parts = $scope.rec.end_date.trim().split('/');

        $scope.rec.prev_start_date = start_date_parts[0].toString() + '/' + start_date_parts[1].toString() + '/' + (start_date_parts[2] - 1).toString();
        $scope.rec.prev_end_date = end_date_parts[0].toString() + '/' + end_date_parts[1].toString() + '/' + (end_date_parts[2] - 1).toString();

        var d_start_date = new Date(start_date_parts[2], start_date_parts[1] - 1, start_date_parts[0]);
        var d_end_date = new Date(end_date_parts[2], end_date_parts[1] - 1, end_date_parts[0]);

        if (d_start_date > d_end_date) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(333, ['Start Date', 'End Date']));
            return;
        }

        var Api = $scope.$root.gl + "chart-accounts/get-inventory-matrix";
        $scope.postData = {};
        $scope.postData.current_year_start_date     = $scope.rec.current_year_start_date;
        $scope.postData.prev_year_start_date        = $scope.rec.prev_year_start_date;
        $scope.postData.current_month_start_date    = $scope.rec.current_month_start_date;
        $scope.postData.current_month_end_date      = $scope.rec.current_month_end_date;
        $scope.postData.start_date                  = $scope.rec.start_date;
        $scope.postData.end_date                    = $scope.rec.end_date;
        $scope.postData.report_type                 = $scope.rec.report_type;
        $scope.postData.fin_year_start_date         = $scope.rec.fin_year_start_date;
        $scope.postData.fin_year_end_date           = $scope.rec.fin_year_end_date;
        $scope.postData.prev_fin_year_start_date    = $scope.rec.prev_fin_year_start_date;

        $scope.postData.token = $scope.$root.token;
        $scope.postData.searchKeyword = $scope.searchKeywordInventory;
        if (item_paging == 1)
            $scope.item_paging.spage = 1;

        $scope.postData.page = $scope.item_paging.spage;

        if(_isAllData){
            var prev_pagination_value = $scope.postData.searchKeyword.totalRecords;
            $scope.postData.searchKeyword.totalRecords = 9999;
            var prev_selectedPage = $scope.postData.searchKeyword.selectedPage;
            $scope.postData.searchKeyword.selectedPage = 1;
            $scope.postData.page = 1;
        }
        else if ($scope.postData.searchKeyword.totalRecords == undefined) {
            $scope.postData.searchKeyword.totalRecords = 50;
        }


        $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;


        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
        }

        // $scope.tableData = {};
        // if(!_isAllData){
            $scope.showLoader = true;
        // }
        $scope.record = [];
        return $http
            .post(Api, $scope.postData)
            .then(function (res) {
                // $scope.tableData_inventory = res;
                if (res.data.ack == true && !_isAllData) {
                    $scope.tableData_inventory = res;
                    $scope.record = res.data.response;
                    $scope.showLoader = false;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    // $scope.matrixData.data = $scope.tableData_inventory.data;
                    // $scope.matrixData.columns = $scope.tableData_inventory.data.response.tbl_meta_data.response.colMeta;

                    angular.forEach($scope.tableData_inventory.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    });
                }else if(_isAllData && res.data.ack == true){
                    $scope.postData.searchKeyword.totalRecords = prev_pagination_value;
                    $scope.showLoader = false;
              
                    $scope.matrixData.data = res.data;
                    $scope.matrixData.columns = res.data.response.tbl_meta_data.response.colMeta;
                } 
                else {
                    $scope.showLoader = false;
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            }).catch(function (message) {
                $scope.showLoader = false;
                // toaster.pop('error', 'info', 'Server is not Acknowledging');
                throw new Error(message.data);
                console.log(message.data);
            });
    }

    $scope.getHRMatrix = function (item_paging, sort_column, sortform) {

        $scope.matrixData.matrixTitle = "HR Matrix";
        $scope.matrixData.fileName = "HRMatrix";

        if (!($scope.rec.start_date.length > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Start Date']));
            return;
        }
        if (!($scope.rec.end_date.length > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['End Date']));
            return;
        }

        var start_date_parts = $scope.rec.start_date.trim().split('/');
        var end_date_parts = $scope.rec.end_date.trim().split('/');

        var d_start_date = new Date(start_date_parts[2], start_date_parts[1] - 1, start_date_parts[0]);
        var d_end_date = new Date(end_date_parts[2], end_date_parts[1] - 1, end_date_parts[0]);

        if (d_start_date > d_end_date) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(333, ['Start Date', 'End Date']));
            return;
        }

        var Api = $scope.$root.gl + "chart-accounts/get-hr-matrix";
        $scope.postData = {};

        $scope.postData.start_date = $scope.rec.start_date;
        $scope.postData.end_date = $scope.rec.end_date;
        $scope.postData.month = $scope.rec.month.id;
        $scope.postData.year = $scope.rec.year;
        $scope.postData.departments = $scope.rec.departments;
        $scope.postData.emp_name = $scope.rec.emp_name;
        
        $scope.postData.token = $scope.$root.token;
        $scope.postData.searchKeyword = $scope.searchKeyword;
        if ($scope.postData.searchKeyword.totalRecords == undefined) {
            $scope.postData.searchKeyword.totalRecords = 50;
        }

        $scope.arr_duration = [];
        for (var i = 1; i <= $scope.rec.month.no_of_days; i++) {
            var d = {};
            d.colspan = 0;
            d.date = i;
            d.day = $rootScope.arrWeekDays[($scope.start_day + i) % 7];
            $scope.arr_duration.push(d);
        }
        
        if (item_paging == 1)
            $scope.item_paging.spage = 1

        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;


        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
        }

        // $scope.tableData = {};
        $scope.showLoader = true;
        $scope.rec.employees = [];
        $http
            .post(Api, $scope.postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.showLoader = false;

                    $scope.rec.employees = res.data.response;

                    angular.forEach($scope.rec.employees, function(emp){
                        emp.days = [];
                        var offset = 1;
                        var holiday_points = [];
                        angular.copy($scope.arr_duration, emp.days);
                        angular.forEach(emp.holiday, function(obj){
                            // colspan=booked_days
                            for (var i = 0; i <= $scope.rec.month.no_of_days; i++) {
                                if((obj.start_day) == i && Number(obj.booked_days) >= 0.5)
                                {
                                    holiday_points.push({'idx':i, 'offset': Number(obj.booked_days)});
                                    emp.days[i - offset].colspan = obj.booked_days;
                                    emp.days[i - offset].text = String(obj.days_requested) + ' days';
                                    emp.days[i - offset].holiday_id = obj.holiday_id ;
                                    emp.days[i - offset].holiday_nature = obj.holiday_nature ;
                                    // emp.days = emp.days.slice(i, offset);
                                    i = Number($scope.rec.month.no_of_days)+1;
                                    var t = Number(obj.booked_days) * -1;
                                    // emp.days.slice(t+1);
                                    // offset += Number(obj.booked_days)-1;
                                }
                            }
                        });
                        
                        // console.log(holiday_points);
                        var already_deleted=0;
                        var span_count = 0;
                        angular.forEach(holiday_points, function(obj){
                            // emp.days = emp.days.slice(obj.idx+already_deleted, obj.offset);
                            
                            angular.forEach(emp.days, function(obj1, index){
                                if(index >= obj.idx)
                                {
                                    emp.days[index-already_deleted] = emp.days[index-already_deleted+obj.offset-1];
                                    
                                }
                            });
                            already_deleted += Number(obj.offset)-1;
                            span_count +=Number(obj.offset);
                        });
                        emp.days = emp.days.slice(0, emp.days.length - span_count);

                        // console.log(emp.days);
                    });
                }
                else {
                    $scope.showLoader = false;
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            });
    }
    
    var Fin_Api = $scope.$root.gl + "chart-accounts/get-financial-year-dates";
    $http
        .post(Fin_Api, {'token': $scope.$root.token})
        .then(function (res) {
            if (res.data.ack == true) {
                $scope.rec.fin_year_start_date = res.data.response.fin_year_start_date;
                $scope.rec.fin_year_end_date = res.data.response.fin_year_end_date;
                $scope.rec.prev_fin_year_start_date = res.data.response.prev_fin_year_start_date;

                if ($state.current.name.match("app.finance-matrix")) {
                    $scope.getFinanceMatrix(1);
                    // setTimeout(() => {
                    //     $scope.getFinanceMatrix(1, null , null, true);
                    // }, 100);
                }
                else if ($state.current.name.match("app.sales-matrix")) {
                    $scope.getSalesMatrix(1, null , null, false);
                    // setTimeout(() => {
                    //     $scope.getSalesMatrix(1, null , null, true);
                    // }, 100);
                }
                else if ($state.current.name.match("app.purchase-matrix")) {
                    $scope.getPurchaseMatrix(1);
                    // setTimeout(() => {
                    //     $scope.getPurchaseMatrix(1, null , null, true);
                    // }, 100);
                }
                else if ($state.current.name.match("app.inventory-matrix")) {
                    $scope.rec.report_type = 1;
                    $scope.getInventoryMatrix(1);
                    // setTimeout(() => {
                    //     $scope.getInventoryMatrix(1, true);
                    // }, 100);
                }
                else if ($state.current.name.match("app.hr-matrix")) {
                    $scope.getHRMatrix(1);
                    $rootScope.get_department_list();
                }
            }
            else
            {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            }

        });

    
    $scope.searchKeywordForGLDetail = {};
    $scope.show_detail_pop = function (record, item_paging) {
        $scope.account_details_rec = [];
        
        if (record != undefined)
        {
            var mainRecord = record;
            $scope.entries_type = record.type;

            var record = mainRecord.record;
            var index = mainRecord.index;
            var url;

            var account_id = record.id;
            var type = record.accountType;
            var acc_code = record.gl_no;
            var acc_name = record.gl_name;
            var range_from = 0;
            var range_to = 0;

            
            $scope.balance_detail_title = acc_code + " - " + acc_name+ " - " + mainRecord.title;
            $scope.gl_code = acc_code;

            $scope.showLoader = true;
            $scope.filterSearchAccount = {};


            $scope.ExpAccountID = account_id;
            $scope.ExpType = type;
            $scope.ExpAccCode = acc_code;
            $scope.ExpAccName = acc_name;
            $scope.ExpRangeFrom = range_from;
            $scope.ExpRangeTo = range_to;

            $scope.glAccountPagination = {};
            $scope.glAccountPagination.ExpAccountID = account_id;
            $scope.glAccountPagination.ExpType = type;
            $scope.glAccountPagination.ExpAccCode = acc_code;
            $scope.glAccountPagination.ExpAccName = acc_name;
            $scope.glAccountPagination.ExpRangeFrom = range_from;
            $scope.glAccountPagination.ExpRangeTo = range_to;

            $scope.searchKeywordForGLDetail = {};
        }
        /* else
        {
            $scope.entries_type = 0;
        } */

        $scope.postData.current_year_start_date     = $scope.rec.current_year_start_date;
        $scope.postData.current_month_start_date    = $scope.rec.current_month_start_date;
        $scope.postData.current_month_end_date      = $scope.rec.current_month_end_date;
        $scope.postData.start_date                  = $scope.rec.start_date;
        $scope.postData.end_date                    = $scope.rec.end_date;
        $scope.postData.fin_year_start_date         = $scope.rec.fin_year_start_date;
        $scope.postData.fin_year_end_date           = $scope.rec.fin_year_end_date;
        $scope.postData.prev_fin_year_start_date    = $scope.rec.prev_fin_year_start_date;



        // if ($scope.searchKeywordForGLDetail.posting_date == undefined)
        {
            if ($scope.entries_type == 1) { // current month
                // $scope.searchKeywordForGLDetail = {};
                $scope.searchKeywordForGLDetail.posting_date = {};
                $scope.searchKeywordForGLDetail.posting_date.lowerLimit = $scope.rec.current_month_start_date;
                $scope.searchKeywordForGLDetail.posting_date.upperLimit = $scope.rec.current_month_end_date;
            }
            else if ($scope.entries_type == 2) { // accouting year
                // $scope.searchKeywordForGLDetail = {};
                $scope.searchKeywordForGLDetail.posting_date = {};
                $scope.searchKeywordForGLDetail.posting_date.lowerLimit = $scope.rec.fin_year_start_date;
                $scope.searchKeywordForGLDetail.posting_date.upperLimit = $scope.rec.fin_year_end_date;
            }
            else if ($scope.entries_type == 3) { // current selected period
                // $scope.searchKeywordForGLDetail = {};
                $scope.searchKeywordForGLDetail.posting_date = {};
                $scope.searchKeywordForGLDetail.posting_date.lowerLimit = $scope.rec.start_date;
                $scope.searchKeywordForGLDetail.posting_date.upperLimit = $scope.rec.end_date;
            }
            else if ($scope.entries_type == 4) { // prev year
                // $scope.searchKeywordForGLDetail = {};
                $scope.searchKeywordForGLDetail.posting_date = {};
                $scope.searchKeywordForGLDetail.posting_date.lowerLimit = $scope.rec.prev_start_date;
                $scope.searchKeywordForGLDetail.posting_date.upperLimit = $scope.rec.prev_end_date;
            }
        }

        $scope.postData = {
            'token': $scope.$root.token,
            'account_type': $scope.ExpType,
            'account_id': $scope.ExpAccountID,
            'range_from': $scope.ExpRangeFrom,
            'range_to': $scope.ExpRangeTo,
            'searchKeyword': $scope.searchKeywordForGLDetail
        }
        if (item_paging && item_paging == 1) $scope.item_paging.spage = 1;
        $scope.postData.page = $scope.item_paging.spage;
        $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;


        // if ($scope.item_paging) {
        //     if (item_paging == 1) $scope.item_paging.spage = 1;
        //     $scope.postData.page = $scope.item_paging.spage;
        //     $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;
        // }

        var gl_account_DetailsURL = $scope.$root.gl + "chart-accounts/get-gl-account-debit-credit-by-id";

        $scope.showLoader = true;
        $http
            .post(gl_account_DetailsURL, $scope.postData)
            .then(function (res) {


                //console.log(res);
                $scope.totalAmount = 0;
                if (res.data.ack == true) {
                    $scope.tableData = res;
                    $scope.tableData.data.response.tbl_meta_data.defaultFilter = true;

                    // if (searchCond != 1) 
                    // $scope.account_details_rec = res.data.response;
                    $scope.account_details_rec.data = res.data.response;
                    // else
                    //     angular.copy($scope.account_details_rec, res.data.response);
                    $scope.total = res.data.total;

                    $scope.totalAmount = res.data.totalAmount;

                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.Total_transaction = res.data.Total_transaction;
                    $scope.Total_transaction_type = res.data.Total_transaction_type;
                    $scope.showLoader = false;

                    angular.forEach($scope.account_details_rec.data.tbl_meta_data.response.colMeta, function (obj, index) {
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    });
                    
                    $scope.showLoader = false;
                    angular.element('#show_account_detail_pop').modal({
                        show: true
                    });
                }
                else {
                    $scope.showLoader = false;
                    toaster.pop('error', 'Error', res.data.error);
                }
            });

    }

    $scope.searchKeywordForSalesMatrix = {};
    $scope.show_sales_matrix_detail = function (record)
    {
        if (record){
            $scope.lastDetailRecord = record;
            $scope.entries_type = record.type;
            $scope.searchKeywordForSalesMatrix = {};
        }
        else{
            record = $scope.lastDetailRecord;
            // $scope.entries_type = 0;
        }
        if (record != undefined) {
            var mainRecord = record;
            // $scope.entries_type = record.type;

            var record = mainRecord.record;
            var index = mainRecord.index;
            var url;
            $scope.sales_matrix_detail_title = record.customer_name+' (' + record.customer_no + ") - "+mainRecord.title;

        }

        // if ($scope.searchKeywordForSalesMatrix.posting_date == undefined)
        {
            if ($scope.entries_type == 1) { // current year
                // $scope.searchKeywordForSalesMatrix = {};
                $scope.searchKeywordForSalesMatrix.posting_date = {};
                $scope.searchKeywordForSalesMatrix.posting_date.lowerLimit = $scope.rec.current_year_start_date;
                $scope.searchKeywordForSalesMatrix.posting_date.upperLimit = $scope.rec.current_year_end_date;
                $scope.searchKeywordForSalesMatrix.invoice_type = 2;
                
            }
            else if ($scope.entries_type == 2) { // current selected period
                // $scope.searchKeywordForSalesMatrix = {};
                $scope.searchKeywordForSalesMatrix.posting_date = {};
                $scope.searchKeywordForSalesMatrix.posting_date.lowerLimit = $scope.rec.start_date;
                $scope.searchKeywordForSalesMatrix.posting_date.upperLimit = $scope.rec.end_date;
                $scope.searchKeywordForSalesMatrix.invoice_type = 2;
            }
            else if ($scope.entries_type == 3) { // prev year
                // $scope.searchKeywordForSalesMatrix = {};
                $scope.searchKeywordForSalesMatrix.posting_date = {};
                $scope.searchKeywordForSalesMatrix.posting_date.lowerLimit = $scope.rec.prev_start_date;
                $scope.searchKeywordForSalesMatrix.posting_date.upperLimit = $scope.rec.prev_end_date;
                $scope.searchKeywordForSalesMatrix.invoice_type = 2;
            }
            else if ($scope.entries_type == 4) { // order
                // $scope.searchKeywordForSalesMatrix = {};
                // $scope.searchKeywordForSalesMatrix.posting_date = {};
                // $scope.searchKeywordForSalesMatrix.posting_date.lowerLimit = $scope.rec.start_date;
                // $scope.searchKeywordForSalesMatrix.posting_date.upperLimit = $scope.rec.end_date;
                $scope.searchKeywordForSalesMatrix.invoice_type = 1;
                // $scope.searchKeywordForSalesMatrix.SalesType = 'Sales Invoice';

            }
            else if ($scope.entries_type == 5) { // quotes
                // $scope.searchKeywordForSalesMatrix = {};
                // $scope.searchKeywordForSalesMatrix.posting_date = {};
                // $scope.searchKeywordForSalesMatrix.posting_date.lowerLimit = $scope.rec.start_date;
                // $scope.searchKeywordForSalesMatrix.posting_date.upperLimit = $scope.rec.end_date;
                $scope.searchKeywordForSalesMatrix.invoice_type = 0;
                // $scope.searchKeywordForSalesMatrix.SalesType = 'Credit Note';
            }
        }


        var item_paging = 1;

        
        $scope.postData = {
            'token': $scope.$root.token,
            'cust_id': record.id,
            'searchKeyword': $scope.searchKeywordForSalesMatrix
        }

        if (item_paging) {
            if (item_paging == 1) $scope.item_paging.spage = 1;
            $scope.postData.page = $scope.item_paging.spage;
            $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;
        }


        if ($scope.item_paging) {
            if (item_paging == 1) $scope.item_paging.spage = 1;
            $scope.postData.page = $scope.item_paging.spage;
            $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;
        }

        var sales_matrix_DetailsURL = $scope.$root.gl + "chart-accounts/get-sales-matrix-details";
        $scope.showLoader = true;
        $http
            .post(sales_matrix_DetailsURL, $scope.postData)
            .then(function (res) {


                //console.log(res);
                $scope.totalAmount = 0;
                $scope.salesMatrixDetailTableData = res;
                $scope.salesMatrixDetailTableData.data.response.tbl_meta_data.defaultFilter = true;
                if (res.data.ack == true) {

                    
                    $scope.totalAmount = Number(0);
                    $scope.rows = res.data.response;                    
                    $scope.totalAmount = res.data.total_amount;
                    /* angular.forEach(res.data.response, function(obj, index){
                        if (index  != 'tbl_meta_data')
                            $scope.totalAmount += Number(obj.revenue);
                    }); */
                    // $scope.totalAmount = $scope.totalAmount.toFixed(2);
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.showLoader = false;

                    angular.forEach($scope.salesMatrixDetailTableData.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    })
                    $scope.showLoader = false;
                    angular.element('#sales_matrix_details').modal({
                        show: true
                    });
                }
                else {
                    $scope.showLoader = false;
                    toaster.pop('error', 'Error', res.data.error);
                }
            });

    }

    $scope.searchKeywordForPurchaseMatrix = {};
    $scope.show_purchase_matrix_detail = function (record) {
        if (record) {
            $scope.lastDetailRecord = record;
            $scope.entries_type = record.type;
            $scope.searchKeywordForPurchaseMatrix = {};
        }
        else {
            record = $scope.lastDetailRecord;
            // $scope.entries_type = 0;
        }
        if (record != undefined) {
            var mainRecord = record;
            // $scope.entries_type = record.type;

            var record = mainRecord.record;
            var index = mainRecord.index;
            var url;
            $scope.purchase_matrix_detail_title = record.supplier_name + ' (' + record.supplier_no + ") - "+mainRecord.title;

        }

        // if ($scope.searchKeywordForPurchaseMatrix.posting_date == undefined) 
        {
            if ($scope.entries_type == 1) { // current year
                // $scope.searchKeywordForPurchaseMatrix = {};
                $scope.searchKeywordForPurchaseMatrix.posting_date = {};
                $scope.searchKeywordForPurchaseMatrix.posting_date.lowerLimit = $scope.rec.current_year_start_date;
                $scope.searchKeywordForPurchaseMatrix.posting_date.upperLimit = $scope.rec.current_year_end_date;
                $scope.searchKeywordForPurchaseMatrix.invoice_type = 2;

            }
            else if ($scope.entries_type == 2) { // current selected period
                // $scope.searchKeywordForPurchaseMatrix = {};
                $scope.searchKeywordForPurchaseMatrix.posting_date = {};
                $scope.searchKeywordForPurchaseMatrix.posting_date.lowerLimit = $scope.rec.start_date;
                $scope.searchKeywordForPurchaseMatrix.posting_date.upperLimit = $scope.rec.end_date;
                $scope.searchKeywordForPurchaseMatrix.invoice_type = 2;
            }
            else if ($scope.entries_type == 3) { // prev year
                // $scope.searchKeywordForPurchaseMatrix = {};
                $scope.searchKeywordForPurchaseMatrix.posting_date = {};
                $scope.searchKeywordForPurchaseMatrix.posting_date.lowerLimit = $scope.rec.prev_start_date;
                $scope.searchKeywordForPurchaseMatrix.posting_date.upperLimit = $scope.rec.prev_end_date;
                $scope.searchKeywordForPurchaseMatrix.invoice_type = 2;
            }
            else if ($scope.entries_type == 4) { // order
                // $scope.searchKeywordForPurchaseMatrix = {};
                // $scope.searchKeywordForPurchaseMatrix.posting_date = {};
                // $scope.searchKeywordForPurchaseMatrix.posting_date.lowerLimit = $scope.rec.start_date;
                // $scope.searchKeywordForPurchaseMatrix.posting_date.upperLimit = $scope.rec.end_date;
                $scope.searchKeywordForPurchaseMatrix.invoice_type = 3;
            } 
        }

        
        
        $scope.postData = {
            'token': $scope.$root.token,
            'supplier_id': record.id,
            'searchKeyword': $scope.searchKeywordForPurchaseMatrix
        }
        $scope.postData.page = $scope.item_paging.spage || 1;

        var sales_matrix_DetailsURL = $scope.$root.gl + "chart-accounts/get-purchase-matrix-details";
        $scope.showLoader = true;
        $http
            .post(sales_matrix_DetailsURL, $scope.postData)
            .then(function (res) {


                //console.log(res);
                $scope.totalAmount = 0;
                $scope.purchaseMatrixDetailTableData = res;
                $scope.purchaseMatrixDetailTableData.data.response.tbl_meta_data.defaultFilter = true;
                if (res.data.ack == true) {


                    $scope.totalAmount = Number(0);
                    $scope.rows = res.data.response;
                    if(res.data.total_amount != undefined){
                        $scope.totalAmount = res.data.total_amount;
                    }
                    
                    /* angular.forEach(res.data.response, function (obj, index) {
                        if (index != 'tbl_meta_data')
                            $scope.totalAmount += Number(obj.revenue);
                    }); */
                    // $scope.totalAmount = $scope.totalAmount.toFixed(2);
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.showLoader = false;

                    angular.forEach($scope.purchaseMatrixDetailTableData.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    });
                    $scope.showLoader = false;
                    angular.element('#purchase_matrix_details').modal({
                        show: true
                    });
                }
                else {
                    $scope.showLoader = false;
                    toaster.pop('error', 'Error', res.data.error);
                }
            });

    }

    $scope.searchKeywordForInventoryMatrix = {};
    $scope.show_inventory_matrix_detail = function (record) {
        if (record) {
            $scope.lastDetailRecord = record;
            $scope.entries_type = record.type;
            $scope.searchKeywordForInventoryMatrix = {};
        }
        else {
            record = $scope.lastDetailRecord;
            // $scope.entries_type = 0;
        }
        if (record != undefined) {
            var mainRecord = record;
            // $scope.entries_type = record.type;

            var record = mainRecord.record;
            var index = mainRecord.index;
            var url;
            $scope.inventory_matrix_detail_title = record.product_name + ' (' + record.product_code + ") - "+mainRecord.title;

        }

        // if ($scope.searchKeywordForPurchaseMatrix.posting_date == undefined) 
        {
            if ($scope.entries_type == 1) { // sales TY
                // $scope.searchKeywordForInventoryMatrix = {};
                $scope.searchKeywordForInventoryMatrix.posting_date = {};
                $scope.searchKeywordForInventoryMatrix.posting_date.lowerLimit = $scope.rec.fin_year_start_date;
                $scope.searchKeywordForInventoryMatrix.posting_date.upperLimit = $scope.rec.fin_year_end_date;
                $scope.rec.detail_type = 1;

            }
            else if ($scope.entries_type == 2) { // purchases TY
                // $scope.searchKeywordForInventoryMatrix = {};
                $scope.searchKeywordForInventoryMatrix.posting_date = {};
                $scope.searchKeywordForInventoryMatrix.posting_date.lowerLimit = $scope.rec.fin_year_start_date;
                $scope.searchKeywordForInventoryMatrix.posting_date.upperLimit = $scope.rec.fin_year_end_date;
                $scope.rec.detail_type = 2;

            }
            else if ($scope.entries_type == 3) { // current selected period Sales 
                // $scope.searchKeywordForInventoryMatrix = {};
                $scope.searchKeywordForInventoryMatrix.posting_date = {};
                $scope.searchKeywordForInventoryMatrix.posting_date.lowerLimit = $scope.rec.start_date;
                $scope.searchKeywordForInventoryMatrix.posting_date.upperLimit = $scope.rec.end_date;
                $scope.rec.detail_type = 1;
            }
            else if ($scope.entries_type == 4) { // current selected period Purchases 
                // $scope.searchKeywordForInventoryMatrix = {};
                $scope.searchKeywordForInventoryMatrix.posting_date = {};
                $scope.searchKeywordForInventoryMatrix.posting_date.lowerLimit = $scope.rec.start_date;
                $scope.searchKeywordForInventoryMatrix.posting_date.upperLimit = $scope.rec.end_date;
                $scope.rec.detail_type = 2;
            }
            else if ($scope.entries_type == 5) { // prev selected period Sales 
                // $scope.searchKeywordForInventoryMatrix = {};
                $scope.searchKeywordForInventoryMatrix.posting_date = {};
                $scope.searchKeywordForInventoryMatrix.posting_date.lowerLimit = $scope.rec.prev_start_date;
                $scope.searchKeywordForInventoryMatrix.posting_date.upperLimit = $scope.rec.prev_end_date;
                $scope.rec.detail_type = 1;
            }
            else if ($scope.entries_type == 6) { // prev selected period Purchases 
                // $scope.searchKeywordForInventoryMatrix = {};
                $scope.searchKeywordForInventoryMatrix.posting_date = {};
                $scope.searchKeywordForInventoryMatrix.posting_date.lowerLimit = $scope.rec.prev_start_date;
                $scope.searchKeywordForInventoryMatrix.posting_date.upperLimit = $scope.rec.prev_end_date;
                $scope.rec.detail_type = 2;
            }
        }


        var item_paging = 1;

        if (item_paging) {
            if (item_paging == 1) $scope.item_paging.spage = 1;
            $scope.postData.page = $scope.item_paging.spage;
            $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;
        }


        $scope.postData = {
            'token': $scope.$root.token,
            'product_id': record.id,
            'report_type': $scope.rec.report_type,
            'detail_type': $scope.rec.detail_type,            
            'searchKeyword': $scope.searchKeywordForInventoryMatrix
        }
        if ($scope.item_paging) {
            if (item_paging == 1) $scope.item_paging.spage = 1;
            $scope.postData.page = $scope.item_paging.spage;
            $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;
        }

        var inventory_matrix_DetailsURL = $scope.$root.gl + "chart-accounts/get-inventory-matrix-details";
        $scope.showLoader = true;
        $http
            .post(inventory_matrix_DetailsURL, $scope.postData)
            .then(function (res) {


                //console.log(res);
                $scope.totalAmount = 0;
                $scope.inventoryMatrixDetailTableData = res;
                $scope.inventoryMatrixDetailTableData.data.response.tbl_meta_data.defaultFilter = true;
                if (res.data.ack == true) {


                    $scope.totalAmount = Number(0);
                    $scope.rows = res.data.response;
                    angular.forEach(res.data.response, function (obj, index) {
                        if (index != 'tbl_meta_data')
                            $scope.totalAmount += Number(obj.sales);
                    });
                    $scope.totalAmount = $scope.totalAmount.toFixed(2);
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.showLoader = false;

                    angular.forEach($scope.inventoryMatrixDetailTableData.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    });
                    $scope.showLoader = false;

                    angular.element('#inventory_matrix_details').modal({
                        show: true
                    });
                }
                else {
                    $scope.showLoader = false;
                    toaster.pop('error', 'Error', res.data.error);
                }
            });

    }


    $scope.openCustomerLink = function (record) {
        var mainRecord = record;
        var record = mainRecord.record;
        var index = mainRecord.index;
        var url;
        url = $state.href("app.editCustomer", ({ id: record.id }));
        window.open(url, '_blank');
    }

    $scope.openAccountLink = function (record) {
        var mainRecord = record;
        var record = mainRecord.record;
        var index = mainRecord.index;
        var url;
        if (record.SalesType == 'Sales Invoice' || record.SalesType == 'Credit Note') {
            url = $state.href("app.editCustomer", ({ id: record.account_id }));
        }
        else if (record.SalesType == 'Purchase Invoice' || record.SalesType == 'Debit Note') {
            url = $state.href("app.edit-supplier", ({ id: record.account_id }));
        }
        window.open(url, '_blank');
    }

    $scope.openSupplierLink = function (record) {
        var mainRecord = record;
        var record = mainRecord.record;
        var index = mainRecord.index;
        var url;
        url = $state.href("app.edit-supplier", ({ id: record.id }));
        window.open(url, '_blank');

    }

    $scope.openInventoryLink = function (record) {
        var mainRecord = record;
        var record = mainRecord.record;
        var index = mainRecord.index;
        var url;
        url = $state.href("app.edit-item", ({ id: record.id }));
        window.open(url, '_blank');

    }
    
    $scope.openInvoiceLink = function (record) {
        var mainRecord = record;
        var record = mainRecord.record;
        var index = mainRecord.index;
        var url;
        if (record.SalesType == 'Sales Quote') {
            url = $state.href("app.viewSaleQuote", ({ id: record.id }));
        }
        else if (record.SalesType == 'Sales Order') {
            url = $state.href("app.viewOrder", ({ id: record.id }));
        }
        else if (record.SalesType == 'Sales Invoice') {
            url = $state.href("app.viewOrder", ({ id: record.id, isInvoice: 1 }));
        }
        else if (record.SalesType == 'Credit Note') {
            url = $state.href("app.viewReturnOrder", ({ id: record.id }));
        }
        else if (record.SalesType == 'Purchase Invoice') {
            url = $state.href("app.viewsrminvoice", ({ id: record.id }));
        }
        else if (record.SalesType == 'Debit Note') {
            url = $state.href("app.viewsrmorderreturn", ({ id: record.id }));
        }
        window.open(url, '_blank');
    }

    $scope.openDocumentLink = function (record) {
        var mainRecord = record;
        var record = mainRecord.record;
        var index = mainRecord.index;
        var url;
        if (record.docType == 'Sales Invoice') {
            url = $state.href("app.viewOrder", ({ id: record.order_id, isInvoice: 1 }));
        }
        else if (record.docType == 'Credit Note Invoice') {
            url = $state.href("app.viewReturnOrder", ({ id: record.order_id, isInvoice: 1 }));
        }
        else if (record.docType == 'Purchase Invoice') {
            url = $state.href("app.viewsrmorder", ({ id: record.order_id }));
        }
        else if (record.docType == 'Purchase Order') {
            url = $state.href("app.viewsrmorder", ({ id: record.order_id }));
        }
        else if (record.docType == 'Debit Note') {
            url = $state.href("app.viewsrmorderreturn", ({ id: record.order_id }));
        }
        else if (record.docType == 'General Journal') {
            url = $state.href("app.view-receipt-journal-gl", ({ id: record.order_id, isInvoice: 1 }));
        }
        else if (record.docType == 'Customer Journal') {
            url = $state.href("app.view-receipt-journal-gl-cust", ({ id: record.order_id }));
        }
        else if (record.docType == 'Supplier Journal') {
            url = $state.href("app.view-receipt-journal-gl-supp", ({ id: record.order_id }));
        }
        else if (record.docType == 'Item Ledger') {
            url = $state.href("app.view-receipt-journal-gl-item", ({ id: record.order_id }));
        }
        else if (record.docType == 'Bank Opening Balance') {
            url = $state.href("app.openingBalances", ({ module: 'bank' }));
        }
        else if (record.docType == 'Stock Opening Balance') {
            url = $state.href("app.openingBalances", ({ module: 'bank' }));
        }
        else if (record.docType == 'Customer Opening Balance') {
            url = $state.href("app.viewReturnOrder", ({ module: 'customer' }));
        }
        else if (record.docType == 'Supplier Opening Balance') {
            url = $state.href("app.viewReturnOrder", ({ module: 'supplier' }));
        }
        else if (record.docType == 'Opening Balance') {
            url = $state.href("app.openingBalances", ({ module: 'general_ledger' }));
        }

        window.open(url, '_blank');

    }
}