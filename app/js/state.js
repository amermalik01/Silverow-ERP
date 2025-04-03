
myApp.config(['$ocLazyLoadProvider', '$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($ocLazyLoadProvider, $stateProvider, $locationProvider, $urlRouterProvider, helper) {

        // $urlRouterProvider.otherwise("/");
        // $locationProvider.hashPrefix('!');
        var basePath = 'http://' + window.location.hostname + window.location.pathname;


        var dialog1 = basePath + 'vendor/ngDialog/js/ngDialog.min.js';
        var dialog2 = basePath + 'vendor/ngDialog/css/ngDialog.min.css';
        var dialog3 = basePath + 'vendor/ngDialog/css/ngDialog-theme-default.min.css';

        // You can also load via resolve
        $stateProvider
             .state('app.exapmle', {
                 url: "/hr_listing",
                 controller: 'hr_values_controler',
                 title: 'Human Resource values',
                 templateUrl: helper.basepath('hr_values/hr_listing.html'),
                 //	resolve: helper.resolveFor('ngTable', "ngDialog"),
                 resolve: {
                     loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                             return $ocLazyLoad.load({
                                 name: 'hr_listing2',
                                 files: [basePath + 'app/views/hr_values/hr_values.js'
                                          // ,dialog1  ,dialog2,dialog3
                                 ]}
                             //,'ngDialog',basePath + 'app/views/hr_values/hr_values.js'

//                                      , {name: 'ngTable', files: ['../navson/vendor/ng-table/dist/ng-table.min.js',
//                                      '../navson/vendor/ng-table/dist/ng-table.min.css']}


                             )
                             //  files: helper.basepath('../views/hr_values/hr_values.js'),
                             ///'app.hr_listing'//'../navson/app/views/hr_values/hr_values.js'
                         }
                     ]
                 }

             })
            
        
        /****************************************/
             // SALES start
             /****************************************/


             //CRM AREA start

             .state('app.crm', {
                 url: '/crm/:filter_id',
                 title: 'CRM',
                 templateUrl: helper.basepath('crm/crm.html'),
                 controller: 'CrmController',
                 resolve: {
                     loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {

                             return $ocLazyLoad.load({
                                 name: 'crm',
                                 files: [basePath + 'app/views/crm/crm.js'
                                          , dialog1, dialog2, dialog3
                                 ]}
                             )
                         }]
                 }
             })
             .state('app.add-crm', {
                 url: '/crm/add',
                 title: 'Add CRM',
                 templateUrl: helper.basepath('addTabs.html'),
                 controller: 'CrmEditController',
                 resolve: {
                     loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {

                             return $ocLazyLoad.load({
                                 name: 'editCrm',
                                 files: [basePath + 'app/views/crm/crm.js'
                                          , dialog1, dialog2, dialog3
                                 ]}
                             )
                         }]
                 }
             })
             .state('app.editCrm', {
                 url: '/crm/:id/edit',
                 title: 'Edit CRM',
                 templateUrl: helper.basepath('addTabs.html'),
                 controller: 'CrmEditController',
                 resolve: {
                     loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {

                             return $ocLazyLoad.load({
                                 name: 'editCrm',
                                 files: [basePath + 'app/views/crm/crm.js'
                                          , dialog1, dialog2, dialog3
                                 ]}
                             )
                         }]
                 }
             })

        //CRM AREA finish

        /****************************************/
        // SALES Finish
        /****************************************/



        /*		.state('modal', {
         parent: 'index',
         resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
         loadOcModal: ['$ocLazyLoad', '$injector', '$rootScope', function($ocLazyLoad, $injector, $rootScope) {
         // Load 'oc.modal' defined in the config of the provider $ocLazyLoadProvider
         console.log('load');
         return $ocLazyLoad.load([
         'bower_components/bootstrap/dist/css/bootstrap.css', // will use the cached version if you already loaded bootstrap with the button
         'bower_components/ocModal/dist/css/ocModal.animations.css',
         'bower_components/ocModal/dist/css/ocModal.light.css',
         'bower_components/ocModal/dist/ocModal.js',
         'partials/modal.html'
         ]).then(function() {
         console.log('--------then');
         $rootScope.bootstrapLoaded = true;
         // inject the lazy loaded service
         var $ocModal = $injector.get("$ocModal");
         console.log($ocModal);
         $ocModal.open({
         url: 'modal',
         cls: 'fade-in'
         });
         });
         }],
         
         // resolve the sibling state and use the service lazy loaded
         setModalBtn: ['loadOcModal', '$rootScope', '$ocModal', function(loadOcModal, $rootScope, $ocModal) {
         $rootScope.openModal = function() {
         $ocModal.open({
         url: 'modal',
         cls: 'flip-vertical'
         });
         }
         }]
         }
         });*/



        $ocLazyLoadProvider.config({
            'debug': true,
            'events': true,
            // jsLoader: requirejs,
            //	asyncLoader: require,
            'modules': [
                // only seprate states are working 
                {
                    name: 'crm',
                    files: [basePath + 'app/views/crm/crm.js']
                }
                ,
                {
                    name: 'editCrm',
                    files: [basePath + 'app/views/crm/crm.js']
                }

            ]
        });


    }]);





// Without server side support html5 must be disabled.
//$locationProvider.html5Mode(false);

// We configure ocLazyLoad to use the lib script.js as the async loader

//http://embed.plnkr.co/TvBvFK/
//https://www.youtube.com/watch?v=yKV-7oxyGlM
//https://ciphertrick.com/2016/07/06/lazy-load-modules-and-controllers-in-angularjs/
//https://oclazyload.readme.io/docs/oclazyloadprovider

/*  
 
 old lazy load  methid 
  


angular.module('editcrm', []).controller('CrmEditController', function   CrmEditController($ocLazyLoad, $scope, $filter, $resource, $timeout, $http, toaster, $rootScope, ngDialog, $stateParams, Upload) {
 'use strict';



 
 //g,ngDataService,ngParams ,"ngTableDataService","ngTableParams"
 
 
 $scope.$on('ocLazyLoad.moduleLoaded', function(e, params) {
 console.log('event module loaded', params);
 });
 
 $scope.$on('ocLazyLoad.componentLoaded', function(e, params) {
 console.log('event component loaded', params);
 });
 
 $scope.$on('ocLazyLoad.fileLoaded', function(e, file) {
 console.log('event file loaded', file);
 });
 
 
 
 */