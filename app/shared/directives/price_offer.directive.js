myApp.directive('priceOfferTbl', ['SubmitPrice', 'toaster', '$document', '$http', '$rootScope', 'ngDialog', '$filter', '$state', function (SubmitPrice, toaster, $document, $http, $rootScope, ngDialog, $filter, $state) {

    return {
        restrict: 'E',
        scope: {
            headers: '=',
            data: '=',
            priceOfferRec: '=',
            currencyConversionRate: '=',
            readOnlyFlg: '=',
            priceListType: '=',
            tempProdArr: '=',
            inventorySetup: '@'
        },
        templateUrl: 'app/shared/directives/price_offer.directive.html',
        link: linkFunction
    }

    function linkFunction(scope, elem, attrs) {
        scope.outerTableHeaders = scope.headers.top_header;
        scope.innerTableHeaders = scope.headers.inner_header;
        scope.additionalCostTableHeaders = scope.headers.additional_cost_header;

        scope.actualDiscount = '0';
        scope.defaultCurrency = $rootScope.defaultCurrencyCode;
        scope.isCRMLocChanged = false;
        scope.selectedRow = 0;
        scope.lastFocusValue = {};

        if (scope.data.length) {
            scope.infocusDetailsTbl = scope.data[0];
            scope.selecteditem = scope.data[0];
        }

        // console.log(scope.priceOfferRec);

        scope.showPriceAdditionalCost = 0;

        /* scope.$watch('currencyConversionRate', function(newValue, oldValue) {
            // if (newValue)
            //     console.log("I see a data change!");
            angular.forEach(scope.data, function(item, index){
                scope.onBlurItem(item.itemData,'priceoffer', index)
            });
        }); */

        if (scope.priceOfferRec.moduleType == 2 && (scope.priceOfferRec.priceType == 2 || scope.priceOfferRec.priceType == 3))
            scope.showPriceAdditionalCost = 1;

        scope.list_type = [
            {
                'name': 'Percentage',
                'id': 1
            },
            {
                'name': 'Value',
                'id': 2
            }
        ];

        // console.log($state.current.name);

        scope.statename = $state.current.name;

        scope.onBlurItem = function (item, param, index) {
            if (item.priceoffer == undefined)
                return;
            if (param == 'priceoffer' || param == 'UOM') {
                /* SubmitPrice.addPriceOfferItem(item, scope.priceOfferRec.id)
                    .then(function (result) {
                        if (result.ack == true) {
                            item.id = result.id;
                            // console.log(item);
                        }
                    }, function (error) {
                        console.log(error);
                    }); */
                scope.calculateLCYPrice(item);
            }
            else if (param == 'max') {
                if (parseFloat(item.Max) <= 0)
                {
                    toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(319,['Maximum Qty.','0']));
                    item.Max = null;
                }
                if ((parseFloat(item.Max) < parseFloat(item.Min))) {
                    toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(319, ['Max. Qty.', 'Min.Qty.']));
                    item.Max = item.prev_Max;
                }
                else {
                    item.prev_Max = item.Max;
                }
            }
            else if (param == 'min') {
                if (parseFloat(item.Min) <= 0) {
                    toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(319, ['Min. Qty.', '0']));
                    item.Min = item.prev_Min;
                }
                if (scope.onChangeCalculateDiscounts(scope.infocusDetailsTbl.discountDetails.rows, scope.infocusDetailsTbl)) {
                    if ((parseFloat(item.Min) > parseFloat(item.Max))) {
                        toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(320, ['Min. Qty.', 'Max.Qty.']));
                        item.Min = item.prev_Min;
                        return;
                    }
                    else {
                        item.prev_Min = item.Min;
                    }
                }

                // if (item.Min != scope.lastFocusValue.Min || item.Max != scope.lastFocusValue.Max) {

                /* SubmitPrice.addPriceOfferItem(item, scope.priceOfferRec.id)
                    .then(function (result) {
                        //console.log(result);
                        if (result.ack == true) {
                            item.id = result.id;
                            // console.log(item);
                        }
                    }, function (error) {
                        console.log(error);
                    }); */
                // }
                // else {
                //     console.log("un-changed, item id= " + item.ItemID);
                // }
            }
            if (scope.infocusDetailsTbl.discountDetails != undefined && scope.infocusDetailsTbl.discountDetails.rows != undefined && scope.infocusDetailsTbl.discountDetails.rows.length > 0)
                 scope.onChangeCalculateDiscounts(scope.infocusDetailsTbl.discountDetails.rows, scope.infocusDetailsTbl);

        }

        scope.validateDecimalPoints = function(e, no_of_decimals) {
            if(e){
                var t = e.priceoffer.toString();
                var t1 = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), no_of_decimals+1)) : t;
                e.priceoffer = (!isNaN(t1) || t1 == "." || t1 == "-") ? Number(t1) : null;
                // e.priceoffer = parseFloat(t1);
            }
        } 
        scope.validateVolumeChangeValues = function (discounts, selectedItem) {
            var discountType = selectedItem.discountType.id;
            if (discountType == 2) // value
            {
                var discountValidation = 1;
                var minOrderValidation = 1;
                angular.forEach(discounts, function (obj) {
                    if (Number(obj.discount) >= Number(selectedItem.itemData.priceoffer)) {
                        discountValidation = 0;
                        obj.discount = '';
                        obj.Price = '';
                        obj.actualDiscount = '';
                        obj.priceOfferLCY = '';
                    }

                    if (Number(obj.Min) > 0 && Number(obj.Min) < Number(selectedItem.itemData.Min))
                        minOrderValidation = 0;
                });

                if (discountValidation && minOrderValidation)
                    return true;
                else {
                    if (!minOrderValidation) {
                        toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(609, [discounts[0].Min]));
                        selectedItem.itemData.Min = discounts[0].Min;
                    }
                    if (!discountValidation) {
                        toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(636));
                    }
                    selectedItem.discountType = scope.list_type[1];
                    return false;
                }
            }
            else {
                var discountValidation = 1;
                var minOrderValidation = 1;;
                angular.forEach(discounts, function (obj) {
                    if (Number(obj.discount) > 100) {
                        discountValidation = 0;
                        obj.discount = '';
                        obj.Price = '';
                        obj.actualDiscount = '';
                        obj.priceOfferLCY = '';
                    }

                    if (Number(obj.Min) > 0 && Number(obj.Min) < Number(selectedItem.itemData.Min))
                        minOrderValidation = 0;
                });

                if (discountValidation && minOrderValidation)
                    return true;
                else {
                    if (!minOrderValidation) {
                        toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(609, [discounts[0].Min]));
                        selectedItem.itemData.Min = discounts[0].Min;
                    }
                    if (!discountValidation) {
                        toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(636));
                    }
                    selectedItem.discountType = scope.list_type[0];
                    return false;
                }
            }
        }
        scope.onChangeCalculateDiscounts = function (discounts, selectedItem) {

            if (scope.validateVolumeChangeValues(discounts, selectedItem)) {
                for (var i = 0; i < discounts.length; i++) {
                    CalculateDiscount(discounts[i], selectedItem);

                    var price_id = 0;
                    if (selectedItem.itemData.priceID > 0) {
                        price_id = selectedItem.itemData.priceID;
                    }
                    else
                        price_id = scope.priceOfferRec.id;

                    /* SubmitPrice.addPriceOfferItemVolume(discounts[i], selectedItem.discountType.id, price_id, selectedItem.itemData.ItemID)
                        .then(function (result) {
                            console.log(result);

                            if (result.ack == true) {
                                selectedItem.id = result.id;
                            }
                        }, function (error) {
                            console.log(error);
                        }); */
                }
                return true;
            }
            else
                return false;
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

        scope.ValidatePriceOffers = function (item, currrent_item) {
            if (item.discountType.id == 1) // percentage
            {
                if (currrent_item.discount > 100) {
                    toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(610));
                    currrent_item.discount = '';
                    currrent_item.actualDiscount = '0';
                    currrent_item.Price = '0';
                    currrent_item.priceOfferLCY = '0';
                    return false;
                }
            }
            else if (item.discountType.id == 2) // value
            {
                if (currrent_item.discount > item.itemData.priceoffer) {
                    toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(611, [(item.itemData.priceoffer)])); 

                    currrent_item.discount = '';
                    currrent_item.actualDiscount = '0';
                    currrent_item.Price = '0';
                    currrent_item.priceOfferLCY = '0';
                    return false;
                }
            }

            if (item.discountDetails.rows.length <= 2) {
                for (var i = 0; i < item.discountDetails.rows.length; i++) {
                    if (item.discountDetails.rows[i].Min == '' || item.discountDetails.rows[i].Min == 0) {
                        toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(612, [(i + 1)]));
                        
                        return false;
                    }
                    else if (item.discountDetails.rows[i].discount == '') {
                        
                        return false;
                    }
                }
                if (item.discountDetails.rows.length == 2) {
                    if (parseFloat(item.discountDetails.rows[1].Min) > parseFloat(item.discountDetails.rows[0].Min)) {
                        if (parseFloat(item.discountDetails.rows[1].discount) < parseFloat(item.discountDetails.rows[0].discount)) {
                            item.discountDetails.rows[1].discount = '';
                            item.discountDetails.rows[1].actualDiscount = '0';
                            item.discountDetails.rows[1].Price = '0';
                            item.discountDetails.rows[1].priceOfferLCY = '0';

                            toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(613, [item.discountDetails.rows[0].discount]));
                            
                            return false;
                        }
                    }
                    else if (parseFloat(item.discountDetails.rows[1].Min) < parseFloat(item.discountDetails.rows[0].Min)) {
                        if (parseFloat(item.discountDetails.rows[1].discount) > parseFloat(item.discountDetails.rows[0].discount)) {
                            item.discountDetails.rows[1].discount = '';
                            item.discountDetails.rows[1].actualDiscount = '0';
                            item.discountDetails.rows[1].Price = '0';
                            item.discountDetails.rows[1].priceOfferLCY = '0';

                            toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(614, [item.discountDetails.rows[0].discount]));
                            
                            return false;
                        }
                    }
                }
            }
            else if (item.discountDetails.rows.length > 2) {
                var currentDiscountVal = currrent_item.discount;
                var currentMinOrderVal = currrent_item.Min;
                var currrentIndex = item.discountDetails.rows.indexOf(currrent_item);

                var tempArr = item.discountDetails.rows.slice();

                var closest_lesser_min_order = '0';
                var closest_higher_min_order = '100000';
                var lesser_min_order_index = '';
                var higher_min_order_index = '';


                for (var i = 0; i < tempArr.length; i++) {
                    if (parseFloat(tempArr[i].Min) < parseFloat(currentMinOrderVal)) {
                        if (parseFloat(tempArr[i].Min) > parseFloat(closest_lesser_min_order)) {
                            closest_lesser_min_order = tempArr[i].Min;
                            lesser_min_order_index = i;
                        }
                    }
                    else if (parseFloat(tempArr[i].Min) > parseFloat(currentMinOrderVal)) {
                        if (parseFloat(tempArr[i].Min) < parseFloat(closest_higher_min_order)) {
                            closest_higher_min_order = tempArr[i].Min;
                            higher_min_order_index = i;
                        }
                    }
                }
                if (closest_lesser_min_order == '0') {
                    closest_lesser_min_order = currentMinOrderVal;
                    lesser_min_order_index = currrentIndex;
                }
                else if (closest_higher_min_order == '100000') {
                    closest_higher_min_order = currentMinOrderVal;
                    higher_min_order_index = currrentIndex;
                }
                if (currrentIndex != lesser_min_order_index && currrentIndex != higher_min_order_index) {
                    if (parseFloat(currentDiscountVal) <= parseFloat(tempArr[lesser_min_order_index].discount) || parseFloat(currentDiscountVal) >= parseFloat(tempArr[higher_min_order_index].discount)) {
                        message = "Discount should be range " + tempArr[lesser_min_order_index].discount + "% and " + tempArr[higher_min_order_index].discount + "% at discount offer " + (currrentIndex + 1);
                        item.discountDetails.rows[currrentIndex].discount = '';
                        item.discountDetails.rows[currrentIndex].actualDiscount = '0';
                        item.discountDetails.rows[currrentIndex].Price = '0';
                        item.discountDetails.rows[currrentIndex].priceOfferLCY = '0';
                        toaster.pop('error', 'Info', message);
                        return false;
                    }
                }
                else {
                    if (currrentIndex == lesser_min_order_index && parseFloat(currentDiscountVal) >= parseFloat(tempArr[higher_min_order_index].discount)) {
                        message = "Discount should be less than " + tempArr[higher_min_order_index].discount + "% at discount offer " + (currrentIndex + 1);
                        item.discountDetails.rows[currrentIndex].discount = '';
                        item.discountDetails.rows[currrentIndex].actualDiscount = '0';
                        item.discountDetails.rows[currrentIndex].Price = '0';
                        item.discountDetails.rows[currrentIndex].priceOfferLCY = '0';
                        toaster.pop('error', 'Info', message);
                        return false;
                    }
                    else if (currrentIndex == higher_min_order_index && parseFloat(currentDiscountVal) <= parseFloat(tempArr[lesser_min_order_index].discount)) {
                        message = "Discount should be greater than " + tempArr[lesser_min_order_index].discount + "% at discount offer " + (currrentIndex + 1);
                        item.discountDetails.rows[currrentIndex].discount = '';
                        item.discountDetails.rows[currrentIndex].actualDiscount = '0';
                        item.discountDetails.rows[currrentIndex].Price = '0';
                        item.discountDetails.rows[currrentIndex].priceOfferLCY = '0';
                        toaster.pop('error', 'Info', message);
                        return false;
                    }
                    return true;
                }
            }
            return true;
        }

        scope.onFocusItem = function (item1) {
            scope.infocusDetailsTbl = item1;
            scope.showpriceDetails(scope.data.indexOf(item1));
        }

        function CalculateDiscount(itemVolumeRec, itemRec) {
            var netvolumeprice = 0;
            var netvolumepercentage = 0;

            var Discount = itemVolumeRec.discount;
            if (Discount == undefined || Discount == '0' || Discount == '') {
                itemVolumeRec.actualDiscount = '0';
                itemVolumeRec.Price = '0';
                itemVolumeRec.priceOfferLCY = '0';

                return false;
            }

            var discountType = itemRec.discountType.id;

            if (discountType == 1) {
                netvolumepercentage = ((parseFloat(Discount)) / 100) * itemRec.itemData.priceoffer;
                netvolumeprice = parseFloat(itemRec.itemData.priceoffer) - parseFloat(netvolumepercentage);
                itemVolumeRec.actualDiscount = netvolumepercentage;
            }
            else if (discountType == 2) {
                netvolumeprice = parseFloat(itemRec.itemData.priceoffer) - parseFloat(Discount);
                itemVolumeRec.actualDiscount = parseFloat(Discount);
            }
            itemVolumeRec.actualDiscount = itemVolumeRec.actualDiscount; // change it to default (set by user)
            netvolumeprice = netvolumeprice; // change it to default (set by user)
            itemVolumeRec.Price = netvolumeprice;
            if (scope.currencyConversionRate != undefined)
                itemVolumeRec.priceOfferLCY = (netvolumeprice / scope.currencyConversionRate);
            else
                itemVolumeRec.priceOfferLCY = netvolumeprice;

            return true;
        }
        /* scope.OnBlurPriceOffer = function(item, index)
        {
            if (item.module == 1)
            {
                if (Number(item.priceoffer) < Number(item.min_max_price))
                {
                    toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(615, [item.min_max_price]));
                    item.priceoffer = Number(item.min_max_price);
                }
            }
            else if (item.module == 2) {
                if (Number(item.priceoffer) > Number(item.min_max_price)) {
                    toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(616, [item.min_max_price]));
                    item.priceoffer = Number(item.min_max_price);
                }
            }
            scope.onBlurItem(scope.infocusDetailsTbl.itemData, 'priceoffer', index);
        } */
        scope.onBlurItemVolume = function (itemVolumeRec, param, itemRec, index) {
            if (param == 'discount') {
                if (scope.ValidatePriceOffers(itemRec, itemVolumeRec)) {
                    if (CalculateDiscount(itemVolumeRec, itemRec)) {
                        var price_id = 0;
                        if (itemRec.itemData.priceID > 0) {
                            price_id = itemRec.itemData.priceID;
                        }
                        else
                            price_id = scope.priceOfferRec.id;

                        /* SubmitPrice.addPriceOfferItemVolume(itemVolumeRec, itemRec.discountType.id, price_id, itemRec.itemData.ItemID)
                            .then(function (result) {
                                console.log(result);

                                if (result.ack == true) {
                                    itemVolumeRec.id = result.id;
                                }
                            }, function (error) {
                                console.log(error);
                            }); */
                    }
                    itemRec.discountDetails.rows.sort(predicateBy("Min"));
                }
            } else if (param == 'min') {
                if (itemVolumeRec.Min == undefined || itemVolumeRec.Min == "" || (itemVolumeRec.Min === +itemVolumeRec.Min && itemVolumeRec.Min !== (itemVolumeRec.Min | 0))) {
                    toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(617));
                    itemVolumeRec.Min = null;
                    return;
                }
                var flg = false;
                var idx1 = itemRec.discountDetails.rows.indexOf(itemVolumeRec);
                angular.forEach(itemRec.discountDetails.rows, function (discount_row, idx) {
                    if (idx != idx1 && Number(discount_row.Min) > 0 && discount_row.Min == itemVolumeRec.Min) {
                        itemVolumeRec.Min = null;
                        flg = true;
                    }
                });
                if (flg) {
                    toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(618));
                    return;
                }

                if (scope.ValidatePriceOffers(itemRec, itemVolumeRec)) {

                    if (parseFloat(itemRec.itemData.Min) == 0 || parseFloat(itemRec.itemData.Max) == 0) {
                        toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(637));
                        itemVolumeRec.Min = null;
                        return;
                    }
                    if (parseFloat(itemRec.itemData.Min) >= parseFloat(itemVolumeRec.Min)) {
                        toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(238, ['Min. Qty.', itemRec.itemData.Min]));
                        
                        itemVolumeRec.Min = null;
                        return;
                    }
                    if (parseFloat(itemRec.itemData.Max) < parseFloat(itemVolumeRec.Min)) {
                        toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(322, ['Min. Qty.', itemRec.itemData.Max]));
                        
                        itemVolumeRec.Min = null;
                        return;
                    }

                    var price_id = 0;
                    if (itemRec.itemData.priceID > 0) {
                        price_id = itemRec.itemData.priceID;
                    }
                    else
                        price_id = scope.priceOfferRec.id;

                    /* SubmitPrice.addPriceOfferItemVolume(itemVolumeRec, itemRec.discountType.id, price_id, itemRec.itemData.ItemID)
                        .then(function (result) {
                            //console.log(result);

                            if (result.ack == true) {
                                itemVolumeRec.id = result.id;
                                console.log(itemVolumeRec);
                            }
                        }, function (error) {
                            console.log(error);
                        }); */
                }
            }

            return;
        }

        scope.onFocusItemVolume = function (discountVolume) {
            scope.lastFocusVolumeValue = discountVolume;
        }

        scope.onClickAvailableDiscounts = function (index) {
            if (scope.infocusDetailsTbl.discountDetails.isDiscountAvailable)
                scope.infocusDetailsTbl.discountDetails.isDiscountAvailable = 0;
            else
                scope.infocusDetailsTbl.discountDetails.isDiscountAvailable = 1;

            scope.onBlurItem(scope.infocusDetailsTbl.itemData, 'priceoffer', index);
            /* if (scope.infocusDetailsTbl.discountDetails.length == 0)
                scope.pushNewVolumeDiscount(); */
        }

        scope.calculateLCYPrice = function (item) {
            if (item.priceoffer == undefined)
                return;

            var currency_id = 0;

            if (scope.priceOfferRec.currencys != undefined)
                currency_id = scope.priceOfferRec.currencys.id;

            if (currency_id == 0) {
                toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(230, ['Currency']));
                item.priceoffer = null;
                return;
            }

            if (currency_id == $rootScope.defaultCurrency) {

                if (item.module == 1) {
                    if (Number(item.priceoffer) < Number(item.min_max_price)) {
                        toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(615, [item.min_max_price, $rootScope.defaultCurrencyCode]));
                        item.priceoffer = Number(item.min_max_price);
                    }
                }
                else if (item.module == 2) {
                    if (Number(item.priceoffer) > Number(item.min_max_price)) {
                        toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(616, [item.min_max_price, $rootScope.defaultCurrencyCode]));
                        item.priceoffer = Number(item.min_max_price);
                    }
                }

                item.priceoffer = parseFloat(item.priceoffer);

                var newPrice = 0;


                // if (item.arr_unit_of_measure) {

                //     if (item.UOM.unit_id != item.UOM.ref_unit_id)
                //         newPrice = parseFloat(item.priceoffer) * item.UOM.ref_quantity;
                //     else
                //         newPrice = parseFloat(item.priceoffer) * item.UOM.quantity;
                // } 
                // else
                //     newPrice = parseFloat(item.priceoffer);

                /* if (item.UOM) {

                    angular.forEach(item.arr_unit_of_measure,function(rec){
                        if(rec.id == item.UOM.id ){//&& item.UOM.ref_unit_id > item.UOM.unit_id
                            item.StdPrice = parseFloat(item.StdPrice2) * parseFloat(rec.ref_quantity);
                            item.StdPricelCY = parseFloat(item.StdPricelCY2) * parseFloat(rec.ref_quantity);
                        }
                    });
                }  */               
                
                newPrice = parseFloat(item.priceoffer);

                item.converted_price = parseFloat(newPrice);
                item.lCY = parseFloat(newPrice);
                // item.StdPrice = parseFloat(newPrice);
                // item.StdPricelCY = parseFloat(newPrice);

                /* if ((parseFloat(item.maxPurchasePriceLCY) > 0) && (newPrice > parseFloat(item.maxPurchasePriceLCY))) {
                    
                    item.priceoffer = null;
                    item.converted_price = null;
                    item.lCY = null;
                    return;
                } */
            } else {
                var currencyURL = $rootScope.sales + "customer/customer/get-currency-conversion-rate";
                $http
                    .post(currencyURL, {
                        'id': scope.priceOfferRec.currencys.id,
                        'token': $rootScope.token
                    })
                    .then(function (res) {
                        if (res.data.ack == true) {
                            if (res.data.response.conversion_rate == null) {
                                toaster.pop('error', 'Info',$rootScope.getErrorMessageByCode(230,['Currency Conversion Rate']));
                                item.priceoffer = null;
                                item.converted_price = null;
                                item.lCY = null;
                                return;
                            }
                            //console.log(item);

                            var new_price = "";

                            if (item.module == 1) {
                                if ((Number(item.priceoffer) / Number(res.data.response.conversion_rate)) < Number(item.min_max_price)) {
                                    toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(615, [item.min_max_price, $rootScope.defaultCurrencyCode]));
                                    item.priceoffer = Number(item.min_max_price) * Number(res.data.response.conversion_rate);
                                }
                            }
                            else if (item.module == 2) {
                                if ((Number(item.priceoffer) / Number(res.data.response.conversion_rate)) > Number(item.min_max_price)) {
                                    toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(616, [item.min_max_price, $rootScope.defaultCurrencyCode]));
                                    item.priceoffer = Number(item.min_max_price) * Number(res.data.response.conversion_rate);
                                }
                            }

                            if (item.UOM != undefined) {

                                if (item.UOM.unit_id != item.UOM.ref_unit_id)
                                    newPrice = parseFloat(item.priceoffer) / item.UOM.ref_quantity;
                                else
                                    newPrice = parseFloat(item.priceoffer) / item.UOM.quantity;
                            } else
                                newPrice = parseFloat(item.priceoffer);

                            /* if (item.UOM) {

                                angular.forEach(item.arr_unit_of_measure,function(rec){
                                    if(rec.id == item.UOM.id){
                                        item.StdPrice = parseFloat(item.StdPrice2) * parseFloat(rec.ref_quantity);
                                        item.StdPricelCY = parseFloat(item.StdPricelCY2) * parseFloat(rec.ref_quantity);
                                    }
                                });
                            } */


                            /* if (scope.priceOfferRec.currencys != undefined) {

                                if (scope.priceOfferRec.currencys.id != $rootScope.defaultCurrency)
                                    newPrice = parseFloat(newPrice) / parseFloat(res.data.response.conversion_rate);
                                else
                                    newPrice = parseFloat(newPrice);
                            } */
                            newPrice = parseFloat(newPrice) / parseFloat(res.data.response.conversion_rate);
                            item.lCY = parseFloat(newPrice);
                            if (scope.infocusDetailsTbl.discountDetails != undefined && scope.infocusDetailsTbl.discountDetails.rows != undefined && scope.infocusDetailsTbl.discountDetails.rows.length > 0)
                                scope.onChangeCalculateDiscounts(scope.infocusDetailsTbl.discountDetails.rows, scope.infocusDetailsTbl);

                            /* if ((parseFloat(item.maxPurchasePriceLCY) > 0) && (newPrice > parseFloat(item.maxPurchasePriceLCY))) {
                                
                                item.priceoffer = null;
                                item.converted_price = null;
                                item.lCY = null;
                                return;
                            } */
                        } else {
                            toaster.pop('error', 'Info',$rootScope.getErrorMessageByCode(230,['Currency Conversion Rate']));
                            item.priceoffer = null;
                            item.lCY = null;
                        }
                    });
            }
        }

        scope.showpriceDetails = function (index) {
            if (scope.data.length) {
                scope.infocusDetailsTbl = scope.data[index];
                scope.selectedRow = index;
                scope.selecteditem = scope.data[index];
                if (scope.selecteditem.discountType == undefined) {
                    scope.selecteditem.discountType = scope.list_type[0];
                }
            }
        }

        scope.removePriceItem = function (index, itemDataArr) {

            ngDialog.openConfirm({
                template: 'modalDeleteDialogId',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                scope.data.splice(index, 1);
                if (index <= scope.data.length - 1)
                    scope.showpriceDetails(index);
                else
                    scope.showpriceDetails(0);

                var item = $filter("filter")(scope.tempProdArr, { id: itemDataArr.ItemID });
                var idx = scope.tempProdArr.indexOf(item[0]);
                scope.tempProdArr.splice(idx, 1);              

                // remove from 
                SubmitPrice.deletePriceOfferItem(itemDataArr, scope.priceOfferRec.id)
                    .then(function (result) {
                        if (result.ack == true) {
                            //item.id = result.id;
                        }
                    }, function (error) {
                        console.log(error);
                    });
                /* ================ */

            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });

        }

        scope.removePriceItemVolume = function (index, volItemID) {
            ngDialog.openConfirm({
                template: 'modalDeleteDialogId',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                scope.infocusDetailsTbl.discountDetails.rows.splice(index, 1);
                scope.infocusDetailsTbl.discountDetails.isDiscountAvailable = scope.infocusDetailsTbl.discountDetails.rows.length;

                SubmitPrice.deletePriceOfferVolumeItem(volItemID)
                    .then(function (result) {
                        if (result.ack == true) {
                            //item.id = result.id;
                        }
                    }, function (error) {
                        console.log(error);
                    });
                /* ================ */

            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
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

                    scope.showpriceDetails(scope.selectedRow);
                    scope.$apply();
                    e.preventDefault();
                }
                if (e.keyCode == 40) {
                    if (scope.selectedRow == scope.data.length - 1) {
                        scope.selectedRow = 0
                    }
                    else
                        scope.selectedRow++;
                    scope.showpriceDetails(scope.selectedRow);
                    scope.$apply();
                    e.preventDefault();
                }

            }
        });


        //  Additional Cost Setup


        scope.pushNewVolumeDiscount = function () {

            var selecteditem = scope.infocusDetailsTbl;
            var itemDiscount = scope.infocusDetailsTbl.discountDetails;
            if (selecteditem != undefined) {
                if (selecteditem.discountType != undefined) {
                    if (!selecteditem.discountType.id > 0) {
                        toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(230, ['Discount Type']));
                        return;
                    }
                }
            }
            for (var i = 0; i < selecteditem.discountDetails.rows.length; i++) {
                if (selecteditem.discountDetails.rows[i].discount == '' || selecteditem.discountDetails.rows[i].discount == '0' ||
                    selecteditem.discountDetails.rows[i].Min == '' || selecteditem.discountDetails.rows[i].Min == '0') {
                    toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(519));
                    
                    return;
                }
            }

            itemDiscount.rows.push({
                'Discount': '0',
                'Price': 0,
                'Min': 0,
                'actualDiscount': 0,
                'priceOfferLCY': '0',
                'id': 0
            });
        }

        scope.pushNewAdditionalCosts = function () {

            var selecteditem = scope.infocusDetailsTbl;
            var itemAdditionalCost = scope.infocusDetailsTbl.additionalCosts;

            // console.log(selecteditem);
            // console.log(itemAdditionalCost);
        }


        scope.onClickAvailableAdditionalCosts = function (index, itemDataArr) {

            // console.log(itemDataArr.UOM.name);
            // console.log(scope.priceOfferRec.currencys.code);

            if (scope.infocusDetailsTbl.additionalCosts.isDiscountAvailable > 1)
                scope.infocusDetailsTbl.additionalCosts.isDiscountAvailable = 0;
            else
                scope.infocusDetailsTbl.additionalCosts.isDiscountAvailable = 1;

            scope.enablePurchaseCostForm = 0;
            scope.UOMName = itemDataArr.UOM.name;

            // scope.ItemName = itemDataArr.Item + ' - ' + itemDataArr.Description;
            scope.ItemName = itemDataArr.Description + ' (' + itemDataArr.Item + ') - ';

            if (scope.priceOfferRec.currencys != undefined)
                scope.currencyCode = scope.priceOfferRec.currencys.code;

            scope.arr_currency = $rootScope.arr_currency;

            angular.forEach($rootScope.arr_currency, function (obj) {

                if (obj.id == scope.priceOfferRec.currencys.id)
                    scope.recAdditionalCost.currencys = obj;
            });


            // console.log(scope.recAdditionalCost);
            // console.log(scope.priceOfferRec.currencys);
            // console.log($rootScope.arr_currency);

            SubmitPrice.getallItemAdditionalCost()
                .then(function (result) {
                    scope.itemAdditionalCostArr = [];
                    if (result == false) {
                        toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(400));
                    } else {
                        scope.itemAdditionalCostArr = result;
                        // console.log(result);
                        // angular.element('#finance_set_gl_account').modal({ show: true });
                    }
                }, function (error) {
                    console.log(error);
                });

            // scope.onBlurItem(scope.infocusDetailsTbl.itemData, 'priceoffer', index);

            if (scope.infocusDetailsTbl.additionalCosts.length == 0)
                scope.pushNewAdditionalCosts();

            angular.element('#add_purchase_cost_detail').modal({ show: true });
        }

        scope.openPurchaseCostForm = function () {
            scope.enablePurchaseCostForm = 1;
        }

        scope.glaccounts = function () {
            scope.title = 'G/L No.';
            scope.filterGL = {};

            SubmitPrice.getallGLaccounts()
                .then(function (result) {
                    scope.gl_account = [];
                    if (result == false) {
                        toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(400));
                    } else {
                        scope.gl_account = result;
                        angular.element('#finance_set_gl_account').modal({ show: true });
                    }
                }, function (error) {
                    console.log(error);
                });
        }

        scope.assignCodes = function (gl) {
            // console.log(gl);
            scope.recAdditionalCost.cost_gl_code = gl.code + "-" + gl.name;
            scope.recAdditionalCost.cost_gl_code_id = gl.id;
            angular.element('#finance_set_gl_account').modal('hide');
        }

        scope.closeGLAccountModal = function () {
            angular.element('#finance_set_gl_account').modal('hide');
        }
        scope.recAdditionalCost = {};

        scope.add_purchase_cost_detail = function (recAdditionalCost, itemRec) {
            // console.log(recAdditionalCost);
            // console.log(itemRec);

            var price_id = 0;
            if (itemRec.itemData.priceID > 0) {
                price_id = itemRec.itemData.priceID;
            }
            else
                price_id = scope.priceOfferRec.id;

            // console.log(price_id);

            if (recAdditionalCost.descriptionID == undefined) {
                toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(230, ['Item Additional Cost']));
                return false;
            }
            else if (!(recAdditionalCost.descriptionID.id > 0)) {
                toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(230, ['Item Additional Cost']));
                return false;
            }

            if (!(recAdditionalCost.cost > 0)) {
                toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(230, ['Cost']));
                return false;
            }
            else if (!(recAdditionalCost.cost_gl_code_id > 0)) {
                toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(230, ['G/L Account']));
                return false;
            }

            if (recAdditionalCost.currencys == undefined) {
                toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(230, ['Currency']));
                return false;
            }
            else if (!(recAdditionalCost.currencys.id > 0)) {
                toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(230, ['Currency']));
                return false;
            }


            recAdditionalCost.descriptionIDs = recAdditionalCost.descriptionID.id;
            recAdditionalCost.currencyID = recAdditionalCost.currencys.id;
            recAdditionalCost.currencyCode = recAdditionalCost.currencys.code;
            recAdditionalCost.iacid = recAdditionalCost.descriptionID.id;
            recAdditionalCost.descriptionName = recAdditionalCost.descriptionID.name;
            // recAdditionalCost.description = recAdditionalCost.descriptionID.title;

            recAdditionalCost.startDate = scope.priceOfferRec.offer_date;
            recAdditionalCost.endDate = scope.priceOfferRec.offer_valid_date;
            recAdditionalCost.moduleID = scope.priceOfferRec.moduleID;
            recAdditionalCost.moduleType = scope.priceOfferRec.moduleType;

            SubmitPrice.addPriceListAdditionalCost(recAdditionalCost, price_id, itemRec.itemData.ItemID)
                .then(function (result) {

                    if (result.ack == true) {

                        scope.additionalCostsArray = [];

                        // console.log(result);

                        if (recAdditionalCost.id > 0) {
                            // console.log(scope.infocusDetailsTbl.additionalCosts.rows);

                            angular.forEach(scope.infocusDetailsTbl.additionalCosts.rows, function (obj) {

                                if (obj.id == recAdditionalCost.id)
                                    obj = recAdditionalCost;

                                // console.log(obj);

                                scope.singleSelectedAdditionalCosts = {};
                                scope.singleSelectedAdditionalCosts.cost = parseFloat(obj.cost);

                                // scope.singleSelectedAdditionalCosts.description = obj.description;


                                angular.forEach(scope.itemAdditionalCostArr, function (obj2) {
                                    if (obj2.id == obj.iacid) {
                                        scope.singleSelectedAdditionalCosts.descriptionIDs = obj2.id;
                                        scope.singleSelectedAdditionalCosts.iacid = obj2.id;
                                        scope.singleSelectedAdditionalCosts.description = obj2.name;
                                        // scope.singleSelectedAdditionalCosts.description = obj2.title;
                                    }
                                });

                                // console.log(scope.itemAdditionalCostArr);

                                if (obj.descriptionID != undefined) {

                                    if (obj.descriptionID.name != undefined)
                                        scope.singleSelectedAdditionalCosts.description = obj.descriptionID.name;
                                    else if (obj.descriptionName != undefined)
                                        scope.singleSelectedAdditionalCosts.description = obj.descriptionName;
                                    else
                                        scope.singleSelectedAdditionalCosts.description = obj.description;

                                    // scope.singleSelectedAdditionalCosts.description = obj.descriptionID.title;
                                    scope.singleSelectedAdditionalCosts.descriptionID = obj.descriptionIDs;
                                    scope.singleSelectedAdditionalCosts.iacid = obj.descriptionID.id;
                                }

                                scope.singleSelectedAdditionalCosts.currencyID = obj.currencyID;
                                scope.singleSelectedAdditionalCosts.currencyCode = obj.currencyCode;

                                scope.singleSelectedAdditionalCosts.cost_gl_code = obj.cost_gl_code;

                                scope.singleSelectedAdditionalCosts.cost_gl_code_id = obj.cost_gl_code_id;
                                scope.singleSelectedAdditionalCosts.id = obj.id;

                                // console.log(scope.singleSelectedAdditionalCosts);

                                scope.additionalCostsArray.push(scope.singleSelectedAdditionalCosts);
                            });
                        }
                        else {
                            recAdditionalCost.id = result.id;
                            // console.log(recAdditionalCost);

                            if (recAdditionalCost.descriptionID.name != undefined)
                                recAdditionalCost.description = recAdditionalCost.descriptionID.name;
                            else if (recAdditionalCost.descriptionName != undefined)
                                recAdditionalCost.description = recAdditionalCost.descriptionName;

                            scope.infocusDetailsTbl.additionalCosts.rows.push(recAdditionalCost);
                        }


                        if (scope.additionalCostsArray.length > 0) {
                            scope.infocusDetailsTbl.additionalCosts.rows = [];
                            scope.infocusDetailsTbl.additionalCosts.rows = scope.additionalCostsArray;
                            // console.log(scope.infocusDetailsTbl.additionalCosts.rows);
                        }
                        scope.recAdditionalCost = {};

                        angular.forEach($rootScope.arr_currency, function (obj) {

                            if (obj.id == scope.priceOfferRec.currencys.id)
                                scope.recAdditionalCost.currencys = obj;
                        });

                        scope.activeAddCost = 0;
                    }
                    else {
                        // toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(107));
                        toaster.pop('error', 'Info', result.error);

                        scope.recAdditionalCost = {};

                        angular.forEach($rootScope.arr_currency, function (obj) {

                            if (obj.id == scope.priceOfferRec.currencys.id)
                                scope.recAdditionalCost.currencys = obj;
                        });

                        scope.activeAddCost = 0;
                        
                        return false;
                    }
                }, function (error) {
                    console.log(error);
                });


            // console.log(scope.infocusDetailsTbl);
            scope.enablePurchaseCostForm = 0;
            return false;
        }

        scope.removePriceAdditionalCost = function (index, AdditionalCostID) {
            ngDialog.openConfirm({
                template: 'modalDeleteDialogId',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                
                // scope.infocusDetailsTbl.discountDetails.isDiscountAvailable = scope.infocusDetailsTbl.discountDetails.rows.length;

                SubmitPrice.deletePriceListAdditionalCost(AdditionalCostID)
                    .then(function (result) {
                        if (result.ack == true) {
                            //item.id = result.id;
                            scope.recAdditionalCost = {};

                            scope.infocusDetailsTbl.additionalCosts.rows.splice(index, 1);

                            angular.forEach($rootScope.arr_currency, function (obj) {

                                if (obj.id == scope.priceOfferRec.currencys.id)
                                    scope.recAdditionalCost.currencys = obj;
                            });

                            scope.activeAddCost = 0;
                        }
                    }, function (error) {
                        console.log(error);
                    });
                /* ================ */

            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
        }

        scope.activeAddCost = 0;

        scope.editPriceAdditionalCost = function (additionalCost,indexNo) {

            scope.recAdditionalCost = {};
            scope.recAdditionalCost.cost = parseFloat(additionalCost.cost);
            scope.activeAddCost = additionalCost.id;

            if (additionalCost.iacid != undefined) {

                angular.forEach(scope.itemAdditionalCostArr, function (obj) {

                    if (obj.id == additionalCost.iacid)
                        scope.recAdditionalCost.descriptionID = obj;
                });
            } else {
                angular.forEach(scope.itemAdditionalCostArr, function (obj) {

                    if (obj.id == additionalCost.descriptionID)
                        scope.recAdditionalCost.descriptionID = obj;
                });
            }

            angular.forEach($rootScope.arr_currency, function (obj) {

                if (obj.id == additionalCost.currencyID)
                    scope.recAdditionalCost.currencys = obj;
            });

            scope.recAdditionalCost.description = additionalCost.description;
            scope.recAdditionalCost.cost_gl_code_id = additionalCost.cost_gl_code_id;
            scope.recAdditionalCost.cost_gl_code = additionalCost.cost_gl_code;
            scope.recAdditionalCost.id = additionalCost.id;
            scope.recAdditionalCost.indexNo = indexNo;
        }

        scope.getTotal = function () {

            // console.log(scope.infocusDetailsTbladditionalCosts);
            // console.log(scope.infocusDetailsTbl.additionalCosts.rows);
            var totalReturn = 0;
            if (scope.infocusDetailsTbl.additionalCosts != undefined) {
                angular.forEach(scope.infocusDetailsTbl.additionalCosts.rows, function (obj) {
                    totalReturn += parseFloat(obj.cost);
                });
            }
            return totalReturn;
        }
    }
}]);
