<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../objects/TahunAkademik.php';
include_once '../../objects/BayarUmum.php';
include_once '../../objects/BayarKhusus.php';
include_once '../../objects/DetailBayar.php';
include_once '../../objects/JenisBayar.php';

$database = new Database();
$db = $database->getConnection();

$ta = new TahunAkademik($db);
$bayarumum = new BayarUmum($db);
$bayarkhusus = new BayarKhusus($db);
$detailbayar= new DetailBayar($db);
$jenisbayar = new JenisBayar($db);

$data = json_decode(file_get_contents("php://input"));
$stmt= $ta->GetTAAktif();
$row =  $stmt->fetchALL(PDO::FETCH_ASSOC);
$TaAktif = (object) $row[0];
$stmt=null;
$ItemMahasiswa = array(
    "IdMahasiswa" => $data->IdMahasiswa,
    "NPM" => $data->NPM,
    "NamaMahasiswa" => $data->NamaMahasiswa,
    "Angkatan" => $data->Angkatan,
    "Alamat" => $data->Alamat,
    "Kontak" => $data->Kontak,
    "TAAktif" => $TaAktif,
    "BayarUmum" => array(),
    "BayarKhusus" => array()
);
$stmt = $jenisbayar->GetJenisBayar();
$DataJenisBayar = $stmt->fetchALL(PDO::FETCH_ASSOC);
$stmt=null;
$detailbayar->IdMahasiswa=$data->IdMahasiswa;
$detailbayar->TA = $TaAktif->TA;
$stmt= $detailbayar->CekRegistrasi();
$Cek = $stmt->rowCount();
$stmt=null;
if($data->SetStatus==="TampilUmum"){
    if($Cek>0){
        http_response_code(201);
        echo json_encode(
            array("message" => "Mahasiswa Sudah diregistrasikan pada TA '".$TaAktif->TA."', Cek Detail Pembayaran Mahasiswa")
        );
    }else{
        $bayarumum->Angkatan=$data->Angkatan;
        $stmt = $bayarumum->GetBayarUmumByAngkatan();
        $Cek = $stmt->rowCount();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC))
            {
                extract($row);
        
                $ItemBayarUmum=array(
                    "IdBayarUmum"=> $IdBayarUmum,
                    "Angkatan" => $Angkatan,
                    "Nominal"=>$Nominal,
                    "JenisBayar"=>array()
                );
                foreach ($DataJenisBayar as &$value) {
                    if($IdJenisBayar==$value['IdJenisBayar']){
                        array_push($ItemBayarUmum["JenisBayar"], $value);
                    }
                }
                array_push($ItemMahasiswa["BayarUmum"], $ItemBayarUmum);
            }

        http_response_code(200);
     
        // show products data in json format
        echo json_encode($ItemMahasiswa);
    }
}else{
        $bayarkhusus->TA = $TaAktif->TA;
        $stmt = $bayarkhusus->GetBayarKhususByAngkatan();
        $Cek = $stmt->rowCount();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC))
            {
                extract($row);
        
                $ItemBayarKhusus=array(
                    "IdBayarKhusus"=> $IdBayarKhusus,
                    "TA" => $TA,
                    "Nominal"=>$Nominal,
                    "JenisBayar"=>array()
                );
                foreach ($DataJenisBayar as &$value) {
                    if($IdJenisBayar==$value['IdJenisBayar']){
                        array_push($ItemBayarKhusus["JenisBayar"], $value);
                    }
                }
                array_push($ItemMahasiswa["BayarKhusus"], $ItemBayarKhusus);
            }
        
            http_response_code(200);
     
        // show products data in json format
        echo json_encode($ItemMahasiswa);
}


?>