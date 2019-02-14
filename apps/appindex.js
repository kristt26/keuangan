var app = angular.module("Appsindex", []);
app.controller("IndexController", function(
    $http,
    $scope
) {
    $scope.ShowPembayaran = false;
    $scope.HidePembayaran = true;
    $scope.url = "apps/views/Index.html";
    $scope.Init = function() {
        var UrlTahun = "api/datas/read/ReadTahun.php";
        $http({
            method: "GET",
            url: UrlTahun
        }).then(function(response) {
            $scope.DatasTahun = response.data.records;
        }, function(error) {
            // notificationService.error("Gagal Mengambil Data");
        })

        var UrlBayarUmum = "api/datas/read/ReadBayarUmum.php";
        $http({
            method: "GET",
            url: UrlBayarUmum
        }).then(function(response) {
            $scope.DatasBayarUmum = response.data.records;
        }, function(error) {
            // notificationService.error("Gagal Mengambil Data");
        })

        var UrlBayarKhusus = "api/datas/read/ReadBayarKhusus.php";
        $http({
            method: "GET",
            url: UrlBayarKhusus
        }).then(function(response) {
            $scope.DatasBayarKhusus = response.data.records;
        }, function(error) {
            // notificationService.error("Gagal Mengambil Data");
        })
    }

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