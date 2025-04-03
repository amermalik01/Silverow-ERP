 
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
//                .state('app.calendar', {
//                    url: '/calendar/:type/',
//                    title: 'Calendar',
//                    resolve: helper.resolveFor('event-calendar', 'smart-search'),
//                    controller: 'CalendarController',
//                    templateUrl: helper.basepath('calendar/calendar.html')
//                })
                  .state('app.monthcalendar', {
                    url: '/calendar/month/',
                    title: 'Month Calendar',
                    resolve: helper.resolveFor('event-calendar', 'smart-search'),
                    controller: 'CalendarController',
                    templateUrl: helper.basepath('calendar/calendar-month.html')
                })
                  .state('app.weekcalendar', {
                    url: '/calendar/week/',
                    title: 'Week Calendar',
                    resolve: helper.resolveFor('event-calendar', 'smart-search'),
                    controller: 'CalendarController',
                    templateUrl: helper.basepath('calendar/calendar-week.html')
                })
                  .state('app.daycalendar', {
                    url: '/calendar/day/',
                    title: 'Day Calendar',
                    resolve: helper.resolveFor('event-calendar', 'smart-search'),
                    controller: 'CalendarController',
                    templateUrl: helper.basepath('calendar/calendar-day.html')
                })
                  .state('app.sharedcalendar', {
                    url: '/calendar/shared/',
                    title: 'Shared Calendar',
                    resolve: helper.resolveFor('event-calendar', 'smart-search'),
                    controller: 'CalendarController',
                    templateUrl: helper.basepath('calendar/calendar-shared.html')
                });
    }]);
 

