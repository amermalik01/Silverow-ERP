<?php
require 'Slim/Slim.php';
require_once 'classes/Config.Inc.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

#Getting Request
$request = $app->request();
$body = $request->getBody();
$input = json_decode($body);


if (isset($_POST['image_token'])) {
    $input = $_FILES;
    $user_info = $objAuth->authentocate($_POST['image_token']);
} else {
    $input = json_decode($body);
    $user_info = $objAuth->authentocate($input->token);
}

require_once(SERVER_PATH . "/classes/Crm.php");
$objCrm = new Crm($user_info);
$path = $app->request()->getPathInfo();


if (strpos($path, "/crm/crm") !== false) {
    require_once(SERVER_PATH . '/modules/crm/crm.php');
}

if (strpos($path, "/crm/opportunity-cycle") !== false) {
    require_once(SERVER_PATH . '/modules/crm/opportunity-cycle.php');
}

if (strpos($path, "/crm/promotions") !== false) {
    require_once(SERVER_PATH . '/modules/crm/promotions.php');
}

if (strpos($path, "/crm/competitors") !== false) {
    require_once(SERVER_PATH . '/modules/crm/competitors.php');
}

$app->run();