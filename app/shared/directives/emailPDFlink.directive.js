myApp.directive("emailPDFlink", ['toaster', "$rootScope", "$http",  function (toaster, $rootScope, $http) {
    return {
        restrict: 'E',
        scope: {
            pageName: "@",
            dataObj: "="
        },
        templateUrl: "app/shared/directives/emailPDFlink.directive.html",
        link: function (scope, elem, attrs) {

            console.log(scope);
            console.log(scope.pageName);

            scope.fileAuthentication = fileAuthentication;
            scope.multipleTo = {
                records: []
            };
            scope.multipleCC = {
                records: []
            };

            /* try {
                scope.internalToArray = JSON.parse(JSON.stringify(scope.toArray));
            } catch (error) {
                
            }

            if (scope.internalToArray == undefined){
                scope.internalToArray = [];
            }
            else if (scope.internalToArray) {
                    angular.forEach(scope.internalToArray, function (obj) {
                        if (obj.username == scope.to) {
                            obj.type = "Default";
                            if (!(scope.multipleTo.records.filter(function(r){
                                return r.username == obj.username;
                            }).length)){
                                scope.multipleTo.records.push(obj);
                            }
                        }
                        else if (scope.type == undefined) {
                            obj.type = scope.recordAgainst;
                        }
                    })
                var uniq = {};
                scope.internalToArray = scope.internalToArray.filter(obj => !uniq[obj.username] && (uniq[obj.username] = true));

                }
            scope.bringEmployeeEmailsAddresses = function () {
                var postData = {
                    token: $rootScope.token
                }
                var bringEmployeeEmailsAPI = $rootScope.setup + "general/bringEmployeeEmailsAddresses";
                $http
                    .post(bringEmployeeEmailsAPI, postData)
                    .then(function (res) {
                        scope.showLoader = false;
                        
                        if (res.data.ack == true) {
                            scope.employeeEmailAddresses = res.data.response;
                            angular.forEach(res.data.response, function(obj,i){
                                scope.internalToArray.push({id: scope.internalToArray.length, username: obj.user_email, type: "Employee"});
                            })
                        }
                        scope.showLoader = false;
                        //else     toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(400));
                    }).catch(function (message) {
                        scope.showLoader = false;
                        // toaster.pop('error', 'info', 'Server is not Acknowledging', null, null, null, 1);
                        throw new Error(message.data);
                        console.log(message.data);
                    });
            }(); */

            
            serviceVariables.generatedPDF = false;
            var module_type, module_id, moduleName;

            if (scope.pageName == "SalesQuotes") {
                module_type = 1; // crm
                moduleName = "Sales";
                module_id = 1; // sales quote
            }
            else if (scope.pageName == "SalesOrders") {
                module_type = 1; // crm
                moduleName = "Sales";
                module_id = 2; // sales quote
            }
            else if (scope.pageName == "SalesInvoices") {
                module_type = 1; // crm
                moduleName = "Sales";
                module_id = 3; // sales quote
            }
            else if (scope.pageName == "PostedCreditNotes") {
                module_type = 1; // crm
                moduleName = "Credit Note";
                module_id = 4; // posted credit note
            }
            else if (scope.pageName == "DeliveryNotes") {
                module_type = 1; // crm
                moduleName = "Delivery Note";
                module_id = 5; // Delivery note
            }
            else if (scope.pageName == "WarehouseInstructions") {
                module_type = 1; // crm
                moduleName = "Warehouse Instruction";
                module_id = 6; // Delivery note
            }
            else if (scope.pageName == "DebitNotes") {
                module_type = 2; // srm
                moduleName = "Debit Note";
                module_id = 5; // debit note
            }
            else if (scope.pageName == "PurchaseOrders") {
                module_type = 2; // srm
                moduleName = "Purchases";
                module_id = 6; // purchase orders
            }
            else if (scope.pageName == "PostedDebitNotes") {
                module_type = 2; // srm
                moduleName = "Posted Debit Note";
                module_id = 7; // posted debit note
            }

            /* if (scope.htmlDestroy != ''){
                scope.destroyPdfModal = function () {
                    // angular.element(document.querySelector("#" + scope.htmlDestroy)).remove();
                    var node = document.getElementById("#" + scope.htmlDestroy);
                    while (node && node.hasChildNodes()) {
                        node.removeChild(node.firstChild);
                    }
                }
            }

            scope.tagTransform = function (tag) {
                var id = 99999 + scope.internalToArray.length;
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (re.test(tag)) {
                    return { id: id, username: tag, type: "New" };
                }
                else {
                    return null;
                }
            }
            scope.addConfirmation = function () {
                var deferred = $q.defer();
                var postData = {};
                switch (scope.pageName) {
                    case "DebitNote": postData.action = 2; break;
                    case "SalesOrders": postData.action = 1; break;
                    default: postData.action = 0; break;
                }
                postData.action_on = scope.dataObj.id;
                postData.secret = scope.makeid();
                postData.token = $rootScope.token;


                var confirmationAPI = $rootScope.setup + "general/addConfirmation";

                $http
                    .post(confirmationAPI, postData)
                    .then(function (res) {
                        if (res.data.ack == true) {
                            res.data.secret = postData.secret;
                            deferred.resolve(res.data);
                        }
                        else {
                            deferred.reject(res.data);
                        }

                    });




                // We return a promise
                return deferred.promise;
            }

            scope.openModal = function (modalId) {
                scope.dataObj.generatedPDFPath = '';

                emailConfig.getEmailConfig(scope.pageName).then(function (resp) {
                    scope.config = resp;

                    scope.fromEmails = [];
                    //scope.config.senderEmail = {id:0,username: scope.config.senderEmail};
                    scope.fromEmails.push(scope.config.senderEmail);

                    angular.forEach(scope.fromEmails, function (obj, index) {
                        // scope.fromEmails.push({ id: obj.id, username: obj.username });
                        if (obj.username == scope.config.defaultEmail) {
                            scope.config.senderEmail = { id: obj.id, username: obj.username };
                        }
                    });

                    scope.dataObj.current_user_id = scope.$root.userId;
                    scope.dataObj.current_company_id = scope.$root.defaultCompany;
                    scope.dataObj.current_company_name = scope.$root.company_name.replace(/ /g, '');


                    scope.config.templateSubject = scope.html2Text(scope.config.templateSubject);

                    //scope.configText = JSON.stringify(scope.config);
                    for (var key in scope.config.availablePlaceholders) {
                        var regex = new RegExp(key, 'g')
                        // var test = scope.configText.match(regex);
                        // if (test) {
                        scope.config.templateSubject = scope.config.templateSubject.replace(regex, scope.config.availablePlaceholders[key]);
                        scope.config.templateBody = scope.config.templateBody.replace(regex, scope.config.availablePlaceholders[key]);
                        scope.config.fileName = scope.config.fileName.replace(regex, scope.config.availablePlaceholders[key]);
                        // }
                    }
                    //scope.config = JSON.parse(scope.configText);


                    scope.placeholders = [];

                    for (var key in scope.config) {
                        if (typeof scope.config[key] == "string") {
                            var arr = [];
                            var regex = new RegExp("\\[\\[(.*?)\\]\\]", 'g')
                            var test = scope.config[key].match(regex);
                            if (test != null && test != undefined && test.length) {
                                angular.forEach(test, function (obj) {
                                    obj = obj.split("[[")[1].split("]]")[0];
                                    scope.placeholders.push(obj);
                                })
                                scope.placeholders = scope.placeholders.filter(function (item, pos) {
                                    return scope.placeholders.indexOf(item) == pos;
                                })
                            }

                        }
                    }
                    if (scope.placeholders.length) {
                        angular.forEach(scope.placeholders, function (prop) {
                            if (prop != "confirmation_link") {
                                var regex = new RegExp("\\[\\[" + prop + "\\]\\]", 'g');
                                // for (var key in scope.config) {
                                scope.config.templateBody = scope.config.templateBody.replace(regex, scope.dataObj[prop]);
                                scope.config.templateSubject = scope.config.templateSubject.replace(regex, scope.dataObj[prop]);
                                scope.config.fileName = scope.config.fileName.replace(regex, scope.dataObj[prop]);
                            }
                            // }
                        })
                    }
                });
                //if (!scope.dataObj.generatedPDFPath)
                    scope.pdfGenerator();
                angular.element('#confirmModal_' + modalId).modal();
                scope.modalOpen = true;
            }

            scope.makeid = function () {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (var i = 0; i < 10; i++)
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                return Date.now() + "_" + text;
            }

            scope.html2Text = function (html) {
                var tmp = document.createElement("DIV");
                tmp.innerHTML = html;
                return tmp.textContent || tmp.innerText || "";
            }

            scope.$watch("pdfReady", function () {
                if (scope.dataObj.generatedPDFPath == undefined || scope.dataObj.generatedPDFPath == "")
                    scope.dataObj.generatedPDFPath = scope.pdfReady;
            })

            scope.showConfirmModal = function () {

            }

            scope.emailSummerNoteConfig = {
                fontNames: ['Arial', 'Arial Black', 'Courier New'],
                toolbar: [
                    ['style', ['bold', 'italic', 'underline', 'clear']],
                    ['fontsize', ['fontsize']],
                    ['fontname', ['fontname']],
                    ['color', ['color']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['table', ['table']]
                ]
            }

            scope.emailConfigVars = emailConfig.globalVars;

            scope.sendEmail = function () {
                scope.showLoader = true;
                if (scope.multipleTo.records) {
                    var tempTo = [];
                    angular.forEach(scope.multipleTo.records, function (obj) {
                        tempTo.push(obj.username);
                    })
                    scope.to = tempTo;
                }

                if (scope.multipleCC.records) {
                    var tempCC = [];
                    angular.forEach(scope.multipleCC.records, function (obj) {
                        tempCC.push(obj.username);
                    })
                    scope.cc = tempCC;
                }

                if (scope.to == "") {
                    toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(230, ['To']));
                    scope.showLoader = false;
                    return;
                }

                emailConfig.sendEmail(scope.config.senderEmail, scope.to, "", scope.cc, "", scope.config.templateSubject, scope.config.templateBody, scope.config.fileName ? { fileName: scope.config.fileName, fileAlias: scope.dataObj.generatedPDFPath.split('/').pop().split('.')[1] + '.pdf' } : "", scope.parentRecordId ? scope.parentRecordId : "", scope.parentRecordName ? scope.parentRecordName : "", module_type, module_id, moduleName).then(function (resp) {
                    scope.showLoader = false;
                    if (resp.success) {
                        toaster.pop('success', 'Success', 'Email Sent Successfully');
                        angular.element('#confirmModal_' + scope.pageName).modal('hide');
                    }
                    else {
                        toaster.pop('error', 'Info', resp.message);
                    }
                });

                //scope.modalOpen = false;

                // }, function (res) {
                // });

            }

            scope.updateDefaultEmail = function () {
                emailConfig.updateDefaultEmail(scope.pageName, scope.config.senderEmail.username);
                scope.config.defaultEmail = scope.config.senderEmail.username;
            }

            scope.action_on = scope.dataObj.id;

            if (scope.parentRecordName) {
                scope.modalTitle = scope.parentRecordName;
            } */

        }
    }
}]);