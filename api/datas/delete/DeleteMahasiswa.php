<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// include database and object file
include_once '../../../api/config/database.php';
include_once '../../../api/objects/Mahasiswa.php';

$database = new Database();
$db = $database->getConnection();
$mahasiswa = new Mahasiswa($db);

$data = json_decode(file_get_contents("php://input"));

$mahasiswa->IdMahasiswa = $data->IdMahasiswa;
if($mahasiswa->delete()){
    http_response_code(200);
    echo json_encode(array("message" => "Data Terhapus"));
}else{
    http_response_code(503);
    echo json_encode(array("message" => "Gagal Hapus"));
}

?>