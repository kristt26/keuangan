<?php
class LaporanRekap
{
    private $conn;
    private $table_name="";
    public $npm;
    public $nama;
    public $tagihan;
    public $bayar;
    public $tunggakan;

    public function __construct($db) 
    {
        $this->conn = $db;
    }

    public function read()
    {
        $query = "SELECT * FROM mahasiswa";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}

?>