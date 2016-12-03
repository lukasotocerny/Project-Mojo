<?php
$data = json_decode(file_get_contents("php://input"));
$filename = $data->filename;

$filepath = getcwd()."/photos/$filename.jpg";
unlink($filepath);
?>