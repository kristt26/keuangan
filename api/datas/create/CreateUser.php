<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include database and object file
include_once '../../../api/config/database.php';
include_once '../../../api/objects/User.php';

$database = new Database();
$db       = $database->getConnection();
$user     = new User($db);
$data     = json_decode(file_get_contents("php://input"));
if (!empty($data->Nama) && !empty($data->Username) && !empty($data->Level->Level) && !empty($data->Email)) {
    $user->Nama         = $data->Nama;
    $user->Username     = $data->Username;
    $user->Password     = md5("stimik1011");
    $user->Email        = $data->Email;
    $user->Level        = $data->Level->Level;
    $user->Status        = "Aktif";
    if ($user->create()) {
        http_response_code(200);
        echo json_encode(array("message" => $user->IdUser));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create User Akses"));
    }
} else {
    http_response_code(400);

    // tell the user
    echo json_encode(array("message" => "Unable to create product. Data is incomplete."));
}
