<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include database and object file
include_once '../../../api/config/database.php';
include_once '../../../api/objects/DetailBayar.php';
include_once '../../../api/objects/DetailBayarKhusus.php';

$database = new Database();
$db = $database->getConnection();
$detailbayar = new DetailBayar($db);
$detailbayarkhusus = new DetailBayarKhusus($db);
$data = json_decode(file_get_contents("php://input"));
$Jumlah = 0;
foreach ($data->SendBayarKhusus as &$value) {
    $detailbayarkhusus->IdMahasiswa = $data->IdMahasiswa;
    $detailbayarkhusus->TA = $data->TA;
    $detailbayarkhusus->Nominal = $value->Nominal;
    $detailbayarkhusus->IdBayarKhusus = $value->IdBayarKhusus;
    if ($value->Check == true) {
        if ($detailbayarkhusus->CekData() == 0) {
            $Jumlah += (int)$value->Nominal;
            $detailbayarkhusus->create();
        }
    } else {
        if ($detailbayarkhusus->CekData() != 0) {
            $Jumlah -= (int)$value->Nominal;
            $detailbayarkhusus->delete();
        }
    }
}
$detailbayar->TA = $data->TA;
$detailbayar->IdMahasiswa = $data->IdMahasiswa;
$detailbayar->readOne();
$tempJumlah = $detailbayar->Jumlah + $Jumlah;
$detailbayar->Jumlah = $tempJumlah;
if ($detailbayar->update()) {
    http_response_code(201);
    echo json_encode(array("message" => "Create Pembayaran Lain Berhasil!!!"));
} else {
    http_response_code(503);
    echo json_encode(array("message" => "Unable to create Pembayaran"));
}
// }else
// {
//     http_response_code(400);

//     // tell the user
//     echo json_encode(array("message" => "Unable to create product. Data is incomplete."));
// }
