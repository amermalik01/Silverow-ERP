myApp.directive('dynamicSelect', ['$filter', function ($filter) {

    return {
        restrict: 'E',
        scope: {
            lookupTable: '=', //[{id: 1, name: "item1"},...] used to populate the list
            fields: '=', //{...} to hold the resultant array list fields
            propertyName: '@', //name for above array, as new property of 'fields'
            readOnly: '=', //! readOnly, doi and qty can be omitted => default values
            doi: '@defaultOptionIndex',
            qty: '@' //max. qty of fields, an integer > 0, else adjused! or defaults to 5
        },
        templateUrl: 'app/shared/directives/dynamic_select.directive.html',
        link: linkFunction
    }


    function linkFunction(scope, elem, attrs) {
        scope.max = (isNaN(scope.qty) || Number(scope.qty) < 1) ? 5 : Math.round(scope.qty); //use global constant if available

        // if (scope.readOnly === undefined  || scope.readOnly == 0 ) 
        //     scope.readOnly =  'false';
        // scope.rw = ( scope.readOnly.toLowerCase() === 'false') ? true : false;

        scope.doi = -1;
        scope.disableItems = function(){
            if(scope.fields[scope.propertyName] != undefined && scope.fields[scope.propertyName].length > 0)
            {
                angular.forEach(scope.lookupTable, function(obj){
                     obj.isExist = 0;
                });
                
                angular.forEach(scope.fields[scope.propertyName], function(obj){
                    if(obj != undefined && obj.id != undefined)
                    {
                        var chk_item = $filter("filter")(scope.lookupTable, { id: obj.id }, true);
                        var idx = scope.lookupTable.indexOf(chk_item[0]);
                        if(idx != -1)
                        {
                            scope.lookupTable[idx].isExist = 1;
                        }                           
                    }
                });
            }
        }

        if (!scope.fields.hasOwnProperty(scope.propertyName)) {
            var defaultOption = angular.copy(scope.lookupTable[scope.doi]);
            scope.fields[scope.propertyName] = [defaultOption];
        }
        scope.disableItems();        

        scope.setNewField = function () {
            if (scope.max == scope.fields[scope.propertyName].length) return;
            scope.fields[scope.propertyName].push({
                id: "",
                name: '',
                value: ''
            });

            scope.disableItems();
        }
        scope.deleteField = function(index){
            scope.fields[ scope.propertyName ].splice(index, 1); 
            scope.disableItems();
        }
    }
}]);