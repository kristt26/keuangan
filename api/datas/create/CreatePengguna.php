<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// include database and object file
include_once '../../../api/config/database.php';
include_once '../../../api/objects/Pengguna.php';

$database = new Database();
$db = $database->getConnection();
$pengguna = new Pengguna($db);
$data = json_decode(file_get_contents("php://input"));
if(!empty($data->nama_pengguna) && !empty($data->username)){
    $pengguna->nama_pengguna = $data->nama_pengguna;
    $pengguna->username = $data->username;
    $pengguna->email = $data->email;
    $pengguna->password = md5("stimik1011");
    if($pengguna->create()){
        http_response_code(201);
        echo json_encode(array("message" => $pengguna->idpengguna));
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