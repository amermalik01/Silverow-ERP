CompanyController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
CompanyFileUploadController.$inject = ["$scope", "Upload", "$timeout", "$rootScope", "toaster"];

myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.company', {
                url: '/company',
                title: 'Setup',
                templateUrl: helper.basepath('company/company.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.addCompany', {
                url: '/company/add',
                title: 'Setup',
                templateUrl: helper.basepath('company/tabs.html'),
                resolve: helper.resolveFor('ngDialog'),
                controller: 'CompanyAddController'
            })
            .state('app.viewCompany', {
                url: '/company/:id/view',
                title: 'Setup',
                templateUrl: helper.basepath('company/tabs.html'),
                resolve: helper.resolveFor('ngDialog'),
                controller: 'CompanyEditController'
            })
            .state('app.editCompany', {
                url: '/company/:id/edit/:tab',
                title: 'Setup',
                templateUrl: helper.basepath('company/tabs.html'),
                resolve: helper.resolveFor('ngDialog'),
                controller: 'CompanyEditController'
            })
            .state('app.subscriptions', {
                url: '/manage-subscriptions',
                title: 'Manage Subscriptions',
                templateUrl: helper.basepath('company/subscriptions.html'),
                resolve: helper.resolveFor('ngDialog'),
                controller: 'CompanyEditController'
            })

    }]);

myApp.controller('CompanyController', CompanyController);
myApp.controller('CompanyAddController', CompanyAddController);
myApp.controller('CompanyEditController', CompanyEditController);
myApp.controller('CompanyFileUploadController', CompanyFileUploadController);

function CompanyController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
    'use strict';

    // required for inner references
    $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
    { 'name': 'General', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
    { 'name': 'Company', 'url': '#', 'isActive': false }];

    var vm = this;
    var Api = $scope.$root.setup + "general/companies";
    var delUrl = $scope.$root.setup + "general/delete-company";
    $scope.postData = {
        'token': $scope.$root.token,
        'all': "1"
    };

    $scope.MainDefer = null;
    $scope.mainParams = null;
    $scope.mainFilter = null;
    $scope.count = 1;

    $scope.search_data = '';

    // Companies Interface changed from table to Div
    $scope.res_companies = "";
    $scope.getCompanies = function () {
        $http
            .post(Api, { 'token': $scope.$root.token })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.res_companies = res.data.response;
                    // console.log(res);
                }
            });
    }
    $scope.getCompanies();

    /*
    $scope.$watch("MyCustomeFilters", function () {
        if ($scope.MyCustomeFilters && $scope.tableParams5) {
            $scope.tableParams5.reload();
        }
    }, true);
    $scope.MyCustomeFilters = {}

    $scope.checkData = {};
    vm.tableParams5 = new ngParams({
        page: 1, // show first page
        count: $scope.$root.pagination_limit, // count per page
        filter: {
            name: '',
            age: ''
        }
    }, {
        total: 0, // length of data
        counts: [], // hide page counts control

        getData: function ($defer, params) {
            //$scope.checkData = ngDataService.getData( $defer, params, Api,$filter,$scope,$scope.postData);

            //  ngDataService.getDataCustomAjax($defer, params, Api, $filter, $scope, 'company', $scope.postData);
            $scope.MainDefer = $defer;
            $scope.mainParams = params;
            $scope.mainFilter = $filter;

            ngDataService.getDataCustom($defer, params, Api, $filter, $scope, $scope.postData);
        }
    });
    */
    $scope.getGLcode = function () {
        console.log("listing controller");
    }

    $scope.$data = {};
    $scope.deleteCompany = function (id, index, $data) {
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

}

