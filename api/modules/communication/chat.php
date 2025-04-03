<?php

$app->post('/communication/chat/get-admin-user', function () use ($app) {
	global $objchat, $input;
	$input_array = array();
	foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	// echo 'heasasre';exit;
	$result = $objchat->get_admin_user($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/communication/chat/chatheartbeat', function () use ($app) {
	global $objchat, $input;
	$input_array = array();
	foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objchat->chatheartbeat($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/communication/chat/startchatsession', function () use ($app) {
	global $objchat, $input;
	$input_array = array();
	foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objchat->startchatsession($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/communication/chat/sendchat', function () use ($app) {
	global $objchat, $input;
 print_r($input);
	$result = $objchat->sendChat($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});




?>


