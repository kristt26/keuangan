angular
    .module("Ctrl", ["datatables", "datatables.buttons", "jlareau.pnotify", "pdfjsViewer"])
    .controller("UserSession", function($scope, $http) {
        $scope.session = {};
        var Urlauth = "api/datas/read/auth.php";
        $http({
                method: "get",
                url: Urlauth,
            })
            .then(function(response) {
                if (response.data.Session == false) {
                    window.location.href = 'Login_administration.html';
                } else
                    $scope.session = response.data.Session;
            }, function(error) {})
    })
    .controller("LogController", function($scope, $http) {
        var Urlauth = "api/datas/read/LogOut.php";
        $http({
                method: "get",
                url: Urlauth,
            })
            .then(function(response) {
                window.location.href = "index.html";
            }, function(error) {})
    })

.controller("MainController", function($scope, $http) {
        $scope.DataMaster = {};

        $scope.Init = function() {
            $scope.DataMaster.Total = 0;
            $scope.DataMaster.Bayar = 0;
            $scope.DataMaster.Tunggakan = 0;
            var Urlauth = "api/datas/read/ReadInformasi.php";
            $http({
                    method: "get",
                    url: Urlauth,
                })
                .then(function(response) {
                    if (response.status == 200) {
                        angular.forEach(response.data, function(value, key) {
                            $scope.DataMaster.Total += parseInt(value.Total);
                            $scope.DataMaster.Bayar += parseInt(value.Bayar);
                            $scope.DataMaster.Tunggakan += parseInt(value.Tunggakan);
                        })
                    }
                })
        }
    })
    .controller("LoginController", function($scope, $http) {
        $scope.DatasLogin = {};
        $scope.Login = function() {
            var UrlLogin = "api/datas/read/UserLogin.php";
            var Data = angular.copy($scope.DatasLogin);
            $http({
                method: "POST",
                url: UrlLogin,
                data: Data
            }).then(function(response) {
                if (response.data.Session != undefined) {
                    if (response.data.Session.Level == "Administrator")
                        window.location.href = "admin.html";
                    else if (response.data.Session.Level == "Ketua") {
                        window.location.href = "ketua.html";
                    } else if (response.data.Session.Level == "Puket III") {
                        window.location.href = "puketkeuangan.html";
                    } else if (response.data.Session.Level == "Pendataan") {
                        window.location.href = "pendataan.html";
                    } else {
                        window.location.href = "pembayaran.html";
                    }


                } else
                    alert(response.data.message);

            }, function(error) {
                alert(error.data.message);
            })
        }

    })
    .controller("UserController", function(
        $scope,
        $http,
        DTOptionsBuilder,
        DTColumnBuilder,
        notificationService
    ) {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType("full_numbers")
            .withOption("order", [0, "asc"])
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
        $scope.DatasUser = [];
        $scope.DataInput = {};
        $scope.DataLevel = [{ Id: "1", Level: "Ketua" }, { Id: "2", Level: "Puket III" }, { Id: "3", Level: "Pendataan" }, { Id: "4", Level: "Pembayaran" }];
        $scope.Init = function() {
            $http({
                method: "GET",
                url: "api/datas/read/ReadUser.php"
            }).then(function(response) {
                if (response.status == 200) {
                    angular.forEach(response.data, function(value, key) {
                        if (value.Status == "Aktif")
                            value.Check = true;
                        else
                            value.Check = false;
                    })
                    $scope.DatasUser = response.data;
                }
            });
        }
        $scope.Simpan = function() {
            $scope.DataInput.Check = true;
            $http({
                method: "POST",
                url: "api/datas/create/CreateUser.php",
                data: $scope.DataInput
            }).then(function(response) {
                if (response.status == 200) {
                    $scope.DataInput.IdUser = response.data.message;
                    $scope.DatasUser.push(angular.copy($scope.DataInput));
                }
                $scope.DataInput = {};
            })
        }
        $scope.UpdateStatus = function(item) {
            var Data = {};
            if (item.Status == "Aktif") {
                Data.IdUser = angular.copy(item.IdUser);
                Data.Status = "Tidak Aktif";
                Data.Check = false;
            } else {
                Data.IdUser = angular.copy(item.IdUser);
                Data.Status = "Aktif";
                Data.Check = true;
            }
            $http({
                method: "POST",
                url: "api/datas/update/UpdateStatusUser.php",
                data: Data
            }).then(function(response) {
                if (response.status == 200) {
                    angular.forEach($scope.DatasUser, function(value, key) {
                        if (value.IdUser == Data.IdUser) {
                            value.Status = Data.Status;
                            value.Check = Data.Check;
                        }
                    })
                }
            })
        }
    })
    .controller("MahasiswaController", function(
        $scope,
        $http,
        DTOptionsBuilder,
        DTColumnBuilder,
        notificationService,
        SweetAlert
    ) {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType("full_numbers")
            .withOption("order", [0, "desc"])
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
        $scope.DatasMahasiswa = [];
        $scope.DataInput = {};
        $scope.Simpan = function() {
            var Data = $scope.DataInput;
            var InsertUrl = "api/datas/create/CreateMahasiswa.php";
            $http({
                method: "POST",
                url: InsertUrl,
                data: Data
            }).then(
                function(response) {
                    if (response.data.message > 0) {
                        $scope.DataInput.IdMahasiswa = response.data.message;
                        $scope.DatasMahasiswa.push(angular.copy($scope.DataInput));
                        notificationService.success("Successing");
                        $scope.DataInput = {};
                    }
                },
                function(error) {
                    notificationService.error("Gagal Simpan");
                }
            );

        };

        $scope.Init = function() {
            var UrlGetMahasiswa = "api/datas/read/ReadMahasiswa.php";
            $http({
                method: "GET",
                url: UrlGetMahasiswa
            }).then(function(response) {
                if (response.data.message != undefined) {
                    notificationService.error(response.data.message);
                } else
                    $scope.DatasMahasiswa = response.data.records;
            })
        };
        $scope.Delete = function(item) {
            SweetAlert.swal({
                    title: "Anda Yakin?",
                    text: "Kamu akan menghapus data Mahasiswa: " + item.NamaMahasiswa,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel plx!",
                    closeOnConfirm: true,
                    closeOnCancel: true
                },
                function(isConfirm) {
                    if (isConfirm) {
                        $http({
                            method: "POST",
                            url: "api/datas/delete/DeleteMahasiswa.php",
                            data: item
                        }).then(function(response) {
                            if (response.status == 200) {
                                var index = $scope.DatasMahasiswa.indexOf(item);
                                $scope.DatasMahasiswa.splice(index, 1);
                                notificationService.success(response.data.message);
                            } else
                                notificationService.error(response.data.message);

                        }, function(error) {
                            notificationService.error(error.data.message);
                        })
                    }
                });

        }
    })

