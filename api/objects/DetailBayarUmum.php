<?php
class DetailBayarUmum
{
    private $conn;
    private $table_name="detailbayarumum";
    public $IdDetailBayarUmum;
    public $IdMahasiswa;
    public $Nominal;
    public $TA;
    public $IdBayarUmum;

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

    public function CekRegistrasi()
    {
        $query = "CALL CekRegistrasi(:TAValue, :Mahasiswa)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":TAValue", $this->TA, PDO::PARAM_STR);
        $stmt->bindParam(":Mahasiswa", $this->IdMahasiswa, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    }
    

    public function readOne()
    {
        $query = "CALL GetDetailBayarUmumByTA(:IdMahasiswa, :TA)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":IdMahasiswa", $this->IdMahasiswa, PDO::PARAM_INT);
        $stmt->bindParam(":TA", $this->TA, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt;
    }

    public function create()
    {
        $query = "INSERT INTO ".$this->table_name." SET IdMahasiswa=?, Nominal=?, TA=?, IdBayarUmum=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->IdMahasiswa);
        $stmt->bindParam(2, $this->Nominal);
        $stmt->bindParam(3, $this->TA);
        $stmt->bindParam(4, $this->IdBayarUmum);
        if($stmt->execute()){
            $this->IdDetailBayarUmum= $this->conn->lastInsertId();
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