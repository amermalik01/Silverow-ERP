OfferMethodController.$inject = ["$scope", "$stateParams", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.offer-method', {
                url: '/offer_method/:module',
                title: 'Setup',
                templateUrl: helper.basepath('offer_method/offer_method.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'OfferMethodController'
            })
            .state('app.add-offer-method', {
                url: '/offer_method/:module/add',
                title: 'Setup',
                templateUrl: helper.basepath('add.html'),
                controller: 'OfferMethodAddController'
            })
            .state('app.view-offer-method', {
                url: '/offer_method/:module/:id/view',
                title: 'Setup',
                templateUrl: helper.basepath('view.html'),
                resolve: angular.extend(helper.resolveFor('ngDialog'), {
                    tpl: function () {
                        return {
                            path: helper.basepath('ngdialog-template.html')
                        };
                    }
                }),
                controller: 'OfferMethodViewController'
            })
            .state('app.edit-offer-method', {
                url: '/offer-method/:module/:id/edit',
                title: 'Setup',
                templateUrl: helper.basepath('edit.html'),
                controller: 'OfferMethodEditController'
            })

    }
]);

myApp.controller('OfferMethodController', OfferMethodController);
myApp.controller('OfferMethodAddController', OfferMethodAddController);
myApp.controller('OfferMethodViewController', OfferMethodViewController);
myApp.controller('OfferMethodEditController', OfferMethodEditController);

function OfferMethodController($scope, $stateParams, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
    'use strict';

    // console.log($stateParams);
    if ($stateParams.module == "crm") {
        $scope.module_type = '1';
        $scope.breadcrumbs = [ //{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
            { 'name': 'Price Offer Method', 'url': '#', 'isActive': false }
        ];

    } else if ($stateParams.module == "srm") {
        $scope.module_type = '2';
        $scope.breadcrumbs = [ //{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
            { 'name': 'Price Offer Method', 'url': '#', 'isActive': false }
        ];

    }
    $scope.module = $stateParams.module;

    var vm = this;
    var Api = $scope.$root.setup + "ledger-group/predefines";
    var postData = {
        'token': $scope.$root.token,
        'all': "1",
        'column': 'type',
        'value': 'OFFER_METHOD',
        'module_type': $scope.module_type
    };

    /* $scope.$watch("MyCustomeFilters", function () {
        if ($scope.MyCustomeFilters && $scope.table.tableParams5) {
            $scope.table.tableParams5.reload();
        }
    }, true); */

    $scope.MyCustomeFilters = {};

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
                ngDataService.getDataCustom($defer, params, Api, $filter, $scope, postData);

            }
        });
}

function OfferMethodAddController($scope, $stateParams, $http, $state, toaster, $timeout) {

    if ($stateParams.module == "crm") {
        $scope.module_type = '1';
        $scope.btnCancelUrl = "app.offer-method({module:'crm'})";
        $scope.titlePrefix = 'CRM';

        $scope.breadcrumbs = [ //{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
            { 'name': 'Price Offer Method', 'url': "app.offer-method({module:'crm'})", 'isActive': false }
        ];
    } else if ($stateParams.module == "srm") {
        $scope.module_type = '2';
        $scope.btnCancelUrl = "app.offer-method({module:'srm'})";
        $scope.titlePrefix = 'SRM';

        $scope.breadcrumbs = [ //{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
            { 'name': 'Price Offer Method', 'url': "app.offer-method({module:'srm'})", 'isActive': false }
        ];

    }
    $scope.formTitle = $scope.titlePrefix + ' Price Offer Method';
    /* 
        $scope.breadcrumbs = [ //{'name':'Dashboard','url':'app.dashboard','isActive':false},
            {
                'name': 'Setup',
                'url': '#',
                'isActive': false
            },
            {
                'name': 'Sales',
                'url': '#',
                'isActive': false
            },
            {
                'name': $scope.titlePrefix + ' Price Offer Method',
                'url': $scope.btnCancelUrl,
                'isActive': false
            },
            {
                'name': 'Add',
                'url': '#',
                'isActive': false
            }
        ];
     */

    $scope.formUrl = function () {
        return "app/views/offer_method/_form.html";
    }

    $scope.rec = {};
    if ($stateParams.module == "crm") {
        $scope.rec.module_type = '1';
    } else if ($stateParams.module == "srm") {
        $scope.rec.module_type = '2';
    }
    $scope.predefine_types = {};
    var postUrl = $scope.$root.setup + "ledger-group/add-predefine";

    $scope.add = function (rec) {
        rec.token = $scope.$root.token;
        rec.type = 'OFFER_METHOD';
        rec.module_type = $scope.module_type;
        $http
            .post(postUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $timeout(function () {
                        $state.go('app.offer-method', {
                            'module': $stateParams.module
                        });
                    }, 1000);
                } else
                    toaster.pop('error', 'Add', res.data.error);
                // toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
            });
    }
}

