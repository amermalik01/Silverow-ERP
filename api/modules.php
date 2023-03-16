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

require_once(SERVER_PATH."/classes/Modules.php");
$objModules = new Modules($user_info);

//print_r($user_info);exit;
$path =  $app->request()->getPathInfo();

if($user_info['user_type'] == 1 || $user_info['user_type'] == 2) {
	if (strpos($path, "/modules")  !== false) {
		require_once(SERVER_PATH.'/modules/modules/modules.php');
		
	} 
}

$app->run();