myApp.controller('CalendarController', ['$scope', '$window', '$stateParams', '$filter', '$http', '$rootScope', 'toaster','$timeout', function ($scope, $window, $stateParams, $filter, $http, $rootScope, toaster,$timeout) {

        $scope.breadcrumbs =
                [{'name': 'Calendar', 'url': '#', 'isActive':false}];

        $scope.contacts = {};
        $scope.getSmartContacts = function () {
            var contactData = {token: $rootScope.token};
            var contactPath = $rootScope.com + 'contact/smartcontacts';
            $http.post(contactPath, contactData).then(function (result) {
                $scope.contacts = result.data;
            });

        };


        $scope.employeecontacts = {};
        $scope.getEmployeeSmartContacts = function () {
            var contactData = {token: $rootScope.token};
            var contactPath = $rootScope.com + 'contact/employeesmartcontacts';
            $http.post(contactPath, contactData).then(function (result) {
                $scope.employeecontacts = result.data;
            });

        };

        $scope.showLoader = true;

        $scope.hideLoader = function () {
            $timeout(function () {
                $scope.showLoader = false;
            }, 1000);
        };
//         var sharedCalsData = {token:$rootScope.token};
//             var sharedCalsPath = $rootScope.com+'calendar/sharedcalendars';
//             $http.post(sharedCalsPath,sharedCalsData).then(function(result){
//                 console.log("SharedCalendarsINCalendarJS");
//                 console.log(result.data);
//             });
        // var monthCalData = {token:$rootScope.token};
        // var monthCalPath = $rootScope.com+'calendar/monthcalendar';
        // $http.post(monthCalPath,monthCalData).then(function(result){
        //        console.log("Month Calendar Data");
        //        console.log(result.data);
        //    });

        // var dayCalData = {token:$rootScope.token};
        // var dayCalPath = $rootScope.com+'calendar/daycalendar';
        // $http.post(dayCalPath,dayCalData).then(function(result){
        //        console.log("Day Calendar Data");
        //        console.log(result.data);
        //    });

        // var eventCalData = {id: 3, token:$rootScope.token};
        // var eventCalPath = $rootScope.com+'calendar/event';
        // $http.post(eventCalPath,eventCalData).then(function(result){
        //        console.log("Event By ID");
        //        console.log(result.data);
        //    });


//        if ($stateParams.type == 1) {
//            angular.element('#eventcalendar').css('display', 'block');
//            angular.element('#monthCalendar').css('display', 'block');
//            angular.element('#weekCalendar').css('display', 'none');
//            angular.element('#dayCalendar').css('display', 'none');
//            angular.element('#sharedCalendars').css('display', 'none');
//            angular.element('#shareCalendar').css('display', 'none');
//        } else if ($stateParams.type == 2) {
//            angular.element('#eventcalendar').css('display', 'block');
//            angular.element('#monthCalendar').css('display', 'none');
//            angular.element('#weekCalendar').css('display', 'block');
//            angular.element('#dayCalendar').css('display', 'none');
//            angular.element('#sharedCalendars').css('display', 'none');
//            angular.element('#shareCalendar').css('display', 'none');
//        } else if ($stateParams.type == 3) {
//            angular.element('#eventcalendar').css('display', 'block');
//            angular.element('#monthCalendar').css('display', 'none');
//            angular.element('#weekCalendar').css('display', 'none');
//            angular.element('#sharedCalendars').css('display', 'none');
//            angular.element('#dayCalendar').css('display', 'block');
//            angular.element('#shareCalendar').css('display', 'none');
//        } else if ($stateParams.type == 4) {
//            angular.element('#eventcalendar').css('display', 'none');
//            angular.element('#monthCalendar').css('display', 'none');
//            angular.element('#weekCalendar').css('display', 'none');
//            angular.element('#dayCalendar').css('display', 'none');
//            angular.element('#sharedCalendars').css('display', 'none');
//            angular.element('#shareCalendar').css('display', 'block');
//            angular.element('#sharecalcond').val('1'); //return false;
//        } else if ($stateParams.type == 5) {
//            angular.element('#eventcalendar').css('display', 'none');
//            angular.element('#monthCalendar').css('display', 'none');
//            angular.element('#weekCalendar').css('display', 'none');
//            angular.element('#dayCalendar').css('display', 'none');
//            angular.element('#sharedCalendars').css('display', 'block');
//            angular.element('#shareCalendar').css('display', 'none');
//        }

        $scope.showSummary = 0;

        $scope.selectedMonthYear = "";
        $scope.selectedYear = {};
        $scope.lastMonthDates = {};
        $scope.selectedMonthDates = {};
        $scope.nextMonthDates = {};
        $scope.change = {};
        $scope.changeMonthORYear = function (monthyear) {
            $scope.selectedMonthYear = "";
            $scope.selectedYear = {};
            $scope.lastMonthDates = {};
            $scope.selectedMonthDates = {};
            $scope.nextMonthDates = {};
            $scope.change = {};
            var calendarPath = $rootScope.com + 'calendar';
            var calData = {};
            if (monthyear == -1) {
                calData = {month: $scope.change.changeMonth, year: $scope.change.changeYear, token: $rootScope.token};
            } else if (monthyear == 1) {
                calData = {month: $scope.change.changeMonthNext, year: $scope.change.changeYearNext, token: $rootScope.token};
            } else if (monthyear == 0) {
                calData.token = $rootScope.token
            }

            $http.post(calendarPath, calData).then(function (result) {
                $scope.selectedMonthYear = result.data.change.selectedMonthYear;
                $scope.selectedYear = result.data.change.selectedYear;
                $scope.lastMonthDates = result.data.lastMonthDates;
                $scope.selectedMonthDates = result.data.selectedMonthDates;
                $scope.nextMonthDates = result.data.nextMonthDates;
                $scope.change = result.data.change;
            });

        };
        $scope.changeMonth = function (monthyear) {
            $scope.selectedMonthYear = "";
            $scope.lastMonthDates = {};
            $scope.selectedMonthDates = {};
            $scope.nextMonthDates = {};
            $scope.change = {};
            var calendarPath = $rootScope.com + 'calendar';
            var calData = {};
            var monthAndYear = monthyear.split("_");
            var selectedMonth = monthAndYear[0];
            var selectedYear = monthAndYear[1];
            calData = {month: selectedMonth, year: selectedYear, token: $rootScope.token};

            $http.post(calendarPath, calData).then(function (result) {
                $scope.selectedMonthYear = result.data.change.selectedMonthYear;
                $scope.lastMonthDates = result.data.lastMonthDates;
                $scope.selectedMonthDates = result.data.selectedMonthDates;
                $scope.nextMonthDates = result.data.nextMonthDates;
                $scope.change = result.data.change;
            });
        }
        $scope.dialogdata = {};
        $scope.openEvent1 = function (eventId) {
            $scope.dialogdata = {};
            var eventData = {id: eventId, token: $rootScope.token};
            var eventPath = $rootScope.com + 'calendar/event';
            $http.post(eventPath, eventData).then(function (result) {
                $scope.dialogdata = result.data;
            });
           

        };

        $scope.selectedMonthInfo = {};
        $scope.previousMonthInfo = {};
        $scope.nextMonthInfo = {};
        $scope.dates = {};
        $scope.monthCalendar = function (month, year) {
            $scope.showLoader = true; 
            $scope.breadcrumbs =
                [{'name': 'Calendar', 'url': '#', 'isActive': false},
                    {'name': 'Month', 'url': '#', 'isActive':false}];
            $scope.showLoader = true;
            $scope.selectedMonthInfo = {};
            $scope.previousMonthInfo = {};
            $scope.nextMonthInfo = {};
            $scope.dates = {};
            var monthCalData = {month: month, year: year, token: $rootScope.token};
            var monthCalPath = $rootScope.com + 'calendar/monthcalendar';
            $http.post(monthCalPath, monthCalData).then(function (result) {
                $scope.selectedMonthInfo = result.data.selectedMonthInfo;
                $scope.previousMonthInfo = result.data.previousMonthInfo;
                $scope.nextMonthInfo = result.data.nextMonthInfo;
                $scope.dates = result.data.dates;
                $scope.showLoader = false;
            });
            $timeout(function(){
                $scope.showLoader = false;
            },2000);

        };

        $scope.week = {};
        $scope.week.current = {};
        $scope.week.next = {};
        $scope.week.previous = {};
        $scope.week.monday = {};
        $scope.week.tuesday = {};
        $scope.week.wednesday = {};
        $scope.week.thursday = {};
        $scope.week.friday = {};
        $scope.week.saturday = {};
        $scope.week.sunday = {};

        $scope.weekCalendar = function (week, year) {
            $scope.showLoader = true;
            $scope.breadcrumbs =
                [{'name': 'Calendar', 'url': '#', 'isActive': false},
                    {'name': 'Week', 'url': '#', 'isActive':false}];
            $scope.week = {};
            $scope.week.current = {};
            $scope.week.next = {};
            $scope.week.previous = {};
            $scope.week.monday = {};
            $scope.week.tuesday = {};
            $scope.week.wednesday = {};
            $scope.week.thursday = {};
            $scope.week.friday = {};
            $scope.week.saturday = {};
            $scope.week.sunday = {};
            var weekCalData = {week: week, year: year, token: $rootScope.token};
            var weekCalPath = $rootScope.com + 'calendar/weekcalendar';
            $http.post(weekCalPath, weekCalData).then(function (result) {
                
                $timeout(function(){
                $scope.showLoader = false;
                $scope.week.current = result.data.current;
                $scope.week.next = result.data.next;
                $scope.week.previous = result.data.previous;
                $scope.week.monday = result.data.monday;
                $scope.week.tuesday = result.data.tuesday;
                $scope.week.wednesday = result.data.wednesday;
                $scope.week.thursday = result.data.thursday;
                $scope.week.friday = result.data.friday;
                $scope.week.saturday = result.data.saturday;
                $scope.week.sunday = result.data.sunday;
            },300);
            });
            
        };

        $scope.day = {};
        $scope.day.current = {};
        $scope.day.next = {};
        $scope.day.previous = {};
        $scope.day.events = {};

        $scope.dayCalendar = function (day, month, year) {
            $scope.showLoader = true;
            $scope.breadcrumbs =
                [{'name': 'Calendar', 'url': '#', 'isActive': false},
                    {'name': 'Day', 'url': '#', 'isActive':false}];
            $scope.day.current = {};
            $scope.day.next = {};
            $scope.day.previous = {};
            $scope.day.events = {};

            var dayCalData = {day: day, month: month, year: year, token: $rootScope.token};
            var dayCalPath = $rootScope.com + 'calendar/daycalendar';
            $http.post(dayCalPath, dayCalData).then(function (result) {
                $scope.day.current = result.data.current;
                $scope.day.next = result.data.next;
                $scope.day.previous = result.data.previous;
                $scope.day.events = result.data.events;
            });
            $timeout(function(){
                $scope.showLoader = false;
            },300);
        };
        $scope.year = {};
        $scope.yearCalendar = {};
        $scope.yearCalendar.month = "";
        $scope.yearCalendar.year = "";
        $scope.yearCalendar = function (month1, year1) {
            $scope.showYearLoader = true;
            var yearCalData = {year: year1, month: month1, token: $rootScope.token};
            var yearCalPath = $rootScope.com + 'calendar/yearcalendar';
            $http.post(yearCalPath, yearCalData).then(function (result) {
                $scope.year = result.data;
                $scope.showYearLoader = false;
            });
            $timeout(function(){
                $scope.showYearLoader = false;
            },300);
        };

        $scope.sharedcalendarsData = {};
        $scope.sharedArr = [];
        $scope.sharedCalendars = function (month1, year1) {
            $scope.showLoader = true;
            $scope.breadcrumbs =
                [{'name': 'Calendar', 'url': '#', 'isActive': false},
                    {'name': 'Shared', 'url': '#', 'isActive':false}];

            var shareCalsData = {year: year1, month: month1, token: $rootScope.token};
            var shareCalsPath = $rootScope.com + 'calendar/sharedcalendars';
            $http.post(shareCalsPath, shareCalsData).then(function (result) {
                $scope.sharedcalendarsData = result.data;
                $scope.sharedArr = [];
                $scope.sharedArr[0] = 'mycalinsh';
                var i = 1;
                if (result.data != undefined) {
                angular.forEach(result.data, function (value, key) {
                    if (value['info']['id'] !== undefined) {
                        $scope.sharedArr[i] = value['info']['id'];
                        i++;
                    }
                });
            }
            });
            $timeout(function(){
                $scope.showLoader = false;
            },1000);
        };

        $scope.checkAllShared = function () {
            $timeout(function(){
                var shared = $scope.sharedArr;

            if (angular.element('#allshared').is(':checked')) {
                for (var j = 0; j < shared.length; j++) {
                    if (!angular.element('#_' + shared[j]).is(':checked')) {
                        angular.element('#_' + shared[j]).click();
                        $timeout(function(){}, 5000);
                        //  angular.element('#' + shared[j]).show();
                    }
                }
            } else {
                for (var j = 0; j < shared.length; j++) {
                    if (angular.element('#_' + shared[j]).is(':checked')) {
                        angular.element('#_' + shared[j]).click();
                        $timeout(function(){}, 5000);
                        //   angular.element('#' + shared[j]).hide();
                    }
                }
            }
            },500);

        };

        $scope.toggleSharedCalendar = function (id) {
            if (angular.element('#_' + id).is(':checked')) {
                angular.element('#' + id).show();
            } else {
                angular.element('#' + id).hide();
            }
        };

        $scope.showSharedCal = function () {
            if (angular.element('#sharedid').css('display') == 'none') {
                angular.element('#sharedid').css('display', 'block');
                angular.element('#parentShared').addClass('sidbar_active');
            } else {
                angular.element('#sharedid').css('display', 'none');
                angular.element('#parentShared').removeClass('sidbar_active');
            }
        };
        $scope.showCustomRightClickMenu = function (isEvent, tdid, id, isOpen) {


            if (isEvent == 1) {
//                angular.element('#' + tdid).contextPopup({
//                    items: [
//                        {label: 'Edit Event', icon: '', action: function () {
                //use id here to edit event
                if (isOpen == 0) {
                    $scope.editEvent.id = id;
                    var eventByIdData = {id: $scope.editEvent.id, token: $rootScope.token};
                    var eventByIdPath = $rootScope.com + 'calendar/event';
                    $http.post(eventByIdPath, eventByIdData).then(function (result) {
                        $scope.editEvent.title = result.data.event.title;
                        $scope.editEvent.description = result.data.event.content;
                        angular.element('#editEventFromDate').val(result.data.event.fromDate);
                        //angular.element('#editEventFromDate').datepick();
                        angular.element('#editEventToDate').val(result.data.event.toDate);
                        //angular.element('#editEventToDate').datepick();
                        $scope.editEvent.fromTime = result.data.event.fromTime;
                        $scope.editEvent.toTime = result.data.event.toTime;
                        var mail = result.data.event.inviteEmails;
                        var mails = mail.split(';');
                        var inviteMails = '';
                        for (var i = 0; i < (mails.length - 2); i++) {
                            var email = mails[i].trim();
                            if (email != "" && email != " ") {
                                inviteMails += '{ "email":"' + email + '", "first_name":"", "last_name":""},';
                            }
                        }
                        if (mails.length > 0 && mails[mails.length - 2] != "") {
                            var mail2 = mails[mails.length - 2].trim();
                            inviteMails += '{ "email":"' + mail2 + '", "first_name":"", "last_name":""}';
                        }
                        if (inviteMails != "") {
                            inviteMails = "[" + inviteMails + "]";
                        }
                        angular.element('#clearedit').val(inviteMails);
                        angular.element("#clearedit").click();
                        $scope.editEvent.location = result.data.event.location;
                        $scope.editEvent.allDay = result.data.event.allDay;
                        $scope.editEvent.color = result.data.event.eventcolor;
                        angular.element('#editEventColor').val(result.data.event.eventcolor);
                        $scope.editEvent.showMeAs = result.data.event.showMeAs;
                        $scope.editEvent.reoccurance = result.data.event.reoccurance;
                        if (result.data.event.reoccurance == 1) {
                            $scope.showSummary = 1;
                        } else {
                            $scope.showSummary = 0;
                        }
                        $scope.editEvent.notificationType = result.data.event.notificationType;
                        $scope.editEvent.remind = parseInt(result.data.event.remind, 10);
                        $scope.editEvent.daysOrWeeks = result.data.event.daysOrWeeks;
                        $scope.editEvent.hours = parseInt(result.data.event.hours, 10);
                        $scope.editEvent.minutes = parseInt(result.data.event.minutes, 10);
                        $scope.editEvent.attachedFiles = result.data.event.attachedFiles;
                        $scope.editEvent.fileName = "";
                        $scope.editEvent.newFileName = "";

                        $scope.editEvent.repeat = {};
                        $scope.editEvent.repeat.repeats = result.data.event.repeats;
                        $scope.editEvent.repeat.repeatName = "";
                        if ($scope.editEvent.repeat.repeats == 0) {
                            $scope.editEvent.repeat.repeatName = "days";
                        } else if ($scope.editEvent.repeat.repeats == 1) {
                            $scope.editEvent.repeat.repeatName = "";
                        } else if ($scope.editEvent.repeat.repeats == 2) {
                            $scope.editEvent.repeat.repeatName = "";
                        } else if ($scope.editEvent.repeat.repeats == 3) {
                            $scope.editEvent.repeat.repeatName = "";
                        } else if ($scope.editEvent.repeat.repeats == 4) {
                            $scope.editEvent.repeat.repeatName = "weeks";
                        } else if ($scope.editEvent.repeat.repeats == 5) {
                            $scope.editEvent.repeat.repeatName = "months";
                        } else if ($scope.editEvent.repeat.repeats == 6) {
                            $scope.editEvent.repeat.repeatName = "years";
                        }
                        $scope.editEvent.repeat.repeatEvery = result.data.event.repeat_every;
                        $scope.editEvent.repeat.repeatOnM = result.data.event.repeat_on_mon;
                        $scope.editEvent.repeat.repeatOnT = result.data.event.repeat_on_tue;
                        $scope.editEvent.repeat.repeatOnW = result.data.event.repeat_on_wed;
                        $scope.editEvent.repeat.repeatOnTh = result.data.event.repeat_on_thu;
                        $scope.editEvent.repeat.repeatOnF = result.data.event.repeat_on_fri;
                        $scope.editEvent.repeat.repeatOnSa = result.data.event.repeat_on_sat;
                        $scope.editEvent.repeat.repeatOnSu = result.data.event.repeat_on_sun;
                        $scope.editEvent.repeat.repeatBy = result.data.event.repeat_by;
                        $scope.editEvent.repeat.startOn = result.data.event.start_on;
                        $scope.editEvent.repeat.eventRepeatEnd = result.data.event.ends;
                        $scope.editEvent.repeat.after = result.data.event.ends_after;
                        $scope.editEvent.repeat.onDate = result.data.event.ends_on;
                        $scope.editEvent.repeat.summary = result.data.event.summary;
                        if (result.data.event.ends == "after") {
                            angular.element('#editRepeatEventAfter').removeAttr('disabled');
                            $scope.editEvent.repeat.onDate = "";
                        } else if (result.data.event.ends == "on") {
                            angular.element('#editRepeatEventEndOnDate1').removeAttr('disabled');
                            $scope.editEvent.repeat.after = "";
                        }
                        // $scope.editEvent.repeat.summary = "";

                        //   $scope.changeEditRepeatName();
                        //   $scope.eventEditRepeatEnd();
                        //   $scope.changeEditWeeklySummary();

                        $scope.editEvent.errorMessage = "";

                        if ($scope.editEvent.color == "label-info") {
                            angular.element('.eeditcolor').html('&nbsp;&nbsp;&nbsp;');
                            angular.element('#editcolor4').html('<i class=\'fa fa-check\'></i>');
                            angular.element('#editEventColor').val('label-info');
                        }
                        if ($scope.editEvent.color == "label-primary") {
                            angular.element('.eeditcolor').html('&nbsp;&nbsp;&nbsp;');
                            angular.element('#editcolor2').html('<i class=\'fa fa-check\'></i>');
                            angular.element('#editEventColor').val('label-primary');
                        }

                        if ($scope.editEvent.color == "event-color-green") {
                            angular.element('.eeditcolor').html('&nbsp;&nbsp;&nbsp;');
                            angular.element('#editcolor3').html('<i class=\'fa fa-check\'></i>');
                            angular.element('#editEventColor').val('event-color-green');
                        }

                        if ($scope.editEvent.color == "event-color-brown") {
                            angular.element('.eeditcolor').html('&nbsp;&nbsp;&nbsp;');
                            angular.element('#editcolor1').html('<i class=\'fa fa-check\'></i>');
                            angular.element('#editEventColor').val('event-color-brown');
                        }
                        if ($scope.editEvent.color == "event-color-yellow") {
                            angular.element('.eeditcolor').html('&nbsp;&nbsp;&nbsp;');
                            angular.element('#editcolor5').html('<i class=\'fa fa-check\'></i>');
                            angular.element('#editEventColor').val('event-color-yellow');
                        }
                        if ($scope.editEvent.color == "event-color-red") {
                            angular.element('.eeditcolor').html('&nbsp;&nbsp;&nbsp;');
                            angular.element('#editcolor6').html('<i class=\'fa fa-check\'></i>');
                            angular.element('#editEventColor').val('event-color-red');
                        }
                    });

                    angular.element('#modalediteventbtn').click();

//                    if($scope.editEvent.reoccurance == 1){
//                        angular.element('#editReoccuranceId').click();
//                    }
                } else if (isOpen == 1) {
                    $scope.editEvent.id = id;
                    var eventByIdData = {id: $scope.editEvent.id, token: $rootScope.token};
                    var eventByIdPath = $rootScope.com + 'calendar/event';
                    $http.post(eventByIdPath, eventByIdData).then(function (result) {
                        $scope.editEvent.title = result.data.event.title;
                        $scope.editEvent.description = result.data.event.content;
                        angular.element('#editEventFromDate').val(result.data.event.fromDate);
                        // angular.element('#editEventFromDate').datepick();
                        angular.element('#editEventToDate').val(result.data.event.toDate);
                        // angular.element('#editEventToDate').datepick();
                        $scope.editEvent.fromTime = result.data.event.fromTime;
                        $scope.editEvent.toTime = result.data.event.toTime;
                        //$scope.editEvent.inviteEmails = result.data.event.inviteEmails;
                        var mail = result.data.event.inviteEmails;
                        var mails = mail.split(';');
                        var inviteMails = '';
                        for (var i = 0; i < (mails.length - 2); i++) {
                            var email = mails[i].trim();
                            if (email != "" && email != " ") {
                                inviteMails += '{ "email":"' + email + '", "first_name":"", "last_name":""},';
                            }
                        }
                        if (mails.length > 0 && mails[mails.length - 2] != "") {
                            var mail2 = mails[mails.length - 2].trim();
                            inviteMails += '{ "email":"' + mail2 + '", "first_name":"", "last_name":""}';
                        }
                        if (inviteMails != "") {
                            inviteMails = "[" + inviteMails + "]";
                        }
                        angular.element('#clearedit').val(inviteMails);
                        angular.element("#clearedit").click();
                        $scope.editEvent.location = result.data.event.location;
                        $scope.editEvent.allDay = result.data.event.allDay;
                        $scope.editEvent.color = result.data.event.eventcolor;
                        angular.element('#editEventColor').val(result.data.event.eventcolor);
                        $scope.editEvent.showMeAs = result.data.event.showMeAs;
                        $scope.editEvent.reoccurance = result.data.event.reoccurance;
                        if (result.data.event.reoccurance == 1) {
                            $scope.showSummary = 1;
                        } else {
                            $scope.showSummary = 0;
                        }
                        $scope.editEvent.notificationType = result.data.event.notificationType;
                        $scope.editEvent.remind = parseInt(result.data.event.remind, 10);
                        $scope.editEvent.daysOrWeeks = result.data.event.daysOrWeeks;
                        $scope.editEvent.hours = parseInt(result.data.event.hours, 10);
                        $scope.editEvent.minutes = parseInt(result.data.event.minutes, 10);
                        $scope.editEvent.attachedFiles = result.data.event.attachedFiles;
                        $scope.editEvent.fileName = "";
                        $scope.editEvent.newFileName = "";

                        $scope.editEvent.repeat = {};
                        $scope.editEvent.repeat.repeats = result.data.event.repeats;
                        $scope.editEvent.repeat.repeatName = "";
                        if ($scope.editEvent.repeat.repeats == 0) {
                            $scope.editEvent.repeat.repeatName = "days";
                        } else if ($scope.editEvent.repeat.repeats == 1) {
                            $scope.editEvent.repeat.repeatName = "";
                        } else if ($scope.editEvent.repeat.repeats == 2) {
                            $scope.editEvent.repeat.repeatName = "";
                        } else if ($scope.editEvent.repeat.repeats == 3) {
                            $scope.editEvent.repeat.repeatName = "";
                        } else if ($scope.editEvent.repeat.repeats == 4) {
                            $scope.editEvent.repeat.repeatName = "weeks";
                        } else if ($scope.editEvent.repeat.repeats == 5) {
                            $scope.editEvent.repeat.repeatName = "months";
                        } else if ($scope.editEvent.repeat.repeats == 6) {
                            $scope.editEvent.repeat.repeatName = "years";
                        }
                        $scope.editEvent.repeat.repeatEvery = result.data.event.repeat_every;
                        $scope.editEvent.repeat.repeatOnM = result.data.event.repeat_on_mon;
                        $scope.editEvent.repeat.repeatOnT = result.data.event.repeat_on_tue;
                        $scope.editEvent.repeat.repeatOnW = result.data.event.repeat_on_wed;
                        $scope.editEvent.repeat.repeatOnTh = result.data.event.repeat_on_thu;
                        $scope.editEvent.repeat.repeatOnF = result.data.event.repeat_on_fri;
                        $scope.editEvent.repeat.repeatOnSa = result.data.event.repeat_on_sat;
                        $scope.editEvent.repeat.repeatOnSu = result.data.event.repeat_on_sun;
                        $scope.editEvent.repeat.repeatBy = result.data.event.repeat_by;
                        $scope.editEvent.repeat.startOn = result.data.event.start_on;
                        $scope.editEvent.repeat.eventRepeatEnd = result.data.event.ends;
                        $scope.editEvent.repeat.after = result.data.event.ends_after;
                        $scope.editEvent.repeat.onDate = result.data.event.ends_on;
                        $scope.editEvent.repeat.summary = result.data.event.summary;
                        // $scope.editEvent.repeat.summary = "";

                        //  $scope.changeEditRepeatName();
                        //  $scope.eventEditRepeatEnd();
                        //  $scope.changeEditWeeklySummary();
                        $scope.editEvent.errorMessage = "";
                        if ($scope.editEvent.color == "label-info") {
                            angular.element('.eeditcolor').html('&nbsp;&nbsp;&nbsp;');
                            angular.element('#editcolor4').html('<i class=\'fa fa-check\'></i>');
                            angular.element('#editEventColor').val('label-info');
                        }
                        if ($scope.editEvent.color == "label-primary") {
                            angular.element('.eeditcolor').html('&nbsp;&nbsp;&nbsp;');
                            angular.element('#editcolor2').html('<i class=\'fa fa-check\'></i>');
                            angular.element('#editEventColor').val('label-primary');
                        }

                        if ($scope.editEvent.color == "event-color-green") {
                            angular.element('.eeditcolor').html('&nbsp;&nbsp;&nbsp;');
                            angular.element('#editcolor3').html('<i class=\'fa fa-check\'></i>');
                            angular.element('#editEventColor').val('event-color-green');
                        }

                        if ($scope.editEvent.color == "event-color-brown") {
                            angular.element('.eeditcolor').html('&nbsp;&nbsp;&nbsp;');
                            angular.element('#editcolor1').html('<i class=\'fa fa-check\'></i>');
                            angular.element('#editEventColor').val('event-color-brown');
                        }
                        if ($scope.editEvent.color == "event-color-yellow") {
                            angular.element('.eeditcolor').html('&nbsp;&nbsp;&nbsp;');
                            angular.element('#editcolor5').html('<i class=\'fa fa-check\'></i>');
                            angular.element('#editEventColor').val('event-color-yellow');
                        }
                        if ($scope.editEvent.color == "event-color-red") {
                            angular.element('.eeditcolor').html('&nbsp;&nbsp;&nbsp;');
                            angular.element('#editcolor6').html('<i class=\'fa fa-check\'></i>');
                            angular.element('#editEventColor').val('event-color-red');
                        }
                    });
                    //  angular.element('#btn-default').click();

                    angular.element('#modalediteventbtn').click();
//                    if($scope.editEvent.reoccurance == 1){
//                        angular.element('#editReoccuranceId').click();
//                        
//                    }
                } else if (isOpen == 2) {
                    $scope.deleteEvent.id = id;
                    $scope.deleteEvent.errorMessage = "";
                    angular.element('#btn-default').click();
                    angular.element('#modaldeleteeventbtn').click();
                }
            } else {


                $scope.addEvent.ownerId = "";
                $scope.addEvent.title = "";
                $scope.addEvent.description = "";
                //$scope.addEvent.inviteEmails = "";
                // angular.element('#select-invite').html('');
                angular.element("#clearadd").click();
//                var $select = $('#select-invite').selectize();
//                var control = $select[0].selectize;
//                control.clear();
                $scope.addEvent.location = "";
                $scope.addEvent.allDay = "";
                $scope.addEvent.color = "";
                $scope.addEvent.showMeAs = "";
                $scope.addEvent.notificationType = "";
                $scope.addEvent.remind = "";
                $scope.addEvent.daysOrWeeks = "";
                $scope.addEvent.hours = "";
                $scope.addEvent.minutes = "";
                $scope.addEvent.reoccurance = "";
                $scope.addEvent.fileName = "";
                $scope.addEvent.newFileName = "";
                $scope.addEvent.repeat = {};
                $scope.addEvent.repeat.repeats = "";
                $scope.addEvent.repeat.repeatName = "";
                $scope.addEvent.repeat.repeatEvery = "";
                $scope.addEvent.repeat.repeatOnM = "";
                $scope.addEvent.repeat.repeatOnT = "";
                $scope.addEvent.repeat.repeatOnW = "";
                $scope.addEvent.repeat.repeatOnTh = "";
                $scope.addEvent.repeat.repeatOnF = "";
                $scope.addEvent.repeat.repeatOnSa = "";
                $scope.addEvent.repeat.repeatOnSu = "";
                $scope.addEvent.repeat.repeatBy = "";
                $scope.addEvent.repeat.startOn = "";
                $scope.addEvent.repeat.eventRepeatEnd = "";
                $scope.addEvent.repeat.after = "";
                $scope.addEvent.repeat.onDate = "";
                $scope.addEvent.repeat.summary = "";
                $scope.addEvent.errorMessage = "";
                $scope.showSummary = 0;



                // angular.element('#addEventFromDate').datepick({dateFormat: 'dd/mm/yyyy'});
                angular.element('#addEventFromDate').val(id);
                angular.element('#addEventFromTime').val("08 : 00 AM");


                //angular.element('#addEventToDate').datepick({dateFormat: 'dd/mm/yyyy'});
                angular.element('#addEventToDate').val(id);
                angular.element('#addEventToTime').val("05 : 00 PM");

                //angular.element('#addEventToDate').datepick({dateFormat: "dd/yyyy/mm"});

                angular.element('#modaladdeventbtn').click();

                // angular.element('#'+tdid).contextPopup({
                //     items: [
                //         {label: 'Add Event', icon: '', action: function () {
                //                 $scope.addEvent.errorMessage = "";

                //                 angular.element('#addEventFromDate').datepick({dateFormat: 'dd/mm/yyyy'});
                //                 angular.element('#addEventFromDate').val(id);
                //                 angular.element('#addEventFromTime').val("08 : 00 AM");
                //                 angular.element('#addEventToDate').datepick({dateFormat: 'dd/mm/yyyy'});
                //                 angular.element('#addEventToDate').val(id);
                //                 angular.element('#addEventToTime').val("05 : 00 PM");
                //                 //angular.element('#addEventToDate').datepick({dateFormat: "dd/yyyy/mm"});

                //                 angular.element('#modaladdeventbtn').click();
                //                 return false;
                //             }
                //         }
                //     ]
                // });
            }

        };

        $scope.setAddEventFromAndToTime = function (fromTime, toTime) {
            angular.element('#addEventFromTime').val(fromTime);
            angular.element('#addEventToTime').val(toTime);
        };

        $scope.emptyReoccurrance = function () {
            $scope.showSummary = 0;
            $scope.addEvent.repeat = {};
            $scope.addEvent.repeat.repeats = "";
            $scope.addEvent.repeat.repeatName = "";
            $scope.addEvent.repeat.repeatEvery = "";
            $scope.addEvent.repeat.repeatOnM = "";
            $scope.addEvent.repeat.repeatOnT = "";
            $scope.addEvent.repeat.repeatOnW = "";
            $scope.addEvent.repeat.repeatOnTh = "";
            $scope.addEvent.repeat.repeatOnF = "";
            $scope.addEvent.repeat.repeatOnSa = "";
            $scope.addEvent.repeat.repeatOnSu = "";
            $scope.addEvent.repeat.repeatBy = "";
            $scope.addEvent.repeat.startOn = "";
            $scope.addEvent.repeat.eventRepeatEnd = "";
            $scope.addEvent.repeat.after = "";
            $scope.addEvent.repeat.onDate = "";
            $scope.addEvent.repeat.summary = "";

            if (angular.element('#reoccuranceId').is(':checked')) {
                angular.element('#reoccuranceId').click();
            }

        };
        $scope.showElement = function (status) {
            if (status == 0) {
                return true;
            } else {
                return false;
            }
        };


        $scope.addEvent = {};
        $scope.addEvent.ownerId = "";
        $scope.addEvent.title = "";
        $scope.addEvent.description = "";
        $scope.addEvent.fromDate = "";
        $scope.addEvent.toDate = "";
        $scope.addEvent.fromTime = "";
        $scope.addEvent.toTime = "";
        //$scope.addEvent.inviteEmails = "";
        //angular.element('#select-invite').html('');
        angular.element("#clearadd").click();
        //angular.element('#selectize-input').html('');
//        var $select = $('#select-invite').selectize();
//        var control = $select[0].selectize;
//        control.clear();
        $scope.addEvent.location = "";
        $scope.addEvent.allDay = "";
        $scope.addEvent.color = "";
        $scope.addEvent.showMeAs = "";
        $scope.addEvent.notificationType = "";
        $scope.addEvent.remind = "";
        $scope.addEvent.daysOrWeeks = "";
        $scope.addEvent.hours = "";
        $scope.addEvent.minutes = "";
        $scope.addEvent.reoccurance = "";
        $scope.addEvent.fileName = "";
        $scope.addEvent.newFileName = "";
        $scope.addEvent.repeat = {};
        $scope.addEvent.repeat.repeats = "";
        $scope.addEvent.repeat.repeatName = "";
        $scope.addEvent.repeat.repeatEvery = "";
        $scope.addEvent.repeat.repeatOnM = "";
        $scope.addEvent.repeat.repeatOnT = "";
        $scope.addEvent.repeat.repeatOnW = "";
        $scope.addEvent.repeat.repeatOnTh = "";
        $scope.addEvent.repeat.repeatOnF = "";
        $scope.addEvent.repeat.repeatOnSa = "";
        $scope.addEvent.repeat.repeatOnSu = "";
        $scope.addEvent.repeat.repeatBy = "";
        $scope.addEvent.repeat.startOn = "";
        $scope.addEvent.repeat.eventRepeatEnd = "";
        $scope.addEvent.repeat.after = "";
        $scope.addEvent.repeat.onDate = "";
        $scope.addEvent.repeat.summary = "";
        $scope.addEvent.errorMessage = "";
        $scope.addEvent = function () {

            var repeatOnMon = 0;
            if (angular.element('#repeatOnMon').is(':checked')) {
                repeatOnMon = 1;
            } else {
                repeatOnMon = 0;
            }

            var repeatOnTue = 0;
            if (angular.element('#repeatOnTue').is(':checked')) {
                repeatOnTue = 1;
            } else {
                repeatOnTue = 0;
            }

            var repeatOnWed = 0;
            if (angular.element('#repeatOnWed').is(':checked')) {
                repeatOnWed = 1;
            } else {
                repeatOnWed = 0;
            }

            var repeatOnThu = 0;
            if (angular.element('#repeatOnThu').is(':checked')) {
                repeatOnThu = 1;
            } else {
                repeatOnThu = 0;
            }

            var repeatOnFri = 0;
            if (angular.element('#repeatOnFri').is(':checked')) {
                repeatOnFri = 1;
            } else {
                repeatOnFri = 0;
            }

            var repeatOnSat = 0;
            if (angular.element('#repeatOnSat').is(':checked')) {
                repeatOnSat = 1;
            } else {
                repeatOnSat = 0;
            }

            var repeatOnSun = 0;
            if (angular.element('#repeatOnSun').is(':checked')) {
                repeatOnSun = 1;
            } else {
                repeatOnSun = 0;
            }

            var repeatBy = "";
            if (angular.element('#repeatByMonth').is(':checked')) {
                repeatBy = "month";
            } else if (angular.element('#repeatByWeek').is(':checked')) {
                repeatBy = "week";
            }

            var eventRepeatEnd = "";
            if (angular.element('#eventRepeatEndOnNever').is(':checked')) {
                eventRepeatEnd = "never";
            } else if (angular.element('#eventRepeatEndOnAfter').is(':checked')) {
                eventRepeatEnd = "after";
            } else if (angular.element('#eventRepeatEndOnDate').is(':checked')) {
                eventRepeatEnd = "on";
            }

            var addEventData = {addEvent: 1, ownerId: $scope.addEvent.ownerId, title: $scope.addEvent.title, description: $scope.addEvent.description,
                fromDate: angular.element('#addEventFromDate').val(), toDate: angular.element('#addEventToDate').val(),
                fromTime: angular.element('#addEventFromTime').val(), toTime: angular.element('#addEventToTime').val(),
                email: angular.element('#select-invite').val(), location: $scope.addEvent.location, allday: $scope.addEvent.allDay,
                color: angular.element('#addEventColor').val(), showmeas: $scope.addEvent.showMeAs, notificationType: $scope.addEvent.notificationType,
                remind: $scope.addEvent.remind, daysOrWeeks: $scope.addEvent.daysOrWeeks, hours: $scope.addEvent.hours, minutes: $scope.addEvent.minutes,
                reoccurance: $scope.addEvent.reoccurance, fileName: $scope.addEvent.fileName, newFileName: $scope.addEvent.newFileName,
                repeats: angular.element('#repeats').val(), repeatEvery: angular.element('#repeatEvery').val(), repeatOnM: repeatOnMon,
                repeatOnT: repeatOnTue, repeatOnW: repeatOnWed, repeatOnTh: repeatOnThu, repeatOnF: repeatOnFri, repeatOnSa: repeatOnSat, repeatOnSu: repeatOnSun,
                repeatBy: repeatBy, startOn: angular.element('#eventRepeatStartOnDate').val(), eventRepeatEnd: eventRepeatEnd,
                after: angular.element('#editRepeatEventAfter').val(), onDate: angular.element('#repeatEventEndOnDate1').val(), summary: $scope.addEvent.repeat.summary, token: $rootScope.token};

            var addEventPath = $rootScope.com + 'calendar/addevent';
            $http.post(addEventPath, addEventData).then(function (result) {
                if (result.data.isError == 1) {
                    $scope.addEvent.errorMessage = result.data.errorMessage;
                    $scope.addEvent.successMessage = "";
                } else {
                    $scope.addEvent.errorMessage = "";
                    $scope.addEvent.successMessage = "";
                    $window.location.reload(true);
                }
            });
        };

        $scope.editEvent = {};
        $scope.editEvent.ownerId = "";
        $scope.editEvent.id = "";
        $scope.editEvent.title = "";
        $scope.editEvent.description = "";
        $scope.editEvent.fromDate = "";
        $scope.editEvent.toDate = "";
        $scope.editEvent.fromTime = "";
        $scope.editEvent.toTime = "";
        //$scope.editEvent.inviteEmails = "";
        angular.element('#select-edit-invite').html('');
//        var $select = $('#select-edit-invite').selectize();
//        var control = $select[0].selectize;
//        control.clear();
        $scope.editEvent.location = "";
        $scope.editEvent.allDay = "";
        $scope.editEvent.color = "label-info";
        $scope.editEvent.showMeAs = "";
        $scope.editEvent.notificationType = "";
        $scope.editEvent.remind = "";
        $scope.editEvent.daysOrWeeks = "";
        $scope.editEvent.hours = "";
        $scope.editEvent.minutes = "";
        $scope.editEvent.reoccurance = "";
        $scope.editEvent.attachedFiles = "";
        $scope.editEvent.fileName = "";
        $scope.editEvent.newFileName = "";
        $scope.editEvent.repeat = {};
        $scope.editEvent.repeat.repeats = "";
        $scope.editEvent.repeat.repeatName = "";
        $scope.editEvent.repeat.repeatEvery = "";
        $scope.editEvent.repeat.repeatOnM = "";
        $scope.editEvent.repeat.repeatOnT = "";
        $scope.editEvent.repeat.repeatOnW = "";
        $scope.editEvent.repeat.repeatOnTh = "";
        $scope.editEvent.repeat.repeatOnF = "";
        $scope.editEvent.repeat.repeatOnSa = "";
        $scope.editEvent.repeat.repeatOnSu = "";
        $scope.editEvent.repeat.repeatBy = "";
        $scope.editEvent.repeat.startOn = "";
        $scope.editEvent.repeat.eventRepeatEnd = "";
        $scope.editEvent.repeat.after = "";
        $scope.editEvent.repeat.onDate = "";
        $scope.editEvent.repeat.summary = "";
        $scope.editEvent.errorMessage = "";
        $scope.editEvent = function () {

            var repeatOnMon = 0;
            if (angular.element('#editRepeatOnMon').is(':checked')) {
                repeatOnMon = 1;
            } else {
                repeatOnMon = 0;
            }

            var repeatOnTue = 0;
            if (angular.element('#editRepeatOnTue').is(':checked')) {
                repeatOnTue = 1;
            } else {
                repeatOnTue = 0;
            }

            var repeatOnWed = 0;
            if (angular.element('#editRepeatOnWed').is(':checked')) {
                repeatOnWed = 1;
            } else {
                repeatOnWed = 0;
            }

            var repeatOnThu = 0;
            if (angular.element('#editRepeatOnThu').is(':checked')) {
                repeatOnThu = 1;
            } else {
                repeatOnThu = 0;
            }

            var repeatOnFri = 0;
            if (angular.element('#editRepeatOnFri').is(':checked')) {
                repeatOnFri = 1;
            } else {
                repeatOnFri = 0;
            }

            var repeatOnSat = 0;
            if (angular.element('#editRepeatOnSat').is(':checked')) {
                repeatOnSat = 1;
            } else {
                repeatOnSat = 0;
            }

            var repeatOnSun = 0;
            if (angular.element('#editRepeatOnSun').is(':checked')) {
                repeatOnSun = 1;
            } else {
                repeatOnSun = 0;
            }

            var repeatBy = "";
            if (angular.element('#editRepeatByMonth').is(':checked')) {
                repeatBy = "month";
            } else if (angular.element('#editRepeatByWeek').is(':checked')) {
                repeatBy = "week";
            }

            var eventRepeatEnd = "";
            if (angular.element('#eventEditRepeatEndOnNever').is(':checked')) {
                eventRepeatEnd = "never";
            } else if (angular.element('#eventEditRepeatEndOnAfter').is(':checked')) {
                eventRepeatEnd = "after";
            } else if (angular.element('#eventEditRepeatEndOnDate').is(':checked')) {
                eventRepeatEnd = "on";
            }

            var editEventData = {editEvent: 1, ownerId: $scope.editEvent.ownerId, id: $scope.editEvent.id, title: $scope.editEvent.title, description: $scope.editEvent.description,
                fromDate: angular.element('#editEventFromDate').val(), toDate: angular.element('#editEventToDate').val(), fromTime: $scope.editEvent.fromTime, toTime: $scope.editEvent.toTime,
                email: angular.element('#select-edit-invite').val(), location: $scope.editEvent.location, allday: $scope.editEvent.allDay,
                color: angular.element('#editEventColor').val(), showmeas: $scope.editEvent.showMeAs, notificationType: $scope.editEvent.notificationType,
                remind: $scope.editEvent.remind, daysOrWeeks: $scope.editEvent.daysOrWeeks, hours: $scope.editEvent.hours, minutes: $scope.editEvent.minutes,
                reoccurance: $scope.editEvent.reoccurance, fileName: $scope.editEvent.fileName, newFileName: $scope.editEvent.newFileName,
                repeats: angular.element('#editRepeats').val(), repeatEvery: angular.element('#editRepeatEvery').val(), repeatOnM: repeatOnMon,
                repeatOnT: repeatOnTue, repeatOnW: repeatOnWed, repeatOnTh: repeatOnThu,
                repeatOnF: repeatOnFri, repeatOnSa: repeatOnSat, repeatOnSu: repeatOnSun,
                repeatBy: repeatBy, startOn: angular.element('#eventEditRepeatStartOnDate').val(), eventRepeatEnd: eventRepeatEnd,
                after: angular.element('#editRepeatEventAfter').val(), onDate: angular.element('#editRepeatEventEndOnDate1').val(), summary: $scope.editEvent.repeat.summary, token: $rootScope.token};


            var editEventPath = $rootScope.com + 'calendar/editevent';
            $http.post(editEventPath, editEventData).then(function (result) {
                if (result.data.isError == 1) {
                    $scope.editEvent.errorMessage = result.data.errorMessage;
                    $scope.editEvent.successMessage = "";
                } else {
                    $scope.editEvent.errorMessage = "";
                    $scope.editEvent.successMessage = "";
                    //  angular.element('.btn-default').click();
                    $window.location.reload(true);
                }

            });
        };

        $scope.changeRepeatName = function () {
            if (angular.element('#repeats').val() == 0) {
                $scope.addEvent.repeat.repeatName = "days";
            } else if (angular.element('#repeats').val() == 4) {
                $scope.addEvent.repeat.repeatName = "weeks";
            } else if (angular.element('#repeats').val() == 5) {
                $scope.addEvent.repeat.repeatName = "months";
            } else if (angular.element('#repeats').val() == 6) {
                $scope.addEvent.repeat.repeatName = "years";
            }
        };

        $scope.changeEditRepeatName = function () {
            if ($scope.editEvent.repeat.repeats == 0) {
                $scope.editEvent.repeat.repeatName = "days";
            } else if ($scope.editEvent.repeat.repeats == 4) {
                $scope.editEvent.repeat.repeatName = "weeks";
            } else if ($scope.editEvent.repeat.repeats == 5) {
                $scope.editEvent.repeat.repeatName = "months";
            } else if ($scope.editEvent.repeat.repeats == 6) {
                $scope.editEvent.repeat.repeatName = "years";
            }
        };

        $scope.changeSummary = function () {
            var summary = "";
            if (angular.element('#repeats').val() == 0) {
                summary = "Daily";
                if (angular.element('#repeatEvery').val() > 1) {
                    summary = "Every " + angular.element('#repeatEvery').val() + " days";
                }
            } else if (angular.element('#repeats').val() == 1) {
                summary = "Weekly on weekdays";
            } else if (angular.element('#repeats').val() == 2) {
                summary = "Weekly on Monday, Wednesday, Friday";
            } else if (angular.element('#repeats').val() == 3) {
                summary = "Weekly on Tuesday, Thursday";
            } else if (angular.element('#repeats').val() == 4) {

                if (angular.element('#repeatEvery').val() > 1) {
                    summary = "Every " + angular.element('#repeatEvery').val() + " weeks on ";
                } else {
                    summary = "Weekly on ";
                }

                var repeatOnWeek = [];
                var i = 0;
                if (angular.element('#repeatOnMon').is(':checked')) {
                    repeatOnWeek[i] = "Monday";
                    i++;
                }
                if (angular.element('#repeatOnTue').is(':checked')) {
                    repeatOnWeek[i] = "Tuesday";
                    i++;
                }
                if (angular.element('#repeatOnWed').is(':checked')) {
                    repeatOnWeek[i] = "Wednesday";
                    i++;
                }
                if (angular.element('#repeatOnThu').is(':checked')) {
                    repeatOnWeek[i] = "Thursday";
                    i++;
                }
                if (angular.element('#repeatOnFri').is(':checked')) {
                    repeatOnWeek[i] = "Friday";
                    i++;
                }
                if (angular.element('#repeatOnSat').is(':checked')) {
                    repeatOnWeek[i] = "Saturday";
                    i++;
                }
                if (angular.element('#repeatOnSun').is(':checked')) {
                    repeatOnWeek[i] = "Sunday";
                    i++;
                }
                if (repeatOnWeek.length == 0) {
                    summary += "Monday";
                } else {
                    for (var j = 0; j < (repeatOnWeek.length) - 1; j++) {
                        summary += repeatOnWeek[j] + ", ";
                    }
                    summary += repeatOnWeek[(repeatOnWeek.length) - 1];
                }


            } else if (angular.element('#repeats').val() == 5) {

                var dateVa = angular.element('#eventRepeatStartOnDate').val();
                var dateArr = dateVa.split("/");
                if (angular.element('#repeatEvery').val() > 1) {
                    if ($('#repeatByWeek').is(':checked')) {
                        var monthSummary = $scope.getMonthSummary(dateArr[2], dateArr[1] - 1, dateArr[0]);
                        summary = "Every " + angular.element('#repeatEvery').val() + " months on the " + monthSummary;
                    } else {
                        summary = "Every " + angular.element('#repeatEvery').val() + " months on day " + dateArr[0];
                    }
                } else {

                    if (angular.element('#repeatByWeek').is(':checked')) {
                        var monthSummary = $scope.getMonthSummary(dateArr[2], dateArr[1] - 1, dateArr[0]);
                        summary = "Monthly on " + monthSummary;
                    } else {
                        summary = "Monthly on day " + dateArr[0];
                    }
                }
            } else if (angular.element('#repeats').val() == 6) {
                var dateVa = angular.element('#eventRepeatStartOnDate').val();
                var dateArr = dateVa.split("/");
                var monthName = "";
                if (dateArr[1] == 1) {
                    monthName = "January";
                } else if (dateArr[1] == 2) {
                    monthName = "Febuary";
                } else if (dateArr[1] == 3) {
                    monthName = "March";
                } else if (dateArr[1] == 4) {
                    monthName = "April";
                } else if (dateArr[1] == 5) {
                    monthName = "May";
                } else if (dateArr[1] == 6) {
                    monthName = "June";
                } else if (dateArr[1] == 7) {
                    monthName = "July";
                } else if (dateArr[1] == 8) {
                    monthName = "August";
                } else if (dateArr[1] == 9) {
                    monthName = "September";
                } else if (dateArr[1] == 10) {
                    monthName = "October";
                } else if (dateArr[1] == 11) {
                    monthName = "November";
                } else if (dateArr[1] == 12) {
                    monthName = "December";
                }
                if (angular.element('#repeatEvery').val() > 1) {
                    summary = "Every " + angular.element('#repeatEvery').val() + " years on " + monthName + " " + dateArr[0];
                } else {
                    summary = "Annually on " + monthName + " " + dateArr[0];
                }
            }

            if (angular.element('#eventRepeatEndOnAfter').is(':checked')) {
                summary += ", " + angular.element('#repeatEventAfter').val() + " times";
            } else if (angular.element('#eventRepeatEndOnDate').is(':checked')) {
                summary += ", until " + angular.element('#repeatEventEndOnDate1').val();
            }
            $scope.addEvent.repeat.summary = summary;
        };

        $scope.changeEditSummary = function () {
            var summary = "";
            if (angular.element('#editRepeats').val() == 0) {
                summary = "Daily";
                if (angular.element('#editRepeatEvery').val() > 1) {
                    summary = "Every " + angular.element('#editRepeatEvery').val() + " days";
                }
            } else if (angular.element('#editRepeats').val() == 1) {
                summary = "Weekly on weekdays";
            } else if (angular.element('#editRepeats').val() == 2) {
                summary = "Weekly on Monday, Wednesday, Friday";
            } else if (angular.element('#editRepeats').val() == 3) {
                summary = "Weekly on Tuesday, Thursday";
            } else if (angular.element('#editRepeats').val() == 4) {

                if (angular.element('#editRepeatEvery').val() > 1) {
                    summary = "Every " + angular.element('#editRepeatEvery').val() + " weeks on ";
                } else {
                    summary = "Weekly on ";
                }

                var repeatOnWeek = [];
                var i = 0;
                if (angular.element('#editRepeatOnMon').is(':checked')) {
                    repeatOnWeek[i] = "Monday";
                    i++;
                }
                if (angular.element('#editRepeatOnTue').is(':checked')) {
                    repeatOnWeek[i] = "Tuesday";
                    i++;
                }
                if (angular.element('#editRepeatOnWed').is(':checked')) {
                    repeatOnWeek[i] = "Wednesday";
                    i++;
                }
                if (angular.element('#editRepeatOnThu').is(':checked')) {
                    repeatOnWeek[i] = "Thursday";
                    i++;
                }
                if (angular.element('#editRepeatOnFri').is(':checked')) {
                    repeatOnWeek[i] = "Friday";
                    i++;
                }
                if (angular.element('#editRepeatOnSat').is(':checked')) {
                    repeatOnWeek[i] = "Saturday";
                    i++;
                }
                if (angular.element('#editRepeatOnSun').is(':checked')) {
                    repeatOnWeek[i] = "Sunday";
                    i++;
                }
                if (repeatOnWeek.length == 0) {
                    summary += "Monday";
                } else {
                    for (var j = 0; j < (repeatOnWeek.length) - 1; j++) {
                        summary += repeatOnWeek[j] + ", ";
                    }
                    summary += repeatOnWeek[(repeatOnWeek.length) - 1];
                }


            } else if (angular.element('#editRepeats').val() == 5) {

                var dateVa = angular.element('#eventEditRepeatStartOnDate').val();
                var dateArr = dateVa.split("/");
                if (angular.element('#editRepeatEvery').val() > 1) {
                    if ($('#editRepeatByWeek').is(':checked')) {
                        var monthSummary = $scope.getMonthSummary(dateArr[2], dateArr[1] - 1, dateArr[0]);
                        summary = "Every " + angular.element('#editRepeatEvery').val() + " months on the " + monthSummary;
                    } else {
                        summary = "Every " + angular.element('#editRepeatEvery').val() + " months on day " + dateArr[0];
                    }
                } else {

                    if (angular.element('#editRepeatByWeek').is(':checked')) {
                        var monthSummary = $scope.getMonthSummary(dateArr[2], dateArr[1] - 1, dateArr[0]);
                        summary = "Monthly on " + monthSummary;
                    } else {
                        summary = "Monthly on day " + dateArr[0];
                    }
                }
            } else if (angular.element('#editRepeats').val() == 6) {
                var dateVa = angular.element('#eventEditRepeatStartOnDate').val();
                var dateArr = dateVa.split("/");
                var monthName = "";
                if (dateArr[1] == 1) {
                    monthName = "January";
                } else if (dateArr[1] == 2) {
                    monthName = "Febuary";
                } else if (dateArr[1] == 3) {
                    monthName = "March";
                } else if (dateArr[1] == 4) {
                    monthName = "April";
                } else if (dateArr[1] == 5) {
                    monthName = "May";
                } else if (dateArr[1] == 6) {
                    monthName = "June";
                } else if (dateArr[1] == 7) {
                    monthName = "July";
                } else if (dateArr[1] == 8) {
                    monthName = "August";
                } else if (dateArr[1] == 9) {
                    monthName = "September";
                } else if (dateArr[1] == 10) {
                    monthName = "October";
                } else if (dateArr[1] == 11) {
                    monthName = "November";
                } else if (dateArr[1] == 12) {
                    monthName = "December";
                }
                if (angular.element('#editRepeatEvery').val() > 1) {
                    summary = "Every " + angular.element('#editRepeatEvery').val() + " years on " + monthName + " " + dateArr[0];
                } else {
                    summary = "Annually on " + monthName + " " + dateArr[0];
                }
            }

            if (angular.element('#eventEditRepeatEndOnAfter').is(':checked')) {
                summary += ", " + angular.element('#editRepeatEventAfter').val() + " times";
            } else if (angular.element('#eventEditRepeatEndOnDate').is(':checked')) {
                summary += ", until " + angular.element('#editRepeatEventEndOnDate1').val();
            }
            $scope.editEvent.repeat.summary = summary;
        };

        $scope.getMonthSummary = function (year, month, day1) {
            var newDate = new Date(year, month, day1);
            var day = newDate.getDay();
            var dayName = "";
            if (day == 0) {
                dayName = "Sunday";
            } else if (day == 1) {
                dayName = "Monday";
            } else if (day == 2) {
                dayName = "Tuesday";
            } else if (day == 3) {
                dayName = "Wednesday";
            } else if (day == 4) {
                dayName = "Thursday";
            } else if (day == 5) {
                dayName = "Friday";
            } else if (day == 6) {
                dayName = "Saturday";
            }
            var count = 0;
            for (var i = 1; i <= 31; i++) {
                var eachDate = new Date(year, month, i);
                var eachday = eachDate.getDay();
                if (eachday == day) {
                    count++;
                }
                if (i == day1) {
                    break;
                }
            }
            var countName = "";
            if (count == 1) {
                countName = "first";
            } else if (count == 2) {
                countName = "second";
            } else if (count == 3) {
                countName = "third";
            } else if (count == 4) {
                countName = "fourth";
            } else if (count == 5) {
                countName = "last";
            }

            return countName + " " + dayName;
        };

        $scope.eventRepeatEnd = function () {
            if ($('#eventRepeatEndOnNever').is(':checked')) {
                angular.element('#repeatEventEndOnDate1').attr('disabled', 'disabled');
                angular.element('#repeatEventEndOnDate1').val('');
                angular.element('#repeatEventAfter').attr('disabled', 'disabled');
                angular.element('#repeatEventAfter').val('');
            }
            if ($('#eventRepeatEndOnAfter').is(':checked')) {
                angular.element('#repeatEventAfter').removeAttr('disabled');
                angular.element('#repeatEventAfter').val('');
                angular.element('#repeatEventEndOnDate1').attr('disabled', 'disabled');
                angular.element('#repeatEventEndOnDate1').val('');
            }
            if ($('#eventRepeatEndOnDate').is(':checked')) {
                angular.element('#repeatEventEndOnDate1').removeAttr('disabled');
                angular.element('#repeatEventEndOnDate1').val('');
                angular.element('#repeatEventAfter').attr('disabled', 'disabled');
                angular.element('#repeatEventAfter').val('');
            }
        };

        $scope.eventEditRepeatEnd = function () {
            if ($('#eventEditRepeatEndOnNever').is(':checked')) {
                angular.element('#editRepeatEventEndOnDate1').attr('disabled', 'disabled');
                angular.element('#editRepeatEventEndOnDate1').val();
                angular.element('#editRepeatEventAfter').attr('disabled', 'disabled');
                angular.element('#editRepeatEventAfter').val('');
            }
            if ($('#eventEditRepeatEndOnAfter').is(':checked')) {
                angular.element('#editRepeatEventAfter').removeAttr('disabled');
                angular.element('#editRepeatEventAfter').val('');
                angular.element('#editRepeatEventEndOnDate1').attr('disabled', 'disabled');
                angular.element('#editRepeatEventEndOnDate1').val();
            }
            if ($('#eventEditRepeatEndOnDate').is(':checked')) {
                angular.element('#editRepeatEventEndOnDate1').removeAttr('disabled');
                angular.element('#editRepeatEventEndOnDate1').val();
                angular.element('#editRepeatEventAfter').attr('disabled', 'disabled');
                angular.element('#editRepeatEventAfter').val('');
            }
        };

        $scope.deleteEvent = {};
        $scope.deleteEvent.id = "";
        $scope.deleteEvent.errorMessage = "";
        $scope.deleteEvent = function () {
            var deleteEventData = {id: $scope.deleteEvent.id, token: $rootScope.token};
            var deleteEventPath = $rootScope.com + 'calendar/deleteevent';
            $http.post(deleteEventPath, deleteEventData).then(function (result) {
                angular.element("#event_" + $scope.deleteEvent.id).hide();
                angular.element('.btn-default').click();
                // $window.location.reload(true);
            });
        };
        $scope.openEvent = {};
        $scope.openEvent.eventId = "";
        $scope.openEvent.etid = "";
        $scope.openEvent.attachedFiles = "";


        $scope.openEvent = function (id, title, content, fromDate, toDate, fromTime, toTime, etid, inviteEmails, location, allDay, eventcolor,
                showMeAs, reoccurance, notificationType, remind, daysOrWeeks, hours, minutes, attachedFiles, repeats, repeatEvery, repeatOnM, repeatOnT,
                repeatOnW, repeatOnTh, repeatOnF, repeatOnSa, repeatOnSu, repeatBy, startOn, eventRepeatEnd, after, onDate) {

            $scope.openEvent.eventId = id;
            $scope.openEvent.etid = etid;
            $scope.openEvent.attachedFiles = attachedFiles;
            angular.element('#eventTitle').html(title);
            angular.element('#eventBody').html(content);
            angular.element('#eventFromDate').html(fromDate);
            angular.element('#eventToDate').html(toDate);
            angular.element('#eventFromTime').html(fromTime);
            angular.element('#eventToTime').html(toTime);
            angular.element('#eventLocation').html(location);
            angular.element('#eventInviteAttendees').html(inviteEmails);
            angular.element('#eventColor').removeAttr("class");
            angular.element('#eventColor').addClass(eventcolor);
            var allDayCheck = "";
            if (allDay == 1) {
                allDayCheck = "Yes";
            } else {
                allDayCheck = "No";
            }
            angular.element('#eventAllDay').html(allDayCheck);
            var reoccuranceCheck = "";
            if (reoccurance == 1) {
                reoccuranceCheck = "Yes";
            } else {
                reoccuranceCheck = "No";
            }
            angular.element('#eventReoccurance').html(reoccuranceCheck);
            var notification = "";
            if (notificationType == "1") {
                notification = "Pop-up";
            } else if (notificationType == "2") {
                notification = "Email";
            }
            angular.element('#eventNotification').html(notification);
            angular.element('#eventHours').html(hours);
            angular.element('#eventReminder').html(remind);
            angular.element('#eventMinutes').html(minutes);
            var daysOrWeeksCheck = "";
            if (daysOrWeeks == "1") {
                daysOrWeeksCheck = "Days";
            } else if (daysOrWeeks == "2") {
                daysOrWeeksCheck = "Weeks";
            }
            angular.element('#eventDayOrWeeks').html(daysOrWeeksCheck);
            angular.element('#eventShowMeAs').html(showMeAs);
            var repeatsText = "";
            if (repeats == 0) {
                repeatsText = "Daily";
            }
            if (repeats == 1) {
                repeatsText = "Every weekday (Monday to Friday)";
            }
            if (repeats == 2) {
                repeatsText = "Every Monday, Wednesday, and Friday";
            }
            if (repeats == 3) {
                repeatsText = "Every Tuesday and Thursday";
            }
            if (repeats == 4) {
                repeatsText = "Weekly";
            }
            if (repeats == 5) {
                repeatsText = "Monthly";
            }
            if (repeats == 6) {
                repeatsText = "Yearly";
            }
            angular.element('#openRepeats').html(repeatsText);
            angular.element('#openRepeatEvery').html(repeatEvery);
            var repeatOnD = "";
            if (repeatOnM == 1) {
                repeatOnD += "Mon, ";
            }
            if (repeatOnT == 1) {
                repeatOnD += "Tue, ";
            }
            if (repeatOnW == 1) {
                repeatOnD += "Wed, ";
            }
            if (repeatOnTh == 1) {
                repeatOnD += "Thu, ";
            }
            if (repeatOnF == 1) {
                repeatOnD += "Fri, ";
            }
            if (repeatOnSa == 1) {
                repeatOnD += "Sat, ";
            }
            if (repeatOnSu == 1) {
                repeatOnD += "Sun, ";
            }
            angular.element('#openRepeatOn').html(repeatOnD);
            angular.element('#openRepeatBy').html(repeatBy);
            angular.element('#openRepeatStartOn').html(startOn);
            angular.element('#openRepeatEnds').html(eventRepeatEnd);
            angular.element('#openRepeatEndsOn').html(onDate);
            angular.element('#openRepeatEndsAfter').html(after);
            angular.element('#modaleventbtn').click();
            //angular.element('#addEventClose').click();
        };

        $scope.users = {};
        $scope.getUsers = function () {
            $scope.users = {};
            var usersData = {token: $rootScope.token};
            var usersPath = $rootScope.com + 'calendar/users';
            $http.post(usersPath, usersData).then(function (result) {
                $scope.users = result.data;
            });
        };

        $scope.showDayCalendar = function () {
            angular.element('#eventcalendar').css('display', 'block');
            angular.element('#monthCalendar').css('display', 'none');
            angular.element('#weekCalendar').css('display', 'none');
            angular.element('#sharedCalendars').css('display', 'none');
            angular.element('#dayCalendar').css('display', 'block');
            angular.element('#calendarSetting').css('display', 'none');
            angular.element('#daycalendarscroll').animate({scrollTop: 400});
        };

        $scope.shareCalendar = {};
        $scope.shareCalendar.users = [];
        $scope.shareCalendar.level = "";
        $scope.shareCalendar.message = "";
        $scope.shareCalendar = function () {
            var users1 = "";
            angular.forEach($scope.shareCalendar.users, function (value, key) {
                users1 += value + ",";
            });
            var shareCalData = {users: angular.element('#share-users').val(), level: $scope.shareCalendar.level, message: $scope.shareCalendar.message, token: $rootScope.token};
            var shareCalPath = $rootScope.com + 'calendar/sharecalendar';
            $http.post(shareCalPath, shareCalData).then(function (result) {
                if (result.data.isError == 1) {
                    $scope.editEvent.errorMessage = result.data.errorMessage;
                    $scope.editEvent.successMessage = "";
                } else {
                    $scope.editEvent.errorMessage = "";
                    $scope.editEvent.successMessage = "";
                }

            });
        };

        $scope.viewAllEvents = function (eventdate) {
            angular.element('#dayevent_' + eventdate).css('display', 'none');
            angular.element('#allevents_' + eventdate).css('display', 'block');
        };

        $scope.hideAllEvents = function (eventdate) {
            angular.element('#dayevent_' + eventdate).css('display', 'block');
            angular.element('#allevents_' + eventdate).css('display', 'none');
        };
        $scope.hideSharedCalendar = function (shareid) {
            angular.element('#' + shareid).hide();
            return false;
        };

        $scope.OpenRepeatModel = function () {
            if ($('#reoccuranceId').is(':checked')) {
                $timeout(function(){
                    angular.element('#modalrepeatevent').modal({show: true});
                },500);
                $scope.showSummary = 1;
                angular.element('#eventRepeatStartOnDate').val(angular.element('#addEventFromDate').val());
                

               // angular.element('#modalrepeateventbtn').click();
                //$scope.emptyReoccurrance();
            } else {
                $scope.showSummary = 0;
            }
        };

        $scope.OpenEditRepeatModel = function () {
            if ($('#editReoccuranceId').is(':checked')) {
                $scope.showSummary = 1;
                angular.element('#eventEditRepeatStartOnDate').val(angular.element('#editEventFromDate').val());
                $('#modaleditrepeateventbtn').click();
            } else {
                $scope.showSummary = 0;
            }
        };

        $scope.showMonthCalendar = function () {
            angular.element('#eventcalendar').css('display', 'block');
            angular.element('#monthCalendar').css('display', 'block');
            angular.element('#weekCalendar').css('display', 'none');
            angular.element('#dayCalendar').css('display', 'none');
            angular.element('#sharedCalendars').css('display', 'none');
            angular.element('#calendarSetting').css('display', 'none');
        };

        $scope.setOwnerId = function (ownerId) {
            $scope.addEvent.ownerId = ownerId;
        };

        $scope.setEditOwnerId = function (ownerId) {
            $scope.editEvent.ownerId = ownerId;
        };



	 $scope.$root.load_date_picker('contact'); 
    }]);

