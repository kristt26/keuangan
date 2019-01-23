<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// include database and object file
include_once '../../../api/config/database.php';
include_once '../../../api/objects/Struktural.php';

$database = new Database();
$db = $database->getConnection();
$struktural = new Struktural($db);
$data = json_decode(file_get_contents("php://input"));
if(!empty($data->nm_struktural)){
    $struktural->nm_struktural = $data->nm_struktural;
    if($struktural->create()){
        http_response_code(201);
        echo json_encode(array("message" => $struktural->idstruktural));
    }else{
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create Struktural Surat"));
    }
}else
{
    http_response_code(400);
 
    // tell the user
    echo json_encode(array("message" => "Unable to create product. Data is incomplete."));
}
 
?>