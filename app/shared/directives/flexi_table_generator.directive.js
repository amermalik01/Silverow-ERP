<<<<<<< HEAD
myApp.directive("generateTable", ['$http', '$state', 'toaster', '$rootScope', 'flexiConfig', '$filter', '$timeout', function ($http, $state, toaster, $rootScope, flexiConfig, $filter, $timeout) {
=======
myApp.directive("generateTable", ['$http', '$state', 'toaster', '$rootScope', 'flexiConfig', '$filter', '$timeout', function($http, $state, toaster, $rootScope, flexiConfig, $filter, $timeout) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    return {

        restrict: 'A',

        scope: {

            data: "=",

            tableName: "@",

            filterFunction: "&",

            filterObject: "=",

            rowClick: "&",

            checkedRecords: "=",

            bulkEmailFunction: "&",

            forgetFilters: "@",

            controllerInitiate: "@",

            reportModal: "@",

            selectedRecordPreview: "@",

            readOnly: "@"

        },

        replace: false,

        templateUrl: "app/shared/directives/flexi_table_generator.directive.html",

<<<<<<< HEAD
        link: function (scope, elem, attrib) {
=======
        link: function(scope, elem, attrib) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            // scope.checkedRecords = [];

            scope.user_type = $rootScope.user_type;

            scope.allowviewcsv_export = $rootScope.allowviewcsv_export;

            scope.selectedRecordPreview = scope.selectedRecordPreview ? scope.selectedRecordPreview : "id";

<<<<<<< HEAD
            scope.checkChecked = (key) =>{

                if (scope.checkedRecords == undefined){
=======
            scope.checkChecked = (key) => {

                if (scope.checkedRecords == undefined) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    return;

                }

                if (scope.checkedRecords.length == 0) return -1;

<<<<<<< HEAD
                var index = scope.checkedRecords.findIndex( s => s.key == key );
=======
                var index = scope.checkedRecords.findIndex(s => s.key == key);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                return index;

            }

<<<<<<< HEAD
            scope.toggleCheckRecord = (key,val,record) => {



                if(record.disabled != undefined && record.disabled == 1)
=======
            scope.toggleCheckRecord = (key, val, record) => {



                if (record.disabled != undefined && record.disabled == 1)
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    return;



<<<<<<< HEAD
                if (scope.checkChecked(key) > -1){

                    scope.checkedRecords.splice(scope.checkChecked(key), 1);

                }

                else{

                    scope.checkedRecords.push({key: key, value: val, record: record});
=======
                if (scope.checkChecked(key) > -1) {

                    scope.checkedRecords.splice(scope.checkChecked(key), 1);

                } else {

                    scope.checkedRecords.push({ key: key, value: val, record: record });
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                }

            }

            /* scope.calculateSum = function (header){

                if (!header.headerTotal){

                    return;

                }

                var sum = 0;

                angular.forEach(scope.data.response, function (value, key) {

                    if (key != "tbl_meta_data" && parseFloat(value[header.field_name])) {

                        sum += parseFloat(value[header.field_name]);

                    }

                });

                return sum.toFixed(2);

            } */

<<<<<<< HEAD
            scope.calculateSum = function (header){

                if (!header.headerTotal){
=======
            scope.calculateSum = function(header) {

                if (!header.headerTotal) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    return;

                }

                var sum = 0;

<<<<<<< HEAD
                if (parseFloat(scope.data.grand[header.field_name+'_grand'])) {

                    sum = parseFloat(scope.data.grand[header.field_name+'_grand']);

                 }
=======
                if (parseFloat(scope.data.grand[header.field_name + '_grand'])) {

                    sum = parseFloat(scope.data.grand[header.field_name + '_grand']);

                }
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                return sum.toFixed(2);

            }



<<<<<<< HEAD
            scope.verifyRangeFilters = function (ck_startDate, ck_end_date, div_id, type) {
=======
            scope.verifyRangeFilters = function(ck_startDate, ck_end_date, div_id, type) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                if (type == "date") {

                    from = $("#" + ck_startDate).val().split("/")[2] + "-" + $("#" + ck_startDate).val().split("/")[1] + "-" + $("#" + ck_startDate).val().split("/")[0];

                    to = $("#" + ck_end_date).val().split("/")[2] + "-" + $("#" + ck_end_date).val().split("/")[1] + "-" + $("#" + ck_end_date).val().split("/")[0];

                    if (from != null && to != null) {

                        var from1, to1, check1;

                        from1 = new Date(from.replace(/\s/g, ''));

                        to1 = new Date(to.replace(/\s/g, ''));

                        var fDate, lDate, cDate;

                        fDate = Date.parse(from1);

                        lDate = Date.parse(to1);



                    }

<<<<<<< HEAD
                }

                else if (type == "number" || "numberWithCommaRightAlign") {
=======
                } else if (type == "number" || "numberWithCommaRightAlign") {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    from = $("#" + ck_startDate).val();

                    to = $("#" + ck_end_date).val();

                    if (from && to) {

<<<<<<< HEAD
                        fDate = parseFloat(from); lDate = parseFloat(to);
=======
                        fDate = parseFloat(from);
                        lDate = parseFloat(to);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    }

                }

                if (fDate > lDate) {

<<<<<<< HEAD
                    $timeout(function(){
=======
                    $timeout(function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        toaster.pop('error', 'Error', div_id);



<<<<<<< HEAD
                    },0)
=======
                    }, 0)
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                }

            }

            scope.widths = [];

            scope.flexiSearch = {};

            scope.filterObject.orderArr = [];

            scope.orderElem = "";

            scope.data2 = {};

            scope.data2.response = [];



<<<<<<< HEAD
            scope.getPreviousTableConfig = function () {

                if (scope.forgetFilters){
=======
            scope.getPreviousTableConfig = function() {

                if (scope.forgetFilters) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    scope.filterObject.totalRecords = 50;

                    scope.filterObject.selectedPage = 1;

                    // filters should not be saved for this table - this is internal listing like activity..

                    return;

                }

                scope.filterObject.totalRecords = 50;

                if (flexiConfig.getConfig(scope.tableName).found) {

                    // saved filters against this table

                    scope.savedConfig = flexiConfig.getConfig(scope.tableName);

                    console.log(scope.savedConfig);

                    scope.showFilters = false;

                    if (scope.savedConfig.search != null) {

                        for (var k in scope.savedConfig.search) {

                            scope.filterObject[k] = scope.savedConfig.search[k];

                            if (scope.savedConfig.search[k].length || (scope.savedConfig.search[k].lowerLimit && scope.savedConfig.search[k].lowerLimit.length) || (scope.savedConfig.search[k].upperLimit && scope.savedConfig.search[k].upperLimit.length) || (scope.savedConfig.search[k].type == 'drop_down' && scope.savedConfig.search[k].value)) {

                                scope.showFilters = true;

                            }

                        }



                    }

<<<<<<< HEAD
                    

                    // if (scope.showFilters && scope.filtered != true)

                        scope.filterFunction(); // function needs to be executed even if nothing is saved or saved

                }

                else {

                    scope.filterObject.selectedPage = 1;                    
=======


                    // if (scope.showFilters && scope.filtered != true)

                    scope.filterFunction(); // function needs to be executed even if nothing is saved or saved

                } else {

                    scope.filterObject.selectedPage = 1;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    // no filter is saved for this table yet

                    var searchObj = {};

                    var match = false;

<<<<<<< HEAD
                    try{

                        angular.forEach(scope.data.response.tbl_meta_data.response.colMeta, function (obj) {
=======
                    try {

                        angular.forEach(scope.data.response.tbl_meta_data.response.colMeta, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                            if (obj.default_filter != undefined && obj.default_filter) {

                                scope.filterObject[obj.field_name] = obj.filter_value;

                                match = true;

                                scope.showFilters = true;

                                return false;

                            }

                        })



<<<<<<< HEAD
                    }

                    catch(ex){
=======
                    } catch (ex) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564



                    }

<<<<<<< HEAD
                    if (attrib.controllerInitiate == undefined || (attrib.controllerInitiate && attrib.controllerInitiate != "")){
=======
                    if (attrib.controllerInitiate == undefined || (attrib.controllerInitiate && attrib.controllerInitiate != "")) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        scope.filterFunction();

                    }

                }

            }



<<<<<<< HEAD
            scope.checkbulkEmailFunction = function () {



               if(scope.checkedRecords.length!=0){

                   scope.bulkEmailFunction();

               }else{

                toaster.pop('error', 'Info', "No Record Selected.");

               }

               
=======
            scope.checkbulkEmailFunction = function() {



                if (scope.checkedRecords.length != 0) {

                    scope.bulkEmailFunction();

                } else {

                    toaster.pop('error', 'Info', "No Record Selected.");

                }


>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            }



            scope.getPreviousTableConfig();



<<<<<<< HEAD
            scope.addToConfig = function (fromSearchClick, event) {
=======
            scope.addToConfig = function(fromSearchClick, event) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                if (fromSearchClick) {

                    event.target.blur();

                    scope.filterObject.selectedPage = 1;

                    // if (scope.checkedRecords && scope.checkedRecords.length) scope.checkedRecords.length = 0;

                }

                for (var key in scope.filterObject) {

<<<<<<< HEAD
                    if (scope.filterObject[key].type && scope.filterObject[key].type == 'drop_down' &&  !scope.filterObject[key].value){
=======
                    if (scope.filterObject[key].type && scope.filterObject[key].type == 'drop_down' && !scope.filterObject[key].value) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        delete scope.filterObject[key];

                    }

                }

                flexiConfig.addConfig(scope.tableName, scope.filterObject, $rootScope.item_paging.spage == undefined ? 1 : $rootScope.item_paging.spage);

                scope.filterFunction();

            }



<<<<<<< HEAD
            scope.copySettings = function () {
=======
            scope.copySettings = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                scope.settingsBackup = JSON.stringify(scope.data.response.tbl_meta_data.response);

            }



<<<<<<< HEAD
            scope.restoreSettings = function () {
=======
            scope.restoreSettings = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                scope.data.response.tbl_meta_data.response = JSON.parse(scope.settingsBackup);

            }





<<<<<<< HEAD
            scope.getOrderIcon = function (val) {
=======
            scope.getOrderIcon = function(val) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                if (scope.filterObject.orderArr == undefined) {

                    scope.filterObject.orderArr = [];

                }

                for (var i = 0; i < scope.filterObject.orderArr.length; i++) {

                    if (scope.filterObject.orderArr[i] == val) {

                        return "a";

<<<<<<< HEAD
                    }

                    else if (scope.filterObject.orderArr[i] == ("-" + val)) {
=======
                    } else if (scope.filterObject.orderArr[i] == ("-" + val)) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        return "d";

                    }

                }

            }



<<<<<<< HEAD
            scope.updateOrder = function (header) {

                if (header.field_name.indexOf("button") > -1){
=======
            scope.updateOrder = function(header) {

                if (header.field_name.indexOf("button") > -1) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    return;

                }

                val = header.field_name;

                var found = false;

                for (var i = 0; i < scope.filterObject.orderArr.length; i++) {

                    if (scope.filterObject.orderArr[i] == val) {

                        scope.filterObject.orderArr[i] = "-" + val;

                        found = true;

<<<<<<< HEAD
                    }

                    else if (scope.filterObject.orderArr[i] == ("-" + val)) {
=======
                    } else if (scope.filterObject.orderArr[i] == ("-" + val)) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        scope.filterObject.orderArr.splice(i, 1);

                        scope.isEmptyOrderObj();

                        found = true;

                    }

                }

                if (!found) {

                    scope.filterObject.orderArr = [];

                    scope.filterObject.orderArr.push(val);

                }

                scope.addToConfig();

                // scope.filterFunction();

            }



<<<<<<< HEAD
            scope.isEmptyOrderObj = function () {
=======
            scope.isEmptyOrderObj = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564



                if (scope.filterObject.orderArr && scope.filterObject.orderArr.length == 0) {

                    scope.orderElem = "-id";

                }

            }

            scope.clearCounter = 0;



<<<<<<< HEAD
            scope.clearFilterObject = function () {
=======
            scope.clearFilterObject = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                scope.clearCounter++;

                for (var key in scope.filterObject) {

                    scope.filterObject[key] = '';

                }

<<<<<<< HEAD
                

                if(scope.showFilters == false || scope.showFilters != true) 

                    scope.showFilters = true;

                else 
=======


                if (scope.showFilters == false || scope.showFilters != true)

                    scope.showFilters = true;

                else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    scope.showFilters = false;



                scope.savedConfig = {};

                flexiConfig.removeConfig(scope.tableName);

                // scope.filterFunction();

            }



            scope.containerWidth = elem.width();

<<<<<<< HEAD
            scope.editRecord = function (row, event) {
=======
            scope.editRecord = function(row, event) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564



                // if there are no records, then return without changing the state

                if (scope.data.total == 0)

                    return;



                // console.log("inside edit record", row);

                var stateName;

                var recId = row.id;

                if (attrib.rowClick != undefined) {

                    if (scope.tableName == "Rebates" || scope.tableName == "PriceOffer" || scope.tableName == "PriceList") {

                        scope.rowClick({ event: scope.$event, id: row.id, mode: 1 });

<<<<<<< HEAD
                    }

                    else {
=======
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        scope.rowClick({ file: row });

                    }

<<<<<<< HEAD
                }

                else {

                    switch (scope.tableName) {

                        

                        case ("CRM"): stateName = "app.editCrm"; break;
                        case ("prospect"): stateName = "app.editprospect"; break;

                        case ("CRM_retailer"): stateName = "app.editCrm"; break;

                        case ("HR"): stateName = "app.edithrvalues"; break;

                        case ("SRMOrder"): stateName = "app.editsrmorder"; break;

                        case ("PurchaseOrder"): stateName = "app.editsrmorder"; break;

                        case ("PurchaseInvoice"): stateName = "app.viewsrminvoice"; break;

                        case ("Item"): stateName = "app.edit-item"; break;

                        case ("Customer"): stateName = "app.editCustomer"; break;

                        case ("CreditNotes"): stateName = "app.editReturnOrder"; break;

                        case ("PostedCreditNotes"): stateName = "app.viewReturnOrder"; break;

                        case ("SalesInvoice"): stateName = "app.viewOrder"; break;

                        case ("SalesOrder"): stateName = "app.editOrder"; break;

                        case ("SalesQuote"): stateName = "app.viewSaleQuote"; break;

                        case ("PostedDebitNotes"): stateName = "app.viewsrmorderreturninvoice"; break;

                        case ("DebitNotes"): stateName = "app.viewsrmorderreturn"; break;

                        case ("SRM"): stateName = "app.view-srm"; break;

                        case ("Warehouse"): stateName = "app.view-warehouse"; break;

                        case ("Supplier"): stateName = "app.view-supplier"; break;

                        case ("Attachments"): stateName = ""; break;

                        case ("Rebates"): stateName = ""; break;

                        case ("CustomerActivity"): stateName = ""; break;

                        case ("SupplierActivity"): stateName = ""; break;

                        case ("ItemActivity"): stateName = ""; break;

                        case ("GLActivity"): stateName = ""; break;
=======
                } else {

                    switch (scope.tableName) {



                        case ("CRM"):
                            stateName = "app.editCrm";
                            break;
                        case ("prospect"):
                            stateName = "app.editprospect";
                            break;

                        case ("CRM_retailer"):
                            stateName = "app.editCrm";
                            break;

                        case ("HR"):
                            stateName = "app.edithrvalues";
                            break;

                        case ("SRMOrder"):
                            stateName = "app.editsrmorder";
                            break;

                        case ("PurchaseOrder"):
                            stateName = "app.editsrmorder";
                            break;

                        case ("PurchaseInvoice"):
                            stateName = "app.viewsrminvoice";
                            break;

                        case ("Item"):
                            stateName = "app.edit-item";
                            break;

                        case ("Customer"):
                            stateName = "app.editCustomer";
                            break;

                        case ("CreditNotes"):
                            stateName = "app.editReturnOrder";
                            break;

                        case ("PostedCreditNotes"):
                            stateName = "app.viewReturnOrder";
                            break;

                        case ("SalesInvoice"):
                            stateName = "app.viewOrder";
                            break;

                        case ("SalesOrder"):
                            stateName = "app.editOrder";
                            break;

                        case ("SalesQuote"):
                            stateName = "app.viewSaleQuote";
                            break;

                        case ("PostedDebitNotes"):
                            stateName = "app.viewsrmorderreturninvoice";
                            break;

                        case ("DebitNotes"):
                            stateName = "app.viewsrmorderreturn";
                            break;

                        case ("SRM"):
                            stateName = "app.view-srm";
                            break;

                        case ("Warehouse"):
                            stateName = "app.view-warehouse";
                            break;

                        case ("Supplier"):
                            stateName = "app.view-supplier";
                            break;

                        case ("Attachments"):
                            stateName = "";
                            break;

                        case ("Rebates"):
                            stateName = "";
                            break;

                        case ("CustomerActivity"):
                            stateName = "";
                            break;

                        case ("SupplierActivity"):
                            stateName = "";
                            break;

                        case ("ItemActivity"):
                            stateName = "";
                            break;

                        case ("GLActivity"):
                            stateName = "";
                            break;

                        case ("OtherCompanies"):
                            stateName = "app.view-otherCompanies";
                            break;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    }

                    switch (scope.tableName) {

                        case ("SalesInvoice"):

                            stateData = {

                                id: recId,

                                isInvoice: 1

                            }

                            break;

                        case ("PostedCreditNotes"):

                            stateData = {

                                id: recId,

                                isInvoice: 1

                            }

                            break;

                        case ("Attachments"):

                            break;

                        default:

                            if (stateName)

                                stateData = {

<<<<<<< HEAD
                                    id: recId

                                }
=======
                                id: recId

                            }
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                            break;

                    }

<<<<<<< HEAD
                    if (stateName){
=======
                    if (stateName) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        if (event.ctrlKey || event.metaKey || event.which == 2 || event.button == 4) {

                            var url = "";

                            url = $state.href(stateName, stateData);

                            window.open(url, '_blank');

<<<<<<< HEAD
                        }

                        else{
=======
                        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                            $state.go(stateName, stateData);

                        }

<<<<<<< HEAD
                    }

                    else{
=======
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        // no state to go to..

                    }

                }







            }



<<<<<<< HEAD
            scope.getColumnName = function (field_name) {

                var found = "";

                if (scope.data && scope.data.response){

                    angular.forEach(scope.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
=======
            scope.getColumnName = function(field_name) {

                var found = "";

                if (scope.data && scope.data.response) {

                    angular.forEach(scope.data.response.tbl_meta_data.response.colMeta, function(obj, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        if (!found && obj.field_name == field_name) {

                            found = obj.title;

                        }

                    })

                }

                return found;

            }



<<<<<<< HEAD
            scope.filterType = function (key) {
=======
            scope.filterType = function(key) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                return typeof scope.filterObject[key];

            }



<<<<<<< HEAD
            scope.exportAsCSV = function(){

                for (var key in scope.filterObject) {

                    if (scope.filterObject[key].type && scope.filterObject[key].type == 'drop_down' &&  !scope.filterObject[key].value){
=======
            scope.exportAsCSV = function() {

                for (var key in scope.filterObject) {

                    if (scope.filterObject[key].type && scope.filterObject[key].type == 'drop_down' && !scope.filterObject[key].value) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        delete scope.filterObject[key];

                    }

                }

                scope.filterObject.exportAsCSV = scope.tableName;

                // scope.addToConfig(1);

                scope.filterFunction();

            }



<<<<<<< HEAD
            scope.dirFunc = function (s, d) {
=======
            scope.dirFunc = function(s, d) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                if (s == undefined || d == undefined)

                    return alert('contact admin: s/d undefined in "arrangeCategories"');

<<<<<<< HEAD
                s = Number(s); d = Number(d);
=======
                s = Number(s);
                d = Number(d);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                if (s == d) return;

                if (s < d) {

                    scope.data.response.tbl_meta_data.response.colMeta.splice(d + 1, 0, scope.data.response.tbl_meta_data.response.colMeta[s]);

<<<<<<< HEAD
                }

                else
=======
                } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    scope.data.response.tbl_meta_data.response.colMeta.splice(d, 0, scope.data.response.tbl_meta_data.response.colMeta[s]);

                if (s > d) s++;





                scope.$apply(scope.data.response.tbl_meta_data.response.colMeta.splice(s, 1));

                for (var i = 0; i < scope.data.response.tbl_meta_data.response.colMeta.length; i++) {

                    scope.data.response.tbl_meta_data.response.colMeta[i].display_order = i + 1;

                }

            }



<<<<<<< HEAD
            scope.SaveTableMetaData = function (tblMetaParam) {
=======
            scope.SaveTableMetaData = function(tblMetaParam) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564





                var tempObj = JSON.parse(JSON.stringify(tblMetaParam));

                tempObj.tblMeta.autoAdjust = scope.defaultWidth ? 1 : 0;

<<<<<<< HEAD
                angular.forEach(tempObj.colMeta, function(obj,i){

                    obj.display_order = i+1;
=======
                angular.forEach(tempObj.colMeta, function(obj, i) {

                    obj.display_order = i + 1;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                })



                var getTblMetaUrl = scope.$root.setup + "general/update-flexi-table-meta";



                var postData = { 'token': scope.$root.token, 'tblMetaParam': tempObj, tableName: scope.tableName };

                $http

                    .post(getTblMetaUrl, postData)

<<<<<<< HEAD
                    .then(function (res) {

                        toaster.pop('success', 'Update', 'Options Updated Successfully.')

                    });
=======
                .then(function(res) {

                    toaster.pop('success', 'Update', 'Options Updated Successfully.')

                });
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            }



<<<<<<< HEAD
            scope.selectTotal = function(totalRecords){

                scope.filterObject.selectedPage = 1;                
=======
            scope.selectTotal = function(totalRecords) {

                scope.filterObject.selectedPage = 1;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                scope.filterObject.totalRecords = totalRecords;

            }



            //flexi table default table getter

<<<<<<< HEAD
            scope.getDefaultTableMeta = function (tableName, refData) {

                var tempArr = [];

                angular.forEach(scope.data.response.tbl_meta_data.response.originalColMeta, function(obj,i){

                    elm = scope.data.response.tbl_meta_data.response.colMeta.filter(function (e) { return obj.title == e.title; })[0];
=======
            scope.getDefaultTableMeta = function(tableName, refData) {

                var tempArr = [];

                angular.forEach(scope.data.response.tbl_meta_data.response.originalColMeta, function(obj, i) {

                    elm = scope.data.response.tbl_meta_data.response.colMeta.filter(function(e) { return obj.title == e.title; })[0];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    delete elm.display_order;

                    elm.color = obj.color;

                    elm.visible = obj.visible;

                    elm.width = obj.width;

                    elm.pinned = obj.pinned;

                    tempArr.push(elm);

                })

                scope.data.response.tbl_meta_data.response.colMeta = tempArr;

<<<<<<< HEAD
                if (scope.data.response.tbl_meta_data.response.originalTblMeta && scope.data.response.tbl_meta_data.response.originalTblMeta.autoAdjust){

                    scope.data.response.tbl_meta_data.response.tblMeta.autoAdjust = scope.data.response.tbl_meta_data.response.originalTblMeta.autoAdjust;

                }

                else{
=======
                if (scope.data.response.tbl_meta_data.response.originalTblMeta && scope.data.response.tbl_meta_data.response.originalTblMeta.autoAdjust) {

                    scope.data.response.tbl_meta_data.response.tblMeta.autoAdjust = scope.data.response.tbl_meta_data.response.originalTblMeta.autoAdjust;

                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    scope.data.response.tbl_meta_data.response.tblMeta.autoAdjust = false;

                }

            }



            scope.pagination_arry = scope.$root.pagination_arry;



<<<<<<< HEAD
            scope.$watch('data', function (newVal, oldVal) {

                if (scope.data && scope.data.response){

                    if (scope.data.response[0] == undefined || (scope.data.response[0]  && scope.data.response[0].length == 0) && scope.filterObject.selectedPage > 1){
=======
            scope.$watch('data', function(newVal, oldVal) {

                if (scope.data && scope.data.response) {

                    if (scope.data.response[0] == undefined || (scope.data.response[0] && scope.data.response[0].length == 0) && scope.filterObject.selectedPage > 1) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        scope.filterObject.selectedPage = 1;

                        scope.addToConfig();

                    }

<<<<<<< HEAD
                    if (scope.filterObject.totalRecords == undefined){

                        scope.totalRecords = 50;

                    }

                    else{
=======
                    if (scope.filterObject.totalRecords == undefined) {

                        scope.totalRecords = 50;

                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        scope.totalRecords = scope.filterObject.totalRecords;

                    }

<<<<<<< HEAD
                    if (scope.data && scope.data.csv){
=======
                    if (scope.data && scope.data.csv) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        var hiddenElement = document.createElement('a');

                        hiddenElement.href = scope.data.csv;

                        hiddenElement.target = '_self';

                        // hiddenElement.download = scope.tableName + '.csv';

                        hiddenElement.click();

                        delete scope.data.csv;

                        return;

                    }

<<<<<<< HEAD
                    if (scope.filterObject && scope.filterObject.exportAsCSV){
=======
                    if (scope.filterObject && scope.filterObject.exportAsCSV) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        delete scope.filterObject.exportAsCSV;

                    }

                    if (scope.data && scope.data.response && scope.data.response.tbl_meta_data.defaultFilter) {

                        var searchObj = {};

                        scope.showFilters = true;

<<<<<<< HEAD
                        angular.forEach(scope.data.response.tbl_meta_data.response.colMeta, function (obj) {

                            if (obj.default_filter != undefined && obj.default_filter) {

                                if (obj.data_type == "drop_down"){
=======
                        angular.forEach(scope.data.response.tbl_meta_data.response.colMeta, function(obj) {

                            if (obj.default_filter != undefined && obj.default_filter) {

                                if (obj.data_type == "drop_down") {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                                    searchObj[obj.field_name] = {

                                        type: "drop_down",

                                        value: obj.filter_value

                                    }

<<<<<<< HEAD
                                }

                                else{
=======
                                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                                    searchObj[obj.field_name] = obj.filter_value;

                                }

                                return false;

                            }

                        })

                        if (scope.savedConfig && scope.savedConfig.found) {

                            for (var k in scope.savedConfig.search) {

                                scope.filterObject[k] = scope.savedConfig.search[k];

                                scope.showFilters = true;

                            }

<<<<<<< HEAD
                        }

                        else {
=======
                        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                            for (var k in searchObj) {

                                scope.filterObject[k] = searchObj[k];

                                scope.showFilters = true;

                            }

                        }

<<<<<<< HEAD
    

                    }

    
=======


                    }


>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    // for (var key in scope.checkedRecords) {

                    //     delete scope.checkedRecords[key];

                    // }

                    scope.data2.response = [];

<<<<<<< HEAD
                    angular.forEach(scope.data.response, function (value, key) {
=======
                    angular.forEach(scope.data.response, function(value, key) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        if (key != "tbl_meta_data") {

                            value.id = parseInt(value.id);

                            scope.data2.response.push(value);

<<<<<<< HEAD
    

                        }

                        else {
=======


                        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                            // if (scope.originalMeta) {

                            //     return;

                            // }

                            // else {

<<<<<<< HEAD
                                scope.defaultWidth = value.response.tblMeta.autoAdjust;

                                scope.originalMeta = JSON.stringify(value.response);
=======
                            scope.defaultWidth = value.response.tblMeta.autoAdjust;

                            scope.originalMeta = JSON.stringify(value.response);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                            // }

                        }

                    });

                    scope.total = scope.data.total;

<<<<<<< HEAD
                    if (scope.total && scope.total > 0){
=======
                    if (scope.total && scope.total > 0) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        $(`.scrollme_${scope.tableName}`).scrollLeft(0);

                        $(`.scrollme_${scope.tableName}`).scrollsync();

                    }

                    scope.item_paging = {};

                    scope.item_paging.total_pages = scope.data.total_pages;

                    scope.item_paging.cpage = scope.data.cpage;

                    scope.item_paging.ppage = scope.data.ppage;

                    scope.item_paging.npage = scope.data.npage;

                    scope.item_paging.pages = scope.data.pages;

                    scope.total_paging_record = scope.data.total_paging_record;

<<<<<<< HEAD
                        scope.isEmptyOrderObj();

                        scope.pinHandler();
=======
                    scope.isEmptyOrderObj();

                    scope.pinHandler();
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    // if (scope.data.response.tbl_meta_data != undefined) {

                    //     

                    // }

                    // if (scope.data.response.tbl_meta_data == undefined || scope.data.response.tbl_meta_data.response.colMeta[0].length == 0) {

                    //     scope.getDefaultTableMeta(scope.tableName, {});

                    // }

                }







            }, true);





<<<<<<< HEAD
            scope.pinHandler = function (header) {
=======
            scope.pinHandler = function(header) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                if (header != undefined) {

                    for (var i = 0; i < scope.data.response.tbl_meta_data.response.colMeta.length; i++) {

                        if ((header.field_name == scope.data.response.tbl_meta_data.response.colMeta[i].field_name) && header.pinned != "0")

                            scope.data.response.tbl_meta_data.response.colMeta[i].pinned = "1";

                        else {

                            scope.data.response.tbl_meta_data.response.colMeta[i].pinned = "0";

                        }

                    }

                }

                var pinData = scope.pinnedFinder(scope.data.response.tbl_meta_data.response.colMeta);

                scope.pinnedCols = pinData[0];

                scope.nonPinnedCols = pinData[1];



            }



<<<<<<< HEAD
            scope.updateDefaultWidth = function () {
=======
            scope.updateDefaultWidth = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                scope.data.response.tbl_meta_data.response.tblMeta.autoAdjust = scope.defaultWidth;

                var tempMeta = scope.data.response.tbl_meta_data.response.originalColMeta;

                if (!scope.defaultWidth) {

                    for (var i = 0; i < scope.data.response.tbl_meta_data.response.colMeta.length; i++) {

<<<<<<< HEAD
                        elm = tempMeta.filter(function (e) { return scope.data.response.tbl_meta_data.response.colMeta[i].title == e.title; })[0];
=======
                        elm = tempMeta.filter(function(e) { return scope.data.response.tbl_meta_data.response.colMeta[i].title == e.title; })[0];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        scope.data.response.tbl_meta_data.response.colMeta[i].width = elm.width == "0" ? 150 : elm.width;

                    }

<<<<<<< HEAD
                }

                else {

                    for (var i = 0; i < tempMeta.length; i++) {

                        elm = tempMeta.filter(function (e) { return scope.data.response.tbl_meta_data.response.colMeta[i].title == e.title; })[0];
=======
                } else {

                    for (var i = 0; i < tempMeta.length; i++) {

                        elm = tempMeta.filter(function(e) { return scope.data.response.tbl_meta_data.response.colMeta[i].title == e.title; })[0];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        scope.data.response.tbl_meta_data.response.colMeta[i].width = elm.width;

                        scope.data.response.tbl_meta_data.response.colMeta[i].pinned = false;



                    }

                }

            }



<<<<<<< HEAD
            scope.widthSlider = function (header) {
=======
            scope.widthSlider = function(header) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                for (var i = 0; i < scope.data.response.tbl_meta_data.response.colMeta.length; i++) {

                    if ((header.field_name == scope.data.response.tbl_meta_data.response.colMeta[i].field_name) && header.width != "0")

                        scope.defaultWidth = false;

<<<<<<< HEAD
                    angular.forEach(scope.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
=======
                    angular.forEach(scope.data.response.tbl_meta_data.response.colMeta, function(obj, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        if (obj.width == 0) {

                            obj.width = 150;

                        }

                    })

                    return;

                }

            }



            scope.filterInThere = false;

<<<<<<< HEAD
            scope.isEmpty = function (obj) {
=======
            scope.isEmpty = function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                for (var key in obj) {

                    if (typeof obj[key] == "string" && key != "exportAsCSV" && key != "totalRecords") {

                        if (obj.hasOwnProperty(key) && obj[key].trim() != "") {

                            scope.filterInThere = true;

                            return false;

                        }

<<<<<<< HEAD
                    }

                    else {
=======
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        if (typeof obj[key] == "object") {

                            if (key == "orderArr" || key.type && key.type == "drop_down") {

                                continue;

<<<<<<< HEAD
                            }

                            else {
=======
                            } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                                for (var key2 in obj[key]) {

                                    if (obj[key].hasOwnProperty(key2) && key2 != "type" && obj[key][key2].toString().trim() != "") {

                                        scope.filterInThere = true;

                                        return false;

                                    }

                                }

                            }

                        }



                    }

                }

                if (scope.filterInThere) {

                    scope.filterInThere = false;

                    scope.savedConfig = {};

                    scope.addToConfig();

                    // scope.filterFunction();

                    return false;

                }

                return true;

            }



<<<<<<< HEAD
            scope.toggleCheckboxColumn = function(){
=======
            scope.toggleCheckboxColumn = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                scope.checkboxColumn = !scope.checkboxColumn;

            }



<<<<<<< HEAD
            scope.toggleAllRecordCheck = function(i){



                if (scope.checkAllRecordChecked()){

                    angular.forEach(scope.data2.response, function (obj, i) {

                        scope.checkedRecords.splice(scope.checkChecked(obj.id), 1);

                        
=======
            scope.toggleAllRecordCheck = function(i) {



                if (scope.checkAllRecordChecked()) {

                    angular.forEach(scope.data2.response, function(obj, i) {

                        scope.checkedRecords.splice(scope.checkChecked(obj.id), 1);


>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    })



                    // scope.checkedRecords.length = 0;

<<<<<<< HEAD
                }

                else{

                    // scope.checkedRecords.length = 0;

                    angular.forEach(scope.data2.response, function (obj, i) {

                        

                        if (scope.checkChecked(obj.id) == -1 && !(obj.disabled != undefined && obj.disabled == 1)){

                            scope.checkedRecords.push({key: obj.id, value: obj[scope.selectedRecordPreview], record: obj});
=======
                } else {

                    // scope.checkedRecords.length = 0;

                    angular.forEach(scope.data2.response, function(obj, i) {



                        if (scope.checkChecked(obj.id) == -1 && !(obj.disabled != undefined && obj.disabled == 1)) {

                            scope.checkedRecords.push({ key: obj.id, value: obj[scope.selectedRecordPreview], record: obj });
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        }

                    })

                }

            }



<<<<<<< HEAD
            scope.checkAllRecordChecked = function(){

                var allSelected = true;

                angular.forEach(scope.data2.response, function (obj, i) {

                    if (scope.checkChecked(obj.id) == -1 && !(obj.disabled != undefined && obj.disabled == 1)){
=======
            scope.checkAllRecordChecked = function() {

                var allSelected = true;

                angular.forEach(scope.data2.response, function(obj, i) {

                    if (scope.checkChecked(obj.id) == -1 && !(obj.disabled != undefined && obj.disabled == 1)) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        allSelected = false;

                        return false;

                    }

<<<<<<< HEAD
                })                
=======
                })
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                return allSelected;

            }





<<<<<<< HEAD
            



            scope.dismissThis = function(){
=======




            scope.dismissThis = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                angular.element('#flexiSettingsModal_' + scope.tableName).modal('hide');

            }





<<<<<<< HEAD
            scope.checkHeaderInfo = function (field, title) {

                try {

                    var requiredHeader = scope.data.response.tbl_meta_data.response.colMeta.filter(function (e) {
=======
            scope.checkHeaderInfo = function(field, title) {

                try {

                    var requiredHeader = scope.data.response.tbl_meta_data.response.colMeta.filter(function(e) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        return e.title == title;

                    })[0];

                    if (field == "color" && requiredHeader[field] == "default")

                        return "white";

                    else if (field == "width") {

                        if (requiredHeader.width != 0 && !scope.defaultWidth) {

                            return requiredHeader.width + "px";

<<<<<<< HEAD
                        }

                        else {

                            var visibleColumns = scope.data.response.tbl_meta_data.response.colMeta.filter(function (e) {
=======
                        } else {

                            var visibleColumns = scope.data.response.tbl_meta_data.response.colMeta.filter(function(e) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                                return e.visible == "1";

                            });

                            var nonDefaultWidth = scope.checkboxColumn ? 0 : 0;

                            var nonDefaultColumns = visibleColumns.length;

<<<<<<< HEAD
                            angular.forEach(visibleColumns, function (obj) {
=======
                            angular.forEach(visibleColumns, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                                if (obj.width != "0" && !scope.defaultWidth) {

                                    nonDefaultWidth += parseInt(obj.width);

                                    nonDefaultColumns--;

                                }

                            })

                            nonDefaultWidth = nonDefaultWidth ? (nonDefaultWidth + "") : "0";

                            nonDefaultColumns = nonDefaultColumns ? (nonDefaultColumns) : "1";

                            // var temp = "calc(calc(99.9% - " +  nonDefaultWidth + ")" + nonDefaultColumns + ")";

                            var temp = `calc((99.9% - ${nonDefaultWidth}px) / ${nonDefaultColumns})`;

                            return temp;

                        }

<<<<<<< HEAD
                    }

                    else
=======
                    } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        return requiredHeader[field];

                } catch (error) {

                    return false;

                }

<<<<<<< HEAD
                
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            }







<<<<<<< HEAD
            scope.pinnedFinder = function (colSpecs) {
=======
            scope.pinnedFinder = function(colSpecs) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                var pinnedCols = [];

                var nonPinnedCols = [];

                scope.pinnedFound = false;

                for (var i = 0; i < colSpecs.length; i++) {

                    if (scope.pinnedFound == false) {

                        pinnedCols.push(colSpecs[i]);

                        if (colSpecs[i].visible == "1" && colSpecs[i].pinned == "1") {

                            scope.pinnedFound = true;

                        }

<<<<<<< HEAD
                    }

                    else if (scope.pinnedFound == true) {
=======
                    } else if (scope.pinnedFound == true) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        nonPinnedCols.push(colSpecs[i]);

                    }

                }

                if (scope.pinnedFound == false) {

                    nonPinnedCols = angular.copy(pinnedCols);

                    pinnedCols.length = 0;

<<<<<<< HEAD
                }

                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                }

                return [pinnedCols, nonPinnedCols];

            }



<<<<<<< HEAD
            scope.calculateWidth = function (tables, position) {
=======
            scope.calculateWidth = function(tables, position) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                if (tables.length) {

                    var sum = 0;

<<<<<<< HEAD
                    angular.forEach(tables, function (obj, index) {
=======
                    angular.forEach(tables, function(obj, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        if (obj != undefined)

                            for (var i = 0; i < obj.length; i++) {

<<<<<<< HEAD
                                if (obj[i].visible == "1") {

                                    if ((!scope.defaultWidth) && obj[i].width == "0") {

                                        sum += 150;

                                    }

                                    else

                                        sum += parseInt(obj[i].width);

                                }

                                else {

                                    continue;

                                }

                            }

=======
                            if (obj[i].visible == "1") {

                                if ((!scope.defaultWidth) && obj[i].width == "0") {

                                    sum += 150;

                                } else

                                    sum += parseInt(obj[i].width);

                            } else {

                                continue;

                            }

                        }

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    })

                    sum = sum + 1 + (scope.checkboxColumn && !scope.defaultWidth ? 40 : 0) + "px";

                    // }

<<<<<<< HEAD
                    if (scope.defaultWidth){

                        return "100%";

                    }

                    else{
=======
                    if (scope.defaultWidth) {

                        return "100%";

                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        return sum;

                    }

                }

            }



<<<<<<< HEAD
            
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564





        }

    }

}]);