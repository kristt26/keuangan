<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$target_dir = "../../../assets/berkas/";
if(!isset($_FILES['file_upload']))
{
    $response=array("status"=>0,"message"=>"File not choosen!");
    print json_encode($response);
    exit;
}
$f_name=uniqid("Berkas_").str_replace(" ","-",$_FILES['file_upload']['name']);
$target_file="../../../assets/berkas/".$f_name;
if(!move_uploaded_file($_FILES['file_upload']['tmp_name'], $target_file))
{
    
    $response=array("status"=>0,"message"=>"File Upload Failed!");
    print json_encode($response);
    exit;
    
}else {
    $response=array("status"=>1,"message"=>"Success", "namefile"=>$f_name);
    print json_encode($response);
}
        


$uploaded_file=$f_name; //now in your further code/insert query you can use $uploaded_file varriable as file name into your db 


 //your further code here//
 //.....//
 //.....//
 //.....//
?>