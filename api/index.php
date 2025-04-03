<?php
require 'Slim/Slim.php';
require_once 'classes/Config.Inc.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

#Getting Request
$request = $app->request();
$body = $request->getBody();
$input = json_decode($body);

$path = $app->request()->getPathInfo();


$app->post('/test/upload', function () use ($app) {
    print_r($input);
    echo "<hr>";
    print_r($_FILES);
});


/*
$app->post('/employee/login', function () use ($app) {
	global $objAuth, $input;
	$array = array(
				"user_name"=> $input->user_name,
				"password"=> $input->password
	);
	$result = $objAuth->login($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/roles/add', function () use ($app) {
	global $objAuth, $input;
	$result = array();
	if($objAuth->is_valid($input->token)){
	
		$result['ack'] = 1;
	}else{
		$result['ack'] = 0;
		$response['error'] = "Invalid Authentication details";
	
	}
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
*/
$app->run();
