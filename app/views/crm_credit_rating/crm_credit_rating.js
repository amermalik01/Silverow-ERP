myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {

        $stateProvider
            .state('app.crm-credit-rating', {
                url: '/crm-credit-rating/:filter_id',
                title: 'Setup',
                templateUrl: helper.basepath('crm_credit_rating/crm_credit_rating.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.add-crm-credit-rating', {
                url: '/crm-credit-rating/add',
                title: 'Setup',
                templateUrl: helper.basepath('add.html'),
                controller: 'CreditRatingAddController'
            })
            .state('app.view-crm-credit-rating', {
                url: '/crm-credit-rating/:id/view',
                title: 'Setup',
                templateUrl: helper.basepath('view.html'),
                resolve: angular.extend(helper.resolveFor('ngDialog'), {
                    tpl: function () {
                        return { path: helper.basepath('ngdialog-template.html') };
                    }
                }),
                controller: 'CreditRatingViewController'
            })
            .state('app.edit-crm-credit-rating', {
                url: '/crm-credit-rating/:id/edit',
                title: 'Setup',
                templateUrl: helper.basepath('edit.html'),
                controller: 'CreditRatingEditController'
            })

    }]);


CreditRatingControllerListing.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];

myApp.controller('CreditRatingControllerListing', CreditRatingControllerListing);
function CreditRatingControllerListing($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams) {

    $scope.$root.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
            { 'name': 'Credit Ratings', 'url': '#', 'isActive': false }];

    var Api = $scope.$root.setup + "credit-rating/listings";


    var vm = this;
    $scope.postData = {};

    $scope.postData = {
        'token': $scope.$root.token,
        'all': "1"
    };
    $scope.$watch("MyCustomeFilters", function () {
        if ($scope.MyCustomeFilters && $scope.table.tableParams5) {
            $scope.table.tableParams5.reload();
        }
    }, true);
    $scope.MyCustomeFilters = {}

    vm.tableParams5 = new ngParams({
        page: 1,            // show first page
        count: $scope.$root.pagination_limit,           // count per page
        filter: {
            name: '',
            age: ''
        }
    },
        {
            total: 0,           // length of data
            counts: [],         // hide page counts control

            getData: function ($defer, params) {
                ngDataService.getDataCustom($defer, params, Api, $filter, $scope, $scope.postData);
            }
        });

    function toTitleCase(str) {
        var title = str.replace('_', ' ');
        return title.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }


    $scope.getItem = function (parm) {
        $scope.rec = {};
        $scope.rec.token = $scope.$root.token;
        if (parm == 'all') {
            $scope.rec = {};
            $scope.rec.token = $scope.$root.token;
        }
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
    $scope.$data = {};
    $scope.delete = function (id, index, $data) {
        var delUrl = $scope.$root.setup + "credit-rating/delete-credit_rating";
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

myApp.controller('CreditRatingAddController', CreditRatingAddController);
myApp.controller('CreditRatingViewController', CreditRatingViewController);
myApp.controller('CreditRatingEditController', CreditRatingEditController);

function CreditRatingAddController($scope, $stateParams, $http, $state, toaster, $timeout) {

    $scope.formTitle = 'Credit Rating';
    $scope.btnCancelUrl = 'app.crm-credit-rating';

    $scope.breadcrumbs =
        [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
        { 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
        { 'name': 'Credit Ratings', 'url': 'app.crm-credit-rating', 'isActive': false }];
    // {'name': 'Add', 'url': '#', 'isActive': false}];

    $scope.formUrl = function () {
        return "app/views/crm_credit_rating/_form.html";
    }

    $scope.rec = {};
    $scope.predefine_types = {};



    $scope.add = function (rec) {

        var postUrl = $scope.$root.setup + "credit-rating/add-credit_rating";

        rec.token = $scope.$root.token;
        $http
            .post(postUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $timeout(function () {
                        $state.go('app.crm-credit-rating');
                    }, 1000);
                }
                else
                    toaster.pop('error', 'Add', res.data.error);
                // toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
            });
    }
}

function CreditRatingViewController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {
    $scope.formTitle = 'Credit Rating';
    $scope.btnCancelUrl = 'app.crm-credit-rating';
    $scope.hideDel = false;
    $scope.showLoader = true;
    $scope.breadcrumbs =
        [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
        { 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
        { 'name': 'Credit Ratings', 'url': 'app.crm-credit-rating', 'isActive': false }];
    // {'name': 'Detail', 'url': '#', 'isActive': false}];


    $scope.gotoEdit = function () {
        $state.go("app.edit-crm-credit-rating", { id: $stateParams.id });
    };


    $scope.rec = {};
    $scope.predefine_types = {};
    //var postUrl = $scope.$root.setup + "ledger-group/get-predefine";
    var postUrl = $scope.$root.setup + "credit-rating/get-credit_rating-byid";

    var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };

    $http
        .post(postUrl, postData)
        .then(function (res) {

            if (res.data.ack == true) {
                $scope.rec = res.data.response;
            }
            $scope.showLoader = false;
        });


    $scope.formUrl = function () {
        return "app/views/crm_credit_rating/_form.html";
    }


    $scope.delete = function (id, rec, arr_data) {
        var delUrl = $scope.$root.setup + "credit-rating/delete-credit_rating";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token, 'type': 'BUYING_GROUP' })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        $timeout(function () {
                            $state.go('app.crm-credit-rating');
                        }, 3000);
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

function CreditRatingEditController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {

    $scope.formTitle = 'Credit Rating';
    $scope.btnCancelUrl = 'app.crm-credit-rating';
    $scope.hideDel = false;
    $scope.showLoader = true;
    $scope.breadcrumbs =
        [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
        { 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
        { 'name': 'Credit Ratings', 'url': 'app.crm-credit-rating', 'isActive': false }];
    // {'name': 'Edit', 'url': '#', 'isActive': false}];


    $scope.rec = {};
    $scope.predefine_types = {};

    var postUrl = $scope.$root.setup + "credit-rating/get-credit_rating-byid";


    var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };

    $http
        .post(postUrl, postData)
        .then(function (res) {

            if (res.data.ack == true) {
                $scope.rec = res.data.response;
                $scope.rec.deletePerm = 1;
            }
            $scope.showLoader = false;
        });


    $scope.formUrl = function () {
        return "app/views/crm_credit_rating/_form.html";
    }


    $scope.update = function (rec) {
        var updateUrl = $scope.$root.setup + "credit-rating/update-credit_rating";

        rec.token = $scope.$root.token;
        $http
            .post(updateUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $timeout(function () { $state.go('app.crm-credit-rating'); }, 1000);
                } else if (res.data.ack == 2) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $timeout(function () { $state.go('app.crm-credit-rating'); }, 1000);
                }
                else
                    toaster.pop('error', 'Edit', res.data.error);
            });
    }

    $scope.delete = function (id, rec, arr_data) {
        var delUrl = $scope.$root.setup + "credit-rating/delete-credit_rating";

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        $timeout(function () { $state.go('app.crm-credit-rating'); }, 1000);
                    }
                    else
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };
}