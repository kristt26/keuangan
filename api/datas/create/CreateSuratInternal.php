<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// include database and object file
include_once '../../../api/config/database.php';
include_once '../../../api/objects/ArsipSuratInternal.php';
include_once '../../../api/objects/Tembusan.php';
include_once '../../../api/objects/Fungsi.php';

$database = new Database();
$db = $database->getConnection();
$arsipsurat = new ArsipSuratInternal($db);
$tembusan = new Tembusan($db);

$data = json_decode(file_get_contents("php://input"));
$validate = new Fungsi($data);
if($validate->ValidateEmpty()){
    $arsipsurat->nomor_surat = $data->nomor_surat;
    $arsipsurat->lampiran = $data->lampiran;
    $arsipsurat->tujuan = $data->tujuan;
    $arsipsurat->pengirim = $data->pengirim;
    $arsipsurat->tg_surat = $data->tg_surat;
    $arsipsurat->berkas = $data->berkas;
    $arsipsurat->idkategori_surat = $data->idkategori_surat;
    $arsipsurat->status = "false";
    $db->beginTransaction();
    try{
        if($arsipsurat->create()){
            foreach ($data->tembusan as $key => $value) {
                $tembusan->idpejabat = $value->idpejabat;
                $tembusan->idarsip_surat = $arsipsurat->idarsip_surat;
                $tembusan->create();
                   
            }
        }
        $db->commit();
        http_response_code(201);
        echo json_encode(array("message" => "Sender"));
        

    }catch(Exception $e){
        http_response_code(503);
        echo json_encode(array("message" => $e.getMessage()));
        $db->rollBack();
    }
}else
{
    http_response_code(400);
 
    // tell the user
    echo json_encode(array("message" => "Unable to create product. Data is incomplete."));
}
 
?>