myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.mail_test_design', {
                url: '/mail_test_design',
                title: 'mail_test_design',
                templateUrl: helper.basepath('mail_test_design.html')
            })
            .state('app.classifications', {
                url: '/classifications/:module',
                title: '  srm classification',
                templateUrl: helper.basepath('edit.html'),
                controller: 'EDITSRMCLASSFICATIONLIST'
            })
    }
]);

SetupController.$inject = ["$state", "$scope", "Upload", "$filter", "$resource", "$timeout", "ngTableDataService", "$http", "toaster", "$rootScope", "ngDialog"];
myApp.controller('SetupController', SetupController);
myApp.controller('EDITSRMCLASSFICATIONLIST', EDITSRMCLASSFICATIONLIST);

function SetupController($state, $scope, Upload, $filter, $resource, $timeout, ngDataService, $http, toaster, $rootScope, ngDialog) {
    'use strict';

    $scope.checkSetup = function () {
        var postUrl_ref_cat = $scope.$root.setup + "general/check-setUp";

        $http
            .post(postUrl_ref_cat, {
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {

                }
                else {

                }
            });
    }

    if ($state.current.name == "app.setup") {
        $scope.checkSetup();
    }


    $scope.GetShortCuts = function () {
        $scope.shortcuts = {};
        $scope.shortcuts.sale_quote = false;
        $scope.shortcuts.sale_order = false;
        $scope.shortcuts.customer = false;
        $scope.shortcuts.purchase_order = false;
        $scope.shortcuts.supplier = false;
        $scope.shortcuts.item = false;
        $scope.shortcuts.crm = false;
        $scope.shortcuts.srm = false;
        $scope.shortcuts.employee = false;
        $scope.shortcuts.holiday = false;
        $scope.shortcuts.expense = false;

        var postUrl_ref_cat = $scope.$root.setup + "general/get-shortcuts";

        $http
            .post(postUrl_ref_cat, {
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.shortcuts = res.data.response;
                    $scope.shortcuts.sale_quote = ($scope.shortcuts.sale_quote == 0) ? false : true;
                    $scope.shortcuts.sale_order = ($scope.shortcuts.sale_order == 0) ? false : true;
                    $scope.shortcuts.customer = ($scope.shortcuts.customer == 0) ? false : true;
                    $scope.shortcuts.purchase_order = ($scope.shortcuts.purchase_order == 0) ? false : true;
                    $scope.shortcuts.supplier = ($scope.shortcuts.supplier == 0) ? false : true;
                    $scope.shortcuts.item = ($scope.shortcuts.item == 0) ? false : true;
                    $scope.shortcuts.crm = ($scope.shortcuts.crm == 0) ? false : true;
                    $scope.shortcuts.srm = ($scope.shortcuts.srm == 0) ? false : true;
                    $scope.shortcuts.employee = ($scope.shortcuts.employee == 0) ? false : true;
                    $scope.shortcuts.holiday = ($scope.shortcuts.holiday == 0) ? false : true;
                    $scope.shortcuts.expense = ($scope.shortcuts.expense == 0) ? false : true;
                }
                else {
                    $scope.shortcuts.sale_quote = false;
                    $scope.shortcuts.sale_order = false;
                    $scope.shortcuts.customer = false;
                    $scope.shortcuts.purchase_order = false;
                    $scope.shortcuts.supplier = false;
                    $scope.shortcuts.item = false;
                    $scope.shortcuts.crm = false;
                    $scope.shortcuts.srm = false;
                    $scope.shortcuts.employee = false;
                    $scope.shortcuts.holiday = false;
                    $scope.shortcuts.expense = false;

                }
            });
    }
    if ($scope.shortcuts == undefined)
        $scope.GetShortCuts();

    $scope.SaveShortCuts = function (f) {

        console.log(f);
        var postUrl_ref_cat = $scope.$root.setup + "general/add-shortcuts";

        $http
            .post(postUrl_ref_cat, {
                'token': $scope.$root.token,
                shortcuts: $scope.shortcuts
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.GetShortCuts();
                }
            });
    }
    $scope.refreshGlobalData = function () {
        $rootScope.animateGlobal = true;

        $rootScope.get_global_data(1);
        $rootScope.getInventoryGlobalData(1);
        $rootScope.getInventorySetupGlobalData(1);
        $rootScope.getEmployeeGlobalData(1);
        $rootScope.getPOSOData(1); //Sales/Purchases/Credit Note/Debit Note
    }


    $scope.downloadpath = $rootScope.basePath + 'download/migrationSamples/';

    $scope.postUrl = '';
    $scope.sample = '';
    $scope.disableBtn = true;
    $scope.successBtn = false;
    $scope.failBtn = false;

    $scope.show_migrate_pop = function (arg) {
        // console.log(arg);
        $scope.disableBtn = true;

        $scope.file = {};
        $scope.file_data = {};

        $scope.title = arg;
        $scope.migrationName = arg;
        $scope.postUrl = $scope.$root.com + 'migration/import-migration';


        if (arg == 'Warehouses') {
            $scope.sample = $scope.downloadpath + 'Warehouses_Sample_Data.xlsx';
        }

        if (arg == 'warehouse-storage-location') {
            $scope.sample = $scope.downloadpath + 'Warehouses_Storage_Location_Sample_Data.xlsx';
        }

        if (arg == 'warehouse-storage-loc-add-cost') {
            $scope.sample = $scope.downloadpath + 'warehouse_storage_loc_add_cost.xlsx';
        }

        if (arg == 'GL_Accounts') {
            $scope.sample = $scope.downloadpath + 'GL_Accounts_Sample_Data.xlsx';
        }
        if (arg == 'Opening-Balances-Stock') {
            $scope.sample = $scope.downloadpath + 'Opening_Balances_Stock_Sample_Data.xlsx';
        }
        if (arg == 'Opening-Balances-Customer') {
            $scope.sample = $scope.downloadpath + 'Opening_Balances_Customer_Sample_Data.xlsx';
        }

        if (arg == 'Opening-Balances-Supplier') {
            $scope.sample = $scope.downloadpath + 'Opening_Balances_Supplier_Sample_Data.xlsx';
        }

        if (arg == 'Category') {
            $scope.sample = $scope.downloadpath + 'Categories_Sample_Data.xlsx';
        }
        if (arg == 'Brand') {
            $scope.sample = $scope.downloadpath + 'Brand_Sample_Data.xlsx';
        }
        if (arg == 'BrandCategory') {
            $scope.sample = $scope.downloadpath + 'brandCategory_Sample_Data.xlsx';
        }
        if (arg == 'Unit') {
            $scope.sample = $scope.downloadpath + 'unit.xlsx';
        }
        if (arg == 'Dimention') {
            $scope.sample = $scope.downloadpath + 'dimention.xlsx';
        }

        /* Item Module start*/

        if (arg == 'Item') {
            $scope.sample = $scope.downloadpath + 'Item_Sample_Data.xlsx';
        }

        if (arg == 'Item-Unit-of-Measure') {
            $scope.sample = $scope.downloadpath + 'Item_Unit_of_Meaure.xlsx';
        }

        if (arg == 'Item-Warehouse-Loc-Cost') {
            $scope.sample = $scope.downloadpath + 'Item_warehouse_loc_cost.xlsx';
        }

        if (arg == 'Item-Purchase-Cost') {
            $scope.sample = $scope.downloadpath + 'Item_Purchase_Cost_Sample_Data.xlsx';
        }

        if (arg == 'Item-Sales-Price') {
            $scope.sample = $scope.downloadpath + 'Item_Sale_Price_Sample_Data.xlsx';
        }

        if (arg == 'Item-Warehouse') {
            $scope.sample = $scope.downloadpath + 'Item_Warehouse_Sample_Data.xlsx';
        }

        if (arg == 'Item-Marginal-Analysis') {
            $scope.sample = $scope.downloadpath + 'Item_Marginal_Analysis_Sample_Data.xlsx';
        }

        /* Item Module end*/

        /* CRM Module start*/

        if (arg == 'CRM-General') {
            $scope.sample = $scope.downloadpath + 'CRM_General_Sample_Data.xlsx';
        }
        if (arg == 'CRM-Ownership-Type') {
            $scope.sample = $scope.downloadpath + 'CRM_Ownership_Type.xlsx';
        }
        if (arg == 'CRM-Segment') {
            $scope.sample = $scope.downloadpath + 'CRM_Segments.xlsx';
        }
        if (arg == 'CRM-Buying-Group') {
            $scope.sample = $scope.downloadpath + 'CRM_Buying_Group.xlsx';
        }
        if (arg == 'CRM-Region') {
            $scope.sample = $scope.downloadpath + 'CRM_Region.xlsx';
        }
        if (arg == 'CRM-Source') {
            $scope.sample = $scope.downloadpath + 'CRM_Source.xlsx';
        }
        if (arg == 'CRM-Classification') {
            $scope.sample = $scope.downloadpath + 'CRM_Classification.xlsx';
        }
        if (arg == 'CRM-Bucket') {
            $scope.sample = $scope.downloadpath + 'CRM_Bucket_Sample_Data.xlsx';
        }
        if (arg == 'CRM-Salepersons') {
            $scope.sample = $scope.downloadpath + 'CRM_Salepersons_Sample_Data.xlsx';
        }
        if (arg == 'CRM-Contact') {
            $scope.sample = $scope.downloadpath + 'CRM_Contact_Sample_Data.xlsx';
        }
        if (arg == 'CRM-Location') {
            $scope.sample = $scope.downloadpath + 'CRM_Location_Sample_Data.xlsx';
        }
        if (arg == 'CRM-Contact-Location-Mapping') {
            $scope.sample = $scope.downloadpath + 'CRM_Location_Mapping_Sample_Data.xlsx';
        }
        if (arg == 'CRM-Social-Media') {
            $scope.sample = $scope.downloadpath + 'CRM_Socialmedia.xlsx';
        }
        if (arg == 'CRM-Competitors') {
            $scope.sample = $scope.downloadpath + 'CRM_Competitors.xlsx';
        }
        if (arg == 'CRM-Price-Offer') {
            $scope.sample = $scope.downloadpath + 'CRM_Price_Offer_Sample_Data.xlsx';
        }
        if (arg == 'CRM-Promotion') {
            $scope.sample = $scope.downloadpath + 'CRM_Promotion.xlsx';
        }
        if (arg == 'CRM-Notes') {
            $scope.sample = $scope.downloadpath + 'CRM_Notes_Sample_Data.xlsx';
        }

        /* CRM Module end*/

        /* Customer Module start*/

        if (arg == 'Customer-General') {
            $scope.sample = $scope.downloadpath + 'Customer_General_Sample_Data.xlsx';
        }
        if (arg == 'Customer-Bucket') {
            $scope.sample = $scope.downloadpath + 'Customer_Bucket_Sample_Data.xlsx';
        }
        if (arg == 'Customer-Salepersons') {
            $scope.sample = $scope.downloadpath + 'Customer_Salesperson_Sample_Data.xlsx';
        }
        if (arg == 'Customer-Ownership-Type') {
            $scope.sample = $scope.downloadpath + 'Customer_Ownership_Type.xlsx';
        }
        if (arg == 'Customer-Segment') {
            $scope.sample = $scope.downloadpath + 'Customer_segment.xlsx';
        }
        if (arg == 'Customer-Buying-Group') {
            $scope.sample = $scope.downloadpath + 'Customer_Buying_Group.xlsx';
        }
        if (arg == 'Customer-Region') {
            $scope.sample = $scope.downloadpath + 'Customer_Region.xlsx';
        }
        if (arg == 'Customer-Notes') {
            $scope.sample = $scope.downloadpath + 'Customer_Notes_Sample_Data.xlsx';
        }
        if (arg == 'Payable-bank') {
            $scope.sample = $scope.downloadpath + 'Payable_bank.xlsx';
        }
        if (arg == 'Payment-Terms') {
            $scope.sample = $scope.downloadpath + 'Payment_Terms.xlsx';
        }
        if (arg == 'Payment-Method') {
            $scope.sample = $scope.downloadpath + 'Payment_Method.xlsx';
        }
        if (arg == 'Finance-Charges') {
            $scope.sample = $scope.downloadpath + 'Finance_Charges.xlsx';
        }
        if (arg == 'Insurance-Charges') {
            $scope.sample = $scope.downloadpath + 'Insurance_Charges.xlsx';
        }
        if (arg == 'VAT-Bussiness-Group') {
            $scope.sample = $scope.downloadpath + 'VAT_Bussiness_Groups.xlsx';
        }
        if (arg == 'Customer-Group') {
            $scope.sample = $scope.downloadpath + 'Customer_Group.xlsx';
        }
        if (arg == 'Customer-Finance') {
            $scope.sample = $scope.downloadpath + 'Customer_Finance_Sample_Data.xlsx';
        }
        if (arg == 'Customer-Contact-Location-Mapping') {
            $scope.sample = $scope.downloadpath + 'Customer_Contact_Location_Mapping_Sample_Data.xlsx';
        }
        if (arg == 'Customer-Contact') {
            $scope.sample = $scope.downloadpath + 'Customer_Contact_Sample_Data.xlsx';
        }
        if (arg == 'Customer-Location') {
            $scope.sample = $scope.downloadpath + 'Customer_Location_Sample_Data.xlsx';
        }
        if (arg == 'Customer-Social-Media') {
            $scope.sample = $scope.downloadpath + 'Customer_Socialmedia.xlsx';
        }
        if (arg == 'Customer-Competitors') {
            $scope.sample = $scope.downloadpath + 'Customer_Competitors.xlsx';
        }
        if (arg == 'Customer-Promotion') {
            $scope.sample = $scope.downloadpath + 'Customer_Promotion.xlsx';
        }
        /* Customer Module end*/

        /* Orders Module start*/

        if (arg == 'Sales-Orders') {
            $scope.sample = $scope.downloadpath + 'Sales_Order_Sample_Data.xlsx';
        }
        if (arg == 'Sales-Orders-Detail') {
            $scope.sample = $scope.downloadpath + 'Sales-Orders-Detail_Sample_Data.xlsx';
        }
        if (arg == 'Sales-Quotes-Items') {
            $scope.sample = $scope.downloadpath + 'Sales-Quotes-Items_Sample_Data.xlsx';
        }
        if (arg == 'Sales-Orders-Items') {
            $scope.sample = $scope.downloadpath + 'Sales-Orders-Items_Sample_Data.xlsx';
        }
        if (arg == 'Purchase-Orders-Items') {
            $scope.sample = $scope.downloadpath + 'Purchase-Orders-Items_Sample_Data.xlsx';
        }
        if (arg == 'Purchase-Order-Items-Stock-Allocation') {
            $scope.sample = $scope.downloadpath + 'Purchase-Order-Items-Stock-Allocation_Sample_Data.xlsx';
        }
        if (arg == 'Purchase-Orders') {
            $scope.sample = $scope.downloadpath + 'Purchase_Order_Sample_Data.xlsx';
        }
        if (arg == 'Purchase-Order-Detail') {
            $scope.sample = $scope.downloadpath + 'Purchase_Order_Detail_Sample_Data.xlsx';
        }
        if (arg == 'Purchase-Order-Stock-Allocation') {
            $scope.sample = $scope.downloadpath + 'Purchase_Order_Stock_Allocation_Sample_Data.xlsx';
        }
        if (arg == 'Sales-Order-Stock-Allocation') {
            $scope.sample = $scope.downloadpath + 'Sales_Order_Stock_Allocation_Sample_Data.xlsx';
        }

        /* Orders Module end*/

        /* SRM Module start*/
        if (arg == 'SRM-General') {
            $scope.sample = $scope.downloadpath + 'SRM_General_Sample_Data.xlsx';
        }
        if (arg == 'SRM-Segment') {
            $scope.sample = $scope.downloadpath + 'SRM_Segments.xlsx';
        }
        if (arg == 'SRM-Contact') {
            $scope.sample = $scope.downloadpath + 'SRM_Contacts_Sample_Data.xlsx';
        }
        if (arg == 'SRM-Location') {
            $scope.sample = $scope.downloadpath + 'SRM_Location_Sample_Data.xlsx';
        }
        if (arg == 'SRM-Social-Media') {
            $scope.sample = $scope.downloadpath + 'SRM_Socialmedia.xlsx';
        }
        /* SRM Module end*/


        /* Supplier Module start*/
        if (arg == 'Supplier-General') {
            $scope.sample = $scope.downloadpath + 'Supplier_General_Sample_Data.xlsx';
        }
        if (arg == 'Supplier-Purchaser') {
            $scope.sample = $scope.downloadpath + 'Supplier_Purchaser_Sample_Data.xlsx';
        }
        if (arg == 'Supplier-Segment') {
            $scope.sample = $scope.downloadpath + 'Supplier_segment.xlsx';
        }
        if (arg == 'Rebate') {
            $scope.sample = $scope.downloadpath + 'Rebate.xlsx';
        }
        if (arg == 'Supplier-Finance') {
            $scope.sample = $scope.downloadpath + 'Supplier_Finance_Sample_Data.xlsx';
        }
        if (arg == 'Supplier-Contact') {
            $scope.sample = $scope.downloadpath + 'Supplier_Contact_Sample_Data.xlsx';
        }
        if (arg == 'Supplier-Location') {
            $scope.sample = $scope.downloadpath + 'Supplier_Location_Sample_Data.xlsx';
        }
        if (arg == 'Supplier-Contact-Location-Mapping') {
            $scope.sample = $scope.downloadpath + 'Supplier_Contact_Location_Mapping_Sample_Data.xlsx';
        }
        if (arg == 'Supplier-Social-Media') {
            $scope.sample = $scope.downloadpath + 'Supplier_Socialmedia.xlsx';
        }
        /* Supplier Module end*/

        if (arg == 'Department') {
            $scope.sample = $scope.downloadpath + 'department.xlsx';
        }

        if (arg == 'Employee_type') {
            $scope.sample = $scope.downloadpath + 'emplyeetype.xlsx';
        }

        if (arg == 'Religion') {
            $scope.sample = $scope.downloadpath + 'religion.xlsx';
        }

        if (arg == 'HR') {
            $scope.sample = $scope.downloadpath + 'hr.xlsx';
        }

        /* Targets Start */
        if (arg == 'Sales-Target') {
            $scope.sample = $scope.downloadpath + 'hr.xlsx';
        }

        /* Targets End */

        // $scope.$root.$broadcast("change", $scope.postUrl, $scope.sample);

        $scope.sampledownload = $scope.sample;
        $scope.errorfiledownload = 0;
        $scope.errorLog = 0;

        angular.element('#model_file_migration' + ($scope.uploadModalId ? $scope.uploadModalId : "")).modal({
            show: true
        });
    }

    $scope.categories_list = [];

    $scope.chartofAccountsViewMode = false;

    $scope.chartofAccountsgotoEditMode = function () {
        $scope.chartofAccountsViewMode = false;
    }

    /* $scope.show_glcodes_popup = function () {

        $scope.enable_glcodes_form = 0;
        $scope.categories_list = [];
        $scope.formFields = {};
        $scope.company_gl_accounts_exist = false;
        $scope.chartofAccountsViewMode = true;
        $scope.chartofAccountsSetUp = false;
        
        $scope.title = "Chart of Accounts ";

        var postUrl_chart_account = $scope.$root.gl + "chart-accounts/check-for-chart-account";

        $http
            .post(postUrl_chart_account, {
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.chartofAccountsSetUp = true;
                } else
                    $scope.chartofAccountsSetUp = false;
            }).catch(function (message) {
                $scope.showLoader = false;
                throw new Error(message.data);
            });

        var postUrl_ref_cat = $scope.$root.gl + "chart-accounts/get-all-ref-cat-list";

        $http
            .post(postUrl_ref_cat, {
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.categories_list = res.data.response;

                    if (res.data.total_company_gl_accounts > 0)
                        $scope.company_gl_accounts_exist = true;

                    angular.element('#glcodes_model').modal({
                        show: true
                    });
                } else
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            }).catch(function (message) {
                $scope.showLoader = false;
                throw new Error(message.data);
            });
    } */

    $scope.enable_glcodes_form = 0;

    $scope.open_glcodes_form = function () {
        $scope.enable_glcodes_form = 1;
    }

    /* $scope.close_glcodes_form = function () {
        $scope.enable_glcodes_form = 0;
    } */

    /* $scope.import_glcodes = function () {

        $scope.showLoader = true;
        var duplicateRefGlAccount = $scope.$root.gl + "chart-accounts/upload-default-gl-accounts";

        $http
            .post(duplicateRefGlAccount, {
                'token': $scope.$root.token,
                'inventorySetup': $scope.$root.inventorySetup
            })
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {
                    $scope.categories_list = [];
                    $scope.categories_list = res.data.response;

                    if (res.data.total_company_gl_accounts > 0)
                        $scope.company_gl_accounts_exist = true;
                    toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(633));
                } else
                    toaster.pop('error', 'Error', res.data.error);
            }).catch(function (message) {
                $scope.showLoader = false;
                throw new Error(message.data);
            });
    } */

    /* $scope.add_gl_code = function () {

        var add_new_cat_list = $scope.$root.gl + "chart-accounts/add-new-cat-list";
        $scope.showLoader = true;

        $http
            .post(add_new_cat_list, {
                'token': $scope.$root.token,
                'newcategories_list': $scope.categories_list
            })
            .then(function (res) {

                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.chartofAccountsViewMode = true;

                    $scope.categories_list = [];
                    $scope.categories_list = res.data.response;

                    if (res.data.total_company_gl_accounts > 0)
                        $scope.company_gl_accounts_exist = true;

                    toaster.pop('success', 'Info', res.data.msg);
                } else
                    toaster.pop('error', 'Error', res.data.error);

            }).catch(function (message) {
                $scope.showLoader = false;
            });

        angular.element('#glcodes_model').modal({
            show: false
        });
    } */

    /*   ============================== */
    /*   Select Inventory Setup Start   */
    /*   ============================== */

    /* $scope.inventoryCatType = [{ 'name': 'Perpetual Inventory System', 'id': 1 }, { 'name': 'Periodic Inventory System', 'id': 2 }];

    $scope.changeInventorySetupType = function (cattype) {

        // console.log(cattype);
        var postUrl_cat = $scope.$root.gl + "chart-accounts/change-inventory-setup-type";

        $scope.postData.token = $scope.$root.token;
        $scope.postData.cattype = (cattype !== undefined && cattype != '') ? cattype.id : 0;

        ngDialog.openConfirm({
            template: 'modalConfirmInventorySetupDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(postUrl_cat, $scope.postData)
                .then(function (res) {
                    $scope.showLoader = false;

                    if (res.data.ack == true) {
                        $rootScope.inventorySetupSystemType = $scope.postData.cattype;
                        $rootScope.inventorySetup = $scope.postData.cattype;
                        $scope.vat_sales_type = $scope.postData.cattype;
                        toaster.pop('success', 'Info', 'Record is updated');
                    }
                    else {
                        toaster.pop('error', 'Info', res.data.error);
                    }

                }).catch(function (message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    } */

    /*   ============================== */
    /*   Select Inventory Setup End     */
    /*   ============================== */

    $scope.file = {};
    $scope.file_data = {};
    $scope.postUrl = '';
    $scope.sampledownload = '';
    $scope.errorfiledownload = "";

    $scope.uploadFiles_xl = function (file, errFiles) {

        if (file && file.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(653));

            return;
        }
        $scope.file_data = {};

        $scope.errFile = errFiles && errFiles[0];
        $scope.file_data = file;

        $scope.disableBtn = false;
    }
    $scope.add_migration = function () {

        $scope.showLoader = true;
        $scope.disableBtn = true;

        if ($scope.file_data) {

            $scope.file_data.migrationName = $scope.migrationName;

            var tempData = {
                'file': $scope.file_data,
                'migrationName': $scope.migrationName,
                'image_token': $scope.$root.token
            };

            if ($scope.callbackBeforeMigration)
                tempData = $scope.callbackBeforeMigration(tempData);

            $scope.file_data.upload = Upload.upload({
                'url': $scope.postUrl,
                data: tempData
            });


            $scope.file_data.upload.then(function (response) {
                $timeout(function () {
                    $scope.errorLog = [];

                    for (i = 0; i < response.data.length; i++) {
                        $scope.errorLog.push(response.data[i]);
                    }

                    if (response.data.ack == true) {
                        $scope.disableBtn = true;
                        $scope.successBtn = true;
                        $scope.showLoader = false;
                        toaster.pop('success', 'Info', response.data.error);
                        $scope.file_data = {};
                        if ($scope.callbackAfterMigration)
                            $scope.callbackAfterMigration();
                    }

                    if (response.data.ack == false) {

                        $scope.disableBtn = false;
                        $scope.showLoader = false;
                        $scope.successBtn = false;
                        $scope.failBtn = true;

                        $scope.errorfiledownload = response.data.link;
                        $scope.errorLog = response.data.errorLogFile;
                        $scope.SqlErrorChk = response.data.SqlErrorChk;

                        if ($scope.SqlErrorChk == 1) {
                            toaster.pop('error', 'Info', response.data.SqlError);
                        } else {
                            toaster.pop('error', 'Info', response.data.error);
                        }
                        $scope.file_data = {};
                    } else {
                        $scope.errorfiledownload = "";
                        $scope.showLoader = false;
                        $scope.disableBtn = false;
                    }
                });
            },
                function (response) {
                    console.log("hey");
                    console.log(response);
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;

                    $scope.showLoader = false;
                    $scope.disableBtn = false;
                },
                function (evt) {
                    $scope.file_data.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
        }

    }

    // ---------------------------------------------------------------
    //			Financial Accounts Settings Tab
    //----------------------------------------------------------------

    $scope.check_readonly = true;

    $scope.gotoEdit = function (arg) {
        $scope.check_readonly = false;
    }

    $scope.accordion1 = "in";
    $scope.accordion2 = "";

    $scope.openaccordion = function () {

        if ($scope.accordion1 == "in") {
            $scope.accordion1 = "";
            $scope.accordion2 = "in";
        } else {
            $scope.accordion1 = "in";
            $scope.accordion2 = "";
        }
    }

    $scope.getGL_account_code = function (arg, inventory_type) {

        $scope.searchKeyword2 = {};
        var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";

        $scope.postData = {};
        $scope.postData.cat_id = [];

        if (arg == 'sales_gl_ac_uk_debators') {
            $scope.type_id = 1;
            $scope.title = 'Inventory Accounts System';
            $scope.sub_title = 'Debtors Account for UK';
            $scope.postData.cat_id = [3];
        } else if (arg == 'sales_gl_ac_eu_debators') {
            $scope.type_id = 2;
            $scope.title = 'Inventory Accounts System';
            $scope.sub_title = 'Debtors Account for EU';
            $scope.postData.cat_id = [3];
        } else if (arg == 'sales_gl_ac_eu_out_debators') {
            $scope.type_id = 3;
            $scope.title = 'Inventory Accounts System';
            $scope.sub_title = 'Debtors Account for Outside EU';
            $scope.postData.cat_id = [3];
        } else if (arg == 'sales_gl_ac_uk_sales') {
            $scope.type_id = 4;
            $scope.title = 'Inventory Accounts System';
            $scope.sub_title = 'Sales Account for UK';
            $scope.postData.cat_id = [7];
        } else if (arg == 'sales_gl_ac_eu_sales') {
            $scope.type_id = 5;
            $scope.title = 'Inventory Accounts System';
            $scope.sub_title = 'Sales Account for EU';
            $scope.postData.cat_id = [7];
        } else if (arg == 'sales_gl_ac_eu_out_sales') {
            $scope.type_id = 6;
            $scope.title = 'Inventory Accounts System';
            $scope.sub_title = 'Sales Account for Outside EU';
            $scope.postData.cat_id = [7];
        } else if (arg == 'sales_gl_ac_uk_sales_vat') {
            $scope.type_id = 7;
            $scope.title = 'Inventory Accounts System';
            $scope.sub_title = 'Sales VAT Account for UK';
            $scope.postData.cat_id = [8];
        } else if (arg == 'sales_gl_ac_eu_sales_vat') {
            $scope.type_id = 8;
            $scope.title = 'Inventory Accounts System';
            $scope.sub_title = 'Sales VAT Account for EU';
            $scope.postData.cat_id = [8];
        } else if (arg == 'sales_gl_ac_eu_out_sales_vat') {
            $scope.type_id = 9;
            $scope.title = 'Inventory Accounts System';
            $scope.sub_title = 'Sales VAT Account for Outside EU';
            $scope.postData.cat_id = [8];
        } else if (arg == 'Purchase_gl_ac_uk_creditors') {
            $scope.type_id = 10;
            $scope.title = 'Purchase Invoice & Debit Note';
            $scope.sub_title = 'Creditors Account for UK';
            $scope.postData.cat_id = [4];
        } else if (arg == 'Purchase_gl_ac_eu_creditors') {
            $scope.type_id = 11;
            $scope.title = 'Purchase Invoice & Debit Note';
            $scope.sub_title = 'Creditors Account for EU';
            $scope.postData.cat_id = [4];
        } else if (arg == 'Purchase_gl_ac_eu_out_creditors') {
            $scope.type_id = 12;
            $scope.title = 'Purchase Invoice & Debit Note';
            $scope.sub_title = 'Creditors Account for Outside EU';
            $scope.postData.cat_id = [4];
        } else if (arg == 'Purchase_gl_ac_uk_purch') {
            $scope.type_id = 13;
            $scope.title = 'Purchase Invoice & Debit Note';
            $scope.sub_title = 'Purchases Account for UK';

            if (inventory_type == 2)
                $scope.postData.cat_id = [3];
            else
                $scope.postData.cat_id = [12];
        } else if (arg == 'Purchase_gl_ac_eu_purch') {
            $scope.type_id = 14;
            $scope.title = 'Purchase Invoice & Debit Note';
            $scope.sub_title = 'Purchases Account for EU';

            if (inventory_type == 2)
                $scope.postData.cat_id = [3];
            else
                $scope.postData.cat_id = [12];
        } else if (arg == 'Purchase_gl_ac_eu_out_purch') {
            $scope.type_id = 15;
            $scope.title = 'Purchase Invoice & Debit Note';
            $scope.sub_title = 'Purchases Account for Outside EU';

            if (inventory_type == 2)
                $scope.postData.cat_id = [3];
            else
                $scope.postData.cat_id = [12];
        } else if (arg == 'Purchase_gl_ac_uk_purch_vat') {
            $scope.type_id = 16;
            $scope.title = 'Purchase Invoice & Debit Note';
            $scope.sub_title = 'Purchase VAT Account for UK';
            $scope.postData.cat_id = [8];
        } else if (arg == 'Purchase_gl_ac_eu_purch_vat') {
            $scope.type_id = 17;
            $scope.title = 'Purchase Invoice & Debit Note';
            $scope.sub_title = 'Purchase VAT Account for EU';
            $scope.postData.cat_id = [8];
        } else if (arg == 'Purchase_gl_ac_eu_out_purch_vat') {
            $scope.type_id = 18;
            $scope.title = 'Purchase Invoice & Debit Note';
            $scope.sub_title = 'Purchase VAT Account for Outside EU';
            $scope.postData.cat_id = [8];
        } else if (arg == 'vat_lieability_receve_gl_account') {
            $scope.type_id = 19;
            $scope.title = 'VAT Liability / Receivable';
            $scope.sub_title = '';
            $scope.postData.cat_id = [8];
        } else if (arg == 'sales_gl_ac_uk_stock') {
            $scope.type_id = 20;
            $scope.title = 'Inventory Accounts System';
            $scope.sub_title = 'Sales Stock Account for UK';
            $scope.postData.cat_id = [3];
        } else if (arg == 'sales_gl_ac_eu_stock') {
            $scope.type_id = 21;
            $scope.title = 'Inventory Accounts System';
            $scope.sub_title = 'Sales Stock Account for EU';
            $scope.postData.cat_id = [3];
        } else if (arg == 'sales_gl_ac_eu_out_stock') {
            $scope.type_id = 22;
            $scope.title = 'Inventory Accounts System';
            $scope.sub_title = 'Sales Stock Account for Outside EU';
            $scope.postData.cat_id = [3];
        } else if (arg == 'sales_gl_ac_uk_cost_of_goods_sold') {
            $scope.type_id = 23;
            $scope.title = 'Inventory Accounts System';
            $scope.sub_title = 'Cost of Goods Sold Account for UK';
            $scope.postData.cat_id = [12];
        } else if (arg == 'sales_gl_ac_eu_cost_of_goods_sold') {
            $scope.type_id = 24;
            $scope.title = 'Inventory Accounts System';
            $scope.sub_title = 'Cost of Goods Sold Account for EU';
            $scope.postData.cat_id = [12];
        } else if (arg == 'sales_gl_ac_eu_out_cost_of_goods_sold') {
            $scope.type_id = 25;
            $scope.title = 'Inventory Accounts System';
            $scope.sub_title = 'Cost of Goods Sold Account for Outside EU';
            $scope.postData.cat_id = [12];
        } else if (arg == 'realised_movement_gl_ac') {
            $scope.type_id = 26;
            $scope.title = 'Select G/L Account(s) for Foreign Currency Movement';
            $scope.sub_title = '';
            $scope.postData.cat_id = [14];
        } else if (arg == 'unrealised_movement_gl_ac') {
            $scope.type_id = 27;
            $scope.title = 'Select G/L Account(s) for Foreign Currency Movement';
            $scope.sub_title = '';
            $scope.postData.cat_id = [14];
        } else if (arg == 'discount_gl_ac') {
            $scope.type_id = 28;
            $scope.title = 'G/L Account(s) Setup for Discounts';
            $scope.sub_title = '';
            $scope.postData.cat_id = [7];
        } else if (arg == 'promotion_gl_ac') {
            $scope.type_id = 29;
            $scope.title = 'G/L Account(s) Setup for Promotions';
            $scope.sub_title = '';
            $scope.postData.cat_id = [7];
        }

        $scope.postData.token = $scope.$root.token;
        $scope.showLoader = true;

        $http
            .post(postUrl_cat, $scope.postData)
            .then(function (res) {
                $scope.gl_account = [];

                if (res.data.ack == true) {

                    $scope.gl_arg = arg;
                    $scope.gl_account_type_for = $scope.type_id;

                    $.each(res.data.response, function (index, obj) {
                        $scope.gl_account[index] = obj;
                    });
                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

                $scope.showLoader = false;
                angular.element('#finance_set_gl_account').modal({
                    show: true
                });
            }).catch(function (message) {
                $scope.showLoader = false;
                throw new Error(message.data);
            });
    }

    $scope.assignCodes = function (gl_data) {

        if ($scope.type_id == 1) {

            $scope.finance.sales_gl_ac_uk_debators_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.sales_gl_ac_uk_debators = gl_data.id;

        } else if ($scope.type_id == 2) {

            $scope.finance.sales_gl_ac_eu_debators_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.sales_gl_ac_eu_debators = gl_data.id;

        } else if ($scope.type_id == 3) {

            $scope.finance.sales_gl_ac_eu_out_debators_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.sales_gl_ac_eu_out_debators = gl_data.id;

        } else if ($scope.type_id == 4) {

            $scope.finance.sales_gl_ac_uk_sales_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.sales_gl_ac_uk_sales = gl_data.id;

        } else if ($scope.type_id == 5) {

            $scope.finance.sales_gl_ac_eu_sales_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.sales_gl_ac_eu_sales = gl_data.id;

        } else if ($scope.type_id == 6) {

            $scope.finance.sales_gl_ac_eu_out_sales_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.sales_gl_ac_eu_out_sales = gl_data.id;

        } else if ($scope.type_id == 7) {

            $scope.finance.sales_gl_ac_uk_sales_vat_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.sales_gl_ac_uk_sales_vat = gl_data.id;

        } else if ($scope.type_id == 8) {

            $scope.finance.sales_gl_ac_eu_sales_vat_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.sales_gl_ac_eu_sales_vat = gl_data.id;

        } else if ($scope.type_id == 9) {

            $scope.finance.sales_gl_ac_eu_out_sales_vat_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.sales_gl_ac_eu_out_sales_vat = gl_data.id;

        } else if ($scope.type_id == 10) {

            $scope.finance.Purchase_gl_ac_uk_creditors_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.Purchase_gl_ac_uk_creditors = gl_data.id;

        } else if ($scope.type_id == 11) {

            $scope.finance.Purchase_gl_ac_eu_creditors_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.Purchase_gl_ac_eu_creditors = gl_data.id;

        } else if ($scope.type_id == 12) {

            $scope.finance.Purchase_gl_ac_eu_out_creditors_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.Purchase_gl_ac_eu_out_creditors = gl_data.id;

        } else if ($scope.type_id == 13) {

            $scope.finance.Purchase_gl_ac_uk_purch_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.Purchase_gl_ac_uk_purch = gl_data.id;

        } else if ($scope.type_id == 14) {

            $scope.finance.Purchase_gl_ac_eu_purch_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.Purchase_gl_ac_eu_purch = gl_data.id;

        } else if ($scope.type_id == 15) {

            $scope.finance.Purchase_gl_ac_eu_out_purch_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.Purchase_gl_ac_eu_out_purch = gl_data.id;

        } else if ($scope.type_id == 16) {

            $scope.finance.Purchase_gl_ac_uk_purch_vat_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.Purchase_gl_ac_uk_purch_vat = gl_data.id;

        } else if ($scope.type_id == 17) {

            $scope.finance.Purchase_gl_ac_eu_purch_vat_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.Purchase_gl_ac_eu_purch_vat = gl_data.id;

        } else if ($scope.type_id == 18) {

            $scope.finance.Purchase_gl_ac_eu_out_purch_vat_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.Purchase_gl_ac_eu_out_purch_vat = gl_data.id;

        } else if ($scope.type_id == 19) {

            $scope.finance.vat_lieability_receve_gl_account_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.vat_lieability_receve_gl_account = gl_data.id;

        } else if ($scope.type_id == 20) {

            $scope.finance.sales_gl_ac_uk_stock_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.sales_gl_ac_uk_stock = gl_data.id;

        } else if ($scope.type_id == 21) {

            $scope.finance.sales_gl_ac_eu_stock_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.sales_gl_ac_eu_stock = gl_data.id;

        } else if ($scope.type_id == 22) {

            $scope.finance.sales_gl_ac_eu_out_stock_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.sales_gl_ac_eu_out_stock = gl_data.id;

        } else if ($scope.type_id == 23) {

            $scope.finance.sales_gl_ac_uk_cost_of_goods_sold_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.sales_gl_ac_uk_cost_of_goods_sold = gl_data.id;

        } else if ($scope.type_id == 24) {

            $scope.finance.sales_gl_ac_eu_cost_of_goods_sold_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.sales_gl_ac_eu_cost_of_goods_sold = gl_data.id;

        } else if ($scope.type_id == 25) {

            $scope.finance.sales_gl_ac_eu_out_cost_of_goods_sold_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.sales_gl_ac_eu_out_cost_of_goods_sold = gl_data.id;

        } else if ($scope.type_id == 26) {

            $scope.finance.realised_movement_gl_ac_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.realised_movement_gl_ac = gl_data.id;

        } else if ($scope.type_id == 27) {

            $scope.finance.unrealised_movement_gl_ac_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.unrealised_movement_gl_ac = gl_data.id;

        } else if ($scope.type_id == 28) {

            $scope.finance.discount_gl_ac_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.discount_gl_ac = gl_data.id;

        } else if ($scope.type_id == 29) {

            $scope.finance.promotion_gl_ac_code = gl_data.code + " - " + gl_data.name;
            $scope.finance.promotion_gl_ac = gl_data.id;
        }

        angular.element('#finance_set_gl_account').modal('hide');
    }

    var getfinanceUrl = $scope.$root.setup + "general/get-financial-setting";
    var updatefinance = $scope.$root.setup + "general/update-financial-setting";

    $scope.addFinancialSetting = function (finance) {

        finance.token = $scope.$root.token;

        if (finance.id == undefined) {
            updatefinance = $scope.$root.setup + "general/add-financial-setting";
            finance.company_id = $scope.$root.defaultCompany;
        }

        if ($scope.accordion1 == "in") finance.vat_sales_type = 0;
        else finance.vat_sales_type = 1;

        $http
            .post(updatefinance, finance)
            .then(function (res) {

                if (res.data.ack == true) {
                    $scope.showLoader = false;
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                } else
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
            }).catch(function (message) {
                $scope.showLoader = false;
                throw new Error(message.data);
            });
    }

    $scope.addFinancial_exchange_rate = function (finance) {

        finance.token = $scope.$root.token;
        finance.company_id = $scope.$root.defaultCompany;

        var updatefinance_exchange = $scope.$root.setup + "general/update-financial-exchange-rate";

        $http
            .post(updatefinance_exchange, finance)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.showLoader = false;
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                } else {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                }
            }).catch(function (message) {
                $scope.showLoader = false;
                throw new Error(message.data);
            });
    }

    $scope.postData = {
        'token': $scope.$root.token,
        'id': $scope.$root.defaultCompany
    };

    $http
        .post(getfinanceUrl, $scope.postData)
        .then(function (res) {
            if (res.data.response != null) {
                $scope.finance = res.data.response;

                if (res.data.response.vat_sales_type == 0) {

                    $scope.accordion1 = "in";
                    $scope.accordion2 = "";

                } else {

                    $scope.accordion2 = "in";
                    $scope.accordion1 = "";
                }
            }
        }).catch(function (message) {
            $scope.showLoader = false;
            throw new Error(message.data);
        });


    $scope.vat_scheme_not_registered = false;


    $scope.getCompanyVatScheme = function () {
        var chk_company_vat_scheme_Url = $scope.$root.setup + "general/chk-company-vat-scheme";

        $http
            .post(chk_company_vat_scheme_Url, {
                'token': $scope.$root.token
            })
            .then(function (res) {

                if (res.data.ack == true && res.data.vat_scheme == 2)
                    $scope.vat_scheme_not_registered = true;
                else
                    $scope.vat_scheme_not_registered = false;

            }).catch(function (message) {
                $scope.showLoader = false;
                throw new Error(message.data);
            });

    }

    $scope.getCompanyVatScheme();

    $scope.add_new_ref_posting_group_id = function () { }

    $scope.addNewChoice = function (item) {

        var newItemNo = $scope.post_group_arr.length + 1;
        $scope.post_group_arr.push({
            'id': '' + newItemNo
        });
    }

    $scope.remove_choice = function (item, index1) {
        $scope.post_group_arr.splice(index1, 1); //lastItem
    }

    $scope.delete_add_posting_vat = function (id, index, arr_data_ret) {

        var delUrl = $scope.$root.setup + "crm/delete-posting-vat";

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    id: id,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        arr_data_ret.splice(index, 1);
                    } else toaster.pop('error', 'Info', 'Record cannot be Deleted.');

                }).catch(function (message) {
                    $scope.showLoader = false;
                    throw new Error(message.data);
                });
        },
            function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
    }


    // ----------------------- APPROVALS --------------------------//

    $scope.getApprovals = function () {
        console.log('hello');
        $scope.approval = {};
        var Api = $scope.$root.setup + "general/get-approvals";
        $http
            .post(Api, {
                'token': $scope.$root.token
            })
            .then(function (res) {
                // console.log('el');
                if (res.data.ack == 1)
                    $scope.approval = res.data.response.approvals;
                else {
                    $scope.approval.selected_emps_type_1 = [];
                    $scope.approval.selected_emps_type_2 = [];
                    $scope.approval.selected_emps_type_3 = [];
                    $scope.approval.selected_emps_type_4 = [];
                    $scope.approval.selected_emps_type_5 = [];
                    $scope.approval.selected_emps_type_6 = [];
                    $scope.approval.selected_emps_type_7 = [];
                }
                if (res.data.ack != undefined)
                    $scope.emp_list = res.data.response.employees;
            });
    }
    $scope.getEmployeeList = function (type) {
        console.log($scope.emp_list);
        $scope.selected_type = type;

        if (type == 1) {
            angular.forEach($scope.emp_list, function (obj) {
                var emp = $filter("filter")($scope.approval.selected_emps_type_1, { id: obj.id });
                if (emp.length > 0)
                    obj.chk = true;
                else
                    obj.chk = false;
            });
        }
        else if (type == 2) {
            angular.forEach($scope.emp_list, function (obj) {
                var emp = $filter("filter")($scope.approval.selected_emps_type_2, { id: obj.id });
                if (emp.length > 0)
                    obj.chk = true;
                else
                    obj.chk = false;
            });
        }
        else if (type == 3) {
            angular.forEach($scope.emp_list, function (obj) {
                var emp = $filter("filter")($scope.approval.selected_emps_type_3, { id: obj.id });
                if (emp.length > 0)
                    obj.chk = true;
                else
                    obj.chk = false;
            });
        }
        else if (type == 4) {
            angular.forEach($scope.emp_list, function (obj) {
                var emp = $filter("filter")($scope.approval.selected_emps_type_4, { id: obj.id });
                if (emp.length > 0)
                    obj.chk = true;
                else
                    obj.chk = false;
            });
        }
        else if (type == 5) {
            angular.forEach($scope.emp_list, function (obj) {
                var emp = $filter("filter")($scope.approval.selected_emps_type_5, { id: obj.id });
                if (emp.length > 0)
                    obj.chk = true;
                else
                    obj.chk = false;
            });
        }
        else if (type == 6) {
            angular.forEach($scope.emp_list, function (obj) {
                var emp = $filter("filter")($scope.approval.selected_emps_type_6, { id: obj.id });
                if (emp.length > 0)
                    obj.chk = true;
                else
                    obj.chk = false;
            });
        }
        else if (type == 7) {
            angular.forEach($scope.emp_list, function (obj) {
                var emp = $filter("filter")($scope.approval.selected_emps_type_7, { id: obj.id });
                if (emp.length > 0)
                    obj.chk = true;
                else
                    obj.chk = false;
            });
        }

        angular.element('#_approvals_employees_list').modal({ show: true });
    }

    $scope.addEmployees = function () {
        var emps = $filter("filter")($scope.emp_list, { chk: true });
        if (emps.length > 6) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(544));
            return;
        }
        var type = $scope.selected_type;
        if (type == 1) {
            $scope.approval.selected_emps_type_1 = [];
            $scope.approval.selected_emps_codes_type_1 = '';
            angular.forEach($scope.emp_list, function (obj) {
                if (obj.chk == true) {
                    $scope.approval.selected_emps_type_1.push({ id: obj.id, code: obj.code });
                    $scope.approval.selected_emps_codes_type_1 = $scope.approval.selected_emps_codes_type_1 + obj.code + ',';
                }
            });
            $scope.approval.selected_emps_codes_type_1 = $scope.approval.selected_emps_codes_type_1.substring(0, $scope.approval.selected_emps_codes_type_1.length - 1);
        }
        else if (type == 2) {
            $scope.approval.selected_emps_type_2 = [];
            $scope.approval.selected_emps_codes_type_2 = '';
            angular.forEach($scope.emp_list, function (obj) {
                if (obj.chk == true) {
                    $scope.approval.selected_emps_type_2.push({ id: obj.id, code: obj.code });
                    $scope.approval.selected_emps_codes_type_2 = $scope.approval.selected_emps_codes_type_2 + obj.code + ',';
                }
            });
            $scope.approval.selected_emps_codes_type_2 = $scope.approval.selected_emps_codes_type_2.substring(0, $scope.approval.selected_emps_codes_type_2.length - 1);
        }
        else if (type == 3) {
            $scope.approval.selected_emps_type_3 = [];
            $scope.approval.selected_emps_codes_type_3 = '';
            angular.forEach($scope.emp_list, function (obj) {
                if (obj.chk == true) {
                    $scope.approval.selected_emps_type_3.push({ id: obj.id, code: obj.code });
                    $scope.approval.selected_emps_codes_type_3 = $scope.approval.selected_emps_codes_type_3 + obj.code + ',';
                }
            });
            $scope.approval.selected_emps_codes_type_3 = $scope.approval.selected_emps_codes_type_3.substring(0, $scope.approval.selected_emps_codes_type_3.length - 1);
        }
        else if (type == 4) {
            $scope.approval.selected_emps_type_4 = [];
            $scope.approval.selected_emps_codes_type_4 = '';
            angular.forEach($scope.emp_list, function (obj) {
                if (obj.chk == true) {
                    $scope.approval.selected_emps_type_4.push({ id: obj.id, code: obj.code });
                    $scope.approval.selected_emps_codes_type_4 = $scope.approval.selected_emps_codes_type_4 + obj.code + ',';
                }

            });
            $scope.approval.selected_emps_codes_type_4 = $scope.approval.selected_emps_codes_type_4.substring(0, $scope.approval.selected_emps_codes_type_4.length - 1);
        }
        else if (type == 5) {
            $scope.approval.selected_emps_type_5 = [];
            $scope.approval.selected_emps_codes_type_5 = '';
            angular.forEach($scope.emp_list, function (obj) {
                if (obj.chk == true) {

                    $scope.approval.selected_emps_type_5.push({ id: obj.id, code: obj.code });
                    $scope.approval.selected_emps_codes_type_5 = $scope.approval.selected_emps_codes_type_5 + obj.code + ',';
                }
            });
            $scope.approval.selected_emps_codes_type_5 = $scope.approval.selected_emps_codes_type_5.substring(0, $scope.approval.selected_emps_codes_type_5.length - 1);
        }
        else if (type == 6) {
            $scope.approval.selected_emps_type_6 = [];
            $scope.approval.selected_emps_codes_type_6 = '';
            angular.forEach($scope.emp_list, function (obj) {
                if (obj.chk == true) {
                    $scope.approval.selected_emps_type_6.push({ id: obj.id, code: obj.code });
                    $scope.approval.selected_emps_codes_type_6 = $scope.approval.selected_emps_codes_type_6 + obj.code + ',';

                }
            });
            $scope.approval.selected_emps_codes_type_6 = $scope.approval.selected_emps_codes_type_6.substring(0, $scope.approval.selected_emps_codes_type_6.length - 1);
        }
        else if (type == 7) {
            $scope.approval.selected_emps_type_7 = [];
            $scope.approval.selected_emps_codes_type_7 = '';
            angular.forEach($scope.emp_list, function (obj) {
                if (obj.chk == true) {
                    $scope.approval.selected_emps_type_7.push({ id: obj.id, code: obj.code });
                    $scope.approval.selected_emps_codes_type_7 = $scope.approval.selected_emps_codes_type_7 + obj.code + ',';

                }
            });
            $scope.approval.selected_emps_codes_type_7 = $scope.approval.selected_emps_codes_type_7.substring(0, $scope.approval.selected_emps_codes_type_7.length - 1);
        }

        angular.element('#_approvals_employees_list').modal('hide');
    }

    $scope.selectedAllEmployeesFtn = function (flg, _filter) {
        let selection_filter = $filter('filter');
        let filtered = selection_filter($rootScope.emp_list, _filter);

        if (flg) {
            angular.forEach(filtered, function (obj) {
                obj.chk = flg;
            });
        } else {
            angular.forEach($rootScope.emp_list, function (obj) {
                obj.chk = flg;
            });
        }
    }

    $scope.clearEmployees = function () {
        angular.element('#_approvals_employees_list').modal('hide');
    }

    $scope.addApprovals = function () {
        var Api = $scope.$root.setup + "general/update-approvals";

        if (($scope.approval.status_1 == true && !($scope.approval.selected_emps_codes_type_1.length > 0)) ||
            ($scope.approval.status_2 == true && !($scope.approval.selected_emps_codes_type_2.length > 0)) ||
            ($scope.approval.status_3 == true && !($scope.approval.selected_emps_codes_type_3.length > 0)) ||
            ($scope.approval.status_4 == true && !($scope.approval.selected_emps_codes_type_4.length > 0)) ||
            ($scope.approval.status_5 == true && !($scope.approval.selected_emps_codes_type_5.length > 0)) ||
            ($scope.approval.status_6 == true && !($scope.approval.selected_emps_codes_type_6.length > 0))) {
            toaster.pop('error', 'Error', "Please Specify the Approvers for all the ticked modules");
            return;
        }

        var approvals = [];
        approvals.push({ id: $scope.approval.id_1, 'type': '1', status: $scope.approval.status_1, selected_emps: $scope.approval.selected_emps_type_1, criteria: $scope.approval.criteria_1 });
        approvals.push({ id: $scope.approval.id_2, 'type': '2', status: $scope.approval.status_2, selected_emps: $scope.approval.selected_emps_type_2, criteria: 0 });
        approvals.push({ id: $scope.approval.id_3, 'type': '3', status: $scope.approval.status_3, selected_emps: $scope.approval.selected_emps_type_3, criteria: 0 });
        approvals.push({ id: $scope.approval.id_4, 'type': '4', status: $scope.approval.status_4, selected_emps: $scope.approval.selected_emps_type_4, criteria: $scope.approval.criteria_4 });
        approvals.push({ id: $scope.approval.id_5, 'type': '5', status: $scope.approval.status_5, selected_emps: $scope.approval.selected_emps_type_5, criteria: 0 });
        approvals.push({ id: $scope.approval.id_6, 'type': '6', status: $scope.approval.status_6, selected_emps: $scope.approval.selected_emps_type_6, criteria: 0 });
        approvals.push({ id: $scope.approval.id_7, 'type': '7', status: $scope.approval.status_7, selected_emps: $scope.approval.selected_emps_type_7, criteria: 0 });

        $http
            .post(Api, {
                'token': $scope.$root.token,
                approvals: approvals
            })
            .then(function (res) {
                if (res.data.ack == 1) {
                    angular.element('#setupApproval').modal('hide');
                }
            });
    }
}

