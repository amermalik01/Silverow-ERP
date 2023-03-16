myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.general_ledger', {
                url: '/general_ledger',
                title: 'Finance',
                templateUrl: helper.basepath('general_ledger/gl.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog")
            })
            .state('app.general_ledger_list', {
                url: '/general_ledger_list',
                title: 'Finance',
                templateUrl: helper.basepath('general_ledger/_form.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'GlControllerTreeTable'
            })
            .state('app.general_ledger_tree', {
                url: '/general_ledger_tree',
                title: 'Finance',
                templateUrl: helper.basepath('general_ledger/_form.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'GlControllerTREE'
            })
            .state('app.addGL', {
                url: '/general_ledger/add',
                title: 'Finance',
                templateUrl: helper.basepath('general_ledger/_form.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'GlControllerEdit'
            })
            .state('app.gl_values', {
                url: '/general_ledger_values',
                title: 'Finance',
                templateUrl: helper.basepath('general_ledger/_form.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'GlControllerEdit'
            })
            .state('app.edit_gl', {
                url: '/:id/edit_general_ledger',
                title: 'Finance',
                templateUrl: helper.basepath('general_ledger/_form.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'GlControllerEdit'
            })
            .state('app.receipt-journal-gl', {
                url: '/receipt_general_journal',
                title: 'Finance',
                templateUrl: helper.basepath('general_ledger/_fomr_receipt.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'GlControllerReceipt'
            })
            .state('app.receipt-journal-gl-posted', {
                url: '/receipt_general_journal_posted/:isPosted/Posted',
                title: 'Finance',
                templateUrl: helper.basepath('general_ledger/_fomr_receipt.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'GlControllerReceipt'
            })
            .state('app.view-receipt-journal-gl', {
                url: '/receipt_general_journal/:id/view',
                title: 'General Journal',
                templateUrl: helper.basepath('general_ledger/_fomr_receipt.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'GlControllerReceipt'
            })
            .state('app.receipt-journal-gl-cust', {
                url: '/receipt_general_journal_cust',
                title: 'Sales',
                templateUrl: helper.basepath('general_ledger/_fomr_receipt.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'GlControllerReceipt'
            })
            .state('app.receipt-journal-gl-cust-posted', {
                url: '/receipt_general_journal_cust_posted/:isPosted/Posted',
                title: 'Sales ',
                templateUrl: helper.basepath('general_ledger/_fomr_receipt.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'GlControllerReceipt'
            })
            .state('app.view-receipt-journal-gl-cust', {
                url: '/receipt_general_journal_cust/:id/view',
                title: 'Customer Journal',
                templateUrl: helper.basepath('general_ledger/_fomr_receipt.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'GlControllerReceipt'
            })
            .state('app.receipt-journal-gl-supp', {
                url: '/receipt_general_journal_supp',
                title: 'Purchases',
                templateUrl: helper.basepath('general_ledger/_fomr_receipt.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'GlControllerReceipt'
            })
            .state('app.receipt-journal-gl-supp-posted', {
                url: '/receipt_general_journal_supp_posted/:isPosted/Posted',
                title: 'Purchases',
                templateUrl: helper.basepath('general_ledger/_fomr_receipt.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'GlControllerReceipt'
            })
            .state('app.view-receipt-journal-gl-supp', {
                url: '/receipt_general_journal_supp/:id/view',
                title: 'Purchases',
                templateUrl: helper.basepath('general_ledger/_fomr_receipt.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'GlControllerReceipt'
            })
            .state('app.receipt-journal-gl-item', {
                url: '/receipt_general_journal_item',
                title: 'Inventory',
                templateUrl: helper.basepath('general_ledger/_fomr_receipt_item.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'GlControllerReceipt'
            })
            .state('app.receipt-journal-gl-item-posted', {
                url: '/receipt_general_journal_item_posted/:isPosted/Posted',
                title: 'Inventory',
                templateUrl: helper.basepath('general_ledger/_fomr_receipt_item.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'GlControllerReceipt'
            })
            .state('app.view-receipt-journal-gl-item', {
                url: '/receipt_general_journal_item/:id',
                title: 'Inventory',
                templateUrl: helper.basepath('general_ledger/_fomr_receipt_item.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'GlControllerReceipt'
            })
            .state('app.openingBalances', {
                url: '/opening-balances/:module',
                title: 'Setup',
                templateUrl: helper.basepath('openingBalances/_formOpeningBalances.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'GlControllerOpeningBalance'
            })
            .state('app.view-opening-balances', {
                url: '/opening-balances/:module/:id',
                title: 'Setup',
                templateUrl: helper.basepath('openingBalances/_formOpeningBalances.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'GlControllerOpeningBalance'
            })
            .state('app.opening-balance-gl', {
                url: '/opening_balance',
                title: 'Setup',
                templateUrl: helper.basepath('general_ledger/_form_opening_balance.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'GlControllerOpeningBalance'
            })
    }
]);

GlListingController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", '$timeout'];
myApp.controller('GlControllerTreeTable', GlControllerTreeTable);

function GlControllerTreeTable($scope, $stateParams, $http, $state, $resource, toaster, Calendar, $window, ngDialog, $rootScope, $timeout) {
    $scope.breadcrumbs = [{ 'name': 'Finance', 'url': '#', 'isActive': false }, { 'name': 'Chart Of Accounts ', 'url': '#', 'isActive': false }];

    var postUrlAllGlAccounts = $scope.$root.gl + "chart-accounts/get-all-gl-accounts";
    $scope.showLoader = true;

    $http
        .post(postUrlAllGlAccounts, { 'token': $scope.$root.token })
        .then(function(res) {
            $scope.account_list = [];
            $scope.showLoader = false;
            if (res.data.ack == true) {
                $scope.account_list = res.data.response;
            } else
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
        });

    $scope.perreadonly = true;
    $scope.check_gl_readonly = false;

    $scope.show_add_pop = function(record_id) {
        $scope.formData = {};
        $scope.status_data = {};
        $scope.status_data = [{ name: 'Active', id: 1 }, { name: 'Inactive', id: 0 }, { name: 'Delete', id: 3 }];

        $scope.formData.statuss = $scope.status_data[0];

        $scope.posting_list = {};
        $scope.posting_list = [{ name: 'Balance sheet', id: 1 }, { name: 'Profit & Loass', id: 2 }];

        $scope.transcation_list = {};
        $scope.transcation_list = [{ name: 'Debit', id: 1 }, { name: 'Credit', id: 2 }, { name: 'Both', id: 3 }];
        $scope.formData.transcation_types = $scope.transcation_list[2];

        $scope.account_list_type = {};
        $scope.account_list_type = [{ name: 'Posting', id: 3 }, { name: 'End Total', id: 4 }, { name: 'Heading', id: 5 }];
        $scope.formData.account_type = $scope.account_list_type[0];

        $scope.vatAccountOption = {};
        $scope.vatAccountOption = [{ name: 'No', id: 0 }, { name: 'Yes', id: 1 }];
        $scope.formData.vataccount = $scope.vatAccountOption[0];

        $scope.posting_allow_list = {};
        $scope.posting_allow_list = [{ name: 'Yes', id: 1 }, { name: 'No', id: 0 }];

        $scope.company_list = {};
        $scope.company_list = [{ name: 'Cash', id: 1 }, { name: 'Bank', id: 2 }];
        $scope.formData.company_account = $scope.company_list[0];

        $scope.allow_posting = 1;
        $scope.total_code_ranges = 0;
        $scope.category_list = {};
        $scope.category_sub_list = {};

        if (record_id > 0) {
            var postUrl_getGlAccountPopupbyID = $scope.$root.gl + "chart-accounts/get-gl-account-byID";

            $http
                .post(postUrl_getGlAccountPopupbyID, { 'token': $scope.$root.token, 'id': record_id })
                .then(function(res) {
                    if (res.data.ack == true) {
                        $scope.category_list = res.data.Predata.categories;
                        $scope.category_sub_list = res.data.Predata.subCategories;
                        $scope.headingList = res.data.Predata.Headings;
                        $scope.formData.name = res.data.response.name;
                        $scope.formData.number = res.data.response.accountCode;
                        $scope.formData.startRangeCode = res.data.response.startRangeCode;
                        $scope.formData.endRangeCode = res.data.response.endRangeCode;
                        $scope.formData.id = res.data.response.id;
                        $scope.formData.gl_account_ref_id = res.data.response.gl_account_ref_id;

                        angular.forEach($scope.category_list, function(obj) {
                            if (obj.id == res.data.response.glCategory)
                                $scope.formData.catgeory = obj;
                        });

                        angular.forEach($scope.category_sub_list, function(obj) {
                            if (obj.id == res.data.response.glSubCat)
                                $scope.formData.subCatgegory = obj;
                        });

                        angular.forEach($scope.headingList, function(obj) {
                            if (obj.id == res.data.response.parent_gl_account_id)
                                $scope.formData.heading = obj;
                        });

                        angular.forEach($scope.transcation_list, function(obj) {
                            if (obj.id == res.data.response.transcation)
                                $scope.formData.transcation_types = obj;
                        });

                        angular.forEach($scope.vatAccountOption, function(obj) {
                            if (obj.id == res.data.response.vatBankType)
                                $scope.formData.vataccount = obj;
                        });

                        angular.forEach($scope.account_list_type, function(obj) {
                            if (obj.id == res.data.response.accountType) {
                                $scope.formData.account_type = obj;
                                $scope.select_posting_option(obj.id);
                            }
                        });

                        $scope.formData.prevGlAccountType = res.data.response.accountType;
                        var vatRate = res.data.response.vatRateID;

                        if (vatRate == 1 || vatRate == 2 || vatRate == 3 || vatRate == 4) {
                            $scope.formData.vat_list_ids = $rootScope.arr_vat[vatRate - 1];
                        } else {
                            angular.forEach($rootScope.arr_vat, function(obj) {
                                if (obj.id == res.data.response.vatRateID)
                                    $scope.formData.vat_list_ids = obj;
                            });
                        }

                        angular.forEach($scope.status_data, function(obj) {
                            if (obj.id == res.data.response.status)
                                $scope.formData.statuss = obj;
                        });

                        angular.element('#modal_add_pop').modal({ show: true });

                    } else toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                });
        } else {
            var postUrl_predataGlAccountPopup = $scope.$root.gl + "chart-accounts/get-predata-gl-account";

            $http
                .post(postUrl_predataGlAccountPopup, { 'token': $scope.$root.token })
                .then(function(res) {
                    if (res.data.ack == true) {
                        //console.log(res);
                        $scope.category_list = res.data.categories;
                        $scope.category_sub_list = res.data.subCategories;
                        $scope.headingList = res.data.Headings;
                        angular.element('#modal_add_pop').modal({ show: true });
                    } else toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                });
        }
    }

    $scope.getSubCategoriesByParentID = function(parentCatID) {
        var postUrl_getSubCategoriesByParentID = $scope.$root.gl + "chart-accounts/get-sub-categories-by-parent_id";
        $scope.formData.subCatgegory = '';
        $scope.formData.heading = '';
        $scope.category_sub_list = {};
        $scope.headingList = {};

        if (!(parentCatID > 0)) {
            return false;
        }

        $http
            .post(postUrl_getSubCategoriesByParentID, { 'token': $scope.$root.token, id: parentCatID })
            .then(function(res) {
                if (res.data.ack == true) {
                    $scope.category_sub_list = res.data.response;
                } else {
                    $scope.category_sub_list = {};
                }
            });
    }

    $scope.getGlHeading = function() {
        $scope.headingList = {};
        $scope.formData.heading = '';
        var parent_catid = ($scope.formData.catgeory != undefined && $scope.formData.catgeory != '') ? $scope.formData.catgeory.id : 0;
        var sub_catid = ($scope.formData.subCatgegory != undefined && $scope.formData.subCatgegory != '') ? $scope.formData.subCatgegory.id : 0;

        if (!(sub_catid > 0) || !(parent_catid > 0)) {
            return;
        }

        var postUrl_getGlHeading = $scope.$root.gl + "chart-accounts/get-gl-heading";

        $http
            .post(postUrl_getGlHeading, { 'token': $scope.$root.token, 'id': sub_catid, 'pid': parent_catid })
            .then(function(res) {
                if (res.data.ack == true) {
                    $scope.headingList = res.data.response;
                }
            });
    }

    $scope.category_list_one = {};

    $scope.get_list_one = function(arg) {
        var parent_catid = ($scope.formData.catgeory != undefined && $scope.formData.catgeory != '') ? $scope.formData.catgeory.id : 0;
        var sub_catid = ($scope.formData.subCatgegory != undefined && $scope.formData.subCatgegory != '') ? $scope.formData.subCatgegory.id : 0;

        if (!(sub_catid > 0) || !(parent_catid > 0)) {
            return;
        }

        $http
            .post(postUrl_level_list, { 'token': $scope.$root.token, 'id': sub_catid, 'pid': parent_catid })
            .then(function(res) {
                if (res.data.ack == true) {
                    $scope.category_list_one = res.data.response;
                } else
                    $scope.category_list_one = {};
            });
    }

    $scope.invalidGlCode = 0;

    $scope.select_posting_option = function(postingOption) {

        if (postingOption == 3) {

            $scope.allow_posting = 1;
            $scope.total_code_ranges = 0;
            $scope.checkCodeRange();

        } else if (postingOption == 4 || postingOption == 5) {

            $scope.allow_posting = 0;
            $scope.total_code_ranges = 1;

        } else {

            $scope.allow_posting = 0;
            $scope.total_code_ranges = 0;

        }
    }

    $scope.checkCodeRange = function(arg) {
        $scope.invalidGlCode = 0;

        if ($scope.formData.account_type != undefined && ($scope.formData.account_type.id == 4 || $scope.formData.account_type.id == 5)) {

            if (arg == 'actualCode') {
                if ($scope.formData.startRangeCode != undefined && $scope.formData.startRangeCode != '') {
                    if (parseFloat($scope.formData.number) < parseFloat($scope.formData.startRangeCode)) {
                        $scope.formData.number = '';
                        $scope.invalidGlCode = 1;
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(353, ['G/L No.', 'Start Range']));
                        return false;
                    }

                } else if ($scope.formData.endRangeCode != undefined && $scope.formData.endRangeCode != '') {
                    if (parseFloat($scope.formData.number) > parseFloat($scope.formData.endRangeCode)) {
                        $scope.formData.number = '';
                        $scope.invalidGlCode = 1;
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(353, ['G/L No.', 'End Range']));
                        return false;
                    }
                }
            } else if (arg == 'startRangeCode') {
                if ($scope.formData.heading != undefined) {
                    if ((parseFloat($scope.formData.startRangeCode) < parseFloat($scope.formData.heading.startRangeCode)) ||
                        (parseFloat($scope.formData.startRangeCode) > parseFloat($scope.formData.heading.endRangeCode))) {
                        $scope.formData.startRangeCode = '';
                        $scope.invalidGlCode = 1;
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(353, ['Start G/L No.', 'Heading Account Range']));
                        return false;
                    }

                } else if ($scope.formData.subCatgegory != undefined) {
                    if ((parseFloat($scope.formData.startRangeCode) < parseFloat($scope.formData.subCatgegory.startRangeCode)) ||
                        (parseFloat($scope.formData.startRangeCode) > parseFloat($scope.formData.subCatgegory.endRangeCode))) {
                        $scope.formData.startRangeCode = '';
                        $scope.invalidGlCode = 1;
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(353, ['Start G/L No.', 'Sub Category Account Range']));
                        return false;
                    }

                } else if ($scope.formData.catgeory != undefined) {
                    if ((parseFloat($scope.formData.startRangeCode) < parseFloat($scope.formData.catgeory.startRangeCode)) ||
                        (parseFloat($scope.formData.startRangeCode) > parseFloat($scope.formData.catgeory.endRangeCode))) {
                        $scope.formData.startRangeCode = '';
                        $scope.invalidGlCode = 1;
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(353, ['Start G/L No.', 'Category Account Range']));
                        return false;
                    }
                }

            } else if (arg == 'endRangeCode') {
                if ($scope.formData.heading != undefined) {
                    if ((parseFloat($scope.formData.endRangeCode) < parseFloat($scope.formData.heading.startRangeCode)) ||
                        (parseFloat($scope.formData.endRangeCode) > parseFloat($scope.formData.heading.endRangeCode))) {
                        $scope.formData.endRangeCode = '';
                        $scope.invalidGlCode = 1;
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(353, ['End G/L No.', 'Heading Account Range']));
                        return false;
                    }

                } else if ($scope.formData.subCatgegory != undefined) {
                    if ((parseFloat($scope.formData.endRangeCode) < parseFloat($scope.formData.subCatgegory.startRangeCode)) ||
                        (parseFloat($scope.formData.endRangeCode) > parseFloat($scope.formData.subCatgegory.endRangeCode))) {
                        $scope.formData.endRangeCode = '';
                        $scope.invalidGlCode = 1;
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(353, ['End G/L No.', 'Sub Category Account Range']));
                        return false;
                    }

                } else if ($scope.formData.catgeory != undefined) {
                    if ((parseFloat($scope.formData.endRangeCode) < parseFloat($scope.formData.catgeory.startRangeCode)) ||
                        (parseFloat($scope.formData.endRangeCode) > parseFloat($scope.formData.catgeory.endRangeCode))) {
                        $scope.formData.endRangeCode = '';
                        $scope.invalidGlCode = 1;
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(353, ['End G/L No.', 'Category Account Range']));
                        return false;
                    }
                }
            }

        } else if ($scope.formData.account_type != undefined && $scope.formData.account_type.id == 3) {
            if ($scope.formData.heading != undefined && arg == 'actualCode') {
                if ((parseFloat($scope.formData.number) < parseFloat($scope.formData.heading.startRangeCode)) ||
                    (parseFloat($scope.formData.number) > parseFloat($scope.formData.heading.endRangeCode))) {
                    $scope.formData.number = '';
                    $scope.invalidGlCode = 1;
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(353, ['G/L No.', 'Heading Account Range']));
                    return false;
                }
            } else if ($scope.formData.subCatgegory != undefined && arg == 'actualCode') {
                if ((parseFloat($scope.formData.number) < parseFloat($scope.formData.subCatgegory.startRangeCode)) ||
                    (parseFloat($scope.formData.number) > parseFloat($scope.formData.subCatgegory.endRangeCode))) {
                    $scope.formData.number = '';
                    $scope.invalidGlCode = 1;
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(353, ['G/L No.', 'Sub Category Account Range']));
                    return false;
                }

            } else if ($scope.formData.catgeory != undefined && arg == 'actualCode') {
                if ((parseFloat($scope.formData.number) < parseFloat($scope.formData.catgeory.startRangeCode)) ||
                    (parseFloat($scope.formData.number) > parseFloat($scope.formData.catgeory.endRangeCode))) {
                    $scope.formData.number = '';
                    $scope.invalidGlCode = 1;
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(353, ['G/L No.', 'Category Account Range']));
                    return false;
                }
            }

        } else if ($scope.formData.account_type == undefined) {
            if (arg == 'actualCode') {
                $scope.formData.number = '';
            } else if (arg == 'startRangeCode') {
                $scope.formData.startRangeCode = '';
            } else if (arg == 'endRangeCode') {
                $scope.formData.endRangeCode = '';
            }

            $scope.invalidGlCode = 1;
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Transaction Type']));
            return false;
        }
    }

    $scope.addGeneral = function(formData) {
        var ADDUrl = $scope.$root.gl + "chart-accounts/add-new-account";

        if ($scope.invalidGlCode > 0 && ($scope.rec.number != undefined || $scope.rec.number != 0 || $scope.rec.number != '')) {
            return false;
        }

        $scope.showLoader = true;
        $scope.rec = {};
        $scope.rec.gl_id = $scope.record_id;
        $scope.rec.token = $scope.$root.token;

        $scope.rec.catgeorys = ($scope.formData.catgeory !== undefined && $scope.formData.catgeory != '') ? $scope.formData.catgeory.id : 0;

        $scope.rec.subCatgegorys = ($scope.formData.subCatgegory !== undefined && $scope.formData.subCatgegory != '') ? $scope.formData.subCatgegory.id : 0;

        $scope.rec.headings = ($scope.formData.heading !== undefined && $scope.formData.heading != '') ? $scope.formData.heading.id : 0;

        // $scope.rec.allow_postings = ($scope.formData.allow_posting !== undefined && $scope.formData.allow_posting != '') ? $scope.formData.allow_posting.id : 0;

        $scope.rec.account_types = ($scope.formData.account_type !== undefined && $scope.formData.account_type != '') ? $scope.formData.account_type.id : 0;

        $scope.rec.allow_postings = $scope.allow_posting;

        $scope.rec.transcation_type = ($scope.formData.transcation_types !== undefined && $scope.formData.transcation_types != '') ? $scope.formData.transcation_types.id : 0;

        $scope.rec.vataccounts = ($scope.formData.vataccount !== undefined && $scope.formData.vataccount != '') ? $scope.formData.vataccount.id : 0;

        $scope.rec.status = ($scope.formData.statuss !== undefined && $scope.formData.statuss != '') ? $scope.formData.statuss.id : 2;

        $scope.rec.vat_list_id = ($scope.formData.vat_list_ids !== undefined && $scope.formData.vat_list_ids != '') ? $scope.formData.vat_list_ids.id : 0;





        $scope.rec.id = formData.id;

        $scope.rec.name = formData.name;

        $scope.rec.number = formData.number;

        $scope.rec.startRangeCode = formData.startRangeCode;

        $scope.rec.endRangeCode = formData.endRangeCode;

        $scope.rec.glNumberDisplayAs = formData.glNumberDisplayAs;



        if ($scope.rec.catgeorys == 0) {

            $scope.showLoader = false;

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Category']));

            return false;

        }



        if ($scope.rec.subCatgegorys == 0 && $scope.category_sub_list.length > 0) {

            $scope.showLoader = false;

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Sub-Category']));

            return false;

        }



        if ($scope.rec.account_types == 0) {

            $scope.showLoader = false;

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Transaction Type']));

            return false;

        }



        if ($scope.rec.name == undefined || $scope.rec.name.length == 0 || $scope.rec.name == '') {

            $scope.showLoader = false;

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Name']));

            return false;

        }



        if ($scope.rec.number == undefined || $scope.rec.number == 0 || $scope.rec.number == '') {

            $scope.showLoader = false;

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['G/L No.']));

            return false;

        }



        if ($scope.rec.vat_list_id == 0) {

            $scope.showLoader = false;

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['VAT Rate']));

            return false;

        }



        if ($scope.rec.status == 2) {

            $scope.showLoader = false;

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Status']));

            return false;

        }



        $scope.editmode = 0;



        if ($scope.rec.id > 0)

            $scope.editmode = 1;



        $http

            .post(ADDUrl, $scope.rec)

        .then(function(res) {

            $scope.showLoader = false;

            if (res.data.ack == true) {

                $scope.formData.gl = res.data.gl_id;



                angular.element('#modal_add_pop').modal('hide');

                $scope.reload_table_data();

                //$state.go("app.general_ledger_list");

            } else

                toaster.pop('error', 'Error', res.data.error);

        });

    }



    $scope.reload_table_data = function() {

        $scope.account_list = [];

        $scope.showLoader = true;



        var postUrlAllGlAccounts = $scope.$root.gl + "chart-accounts/get-all-gl-accounts";



        $http

            .post(postUrlAllGlAccounts, { 'token': $scope.$root.token })

        .then(function(res) {

            $scope.showLoader = false;



            if ($scope.editmode > 0)

                toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));

            else

                toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));



            if (res.data.ack == true)

                $scope.account_list = res.data.response;

            else

                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));

        });

    }



    $scope.show_tree = false;

    $scope.show_list = true;



    var vm = this;



    $scope.rec = {};



    $scope.class = 'inline_block';

    $scope.btnCancelUrl = 'app.general_ledger';



    $scope.account_list = [];

    $scope.category_list = [];

    $scope.category_sub = {};

    $scope.category_list_data_one = {};

    $scope.category_list_data_second = {};

    $scope.category_list_data_third = {};



    var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";

    //var postUrl_cat = $scope.$root.gl + "chart-accounts/get-parent-categories-by-name";

    // var postUrl_all_cat_list = $scope.$root.gl + "chart-accounts/get-all-categories-by-list";

    var postUrl_level_list = $scope.$root.gl + "chart-accounts/get-level-list";



    // var vatUrl = $scope.$root.hr + "hr_values/get-vat";





    var postUrl_list = $scope.$root.gl + "chart-accounts/get-list-one";

    var postUrl_parent = $scope.$root.gl + "chart-accounts/get-parent";

    var postUrl_code = $scope.$root.gl + "chart-accounts/get_new_number";

    var DetailsURL = $scope.$root.gl + "chart-accounts/get-account-heads";



    var addglaccounts_by_new_company = $scope.$root.gl + "chart-accounts/add-gl-accounts-by-new-company";



    $scope.new_company_id = "";



    $scope.add_gl_accounts_by_new_company = function() {

        $scope.showLoader = true;

        var company_id = $scope.new_company_id;

        // console.log(company_id);



        $http

            .post(addglaccounts_by_new_company, { 'token': $scope.$root.token, 'id': company_id })

        .then(function(res) {

            if (res.data.ack == true) {

                // console.log(res);

                var company_gl_error_counter = res.data.company_gl_error_counter;

                var company_gl_accounts_error_counter = res.data.company_gl_accounts_error_counter;

                var company_gl_error = res.data.company_gl_error;

                // console.log(company_gl_error);

                var company_gl_accounts_error = res.data.company_gl_accounts_error;

                //  console.log(company_gl_accounts_error);



                if (company_gl_error_counter > 0) {

                    toaster.pop('error', 'Error', company_gl_error_counter + " Gl Categories Records not inserted for new company!");

                }



                if (company_gl_accounts_error_counter > 0) {

                    toaster.pop('error', 'Error', company_gl_accounts_error_counter + " Gl Accounts Records not inserted for new company!");

                }



                if (company_gl_error != undefined) {

                    toaster.pop('error', 'Error', company_gl_error);

                }



                if (company_gl_accounts_error != undefined) {

                    toaster.pop('error', 'Error', company_gl_accounts_error);

                }

                //company_gl_error_counter == 0 && company_gl_accounts_error_counter == 0 &&

                if (company_gl_error == undefined && company_gl_accounts_error == undefined) {

                    toaster.pop('success', 'Add', 'Gl Accounts and Categories Records are inserted for new company');

                }

            } else

                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));

            $scope.showLoader = false;

        });

    }



    $scope.toggleVisibility = function(node) {

        if (node.children) {

            node.childrenVisibility = !node.childrenVisibility;

        }

    };



    $scope.onChangeAccounttype = function() {

        var id = this.formData.account_types.id;

        $scope.show_cat = true;



        if (id == 2) {

            $scope.show_cat = false;

        }

    }



    $scope.gotoEdit = function() {

        //  $state.go("app.editHRTabCol",{id:$stateParams.id}); 

        $scope.perreadonly = true;

        $scope.check_gl_readonly = false;

    }



    //--------------------- start General   ------------------------------------------



    $scope.account_details_rec = [];

    $scope.pageInput = {};

    $scope.pages = {};





    $scope.openDocumentLink = function(record) {

        var mainRecord = record;

        var record = mainRecord.record;

        var index = mainRecord.index;

        var url;

        if (record.docType == 'Sales Invoice') {

            url = $state.href("app.viewOrder", ({ id: record.order_id, isInvoice: 1 }));

        } else if (record.docType == 'Credit Note Invoice') {

            url = $state.href("app.viewReturnOrder", ({ id: record.order_id, isInvoice: 1 }));

        } else if (record.docType == 'Purchase Invoice') {

            url = $state.href("app.viewsrmorder", ({ id: record.order_id }));

        } else if (record.docType == 'Purchase Order') {

            url = $state.href("app.viewsrmorder", ({ id: record.order_id }));

        } else if (record.docType == 'Debit Note') {

            url = $state.href("app.viewsrmorderreturn", ({ id: record.order_id }));

        } else if (record.docType == 'General Journal') {

            url = $state.href("app.view-receipt-journal-gl", ({ id: record.order_id, isInvoice: 1 }));

        } else if (record.docType == 'Customer Journal') {

            url = $state.href("app.view-receipt-journal-gl-cust", ({ id: record.order_id }));

        } else if (record.docType == 'Supplier Journal') {

            url = $state.href("app.view-receipt-journal-gl-supp", ({ id: record.order_id }));

        } else if (record.docType == 'Item Ledger' || record.docType == 'Item Journal') {

            url = $state.href("app.view-receipt-journal-gl-item", ({ id: record.order_id }));

        } else if (record.docType == 'Bank Opening Balance') {

            url = $state.href("app.openingBalances", ({ module: 'bank' }));

        } else if (record.docType == 'Stock Opening Balance') {

            url = $state.href("app.openingBalances", ({ module: 'bank' }));

        } else if (record.docType == 'Customer Opening Balance') {

            url = $state.href("app.openingBalances", ({ module: 'customer' })); //viewReturnOrder

        } else if (record.docType == 'Supplier Opening Balance') {

            url = $state.href("app.openingBalances", ({ module: 'supplier' }));

        } else if (record.docType == 'Opening Balance' || record.docType == 'GL Opening Balance') {

            url = $state.href("app.openingBalances", ({ module: 'general_ledger' }));

        }



        window.open(url, '_blank');



    }



    $scope.searchKeywordForGLDetail = {};

    $scope.setParametersForFetchingDetails = function(rec) {



        $scope.searchKeywordForGLDetail = {};

        $scope.lastFetchDetail = {};

        $scope.lastFetchDetail.id = rec.id;

        $scope.lastFetchDetail.typeID = rec.typeID;

        $scope.lastFetchDetail.gl_no = rec.gl_no;

        $scope.lastFetchDetail.name = rec.name;

        $scope.lastFetchDetail.code_range_from = rec.code_range_from;

        $scope.lastFetchDetail.code_range_to = rec.code_range_to;

        $scope.show_detail_pop(1);

    }



    $scope.show_detail_pop = function(item_paging) {

        $scope.postData = {};

        if (item_paging) {

            if (item_paging == 1) $scope.item_paging.spage = 1;

            $scope.postData.page = $scope.item_paging.spage;

            $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;

        }



        var account_id = $scope.lastFetchDetail.id;

        var type = $scope.lastFetchDetail.typeID;

        var acc_code = $scope.lastFetchDetail.gl_no;

        var acc_name = $scope.lastFetchDetail.name;

        var range_from = $scope.lastFetchDetail.code_range_from;

        var range_to = $scope.lastFetchDetail.code_range_to;

        $scope.balance_detail_title = acc_code + " - " + acc_name;

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



        if (!$scope.searchKeywordForGLDetail.totalRecords)

            $scope.searchKeywordForGLDetail.totalRecords = 50;



        $scope.postData = {

            'token': $scope.$root.token,

            'account_type': type,

            'account_id': account_id,

            'range_from': range_from,

            'range_to': range_to,

            'searchKeyword': $scope.searchKeywordForGLDetail

        }

        if ($scope.item_paging) {

            if (item_paging == 1) $scope.item_paging.spage = 1;

            $scope.postData.page = $scope.item_paging.spage;

            $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;

        }



        var gl_account_DetailsURL = $scope.$root.gl + "chart-accounts/get-gl-account-debit-credit-by-id";



        $http

            .post(gl_account_DetailsURL, $scope.postData)

        .then(function(res) {





            //console.log(res);

            $scope.totalAmount = 0;

            if (res.data.ack == true) {

                $scope.tableData = res;



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



                angular.forEach($scope.account_details_rec.data.tbl_meta_data.response.colMeta, function(obj, index) {

                    if (obj.event && obj.event.name && obj.event.trigger) {

                        obj.generatedEvent = $scope[obj.event.name];

                    }

                })



                angular.element('#show_account_detail_pop').modal({

                    show: true

                });

            } else {

                $scope.showLoader = false;

                toaster.pop('error', 'Error', res.data.error);

            }

        });



    }



    $scope.clear_detail_pop = function(account_id, type, acc_code, acc_name, range_from, range_to) {

        $scope.balance_detail_title = acc_code + " - " + acc_name;

        $scope.gl_code = acc_code;



        $scope.showLoader = true;



        // $scope.Searchkeyword2 = '';

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



        var gl_account_DetailsURL = $scope.$root.gl + "chart-accounts/get-gl-account-debit-credit-by-id";



        $http

            .post(gl_account_DetailsURL,

            {

                'token': $scope.$root.token,

                'account_type': type,

                'account_id': account_id,

                'range_from': range_from,

                'range_to': range_to,

                'page': 1,

                'searchKeyword': $scope.filterSearchAccount.Searchkeyword2

            })

        .then(function(res) {

            //console.log(res);



            $scope.cpage = '';

            $scope.npage = '';

            $scope.ppage = '';

            // $scope.pages = '';

            $scope.pageInput.data = '';



            $scope.total_pages = 0;

            $scope.total_rec = 0;

            $scope.totalAmount = 0;



            // $scope.account_details_rec = [];



            if (res.data.ack == true) {

                $scope.account_details_rec.data = res.data.response;

                $scope.totalAmount = res.data.totalAmount;

                // angular.copy($scope.account_details_rec,res.data.response);

                $scope.total_pages = res.data.total_pages;

                $scope.total_rec = res.data.total;



                $scope.cpage = res.data.cpage;

                $scope.npage = res.data.npage;

                $scope.ppage = res.data.ppage;

                $scope.pages.data = res.data.pages;

                // angular.copy($scope.pages, res.data.pages);



                $scope.Total_transaction = res.data.Total_transaction;

                $scope.Total_transaction_type = res.data.Total_transaction_type;

                $scope.showLoader = false;



                /* angular.element('#show_account_detail_pop').modal({
        
                            show: true
        
                        }); */



            } else {

                $scope.showLoader = false;

                toaster.pop('error', 'Error', res.data.error);

            }

        });



    }







    $scope.exportToCSV = function(account_id, type, acc_code, acc_name, range_from, range_to) {

        $scope.balance_detail_title = acc_code + " - " + acc_name;

        $scope.gl_code = acc_code;

        $scope.showLoader = true;



        // var gl_account_DetailsURL = $scope.$root.gl + "chart-accounts/get-gl-account-debit-credit-by-id";

        var gl_account_DetailsURL = $scope.$root.gl + "chart-accounts/generate-gl-account-CSV-byID";



        $http

            .post(gl_account_DetailsURL,

            {

                'token': $scope.$root.token,

                'account_type': type,

                'account_id': account_id,

                'acc_code': acc_code,

                'acc_name': acc_name,

                'range_from': range_from,

                'range_to': range_to,

                'searchKeyword': $scope.searchKeywordForGLDetail,

                'exportToCSV': 1

            })

        .then(function(res) {

            //console.log(res);

            if (res.data.ack == true) {

                /* $scope.account_details_rec = res.data.response;
        
                        $scope.Total_transaction = res.data.Total_transaction;
        
                        $scope.Total_transaction_type = res.data.Total_transaction_type; */

                $scope.showLoader = false;

                window.location.assign(res.data.filename);

            } else {

                $scope.showLoader = false;

                toaster.pop('error', 'Error', res.data.error);

            }

        });



    }



    $scope.dismissGlAccountModal = function(account_id, acc_code) {



        angular.element('#show_account_detail_pop').modal('hide');



        var gl_accountDeleteTempTableURL = $scope.$root.gl + "chart-accounts/delete-gl-account-temp-table";



        $http

            .post(gl_accountDeleteTempTableURL,

            {

                'token': $scope.$root.token,

                'account_id': account_id,

                'acc_code': acc_code

            })

        .then(function(res) {

            //console.log(res);

            if (res.data.ack == true) {



            } else {

                $scope.showLoader = false;

                toaster.pop('error', 'Error', res.data.error);

            }

        });



    }



    $scope.currentGLPage = 0;

    $scope.pageSize = 25;

    // $scope.data = [];

    $scope.numberOfGLPages = function() {

        if ($scope.account_details_rec != undefined) {

            var totalPages = Math.ceil($scope.account_details_rec.length / $scope.pageSize);

            if (totalPages == 0)

                return 1;

            else

                return totalPages;

        } else

            return;

    }



    $scope.get_child_account_entry = function(item) {

        return;

        angular.element('#show_account_child_account').modal({

            show: true

        });

    }



    $scope.netTotalAccount = function() {



        var ctotal = 0;

        var total_debit = 0;

        var total_credit = 0;

        angular.forEach($scope.account_details_rec.data, function(item) {

            if (item.ack) {

                // this is not actual item but flexi meta data object

                return;

            }

            total_debit += Number(item.debit_amount);

            total_credit += Number(item.credit_amount);

        });

        return Number(total_debit - total_credit);

    }





    $scope.show_edit_pop = function(record_id, type) {

        /*console.log(record_id);

         console.log(type);*/

        // console.log("here in edit");



        $scope.showLoader = true;



        $scope.formData.category_ids = {};

        $scope.formData.level_ones = {};



        var editDetailsURL = $scope.$root.gl + "chart-accounts/get-gl-account-by-id";



        if (record_id !== undefined && type == 1) {



            $scope.record_id = record_id;



            // $timeout(function () {

            $http

                .post(editDetailsURL, { 'token': $scope.$root.token, 'gl_id': record_id })

            .then(function(res) {

                //console.log(res);

                if (res.data.ack == true) {



                    $.each($scope.category_list, function(index, obj) {

                        if (obj.id == res.data.response_account.parent_cat_id) {

                            $scope.formData.gl_category_ids = $scope.category_list[index];

                            // console.log($scope.formData.gl_category_ids);

                        }

                    });



                    var parid = res.data.response_account.parent_cat_id;

                    var subcatid = res.data.response_account.subcat_id;



                    $http

                        .post(postUrl_sub_cat_by_parent_id, { 'token': $scope.$root.token, id: parid })

                    .then(function(res) {

                        //console.log(res);



                        if (res.data.ack == true) {

                            $scope.category_sub_list = res.data.response;

                        } else

                            $scope.category_sub_list = {};

                    });



                    $http

                        .post(postUrl_level_list, { 'token': $scope.$root.token, 'id': subcatid, 'pid': parid })

                    .then(function(res) {

                        //console.log(res);



                        if (res.data.ack == true) {



                            $scope.category_list_one = res.data.response;



                        } else

                            $scope.category_list_one = {};

                    });





                    /*if (res.data.response_account.account_type == 0) {
        
                             
        
                             $scope.allow_posting = 1;
        
                             }*/

                    if (res.data.response_account.account_type == 1) {



                        $scope.allow_posting = 1;

                        $scope.total_code_ranges = 0;

                    } else if (res.data.response_account.account_type == 3) {



                        $scope.allow_posting = 0;

                        $scope.total_code_ranges = 1;

                    }



                    $.each($scope.account_list_type, function(index, obj) {

                        if (obj.id == res.data.response_account.account_type) {

                            $scope.formData.account_type = $scope.account_list_type[index];

                            // console.log($scope.formData.account_type);

                        }

                    });



                    $.each($scope.posting_allow_list, function(index, obj) {

                        if (obj.id == res.data.response_account.allow_posting) {

                            $scope.formData.allow_posting = $scope.posting_allow_list[index];

                            // console.log($scope.formData.allow_posting);

                        }

                    });

                    // $scope.formData = res.data.response;

                    $scope.formData.name = res.data.response_account.name;

                    $scope.formData.number = res.data.response_account.account_no;

                    $scope.formData.opening_balnc = res.data.response_account.oppening_balance;



                    $.each($scope.transcation_list, function(index, obj) {

                        if (res.data.response_account.transcation) {

                            if (obj.id == res.data.response_account.transcation) {

                                $scope.formData.transcation_types = $scope.transcation_list[index];

                                // console.log($scope.formData.transcation_types);

                            }

                        }

                    });



                    angular.forEach($scope.vatAccountOption, function(obj) {

                        if (obj.id == res.data.response_account.vatBankType)

                            $scope.formData.vataccount = obj;

                    });



                    $.each($scope.vat_gl_list, function(index, obj) {

                        if (res.data.response_account.vat_rate_id) {

                            if (obj.id == res.data.response_account.vat_rate_id) {

                                $scope.formData.vat_list_ids = $scope.vat_gl_list[index];

                                // console.log($scope.formData.vat_list_ids);

                            }

                        }

                    });



                    $.each($scope.status_data, function(index, obj) {

                        if (res.data.response_account.status) {

                            if (obj.id == res.data.response_account.status) {

                                $scope.formData.statuss = $scope.status_data[index];

                                // console.log($scope.formData.statuss);

                            }

                        }

                    });



                    // $timeout(function () {



                    $.each($scope.category_sub_list, function(index, obj) {

                        if (obj.id == res.data.response_account.subcat_id) {



                            $scope.formData.category_ids = $scope.category_sub_list[index];

                        }

                    });



                    $.each($scope.category_list_one, function(index, obj) {

                        if (obj.id == res.data.response_account.parent_id) {



                            $scope.formData.level_ones = $scope.category_list_one[index];

                        }

                    });





                    if ($scope.formData.category_ids.id == undefined) {



                        $timeout(function() {

                            $.each($scope.category_sub_list, function(index, obj) {

                                if (obj.id == res.data.response_account.subcat_id) {



                                    $scope.formData.category_ids = $scope.category_sub_list[index];

                                }

                            });

                        }, 1000);

                    }



                    if ($scope.formData.level_ones.id == undefined) {



                        $timeout(function() {

                            $.each($scope.category_list_one, function(index, obj) {

                                if (obj.id == res.data.response_account.parent_id) {



                                    $scope.formData.level_ones = $scope.category_list_one[index];

                                }

                            });

                        }, 1000);

                    }

                    // console.log($scope.formData.category_ids);

                    // console.log($scope.formData.level_ones);

                    // }, 3000);

                    $scope.showLoader = false;

                    angular.element('#modal_edit_pop_gl').modal({

                        show: true

                    });

                }

            });



            // }, 1000);





        } else if (record_id !== undefined && type == undefined) {

            $scope.showLoader = false;

            angular.element('#modal_edit_pop_gl_cat').modal({

                show: true

            });

        }

    }



    $scope.show_history = function(id) {



        $scope.record = {};

        $scope.columns = [];



        // $timeout(function(){

        var get_accounts = $scope.$root.gl + "chart-accounts/get-accounts-history";

        $http

            .post(get_accounts, { 'token': $scope.$root.token, 'id': id })

        .then(function(res) {

            if (res.data.ack == true) {

                $scope.record = {};

                $scope.columns = [];

                $scope.record = res.data.response;



                angular.forEach(res.data.response[0], function(val, index) {

                    $scope.columns.push({

                        'title': toTitleCase(index),

                        'field': index,

                        'visible': true

                    });

                });

            } else

                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));

        });

        //	},1000);  

        angular.element('#modal_list_histroy').modal({

            show: true

        });

    }



    $scope.delete = function(id) {

        var delUrl = $scope.$root.gl + "chart-accounts/delete-gl";

        ngDialog.openConfirm({

            template: 'modalDeleteDialogId',

            className: 'ngdialog-theme-default-custom'

        }).then(function(value) {

            $http

                .post(delUrl, { id: id, 'token': $scope.$root.token })

            .then(function(res) {



                if (res.data.ack == true) {

                    toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));

                    //	 arr_data.splice(index,1);

                    $timeout(function() {

                        $state.reload();

                    }, 2000);

                    //  $timeout(function(){ $state.go('app.general_ledger'); }, 3000);

                } else {

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(108));

                }

            });

        }, function(reason) {

            // console.log('Modal promise rejected. Reason: ', reason);

        });



    };





    //--------------------- End General   ------------------------------------------

}

