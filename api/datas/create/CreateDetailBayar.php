<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// include database and object file
include_once '../../../api/config/database.php';
include_once '../../../api/objects/DetailBayar.php';
include_once '../../../api/objects/DetailBayarUmum.php';

$database = new Database();
$db = $database->getConnection();
$detailbayar = new DetailBayar($db);
$detailbayarumum = new DetailBayarUmum($db);
$data = json_decode(file_get_contents("php://input"));
foreach ($data->SendBayarUmum as &$value) {
    $detailbayarumum->IdMahasiswa = $data->IdMahasiswa;
    $detailbayarumum->Nominal = $value->Nominal;
    $detailbayarumum->TA = $data->TA;
    $detailbayarumum->IdBayarUmum = $value->IdBayarUmum;
    $detailbayarumum->create();
}

    $detailbayar->TA = $data->TA;
    $detailbayar->IdMahasiswa = $data->IdMahasiswa;
    $detailbayar->Jumlah = $data->Jumlah;
    if($detailbayar->create()){
        http_response_code(201);
        echo json_encode(array("message" => "Create Pembayaran Berhasil!!!"));
    }else{
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create Pembayaran"));
    }
// }else
// {
//     http_response_code(400);
 
//     // tell the user
//     echo json_encode(array("message" => "Unable to create product. Data is incomplete."));
// }
 
?>