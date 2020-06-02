
<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// include database and object file
include_once '../../../api/objects/Lib.php';
$data = json_decode(file_get_contents("php://input"));

$lib = new Lib();
$lib->file = $_FILES;
$hasil = $lib->Upload();
http_response_code(201);
echo json_encode($hasil);

