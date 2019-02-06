<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include database and object files
include_once '../../../api/config/database.php';
include_once '../../../api/objects/User.php';

// instantiate database and product object
$database = new Database();
$db       = $database->getConnection();

// initialize object
$user = new User($db);

// query products
$stmt = $user->log();
http_response_code(200);
