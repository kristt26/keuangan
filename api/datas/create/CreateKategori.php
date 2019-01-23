<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// include database and object file
include_once '../../../api/config/database.php';
include_once '../../../api/objects/KategoriSurat.php';

$database = new Database();
$db = $database->getConnection();
$kategori = new KategoriSurat($db);
$data = json_decode(file_get_contents("php://input"));
if(!empty($data->nama_kategori) && !empty($data->keterangan)){
    $kategori->nama_kategori = $data->nama_kategori;
    $kategori->keterangan = $data->keterangan;
    if($kategori->create()){
        http_response_code(201);
        echo json_encode(array("message" => $kategori->idkategori_surat));
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