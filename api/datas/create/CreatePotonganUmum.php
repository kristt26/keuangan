<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include database and object file
include_once '../../../api/config/database.php';
include_once '../../../api/objects/PotonganUmum.php';

$database = new Database();
$db = $database->getConnection();
$potonganumum = new PotonganUmum($db);
$data = json_decode(file_get_contents("php://input"));
$potonganumum->IdMahasiswa = $data->IdMahasiswa;
$potonganumum->Nominal = $data->Total;
$potonganumum->TA = $data->TA;
$potonganumum->IdBayarUmum = $data->IdBayarUmum;
$potonganumum->Disc =  $data->Disc;
$potonganumum->Quantity =  $data->Jumlah;
if ($potonganumum->create()) {
    http_response_code(201);
    echo json_encode(array("message" => "Create Potongan Berhasil!!!"));
} else {
    http_response_code(503);
    echo json_encode(array("message" => "Potongan sudah diinput sebelumnya"));
}