function EventFileUploadController($scope, $rootScope, Upload, $timeout, toaster) {
    $scope.addEventAttachment = {};
    $scope.addEvent.fileName = "";
    $scope.addEvent.newFileName = "";
    $scope.editEvent.fileName = "";
    $scope.editEvent.newFileName = "";
    $scope.showLoader = false;
    $scope.uploadFiles = function (file, errFiles) {

        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        var postUrl = $rootScope.com + 'calendar/uploadfile';

        if (file) {
            $scope.showLoader = true;
            file.upload = Upload.upload({
                url: postUrl,
                data: {file: file, token: $rootScope.token}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                    $scope.addEvent.fileName = response.data.fileName;
                    $scope.addEvent.newFileName = response.data.newFileName;
                    $scope.editEvent.fileName = response.data.fileName;
                    $scope.editEvent.newFileName = response.data.newFileName;
                    $scope.showLoader = false;
                    toaster.pop('success', 'File Upload', 'File Uploaded Successfully');
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
                $scope.showLoader = false;
                toaster.pop('error', 'File Upload', 'Error in File uploaded!');
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                $scope.showLoader = false;
                toaster.pop('error', 'File Upload', 'Error in File uploaded!');
            });
        } else {
            $scope.showLoader = false;
            toaster.pop('error', 'File Upload', 'Error in File uploaded!');
        }
    };
}