.controller("JenisBayarController", function(
    $scope,
    $http,
    DTOptionsBuilder,
    DTColumnBuilder,
    notificationService
) {
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType("full_numbers")
        .withOption("order", [0, "asc"])
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

    $scope.DataInput = {};
    $scope.DatasJenisBayar = [];
    $scope.Sifats = [{ Sifat: "Umum" }, { Sifat: "Khusus" }];
    $scope.SelectedSifats = {};
    $scope.Init = function() {
        var UrlJenisBayar = "api/datas/read/ReadJenisBayar.php";
        $http({
            method: "GET",
            url: UrlJenisBayar,
        }).then(function(response) {
                $scope.DatasJenisBayar = response.data.records;
            },
            function(error) {
                alert(error.message);
            })
    }

    $scope.Simpan = function() {
        $scope.DataInput.Sifat = $scope.SelectedSifats.Sifat;
        var Data = $scope.DataInput;
        var UrlSimpan = "api/datas/create/CreateJenisBayar.php";
        $http({
            method: "POST",
            url: UrlSimpan,
            data: Data
        }).then(function(response) {
            if (response.data.message > 0) {
                $scope.DataInput.IdJenisBayar = response.data.message;
                $scope.DatasJenisBayar.push(angular.copy($scope.DataInput));
                notificationService.success("Successing text");
                $scope.DataInput = {};
            }
        }, function(error) {
            notificationService.error("Gagal Simpan");
        })
    }

    $scope.DataEdit = function(item) {
        $scope.SelectedSifats.Sifat = item.Sifat;
        $scope.DataInput.Jenis = item.Jenis;
        $scope.DataInput.IdJenisBayar = item.IdJenisBayar;
    }

    $scope.Update = function() {
        $scope.DataInput.Sifat = $scope.SelectedSifats.Sifat;
        var Data = $scope.DataInput;
        var UrlUpdate = "api/datas/update/UpdateJenisBayar.php";
        $http({
            method: "POST",
            url: UrlUpdate,
            data: Data
        }).then(function(response) {
            if (response.data.message == "Success") {
                angular.forEach($scope.DatasJenisBayar, function(value, key) {
                    if (value.IdJenisBayar == $scope.DataInput.IdJenisBayar) {
                        value.Jenis = $scope.DataInput.Jenis;
                        value.Sifat = $scope.DataInput.Sifat;
                        notificationService.success("Berhasil Diubah");
                    }
                })
                $scope.DataInput = {};
                $scope.SelectedSifats = {};
            } else {
                notificationService.error("Perubahan gagal dilakukan");
            }
        }, function(error) {
            notificationService.error("Gagal Simpan");
        })
    }
})

