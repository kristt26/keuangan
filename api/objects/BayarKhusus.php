<?php
class BayarKhusus
{
    private $conn;
    private $table_name="bayarkhusus";
    public $IdBayarKhusus;
    public $TA;
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
        $query = "SELECT * FROM ".$this->table_name." WHERE IdBayarKhusus=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->IdBayarKhusus);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->TA = $row['TA'];
        $this->Nominal = $row['Nominal'];
        $this->IdJenisBayar = $row['IdJenisBayar'];
    }

    public function create()
    {
        $query = "INSERT INTO ".$this->table_name." SET TA=?, Nominal=?, IdJenisBayar=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->TA);
        $stmt->bindParam(2, $this->Nominal);
        $stmt->bindParam(3, $this->IdJenisBayar);

        if($stmt->execute()){
            $this->IdBayarKhusus= $this->conn->lastInsertId();
            return true;
        }else
        {
            return false;
        }
    }

    public function update()
    {
        $query = "UPDATE ".$this->table_name." SET TA=?, Nominal=?, IdJenisBayar=? WHERE IdBayarKhusus=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->TA);
        $stmt->bindParam(2, $this->Nominal);
        $stmt->bindParam(3, $this->IdJenisBayar);
        $stmt->bindParam(4, $this->IdBayarKhusus);

        if($stmt->execute()){
            return true;
        }else
        {
            return false;
        }
    }

    public function delete()
    {
        $query = "DELETE FROM ".$this->table_name." WHERE IdBayarKhusus=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->IdBayarKhusus);

        if($stmt->execute()){
            return true;
        }else
        {
            return false;
        }
    }   
}

?>