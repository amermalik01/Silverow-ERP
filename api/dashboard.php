<?php

require 'Slim/Slim.php';
require_once 'classes/Config.Inc.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

#Getting Request
$request = $app->request();
$body = $request->getBody();
/*$input = json_decode($body);
$user_info = $objAuth->authentocate($input->token);*/
//print_r($user_info);


if (isset($_POST['image_token'])) {
    $input = $_FILES;
    $user_info = $objAuth->authentocate($_POST['image_token']);
    //print_r($_POST);
} else {

    $input = json_decode($body);
    $user_info = $objAuth->authentocate($input->token);
    //print_r($user_info); exit;
}


$path = $app->request()->getPathInfo();
/*require_once(SERVER_PATH."/classes/General.php");
$objGen = new General($user_info);
 */

if (strpos($path, "/dashboard") !== false) {
        require_once(SERVER_PATH . "/classes/Dashboard.php");
        $objDash = new Dashboard($user_info);
        require_once(SERVER_PATH . '/modules/dashboard/dashboard.php');

}

$app->run();