<?php
$app->post('/setup/attachments/attachments/uploadFile', function () use ($app) {
	global $objAtt, $input;
	$input_array = array();
	foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objAtt->uploadFile($_FILES,$_REQUEST);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); 

$app->post('/setup/attachments/attachments/getFileListing', function () use ($app) {
	global $objAtt, $input;
	$input_array = array();
	foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objAtt->getFileListing($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); 

$app->post('/setup/attachments/attachments/deleteFileById', function () use ($app) {
	global $objAtt, $input;
	$input_array = array();
	foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objAtt->deleteFileById($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); 


$app->post('/setup/attachments/attachments/updateFile', function () use ($app) {
	global $objAtt, $input;
	$input_array = array();
	foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objAtt->updateFile($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
<<<<<<< HEAD
}); 



?>
=======
});
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
