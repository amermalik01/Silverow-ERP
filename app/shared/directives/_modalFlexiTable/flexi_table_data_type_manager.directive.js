myApp.directive("dataTypeManager2", ['$rootScope', function () {
    return {
        restrict: 'A',
        scope: {
            cellConf: "=",
            cellData: "=",
            selectSingleRec: "&",
        },
        replace: false,
        templateUrl: "app/shared/directives/_modalFlexiTable/flexi_table_data_type_manager.directive.html",
        link: function (scope, elem) {
            scope.convert_unix_date_to_angular = function (start_date) {
                //return start_date;

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

                // if ($rootScope.defaultDateFormat == $rootScope.dtYMD)
                //     return yyyy + "/" + mm + "/" + dd;
                // if ($rootScope.defaultDateFormat == $rootScope.dtMDY)
                //     return mm + "/" + dd + "/" + yyyy;
                // if ($rootScope.defaultDateFormat == $rootScope.dtDMY)
                return dd + "/" + mm + "/" + yyyy;

            }
        }
    }
}])