DocUploadMigration_single.$inject = ["$scope", "Upload", "$timeout", "toaster"];
myApp.controller('DocUploadMigration_single', DocUploadMigration_single);

function DocUploadMigration_single($scope, Upload, $timeout, toaster) {

    $scope.postUrl = '';
    $scope.sampledownload = '';

    $scope.$on("change", function (event, url, sampledownload) {
        $scope.postUrl = url;
        $scope.sampledownload = sampledownload;

    });

    $scope.uploadFiles_xl = function (file, errFiles) {

        f = file;
        $scope.errFile = errFiles && errFiles[0];

        $scope.$root.$broadcast("change_upload", file);
    }


    $scope.file_data = {};
    $scope.$on("change_upload", function (event, filedata) {
        $scope.file_data = filedata;
    });


    $scope.add_migration = function () {

        $scope.showLoader = true;

        if ($scope.file_data) {

            $scope.file_data.upload = Upload.upload({
                url: $scope.postUrl,
                data: {
                    file: $scope.file_data,
                    image_token: $scope.$root.token
                }
            });

            $scope.file_data.upload.then(function (response) {
                $timeout(function () {
                    if (response.data.ack == true)
                        toaster.pop('success', 'Add', 'Uploaded Successfully');

                    if (response.data.ack == false)
                        toaster.pop('error', 'Info', response.data.error);

                });
            },
                function (response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;

                    $scope.showLoader = false;
                },
                function (evt) {
                    $scope.file_data.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    $scope.showLoader = false;
                });
        }
    }
}

