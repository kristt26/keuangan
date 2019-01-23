<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// include database and object file
include_once '../../../api/config/database.php';
include_once '../../../api/objects/JenisBayar.php';

$database = new Database();
$db = $database->getConnection();
$jenisbayar = new JenisBayar($db);
$data = json_decode(file_get_contents("php://input"));
if(!empty($data->Jenis) && !empty($data->Sifat)){
    $jenisbayar->Jenis = $data->Jenis;
    $jenisbayar->Sifat = $data->Sifat;
    if($jenisbayar->create()){
        http_response_code(201);
        echo json_encode(array("message" => $jenisbayar->IdJenisBayar));
    }else{
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create Kategori Surat"));
    }
}else
{
    http_response_code(400);
 
    // tell the user
    echo json_encode(array("message" => "Unable to create product. Data is incomplete."));
}
 
?>