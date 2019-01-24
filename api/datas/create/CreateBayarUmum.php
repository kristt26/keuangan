<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// include database and object file
include_once '../../../api/config/database.php';
include_once '../../../api/objects/BayarUmum.php';
include_once '../../../api/objects/JenisBayar.php';

$database = new Database();
$db = $database->getConnection();
$bayarumum = new BayarUmum($db);
$jenisbayar = new JenisBayar($db);
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->Angkatan)){
    $bayarumum->Angkatan = $data->Angkatan;
    $stmt = $bayarumum->CekAngkatan();
    $num = $stmt->rowCount();
    if($num==0){
        $jenisbayar->Sifat="Umum";
        $stmtt = $jenisbayar->readBySifat();
        $num1 = $stmtt->rowCount();
        if($num1>0){
                $Datas= array("records"=>array(),"message"=>'Success');
                while($row = $stmtt->fetch(PDO::FETCH_ASSOC)){
                    extract($row);
                    $bayarumum->Angkatan = $data->Angkatan;
                    $bayarumum->Nominal="0";
                    $bayarumum->IdJenisBayar=$IdJenisBayar;
                    $bayarumum->create();
                    $Item= $arrayName = array(
                        'IdBayarUmum' => $bayarumum->IdBayarUmum,
                        'Angkatan' => $data->Angkatan,
                        'Nominal' => $bayarumum->Nominal,
                        'IdJenisBayar' => $IdJenisBayar 
                    );
                    array_push($Datas['records'], $Item);
                }
                http_response_code(201);
                echo json_encode(array($Datas));
        }else{
            http_response_code(400);
            echo json_encode(array("message" => "Gagal Menambahkan"));
        }
    }
}else
{
    http_response_code(400);
 
    // tell the user
    echo json_encode(array("message" => "Unable to create product. Data is incomplete."));
}
 
?>