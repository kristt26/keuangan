<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
include_once '../../config/database.php';
include_once '../../objects/User.php';
$database = new Database();
$db = $database->getConnection();
$user = new User($db);
$data=json_decode(file_get_contents("php://input"));
$user->Username = $data->username;
$user->Password = md5($data->password);
$user->Status = "Aktif";
$stmt = $user->login();
$row = $stmt->rowCount();

if($row>0)
{
    ini_set('display_errors', 1);
    session_start();
    $_SESSION["IdUser"] = $user->IdUser;
    $_SESSION["Nama"] = $user->Nama;
    $_SESSION["Level"] = $user->Level;
    echo json_encode(array("Session" => $_SESSION));
}else {
    echo json_encode(array("message" => "Username dan Password Salah!"));
}

?>