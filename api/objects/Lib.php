<?php
class Lib
{
    public $file; 
    public $name;
    public $ekstensi;
    public function Upload()
    {
        $x = explode('.', $this->file['file']['name']);
        $this->ekstensi = strtolower(end($x));
        $this->FileName();
        $path = '../../../assets/berkas/'. $this->name;
        if (move_uploaded_file($this->file['file']['tmp_name'], $path)) {
            $message = [
                'Berkas' => $this->name
            ];
            return $message;
        } else {
            $message = [
                'data' => "",
            ];
        }
    }

    private function FileName()
    {
        $fn = 15;
        $characters = '0123456789';
        $randomString = '';

        for ($i = 0; $i < $fn; $i++) {
            $index = rand(0, strlen($characters) - 1);
            $randomString .= $characters[$index];
        }
        $this->name =  $randomString.'.'.$this->ekstensi;
    }
}