function EDITSRMCLASSFICATIONLIST($scope, $stateParams, $http, $state, $resource, toaster) {
    $scope.formTitle = ' Classification';
    $scope.btnCancelUrl = 'app.setup';
    $scope.hideDel = false;

    $scope.check_readonly = false;

    if ($stateParams.module == "crm") {
        $scope.$root.maintype = 1;
        $scope.name = 'CRM';
    } else if ($stateParams.module == "customer") {
        $scope.$root.maintype = 2;
        $scope.name = 'Customer'
    } else if ($stateParams.module == "srm") {
        $scope.$root.maintype = 3;
        $scope.name = 'SRM';
    } else if ($stateParams.module == "supplier") {
        $scope.$root.maintype = 4;
        $scope.name = 'Supplier';
    }

    if ($scope.name == 'CRM' || $scope.name == 'Customer') {
        $scope.breadcrumbs = [
            {
                'name': 'Setup',
                'url': 'app.setup',
                'isActive': false,
                'tabIndex': '1'
            },
            {
                'name': 'Sales',
                'url': 'app.setup',
                'isActive': false,
                'tabIndex': '3'
            },
            {
                'name': $scope.name + ' Classification',
                'url': '#',
                'isActive': false
            }
        ];
    } else {
        $scope.breadcrumbs = [
            {
                'name': 'Setup',
                'url': 'app.setup',
                'isActive': false,
                'tabIndex': '1'
            },
            {
                'name': 'Purchase & SRM',
                'url': 'app.setup',
                'isActive': false,
                'tabIndex': '4'
            },
            {
                'name': $scope.name + ' Classification',
                'url': '#',
                'isActive': false
            }
        ];
    }

    $scope.formUrl = function () {
        return "app/views/setup/classifications_form.html";
    }
    $scope.rec = {};
    $scope.arr_type = [];
    $scope.arr_status = [{
        'label': 'Active',
        'value': 1
    }, {
        'label': 'inActive',
        'value': 0
    }];
    $scope.rec.status = $scope.arr_status[0];
    $scope.arr_type = [];
    $scope.arr_option = [{
        'label': 'CRM',
        'value': 1
    }, {
        'label': 'Customer',
        'value': 2
    }, {
        'label': 'SRM',
        'value': 3
    }, {
        'label': 'Supplier',
        'value': 4
    }];

    var postUrlref = $scope.$root.setup + "general/ref-classifications";
    var arr_module_type = {};
    $http
        .post(postUrlref, {
            'token': $scope.$root.token,
            main_type: $scope.$root.maintype
        })
        .then(function (res) {
            $scope.arr_module_type = res.data.response;
        });

    $scope.arr_type_commision = [];
    $scope.arr_type_commision = [{
        id: 1,
        name: 'Yes'
    }, {
        'id': 2,
        name: 'No'
    }];


    $scope.update = function (rec) {
        var updateUrl = $scope.$root.setup + "general/add-active-classification";

        rec.token = $scope.$root.token;
        rec.statuss = 1;
        rec.types = $scope.$root.maintype;
        rec.arr_module_types = $scope.arr_module_type;

        $http
            .post(updateUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                } else
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
            });
    }
}