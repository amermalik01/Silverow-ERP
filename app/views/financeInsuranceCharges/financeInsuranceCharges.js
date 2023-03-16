
FinanceInsuranceChargesController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];

myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        $stateProvider
            .state('app.finance-insurance-charges', {
                url: '/Finance-Insurance-Charges',
                title: 'Setup',
                templateUrl: helper.basepath('financeInsuranceCharges/financeInsuranceCharges.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog")
            })
    }]);

myApp.controller('FinanceInsuranceChargesController', FinanceInsuranceChargesController);

function FinanceInsuranceChargesController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
    'use strict';

    $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
    { 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
    { 'name': 'Finance & Insurance Charges', 'url': '#', 'isActive': false }];

    $scope.rec = {};

    $scope.selectFinCharges = function (val) {
        // console.log(val);|| val == 1
        if (val == false) {
            $scope.rec.finChargesType = '';
            $scope.rec.finCharges = '';
            $scope.rec.finChargesChk = false;
        }
        else
            $scope.rec.finChargesChk = true;
    }

    $scope.selectInsCharges = function (val) {
        // console.log(val);// || val == 1
        if (val == false) {
            $scope.rec.insChargesType = '';
            $scope.rec.insCharges = '';
            $scope.rec.insChargesChk = false;
        }
        else
            $scope.rec.insChargesChk = true;
    }

    $scope.chkReadonly = true;

    $scope.gotoEdit = function () {
        $scope.chkReadonly = false;
    }

    $scope.updateFinInsCharges = function (rec) {

        // console.log(rec.insChargesChk);

        if (rec.finChargesChk == true && !(parseFloat(rec.finCharges) > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Finance Charge']));
            return false;
        }

        if (rec.insChargesChk == true && !(parseFloat(rec.insCharges) > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Insurance Charge']));
            return false;
        }        

        if (rec.finChargesType == 1 && (parseFloat(rec.finCharges) <0 || parseFloat(rec.finCharges) > 100 )) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(659, ['Finance Charge']));
            return false;
        }

        if (rec.insChargesType == 1 && (parseFloat(rec.insCharges) <0 || parseFloat(rec.insCharges) > 100 )) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(659, ['Insurance Charge']));
            return false;
        }

        // return false;

        var postUrl = $scope.$root.setup + "general/update-fin-ins-charges";
        rec.token = $scope.$root.token;
        $http
            .post(postUrl, rec)
            .then(function (ress) {
                if (ress.data.ack == 1) {
                    toaster.pop('success', 'Update', $scope.$root.getErrorMessageByCode(102));
                    $scope.chkReadonly = true;
                }
                else {
                    toaster.pop('success', 'Update', ress.data.error);
                    $scope.chkReadonly = true;
                }
            });
    }


    var postUrl = $scope.$root.setup + "general/get-fin-ins-charges";
    $scope.rec.token = $scope.$root.token;
    $http
        .post(postUrl, $scope.rec)
        .then(function (ress) {

            $scope.rec = {};

            if (ress.data.ack == 1) {
                // $scope.rec = ress.data.response;
                $scope.rec.finChargesType = ress.data.response.finchargetype;
                $scope.rec.finCharges = parseFloat(ress.data.response.fincharges);

                if (ress.data.response.finchargechk == 0) {
                    $scope.rec.finChargesChk = false;
                    $scope.rec.finCharges = '';
                }
                else
                    $scope.rec.finChargesChk = true;

                $scope.rec.insChargesType = ress.data.response.inschargetype;
                $scope.rec.insCharges = parseFloat(ress.data.response.inscharges);

                if (ress.data.response.inschargechk == 0) {
                    $scope.rec.insChargesChk = false;
                    $scope.rec.insCharges = '';
                }
                else
                    $scope.rec.insChargesChk = true;
                // $scope.rec.insChargesChk = ress.data.response.inschargechk;

            }
            else {
                toaster.pop('error', 'Info', ress.data.error);
            }
        });
}