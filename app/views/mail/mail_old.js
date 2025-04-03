MailAttachmentController.$inject = ["$scope", "$rootScope", "Upload", "$timeout", "toaster"];

myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
//                .state('app.mail', {
//                    url: '/mail/',
//                    title: 'Mail',
//                    templateUrl: helper.basepath('mail/mail.html')
//                })
                .state('app.inbox', {
                    url: '/mail/inbox',
                    title: 'Inbox',
                    templateUrl: helper.basepath('mail/inbox.html')//,
//                    resolve: helper.resolveFor('ngDialog'),
//                    controller: 'CompanyAddController'
                })
                .state('app.folder', {
                    url: '/mail/:id/:type/:file',
                    title: 'Mail',
                    resolve: helper.resolveFor('event-calendar', 'smart-search', 'ngDialog'),
                    templateUrl: helper.basepath('mail/folder.html'),
                    controller: 'MailController'
                })
                .state('app.compose', {
                    url: '/mail/compose/:id/:type/',
                    title: 'Compose',
                    resolve: helper.resolveFor('event-calendar', 'smart-search', 'ngDialog'),
                    templateUrl: helper.basepath('mail/compose.html'),
                    controller: 'MailController'
                })
                .state('app.reply', {
                    url: '/mail/reply/:id/:type/:number/',
                    title: 'Reply',
                    resolve: helper.resolveFor('event-calendar', 'smart-search', 'ngDialog'),
                    templateUrl: helper.basepath('mail/reply.html'),
                    controller: 'MailController'
                })
                .state('app.replyall', {
                    url: '/mail/replyall/:id/:type/:number/',
                    title: 'Reply All',
                    resolve: helper.resolveFor('event-calendar', 'smart-search', 'ngDialog'),
                    templateUrl: helper.basepath('mail/replyall.html'),
                    controller: 'MailController'
                })
                .state('app.forward', {
                    url: '/mail/forward/:id/:type/:number/',
                    title: 'Forward',
                    resolve: helper.resolveFor('event-calendar', 'smart-search', 'ngDialog'),
                    templateUrl: helper.basepath('mail/forward.html'),
                    controller: 'MailController'
                })
                .state('app.new', {
                    url: '/new',
                    title: 'New',
                    templateUrl: helper.basepath('mail/new.html')//,
//                    resolve: helper.resolveFor('ngDialog'),
//                    controller: 'CompanyAddController'
                })
                .state('app.search', {
                    url: '/mail/search/:id/:keyword/',
                    title: 'Search',
                    resolve: helper.resolveFor('event-calendar', 'ngDialog'),
                    templateUrl: helper.basepath('mail/search.html'),
                    controller: 'MailController'
                })
    }]);

myApp.controller('MailAttachmentController', MailAttachmentController);

