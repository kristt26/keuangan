<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
 
// include database and object files
include_once '../../config/database.php';
include_once '../../objects/Pengguna.php';
 
// instantiate database and product object
$database = new Database();
$db = $database->getConnection();
 
// initialize object
$user = new user($db);
 
// query products
//$stmt = $bidang->read();   
//$num = $stmt->rowCount();
 
// check if more than 0 record found
echo json_encode(array("Session" => $user->CheckSession()));
?>