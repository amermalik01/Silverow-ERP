<?php
require 'Slim/Slim.php';
require_once 'classes/Config.Inc.php';

// require_once($_SERVER['DOCUMENT_ROOT']."/navson/api/classes/Variable.php");
// require_once(SERVER_PATH."/classes/Variable.php");
//require_once(SERVER_PATH."/classes/Auth.php");
//echo SERVER_PATH;

\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();


#Getting Request
$request = $app->request();
$body = $request->getBody();
//$user_info=''; 
$user_info = $objAuth->authentocate($input->token);

$path = $app->request()->getPathInfo();

//exit;

//$input_new = array  (   "to"=>$_POST['to'] , "message"=>$_POST['message'] ); 
//print_r($input_new);

//if (strpos($path, "/communicationchat/chat")  !== false) {
require_once(SERVER_PATH . "/classes/chat.php");
$objchat = new chat($input_new); //echo 'heasasre';exit;
require_once(SERVER_PATH . '/modules/communication/chat.php');


$app->run();