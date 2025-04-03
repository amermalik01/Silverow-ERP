myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {

        $stateProvider
                .state('app.help', {
                    url: '/help/',
                    title: 'Help',
                    templateUrl: helper.basepath('help/help.html'),
                    resolve: helper.resolveFor('ngDialog')//,
//                    controller: 'ContactController'
                })
                .state('app.addhelp', {
                    url: '/help/add',
                    title: 'Add Help',
                    templateUrl: helper.basepath('help/_form.html'),
                    resolve: helper.resolveFor('ngDialog')//,
//                    controller: 'ContactController'
                })
    }]);

myApp.controller('HelpController', ['$scope', '$window', '$stateParams', '$filter', '$http', '$rootScope', 'ngDialog', "toaster","$timeout", function ($scope, $window, $stateParams, $filter, $http, $rootScope, ngDialog, toaster,$timeout){

        $scope.breadcrumbs =
                [{'name': 'Help', 'url': '#', 'isActive':false}];

        $scope.allParents = {};
        $scope.childs = {};
        $scope.contentChilds = {};
        $scope.searchChilds = {};
        $scope.showLoader = true;
        $scope.id = "";
        $scope.parenId = "";
        $scope.name = "";
        $scope.description = "";
        $scope.sid = "";
        $scope.sname = "";
        $scope.sdescription = "";
        $scope.showsearch = false;
        $scope.search = {};
        $scope.keywords = "";


        $scope.increaseLevel = function () {
            $scope.level = $scope.level + 1;
        };
        $scope.initLevel = function () {
            $scope.level = 1;
        };
        $scope.getAllParents = function () {
            $scope.showsearch = false;
            $scope.showLoader = true;
            var helpData = {token: $rootScope.token};
            var helpPath = $rootScope.com + 'help/allparents';
            $http.post(helpPath, helpData).then(function (result) {
                $scope.allParents = result.data.parents;
                $scope.childs = result.data.childs;
                $scope.showLoader = false;
            });
        };

        $scope.getChild = function (pid) {
            $scope.showLoader = true;
            var helpData = {pid: pid, token: $rootScope.token};
            var helpPath = $rootScope.com + 'help/childs';
            $http.post(helpPath, helpData).then(function (result) {
                $scope.contentChilds = result.data;
                $scope.showLoader = false;
            });
        };
        $scope.getSearchChild = function (pid) {
            $scope.showLoader = true;
            var helpData = {pid: pid, token: $rootScope.token};
            var helpPath = $rootScope.com + 'help/childs';
            $http.post(helpPath, helpData).then(function (result) {
                $scope.searchChilds = result.data;
                $scope.showLoader = false;
            });
        };

        $scope.showDetails = function (name, description, id) {
            $scope.showsearch = false;
            $scope.edithelp = false;
            $scope.name = name;
            $scope.description = description;
            $scope.id = id;
            $scope.getChild(id);
        };

        $scope.showSearchDetails = function (name, description, id) {
            $scope.showsearch = true;
            $scope.sname = name;
            $scope.sdescription = description;
            $scope.sid = id;
            $scope.getSearchChild(id);
        };

        $scope.toggle_it = function (id) {
            var child = id + "_1";

            if (angular.element('#' + child).css('display') == 'none') {
                // $scope.hideAllParents();
                if (angular.element("#" + child).length) {
                    angular.element("#" + child).css("display", 'block');
                    angular.element('#'+id).removeClass('fa-angle-right');
                    angular.element('#'+id).addClass('fa-angle-down');
//                    angular.element(".level1").removeClass('sidbar_active');
//                    angular.element("#" + id + "_sidebar").addClass('sidbar_active');
                }
            } else {
                // $scope.hideAllParents();
                if (angular.element("#" + child).length) {
                    angular.element("#" + child).css("display", 'none');
                    angular.element('#'+id).removeClass('fa-angle-down');
                    angular.element('#'+id).addClass('fa-angle-right');
                    
//                    angular.element(".level1").removeClass('sidbar_active');
                }
            }
        };


        $scope.toggle_parent = function (id) {
            console.log(id);
            var child = id + "_1";
            if (angular.element('#' + child).css('display') == 'none') {
                //$scope.hideAllParents();
                if (angular.element("#" + child).length) {
                    angular.element("#" + child).css("display", 'block');
                    angular.element('#'+id).removeClass('fa-angle-right');
                    angular.element('#'+id).addClass('fa-angle-down');
                    angular.element(".level1").removeClass('sidbar_active');
                    angular.element("#" + id + "_sidebar").addClass('sidbar_active');
                }
            } else {
                //$scope.hideAllParents();
                if (angular.element("#" + child).length) {
                    angular.element("#" + child).css("display", 'none');
                    angular.element('#'+id).removeClass('fa-angle-down');
                    angular.element('#'+id).addClass('fa-angle-right');
                    angular.element(".level1").removeClass('sidbar_active');
                }
            }
        };

        $scope.hideAllParents = function () {
            angular.element('.help-parents').hide();
        };

        $scope.toggleChild = function (id) {
            if (angular.element('#' + id).css('display') == 'none') {
                angular.element('#' + id).css('display', 'block')
            } else {
                angular.element('#' + id).css('display', 'none')
            }
        };

        $scope.getSearch = function () {
            if ($.trim($scope.keywords) != "") {
                $scope.showLoader = true;
                var helpData = {keywords: $scope.keywords, token: $rootScope.token};
                var helpPath = $rootScope.com + 'help/search';
                $http.post(helpPath, helpData).then(function (result) {
                    $scope.showsearch = true;
                    $scope.search = result.data;
                    $scope.showLoader = false;
                });
            } else {
                toaster.pop('error', 'Search', 'Please enter your keyword.');
            }

        };

        $scope.formdata = {};
        $scope.formdata.id = "";
        $scope.formdata.name = "";
        $scope.formdata.description = "";
        $scope.formdata.parent = "";

        $scope.addHelp = function () {
            $scope.showLoader = true;
            var iframeid = angular.element('#editorpanel iframe').attr('id');
            var mailBody = angular.element("#" + iframeid).contents().find("#tinymce").html();
            if ($.trim($scope.formdata.name) == "") {
                toaster.pop('error', 'Search', 'Please enter module name.');
            } else if ($.trim(mailBody) == "") {
                toaster.pop('error', 'Search', 'Please enter module description.');
            } else {
                var helpData = {name: $scope.formdata.name, description: mailBody, parent: $scope.formdata.parent, token: $rootScope.token};
                var helpPath = $rootScope.com + 'help/add';
                $http.post(helpPath, helpData).then(function (result) {
                    toaster.pop('success', 'Add Help', 'Module has been added successfully.');
                    $scope.formdata.name = "";
                    $scope.formdata.parent = "";
                    var iframeid = angular.element('#editorpanel iframe').attr('id');
                    var mailBody = angular.element("#" + iframeid).contents().find("#tinymce").html('');
                    $scope.getAllParents();
                    $scope.showLoader = false;

                });
            }
        };

        $scope.allItems = {};
        $scope.getAllItems = function () {
            var helpData = {token: $rootScope.token};
            var helpPath = $rootScope.com + 'help/allitems';
            $http.post(helpPath, helpData).then(function (result) {
                $scope.allItems = result.data;
            });
        };
        $scope.edithelp = false;
        $scope.deleteHelp = function () {
            $scope.showLoader = true;
            var helpData = {id: $scope.id, token: $rootScope.token};
            var helpPath = $rootScope.com + 'help/delete';
            $http.post(helpPath, helpData).then(function (result) {
                toaster.pop('success', 'Delete Help', 'Module has been deleted successfully.');
                $scope.name = "";
                $scope.description = "";
                var iframeid = angular.element('#editorpanel iframe').attr('id');
                var mailBody = angular.element("#" + iframeid).contents().find("#tinymce").html('');
                $scope.id = "";
                $scope.getAllParents();
                $scope.showLoader = false;
            });
        };

        $scope.getHelp = function () {
            var helpData = {id: $scope.id, token: $rootScope.token};
            var helpPath = $rootScope.com + 'help/item';
            $http.post(helpPath, helpData).then(function (result) {
                $scope.formdata.name = result.data.name;
                var iframeid = angular.element('#editorpanel iframe').attr('id');
                angular.element("#" + iframeid).contents().find("#tinymce").html(result.data.description);
                $scope.formdata.parent = result.data.parent;
            });
        };

        $scope.showEdit = function () {
            $scope.showLoader = true;
            $scope.edithelp = true;
            $scope.getHelp();
            $scope.showLoader = false;

        };

        $scope.editHelp = function () {
            $scope.showLoader = true;
            var iframeid = angular.element('#editorpanel iframe').attr('id');
            var mailBody = angular.element("#" + iframeid).contents().find("#tinymce").html();
            if ($.trim($scope.formdata.name) == "") {
                toaster.pop('error', 'Search', 'Please enter module name.');
            } else if ($.trim(mailBody) == "") {
                toaster.pop('error', 'Search', 'Please enter module description.');
            } else {
                var helpData = {id: $scope.id, name: $scope.formdata.name, description: mailBody, parent: $scope.formdata.parent, token: $rootScope.token};
                var helpPath = $rootScope.com + 'help/edit';
                $http.post(helpPath, helpData).then(function (result) {
                    toaster.pop('success', 'Edit Help', 'Module has been edited successfully.');
                    $scope.formdata.name = "";
                    $scope.formdata.parent = "";
                    $scope.description = "";
                    var iframeid = angular.element('#editorpanel iframe').attr('id');
                    var mailBody = angular.element("#" + iframeid).contents().find("#tinymce").html('');
                    $scope.getAllParents();
                    $scope.edithelp = false;
                    $scope.showLoader = false;

                });
            }
        };

        $scope.cancelHelp = function () {
            //$scope.contentChilds = {};
            $scope.edithelp = false;
           // $scope.formdata.name = "";
            //$scope.formdata.parent = "";
            //$scope.description = "";
//            var iframeid = angular.element('#editorpanel iframe').attr('id');
//            var mailBody = angular.element("#" + iframeid).contents().find("#tinymce").html('');
        };



    }]);
