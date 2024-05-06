<?php
class Database
{

    // specify your own database credentials
    // private $host = "localhost";
    // private $db_name = "dbkeuangan";
    // private $username = "root";
    // private $password = "";
    // public $conn;
    // private $host = "stimiksepnop.ac.id";
    private $host = "usn-papua.ac.id";
    private $db_name = "u3011751_keuangan";
    private $username = "u3011751_root";
    private $password = "Stimik@1011";
    public $conn;

    // private $host = "192.168.5.101";
    // private $db_name = "dbkeuangan";
    // private $username = "root";
    // private $password = "admin@db1011";

    // get the database connection
    public function getConnection()
    {

        $this->conn = null;

        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            // $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        } catch (PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
