<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../../api/config/database.php';
include_once '../../../api/objects/User.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);
$data =json_decode(file_get_contents("php://input"));
if(!empty($data->IdUser) && !empty($data->Status)){
    $user->IdUser = $data->IdUser;
    $user->Nama = $data->Nama;
    $user->Password = md5($data->Password);
    $stmt = $user->readUser();
    $stmt=null;
    if($user->updateStatus()){
        http_response_code(200);
        echo json_encode(array("message" => "Success"));
    }else{
        http_response_code(503);
        echo json_encode(array("message" => "Unable to update User"));
    }
}else
{
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create User. Data is incomplete."));
}

?>