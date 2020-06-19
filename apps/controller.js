angular
    .module("Ctrl", ["datatables", "datatables.buttons", "jlareau.pnotify", "pdfjsViewer"])
    .controller("UserSession", function ($scope, $http, AuthService) {
        $scope.session = {};
        var Urlauth = AuthService.Base + "api/datas/read/auth.php";
        $http({
            method: "get",
            url: Urlauth,
        })
            .then(function (response) {
                if (response.data.Session == false) {
                    window.location.href = 'index.html';
                } else
                    $scope.session = response.data.Session;
            }, function (error) { })
    })



    .controller("MainController", function ($scope, $http, AuthService) {
        $scope.DataMaster = {};

        $scope.Init = function () {
            $scope.DataMaster.Total = 0;
            $scope.DataMaster.Bayar = 0;
            $scope.DataMaster.Tunggakan = 0;
            var Urlauth = AuthService.Base + "api/datas/read/ReadInformasi.php";
            $http({
                method: "get",
                url: Urlauth,
            })
                .then(function (response) {
                    if (response.status == 200) {
                        angular.forEach(response.data, function (value, key) {
                            $scope.DataMaster.Total += parseInt(value.Total);
                            $scope.DataMaster.Bayar += parseInt(value.Bayar);
                            $scope.DataMaster.Tunggakan += parseInt(value.Tunggakan);
                        })
                    }
                })
        }
    })

    .controller("LogController", function ($scope, $http, AuthService) {
        var Urlauth = AuthService.Base + "api/datas/read/LogOut.php";
        $http({
            method: "GET",
            url: Urlauth
        }).then(function (response) {
            window.location.href = "index.html";
        }, function (error) {
            alert(error.message);
        })
        // $http({
        //     method: "get",
        //     url: Urlauth,
        // })
        //     .then(function (response) {
        //         
        //     }, function (error) { })
    })

    .controller("LoginController", function ($scope, $http, AuthService) {
        $scope.DatasLogin = {};
        $scope.Login = function () {
            var UrlLogin = AuthService.Base + "api/datas/read/UserLogin.php";
            var Data = angular.copy($scope.DatasLogin);
            $http({
                method: "POST",
                url: UrlLogin,
                data: Data
            }).then(function (response) {
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

            }, function (error) {
                alert(error.data.message);
            })
        }

    })
    .controller("UserController", function (
        $scope,
        $http,
        DTOptionsBuilder,
        DTColumnBuilder,
        notificationService, AuthService
    ) {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType("full_numbers")
            .withOption("order", [0, "asc"])
            .withButtons([{
                extend: 'excelHtml5',
                customize: function (xlsx) {
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
        $scope.Init = function () {
            $http({
                method: "GET",
                url: AuthService.Base + "api/datas/read/ReadUser.php"
            }).then(function (response) {
                if (response.status == 200) {
                    angular.forEach(response.data, function (value, key) {
                        if (value.Status == "Aktif")
                            value.Check = true;
                        else
                            value.Check = false;
                    })
                    $scope.DatasUser = response.data;
                }
            });
        }
        $scope.Simpan = function () {
            $scope.DataInput.Check = true;
            $http({
                method: "POST",
                url: AuthService.Base + "api/datas/create/CreateUser.php",
                data: $scope.DataInput
            }).then(function (response) {
                if (response.status == 200) {
                    $scope.DataInput.IdUser = response.data.message;
                    $scope.DatasUser.push(angular.copy($scope.DataInput));
                }
                $scope.DataInput = {};
            })
        }
        $scope.UpdateStatus = function (item) {
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
                url: AuthService.Base + "api/datas/update/UpdateStatusUser.php",
                data: Data
            }).then(function (response) {
                if (response.status == 200) {
                    angular.forEach($scope.DatasUser, function (value, key) {
                        if (value.IdUser == Data.IdUser) {
                            value.Status = Data.Status;
                            value.Check = Data.Check;
                        }
                    })
                }
            })
        }
    })
    .controller("MahasiswaController", function (
        $scope,
        $http,
        DTOptionsBuilder,
        DTColumnBuilder,
        notificationService,
        SweetAlert, AuthService
    ) {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType("full_numbers")
            .withOption("order", [0, "desc"])
            .withButtons([{
                extend: 'excelHtml5',
                customize: function (xlsx) {
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
        $scope.Simpan = function () {
            var Data = $scope.DataInput;
            var InsertUrl = AuthService.Base + "api/datas/create/CreateMahasiswa.php";
            $http({
                method: "POST",
                url: InsertUrl,
                data: Data
            }).then(
                function (response) {
                    if (response.data.message > 0) {
                        $scope.DataInput.IdMahasiswa = response.data.message;
                        $scope.DatasMahasiswa.push(angular.copy($scope.DataInput));
                        notificationService.success("Successing");
                        $scope.DataInput = {};
                    }
                },
                function (error) {
                    notificationService.error("Gagal Simpan");
                }
            );

        };

        $scope.Init = function () {
            var UrlGetMahasiswa = AuthService.Base + "api/datas/read/ReadMahasiswa.php";
            $http({
                method: "GET",
                url: UrlGetMahasiswa
            }).then(function (response) {
                if (response.data.message != undefined) {
                    notificationService.error(response.data.message);
                } else
                    $scope.DatasMahasiswa = response.data.records;
            })
        };
        $scope.SelectItem = function (item) {
            $scope.DataInput = angular.copy(item);

        }
        $scope.Update = function () {
            SweetAlert.swal({
                title: "Anda Yakin?",
                text: "Kamu akan Mengubah data Mahasiswa: " + $scope.DataInput.NamaMahasiswa,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, update it!",
                cancelButtonText: "No, cancel!",
                closeOnConfirm: true,
                closeOnCancel: true
            },
                function (isConfirm) {
                    if (isConfirm) {
                        $http({
                            method: "POST",
                            url: AuthService.Base + "api/datas/update/UpdateMahasiswa.php",
                            data: $scope.DataInput
                        }).then(function (response) {
                            if (response.status == 200) {
                                angular.forEach($scope.DatasMahasiswa, function (value, key) {
                                    if (value.IdMahasiswa == $scope.DataInput.IdMahasiswa) {
                                        value.NPM = $scope.DataInput.NPM;
                                        value.NamaMahasiswa = $scope.DataInput.NamaMahasiswa;
                                        value.Angkatan = $scope.DataInput.Angkatan;
                                        value.Alamat = $scope.DataInput.Alamat;
                                        value.Kontak = $scope.DataInput.Kontak;
                                    }
                                })
                                notificationService.success(response.data.message);
                                $scope.DataInput = {};
                            } else
                                notificationService.error(response.data.message);
                        }, function (error) {
                            notificationService.error(error.data.message);
                        })
                    }
                });

        }
        $scope.Delete = function (item) {
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
                function (isConfirm) {
                    if (isConfirm) {
                        $http({
                            method: "POST",
                            url: AuthService.Base + "api/datas/delete/DeleteMahasiswa.php",
                            data: item
                        }).then(function (response) {
                            if (response.status == 200) {
                                var index = $scope.DatasMahasiswa.indexOf(item);
                                $scope.DatasMahasiswa.splice(index, 1);
                                notificationService.success(response.data.message);
                            } else
                                notificationService.error(response.data.message);

                        }, function (error) {
                            notificationService.error(error.data.message);
                        })
                    }
                });

        }
    })

    .controller("JenisBayarController", function (
        $scope,
        $http,
        DTOptionsBuilder,
        DTColumnBuilder,
        notificationService, AuthService
    ) {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType("full_numbers")
            .withOption("order", [0, "asc"])
            .withButtons([{
                extend: 'excelHtml5',
                customize: function (xlsx) {
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
        $scope.Init = function () {
            var UrlJenisBayar = AuthService.Base + "api/datas/read/ReadJenisBayar.php";
            $http({
                method: "GET",
                url: UrlJenisBayar,
            }).then(function (response) {
                $scope.DatasJenisBayar = response.data.records;
            },
                function (error) {
                    alert(error.message);
                })
        }

        $scope.Simpan = function () {
            $scope.DataInput.Sifat = $scope.SelectedSifats.Sifat;
            var Data = $scope.DataInput;
            var UrlSimpan = AuthService.Base + "api/datas/create/CreateJenisBayar.php";
            $http({
                method: "POST",
                url: UrlSimpan,
                data: Data
            }).then(function (response) {
                if (response.data.message > 0) {
                    $scope.DataInput.IdJenisBayar = response.data.message;
                    $scope.DatasJenisBayar.push(angular.copy($scope.DataInput));
                    notificationService.success("Successing text");
                    $scope.DataInput = {};
                }
            }, function (error) {
                notificationService.error("Gagal Simpan");
            })
        }

        $scope.DataEdit = function (item) {
            $scope.SelectedSifats.Sifat = item.Sifat;
            $scope.DataInput.Jenis = item.Jenis;
            $scope.DataInput.IdJenisBayar = item.IdJenisBayar;
        }

        $scope.Update = function () {
            $scope.DataInput.Sifat = $scope.SelectedSifats.Sifat;
            var Data = $scope.DataInput;
            var UrlUpdate = AuthService.Base + "api/datas/update/UpdateJenisBayar.php";
            $http({
                method: "POST",
                url: UrlUpdate,
                data: Data
            }).then(function (response) {
                if (response.data.message == "Success") {
                    angular.forEach($scope.DatasJenisBayar, function (value, key) {
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
            }, function (error) {
                notificationService.error("Gagal Simpan");
            })
        }
    })

    .controller("KelolahPembayaranController", function (
        $scope,
        $http,
        DTOptionsBuilder,
        DTColumnBuilder,
        notificationService, AuthService
    ) {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType("full_numbers")
            .withOption("order", [0, "desc"])
            .withButtons([{
                extend: 'excelHtml5',
                customize: function (xlsx) {
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

        $scope.Init = function () {
            var UrlTahun = AuthService.Base + "api/datas/read/ReadTahun.php";
            $http({
                method: "GET",
                url: UrlTahun
            }).then(function (response) {
                $scope.DatasTahun = response.data.records;
                var UrlBayarUmum = AuthService.Base + "api/datas/read/ReadBayarUmum.php";
                $http({
                    method: "GET",
                    url: UrlBayarUmum
                }).then(function (response) {
                    $scope.DatasBayarUmum = response.data.records;
                    var UrlBayarKhusus = AuthService.Base + "api/datas/read/ReadBayarKhusus.php";
                    $http({
                        method: "GET",
                        url: UrlBayarKhusus
                    }).then(function (response) {
                        $scope.DatasBayarKhusus = response.data.records;
                    }, function (error) {
                    })
                }, function (error) {
                })
            }, function (error) {
            })


        }
        $scope.JenisMenu;

        $scope.ReadJenis = function (item) {
            $scope.JenisMenu = item;
        }
        $scope.SelectedEdit = function (item) {
            $scope.DatasInput = angular.copy(item);
            $scope.Nilaiawal = angular.copy(item.Nominal);
        }

        $scope.TambahAngkatan = function () {
            if ($scope.JenisMenu == "Umum") {
                var UrlTambahAngkatan = AuthService.Base + "api/datas/create/CreateBayarUmum.php";
                var Data = $scope.DataInput;
                $http({
                    method: "POST",
                    url: UrlTambahAngkatan,
                    data: Data
                }).then(function (response) {
                    if (response.data[0].message == "Success") {
                        angular.forEach(response.data[0].records, function (value, key) {
                            $scope.DatasBayarUmum.push(value);
                        })
                        notificationService.success(response.data[0].message);
                        $scope.DataInput = {};
                    }

                }, function (error) {
                    notificationService.error("Data Gagal di Tambah");
                })
            } else {
                var UrlTambahTA = AuthService.Base + "api/datas/create/CreateBayarKhusus.php";
                var Data = $scope.DataInput;
                $http({
                    method: "POST",
                    url: UrlTambahTA,
                    data: Data
                }).then(function (response) {
                    if (response.data[0].message == "Success") {
                        angular.forEach(response.data[0].records, function (value, key) {
                            $scope.DatasBayarKhusus.push(value);
                        })
                        notificationService.success(response.data[0].message);
                        $scope.DataInput = {};
                    }

                }, function (error) {
                    notificationService.error("Data Gagal di Tambah");
                })
            }

        }

        $scope.UpdateNominal = function () {
            var Data = $scope.DatasInput;
            var Url = AuthService.Base + "api/datas/update/UpdateNominal.php";
            $http({
                method: "POST",
                url: Url,
                data: Data
            }).then(function (response) {
                if (response.data.message == "Khusus") {
                    angular.forEach($scope.DatasBayarKhusus, function (value, key) {
                        if (value.IdBayarKhusus == $scope.DatasInput.IdBayarKhusus) {
                            value.Nominal = $scope.DatasInput.Nominal;
                            notificationService.success("Berhasil");
                        }
                    })
                } else {
                    angular.forEach($scope.DatasBayarUmum, function (value, key) {
                        if (value.IdBayarUmum == $scope.DatasInput.IdBayarUmum) {
                            value.Nominal = $scope.DatasInput.Nominal;
                            notificationService.success("Berhasil")
                        }
                    })
                }

            }, function (error) {
                notificationService.error("Nominal Jenis Bayar Gagal di Ubah");
            })
        }
    })

    .controller("BayarKhususController", function (
        $scope,
        $http,
        DTOptionsBuilder,
        DTColumnBuilder,
        notificationService, AuthService
    ) {

    })

    .controller("CreateTAController", function (
        $scope,
        $http,
        DTOptionsBuilder,
        DTColumnBuilder,
        notificationService, AuthService
    ) {

    })

    .controller("RegistrasiController", function (
        $scope,
        $http,
        DTOptionsBuilder,
        DTColumnBuilder,
        notificationService, AuthService
    ) {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType("full_numbers")
            .withOption("order", [0, "desc"])
            .withButtons([{
                extend: 'excelHtml5',
                customize: function (xlsx) {
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
        $scope.StatusUpdate = false;
        $scope.DataHapus;
        $scope.Listkategori = ["Bayar Umum", "Bayar Khusus"];
        $scope.ListJenisBayar = [];
        $scope.showdisc = false;
        $scope.model = {};
        $scope.Instant = false;



        $scope.SetJenis = (item) => {
            if (item == "Bayar Umum") {
                $scope.ListJenisBayar = $scope.DatasAmbilMahasiswa.BayarUmum;
                $scope.Instant = false;
            } else {
                alert("Content ini item tersebut belum tersedia");
                $scope.Instant = false;
                $scope.SelectedJenisBayar = {};
            }
        }

        $scope.SetDisc = () => {
            $scope.Karyawan = false;
            var num = $scope.SelectedJenisBayar.Angkatan.length > 4;
            if ($scope.DatasAmbilMahasiswa.Potongan && $scope.DatasAmbilMahasiswa.Potongan.find(x => x.IdBayarUmum == $scope.SelectedJenisBayar.IdBayarUmum)) {
                alert("Item " + $scope.SelectedJenisBayar.JenisBayar[0].Jenis + " sudah di proses");
                $scope.Instant = false;
                $scope.showdisc = false;
            } else {
                if (num) {
                    $scope.showdisc = true;
                    $scope.Karyawan = true;
                    $scope.titledisc = "Potongan (Rp.)";
                    if ($scope.SelectedJenisBayar.Disc) {
                        $scope.SelectedJenisBayar.Total = parseInt($scope.SelectedJenisBayar.Disc);
                    } else {
                        $scope.SelectedJenisBayar.Total = parseInt($scope.SelectedJenisBayar.Disc);
                    }
                } else {
                    $scope.showdisc = true;
                    $scope.titledisc = "Potongan (%)";
                    if ($scope.SelectedJenisBayar.Disc) {
                        $scope.SelectedJenisBayar.Total = (parseInt($scope.SelectedJenisBayar.Nominal) * parseInt($scope.SelectedJenisBayar.Jumlah)) - ((parseInt($scope.SelectedJenisBayar.Nominal) * parseInt($scope.SelectedJenisBayar.Jumlah)) * (parseInt($scope.SelectedJenisBayar.Disc) / 100));
                    } else {
                        $scope.SelectedJenisBayar.Total = (parseInt($scope.SelectedJenisBayar.Nominal) * parseInt($scope.SelectedJenisBayar.Jumlah));
                    }
                }
                $scope.Instant = true;
            }


        }

        $scope.CariMahasiswa = function (npmmhs) {
            if (npmmhs != undefined) {
                $scope.DataCari = npmmhs.NPM;
                $scope.DataHapus = npmmhs;
            }
            var CekData = false;
            angular.forEach($scope.DatasMahasiswa, function (value, key) {
                if (value.NPM == $scope.DataCari) {
                    $scope.Temp = value;
                    $scope.Temp.SetStatus = $scope.SetStatus;
                    CekData = true;
                }
            })
            if (CekData == true) {
                var Data = $scope.Temp;
                var UrlCari = AuthService.Base + "api/datas/read/ReadOneMahasiswa.php";
                $http({
                    method: "POST",
                    url: UrlCari,
                    data: Data

                }).then(function (response) {
                    if ($scope.Potongan) {
                        $scope.DatasAmbilMahasiswa = response.data;
                        var Url = "https://restsimak.stimiksepnop.ac.id/api/sksMahasiswa/AmbilSks?npm=" + $scope.DataCari;
                        $http({
                            method: "GET",
                            url: Url,
                        }).then(function (param) {
                            if (param.data.data.SKS != 0) {
                                angular.forEach($scope.DatasAmbilMahasiswa.BayarUmum, function (value, key) {
                                    value.Check = true;
                                    value.SetDisabled = false;
                                    value.JenisBayar.forEach(x => {
                                        if (x.Jenis == "Variable Cost (Per SKS)") {
                                            if (param.data.data.SKS <= 12) {
                                                value.Jumlah = 0;
                                                $scope.HitungTotal();
                                            } else {
                                                value.Jumlah = parseInt(param.data.data.SKS) - 12;
                                                $scope.HitungTotal();
                                            }

                                        }
                                        if (x.Jenis == "Praktikum") {
                                            value.Jumlah = parseInt(param.data.data.Praktikum);
                                            $scope.HitungTotal();
                                        }
                                    })
                                })
                                $scope.DatasAmbilMahasiswa.BayarKhusus.forEach(x => {
                                    x.SetDisabled = true;
                                    x.Check = false;
                                })

                                angular.forEach($scope.DatasAmbilMahasiswa.BayarKhusus, function (value, key) {
                                    if ($scope.DatasAmbilMahasiswa.DetailBayarKhusus.length > 0) {
                                        angular.forEach($scope.DatasAmbilMahasiswa.DetailBayarKhusus, function (detail) {
                                            if (value.IdBayarKhusus == detail.IdBayarKhusus) {
                                                $scope.DataTotal += parseInt(value.Nominal);
                                                value.Check = true;
                                                value.SetDisabled = false;
                                            }
                                        })
                                    } else {
                                        if ((value.JenisBayar[0].IdJenisBayar == "29" || value.JenisBayar[0].IdJenisBayar == "31") && param.data.data.Riset == true) {
                                            $scope.DataTotal += parseInt(value.Nominal);
                                            value.Check = true;
                                            value.SetDisabled = false;
                                        } else if (value.JenisBayar[0].IdJenisBayar == "30" && param.data.data.KP == true) {
                                            $scope.DataTotal += parseInt(value.Nominal);
                                            value.Check = true;
                                            value.SetDisabled = false;
                                        } else {
                                            value.SetDisabled = true;
                                        }
                                    }
                                })
                                // $scope.ListJenisBayar=[{"Bayar Umum":$scope.DatasAmbilMahasiswa.BayarUmum}, {"Bayar Khusus":$scope.DatasAmbilMahasiswa.BayarKhusus}];
                            } else {
                                alert("Mahasiswa Belum mengajukan KRS");
                            }
                        })

                        $scope.ShowData = true;
                        $scope.HideData = false;
                    } else {
                        if (response.status == 200) {
                            $scope.DatasAmbilMahasiswa = response.data;

                            if ($scope.SetStatus == "TampilUmum") {
                                var Url = "https://restsimak.stimiksepnop.ac.id/api/sksMahasiswa/AmbilSks?npm=" + $scope.DataCari;
                                $http({
                                    method: "GET",
                                    url: Url,
                                }).then(function (response) {
                                    if (response.data.data.SKS != 0) {
                                        angular.forEach($scope.DatasAmbilMahasiswa.BayarUmum, function (value, key) {
                                            $scope.DataTotal += parseInt(value.Nominal);
                                            value.Check = true;
                                            value.SetDisabled = false;
                                            value.JenisBayar.forEach(x => {
                                                if (x.Jenis == "Variable Cost (Per SKS)") {
                                                    if (response.data.data.SKS <= 12) {
                                                        value.Jumlah = 0;
                                                        $scope.HitungTotal();
                                                    } else {
                                                        value.Jumlah = parseInt(response.data.data.SKS) - 12;
                                                        $scope.HitungTotal();
                                                    }

                                                }
                                                if (x.Jenis == "Praktikum") {
                                                    value.Jumlah = parseInt(response.data.data.Praktikum);
                                                    $scope.HitungTotal();
                                                }
                                            })
                                        })
                                    } else {
                                        alert("Mahasiswa Belum mengajukan KRS");
                                    }
                                })

                                $scope.ShowData = true;
                                $scope.HideData = false;
                            } else if ($scope.SetStatus == "TampilKhusus") {
                                var Url = "https://restsimak.stimiksepnop.ac.id/api/sksMahasiswa/AmbilSks?npm=" + $scope.DataCari;
                                $http({
                                    method: "GET",
                                    url: Url,
                                }).then(params => {
                                    $scope.DataTotal = 0;
                                    $scope.DatasAmbilMahasiswa.BayarKhusus.forEach(x => {
                                        x.SetDisabled = true;
                                        x.Check = false;
                                    })
                                    angular.forEach($scope.DatasAmbilMahasiswa.BayarKhusus, function (value, key) {
                                        if ($scope.DatasAmbilMahasiswa.DetailBayarKhusus.length > 0) {
                                            angular.forEach($scope.DatasAmbilMahasiswa.DetailBayarKhusus, function (detail) {
                                                if (value.IdBayarKhusus == detail.IdBayarKhusus) {
                                                    $scope.DataTotal += parseInt(value.Nominal);
                                                    value.Check = true;
                                                    value.SetDisabled = false;
                                                }
                                            })
                                        } else {
                                            if ((value.JenisBayar[0].IdJenisBayar == "29" || value.JenisBayar[0].IdJenisBayar == "31") && params.data.data.Riset == true) {
                                                $scope.DataTotal += parseInt(value.Nominal);
                                                value.Check = true;
                                                value.SetDisabled = false;
                                            } else if (value.JenisBayar[0].IdJenisBayar == "30" && params.data.data.KP == true) {
                                                $scope.DataTotal += parseInt(value.Nominal);
                                                value.Check = true;
                                                value.SetDisabled = false;
                                            } else {
                                                value.SetDisabled = true;
                                            }
                                        }
                                    })
                                    $scope.StatusUpdate = true;
                                    $scope.ShowDataKhusus = true;
                                    $scope.HideDataKhusus = false;
                                    $scope.ShowIdentitas2 = false;
                                    $scope.HideIdentitas2 = true;
                                })

                            } else {
                                $scope.ShowDataKhusus = false;
                                $scope.HideDataKhusus = true;
                                $scope.ShowData = false;
                                $scope.HideData = true;
                            }

                        } else {
                            alert(response.data.message);
                        }
                    }
                })
            } else {
                notificationService.error("Mahasiswa Belum Terdaftar");
            }
        }
        $scope.SetShowCari = function (item) {
            if (item == "TampilUmum") {
                $scope.ShowCari == true;
                $scope.HideCari = false;
                $scope.ShowData = false;
                $scope.HideData = true;
                $scope.ShowIdentitas1 = true;
                $scope.HideIdentitas1 = false;
                $scope.ShowIdentitas2 = true;
                $scope.HideIdentitas2 = false;
                $scope.SetStatus = angular.copy(item);
                $scope.SetDataProses = "Umum";
                $scope.Potongan = false;
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
                $scope.Potongan = false;
            } else if (item == "TampilPotongan") {
                $scope.ShowCari = true;
                $scope.HideCari = false;
                $scope.ShowData = false;
                $scope.HideData = true;
                $scope.ShowDataKhusus = false;
                $scope.HideDataKhusus = true;
                $scope.ShowIdentitas2 = false;
                $scope.HideIdentitas2 = true;
                $scope.ShowIdentitas1 = false;
                $scope.HideIdentitas1 = true;
                $scope.SetStatus = angular.copy(item);
                $scope.Potongan = true;
                $scope.SetDataProses;
            } else {
                $scope.SetStatus = "Tambahan";
                $scope.ShowCari = true;
                $scope.HideCari = false;
                $scope.ShowData = false;
                $scope.HideData = true;
                $scope.ShowDataKhusus = false;
                $scope.HideDataKhusus = true;
                $scope.ShowIdentitas2 = false;
                $scope.HideIdentitas2 = true;
                $scope.ShowIdentitas1 = false;
                $scope.HideIdentitas1 = true
                $scope.SetStatus;
                $scope.SetDataProses;
                $scope.Potongan = false;
            }
        }
        $scope.DataTA = [];
        $scope.DatasBayarMahasiswa = [];
        $scope.Init = function () {
            var UrlGetMahasiswa = AuthService.Base + "api/datas/read/ReadMahasiswa.php";
            $http({
                method: "GET",
                url: UrlGetMahasiswa
            }).then(function (response) {
                if (response.status == 200) {
                    $scope.DatasMahasiswa = response.data.records;
                }
            })

            var UrlGetDataTA = AuthService.Base + "api/datas/read/ReadTA.php";
            $http({
                method: "GET",
                url: UrlGetDataTA
            }).then(function (response) {
                if (response.status == 200) {
                    $scope.DataTA = response.data;
                    $scope.DataTA.reverse();
                }
            })

            var Url = AuthService.Base + "api/datas/read/ReadStatusBayar.php";
            $http({
                method: "GET",
                url: Url
            }).then(function (response) {
                if (response.status == 200) {
                    $scope.DatasBayarMahasiswa = response.data;
                    // $scope.DatasBayarMahasiswa.reverse();
                }
            })
        }
        $scope.Simpan = function () {
            var Data = $scope.DataInput;
            var UrlCreateMahasiswa = AuthService.Base + "api/datas/create/CreateMahasiswa.php";
            $http({
                method: "POST",
                url: UrlCreateMahasiswa,
                data: Data
            }).then(function (response) {
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
        $scope.SimpanPotongan = (item) => {
            item.IdMahasiswa = $scope.DatasAmbilMahasiswa.IdMahasiswa;
            item.TA = $scope.DatasAmbilMahasiswa.TAAktif.TA;
            console.log(item);

            var Data = angular.copy(item);
            var UrlCreate = AuthService.Base + "api/datas/create/CreatePotonganUmum.php";
            $http({
                method: "POST",
                url: UrlCreate,
                data: Data
            }).then(function (response) {
                $scope.SetShowCari("TampilPotongan");
                notificationService.success("Mahasiswa berhasil ditambahkan!!!");
            }, error => {
                notificationService.error(error.data.message);
            })
        }
        $scope.DataProses = {};
        $scope.DataTampung = {};
        $scope.HitungTotal = function () {
            $scope.DataTotal = 0;
            if ($scope.SetStatus == "TampilKhusus") {
                $scope.DataTampung = angular.copy($scope.DatasAmbilMahasiswa.BayarKhusus);
                angular.forEach($scope.DataTampung, function (value, key) {
                    if (value.Check == true && value.Nominal != undefined) {
                        value.Nominal = parseInt(value.Nominal);
                        $scope.DataTotal += parseInt(value.Nominal);
                    }
                })
            } else {
                $scope.DataTampung = angular.copy($scope.DatasAmbilMahasiswa.BayarUmum);
                angular.forEach($scope.DataTampung, function (value, key) {
                    if (value.Check == true && value.Jumlah != "") {
                        value.Nominal = parseInt(value.Nominal) * parseInt(value.Jumlah);
                        $scope.DataTotal += parseInt(value.Nominal);
                    }
                })
            }

        }
        $scope.HitungTotaCheck = function (item) {
            if (item.Check == true) {
                item.Check = false;
                item.SetDisabled = true;
            } else {
                item.Check = true;
                item.SetDisabled = false;
            }


            if ($scope.DatasAmbilMahasiswa.BayarUmum.length != 0) {
                $scope.DataTotal = 0;
                angular.forEach($scope.DatasAmbilMahasiswa.BayarUmum, function (value, key) {
                    if (value.Check == true)
                        $scope.DataTotal += parseInt(value.Nominal);
                })
            } else {
                $scope.DataTotal = 0;
                angular.forEach($scope.DatasAmbilMahasiswa.BayarKhusus, function (value, key) {
                    if (value.Check == true)
                        $scope.DataTotal += parseInt(value.Nominal);
                })
            }

        }


        $scope.Proses = function () {
            $scope.DataInput.IdMahasiswa = $scope.DatasAmbilMahasiswa.IdMahasiswa;
            $scope.DataInput.TA = $scope.DatasAmbilMahasiswa.TAAktif.TA;
            $scope.DataInput.Jumlah = $scope.DataTotal;

            var Data = $scope.DataInput;
            var UrlProses;
            if ($scope.SetDataProses == "Umum") {
                $scope.DataInput.SendBayarUmum = $scope.DatasAmbilMahasiswa.BayarUmum;
                UrlProses = AuthService.Base + "api/datas/create/CreateDetailBayar.php";
            } else {
                if ($scope.StatusUpdate == false) {
                    $scope.DataInput.SendBayarKhusus = $scope.DatasAmbilMahasiswa.BayarKhusus;
                    UrlProses = AuthService.Base + "api/datas/update/UpdateDetailBayar.php";
                } else {
                    $scope.DataInput.SendBayarKhusus = $scope.DatasAmbilMahasiswa.BayarKhusus;
                    UrlProses = AuthService.Base + "api/datas/update/UpdateBayarKhusus.php";
                }
            }
            $http({
                method: "POST",
                url: UrlProses,
                data: Data
            }).then(function (response) {
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
                    $scope.ShowIdentitas2 = true;
                    $scope.HideIdentitas2 = false;
                    $scope.DataTotal = 0;
                    $scope.DataCari = "";
                    if ($scope.SetStatus == "TampilUmum") {
                        var index = $scope.DatasBayarMahasiswa.umum.indexOf($scope.DataHapus);
                        $scope.DatasBayarMahasiswa.umum.splice(index, 1);
                        notificationService.success(response.data.message);
                    } else {
                        var index = $scope.DatasBayarMahasiswa.khusus.indexOf($scope.DataHapus);
                        $scope.DatasBayarMahasiswa.khusus.splice(index, 1);
                        notificationService.success(response.data.message);
                    }
                } else {
                    notificationService.error(response.data.message);
                }
            })
        }

        $scope.SimpanDataLama = function () {
            $scope.DatasAmbilMahasiswa.TotalTagihan = $scope.DataInput.TotalTagihan;
            $scope.DatasAmbilMahasiswa.TotalPembayaran = $scope.DataInput.TotalPembayaran;
            $scope.DatasAmbilMahasiswa.TotalTunggakan = $scope.DataInput.TotalTunggakan;
            $scope.DatasAmbilMahasiswa.TA = $scope.DataInput.TA.TA;
            var Data = $scope.DatasAmbilMahasiswa;
            var Url = AuthService.Base + "api/datas/create/CreateMasterBayar.php";
            $http({
                method: "POST",
                url: Url,
                data: Data
            }).then(function (response) {
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

        $scope.SelectItem = function (item) {
            $scope.DataInput = angular.copy(item);
        }

        $scope.ClearData = function () {
            $scope.DataInput = {};
        }
        $scope.Update = function () {
            var UrlUpdateMahasiswa = AuthService.Base + "api/datas/update/UpdateMahasiswa.php";
            $http({
                method: "POST",
                url: UrlUpdateMahasiswa,
                data: $scope.DataInput
            }).then(function (response) {
                if (response.status == 200) {
                    angular.forEach($scope.DatasMahasiswa, function (value, key) {
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

    .controller("PenggunaController", function (
        $scope,
        $http,
        notificationService, AuthService
    ) {
        $scope.DatasPengguna = [];
        $scope.DataInput = {};
        $scope.Init = function () {
            var Kategoriurl = AuthService.Base + "api/datas/read/ReadPengguna.php";
            $http({
                method: "Get",
                url: Kategoriurl
            }).then(
                function (response) {
                    $scope.DatasPengguna = response.data.records;
                },
                function (error) {
                    alert(error.message);
                }
            );
        };
        $scope.Simpan = function () {
            var Data = $scope.DataInput;
            var InsertUrl = AuthService.Base + "api/datas/create/CreatePengguna.php";
            $http({
                method: "POST",
                url: InsertUrl,
                data: Data
            }).then(
                function (response) {
                    if (response.data.message > 0) {
                        $scope.DataInput.idpengguna = response.data.message;
                        $scope.DatasPengguna.push(angular.copy($scope.DataInput));
                        notificationService.success("Data Berhasil di Simpan");
                    }
                },
                function (error) {
                    notificationService.error("Gagal Simpan");
                }
            );
        };
    })

    .controller("PembayaranMahasiswaController", function (
        $scope,
        $http,
        notificationService, AuthService
    ) {
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
        $scope.Hide = true;
        $scope.DataPrint = [];
        $scope.total = 0;
        $scope.ListPotongan = [];

        $scope.PrintBA = function (Kartu) {

            var innerContents = document.getElementById(Kartu).innerHTML;
            var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWinindow.document.open();
            popupWinindow.document.write('<html><head><link href="assets/css/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet"><link href="assets/css/main.css" rel="stylesheet"><link href="assets/css/table.css" rel="stylesheet"></head><body onload="window.print()"><div>' + innerContents + '</html>');
            popupWinindow.document.close();
        }

        $scope.Init = function () {
            // $http({
            //     method: "GET",
            //     url: AuthService.Base + "api/datas/read/ReadDataPembayaran.php"
            // }).then(function (response) {
            //     if (response.status == 200) {
            //         $scope.DataPembayaran = response.data;
            //     }
            // })
        }
        $scope.CariMahasiswa = function () {
            if ($scope.DataCari.length == 9) {
                $scope.DataInput = {};
                var a = false;
                $http({
                    method: "GET",
                    url: AuthService.Base + "api/datas/read/ReadDataPembayaran.php?npm=" + $scope.DataCari
                }).then(function (response) {
                    if (response.status == 200) {
                        $scope.DataPembayaran = response.data;
                        if ($scope.DataPembayaran.Mahasiswa.NPM == $scope.DataCari) {
                            $scope.DataInput = angular.copy($scope.DataPembayaran.Mahasiswa);
                            a = true;
                        }
                        if (a == true) {
                            $scope.ShowInputPembayaran = true;
                            $scope.HideInputPembayaran = false;
                        } else {
                            $scope.ShowInputPembayaran = false;
                            $scope.HideInputPembayaran = true;
                        }
                    }
                })

            }
        }
        $scope.CariInformasi = function () {
            $scope.DataInformation = [];
            $scope.DataPrint = [];
            $scope.DataTotal.Total = 0;
            $scope.DataTotal.Bayar = 0;
            $scope.DataTotal.Tunggakan = 0;
            if ($scope.DataCari.length == 9) {
                $http({
                    method: "GET",
                    url: AuthService.Base + "api/datas/read/ReadDataPembayaran.php?npm=" + $scope.DataCari
                }).then(function (response) {
                    if (response.status == 200) {
                        $scope.DataPembayaran = response.data;
                        var a = false;
                        if ($scope.DataPembayaran.Mahasiswa.NPM == $scope.DataCari) {
                            $scope.DataInformation = angular.copy($scope.DataPembayaran.Mahasiswa);
                            angular.forEach($scope.DataInformation.MasterBayar, function (value1, key1) {
                                $scope.DataBayarKhusus = 0;
                                angular.forEach(value1.BayarKhusus, function (value2) {
                                    $scope.DataBayarKhusus += parseInt(angular.copy(value2.Nominal));
                                })

                                value1.Total = parseInt(value1.Total);
                                angular.forEach(value1.BayarUmum, function (value3) {
                                    if (value3.Potongan) {
                                        $scope.ListPotongan.push(angular.copy(value3))
                                        value1.Total -= parseInt(angular.copy(value3.Potongan.Nominal));
                                    }

                                })
                                $scope.DataTotal.Total += parseInt(value1.Total);
                                $scope.DataTotal.Bayar += parseInt(value1.Bayar);
                                value1.Tunggakan = value1.Total - parseInt(value1.Bayar);
                                $scope.DataTotal.Tunggakan += parseInt(value1.Tunggakan);
                            })
                            a = true;
                            $http({
                                method: "get",
                                url: AuthService.Base + "api/datas/read/ReadTA.php"
                            }).then(param => {
                                param.data.forEach(response => {
                                    if (response.Status == "Aktif") {
                                        var b = response.TA.split("-");
                                        $scope.DataInformation.TA = b[0];
                                        if (b[1] == "1") {
                                            $scope.DataInformation.Semester = "GANJIL";
                                        } else {
                                            $scope.DataInformation.Semester = "GENAP";
                                        }

                                    }
                                })
                            })
                        }

                        if (a == true) {
                            $scope.ShowDetailPembayaran = true;
                            $scope.HideDetailPembayaran = false;
                        } else {
                            $scope.ShowDetailPembayaran = false;
                            $scope.HideDetailPembayaran = true;
                        }
                    }
                })
            }
        }
        $scope.Simpan = function () {
            $http({
                method: "POST",
                url: AuthService.Base + "api/datas/create/CreatePembayaran.php",
                data: $scope.DataInput
            }).then(function (response) {
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
                    angular.forEach($scope.DataPembayaran.Mahasiswa, function (value, key) {
                        if (value.IdMahasiswa == $scope.DataInput.IdMahasiswa) {
                            angular.forEach(value.MasterBayar, function (value1, key1) {
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
        $scope.Clear = function (item) {
            // $scope.DataInput={};
            $scope.DataCari = "";
            $scope.DataInput = {};
            if (item == "cari")
                $scope.CariInformasi();
            else
                $scope.CariMahasiswa();
        }
        $scope.TotalBayar = {};
        $scope.PrintTerbayar = 0;
        $scope.PrintTotalBayar = 0;
        $scope.PrintTotalTunggakan = 0;
        $scope.Piutang = 0;
        $scope.ShowDataTagihan = function (item) {
            $scope.PrintBayar = item.Bayar;
            $scope.PrintTotal = item.Total;
            $scope.PrintTunggakan = item.Tunggakan;
            $scope.DataPrint = [];
            $scope.TotalBayar = {};
            var TA = item.TA.split('-');
            var thakademik = TA[0];
            var gg = "";
            if (TA[1] == "1") {
                gg = "GANJIL";
            } else {
                gg = "GENAP";
            }

            var Url = "https://restsimak.stimiksepnop.ac.id/api/sksMahasiswa/AmbilSks?npm=" + $scope.DataCari + "&thakademik=" + thakademik + "&gg=" + gg;
            $http({
                method: "GET",
                url: Url,
            }).then(function (response) {
                if (response.data.data.SKS != 0) {
                    $scope.Praktikum = 0;
                    $scope.sks = 0;
                    if (response.data.data.SKS <= 12) {
                        $scope.sks = 0;
                    } else {
                        $scope.sks = parseInt(response.data.data.SKS) - 12;
                    }
                    $scope.Praktikum = parseInt(response.data.data.Praktikum);
                    $scope.DatasTagihan = angular.copy(item);
                    $scope.TotalBayar.BayarKhusus = 0;
                    $scope.TotalBayar.IndexBayarKhusus;
                    $scope.TotalBayar.BayarUmum = 0;
                    $scope.TotalBayar.IndexBayarUmum;
                    $scope.total = 0;
                    angular.forEach($scope.DatasTagihan.BayarKhusus, function (value, key) {
                        angular.forEach($scope.DataPembayaran.BayarKhusus, function (value1, key1) {
                            if (value.IdBayarKhusus == value1.IdBayarKhusus) {
                                angular.forEach($scope.DataPembayaran.JenisBayar, function (value2, key2) {
                                    if (value1.IdJenisBayar == value2.IdJenisBayar) {
                                        value.Jenis = value2.Jenis;
                                        $scope.DataPrint.push(angular.copy(value));
                                    } else {
                                        // $scope.DataPrint.push(angular.copy(value));
                                    }
                                })
                            }
                        })
                        $scope.TotalBayar.BayarKhusus += parseInt(value.Nominal);
                    })
                    $scope.TotalBayar.IndexBayarKhusus = $scope.DatasTagihan.BayarKhusus.length;
                    angular.forEach($scope.DatasTagihan.BayarUmum, function (value, key) {
                        angular.forEach($scope.DataPembayaran.BayarUmum, function (value1, key1) {
                            if (value.IdBayarUmum == value1.IdBayarUmum) {
                                angular.forEach($scope.DataPembayaran.JenisBayar, function (value2, key2) {
                                    if (value1.IdJenisBayar == value2.IdJenisBayar) {
                                        if (value2.Jenis == "Variable Cost (Per SKS)") {
                                            value.Jenis = "Variable Cost (" + $scope.sks + ")";
                                            value.Nominal = value.Nominal * $scope.sks;
                                            $scope.DataPrint.push(angular.copy(value));
                                        }
                                        else if (value2.Jenis == "Praktikum") {
                                            value.Jenis = value2.Jenis + " (" + $scope.Praktikum + ")";
                                            value.Nominal = value.Nominal * $scope.Praktikum;
                                            $scope.DataPrint.push(angular.copy(value));
                                        } else {
                                            value.Jenis = value2.Jenis;
                                            $scope.DataPrint.push(angular.copy(value));
                                        }
                                    }
                                })
                            }
                        });
                        $scope.TotalBayar.BayarUmum += parseInt(value.Nominal);
                        if(value.Potongan){
                            $scope.TotalBayar.BayarUmum -= parseInt(value.Potongan.Nominal);
                            if($scope.DataPembayaran.Mahasiswa.Angkatan.length>4){
                                value.Jenis = value.Jenis + ", Disc Rp. " + value.Potongan.Disc;
                                
                            }else{
                                value.Jenis = value.Jenis + ", Disc " + value.Potongan.Disc + "%";
                                value.Nominal -= parseInt(value.Potongan.Nominal);
                            }
                        }
                    });
                    $scope.TotalBayar.IndexBayarUmum = $scope.DatasTagihan.BayarUmum.length + 1;
                } else {
                    alert("Mahasiswa Belum mengajukan KRS");
                }
            })

        }
        $scope.DetailBayar;
        $scope.ShowDataPembayaran = function (item) {
            $scope.DetailBayar = angular.copy(item);
            $scope.DetailBayar.Total = 0;
            angular.forEach($scope.DetailBayar.TrxBayar, function (value, key) {
                $scope.DetailBayar.Total += parseInt(angular.copy(value.JumlahBayar));
            })
        }
    })
    .controller("LaporanController", function (
        $scope,
        $http,
        DTOptionsBuilder,
        DTColumnBuilder,
        notificationService, AuthService
    ) {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType("full_numbers")
            .withOption("order", [0, "asc"])
            .withButtons([{
                extend: 'excelHtml5',
                footer: true,
                customize: function (xlsx) {
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
                title: "Laporan Kuangan",
                footer: true,
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

        $scope.Init = function () {
            $http({
                method: "GET",
                url: AuthService.Base + "api/datas/read/ReadDataPembayaran.php"
            }).then(function (response) {
                if (response.status == 200) {
                    $scope.DataPembayaran = response.data;
                }

            })
        }

        $scope.CariInformasi = function () {
            $scope.DataInformation = [];
            var a = false;
            angular.forEach($scope.DataPembayaran.Mahasiswa, function (value, key) {
                if (value.NPM == $scope.DataCari) {
                    $scope.DataInformation = angular.copy(value);
                    angular.forEach($scope.DataInformation.MasterBayar, function (value1, key1) {
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
        $scope.CariTA = function () {
            $scope.DataTA = [];
            $scope.TotalTA = {};
            $scope.TotalTA.Total = 0;
            $scope.TotalTA.Bayar = 0;
            $scope.TotalTA.Tunggakan = 0;
            var b = false;
            angular.forEach($scope.DataPembayaran.Mahasiswa, function (value, key) {
                var a = {};
                a.NPM = value.NPM;
                a.NamaMahasiswa = value.NamaMahasiswa;
                a.Total = 0;
                a.Bayar = 0;
                a.Tunggakan = 0;

                angular.forEach(value.MasterBayar, function (value1, key1) {
                    if (value1.TA == $scope.DataInput.TA) {
                        var panjang = Object.entries(value1.Potongan).length;
                        if(value1.Potongan){
                            value1.Potongan.forEach(x=>{
                                value1.Total = parseInt(value1.Total) - parseInt(x.Nominal);
                            })
                        }
                        value1.Tunggakan= value1.Total -  parseInt(value1.Bayar);
                        value1.Bayar = parseInt(value1.Bayar);
                        a.Total = value1.Total;
                        a.Bayar = value1.Bayar;
                        a.Tunggakan = value1.Tunggakan;
                        $scope.TotalTA.Total += value1.Total;
                        $scope.TotalTA.Bayar += value1.Bayar;
                        $scope.TotalTA.Tunggakan += value1.Tunggakan;
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
        $scope.DataKeseluruhan = function () {
            var temp = {};
            $scope.TotalTAALL = 0;
            $scope.DataTotal = [];
            $scope.TotalTA.Total = 0;
            $scope.TotalTA.Bayar = 0;
            $scope.TotalTA.Tunggakan = 0;
            angular.forEach($scope.DataPembayaran.DataTA, function (valueTA, KeyTA) {
                temp.TA = angular.copy(valueTA.TA);
                temp.Total = 0;
                temp.Bayar = 0;
                temp.Tunggakan = 0;
                angular.forEach($scope.DataPembayaran.Mahasiswa, function (valueMahasiswa, keyMahasiswa) {
                    angular.forEach(valueMahasiswa.MasterBayar, function (valueMasterBayar, KeyMasterbayar) {
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
        $scope.Clear = function (item) {
            // $scope.DataInput={};
            $scope.DataCari = "";
            $scope.DataInput = {};
            if (item == "CariTA")
                $scope.CariTA();
            else
                $scope.DataKeseluruhan();


        }
    })
    .controller("IndexController", function (
        $scope,
        $http,
        notificationService, AuthService
    ) {
        $scope.DataInformation = [];
        $scope.DataPembayaran = [];
        $scope.DataCari = "";
        $scope.DataTotal = {};
        $scope.ShowPengumuman = true;
        $scope.HidePengumuman = false;
        $scope.ShowPembayaran = false;
        $scope.HidePembayran = true;
        $scope.Init = function () {
            $http({
                method: "GET",
                url: AuthService.Base + "api/datas/read/ReadDataPembayaran.php"
            }).then(function (response) {
                if (response.status == 200) {
                    $scope.DataPembayaran = response.data;
                }
            })
            $scope.ShowPengumuman = true;
            $scope.HidePengumuman = false;
            $scope.ShowPembayaran = false;
            $scope.HidePembayran = true;
        }
        $scope.CariInformasi = function () {
            $scope.DataInformation = [];
            $scope.DataTotal.Total = 0;
            $scope.DataTotal.Bayar = 0;
            $scope.DataTotal.Tunggakan = 0;
            var a = false;
            angular.forEach($scope.DataPembayaran.Mahasiswa, function (value, key) {
                if (value.NPM == $scope.DataCari) {
                    $scope.DataInformation = angular.copy(value);
                    angular.forEach($scope.DataInformation.MasterBayar, function (value1, key1) {
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
        $scope.ShowDataTagihan = function (item) {
            $scope.TotalBayar = {};
            $scope.DatasTagihan = item;
            $scope.TotalBayar.BayarKhusus = 0;
            $scope.TotalBayar.IndexBayarKhusus;
            $scope.TotalBayar.BayarUmum = 0;
            $scope.TotalBayar.IndexBayarUmum;
            angular.forEach($scope.DatasTagihan.BayarKhusus, function (value, key) {
                angular.forEach($scope.DataPembayaran.BayarKhusus, function (value1, key1) {
                    if (value.IdBayarKhusus == value1.IdBayarKhusus) {
                        angular.forEach($scope.DataPembayaran.JenisBayar, function (value2, key2) {
                            if (value1.IdJenisBayar == value2.IdJenisBayar) {
                                value.Jenis = value2.Jenis;
                            }
                        })
                    }
                })
                $scope.TotalBayar.BayarKhusus += parseInt(value.Nominal);
            })
            $scope.TotalBayar.IndexBayarKhusus = $scope.DatasTagihan.BayarKhusus.length;
            angular.forEach($scope.DatasTagihan.BayarUmum, function (value, key) {
                angular.forEach($scope.DataPembayaran.BayarUmum, function (value1, key1) {
                    if (value.IdBayarUmum == value1.IdBayarUmum) {
                        angular.forEach($scope.DataPembayaran.JenisBayar, function (value2, key2) {
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