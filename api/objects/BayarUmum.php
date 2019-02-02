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
        $query = "CALL ReadBayarUmum()";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function readAngkatan()
    {
        $query = "CALL ReadBayarUmum()";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function CekAngkatan()
    {
        $query = "Select Angkatan from bayarumum WHERE Angkatan=:Angkatan";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":Angkatan", $this->Angkatan);
        $stmt->execute();
        return $stmt;
    }

    public function GetBayarUmumByAngkatan()
    {
        $query = "CALL GetBayarUmumByAngkatan(:Angkatan)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":Angkatan", $this->Angkatan, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt;
    }

    public function AmbilAngkatan()
    {
        $query = "CALL AmbilAngkatan()";
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
            $query = "INSERT INTO ".$this->table_name." SET Angkatan=:Angkatan, Nominal=:Nominal, IdJenisBayar=:IdJenisBayar";
            $stmt = $this->conn->prepare($query, array(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true));
            $stmt->bindParam(":Angkatan", $this->Angkatan);
            $stmt->bindParam(":Nominal", $this->Nominal);
            $stmt->bindParam(":IdJenisBayar", $this->IdJenisBayar);
            if($stmt->execute()){
                $this->IdBayarUmum= $this->conn->lastInsertId();
                return true;
            }else{
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

    public function updateNominal()
    {
        $query = "UPDATE ".$this->table_name." SET Nominal=? WHERE IdBayarUmum=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->Nominal);
        $stmt->bindParam(2, $this->IdBayarUmum);

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