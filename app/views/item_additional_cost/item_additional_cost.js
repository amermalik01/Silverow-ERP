ItemAdditionalCostController.$inject = ["$scope", "$stateParams", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$rootScope"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.item-additional-cost', {
                url: '/item_additional_cost',
                title: 'Setup',
                templateUrl: helper.basepath('item_additional_cost/item_additional_cost.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'ItemAdditionalCostController'
            })
            .state('app.add-item-additional-cost', {
                url: '/item_additional_cost/add',
                title: 'Setup',
                templateUrl: helper.basepath('add.html'),
                controller: 'ItemAdditionalCostAddController'
            })
            .state('app.view-item-additional-cost', {
                url: '/item_additional_cost/:id/view',
                title: 'Setup',
                templateUrl: helper.basepath('view.html'),
                resolve: angular.extend(helper.resolveFor('ngDialog'), {
                    tpl: function () {
                        return {
                            path: helper.basepath('ngdialog-template.html')
                        };
                    }
                }),
                controller: 'ItemAdditionalCostViewController'
            })
            .state('app.edit-item-additional-cost', {
                url: '/item-additional-cost/:id/edit',
                title: 'Setup',
                templateUrl: helper.basepath('edit.html'),
                controller: 'ItemAdditionalCostEditController'
            })
            .state('app.item-additional-cost-setup', {
                url: '/item-additional-cost-setup',
                title: 'Setup',
                templateUrl: helper.basepath('item_additional_cost/item_additional_cost_setup.html'),
                controller: 'ItemAdditionalCostSetupController'
            })
    }
]);

myApp.controller('ItemAdditionalCostController', ItemAdditionalCostController);
myApp.controller('ItemAdditionalCostAddController', ItemAdditionalCostAddController);
myApp.controller('ItemAdditionalCostViewController', ItemAdditionalCostViewController);
myApp.controller('ItemAdditionalCostEditController', ItemAdditionalCostEditController);
myApp.controller('ItemAdditionalCostSetupController', ItemAdditionalCostSetupController);

function ItemAdditionalCostController($scope, $stateParams, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
    'use strict';

    $scope.module = $stateParams.module;
    $scope.btnCancelUrl = 'app.setup';

    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Intentory', 'url': 'app.setup', 'isActive': false, 'tabIndex': '6' },
            { 'name': 'Item Addition Cost', 'url': '#', 'isActive': false },
            // {'name': 'Edit', 'url': '#', 'isActive': false}
        ];

    var vm = this;
    var Api = $scope.$root.setup + "ledger-group/predefines";
    var postData = {
        'token': $scope.$root.token,
        'all': "1",
        'column': 'type',
        'value': 'ITEM_ADDITIONAL_COST',
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

function ItemAdditionalCostAddController($scope, $stateParams, $http, $state, toaster, $timeout) {
    $scope.formTitle = $scope.titlePrefix + ' Item Additional Cost';
    $scope.btnCancelUrl = 'app.setup';

    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Intentory', 'url': 'app.setup', 'isActive': false, 'tabIndex': '6' },
            { 'name': 'Item Addition Cost', 'url': '#', 'isActive': false },
            // {'name': 'Edit', 'url': '#', 'isActive': false}
        ];

    $scope.formUrl = function () {
        return "app/views/item_additional_cost/_form.html";
    }

    $scope.rec = {};

    $scope.predefine_types = {};
    var postUrl = $scope.$root.setup + "ledger-group/add-predefine";

    $scope.add = function (rec) {
        rec.token = $scope.$root.token;
        rec.type = 'ITEM_ADDITIONAL_COST';
        $http
            .post(postUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $timeout(function () {
                        $state.go('app.item-additional-cost', {
                            'module': $stateParams.module
                        });
                    }, 2000);
                } else
                    toaster.pop('error', 'Add', res.data.error);
                // toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
            });
    }
}

