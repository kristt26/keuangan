<?php
header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
header('Access-Control-Allow-Credentials: true');
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 86400");
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
 
// include database and object file
include_once '../../../api/config/database.php';
include_once '../../../api/objects/TrxBayar.php';
include_once '../../../api/objects/Mahasiswa.php';

$database = new Database();
$db = $database->getConnection();
$trxbayar = new TrxBayar($db);
$mhs = new Mahasiswa($db);
$data = json_decode(file_get_contents("php://input"));
$mhs->NPM = $data->NPM;
$stmt = $mhs->OneMhs();
$datamhs = $stmt->fetch(PDO::FETCH_ASSOC);
$trxbayar->TA = $data->TA;
$trxbayar->TglBayar = $data->TglBayar;
$trxbayar->JumlahBayar = $data->JumlahBayar;
$trxbayar->Description = $data->Description;
$trxbayar->IdMahasiswa = $datamhs['IdMahasiswa'];
$trxbayar->Berkas = $data->MyFile;
if($trxbayar->CreateBymhs()){
    http_response_code(200);
    echo json_encode(array("message" => $trxbayar->IdTrxBayar));
}else{
    $path = "../../../assets/berkas/" . $data->Berkas;
    unlink($path);
    http_response_code(503);
    echo json_encode(array("message" => "Pembayaran Gagal diajukan"));

}