myApp.controller('GlListingController', GlListingController);

function GlListingController($scope, $filter, ngParams, $resource, ngDataService, $http, ngDialog, toaster, $timeout) {

    'use strict';
    $scope.class = 'inline_block';

    var vm = this;
    var Api_gl = $scope.$root.gl + "chart-accounts/gl-list";

    var postData = {
        'token': $scope.$root.token,
        'all': "1"
    };

    $scope.$watch("MyCustomeFilters", function() {
        if ($scope.MyCustomeFilters && $scope.table.tableParams5) {
            $scope.table.tableParams5.reload();
        }
    }, true);

    $scope.MyCustomeFilters = {}



    vm.tableParams5 = new ngParams({

        page: 1, // show first page

        count: 10, // count per page

        sorting: { number: 'asc' },

        //	sorting: 'asc',

        filter: {

            name: '',

            age: ''

        }

    }, {

        total: 0, // length of data

        counts: [], // hide page counts control



        getData: function($defer, params) {

            ngDataService.getDataCustom($defer, params, Api_gl, $filter, $scope, postData);



        }

    });



    $scope.toggleVisibility = function(node) {

        if (node.children) {

            node.childrenVisibility = !node.childrenVisibility;

        }

    };



    $scope.checkNode = function(node) {

        node.checked = !node.checked;

        function checkChildren(c) {

            angular.forEach(c.children, function(c) {

                c.checked = node.checked;

                checkChildren(c);

            });

        }



        checkChildren(node);

    };



    $scope.category = {};

    $scope.parent = {};

    $scope.child = {};

    $scope.total = {};

    var table = 'account_heads';

    var order_by = 'number';

    $scope.child_html = '';

    $scope.part_html = '';

    $scope.ViewCat = 0;

    $scope.special_readonly = 0;



    $http

        .post(Api_gl, postData)

    .then(function(res) {

        //  console.log(res);

        if (res.data.ack == true) {

            $scope.category = res.data.response_category;

            $scope.parent = res.data.response_account;



        }

    });



    $scope.snippet = $scope.part_html;



    $scope.deliberatelyTrustDangerousSnippet = function() {

        return $sce.trustAsHtml($scope.snippet);

    };



    function get_child(id) {

        if ($scope.child[id] != undefined) {

            $scope.child_html = $scope.child_html + '<ul>';

            $.each($scope.child[id], function(tempId, arrChdValue) {

                get_total(arrChdValue);

                var inTemp = arrChdValue['id'];

                $scope.chk_array[inTemp] = inTemp;

                $scope.child_html = $scope.child_html + '<li class="lite-col three" style="margin-top:4px;" )"><a  ng-click="go_edit(' + inTemp + ')">';

                $scope.child_html = $scope.child_html + arrChdValue['number'] + ' ' + arrChdValue['name'] + '</a>';

                print_total(arrChdValue);

                $scope.child_html = $scope.child_html + '</li>';

                if (arrChdValue['is_partent'] == 1)

                    get_child(inTemp);





            });

            $scope.child_html = $scope.child_html + '</ul>';

        }

    }



    function print_total(arrTemp) {

        $scope.child_html = $scope.child_html;

        var id = arrTemp['id'];

        var number = arrTemp['number'];

        if (arrTemp['account_type'] == 'Posting' && $scope.totals > 0) {

            $scope.child_html = $scope.child_html + '<a  ng-click="getAccoutDetails(' + number + ')"><div style="float:right; padding-right:30px;">' + $scope.totals + '</div></a>';

        }

        if (arrTemp['account_type'] == 'End-Total' && $scope.chk == arrTemp['category_id'] && $scope.grand_total > 0) {

            $scope.child_html = $scope.child_html + '<div style="float:right; padding-right:30px;">' + $scope.grand_total + "</div>"

        } else if (arrTemp['account_type'] == 'End-Total' && $scope.totals > 0)

            $scope.child_html = $scope.child_html + '<div style="float:right; padding-right:30px;">' + $scope.totals + "</div>"

    }



    function get_total(arrTemp) {



        $scope.totals = 0;

        var cat_id = arrTemp['category_id'];

        var number = arrTemp['number'];

        if (arrTemp['account_type'] == 'Heading' && arrTemp['category_id'] == '0')

            $scope.grand_total = 0;

        if (arrTemp['account_type'] == 'Posting' && $scope.total[number] > 0) {

            $scope.totals = $scope.total[number];



            if ($scope.arrCatTotal[cat_id] > 0 && $scope.totals > 0)

                $scope.arrCatTotal[cat_id] = $scope.arrCatTotal[cat_id] + $scope.totals;

            else if ($scope.totals > 0)

                $scope.arrCatTotal[cat_id] = $scope.totals;

        }

        if (arrTemp['account_type'] == 'End-Total') {

            if ($scope.arrCatTotal[cat_id] > 0)

                $scope.totals = $scope.arrCatTotal[cat_id];



            if ($scope.grand_total > 0 && $scope.totals > 0)

                $scope.grand_total = $scope.grand_total + $scope.totals;

            else if ($scope.totals > 0)

                $scope.grand_total = $scope.totals;



        }

    }





    $scope.delete = function(id, index, arr_data) {

        var delUrl = $scope.$root.gl + "chart-accounts/delete-gl";

        ngDialog.openConfirm({

            template: 'modalDeleteDialogId',

            className: 'ngdialog-theme-default-custom'

        }).then(function(value) {

            $http

                .post(delUrl, { id: id, 'token': $scope.$root.token })

            .then(function(res) {



                if (res.data.ack == true) {

                    toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));

                    arr_data.splice(index, 1);

                    $timeout(function() {

                        $state.go('app.general_ledger');

                    }, 3000);

                } else {

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(108));

                }

            });

        }, function(reason) {

            // console.log('Modal promise rejected. Reason: ', reason);

        });



    };



    $scope.supplier_pop = function(id) {





        $scope.show_supplier_pop = true;

        angular.element('#model_btn_supplier_id').click();



        var postUrl = $scope.$root.gl + "chart-accounts/get-gl-popup";

        var postViewData = {

            'token': $scope.$root.token,

            'id': id

        };



        $http

            .post(postUrl, postViewData)

        .then(function(res) {



            $scope.columnss = [];

            $scope.record = [];

            $scope.record = res.data.response;

            $scope.total_final = res.data.total_final;

            angular.forEach(res.data.response[0], function(val, index) {

                $scope.columnss.push({

                    'title': toTitleCase(index),

                    'field': index,

                    'visible': true

                });

            });





        });

    }

}

myApp.controller('GlControllerEdit', GlControllerEdit);

function GlControllerEdit($scope, $stateParams, $http, $state, $resource, toaster, Calendar, $window, ngDialog, $timeout) {





    var vm = this;

    $scope.formData = {};

    $scope.rec = {};

    $scope.datePicker = Calendar.get_caledar();





    $scope.class = 'inline_block';



    $scope.btnCancelUrl = 'app.general_ledger';

    $scope.showLoader = true;



    $scope.status_data = {};

    $scope.status_data = [{ name: 'Active', id: 1 }, { name: 'Inactive', id: 0 }];

    $scope.formData.statuss = $scope.status_data[0];



    $scope.account_type_list = {};

    $scope.account_type_list = [{ name: 'Posting', id: 1 }, { name: 'Heading', id: 2 }, { name: 'Begin-Total', id: 3 }

        , { name: 'End-Total', id: 4 }
    ];



    $scope.posting_list = {};

    $scope.posting_list = [{ name: 'Balance sheet', id: 1 }, { name: 'Profit & Loass', id: 2 }];



    $scope.transcation_list = {};

    $scope.transcation_list = [{ name: 'Debit', id: 1 }, { name: 'Credit', id: 2 }, { name: 'Both', id: 2 }];





    $scope.category_list = {};

    $scope.category_sub = {};

    $scope.category_list_data_one = {};

    $scope.category_list_data_second = {};

    $scope.category_list_data_third = {};





    var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";

    var postUrl_list = $scope.$root.gl + "chart-accounts/get-list-one";

    var postUrl_parent = $scope.$root.gl + "chart-accounts/get-parent";

    var postUrl_code = $scope.$root.gl + "chart-accounts/get_new_number";

    var vatUrl = $scope.$root.hr + "hr_values/get-vat";

    var DetailsURL = $scope.$root.gl + "chart-accounts/get-account-heads";





    $http

        .post(postUrl_cat, { 'token': $scope.$root.token })

    .then(function(res) {

        if (res.data.ack == true)

            $scope.category_list = res.data.response;

        $scope.category_sub = res.data.response_new;

        $scope.category_list_data_one = res.data.response_account;

        $scope.category_list_data_second = res.data.response_account;

        $scope.category_list_data_third = res.data.response_account;



    });



    $scope.category_sub_list = {};

    $scope.get_parent = function() {



        var id = this.formData.gl_category_ids.id;

        // $scope.parent_show= false;  

        $http

            .post(postUrl_parent, { 'token': $scope.$root.token, id: id })

        .then(function(res) {

            if (res.data.ack == true) {

                $scope.category_sub_list = res.data.response_new;



                $scope.formData.number = res.data.response.code;

                $scope.number = res.data.response.code;

            }

        });

    }





    $scope.category_list_one = {};

    $scope.category_list_second = {};

    $scope.category_list_third = {};



    $scope.get_list_one = function(arg) {



        if (arg == 11)

            var id = this.formData.category_ids.id;

        else if (arg == 1)

            var pid = this.formData.level_ones.id;

        else if (arg == 2)

            var pid = this.formData.level_seconds.id;



        $http

            .post(postUrl_list, { 'token': $scope.$root.token, 'id': id, 'pid': pid })

        .then(function(res) {

            if (res.data.ack == true) {

                console.log(pid);



                if (arg == 11)

                    $scope.category_list_one = res.data.response_one;

                else if (arg == 1)

                    $scope.category_list_second = res.data.response_two;

                else if (arg == 2)

                    $scope.category_list_third = res.data.response_three;



            }

        });

    }





    $scope.number = '';

    $http

        .post(postUrl_code, { 'token': $scope.$root.token })

    .then(function(res) {

        if (res.data.ack == true) {

            $scope.formData.number = res.data.response.code;

            $scope.number = res.data.response.code;

            // console.log($scope.number);

        }

    });





    $scope.vat_gl_list = {};

    $http

        .post(vatUrl, { 'token': $scope.$root.token })

    .then(function(res) {

        if (res.data.ack == true) {

            $scope.vat_gl_list = res.data.response;

        }

    });



    $scope.onChangeAccounttype = function() {



        var id = this.formData.account_types.id;

        // console.log(id );

        $scope.show_cat = true;

        if (id == 2) {

            $scope.show_cat = false;

        }



    }





    var DetailsURL = $scope.$root.gl + "chart-accounts/get-account-heads";



    //--------------------- start General   ------------------------------------------





    $scope.show_pop = function(formData, abc) {

        console.log("here in edit");

        angular.element('#modal_add_pop').modal({

            show: true

        });

    };



    $scope.show_add_pop = function(parent_id, cid, one, scd, level) {



        angular.element('#modal_add_pop').modal({

            show: true

        });

        $scope.formData = {};

        //console.log("here");



        $timeout(function() {



            // angular.element('#Date').val(), 

            //  console.log(parent_id);  console.log(cid);	 console.log(one);	 console.log(scd); console.log(level);





            if ($stateParams.id === undefined) {

                if (level > 0) {

                    /*if(cid==null)  cid =0;

                     if(one==null)  one =0;

                     if(scd==null) scd =0;*/



                    var level_id = level;



                    $.each($scope.category_list, function(index, obj) {

                        if (obj.id == parent_id) {

                            $scope.formData.gl_category_ids = $scope.category_list[index];

                        }

                    });



                    $http

                        .post(postUrl_parent, { 'token': $scope.$root.token, id: parent_id, pid: 0 })

                    .then(function(res) {

                        if (res.data.ack == true) {

                            $scope.category_sub_list = res.data.response_new;



                            $.each($scope.category_sub_list, function(index, obj) {

                                if (obj.id == cid) {

                                    $scope.formData.category_ids = $scope.category_sub_list[index];



                                }

                            });

                        }

                    });





                    $http

                        .post(postUrl_list, { 'token': $scope.$root.token, id: cid, pid: 0 })

                    .then(function(res) {

                        if (res.data.ack == true) {



                            $scope.category_list_one = res.data.response_one;

                            $.each($scope.category_list_one, function(index, obj) {

                                if (obj.id == one) {

                                    $scope.formData.level_ones = $scope.category_list_one[index];

                                }

                            });

                        }



                    });



                    $http

                        .post(postUrl_list, { 'token': $scope.$root.token, id: 0, pid: one })

                    .then(function(res) {

                        if (res.data.ack == true) {



                            $scope.category_list_second = res.data.response_two;



                            $.each($scope.category_list_second, function(index, obj) {

                                if (obj.id == scd) {

                                    $scope.formData.level_seconds = $scope.category_list_second[index];

                                }

                            });

                        }



                    });





                }

            }



            if ($stateParams.id !== undefined) {

                $http

                    .post(DetailsURL, { 'token': $scope.$root.token, 'gl_id': $stateParams.id })

                .then(function(res) {

                    if (res.data.ack == true) {

                        $scope.formData = res.data.response;



                        if (res.data.response.account_type != 2)

                            $scope.show_cat = true;

                        if (res.data.response.number == 0)

                            $scope.formData.number = $scope.number;

                        $.each($scope.vat_gl_list, function(index, obj) {

                            if (obj.id == res.data.response.vat_list_id) {

                                $scope.formData.vat_list_ids = $scope.vat_gl_list[index];

                            }

                        });

                        $.each($scope.transcation_list, function(index, obj) {

                            if (res.data.response.transcation_type) {

                                if (obj.id == res.data.response.transcation_type) {

                                    $scope.formData.transcation_types = $scope.transcation_list[index];

                                }

                            }

                        });



                        angular.forEach($scope.vatAccountOption, function(obj) {

                            if (obj.id == res.data.response.vatBankType)

                                $scope.formData.vataccount = obj;

                        });





                        $.each($scope.status_data, function(index, obj) {

                            if (obj.id == 1) { //res.data.response.status

                                $scope.formData.statuss = $scope.status_data[index];

                            }

                        });

                        //	if(level>0){



                        var id = res.data.response.gl_category_id;

                        if (cid == null)

                            cid = res.data.response.category_id;

                        var pid = res.data.response.parent_id;

                        if (one == null)

                            one = res.data.response.level_one;

                        if (scd == null)

                            scd = res.data.response.level_second;

                        var trd = res.data.response.level_third;

                        var level_id = 0;

                        if (1 == res.data.response.level)

                            level_id = 1;

                        if (2 == res.data.response.level)

                            level_id = 2;

                        if (3 == res.data.response.level)

                            level_id = 3;



                        $.each($scope.category_list, function(index, obj) {

                            if (obj.id == parent_id) {

                                $scope.formData.gl_category_ids = $scope.category_list[index];

                            }

                        });

                        $http

                            .post(postUrl_parent, { 'token': $scope.$root.token, id: parent_id, pid: 0 })

                        .then(function(res) {

                            if (res.data.ack == true) {

                                $scope.category_sub_list = res.data.response_new;



                                $.each($scope.category_sub_list, function(index, obj) {

                                    if (obj.id == cid) {

                                        $scope.formData.category_ids = $scope.category_sub_list[index];



                                    }

                                });

                            }

                        });

                        $http

                            .post(postUrl_list, { 'token': $scope.$root.token, id: cid, pid: 0 })

                        .then(function(res) {

                            if (res.data.ack == true) {



                                $scope.category_list_one = res.data.response_one;

                                //	console.log(	$scope.category_list_one);



                                $.each($scope.category_list_one, function(index, obj) {

                                    //	console.log(	obj.id == one);

                                    if (obj.id == one) {

                                        $scope.formData.level_ones = $scope.category_list_one[index];

                                        //	console.log($scope.formData.level_ones);

                                    }

                                });

                            }



                        });



                        $http

                            .post(postUrl_list, { 'token': $scope.$root.token, id: 0, pid: one })

                        .then(function(res) {

                            if (res.data.ack == true) {



                                $scope.category_list_second = res.data.response_two;



                                $.each($scope.category_list_second, function(index, obj) {

                                    if (obj.id == scd) {

                                        $scope.formData.level_seconds = $scope.category_list_second[index];

                                    }

                                });

                            }



                        });



                        $http

                            .post(postUrl_list, { 'token': $scope.$root.token, id: 0, pid: scd })

                        .then(function(res) {

                            if (res.data.ack == true) {



                                $scope.category_list_third = res.data.response_three;

                                if (level_id > 0) {

                                    $.each($scope.category_list_third, function(index, obj) {

                                        if (obj.id == trd) {

                                            $scope.formData.level_thirds = $scope.category_list_third[index];

                                        }

                                    });

                                }

                            }

                        });

                        //	}

                    }
                });
            }

            $scope.level_test = level;

            $http
                .post(postUrl_code, { 'token': $scope.$root.token })
                .then(function(res) {
                    $scope.formData.number = res.data.response.code;
                });
        }, 1000);
    };

    $scope.addGeneral = function(formData) {
            var updateUrl = $scope.$root.gl + "chart-accounts/add_account_values";
            $scope.formData = formData;
            $scope.formData.gl_id = $stateParams.id;
            $scope.formData.tab_id_2 = 1;
            $scope.formData.token = $scope.$root.token;
            $scope.showLoader = true;

            $scope.formData.catgeory_id = $scope.formData.catgeory !== undefined ? $scope.formData.catgeory.id : 0;
            $scope.formData.subCatgegory_id = $scope.formData.subCatgegory !== undefined ? $scope.formData.subCatgegory.id : 0;
            $scope.formData.gl_category_id = $scope.formData.gl_category_ids !== undefined ? $scope.formData.gl_category_ids.id : 0;
            $scope.formData.category_id = $scope.formData.category_ids !== undefined ? $scope.formData.category_ids.id : 0;
            $scope.formData.level_one = $scope.formData.level_ones !== undefined ? $scope.formData.level_ones.id : 0;
            $scope.formData.level_second = $scope.formData.level_seconds !== undefined ? $scope.formData.level_seconds.id : 0;
            $scope.formData.level_third = $scope.formData.level_thirds !== undefined ? $scope.formData.level_thirds.id : 0;
            $scope.formData.account_types = $scope.formData.account_type !== undefined ? $scope.formData.account_type.id : 0;
            $scope.formData.transcation_type = $scope.formData.transcation_types !== undefined ? $scope.formData.transcation_types.id : 0;
            $scope.formData.vataccounts = ($scope.formData.vataccount !== undefined && $scope.formData.vataccount != '') ? $scope.formData.vataccount.id : 0;
            $scope.formData.status = $scope.formData.statuss !== undefined ? $scope.formData.statuss.id : 0;
            $scope.formData.vat_list_id = $scope.formData.vat_list_ids !== undefined ? $scope.formData.vat_list_ids.id : 0;

            if ($scope.formData.vat_list_id == 0) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['VAT Rate']));
                $scope.showLoader = false;
                return false;
            }

            if ($scope.formData.number.length == 0) {
                toaster.pop('error', 'Info', 'G/L No. is not empty!');
                $scope.showLoader = false;
                return false;
            }

            if ($scope.formData.name.length == 0) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Name']));
                $scope.showLoader = false;
                return false;
            }

            if ($scope.formData.account_types == 0) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Transaction Type']));
                $scope.showLoader = false;
                return false;
            }

            $http
                .post(updateUrl, $scope.formData)
                .then(function(res) {
                    $scope.showLoader = false;

                    if (res.data.ack == true) {
                        $scope.formData.gl = res.data.gl_id;
                        toaster.pop('success', res.data.info, res.data.msg);
                        angular.element('#modal_add_pop').modal('hide');

                        if (res.data.info == 'Add') {
                            $timeout(function() {
                                $state.go("app.edit_gl", { id: res.data.gl_id });
                            }, 2000);

                        } else {
                            $timeout(function() {
                                $state.reload();
                            }, 2000);
                        }
                    } else
                        toaster.pop('error', res.data.info, res.data.msg);
                });
        }
        //--------------------- End General   ------------------------------------------
}

myApp.controller('GlControllerTREE', GlControllerTREE);

