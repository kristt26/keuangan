<?php
class TahunAkademik
{
    private $conn;
    private $table_name="tahunakademik";
    public $IdTahunAkademik;
    public $TA;
    public $Status;
    public $IdStatus;

    public function __construct($db) 
    {
        $this->conn = $db;
    }

    public function read()
    {
        $query = "CALL GetTahunAkademik()";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function readOne()
    {
        $query = "SELECT * FROM ".$this->table_name." WHERE IdJenisBayar=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->IdJenisBayar);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->Jenis = $row['Jenis'];
        $this->Sifat = $row['Sifat'];
    }

    public function readByStatus()
    {
        $query = "CALL GetStatusAktif()";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function readBySifatKhusus()
    {
        $query = "SELECT * FROM ".$this->table_name." WHERE Sifat=:Sifat";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":Sifat", $this->Sifat);
        $stmt->execute();
        return $stmt;
    }

    public function GetTAAktif()
    {
        $query = "CALL GetTAAktif()";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function create()
    {
        $query = "INSERT INTO ".$this->table_name." SET TA=?, Status=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->TA);
        $stmt->bindParam(2, $this->Status);
        if($stmt->execute()){
            return true;
        }else
        {
            return false;
        }
    }

    public function update()
    {
        $query = "UPDATE ".$this->table_name." SET Status=:Status WHERE Status=:DataStatus";
        $stmt = $this->conn->prepare($query);
        $this->IdStatus= "Aktif";
        $stmt->bindParam(":Status", $this->Status);
        $stmt->bindParam(":DataStatus", $this->IdStatus);
        if($stmt->execute()){
            return true;
        }else
        {
            return false;
        }
    }

    public function delete()
    {
        $query = "DELETE FROM ".$this->table_name." WHERE IdJenisBayar=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->IdJenisBayar);

        if($stmt->execute()){
            return true;
        }else
        {
            return false;
        }
    }
}

?>