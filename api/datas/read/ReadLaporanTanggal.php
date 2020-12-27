<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../objects/TrxBayar.php';

$database = new Database();
$db       = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));
$laporan = new TrxBayar($db);
$stmt               = $laporan->readByTanggal($data->Awal, $data->Akhir);
$row                = $stmt->fetchALL(PDO::FETCH_ASSOC);
$stmt               = null;
// set response code - 200 OK
http_response_code(200);

// show products data in json format
echo json_encode($row);
