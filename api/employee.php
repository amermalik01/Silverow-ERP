<?php
require 'Slim/Slim.php';
require_once 'classes/Config.Inc.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

#Getting Request
$request = $app->request();
$body = $request->getBody();
$input = json_decode($body);

$app->post('/employee/add', function () use ($app) {
	global $input;
	
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->run();