myApp.controller('MailController', ['$scope', '$interval', '$window', '$stateParams', '$sce', '$filter', '$http', '$rootScope', '$state', "toaster", function ($scope, $interval, $window, $stateParams, $sce, $filter, $http, $rootScope, $state, toaster) {

//        var mailData = {to: 'mudassir@navsonsoftware.com', subject: 'test smtp', cc: '', bcc: '', body: 'testestest', token: $rootScope.token};
//            var mailPath = $rootScope.com + 'mail/sendmail';
//            $http.post(mailPath, mailData).then(function (result) {
//
//            });




        $scope.userinfo = "";
        $scope.numbers = {};
        $scope.contacts = {};
        $scope.showLoader = false;
        $scope.getSmartContacts = function () {
            $scope.showLoader = true;
            var contactData = {token: $rootScope.token};
            var contactPath = $rootScope.com + 'contact/smartcontacts';
            $http.post(contactPath, contactData).then(function (result) {
                $scope.contacts = result.data;
            });
            $scope.showLoader = false;
        };

        $scope.breadcrumbs =
                [{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
                    {'name': 'Communication', 'url': '#', 'isActive': false},
                    {'name': $scope.userinfo, 'url': '#', 'isActive': false},
                    {'name': 'Mail', 'url': '#', 'isActive':false}];

        $scope.mail = {};
        $scope.mail.mailTo = "";
        $scope.mail.mailCC = [];
        $scope.mail.mailCC[0] = "";
        $scope.mail.mailBCC = [];
        $scope.mail.mailBCC[0] = "";
        $scope.mail.mailSubject = "";
        $scope.mail.mailBody = "";
        $scope.showCC = true;
        $scope.showBCC = true;


        $interval(function () {

            var clientConData = {token: $rootScope.token};
            var clientConPath = $rootScope.com + 'mail/new';
            $http.post(clientConPath, clientConData).then(function (result) {
                $scope.numbers = result.data;
            });
        }, 60000);
        $scope.getNewMailCount = function () {
            $interval(function () {

                var clientConData = {token: $rootScope.token};
                var clientConPath = $rootScope.com + 'mail/new';
                $http.post(clientConPath, clientConData).then(function (result) {
                    $scope.numbers = result.data;
                });
            }, 60000);
        };


        $scope.checkCCAndBCC = function () {

            if ($scope.mail.mailCC[0] == "" || $scope.mail.mailCC[0] == " ") {
                $scope.showCC = true;
            }
            if ($scope.mail.mailBCC[0] == "" || $scope.mail.mailBCC[0] == " ") {
                $scope.showBCC = true;
            }
        };

        $scope.showDivCC = function () {
            $scope.showCC = false;
        };

        $scope.showDivBCC = function () {
            $scope.showBCC = false;
        };

        $scope.defaultmail = true;
        $scope.readmail = false;
        $scope.composemail = false;
        $scope.showTo = true;
        $scope.showCC1 = true;
        $scope.showBCC1 = true;
        $scope.showSubject = true;
        $scope.reply = false;
        $scope.replyall = false;

        $scope.composeMail = function () {

            $scope.breadcrumbs =
                    [{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
                        {'name': 'Communication', 'url': '#', 'isActive': false},
                        {'name': 'Mail', 'url': '#', 'isActive': false},
                        {'name': $scope.userinfo, 'url': '#', 'isActive': false},
                        {'name': 'Compose', 'url': '#', 'isActive':false}
                    ];

            $scope.mail.mailTo = "";
            $scope.mail.mailCC = [];
            $scope.mail.mailCC[0] = "";
            $scope.mail.mailBCC = [];
            $scope.mail.mailBCC[0] = "";
            angular.element('#cleartobtn').click();
            angular.element('#clearccbtn').click();
            angular.element('#clearbccbtn').click();
            $scope.mail.mailSubject = "";
            $scope.mail.mailBody = "";
            var iframeid = angular.element('#editorpanel iframe').attr('id');
            var mailBody = angular.element("#" + iframeid).contents().find("#tinymce").html('');

            $scope.defaultmail = false;
            $scope.readmail = false;
            $scope.showTo = true;
            $scope.showCC1 = true;
            $scope.showBCC1 = true;
            $scope.showCC = true;
            $scope.showBCC = true;
            $scope.composemail = true;
            $scope.showSubject = true;
            $scope.reply = false;
            $scope.replyall = false;

        };

        $scope.reply = function () {
            $scope.breadcrumbs =
                    [{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
                        {'name': 'Communication', 'url': '#', 'isActive': false},
                        {'name': 'Mail', 'url': '#', 'isActive': false},
                        {'name': $scope.userinfo, 'url': '#', 'isActive': false},
                        {'name': 'Reply', 'url': '#', 'isActive':false}
                    ];

            $scope.defaultmail = false;
            $scope.readmail = false;
            $scope.showTo = false;
            $scope.showCC1 = false;
            $scope.showBCC1 = false;
            $scope.composemail = true;
            $scope.showSubject = false;
            $scope.reply = true;
            $scope.replyall = false;

        };

        $scope.replyAll = function () {
            $scope.breadcrumbs =
                    [{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
                        {'name': 'Communication', 'url': '#', 'isActive': false},
                        {'name': 'Mail', 'url': '#', 'isActive': false},
                        {'name': $scope.userinfo, 'url': '#', 'isActive': false},
                        {'name': 'ReplyAll', 'url': '#', 'isActive':false}
                    ];

            $scope.defaultmail = false;
            $scope.readmail = false;
            $scope.showTo = false;
            $scope.showCC1 = false;
            $scope.showBCC1 = false;
            $scope.composemail = true;
            $scope.showSubject = false;
            $scope.reply = false;
            $scope.replyall = true;
        };

        $scope.forward = function () {
            $scope.breadcrumbs =
                    [{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
                        {'name': 'Communication', 'url': '#', 'isActive': false},
                        {'name': 'Mail', 'url': '#', 'isActive': false},
                        {'name': $scope.userinfo, 'url': '#', 'isActive': false},
                        {'name': 'Forward', 'url': '#', 'isActive':false}
                    ];

            $scope.defaultmail = false;
            $scope.readmail = false;
            $scope.showTo = true;
            $scope.showCC1 = true;
            $scope.showBCC1 = true;
            $scope.showCC = true;
            $scope.showBCC = true;
            $scope.composemail = true;
            $scope.showSubject = false;
            $scope.reply = false;
            $scope.replyall = false;
        };
        $scope.modalTitle = "";
        $scope.modalBody = "";
        $scope.clientCon = 0;
        $scope.isConfigurationExist = function () {
            var clientConData = {token: $rootScope.token};
            var clientConPath = $rootScope.com + 'mail/isconfigurationexist';
            $http.post(clientConPath, clientConData).then(function (result) {
                console.log("Configuration");
                console.log(result.data);
                if (result.data.total == 0) {
                    angular.element('#modaladdmailbtn').click();
                } else if (result.data.total > 0) {
                    var imapData = {token: $rootScope.token};
                    var imapPath = $rootScope.com + 'mail/isimapvalid';
                    $http.post(imapPath, imapData).then(function (result) {
                        if (result.data.valid == 0) {
                            $scope.clientCon = {};
                            $scope.clientCon.imapServer = "";
                            $scope.clientCon.imapPort = "";
                            $scope.clientCon.imapSSL = "";
                            $scope.clientCon.imapSPA = "";
                            $scope.clientCon.pop3Server = "";
                            $scope.clientCon.pop3Port = "";
                            $scope.clientCon.pop3SSL = "";
                            $scope.clientCon.pop3SPA = "";
                            $scope.clientCon.smtpServer = "";
                            $scope.clientCon.smtpPort = "";
                            $scope.clientCon.smtpSSL = "";
                            $scope.clientCon.smtpSPA = "";
                            $scope.clientCon.smtpAuth = "";
                            $scope.clientCon.username = "";
                            $scope.clientCon.password = "";
                            var clientConData = {token: $rootScope.token};
                            var clientConPath = $rootScope.com + 'mail/clientconfig';
                            $http.post(clientConPath, clientConData).then(function (result) {
                                angular.element('#modaladdmailbtn').click();
                                $scope.clientCon.imapServer = result.data.imapserver;
                                $scope.clientCon.imapPort = result.data.imapport;
                                $scope.clientCon.imapSSL = result.data.imapssl;
                                $scope.clientCon.imapSPA = result.data.imapspa;
                                $scope.clientCon.pop3Server = result.data.pop3server;
                                $scope.clientCon.pop3Port = result.data.pop3port;
                                $scope.clientCon.pop3SSL = result.data.pop3ssl;
                                $scope.clientCon.pop3SPA = result.data.pop3spa;
                                $scope.clientCon.smtpServer = result.data.smtpserver;
                                $scope.clientCon.smtpPort = result.data.smtpport;
                                $scope.clientCon.smtpSSL = result.data.smtpssl;
                                $scope.clientCon.smtpSPA = result.data.smtpspa;
                                $scope.clientCon.smtpAuth = result.data.smtpauth;
                                $scope.clientCon.username = result.data.username;
                                $scope.clientCon.password = result.data.password;
                            });
                        } else if (result.data.valid == 1) {
                            $state.go("app.folder", {type: 'INBOX'});
                        }
                    });
                }

            });
        };

        $scope.imap = {};
        $scope.imap.valid = 0;
        $scope.isIMAPConfigValid = function () {
            var imapData = {token: $rootScope.token};
            var imapPath = $rootScope.com + 'mail/isimapvalid';
            $http.post(imapPath, imapData).then(function (result) {
                $scope.imap.valid = result.data.valid;
            });
        };

        $scope.mailsFolders = {};
        $scope.mailsFoldersCount = {};
        $scope.getMailsFolders = function () {
            var clientConData = {token: $rootScope.token};
            var clientConPath = $rootScope.com + 'mail/new';
            $http.post(clientConPath, clientConData).then(function (result) {
                $scope.numbers = result.data;
            });
            var mailData = {token: $rootScope.token};
            var mailPath = $rootScope.com + 'mail/mailsfolders';
            $http.post(mailPath, mailData).then(function (result) {

                $scope.mailsFolders = result.data;
               // $scope.mailsFoldersCount = result.data.counts;
                if ($stateParams.id != undefined) {
                    angular.element(document).ready(function () {
                        $timeout(function () {
                            angular.element('#mailleft').click();
                            angular.element('#mail').attr('aria-expanded', 'true');
                            angular.element('#mail').addClass('in');
                            angular.element('#mail').attr('style', '');
                            angular.element('#mail_0' + $stateParams.id).attr('aria-expanded', 'true');
                            angular.element('#mail_0' + $stateParams.id).addClass('in');
                            angular.element('#mail_0' + $stateParams.id).attr('style', '');

                        }, 1000);
                    });
                }
            });
        };

        $scope.mailFolders = {};
        $scope.getMailFolders = function () {

            var mailData = {id: $stateParams.id, token: $rootScope.token};
            var mailPath = $rootScope.com + 'mail/mailfolders';
            $http.post(mailPath, mailData).then(function (result) {

                $scope.mailFolders = result.data.folders;

            });
        };

        $scope.showChild = function () {
            $timeout(function () {
                angular.element('#mailleft').click();
                angular.element('#mail').attr('aria-expanded', 'true');
                angular.element('#mail').addClass('in');
                angular.element('#mail').attr('style', '');
                angular.element('#mail_0' + $stateParams.id).attr('aria-expanded', 'true');
                angular.element('#mail_0' + $stateParams.id).addClass('in');
                angular.element('#mail_0' + $stateParams.id).attr('style', '');

            }, 1000)
        };


        $scope.newmail = false;
        $scope.readmail = false;

        $scope.sendMail = function (attachments) {

            var iframeid = angular.element('#editorpanel iframe').attr('id');
            var mailBody = angular.element("#" + iframeid).contents().find("#tinymce").html();
            var mailData = {};
            if ($scope.reply || $scope.replyall) {
                mailData = {id: $stateParams.id, type: 'reply', to: $scope.mail.mailTo, subject: $scope.mail.mailSubject, cc: $scope.mail.mailCC[0], bcc: $scope.mail.mailBCC[0], body: mailBody, files: attachments, token: $rootScope.token};
            } else {
                mailData = {id: $stateParams.id, type: 'noreply', to: angular.element('#select-to').val(), subject: $scope.mail.mailSubject, cc: angular.element('#select-cc').val(), bcc: angular.element('#select-bcc').val(), body: mailBody, files: attachments, token: $rootScope.token};
            }

            var mailPath = $rootScope.com + 'mail/sendmail';
            $http.post(mailPath, mailData).then(function (result) {
                $scope.mail.mailTo = "";
                $scope.mail.mailCC = [];
                $scope.mail.mailCC[0] = "";
                $scope.mail.mailBCC = [];
                $scope.mail.mailBCC[0] = "";
                angular.element('#cleartobtn').click();
                angular.element('#clearccbtn').click();
                angular.element('#clearbccbtn').click();
                angular.element('#select-to').val('');
                angular.element('#select-cc').val('');
                angular.element('#select-bcc').val('');
                $scope.mail.mailSubject = "";
                $scope.mail.mailBody = "";
                var iframeid = angular.element('#editorpanel iframe').attr('id');
                var mailBody = angular.element("#" + iframeid).contents().find("#tinymce").html('');
//                angular.element('#modalsendmail').modal({
//                    show: true
//                });
                toaster.pop('success', 'Send Mail', 'Email has been send.');
                console.log("SendMailResult");
                console.log(result.data);
                $scope.composeMail();
            });
        };

        $scope.saveMail = function (attachments) {

            var iframeid = angular.element('#editorpanel iframe').attr('id');
            var mailBody = angular.element("#" + iframeid).contents().find("#tinymce").html();
            var mailCCStr = "";
            for (var i = 0; i < $scope.mail.mailCC.length; i++) {
                mailCCStr += $scope.mail.mailCC[i] + "; ";
            }
            var mailBCCStr = "";
            for (var j = 0; j < $scope.mail.mailBCC.length; j++) {
                mailBCCStr += $scope.mail.mailBCC[j] + "; ";
            }
            var mailData = {id: $stateParams.id, to: $scope.mail.mailTo, subject: $scope.mail.mailSubject, cc: mailCCStr, bcc: mailBCCStr, body: mailBody, files: attachments, token: $rootScope.token};
            var mailPath = $rootScope.com + 'mail/savemail';
            $http.post(mailPath, mailData).then(function (result) {
                $scope.mail.mailTo = "";
                $scope.mail.mailCC[0] = "";
                $scope.mail.mailBCC[0] = "";
                $scope.mail.mailSubject = "";
                $scope.mail.mailBody = "";
                var iframeid = angular.element('#editorpanel iframe').attr('id');
                var mailBody = angular.element("#" + iframeid).contents().find("#tinymce").html('');
//                angular.element('#modalsendmail').modal({
//                    show: true
//                });
                console.log("SendMailResult");
                console.log(result.data);

            });
        };

        $scope.addMailCC = function () {
            $scope.mail.mailCC.push('');
        };

        $scope.removeMailCC = function (index) {
            $scope.mail.mailCC.splice(index, 1);
        };

        $scope.addMailBCC = function () {
            $scope.mail.mailBCC.push('');
        };

        $scope.removeMailBCC = function (index) {
            $scope.mail.mailBCC.splice(index, 1);
        };

        $scope.messageIndex = "";
        $scope.setMessageIndex = function (index) {
            $scope.messageIndex = index;
        };

        $scope.folders = {};
        $scope.getFolders = function () {
            var imapData = {token: $rootScope.token};
            var imapPath = $rootScope.com + 'mail/folders';
            $http.post(imapPath, imapData).then(function (result) {
                console.log("Folders");
                console.log(result.data);
                $scope.folders = result.data;
            });
        };
        
        $scope.hasUnreadMails = function(id, folder){
            console.log("id::"+id+", Folder::"+folder);
            var imapData = {id: id, folder: folder, token: $rootScope.token};
            var imapPath = $rootScope.com + 'mail/unread';
            
//            $http.post(imapPath, imapData).then(function (result) {
//                console.log("Result::");
//                console.log(result.data);
//                if(result.data.unreadMails > 0){
//                    console.log("Unread::"+result.data.unreadMails);
//                    return true;
//                }else{
//                    return false;
//                }
//            });
        };

        $scope.folder = {};
        $scope.stateType = "";
        $scope.folder = function () {
            var stateTypeParm = $stateParams.type;
            var stateTypeLower = stateTypeParm.toLowerCase();
            var sateTypeVal = stateTypeLower;

            if (stateTypeLower.split(".").length > 0) {
                var splitState = stateTypeLower.split(".");
                sateTypeVal = splitState[splitState.length - 1];
            }
            $scope.stateType = sateTypeVal.substr(0, 1).toUpperCase() + sateTypeVal.substr(1);

            var folderData = {id: $stateParams.id, folder: $stateParams.type, token: $rootScope.token};
            var folderPath = $rootScope.com + 'mail/folder';
            $http.post(folderPath, folderData).then(function (result) {
                $scope.folder = result.data;
                $scope.breadcrumbs =
                        [{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
                            {'name': 'Communication', 'url': '#', 'isActive': false},
                            {'name': 'Mail', 'url': 'app.folder({id: $stateParams.id, type: "INBOX"})', 'isActive': false},
                            {'name': $scope.userinfo, 'url': '#', 'isActive': false},
                            {'name': $scope.stateType, 'url': '#', 'isActive':false}];
            });
        };

        $scope.folderMessage = "";
        $scope.attachments = {};
        $scope.header = {};
        $scope.messageno = "";
        $scope.printMessage = "";
        $scope.getFolderMessage = function (messageNumber, showread) {

            $scope.defaultmail = true;
            $scope.readmail = true;
            
            $scope.messageno = messageNumber;
            var folderMessageData = {id: $stateParams.id, folder: $stateParams.type, messageNumber: messageNumber, token: $rootScope.token};
            var folderMessagePath = $rootScope.com + 'mail/foldermessage';
            $http.post(folderMessagePath, folderMessageData).then(function (result) {
                $scope.header = result.data.header;
                if (result.data.header.cc.length > 0) {
                    $scope.replyall = true;
                }
                $scope.attachments = result.data.attachments;
                $scope.folderMessage = result.data.html;
                $('#iframe1').contents().find('html').html(result.data.html);

                if (showread == 1) {
                    angular.element('#msgu_' + messageNumber).attr('style', 'display: none  !important');
                    angular.element('#msgr_' + messageNumber).attr('style', 'display: block !important');
                }
            });
            $scope.composemail = false;
        };

        $scope.getSearchMessage = function (messageNumber, showread, folder) {

            $scope.readmail = true;
            $scope.messageno = messageNumber;
            var searchMessageData = {id: $stateParams.id, folder: folder, messageNumber: messageNumber, token: $rootScope.token};
            var searchMessagePath = $rootScope.com + 'mail/foldermessage';
            $http.post(searchMessagePath, searchMessageData).then(function (result) {
                $scope.header = result.data.header;
                $scope.attachments = result.data.attachments;
                $scope.folderMessage = result.data.html;
                $('#iframe1').contents().find('html').html(result.data.html);
                if (showread == 1) {
                    angular.element('#msgu_' + messageNumber).attr('style', 'display: none  !important');
                    angular.element('#msgr_' + messageNumber).attr('style', 'display: block !important');
                }
            });
        };

        $scope.printMessage = function () {
            var header = angular.element('#mailheader').html();
            var mailhtml = angular.element('#iframe1').contents().find('html').html();
            var mywindow = window.open('', 'Print Mail', 'height=400,width=600');
            mywindow.document.write(header);
            mywindow.document.write(mailhtml);
            mywindow.print();
            mywindow.close();
        };

        $scope.getFolderMessageByParams = function (subject) {

            $scope.showSubject = false;

            $scope.mail.mailTo = "";
            $scope.mail.mailCC = [];
            $scope.mail.mailCC[0] = "";
            $scope.mail.mailBCC = [];
            $scope.mail.mailBCC[0] = "";
            angular.element('#cleartobtn').click();
            angular.element('#clearccbtn').click();
            angular.element('#clearbccbtn').click();
            $scope.mail.mailSubject = "";
            $scope.mail.mailBody = "";

            var folderMessageData = {id: $stateParams.id, folder: $stateParams.type, messageNumber: $scope.messageno, token: $rootScope.token};
            var folderMessagePath = $rootScope.com + 'mail/foldermessage';
            $http.post(folderMessagePath, folderMessageData).then(function (result) {
                $scope.header = result.data.header;

                var to = "";
                var cc = "";
                var bcc = "";
                var tonum = 0;
                if (subject == 'Rep: ') {

                    $scope.showTo = false;
                    $scope.showCC1 = false;
                    $scope.showBCC1 = false;
                    $scope.showCC = false;
                    $scope.showBCC = false;
                    $scope.composemail = true;

//if($scope.reply || $scope.replyall){
//    
//}else{
//    
//}
//                    angular.forEach(result.data.header.reply_to, function (value, key) {
//
//
//                        if (value['reply_to'] != "") {
//                            to += '{"email":"' + value['reply_to'] + '", "first_name":"", "last_name":""},';
//                            tonum++;
//                        }
//                    });
//
//                    if (to != "" && tonum > 0) {
//                        to = '[' + to + ']';
//                    }
//                    angular.element('#edittobtn').val(to);
//                    angular.element('#edittobtn').click();

                    $scope.mail.mailTo = result.data.header.reply_to[0].reply_to;
                } else if (subject == 'Rep All: ') {

                    $scope.showTo = false;
                    $scope.showCC1 = false;
                    $scope.showBCC1 = false;
                    $scope.showCC = false;
                    $scope.showBCC = false;
                    $scope.composemail = true;
                    $scope.mail.mailTo = result.data.header.reply_to[0].reply_to;
//                    angular.forEach(result.data.header.to, function (value, key) {
//
//                        if (value['to'] != "") {
//                            to += '{"email":"' + value['to'] + '", "first_name":"", "last_name":""},';
//                            tonum++;
//                        }
//                    });
//
//                    if (to != "" && tonum > 0) {
//                        to = '[' + to + ']';
//                    }
//                    angular.element('#edittobtn').val(to);
//                    angular.element('#edittobtn').click();
//
//                    var ccnum = 0;
//                    angular.forEach(result.data.header.cc, function (value, key) {
//                        if (value['cc'] != "") {
//                            cc += '{"email":"' + value['cc'] + '", "first_name":"", "last_name":""},';
//                            ccnum++;
//                        }
//                    });
//                    if (cc != "" && ccnum > 0) {
//                        cc = '[' + cc + ']';
//                    }
//                    angular.element('#editccbtn').val(cc);
//                    angular.element('#editccbtn').click();
                }
//                console.log("TO::");
//                console.log(to);
                var cc = "";
                var bcc = "";
                if (subject == 'Rep All: ') {
                    angular.forEach(result.data.header.cc, function (value, key) {
                        if (value['cc'] != '') {
                            cc += value['cc'] + "; ";
                        }
                    });
                    angular.forEach(result.data.header.bcc, function (value, key) {
                        if (value['bcc'] != '') {
                            bcc += value['bcc'] + "; ";
                        }
                    });
                    $scope.mail.mailCC[0] = cc;
                    $scope.mail.mailBCC[0] = bcc;
                }


                $scope.mail.mailSubject = subject + result.data.header.subject;
                $scope.attachments = result.data.attachments;
                $scope.folderMessage = result.data.html;
                var htmlbody = "";
                if (subject == 'Fwd: ') {
                    $scope.showTo = true;
                    $scope.showCC1 = true;
                    $scope.showBCC1 = true;
                    $scope.showCC = true;
                    $scope.showBCC = true;
                    htmlbody = "<br/><br/><br/>---------- Forwarded message ----------<br/>";
                    htmlbody += "From: " + result.data.header.sender[0].personal + " <" + result.data.header.sender[0].sender + "><br/>";
                    htmlbody += "Date: " + result.data.header.date + "<br/>";
                    htmlbody += "Subject: " + result.data.header.subject + "<br/>";
                    htmlbody += "To: " + result.data.header.to[0].personal + " <" + result.data.header.to[0].to + ">" + "<br/>";
                    htmlbody += "<br/><div style='border-left: 1px solid #666;'>" + result.data.header.date + result.data.html + "</div>";
                } else {
                    htmlbody = "<br/><br/>On " + result.data.header.date + ", <" + result.data.header.sender[0].sender + "> wrote:<br/><div style='border-left: 1px solid #666;'>" + result.data.header.date + result.data.html + "</div>";
                }

                var iframeid = angular.element('#editorpanel iframe').attr('id');
                angular.element("#" + iframeid).contents().find("#tinymce").html(htmlbody);

            });
        };

        $scope.stateId = "";
        $scope.stateFolder = "";
        $scope.folderAction = function (id, folder, value) {
            $scope.stateId = id;
            $scope.stateFolder = folder;
            angular.element('#act_' + value + id).contextPopup({
                items: [
                    {label: 'Rename', icon: '', action: function () {
                            console.log("Click on Rename, Id::" + $scope.stateId + " Folder::" + $scope.stateFolder);
                        }
                    },
                    {label: 'Create', icon: '', action: function () {
                            console.log("Click on Create, Id::" + $scope.stateId + " Folder::" + $scope.stateFolder);
                        }
                    },
                    {label: 'Delete', icon: '', action: function () {
                            //console.log("Click on Delete, Id::"+$scope.stateId+" Folder::"+$scope.stateFolder);
                            $scope.deleteFolder($scope.stateId, $scope.stateFolder);
                        }
                    }
                ]});

        };

        $scope.userfolder = {};
        $scope.userfolder.mailFolders = {};
        $scope.userfolder.parentFolder = "";
        $scope.userfolder.showOldName = "";
        $scope.userfolder.oldName = "";
        $scope.userfolder.id = "";
        $scope.userfolder.newName = "";

        $scope.showCreateFolderDialog = function (id, mailFolders) {
            $scope.userfolder.id = id;
            $scope.userfolder.mailFolders = mailFolders;
            angular.element('#modalnew').modal({
                show: true
            });
        };

        $scope.createSubFolder = function () {
            var folderData = {id: $scope.userfolder.id, folder: $scope.userfolder.parentFolder, newFolder: $scope.userfolder.newName, token: $rootScope.token};
            var folderPath = $rootScope.com + 'mail/createsubfolder';
            $http.post(folderPath, folderData).then(function (result) {
                $window.location.reload(true);
                console.log("Sub Folder has been created.");
                console.log(result.data);
            });
        };

        $scope.renameFolder = function () {
            var folderData = {id: $scope.userfolder.id, folder: $scope.userfolder.oldName, newFolder: $scope.userfolder.newName, token: $rootScope.token};
            var folderPath = $rootScope.com + 'mail/renamefolder';
            $http.post(folderPath, folderData).then(function (result) {
                $window.location.reload(true);
            });
        };

        $scope.showRenameFolerDialog = function (id, oldfoldername) {
            $scope.userfolder.oldName = oldfoldername;
            $scope.userfolder.id = id;
            if (oldfoldername.split(".").length > 0) {
                var splitFolder = oldfoldername.split(".");
                var folderName = splitFolder[splitFolder.length - 1];
                $scope.userfolder.showOldName = folderName;
            }
            angular.element('#modalrename').modal({
                show: true
            });
        };

        $scope.showDeleteFolderDialog = function (id, oldfoldername) {
            $scope.userfolder.oldName = oldfoldername;
            $scope.userfolder.id = id;
            if (oldfoldername.split(".").length > 0) {
                var splitFolder = oldfoldername.split(".");
                var folderName = splitFolder[splitFolder.length - 1];
                $scope.userfolder.showOldName = folderName;
            }
            angular.element('#modaldeletefoler').modal({
                show: true
            });
        };

        $scope.deleteFolder = function () {
            var folderData = {id: $scope.userfolder.id, folder: $scope.userfolder.oldName, token: $rootScope.token};
            var folderPath = $rootScope.com + 'mail/deletefolder';

            $http.post(folderPath, folderData).then(function (result) {

                if (result.data.ack == true) {

                    // toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                    if (folder.split(".").length > 0) {
                        var splitFolder = folder.split(".");
                        var folderName = splitFolder[splitFolder.length - 1];
                        angular.element('#act_' + folderName + id).hide();
                    }
                } else {
                    //  toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                }

                console.log("Folder has been deleted.");
                console.log(result.data);
            });
        };

        $scope.deleteMessage = function () {
            var folderData = {id: $stateParams.id, folder: $stateParams.type, messageno: $scope.messageno, token: $rootScope.token};
            var folderPath = $rootScope.com + 'mail/deletemessage';

            $http.post(folderPath, folderData).then(function (result) {

                if (result.data.deleted == true) {
                    $scope.folder.splice($scope.messageIndex, 1);
                    $scope.readmail = false;
                    $scope.modalTitle = "Mail Deleted";
                    $scope.modalBody = "Mail has been deleted.";
                    angular.element('#mainModal').modal({
                        show: true
                    });
                }
            });
        };

        $scope.moveMessage = function (folder) {
            if ($stateParams.type == folder && folder == 'INBOX.Trash') {
                $scope.deleteMessage();
            } else {
                var folderData = {id: $stateParams.id, type: $stateParams.type, folder: folder, messageno: $scope.messageno, token: $rootScope.token};
                var folderPath = $rootScope.com + 'mail/movemessage';

                $http.post(folderPath, folderData).then(function (result) {

                    if (result.data.moved == true) {
                        $scope.folder.splice($scope.messageIndex, 1);
                        $scope.readmail = false;
                        $scope.modalTitle = "Mail Moved";
                        var movedFolder = "";
                        if (folder.split(".").length > 0) {
                            var splitState = folder.split(".");
                            movedFolder = splitState[splitState.length - 1];
                        }
                        console.log("Moved Folder::" + movedFolder);
                        $scope.modalBody = "Mail has been Moved to " + movedFolder + " folder.";
                        angular.element('#mainModal').modal({
                            show: true
                        });
                        console.log("moved");
                    }
                });
            }

        };

        $scope.setFolderMessageFlags = function (messageNumber, flags, method) {
            var flagData = {id: $stateParams.id, folder: $stateParams.type, messageNumber: messageNumber, flags: flags, method: method, token: $rootScope.token};
            var flagPath = $rootScope.com + 'mail/setflags';
            $http.post(flagPath, flagData).then(function (result) {
                console.log("Flag status");
                console.log(result.data);
            });
        };
        $scope.unsetFolderMessageFlags = function (messageNumber, flags, method) {
            var flagData = {id: $stateParams.id, folder: $stateParams.type, messageNumber: messageNumber, flags: flags, method: method, token: $rootScope.token};
            var flagPath = $rootScope.com + 'mail/unsetflags';
            $http.post(flagPath, flagData).then(function (result) {
                console.log("Flag status");
                console.log(result.data);
            });
        };

        $scope.changeFlag = function (messageNumber, flags, method, flagged) {
            if (flagged == 1) {
                $scope.setFolderMessageFlags(messageNumber, flags, method);
                angular.element('#flags_' + messageNumber).attr('style', 'display: block !important');
                angular.element('#flagu_' + messageNumber).attr('style', 'display: none !important');
            } else if (flagged == 0) {
                $scope.unsetFolderMessageFlags(messageNumber, flags, method);
                angular.element('#flags_' + messageNumber).attr('style', 'display: none !important');
                angular.element('#flagu_' + messageNumber).attr('style', 'display: block !important');
            }
        };

        $scope.url = "";
        $scope.downloadpath = "";
        $scope.downloadAttachment = function (mailno, ano, enc, method, name, partNum, subtype) {
            var attachmentData = {id: $stateParams.id, folder: $stateParams.type, messageNumber: mailno, ano: ano, enc: enc, method: method, name: name, partNum: partNum, subtype: subtype, token: $rootScope.token};
            var attachmentPath = $rootScope.com + 'mail/downloadattachment';
            $http.post(attachmentPath, attachmentData).then(function (result) {
                console.log("Download Attachment");
                console.log(result.data);
                $scope.url = result.data.filename;//(window.URL || window.webkitURL).createObjectURL(blob);
                $scope.downloadpath = $rootScope.basePath + result.data.path;
                $window.open($scope.downloadpath + $scope.url, '_blank');
            });
        };

        $scope.redirectToDashboard = function () {
            $state.go('app.dashboard');
        };

        $scope.inbox = {};
        $scope.inbox = function () {
            $scope.breadcrumbs =
                    [{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
                        {'name': 'Communication', 'url': '#', 'isActive': false},
                        {'name': 'Mail', 'url': '#', 'isActive': false},
                        {'name': 'Inbox', 'url': '#', 'isActive':false}];

            var inboxData = {token: $rootScope.token};
            var inboxPath = $rootScope.com + 'mail/inbox';
            $http.post(inboxPath, inboxData).then(function (result) {
                console.log("Inbox");
                console.log(result.data);
                if (result.data.isconnected == 0) {
                    $state.go("app.mail");
                }
                $scope.inbox = result.data;
            });
        };

        $scope.inboxMessage = {};
        $scope.getInboxMessage = function (messageNumber) {
            var inboxMessageData = {messageNumber: messageNumber, token: $rootScope.token};
            var inboxMessagePath = $rootScope.com + 'mail/inboxmessage';
            $http.post(inboxMessagePath, inboxMessageData).then(function (result) {
                console.log("Inbox Message");
                console.log(result.data);
                $scope.inboxMessage = result.data;
            });
        };

        $scope.clientCon = {};
        $scope.clientCon.imapServer = "";
        $scope.clientCon.imapPort = "";
        $scope.clientCon.imapSSL = "";
        $scope.clientCon.imapSPA = "";
        $scope.clientCon.pop3Server = "";
        $scope.clientCon.pop3Port = "";
        $scope.clientCon.pop3SSL = "";
        $scope.clientCon.pop3SPA = "";
        $scope.clientCon.smtpServer = "";
        $scope.clientCon.smtpPort = "";
        $scope.clientCon.smtpSSL = "";
        $scope.clientCon.smtpSPA = "";
        $scope.clientCon.smtpAuth = "";
        $scope.clientCon.username = "";
        $scope.clientCon.password = "";

        $scope.addClientConfiguration = function () {
            var clientData = {username: $scope.clientCon.username, password: $scope.clientCon.password, pop3server: $scope.clientCon.pop3Server,
                pop3port: $scope.clientCon.pop3Port, pop3ssl: $scope.clientCon.pop3SSL, pop3spa: $scope.clientCon.pop3SPA, imapserver: $scope.clientCon.imapServer,
                imapport: $scope.clientCon.imapPort, imapssl: $scope.clientCon.imapSSL, imapspa: $scope.clientCon.imapSPA, smtpserver: $scope.clientCon.smtpServer,
                smtpport: $scope.clientCon.smtpPort, smtpssl: $scope.clientCon.smtpSSL, smtpspa: $scope.clientCon.smtpSPA, smtpauth: $scope.clientCon.smtpAuth, token: $rootScope.token};
            var clientPath = $rootScope.com + 'mail/addclientconfiguration';
            $http.post(clientPath, clientData).then(function (result) {
                console.log("CC");
                console.log(result.data);
                $scope.inbox = result.data;
            });
        };

        $scope.toTrustedHTML = function (html) {
            return $sce.trustAsHtml(html);
        };

        $scope.showIcons = function (id, value) {
            angular.element('#span_' + id + "_" + value).show();
        };

        $scope.hideIcons = function (id, value) {
            angular.element('#span_' + id + "_" + value).hide();
        };

        $scope.getValueStr = function (value) {

            var value1 = value.replace(" ", "_");
            var value2 = value1.replace(".", "_");
            var value3 = value2.replace(" ", "_");
            var value4 = value3.replace(".", "_");
            var value5 = value4.replace(" ", "_");
            var value6 = value5.replace(".", "_");
            var value7 = value6.toLowerCase();
            return value7;
        };

        $scope.toggle_it = function (id) {
            var child = id + "_1";
            if ($("#" + child).length) {
                $("#" + child).toggle("slow");
            }
        };

        $scope.toggle_parent = function (id) {
            var child = id + "_1";
            if ($('#' + child).css('display') == 'none') {
                $scope.hideAllParents();
                if ($("#" + child).length) {
                    $("#" + child).css("display", 'block');
                    $(".level1").removeClass('sidbar_active');
                    $("#" + id + "_sidebar").addClass('sidbar_active');
                }
            } else {
                $scope.hideAllParents();
                if ($("#" + child).length) {
                    $("#" + child).css("display", 'none');
                    $(".level1").removeClass('sidbar_active');
                }
            }
        };

        $scope.hideAllParents = function () {
            angular.element('.mail-parents').hide();
        };

        $scope.toggleChild = function (id) {
            if (angular.element('#' + id).css('display') == 'none') {
                angular.element('#' + id).css('display', 'block')
            } else {
                angular.element('#' + id).css('display', 'none')
            }
        };

        $scope.searchKeyword = "";
        $scope.searchResults = {};
        $scope.search = function () {
            $scope.searchKeyword = $stateParams.keyword;
            $scope.breadcrumbs =
                    [{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
                        {'name': 'Communication', 'url': '#', 'isActive': false},
                        {'name': 'Mail', 'url': '#', 'isActive': false},
                        {'name': $scope.userinfo, 'url': '#', 'isActive': false},
                        {'name': 'Search', 'url': '#', 'isActive':false}];
            var searchData = {id: $stateParams.id, search: $stateParams.keyword, token: $rootScope.token};
            var searchPath = $rootScope.com + 'mail/search';
            $http.post(searchPath, searchData).then(function (result) {
                $scope.searchResults = result.data;
            });
        };

        $scope.getUserInfo = function () {
            var userinfoData = {id: $stateParams.id, token: $rootScope.token};
            var userinfoPath = $rootScope.com + 'mail/userinfo';
            $http.post(userinfoPath, userinfoData).then(function (result) {
                if (result.data.alias != "") {
                    $scope.userinfo = result.data.alias;
                } else {
                    $scope.userinfo = result.data.username;
                }
            });
        };
        //

       
        if($scope.$root.counter ==1){
        if($stateParams.file != undefined && $stateParams.file != ''){
            $timeout(function(){
                angular.element("#newmailbtn").click();
                $scope.$root.$broadcast('attachInvoice',$stateParams.file,$stateParams.id);
            },5000);
        }
     }

     $scope.$root.counter++;

    }]);


function MailAttachmentController($scope, $rootScope, Upload, $timeout, toaster,$stateParams) {
    $scope.mailAttachments = [];
    $scope.mailAttachment = {};
    $scope.mailAttachment.fileName = [];
    $scope.mailAttachment.newFileName = [];
    $scope.showLoader = false;
    $scope.uploadFiles = function (file) {
        $scope.showLoader = true;
        //$scope.f[] = file;
//        console.log("Files");
//        console.log(file);
//        $scope.errFile = errFiles && errFiles[0];
        var postUrl = $rootScope.com + 'mail/uploadfile';

        if (file) {
            file.upload = Upload.upload({
                url: postUrl,
                data: {file: file, token: $rootScope.token}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    $scope.mailAttachments.push({'fileName': response.data.fileName, 'newFileName': response.data.newFileName});
                    file.result = response.data;
                    $scope.mailAttachment.fileName = response.data.fileName;
                    $scope.mailAttachment.newFileName = response.data.newFileName;
                    $scope.showLoader = false;
                    toaster.pop('success', 'File Upload', 'File Uploaded Successfully');
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
                    $scope.showLoader = false;
                    toaster.pop('error', 'File Upload', 'Error in File uploaded!');
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                $scope.showLoader = false;
                toaster.pop('error', 'File Upload', 'Error in File uploaded!');
            });
        }
    };

    $scope.$on('attachInvoice',function(event,num,id){
        //$scope.$root.$apply(function(){
            $scope.mailAttachments.push({'fileName': num+'_invoice.pdf', 'newFileName': num+'_invoice.pdf'});
            MailLeftPanel();
            $timeout(function(){
                angular.element("#"+id+"_sidebar").click();
            },5000);
        //});
    });
}


