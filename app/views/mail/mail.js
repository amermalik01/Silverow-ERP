myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {

        $stateProvider

            .state('app.inbox', {
                url: '/mail/inbox',
                title: 'Inbox',
                templateUrl: helper.basepath('mail/inbox.html')
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
                templateUrl: helper.basepath('mail/new.html')
            })
            .state('app.search', {
                url: '/mail/search/:id/:keyword/',
                title: 'Search',
                resolve: helper.resolveFor('event-calendar', 'ngDialog'),
                templateUrl: helper.basepath('mail/search.html'),
                controller: 'MailController'
            })

            .state('app.apiemails', {
                url: '/mail/apiemails',
                title: 'API Emails',
                templateUrl: helper.basepath('mail/apiemails.html'),
                controller: 'MailController'
            })
    }]);


myApp.controller('MailController', ['$scope', '$interval', '$window', '$stateParams', '$sce', '$filter', '$http', '$rootScope', '$state', 'toaster', '$timeout', function ($scope, $interval, $window, $stateParams, $sce, $filter, $http, $rootScope, $state, toaster, $timeout) {

    $scope.userinfo = "";
    $scope.numbers = {};
    $scope.contacts = {};
    $scope.showLoader = false;

    // codemark 1
    $scope.emailMeta = {};
    $scope.userEmailData = [
        { name: "Ahmad Yahoo", email: "ahmad.pgu1@yahoo.com" },
        { name: "Ahmad Hassan", email: "ahmad.pgu1@hotmail.com" },
        { name: "Ahmad Gmail", email: "ahmad.pgu1@gmail.com" },
        { name: "Farhan Afzal", email: "farhan.afzal@silverow.com" }
    ];
    $scope.newEmailInList = function (tag) { // this is a functional created for ui-select to allow new value as input additional to the values inside array..

        var obj = {};
        obj.name = "";
        obj.email = tag;
        //$scope.cat_prodcut_arr.push(obj);
        return obj;
    }

    $scope.getSmartContacts = function () {
        $scope.showLoader = true;
        var contactData = { token: $rootScope.token };
        var contactPath = $rootScope.com + 'contact/smartcontacts';
        $http.post(contactPath, contactData).then(function (result) {
            $scope.contacts = result.data;
        });
        $timeout(function () {
            $scope.showLoader = false;
        }, 500);
    };

    $scope.breadcrumbs =
        [{ 'name': $scope.userinfo, 'url': '#', 'isActive': false },
        { 'name': 'Mail', 'url': '#', 'isActive': false }];

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
    $scope.api_emails = [];
    $scope.searchKeyword1 = {};
    $scope.email_description = "";
    $scope.showbody = function (rec) {
        $scope.email_description = rec.body;
        $scope.email_subject = rec.subject;
        console.log(rec);
        angular.forEach($scope.api_emails, function (obj) {
            if (obj.active != undefined && obj.active == 1)
                obj.active = 0;
        });
        rec.active = 1;
    }
    $scope.getAllEmails = function () {
        var getEmails = $rootScope.com + 'mail/get-all-emails';
        var postData = {
            'token': $scope.$root.token,
        };
        $http
            .post(getEmails, postData)
            .then(function (res) {
                $scope.api_emails = res.data.response;
                if ($scope.api_emails.length > 0) {
                    $scope.email_description = $scope.api_emails[0].body;
                    $scope.email_subject = $scope.api_emails[0].subject;
                    $scope.api_emails[0].active = 1;
                }
            });

    }
    // $scope.getAllEmails();

    /* $interval(function () {

        var clientConData = { token: $rootScope.token };
        var clientConPath = $rootScope.com + 'mail/new';
        $http.post(clientConPath, clientConData).then(function (result) {
            $scope.numbers = result.data;
        });
    }, 60000 * 5);

    $scope.getNewMailCount = function () {
        $interval(function () {

            var clientConData = { token: $rootScope.token };
            var clientConPath = $rootScope.com + 'mail/new';
            $http.post(clientConPath, clientConData).then(function (result) {
                $scope.numbers = result.data;
            });
        }, 60000 * 5);
    }; */

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
    $scope.mailsFolders = {};
    $scope.signature = "";

    $scope.composeMail = function () {

        $scope.breadcrumbs =
            [{ 'name': 'Mail', 'url': '#', 'isActive': false },
            { 'name': $scope.userinfo, 'url': '#', 'isActive': false },
            { 'name': 'Compose', 'url': '#', 'isActive': false }
            ];
        $scope.showLoader = true;
        $scope.mail.mailTo = "";
        $scope.mail.mailCC = [];
        $scope.mail.mailCC[0] = "";
        $scope.mail.mailBCC = [];
        $scope.reply = false;
        $scope.mail.mailBCC[0] = "";
        angular.element('#cleartobtn').click();
        angular.element('#clearccbtn').click();
        angular.element('#clearbccbtn').click();
        $scope.mail.mailSubject = "";
        $scope.mail.mailBody = "";

        var clientConData = { id: $stateParams.id, token: $rootScope.token };
        var clientConPath = $rootScope.com + 'mail/signature';
        var result = "";
        $http.post(clientConPath, clientConData).then(function (result) {
            var signature = "";
            if (result.data.html != "") {
                signature = "<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>" + result.data.html;
            }
            var iframeid = angular.element('#editorpanel iframe').attr('id');
            angular.element("#" + iframeid).contents().find("#tinymce").html(signature);
        });


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
        $timeout(function () {
            $scope.showLoader = false;
        }, 300);

    };

    $scope.getSignature = function () {
        var clientConData = { id: $stateParams.id, token: $rootScope.token };
        var clientConPath = $rootScope.com + 'mail/signature';
        var result = "";
        $http.post(clientConPath, clientConData).then(function (result) {
            result = result.data;
        });
        return result;
    };

    $scope.reply = function () {
        angular.element('#myarea').attr('style', 'height: 600px !important; width: 100%;');
        angular.element('#myarea_tbl').attr('style', 'height: 530px !important; width: 100%;');
        angular.element('#myarea_ifr').attr('style', 'height: 550px !important; width: 100%;');
        $scope.breadcrumbs =
            [{ 'name': 'Mail', 'url': '#', 'isActive': false },
            { 'name': $scope.userinfo, 'url': '#', 'isActive': false },
            { 'name': 'Reply', 'url': '#', 'isActive': false }
            ];

        $scope.defaultmail = false;
        $scope.readmail = false;
        $scope.showTo = false;
        $scope.showCC1 = true;
        $scope.showBCC1 = true;
        $scope.composemail = true;
        $scope.showSubject = false;
        $scope.reply = true;
        $scope.replyall = false;

    };

    $scope.replyAll = function () {
        $scope.breadcrumbs =
            [{ 'name': 'Mail', 'url': '#', 'isActive': false },
            { 'name': $scope.userinfo, 'url': '#', 'isActive': false },
            { 'name': 'ReplyAll', 'url': '#', 'isActive': false }
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
            [{ 'name': 'Mail', 'url': '#', 'isActive': false },
            { 'name': $scope.userinfo, 'url': '#', 'isActive': false },
            { 'name': 'Forward', 'url': '#', 'isActive': false }
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
        var clientConData = { token: $rootScope.token };
        var clientConPath = $rootScope.com + 'mail/isconfigurationexist';
        $http.post(clientConPath, clientConData).then(function (result) {

            if (result.data.total == 0) {
                angular.element('#modaladdmailbtn').click();
            } else if (result.data.total > 0) {
                var imapData = { token: $rootScope.token };
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
                        var clientConData = { token: $rootScope.token };
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
                        $state.go("app.folder", { type: 'INBOX' });
                    }
                });
            }

        });
    };
    $scope.imap = {};
    $scope.imap.valid = 0;
    $scope.isIMAPConfigValid = function () {
        var imapData = { token: $rootScope.token };
        var imapPath = $rootScope.com + 'mail/isimapvalid';
        $http.post(imapPath, imapData).then(function (result) {
            $scope.imap.valid = result.data.valid;
        });
    };


    $scope.mailsFoldersCount = {};
    $scope.getMailsFolders = function () {
        var clientConData = { token: $rootScope.token };
        var clientConPath = $rootScope.com + 'mail/new';
        $http.post(clientConPath, clientConData).then(function (result) {
            $scope.numbers = result.data;
        });
        var mailData = { token: $rootScope.token };
        var mailPath = $rootScope.com + 'mail/mailsfolders';
        $http.post(mailPath, mailData).then(function (result) {

            //console.log($scope.mailsFolders);

            $scope.mailsFolders = result.data;

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
        $scope.showLoader = true;
        var mailData = { id: $stateParams.id, token: $rootScope.token };
        var mailPath = $rootScope.com + 'mail/mailfolders';
        $http.post(mailPath, mailData).then(function (result) {

            $scope.mailFolders = result.data.folders;

        });
        $timeout(function () {
            $scope.showLoader = false;
        }, 500);
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
    $scope.showLoader = false;
    $scope.sendMail = function (attachments) {
        // codemark 2
        var emailTo = [];
        angular.forEach($scope.emailMeta.emailTo, function (obj, index) {
            emailTo.push(obj.email);
        })
        var emailCC = [];
        angular.forEach($scope.emailMeta.emailCC, function (obj, index) {
            emailCC.push(obj.email);
        })
        $scope.showLoader = true;
        var iframeid = angular.element('#editorpanel iframe').attr('id');
        var mailBody = angular.element("#" + iframeid).contents().find("#tinymce").html();
        mailBody = $scope.newemail;
        var mailData = {};
        if ($scope.reply || $scope.replyall) {
            mailData = {
                id: $stateParams.id,
                type: 'reply',
                to: emailTo,
                subject: $scope.emailMeta.emailSubject,
                cc: emailCC,
                bcc: $scope.mail.mailBCC[0],
                body: mailBody,
                files: attachments,
                token: $rootScope.token
            };
        } else {
            mailData = {
                id: $stateParams.id,
                type: 'noreply',
                to: emailTo,
                subject: $scope.emailMeta.emailSubject,
                cc: emailCC,
                bcc: angular.element('#select-bcc').val(),
                body: mailBody,
                files: attachments,
                token: $rootScope.token
            };
        }

        var mailPath = $rootScope.com + 'mail/sendmail';
        $http.post(mailPath, mailData).then(function (result) {
            console.log(result.data);
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

            if (result.data.ack == 1) {

                toaster.pop('success', 'Send Mail', 'Email has successfully been sent.');

                $timeout(function () {
                    $scope.showLoader = false;
                    $state.reload();
                    var clientConData = { token: $rootScope.token };
                    var clientConPath = $rootScope.com + 'mail/new';
                    $http.post(clientConPath, clientConData).then(function (result) {
                        $scope.numbers = result.data;
                    });
                }, 1000);
            } else {
                toaster.pop('error', 'Send Mail', 'Email not Sent.');
                $timeout(function () {
                    $scope.showLoader = false;
                }, 500);
            }
        });
        $timeout(function () {
            $scope.showLoader = false;
        }, 1000);
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
        var mailData = {
            id: $stateParams.id,
            to: $scope.mail.mailTo,
            subject: $scope.mail.mailSubject,
            cc: mailCCStr,
            bcc: mailBCCStr,
            body: mailBody,
            files: attachments,
            token: $rootScope.token
        };
        var mailPath = $rootScope.com + 'mail/savemail';
        $http.post(mailPath, mailData).then(function (result) {
            $scope.mail.mailTo = "";
            $scope.mail.mailCC[0] = "";
            $scope.mail.mailBCC[0] = "";
            $scope.mail.mailSubject = "";
            $scope.mail.mailBody = "";
            var iframeid = angular.element('#editorpanel iframe').attr('id');
            var mailBody = angular.element("#" + iframeid).contents().find("#tinymce").html('');
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
        var imapData = { token: $rootScope.token };
        var imapPath = $rootScope.com + 'mail/folders';
        $http.post(imapPath, imapData).then(function (result) {
            console.log("Folders");
            console.log(result.data);
            $scope.folders = result.data;
        });
    };

    $scope.hasUnreadMails = function (id, folder) {
        console.log("id::" + id + ", Folder::" + folder);
        var imapData = { id: id, folder: folder, token: $rootScope.token };
        var imapPath = $rootScope.com + 'mail/unread';
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

        var folderData = { id: $stateParams.id, folder: $stateParams.type, token: $rootScope.token };
        var folderPath = $rootScope.com + 'mail/folder';
        $http.post(folderPath, folderData).then(function (result) {
            $scope.folder = result.data;
            $scope.breadcrumbs =
                [{ 'name': 'Mail', 'url': 'app.folder({id: $stateParams.id, type: "INBOX"})', 'isActive': false },
                { 'name': $scope.userinfo, 'url': '#', 'isActive': false },
                { 'name': $scope.stateType, 'url': '#', 'isActive': false }];
        });
    }

    $scope.folderMessage = "";
    $scope.attachments = {};
    $scope.header = {};
    $scope.messageno = "";
    $scope.printMessage = "";
    $scope.getFolderMessage = function (messageNumber, showread) {

        $scope.defaultmail = true;
        $scope.readmail = true;
        $scope.showLoader = true;
        $scope.messageno = messageNumber;
        var folderMessageData = {
            id: $stateParams.id,
            folder: $stateParams.type,
            messageNumber: messageNumber,
            token: $rootScope.token
        };
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
        $timeout(function () {
            $scope.showLoader = false;
        }, 500);
    };

    $scope.getSearchMessage = function (messageNumber, showread, folder) {

        $scope.readmail = true;
        $scope.messageno = messageNumber;
        var searchMessageData = {
            id: $stateParams.id,
            folder: folder,
            messageNumber: messageNumber,
            token: $rootScope.token
        };
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

        var folderMessageData = {
            id: $stateParams.id,
            folder: $stateParams.type,
            messageNumber: $scope.messageno,
            token: $rootScope.token
        };
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
                $scope.mail.mailTo = result.data.header.reply_to[0].reply_to;
            } else if (subject == 'Rep All: ') {
                $scope.showTo = false;
                $scope.showCC1 = false;
                $scope.showBCC1 = false;
                $scope.showCC = false;
                $scope.showBCC = false;
                $scope.composemail = true;
                $scope.mail.mailTo = result.data.header.reply_to[0].reply_to;
            }

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
                {
                    label: 'Rename', icon: '', action: function () {
                    }
                },
                {
                    label: 'Create', icon: '', action: function () {
                    }
                },
                {
                    label: 'Delete', icon: '', action: function () {
                        $scope.deleteFolder($scope.stateId, $scope.stateFolder);
                    }
                }
            ]
        });

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
        var folderData = {
            id: $scope.userfolder.id,
            folder: $scope.userfolder.parentFolder,
            newFolder: $scope.userfolder.newName,
            token: $rootScope.token
        };
        var folderPath = $rootScope.com + 'mail/createsubfolder';
        $http.post(folderPath, folderData).then(function (result) {
            $window.location.reload(true);
        });
    };

    $scope.renameFolder = function () {
        var folderData = {
            id: $scope.userfolder.id,
            folder: $scope.userfolder.oldName,
            newFolder: $scope.userfolder.newName,
            token: $rootScope.token
        };
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
        var folderData = { id: $scope.userfolder.id, folder: $scope.userfolder.oldName, token: $rootScope.token };
        var folderPath = $rootScope.com + 'mail/deletefolder';

        $http.post(folderPath, folderData).then(function (result) {

            if (result.data.ack == true) {

                if (folder.split(".").length > 0) {
                    var splitFolder = folder.split(".");
                    var folderName = splitFolder[splitFolder.length - 1];
                    angular.element('#act_' + folderName + id).hide();
                }
            } else {
            }
        });
    };

    $scope.deleteMessage = function () {
        var folderData = {
            id: $stateParams.id,
            folder: $stateParams.type,
            messageno: $scope.messageno,
            token: $rootScope.token
        };
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
            var folderData = {
                id: $stateParams.id,
                type: $stateParams.type,
                folder: folder,
                messageno: $scope.messageno,
                token: $rootScope.token
            };
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
                    $scope.modalBody = "Mail has been Moved to " + movedFolder + " folder.";
                    angular.element('#mainModal').modal({
                        show: true
                    });
                }
            });
        }

    };

    $scope.setFolderMessageFlags = function (messageNumber, flags, method) {
        var flagData = {
            id: $stateParams.id,
            folder: $stateParams.type,
            messageNumber: messageNumber,
            flags: flags,
            method: method,
            token: $rootScope.token
        };
        var flagPath = $rootScope.com + 'mail/setflags';
        $http.post(flagPath, flagData).then(function (result) {
        });
    };
    $scope.unsetFolderMessageFlags = function (messageNumber, flags, method) {
        var flagData = {
            id: $stateParams.id,
            folder: $stateParams.type,
            messageNumber: messageNumber,
            flags: flags,
            method: method,
            token: $rootScope.token
        };
        var flagPath = $rootScope.com + 'mail/unsetflags';
        $http.post(flagPath, flagData).then(function (result) {
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
        var attachmentData = {
            id: $stateParams.id,
            folder: $stateParams.type,
            messageNumber: mailno,
            ano: ano,
            enc: enc,
            method: method,
            name: name,
            partNum: partNum,
            subtype: subtype,
            token: $rootScope.token
        };
        var attachmentPath = $rootScope.com + 'mail/downloadattachment';
        $http.post(attachmentPath, attachmentData).then(function (result) {
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
            [{ 'name': 'Mail', 'url': '#', 'isActive': false },
            { 'name': 'Inbox', 'url': '#', 'isActive': false }];

        var inboxData = { token: $rootScope.token };
        var inboxPath = $rootScope.com + 'mail/inbox';
        $http.post(inboxPath, inboxData).then(function (result) {
            if (result.data.isconnected == 0) {
                $state.go("app.mail");
            }
            $scope.inbox = result.data;
        });
    };

    $scope.inboxMessage = {};
    $scope.getInboxMessage = function (messageNumber) {
        var inboxMessageData = { messageNumber: messageNumber, token: $rootScope.token };
        var inboxMessagePath = $rootScope.com + 'mail/inboxmessage';
        $http.post(inboxMessagePath, inboxMessageData).then(function (result) {
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
        var clientData = {
            username: $scope.clientCon.username,
            password: $scope.clientCon.password,
            pop3server: $scope.clientCon.pop3Server,
            pop3port: $scope.clientCon.pop3Port,
            pop3ssl: $scope.clientCon.pop3SSL,
            pop3spa: $scope.clientCon.pop3SPA,
            imapserver: $scope.clientCon.imapServer,
            imapport: $scope.clientCon.imapPort,
            imapssl: $scope.clientCon.imapSSL,
            imapspa: $scope.clientCon.imapSPA,
            smtpserver: $scope.clientCon.smtpServer,
            smtpport: $scope.clientCon.smtpPort,
            smtpssl: $scope.clientCon.smtpSSL,
            smtpspa: $scope.clientCon.smtpSPA,
            smtpauth: $scope.clientCon.smtpAuth,
            token: $rootScope.token
        };
        var clientPath = $rootScope.com + 'mail/addclientconfiguration';
        $http.post(clientPath, clientData).then(function (result) {
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
                $(".first_level").removeClass('sidbar_active');
                $("#" + id).addClass('sidbar_active');
            }
        } else {
            $scope.hideAllParents();
            if ($("#" + child).length) {
                $("#" + child).css("display", 'none');
                $(".first_level").removeClass('sidbar_active');
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
        $scope.showLoader = true;
        $scope.searchKeyword = $stateParams.keyword;
        $scope.breadcrumbs =
            [{ 'name': 'Mail', 'url': '#', 'isActive': false },
            { 'name': $scope.userinfo, 'url': '#', 'isActive': false },
            { 'name': 'Search', 'url': '#', 'isActive': false }];
        var searchData = { id: $stateParams.id, search: $stateParams.keyword, token: $rootScope.token };
        var searchPath = $rootScope.com + 'mail/search';
        $http.post(searchPath, searchData).then(function (result) {
            $scope.searchResults = result.data;
        });
        $timeout(function () {
            $scope.showLoader = false;
        }, 500);
    };

    $scope.getUserInfo = function () {
        var userinfoData = { id: $stateParams.id, token: $rootScope.token };
        var userinfoPath = $rootScope.com + 'mail/userinfo';
        $http.post(userinfoPath, userinfoData).then(function (result) {
            if (result.data.alias != "") {
                $scope.userinfo = result.data.alias;
            } else {
                $scope.userinfo = result.data.username;
            }
        });
    };


    if ($scope.$root.counter == 1) {
        if ($stateParams.file != undefined && $stateParams.file != '') {
            $timeout(function () {
                angular.element("#newmailbtn").click();
                $scope.$root.$broadcast('attachInvoice', $stateParams.file, $stateParams.id);
            }, 5000);
        }
    }

    $scope.$root.counter++;

}]);

MailAttachmentController.$inject = ["$scope", "$rootScope", "Upload", "$timeout", "toaster"];
myApp.controller('MailAttachmentController', MailAttachmentController);

function MailAttachmentController($scope, $rootScope, Upload, $timeout, toaster, $stateParams) {


    $scope.mailAttachments = [];
    $scope.mailAttachment = {};
    $scope.mailAttachment.fileName = [];
    $scope.mailAttachment.newFileName = [];
    $scope.showLoader = false;


    $scope.uploadFiles = function (file) {


        $scope.showLoader = true;
        var postUrl = $rootScope.com + 'mail/uploadfile';
        // console.log(file);
        if (file) {
            file.upload = Upload.upload({
                url: postUrl,
                data: { file: file, image_token: $scope.$root.token }
            });

            file.upload.then(function (response) {
                // console.log(response);
                $timeout(function () {

                    if (response.data.ack == true) {

                        $scope.mailAttachments.push({
                            'fileName': response.data.fileName,
                            'newFileName': response.data.newFileName
                        });


                        file.result = response.data;
                        $scope.mailAttachment.fileName = response.data.fileName;
                        $scope.mailAttachment.newFileName = response.data.newFileName;
                        $scope.showLoader = false;
                        toaster.pop('success', 'File Upload', 'File Uploaded Successfully');

                        $rootScope.$broadcast('Attachments', $scope.mailAttachments);

                    }
                    else {
                        $scope.showLoader = false;
                        toaster.pop('error', 'Info', response.data.response);
                    }
                });
            }, function (response) {

                if (response.status > 0) {
                    $scope.errorMsg = response.status + ': ' + response.data;
                    $scope.showLoader = false;
                    toaster.pop('error', 'File Upload', 'Error in File uploaded!');
                }
            }
                , function (evt) {
                    // console.log(evt);
                    file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    $scope.showLoader = false;
                    //toaster.pop('error', 'File Upload', 'Error in File uploaded!');
                }
            );
        }
    };

    $scope.$on('attachInvoice', function (event, num, id) {
        $scope.mailAttachments.push({ 'fileName': num + '_invoice.pdf', 'newFileName': num + '_invoice.pdf' });
        MailLeftPanel();
        $timeout(function () {
            angular.element("#" + id + "_sidebar").click();
        }, 1000);
    });
}


EmailInternal.$inject = ["$scope", "$stateParams", "$http", "$state", "$resource", "toaster", "$filter", "$window", "ngDialog", '$timeout', "$rootScope", "Upload", "$interval", "$sce", "$location", "$anchorScroll"];
myApp.controller('EmailInternal', EmailInternal);
function EmailInternal($scope, $stateParams, $http, $state, $resource, toaster, $filter, $window, ngDialog, $timeout, $rootScope, Upload, $interval, $sce, $location, $anchorScroll) {
    'use strict';


    $scope.searchKeyword = '';
    $rootScope.getModuleEmails = function () {

        var clientConData = { token: $rootScope.token };
        var clientConPath = $rootScope.com + 'mail/new';
        $http.post(clientConPath, clientConData).then(function (result) {

            if (result.data.InsertId > 0) {
                $scope.getAllEmailsListing();
                $scope.Listing = true;
            }
            // $rootScope.numbers = result.data;
            // console.log(result.data);

        });

    }
    $scope.MessageDetail = false;
    $scope.Listing = true;
    $scope.values = [];
    $scope.detailEmails = {};
    $scope.showHide = function (Emails) {


        //console.log(Emails);
        $scope.detailEmails = Emails;
        $scope.Listing = false;
        $scope.MessageDetail = true;
        $scope.values = [];
    }

    $scope.ListingShow = function () {

        $scope.detailEmails = {};
        $scope.Listing = true;
        $scope.MessageDetail = false;
        $scope.values = [];
        $scope.draftdMail = [];
        $scope.sendData = [];
        $scope.viewDraft = false;

    }


    $scope.checkAll = function () {

        $scope.values = [];

        if ($scope.selectedAll) {
            $scope.selectedAll = true;
        }

        else {
            $scope.selectedAll = false;
            $scope.values = [];
        }

        angular.forEach($scope.$root.emailData, function (item) {

            item.Selected = $scope.selectedAll;

            $scope.values.push(item.id);
        });
        // console.log($scope.$root.emailData);
    };

    $scope.archivingEmails = function () {


        if ($scope.values.length == 0 || $scope.values == undefined) {
            toaster.pop('error', 'Archive', 'Select atleast one');
            return;
        }


        var getmailPath = $rootScope.com + 'mail/move-archive-emails';
        var ids = $scope.values;


        $http
            .post(getmailPath, { ids: ids, token: $rootScope.token })
            .then(function (res) {
                toaster.pop('success', 'Archive', 'Moved to archive');
                $scope.getAllEmailsListing('inbox');
                $scope.values = [];
                // $rootScope.arrEmails = res.data.response;
            });

    }
    $scope.InboxingEmails = function () {


        if ($scope.values.length == 0 || $scope.values == undefined) {
            toaster.pop('error', 'Inbox', 'Select atleast one');
            return;
        }

        var getmailPath = $rootScope.com + 'mail/move-inbox-emails';
        var ids = $scope.values;


        $http
            .post(getmailPath, { ids: ids, token: $rootScope.token })
            .then(function (res) {
                toaster.pop('success', 'Archive', 'Moved to inbox');
                $scope.getAllEmailsListing('archive');
                $scope.values = [];
                // $rootScope.arrEmails = res.data.response;
            });

    }

    $scope.DeleteEmails = function () {

        if ($scope.values.length == 0 || $scope.values == undefined) {
            toaster.pop('error', 'CheckBox', 'Select atleast one');
            return;
        }


        var getmailPath = $rootScope.com + 'mail/delete-emails';
        var ids = $scope.values;


        $http
            .post(getmailPath, { ids: ids, token: $rootScope.token })
            .then(function (res) {
                toaster.pop('success', 'Trash', 'Moved to trash');
                $scope.getAllEmailsListing('inbox');
                $scope.values = [];
                // $rootScope.arrEmails = res.data.response;
            });

    }

    $scope.selectedItem = function () {

        $scope.values = angular.element('input:checkbox:checked.checkboxes').map(function () {
            return this.value;
        }).get();

        // console.log($scope.values);
    }


    var counter = 0;
    $scope.$on("EmailReferenceList", function (event, account_id, row_id, module, module_id, module_name, module_code, sub_type, tab_id, module_type) {
        $scope.ReferenceData = {};
        $scope.$root.emailData = {};
        $scope.ReferenceData.account_id = account_id;
        $scope.ReferenceData.row_id = row_id; //$stateParams.id;
        $scope.ReferenceData.module = module;
        $scope.ReferenceData.module_id = module_id;
        $scope.ReferenceData.module_name = module_name;
        $scope.ReferenceData.module_code = module_code;
        $scope.ReferenceData.sub_type = sub_type;
        $scope.ReferenceData.tab_id = tab_id;
        $scope.ReferenceData.module_type = module_type;
        $scope.ReferenceData.token = $rootScope.token;
        $scope.ReferenceData.archive = 'no';
        // console.log(counter);
        $scope.showLoader = true;

        $scope.getAllEmailsListing();


        //counter +1;
    });


    $scope.getAllEmailsListing = function (type) {


        if (type == 'inbox') {
            $scope.ReferenceData.archive = 'no';
            $scope.listingType = 'inbox';
        }
        else if (type == 'archive') {
            $scope.ReferenceData.archive = 'yes';
            $scope.listingType = 'archive';
        }
        else if (type == 'draft') {
            $scope.ReferenceData.archive = 'no';
            $scope.viewDraft = true;
            //$scope.ReferenceData.archive = 'yes';
            $scope.listingType = 'draft';
        }
        else {

            $scope.ReferenceData.archive = 'no';
            $scope.listingType = 'inbox';
        }

        //off message detail view
        $scope.MessageDetail = false;

        var getmailPath = $rootScope.com + 'mail/get_emails_internal';

        if (type == 'draft') {
            getmailPath = $rootScope.com + 'mail/get_draft_emails_internal';
        }

        //var getmailPath = $rootScope.com + 'mail/get_emails_internal';
        $http.post(getmailPath, $scope.ReferenceData).then(function (result) {

            if (result.data.ack == true) {

                $scope.$root.emailData = result.data.emails;


                $scope.showLoader = false;
                //On Listing View
                $scope.Listing = true;

            }
            else {
                $scope.showLoader = false;
            }

        });
    }
    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.DraftMailer = function (draftMessage) {

        $location.hash('draftMail' + draftMessage.id);
        $anchorScroll();

        $scope.attachment = [];
        $scope.sendData = [];
        $scope.draftdMail = [];
        $scope.viewDraft = true;


        // console.log(draftMessage);

        $scope.ReferenceData.account_id = draftMessage.account_id;
        $scope.ReferenceData.sender_id = draftMessage.sender_id;
        $scope.ReferenceData.row_id = draftMessage.row_id; //$stateParams.id;
        $scope.ReferenceData.module_id = draftMessage.module_id;
        $scope.ReferenceData.sub_type = draftMessage.sub_type;
        $scope.ReferenceData.tab_id = draftMessage.tab_id;
        $scope.ReferenceData.module_type = draftMessage.module_type;
        $scope.ReferenceData.message_id = draftMessage.message_id;
        $scope.ReferenceData.token = $rootScope.token;
        $scope.ReferenceData.archive = 'no';

        $scope.sendData.to = draftMessage.email_address_from;
        $scope.sendData.from = draftMessage.email_address_to;
        $scope.sendData.subject = draftMessage.email_subject;
        $scope.sendData.isSave = true;
        $scope.sendData.status = draftMessage.status;
        $scope.sendData.parentId = draftMessage.email_parent_id;

        $scope.getContacts(draftMessage.module_type, draftMessage.account_id);

        //  console.log(JSON.parse(messageData.email_address_to));

        $scope.draftdMail.subject = draftMessage.email_subject;

        //custom data have objects of multiple selected emails
        if (draftMessage.custom.to != undefined)
            $scope.draftdMail.to = draftMessage.custom.to;
        if (draftMessage.custom.cc != undefined)
            $scope.draftdMail.cc = draftMessage.custom.cc;
        if (draftMessage.custom.bcc != undefined)
            $scope.draftdMail.bcc = draftMessage.custom.bcc;

        //attachments
        if (draftMessage.attachments != undefined) {
            for (var i = 0; i < draftMessage.attachments.length; i++) {
                $scope.attachment.push({
                    'fileName': draftMessage.attachments[i]['old_name'],
                    'newFileName': draftMessage.attachments[i]['new_name']
                });
            }

        }
        $scope.draftdMail.message = draftMessage.email_body;

    }

    $scope.replyMailer = function (messageData, replyData, index, send_all) {
        //console.log($location);
        //Scroll to editor
        $location.hash('replyMail' + index);
        $anchorScroll();

        $scope.attachment = [];
        // console.log(replyData);
        $scope.sendData = [];
        $scope.replyMail = [];

        $scope.ReferenceData.account_id = replyData.account_id;
        $scope.ReferenceData.sender_id = replyData.sender_id;
        $scope.ReferenceData.row_id = replyData.row_id; //$stateParams.id;
        $scope.ReferenceData.module_id = replyData.module_id;
        $scope.ReferenceData.sub_type = replyData.sub_type;
        $scope.ReferenceData.tab_id = replyData.tab_id;
        $scope.ReferenceData.module_type = replyData.module_type;
        $scope.ReferenceData.message_id = messageData.message_id;
        $scope.ReferenceData.token = $rootScope.token;
        $scope.ReferenceData.archive = 'no';

        if (send_all == 1) {

            if (replyData.cc) {
                var temp = [];
                var obj = {};
                obj = [{ email: '', first_name: '', last_name: '' }];

                temp = replyData.cc.split(',');
                for (var i = 0; i < temp.length; i++) {
                    obj.push({ email: temp[i], first_name: temp[i], last_name: '' });
                }

                $scope.replyMail.cc = obj.slice(1);  //$rootScope.remove_null_json(obj,'email');;
            }
            if (replyData.bcc) {
                var temp = [];
                var obj = [];
                obj = [{ email: '', first_name: '', last_name: '' }];
                temp = replyData.bcc.split(',');
                for (var i = 0; i < temp.length; i++) {
                    obj.push({ email: temp[i], first_name: temp[i], last_name: '' });
                }
                $scope.replyMail.bcc = obj.slice(1);  //$rootScope.remove_null_json(obj,'email');;
            }

            angular.element('#openCC' + index).click();
            angular.element('#openBCC' + index).click();
        }

        $scope.sendData.to = replyData.email_address_from;
        $scope.sendData.from = replyData.email_address_to;
        $scope.sendData.subject = 'Re: ' + replyData.email_subject;
        $scope.sendData.isSave = true;
        $scope.sendData.status = '4';
        $scope.sendData.parentId = replyData.email_parent_id;
        $scope.ReplyIndex = index;

        $scope.getContacts(replyData.module_type, replyData.account_id);
        //$scope.attachments = $scope.attachment;


        angular.element("#summernote" + $scope.ReferenceData.module_id + '-' + index).summernote("code", ' <span' +
            ' style="display:inline-block;' + ' height:100px;width:100%"></span> ' + replyData.date_time + ', <i>  ' + replyData.email_address_from + '</i> wrote : ' + ' <blockquote class="quote" style="font-size: 11px;">' + replyData.email_body + '</blockquote>');
    }


    $scope.forwardMailer = function (messageData, forwardData, index) {
        //console.log($location);
        //Scroll to editor
        $location.hash('forwardMail' + index);
        $anchorScroll();

        $scope.attachment = [];
        // console.log(replyData);
        $scope.sendData = [];

        $scope.ReferenceData.account_id = forwardData.account_id;
        $scope.ReferenceData.sender_id = forwardData.sender_id;
        $scope.ReferenceData.row_id = forwardData.row_id; //$stateParams.id;
        $scope.ReferenceData.module_id = forwardData.module_id;
        $scope.ReferenceData.sub_type = forwardData.sub_type;
        $scope.ReferenceData.tab_id = forwardData.tab_id;
        $scope.ReferenceData.module_type = forwardData.module_type;
        $scope.ReferenceData.message_id = messageData.message_id;
        $scope.ReferenceData.token = $rootScope.token;
        $scope.ReferenceData.archive = 'no';

        // $scope.sendData.to = forwardData.email_address_from;
        $scope.sendData.from = forwardData.email_address_to;
        $scope.sendData.subject = 'Forward: ' + forwardData.email_subject;
        $scope.sendData.isSave = true;
        $scope.sendData.status = '2';
        $scope.sendData.parentId = 0; //consider as new mail
        $scope.ReplyIndex = index;

        $scope.getContacts(forwardData.module_type, forwardData.account_id);

        //forward string
        var str = '-----------------------Forward---------------------------</br>';
        str += 'From : <b>' + forwardData.email_address_from + '</b></br>';
        str += 'Date : <b>' + forwardData.date_time + '</b></br>';
        str += 'To : <b>' + forwardData.email_address_to + '</b></br>';
        str += 'Subject : <b>' + forwardData.email_subject + '</b></br>';
        if (forwardData.cc != '')
            str += 'Cc : <b>' + forwardData.cc + '</b></br>';
        if (forwardData.bcc != '')
            str += 'Bcc : <b>' + forwardData.bcc + '</b></br>';
        str += '<p>' + forwardData.email_body + '</p></br>';


        angular.element("#fsummernote" + $scope.ReferenceData.module_id + '-' + index)
            .summernote("code", ' <span style="display:inline-block; height:20px;width:100%"></span> ' + str);
    }


    /*-----------------Attachment---------------*/
    $scope.$on('Attachments', function (events, args) {
        $scope.attachment = args;
    })

    $scope.removeAttachment = function (attachment) {

        var index = $scope.attachment.indexOf(attachment);
        $scope.attachment.splice(index, 1);

    }
    /*-----------------Attachment---------------*/


    $scope.replyInternalEmail = function (RData, all_status) {


        var mailData = {
            refData: $scope.ReferenceData,
            from: $scope.sendData.from,
            to: RData.to,
            subject: $scope.sendData.subject,
            cc: RData.cc,
            bcc: RData.bcc,
            body: RData.message,
            files: $scope.attachment,
            isSave: $scope.sendData.isSave,
            status: $scope.sendData.status,
            email_parent_id: $scope.sendData.parentId,
            token: $rootScope.token
        };
        var mailPath = $rootScope.com + 'mail/reply_mail_internal';
        $http.post(mailPath, mailData).then(function (result) {

            if (result.data.ack == true) {
                toaster.pop('success', 'Mail', 'Mail Sent Successfully!');

                $scope.getAllEmailsListing();
                $scope.Listing = true;
                $scope.attachment = [];
                $("#replyMail" + $scope.ReplyIndex).hide();

            }
            else {
                toaster.pop('error', 'Mail', 'Mail Not Sent!');
            }
        });
    }


    /*-------------------------------Select2 functions-----------------------*/
    $scope.person = {};
    $scope.counter = 0;
    $scope.onSelectCallback = function (item, model) {
        $scope.counter++;
        $scope.eventResult = { item: item, model: model };
    };

    $scope.removed = function (item, model) {
        $scope.lastRemoved = {
            item: item,
            model: model
        };
    };

    $scope.tagTransform = function (newTag) {
        var item = {
            name: newTag,
            email: newTag.toLowerCase()
        };
        return item;
    };


    $scope.getContacts = function (module_type, id) {

        var contactData = { id: id, token: $rootScope.token };

        if (module_type == 1)
            var contactPath = $rootScope.com + 'contact/get_crm_contacts';
        else if (module_type == 2)
            var contactPath = $rootScope.com + 'contact/get_srm_contacts';


        $http.post(contactPath, contactData).then(function (result) {
            $scope.person = result.data;

            //  console.log(result.data);
        });
        $timeout(function () {

        }, 300);
    };


    /*-------------------------------Select2 functions-----------------------*/




}

EmailCompose.$inject = ["$scope", "$stateParams", "$http", "$state", "$resource", "toaster", "$filter", "$window", "ngDialog", '$timeout', "$rootScope", "Upload", "$interval", "$sce"];
myApp.controller('EmailCompose', EmailCompose);
function EmailCompose($scope, $stateParams, $http, $state, $resource, toaster, $filter, $window, ngDialog, $timeout, $rootScope, Upload, $interval, $sce) {
    'use strict';

    $scope.attachment = [];
    $rootScope.send_email_internal = function (emailData) {

        var tabid = $rootScope.tab_id
        $scope.saveMailInternal(tabid, emailData);


    }

    $scope.saveDraft = function (EmailArray) {

        if (EmailArray.message == undefined) {
            toaster.pop('error', 'Message', $scope.$root.getErrorMessageByCode(230, ['Message Body']));
            return;
        }

        var mailData = {
            refData: $scope.ReferenceData,
            from: EmailArray.from,
            to: EmailArray.to,
            subject: EmailArray.subject,
            cc: EmailArray.cc,
            bcc: EmailArray.bcc,
            body: EmailArray.message,
            files: $scope.attachment,
            isSave: EmailArray.isSave,
            token: $rootScope.token
        };

        var mailPath = $rootScope.com + 'mail/save_draft_internal';
        $http.post(mailPath, mailData).then(function (result) {

            if (result.data.ack == true) {
                toaster.pop('success', 'Mail', 'Successfully Saved!');
                angular.element('#composeEmail').modal('hide');
            }
            else {
                toaster.pop('error', 'Mail', 'Mail Not Saved!');
            }
        });

    }

    $rootScope.options = {
        height: 227,
        focus: true,
        dialogsInBody: true,
        dialogsFade: false,
        toolbar: [
            ['fontname', ['fontname']],
            ['style', ['bold', 'italic', 'underline']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ol', 'paragraph']],
            ['insert', ['link', 'picture']],
            ['codeview', ['codeview']],
            ['view', ['undo', 'redo']],
            ['help', ['help']]

        ]
    };
    var redirect = '';
    // $scope.call_event = function () {
    var counter = 0;
    $scope.$on("EmailReference", function (event, account_id, row_id, module, module_id, module_name, module_code, sub_type, tab_id, module_type, list) {
        $scope.ReferenceData = {};

        $scope.ReferenceData.account_id = account_id;
        $scope.ReferenceData.row_id = row_id; //$stateParams.id;
        $scope.ReferenceData.module = module;
        $scope.ReferenceData.module_id = module_id;
        $scope.ReferenceData.module_name = module_name;
        $scope.ReferenceData.module_code = module_code;
        $scope.ReferenceData.sub_type = sub_type;
        $scope.ReferenceData.tab_id = tab_id;
        $scope.ReferenceData.module_type = module_type;
        $scope.ReferenceData.token = $rootScope.token;
        // console.log(counter);
        $scope.showLoader = true;

        // console.log(tab_id);

        $scope.getContacts(module_type, account_id);
        //counter +1;
    });


    //console.log($scope.ReferenceData);
    $scope.$on('Attachments', function (events, args) {
        //console.log(args);
        $scope.attachment = args;
        //now we've registered!

        //console.log($scope.attachment);
    })
    $scope.removeAttachment = function (attachment) {
        //console.log(attachment);
        var index = $scope.attachment.indexOf(attachment);
        $scope.attachment.splice(index, 1);
        //console.log($scope.attachment);
        //unlink();

    }

    $scope.saveMailInternal = function (tabid, EmailArray) {

        //console.log(EmailArray);
        if (EmailArray.to == undefined) {
            toaster.pop('error', 'Send To', $scope.$root.getErrorMessageByCode(230, ['Email']));
            return;
        }
        if (EmailArray.from == undefined) {
            toaster.pop('error', 'From', $scope.$root.getErrorMessageByCode(230, ['Email']));
            return;
        }
        if (EmailArray.subject == undefined) {
            toaster.pop('error', 'Subject', $scope.$root.getErrorMessageByCode(230, ['Subject']));
            return;
        }


        /*  var mailCCStr = [];
         var mailBCCStr = [];
         if(!EmailArray.cc == undefined)
         mailCCStr = EmailArray.cc; else  mailCCStr = [];
         if(!EmailArray.bcc == undefined)
         mailBCCStr = EmailArray.bcc; else  mailBCCStr = [];*/
        // return;


        var mailData = {
            refData: $scope.ReferenceData,
            from: EmailArray.from,
            to: EmailArray.to,
            subject: EmailArray.subject,
            cc: EmailArray.cc,
            bcc: EmailArray.bcc,
            body: EmailArray.message,
            files: $scope.attachment,
            isSave: EmailArray.isSave,
            token: $rootScope.token
        };

        var mailPath = $rootScope.com + 'mail/save_mail_internal';
        $http.post(mailPath, mailData).then(function (result) {

            if (result.data.ack == true) {
                toaster.pop('success', 'Mail', 'Mail Sent Successfully!');
                angular.element('#composeEmail').modal('hide');
            }
            else {
                toaster.pop('error', 'Mail', 'Mail Not Sent!');
            }
        });
    };


    // var vm = this;

    $scope.disabled = undefined;
    $scope.searchEnabled = undefined;

    $scope.setInputFocus = function () {
        $scope.$broadcast('UiSelectDemo1');
    };

    $scope.enable = function () {
        $scope.disabled = false;
    };

    $scope.disable = function () {
        $scope.disabled = true;
    };

    $scope.enableSearch = function () {
        $scope.searchEnabled = true;
    };

    $scope.disableSearch = function () {
        $scope.searchEnabled = false;
    };

    $scope.clear = function () {
        $scope.person.selected = undefined;

    };


    $scope.counter = 0;
    $scope.onSelectCallback = function (item, model) {
        $scope.counter++;
        $scope.eventResult = { item: item, model: model };
    };

    $scope.removed = function (item, model) {
        $scope.lastRemoved = {
            item: item,
            model: model
        };
    };

    $scope.tagTransform = function (newTag) {
        var item = {
            name: newTag,
            email: newTag.toLowerCase()
        };
        return item;
    };


    $scope.person = {};


    $scope.getContacts = function (module_type, id) {
        $scope.showLoader = true;
        var contactData = { id: id, token: $rootScope.token };

        if (module_type == 1)
            var contactPath = $rootScope.com + 'contact/get_crm_contacts';
        else if (module_type == 2)
            var contactPath = $rootScope.com + 'contact/get_srm_contacts';


        $http.post(contactPath, contactData).then(function (result) {
            $scope.person = result.data;

            //  console.log(result.data);
        });
        $timeout(function () {
            $scope.showLoader = false;
        }, 500);
    };

    // To run the demos with a preselected person object, uncomment the line below.
    //$scope.person.selected = $scope.person.selectedValue;


    // To run the demos with a preselected person object, uncomment the line below.
    //$scope.person.selected = $scope.person.selectedValue;


    $scope.addPerson = function (item, model) {
        if (item.hasOwnProperty('isTag')) {
            delete item.isTag;
            $scope.people.push(item);
        }
    }


}