function OfferMethodViewController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {
    if ($stateParams.module == "crm") {
        $scope.module_type = '1';
        $scope.btnCancelUrl = "app.offer-method({module:'crm'})";
        $scope.titlePrefix = 'CRM';

        $scope.breadcrumbs = [ //{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
            { 'name': 'Price Offer Method', 'url': "app.offer-method({module:'crm'})", 'isActive': false }
        ];
    } else if ($stateParams.module == "srm") {
        $scope.module_type = '2';
        $scope.btnCancelUrl = "app.offer-method({module:'srm'})";
        $scope.titlePrefix = 'SRM';

        $scope.breadcrumbs = [ //{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
            { 'name': 'Price Offer Method', 'url': "app.offer-method({module:'srm'})", 'isActive': false }
        ];
    }
    $scope.formTitle = $scope.titlePrefix + ' Price Offer Method';

    $scope.hideDel = false;
    $scope.showLoader = true;
    /* $scope.breadcrumbs = [ //{'name':'Dashboard','url':'app.dashboard','isActive':false},
        {
            'name': 'Setup',
            'url': '#',
            'isActive': false
        },
        {
            'name': 'Sales',
            'url': '#',
            'isActive': false
        },
        {
            'name': $scope.titlePrefix + ' Price Offer Method',
            'url': $scope.btnCancelUrl,
            'isActive': false
        },
        {
            'name': 'Details',
            'url': '#',
            'isActive': false
        }
    ]; */


    $scope.gotoEdit = function () {
        $state.go("app.edit-offer-method", {
            id: $stateParams.id,
            module: $stateParams.module
        });
    };


    $scope.rec = {};
    $scope.predefine_types = {};
    var postUrl = $scope.$root.setup + "ledger-group/get-predefine";
    var postData = {
        'token': $scope.$root.token,
        'id': $stateParams.id,
        'type': 'OFFER_METHOD'
    };

    $http
        .post(postUrl, postData)
        .then(function (res) {
            $scope.rec = res.data.response;
        });
    $scope.formUrl = function () {
        return "app/views/offer_method/_form.html";
    }
    $scope.showLoader = false;

    $scope.delete = function (id, rec, arr_data) {
        var delUrl = $scope.$root.setup + "ledger-group/delete-predefine";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    id: $stateParams.id,
                    'token': $scope.$root.token,
                    'type': 'OFFER_METHOD'
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        /*var index = arr_data.indexOf(rec.id);
                        arr_data.splice(index, 1);*/

                        $timeout(function () {
                            $state.go('app.offer-method', {
                                'module': $stateParams.module
                            });
                        }, 2000);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };
};

function OfferMethodEditController($scope, $stateParams, $http, $state, $resource, toaster, $timeout, ngDialog) {

    if ($stateParams.module == "crm") {
        $scope.module_type = '1';
        $scope.btnCancelUrl = "app.offer-method({module:'crm'})";
        $scope.titlePrefix = 'CRM';

        $scope.breadcrumbs = [ //{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
            { 'name': 'Price Offer Method', 'url': "app.offer-method({module:'crm'})", 'isActive': false }
        ];
    } else if ($stateParams.module == "srm") {
        $scope.module_type = '2';
        $scope.btnCancelUrl = "app.offer-method({module:'srm'})";
        $scope.titlePrefix = 'SRM';

        $scope.breadcrumbs = [ //{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
            { 'name': 'Price Offer Method', 'url': "app.offer-method({module:'srm'})", 'isActive': false }
        ];
    }
    $scope.formTitle = $scope.titlePrefix + ' Price Offer Method';

    $scope.formTitle = 'Edit ' + $scope.titlePrefix + ' Offer Method';

    $scope.hideDel = false;
    $scope.showLoader = true;
    /* $scope.breadcrumbs = [ //{'name':'Dashboard','url':'app.dashboard','isActive':false},
        {
            'name': 'Setup',
            'url': '#',
            'isActive': false
        },
        {
            'name': 'Sales',
            'url': '#',
            'isActive': false
        },
        {
            'name': $scope.titlePrefix + ' Price Offer Method',
            'url': $scope.btnCancelUrl,
            'isActive': false
        },
        {
            'name': 'Edit',
            'url': '#',
            'isActive': false
        }
    ]; */


    $scope.rec = {};
    $scope.predefine_types = {};
    var postUrl = $scope.$root.setup + "ledger-group/get-predefine";
    var updateUrl = $scope.$root.setup + "ledger-group/update-predefine";
    var postData = {
        'token': $scope.$root.token,
        'id': $stateParams.id,
        'type': 'OFFER_METHOD'
    };

    $http
        .post(postUrl, postData)
        .then(function (res) {
            $scope.rec = res.data.response;
            $scope.rec.deletePerm = 1;
        });

    $scope.formUrl = function () {
        return "app/views/offer_method/_form.html";
    }

    $scope.showLoader = false;

    $scope.update = function (rec) {
        rec.token = $scope.$root.token;
        rec.type = 'OFFER_METHOD';

        rec.module_type = $scope.module_type;

        $http
            .post(updateUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $timeout(function () {
                        $state.go('app.offer-method', {
                            'module': $stateParams.module
                        });
                    }, 1000);
                } else if (res.data.ack == 2) {
                    toaster.pop('success', 'Edit', res.data.error);
                    $timeout(function () {
                        $state.go('app.offer-method', {
                            'module': $stateParams.module
                        });
                    }, 1000);
                }
                else {
                    toaster.pop('error', 'Edit', res.data.error);

                    $timeout(function () {
                        $state.go('app.offer-method', {
                            'module': $stateParams.module
                        });
                    }, 1000);
                }
            });
    }

    $scope.delete = function (id, rec, arr_data) {
        var delUrl = $scope.$root.setup + "ledger-group/delete-predefine";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    id: $stateParams.id,
                    'token': $scope.$root.token,
                    'type': 'OFFER_METHOD'
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', res.data.success);
                        /* var index = arr_data.indexOf(rec.id);
                         arr_data.splice(index, 1);*/
                        $timeout(function () {
                            $state.go('app.offer-method', {
                                'module': $stateParams.module
                            })
                        }, 1500);
                    } else if (res.data.ack == 2) {
                        toaster.pop('error', 'Deleted', res.data.error);
                    } else {
                        toaster.pop('error', 'Deleted', res.data.error);
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

}