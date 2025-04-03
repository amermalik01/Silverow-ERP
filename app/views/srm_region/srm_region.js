myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {//srm_region

        $stateProvider
            .state('app.srm-region', {
                url: '/territory/:filter_id',
                title: 'Setup',
                templateUrl: helper.basepath('srm_region/srm_region.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.add-srm-region', {
                url: '/territory/add',
                title: 'Setup',
                templateUrl: helper.basepath('add.html'),
                controller: 'SRMRegionAddController'
            })
            .state('app.view-srm-region', {
                url: '/territory/:id/view',
                title: 'Setup',
                templateUrl: helper.basepath('view.html'),
                resolve: angular.extend(helper.resolveFor('ngDialog'), {
                    tpl: function () {
                        return { path: helper.basepath('ngdialog-template.html') };
                    }
                }),
                controller: 'SRMRegionViewController'
            })
            .state('app.edit-srm-region', {
                url: '/territory/:id/edit',
                title: 'Setup',
                templateUrl: helper.basepath('edit.html'),
                controller: 'SRMRegionEditController'
            })

    }]);


SRMRegionControllerListing.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];

myApp.controller('SRMRegionControllerListing', SRMRegionControllerListing);
function SRMRegionControllerListing($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams) {

    $scope.$root.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
    { 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
    { 'name': 'Territory', 'url': '#', 'isActive': false }];

    var Api = $scope.$root.setup + "region/listings";


    var vm = this;
    $scope.postData = {};

    $scope.postData = {
        'token': $scope.$root.token,
        'type': 3,
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
        //$scope.rec.region_id = $scope.rec.region !=undefined? $scope.rec.region.id:'';
        //$scope.rec.category_id = $scope.rec.category !=undefined? $scope.rec.category.id:'';
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
        var delUrl = $scope.$root.setup + "srm_region/delete-region";
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

myApp.controller('SRMRegionAddController', SRMRegionAddController);
myApp.controller('SRMRegionViewController', SRMRegionViewController);
myApp.controller('SRMRegionEditController', SRMRegionEditController);

function SRMRegionAddController($scope, $stateParams, $http, $state, toaster, $timeout) {

    $scope.formTitle = 'Region';
    $scope.btnCancelUrl = 'app.srm-region';

    $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
    { 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
    { 'name': 'Territory', 'url': 'app.srm-region', 'isActive': false }];

    $scope.formUrl = function () {
        return "app/views/srm_region/_form.html";
    }

    $scope.rec = {};
    $scope.predefine_types = {};



    $scope.add = function (rec) {

        var postUrl = $scope.$root.setup + "region/add-region";
        rec.region_type = 34;
        rec.token = $scope.$root.token;
        $http
            .post(postUrl, rec)
            .then(function (res) {

                if (res.data.ack == true) {

                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $timeout(function () {
                        $state.go('app.srm-region');
                    }, 3000);
                }
                else
                    toaster.pop('error', 'Add', res.data.error);
                // toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
            });
    }
}

function SRMRegionViewController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {
    $scope.formTitle = 'Region';
    $scope.btnCancelUrl = 'app.srm-region';
    $scope.hideDel = false;
    $scope.showLoader = true;

    /* $scope.breadcrumbs = [{ 'name': 'Setup', 'url': '#', 'isActive': false },
    { 'name': 'Purchases', 'url': '#', 'isActive': false, 'tabIndex': '4' },
    { 'name': 'Territory', 'url': 'app.srm-region', 'isActive': false }]; */
    $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
    { 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
    { 'name': 'Territory', 'url': 'app.srm-region', 'isActive': false }];


    $scope.gotoEdit = function () {
        $state.go("app.edit-srm-region", { id: $stateParams.id });
    };


    $scope.rec = {};
    $scope.predefine_types = {};
    //var postUrl = $scope.$root.setup + "ledger-group/get-predefine";
    var postUrl = $scope.$root.setup + "region/get-region-byid";

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
        return "app/views/srm_region/_form.html";
    }


    $scope.delete = function (id, rec, arr_data) {
        var delUrl = $scope.$root.setup + "region/delete-region";
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
                            $state.go('app.srm-region');
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

function SRMRegionEditController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {

    $scope.formTitle = 'Region';
    $scope.btnCancelUrl = 'app.srm-region';
    $scope.hideDel = false;
    $scope.showLoader = true;

    /* $scope.breadcrumbs = [{ 'name': 'Setup', 'url': '#', 'isActive': false },
    { 'name': 'Purchases', 'url': '#', 'isActive': false },
    { 'name': 'Territory', 'url': 'app.srm-region', 'isActive': false }]; */
    $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
    { 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
    { 'name': 'Territory', 'url': 'app.srm-region', 'isActive': false }];

    $scope.rec = {};
    $scope.predefine_types = {};

    var postUrl = $scope.$root.setup + "region/get-region-byid";


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
        return "app/views/srm_region/_form.html";
    }


    $scope.update = function (rec) {
        var updateUrl = $scope.$root.setup + "region/update-region";

        rec.token = $scope.$root.token;
        $http
            .post(updateUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));

                    $timeout(function () {
                        $state.go('app.srm-region');
                    }, 1000);

                } else if (res.data.ack == 2) {
                    toaster.pop('success', 'Edit', 'Record Update with no changes');
                    $timeout(function () {
                        $state.go('app.srm-region');
                    }, 1000);
                }
                else
                    toaster.pop('error', 'Edit', res.data.error);
            });
    }

    $scope.delete = function (id, rec, arr_data) {
        var delUrl = $scope.$root.setup + "region/delete-region";

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        $timeout(function () {
                            $state.go('app.srm-region');
                        }, 1000);
                    } else {
                        toaster.pop('error', 'Deleted', res.data.error);
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };
}