var app = angular.module("Appsindex", ["datatables", "datatables.buttons"]);
app.controller("IndexController", function(
    $http,
    $scope,
    DTOptionsBuilder,
    DTColumnBuilder,
) {
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType("full_numbers")
        .withOption("order", [1, "desc"])
        .withButtons([{
                extend: 'excelHtml5',
                customize: function(xlsx) {
                    var sheet = xlsx.xl.worksheets['sheet1.xml'];

                    // jQuery selector to add a border to the third row
                    $('row c[r*="3"]', sheet).attr('s', '25');
                    // jQuery selector to set the forth row's background gray
                    $('row c[r*="4"]', sheet).attr('s', '5');
                }
            },
            {
                extend: "csvHtml5",
                fileName: "Data_Analysis",
                exportOptions: {
                    columns: ':visible'
                },
                exportData: { decodeEntities: true }
            },
            {
                extend: "pdfHtml5",
                fileName: "Data_Analysis",
                title: "Data Analysis Report",
                exportOptions: {
                    columns: ':visible'
                },
                exportData: { decodeEntities: true }
            },
            {
                extend: 'print',
                //text: 'Print current page',
                autoPrint: true,
                title: "Data Seleksi",
                exportOptions: {
                    columns: ':visible'
                }
            }

        ]);

    $scope.dtColumns = [
        DTColumnBuilder.newColumn("id").withTitle("ID"),
        DTColumnBuilder.newColumn("firstName").withTitle("First name"),
        DTColumnBuilder.newColumn("lastName").withTitle("Last name")
    ];


});

app.directive('loading', ['$http', function($http) {
    return {
        restrict: 'A',
        template: '<div class="overlay"><div class="m-loader mr-4"><svg class="m-circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="4" stroke-miterlimit="10" /></svg></div><h3 class="l-text">Loading</h3></div>',
        link: function(scope, elm, attrs) {
            scope.isLoading = function() {
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function(v) {
                if (v) {
                    elm.show();
                } else {
                    elm.hide();
                }
            });
        }
    };
}]);