.controller("KelolahPembayaranController", function(
    $scope,
    $http,
    DTOptionsBuilder,
    DTColumnBuilder,
    notificationService
) {
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType("full_numbers")
        .withOption("order", [0, "desc"])
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

    // $scope.dtColumns = [
    //     DTColumnBuilder.newColumn("id").withTitle("ID"),
    //     DTColumnBuilder.newColumn("firstName").withTitle("First name"),
    //     DTColumnBuilder.newColumn("lastName").withTitle("Last name")
    // ];
    $scope.DatasTahun = [];
    $scope.DataInput = {};
    $scope.SelectedAngkatan = {};
    $scope.DatasBayarUmum = [];
    $scope.DatasBayarKhusus = [];

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
    $scope.JenisMenu;

    $scope.ReadJenis = function(item) {
        $scope.JenisMenu = item;
    }
    $scope.SelectedEdit = function(item) {
        $scope.DatasInput = angular.copy(item);

    }

    $scope.TambahAngkatan = function() {
        if ($scope.JenisMenu == "Umum") {
            var UrlTambahAngkatan = "api/datas/create/CreateBayarUmum.php";
            var Data = $scope.DataInput;
            $http({
                method: "POST",
                url: UrlTambahAngkatan,
                data: Data
            }).then(function(response) {
                if (response.data[0].message == "Success") {
                    angular.forEach(response.data[0].records, function(value, key) {
                        $scope.DatasBayarUmum.push(value);
                    })
                    notificationService.success(response.data[0].message);
                    $scope.DataInput = {};
                }

            }, function(error) {
                notificationService.error("Data Gagal di Tambah");
            })
        } else {
            var UrlTambahTA = "api/datas/create/CreateBayarKhusus.php";
            var Data = $scope.DataInput;
            $http({
                method: "POST",
                url: UrlTambahTA,
                data: Data
            }).then(function(response) {
                if (response.data[0].message == "Success") {
                    angular.forEach(response.data[0].records, function(value, key) {
                        $scope.DatasBayarKhusus.push(value);
                    })
                    notificationService.success(response.data[0].message);
                    $scope.DataInput = {};
                }

            }, function(error) {
                notificationService.error("Data Gagal di Tambah");
            })
        }

    }

    $scope.UpdateNominal = function() {
        var Data = $scope.DatasInput;
        var Url = "api/datas/update/UpdateNominal.php";
        $http({
            method: "POST",
            url: Url,
            data: Data
        }).then(function(response) {
            if (response.data.message == "Khusus") {
                angular.forEach($scope.DatasBayarKhusus, function(value, key) {
                    if (value.IdBayarKhusus == $scope.DatasInput.IdBayarKhusus) {
                        value.Nominal = $scope.DatasInput.Nominal;
                        notificationService.success("Berhasil");
                    }
                })
            } else {
                angular.forEach($scope.DatasBayarUmum, function(value, key) {
                    if (value.IdBayarUmum == $scope.DatasInput.IdBayarUmum) {
                        value.Nominal = $scope.DatasInput.Nominal;
                        notificationService.success("Berhasil")
                    }
                })
            }

        }, function(error) {
            notificationService.error("Nominal Jenis Bayar Gagal di Ubah");
        })
    }
})

.controller("BayarKhususController", function(
    $scope,
    $http,
    DTOptionsBuilder,
    DTColumnBuilder,
    notificationService
) {

})

.controller("CreateTAController", function(
    $scope,
    $http,
    DTOptionsBuilder,
    DTColumnBuilder,
    notificationService
) {

})

