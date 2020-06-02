
<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include database and object file
include_once '../../../api/config/database.php';
include_once '../../../api/objects/TrxBayar.php';
include_once '../../../api/objects/Mahasiswa.php';
include_once '../../../api/objects/Lib.php';

$data = json_decode(file_get_contents("php://input"));
if (!is_null($data)) {
    $database = new Database();
    $db = $database->getConnection();
    $trxbayar = new TrxBayar($db);
    $mhs = new Mahasiswa($db);
    $mhs->NPM = $data->NPM;
    $stmt = $mhs->OneMhs();
    $datamhs = $stmt->fetch(PDO::FETCH_ASSOC);
    $trxbayar->TA = $data->TA;
    $trxbayar->TglBayar = $data->TglBayar;
    $trxbayar->JumlahBayar = $data->JumlahBayar;
    $trxbayar->Description = $data->Description;
    $trxbayar->IdMahasiswa = $datamhs['IdMahasiswa'];
    $trxbayar->Berkas = $data->MyFile;
    if ($trxbayar->CreateBymhs()) {
        http_response_code(200);
        echo json_encode(array("message" => $trxbayar->IdTrxBayar));
    } else {
        $path = "../../../assets/berkas/" . $data->Berkas;
        unlink($path);
        http_response_code(503);
        echo json_encode(array("message" => "Pembayaran Gagal diajukan"));

    }
} else {
    $lib = new Lib();
    $lib->file = $_FILES;
    $hasil = $lib->Upload();
    http_response_code(201);
    echo json_encode($hasil);
}
