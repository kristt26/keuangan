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
    $stmt->fetchALL();
    if($num==0){
        $jenisbayar->Sifat="Umum";
        $stmtt = $jenisbayar->readBySifat();
        $num1 = $stmtt->rowCount();
        if($num1>0){
                $Datas= array("records"=>array(),"message"=>"Success");
                    $row = $stmtt->fetchALL(PDO::FETCH_ASSOC);
                    $bayarumum->Angkatan = $data->Angkatan;
                    $bayarumum->Nominal=0;
                    $bayarumum->IdJenisBayar=0;
                    $bayarumum->create();
                    foreach ($row as &$value) {
                        $bayarumum->Angkatan = $data->Angkatan;
                        $bayarumum->Nominal=0;
                        $bayarumum->IdJenisBayar=$value['IdJenisBayar'];
                        $bayarumum->create();
                        $ItemJenisBayar = array(
                            "IdJenisBayar" => $value['IdJenisBayar'],
                            "Jenis" => $value['Jenis'],
                            "Sifat" => $value['Sifat']
                        );
                        $Item= array(
                            'IdBayarUmum' => $bayarumum->IdBayarUmum,
                            'Angkatan' => $data->Angkatan,
                            'Nominal' => $bayarumum->Nominal,
                            'JenisBayar' => array($ItemJenisBayar) 
                        );

                        array_push($Datas['records'], $Item);
                    }

                        
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