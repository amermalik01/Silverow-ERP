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
    if(!empty($input->token))
    {
        $user_info = $objAuth->authentocate($input->token);
    }
    else
    {
        $req = $app->request();
        $token= $req->get('token');
        $user_info = $objAuth->authentocate($token);
    }
}   


$path = $app->request()->getPathInfo();

if (strpos($path, "communication/calendar") !== false) {
    require_once(SERVER_PATH . "/classes/Calendar.php");
    $objCalendar = new Calendar($user_info);
    require_once(SERVER_PATH . '/modules/communication/calendar.php');
}


if (strpos($path, "communication/mail") !== false) {
    require_once(SERVER_PATH . "/classes/Mail.php");
    $objMail = new Mail($user_info);
    require_once(SERVER_PATH . '/modules/communication/mail.php');
}

if (strpos($path, "communication/contact") !== false) {
    require_once(SERVER_PATH . "/classes/Contact.php");
    $objContact = new Contact($user_info);
    require_once(SERVER_PATH . '/modules/communication/contact.php');
}

if (strpos($path, "communication/help") !== false) {
    require_once(SERVER_PATH . "/classes/Help.php");
    $objHelp = new Help($user_info);
    require_once(SERVER_PATH . '/modules/communication/help.php');
}

if (strpos($path, "/communication/task") !== false) {
    require_once(SERVER_PATH . "/classes/Task.php");
    $objTask = new Task($user_info);
    require_once(SERVER_PATH . '/modules/communication/task.php');
}

if (strpos($path, "/communication/document") !== false) {
    require_once(SERVER_PATH . "/classes/Document.php");
    $objdoc = new Document($user_info);
    require_once(SERVER_PATH . '/modules/communication/document.php');
}

if (strpos($path, "/communication/chat") !== false) {
    require_once(SERVER_PATH . "/classes/chat.php");
    $objchat = new chat($user_info);
    require_once(SERVER_PATH . '/modules/communication/chat.php');
}

if (strpos($path, "/communication/migration") !== false) {
    require_once(SERVER_PATH . "/classes/Migration.php");
    $objmigration = new Migration($user_info);
    require_once(SERVER_PATH . '/modules/communication/migration.php');
}

$app->run();