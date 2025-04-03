SocialMediaTitleController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
             .state('app.crm-social-media', {
                 url: '/crmsocialmedia',
                 title: 'Social Media',
                 templateUrl: helper.basepath('social_media/social_media.html'),
                 resolve: helper.resolveFor('ngTable', 'ngDialog')
             })
             .state('app.addcrm-social-media', {
                 url: '/crmsocialmedia/add',
                 title: 'Add Social Media',
                 templateUrl: helper.basepath('edit.html'),
                 controller: 'SocialMediaControllerEdit'
             })
             .state('app.view-crm-social-media', {
                 url: '/crmsocialmedia/:id/view',
                 title: 'View Job Title ',
                 templateUrl: helper.basepath('edit.html'),
                 resolve: helper.resolveFor('ngDialog'),
                 controller: 'SocialMediaControllerEdit'
             })
             .state('app.edit-crm-social-media', {
                 url: '/crmsocialmedia/:id/edit',
                 title: 'Edit Social Media',
                 templateUrl: helper.basepath('edit.html'),
                 resolve: helper.resolveFor('ngDialog'),
                 controller: 'SocialMediaControllerEdit'
             })

    }]);

myApp.controller('SocialMediaTitleController', SocialMediaTitleController);
myApp.controller('SocialMediaControllerEdit', SocialMediaControllerEdit);

function SocialMediaTitleController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
    'use strict';
    $scope.breadcrumbs =
         [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
             {'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1'},
             {'name': 'General', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1'},
             {'name': 'Social Media ', 'url': '#', 'isActive': false}];

    var vm = this;
    var Api = $scope.$root.sales + "crm/crm/social-medias";
    var postData = {
        'token': $scope.$root.token,
        'all': "1"
    };

    // $scope.$watch("MyCustomeFilters", function () {
    //     if ($scope.MyCustomeFilters && $scope.table.tableParams5) {
    //         $scope.table.tableParams5.reload();
    //     }
    // }, true);

    // $scope.MyCustomeFilters = {};

    // vm.tableParams5 = new ngParams({
    //     page: 1, // show first page
    //     count: $scope.$root.pagination_limit, // count per page
    //     filter: {
    //         // name: 'desc',
    //         name: 'desc',
    //         age: ''
    //     }
    // }, {
    //     total: 0, // length of data
    //     counts: [], // hide page counts control

    //     getData: function ($defer, params) {

    //         ngDataService.getDataCustom($defer, params, Api, $filter, $scope, postData);
    //     }
    // });

    $scope.res_socialmedia = "";
    $scope.getSocialMedia = function()
    {
        $http
         .post(Api, {'token': $scope.$root.token})
         .then(function (res) {
             if (res.data.ack == true) {
                $scope.res_socialmedia = res.data.response;
                console.log(res);
             }
         });
    }
    $scope.getSocialMedia();


    $scope.$data = {};
    $scope.delete = function (id, index, $data) {
        var delUrl = $scope.$root.sales + "crm/crm/delete-social-media";
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


function SocialMediaControllerEdit($scope, $stateParams, $http, $state, $resource, toaster, ngDialog,$timeout){

    $scope.formTitle = 'social_media';
    $scope.btnCancelUrl = 'app.crm-social-media';
    $scope.hideDel = false;

    $scope.check_readonly = false;
//    if ($stateParams.id > 0)
//        $scope.check_readonly = true;
//
//
//    $scope.gotoEdit = function () {
//        $scope.check_readonly = false;
//        //$scope.perreadonly = true;
//    }


    $scope.breadcrumbs =
         [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
             {'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1'},
             {'name': 'General', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1'},
             {'name': 'Social Media', 'url': 'app.crm-social-media', 'isActive': false}];

    $scope.formUrl = function () {
        return "app/views/social_media/_form.html";
    }

    $scope.rec = {};
    $scope.arr_status = [];
    $scope.arr_status = [{'label': 'Active', 'value': 1}, {'label': 'inActive', 'value': 0}];
    $scope.rec.status = $scope.arr_status[0];
    $scope.arr_type = [{'label': 'HR', 'value': 1}, {'label': 'Opp cycle', 'value': 2}];
    $scope.rec.type = $scope.arr_type[1];

    var postUrl = $scope.$root.sales + "crm/crm/get-crm-social-media-by-id";
    var postData = {'token': $scope.$root.token, 'id': $stateParams.id};
    if ($stateParams.id !== undefined) {
        $http
             .post(postUrl, postData)
             .then(function (res) {
                 $scope.rec = res.data.response;
                 $timeout(function () {
                     $scope.$root.$apply(function () {

//                     $.each($scope.arr_status, function (index, obj) {
//                         if (obj.value == res.data.response.status)
//                             $scope.rec.status = obj;
//                     });

//                     $.each($scope.arr_type, function (index, obj) {
//                         if (obj.value == res.data.response.type)
//                             $scope.rec.type = obj;
//                     });
                     }, 2000);
                 });
             });
    }


    $scope.$data = {};
    $scope.delete = function (id, index, $data) {
        var delUrl = $scope.$root.sales + "crm/crm/delete-social-media";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                 .post(delUrl, {id: id, 'token': $scope.$root.token})
                 .then(function (res) {
                     if (res.data.ack == true) {
                         toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                         // $data.splice(index, 1);
                         $state.go('app.crm-social-media');
                     }
                     else {
                         toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                     }
                 });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };



    $scope.update = function (rec) {
        var updateUrl = $scope.$root.sales + "crm/crm/add-social-media";
        if ($stateParams.id)
            var updateUrl = $scope.$root.sales + "crm/crm/update-social-media";

        rec.token = $scope.$root.token;
        rec.statuss = 1;//$scope.rec.status.value !== undefined ? $scope.rec.status.value : 0;
        rec.types = 2;//$scope.rec.type !== undefined ? $scope.rec.type.value : 0;

        $http
             .post(updateUrl, rec)
             .then(function (res) {
                 if (res.data.ack == true) {
                     toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                     $timeout(function () {
                         $state.go('app.crm-social-media');
                     }, 1000);
                 }
                 else
                     toaster.pop('success', 'Edit', res.data.error);


             });
    }

}


