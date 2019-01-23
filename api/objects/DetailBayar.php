<?php
class DetailBayar
{
    private $conn;
    private $table_name="detailbayar";
    public $IdDetail;
    public $TA;
    public $Jumlah;
    public $IdMahasiswa;

    public function __construct($db) 
    {
        $this->conn = $db;
    }

    public function read()
    {
        $query = "SELECT * FROM ".$this->table_name."";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function readOne()
    {
        $query = "SELECT * FROM ".$this->table_name." WHERE IdDetail=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->IdDetail);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->TA = $row['TA'];
        $this->Jumlah = $row['Jumlah'];
        $this->IdMahasiswa = $row['IdMahasiswa'];
    }

    public function create()
    {
        $query = "INSERT INTO ".$this->table_name." SET TA=?, Jumlah=?, IdMahasiswa=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->TA);
        $stmt->bindParam(2, $this->Jumlah);
        $stmt->bindParam(3, $this->IdMahasiswa);
        if($stmt->execute()){
            $this->IdDetail= $this->conn->lastInsertId();
            return true;
        }else
        {
            return false;
        }
    }

    public function update()
    {
        $query = "UPDATE ".$this->table_name." SET TA=?, Jumlah=?, IdMahasiswa=? WHERE IdDetail=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->TA);
        $stmt->bindParam(2, $this->Jumlah);
        $stmt->bindParam(3, $this->IdMahasiswa);
        $stmt->bindParam(4, $this->IdDetail);

        if($stmt->execute()){
            return true;
        }else
        {
            return false;
        }
    }

    public function delete()
    {
        $query = "DELETE FROM ".$this->table_name." WHERE IdDetail=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->IdDetail);

        if($stmt->execute()){
            return true;
        }else
        {
            return false;
        }
    }   
}

?>