.controller("RegistrasiController", function(
    $scope,
    $http,
    DTOptionsBuilder,
    DTColumnBuilder,
    notificationService
) {
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType("full_numbers")
        .withOption("order", [0, "desc"])
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

    $scope.DataInput = {};
    $scope.DatasMahasiswa;
    $scope.DataInput;
    $scope.ShowCari = true;
    $scope.HideCari = false;
    $scope.Temp;
    $scope.DatasAmbilMahasiswa = {};
    $scope.ShowData = false;
    $scope.HideData = true;
    $scope.DataTotal = 0;
    $scope.SetStatus = "TampilUmum";
    $scope.ShowDataKhusus = false;
    $scope.HideDataKhusus = true;
    $scope.SetDataProses = "Umum";
    $scope.ShowIdentitas1 = true;
    $scope.HideIdentitas1 = false;
    $scope.ShowIdentitas2 = false;
    $scope.HideIdentitas2 = true;
    $scope.DataCari;



    $scope.CariMahasiswa = function() {
        var CekData = false;
        angular.forEach($scope.DatasMahasiswa, function(value, key) {
            if (value.NPM == $scope.DataCari) {
                $scope.Temp = value;
                $scope.Temp.SetStatus = $scope.SetStatus;
                CekData = true;
            }
        })
        if (CekData == true) {
            var Data = $scope.Temp;
            var UrlCari = "api/datas/read/ReadOneMahasiswa.php";
            $http({
                method: "POST",
                url: UrlCari,
                data: Data

            }).then(function(response) {
                if (response.status == 200) {
                    $scope.DatasAmbilMahasiswa = response.data;

                    if ($scope.SetStatus == "TampilUmum") {
                        angular.forEach($scope.DatasAmbilMahasiswa.BayarUmum, function(value, key) {
                            $scope.DataTotal += parseInt(value.Nominal);
                            value.Check = true;
                            value.SetDisabled = false;

                        })
                        $scope.ShowData = true;
                        $scope.HideData = false;
                    } else if ($scope.SetStatus == "TampilKhusus") {
                        angular.forEach($scope.DatasAmbilMahasiswa.BayarKhusus, function(value, key) {
                            $scope.DataTotal += parseInt(value.Nominal);
                            value.Check = true;
                            value.SetDisabled = false;
                        })
                        $scope.ShowDataKhusus = true;
                        $scope.HideDataKhusus = false;
                    } else {
                        $scope.ShowDataKhusus = false;
                        $scope.HideDataKhusus = true;
                        $scope.ShowData = false;
                        $scope.HideData = true;
                    }

                } else {
                    alert(response.data.message);
                }

            })
        } else {
            notificationService.error("Mahasiswa Belum Terdaftar");
        }
    }
    $scope.SetShowCari = function(item) {
        if (item == "TampilUmum") {
            $scope.ShowCari == true;
            $scope.HideCari = false;
            $scope.ShowData = false;
            $scope.HideData = true;
            $scope.ShowIdentitas1 = true;
            $scope.HideIdentitas1 = false;
            $scope.ShowIdentitas2 = false;
            $scope.HideIdentitas2 = true;
            $scope.SetStatus = angular.copy(item);
            $scope.SetDataProses = "Umum";
        } else if (item == "TampilKhusus") {
            $scope.ShowCari == true;
            $scope.HideCari = false;
            $scope.ShowDataKhusus = false;
            $scope.HideDataKhusus = true;
            $scope.ShowIdentitas2 = true;
            $scope.HideIdentitas2 = false;
            $scope.ShowIdentitas1 = false;
            $scope.HideIdentitas1 = true;
            $scope.SetStatus = angular.copy(item);
            $scope.SetDataProses = "Khusus";
        } else {
            $scope.SetStatus = "Tambahan";
            $scope.ShowCari = true;
            $scope.HideCari = false;
            $scope.ShowData = false;
            $scope.HideData = true;
            $scope.ShowDataKhusus = false;
            $scope.HideDataKhusus = true;
            $scope.SetStatus;
            $scope.SetDataProses;
        }
    }
    $scope.DataTA = [];
    $scope.Init = function() {
        var UrlGetMahasiswa = "api/datas/read/ReadMahasiswa.php";
        $http({
            method: "GET",
            url: UrlGetMahasiswa
        }).then(function(response) {
            if (response.status == 200) {
                $scope.DatasMahasiswa = response.data.records;
            }
        })

        var UrlGetDataTA = "api/datas/read/ReadTA.php";
        $http({
            method: "GET",
            url: UrlGetDataTA
        }).then(function(response) {
            if (response.status == 200) {
                $scope.DataTA = response.data;
                $scope.DataTA.reverse();
            }
        })
    }
    $scope.Simpan = function() {
        var Data = $scope.DataInput;
        var UrlCreateMahasiswa = "api/datas/create/CreateMahasiswa.php";
        $http({
            method: "POST",
            url: UrlCreateMahasiswa,
            data: Data
        }).then(function(response) {
            if (response.status == 200) {
                $scope.DataInput.IdMahasiswa = response.data.message;
                $scope.DatasMahasiswa.push(angular.copy($scope.DataInput));
                notificationService.success("Mahasiswa berhasil ditambahkan!!!");
                $scope.DataInput = {};
            } else {
                notificationService.error(response.data.message);
            }

        })
    }

    $scope.DataProses = {};
    $scope.HitungTotal = function() {
        $scope.DataTotal = 0;
        angular.forEach($scope.DatasAmbilMahasiswa.BayarUmum, function(value, key) {
            if (value.Check == true)
                $scope.DataTotal += parseInt(value.Nominal);
        })
    }
    $scope.HitungTotaCheck = function(item) {
        if (item.Check == true) {
            item.Check = false;
            item.SetDisabled = true;
        } else {
            item.Check = true;
            item.SetDisabled = false;
        }


        if ($scope.DatasAmbilMahasiswa.BayarUmum.length != 0) {
            $scope.DataTotal = 0;
            angular.forEach($scope.DatasAmbilMahasiswa.BayarUmum, function(value, key) {
                if (value.Check == true)
                    $scope.DataTotal += parseInt(value.Nominal);
            })
        } else {
            $scope.DataTotal = 0;
            angular.forEach($scope.DatasAmbilMahasiswa.BayarKhusus, function(value, key) {
                if (value.Check == true)
                    $scope.DataTotal += parseInt(value.Nominal);
            })
        }

    }


    $scope.Proses = function() {
        $scope.DataInput.IdMahasiswa = $scope.DatasAmbilMahasiswa.IdMahasiswa;
        $scope.DataInput.TA = $scope.DatasAmbilMahasiswa.TAAktif.TA;
        $scope.DataInput.Jumlah = $scope.DataTotal;

        var Data = $scope.DataInput;
        var UrlProses;
        if ($scope.SetDataProses == "Umum") {
            $scope.DataInput.SendBayarUmum = $scope.DatasAmbilMahasiswa.BayarUmum;
            UrlProses = "api/datas/create/CreateDetailBayar.php";
        } else {
            $scope.DataInput.SendBayarKhusus = $scope.DatasAmbilMahasiswa.BayarKhusus;
            UrlProses = "api/datas/update/UpdateDetailBayar.php";
        }


        $http({
            method: "POST",
            url: UrlProses,
            data: Data
        }).then(function(response) {
            if (response.status == 201) {
                $scope.DataInput = {};
                $scope.DatasMahasiswa;
                $scope.DataInput;
                $scope.ShowCari = true;
                $scope.HideCari = false;
                $scope.Temp;
                $scope.DatasAmbilMahasiswa = {};
                $scope.ShowData = false;
                $scope.HideData = true;
                $scope.ShowDataKhusus = false;
                $scope.HideDataKhusus = true;
                $scope.DataTotal = 0;
                $scope.DataCari = "";
                notificationService.success(response.data.message);
            } else {
                notificationService.error(response.data.message);
            }
        })
    }

    $scope.SimpanDataLama = function() {
        $scope.DatasAmbilMahasiswa.TotalTagihan = $scope.DataInput.TotalTagihan;
        $scope.DatasAmbilMahasiswa.TotalPembayaran = $scope.DataInput.TotalPembayaran;
        $scope.DatasAmbilMahasiswa.TotalTunggakan = $scope.DataInput.TotalTunggakan;
        $scope.DatasAmbilMahasiswa.TA = $scope.DataInput.TA.TA;
        var Data = $scope.DatasAmbilMahasiswa;
        var Url = "api/datas/create/CreateMasterBayar.php";
        $http({
            method: "POST",
            url: Url,
            data: Data
        }).then(function(response) {
            if (response.status == 200) {
                notificationService.success("Berhasil di tambahkan");
                $scope.DataInput = {};
                $scope.DatasMahasiswa;
                $scope.DataInput;
                $scope.ShowCari = true;
                $scope.HideCari = false;
                $scope.Temp;
                $scope.DatasAmbilMahasiswa = {};
                $scope.ShowData = false;
                $scope.HideData = true;
                $scope.ShowDataKhusus = false;
                $scope.HideDataKhusus = true;
                $scope.DataTotal = 0;
                $scope.DataCari = "";
            }
        })
    }

    $scope.SelectItem = function(item) {
        $scope.DataInput = angular.copy(item);
    }

    $scope.ClearData = function() {
        $scope.DataInput = {};
    }
    $scope.Update = function() {
        var UrlUpdateMahasiswa = "api/datas/update/UpdateMahasiswa.php";
        $http({
            method: "POST",
            url: UrlUpdateMahasiswa,
            data: $scope.DataInput
        }).then(function(response) {
            if (response.status == 200) {
                angular.forEach($scope.DatasMahasiswa, function(value, key) {
                    if (value.IdMahasiswa == $scope.DataInput.IdMahasiswa) {
                        value.NPM = angular.copy($scope.DataInput.NPM);
                        value.NamaMahasiswa = angular.copy($scope.DataInput.NamaMahasiswa);
                        value.Angkatan = angular.copy($scope.DataInput.Angkatan);
                        value.Alamat = angular.copy($scope.DataInput.Alamat);
                        value.Kontak = angular.copy($scope.DataInput.Kontak);
                    }
                })
                $scope.DataInput = {};
                notificationService.success(response.data.message);
            } else {
                notificationService.error(response.data.message);
            }
        })
    }
})

