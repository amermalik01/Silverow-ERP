CrmPromotionController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];

myApp.controller('CrmPromotionController', CrmPromotionController);
myApp.controller('CrmPromotionAddController', CrmPromotionAddController);

function CrmPromotionController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams) {

    'use strict';

    $scope.module_id = 41;
    $scope.filter_id = 125;
    $scope.module_table = 'crm_promotions';
    $scope.more_fields = 'null';
    $scope.condition = 0;
    $scope.sendRequest = false;

    if ($scope.$root.crm_id > 0)
        $scope.postData = {'column': 'crm_id', 'value': $scope.$root.crm_id, token: $scope.$root.token}

    $scope.MainDefer = null;
    $scope.mainParams = null;
    $scope.mainFilter = null;
    $scope.more_fields = 'crm_id';


    $scope.count = 1;
    var vm = this;

    var ApiAjax = $scope.$root.sales + "crm/crm/promotions";

    $scope.$on("myCrmPromotionEventReload", function (event, args) {
        $scope.sendRequest = true;
        if (args != undefined) {
            if (args[1] != undefined)
                $scope.detail(args[1]);
            $scope.postData = {'column': 'crm_id', 'value': args[0], token: $scope.$root.token}
            $scope.$root.crm_id = args[0];
        }
        $scope.count = $scope.count + 1;
        //ngDataService.getDataCustom(  $scope.MainDefer, $scope.mainParams, ApiAjax,$scope.mainFilter,$scope,$scope.postData);

        //$scope.table.tableParams5.reload();
        $scope.get_promotion();
    });

    $scope.details = function (id) {
        $timeout(function () {
            if ($scope.$root.lblButton == 'Add New') {
                $scope.$root.lblButton = 'Edit';
            }
        }, 100);

        $scope.$root.tabHide = 0;
        $scope.$root.$broadcast("openCrmPromotionFormEvent", {'edit': false, id: id});
    }

    $scope.editForm = function (id) {
        $scope.$root.$broadcast("openCrmPromotionFormEvent", {'edit': true, id: id});
    }


    $scope.$watch("MyCustomeFilters", function () {
        if ($scope.MyCustomeFilters && $scope.table.tableParams5) {
            $scope.table.tableParams5.reload();
        }
    }, true);

    $scope.MyCustomeFilters = {}

    vm.tableParams5 = new ngParams({
        page: 1,            // show first page
        count: $scope.$root.pagination_limit,           // count per page
        filter: {
            name: '',
            age: ''
        }
    }, {
        total: 0,           // length of data
        counts: [],         // hide page counts control

        getData: function ($defer, params) {
            /* 	if($scope.$root.crm_id > 0 && $scope.sendRequest == true)
             ngDataService.getDataCustomAjax( $defer, params, ApiAjax,$filter,$scope,'crm_promotions',$scope.postData);
             $scope.MainDefer = $defer;
             $scope.mainParams = params;
             $scope.mainFilter = $filter;*/
            $scope.get_promotion();
        }
    });
    $scope.get_promotion = function () {

        $http
            .post(ApiAjax, $scope.postData)
            .then(function (res) {
                $scope.columns = [];
                $scope.record_data = {};
                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.record_data = res.data.response;//res.data.record.result ;

                    angular.forEach($scope.record_data[0], function (val, index) {
                        if (index != 'chk' && index != 'id') {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }

                    });

                }
                //else     toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(400));
            });
    }


    $scope.$data = {};
    $scope.delete = function (id, index, $data) {
        var delUrl = $scope.$root.sales + "crm/crm/delete-promotion";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {id: id, 'token': $scope.$root.token})
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $rootScope.getErrorMessageByCode(103));
                        $data.splice(index, 1);
                    }
                    else {
                        toaster.pop('error', 'Deleted', $rootScope.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

}

function CrmPromotionAddController($scope, $stateParams, $http, $state, $resource, toaster, $timeout, Upload, ngDialog, $rootScope) {

    $scope.$root.tabHide = 0;
    $scope.$root.lblButton = 'Add New';
    $scope.check_readonly = 0;
    $scope.check_files = 0;
    $scope.showProducts = false;
    $scope.files = {};
    $scope.wordsLength = 0;
    $scope.record = {};
    $scope.products = {};
    $scope.recs = {};

    $scope.showCrmPromotionListing = function () {
        $scope.$root.$broadcast("showCrmPromotionListing");
        $scope.resetForm($scope.rec);
    }

    $scope.showCrmPromotionEditForm = function () {
        $scope.check_readonly = false;
    }

    $scope.$on("showAddCrmPromotionForm", function () {
        $scope.check_readonly = false;
        $scope.showItms = true;
        $scope.showServ = true;
        $scope.products = null;
        $scope.resetForm();
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        ;
        var day = d.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        ;

        /*if($rootScope.defaultDateFormat == $rootScope.dtYMD)
         $scope.rec.starting_date= year + "/" + month + "/" + day;
         if($rootScope.defaultDateFormat == $rootScope.dtMDY)
         $scope.rec.starting_date= month + "/" + day + "/" + year;
         if($rootScope.defaultDateFormat == $rootScope.dtDMY)
         $scope.rec.starting_date= day + "/" + month + "/" + year;*/


    });

    $scope.rec = {};
    $scope.list_type = [{'name': 'Percentage', 'id': 1}, {'name': 'Value', 'id': 2}];

    $scope.$on("openCrmPromotionFormEvent", function (event, arg) {
        $scope.showItms = true;
        $scope.showServ = true;
        $timeout(function () {
            $scope.resetForm();
            var id = arg.id;
            if (arg.edit == false)
                $scope.check_readonly = true;
            else
                $scope.check_readonly = false;
            $scope.$root.$broadcast("showCrmPromotionForm");
            var promoUrl = $scope.$root.sales + "crm/crm/get-promotion";
            $scope.rec = {};
            $http
                .post(promoUrl, {id: id, 'token': $scope.$root.token})
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.rec = res.data.response;
                        $scope.wordsLength = res.data.response.description.length;
                        $scope.$root.$broadcast("myShowProductsEventReload", {
                            id: id,
                            name: 'name',
                            discount_type: res.data.response.discount_type,
                            discount_value: res.data.response.discount
                        });


                        if (res.data.response.discount_type_id == 'Percentage')
                            $scope.show_symbol = true;


                        $scope.rec.update_id = res.data.response.id;
                        $scope.rec.old_file = res.data.response.file;
                        $.each($scope.arr_discount_type, function (index, elem) {
                            if (elem.id == res.data.response.discount_type) {
                                $scope.rec.discount_type_id = elem;
                            }
                        });
                        if (res.data.response.file) {
                            $scope.files[0] = {
                                id: res.data.response.id,
                                file_title: res.data.response.file_title,
                                file: res.data.response.file
                            };
                            $scope.check_files = 1;
                            $scope.check_file = 0;
                        }

                        // promotion products
                        $scope.products = {};
                        if (res.data.response.type == 1) {
                            $scope.showItms = true;
                            $scope.showServ = false;
                            var prodApi = $scope.$root.sales + "stock/products-listing/get-products-popup";
                            $http
                                .post(prodApi, $scope.postData)
                                .then(function (res) {
                                    if (res.data.ack == true) {
                                        $scope.products = [];
                                        $.each(res.data.response, function (index, obj) {
                                            obj.chk = false;
                                            $scope.products[index] = obj;
                                        });
                                    }

                                });
                        }

                        if (res.data.response.type == 2) {
                            $scope.showItms = false;
                            $scope.showServ = true;
                            var prodApi = $scope.$root.setup + "service/products-listing/get-products-popup";
                            $http
                                .post(prodApi, $scope.postData)
                                .then(function (res) {
                                    if (res.data.ack == true) {
                                        $scope.products = [];
                                        $.each(res.data.response, function (index, obj) {
                                            obj.chk = false;
                                            $scope.products[index] = obj;
                                        });
                                    }

                                });
                        }

                        $timeout(function () {
                            var promoProdUrl = $scope.$root.sales + "crm/crm/get-promotion-products";
                            $http
                                .post(promoProdUrl, {
                                    id: res.data.response.id,
                                    type: res.data.response.type,
                                    'token': $scope.$root.token
                                })
                                .then(function (res) {
                                    if (res.data.ack == true) {
                                        $.each($scope.products, function (indx1, obj1) {
                                            $.each(res.data.response, function (indx2, obj2) {
                                                if (obj1.id == obj2.id)
                                                    $scope.products[indx1].chk = true;
                                            });
                                        });
                                    }
                                });
                        }, 2000);
                    }
                });

        }, 100);

    });

    $scope.starteDate = function (startDate) {
        var newdate = startDate;
        $scope.newD = $scope.newD ? null : newdate;
        $scope.starteDate = false;
    }


    /************** Calendar *********************/

    $scope.datePicker = (function () {
        var method = {};
        method.instances = [];
        $scope.toggleMin = function () {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin()
        method.open = function ($event, instance) {
            $event.preventDefault();
            $event.stopPropagation();

            method.instances[instance] = true;
        };

        method.options = {
            'show-weeks': false,
            startingDay: 0
        };

        method.format = $scope.$root.dateFormats[$scope.$root.defaultDateFormat];

        return method;
    }());
    /******************************************/


    $scope.check_file = 0;
    $scope.org_files = {};

    $scope.onFileSelect = function ($files) {

        $scope.check_files = 1;
        $scope.files = [];
        $scope.org_files = $files;
        $scope.str_files = [];


        $timeout(function () {
            angular.forEach($files, function (file, key) {
                $scope.files.push({file: file.name, index: key});
                //$scope.str_files.push({name:file.name,index:key});
                /*$scope.comp_files.push({file:file.name,index:key});
                 $scope.temp_files.push(file.name);*/

            });
            //document.getElementById("uploadFile").value = $scope.temp_files;
        }, 100)
    };
    $scope.files = [];
    $scope.resetForm = function (rec) {
        $scope.files = [];
        $scope.str_files = [];
        $scope.temp_files = [];
        $scope.comp_files = [];
        $scope.check_file = 0;
        $scope.check_files = 0;
        $scope.rec.discount_type_id = '';
        $scope.rec = {};
        //document.getElementById("uploadCrmPromotionFile").value = '';
        $scope.rec = {};
        $scope.brands = '';
        $scope.products = {};
        /*<!--angular.element("input[type='file']").val(null);-->*/
    }

    // force download file
    var content = 'file content';
    var blob = new Blob([content], {type: '*'});
    $scope.url = (window.URL || window.webkitURL).createObjectURL(blob);


    /*$scope.onFileSelect = function($files) {
     $scope.check_file = 1;
     $scope.files=[];
     $scope.files = $files;
     $scope.str_files = [];
     $scope.temp_files = [];
     $timeout(function(){
     angular.forEach($scope.files,function(file,key){
     $scope.str_files.push({name:file.name,index:key});
     $scope.temp_files.push(file.name);

     });
     //	document.getElementById("uploadCrmPromotionFile").value = $scope.temp_files;
     },100)
     };*/

    $scope.removeFile = function (index) {
        $scope.files.splice(index, 1);
        $scope.str_files.splice(index, 1);
        $scope.temp_files.splice(index, 1);
        //document.getElementById("uploadCrmPromotionFile").value = $scope.temp_files;
        if ($scope.temp_files.length < 1) {
            $scope.check_file = 0;
            $scope.files = [];
        }
    }


    $scope.rec = {};

    $scope.add = function (rec) {
        var addUrl = $scope.$root.sales + "crm/crm/add-promotion";
        /*$scope.date1=rec.starting_date;
         $scope.date2=rec.ending_date;
         if($scope.date2 < $scope.date1){
         toaster.pop('error', 'Invalid Date', 'Please Select a valid date', '');
         }
         else{

         angular.forEach($scope.files,function(file,key){
         $scope.new_files_title[key] = file.file_title;
         });*/

        rec.file_title = $scope.files[0] != undefined ? $scope.files[0].file_title : '';
        rec.new_file_titles = $scope.new_files_title;
        rec.discount_type = rec.discount_type_id != undefined ? rec.discount_type_id.id : 0;
        rec.crm_id = $scope.$root.crm_id;
        rec.token = $scope.$root.token;

        if (rec.discount <= 0)
            return false;

        if (rec.update_id != undefined)
            addUrl = $scope.$root.sales + "crm/crm/update-promotion";

        $scope.upload = Upload.upload({
            url: addUrl,
            method: 'POST',
            headers: {'header-key': '83c238df1650bccb2d1aa4495723c63f07672ee8'},
            withCredentials: true,
            data: rec,
            file: $scope.org_files != undefined ? $scope.org_files[0] : '',
        }).progress(function (evt) {
            console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
        }).success(function (res, status, headers, config) {
            if (res.ack == true || res.edit == true) {

                $scope.$root.lblButton = 'Add New';
                if (rec.update_id != undefined)
                    toaster.pop('success', 'Edit', $rootScope.getErrorMessageByCode(102));
                else {
                    toaster.pop('success', 'Info', $rootScope.getErrorMessageByCode(101));
                    $scope.rec.update_id = res.id;
                    $scope.rec.id = res.id;
                    //$scope.resetForm(rec);
                    //$scope.$root.$broadcast("showCrmPromotionListing");
                }
                var args = [];
                args[0] = $scope.$root.crm_id;
                args[1] = undefined;
                $scope.$root.$broadcast("myCrmPromotionEventReload", args);

                /*$timeout(function() {
                 angular.element('.accordion-toggle').trigger('click');
                 }, 100);*/
            }
            else {
                if (rec.update_id != undefined)
                    toaster.pop('error', 'Edit', res.data.error);
                //toaster.pop('error', 'Edit', $rootScope.getErrorMessageByCode(106));
                else
                    toaster.pop('error', 'Add', res.data.error);
                //toaster.pop('error', 'Add',$rootScope.getErrorMessageByCode(104));
            }

        });

    }

    $scope.resetForm = function (rec) {
        $scope.files = [];
        $scope.str_files = [];
        $scope.temp_files = [];
        $scope.comp_files = [];
        $scope.check_file = 0;
        $scope.check_files = 0;
        $scope.rec = {};
        $scope.brands = '';
        angular.element("input[type='file']").val(null);
    }

    $scope.closeTab = function () {
        $scope.$root.tabHide = 1;
    }
    $scope.togleTab = function (rec) {
        $scope.resetForm(rec);
        $scope.$root.lblButton = 'Add New';
        $scope.$root.tabHide = 0;
        $timeout(function () {
            angular.element('.accordion-toggle').trigger('click');
        }, 100);
    }

    /*$scope.addProducts = function(id, name,discount_type,discount){
     var catUrl = $scope.$root.stock+"categories";
     $http
     .post(catUrl, {all:'1','token': $scope.$root.token})
     .then(function (res) {
     $scope.arr_categories = res.data.response;
     });

     $scope.$root.$broadcast("myShowProductsEventReload", {id:id,name:name,discount_type:discount_type,discount_value:discount});
     $scope.$root.$broadcast("showCrmPrmoProduct");
     }*/

    $scope.delete = function (id) {

        ngDialog.openConfirm({

            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {

            $http
                .post('api/company/delete', {
                    id: id,
                    table: 'crm_promotions',
                    folder_name: 'crm_promotions',
                    field_name: 'file'
                })
                .then(function (res) {
                    if (res.data == true) {
                        /*$scope.$root.tabHide = 1;*/
                        $timeout(function () {
                            $scope.resetForm($scope.rec);
                            angular.element('.accordion-toggle').trigger('click');
                        }, 100);
                        toaster.pop('success', 'Deleted', $rootScope.getErrorMessageByCode(103));
                        var args = [];
                        args[0] = $scope.$root.crm_id;
                        args[1] = undefined;
                        $scope.$root.$broadcast("myCrmPromotionEventReload", args);
                    }
                    else {
                        toaster.pop('error', 'Deleted', $rootScope.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

        //if(popupService.showPopup('Would you like to delete?')) {

        //  }*/
    };


    $scope.viewFile = function (id) {
        window.open(
            'api/crm_promotion_doc_view.php?id=' + id,
            '_blank' // <- This is what makes it open in a new window.
        );
    }

    $scope.show_symbol = false;
    $scope.setSymbol = function () {
        var id = this.rec.discount_type_id.id;
        if (id == 'Percentage')
            $scope.show_symbol = true;
        else
            $scope.show_symbol = false;
    }

    $scope.showWordsLimits = function () {
        $scope.wordsLength = $scope.rec.description.length;
    }


    $scope.getProducts = function (recs, parm, type, item_paging) {
        $scope.record = {};
        $scope.rec.type = 1;
        var getListUrl = $scope.$root.sales + "stock/categories";
        $http
            .post(getListUrl, {'token': $scope.$root.token})
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.arr_categories = {};
                    $scope.arr_categories = res.data.response;
                }
            });

        var cat_id = '';
        if (parm != '') {
            $scope.postData = {'all': "1", token: $scope.$root.token};
            recs.category = '';
            recs.search_data = '';
        }
        else {
            cat_id = recs.category != null ? recs.category.id : '';
            $scope.search_data = recs.search_data;
            $scope.postData = {
                'search_string': $scope.search_data,
                'category_id': cat_id,
                'all': "1",
                token: $scope.$root.token
            };
        }

        $scope.record = {};
        var prodApi = $scope.$root.sales + "stock/products-listing/get-products-popup";

        if (item_paging == 1)$rootScope.item_paging.spage = 1;

        $scope.postData.page = $rootScope.item_paging.spage;
        $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;
        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.selection_record = {};
        }

        $http
            .post(prodApi, $scope.postData)
            .then(function (res) {
                $scope.total = res.data.total;
                $scope.item_paging.total_pages = res.data.total_pages;
                $scope.item_paging.cpage = res.data.cpage;
                $scope.item_paging.ppage = res.data.ppage;
                $scope.item_paging.npage = res.data.npage;
                $scope.item_paging.pages = res.data.pages;
                $scope.total_paging_record = res.data.total_paging_record;
                if (res.data.ack == true) {
                    $scope.products = [];
                    $.each(res.data.response, function (index, obj) {
                        obj.chk = false;
                        $scope.products[index] = obj;
                    });

                    var promoProdUrl = $scope.$root.sales + "crm/crm/get-promotion-products";
                    $http
                        .post(promoProdUrl, {id: $scope.rec.id, type: 1, 'token': $scope.$root.token})
                        .then(function (res) {
                            if (res.data.ack == true) {
                                $.each($scope.products, function (indx1, obj1) {
                                    $.each(res.data.response, function (indx2, obj2) {
                                        if (obj1.id == obj2.id)
                                            $scope.products[indx1].chk = true;
                                    });
                                });
                            }
                        });
                }
                else {
                    //toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(400));
                    $scope.products = [];
                }
            });

    }

    $scope.getServices = function (recs, parm) {
        $scope.record = {};
        $scope.rec.type = 2;
        $scope.title = 'Items';
        var getListUrl = $scope.$root.setup + "service/categories/get-all-categories";
        $http
            .post(getListUrl, {'token': $scope.$root.token})
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.arr_categories = {};
                    $scope.arr_categories = res.data.response;
                }
            });

        var cat_id = '';
        if (parm != '') {
            $scope.postData = {'all': "1", token: $scope.$root.token};
            recs.category = '';
            recs.search_data = '';
        }
        else {
            cat_id = recs.category != null ? recs.category.id : '';
            $scope.search_data = recs.search_data;
            $scope.postData = {
                'search_string': $scope.search_data,
                'category_id': cat_id,
                'all': "1",
                token: $scope.$root.token
            };
        }

        var prodApi = $scope.$root.setup + "service/products-listing/get-products-popup";
        $http
            .post(prodApi, $scope.postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.products = [];
                    $.each(res.data.response, function (index, obj) {
                        obj.chk = false;
                        $scope.products[index] = obj;
                    });

                    var promoProdUrl = $scope.$root.sales + "crm/crm/get-promotion-products";
                    $http
                        .post(promoProdUrl, {id: $scope.rec.id, type: 2, 'token': $scope.$root.token})
                        .then(function (res) {
                            if (res.data.ack == true) {
                                $.each($scope.products, function (indx1, obj1) {
                                    $.each(res.data.response, function (indx2, obj2) {
                                        if (obj1.id == obj2.id)
                                            $scope.products[indx1].chk = true;
                                    });
                                });
                            }
                        });
                }
                else {
                    //toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(400));
                    $scope.products = [];
                }
            });

    }

    angular.element(document).on('click', '.checkAll', function () {
        if (angular.element('.checkAll').is(':checked') == true) {
            for (var i = 0; i < $scope.products.length; i++) {
                var price = 0;
                if ($scope.rec.discount_type == 'Percentage')
                    price = $scope.products[i].standard_price - ($scope.products[i].standard_price * $scope.rec.discount / 100);
                if ($scope.rec.discount_type != 'Percentage')
                    price = $scope.products[i].standard_price - $scope.rec.discount;

                if (price > 0)
                    $scope.products[i].chk = true
                else
                    toaster.pop('error', 'Info', "Item can't be added due to the discounted price in minus.");
            }
        }
        else {
            for (var i = 0; i < $scope.products.length; i++) {
                $scope.products[i].chk = false;
            }
        }
        $scope.$root.$apply(function () {
            $scope.products;
        })
    });

    $scope.selectProd = function (id) {
        for (var i = 0; i < $scope.products.length; i++) {
            if (id == $scope.products[i].id) {
                if ($scope.products[i].chk == true)
                    $scope.products[i].chk = false
                else {
                    var price = 0;
                    if ($scope.rec.discount_type == 'Percentage')
                        price = $scope.products[i].standard_price - ($scope.products[i].standard_price * $scope.rec.discount / 100);
                    if ($scope.rec.discount_type != 'Percentage')
                        price = $scope.products[i].standard_price - $scope.rec.discount;

                    if (price > 0)
                        $scope.products[i].chk = true
                    else
                        toaster.pop('error', 'Info', "Item can't be added due to the discounted price in minus.");
                }
            }
        }
    }

    $scope.addProducts = function () {
        $timeout(function () {
            if ($scope.rec.type == 1)
                angular.element("#crmPromoItems a").click();
            else if ($scope.rec.type == 2)
                angular.element("#crmPromoService a").click();
            else
                angular.element("#crmPromoItems a").click();

        }, 2000);
        angular.element('#productModal').modal({show: true});
    }

    $scope.prod = {};
    $scope.addPromoProd = function (prod) {
        var addPromoProdUrl = $scope.$root.sales + "crm/crm/add-promotion-product";
        var updateUrl = $scope.$root.sales + "crm/crm/update-crm-promotion";
        prod.promotion_id = $scope.rec.id;
        prod.promotion_product = $scope.products;
        prod.token = $scope.$root.token;
        $scope.rec.token = $scope.$root.token;

        $http.post(updateUrl, $scope.rec)
            .then(function (res) {
            });
        $http.post(addPromoProdUrl, prod)
            .then(function (res) {
            });
        angular.element('#productModal').modal('hide');
    };

    /*$scope.deleteProd = function(prod) {
     var delPromoProdUrl = $scope.$root.sales+"crm/crm/delete-crmpromotion-product";
     ngDialog.openConfirm({
     template: 'modalDeleteDialogId',
     className: 'ngdialog-theme-default-custom'
     }).then(function (value) {
     $http
     .post(delPromoProdUrl, {product_id:id,prom_id:prom_id,token:$scope.$root.token})
     .then(function (res) {

     });
     }, function (reason) {
     });

     };*/

}