function GlControllerTREE($scope, $stateParams, $http, $state, $resource, toaster, Calendar, $window, ngDialog, $timeout, $rootScope, jsreportService) {
    //Roles and Permissions code

    if ($scope.receipt_type == 0) { // General Journal

        $scope.addPerm = $scope.$root.allowaddgen_journal;

        $scope.editPerm = $scope.$root.alloweditgen_journal;

        $scope.deletePerm = $scope.$root.allowdeletegen_journal;

        $scope.viewPerm = $scope.$root.allowviewgen_journal;

        $scope.postPerm = $scope.$root.allowpostgen_journal;

    } else if ($scope.receipt_type == 1) { // Customer Journal

        $scope.addPerm = $scope.$root.allowaddcust_journal;

        $scope.editPerm = $scope.$root.alloweditcust_journal;

        $scope.deletePerm = $scope.$root.allowdeletecust_journal;

        $scope.viewPerm = $scope.$root.allowviewcust_journal;

        $scope.postPerm = $scope.$root.allowpostcust_journal;

    } else if ($scope.receipt_type == 2) { // Supplier Journal

        $scope.addPerm = $scope.$root.allowaddsupp_journal;

        $scope.editPerm = $scope.$root.alloweditsupp_journal;

        $scope.deletePerm = $scope.$root.allowdeletesupp_journal;

        $scope.viewPerm = $scope.$root.allowviewsupp_journal;

        $scope.postPerm = $scope.$root.allowpostsupp_journal;

    }



    if ($scope.receipt_type == 3) {

        $scope.addPerm = $scope.$root.allowadditem_journal;

        $scope.editPerm = $scope.$root.allowedititem_journal;

        $scope.deletePerm = $scope.$root.allowdeleteitem_journal;

        $scope.viewPerm = $scope.$root.allowviewitem_journal;

        $scope.postPerm = $scope.$root.allowpostitem_journal;

    }



    $scope.show_tree = true;

    $scope.show_list = false;

    $scope.readonly_posted_journal = true;

    $scope.showJournalEditForm = function() {
        $scope.readonly_posted_journal = false;
    }

    $scope.savePostedJournal = function() {
        $scope.showLoader = true;
        $scope.postedInvRec = [];

        angular.forEach($scope.receipt_sub_list, function(obj) {

            // console.log('obj == ', obj);
            let newObj = {};

            newObj.id = obj.id;
            newObj.posting_date = obj.posting_date;
            newObj.document_no = obj.document_no;
            newObj.account_name = obj.account_name;

            if (obj.module_type != undefined)
                newObj.transaction_type = obj.module_type.value;
            else
                newObj.transaction_type = 0;

            $scope.postedInvRec.push(newObj);
        });

        // console.log('postedInvRec == ', $scope.postedInvRec);

        var updateUrlPostedJournal = $scope.$root.gl + "chart-accounts/update-posted-journal";

        var post = {};
        post.selectdata = $scope.postedInvRec;
        post.parent_id = $scope.parent_id;
        post.token = $scope.$root.token;
        post.type = 1;

        $scope.readonly_posted_journal = true;

        // let is_post = 0;

        $http
            .post(updateUrlPostedJournal, post)
            .then(function(res) {

                $scope.showLoader = false;

                if (res.data.ack == true) {
                    toaster.pop('success', 'Add', res.data.error);

                    $timeout(function() {
                        $scope.get_receipt_main_list(1);
                    }, 2000);

                    return true;
                } else {
                    return false;
                }
            });
    }


    var vm = this;
    $scope.formData = {};
    $scope.rec = {};
    $scope.class = 'inline_block';
    $scope.btnCancelUrl = 'app.general_ledger';

    $scope.status_data = {};
    $scope.status_data = [{ name: 'Active', id: 1 }, { name: 'Inactive', id: 0 }];
    $scope.formData.statuss = $scope.status_data[0];

    $scope.account_type_list = {};

    $scope.account_type_list = [
        { name: 'Posting', id: 1 },
        { name: 'Heading', id: 2 },
        { name: 'Begin-Total', id: 3 },
        { name: 'End-Total', id: 4 }
    ];


    $scope.posting_list = {};
    $scope.posting_list = [{ name: 'Balance sheet', id: 1 }, { name: 'Profit & Loass', id: 2 }];

    $scope.transcation_list = {};
    $scope.transcation_list = [{ name: 'Debit', id: 1 }, { name: 'Credit', id: 2 }, { name: 'Both', id: 2 }];

    $scope.category_list = {};
    $scope.category_sub = {};
    $scope.category_list_data_one = {};
    $scope.category_list_data_second = {};
    $scope.category_list_data_third = {};

    var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";
    var postUrl_code = $scope.$root.gl + "chart-accounts/get_new_number";
    var postUrl_parent = $scope.$root.gl + "chart-accounts/get-parent";
    var postUrl_list = $scope.$root.gl + "chart-accounts/get-list-one";
    var vatUrl = $scope.$root.hr + "hr_values/get-vat";
    var DetailsURL = $scope.$root.gl + "chart-accounts/get-account-heads";

    $scope.category_sub_list = {};
    $scope.get_parent = function() {

        var id = this.formData.gl_category_ids.id;

        $http
            .post(postUrl_parent, { 'token': $scope.$root.token, id: id })
            .then(function(res) {
                if (res.data.ack == true) {
                    $scope.category_sub_list = res.data.response_new;
                    $scope.formData.number = res.data.response.code;
                    $scope.number = res.data.response.code;
                }
            });
    }

    $scope.category_list_one = {};
    $scope.category_list_second = {};
    $scope.category_list_third = {};

    $scope.get_list_one = function(arg) {

        if (arg == 11)
            var id = this.formData.category_ids.id;
        else if (arg == 1)
            var pid = this.formData.level_ones.id;
        else if (arg == 2)
            var pid = this.formData.level_seconds.id;

        $http
            .post(postUrl_list, { 'token': $scope.$root.token, 'id': id, 'pid': pid })
            .then(function(res) {
                if (res.data.ack == true) {

                    if (arg == 11)
                        $scope.category_list_one = res.data.response_one;
                    else if (arg == 1)
                        $scope.category_list_second = res.data.response_two;
                    else if (arg == 2)
                        $scope.category_list_third = res.data.response_three;
                }
            });
    }

    $scope.vat_gl_list = {};

    $http
        .post(vatUrl, { 'token': $scope.$root.token })
        .then(function(res) {
            if (res.data.ack == true) {
                $scope.vat_gl_list = res.data.response;
            }
        });

    $scope.onChangeAccounttype = function() {
        var id = this.formData.account_types.id;
        $scope.show_cat = true;

        if (id == 2) {
            $scope.show_cat = false;
        }
    }

    $scope.gotoEdit = function() {
        $scope.perreadonly = true;
        $scope.check_gl_readonly = false;
    };
    //--------------------- start General   ------------------------------------------

    $scope.perreadonly = true;
    $scope.check_gl_readonly = false;

    $scope.show_add_pop = function(parent_id, cid, one, scd, level, record_id, trd) {
        $scope.formData = {};
        $scope.level_test = 0;
        $scope.record_id = 0;

        angular.element('#modal_add_pop').modal({
            show: true
        });

        $timeout(function() {

            if (record_id === '') {

                $scope.perreadonly = true;
                $scope.check_gl_readonly = false;

                if (level > 0) {
                    var level_id = level;

                    $.each($scope.category_list, function(index, obj) {
                        if (obj.id == parent_id) {
                            $scope.formData.gl_category_ids = $scope.category_list[index];
                            console.log($scope.formData.gl_category_ids);
                        }
                    });

                    $http
                        .post(postUrl_parent, { 'token': $scope.$root.token, id: parent_id, pid: 0 })
                        .then(function(res) {
                            if (res.data.ack == true) {
                                $scope.category_sub_list = res.data.response_new;

                                $.each($scope.category_sub_list, function(index, obj) {
                                    if (obj.id == cid) {
                                        $scope.formData.category_ids = $scope.category_sub_list[index];
                                    }
                                });
                            }
                        });

                    $http
                        .post(postUrl_list, { 'token': $scope.$root.token, id: cid, pid: 0 })
                        .then(function(res) {
                            if (res.data.ack == true) {
                                $scope.category_list_one = res.data.response_one;
                                $.each($scope.category_list_one, function(index, obj) {
                                    if (obj.id == one) {
                                        $scope.formData.level_ones = $scope.category_list_one[index];
                                    }
                                });
                            }
                        });

                    $http
                        .post(postUrl_list, { 'token': $scope.$root.token, id: 0, pid: one })
                        .then(function(res) {
                            if (res.data.ack == true) {
                                $scope.category_list_second = res.data.response_two;

                                $.each($scope.category_list_second, function(index, obj) {
                                    if (obj.id == scd) {
                                        $scope.formData.level_seconds = $scope.category_list_second[index];
                                    }
                                });
                            }
                        });

                    $http
                        .post(postUrl_list, { 'token': $scope.$root.token, id: 0, pid: scd })
                        .then(function(res) {
                            if (res.data.ack == true) {
                                $scope.category_list_third = res.data.response_three;

                                $.each($scope.category_list_third, function(index, obj) {
                                    if (obj.id == trd) {
                                        $scope.formData.level_thirds = $scope.category_list_third[index];
                                    }
                                });
                            }
                        });
                }
            }

            if (record_id !== undefined) {

                $http
                    .post(DetailsURL, { 'token': $scope.$root.token, 'gl_id': record_id })
                    .then(function(res) {
                        if (res.data.ack == true) {
                            $scope.formData = res.data.response;

                            if (res.data.response.account_type != 2)
                                $scope.show_cat = true;

                            if (res.data.response.number == 0)
                                $scope.formData.number = $scope.number;

                            $.each($scope.vat_gl_list, function(index, obj) {
                                if (obj.id == res.data.response.vat_list_id) {
                                    $scope.formData.vat_list_ids = $scope.vat_gl_list[index];
                                }
                            });

                            $.each($scope.transcation_list, function(index, obj) {
                                if (res.data.response.transcation_type) {
                                    if (obj.id == res.data.response.transcation_type) {
                                        $scope.formData.transcation_types = $scope.transcation_list[index];
                                    }
                                }
                            });

                            angular.forEach($scope.vatAccountOption, function(obj) {
                                if (obj.id == res.data.response.vatBankType)
                                    $scope.formData.vataccount = obj;
                            });

                            $.each($scope.status_data, function(index, obj) {
                                if (obj.id == 1) {
                                    $scope.formData.statuss = $scope.status_data[index];
                                }
                            });

                            var id = res.data.response.gl_category_id;

                            if (cid == null)
                                cid = res.data.response.category_id;

                            var pid = res.data.response.parent_id;

                            if (one == null)
                                one = res.data.response.level_one;

                            if (scd == null)
                                scd = res.data.response.level_second;

                            var trd = res.data.response.level_third;

                            var level_id = 0;

                            if (1 == res.data.response.level)
                                level_id = 1;

                            if (2 == res.data.response.level)
                                level_id = 2;

                            if (3 == res.data.response.level)
                                level_id = 3;

                            $.each($scope.category_list, function(index, obj) {
                                if (obj.id == parent_id) {
                                    $scope.formData.gl_category_ids = $scope.category_list[index];
                                }
                            });

                            $http
                                .post(postUrl_parent, { 'token': $scope.$root.token, id: parent_id, pid: 0 })
                                .then(function(res) {
                                    if (res.data.ack == true) {
                                        $scope.category_sub_list = res.data.response_new;

                                        $.each($scope.category_sub_list, function(index, obj) {
                                            if (obj.id == cid) {
                                                $scope.formData.category_ids = $scope.category_sub_list[index];
                                            }
                                        });
                                    }
                                });

                            $http
                                .post(postUrl_list, { 'token': $scope.$root.token, id: cid, pid: 0 })
                                .then(function(res) {
                                    if (res.data.ack == true) {
                                        $scope.category_list_one = res.data.response_one;

                                        $.each($scope.category_list_one, function(index, obj) {
                                            if (obj.id == one) {
                                                $scope.formData.level_ones = $scope.category_list_one[index];
                                            }
                                        });
                                    }
                                });

                            $http
                                .post(postUrl_list, { 'token': $scope.$root.token, id: 0, pid: one })
                                .then(function(res) {
                                    if (res.data.ack == true) {
                                        $scope.category_list_second = res.data.response_two;

                                        $.each($scope.category_list_second, function(index, obj) {
                                            if (obj.id == scd) {
                                                $scope.formData.level_seconds = $scope.category_list_second[index];
                                            }
                                        });
                                    }
                                });

                            $http
                                .post(postUrl_list, { 'token': $scope.$root.token, id: 0, pid: scd })
                                .then(function(res) {
                                    if (res.data.ack == true) {
                                        $scope.category_list_third = res.data.response_three;

                                        if (level_id > 0) {
                                            $.each($scope.category_list_third, function(index, obj) {
                                                if (obj.id == trd) {
                                                    $scope.formData.level_thirds = $scope.category_list_third[index];
                                                }
                                            });
                                        }
                                    }
                                });
                        }
                    });
            }

            $scope.level_test = level;
            $scope.record_id = record_id;

            $http
                .post(postUrl_code, { 'token': $scope.$root.token })
                .then(function(res) {
                    $scope.formData.number = res.data.response.code;
                });
        }, 1000);
    };

    $scope.toggleVisibility = function(node) {
        console.log(node);

        if (node.children) {
            node.childrenVisibility = !node.childrenVisibility;
        }
    };

    $scope.addGeneral = function(formData) {

        var updateUrl = $scope.$root.gl + "chart-accounts/add_account_values";
        $scope.formData = formData;
        $scope.formData.gl_id = $scope.record_id;
        $scope.formData.tab_id_2 = 1;
        $scope.formData.token = $scope.$root.token;

        $scope.formData.gl_category_id = $scope.formData.gl_category_ids !== undefined ? $scope.formData.gl_category_ids.id : 0;
        $scope.formData.category_id = $scope.formData.category_ids !== undefined ? $scope.formData.category_ids.id : 0;
        $scope.formData.level_one = $scope.formData.level_ones !== undefined ? $scope.formData.level_ones.id : 0;
        $scope.formData.level_second = $scope.formData.level_seconds !== undefined ? $scope.formData.level_seconds.id : 0;
        $scope.formData.level_third = $scope.formData.level_thirds !== undefined ? $scope.formData.level_thirds.id : 0;
        $scope.formData.account_type = $scope.formData.account_types !== undefined ? $scope.formData.account_types.id : 0;
        $scope.formData.transcation_type = $scope.formData.transcation_types !== undefined ? $scope.formData.transcation_types.id : 0;
        $scope.formData.vataccounts = ($scope.formData.vataccount !== undefined && $scope.formData.vataccount != '') ? $scope.formData.vataccount.id : 0;
        $scope.formData.status = $scope.formData.statuss !== undefined ? $scope.formData.statuss.id : 0;
        $scope.formData.vat_list_id = $scope.formData.vat_list_ids !== undefined ? $scope.formData.vat_list_ids.id : 0;

        $http
            .post(updateUrl, $scope.formData)
            .then(function(res) {
                if (res.data.ack == true) {
                    $scope.formData.gl = res.data.gl_id;
                    toaster.pop('success', res.data.info, res.data.msg);
                    angular.element('#modal_add_pop').modal('hide');

                    $timeout(function() {
                        $state.reload();
                    }, 2000);
                } else
                    toaster.pop('error', res.data.info, res.data.msg);
            });
    }

    $scope.delete = function(id) {

        var delUrl = $scope.$root.gl + "chart-accounts/delete-gl";

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function(value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function(res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));

                        $timeout(function() {
                            $state.reload();
                        }, 2000);

                    } else {
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(108));
                    }
                });

        }, function(reason) {

            // console.log('Modal promise rejected. Reason: ', reason);

        });



    }

    //--------------------- End General   ------------------------------------------



    $scope.printxlsx = function(_reportData, _shortId, _reportType = 'xlsx') {

        $scope.showLoader = true;

        var _data = {

            account_list: _reportData,

            _reportType: "xlsx",

            company_logo_url: $scope.company_logo_url,

            debit_credit_diff: $scope.debit_credit_diff,

            generalNo: $scope.array_receipt_gl_form.acc_code,

            reportTitle: $scope.breadcrumbs[1].name

        }

        jsreportService.downloadXlsx(_data, _shortId).success(function(data) {

            let file = new Blob([data], { type: 'application/xlsx' });

            saveAs(file, $scope.breadcrumbs[1].name + ".xlsx");

            $scope.showLoader = false;

        })

    }

    $scope.printPdf = function(_reportData, _shortId, _reportType = 'pdf') {

        $scope.showLoader = true;

        let currentUrl = window.location.href;

        $scope.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;



        var data = {

            account_list: _reportData,

            _reportType: _reportType,

            company_logo_url: $scope.company_logo_url,

            debit_credit_diff: $scope.debit_credit_diff,

            generalNo: $scope.array_receipt_gl_form.acc_code,

            reportTitle: $scope.breadcrumbs[1].name

        }



        console.log("General Journal: ", data);

        console.log("General Journal: ", $scope.array_receipt_gl_form);

        $http({

            url: $rootScope.jsreports,

            method: 'POST',

            params: {},

            data: {

                "template": {

                    "phantom": {

                        orientation: "landscape"

                    },

                    "shortid": _shortId

                },

                "data": data



            },

            headers: {

                'Content-type': 'application/json',
                "Authorization": "Basic " + btoa("admin:admin123"),

            },

            responseType: 'arraybuffer'

        })

        .success(function(data) {

            $scope.showLoader = false;

            // console.log("success jsreport...", typeof (data));



            var file = new Blob([data], { type: 'application/pdf' });

            saveAs(file, $scope.breadcrumbs[1].name);



        });

    }





}





/*=============GL Recipt  =============================================*/

myApp.controller('journalcustomerapply', journalcustomerapply);

function journalcustomerapply(ser1, dataService, $scope, $state) {

    $scope.data = dataService.dataObj;

    $scope.open_customer = function(arg) {

        $scope.data.id = arg;

        if (arg == 1)

            $state.go("app.receipt-journal-gl-cust", {}, { reload: true });

        else if (arg == 2)

            $state.go("app.receipt-journal-gl-supp", {}, { reload: true });

        else if (arg == 3)

            $state.go("app.receipt-journal-gl-item", {}, { reload: true });

        else if (arg == 4)

            $state.go("app.receipt-journal-gl-cust-posted", { isPosted: 1 }, { reload: true });

        else if (arg == 5)

            $state.go("app.receipt-journal-gl-supp-posted", { isPosted: 1 }, { reload: true });

        else if (arg == 6)

            $state.go("app.receipt-journal-gl-item-posted", { isPosted: 1 }, { reload: true });

    }

}



myApp.controller('GlControllerReceipt', GlControllerReceipt);

