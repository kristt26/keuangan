<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../objects/Mahasiswa.php';

$database = new Database();
$db = $database->getConnection();

$mahasiswa = new Mahasiswa($db);

$stmt = $mahasiswa->read();
$num = $stmt->rowCount();

if($num>0)
{
    $Datas= array("records"=>array());
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
        extract($row);
 
        $Item=array(
            "IdMahasiswa" => $IdMahasiswa,
            "NPM" => $NPM,
            "NamaMahasiswa" => $NamaMahasiswa,
            "Angkatan" => $Angkatan,
            "Alamat" => $Alamat,
            "Kontak" => $Kontak,
            "Status" => $Status
        );
 
        array_push($Datas["records"], $Item);
    }
    // set response code - 200 OK
    http_response_code(200);
 
    // show products data in json format
    echo json_encode($Datas);
}

?>