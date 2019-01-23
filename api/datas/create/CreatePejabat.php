<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// include database and object file
include_once '../../../api/config/database.php';
include_once '../../../api/objects/Pejabat.php';

$database = new Database();
$db = $database->getConnection();
$pejabat = new Pejabat($db);
$data = json_decode(file_get_contents("php://input"));
if(!empty($data->idpengguna) && !empty($data->idstruktural)){
    $pejabat->idpengguna = $data->idpengguna;
    $pejabat->idstruktural = $data->idstruktural;
    $pejabat->status = $data->status;
    $cek = $pejabat->readOne();
    $num=$cek->rowCount();
    if($num==0)
    {
        if($pejabat->create()){
            http_response_code(201);
            echo json_encode(array("message" => $pejabat->idpejabat));
        }else{
            http_response_code(503);
            echo json_encode(array("message" => "Unable to create Pejabat"));
        }
    }else
    {
        $pejabat->status="false";
        if($pejabat->update()){
            $pejabat->status=$data->status;
            if($pejabat->create()){
                http_response_code(201);
                echo json_encode(array("message" => $pejabat->idpejabat));
            }else{
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create Pejabat"));
            }
        }else
        {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to create Pejabat"));
        }
    }
    
}else
{
    http_response_code(400);
 
    // tell the user
    echo json_encode(array("message" => "Unable to create Pejabat Data is incomplete."));
}
 
?>