myApp.directive('widgets', function ($interpolate, $http, toaster, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            widgets: '=',
            chartData: '=',
            chartLabel: '='
        },
        // controller: 'DashboardController',
        templateUrl: 'app/shared/directives/widgets.directive.html',
        link: function (scope, elem, attrs) {
            
            /* var checkExist = setInterval(function () {
                if ($('#chart-area').length && scope.chartData.length > 0) {
                    var colours = [
                        "#FF5733",
                        "#FFD376",
                        "#A4EEFF",
                        "#FB8BE7",
                        "#69DFD8",
                        "#9496F9",
                        "#FF5733",
                        "#FFD376",
                        "#A4EEFF",
                        "#FB8BE7",
                        "#69DFD8",
                        "#9496F9",
                    ];

                    var bg_colours = [
                        "#FF8E76",
                        "#FFE2A4",
                        "#CFF6FF",
                        "#FFB1F1",
                        "#9AEEE9",
                        "#CACBFF",
                        "#FF8E76",
                        "#FFE2A4",
                        "#CFF6FF",
                        "#FFB1F1",
                        "#9AEEE9",
                        "#CACBFF",
                    ];
                    var config = {
                        type: 'funnel',
                        data: {
                            datasets: [{
                                data: scope.chartData, // [10, 20, 90], //
                                backgroundColor:
                                    // [
                                    //     "#FF6384",
                                    //     "#36A2EB",
                                    //     "#FFCE56"
                                    // ]
                                colours.slice(0, scope.chartData.length),
                                hoverBackgroundColor: bg_colours.slice(0, scope.chartData.length),
                                // [
                                //     "#FF6384",
                                //     "#36A2EB",
                                //     "#FFCE56"
                                // ]
                            }],
                            labels: scope.chartLabel
                            // [
                            //     "Red",
                            //     "Blue",
                            //     "Yellow"
                            // ]
                        },
                        options: {
                            sort: 'desc',
                            maintainAspectRatio: false,
                            gap:4,
                            responsive: true,
                            //keep: 'left',
                            legend: {
                                position: 'left'
                            },
                            title: {
                                display: false,
                                text: 'Chart.js Funnel Chart'
                            },
                            animation: {
                                animateScale: true,
                                animateRotate: true
                            }
                        }
                    };
                    ctx = document.getElementById("chart-area").getContext("2d");
                    window.myDoughnut = new Chart(ctx, config)
                    clearInterval(checkExist);
                }
            }, 100); */
        }
    }

});