<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once 'CallRest.php';
include_once '../../objects/TahunAkademik.php';
include_once '../../objects/DetailBayarUmum.php';

$database = new Database();
$db = $database->getConnection();
$rest = new CallRest();
$ta = new TahunAkademik($db);
$bayarumum = new DetailBayarUmum($db);

$stmt = $ta->GetTAAktif();
$row = $stmt->fetchALL(PDO::FETCH_ASSOC);
$TaAktif = (object) $row[0];
$datath = explode("-", $TaAktif->TA);
if ($datath[1] == '1') {
    $semester = "GANJIL";
} else {
    $semester = "GENAP";
}
$url = "https://www.restsimak.stimiksepnop.ac.id/api/krsm/AmbilKrsm?thakademik=$datath[0]&gg=$semester";
$Datamhs = json_decode($rest->CallAPI('GET', $url, false), true);
$stmt = null;
$bayarumum->TA = $TaAktif->TA;
$stmt = $bayarumum->GetBayarUmum();

$DataJenisBayar = array("records" => array());
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    extract($row);
    foreach ($Datamhs['data'] as $value) {
        if ($value['npm'] == $row['NPM'] && (int) $row['Jumlah'] == 0) {
            $ItemBayarUmum = array(
                "IdMahasiswa" => $row['IdMahasiswa'],
                "NPM" => $row['NPM'],
                "NamaMahasiswa" => $row['NamaMahasiswa'],
                "Angkatan" => $Angkatan,
            );
            array_push($DataJenisBayar["records"], $ItemBayarUmum);
        }
    }
    
}
echo json_encode($DataJenisBayar);

