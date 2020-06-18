<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../objects/TahunAkademik.php';
include_once '../../objects/MasterBayar.php';
include_once '../../objects/TrxBayar.php';
include_once '../../objects/DetailBayar.php';
include_once '../../objects/Mahasiswa.php';
include_once '../../objects/DetailBayarUmum.php';
include_once '../../objects/DetailBayarKhusus.php';
include_once '../../objects/User.php';
include_once '../../objects/JenisBayar.php';
include_once '../../objects/BayarUmum.php';
include_once '../../objects/BayarKhusus.php';
include_once '../../objects/PotonganUmum.php';

$database = new Database();
$db = $database->getConnection();
$ta = new TahunAkademik($db);
$masterbayar = new MasterBayar($db);
$trxbayar = new TrxBayar($db);
$detailbayar = new DetailBayar($db);
$mahasiswa = new Mahasiswa($db);
$user = new User($db);
$detailbayarumum = new DetailBayarUmum($db);
$detailbayarkhusus = new DetailBayarKhusus($db);
$jenisbayar = new JenisBayar($db);
$bayarumum = new BayarUmum($db);
$bayarkhusus = new BayarKhusus($db);
$potonganumum = new PotonganUmum($db);
$data = json_decode(file_get_contents("php://input"));
$stmt = $ta->read();
$row = $stmt->fetchALL(PDO::FETCH_ASSOC);
$TaAktif = (object) $row;
$stmt = null;
$stmt = $user->read();
$row = $stmt->fetchALL(PDO::FETCH_ASSOC);
$DatasUser = (object) $row;
$stmt = null;
$stmt = $jenisbayar->read();
$row = $stmt->fetchALL(PDO::FETCH_ASSOC);
$DatasJenisBayar = (object) $row;
$stmt = null;
$stmt = $bayarumum->read();
$row = $stmt->fetchALL(PDO::FETCH_ASSOC);
$DatasBayarUmum = (object) $row;
$stmt = null;
$stmt = $bayarkhusus->read();
$row = $stmt->fetchALL(PDO::FETCH_ASSOC);
$DatasBayarKhusus = (object) $row;
$stmt = null;

$DatasArray = array(
    'Mahasiswa' => array(),
    'DataTA' => $TaAktif,
    'User' => $DatasUser,
    'JenisBayar' => $DatasJenisBayar,
    'BayarUmum' => $DatasBayarUmum,
    'BayarKhusus' => $DatasBayarKhusus,
);
if (isset($_GET['npm'])) {
    $mahasiswa->NPM = $_GET['npm'];
    $stmt = $mahasiswa->OneMhs();
} else {
    $stmt = $mahasiswa->read();
}
$row = $stmt->fetchALL(PDO::FETCH_ASSOC);
$DatasMahasiswa = (object) $row;
$stmt = null;
foreach ($DatasMahasiswa as &$value) {
    $ItemMahasiswa = array(
        "IdMahasiswa" => $value["IdMahasiswa"],
        "NPM" => $value["NPM"],
        "NamaMahasiswa" => $value["NamaMahasiswa"],
        "Angkatan" => $value["Angkatan"],
        "Alamat" => $value["Alamat"],
        "Kontak" => $value["Kontak"],
        "MasterBayar" => array(),
        "MasterBayarKhusus" => array(),
        "PotonganUmum" => array(),
    );
    $masterbayar->IdMahasiswa = $value["IdMahasiswa"];
    $stmt = $masterbayar->readByMahasiswa();
    $row = $stmt->fetchALL(PDO::FETCH_ASSOC);
    $DatasMaster = (object) $row;
    $stmt = null;
    foreach ($DatasMaster as &$value1) {
        $trxbayar->IdMahasiswa = $value1["IdMahasiswa"];
        $trxbayar->TA = $value1["TA"];
        $stmt = $trxbayar->readByMahasiswa();
        $row = $stmt->fetchALL(PDO::FETCH_ASSOC);
        $DataBayar = $row;
        $stmt = null;
        $detailbayarumum->TA = $value1["TA"];
        $detailbayarumum->IdMahasiswa = $value1["IdMahasiswa"];
        $stmt = $detailbayarumum->readOne();
        $row = $stmt->fetchALL(PDO::FETCH_ASSOC);
        $DataBayarUmum = (object)$row;
        $stmt = null;
        $detailbayarkhusus->TA = $value1["TA"];
        $detailbayarkhusus->IdMahasiswa = $value1["IdMahasiswa"];
        $stmt = $detailbayarkhusus->readOne();
        $row = $stmt->fetchALL(PDO::FETCH_ASSOC);
        $DataBayarKhusus = $row;
        $stmt = null;
        $potonganumum->IdMahasiswa = $value1["IdMahasiswa"];
        $potonganumum->TA = $value1["TA"];
        $stmt = $potonganumum->readOne();
        $row = $stmt->fetchALL(PDO::FETCH_ASSOC);
        $DatasPotonganUmum = (object)$row;
        $stmt = null;
        foreach ($DataBayarUmum as $key => $ItemUmum) {
            foreach ($DatasPotonganUmum as $key1 => $ItemPotongan) {
                if($ItemUmum['IdBayarUmum']==$ItemPotongan['IdBayarUmum']){
                    $DataBayarUmum->$key['Potongan'] = $ItemPotongan;
                }
            }
        }
        $ItemMaster = array(
            "IdMasterBayar" => $value1["IdMasterBayar"],
            "TA" => $value1["TA"],
            "Total" => $value1["Total"],
            "Bayar" => $value1["Bayar"],
            "Tunggakan" => $value1["Tunggakan"],
            "TrxBayar" => $DataBayar,
            "BayarUmum" => $DataBayarUmum,
            "BayarKhusus" => $DataBayarKhusus,
            "Potongan" => $DatasPotonganUmum
        );
        array_push($ItemMahasiswa["MasterBayar"], $ItemMaster);

    }
    array_push($DatasArray["Mahasiswa"], $ItemMahasiswa);
}
if (isset($_GET['npm'])) {
    $DatasArray["Mahasiswa"] = $DatasArray["Mahasiswa"][0];
    unset($DatasArray['User']);
}
http_response_code(200);

// show products data in json format
echo json_encode($DatasArray);
