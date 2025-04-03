myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        $stateProvider
            .state('app.otherCompanies', {
                url: '/otherCompanies/:filter_id',
                title: 'Setup',
                templateUrl: helper.basepath('otherCompanies/otherCompanies.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.add-otherCompanies', {
                url: '/otherCompanies/add',
                title: 'Setup',
                templateUrl: helper.basepath('otherCompanies/add_form.html'), //addTabs
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'otherCompaniesEditController'
            })
            .state('app.view-otherCompanies', {
                url: '/otherCompanies/:id/view',
                title: 'Setup',
                templateUrl: helper.basepath('otherCompanies/_form.html'), //addTabs
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'otherCompaniesEditController'
            })
            .state('app.edit-otherCompanies', {
                url: '/otherCompanies/:id/edit',
                title: 'Setup',
                templateUrl: helper.basepath('otherCompanies/_form.html'), //addTabs
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'otherCompaniesEditController'
            })
    }
]);

otherCompaniesControllerListing.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "$rootScope", "toaster"];

myApp.controller('otherCompaniesControllerListing', otherCompaniesControllerListing);

function otherCompaniesControllerListing($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, $rootScope, toaster) {

    $scope.$root.breadcrumbs = [
        { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
        { 'name': 'Other Companies', 'url': '#', 'isActive': false }
    ];

    var Api = $scope.$root.setup + "otherCompanies/listings";

    $scope.postData = {
        'token': $scope.$root.token,
        'all': "1"
    };

    $scope.tempOtherCompanies = {};
    $scope.searchKeyword = {};

    $scope.showOtherCompaniesListing = function(item_paging) {
        $scope.otherCompanies = {};
        $scope.otherCompanies.token = $scope.$root.token;

        if (item_paging == 1)
            $scope.item_paging.spage = 1;

        $scope.otherCompanies.page = $scope.$root.item_paging.spage;

        if ($scope.otherCompanies.pagination_limits == -1) {
            $scope.otherCompanies.page = -1;
        }

        $scope.otherCompanies.searchKeyword = $scope.searchKeyword;
        $scope.showLoader = true;

        $http
            .post(Api, $scope.otherCompanies)
            .then(function(res) {
                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.tempOtherCompanies = res;
                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.total_paging_record = res.data.total_paging_record;

                    angular.forEach($scope.tempOtherCompanies.data.response.tbl_meta_data.response.colMeta, function(obj, index) {
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    });

                    $scope.showLoader = false;
                }
            });
    }

    $scope.postData = {};
    $scope.postData = {
        'token': $scope.$root.token,
        'all': "1"
    };

    function toTitleCase(str) {
        var title = str.replace('_', ' ');
        return title.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    $scope.getItem = function(parm) {
        $scope.rec = {};
        $scope.rec.token = $scope.$root.token;

        if (parm == 'all') {
            $scope.rec = {};
            $scope.rec.token = $scope.$root.token;
        }

        $scope.postData = $scope.rec;
        $scope.$root.$broadcast("myReload");
    }

    $scope.$on("myReload", function(event) {
        $scope.table.tableParams5.reload();
    });

    $scope.$data = {};

    $scope.newCompany = {};
    $scope.currencies = $rootScope.ref_currency_list;

    $scope.openNewCompanyModal = function() {
        angular.element('#model_add_company').modal({ show: true });
    }

    $scope.add_new_company = function(newCompany) {

        var apiURL = $scope.$root.setup + "otherCompanies/add-otherCompanies";
        newCompany.token = $scope.$root.token;

        if (newCompany.name == undefined || newCompany.name == "" || newCompany.name == null) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Company Name']));
            return false;
        }

        newCompany.currency_ids = (newCompany.currency != undefined && newCompany.currency != '') ? newCompany.currency.code : 0;

        if (newCompany.currency_ids == 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Base Currency']));
            return false;
        }

        if (newCompany.email == undefined || newCompany.email == "" || newCompany.email == null) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Admin Email']));
            return false;
        }

        // console.log('newCompany == ', newCompany);
        // return false;

        $scope.showLoader = true;

        $http
            .post(apiURL, newCompany)
            .then(function(res) {
                $scope.showLoader = false;

                if (res.data.ack == true) {

                    toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                    $('#model_add_company').modal('hide');
                    // $scope.$root.$broadcast("myReload");
                    $scope.tempOtherCompanies = {};
                    $scope.searchKeyword = {};
                    $scope.showOtherCompaniesListing();

                } else {
                    $('#model_add_company').modal('hide');
                    $scope.showLoader = false;
                    toaster.pop('error', 'Add', res.data.error);
                }
            });
    }
}

otherCompaniesEditController.$inject = ["$scope", "$filter", "$resource", "$timeout", "$http", "ngDialog", "toaster", "$stateParams", "$rootScope", "$state"];
myApp.controller('otherCompaniesEditController', otherCompaniesEditController);

