<?php
require 'Slim/Slim.php';
require_once 'classes/Config.Inc.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

#Getting Request
$request = $app->request();
$body = $request->getBody();
$input = json_decode($body);

$user_info = $objAuth->authentocate($input->token);

require_once(SERVER_PATH."/classes/Permissions.php");
$objPermissions = new Permissions($user_info);

//print_r($user_info);exit;
$path =  $app->request()->getPathInfo();

if (strpos($path, "/permissions")  !== false) {
	//print_r($user_info);exit;
	require_once(SERVER_PATH.'/modules/permissions/permissions.php');
	
} 

$app->run();