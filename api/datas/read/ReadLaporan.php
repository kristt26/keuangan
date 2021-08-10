<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../objects/Laporan.php';
include_once '../../objects/TahunAkademik.php';
include_once '../../objects/Mahasiswa.php';

$database = new Database();
$db       = $database->getConnection();

$laporan = new Laporan($db);
$ta = new TahunAkademik($db);
$mahasiswa = new Mahasiswa($db);
$stmt               = $laporan->read();
$row                = $stmt->fetchALL(PDO::FETCH_ASSOC);
$data['Laporan']    = $row;
$stmt               = null;
$stmt               = $ta->read();
$row                = $stmt->fetchALL(PDO::FETCH_ASSOC);
$data['TA']         = $row;
$stmt               = null;
$stmt               = $mahasiswa->readAktif();
$row                = $stmt->fetchALL(PDO::FETCH_ASSOC);
$data['mahasiswa']  = $row;
// set response code - 200 OK
http_response_code(200);

// show products data in json format
echo json_encode($data);
