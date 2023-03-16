ShowHideAddBtnController.$inject = ["$scope", "$rootScope", "$filter", "$resource", "$timeout", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.show_hide_btn', {
                url: '/show_hide_btn',
                title: 'Setup',
                resolve: helper.resolveFor('ngDialog'),
                templateUrl: helper.basepath('show_hide_add_btn/show_hide_add_btn.html')
            })
            .state('app.add-ShowHideAddBtn', {
                url: '/show_hide_btn/add',
                title: 'Setup',
                templateUrl: helper.basepath('add.html'),
                resolve: helper.resolveFor('ngDialog'),
                controller: 'ShowHideAddBtnAddController'
            })

    }]);

myApp.controller('ShowHideAddBtnController', ShowHideAddBtnController);
myApp.controller('ShowHideAddBtnAddController', ShowHideAddBtnAddController);

function ShowHideAddBtnController($scope, $rootScope, $filter, $resource, $timeout, $http, ngDialog, toaster) {
    
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            {'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex':'1'},
            {'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex':'3'},
            { 'name': 'Manage Add Buttons', 'url': '#', 'isActive': false}];

    var vm = this;
    var Api = $scope.$root.setup + "general/get-show-hide-add-btn";
    $scope.check_readonly = true;
    $scope.showLoader = true;
    $scope.rec = {};
    $http
        .post(Api, {'token':$scope.$root.token})
        .then(function (res) {
            if (res.data.ack == true) {
                $scope.check_readonly = true;
                $scope.showLoader = false;
                $scope.rec.show_sales_add_btn = Number(res.data.response.show_sales_add_btn) > 0 ? true : false;
                $scope.rec.show_customer_add_btn = Number(res.data.response.show_customer_add_btn) > 0 ? true : false;
                $scope.rec.show_supplier_add_btn = Number(res.data.response.show_supplier_add_btn) > 0 ? true : false;
            }
        });
    
    $scope.ShowEditForm = function()
    {
        $scope.check_readonly = false;
    }
    $scope.add = function ()
    {
        var addAPI = $scope.$root.setup + "general/update-show-hide-add-btn";
        var postData = {};
        postData.token = $scope.$root.token;
        postData.show_sales_add_btn = ($scope.rec.show_sales_add_btn == true) ? 1 : 0;
        postData.show_customer_add_btn = ($scope.rec.show_customer_add_btn == true) ? 1 : 0;
        postData.show_supplier_add_btn = ($scope.rec.show_supplier_add_btn == true) ? 1 : 0;
      
        $scope.showLoader = true;
        $http
            .post(addAPI, postData)
            .then(function (res) {
                if (res.data.ack >0) {
                    $scope.check_readonly = true;
                    $scope.showLoader = false;
                    /*
                    $rootScope.$storage.setItem("show_sales_add_btn", postData.show_sales_add_btn);
                    $rootScope.$storage.setItem("show_customer_add_btn", postData.show_customer_add_btn);
                    $rootScope.$storage.setItem("show_supplier_add_btn", postData.show_supplier_add_btn);
                    */
                    $rootScope.confirm_logout_modal = "To implement these changes, you will be automatically logged out.";

                    ngDialog.openConfirm({
                        template: '_confirm_logout_modal',
                        className: 'ngdialog-theme-default-custom'
                    }).then(function (value) {
                        $rootScope.token = 0;

                        for (var prop in $rootScope) {
                            if (prop.substring(0, 1) !== '$') {
                                delete $rootScope[prop];
                            }
                        }

                        $rootScope.$storage.clear();
                        $rootScope = undefined;
                        console.log('logout' + $rootScope);
                        location.reload();
                    },
                    function (reason) {
                        console.log('Modal promise rejected. Reason: ', reason);
                    });
                }
                else
                {
                    $scope.showLoader = false;
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(545));
                }
            });
    }
    
    $scope.change_passwords = function()
    {
        var Api = $scope.$root.setup + "general/change-all-passwords";
        $http
            .post(Api, { 'token': $scope.$root.token })
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', 'Passwords Changed Successfully');
                }
            });
    }
}

function ShowHideAddBtnAddController($scope, $stateParams, $http, $state, toaster,$timeout){

    /* $scope.formTitle = 'Segment';
    $scope.btnCancelUrl = 'app.segment';

    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            {'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex':'1'},
            {'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex':'3'},
            {'name': 'Segments', 'url': 'app.segment', 'isActive': false}];
            // {'name': 'Add', 'url': '#', 'isActive': false}];

    $scope.formUrl = function () {
        return "app/views/segment/_form.html";
    }

    $scope.rec = {};
    $scope.predefine_types = {};
    var postUrl = $scope.$root.setup + "ledger-group/add-predefine";

    $scope.add = function (rec) {
        rec.token = $scope.$root.token;
        rec.type = 'SEGMENT';
        $http
            .post(postUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $timeout(function () {
                        $state.go('app.segment');
                    },1000);
                }
                else
                    toaster.pop('error', 'Add', res.data.error);
                   // toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
            });
    } */
}


