myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.autoEmailSetup', {
                url: '/auto-email-setup/:module',
                title: 'Setup',
                templateUrl: helper.basepath('auto_email_setup/auto_email_setup.html'),
                controller: 'AutoEmailSetup',
                resolve: helper.resolveFor('ngTable', "ngDialog")
            })
    }]);

/*ModuleCodeEditController*/

/*
 templateUrl: helper.basepath('edit.html'),*/

AutoEmailSetup.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "ngTableDataService", "$http", "ngDialog", "toaster", "$stateParams"];
myApp.controller('AutoEmailSetup', AutoEmailSetup);
function AutoEmailSetup($scope, $filter, ngParams, $resource, ngDataService, $http, ngDialog, toaster, $stateParams) {
    'use strict';

    $scope.salesSubModules = [
        "Sales Quotes",
        "Sales Orders",
        "Sales Invoices",
        "Credit Notes",
        "Posted Credit Notes",
        "Delivery Notes",
        "Warehouse Instructions",
        "Customer Statement"
    ]

    $scope.purchasesSubModules = [
        "Purchase Orders",
        "Purchase Invoices",
        "Debit Notes",
        "Posted Debit Notes",
        "Goods Receipt Note",
        "Remittance Advice"
    ]


    $scope.getTrimmedName = function (moduleName) {
        return moduleName.replace(/ /g, '')
    }


    $scope.breadcrumbs = [
        { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
        { 'name': 'Auto-email Templates', 'url': 'app.setup', 'isActive': false, 'tabIndex': '9' },
        { 'name': $stateParams.module, 'url': '#', 'isActive': false }
    ];


    $scope.getEmailAddresses = function () {
        var getVirtualEmailsAPI = $scope.$root.com + 'mail/getVirtualEmails';
        // var getEmailAddresses = $scope.$root.setup + "general/get-configured-email-addresses";
        var postData = { 'token': $scope.$root.token };

        $http
            .post(getVirtualEmailsAPI, postData)
            .then(function (res) {
                $scope.tempEmailList = res.data.response == undefined ? [] : res.data.response;
                $scope.emailList = $scope.tempEmailList;
                // angular.forEach($scope.tempEmailList, function(obj){
                //     var tempObj = {};
                //     tempObj.id = obj.id;
                //     tempObj.email = obj.username;
                //     $scope.emailList.push(tempObj);
                // });
            });

    }

    $scope.getEmailAddresses();

    $scope.loadedJSON = "";

    $scope.toggleReadonly = function(){
        $scope.autoEmailReadonly = !$scope.autoEmailReadonly;
    }


    $scope.getJSON = function (moduleName) {
        $scope.autoEmailReadonly = true;
        $scope.showLoader = true;
        if(moduleName == 'GoodsReceiptNote') moduleName = 'receiptNote';
        $scope.activeModuleName = moduleName;
        $scope.emailTemplate = {};
        var getJSONUrl = $scope.$root.setup + "general/get-email-JSON";

        //var defaultJSONPath = "api/autoEmailTemplates/" + moduleName + ".json";

        var postData = {
            'token': $scope.$root.token,
            templateName: moduleName,
            mainModule: $scope.mainModule,
            fromSetup:true
        };
        $http
            .post(getJSONUrl, postData)
            .then(function (res) {
                $scope.loadedJSON = moduleName;
                if (res.data.ack) {
                    if (res.data.id) {
                        $scope.templateId = res.data.id;
                    }
                    else {
                        $scope.templateId = null;
                    }
                    $scope.emailTemplate = res.data.template;

                    var emailMatch = false;
                    angular.forEach($scope.emailList, function(obj){
                        if (obj.id == $scope.emailTemplate.senderEmail){
                            emailMatch = true;
                        }
                    })
                    
                    if (!emailMatch){
                        $scope.emailTemplate.senderEmail = "";
                    }

                    if (!!document.createRange) {
                        document.getSelection().removeAllRanges();
                    }

                    $("#subjectLine").summernote('reset');
                    $("#subjectBody").summernote('reset');
                }
                else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(330));
                }
                $scope.showLoader = false;
            });
    }

    if ($stateParams.module == "Sales") {
        $scope.currentSubModules = $scope.salesSubModules;
        $scope.mainModule = "Sales";
        $scope.getJSON('SalesQuotes', $scope.mainModule);
    }
    else if ($stateParams.module == "Purchases") {
        $scope.currentSubModules = $scope.purchasesSubModules;
        $scope.mainModule = "Purchases";
        $scope.getJSON('PurchaseOrders', $scope.mainModule);
    }


    $scope.saveJSON = function (moduleName) {
        var saveJSONUrl = $scope.$root.setup + "general/update-email-JSON";
        $scope.showLoader = true;
        var postData = { 'token': $scope.$root.token, 'json': $scope.emailTemplate, 'templateName': moduleName, mainModule: $scope.mainModule };
        if ($scope.templateId) {
            postData.templateId = $scope.templateId;
        }
        $http
            .post(saveJSONUrl, postData)
            .then(function (res) {
                if (res.data.ack) {
                    toaster.pop('success', 'Update', 'Template Updated Successfully');
                    if (!$scope.templateId){
                        $scope.templateId = res.data.id;
                    }
                    $scope.toggleReadonly();
                }
                $scope.showLoader = false;

            });
    }
    $scope.selectEmailTab = function(){
        $rootScope.currentSetupTab = 9;
    }

    $scope.bodyButtons = function (context) {

        var ui = $.summernote.ui;
        var list = "";
        angular.forEach($scope.emailTemplate.availablePlaceholders, function (value, key) {
            list += "<li>" + key + "</li>";
        });

        list += "<li>View Document</li>";


        // if($scope.emailTemplate && $scope.emailTemplate.availablePlaceholders) 
        //     $scope.emailTemplate.availablePlaceholders.push('<li>View Document</li>');

        var button = ui.buttonGroup([
            ui.button({
                className: 'dropdown-toggle',
                contents: 'Dynamic Data <span class="note-icon-caret"></span>',
                data: {
                    toggle: 'dropdown'
                },
                click: function () {

                    // Cursor position must be saved because is lost when dropdown is opened.
                    context.invoke('editor.saveRange');
                }
            }),
            ui.dropdown({
                className: 'custom-dropdown',
                contents: "<ul>" + list + "</ul>",
                callback: function ($dropdown) {
                    $dropdown.find('li').each(function () {
                        $(this).click(function (e) {
                            // We restore cursor position and text is inserted in correct pos.
                            context.invoke('editor.restoreRange');
                            context.invoke('editor.focus');
                            context.invoke("editor.insertText", "[[" + $(this).html() + "]]");
                            e.preventDefault();
                        });
                    });
                }
            })
        ]);

        return button.render();   // return button as jquery object 
    }

    $scope.subjectButtons = function (context) {

        var ui = $.summernote.ui;
        var list = "";
        angular.forEach($scope.emailTemplate.availablePlaceholders, function (value, key) {
            list += "<li>" + key + "</li>";
        });

        var button = ui.buttonGroup([
            ui.button({
                className: 'dropdown-toggle',
                contents: 'Dynamic Data <span class="note-icon-caret"></span>',
                data: {
                    toggle: 'dropdown'
                },
                click: function () {

                    // Cursor position must be saved because is lost when dropdown is opened.
                    context.invoke('editor.saveRange');
                }
            }),
            ui.dropdown({
                className: 'custom-dropdown',
                contents: "<ul>" + list + "</ul>",
                callback: function ($dropdown) {
                    $dropdown.find('li').each(function () {
                        $(this).click(function (e) {
                            // We restore cursor position and text is inserted in correct pos.
                            context.invoke('editor.restoreRange');
                            context.invoke('editor.focus');
                            context.invoke("editor.insertText", "[[" + $(this).html() + "]]");
                            e.preventDefault();
                        });
                    });
                }
            })
        ]);

        return button.render();   // return button as jquery object 
    }

    $scope.subjectOptions = {
        toolbar: [
            ['mybutton', ['hello']]
        ],
        buttons: {
            hello: $scope.subjectButtons
        }
    }
    $scope.bodyOptions = {
        fontNames: ['Arial', 'Arial Black', 'Courier New'],
        toolbar: [
            ['mybutton', ['hello']],
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['fontsize', ['fontsize']],
            ['fontname', ['fontname']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']]
        ],
        buttons: {
            hello: $scope.bodyButtons
        }
    }

}