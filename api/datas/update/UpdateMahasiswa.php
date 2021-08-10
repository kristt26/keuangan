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
$mahasiswa->NPM = $data->NPM;
$mahasiswa->NamaMahasiswa = $data->NamaMahasiswa;
$mahasiswa->Angkatan = $data->Angkatan;
$mahasiswa->Alamat =  $data->Alamat;
$mahasiswa->Kontak = $data->Kontak;
$mahasiswa->Status= $data->Status;
$mahasiswa->IdMahasiswa= $data->IdMahasiswa;
if($mahasiswa->update()){
    http_response_code(200);
    echo json_encode(array("message" => "Mahasiswa berhasil diubah!!!"));
}else{
    http_response_code(503);
    echo json_encode(array("message" => "Gagal melakukan perubahan!!!"));
}

?>