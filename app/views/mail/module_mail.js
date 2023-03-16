ModuleMailController.$inject = ["$scope", "$stateParams", "ngTableDataService", "$http", "$state", "$resource", "toaster", "$filter", "Calendar", "$window", "ngDialog", "$timeout", "ngTableParams", "$rootScope", "Upload", "$interval"];
myApp.controller('ModuleMailController', ModuleMailController);

function ModuleMailController($scope, $stateParams, ngDataService, $http, $state, $resource, toaster, $filter, Calendar, $window, ngDialog, $timeout, ngParams, $rootScope, Upload, $interval) {
    'use strict';


    var redirect = '';
    // $scope.call_event = function () {
    $scope.$on("mail_nested_module", function (event, row_id, module, module_id, module_name, module_code, sub_type) {

        $scope.row_id = row_id;//$stateParams.id;
        $scope.module = module;
        $scope.module_id = module_id;
        $scope.module_name = module_name;
        $scope.module_code = module_code;
        $scope.sub_type = sub_type;

        // if(sub_type==0){ $scope.getComments();	counter++;}

    });
    //};

    if ($scope.module_id == 29)   redirect = 'app.item';
    else if ($scope.module_id == 36)   redirect = 'app.hr_listing';
    else if ($scope.module_id == 105)   redirect = 'app.srm';
    else if ($scope.module_id == 54)   redirect = 'app.supplier';
    else if ($scope.module_id == 110)   redirect = 'app.srmorder';
    else if ($scope.module_id == 111)   redirect = 'app.srminvoice';
    else if ($scope.module_id == 112)   redirect = 'app.srm_order_return';
    else if ($scope.module_id == 113)   redirect = 'app.warehouse';
    else if ($scope.module_id == 114)   redirect = 'app.services';
    else    redirect = 'app.crm'; //if($scope.module_id==19)


//console.log($scope.module_id+'call'+ $scope.module+'call'+$scope.module_name+'call'+$scope.module_code);
    // return;
    // $scope.formData.fileName=[];
    $scope.formData_images_data = [];

    $scope.uploadConShow_defult = true;
//	 console.log($scope.uploadConShow_defult);

    $scope.showcomentbeforedoc = false;

// --------------------   Mail --------------------

    $scope.get_mail_module_id = $scope.row_id;


    $scope.userinfo = "";
    $scope.numbers = {};
    $scope.contacts = {};
    $scope.showLoader = false;
    $scope.defaultmail = true;

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


    $scope.account_type_list = {};
    $scope.account_type = 0;

   // var get_mail_module_name = $scope.rec.name;
    var get_mail_account_id = 0;  //$stateParams.id
    $scope.mail = {};

    /*$scope.show_mail = function () {
        $scope.show_check_readonly_mail = true;
        $scope.display_mail_data = false;
    }*/
    $scope.compose_mail = function () {
        console.log("here");
        $scope.show_check_readonly_mail = true;
        $scope.display_mail_data = false;
        angular.element('#compose_mail_popup').modal({show: true});
        return;
    }

    $scope.getUserInfo = function () {

        var userinfoPath = $scope.$root.com + "mail/configurations";//userinfo";
        $http.post(userinfoPath, {'token': $scope.$root.token}).then(function (result) {
            if (result.data.alias != "") {
                $scope.account_type_list = result.data.configs;


                //	$scope.account_type = $scope.account_type_list[0];
            }
            else    toaster.pop('error', 'info', 'Record Account Found. ');
        });
    }

    $scope.getSmartContacts = function () {
        //  $scope.showLoader = true;
        var contactPath = $scope.$root.com + 'contact/smartcontacts';
        $http.post(contactPath, {'token': $scope.$root.token}).then(function (result) {
            $scope.contacts = result.data;
        });

        /* $timeout(function(){
         $scope.showLoader = false;
         },1000);*/
    };

    $scope.folder = {};
    $scope.stateType = "";
    $scope.folder_id = function (account_type) {
        get_mail_account_id = account_type.id;
        //get_mail_account_id =this.account_type.id;
        //get_mail_account_id = $scope.account_type.id;
        // get_mail_account_id	= $scope.account_type != undefined ? $scope.account_type.id : 0;

        if (get_mail_account_id != undefined || get_mail_account_id > 0) {
            $scope.folder = {};
            var folderData = {
                id: get_mail_account_id,
                token: $scope.$root.token,
                module_id: $scope.get_mail_module_id,
                module_code: $scope.module_code,
                folder: "INBOX"
            };

            //var folderPath = $scope.$root.com + 'mail/folder-listing';
            var folderPath = $scope.$root.com + 'mail/new_unread_mail';
            //  $scope.set_interval();return;

            $http.post(folderPath, folderData).then(function (result) {

                console.log(result);
                if (result.data.length > 0) {
                    $scope.folder = result.data;
                    $scope.display_mail_data = true;
                    $scope.getSmartContacts();

                    /*	$.each(result.data,function(catIndex, catObj){
                     console.log(catObj.body);
                     if(get_mail_module_id.search(catObj.body) && get_mail_module_code.search(catObj.body)){
                     $scope.folder.push(catObj);
                     }
                     });	*/
                } else  toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(400));


            });
        }
    }


    $scope.set_interval = function () {
        var clientConData = {
            id: get_mail_account_id,
            token: $scope.$root.token,
            module_id: $scope.get_mail_module_id,
            module_code: $scope.module_code
        };
        var folderPath = $scope.$root.com + 'mail/new_unread_mail';
        $http.post(folderPath, clientConData).then(function (result) {
            console.log(result);
            if (result.data.length > 0) {
                $scope.folder = result.data;
                $scope.display_mail_data = true;
                $scope.getSmartContacts();
            } else  toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(400));

        });
    }

    /* $interval(function () {
     var clientConData = {id: get_mail_account_id,token: $scope.$root.token,module_id: $scope.get_mail_module_id ,module_code: 	$scope.module_code};
     var clientConPath = $scope.$root.com + 'mail/new_unread_mail';
     $http.post(clientConPath, clientConData).then(function (result) {
     console.log(result);
     if(  result.data.length>0)  {
     $scope.folder = result.data;
     $scope.display_mail_data=true;
     $scope.getSmartContacts();
     }  else  toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(400));

     });
     }, 600000);*/


    $scope.folderMessage = "";
    $scope.attachments = {};
    $scope.header = {};
    $scope.messageno = "";
    $scope.printMessage = "";

    $scope.getFolderMessage = function (messageNumber, showread) {

        $scope.defaultmail = true;
        $scope.readmail = true;
        //  $scope.showLoader = true;

        $scope.messageno = messageNumber;
        var folderMessageData = {
            id: get_mail_account_id,
            folder: "INBOX",
            messageNumber: messageNumber,
            token: $scope.$root.token
        };
        var folderMessagePath = $scope.$root.com + 'mail/foldermessage';
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
        /* $timeout(function(){
         $scope.showLoader = false;
         },1000);*/
    };

    $scope.checkCCAndBCC = function () {

        if ($scope.mail.mailCC[0] == "" || $scope.mail.mailCC[0] == " ") {
            $scope.showCC = true;
        }
        if ($scope.mail.mailBCC[0] == "" || $scope.mail.mailBCC[0] == " ") {
            $scope.showBCC = true;
        }
    }

    $scope.showDivCC = function () {
        $scope.showCC = false;
    }

    $scope.showDivBCC = function () {
        $scope.showBCC = false;
    }

    $scope.composeMail = function () {


        //  $scope.showLoader = true;
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

        var clientConData = {id: get_mail_account_id, token: $scope.$root.token};
        var clientConPath = $scope.$root.com + 'mail/signature';
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
        /* $timeout(function(){
         $scope.showLoader = false;
         }, 500);*/

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
            id: get_mail_account_id,
            folder: "INBOX",
            messageNumber: $scope.messageno,
            token: $scope.$root.token
        };
        var folderMessagePath = $scope.$root.com + 'mail/foldermessage';
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
            }
            else if (subject == 'Rep All: ') {
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
            }
            else {
                htmlbody = "<br/><br/>On " + result.data.header.date + ", <" + result.data.header.sender[0].sender + "> wrote:<br/><div style='border-left: 1px solid #666;'>" + result.data.header.date + result.data.html + "</div>";
            }

            var iframeid = angular.element('#editorpanel iframe').attr('id');
            angular.element("#" + iframeid).contents().find("#tinymce").html(htmlbody);

        });
    };

    $scope.moveMessage = function (folder) {
        if ($stateParams.type == folder && folder == 'INBOX.Trash') {
            $scope.deleteMessage();
        } else {
            var folderData = {
                id: get_mail_account_id, type: "INBOX", folder: folder, messageno: $scope.messageno
                , token: $scope.$root.token
            };
            var folderPath = $scope.$root.com + 'mail/movemessage';

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

    $scope.printMessage = function () {
        var header = angular.element('#mailheader').html();
        var mailhtml = angular.element('#iframe1').contents().find('html').html();
        var mywindow = window.open('', 'Print Mail', 'height=400,width=600');
        mywindow.document.write(header);
        mywindow.document.write(mailhtml);
        mywindow.print();
        mywindow.close();
    };

    $scope.newmail = false;
    $scope.readmail = false;
    $scope.showLoader = false;
    //kamran@navsonsoftware.com
    $scope.sendMail = function (attachments) {


        $scope.showLoader = true;

        var iframeid = angular.element('#editorpanel iframe').attr('id');
        var mailBody = angular.element("#" + iframeid).contents().find("#tinymce").html();
        //+ "<p><input type='hidden' value='$scope.get_mail_module_id' >"+ "<input type='hidden' value='$scope.module_code'></p>";
        var mailData = {};

        if ($scope.reply || $scope.replyall) {
            mailData = {
                id: get_mail_account_id,
                type: 'reply',
                to: $scope.mail.mailTo,
                subject: $scope.mail.mailSubject,
                cc: $scope.mail.mailCC[0],
                bcc: $scope.mail.mailBCC[0],
                body: mailBody,
                files: attachments,
                token: $scope.$root.token,
                'module_id': $scope.get_mail_module_id,
                'module_code': $scope.module_code
            };
        }
        else {
            mailData = {
                id: get_mail_account_id,
                type: 'noreply',
                to: angular.element('#select-to').val(),
                subject: $scope.mail.mailSubject,
                cc: angular.element('#select-cc').val(),
                bcc: angular.element('#select-bcc').val(),
                body: mailBody,
                files: attachments,
                token: $scope.$root.token,
                'module_id': $scope.get_mail_module_id,
                'module_code': $scope.module_code
            };

        }
        var mailPath = $scope.$root.com + 'mail/sendmail';

        $http.post(mailPath, mailData).then(function (result) {
            console.log(result.data);

            if (result.data.ack == 1) {
                toaster.pop('success', 'Send Mail', 'Email has successfully been sent.');
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


                $timeout(function () {
                    $scope.showLoader = false;
                    $state.reload();
                    var clientConData = {token: $scope.$root.token};
                    var clientConPath = $scope.$root.com + 'mail/new';
                    $http.post(clientConPath, clientConData).then(function (result) {
                        $scope.numbers = result.data;
                    });
                }, 1000);
            }
            else {
                toaster.pop('error', 'Send Mail', 'Email not Sent.');
                $timeout(function () {
                    $scope.showLoader = false;
                }, 500);
            }
        });

        //    $timeout(function(){
        $scope.showLoader = false;
        //  },1000);
    }

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
            id: get_mail_account_id,
            to: $scope.mail.mailTo,
            subject: $scope.mail.mailSubject,
            cc: mailCCStr,
            bcc: mailBCCStr,
            body: mailBody,
            files: attachments,
            token: $scope.$root.token
        };
        var mailPath = $scope.$root.com + 'mail/savemail';
        $http.post(mailPath, mailData).then(function (result) {
            $scope.mail.mailTo = "";
            $scope.mail.mailCC[0] = "";
            $scope.mail.mailBCC[0] = "";
            $scope.mail.mailSubject = "";
            $scope.mail.mailBody = "";
            var iframeid = angular.element('#editorpanel iframe').attr('id');
            var mailBody = angular.element("#" + iframeid).contents().find("#tinymce").html('');
        });
    }


    $scope.addMailCC = function () {
        $scope.mail.mailCC.push('');
    }

    $scope.removeMailCC = function (index) {
        $scope.mail.mailCC.splice(index, 1);
    }

    $scope.addMailBCC = function () {
        $scope.mail.mailBCC.push('');
    }

    $scope.removeMailBCC = function (index) {
        $scope.mail.mailBCC.splice(index, 1);
    }

    $scope.messageIndex = "";
    $scope.setMessageIndex = function (index) {
        $scope.messageIndex = index;
    }


    $scope.getSignature = function () {
        var clientConData = {id: $stateParams.id, token: $scope.$root.token};
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
        var clientConData = {token: $scope.$root.token};
        var clientConPath = $scope.$root.com + 'mail/isconfigurationexist';
        $http.post(clientConPath, clientConData).then(function (result) {

            if (result.data.total == 0) {
                angular.element('#modaladdmailbtn').click();
            } else if (result.data.total > 0) {
                var imapData = {token: $scope.$root.token};
                var imapPath = $scope.$root.com + 'mail/isimapvalid';
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
                        var clientConData = {token: $scope.$root.token};
                        var clientConPath = $scope.$root.com + 'mail/clientconfig';
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
        var imapData = {token: $scope.$root.token};
        var imapPath = $scope.$root.com + 'mail/isimapvalid';
        $http.post(imapPath, imapData).then(function (result) {
            $scope.imap.valid = result.data.valid;
        });
    };


    $scope.mailsFoldersCount = {};
    $scope.getMailsFolders = function () {
        var clientConData = {token: $scope.$root.token};
        var clientConPath = $scope.$root.com + 'mail/new';
        $http.post(clientConPath, clientConData).then(function (result) {
            $scope.numbers = result.data;
        });
        var mailData = {token: $scope.$root.token};
        var mailPath = $scope.$root.com + 'mail/mailsfolders';
        $http.post(mailPath, mailData).then(function (result) {

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
    }
    $scope.mailFolders = {};

    $scope.getMailFolders = function () {
        $scope.showLoader = true;
        var mailData = {id: $stateParams.id, token: $scope.$root.token};
        var mailPath = $scope.$root.com + 'mail/mailfolders';
        $http.post(mailPath, mailData).then(function (result) {

            $scope.mailFolders = result.data.folders;

        });
        $timeout(function () {
            $scope.showLoader = false;
        }, 500);
    }

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
    }

    $scope.hasUnreadMails = function (id, folder) {
        console.log("id::" + id + ", Folder::" + folder);
        var imapData = {id: id, folder: folder, token: $scope.$root.token};
        var imapPath = $scope.$root.com + 'mail/unread';
    };

    $scope.getSearchMessage = function (messageNumber, showread, folder) {

        $scope.readmail = true;
        $scope.messageno = messageNumber;
        var searchMessageData = {
            id: $stateParams.id,
            folder: folder,
            messageNumber: messageNumber,
            token: $scope.$root.token
        };
        var searchMessagePath = $scope.$root.com + 'mail/foldermessage';
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
            token: $scope.$root.token
        };
        var folderPath = $scope.$root.com + 'mail/renamefolder';
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
        var folderData = {id: $scope.userfolder.id, folder: $scope.userfolder.oldName, token: $scope.$root.token};
        var folderPath = $scope.$root.com + 'mail/deletefolder';

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
            token: $scope.$root.token
        };
        var folderPath = $scope.$root.com + 'mail/deletemessage';

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
                token: $scope.$root.token
            };
            var folderPath = $scope.$root.com + 'mail/movemessage';

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
            token: $scope.$root.token
        };
        var flagPath = $scope.$root.com + 'mail/setflags';
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
            token: $scope.$root.token
        };
        var flagPath = $scope.$root.com + 'mail/unsetflags';
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
            token: $scope.$root.token
        };
        var attachmentPath = $scope.$root.com + 'mail/downloadattachment';
        $http.post(attachmentPath, attachmentData).then(function (result) {
            $scope.url = result.data.filename;//(window.URL || window.webkitURL).createObjectURL(blob);
            $scope.downloadpath = $scope.$root.basePath + result.data.path;
            $window.open($scope.downloadpath + $scope.url, '_blank');
        });
    };

    $scope.redirectToDashboard = function () {
        $state.go('app.dashboard');
    };

    $scope.inbox = {};
    $scope.inbox = function () {

        var inboxData = {token: $scope.$root.token};
        var inboxPath = $scope.$root.com + 'mail/inbox';
        $http.post(inboxPath, inboxData).then(function (result) {
            if (result.data.isconnected == 0) {
                $state.go("app.mail");
            }
            $scope.inbox = result.data;
        });
    };

    $scope.inboxMessage = {};
    $scope.getInboxMessage = function (messageNumber) {
        var inboxMessageData = {messageNumber: messageNumber, token: $scope.$root.token};
        var inboxMessagePath = $scope.$root.com + 'mail/inboxmessage';
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
            token: $scope.$root.token
        };
        var clientPath = $scope.$root.com + 'mail/addclientconfiguration';
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

        var searchData = {id: $stateParams.id, search: $stateParams.keyword, token: $scope.$root.token};
        var searchPath = $scope.$root.com + 'mail/search';
        $http.post(searchPath, searchData).then(function (result) {
            $scope.searchResults = result.data;
        });
        $timeout(function () {
            $scope.showLoader = false;
        }, 500);
    };


    $scope.$root.counter++;
    if ($scope.$root.counter == 1) {
        if ($stateParams.file != undefined && $stateParams.file != '') {
            $timeout(function () {
                angular.element("#newmailbtn").click();
                $scope.$root.$broadcast('attachInvoice', $stateParams.file, $stateParams.id);
            }, 5000);
        }
    }


}