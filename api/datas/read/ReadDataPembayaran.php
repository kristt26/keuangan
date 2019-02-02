<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../objects/TahunAkademik.php';
include_once '../../objects/MasterBayar.php';
include_once '../../objects/TrxBayar.php';
include_once '../../objects/DetailBayar.php';
include_once '../../objects/Mahasiswa.php';

$database = new Database();
$db       = $database->getConnection();

$ta          = new TahunAkademik($db);
$masterbayar = new MasterBayar($db);
$trxbayar    = new TrxBayar($db);
$detailbayar = new DetailBayar($db);
$mahasiswa   = new Mahasiswa($db);

$data       = json_decode(file_get_contents("php://input"));
$stmt       = $ta->GetTAAktif();
$row        = $stmt->fetchALL(PDO::FETCH_ASSOC);
$TaAktif    = (object)$row[0];
$stmt       = null;
$DatasArray = array(
    'Mahasiswa' => array(),
    'TAAktif'   => $TaAktif,
);
$stmt           = $mahasiswa->read();
$row            = $stmt->fetchALL(PDO::FETCH_ASSOC);
$DatasMahasiswa = (object)$row;
$stmt           = null;
foreach ($DatasMahasiswa as &$value) {
    $ItemMahasiswa = array(
        "IdMahasiswa"   => $value["IdMahasiswa"],
        "NPM"           => $value["NPM"],
        "NamaMahasiswa" => $value["NamaMahasiswa"],
        "Angkatan"      => $value["Angkatan"],
        "Alamat"        => $value["Alamat"],
        "Kontak"        => $value["Kontak"],
        "MasterBayar"   => array(),
    );
    $masterbayar->IdMahasiswa = $value["IdMahasiswa"];
    $stmt                     = $masterbayar->readByMahasiswa();
    $row                      = $stmt->fetchALL(PDO::FETCH_ASSOC);
    $DatasMaster              = (object)$row;
    $stmt                     = null;
    foreach ($DatasMaster as &$value1) {
        $trxbayar->IdMahasiswa = $value1["IdMahasiswa"];
        $trxbayar->TA          = $value1["TA"];
        $stmt                  = $trxbayar->readByMahasiswa();
        $row                   = $stmt->fetchALL(PDO::FETCH_ASSOC);
        $DataBayar             = (object)$row;
        $stmt                  = null;
        $ItemMaster            = array(
            "IdMasterBayar" => $value1["IdMasterBayar"],
            "TrxBayar" => $DataBayar,
        );
        array_push($ItemMahasiswa["MasterBayar"], $ItemMaster);
    }
    array_push($DatasArray["Mahasiswa"], $ItemMahasiswa);
}
http_response_code(200);

// show products data in json format
echo json_encode($DatasArray);
