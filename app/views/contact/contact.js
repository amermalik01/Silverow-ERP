
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {

        $stateProvider
                .state('app.contact', {
                    url: '/contact/',
                    title: 'Contact',
                    templateUrl: helper.basepath('contact/contact.html'),
                    resolve: helper.resolveFor('ngDialog')
                })
    }]);


myApp.controller('ContactController', ['$scope', '$window', '$stateParams', '$filter', '$http', '$rootScope', 'ngDialog', "toaster", function ($scope, $window, $stateParams, $filter, $http, $rootScope, ngDialog, toaster) {

        $scope.breadcrumbs =
                [{'name': 'Contact', 'url': '#', 'isActive':false}];

        $scope.showLoader = true;
        $scope.title = "Add Contact";
        $scope.check_contact_readonly = false;
        $scope.add_submit = true;
        $scope.edit_submit = false;
        $scope.edit_contact = false;

        $scope.contacts = {};
        $scope.contact = {};
        $scope.total = 0;
        $scope.alphabet = "";

        $scope.basepath = $rootScope.basePath;
        $scope.formData = {};
        $scope.formData.id = "";
        $scope.formData.contactname = "";
        $scope.formData.fname = "";
        $scope.formData.lname = "";
        $scope.formData.knownas = "";
        $scope.formData.locationname = "";
        $scope.formData.jobtitle = "";
        $scope.formData.organisation = "";
        $scope.formData.saveas = "";
        $scope.formData.address1 = "";
        $scope.formData.address2 = "";
        $scope.formData.phone = [];
        $scope.formData.phone[0] = "";
        $scope.formData.phoneType = [];
        $scope.formData.phoneType[0] = "";
        $scope.formData.city = "";
        $scope.formData.fax = "";
        $scope.formData.county = "";
        $scope.formData.mobile = "";
        $scope.formData.postcode = "";
        $scope.formData.email = "";
        $scope.formData.mail = [];
        $scope.formData.mail[0] = "";
        $scope.formData.mailType = [];
        $scope.formData.mailType[0] = "";
        $scope.formData.country = "";
        $scope.formData.photo = "profile.jpg";
        $scope.formData.notes = "";
        $scope.formData.skypeid = "";
        $scope.formData.linkedinid = "";
        $scope.formData.url = "";
        $scope.index = 0;


        $scope.showAddForm = function () {
            $scope.showLoader = true;
            $scope.title = "Add Contact";
            $scope.check_contact_readonly = false;
            $scope.add_submit = true;
            $scope.edit_submit = false;
            $scope.edit_contact = false;
            $scope.formData.id = "";
            $scope.formData.contactname = "";
            $scope.formData.fname = "";
            $scope.formData.lname = "";
            $scope.formData.knownas = "";
            $scope.formData.locationname = "";
            $scope.formData.jobtitle = "";
            $scope.formData.organisation = "";
            $scope.formData.saveas = "";
            $scope.formData.address1 = "";
            $scope.formData.address2 = "";
            $scope.formData.phone = [];
            $scope.formData.phone[0] = "";
            $scope.formData.phoneType = [];
            $scope.formData.phoneType[0] = "";
            $scope.formData.city = "";
            $scope.formData.fax = "";
            $scope.formData.county = "";
            $scope.formData.mobile = "";
            $scope.formData.postcode = "";
            $scope.formData.email = "";
            $scope.formData.mail = [];
            $scope.formData.mail[0] = "";
            $scope.formData.mailType = [];
            $scope.formData.mailType[0] = "";
            $scope.formData.country = "";
            $scope.formData.photo = "profile.jpg";
            $scope.formData.notes = "";
            $scope.formData.skypeid = "";
            $scope.formData.linkedinid = "";
            $scope.formData.url = "";
            $scope.showLoader = false;

        };

        $scope.showEditForm = function () {

            $scope.showLoader = true;
            $scope.title = "Edit Contact";
            $scope.check_contact_readonly = false;
            $scope.add_submit = false;
            $scope.edit_submit = true;
            $scope.showLoader = false;
        };

        $scope.showViewForm = function (id, index) {

            $scope.formData.id = id;
            $scope.index = index;
            $scope.getContact();

            $scope.showLoader = true;
            $scope.title = "View Contact";
            $scope.check_contact_readonly = true;
            $scope.add_submit = false;
            $scope.edit_submit = false;
           // $timeout(function(){
                $scope.showLoader = false;
           // },100);


        };



        $scope.addContact = function () {

            $scope.showLoader = true;
            if ($scope.formData.fname == "" || $scope.formData.fname == " ") {
                toaster.pop('error', 'Add', 'Record can\'t be Saved!\nPlease enter your first name.');
                $scope.showLoader = false;
            } else if ($scope.formData.lname == "" || $scope.formData.lname == " ") {
                toaster.pop('error', 'Add', 'Record can\'t be Saved!\nPlease enter your last name.');
                $scope.showLoader = false;
            } else if ($scope.formData.knownas == "" || $scope.formData.knownas == " ") {
                toaster.pop('error', 'Add', 'Record can\'t be Saved!\nPlease enter known as.');
                $scope.showLoader = false;
            } else if ($scope.formData.saveas == "" || $scope.formData.saveas == " ") {
                toaster.pop('error', 'Add', 'Record can\'t be Saved!\nPlease enter save as.');
                $scope.showLoader = false;
            } else if (!$scope.validateEmail($scope.formData.mail[0]) || $scope.formData.mail[0] == "") {
                toaster.pop('error', 'Add', 'Record can\'t be Saved!\n At least one email is required.');
                $scope.showLoader = false;
            } else {

                var contactData = {contactname: $scope.formData.contactname, fname: $scope.formData.fname, lname: $scope.formData.lname,  knownas: $scope.formData.knownas, locationname: $scope.formData.locationname, jobtitle: $scope.formData.jobtitle, organisation: $scope.formData.organisation,   address1: $scope.formData.address1, saveas: $scope.formData.saveas,     directline: $scope.formData.directline, address2: $scope.formData.address2, phone: $scope.formData.phone, phoneType: $scope.formData.phoneType, city: $scope.formData.city    , fax: $scope.formData.fax, county: $scope.formData.county, mobile: $scope.formData.mobile, postcode: $scope.formData.postcode
                    , email: $scope.formData.email, mail: $scope.formData.mail, mailType: $scope.formData.mailType, country: $scope.formData.country, photo: $scope.formData.photo, notes: $scope.formData.notes,
                    skypeid: $scope.formData.skypeid, linkedinid: $scope.formData.linkedinid, url: $scope.formData.url, token: $rootScope.token};
                var contactPath = $rootScope.com + 'contact/addcontact';
                $http.post(contactPath, contactData).then(function (result) {

                    if (result.data.isError == 0) {
                        $scope.showAddForm();
                        $scope.getContacts();
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    } else {
                        toaster.pop('error', 'Add', 'Record can\'t be Saved!\n' + result.data.errorMessage);
                    }

                    $timeout(function(){
                        $scope.showLoader = false;
                    },500);

                });
            }
        };

        $scope.editContact = function () {

            $scope.showLoader = true;
            $scope.formData.saveas = angular.element('#saveasid').val();
            if ($scope.formData.fname == "" || $scope.formData.fname == " ") {
                toaster.pop('error', 'Add', 'Record can\'t be Saved!\nPlease enter your first name.');
                $scope.showLoader = false;
            } else if ($scope.formData.lname == "" || $scope.formData.lname == " ") {
                toaster.pop('error', 'Add', 'Record can\'t be Saved!\nPlease enter your last name.');
                $scope.showLoader = false;
            } else if ($scope.formData.knownas == "" || $scope.formData.knownas == " ") {
                toaster.pop('error', 'Add', 'Record can\'t be Saved!\nPlease enter known as.');
                $scope.showLoader = false;
            } else if ($scope.formData.saveas == "" || $scope.formData.saveas == " ") {
                toaster.pop('error', 'Add', 'Record can\'t be Saved!\nPlease enter save as.');
                $scope.showLoader = false;
            } else if (!$scope.validateEmail($scope.formData.mail[0]) || $scope.formData.mail[0] == "") {
                toaster.pop('error', 'Add', 'Record can\'t be Saved!\nEmail is not Valid.');
                $scope.showLoader = false;
            } else {
                var contactData = {id: $scope.formData.id, contactname: $scope.formData.contactname, fname: $scope.formData.fname, lname: $scope.formData.lname,
                    knownas: $scope.formData.knownas, locationname: $scope.formData.locationname, jobtitle: $scope.formData.jobtitle, organisation: $scope.formData.organisation, address1: $scope.formData.address1,
                    directline: $scope.formData.directline, saveas: angular.element('#saveasid').val(), address2: $scope.formData.address2, phone: $scope.formData.phone, phoneType: $scope.formData.phoneType, city: $scope.formData.city
                    , fax: $scope.formData.fax, county: $scope.formData.county, mobile: $scope.formData.mobile, postcode: $scope.formData.postcode
                    , email: $scope.formData.email, mail: $scope.formData.mail, mailType: $scope.formData.mailType, country: $scope.formData.country, photo: $scope.formData.photo, notes: $scope.formData.notes,
                    skypeid: $scope.formData.skypeid, linkedinid: $scope.formData.linkedinid, url: $scope.formData.url, token: $rootScope.token};
                var contactPath = $rootScope.com + 'contact/editcontact';
                $http.post(contactPath, contactData).then(function (result) {

                    if (result.data.isError == 0) {
                        $scope.showAddForm();
                        $scope.getContacts();
                        toaster.pop('success', 'Edit', 'Record Edited.');
                    } else {
                        toaster.pop('error', 'Edit', 'Record can\'t be Edited!\n' + result.data.errorMessage);
                    }

                    $timeout(function(){
                        $scope.showLoader = false;
                    },500);

                });
            }
        };

        $scope.showDeleteModal = function () {
            angular.element('#modaldeletecontact').modal({
                show: true
            });
        };

        $scope.deleteContact = function () {
            $scope.showLoader = true;
            var contactData = {id: $scope.formData.id, token: $rootScope.token};
            var contactPath = $rootScope.com + 'contact/deletecontact';
            $http.post(contactPath, contactData).then(function (result) {
                console.log("ssss::");
                if (result.data.isError == 0) {

//                    $scope.contacts.splice($scope.index, 1);
//                    $scope.total -= 1;
                    $scope.getContacts();
                    $scope.showAddForm();
                    toaster.pop('success', 'Delete', $scope.$root.getErrorMessageByCode(103));
                } else {

                    toaster.pop('error', 'Delete', $scope.$root.getErrorMessageByCode(108));
                    $timeout(function(){
                        $scope.showLoader = false;
                    },500);
                }

                $timeout(function(){
                    $scope.showLoader = false;
                },500);

            });
        };

        $scope.getContacts = function () {
          //  $scope.showLoader = true;
            var contactData = {token: $rootScope.token};
            var contactPath = $rootScope.com + 'contact/contacts';
            $http.post(contactPath, contactData).then(function (result) {
                $scope.contacts = result.data.contacts;
                $scope.total = result.data.total;
               // $timeout(function(){
                //    $scope.showLoader = false;
              //  },500);
            });
        };

        $scope.getContact = function () {
          //  $scope.showLoader = true;
            var contactData = {id: $scope.formData.id, token: $rootScope.token};
            var contactPath = $rootScope.com + 'contact/contact';
            $http.post(contactPath, contactData).then(function (result) {
                $scope.contact = result.data.contact;
                $scope.formData.id = $scope.contact.id;
                $scope.formData.contactname = $scope.contact.contactname;
                $scope.formData.fname = $scope.contact.fname;
                $scope.formData.lname = $scope.contact.lname;
                $scope.formData.knownas = $scope.contact.knownas;
                $scope.formData.locationname = $scope.contact.locationname;
                $scope.formData.jobtitle = $scope.contact.jobtitle;
                $scope.formData.organisation = $scope.contact.organisation;
                $scope.formData.address1 = $scope.contact.address1;
                // $scope.formData.saveas = $scope.contact.saveas;

                $scope.formData.directline = $scope.contact.directline;
                $scope.formData.address2 = $scope.contact.address2;
//                $scope.formData.phone = $scope.contact.phone;
                $scope.formData.phone = $scope.contact.phone;
//                $scope.formData.phone[0] = "";
                $scope.formData.phoneType = $scope.contact.phoneType;
//                $scope.formData.phoneType[0] = "";
                $scope.formData.city = $scope.contact.city;
                $scope.formData.fax = $scope.contact.fax;
                $scope.formData.county = $scope.contact.county;
                $scope.formData.mobile = $scope.contact.mobile;
                $scope.formData.postcode = $scope.contact.postcode;
                $scope.formData.email = $scope.contact.email;
                $scope.formData.mail = $scope.contact.mail;
//                $scope.formData.mail[0] = "";
                $scope.formData.mailType = $scope.contact.mailType;
//                $scope.formData.mailType[0] = "";
                $scope.formData.country = $scope.contact.country;
                $scope.formData.photo = $scope.contact.photo;
                $scope.formData.notes = $scope.contact.notes;
                $scope.formData.skypeid = $scope.contact.skypeid;
                $scope.formData.linkedinid = $scope.contact.linkedinid;
                $scope.formData.url = $scope.contact.url;
               // $timeout(function () {
                    angular.element('#saveasid').val($scope.contact.saveas);
                   // $scope.showLoader = false;
              //  },500);
            });
           
        };

        $scope.validateEmail = function (email) {
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        };

        $scope.addMail = function () {
            $scope.formData.mail.push('');
            $scope.formData.mailType.push('');
        };

        $scope.removeMail = function (index) {
            $scope.formData.mail.splice(index, 1);
            $scope.formData.mailType.splice(index, 1);
        };

        $scope.addPhone = function () {
            $scope.formData.phoneType.push('');
            $scope.formData.phone.push('');
        };

        $scope.removePhone = function (index) {
            $scope.formData.phoneType.splice(index, 1);
            $scope.formData.phone.splice(index, 1);
        };

	 $scope.$root.load_date_picker('contact'); 
    }]);