function CompanyAddController($scope, $http, $stateParams, $state, toaster, Calendar, ngDialog, $rootScope) {

    $scope.btnCancelUrl = 'app.company';
    $scope.formTitle = 'Company';
    $scope.isSetDateFormat = false;

    $scope.company_url = 'app.viewCompany({id:' + $stateParams.id + '})';


    $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
    { 'name': 'General', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
    { 'name': 'Company', 'url': '#', 'isActive': false }];

    $scope.formUrl = function () {
        return "app/views/company/_form.html";
    }

    // ------------------------------------------------
    //			Code for General Tab		
    //-------------------------------------------------

    $scope.general = {};
    $scope.timezone = {}
    $scope.country = {};
    $scope.comp_addresses = {};
    var addGenUrl = $scope.$root.setup + "general/add-company";

    $scope.arr_vat_scheme = [];
    //angular.copy($rootScope.arr_vat, $scope.arr_vat_scheme);
    $scope.arr_vat_scheme = [{ 'id': 1, 'name': 'Standard' }, { 'id': 2, 'name': 'No VAT' }];

    //------- Get countries-------------------------

    $scope.countries = [];
    angular.copy($rootScope.country_type_arr, $scope.countries);

    // $scope.currencies = [];
    // angular.copy($rootScope.arr_currency, $scope.currencies);


    // $rootScope.arr_currency = [];
    // $rootScope.get_currency_list();
    $scope.currencies = [];
    angular.copy($rootScope.ref_currency_list, $scope.currencies);
    $scope.general.currency = $rootScope.ref_currency_list[0];
    //--------Save General Company Data-------------
    $scope.timeFarmat = 0;
    $scope.dateFarmat = 0;
    $scope.setDefaultTime = function (val) {
        $scope.timeFarmat = val;
    }
    $scope.setDefaultDate = function (val) {
        $scope.dateFarmat = val;
        $scope.isSetDateFormat = false;
    }

    $scope.check_readonly = false;

    $scope.gotoEdit = function () {
        $scope.check_readonly = false;
    }

    $scope.defaultReadonly = true;

    $scope.general.add_mode = 1;
    $scope.general.decimal_range = 2;
    $scope.general.num_user_login = 10;
    $scope.general.date_format = 3;
    $scope.general.time_format = 1;

    $scope.dateFarmat = 3;
    $scope.timeFarmat = 1;
    $rootScope.date_format = 3;

    angular.forEach($rootScope.country_type_arr, function (obj) {
        if (obj.id == 225)
            $scope.general.country = obj;
    });

    // console.log($rootScope.ref_currency_list);

    /* angular.forEach($rootScope.ref_currency_list, function (obj) {
        if (obj.id == 1)
            $scope.general.currency = obj;
    });
 */
    angular.forEach($rootScope.timezones, function (obj) {
        if (obj.id == 14)
            $scope.general.timezonee = obj;
    });

    $scope.addGeneral = function (general) {

        general.country_id = $scope.general.country !== undefined ? $scope.general.country.id : 0;
        general.currency_id = $scope.general.currency !== undefined && $scope.general.currency.id > 0 ? $scope.general.currency.id : 0;
        general.timezone = $scope.general.timezonee !== undefined ? $scope.general.timezonee.id : 0;
        general.token = $scope.$root.token;
        general.time_format = $scope.timeFarmat;
        general.date_format = $scope.dateFarmat;

        if (general.date_format == 0) {
            $scope.isSetDateFormat = true;
            return false;
        }
        else
            $scope.isSetDateFormat = false;

        if (general.id > 0) {
            addGenUrl = $scope.$root.setup + "general/update-company";
            // general.id = $scope.$root.company_id;
        }

        $http
            .post(addGenUrl, general)
            .then(function (res) {
                if (res.data.ack == true) {

                    $scope.$root.opp_cycle_limit = general.opp_cycle_limit;
                    // $scope.$root.company_id = res.data.id;
                    $rootScope.date_format = general.date_format;
                    $scope.$root.currency_id = general.currency_id;
                    $scope.$root.country_id = general.country_id;

                    $scope.check_readonly = true;
                    if (res.data.edit != undefined && res.data.edit == true)
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));
                    else
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));

                    $state.go("app.editCompany", { id: res.data.id });
                    angular.element('.company_adddresses,.bank_accounts,.financial_setting,.currencies,.passwordSettings,.configurations').removeClass('dont-click');

                    $scope.fnDatePicker();

                }
                else
                    toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(104));
            });
    }

    //--------------------- End General Code ------------------------------------------

    // ---------------------------------------------------------------
    //			Code for Company Addresses Tab		
    //----------------------------------------------------------------

    // Company Addresses Listings
    $scope.getCompanyAddresses = function () {

        $scope.showAddrListing = true;
        $scope.showLoader = true;
        $scope.showAddrForm = false;
        $scope.compAddrData = {};
        $scope.columns = [];

        var vm = this;
        var Api = $scope.$root.setup + "general/company-addresses";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
            'company_id': $scope.$root.company_id
        };

        $http
            .post(Api, postData)
            .then(function (res) {
                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.compAddrData = res.data.response;
                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }
                else
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
            });
    }

    function toTitleCase(str) {
        var title = str.replace('_', ' ');
        return title.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }


    $scope.fnAddrForm = function () {
        $scope.check_addr_readonly = false;
        $scope.comp_addresses = {};
        $scope.showAddrForm = true;
        $scope.showAddrListing = false;

        angular.forEach($scope.countries, function (obj) {
            if (obj.id == $rootScope.country_id)
                $scope.comp_addresses.country = obj;
        });
    }

    //--------Save Company Addresses Data-------------


    $scope.addCompanyAddress = function (comp_addresses) {
        if ($scope.$root.company_id == 0) {
            toaster.pop('error', 'Info', 'Please add company first');
            return false;
        }

        var addCompAddressesUrl = $scope.$root.setup + "general/add-company-address";
        comp_addresses.country_id = $scope.comp_addresses.country !== undefined ? $scope.comp_addresses.country.id : 0;
        comp_addresses.token = $scope.$root.token;
        comp_addresses.company_id = $scope.$root.company_id;
        if (comp_addresses.id !== undefined)
            addCompAddressesUrl = $scope.$root.setup + "general/update-company-address";

        $http
            .post(addCompAddressesUrl, comp_addresses)
            .then(function (res) {
                if (res.data.ack == true) {

                    if (comp_addresses.id !== undefined)
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));
                    else
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));

                    $timeout(function () {
                        $scope.getCompanyAddresses();
                    }, 3000);
                }
                else
                    toaster.pop('error', 'Add', res.data.error);
            });
    }

    //----------- view company form --------
    $scope.showViewAddrForm = function (id, parm) {
        $scope.showLoader = true;
        $scope.showAddrForm = true;
        $scope.showAddrListing = false;
        if (parm == undefined)
            $scope.check_addr_readonly = true;
        $scope.comp_addresses = {};
        var getCompAddressesUrl = $scope.$root.setup + "general/get-company-address";

        var postViewAddrData = {
            'token': $scope.$root.token,
            'id': id
        };

        $http
            .post(getCompAddressesUrl, postViewAddrData)
            .then(function (res) {
                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.comp_addresses = res.data.response;

                    angular.forEach($scope.countries, function (obj) {
                        if (obj.id == res.data.response.country_id)
                            $scope.comp_addresses.country = obj;
                    });
                }
            });
    }

    $scope.showEditAddrForm = function (id) {
        $scope.check_addr_readonly = false;
        if (id != undefined)
            $scope.showViewAddrForm(id, 'edit');
    }

    $scope.deleteCompanyAdddress = function (id, index, compAddrData) {
        var delCompAddressesUrl = $scope.$root.setup + "general/delete-company-address";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delCompAddressesUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        compAddrData.splice(index, 1);
                    }
                    else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };


    //-------------------- Company Addresses End--------------------


    // ---------------------------------------------------------------
    //			Code for Bank Tab		
    //----------------------------------------------------------------

    // Bank Listings
    $scope.getBankAccounts = function () {
        $scope.showLoader = true;
        $scope.showBankListing = true;
        $scope.showBankForm = false;
        $scope.compBankData = [];
        $scope.columns = [];

        var postData = {};

        var vm = this;
        var BankApi = $scope.$root.setup + "general/bank-accounts";
        postData = {
            'token': $scope.$root.token,
            'all': "1",
            'column': 'company_id',
            'value': $scope.$root.company_id,
            'chkPerm': 1
        };

        $http
            .post(BankApi, postData)
            .then(function (res) {
                if (res.data.response != null && res.data.response.length > 0) {
                    $scope.bankData = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    $scope.showLoader = false;
                }
                else {
                    $scope.showLoader = false;
                }
            });


    }


    $scope.bank = {};
    $scope.fnBankForm = function () {
        $scope.bank = {};
        $scope.showBankForm = true;
        $scope.showBankListing = false;
    }

    //--------Save Company Addresses Data-------------
    $scope.datePicker = {};

    $scope.addBankAccount = function (bank) {
        if ($scope.$root.company_id == 0) {
            toaster.pop('error', 'Info', 'Please add company first');
            return false;
        }

        var addBankUrl = $scope.$root.setup + "general/add-bank-account";
        bank.country_id = ($scope.bank.country !== undefined && $scope.bank.country != '')  ? $scope.bank.country.id : 0;
        bank.currency_id = $scope.bank.currency !== undefined ? $scope.bank.currency.id : 0;
        bank.token = $scope.$root.token;
        bank.company_id = $scope.$root.company_id;

        if (bank.country_id == 0) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Country']));
            return false;
        }

        // console.log(bank);
        // if (bank.id !== undefined)
        addBankUrl = $scope.$root.setup + "general/update-bank-account";

        $http
            .post(addBankUrl, bank)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $timeout(function () {
                        $scope.getBankAccounts();
                    }, 1000);
                }
                else
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
            });
    }

    //----------- view company form --------
    $scope.showViewBankForm = function (id, parm) {
        $scope.showLoader = true;
        $scope.showBankForm = true;
        $scope.showBankListing = false;

        // console.log(parm);
        if (parm == undefined)
            $scope.check_bank_readonly = true;

        $scope.comp_addresses = {};
        var getBankUrl = $scope.$root.setup + "general/get-bank-account";

        var postViewBankData = {
            'token': $scope.$root.token,
            'id': id
        };

        $http
            .post(getBankUrl, postViewBankData)
            .then(function (res) {

                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.bank = res.data.response;

                    angular.forEach($scope.countries, function (obj) {
                        if (obj.id == res.data.response.country_id)
                            $scope.bank.country = obj;
                    });

                    angular.forEach($rootScope.arr_currency, function (obj) {
                        if (obj.id == res.data.response.currency_id)
                            $scope.bank.currency = obj;
                    });
                }
            });
    }

    $scope.showEditBankForm = function (id) {
        $scope.check_addr_readonly = false;
    }

    var delBankUrl = $scope.$root.setup + "general/delete-bank-account";
    $scope.deleteBankAccount = function (bank_id, index, bankData) {
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delBankUrl, { id: bank_id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        // bankData.splice(index, 1);
                        $timeout(function () {
                            $scope.getBankAccounts();
                        }, 1000);
                    }
                    else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

    $scope.showBankFrom = function () {
        $scope.bank = {};
        $scope.check_bank_readonly = false;
        $scope.showBankForm = true;
        $scope.showBankListing = false;

        angular.forEach($scope.countries, function (obj) {
            if (obj.id == $rootScope.country_id)
                $scope.bank.country = obj;
        });

        angular.forEach($rootScope.arr_currency, function (obj) {
            if (obj.id == $rootScope.currency_id)
                $scope.bank.currency = obj;
        });
    }

    $scope.showBankListing = function () {
        $scope.showBankForm = false;
        $scope.showBankListing = true;
    }

    $scope.showBankViewForm = function (id) {
        $scope.showBankForm = true;
        $scope.showBankListing = false;
        $scope.check_bank_readonly = true;
    }

    $scope.showBankEditForm = function (id) {
        $scope.check_bank_readonly = false;

        if (id != undefined)
            $scope.showViewBankForm(id, 'edit');

    }

    //-------------------- Bank Account End--------------------


    // ---------------------------------------------------------------
    //			Financial Settings Tab		
    //----------------------------------------------------------------

    //$scope.datePicker = Calendar.get_caledar();
    $scope.finance = {};
    var addFinancialSettingUrl = $scope.$root.setup + "general/add-financial-setting";
    $scope.addFinancialSetting = function (finance) {
        if ($scope.$root.company_id == 0) {
            toaster.pop('error', 'Info', 'Please add company first');
            return false;
        }

        console.log(finance);
        console.log(finance.type_of_business_ownerships);


        finance.type_of_business_ownership = finance.type_of_business_ownerships !== undefined ? finance.type_of_business_ownerships.id : 0
        finance.vat_scheme = finance.vat_schemee !== undefined ? finance.vat_schemee.id : 0;
        finance.submission_frequency = finance.submission_frequencys !== undefined ? finance.submission_frequencys.id : 0;
        finance.token = $scope.$root.token;



        if (finance.type_of_business_ownership == 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Business Ownership']));
            return false;
        }

        if (finance.id == undefined) {
            updatefinance = $scope.$root.setup + "general/add-financial-setting";
            finance.company_id = $stateParams.id;
        }
        //console.log(finance);return;

        $http
            .post(updatefinance, finance)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $scope.check_readonly = true;
                }
                else {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $scope.check_readonly = true;
                }
            });

    }

    $scope.company_reg_no = false;
    $scope.onChangeTypeBusOwnership = function () {
        var owner_id = $scope.finance.type_of_business_ownerships.id;
        if (owner_id == 1 || owner_id == 2)
            $scope.is_comp_reg_no = false;
        else
            $scope.is_comp_reg_no = true;
    }

    $scope.vat_freq_readonly = false;

    $scope.changes_for_vat = function () {

        var vat_id = this.finance.vat_schemee.id;

        if (vat_id == 2) {
            $scope.vat_freq_readonly = true;
            $scope.finance.vat_reg_no = "";
            $scope.finance.submission_frequencys = "";
        }
        else {
            $scope.vat_freq_readonly = false;
        }
    }
    //---------------- Financial Settings End ------------------------

    //-----------------------------------------------------------------
    //					Currencies
    //-----------------------------------------------------------------

    $scope.getCurrencies = function () {
        $scope.showLoader = true;
        $scope.showCurrencyListing = true;
        $scope.showCurrencyForm = false;
        $scope.showConvRateForm = false;
        $scope.currencyData = [];
        $scope.columns = [];

        var postData = {};

        var vm = this;
        var Api = $scope.$root.setup + "general/currencies";
        postData = {
            'token': $scope.$root.token,
            'all': "1",
            'column': 'company_id',
            'value': $scope.$root.company_id
        };

        $http
            .post(Api, postData)
            .then(function (res) {
                if (res.data.response != null && res.data.response.length > 0) {
                    // $scope.currencyData = res.data.record.result;
                    // $scope.columns = res.data.columns;

                    angular.forEach(res.data.response, function (val) {
                        if(val && val.exchange_rate)
                            val.actualExchangeRate = parseFloat(1/val.exchange_rate).toFixed(5);
                        val.invertedExchangeRate = parseFloat(val.exchange_rate).toFixed(5);                       
                    });                   

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    $scope.currencyData = res.data.response;
                    $scope.showLoader = false;
                }
                else {
                    $scope.showLoader = false;
                }
            });

    }

    $scope.fnCurrencyForm = function () {
        $scope.currency = {};
        $scope.showCurrencyForm = true;
        $scope.showCurrencyListing = false;
    }

    $scope.fnDatePicker = function () {

        $scope.datePicker = {};

        $scope.datePicker = (function () {

            var method = {};
            method.instances = [];
            $scope.toggleMin = function () {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();

            method.open = function ($event, instance) {
                $event.preventDefault();
                $event.stopPropagation();

                var old_instance = $rootScope.$storage.getItem('old_instance');
                if (old_instance != null)
                    method.instances[old_instance] = false;

                method.instances[instance] = true;
                $rootScope.$storage.setItem('old_instance', instance);
            };

            method.options = {
                'show-weeks': false,
                startingDay: 0
            };

            method.format = $rootScope.dateFormats[$rootScope.date_format];

            return method;
        }());
        /******************************************/


    }
    $scope.currency = {};

    $scope.addCurrency = function (currency) {
        if ($scope.$root.company_id == 0) {
            toaster.pop('error', 'Info', 'Please add company first');
            return false;
        }

        var addCurrencyUrl = $scope.$root.setup + "general/add-currency";
        currency.name = $scope.currency.currency.name;
        currency.code = $scope.currency.currency.code;
        currency.symbol = $scope.currency.currency.symbol;
        currency.ref_currency_id = $scope.currency.currency.id;

        currency.token = $scope.$root.token;
        currency.company_id = $scope.$root.company_id;
        currency.status = $scope.currency.c_status !== undefined ? $scope.currency.c_status.value : 0;

        if (currency.id !== undefined)
            addCurrencyUrl = $scope.$root.setup + "general/update-currency";

        $http
            .post(addCurrencyUrl, currency)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', res.data.msg);
                    $timeout(function () {
                        $scope.getCurrencies();
                        $scope.showCurrencyForm = false;
                        $scope.showCurrencyListing = true;
                    }, 1000);
                }
                else
                    toaster.pop('error', 'Info', res.data.error);
            });
    }

    //----------- view company form --------
    $scope.showViewCurrencyForm = function (id, parm) {
        $scope.showLoader = true;
        $scope.showCurrencyForm = true;
        $scope.showCurrencyListing = false;
        if (parm == undefined)
            $scope.check_currency_readonly = true;
        var getCurrencyUrl = $scope.$root.setup + "general/get-currency";

        var get_currency_movement_Url = $scope.$root.setup + "general/get-foreign-currency-movement-by-company-id";

        var postViewCurrencyData = {
            'token': $scope.$root.token,
            'id': id
        };

        var postViewCurrencymovementData = {
            'token': $scope.$root.token,
            'id': $stateParams.id
        };


        $http
            .post(getCurrencyUrl, postViewCurrencyData)
            .then(function (res) {
                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.currency = res.data.response;
                    $scope.currency.exchange_rate = parseFloat(1/$scope.currency.conversion_rate).toFixed(5);
                    
                    angular.forEach($rootScope.ref_currency_list, function (obj) {
                        if (obj.id == res.data.response.ref_currency_id)
                            $scope.currency.currency = obj;
                    });

                    angular.forEach($rootScope.arr_status, function (obj) {
                        if (obj.value == res.data.response.status)
                            $scope.currency.c_status = obj;
                    });
                }
            });

        /* $http
            .post(get_currency_movement_Url, postViewCurrencymovementData)
            .then(function (res) {
                $scope.currency.realised_movement_gl_ac_code = res.data.response.realised_movement_gl_ac_code;
                $scope.currency.unrealised_movement_gl_ac_code = res.data.response.unrealised_movement_gl_ac_code;
            }); */

        /* var postData = {};
        postData.token = $scope.$root.token;
        var postUrl = $scope.$root.gl + "chart-accounts/get-currency-movements";
        $http
            .post(postUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.currency_movement = res.data.response[0];
                    $scope.currency_movement.realised_gain_gl_display_name = $scope.currency_movement.realised_gain_gl_code + ' - ' + $scope.currency_movement.realised_gain_gl_name;
                    $scope.currency_movement.realised_loss_gl_display_name = $scope.currency_movement.realised_loss_gl_code + ' - ' + $scope.currency_movement.realised_loss_gl_name;
                    $scope.currency_movement.unrealised_gain_gl_display_name = $scope.currency_movement.unrealised_gain_gl_code + ' - ' + $scope.currency_movement.unrealised_gain_gl_name;
                    $scope.currency_movement.unrealised_loss_gl_display_name = $scope.currency_movement.unrealised_loss_gl_code + ' - ' + $scope.currency_movement.unrealised_loss_gl_name;

                }
                else
                    toaster.pop('error', 'Add', 'Currency movement not found!');
            }); */
    }

    $scope.showEditCurrencyForm = function (id) {
        $scope.check_currency_readonly = false;
    }

    var delCurrencyUrl = $scope.$root.setup + "general/delete-currency";
    $scope.deleteCurrency = function (currency_id, index, currencyData) {
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delCurrencyUrl, { 'token': $scope.$root.token, 'id': currency_id })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        currencyData.splice(index, 1);
                    }
                    else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };


    $scope.showCurrencyFrom = function () {
        $scope.currency = {};
        $scope.check_currency_readonly = false;
        $scope.showCurrencyForm = true;
        $scope.showCurrencyListing = false;
        $scope.starteDate = function (startDate) {
            var newdate = startDate;
            $scope.newD = $scope.newD ? null : newdate;
            $scope.starteDate = false;
        }

        /* var get_currency_movement_Url = $scope.$root.setup + "general/get-foreign-currency-movement-by-company-id";

        var postViewCurrencymovementData = {
            'token': $scope.$root.token,
            'id': $stateParams.id
        };



            $http
                .post(get_currency_movement_Url, postViewCurrencymovementData)
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.currency.realised_movement_gl_ac_code = res.data.response.realised_movement_gl_ac_code;
                        $scope.currency.unrealised_movement_gl_ac_code = res.data.response.unrealised_movement_gl_ac_code;
                    }
                });

        /* var postData = {};
        postData.token = $scope.$root.token;
        var postUrl = $scope.$root.gl + "chart-accounts/get-currency-movements";
        $http
            .post(postUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.currency_movement = res.data.response[0];
                    $scope.currency_movement.realised_gain_gl_display_name = $scope.currency_movement.realised_gain_gl_code + ' - ' + $scope.currency_movement.realised_gain_gl_name;
                    $scope.currency_movement.realised_loss_gl_display_name = $scope.currency_movement.realised_gain_gl_code + ' - ' + $scope.currency_movement.realised_loss_gl_name;
                    $scope.currency_movement.unrealised_gain_gl_display_name = $scope.currency_movement.unrealised_gain_gl_code + ' - ' + $scope.currency_movement.unrealised_gain_gl_name;
                    $scope.currency_movement.unrealised_loss_gl_display_name = $scope.currency_movement.unrealised_loss_gl_code + ' - ' + $scope.currency_movement.unrealised_loss_gl_name;

                }
                else
                    toaster.pop('error', 'Add', 'Currency movement not found!');
            }); */

    }

    $scope.showCurrencyListing = function () {
        $scope.showCurrencyForm = false;
        $scope.showCurrencyListing = true;
    }

    $scope.showCurrencyViewForm = function (id) {
        $scope.showCurrencyForm = true;
        $scope.showCurrencyListing = false;
        $scope.check_currency_readonly = true;
        $scope.showConvRateForm = false;
    }

    $scope.showCurrencyEditForm = function (id) {
        $scope.check_currency_readonly = false;
        if (id != undefined)
            $scope.showViewCurrencyForm(id, 'edit');
    }

    //--------------------------------------------------------*
    //------------------ SET CURRENCY CONVERSION RATE---------*
    //--------------------------------------------------------*


    var getConvRateUrl = $scope.$root.setup + "general/get-conversion-rate";
    var setConvUrl = $scope.$root.setup + "general/update-conversion-rate";
    $scope.rate = {};


    /************** Calendar *********************
     $scope.starteDate = function(startDate){
     var newdate = startDate;
     $scope.newD = $scope.newD ? null : newdate;
     $scope.starteDate= false;
     }
     $scope.datePicker = (function () {
     var method = {};
     method.instances = [];
     $scope.toggleMin = function() {
     $scope.minDate = $scope.minDate ? null : new Date();
     };
     $scope.toggleMin();
     
     method.open = function ($event, instance) {
     $event.preventDefault();
     $event.stopPropagation();
     
     method.instances[instance] = true;
     };
     
     method.options = {
     'show-weeks': false,
     startingDay: 0
     };
     
     method.format = $rootScope.dateFormats[$rootScope.date_format];
     
     return method;
     }());
     /******************************************/

    $scope.conversionRate = function (curr_id) {
        $scope.showCurrencyForm = false;
        $scope.showCurrencyListing = false;
        $scope.showConvRateForm = true;
        $scope.showLoader = true;

        $scope.rate.currency_id = curr_id;

        $http
            .post(getConvRateUrl, { 'token': $scope.$root.token, 'id': curr_id })
            .then(function (res) {
                if (res.data.response !== null) {
                    $scope.rate = res.data.response;
                    $scope.rate.update_id = res.data.response.id;

                    angular.forEach($rootScope.arr_status, function (obj) {
                        if (obj.value == res.data.response.status)
                            $scope.rate.c_status = obj;
                    });
                }
                else
                    $scope.rate.update_id = 0;
                $scope.showLoader = false;
            });
    }

    $scope.setConversionRate = function (rate) {
        if (rate.conversion_rate == 0) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(319, ['Value', '0']));
            return false;
        }
        rate.token = $scope.$root.token;
        rate.status = $scope.rate.c_status !== undefined ? $scope.rate.c_status.value : 0;
        rate.emp_id = $scope.$root.userId;

        $http
            .post(setConvUrl, rate)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));
                    $timeout(function () {
                        $scope.showCurrencyViewForm(rate.currency_id);
                    }, 3000);
                }
                else {
                    toaster.pop('success', 'Info', 'Record Updated Successfully');
                    $timeout(function () {
                        $scope.showCurrencyViewForm(rate.currency_id);
                    }, 3000);
                }

            });
    }

    //Currency Conversion Rate History
    var historyUrl = $scope.$root.setup + "general/conversion-rate-history";
    $scope.histData = {};
    $scope.title = "Currency Exchange Rate History";
    $scope.currencyConvRateHistory = function (curr_id) {
        $http
            .post(historyUrl, { 'token': $scope.$root.token, 'id': curr_id })
            .then(function (res) {

                angular.forEach(res.data.response, function (val) {
                    if(val && val.conversion_rate)
                        val.exchangeRate = 1/val.conversion_rate;                          
                });

                $scope.histData = res.data.response;
            });
        ngDialog.openConfirm({
            template: 'historyDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
        })

    };

    $scope.updateExchangeRate = function (exchageRate,type) {

        if(exchageRate){

            if(type == 1){
                $scope.currency.conversion_rate = parseFloat(1/exchageRate).toFixed(5);
            }
            else{
                $scope.currency.exchange_rate = parseFloat(1/exchageRate).toFixed(5);
            }       
        }
        else{
            if(type == 1){
                $scope.currency.conversion_rate = '';
            }
            else{
                $scope.currency.exchange_rate = '';
            }
        }
    }

    $scope.addNewCurrencyPopup = function () {
        return;

        if ($scope.$root.company_id == 0) {
            toaster.pop('warning', 'Info', "Please add company first");
            return false;
        }

        var id = $scope.general.currency != undefined ? $scope.general.currency.id : 0;
        var bank_id = $scope.bank.currency != undefined ? $scope.bank.currency.id : 0;

        if (id > 0 || bank_id > 0)
            return false;

        $scope.currency = {};
        ngDialog.openConfirm({
            template: 'app/views/company/add_new_currency.html',
            className: 'ngdialog-theme-default-custom-large',
            scope: $scope
        }).then(function (currency) {
            var addCurrencyUrl = $scope.$root.setup + "general/add-currency";
            currency.name = $scope.currency.currency.name;
            currency.code = $scope.currency.currency.code;
            currency.ref_currency_id = $scope.currency.currency.id;

            currency.token = $scope.$root.token;
            currency.company_id = $stateParams.id;
            currency.status = $scope.currency.c_status !== undefined ? $scope.currency.c_status.value : 0;

            $http
                .post(addCurrencyUrl, currency)
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', res.data.msg);
                        var currencyUrl = $scope.$root.setup + "general/currency-list";
                        $http
                            .post(currencyUrl, { 'company_id': $stateParams.id, 'token': $scope.$root.token })
                            .then(function (res1) {
                                if (res1.data.ack == true) {
                                    $rootScope.arr_currency = res1.data.response;
                                    //$scope.currencies.push({ 'id': '-1', 'name': '++ Add New ++' });

                                    angular.forEach($rootScope.arr_currency, function (elem) {
                                        if (elem.id == res.data.id) {
                                            if (id > 0)
                                                $scope.general.currency = elem;
                                            if (bank_id > 0)
                                                $scope.bank.currency = elem;
                                        }
                                    });

                                    if (id > 0)
                                        toaster.pop('warning', 'Info', "Please resubmit form to add curreny");
                                }

                            });
                    }
                    else if (res.data.ack == false) {
                        toaster.pop('warning', 'Info', res.data.msg);
                    }
                    else
                        toaster.pop('warning', 'Info', res.data.msg);

                });

        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }
    $scope.$root.load_date_picker('Financial Settings');

}


