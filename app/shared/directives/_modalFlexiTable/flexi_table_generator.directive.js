myApp.directive("generateTable2", ['$http', '$state', '$rootScope', function ($http, $state) {
    return {
        restrict: 'A',
        scope: {
            data: "=",
            tableName: "@",
            selectFlexiChkBox: "=",
            updatedObjectArr: "=",
            filterFunction: "&",
            filterObject: "="
        },
        replace: false,
        templateUrl: "app/shared/directives/_modalFlexiTable/flexi_table_generator.directive.html",
        link: function (scope, elem, attrib) {
            scope.widths = [];
            scope.flexiSearch = {};
            scope.data2 = {};
            scope.data2.response = [];
            // scope.selectFlexiChkBox = false;

            // console.log(scope.selectFlexiChkBox);

            scope.containerWidth = elem.width();

            // console.log(scope.data);
            // console.log(scope.tableName);

            scope.editRecord = function (recId) {

                // console.log(recId);
                // console.log(scope.tableName);
                return;

                /* var stateName;
                if (scope.tableName == "CRM") stateName = "app.editCrm";
                else if (scope.tableName == "HR") stateName = "app.edithrvalues";
                else if (scope.tableName == "Item") stateName = "app.edit-item";
                else if (scope.tableName == "Customer") stateName = "app.editCustomer"
                $state.go(stateName, {
                    id: recId
                }); */
            }

            scope.getColumnName = function (field_name) {
                var found = "";
                angular.forEach(scope.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
                    if (!found && obj.field_name == field_name) {
                        found = obj.title;
                    }
                })
                return found;
            }

            scope.filterType = function (key) {
                return typeof scope.filterObject[key];
            }

            scope.dirFunc = function (s, d) {
                if (s == undefined || d == undefined)
                    return alert('contact admin: s/d undefined in "arrangeCategories"');
                s = Number(s); d = Number(d);
                if (s == d) return;
                if (s < d) {
                    scope.data.response.tbl_meta_data.response.colMeta.splice(d + 1, 0, scope.data.response.tbl_meta_data.response.colMeta[s]);
                }
                else
                    scope.data.response.tbl_meta_data.response.colMeta.splice(d, 0, scope.data.response.tbl_meta_data.response.colMeta[s]);
                if (s > d) s++;


                scope.$apply(scope.data.response.tbl_meta_data.response.colMeta.splice(s, 1));
                for (var i = 0; i < scope.data.response.tbl_meta_data.response.colMeta.length; i++) {
                    scope.data.response.tbl_meta_data.response.colMeta[i].display_order = i + 1;
                }

                // console.log("Source:" + " " + s);
                // console.log("Destination: " + d);
                // console.log("Updated Array: " + scope.columnSpecs);
            }

            scope.SaveTableMetaData = function (tblMetaParam) {
                angular.element("#myModal" + scope.tableName).modal("hide");
                // console.log(tblMetaParam);
                var getTblMetaUrl = scope.$root.setup + "general/update-flexi-table-meta";
                var tblparamUpdate = {};
                tblparamUpdate.colMeta = tblMetaParam;
                tblparamUpdate.tblMeta = {};
                tblparamUpdate.tblMeta.autoAdjust = 1;

                angular.forEach(tblparamUpdate.colMeta, function (obj, i) {
                    obj.display_order = i + 1;
                });

                var postData = { 'token': scope.$root.token, 'tblMetaParam': tblparamUpdate, 'tableName': scope.tableName };
                $http
                    .post(getTblMetaUrl, postData)
                    .then(function (res) {
                        console.log(res);
                    });
            }

            scope.dismissFlexiOptions = function () {
                angular.element("#myModal" + scope.tableName).modal("hide");
                // angular.element(document.querySelector("#myModal")).remove();
            }

            //flexi table default table getter
            scope.getDefaultTableMeta = function (tableName, refData) {

                // console.log(tableName);
                var defaultTablePath = "api/flexiTableDefaults/modalDefaults/" + tableName + ".json";
                $http
                    .get(defaultTablePath)
                    .then(function (res) {
                        // console.log(res, refData);

                        angular.forEach(refData, function (obj, index) {
                            for (var i = 0; i < res.data.length; i++) {
                                if (obj.column_name == res.data[i].column_name) {
                                    res.data[i].id = obj.id;
                                    res.data[i].user_id = obj.user_id;
                                    res.data[i].company_id = obj.company_id;
                                }
                            }
                        });

                        if (typeof refData == "undefined") {
                            for (var i = 0; i < res.data.length; i++) {
                                res.data[i].id = "";
                                res.data[i].user_id = scope.$root.userId;
                                res.data[i].company_id = scope.$root.defaultCompany;
                            }

                        }
                        //console.log(scope.data.response.tbl_meta_data.response.colMeta);
                        if (typeof scope.data.response.tbl_meta_data == "undefined")
                            scope.data.response.tbl_meta_data = {
                                response: []
                            };
                        //scope.data.response.tbl_meta_data.response.colMeta = res.data;
                        //scope.$apply(scope.data.response.tbl_meta_data);

                        angular.forEach(res.data, function (obj, index) {
                            scope.data.response.tbl_meta_data.response.colMeta[index] = res.data[index];
                        })
                        // console.log(scope.data.response.tbl_meta_data.response.colMeta);
                        // scope.watcher();
                    });
            }


            if (typeof scope.data.response.tbl_meta_data == "undefined" || scope.data.response.tbl_meta_data.response.colMeta[0].length == 0) {
                //table name should be given here.. currently it is hardcoded to only HR
                scope.getDefaultTableMeta(scope.tableName, {});
            }

            scope.itemselectPage = scope.$root.itemselectPage;
            scope.pagination_arry = scope.$root.pagination_arry;


            scope.isEmpty = function (obj) {
                for (var key in obj) {
                    if (typeof obj[key] == "string") {
                        if (obj.hasOwnProperty(key) && obj[key].trim() != "") {
                            return false;
                        }
                    }
                    else {
                        if (typeof obj[key] == "object") {
                            for (var key2 in obj[key]) {
                                if (obj[key].hasOwnProperty(key2) && obj[key][key2].trim() != "") {
                                    return false;
                                }
                            }
                        }

                    }
                }
                return true;
            }


            //scope.watcher = function () {
                scope.$watch("data", function () {

                    // console.log('watcher called');

                    if (typeof scope.data.response.tbl_meta_data != "undefined") {
                        // scope.pinnedCols = scope.pinnedFinder(scope.data.response.tbl_meta_data.response.colMeta)[0];
                        // scope.nonPinnedCols = scope.pinnedFinder(scope.data.response.tbl_meta_data.response.colMeta)[1];
                        for (var i = 0; i < scope.data.response.tbl_meta_data.response.colMeta.length; i++) {
                            if (scope.data.response.tbl_meta_data.response.colMeta[i].width != "0")
                                scope.defaultWidth = false;
                            scope.data.response.tbl_meta_data.response.colMeta[i].read_only = scope.data.response.tbl_meta_data.response.colMeta[i].read_only == "1" ? true : false;
                            scope.data.response.tbl_meta_data.response.colMeta[i].visible = scope.data.response.tbl_meta_data.response.colMeta[i].visible == "1" ? true : false;
                            // scope.data.response.tbl_meta_data.response.colMeta[i].pinned = scope.data.response.tbl_meta_data.response.colMeta[i].pinned == "1" ? true : false;
                        }
                    }

                    scope.data2.response = [];
                    angular.forEach(scope.data.response, function (value, key) {
                        if (key != "tbl_meta_data") {
                            value.id = parseInt(value.id);
                            scope.data2.response.push(value);

                        }
                        else {
                            scope.defaultWidth = true;
                            angular.forEach(scope.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
                                if (obj.width != "0") {
                                    scope.defaultWidth = false;
                                }
                            });
                        }
                    });

                }, true);
            //}

            scope.checkHeaderInfo = function (field, title) {
                for (var i = 0; i < scope.data.response.tbl_meta_data.response.colMeta.length; i++) {
                    if (scope.data.response.tbl_meta_data.response.colMeta[i].title == title) {
                        if (field == "color" && scope.data.response.tbl_meta_data.response.colMeta[i][field] == "default")
                            return "white";
                        else if (field == "width") {

                            var filterResult = scope.data.response.tbl_meta_data.response.colMeta.filter(function (e) {
                                return e.visible == "1";
                            });
                            if (scope.defaultWidth && !scope.pinnedFound) {
                                var temp = "calc(99.9% / " + filterResult.length + ")";
                                return temp;
                            }
                            else if (scope.data.response.tbl_meta_data.response.colMeta[i][field] == "0") {
                                return "200px";
                            }
                            else {
                                return scope.data.response.tbl_meta_data.response.colMeta[i][field] + "px";
                            }
                        }
                        else
                            return scope.data.response.tbl_meta_data.response.colMeta[i][field];
                    }
                }
            }

            scope.pinnedFinder = function (colSpecs) {
                var pinnedCols    = [];
                var nonPinnedCols = [];
                scope.pinnedFound = false;
                for (var i = 0; i < colSpecs.length; i++) {
                    if (scope.pinnedFound == false) {
                        pinnedCols.push(colSpecs[i]);
                        if (colSpecs[i].pinned == true) {
                            scope.pinnedFound = true;
                        }
                    }
                    else if (scope.pinnedFound == true) {
                        nonPinnedCols.push(colSpecs[i]);
                    }
                }
                if (scope.pinnedFound == false) {
                    nonPinnedCols = angular.copy(pinnedCols);
                    pinnedCols.length = 0;
                }
                else {
                }
                return [pinnedCols, nonPinnedCols];
            }

            scope.total = scope.data.total;
            scope.item_paging = {};
            scope.item_paging.total_pages = scope.data.total_pages;
            scope.item_paging.cpage = scope.data.cpage;
            scope.item_paging.ppage = scope.data.ppage;
            scope.item_paging.npage = scope.data.npage;
            scope.item_paging.pages = scope.data.pages;
            scope.total_paging_record = scope.data.total_paging_record;
            if (typeof scope.data.response.tbl_meta_data != "undefined") {
                scope.pinnedCols    = scope.pinnedFinder(scope.data.response.tbl_meta_data.response.colMeta)[0];
                scope.nonPinnedCols = scope.pinnedFinder(scope.data.response.tbl_meta_data.response.colMeta)[1];
                scope.defaultWidth  = true;

                for (var i = 0; i < scope.data.response.tbl_meta_data.response.colMeta.length; i++) {
                    if (scope.data.response.tbl_meta_data.response.colMeta[i].width != "0")
                        scope.defaultWidth = false;
                    scope.data.response.tbl_meta_data.response.colMeta[i].read_only = scope.data.response.tbl_meta_data.response.colMeta[i].read_only == "1" ? true : false;
                    scope.data.response.tbl_meta_data.response.colMeta[i].visible = scope.data.response.tbl_meta_data.response.colMeta[i].visible == "1" ? true : false;
                    scope.data.response.tbl_meta_data.response.colMeta[i].pinned = scope.data.response.tbl_meta_data.response.colMeta[i].pinned == "1" ? true : false;
                }

            }

            scope.calculateWidth = function (tables) {

                if (tables.length) {
                    var sum = 0;
                    angular.forEach(tables, function (obj, index) {
                        if (typeof obj != "undefined")
                            for (var i = 0; i < obj.length; i++) {
                                if (obj[i].visible == true) {
                                    if ((!scope.defaultWidth || scope.pinnedFound) && obj[i].width == "0") {
                                        sum += 200;
                                    }
                                    else
                                        sum += parseInt(obj[i].width);
                                }
                                else {
                                    continue;
                                }
                            }
                    })

                    /* if (scope.defaultWidth && !scope.pinnedFound) {
                        sum = "100%";
                    }
                    else {
                        sum = sum + "px";
                    } */

                    sum = sum + 1 + "px";
                    return sum;
                }
            }

            /* scope.selectSingleRec = function () {

                console.log(allRec);//allRec, singleRec, selectChkBox
                console.log(singleRec);
                console.log('singleRec');

                if (selectChkBox == false) {

                    angular.forEach(allRec, function (obj, index) {
                        if (obj.id == singleRec) {
                            obj.checkbox = false;
                            scope.updatedObjectArr.splice(index, 1);
                        }
                    });
                }
                else {

                    angular.forEach(allRec, function (obj) {
                        obj.checkbox = true;
                        scope.updatedObjectArr.push(obj.id);
                    });
                }
            } */

            setTimeout(function () {



                var s1 = document.getElementsByClassName('horizontal1')[0];
                var s2 = document.getElementsByClassName('horizontal2')[0];

                function mouseWheelEvent_1(e) {
                    try {
                        if (e.target.classList.value.indexOf("horizontal1") > -1 || e.target.classList.value.indexOf("horizontal2") > -1) {
                            if (e.wheelDeltaX < 0) {
                                e.preventDefault();
                                s1.scrollLeft += 20;
                                s2.scrollLeft = s1.scrollLeft;
                            }
                            else {
                                e.preventDefault();
                                s1.scrollLeft -= 20;
                                s2.scrollLeft = s1.scrollLeft;
                            }
                        }
                    } catch (error) {
                        
                    }
                }
                function mouseWheelEvent_2(e) {
                    try {
                        if (e.target.classList.value.indexOf("horizontal1") > -1 || e.target.classList.value.indexOf("horizontal2") > -1) {
                            if (e.wheelDeltaX < 0) {
                                e.preventDefault();
                                s2.scrollLeft += 20;
                                s1.scrollLeft = s2.scrollLeft;
                            }
                            else {
                                e.preventDefault();
                                s2.scrollLeft -= 20;
                                s1.scrollLeft = s2.scrollLeft;
                            }
                        }
                    } catch (error) {
                        
                    }
                }

                s1.addEventListener('mousewheel', mouseWheelEvent_1, false);
                s2.addEventListener('mousewheel', mouseWheelEvent_2, false);

                var s3 = document.getElementsByClassName('vertical1')[0];
                var s4 = document.getElementsByClassName('vertical2')[0];
                //console.log(s3, s4);

                function mouseWheelEvent_3(e) {
                    try {
                        if (e.target.classList.value.indexOf("vertical1") > -1 || e.target.classList.value.indexOf("vertical2") > -1) {

                            console.log("scrolling top-bottom");

                            if (e.wheelDeltaY < 0) {
                                e.preventDefault();
                                s3.scrollTop += 20;
                                s4.scrollTop = s3.scrollTop;
                            }
                            else {
                                e.preventDefault();
                                s3.scrollTop -= 20;
                                s4.scrollTop = s3.scrollTop;
                            }
                        }
                    } catch (error) {
                        
                    }
                }
                function mouseWheelEvent_4(e) {
                    try {
                        if (e.target.classList.value.indexOf("vertical1") > -1 || e.target.classList.value.indexOf("vertical2") > -1) {
                            if (e.type == "mousewheel") {
                                if (e.wheelDeltaY < 0) {
                                    e.preventDefault();
                                    s4.scrollTop += 20;
                                    s3.scrollTop = s4.scrollTop;
                                }
                                else {
                                    e.preventDefault();
                                    s4.scrollTop -= 20;
                                    s3.scrollTop = s4.scrollTop;
                                }
                            }
                        }
                    } catch (error) {
                        
                    }
                }

                s3.addEventListener('mousewheel', mouseWheelEvent_3, false);
                s4.addEventListener('mousewheel', mouseWheelEvent_4, false);

                function scrollEvent_1(e) {
                    s2.scrollLeft = s1.scrollLeft;
                }
                function scrollEvent_2(e) {
                    s1.scrollLeft = s2.scrollLeft;
                }
                s3.addEventListener('scroll', scrollEvent_1, false);
                s4.addEventListener('scroll', scrollEvent_2, false);

                function scrollEvent_3(e) {
                    s4.scrollTop = s3.scrollTop;
                }
                function scrollEvent_4(e) {
                    s3.scrollTop = s4.scrollTop;
                }
                s3.addEventListener('scroll', scrollEvent_3, false);
                s4.addEventListener('scroll', scrollEvent_4, false);
            }, 0);



            scope.selectAll = function (allRec, flexiSearch) {

                if (scope.selectFlexiChkBox == true)
                    scope.selectFlexiChkBox = false;
                else
                    scope.selectFlexiChkBox = true;

                // console.log(allRec);
                // console.log(flexiSearch);
                // console.log(flexiSearch.length);
                // console.log(scope.selectFlexiChkBox);
                var query = flexiSearch;
                scope.updatedObjectArr.length = 0;

                if (scope.selectFlexiChkBox == true) {

                    // angular.element('#scope.selectFlexiChkBox').checked;

                    /* if (!query.hasOwnProperty(p)) {

                        angular.forEach(allRec, function (obj) {
                            obj.checkbox = true;
                        });
                    }
                    else { */

                    var filtered = [];

                    angular.forEach(allRec, function (obj) {

                        var flag = 0;
                        var queryParams = 0;

                        for (var p in query) {
                            try {
                                if (query.hasOwnProperty(p)) {

                                    //console.log(typeof query[p]);


                                    if (typeof query[p] == "string") {

                                        if (query[p] != "")
                                            queryParams++;

                                        if (obj[p] != null && obj[p] != undefined) {
                                            if (query[p] != "" && obj[p] != "" && (obj[p].toLowerCase().indexOf(query[p].toLowerCase()) > -1)) {
                                                flag++;
                                            }
                                        }
                                    }
                                    else if (typeof query[p] == "object") {
                                        for (var q in query[p]) {
                                            if (query[p][q] != "")
                                                queryParams++;
                                        }


                                        if ((typeof query[p].lowerLimit != "undefined" && query[p].lowerLimit.indexOf("/") > -1) || (typeof query[p].upperLimit != "undefined" && query[p].upperLimit.indexOf("/") > -1)) {
                                            //var tempDate = new Date(obj[p]);
                                            var timestamp = obj[p];
                                            var tempDate = new Date(timestamp * 1000);
                                            //var iso = date.toISOString().match(/(\d{2}:\d{2}:\d{2})/)

                                            if (query[p].lowerLimit && query[p].upperLimit) {
                                                var dateArr = query[p].lowerLimit.split("/");
                                                var lowerLimit = new Date(dateArr[1] + "/" + dateArr[0] + "/" + dateArr[2]);
                                                dateArr = query[p].upperLimit.split("/");
                                                var upperLimit = new Date(dateArr[1] + "/" + dateArr[0] + "/" + dateArr[2]);
                                                if (tempDate >= lowerLimit && tempDate <= upperLimit)
                                                    flag += 2;
                                            }
                                            else if (query[p].lowerLimit) {
                                                var dateArr = query[p].lowerLimit.split("/");
                                                var lowerLimit = new Date(dateArr[1] + "/" + dateArr[0] + "/" + dateArr[2]);
                                                if (tempDate >= lowerLimit)
                                                    flag++;
                                            }
                                            else if (query[p].upperLimit) {
                                                var dateArr = query[p].upperLimit.split("/");
                                                var upperLimit = new Date(dateArr[1] + "/" + dateArr[0] + "/" + dateArr[2]);
                                                if (tempDate <= upperLimit)
                                                    flag++;
                                            }
                                        }

                                        else if (query[p].lowerLimit && query[p].upperLimit) {
                                            if (parseFloat(obj[p]) >= parseFloat(query[p].lowerLimit) && parseFloat(obj[p]) <= parseFloat(query[p].upperLimit))
                                                flag += 2;
                                        }
                                        else if (query[p].lowerLimit) {
                                            if (parseFloat(obj[p]) >= parseFloat(query[p].lowerLimit))
                                                flag++;
                                        }
                                        else if (query[p].upperLimit) {
                                            if (parseFloat(obj[p]) <= parseFloat(query[p].upperLimit))
                                                flag++;
                                        }
                                    }
                                }
                            }
                            catch (ex) {
                                //debugger
                                console.log(ex);
                            }
                        }

                        if (flag == queryParams) {
                            obj.checkbox = true;
                            filtered.push(obj);

                            if (obj.ack !=true)
                                scope.updatedObjectArr.push(obj.id);
                        }
                    });

                    // console.log(filtered);
                    // console.log(scope.updatedObjectArr);

                    // }
                }
                else if (scope.selectFlexiChkBox == false) {
                    angular.forEach(allRec, function (obj) {
                        obj.checkbox = false;
                    });
                    // scope.updatedObjectArr = [];
                    scope.updatedObjectArr.length = 0;
                    // console.log(scope.updatedObjectArr);
                }
            }

            scope.selectSingleRec = function (data) {
                if (data.checkbox == true){
                    scope.updatedObjectArr.push(data.id);
                    
                    if (scope.updatedObjectArr.length == scope.data2.response.length)
                        scope.selectFlexiChkBox = true;
                }                    
                else{
                    scope.updatedObjectArr.splice(scope.updatedObjectArr.indexOf(data.id), 1);
                    scope.selectFlexiChkBox = false;
                }                    
            }

            scope.clearFilterObject = function () {
                scope.flexiSearch = {};
                scope.selectFlexiChkBox = false;
                angular.forEach(scope.data2.response,function(obj){
                    obj.chk = false;
                    obj.checkbox = false;
                    /* angular.forEach(scope.updatedObjectArr, function (obj2) {
                        if (obj2.id == obj.id)
                            obj.chk = true;
                    }); */
                });
                scope.updatedObjectArr.length = 0;
            }
        }
    }
}]);