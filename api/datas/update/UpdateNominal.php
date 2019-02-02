<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../../api/config/database.php';
include_once '../../../api/objects/BayarUmum.php';
include_once '../../../api/objects/BayarKhusus.php';

$database = new Database();
$db = $database->getConnection();
$bayarumum = new BayarUmum($db);
$bayarkhusus = new BayarKhusus($db);
$data =json_decode(file_get_contents("php://input"));
if($data->JenisBayar[0]->Sifat=="Khusus"){
    $bayarkhusus->IdBayarKhusus = $data->IdBayarKhusus;
    $bayarkhusus->Nominal = $data->Nominal;
    if($bayarkhusus->updateNominal()){
        http_response_code(201);
        echo json_encode(array("message" => $data->JenisBayar[0]->Sifat));
    }else{
        http_response_code(503);
        echo json_encode(array("message" => "Unable to update Nominal"));
    }
}else
{
    $bayarumum->IdBayarUmum = $data->IdBayarUmum;
    $bayarumum->Nominal = $data->Nominal;
    if($bayarumum->updateNominal()){
        http_response_code(201);
        echo json_encode(array("message" => $data->JenisBayar[0]->Sifat));
    }else{
        http_response_code(503);
        echo json_encode(array("message" => "Unable to update Nominal"));
    }
}

?>