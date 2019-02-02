<?php
class User
{
    private $conn;
    private $table_name="user";
    public $IdUser;
    public $Username;
    public $Password;
    public $Level;
    public $Nama;

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
        $query = "SELECT * FROM ".$this->table_name." WHERE Username=? and Password=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->Username);
        $stmt->bindParam(2, $this->Password);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->Level = $row['Level'];
        $this->Nama = $row['Nama'];
        return $stmt;
    }

    public function CheckSession()
    {
        session_start();
        if(!isset($_SESSION['Nama']))
        {
            return false;
        }else{
            return $_SESSION;
        }
    }

    public function readOne()
    {
        $query = "SELECT * FROM ".$this->table_name." WHERE IdUser=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->IdUser);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->Nama = $row['Nama'];
        $this->Level = $row['Level'];
        $this->IdUser = $row['IdUser'];
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
            $this->IdUser= $this->conn->lastInsertId();
            return true;
        }else
        {
            return false;
        }
    }

    public function update()
    {
        $query = "UPDATE ".$this->table_name." SET nama_pengguna=?, username=?, password=?, email=? WHERE IdUser=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->nama_pengguna);
        $stmt->bindParam(2, $this->username);
        $stmt->bindParam(3, $this->password);
        $stmt->bindParam(4, $this->email);
        $stmt->bindParam(5, $this->IdUser);

        if($stmt->execute()){
            return true;
        }else
        {
            return false;
        }
    }

    public function delete()
    {
        $query = "DELETE FROM ".$this->table_name." WHERE IdUser=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->IdUser);

        if($stmt->execute()){
            return true;
        }else
        {
            return false;
        }
    }
}

?>