function otherCompaniesEditController($scope, $filter, $resource, $timeout, $http, ngDialog, toaster, $stateParams, $rootScope, $state) {

    if ($stateParams.id > 0) {
        $scope.check_readonly = true;
    }

    $scope.rec = {};

    $scope.btnCancelUrl = 'app.otherCompanies';

    /* $scope.showEditForm = function() {
        $scope.check_wh_readonly = false;
    } */


    $scope.gotoEdit = function() {
        $scope.check_readonly = false;
    }

    $scope.class = 'block';
    var id = $stateParams.id;
    $scope.$root.model_code = '';

    $scope.status_list = [];
    $scope.columns = [];
    $scope.record = {};

    $scope.total = 0;

    $scope.status_list = [{ value: 'Active', id: '1' }, { value: 'Inactive', id: '2' }];
    $scope.rec.status_ids = $scope.status_list[0];

    $scope.general = {};
    $scope.timezone = {};
    $scope.country = {};

    $scope.general.add_mode = 1;
    $scope.general.decimal_range = 2;
    $scope.general.num_user_login = 10;
    $scope.general.date_format = 3;
    $scope.general.time_format = 1;


    $scope.dateFarmat = 3;
    $scope.timeFarmat = 1;
    $rootScope.date_format = 3;
    $scope.vat_freq_readonly = false;
    $scope.is_comp_reg_no = false;

    $scope.cattype = '';

    $scope.arr_vat_scheme = [];
    $scope.arr_vat_scheme = [{ 'id': 1, 'name': 'Standard' }, { 'id': 2, 'name': 'No VAT' }];

    $scope.inventoryCatType = [{ 'name': 'Perpetual', 'id': 1 }, { 'name': 'Periodic', 'id': 2 }]; //Inventory System


    if ($stateParams.id !== undefined) {
        $scope.showLoader = true;
        var DetailsURL = $scope.$root.setup + "otherCompanies/get-otherCompanies";

        $http
            .post(DetailsURL, { 'token': $scope.$root.token, 'id': id })
            .then(function(res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {
                    $scope.general = res.data.response;
                    $scope.general.id = res.data.response.id;
                    $scope.$root.model_code = res.data.response.name;
                    $scope.module_code = $scope.$root.model_code;
                    $scope.new_list = true;
                    $scope.save_list = false;

                    $.each($scope.status_list, function(index, obj) {
                        if (obj.id == res.data.response.status) {
                            $scope.general.status_ids = $scope.status_list[index];
                        }
                    });

                    $scope.country_type_arr = res.data.country_type_arr;

                    $.each($scope.country_type_arr, function(index, elem) {
                        if (elem.id == res.data.response.country_id)
                            $scope.general.country = elem;
                    });

                    $scope.arr_currency = res.data.arr_currency;

                    $.each($scope.arr_currency, function(index, elem) {
                        if (elem.id == res.data.response.currency_id)
                            $scope.general.currency = elem;
                    });

                    $scope.dateFarmat = res.data.response.date_format;
                    $scope.timeFarmat = res.data.response.time_format;

                    if (res.data.response.currency_id > 0)
                        $scope.disable_currency = 1;

                    angular.forEach($rootScope.timezones, function(obj) {
                        if (obj.id == res.data.response.timezone)
                            $scope.general.timezonee = obj;
                    });

                    if (res.data.response.vat_scheme == 2) {
                        $scope.vat_freq_readonly = true;
                        $scope.general.vat_reg_no = "";
                        $scope.general.submission_frequencys = "";
                    } else {
                        $scope.vat_freq_readonly = false;
                    }

                    if (res.data.response.type_of_business_ownerships != 1 && res.data.response.type_of_business_ownerships != 2)
                        $scope.is_comp_reg_no = true;

                    angular.forEach($rootScope.arr_submiss_frequency, function(obj) {
                        if (res.data.response != null && obj.id == res.data.response.submission_frequency)
                            $scope.general.submission_frequencys = obj;
                    });

                    angular.forEach($scope.arr_vat_scheme, function(obj) {
                        if (res.data.response != null && obj.id == res.data.response.vat_scheme)
                            $scope.general.vat_schemee = obj;
                    });

                    angular.forEach($rootScope.arr_type_of_Business, function(obj) {
                        if (res.data.response != null && obj.id == res.data.response.type_of_business_ownership)
                            $scope.general.type_of_business_ownerships = obj;
                    });

                    angular.forEach($scope.inventoryCatType, function(obj) {
                        if (obj.id == res.data.response.vat_sales_type)
                            $scope.cattype = obj;
                    });

                    $scope.$root.breadcrumbs = [
                        { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
                        { 'name': 'Other Companies', 'url': 'app.otherCompanies', 'isActive': false, 'style': '' },
                        { 'name': res.data.response.name, 'url': '#', 'style': 'color:#515253;' }
                    ];
                }
            });
    } else {
        $scope.$root.breadcrumbs = [
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Other Companies', 'url': 'app.otherCompanies', 'style': '' }
        ];
    }

    $scope.generalInformation = function() {
        $scope.$root.breadcrumbs = [
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Other Companies', 'url': 'app.otherCompanies', 'style': '' }
        ];
    }



    $scope.emplyeesList = function(item_paging, sort_column, sortform) {
        $scope.$root.breadcrumbs = [
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Other Companies', 'url': 'app.otherCompanies', 'style': '' },
            { 'name': $scope.$root.model_code, 'url': '#', 'style': 'color:#515253;' }
        ];

        $scope.searchKeywordHR = {};

        if ($stateParams.id !== undefined) {
            $scope.showLoader = true;

            $scope.postData = {};
            $scope.postData.token = $scope.$root.token;
            if (item_paging == 1) $scope.item_paging.spage = 1;
            $scope.postData.page = $scope.item_paging.spage;

            $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;

            $scope.postData.searchKeyword = $scope.searchKeywordHR;
            $scope.postData.company_id = $stateParams.id;

            if ($scope.postData.pagination_limits == -1) {
                $scope.postData.page = -1;
                $scope.searchKeywordHR = {};
                $scope.record_data = {};
            }

            if ((sort_column != undefined) && (sort_column != null)) {
                console.log(sort_column);
                $scope.postData.sort_column = sort_column;
                $scope.postData.sortform = sortform;

                $rootScope.sortform = sortform;
                $rootScope.reversee = ('desc' === $rootScope.sortform) ? !$rootScope.reversee : false;
                $rootScope.sort_column = sort_column;

                $rootScope.save_single_value($rootScope.sort_column, 'hrsort_name');

            }


            var HR_ListingURL = $scope.$root.setup + "otherCompanies/hr-listing";

            $http
                .post(HR_ListingURL, $scope.postData)
                .then(function(res) {
                    $scope.tableData = res;
                    $scope.columns = [];
                    $scope.record_data = {};
                    if (res.data.ack == true) {

                        $scope.total = res.data.total;
                        $scope.item_paging.total_pages = res.data.total_pages;
                        $scope.item_paging.cpage = res.data.cpage;
                        $scope.item_paging.ppage = res.data.ppage;
                        $scope.item_paging.npage = res.data.npage;
                        $scope.item_paging.pages = res.data.pages;

                        $scope.total_paging_record = res.data.total_paging_record;

                        $scope.record_data = res.data.response;
                        angular.forEach(res.data.response[0], function(val, index) {
                            if (index != 'chk' && index != 'id') {
                                $scope.columns.push({
                                    'title': toTitleCase(index),
                                    'field': index,
                                    'visible': true
                                });
                            }

                        });
                        $scope.showLoader = false;
                    }
                });
        }

    }


    $scope.UpdateForm = function(rec, drp) {
        rec.country_ids = rec.country_id != undefined ? rec.country_id.id : 0;
        rec.status = rec.status_ids != undefined ? rec.status_ids.id : 0;
        rec.type = (rec.types != undefined && rec.types != '') ? rec.types.id : 0;
        rec.currency_ids = rec.currency_id != undefined ? rec.currency_id.id : 0;
        rec.token = $scope.$root.token;


        if (rec.type == 0 || rec.type == -1) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Warehouse Storage Type']));
            return false;
        }

        $scope.showLoader = true;
        var addcrmUrl = $scope.$root.setup + "warehouse/add-warehouse";

        if (rec.id != undefined)
            addcrmUrl = $scope.$root.setup + "warehouse/update-warehouse";

        $http
            .post(addcrmUrl, rec)
            .then(function(res) {
                $scope.showLoader = false;
                if (res.data.ack == 1) {
                    if (rec.id > 0) {
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                        $scope.check_wh_readonly = true;
                    } else
                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));

                    $scope.$root.rec_id = res.data.id;

                    if (res.data.info == 'insert') {
                        $timeout(function() {
                            $state.go("app.view-otherCompanies", { id: res.data.id });
                        }, 1000);
                    }
                } else {
                    if (rec.id > 0)
                        toaster.pop('error', 'Edit', res.data.error);
                    else
                        toaster.pop('error', 'Error', res.data.error);
                }
            });
    }

    $timeout(function() {
        $scope.searchKeyword = {};
        $scope.searchKeyword.status_ids = $scope.status_list[0];
    }, 1000);


    /* $scope.item_paging = {};
    $scope.itemselectPage = function(pageno) {
        $scope.item_paging.spage = pageno;
    };
 */
    // $scope.row_id = $stateParams.id;
    /* $scope.module_id = 113;
    $scope.subtype = 4;
    $scope.module = "Setup";
    $scope.module_name = "otherCompanies";
    $scope.$root.$broadcast("image_module", $scope.row_id, $scope.module, $scope.module_id, $scope.module_name, $scope.module_code, $scope.subtype); */
}