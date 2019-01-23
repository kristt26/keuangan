<?php
class BayarUmum
{
    private $conn;
    private $table_name="bayarumum";
    public $IdBayarUmum;
    public $Angkatan;
    public $Nominal;
    public $IdJenisBayar;

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
        $query = "SELECT * FROM ".$this->table_name." WHERE IdBayarUmum=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->IdBayarUmum);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->Angkatan = $row['Angkatan'];
        $this->Nominal = $row['Nominal'];
        $this->IdJenisBayar = $row['IdJenisBayar'];
    }

    public function create()
    {
        $query = "INSERT INTO ".$this->table_name." SET Angkatan=?, Nominal=?, IdJenisBayar=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->Angkatan);
        $stmt->bindParam(2, $this->Nominal);
        $stmt->bindParam(3, $this->IdJenisBayar);

        if($stmt->execute()){
            $this->IdBayarUmum= $this->conn->lastInsertId();
            return true;
        }else
        {
            return false;
        }
    }

    public function update()
    {
        $query = "UPDATE ".$this->table_name." SET Angkatan=?, Nominal=?, IdJenisBayar=? WHERE IdBayarUmum=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->Angkatan);
        $stmt->bindParam(2, $this->Nominal);
        $stmt->bindParam(3, $this->IdJenisBayar);
        $stmt->bindParam(4, $this->IdBayarUmum);

        if($stmt->execute()){
            return true;
        }else
        {
            return false;
        }
    }

    public function delete()
    {
        $query = "DELETE FROM ".$this->table_name." WHERE IdBayarUmum=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->IdBayarUmum);

        if($stmt->execute()){
            return true;
        }else
        {
            return false;
        }
    }   
}

?>