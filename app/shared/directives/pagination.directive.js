myApp.directive("paginationGeneric", ['$http', '$state', 'toaster', '$rootScope', function ($http, $state, toaster, $rootScope) {
    return {
        restrict: 'E',
        scope: {
            searchKeyword: "=",
            data: "=",
            glAccountPagination: "=",
            totalPages: "=",
            totalRec: "=",
            cPage: "=",
            nPage: "=",
            pPage: "=",
            allPagesArray: "=",
            pageInput: "="
        },
        templateUrl: "app/shared/directives/pagination.directive.html",
        link: function (scope, elem, attrib) {

            scope.goToPage = function (page) {
                // console.log(page);
                // console.log(scope.cPage);

                if (scope.cPage == page || (scope.cPage == scope.totalPages && page == scope.totalPages) || (page > scope.totalPages) || (page == 0))
                    return false;


                document.getElementById('PageInput').value = '';

                scope.showLoader10 = true;

                var gl_account_DetailsURL = scope.$root.gl + "chart-accounts/get-gl-account-debit-credit-by-id";

                $http
                    .post(gl_account_DetailsURL,
                    {
                        'token': scope.$root.token,
                        'account_type': scope.glAccountPagination.ExpType,
                        'account_id': scope.glAccountPagination.ExpAccountID,
                        'range_from': scope.glAccountPagination.ExpRangeFrom,
                        'range_to': scope.glAccountPagination.ExpRangeTo,
                        'page': page,
                        'searchKeyword': scope.searchKeyword
                    })
                    .then(function (res) {
                        //console.log(res);
                        scope.showLoader10 = false;

                        if (res.data.ack == true) {
                            
                            // scope.account_details_rec = res.data.response;

                            // angular.copy(scope.data, res.data.response);

                            scope.data.data = res.data.response;
                            scope.total_pages = res.data.total_pages;
                            scope.total_rec = res.data.total;

                            scope.cPage = res.data.cpage;
                            scope.nPage = res.data.npage;
                            scope.pPage = res.data.ppage;
                            // scope.pages = res.data.pages;
                            // angular.copy(scope.pages, res.data.pages);
                            // angular.copy(scope.allPagesArray, res.data.pages);

                            scope.Total_transaction = res.data.Total_transaction;
                            scope.Total_transaction_type = res.data.Total_transaction_type;
                            scope.allPagesArray.data = res.data.pages;
                            
                        }
                        else {
                            scope.showLoader10 = false;
                            // toaster.pop('error', 'Error', res.data.error);
                        }
                    });
            }

            // document.getElementById('PageInput').value = scope.pageInput;


            document.getElementById('PageInput').onkeydown = function (event) {

                // console.log(event);

                var PageInput = document.getElementById('PageInput').value;
                // console.log(PageInput);
                
                if (event.keyCode == 13) {

                    if (scope.cPage == PageInput || (scope.cPage == scope.totalPages && PageInput == scope.totalPages) || (PageInput > scope.totalPages) || (PageInput == 0)){
                        toaster.pop('error', 'Error', 'Invalid Page No.');
                        return false;
                    }  
                    
                    scope.showLoader10 = true;                      

                    var gl_account_DetailsURL = scope.$root.gl + "chart-accounts/get-gl-account-debit-credit-by-id";

                    $http
                        .post(gl_account_DetailsURL,
                        {
                            'token': scope.$root.token,
                            'account_type': scope.glAccountPagination.ExpType,
                            'account_id': scope.glAccountPagination.ExpAccountID,
                            'range_from': scope.glAccountPagination.ExpRangeFrom,
                            'range_to': scope.glAccountPagination.ExpRangeTo,
                            'page': PageInput,
                            'searchKeyword': scope.searchKeyword
                        })
                        .then(function (res) {
                            //console.log(res);
                            scope.showLoader10 = false;
                            if (res.data.ack == true) {

                                // scope.account_details_rec = res.data.response;
                                
                                scope.data.data = res.data.response;
                                // angular.copy(scope.data, res.data.response);

                                scope.total_pages = res.data.total_pages;
                                scope.total_rec = res.data.total;

                                scope.cPage = res.data.cpage;
                                scope.nPage = res.data.npage;
                                scope.pPage = res.data.ppage;
                                // scope.pages = res.data.pages;
                                // angular.copy(scope.pages, res.data.pages);
                                // angular.copy(scope.allPagesArray, res.data.pages);

                                scope.allPagesArray.data = res.data.pages;

                                scope.Total_transaction = res.data.Total_transaction;
                                scope.Total_transaction_type = res.data.Total_transaction_type;
                                scope.showLoader = false;
                            }
                            else {
                                scope.showLoader = false;
                                // toaster.pop('error', 'Error', res.data.error);
                            }
                        });
                }
            }
        }
    }
}]);