myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',

    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {

        $stateProvider
            .state('app.hr_territories', {
                url: '/hr_territories/:filter_id',
                title: 'Territories',
                templateUrl: helper.basepath('hr_territories/territory.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.add-hr-territory', {
                url: '/hr_territories/add',
                title: 'Add Territory',
                templateUrl: helper.basepath('add.html'),
                controller: 'HRAddTerritoryController'
            })
            .state('app.view-hr-territories', {
                url: '/hr_territories/:id/view',
                title: 'View Territory',
                templateUrl: helper.basepath('view.html'),
                resolve: angular.extend(helper.resolveFor('ngDialog'), {
                    tpl: function () {
                        return { path: helper.basepath('ngdialog-template.html') };
                    }
                }),
                controller: 'HRViewTerritoryController'
            })
            .state('app.edit-hr-territory', {
                url: '/hr_territories/:id/edit',
                title: 'Edit Territory',
                templateUrl: helper.basepath('edit.html'),
                controller: 'HREditTerritoryController'
            })
            .state('app.holidaySettings', {
                url: '/holiday',
                title: 'Setup',
                templateUrl: helper.basepath('holiday/holiday.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: "HolidayController"
            })
    }]);

HRTerritoryControllerListing.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
HolidayController.$inject            = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];

myApp.controller('HRTerritoryControllerListing', HRTerritoryControllerListing);

function HRTerritoryControllerListing($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams) {

    // console.log("territories page");
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Human Resources', 'url': 'app.setup', 'isActive': false, 'tabIndex': '7' },
            { 'name': 'Territories', 'url': '#', 'isActive': false }];

    var Api = $scope.$root.setup + "territories_hr/listings";

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
        var delUrl = $scope.$root.setup + "territories_hr/delete-territory";
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

myApp.controller('HRAddTerritoryController', HRAddTerritoryController);
myApp.controller('HRViewTerritoryController', HRViewTerritoryController);
myApp.controller('HREditTerritoryController', HREditTerritoryController);

function HRAddTerritoryController($scope, $stateParams, $http, $state, toaster, $timeout) {

    $scope.formTitle = 'Territory';
    $scope.btnCancelUrl = 'app.hr_territories';

    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Human Resources', 'url': 'app.setup', 'isActive': false, 'tabIndex': '7' },
            { 'name': 'Territories', 'url': 'app.hr_territories', 'isActive': false },
            { 'name': 'Add', 'url': '#', 'isActive': false }
        ];

    $scope.formUrl = function () {
        return "app/views/hr_territories/_form.html";
    }

    $scope.rec = {};
    $scope.predefine_types = {};

    $scope.add = function (rec) {
        var postUrl = $scope.$root.setup + "territories_hr/add-hr-territory";
        rec.token = $scope.$root.token;
        $http
            .post(postUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $timeout(function () {
                        $state.go('app.hr_territories');
                    }, 3000);
                }
                else
                    toaster.pop('error', 'Add', res.data.error);
                // toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
            });
    }
}

function HRViewTerritoryController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {

    $scope.formTitle = 'Territories';
    $scope.btnCancelUrl = 'app.hr_territories';
    $scope.hideDel = false;
    $scope.showLoader = true;

    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Human Resources', 'url': 'app.setup', 'isActive': false, 'tabIndex': '7' },
            { 'name': 'Territories', 'url': 'app.hr_territories', 'isActive': false }
        ];

    $scope.gotoEdit = function () {
        $state.go("app.edit-hr-territory", { id: $stateParams.id });
    };

    $scope.rec = {};
    $scope.predefine_types = {};
    var postUrl = $scope.$root.setup + "territories_hr/get-territory-byid";

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
        return "app/views/hr_territories/_form.html";
    }

    $scope.delete = function (id, rec, arr_data) {
        var delUrl = $scope.$root.setup + "territories_hr/delete-territory";
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
                            $state.go('app.hr_territories');
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

function HREditTerritoryController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {

    $scope.formTitle = 'Territories';
    $scope.btnCancelUrl = 'app.hr_territories';
    $scope.hideDel = false;
    $scope.showLoader = true;
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Human Resources', 'url': 'app.setup', 'isActive': false, 'tabIndex': '7' },
            { 'name': 'Territories', 'url': 'app.hr_territories', 'isActive': false }
        ];

    $scope.rec = {};
    $scope.predefine_types = {};

    var postUrl = $scope.$root.setup + "territories_hr/get-territory-byid";

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
        return "app/views/hr_territories/_form.html";
    }

    $scope.update = function (rec) {
        var updateUrl = $scope.$root.setup + "territories_hr/update-hr-territory";

        rec.token = $scope.$root.token;
        $http
            .post(updateUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $state.go('app.hr_territories');
                }
                else
                    toaster.pop('error', 'Edit', res.data.error);
            });
    }

    $scope.delete = function (id, rec, arr_data) {
        var delUrl = $scope.$root.setup + "territories_hr/delete-territory";

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        $state.go('app.hr_territory');
                    }
                    else
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    };
}

myApp.controller('HolidayController', HolidayController);
function HolidayController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, toaster, ngDialog) {
    'use strict';

    // required for inner references
    $scope.showLoader = true;

    $scope.$root.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Human Resources', 'url': 'app.setup', 'isActive': false, 'tabIndex': '7' },
            { 'name': 'Holiday Settings', 'url': '#', 'isActive': false }];

    $scope.holidaySetupReadonly = true;
    var Api = $scope.$root.setup + "general/company-holiday-settings";
    var postData = {
        'token': $scope.$root.token
    };

    $http
        .post(Api, postData)
        .then(function (res) {
            if (res.data.ack == true) {
             
                $scope.month = res.data.holiday_start_month;    
            }
            
                $scope.showLoader = false;
        
            
        });


    $scope.updateHolidayMonth = function(){
        
        $scope.showLoader = true;
        var Api = $scope.$root.setup + "general/update-company-holiday-settings";

        var postData = {
            token: $scope.$root.token,
            month: $scope.month
        }
        $http
            .post(Api, postData)
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {
                  
                    toaster.pop('success', 'info', $scope.$root.getErrorMessageByCode(102));
                    

                }
            });
    }
}