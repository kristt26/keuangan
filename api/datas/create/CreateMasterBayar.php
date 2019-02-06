<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// include database and object file
include_once '../../../api/config/database.php';
include_once '../../../api/objects/MasterBayar.php';

$database = new Database();
$db = $database->getConnection();
$masterbayar = new MasterBayar($db);
$data = json_decode(file_get_contents("php://input"));
$masterbayar->IdMahasiswa = $data->IdMahasiswa;
$masterbayar->TA = $data->TA;
$masterbayar->Total = $data->TotalTagihan;
$masterbayar->Bayar = $data->TotalPembayaran;
$masterbayar->Tunggakan = $data->TotalTunggakan;
if($masterbayar->create()){
    http_response_code(200);
    echo json_encode(array("message" => $masterbayar->IdMasterBayar));
}else{
    http_response_code(503);
    echo json_encode(array("message" => "Unable to create Master Bayar"));
}

?>