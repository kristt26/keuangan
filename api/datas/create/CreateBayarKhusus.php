<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// include database and object file
include_once '../../../api/config/database.php';
include_once '../../../api/objects/BayarKhusus.php';
include_once '../../../api/objects/JenisBayar.php';
include_once '../../../api/objects/TahunAkademik.php';

$database = new Database();
$db = $database->getConnection();
$bayarkhusus = new BayarKhusus($db);
$jenisbayar = new JenisBayar($db);
$tahunakademik = new TahunAkademik($db);
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->TA)){
    $bayarkhusus->TA = $data->TA;
    $stmt = $bayarkhusus->CekTA();
    $num = $stmt->rowCount();
    $stmt->fetchALL();
    $stmt=null;
    if($num==0){
        $jenisbayar->Sifat="Khusus";
        $stmtt = $jenisbayar->readBySifat();
        $num1 = $stmtt->rowCount();
        if($num1>0){
                $Datas= array("records"=>array(),"message"=>"Success");
                    $row = $stmtt->fetchALL(PDO::FETCH_ASSOC);
                    $stmtt=null;
                    $tahunakademik->Status="Tidak Aktif";
                    $tahunakademik->update();
                    $tahunakademik->Status="Aktif";
                    $tahunakademik->TA= $data->TA;
                    $tahunakademik->create();
                    $bayarkhusus->TA = $data->TA;
                    $bayarkhusus->Nominal=0;
                    $bayarkhusus->IdJenisBayar=0;
                    $bayarkhusus->create();
                    foreach ($row as &$value) {
                        $bayarkhusus->TA = $data->TA;
                        $bayarkhusus->Nominal=0;
                        $bayarkhusus->IdJenisBayar=$value['IdJenisBayar'];
                        $bayarkhusus->create();
                        $ItemJenisBayar = array(
                            "IdJenisBayar" => $value['IdJenisBayar'],
                            "Jenis" => $value['Jenis'],
                            "Sifat" => $value['Sifat']
                        );
                        $Item= array(
                            'IdBayarKhusus' => $bayarkhusus->IdBayarKhusus,
                            'TA' => $data->TA,
                            'Nominal' => $bayarkhusus->Nominal,
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