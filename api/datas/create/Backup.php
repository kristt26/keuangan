<?php
error_reporting(0);
date_default_timezone_set("ASIA/TOKYO");
function backup_tables($host, $user, $pass, $name, $nama_file, $tables = '*')
{
    //untuk koneksi database
    $link = mysqli_connect($host, $user, $pass, $name);
    // mysql_select_db($name,$link);
    $return = "DELETE FROM trxbayar;\n
    DELETE FROM masterbayar;\n
    DELETE FROM detailbayar;\n
    DELETE FROM user;\n
    DELETE FROM mahasiswa;\n
    DELETE FROM tahunakademik;\n
    DELETE FROM detailbayarkhusus;\n
    DELETE FROM detailbayarumum;\n
    DELETE FROM bayarkhusus;\n
    DELETE FROM bayarumum;\n
    DELETE FROM jenisbayar;\n";

    $tables = array(
        0 => 'jenisbayar',
        1 => 'bayarumum',
        2 => 'bayarkhusus',
        3 => 'detailbayarumum',
        4 => 'detailbayarkhusus',
        5 => 'tahunakademik',
        6 => 'mahasiswa',
        7 => 'user',
        8 => 'detailbayar',
        9 => 'trxbayar',
    );

    //looping dulu ah
    foreach ($tables as $table) {
        $result = mysqli_query($link, 'SELECT * FROM ' . $table);
        $num_fields = mysqli_num_fields($result);

        for ($i = 0; $i < $num_fields; $i++) {
            while ($row = mysqli_fetch_row($result)) {
                //menyisipkan query Insert. untuk nanti memasukan data yang lama ketable yang baru dibuat. so toy mode : ON
                $return .= 'INSERT INTO ' . $table . ' VALUES(';
                for ($j = 0; $j < $num_fields; $j++) {
                    //akan menelusuri setiap baris query didalam
                    $row[$j] = addslashes($row[$j]);
                    // $row[$j] = preg_replace("\n","\\n",$row[$j]);
                    if (isset($row[$j])) {$return .= '"' . $row[$j] . '"';} else { $return .= '""';}
                    if ($j < ($num_fields - 1)) {$return .= ',';}
                }
                $return .= ");\n";
            }
        }
        $return .= "\n\n\n";
    }

    //simpan file di folder yang anda tentukan sendiri. kalo saya sech folder "DATA"
    $nama_file;
    $folder = './Backup/';
    $proses = new RecursiveDirectoryIterator("$folder");
    foreach (new RecursiveIteratorIterator($proses) as $file) {
        if (!((strpos(strtolower($file), $nama_file)) === false) || empty($nama_file)) {
            $tampil[] = preg_replace("#/#", "/", $file);
        }
        else{
            $handle = fopen('./Backup/' . $nama_file, 'w+');
            fwrite($handle, $return);
            fclose($handle);
            echo "Success";
        }
    }
    
}

$file = "dbumarusman_library2_" . date('d-m-Y') . '.sql';
//panggil fungsi dengan memberi parameter untuk koneksi dan nama file untuk backup
$a = backup_tables("localhost", "root", "", "dbkeuangan", $file);

exit;