.controller("PenggunaController", function(
    $scope,
    $http,
    DTOptionsBuilder,
    DTColumnBuilder,
    notificationService
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
    $scope.DatasPengguna = [];
    $scope.DataInput = {};
    $scope.Init = function() {
        var Kategoriurl = "api/datas/read/ReadPengguna.php";
        $http({
            method: "Get",
            url: Kategoriurl
        }).then(
            function(response) {
                $scope.DatasPengguna = response.data.records;
            },
            function(error) {
                alert(error.message);
            }
        );
    };
    $scope.Simpan = function() {
        var Data = $scope.DataInput;
        var InsertUrl = "api/datas/create/CreatePengguna.php";
        $http({
            method: "POST",
            url: InsertUrl,
            data: Data
        }).then(
            function(response) {
                if (response.data.message > 0) {
                    $scope.DataInput.idpengguna = response.data.message;
                    $scope.DatasPengguna.push(angular.copy($scope.DataInput));
                    notificationService.success("Data Berhasil di Simpan");
                }
            },
            function(error) {
                notificationService.error("Gagal Simpan");
            }
        );
    };
})

.controller("PembayaranMahasiswaController", function(
        $scope,
        $http,
        DTOptionsBuilder,
        DTColumnBuilder,
        notificationService
    ) {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType("full_numbers")
            .withOption("order", [0, "asc"])
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

        $scope.DataPembayaran = {};
        $scope.DataCari;
        $scope.DataInput = {}
        $scope.DataInformation = [];
        $scope.DataTotal = {};
        $scope.DatasTagihan = {};
        $scope.ShowInputPembayaran = false;
        $scope.HideInputPembayaran = true;
        $scope.ShowDetailPembayaran = false;
        $scope.HideDetailPembayaran = true;
        $scope.Init = function() {
            $http({
                method: "GET",
                url: "api/datas/read/ReadDataPembayaran.php"
            }).then(function(response) {
                if (response.status == 200) {
                    $scope.DataPembayaran = response.data;
                }
            })
        }
        $scope.CariMahasiswa = function() {
            $scope.DataInput = {};

            var a = false;
            angular.forEach($scope.DataPembayaran.Mahasiswa, function(value, key) {
                if (value.NPM == $scope.DataCari) {
                    $scope.DataInput = angular.copy(value);
                    a = true;
                }
            })
            if (a == true) {
                $scope.ShowInputPembayaran = true;
                $scope.HideInputPembayaran = false;
            } else {
                $scope.ShowInputPembayaran = false;
                $scope.HideInputPembayaran = true;
            }
        }
        $scope.CariInformasi = function() {
            $scope.DataInformation = [];
            $scope.DataTotal.Total = 0;
            $scope.DataTotal.Bayar = 0;
            $scope.DataTotal.Tunggakan = 0;
            var a = false;
            angular.forEach($scope.DataPembayaran.Mahasiswa, function(value, key) {
                if (value.NPM == $scope.DataCari) {
                    $scope.DataInformation = angular.copy(value);
                    angular.forEach($scope.DataInformation.MasterBayar, function(value1, key1) {
                        $scope.DataTotal.Total += parseInt(value1.Total);
                        $scope.DataTotal.Bayar += parseInt(value1.Bayar);
                        $scope.DataTotal.Tunggakan += parseInt(value1.Tunggakan);
                    })
                    a = true;
                }
            })
            if (a == true) {
                $scope.ShowDetailPembayaran = true;
                $scope.HideDetailPembayaran = false;
            } else {
                $scope.ShowDetailPembayaran = false;
                $scope.HideDetailPembayaran = true;
            }
        }
        $scope.Simpan = function() {
            $http({
                method: "POST",
                url: "api/datas/create/CreatePembayaran.php",
                data: $scope.DataInput
            }).then(function(response) {
                if (response.status == 200) {
                    // $scope.DataInput.IdTrxBayar=response.data.message;
                    $scope.getdata = {};
                    $scope.getdata.IdTrxBayar = response.data.IdTrxBayar;
                    $scope.getdata.TA = $scope.DataInput.TA.TA;
                    $scope.getdata.TglBayar = $scope.DataInput.TglBayar;
                    $scope.getdata.JumlahBayar = $scope.DataInput.JumlahBayar;
                    $scope.getdata.Description = $scope.DataInput.Description;
                    $scope.getdata.IdMahasiswa = $scope.DataInput.IdMahasiswa;
                    $scope.getdata.IdPetugas = response.data.IdPetugas;
                    angular.forEach($scope.DataPembayaran.Mahasiswa, function(value, key) {
                        if (value.IdMahasiswa == $scope.DataInput.IdMahasiswa) {
                            angular.forEach(value.MasterBayar, function(value1, key1) {
                                if (value1.TA == $scope.DataInput.TA.TA) {
                                    value1.Bayar = parseInt(angular.copy(value1.Bayar)) + parseInt(angular.copy($scope.getdata.JumlahBayar));
                                    value1.Tunggakan = parseInt(angular.copy(value1.Tunggakan)) - parseInt(angular.copy($scope.getdata.JumlahBayar));
                                    value1.TrxBayar.push(angular.copy($scope.getdata));
                                }
                            })
                        }
                    })
                    notificationService.success("Success Membayar");
                    $scope.DataInput = {};
                    $scope.DataCari;
                    $scope.ShowInputPembayaran = false;
                    $scope.HideInputPembayaran = true;
                }
            })
        }
        $scope.Clear = function(item) {
            // $scope.DataInput={};
            $scope.DataCari = "";
            $scope.DataInput = {};
            if (item == "cari")
                $scope.CariInformasi();
            else
                $scope.CariMahasiswa();
        }
        $scope.TotalBayar = {};
        $scope.ShowDataTagihan = function(item) {
            $scope.DatasTagihan = item;
            $scope.TotalBayar.BayarKhusus = 0;
            $scope.TotalBayar.IndexBayarKhusus;
            $scope.TotalBayar.BayarUmum = 0;
            $scope.TotalBayar.IndexBayarUmum;
            angular.forEach($scope.DatasTagihan.BayarKhusus, function(value, key) {
                angular.forEach($scope.DataPembayaran.BayarKhusus, function(value1, key1) {
                    if (value.IdBayarKhusus == value1.IdBayarKhusus) {
                        angular.forEach($scope.DataPembayaran.JenisBayar, function(value2, key2) {
                            if (value1.IdJenisBayar == value2.IdJenisBayar) {
                                value.Jenis = value2.Jenis;
                            }
                        })
                    }
                })
                $scope.TotalBayar.BayarKhusus += parseInt(value.Nominal);
            })
            $scope.TotalBayar.IndexBayarKhusus = $scope.DatasTagihan.BayarKhusus.length;
            angular.forEach($scope.DatasTagihan.BayarUmum, function(value, key) {
                angular.forEach($scope.DataPembayaran.BayarUmum, function(value1, key1) {
                    if (value.IdBayarUmum == value1.IdBayarUmum) {
                        angular.forEach($scope.DataPembayaran.JenisBayar, function(value2, key2) {
                            if (value1.IdJenisBayar == value2.IdJenisBayar) {
                                value.Jenis = value2.Jenis;
                            }
                        })
                    }
                })
                $scope.TotalBayar.BayarUmum += parseInt(value.Nominal);
            })
            $scope.TotalBayar.IndexBayarUmum = $scope.DatasTagihan.BayarUmum.length + 1;
        }
        $scope.DetailBayar;
        $scope.ShowDataPembayaran = function(item) {
            $scope.DetailBayar = angular.copy(item);
            $scope.DetailBayar.Total = 0;
            angular.forEach($scope.DetailBayar.TrxBayar, function(value, key) {
                $scope.DetailBayar.Total += parseInt(angular.copy(value.JumlahBayar));
            })
        }
    })
    .controller("LaporanController", function(
        $scope,
        $http,
        DTOptionsBuilder,
        DTColumnBuilder,
        notificationService
    ) {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType("full_numbers")
            .withOption("order", [0, "asc"])
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

        $scope.DataPembayaran = {};
        $scope.DataCari;
        $scope.DataInput = {}
        $scope.DataInformation = [];
        $scope.DataTotal = {};
        $scope.DataTotal.Total = 0;
        $scope.DataTotal.Bayar = 0;
        $scope.DataTotal.Tunggakan = 0;
        $scope.DataTA = [];
        $scope.ShowDetailPembayaran = false;
        $scope.HideDetailPembayaran = true;
        $scope.ShowLaporanTA = false;
        $scope.HideLaporanTA = true;

        $scope.Init = function() {
            $http({
                method: "GET",
                url: "api/datas/read/ReadDataPembayaran.php"
            }).then(function(response) {
                if (response.status == 200) {
                    $scope.DataPembayaran = response.data;
                }

            })
        }

        $scope.CariInformasi = function() {
            $scope.DataInformation = [];
            var a = false;
            angular.forEach($scope.DataPembayaran.Mahasiswa, function(value, key) {
                if (value.NPM == $scope.DataCari) {
                    $scope.DataInformation = angular.copy(value);
                    angular.forEach($scope.DataInformation.MasterBayar, function(value1, key1) {
                        $scope.DataTotal.Total += parseInt(value1.Total);
                        $scope.DataTotal.Bayar += parseInt(value1.Bayar);
                        $scope.DataTotal.Tunggakan += parseInt(value1.Tunggakan);
                    })
                    a = true;
                }
            })
            if (a == true) {
                $scope.ShowDetailPembayaran = true;
                $scope.HideDetailPembayaran = false;
            } else {
                $scope.ShowDetailPembayaran = false;
                $scope.HideDetailPembayaran = true;
            }
        }
        $scope.TotalTA = {};
        $scope.CariTA = function() {
            $scope.DataTA = [];
            $scope.TotalTA = {};
            $scope.TotalTA.Total = 0;
            $scope.TotalTA.Bayar = 0;
            $scope.TotalTA.Tunggakan = 0;
            var b = false;
            angular.forEach($scope.DataPembayaran.Mahasiswa, function(value, key) {
                var a = {};
                a.NPM = value.NPM;
                a.NamaMahasiswa = value.NamaMahasiswa;
                a.Total = 0;
                a.Bayar = 0;
                a.Tunggakan = 0;

                angular.forEach(value.MasterBayar, function(value1, key1) {
                    if (value1.TA == $scope.DataInput.TA) {
                        a.Total = value1.Total;
                        a.Bayar = value1.Bayar;
                        a.Tunggakan = value1.Tunggakan;
                        $scope.TotalTA.Total += parseInt(value1.Total);
                        $scope.TotalTA.Bayar += parseInt(value1.Bayar);
                        $scope.TotalTA.Tunggakan += parseInt(value1.Tunggakan);
                        $scope.DataTA.push(angular.copy(a));
                        b = true;
                    }
                })
            });
            if (b == true) {
                $scope.ShowLaporanTA = true;
                $scope.HideLaporanTA = false;
            } else {
                $scope.ShowLaporanTA = false;
                $scope.HideLaporanTA = true;
            }
        }
        $scope.DataTotal = [];
        $scope.DataKeseluruhan = function() {
            var temp = {};
            $scope.TotalTAALL = 0;
            $scope.DataTotal = [];
            $scope.TotalTA.Total = 0;
            $scope.TotalTA.Bayar = 0;
            $scope.TotalTA.Tunggakan = 0;
            angular.forEach($scope.DataPembayaran.DataTA, function(valueTA, KeyTA) {
                temp.TA = angular.copy(valueTA.TA);
                temp.Total = 0;
                temp.Bayar = 0;
                temp.Tunggakan = 0;
                angular.forEach($scope.DataPembayaran.Mahasiswa, function(valueMahasiswa, keyMahasiswa) {
                    angular.forEach(valueMahasiswa.MasterBayar, function(valueMasterBayar, KeyMasterbayar) {
                        if (valueTA.TA == valueMasterBayar.TA) {

                            temp.Total += parseInt(angular.copy(valueMasterBayar.Total));
                            temp.Bayar += parseInt(angular.copy(valueMasterBayar.Bayar));
                            temp.Tunggakan += parseInt(angular.copy(valueMasterBayar.Tunggakan));
                        }
                    })
                })
                $scope.TotalTA.Total += temp.Total;
                $scope.TotalTA.Bayar += temp.Bayar;
                $scope.TotalTA.Tunggakan += temp.Tunggakan;
                $scope.DataTotal.push(angular.copy(temp));
            })
        }
        $scope.Clear = function(item) {
            // $scope.DataInput={};
            $scope.DataCari = "";
            $scope.DataInput = {};
            if (item == "CariTA")
                $scope.CariTA();
            else
                $scope.DataKeseluruhan();


        }
    })
    .controller("IndexController", function(
        $scope,
        $http,
        notificationService
    ) {
        $scope.DataInformation = [];
        $scope.DataPembayaran = [];
        $scope.DataCari = "";
        $scope.DataTotal = {};
        $scope.ShowPengumuman = true;
        $scope.HidePengumuman = false;
        $scope.ShowPembayaran = false;
        $scope.HidePembayran = true;
        $scope.Init = function() {
            $http({
                method: "GET",
                url: "api/datas/read/ReadDataPembayaran.php"
            }).then(function(response) {
                if (response.status == 200) {
                    $scope.DataPembayaran = response.data;
                }
            })
            $scope.ShowPengumuman = true;
            $scope.HidePengumuman = false;
            $scope.ShowPembayaran = false;
            $scope.HidePembayran = true;
        }
        $scope.CariInformasi = function() {
            $scope.DataInformation = [];
            $scope.DataTotal.Total = 0;
            $scope.DataTotal.Bayar = 0;
            $scope.DataTotal.Tunggakan = 0;
            var a = false;
            angular.forEach($scope.DataPembayaran.Mahasiswa, function(value, key) {
                if (value.NPM == $scope.DataCari) {
                    $scope.DataInformation = angular.copy(value);
                    angular.forEach($scope.DataInformation.MasterBayar, function(value1, key1) {
                        $scope.DataTotal.Total += parseInt(value1.Total);
                        $scope.DataTotal.Bayar += parseInt(value1.Bayar);
                        $scope.DataTotal.Tunggakan += parseInt(value1.Tunggakan);
                    })
                    a = true;
                }
            })
            if (a == false) {
                $scope.ShowPengumuman = true;
                $scope.HidePengumuman = false;
                $scope.ShowPembayaran = false;
                $scope.HidePembayran = true;
            } else {
                $scope.ShowPengumuman = false;
                $scope.HidePengumuman = true;
                $scope.ShowPembayaran = true;
                $scope.HidePembayran = false;
            }
        }
        $scope.TotalBayar = {};
        $scope.ShowDataTagihan = function(item) {
            $scope.DatasTagihan = item;
            $scope.TotalBayar.BayarKhusus = 0;
            $scope.TotalBayar.IndexBayarKhusus;
            $scope.TotalBayar.BayarUmum = 0;
            $scope.TotalBayar.IndexBayarUmum;
            angular.forEach($scope.DatasTagihan.BayarKhusus, function(value, key) {
                angular.forEach($scope.DataPembayaran.BayarKhusus, function(value1, key1) {
                    if (value.IdBayarKhusus == value1.IdBayarKhusus) {
                        angular.forEach($scope.DataPembayaran.JenisBayar, function(value2, key2) {
                            if (value1.IdJenisBayar == value2.IdJenisBayar) {
                                value.Jenis = value2.Jenis;
                            }
                        })
                    }
                })
                $scope.TotalBayar.BayarKhusus += parseInt(value.Nominal);
            })
            $scope.TotalBayar.IndexBayarKhusus = $scope.DatasTagihan.BayarKhusus.length;
            angular.forEach($scope.DatasTagihan.BayarUmum, function(value, key) {
                angular.forEach($scope.DataPembayaran.BayarUmum, function(value1, key1) {
                    if (value.IdBayarUmum == value1.IdBayarUmum) {
                        angular.forEach($scope.DataPembayaran.JenisBayar, function(value2, key2) {
                            if (value1.IdJenisBayar == value2.IdJenisBayar) {
                                value.Jenis = value2.Jenis;
                            }
                        })
                    }
                })
                $scope.TotalBayar.BayarUmum += parseInt(value.Nominal);
            })
            $scope.TotalBayar.IndexBayarUmum = $scope.DatasTagihan.BayarUmum.length + 1;
        }
    });