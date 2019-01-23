<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../objects/ArsipSuratInternal.php';
include_once '../../objects/KategoriSurat.php';
include_once '../../objects/Struktural.php';
include_once '../../objects/Pengguna.php';
include_once '../../objects/Pejabat.php';
include_once '../../objects/Tembusan.php';

$database = new Database();
$db = $database->getConnection();

$suratinternal = new ArsipSuratInternal($db);
$kategori = new KategoriSurat($db);
$struktural = new Struktural($db);
$pengguna = new Pengguna($db);
$pejabat = new Pejabat($db);
$tembusan = new Tembusan($db);
$data = json_decode(file_get_contents("php://input"));
$suratinternal->tujuan = $data->idpejabat;


$Datas= array("records"=>array());
$stmt = $suratinternal->readByTujuan();
$num = $stmt->rowCount();
if($num>0)
{
    $Tujuan= array("tujuan"=>array());
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
        extract($row);
        $NamaPengirim="";
        $NamaStrukturalPengirim="";
        $NamaTujuan ="";
        $NamaStrukturanTujuan="";
        $pejabat->idpejabat = $pengirim;
        $pejabat->readById();
        $struktural->idstruktural=$pejabat->idstruktural;
        $pengguna->idpengguna= $pejabat->idpengguna;
        $pengguna->readOne();
        $struktural->readOne();
        $NamaPengirim=$pengguna->nama_pengguna;
        $NamaStrukturalPengirim=$struktural->nm_struktural;
        
        $pejabat->idpejabat = $tujuan;
        $pejabat->readById();
        $struktural->idstruktural=$pejabat->idstruktural;
        $pengguna->idpengguna= $pejabat->idpengguna;
        $pengguna->readOne();
        $struktural->readOne();
        $NamaTujuan = $pengguna->nama_pengguna;
        $NamaStrukturanTujuan= $struktural->nm_struktural;

        //Kategori
        $kategori->idkategori_surat = $idkategori_surat;
        $kategori->readOne();

        $itemSurat = array(
            'idarsip_surat' => $idarsip_surat, 
            'nomor_surat'=> $nomor_surat,
            'lampiran'=>$lampiran,
            'tujuan'=>$tujuan,
            'NamaTujuan'=>$NamaTujuan,
            'StrukturalTujuan'=>$NamaStrukturanTujuan,
            'pengirim' => $pengirim,
            'NamaPengirim' => $NamaPengirim,
            'StrukturalPengirim' => $NamaStrukturalPengirim,
            'tg_surat'=> $tg_surat,
            'berkas' => $berkas,
            'idkategori_surat' => $idkategori_surat,
            'nama_kategori' => $kategori->nama_kategori,
            'status' => $status,
            'tembusan' => array()
        );

        $tembusan->idarsip_surat = $idarsip_surat;
        $stmttembusan = $tembusan->read();
        while ($rowTembusan = $stmttembusan->fetch(PDO::FETCH_ASSOC))
        {
            extract($rowTembusan);
            $pejabat->idpejabat = $idpejabat;
            $pejabat->readById();
            $struktural->idstruktural=$pejabat->idstruktural;
            $pengguna->idpengguna= $pejabat->idpengguna;
            $pengguna->readOne();
            $struktural->readOne();
            $itemtembusan = array(
                'idtembusan' => $idtembusan,
                'idpejabat' => $idpejabat,
                'nama_pejabat' => $pengguna->nama_pengguna,
                'nama_struktural' => $struktural->nm_struktural 
            );
            array_push($itemSurat["tembusan"], $itemtembusan);

        }

        array_push($Tujuan["tujuan"], $itemSurat);
    }
    array_push($Datas["records"], $Tujuan);
    // // set response code - 200 OK
    // http_response_code(200);
 
    // // show products data in json format
    // echo json_encode($Datas);
}

$suratinternal->pengirim = $data->idpejabat;
$stmt1 = $suratinternal->readByPengirim();
$num1 = $stmt1->rowCount();
if($num1>0)
{
    $Pengirim= array("pengirim"=>array());
    while ($row1 = $stmt1->fetch(PDO::FETCH_ASSOC))
    {
        extract($row1);
        $NamaPengirim="";
        $NamaStrukturalPengirim="";
        $NamaTujuan ="";
        $NamaStrukturanTujuan="";
        $pejabat->idpejabat = $pengirim;
        $pejabat->readById();
        $struktural->idstruktural=$pejabat->idstruktural;
        $pengguna->idpengguna= $pejabat->idpengguna;
        $pengguna->readOne();
        $struktural->readOne();
        $NamaPengirim=$pengguna->nama_pengguna;
        $NamaStrukturalPengirim=$struktural->nm_struktural;
        
        $pejabat->idpejabat = $tujuan;
        $pejabat->readById();
        $struktural->idstruktural=$pejabat->idstruktural;
        $pengguna->idpengguna= $pejabat->idpengguna;
        $pengguna->readOne();
        $struktural->readOne();
        $NamaTujuan = $pengguna->nama_pengguna;
        $NamaStrukturanTujuan= $struktural->nm_struktural;

        //Kategori
        $kategori->idkategori_surat = $idkategori_surat;
        $kategori->readOne();

        $itemSurat = array(
            'idarsip_surat' => $idarsip_surat, 
            'nomor_surat'=> $nomor_surat,
            'lampiran'=>$lampiran,
            'tujuan'=>$tujuan,
            'NamaTujuan'=>$NamaTujuan,
            'StrukturalTujuan'=>$NamaStrukturanTujuan,
            'pengirim' => $pengirim,
            'NamaPengirim' => $NamaPengirim,
            'StrukturalPengirim' => $NamaStrukturalPengirim,
            'tg_surat'=> $tg_surat,
            'berkas' => $berkas,
            'idkategori_surat' => $idkategori_surat,
            'nama_kategori' => $kategori->nama_kategori,
            'status' => $status,
            'tembusan' => array()
        );

        $tembusan->idarsip_surat = $idarsip_surat;
        $stmttembusan = $tembusan->read();
        while ($rowTembusan = $stmttembusan->fetch(PDO::FETCH_ASSOC))
        {
            extract($rowTembusan);
            $pejabat->idpejabat = $idpejabat;
            $pejabat->readById();
            $struktural->idstruktural=$pejabat->idstruktural;
            $pengguna->idpengguna= $pejabat->idpengguna;
            $pengguna->readOne();
            $struktural->readOne();
            $itemtembusan = array(
                'idtembusan' => $idtembusan,
                'idpejabat' => $idpejabat,
                'nama_pejabat' => $pengguna->nama_pengguna,
                'nama_struktural' => $struktural->nm_struktural 
            );
            array_push($itemSurat["tembusan"], $itemtembusan);

        }

        array_push($Pengirim["pengirim"], $itemSurat);
    }
    array_push($Datas["records"], $Pengirim);
    // // set response code - 200 OK
    // http_response_code(200);
 
    // // show products data in json format
    // echo json_encode($Datas);
}
http_response_code(200);
echo json_encode($Datas);

?>