function GlControllerReceipt($scope, $stateParams, $http, $state, $resource, toaster, $window, ngDialog, dataService, $rootScope, $timeout, $filter) {



    $scope.receipt_type = 0;

    $scope.sub_module_type = 0;



    // console.log($stateParams.module);

    // console.log($state.current.name);



    if ($state.current.name == 'app.receipt-journal-gl' || $state.current.name == 'app.view-receipt-journal-gl') {

        $scope.receipt_type = 0;



        $scope.breadcrumbs = [{ 'name': 'Finance', 'url': '#', 'isActive': false },

            { 'name': 'General Journal ', 'url': '#', 'isActive': false }
        ];

    } else if ($state.current.name == 'app.receipt-journal-gl-posted') {

        $scope.receipt_type = 0;



        $scope.breadcrumbs = [{ 'name': 'Finance', 'url': '#', 'isActive': false },

            { 'name': 'Posted General Journal ', 'url': '#', 'isActive': false }
        ];

    } else if ($state.current.name == 'app.receipt-journal-gl-cust' || $state.current.name == 'app.view-receipt-journal-gl-cust') {

        $scope.receipt_type = 1;

        $scope.moduleName = 'customer';

        $scope.breadcrumbs = [{ 'name': 'Sales', 'url': '#', 'isActive': false },

            { 'name': 'Customer Journal ', 'url': '#', 'isActive': false }
        ];

    } else if ($state.current.name == 'app.receipt-journal-gl-cust-posted') {

        $scope.receipt_type = 1;

        $scope.moduleName = 'customer';

        $scope.breadcrumbs = [{ 'name': 'Sales', 'url': '#', 'isActive': false },

            { 'name': 'Posted Customer Journal ', 'url': '#', 'isActive': false }
        ];

    } else if ($state.current.name == 'app.receipt-journal-gl-supp' || $state.current.name == 'app.view-receipt-journal-gl-supp') {

        $scope.receipt_type = 2;

        $scope.moduleName = 'supplier';

        $scope.breadcrumbs = [{ 'name': 'Purchases', 'url': '#', 'isActive': false },

            { 'name': 'Supplier Journal ', 'url': '#', 'isActive': false }
        ];

    } else if ($state.current.name == 'app.receipt-journal-gl-supp-posted') {

        $scope.receipt_type = 2;

        $scope.moduleName = 'supplier';

        $scope.breadcrumbs = [{ 'name': 'Purchases', 'url': '#', 'isActive': false },

            { 'name': 'Posted Supplier Journal ', 'url': '#', 'isActive': false }
        ];

    } else if ($state.current.name == 'app.receipt-journal-gl-item' || $state.current.name == 'app.view-receipt-journal-gl-item') {

        $scope.receipt_type = 3;



        $scope.breadcrumbs = [{ 'name': 'Inventory', 'url': 'app.item', 'isActive': false },

            { 'name': 'Item Journal ', 'url': '#', 'isActive': false }
        ];

    } else if ($state.current.name == 'app.receipt-journal-gl-item-posted') {

        $scope.receipt_type = 3;



        $scope.breadcrumbs = [{ 'name': 'Inventory', 'url': 'app.item', 'isActive': false },

            { 'name': 'Posted Item Journal ', 'url': '#', 'isActive': false }
        ];

    }



    $scope.receipt_gl_list = true;

    $scope.receipt_gl_form = false;



    $scope.array_submit_jurnal = {};

    $scope.columns_journal = [];

    $scope.discount_type_array = {};

    $scope.discount_type_array = [{ value: '2', name: 'Debit' }, { value: '1', name: 'Credit' }];

    $scope.sale_type_array = {};

    $scope.sale_type_array = [{ value: '1', name: 'G/L No.' }, { value: '2', name: 'Customer' }, { value: '3', name: 'Supplier' }];



    $scope.sale_type_array_item = [{ value: '1', name: 'Positive Entry' }, { value: '2', name: 'Negative Entry' }];



    /* $scope.repeat_arr = {};

     $scope.repeat_arr = [ {value: '1', name: 'Monthly'},{value: '1', name: 'Weekly'},{value: '3', name: 'Daily'}];

     */

    ///gl/chart-accounts/on-change-temp

    $scope.template_arr = {};

    var gettemppUrl = $scope.$root.gl + "chart-accounts/get-template-gl-list";

    $http

        .post(gettemppUrl, { 'token': $scope.$root.token, 'journal_type': $scope.receipt_type })

    .then(function(res) {

        if (res.data.ack == true)

            $scope.template_arr = res.data.response;



    });



    $scope.updateWarehouseLoc = function(storageLoc, item) {



        // console.log(item);

        // console.log(storageLoc);



        if (storageLoc.id > 0 && storageLoc.pwlID > 0)

            item.prodStorageLocID = storageLoc.pwlID;

    }





    $scope.getWarehouseLoc = function(wrhid, item, storageLocID) {

        // console.log(wrhid);

        // console.log(item);

        item.storageLoc = {};



        if (wrhid > 0) {



            // var postUrl = $scope.$root.setup + "warehouse/get-loc-by-warehouse-id-in-item";

            var postUrl = $scope.$root.setup + "warehouse/get-loc-by-warehouse-id-link-to-item";

            var post = {};

            post.token = $scope.$root.token;

            post.wrh_id = wrhid;

            post.product_id = item.id;



            $http

                .post(postUrl, post)

            .then(function(res) {

                if (res.data.ack == true) {

                    item.arrStorageLoc = res.data.response;



                    if (storageLocID > 0) {

                        angular.forEach(item.arrStorageLoc, function(obj) {

                            if (obj.id == storageLocID)

                                item.storageLoc = obj;

                        });

                    }

                    // console.log(item.arrStorageLoc);

                }

                /* else {
        
                            toaster.pop('error', 'Error', res.data.error);
        
                            return false;
        
                        } */

            });

        }

    }



    $scope.deleteOpeningBalncStockItem = function(updateID, index, items) {



        // console.log(updateID);return false;

        var deletOpeningBalncStock = $scope.$root.gl + "chart-accounts/delete-opening-balnc-stock-item";



        ngDialog.openConfirm({

            template: 'modalDeleteDialogId',

            className: 'ngdialog-theme-default-custom'

        }).then(function(value) {



            if (updateID > 0) {

                $http

                    .post(deletOpeningBalncStock, { 'id': updateID, 'token': $scope.$root.token })

                .then(function(res) {

                    if (res.data.ack == true) {

                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));

                        items.splice(index, 1);

                    } else

                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));

                });

            } else {

                toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));

                items.splice(index, 1);

            }



        }, function(reason) {

            console.log('Modal promise rejected. Reason: ', reason);

        });

    }



    $scope.checkNegativeEntry = function(item) {



        // console.log(item);

        if (item.standard_price < 0) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(354));

            item.standard_price = '';

        }

    }



    if ($scope.receipt_type != 4) {

        $scope.receipt_gl_list = true;

        $scope.receipt_gl_form = false;

    }

    /* else if ($scope.receipt_type == 4) {

    } */



    $scope.array_receipt_gl_form = {};

    $scope.recipt_record_main = {};

    $scope.columns_recipt_main = [];



    $scope.acc_basic_type = {};

    $scope.acc_basic_type = [{ id: '1', name: 'Default' }, { id: '2', name: 'Posted' }];

    $scope.rec = {};

    $scope.rec.status = $scope.acc_basic_type[0];



    $scope.get_receipt_main_list = function(type) {



        $scope.receipt_gl_list = true;

        $scope.receipt_gl_form = false;



        $scope.recipt_record_main = {};

        $scope.columns_recipt_main = [];



        $scope.rec.statuss = $scope.rec.status !== undefined ? $scope.rec.status.id : 0;



        var table = 'gl_journal_receipt';



        if ($scope.custcode == 1 || $scope.custcode == 4) {

            $scope.rec.module_type = 1;

            var table = 'gl_journal_receipt_cust';

        }



        if ($scope.custcode == 2 || $scope.custcode == 5) {

            $scope.rec.module_type = 2;

            var table = 'gl_journal_receipt_supp';

        }



        if ($scope.custcode == 3 || $scope.custcode == 6) {

            $scope.rec.module_type = 3;

            var table = 'gl_journal_receipt_item';

        }



        $scope.isPosted = 0;

        var str_posted = '';

        if (type == undefined)

            type = 1;



        if ($stateParams.isPosted != undefined && $stateParams.isPosted) {

            type = 2;

            $scope.isPosted = 1;

            str_posted = 'Posted ';

        }



        if ($scope.receipt_type == 0) // 1 general, 2 customer, 3 supplier, 4 item

        {

            $scope.breadcrumbs = [{ 'name': 'Finance', 'url': '#', 'isActive': false },

                { 'name': str_posted + 'General Journal ', 'url': '#', 'isActive': false }
            ];

        } else if ($scope.receipt_type == 1) {

            $scope.breadcrumbs = [{ 'name': 'Sales', 'url': '#', 'isActive': false },

                { 'name': str_posted + 'Customer Journal ', 'url': '#', 'isActive': false }

            ];

        } else if ($scope.receipt_type == 2) {

            $scope.breadcrumbs = [{ 'name': 'Purchases', 'url': '#', 'isActive': false },

                { 'name': str_posted + 'Supplier Journal ', 'url': '#', 'isActive': false }

            ];

        } else if ($scope.receipt_type == 3) {

            $scope.breadcrumbs = [{ 'name': 'Inventory', 'url': '#', 'isActive': false },

                { 'name': str_posted + 'Item Journal ', 'url': '#', 'isActive': false }

            ];



            // $rootScope.updateSelectedGlobalData("item");

            $scope.tempProdArr = [];

            // angular.copy($rootScope.prooduct_arr, $scope.tempProdArr);

        }



        var pst = {};

        pst = {

            'token': $scope.$root.token,

            'type': type,

            'module_type': $scope.receipt_type,

            'search_code': $scope.rec.serachkeyword,

            'sub_module_type': $scope.sub_module_type,

            tb: 'gl_journal_receipt'

        }

        var getexpUrl = $scope.$root.gl + "chart-accounts/get-gl-main-list-receipt";

        $scope.showLoader = true;



        $http

            .post(getexpUrl, pst)

        .then(function(res) {

            $scope.showLoader = false;

            if (res.data.ack == true) {

                $scope.recipt_record_main = res.data.response;



                angular.forEach(res.data.response[0], function(val, index) {

                    $scope.columns_recipt_main.push({

                        'title': toTitleCase(index),

                        'field': index,

                        'visible': true

                    });

                });

            }

        });

    }







    $scope.product_type = true;

    $scope.count_result = 0;



    $scope.rec.module_type = 0;

    $scope.getCode = function() {

        $scope.readonly_journal = false;

        var table = 'gl_journal_receipt';

        /* $scope.custcode == 1 */

        if ($scope.receipt_type == 1) {

            $scope.rec.module_type = 1;

            var table = 'gl_journal_receipt_cust';

        }

        if ($scope.receipt_type == 2) { //$scope.custcode == 2

            $scope.rec.module_type = 2;

            var table = 'gl_journal_receipt_supp';

        }

        if ($scope.receipt_type == 3) {

            $scope.custcode == 3

            $scope.rec.module_type = 3;

            var table = 'gl_journal_receipt_item';

        }



        /* if ($scope.receipt_type == 4) {

            $scope.custcode == 4

            $scope.rec.module_type = 4;

            var table = 'opening_balances';

        } */



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

                $scope.array_receipt_gl_form.acc_code = res.data.code;

                $scope.array_receipt_gl_form.acc_no = res.data.nubmer;



                $scope.array_receipt_gl_form.code_type = module_category_id; //res.data.code_type;

                $scope.count_result++;



                if (res.data.type == 1)

                    $scope.product_type = false;

                else

                    $scope.product_type = true;



                $scope.template_arr = {};

                var gettemppUrl = $scope.$root.gl + "chart-accounts/get-template-gl-list";

                $http

                    .post(gettemppUrl, { 'token': $scope.$root.token, 'journal_type': $scope.receipt_type })

                .then(function(res) {

                    if (res.data.ack == true)

                        $scope.template_arr = res.data.response;



                });





                $scope.addReceipt_main(1);



                if ($scope.count_result > 0)

                    return true;

                else

                    return false;

            } else {

                toaster.pop('error', 'info', res.data.error);

                return false;

            }



        });

    }

    $scope.showAddReceipt = function() {
        $scope.array_receipt_gl_form = {};
        $scope.receipt_gl_list = false;
        $scope.receipt_gl_form = true;
        $scope.main_title = 'Add';
        $scope.receipt_sub_list = [];

        if ($scope.receipt_type != 4) {
            $scope.getCode();
        }

        $scope.array_receipt_gl_form.type = 1;
    }

    $scope.main_title = 'Add';
    $scope.parent_id = '';
    var price = 0;
    var price_a = 0;
    var currency_id = 0;
    var converted_price = 0;
    $scope.cnv_rate = 0;

    $scope.validatePrice = function(item, type, index1) {

        var price_a = 0;
        // item.cnv_rate = 1;
        // $scope.cnv_rate = 1;

        if (item.credit_amount > 0 && type == 'lev1') {

            price_a = item.credit_amount;
            item.debit_amount = null;

        } else if (item.debit_amount > 0 && type == 'lev2') {

            price_a = item.debit_amount;
            item.credit_amount = null;

        } else if (type == 'loop') {

            if (item.credit_amount > 0)
                price_a = Number(item.credit_amount);
            else if (item.debit_amount > 0)
                price_a = Number(item.debit_amount);
        }

        if (price_a == 0 && $scope.receipt_type == 0) {

            if (item.debit_amount > 0)
                price_a = item.debit_amount;
            else if (item.credit_amount > 0)
                price_a = item.credit_amount;
        }

        if (price_a == 0) {

            if (item.debit_amount < 0) {

                price_a = 0;
                item.debit_amount = null;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(316, ['Debit Amount', '0']));

            } else if (item.credit_amount < 0) {

                price_a = 0;
                item.credit_amount = null;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(316, ['Credit Amount', '0']));
            }
        }

        if (item.currency_id != undefined)
            currency_id = item.currency_id.id;

        item.converted_currency_id = $scope.$root.defaultCurrency;
        var newPrice1 = Number(price_a);
        var newPrice = 0;

        if (currency_id != $scope.$root.defaultCurrency)
            newPrice = (Number(item.cnv_rate) > 0) ? Number(newPrice1) / Number(item.cnv_rate) : null;
        else
            newPrice = Number(newPrice1);

        if (newPrice > 0)
            item.converted_price = Number(newPrice).toFixed(2);
        else
            item.converted_price = null;
    }

    $scope.GetConversionRate = function(item) {
        var currency_id = 0;

        if (item.currency_id == undefined || item.currency_id == 0) {
            item.cnv_rate = 1;
            return;
        }

        if (item.currency_id.id != undefined)
            currency_id = item.currency_id.id;

        if (currency_id == $scope.$root.defaultCurrency) {
            item.cnv_rate = 1;
        } else {
            var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";

            $http
                .post(currencyURL, { 'id': currency_id, token: $scope.$root.token, or_date: item.posting_date })
                .then(function(res) {
                    if (res.data.ack == true) {
                        if (res.data.response.conversion_rate == null) {
                            item.converted_price = null;
                            item.cnv_rate = null;
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(355));

                        } else {
                            item.cnv_rate = res.data.response.conversion_rate;
                        }
                        $scope.validatePrice(item, 'loop')
                    } else {
                        item.cnv_rate = null;
                        item.converted_price = null;
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(355));
                        return;
                    }
                });
        }
    }

    $scope.toggleReadonly = function() {
        $scope.readonly_journal = !$scope.readonly_journal;
    }

    $scope.OnChangeTemplate = function(id) {
        if (id > 0) {
            $rootScope.template_error_msg = "Are you sure to want to change the template? Existing lines will be replaced.";

            ngDialog.openConfirm({
                template: '_confirm_template_change_modal',
                className: 'ngdialog-theme-default-custom'
            }).then(function(value) {
                var getTemplateUrl = $scope.$root.gl + "chart-accounts/on-change-template";
                $scope.showLoader = true;

                $http
                    .post(getTemplateUrl, { id: id, 'journal_id': $scope.array_receipt_gl_form.id, 'token': $scope.$root.token })
                    .then(function(res) {
                        if (res.data.ack == true) {
                            $scope.get_gl_recipt_sublist(1);
                        } else {
                            $scope.showLoader = false;
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(244, ['Template']));
                        }
                    });

            }, function(reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
        }
    }

    $scope.showEditReceipt = function(id, flg) {
        $scope.parent_id = id;
        $scope.receipt_gl_list = false;
        $scope.receipt_gl_form = true;
        $scope.main_title = 'Edit';

        var editUrlcommision = $scope.$root.gl + "chart-accounts/get-gl-main-by-id-receipt";

        if (flg != undefined)
            $scope.readonly_journal = false;
        else
            $scope.readonly_journal = true;

        $scope.array_receipt_gl_form = {};

        $http
            .post(editUrlcommision, { 'token': $scope.$root.token, id: id, tb: 'gl_journal_receipt' })
            .then(function(res) {
                if (res.data.ack == true) {
                    $scope.array_receipt_gl_form = res.data.response;
                    $scope.currency_arr_local = res.data.response.currency_arr_local;
                    var posted = '';
                    var posted_link = '';

                    if ($scope.array_receipt_gl_form.type == 2) // posted
                    {
                        posted = 'Posted ';
                        posted_link = '-posted({isPosted:1})';
                        if ($scope.receipt_type != 0)
                            $scope.doc_type_arr.push({ id: '1', name: 'General Journal' });
                    }

                    if ($scope.receipt_type == 0) // 1 general, 2 customer, 3 supplier, 4 item
                    {
                        $scope.breadcrumbs = [{ 'name': 'Finance', 'url': '#', 'isActive': false },
                            { 'name': posted + 'General Journal ', 'url': 'app.receipt-journal-gl' + posted_link, 'isActive': false },
                            { 'name': $scope.array_receipt_gl_form.acc_code, 'url': '#', 'isActive': false }
                        ];

                    } else if ($scope.receipt_type == 1) {
                        $scope.breadcrumbs = [{ 'name': 'Sales', 'url': '#', 'isActive': false },
                            { 'name': posted + 'Customer Journal ', 'url': 'app.receipt-journal-gl-cust' + posted_link, 'isActive': false },
                            { 'name': $scope.array_receipt_gl_form.acc_code, 'url': '#', 'isActive': false }
                        ];

                    } else if ($scope.receipt_type == 2) {
                        $scope.breadcrumbs = [{ 'name': 'Purchases', 'url': '#', 'isActive': false },
                            { 'name': posted + 'Supplier Journal ', 'url': 'app.receipt-journal-gl-supp' + posted_link, 'isActive': false },
                            { 'name': $scope.array_receipt_gl_form.acc_code, 'url': '#', 'isActive': false }
                        ];

                    } else if ($scope.receipt_type == 3) {
                        $scope.breadcrumbs = [{ 'name': 'Inventory', 'url': '#', 'isActive': false },
                            { 'name': posted + 'Item Journal ', 'url': 'app.receipt-journal-gl-item' + posted_link, 'isActive': false },
                            { 'name': $scope.array_receipt_gl_form.acc_code, 'url': '#', 'isActive': false }
                        ];
                    }

                    if ($scope.array_receipt_gl_form.module_type == 3) {
                        $scope.get_gl_recipt_sublist_item(1);
                    } else if ($scope.array_receipt_gl_form.module_type == 4) {
                        $scope.items = [];
                        $scope.getOpeningBalanceStock();
                    } else {
                        $scope.get_gl_recipt_sublist(1);
                    }

                    angular.forEach($scope.template_arr, function(obj3) {
                        if (obj3.id == res.data.response.template_id)
                            $scope.array_receipt_gl_form.template_ids = obj3;
                    });
                }
            });
    }

    $scope.addReceipt_main = function(flg) {
        $scope.showLoader = true;

        if ($scope.array_receipt_gl_form.acc_code == undefined || $scope.array_receipt_gl_form.acc_code == null) {
            $scope.showLoader = false;
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(356, ['Code']));
            return false;
        } else {
            var updateUrl = $scope.$root.gl + "chart-accounts/add-gl-journal-main-receipt";

            var rec2 = {};
            rec2 = $scope.array_receipt_gl_form;
            rec2.module_type = $scope.rec.module_type;
            rec2.sub_module_type = $scope.sub_module_type;
            rec2.module = $stateParams.module;
            rec2.token = $scope.$root.token;
            rec2.tb = 'gl_journal_receipt';
            rec2.template_id = ($scope.array_receipt_gl_form.template_ids != null && $scope.array_receipt_gl_form.template_ids != undefined && $scope.array_receipt_gl_form.template_ids.id > 0) ? $scope.array_receipt_gl_form.template_ids.id : 0;

            $http
                .post(updateUrl, rec2)
                .then(function(res) {
                    if (res.data.ack == true) {
                        $scope.parent_id = res.data.id;

                        if ($scope.receipt_type == 3) {
                            $scope.add_gl_recipt_sublist_item(flg);
                            $scope.showLoader = false;
                        } else {
                            $scope.add_gl_recipt_sublist(flg);
                            $scope.showLoader = false;
                        }
                        $scope.showEditReceipt(res.data.id, flg);
                        $scope.showLoader = false;
                    } else
                        toaster.pop('error', 'info', res.data.error);

                    $scope.showLoader = false;
                });
        }
    }

    $scope.delete_recipt_mian_list = function(id, index, receipt_sub_list) {
        var delUrlcommision = $scope.$root.gl + "chart-accounts/delete-gl-journal-main-receipt";

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function(value) {
            $http
                .post(delUrlcommision, { id: id, 'token': $scope.$root.token, tb: 'gl_journal_receipt' })
                .then(function(res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        receipt_sub_list.splice(index, 1);
                    } else
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                });
        }, function(reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.doc_type_arr = {};

    if ($scope.receipt_type == 0)
        $scope.doc_type_arr = [{ id: '1', name: 'General Journal' }, { id: '2', name: 'Payment' }, { id: '3', name: 'Refund' }];
    else
        $scope.doc_type_arr = [{ id: '2', name: 'Payment' }, { id: '3', name: 'Refund' }];

    $scope.setdoctype = function(item, flg) {

        if (item.module_type == undefined || item.doc_type == undefined || item.doc_type.id == undefined) {
            item.credit_amount = '';
            item.debit_amount = '';
            item.converted_price = '';
            return;
        }

        if (item.module_type.value == 1) { // general jounral
            item.chk_debit = false;
            item.chk_credit = false;

            if (flg != undefined) {
                item.credit_amount = '';
                item.debit_amount = '';
                item.converted_price = '';
            }

        } else if (item.module_type.value == 2) { // customer
            if (item.doc_type.id == 1) { // general Journal
                item.chk_debit = false;
                item.chk_credit = false;

                if (flg != undefined) {
                    item.credit_amount = '';
                    item.debit_amount = '';
                    item.converted_price = '';
                }

            } else if (item.doc_type.id == 2) { // payment
                item.chk_debit = true;
                item.chk_credit = false;

                if (flg != undefined) {
                    item.credit_amount = '';
                    item.debit_amount = '';
                    item.converted_price = '';
                }

            } else if (item.doc_type.id == 3) { // refund
                item.chk_debit = false;
                item.chk_credit = true;

                if (flg != undefined) {
                    item.credit_amount = '';
                    item.debit_amount = '';
                    item.converted_price = '';
                }
            }

        } else if (item.module_type.value == 3) { // supplier

            if (item.doc_type.id == 1) { // general Journal
                item.chk_debit = false;
                item.chk_credit = false;

                if (flg != undefined) {
                    item.credit_amount = '';
                    item.debit_amount = '';
                    item.converted_price = '';
                }

            } else if (item.doc_type.id == 2) { // payment
                item.chk_debit = false;
                item.chk_credit = true;

                if (flg != undefined) {
                    item.credit_amount = '';
                    item.debit_amount = '';
                    item.converted_price = '';
                }

            } else if (item.doc_type.id == 3) { // refund
                item.chk_debit = true;
                item.chk_credit = false;

                if (flg != undefined) {
                    item.credit_amount = '';
                    item.debit_amount = '';
                    item.converted_price = '';
                }
            }
        }

        if (item.doc_type.id == undefined) {
            item.credit_amount = '';
            item.debit_amount = '';
            item.converted_price = '';
        }
    }

    $scope.type_id = 0;
    $scope.account_index = 0;
    $scope.searchKeyword = '';
    $scope.rec.searchKeyword2 = '';
    $scope.searchKeyword_sup = {};
    $scope.category_list = [];

    //Direct Load from customer
    $scope.fix_selected_rec = 0;
    $scope.data = dataService.dataObj;
    $scope.custcode = null;

    if ($stateParams.id != undefined) {
        $scope.showEditReceipt($stateParams.id);
    } else {
        if ($stateParams.isPosted != undefined && $stateParams.isPosted == 1)
            $scope.get_receipt_main_list(2);
        else
            $scope.get_receipt_main_list(1); // show default
    }

    $scope.selected_record = false;

    if ($state.current.name != 'app.openingBalances' && $state.current.name != 'app.view-openingBalances') {
        if ($scope.data.id == 0) {
            console.log('te');
        } else if ($scope.data.id == 1) {
            $scope.custcode = 1; //$scope.data.id;
            $scope.array_receipt_gl_form.acc_description = 'Customer Journal';
            $scope.fix_selected_rec = $scope.sale_type_array[0];

            $scope.breadcrumbs = [{ 'name': 'Sales', 'url': '#', 'isActive': false },
                { 'name': 'Customer Journal ', 'url': '#', 'isActive': false }
            ]; //'app.add-journal-gl'

            $scope.selected_record = true;

        } else if ($scope.data.id == 2 || $scope.data.id == 3) {
            $scope.custcode = 2; //$scope.data.id;

            if ($scope.data.id == 3)
                $scope.custcode = 3; //$scope.data.id;

            if ($scope.data.id == 3)
                $scope.array_receipt_gl_form.acc_description = 'Item Journal';

            $scope.array_receipt_gl_form.acc_description = 'Supplier Journal';
            $scope.fix_selected_rec = $scope.sale_type_array[0];

            if ($scope.data.id == 2) {
                $scope.breadcrumbs = [{ 'name': 'Purchases', 'url': '#', 'isActive': false },
                    { 'name': 'Supplier Journal ', 'url': '#', 'isActive': false }
                ]; //'app.add-journal-gl'

            } else if ($scope.data.id == 3) {
                $scope.breadcrumbs = [{ 'name': 'Inventory', 'url': 'app.item', 'isActive': false },
                    { 'name': 'Item Journal', 'url': '#', 'isActive': false }
                ]; //'app.add-journal-gl'
            }
            $scope.selected_record = true;
        }
    }

    //Sublist
    if (Number($scope.temp_id) == 0)
        $scope.receipt_sub_list = {};

    $scope.backend_data = 0;
    $scope.temp_id = 0;

    $scope.get_gl_recipt_sublist = function(type, is_post) {
        $scope.backend_data = 0;

        var getUrl = $scope.$root.gl + "chart-accounts/get-jl-journal-receipt";
        $scope.receipt_sub_list = {};

        $http
            .post(getUrl, {
                'token': $scope.$root.token,
                'parent_id': $scope.parent_id,
                'temp_id': $scope.temp_id
            })
            .then(function(res) {

                if (res.data.ack == true) {
                    if (Number($scope.temp_id) > 0) {
                        // $scope.receipt_sub_list.push(obj_rec);
                    } else {
                        $scope.receipt_sub_list = res.data.response;

                        if ($scope.receipt_sub_list.length > 0)
                            $scope.backend_data = 1;

                        angular.forEach($scope.receipt_sub_list, function(obj_rec) {
                            obj_rec.credit_amount = (Number(obj_rec.credit_amount) > 0) ? Number(obj_rec.credit_amount) : null;
                            obj_rec.debit_amount = (Number(obj_rec.debit_amount) > 0) ? Number(obj_rec.debit_amount) : null;

                            angular.forEach($scope.doc_type_arr, function(elem1) {
                                if (elem1.id == obj_rec.document_type)
                                    obj_rec.doc_type = elem1;
                            });

                            angular.forEach($scope.sale_type_array, function(elem1) {
                                if (elem1.value == obj_rec.transaction_type)
                                    obj_rec.module_type = elem1;
                            });

                            angular.forEach($scope.discount_type_array, function(elem2) {
                                if (elem2.value == obj_rec.tran_type)
                                    obj_rec.tran_type = elem2;
                            });

                            if ($scope.array_receipt_gl_form.journal_date !== obj_rec.journal_date)
                                obj_rec.acc_code = obj_rec.acc_code;
                            else
                                obj_rec.acc_code = $scope.array_receipt_gl_form.acc_code;

                            if ($scope.array_receipt_gl_form.journal_date !== obj_rec.journal_date)
                                obj_rec.journal_date = obj_rec.journal_date;
                            else
                                obj_rec.journal_date = $scope.array_receipt_gl_form.journal_date;

                            obj_rec.isGLVat = false;

                            //PBI: check is vat gl code.
                            if ($rootScope.defaultCompany == 133) {

                                if (obj_rec.balancing_account_code == obj_rec.vatRange.gl1AccountCode ||
                                    obj_rec.balancing_account_code == obj_rec.vatRange.gl2AccountCode ||
                                    obj_rec.balancing_account_code == obj_rec.vatRange.gl3AccountCode) {
                                    obj_rec.isGLVat = true;
                                } else {
                                    obj_rec.isGLVat = false;
                                }

                                obj_rec.startVatRange = '';
                                obj_rec.endVatRange = '';

                            } else {
                                if (obj_rec.balancing_account_code >= obj_rec.vatRange.startRangeCode && obj_rec.balancing_account_code <= obj_rec.vatRange.endRangeCode) {
                                    obj_rec.isGLVat = true;
                                } else {
                                    obj_rec.isGLVat = false;
                                }
                                //vat ranges for gli listing
                                obj_rec.startVatRange = obj_rec.vatRange.startRangeCode;
                                obj_rec.endVatRange = obj_rec.vatRange.endRangeCode;
                            }

                            angular.forEach($scope.currency_arr_local, function(elem3) {
                                if (elem3.id == obj_rec.currency_id)
                                    obj_rec.currency_id = elem3;
                            });
                            $scope.setdoctype(obj_rec);
                        });
                    }

                    if (is_post != undefined && is_post == 1)
                        $scope.post_journal();

                    $scope.showLoader = false;
                } else {
                    $scope.showLoader = false;

                    if (Number($scope.temp_id) == 0) {
                        $scope.receipt_sub_list = [];
                        $scope.AddReceiptRow();
                    }
                }
            });
    }

    $scope.OnBlurUnitPrice = function(item) {
        // validate quantity
        if (Number(item.cost_per_unit) < 0) {
            item.cost_per_unit = '';
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(329, ['Cost']));
            return;
        }
    }

    $scope.OnBlurQuantity = function(item) {
        // validate quantity
        if (item.qty <= item.allocated_stock && item.allocated_stock > 0) {
            toaster.pop('warning', 'Info', String(item.allocated_stock) + ' quantity is already allocated for item ' + item.item_code);
            item.qty = item.allocated_stock;
            item.remainig_qty = 0;
            item.journal_status = 1;

        } else if (item.qty >= item.allocated_stock) {
            item.remainig_qty = item.qty - item.allocated_stock;
        }
    }

    $scope.get_gl_recipt_sublist_item = function(type, is_post) {
        if (is_post != 1) {
            $scope.tempProdArr = [];
            var itemListingApi = $scope.$root.stock + "products-listing/item-popup";

            $http
                .post(itemListingApi, { 'token': $scope.$root.token, 'item_journal_id': $scope.parent_id })
                .then(function(res) {
                    if (res.data.ack == true) {
                        angular.forEach(res.data.response, function(value, key) {
                            if (key != "tbl_meta_data") {
                                $scope.tempProdArr.push(value);
                            }
                        });
                        $scope.get_gl_recipt_sublist_item_org(type, is_post);
                    } else {
                        $scope.showLoader = false;
                    }
                });

        } else {
            $scope.get_gl_recipt_sublist_item_org(type, is_post);
        }
    }

    $scope.get_gl_recipt_sublist_item_org = function(type, is_post) {
        $scope.backend_data = 0;
        var getUrl = $scope.$root.gl + "chart-accounts/get-jl-journal-receipt-item";
        if (Number($scope.temp_id) == 0)
            $scope.receipt_sub_list = {};

        $http
            .post(getUrl, {
                'token': $scope.$root.token,
                'type': type,
                'parent_id': $scope.parent_id,
                'temp_id': $scope.temp_id
            })
            .then(function(res) {
                if (res.data.ack == true) {
                    if (Number($scope.temp_id) > 0) {
                        // $scope.receipt_sub_list.push(obj_rec);
                    } else {
                        $scope.receipt_sub_list = res.data.response;
                        if ($scope.receipt_sub_list.length > 0)
                            $scope.backend_data = 1;

                        angular.forEach($scope.receipt_sub_list, function(obj_rec) {
                            var item = $filter("filter")($scope.tempProdArr, { id: obj_rec.item_id });

                            obj_rec.qty = Number(obj_rec.qty);
                            obj_rec.cost_per_unit = Number(obj_rec.cost_per_unit);

                            angular.forEach($scope.sale_type_array_item, function(elem1) {
                                if (elem1.value == obj_rec.transaction_type)
                                    obj_rec.module_type = elem1;
                            });

                            obj_rec.arr_units = (item != undefined && item.length > 0) ? item[0].arr_units.response : []; //obj_rec.arr_units.response;

                            angular.forEach(obj_rec.arr_units, function(elem) {
                                if (elem.unit_id == obj_rec.uom)
                                    obj_rec.uom = elem;
                            });

                            obj_rec.arr_warehouse = [];

                            if (item != undefined && item.length > 0 && item[0].arr_warehouse != undefined)
                                angular.copy(item[0].arr_warehouse.response, obj_rec.arr_warehouse);

                            angular.forEach(obj_rec.arr_warehouse, function(elem) {
                                if (elem.id == obj_rec.warehouse) {
                                    obj_rec.warehouse = elem;

                                    if (obj_rec.stock_check > 0) {
                                        obj_rec.warehouse.arr_location = obj_rec.arr_location.response;

                                        angular.forEach(obj_rec.warehouse.arr_location, function(elem1) {
                                            if (elem1.id == obj_rec.location) {
                                                obj_rec.location = elem1;
                                                obj_rec.location_id = elem1.id;
                                            }
                                        });
                                    } else {
                                        obj_rec.warehouse.arr_location = [];
                                        obj_rec.location = [];
                                        obj_rec.location_id = 0;
                                    }
                                }
                            });
                            obj_rec.remainig_qty = Number(obj_rec.qty) - Number(obj_rec.allocated_stock);
                        });
                    }

                    if (is_post != undefined && is_post == 1)
                        $scope.post_journal_item();
                } else {
                    if (Number($scope.temp_id) == 0) {
                        $scope.receipt_sub_list = [];
                        $scope.backend_data = 0;
                        $scope.AddReceiptRow();
                    }
                }
            });
    }

    $scope.array_receipt_gl_form.id = 0;

    $scope.get_recpt_temp_data = function(id) {
        if ($scope.array_receipt_gl_form.id === undefined)
            return true;

        ngDialog.openConfirm({
            template: 'modalcontinueid',
            className: 'ngdialog-theme-default-custom'

        }).then(function(value) {
            $scope.temp_id = id;
            $scope.get_gl_recipt_sublist(1);
        }, function(reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.add_gl_recipt_sublist = function(flg, is_post) {
        $scope.test_date_duplicate();

        angular.forEach($scope.receipt_sub_list, function(obj) {
            if (obj.module_type != undefined)
                obj.transaction_type = obj.module_type.value;
            else
                obj.transaction_type = 0;

            if (obj.doc_type != undefined)
                obj.document_type = obj.doc_type.id;
            else
                obj.document_type = 0;

            $scope.validatePrice(obj, 'loop');
        });

        var updateUrlcommision = $scope.$root.gl + "chart-accounts/add-jl-journal-receipt";
        var post = {};
        var count_rec = 0;
        post.selectdata = $scope.receipt_sub_list; //temp;
        post.parent_id = $scope.parent_id;
        post.token = $scope.$root.token;
        post.type = 1;

        $http
            .post(updateUrlcommision, post)
            .then(function(res) {
                if (res.data.ack == true) {
                    $scope.backend_data = 1;

                    if (flg == undefined) {
                        toaster.pop('success', 'Add', res.data.error);
                    }
                    $scope.get_gl_recipt_sublist($scope.parent_id, is_post);
                    return true;
                } else {
                    return false;
                }
            });
    }

    $scope.add_gl_recipt_sublist_item = function(flg, is_post) {

        var postUrl = $scope.$root.gl + "chart-accounts/add-jl-journal-receipt-item";
        var post = {};
        var count_rec = 0;
        post.selectdata = $scope.receipt_sub_list; //temp;
        post.parent_id = $scope.parent_id;
        post.token = $scope.$root.token;
        post.type = 1;

        $http
            .post(postUrl, post)

        .then(function(res) {

            if (res.data.ack == true) {

                $scope.backend_data = 1;

                if (flg == undefined) {

                    toaster.pop('success', 'Add', res.data.error);

                }

                $scope.get_gl_recipt_sublist_item($scope.parent_id, is_post);

                // $('#comision_pop').modal('hide');

                return true;

            } else {

                return false;



            }

        });



    }



    $scope.edit_gl_recipt_sublist = function(id) {
        var editUrlcommision = $scope.$root.gl + "chart-accounts/get-jl-journal-by-id-receipt";

        $http
            .post(editUrlcommision, { 'token': $scope.$root.token, id: id })
            .then(function(res) {
                if (res.data.ack == true) {

                    $scope.array_submit_jurnal = res.data.response;





                    $scope.array_submit_jurnal.acc_code = $scope.array_receipt_gl_form.acc_code;

                    $scope.array_submit_jurnal.journal_date = $scope.array_receipt_gl_form.journal_date;

                    $scope.array_submit_jurnal.parent_id = $scope.array_receipt_gl_form.id;



                    $scope.showLoader = true;

                    //	$timeout(function(){$scope.$root.$apply(function(){

                    $.each($scope.doc_type_arr, function(index, obj) {

                        if (obj.id == res.data.response.doc_type)

                            $scope.array_submit_jurnal.doc_type = obj;

                    });

                    $.each($scope.sale_type_array, function(index, obj) {

                        if (obj.value == res.data.response.module_type)

                            $scope.array_submit_jurnal.module_type = obj;

                    });

                    $.each($scope.discount_type_array, function(index, obj2) {

                        if (obj2.value == res.data.response.tran_type)

                            $scope.array_submit_jurnal.tran_type = obj2;

                    });



                    angular.forEach($scope.currency_arr_local, function(obj) {

                        if (obj.id == res.data.response.currency_id)

                            $scope.array_submit_jurnal.currency_id = obj;

                    });

                    $scope.showLoader = false;
                }
            });
    }

    $scope.AddReceiptRow = function(item) {
        var newItemNo = $scope.receipt_sub_list.length; // + newItemNo
        $scope.receipt_sub_list.push({ 'id': '', 'allocated_amount': 0 });

        if ($scope.receipt_type == 0 && newItemNo > 0) {
            $scope.receipt_sub_list[$scope.receipt_sub_list.length - 1].posting_date = $scope.receipt_sub_list[$scope.receipt_sub_list.length - 2].posting_date;
            $scope.receipt_sub_list[$scope.receipt_sub_list.length - 1].doc_type = $scope.receipt_sub_list[$scope.receipt_sub_list.length - 2].doc_type;
            $scope.receipt_sub_list[$scope.receipt_sub_list.length - 1].document_no = $scope.receipt_sub_list[$scope.receipt_sub_list.length - 2].document_no;

        } else if ($scope.receipt_type == 1) {
            $scope.receipt_sub_list[$scope.receipt_sub_list.length - 1].module_type = $scope.sale_type_array[1];

        } else if ($scope.receipt_type == 2) {
            $scope.receipt_sub_list[$scope.receipt_sub_list.length - 1].module_type = $scope.sale_type_array[2];

        } else if ($scope.receipt_type == 3) {

            $scope.receipt_sub_list[$scope.receipt_sub_list.length - 1].allocated_stock = 0;
            $scope.receipt_sub_list[$scope.receipt_sub_list.length - 1].remainig_qty = 0;
            $scope.receipt_sub_list[$scope.receipt_sub_list.length - 1].journal_status = 0;
        }
    }

    $scope.showDeletReceipt = function(id, index, receipt_sub_list) {
        if (id == '') {
            $scope.receipt_sub_list.splice(index, 1); //lastItem

            if ($scope.receipt_sub_list.length == 0)
                $scope.AddReceiptRow();
        } else {

            var delUrlcommision = $scope.$root.gl + "chart-accounts/delete-jl-journal-receipt";

            ngDialog.openConfirm({
                template: 'modalDeleteDialogId',
                className: 'ngdialog-theme-default-custom'
            }).then(function(value) {
                $scope.showLoader = true;

                $http
                    .post(delUrlcommision, { id: id, 'token': $scope.$root.token })
                    .then(function(res) {

                        if (res.data.ack == true) {
                            $scope.showLoader = false;
                            toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                            receipt_sub_list.splice(index, 1);
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

    $scope.showDeletReceiptItem = function(id, index, receipt_sub_list) {
        if (id == '') {
            $scope.receipt_sub_list.splice(index, 1); //lastItem
            if ($scope.receipt_sub_list.length == 0)
                $scope.AddReceiptRow();

        } else {
            var delUrlcommision = $scope.$root.gl + "chart-accounts/delete-jl-journal-receipt-item";

            ngDialog.openConfirm({
                template: 'modalDeleteDialogId',
                className: 'ngdialog-theme-default-custom'
            }).then(function(value) {
                $scope.showLoader = true;

                $http
                    .post(delUrlcommision, { id: id, 'token': $scope.$root.token })
                    .then(function(res) {
                        if (res.data.ack == true) {
                            $scope.showLoader = false;
                            toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                            var _item = $filter("filter")($scope.tempProdArr, { id: receipt_sub_list[index].item_id });
                            var idx = $scope.tempProdArr.indexOf(_item[0]);
                            $scope.tempProdArr.splice(idx, 1);
                            receipt_sub_list.splice(index, 1);

                            if ($scope.receipt_sub_list.length == 0)
                                $scope.AddReceiptRow();

                        } else {
                            $scope.showLoader = false
                            toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                        }
                    });
            }, function(reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
        }
    }

    $scope.showDeletReceipt_main = function(id, index, receipt_sub_list) {
        var delUrlcommision = $scope.$root.gl + "chart-accounts/delete-jl-journal-main";

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function(value) {

            $http
                .post(delUrlcommision, { id: id, 'token': $scope.$root.token })
                .then(function(res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        receipt_sub_list.splice(index, 1);
                    } else
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                });
        }, function(reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.credit_total = 0;
    $scope.debit_total = 0;
    $scope.t_credit_total = 0;
    $scope.t_debit_total = 0;
    $scope.debit_credit_diff = 0;

    $scope.netBalanceRecipt = function() {
        $scope.credit_total = 0;
        $scope.debit_total = 0;
        $scope.t_credit_total = 0;
        $scope.t_debit_total = 0;
        $scope.debit_credit_diff = 0;
        var ddtotal = 0;

        angular.forEach($scope.receipt_sub_list, function(item) {
            if (item.balancing_account_code == undefined || item.balancing_account_code == "") {
                if (Number(item.credit_amount) > 0) {
                    $scope.t_credit_total += Number(item.converted_price);
                }

                if (Number(item.debit_amount) > 0) {
                    $scope.t_debit_total += Number(item.converted_price);
                }
            }

            if (Number(item.credit_amount) > 0)
                $scope.credit_total += Number(item.credit_amount);

            if (Number(item.debit_amount) > 0)
                $scope.debit_total += Number(item.debit_amount);
        });

        $scope.debit_credit_diff = Number($scope.t_debit_total - $scope.t_credit_total);
        $scope.debit_credit_diff = Number($scope.debit_credit_diff).toFixed(2);
        $scope.debit_credit_diff = Number($scope.debit_credit_diff);
        return $scope.debit_credit_diff;
    }

    $scope.test_date_duplicate = function(data, indx) {
        $scope.enable_date_check = false;
        var ctotal = 0;

        if ($scope.debit_credit_diff == 0) {
            angular.forEach($scope.receipt_sub_list, function(item, index) {
                if (item.module_type !== undefined && item.journal_date !== undefined) {
                    if (item.module_type.value == 1) {
                        angular.forEach($scope.receipt_sub_list, function(itm, index2) {
                            console.log((index == index2) && (item.journal_date != itm.journal_date));
                            if ((index == index2) && (item.journal_date != itm.journal_date))
                                ctotal++;
                        });
                    }
                }
            });
        } else
            ctotal = 0;

        $timeout(function() {
            if ((ctotal) > 0) {
                $scope.enable_date_check = true;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(357));
                return
            } else {
                $scope.enable_date_check = false;
            }
        }, 1000);

        return;

        var ctotal = 0;

        if (data.module_type.value == 1) {

            angular.forEach($scope.receipt_sub_list, function(obj, index) {

                if (obj.module_type !== undefined) {
                    if ((Number(obj.converted_price)))
                        ctotal++;
                }
            });

            $timeout(function() {
                if (ctotal > 0) {
                    $scope.enable_date_check = true;
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(358));
                    return
                } else {
                    $scope.enable_date_check = false;
                }
            }, 1000);
        }
    }

    $scope.OnChangeModuleType = function(item, index) {
        $scope.showLoader = true;
        item.account_no = '';
        item.account_name = '';
        item.currency_id = '';

        if (item.module_type.value == 1) {
            angular.forEach($scope.currency_arr_local, function(obj) {
                if (obj.id == $scope.$root.defaultCurrency)
                    item.currency_id = obj;
            });
        }
        $scope.setdoctype(item, index);
        $scope.showLoader = false;
    }

    $scope.OnChangeItemTrasactionType = function(item) {
        item.qty = '';
        item.amount = '';
    }

    $scope.selectedRecFromModalsItem = [];
    $scope.searchKeywordItem = {};

    $scope.getItemList = function(item_paging, item, index) {

        if (item_paging == 1) {
            $scope.gltype = 0;
            $scope.account_index = index;
            if (item.module_type == undefined) {
                toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Transaction Type']));
                return;
            }
        }

        $scope.module_type.searchKeyword2 = '';
        $scope.module_name = 'Select Item';
        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.productsArr = [];

        if (item_paging == 1)
            $scope.item_paging.spage = 1;

        $scope.postData.page = $scope.item_paging.spage;
        $scope.postData.searchKeyword = $scope.searchKeywordItem;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeywordItem = {};
            $scope.record_data = {};
        }

        var itemListingApi = $scope.$root.stock + "products-listing/item-popup";
        $scope.showLoader = true;

        $http
            .post(itemListingApi, $scope.postData)
            .then(function(res) {
                $scope.itemTableData = res;
                $scope.columns = [];
                $scope.record_data = {};
                $scope.recordArray = [];
                $scope.showLoader = false;
                $scope.productsArr = [];
                $scope.selectedRecFromModalsItem = [];
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

                    angular.forEach(res.data.response, function(value, key) {
                        if (key != "tbl_meta_data") {
                            $scope.productsArr.push(value);
                        }
                    });

                    angular.forEach($scope.itemTableData.data.response.tbl_meta_data.response.colMeta, function(obj, index) {
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    });

                    angular.element('#itemPopupItemJournal').modal({ show: true });
                    $scope.showLoader = false;
                } else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
            });
    }

    $scope.clearPendingOrderItems = function() {
        angular.element('#itemPopupItemJournal').modal('hide');
    }

    $scope.addProduct = function(item_obj) {
        angular.forEach($scope.receipt_sub_list, function(obj_rec, index) {
            if (index === $scope.account_index) {
                // if ($scope.gltype == 0) 
                {
                    obj_rec.item_code = item_obj.product_code;
                    obj_rec.item_name = item_obj.description;
                    obj_rec.item_id = item_obj.id;
                    obj_rec.stock_check = item_obj.stock_check;
                    obj_rec.cost_per_unit = null;
                    obj_rec.qty = null;
                    obj_rec.costing_method_id = item_obj.costing_method_id;

                    if (item_obj.arr_units != undefined) {
                        obj_rec.arr_units = item_obj.arr_units.response;
                        obj_rec.uom = obj_rec.arr_units[0];
                    }

                    if (item_obj.arr_warehouse != undefined) {
                        obj_rec.arr_warehouse = item_obj.arr_warehouse.response;
                        if (obj_rec.arr_warehouse.default_wh != undefined && obj_rec.arr_warehouse.default_wh > 0) {

                            angular.forEach(obj_rec.arr_warehouse, function(elem) {
                                if (elem.id == obj_rec.arr_warehouse.default_wh) {
                                    obj_rec.warehouse = elem;

                                    if (obj_rec.stock_check > 0)
                                        $scope.OnChangeWarehouse(obj_rec, index);
                                    else {
                                        obj_rec.warehouse.arr_location = [];
                                        obj_rec.location = 0;
                                        obj_rec.location_id = 0;
                                    }
                                }
                            });

                        } else {
                            obj_rec.warehouse = obj_rec.arr_warehouse[0];

                            if (obj_rec.stock_check > 0)
                                $scope.OnChangeWarehouse(obj_rec, index);
                            else {
                                obj_rec.warehouse.arr_location = [];
                                obj_rec.location = 0;
                                obj_rec.location_id = 0;
                            }
                        }
                    }
                }
                $scope.tempProdArr.push(item_obj);
                angular.element('#itemPopupItemJournal').modal('hide');
            }
        });
    }

    $scope.searchKeyword_cust = {};

    $scope.getCustomer = function(item_paging) {
        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;

        if (item_paging == 1)
            $scope.item_paging.spage = 1;

        $scope.postData.page = $scope.item_paging.spage;
        $scope.postData.searchKeyword = $scope.searchKeyword_cust;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword_cust = {};
            $scope.record_data = {};
        }

        $scope.title = "Select Customer";
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

    $scope.confirmCustomer = function(number) {
        var finUrl = $scope.$root.sales + "customer/customer/get-customer-finance";

        angular.forEach($scope.receipt_sub_list, function(obj_rec, index) {

            if (index === $scope.account_index) {
                $http
                    .post(finUrl, { 'customer_id': number.id, token: $scope.$root.token })
                    .then(function(res) {
                        if (res.data.ack == true) {
                            if (res.data.response.posting_group_id === undefined || res.data.response.posting_group_id === null || res.data.response.posting_group_id == 0) {
                                obj_rec.account_no = '';
                                obj_rec.account_name = '';
                                obj_rec.account_id = '';
                                obj_rec.posting_group_id = '';
                                obj_rec.cnv_rate = 1;
                                obj_rec.currency_id = '';
                                toaster.pop('error', 'Error', 'Please Insert the record in finance tab');
                                return;
                            } else {
                                obj_rec.account_no = number.customer_code;
                                obj_rec.account_name = number.name;
                                obj_rec.account_id = number.id;
                                obj_rec.posting_group_id = res.data.response.posting_group_id;
                                if (res.data.response.currency_id > 0) {
                                    $scope.supplier_currency = true;
                                }

                                if (res.data.response.account_payable_number && res.data.response.account_payable_id) {

                                    let accountStr = res.data.response.account_payable_number.split(' - ');
                                    let accountName = accountStr.slice(1, 10);

                                    obj_rec.balancing_account_code = accountStr[0];
                                    obj_rec.balancing_account_name = accountName.join(' - ');
                                    obj_rec.balancing_account_id = res.data.response.account_payable_id;
                                }

                                angular.forEach($scope.currency_arr_local, function(obj) {
                                    if (obj.id == res.data.response.currency_id)
                                        obj_rec.currency_id = obj;
                                });
                                $scope.GetConversionRate(obj_rec);
                            }
                        } else
                            toaster.pop('error', 'Info', 'Please insert the record in customer finance tab	.');
                    });
            }
        });
        angular.element('#customer_modal_single').modal('hide');
    }

    $scope.suppliers = [];
    $scope.tempSupplierArr = [];
    $scope.searchKeywordSupp = {};
    $scope.selectedRecFromModalsSupp = [];

    $scope.clearFilterAndSelectSupplier = function() {
        $scope.searchKeywordSupp = {};
        $scope.selectedRecFromModalsSupp = [];
        $scope.get_supplier();
    }

    $scope.get_supplier = function(item_paging, sort_column, sortform) {
        if (item_paging) {
            $scope.searchKeywordSupp = {};
        }

        $scope.title = 'Supplier Listing';
        $scope.columns = [];
        $scope.record = {};
        $scope.record_invoice = {};
        $scope.removeSupp = 0;

        //pass in API
        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.postData.type = 1;
        $scope.postData.searchKeyword = $scope.searchKeywordSupp;

        $scope.showLoader = true;
        var supplierUrl = $scope.$root.pr + "supplier/supplier/supplierListings";

        $http
            .post(supplierUrl, $scope.postData)
            .then(function(res) {
                $scope.columns = [];
                $scope.record = {};
                $scope.showLoader = false;
                $scope.supplierTableData = res;

                if (res.data.ack == true) {
                    angular.element('#listing_sp_single_Modal').modal({ show: true });
                }
                // else
                //     toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            })
            .catch(function(message) {
                $scope.showLoader = false;
                throw new Error(message.data);
            });
    }

    $scope.clearSuppliers = function() {
        angular.element('#listing_sp_single_Modal').modal('hide');
    }

    $scope.confirm_supp_single = function(result) {

        angular.forEach($scope.receipt_sub_list, function(obj_rec, index) {
            if (index === $scope.account_index) {
                if ($scope.gltype == 1) {
                    if (obj_rec.module_type.value == 3) {
                        // console.log(result);
                        if (result.posting_group_id) {
                            obj_rec.account_no = result.code;
                            obj_rec.account_name = result.name;
                            obj_rec.account_id = result.id;
                            obj_rec.posting_group_id = result.posting_group_id;

                            if (result.currency_id > 0) {
                                $scope.supplier_currency = true;
                            }

                            if (result.anumber && result.account_payable_id) {

                                let accountStr = result.anumber.split(' - ');
                                let accountName = accountStr.slice(1, 10);

                                obj_rec.balancing_account_code = accountStr[0];
                                obj_rec.balancing_account_name = accountName.join(' - ');
                                obj_rec.balancing_account_id = result.account_payable_id;
                            }

                            angular.forEach($scope.currency_arr_local, function(obj) {
                                if (obj.id == result.currency_id)
                                    obj_rec.currency_id = obj;
                            });

                            $scope.GetConversionRate(obj_rec);

                        } else {
                            obj_rec.account_no = '';
                            obj_rec.account_name = '';
                            obj_rec.account_id = '';
                            obj_rec.posting_group_id = '';
                            toaster.pop('error', 'Info', 'Please Insert the record in supplier finance tab .');
                            return;
                        }
                    }
                }
            }
        });

        angular.element('#listing_sp_single_Modal').modal('hide');
    }


    $scope.getGLRecipt = function(item, index, type) {

        $scope.showLoader = true;
        $scope.gltype = type;
        $scope.account_index = index;
        // $scope.module_type.module_type = angular.copy(item.module_type);

        if (item.module_type == undefined) {
            $scope.showLoader = false;
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Transaction Type']));
            return;
        } else {
            // if(item.module_type.value==1)
            var postUrl = $scope.$root.gl + "chart-accounts/get-category-by-name";

            $scope.module_name = 'G/L';

            if (Number(type) == 1) {
                $scope.module_name = item.module_type.name;

                if (item.module_type.value == 2) {
                    $scope.getCustomer(1);
                    var postUrl = $scope.$root.sales + "customer/customer/getCustomerForGeneralLedger";
                    return;
                }

                if (item.module_type.value == 3) {
                    $scope.clearFilterAndSelectSupplier();
                    // var postUrl = $scope.$root.pr + "supplier/supplier/getSupplierForGeneralLedger";
                    return;
                }
            }

            $scope.postData = {};
            $scope.postData.token = $scope.$root.token;

            if (type == 1)
                $scope.postData.account_list_type = 1;

            $scope.postData.tb = 'gl_journal_receipt';
            //if (item_paging == 1)$rootScope.item_paging.spage = 1;
            $scope.postData.page = $scope.$root.item_paging.spage;
            $scope.postData.pagination_limits = $scope.$root.item_paging.pagination_limit !== undefined ? $scope.$root.item_paging.pagination_limit.id : 0;

            if ($scope.postData.pagination_limits == -1) {
                $scope.postData.page = -1;
                $scope.selection_record = {};
            }

            //if(item.module_type== 2 || item.module_type== 3 )
            // if (Number(type) == 1)
            $scope.module_type.searchKeyword2 = '';
            // $scope.postData.searchKeyword = $scope.module_type.searchKeyword2;

            $scope.account_list = [];
            $http
                .post(postUrl, $scope.postData)
                .then(function(res) {
                    if (res.data.ack == true) {
                        $scope.account_list = [];
                        $scope.total = res.data.total;
                        $scope.item_paging.total_pages = res.data.total_pages;
                        $scope.item_paging.cpage = res.data.cpage;
                        $scope.item_paging.ppage = res.data.ppage;
                        $scope.item_paging.npage = res.data.npage;
                        $scope.item_paging.pages = res.data.pages;
                        $scope.total_paging_record = res.data.total_paging_record;
                        // $scope.category_list=[{id:'' ,name:'',code:'' }];

                        angular.forEach(res.data.response, function(obj_rec, index) {
                            if (obj_rec.title)
                                $scope.account_list.push({ id: obj_rec.id, name: obj_rec.title, code: obj_rec.code });
                            else if (obj_rec.name)
                                $scope.account_list.push({ id: obj_rec.id, name: obj_rec.name, code: obj_rec.code, status: obj_rec.status });
                        });

                        $scope.showLoader = false;
                        angular.element('#RecptAccountpop').modal({ show: true });
                        // $scope.category_list = res.data.response;//response_account;
                        $scope.showLoader = false;
                    } else {
                        $scope.account_list = [];
                        $scope.showLoader = false;
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                    }
                });
        }
    }

    $scope.assignreciptselect = function(number) {
        angular.forEach($scope.receipt_sub_list, function(obj_rec, index) {
            if (index === $scope.account_index) {

                if ($scope.gltype == 0) {

                    console.log(number);
                    obj_rec.item_code = number.code;
                    obj_rec.item_name = number.name;
                    obj_rec.item_id = number.id;
                    obj_rec.stock_check = number.stock_check;

                    if (number.arr_units != undefined) {
                        obj_rec.arr_units = number.arr_units.response;
                        obj_rec.uom = obj_rec.arr_units[0];
                    }

                    if (number.arr_warehouse != undefined) {
                        obj_rec.arr_warehouse = number.arr_warehouse.response;
                        if (obj_rec.arr_warehouse.default_wh != undefined && obj_rec.arr_warehouse.default_wh > 0) {
                            angular.forEach(obj_rec.arr_warehouse, function(elem) {
                                if (elem.id == obj_rec.arr_warehouse.default_wh) {
                                    obj_rec.warehouse = elem;
                                    if (obj_rec.stock_check > 0)
                                        $scope.OnChangeWarehouse(obj_rec, index);
                                    else {
                                        obj_rec.warehouse.arr_location = [];
                                        obj_rec.location = 0;
                                        obj_rec.location_id = 0;
                                    }
                                }
                            });

                        } else {
                            obj_rec.warehouse = obj_rec.arr_warehouse[0];
                            if (obj_rec.stock_check > 0)
                                $scope.OnChangeWarehouse(obj_rec, index);
                            else {
                                obj_rec.warehouse.arr_location = [];
                                obj_rec.location = 0;
                                obj_rec.location_id = 0;
                            }
                        }
                    }
                } else if ($scope.gltype == 1) {
                    if (obj_rec.module_type.value == 1) {
                        obj_rec.account_no = number.code;
                        obj_rec.account_name = number.name;
                        obj_rec.account_id = number.id;
                        obj_rec.posting_group_id = 0;
                        $scope.GetConversionRate(obj_rec);

                    } else if (obj_rec.module_type.value == 2) {

                        var finUrl = $scope.$root.sales + "customer/customer/get-customer-finance";
                        $http
                            .post(finUrl, { 'customer_id': number.id, token: $scope.$root.token })
                            .then(function(res) {

                                if (res.data.ack == true) {
                                    if (res.data.response.posting_group_id === undefined || res.data.response.posting_group_id === null || res.data.response.posting_group_id == 0) {
                                        obj_rec.account_no = '';
                                        obj_rec.account_name = '';
                                        obj_rec.account_id = '';
                                        obj_rec.posting_group_id = '';
                                        obj_rec.cnv_rate = 1;
                                        obj_rec.currency_id = '';
                                        toaster.pop('error', 'Error', 'Please Insert the record in finance tab');
                                        return;
                                    } else {

                                        obj_rec.account_no = number.code;
                                        obj_rec.account_name = number.name;
                                        obj_rec.account_id = number.id;
                                        obj_rec.posting_group_id = res.data.response.posting_group_id;
                                        if (res.data.response.currency_id > 0) {
                                            $scope.supplier_currency = true;
                                        }

                                        if (res.data.response.account_payable_number && res.data.response.account_payable_id) {

                                            let accountStr = res.data.response.account_payable_number.split(' - ');
                                            let accountName = accountStr.slice(1, 10);

                                            obj_rec.balancing_account_code = accountStr[0];
                                            obj_rec.balancing_account_name = accountName.join(' - ');
                                            obj_rec.balancing_account_id = res.data.response.account_payable_id;
                                        }

                                        angular.forEach($scope.currency_arr_local, function(obj) {
                                            if (obj.id == res.data.response.currency_id)
                                                obj_rec.currency_id = obj;
                                        });

                                        $scope.GetConversionRate(obj_rec);
                                    }
                                } else
                                    toaster.pop('error', 'Info', 'Please insert the record in customer finance tab	.');
                            });

                    } else if (obj_rec.module_type.value == 3) {
                        var finUrl = $scope.$root.pr + 'supplier/supplier/get-supplier-finance'

                        $http
                            .post(finUrl, { 'supplier_id': number.id, token: $scope.$root.token })
                            .then(function(res) {
                                if (res.data.ack == true) {
                                    if (res.data.response.posting_group_id === undefined || res.data.response.posting_group_id === null || res.data.response.posting_group_id == 0) {
                                        obj_rec.account_no = '';
                                        obj_rec.account_name = '';
                                        obj_rec.account_id = '';
                                        obj_rec.posting_group_id = '';
                                        toaster.pop('error', 'Info', 'Please Insert the record in supplier finance tab .');
                                        return;
                                    } else {
                                        obj_rec.account_no = number.code;
                                        obj_rec.account_name = number.name;
                                        obj_rec.account_id = number.id;
                                        obj_rec.posting_group_id = res.data.response.posting_group_id;

                                        if (res.data.response.currency_id > 0) {
                                            $scope.supplier_currency = true;
                                        }

                                        angular.forEach($scope.currency_arr_local, function(obj) {
                                            if (obj.id == res.data.response.currency_id)
                                                obj_rec.currency_id = obj;
                                        });
                                        $scope.GetConversionRate(obj_rec);
                                    }
                                } else
                                    toaster.pop('error', 'Info', 'Please insert the record in supplier finance tab	.');
                            });
                    }

                } else if ($scope.gltype == 2) {
                    obj_rec.balancing_account_code = number.code;
                    obj_rec.balancing_account_name = number.name;
                    obj_rec.balancing_account_id = number.id;
                }
            }
        });
        angular.element('#RecptAccountpop').modal('hide');
    }

    $scope.CalculateAmount = function(rec, index) {
        if (rec.qty < 0) {
            rec.qty = '';
            rec.amount = '';
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(329, ['Quantity']));
            return;
        }

        if (rec.module_type == undefined || rec.module_type.value == undefined)
            return;

        if (rec.module_type.value == 1) // positive entry
            rec.amount = rec.qty * rec.cost_per_unit;
        else if (rec.module_type.value == 2) // negative entry
        {
            var already_assigned_qty = 0;

            angular.forEach($scope.receipt_sub_list, function(item, idx) {
                if (item.stock_check == 1 && idx != index && item.item_id == rec.item_id && item.module_type.value == 2 && rec.warehouse.id == item.warehouse.id)
                    already_assigned_qty += Number(item.allocated_stock);
            });

            var available_quantity = (rec.stock_check == 1 && rec.warehouse != undefined) ? Number(rec.warehouse.available_quantity) : 0;

            if (rec.stock_check == 0 || (rec.stock_check == 1 && Number(rec.qty) <= (available_quantity - Number(already_assigned_qty))))
                rec.amount = rec.qty * rec.cost_per_unit;
            else {
                rec.qty = '';
                rec.amount = '';
                toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(359));
                return;
            }
        }
    }

    $scope.OnChangeWarehouse = function(rec, index) {
        if (rec.warehouse != undefined) {
            var postUrl = $scope.$root.setup + "warehouse/get-sel-warehouse-loc-in-stock-alloc";
            rec.warehouse.arr_location = [];

            $http
                .post(postUrl, { 'wrh_id': rec.warehouse.id, 'prod_id': rec.item_id, 'token': $scope.$root.token })
                .then(function(res) {
                    if (res.data.ack == true) {
                        rec.warehouse.arr_location = res.data.response;
                        rec.location = rec.warehouse.arr_location[0];
                        rec.location_id = rec.warehouse.arr_location[0].id;
                    }
                });

            if (rec.module_type.value == 2)
                $scope.CalculateAmount(rec, index);
        }
    }

    $scope.ValidateAllocationDate = function(record) {
        var date_parts = record.allocation_date.trim().split('/');
        var doc_to_alloc_date_parts = record.invoice_date.trim().split('/');
        var doc_from_alloc_date_parts = $scope.selected_doc_posting_date.trim().split('/');
        var alloc_date = new Date(date_parts[2], date_parts[1] - 1, date_parts[0]);
        var doc_to_alloc_date = new Date(doc_to_alloc_date_parts[2], doc_to_alloc_date_parts[1] - 1, doc_to_alloc_date_parts[0]);
        var doc_from_alloc_date = new Date(doc_from_alloc_date_parts[2], doc_from_alloc_date_parts[1] - 1, doc_from_alloc_date_parts[0]);

        if (doc_from_alloc_date >= doc_to_alloc_date && alloc_date < doc_from_alloc_date) {
            toaster.pop('error', 'Error', 'Allocation date can not be earlier than ' + $scope.selected_doc_posting_date);
            record.allocation_date = $scope.selected_doc_posting_date;

        } else if (doc_to_alloc_date >= doc_from_alloc_date && alloc_date < doc_to_alloc_date) {
            toaster.pop('error', 'Error', 'Allocation date can not be earlier than ' + record.invoice_date);
            record.allocation_date = record.invoice_date;
        }
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

    $scope.get_invoice_list = function(item, index, p_id) {

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

                    if (item.module_type.value == 2) { // customer

                        if (item.doc_type.id == 2) // payment

                            var postUrl = $scope.$root.sales + "customer/order/invoice-for-refund-listings";

                        if (item.doc_type.id == 3) // refund

                            var postUrl = $scope.$root.sales + "customer/order/invoice-for-payment-listings";

                    } else if (item.module_type.value == 3) { // supplier

                        if (item.doc_type.id == 2) // payment

                            var postUrl = $scope.$root.pr + "srm/srminvoice/invoice-for-refund-listings";

                        if (item.doc_type.id == 3) // refund

                            var postUrl = $scope.$root.pr + "srm/srminvoice/invoice-for-payment-listings";

                    }



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

    $scope.getPaidEntries = function(record) {
        // var mainRecord = record;
        // console.log(record);

        var doc_type = record.doc_type.name;
        var id = record.parent_id;
        var detail_id = record.id;

        var postData = {};

        if (record.module_type.value == 2) { // customer

            $scope.module_type.value = 2;
            $scope.moduleName = 'customer';

            if (record.doc_type.id == 2) // payment
            {
                $scope.entry_type = 5;
                $scope.doc_type = 2;

                var postUrl = $scope.$root.sales + "customer/order/invoice-for-refund-listings-paid";
            }

            if (record.doc_type.id == 3) // refund
            {
                $scope.entry_type = 6;
                $scope.doc_type = 1;
                var postUrl = $scope.$root.sales + "customer/order/invoice-for-payment-listings-paid";
            }

        } else if (record.module_type.value == 3) { // supplier

            $scope.module_type.value = 3;
            $scope.moduleName = 'supplier';

            if (record.doc_type.id == 2) // payment
            {
                $scope.entry_type = 5;
                $scope.doc_type = 2;
                var postUrl = $scope.$root.pr + "srm/srminvoice/invoice-for-refund-listings-paid";
            }

            if (record.doc_type.id == 3) // refund
            {
                $scope.entry_type = 6;
                $scope.doc_type = 1;
                var postUrl = $scope.$root.pr + "srm/srminvoice/invoice-for-payment-listings-paid";
            }
        }

        if (record.docType == 'General Journal') {
            if (record.debitAmount > 0) {
                $scope.entry_type = 5;
                $scope.doc_type = 2;
            }
            if (record.creditAmount > 0) {
                $scope.entry_type = 6;
            }
        }

        $scope.module_type = {};
        $scope.postData = {};

        if ($scope.entry_type == 5 || $scope.entry_type == 6) {
            $scope.payment_id = id;
            $scope.payment_detail_id = detail_id;
            postData.parent_id = id;

            $scope.invoice_id = 0;
        }
        postData.token = $scope.$root.token;

        postData.invoice_id = id;
        postData.detail_id = detail_id;
        postData.invoice_type = $scope.entry_type;

        $scope.total_amount = 0;
        $scope.total_setteled = 0;
        $scope.currency_code = '';

        $scope.showLoader = true;
        $http
            .post(postUrl, postData)
            .then(function(res) {
                if (res.data.ack == true) {
                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.total_paging_record = res.data.total_paging_record;
                    $scope.ReciptInvoiceModalarrPaid = res.data.response;

                    $scope.total_amount = Math.abs(Number(record.allocated_amount));
                    $scope.currency_code = (record.currency_id && record.currency_id.code) ? record.currency_id.code : '';

                    $scope.postData.title = 'Allocation details for  ' + doc_type + ' (' + res.data.response[0].code + ')';

                    $scope.total_setteled = 0;
                    angular.forEach($scope.ReciptInvoiceModalarrPaid, function(obj) {
                        $scope.total_setteled += Number(obj.paid_amount);
                    });
                    $scope.showLoader = false;
                    angular.element('#InvoicesForAllocatedPayments').modal({ show: true });
                } else {
                    $scope.showLoader = false;
                    toaster.pop('warning', 'Info', 'Amount is not allocated yet');
                    // toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            });
    }

    // Code for Item Journal Positive Entry starts

    $scope.getAllocatStockPostive = function(warehouse_id, item_id, order_id, getAllocatStockCount) {
        if ($scope.array_receipt_gl_form.type == 2)
            $scope.isLedgerInvoice = 1;
        else
            $scope.isLedgerInvoice = 0;

        $scope.all_whStockTemp = [];
        var getStockUrl = $scope.$root.sales + "warehouse/get-purchase-stock-positive";

        var postdata = {
            'warehouse_id': warehouse_id,
            'type': 3,
            'isLedgerInvoice': $scope.isLedgerInvoice,
            'item_id': item_id,
            'order_id': order_id,
            'token': $scope.$root.token
        };

        if (getAllocatStockCount == undefined) getAllocatStockCount = $rootScope.maxHttpRepeatCount;

        return $http
            .post(getStockUrl, postdata)
            .then(function(res) {
                //console.log(res.data.remaining_stock);
                $scope.formData.total_available_qty = 0;
                $scope.all_wh_stock = [];

                if (res.data.ack == true) {
                    $scope.all_whStockTemp = res.data.response;

                    angular.forEach($scope.all_whStockTemp, function(obj) {
                        $scope.formData.total_available_qty += Number(obj.avail_qty);
                        if (obj.type == 3)
                            $scope.all_wh_stock.push(obj);
                    });
                }

            }).catch(function(e) {
                if (getAllocatStockCount != 0) return $scope.getAllocatStock(warehouse_id, item_id, order_id, getAllocatStockCount - 1);
                $scope.showLoader = false;
                throw new Error(e.data);
            });
    }

    $scope.get_item_consignments_for_positive = function(item, index, p_id) {

        if (Number(item.item_id) == 0) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Item']));

            return;

        }

        if (item.warehouse == undefined || Number(item.warehouse.id) == 0) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Warehouse']));

            return;

        }

        if (item.qty == undefined || Number(item.qty) == 0) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Quantity']));

            return;

        }



        if (item.posting_date == undefined || item.posting_date == '') {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Posting Date']));

            return;

        }



        $scope.approvals_lock_order = 0;





        $scope.disable_save = false;



        var item_data = {};

        item_data.token = $scope.$root.token;



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

        $scope.showLoader = true;



        if (item.status == 2) {

            $rootScope.check_so_readonly = true;

            $rootScope.check_srm_readonly = true;

            $rootScope.hide_dispatch_btn = true;



            $scope.all_wh_stock = [];

            $scope.stock_item = item;

            $scope.stock_item.sale_status = 2;





            var warehouse_id = item.warehouse.id;

            var item_id = item.item_id;

            var order_id = $scope.parent_id;

            var sale_order_detail_id = 0;

            $scope.allocation_title = $scope.array_receipt_gl_form.acc_code;

            $scope.model_code = item.item_code;

            $scope.stock_item.product_code = item.item_code;

            $scope.stock_item.description = item.item_name;

            $scope.stock_item.warehouse_name = item.warehouse.name;

            var isInvoice = 0;



            // to show the add/delete stock button

            $scope.check_so_readonly = false;

            $scope.check_srm_readonly = true;

            $scope.hide_dispatch_btn = false;



            $scope.stock_item.qty = item.qty;

            $scope.remainig_qty = 0;



            $scope.order_qty = item.qty;

            $scope.current_stock = 0;



            var warehouse_id = item.warehouse.id;

            var warehouse_name = item.warehouse.name;

            var item_id = item.item_id;

            var order_id = $scope.parent_id;

            var purchase_order_detail_id = item.id;



            $scope.allocation_title = $scope.array_receipt_gl_form.acc_code;

            $scope.model_code = item.item_code;

            $scope.stock_item.product_code = item.item_code;

            $scope.stock_item.description = item.item_name;

            $scope.stock_item.warehouse_name = item.warehouse.name;

            var isInvoice = 0;



            $scope.rec = {};

            $scope.rec.order_code = $scope.model_code;



            // to show the add/delete stock button

            $scope.check_so_readonly = false;



            $scope.hide_dispatch_btn = false;



            $scope.stock_item.qty = item.qty;

            $scope.total_remaing = 0;



            $scope.order_qty = item.qty;

            $scope.current_stock = 0;

            $scope.showLoader = false;

            // toaster.pop('error', 'Error', 'Done');//ware_modal 

            // get warehouse storage locations assigned in item start



            $scope.storage_loc = [];



            $scope.stockAllocationRecord = {};

            $scope.stockAllocationcolumns = [];



            $scope.formData = {};



            $scope.formData.item_id = item.item_id;

            $scope.formData.order_id = $scope.parent_id;

            $scope.formData.orderLineID = purchase_order_detail_id;

            $scope.formData.warehousesID = item.warehouse.id;

            $scope.formData.warehouses_name = item.warehouse.name;

            // $scope.formData.locationID = item.location.wh_loc_id;

            $scope.formData.locationID = item.location.id;

            $scope.formData.locationName = item.location.Storage_location;

            $scope.formData.itemJournalChk = 1;

            $scope.formData.itemCode = $scope.array_receipt_gl_form.acc_code;

            $scope.formData.item_qty = item.qty;

            $scope.formData.unit_of_measure_name = item.uom_name;

            $scope.formData.product_code = item.item_code;

            $scope.formData.product_name = item.item_name;

            $scope.formData.receiptDate = item.posting_date;

            $scope.formData.uomID = item.uom.id;

            $scope.formData.uom = item.uom.name;

            $scope.formData.unit_of_measure_name = item.uom.name;

            $scope.formData.uomQTY = item.uom.quantity;

            $scope.formData.ref_unit_id = item.uom.ref_unit_id;

            $scope.formData.ref_quantity = item.uom.ref_quantity;





            $scope.current_stock_by_id(warehouse_id, item_id, 1).then(function() {

                $scope.formData.currentStock = $scope.current_stock;

            });



            $scope.getAllocatStockPostive(warehouse_id, item_id, order_id)

            .then(function() {

                $scope.showLoader = false;



                // $scope.all_wh_stock;





                // console.log($scope.formData.purchase_status);

                if ($scope.formData.purchase_status == undefined)

                    $scope.formData.purchase_status = 0;



                $scope.selStorageLoc = '';



                if ($scope.storage_loc.length == 1)

                    $scope.selStorageLoc = $scope.storage_loc[0];



                $scope.stockAllocationRecord = [];



                angular.forEach($scope.all_wh_stock, function(val) {



                    $scope.stockAllocationRecord.push({

                        'warehouse': $scope.formData.warehouses_name,

                        'container_no': val.container_no,

                        'batch_no': val.batch_no,

                        'unit_of_measure_name': $scope.formData.unit_of_measure_name,

                        'prod_date': val.prod_date,

                        'date_received': val.date_received,

                        'use_by_date': val.use_by_date,

                        'id': val.id,

                        'stock_qty': val.total_qty

                    });

                });





                angular.forEach($scope.stockAllocationRecord[0], function(val, index) {

                    $scope.stockAllocationcolumns.push({

                        'title': toTitleCase(index),

                        'field': index,

                        'visible': true

                    });

                });



                $scope.stockAllocationSearch = {};



                if (!($scope.all_wh_stock.length > 0)) {

                    $scope.allocRec = {};

                    $scope.allocRec.product_id = $scope.formData.item_id;

                    $scope.allocRec.warehouse_id = $scope.formData.warehousesID;

                    // $scope.allocRec.item_trace_unique_id = $scope.formData.item_trace_unique_id;



                    $scope.all_wh_stock.push($scope.allocRec);

                }



                $scope.show_import_div = false;

                angular.element('#ware_modal').modal({ show: true });

            });



        } else {



            var singleSaveUrl = $scope.$root.gl + "chart-accounts/add-jl-journal-receipt-item-single";



            $http

                .post(singleSaveUrl, item_data)

            .then(function(res) {

                if (res.data.ack == true) {

                    $scope.backend_data = 1;

                    item.id = res.data.id;

                    item.parent_id = $scope.parent_id;



                    $scope.all_wh_stock = [];

                    $scope.stock_item = item;



                    var warehouse_id = item.warehouse.id;

                    var warehouse_name = item.warehouse.name;

                    var item_id = item.item_id;

                    var order_id = $scope.parent_id;

                    var purchase_order_detail_id = res.data.id;



                    $scope.allocation_title = $scope.array_receipt_gl_form.acc_code;

                    $scope.model_code = item.item_code;

                    $scope.stock_item.product_code = item.item_code;

                    $scope.stock_item.description = item.item_name;

                    $scope.stock_item.warehouse_name = item.warehouse.name;

                    var isInvoice = 0;



                    $scope.rec = {};

                    $scope.rec.order_code = $scope.model_code;



                    // to show the add/delete stock button

                    $scope.check_so_readonly = false;



                    $scope.hide_dispatch_btn = false;



                    $scope.stock_item.qty = item.qty;

                    $scope.total_remaing = 0;



                    $scope.order_qty = item.qty;

                    $scope.current_stock = 0;

                    $scope.showLoader = false;

                    // toaster.pop('error', 'Error', 'Done');//ware_modal 

                    // get warehouse storage locations assigned in item start



                    $scope.storage_loc = [];



                    $scope.stockAllocationRecord = {};

                    $scope.stockAllocationcolumns = [];



                    // $scope.readonly_journal = false;



                    if ($scope.readonly_journal == true) {

                        $scope.check_srm_readonly = true;

                    } else {

                        $scope.check_srm_readonly = false;

                    }



                    // get warehouse storage locations assigned in item end



                    $scope.formData = {};



                    $scope.formData.item_id = item.item_id;

                    $scope.formData.order_id = $scope.parent_id;

                    $scope.formData.orderLineID = purchase_order_detail_id;

                    $scope.formData.warehousesID = item.warehouse.id;

                    $scope.formData.warehouses_name = item.warehouse.name;

                    // $scope.formData.locationID = item.location.wh_loc_id;

                    $scope.formData.item_trace_unique_id = item.item_trace_unique_id;

                    $scope.formData.locationID = item.location.id;

                    $scope.formData.locationName = item.location.Storage_location;

                    $scope.formData.itemJournalChk = 1;

                    $scope.formData.itemCode = $scope.array_receipt_gl_form.acc_code;

                    $scope.formData.item_qty = item.qty;

                    $scope.formData.unit_of_measure_name = item.uom_name;

                    $scope.formData.product_code = item.item_code;

                    $scope.formData.product_name = item.item_name;

                    $scope.formData.receiptDate = item.posting_date;

                    $scope.formData.uomID = item.uom.id;

                    $scope.formData.uom = item.uom.name;

                    $scope.formData.unit_of_measure_name = item.uom.name;

                    $scope.formData.uomQTY = item.uom.quantity;

                    $scope.formData.ref_unit_id = item.uom.ref_unit_id;

                    $scope.formData.ref_quantity = item.uom.ref_quantity;



                    if (res.data.stockAlloc != undefined && res.data.stockAlloc.response != undefined) {

                        $scope.stockAllocationRecord = res.data.stockAlloc.response;



                        angular.forEach($scope.stockAllocationRecord, function(obj) {



                            obj.unit_of_measure_name = $scope.formData.unit_of_measure_name;

                            obj.warehouse = $scope.formData.warehouses_name;

                            obj.stock_qty = obj.quantity;

                            obj.editchk = 0;

                        });



                        $scope.stockAllocationTotal = res.data.stockAlloc.total;



                    }



                    if ($scope.stockAllocationTotal == null)

                        $scope.total_remaing = $scope.formData.item_qty;

                    else {

                        $scope.total_remaing = (Number($scope.formData.item_qty)) - (Number($scope.stockAllocationTotal));



                        if ($scope.total_remaing < 0)

                            $scope.total_remaing = 0;

                    }



                    $scope.formData.stock_qty = $scope.total_remaing;



                    $scope.current_stock_by_id(warehouse_id, item_id, 1).then(function() {

                        $scope.formData.currentStock = $scope.current_stock;

                    });



                    $scope.getAllocatStockPostive(warehouse_id, item_id, order_id)

                    .then(function() {

                        $scope.showLoader = false;



                        // console.log($scope.formData.purchase_status);

                        if ($scope.formData.purchase_status == undefined)

                            $scope.formData.purchase_status = 0;



                        $scope.selStorageLoc = '';



                        if ($scope.storage_loc.length == 1)

                            $scope.selStorageLoc = $scope.storage_loc[0];





                        // 'storage_location': $scope.selStorageLoc,



                        if ($scope.stockAllocationTotal != null) {

                            if ($scope.formData.stock_qty > 0) {

                                $scope.stockAllocationRecord.push({

                                    'warehouse': $scope.formData.warehouses_name,

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

                        }



                        angular.forEach($scope.stockAllocationRecord[0], function(val, index) {

                            $scope.stockAllocationcolumns.push({

                                'title': toTitleCase(index),

                                'field': index,

                                'visible': true

                            });

                        });



                        $scope.stockAllocationSearch = {};



                        if (!($scope.all_wh_stock.length > 0)) {

                            $scope.allocRec = {};

                            $scope.allocRec.product_id = $scope.formData.item_id;

                            $scope.allocRec.warehouse_id = $scope.formData.warehousesID;

                            $scope.allocRec.item_trace_unique_id = $scope.formData.item_trace_unique_id;



                            $scope.all_wh_stock.push($scope.allocRec);

                        }



                        // $scope.stockAllocationSearch = '';

                        $scope.show_import_div = false;

                        angular.element('#ware_modal').modal({ show: true });

                    });



                } //purchase_order_detail_id

            });



        }

    }





    $scope.editModeAllocation = function(rec) {

        rec.editchk = 1;

    }



    $scope.allocateQty = function(rec, update) {

        // console.log(rec);



        var ttlqty = 0;

        var allocationError = 0;



        angular.forEach($scope.stockAllocationRecord, function(obj) {

            // console.log(obj.id);



            if (obj.id > 0 && Number(obj.stock_qty) > 0)

                ttlqty += Number(obj.stock_qty);

            else if (!(obj.stock_qty > 0))

                allocationError++;

        });



        if (allocationError > 0) {

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Quantity']));

            return;

        }





        if (Number(rec.stock_qty <= 0)) {

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(360, ['Quantitiy', '0']));

            return;

        }



        if (!(update > 0))

            $scope.currentttlqty = parseInt(ttlqty) + parseInt(rec.stock_qty);

        else

            $scope.currentttlqty = parseInt(ttlqty);





        if (Number($scope.currentttlqty) > parseInt($scope.formData.item_qty)) {

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(359));

            return;

        }



        $scope.tmpTotalQtyLeft = parseInt($scope.formData.item_qty) - parseInt($scope.currentttlqty);



        $validDates = $scope.validateDates(rec.prod_date, rec.date_received, rec.use_by_date);



        //console.log($validDates);

        if ($validDates == 0)

            return false;



        // $scope.tmpStockQty = parseInt($scope.formData.stock_qty) - parseInt(rec.stock_qty);

        $scope.tmpStockQty = parseInt($scope.tmpTotalQtyLeft);



        if ($scope.tmpStockQty < 0)

            $scope.tmpStockQty = 0;



        $scope.formData.stock_qty = $scope.tmpStockQty;



        rec.purchase_return_status = 0;

        rec.purchase_status = 1;



        /* rec.location = "";



        if (rec.storage_location !== undefined)

            rec.storage_loc_id = rec.storage_location.id;



        rec.location = rec.storage_loc_id; */

        // rec.order_date1 = $rootScope.posting_date;

        rec.token = $scope.$root.token;

        // rec.supplier_id = $scope.rec.sell_to_cust_id;

        rec.order_id = $scope.formData.order_id;

        rec.product_id = $scope.formData.item_id;

        rec.warehouses_id = $scope.formData.warehousesID;

        rec.orderLineID = $scope.formData.orderLineID;

        rec.location = $scope.formData.locationID;

        rec.storage_loc_id = $scope.formData.locationID;

        rec.type = 3;



        rec.primary_unit_id = $scope.formData.ref_unit_id;

        rec.primary_unit_name = $scope.formData.uom;

        rec.primary_unit_qty = $scope.formData.ref_quantity;



        rec.unit_of_measure_id = $scope.formData.uomID;

        rec.unit_of_measure_name = $scope.formData.uom;

        rec.unit_of_measure_qty = $scope.formData.uomQTY;



        if (rec.date_received == undefined) {

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Date Received']));

            return;

        }



        var addAllocUrl = $scope.$root.setup + "warehouse/item-journal-stk-allocation";



        $http

            .post(addAllocUrl, rec)

        .then(function(res) {

            if (res.data.ack == 1) {

                //$scope.get_warehouse_list();

                // $scope.clear_form();



                if (rec.id > 0) {

                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));

                    // console.log($scope.stockAllocationRecord[$scope.stockAllocationRecord.length - 1]);

                    // console.log($scope.tmpTotalQtyLeft);



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



                    // console.log($scope.stockAllocationRecord[$scope.stockAllocationRecord.length - 1].storage_location);



                    if ($scope.stockAllocationRecord[$scope.stockAllocationRecord.length - 1].stock_qty > 0 &&

                        $scope.tmpTotalQtyLeft == 0 &&

                        $scope.stockAllocationRecord[$scope.stockAllocationRecord.length - 1].editchk == 1 &&

                        !($scope.stockAllocationRecord[$scope.stockAllocationRecord.length - 1].id > 0))

                        $scope.stockAllocationRecord.splice(-1, 1);



                } else {

                    toaster.pop('success', 'Add', 'Quantity Allocated');

                    rec.id = res.data.id;



                    // console.log($scope.formData.stock_qty);



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



                // console.log($scope.total_remaing);



                if ($scope.total_remaing == 0) {

                    $scope.formData.purchase_status = 1;

                    $scope.formData.remainig_qty = 0;

                }

            } else {

                if (rec.id > 0)

                    toaster.pop('error', 'Edit', res.data.error);

                else

                    toaster.pop('error', 'Error', res.data.error);

            }

        }).catch(function(message) {

            $scope.showLoader = false;



            throw new Error(message.data);

        });

    }





    $scope.NavigateOrder = function(rec) {

        $scope.searchKeyword = {};

        $scope.searchKeyword.navigate_search = "";



        $scope.navigate_data = {};

        $scope.navigate_title = 'Journal No. ' + rec.acc_code;

        $scope.navigate_type = 1;



        $scope.navigatePostingDate = '';

        $scope.navigatePostingByName = '';



        var navigate_url = $scope.$root.sales + "customer/order/navigate-invoice";

        var type = (rec.module_type == 3) ? 11 : 5;



        var postData = {

            'token': $scope.$root.token,

            'type': type,

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

            }



            if (res.data.ack != undefined)

                $scope.showLoader = false;



        });



        angular.element('#order_navigate_modal').modal({ show: true });

    }



    $scope.delete_ware = function(id, index, arr_data) {

        var delStockAllocationUrl = $scope.$root.setup + "warehouse/delete-stk-allocation";



        $scope.tmpStockQty = parseInt($scope.formData.stock_qty) + parseInt(arr_data[index].stock_qty);



        if ($scope.tmpStockQty < 0)

            $scope.tmpStockQty = 0;



        ngDialog.openConfirm({

            template: 'modalUnallocateDialogId',

            className: 'ngdialog-theme-default-custom'

        }).then(function(value) {

            $http

                .post(delStockAllocationUrl, { 'id': id, 'token': $scope.$root.token })

            .then(function(res) {

                if (res.data.ack == true) {

                    toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));



                    arr_data.splice(index, 1);



                    $scope.formData.stock_qty = $scope.tmpStockQty;

                    $scope.total_remaing = $scope.tmpStockQty;



                    // console.log($scope.tmpStockQty);



                    if (arr_data.length > 0) {

                        if (!(arr_data[arr_data.length - 1].id > 0))

                            arr_data.splice(-1, 1);

                    }



                    if (arr_data.length > 0) {



                        // console.log($scope.stockAllocationRecord[$scope.stockAllocationRecord.length - 1]);





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



                throw new Error(message.data);

            });

        }, function(reason) {

            $scope.showLoader = false;

            console.log('Modal promise rejected. Reason: ', reason);

        });

    }



    $scope.updateAllocationResults = function() {



        angular.forEach($scope.receipt_sub_list, function(obj) {



            if (obj.id == $scope.formData.orderLineID) {

                obj.remainig_qty = $scope.total_remaing;

                obj.allocated_stock = parseFloat($scope.formData.item_qty) - parseFloat($scope.total_remaing);

            }

        });



        angular.element('#ware_modal').modal('hide');

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

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(361, ['Date Received', 'Production Date']));

                return false;

            }



            if (lDate > cDate) {

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(361, ['Use By Date', 'Date Received']));

                return false;

            }



            if (cDate < fDate) {

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(361, ['Use By Date', 'Production Date']));

                return false;

            }

            return true;

        }

    }



    var showOrderTrailCount;



    $scope.showOrderTrail = function(stock, list_type, entries_type) {

        $scope.searchKeyword_2 = {};

        var stock_trail_url = $scope.$root.setup + "warehouse/sale-stock-trial";



        var postData = {

            'token': $scope.$root.token,

            'prod_id': stock.product_id,

            'list_type': list_type,

            'entries_type': entries_type,

            'warehouse_id': stock.warehouse_id

        };



        if (list_type == 'current_stock') {

            $scope.stock_activity_title = 'Current Stock';

        } else if (list_type == 'available_stock') {

            $scope.stock_activity_title = 'Available Stock';

        } else if (list_type == 'allocated_stock') {

            $scope.stock_activity_title = 'Allocated Stock';

        }



        if (entries_type != undefined)

            postData.item_trace_unique_id = stock.item_trace_unique_id;

        if (stock == undefined) {

            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(361, ['Stock']));

            return false;

        }



        // postData.item_trace_unique_id = stock.item_trace_unique_id;



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



    // Code for Item Journal Positive Entry Ends



    $scope.get_item_consignments_for_negative = function(item, index, p_id) {



        $scope.approvals_lock_order = 0;



        if (item.status == 2) {

            $rootScope.check_so_readonly = true;

            $rootScope.check_srm_readonly = true;

            $rootScope.hide_dispatch_btn = true;



            $scope.all_wh_stock = [];

            $scope.stock_item = item;

            $scope.stock_item.sale_status = 2;



            var warehouse_id = item.warehouse.id;

            var item_id = item.item_id;

            var order_id = $scope.parent_id;

            var sale_order_detail_id = 0;

            $scope.allocation_title = $scope.array_receipt_gl_form.acc_code;

            $scope.model_code = item.item_code;

            $scope.stock_item.product_code = item.item_code;

            $scope.stock_item.description = item.item_name;

            $scope.stock_item.warehouse_name = item.warehouse.name;

            $scope.stock_item.location_name = item.location.Storage_location;

            $scope.stock_item.units = item.uom;



            var isInvoice = ($scope.array_receipt_gl_form.type == 2) ? 1 : 0;



            // to show the add/delete stock button

            $scope.check_so_readonly = false;

            $scope.check_srm_readonly = false;

            $scope.hide_dispatch_btn = false;



            $scope.stock_item.qty = item.qty;

            $scope.remainig_qty = 0;



            $scope.order_qty = item.qty;

            $scope.current_stock = 0;

            $scope.showLoader = false;



            $scope.stock_item.item_journal = 1;

            var getStockUrl = $scope.$root.sales + "warehouse/get-purchase-stock-journal";

            $http

                .post(getStockUrl, {

                'warehouse_id': warehouse_id,

                type: 1,

                'item_journal_detail_id': item.id,

                item_id: item_id,

                order_id: order_id,

                isInvoice: isInvoice,

                'token': $scope.$root.token

            })

            .then(function(res) {

                //console.log(res.data.remaining_stock);

                if (res.data.ack == true) {

                    $scope.all_wh_stock = res.data.response;

                    $scope.stock_item.total_available_qty = 0;

                    /* angular.forEach($scope.all_wh_stock, function (obj) {
        
                                $scope.stock_item.total_available_qty += Number(obj.avail_qty);
        
                            }); */

                    angular.forEach($scope.all_wh_stock, function(obj) {

                        $scope.stock_item.total_available_qty = Number(obj.available_stock);

                    });



                    $scope.stock_allocate_detail(item_id, 0, warehouse_id, item.id);

                    $scope.current_stock_by_id(warehouse_id, item_id);

                    angular.element('#stockAllocationModal').modal({ show: true });

                } else {

                    $scope.all_wh_stock = [];

                    $scope.stock_item.total_available_qty = 0;

                }

            });

        } else {

            if (Number(item.item_id) == 0) {

                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Item']));

                return;

            }

            if (item.warehouse == undefined || Number(item.warehouse.id) == 0) {

                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Warehouse']));

                return;

            }

            if (item.qty == undefined || Number(item.qty) == 0) {

                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Quantity']));

                return;

            }





            $scope.disable_save = false;

            var singleSaveUrl = $scope.$root.gl + "chart-accounts/add-jl-journal-receipt-item-single";

            var item_data = {};

            item_data.token = $scope.$root.token;





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

            $scope.showLoader = true;

            $http

                .post(singleSaveUrl, item_data)

            .then(function(res) {

                if (res.data.ack == true) {

                    $scope.backend_data = 1;

                    item.id = res.data.id;

                    item.parent_id = $scope.parent_id;



                    $scope.all_wh_stock = [];

                    $scope.stock_item = item;

                    if ($scope.readonly_journal == true)

                        $scope.stock_item.sale_status = 2; // for disabling the edit (used as a flag)

                    else

                        $scope.stock_item.sale_status = 1; // for disabling the edit



                    var warehouse_id = item.warehouse.id;

                    var item_id = item.item_id;

                    var order_id = $scope.parent_id;

                    var sale_order_detail_id = 0;

                    $scope.allocation_title = $scope.array_receipt_gl_form.acc_code;

                    $scope.model_code = item.item_code;

                    $scope.stock_item.product_code = item.item_code;

                    $scope.stock_item.description = item.item_name;

                    $scope.stock_item.warehouse_name = item.warehouse.name;

                    $scope.stock_item.location_name = item.location.Storage_location;

                    $scope.stock_item.units = item.uom;



                    // to show the add/delete stock button

                    $scope.check_so_readonly = false;

                    $scope.check_srm_readonly = false;

                    $scope.hide_dispatch_btn = false;



                    $scope.stock_item.qty = item.qty;

                    $scope.remainig_qty = 0;



                    $scope.order_qty = item.qty;

                    $scope.current_stock = 0;

                    $scope.showLoader = false;

                    $scope.stock_item.item_journal = 1;

                    var getStockUrl = $scope.$root.sales + "warehouse/get-purchase-stock-journal";

                    $http

                        .post(getStockUrl, {

                        'warehouse_id': warehouse_id,

                        type: 1,

                        'item_journal_detail_id': item.id,

                        item_id: item_id,

                        order_id: order_id,

                        isInvoice: isInvoice,

                        'token': $scope.$root.token

                    })

                    .then(function(res) {

                        //console.log(res.data.remaining_stock);

                        if (res.data.ack == true) {

                            $scope.all_wh_stock = res.data.response;

                            $scope.stock_item.total_available_qty = 0;

                            angular.forEach($scope.all_wh_stock, function(obj) {

                                $scope.stock_item.total_available_qty += Number(obj.avail_qty);

                            });

                            $scope.stock_allocate_detail(item_id, 0, warehouse_id, item.id);

                            $scope.current_stock_by_id(warehouse_id, item_id);

                            angular.element('#stockAllocationModal').modal({ show: true });

                        } else {

                            $scope.all_wh_stock = [];

                            $scope.stock_item.total_available_qty = 0;

                        }

                    });

                }

            });

        }

    }

    $scope.stock_allocate_detail = function(item_id, show, warehouse_id, update_id) {

        $scope.all_order_stock = [];

        var getAllStockUrl = $scope.$root.sales + "warehouse/get-order-stock-allocation";

        $http

            .post(getAllStockUrl, {

            type: 2,

            item_id: item_id,

            order_id: $scope.parent_id,

            item_journal: '1',

            'item_journal_detail_id': update_id,

            wh_id: warehouse_id,

            'token': $scope.$root.token

        })

        .then(function(res) {

            if (res.data.ack == true) {

                $scope.all_order_stock = res.data.response;

                var ordqty = 0;

                angular.forEach(res.data.response, function(elem) {

                    ordqty = Number(ordqty) + Number(elem.quantity);

                });

                if (ordqty > 0)

                    $scope.hide_btn_delete = true;

                else

                    $scope.hide_btn_delete = false;



                $scope.remainig_qty = Number($scope.order_qty) - Number(ordqty);

                console.log($scope.remainig_qty);

                if (show == 3) {

                    angular.forEach($scope.items, function(obj, index) {

                        if (obj.id == item_id && (obj.warehouse_id == warehouse_id || obj.warehouses == warehouse_id) && obj.update_id == update_id) {

                            $scope.items[index].remainig_qty = $scope.remainig_qty;

                            $scope.items[index].journal_status = res.data.response[0].journal_status;

                        }

                    });



                }

            } else {

                $scope.all_order_stock = [];

                $scope.hide_btn_delete = false;

                $scope.remainig_qty = $scope.order_qty;

                if (show == 3) {

                    angular.forEach($scope.items, function(obj, index) {

                        if (obj.id == item_id && (obj.warehouse_id == warehouse_id || obj.warehouses == warehouse_id) && obj.update_id == update_id) {

                            $scope.items[index].remainig_qty = $scope.order_qty;

                            $scope.items[index].journal_status = 0;

                        }

                    });

                }

            }

        });



        if (show == 1)

            angular.element('#stockAllocationDetailModal').modal({ show: true });

    }

    $scope.current_stock_by_id = function(warehouse_id, item_id, postiveParam) {

        $scope.all_order_stock = [];

        var getAllStockUrl = $scope.$root.sales + "warehouse/get-curent-stock-by-product-id-warehouse";

        return $http

            .post(getAllStockUrl, {

            'item_id': item_id,

            'warehouse_id': warehouse_id,

            'token': $scope.$root.token

        })

        .then(function(res) {

            if (res.data.ack == true)

                $scope.current_stock = res.data.current_stock;



            if ((res.data.ack == false || $scope.current_stock == 0) && $scope.rec.type2 != 2 && postiveParam != 1)

                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(363));





        });



    }

    $scope.getAllocatStock = function(warehouse_id, item_id, order_id, item_journal_detail_id) {

        var isInvoice = 0;

        if ($scope.rec.type2 == 2) {

            isInvoice = 1;

        }

        $scope.all_wh_stock = [];

        var getStockUrl = $scope.$root.sales + "warehouse/get-purchase-stock-journal";

        $http

            .post(getStockUrl, {

            'warehouse_id': warehouse_id,

            type: 1,

            'item_journal_detail_id': item_journal_detail_id,

            item_id: item_id,

            order_id: order_id,

            isInvoice: isInvoice,

            'token': $scope.$root.token

        })

        .then(function(res) {

            //console.log(res.data.remaining_stock);

            if (res.data.ack == true) {

                $scope.all_wh_stock = res.data.response;

                $scope.stock_item.total_available_qty = 0;

                angular.forEach($scope.all_wh_stock, function(obj) {

                    $scope.stock_item.total_available_qty += Number(obj.avail_qty);

                });

            } else {

                $scope.all_wh_stock = [];

                $scope.stock_item.total_available_qty = 0;

            }

        });



    }

    $scope.OnFocusQty = function(stock_item) {

        stock_item.active_line = true;

    }

    $scope.OnBlurQty = function(stock_item) {

        stock_item.active_line = false;

    }





    $scope.addStockItem = function(stock, stock_item) {

        stock.active_line = false;



        if (Number(stock.req_qty) <= 0 || stock.req_qty == undefined) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(319, ['Quantity', '0']));

            return false;

        }

        if (Number(stock.req_qty) > Number(stock.avail_qty)) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(359));

            return false;

        }

        if (Number($scope.remainig_qty) == 0) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(319, ['Remaining Quantity', '0']));

            return false;

        }

        if (Number(stock.req_qty) > Number($scope.remainig_qty)) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(359));

            return false;

        }





        var addStockUrl = $scope.$root.sales + "warehouse/add-order-stock-allocation-journal";

        stock.token = $scope.$root.token;

        // stock.source_type = stock.type;

        stock.type = 3;

        stock.item_journal_detail_id = stock_item.id;

        stock.ledger_type = 2;



        stock.order_id = $scope.parent_id;

        stock.bl_shipment_no = stock.bl_shipment_no;

        stock.item_id = stock_item.item_id;

        // stock.warehouse_id = stock_item.warehouses.id;

        stock.warehouse_id = stock_item.warehouse.id;

        stock.order_date = stock.posting_date;

        stock.units = stock_item.units;

        stock.default_units = stock_item.default_units;

        stock.unit_measure_id = (stock_item.uom != undefined && stock_item.uom.id != '') ? stock_item.uom.id : 0;

        stock.uom_name = (stock_item.uom != undefined && stock_item.uom.name != '') ? stock_item.uom.name : 0;

        stock.primary_unit_id = stock.unit_measure_id;

        stock.primary_unit_name = stock_item.primary_unit_of_measure_name;

        stock.sale_return_status = 0;

        $http

            .post(addStockUrl, stock)

        .then(function(res) {



            if (res.data.ack == true) {



                stock.active_line = true;

                if (stock.id > 0) {

                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));

                    if ($rootScope.ConvertDateToUnixTimestamp(stock.use_by_date) < $rootScope.ConvertDateToUnixTimestamp($scope.$root.get_current_date()))

                        toaster.pop('warning', 'Warning', 'Used by date of allocated item has already passed');

                } else

                    toaster.pop('success', 'Add', 'Record  Inserted  .');



                stock.allocated_qty = Number(stock.allocated_qty) + Number(stock.req_qty);

                stock.currently_allocated_qty = Number(stock.currently_allocated_qty) + Number(stock.req_qty);

                stock.avail_qty = Number(stock.avail_qty) - Number(stock.req_qty);

                stock_item.total_available_qty = Number(stock_item.total_available_qty) - Number(stock.req_qty);

                stock_item.allocated_stock = stock_item.allocated_stock + stock.req_qty;

                stock.req_qty = '';

                $scope.stock_allocate_detail(stock_item.item_id, 3, stock_item.warehouse.id, stock_item.id);

                $scope.current_stock_by_id(stock_item.warehouse.id, stock_item.item_id);



            } else {

                // $scope.stock_allocate_detail(stock_item.id, 3, stock_item.warehouses, stock_item.update_id);



                $scope.getAllocatStock(stock_item.warehouse.id, stock_item.item_id, $scope.parent_id, stock_item.id);

                $scope.stock_allocate_detail(stock_item.item_id, 0, stock_item.warehouse.id, stock_item.id);

                $scope.current_stock_by_id(stock_item.warehouse.id, stock_item.item_id);



                toaster.pop('error', 'Edit', res.data.error);

            }

        });

    }



    $scope.delStockItem = function(stock, stock_item) {

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

        postData.order_id = $scope.parent_id;

        stock.item_journal_detail_id = stock_item.id;

        stock.item_id = stock_item.id;

        // stock.source_type = stock.type;

        stock.ledger_type = 2 // will be zero when we allocate stock to sales order;



        postData.token = $scope.$root.token;

        if (stock.req_qty == stock.currently_allocated_qty)

            var delStockUrl = $scope.$root.sales + "warehouse/delete-item-journal-stock";

        else

            var delStockUrl = $scope.$root.sales + "warehouse/deallocate-item-journal-stock";

        /*console.log(stock);

         return;*/

        $http

            .post(delStockUrl, { 'postData': postData, 'token': $scope.$root.token })

        .then(function(res) {

            if (res.data.ack == true) {

                stock.active_line = true;

                stock.allocated_qty = Number(stock.allocated_qty) - Number(stock.req_qty);

                stock.currently_allocated_qty = Number(stock.currently_allocated_qty) - Number(stock.req_qty);

                stock.avail_qty = Number(stock.avail_qty) + Number(stock.req_qty);

                stock_item.total_available_qty = Number(stock_item.total_available_qty) + Number(stock.req_qty);

                stock_item.allocated_stock = stock_item.allocated_stock - Number(stock.req_qty);



                stock.req_qty = '';

                $scope.stock_allocate_detail(stock_item.item_id, 3, stock_item.warehouse.id, stock_item.id);

                $scope.current_stock_by_id(stock_item.warehouse.id, stock_item.item_id);



            } else {

                $scope.getAllocatStock(stock_item.warehouses, stock_item.id, $scope.parent_id, stock_item.update_id);

                $scope.stock_allocate_detail(stock_item.item_id, 0, stock_item.warehouse.id, stock_item.id);

                $scope.current_stock_by_id(stock_item.warehouse.id, stock_item.item_id);

                toaster.pop('error', 'Edit', res.data.error);

            }



        });



    }





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



    $scope.change_amount_invoice = function(item) {

        if (item.amount > 0)

            item.chk = true;

    }



    $scope.setremainingamount = function(item) {

        var amount2 = 0;



        if (item.is_infull == true) {

            if ((item.grand_total - item.paid_amount) == 0)

                item.amount = item.grand_total;

            else if (item.grand_total - item.paid_amount > 0)

                item.amount = (item.grand_total - item.paid_amount);



            if ($scope.amount_left < item.amount)

                item.amount = Number($scope.amount_left);



        } else if (item.amount != undefined) {

            if ((item.grand_total - item.paid_amount) == 0)

                item.amount = 0;

            else if (item.grand_total - item.paid_amount > 0)

                amount2 = (item.grand_total - item.paid_amount);



            if (item.amount > Number(amount2))

                item.amount = Number(amount2);



        }

        item.amount = item.amount.toFixed(2);

        item.amount = Number(item.amount);

    }



    $scope.netTotal = function() {

        var ctotal = 0;

        angular.forEach($scope.ReciptInvoiceModalarr, function(item) {

            if (item.amount >= 0)

                ctotal += Number(item.amount);

            // ctotal += Number(item.paid_amount);

        });

        $scope.amount_left = Number(Number($scope.amount_total.toFixed(2)) - Number(ctotal.toFixed(2)) - Number($scope.allocated_amount).toFixed(2)).toFixed(2);

        return $scope.amount_left;

    }



    $scope.setremianrefund = function(item) {



        if (angular.element('#checkremaingamountrefund_' + item.id).is(':checked') == true)

            item.amount = item.outstanding_amount;

        else if (Number(item.amount) > Number(item.outstanding_amount))

            item.amount = item.outstanding_amount;

        //else  if(item.amount !=undefined  ) item.amount=item.outstanding_amount;





        if ($scope.amount_total < item.amount)

            item.amount = $scope.amount_total;





        //save conversion price in RECEIPt Journal for  Profit & Loss Accounts

        item.converted_price = (Number(item.amount) / Number(item.currency_rate)) - (Number(item.amount) / Number($scope.cnv_rate));





        console.log(item.currency_rate);

        console.log($scope.cnv_rate);



        console.log(item.converted_price);



    }



    $scope.netTotalrefund = function() {

        /* var ctotal = 0;

        angular.forEach($scope.ReciptInvoiceModalarr, function (item) {

            if (item.amount >= 0)

                ctotal += Number(item.amount);

        });

        return Number(($scope.amount_total - ctotal)); */

    }



    $scope.get_payed_list = function(item) {



        $scope.Recipt_payed = [];

        $scope.title_payed = 'Invoice Payment';

        $scope.item_detail = item;

        $scope.postData = {};

        $scope.postData.invoice = item.id; //item.account_id;

        $scope.postData.token = $scope.$root.token;

        $scope.postData.more_fields = 1;

        var personUrledit = $scope.$root.gl + "chart-accounts/get-invoice-receipt-payment";



        $http

            .post(personUrledit, $scope.postData)

        .then(function(res) {

            if (res.data.ack == true) {

                $scope.Recipt_payed = res.data.response;

                //         angular.element('#RecptAccountpop').modal({show: true});

                angular.element('#RecptAccountpop_payed_list').modal({ show: true });

            } else

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

        });

    }



    $scope.deletepayedlist = function(id, index, arry) {





        ngDialog.openConfirm({

            template: 'modalDeleteDialogId',

            className: 'ngdialog-theme-default-custom'

        }).then(function(value) {

            var delUrl = $scope.$root.gl + "chart-accounts/delete-invoice-receipt-payment";



            $http

                .post(delUrl, { id: id, 'token': $scope.$root.token })

            .then(function(res) {

                if (res.data.ack == true) {

                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));

                    arry.splice(index, 1);



                } else

                    toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));



            });

        }, function(reason) {

            console.log('Modal promise rejected. Reason: ', reason);

        });



    }



    $scope.postfianancedata = {};

    $scope.get_finance_entry_account = function() {



        var getaccountcompany = $scope.$root.setup + "general/get-financial-setting";

        $http

            .post(getaccountcompany, { 'token': $scope.$root.token, 'id': $scope.$root.defaultCompany })

        .then(function(res) {

            if (res.data.ack == true)

                $scope.postfianancedata = res.data.response;

            else {

                if ($scope.isPosted == 0) {

                    toaster.pop('error', 'info', 'Setup for G/L Account(s) and Foreign Currency Movement Not Found.');

                } else

                    toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(400));

            }



        });

    }



    $scope.get_finance_entry_account();



    $scope.addrecptget_invoice = function(id) {



        var post = {};

        var temp = [];

        var amount = 0;

        var new_amount = 0;

        var totalrelizecount = 0

        var account_id = 0;



        $.each($scope.ReciptInvoiceModalarr, function(index, obj) {

            if (obj.amount > 0) {



                //if($scope.doc_type==1)

                new_amount = Number(obj.amount);

                temp.push({

                    id: obj.id,
                    amount: obj.amount,
                    sale_person_id: obj.sale_person_id,
                    total_allocatin: new_amount,
                    posting_group: obj.posting_group,

                    allocate_id: obj.allocate_id,
                    converted_price: obj.converted_price

                });



                //  if ($scope.doc_type == 1)

                if (obj.amount)

                    amount += Number(obj.amount);



                //save conversion price in RECEIPt Journal for  Profit & Loss Accounts

                // Foreign Currency Movement Gain & Loss

                //Indiviaual Entry  and Total sum entry on backend



                if ($scope.doc_type_main == 1 && $scope.select_curency_id !== $rootScope.defaultCurrency && (obj.converted_price != 0)) {





                    if (($scope.module_type.value == 2) && ($scope.posting_groupmain == 1))

                        account_id = $scope.postfianancedata.sales_gl_ac_uk_debators;

                    if (($scope.module_type.value == 2) && ($scope.posting_groupmain == 2))

                        account_id = $scope.postfianancedata.sales_gl_ac_eu_debators;

                    if (($scope.module_type.value == 2) && ($scope.posting_groupmain == 3))

                        account_id = $scope.postfianancedata.sales_gl_ac_eu_out_debators;



                    if (($scope.module_type.value == 3) && ($scope.posting_groupmain == 1))

                        account_id = $scope.postfianancedata.Purchase_gl_ac_uk_creditors;

                    if (($scope.module_type.value == 3) && ($scope.posting_groupmain == 2))

                        account_id = $scope.postfianancedata.Purchase_gl_ac_eu_creditors;

                    if (($scope.module_type.value == 3) && ($scope.posting_groupmain == 3))

                        account_id = $scope.postfianancedata.Purchase_gl_ac_eu_out_creditors

                    //console.log($scope.module_type_main.value);return;



                    if (Number(obj.converted_price) > 0) {





                        if ($scope.module_type_main.value == 3) {

                            var inv_trans_type = 1;

                            var inv_trans_type_secnd = 2;

                        } else if ($scope.module_type_main.value == 2) {

                            var inv_trans_type = 2;

                            var inv_trans_type_secnd = 1;

                        }

                        var account_debit = $scope.balance_id_main;

                        var payed_account = $scope.postfianancedata.realised_movement_gl_ac;

                        //unrealised_movement_gl_ac;

                        console.log("Gain s");



                    } else {



                        if ($scope.module_type_main.value == 3) {

                            var inv_trans_type = 2;

                            var inv_trans_type_secnd = 1;

                        } else if ($scope.module_type_main.value == 2) {

                            var inv_trans_type = 1;

                            var inv_trans_type_secnd = 2;

                        }

                        var account_debit = account_id;

                        var payed_account = $scope.postfianancedata.realised_movement_gl_ac;

                        console.log("loss s");



                    }







                    if ((payed_account != undefined) && (account_debit != undefined) && (obj.converted_price != 0)) {

                        // $scope.$root.accountentry(payed_account, inv_trans_type, 5, obj.converted_price, $scope.journal_datemain, $scope.parent_id, 0, 'Gain', 0);



                        // $scope.$root.accountentry(account_debit, inv_trans_type_secnd, 5, obj.converted_price, $scope.journal_datemain, $scope.parent_id, 0, 'loss', $scope.parent_id);

                    } else

                        totalrelizecount++;







                }





            }

        });



        // $timeout(function () {



        if (totalrelizecount) {

            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(365));

            return;

        }



        if (amount > Number($scope.amount_total)) {

            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(366));

            return;

        } else {



            var excUrl = $scope.$root.gl + "chart-accounts/add-invoice-receipt";

            post.type_allocatin = 1;

            post.total_allocatin = $scope.netTotal();



            if ($scope.doc_type == 2) {

                //post.total_allocatin = $scope.netTotalrefund();

                post.type_allocatin = 2;

                var excUrl = $scope.$root.gl + "chart-accounts/add-refund-journal";

            }



            post.id = $scope.curent_cust_index; //id;

            post.type = 1;

            post.doc_type = $scope.doc_type;

            post.cust_id = $scope.cust_id;



            post.parent_id = $scope.parent_id;

            post.selected = temp;

            post.token = $scope.$root.token;



            $http

                .post(excUrl, post)

            .then(function(res) {

                if (res.data.ack == true) {

                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));

                    angular.element('#ReciptInvoiceModal').modal('hide');

                } else

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(105));



            });

        }

        // }, 2000);



    }



    $scope.AddPaymentAllocation = function(module_type, doc_type) {

        $scope.disable_save = true;

        var postData = {};

        postData.token = $scope.$root.token;

        postData.transaction_type = 1;

        postData.payment_id = $scope.payment_id;

        postData.payment_detail_id = $scope.payment_detail_id;



        if (module_type == 2) // customer

        {

            postData.module_type = 1; //customer

            if (doc_type == 2)

                postData.invoice_type = 5; // sales invoice -> payment

            else if (doc_type == 3)

                postData.invoice_type = 6; // credit  invoice -> refund

        } else if (module_type == 3) // supplier

        {

            postData.module_type = 2; // supplier

            if (doc_type == 2)

                postData.invoice_type = 5; // Purchase invoice -> payment

            else if (doc_type == 3)

                postData.invoice_type = 6; // debit  invoice -> refund

        }



        var selected_items = [];

        angular.forEach($scope.ReciptInvoiceModalarr, function(obj) {

            if (obj.amount > 0) {

                var invoice_type = 0;

                if (obj.payment_type == "Sales Invoice")

                    invoice_type = 1;

                else if (obj.payment_type == "Credit Note")

                    invoice_type = 2;

                else if (obj.payment_type == "Purchase Invoice")

                    invoice_type = 3;

                else if (obj.payment_type == "Debit Note")

                    invoice_type = 4;

                else if (obj.payment_type == "Payment")

                    invoice_type = 5;

                else if (obj.payment_type == "Refund")

                    invoice_type = 6;

                else if (obj.payment_type == "Opening Balance Invoice") {

                    if (module_type == 2) // customer

                        invoice_type = 7;

                    else // supplier

                        invoice_type = 9;

                } else if (obj.payment_type == "Opening Balance Credit Note") {

                    if (module_type == 2) // customer

                        invoice_type = 8;

                    else

                        invoice_type = 10;

                } else if (obj.payment_type == "Bank Opening Balance Payment") {

                    if (module_type == 2) // customer

                        invoice_type = 11;

                    else

                        invoice_type = 13;

                } else if (obj.payment_type == "Bank Opening Balance Refund") {

                    if (module_type == 2) // customer

                        invoice_type = 12;

                    else

                        invoice_type = 14;

                }



                selected_items.push({ 'invoice_id': obj.order_id, 'amount_allocated': obj.amount, 'document_type': invoice_type, 'cust_payment_id': obj.cust_payment_id, 'allocation_date': obj.allocation_date });

            }

        });

        postData.items = selected_items;

        var allocation_url = $scope.$root.gl + "chart-accounts/add-payment-allocation";



        $http

            .post(allocation_url, postData)

        .then(function(res) {

            if (res.data.ack == true) {

                toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));

                $scope.receipt_sub_list[$scope.current_index].allocated_amount = Number($scope.receipt_sub_list[$scope.current_index].allocated_amount) + Number(res.data.total_allocated);

                angular.element('#InvoicesForPayments').modal('hide');

            } else {

                $scope.disable_save = false;

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(105));

                angular.element('#InvoicesForPayments').modal('hide');

            }



        });

    }



    $scope.DeleteTemplate = function() {

        $rootScope.template_error_msg = "Are you sure to want to delete the template?";



        ngDialog.openConfirm({

            template: '_confirm_template_change_modal',

            className: 'ngdialog-theme-default-custom'

        }).then(function(value) {

            var templateDelete_url = $scope.$root.gl + "chart-accounts/delete-template-gl";

            var postData = {};

            postData.token = $scope.$root.token;

            postData.id = $scope.array_receipt_gl_form.template_ids.id;

            postData.journal_id = $scope.array_receipt_gl_form.id;



            $scope.showLoader = true;

            $http

                .post(templateDelete_url, postData)

            .then(function(res) {

                if (res.data.ack == true) {



                    var delete_template = $filter("filter")($scope.template_arr, { id: $scope.array_receipt_gl_form.template_ids.id }, true);

                    var idx = $scope.template_arr.indexOf(delete_template[0]);

                    $scope.template_arr.splice(idx, 1);



                    $scope.array_receipt_gl_form.template_ids = {};



                    $scope.showLoader = false;

                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));

                } else {

                    $scope.showLoader = false;

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(108));

                }



            });



        }, function(reason) {

            console.log('Modal promise rejected. Reason: ', reason);

        });

    }

    $scope.SaveAsTemplate = function() {

        if ($scope.array_receipt_gl_form.template_ids != undefined && $scope.array_receipt_gl_form.template_ids.id > 0) {

            $rootScope.template_error_msg = "Are you sure to want to update the template?";



            ngDialog.openConfirm({

                template: '_confirm_template_change_modal',

                className: 'ngdialog-theme-default-custom'

            }).then(function(value) {

                $scope.array_receipt_gl_form.template_name = $scope.array_receipt_gl_form.template_ids.name;



                angular.element('#_template_name').modal({ show: true });



            }, function(reason) {

                console.log('Modal promise rejected. Reason: ', reason);

            });

        } else {

            angular.element('#_template_name').modal({ show: true });

        }

    }



    $scope.SaveAsTemplateToDB = function() {

        if (!$scope.array_receipt_gl_form.template_name) {

            toaster.pop('error', 'Info', "Template Name is required.");

            return false;

        }



        angular.element('#_template_name').modal('hide');



        var convertUrl = $scope.$root.gl + "chart-accounts/add-template-gl";

        var template_id = $scope.array_receipt_gl_form.template_ids !== undefined ? $scope.array_receipt_gl_form.template_ids.id : 0;

        $scope.showLoader = true;

        $http

            .post(convertUrl, {

            'id': template_id,

            'journal_id': $scope.array_receipt_gl_form.id,

            'journal_type': $scope.receipt_type,

            'journal_lines': $scope.receipt_sub_list,

            'name': $scope.array_receipt_gl_form.template_name,

            'token': $scope.$root.token
        })

        .then(function(res) {

            if (res.data.ack == true) {

                if (template_id > 0) {

                    toaster.pop('success', 'Info', 'Template Updated Successfully.');

                    $scope.array_receipt_gl_form.template_ids.name = $scope.array_receipt_gl_form.template_name;

                } else {

                    toaster.pop('success', 'Info', 'Template Added Successfully.');

                    $scope.template_arr.push({ 'id': res.data.template_id, 'name': $scope.array_receipt_gl_form.template_name });

                    $scope.array_receipt_gl_form.template_ids = $scope.template_arr[$scope.template_arr.length - 1];

                }

                $scope.showLoader = false;

            } else {

                if (res.data.error != undefined && res.data.error.length > 0)

                    toaster.pop('error', 'Info', res.data.error);

                else

                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(106));



                $scope.showLoader = false;

            }

        });

    }

    $scope.recptconvertposting = function() {

        $scope.showLoader = true;

        $scope.add_gl_recipt_sublist(1, 1); // flag and is_post

    }



    $scope.post_journal = function() {
        /* if (Number($scope.netBalanceRecipt()) != 0) {
            $scope.showLoader = false;
            toaster.pop('error', 'Error', 'Please specify all the fields in line 1');
            return;
        } */
        var dates_arr = [];
        var unbalanced_dates = '';
        var in_valid_entries = "";
        $scope.postponeVATCHK = 0;

        angular.forEach($scope.receipt_sub_list, function(item, index) {
            var test = Number(item.credit_amount);

            if (item.isGLVat == true)
                $scope.postponeVATCHK = 1;

            if (item.module_type == undefined || item.module_type.value == '' ||
                item.doc_type == undefined || item.doc_type.id == undefined || item.doc_type.id == '' ||
                item.account_no == '' || item.account_name == '' ||
                item.currency_id == '' || item.debit_amount == '' ||
                Number(item.converted_price) == 0 ||
                item.posting_date == '' || item.document_no == '') {
                in_valid_entries += String(Number(index + 1)) + ', ';
            }

            var temp_arr = $filter("filter")($scope.receipt_sub_list, { posting_date: item.posting_date }, true);
            if (temp_arr.length > 0) {
                var date_exist = $filter("filter")(dates_arr, { date: item.posting_date }, true);
                if (date_exist.length == 0) {
                    dates_arr.push({ 'date': item.posting_date, 'items': temp_arr });
                }
            }
        });

        if (in_valid_entries.length > 0) {
            in_valid_entries = in_valid_entries.slice(0, -2);
            $scope.showLoader = false;
            toaster.pop('error', 'Error', 'Please specify all the fields in lines (' + in_valid_entries + ')');
            return;
        }

        angular.forEach(dates_arr, function(dates_obj) {
            var sum_credit = 0;
            var sum_debit = 0;

            angular.forEach(dates_obj.items, function(item) {
                if (item.balancing_account_id == 0 && item.balancing_account_code == '') {
                    if (Number(item.credit_amount) > 0)
                        sum_credit += Number(item.converted_price);

                    if (Number(item.debit_amount) > 0)
                        sum_debit += Number(item.converted_price);
                }
            });

            if (Number(sum_credit).toFixed(2) != Number(sum_debit).toFixed(2)) {
                unbalanced_dates += dates_obj.date + ', ';
            }
        });

        if (unbalanced_dates.length > 0) {
            unbalanced_dates = unbalanced_dates.slice(0, -2);
            $scope.showLoader = false;
            toaster.pop('error', 'Error', 'Credit and Debit are not balanced for dates (' + unbalanced_dates + ')');
            return;
        }

        if ($scope.receipt_type == 1 || $scope.receipt_type == 2) {
            var in_valid_entries = '';
            angular.forEach($scope.receipt_sub_list, function(item, index) {
                if (item.balancing_account_id == 0 && item.balancing_account_code == '')
                    in_valid_entries += String(Number(index + 1)) + ', ';
            });

            if (in_valid_entries.length > 0) {
                $scope.showLoader = false;
                in_valid_entries = in_valid_entries.slice(0, -2);
                toaster.pop('error', 'Error', 'Please specify balaning accounts in lines (' + in_valid_entries + ')');
                return;
            }
        }

        $scope.showLoader = false;

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
                    post.parent = $scope.parent_id;
                    post.items = $scope.receipt_sub_list;
                    post.postponed_vat = $scope.postponed_vat;

                    var editUrl = $scope.$root.gl + "chart-accounts/convert-posting-receipt";
                    $scope.showLoader = true;

                    $http
                        .post(editUrl, post)
                        .then(function(res) {

                            if (res.data.ack == true) {
                                //$scope.get_gl_recipt_;sublist(1);
                                $scope.get_receipt_main_list(1);
                                toaster.pop('success', 'info', 'Record Posted Successfully');
                                $scope.backend_data = 0;
                                $scope.showLoader = false;
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
                post.parent = $scope.parent_id;
                post.items = $scope.receipt_sub_list;

                var editUrl = $scope.$root.gl + "chart-accounts/convert-posting-receipt";
                $scope.showLoader = true;
                $http
                    .post(editUrl, post)
                    .then(function(res) {
                        if (res.data.ack == true) {
                            //$scope.get_gl_recipt_;sublist(1);
                            $scope.get_receipt_main_list(1);
                            toaster.pop('success', 'info', 'Record Posted Successfully');
                            $scope.backend_data = 0;
                            $scope.showLoader = false;
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



    $scope.recptconvertposting_item = function() {

        $scope.add_gl_recipt_sublist_item(1, 1); // flag and is_post

    }

    $scope.post_journal_item = function() {

        var in_valid_posting_date = false;

        var in_valid_transaction_type = false;

        var in_valid_item_no = false;

        var in_valid_item_desc = false;

        var in_valid_warehouse = false;

        var in_valid_location = false;

        var in_valid_qty = false;

        var in_valid_uom = false;

        var in_valid_cost_per_unit = false;

        var in_valid_amount = false;

        var in_valid_gl = false;

        var in_valid_allocation = false;



        angular.forEach($scope.receipt_sub_list, function(item, index) {

            if (item.posting_date == undefined || item.posting_date == 0 || item.posting_date == '') {

                in_valid_posting_date = true;

            }

            if (item.module_type == undefined || item.module_type.value == undefined || item.module_type.value == 0 || item.module_type.value == '') {

                in_valid_transaction_type = true;

            }

            if (item.item_code == undefined || item.item_code == 0 || item.item_code == '') {

                in_valid_item_no = true;

            }

            if (item.item_name == undefined || item.item_name == 0 || item.item_name == '') {

                in_valid_item_desc = true;

            }

            if (item.warehouse == undefined || item.warehouse.id == undefined || item.warehouse.id == 0 || item.warehouse.id == '') {

                in_valid_warehouse = true;

            }

            if (item.stock_check == 1 && (item.location == undefined || item.location.id == undefined || item.location.id == 0 || item.location.id == '')) {

                in_valid_location = true;

            }

            if (item.qty == undefined || item.qty == undefined || item.qty == 0 || item.qty == '') {

                in_valid_qty = true;

            }

            if (item.uom == undefined || item.uom.id == undefined || item.uom.id == 0 || item.uom.id == '') {

                in_valid_uom = true;

            }

            if (item.cost_per_unit == undefined || item.cost_per_unit == 0 || item.cost_per_unit == '') {

                in_valid_cost_per_unit = true;

            }

            if (item.amount == undefined || item.amount == 0 || item.amount == '') {

                in_valid_amount = true;

            }

            if (item.balancing_account_id == undefined || item.balancing_account_id == 0 || item.balancing_account_code == '') {

                in_valid_gl = true;

            }

            if (item.stock_check == 1 && (item.remainig_qty == undefined || item.remainig_qty > 0)) {

                in_valid_allocation = true;

            }



        });



        if (in_valid_posting_date) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Posting Dates for all entries']));

            return false;

        } else if (in_valid_transaction_type) {

            toaster.pop('error', 'Error', $cope.$root.getErrorMessageByCode(230, ['Transaction types for all entries']));

            return false;

        } else if (in_valid_item_no) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Items for all entries']));

            return false;

        } else if (in_valid_item_desc) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Description of items for all entries']));

            return false;

        } else if (in_valid_warehouse) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Warehouse for all entries']));

            return false;

        } else if (in_valid_location) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Locations for all entries']));

            return false;

        } else if (in_valid_qty) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Quantity for all entries']));

            return false;

        } else if (in_valid_uom) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['U.O.M for all entries']));

            return false;

        }

        /* else if (in_valid_cost_per_unit) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Cost per unit for all entries']));

            return false;

        } */

        /* else if (in_valid_amount) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Amount for all entries']));

            return false;

        } */
        else if (in_valid_gl) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['G/L accounts for all entries']));

            return false;

        } else if (in_valid_allocation) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(368));

            return false;

        }







        ngDialog.openConfirm({

            // template: 'app/views/_confirm_modal.html',

            template: 'modalcontinueid',

            className: 'ngdialog-theme-default-custom'

        }).then(function(value) {



            var post = {};



            post.token = $scope.$root.token;

            post.parent = $scope.parent_id;

            // post.items = $scope.receipt_sub_list;

            $scope.showLoader = true;

            var editUrl = $scope.$root.gl + "chart-accounts/convert-posting-receipt-item";

            $http

                .post(editUrl, post)

            .then(function(res) {



                if (res.data.ack == true) {

                    //$scope.get_gl_recipt_;sublist(1);

                    $scope.get_receipt_main_list(1);

                    $scope.showLoader = false;

                    toaster.pop('success', 'info', 'Record Posted Successfully');

                    $scope.backend_data = 0;

                } else {

                    $scope.showLoader = false;

                    toaster.pop('error', 'Error', res.data.error);

                }



            });



        }, function(reason) {

            console.log('Modal promise rejected. Reason: ', reason);

        });

    }



    $scope.gltype = 0;

    $scope.module_name = 0;

    $scope.module_type = {};





    // $scope.$root.load_date_picker('Recipt Journal');



}





