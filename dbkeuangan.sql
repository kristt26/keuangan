# Host: den1.mysql1.gear.host  (Version 5.6.37)
# Date: 2019-01-26 23:18:33
# Generator: MySQL-Front 6.1  (Build 1.16)


#
# Structure for table "bayarumum"
#

CREATE TABLE `bayarumum` (
  `IdBayarUmum` int(11) NOT NULL AUTO_INCREMENT,
  `Angkatan` varchar(9) NOT NULL,
  `Nominal` double NOT NULL,
  `IdJenisBayar` int(11) NOT NULL,
  PRIMARY KEY (`IdBayarUmum`),
  KEY `fk_BayarUmum_JenisBayar_idx` (`IdJenisBayar`),
  CONSTRAINT `fk_BayarUmum_JenisBayar` FOREIGN KEY (`IdJenisBayar`) REFERENCES `jenisbayar` (`IdJenisBayar`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=166 DEFAULT CHARSET=utf8;

#
# Structure for table "jenisbayar"
#

CREATE TABLE `jenisbayar` (
  `IdJenisBayar` int(11) NOT NULL AUTO_INCREMENT,
  `Jenis` varchar(50) NOT NULL,
  `Sifat` enum('Umum','Khusus') NOT NULL DEFAULT 'Umum',
  PRIMARY KEY (`IdJenisBayar`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

#
# Structure for table "bayarkhusus"
#

CREATE TABLE `bayarkhusus` (
  `IdBayarKhusus` int(11) NOT NULL AUTO_INCREMENT,
  `TA` varchar(11) NOT NULL,
  `Nominal` double NOT NULL,
  `IdJenisBayar` int(11) NOT NULL,
  PRIMARY KEY (`IdBayarKhusus`),
  KEY `fk_BayarKhusus_JenisBayar1_idx` (`IdJenisBayar`),
  CONSTRAINT `fk_BayarKhusus_JenisBayar1` FOREIGN KEY (`IdJenisBayar`) REFERENCES `jenisbayar` (`IdJenisBayar`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;

#
# Structure for table "mahasiswa"
#

CREATE TABLE `mahasiswa` (
  `IdMahasiswa` int(11) NOT NULL AUTO_INCREMENT,
  `NPM` varchar(9) NOT NULL,
  `NamaMahasiswa` varchar(100) NOT NULL,
  `Angkatan` varchar(45) NOT NULL,
  `Alamat` varchar(100) NOT NULL,
  `Kontak` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`IdMahasiswa`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

#
# Structure for table "detailbayar"
#

CREATE TABLE `detailbayar` (
  `IdDetail` int(11) NOT NULL,
  `TA` varchar(9) NOT NULL,
  `Jumlah` double NOT NULL,
  `IdMahasiswa` int(11) NOT NULL,
  PRIMARY KEY (`IdDetail`),
  KEY `fk_DetailBayar_Mahasiswa1_idx` (`IdMahasiswa`),
  CONSTRAINT `fk_DetailBayar_Mahasiswa1` FOREIGN KEY (`IdMahasiswa`) REFERENCES `mahasiswa` (`IdMahasiswa`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "masterbayar"
#

CREATE TABLE `masterbayar` (
  `IdMasterBayar` int(11) NOT NULL,
  `TA` varchar(9) NOT NULL,
  `Total` double NOT NULL,
  `Bayar` double NOT NULL,
  `Tunggakan` double NOT NULL,
  `IdMahasiswa` int(11) NOT NULL,
  PRIMARY KEY (`IdMasterBayar`),
  KEY `fk_MasterBayar_Mahasiswa1_idx` (`IdMahasiswa`),
  CONSTRAINT `fk_MasterBayar_Mahasiswa1` FOREIGN KEY (`IdMahasiswa`) REFERENCES `mahasiswa` (`IdMahasiswa`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "tahunakademik"
#

CREATE TABLE `tahunakademik` (
  `IdTahunAkademik` int(11) NOT NULL AUTO_INCREMENT,
  `TA` varchar(11) NOT NULL DEFAULT '',
  `Status` enum('Aktif','Tidak Aktif') NOT NULL DEFAULT 'Aktif',
  PRIMARY KEY (`IdTahunAkademik`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

#
# Structure for table "user"
#

CREATE TABLE `user` (
  `IdUser` int(11) NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `Level` enum('Administrator','Kepala','Pendata','Pembayaran') NOT NULL DEFAULT 'Pembayaran',
  `Nama` varchar(100) NOT NULL,
  PRIMARY KEY (`IdUser`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

#
# Structure for table "trxbayar"
#

CREATE TABLE `trxbayar` (
  `IdTrxBayar` int(11) NOT NULL,
  `TA` varchar(9) NOT NULL,
  `TglBayar` date NOT NULL,
  `JumlahBayar` double NOT NULL,
  `Description` varchar(150) NOT NULL,
  `IdMahasiswa` int(11) NOT NULL,
  `IdPetugas` int(11) NOT NULL,
  PRIMARY KEY (`IdTrxBayar`),
  KEY `fk_TrxBayar_Mahasiswa1_idx` (`IdMahasiswa`),
  KEY `fk_TrxBayar_User1_idx` (`IdPetugas`),
  CONSTRAINT `fk_TrxBayar_Mahasiswa1` FOREIGN KEY (`IdMahasiswa`) REFERENCES `mahasiswa` (`IdMahasiswa`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_TrxBayar_User1` FOREIGN KEY (`IdPetugas`) REFERENCES `user` (`IdUser`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Procedure "AmbilAngkatan"
#

CREATE PROCEDURE `AmbilAngkatan`()
BEGIN
	SELECT DISTINCT 
	  `bayarumum`.`Angkatan`
	FROM
	  `bayarumum`;
END;

#
# Procedure "AmbilJenisBayar"
#

CREATE PROCEDURE `AmbilJenisBayar`(SifatValue varchar(10))
BEGIN
SELECT * FROM `jenisbayar` WHERE Sifat = SifatValue;
END;

#
# Procedure "CekAngkatan"
#

CREATE PROCEDURE `CekAngkatan`(AngkatanValue varchar(4))
BEGIN
	SELECT DISTINCT
	  `bayarumum`.`Angkatan`
	FROM
	  `bayarumum`
	WHERE
	  `bayarumum`.`Angkatan` = AngkatanValue;
END;

#
# Procedure "CekTA"
#

CREATE PROCEDURE `CekTA`(TAValue varchar(11))
BEGIN
  SELECT DISTINCT
	  `bayarkhusus`.`TA`
	FROM
	  `bayarkhusus`
	WHERE
	  `bayarkhusus`.`TA` = TAValue;
END;

#
# Procedure "GetMahasiswa"
#

CREATE PROCEDURE `GetMahasiswa`()
BEGIN
  SELECT
    *
  FROM
    mahasiswa;
END;

#
# Procedure "GetStatusAktif"
#

CREATE PROCEDURE `GetStatusAktif`()
BEGIN
SELECT 
* 
FROM
tahunakademik
WHERE
Status='Aktif';
END;

#
# Procedure "ReadBayarKhusus"
#

CREATE PROCEDURE `ReadBayarKhusus`()
BEGIN
  SELECT
	  *
	FROM
	  `bayarkhusus`;
END;

#
# Procedure "ReadBayarUmum"
#

CREATE PROCEDURE `ReadBayarUmum`()
BEGIN
	SELECT
	  *
	FROM
	  `bayarumum`;
END;
