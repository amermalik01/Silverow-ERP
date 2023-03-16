myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {

        $stateProvider
            .state('app.ownership-type', {
                url: '/ownership-type/:filter_id',
                title: 'Ownership Type',
                templateUrl: helper.basepath('crm_ownership_type/crm_ownership_type.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.add-ownership-type', {
                url: '/ownership-type/add',
                title: 'Add Ownership Type',
                templateUrl: helper.basepath('add.html'),
                controller: 'OwnershipAddController'
            })
            .state('app.view-ownership-type', {
                url: '/ownership-type/:id/view',
                title: 'View Ownership Type',
                templateUrl: helper.basepath('view.html'),
                resolve: angular.extend(helper.resolveFor('ngDialog'), {
                    tpl: function () {
                        return {path: helper.basepath('ngdialog-template.html')};
                    }
                }),
                controller: 'OwnershipViewController'
            })
            .state('app.edit-ownership-type', {
                url: '/ownership-type/:id/edit',
                title: 'Edit Ownership Type',
                templateUrl: helper.basepath('edit.html'),
                controller: 'OwnershipEditController'
            })

    }]);


OwnershipControllerListing.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];

myApp.controller('OwnershipControllerListing', OwnershipControllerListing);
function OwnershipControllerListing($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams) {

    $scope.$root.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            {'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex':'1'},
            {'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex':'3'},
            {'name': 'Ownership Type', 'url': '#', 'isActive': false}];

    var Api = $scope.$root.setup + "ownership_type/listings";


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
        var delUrl = $scope.$root.setup + "ownership_type/delete-ownership";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {id: id, 'token': $scope.$root.token})
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

myApp.controller('OwnershipAddController', OwnershipAddController);
myApp.controller('OwnershipViewController', OwnershipViewController);
myApp.controller('OwnershipEditController', OwnershipEditController);

function OwnershipAddController($scope, $stateParams, $http, $state, toaster, $timeout) {

    $scope.formTitle = 'Ownership Type';
    $scope.btnCancelUrl = 'app.ownership-type';

    $scope.breadcrumbs =
        [{'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex':'1'},
         {'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex':'3'},
         {'name': 'Ownership Type', 'url': 'app.ownership-type', 'isActive': false}, 
         {'name': 'Add', 'url': '#', 'isActive': false}];

    $scope.formUrl = function () {
        return "app/views/crm_ownership_type/_form.html";
    }

    $scope.rec = {};
    $scope.predefine_types = {};



    $scope.add = function (rec) {

        var postUrl = $scope.$root.setup + "ownership_type/add-ownership";

        rec.token = $scope.$root.token;
        $http
            .post(postUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $timeout(function () {
                        $state.go('app.ownership-type');
                    }, 3000);
                }
                else
                    toaster.pop('error', 'Add', res.data.error);
                // toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
            });
    }
}

function OwnershipViewController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {
    $scope.formTitle = 'Ownership Type';
    $scope.btnCancelUrl = 'app.ownership-type';
    $scope.hideDel = false;
    $scope.showLoader = true;
    $scope.breadcrumbs =
        [{'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex':'1'},
         {'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex':'3'},
            {'name': 'Ownership Type', 'url': 'app.ownership-type', 'isActive': false}];


    $scope.gotoEdit = function () {
        $state.go("app.edit-ownership-type", {id: $stateParams.id});
    };


    $scope.rec = {};
    $scope.predefine_types = {};
    //var postUrl = $scope.$root.setup + "ledger-group/get-predefine";
    var postUrl = $scope.$root.setup + "ownership_type/get-ownership-byid";

    var postData = {'token': $scope.$root.token, 'id': $stateParams.id};

    $http
        .post(postUrl, postData)
        .then(function (res) {

            if (res.data.ack == true) {
                $scope.rec = res.data.response;
            }
            $scope.showLoader = false;
        });


    $scope.formUrl = function () {
        return "app/views/crm_ownership_type/_form.html";
    }


    $scope.delete = function (id, rec, arr_data) {
        var delUrl = $scope.$root.setup + "ownership_type/delete-ownership";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {id: $stateParams.id, 'token': $scope.$root.token})
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        $timeout(function () {
                            $state.go('app.ownership-type');
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

function OwnershipEditController($scope, $stateParams, $http, $state, $resource, toaster, $timeout) {

    $scope.formTitle = 'Ownership Type';
    $scope.btnCancelUrl = 'app.ownership-type';
    $scope.hideDel = false;
    $scope.showLoader = true;
    $scope.breadcrumbs =
        [{'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex':'1'},
         {'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex':'3'},
            {'name': 'Ownership Type', 'url': 'app.ownership-type', 'isActive': false}];


    $scope.rec = {};
    $scope.predefine_types = {};

    var postUrl = $scope.$root.setup + "ownership_type/get-ownership-byid";


    var postData = {'token': $scope.$root.token, 'id': $stateParams.id};

    $http
        .post(postUrl, postData)
        .then(function (res) {

            if (res.data.ack == true) {
                $scope.rec = res.data.response;
            }
            $scope.showLoader = false;
        });


    $scope.formUrl = function () {
        return "app/views/crm_ownership_type/_form.html";
    }


    $scope.update = function (rec) {
        var updateUrl = $scope.$root.setup + "ownership_type/update-ownership";

        rec.token = $scope.$root.token;
        $http
            .post(updateUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $state.go('app.ownership-type');
                }
                else
                    toaster.pop('error', 'Edit', res.data.error);
            });
    }

    $scope.delete = function (id, rec, arr_data) {
        var delUrl = $scope.$root.setup + "ownership_type/delete-ownership";

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {id: $stateParams.id, 'token': $scope.$root.token})
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        $state.go('app.ownership-type');
                    }
                    else
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };
}