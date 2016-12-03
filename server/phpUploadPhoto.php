<?php

$name = $_FILES["file"]["name"];
if ($_FILES["file"]["error"] > 0){
echo "Error Code: " . $_FILES["file"]["error"] . "<br />";
}
else
{
echo "Uploaded file: " . $_FILES["file"]["name"] . "<br />";
echo "Type: " . $_FILES["file"]["type"] . "<br />";
echo "Size: " . ($_FILES["file"]["size"] / 1024) . " kilobytes<br />";
echo "Name: " . $name;

if (file_exists(SITE_ROOT."/photos/$name"))
  {
  echo $_FILES["file"]["name"] . " already exists.";
  }
else
  {
  define ('SITE_ROOT', realpath(dirname(__FILE__)));
  move_uploaded_file($_FILES['file']['tmp_name'], SITE_ROOT."/photos/$name");
  echo "Done";
  }
}
?>