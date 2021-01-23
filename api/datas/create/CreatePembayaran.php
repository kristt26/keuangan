<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// include database and object file
include_once '../../../api/config/database.php';
include_once '../../../api/objects/TrxBayar.php';
session_start();

$database = new Database();
$db = $database->getConnection();
$trxbayar = new TrxBayar($db);
$data = json_decode(file_get_contents("php://input"));
$a = new DateTime($data->TglBayar);
$aa=str_replace('-', '/', $a->format('Y-m-d'));
$aaa = date('Y-m-d',strtotime($aa . "+1 days"));
$trxbayar->TglBayar = $aaa;
$trxbayar->TA = $data->TA->TA;
$trxbayar->JumlahBayar = $data->JumlahBayar;
$trxbayar->IdMahasiswa = $data->IdMahasiswa;
$trxbayar->IdPetugas = $data->IdPetugas;
$trxbayar->Description = $data->Description;
if($trxbayar->create()){
    http_response_code(200);
    echo json_encode(array("IdTrxBayar" => $trxbayar->IdTrxBayar, "IdPetugas" => $trxbayar->IdPetugas));
}else{
    http_response_code(503);
    echo json_encode(array("message" => "Unable to create Pembayaran"));
}

?>