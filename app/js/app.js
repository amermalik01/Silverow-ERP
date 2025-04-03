/*!
 *
 * Angle - Bootstrap Admin App + AngularJS
 *
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: http://support.wrapbootstrap.com/knowledge_base/topics/usage-licenses
 *
 */

if (typeof $ === 'undefined') {
    throw new Error('This application\'s JavaScript requires jQuery');
}

// APP START
// -----------------------------------
/* 'ngAnimate',*/

var App = angular.module('angle', ['ngRoute', 'ngStorage', 'ngCookies', 'pascalprecht.translate', 'ui.bootstrap', 'ui.router', 'oc.lazyLoad', 'cfp.loadingBar', 'ngSanitize', 'ngResource', 'ui.utils', 'ngFileUpload', 'dc.endlessScroll', 'ui.select', 'summernote', 'angularModalService', 'unsavedChanges', 'chart.js', 'ngDialog', 'toaster'])
    .run(["$rootScope", "$state", "$http", "$stateParams", '$window', '$templateCache', 'ngDialog', 'toaster', 'moduleTracker', '$q', function ($rootScope, $state, $http, $stateParams, $window, $templateCache, ngDialog, toaster, moduleTracker, $q) {

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$storage = $window.localStorage;
        $rootScope.silverowVersionNumber = "1.0.20";
        $rootScope.silverowVersionDate = "22th July 2020";

        // Scope Globals
        // -----------------------------------
        $rootScope.maxHttpRepeatCount = 3;

        $rootScope.app = {
            name: 'Nevico',
            description: 'Nevico ERP/CRM',
            year: ((new Date()).getFullYear()),
            layout: {
                isFixed: true,
                isCollapsed: false,
                isBoxed: false,
                isRTL: false,
                horizontal: false,
                isFloat: false,
                asideHover: false,
                isBodyColor: false
            },
            useFullLayout: false,
            hiddenFooter: false,
            viewAnimation: 'ng-fadeInUp'
        };

        $rootScope.user = {
            name: 'Nevid',
            job: 'ng-Dev',
            picture: 'app/img/user/imran.jpg'
        };

        $rootScope.myStages = [{
            name: "Order",
            state: "active",
            chk: false,
            rank: 0
        },
        {
            name: "Check Stock",
            state: "outstanding",
            chk: false,
            rank: 1
        },
        {
            name: "Purchase",
            state: "outstanding",
            chk: false,
            rank: 2
        },
        {
            name: "Dispatch",
            state: "outstanding",
            chk: false,
            rank: 3
        },
        {
            name: "Delivered",
            state: "outstanding",
            chk: false,
            rank: 4
        },
        {
            name: "Received",
            state: "outstanding",
            chk: false,
            rank: 5
        }
        ];

        $rootScope.toggleSidebarShow = true;

        $rootScope.toggleSidebarShowFtn = function () {
            $rootScope.toggleSidebarShow = !$rootScope.toggleSidebarShow;
        }

        $rootScope.show_default = true;

        // API base urls of modules
        $rootScope.hr = 'api/hr/';
        $rootScope.setup = 'api/setup/';
        $rootScope.stock = 'api/stock/';
        $rootScope.sales = 'api/sales/';
        $rootScope.com = 'api/communication/';
        $rootScope.gl = 'api/gl/';
        $rootScope.pr = 'api/purchase/';
        $rootScope.dashboard = 'api/dashboard/';
        $rootScope.reports = 'api/reports/';

        // $rootScope.jsreports = 'https://silverowreports.azurewebsites.net/api/report';
        $rootScope.jsreports = 'https://silverowjsreport2.azurewebsites.net/api/report';
        // $rootScope.jsreports = 'https://srjsreport2.azurewebsites.net/api/report';

        // Global variables
        $rootScope.product_id = 0;
        $rootScope.company_id = 0;
        $rootScope.currency_id = 0;
        $rootScope.date_format = 0;
        $rootScope.country_id = 0;
        $rootScope.model_code = '';
        $rootScope.opp_cycle_limit = '';
        //   $rootScope.text_limit = '';

        $rootScope.breadcrumbs = [];
        $rootScope.dateFormats = [];
        $rootScope.timeFormats = [];
        $rootScope.ngDateFormats = [];

        $rootScope.defaultDateFormat = 1;
        $rootScope.defaultTimeFormat = 1;
        $rootScope.defaultCurrencyCode = '';
        $rootScope.customerCurrencyCode = '';

        $rootScope.defaultCurrency = 0;
        $rootScope.defaultCountry = 0;
        $rootScope.defaultTimeZone = 0;
        $rootScope.defaultCompany = 0;

        $rootScope.defaultLogo = '';
        $rootScope.oop_cycle_edit_role = '';
        $rootScope.oppCycleFreqstartmonth = '';

        $rootScope.showServices = true;

        $rootScope.CRMType = 1;
        $rootScope.SRMType = 2;

        // Time Format
        $rootScope.timeAM = 1;
        $rootScope.time24 = 2;
        $rootScope.timeFormats[$rootScope.timeAM] = 'hh:mm a';
        $rootScope.timeFormats[$rootScope.time24] = 'HH:mm';

        // Date Format
        $rootScope.dtYMD = 1;
        $rootScope.dtMDY = 2;
        $rootScope.dtDMY = 3;
        $rootScope.pagination_limit = 25;

        $rootScope.dateFormats[$rootScope.dtYMD] = 'yy/mm/dd';
        $rootScope.dateFormats[$rootScope.dtMDY] = 'mm/dd/yy';
        $rootScope.dateFormats[$rootScope.dtDMY] = 'dd/mm/yy';
        $rootScope.ngDateFormats[$rootScope.dtYMD] = 'yyyy/MM/dd';
        $rootScope.ngDateFormats[$rootScope.dtMDY] = 'MM/dd/yyyy';
        $rootScope.ngDateFormats[$rootScope.dtDMY] = 'dd/MM/yyyy';

        // Base path
        $rootScope.basePath = 'http://' + window.location.hostname + (window.location.port ? (":" + window.location.port) : "") + window.location.pathname;

        $rootScope.imagePath = $rootScope.basePath + 'upload/company_logo_temp/';
        $rootScope.mailAttachmentPath = $rootScope.basePath + 'upload/mail_attachments/';
        $rootScope.expenseFilesPath = $rootScope.basePath + 'upload/expenses_files/';

        $rootScope.tbl_records2 = {
            'headers': {
                'top_header': ['Item', 'Description', 'Category', 'UOM', 'StdPrice', 'StdPricelCY', 'priceoffer', 'lCY', 'Min', 'Max'],
                'inner_header': ['Min Order', 'Discount', 'Price'],
                'additional_cost_header': ['LandingCost', 'Price', 'SelectedGL'],
            },
            'data': [{
                'itemData': {
                    'Item': 'Prod0041',
                    'Description': 'This is a desp',
                    'Category': 'This is a category',
                    'UOM': 'piece',
                    'StdPrice': '10',
                    'StdPricelCY': '52',
                    'lCY': '34',
                    'Min': '100',
                    'Max': '200',
                    'priceoffer': 50
                },
                'discountDetails': {
                    'rows': [{
                        'Discount': '20',
                        'Price': '10',
                        'Min Order': '50'
                    }, {
                        'Discount': '30',
                        'Price': '20',
                        'Min Order': '45'
                    }, {
                        'Price': '20',
                        'Discount': '30',
                        'Min Order': '20'
                    }, {
                        'Price': '30',
                        'Discount': '21',
                        'Min Order': '45'
                    }, {
                        'Price': '21',
                        'Discount': '37',
                        'Min Order': '21'
                    }, {
                        'Price': '20',
                        'Discount': '30',
                        'Min Order': '20'
                    }, {
                        'Price': '30',
                        'Discount': '21',
                        'Min Order': '45'
                    }, {
                        'Price': '21',
                        'Discount': '37',
                        'Min Order': '21'
                    }]
                },
                'additionalCostDetails': {
                    'rows': [{
                        'LandingCost': 'Shunting Cost',
                        'Price': '20',
                        'SelectedGL': '1610'
                    }, {
                        'LandingCost': 'Packing Cost',
                        'Price': '30',
                        'SelectedGL': '1615'
                    }]
                }
            },
            {
                'itemData': {
                    'Item': 'Prod0044',
                    'Description': 'This is a desp',
                    'Category': 'This is a category',
                    'UOM': 'Truck',
                    'StdPrice': '20',
                    'StdPricelCY': '22',
                    'lCY': '64',
                    'Min': '150',
                    'Max': '300',
                    'priceoffer': 2
                },
                'discountDetails': {
                    'rows': [{
                        'Price': '25',
                        'Discount': '40',
                        'Min Order': '10'
                    }, {
                        'Price': '27',
                        'Discount': '50',
                        'Min Order': '15'
                    }, {
                        'Price': '46',
                        'Discount': '30',
                        'Min Order': '50'
                    }, {
                        'Price': '63',
                        'Discount': '20',
                        'Min Order': '150'
                    }]
                },
                'additionalCostDetails': {
                    'rows': [{
                        'LandingCost': 'Shunting Cost',
                        'Price': '20',
                        'SelectedGL': '1610'
                    }, {
                        'LandingCost': 'Packing Cost',
                        'Price': '30',
                        'SelectedGL': '1615'
                    }]
                }
            },
            {
                'itemData': {
                    'Item': 'Prod0046',
                    'Description': 'This is a desp',
                    'Category': 'This is a category',
                    'UOM': 'Pallate',
                    'StdPrice': '40',
                    'StdPricelCY': '15',
                    'lCY': '30',
                    'Min': '20',
                    'Max': '40',
                    'priceoffer': 25
                },
                'discountDetails': {
                    'rows': [{
                        'Price': '12',
                        'Discount': '30',
                        'Min Order': '80'
                    },
                    {
                        'Price': '45',
                        'Discount': '390',
                        'Min Order': '250'
                    },
                    {
                        'Price': '63',
                        'Discount': '20',
                        'Min Order': '150'
                    }
                    ]
                },
                'additionalCostDetails': {
                    'rows': [{
                        'LandingCost': 'Shunting Cost',
                        'Price': '20',
                        'SelectedGL': '1610'
                    }, {
                        'LandingCost': 'Packing Cost',
                        'Price': '30',
                        'SelectedGL': '1615'
                    }]
                }
            },
            {
                'itemData': {
                    'Item': 'Prod0049',
                    'Description': 'This is a desp',
                    'Category': 'This is a category',
                    'UOM': 'Pallate',
                    'StdPrice': '50',
                    'StdPricelCY': '80',
                    'lCY': '41',
                    'Min': '80',
                    'Max': '200',
                    'priceoffer': 50
                },
                'discountDetails': {
                    'rows': [{
                        'Price': '10',
                        'Discount': '20',
                        'Min Order': '50'
                    }, {
                        'Price': '20',
                        'Discount': '30',
                        'Min Order': '45'
                    }]
                },
                'additionalCostDetails': {
                    'rows': [{
                        'LandingCost': 'Shunting Cost',
                        'Price': '20',
                        'SelectedGL': '1610'
                    }, {
                        'LandingCost': 'Packing Cost',
                        'Price': '30',
                        'SelectedGL': '1615'
                    }]
                }
            },
            {
                'itemData': {
                    'Item': 'Prod0041',
                    'Description': 'This is a desp',
                    'Category': 'This is a category',
                    'UOM': 'piece',
                    'StdPrice': '10',
                    'StdPricelCY': '52',
                    'lCY': '34',
                    'Min': '100',
                    'Max': '200',
                    'priceoffer': 50
                },
                'discountDetails': {
                    'rows': [{
                        'Price': '10',
                        'Discount': '20',
                        'Min Order': '50',
                    }, {
                        'Price': '29',
                        'Discount': '30',
                        'Min Order': '45'
                    }]
                },
                'additionalCostDetails': {
                    'rows': [{
                        'LandingCost': 'Shunting Cost',
                        'Price': '20',
                        'SelectedGL': '1610'
                    }, {
                        'LandingCost': 'Packing Cost',
                        'Price': '30',
                        'SelectedGL': '1615'
                    }]
                }
            },
            {
                'itemData': {
                    'Item': 'Prod0051',
                    'Description': 'This is a desp',
                    'Category': 'This is a category',
                    'UOM': 'piece',
                    'StdPrice': '11',
                    'StdPricelCY': '43',
                    'lCY': '50',
                    'Min': '150',
                    'Max': '180',
                    'priceoffer': 40
                },
                'discountDetails': {
                    'rows': [{
                        'Price': '9',
                        'Discount': '19',
                        'Min Order': '28'
                    }, {
                        'Price': '21',
                        'Discount': '30',
                        'Min Order': '66'
                    }, {
                        'Price': '20',
                        'Discount': '22',
                        'Min Order': '35',
                    }, {
                        'Price': '23',
                        'Discount': '33',
                        'Min Order': '45'
                    }]
                },
                'additionalCostDetails': {
                    'rows': [{
                        'LandingCost': 'Shunting Cost',
                        'Price': '20',
                        'SelectedGL': '1610'
                    }, {
                        'LandingCost': 'Packing Cost',
                        'Price': '30',
                        'SelectedGL': '1615'
                    }]
                }
            }, {
                'itemData': {
                    'Item': 'Prod0021',
                    'Description': 'This is a desp',
                    'Category': 'This is a category',
                    'UOM': 'piece',
                    'StdPrice': '18',
                    'StdPricelCY': '38',
                    'lCY': '20',
                    'Min': '250',
                    'Max': '350',
                    'priceoffer': 36
                },
                'discountDetails': {
                    'rows': [{
                        'Price': '9',
                        'Discount': '22',
                        'Min Order': '21'
                    }, {
                        'Price': '21',
                        'Discount': '29',
                        'Min Order': '55'
                    }, {
                        'Price': '20',
                        'Discount': '30',
                        'Min Order': '20'
                    }, {
                        'Price': '30',
                        'Discount': '21',
                        'Min Order': '45'
                    }]
                },
                'additionalCostDetails': {
                    'rows': [{
                        'LandingCost': 'Shunting Cost',
                        'Price': '20',
                        'SelectedGL': '1610'
                    }, {
                        'LandingCost': 'Packing Cost',
                        'Price': '30',
                        'SelectedGL': '1615'
                    }]
                }
            }, {
                'itemData': {
                    'Item': 'Prod0099',
                    'Description': 'This is a desp',
                    'Category': 'This is a category',
                    'UOM': 'piece',
                    'StdPrice': '18',
                    'StdPricelCY': '38',
                    'lCY': '20',
                    'Min': '250',
                    'Max': '350',
                    'priceoffer': 36
                },
                'discountDetails': {
                    'rows': [{
                        'Price': '9',
                        'Discount': '22',
                        'Min Order': '21'
                    }, {
                        'Price': '21',
                        'Discount': '29',
                        'Min Order': '55'
                    }, {
                        'Price': '20',
                        'Discount': '30',
                        'Min Order': '20'
                    }, {
                        'Price': '43',
                        'Discount': '21',
                        'Min Order': '45'
                    }, {
                        'Price': '44',
                        'Discount': '21',
                        'Min Order': '45'
                    }, {
                        'Price': '45',
                        'Discount': '21',
                        'Min Order': '45'
                    }]
                },
                'additionalCostDetails': {
                    'rows': [{
                        'LandingCost': 'Shunting Cost',
                        'Price': '20',
                        'SelectedGL': '1610'
                    }, {
                        'LandingCost': 'Packing Cost',
                        'Price': '30',
                        'SelectedGL': '1615'
                    }]
                }
            }, {
                'itemData': {
                    'Item': 'Prod0061',
                    'Description': 'This is a desp',
                    'Category': 'This is a category',
                    'UOM': 'piece',
                    'StdPrice': '10',
                    'StdPricelCY': '19',
                    'lCY': '12',
                    'Min': '100',
                    'Max': '400',
                    'priceoffer': 32
                },
                'discountDetails': {
                    'rows': [{
                        'Price': '9',
                        'Discount': '22',
                        'Min Order': '21'
                    }, {
                        'Price': '21',
                        'Discount': '29',
                        'Min Order': '22'
                    }, {
                        'Price': '20',
                        'Discount': '30',
                        'Min Order': '20'
                    }, {
                        'Price': '30',
                        'Discount': '21',
                        'Min Order': '45'
                    }, {
                        'Price': '21',
                        'Discount': '37',
                        'Min Order': '21'
                    }]
                },
                'additionalCostDetails': {
                    'rows': [{
                        'LandingCost': 'Shunting Cost',
                        'Price': '20',
                        'SelectedGL': '1610'
                    }, {
                        'LandingCost': 'Packing Cost',
                        'Price': '30',
                        'SelectedGL': '1615'
                    }]
                }
            }]
        };

        // Time Zone

        /* $rootScope.selectedRow = 0;
        $rootScope.setClickedRow = function (index) {
            $rootScope.selectedRow = index;
        }
        $rootScope.$watch('selectedRow', function () {
            console.log($rootScope.selectedRow);
            console.log('Do Some processing');
        });
        */

        $rootScope.CallTaskFtn = function () {
            $rootScope.addNewTask = 'hello';
            console.log('werwe');
            // TaskService.ServiceFtn();
        }

        $rootScope.submit_add_task1 = function (formData) {
            // var url = window.location.href;
            // var match = url.match(/([^\/]+)\/?$/)[1];
            // return console.log(match);

            var postUrl = $rootScope.com + "task/add_task";
            formData.start_date = $rootScope.ConvertDateToUnixTimestamp(formData.t_date);
            formData.end_date = $rootScope.ConvertDateToUnixTimestamp(formData.e_date);
            formData.token = $rootScope.token;
            // formData.opp_cycle_id = $scope.opp_cycle_id;
            console.log(formData.t_status);
            // return;

            $http
                .post(postUrl, formData)
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $rootScope.getErrorMessageByCode(101));
                        // $state.go("app.task") ;
                        // $scope.add_task();
                        // $scope.tasks();
                        //$timeout(function(){ $state.reload();}, 3000);
                    } else
                        toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(104));
                });
        };

        $rootScope.ConvertDateToUnixTimestamp = function (date) {
            var tD = date.split("/");
            var newDate = new Date(tD[2], tD[1] - 1, tD[0]);
            var convertedDate = newDate.getTime() / 1000;
            return convertedDate;
        };

        $rootScope.ConvertUnixTimestampToDate = function (timestamp) {
            var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
                yyyy = d.getFullYear(),
                mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
                dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
                time;
            time = dd + '/' + mm + '/' + yyyy;
            return time;
        }

        $rootScope.currentSetupTab = 1;

        $rootScope.setCurrentSetupTab = function (breadCrumb, expSetTabVal) { // Explicitly set tabl value

            if (breadCrumb.tabIndex != undefined)
                $rootScope.currentSetupTab = breadCrumb.tabIndex;
            else if (expSetTabVal != undefined)
                $rootScope.currentSetupTab = expSetTabVal;
            else
                $rootScope.currentSetupTab = 1;
        }

        $rootScope.gotoFinanceTab = function () {
            $rootScope.currentSetupTab = 2;
        }

        $rootScope.timezones = [{
            'id': '1',
            'label': '(UTC - 12:00) Enitwetok, Kwajalien'
        },
        {
            'id': '2',
            'label': '(UTC - 11:00) Nome, Midway Island, Samoa'
        },
        {
            'id': '3',
            'label': '(UTC - 10:00) Hawaii'
        },
        {
            'id': '4',
            'label': '(UTC - 9:00) Alaska'
        },
        {
            'id': '5',
            'label': '(UTC - 8:00) Pacific Time'
        },
        {
            'id': '6',
            'label': '(UTC - 7:00) Mountain Time'
        },
        {
            'id': '7',
            'label': '(UTC - 6:00) Central Time, Mexico City'
        },
        {
            'id': '8',
            'label': '(UTC - 5:00) Eastern Time, Bogota, Lima, Quito'
        },
        {
            'id': '9',
            'label': '(UTC - 4:00) Atlantic Time, Caracas, La Paz'
        },
        {
            'id': '10',
            'label': '(UTC - 3:30) Newfoundland'
        },
        {
            'id': '11',
            'label': '(UTC - 3:00) Brazil, Buenos Aires, Georgetown, Falkland Is.'
        },
        {
            'id': '12',
            'label': '(UTC - 2:00) Mid-Atlantic, Ascention Is., St Helena'
        },
        {
            'id': '13',
            'label': '(UTC - 1:00) Azores, Cape Verde Islands'
        },
        {
            'id': '14',
            'label': '(UTC) Casablanca, Dublin, Edinburgh, London, Lisbon, Monrovia'
        },
        {
            'id': '15',
            'label': '(UTC + 1:00) Berlin, Brussels, Copenhagen, Madrid, Paris, Rome'
        },
        {
            'id': '16',
            'label': '(UTC + 2:00) Kaliningrad, South Africa, Warsaw'
        },
        {
            'id': '17',
            'label': '(UTC + 3:00) Baghdad, Riyadh, Moscow, Nairobi'
        },
        {
            'id': '18',
            'label': '(UTC + 3:30) Tehran'
        },
        {
            'id': '19',
            'label': '(UTC + 4:00) Adu Dhabi, Baku, Muscat, Tbilisi'
        },
        {
            'id': '20',
            'label': '(UTC + 4:30) Kabul'
        },
        {
            'id': '21',
            'label': '(UTC + 5:00) Islamabad, Karachi, Tashkent'
        },
        {
            'id': '22',
            'label': '(UTC + 5:30) Bombay, Calcutta, Madras, New Delhi'
        },
        {
            'id': '23',
            'label': '(UTC + 7:00) Bangkok, Hanoi, Jakarta'
        },
        {
            'id': '24',
            'label': '(UTC + 8:00) Beijing, Hong Kong, Perth, Singapore, Taipei'
        },
        {
            'id': '25',
            'label': '(UTC + 9:00) Osaka, Sapporo, Seoul, Tokyo, Yakutsk'
        },
        {
            'id': '26',
            'label': '(UTC + 9:30) Adelaide, Darwin'
        },
        {
            'id': '27',
            'label': '(UTC + 10:00) Melbourne, Papua New Guinea, Sydney, Vladivostok'
        },
        {
            'id': '28',
            'label': '(UTC + 11:00) Magadan, New Caledonia, Solomon Islands'
        },
        {
            'id': '29',
            'label': '(UTC + 12:00) Auckland, Wellington, Fiji, Marshall Island'
        }
        ];

        $rootScope.arr_submiss_frequency = [{
            'id': '1',
            'label': 'Monthly'
        },
        {
            'id': '2',
            'label': 'Quarterly'
        },
        {
            'id': '3',
            'label': 'Annually'
        }
        ];

        $rootScope.arr_vat_scheme = [{
            'id': '1',
            'label': 'Standard'
        },
        {
            'id': '2',
            'label': 'Not Registered'
        },
        {
            'id': '3',
            'label': 'Cash Accounting'
        },
        {
            'id': '4',
            'label': 'Flat Rate'
        }
        ];

        $rootScope.arr_type_of_Business = [{
            'id': '1',
            'label': 'Sole Trader'
        },
        {
            'id': '2',
            'label': 'Partnership'
        },
        {
            'id': '3',
            'label': 'Limited Company (Ltd)'
        },
        {
            'id': '4',
            'label': 'Public Limited Company (PLC)'
        },
        {
            'id': '5',
            'label': 'Limited Liability Partnership (LLP)'
        }
        ];

        $rootScope.arrMonths = [{ 'id': '1', 'label': 'January', 'name': 'Jan', 'no_of_days': '31' },
        { 'id': '2', 'label': 'February', 'name': 'Feb', 'no_of_days': '28' },
        { 'id': '3', 'label': 'March', 'name': 'Mar', 'no_of_days': '31' },
        { 'id': '4', 'label': 'April', 'name': 'Apr', 'no_of_days': '30' },
        { 'id': '5', 'label': 'May', 'name': 'May', 'no_of_days': '31' },
        { 'id': '6', 'label': 'June', 'name': 'Jun', 'no_of_days': '30' },
        { 'id': '7', 'label': 'July', 'name': 'Jul', 'no_of_days': '31' },
        { 'id': '8', 'label': 'August', 'name': 'Aug', 'no_of_days': '31' },
        { 'id': '9', 'label': 'September', 'name': 'Sep', 'no_of_days': '30' },
        { 'id': '10', 'label': 'October', 'name': 'Oct', 'no_of_days': '31' },
        { 'id': '11', 'label': 'November', 'name': 'Nov', 'no_of_days': '30' },
        { 'id': '12', 'label': 'December', 'name': 'Dec', 'no_of_days': '31' }];

        $rootScope.arrWeekDays = ["S", "M", "T", "W", "T", "F", "S"];

        $rootScope.arr_years = [];

        for (i = 2015; i <= 2050; i++) {
            $rootScope.arr_years.push({
                id: i,
                name: i
            });
        }

        $rootScope.arr_days = [{
            'id': '1',
            'label': 'Monday'
        },
        {
            'id': '2',
            'label': 'Tuesday'
        },
        {
            'id': '3',
            'label': 'Wednesday'
        },
        {
            'id': '4',
            'label': 'Thursday'
        },
        {
            'id': '5',
            'label': 'Friday'
        },
        {
            'id': '6',
            'label': 'Saturday'
        },
        {
            'id': '7',
            'label': 'Sunday'
        }
        ];

        $rootScope.arr_status = [{
            'label': 'Active',
            'value': "Active"
        }, {
            'label': 'Inactive',
            'value': "Inactive"
        }];

        $rootScope.arr_volume_type = [{
            'label': 'Volume 1',
            'value': "Volume 1"
        }, {
            'label': 'Volume 2',
            'value': "Volume 2"
        }, {
            'label': 'Volume 3',
            'value': "Volume 3"
        }];

        $rootScope.arr_discount_type = [{
            'name': '',
            'id': "None"
        }, {
            'name': 'Value',
            'id': "Value"
        }, {
            'name': 'Percentage',
            'id': "Percentage"
        }];

        $rootScope.arr_field_type = [{
            'name': 'text',
            'id': "text"
        }, {
            'name': 'select',
            'id': "select"
        }];

        $rootScope.posting_setup_type_filter_id = 98;
        $rootScope.bctext = '';
        $rootScope.tab_module_id = 0;
        $rootScope.crm_id = 0;
        $rootScope.sale_target_id = 0;
        $rootScope.arrFields = {};
        $rootScope.lblButton = '';
        $rootScope.opp_cycle_id = 0;
        $rootScope.order_type = 0;
        $rootScope.quote_id = 0;
        $rootScope.order_id = 0;
        $rootScope.order_date = '';
        $rootScope.new_data = [];
        $rootScope.user_type = 0;

        $rootScope.add_task_new = false;
        $rootScope.salary_type_one = false;
        $rootScope.salary_type_two = false;

        $rootScope.purchase_price_1 = 0;
        $rootScope.purchase_price_2 = 0;
        $rootScope.purchase_price_3 = 0;
        $rootScope.sale_unit_cost = 0;
        $rootScope.base_currency = 0;
        $rootScope.p_price_1 = 0;
        $rootScope.p_price_2 = 0;
        $rootScope.p_price_3 = 0;
        $rootScope.decimal_range = '';

        $rootScope.arr_posting_group_ids = [];

        //pagination start
        $rootScope.item_paging = {};
        $rootScope.pagination_arry = [{
            'id': '10',
            'label': '10'
        },
        {
            'id': '25',
            'label': '25'
        },
        {
            'id': '50',
            'label': '50'
        },
        {
            'id': '100',
            'label': '100'
        }
        ];
        //,  {'id':'-1','label':'Show All'}

        $rootScope.item_paging.pagination_limit = $rootScope.pagination_arry[1];

        $rootScope.itemselectPage = function (pageno) {
            $rootScope.item_paging.spage = pageno;
            $rootScope.item_paging.pagination_limit = $rootScope.pagination_arry[1];
        };

        $rootScope.sortform = 'desc';
        $rootScope.reversee = true;
        $rootScope.sort_column = '';

        $rootScope.save_single_value = function (name, type) {

            if (type == 'hrsort_name')
                localStorage.setItem(type, name);
            else if (type == 'product_sort_name')
                localStorage.setItem(type, name);
            else if (type == 'srmsort_name')
                localStorage.setItem(type, name);
            else if (type == 'crmsort_name')
                localStorage.setItem(type, name);
        }

        $rootScope.reset_single_value = function (type) {
            $rootScope.sort_column = '';

            if (type == 'hrsort_name')
                localStorage.setItem(type, '');
            else if (type == 'product_sort_name')
                localStorage.setItem(type, name);
            else if (type == 'srmsort_name')
                localStorage.setItem(type, name);
            else if (type == 'crmsort_name')
                localStorage.setItem(type, name);
        }

        $rootScope.get_single_value = function (type) {

            if (type == 'hrsort_name')
                return localStorage.getItem(type);
            else if (type == 'product_sort_name')
                return localStorage.getItem(type);
            else if (type == 'srmsort_name')
                return localStorage.getItem(type);
            else if (type == 'crmsort_name')
                return localStorage.getItem(type);
        }

        $rootScope.get_end_date = function () {
            var d = new Date();
            d.setDate(d.getDate() + 10); //10days + start Day

            var year = d.getFullYear();
            var month = d.getMonth() + 1;

            if (month < 10)
                month = "0" + month;

            var day = d.getDate();

            if (day < 10)
                day = "0" + day;

            if ($rootScope.defaultDateFormat == $rootScope.dtYMD)
                starting_date = year + "/" + month + "/" + day;

            if ($rootScope.defaultDateFormat == $rootScope.dtMDY)
                starting_date = month + "/" + day + "/" + year;

            if ($rootScope.defaultDateFormat == $rootScope.dtDMY)
                starting_date = day + "/" + month + "/" + year;

            return starting_date;
        };

        $rootScope.status_list = [];

        $rootScope.get_status_list = function (tbl) {
            $rootScope.status_list = [];
            //  if($rootScope.status_list.length>0) return;

            var postUrl = $rootScope.setup + "general/all-status-list";
            var postData = {
                'token': $rootScope.token,
                'type': 1,
                'tbl': $rootScope.base64_encode(tbl)
            };

            $http
                .post(postUrl, postData)
                .then(function (res) {
                    $rootScope.status_list.push({
                        'id': '1',
                        'title': 'Active'
                    });

                    if (tbl != 'customer_status') $rootScope.status_list.push({
                        'id': '0',
                        'title': 'Inactive'
                    });

                    if (res.data.ack == 1) {
                        $.each(res.data.response, function (index, obj) {
                            $rootScope.status_list.push(obj);
                        });
                        // $rootScope.status_list.push({'id': '-1', 'title': '++ Add New ++'});
                        //$scope.searchKeyword.status=$scope.product_status_list[0];
                    }
                });
        }

        $rootScope.arr_posting_group_ids = [];

        $rootScope.get_posting_vat = function () {
            if ($rootScope.arr_posting_group_ids != undefined && $rootScope.arr_posting_group_ids.length > 0) return;
            // var getposting = $scope.$root.setup + "crm/posting-vat-list";
            var postUrl = $rootScope.setup + "crm/posting-group-list";
            var postData = {
                'token': $rootScope.token
            };
            $http
                .post(postUrl, postData)
                .then(function (res) {
                    if (res.data.ack == true)
                        $rootScope.arr_posting_group_ids = res.data.response
                    // else toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(400));
                });
        }

        $rootScope.cat_prodcut_arr = [];

        $rootScope.get_category_list = function () {

            if ($rootScope.cat_prodcut_arr.length > 0) return;
            //	var postUrl = $rootScope.sales+"stock/products-listing/get-all-categories";
            var postUrl = $rootScope.stock + "categories";
            var postData = {
                'token': $rootScope.token
            };
            $http
                .post(postUrl, postData)
                .then(function (res) {
                    if (res.data.ack == true) {
                        $rootScope.cat_prodcut_arr = res.data.response;
                    }
                    // else toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(400));
                });
        }

        $rootScope.brand_prodcut_arr = [];

        $rootScope.get_brand_list = function () {
            if ($rootScope.brand_prodcut_arr.length > 0) return;
            //var postUrl = $rootScope.sales+"stock/products-listing/get-all-brands";
            var postUrl = $rootScope.stock + "brands";
            var postData = {
                'token': $rootScope.token
            };
            $http
                .post(postUrl, postData)
                .then(function (res) {
                    if (res.data.ack == true)
                        $rootScope.brand_prodcut_arr = res.data.response
                    // else toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(400));
                });
        }

        $rootScope.uni_prooduct_arr = [];

        $rootScope.get_uom_list = function () {
            if ($rootScope.uni_prooduct_arr.length > 0) return;
            //var postUrl = $rootScope.sales+"stock/unit-measure/get-all-unit";
            var postUrl = $rootScope.stock + "unit-measure/units";
            var postData = {
                'token': $rootScope.token
            };
            $http
                .post(postUrl, postData)
                .then(function (res) {
                    if (res.data.ack == true)
                        $rootScope.uni_prooduct_arr = res.data.response
                    // else toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(400));
                });
        }
        //$rootScope.itemOriginCountries = [];
        $rootScope.region_customer_arr = [];

        $rootScope.get_region_list = function (arg) {
            if ($rootScope.region_customer_arr.length > 0)
                return;

            var postUrl = $rootScope.setup + "crm/region-list";
            var postData = {
                'token': $rootScope.token
            };
        }

        $rootScope.segment_customer_arr = [];

        $rootScope.get_segment_list = function (arg) {
            if ($rootScope.segment_customer_arr.length > 0)
                return;

            var postUrl = $rootScope.setup + "crm/segment-list";
            var postData = {
                'token': $rootScope.token
            };

            $http
                .post(postUrl, postData)
                .then(function (res) {
                    if (res.data.ack == true)
                        $rootScope.segment_customer_arr = res.data.response
                    // else toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(400));
                    if (arg) $rootScope.segment_customer_arr.push({
                        'id': '-1',
                        'title': '++ Add New ++'
                    });
                });
        }

        $rootScope.bying_group_customer_arr = [];

        $rootScope.get_buyinggroup_list = function (arg) {
            if ($rootScope.bying_group_customer_arr.length > 0)
                return;

            var postUrl = $rootScope.setup + "crm/buying-group-list";
            var postData = {
                'token': $rootScope.token
            };

            $http
                .post(postUrl, postData)
                .then(function (res) {
                    if (res.data.ack == true)
                        $rootScope.bying_group_customer_arr = res.data.response
                    // else toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(400));

                    if (arg) $rootScope.bying_group_customer_arr.push({
                        'id': '-1',
                        'title': '++ Add New ++'
                    });
                });
        }

        $rootScope.deprtment_arr = [];

        $rootScope.get_department_list = function () {
            if ($rootScope.deprtment_arr.length > 0)
                return;

            var postUrl = $rootScope.hr + "hr_department/get-all-department";
            var postData = {
                'token': $rootScope.token
            };

            $http
                .post(postUrl, postData)
                .then(function (res) {
                    if (res.data.ack == true)
                        $rootScope.deprtment_arr = res.data.response
                    // else toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(400));
                });
        }

        $rootScope.emp_type_arr = [];

        $rootScope.get_employee_type_list = function () {
            if ($rootScope.emp_type_arr.length > 0) 
                return;

            var postUrl = $rootScope.hr + "hr_values/get_employee_type";
            var postData = {
                'token': $rootScope.token
            };

            $http
                .post(postUrl, postData)
                .then(function (res) {
                    if (res.data.ack == true)
                        $rootScope.emp_type_arr = res.data.response
                    // else toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(400));
                });
        }

        $rootScope.country_type_arr = [];
        var httpCache = true;

        $rootScope.get_country_list = function () {
            // var httpCache = $cacheFactory.get("$http");
            if ($rootScope.country_type_arr.length > 0) 
                return;

            var postUrl = $rootScope.setup + "general/countries";
            //$http({url: postUrl, method: 'GET', params: {'token': $rootScope.token}, cache: httpCache, timeout: 1000})

            $http
                .post(postUrl, {
                    'token': $rootScope.token
                })
                .then(function successCallback(res) {
                    if (res.data.ack == true)
                        $rootScope.country_type_arr = res.data.response;
                },
                function errorCallback(error) {
                })
                .catch(function (data, status) {
                })
                .finally(function () {
                });
        }

        $rootScope.removeAllcache = function () {
            //superCache.remove('another key');
            // superCache.removeAll();
            //$httpDefaultCache.remove('http://myserver.com/foo/bar/123');
            //httpCache.removeAll();
            httpCache = false;
        }

        $rootScope.get_currency_list = function (date) {
            $rootScope.arr_currency = [];
            if ($rootScope.arr_currency.length > 0) 
                return;

            var postUrl = $rootScope.setup + "general/currency-list";
            var postData = {
                'token': $rootScope.token,
                date: date
            };
            $http
                .post(postUrl, postData)
                .then(function (res) {
                    if (res.data.ack == true) {
                        $rootScope.arr_currency = res.data.response;
                    } // else toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(400));
                });
        }

        $rootScope.ref_currency_list = [];

        $rootScope.get_ref_currency_list = function (date) {
            if ($rootScope.ref_currency_list.length > 0) 
                return;

            var postUrl = $rootScope.setup + "general/ref-currency-list";
            var postData = {
                'token': $rootScope.token
            };
            $http
                .post(postUrl, postData)
                .then(function (res) {
                    if (res.data.ack == true) {
                        $rootScope.ref_currency_list = res.data.response;
                    }
                });
        }

        $rootScope.arr_posting_group_ids = [];

        $rootScope.get_posting_vat = function () {
            if ($rootScope.arr_posting_group_ids != undefined && $rootScope.arr_posting_group_ids.length > 0) 
                return;
            // var getposting = $scope.$root.setup + "crm/posting-vat-list";
            var postUrl = $rootScope.setup + "crm/posting-group-list";
            var postData = {
                'token': $rootScope.token
            };

            $http
                .post(postUrl, postData)
                .then(function (res) {
                    if (res.data.ack == true)
                        $rootScope.arr_posting_group_ids = res.data.response
                    // else toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(400));
                });
        }

        $rootScope.accountentry = function (account_number, tran_type, module_type, amt, posting_date, mid, currency_id, statuschk, reference_id) {

            var entryurl = $rootScope.gl + "chart-accounts/accounts-entry";
            var count_converted = 0;

            if (currency_id !== $rootScope.defaultCurrency && currency_id != 0)
                var count_converted = 1;

            $rootScope.postAccount = {};

            $rootScope.postAccount = {
                'token': $rootScope.token,
                'grand_total': amt,
                'module_id': mid, //module_id, //record Id
                'module_type': module_type, //like purchase, supplie,r customer
                'gl_id': account_number,
                //  'order_no': $scope.rec.update_id,
                'tran_type': tran_type,
                'posting_date': posting_date,
                'or_date': posting_date,
                'currency_id': currency_id,
                'count_converted': count_converted,
                'statuschk': statuschk,
                'reference_id': reference_id
            }; //  'type':1

            $http
                .post(entryurl, $rootScope.postAccount)
                .then(function (res) {
                    // if (res.data.ack == true)   toaster.pop('success','Edit', $rootScope.getErrorMessageByCode(101));
                    // else toaster.pop('error','Edit', $rootScope.getErrorMessageByCode(105));
                });
        }

        $rootScope.remove_dupciation_in_array = function (arr) {
            var newArr = [];
            angular.forEach(arr, function (value, key) {
                var exists = false;

                angular.forEach(newArr, function (val2, key) {
                    if (angular.equals(value.id, val2.id))
                        exists = true
                });

                if ((exists == false && value.id != "")) {
                    newArr.push(value);
                }
            });
            return newArr;
        }

        $rootScope.remove_null_json = function (arr, column) {
            var sjonObj = {};
            // && (value != "" || value != null)
            $.each(arr, function (key, value) {
                console.log(key);
                if ((value == "" || value == null) && (key == column)) delete sjonObj.key;
            });
            return sjonObj;
        }

        $rootScope.testDateOfBirth = function (date) {
            var date = date.split("/")[1] + "/" + date.split("/")[0] + "/" + date.split("/")[2];
            var dob = new Date(date);
            var year = dob.getFullYear();
            var month = dob.getMonth();
            var day = dob.getDay();
            var oldDate = new Date(year + 16, month, day);
            var today = new Date();
            var result;

            if (oldDate <= today)
                result = true;
            else
                result = false;
            return result;
        }

        $rootScope.testdate = function (startDate, end_date, div_id) {
            if (startDate != null && end_date != null) {
                var startDate = new Date(startDate);
                var endDate = new Date(end_date);

                if (Date.parse(endDate) < Date.parse(startDate)) {
                    $('#date_msg_leave_' + div_id).show();
                    $('.pic_block').attr("disabled", true);
                } else {
                    $('#date_msg_leave_' + div_id).hide();
                    $('.pic_block').attr("disabled", false);
                }
            }
        }

        $rootScope.dateValidation = function (date1, date2) {
            if (date1 != undefined && date2 != undefined) {
                var d1 = date1.split('/');
                firstDate = d1[1] + '/' + d1[0] + '/' + d1[2];
                var d2 = date2.split('/');
                secondDate = d2[1] + '/' + d2[0] + '/' + d2[2];
                var D1 = new Date(firstDate);
                var D2 = new Date(secondDate);

                if (Date.parse(D1) > Date.parse(D2)) 
                    return 1;
                else return 0;
            }
        }

        $rootScope.testdate_by_id = function (ck_startDate, ck_end_date, div_id, div_modle) {
            var from, to, check;
            from = $("#" + ck_startDate).val().split("/")[2] + "-" + $("#" + ck_startDate).val().split("/")[1] + "-" + $("#" + ck_startDate).val().split("/")[0];
            to = $("#" + ck_end_date).val().split("/")[2] + "-" + $("#" + ck_end_date).val().split("/")[1] + "-" + $("#" + ck_end_date).val().split("/")[0];

            if (from != null && to != null) {
                var from1, to1, check1;
                from1 = new Date(from.replace(/\s/g, ''));
                to1 = new Date(to.replace(/\s/g, ''));

                /* var validMsgIDStartDate = $("#" + ck_startDate).attr("data-parsley-id");
                var validMsgIDEndDate = $("#" + ck_end_date).attr("data-parsley-id");
                document.getElementById('parsley-id-' + validMsgIDStartDate).innerHTML = "";
                document.getElementById('parsley-id-' + validMsgIDEndDate).innerHTML = ""; */

                var fDate, lDate, cDate;
                //alert(from1);
                // alert(to1);
                fDate = Date.parse(from1);
                lDate = Date.parse(to1);

                if (fDate > lDate) {
                    $('#' + div_id).show();
                    $('._' + div_id).attr("disabled", true);
                    $('.pic_block').attr("disabled", true);
                    $('#' + div_id).addClass("error_on");
                } else {
                    $('#' + div_id).hide();
                    $('._' + div_id).attr("disabled", false);
                    $('.pic_block').attr("disabled", false);
                    $('#' + div_id).removeClass("error_on");
                }
            }
        }

        $rootScope.testdate_between_two_dates_by_id = function (ck_startDate, ck_end_date, test_date, div_id) {
            var from, to, check;

            from = $("#" + ck_startDate).val().split("/")[2] + "-" + $("#" + ck_startDate).val().split("/")[1] + "-" + $("#" + ck_startDate).val().split("/")[0];
            to = $("#" + ck_end_date).val().split("/")[2] + "-" + $("#" + ck_end_date).val().split("/")[1] + "-" + $("#" + ck_end_date).val().split("/")[0];
            check = $("#" + test_date).val().split("/")[2] + "-" + $("#" + test_date).val().split("/")[1] + "-" + $("#" + test_date).val().split("/")[0];

            /* from = document.getElementById(""+ck_startDate).value ;
             from.setHours(00);
             to = document.getElementById(""+ck_end_date).value ;
             to.setHours(00);
             check = document.getElementById(""+test_date).value ;
             check.setHours(00);*/

            if (from != null && to != null && check != null) {
                var from1, to1, check1;
                from1 = new Date(from.replace(/\s/g, ''));
                to1 = new Date(to.replace(/\s/g, ''));
                check1 = new Date(check);
                //console.log(from1);	console.log(to1);console.log(check1);
                var fDate, lDate, cDate;
                fDate = Date.parse(from1);
                lDate = Date.parse(to1);
                cDate = Date.parse(check1);
                //console.log(fDate);	console.log(lDate);console.log(cDate);

                if ((cDate >= fDate) && (cDate <= lDate)) {
                    $('#' + div_id).hide();
                    $('.b_' + div_id).attr("disabled", false);
                    //  return false;
                } else {
                    $('#' + div_id).show();
                    $('.b_' + div_id).attr("disabled", true);
                    //	  return true;
                }
            }
        }

        $rootScope.testdate_between_two_dates_by_angular_model = function (ck_startDate, ck_end_date, test_date, div_id) {
            var from, to, check;
            from = ck_startDate;
            to = ck_end_date;
            check = test_date;
            //	console.log(from);	console.log(to);console.log(check);

            if (from != null && to != null && check != null) {
                var from1, to1, check1;
                from1 = new Date(from.replace(/\s/g, ''));
                to1 = new Date(to.replace(/\s/g, ''));
                check1 = new Date(check.replace(/\s/g, ''));
                var fDate, lDate, cDate;
                fDate = Date.parse(from1);
                lDate = Date.parse(to1);
                cDate = Date.parse(check1);
                console.log(fDate);
                console.log(lDate);
                console.log(cDate);

                if ((cDate > fDate) && (cDate < lDate)) {
                    $('#' + div_id).hide();
                    $('.b_' + div_id).attr("disabled", false);
                    //  return false;
                } else {
                    $('#' + div_id).show();
                    $('.b_' + div_id).attr("disabled", true);
                    //  return true;
                }
            }
        }

        $rootScope.convert_unix_date_to_angular = function (start_date) {
            return start_date;
            /* var yyyy =start_date.split("/")[2];
             var  mm=start_date.split("/")[1];
             var dd=start_date.split("/")[0];
             */
            //add 1 month  unix time issue  cannot convert exxact date  ('0' + (d.getMonth() + 1)),

            var d = new Date(start_date * 1000), // Convert the passed timestamp to milliseconds
                yyyy = d.getFullYear(),
                mm = ('0' + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
                dd = ('0' + d.getDate()).slice(-2), // Add leading 0.
                hh = d.getHours(),
                h = hh,
                min = ('0' + d.getMinutes()).slice(-2), // Add leading 0.
                ampm = 'AM',
                time;

            if (hh > 12) {
                h = hh - 12;
                ampm = 'PM';
            } else if (hh === 12) {
                h = 12;
                ampm = 'PM';
            } else if (hh == 0)
                h = 12;
            //add 1 day due to PHP issue
            /*
             var convrt_date= new Date(yyyy + "-" + mm + "-" + dd);
             if(convrt_date!='Invalid Date'){
             var day = 60 * 24 * 1000;
             convrt_date.setDate(convrt_date.getDate() + 1); //number  of days to add, e.x. 1 days
             var dateFormated= convrt_date.toISOString().substr(0,10);
             return  dateFormated[8]+dateFormated[9]+"/"+dateFormated[5]+dateFormated[6]+"/"+dateFormated[0]+dateFormated[1]+dateFormated[2]+dateFormated[3];
             }
             */
            //add 1 day due to PHP issue
            //return dd + '/' + mm + '/' + yyyy ;//+ ', ' + h + ':' + min + ' ' + ampm;

            if ($rootScope.defaultDateFormat == $rootScope.dtYMD)
                return yyyy + "/" + mm + "/" + dd;

            if ($rootScope.defaultDateFormat == $rootScope.dtMDY)
                return mm + "/" + dd + "/" + yyyy;

            if ($rootScope.defaultDateFormat == $rootScope.dtDMY)
                return dd + "/" + mm + "/" + yyyy;
        };

        $rootScope.convert_unix_timestamp_to_datetime_format = function (start_date) {
            //add 1 month  unix time issue  cannot convert exxact date  ('0' + (d.getMonth() + 1)),

            var d = new Date(start_date * 1000), // Convert the passed timestamp to milliseconds
                yyyy = d.getFullYear(),
                mm = ('0' + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
                dd = ('0' + d.getDate()).slice(-2), // Add leading 0.
                hh = d.getHours(),
                h = hh,
                min = ('0' + d.getMinutes()).slice(-2), // Add leading 0.
                ampm = 'AM',
                time;

            if (hh > 12) {
                h = hh - 12;
                ampm = 'PM';
            } else if (hh === 12) {
                h = 12;
                ampm = 'PM';
            } else if (hh == 0)
                h = 12;

            return dd + '/' + mm + '/' + yyyy + ' ' + h + ':' + min + ' ' + ampm;
        };

        $rootScope.convert_date_to_unix = function (myDate) {
            if (myDate == undefined || myDate == null || myDate == "") {
                return "";
            }
            //js only convert in m/d/y fomat   is curent month
            var unixtime = myDate[3] + myDate[4] + "/" + myDate[0] + myDate[1] + "/" + myDate[6] + myDate[7] + myDate[8] + myDate[9];
            return parseInt((new Date(unixtime + " 00:00:00").getTime() / 1000).toFixed(0))
            //return Math.round(new Date(unixtime+" 00:00:00").getTime()/1000);
        };

        $rootScope.convert_numeric_date_to_string = function (start_date) {
            return start_date;

            //var d = new Date(start_date),
            var d = new Date(start_date * 1000), // Convert the passed timestamp to milliseconds
                yyyy = d.getFullYear(),
                mm = ('0' + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
                dd = ('0' + d.getDate()).slice(-2), // Add leading 0.
                hh = d.getHours(),
                h = hh,
                min = ('0' + d.getMinutes()).slice(-2), // Add leading 0.
                ampm = 'AM',
                time;
            //return dd + '/' + mm + '/' + yyyy ;//+ ', ' + h + ':' + min + ' ' + ampm;

            if ($rootScope.defaultDateFormat == $rootScope.dtYMD)
                return yyyy + "/" + mm + "/" + dd;

            if ($rootScope.defaultDateFormat == $rootScope.dtMDY)
                return mm + "/" + dd + "/" + yyyy;

            if ($rootScope.defaultDateFormat == $rootScope.dtDMY)
                return dd + "/" + mm + "/" + yyyy;
        };

        $rootScope.number_format = function (number, dec_length) {
            var decimals = dec_length; //$scope.$root.decimal_range;
            var dec_point = '.';
            var thousands_sep = ',';
            // http://kevin.vanzonneveld.net
            // *     example 1: number_format(1234.56);
            // *     returns 1: '1,235'
            // *     example 2: number_format(1234.56, 2, ',', ' ');
            // *     returns 2: '1 234,56'
            // *     example 3: number_format(1234.5678, 2, '.', '');
            // *     returns 3: '1234.57'
            // *     example 4: number_format(67, 2, ',', '.');
            // *     returns 4: '67,00'
            // *     example 5: number_format(1000);
            // *     returns 5: '1,000'
            // *     example 6: number_format(67.311, 2);
            // *     returns 6: '67.31'
            // *     example 7: number_format(1000.55, 1);
            // *     returns 7: '1,000.6'
            // *     example 8: number_format(67000, 5, ',', '.');
            // *     returns 8: '67.000,00000'
            // *     example 9: number_format(0.9, 0);
            // *     returns 9: '1'
            // *    example 10: number_format('1.20', 2);
            // *    returns 10: '1.20'
            // *    example 11: number_format('1.20', 4);
            // *    returns 11: '1.2000'
            // *    example 12: number_format('1.2000', 3);
            // *    returns 12: '1.200'

            var n = !isFinite(+number) ? 0 : +number,
                prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
                dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
                toFixedFix = function (n, prec) {
                    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
                    var k = Math.pow(10, prec);
                    return Math.round(n * k) / k;
                },
                s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split('.');

            if (s[0].length > 3) {
                s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
            }

            if ((s[1] || '').length < prec) {
                s[1] = s[1] || '';
                s[1] += new Array(prec - s[1].length + 1).join('0');
            }

            // alert( $filter('number')(number,2));
            //alert(number_format(5000000,2, '.', ','));
            return s.join(dec);
        }

        $rootScope.number_format_remove = function (number, dec_length) {
            //var str = "110 000,23";
            var str = number;
            // var num = parseFloat(str.replace(/\s/g, "").replace(",", ""));
            var num = parseFloat(str.replace(',', "").replace(",", ""));
            //	alert(num.toFixed(dec_length));
            num = num.toFixed(dec_length);
            // alert(number.split(",") + "");
            // alert( Math.round(number).toFixed(2)) ;
            return num;
        }

        $rootScope.get_current_date = function () {
            var d = new Date();
            var year = d.getFullYear();
            var month = d.getMonth() + 1;

            if (month < 10)
                month = "0" + month;

            var day = d.getDate();

            if (day < 10)
                day = "0" + day;

            if ($rootScope.defaultDateFormat == $rootScope.dtYMD)
                starting_date = year + "/" + month + "/" + day;

            if ($rootScope.defaultDateFormat == $rootScope.dtMDY)
                starting_date = month + "/" + day + "/" + year;

            if ($rootScope.defaultDateFormat == $rootScope.dtDMY)
                starting_date = day + "/" + month + "/" + year;

            return starting_date;
        };

        $rootScope.base64_decode = function (data) {
            //   funtion in javascript for security
            //  discuss at: http://phpjs.org/functions/base64_decode/
            // original by: Tyler Akins (http://rumkin.com)
            // improved by: Thunder.m
            // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            //    input by: Aman Gupta
            //    input by: Brett Zamir (http://brett-zamir.me)
            // bugfixed by: Onno Marsman
            // bugfixed by: Pellentesque Malesuada
            // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            //   example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
            //   returns 1: 'Kevin van Zonneveld'
            //   example 2: base64_decode('YQ===');
            //   returns 2: 'a'

            var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
                ac = 0,
                dec = '',
                tmp_arr = [];

            if (!data) {
                return data;
            }

            data += '';

            do { // unpack four hexets into three octets using index points in b64
                h1 = b64.indexOf(data.charAt(i++));
                h2 = b64.indexOf(data.charAt(i++));
                h3 = b64.indexOf(data.charAt(i++));
                h4 = b64.indexOf(data.charAt(i++));

                bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

                o1 = bits >> 16 & 0xff;
                o2 = bits >> 8 & 0xff;
                o3 = bits & 0xff;

                if (h3 == 64) {
                    tmp_arr[ac++] = String.fromCharCode(o1);
                } 
                else if (h4 == 64) {
                    tmp_arr[ac++] = String.fromCharCode(o1, o2);
                } 
                else {
                    tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
                }
            } while (i < data.length);

            dec = tmp_arr.join('');
            return dec.replace(/\0+jQuery/, '');
        }

        $rootScope.base64_encode = function (data) {
            //   funtion in javascript for security
            var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
                ac = 0,
                enc = '',
                tmp_arr = [];

            if (!data) {
                return data;
            }

            do { // pack three octets into four hexets
                o1 = data.charCodeAt(i++);
                o2 = data.charCodeAt(i++);
                o3 = data.charCodeAt(i++);

                bits = o1 << 16 | o2 << 8 | o3;

                h1 = bits >> 18 & 0x3f;
                h2 = bits >> 12 & 0x3f;
                h3 = bits >> 6 & 0x3f;
                h4 = bits & 0x3f;

                // use hexets to index into b64, and append result to encoded string
                tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
            }
            while (i < data.length);

            enc = tmp_arr.join('');
            var r = data.length % 3;
            return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
        }

        angular.element(document).on('click', '.btn-cancel', function (event) {
            return;
            // if($('#form').serialize()!=$('#form').data('serialize'))return true;
            ngDialog.openConfirm({
                template: 'modalleave',
                // template: 'app/views/_conform_leave.html',
                className: 'ngdialog-theme-default',
                scope: $scope
            }).then(function (result) {

                setTimeout(function () {
                    // $scope.getPromotion();
                    //  $state.go('app.crm');
                }, 1000);

            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
        });
        //    < img src = "app/img/infile.png" style = "width:16px;" class = "doc-icon"
        // var demo =document.write("<IMG ALIGN='center' "+  "SRC='app/img/infile.png'> " + " style='width:16px;' class='doc-icon' ");

        var demo = "<img src=\"app/img/infile.png\"   class=\"doc-icon\"    style=\"width:16px;\"   />";
        $rootScope.document_title = ''; //'Document'

        //<a id="linkdown" style="visibility: hidden !important;"  href="'+pathf+'" target="_blank">&nbsp;click</a>
        $('.enternal_doc_ico').append('<img  src="app/img/infile.png"   class="doc-icon linkdown2"  style="width:16px;"   />');
        // $('.linkdown2')[0].click();
        /*var link = document.createElement('a');
         link.href = pathf;
         document.body.appendChild(link);
         link.click(); */

        function ValidateDate(dtValue) {
            //var val1 = Date.parse(dtValue);
            //if (isNaN(val1)==true && dtValue!=='')	return true;
            //else     return false;

            var date_regex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;

            if ((date_regex.test(dtValue)))
                return false;
            else
                return true;
            //  return  moment(dtValue, ["DD/MM/YYYY"], true).isValid();//, "MM-DD-YYYY"
        }

        $rootScope.get_obj_frm_arry = function (arr, id) {
            var object2 = '';

            angular.forEach(arr, function (obj, index) {
                //console.log(obj.id == id);
                if (obj.id == id) object2 = obj;
            });
            return object2;
        }

        $rootScope.load_date_picker = function (arg) {
            return;

            setTimeout(function () {
                //datpicker
                // angular.element('.date-picker').attr("jqdatepicker", "");
                angular.element('.date-picker').attr({
                    "placeholder": "dd/mm/yyyy"
                }).datepicker({}).next(".ui-datepicker-trigger").addClass("onspan");

                //bootsrap model drag
                angular.element(".modal").draggable({
                    handle: ".modal-header"
                });

                //time
                angular.element('#t_time').timepicker({
                    showLeadingZero: true,
                    showPeriod: true,
                    defaultTime: '05:00 PM',
                    timeFormat: 'hh:mm tt',
                    hour: '17', //{ starts: 6, ends: 19 },
                    minute: '00', //{ interval: 15 },
                    //   onSelect: tpStartSelect,
                    maxTime: {
                        hour: 24,
                        minute: 60
                    },
                    hourText: 'Hour',
                    minuteText: 'Minutes',
                    amPmText: ['AM', 'PM'],
                    //timeSeparator: 'h',
                    nowButtonText: 'Now',
                    showNowButton: true,
                    closeButtonText: 'Close',
                    showCloseButton: true,
                    deselectButtonText: 'Clear',
                    showDeselectButton: true,
                    showPeriod: true,
                    showLeadingZero: true,
                    defaultTime: '', // removes the highlighted time for when the input is empty.
                    // rows: 3,
                    showPeriodLabels: true,
                    // minuteText: 'Min'
                });

                angular.element('#e_time').timepicker({
                    showLeadingZero: true,
                    showPeriod: true,
                    defaultTime: '05:00 PM',
                    timeFormat: 'hh:mm tt',
                    hour: '17', //{ starts: 6, ends: 19 },
                    minute: '00', //{ interval: 15 },
                    //   onSelect: tpStartSelect,
                    maxTime: {
                        hour: 24,
                        minute: 60
                    },
                    hourText: 'Hour',
                    minuteText: 'Minutes',
                    amPmText: ['AM', 'PM'],
                    //timeSeparator: 'h',
                    nowButtonText: 'Now',
                    showNowButton: true,
                    closeButtonText: 'Close',
                    showCloseButton: true,
                    deselectButtonText: 'Clear',
                    showDeselectButton: true,
                    showPeriod: true,
                    showLeadingZero: true,
                    defaultTime: '', // removes the highlighted time for when the input is empty.
                    // rows: 3,
                    showPeriodLabels: true,
                    // minuteText: 'Min'
                });

                angular.element(document).ready(function () {
                    $('form').attr('spellcheck', true);
                    //   document.body.setAttribute('spellcheck', 'true');
                });

                $('body').attr("spellcheck", true)

                $("form").each(function () {
                    $(this, "input, textarea, select");
                    var input = $(this);
                    input.attr('spellcheck', true);
                });
                //add null option in all select box
                // var dropdown = $('select');
                // $(dropdown).append('<option style="display:block" value="">Select Option</option>');
                // angular.element('select').append(angular.element('<option style="display:block !important">', {value:'', label:'Select Option', text:'Select Option'}));

                console.log('Active IN ' + arg);
            }, 500);
        }
        //TREE Structure.
        // collapse  IN is used for + closed  ///  Out is used for -     opened

        angular.element(document).on('click', '.pls_mins_sign', function (event) {
            //document.getElementById('pls_mins_sign_'+name+'_'+id).className += 'fa-plus'
            event.preventDefault();

            if ($(this).hasClass('fa-plus')) {
                $(this).removeClass('fa-plus');
                $(this).addClass('fa-minus');
            } 
            else {
                $(this).removeClass('fa-minus');
                $(this).addClass('fa-plus');
            }
        });

        angular.element(document).on('click', '.pls_mins_sign_one', function (event) {
            event.preventDefault();

            if ($(this).hasClass('fa-plus')) {
                $(this).removeClass('fa-plus');
                $(this).addClass('fa-minus');
            } 
            else {
                $(this).removeClass('fa-minus');
                $(this).addClass('fa-plus');
            }
        });

        $rootScope.loadingadd = false;

        angular.element(document).on('click', '.btn_add , .btn-submit, .btn-default ,btn-cancel', function (event) {
            // $(".parsley-errors-list:not(:empty)").show();
            event.preventDefault();
            var that = this;
            $(this).attr("disabled", true);
            $(this).addClass('dont-click');
            $('.tooltip-styling').remove();

            setTimeout(function () {
                $(that).removeAttr("disabled");
                $(that).removeClass('dont-click');
                $(that).find('span').remove();
            }, 2000);

            $(that).submit();
            return true;
        });

        //Roles Permision Area
        $rootScope.tab_id = 0;
        $rootScope.list_internal_document = false;

        $rootScope.set_document_internal = function (id, name) {
            $rootScope.tab_id = id;

            if (name === undefined)
                $rootScope.document_title_new = 'Documents ';
            else
                $rootScope.document_title_new = 'Documents ' + name;

            if (id == 0)
                $rootScope.list_internal_document = false;
            else if (id > 0) {
                angular.element('#dcoument_internal_popup').modal({
                    show: true
                });

                $rootScope.list_internal_document = true;

                setTimeout(function () {
                    $('#reclickdoc').click();
                }, 1000);

            } else if (id === 'hr') {
                $rootScope.list_internal_document = false;
                $rootScope.List = '';

                if ($rootScope.hr_general_module > 0)
                    $rootScope.List += $rootScope.hr_general_module + ',';

                if ($rootScope.hr_contact_module > 0)
                    $rootScope.List += $rootScope.hr_contact_module + ',';

                if ($rootScope.hr_personal_module > 0)
                    $rootScope.List += $rootScope.hr_personal_module + ',';

                if ($rootScope.hr_salary_module > 0)
                    $rootScope.List += $rootScope.hr_salary_module + ',';

                if ($rootScope.hr_benifit_module > 0)
                    $rootScope.List += $rootScope.hr_benifit_module + ',';

                if ($rootScope.hr_expenses_module > 0)
                    $rootScope.List += $rootScope.hr_expenses_module + ',';

                if ($rootScope.hr_fuel_cost_module > 0)
                    $rootScope.List += $rootScope.hr_fuel_cost_module + ',';

                if ($rootScope.hr_holidays_module > 0)
                    $rootScope.List += $rootScope.hr_holidays_module + ',';

                if ($rootScope.hr_mail_module > 0)
                    $rootScope.List += $rootScope.hr_mail_module + ',';

                $rootScope.tab_id = $rootScope.List.substring(0, $rootScope.List.length - 1);

                setTimeout(function () {
                    $('#reclickdoc_all').click();
                }, 2000);

            } 
            else if (id === 'item') {
                $rootScope.list_internal_document = false;
                $rootScope.List = '';

                if ($rootScope.item_detal_tab_module > 0)
                    $rootScope.List += $rootScope.item_gneral_tab_module + ',';

                if ($rootScope.item_detal_tab_module > 0)
                    $rootScope.List += $rootScope.item_detal_tab_module + ',';

                if ($rootScope.item_purchase_tab_module > 0)
                    $rootScope.List += $rootScope.item_purchase_tab_module + ',';

                if ($rootScope.item_sale_tab_module > 0)
                    $rootScope.List += $rootScope.item_sale_tab_module + ',';

                $rootScope.tab_id = $rootScope.List.substring(0, $rootScope.List.length - 1);

                setTimeout(function () {
                    $('#reclickdoc_all').click();
                }, 2000);

            } 
            else if (id === 'crm') {
                $rootScope.list_internal_document = false;
                $rootScope.List = '';

                if ($rootScope.crm_general_tab_module > 0)
                    $rootScope.List += $rootScope.crm_general_tab_module + ',';

                if ($rootScope.crm_contact_tab > 0)
                    $rootScope.List += $rootScope.crm_contact_tab + ',';

                if ($rootScope.crm_location_tab_module > 0)
                    $rootScope.List += $rootScope.crm_location_tab_module + ',';

                if ($rootScope.crm_competetor_module > 0)
                    $rootScope.List += $rootScope.crm_competetor_module + ',';

                if ($rootScope.crm_price_tab_module > 0)
                    $rootScope.List += $rootScope.crm_price_tab_module + ',';

                if ($rootScope.crm_promotiom_tab_module > 0)
                    $rootScope.List += $rootScope.crm_promotiom_tab_module + ',';

                if ($rootScope.crm_oop_cycle_tab_module > 0)
                    $rootScope.List += $rootScope.crm_oop_cycle_tab_module + ',';

                $rootScope.tab_id = $rootScope.List.substring(0, $rootScope.List.length - 1);

                setTimeout(function () {
                    $('#reclickdoc_all').click();
                    $('#reclickdoc_all_crm').click();
                }, 2000);
            } 
            else if (id === 'customer') {
                $rootScope.list_internal_document = false;
                $rootScope.List = '';

                if ($rootScope.cust_gneral_tab_module > 0)
                    $rootScope.List += $rootScope.cust_gneral_tab_module + ',';

                if ($rootScope.cust_contact_tab_module > 0)
                    $rootScope.List += $rootScope.cust_contact_tab_module + ',';

                if ($rootScope.cust_finanace_tab_module > 0)
                    $rootScope.List += $rootScope.cust_finanace_tab_module + ',';

                if ($rootScope.cust_location_tab_module > 0)
                    $rootScope.List += $rootScope.cust_location_tab_module + ',';

                if ($rootScope.cust_competetor_tab_module > 0)
                    $rootScope.List += $rootScope.cust_competetor_tab_module + ',';

                if ($rootScope.cust_price_tab_module > 0)
                    $rootScope.List += $rootScope.cust_price_tab_module + ',';

                if ($rootScope.cust_promotion_tab_module > 0)
                    $rootScope.List += $rootScope.cust_promotion_tab_module + ',';

                if ($rootScope.cust_oop_cycle_tab_module > 0)
                    $rootScope.List += $rootScope.cust_oop_cycle_tab_module + ',';

                $rootScope.tab_id = $rootScope.List.substring(0, $rootScope.List.length - 1);

                setTimeout(function () {
                    $('#reclickdoc_all').click();
                    $('#reclickdoc_all_crm').click();
                }, 2000);

                $rootScope.tab_id = $rootScope.List.substring(0, $rootScope.List.length - 1);

                setTimeout(function () {
                    $('#reclickdoc_all').click();
                }, 2000);
            } 
            else if (id === 'srm') {
                $rootScope.list_internal_document = false;
                $rootScope.List = '';

                if ($rootScope.srm_general_tab_module > 0)
                    $rootScope.List += $rootScope.srm_general_tab_module + ',';

                if ($rootScope.srm_contact_tab_module > 0)
                    $rootScope.List += $rootScope.srm_contact_tab_module + ',';

                if ($rootScope.srm_location_tab_module > 0)
                    $rootScope.List += $rootScope.srm_location_tab_module + ',';

                if ($rootScope.srm_haulier_tab_module > 0)
                    $rootScope.List += $rootScope.srm_haulier_tab_module + ',';

                if ($rootScope.srm_price_tab_module > 0)
                    $rootScope.List += $rootScope.srm_price_tab_module + ',';

                $rootScope.tab_id = $rootScope.List.substring(0, $rootScope.List.length - 1);

                setTimeout(function () {
                    $('#reclickdoc_all').click();
                }, 2000);
            } 
            else if (id === 'supplier') {
                $rootScope.list_internal_document = false;
                $rootScope.List = '';

                if ($rootScope.supplier_general_tab_module > 0)
                    $rootScope.List += $rootScope.supplier_general_tab_module + ',';

                if ($rootScope.supplier_finance_tab_module > 0)
                    $rootScope.List += $rootScope.supplier_finance_tab_module + ',';

                if ($rootScope.supplier_contact_tab > 0)
                    $rootScope.List += $rootScope.supplier_contact_tab + ',';

                if ($rootScope.supplier_location_tab > 0)
                    $rootScope.List += $rootScope.supplier_location_tab + ',';

                if ($rootScope.supplier_haulier_tab_module > 0)
                    $rootScope.List += $rootScope.supplier_haulier_tab_module + ',';

                if ($rootScope.supplier_iteminfo_tab_module > 0)
                    $rootScope.List += $rootScope.supplier_iteminfo_tab_module + ',';

                if ($rootScope.supplier_price_tab_module > 0)
                    $rootScope.List += $rootScope.supplier_price_tab_module + ',';

                $rootScope.tab_id = $rootScope.List.substring(0, $rootScope.List.length - 1);

                setTimeout(function () {
                    $('#reclickdoc_all').click();
                }, 2000);
            }
        }

        $rootScope.getErrorMessageByCode = function (code, params) {
            if ($rootScope.messages_json == undefined) {
                $http
                    .get("app/js/messages.json")
                    .then(function (res) {
                        $rootScope.messages_json = res.data;
                        $rootScope.$storage.setItem('messages_json', JSON.stringify($rootScope.messages_json));
                        var message = $rootScope.messages_json[code];

                        if (params != undefined) {
                            angular.forEach(params, function (param, index) {
                                message = message.replace("#PARAM" + index + "#", param);
                            });
                        }
                        return message;
                    });
            }
            else {
                var message = $rootScope.messages_json[code];
                if (params != undefined) {
                    angular.forEach(params, function (param, index) {
                        message = message.replace("#PARAM" + (index + 1) + "#", param);
                    });
                }
                return message;
            }
        }

        $rootScope.getErrorMessages = function () {
            if ($rootScope.messages_json == undefined) {
                $http
                    .get("app/js/messages.json")
                    .then(function (res) {
                        // $rootScope.messages_json = res.data;
                        $rootScope.messages_json = res.data;
                        $rootScope.$storage.setItem('messages_json', JSON.stringify($rootScope.messages_json));
                    });
            }
        }
        /*----------------------------------EMAIL-----------------------------------------------------*/
        $rootScope.set_email_internal = function (id, name, module_name) {
            $rootScope.tab_id = id;
            $rootScope.EmailModuleName = module_name;
            $rootScope.EmailAccountName = name;
            $rootScope.fromEmails = {};

            var getCompEmail = $rootScope.setup + 'general/get-company-emails';
            var company_id = $rootScope.defaultCompany;
            var user_id = $rootScope.userId;

            if (company_id > 0 && user_id > 0) {
                $http
                    .post(getCompEmail, {
                        company: company_id,
                        user: user_id,
                        token: $rootScope.token
                    })
                    .then(function (res) {
                        $rootScope.arrEmails = res.data.response;
                    });
            }
            //console.log($rootScope.arrEmails);
            $rootScope.mailRec = {};
            $rootScope.mailRec.isSave = true;

            angular.element('#composeEmail').modal({
                show: true
            });
        }

        $rootScope.markAsNotified = function (task) {
            var postUrl = $rootScope.com + "task/mark_task";
            var postData = {};
            postData.token = $rootScope.token;
            postData.task = task;
            var start = new Date();
            start = start.getTime();
            var taskDate = new Date(task.date * 1000);
            var tempTaskDate = new Date(task.date * 1000);

            if (task.recurrence && task.recurrence > 0) {
                var i = 1;
                recurrence = parseInt(task.recurrence);
                tempRecurrence = parseInt(task.recurrence);

                if (task.recurrenceUnit == 1) {
                    console.log((tempTaskDate.getTime() + (parseInt(task.time2seconds) * 1000)), start);

                    while ((tempTaskDate.getTime() + (parseInt(task.time2seconds) * 1000) - (parseInt(task.reminderSeconds) * 1000)) < start) {
                        tempTaskDate = new Date(task.date * 1000);
                        tempTaskDate.setDate(taskDate.getDate() + recurrence);
                        // console.log("Day", tempTaskDate, "Recurrence:", recurrence, "Date:", taskDate.getTime());
                        recurrence = recurrence + tempRecurrence;
                    }
                }

                if (task.recurrenceUnit == 2) {

                    while ((tempTaskDate.getTime() + (parseInt(task.time2seconds) * 1000) - (parseInt(task.reminderSeconds) * 1000)) < start) {
                        tempTaskDate = new Date(task.date * 1000);
                        tempTaskDate.setDate(taskDate.getDate() + (recurrence * 7));
                        // console.log("Day", tempTaskDate, "Recurrence:",recurrence);
                        recurrence = recurrence + tempRecurrence;
                    }
                }

                if (task.recurrenceUnit == 3) {

                    while ((tempTaskDate.getTime() + (parseInt(task.time2seconds) * 1000) - (parseInt(task.reminderSeconds) * 1000)) < start) {
                        tempTaskDate = new Date(task.date * 1000);
                        tempTaskDate.setMonth(taskDate.getMonth() + recurrence);
                        // console.log("Day", tempTaskDate, "Recurrence:", recurrence);
                        recurrence = recurrence + tempRecurrence;
                    }
                }

                if (task.recurrenceUnit == 4) {

                    while ((tempTaskDate.getTime() + (parseInt(task.time2seconds) * 1000) - (parseInt(task.reminderSeconds) * 1000)) < start) {
                        tempTaskDate = new Date(task.date * 1000);
                        tempTaskDate.setFullYear(taskDate.getFullYear() + recurrence);
                        // console.log("Day", tempTaskDate, "Recurrence:", recurrence);
                        recurrence = recurrence + tempRecurrence;
                    }
                }
            }
            task.recurrenceDate = parseInt(tempTaskDate.getTime() / 1000);
            $http
                .post(postUrl, postData)
                .then(function (res) {
                    if (res.data.ack) {
                        console.log("Recurrence Created!");
                    }
                    else {
                        console.log("Recurrence Already Created!");
                    }
                });
        }

        $rootScope.taskTimeouts = [];

        $rootScope.resetTaskTimeouts = function () {

            angular.forEach($rootScope.taskTimeouts, function (obj) {
                clearTimeout(obj);
            });
            $rootScope.taskTimeouts = [];
        }

        $rootScope.setNotifications = function () {
            $rootScope.resetTaskTimeouts();
            var postData = {};
            postData.token = $rootScope.token;
            var Api = $rootScope.com + "task/notifiable_task_list";

            $http
                .post(Api, postData)
                .then(function (res) {
                    if (res.data.ack == true) {

                        angular.forEach(res.data.response, function (obj, i) {
                            var reminderSeconds = 0;

                            if (obj.reminder && obj.reminder > 0 && obj.reminderUnit) {
                                if (obj.reminderUnit == "1") {
                                    reminderSeconds = obj.reminder * 60;
                                }
                                else if (obj.reminderUnit == "2") {
                                    reminderSeconds = obj.reminder * 60 * 60;
                                }
                                else if (obj.reminderUnit == "3") {
                                    reminderSeconds = obj.reminder * 60 * 60 * 24;
                                }
                            }
                            else {
                                return;
                            }

                            var reminderUnix = parseInt(obj.date) + parseInt(obj.time2seconds) - reminderSeconds;
                            // console.log(reminderUnix, Date(reminderUnix));
                            var currentTime = (Date.now() / 1000 | 0);
                            var d = new Date(obj.date * 1000),	// Convert the passed timestamp to milliseconds
                                yyyy = d.getFullYear(),
                                mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
                                dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
                                time;

                            var dueDate = dd + '/' + mm + '/' + yyyy;
                            var comment = obj.comments ? obj.comments : "";
                            // var tempDate = new Date(Date.UTC(obj.reminderTime * 1000));
                            var timeGap = reminderUnix - currentTime;

                            if (timeGap > 0) {
                                if (timeGap * 1000 > 2147483647) {
                                    // this is beyond maximum set timeout value..
                                    return;
                                }
                                // console.log("timeout set for", obj.subject, (reminderUnix - currentTime) * 1000);
                                // console.log("in future", obj, "will be alerted after", timeGap, "seconds");

                                $rootScope.taskTimeouts.push(setTimeout(function () {
                                    var tempTaskObj = {
                                        subject: obj.subject,
                                        comment: comment,
                                        dueDate: dueDate,
                                        dueTime: obj.time,
                                        recordName: obj.linkedRecordName,
                                        module: obj.module,
                                        priority: obj.priority
                                    };

                                    ngDialog.openConfirm({
                                        template: 'modalToGoToTask',
                                        className: 'ngdialog-theme-default',
                                        data: tempTaskObj
                                    }).then(function (value) {
                                        $rootScope.markAsNotified(obj);
                                    }, function (reason) {
                                        $rootScope.markAsNotified(obj);
                                    });
                                }, ((i * 100) + (timeGap * 1000))));
                            }
                            else {
                                console.log("in past", obj, "will be alerted after", (i), "seconds");

                                $rootScope.taskTimeouts.push(setTimeout(function () {
                                    var tempTaskObj = {
                                        subject: obj.subject,
                                        comment: comment,
                                        dueDate: dueDate,
                                        dueTime: obj.time,
                                        recordName: obj.linkedRecordName,
                                        module: obj.module,
                                        priority: obj.priority
                                    };

                                    ngDialog.openConfirm({
                                        template: 'modalToGoToTask',
                                        className: 'ngdialog-theme-default',
                                        data: tempTaskObj
                                    }).then(function (value) {
                                        console.log("marking as notified");
                                        $rootScope.markAsNotified(obj);
                                    }, function (reason) {
                                        $rootScope.markAsNotified(obj);
                                    });
                                }, 1000 * i));
                            }
                        })
                    }
                });
        }
        /*-----------------------------END-EMAIL-----------------------------------------------------*/
        $rootScope.arr_pref_method_comm = {};
        // $rootScope.social_medias = {};
        $rootScope.deprtment_arr = {};
        $rootScope.salesperson_arr = {};
        $rootScope.bucket_arr = {};

        //Capturing attempted state changes
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            // $scope.moduleTracker = moduleTracker;
            moduleTracker.updateName("");
            moduleTracker.updateRecord("");
            moduleTracker.updateRecordName("");
            moduleTracker.updateAdditional("");

            if (toState.name == "page.login") {
                $rootScope.resetTaskTimeouts();
                return;
            }

            $(document).find('.ngdialog').hide();
            $(document).find('#modalToGoToTask').hide();
            var requireLogin = toState.data.requireLogin;
            var currentUser = $rootScope.$storage.getItem("currentUser");

            if (requireLogin && (currentUser == null || currentUser == "null")) {
                if ($rootScope != undefined) {
                    $rootScope.country_type_arr = undefined;
                    $rootScope.arr_vat = undefined;
                    $rootScope.deprtment_arr = undefined;
                    $rootScope.emp_type_arr = undefined;
                    // $rootScope.arr_vat_post_grp = undefined;
                    // $rootScope.customer_arr = undefined;
                    $rootScope.customer_checksum_id = undefined;
                    $rootScope.arr_currency = undefined;
                    $rootScope.prooduct_arr = undefined;
                    $rootScope.arr_posting_group_ids = undefined;
                    $rootScope.prodLastUpdateTime = undefined;
                    $rootScope.invSetuplastUpdateTime = undefined;
                    $rootScope.empllastUpdateTime = undefined;
                    $rootScope.setupGlobalLastUpdateTime = undefined;

                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('country_type_arr');
                    localStorage.removeItem('arr_vat');
                    localStorage.removeItem('deprtment_arr');
                    localStorage.removeItem('emp_type_arr');
                    // localStorage.removeItem('arr_vat_post_grp');
                    localStorage.removeItem('customer_arr');
                    localStorage.removeItem('customer_checksum_id');
                    localStorage.removeItem('cat_prodcut_arr');
                    localStorage.removeItem('arr_currency');
                    localStorage.removeItem('prooduct_arr');
                    $rootScope.app.layout.isBodyColor = true;
                }
                event.preventDefault();
                $state.go('page.login');
            } 
            else {
                $rootScope.currentUser = currentUser;
                $rootScope.company_name = $rootScope.$storage.getItem("company_name");
                $rootScope.token = $rootScope.$storage.getItem("token");
                $rootScope.userId = $rootScope.$storage.getItem("userId");
                $rootScope.defaultCountry = $rootScope.$storage.getItem("country_id");
                $rootScope.defaultCurrency = $rootScope.$storage.getItem("currency_id");
                $rootScope.defaultDateFormat = $rootScope.$storage.getItem("date_format");
                $rootScope.defaultTimeFormat = $rootScope.$storage.getItem("time_format");
                $rootScope.defaultTimeZone = $rootScope.$storage.getItem("timezone");
                $rootScope.defaultCompany = $rootScope.$storage.getItem("company_id");
                $rootScope.defaultLogo = $rootScope.$storage.getItem("company_logo");
                $rootScope.company_logo_width = $rootScope.$storage.getItem("company_logo_width");
                $rootScope.company_logo_height = $rootScope.$storage.getItem("company_logo_height");
                $rootScope.defaultCurrencyCode = $rootScope.$storage.getItem("currency_code");
                $rootScope.defaultUserName = $rootScope.$storage.getItem("user_name");
                $rootScope.defaultuser = $rootScope.$storage.getItem("user");
                $rootScope.known_as = $rootScope.$storage.getItem("known_as");
                $rootScope.first_user_name = $rootScope.$storage.getItem("user");
                $rootScope.opp_cycle_limit = $rootScope.$storage.getItem("opp_cycle_limit");
                $rootScope.text_limit = $rootScope.$storage.getItem("text_limit");
                $rootScope.decimal_range = $rootScope.$storage.getItem("decimal_range");
                $rootScope.user_type = $rootScope.$storage.getItem("user_type");
                $rootScope.deparment = $rootScope.$storage.getItem("deparment");
                $rootScope.oop_cycle_edit_role = $rootScope.$storage.getItem("oop_cycle_edit_role");
                $rootScope.show_sales_add_btn = $rootScope.$storage.getItem("show_sales_add_btn");
                $rootScope.show_customer_add_btn = $rootScope.$storage.getItem("show_customer_add_btn");
                $rootScope.show_supplier_add_btn = $rootScope.$storage.getItem("show_supplier_add_btn");
                $rootScope.userForPortal = $rootScope.$storage.getItem("userForPortal");
                $rootScope.selCust = $rootScope.$storage.getItem("selCust");

                if ($rootScope.known_as == " ") {
                    $rootScope.known_as = $rootScope.first_user_name;
                }

                if (!$rootScope.oppCycleFreqstartmonth)
                    $rootScope.oppCycleFreqstartmonth = $rootScope.$storage.getItem("oppCycleFreqstartmonth");

                // set_vatiables() clears out all the permissions by setting them to false.
                set_variables();
                //$rootScope.user_type = 2;

                if ($rootScope.user_type == 1 || $rootScope.user_type == 2) {
                    $rootScope.defualt_array = JSON.parse(localStorage.getItem('defualt_array'));
                    set_superadmin_permision($rootScope.defualt_array);
                } 
                else if ($rootScope.user_type == 2 || $rootScope.user_type == 3 || $rootScope.user_type == 4) {

                    $rootScope.defualt_array = JSON.parse(localStorage.getItem('defualt_array'));
                    $rootScope.new_data = JSON.parse(localStorage.getItem('new_data'));
                    $rootScope.noRoleAssigned = 0;

                    if ($rootScope.new_data == '' || $rootScope.new_data == null || $rootScope.new_data == undefined)
                        $rootScope.noRoleAssigned = 1;

                    if (($rootScope.defualt_array != undefined || $rootScope.defualt_array != null) && ($rootScope.new_data != undefined || $rootScope.new_data != null))
                        set_company_permision($rootScope.defualt_array, $rootScope.new_data);
                }

                // Date Patterns for validation
                if ($rootScope.defaultDateFormat == $rootScope.dtDMY)
                    $rootScope.pattern = '/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/';

                else if ($rootScope.defaultTimeFormat == $rootScope.dtMDY)
                    $rootScope.pattern = '/^(?:(0[1-9]|1[012])[\- \/.](0[1-9]|[12][0-9]|3[01])[\- \/.](19|20)[0-9]{2})$/';
                else
                    $rootScope.pattern = '/^(\d{4})([\/-])(\d{1,2})\2(\d{1,2})$/';

                $rootScope.showLoader = true;

                $rootScope.GetGlobalStatus()
                    .then(function (res) {
                        // if (res == 1)
                        $rootScope.showLoader = false;
                    }).catch(function (e) {
                        $rootScope.showLoader = false;
                        // console.log(e.data);
                        throw new Error(e.data);
                    });

                $rootScope.getErrorMessages();
                $rootScope.regx = JSON.parse($rootScope.$storage.getItem('regx'));
                $rootScope.setNotifications();
            }
        });

        var globalDataStatusCount;

        $rootScope.GetGlobalStatus = function (globalDataStatusCount) {
            $rootScope.customer_checksum_id = JSON.parse(localStorage.getItem('customer_checksum_id'));
            var customer_checksum_id = 0;

            if ($rootScope.customer_checksum_id)// != undefined
                customer_checksum_id = $rootScope.customer_checksum_id;

            var postUrl = $rootScope.setup + "general/get-global-data-status";

            if (globalDataStatusCount == undefined) 
                globalDataStatusCount = $rootScope.maxHttpRepeatCount;

            return $http
                .post(postUrl, {
                    'token': $rootScope.token,
                    'setupGlobalLastUpdateTime': $rootScope.setupGlobalLastUpdateTime,
                    'prodLastUpdateTime': $rootScope.prodLastUpdateTime,
                    'invSetuplastUpdateTime': $rootScope.invSetuplastUpdateTime,
                    'empllastUpdateTime': $rootScope.empllastUpdateTime,
                    'customer_checksum_id': customer_checksum_id
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        /* if (res.data.setupGlobalLastUpdateTimeAck == 0)
                            $rootScope.get_global_data(0);
                        // if (res.data.prodlastUpdateTimeAck == 0)
                        //     $rootScope.getInventoryGlobalData(0);
                        if (res.data.invSetuplastUpdateTimeAck == 0)
                            $rootScope.getInventorySetupGlobalData(0);
                        if (res.data.empllastUpdateTimeAck == 0)
                            $rootScope.getEmployeeGlobalData(0);
                        // if (res.data.customerLastUpdateTimeAck == 1)
                        // $rootScope.getPOSOData(1);
                        $rootScope.getReportsRole(0); */

                        $q.all([
                            res.data.setupGlobalLastUpdateTimeAck == 0 && $rootScope.get_global_data(0),
                            res.data.prodlastUpdateTimeAck == 0 && $rootScope.getInventorySetupGlobalData(0),
                            res.data.empllastUpdateTimeAck == 0 && $rootScope.getEmployeeGlobalData(0),

                            $rootScope.getReportsRole(0)]).then(function (responseArray) {
                                // console.log("promise returns", responseArray);
                                return 1;
                            });
                    }
                    else {
                        /* $rootScope.get_global_data(0);
                        // $rootScope.getInventoryGlobalData(0);
                        $rootScope.getInventorySetupGlobalData(0);
                        $rootScope.getEmployeeGlobalData(0);
                        // $rootScope.getPOSOData(1);
                        $rootScope.getReportsRole(1);  */

                        $q.all([$rootScope.get_global_data(0), $rootScope.getInventorySetupGlobalData(0), $rootScope.getEmployeeGlobalData(0), $rootScope.getReportsRole(1)]).then(function (responseArray) {
                            // alert('all loaded!'); 
                            // console.log("promise returns", responseArray);
                            return 1;
                        });
                    }
                }).catch(function (e) {

                    if (globalDataStatusCount != 0) 
                        return $rootScope.GetGlobalStatus(globalDataStatusCount - 1);
                    // console.log(e.data);
                    throw new Error(e.data);
                });
        }

        var globalDataCount;
        var globalInvDataCount;
        var globalInvSetupDataCount;
        var globalEmpDataCount;
        // var globalPOSODataCount;
        var globalSelDataCount;

        $rootScope.get_global_data = function (param, globalDataCount) {
            //Setting true for ADD Shortcut
            $rootScope.quoteAddFlag = 1;
            $rootScope.saleorderAddFlag = 1;
            $rootScope.customerAddFlag = 1;
            $rootScope.purchaseAddFlag = 1;

            $rootScope.segment_customer_arr = JSON.parse(localStorage.getItem('segment_customer_arr'));
            $rootScope.segment_supplier_arr = JSON.parse(localStorage.getItem('segment_supplier_arr'));
            $rootScope.crm_shippment_methods_arr = JSON.parse(localStorage.getItem('crm_shippment_methods_arr'));
            $rootScope.srm_shippment_methods_arr = JSON.parse(localStorage.getItem('srm_shippment_methods_arr'));
            $rootScope.bying_group_customer_arr = JSON.parse(localStorage.getItem('bying_group_customer_arr'));
            $rootScope.selling_group_arr = JSON.parse(localStorage.getItem('selling_group_arr'));
            $rootScope.region_customer_arr = JSON.parse(localStorage.getItem('region_customer_arr'));
            $rootScope.region_supplier_arr = JSON.parse(localStorage.getItem('region_supplier_arr'));
            $rootScope.country_type_arr = JSON.parse(localStorage.getItem('country_type_arr'));
            $rootScope.arr_currency = JSON.parse(localStorage.getItem('arr_currency'));
            $rootScope.ref_currency_list = JSON.parse(localStorage.getItem('ref_currency_list'));
            $rootScope.arr_pref_method_comm = JSON.parse(localStorage.getItem('arr_pref_method_comm'));
            $rootScope.social_medias = JSON.parse(localStorage.getItem('social_medias'));
            $rootScope.arr_payment_terms = JSON.parse(localStorage.getItem('arr_payment_terms'));
            $rootScope.arr_payment_methods = JSON.parse(localStorage.getItem('arr_payment_methods'));
            $rootScope.arr_srm_payment_terms = JSON.parse(localStorage.getItem('arr_srm_payment_terms'));
            $rootScope.arr_srm_payment_methods = JSON.parse(localStorage.getItem('arr_srm_payment_methods'));
            $rootScope.gl_arr_units = JSON.parse(localStorage.getItem('gl_arr_units'));
            $rootScope.arr_srm_classification = JSON.parse(localStorage.getItem('arr_srm_classification'));
            $rootScope.arr_crm_classification = JSON.parse(localStorage.getItem('arr_crm_classification'));
            $rootScope.arr_customer_classification = JSON.parse(localStorage.getItem('arr_customer_classification'));
            $rootScope.arr_supplier_classification = JSON.parse(localStorage.getItem('arr_supplier_classification'));
            $rootScope.postingGroups = JSON.parse(localStorage.getItem('postingGroups'));
            $rootScope.inventorySetup = JSON.parse(localStorage.getItem('inventorySetup'));
            //console.log( $rootScope.arr_crm_classification);
            /* if (($rootScope.country_type_arr != null || $rootScope.country_type_arr != undefined) && param != 1) {
                // console.log("Inside condition");
                return;
            }
            else {
                // console.log("inside else 34323");
            } */
            //  if ($rootScope.country_type_arr.length>0) return;
            //  $rootScope.showLoader = true;
            var postUrl = $rootScope.setup + "general/get-global-data";

            if (globalDataCount == undefined) 
                globalDataCount = $rootScope.maxHttpRepeatCount;

            return $http
                .post(postUrl, {
                    'token': $rootScope.token,
                    'setupGlobalLastUpdateTime': $rootScope.setupGlobalLastUpdateTime
                })
                .then(function (res) { // $rootScope.showLoader = false;                
                    if (res.data.ack == true) {
                        if (res.data.error != 3) {
                            //console.log(res.data.response);
                            $rootScope.setupGlobalLastUpdateTime = res.data.setupGlobalLastUpdateTime;

                            $rootScope.segment_customer_arr = res.data.response.segment_customer_arr;
                            $rootScope.$storage.setItem('segment_customer_arr', JSON.stringify($rootScope.segment_customer_arr));

                            $rootScope.segment_supplier_arr = res.data.response.segment_supplier_arr;
                            $rootScope.$storage.setItem('segment_supplier_arr', JSON.stringify($rootScope.segment_supplier_arr));

                            $rootScope.crm_shippment_methods_arr = res.data.response.crm_shippment_methods_arr;
                            $rootScope.$storage.setItem('crm_shippment_methods_arr', JSON.stringify($rootScope.crm_shippment_methods_arr));

                            $rootScope.srm_shippment_methods_arr = res.data.response.srm_shippment_methods_arr;
                            $rootScope.$storage.setItem('srm_shippment_methods_arr', JSON.stringify($rootScope.srm_shippment_methods_arr));

                            $rootScope.bying_group_customer_arr = res.data.response.bying_group_customer_arr;
                            $rootScope.$storage.setItem('bying_group_customer_arr', JSON.stringify($rootScope.bying_group_customer_arr));

                            $rootScope.selling_group_arr = res.data.response.selling_group_arr;
                            $rootScope.$storage.setItem('selling_group_arr', JSON.stringify($rootScope.selling_group_arr));

                            $rootScope.region_customer_arr = res.data.response.region_customer_arr;
                            $rootScope.$storage.setItem('region_customer_arr', JSON.stringify($rootScope.region_customer_arr));

                            $rootScope.region_supplier_arr = res.data.response.region_supplier_arr;
                            $rootScope.$storage.setItem('region_supplier_arr', JSON.stringify($rootScope.region_supplier_arr));

                            $rootScope.country_type_arr = res.data.response.country_type_arr;
                            $rootScope.$storage.setItem('country_type_arr', JSON.stringify($rootScope.country_type_arr));

                            $rootScope.arr_currency = res.data.response.arr_currency;
                            $rootScope.$storage.setItem('arr_currency', JSON.stringify($rootScope.arr_currency));

                            $rootScope.ref_currency_list = res.data.response.ref_currency_list;
                            $rootScope.$storage.setItem('ref_currency_list', JSON.stringify($rootScope.ref_currency_list));

                            $rootScope.arr_pref_method_comm = res.data.response.arr_pref_method_comm;
                            $rootScope.$storage.setItem('arr_pref_method_comm', JSON.stringify($rootScope.arr_pref_method_comm));

                            $rootScope.social_medias = res.data.response.social_medias;
                            $rootScope.$storage.setItem('social_medias', JSON.stringify($rootScope.social_medias));

                            $rootScope.arr_payment_terms = res.data.response.arr_payment_terms;
                            $rootScope.$storage.setItem('arr_payment_terms', JSON.stringify($rootScope.arr_payment_terms));

                            $rootScope.arr_payment_methods = res.data.response.arr_payment_methods;
                            $rootScope.$storage.setItem('arr_payment_methods', JSON.stringify($rootScope.arr_payment_methods));

                            $rootScope.arr_srm_payment_terms = res.data.response.arr_srm_payment_terms;
                            $rootScope.$storage.setItem('arr_srm_payment_terms', JSON.stringify($rootScope.arr_srm_payment_terms));

                            $rootScope.arr_srm_payment_methods = res.data.response.arr_srm_payment_methods;
                            $rootScope.$storage.setItem('arr_srm_payment_methods', JSON.stringify($rootScope.arr_srm_payment_methods));

                            $rootScope.gl_arr_units = res.data.response.gl_arr_units;
                            $rootScope.$storage.setItem('gl_arr_units', JSON.stringify($rootScope.gl_arr_units));

                            $rootScope.arr_srm_classification = res.data.response.arr_srm_classification;
                            $rootScope.$storage.setItem('arr_srm_classification', JSON.stringify($rootScope.arr_srm_classification));

                            $rootScope.arr_crm_classification = res.data.response.arr_crm_classification;
                            $rootScope.$storage.setItem('arr_crm_classification', JSON.stringify($rootScope.arr_crm_classification));

                            $rootScope.arr_customer_classification = res.data.response.arr_customer_classification;
                            $rootScope.$storage.setItem('arr_customer_classification', JSON.stringify($rootScope.arr_customer_classification));

                            $rootScope.arr_supplier_classification = res.data.response.arr_supplier_classification;
                            $rootScope.$storage.setItem('arr_supplier_classification', JSON.stringify($rootScope.arr_supplier_classification));

                            $rootScope.postingGroups = res.data.response.postingGroups;
                            $rootScope.$storage.setItem('postingGroups', JSON.stringify($rootScope.postingGroups));

                            $rootScope.inventorySetup = res.data.response.inventorySetup;
                            $rootScope.$storage.setItem('inventorySetup', JSON.stringify($rootScope.inventorySetup));
                        }
                        //large array
                        // $rootScope.prooduct_arr = res.data.response.prooduct_arr;
                        // $rootScope.$storage.setItem('prooduct_arr', JSON.stringify($rootScope.prooduct_arr));
                        // $rootScope.bucket_arr = res.data.response.bucket_arr;
                        //  $rootScope.$storage.setItem('bucket_arr', JSON.stringify($rootScope.bucket_arr));

                        if (param == 1)
                            $rootScope.animateGlobal = false;
                    }
                    return 1;
                }).catch(function (e) {
                    if (globalDataCount != 0) 
                        return $rootScope.get_global_data(param, globalDataCount - 1);

                    // console.log(e.data);
                    throw new Error(e.data);
                });
        }

        $rootScope.animateGlobal = false;
        $rootScope.animateBulkEmail = false;
        $rootScope.animateBulkEmailText = '';

        $rootScope.getInventoryGlobalData = function (param, globalInvDataCount) {
            return;
            /* Storage.prototype._getItem = localStorage.getItem;
            Storage.prototype.getItem = function (key) {
                if (key == 'prooduct_arr')
                    return $rootScope.prooduct_arr ? $rootScope.prooduct_arr : null;
                    return localStorage._getItem(key);
            } */
            // $rootScope.prooduct_arr = JSON.parse(localStorage.getItem('prooduct_arr')); 

            if (($rootScope.prooduct_arr != null || $rootScope.prooduct_arr != undefined) && param != 1)
                return;

            var postUrl = $rootScope.stock + "products-listing/get-inventory-global-data";

            if (globalInvDataCount == undefined) 
                globalInvDataCount = $rootScope.maxHttpRepeatCount;

            $http
                .post(postUrl, {
                    'token': $rootScope.token,
                    'prodLastUpdateTime': $rootScope.prodLastUpdateTime
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        //console.log(res.data.response);
                        if (res.data.error != 3) {
                            if (res.data.response.prooduct_arr != null) {
                                $rootScope.prooduct_arr = res.data.response.prooduct_arr;
                                $rootScope.prodLastUpdateTime = res.data.prodlastUpdateTime;
                                // $rootScope.$storage.setItem('prooduct_arr', JSON.stringify($rootScope.prooduct_arr));
                            }
                        }

                        if (param == 1)
                            $rootScope.animateGlobal = false;
                    }
                }).catch(function (e) {
                    if (globalInvDataCount != 0) 
                        return $rootScope.getInventoryGlobalData(param, globalInvDataCount - 1);
                    console.log(e.data);
                    throw new Error(e.data);
                });
        }

        $rootScope.getInventorySetupGlobalData = function (param, globalInvSetupDataCount) {

            $rootScope.cat_prodcut_arr = JSON.parse(localStorage.getItem('cat_prodcut_arr'));
            $rootScope.brand_prodcut_arr = JSON.parse(localStorage.getItem('brand_prodcut_arr'));
            $rootScope.uni_prooduct_arr = JSON.parse(localStorage.getItem('uni_prooduct_arr'));
            $rootScope.itemOriginCountries = JSON.parse(localStorage.getItem('itemOriginCountries'));

            var postUrl = $rootScope.stock + "products-listing/get-inventory-setup-global-data";
            if (globalInvSetupDataCount == undefined) 
                globalInvSetupDataCount = $rootScope.maxHttpRepeatCount;

            return $http
                .post(postUrl, {
                    'token': $rootScope.token,
                    'invSetuplastUpdateTime': $rootScope.invSetuplastUpdateTime
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        if (res.data.error != 3) {
                            $rootScope.invSetuplastUpdateTime = res.data.invSetuplastUpdateTime;
                            //console.log(res.data.response);

                            $rootScope.cat_prodcut_arr = res.data.response.cat_prodcut_arr;
                            $rootScope.$storage.setItem('cat_prodcut_arr', JSON.stringify($rootScope.cat_prodcut_arr));

                            $rootScope.brand_prodcut_arr = res.data.response.brand_prodcut_arr;
                            $rootScope.$storage.setItem('brand_prodcut_arr', JSON.stringify($rootScope.brand_prodcut_arr));

                            $rootScope.uni_prooduct_arr = res.data.response.uni_prooduct_arr;
                            $rootScope.$storage.setItem('uni_prooduct_arr', JSON.stringify($rootScope.uni_prooduct_arr));

                            $rootScope.itemOriginCountries = res.data.response.itemOriginCountries;
                            $rootScope.$storage.setItem('itemOriginCountries', JSON.stringify($rootScope.itemOriginCountries));
                        }
                    }
                    return 2;
                }).catch(function (e) {
                    if (globalInvSetupDataCount != 0)
                        return $rootScope.getInventorySetupGlobalData(param, globalInvSetupDataCount - 1);
                    // console.log(e.data);
                    throw new Error(e.data);
                });
        }

        $rootScope.getEmployeeGlobalData = function (param, globalEmpDataCount) {

            $rootScope.deprtment_arr = JSON.parse(localStorage.getItem('deprtment_arr'));
            $rootScope.emp_type_arr = JSON.parse(localStorage.getItem('emp_type_arr'));
            $rootScope.salesperson_arr = JSON.parse(localStorage.getItem('salesperson_arr'));
            $rootScope.arr_vat = JSON.parse(localStorage.getItem('arr_vat'));
            // $rootScope.arr_vat_post_grp = JSON.parse(localStorage.getItem('arr_vat_post_grp'));
            // if ($rootScope.arr_vat != null && $rootScope.deprtment_arr != null && $rootScope.emp_type_arr != null && $rootScope.arr_vat_post_grp != null && param != 1)
            //     return;
            var postUrl = $rootScope.hr + "employee/get-employee-global-data";

            if (globalEmpDataCount == undefined) 
                globalEmpDataCount = $rootScope.maxHttpRepeatCount;

            return $http
                .post(postUrl, {
                    'token': $rootScope.token,
                    'empllastUpdateTime': $rootScope.empllastUpdateTime
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        if (res.data.error != 3) {
                            //console.log(res.data.response);
                            $rootScope.empllastUpdateTime = res.data.empllastUpdateTime;

                            $rootScope.deprtment_arr = res.data.response.deprtment_arr;
                            $rootScope.$storage.setItem('deprtment_arr', JSON.stringify($rootScope.deprtment_arr));

                            $rootScope.emp_type_arr = res.data.response.emp_type_arr;
                            $rootScope.$storage.setItem('emp_type_arr', JSON.stringify($rootScope.emp_type_arr));

                            $rootScope.salesperson_arr = res.data.response.salesperson_arr;
                            $rootScope.$storage.setItem('salesperson_arr', JSON.stringify($rootScope.salesperson_arr));

                            $rootScope.arr_vat = res.data.response.arr_vat;
                            $rootScope.$storage.setItem('arr_vat', JSON.stringify($rootScope.arr_vat));
                            // $rootScope.arr_vat_post_grp = res.data.response.arr_vat_post_grp;
                            // $rootScope.$storage.setItem('arr_vat_post_grp', JSON.stringify($rootScope.arr_vat_post_grp));
                        }
                    }
                    return 3;
                }).catch(function (e) {
                    if (globalEmpDataCount != 0) 
                        return $rootScope.getEmployeeGlobalData(param, globalEmpDataCount - 1);
                    // toaster.pop('error', 'info', 'Server is not Acknowledging');
                    // console.log(e.data);
                    throw new Error(e.data);
                });
        }

        $rootScope.getPOSOData = function (param, globalPOSODataCount) {
            return;
            $rootScope.customer_arr = JSON.parse(localStorage.getItem('customer_arr'));
            $rootScope.customer_checksum_id = JSON.parse(localStorage.getItem('customer_checksum_id'));

            var postUrl = $rootScope.sales + "customer/customer/get-customer-global";
            var customer_checksum_id = 0;

            if (($rootScope.customer_arr != null || $rootScope.customer_arr != undefined) && param != 1)
                return;

            if ($rootScope.customer_checksum_id != undefined)
                customer_checksum_id = $rootScope.customer_checksum_id;

            if (globalPOSODataCount == undefined) globalPOSODataCount = $rootScope.maxHttpRepeatCount;

            $http
                .post(postUrl, {
                    'token': $rootScope.token,
                    'customer_checksum_id': customer_checksum_id
                })
                .then(function (res) {
                    if (res.data.response != undefined) {
                        if (res.data.response.customer_global != undefined && res.data.response.customer_global.ack == true) {
                            $rootScope.customer_checksum_id = res.data.response.customer_global.customer_checksum_id;
                            $rootScope.customer_arr = res.data.response.customer_global.customer_arr;
                            $rootScope.$storage.setItem('customer_arr', JSON.stringify($rootScope.customer_arr));
                            $rootScope.$storage.setItem('customer_checksum_id', JSON.stringify($rootScope.customer_checksum_id));
                        }
                    }
                }).catch(function (e) {
                    if (globalPOSODataCount != 0) 
                        return $rootScope.getPOSOData(param, globalPOSODataCount - 1);
                    console.log(e.data);
                    throw new Error(e.data);
                });
        }

        $rootScope.updateSelectedGlobalData = function (param, globalSelDataCount) {
            var postUrl = $rootScope.setup + "general/update-selected-global-data";
            if (globalSelDataCount == undefined) 
                globalSelDataCount = $rootScope.maxHttpRepeatCount;

            $http
                .post(postUrl, {
                    'module': param,
                    'loadreq': 1,
                    'token': $rootScope.token,
                    'prodLastUpdateTime': $rootScope.prodLastUpdateTime
                })
                .then(function (res) { // $rootScope.showLoader = false;              
                    if (res.data.ack == true) {
                        if (res.data.error != 3) {
                            if (param == "category") {
                                $rootScope.cat_prodcut_arr = res.data.response.cat_prodcut_arr;
                                $rootScope.$storage.setItem('cat_prodcut_arr', JSON.stringify($rootScope.cat_prodcut_arr));
                            }

                            if (param == "brand") {
                                $rootScope.brand_prodcut_arr = res.data.response.brand_prodcut_arr;
                                $rootScope.$storage.setItem('brand_prodcut_arr', JSON.stringify($rootScope.brand_prodcut_arr));
                            }

                            if (param == "uom") {
                                // $rootScope.uni_prooduct_arr = JSON.parse(localStorage.getItem('uni_prooduct_arr'));
                                $rootScope.uni_prooduct_arr = res.data.response.uni_prooduct_arr;
                                $rootScope.$storage.setItem('uni_prooduct_arr', JSON.stringify($rootScope.uni_prooduct_arr));
                            }

                            if (param == "srmclassification") {
                                $rootScope.arr_srm_classification = res.data.response.arr_srm_classification;
                                $rootScope.$storage.setItem('arr_srm_classification', JSON.stringify($rootScope.arr_srm_classification));
                            }

                            if (param == "supplierclassification") {
                                $rootScope.arr_supplier_classification = res.data.response.arr_supplier_classification;
                                $rootScope.$storage.setItem('arr_supplier_classification', JSON.stringify($rootScope.arr_supplier_classification));
                            }

                            if (param == "item") {
                                if (res.data.response.prooduct_arr != null) {
                                    $rootScope.prooduct_arr = res.data.response.prooduct_arr;
                                    $rootScope.prodLastUpdateTime = res.data.prodlastUpdateTime;
                                    // $rootScope.$storage.setItem('prooduct_arr', JSON.stringify($rootScope.prooduct_arr));
                                }
                            }
                        }
                    }
                }).catch(function (e) {
                    if (globalSelDataCount != 0) 
                        return $rootScope.updateSelectedGlobalData(param, globalSelDataCount - 1);
                    console.log(e.data);
                    throw new Error(e.data);
                });
        }

        $rootScope.getReportsRole = function (param) {
            if ($rootScope.reports_permission != undefined)// && param ==1)
                return false;
            $rootScope.reports_permission = {};
            var url = $rootScope.dashboard + "get-report-roles-for-setup";

            return $http
                .post(url, {
                    'token': $rootScope.token,
                    'userType': $rootScope.user_type,
                    'type': 2
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        $rootScope.reports_permission = res.data.response;
                        $rootScope.showReports = true;
                        $rootScope.reports_permission.trial_balance_summary = ($rootScope.reports_permission.indexOf('1') != -1) ? true : false;
                        $rootScope.reports_permission.trial_balance_detail = ($rootScope.reports_permission.indexOf('2') != -1) ? true : false;
                        $rootScope.reports_permission.vat_report_summary = ($rootScope.reports_permission.indexOf('3') != -1) ? true : false;
                        // $rootScope.reports_permission.vat_report_detail = ($rootScope.reports_permission.indexOf('4') != -1) ? true : false;
                        $rootScope.reports_permission.ec_sales_list = ($rootScope.reports_permission.indexOf('5') != -1) ? true : false;
                        $rootScope.reports_permission.sales_figure_by_customer = ($rootScope.reports_permission.indexOf('6') != -1) ? true : false;
                        $rootScope.reports_permission.sales_figure_by_salesperson = ($rootScope.reports_permission.indexOf('7') != -1) ? true : false;
                        $rootScope.reports_permission.unposted_sales_orders = ($rootScope.reports_permission.indexOf('8') != -1) ? true : false;
                        $rootScope.reports_permission.posted_sales_invoice_and_credit_note = ($rootScope.reports_permission.indexOf('9') != -1) ? true : false;
                        $rootScope.reports_permission.payment_and_refunds_from_customer = ($rootScope.reports_permission.indexOf('10') != -1) ? true : false;
                        $rootScope.reports_permission.customer_aging_summary = ($rootScope.reports_permission.indexOf('11') != -1) ? true : false;
                        $rootScope.reports_permission.customer_statement = ($rootScope.reports_permission.indexOf('12') != -1) ? true : false;
                        $rootScope.reports_permission.sales_person_activity = ($rootScope.reports_permission.indexOf('13') != -1) ? true : false;
                        $rootScope.reports_permission.supplier_aging_summary = ($rootScope.reports_permission.indexOf('14') != -1) ? true : false;
                        $rootScope.reports_permission.unposted_purchase_orders = ($rootScope.reports_permission.indexOf('15') != -1) ? true : false;
                        $rootScope.reports_permission.goods_received_not_invoiced = ($rootScope.reports_permission.indexOf('16') != -1) ? true : false;
                        $rootScope.reports_permission.posted_purchase_orders = ($rootScope.reports_permission.indexOf('17') != -1) ? true : false;
                        $rootScope.reports_permission.remittance_advice = ($rootScope.reports_permission.indexOf('18') != -1) ? true : false;
                        // $rootScope.reports_permission.stock_availability_summary = ($rootScope.reports_permission.indexOf('19') != -1) ? true : false;
                        $rootScope.reports_permission.employee_benefits = ($rootScope.reports_permission.indexOf('19') != -1) ? true : false;
                        $rootScope.reports_permission.sales_figure_by_items = ($rootScope.reports_permission.indexOf('20') != -1) ? true : false;
                        $rootScope.reports_permission.item_purchases_by_supplier = ($rootScope.reports_permission.indexOf('21') != -1) ? true : false;
                        $rootScope.reports_permission.employee_list = ($rootScope.reports_permission.indexOf('22') != -1) ? true : false;
                        $rootScope.reports_permission.profit_and_loss_statement = ($rootScope.reports_permission.indexOf('23') != -1) ? true : false;
                        $rootScope.reports_permission.supplier_activity = ($rootScope.reports_permission.indexOf('24') != -1) ? true : false;
                        $rootScope.reports_permission.balance_sheet = ($rootScope.reports_permission.indexOf('4') != -1) ? true : false;
                        $rootScope.reports_permission.stock_availability_detail = ($rootScope.reports_permission.indexOf('25') != -1) ? true : false;
                        $rootScope.reports_permission.sales_figure_by_buying_grp = ($rootScope.reports_permission.indexOf('26') != -1) ? true : false;
                        // $rootScope.reports_permission.customer_aging_detail = ($rootScope.reports_permission.indexOf('27') != -1) ? true : false; 
                        $rootScope.reports_permission.customer_depot_sales_analysis = ($rootScope.reports_permission.indexOf('27') != -1) ? true : false;
                        $rootScope.reports_permission.customer_avg_payment_days = ($rootScope.reports_permission.indexOf('28') != -1) ? true : false;
                        $rootScope.reports_permission.SupplierAvgPaymentDays = ($rootScope.reports_permission.indexOf('29') != -1) ? true : false;
                        // $rootScope.reports_permission.supplier_aging_detail = ($rootScope.reports_permission.indexOf('30') != -1) ? true : false;
                        $rootScope.reports_permission.inventory_cost_and_sales_price = ($rootScope.reports_permission.indexOf('30') != -1) ? true : false;
                        $rootScope.reports_permission.supplier_statement = ($rootScope.reports_permission.indexOf('31') != -1) ? true : false;
                        $rootScope.reports_permission.customer_activity = ($rootScope.reports_permission.indexOf('32') != -1) ? true : false;
                        $rootScope.reports_permission.top_customers = ($rootScope.reports_permission.indexOf('33') != -1) ? true : false;
                        $rootScope.reports_permission.absence_list = ($rootScope.reports_permission.indexOf('34') != -1) ? true : false;
                        $rootScope.reports_permission.inventory_list = ($rootScope.reports_permission.indexOf('35') != -1) ? true : false;
                        $rootScope.reports_permission.customerLabelsList = ($rootScope.reports_permission.indexOf('36') != -1) ? true : false;
                        $rootScope.reports_permission.customerWithNoActivity = ($rootScope.reports_permission.indexOf('37') != -1) ? true : false;
                        $rootScope.reports_permission.crmListing = ($rootScope.reports_permission.indexOf('38') != -1) ? true : false;
                        $rootScope.reports_permission.salespersonCommission = ($rootScope.reports_permission.indexOf('39') != -1) ? true : false;
                        $rootScope.reports_permission.customerRebate = ($rootScope.reports_permission.indexOf('40') != -1) ? true : false;
                        // $rootScope.reports_permission.CRMRebate = ($rootScope.reports_permission.indexOf('41') != -1) ? true : false;
                        $rootScope.reports_permission.accessByTransactionNumbers = ($rootScope.reports_permission.indexOf('41') != -1) ? true : false;
                        $rootScope.reports_permission.item_sales_by_category_brand_segment = ($rootScope.reports_permission.indexOf('42') != -1) ? true : false;
                        $rootScope.reports_permission.SupplierRebate = ($rootScope.reports_permission.indexOf('43') != -1) ? true : false;
                        $rootScope.reports_permission.unposted_cust_orders_detail = ($rootScope.reports_permission.indexOf('44') != -1) ? true : false;
                        $rootScope.reports_permission.unposted_cust_orders_detailByItem = ($rootScope.reports_permission.indexOf('45') != -1) ? true : false;
                        $rootScope.reports_permission.unallocatedStock = ($rootScope.reports_permission.indexOf('46') != -1) ? true : false;
                        $rootScope.reports_permission.customer_reminder = ($rootScope.reports_permission.indexOf('47') != -1) ? true : false;
                        $rootScope.reports_permission.rawMaterialInventory = ($rootScope.reports_permission.indexOf('48') != -1) ? true : false;
                        $rootScope.reports_permission.salesForecast = ($rootScope.reports_permission.indexOf('49') != -1) ? true : false;
                        $rootScope.reports_permission.salePersonLoginActivity = ($rootScope.reports_permission.indexOf('50') != -1) ? true : false;
                        $rootScope.reports_permission.itemSalesMarginalAnalysis = ($rootScope.reports_permission.indexOf('51') != -1) ? true : false;
                        $rootScope.reports_permission.salesFigureByGL = ($rootScope.reports_permission.indexOf('52') != -1) ? true : false;
                        $rootScope.reports_permission.inland_dist_analysis = ($rootScope.reports_permission.indexOf('53') != -1) ? true : false;
                        $rootScope.reports_permission.creditors_aging_report = ($rootScope.reports_permission.indexOf('54') != -1) ? true : false;
                        $rootScope.reports_permission.haulieraccrual = ($rootScope.reports_permission.indexOf('55') != -1) ? true : false;
                        $rootScope.reports_permission.customerItemPrices = ($rootScope.reports_permission.indexOf('56') != -1) ? true : false;
                        $rootScope.reports_permission.inventoryStatistics = ($rootScope.reports_permission.indexOf('57') != -1) ? true : false;
                        // $rootScope.reports_permission.stock_availability_ByDispatchDate = ($rootScope.reports_permission.indexOf('50') != -1) ? true : false;
                        // $rootScope.reports_permission.customer_depot_sales_analysis = ($rootScope.reports_permission.indexOf('46') != -1) ? true : false; 
                        // $rootScope.reports_permission.inventory_cost_and_sales_price = ($rootScope.reports_permission.indexOf('47') != -1) ? true : false; 
                        // $rootScope.reports_permission.accessByTransactionNumbers = ($rootScope.reports_permission.indexOf('48') != -1) ? true : false;                  
                        //above line is temporarily true

                        $rootScope.getFavReports();
                    } else {
                        $rootScope.showReports = false;
                        //toaster.pop('error', 'Info', res.data.error);
                    }
                    return 4;
                })
                .catch(function (error) {
                    // alert('Setup Widgets Error: \n' + error);
                });
        }

        $rootScope.getFavReports = function () {
            // $rootScope.FAV_REPORTS_LIST = []
            $rootScope.FAV_REPORTS = {
                trial_balance_summary: { status: false, state: "app.getTrialBalncReport({module:'summary'})" },
                trial_balance_detail: { status: false, state: "app.getTrialBalncReport({module:'detail2'})" },
                vat_report_summary: { status: false, state: "app.getVATReport({module:'summary'})" },
                vat_report_detail: { status: false, state: "app.getVATReport({module:'summary'})" },
                ec_sales_list: { status: false, state: "app.getECSalesListReport({module:'ec_sales_list'})" },
                sales_figure_by_customer: { status: false, state: "app.getSalesFiguresReport({module:'customer'})" },
                sales_figure_by_salesperson: { status: false, state: "app.getSalesFiguresReport({module:'sale_person'})" },
                unposted_sales_orders: { status: false, state: "app.getUnPostedSalesOrderReport({module:'UnPostedSalesOrders'})" },
                posted_sales_invoice_and_credit_note: { status: false, state: "app.getPostedOrderReport({module:'Sale'})" },
                payment_and_refunds_from_customer: { status: false, state: "app.getCustomerPaymentReport" },
                customer_aging_summary: { status: false, state: "app.getAgedReport({module:'customer2'})" },
                customer_statement: { status: false, state: "app.getStatementReport({module:'customerStatement'})" },
                sales_person_activity: { status: false, state: "app.getSalespersonReport({module:'Salesperson'})" },
                supplier_aging_summary: { status: false, state: "app.getAgedReport({module:'supplier2'})" },
                unposted_purchase_orders: { status: false, state: "app.getUnPostedPurchaseOrderReport({module:'UnPostedPurchaseOrder'})" },
                goods_received_not_invoiced: { status: false, state: "app.getUnPostedOrderReport({module:'PurchaseOrderGoodReceived'})" },
                posted_purchase_orders: { status: false, state: "app.getPostedPurchaseOrderReport({module:'PostedPurchaseOrder'})" },
                remittance_advice: { status: false, state: "app.getRemittanceAdvice({module:'RemittanceAdvice'})" },
                stock_availability_summary: { status: false, state: "app.getStockReport({module:'location'})" },
                sales_figure_by_items: { status: false, state: "app.getSalesFiguresReport({module:'item'})" },
                item_purchases_by_supplier: { status: false, state: "app.getPurchasesBySupplier({module:'purchases_by_supplier'})" },
                employee_list: { status: false, state: "app.getEmpReport({module:'Employee'})" },
                profit_and_loss_statement: { status: false, state: "app.profitAndLossStatement({module:'profit_and_loss_statement'})" },
                supplier_activity: { status: false, state: "app.getSupplierActivity({module:'SupplierActivity'})" },
                balance_sheet: { status: false, state: "app.balanceSheet({module:'balanceSheet'})" },
                stock_availability_detail: { status: false, state: "app.getStockDetailReport({module:'stockdetailed'})" },
                sales_figure_by_buying_grp: { status: false, state: "app.getSalesFiguresReport({module:'buying_group'})" },
                customer_aging_detail: { status: false, state: "app.getAgedReport({module:'customerAgingDetail'})" },
                customer_avg_payment_days: { status: false, state: "app.getSalesFiguresReport({module:'customer_avg_payment_days'})" },
                SupplierAvgPaymentDays: { status: false, state: "app.getUnPostedPurchaseOrderReport({module:'SupplierAvgPaymentDays'})" },
                supplier_aging_detail: { status: false, state: "app.getAgedReport({module:'supplierAgingDetail'})" },
                supplier_statement: { status: false, state: "app.getAgedReport({module:'supplierStatement'})" },
                customer_activity: { status: false, state: "app.getCustomerActivity({module:'CustomerActivity'})" },
                top_customers: { status: false, state: "app.topCustomers({module:'sales'})" },
                absence_list: { status: false, state: "app.getEmpReport({module:'AbsencesList'})" },
                inventory_list: { status: false, state: "app.inventoryList()" },
                customerLabelsList: { status: false, state: "app.getListingReport({module:'customerLabelsList'})" },
                customerWithNoActivity: { status: false, state: "app.customerWithNoActivity({module:'customerWithNoOrders'})" },
                crmListing: { status: false, state: "app.getListingReport({module:'crmListing'})" },
                salespersonCommission: { status: false, state: "app.salespersonCommission()" },
                customerRebate: { status: false, state: "app.customerRebate({module:'Customer'})" },
                CRMRebate: { status: false, state: "app.crmRebate({module:'CRM'})" },
                SupplierRebate: { status: false, state: "app.supplierRebate({module:'Supplier'})" },
                unposted_cust_orders_detail: { status: false, state: "app.getUnPostedOrderDetailReport({module:'UnPostedCustomerOrders'})" },
                unposted_cust_orders_detailByItem: { status: false, state: "app.getUnPostedOrderDetailReport({module:'UnPostedCustomerOrdersByItem'})" },
                unallocatedStock: { status: false, state: "app.getUnPostedOrderDetailReport({module:'unallocatedStock'})" },
                customer_reminder: { status: false, state: "app.customerReminders({module:'customer_reminder'})" },
                salesForecast: { status: false, state: "app.salesForecast({module:'salesForecast'})" },
                stock_availability_ByDispatchDate: { status: false, state: "app.getStockDetailReport({module:'stockAvailabilityByDispatchDate'})" },
                customer_depot_sales_analysis: { status: false, state: "app.topCustomers({module:'salesByDepot'})" },
                inventory_cost_and_sales_price: { status: false, state: "app.inventoryReport({module:'CostPrice'})" },
                item_sales_by_category_brand_segment: { status: false, state: "app.getSalesByCategoryBrandSegment({module:'item_sales_by_category_brand_segment'})" },
                accessByTransactionNumbers: { status: false, state: "app.accessByTransactionNumbers()" },
                rawMaterialInventory: { status: false, state: "app.inventoryReport({module:'RawMaterialInventory'})" },
                employee_benefits: { status: false, state: "app.getEmpReport({module:'EmployeeBenefits'})" },
                salePersonLoginActivity: { status: false, state: "app.salePersonLoginActivity({module:'salePersonLoginActivity'})" },
                itemSalesMarginalAnalysis: { status: false, state: "app.salesMarginalAnalysis({module:'itemSalesMarginalAnalysis'})" },
                salesFigureByGL: { status: false, state: "app.getSalesFigureByGL({module:'salesFigureByGL'})" },
                inland_dist_analysis: { status: false, state: "app.inlandDistributionAnalysis({module:'inland_dist_analysis'})" },
                creditors_aging_report: { status: false, state: "app.getAgedReport({module:'creditors'})" },
                haulieraccrual: { status: false, state: "app.haulieraccrual({module:'haulieraccrual'})" },
                customerItemPrices: { status: false, state: "app.customerItemPrices({module:'customerItemPrices'})" },
                inventoryStatistics: { status: false, state: "app.inventoryStatistics({module:'inventoryStatistics'})" }
            }
            var getFavReportApi = $rootScope.reports + "module/get-fav-report";
            return $http
                .post(getFavReportApi,
                {
                    userId: $rootScope.userId,
                    token: $rootScope.token
                })
                .then(function (res) {
                    $rootScope.FAV_REPORTS_LIST = [];

                    if (res.data.ack == true) {
                        $rootScope.showLoader = false;

                        angular.forEach(res.data.response, function (_rep) {
                            if ($rootScope.reports_permission[_rep.shortId]) {
                                $rootScope.FAV_REPORTS_LIST.push({ shortId: _rep.shortId, title: _rep.title, state: $rootScope.FAV_REPORTS[_rep.shortId].state })
                                $rootScope.FAV_REPORTS[_rep.shortId].status = true;
                            }
                        });
                    }
                });
        }
        $rootScope.showLoader = false;

        function set_company_permision(arr, new_data) {
            //  console.log(arr);	console.log(new_data);
            $.each(new_data, function (index, obj) {
                // console.log(obj);console.log(arr);
                //HR
                if (obj.m_id == arr[0].id) {
                    $rootScope.hr_module = arr[0].id;
                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {
                        //console.log(myarray[i]);
                        if (myarray[i] == 1)
                            $rootScope.allowaddhr = true;
                        else if (myarray[i] == 2)
                            $rootScope.allowedithr = true;
                        else if (myarray[i] == 3)
                            $rootScope.allowviewhr = true;
                        else if (myarray[i] == 4)
                            $rootScope.allowdeletehr = true;
                    }
                }
                //HR General Tab
                else if (obj.m_id == arr[1].id) {
                    $rootScope.hr_general_module = arr[1].id;


                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddhr_gneral = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedithr_gneral = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewhr_gneral = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletehr_gneral = true;

                    }

                }

                //HR Conact Tab

                else if (obj.m_id == arr[2].id) {

                    $rootScope.hr_contact_module = arr[2].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddhr_contact = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedithr_contact = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewhr_contact = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletehr_contact = true;

                    }

                }

                //HR Personal Tab

                else if (obj.m_id == arr[3].id) {

                    $rootScope.hr_personal_module = arr[3].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddhr_personal = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedithr_personal = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewhr_personal = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletehr_personal = true;

                    }

                }

                //HR Salary Tab

                else if (obj.m_id == arr[4].id) {

                    $rootScope.hr_salary_module = arr[4].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddhr_salary = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedithr_salary = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewhr_salary = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletehr_salary = true;

                    }

                }

                //HR Benifit Tab

                else if (obj.m_id == arr[5].id) {

                    $rootScope.hr_benifit_module = arr[5].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddhr_benifit = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedithr_benifit = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewhr_benifit = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletehr_benifit = true;

                    }

                }

                //HR Expense Tab

                else if (obj.m_id == arr[6].id) {

                    $rootScope.hr_expenses_module = arr[6].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddhr_expenses = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedithr_expenses = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewhr_expenses = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletehr_expenses = true;

                        else if (myarray[i] == 6)

                            $rootScope.allowconverthr_expenses = true;

                    }

                }

                //HR Fuel Tab

                else if (obj.m_id == arr[7].id) {

                    $rootScope.hr_fuel_cost_module = arr[7].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddhr_fuel = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedithr_fuel = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewhr_fuel = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletehr_fuel = true;

                    }

                }

                //HR Holiday Tab

                else if (obj.m_id == arr[8].id) {

                    $rootScope.hr_holidays_module = arr[8].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddhr_holiday = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedithr_holiday = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewhr_holiday = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletehr_holiday = true;

                    }

                }





                //Inverntry

                else if (obj.m_id == arr[9].id) {

                    $rootScope.inventry_module = arr[9].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_invertry = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_invertry = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_invertry = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_invertry = true;

                    }

                }

                //Item

                else if (obj.m_id == arr[10].id) {

                    $rootScope.item_module = arr[10].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_item = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_item = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_item = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_item = true;

                    }

                }

                //Item General Tab

                else if (obj.m_id == arr[11].id) {

                    $rootScope.item_gneral_tab_module = arr[11].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_item_gneral_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_item_gneral_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_item_gneral_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_item_gneral_tab = true;

                    }

                }

                //Item Detail Tab

                else if (obj.m_id == arr[12].id) {

                    $rootScope.item_detal_tab_module = arr[12].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_detal_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_detal_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_detal_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_detal_tab = true;

                    }

                }

                //Item Purchase Tab

                else if (obj.m_id == arr[13].id) {

                    $rootScope.item_purchase_tab_module = arr[13].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_item_purchase_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_item_purchase_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_item_purchase_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_item_purchase_tab = true;

                        else if (myarray[i] == 5)

                            $rootScope.allowapprove_item_purchase_tab = true;

                    }

                }

                //Item Sale Tab

                else if (obj.m_id == arr[14].id) {

                    $rootScope.item_sale_tab_module = arr[14].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_item_sale_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_item_sale_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_item_sale_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_item_sale_tab = true;

                    }

                }



                // Item Finished Goods Information

                else if (obj.m_id == arr[110].id) {

                    $rootScope.item_finished_goods = arr[110].id;

                    var myarray = obj.p_id.split(',');

                    for (var i = 0; i < myarray.length; i++) {

                        if (myarray[i] == 1)

                            $rootScope.allowadditem_finished_goods = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedititem_finished_goods = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewitem_finished_goods = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeleteitem_finished_goods = true;

                    }

                }



                //Stock sheet

                else if (obj.m_id == arr[15].id) {

                    $rootScope.stock_sheet_module = arr[15].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_stock_sheet = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_stock_sheet = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_stock_sheet = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_stock_sheet = true;

                    }

                }





                //Purchase

                else if (obj.m_id == arr[16].id) {

                    $rootScope.purchase_module = arr[16].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_purchase = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_purchase = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_purchase = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_purchase = true;

                    }

                }



                //Srm

                else if (obj.m_id == arr[17].id) {

                    $rootScope.srm_module = arr[17].id;

                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_srm = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_srm = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_srm = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_srm = true;

                    }

                }

                //Srm General Tab

                else if (obj.m_id == arr[18].id) {

                    $rootScope.srm_general_tab_module = arr[18].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_srm_general_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_srm_general_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_srm_general_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_srm_general_tab = true;

                        else if (myarray[i] == 6)

                            $rootScope.allowconvert_srm_general_tab = true;

                    }

                }

                //Srm Contact Tab

                else if (obj.m_id == arr[19].id) {

                    $rootScope.srm_contact_tab_module = arr[19].id;



                    //console.log($rootScope.srm_contact_tab_module);

                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_srm_contact_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_srm_contact_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_srm_contact_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_srm_contact_tab = true;

                    }

                }

                //Srm Location Tab

                else if (obj.m_id == arr[20].id) {

                    $rootScope.srm_location_tab_module = arr[20].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_srm_location_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_srm_location_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_srm_location_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_srm_location_tab = true;

                    }

                }

                //Srm Area Tab

                else if (obj.m_id == arr[21].id) {

                    $rootScope.srm_haulier_tab_module = arr[21].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_srm_haulier_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_srm_haulier_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_srm_haulier_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_srm_haulier_tab = true;

                    }

                }

                //Srm Price Tab

                else if (obj.m_id == arr[22].id) {

                    $rootScope.srm_price_tab_module = arr[22].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_srm_price_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_srm_price_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_srm_price_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_srm_price_tab = true;

                        else if (myarray[i] == 6)

                            $rootScope.allowconvert_srm_price_tab = true;

                    }

                }



                //Supplier

                else if (obj.m_id == arr[23].id) {

                    $rootScope.supplier_module = arr[23].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_supplier = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_supplier = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_supplier = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_supplier = true;

                    }

                }

                //Supplier General Tab

                else if (obj.m_id == arr[24].id) {

                    $rootScope.supplier_general_tab_module = arr[24].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_supplier_general_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_supplier_general_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_supplier_general_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_supplier_general_tab = true;

                        else if (myarray[i] == 6)

                            $rootScope.allowconvert_supplier_general_tab = true;

                    }

                }

                //Supplier Finanace Tab

                else if (obj.m_id == arr[25].id) {

                    $rootScope.supplier_finance_tab_module = arr[25].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_supplier_finance_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_supplier_finance_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_supplier_finance_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_supplier_finance_tab = true;

                    }

                }

                //Supplier Contact Tab

                else if (obj.m_id == arr[26].id) {

                    $rootScope.supplier_contact_tab = arr[26].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_supplier_contact_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_supplier_contact_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_supplier_contact_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_supplier_contact_tab = true;

                    }

                }

                //Supplier Location Tab

                else if (obj.m_id == arr[27].id) {

                    $rootScope.supplier_location_tab = arr[27].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_supplier_location_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_supplier_location_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_supplier_location_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_supplier_location_tab = true;

                    }

                }

                //Supplier Area Tab

                else if (obj.m_id == arr[28].id) {

                    $rootScope.supplier_haulier_tab_module = arr[28].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_supplier_haulier_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_supplier_haulier_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_supplier_haulier_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_supplier_haulier_tab = true;

                    }

                }

                //Supplier item info Tab

                else if (obj.m_id == arr[29].id) {

                    $rootScope.supplier_iteminfo_tab_module = arr[29].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_supplier_iteminfo_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_supplier_iteminfo_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_supplier_iteminfo_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_supplier_iteminfo_tab = true;

                    }

                }

                //Supplier price Tab

                else if (obj.m_id == arr[30].id) {

                    $rootScope.supplier_price_tab_module = arr[30].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_supplier_price_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_supplier_price_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_supplier_price_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_supplier_price_tab = true;

                        else if (myarray[i] == 6)

                            $rootScope.allowconvert_supplier_price_tab = true;

                    }

                }



                //Purchase order

                else if (obj.m_id == arr[31].id) {

                    $rootScope.prucase_order_module = arr[31].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_prucase_order = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_prucase_order = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_prucase_order = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_prucase_order = true;

                        else if (myarray[i] == 8)

                            $rootScope.allowpost_prucase_order = true;

                        else if (myarray[i] == 9)

                            $rootScope.allowreceive_prucase_order = true;

                    }

                }

                //Purchase order general   Tab

                else if (obj.m_id == arr[32].id) {

                    $rootScope.prucase_order_general_tab_module = arr[32].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_prucase_order_general_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_prucase_order_general_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_prucase_order_general_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_prucase_order_general_tab = true;

                    }

                }

                //Purchase  order invoice   Tab

                else if (obj.m_id == arr[33].id) {

                    $rootScope.prucase_order_inovice_tab_module = arr[33].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_prucase_order_inovice_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_prucase_order_inovice_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_prucase_order_inovice_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_prucase_order_inovice_tab = true;

                    }

                }

                //Purchase  order shipping   Tab

                else if (obj.m_id == arr[34].id) {

                    $rootScope.prucase_order_shipping_tab_module = arr[34].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_prucase_order_shipping_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_prucase_order_shipping_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_prucase_order_shipping_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_prucase_order_shipping_tab = true;

                    }

                }

                //Purchase  order item detail   Tab

                else if (obj.m_id == arr[35].id) {

                    $rootScope.prucase_order_item_detail_tab_module = arr[35].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_prucase_order_item_detail_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_prucase_order_item_detail_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_prucase_order_item_detail_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_prucase_order_item_detail_tab = true;

                    }

                }



                //Purchase Invoice

                else if (obj.m_id == arr[36].id) {

                    $rootScope.prucase_invoice_module = arr[36].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_prucase_invoice = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_prucase_invoice = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_prucase_invoice = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_prucase_invoice = true;

                    }

                }



                //Purchase Return OR Debit Note

                else if (obj.m_id == arr[37].id) {

                    $rootScope.prucase_order_return_module = arr[37].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_prucase_order_return = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_prucase_order_return = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_prucase_order_return = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_prucase_order_return = true;

                        else if (myarray[i] == 7)

                            $rootScope.allowdispatch_prucase_order_return = true;

                        else if (myarray[i] == 8)

                            $rootScope.allowpost_prucase_order_return = true;

                    }

                }





                //Sales & Crm

                else if (obj.m_id == arr[38].id) {

                    $rootScope.sales_crm_module = arr[38].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_sales_crm_module = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_sales_crm_module = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_sales_crm_module = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_sales_crm_module = true;

                    }

                }



                //Crm

                else if (obj.m_id == arr[39].id) {

                    $rootScope.crm_module = arr[39].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_crm_module = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_crm_module = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_crm_module = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_crm_module = true;

                    }

                }

                //Crm General Tab

                else if (obj.m_id == arr[40].id) {

                    $rootScope.crm_general_tab_module = arr[40].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_crm_general_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_crm_general_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_crm_general_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_crm_general_tab = true;

                        else if (myarray[i] == 6)

                            $rootScope.allowconvert_crm_general_tab = true;

                    }

                }

                //Crm contact Tab

                else if (obj.m_id == arr[41].id) {

                    $rootScope.crm_contact_tab = arr[41].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_crm_contact_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_crm_contact_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_crm_contact_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_crm_contact_tab = true;

                    }

                }

                //Crm location Tab

                else if (obj.m_id == arr[42].id) {

                    $rootScope.crm_location_tab_module = arr[42].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_crm_location_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_crm_location_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_crm_location_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_crm_location_tab = true;

                    }

                }

                //Crm competetor Tab

                else if (obj.m_id == arr[43].id) {

                    $rootScope.crm_competetor_module = arr[43].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_crm_competetor_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_crm_competetor_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_crm_competetor_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_crm_competetor_tab = true;

                    }

                }

                //Crm price Tab

                else if (obj.m_id == arr[44].id) {

                    $rootScope.crm_price_tab_module = arr[44].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_crm_price_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_crm_price_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_crm_price_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_crm_price_tab = true;

                        else if (myarray[i] == 6)

                            $rootScope.allowconvert_crm_price_tab = true;

                    }

                }

                //Crm promotion Tab

                else if (obj.m_id == arr[45].id) {

                    $rootScope.crm_promotiom_tab_module = arr[45].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_crm_promotiom_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_crm_promotiom_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_crm_promotiom_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_crm_promotiom_tab = true;

                    }

                }

                //Crm oop cycle Tab

                else if (obj.m_id == arr[46].id) {

                    $rootScope.crm_oop_cycle_tab_module = arr[46].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_crm_oop_cycle_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_crm_oop_cycle_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_crm_oop_cycle_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_crm_oop_cycle_tab = true;

                    }

                }



                //Customer

                else if (obj.m_id == arr[47].id) {

                    $rootScope.customer_module = arr[47].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_customer_module = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_customer_module = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_customer_module = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_customer_module = true;

                    }

                }

                //Customer General Tab

                else if (obj.m_id == arr[48].id) {





                    $rootScope.cust_gneral_tab_module = arr[48].id;





                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_cust_gneral__tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_cust_gneral__tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_cust_gneral__tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_cust_gneral__tab = true;

                        else if (myarray[i] == 6)

                            $rootScope.allowconvert_cust_general_tab = true;

                    }

                }

                //Customer Finance Tab

                else if (obj.m_id == arr[49].id) {

                    $rootScope.cust_finanace_tab_module = arr[49].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_cust_finanace_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_cust_finanace_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_cust_finanace_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_cust_finanace_tab = true;

                    }

                }

                //Customer contact Tab

                else if (obj.m_id == arr[50].id) {

                    $rootScope.cust_contact_tab_module = arr[50].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_cust_contact_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_cust_contact_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_cust_contact_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_cust_contact_tab = true;

                    }

                }

                //Customer location Tab

                else if (obj.m_id == arr[51].id) {

                    $rootScope.cust_location_tab_module = arr[51].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_cust_location_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_cust_location_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_cust_location_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_cust_location_tab = true;

                    }

                }

                //Customer competetor Tab

                else if (obj.m_id == arr[52].id) {

                    $rootScope.cust_competetor_tab_module = arr[52].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_cust_competetor_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_cust_competetor_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_cust_competetor_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_cust_competetor_tab = true;

                    }

                }

                //Customer price Tab

                else if (obj.m_id == arr[53].id) {

                    $rootScope.cust_price_tab_module = arr[53].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_cust_price_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_cust_price_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_cust_price_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_cust_price_tab = true;

                        else if (myarray[i] == 6)

                            $rootScope.allowconvert_cust_price_tab = true;

                    }

                }

                //Customer promotion Tab

                else if (obj.m_id == arr[54].id) {

                    $rootScope.cust_promotion_tab_module = arr[54].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_cust_promotion_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_cust_promotion_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_cust_promotion_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_cust_promotion_tab = true;

                    }

                }

                //Customer oop cycle Tab

                else if (obj.m_id == arr[55].id) {

                    $rootScope.cust_oop_cycle_tab_module = arr[55].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_cust_oop_cycle_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_cust_oop_cycle_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_cust_oop_cycle_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_cust_oop_cycle_tab = true;

                    }

                }



                //Sales Target

                else if (obj.m_id == arr[56].id) {

                    $rootScope.sale_target_module = arr[56].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_sale_target_module = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_sale_target_module = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_sale_target_module = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_sale_target_module = true;

                    }

                }

                //Sales Forcast

                else if (obj.m_id == arr[57].id) {

                    $rootScope.sale_forcast_module = arr[57].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_sale_forcast_module = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_sale_forcast_module = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_sale_forcast_module = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_sale_forcast_module = true;

                    }

                }

                //Sales Qoute

                else if (obj.m_id == arr[58].id) {

                    $rootScope.sale_qoute_module = arr[58].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_sale_qoute_module = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_sale_qoute_module = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_sale_qoute_module = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_sale_qoute_module = true;

                        else if (myarray[i] == 5)

                            $rootScope.allowapprove_sale_qoute_module = true;

                        else if (myarray[i] == 6)

                            $rootScope.allowconvert_sale_qoute_module = true;

                    }

                }

                //Sales Order

                else if (obj.m_id == arr[59].id) {

                    $rootScope.sale_order_module = arr[59].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_sale_order_module = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_sale_order_module = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_sale_order_module = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_sale_order_module = true;

                        else if (myarray[i] == 5)

                            $rootScope.allowapprove_sale_order_module = true;

                        else if (myarray[i] == 7)

                            $rootScope.allowdispatch_sale_order_module = true;

                        else if (myarray[i] == 8)

                            $rootScope.allowpost_sale_order_module = true;

                    }

                }

                //Sales Invoice

                else if (obj.m_id == arr[60].id) {

                    $rootScope.sale_invoice_module = arr[60].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_sale_invoice_module = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_sale_invoice_module = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_sale_invoice_module = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_sale_invoice_module = true;

                        else if (myarray[i] == 5)

                            $rootScope.allowapprove_sale_invoice_module = true;

                    }

                }

                //Sales Return OR Credit Note

                else if (obj.m_id == arr[61].id) {

                    $rootScope.sale_or_return_module = arr[61].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_sale_or_return_module = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_sale_or_return_module = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_sale_or_return_module = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_sale_or_return_module = true;

                        else if (myarray[i] == 8)

                            $rootScope.allowpost_sale_or_return_module = true;

                        else if (myarray[i] == 9)

                            $rootScope.allowreceive_sale_or_return_module = true;

                    }

                }

                //Sales Promotion

                else if (obj.m_id == arr[62].id) {

                    $rootScope.sale_promotion_module = arr[62].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_sale_promotion_module = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_sale_promotion_module = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_sale_promotion_module = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_sale_promotion_module = true;

                    }

                }

                //Sales Price Adjutsment

                else if (obj.m_id == arr[63].id) {

                    $rootScope.sale_price_adjustment_module = arr[63].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_sale_price_adjustment_module = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_sale_price_adjustment_module = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_sale_price_adjustment_module = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_sale_price_adjustment_module = true;

                    }

                }





                //Sales GL

                else if (obj.m_id == arr[64].id) {

                    $rootScope.gl_module = arr[64].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_gl_module = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_gl_module = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_gl_module = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_gl_module = true;

                    }

                }



                //Sales Chart of Account

                else if (obj.m_id == arr[65].id) {

                    $rootScope.charts_of_account = arr[65].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_charts_of_account = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_charts_of_account = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_charts_of_account = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_charts_of_account = true;

                    }

                }



                //Comunication

                else if (obj.m_id == arr[66].id) {

                    $rootScope.comunication_main = arr[66].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_comunication_main = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_comunication_main = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_comunication_main = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_comunication_main = true;

                    }

                }

                //Comunication Task

                else if (obj.m_id == arr[67].id) {

                    $rootScope.task_module = arr[67].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_task_module = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_task_module = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewhr_task_module = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_task_module = true;

                    }

                }

                //Comunication Calendar

                else if (obj.m_id == arr[68].id) {

                    $rootScope.calendar_module = arr[68].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_calendar_module = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_calendar_module = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_calendar_module = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_calendar_module = true;

                    }

                }

                //Comunication Contact

                else if (obj.m_id == arr[69].id) {

                    $rootScope.contact_module = arr[69].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_contact_module = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_contact_module = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_contact_module = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_contact_module = true;

                    }

                }

                //Comunication Document

                else if (obj.m_id == arr[70].id) {

                    $rootScope.document_module = arr[70].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_document_module = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_document_module = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_document_module = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_document_module = true;

                    }

                }

                //Comunication Help

                else if (obj.m_id == arr[71].id) {

                    $rootScope.help_module = arr[71].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_help_module = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_help_module = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_help_module = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_help_module = true;

                    }

                }

                //Comunication Email

                else if (obj.m_id == arr[72].id) {

                    $rootScope.email_module = arr[72].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadd_email_module = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_email_module = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_email_module = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_email_module = true;

                    }

                }

                //HR Employee

                else if (obj.m_id == arr[73].id) {

                    $rootScope.hr_employee = arr[73].id;



                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddhr_employee = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedithr_employee = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewhr_employee = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletehr_employee = true;

                    }

                }



                // Setup Tab

                else if (obj.m_id == arr[74].id) {

                    $rootScope.setup_main = arr[74].id;

                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddsetup_main = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditsetup_main = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewsetup_main = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletesetup_main = true;

                    }

                }

                // Setup General Tab

                else if (obj.m_id == arr[75].id) {

                    $rootScope.setup_gen = arr[75].id;

                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddsetup_gen = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditsetup_gen = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewsetup_gen = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletesetup_gen = true;

                    }

                }

                // Setup Finance Tab

                else if (obj.m_id == arr[76].id) {

                    $rootScope.setup_fin = arr[76].id;

                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddsetup_fin = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditsetup_fin = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewsetup_fin = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletesetup_fin = true;

                    }

                }

                // Setup Sales & CRM Tab

                else if (obj.m_id == arr[77].id) {

                    $rootScope.setup_salescrm = arr[77].id;

                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddsetup_salescrm = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditsetup_salescrm = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewsetup_salescrm = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletesetup_salescrm = true;

                    }

                }

                // Setup Purchases Tab

                else if (obj.m_id == arr[78].id) {

                    $rootScope.setup_purc = arr[78].id;

                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddsetup_purc = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditsetup_purc = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewsetup_purc = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletesetup_purc = true;

                    }

                }

                // Setup Warehouse Tab

                else if (obj.m_id == arr[79].id) {

                    $rootScope.setup_ware = arr[79].id;

                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddsetup_ware = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditsetup_ware = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewsetup_ware = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletesetup_ware = true;

                    }

                }

                // Setup Inventory Tab

                else if (obj.m_id == arr[80].id) {

                    $rootScope.setup_inven = arr[80].id;

                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddsetup_inven = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditsetup_inven = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewsetup_inven = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletesetup_inven = true;

                    }

                }

                // Setup HR Tab

                else if (obj.m_id == arr[81].id) {

                    $rootScope.setup_hr = arr[81].id;

                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddsetup_hr = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditsetup_hr = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewsetup_hr = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletesetup_hr = true;

                    }

                }

                // Setup Data Migration Tab

                else if (obj.m_id == arr[82].id) {

                    $rootScope.setup_data = arr[82].id;

                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddsetup_data = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditsetup_data = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewsetup_data = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletesetup_data = true;

                    }

                }



                // Inventory Item Journal

                else if (obj.m_id == arr[83].id) {

                    $rootScope.item_journal = arr[83].id;

                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowadditem_journal = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedititem_journal = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewitem_journal = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeleteitem_journal = true;

                        else if (myarray[i] == 8)

                            $rootScope.allowpostitem_journal = true;

                    }

                }



                // Customer Journal

                else if (obj.m_id == arr[84].id) {

                    $rootScope.cust_journal = arr[84].id;

                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddcust_journal = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditcust_journal = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewcust_journal = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletecust_journal = true;

                        else if (myarray[i] == 8)

                            $rootScope.allowpostcust_journal = true;

                    }

                }



                // Supplier Journal

                else if (obj.m_id == arr[85].id) {

                    $rootScope.supp_journal = arr[85].id;

                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddsupp_journal = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditsupp_journal = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewsupp_journal = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletesupp_journal = true;

                        else if (myarray[i] == 8)

                            $rootScope.allowpostsupp_journal = true;

                    }

                }



                // General Journal

                else if (obj.m_id == arr[86].id) {

                    $rootScope.gen_journal = arr[86].id;

                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddgen_journal = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditgen_journal = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewgen_journal = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletegen_journal = true;

                        else if (myarray[i] == 8)

                            $rootScope.allowpostgen_journal = true;

                    }

                }



                // Customer Activity

                else if (obj.m_id == arr[87].id) {

                    $rootScope.cust_activity = arr[87].id;

                    var myarray = obj.p_id.split(',');

                    for (var i = 0; i < myarray.length; i++) {

                        if (myarray[i] == 1)

                            $rootScope.allowaddcust_activity = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditcust_activity = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewcust_activity = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletecust_activity = true;

                    }

                }



                // Customer Attachments

                else if (obj.m_id == arr[88].id) {

                    $rootScope.cust_attachments = arr[88].id;

                    var myarray = obj.p_id.split(',');

                    for (var i = 0; i < myarray.length; i++) {

                        if (myarray[i] == 1)

                            $rootScope.allowaddcust_attachments = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditcust_attachments = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewcust_attachments = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletecust_attachments = true;

                    }

                }



                // Customer Comments

                else if (obj.m_id == arr[89].id) {

                    $rootScope.cust_comments = arr[89].id;

                    var myarray = obj.p_id.split(',');

                    for (var i = 0; i < myarray.length; i++) {

                        if (myarray[i] == 1)

                            $rootScope.allowaddcust_comments = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditcust_comments = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewcust_comments = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletecust_comments = true;

                    }

                }









                // Posted Debit Notes

                else if (obj.m_id == arr[90].id) {

                    $rootScope.posted_debit_notes = arr[90].id;

                    var myarray = obj.p_id.split(',');

                    for (var i = 0; i < myarray.length; i++) {

                        if (myarray[i] == 1)

                            $rootScope.allowaddposted_debit_notes = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditposted_debit_notes = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewposted_debit_notes = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeleteposted_debit_notes = true;

                    }

                }





                // Posted Credit Notes

                else if (obj.m_id == arr[91].id) {

                    $rootScope.posted_credit_notes = arr[91].id;

                    var myarray = obj.p_id.split(',');

                    for (var i = 0; i < myarray.length; i++) {

                        if (myarray[i] == 1)

                            $rootScope.allowaddposted_credit_notes = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditposted_credit_notes = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewposted_credit_notes = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeleteposted_credit_notes = true;

                    }

                }



                // Setup Auto Email Configuration

                else if (obj.m_id == arr[92].id) {

                    $rootScope.setup_email_config = arr[92].id;

                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        //console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddsetup_email_config = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditsetup_email_config = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewsetup_email_config = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletesetup_email_config = true;

                    }

                }



                // Supplier Comments, Supplier Notes

                else if (obj.m_id == arr[93].id) {

                    $rootScope.supp_comments = arr[93].id;

                    var myarray = obj.p_id.split(',');

                    for (var i = 0; i < myarray.length; i++) {

                        if (myarray[i] == 1)

                            $rootScope.allowaddsupp_comments = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditsupp_comments = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewsupp_comments = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletesupp_comments = true;

                    }

                }



                // SRM Comments, SRM Notes

                else if (obj.m_id == arr[94].id) {

                    $rootScope.srm_comments = arr[94].id;

                    var myarray = obj.p_id.split(',');

                    for (var i = 0; i < myarray.length; i++) {

                        if (myarray[i] == 1)

                            $rootScope.allowaddsrm_comments = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditsrm_comments = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewsrm_comments = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletesrm_comments = true;

                    }

                }



                // CRM Comments, CRM Notes

                else if (obj.m_id == arr[95].id) {

                    $rootScope.crm_comments = arr[95].id;

                    var myarray = obj.p_id.split(',');

                    for (var i = 0; i < myarray.length; i++) {

                        if (myarray[i] == 1)

                            $rootScope.allowaddcrm_comments = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditcrm_comments = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewcrm_comments = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletecrm_comments = true;

                    }

                }



                // CRM Attachments

                else if (obj.m_id == arr[96].id) {

                    $rootScope.crm_attachments = arr[96].id;

                    var myarray = obj.p_id.split(',');

                    for (var i = 0; i < myarray.length; i++) {

                        if (myarray[i] == 1)

                            $rootScope.allowaddcrm_attachments = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditcrm_attachments = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewcrm_attachments = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletecrm_attachments = true;

                    }

                }



                // SRM Attachments

                else if (obj.m_id == arr[97].id) {

                    $rootScope.srm_attachments = arr[97].id;

                    var myarray = obj.p_id.split(',');

                    for (var i = 0; i < myarray.length; i++) {

                        if (myarray[i] == 1)

                            $rootScope.allowaddsrm_attachments = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditsrm_attachments = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewsrm_attachments = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletesrm_attachments = true;

                    }

                }



                // Supplier Attachments

                else if (obj.m_id == arr[98].id) {

                    $rootScope.supp_attachments = arr[98].id;

                    var myarray = obj.p_id.split(',');

                    for (var i = 0; i < myarray.length; i++) {

                        if (myarray[i] == 1)

                            $rootScope.allowaddsupp_attachments = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditsupp_attachments = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewsupp_attachments = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletesupp_attachments = true;

                    }

                }



                // Supplier Activity

                else if (obj.m_id == arr[99].id) {

                    $rootScope.supp_activity = arr[99].id;

                    var myarray = obj.p_id.split(',');

                    for (var i = 0; i < myarray.length; i++) {

                        if (myarray[i] == 1)

                            $rootScope.allowaddsupp_activity = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditsupp_activity = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewsupp_activity = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletesupp_activity = true;

                    }

                }



                // Item Margin Analysis

                else if (obj.m_id == arr[100].id) {

                    $rootScope.item_margin_analysis = arr[100].id;

                    var myarray = obj.p_id.split(',');

                    for (var i = 0; i < myarray.length; i++) {

                        if (myarray[i] == 1)

                            $rootScope.allowadditem_margin_analysis = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedititem_margin_analysis = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewitem_margin_analysis = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeleteitem_margin_analysis = true;

                    }

                }



                // Item Attachments

                else if (obj.m_id == arr[101].id) {

                    $rootScope.item_attachments = arr[101].id;

                    var myarray = obj.p_id.split(',');

                    for (var i = 0; i < myarray.length; i++) {

                        if (myarray[i] == 1)

                            $rootScope.allowadditem_attachments = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedititem_attachments = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewitem_attachments = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeleteitem_attachments = true;

                    }

                }



                // Item Comments, Item Notes

                else if (obj.m_id == arr[102].id) {

                    $rootScope.item_comments = arr[102].id;

                    var myarray = obj.p_id.split(',');

                    for (var i = 0; i < myarray.length; i++) {

                        if (myarray[i] == 1)

                            $rootScope.allowadditem_comments = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedititem_comments = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewitem_comments = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeleteitem_comments = true;

                    }

                }



                // Item Activity

                else if (obj.m_id == arr[103].id) {

                    $rootScope.item_activity = arr[103].id;

                    var myarray = obj.p_id.split(',');

                    for (var i = 0; i < myarray.length; i++) {

                        if (myarray[i] == 1)

                            $rootScope.allowadditem_activity = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedititem_activity = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewitem_activity = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeleteitem_activity = true;

                    }

                }







                // HR Attachments

                else if (obj.m_id == arr[104].id) {

                    $rootScope.hr_attachments = arr[104].id;

                    var myarray = obj.p_id.split(',');

                    for (var i = 0; i < myarray.length; i++) {

                        if (myarray[i] == 1)

                            $rootScope.allowaddhr_attachments = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedithr_attachments = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewhr_attachments = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletehr_attachments = true;

                    }

                }



                // HR Notes, HR Comments

                else if (obj.m_id == arr[105].id) {

                    $rootScope.hr_comments = arr[105].id;

                    var myarray = obj.p_id.split(',');

                    for (var i = 0; i < myarray.length; i++) {

                        if (myarray[i] == 1)

                            $rootScope.allowaddhr_comments = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedithr_comments = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewhr_comments = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletehr_comments = true;

                    }

                }



                // Item, Transfer Stock

                else if (obj.m_id == arr[106].id) {

                    $rootScope.item_transferstock = arr[106].id;

                    var myarray = obj.p_id.split(',');

                    for (var i = 0; i < myarray.length; i++) {

                        if (myarray[i] == 1)

                            $rootScope.allowadditem_transferstock = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedititem_transferstock = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewitem_transferstock = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeleteitem_transferstock = true;

                        else if (myarray[i] == 8)

                            $rootScope.allowpostitem_transferstock = true;

                    }

                }



                // Item Warehouse Location & Cost

                else if (obj.m_id == arr[107].id) {

                    $rootScope.warehouse_location_cost = arr[107].id;

                    var myarray = obj.p_id.split(',');

                    for (var i = 0; i < myarray.length; i++) {

                        if (myarray[i] == 1)

                            $rootScope.allowadditem_warehouse_location_cost = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedititem_warehouse_location_cost = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewitem_warehouse_location_cost = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeleteitem_warehouse_location_cost = true;

                    }

                }

                // Haulier database Search

                else if (obj.m_id == arr[108].id) {

                    $rootScope.purchase_haulier_database_tab_module = arr[108].id;

                    var myarray = obj.p_id.split(',');



                    for (var i = 0; i < myarray.length; i++) {

                        if (myarray[i] == 1)

                            $rootScope.allowadd_purchase_haulier_database_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_purchase_haulier_database_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_purchase_haulier_database_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_purchase_haulier_database_tab = true;

                    }

                }

                // Customer Portal

                else if (obj.m_id == arr[109].id) {

                    $rootScope.sales_cust_portal_tab_module = arr[109].id;

                    var myarray = obj.p_id.split(',');



                    for (var i = 0; i < myarray.length; i++) {

                        if (myarray[i] == 1)

                            $rootScope.allowadd_cust_portal_tab = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedit_cust_portal_tab = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowview_cust_portal_tab = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdelete_cust_portal_tab = true;

                    }

                }

                // Finance Matrix

                else if (obj.m_id == arr[111].id) {

                    $rootScope.finance_matrix = arr[111].id;

                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        // console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddfinance_matrix = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditfinance_matrix = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewfinance_matrix = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletefinance_matrix = true;

                    }

                }

                // Sales Matrix

                else if (obj.m_id == arr[112].id) {

                    $rootScope.sales_matrix = arr[112].id;

                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        // console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddsales_matrix = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditsales_matrix = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewsales_matrix = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletesales_matrix = true;

                    }

                }

                // purhcase Matrix

                else if (obj.m_id == arr[113].id) {

                    $rootScope.purchase_matrix = arr[113].id;

                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        // console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddpurchase_matrix = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditpurchase_matrix = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewpurchase_matrix = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletepurchase_matrix = true;

                    }

                }

                // inventory Matrix

                else if (obj.m_id == arr[114].id) {

                    $rootScope.inventory_matrix = arr[114].id;

                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        // console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddinventory_matrix = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditinventory_matrix = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewinventory_matrix = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeleteinventory_matrix = true;

                    }

                }

                // hr Matrix

                else if (obj.m_id == arr[115].id) {

                    $rootScope.hr_matrix = arr[115].id;

                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        // console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddhr_matrix = true;

                        else if (myarray[i] == 2)

                            $rootScope.allowedithr_matrix = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewhr_matrix = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletehr_matrix = true;

                    }

                }



                // csv export

                else if (obj.m_id == arr[116].id) {

                    $rootScope.csv_export = arr[116].id;

                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        // console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddcsv_export = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditcsv_export = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewcsv_export = true;

                        else if (myarray[i] == 4)

                            $rootScope.allowdeletecsv_export = true;

                    }

                }



                // shipment target amount

                else if (obj.m_id == arr[117].id) {

                    $rootScope.shipping_target_amount = arr[117].id;

                    var myarray = obj.p_id.split(','); //ida = obj.p_id.split(',')[0];

                    for (var i = 0; i < myarray.length; i++) {

                        // console.log(myarray[i]);

                        if (myarray[i] == 1)

                            $rootScope.allowaddshipping_target_amount = true;

                        else if (myarray[i] == 2)

                            $rootScope.alloweditshipping_target_amount = true;

                        else if (myarray[i] == 3)

                            $rootScope.allowviewshipping_target_amount = true;

                    }

                }



            });



        }



        function set_superadmin_permision(arr) {



            /*

             var newhr=[];

             $.each(arr,function(index,obj){

             newhr.push(obj);

             });*/

            // console.log(arr);



            //HR

            if (arr[0].id) {

                $rootScope.hr_module = arr[0].id;





                $rootScope.allowaddhr = true;

                $rootScope.allowedithr = true;

                $rootScope.allowviewhr = true;

                $rootScope.allowdeletehr = true;

            }

            //HR General Tab

            if (arr[1].id) {

                $rootScope.hr_general_module = arr[1].id;



                $rootScope.allowaddhr_gneral = true;

                $rootScope.allowedithr_gneral = true;

                $rootScope.allowviewhr_gneral = true;

                $rootScope.allowdeletehr_gneral = true;



            }

            //HR Conact Tab

            if (arr[2].id) {

                $rootScope.hr_contact_module = arr[2].id;





                $rootScope.allowaddhr_contact = true;

                $rootScope.allowedithr_contact = true;

                $rootScope.allowviewhr_contact = true;

                $rootScope.allowdeletehr_contact = true;



            }

            //HR Personal Tab

            if (arr[3].id) {

                $rootScope.hr_personal_module = arr[3].id;





                $rootScope.allowaddhr_personal = true;

                $rootScope.allowedithr_personal = true;

                $rootScope.allowviewhr_personal = true;

                $rootScope.allowdeletehr_personal = true;



            }

            //HR Salary Tab

            if (arr[4].id) {

                $rootScope.hr_salary_module = arr[4].id;





                $rootScope.allowaddhr_salary = true;

                $rootScope.allowedithr_salary = true;

                $rootScope.allowviewhr_salary = true;

                $rootScope.allowdeletehr_salary = true;



            }

            //HR Benifit Tab

            if (arr[5].id) {

                $rootScope.hr_benifit_module = arr[5].id;





                $rootScope.allowaddhr_benifit = true;

                $rootScope.allowedithr_benifit = true;

                $rootScope.allowviewhr_benifit = true;

                $rootScope.allowdeletehr_benifit = true;



            }

            //HR Expense Tab

            if (arr[6].id) {

                $rootScope.hr_expenses_module = arr[6].id;



                $rootScope.allowaddhr_expenses = true;

                $rootScope.allowedithr_expenses = true;

                $rootScope.allowviewhr_expenses = true;

                $rootScope.allowdeletehr_expenses = true;

                $rootScope.allowconverthr_expenses = true;





            }

            //HR Fuel Tab

            if (arr[7].id) {

                $rootScope.hr_fuel_cost_module = arr[7].id;





                $rootScope.allowaddhr_fuel = true;

                $rootScope.allowedithr_fuel = true;

                $rootScope.allowviewhr_fuel = true;

                $rootScope.allowdeletehr_fuel = true;



            }

            //HR Holiday Tab

            if (arr[8].id) {

                $rootScope.hr_holidays_module = arr[8].id;





                $rootScope.allowaddhr_holiday = true;

                $rootScope.allowedithr_holiday = true;

                $rootScope.allowviewhr_holiday = true;

                $rootScope.allowdeletehr_holiday = true;



            }





            //Inverntry

            if (arr[9].id) {

                $rootScope.inventry_module = arr[9].id;





                $rootScope.allowadd_invertry = true;

                $rootScope.allowedit_invertry = true;

                $rootScope.allowview_invertry = true;

                $rootScope.allowdelete_invertry = true;

            }

            //Item

            if (arr[10].id) {

                $rootScope.item_module = arr[10].id;





                $rootScope.allowadd_item = true;

                $rootScope.allowedit_item = true;

                $rootScope.allowview_item = true;

                $rootScope.allowdelete_item = true;

            }

            //Item General Tab

            if (arr[11].id) {

                $rootScope.item_gneral_tab_module = arr[11].id;





                $rootScope.allowadd_item_gneral_tab = true;

                $rootScope.allowedit_item_gneral_tab = true;

                $rootScope.allowview_item_gneral_tab = true;

                $rootScope.allowdelete_item_gneral_tab = true;

            }

            //Item Detail Tab

            if (arr[12].id) {

                $rootScope.item_detal_tab_module = arr[12].id;





                $rootScope.allowadd_detal_tab = true;

                $rootScope.allowedit_detal_tab = true;

                $rootScope.allowview_detal_tab = true;

                $rootScope.allowdelete_detal_tab = true;

            }

            //Item Purchase Tab

            if (arr[13].id) {

                $rootScope.item_purchase_tab_module = arr[13].id;





                $rootScope.allowadd_item_purchase_tab = true;

                $rootScope.allowedit_item_purchase_tab = true;

                $rootScope.allowview_item_purchase_tab = true;

                $rootScope.allowdelete_item_purchase_tab = true;

                $rootScope.allowapprove_item_purchase_tab = true;

            }

            //Item Sale Tab

            if (arr[14].id) {

                $rootScope.item_sale_tab_module = arr[14].id;





                $rootScope.allowadd_item_sale_tab = true;

                $rootScope.allowedit_item_sale_tab = true;

                $rootScope.allowview_item_sale_tab = true;

                $rootScope.allowdelete_item_sale_tab = true;

            }

            //Stock sheet

            if (arr[15].id) {

                $rootScope.stock_sheet_module = arr[15].id;





                $rootScope.allowadd_stock_sheet = true;

                $rootScope.allowedit_stock_sheet = true;

                $rootScope.allowview_stock_sheet = true;

                $rootScope.allowdelete_stock_sheet = true;

            }





            //Purchase

            if (arr[16].id) {

                $rootScope.purchase_module = arr[16].id;





                $rootScope.allowadd_purchase = true;

                $rootScope.allowedit_purchase = true;

                $rootScope.allowview_purchase = true;

                $rootScope.allowdelete_purchase = true;

            }



            //Srm

            if (arr[17].id) {

                $rootScope.srm_module = arr[17].id;





                $rootScope.allowadd_srm = true;

                $rootScope.allowedit_srm = true;

                $rootScope.allowview_srm = true;

                $rootScope.allowdelete_srm = true;

            }

            //Srm General Tab

            if (arr[18].id) {

                $rootScope.srm_general_tab_module = arr[18].id;





                $rootScope.allowadd_srm_general_tab = true;

                $rootScope.allowedit_srm_general_tab = true;

                $rootScope.allowview_srm_general_tab = true;

                $rootScope.allowdelete_srm_general_tab = true;

                $rootScope.allowconvert_srm_general_tab = true;

            }

            //Srm Contact Tab

            if (arr[19].id) {

                $rootScope.srm_contact_tab_module = arr[19].id;





                $rootScope.allowadd_srm_contact_tab = true;

                $rootScope.allowedit_srm_contact_tab = true;

                $rootScope.allowview_srm_contact_tab = true;

                $rootScope.allowdelete_srm_contact_tab = true;

            }

            //Srm Location Tab

            if (arr[20].id) {

                $rootScope.srm_location_tab_module = arr[20].id;





                $rootScope.allowadd_srm_location_tab = true;

                $rootScope.allowedit_srm_location_tab = true;

                $rootScope.allowview_srm_location_tab = true;

                $rootScope.allowdelete_srm_location_tab = true;

            }

            //Srm Area Tab

            if (arr[21].id) {

                $rootScope.srm_haulier_tab_module = arr[21].id;





                $rootScope.allowadd_srm_haulier_tab = true;

                $rootScope.allowedit_srm_haulier_tab = true;

                $rootScope.allowview_srm_haulier_tab = true;

                $rootScope.allowdelete_srm_haulier_tab = true;

            }

            //Srm Price Tab

            if (arr[22].id) {

                $rootScope.srm_price_tab_module = arr[22].id;

                $rootScope.allowadd_srm_price_tab = true;

                $rootScope.allowedit_srm_price_tab = true;

                $rootScope.allowview_srm_price_tab = true;

                $rootScope.allowdelete_srm_price_tab = true;

                $rootScope.allowconvert_srm_price_tab = true;

            }



            //Supplier

            if (arr[23].id) {

                $rootScope.supplier_module = arr[23].id;





                $rootScope.allowadd_supplier = true;

                $rootScope.allowedit_supplier = true;

                $rootScope.allowview_supplier = true;

                $rootScope.allowdelete_supplier = true;

            }

            //Supplier General Tab

            if (arr[24].id) {

                $rootScope.supplier_general_tab_module = arr[24].id;





                $rootScope.allowadd_supplier_general_tab = true;

                $rootScope.allowedit_supplier_general_tab = true;

                $rootScope.allowview_supplier_general_tab = true;

                $rootScope.allowdelete_supplier_general_tab = true;

                $rootScope.allowconvert_supplier_general_tab = true;

            }

            //Supplier Finanace Tab

            if (arr[25].id) {

                $rootScope.supplier_finance_tab_module = arr[25].id;





                $rootScope.allowadd_supplier_finance_tab = true;

                $rootScope.allowedit_supplier_finance_tab = true;

                $rootScope.allowview_supplier_finance_tab = true;

                $rootScope.allowdelete_supplier_finance_tab = true;

            }

            //Supplier Contact Tab

            if (arr[26].id) {

                $rootScope.supplier_contact_tab = arr[26].id;





                $rootScope.allowadd_supplier_contact_tab = true;

                $rootScope.allowedit_supplier_contact_tab = true;

                $rootScope.allowview_supplier_contact_tab = true;

                $rootScope.allowdelete_supplier_contact_tab = true;

            }

            //Supplier Location Tab

            if (arr[27].id) {

                $rootScope.supplier_location_tab = arr[27].id;





                $rootScope.allowadd_supplier_location_tab = true;

                $rootScope.allowedit_supplier_location_tab = true;

                $rootScope.allowview_supplier_location_tab = true;

                $rootScope.allowdelete_supplier_location_tab = true;

            }

            //Supplier Area Tab

            if (arr[28].id) {

                $rootScope.supplier_haulier_tab_module = arr[28].id;



                $rootScope.allowadd_supplier_haulier_tab = true;

                $rootScope.allowedit_supplier_haulier_tab = true;

                $rootScope.allowview_supplier_haulier_tab = true;

                $rootScope.allowdelete_supplier_haulier_tab = true;

            }

            //Supplier item info Tab

            if (arr[29].id) {

                $rootScope.supplier_iteminfo_tab_module = arr[29].id;





                $rootScope.allowadd_supplier_iteminfo_tab = true;

                $rootScope.allowedit_supplier_iteminfo_tab = true;

                $rootScope.allowview_supplier_iteminfo_tab = true;

                $rootScope.allowdelete_supplier_iteminfo_tab = true;

            }

            //Supplier price Tab

            if (arr[30].id) {

                $rootScope.supplier_price_tab_module = arr[30].id;

                $rootScope.allowadd_supplier_price_tab = true;

                $rootScope.allowedit_supplier_price_tab = true;

                $rootScope.allowview_supplier_price_tab = true;

                $rootScope.allowdelete_supplier_price_tab = true;

                $rootScope.allowconvert_supplier_price_tab = true;

            }



            //Purchase order

            if (arr[31].id) {

                $rootScope.prucase_order_module = arr[31].id;





                $rootScope.allowadd_prucase_order = true;

                $rootScope.allowedit_prucase_order = true;

                $rootScope.allowview_prucase_order = true;

                $rootScope.allowdelete_prucase_order = true;

                $rootScope.allowpost_prucase_order = true;

                $rootScope.allowreceive_prucase_order = true;

            }

            //Purchase order general   Tab

            if (arr[32].id) {

                $rootScope.prucase_order_general_tab_module = arr[32].id;





                $rootScope.allowadd_prucase_order_general_tab = true;

                $rootScope.allowedit_prucase_order_general_tab = true;

                $rootScope.allowview_prucase_order_general_tab = true;

                $rootScope.allowdelete_prucase_order_general_tab = true;

            }

            //Purchase  order invoice   Tab

            if (arr[33].id) {

                $rootScope.prucase_order_inovice_tab_module = arr[33].id;





                $rootScope.allowadd_prucase_order_inovice_tab = true;

                $rootScope.allowedit_prucase_order_inovice_tab = true;

                $rootScope.allowview_prucase_order_inovice_tab = true;

                $rootScope.allowdelete_prucase_order_inovice_tab = true;

            }

            //Purchase  order shipping   Tab

            if (arr[34].id) {

                $rootScope.prucase_order_shipping_tab_module = arr[34].id;





                $rootScope.allowadd_prucase_order_shipping_tab = true;

                $rootScope.allowedit_prucase_order_shipping_tab = true;

                $rootScope.allowview_prucase_order_shipping_tab = true;

                $rootScope.allowdelete_prucase_order_shipping_tab = true;

            }

            //Purchase  order item detail   Tab

            if (arr[35].id) {

                $rootScope.prucase_order_item_detail_tab_module = arr[35].id;





                $rootScope.allowadd_prucase_order_item_detail_tab = true;

                $rootScope.allowedit_prucase_order_item_detail_tab = true;

                $rootScope.allowview_prucase_order_item_detail_tab = true;

                $rootScope.allowdelete_prucase_order_item_detail_tab = true;

            }



            //Purchase Invoice

            if (arr[36].id) {

                $rootScope.prucase_invoice_module = arr[36].id;





                $rootScope.allowadd_prucase_invoice = true;

                $rootScope.allowedit_prucase_invoice = true;

                $rootScope.allowview_prucase_invoice = true;

                $rootScope.allowdelete_prucase_invoice = true;

            }



            //Purchase Return OR Debit Note

            if (arr[37].id) {

                $rootScope.prucase_order_return_module = arr[37].id;





                $rootScope.allowadd_prucase_order_return = true;

                $rootScope.allowedit_prucase_order_return = true;

                $rootScope.allowview_prucase_order_return = true;

                $rootScope.allowdelete_prucase_order_return = true;

                $rootScope.allowdispatch_prucase_order_return = true;

                $rootScope.allowpost_prucase_order_return = true;

            }





            //Sales & Crm

            if (arr[38].id) {

                $rootScope.sales_crm_module = arr[38].id;





                $rootScope.allowadd_sales_crm_module = true;

                $rootScope.allowedit_sales_crm_module = true;

                $rootScope.allowview_sales_crm_module = true;

                $rootScope.allowdelete_sales_crm_module = true;

            }



            //Crm

            if (arr[39].id) {

                $rootScope.crm_module = arr[39].id;





                $rootScope.allowadd_crm_module = true;

                $rootScope.allowedit_crm_module = true;

                $rootScope.allowview_crm_module = true;

                $rootScope.allowdelete_crm_module = true;

            }

            //Crm General Tab

            if (arr[40].id) {

                $rootScope.crm_general_tab_module = arr[40].id;





                $rootScope.allowadd_crm_general_tab = true;

                $rootScope.allowedit_crm_general_tab = true;

                $rootScope.allowview_crm_general_tab = true;

                $rootScope.allowdelete_crm_general_tab = true;

                $rootScope.allowconvert_crm_general_tab = true;

            }

            //Crm contact Tab

            if (arr[41].id) {

                $rootScope.crm_contact_tab = arr[41].id;





                $rootScope.allowadd_crm_contact_tab = true;

                $rootScope.allowedit_crm_contact_tab = true;

                $rootScope.allowview_crm_contact_tab = true;

                $rootScope.allowdelete_crm_contact_tab = true;

            }

            //Crm location Tab

            if (arr[42].id) {

                $rootScope.crm_location_tab_module = arr[42].id;





                $rootScope.allowadd_crm_location_tab = true;

                $rootScope.allowedit_crm_location_tab = true;

                $rootScope.allowview_crm_location_tab = true;

                $rootScope.allowdelete_crm_location_tab = true;

            }

            //Crm competetor Tab

            if (arr[43].id) {

                $rootScope.crm_competetor_module = arr[43].id;





                $rootScope.allowadd_crm_competetor_tab = true;

                $rootScope.allowedit_crm_competetor_tab = true;

                $rootScope.allowview_crm_competetor_tab = true;

                $rootScope.allowdelete_crm_competetor_tab = true;

            }

            //Crm price Tab

            if (arr[44].id) {

                $rootScope.crm_price_tab_module = arr[44].id;

                $rootScope.allowadd_crm_price_tab = true;

                $rootScope.allowedit_crm_price_tab = true;

                $rootScope.allowview_crm_price_tab = true;

                $rootScope.allowdelete_crm_price_tab = true;

                $rootScope.allowconvert_crm_price_tab = true;

            }

            //Crm promotion Tab

            if (arr[45].id) {

                $rootScope.crm_promotiom_tab_module = arr[45].id;





                $rootScope.allowadd_crm_promotiom_tab = true;

                $rootScope.allowedit_crm_promotiom_tab = true;

                $rootScope.allowview_crm_promotiom_tab = true;

                $rootScope.allowdelete_crm_promotiom_tab = true;

            }

            //Crm oop cycle Tab

            if (arr[46].id) {

                $rootScope.crm_oop_cycle_tab_module = arr[46].id;





                $rootScope.allowadd_crm_oop_cycle_tab = true;

                $rootScope.allowedit_crm_oop_cycle_tab = true;

                $rootScope.allowview_crm_oop_cycle_tab = true;

                $rootScope.allowdelete_crm_oop_cycle_tab = true;

            }



            //Customer

            if (arr[47].id) {

                $rootScope.customer_module = arr[47].id;





                $rootScope.allowadd_customer_module = true;

                $rootScope.allowedit_customer_module = true;

                $rootScope.allowview_customer_module = true;

                $rootScope.allowdelete_customer_module = true;

            }

            //Customer General Tab

            if (arr[48].id) {

                $rootScope.cust_gneral_tab_module = arr[48].id;





                $rootScope.allowadd_cust_gneral__tab = true;

                $rootScope.allowedit_cust_gneral__tab = true;

                $rootScope.allowview_cust_gneral__tab = true;

                $rootScope.allowdelete_cust_gneral__tab = true;

                $rootScope.allowconvert_cust_general_tab = true;

            }

            //Customer Finance Tab

            if (arr[49].id) {

                $rootScope.cust_finanace_tab_module = arr[49].id;





                $rootScope.allowadd_cust_finanace_tab = true;

                $rootScope.allowedit_cust_finanace_tab = true;

                $rootScope.allowview_cust_finanace_tab = true;

                $rootScope.allowdelete_cust_finanace_tab = true;

            }

            //Customer contact Tab

            if (arr[50].id) {

                $rootScope.cust_contact_tab_module = arr[50].id;





                $rootScope.allowadd_cust_contact_tab = true;

                $rootScope.allowedit_cust_contact_tab = true;

                $rootScope.allowview_cust_contact_tab = true;

                $rootScope.allowdelete_cust_contact_tab = true;

            }

            //Customer location Tab

            if (arr[51].id) {

                $rootScope.cust_location_tab_module = arr[51].id;





                $rootScope.allowadd_cust_location_tab = true;

                $rootScope.allowedit_cust_location_tab = true;

                $rootScope.allowview_cust_location_tab = true;

                $rootScope.allowdelete_cust_location_tab = true;

            }

            //Customer competetor Tab

            if (arr[52].id) {

                $rootScope.cust_competetor_tab_module = arr[52].id;





                $rootScope.allowadd_cust_competetor_tab = true;

                $rootScope.allowedit_cust_competetor_tab = true;

                $rootScope.allowview_cust_competetor_tab = true;

                $rootScope.allowdelete_cust_competetor_tab = true;

            }

            //Customer price Tab

            if (arr[53].id) {

                $rootScope.cust_price_tab_module = arr[53].id;

                $rootScope.allowadd_cust_price_tab = true;

                $rootScope.allowedit_cust_price_tab = true;

                $rootScope.allowview_cust_price_tab = true;

                $rootScope.allowdelete_cust_price_tab = true;

                $rootScope.allowconvert_cust_price_tab = true;

            }

            //Customer promotion Tab

            if (arr[54].id) {

                $rootScope.cust_promotion_tab_module = arr[54].id;





                $rootScope.allowadd_cust_promotion_tab = true;

                $rootScope.allowedit_cust_promotion_tab = true;

                $rootScope.allowview_cust_promotion_tab = true;

                $rootScope.allowdelete_cust_promotion_tab = true;

            }

            //Customer oop cycle Tab

            if (arr[55].id) {

                $rootScope.cust_oop_cycle_tab_module = arr[55].id;





                $rootScope.allowadd_cust_oop_cycle_tab = true;

                $rootScope.allowedit_cust_oop_cycle_tab = true;

                $rootScope.allowview_cust_oop_cycle_tab = true;

                $rootScope.allowdelete_cust_oop_cycle_tab = true;

            }



            //Sales Target

            if (arr[56].id) {

                $rootScope.sale_target_module = arr[56].id;





                $rootScope.allowadd_sale_target_module = true;

                $rootScope.allowedit_sale_target_module = true;

                $rootScope.allowview_sale_target_module = true;

                $rootScope.allowdelete_sale_target_module = true;

            }

            //Sales Forcast

            if (arr[57].id) {

                $rootScope.sale_forcast_module = arr[57].id;



                $rootScope.allowadd_sale_forcast_module = true;

                $rootScope.allowedit_sale_forcast_module = true;

                $rootScope.allowview_sale_forcast_module = true;

                $rootScope.allowdelete_sale_forcast_module = true;

            }

            //Sales Qoute

            if (arr[58].id) {

                $rootScope.sale_qoute_module = arr[58].id;

                $rootScope.allowadd_sale_qoute_module = true;

                $rootScope.allowedit_sale_qoute_module = true;

                $rootScope.allowview_sale_qoute_module = true;

                $rootScope.allowdelete_sale_qoute_module = true;

                $rootScope.allowapprove_sale_qoute_module = true;

                $rootScope.allowconvert_sale_qoute_module = true;

            }

            //Sales Order

            if (arr[59].id) {

                $rootScope.sale_order_module = arr[59].id;

                $rootScope.allowadd_sale_order_module = true;

                $rootScope.allowedit_sale_order_module = true;

                $rootScope.allowview_sale_order_module = true;

                $rootScope.allowdelete_sale_order_module = true;

                $rootScope.allowapprove_sale_order_module = true;

                $rootScope.allowdispatch_sale_order_module = true;

                $rootScope.allowpost_sale_order_module = true;

            }

            //Sales Invoice

            if (arr[60].id) {

                $rootScope.sale_invoice_module = arr[60].id;

                $rootScope.allowadd_sale_invoice_module = true;

                $rootScope.allowedit_sale_invoice_module = true;

                $rootScope.allowview_sale_invoice_module = true;

                $rootScope.allowdelete_sale_invoice_module = true;

                $rootScope.allowapprove_sale_invoice_module = true;

            }

            //Sales Return OR Credit Notes

            if (arr[61].id) {

                $rootScope.sale_or_return_module = arr[61].id;





                $rootScope.allowadd_sale_or_return_module = true;

                $rootScope.allowedit_sale_or_return_module = true;

                $rootScope.allowview_sale_or_return_module = true;

                $rootScope.allowdelete_sale_or_return_module = true;

                $rootScope.allowpost_sale_or_return_module = true;

                $rootScope.allowreceive_sale_or_return_module = true;

            }

            //Sales Promotion

            if (arr[62].id) {

                $rootScope.sale_promotion_module = arr[62].id;





                $rootScope.allowadd_sale_promotion_module = true;

                $rootScope.allowedit_sale_promotion_module = true;

                $rootScope.allowview_sale_promotion_module = true;

                $rootScope.allowdelete_sale_promotion_module = true;

            }

            //Sales Price Adjutsment

            if (arr[63].id) {

                $rootScope.sale_price_adjustment_module = arr[63].id;





                $rootScope.allowadd_sale_price_adjustment_module = true;

                $rootScope.allowedit_sale_price_adjustment_module = true;

                $rootScope.allowview_sale_price_adjustment_module = true;

                $rootScope.allowdelete_sale_price_adjustment_module = true;

            }





            //Sales GL

            if (arr[64].id) {



                $rootScope.gl_module = arr[64].id;





                $rootScope.allowadd_gl_module = true;

                $rootScope.allowedit_gl_module = true;

                $rootScope.allowview_gl_module = true;

                $rootScope.allowdelete_gl_module = true;

            }



            //Sales Chart of Account

            if (arr[65].id) {

                $rootScope.charts_of_account = arr[65].id;





                $rootScope.allowadd_charts_of_account = true;

                $rootScope.allowedit_charts_of_account = true;

                $rootScope.allowview_charts_of_account = true;

                $rootScope.allowdelete_charts_of_account = true;

            }



            //Comunication

            if (arr[66].id) {

                $rootScope.comunication_main = arr[66].id;





                $rootScope.allowadd_comunication_main = true;

                $rootScope.allowedit_comunication_main = true;

                $rootScope.allowview_comunication_main = true;

                $rootScope.allowdelete_comunication_main = true;

            }

            //Comunication Task

            if (arr[67].id) {

                $rootScope.task_module = arr[67].id;





                $rootScope.allowadd_task_module = true;

                $rootScope.allowedit_task_module = true;

                $rootScope.allowview_task_module = true;

                $rootScope.allowdelete_task_module = true;

            }

            //Comunication Calendar

            if (arr[68].id) {

                $rootScope.calendar_module = arr[68].id;





                $rootScope.allowadd_calendar_module = true;

                $rootScope.allowedit_calendar_module = true;

                $rootScope.allowview_calendar_module = true;

                $rootScope.allowdelete_calendar_module = true;

            }

            //Comunication Contact

            if (arr[69].id) {

                $rootScope.contact_module = arr[69].id;





                $rootScope.allowadd_contact_module = true;

                $rootScope.allowedit_contact_module = true;

                $rootScope.allowview_contact_module = true;

                $rootScope.allowdelete_contact_module = true;

            }

            //Comunication Document

            if (arr[70].id) {

                $rootScope.document_module = arr[70].id;





                $rootScope.allowadd_document_module = true;

                $rootScope.allowedit_document_module = true;

                $rootScope.allowview_document_module = true;

                $rootScope.allowdelete_document_module = true;

            }

            //Comunication Help

            if (arr[71].id) {

                $rootScope.help_module = arr[71].id;





                $rootScope.allowadd_help_module = true;

                $rootScope.allowedit_help_module = true;

                $rootScope.allowview_help_module = true;

                $rootScope.allowdelete_help_module = true;

            }

            //Comunication Email

            if (arr[72].id) {

                $rootScope.email_module = arr[72].id;





                $rootScope.allowadd_email_module = true;

                $rootScope.allowedit_email_module = true;

                $rootScope.allowview_email_module = true;

                $rootScope.allowdelete_email_module = true;

            }



            //HR Employee

            if (arr[73].id) {

                $rootScope.hr_employee = arr[73].id;

                $rootScope.allowaddhr_employee = true;

                $rootScope.allowedithr_employee = true;

                $rootScope.allowviewhr_employee = true;

                $rootScope.allowdeletehr_employee = true;

            }



            // Setup Tab

            if (arr[74].id) {

                $rootScope.setup_main = arr[74].id;

                $rootScope.allowaddsetup_main = true;

                $rootScope.alloweditsetup_main = true;

                $rootScope.allowviewsetup_main = true;

                $rootScope.allowdeletesetup_main = true;

            }

            // Setup General Tab

            if (arr[75].id) {

                $rootScope.setup_gen = arr[75].id;





                $rootScope.allowaddsetup_gen = true;



                $rootScope.alloweditsetup_gen = true;

                $rootScope.allowviewsetup_gen = true;

                $rootScope.allowdeletesetup_gen = true;

            }

            // Setup Finance Tab

            if (arr[76].id) {

                $rootScope.setup_fin = arr[76].id;





                //console.log(myarray[i]);



                $rootScope.allowaddsetup_fin = true;



                $rootScope.alloweditsetup_fin = true;



                $rootScope.allowviewsetup_fin = true;



                $rootScope.allowdeletesetup_fin = true;



            }

            // Setup Sales & CRM Tab

            if (arr[77].id) {

                $rootScope.setup_salescrm = arr[77].id;





                //console.log(myarray[i]);



                $rootScope.allowaddsetup_salescrm = true;



                $rootScope.alloweditsetup_salescrm = true;



                $rootScope.allowviewsetup_salescrm = true;



                $rootScope.allowdeletesetup_salescrm = true;



            }

            // Setup Purchases Tab

            if (arr[78].id) {

                $rootScope.setup_purc = arr[78].id;





                //console.log(myarray[i]);



                $rootScope.allowaddsetup_purc = true;



                $rootScope.alloweditsetup_purc = true;



                $rootScope.allowviewsetup_purc = true;



                $rootScope.allowdeletesetup_purc = true;



            }

            // Setup Warehouse Tab

            if (arr[79].id) {

                $rootScope.setup_ware = arr[79].id;





                //console.log(myarray[i]);



                $rootScope.allowaddsetup_ware = true;



                $rootScope.alloweditsetup_ware = true;



                $rootScope.allowviewsetup_ware = true;



                $rootScope.allowdeletesetup_ware = true;



            }

            // Setup Inventory Tab

            if (arr[80].id) {

                $rootScope.setup_inven = arr[80].id;

                $rootScope.allowaddsetup_inven = true;

                $rootScope.alloweditsetup_inven = true;

                $rootScope.allowviewsetup_inven = true;

                $rootScope.allowdeletesetup_inven = true;



            }

            // Setup HR Tab

            if (arr[81].id) {

                $rootScope.setup_hr = arr[81].id;

                $rootScope.allowaddsetup_hr = true;

                $rootScope.alloweditsetup_hr = true;

                $rootScope.allowviewsetup_hr = true;

                $rootScope.allowdeletesetup_hr = true;



            }

            // Setup Data Migration Tab

            if (arr[82].id) {

                $rootScope.setup_data = arr[82].id;

                $rootScope.allowaddsetup_data = true;

                $rootScope.alloweditsetup_data = true;

                $rootScope.allowviewsetup_data = true;

                $rootScope.allowdeletesetup_data = true;

            }



            // Inventory Item Journal

            if (arr[83].id) {

                $rootScope.item_journal = arr[83].id;

                $rootScope.allowadditem_journal = true;

                $rootScope.allowedititem_journal = true;

                $rootScope.allowviewitem_journal = true;

                $rootScope.allowdeleteitem_journal = true;

                $rootScope.allowpostitem_journal = true;

            }



            // Customer Journal

            if (arr[84].id) {

                $rootScope.cust_journal = arr[84].id;

                $rootScope.allowaddcust_journal = true;

                $rootScope.alloweditcust_journal = true;

                $rootScope.allowviewcust_journal = true;

                $rootScope.allowdeletecust_journal = true;

                $rootScope.allowpostcust_journal = true;

            }



            // Supplier Journal

            if (arr[85].id) {

                $rootScope.supp_journal = arr[85].id;

                $rootScope.allowaddsupp_journal = true;

                $rootScope.alloweditsupp_journal = true;

                $rootScope.allowviewsupp_journal = true;

                $rootScope.allowdeletesupp_journal = true;

                $rootScope.allowpostsupp_journal = true;



            }



            // General Journal

            if (arr[86].id) {

                $rootScope.gen_journal = arr[86].id;

                $rootScope.allowaddgen_journal = true;

                $rootScope.alloweditgen_journal = true;

                $rootScope.allowviewgen_journal = true;

                $rootScope.allowdeletegen_journal = true;

                $rootScope.allowpostgen_journal = true;

            }



            // Customer Activity

            if (arr[87].id) {

                $rootScope.cust_activity = arr[87].id;

                $rootScope.allowaddcust_activity = true;

                $rootScope.alloweditcust_activity = true;

                $rootScope.allowviewcust_activity = true;

                $rootScope.allowdeletecust_activity = true;

            }



            // Customer Attachments

            if (arr[88].id) {

                $rootScope.cust_attachments = arr[88].id;

                $rootScope.allowaddcust_attachments = true;

                $rootScope.alloweditcust_attachments = true;

                $rootScope.allowviewcust_attachments = true;

                $rootScope.allowdeletecust_attachments = true;

            }



            // Customer Comments

            if (arr[89].id) {

                $rootScope.cust_comments = arr[89].id;

                $rootScope.allowaddcust_comments = true;

                $rootScope.alloweditcust_comments = true;

                $rootScope.allowviewcust_comments = true;

                $rootScope.allowdeletecust_comments = true;

            }





            // Posted Debit Notes

            if (arr[90].id) {

                $rootScope.posted_debit_notes = arr[90].id;

                $rootScope.allowaddposted_debit_notes = true;

                $rootScope.alloweditposted_debit_notes = true;

                $rootScope.allowviewposted_debit_notes = true;

                $rootScope.allowdeleteposted_debit_notes = true;

            }



            // Posted Credit Notes

            if (arr[91].id) {

                $rootScope.posted_credit_notes = arr[91].id;

                $rootScope.allowaddposted_credit_notes = true;

                $rootScope.alloweditposted_credit_notes = true;

                $rootScope.allowviewposted_credit_notes = true;

                $rootScope.allowdeleteposted_credit_notes = true;

            }



            // Setup Auto Email Config

            if (arr[92].id) {

                $rootScope.setup_email_config = arr[92].id;

                $rootScope.allowaddsetup_email_config = true;

                $rootScope.alloweditsetup_email_config = true;

                $rootScope.allowviewsetup_email_config = true;

                $rootScope.allowdeletesetup_email_config = true;

            }



            // Supplier Comments, Supplier Notes

            if (arr[93].id) {

                $rootScope.supp_comments = arr[93].id;

                $rootScope.allowaddsupp_comments = true;

                $rootScope.alloweditsupp_comments = true;

                $rootScope.allowviewsupp_comments = true;

                $rootScope.allowdeletesupp_comments = true;

            }



            // SRM Comments, SRM Notes

            if (arr[94].id) {

                $rootScope.srm_comments = arr[94].id;

                $rootScope.allowaddsrm_comments = true;

                $rootScope.alloweditsrm_comments = true;

                $rootScope.allowviewsrm_comments = true;

                $rootScope.allowdeletesrm_comments = true;

            }



            // CRM Comments, CRM Notes

            if (arr[95].id) {

                $rootScope.crm_comments = arr[95].id;

                $rootScope.allowaddcrm_comments = true;

                $rootScope.alloweditcrm_comments = true;

                $rootScope.allowviewcrm_comments = true;

                $rootScope.allowdeletecrm_comments = true;

            }



            // CRM Attachments

            if (arr[96].id) {

                $rootScope.crm_attachments = arr[96].id;

                $rootScope.allowaddcrm_attachments = true;

                $rootScope.alloweditcrm_attachments = true;

                $rootScope.allowviewcrm_attachments = true;

                $rootScope.allowdeletecrm_attachments = true;

            }



            // SRM Attachments

            if (arr[97].id) {

                $rootScope.srm_attachments = arr[97].id;

                $rootScope.allowaddsrm_attachments = true;

                $rootScope.alloweditsrm_attachments = true;

                $rootScope.allowviewsrm_attachments = true;

                $rootScope.allowdeletesrm_attachments = true;

            }



            // Supplier Attachments

            if (arr[98].id) {

                $rootScope.supp_attachments = arr[98].id;

                $rootScope.allowaddsupp_attachments = true;

                $rootScope.alloweditsupp_attachments = true;

                $rootScope.allowviewsupp_attachments = true;

                $rootScope.allowdeletesupp_attachments = true;

            }



            // Supplier Activity

            if (arr[99].id) {

                $rootScope.supp_activity = arr[99].id;

                $rootScope.allowaddsupp_activity = true;

                $rootScope.alloweditsupp_activity = true;

                $rootScope.allowviewsupp_activity = true;

                $rootScope.allowdeletesupp_activity = true;

            }



            // Item Margin Analysis

            if (arr[100].id) {

                $rootScope.item_margin_analysis = arr[100].id;

                $rootScope.allowadditem_margin_analysis = true;

                $rootScope.allowedititem_margin_analysis = true;

                $rootScope.allowviewitem_margin_analysis = true;

                $rootScope.allowdeleteitem_margin_analysis = true;

            }



            // Item Attachments

            if (arr[101].id) {

                $rootScope.allowadditem_attachments = true;

                $rootScope.allowedititem_attachments = true;

                $rootScope.allowviewitem_attachments = true;

                $rootScope.allowdeleteitem_attachments = true;

            }



            // Item Comments, Item Notes

            if (arr[102].id) {

                $rootScope.item_comments = arr[101].id;

                $rootScope.allowadditem_comments = true;

                $rootScope.allowedititem_comments = true;

                $rootScope.allowviewitem_comments = true;

                $rootScope.allowdeleteitem_comments = true;

            }



            // Item Activity

            if (arr[103].id) {

                $rootScope.item_activity = arr[103].id;

                $rootScope.allowadditem_activity = true;

                $rootScope.allowedititem_activity = true;

                $rootScope.allowviewitem_activity = true;

                $rootScope.allowdeleteitem_activity = true;

            }



            // Item Finished Goods Information

            if (arr[110].id) {

                $rootScope.item_finished_goods = true;

                $rootScope.allowadditem_finished_goods = true;

                $rootScope.allowedititem_finished_goods = true;

                $rootScope.allowviewitem_finished_goods = true;

                $rootScope.allowdeleteitem_finished_goods = true;

            }



            // HR Attachments

            if (arr[104].id) {

                $rootScope.hr_attachments = arr[104].id;

                $rootScope.allowaddhr_attachments = true;

                $rootScope.allowedithr_attachments = true;

                $rootScope.allowviewhr_attachments = true;

                $rootScope.allowdeletehr_attachments = true;

            }



            // HR Notes, HR Comments

            if (arr[105].id) {

                $rootScope.hr_comments = arr[105].id;

                $rootScope.allowaddhr_comments = true;

                $rootScope.allowedithr_comments = true;

                $rootScope.allowviewhr_comments = true;

                $rootScope.allowdeletehr_comments = true;

            }



            // Item, Transfer Stock

            if (arr[106].id) {

                $rootScope.item_transferstock = true;

                $rootScope.allowadditem_transferstock = true;

                $rootScope.allowedititem_transferstock = true;

                $rootScope.allowviewitem_transferstock = true;

                $rootScope.allowdeleteitem_transferstock = true;

                $rootScope.allowpostitem_transferstock = true;

            }



            // Item Warehouse Location & Cost

            if (arr[107].id) {

                $rootScope.warehouse_location_cost = true;

                $rootScope.allowadditem_warehouse_location_cost = true;

                $rootScope.allowedititem_warehouse_location_cost = true;

                $rootScope.allowviewitem_warehouse_location_cost = true;

                $rootScope.allowdeleteitem_warehouse_location_cost = true;

            }



            // haulier database

            if (arr[108].id) {

                $rootScope.purchase_haulier_database_tab_module = true;

                $rootScope.allowadd_purchase_haulier_database_tab = true;

                $rootScope.allowedit_purchase_haulier_database_tab = true;

                $rootScope.allowview_purchase_haulier_database_tab = true;

                $rootScope.allowdelete_purchase_haulier_database_tab = true;

            }



            // Customer Portal

            if (arr[109].id) {

                $rootScope.sales_cust_portal_tab_module = true;



                $rootScope.allowadd_cust_portal_tab = true;

                $rootScope.allowedit_cust_portal_tab = true;

                $rootScope.allowview_cust_portal_tab = true;

                $rootScope.allowdelete_cust_portal_tab = true;

            }

            // Finance Matrix

            if (arr[111].id) {

                $rootScope.finance_matrix = arr[111].id;

                $rootScope.allowaddfinance_matrix = true;

                $rootScope.alloweditfinance_matrix = true;

                $rootScope.allowviewfinance_matrix = true;

                $rootScope.allowdeletefinance_matrix = true;

                $rootScope.allowpostfinance_matrix = true;

            }



            // sales Matrix

            if (arr[112].id) {

                $rootScope.sales_matrix = arr[112].id;

                $rootScope.allowaddsales_matrix = true;

                $rootScope.alloweditsales_matrix = true;

                $rootScope.allowviewsales_matrix = true;

                $rootScope.allowdeletesales_matrix = true;

                $rootScope.allowpostsales_matrix = true;

            }

            // purchase Matrix

            if (arr[113].id) {

                $rootScope.purchase_matrix = arr[113].id;

                $rootScope.allowaddpurchase_matrix = true;

                $rootScope.alloweditpurchase_matrix = true;

                $rootScope.allowviewpurchase_matrix = true;

                $rootScope.allowdeletepurchase_matrix = true;

                $rootScope.allowpostpurchase_matrix = true;

            }

            // inventory Matrix

            if (arr[114].id) {

                $rootScope.inventory_matrix = arr[114].id;

                $rootScope.allowaddinventory_matrix = true;

                $rootScope.alloweditinventory_matrix = true;

                $rootScope.allowviewinventory_matrix = true;

                $rootScope.allowdeleteinventory_matrix = true;

                $rootScope.allowpostinventory_matrix = true;

            }

            // hr Matrix

            if (arr[115].id) {

                $rootScope.hr_matrix = arr[115].id;

                $rootScope.allowaddhr_matrix = true;

                $rootScope.allowedithr_matrix = true;

                $rootScope.allowviewhr_matrix = true;

                $rootScope.allowdeletehr_matrix = true;

                $rootScope.allowposthr_matrix = true;

            }

            // csv export

            if (arr[116].id) {

                $rootScope.csv_export = arr[116].id;

                $rootScope.allowviewcsv_export = true;

            }

            // shipment target amount

            if (arr[117].id) {

                $rootScope.shipping_target_amount = arr[117].id;

                $rootScope.allowaddshipping_target_amount = true;

                $rootScope.alloweditshipping_target_amount = true;

                $rootScope.allowviewshipping_target_amount = true;

            }



        }



        function set_variables(arr) {



            //HR

            $rootScope.allowaddhr = false;

            $rootScope.allowedithr = false;

            $rootScope.allowviewhr = false;

            $rootScope.allowdeletehr = false;



            //HR General Tab

            $rootScope.allowaddhr_gneral = false;

            $rootScope.allowedithr_gneral = false;

            $rootScope.allowviewhr_gneral = false;

            $rootScope.allowdeletehr_gneral = false;





            //HR Conact Tab

            $rootScope.allowaddhr_contact = false;

            $rootScope.allowedithr_contact = false;

            $rootScope.allowviewhr_contact = false;

            $rootScope.allowdeletehr_contact = false;





            //HR Personal Tab

            $rootScope.allowaddhr_personal = false;

            $rootScope.allowedithr_personal = false;

            $rootScope.allowviewhr_personal = false;

            $rootScope.allowdeletehr_personal = false;





            //HR Salary Tab



            $rootScope.allowaddhr_salary = false;

            $rootScope.allowedithr_salary = false;

            $rootScope.allowviewhr_salary = false;

            $rootScope.allowdeletehr_salary = false;





            //HR Benifit Tab



            $rootScope.allowaddhr_benifit = false;

            $rootScope.allowedithr_benifit = false;

            $rootScope.allowviewhr_benifit = false;

            $rootScope.allowdeletehr_benifit = false;





            //HR Expense Tab

            $rootScope.allowaddhr_expenses = false;

            $rootScope.allowedithr_expenses = false;

            $rootScope.allowviewhr_expenses = false;

            $rootScope.allowdeletehr_expenses = false;

            $rootScope.allowconverthr_expenses = false;





            //HR Fuel Tab



            $rootScope.allowaddhr_fuel = false;

            $rootScope.allowedithr_fuel = false;

            $rootScope.allowviewhr_fuel = false;

            $rootScope.allowdeletehr_fuel = false;





            //HR Holiday Tab



            $rootScope.allowaddhr_holiday = false;

            $rootScope.allowedithr_holiday = false;

            $rootScope.allowviewhr_holiday = false;

            $rootScope.allowdeletehr_holiday = false;





            //Inverntry



            $rootScope.allowadd_invertry = false;

            $rootScope.allowedit_invertry = false;

            $rootScope.allowview_invertry = false;

            $rootScope.allowdelete_invertry = false;



            //Item



            $rootScope.allowadd_item = false;

            $rootScope.allowedit_item = false;

            $rootScope.allowview_item = false;

            $rootScope.allowdelete_item = false;



            //Item General Tab



            $rootScope.allowadd_item_gneral_tab = false;

            $rootScope.allowedit_item_gneral_tab = false;

            $rootScope.allowview_item_gneral_tab = false;

            $rootScope.allowdelete_item_gneral_tab = false;



            //Item Detail Tab



            $rootScope.allowadd_detal_tab = false;

            $rootScope.allowedit_detal_tab = false;

            $rootScope.allowview_detal_tab = false;



            $rootScope.allowdelete_detal_tab = false;



            //Item Purchase Tab



            $rootScope.allowadd_item_purchase_tab = false;

            $rootScope.allowedit_item_purchase_tab = false;

            $rootScope.allowview_item_purchase_tab = false;

            $rootScope.allowdelete_item_purchase_tab = false;

            $rootScope.allowapprove_item_purchase_tab = false;





            // Item Finished Goods Information



            $rootScope.item_finished_goods = false;

            $rootScope.allowadditem_finished_goods = false;

            $rootScope.allowedititem_finished_goods = false;

            $rootScope.allowviewitem_finished_goods = false;

            $rootScope.allowdeleteitem_finished_goods = false;



            //Item Sale Tab



            $rootScope.allowadd_item_sale_tab = false;

            $rootScope.allowedit_item_sale_tab = false;

            $rootScope.allowview_item_sale_tab = false;

            $rootScope.allowdelete_item_sale_tab = false;



            //Stock sheet

            $rootScope.allowadd_stock_sheet = false;

            $rootScope.allowedit_stock_sheet = false;

            $rootScope.allowview_stock_sheet = false;

            $rootScope.allowdelete_stock_sheet = false;





            //Purchase

            $rootScope.allowadd_purchase = false;

            $rootScope.allowedit_purchase = false;

            $rootScope.allowview_purchase = false;

            $rootScope.allowdelete_purchase = false;





            //Srm



            $rootScope.allowadd_srm = false;

            $rootScope.allowedit_srm = false;

            $rootScope.allowview_srm = false;

            $rootScope.allowdelete_srm = false;



            //Srm General Tab



            $rootScope.allowadd_srm_general_tab = false;

            $rootScope.allowedit_srm_general_tab = false;

            $rootScope.allowview_srm_general_tab = false;

            $rootScope.allowdelete_srm_general_tab = false;

            $rootScope.allowconvert_srm_general_tab = false;



            //Srm Contact Tab



            $rootScope.allowadd_srm_contact_tab = false;

            $rootScope.allowedit_srm_contact_tab = false;

            $rootScope.allowview_srm_contact_tab = false;

            $rootScope.allowdelete_srm_contact_tab = false;



            //Srm Location Tab



            $rootScope.allowadd_srm_location_tab = false;

            $rootScope.allowedit_srm_location_tab = false;

            $rootScope.allowview_srm_location_tab = false;

            $rootScope.allowdelete_srm_location_tab = false;



            //Srm Area Tab



            $rootScope.allowadd_srm_haulier_tab = false;

            $rootScope.allowedit_srm_haulier_tab = false;

            $rootScope.allowview_srm_haulier_tab = false;

            $rootScope.allowdelete_srm_haulier_tab = false;



            //Srm Price Tab



            $rootScope.allowadd_srm_price_tab = false;

            $rootScope.allowedit_srm_price_tab = false;

            $rootScope.allowview_srm_price_tab = false;

            $rootScope.allowdelete_srm_price_tab = false;

            $rootScope.allowconvert_srm_price_tab = false;





            //Supplier



            $rootScope.allowadd_supplier = false;

            $rootScope.allowedit_supplier = false;

            $rootScope.allowview_supplier = false;

            $rootScope.allowdelete_supplier = false;



            //Supplier General Tab



            $rootScope.allowadd_supplier_general_tab = false;

            $rootScope.allowedit_supplier_general_tab = false;

            $rootScope.allowview_supplier_general_tab = false;

            $rootScope.allowdelete_supplier_general_tab = false;

            $rootScope.allowconvert_supplier_general_tab = false;



            //Supplier Finanace Tab

            $rootScope.allowadd_supplier_finance_tab = false;

            $rootScope.allowedit_supplier_finance_tab = false;

            $rootScope.allowview_supplier_finance_tab = false;

            $rootScope.allowdelete_supplier_finance_tab = false;



            //Supplier Contact Tab



            $rootScope.allowadd_supplier_contact_tab = false;

            $rootScope.allowedit_supplier_contact_tab = false;

            $rootScope.allowview_supplier_contact_tab = false;

            $rootScope.allowdelete_supplier_contact_tab = false;



            //Supplier Location Tab



            $rootScope.allowadd_supplier_location_tab = false;

            $rootScope.allowedit_supplier_location_tab = false;

            $rootScope.allowview_supplier_location_tab = false;

            $rootScope.allowdelete_supplier_location_tab = false;



            //Supplier Area Tab



            $rootScope.allowadd_supplier_haulier_tab = false;

            $rootScope.allowedit_supplier_haulier_tab = false;

            $rootScope.allowview_supplier_haulier_tab = false;

            $rootScope.allowdelete_supplier_haulier_tab = false;



            //Supplier item info Tab



            $rootScope.allowadd_supplier_iteminfo_tab = false;

            $rootScope.allowedit_supplier_iteminfo_tab = false;

            $rootScope.allowview_supplier_iteminfo_tab = false;

            $rootScope.allowdelete_supplier_iteminfo_tab = false;



            //Supplier price Tab

            $rootScope.allowadd_supplier_price_tab = false;

            $rootScope.allowedit_supplier_price_tab = false;

            $rootScope.allowview_supplier_price_tab = false;

            $rootScope.allowdelete_supplier_price_tab = false;

            $rootScope.allowconvert_supplier_price_tab = false;





            //Purchase order



            $rootScope.allowadd_prucase_order = false;

            $rootScope.allowedit_prucase_order = false;

            $rootScope.allowview_prucase_order = false;

            $rootScope.allowdelete_prucase_order = false;

            $rootScope.allowpost_prucase_order = false;

            $rootScope.allowreceive_prucase_order = false;



            //Purchase order general   Tab



            $rootScope.allowadd_prucase_order_general_tab = false;

            $rootScope.allowedit_prucase_order_general_tab = false;

            $rootScope.allowview_prucase_order_general_tab = false;

            $rootScope.allowdelete_prucase_order_general_tab = false;



            //Purchase  order invoice   Tab



            $rootScope.allowadd_prucase_order_inovice_tab = false;

            $rootScope.allowedit_prucase_order_inovice_tab = false;

            $rootScope.allowview_prucase_order_inovice_tab = false;

            $rootScope.allowdelete_prucase_order_inovice_tab = false;



            //Purchase  order shipping   Tab



            $rootScope.allowadd_prucase_order_shipping_tab = false;

            $rootScope.allowedit_prucase_order_shipping_tab = false;

            $rootScope.allowview_prucase_order_shipping_tab = false;

            $rootScope.allowdelete_prucase_order_shipping_tab = false;



            //Purchase  order item detail   Tab



            $rootScope.allowadd_prucase_order_item_detail_tab = false;

            $rootScope.allowedit_prucase_order_item_detail_tab = false;

            $rootScope.allowview_prucase_order_item_detail_tab = false;

            $rootScope.allowdelete_prucase_order_item_detail_tab = false;





            //Purchase Invoice

            $rootScope.allowadd_prucase_invoice = false;

            $rootScope.allowedithr_prucase_invoice = false;

            $rootScope.allowviewhr_prucase_invoice = false;

            $rootScope.allowdeletehr_prucase_invoice = false;





            //Purchase Return OR Debit Note



            $rootScope.allowadd_prucase_order_return = false;

            $rootScope.allowedit_prucase_order_return = false;

            $rootScope.allowview_prucase_order_return = false;

            $rootScope.allowdelete_prucase_order_return = false;

            $rootScope.allowdispatch_prucase_order_return = false;

            $rootScope.allowpost_prucase_order_return = false;





            //Sales & Crm



            $rootScope.allowadd_sales_crm_module = false;

            $rootScope.allowedit_sales_crm_module = false;

            $rootScope.allowview_sales_crm_module = false;

            $rootScope.allowdelete_sales_crm_module = false;





            //Crm



            $rootScope.allowadd_crm_module = false;

            $rootScope.allowedit_crm_module = false;

            $rootScope.allowview_crm_module = false;

            $rootScope.allowdelete_crm_module = false;



            //Crm General Tab



            $rootScope.allowadd_crm_general_tab = false;

            $rootScope.allowedit_crm_general_tab = false;

            $rootScope.allowview_crm_general_tab = false;

            $rootScope.allowdelete_crm_general_tab = false;

            $rootScope.allowconvert_crm_general_tab = false;



            //Crm contact Tab



            $rootScope.allowadd_crm_contact_tab = false;

            $rootScope.allowedit_crm_contact_tab = false;

            $rootScope.allowview_crm_contact_tab = false;

            $rootScope.allowdelete_crm_contact_tab = false;



            //Crm location Tab



            $rootScope.allowadd_crm_location_tab = false;

            $rootScope.allowedit_crm_location_tab = false;

            $rootScope.allowview_crm_location_tab = false;

            $rootScope.allowdelete_crm_location_tab = false;



            //Crm competetor Tab



            $rootScope.allowadd_crm_competetor_tab = false;

            $rootScope.allowedit_crm_competetor_tab = false;

            $rootScope.allowview_crm_competetor_tab = false;

            $rootScope.allowdelete_crm_competetor_tab = false;



            //Crm price Tab



            $rootScope.allowadd_crm_price_tab = false;

            $rootScope.allowedit_crm_price_tab = false;

            $rootScope.allowview_crm_price_tab = false;

            $rootScope.allowdelete_crm_price_tab = false;

            $rootScope.allowconvert_crm_price_tab = false;



            //Crm promotion Tab



            $rootScope.allowadd_crm_promotiom_tab = false;

            $rootScope.allowedit_crm_promotiom_tab = false;

            $rootScope.allowview_crm_promotiom_tab = false;

            $rootScope.allowdelete_crm_promotiom_tab = false;



            //Crm oop cycle Tab

            $rootScope.allowadd_crm_oop_cycle_tab = false;

            $rootScope.allowedit_crm_oop_cycle_tab = false;

            $rootScope.allowview_crm_oop_cycle_tab = false;

            $rootScope.allowdelete_crm_oop_cycle_tab = false;





            //Customer



            $rootScope.allowadd_customer_module = false;

            $rootScope.allowedit_customer_module = false;

            $rootScope.allowview_customer_module = false;

            $rootScope.allowdelete_customer_module = false;



            //Customer General Tab



            $rootScope.allowadd_cust_gneral__tab = false;

            $rootScope.allowedit_cust_gneral__tab = false;

            $rootScope.allowview_cust_gneral__tab = false;

            $rootScope.allowdelete_cust_gneral__tab = false;

            $rootScope.allowconvert_cust_general_tab = false;



            //Customer Finance Tab



            $rootScope.allowadd_cust_finanace_tab = false;

            $rootScope.allowedit_cust_finanace_tab = false;

            $rootScope.allowview_cust_finanace_tab = false;

            $rootScope.allowdelete_cust_finanace_tab = false;



            //Customer contact Tab



            $rootScope.allowadd_cust_contact_tab = false;

            $rootScope.allowedit_cust_contact_tab = false;

            $rootScope.allowview_cust_contact_tab = false;

            $rootScope.allowdelete_cust_contact_tab = false;



            //Customer location Tab



            $rootScope.allowadd_cust_location_tab = false;

            $rootScope.allowedit_cust_location_tab = false;

            $rootScope.allowview_cust_location_tab = false;

            $rootScope.allowdelete_cust_location_tab = false;



            //Customer competetor Tab



            $rootScope.allowadd_cust_competetor_tab = false;

            $rootScope.allowedit_cust_competetor_tab = false;

            $rootScope.allowview_cust_competetor_tab = false;

            $rootScope.allowdelete_cust_competetor_tab = false;



            //Customer price Tab



            $rootScope.allowadd_cust_price_tab = false;

            $rootScope.allowedit_cust_price_tab = false;

            $rootScope.allowview_cust_price_tab = false;

            $rootScope.allowdelete_cust_price_tab = false;

            $rootScope.allowconvert_cust_price_tab = false;



            //Customer promotion Tab

            $rootScope.allowadd_cust_promotion_tab = false;

            $rootScope.allowedit_cust_promotion_tab = false;

            $rootScope.allowview_cust_promotion_tab = false;

            $rootScope.allowdelete_cust_promotion_tab = false;



            //Customer oop cycle Tab

            $rootScope.allowadd_cust_oop_cycle_tab = false;

            $rootScope.allowedit_cust_oop_cycle_tab = false;

            $rootScope.allowview_cust_oop_cycle_tab = false;

            $rootScope.allowdelete_cust_oop_cycle_tab = false;



            //Customer Customer Portal Tab

            $rootScope.allowadd_cust_portal_tab = false;

            $rootScope.allowedit_cust_portal_tab = false;

            $rootScope.allowview_cust_portal_tab = false;

            $rootScope.allowdelete_cust_portal_tab = false;





            //Sales Target



            $rootScope.allowadd_sale_target_module = false;

            $rootScope.allowedit_sale_target_module = false;

            $rootScope.allowview_sale_target_module = false;

            $rootScope.allowdelete_sale_target_module = false;



            //Sales Forcast

            $rootScope.allowadd_sale_forcast_module = false;

            $rootScope.allowedit_sale_forcast_module = false;

            $rootScope.allowview_sale_forcast_module = false;

            $rootScope.allowdelete_sale_forcast_module = false;



            //Sales Qoute



            $rootScope.allowadd_sale_qoute_module = false;

            $rootScope.allowedit_sale_qoute_module = false;

            $rootScope.allowview_sale_qoute_module = false;

            $rootScope.allowdelete_sale_qoute_module = false;

            $rootScope.allowapprove_sale_qoute_module = false;

            $rootScope.allowconvert_sale_qoute_module = false;



            //Sales Order



            $rootScope.allowadd_sale_order_module = false;

            $rootScope.allowedit_sale_order_module = false;

            $rootScope.allowview_sale_order_module = false;

            $rootScope.allowdelete_sale_order_module = false;

            $rootScope.allowapprove_sale_order_module = false;

            $rootScope.allowdispatch_sale_order_module = false;

            $rootScope.allowpost_sale_order_module = false;



            //Sales Invoice



            $rootScope.allowadd_sale_invoice_module = false;

            $rootScope.allowedit_sale_invoice_module = false;

            $rootScope.allowview_sale_invoice_module = false;

            $rootScope.allowdelete_sale_invoice_module = false;

            $rootScope.allowapprove_sale_invoice_module = false;



            //Sales Return OR Credit Notes



            $rootScope.allowadd_sale_or_return_module = false;

            $rootScope.allowedit_sale_or_return_module = false;

            $rootScope.allowview_sale_or_return_module = false;

            $rootScope.allowdelete_sale_or_return_module = false;

            $rootScope.allowpost_sale_or_return_module = false;

            $rootScope.allowreceive_sale_or_return_module = false;



            //Sales Promotion



            $rootScope.allowadd_sale_promotion_module = false;

            $rootScope.allowedit_sale_promotion_module = false;

            $rootScope.allowview_sale_promotion_module = false;

            $rootScope.allowdelete_sale_promotion_module = false;



            //Sales Price Adjutsment



            $rootScope.allowadd_sale_price_adjustment_module = false;

            $rootScope.allowedit_sale_price_adjustment_module = false;

            $rootScope.allowview_sale_price_adjustment_module = false;

            $rootScope.allowdelete_sale_price_adjustment_module = false;





            //Sales GL



            $rootScope.allowadd_gl_module = false;

            $rootScope.allowedit_gl_module = false;

            $rootScope.allowview_gl_module = false;

            $rootScope.allowdelete_gl_module = false;





            //Sales Chart of Account

            $rootScope.allowadd_charts_of_account = false;

            $rootScope.allowedit_charts_of_account = false;

            $rootScope.allowview_charts_of_account = false;

            $rootScope.allowdelete_charts_of_account = false;





            //Comunication



            $rootScope.allowadd_comunication_main = false;

            $rootScope.allowedit_comunication_main = false;

            $rootScope.allowview_comunication_main = false;

            $rootScope.allowdelete_comunication_main = false;



            //Comunication Task



            $rootScope.allowadd_task_module = false;

            $rootScope.allowedit_task_module = false;

            $rootScope.allowviewhr_task_module = false;

            $rootScope.allowdelete_task_module = false;



            //Comunication Calendar



            $rootScope.allowadd_calendar_module = false;

            $rootScope.allowedit_calendar_module = false;

            $rootScope.allowview_calendar_module = false;

            $rootScope.allowdelete_calendar_module = false;



            //Comunication Contact



            $rootScope.allowadd_contact_module = false;

            $rootScope.allowedit_contact_module = false;

            $rootScope.allowview_contact_module = false;

            $rootScope.allowdelete_contact_module = false;



            //Comunication Document





            $rootScope.allowadd_document_module = false;

            $rootScope.allowedit_document_module = false;

            $rootScope.allowview_document_module = false;

            $rootScope.allowdelete_document_module = false;



            //Comunication Help



            $rootScope.allowadd_help_module = false;

            $rootScope.allowedit_help_module = false;

            $rootScope.allowview_help_module = false;

            $rootScope.allowdelete_help_module = false;



            //Comunication Email

            $rootScope.allowadd_email_module = false;

            $rootScope.allowedit_email_module = false;

            $rootScope.allowview_email_module = false;

            $rootScope.allowdelete_email_module = false;





            //HR Employee

            $rootScope.allowaddhr_employee = false;

            $rootScope.allowedithr_employee = false;

            $rootScope.allowviewhr_employee = false;

            $rootScope.allowdeletehr_employee = false;





            // Inventory Item Journal

            $rootScope.allowadditem_journal = false;

            $rootScope.allowedititem_journal = false;

            $rootScope.allowviewitem_journal = false;

            $rootScope.allowdeleteitem_journal = false;

            $rootScope.allowpostitem_journal = false;



            // Customer Journal

            $rootScope.allowaddcust_journal = false;

            $rootScope.alloweditcust_journal = false;

            $rootScope.allowviewcust_journal = false;

            $rootScope.allowdeletecust_journal = false;

            $rootScope.allowpostcust_journal = false;



            // Supplier Journal

            $rootScope.allowaddsupp_journal = false;

            $rootScope.alloweditsupp_journal = false;

            $rootScope.allowviewsupp_journal = false;

            $rootScope.allowdeletesupp_journal = false;

            $rootScope.allowpostsupp_journal = false;



            // General Journal

            $rootScope.allowaddgen_journal = false;

            $rootScope.alloweditgen_journal = false;

            $rootScope.allowviewgen_journal = false;

            $rootScope.allowdeletegen_journal = false;

            $rootScope.allowpostgen_journal = false;



            // Customer Activity

            $rootScope.allowaddcust_activity = false;

            $rootScope.alloweditcust_activity = false;

            $rootScope.allowviewcust_activity = false;

            $rootScope.allowdeletecust_activity = false;



            // Customer Attachments

            $rootScope.allowaddcust_attachments = false;

            $rootScope.alloweditcust_attachments = false;

            $rootScope.allowviewcust_attachments = false;

            $rootScope.allowdeletecust_attachments = false;



            // Customer Comments

            $rootScope.allowaddcust_comments = false;

            $rootScope.alloweditcust_comments = false;

            $rootScope.allowviewcust_comments = false;

            $rootScope.allowdeletecust_comments = false;



            // Posted Debit Notes

            $rootScope.allowaddposted_debit_notes = false;

            $rootScope.alloweditposted_debit_notes = false;

            $rootScope.allowviewposted_debit_notes = false;

            $rootScope.allowdeleteposted_debit_notes = false;



            // Posted Credit Notes

            $rootScope.allowaddposted_credit_notes = false;

            $rootScope.alloweditposted_credit_notes = false;

            $rootScope.allowviewposted_credit_notes = false;

            $rootScope.allowdeleteposted_credit_notes = false;



            // Setup Auto Email Config

            $rootScope.allowaddsetup_email_config = false;

            $rootScope.alloweditsetup_email_config = false;

            $rootScope.allowviewsetup_email_config = false;

            $rootScope.allowdeletesetup_email_config = false;



            // Supplier Comments, Supplier Notes

            $rootScope.allowaddsupp_comments = false;

            $rootScope.alloweditsupp_comments = false;

            $rootScope.allowviewsupp_comments = false;

            $rootScope.allowdeletesupp_comments = false;



            // SRM Comments, SRM Notes

            $rootScope.allowaddsrm_comments = false;

            $rootScope.alloweditsrm_comments = false;

            $rootScope.allowviewsrm_comments = false;

            $rootScope.allowdeletesrm_comments = false;



            // CRM Comments, CRM Notes

            $rootScope.allowaddcrm_comments = false;

            $rootScope.alloweditcrm_comments = false;

            $rootScope.allowviewcrm_comments = false;

            $rootScope.allowdeletecrm_comments = false;



            // CRM Attachments

            $rootScope.allowaddcrm_attachments = false;

            $rootScope.alloweditcrm_attachments = false;

            $rootScope.allowviewcrm_attachments = false;

            $rootScope.allowdeletecrm_attachments = false;



            // SRM Attachments

            $rootScope.allowaddsrm_attachments = false;

            $rootScope.alloweditsrm_attachments = false;

            $rootScope.allowviewsrm_attachments = false;

            $rootScope.allowdeletesrm_attachments = false;



            // Supplier Attachments

            $rootScope.allowaddsupp_attachments = false;

            $rootScope.alloweditsupp_attachments = false;

            $rootScope.allowviewsupp_attachments = false;

            $rootScope.allowdeletesupp_attachments = false;



            // Supplier Activity

            $rootScope.allowaddsupp_activity = false;

            $rootScope.alloweditsupp_activity = false;

            $rootScope.allowviewsupp_activity = false;

            $rootScope.allowdeletesupp_activity = false;



            // Item Margin Analysis

            $rootScope.allowadditem_margin_analysis = false;

            $rootScope.allowedititem_margin_analysis = false;

            $rootScope.allowviewitem_margin_analysis = false;

            $rootScope.allowdeleteitem_margin_analysis = false;



            // Item Attachments

            $rootScope.allowadditem_attachments = false;

            $rootScope.allowedititem_attachments = false;

            $rootScope.allowviewitem_attachments = false;

            $rootScope.allowdeleteitem_attachments = false;



            // Item Comments, Item Notes

            $rootScope.allowadditem_comments = false;

            $rootScope.allowedititem_comments = false;

            $rootScope.allowviewitem_comments = false;

            $rootScope.allowdeleteitem_comments = false;



            // Item Activity

            $rootScope.allowadditem_activity = false;

            $rootScope.allowedititem_activity = false;

            $rootScope.allowviewitem_activity = false;

            $rootScope.allowdeleteitem_activity = false;



            // HR Attachments

            $rootScope.allowaddhr_attachments = false;

            $rootScope.allowedithr_attachments = false;

            $rootScope.allowviewhr_attachments = false;

            $rootScope.allowdeletehr_attachments = false;



            // HR Notes, HR Comments

            $rootScope.allowaddhr_comments = false;

            $rootScope.allowedithr_comments = false;

            $rootScope.allowviewhr_comments = false;

            $rootScope.allowdeletehr_comments = false;



            // Item, Transfer Stock

            $rootScope.allowadditem_transferstock = false;

            $rootScope.allowedititem_transferstock = false;

            $rootScope.allowviewitem_transferstock = false;

            $rootScope.allowdeleteitem_transferstock = false;

            $rootScope.allowpostitem_transferstock = false



            // Item Warehouse Location & Cost

            $rootScope.allowadditem_warehouse_location_cost = false;

            $rootScope.allowedititem_warehouse_location_cost = false;

            $rootScope.allowviewitem_warehouse_location_cost = false;

            $rootScope.allowdeleteitem_warehouse_location_cost = false;



            //haulier database

            $rootScope.purchase_haulier_database_tab_module = false;

            $rootScope.allowadd_purchase_haulier_database_tab = false;

            $rootScope.allowedit_purchase_haulier_database_tab = false;

            $rootScope.allowview_purchase_haulier_database_tab = false;

            $rootScope.allowdelete_purchase_haulier_database_tab = false;



            // Customer Portal

            $rootScope.sales_cust_portal_tab_module = false;

            $rootScope.allowadd_cust_portal_tab = false;

            $rootScope.allowedit_cust_portal_tab = false;

            $rootScope.allowview_cust_portal_tab = false;

            $rootScope.allowdelete_cust_portal_tab = false;



            // finance matrix

            $rootScope.allowaddfinance_matrix = false;

            $rootScope.alloweditfinance_matrix = false;

            $rootScope.allowviewfinance_matrix = false;

            $rootScope.allowdeletefinance_matrix = false;

            $rootScope.allowpostfinance_matrix = false;



            // sales matrix

            $rootScope.allowaddsales_matrix = false;

            $rootScope.alloweditsales_matrix = false;

            $rootScope.allowviewsales_matrix = false;

            $rootScope.allowdeletesales_matrix = false;

            $rootScope.allowpostsales_matrix = false;



            // purchase matrix

            $rootScope.allowaddpurchase_matrix = false;

            $rootScope.alloweditpurchase_matrix = false;

            $rootScope.allowviewpurchase_matrix = false;

            $rootScope.allowdeletepurchase_matrix = false;

            $rootScope.allowpostpurchase_matrix = false;



            // inventory matrix

            $rootScope.allowaddinventory_matrix = false;

            $rootScope.alloweditinventory_matrix = false;

            $rootScope.allowviewinventory_matrix = false;

            $rootScope.allowdeleteinventory_matrix = false;

            $rootScope.allowpostinventory_matrix = false;



            // HR matrix

            $rootScope.allowaddhr_matrix = false;

            $rootScope.allowedithr_matrix = false;

            $rootScope.allowviewhr_matrix = false;

            $rootScope.allowdeletehr_matrix = false;

            $rootScope.allowposthr_matrix = false;



            // CSV EXPORT

            $rootScope.allowviewcsv_export = false;

            // shipment target amount

            $rootScope.allowaddshipping_target_amount = false;

            $rootScope.alloweditshipping_target_amount = false;

            $rootScope.allowviewshipping_target_amount = false;



        }





        $rootScope.version = angular.version.full;

    }]);





/**=========================================================

 * Module: config.js

 * App routes and resources configuration

 =========================================================*/





App.config(['$ocLazyLoadProvider', '$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',

    function ($ocLazyLoadProvider, $stateProvider, $locationProvider, $urlRouterProvider, helper) {

        'use strict';



        // Set the following to true to enable the HTML5 Mode

        // You may have to set <base> tag in index and a routing configuration in your server

        $locationProvider.html5Mode(false);



        // console.log(window.location);

        // console.log(window.location.search);



        // var loc = window.location.href;

        // console.log(loc);



        // var n = loc.indexOf("customerportal");





        /* if(window.location.search == '?customerPortal'){

            // $urlRouterProvider.otherwise('/customerPortal/customerPortal');

            $urlRouterProvider.otherwise('/app/customerPortal');

            console.log('portal access');

        }

        else   */



        /* if (loc.toString().toLowerCase().indexOf("customerportal") !== -1) {

            console.log('lfjgfd');

            //$urlRouterProvider.otherwise('/customerPortal');

            // $urlRouterProvider.otherwise('/app/dashboard');

            

        }

        else  */

        // console.log(window.localStorage.currentUser);



        if (window.localStorage.currentUser === null || window.localStorage.currentUser == "null" || window.localStorage.currentUser == undefined) {

            /* if($rootScope != undefined)

            {

                $rootScope.country_type_arr = undefined;

                $rootScope.arr_vat = undefined;

                $rootScope.deprtment_arr = undefined;

                $rootScope.emp_type_arr = undefined;

                $rootScope.arr_vat_post_grp = undefined;

                $rootScope.customer_arr = undefined;

                $rootScope.customer_checksum_id = undefined;

                $rootScope.app.layout.isBodyColor = true;

            } */

            $urlRouterProvider.otherwise('/page/login');

        }

        else if (window.localStorage.currentUser == "Bia.shan@gmail.com") {

            $urlRouterProvider.otherwise('/app/customerPortal');

        }

        else {

            $urlRouterProvider.otherwise('/app/dashboard');

        }

        // default route

        //$urlRouterProvider.otherwise('/page/login');

        //$urlRouterProvider.otherwise('/app/dashboard');





        //

        // Application Routes

        // -----------------------------------





        $stateProvider

            .state('app', {

                url: '/app',

                abstract: true,

                templateUrl: helper.basepath('app.html'),

                controller: 'AppController',

                resolve: helper.resolveFor('icons', 'toaster', 'whirl', 'parsley'),

                data: {

                    requireLogin: true // this property will apply to all children of 'app'

                }

            })

            .state('app.dashboard', {

                url: '/dashboard',

                params: { obj: null },

                title: 'Dashboard',

                resolve: helper.resolveFor('icons', 'toaster', 'whirl', 'parsley'),

                templateUrl: helper.basepath('dashboard/dashboard.html'),

                controller: ["$rootScope", "$stateParams", "$timeout", "toaster", function ($rootScope, $stateParams, $timeout, toaster) {

                    // $rootScope.app.layout.isBodyColor = false;

                    // if ($rootScope.$stateParams.warning != undefined)



                    if ($stateParams.obj != undefined) {

                        $timeout(function () {

                            if ($stateParams.obj.warning_1 != undefined && $stateParams.obj.warning_1.length > 0)

                                toaster.pop('warning', 'Warning', $stateParams.obj.warning_1);

                            if ($stateParams.obj.warning_2 != undefined && $stateParams.obj.warning_2.length > 0)

                                toaster.pop('warning', 'Warning', $stateParams.obj.warning_2);

                        }, 3);

                    }

                }]



            })

            /* .state('app.customerPortal', {

                url: '/customer-portal',

                params :{obj:null},

                title: 'customer portal',

                resolve: helper.resolveFor('icons', 'toaster', 'whirl', 'parsley'),

                templateUrl: helper.basepath('customerPortal/customerPortal.html'),

                controller: ["$rootScope", "$stateParams", "$timeout", "toaster", function ($rootScope, $stateParams, $timeout, toaster) {

                    console.log('Here it is');

                    }]



            }) */

            .state('app.setup', {

                url: '/setup',

                title: 'Setup',

                templateUrl: helper.basepath('setup/setup.html')

            })



            // Single Page Routes

            // -----------------------------------

            .state('page', {

                url: '/page',

                templateUrl: 'app/pages/page.html',

                resolve: helper.resolveFor('icons'),

                controller: ["$rootScope", function ($rootScope) {

                    $rootScope.app.layout.isBoxed = false;

                }]

            })

            .state('page.login', {

                url: '/login',

                title: "Login",

                templateUrl: 'app/pages/login.html',

                resolve: helper.resolveFor('icons', 'toaster'),

                controller: ["$rootScope", function ($rootScope) {

                    // $rootScope.$storage.setItem("currentUser", undefined);

                    window.localStorage.currentUser = null;

                    if ($rootScope != undefined) {

                        $rootScope.country_type_arr = undefined;

                        $rootScope.arr_vat = undefined;

                        $rootScope.deprtment_arr = undefined;

                        $rootScope.emp_type_arr = undefined;

                        // $rootScope.arr_vat_post_grp = undefined;

                        // $rootScope.customer_arr = undefined;

                        $rootScope.customer_checksum_id = undefined;

                        $rootScope.cat_prodcut_arr = undefined;

                        $rootScope.arr_currency = undefined;

                        $rootScope.prooduct_arr = undefined;

                        $rootScope.arr_posting_group_ids = undefined;



                        $rootScope.prodLastUpdateTime = undefined;

                        $rootScope.invSetuplastUpdateTime = undefined;

                        $rootScope.empllastUpdateTime = undefined;

                        $rootScope.setupGlobalLastUpdateTime = undefined;



                        // $window.localStorage.clear();





                        localStorage.removeItem('currentUser');

                        localStorage.removeItem('country_type_arr');

                        localStorage.removeItem('arr_vat');

                        localStorage.removeItem('deprtment_arr');

                        localStorage.removeItem('emp_type_arr');

                        // localStorage.removeItem('arr_vat_post_grp');

                        localStorage.removeItem('customer_arr');

                        localStorage.removeItem('customer_checksum_id');

                        localStorage.removeItem('cat_prodcut_arr');

                        localStorage.removeItem('arr_currency');

                        localStorage.removeItem('prooduct_arr');



                        $rootScope.app.layout.isBodyColor = true;

                    }

                }],

                data: {

                    requireLogin: false

                }

            })

    }

]).config(['$ocLazyLoadProvider', 'APP_REQUIRES', function ($ocLazyLoadProvider, APP_REQUIRES) {

    'use strict';



    // Lazy Load modules configuration

    $ocLazyLoadProvider.config({

        debug: false,

        events: true,

        modules: APP_REQUIRES.modules

    });



}]).config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',

    function ($controllerProvider, $compileProvider, $filterProvider, $provide) {

        'use strict';

        // registering components after bootstrap

        App.controller = $controllerProvider.register;

        App.directive = $compileProvider.directive;

        App.filter = $filterProvider.register;

        App.factory = $provide.factory;

        App.service = $provide.service;

        App.constant = $provide.constant;

        App.value = $provide.value;



    }

]).config(['$translateProvider', function ($translateProvider) {



    $translateProvider.useStaticFilesLoader({

        prefix: 'app/i18n/',

        suffix: '.json'

    });

    $translateProvider.preferredLanguage('en');

    $translateProvider.useLocalStorage();

    $translateProvider.usePostCompiling(true);



}]).config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {

    cfpLoadingBarProvider.includeBar = true;

    cfpLoadingBarProvider.includeSpinner = false;

    cfpLoadingBarProvider.latencyThreshold = 500;

    cfpLoadingBarProvider.parentSelector = '.wrapper > section';

}]);



App.filter('propsFilter', function () {

    return function (items, props) {

        var out = [];



        if (angular.isArray(items)) {

            var keys = Object.keys(props);



            items.forEach(function (item) {

                var itemMatches = false;



                for (var i = 0; i < keys.length; i++) {

                    var prop = keys[i];

                    var text = props[prop].toLowerCase();

                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {

                        itemMatches = true;

                        break;

                    }

                }



                if (itemMatches) {

                    out.push(item);

                }

            });

        } else {

            // Let the output be the input untouched

            out = items;

        }



        return out;

    };

});



App.filter('removeHTMLTags', function () {

    return function (text) {

        return text ? String(text).replace(/<[^>]+>/gm, '') : '';

    };

});





/**=========================================================

 * Module: constants.js

 * Define constants to inject across the application

 =========================================================*/

App

    .constant('APP_COLORS', {

        'primary': '#5d9cec',

        'success': '#27c24c',

        'info': '#23b7e5',

        'warning': '#ff902b',

        'danger': '#f05050',

        'inverse': '#131e26',

        'green': '#37bc9b',

        'pink': '#f532e5',

        'purple': '#7266ba',

        'dark': '#3a3f51',

        'yellow': '#fad732',

        'gray-darker': '#232735',

        'gray-dark': '#3a3f51',

        'gray': '#dde6e9',

        'gray-light': '#e4eaec',

        'gray-lighter': '#edf1f2'

    })

    .constant('APP_MEDIAQUERY', {

        'desktopLG': 1200,

        'desktop': 992,

        'tablet': 768,

        'mobile': 480

    })

    .constant('APP_REQUIRES', {

        // jQuery based and standalone scripts

        scripts: {

            'jquery-ui': ['vendor/jquery-ui/ui/core.js',

                'vendor/jquery-ui/ui/widget.js'

            ],

            // loads only jquery required modules and touch support

            'jquery-ui-widgets': ['vendor/jquery-ui/ui/core.js',

                'vendor/jquery-ui/ui/widget.js',

                'vendor/jquery-ui/ui/mouse.js',

                'vendor/jquery-ui/ui/draggable.js',

                'vendor/jquery-ui/ui/droppable.js',

                'vendor/jquery-ui/ui/sortable.js',

                'vendor/jqueryui-touch-punch/jquery.ui.touch-punch.min.js'

            ],

            'asmselect': ['vendor/asmselect/jquery.asmselect.js',

                'vendor/asmselect/jquery.asmselect.css'

            ],

            'parsley': ['vendor/parsleyjs/dist/parsley.min.js'],

            'whirl': ['vendor/whirl/dist/whirl.css'],

            'icons': ['vendor/fontawesome/css/font-awesome.min.css',

                'vendor/simple-line-icons/css/simple-line-icons.css'

            ],

            'nestable': ['vendor/nestable/jquery.nestable.js'],

            'sortable': ['vendor/sortable/jquery-ui.min.js',

                'vendor/sortable/sortable.js',

                'vendor/sortable/jquery-ui.min.css'

            ],

            'event-calendar': ['vendor/calendar.css', 'vendor/eventcalendar/fullcalendar.css', 'vendor/eventcalendar/tiny-scrollbar.js', 'vendor/eventcalendar/jquery.contextmenu.css', 'vendor/eventcalendar/jquery.contextmenu.js', 'vendor/eventcalendar/jquery.plugin.js',], // 'vendor/eventcalendar/jquery.datepick.js''vendor/eventcalendar/jquery.datepick.css'

            'smart-search': ['vendor/smart-search/dist/js/standalone/selectize.js', 'vendor/smart-search/dist/css/selectize.default.css', 'vendor/smart-search/examples/js/index.js', 'vendor/smart-search/examples/css/normalize.css', 'vendor/smart-search/examples/css/stylesheet.css'],

            'redicator': ['vendor/redactor-js-master/redactor/redactor.css', 'vendor/redactor-js-master/lib/jquery-1.9.0.min.js', 'vendor/redactor-js-master/redactor/redactor.min.js'],

        },

        // Angular based script (use the right module name)

        modules: [{

            name: 'toaster',

            files: ['vendor/angularjs-toaster/toaster.js', 'vendor/angularjs-toaster/toaster.css']

        },

        {

            name: 'ngTable',

            files: ['vendor/ng-table/dist/ng-table.min.js',

                'vendor/ng-table/dist/ng-table.min.css'

            ]

        },

        {

            name: 'ngDialog',

            files: ['vendor/ngDialog/js/ngDialog.min.js',

                'vendor/ngDialog/css/ngDialog.min.css',

                'vendor/ngDialog/css/ngDialog-theme-default.min.css'

            ]

        },

        {

            name: 'ui.select',

            files: ['vendor/angular-ui-select/dist/select.js',

                'vendor/angular-ui-select/dist/select.css'

            ]

        },

        /*{name: 'angularBootstrapNavTree',   files: ['vendor/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',

         'vendor/angular-bootstrap-nav-tree/dist/abn_tree.css']}*/





        /*{name: 'angularFileUpload',         files: ['vendor/angular-file-upload/angular-file-upload.js']},*/



        {

            name: 'xeditable',

            files: ['vendor/angular-xeditable/dist/js/xeditable.js',

                'vendor/angular-xeditable/dist/js/ui-bootstrap-tpls.min.js',

                'vendor/angular-xeditable/dist/css/xeditable.css'

            ]

        }

        ]





    });





App.controller('UserBlockController', ['$scope', function ($scope) {



    $scope.userBlockVisible = true;



    $scope.$on('toggleUserBlock', function (event, args) {



        $scope.userBlockVisible = !$scope.userBlockVisible;



    });



}]);



/**=========================================================

 * Module: main.js

 * Main Application Controller

 =========================================================*/



App.controller('AppController', ['$rootScope', '$scope', '$state', '$translate', '$window', '$localStorage', '$timeout', 'toggleStateService', 'colors', 'browser', 'cfpLoadingBar', 'moduleTracker',

    function ($rootScope, $scope, $state, $translate, $window, $localStorage, $timeout, toggle, colors, browser, cfpLoadingBar, moduleTracker) {

        "use strict";



        // Setup the layout mode

        $rootScope.app.layout.horizontal = ($rootScope.$stateParams.layout == 'app-h');



        // Loading bar transition

        // -----------------------------------

        var thBar;

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

            if ($('.wrapper > section').length) // check if bar container exists

                thBar = $timeout(function () {

                    cfpLoadingBar.start();

                }, 0); // sets a latency Threshold

        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

            $rootScope.previousState = fromState.name;

            event.targetScope.$watch("$viewContentLoaded", function () {

                $timeout.cancel(thBar);

                cfpLoadingBar.complete();

            });

            // $(document).find('body').on('click keydown DOMMouseScroll mousewheel mousedown touchstart', $rootScope.checkAndResetIdle);



            moduleTracker.buildNotes = true;

            moduleTracker.buildTasks = true;

            moduleTracker.buildDocs = true;

        });





        // Hook not found

        $rootScope.$on('$stateNotFound',

            function (event, unfoundState, fromState, fromParams) {

                console.log(unfoundState.to); // "lazy.state"

                console.log(unfoundState.toParams); // {a:1, b:2}

                console.log(unfoundState.options); // {inherit:false} + default options

            });

        // Hook error

        $rootScope.$on('$stateChangeError',

            function (event, toState, toParams, fromState, fromParams, error) {

                console.log(error);

            });

        // Hook success

        $rootScope.$on('$stateChangeSuccess',

            function (event, toState, toParams, fromState, fromParams) {

                // display new view from top

                $window.scrollTo(0, 0);

                // Save the route title

                $rootScope.currTitle = $state.current.title;

            });



        $rootScope.currTitle = $state.current.title;

        $rootScope.pageTitle = function () {

            var title = $rootScope.app.name + ' - ' + ($rootScope.currTitle || $rootScope.app.description);

            document.title = title;

            return title;

        };



        // iPad may presents ghost click issues

        // if( ! browser.ipad )

        // FastClick.attach(document.body);



        // Close submenu when sidebar change from collapsed to normal

        $rootScope.$watch('app.layout.isCollapsed', function (newValue, oldValue) {

            if (newValue === false)

                $rootScope.$broadcast('closeSidebarMenu');

        });



        // Restore layout settings

        if (angular.isDefined($localStorage.layout))

            $scope.app.layout = $localStorage.layout;

        else

            $localStorage.layout = $scope.app.layout;



        $rootScope.$watch("app.layout", function () {

            $localStorage.layout = $scope.app.layout;

        }, true);





        // Allows to use branding color with interpolation

        // {{ colorByName('primary') }}

        $scope.colorByName = colors.byName;



        // Internationalization

        // ----------------------



        $scope.language = {

            // Handles language dropdown

            listIsOpen: false,

            // list of available languages

            available: {

                'en': 'English',

                'es_AR': 'Español'

            },

            // display always the current ui language

            init: function () {

                var proposedLanguage = $translate.proposedLanguage() || $translate.use();

                var preferredLanguage = $translate.preferredLanguage(); // we know we have set a preferred one in app.config

                $scope.language.selected = $scope.language.available[(proposedLanguage || preferredLanguage)];

            },

            set: function (localeId, ev) {

                // Set the new idiom

                $translate.use(localeId);

                // save a reference for the current language

                $scope.language.selected = $scope.language.available[localeId];

                // finally toggle dropdown

                $scope.language.listIsOpen = !$scope.language.listIsOpen;

            }

        };



        $scope.language.init();



        // Restore application classes state

        toggle.restoreState($(document.body));



        // cancel click event easily

        $rootScope.cancel = function ($event) {

            $event.stopPropagation();

        };



    }

]);



/**=========================================================

 * Module: sidebar-menu.js

 * Handle sidebar collapsible elements

 =========================================================*/



App.controller('SidebarController', ['$rootScope', '$scope', '$state', '$http', '$timeout', 'Utils',

    function ($rootScope, $scope, $state, $http, $timeout, Utils) {



        var collapseList = [];



        // demo: when switch from collapse to hover, close all items

        $rootScope.$watch('app.layout.asideHover', function (oldVal, newVal) {

            if (newVal === false && oldVal === true) {

                closeAllBut(-1);

            }

        });



        // Check item and children active state

        var isActive = function (item) {



            if (!item)

                return;



            if (!item.sref || item.sref == '#') {

                var foundActive = false;

                angular.forEach(item.submenu, function (value, key) {

                    if (isActive(value))

                        foundActive = true;

                });

                return foundActive;

            } else

                return $state.is(item.sref) || $state.includes(item.sref);

        };



        // Load menu from json file

        // -----------------------------------



        $scope.getMenuItemPropClasses = function (item) {

            return (item.heading ? 'nav-heading' : '') +

                (isActive(item) ? ' active' : '');

        };



        $scope.loadSidebarMenu = function () {



            var menuJson = 'server/sidebar-menu.json',

                menuURL = menuJson + '?v=' + (new Date().getTime()); // jumps cache

            $http.get(menuURL)

                .success(function (items) {

                    $rootScope.menuItems = items;

                })

                .error(function (data, status, headers, config) {

                    alert('Failure loading menu');

                });

        };



        $scope.loadSidebarMenu();



        // Handle sidebar collapse items

        // -----------------------------------



        $scope.addCollapse = function ($index, item) {

            collapseList[$index] = $rootScope.app.layout.asideHover ? true : !isActive(item);

        };



        $scope.isCollapse = function ($index) {

            return (collapseList[$index]);

        };



        $scope.toggleCollapse = function ($index, isParentItem) {





            // collapsed sidebar doesn't toggle drodopwn

            if (Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover)

                return true;



            // make sure the item index exists

            if (angular.isDefined(collapseList[$index])) {

                if (!$scope.lastEventFromChild) {

                    collapseList[$index] = !collapseList[$index];

                    closeAllBut($index);

                }

            } else if (isParentItem) {

                closeAllBut(-1);

            }



            $scope.lastEventFromChild = isChild($index);



            return true;



        };



        function closeAllBut(index) {

            index += '';

            for (var i in collapseList) {

                if (index < 0 || index.indexOf(i) < 0)

                    collapseList[i] = true;

            }

        }



        function isChild($index) {

            return (typeof $index === 'string') && !($index.indexOf('-') < 0);

        }



    }

]);





/**=========================================================

 * Module: tags-input.js

 * Initializes the tag inputs plugin

 =========================================================*/



App.directive('tagsinput', ["$timeout", function ($timeout) {

    return {

        restrict: 'A',

        require: 'ngModel',

        link: function (scope, element, attrs, ngModel) {



            element.on('itemAdded itemRemoved', function () {

                // check if view value is not empty and is a string

                // and update the view from string to an array of tags

                if (ngModel.$viewValue && ngModel.$viewValue.split) {

                    ngModel.$setViewValue(ngModel.$viewValue.split(','));

                    ngModel.$render();

                }

            });



            $timeout(function () {

                element.tagsinput();

            });



        }

    };

}]);





/**=========================================================

 * Module: filestyle.js

 * Initializes the fielstyle plugin

 =========================================================*/





App.directive('filestyle', function () {

    return {

        restrict: 'A',

        controller: ["$scope", "$element", function ($scope, $element) {

            var options = $element.data();



            // old usage support

            options.classInput = $element.data('classinput') || options.classInput;



            $element.filestyle(options);

        }]

    };

});



/**=========================================================

 * Module: form-wizard.js

 * Handles form wizard plugin and validation

 =========================================================*/



App.directive('formWizard', ["$parse", function ($parse) {

    'use strict';



    return {

        restrict: 'A',

        scope: true,

        link: function (scope, element, attribute) {

            var validate = $parse(attribute.validateSteps)(scope),

                wiz = new Wizard(attribute.steps, !!validate, element);

            scope.wizard = wiz.init();



        }

    };



    function Wizard(quantity, validate, element) {



        var self = this;

        self.quantity = parseInt(quantity, 10);

        self.validate = validate;

        self.element = element;



        self.init = function () {

            self.createsteps(self.quantity);

            self.go(1); // always start at fist step

            return self;

        };



        self.go = function (step) {



            if (angular.isDefined(self.steps[step])) {



                if (self.validate && step !== 1) {

                    var form = $(self.element),

                        group = form.children().children('div').get(step - 2);



                    if (false === form.parsley().validate(group.id)) {

                        return false;

                    }

                }



                self.cleanall();

                self.steps[step] = true;

            }

        };



        self.active = function (step) {

            return !!self.steps[step];

        };



        self.cleanall = function () {

            for (var i in self.steps) {

                self.steps[i] = false;

            }

        };



        self.createsteps = function (q) {

            self.steps = [];

            for (var i = 1; i <= q; i++)

                self.steps[i] = false;

        };



    }



}]);



/**=========================================================

 * Module: validate-form.js

 * Initializes the validation plugin Parsley

 =========================================================*/



App.directive('validateForm', function () {

    return {

        restrict: 'A',

        controller: ["$scope", "$element", function ($scope, $element) {

            var $elem = $($element);

            if ($.fn.parsley)

                $elem.parsley();

        }]

    };

});





/**=========================================================

 * Module: animate-enabled.js

 * Enable or disables ngAnimate for element with directive

 =========================================================*/



App.directive("animateEnabled", ["$animate", function ($animate) {

    return {

        link: function (scope, element, attrs) {

            scope.$watch(function () {

                return scope.$eval(attrs.animateEnabled, scope);

            }, function (newValue) {

                $animate.enabled(!!newValue, element);

            });

        }

    };

}]);



/**=========================================================

 * Module: navbar-search.js

 * Navbar search toggler * Auto dismiss on ESC key

 =========================================================*/



App.directive('searchOpen', ['navSearch', function (navSearch) {

    'use strict';



    return {

        restrict: 'A',

        controller: ["$scope", "$element", function ($scope, $element) {

            $element

                .on('click', function (e) {

                    e.stopPropagation();

                })

                .on('click', navSearch.toggle);

        }]

    };



}]).directive('searchDismiss', ['navSearch', function (navSearch) {

    'use strict';



    var inputSelector = '.navbar-form input[type="text"]';



    return {

        restrict: 'A',

        controller: ["$scope", "$element", function ($scope, $element) {



            $(inputSelector)

                .on('click', function (e) {

                    e.stopPropagation();

                })

                .on('keyup', function (e) {

                    if (e.keyCode == 27) // ESC

                        navSearch.dismiss();

                });



            // click anywhere closes the search

            $(document).on('click', navSearch.dismiss);

            // dismissable options

            $element

                .on('click', function (e) {

                    e.stopPropagation();

                })

                .on('click', navSearch.dismiss);

        }]

    };



}]);





/**=========================================================

 * Module: sidebar.js

 * Wraps the sidebar and handles collapsed state

 =========================================================*/



App.directive('sidebar', ['$rootScope', '$window', 'Utils', function ($rootScope, $window, Utils) {



    var $win = $($window);

    var $body = $('body');

    var $scope;

    var $sidebar;

    var currentState = $rootScope.$state.current.name;



    return {

        restrict: 'EA',

        template: '<nav class="sidebar" ng-transclude></nav>',

        transclude: true,

        replace: true,

        link: function (scope, element, attrs) {



            $scope = scope;

            $sidebar = element;



            var eventName = Utils.isTouch() ? 'click' : 'mouseenter';

            var subNav = $();

            $sidebar.on(eventName, '.nav > li', function () {



                if (Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover) {



                    subNav.trigger('mouseleave');

                    subNav = toggleMenuItem($(this));



                    // Used to detect click and touch events outside the sidebar

                    sidebarAddBackdrop();



                }



            });



            scope.$on('closeSidebarMenu', function () {

                removeFloatingNav();

            });



            // Normalize state when resize to mobile

            $win.on('resize', function () {

                if (!Utils.isMobile())

                    $body.removeClass('aside-toggled');

            });



            // Adjustment on route changes

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

                currentState = toState.name;

                // Hide sidebar automatically on mobile

                $('body.aside-toggled').removeClass('aside-toggled');



                $rootScope.$broadcast('closeSidebarMenu');

            });



        }

    };



    function sidebarAddBackdrop() {

        var $backdrop = $('<div/>', {

            'class': 'dropdown-backdrop'

        });

        $backdrop.insertAfter('.aside-inner').on("click mouseenter", function () {

            removeFloatingNav();

        });

    }



    // Open the collapse sidebar submenu items when on touch devices

    // - desktop only opens on hover

    function toggleTouchItem($element) {

        $element

            .siblings('li')

            .removeClass('open')

            .end()

            .toggleClass('open');

    }



    // Handles hover to open items under collapsed menu

    // -----------------------------------

    function toggleMenuItem($listItem) {



        removeFloatingNav();



        var ul = $listItem.children('ul');



        if (!ul.length)

            return $();

        if ($listItem.hasClass('open')) {

            toggleTouchItem($listItem);

            return $();

        }



        var $aside = $('.aside');

        var $asideInner = $('.aside-inner'); // for top offset calculation

        // float aside uses extra padding on aside

        var mar = parseInt($asideInner.css('padding-top'), 0) + parseInt($aside.css('padding-top'), 0);

        var subNav = ul.clone().appendTo($aside);



        toggleTouchItem($listItem);



        var itemTop = ($listItem.position().top + mar) - $sidebar.scrollTop();

        var vwHeight = $win.height();



        subNav

            .addClass('nav-floating')

            .css({

                position: $scope.app.layout.isFixed ? 'fixed' : 'absolute',

                top: itemTop,

                bottom: (subNav.outerHeight(true) + itemTop > vwHeight) ? 0 : 'auto'

            });



        subNav.on('mouseleave', function () {

            toggleTouchItem($listItem);

            subNav.remove();

        });



        return subNav;

    }



    function removeFloatingNav() {

        $('.dropdown-backdrop').remove();

        $('.sidebar-subnav.nav-floating').remove();

        $('.sidebar li.open').removeClass('open');

    }



}]);

/**=========================================================

 * Module: toggle-state.js

 * Toggle a classname from the BODY Useful to change a state that

 * affects globally the entire layout or more than one item

 * Targeted elements must have [toggle-state="CLASS-NAME-TO-TOGGLE"]

 * User no-persist to avoid saving the sate in browser storage

 =========================================================*/



App.directive('toggleState', ['toggleStateService', function (toggle) {

    'use strict';



    return {

        restrict: 'A',

        link: function (scope, element, attrs) {



            var $body = $('body');



            $(element)

                .on('click', function (e) {

                    e.preventDefault();

                    var classname = attrs.toggleState;



                    if (classname) {

                        if ($body.hasClass(classname)) {

                            $body.removeClass(classname);

                            if (!attrs.noPersist)

                                toggle.removeState(classname);

                        } else {

                            $body.addClass(classname);

                            if (!attrs.noPersist)

                                toggle.addState(classname);

                        }



                    }



                });

        }

    };



}]);



/**=========================================================

 * Module: browser.js

 * Browser detection

 =========================================================*/



App.service('browser', function () {

    "use strict";



    var matched, browser;



    var uaMatch = function (ua) {

        ua = ua.toLowerCase();



        var match = /(opr)[\/]([\w.]+)/.exec(ua) ||

            /(chrome)[ \/]([\w.]+)/.exec(ua) ||

            /(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) ||

            /(webkit)[ \/]([\w.]+)/.exec(ua) ||

            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||

            /(msie) ([\w.]+)/.exec(ua) ||

            ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec(ua) ||

            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];



        var platform_match = /(ipad)/.exec(ua) ||

            /(iphone)/.exec(ua) ||

            /(android)/.exec(ua) ||

            /(windows phone)/.exec(ua) ||

            /(win)/.exec(ua) ||

            /(mac)/.exec(ua) ||

            /(linux)/.exec(ua) ||

            /(cros)/i.exec(ua) || [];



        return {

            browser: match[3] || match[1] || "",

            version: match[2] || "0",

            platform: platform_match[0] || ""

        };

    };



    matched = uaMatch(window.navigator.userAgent);

    browser = {};



    if (matched.browser) {

        browser[matched.browser] = true;

        browser.version = matched.version;

        browser.versionNumber = parseInt(matched.version);

    }



    if (matched.platform) {

        browser[matched.platform] = true;

    }



    // These are all considered mobile platforms, meaning they run a mobile browser

    if (browser.android || browser.ipad || browser.iphone || browser["windows phone"]) {

        browser.mobile = true;

    }



    // These are all considered desktop platforms, meaning they run a desktop browser

    if (browser.cros || browser.mac || browser.linux || browser.win) {

        browser.desktop = true;

    }



    // Chrome, Opera 15+ and Safari are webkit based browsers

    if (browser.chrome || browser.opr || browser.safari) {

        browser.webkit = true;

    }



    // IE11 has a new token so we will assign it msie to avoid breaking changes

    if (browser.rv) {

        var ie = "msie";



        matched.browser = ie;

        browser[ie] = true;

    }



    // Opera 15+ are identified as opr

    if (browser.opr) {

        var opera = "opera";



        matched.browser = opera;

        browser[opera] = true;

    }



    // Stock Android browsers are marked as Safari on Android.

    if (browser.safari && browser.android) {

        var android = "android";



        matched.browser = android;

        browser[android] = true;

    }



    // Assign the name and platform variable

    browser.name = matched.browser;

    browser.platform = matched.platform;





    return browser;



});

/**=========================================================
 * Module: colors.js
 * Services to retrieve global colors
 =========================================================*/

App.factory('colors', ['APP_COLORS', function (colors) {
    return {
        byName: function (name) {
            return (colors[name] || '#fff');
        }
    };
}]);

App.factory('ser1', function () {
    return {
        o: ''
    };
});

App.service('dataService', function () {
    // private variable
    var _dataObj = {};
    this.dataObj = _dataObj;
});

App.factory('SubmitContactLoc', function ($rootScope, $http, toaster) {
    var fs = {};

    fs.contact = function (rec_contact, drp, record_data_contact, selected_data_loc_contact) {
        rec_contact.country = (rec_contact.alt_country_id != undefined && rec_contact.alt_country_id != '') ? rec_contact.alt_country_id.id : 0;
        rec_contact.pref_method_of_communication = (drp.pref_mthod_of_comm != undefined && drp.pref_mthod_of_comm != '') ? drp.pref_mthod_of_comm.id : 0;
        /* rec_contact.socialmedia1s = (rec_contact.socialmedia1 != undefined && rec_contact.socialmedia1 != '') ? rec_contact.socialmedia1.id : 0;
        rec_contact.socialmedia2s = (rec_contact.socialmedia2 != undefined && rec_contact.socialmedia2 != '') ? rec_contact.socialmedia2.id : 0;
        rec_contact.socialmedia3s = (rec_contact.socialmedia3 != undefined && rec_contact.socialmedia3 != '') ? rec_contact.socialmedia3.id : 0;
        rec_contact.socialmedia4s = (rec_contact.socialmedia4 != undefined && rec_contact.socialmedia4 != '') ? rec_contact.socialmedia4.id : 0;
        rec_contact.socialmedia5s = (rec_contact.socialmedia5 != undefined && rec_contact.socialmedia5 != '') ? rec_contact.socialmedia5.id : 0;
        */

        var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

        if (rec_contact.email) {
            if (!(regexEmail.test(rec_contact.email))) {
                toaster.pop('error', 'info', $rootScope.getErrorMessageByCode(300, ['Email']));
                return false;
            }
        }
        rec_contact.token = $rootScope.token;

        if (rec_contact.id != undefined)
            var AltContactUrl = $rootScope.sales + "crm/crm/update-alt-contact";
        else
            var AltContactUrl = $rootScope.sales + "crm/crm/add-alt-contact";

        var httpPromise = $http
            .post(AltContactUrl, rec_contact)
            .then(function (res) {

                if (res.data.ack == true) {
                    if (rec_contact.id > 0)
                        toaster.pop('success', 'Edit', $rootScope.getErrorMessageByCode(102));
                    else
                        toaster.pop('success', 'Info', $rootScope.getErrorMessageByCode(101));

                    if (rec_contact.id == undefined)
                        rec_contact.id = res.data.id;

                    // function to add multiple locations from location modal.
                    // if (rec_contact.id > 0 && record_data_contact.length > 0)

                    if (rec_contact.id > 0 && record_data_contact != undefined)
                        fs.add_multicontact_location(rec_contact.id, 2, rec_contact.acc_id, rec_contact.module_type, selected_data_loc_contact);

                    // httpPromise.resolve(true);
                    return true;
                } 
                else {
                    if (rec_contact.id > 0)
                        toaster.pop('error', 'info', res.data.error);
                    else
                        toaster.pop('error', 'Add', res.data.error);

                    //httpPromise.reject(false);
                    return false;
                }
            }).catch(function (e) {
                throw new Error(e.data);
            });

        return httpPromise;
    }
    // return {contact: fs.contact };

    fs.location = function (rec_loc, drp, record_data_contact, selected_data_loc_contact) {
        // console.log(rec_loc);
        var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

        if (rec_loc.email) {
            if (!(regexEmail.test(rec_loc.email))) {
                toaster.pop('error', 'info', $rootScope.getErrorMessageByCode(300, ['Email']));
                return false;
            }
        }

        rec_loc.country = (rec_loc.depo_country_id != undefined && rec_loc.depo_country_id != '') ? rec_loc.depo_country_id.id : 0;
        rec_loc.booking_contacts = (rec_loc.booking_contact != undefined && rec_loc.booking_contact != '') ? rec_loc.booking_contact.id : 0;
        rec_loc.pref_method_of_communication = (drp.pref_mthod_of_comm != undefined && drp.pref_mthod_of_comm != '') ? drp.pref_mthod_of_comm.id : 0;
        rec_loc.booking_pref_method_of_communication = (drp.booking_pref_mthod_of_comm != undefined && drp.booking_pref_mthod_of_comm != '') ? drp.booking_pref_mthod_of_comm.id : 0;
        rec_loc.region_ids = (rec_loc.region_id != undefined && rec_loc.region_id != '') ? rec_loc.region_id.id : 0;

        if (angular.element('#locis_billing_address').is(':checked') == false)
            rec_loc.is_billing_address = 0;

        if (angular.element('#locis_delivery_collection_address').is(':checked') == false)
            rec_loc.is_delivery_collection_address = 0;

        if (angular.element('#locis_invoice_address').is(':checked') == false)
            rec_loc.is_invoice_address = 0;

        rec_loc.token = $rootScope.token;

        if (rec_loc.id != undefined)
            var altAddUrl = $rootScope.$root.sales + "crm/crm/update-alt-depot";
        else
            var altAddUrl = $rootScope.$root.sales + "crm/crm/add-alt-depot";

        var httpPromise = $http
            .post(altAddUrl, rec_loc)
            .then(function (res) {
                if (res.data.ack == 0) {
                    toaster.pop('error', 'info', res.data.error);
                    return false;
                } else {

                    if (rec_loc.id > 0)
                        toaster.pop('success', 'Add', $rootScope.getErrorMessageByCode(101));
                    else
                        toaster.pop('success', 'Edit', $rootScope.getErrorMessageByCode(102));

                    if (rec_loc.id == undefined)
                        rec_loc.id = res.data.id;

                    // function to add multiple contact from contact modal.
                    // if (rec_loc.id > 0 && record_data_contact.length > 0)

                    if (rec_loc.id > 0 && record_data_contact != undefined)
                        fs.add_multicontact_location(rec_loc.id, 1, rec_loc.acc_id, rec_loc.module_type, selected_data_loc_contact);

                    return true;
                }
            }).catch(function (e) {
                throw new Error(e.data);
            });

        return httpPromise;
    }

    fs.add_multicontact_location = function (id, type, acc_id, module_type, selected_data_loc_contact) {
        var post = {};
        var temp = [];

        angular.forEach(selected_data_loc_contact, function (obj) {
            temp.push({
                id: obj.id
            });
        });

        post.addcontactslisting = temp;
        post.rec_id = id;
        post.type = type;
        post.acc_id = acc_id;
        post.token = $rootScope.token;
        post.module_type = module_type;
        var postUrl = $rootScope.sales + "crm/crm/add-list-contact-location";

        $http
            .post(postUrl, post)
            .then(function (ress) {
                /* if (type == 1)
                    angular.element('#popup_add_location').modal('hide');
                else
                    angular.element('#popup_add_location2').modal('hide'); */
            }).catch(function (e) {
                throw new Error(e.data);
            });
    }
    return fs;
});

// Order stages
App.factory('OrderStages', function ($rootScope, $http, toaster) {
    var order_stages = {};

    order_stages.addOrderStages = function (order_stages) {

        var addUrl = $rootScope.sales + "customer/order/update-sales-order-stages";

        var httpPromise = $http
            .post(addUrl, { 'token': $rootScope.token, 'order_stages': order_stages })
            .then(function (res) {
                if (res.data.ack > 0) {
                    return res.data;
                } else {
                    // toaster.pop('error', 'Info', res.data.error);
                    return false;
                }
            });

        return httpPromise;
    }
    return order_stages;
});

//'pricemodule'

/* App.factory('TaskService', function ($rootScope, $http, toaster) {
    console.log('inside service'); 
    var task={};

    task.ServiceFtn = function()
    {
        console.log('inside service function'); 
    }
}); */

App.factory('SubmitPrice', function ($rootScope, $http, toaster) {
    var price = {};

    price.addPrice = function (priceRec, selectedCRMLoc) {
        priceRec.offer_method_id = (priceRec.offer_method_ids != undefined && priceRec.offer_method_ids != '') ? priceRec.offer_method_ids.id : 0;
        //priceRec.unit_of_measure = (priceRec.unit_of_measures != undefined && priceRec.unit_of_measures != '') ? priceRec.unit_of_measures.id : 0;
        priceRec.currency_id = (priceRec.currencys != undefined && priceRec.currencys != '') ? priceRec.currencys.id : 0;
        // priceRec.location_id = "";
        //console.log(priceRec);
        priceRec.token = $rootScope.token;
        // console.log(priceRec.items);

        var addUrl = $rootScope.sales + "crm/crm/add-price-offer";

        if (priceRec.id > 0)
            var addUrl = $rootScope.sales + "crm/crm/update-price-offer";

        if (priceRec.offeredByID == undefined) {
            // toaster.pop('error', 'Info', "Please Select Offered By.");
            // return;
            priceRec.offered_by = $rootScope.defaultUserName;
            priceRec.offeredByID = $rootScope.userId;
        }

        // console.log(priceRec);
        if (Array.isArray(priceRec)) {
            var newObj = {};
            angular.extend(newObj, priceRec);
            var priceRec = {};
            angular.copy(newObj, priceRec);
        }

        var httpPromise = $http
            .post(addUrl, priceRec)
            .then(function (res) {
                if (res.data.ack > 0) {
                    return res.data;
                } else {
                    toaster.pop('error', 'Info', res.data.error);
                    return false;
                }
            },
            function (res) {
                // console.log(res);
            });
        return httpPromise;
    }

    price.addPriceOfferItem = function (itemRec, priceID) {
        //console.log(itemRec);
        itemRec.uomID = itemRec.UOM.id;
        itemRec.priceID = priceID;
        itemRec.token = $rootScope.token;

        var submitUrl = $rootScope.sales + "crm/crm/add-price-offer-item";

        var httpPromise = $http
            .post(submitUrl, itemRec)
            .then(function (res) {
                if (res.data.ack > 0) {
                    return res.data;
                } else {
                    return false;
                }
            });

        return httpPromise;
    }

    price.deletePriceOffer = function (priceRec) {
        priceRec.token = $rootScope.token;
        var submitUrl = $rootScope.sales + "crm/crm/delete-price-offer";

        var httpPromise = $http
            .post(submitUrl, priceRec)
            .then(function (res) {
                if (res.data.ack > 0) {
                    return res.data;
                } else {
                    return false;
                }
            });

        return httpPromise;
    }

    price.deletePriceOfferItem = function (itemRec) {
        itemRec.token = $rootScope.token;
        var submitUrl = $rootScope.sales + "crm/crm/delete-price-offer-item";

        var httpPromise = $http
            .post(submitUrl, itemRec)
            .then(function (res) {
                if (res.data.ack > 0) {
                    return res.data;
                } else {
                    return false;
                }
            });

        return httpPromise;
    }

    price.deletePriceOfferVolumeItem = function (itemRecID) {
        var itemRec = {};
        itemRec.token = $rootScope.token;
        itemRec.id = itemRecID;
        var submitUrl = $rootScope.sales + "crm/crm/delete-price-offer-item-volume";

        var httpPromise = $http
            .post(submitUrl, itemRec)
            .then(function (res) {
                if (res.data.ack > 0) {
                    return res.data;
                } else {
                    return false;
                }
            });

        return httpPromise;
    }

    price.addPriceOfferItemVolume = function (itemVolumeRec, discountType, priceID, itemID) {
        //console.log(itemRec);
        itemVolumeRec.discountType = discountType;
        itemVolumeRec.Discount = itemVolumeRec.discount;
        itemVolumeRec.priceID = priceID;
        itemVolumeRec.itemID = itemID;
        itemVolumeRec.token = $rootScope.token;
        // console.log(itemVolumeRec);

        var submitUrl = $rootScope.sales + "crm/crm/add-price-offer-item-volume";

        var httpPromise = $http
            .post(submitUrl, itemVolumeRec)
            .then(function (res) {
                if (res.data.ack > 0) {
                    return res.data;
                } else {
                    return false;
                }
            });

        return httpPromise;
    }

    price.deletePriceListAdditionalCost = function (itemRecID) {
        var itemRec = {};
        itemRec.token = $rootScope.token;
        itemRec.id = itemRecID;

        var submitUrl = $rootScope.sales + "crm/crm/delete-price-list-additional-cost";

        var httpPromise = $http
            .post(submitUrl, itemRec)
            .then(function (res) {
                if (res.data.ack > 0) {
                    return res.data;
                } else {
                    return false;
                }
            });

        return httpPromise;
    }

    price.addPriceListAdditionalCost = function (recAdditionalCost, priceID, itemID) {
        recAdditionalCost.priceID = priceID;
        recAdditionalCost.itemID = itemID;
        recAdditionalCost.token = $rootScope.token;

        var submitUrl = $rootScope.sales + "crm/crm/add-price-list-additional-cost";

        var httpPromise = $http
            .post(submitUrl, recAdditionalCost)
            .then(function (res) {
                if (res.data.ack > 0) {
                    return res.data;
                } else {
                    return res.data;
                }
            });

        return httpPromise;
    }

    price.getallGLaccounts = function () {
        var glParam = {};
        glParam.token = $rootScope.token;
        glParam.cat_id = 3;

        var postUrl_cat = $rootScope.gl + "chart-accounts/get-category-by-name";

        var httpPromise = $http
            .post(postUrl_cat, glParam)
            .then(function (res) {

                if (res.data.ack > 0)
                    return res.data.response;
                else
                    return false;

            }).catch(function (message) {
                // toaster.pop('error', 'info', 'Server is not Acknowledging');
                throw new Error(message.data);
            });

        return httpPromise;
    }

    price.getallItemAdditionalCost = function () {
        var ItemAdditionalCost = {};
        ItemAdditionalCost.token = $rootScope.token;
        ItemAdditionalCost.type = 1;

        var postUrl_ItemAdditionalCost = $rootScope.setup + "ledger-group/get-all-item-additional-cost";

        var httpPromise = $http
            .post(postUrl_ItemAdditionalCost, ItemAdditionalCost)
            .then(function (res) {

                if (res.data.ack > 0)
                    return res.data.response;
                else
                    return false;

            }).catch(function (message) {
                // toaster.pop('error', 'info', 'Server is not Acknowledging');
                throw new Error(message.data);
            });

        return httpPromise;
    }
    return price;
});

/**=========================================================
 * Module: nav-search.js
 * Services to share navbar search functions
 =========================================================*/

App.service('navSearch', function () {
    var navbarFormSelector = 'form.navbar-form';
    return {
        toggle: function () {
            var navbarForm = $(navbarFormSelector);
            navbarForm.toggleClass('open');
            var isOpen = navbarForm.hasClass('open');
            navbarForm.find('input')[isOpen ? 'focus' : 'blur']();
        },
        dismiss: function () {
            $(navbarFormSelector)
                .removeClass('open') // Close control
                .find('input[type="text"]').blur() // remove focus
                .val('') // Empty input
                ;
        }
    };
});

/**=========================================================
 * Module: helpers.js
 * Provides helper functions for routes definition
 =========================================================*/

App.provider('RouteHelpers', ['APP_REQUIRES', function (appRequires) {
    "use strict";
    // Set here the base of the relative path
    // for all app views

    this.basepath = function (uri) {
        return 'app/views/' + uri;
    };

    // Generates a resolve object by passing script names
    // previously configured in constant.APP_REQUIRES

    this.resolveFor = function () {
        var _args = arguments;
        return {
            deps: ['$ocLazyLoad', '$q', function ($ocLL, $q) {
                // Creates a promise chain for each argument
                var promise = $q.when(1); // empty promise

                for (var i = 0, len = _args.length; i < len; i++) {
                    promise = andThen(_args[i]);
                }

                return promise;

                // creates promise to chain dynamically
                function andThen(_arg) {
                    // also support a function that returns a promise
                    if (typeof _arg == 'function')
                        return promise.then(_arg);
                    else
                        return promise.then(function () {
                            // if is a module, pass the name. If not, pass the array
                            var whatToLoad = getRequired(_arg);
                            // simple error check
                            if (!whatToLoad)
                                return $.error('Route resolve: Bad resource name [' + _arg + ']');

                            // finally, return a promise
                            return $ocLL.load(whatToLoad);
                        });
                }

                // check and returns required data
                // analyze module items with the form [name: '', files: []]
                // and also simple array of script files (for not angular js)

                function getRequired(name) {
                    if (appRequires.modules)
                        for (var m in appRequires.modules)
                            if (appRequires.modules[m].name && appRequires.modules[m].name === name)
                                return appRequires.modules[m];
                    return appRequires.scripts && appRequires.scripts[name];
                }
            }]
        };
    }; // resolveFor
    // not necessary, only used in config block for routes
    this.$get = function () { };
}]);

/**=========================================================
 * Module: toggle-state.js
 * Services to share toggle state functionality
 =========================================================*/

App.service('toggleStateService', ['$rootScope', function ($rootScope) {
    var storageKeyName = 'toggleState';

    // Helper object to check for words in a phrase //
    var WordChecker = {
        hasWord: function (phrase, word) {
            return new RegExp('(^|\\s)' + word + '(\\s|$)').test(phrase);
        },
        addWord: function (phrase, word) {
            if (!this.hasWord(phrase, word)) {
                return (phrase + (phrase ? ' ' : '') + word);
            }
        },
        removeWord: function (phrase, word) {
            if (this.hasWord(phrase, word)) {
                return phrase.replace(new RegExp('(^|\\s)*' + word + '(\\s|$)*', 'g'), '');
            }
        }
    };

    // Return service public methods
    return {
        // Add a state to the browser storage to be restored later
        addState: function (classname) {
            var data = angular.fromJson($rootScope.$storage[storageKeyName]);

            if (!data) {
                data = classname;
            } else {
                data = WordChecker.addWord(data, classname);
            }
            $rootScope.$storage[storageKeyName] = angular.toJson(data);
        },

        // Remove a state from the browser storage
        removeState: function (classname) {
            var data = $rootScope.$storage[storageKeyName];
            // nothing to remove
            if (!data)
                return;

            data = WordChecker.removeWord(data, classname);
            $rootScope.$storage[storageKeyName] = angular.toJson(data);
        },

        // Load the state string and restore the classlist
        restoreState: function ($elem) {
            var data = angular.fromJson($rootScope.$storage[storageKeyName]);
            // nothing to restore
            if (!data)
                return;

            $elem.addClass(data);
        }
    };
}]);

/**=========================================================
 * Module: utils.js
 * Utility library to use across the theme
 =========================================================*/

App.service('Utils', ["$window", "APP_MEDIAQUERY", function ($window, APP_MEDIAQUERY) {
    'use strict';

    var $html = angular.element("html"),
        $win = angular.element($window),
        $body = angular.element('body');

    return {
        // DETECTION
        support: {
            transition: (function () {
                var transitionEnd = (function () {

                    var element = document.body || document.documentElement,
                        transEndEventNames = {
                            WebkitTransition: 'webkitTransitionEnd',
                            MozTransition: 'transitionend',
                            OTransition: 'oTransitionEnd otransitionend',
                            transition: 'transitionend'
                        },
                        name;

                    for (name in transEndEventNames) {
                        if (element.style[name] !== undefined)
                            return transEndEventNames[name];
                    }
                }());

                return transitionEnd && {
                    end: transitionEnd
                };
            })(),
            animation: (function () {
                var animationEnd = (function () {

                    var element = document.body || document.documentElement,
                        animEndEventNames = {
                            WebkitAnimation: 'webkitAnimationEnd',
                            MozAnimation: 'animationend',
                            OAnimation: 'oAnimationEnd oanimationend',
                            animation: 'animationend'
                        },
                        name;

                    for (name in animEndEventNames) {
                        if (element.style[name] !== undefined)
                            return animEndEventNames[name];
                    }
                }());

                return animationEnd && {
                    end: animationEnd
                };
            })(),
            requestAnimationFrame: window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.oRequestAnimationFrame ||

            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            },
            touch: (
                ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
                (window.DocumentTouch && document instanceof window.DocumentTouch) ||
                (window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0) || //IE 10
                (window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0) || //IE >=11
                false
            ),
            mutationobserver: (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null)
        },
        // UTILITIES
        isInView: function (element, options) {
            var $element = $(element);

            if (!$element.is(':visible')) {
                return false;
            }

            var window_left = $win.scrollLeft(),
                window_top = $win.scrollTop(),
                offset = $element.offset(),
                left = offset.left,
                top = offset.top;

            options = $.extend({
                topoffset: 0,
                leftoffset: 0
            }, options);

            if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
                left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {

                return true;
            } else {
                return false;
            }
        },
        langdirection: $html.attr("dir") == "rtl" ? "right" : "left",
        isTouch: function () {
            return $html.hasClass('touch');
        },
        isSidebarCollapsed: function () {
            return $body.hasClass('aside-collapsed');
        },
        isSidebarToggled: function () {
            return $body.hasClass('aside-toggled');
        },
        isMobile: function () {
            return $win.width() < APP_MEDIAQUERY.tablet;
        }
    };
}]);

// To run this code, edit file
// index.html or index.jade and change
// html data-ng-app attribute from
// angle to myAppName
// -----------------------------------

var myApp = angular.module('navson', ['angle']);

myApp.run(["$log", function ($log) {
    //$log.log('I\'m a line from custom.js');
}]);

// adding Http interceptor : noor

myApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push(['$rootScope', '$q', '$injector', 'toaster', '$interval', '$timeout', function ($rootScope, $q, $injector, toaster, $interval, $timeout) {

        var incrementalTimeout = 1000;

        function retryRequest(httpConfig) {
            var $timeout = $injector.get('$timeout');
            var thisTimeout = incrementalTimeout;
            incrementalTimeout *= 2;
            return $timeout(function () {
                var $http = $injector.get('$http');
                return $http(httpConfig);
            }, thisTimeout);
        };

        return {
            'request': function (request) {
                // for (let i = 0; i < localStorage.length; i++) {
                //     console.log(localStorage.key(i), localStorage.getItem(localStorage.key(i)));
                //   }
                var stateService = $injector.get('$state');

                /* if (!stateService.current.name || stateService.current.name == "app.customerPortal") {
                    console.log('direct access');
                    stateService.current.name = "app.customerPortal"; 
                    // console.log('portal access');
                    // console.log(stateService.current.name);
                    request.data = {};
                    request.data.customerPortal = 'customerPortal';
                    request.data.password = "Elan500mlx24!!";
                    request.data.user_name = "Bia.shan@gmail.com";
                    $rootScope.login = true;
                    $rootScope.$storage.setItem("currentUser", request.data.user_name);
                    $rootScope.token = 'OEVBbEZvUUNoTExBT0JveTFYdm1Ldz09?S0NUSG01ejRHdC9uTGMwSWdtTVdTdlZwRUsyY2dLcktBRTNsdDBiQTZxcz0=?dGtvaGp2RENrN0pTYjdNci8wSUJmNlhGM205UTdRNnZDYjJzaGxlZ3o3YVZ1MUM2dXlPV3NBTVNsVTg2Z2VCUUtsdzA4WEl5NVhlYVd1YnhrVnR2V1E9PQ==?ckpVeFV5UXNyUTZoejhrSHBSaHFBZz09';$rootScope.$storage.setItem("token", $rootScope.token);               
                }
                else  */
                //    console.log(window.localStorage.currentUser);

                /* if(window.localStorage.currentUser == 'Bia.shan@gmail.com') {
                    // stateService.go('page.login');
                    $rootScope.login = false;
                    //make defualt root all variable null
                    $rootScope.token = 0;
                    for (var prop in $rootScope) {
                        if (prop.substring(0, 1) !== '$') {
                            delete $rootScope[prop];
                        }
                    }
                    $rootScope.$storage.clear();
                    $rootScope = undefined;
                    console.log('logout' + $rootScope);
                    location.reload();
                }  */

                if (stateService.current.name != "page.login") {
                    if ($rootScope.forceLogoutHandler == undefined) {
                        $rootScope.logoutTimer = null;
                        localStorage.setItem("forceLogoutTime", 0);

                        $rootScope.forceLogoutHandler = function () {
                            let currentTime = parseInt(Date.now() / 1000);
                            let _logoutTime = localStorage.getItem("forceLogoutTime");

                            if ((_logoutTime && _logoutTime > 0 && currentTime >= _logoutTime) || _logoutTime == 0) {
                                // console.log("logging out now..");
                                localStorage.setItem("forceLogoutTime", 0);
                                $(document).find('.ngdialog').hide();
                                $(document).find('#modalToGoToTask').hide();
                                window.current_state = stateService.current;
                                window.current_state_params = stateService.params;
                                window.current_activity_user_name = $rootScope.$storage.getItem('currentUser');//$rootScope.user_name;
                                $rootScope.animateBulkEmail = false;
                                $rootScope.animateBulkEmailText = '';
                                // console.log("State", window.current_state);
                                // console.log("State Params", window.current_state_params);
                                $rootScope.session_expiry_message = "Your session has expired, Please Login again !";
                                // $scope.logout();
                                $rootScope.addLogoutTime();
                                stateService.go('page.login');
                                $interval.cancel($rootScope.logoutTimer);
                                stateService.go('page.login');
                            }
                            else {
                                // $rootScope.logoutTimer
                                // console.log("logout after ", (_logoutTime - currentTime) , " seconds")
                                $interval.cancel($rootScope.logoutTimer);
                                $rootScope.logoutTimer = $timeout(() => { $rootScope.forceLogoutHandler() }, ((_logoutTime - currentTime) * 1000))
                            }
                        };
                    }
                    else {
                        // if (localStorage.getItem("forceLogoutTime") == 0){
                        //     stateService.go('page.login');
                        // }
                    }

                    var logoutAfterMinutes = 24;
                    let tempTime = new Date(Date.now() + logoutAfterMinutes * 60000).getTime() / 1000;
                    // console.log("logout after ", Date(tempTime))
                    localStorage.setItem("forceLogoutTime", parseInt(tempTime));
                    if ($rootScope.logoutTimer) $interval.cancel($rootScope.logoutTimer);
                    $rootScope.logoutTimer = $interval(() => { $rootScope.forceLogoutHandler() }, logoutAfterMinutes * 60000)

                    // warning a minute before logout..
                    $rootScope.warningHandler = function (ifAnyDuration) {
                        if ($rootScope.warningTimeout) $timeout.cancel($rootScope.warningTimeout);

                        $rootScope.warningTimeout = $timeout(function () {
                            let currentTime = parseInt(Date.now() / 1000);
                            let _logoutTime = localStorage.getItem("forceLogoutTime") - 60;

                            if (_logoutTime && _logoutTime > 0 && currentTime >= _logoutTime) {
                                if (stateService.current.name != "page.login") {
                                    var ngDialog = $injector.get('ngDialog');

                                    ngDialog.openConfirm({
                                        template: "sessionTimeoutConfirmationDialog",
                                        className: 'ngdialog-theme-default-custom'
                                    }).then(function (value) {
                                    }, function (reason) {
                                        let tempTime = new Date(Date.now() + logoutAfterMinutes * 60000).getTime() / 1000;
                                        console.log("logout after ", Date(tempTime));
                                        localStorage.setItem("forceLogoutTime", parseInt(tempTime));

                                        if ($rootScope.logoutTimer) $interval.cancel($rootScope.logoutTimer);
                                        $rootScope.logoutTimer = $interval(() => { $rootScope.forceLogoutHandler() }, logoutAfterMinutes * 60000);
                                        $rootScope.warningHandler();
                                    });
                                }
                            }
                            else {
                                $rootScope.warningHandler(_logoutTime - currentTime);
                            }
                        }, (ifAnyDuration ? (ifAnyDuration * 1000) : (logoutAfterMinutes - 1) * 60000));
                    }
                    $rootScope.warningHandler();
                }
                else {
                    localStorage.setItem("forceLogoutTime", 0)

                    if ($rootScope.logoutTimer) $interval.cancel($rootScope.logoutTimer);
                    if ($rootScope.warningTimeout) $timeout.cancel($rootScope.warningTimeout);
                }

                if (request.data) {
                    request.data.interceptorHeaders = {
                        time: parseInt(Date.now() / 1000),
                        timezone: new Date().getTimezoneOffset()
                    }
                }
                return request;
            },
            'response': function (response) {
                var stateService = $injector.get('$state');

                if (response && response.data && response.data.Access == 0) {
                    stateService.go("app.dashboard");

                    setTimeout(() => {
                        toaster.pop({
                            type: "error",
                            title: "Access Forbidden",
                            body: "You do not have permission to '" + response.data.PermissionName + "' the '" + response.data.Module + "'.",
                            onHideCallback: function (toast) {
                            }
                        })
                    }, 0);
                    // alert("You do not have permission to '" + response.data.PermissionName + "' the '" + response.data.Module + ".");
                    // prompt("You do not have permission to '" + response.data.PermissionName + "' the '" + response.data.Module + "'\nPlease copy the following report and provide it to the Dev Team.",JSON.stringify(response.data));
                }
                else if (response && response.data && response.data.bucketFail) {
                    // this would happen when a record page is fetched but that record is rejected with the buckets
                    $rootScope.showLoader = false;

                    toaster.pop({
                        type: "error",
                        title: "Record not found",
                        body: "The role assigned to you does not have permission to view this record.",
                        onHideCallback: function (toast) {
                            stateService.go("app.dashboard");
                        }
                    })

                } else if (response && response.data && response.data.Friendly == 1) {
                    alert(response.data.friendlyErrorMsg);

                    toaster.pop({
                        type: "error",
                        title: "error",
                        body: response.data.friendlyErrorMsg,
                        timeout: 0,
                        tapToDismiss: false,
                        onHideCallback: function (toast) {
                            // stateService.go($rootScope.previousState || "app.dashboard");
                        }
                    })
                }
                else if (response && response.data && response.data.Error == 1) {
                    // console.log(JSON.stringify(response.data));
                    var dateTime = new Date(response.data.srTraceData.dateTime * 1000).toISOString().slice(0, 19).replace('T', ' ')

                    toaster.pop({
                        type: "error",
                        title: "error",
                        body: "The system encountered an unexpected error: '" + response.data.srTraceData.id + "-" + response.data.srTraceData.dateTime + "'.<br/>System Time: " + dateTime + "<br/>Please provide this error code to Silverow Support Team.<br/>Thank you!",
                        timeout: 0,
                        bodyOutputType: 'trustedHtml',
                        tapToDismiss: false,
                        onHideCallback: function (toast) {
                            // stateService.go($rootScope.previousState || "app.dashboard");
                        }
                    })
                    // toaster.pop("error", "error", "Please copy the following bug report and provide it to the Dev Team.\nThank you!", response.data.ErrorMessage);
                    // prompt("Please copy the following bug report and provide it to the Dev Team.\nThank you!",response.data.ErrorMessage);
                    // stateService.go('app.dashboard');
                }
                else {
                    // console.log('successufully resolving');
                    return response;
                }
            },
            'responseError': function (response) {
                var status = response.status;
                // Skip for response with code 422 (as asked in the comment)
                /* if (status != 422) {
                    var routes = {'401': 'show-login', '500': 'server-error'};
                    $rootScope.$broadcast("ajaxError", {template: routes[status]});
                }  */

                if ((status == 403 || status == 401) && response.config.url.indexOf("hmrc") == -1) {
                    var stateService = $injector.get('$state');

                    if (stateService.current.name != "page.login") {
                        $rootScope.country_type_arr = undefined;
                        $rootScope.arr_vat = undefined;
                        $rootScope.deprtment_arr = undefined;
                        $rootScope.emp_type_arr = undefined;
                        // $rootScope.arr_vat_post_grp = undefined;
                        // $rootScope.customer_arr = undefined;
                        $rootScope.customer_checksum_id = undefined;
                        $rootScope.arr_currency = undefined;
                        $rootScope.prooduct_arr = undefined;
                        $rootScope.arr_posting_group_ids = undefined;
                        $rootScope.prodLastUpdateTime = undefined;
                        $rootScope.invSetuplastUpdateTime = undefined;
                        $rootScope.empllastUpdateTime = undefined;
                        $rootScope.setupGlobalLastUpdateTime = undefined;

                        localStorage.removeItem('currentUser');
                        localStorage.removeItem('country_type_arr');
                        localStorage.removeItem('arr_vat');
                        localStorage.removeItem('deprtment_arr');
                        localStorage.removeItem('emp_type_arr');
                        // localStorage.removeItem('arr_vat_post_grp');
                        localStorage.removeItem('customer_arr');
                        localStorage.removeItem('customer_checksum_id');
                        localStorage.removeItem('cat_prodcut_arr');
                        localStorage.removeItem('arr_currency');
                        localStorage.removeItem('prooduct_arr');

                        $rootScope.current_state = stateService.current;
                        $rootScope.current_state_params = stateService.params;
                        window.current_activity_user_name = $rootScope.$storage.getItem('currentUser');//$rootScope.user_name;

                        if (status == 403) {
                            $rootScope.session_expiry_message = "Your session has expired, Please login again.";
                        }
                        else {
                            $rootScope.session_expiry_message = "You have been logged out because another user has logged in using your login details from this IP address." + response.data.g_last_activity_ip;
                        }
                    }
                    $rootScope.addLogoutTime();
                    stateService.go('page.login');
                    console.log('Session Expired');
                }

                if (status >= 500) {
                    if (incrementalTimeout < 5000) {
                        return retryRequest(response.config);
                    }
                    else {
                        $rootScope.showLoader = false;

                        toaster.pop({
                            type: "error",
                            title: "Error",
                            body: "Something went wrong, refreshing...",
                            onHideCallback: function (toast) {
                                stateService.go("app.dashboard");
                            }
                        });
                        // $window.location.reload();
                        window.location.reload();
                    }
                }
                else {
                    incrementalTimeout = 1000;
                }
                return $q.reject(response);
            }
        };
    }]);
});

/**=========================================================
 * Module: access-login.js
 * Demo for login api
 =========================================================*/
// factory function to catch the exception and show messages

myApp.controller('LoginFormController', ["$rootScope", '$scope', '$state', '$http', '$injector', '$timeout', 'toaster', 'ngDialog', 'Auth', function ($rootScope, $scope, $state, $http, $injector, $timeout, toaster, ngDialog, Auth) {

    //including regex file
    //var regx = require('regex.json');
    // bind here all data from the form
    // $rootScope.app.layout.isBodyColor = true;
    $scope.credentials = {
        user_name: '',
        password: ''
    };

    // place the message if something goes wrong
    $scope.authMsg = '';
    $scope.flagSignin = false;

    $scope.login = function () {
        //console.log(Auth);  console.log($rootScope);return;
        $scope.flagSignin = true;
        // console.log(f$lagSignin);
        // console.log(window.location.search);
        var strArray = (window.location.search).split("?customer=");
        // console.log(window.location);
        // console.log(strArray);              
        $scope.credentials.cust = strArray[1];
        $rootScope.login = false;

        Auth.login($scope.credentials)
            .then(function (result) {
                $scope.flagSignin = false;

                if (result.data.ack === 2) {
                    $rootScope.login = false;
                    $scope.authMsg = 'Unautorized Login! Please contact to your Silverow Administrator.';
                }
                else if (result.data.ack === 3) {
                    $rootScope.login = false;
                    $scope.authMsg = 'No roles assigned.';
                }
                else if (result.data.ack === 4) { // password expired
                    $rootScope.login = false;
                    $scope.authMsg = 'Password is expired. Please reset your password.';
                }
                else if (result.data.ack === 0) {
                    $rootScope.login = false;

                    if (result.data.password_attempts != undefined) {
                        $scope.authMsg = 'You have ' + (Number(result.data.account_lock_attempts) - Number(result.data.password_attempts)) + ' attempts left for login';
                    }
                    else if (result.data.account_locked != undefined) {
                        $scope.authMsg = result.data.account_lock_attempts + ' unsuccessful attempts for login, Your account is temproray locked, please contact your administrator.';
                    }
                    else
                        $scope.authMsg = result.data.error;//'Incorrect credentials.';
                }
                else {
                    var t = 0
                    var twarning_1 = '';
                    var twarning_2 = '';

                    if (result.data.ack === 5) { // less than 2 weeks left to reset, or 30 days grace period
                        twarning_1 = result.data.error;
                        // twarning_2 = 'Your account will be automatically logged out from other systems';
                        // toaster.pop('warning', 'Warning', result.data.error);
                        // toaster.pop('warning', 'Warning', 'Your account will be automatically logged out from other systems');
                        // t = 2000;
                    }
                    else {
                        // twarning_1 = 'Your account will be automatically logged out from other systems';
                        // toaster.pop('warning', 'Warning', 'Your account will be automatically logged out from other systems');
                        // t = 2000;
                    }

                    $rootScope.userForPortal = 0;

                    if (result.data.response.user_name == 'Bia.shan@gmail.com') {
                        $rootScope.userForPortal = 1;
                        var strArray = (window.location.search).split("?customer=");
                        // console.log(window.location);
                        // console.log(strArray);
                        $rootScope.selCust = strArray[1];
                    }

                    // $timeout(function () {
                    $rootScope.login = true;
                    $rootScope.$storage.setItem("currentUser", result.data.response.user_name);
                    $rootScope.$storage.setItem("known_as", result.data.response.known_as);
                    $rootScope.$storage.setItem("company_name", result.data.response.company_name);
                    $rootScope.$storage.setItem("userId", result.data.response.id);
                    $rootScope.$storage.setItem("token", result.data.response.token);
                    $rootScope.$storage.setItem("country_id", result.data.response.country_id);
                    $rootScope.$storage.setItem("currency_id", result.data.response.currency_id);
                    $rootScope.$storage.setItem("date_format", result.data.response.date_format);
                    $rootScope.$storage.setItem("time_format", result.data.response.time_format);
                    $rootScope.$storage.setItem("timezone", result.data.response.timezone);
                    $rootScope.$storage.setItem("company_id", result.data.response.company_id);
                    $rootScope.$storage.setItem("company_logo", result.data.response.company_logo);
                    $rootScope.$storage.setItem("decimal_range", result.data.response.decimal_range);
                    $rootScope.$storage.setItem("opp_cycle_limit", result.data.response.opp_cycle_limit);
                    $rootScope.$storage.setItem("text_limit", result.data.response.text_limit);
                    $rootScope.$storage.setItem("currency_code", result.data.response.currency_code);
                    $rootScope.$storage.setItem("user_name", result.data.response.user);
                    $rootScope.$storage.setItem("user", result.data.response.user);
                    $rootScope.$storage.setItem("company_logo_width", result.data.response.company_logo_width);
                    $rootScope.$storage.setItem("company_logo_height", result.data.response.company_logo_height);
                    $rootScope.first_user_name = result.data.response.user;
                    $rootScope.defaultLogo = result.data.response.company_logo;
                    $rootScope.company_logo_width = result.data.response.company_logo_width;
                    $rootScope.company_logo_height = result.data.response.company_logo_height;
                    $rootScope.$storage.setItem("user_type", result.data.response.user_type);
                    $rootScope.$storage.setItem("deparment", result.data.response.deparment);
                    $rootScope.$storage.setItem("oop_cycle_edit_role", result.data.response.oop_cycle_edit_role);
                    $rootScope.$storage.setItem("oppCycleFreqstartmonth", result.data.response.oppCycleFreqstartmonth);
                    $rootScope.$storage.setItem("show_sales_add_btn", result.data.response.show_sales_add_btn);
                    $rootScope.$storage.setItem("show_customer_add_btn", result.data.response.show_customer_add_btn);
                    $rootScope.$storage.setItem("show_supplier_add_btn", result.data.response.show_supplier_add_btn);
                    $rootScope.$storage.setItem("selCust", $rootScope.selCust);
                    $rootScope.$storage.setItem("userForPortal", $rootScope.userForPortal);
                    $rootScope.$storage.setItem('new_data', JSON.stringify(result.data.new_data));
                    $rootScope.$storage.setItem('defualt_array', JSON.stringify(result.data.defualt_array));

                    $http
                        .get("app/js/regex.json")
                        .then(function (res) {
                            $rootScope.$storage.setItem('regx', JSON.stringify(res.data[0]));
                        });

                    // var d = new Date();
                    // var n = d.getTime();  //n in ms
                    // $rootScope.idleEndTime = n+(10*1000); //set end time to 10 min from now 10*60*1000
                    // $(document).find('body').on('click keydown DOMMouseScroll mousewheel mousedown touchstart', $rootScope.checkAndResetIdle);
                    // // $rootScope.time_expire_limit = 1440*1000;//6000000;
                    // // $scope.time_expire_limit = 1380*1000;
                    // $rootScope.checkAndResetIdle();
                    // console.log("State", window.current_state);
                    // console.log("State Params", window.current_state_params);

                    if (window.current_state != undefined && window.current_state.name.length > 0 && window.current_activity_user_name == result.data.response.user_name) {
                        $rootScope.session_expiry_message = "";
                        window.current_activity_user_name = "";
                        // $state.go(window.current_state.name, window.current_state_params);
                    }
                    else {
                        $rootScope.session_expiry_message = "";
                        window.current_activity_user_name = "";
                    }

                    var _temp = ({ 'warning_1': twarning_1, 'warning_2': twarning_2 });

                    if ($rootScope.userForPortal == 1)
                        $state.go('app.customerPortal');
                    else
                        $state.go('app.dashboard', { obj: _temp });
                    // }, t);
                }
            },
            function (x) {
                $scope.authMsg = 'Server Request Error';
            });
    };

    $scope.itemClick = function (id) {
        $state.go("app.edit_account_setting", {
            id: id
        });
    };

    $scope.getCompanies = function () {
        return;
        $rootScope.arrCompanies = {};
        var getComp = $rootScope.setup + 'general/get-companies-by-parent-id';
        var parent_id = $rootScope.defaultCompany;
        
        if (parent_id > 0) {

            $http
                .post(getComp, {
                    parent_id: parent_id,
                    token: $rootScope.token
                })
                .then(function (res) {
                    $rootScope.arrCompanies = res.data.response;
                });
        }
    }

    $scope.setCompany = function (id) {
        var getComp = $rootScope.setup + 'general/get-company';

        $http
            .post(getComp, {
                id: id,
                set_defaut_company: 1,
                token: $rootScope.token
            })
            .then(function (res) {
                $rootScope.$storage.setItem("company_id", res.data.response.id);
                $rootScope.$storage.setItem("company_logo", res.data.response.logo);
                $rootScope.defaultCompany = res.data.response.id;
                $rootScope.defaultLogo = res.data.response.logo;
            });
    }

    $scope.getApplicationLimitations = function () {
        $rootScope.arrCompanies = {};
        var _applicationLimitaions = $rootScope.setup + 'general/application-limitations';

        $http
            .post(_applicationLimitaions, {
                token: $rootScope.token
            })
            .then(function (res) {
                if (res.data.response)
                    $rootScope.APPLICATION_LIMITATIONS = res.data.response[0];
            });
    }

    $scope.getApplicationLimitations();

    //Logout when Idle
    /* if(!$rootScope.login)
    {	
        var d = new Date();
        var n = d.getTime();  //n in ms
        $rootScope.idleEndTime = n+(10*1000); //set end time to 10 min from now 10*60*1000
        $(document).find('body').on('mousemove keydown DOMMouseScroll mousewheel mousedown touchstart', checkAndResetIdle);
    } 
    else
        $scope.logout(); */
    // function checkAndResetIdle() {

    $rootScope.forceLogout = () => {

        $(document).find('.ngdialog').hide();
        $(document).find('#modalToGoToTask').hide();
        $(document).find('body').off('click keydown DOMMouseScroll mousewheel mousedown touchstart'); //un-monitor events
        $rootScope.current_state = stateService.current;
        $rootScope.current_state_params = stateService.params;
        $rootScope.animateBulkEmail = false;
        $rootScope.animateBulkEmailText = '';
        // console.log("State", $rootScope.current_state);
        // console.log("State Params", $rootScope.current_state_params);
        $rootScope.session_expiry_message = "Your session has expired, Please Login again !";
        // $scope.logout();
        $rootScope.addLogoutTime();
        stateService.go('page.login');
    }

    $rootScope.checkAndResetIdle = function () {
        // console.log("still being calledddd");
        $scope.time_expire_limit = 1440 * 1000;//120*1000;//

        if ($scope.logout_timer)
            $timeout.cancel($scope.logout_timer);

        if ($scope.logoutBeforetimeExpires)
            $timeout.cancel($scope.logoutBeforetimeExpires);

        // $scope.time_expire_limit = 1380*1000;
        $scope.logout_timer = $timeout(function () {
            var stateService = $injector.get('$state');

            if (stateService.current.name != "page.login") {
                $(document).find('.ngdialog').hide();
                $(document).find('#modalToGoToTask').hide();
                $(document).find('body').off('click keydown DOMMouseScroll mousewheel mousedown touchstart'); //un-monitor events
                $rootScope.current_state = stateService.current;
                $rootScope.current_state_params = stateService.params;
                $rootScope.animateBulkEmail = false;
                $rootScope.animateBulkEmailText = '';
                // console.log("State",$rootScope.current_state);
                // console.log("State Params", $rootScope.current_state_params);
                $rootScope.session_expiry_message = "Your session has expired, Please Login again !";
                // $scope.logout();
                $rootScope.addLogoutTime();
                stateService.go('page.login');
            }
        }, $scope.time_expire_limit);

        $scope.logoutBeforetimeExpires = $timeout(function () {
            var stateService = $injector.get('$state');

            if (stateService.current.name != "page.login" && !($rootScope.confirmsel)) {
                // console.log('here it is');
                $rootScope.confirmsel = 1;
            }
        }, 1380 * 1000);// //60*1000 //

        /* var d = new Date();
        var n = d.getTime(); //n in ms

        if (n > $rootScope.idleEndTime) {
            $(document).find('body').off('mousemove keydown DOMMouseScroll mousewheel mousedown touchstart'); //un-monitor events
            console.log('expired');
            var stateService = $injector.get('$state');

            if(stateService.current.name != "page.login")
            {
                $rootScope.current_state = stateService.current;
                $rootScope.current_state_params = stateService.params;
                $rootScope.session_expiry_message = "Your session has expired, Please Login again !";
                // $scope.logout();
                stateService.go('page.login');
            }
            // $scope.logout();
        } //10 mints reset end time //10*60*1000    //6000000
        else
            $rootScope.idleEndTime = n + (10*1000); */
    }

    $scope.logout = function () {
        $rootScope.login = false;
        $rootScope.addLogoutTime();
        //make defualt root all variable null
        $rootScope.token = 0;

        for (var prop in $rootScope) {
            if (prop.substring(0, 1) !== '$') {
                delete $rootScope[prop];
            }
        }
        //$rootScope.$apply();
        //chat
        //$('.chatbox').css('display', 'none');
        //var url = "app/views/chat/chat.php?action=closechat";
        //$.post(url, {logout: 123}, function (data) {
        //});

        $rootScope.$storage.clear();
        $rootScope = undefined;
        // console.log('logout' + $rootScope);
        //$state.go('app.dashboard');
        // localstorage.clear();
        //sessionstorage.clear();
        location.reload();
    }

    $rootScope.addLogoutTime = function () {
        var postData = {
            token: $rootScope.token
        }
        var APIUrl = $rootScope.setup + "general/logout-time";
        var $httpPromise = $http
            .post(APIUrl, postData)
            .then(function (res) {
            });
    }
}]);

myApp.directive("input", function () {
    // this directive will set autocomplete attribute to "new-password" this will tell the browsers not to autofill content within that field..
    return {
        restrict: "E",
        link: function (scope, el, attrs) {
            if (el && el[0])
                el[0].setAttribute("autocomplete", "new-password");
        }
    };
});

myApp.directive("hideTab", function () {
    return function (scope, elm, attrs) {
        scope.$watch(function () {
            $(elm).css("display", "none");
        });
    };
});

myApp.directive('fileUpload', function () {
    return {
        scope: true, //create a new scope
        link: function (scope, el, attrs) {
            el.bind('change', function (event) {
                var files = event.target.files;
                //iterate files since 'multiple' may be specified on the element
                for (var i = 0; i < files.length; i++) {
                    //emit event upward
                    scope.$emit("fileSelected", {
                        file: files[i]
                    });
                }
            });
        }
    };
});

myApp.directive('dir', function ($compile, $parse) {
    return {
        restrict: 'E',
        link: function (scope, element, attr) {
            scope.$watch(attr.content, function () {
                element.html($parse(attr.content)(scope));
                $compile(element.contents())(scope);
            }, true);
        }
    }
})

/**=========================================================
 * Module: nestable.js
 * Initializes the nestable plugin
 =========================================================*/

myApp.directive('nestable', ["$timeout", function ($timeout) {
    return {
        restrict: 'A',
        scope: {
            'nestableControl': '='
        },
        controller: ["$scope", "$element", function ($scope, $element) {
            var options = $element.data();
            $timeout(function () {
                $element.nestable();
            });

            if ($scope.nestableControl) {
                var nest = $scope.nestableControl;
                nest.serialize = function () {
                    return $element.nestable('serialize');
                };
                nest.expandAll = runMethod('expandAll');
                nest.collapseAll = runMethod('collapseAll');

                $element.on('change', function () {
                    if (typeof nest.onchange === 'function')
                        $timeout(function () {
                            nest.onchange.apply(arguments);
                        });
                });
            }

            function runMethod(name) {
                return function () {
                    $element.nestable(name);
                };
            }
        }]
    };
}]);

myApp.directive("scrollHeightDetector", function () {
    return {
        restrict: "AEC",
        link: function (scope, element, attrs) {
            // here you can use element to get the height
            var height = element[0].scrollHeight;
        }
    }
});

myApp.directive('editInPlace', function () {
    return {
        restrict: 'E',
        scope: {
            value: '='
        },
        template: '<span class="todoName" ng-dblclick="edit()" ng-bind="value"></span><input class="todoField" ng-model="value" />',
        link: function ($scope, element, attrs) {

            // Let's get a reference to the input element, as we'll want to reference it.
            var inputElement = angular.element(element.children()[1]);

            // This directive should have a set class so we can style it.
            element.addClass('edit-in-place');

            // Initially, we're not editing.
            $scope.editing = false;

            // ng-dblclick handler to activate edit-in-place
            $scope.edit = function () {
                $scope.editing = true;
                // We control display through a class on the directive itself. See the CSS.
                element.addClass('active');
                // And we must focus the element.
                // `angular.element()` provides a chainable array, like jQuery so to access a native DOM function,
                // we have to reference the first element in the array.
                inputElement.focus();
            };

            // When we leave the input, we're done editing.
            inputElement.on("blur", function () {
                $scope.editing = false;
                element.removeClass('active');
            });
        }
    };
});

myApp.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});

myApp.filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

myApp.filter('sizeConverter', function () {
    return function (size, precision) {
        if (precision == 0 || precision == null) {
            precision = 1;
        }

        if (size == 0 || size == null) {
            return "";
        } 
        else if (!isNaN(size)) {
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            var posttxt = 0;

            if (size < 1024) {
                return Number(size) + " " + sizes[posttxt];
            }

            while (size >= 1024) {
                posttxt++;
                size = size / 1024;
            }
            var power = Math.pow(10, precision);
            var poweredVal = Math.ceil(size * power);
            size = poweredVal / power;
            return size + " " + sizes[posttxt];
        } else {
            console.log('Error: Not a number.');
            return "";
        }
    };
});

myApp.filter('fileIcon', function () {
    return function (file) {
        if (file == undefined)
            return;

        var arr_file = file.split('.');
        var file_ext = arr_file[1];
        var file_icon = '';

        if (file_ext == 'doc' || file_ext == 'docx')
            file_icon = '<em class="fa fa-file-word-o"></em>';

        if (file_ext == 'xls' || file_ext == 'xlsx')
            file_icon = '<em class="fa fa-file-excel-o"></em>';

        if (file_ext == 'ppt' || file_ext == 'pptx')
            file_icon = '<em class="fa fa-file-powerpoint-o"></em>';

        if (file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif' || file_ext == 'png' || file_ext == 'png')
            file_icon = '<em class="fa fa-file-image-o"></em>';

        if (file_ext == 'pdf')
            file_icon = '<em class="fa fa-file-pdf-o"></em>';

        if (file_ext == 'txt')
            file_icon = '<em class="fa fa-file-text-o"></em>';

        return file_icon;
    }
});

var counter = 1;
var formated_date = '';

myApp.filter('defaultFormat', function ($resource, $timeout) {
    return function (createDate) {
        var arrDateTime = createDate.split(' ');
        var year = '';
        var month = '';
        var day = '';
        var time = '';

        if (arrDateTime.length > 1) {
            var arrDate = arrDateTime[0].split('-');
            year = arrDate[0];
            month = arrDate[1];
            day = arrDate[2];
            time = ' ' + arrDateTime[1];
        } else {
            var arrDate = arrDateTime.split('-');
            year = arrDate[0];
            month = arrDate[1];
            day = arrDate[2];
        }

        return day + '/' + month + '/' + year + time;
    };
});

myApp.directive("dropdown", function () {
    return {
        restrict: 'A',
        link: function (scope) {
            scope.showDropdown = function () {
                if (scope.showList) {
                    scope.showList = false;
                    scope.overlay = false;
                } else {
                    scope.showList = true;
                    scope.overlay = true;
                }
            }
        }
    }
});

myApp.directive('dropdownOptions', function () {
    return {
        restrict: 'A',
        transclude: true,
        link: function (scope, element, attrs) {
            scope.selectItem = function (car) {
                scope.rec.country_ids = car;
                scope.showList = false;
                scope.overlay = false;
            }
        }
    }
});

myApp.filter('limitStr', function () {
    return function (value, wordwise, max, tail) {
        if (!value)
            return '';

        max = parseInt(max, 10);

        if (!max)
            return value;

        if (value.length <= max)
            return value;

        value = value.substr(0, max);

        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }
        return value + (tail || '...'); //'…'
    };
});

myApp.filter('mysplit', function () {
    return function (data, sep) {
        return data.split(sep);
    }
});

myApp.filter('mysplitw', function () {
    return function (data, sep) {
        return data.split(sep);
    }
});

myApp.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var itemMatches = false;
                var keys = Object.keys(props);

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }
        return out;
    };
});

myApp.filter('startPaginationFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

/* limitedFilter filter will allow the use of angular filter only on the specified fields */
myApp.filter('limitedFilter', function () {
    return function (input, filter, limitedFields) {
        // input            =   the data set
        // filter           =   the search query
        // limitedFields    =   specified fields to be filtered in form of array e.g. ["name", "code"]
        /* template:    <tr ng-repeat="gl in gl_account | limitedFilter:filterGL.search:['code','name']" 
                                            ng-click="assignCodesOpeningBalanceGl(gl);">
                                            <td style="    width: 15%;">{{gl.code}}</td>
                                            <td>{{gl.name}}</td>
                                        </tr>
                                        */
        var re = new RegExp(filter, 'i');
        var filtered = [];
        var flag = false;

        angular.forEach(input, function (obj) {
            flag = false;
            for (var i = 0; i < limitedFields.length; i++) {
                if (re.test(obj[limitedFields[i]])) {
                    flag = true;
                }
            }

            if (flag) {
                filtered.push(obj)
            }
        })
        if (filtered.length) {
            return filtered;
        }
        else {
            return true;
        }
    }
});

// Setup the filter
myApp.filter('flexiFilter', function () {
    // Create the return function and set the required parameter name to **input**
    return function (input, query) {
        var filtered = [];
        function checkProperties(obj) {
            for (var key in obj) {
                if (obj[key] !== null && obj[key] != "")
                    return false;
            }
            return true;
        }

        if (typeof query == "undefined" || typeof input == "undefined") {
            return true;
        }

        if (Object.keys(query).length <= 0 || checkProperties(query)) {
            return input;
        }
        // Using the angular.forEach method, go through the array of data and perform the operation of figuring out if the language is statically or dynamically typed.
        angular.forEach(input, function (obj) {
            var flag = 0;
            var queryParams = 0;
            for (var p in query) {
                try {
                    if (query.hasOwnProperty(p)) {
                        //console.log(typeof query[p]);
                        if (typeof query[p] == "string") {
                            if (query[p] != "")
                                queryParams++;

                            if (obj[p] != null && obj.id != undefined) {
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
            if (flag == queryParams)
                filtered.push(obj);
        });
        return filtered;
    };
});

// filter added by akhtar nawaz
myApp.filter('myDateFilter', ['$filter',
    function ($filter) {
        return function (input) {
            var inp = new Date(0, 0, 0, 0, input, 0); // assumes minutes as an input
            var m = inp.getMinutes();
            var h = inp.getHours();
            var d = inp.getDay();
            return d + 'd ' + h + 'h ' + m + 'm ';
        }
    }
]);

myApp.directive('checklistModel', ['$parse', '$compile', function ($parse, $compile) {
    // contains
    function contains(arr, item, comparator) {
        if (angular.isArray(arr)) {
            for (var i = arr.length; i--;) {
                if (comparator(arr[i], item)) {
                    return true;
                }
            }
        }
        return false;
    }

    // add
    function add(arr, item, comparator) {
        arr = angular.isArray(arr) ? arr : [];
        if (!contains(arr, item, comparator)) {
            arr.push(item);
        }
        return arr;
    }

    // remove
    function remove(arr, item, comparator) {
        if (angular.isArray(arr)) {
            for (var i = arr.length; i--;) {
                if (comparator(arr[i], item)) {
                    arr.splice(i, 1);
                    break;
                }
            }
        }
        return arr;
    }

    // http://stackoverflow.com/a/19228302/1458162

    function postLinkFn(scope, elem, attrs) {
        // exclude recursion, but still keep the model
        var checklistModel = attrs.checklistModel;
        attrs.$set("checklistModel", null);
        // compile with `ng-model` pointing to `checked`
        $compile(elem)(scope);
        attrs.$set("checklistModel", checklistModel);

        // getter for original model
        var checklistModelGetter = $parse(checklistModel);
        var checklistChange = $parse(attrs.checklistChange);
        var checklistBeforeChange = $parse(attrs.checklistBeforeChange);
        var ngModelGetter = $parse(attrs.ngModel);
        var comparator = angular.equals;

        if (attrs.hasOwnProperty('checklistComparator')) {
            if (attrs.checklistComparator[0] == '.') {
                var comparatorExpression = attrs.checklistComparator.substring(1);
                comparator = function (a, b) {
                    return a[comparatorExpression] === b[comparatorExpression];
                };
            } else {
                comparator = $parse(attrs.checklistComparator)(scope.$parent);
            }
        }

        // watch UI checked change
        scope.$watch(attrs.ngModel, function (newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }

            if (checklistBeforeChange && (checklistBeforeChange(scope) === false)) {
                ngModelGetter.assign(scope, contains(checklistModelGetter(scope.$parent), getChecklistValue(), comparator));
                return;
            }

            setValueInChecklistModel(getChecklistValue(), newValue);

            if (checklistChange) {
                checklistChange(scope);
            }
        });

        // watches for value change of checklistValue (Credit to @blingerson)
        scope.$watch(getChecklistValue, function (newValue, oldValue) {
            if (newValue != oldValue && angular.isDefined(oldValue) && scope[attrs.ngModel] === true) {
                var current = checklistModelGetter(scope.$parent);
                checklistModelGetter.assign(scope.$parent, remove(current, oldValue, comparator));
                checklistModelGetter.assign(scope.$parent, add(current, newValue, comparator));
            }
        });

        function getChecklistValue() {
            return attrs.checklistValue ? $parse(attrs.checklistValue)(scope.$parent) : attrs.value;
        }

        function setValueInChecklistModel(value, checked) {
            var current = checklistModelGetter(scope.$parent);
            if (angular.isFunction(checklistModelGetter.assign)) {
                if (checked === true) {
                    checklistModelGetter.assign(scope.$parent, add(current, value, comparator));
                } else {
                    checklistModelGetter.assign(scope.$parent, remove(current, value, comparator));
                }
            }
        }

        // declare one function to be used for both $watch functions
        function setChecked(newArr, oldArr) {
            if (checklistBeforeChange && (checklistBeforeChange(scope) === false)) {
                setValueInChecklistModel(getChecklistValue(), ngModelGetter(scope));
                return;
            }
            ngModelGetter.assign(scope, contains(newArr, getChecklistValue(), comparator));
        }

        // watch original model change
        // use the faster $watchCollection method if it's available
        if (angular.isFunction(scope.$parent.$watchCollection)) {
            scope.$parent.$watchCollection(checklistModel, setChecked);
        } else {
            scope.$parent.$watch(checklistModel, setChecked, true);
        }
    }

    return {
        restrict: 'A',
        priority: 1000,
        terminal: true,
        scope: true,
        compile: function (tElement, tAttrs) {
            if (!tAttrs.checklistValue && !tAttrs.value) {
                throw 'You should provide `value` or `checklist-value`.';
            }

            // by default ngModel is 'checked', so we set it if not specified
            if (!tAttrs.ngModel) {
                // local scope var storing individual checkbox model
                tAttrs.$set("ngModel", "checked");
            }
            return postLinkFn;
        }
    };
}]);

myApp.filter('numberNoDecimalsIfZeroFilter', function ($filter) {
    return function (value, fractionSize, symbol) {
        //If has  no decimals, then don't show
        if (value == null || value == 0)
            return 0;

        var setSymbol = '';

        if (value % 1 === 0) {
            fractionSize = 0;
        }

        // var tempValue = $filter('number')(value, fractionSize);
        var tempValue = Number(value).toFixed(fractionSize);
        tempValue = tempValue < 0 ? `(${Math.abs(tempValue)})` : tempValue;
        //tempValue = tempValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        if (fractionSize == 5)
            tempValue = tempValue.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        else
            tempValue = tempValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return tempValue + setSymbol;
        /* if (value != '++ Add New ++') {
            setSymbol = ' ' + symbol;     
            return $filter('number')(value, fractionSize) + setSymbol;
        } else {
            return value;
        } */
    }
});

myApp.filter('quantityNum', function ($filter) {
    return function (value, fractionSize, symbol) {
        //If has  no decimals, then don't show
        if (value == null || value == 0)
            return 0;

        var setSymbol = '';

        if (value % 1 === 0) {
            fractionSize = 0;
        }

        var tempValue = parseFloat(value).toFixed(fractionSize);
        tempValue = tempValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        // var tempValue = $filter('number')(value, fractionSize);
        tempValue = tempValue < 0 ? `(${Math.abs(tempValue).toFixed(2)})` : tempValue;
        return tempValue + setSymbol;
    }
});

myApp.filter('uomfilter', function () {
    return function (input) {
        var output = inputText.replace(/\'/g, '').split(/(\d+)/).filter(Boolean);
        return output[0] + "&sup" + output[1] + ";"
    }
});

myApp.filter('unitPriceFilter', function ($filter) {
    return function (Price) {
        //If has no decimals, then don't show
        if (Price == null || Price == 0)
            return 0;
        // return '';
        var negAmount = 0;

        if (Price < 0) {
            Price = (-1) * Price;
            negAmount = 1;
        }

        var decimalPart = Price - Math.floor(Price);
        var numericPart = Math.floor(Price);
        var num = parseFloat(decimalPart).toFixed(5);

        var digits = [];

        while (num > 0) {
            digits[digits.length] = num % 10;
            num = parseInt(num / 10);
        }

        if (digits[0] != undefined) {
            var ret2 = parseFloat(numericPart) + parseFloat(digits[0]);

            if (negAmount > 0)
                ret2 = (-1) * ret2;

            // var retValue = ret2.toLocaleString('en', { minimumFractionDigits: 5 });  
            // var retValue = ret2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "");  
            var retValue = Number(ret2.toFixed(5));
            retValue = retValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "");
        }
        else {
            if (negAmount > 0)
                numericPart = (-1) * numericPart;

            var retValue = numericPart.toLocaleString('en') + '.00';
            // var retValue = parseFloat(numericPart).toFixed(2);
        }
        // digits.reverse();
        // console.log(retValue);
        // if(negAmount>0) retValue = (-1)*retValue;
        return retValue;
    }
});

myApp.directive('format', function ($filter) {
    'use strict';

    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) {
                return;
            }

            ctrl.$formatters.unshift(function () {
                return $filter('number')(ctrl.$modelValue);
            });

            ctrl.$parsers.unshift(function (viewValue) {
                var plainNumber = viewValue.replace(/[\,\.]/g, ''),
                    b = $filter('number')(plainNumber);

                elem.val(b);
                return plainNumber;
            });
        }
    };
});

myApp.filter('totalSumPriceQty', function () {
    return function (data, key1, key2) {

        if (angular.isUndefined(data) && angular.isUndefined(key1) && angular.isUndefined(key2))
            return 0;

        var sum = 0;

        angular.forEach(data, function (v, k) {
            sum = sum + (parseInt(v[key1]) * parseInt(v[key2]));
        });
        return sum;
    }
});

myApp.filter('sumOfValue', function () {

    return function (data, key) {

        if (angular.isUndefined(data) && angular.isUndefined(key))

            return 0;

        var sum = 0;



        angular.forEach(data, function (v, k) {

            sum = sum + parseInt(v[key]);

        });

        return sum;

    }

})

App.filter('customSearch', [function () {
    /** @data is the original data**/
    /** @skill is the search query for skill**/
    /** @status is the search query for status**/
    return function (data, skill, status) {
        var output = []; // store result in this

        /**@case1 if both searches are present**/
        if (!!skill && !!status) {
            skill = skill.toLowerCase();
            status = status.toLowerCase();
            //loop over the original array
            for (var i = 0; i < data.length; i++) {
                // check if any result matching the search request
                if (data[i].skill.toLowerCase().indexOf(skill) !== -1 && data[i].status.toLowerCase().indexOf(status) !== -1) {
                    //push data into results array
                    output.push(data[i]);
                }
            }
        } else if (!!skill) {
            /**@case2 if only skill query is present**/
            skill = skill.toLowerCase();
            for (var i = 0; i < data.length; i++) {
                if (data[i].skill.toLowerCase().indexOf(skill) !== -1) {
                    output.push(data[i]);
                }
            }
        } else if (!!status) {
            /**@case3 if only status query is present**/
            status = status.toLowerCase();
            for (var i = 0; i < data.length; i++) {
                if (data[i].status.toLowerCase().indexOf(status) !== -1) {
                    output.push(data[i]);
                }
            }
        } else {
            /**@case4 no query is present**/
            output = data;
        }
        return output; // finally return the result
    }
}]);

myApp.filter('DecimalsIfZeroFilter', function ($filter) {
    return function (value, fractionSize, symbol) {
        //If has  no decimals, then don't show

        var decimal_legnth = 2;
        var number = value;
        var decimals = fractionSize;
        var dec_point = '.';
        var thousands_sep = ',';
        // *     example 1: number_format(1234.56);
        // *     returns 1: '1,235'
        // *     example 2: number_format(1234.56, 2, ',', ' ');
        // *     returns 2: '1 234,56'
        // *     example 3: number_format(1234.5678, 2, '.', '');
        // *     returns 3: '1234.57'
        // *     example 4: number_format(67, 2, ',', '.');
        // *     returns 4: '67,00'
        // *     example 5: number_format(1000);
        // *     returns 5: '1,000'
        // *     example 6: number_format(67.311, 2);
        // *     returns 6: '67.31'
        // *     example 7: number_format(1000.55, 1);
        // *     returns 7: '1,000.6'
        // *     example 8: number_format(67000, 5, ',', '.');
        // *     returns 8: '67.000,00000'
        // *     example 9: number_format(0.9, 0);
        // *     returns 9: '1'
        // *    example 10: number_format('1.20', 2);
        // *    returns 10: '1.20'
        // *    example 11: number_format('1.20', 4);
        // *    returns 11: '1.2000'
        // *    example 12: number_format('1.2000', 3);
        // *    returns 12: '1.200'
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            toFixedFix = function (n, prec) {
                // Fix for IE parseFloat(0.55).toFixed(0) = 0;
                var k = Math.pow(10, prec);
                return Math.round(n * k) / k;
            },
            s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split('.');

        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }

        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
        //alert(number_format(23231,2, '.', ','));
    };
});

myApp.directive('exampleDirective', function () {
    return {
        restrict: 'AECM',
        scope: {
            customerInfo: '=info'
            //  callback: '&set_document_internal',
        },
        link: function ($rootScope, scope, element, attrs) {
            // var num =0;
            //  num = scope.$eval(attrs.talknewname);
            //  console.log('number=', num);
            //if(num)set_document_internal(num,name); // calls exampleCallback()
            $rootScope.set_document_internal2 = function (id, name) { }
        },
        template: '<div class="dropdown ib" >{{customerInfo}}<button class="dte-btn dropdown-toggle" type="button" data-toggle="dropdown"><i class="dte-ico"></i></button> 	<ul class="dropdown-menu dte animated fadeIn"> 	<span ng-click="set_document_internal(customerInfo)"><i class="fa fa-file-text-o" aria-hidden="true"></i> Add Document</span> <span><i class="fa fa-check" aria-hidden="true"></i> Add Task</span> <span><i class="fa fa-envelope-o" aria-hidden="true"></i> Compose Email</span> 	</ul> 		</div> 			'
        // templateUrl: helper.basepath('dropdown.html'),
    };
});

myApp.service('flexiConfig', function () {

    this.tableConfig = [];

    this.addConfig = function (tableName, search, page) {
        this.removeConfig(tableName);

        for (var k in search) {
            if (search[k] == "" || k == "exportAsCSV") {
                delete search[k];
            }
        }
        if (Object.keys(search).length == 0) {
            search = null;
        }
        this.tableConfig.push({
            tableName: tableName,
            search: search,
            page: page
        });
    }

    this.getConfig = function (tableName) {
        var foundObj = {};
        foundObj.found = false;
        angular.forEach(this.tableConfig, function (obj) {
            if (obj.tableName == tableName) {
                foundObj = obj;
                foundObj.found = true;
                return;
            }
        })
        return foundObj;
    }

    this.removeConfig = function (tableName) {
        var tableConfig = this.tableConfig;
        if (tableConfig != undefined) {
            angular.forEach(tableConfig, function (obj, i) {
                if (obj.tableName == tableName) {
                    tableConfig.splice(i, 1);
                }
            })
        }
    }
});

//  app.service('service2',['service1', function(service1) {}]);

myApp.service("Email", ["$http", "$rootScope", function (e, $rootScope, t) {
    this.mail = function (t) {
        t.token = $rootScope.token;
        var o = "api/communication/mail/sendmail";
        return e.post(o, t)
    }
    this.savemail = function (t) {
        t.token = $rootScope.token;
        var o = "api/communication/mail/savemail";
        return e.post(o, t)
    }
    this.getmail = function (t) {
        var o = "api/communication/mail/getmail";
        return e.post(o, t)
    }
    this.getsender = function (t) {
        var o = "api/communication/mail/sender";
        return e.post(o, t)
    }
    this.updateReadStatus = function (t) {
        var o = "api/communication/mail/updatereadstatus";
        return e.post(o, t)
    }
}])

myApp.service('fileAuthentication', ["$rootScope", "$http", function ($rootScope, $http) {
    this.getFile = function (params) {
        // https://silverow-dev.azurewebsites.net/api/setup/invoice?alpha=QThEdlhEMk1LQ29BRGJ4dmRtWVdId1VlVXRpQnRPVFE3NlplcjNRdXk1OD0=

        if (params.fileName == undefined) {
            return;
        }

        params.downloadName == params.downloadName ? params.downloadName : params.fileName;
        var postData = {
            token: $rootScope.token,
            fileName: params.fileName,
            report: params.report,
            downloadName: params.downloadName
        }

        var APIUrl = $rootScope.setup + "general/getRequestedFile";

        var $httpPromise = $http
            .post(APIUrl, postData)
            .then(function (res) {
                // console.log(res);
                // var pdf = 'data:application/octet-stream;base64,' + res.data.base64;
                var pdf = res.data.file_url;
                var hiddenElement = document.createElement('a');
                hiddenElement.href = pdf;
                // hiddenElement.target = '_blank'; // open in new tab
                hiddenElement.download = params.downloadName; // download
                hiddenElement.click();
            });

        return $httpPromise;
    }
}]);

myApp.service('generatePdf', ["$rootScope", "toaster", "$http", "serviceVariables", "fileAuthentication", function ($rootScope, toaster, $http, serviceVariables, fileAuthentication) {
    this.generatePdf = function (templateType, print_invoice_vals, dont_show_message, dontTriggerDownload) {

        var pdfInvoice = $rootScope.setup + "general/print-pdf-invoice";
        serviceVariables.generatedPDF = "";
        this.showLoader = true;
        var that = this;

        if (templateType == "salesDelivery") {

            var targetPdf = angular.element('#delivery_note_modal')[0].innerHTML;
            var tempIdName = '#delivery_note_modal';
            var fileName = "DLN." + print_invoice_vals.order_no + "." + print_invoice_vals.company_id;
            var type = 1;
            var attachmentsType = 2;

        } else if (templateType == "salesWarehouse") {

            var targetPdf = angular.element('#warehouse_instructions_modal')[0].innerHTML;
            var tempIdName = '#warehouse_instructions_modal';
            var fileName = "WHI." + print_invoice_vals.order_no + "." + print_invoice_vals.company_id;
            var type = 1;
            var attachmentsType = 2;

        } else if (templateType == "salesOrder") {

            var targetPdf = angular.element('#sales_order_modal')[0].innerHTML;
            var tempIdName = '#sales_order_modal';
            var fileName = "SO." + print_invoice_vals.order_no + "." + print_invoice_vals.company_id;
            var type = 1;
            var attachmentsType = 2;

        } else if (templateType == "salesQuote") {

            pdfInvoice = $rootScope.setup + "general/email-pdf-document";
            var targetPdf = angular.element('#sales_order_modal')[0].innerHTML;
            var tempIdName = '#sales_order_modal';
            var fileName = "SQ." + print_invoice_vals.quote_no + "." + print_invoice_vals.company_id;
            var type = 1;
            var attachmentsType = 2;

        } else if (templateType == "salesInvoice") {

            var targetPdf = angular.element('#sales_order_modal')[0].innerHTML;
            var tempIdName = '#sales_order_modal';
            var fileName = "SI." + print_invoice_vals.invoice_no + "." + print_invoice_vals.company_id;
            var type = 1;
            var attachmentsType = 2;

        } else if (templateType == "purchaseOrder") {

            var targetPdf = angular.element('#purchase_order_modal')[0].innerHTML;
            var tempIdName = '#purchase_order_modal';
            var fileName = "PO." + print_invoice_vals.order_no + "." + print_invoice_vals.company_id;
            var type = 2;
            var attachmentsType = 3;

        } else if (templateType == "purchaseDelivery") {

            var targetPdf = angular.element('#delivery_note_modal')[0].innerHTML;
            var tempIdName = '#delivery_note_modal';
            var fileName = "PO." + print_invoice_vals.order_no + "." + print_invoice_vals.company_id;
            var type = 2;
            var attachmentsType = 3;

        } else if (templateType == "purchaseWarehouse") {

            var targetPdf = angular.element('#warehouse_instructions_modal')[0].innerHTML;
            var tempIdName = '#warehouse_instructions_modal';
            var fileName = "PO." + print_invoice_vals.order_no + "." + print_invoice_vals.company_id;
            var type = 2;
            var attachmentsType = 3;

        } else if (templateType == "purchaseInvoice") {

            var targetPdf = angular.element('#purchase_invoice_modal')[0].innerHTML;
            var tempIdName = '#purchase_invoice_modal';
            var fileName = "PI." + print_invoice_vals.invoice_no + "." + print_invoice_vals.company_id;
            var type = 2;
            var attachmentsType = 3;

        } else if (templateType == "creditNote") {

            var targetPdf = angular.element('#credit_note_modal')[0].innerHTML;
            var tempIdName = '#credit_note_modal';
            var fileName = "CN." + print_invoice_vals.order_no + "." + print_invoice_vals.company_id;
            var type = 3;
            var attachmentsType = 4;

        } else if (templateType == "postedCreditNote") {

            var targetPdf = angular.element('#credit_note_modal')[0].innerHTML;
            var tempIdName = '#credit_note_modal';
            var fileName = "PCN." + print_invoice_vals.invoice_no + "." + print_invoice_vals.company_id;
            var type = 3;
            var attachmentsType = 4;

        } else if (templateType == "debitNote") {

            var targetPdf = angular.element('#debit_note_modal')[0].innerHTML;
            var tempIdName = '#debit_note_modal';
            var fileName = "DN." + print_invoice_vals.order_no + "." + print_invoice_vals.company_id;
            var type = 4;
            var attachmentsType = 5;

        } else if (templateType == "postedDebitNote") {

            var targetPdf = angular.element('#debit_note_modal')[0].innerHTML;
            var tempIdName = '#debit_note_modal';
            var fileName = "PDN." + print_invoice_vals.invoice_no + "." + print_invoice_vals.company_id;
            var type = 4;
            var attachmentsType = 5;

        } else if (templateType == "receiptNote") {

            pdfInvoice = $rootScope.setup + "general/email-pdf-document";
            var targetPdf = angular.element('#receipt_note_modal')[0].innerHTML;
            var tempIdName = '#receipt_note_modal';
            var fileName = "GRN." + print_invoice_vals.order_no + "." + print_invoice_vals.company_id;
            var type = 4;
            var attachmentsType = 5;
        }

        if (dontTriggerDownload) {
            document.querySelectorAll(tempIdName).forEach(e => e.parentNode.removeChild(e));
        }

        $rootScope.generatedTemplateName = fileName;
        // return console.log(type, attachmentsType);

        let currentUrl = window.location.href;
        let company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;

        return $http
            .post(pdfInvoice, { 'dataPdf': targetPdf, 'jsonData': print_invoice_vals, 'type': type, 'filename': fileName, token: $rootScope.token, 'doc_id': print_invoice_vals.doc_id, 'company_logo_url': company_logo_url, 'module': templateType, 'attachmentsType': attachmentsType })
            .then(function (res) {

                that.showLoader = false;

                if (res.data.ack == true) {
                    $rootScope.printinvoiceFlag = true;

                    if (!dontTriggerDownload) {
                        // console.log("getting file.....");
                        if (templateType == "salesDelivery" || templateType == "salesWarehouse") {

                            fileAuthentication.getFile({
                                fileName: fileName + '.pdf', 
                                downloadName: fileName + '.pdf'
                            })
                        }
                        else{
                            fileAuthentication.getFile({
                                fileName: fileName + '.pdf', downloadName:
                                fileName.split('.')[1] + '.pdf'
                            })                            
                        }
                    }

                    if (dont_show_message == undefined || Number(dont_show_message) == 1)
                        toaster.pop('success', 'Info', 'PDF Generated Successfully');

                    serviceVariables.generatedPDF = res.data.path;

                } else if (res.data.SQLack == false) {
                    // if (dont_show_message == undefined || Number(dont_show_message) == 1)
                    {
                        toaster.pop('warning', 'Important', 'PDF Generated Successfully');
                        toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(105));
                    }
                }
                else {
                    toaster.pop('error', 'Error', "PDF Not Generated");
                }
            });
    }

    this.genJSReport = function (templateType, print_invoice_vals, dont_show_message, dontTriggerDownload) {

        var pdfInvoice = $rootScope.setup + "general/print-js-report-pdf";
        serviceVariables.generatedPDF = "";
        this.showLoader = true;
        var that = this;

        if (templateType == "salesDelivery") {

            var targetPdf = angular.element('#delivery_note_modal')[0].innerHTML;
            var fileName = "DLN." + print_invoice_vals.order_no + "." + print_invoice_vals.company_id;
            var type = 1;
            var attachmentsType = 2;

        } else if (templateType == "salesWarehouse") {

            var targetPdf = angular.element('#warehouse_instructions_modal')[0].innerHTML;
            var fileName = "WHI." + print_invoice_vals.order_no + "." + print_invoice_vals.company_id;
            var type = 1;
            var attachmentsType = 2;

        } else if (templateType == "salesOrder") {

            var targetPdf = angular.element('#sales_order_modal')[0].innerHTML;
            var fileName = "SO." + print_invoice_vals.order_no + "." + print_invoice_vals.company_id;
            var type = 1;
            var attachmentsType = 2;

        } else if (templateType == "salesQuote") {

            var targetPdf = angular.element('#sales_order_modal')[0].innerHTML;
            var fileName = "SQ." + print_invoice_vals.quote_no + "." + print_invoice_vals.company_id;
            var type = 1;
            var attachmentsType = 2;

        } else if (templateType == "salesInvoice") {

            var targetPdf = angular.element('#sales_order_modal')[0].innerHTML;
            var fileName = "SI." + print_invoice_vals.invoice_no + "." + print_invoice_vals.company_id;
            var type = 1;
            var attachmentsType = 2;

        } else if (templateType == "purchaseOrder") {

            var targetPdf = angular.element('#purchase_order_modal')[0].innerHTML;
            var fileName = "PO." + print_invoice_vals.order_no + "." + print_invoice_vals.company_id;
            var type = 2;
            var attachmentsType = 3;

        } else if (templateType == "purchaseInvoice") {

            var targetPdf = angular.element('#purchase_order_modal')[0].innerHTML;
            var fileName = "PI." + print_invoice_vals.invoice_no + "." + print_invoice_vals.company_id;
            var type = 2;
            var attachmentsType = 3;

        } else if (templateType == "creditNote") {

            var targetPdf = angular.element('#credit_note_modal')[0].innerHTML;
            var fileName = "CN." + print_invoice_vals.order_no + "." + print_invoice_vals.company_id;
            var type = 3;
            var attachmentsType = 4;

        } else if (templateType == "postedCreditNote") {

            var targetPdf = angular.element('#credit_note_modal')[0].innerHTML;
            var fileName = "PCN." + print_invoice_vals.invoice_no + "." + print_invoice_vals.company_id;
            var type = 3;
            var attachmentsType = 4;

        } else if (templateType == "debitNote") {

            var targetPdf = angular.element('#debit_note_modal')[0].innerHTML;
            var fileName = "DN." + print_invoice_vals.order_no + "." + print_invoice_vals.company_id;
            var type = 4;
            var attachmentsType = 5;

        } else if (templateType == "postedDebitNote") {

            var targetPdf = angular.element('#debit_note_modal')[0].innerHTML;
            var fileName = "PDN." + print_invoice_vals.invoice_no + "." + print_invoice_vals.company_id;
            var type = 4;
            var attachmentsType = 5;
        }

        $rootScope.generatedTemplateName = fileName;
        
        $http
            .post(pdfInvoice, {
                'emailOrderList': $scope.emailOrderList,
                'module': 'SalesInvoices',
                'Option': 'saveAsPdf',
                'OptionType': 1,
                'company_logo_url': $scope.company_logo_url,
                'token': $scope.$root.token
            })
            .then(function (res) {

                $rootScope.animateBulkEmail = false;
                $rootScope.animateBulkEmailText = '';

                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', 'PDF(s) Generated Successfully.');

                    angular.forEach(res.data.PdfLinks, function (rec) {
                        window.open(rec, '_blank');
                    });
                }
                else {
                    toaster.pop('error', 'Info', "PDF(s) Generation Failed.");
                }
            });
    }
}]);

myApp.service('emailConfig', ["$q", "Email", "$rootScope", "toaster", "$http", function ($q, Email, $rootScope, toaster, $http) {

    this.email = {};
    this.globalVars = {};
    this.globalVars.showEmailLoader = false;

    this.emailConfigurations = [
        {
            name: "SalesOrder",
            sender: "ahmad.hassan@silverow.com",
            subject: "Sales Order: [[sale_order_code]]",
            body: "Hello [[sell_to_cust_name]], <br/> Your Customer Code is [[sell_to_cust_no]] and your Order Code is [[sale_order_code]]....",
            fileName: "SO.[[sale_order_code]].pdf"
        },
        {
            name: "PurchaseOrder",
            sender: "purchases@navson.com",
            subject: "Purchase Order: [[order_code]]",
            body: "Hello [[sell_to_cust_name]], This is a purchase order..[[cust_email]]"
        }
    ]

    this.getEmails = function () {

        this.email.composeIntEmail = 2;
        this.email.readEmail = 2;
        this.email.replyEmail = 0;

        Email.getmail(this.email).then(function (response) {
            // console.log("response of get email : ", response);
            this.inbox = response.data;
            // console.log("response inbox : ", this.inbox);
        })
    }

    this.updateDefaultEmail = function (template_name, userEmail) {
        var updateUserEmailURL = $rootScope.setup + "general/updateUserEmail";

        var postData = { 'token': $rootScope.token, template_name: template_name, userEmail: userEmail };

        var $httpPromise = $http
            .post(updateUserEmailURL, postData)
            .then(function (res) {

                if (res.data.ack) {
                    return this.emailTemplate;
                }
            });

        return $httpPromise;
    }

    this.getEmailConfig = function (moduleName) {

        this.emailTemplate = {};
        var getJSONUrl = $rootScope.setup + "general/get-email-JSON";

        if (moduleName == "Sales_SalesPerforma") {
            moduleName = "Sales_SalesQuotes";
        }

        var postData = { 'token': $rootScope.token, templateName: moduleName.split("_")[1], mainModule: moduleName.split("_")[0] };

        var $httpPromise = $http
            .post(getJSONUrl, postData)
            .then(function (res) {

                if (res.data.ack || res.data.userEmailConfigurations) {

                    this.emailTemplate = {};

                    if (res.data.template) {
                        this.emailTemplate = res.data.template;
                        this.emailTemplate.defaultEmail = res.data.default_email;
                    }

                    this.emailTemplate.defaultEmail = res.data.default_email;

                    angular.forEach(res.data.virtualEmails.response, function (obj) {
                        
                        if (this.emailTemplate.senderEmail == obj.id) {
                            var tempObj = {};
                            tempObj.id = obj.id;
                            tempObj.username = obj.username;
                            this.emailTemplate.senderEmail = tempObj;
                            return false;
                        }
                    });

                    return this.emailTemplate;
                }
            });

        return $httpPromise;
    }

    this.openEmail = function () {

        this.email.readEmail = 1;
        this.inbox.selected = this.x;
        // console.log("open Email function ", this.inbox.selected);

        Email.updateReadStatus(this.inbox.selected).then(function (response) {
            console.log("response of update ReadStatus : ", response);
        })
    }

    this.getRecipients = function () {
        // console.log("in getRecipients function", this.rec);
        var ApiAjax = this.$root.sales + "crm/crm/alt-contacts";
        this.email.recipients = [];

        var primaryContact = {
            'name': this.rec.contact_person,
            'email': this.rec.cemail,
            'alreadySelected': 'no'
        }
        this.email.recipients.push(primaryContact);

        this.postData = {
            'column': 'crm_alt_contact.crm_id',
            'value': $stateParams.id,
            'module_type': $rootScope.CRMType,
            token: this.$root.token
        }

        $http
            .post(ApiAjax, this.postData)
            .then(function (res) {

                if (res.data.record.ack == true) {
                    for (var i = 0; i < res.data.record.result.length; i++) {
                        this.email.recipients[i + 1] = {};
                        this.email.recipients[i + 1].name = res.data.record.result[i].name;
                        this.email.recipients[i + 1].email = res.data.record.result[i].email;
                        this.email.recipients[i + 1].alreadySelected = 'no';
                    }
                } else {
                    console.log("not ack");
                }

            }).catch(function (message) {
                throw new Error(message.data);
                console.log(message.data);
            });
    }

    this.composeEmail = function () {

        this.email.composeIntEmail = 1;
        this.getRecipients();

        Email.getsender(this.email).then(function (response) {
            this.email.sender = response.data;
        })
    }

    this.endComposeMail = function () {

        this.email.composeIntEmail = 2;
        this.email.readEmail = 2;
        this.email.replyEmail = 0;
        this.getEmails();
    }

    this.saveAsDraft = function (from, to, additionalTo, cc, additionalCC, subject, body, attachment, recordId, recordName, moduleType, moduleId, moduleName, genericEmail, isDraft) {

        var deferred = $q.defer();
        this.email.from = from;

        if (to && to.length) {
            to = to.join(';');
        }

        if (cc && cc.length) {
            cc = cc.join(';');
        }

        if (cc.length == 0) {
            cc = "";
        }

        if (to.length == 0) {
            to = "";
        }

        this.email.to = to;
        this.email.cc = cc;
        this.email.subject = subject;
        this.email.body = body;
        this.email.attachment = attachment;
        this.email.recordId = recordId;
        this.email.recordName = recordName;
        this.email.moduleType = moduleType;
        this.email.moduleId = moduleId;
        this.email.moduleName = moduleName;
        this.email.genericEmail = genericEmail;
        this.email.draftEmail = true;
        this.email.isDraft = isDraft;
        this.email.sent = 0;
        var mailObj = this.email;
        var that = this;

        Email.savemail(mailObj).then(function (response) {

            that.globalVars.showEmailLoader = false;

            if (response.data.ack) {
                deferred.resolve({ success: true });
            }
            else {
                deferred.resolve({ success: false });
            }
        });

        return deferred.promise;
    }

    this.sendEmail = function (from, to, additionalTo, cc, additionalCC, subject, body, attachment, recordId, recordName, moduleType, moduleId, moduleName, genericEmail, isDraft) {

        // making additionalTo and additionalCC redundant just like Kia
        var deferred = $q.defer();
        this.email.from = from;

        if (to && to.length) {
            to = to.join(';');
        }

        if (cc && cc.length) {
            cc = cc.join(';');
        }

        if (cc.length == 0) {
            cc = "";
        }

        if (to.length == 0) {
            to = "";
        }

        this.email.to = to;
        this.email.cc = cc;
        this.email.subject = subject;
        this.email.body = body;
        this.email.attachment = [];
        this.email.attachmentAlias = [];

        if (attachment) {

            if (attachment.constructor.name.toLowerCase() == "object") {
                this.email.attachment = attachment.fileName;
                this.email.attachmentAlias = attachment.fileAlias;
            }
            else {
                this.email.attachment = attachment;
            }
        }

        this.email.recordId = recordId;
        this.email.recordName = recordName;
        this.email.moduleType = moduleType;
        this.email.moduleId = moduleId;
        this.email.moduleName = moduleName;
        this.email.genericEmail = genericEmail;
        this.email.isDraft = isDraft;
        var mailObj = this.email;
        this.globalVars.showEmailLoader = true;
        var that = this;

        Email.mail(mailObj).then(function (response) {

            var success = false;

            if (response.data.ack) {
                that.globalVars.showEmailLoader = false;

                if (response.data.noAttachment) {
                    toaster.pop('error', 'Error', response.data.attachmentError);
                    deferred.resolve({ success: false });
                }
                else {
                    success = true;
                    deferred.resolve({ success: true });
                }
            }
            else {
                if (response.data.configIssue) {
                    deferred.resolve({ success: false, configIssue: true, message: response.data.message });
                }
                else {
                    deferred.resolve({ success: false, message: response.data.message });
                }
            }

            that.globalVars.showEmailLoader = false;

            if (success) {
                mailObj.sent = true;

                Email.savemail(mailObj).then(function (response) {
                    return success;
                });
            }
        });

        return deferred.promise;
    } //end of sendemail function

    this.newEmailInList = function (tag) { // this is a functional created for ui-select to allow new value as input additional to the values inside array..
        var obj = {};
        obj.name = "";
        obj.email = tag;
        return obj;
    }

    this.attachmentUpload = function (file) {
        var q = $q.defer();
        Upload.upload({
            url: 'api/email/attachment',
            data: { file: file }
        }).then(function (resp) {
            // console.log('Response from upload', resp);
            this.email.attachmentPath.push(resp.data.file.path);
            q.resolve();
            // console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });

        return q.promise;
    };

    this.removeAttachment = function () {
        // console.log("remove attachment: ", this.x);
        for (var i = 0; i < this.email.attachment.length; i++) {
            if (this.x.name == this.email.attachment[i].name) {
                this.email.attachment.splice(i, 1);
            }
        }
    }

    this.onSelected = function (selectedItem) {
        // console.log("selected item is: ", selectedItem);
        for (var i = 0; i < this.email.recipients.length; i++) {
            if (this.email.recipients[i].email == selectedItem.email) {
                this.email.recipients[i].alreadySelected = 'yes';
                console.log("this.email.recipients[i].alreadySelected", this.email.recipients[i]);
            }
        }
    }

    this.copyAttachments = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                Upload.upload({ data: { file: files[i] } });
            }
        }
    }
}]);

/*	<div example-directive
 * info="item_gneral_tab_module"
 * class="custom_dropdown ib" example-number="{{item_gneral_tab_module}}"
 * example-function="set_document_internal(item_gneral_tab_module)"></div>
 */

myApp.directive('jqtimepicker', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            $(
                element.timepicker({
                    showLeadingZero: true,
                    showPeriod: true,
                    defaultTime: '05:00 PM',
                    timeFormat: 'HH:mm tt',
                    // custom hours and minutes
                    hours: {
                        starts: 0, // First displayed hour
                        ends: 23 // Last displayed hour //hour: '17',//{ starts: 6, ends: 19 },
                    },
                    minute: '00', //{ interval: 15 },
                    //   onSelect: tpStartSelect,
                    maxTime: {
                        hour: 24,
                        minute: 60
                    },
                    hourText: 'Hour',
                    minuteText: 'Minutes',
                    amPmText: ['AM', 'PM'],
                    //timeSeparator: 'h',
                    nowButtonText: 'Now',
                    showNowButton: true,
                    closeButtonText: 'Close',
                    showCloseButton: true,
                    deselectButtonText: 'Clear',
                    showDeselectButton: true,
                    showPeriodLabels: true
                })
            );
        }
    }
});

/*
 defaultTime: '',  // removes the highlighted time for when the input is empty.
 // rows: 3,*/

myApp.directive('jqdatepicker', function ($timeout) {
    return {
        restrict: 'A',
        scope: {
            date: '=ngModel',
            minDate: "@",
            maxDate: "@"
        },
        transclude: true,
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            // in flexi table filters where there are multiple date filter fields
            // we have to give dynamic ids to date fields otherwise it will add the date
            // to the first field always
            // this datepicker doesn't recognize the dynamic ids but adding $timeout with
            // no time and adding the transclude property to true will give it 
            // enough time to recognize the date elements and distinguish between 
            // eachother. It works fine now after these 2 mods. Done by Ahmad
            $timeout(function () {
                $(
                    element.datepicker({
                        duration: "fast",
                        firstDay: 1,
                        yearRange: '-90:+10', //'1999:2020',
                        defaultDate: null,
                        showOn: 'focus',
                        closeText: 'Clear',
                        minDate: scope.minDate ? new Date(scope.minDate.split("-")[1] + "-" + scope.minDate.split("-")[0] + "-" + scope.minDate.split("-")[2]) : "",
                        maxDate: scope.maxDate ? new Date(scope.maxDate.split("-")[1] + "-" + scope.maxDate.split("-")[0] + "-" + scope.maxDate.split("-")[2]) : "",
                        onClose: function () {
                            var event = arguments.callee.caller.caller.arguments[0];
                            if ($(event.delegateTarget).hasClass('ui-datepicker-close')) {
                                // below lines added by Ahmad to clear out the value of the date picker
                                // when the click is triggered on the clear button..
                                scope.$apply(function () {
                                    scope.date = "";
                                });
                            }
                        },
                        changeMonth: true,
                        changeYear: true,
                        dateFormat: 'dd/mm/yy',
                        autoSize: true,
                        showButtonPanel: true,
                        gotoCurrent: true,
                    })
                );
            });
        }
    }
});

myApp.factory('superCache', ['$cacheFactory', function ($cacheFactory) {
    return $cacheFactory('super-cache');
}]);

// factory function to catch the exception and show messages

myApp.factory("$exceptionHandler", function () {
    return function (exception, cause) {

        console.log("Exception   ", exception);
        console.log("Cause ", cause);
    }
});

// Directive for Making Modal dragable
myApp.directive('dragable', function () {
    return {
        restrict: 'EA',
        link: function (scope, element) {
            element.draggable();
        }
    }
});

myApp.filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            if (!isNaN(start)) {
                angular.forEach(input, function (month, index) {
                    month.id = (((index - (start - 1) + 12)) % 12) + 1;
                });
            }
            return input;
        }
        return [];
    }
});

//let's make a startFromGL filter
myApp.filter('startFromGL', function () {
    return function (input, start) {
        start = +start; //parse to int
        if (input != undefined)
            return input.slice(start);
        else
            return;
    }
});

myApp.filter('dateRange', function () {
    return function (items, startDate, endDate) {
        var retArray = [];

        if (startDate != undefined) {
            var ST = startDate.split("/");
            var newDate = new Date(ST[2], ST[1] - 1, ST[0]);
            var start_date = newDate.getTime() / 1000;
        }

        if (endDate != undefined) {
            var ED = endDate.split("/");
            var newDate = new Date(ED[2], ED[1] - 1, ED[0]);
            var end_date = newDate.getTime() / 1000;
        }

        if ((startDate == undefined && endDate == undefined) ||
            (startDate == "" && endDate == undefined) ||
            (startDate == undefined && endDate == "") ||
            (startDate == "" && endDate == "")) {
            return items;
        }

        if (start_date > 0 && !(end_date > 0)) {
            angular.forEach(items, function (value) {
                var VD = value.date.split("/");
                var newDate = new Date(VD[2], VD[1] - 1, VD[0]);
                var date = newDate.getTime() / 1000;

                if (date > start_date) {
                    retArray.push(value);
                }
            });
        }
        else if (!(start_date > 0) && end_date > 0) {
            angular.forEach(items, function (value) {
                var VD = value.date.split("/");
                var newDate = new Date(VD[2], VD[1] - 1, VD[0]);
                var date = newDate.getTime() / 1000;

                if (end_date > date) {
                    retArray.push(value);
                }
            });
        }
        else if (start_date > 0 && end_date > 0) {
            angular.forEach(items, function (value) {
                var VD = value.date.split("/");
                var newDate = new Date(VD[2], VD[1] - 1, VD[0]);
                var date = newDate.getTime() / 1000;

                if (date > start_date && end_date > date) {
                    retArray.push(value);
                }
            });
        }
        return retArray;
    }
});

myApp.filter("stockSheetDateRange", function () {

    return function (items, startDate, endDate) {
        var df = startDate;
        var dt = endDate;

        if ((startDate == '' && endDate == '') || startDate == undefined || endDate == undefined) {
            return items;
        }

        var result = [];

        for (var i = 0; i < items.length; i++) {
            // var date2 = new Date(items[i].date);
            var date2 = items[i].date;
            //date2.setDate(date2.getDate() + parseInt(items[i].terms));
            var tf = date2;
            if (tf > df && tf < dt) {
                result.push(items[i]);
            }
        }
        return result;
    };
});

myApp.directive('dragMe', [function () {
    return {
        link: function (scope, element, attrs) {
            // set element as draggable
            element.attr('draggable', true);

            // add custom cursor
            if (attrs.handle && element.find(attrs.handle)) {
                element.find(attrs.handle).attr('style', 'cursor: e-resize;');
            } else {
                element.attr('style', 'cursor: e-resize;');
            }

            // max number of dragging rows
            var limit = attrs.limit || 50;

            // current element offset position
            var offsetDiff = 0;

            // timeout object
            var toObject = false;

            // current clicked element
            var $currentElement = false;

            // ghost element
            var $ghostWrapper = false;

            // ghost wrapper template
            var ghostWrapperHtml = '<div class="ghost" style="position: fixed;">{ghostHtml}</div>';

            // ghost table data template
            var ghostHtml = '<div class="{elemClass}" style="height: {height}px; width: {width}px;">{text}</div>';

            var mouseX, mouseY;

            $(document).on("dragover", function (event) {
                mouseX = event.originalEvent.clientX;
                mouseY = event.originalEvent.clientY;
            });

            // simple template function
            var t = function (s, d) {
                for (var p in d)
                    s = s.replace(new RegExp('{' + p + '}', 'g'), d[p]);
                return s;
            };

            // set offset of current element
            var setOffsetDiff = function (e) {
                offsetDiff = e.originalEvent.clientX - element.offset().left;
            };

            // add ghost elements
            var addGhostElements = function (e) {
                // if exists, remove previous $ghostWrapper
                if ($ghostWrapper) {
                    $ghostWrapper.remove();
                }

                // calculate current element offset
                setOffsetDiff(e);

                // add $ghostWrapper element
                addGhostWrapperElements(addGhostTdElements());
            };

            // replicate every table data element
            var addGhostTdElements = function () {
                // html string
                var ghostTdHtml = '';

                // get current element index
                var nth = element.index() + 1;

                // find matching element in table
                var $tdElements = element.closest('table').find('tr td:nth-child(' + nth + '):visible');

                // add class on current td elements
                $tdElements.addClass('ghost__data');

                // check table row count
                var tdLimit = $tdElements.length;

                // check if table row count is bigger than limit and reset if it is
                if (tdLimit > limit) {
                    tdLimit = limit;
                }

                // for every row, generate td html and concat it
                for (var i = 0; i < tdLimit; i++) {
                    var $currentTdElement = $($tdElements[i]);
                    ghostTdHtml += t(ghostHtml, {
                        elemClass: 'ghost__td',
                        height: $currentTdElement.outerHeight(),
                        width: $currentTdElement.outerWidth(),
                        text: $currentTdElement.html()
                    });
                }

                // return generated ghostTdHtml
                return ghostTdHtml;
            };

            // add final wrapper element with replicated table data elements
            var addGhostWrapperElements = function (ghostHtml) {

                // append ghost wrapper before table
                element.closest('table').before(t(ghostWrapperHtml, {
                    ghostHtml: ghostHtml
                }));

                // find appended element
                $ghostWrapper = $('.ghost');

                // get current element offset
                var offset = element.offset();

                // add top and left offsets to appended element
                $ghostWrapper.css('top', offset.top - $(window).scrollTop() + element.outerHeight());
                $ghostWrapper.css('left', offset.left);
            };

            // find and remove unnecessary ghost classes and attributes
            var clearGhostElements = function () {
                angular.element('.ghost__placeholder').removeClass('ghost__placeholder').removeAttr('width');
                angular.element('.ghost__data').removeClass('ghost__data');
            };

            // make sure current target is element clicked
            element.bind('mousedown', function (e) {
                $currentElement = e.target;
            });

            // listen when drag event starts
            element.bind('dragstart', function (e) {
                // firefox fix
                if (typeof e.originalEvent.dataTransfer !== 'undefined' && typeof e.originalEvent.dataTransfer.mozSourceNode !== 'undefined') {
                    e.originalEvent.dataTransfer.setData('application/node type', this);
                }

                // if handle is set, check if handle is used and prevent dragging if not
                if (attrs.handle && (!$($currentElement).hasClass(attrs.handle) && !$($currentElement).closest(attrs.handle).length)) {
                    return false;
                }

                // clear previous ghost elements
                clearGhostElements();

                // add class for styling and lock element width
                element.addClass('ghost__placeholder').attr('width', element.outerWidth());

                // add ghost elements
                addGhostElements(e);
            });

            // listen when drag event is in an action
            element.bind('drag', function (e) {
                // clear timeout object
                clearTimeout(toObject);

                // create timeout object
                toObject = setTimeout(function () {

                    // if $ghostWrapper exists, update left offset position
                    if ($ghostWrapper) {
                        $ghostWrapper.css('left', mouseX - offsetDiff);
                    }
                }, 5);
            });

            // listen when drag event finishes
            element.bind('dragend', function (e) {
                // if $ghostWrapper exists, remove it
                if ($ghostWrapper) {
                    $ghostWrapper.remove();
                }

                // clear any ghost element
                clearGhostElements();

                // reset $currentElement
                $currentElement = false;
            });
        }
    };
}])

// listen to drop events
myApp.directive('dropMe', [function () {
    return {
        link: function (scope, element, attrs) {
            // timeout object
            var toObject = false;

            // last known direction
            var lastDirection = false;

            // last known index
            var lastIndex = false;

            // add ghost table column elements
            var ghostTable = function (direction, index) {
                // check if last know direction and current direction
                // and last know index and current index are the same
                // if so, prevent action
                if (direction === lastDirection && index === lastDirection) {
                    return false;
                }

                // find last ghost placeholder
                var $ghostPlaceholder = angular.element('.ghost__placeholder').last();

                // find current table data elements
                var $currentElements = angular.element('tbody td:nth-child(' + (index) + ')');

                // find ghost data elements
                var $ghostElements = angular.element('.ghost__data');

                // get current table data elements count
                var tdLimit = $currentElements.length;

                // check if direction is right
                if (direction === 'right') {
                    // append ghost placeholder after the current element
                    element.after($ghostPlaceholder);

                    // append ghost data elements after current table data elements
                    for (var i = 1; i < tdLimit; i++) {
                        if (typeof $ghostElements[i] !== 'undefined') {
                            $($currentElements[i]).after($ghostElements[i]);
                        } else {
                            break;
                        }
                    }
                    // check if direction is left
                } else if (direction === 'left') {
                    // append ghost placeholder before the current element
                    element.before($ghostPlaceholder);

                    for (var j = 1; j < tdLimit; j++) {
                        // append ghost data elements before current table data elements
                        if (typeof $ghostElements[j] !== 'undefined') {
                            $($currentElements[j]).before($ghostElements[j]);
                        } else {
                            break;
                        }
                    }
                }

                // cache current direction
                lastDirection = direction;

                // cache current index
                lastIndex = index;
            };

            // listen when dragging element is over current element
            element.bind('dragover', function (e) {

                // prevent default action
                e.preventDefault();

                // clear timeout object
                clearTimeout(toObject);

                // create timeout object
                toObject = setTimeout(function () {

                    // calculate direction of dragging element
                    var direction = e.originalEvent.x > (element.offset().left + element.width() / 2) ? 'right' : 'left';

                    // append ghost elements into the table
                    ghostTable(direction, element.index() + 1);
                }, 50);
            });

            // listen when dragging element is dropped into current element
            element.bind('drop', function (e) {
                // calculate direction of dragging element
                var direction = e.originalEvent.x > (element.offset().left + element.width() / 2) ? 'right' : 'left';

                // append ghost elements into the table
                ghostTable(direction, element.index() + 1, true);
            });
        }
    };
}]);

myApp.filter('toTitleCase', function () {
    return function (input) {
        input = input || '';
        return input.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };
})

myApp.filter('trim', function () {
    return function (value) {
        if (!angular.isString(value)) {
            return value;
        }
        return value.replace(/^\s+|\s+$/g, ''); // you could use .trim, but it's not going to work in IE<9
    };
});



myApp.service('moduleTracker', ["$rootScope", "toaster", "$http", function ($rootScope, toaster, $http) {

    this.rebuild = true;
    this.buildNotes = true;
    this.buildTasks = true;
    this.buildDocs = true;

    this.module = {
        name: '',
        record: '',
        tab: '',
        tabId: '',
        recordName: '',
        additional: ''
    };

    this.getter = function () {
        return this.module;
    }

    this.updateName = function (name) {
        this.module.name = name;
    }

    this.updateRecord = function (record) {
        this.module.record = record;
    }

    this.updateTab = function (tab) {
        this.module.tab = tab;
    }

    this.updateTabId = function (tabId) {
        this.module.tabId = tabId;
    }

    this.updateRecordName = function (recordName) {
        this.module.recordName = recordName;
    }

    this.updateAdditional = function (additional) {
        this.module.additional = additional;
    }
}]);

var validateDecimalPoints = function (e, no_of_decimals) {
    var t = e.value;
    var t1 = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), no_of_decimals + 1)) : t;
    e.value = (!isNaN(t1) || t1 == "." || t1 == "-") ? t1 : null;
}


myApp.controller('LeftSidebarController', ['moduleTracker', '$scope', function (moduleTracker, $scope) {
    // console.log(moduleTracker.module);
}]);