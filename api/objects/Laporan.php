<?php
class Laporan
{
    private $conn;
    private $table_name="";
    public $IdDetail;
    public $TA;
    public $Total;
    public $Bayar;
    public $IdMahasiswa;
    public $Tunggakan;
    public $NPM;
    public $NamaMahasiswa;

    public function __construct($db) 
    {
        $this->conn = $db;
    }

    public function read()
    {
        $query = "CALL getLaporan()";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    
    public function readByTA()
    {
        $query = "CALL getLaporanByTA(:TA)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":TA", $this->TA, PDO::PARAM_STR);
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

    public function CekRegistrasiKhusus()
    {
        $query = "CALL CekBayarkhusus(:TAValue, :Mahasiswa)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":TAValue", $this->TA, PDO::PARAM_STR);
        $stmt->bindParam(":Mahasiswa", $this->IdMahasiswa, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    }
    

    public function readOne()
    {
        $query = "CALL GetOneDetailBayar(:TA, :IdMahasiswa)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":TA", $this->TA, PDO::PARAM_STR);
        $stmt->bindParam(":IdMahasiswa", $this->IdMahasiswa, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->IdDetail=$row["IdDetail"];
        $this->TA = $row['TA'];
        $this->Jumlah = $row['Jumlah'];
        $this->IdMahasiswa = $row['IdMahasiswa'];
        $stmt=null;
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

    public function updateByJenis()
    {
        $query = "UPDATE ".$this->table_name." SET Jumlah=? WHERE IdDetail=?";
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