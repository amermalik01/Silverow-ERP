GLUnitsOfMeasureController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "toaster", "ngDialog"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.gl_units_of_measure', {
                url: '/gl_units_of_measure',
                title: 'Setup',
                templateUrl: helper.basepath('gl_units_of_measure/gl_units_of_measure.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.gladdUnitsOfMeasure', {
                url: '/gl_units_of_measure/add',
                title: 'Setup',
                templateUrl: helper.basepath('add.html'),
                controller: 'GLUnitsOfMeasureAddController'
            })
            .state('app.glviewUnitsOfMeasure', {
                url: '/gl_units_of_measure/:id/view',
                title: 'Setup',
                templateUrl: helper.basepath('view.html'),
                resolve: angular.extend(helper.resolveFor('ngDialog'), {
                    tpl: function () {
                        return { path: helper.basepath('ngdialog-template.html') };
                    }
                }),
                controller: 'GLUnitsOfMeasureViewController'
            })
            .state('app.gleditUnitsOfMeasure', {
                url: '/gl_units_of_measure/:id/edit',
                title: 'Setup',
                templateUrl: helper.basepath('edit.html'),
                controller: 'GLUnitsOfMeasureEditController'
            })

    }]);
/*,
 controller: 'GLUnitsOfMeasureController'*/

myApp.controller('GLUnitsOfMeasureController', GLUnitsOfMeasureController);
myApp.controller('GLUnitsOfMeasureAddController', GLUnitsOfMeasureAddController);
myApp.controller('GLUnitsOfMeasureViewController', GLUnitsOfMeasureViewController);
myApp.controller('GLUnitsOfMeasureEditController', GLUnitsOfMeasureEditController);

function GLUnitsOfMeasureController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, toaster, ngDialog) {
    'use strict';

    // required for inner references
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Finance', 'url': 'app.setup', 'isActive': false, 'tabIndex': '2' },
            { 'name': 'Unit Of Measure for G/L', 'url': '#', 'isActive': false }];

    var vm = this;

    // For one time fetching data
    //var Api = $resource('api/company/get_listing/:module_id/:module_table');

    // On Filter Dropdown change

    var Api = $scope.$root.setup + "general/gl-units-of-measure";


    //console.log ( 'URL='+Api );
    //return false;

    var postData = {
        'token': $scope.$root.token,
        'all': "1"
    };


    $scope.$watch("MyCustomeFilters", function () {
        if ($scope.MyCustomeFilters && $scope.table.tableParams5) {
            $scope.table.tableParams5.reload();
        }
    }, true);
    $scope.MyCustomeFilters = {}

    //$scope.reload();

    vm.tableParams5 = new ngParams({
        page: 1,            // show first page
        count: $scope.$root.pagination_limit,           // count per page
        filter: {
            name: '',
            age: ''
        }
    }, {
            total: 0,           // length of data
            counts: [],         // hide page counts control

            getData: function ($defer, params) {
                ngDataService.getDataCustom($defer, params, Api, $filter, $scope, postData);
            }
        });

    $scope.$data = {};
    $scope.deleteUnit = function (id, index, $data) {
        var delUrl = $scope.$root.setup + "general/delete-gl-units-of-measure";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { 'token': $scope.$root.token, id: id })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        $data.splice(index, 1);
                    }
                    else {
                        // toaster.pop('error', 'Info', "This category is used by another module!");
                        toaster.pop('error', 'Error', res.data.error);
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };


}

function GLUnitsOfMeasureAddController($scope, $stateParams, $http, $state, toaster, $timeout) {
    //alert("Here");
    $scope.btnCancelUrl = 'app.gl_units_of_measure';
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Finance', 'url': 'app.setup', 'isActive': false, 'tabIndex': '2' },
            { 'name': 'Unit Of Measure for G/L', 'url': 'app.gl_units_of_measure', 'isActive': false }];
    // { 'name': 'Add', 'url': '#', 'isActive': false }];

    $scope.formUrl = function () {
        return "app/views/gl_units_of_measure/_form.html";
    }

    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];

    var postUrl = $scope.$root.setup + "general/add-gl-units-of-measure";
    var unitUrl = $scope.$root.setup + "general/get-all-gl-units-of-measure";

    $scope.rec = {};
    $scope.unit_measures = {};
    $scope.parent_id = {};

    $http
        .post(unitUrl, { 'token': $scope.$root.token })
        .then(function (res) {
            if (res.data.ack == true) {
                $scope.unit_measures = res.data.response;
                //$scope.country = $scope.countries[data.selected_comp];
            }
            /*else
                toaster.pop('error', 'Error', "No G/L units of measure found!");*/
        });

    angular.forEach($scope.arr_status, function (obj) {
        if (obj.value == 1)
            $scope.rec.status = obj;
    });

    $scope.add = function (rec) {
        rec.token = $scope.$root.token;
        rec.parent_id = 0;
        // rec.parent_id = $scope.rec.parent_id != undefined?$scope.rec.parent_id.id:0;
        rec.statusid = $scope.rec.status.value !== undefined ? $scope.rec.status.value : 0;
        $http
            .post(postUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $timeout(function () {
                        $state.go('app.gl_units_of_measure');
                    }, 1500);
                }
                else
                    toaster.pop('error', 'info', res.data.error);
            });
    }
}

