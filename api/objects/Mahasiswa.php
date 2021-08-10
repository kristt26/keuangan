<?php
class Mahasiswa
{
    private $conn;
    private $table_name="mahasiswa";
    public $IdMahasiswa;
    public $NPM;
    public $NamaMahasiswa;
    public $Angkatan;
    public $Alamat;
    public $Kontak;
    public $Status;

    public function __construct($db) 
    {
        $this->conn = $db;
    }

    public function read()
    {
        $query = "CALL GetMahasiswa()";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function readAktif()
    {
        $query = "SELECT * FROM getmhs";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function readOne()
    {
        $query = "SELECT * FROM ".$this->table_name." WHERE IdMahasiswa=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->IdMahasiswa);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->NPM = $row['NPM'];
        $this->NamaMahasiswa = $row['NamaMahasiswa'];
        $this->Angkatan = $row['Angkatan'];
    }

    public function OneMhs()
    {
        $query = "SELECT * FROM ".$this->table_name." WHERE NPM=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->NPM);
        $stmt->execute();
        return $stmt;
    
    }

    public function readData()
    {
        $query = "CALL GetMahasiswaByNama(:NPM)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":DataNama", $this->NPM, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt; 
    }

    public function create()
    {
        $query = "INSERT INTO ".$this->table_name." SET NPM=?, NamaMahasiswa=?, Angkatan=?, Alamat=?, Kontak=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->NPM);
        $stmt->bindParam(2, $this->NamaMahasiswa);
        $stmt->bindParam(3, $this->Angkatan);
        $stmt->bindParam(4, $this->Alamat);
        $stmt->bindParam(5, $this->Kontak);

        if($stmt->execute()){
            $this->IdMahasiswa= $this->conn->lastInsertId();
            return true;
        }else
        {
            return false;
        }
    }

    public function update()
    {
        $query = "UPDATE ".$this->table_name." SET NPM=?, NamaMahasiswa=?, Angkatan=?, Alamat=?, Kontak=?, Status=? WHERE IdMahasiswa=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->NPM);
        $stmt->bindParam(2, $this->NamaMahasiswa);
        $stmt->bindParam(3, $this->Angkatan);
        $stmt->bindParam(4, $this->Alamat);
        $stmt->bindParam(5, $this->Kontak);
        $stmt->bindParam(6, $this->Status);
        $stmt->bindParam(7, $this->IdMahasiswa);

        if($stmt->execute()){
            return true;
        }else
        {
            return false;
        }
    }

    public function delete()
    {
        $query = "DELETE FROM ".$this->table_name." WHERE IdMahasiswa=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->IdMahasiswa);

        if($stmt->execute()){
            return true;
        }else
        {
            return false;
        }
    }   
}

?>