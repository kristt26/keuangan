<?php
class MasterBayar
{
    private $conn;
    private $table_name="masterbayar";
    public $IdMasterBayar;
    public $TA;
    public $Total;
    public $Bayar;
    public $Tunggakan;
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
        $query = "SELECT * FROM ".$this->table_name." WHERE IdMasterBayar=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->IdMasterBayar);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->TA = $row['TA'];
        $this->Total = $row['Total'];
        $this->Bayar = $row['Bayar'];
        $this->Tunggakan = $row['Tunggakan'];
    }

    public function readByMahasiswa()
    {
        $query = "CALL GetMasterBayarByMahasiswa(:IdMahasiswa)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":IdMahasiswa", $this->IdMahasiswa, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    }

    public function readByTA()
    {
        $query = "CALL GetMasterBayarByTA(:IdMahasiswa)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":IdMahasiswa", $this->IdMahasiswa, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    }

    public function create()
    {
        $query = "INSERT INTO ".$this->table_name." SET TA=?, Total=?, Bayar=?, Tunggakan=?, IdMahasiswa=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->TA);
        $stmt->bindParam(2, $this->Total);
        $stmt->bindParam(3, $this->Bayar);
        $stmt->bindParam(4, $this->Tunggakan);
        $stmt->bindParam(5, $this->IdMahasiswa);

        if($stmt->execute()){
            $this->IdMasterBayar= $this->conn->lastInsertId();
            return true;
        }else
        {
            return false;
        }
    }

    public function update()
    {
        $query = "UPDATE ".$this->table_name." SET TA=?, Total=?, Bayar=?, Tunggakan=? WHERE IdMasterBayar=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->TA);
        $stmt->bindParam(2, $this->Total);
        $stmt->bindParam(3, $this->Bayar);
        $stmt->bindParam(4, $this->Tunggakan);
        $stmt->bindParam(5, $this->IdMasterBayar);

        if($stmt->execute()){
            return true;
        }else
        {
            return false;
        }
    }

    public function delete()
    {
        $query = "DELETE FROM ".$this->table_name." WHERE IdMasterBayar=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->IdMasterBayar);

        if($stmt->execute()){
            return true;
        }else
        {
            return false;
        }
    }   
}

?>