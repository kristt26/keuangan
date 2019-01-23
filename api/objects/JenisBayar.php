<?php
class JenisBayar
{
    private $conn;
    private $table_name="jenisbayar";
    public $IdJenisBayar;
    public $Jenis;

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
        $query = "SELECT * FROM ".$this->table_name." WHERE IdJenisBayar=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->IdJenisBayar);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->Jenis = $row['Jenis'];
    }

    public function create()
    {
        $query = "INSERT INTO ".$this->table_name." SET Jenis=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->Jenis);

        if($stmt->execute()){
            $this->IdJenisBayar= $this->conn->lastInsertId();
            return true;
        }else
        {
            return false;
        }
    }

    public function update()
    {
        $query = "UPDATE ".$this->table_name." SET Jenis=? WHERE IdJenisBayar=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->Jenis);
        $stmt->bindParam(2, $this->IdJenisBayar);

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