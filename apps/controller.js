angular
    .module("Ctrl", ["datatables", "datatables.buttons", "jlareau.pnotify", "pdfjsViewer"])

    .controller("UserSession", function ($scope, $http) {
        $scope.session = {};
        var Urlauth = "api/datas/read/auth.php";
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

    .controller("MainController", function ($scope, $http) {
        $scope.a = "Testing";
        $scope.session = {};
        var Urlauth = "api/datas/read/auth.php";
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

    .controller("LoginController", function ($scope, $http) {
        $scope.DatasLogin = {};
        $scope.Login = function () {
            var UrlLogin = "api/datas/read/UserLogin.php";
            var Data = angular.copy($scope.DatasLogin);
            $http({
                method: "POST",
                url: UrlLogin,
                data: Data
            }).then(function (response) {
                if (response.data.Session != undefined) {
                    if (response.data.Session.Level == "Pembayaran")
                        window.location.href = "admin.html";
                    else {
                        window.location.href = "pejabat.html";
                    }


                } else
                    alert(response.data.message);

            }, function (error) {
                alert(error.data.message);
            })
        }

    })

    .controller("MahasiswaController", function (
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
            var InsertUrl = "api/datas/create/CreateMahasiswa.php";
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
                    }
                },
                function (error) {
                    notificationService.error("Gagal Simpan");
                }
            );
        };

        $scope.Init = function () {
            var UrlGetMahasiswa = "api/datas/read/ReadMahasiswa.php";
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
    })

    .controller("JenisBayarController", function (
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
            var UrlJenisBayar = "api/datas/read/ReadJenisBayar.php";
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
            var UrlSimpan = "api/datas/create/CreateJenisBayar.php";
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
            var UrlUpdate = "api/datas/update/UpdateJenisBayar.php";
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
        notificationService
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
            var UrlTahun = "api/datas/read/ReadTahun.php";
            $http({
                method: "GET",
                url: UrlTahun
            }).then(function (response) {
                $scope.DatasTahun = response.data.records;
            }, function (error) {
                // notificationService.error("Gagal Mengambil Data");
            })

            var UrlBayarUmum = "api/datas/read/ReadBayarUmum.php";
            $http({
                method: "GET",
                url: UrlBayarUmum
            }).then(function (response) {
                $scope.DatasBayarUmum = response.data.records;
            }, function (error) {
                // notificationService.error("Gagal Mengambil Data");
            })

            var UrlBayarKhusus = "api/datas/read/ReadBayarKhusus.php";
            $http({
                method: "GET",
                url: UrlBayarKhusus
            }).then(function (response) {
                $scope.DatasBayarKhusus = response.data.records;
            }, function (error) {
                // notificationService.error("Gagal Mengambil Data");
            })
        }
        $scope.JenisMenu;

        $scope.ReadJenis = function (item) {
            $scope.JenisMenu = item;
        }
        $scope.SelectedEdit = function (item) {
            $scope.DatasInput = angular.copy(item);

        }

        $scope.TambahAngkatan = function () {
            if ($scope.JenisMenu == "Umum") {
                var UrlTambahAngkatan = "api/datas/create/CreateBayarUmum.php";
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
                var UrlTambahTA = "api/datas/create/CreateBayarKhusus.php";
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
            var Url = "api/datas/update/UpdateNominal.php";
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
        notificationService
    ) {

    })

    .controller("CreateTAController", function (
        $scope,
        $http,
        DTOptionsBuilder,
        DTColumnBuilder,
        notificationService
    ) {

    })

    .controller("RegistrasiController", function (
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


        $scope.CariMahasiswa = function () {
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
                var UrlCari = "api/datas/read/ReadOneMahasiswa.php";
                $http({
                    method: "POST",
                    url: UrlCari,
                    data: Data

                }).then(function (response) {
                    if (response.status == 200) {
                        $scope.DatasAmbilMahasiswa = response.data;

                        if ($scope.SetStatus == "TampilUmum") {
                            angular.forEach($scope.DatasAmbilMahasiswa.BayarUmum, function (value, key) {
                                $scope.DataTotal += parseInt(value.Nominal);
                                value.Check = true;
                                value.SetDisabled = false;

                            })
                            $scope.ShowData = true;
                            $scope.HideData = false;
                        } else {
                            angular.forEach($scope.DatasAmbilMahasiswa.BayarKhusus, function (value, key) {
                                $scope.DataTotal += parseInt(value.Nominal);
                                value.Check = true;
                                value.SetDisabled = false;
                            })
                            $scope.ShowDataKhusus = true;
                            $scope.HideDataKhusus = false;
                        }

                    } else {
                        alert(response.data.message);
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
                $scope.SetStatus = angular.copy(item);
                $scope.SetDataProses = "Umum";
            } else if (item == "TampilKhusus") {
                $scope.ShowCari == true;
                $scope.HideCari = false;
                $scope.ShowDataKhusus = false;
                $scope.HideDataKhusus = true;
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
        $scope.Init = function () {
            var UrlGetMahasiswa = "api/datas/read/ReadMahasiswa.php";
            $http({
                method: "GET",
                url: UrlGetMahasiswa
            }).then(function (response) {
                if (response.data.message != undefined) {
                    notificationService.error(response.data.message);
                } else
                    $scope.DatasMahasiswa = response.data.records;
            })
        }
        $scope.Simpan = function () {
            var Data = $scope.DataInput;
            var UrlCreateMahasiswa = "api/datas/create/CreateMahasiswa.php";
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

        $scope.DataProses = {};
        $scope.HitungTotal = function () {
            $scope.DataTotal = 0;
            angular.forEach($scope.DatasAmbilMahasiswa.BayarUmum, function (value, key) {
                if (value.Check == true)
                    $scope.DataTotal += parseInt(value.Nominal);
            })
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
            if ($scope.SetDataProses == "Umum")
                UrlProses = "api/datas/create/CreateDetailBayar.php";
            else
                UrlProses = "api/datas/update/UpdateDetailBayar.php";

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
                    $scope.DataTotal = 0;
                    $scope.DataCari;
                    notificationService.success(response.data.message);
                } else {
                    notificationService.error(response.data.message);
                }
            })

        }

        $scope.SimpanDataLama = function () {
            $scope.DatasAmbilMahasiswa.TotalTagihan = $scope.DataInput.TotalTagihan;
            $scope.DatasAmbilMahasiswa.TotalPembayaran = $scope.DataInput.TotalPembayaran;
            $scope.DatasAmbilMahasiswa.TotalTunggakan = $scope.DataInput.TotalTunggakan;
            var Data = $scope.DatasAmbilMahasiswa;
            var Url = "api/datas/create/CreateMasterBayar.php";
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
                    $scope.DataCari;
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
            var UrlUpdateMahasiswa = "api/datas/update/UpdateMahasiswa.php";
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
        DTOptionsBuilder,
        DTColumnBuilder,
        notificationService
    ) {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType("full_numbers")
            .withOption("order", [1, "desc"])
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
        $scope.Init = function () {
            var Kategoriurl = "api/datas/read/ReadPengguna.php";
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
            var InsertUrl = "api/datas/create/CreatePengguna.php";
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
        DTOptionsBuilder,
        DTColumnBuilder,
        notificationService
    ) {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType("full_numbers")
            .withOption("order", [1, "desc"])
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
        $scope.DataInput={}

        $scope.Init = function () {
            $http({
                method: "GET",
                url: "api/datas/read/ReadDataPembayaran.php"
            }).then(function (response) {
                if (response.status == 200) {
                    $scope.DataPembayaran = response.data;
                }

            })
        }

        $scope.CariMahasiswa = function () {
            angular.forEach($scope.DataPembayaran.Mahasiswa, function(value, key){
                if(value.NPM == $scope.DataCari){
                    $scope.DataInput= value;
                }
            })            
        }

        $scope.Simpan = function () {
            $http({
                method: "POST",
                url: "api/datas/create/CreatePembayaran.php",
                data: $scope.DataInput
            }).then(function(response){
                if(response.status==200){
                    $scope.DataInput.IdTrxBayar=response.data.message;
                }
            })
        }
    })

    .controller("MailboxController", function ($scope, $http, DataFactory) {
        $scope.DatasSuratInternal = [];
        $scope.session = {};
        $scope.DataService = new dataFactory();
        $scope.DataSend = new dataFactory();
        $scope.Itemread = {};
        $scope.Init = function () {
            var Urlauth = "api/datas/read/auth.php";
            $http({
                method: "get",
                url: Urlauth,
            })
                .then(function (response) {
                    if (response.data.Session == false) {
                        window.location.href = 'index.html';
                    } else
                        $scope.session = response.data.Session;
                    var Url = "api/datas/read/ReadSuratInternal.php";
                    $http({
                        method: "POST",
                        url: Url,
                        data: $scope.session
                    }).then(function (response) {
                        $scope.DatasSuratInternal = response.data.records;
                        var b = $scope.DatasSuratInternal[0].tujuan;
                        $scope.DataService.init(b);
                        var a = $scope.DatasSuratInternal[1].pengirim;
                        $scope.DataSend.init(a);
                    }, function (error) {
                        alert(error.data.message);
                    })
                }, function (error) { })


        }

        $scope.tinymceModel = 'Initial content';

        $scope.getContent = function () {
            console.log('Editor content:', $scope.tinymceModel);
        };

        $scope.setContent = function () {
            $scope.tinymceModel = 'Time: ' + (new Date());
        };

        $scope.tinymceOptions = {
            plugins: 'advlist autolink link image code lists charmap print preview',
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
            skin: 'lightgray',
            theme: 'modern'
        };

        $scope.ShowTembusan = "";
        $scope.pdf = {};
        $scope.read = function (item) {
            $scope.Itemread = item;
            var panjang = $scope.Itemread.tembusan.length;
            angular.forEach(item.tembusan, function (value, key) {
                if (panjang == key + 1)
                    $scope.ShowTembusan += value.nama_pejabat + " | " + value.nama_struktural;
                else
                    $scope.ShowTembusan += value.nama_pejabat + " | " + value.nama_struktural + ",";
            })

            var paths = "../surat/assets/berkas/" + $scope.Itemread.berkas;
            $http.get(paths, {
                responseType: 'arraybuffer'
            }).then(function (response) {
                $scope.pdf.data = new Uint8Array(response.data);
                var binstr = Array.prototype.map.call($scope.pdf.data, function (ch) {
                    return String.fromCharCode(ch);
                }).join('');
                $scope.pdf.basee = btoa(binstr);
            });
            $scope.pdf.src = $scope.Itemread.berkas;

            function bufferToBase64(buf) {

            }
            $scope.Url = "apps/views/Read.html";
        }



        $scope.Url = "apps/views/Inbox.html";
        $scope.Inbox = function () {
            $scope.Url = "apps/views/Inbox.html";
        }
        $scope.Sent = function () {
            $scope.Url = "apps/views/Sent.html";
        }


    })

    .controller("ComposeController", function (
        $http, $scope, $sce, Services
    ) {
        $scope.DataSession = Services;
        // $scope.DataSession.Aun();
        $scope.DatasInput = {};

        $scope.DatasKategori = [];
        $scope.DatasTembusan = [];
        $scope.Tembusans = [];
        $scope.DatasPenerima = {};
        $scope.SelectedTembusan = {};
        $scope.DatasPejabat = [];
        $scope.SelectedKategori = {};
        $scope.session = {};
        $scope.Init = function () {
            var Urlauth = "api/datas/read/auth.php";
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

            var UrlKategori = "api/datas/read/ReadKategori.php";
            $http({
                method: "GET",
                url: UrlKategori
            }).then(function (response) {
                $scope.DatasKategori = response.data.records;
            }, function (error) {
                alert(error.data.message);
            })

            var Url = "api/datas/read/ReadPejabat.php";
            $http({
                method: "Get",
                url: Url
            }).then(
                function (response) {
                    $scope.DatasPejabat = response.data.records;
                    angular.forEach($scope.DatasPejabat, function (value, key) {
                        if (value.idpengguna == $scope.session.idpengguna) {
                            var index = $scope.DatasPejabat.findIndex(DatasPejabat => DatasPejabat.idpengguna == $scope.session.idpengguna);
                            $scope.DatasPejabat.splice(index, 1);
                            $scope.Tembusans = angular.copy($scope.DatasPejabat);
                        }
                    })
                },
                function (error) {
                    alert(error.data.message);
                }
            );

        }
        $scope.datasample;
        $scope.ShowBerkas = false;
        $scope.uploadedFile = function (element) {
            var reader = new FileReader();
            reader.onload = function (event) {
                $scope.$apply(function ($scope) {
                    $scope.files = element.files;
                    $scope.datasample = event.target.result;
                    if ($scope.datasample != undefined || $scope.datasample != "") {
                        $scope.ShowBerkas = true;
                    }
                    // //var datasource = src[1];

                    // var file = new Blob([$scope.datasample], { type: 'application/pdf' });
                    // var fileURL = URL.createObjectURL(file);
                    // $scope.src = $sce.trustAsResourceUrl(fileURL);
                });
            }
            reader.readAsDataURL(element.files[0]);
        }

        $scope.PilihTembusan = function () {
            $scope.DatasTembusan.push(angular.copy($scope.SelectedTembusan));
            var index = $scope.Tembusans.findIndex(Tembusans => Tembusans.idpengguna == $scope.SelectedTembusan.idpengguna);
            $scope.Tembusans.splice(index, 1);
            $scope.SelectedTembusan = {};
        }

        $scope.TemPenerima = {};
        $scope.PilihPenerima = function () {
            if ($scope.TemPenerima.idpengguna == undefined) {
                $scope.TemPenerima = angular.copy($scope.DatasPenerima);
                var index = $scope.Tembusans.findIndex(Tembusans => Tembusans.idpengguna == $scope.DatasPenerima.idpengguna);
                $scope.Tembusans.splice(index, 1);
            } else {
                if ($scope.TemPenerima.idpengguna != $scope.DatasPenerima.idpengguna) {
                    $scope.DatasPejabat.push(angular.copy($scope.TemPenerima));
                    $scope.TemPenerima = angular.copy($scope.DatasPenerima);
                    var index = $scope.Tembusans.findIndex(Tembusans => Tembusans.idpengguna == $scope.DatasPenerima.idpengguna);
                    $scope.Tembusans.splice(index, 1);
                }
            }

        }

        $scope.HapusTembusan = function (item) {
            var index = $scope.DatasTembusan.findIndex(DatasTembusan => DatasTembusan.idpengguna == item.idpengguna);
            $scope.DatasTembusan.splice(index, 1);
            $scope.Tembusans.push(item);
        }

        $scope.Simpan = function () {
            $http({
                url: "http://localhost/surat/api/datas/create/uploadBerkas.php", //or your add enquiry services
                method: "POST",
                processData: true,
                headers: { 'Content-Type': undefined },
                data: $scope.formdata,
                transformRequest: function (data) {
                    var formData = new FormData();
                    var file = $scope.files[0];
                    //var data = $base64.encode(file);
                    formData.append("file_upload", file); //pass the key name by which we will recive the file
                    angular.forEach(data, function (value, key) {
                        formData.append(key, value);
                    });

                    return formData;
                }
            }).then(function (response) {
                if (response.data.message == "Success") {
                    $scope.DatasInput.berkas = response.data.namefile;
                    $scope.DatasInput.tujuan = $scope.DatasPenerima.idpejabat;
                    $scope.DatasInput.NamaTujuan = $scope.DatasPenerima.nama_pengguna;
                    $scope.DatasInput.StrukturalTujuan = $scope.DatasPenerima.nm_struktural;
                    $scope.DatasInput.pengirim = $scope.session.idpejabat;
                    $scope.DatasInput.NamaPengirim = $scope.session.nama_pengguna;
                    $scope.DatasInput.StrukturalPengirim = $scope.session.nm_struktural;
                    $scope.DatasInput.idkategori_surat = $scope.SelectedKategori.idkategori_surat;
                    $scope.DatasInput.nama_kategori = $scope.SelectedKategori.nama_kategori;
                    $scope.DatasInput.tembusan = $scope.DatasTembusan;
                    $scope.DatasInput.status = "false";
                    var Url = "api/datas/create/CreateSuratInternal.php";
                    $http({
                        method: "POST",
                        url: Url,
                        data: $scope.DatasInput
                    }).then(function (response) {
                        if (response.data.message == "Sender") {
                            alert("Pesan Terkirim");
                            window.location.href = 'pejabat.html#!/Mailbox';
                        }

                    }, function (error) {
                        alert(error.data.message);
                    })
                }
            }, function (error) {
                alert(error.message);
            })
        }
    });