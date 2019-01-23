<?php
class Pengguna
{
    private $conn;
    private $table_name="pengguna";
    public $idpengguna;
    public $nama_pengguna;
    public $username;
    public $password;
    public $email;
    public $akses;

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

    public function login()
    {
        $query = "SELECT * FROM ".$this->table_name." WHERE username=? and password=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->username);
        $stmt->bindParam(2, $this->password);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->nama_pengguna = $row['nama_pengguna'];
        $this->email = $row['email'];
        $this->akses = $row['akses'];
        $this->idpengguna = $row['idpengguna'];
        return $stmt;
    }

    public function CheckSession()
    {
        session_start();
        if(!isset($_SESSION['nama_pengguna']))
        {
            return false;
        }else{
            return $_SESSION;
        }
    }

    public function readOne()
    {
        $query = "SELECT * FROM ".$this->table_name." WHERE idpengguna=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->idpengguna);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->nama_pengguna = $row['nama_pengguna'];
        $this->idpengguna = $row['idpengguna'];
    }
    
    public function create()
    {
        $query = "INSERT INTO ".$this->table_name." SET nama_pengguna=?, username=?, password=?, email=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->nama_pengguna);
        $stmt->bindParam(2, $this->username);
        $stmt->bindParam(3, $this->password);
        $stmt->bindParam(4, $this->email);

        if($stmt->execute()){
            $this->idpengguna= $this->conn->lastInsertId();
            return true;
        }else
        {
            return false;
        }
    }

    public function update()
    {
        $query = "UPDATE ".$this->table_name." SET nama_pengguna=?, username=?, password=?, email=? WHERE idpengguna=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->nama_pengguna);
        $stmt->bindParam(2, $this->username);
        $stmt->bindParam(3, $this->password);
        $stmt->bindParam(4, $this->email);
        $stmt->bindParam(5, $this->idpengguna);

        if($stmt->execute()){
            return true;
        }else
        {
            return false;
        }
    }

    public function delete()
    {
        $query = "DELETE FROM ".$this->table_name." WHERE idpengguna=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->idpengguna);

        if($stmt->execute()){
            return true;
        }else
        {
            return false;
        }
    }
}

?>