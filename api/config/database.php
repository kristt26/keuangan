<?php
class Database{
 
    // specify your own database credentials
    // private $host = "localhost";
    // private $db_name = "keuangan_stimik";
    // private $username = "root";
    // private $password = "";
    // public $conn;
    private $host = "den1.mysql1.gear.host";
    private $db_name = "dbkeuangan";
    private $username = "dbkeuangan";
    private $password = "Kh9wcu!_42nZ";
    public $conn;
 
    // get the database connection
    public function getConnection(){
 
        $this->conn = null;
 
        try{
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            // $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
        }catch(PDOException $exception){
            echo "Connection error: " . $exception->getMessage();
        }
 
        return $this->conn;
    }
}
?>