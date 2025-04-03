myApp.directive('itemUomDetails', ['toaster', '$document', '$http', '$rootScope', 'ngDialog', '$filter', function (toaster, $document, $http, $rootScope, ngDialog, $filter) {

    return {
        restrict: 'E',
        scope: {
            tableHeaders: '=',
            data: '=',
            lengthUnitArr: '=',
            refUomList: '='
        },
        templateUrl: 'app/shared/directives/item_uom_details.directive.html',
        link: linkFunction
    }

    function linkFunction(scope, elem, attrs) {

        scope.$watch("data", function () {
            console.log("watcher called");
            if (scope.selectedRow != undefined)
                scope.infocusDetailsTbl = scope.data[scope.selectedRow];
            else {
                scope.infocusDetailsTbl = scope.data[scope.data.length - 1];
            }

            // if (scope.infocusDetailsTbl.DimensionType == undefined) {
                //scope.pushNewUOM();
            // }
            scope.infocusDetailsTbl.netweight = scope.infocusDetailsTbl.netweight == undefined ? 0 : scope.infocusDetailsTbl.netweight;
            scope.infocusDetailsTbl.packagingWeight = scope.infocusDetailsTbl.packagingWeight == undefined ? 0 : scope.infocusDetailsTbl.packagingWeight;
            scope.infocusDetailsTbl.gross_weight = parseInt(scope.infocusDetailsTbl.netweight) + parseInt(scope.infocusDetailsTbl.packagingWeight);

            scope.infocusDetailsTbl.DimensionType= (scope.infocusDetailsTbl.DimensionType!=null && scope.infocusDetailsTbl.DimensionType!=0) ? scope.infocusDetailsTbl.DimensionType : 1;
            scope.onSelectDimension();


        })

        scope.CalculateVolume = function () {
            if (!scope.infocusDetailsTbl.isCustomCalculated) {
                if (scope.infocusDetailsTbl.DimensionType == 1) {
                    if (parseFloat(scope.infocusDetailsTbl.Dimensions.d1_val) < 0) {
                        toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(316,['Dimension 1','0']));
                        scope.infocusDetailsTbl.Dimensions.d1_val = '';
                        scope.infocusDetailsTbl.volume = 0;
                        return;
                    }
                    else if (parseFloat(scope.infocusDetailsTbl.Dimensions.d2_val) < 0) {
                        toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(316, ['Dimension 2', '0']));
                        scope.infocusDetailsTbl.Dimensions.d2_val = '';
                        scope.infocusDetailsTbl.volume = 0;
                        return;
                    }
                    else if (parseFloat(scope.infocusDetailsTbl.Dimensions.d3_val) < 0) {
                        toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(316, ['Dimension 2', '0']));
                        scope.infocusDetailsTbl.Dimensions.d3_val = '';
                        scope.infocusDetailsTbl.volume = 0;
                        return;
                    }
                    else
                        scope.infocusDetailsTbl.volume = parseFloat(scope.infocusDetailsTbl.Dimensions.d1_val) * parseFloat(scope.infocusDetailsTbl.Dimensions.d2_val) * parseFloat(scope.infocusDetailsTbl.Dimensions.d3_val);;
                        scope.infocusDetailsTbl.volume = parseFloat(parseFloat(scope.infocusDetailsTbl.volume).toFixed(2));
                }
                else {
                    if (parseFloat(scope.infocusDetailsTbl.Dimensions.d1_val) < 0) {
                        toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(316, ['Radial Dimension', '0']));
                        scope.infocusDetailsTbl.Dimensions.d1_val = '';
                        scope.infocusDetailsTbl.volume = 0;
                        return;
                    }
                    else if (parseFloat(scope.infocusDetailsTbl.Dimensions.d2_val) < 0) {
                        toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(316, ['Dimension 2', '0']));
                        scope.infocusDetailsTbl.Dimensions.d2_val = '';
                        scope.infocusDetailsTbl.volume = 0;
                        return;
                    }
                    else
                        scope.infocusDetailsTbl.volume = 0;

                    var radius = (scope.infocusDetailsTbl.Dimensions.d1_val).toFixed(2);
                    var height = (scope.infocusDetailsTbl.Dimensions.d2_val).toFixed(2);

                    if (scope.infocusDetailsTbl.DimensionType == 2) {

                        if (scope.infocusDetailsTbl.Dimensions.d1_type == 1)
                            scope.infocusDetailsTbl.volume = Math.PI * Math.pow(parseFloat(radius), 2) * parseFloat(height);
                        else
                            scope.infocusDetailsTbl.volume = Math.PI * parseFloat(radius) * parseFloat(height);

                            scope.infocusDetailsTbl.volume = parseFloat(parseFloat(scope.infocusDetailsTbl.volume).toFixed(2));
                            //alert(parseFloat((scope.infocusDetailsTbl.volume).toFixed(2)));
                    }
                    else if (scope.infocusDetailsTbl.DimensionType == 3) {
                        if (scope.infocusDetailsTbl.Dimensions.d1_type == 1) {
                            var constant = parseFloat(4 / 3);
                            scope.infocusDetailsTbl.volume = constant * Math.PI * Math.pow(parseFloat(radius), 3);
                        }
                        else {
                            var constant = parseFloat(1 / 6);
                            scope.infocusDetailsTbl.volume = constant * Math.PI * Math.pow(parseFloat(radius), 3)
                        }

                        scope.infocusDetailsTbl.volume = parseFloat(parseFloat(scope.infocusDetailsTbl.volume).toFixed(2));
                    }
                }

            }

            // calculate weight
            if (parseFloat(scope.infocusDetailsTbl.netweight) < 0) {
                toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(316, ['Net Weight', '0']));
                scope.infocusDetailsTbl.netweight = '';
                scope.infocusDetailsTbl.gross_weight = 0;
                return;
            }
            if (parseFloat(scope.infocusDetailsTbl.packagingWeight) < 0) {
                toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(316, ['Packaging', '0']));
                scope.infocusDetailsTbl.packagingWeight = '';
                scope.infocusDetailsTbl.gross_weight = 0;
                return;
            }
            else
                scope.infocusDetailsTbl.gross_weight = parseFloat(scope.infocusDetailsTbl.netweight) + parseFloat(scope.infocusDetailsTbl.packagingWeight);
                scope.infocusDetailsTbl.gross_weight = (scope.infocusDetailsTbl.gross_weight > 0) ? parseFloat(parseFloat(scope.infocusDetailsTbl.gross_weight).toFixed(2)) : parseFloat(scope.infocusDetailsTbl.gross_weight);
        }
        scope.CalculateRefQuantity = function () {
            angular.forEach(scope.data, function (outer, idx1) {
                var deteleAllowed = false;
                if (outer.cat_id.id != undefined && outer.ref_unit_id.id != undefined) {
                    angular.forEach(scope.data, function (inner, idx2) {
                        if (inner.cat_id.id == outer.ref_unit_id.id) {
                            if (inner.ref_quantity != undefined && inner.ref_quantity != '' && outer.quantity != undefined && outer.quantity != '')
                                outer.ref_quantity = (Number(outer.quantity) * Number(inner.ref_quantity));
                            else if (outer.quantity != undefined && outer.quantity != '' && outer.quantity != '0' &&
                                inner.quantity != undefined && inner.quantity != '' && inner.quantity != '0')
                                outer.ref_quantity = (Number(outer.quantity) * Number(inner.quantity));
                            else
                                outer.ref_quantity = '';
                        }

                        if (outer.cat_id.id != undefined && outer.cat_id.id == inner.ref_unit_id.id) {
                            deteleAllowed = true;
                        }
                    });
                    if (outer.ref_quantity == '0')
                        outer.ref_quantity = '';

                    if (deteleAllowed) {
                        outer.isDeleteAllowed = true;
                    }
                    else
                        outer.isDeleteAllowed = false;
                }
            });


            var temp_cat_id = scope.infocusDetailsTbl.cat_id;
            var temp_ref_unit_id = scope.infocusDetailsTbl.ref_unit_id;
            //scope.data.sort(predicateBy("ref_quantity"));
            if (scope.selectedRow != 0) {
                var item = $filter("filter")(scope.data, { cat_id: temp_cat_id, ref_unit_id: temp_ref_unit_id });
                var idx = scope.data.indexOf(item[0]);
                if (idx != scope.selectedRow) {
                    scope.selectedRow = idx;
                    document.activeElement.blur();
                }
            }
        }
        scope.onSelectDimension = function () {

            var selectedDimensions = [];
           // default selection in case of linear

            if(scope.infocusDetailsTbl.DimensionType==1){
                // dimension
                scope.infocusDetailsTbl.Dimensions.d1_type = (scope.infocusDetailsTbl.Dimensions.d1_type !=null && scope.infocusDetailsTbl.Dimensions.d1_type!='') ? Number(scope.infocusDetailsTbl.Dimensions.d1_type) : Number(1);   

                scope.infocusDetailsTbl.Dimensions.d2_type = (scope.infocusDetailsTbl.Dimensions.d2_type !=null && scope.infocusDetailsTbl.Dimensions.d2_type !='') ? Number(scope.infocusDetailsTbl.Dimensions.d2_type) : Number(2);

                scope.infocusDetailsTbl.Dimensions.d3_type = (scope.infocusDetailsTbl.Dimensions.d3_type !=null && scope.infocusDetailsTbl.Dimensions.d3_type !='') ? Number(scope.infocusDetailsTbl.Dimensions.d3_type) : Number(4);
                // unit
                scope.infocusDetailsTbl.Dimensions.d1_unit = (scope.infocusDetailsTbl.Dimensions.d1_unit !=null && scope.infocusDetailsTbl.Dimensions.d1_unit !=0) ? Number(scope.infocusDetailsTbl.Dimensions.d1_unit) : Number(2);

                scope.infocusDetailsTbl.Dimensions.d2_unit = (scope.infocusDetailsTbl.Dimensions.d2_unit !=null && scope.infocusDetailsTbl.Dimensions.d2_unit !=0) ? Number(scope.infocusDetailsTbl.Dimensions.d2_unit) : Number(2);

                scope.infocusDetailsTbl.Dimensions.d3_unit = (scope.infocusDetailsTbl.Dimensions.d3_unit!=null && scope.infocusDetailsTbl.Dimensions.d3_unit !=0) ? Number(scope.infocusDetailsTbl.Dimensions.d3_unit) : Number(2);

                scope.infocusDetailsTbl.volume_unit = (scope.infocusDetailsTbl.volume_unit !=null && scope.infocusDetailsTbl.volume_unit !=0 ) ? scope.infocusDetailsTbl.volume_unit : 2;

                scope.infocusDetailsTbl.weightUnit = (scope.infocusDetailsTbl.weightUnit !=null && scope.infocusDetailsTbl.weightUnit !=0) ? Number(scope.infocusDetailsTbl.weightUnit) : Number(2);
                // if no dimensions selected then add these default 
                selectedDimensions = [scope.infocusDetailsTbl.Dimensions.d1_type,scope.infocusDetailsTbl.Dimensions.d2_type,scope.infocusDetailsTbl.Dimensions.d3_type];           
            }else{
                selectedDimensions = [];
            }
           
            var item = scope.lengthUnitArr.filter(function (obj) {
                return obj.id === scope.infocusDetailsTbl.Dimensions.d1_type;
            })[0];
            if (item != undefined)
                selectedDimensions.push(item.id);

            item = scope.lengthUnitArr.filter(function (obj) {
                return obj.id === scope.infocusDetailsTbl.Dimensions.d2_type;
            })[0];
            if (item != undefined)
                selectedDimensions.push(item.id);

            item = scope.lengthUnitArr.filter(function (obj) {
                return obj.id === scope.infocusDetailsTbl.Dimensions.d3_type;
            })[0];
            if (item != undefined)
                selectedDimensions.push(item.id);

            angular.forEach(scope.lengthUnitArr, function (obj) {
                obj.selectable = false;
            });

            angular.forEach(selectedDimensions, function (idx) {
                if (idx != -1)
                    scope.lengthUnitArr[idx - 1].selectable = true;
                    else
                    scope.lengthUnitArr[idx - 1].selectable = false;                    
            });

            selectedDimensions = [];
            scope.CalculateVolume();
        }
        scope.showUOMDetails = function (index) {
            if (scope.data.length) {
                scope.infocusDetailsTbl = scope.data[index];
                // console.log(scope.infocusDetailsTbl);
                scope.selectedRow = index;
            }
            scope.CalculateVolume();
            scope.onSelectDimension();
            if (scope.infocusDetailsTbl.cat_id.id != undefined && scope.infocusDetailsTbl.ref_unit_id.id != undefined && scope.infocusDetailsTbl.quantity != undefined)
                scope.CalculateRefQuantity();
        }
        scope.selectedRow = '0';
        if (scope.data.length) {
            scope.showUOMDetails(scope.selectedRow);
        }
        scope.onChangeDimension1 = function () {
            if (!(scope.infocusDetailsTbl.isCustomCalculated)) {
                scope.infocusDetailsTbl.Dimensions.d2_unit = scope.infocusDetailsTbl.Dimensions.d1_unit;
                scope.infocusDetailsTbl.Dimensions.d3_unit = scope.infocusDetailsTbl.Dimensions.d1_unit;
                scope.infocusDetailsTbl.volume_unit = scope.infocusDetailsTbl.Dimensions.d1_unit;

            }
        }
        scope.ValidateUOMEntry = function (index, param) {
            if (scope.data[index].cat_id.id != undefined && scope.data[index].cat_id.id == scope.data[index].ref_unit_id.id) {//} && scope.data[index].quantity != '1') {
                toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(242, ['Same Units']));
                scope.data[index].quantity = '';
                scope.data[index].ref_unit_id = '';
                isValid = false;
            }
            else if (scope.data[index].cat_id.id == scope.data[0].cat_id.id) {
                toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(242, ['Base U.O.M']));
                scope.data[index].cat_id = '';
                return;
            }
            // UOM allowed one times 
            angular.forEach(scope.data, function (item, idx) {
                if (index != idx) {
                    if (item.cat_id.id == scope.data[index].cat_id.id) {
                        toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(107));
                        scope.data[index].cat_id = '';
                        return;
                    }
                }
            });

            var isValid = true;
            /* 
            //UOM allowed Multiple times  
            if (scope.data[index].cat_id.id != undefined && scope.data[index].cat_id.id == scope.data[index].ref_unit_id.id && scope.data[index].quantity != '1') {
                
                scope.data[index].quantity = '';
                isValid = false;
            }
            else {
                if (scope.data[index].cat_id.id != undefined && scope.data[index].cat_id.id != '' &&
                    scope.data[index].ref_unit_id.id != undefined && scope.data[index].ref_unit_id.id != '') {
                    angular.forEach(scope.data, function (item, idx) {
                        if (index != idx) {
                            if (item.cat_id.id == scope.data[index].cat_id.id && item.ref_unit_id.id == scope.data[index].ref_unit_id.id) {
                                toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(107));
                                scope.data[index].ref_unit_id = '';
                                scope.data[index].quantity = '';
                                isValid = false;
                            }
                            else if (item.cat_id.id == scope.data[index].ref_unit_id.id && item.ref_unit_id.id == scope.data[index].cat_id.id) {
                                
                                scope.data[index].ref_unit_id = '';
                                scope.data[index].quantity = '';
                                isValid = false;
                            }
                        }
                    });
                }
            } */


            angular.forEach(scope.refUomList, function (ref_item, ref_idx) {
                angular.forEach(scope.data, function (item, idx) {

                    var found = scope.data.filter(function (obj) {
                        return obj.cat_id.id === ref_item.id;
                    })[0];
                    if (found == undefined) {
                        // item.ref_quantity = '';
                        // item.quantity = '';
                        scope.refUomList.splice(ref_idx, 1);
                    }
                });
            });

            if (isValid) {
                if (scope.infocusDetailsTbl.cat_id.hasOwnProperty('id') && scope.infocusDetailsTbl.ref_unit_id.hasOwnProperty('id')) {
                    var item = scope.data[index].cat_id;
                    var found = scope.refUomList.filter(function (obj) {
                        return obj.id === item.id;
                    })[0];

                    if (found == undefined)
                        scope.refUomList.push(item);
                }
            }
            if (scope.infocusDetailsTbl.cat_id.id != undefined && scope.infocusDetailsTbl.ref_unit_id.id != undefined && scope.infocusDetailsTbl.quantity != undefined){
                scope.CalculateRefQuantity();   
                scope.infocusDetailsTbl.DimensionType=1;
                scope.onSelectDimension();
            }
        }
        
        function predicateBy(prop) {
            return function (a, b) {
                if (parseFloat(a[prop]) > parseFloat(b[prop])) {
                    return 1;
                } else if (parseFloat(a[prop]) < parseFloat(b[prop])) {
                    return -1;
                }
                return 0;
            }
        }
        scope.pushNewUOM = function () {
            if (scope.data.length < 5) {
                /* 
                "rem_id": 1, "rec_id": "", "check_id": 1, "quantity": "1", "cat_id": "3", "DS": 0, "ref_unit_id": "3", "ref_quantity": "1", "barcode": "", "DimensionType": "0", "customDimension": "0", "Dimension1": "0", "Dimension1_value": "0", "Dimension1_unit": "0", "Dimension2": "0", "Dimension2_value": "0", "Dimension2_unit": "0", "Dimension3": "0", "Dimension3_value": "0", "Dimension3_unit": "0", "volume": "0", "volume_unit": "0", "weightUnit": "0", "netweight": "0", "packagingWeight": "0"
                */
                scope.data.push({
                    'UOM': $rootScope.uni_prooduct_arr,
                    'cat_id': '0',
                    'quantity': null,
                    'refUOM': scope.refUomList,
                    'ref_unit_id': '',
                    'ref_quantity': '0',
                    'barcode': '',
                    'DimensionType': '0',
                    'isCustomCalculated': false,
                    'Dimensions': { 'd1_type': '', 'd1_val': 0, 'd1_unit': '0', 'd2_type': '', 'd2_val': 0, 'd2_unit': '', 'd3_type': '', 'd3_val': 0, 'd3_unit': '0' },
                    'volume': 0,
                    'volume_unit': '0',
                    'net_weight_unit': '0',
                    'netweight': 0,
                    'packagingWeight': 0,
                    'gross_weight': 0,
                    'isDeleteAllowed': false
                });

                scope.infocusDetailsTbl = scope.data[scope.data.length - 1];
                scope.selectedRow = scope.data.length - 1;
                scope.CalculateVolume();
            }
            else {
                toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(318));
            }

            //    $("#uom_details_tbl").get(scope.data.length).scrollIntoView();
            // var $t = $('.uom_details_tbl');
            // $t.animate({"scrollTop": $('.uom_details_tbl')[0].scrollHeight}, "slow");
            // $('#uom_details_tbl').scrollTop($('#uom_details_tbl')[0].scrollHeight + 150);
        }
        scope.onClickCustom = function () {
            if (!(scope.infocusDetailsTbl.isCustomCalculated))
                scope.CalculateVolume();
        }

        if (scope.data.length > 0 && !(scope.infocusDetailsTbl.isCustomCalculated))
            scope.CalculateVolume();

        scope.removeUOM = function (index) {

            ngDialog.openConfirm({
                template: '_confirm_uom_delete_error_msg',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                var parent_uom = scope.data[index].cat_id.id;
                var found = scope.data.filter(function (obj) {
                    return obj.cat_id.id === parent_uom;
                });
                if (found.length <= 1) {
                    var ref_parent_uom = scope.data[index].cat_id.id;
                    var ref_found = scope.refUomList.filter(function (obj) {
                        return obj.id === ref_parent_uom;
                    });
                    var ref_idx = scope.refUomList.indexOf(ref_found[0]);
                    scope.refUomList.splice(ref_idx, 1);
                }




                var submitUrl = $rootScope.stock + "unit-measure/delete-unit-quantity";
                if (scope.data[index] != undefined && scope.data[index].rec_id != undefined) {
                    var rec = {};
                    rec.token = $rootScope.token;
                    rec.id = scope.data[index].rec_id;
                    $http
                        .post(submitUrl, rec)
                        .then(function (res) {
                            if (res.data.ack > 0) {
                                scope.data.splice(index, 1);
                                if (index <= scope.data.length - 1)
                                    scope.showUOMDetails(index);
                                else
                                    scope.showUOMDetails(0);
                                return res.data;
                            } else {
                                return false;
                            }

                        });
                }
                else
                    scope.data.splice(index, 1);                
            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
            /* if (confirm("Are you sure to delete this UOM")) {
                 */
        }

        var elemFocus = true;
        $document.bind('keydown', function (e) {
            if (elemFocus) {
                if (e.keyCode == 38) {
                    if (scope.selectedRow == 0) {
                        scope.selectedRow = scope.data.length - 1;
                    }
                    else
                        scope.selectedRow--;

                    scope.showUOMDetails(scope.selectedRow);
                    scope.$apply();
                    e.preventDefault();
                }
                if (e.keyCode == 40) {
                    if (scope.selectedRow == scope.data.length - 1) {
                        scope.selectedRow = 0
                    }
                    else
                        scope.selectedRow++;
                    scope.showUOMDetails(scope.selectedRow);
                    scope.$apply();
                    e.preventDefault();
                }

            }
        });
    }
}]);