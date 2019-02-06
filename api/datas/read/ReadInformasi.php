<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../objects/TahunAkademik.php';
include_once '../../objects/MasterBayar.php';

$database = new Database();
$db = $database->getConnection();
$ta = new TahunAkademik($db);
$masterbayar = new MasterBayar($db);
$stmt = $ta->GetTAAktif();
$row = $stmt->fetch(PDO::FETCH_ASSOC);
$ta->IdTahunAkademik = $row['IdTahunAkademik'];
$ta->TA = $row['TA'];
$stmt = null;
$masterbayar->TA = $ta->TA;
$stmt = $masterbayar->readTA();
$row  = $stmt->fetchALL(PDO::FETCH_ASSOC);
$data = $row;
http_response_code(200);
 
    // show products data in json format
echo json_encode($data);
?>