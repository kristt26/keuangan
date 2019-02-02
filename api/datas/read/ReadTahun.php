<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../objects/BayarUmum.php';

$database = new Database();
$db = $database->getConnection();

$bayarumum = new BayarUmum($db);

$stmt = $bayarumum->AmbilAngkatan();
$num = $stmt->rowCount();

if($num>0)
{
    $DatasAngkatan= array("records"=>array());
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
        extract($row);
 
        $Item=array(
            "Angkatan" => $Angkatan,
        );
 
        array_push($DatasAngkatan["records"], $Item);
    }
    // set response code - 200 OK
    http_response_code(200);
 
    // show products data in json format
    echo json_encode($DatasAngkatan);
}else
{
    // set response code - 404 Not found
    http_response_code(404);
 
    // tell the user no products found
    echo json_encode(
        array("message" => "No Kategori found.")
    );
}

?>