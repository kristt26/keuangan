<?php 
class Fungsi
{
    public $DataArray;
    public function __construct($Array) {
        $this->DataArray = $Array;
    }    

    public function ValidateEmpty()
    {
        $result = false;
        foreach ($this->DataArray as $key => $value) {
            if(!empty($key)){
                $result = true;
            }else
            {
                $result = false;
            }
        }
        return $result;
    }
}

?>