function ItemAdditionalCostViewController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {

    $scope.formTitle = $scope.titlePrefix + ' Item Additional Cost';
    $scope.btnCancelUrl = 'app.setup';

    $scope.hideDel = false;
    $scope.showLoader = true;
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Intentory', 'url': 'app.setup', 'isActive': false, 'tabIndex': '6' },
            { 'name': 'Item Addition Cost', 'url': '#', 'isActive': false },
            // {'name': 'Edit', 'url': '#', 'isActive': false}
        ];


    $scope.gotoEdit = function () {
        $state.go("app.edit-item-additional-cost", {
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
        'type': 'ITEM_ADDITIONAL_COST'
    };

    $http
        .post(postUrl, postData)
        .then(function (res) {
            $scope.rec = res.data.response;
        });
    $scope.formUrl = function () {
        return "app/views/item_additional_cost/_form.html";
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
                    'type': 'ITEM_ADDITIONAL_COST'
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        /*var index = arr_data.indexOf(rec.id);
                        arr_data.splice(index, 1);*/

                        $timeout(function () {
                            $state.go('app.item-additional-cost', {
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

function ItemAdditionalCostEditController($scope, $stateParams, $http, $state, $resource, toaster, $timeout) {

    $scope.formTitle = $scope.titlePrefix + ' Item Additional Cost';

    $scope.formTitle = 'Edit ' + $scope.titlePrefix + ' Item Additional Cost';
    $scope.btnCancelUrl = 'app.setup';

    $scope.hideDel = false;
    $scope.showLoader = true;
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Intentory', 'url': 'app.setup', 'isActive': false, 'tabIndex': '6' },
            { 'name': 'Item Addition Cost', 'url': '#', 'isActive': false },
            // {'name': 'Edit', 'url': '#', 'isActive': false}
        ];


    $scope.rec = {};
    $scope.predefine_types = {};
    var postUrl = $scope.$root.setup + "ledger-group/get-predefine";
    var updateUrl = $scope.$root.setup + "ledger-group/update-predefine";
    var postData = {
        'token': $scope.$root.token,
        'id': $stateParams.id,
        'type': 'ITEM_ADDITIONAL_COST'
    };

    $http
        .post(postUrl, postData)
        .then(function (res) {
            $scope.rec = res.data.response;
            $scope.rec.deletePerm = 1;
        });
    $scope.formUrl = function () {
        return "app/views/item_additional_cost/_form.html";
    }
    $scope.showLoader = false;

    $scope.update = function (rec) {
        rec.token = $scope.$root.token;
        rec.type = 'ITEM_ADDITIONAL_COST';
        $http
            .post(updateUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $timeout(function () {
                        $state.go('app.item-additional-cost', {
                            'module': $stateParams.module
                        });
                    }, 2000);
                } else {
                    toaster.pop('error', 'Edit', res.data.error);

                    $timeout(function () {
                        $state.go('app.item-additional-cost', {
                            'module': $stateParams.module
                        });
                    }, 2000);
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
                    'type': 'ITEM_ADDITIONAL_COST'
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        /* var index = arr_data.indexOf(rec.id);
                         arr_data.splice(index, 1);*/
                        $timeout(function () {
                            $state.go('app.item-additional-cost', {
                                'module': $stateParams.module
                            })
                        }, 2000);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

}


function ItemAdditionalCostSetupController($scope, $stateParams, $http, $state, $resource, toaster, $timeout, $rootScope) {

    $scope.formTitle = ' Classification';
    $scope.btnCancelUrl = 'app.setup';
    $scope.hideDel = false;

    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Intentory', 'url': 'app.setup', 'isActive': false, 'tabIndex': '6' },
            { 'name': 'Item Addition Cost Setup', 'url': '#', 'isActive': false },
            // {'name': 'Edit', 'url': '#', 'isActive': false}
        ];

    $scope.formUrl = function () {
        return "app/views/item_additional_cost/item_additional_cost_setup.html";
    }

    var postUrlref = $scope.$root.setup + "general/ref-item-additional-cost";
    var arr_additional_cost_items = {};
    $http
        .post(postUrlref, { 'token': $scope.$root.token })
        .then(function (res) {
            // console.log('el');
            // console.log(res);
            $scope.arr_additional_cost_items = res.data.response;
        });

    $scope.arr_type_commision = [];
    $scope.arr_type_commision = [{ id: 1, name: 'Yes' }, { 'id': 2, name: 'No' }];


    $scope.update = function () {
        var rec = {};
        var updateUrl = $scope.$root.setup + "general/add-active-item-additional-cost";
        rec.token = $rootScope.token;
        rec.statuss = 1;

        rec.arr_additional_cost_items = $scope.arr_additional_cost_items;

        $http
            .post(updateUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    //$timeout(function () {
                    //    $state.go('app.srm-classification');
                    //}, 1000);
                }
                else
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));


            });
    }
}