/*=============GL Opening Balance old code Start  =============================================*/



myApp.controller('GlControllerOpeningBalance', GlControllerOpeningBalance);

function GlControllerOpeningBalance($scope, $stateParams, $http, $state, $resource, toaster, $window, ngDialog, dataService, $rootScope, $timeout, $filter) {

    $scope.receipt_type = 0;

    $scope.sub_module_type = 0;



    $scope.showPostBtn = false;



    if ($state.current.name == 'app.openingBalances' || $state.current.name == 'app.view-openingBalances') {

        $scope.receipt_type = 4;

        $scope.moduleName = "";



        if ($stateParams.module == 'bank') {

            $scope.sub_module_type = 1;

            $scope.moduleName = 'Bank';

        } else if ($stateParams.module == 'stock') {

            $scope.sub_module_type = 2;

            $scope.moduleName = 'Stock';

        } else if ($stateParams.module == 'customer') {

            $scope.sub_module_type = 3;

            $scope.moduleName = 'Customer';

        } else if ($stateParams.module == 'supplier') {

            $scope.sub_module_type = 4;

            $scope.moduleName = 'Supplier';

        } else if ($stateParams.module == 'general_ledger') {

            $scope.sub_module_type = 5;

            $scope.moduleName = 'General Ledger';

        }



        $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },

            { 'name': 'Finance', 'url': 'app.setup', 'isActive': false, 'tabIndex': '2' },

            { 'name': 'Opening Balances (' + $scope.moduleName + ')', 'url': '#', 'isActive': false }
        ];

    }





    $scope.receipt_gl_list = false;

    $scope.receipt_gl_form = false;



    if ($scope.receipt_type != 4) {

        $scope.receipt_gl_list = true;

        $scope.receipt_gl_form = false;

    } else if ($scope.receipt_type == 4) {



        $scope.array_receipt_gl_form = {};

        $scope.receipt_gl_list = false;

        $scope.receipt_gl_form = false;

    }







    $scope.array_submit_jurnal = {};

    $scope.columns_journal = [];

    $scope.discount_type_array = {};

    $scope.discount_type_array = [{ value: '2', name: 'Debit' }, { value: '1', name: 'Credit' }];

    $scope.sale_type_array = {};

    $scope.sale_type_array = [{ value: '1', name: 'G/L No.' }, { value: '2', name: 'Customer' }, { value: '3', name: 'Supplier' }];



    $scope.sale_type_array_item = [{ value: '1', name: 'Positive Entry' }, { value: '2', name: 'Negative Entry' }];



    $scope.bankRec = [];



    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

    // opening balance stock start



    $scope.items = [];



    $scope.searchKeywordItem = {};

    $scope.selectedRecFromModalsItem = [];



    $scope.moduleType = '';

    $scope.clearAndSearchItems = function() {

        $scope.searchKeywordItem = {};

        // $scope.searchKeywordItem = {};

        $scope.selectedRecFromModalsItem = [];

        $scope.selectItem();

    }



    $scope.selectItem = function(item_paging, sort_column, sortform) {



        $scope.postData = {};

        $scope.postData.token = $scope.$root.token;

        $scope.moduleType = 'ItemDetail';



        $scope.tempProdArr = [];

        $scope.tempProdArr2 = []

        $scope.tempProdArr2.response = [];



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



        $scope.postData.cond = 'setupDetail';

        $scope.postData.srm_id = 1;

        $scope.postData.orderDate = $scope.$root.get_current_date();



        // var itemListingApi = $scope.$root.reports + "module/item-data-for-report";

        // var itemListingApi = $scope.$root.stock + "products-listing/item-popup";    

        var itemListingApi = $scope.$root.stock + "products-listing/item-details-price-qty";



        $scope.showLoader = true;

        $http

            .post(itemListingApi, $scope.postData)

        .then(function(res) {

            $scope.tableData = res;

            $scope.columns = [];

            $scope.record_data = {};

            $scope.recordArray = [];

            $scope.showLoader = false;

            $scope.tempProdArr = [];

            $scope.PendingSelectedItems = [];



            if (res.data.ack == true) {

                //console.log(res.data);

                $scope.total = res.data.total;

                $scope.item_paging.total_pages = res.data.total_pages;

                $scope.item_paging.cpage = res.data.cpage;

                $scope.item_paging.ppage = res.data.ppage;

                $scope.item_paging.npage = res.data.npage;

                $scope.item_paging.pages = res.data.pages;



                $scope.total_paging_record = res.data.total_paging_record;



                // $scope.tempProdArr = res.data.response;

                // $scope.tempProdArr2 = res.data;



                /* angular.copy($rootScope.prooduct_arr, $scope.tempProdArr2.response);
        
        
        
                        $scope.tempProdArr2.ack = 1;
        
        
        
                        $scope.tempProdArr2.response.tbl_meta_data = res.data.response.tbl_meta_data;
        
        
        
                        $scope.tempProdArr = $scope.tempProdArr2.response;
        
        
        
                        $scope.record_data = $scope.tempProdArr; */



                $scope.record_data = res.data.response;

                $scope.tempProdArr = res.data;



                angular.forEach($scope.tempProdArr, function(value, key) {

                    if (key != "tbl_meta_data") {

                        $scope.recordArray.push(value);

                    }

                });



                // if ($scope.tempProdArr[0].id)

                if ($scope.tempProdArr.response)

                    angular.element('#productModal').modal({ show: true });



            } else {

                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));

            }

        });

    }



    $scope.clearPendingPurchaseItems = function() {

        $scope.PendingSelectedPurchaseItems = [];

        $scope.PendingSelectedItems = [];

        // $scope.searchKeywordItem = {};

        // $scope.selectedRecFromModalsItem = [];

        angular.element('#productModal').modal('hide');

    }



    $scope.addProduct = function() {



        $scope.items_array = [];

        $scope.showPostBtn = true;

        $scope.PendingSelectedPurchaseItems = [];

        $scope.PendingSelectedItems = [];



        angular.copy($scope.tempProdArr.response, $scope.items_array);



        var selItemList = [];



        angular.forEach($scope.selectedRecFromModalsItem, function(obj) {

            selItemList.push(obj.record);

        });



        angular.forEach(selItemList, function(prodData) {



            try {

                // var prodData = resRec;



                $scope.PendingSelectedPurchaseItems.push(prodData);

                $scope.PendingSelectedItems.push(prodData);



                prodData.product_name = prodData.description;

                prodData.item_type = 0;

                prodData.qty = 1;

                prodData.standard_price = "";



                if (prodData.price_offer != undefined)

                    prodData.standard_price = parseFloat(prodData.price_offer);

                else {

                    if (prodData.unit_price == null) {

                        if (prodData.standard_purchase_cost != undefined)

                            prodData.standard_price = parseFloat(prodData.standard_purchase_cost);

                    } else

                        prodData.standard_price = parseFloat(prodData.unit_price);

                }



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



                prodData.uom = prodData.arr_units[0].name;

                prodData.uomID = prodData.arr_units[0].id;



                if (prodData.arr_warehouse != undefined) {

                    prodData.arr_prod_warehouse = prodData.arr_warehouse.response;



                    if (prodData.arr_prod_warehouse != undefined) {

                        angular.forEach(prodData.arr_prod_warehouse, function(obj) {

                            if (obj.id == prodData.arr_warehouse.default_wh)

                                prodData.warehouses = obj;

                        });



                        if ((prodData.warehouses == undefined) && (prodData.arr_prod_warehouse[0].id > 0))

                            prodData.warehouses = prodData.arr_prod_warehouse[0];



                        // console.log(prodData.warehouses);

                        $scope.getWarehouseLoc(prodData.warehouses.id, prodData);

                    }

                }



                prodData.vat = '';

                prodData.vat_value = '';

                prodData.vat_id = '';



                angular.forEach($rootScope.arr_vat, function(obj) {

                    if (obj.id == prodData.vat_rate_id) {

                        prodData.vat = obj.name;

                        prodData.vat_value = obj.vat_value;

                        prodData.vat_id = obj.id;

                        prodData.vats = obj;

                    }

                });



                prodData.primary_unit_of_measure_id = prodData.unit_id;

                prodData.primary_unit_of_measure_name = prodData.unit_of_measure_name;



                angular.forEach($scope.arr_discount_type, function(obj) {

                    if (obj.id == prodData.discount_type)

                        prodData.discount_type_id = obj;

                });



                prodData.sale_unit_id = prodData.unit_id;

                prodData.purchase_unit_id = prodData.purchase_measure;

                prodData.currentStock = prodData.current_stock;

                prodData.purchase_unit = prodData.uom_id;

                prodData.total_landing_cost = 0;



                $scope.items.push(prodData);

            } catch (error) {

            }

        });



        /* angular.forEach($scope.selectedRecFromModalsItem, function (chk_item,key) {

            var resRec = $filter("filter")($scope.items_array, { id: key });

            if (resRec) {

                try {

                    var prodData = resRec[0];



                    $scope.PendingSelectedPurchaseItems.push(prodData);

                    $scope.PendingSelectedItems.push(prodData);



                    prodData.product_name = prodData.description;

                    prodData.item_type = 0;

                    prodData.qty = 1;

                    prodData.standard_price = "";



                    if (prodData.price_offer != undefined)

                        prodData.standard_price = parseFloat(prodData.price_offer);

                    else {

                        if (prodData.unit_price == null) {

                            if (prodData.standard_purchase_cost != undefined)

                                prodData.standard_price = parseFloat(prodData.standard_purchase_cost);

                        }

                        else

                            prodData.standard_price = parseFloat(prodData.unit_price);

                    }



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

                    }

                    else {

                        prodData.arr_units = '';

                        prodData.units = '';

                    }



                    prodData.uom = prodData.arr_units[0].name;

                    prodData.uomID = prodData.arr_units[0].id;



                    if (prodData.arr_warehouse != undefined) {

                        prodData.arr_prod_warehouse = prodData.arr_warehouse.response;



                        if (prodData.arr_prod_warehouse != undefined) {

                            angular.forEach(prodData.arr_prod_warehouse, function (obj) {

                                if (obj.id == prodData.arr_warehouse.default_wh)

                                    prodData.warehouses = obj;

                            });



                            if ((prodData.warehouses == undefined) && (prodData.arr_prod_warehouse[0].id > 0))

                                prodData.warehouses = prodData.arr_prod_warehouse[0];



                            // console.log(prodData.warehouses);

                            $scope.getWarehouseLoc(prodData.warehouses.id, prodData);

                        }

                    }



                    prodData.vat = '';

                    prodData.vat_value = '';

                    prodData.vat_id = '';



                    angular.forEach($rootScope.arr_vat, function (obj) {

                        if (obj.id == prodData.vat_rate_id) {

                            prodData.vat = obj.name;

                            prodData.vat_value = obj.vat_value;

                            prodData.vat_id = obj.id;

                            prodData.vats = obj;

                        }

                    });



                    prodData.primary_unit_of_measure_id = prodData.unit_id;

                    prodData.primary_unit_of_measure_name = prodData.unit_of_measure_name;



                    angular.forEach($scope.arr_discount_type, function (obj) {

                        if (obj.id == prodData.discount_type)

                            prodData.discount_type_id = obj;

                    });



                    prodData.sale_unit_id = prodData.unit_id;

                    prodData.purchase_unit_id = prodData.purchase_measure;

                    prodData.currentStock = prodData.current_stock;

                    prodData.purchase_unit = prodData.uom_id;

                    prodData.total_landing_cost = 0;



                    $scope.items.push(prodData);

                } catch (error) {

                }

                

            }

        }); */





        angular.element('#productModal').modal('hide');

    }



    $scope.addOpeningBalanceStock = function() {



        var postUrl = $scope.$root.gl + "chart-accounts/add-opening-balance-stock";

        var post = {};

        post.token = $scope.$root.token;

        post.items = $scope.items;

        post.module_type = $scope.receipt_type;

        post.sub_module_type = $scope.sub_module_type;

        post.parent_id = $scope.parent_id;



        $scope.showLoader = true;



        $http

            .post(postUrl, post)

        .then(function(res) {

            $scope.showLoader = false;



            if (res.data.ack == true) {

                toaster.pop('success', 'Add', res.data.error);

                $scope.getOpeningBalanceStock();

                // $scope.get_gl_recipt_sublist_item($scope.parent_id);

            } else {

                toaster.pop('error', 'Error', res.data.error);

                return false;

            }

        });

    }



    $scope.gotoEditopBalnc = function() {

        $scope.check_opbalnc_readonly = false;

    }



    $scope.netTotalStock = function() {

        var netTotal = 0;



        angular.forEach($scope.items, function(item) {

            if (item.qty != undefined && item.standard_price != undefined) {

                var total = parseFloat(item.qty) * parseFloat(item.standard_price);

                netTotal += +(Number(total).toFixed(2)); //parseFloat(total);

            }

        });



        return Number(netTotal).toFixed(2);

        // return netTotal;

    }



    $scope.getOpeningBalanceStock = function() {

        var postUrl = $scope.$root.gl + "chart-accounts/get-opening-balance-stock";

        var post = {};

        post.token = $scope.$root.token;

        post.module_type = $scope.receipt_type;

        post.sub_module_type = $scope.sub_module_type;

        post.parent_id = $scope.parent_id;

        $scope.items = [];



        $scope.showLoader = true;



        $http

            .post(postUrl, post)

        .then(function(res) {



            $scope.receipt_gl_list = false;

            $scope.receipt_gl_form = true;

            $scope.showLoader = false;



            $scope.array_receipt_gl_form = {};

            $scope.array_receipt_gl_form.module_type = 4;

            $scope.array_receipt_gl_form.sub_module_type = 2;

            $scope.check_opbalnc_readonly = true;



            if (res.data.ack == true) {

                $scope.postStatus = 1;

                // $rootScope.updateSelectedGlobalData("item");



                angular.forEach(res.data.response, function(prodData) {



                    // console.log(prodData);

                    prodData.product_code = prodData.ItemNo;

                    prodData.product_name = prodData.description;

                    prodData.id = prodData.productID;

                    // prodData.updateID = prodData.updateID;



                    if (prodData.postStatus == 0)

                        $scope.postStatus = 0;



                    prodData.qty = parseFloat(prodData.qty);

                    prodData.standard_price = parseFloat(prodData.price);

                    prodData.calcAmount = parseFloat(prodData.debit_amount);



                    if (prodData.warehouseID > 0) {

                        angular.forEach(prodData.arr_warehouse, function(obj) {

                            if (obj.id == prodData.warehouseID)

                                prodData.warehouses = obj;

                        });

                    }





                    if (prodData.storageLocID > 0) {

                        angular.forEach(prodData.arrStorageLoc, function(obj) {

                            if (obj.id == prodData.storageLocID)

                                prodData.storageLoc = obj;

                        });

                    }



                    prodData.arr_prod_warehouse = prodData.arr_warehouse;



                    if (prodData.prodStorageLocID == 0) {

                        prodData.prodStorageLocID = prodData.wh_id;

                    }



                    /* angular.forEach($rootScope.prooduct_arr, function (obj) {
        
        
        
                                if (obj.id == prodData.id && obj.arr_warehouse != undefined) {
        
                                    prodData.arr_prod_warehouse = obj.arr_warehouse.response;
        
        
        
                                    if (prodData.prodStorageLocID == 0) {
        
                                        prodData.prodStorageLocID = prodData.wh_id;
        
                                    }
        
        
        
                                    if (prodData.arr_prod_warehouse != undefined) {
        
                                        angular.forEach(prodData.arr_prod_warehouse, function (obj2) {
        
                                            if (obj2.id == prodData.warehouseID)
        
                                                prodData.warehouses = obj2;
        
                                        });
        
        
        
                                        // if (prodData.warehouses != undefined)
        
                                        //     $scope.getWarehouseLoc(prodData.warehouses.id, prodData, prodData.storageLocID);
        
        
        
                                        if (prodData.storageLocID > 0) {
        
                                            angular.forEach(prodData.arrStorageLoc, function (obj) {
        
                                                if (obj.id == prodData.storageLocID)
        
                                                    prodData.storageLoc = obj;
        
                                            });
        
                                        }
        
                                    }
        
                                }
        
                            }); */



                    if (prodData.postStatus != 1)

                        $scope.showPostBtn = true;



                    $scope.items.push(prodData);

                });

            } else {

                //toaster.pop('error', 'Error', res.data.error);

                $scope.check_opbalnc_readonly = false;

                return false;

            }

        });

    }



    $scope.changePostingDateStock = function(item) {

        // console.log(item);



        if (item.posting_date && item.prod_date) {

            var dateValidationRes = $rootScope.dateValidation(item.prod_date, item.posting_date);



            if (dateValidationRes > 0) {

                toaster.pop('warning', 'Info', $scope.$root.getErrorMessageByCode(333, ['Posting Date', 'Production Date']));

                item.prod_date = ''; //item.posting_date

                return;

            }

        }



        if (item.prod_date && item.date_received) {

            var dateValidationRes = $rootScope.dateValidation(item.prod_date, item.date_received);



            if (dateValidationRes > 0) {

                toaster.pop('warning', 'Info', $scope.$root.getErrorMessageByCode(333, ['Received Date', 'Production Date', ]));

                item.date_received = ''; //item.date_received

                return;

            }

        }



        if (item.use_by_date && item.date_received) {

            var dateValidationRes = $rootScope.dateValidation(item.date_received, item.use_by_date);



            if (dateValidationRes > 0) {

                toaster.pop('warning', 'Info', $scope.$root.getErrorMessageByCode(333, ['Use by Date', 'Received Date', ]));

                item.use_by_date = ''; //item.date_received

                return;

            }

        }



        if (item.prod_date && item.use_by_date) {

            var dateValidationRes = $rootScope.dateValidation(item.prod_date, item.use_by_date);



            if (dateValidationRes > 0) {

                toaster.pop('warning', 'Info', $scope.$root.getErrorMessageByCode(333, ['Use by Date', 'Production Date']));

                item.prod_date = ''; //item.use_by_date

                return;

            }

        }

    }



    // opening balance stock end

    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&



    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

    // opening balance customer start



    $scope.getOpeningBalanceCustomers = function() {

        var postUrl = $scope.$root.gl + "chart-accounts/get-opening-balance-customer";

        var post = {};

        post.token = $scope.$root.token;

        post.module_type = $scope.receipt_type;

        post.sub_module_type = $scope.sub_module_type;

        $scope.customers = [];



        $scope.showLoader = true;



        $http

            .post(postUrl, post)

        .then(function(res) {



            $scope.receipt_gl_list = false;

            $scope.receipt_gl_form = true;



            $scope.showLoader = false;



            $scope.array_receipt_gl_form = {};

            $scope.array_receipt_gl_form.module_type = 4;

            $scope.array_receipt_gl_form.sub_module_type = 3;

            $scope.check_opbalnc_readonly = true;



            if (res.data.ack == true) {

                $scope.postStatus = 1;



                angular.forEach(res.data.response, function(recData) {



                    recData.docType = [{ id: 1, name: 'Invoice' }, { id: 2, name: 'Credit Note' }];



                    angular.forEach(recData.docType, function(obj) {

                        if (obj.id == recData.docTypesel)

                            recData.docTypes = obj;

                    });



                    /* angular.forEach($rootScope.arr_currency, function (obj) {
        
                                if (obj.id == recData.currency_id)
        
                                    recData.currency_id = obj;
        
                            }); */



                    // var currencyID = recData.currency_id;



                    angular.forEach($scope.newCurrencyList, function(obj) {

                        if (obj.id == recData.currency_id)

                            recData.currencyID = obj;

                    });



                    if (recData.postStatus == 0)

                        $scope.postStatus = 0;



                    // recData.debitAmount = parseFloat(recData.debitAmount);

                    // recData.creditAmount = parseFloat(recData.creditAmount);



                    var debitAmount = parseFloat(recData.debitAmount);

                    var creditAmount = parseFloat(recData.creditAmount);



                    if (debitAmount == 0 && creditAmount == 0) {

                        recData.debitAmount = debitAmount;

                        recData.creditAmount = creditAmount;

                    } else if (debitAmount == 0) {

                        recData.debitAmount = '';

                        recData.creditAmount = creditAmount;

                    } else if (creditAmount == 0) {

                        recData.debitAmount = debitAmount;

                        recData.creditAmount = '';

                    }



                    recData.calcAmount = parseFloat(recData.converted_price);

                    recData.convRate = parseFloat(recData.convRate);



                    if (recData.postStatus != 1)

                        $scope.showPostBtn = true;

                    // console.log(recData);

                    $scope.customers.push(recData);

                });

            } else

                $scope.check_opbalnc_readonly = false;

        });

    }



    $scope.deleteOpeningBalncCustomerRec = function(updateID, index, customers) {



        // console.log(updateID);return false;

        var deletOpeningBalncCustomer = $scope.$root.gl + "chart-accounts/delete-opening-balnc-customer-item";



        ngDialog.openConfirm({

            template: 'modalDeleteDialogId',

            className: 'ngdialog-theme-default-custom'

        }).then(function(value) {



            if (updateID > 0) {

                $http

                    .post(deletOpeningBalncCustomer, { 'id': updateID, 'token': $scope.$root.token })

                .then(function(res) {

                    if (res.data.ack == true) {

                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));

                        customers.splice(index, 1);

                    } else

                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));

                });

            } else {

                toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));

                customers.splice(index, 1);

            }



        }, function(reason) {

            console.log('Modal promise rejected. Reason: ', reason);

        });

    }





    $scope.moduleType = '';

    $scope.customers = [];

    $scope.searchKeywordCUST = {};

    $scope.selectedRecFromModalsCUST = [];



    $scope.clearFilterAndSelectCustomers = function() {

        $scope.searchKeywordCUST = {};

        $scope.selectedRecFromModalsCUST = [];

        $scope.selectCustomers();

    }



    $scope.selectCustomers = function(item_paging, sort_column, sortform) {



        $scope.postData = {};

        $scope.postData.token = $scope.$root.token;

        $scope.moduleType = 'CUSTDetail';



        if (item_paging == 1)

            $scope.item_paging.spage = 1



        $scope.postData.page = $scope.item_paging.spage;



        $scope.postData.searchKeyword = $scope.searchKeywordCUST;



        if ($scope.postData.pagination_limits == -1) {

            $scope.postData.page = -1;

            $scope.searchKeywordCUST = {};

            $scope.record_data = {};

        }



        if ((sort_column != undefined) && (sort_column != null)) {

            //sort by column

            $scope.postData.sort_column = sort_column;

            $scope.postData.sortform = sortform;



            $rootScope.sortform = sortform;

            $rootScope.reversee = ('desc' === $scope.sortform) ? !$scope.reversee : false;

            $rootScope.sort_column = sort_column;



            $rootScope.save_single_value($rootScope.sort_column, 'crmsort_name');

        }

        $scope.postData.cond = 'Detail';



        var customerListingApi = $scope.$root.gl + "chart-accounts/customer-data-for-flexi-modal";



        $scope.showLoader = true;

        $http

            .post(customerListingApi, $scope.postData)

        .then(function(res) {

            $scope.tableData = res;

            $scope.columns = [];

            $scope.record_data = {};

            $scope.recordArray = [];

            $scope.tempCustomerArr2 = [];



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

                $scope.tempCustomerArr2 = res.data;



                angular.forEach(res.data.response, function(value, key) {

                    if (key != "tbl_meta_data") {

                        $scope.recordArray.push(value);

                    }

                });



                angular.element('#_customerModal').modal({ show: true });



            } else {

                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));

            }

            $scope.showLoader = false;

        });

    }





    $scope.netTotalCustomers = function() {

        var netTotal = 0;

        var debitTotal = 0;

        var creditTotal = 0;



        angular.forEach($scope.customers, function(obj) {

            if (parseFloat(obj.debitAmount) > 0) {

                if (obj.calcAmount != undefined && parseFloat(obj.calcAmount) > 0)

                    debitTotal += +(Number(obj.calcAmount).toFixed(2)); //parseFloat(obj.calcAmount);

            }

        });



        angular.forEach($scope.customers, function(obj) {

            if (parseFloat(obj.creditAmount) > 0) {

                if (obj.calcAmount != undefined && parseFloat(obj.calcAmount) > 0)

                    creditTotal += +(Number(obj.calcAmount).toFixed(2)); //parseFloat(obj.calcAmount);

            }

        });



        // netTotal = parseFloat(debitTotal) - parseFloat(creditTotal);

        netTotal = Number(debitTotal - creditTotal).toFixed(2);

        return netTotal;

    }



    $scope.clearCustomers = function() {

        angular.element('#_customerModal').modal('hide');

    }



    $scope.addCustomers = function() {



        // var selCUSTList = $scope.recordArray.filter(function (o, i) {

        //     // return $scope.selectedRecFromModalsCUST[o.id];

        //     return ($scope.selectedRecFromModalsCUST.findIndex( s => s.key == o.id ) > -1);

        // });



        // $scope.selectedRecFromModalsCUST.forEach(function(o,i){

        //     selCUSTList.push(o.record);

        // });



        var selCUSTList = [];



        angular.forEach($scope.selectedRecFromModalsCUST, function(obj) {

            selCUSTList.push(obj.record);

        });



        $scope.CustomerArr = [];



        angular.forEach(selCUSTList, function(recData) {



            var singlRec = {};



            recData.moduleID = recData.id;

            recData.moduleNo = recData.customer_code;

            recData.description = recData.name;

            // console.log(recData);



            if ($scope.sub_module_type == 1) {

                recData.moduleType = 1;

                // recData.docType = [{ id: 1, name: 'Sale Invoice' }, { id: 2, name: 'Credit Note' }];

                recData.docType = [{ id: 1, name: 'Payment' }, { id: 2, name: 'Refund' }];

                angular.copy(recData, singlRec);



                angular.forEach($scope.newCurrencyList, function(obj) {

                    if (obj.id == singlRec.currency_id)

                        singlRec.currencyID = obj;

                });



                $scope.showPostBtn = true;

                $scope.bankRec.push(singlRec);

            } else {

                recData.docType = [{ id: 1, name: 'Invoice' }, { id: 2, name: 'Credit Note' }];



                angular.copy(recData, singlRec);



                angular.forEach($scope.newCurrencyList, function(obj) {

                    if (obj.id == singlRec.currency_id)

                        singlRec.currencyID = obj;

                });



                $scope.showPostBtn = true;

                $scope.customers.push(singlRec);

            }

        });



        angular.element('#_customerModal').modal('hide');

    }



    $scope.addOpeningBalanceCustomers = function() {



        var postUrl = $scope.$root.gl + "chart-accounts/add-opening-balance-customer";

        var post = {};

        post.token = $scope.$root.token;

        post.customers = $scope.customers;

        post.module_type = $scope.receipt_type;

        post.sub_module_type = $scope.sub_module_type;

        post.defaultCurrency = $scope.$root.defaultCurrency;



        $scope.showLoader = true;



        $http

            .post(postUrl, post)

        .then(function(res) {

            $scope.showLoader = false;

            if (res.data.ack == true) {

                toaster.pop('success', 'Add', res.data.error);

                $scope.getOpeningBalanceCustomers();

            } else {

                toaster.pop('error', 'Error', res.data.error);

                return false;

            }

        });

    }



    $scope.changeDocType = function(docType, rec, moduleType) {

        rec.debitAmount = '';

        rec.creditAmount = '';

        rec.calcAmount = 0;



        if (moduleType == 2) {

            if (docType == 1)

                docType = 2;

            else if (docType == 2)

                docType = 1;

        }



        // if (rec.currencyID.id != undefined && rec.posting_date != undefined && ((docType == 1 && parseFloat(rec.debitAmount) > 0) || (docType == 2 && parseFloat(rec.creditAmount) > 0)))

        if (rec.currencyID.id != undefined && rec.posting_date != undefined && ((docType == 2 && parseFloat(rec.debitAmount) > 0) || (docType == 1 && parseFloat(rec.creditAmount) > 0)))

            $scope.convertAmountinLCY(rec, moduleType);

    }



    $scope.changePostingDate = function(rec, moduleType) {

        // if (rec.currencyID.id != undefined && rec.docTypes != undefined && ((rec.docTypes.id == 1 && parseFloat(rec.debitAmount) > 0) || (rec.docTypes.id == 2 && parseFloat(rec.creditAmount) > 0)))



        if (moduleType != undefined) {

            if (rec.currencyID.id != undefined && rec.docTypes != undefined && ((rec.docTypes.id == 2 && parseFloat(rec.debitAmount) > 0) || (rec.docTypes.id == 1 && parseFloat(rec.creditAmount) > 0)))

                $scope.convertAmountinLCY(rec, moduleType);

        } else {

            if (rec.currencyID.id != undefined && rec.docTypes != undefined && ((rec.docTypes.id == 1 && parseFloat(rec.debitAmount) > 0) || (rec.docTypes.id == 2 && parseFloat(rec.creditAmount) > 0)))

                $scope.convertAmountinLCY(rec, moduleType);

        }

    }



    $scope.changeDebitCreditAmount = function(rec, moduleType) {

        if (rec.currencyID.id != undefined && rec.posting_date != undefined && rec.docTypes != undefined)

            $scope.convertAmountinLCY(rec, moduleType);

    }



    $scope.changeConvRate = function(rec, moduleType) {

        if (rec.currencyID.id != undefined && rec.posting_date != undefined && rec.docTypes != undefined) {

            var docType = rec.docTypes.id;



            if (moduleType == 2) {

                if (docType == 1)

                    docType = 2;

                else if (docType == 2)

                    docType = 1;

            }



            if (parseFloat(rec.convRate) > 0) {



                if (docType == 1 && !(parseFloat(rec.debitAmount) > 0)) {

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Debit Amount']));

                    return false;

                } else if (docType == 2 && !(parseFloat(rec.creditAmount) > 0)) {

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Credit Amount']));

                    return false;

                }



                if (docType == 1)

                    rec.calcAmount = parseFloat(rec.debitAmount) / parseFloat(rec.convRate);

                else if (docType == 2)

                    rec.calcAmount = parseFloat(rec.creditAmount) / parseFloat(rec.convRate);

                return;

            }

        }

    }



    $scope.convertAmountinLCY = function(rec, moduleType) {



        // console.log(rec.currencyID.id);



        rec.converted_currency_id = $scope.$root.defaultCurrency;



        if (rec.docTypes == undefined) {

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Document Type']));

            return false;

        }



        if (rec.posting_date == undefined) {

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Posting Date']));

            return false;

        }



        rec.calcAmount = 0;

        //rec.convRate = 0;



        var docType = rec.docTypes.id;



        if (moduleType == 2) {

            if (docType == 1)

                docType = 2;

            else if (docType == 2)

                docType = 1;

        }





        if (rec.currencyID.id == $scope.$root.defaultCurrency) {



            rec.convRate = 1;



            if (docType == 1) {



                if (!(parseFloat(rec.debitAmount) > 0)) {

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Debit Amount']));

                    return false;

                }



                rec.calcAmount = parseFloat(rec.debitAmount);

                return;

            } else if (docType == 2) {



                if (!(parseFloat(rec.creditAmount) > 0)) {

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Credit Amount']));

                    return false;

                }

                rec.calcAmount = parseFloat(rec.creditAmount);

                return;

            }

        } else {



            if (docType == 1 && !(parseFloat(rec.debitAmount) > 0)) {

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Debit Amount']));

                return false;

            } else if (docType == 2 && !(parseFloat(rec.creditAmount) > 0)) {

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Credit Amount']));

                return false;

            }



            rec.convRate = '';

            return;

        }

        return false;

    }



    // opening balance customer end

    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&



    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

    // opening balance Supplier start



    $scope.getOpeningBalanceSuppliers = function() {

        var postUrl = $scope.$root.gl + "chart-accounts/get-opening-balance-supplier";

        var post = {};

        post.token = $scope.$root.token;

        post.module_type = $scope.receipt_type;

        post.sub_module_type = $scope.sub_module_type;

        $scope.suppliers = [];



        $scope.showLoader = true;



        $http

            .post(postUrl, post)

        .then(function(res) {



            $scope.receipt_gl_list = false;

            $scope.receipt_gl_form = true;



            $scope.showLoader = false;



            $scope.array_receipt_gl_form = {};

            $scope.array_receipt_gl_form.module_type = 4;

            $scope.array_receipt_gl_form.sub_module_type = 4;

            $scope.check_opbalnc_readonly = true;



            if (res.data.ack == true) {

                $scope.postStatus = 1;



                angular.forEach(res.data.response, function(recData) {



                    // console.log(recData);

                    recData.docType = [{ id: 1, name: 'Invoice' }, { id: 2, name: 'Debit Note' }];



                    angular.forEach(recData.docType, function(obj) {

                        if (obj.id == recData.docTypesel)

                            recData.docTypes = obj;

                    });



                    /* angular.forEach($rootScope.arr_currency, function (obj) {
        
                                if (obj.id == recData.currency_id)
        
                                    recData.currency_id = obj;
        
                            }); */



                    // var currencyID = recData.currency_id;



                    angular.forEach($scope.newCurrencyList, function(obj) {

                        if (obj.id == recData.currency_id)

                            recData.currencyID = obj;

                    });



                    if (Number(recData.postStatus) == 0)

                        $scope.postStatus = 0;



                    var debitAmount = parseFloat(recData.debitAmount);

                    var creditAmount = parseFloat(recData.creditAmount);



                    if (debitAmount == 0 && creditAmount == 0) {

                        recData.debitAmount = debitAmount;

                        recData.creditAmount = creditAmount;

                    } else if (debitAmount == 0) {

                        recData.debitAmount = '';

                        recData.creditAmount = creditAmount;

                    } else if (creditAmount == 0) {

                        recData.debitAmount = debitAmount;

                        recData.creditAmount = '';

                    }



                    recData.calcAmount = parseFloat(recData.converted_price);

                    recData.convRate = parseFloat(recData.convRate);



                    if (recData.postStatus != 1)

                        $scope.showPostBtn = true;



                    $scope.suppliers.push(recData);

                });

            } else

                $scope.check_opbalnc_readonly = false;

        });

    }



    $scope.deleteOpeningBalncSupplierRec = function(updateID, index, suppliers) {



        // console.log(updateID);return false;

        var deletOpeningBalncSupplier = $scope.$root.gl + "chart-accounts/delete-opening-balnc-supplier-item";



        ngDialog.openConfirm({

            template: 'modalDeleteDialogId',

            className: 'ngdialog-theme-default-custom'

        }).then(function(value) {



            if (updateID > 0) {

                $http

                    .post(deletOpeningBalncSupplier, { 'id': updateID, 'token': $scope.$root.token })

                .then(function(res) {

                    if (res.data.ack == true) {

                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));

                        suppliers.splice(index, 1);

                    } else

                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));

                });

            } else {

                toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));

                suppliers.splice(index, 1);

            }



        }, function(reason) {

            console.log('Modal promise rejected. Reason: ', reason);

        });

    }



    $scope.suppliers = [];

    $scope.tempSupplierArr = [];



    $scope.searchKeywordSupp = {};

    $scope.selectedRecFromModalsSupp = [];





    $scope.clearFilterAndSelectSupplier = function() {

        $scope.searchKeywordSupp = {};

        $scope.selectedRecFromModalsSupp = [];

        $scope.selectSuppliers();



    }

    $scope.selectSuppliers = function(item_paging, sort_column, sortform) {



        $scope.postData = {};

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



        // var supplierListingApi = $scope.$root.reports + "module/supplier-data-for-report";

        var supplierListingApi = $scope.$root.gl + "chart-accounts/supplier-data-for-flexi-modal";



        $scope.showLoader = true;

        $http

            .post(supplierListingApi, $scope.postData)

        .then(function(res) {

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



                angular.forEach(res.data.response, function(value, key) {

                    if (key != "tbl_meta_data") {

                        $scope.recordArray.push(value);

                    }

                });



                angular.element('#_supplierModal').modal({ show: true });



            } else {

                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));

            }

            $scope.showLoader = false;

        });

    }



    $scope.clearSuppliers = function() {

        // $scope.searchKeywordSupp = {};

        // $scope.selectedRecFromModalsSupp = [];

        angular.element('#_supplierModal').modal('hide');

    }



    $scope.netTotalSupplierDebit = function() {

        var netTotal = 0;



        angular.forEach($scope.suppliers, function(obj) {

            if (obj.debitAmount != undefined && parseFloat(obj.debitAmount) > 0)

                netTotal += parseFloat(obj.debitAmount);

        });



        return netTotal;

    }



    $scope.netTotalSupplierCredit = function() {

        var netTotal = 0;



        angular.forEach($scope.suppliers, function(obj) {

            if (obj.creditAmount != undefined && parseFloat(obj.creditAmount) > 0)

                netTotal += parseFloat(obj.creditAmount);

        });



        return netTotal;

    }



    $scope.netTotalSupplier = function() {

        var netTotal = 0;

        var debitTotal = 0;

        var creditTotal = 0;



        angular.forEach($scope.suppliers, function(obj) {

            if (parseFloat(obj.debitAmount) > 0) {

                if (obj.calcAmount != undefined && parseFloat(obj.calcAmount) > 0)

                    debitTotal += +(Number(obj.calcAmount).toFixed(2)); //parseFloat(obj.calcAmount);

            }

        });



        angular.forEach($scope.suppliers, function(obj) {

            if (parseFloat(obj.creditAmount) > 0) {

                if (obj.calcAmount != undefined && parseFloat(obj.calcAmount) > 0)

                    creditTotal += +(Number(obj.calcAmount).toFixed(2)); //parseFloat(obj.calcAmount);

            }

        });



        // netTotal = parseFloat(debitTotal) - parseFloat(creditTotal);

        netTotal = Number(debitTotal - creditTotal).toFixed(2);

        return netTotal;

    }



    $scope.addSuppliers = function() {



        /* var selSupplList = $scope.recordArray.filter(function (o, i) {

            return $scope.selectedRecFromModalsSupp[o.id];

        }); */



        var selSupplList = [];



        angular.forEach($scope.selectedRecFromModalsSupp, function(obj) {

            selSupplList.push(obj.record);

        });



        $scope.SuppliersArr = [];



        angular.forEach(selSupplList, function(recData) {



            var singlRec = {};



            recData.moduleID = recData.id;

            recData.moduleNo = recData.supplier_code;

            recData.description = recData.name;



            if ($scope.sub_module_type == 1) {

                recData.moduleType = 2;

                recData.docType = [{ id: 1, name: 'Payment' }, { id: 2, name: 'Refund' }];

                // recData.docType = [{ id: 1, name: 'Purchase Invoice' }, { id: 2, name: 'Debit Note' }];

                angular.copy(recData, singlRec);



                angular.forEach($scope.newCurrencyList, function(obj) {

                    if (obj.id == singlRec.currency_id)

                        singlRec.currencyID = obj;

                });



                $scope.showPostBtn = true;

                $scope.bankRec.push(singlRec);

            } else {

                recData.docType = [{ id: 1, name: 'Invoice' }, { id: 2, name: 'Debit Note' }];

                angular.copy(recData, singlRec);



                angular.forEach($scope.newCurrencyList, function(obj) {

                    if (obj.id == singlRec.currency_id)

                        singlRec.currencyID = obj;

                });



                $scope.showPostBtn = true;

                $scope.suppliers.push(singlRec);

            }

        });

        // $scope.searchKeywordSupp = {};

        // $scope.selectedRecFromModalsSupp = [];

        angular.element('#_supplierModal').modal('hide');

    }



    $scope.addOpeningBalanceSuppliers = function() {



        var postUrl = $scope.$root.gl + "chart-accounts/add-opening-balance-supplier";

        var post = {};

        post.token = $scope.$root.token;

        post.suppliers = $scope.suppliers;

        post.module_type = $scope.receipt_type;

        post.sub_module_type = $scope.sub_module_type;

        post.defaultCurrency = $scope.$root.defaultCurrency;



        $scope.showLoader = true;



        $http

            .post(postUrl, post)

        .then(function(res) {



            $scope.showLoader = false;



            if (res.data.ack == true) {

                toaster.pop('success', 'Add', res.data.error);

                $scope.getOpeningBalanceSuppliers();

            } else {

                toaster.pop('error', 'Error', res.data.error);

                return false;

            }

        });

    }



    // opening balance Supplier end

    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&



    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

    // opening balance Bank start





    $scope.getOpeningBalanceBank = function() {

        var postUrl = $scope.$root.gl + "chart-accounts/get-opening-balance-bank";

        var post = {};

        post.token = $scope.$root.token;

        post.module_type = $scope.receipt_type;

        post.sub_module_type = $scope.sub_module_type;

        $scope.bankRec = [];



        $scope.showLoader = true;



        $http

            .post(postUrl, post)

        .then(function(res) {



            $scope.receipt_gl_list = false;

            $scope.receipt_gl_form = true;



            $scope.showLoader = false;



            $scope.array_receipt_gl_form = {};

            $scope.array_receipt_gl_form.module_type = 4;

            $scope.array_receipt_gl_form.sub_module_type = 1;

            $scope.check_opbalnc_readonly = true;



            if (res.data.ack == true) {

                $scope.postStatus = 1;



                angular.forEach(res.data.response, function(recData) {



                    // console.log(recData);

                    recData.docType = [{ id: 1, name: 'Payment' }, { id: 2, name: 'Refund' }];



                    console.log($scope.newCurrencyList);

                    // console.log(recData.currency_id);



                    // var currencyID = recData.currency_id;



                    // angular.forEach($rootScope.arr_currency, function (obj) {

                    angular.forEach($scope.newCurrencyList, function(obj) {

                        if (obj.id == recData.currency_id)

                            recData.currencyID = obj;

                        // recData.currencyID = obj.id;

                    });



                    console.log(recData.currencyID);



                    if (recData.type == 1) {



                        if (recData.docTypesel == 1) {

                            recData.debitAmountchk = 1;

                            recData.creditAmountchk = 0;

                        } else if (recData.docTypesel == 2) {

                            recData.debitAmountchk = 0;

                            recData.creditAmountchk = 1;

                        }

                        recData.moduleType = 1;



                    } else if (recData.type == 2) {



                        if (recData.docTypesel == 2) {

                            recData.debitAmountchk = 1;

                            recData.creditAmountchk = 0;

                        } else if (recData.docTypesel == 1) {

                            recData.debitAmountchk = 0;

                            recData.creditAmountchk = 1;

                        }



                        recData.moduleType = 2;

                    }



                    angular.forEach(recData.docType, function(obj) {

                        if (obj.id == recData.docTypesel)

                            recData.docTypes = obj;

                    });



                    if (recData.postStatus == 0)

                        $scope.postStatus = 0;



                    if (recData.postStatus != 1)

                        $scope.showPostBtn = true;



                    // recData.debitAmount = parseFloat(recData.debitAmount);

                    // recData.creditAmount = parseFloat(recData.creditAmount);



                    var debitAmount = parseFloat(recData.debitAmount);

                    var creditAmount = parseFloat(recData.creditAmount);



                    if (debitAmount == 0 && creditAmount == 0) {

                        recData.debitAmount = debitAmount;

                        recData.creditAmount = creditAmount;

                    } else if (debitAmount == 0) {

                        recData.debitAmount = '';

                        recData.creditAmount = creditAmount;

                    } else if (creditAmount == 0) {

                        recData.debitAmount = debitAmount;

                        recData.creditAmount = '';

                    }



                    recData.calcAmount = parseFloat(recData.converted_price);

                    recData.convRate = parseFloat(recData.convRate);



                    recData.bankGlID = recData.account_id;

                    recData.bankNo = recData.account_no;

                    recData.bankGlName = recData.account_name;



                    // recData.amount = parseFloat(recData.debit_amount);

                    $scope.bankRec.push(recData);

                });

            } else

                $scope.check_opbalnc_readonly = false;

        });

    }



    $scope.addOpeningBalanceBank = function() {



        var postUrl = $scope.$root.gl + "chart-accounts/add-opening-balance-bank";

        var post = {};

        post.token = $scope.$root.token;

        post.bankRec = $scope.bankRec;

        post.module_type = $scope.receipt_type;

        post.sub_module_type = $scope.sub_module_type;

        post.defaultCurrency = $scope.$root.defaultCurrency;



        $scope.showLoader = true;



        $http

            .post(postUrl, post)

        .then(function(res) {



            $scope.showLoader = false;



            if (res.data.ack == true) {

                toaster.pop('success', 'Add', res.data.error);

                $scope.getOpeningBalanceBank();

            } else {

                toaster.pop('error', 'Error', res.data.error);

                return false;

            }

        });

    }



    $scope.netTotalBank = function() {

        var netTotal = 0;

        var debitTotal = 0;

        var creditTotal = 0;



        angular.forEach($scope.bankRec, function(obj) {

            if (parseFloat(obj.debitAmount) > 0) {

                if (obj.calcAmount != undefined && parseFloat(obj.calcAmount) > 0)

                    debitTotal += +(Number(obj.calcAmount).toFixed(2)); //parseFloat(obj.calcAmount);

            }

        });



        angular.forEach($scope.bankRec, function(obj) {

            if (parseFloat(obj.creditAmount) > 0) {

                if (obj.calcAmount != undefined && parseFloat(obj.calcAmount) > 0)

                    creditTotal += +(Number(obj.calcAmount).toFixed(2)); //parseFloat(obj.calcAmount);

            }

        });



        // netTotal = parseFloat(debitTotal) - parseFloat(creditTotal);

        netTotal = Number(debitTotal - creditTotal).toFixed(2);

        return netTotal;

    }



    $scope.deleteOpeningBalncBankRec = function(updateID, index, recGL) {



        // console.log(updateID);return false;

        // var deletOpeningBalncGL = $scope.$root.gl + "chart-accounts/delete-opening-balnc-gl-rec";

        var deletOpeningBalncBank = $scope.$root.gl + "chart-accounts/delete-opening-balnc-bank-rec";



        ngDialog.openConfirm({

            template: 'modalDeleteDialogId',

            className: 'ngdialog-theme-default-custom'

        }).then(function(value) {



            if (updateID > 0) {

                $http

                    .post(deletOpeningBalncBank, { 'id': updateID, 'token': $scope.$root.token })

                .then(function(res) {

                    if (res.data.ack == true) {

                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));

                        recGL.splice(index, 1);

                    } else

                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));

                });

            } else {

                toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));

                recGL.splice(index, 1);

            }



        }, function(reason) {

            console.log('Modal promise rejected. Reason: ', reason);

        });

    }



    $scope.changeDocTypeBank = function(docType, rec) {

        rec.debitAmount = '';

        rec.creditAmount = '';

        rec.calcAmount = 0;

        // console.log(rec.moduleType);

        // console.log(docType);



        if (rec.moduleType == 1) {



            if (docType == 1) {

                rec.debitAmountchk = 1;

                rec.creditAmountchk = 0;

            } else if (docType == 2) {

                rec.debitAmountchk = 0;

                rec.creditAmountchk = 1;

            }

        } else if (rec.moduleType == 2) {

            if (docType == 2) {

                rec.debitAmountchk = 1;

                rec.creditAmountchk = 0;

            } else if (docType == 1) {

                rec.debitAmountchk = 0;

                rec.creditAmountchk = 1;

            }

        }



        if (rec.currencyID.id != undefined &&

            rec.posting_date != undefined &&

            ((rec.debitAmountchk > 0 && parseFloat(rec.debitAmount) > 0) ||

                (rec.creditAmountchk > 0 && parseFloat(rec.creditAmount) > 0)))

            $scope.convertAmountinLCYBank(rec);

    }



    $scope.changePostingDateBank = function(rec) {



        // console.log(rec.moduleType);

        // console.log(rec.docType);



        if (rec.currencyID.id != undefined && rec.docTypes != undefined) {



            var docType = rec.docTypes.id;



            if (rec.moduleType == 1) {

                if (docType == 1) {

                    rec.debitAmountchk = 1;

                    rec.creditAmountchk = 0;

                } else if (docType == 2) {

                    rec.debitAmountchk = 0;

                    rec.creditAmountchk = 1;

                }

            } else if (rec.moduleType == 2) {

                if (docType == 1) {

                    rec.debitAmountchk = 0;

                    rec.creditAmountchk = 1;

                } else if (docType == 2) {

                    rec.debitAmountchk = 1;

                    rec.creditAmountchk = 0;

                }

            }



            if ((rec.debitAmountchk > 0 && parseFloat(rec.debitAmount) > 0) ||

                (rec.creditAmountchk > 0 && parseFloat(rec.creditAmount) > 0))

                $scope.convertAmountinLCYBank(rec);

        }

    }



    $scope.changeDebitCreditAmountBank = function(rec) {



        // console.log(rec.moduleType);



        if (rec.currencyID.id != undefined &&

            rec.posting_date != undefined &&

            rec.docTypes != undefined)

            $scope.convertAmountinLCYBank(rec);

    }



    $scope.changeConvRateBank = function(rec) {

        if (rec.currencyID.id != undefined && rec.posting_date != undefined && rec.docTypes != undefined) {



            var docType = rec.docTypes.id;



            if (rec.moduleType == 1) {

                if (docType == 1) {

                    rec.debitAmountchk = 1;

                    rec.creditAmountchk = 0;

                } else if (docType == 2) {

                    rec.debitAmountchk = 0;

                    rec.creditAmountchk = 1;

                }

            } else if (rec.moduleType == 2) {

                if (docType == 2) {

                    rec.debitAmountchk = 1;

                    rec.creditAmountchk = 0;

                } else if (docType == 1) {

                    rec.debitAmountchk = 0;

                    rec.creditAmountchk = 1;

                }

            }



            if (parseFloat(rec.convRate) > 0) {



                if (rec.debitAmountchk > 0 && !(parseFloat(rec.debitAmount) > 0)) {

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Debit Amount']));

                    return false;

                } else if (rec.creditAmountchk > 0 && !(parseFloat(rec.creditAmount) > 0)) {

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Credit Amount']));

                    return false;

                }





                if (rec.moduleType == 1) {

                    if (docType == 1)

                        rec.calcAmount = parseFloat(rec.debitAmount) / parseFloat(rec.convRate);

                    else if (docType == 2)

                        rec.calcAmount = parseFloat(rec.creditAmount) / parseFloat(rec.convRate);

                    // rec.calcAmount = parseFloat(rec.debitAmount) / parseFloat(rec.convRate);

                } else if (rec.moduleType == 2) {



                    if (docType == 1)

                        rec.calcAmount = parseFloat(rec.creditAmount) / parseFloat(rec.convRate);

                    else if (docType == 2)

                        rec.calcAmount = parseFloat(rec.debitAmount) / parseFloat(rec.convRate);

                    // rec.calcAmount = parseFloat(rec.debitAmount) / parseFloat(rec.convRate);

                }

                return;

            }

        }

        // $scope.convertAmountinLCY(rec, moduleType);

    }



    $scope.convertAmountinLCYBank = function(rec) {



        // console.log(rec.currencyID.id);



        rec.converted_currency_id = $scope.$root.defaultCurrency;



        if (rec.docTypes == undefined) {

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Document Type']));

            return false;

        }



        if (rec.posting_date == undefined) {

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Posting Date']));

            return false;

        }



        rec.calcAmount = 0;



        var docType = rec.docTypes.id;



        if (rec.moduleType == 1) {



            if (docType == 1) {

                rec.debitAmountchk = 1;

                rec.creditAmountchk = 0;

            } else if (docType == 2) {

                rec.debitAmountchk = 0;

                rec.creditAmountchk = 1;

            }

        } else if (rec.moduleType == 2) {



            if (docType == 2) {

                rec.debitAmountchk = 1;

                rec.creditAmountchk = 0;

            } else if (docType == 1) {

                rec.debitAmountchk = 0;

                rec.creditAmountchk = 1;

            }

        }



        if (rec.currencyID.id == $scope.$root.defaultCurrency) {



            rec.convRate = 1;

            // console.log(rec);



            if (rec.debitAmountchk > 0) {



                if (!(parseFloat(rec.debitAmount) > 0)) {

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Debit Amount']));

                    return false;

                }



                rec.calcAmount = parseFloat(rec.debitAmount);

                return;

            } else if (rec.creditAmountchk > 0) {



                if (!(parseFloat(rec.creditAmount) > 0)) {

                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Credit Amount']));

                    return false;

                }

                rec.calcAmount = parseFloat(rec.creditAmount);

                return;

            }

        } else {



            if (rec.debitAmountchk > 0 && !(parseFloat(rec.debitAmount) > 0)) {

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Debit Amount']));

                return false;

            } else if (rec.creditAmountchk > 0 && !(parseFloat(rec.creditAmount) > 0)) {

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Credit Amount']));

                return false;

            }



            rec.convRate = '';

            return;



        }

        return false;

    }



    // opening balance Bank end

    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&



    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

    // opening balance GL start



    $scope.recGL = [];



    $scope.addOpeningBalanceGL = function() {



        var postUrl = $scope.$root.gl + "chart-accounts/add-opening-balance-gl";

        var post = {};

        post.token = $scope.$root.token;

        post.recGL = $scope.recGL;

        post.module_type = $scope.receipt_type;

        post.sub_module_type = $scope.sub_module_type;

        post.defaultCurrency = $scope.$root.defaultCurrency;



        $scope.showLoader = true;



        $http

            .post(postUrl, post)

        .then(function(res) {



            $scope.showLoader = false;



            if (res.data.ack == true) {

                toaster.pop('success', 'Add', res.data.error);

                $scope.getOpeningBalanceGL();

            } else {

                toaster.pop('error', 'Error', res.data.error);

                return false;

            }

        });

    }



    $scope.getOpeningBalanceGL = function() {

        var postUrl = $scope.$root.gl + "chart-accounts/get-opening-balance-gl";

        var post = {};

        post.token = $scope.$root.token;

        post.module_type = $scope.receipt_type;

        post.sub_module_type = $scope.sub_module_type;

        $scope.recGL = [];



        $scope.showLoader = true;



        $http

            .post(postUrl, post)

        .then(function(res) {



            $scope.showLoader = false;



            $scope.receipt_gl_list = false;

            $scope.receipt_gl_form = true;



            $scope.array_receipt_gl_form = {};

            $scope.array_receipt_gl_form.module_type = 4;

            $scope.array_receipt_gl_form.sub_module_type = 5;

            $scope.check_opbalnc_readonly = true;



            if (res.data.ack == true) {

                $scope.postStatus = 1;



                angular.forEach(res.data.response, function(recData) {



                    // console.log(recData);

                    recData.docType = [{ id: 1, name: 'Payment' }, { id: 2, name: 'Refund' }];



                    angular.forEach(recData.docType, function(obj) {

                        if (obj.id == recData.docTypesel)

                            recData.docTypes = obj;

                    });



                    angular.forEach($scope.newCurrencyList, function(obj) {

                        if (obj.id == recData.currency_id)

                            recData.currencyID = obj;

                    });



                    if (recData.postStatus == 0)

                        $scope.postStatus = 0;



                    if (recData.debitAmount > 0)

                        recData.debitAmount = parseFloat(recData.debitAmount);

                    else

                        recData.debitAmount = '';



                    if (recData.creditAmount > 0)

                        recData.creditAmount = parseFloat(recData.creditAmount);

                    else

                        recData.creditAmount = '';



                    recData.calcAmount = parseFloat(recData.converted_price);

                    recData.convRate = parseFloat(recData.convRate);



                    if (recData.postStatus != 1)

                        $scope.showPostBtn = true;



                    $scope.recGL.push(recData);

                });

            } else {

                var recData = {};

                recData.docType = [{ id: 1, name: 'Payment' }, { id: 2, name: 'Refund' }];



                recData.moduleNo = recData.code;

                recData.description = recData.name;

                angular.forEach($scope.newCurrencyList, function(obj) {

                    if (obj.id == $scope.$root.defaultCurrency)

                        recData.currencyID = obj;

                });



                recData.debitAmount = '';

                recData.creditAmount = '';

                recData.calcAmount = 0;

                recData.convRate = 1;

                $scope.recGL.push(recData);

                $scope.check_opbalnc_readonly = false;

            }

        });

    }



    $scope.deleteOpeningBalncGLRec = function(updateID, index, recGL) {



        // console.log(updateID);return false;

        var deletOpeningBalncGL = $scope.$root.gl + "chart-accounts/delete-opening-balnc-gl-rec";



        ngDialog.openConfirm({

            template: 'modalDeleteDialogId',

            className: 'ngdialog-theme-default-custom'

        }).then(function(value) {



            if (updateID > 0) {

                $http

                    .post(deletOpeningBalncGL, { 'id': updateID, 'token': $scope.$root.token })

                .then(function(res) {

                    if (res.data.ack == true) {

                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));

                        recGL.splice(index, 1);

                    } else

                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));

                });

            } else {

                toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));

                recGL.splice(index, 1);

            }



        }, function(reason) {

            console.log('Modal promise rejected. Reason: ', reason);

        });

    }



    $scope.getOpeningBalanceGlList = function(rec, indexNo, typeBank) {
        $scope.glRecindex = indexNo;
        $scope.title = 'Select G/L No.';
        $scope.typeBank = typeBank;

        var postUrlOpeningBalanceGl = $scope.$root.gl + "chart-accounts/get-category-by-name";
        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;

        $http
            .post(postUrlOpeningBalanceGl, $scope.postData)
            .then(function(res) {
                $scope.gl_account = [];
                $scope.showLoader = false;
                $scope.filterGL = {};

                if (res.data.ack == true) {
                    $scope.gl_account = res.data.response;
                    angular.element('#glAccountModal').modal({ show: true });
                } else
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));

            }).catch(function(message) {
                $scope.showLoader = false;
                throw new Error(message.data);
            });
    }

    $scope.assignCodesOpeningBalanceGl = function(gl_data) {
        $scope.filterGL.search = '';

        if ($scope.typeBank == 2) {
            angular.forEach($scope.bankRec, function(obj_rec, index2) {
                if (index2 == $scope.glRecindex) {
                    obj_rec.bankGlID = gl_data.id;
                    obj_rec.bankGlName = gl_data.name;
                    obj_rec.bankNo = gl_data.code;
                }
            });

        } else {
            angular.forEach($scope.recGL, function(obj_rec, index3) {
                if (index3 == $scope.glRecindex) {
                    obj_rec.moduleNo = gl_data.code;
                    obj_rec.description = gl_data.name;
                    obj_rec.account_id = gl_data.id;
                    obj_rec.account_name = gl_data.name;
                    obj_rec.account_no = gl_data.code;
                }
            });
        }
        angular.element('#glAccountModal').modal('hide');
    }

    $scope.addOpeningBalncGLRow = function() {
        var recData = {};
        recData.docType = [{ id: 1, name: 'Payment' }, { id: 2, name: 'Refund' }];
        recData.moduleNo = recData.code;
        recData.description = recData.name;

        if ($scope.recGL.length > 0) {
            if ($scope.recGL[$scope.recGL.length - 1].posting_date != undefined)
                recData.posting_date = $scope.recGL[$scope.recGL.length - 1].posting_date;
        }

        angular.forEach($scope.newCurrencyList, function(obj) {
            if (obj.id == $scope.$root.defaultCurrency)
                recData.currencyID = obj;
        });

        recData.debitAmount = '';
        recData.creditAmount = '';
        recData.calcAmount = 0;
        recData.convRate = 1;
        $scope.recGL.push(recData);
    }

    $scope.changePostingDateGl = function(rec) {
        if (rec.currencyID != undefined && (parseFloat(rec.debitAmount) > 0) || (parseFloat(rec.creditAmount) > 0))
            $scope.convertAmountinLCYGl(rec);
    }

    $scope.changeDebitCreditAmountGl = function(rec, amountType) {

        if (amountType == 1 && rec.debitAmount > 0)
            rec.creditAmount = '';
        else if (amountType == 2 && rec.creditAmount > 0)
            rec.debitAmount = '';

        if (rec.currencyID != undefined && rec.posting_date != undefined)
            $scope.convertAmountinLCYGl(rec);
    }

    $scope.changeConvRateGl = function(rec) {
        if (rec.currencyID != undefined && rec.posting_date != undefined) {
            if (parseFloat(rec.convRate) > 0) {
                if (!(parseFloat(rec.debitAmount) > 0) && !(parseFloat(rec.creditAmount) > 0)) {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Amount']));
                    return false;
                }

                if (parseFloat(rec.debitAmount) > 0)
                    rec.calcAmount = parseFloat(rec.debitAmount) / parseFloat(rec.convRate);
                else if (parseFloat(rec.creditAmount) > 0)
                    rec.calcAmount = parseFloat(rec.creditAmount) / parseFloat(rec.convRate);
                return;
            }
        }
    }

    $scope.convertAmountinLCYGl = function(rec, param) {
        rec.converted_currency_id = $scope.$root.defaultCurrency;

        if (rec.posting_date == undefined && param != 1) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Posting Date']));
            return false;
        }

        rec.calcAmount = 0;

        if (!(parseFloat(rec.debitAmount) > 0) && !(parseFloat(rec.creditAmount) > 0) && param != 1) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Amount']));
            return false;
        }

        if (rec.currencyID.id == $scope.$root.defaultCurrency) {
            rec.convRate = 1;
            if (parseFloat(rec.debitAmount) > 0)
                rec.calcAmount = parseFloat(rec.debitAmount);
            else if (parseFloat(rec.creditAmount) > 0)
                rec.calcAmount = parseFloat(rec.creditAmount);
            return;
        } else {
            rec.convRate = '';
            return;
        }
        return false;
    }

    $scope.netTotalGL = function() {
        var netTotal = 0;
        var debitTotal = 0;
        var creditTotal = 0;

        angular.forEach($scope.recGL, function(obj) {
            if (parseFloat(obj.debitAmount) > 0) {
                if (obj.calcAmount != undefined && parseFloat(obj.calcAmount) > 0)
                    debitTotal += +(Number(obj.calcAmount).toFixed(2)); //parseFloat(obj.calcAmount);
            }
        });

        angular.forEach($scope.recGL, function(obj) {
            if (parseFloat(obj.creditAmount) > 0) {
                if (obj.calcAmount != undefined && parseFloat(obj.calcAmount) > 0)
                    creditTotal += +(Number(obj.calcAmount).toFixed(2)); //parseFloat(obj.calcAmount);
            }
        });

        netTotal = Number(debitTotal - creditTotal).toFixed(2);
        return netTotal;
    }

    // opening balance GL end
    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

    $scope.postOpeningBalance = function() {
        var postUrl = $scope.$root.gl + "chart-accounts/post-opening-balance";
        if ($scope.sub_module_type == 2) {
            //validation loop
            var keepValidating = 0;

            angular.forEach($scope.items, function(item, idx) {

                if (keepValidating == 0) {

                    if (!item.hasOwnProperty('posting_date') || item.posting_date == "") {
                        keepValidating++;
                        toaster.pop('error', 'Error', 'Posting Date is required for ' + item.product_name + '(' + item.product_code + ')');
                    }
                    //warehouses.name
                    else if (item.stock_check == 1 && (!item.hasOwnProperty('warehouses') || !item.warehouses.hasOwnProperty('name'))) {
                        toaster.pop('error', 'Error', 'Warehouse is required for ' + item.product_name + '(' + item.product_code + ')');
                        keepValidating++;
                    }
                }
            });

            if (keepValidating > 0)
                return false;
        }

        ngDialog.openConfirm({
            template: 'modalPostOpeningBalance',
            className: 'ngdialog-theme-default-custom'
        }).then(function(value) {
            var post = {};
            post.token = $scope.$root.token;

            if ($scope.sub_module_type == 1) {
                post.bankRec = $scope.bankRec;
                post.module_type = $scope.receipt_type;
                post.sub_module_type = $scope.sub_module_type;
                post.defaultCurrency = $scope.$root.defaultCurrency;

            } else if ($scope.sub_module_type == 2) {
                post.items = $scope.items;
                post.module_type = $scope.receipt_type;
                post.sub_module_type = $scope.sub_module_type;
                post.parent_id = $scope.parent_id;

            } else if ($scope.sub_module_type == 3) {
                post.customers = $scope.customers;
                post.module_type = $scope.receipt_type;
                post.sub_module_type = $scope.sub_module_type;
                post.defaultCurrency = $scope.$root.defaultCurrency;

            } else if ($scope.sub_module_type == 4) {
                post.suppliers = $scope.suppliers;
                post.module_type = $scope.receipt_type;
                post.sub_module_type = $scope.sub_module_type;
                post.defaultCurrency = $scope.$root.defaultCurrency;

            } else if ($scope.sub_module_type == 5) {
                post.recGL = $scope.recGL;
                post.module_type = $scope.receipt_type;
                post.sub_module_type = $scope.sub_module_type;
                post.defaultCurrency = $scope.$root.defaultCurrency;
            }

            $scope.showLoader = true;

            $http
                .post(postUrl, post)
                .then(function(res) {
                    $scope.receipt_gl_list = false;
                    $scope.receipt_gl_form = true;
                    $scope.showLoader = false;
                    $scope.array_receipt_gl_form = {};
                    $scope.array_receipt_gl_form.module_type = 4;
                    $scope.array_receipt_gl_form.sub_module_type = $scope.sub_module_type;

                    if (res.data.ack == true) {
                        $scope.postStatus = 1;
                        toaster.pop('success', 'Info', 'Opening Balances Posted Successfully');

                        if ($scope.sub_module_type == 1) {
                            $scope.getOpeningBalanceBank();
                        } else if ($scope.sub_module_type == 2) {
                            $scope.getOpeningBalanceStock();
                        } else if ($scope.sub_module_type == 3) {
                            $scope.getOpeningBalanceCustomers();
                        } else if ($scope.sub_module_type == 4) {
                            $scope.getOpeningBalanceSuppliers();
                        } else if ($scope.sub_module_type == 5) {
                            $scope.getOpeningBalanceGL();
                        }

                    } else {
                        toaster.pop('error', 'Error', res.data.error);
                        return false;
                    }
                });

        }, function(reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.updateWarehouseLoc = function(storageLoc, item) {
        if (storageLoc.id > 0 && storageLoc.pwlID > 0)
            item.prodStorageLocID = storageLoc.pwlID;
    }

    $scope.getWarehouseLoc = function(wrhid, item, storageLocID) {
        item.storageLoc = {};

        if (wrhid > 0) {
            var postUrl = $scope.$root.setup + "warehouse/get-loc-by-warehouse-id-link-to-item";
            var post = {};
            post.token = $scope.$root.token;
            post.wrh_id = wrhid;
            post.product_id = item.id;

            $http
                .post(postUrl, post)
                .then(function(res) {
                    if (res.data.ack == true) {
                        item.arrStorageLoc = res.data.response;

                        if (storageLocID > 0) {
                            angular.forEach(item.arrStorageLoc, function(obj) {
                                if (obj.id == storageLocID)
                                    item.storageLoc = obj;
                            });
                        }
                    }
                });
        }
    }

    $scope.deleteOpeningBalncStockItem = function(updateID, index, items) {

        var deletOpeningBalncStock = $scope.$root.gl + "chart-accounts/delete-opening-balnc-stock-item";

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function(value) {
            if (updateID > 0) {
                $http
                    .post(deletOpeningBalncStock, { 'id': updateID, 'token': $scope.$root.token })
                    .then(function(res) {
                        if (res.data.ack == true) {
                            toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                            items.splice(index, 1);
                        } else
                            toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    });
            } else {
                toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                items.splice(index, 1);
            }
        }, function(reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.getCurrencyList = function() {
        $scope.newCurrencyList = [];
        var postUrl = $rootScope.setup + "general/currency-list";

        var postData = {
            'token': $rootScope.token
        };

        return $http
            .post(postUrl, postData)
            .then(function(res) {
                if (res.data.ack == true) {
                    $scope.newCurrencyList = res.data.response;
                }
            });
    }

    if ($scope.receipt_type == 4) {
        if ($scope.sub_module_type == 1) {
            $scope.bankRec = [];
            $scope.getCurrencyList()
                .then(function(res) {
                    $scope.getOpeningBalanceBank();
                });

        } else if ($scope.sub_module_type == 2) {
            $scope.items = [];

            $rootScope.get_global_data(1)
                .then(function(res) {
                    $scope.getOpeningBalanceStock();
                });

        } else if ($scope.sub_module_type == 3) {
            $scope.customers = [];

            $scope.getCurrencyList()
                .then(function(res) {
                    $scope.getOpeningBalanceCustomers();
                });

        } else if ($scope.sub_module_type == 4) {

            $scope.suppliers = [];

            $scope.getCurrencyList()
                .then(function(res) {
                    $scope.getOpeningBalanceSuppliers();
                });

        } else if ($scope.sub_module_type == 5) {

            $scope.recGL = [];

            $scope.getCurrencyList()
                .then(function(res) {
                    $scope.getOpeningBalanceGL();
                });

        }
    }
}

/*=============GL Opening Balance old code End  =============================================*/