<?php
 
// This is a simplified example, which doesn't cover security of uploaded images. 
// This example just demonstrate the logic behind the process. 
  
// files storage folder
//  $dir = '/home/web/sitecom/images/';
 
 
 $dir = $_SERVER['DOCUMENT_ROOT']."/stmuhr/asset/redactor-js-master/demo/json/images/"; 
 
 
  //$dir2 = 'http://127.0.0.1:8080/university/asset/redactor-js-master/demo/json/images/';
 
 $dir2 = 'http://127.0.0.1:8080/stmuhr/asset/redactor-js-master/demo/json/images/';

 

 

$_FILES['file']['type'] = strtolower($_FILES['file']['type']);
 
if ($_FILES['file']['type'] == 'image/png' 
|| $_FILES['file']['type'] == 'image/jpg' 
|| $_FILES['file']['type'] == 'image/gif' 
|| $_FILES['file']['type'] == 'image/jpeg'
|| $_FILES['file']['type'] == 'image/pjpeg')
{	
    // setting file's mysterious name
    $filename = md5(date('YmdHis')).'.jpg';
      $file = $dir.$filename;

    // copying
    copy($_FILES['file']['tmp_name'], $file);

    // displaying file    
	$array = array(
		'filelink' => $dir2.$filename
	); 
	
	echo stripslashes(json_encode($array));   
    
}
 
?>