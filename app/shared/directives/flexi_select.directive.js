myApp.directive("flexiSelect", ["toaster", "$filter", "$rootScope", function (toaster, $filter, $rootScope) {
    return {
        restrict: 'E',
        scope: {
            flexiSelectTitle: "=",              // Title of the Popup
            flexiSelectModalId: "=",            // ID for the Modal, we can't hardcode it; hardcoding will force us to use only one Modal on one page
            flexiSelectFilters: "=",            // user will be shown records to select after this filter is applied on the record set
            flexiSelectMatchParam: "=",
            flexiSelectData: "=",               // Contains the original data array
            flexiSelectOutput: "=",             // Contains the output of the flexi Selection
            flexiSelectOutputCompArr: "=",      // Contains the output of the flexi Selection
            flexiSelectReadonly: "=",           // If true, will disable the modal and user will not be able to modify the selection
            flexiSelectStringReturn: "@",       // If Specific field out of the object array is required. By default, it'll return "id"
            flexiSelectModalWidth: "@",          // Modal Width. If null, default is 37%.
            flexiCallbackFunction: "&",         // function to call after a selection is done..
            flexiSelectShowCols: "=",           // array of column names to show..
            flexiPrimarySelect: "@",            // if present, it should be the property name which defines if primary or not
            flexiPrimaryValue: "=",             // this will be the output of the primary selected record
            flexiSelectHtmlTemplate:"@",        // optional template to view, it'd be HTML string
            flexiSelectDataTooltip: "@"         // if present, output will be tooltipped instead of title
        },
        replace: false,
        templateUrl: "app/shared/directives/flexi_select.directive.html",
        link: function (scope, elem, attrs) {
            // if (scope.flexiSelectOutput.constructor !== Array){
            //     scope.flexiSelectOutput = scope.flexiSelectOutput.split();
            // }

            // scope.flexiSelectData = $filter('filter')(scope.flexiSelectData, scope.flexiSelectFilters);
            // scope.flexiSelectParam = 'id';

            scope.flexiSelectParam = (scope.flexiSelectMatchParam != undefined) ? scope.flexiSelectMatchParam : 'id';

            scope.flexiSelectOutputArray = [];
            if (attrs.flexiRadio != undefined) {
                scope.flexiRadio = "true";
            }
            if (attrs.flexiSelectObjReturn != undefined) {
                scope.objReturn = "true";
            }
            scope.changePrimarySelect = function (id) {
                angular.forEach(scope.flexiSelectData, function (obj) {
                    obj.is_primary = false;
                })
                angular.forEach(scope.tempOutput, function (obj) {
                    obj.is_primary = false;
                })
                angular.forEach(scope.tempArr, function (obj) {
                    if (obj[scope.flexiSelectParam] == id) {
                        obj.is_primary = true;
                    }
                })
                angular.forEach(scope.tempOutput, function (obj) {
                    if (obj[scope.flexiSelectParam] == id) {
                        obj.is_primary = true;
                    }
                })
            }
            scope.$watch("flexiSelectOutput", function () {
                scope.flexiSelectOutputArray = [];
                if (scope.flexiSelectOutput == undefined) return;
                if (scope.flexiSelectOutput.constructor && scope.flexiSelectOutput.constructor === Object) {
                    scope.flexiSelectOutputArray.push(scope.flexiSelectOutput);
                }
                else {

                    angular.forEach(scope.flexiSelectData, function (obj, index) {
                        try {
                            angular.forEach(scope.flexiSelectOutput.split(','), function (obj2, index2) {
                                if (scope.flexiSelectStringReturn != undefined) {
                                    if (obj[scope.flexiSelectStringReturn] == obj2)
                                        scope.flexiSelectOutputArray.push(obj);
                                }
                                else {
                                    if (obj[scope.flexiSelectParam] == obj2)
                                        scope.flexiSelectOutputArray.push(obj);
                                }

                            });
                        }
                        catch (ex) {
                            //console.log(ex);
                        }

                    });
                }

            })

            scope.$watch("flexiSelectData", function () {
                scope.columnHeaders = [];
                if (scope.flexiSelectData != undefined) {
                    if (scope.flexiSelectShowCols != undefined && scope.flexiSelectShowCols.length) {
                        for (var i = 0; i < scope.flexiSelectShowCols.length; i++) {
                            scope.columnHeaders.push(scope.flexiSelectShowCols[i]);
                        }
                    }
                    else {
                        for (var k in scope.flexiSelectData[0]) {
                            if (typeof scope.flexiSelectData[0][k] !== 'function') {
                                if (k != "$$hashKey")
                                    scope.columnHeaders.push(k);
                            }
                        }
                    }
                }

            })




            scope.saveChanges = function () {
                if (scope.flexiPrimarySelect) {
                    console.log(scope.tempOutput);
                    var primaryFound = true;
                    if (scope.tempOutput.length) {
                        primaryFound = false;
                    }
                    angular.forEach(scope.tempOutput, function (obj) {
                        if (obj.is_primary == true) {
                            primaryFound = true;
                            scope.flexiPrimaryValue = obj[scope.flexiSelectParam];
                        }
                    })
                    if (!primaryFound) {
                        toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(241, ['Primary Employee']));
                        return true;
                    }


                }
                scope.flexiSelectOutputArray = angular.copy(scope.tempOutput);
                scope.flexiSelectOutput = [];
                // angular.forEach(scope.flexiSelectOutputArray, function (obj, index) {
                //     scope.flexiSelectOutput.push(obj[scope.flexiSelectParam]);
                // })
                if (scope.flexiSelectStringReturn != undefined) {
                    angular.forEach(scope.flexiSelectOutputArray, function (obj, index) {
                        scope.flexiSelectOutput.push(obj[scope.flexiSelectStringReturn]);
                    })
                }
                else if (scope.objReturn && scope.flexiRadio) {
                    angular.forEach(scope.flexiSelectOutputArray, function (obj, index) {
                        scope.flexiSelectOutput = obj;
                    });

                    if(scope.flexiSelectOutput && scope.flexiSelectOutput.product_code)
                        var tempTitle = scope.flexiSelectOutput.product_code

                    if (scope.flexiCallbackFunction != "undefined") {
                        scope.flexiCallbackFunction({ param: scope.flexiSelectOutput });
                        scope.flexiSelectOutput = scope.flexiSelectOutput[scope.flexiSelectParam];
                    }
                }
                else {
                    angular.forEach(scope.flexiSelectOutputArray, function (obj, index) {
                        scope.flexiSelectOutput.push(obj[scope.flexiSelectParam]);
                        // scope.flexiSelectOutputCompArr.push(obj);
                        scope.flexiSelectOutputCompArr =  obj;
                    })
                }
                try {
                    // console.log(tempTitle);
                    scope.flexiSelectTitle = 'Link To '+tempTitle;
                    scope.flexiSelectOutput = scope.flexiSelectOutput.join(",");
                }
                catch (ex) {
                    //console.log(ex);
                }
                
                angular.element('#' + scope.flexiSelectModalId).modal("hide");
                scope.tempOutput.length = 0;
                //scope.flexiSelectOutputArray.length = 0;

            }
            scope.revertChanges = function () {
                scope.tempOutput = angular.copy(scope.flexiSelectOutputArray);
                angular.element('#' + scope.flexiSelectModalId).modal("hide");
            }
            scope.handleKeyPress = function( ev ){
                if (ev.key == " ") 
                    scope.showModal();   
            }
            scope.showModal = function () {
                // scope.flexiSelectData = $filter('filter')(scope.flexiSelectData, scope.flexiSelectFilters);
                scope.tempArr = angular.copy(scope.flexiSelectData);
                scope.tempArr = $filter('filter')(scope.tempArr, scope.flexiSelectFilters);
                if (scope.tempArr == undefined || scope.tempArr.length == 0 || (scope.tempArr.length == 1 && scope.tempArr[0] == "")) {
                    toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(635));
                    return;
                }
                scope.tempOutput = angular.copy(scope.flexiSelectOutputArray);
                angular.element('#' + scope.flexiSelectModalId).modal({ show: true });
            }

            scope.sortArr = function(arr, param){
                return arr.sort(function (a, b) { return a[param] - b[param]; });
            }

            scope.searchKeyword = {};
            scope.searchKeyword.search = "";

            scope.isSubSetOfParent = function(child, parent){
                var chk = 0;
                angular.forEach(child, function(obj){
                    angular.forEach(parent, function(obj2){
                        if (chk != child.length)
                            if (obj[scope.flexiSelectParam] == obj2[scope.flexiSelectParam]){
                                chk++;
                            }
                    });
                });
                return (chk == child.length ? true: false);
            }
            

            scope.checkIfAllChecked = function(){
                // if filter, get filtered results and if all are in tempoutput, mark checked
                if (scope.searchKeyword && scope.searchKeyword.search){

                scope.filteredData = $filter('filter')(scope.flexiSelectData,scope.searchKeyword.search);
                    if (scope.filteredData.length == 0){
                        return false;
                    }
                
                    if (JSON.stringify(scope.sortArr(scope.filteredData, "id")) === JSON.stringify(scope.sortArr(scope.tempOutput, "id")) || scope.isSubSetOfParent(scope.filteredData, scope.tempOutput)){
                        return true;
                    }
                }
                else if(scope.tempOutput && (scope.flexiSelectData.length == scope.tempOutput.length)){
                    return true;
                }

                return false;

            }
            scope.checkToggle = function (elem) {

                if (!elem.currentTarget.checked){
                    scope.tempOutput.length = 0;
                    return false;
                }
                else{
                    if (scope.searchKeyword && scope.searchKeyword.search) {
                        scope.filteredData = $filter('filter')(scope.flexiSelectData, scope.searchKeyword.search);
                        angular.forEach(scope.flexiSelectData, function (obj) {
                            angular.forEach(scope.filteredData, function (obj2) {

                                if (obj[scope.flexiSelectParam] == obj2[scope.flexiSelectParam]) {
                                    scope.tempOutput.push(obj);
                                }

                            });
                        })
                    }
                    else{
                        scope.tempOutput = angular.copy(scope.flexiSelectData);
                    }

                }
                

                

                
                /* console.table(filteredData);
                if (scope.flexiSelectData.length == scope.tempOutput.length) {
                    scope.tempOutput.length = 0;
                }
                else {
                    scope.tempOutput = angular.copy(scope.flexiSelectData);
                } */
            }
            scope.checkAll = function () {
                scope.tempOutput = angular.copy(scope.flexiSelectData);
            }
            scope.clearAll = function () {
                scope.tempOutput.length = 0;
            }
            scope.checkChecked = function (e) {
                var matchFound = false;
                if (scope.tempOutput !== undefined)
                    for (var i = 0; i < scope.tempOutput.length; i++) {
                        if (scope.tempOutput[i][scope.flexiSelectParam] == e) {
                            matchFound = true;
                            break;
                        }
                    }
                return matchFound;
            }
            scope.updateSelection = function (el, status) {
                if (scope.flexiRadio == "true") {
                    if (scope.tempOutput.length == 0) {
                        for (var j = 0; j < scope.flexiSelectData.length; j++) {
                            if (scope.flexiSelectData[j][scope.flexiSelectParam] == el) {
                                scope.tempOutput.push(scope.flexiSelectData[j]);
                            }
                        }
                    }
                    else {

                        // for (var i = 0; i < scope.tempOutput.length; i++) {
                        //     if (scope.tempOutput[i][scope.flexiSelectParam] != el) {
                        //         scope.tempOutput.splice(i, 1);
                        //     }
                        // }
                        scope.tempOutput.length = 0;
                        for (var j = 0; j < scope.flexiSelectData.length; j++) {
                            if (scope.flexiSelectData[j][scope.flexiSelectParam] == el) {
                                scope.tempOutput.push(scope.flexiSelectData[j]);
                            }
                        }
                    }

                }
                else {
                    if (status == false) {
                        for (var i = 0; i < scope.flexiSelectData.length; i++) {
                            if (scope.flexiSelectData[i][scope.flexiSelectParam] == el) {
                                scope.tempOutput.push(scope.flexiSelectData[i]);
                            }
                        }
                    }
                    if (status == true) {
                        for (var i = 0; i < scope.tempOutput.length; i++) {
                            if (scope.tempOutput[i][scope.flexiSelectParam] == el) {
                                scope.tempOutput.splice(i, 1);
                            }
                        }
                    }
                }
            }
        }
    }
}])