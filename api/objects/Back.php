<?php
class Back
{
    private $conn;
    // private $table_name="bayarkhusus";
    // public $IdBayarKhusus;
    // public $TA;
    // public $Nominal;
    // public $IdJenisBayar;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function read()
    {
        $query = "SHOW TABLES";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

}
