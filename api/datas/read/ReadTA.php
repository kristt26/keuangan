<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../objects/TahunAkademik.php';

$database = new Database();
$db       = $database->getConnection();

$ta = new TahunAkademik($db);

$stmt       = $ta->read();
$row        = $stmt->fetchALL(PDO::FETCH_ASSOC);
$TaAktif    = $row;
$stmt       = null;

// set response code - 200 OK
http_response_code(200);

// show products data in json format
echo json_encode($TaAktif);
