var app = angular.module("Apps", ["ngRoute", "Ctrl", "datatables.buttons", "datatables", ]);
app.config(function($routeProvider) {  
    $routeProvider   
        .when("/Main", {
            templateUrl: "apps/views/main.html",
            controller: "MainController"
        })
        .when("/JenisBayar", {
            templateUrl: "apps/views/JenisBayar.html",
            controller: "JenisBayarController"
        })
        .when("/KelolahPembayaran", {
            templateUrl: "apps/views/KelolahJenisBayar.html",
            controller: "KelolahPembayaranController"
        })
        .when("/BayarKhusus", {
            templateUrl: "apps/views/BayarKhusus.html",
            controller: "BayarKhususController"
        })
        .when("/CreateTA", {
            templateUrl: "apps/views/CreateTA.html",
            controller: "CreateTAController"
        })
        .when("/Mahasiswa", {
            templateUrl: "apps/views/Mahasiswa.html",
            controller: "MahasiswaController"
        })
        .when("/Registrasi", {
            templateUrl: "apps/views/Registrasi.html",
            controller: "RegistrasiController"
        })
        .when("/Pengguna", {
            templateUrl: "apps/views/Pengguna.html",
            controller: "PenggunaController"
        })
        .when("/Struktural", {
            templateUrl: "apps/views/Struktural.html",
            controller: "StrukturalController"
        })
        .when("/Pejabat", {
            templateUrl: "apps/views/Pejabat.html",
            controller: "PejabatController"
        })
        .when("/Mailbox", {
            templateUrl: "apps/views/Mailbox.html",
            controller: "MailboxController"
        })
        .when("/Compose", {
            templateUrl: "apps/views/Compose.html",
            controller: "ComposeController"
        })

    .otherwise({ redirectTo: '/Main' })

})

app.directive("fileInput", function($parse) {
    return {
        link: function($scope, element, attrs) {
            element.on("change", function(event) {
                var files = event.target.files;
                console.log(files[0].name);
                $parse(attrs.fileInput).assign($scope, element[0].files);
                $scope.$apply();
            });
        }
    }
});
app.service('fileUpload', ['$http', function($http) {
    this.uploadFileToUrl = function(file, uploadUrl, name) {
        var fd = new FormData();
        fd.append('file', file);
        fd.append('name', name);
        $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined, 'Process-Data': false }
            })
            .success(function() {
                console.log("Success");
            })
            .error(function() {
                console.log("Success");
            });
    }
}]);



function dataFactory() {
    var factory = {};

    factory.currentPage = 0;
    factory.pageSize = 10;
    factory.totalPages = 0;
    factory.pagedData = [];
    factory.firstrow = 0;
    factory.endrow = 0;
    factory.TotalData = 0;
    factory.Items = [];

    factory.pageButtonDisabled = function(dir) {
        if (dir == -1) {
            return factory.currentPage == 0;
        }
        return factory.currentPage >= factory.TotalData / factory.pageSize - 1;
    }

    factory.paginate = function(nextPrevMultiplier) {
        factory.currentPage += (nextPrevMultiplier * 1);
        factory.pagedData = factory.Items.slice(factory.currentPage * factory.pageSize);
        factory.firstrow = ((factory.currentPage) * factory.pageSize) + 1;
        if (factory.TotalData % 10 > 0 && factory.currentPage == factory.totalPages - 1) {
            factory.endrow = (factory.TotalData % 10) + ((factory.currentPage) * factory.pageSize);

        } else
            factory.endrow = (factory.currentPage + 1) * factory.pageSize;

    }

    factory.init = function(item) {
        factory.Items = item;
        factory.TotalData = factory.Items.length;
        factory.totalPages = Math.ceil(factory.TotalData / factory.pageSize);
        factory.paginate(0);
    }

    return factory;
};

app.factory("DataFactory", dataFactory);


app.factory("Services", function($http, $location, $q) {

    var service = {};
    service.session = {};
    service.Authentification = function() {
        var Urlauth = "api/datas/read/auth.php";
        $http({
                method: "get",
                url: Urlauth,
            })
            .then(function(response) {
                if (response.data.Session == false) {
                    window.location.href = 'index.html';
                } else
                    service.session = response.data.Session;
            }, function(error) {
                return error.message;
            })

    }

    service.init = function() {
        service.Authentification();
    }
    return service;
});

app.config(['notificationServiceProvider', function(notificationServiceProvider) {

    notificationServiceProvider

        .setDefaults({
        styling: 'bootstrap3',
        delay: 4000,
        buttons: {
            closer: false,
            closer_hover: false,
            sticker: false,
            sticker_hover: false
        },
        type: 'error'
    })

    // Configure a stack named 'bottom_right' that append a call 'stack-bottomright'
    .setStack('bottom_right', 'stack-bottomright', {
        dir1: 'up',
        dir2: 'left',
        firstpos1: 25,
        firstpos2: 25
    })

    // Configure a stack named 'top_left' that append a call 'stack-topleft'
    .setStack('top_left', 'stack-topleft', {
        dir1: 'down',
        dir2: 'right',
        push: 'top'
    })

    ;

}])