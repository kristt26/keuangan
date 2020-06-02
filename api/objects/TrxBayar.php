<?php
class TrxBayar
{
    private $conn;
    private $table_name="trxbayar";
    public $IdTrxBayar;
    public $TA;
    public $TglBayar;
    public $JumlahBayar;
    public $Description;
    public $IdMahasiswa;
    public $IdPetugas;
    public $Berkas;

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

    public function readByMahasiswa()
    {
        $query = "CALL GetTrxBayarByMahasiswa(:IdMahasiswa, :TA)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":IdMahasiswa", $this->IdMahasiswa, PDO::PARAM_INT);
        $stmt->bindParam(":TA", $this->TA, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt;
    }

    public function readOne()
    {
        $query = "SELECT * FROM ".$this->table_name." WHERE IdTrxBayar=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->IdTrxBayar);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->TA = $row['TA'];
        $this->TglBayar = $row['TglBayar'];
        $this->JumlahBayar = $row['JumlahBayar'];
        $this->Description = $row['Description'];
        $this->IdMahasiswa = $row['IdMahasiswa'];
        $this->IdPetugas = $row['IdPetugas'];
    }

    public function create()
    {
        $query = "INSERT INTO ".$this->table_name." SET TA=?, TglBayar=?, JumlahBayar=?, Description=?, IdMahasiswa=?, IdPetugas=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->TA);
        $stmt->bindParam(2, $this->TglBayar);
        $stmt->bindParam(3, $this->JumlahBayar);
        $stmt->bindParam(4, $this->Description);
        $stmt->bindParam(5, $this->IdMahasiswa);
        $stmt->bindParam(6, $this->IdPetugas);
        if($stmt->execute()){
            $this->IdTrxBayar= $this->conn->lastInsertId();
            return true;
        }else
        {
            return false;
        }
    }

    public function CreateBymhs()
    {
        $query = "INSERT INTO ".$this->table_name." SET TA=?, TglBayar=?, JumlahBayar=?, Description=?, IdMahasiswa=?, Berkas=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->TA);
        $stmt->bindParam(2, $this->TglBayar);
        $stmt->bindParam(3, $this->JumlahBayar);
        $stmt->bindParam(4, $this->Description);
        $stmt->bindParam(5, $this->IdMahasiswa);
        $stmt->bindParam(6, $this->Berkas);
        if($stmt->execute()){
            $this->IdTrxBayar= $this->conn->lastInsertId();
            return true;
        }else
        {
            return false;
        }
    }

    public function update()
    {
        $query = "UPDATE ".$this->table_name." SET TA=?, TglBayar=?, JumlahBayar=?, Description=?, IdMahasiswa=?, IdPetugas=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->TA);
        $stmt->bindParam(2, $this->TglBayar);
        $stmt->bindParam(3, $this->JumlahBayar);
        $stmt->bindParam(4, $this->Description);
        $stmt->bindParam(5, $this->IdMahasiswa);
        $stmt->bindParam(6, $this->IdPetugas);
        $stmt->bindParam(7, $this->IdTrxBayar);

        if($stmt->execute()){
            return true;
        }else
        {
            return false;
        }
    }

    public function delete()
    {
        $query = "DELETE FROM ".$this->table_name." WHERE IdTrxBayar=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->IdTrxBayar);

        if($stmt->execute()){
            return true;
        }else
        {
            return false;
        }
    }   
}

?>