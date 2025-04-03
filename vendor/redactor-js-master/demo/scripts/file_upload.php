<?php

// This is a simplified example, which doesn't cover security of uploaded files. 
// This example just demonstrate the logic behind the process.

//copy($_FILES['file']['tmp_name'], '/files/'.$_FILES['file']['name']);
					
				
 $dir = $_SERVER['DOCUMENT_ROOT']."/stmuhr/asset/redactor-js-master/demo/json/files/"; 
  $file = $dir.$_FILES['file']['name'];

    // copying
    copy($_FILES['file']['tmp_name'], $file);


$array = array(
	'filelink' =>  $file,
	'filename' => $_FILES['file']['name']
);

echo stripslashes(json_encode($array));
	
?>