function GLUnitsOfMeasureViewController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {
    $scope.btnCancelUrl = 'app.gl_units_of_measure';
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Finance', 'url': 'app.setup', 'isActive': false, 'tabIndex': '2' },
            { 'name': 'Unit Of Measure for G/L', 'url': 'app.gl_units_of_measure', 'isActive': false }];
    // { 'name': 'Detail', 'url': '#', 'isActive': false }];

    $scope.gotoEdit = function () {
        $state.go("app.gleditUnitsOfMeasure", { id: $stateParams.id });
    };


    $scope.rec = {};
    $scope.status = {};
    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];

    $scope.unit_measures = {};
    var unitUrl = $scope.$root.setup + "general/get-all-gl-units-of-measure";

    $http
        .post(unitUrl, { 'token': $scope.$root.token })
        .then(function (res) {
            if (res.data.ack == true) {
                $scope.unit_measures = res.data.response;
            }

        });


    var postUrl = $scope.$root.setup + "general/get-gl-units-of-measure";
    var postData = {
        'token': $scope.$root.token,
        'id': $stateParams.id
    };

    $http
        .post(postUrl, postData)
        .then(function (res) {
            $scope.rec = res.data.response;

            $.each($scope.unit_measures, function (index, obj) {
                if (obj.id == res.data.response.parent_id) {
                    $scope.rec.parent_id = $scope.unit_measures[index];
                }
            });

            $.each($scope.arr_status, function (index, obj) {
                if (obj.value == res.data.response.status) {
                    $scope.rec.status = $scope.arr_status[index];
                }
            });
        });

    $scope.formUrl = function () {
        return "app/views/gl_units_of_measure/_form.html";
    }


    $scope.delete = function () {
        var delUrl = $scope.$root.setup + "general/delete-gl-units-of-measure";


        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, postData)
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        $timeout(function () {
                            $state.go('app.gl_units_of_measure');
                        }, 1500);
                    }
                    else {
                        toaster.pop('error', 'Error', res.data.error);
                        /* toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                        $timeout(function () {
                            $state.go('app.gl_units_of_measure');
                        }, 1500); */
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

        //if(popupService.showPopup('Would you like to delete?')) {

        //  }*/
    };


};

function GLUnitsOfMeasureEditController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {

    $scope.btnCancelUrl = 'app.gl_units_of_measure';
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Finance', 'url': 'app.setup', 'isActive': false, 'tabIndex': '2' },
            { 'name': 'Unit Of Measure for G/L', 'url': 'app.gl_units_of_measure', 'isActive': false }];
    // { 'name': 'Edit', 'url': '#', 'isActive': false }];
    $scope.rec = {};
    $scope.status = {};
    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];


    $scope.unit_measures = {};
    var unitUrl = $scope.$root.setup + "general/get-all-gl-units-of-measure";

    $http
        .post(unitUrl, { 'token': $scope.$root.token })
        .then(function (res) {
            if (res.data.ack == true) {
                $scope.unit_measures = res.data.response;
                //console.log($scope.unit_measures);
            }

        });


    var postUrl = $scope.$root.setup + "general/get-gl-units-of-measure";
    var postData = {
        'token': $scope.$root.token,
        'id': $stateParams.id
    };

    $http
        .post(postUrl, postData)
        .then(function (res) {
            $scope.rec = res.data.response;
            $scope.rec.deletePerm = 1;

            $.each($scope.unit_measures, function (index, obj) {
                if (obj.id == res.data.response.parent_id) {
                    $scope.rec.parent_id = $scope.unit_measures[index];
                }
            });

            $.each($scope.arr_status, function (index, obj) {
                if (obj.value == res.data.response.status) {
                    $scope.rec.status = $scope.arr_status[index];
                }
            });
        });

    $scope.formUrl = function () {
        return "app/views/gl_units_of_measure/_form.html";
    }

    var updateUrl = $scope.$root.setup + "general/update-gl-units-of-measure";

    $scope.update = function (rec) {
        rec.token = $scope.$root.token;
        rec.parent_id = 0;
        // rec.parent_id = $scope.rec.parent_id != undefined?$scope.rec.parent_id.id:0;
        rec.statusid = $scope.rec.status.value !== undefined ? $scope.rec.status.value : 0;

        $http
            .post(updateUrl, rec)
            .then(function (res) {
                if (res.data.ack == 1) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $timeout(function () {
                        $state.go('app.gl_units_of_measure');
                    }, 1500);
                } else if (res.data.ack == 2) {
                    toaster.pop('error', 'Edit', res.data.error);
                } else if (res.data.ack == 0) {
                    toaster.pop('error', 'Edit', res.data.error);
                }
            });
    }


    $scope.delete = function () {
        var delUrl = $scope.$root.setup + "general/delete-gl-units-of-measure";

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default'
        }).then(function (value) {
            $http
                .post(delUrl, postData)
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        $timeout(function () {
                            $state.go('app.gl_units_of_measure');
                        }, 1500);
                    }
                    else {
                        toaster.pop('error', 'Error', res.data.error);
                        /* $timeout(function () {
                            $state.go('app.gl_units_of_measure');
                        }, 1500); */
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    };
}