function CompanyEditController($timeout, $scope, $stateParams, $http, $state, toaster, $rootScope, ngDialog, Calendar) {
    $scope.datePicker = {};
    $scope.datePicker = Calendar.get_caledar();
    $scope.showLoader = true;
    $scope.showBankListing = true;
    $scope.check_readonly = false;
    $scope.btnCancelUrl = 'app.company';
    $scope.formTitle = 'Company';

    $scope.company_url = 'app.viewCompany({id:' + $stateParams.id + '})';

    /*$scope.formUrl = function() {
     return "app/views/company/_form.html";
     }*/


    // ------------------------------------------------
    //			Code for General Tab		
    //-------------------------------------------------

    $scope.fnDatePicker = function () {

        $scope.datePicker = {};

        /************** Calendar *********************/
        $scope.starteDate = function (startDate) {
            var newdate = startDate;
            $scope.newD = $scope.newD ? null : newdate;
            $scope.starteDate = false;
        }


        $scope.datePicker = (function () {

            var method = {};
            method.instances = [];
            $scope.toggleMin = function () {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();

            method.open = function ($event, instance) {
                $event.preventDefault();
                $event.stopPropagation();
                //angular.element('.dropdown-menu').hide();
                var old_instance = $rootScope.$storage.getItem('old_instance');
                if (old_instance != null)
                    method.instances[old_instance] = false;

                method.instances[instance] = true;
                $rootScope.$storage.setItem('old_instance', instance);
            };

            method.options = {
                'show-weeks': false,
                startingDay: 0
            };

            method.format = $rootScope.dateFormats[$rootScope.date_format];

            return method;
        }());
        /******************************************/


    }

    // $rootScope.arr_currency = [];
    // $rootScope.get_currency_list();

    $scope.general = {};
    $scope.country = {};
    $scope.timeFarmat = 0;
    $scope.dateFarmat = 0;
    $scope.currencies = [];
    angular.copy($rootScope.arr_currency, $scope.currencies);
    var postUrl1 = $rootScope.setup + "general/currencies";
    var postData1 = {
        'token': $rootScope.token,
        'all': '1',
        'column': 'company_id',
        'value': $stateParams.id
    };

    // var countryUrl = $scope.$root.setup + "general/countries";
    var getCompUrl = $scope.$root.setup + "general/get-company";
    var updateUrl = $scope.$root.setup + "general/update-company";

    $scope.arr_vat_scheme = [];
    // angular.copy($rootScope.arr_vat, $scope.arr_vat_scheme);
    $scope.arr_vat_scheme = [{ 'id': 1, 'name': 'Standard' }, { 'id': 2, 'name': 'No VAT' }];



    //------- countries Global Data-------------------------

    $scope.countries = [];
    angular.copy($rootScope.country_type_arr, $scope.countries);

    var postData = {
        'token': $scope.$root.token,
        'id': $stateParams.id
    };

    $scope.mailFormData = {};
    $scope.getMailConfigurations = function () {

        $scope.showLoader = true;
        $scope.mailstotal = 0;
        $scope.mailFormData.id = "";
        $scope.mailFormData.username = "";
        $scope.mailFormData.password = "";
        angular.element('#cpassword').val('');
        $scope.mailFormData.imapServer = "";
        $scope.mailFormData.imapPort = "";
        $scope.mailFormData.imapSSL = "";
        $scope.mailFormData.imapSPA = "";
        $scope.mailFormData.pop3Server = "";
        $scope.mailFormData.pop3Port = "";
        $scope.mailFormData.pop3SSL = "";
        $scope.mailFormData.pop3SPA = "";
        $scope.mailFormData.smtpServer = "";
        $scope.mailFormData.smtpPort = "";
        $scope.mailFormData.smtpSSL = "";
        $scope.mailFormData.smtpSPA = "";
        $scope.mailFormData.smtpAuth = "";
        $scope.mailFormData.alias = "";

        // $scope.$root.breadcrumbs =
        //     [////{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
        //         { 'name': 'Account Setting', 'url': '#', 'isActive': false },
        //         { 'name': $scope.$root.model_code, 'url': '#', 'isActive': false },
        //        ];


        var employee_id = $stateParams.id;

        $scope.showLoader = true;
        $scope.showmaillist = true;
        $scope.showmailform = false;
        $scope.showvirtuallist = true;
        $scope.showvirtualform = false;


        var postData = {};

        var postUrl = $rootScope.com + "mail/configurations";
        postData = {
            'employee_id': employee_id, 'token': $rootScope.token
        };

        $http.post(postUrl, postData).then(function (res) {


            $scope.mailstotal = res.data.total;
            $scope.mails = [];
            if (res.data.response != null) {
                $scope.mails = res.data.response;
            }

            $scope.showLoader = false;
        });
    };

    $scope.addmailFlag = true;
    $scope.editmailFlag = false;

    $scope.clearConfigForm = function () {
        $scope.mailFormData = {};
        $scope.editMailReadonly = false;
        $scope.getMailConfigurations();
    }

    $scope.submitMail = function () {

        if ($scope.mailFormData.mailDomain == undefined || $scope.mailFormData.mailDomain.trim() == "") {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Domain']));
            return;
        }


        if ($scope.mailFormData.imapport && $scope.mailFormData.imapport.toString().indexOf(".") > -1) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(644, ['IMAP Port']));
            return;
        }

        if ($scope.mailFormData.pop3port && $scope.mailFormData.pop3port.toString().indexOf(".") > -1) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(644, ['POP3 Port']));
            return;
        }
        if ($scope.mailFormData.smtpport && $scope.mailFormData.smtpport.toString().indexOf(".") > -1) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(644, ['SMTP Port']));
            return;
        }
        $scope.showLoader = true;
        // $scope.formData.employee_id = $stateParams.id;
        /* if ($scope.mailFormData.password != angular.element('#cpassword').val()) {
            toaster.pop('error', 'Not Added', 'Confirm password doesn\'t match');
            return;
        } */
        var clientPath = "";
        if ($scope.mailFormData.id) {
            clientPath = $rootScope.com + 'mail/updateclientconfiguration';
        } else {
            clientPath = $rootScope.com + 'mail/addclientconfiguration';
        }
        $scope.mailFormData.token = $rootScope.token;
        $http.post(clientPath, $scope.mailFormData).then(function (result) {
            if (result.data.ack) {

                if ($scope.mailFormData.id != "") {
                    toaster.pop('success', 'Updated', $scope.$root.getErrorMessageByCode(102));
                } else {
                    toaster.pop('success', 'Added', 'Record added.');
                }
                $scope.getMailConfigurations();
                $scope.getDomains();
                $scope.clearConfigForm();
                $('#mail_form').modal('hide');
            } else {

                if (result.data.duplicateCheck) {
                    toaster.pop('error', 'Info', 'Domain already exists!');
                }
                else {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));
                    $('#mail_form').modal('hide');
                }
                // if ($scope.mailFormData.id != "") {
                //     toaster.pop('error', 'Updated', result.data.errorMessage);
                // } else {
                //     toaster.pop('error', 'Added', result.data.errorMessage);
                // }
            }
            $scope.showLoader = false;
        });

    };

    $scope.enableEditMailForm = function () {
        $scope.editMailReadonly = false;
    };

    $scope.addmail = function () {

        $scope.formData.employee_id = $stateParams.id;
        if ($scope.mailFormData.password != angular.element('#cpassword').val()) {
            toaster.pop('error', 'Not Added', $scope.$root.getErrorMessageByCode(376));
            return;
        }
        var clientData = {
            username: $scope.mailFormData.username,
            password: $scope.mailFormData.password,
            pop3server: $scope.mailFormData.pop3Server,
            pop3port: $scope.mailFormData.pop3Port,
            pop3ssl: $scope.mailFormData.pop3SSL,
            pop3spa: $scope.mailFormData.pop3SPA,
            imapserver: $scope.mailFormData.imapServer,
            imapport: $scope.mailFormData.imapPort,
            imapssl: $scope.mailFormData.imapSSL,
            imapspa: $scope.mailFormData.imapSPA,
            smtpserver: $scope.mailFormData.smtpServer,
            smtpport: $scope.mailFormData.smtpPort,
            smtpssl: $scope.mailFormData.smtpSSL,
            smtpspa: $scope.mailFormData.smtpSPA,
            smtpauth: $scope.mailFormData.smtpAuth,
            alias: $scope.mailFormData.alias,
            token: $rootScope.token
        };
        var clientPath = $rootScope.com + 'mail/addclientconfiguration';
        $http.post(clientPath, clientData).then(function (result) {
            if (!result.data.isError) {
                toaster.pop('success', 'Added', 'Record added.');
                $scope.getMailConfigurations();
            }
        });

    };

    $scope.updatemail = function () {

        $scope.formData.employee_id = $stateParams.id;

        var clientData = {
            id: $scope.mailFormData.id,
            domain: $scope.mailFormData.mailDomain,
            username: $scope.mailFormData.username,
            password: $scope.mailFormData.password,
            pop3server: $scope.mailFormData.pop3Server,
            pop3port: $scope.mailFormData.pop3Port,
            pop3ssl: $scope.mailFormData.pop3SSL,
            pop3spa: $scope.mailFormData.pop3SPA,
            imapserver: $scope.mailFormData.imapServer,
            imapport: $scope.mailFormData.imapPort,
            imapssl: $scope.mailFormData.imapSSL,
            imapspa: $scope.mailFormData.imapSPA,
            smtpserver: $scope.mailFormData.smtpServer,
            smtpport: $scope.mailFormData.smtpPort,
            smtpssl: $scope.mailFormData.smtpSSL,
            smtpspa: $scope.mailFormData.smtpSPA,
            smtpauth: $scope.mailFormData.smtpAuth,
            alias: $scope.mailFormData.alias,
            token: $rootScope.token
        };
        var clientPath = $rootScope.com + 'mail/updateclientconfiguration';
        $http.post(clientPath, clientData).then(function (result) {
            if (!result.data.isError) {
                toaster.pop('success', 'Updated', $scope.$root.getErrorMessageByCode(102));
                $scope.getMailConfigurations();
            }
        });

    };

    $scope.getDomains = function () {
        $scope.showLoader = true;
        var getDomainsAPI = $rootScope.com + 'mail/getDomains';
        var $httpPromise = $http
            .post(getDomainsAPI, { 'token': $scope.$root.token })
            .then(function (res) {
                $scope.showLoader = false;

                if (res.data) {
                    $scope.domainList = res.data.response;

                }
            });
        return $httpPromise;
    }

    $scope.virtualEmailData = {};

    $scope.editVirtualEmail = function () {
        $scope.virtualEmailReadonly = false;
    }


    $scope.getDomainById = function (id) {
        var domainName = "";
        // if ($scope.domainList == undefined) {
        //     $scope.getDomains().then(function () {
        //         angular.forEach($scope.domainList, function (obj) {
        //             if (obj.id == id) {
        //                 domainName = obj.mailDomain;
        //                 return false;
        //             }
        //         });
        //         return domainName;
        //     })
        // }
        // else {
            angular.forEach($scope.domainList, function (obj) {
                if (obj.id == id) {
                    domainName = obj.mailDomain;
                    return false;
                }
            });
            return domainName;
        // }


    }
    $scope.virtualEmails = [];
    $scope.getVirtualEmails = function () {
        $scope.EmployeeSelectAllowedCols = [
            "Employee No.", "name", "Department", "job_title", "Email"
        ]
        $scope.showLoader = true;
        $scope.virtualEmails.length = 0;
        var getVirtualEmailsAPI = $rootScope.com + 'mail/getVirtualEmails';
        $http
            .post(getVirtualEmailsAPI, { 'token': $scope.$root.token })
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack) {
                    if (res.data.response.length && res.data.response[0].length != 0){
                        $scope.virtualEmails = res.data.response;
                    }
                    $scope.allEmployees = res.data.allEmployees.response;
                }
            });
    }

    $scope.clearVirtualEmailForm = function () {
        $scope.virtualEmailData = {};
        $scope.virtualEmailReadonly = false;
        angular.element('#confirmVirtualPassword').val("");
    }

    $scope.addVirtualEmail = function (virtualEmailData) {

        if (virtualEmailData.alias == undefined || virtualEmailData.alias.trim() == '') {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Alias']));
            return;
        }
        if (virtualEmailData.username == undefined || virtualEmailData.username.trim() == '') {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Username']));
            return;
        }
        // if (virtualEmailData.mailDomain == undefined) {
        //     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Domain']));
        //     return;
        // }
        // if (virtualEmailData.password == undefined || virtualEmailData.password.trim() == '') {
        //     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Password']));
        //     return;
        // }

        // if (virtualEmailData.password != angular.element('#confirmVirtualPassword').val()) {
        //     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(376));
        //     return;
        // }
        $scope.showLoader = true;
        // console.table(virtualEmailData);
        var addVirtualEmailAPI = $rootScope.com + 'mail/addVirtualEmail';
        $http
            .post(addVirtualEmailAPI, { 'token': $scope.$root.token, data: virtualEmailData })
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack) {
                    $scope.clearVirtualEmailForm();
                    $('#virtual_form').modal('hide');
                    $scope.getVirtualEmails();
                }
                else {
                    if (res.data.duplicate) {
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(377));
                    }
                }
            });
    }


    $scope.showmailEditForm = function (obj) {
        $scope.showLoader = true;
        $scope.editMailReadonly = true;
        $scope.mailFormData = angular.copy(obj);
        // angular.forEach($scope.mails, function (obj) {
        //     if (obj.id == id) {
        //         $scope.mailFormData = obj;
        //         return false;
        //     }
        // });

        $scope.showLoader = false;

    };

    $scope.showVirtualMailEditForm = function (obj) {
        $scope.virtualEmailData = angular.copy(obj);
        $scope.showLoader = true;
        $scope.virtualEmailReadonly = true;

        angular.forEach($scope.domainList, function (obj) {
            if (obj.id == $scope.virtualEmailData.configurationId) {
                $scope.virtualEmailData.mailDomain = obj;
                return false;
            }
        });

        $scope.showLoader = false;

    };

    $scope.deleteVirtualMail = function (virtualEmailData) {

        // if primary, return;

        var del_expUrl = $rootScope.com + "mail/deleteVirtualMail";

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $scope.showLoader = true;
            $http
                .post(del_expUrl, { id: virtualEmailData.id, 'token': $scope.$root.token })
                .then(function (res) {
                    $scope.showLoader = false;
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        $scope.virtualEmailData = {};
                        angular.element('#confirmVirtualPassword').val("");
                        $scope.virtualEmailReadonly = false;
                        angular.element('#virtual_form').modal('hide');
                        $scope.getVirtualEmails();

                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }

                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

    $scope.deleteMailConfig = function (mailFormData) {
        $scope.showLoader = false;

        // if primary, return;
        if (mailFormData.primaryConfiguration != "0") {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(378, ['Primary configuration']));
            return;
        }
        var del_expUrl = $rootScope.com + "mail/deletemail";

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(del_expUrl, { id: mailFormData.id, 'token': $scope.$root.token })
                .then(function (res) {
                    $scope.showLoader = false;

                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        $scope.mailFormData = {};
                        angular.element('#mail_form').modal('hide');
                        $scope.editMailReadonly = false;
                        $scope.getMailConfigurations();
                        $scope.getDomains();

                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

    $scope.mailVirtualForm = function () {
        $scope.showvirtualform = true;
        $scope.showvirtuallist = false;
    }
    $scope.mailVirtualList = function () {
        $scope.showvirtualform = false;
        $scope.showvirtuallist = true;
    }
    $scope.mailForm = function () {

        //        $scope.expense_status_list = [{'name': 'Pending', 'id': 1}, {'name': 'Approved', 'id': 2}
        //            , {'name': 'Awaiting to be approved', 'id'showEditForm: 3}, {'name': 'Declined', 'id': 4}];

        $scope.mailFormData.id = "";
        $scope.mailFormData.username = "";
        $scope.mailFormData.password = "";
        $scope.mailFormData.imapServer = "";
        $scope.mailFormData.imapPort = "";
        $scope.mailFormData.imapSSL = "";
        $scope.mailFormData.imapSPA = "";
        $scope.mailFormData.pop3Server = "";
        $scope.mailFormData.pop3Port = "";
        $scope.mailFormData.pop3SSL = "";
        $scope.mailFormData.pop3SPA = "";
        $scope.mailFormData.smtpServer = "";
        $scope.mailFormData.smtpPort = "";
        $scope.mailFormData.smtpSSL = "";
        $scope.mailFormData.smtpSPA = "";
        $scope.mailFormData.smtpAuth = "";
        $scope.mailFormData.alias = "";
        $scope.addmailFlag = true;
        $scope.editmailFlag = false;

        $scope.showmaillist = false;
        $scope.showmailform = true;


        //        $("#expense_id").val('');
        //        $scope.expense_id = '';
        //
        //        $scope.formData.event_name = '';
        //        $scope.formData.event_code = '';
        //        $scope.formData.event_code = '';
        //        $scope.formData.event_description = '';
        //        $("#event_date").val('');
        //        $("#event_name").val('');
        //        $("#event_code").val('');
        //        $("#event_description").val('');

    }

    $scope.currencyActive = false;
    if ($stateParams.tab != undefined && $stateParams.tab == 'currencies') {
        var getCompCurrencyUrl = $scope.$root.setup + "general/get-company-currency";

        $http
            .post(getCompCurrencyUrl, postData1)
            .then(function (res) {

                $scope.showLoader = false;
                if (res.data.ack == true) {

                    $scope.company_url = 'app.viewCompany({id:' + $stateParams.id + '})';
                    $scope.currencyActive = true;

                    $scope.general = res.data.response;
                    $scope.defaultReadonly = true;
                    $rootScope.country_id = res.data.response.country_id;
                    $rootScope.currency_id = res.data.response.currency_id;
                    $scope.$root.bctext = res.data.response.name;


                    $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
                    { 'name': 'General', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
                    // { 'name': 'Company', 'url': 'app.company', 'isActive': false },
                    { 'name': $scope.$root.bctext, 'url': '#', 'isActive': false }];

                    $scope.dateFarmat = res.data.response.date_format;
                    $scope.timeFarmat = res.data.response.time_format;

                    angular.forEach($scope.countries, function (obj) {
                        if (obj.id == res.data.response.country_id) {
                            $scope.general.country = obj;
                        }
                    });

                    if (res.data.response.currency_id > 0)
                        $scope.disable_currency = 1;

                    angular.forEach($scope.currencies, function (obj) {
                        if (obj.id == res.data.response.currency_id) {
                            $scope.general.currency = obj;
                        }
                    });

                    angular.forEach($rootScope.timezones, function (obj) {
                        if (obj.id == res.data.response.timezone) {
                            $scope.general.timezonee = obj;
                        }
                    });

                    // angular.element('.general_information').removeClass('active');
                    // angular.element('.currencies').addClass('active');
                    $scope.showCurrencyListing = true;
                    $scope.showCurrencyForm = false;
                    $scope.showConvRateForm = false;
                    $scope.currencyData = [];
                    $scope.columns = [];

                    angular.forEach(res.data.response.currencies, function (val) {
                        if(val && val.exchange_rate)
                            val.actualExchangeRate = parseFloat(1/val.exchange_rate).toFixed(5);
                        
                        val.invertedExchangeRate = parseFloat(val.exchange_rate).toFixed(5);                        
                    }); 

                    $scope.currencyData = res.data.response.currencies;
                    
                    angular.forEach($scope.currencyData[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });                   
                }
            });

    } else {
        $http
            .post(postUrl1, postData1)
            .then(function (res) {

                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.currencies = res.data.response;
                    $scope.showLoader = true;
                    $http
                        .post(getCompUrl, postData)
                        .then(function (res) {
                            $scope.showLoader = false;
                            if (res.data.ack == true) {
                                $scope.general = res.data.response;

                                $scope.defaultReadonly = true;

                                // $scope.general.decimal_range = 2;
                                // $scope.general.num_user_login = 10;

                                // general.date_format = $scope.dateFarmat;
                                // general.time_format = $scope.timeFarmat;
                                // $scope.general.date_format = 3;
                                // $scope.general.time_format = 1;
                                // $rootScope.timeFarmat = 1;
                                // $rootScope.date_format = 3;

                                $rootScope.country_id = res.data.response.country_id;
                                $rootScope.currency_id = res.data.response.currency_id;
                                // $rootScope.date_format = res.data.response.date_format;
                                $scope.$root.bctext = res.data.response.name;

                                $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
                                { 'name': 'General', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
                                // { 'name': 'Company', 'url': 'app.company', 'isActive': false },
                                { 'name': res.data.response.name, 'url': '#', 'isActive': false }];

                                // $rootScope.timeFarmat = res.data.response.time_format;
                                // $scope.dateFarmat = res.data.response.date_format;

                                $scope.dateFarmat = res.data.response.date_format;
                                $scope.timeFarmat = res.data.response.time_format;

                                angular.forEach($scope.countries, function (obj) {
                                    if (obj.id == res.data.response.country_id) {
                                        $scope.general.country = obj;
                                    }
                                });
                                // if($scope.currencies.length == 0)
                                //     angular.copy($rootScope.arr_currency, $scope.currencies);

                                if (res.data.response.currency_id > 0)
                                    $scope.disable_currency = 1;

                                angular.forEach($scope.currencies, function (obj) {
                                    if (obj.id == res.data.response.currency_id) {
                                        $scope.general.currency = obj;
                                    }
                                });

                                angular.forEach($rootScope.timezones, function (obj) {
                                    if (obj.id == res.data.response.timezone) {
                                        $scope.general.timezonee = obj;
                                    }
                                });

                                /* $timeout(function () {
                                    //open Direct currency Tab
                                    $scope.company_url = 'app.viewCompany({id:' + $stateParams.id + '})';

                                    angular.element('.currencies').removeClass('dont-click');

                                    // console.log($stateParams.tab);
                                    if ($stateParams.tab != undefined && $stateParams.tab == 'currencies')
                                        angular.element('.currencies a').click();
                                }, 100); */
                            }
                        });
                    $scope.fnDatePicker();
                }
            });

    }





    $scope.defaultReadonly = true;

    $scope.general.decimal_range = 2;
    $scope.general.num_user_login = 10;
    $scope.general.date_format = 3;
    $rootScope.date_format = 3;
    $scope.general.time_format = 1;
    $rootScope.timeFarmat = 1;


    $scope.searchKeyword_sup_gl_code = {};
    $scope.getGLcode = function (item_paging) {
        // console.log("here");
        var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";

        $scope.postData = {};
        $scope.postData.cat_id = [];
        $scope.postData.cat_id = [3];

        $scope.Serachkeyword = {};

        $scope.postData.token = $scope.$root.token;

        if (item_paging == 1)
            $rootScope.item_paging.spage = 1;
        $scope.postData.page = $rootScope.item_paging.spage;

        $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;
        // $scope.postData.pagination_limits = 25;

        $scope.postData.searchKeyword = "";
        $scope.postData.searchKeyword = $scope.searchKeyword_sup_gl_code.$;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
            $scope.record_data = {};
        }

        $scope.showLoader = true;

        $http
            .post(postUrl_cat, $scope.postData)
            .then(function (res) {
                //console.log(res);
                $scope.column_gl = [];
                $scope.record_gl = {};
                $scope.gl_account = [];
                $scope.showLoader = false;

                if (res.data.ack == true) {  // $scope.category_list = res.data.response;

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.record = res.data.response;
                    $scope.record_data = res.data.response;

                    $scope.category_list = res.data.response;

                    $scope.record_gl = res.data.response_account;

                    $.each(res.data.response, function (index, obj) {
                        $scope.gl_account[index] = obj;
                    });
        
                    angular.element('#gl_account_popup').modal({ show: true });
                }
                else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });
    };

    $scope.assignCodes = function (gl_data) {
        $scope.bank.gl_id = gl_data.id;
        $scope.bank.gl_name = gl_data.name;
        $scope.bank.gl_posting = gl_data.code;//gl_data.name + " " +
        $scope.bank.gl_posting_display = gl_data.code + " - " + gl_data.name;
        angular.element('#gl_account_popup').modal('hide');
    }


    $scope.setDefaultTime = function (val) {
        $scope.timeFarmat = val;
    }
    $scope.setDefaultDate = function (val) {
        $scope.dateFarmat = val;
        $scope.isSetDateFormat = false;
    }

    $scope.check_readonly = true;

    $scope.gotoEdit = function () {
        $scope.check_readonly = false;
    }

    $scope.addGeneral = function (general) {
        general.token = $scope.$root.token;
        general.country_id = $scope.general.country != undefined ? $scope.general.country.id : 0;
        general.currency_id = $scope.general.currency != undefined && $scope.general.currency.id > 0 ? $scope.general.currency.id : 0;
        general.timezone = $scope.general.timezonee != undefined ? $scope.general.timezonee.id : 0;
        general.date_format = $scope.dateFarmat;
        general.time_format = $scope.timeFarmat;




        if (angular.element('#oop_cycle_edit_role').is(':checked') == true)
            $scope.general.oop_cycle_edit_role = 1;
        else
            $scope.general.oop_cycle_edit_role = 0;

        $rootScope.oop_cycle_edit_role = $scope.general.oop_cycle_edit_role;

        if (general.date_format == 0) {
            $scope.isSetDateFormat = true;
            return false;
        }
        else
            $scope.isSetDateFormat = false;

        $http
            .post(updateUrl, general)
            .then(function (res) {
                if (res.data.ack == true) {

                    $scope.$root.opp_cycle_limit = general.opp_cycle_limit;
                    $scope.$root.date_format = general.date_format;
                    $scope.$root.currency_id = general.currency_id;
                    $scope.$root.country_id = general.country_id;
                    $scope.$root.company_name = general.name;
                    //console.log($scope.$root.company_name);

                    if ($rootScope.defaultCompany == res.data.id) {
                        $rootScope.$storage.setItem("country_id", general.country_id);
                        $rootScope.$storage.setItem("currency_id", general.currency_id);
                        $rootScope.$storage.setItem("date_format", general.date_format);
                        $rootScope.$storage.setItem("time_format", general.time_format);
                        $rootScope.$storage.setItem("timezone", general.timezone);
                        $rootScope.$storage.setItem("company_name", general.name);

                        $rootScope.defaultCountry = $rootScope.$storage.getItem("country_id");
                        $rootScope.defaultCurrency = $rootScope.$storage.getItem("currency_id");
                        $rootScope.defaultDateFormat = $rootScope.$storage.getItem("date_format");
                        $rootScope.defaultTimeFormat = $rootScope.$storage.getItem("time_format");
                        $rootScope.defaultTimeZone = $rootScope.$storage.getItem("timezone");
                        $rootScope.company_name = $rootScope.$storage.getItem("company_name");
                    }
                    $scope.check_readonly = true;

                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $scope.fnDatePicker();
                } else if (res.data.ack == 2) {
                    $scope.check_readonly = true;
                    toaster.pop('success', 'Info', res.data.error);
                } else {
                    toaster.pop('error', 'success', res.data.error);
                }
                /* if($rootScope.uploaded_logo != undefined && $rootScope.uploaded_logo.length > 0)
                {
                    $rootScope.defaultLogo = $rootScope.uploaded_logo;
                    $rootScope.uploaded_logo = '';
                }   */
            });
    }


    //--------------------- End General Code ------------------------------------------



    // ---------------------------------------------------------------
    //			Code for Company Addresses Tab		
    //----------------------------------------------------------------

    // Company Addresses Listings
    $scope.getCompanyAddresses = function () {

        $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
        { 'name': 'General', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
        // { 'name': 'Company', 'url': 'app.company', 'isActive': false },
        { 'name': $scope.$root.bctext, 'url': '#', 'isActive': false }];

        $scope.showLoader = true;
        $scope.showAddrListing = true;
        $scope.showAddrForm = false;
        $scope.compAddrData = {};
        $scope.columns = [];
        var postData = {};

        var vm = this;
        var Api = $scope.$root.setup + "general/company-addresses";
        postData = {
            'token': $scope.$root.token,
            'all': "1",
            'company_id': $stateParams.id
        };

        $http
            .post(Api, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.compAddrData = res.data.response;
                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    $scope.showLoader = false;
                }
                else {
                    if (res.data.no_permission) {
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(332));
                    }
                    else {
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                    }
                    $scope.showLoader = false;
                }
            });


    }


    $scope.fnAddrForm = function () {
        $scope.check_addr_readonly = false;
        $scope.comp_addresses = {};
        $scope.showAddrForm = true;
        $scope.showAddrListing = false;

        angular.forEach($scope.countries, function (obj) {
            if (obj.id == $scope.$root.country_id) {
                $scope.comp_addresses.country = obj;
            }
        });
        // $scope.getCode_cAddress();
    }
    //--------Save Company Addresses Data-------------
    $scope.comp_addresses = {};
    var addCompAddressesUrl = $scope.$root.setup + "general/add-company-address";
    $scope.addCompanyAddress = function (comp_addresses) {
        comp_addresses.country_id = $scope.comp_addresses.country !== undefined ? $scope.comp_addresses.country.id : 0;
        comp_addresses.token = $scope.$root.token;
        comp_addresses.company_id = $stateParams.id;

        if (comp_addresses.id !== undefined)
            addCompAddressesUrl = $scope.$root.setup + "general/update-company-address";

        $http
            .post(addCompAddressesUrl, comp_addresses)
            .then(function (res) {
                if (res.data.ack == true) {
                    // toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));

                    if (comp_addresses.id !== undefined)
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));
                    else
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));

                    $timeout(function () {
                        $scope.getCompanyAddresses();
                    }, 1500);

                } else if (res.data.ack == 2) {
                    toaster.pop('success', 'Info', res.data.error);
                    $timeout(function () {
                        $scope.getCompanyAddresses();
                    }, 3000);
                } else {
                    toaster.pop('error', 'Add', res.data.error);
                }
            });
    }

    //----------- view company form --------
    $scope.showViewAddrForm = function (id, parm) {
        $scope.showLoader = true;
        $scope.showAddrForm = true;
        $scope.showAddrListing = false;

        if (parm == undefined)
            $scope.check_addr_readonly = true;

        $scope.comp_addresses = {};
        var getCompAddressesUrl = $scope.$root.setup + "general/get-company-address";

        var postViewAddrData = {
            'token': $scope.$root.token,
            'id': id
        };

        $http
            .post(getCompAddressesUrl, postViewAddrData)
            .then(function (res) {
                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.comp_addresses = res.data.response;

                    angular.forEach($scope.countries, function (obj) {
                        if (obj.id == res.data.response.country_id) {
                            $scope.comp_addresses.country = obj;
                        }
                    });
                }
            });
    }

    $scope.showEditAddrForm = function (id) {
        $scope.check_addr_readonly = false;
        if (id != undefined)
            $scope.showViewAddrForm(id, 'edit');
    }

    $scope.deleteCompanyAdddress = function (id, index, compAddrData) {
        var delCompAddressesUrl = $scope.$root.setup + "general/delete-company-address";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delCompAddressesUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        compAddrData.splice(index, 1);
                    }
                    else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };
    /* $scope.getCode_cAddress = function (rec) {
        var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
        var name = $scope.$root.base64_encode('company_addresses');
        var no = $scope.$root.base64_encode('address_no');

        var module_category_id = 2;

        $http
            .post(getCodeUrl, {
                'is_increment': 1,
                'token': $scope.$root.token,
                'tb': name,
                'm_id': 9,
                'no': no,
                'category': '',
                'brand': '',
                'module_category_id': module_category_id,
                'type': '',
                'status': ''
            })
            .then(function (res) {

                if (res.data.ack == 1) {
                    $scope.showLoader = false;
                    $scope.comp_addresses.address_code = res.data.code;
                    $scope.comp_addresses.address_no = res.data.nubmer;

                    $scope.count_result++;


                    if ($scope.count_result > 0) {
                        //  console.log($scope.count_result);
                        return true;
                    } else {
                        //    console.log($scope.count_result + 'd');
                        return false;
                    }

                } else {
                    toaster.pop('error', 'info', res.data.error);
                    return false;
                }
            });


    } */
    //-------------------- Company Addresses End--------------------


    // ---------------------------------------------------------------
    //			Code for Bank Tab		
    //----------------------------------------------------------------

    // Bank Listings
    $scope.getBankAccounts = function () {

        $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
        { 'name': 'General', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
        // { 'name': 'Company', 'url': 'app.company', 'isActive': false },
        { 'name': $scope.$root.bctext, 'url': '#', 'isActive': false }];
        //$scope.company_url

        $scope.showLoader = true;
        $scope.showBankListing = true;
        $scope.showBankForm = false;
        $scope.compBankData = [];
        $scope.columns = [];

        var postData = {};

        var vm = this;
        var BankApi = $scope.$root.setup + "general/bank-accounts";
        postData = {
            'token': $scope.$root.token,
            'all': "1",
            'column': 'company_id',
            'value': $stateParams.id,
            'chkPerm': 1
        };

        $http
            .post(BankApi, postData)
            .then(function (res) {

                $scope.showLoader = false;

                if (res.data.response != null) {
                    //  $scope.bankData = res.data.record.result;
                    //  $scope.columns = res.data.columns;
                    $scope.bankData = res.data.response;

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

    function toTitleCase(str) {
        var title = str.replace('_', ' ');
        return title.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    $scope.bank = {};
    $scope.fnBankForm = function () {
        $scope.bank = {};
        $scope.showBankForm = true;
        $scope.showBankListing = false;
    }

    //--------Save Company Addresses Data-------------


    $scope.addBankAccount = function (bank) {
        

        var addBankUrl = $scope.$root.setup + "general/add-bank-account";
        bank.country_id = ($scope.bank.country !== undefined && $scope.bank.country != '') ? $scope.bank.country.id : 0;
        bank.currency_id = $scope.bank.currency !== undefined ? $scope.bank.currency.id : 0;
        bank.token = $scope.$root.token;
        bank.company_id = $stateParams.id;

        if (bank.country_id == 0) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Country']));
            return false;
        }

        // console.log(bank);
        // if (bank.id !== undefined)
        addBankUrl = $scope.$root.setup + "general/update-bank-account";

        $http
            .post(addBankUrl, bank)
            .then(function (res) {
                if (res.data.ack == true) {
                    if (res.data.info == "Update")
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));
                    else
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));

                    $timeout(function () {
                        $scope.getBankAccounts();
                    }, 3000);
                }
                else
                    toaster.pop('error', 'Add', res.data.error);
            });
    }

    //----------- view company form --------
    $scope.showViewBankForm = function (id, parm) {
        $scope.showLoader = true;
        $scope.showBankForm = true;
        $scope.showBankListing = false;

        console.log(parm);

        if (parm == undefined)
            $scope.check_bank_readonly = true;

        $scope.comp_addresses = {};

        var getBankUrl = $scope.$root.setup + "general/get-bank-account";

        var postViewBankData = {
            'token': $scope.$root.token,
            'id': id
        };

        $http
            .post(getBankUrl, postViewBankData)
            .then(function (res) {

                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.bank = res.data.response;
                    if ($scope.bank.gl_posting.length > 0)
                        $scope.bank.gl_posting_display = $scope.bank.gl_posting + " - " + $scope.bank.gl_name;

                    angular.forEach($scope.countries, function (obj) {
                        if (obj.id == res.data.response.country_id)
                            $scope.bank.country = obj;
                    });

                    angular.forEach($rootScope.arr_currency, function (obj) {
                        if (obj.id == res.data.response.currency_id)
                            $scope.bank.currency = obj;
                    });
                }
            });
    }

    $scope.showEditBankForm = function (id) {
        $scope.check_addr_readonly = false;
    }
    var delBankUrl = $scope.$root.setup + "general/delete-bank-account";

    $scope.deleteBankAccount = function (bank_id, index, bankData) {
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delBankUrl, { id: bank_id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', res.data.success);
                        // bankData.splice(index, 1);
                        $timeout(function () {
                            $scope.getBankAccounts();
                        }, 1000);
                    } else {
                        toaster.pop('error', 'Deleted', res.data.error);
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

    $scope.showBankFrom = function () {
        $scope.bank = {};
        $scope.check_bank_readonly = false;
        $scope.showBankForm = true;
        $scope.showBankListing = false;

        angular.forEach($scope.countries, function (obj) {
            if (obj.id == $rootScope.country_id)
                $scope.bank.country = obj;
        });

        angular.forEach($rootScope.arr_currency, function (obj) {
            if (obj.id == $rootScope.defaultCurrency)
                $scope.bank.currency = obj;
        });
    }

    $scope.showBankListing = function () {
        $scope.showBankForm = false;
        $scope.showBankListing = true;
    }

    $scope.showBankViewForm = function (id) {
        $scope.showBankForm = true;
        $scope.showBankListing = false;
        $scope.check_bank_readonly = true;
    }

    $scope.showBankEditForm = function (id) {
        $scope.check_bank_readonly = false;

        if (id != undefined)
            $scope.showViewBankForm(id, 'edit');
    }


    //-------------------- Bank Accounts End--------------------

    // ---------------------------------------------------------------
    //			Financial Settings Tab		
    //----------------------------------------------------------------
    $scope.finance = {};
    $scope.getFinancialSettings = function () {
        $scope.check_readonly = true;
        $scope.finance = {};

        $scope.showLoader = true;

        $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
        { 'name': 'General', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
        // { 'name': 'Company', 'url': 'app.company', 'isActive': false },
        { 'name': $scope.$root.bctext, 'url': '#', 'isActive': false }];

        var getfinanceUrl = $scope.$root.setup + "general/get-company-financial-setting";

        // $scope.get_account_by_cat_id ();  
        $http
            .post(getfinanceUrl, postData)
            .then(function (res) {

                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.finance = res.data.response;
                    // $scope.get_account_by_cat_id();

                    if (res.data.response != null) {
                        if (res.data.response.type_of_business_ownerships != 1 && res.data.response.type_of_business_ownerships != 2)
                            $scope.is_comp_reg_no = true;

                        angular.forEach($rootScope.arr_submiss_frequency, function (obj) {
                            if (res.data.response != null && obj.id == res.data.response.submission_frequency)
                                $scope.finance.submission_frequencys = obj;
                        });

                        angular.forEach($scope.arr_vat_scheme, function (obj) {
                            if (res.data.response != null && obj.id == res.data.response.vat_scheme)
                                $scope.finance.vat_schemee = obj;
                        });
                        // console.log(res.data.response.vat_scheme);

                        if (res.data.response.vat_scheme == 2) {
                            $scope.vat_freq_readonly = true;
                            $scope.finance.vat_reg_no = "";
                            $scope.finance.submission_frequencys = "";
                        }
                        else {
                            $scope.vat_freq_readonly = false;
                        }

                        angular.forEach($rootScope.arr_type_of_Business, function (obj) {
                            if (res.data.response != null && obj.id == res.data.response.type_of_business_ownership)
                                $scope.finance.type_of_business_ownerships = obj;
                        });

                        // $scope.finance.year_start_date = $scope.$root.convert_unix_date_to_angular(res.data.response.year_start_date);
                        // $scope.finance.year_end_date = $scope.$root.convert_unix_date_to_angular(res.data.response.year_end_date);
                        // $scope.finance.date_of_incorporation = $scope.$root.convert_unix_date_to_angular(res.data.response.date_of_incorporation);
                    }
                }
            });
    }
    $scope.get_account_by_cat_id = function () {
        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.postData.cat_id = [8];
        var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";
        $http
            .post(postUrl_cat, $scope.postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    // $scope.category_list = res.data.response;

                    angular.forEach(res.data.response, function (obj) {

                        if (obj.code === "2720") {
                            $scope.finance.vat_sale_gl = obj.id;
                            $scope.finance.vat_sale_gl_account = obj.code;
                        }
                        if (obj.code === '2740') {
                            $scope.finance.vat_purchase_gl = obj.id;
                            $scope.finance.vat_purchase_gl_account = obj.code;
                        }
                        if (obj.code === '2780') {
                            $scope.finance.vat_lieability_receve_gl = obj.id;
                            $scope.finance.vat_lieability_receve_gl_account = obj.code;
                        }
                    });
                }
            });
    }


    angular.forEach($rootScope.arr_submiss_frequency, function (obj) {
        if (obj.id == 2)
            $scope.finance.submission_frequencys = obj;
    });

    angular.forEach($scope.arr_vat_scheme, function (obj) {
        if (obj.id == 1)
            $scope.finance.vat_schemee = obj;
    });

    $scope.vat_freq_readonly = false;

    $scope.changes_for_vat = function () {

        var vat_id = this.finance.vat_schemee.id;


        if (vat_id == 2) {
            $scope.vat_freq_readonly = true;
            $scope.finance.vat_reg_no = "";
            $scope.finance.submission_frequencys = "";
        }
        else {
            $scope.vat_freq_readonly = false;
        }
    }

    var updatefinance = $scope.$root.setup + "general/update-financial-setting";
    $scope.is_comp_reg_no = false;


    $scope.addFinancialSetting = function (finance) {

        finance.type_of_business_ownership = finance.type_of_business_ownerships !== undefined ? finance.type_of_business_ownerships.id : 0
        finance.vat_scheme = finance.vat_schemee !== undefined ? finance.vat_schemee.id : 0;
        // console.log(finance);
        finance.submission_frequency = finance.submission_frequencys !== undefined ? finance.submission_frequencys.id : 0;

        if (angular.element('#is_whole_seller').is(':checked') == false)
            finance.is_whole_seller = false;
        else
            finance.is_whole_seller = true;

        finance.token = $scope.$root.token;

        if (finance.year_start_date != undefined && finance.year_start_date != 0) {
            var from, to, check;

            from = finance.year_start_date.split("/")[2] + "-" + finance.year_start_date.split("/")[1] + "-" + finance.year_start_date.split("/")[0];
            to = finance.year_end_date.split("/")[2] + "-" + finance.year_end_date.split("/")[1] + "-" + finance.year_end_date.split("/")[0];

            if (from != null && to != null) {

                var from1, to1;
                from1 = new Date(from.replace(/\s/g, ''));
                to1 = new Date(to.replace(/\s/g, ''));

                var fDate, lDate;
                fDate = Date.parse(from1);
                lDate = Date.parse(to1);

                if (fDate > lDate) {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(333, ['Financial Year End Date', 'Start Date']));
                    return false;
                }
            }
        }


        if (finance.year_start_date.length == 0 || finance.year_end_date == 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Start and End Year Date']));
            return false;
        }

        if (finance.type_of_business_ownership == 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Business Type']));
            return false;
        }

        if (finance.id == undefined) {
            updatefinance = $scope.$root.setup + "general/add-financial-setting";
            finance.company_id = $stateParams.id;
        }

        $http
            .post(updatefinance, finance)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $scope.check_readonly = true;
                }
                else {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $scope.check_readonly = true;
                }
            });
    }

    $scope.onChangeTypeBusOwnership = function () {
        var owner_id = this.finance.type_of_business_ownerships.id;
        if (owner_id == 1 || owner_id == 2)
            $scope.is_comp_reg_no = false;
        else
            $scope.is_comp_reg_no = true;

        $scope.owner_id = owner_id;
    }

    //---------------- Financial Settings End ------------------------

    //-----------------------------------------------------------------
    //					Currencies
    //-----------------------------------------------------------------

    $scope.getCurrencies = function () {
        $scope.company_url = 'app.viewCompany({id:' + $stateParams.id + '})';
        // console.log($scope.company_url);

        $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
        { 'name': 'General', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
        // { 'name': 'Company', 'url': 'app.company', 'isActive': false },
        { 'name': $scope.$root.bctext, 'url': '#', 'isActive': false }];

        $scope.showLoader = true;
        $scope.showCurrencyListing = true;
        $scope.showCurrencyForm = false;
        $scope.showConvRateForm = false;
        $scope.currencyData = [];
        $scope.columns = [];
        var postData = {};

        var vm = this;
        var Api = $scope.$root.setup + "general/currencies";
        postData = {
            'token': $scope.$root.token,
            'all': "1",
            'column': 'company_id',
            'value': $stateParams.id
        };

        $http
            .post(Api, postData)
            .then(function (res) {
                $scope.showLoader = false;

                if (res.data.response != null && res.data.response.length > 0) {                    

                    angular.forEach(res.data.response, function (val) {
                        if(val && val.exchange_rate)
                            val.actualExchangeRate = parseFloat(1/val.exchange_rate).toFixed(5);
                        val.invertedExchangeRate = parseFloat(val.exchange_rate).toFixed(5);                    
                    }); 
                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    $scope.currencyData = res.data.response;                    
                }
            });
    }

    $scope.fnCurrencyForm = function () {
        $scope.currency = {};
        $scope.showCurrencyForm = true;
        $scope.showCurrencyListing = false;
    }

    //--------Save Company Addresses Data-------------
    $scope.datePicker = {};

    /************** Calendar *********************/
    $scope.starteDate = function (startDate) {
        var newdate = startDate;
        $scope.newD = $scope.newD ? null : newdate;
        $scope.starteDate = false;
    }

    $scope.datePicker = (function () {
        var method = {};
        method.instances = [];
        $scope.toggleMin = function () {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        method.open = function ($event, instance) {
            $event.preventDefault();
            $event.stopPropagation();

            method.instances[instance] = true;
        };

        method.options = {
            'show-weeks': false,
            startingDay: 0
        };

        method.format = $rootScope.dateFormats[$rootScope.defaultDateFormat];

        return method;
    }());
    /******************************************/
    $scope.currency = {};

    $scope.addCurrency = function (currency) {
        var addCurrencyUrl = $scope.$root.setup + "general/add-currency";
        currency.name = $scope.currency.currency.name;
        currency.code = $scope.currency.currency.code;
        currency.ref_currency_id = $scope.currency.currency.id;

        currency.token = $scope.$root.token;
        currency.company_id = $stateParams.id;
        currency.status = $scope.currency.c_status !== undefined ? $scope.currency.c_status.value : 0;


        if (currency.id !== undefined)
            addCurrencyUrl = $scope.$root.setup + "general/update-currency";

        $http
            .post(addCurrencyUrl, currency)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', res.data.msg);
                    $scope.currency.id = res.data.id;
                    $scope.check_currency_readonly = true;
                    $rootScope.arr_currency = [];
                    $rootScope.get_currency_list();

                    // if ($rootScope.arr_currency != undefined && $rootScope.arr_currency.length > 0) return;
                    var postUrl = $rootScope.setup + "general/currency-list";
                    var postData = {
                        'token': $rootScope.token
                    };

                    $http
                        .post(postUrl, postData)
                        .then(function (res) {
                            if (res.data.ack == true) {
                                $rootScope.arr_currency = res.data.response;
                            }

                        });

                    $timeout(function () {
                        $scope.getCurrencies();
                        $scope.showCurrencyForm = false;
                        $scope.showCurrencyListing = true;
                    }, 1000);
                }
                else {
                    toaster.pop('error', 'Info', res.data.error);
                }
            });
    }

    //----------- view company form --------
    $scope.showViewCurrencyForm = function (id, parm) {
        $scope.showLoader = true;
        $scope.showCurrencyForm = true;
        $scope.showCurrencyListing = false;
        if (parm == undefined)
            $scope.check_currency_readonly = true;
        var getCurrencyUrl = $scope.$root.setup + "general/get-currency";
        var get_currency_movement_Url = $scope.$root.setup + "general/get-foreign-currency-movement-by-company-id";

        var postViewCurrencyData = {
            'token': $scope.$root.token,
            'id': id
        };

        var postViewCurrencymovementData = {
            'token': $scope.$root.token,
            'id': $stateParams.id
        };


        $http
            .post(getCurrencyUrl, postViewCurrencyData)
            .then(function (res) {
                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.currency = res.data.response;
                    $scope.currency.exchange_rate = parseFloat(1/$scope.currency.conversion_rate).toFixed(5);

                    angular.forEach($rootScope.ref_currency_list, function (obj) {
                        if (obj.id == res.data.response.ref_currency_id)
                            $scope.currency.currency = obj;
                    });

                    angular.forEach($rootScope.arr_status, function (obj) {
                        if (obj.value == res.data.response.status)
                            $scope.currency.c_status = obj;
                    });
                }
            });

        /* $http
            .post(get_currency_movement_Url, postViewCurrencymovementData)
            .then(function (res) {
                $scope.currency.realised_movement_gl_ac_code = res.data.response.realised_movement_gl_ac_code;
                $scope.currency.unrealised_movement_gl_ac_code = res.data.response.unrealised_movement_gl_ac_code;
            }); */


        // currency movements
        /* var postData = {};
        postData.token = $scope.$root.token;
        var postUrl = $scope.$root.gl + "chart-accounts/get-currency-movements";
        $http
            .post(postUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.currency_movement = res.data.response[0];
                    $scope.currency_movement.realised_gain_gl_display_name = $scope.currency_movement.realised_gain_gl_code + ' - ' + $scope.currency_movement.realised_gain_gl_name;
                    $scope.currency_movement.realised_loss_gl_display_name = $scope.currency_movement.realised_loss_gl_code + ' - ' + $scope.currency_movement.realised_loss_gl_name;
                    $scope.currency_movement.unrealised_gain_gl_display_name = $scope.currency_movement.unrealised_gain_gl_code + ' - ' + $scope.currency_movement.unrealised_gain_gl_name;
                    $scope.currency_movement.unrealised_loss_gl_display_name = $scope.currency_movement.unrealised_loss_gl_code + ' - ' + $scope.currency_movement.unrealised_loss_gl_name;

                }
                else
                    toaster.pop('error', 'Add', 'Currency movement not found!');
            }); */
    }

    $scope.showCurrencyEditForm = function (id) {
        $scope.check_currency_readonly = false;
        if (id != undefined)
            $scope.showViewCurrencyForm(id, 'edit');
    }

    var delCurrencyUrl = $scope.$root.setup + "general/delete-currency";
    $scope.deleteCurrency = function (currency_id, index, currencyData) {
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delCurrencyUrl, { 'token': $scope.$root.token, 'id': currency_id })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        currencyData.splice(index, 1);
                    }
                    else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

    $scope.setStartDate = function () {
        $scope.currency.start_date = $scope.$root.get_current_date();
    }


    $scope.showCurrencyFrom = function () {
        $scope.currency = {};
        $scope.check_currency_readonly = false;
        $scope.showCurrencyForm = true;
        $scope.showCurrencyListing = false;

        var get_currency_movement_Url = $scope.$root.setup + "general/get-foreign-currency-movement-by-company-id";

        var postViewCurrencymovementData = {
            'token': $scope.$root.token,
            'id': $stateParams.id
        };

        /*  var postData = {};
         postData.token = $scope.$root.token;
         var postUrl = $scope.$root.gl + "chart-accounts/get-currency-movements";
         $http
             .post(postUrl, postData)
             .then(function (res) {
                 if (res.data.ack == true) {
                     $scope.currency_movement = res.data.response[0];
                     $scope.currency_movement.realised_gain_gl_display_name = $scope.currency_movement.realised_gain_gl_code + ' - ' + $scope.currency_movement.realised_gain_gl_name;
                     $scope.currency_movement.realised_loss_gl_display_name = $scope.currency_movement.realised_gain_gl_code + ' - ' + $scope.currency_movement.realised_loss_gl_name;
                     $scope.currency_movement.unrealised_gain_gl_display_name = $scope.currency_movement.unrealised_gain_gl_code + ' - ' + $scope.currency_movement.unrealised_gain_gl_name;
                     $scope.currency_movement.unrealised_loss_gl_display_name = $scope.currency_movement.unrealised_loss_gl_code + ' - ' + $scope.currency_movement.unrealised_loss_gl_name;
 
                 }
                 else
                     toaster.pop('error', 'Add', 'Currency movement not found!');
             }); */


    }

    $scope.showCurrencyListing = function () {
        $scope.showCurrencyForm = false;
        $scope.showCurrencyListing = true;
    }

    $scope.showCurrencyViewForm = function (id) {
        $scope.showCurrencyForm = true;
        $scope.showCurrencyListing = false;
        $scope.check_currency_readonly = true;
        $scope.showConvRateForm = false;
    }

    $scope.showCurrencyEditForm = function (id) {
        $scope.check_currency_readonly = false;
        if (id != undefined)
            $scope.showViewCurrencyForm(id, 'edit');
    }

    //--------------------------------------------------------*
    //------------------ SET CURRENCY CONVERSION RATE---------*
    //--------------------------------------------------------*


    var getConvRateUrl = $scope.$root.setup + "general/get-conversion-rate";
    var setConvUrl = $scope.$root.setup + "general/update-conversion-rate";
    $scope.rate = {};


    /************** Calendar *********************/
    $scope.starteDate = function (startDate) {
        var newdate = startDate;
        $scope.newD = $scope.newD ? null : newdate;
        $scope.starteDate = false;
    }
    $scope.datePicker = (function () {
        var method = {};
        method.instances = [];
        $scope.toggleMin = function () {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        method.open = function ($event, instance) {
            $event.preventDefault();
            $event.stopPropagation();

            var old_instance = $rootScope.$storage.getItem('old_instance');
            if (old_instance != null)
                method.instances[old_instance] = false;

            method.instances[instance] = true;
            $rootScope.$storage.setItem('old_instance', instance);

        };

        method.options = {
            'show-weeks': false,
            startingDay: 0
        };

        method.format = $rootScope.dateFormats[$rootScope.defaultDateFormat];

        return method;
    }());
    /******************************************/

    $scope.conversionRate = function (curr_id) {
        $scope.showCurrencyForm = false;
        $scope.showCurrencyListing = false;
        $scope.showConvRateForm = true;
        $scope.showLoader = true;

        $scope.rate.currency_id = curr_id;

        $http
            .post(getConvRateUrl, { 'token': $scope.$root.token, 'id': curr_id })
            .then(function (res) {
                if (res.data.response !== null) {
                    $scope.rate = res.data.response;
                    $scope.rate.update_id = res.data.response.id;

                    angular.forEach($rootScope.arr_status, function (obj) {
                        if (obj.value == res.data.response.status)
                            $scope.rate.c_status = obj;
                    });
                }
                else
                    $scope.rate.update_id = 0;
                $scope.showLoader = false;
            });
    }

    $scope.setConversionRate = function (rate) {
        if (rate.conversion_rate == 0) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(319, ['Value', '0']));
            return false;
        }
        rate.token = $scope.$root.token;
        rate.status = $scope.rate.c_status !== undefined ? $scope.rate.c_status.value : 0;
        rate.emp_id = $scope.$root.userId;

        $http
            .post(setConvUrl, rate)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));
                    $timeout(function () {
                        $scope.showCurrencyViewForm(rate.currency_id);
                    }, 3000);
                }
                else {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));
                    $timeout(function () {
                        $scope.showCurrencyViewForm(rate.currency_id);
                    }, 3000);
                }

            });
    }

    //Currency Conversion Rate History
    var historyUrl = $scope.$root.setup + "general/conversion-rate-history";
    $scope.histData = {};
    $scope.title = "Currency Exchange Rate History";

    $scope.currencyConvRateHistory = function (curr_id, curency_name) {
        $http
            .post(historyUrl, { 'token': $scope.$root.token, 'id': curr_id })
            .then(function (res) {
                angular.forEach(res.data.response, function (val) {
                    if(val && val.conversion_rate)
                        val.exchangeRate = 1/val.conversion_rate;                          
                });

                $scope.histData = res.data.response;
                $scope.currencyName = curency_name;

            });
        ngDialog.openConfirm({
            template: 'historyDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
        })

    };

    $scope.updateExchangeRate = function (exchageRate,type) {

        if(exchageRate){

            if(type == 1){
                $scope.currency.conversion_rate = parseFloat(1/exchageRate).toFixed(5);
            }
            else{
                $scope.currency.exchange_rate = parseFloat(1/exchageRate).toFixed(5);
            }       
        }
        else{
            if(type == 1){
                $scope.currency.conversion_rate = '';
            }
            else{
                $scope.currency.exchange_rate = '';
            }
        }
    }

    $timeout(function () {
        if ($stateParams.tab != undefined && $stateParams.tab == 'financial_setting') {

            $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'General', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            // { 'name': 'Company', 'url': 'app.company', 'isActive': false },
            { 'name': $scope.$root.bctext, 'url': '#', 'isActive': false }];

            angular.element('.financial_setting a').click();
        }

        // console.log($stateParams.id);
        // if ($stateParams.id > 0) {
        angular.element('.company_adddresses,.bank_accounts,.financial_setting,.currencies,.passwordSettings,.configurations').removeClass('dont-click');
        // }

    }, 2000);

    $scope.generalInforation = function () {

        $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
        { 'name': 'General', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
        // { 'name': 'Company', 'url': 'app.company', 'isActive': false },
        { 'name': $scope.$root.bctext, 'url': '#', 'isActive': false }];
    }


    $scope.addNewCurrencyPopup = function () {
        var id = $scope.general.currency != undefined ? $scope.general.currency.id : 0;
        var bank_id = $scope.bank.currency != undefined ? $scope.bank.currency.id : 0;
        if (id > 0 || bank_id > 0)
            return false;

        $scope.currency = {};
        ngDialog.openConfirm({
            template: 'app/views/company/add_new_currency.html',
            className: 'ngdialog-theme-default-custom-large',
            scope: $scope
        }).then(function (currency) {
            var addCurrencyUrl = $scope.$root.setup + "general/add-currency";
            currency.name = $scope.currency.currency.name;
            currency.code = $scope.currency.currency.code;
            currency.ref_currency_id = $scope.currency.currency.id;

            currency.token = $scope.$root.token;
            currency.company_id = $stateParams.id;
            currency.status = $scope.currency.c_status !== undefined ? $scope.currency.c_status.value : 0;

            $http
                .post(addCurrencyUrl, currency)
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', res.data.msg);
                    }
                    else if (res.data.ack == false) {
                        toaster.pop('warning', 'Info', res.data.msg);
                    }
                    else
                        toaster.pop('warning', 'Info', res.data.msg);

                });

        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.ShowPasswordEditForm = function () {
        $scope.password_setting_readonly = false;
    }
    $scope.getPasswordSetting = function () {
        $scope.password_setting = {};
        $scope.password_setting_readonly = true;
        var getPasswordSettingUrl = $scope.$root.setup + "general/get-password-settings";
        var postData = {};
        postData.token = $scope.$root.token;
        $http
            .post(getPasswordSettingUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.password_setting.password_expiry_days = (Number(res.data.response.password_expiry_days) > 0) ? Number(res.data.response.password_expiry_days) : null;
                    $scope.password_setting.password_reminder_days = (Number(res.data.response.password_reminder_days) > 0) ? Number(res.data.response.password_reminder_days) : null;
                    $scope.password_setting.password_grace_period = (Number(res.data.response.password_grace_period) > 0) ? Number(res.data.response.password_grace_period) : null;
                    $scope.password_setting.account_lock_attempts = (Number(res.data.response.account_lock_attempts) > 0) ? Number(res.data.response.account_lock_attempts) : null;
                }
            });
    }
    $scope.updatePasswordSetting = function () {
        var updatePasswordSettingUrl = $scope.$root.setup + "general/update-password-settings";
        var postData = $scope.password_setting;
        postData.token = $scope.$root.token;
        $http
            .post(updatePasswordSettingUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.password_setting_readonly = true;
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));
                }
                else
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(106));
            });
    }


    // $scope.$root.load_date_picker('Financial Settings');



}

function CompanyFileUploadController($scope, Upload, $timeout, $rootScope, toaster) {
    $scope.genera = {};
    $scope.uploadFiles = function (file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        var postUrl = $scope.$root.setup + "general/upload-image";

        if (file) {
            var imgWidth = file.$ngfWidth;
            var imgHeight = file.$ngfHeight;
            // var imgType = file.type;
            if (file.type.indexOf('image') === -1) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(334));
                return false;
            }

            if (imgWidth > 200 || imgHeight > 200) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(335));
                return false;
            }

            file.upload = Upload.upload({
                url: postUrl,
                data: { file: file, image_token: $scope.$root.token }
            });

            file.upload.then(function (response) {
                //$timeout(function () {
                //console.log(response);return;
                //$scope.get_response = response.data.response;
                $scope.general.logo = response.data.response;
                $rootScope.defaultLogo = response.data.response;
                $rootScope.$storage.setItem("company_logo", $rootScope.defaultLogo);
                // $rootScope.uploaded_logo = response.data.response;
                file.result = response.data;
                //});
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }
    }
}