/*function PromotionProductsController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster, $stateParams) {
 'use strict';
 $scope.module_id = 29;
 $scope.filter_id = 21;
 $scope.more_fields = 'null';
 $scope.condition = 0;
 $scope.MainDefer = null;
 $scope.mainParams = null;
 $scope.mainFilter = null;
 $scope.count = 1;
 $scope.arr_categories = [];
 var vm = this;
 $scope.selection=[];
 $scope.promotion_id = '';
 $scope.discount_type = '';
 $scope.discount_value = '';
 $scope.columnss = [];
 $scope.selected_prod = [];
 var ApiAjax = $scope.$root.stock+"products-listing/products";
 var promoProdUrl = $scope.$root.sales+"crm/crm/get-promotion-products";
 var catUrl = $scope.$root.stock+"categories";
 $scope.promotion_id = 0;


 $scope.$on("myShowProductsEventReload", function (event, args) {
 //$scope.count = $scope.count+1;
 $scope.promotion_name = args.name;
 $scope.promotion_id = args.id;
 $scope.discount_type = args.discount_type;
 $scope.discount_value = args.discount_value;
 /*if($scope.discount_type == 'Percentage')
 $scope.discount_value = $scope.discount_value/100;*

 $http
 .post(promoProdUrl, {id:args.id,'token': $scope.$root.token})
 .then(function (res) {
 $scope.selection=[];
 $scope.columnss = [];
 if(res.data.ack == true){
 $scope.selected_prod = res.data.response;
 angular.forEach(res.data.response[0],function(val,index){
 $scope.columnss.push({
 'title':toTitleCase(index),
 'field':index,
 'visible':true
 });
 });

 angular.forEach(res.data.response, function(value, key) {
 $scope.selection.push(value.id);
 });

 }
 else{
 $scope.selection.push(res.data.response.product_id);
 }

 //console.log($scope.selection.length);


 });
 $scope.postData = {token:$scope.$root.token}
 ngDataService.getDataCustomAjax( $scope.MainDefer, $scope.mainParams, ApiAjax,$scope.mainFilter,$scope,'doreload'+$scope.count,$scope.postData);
 $scope.table.tableParams5.reload();
 });

 function toTitleCase(str){
 var title = str.replace('_',' ');
 return title.replace(/\w\S*g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
 }

 $scope.search_data = '';
 $scope.getProducts = function(parm) {
 if(parm != undefined){
 $scope.postData = {'all': "1",token:$scope.$root.token};
 $scope.category = '';
 $scope.search_data = '';
 }
 else{
 var cat_id = $scope.category != undefined?$scope.category.id:'';
 $scope.postData = {'condition':'(products.pr_namelike_*'+$scope.search_data+'@products.descriptionlike_*'+$scope.search_data+'@products.item_codelike_*'+$scope.search_data+'@catagoryCat.namelike_*'+$scope.search_data+')@category_id*'+cat_id,'all': "1",token:$scope.$root.token};
 }

 ngDataService.getDataCustomAjax( $scope.MainDefer, $scope.mainParams, ApiAjax,$scope.mainFilter,$scope,'doreload'+$scope.count ,$scope.postData);
 $scope.table.tableParams5.reload();

 }

 $scope.$watch("MyCustomeFilters", function () {
 if($scope.MyCustomeFilters && $scope.table.tableParams5){
 $scope.table.tableParams5.reload();
 }
 }, true);

 $scope.MyCustomeFilters = {
 }



 vm.tableParams5 = new ngParams({
 page: 1,            // show first page
 count: $scope.$root.pagination_limit,           // count per page
 filter: {
 name: '',
 age: ''
 }
 }, {
 total: 0,           // length of data
 counts: [],         // hide page counts control

 getData: function($defer, params) {
 if($scope.promotion_id > 0)
 ngDataService.getDataCustomAjax( $defer, params, ApiAjax,$filter,$scope,'show_products',$scope.postData);
 $scope.MainDefer = $defer;
 $scope.mainParams = params;
 $scope.mainFilter = $filter;
 }
 });

 $scope.prod= {};

 $scope.select_deselect_prod = function(prod,prom_id,id,name,isChecked,discount_type,discount){
 if(isChecked)
 $scope.selectProd(prod,prom_id,id,name,discount_type,discount);
 else
 $scope.deleteProd(name,prom_id,id);
 }

 $scope.selectProd = function(prod,prom_id,id,name,discount_type,discount) {
 var addPromoProdUrl = $scope.$root.sales+"crm/crm/add-promotion-product";
 prod.product_id = id;
 prod.promotion_id = prom_id;
 prod.table = 'crm_promotions_items';
 prod.is_company = 0;
 prod.token = $scope.$root.token;

 $http.post(addPromoProdUrl, prod)
 .then(function (res) {
 if(res.data.ack == true){
 $scope.selection.push(id);
 $scope.$root.$broadcast("myShowProductsEventReload", {id:prom_id,name:name,discount_type:discount_type,discount_value:discount});
 }

 else
 toaster.pop('error', 'Add', $rootScope.getErrorMessageByCode(104));
 });

 };

 $scope.deleteProd = function(name,prom_id,id) {
 var delPromoProdUrl = $scope.$root.sales+"crm/crm/delete-crmpromotion-product";
 ngDialog.openConfirm({
 template: 'modalDeleteDialogId',
 className: 'ngdialog-theme-default-custom'
 }).then(function (value) {
 $http
 .post(delPromoProdUrl, {product_id:id,prom_id:prom_id,token:$scope.$root.token})
 .then(function (res) {
 if(res.data.ack == true){
 $timeout(function(){
 var index = $scope.selection.indexOf(id);
 $scope.selection.splice(index,1);
 },100);
 toaster.pop('success', 'Deleted', $rootScope.getErrorMessageByCode(103));
 $scope.$root.$broadcast("myShowProductsEventReload", {id:prom_id,name:name});
 }
 else{
 toaster.pop('error', 'Deleted', $rootScope.getErrorMessageByCode(108));
 }
 });
 }, function (reason) {
 $scope.$root.$broadcast("myShowProductsEventReload", {id:prom_id,name:name});
 });

 //if(popupService.showPopup('Would you like to delete?')) {

 //  }*
 };

 $scope.backPromo = function(){
 $scope.$root.$broadcast("showCrmPromotionForm");
 }


 }*/




