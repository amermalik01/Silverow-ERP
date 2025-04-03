<?php
require 'Slim/Slim.php';
require_once 'classes/Config.Inc.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

#Getting Request
$request = $app->request();
$body = $request->getBody();


/*if(isset($_POST['image_token'])){		
	$input = $_FILES;
	$user_info = $objAuth->authentocate($_POST['image_token']); 
} else {
	$input = json_decode($body);
	$user_info = $objAuth->authentocate($input->token);
}*/

if (isset($_POST['token'])) {
    $input = array('multi_doc' => $_FILES['documents']);
    $user_info = $objAuth->authentocate($_POST['token']);
} else {
    $input = json_decode($body);
    $user_info = $objAuth->authentocate($input->token);
}

$path = $app->request()->getPathInfo();


require_once(SERVER_PATH . "/classes/Hr.php");
$objHr = new Hr($user_info);

if (strpos($path, "/roles") !== false)   require_once(SERVER_PATH . '/modules/hr/roles.php');

if (strpos($path, "/hr-tabs") !== false)  require_once(SERVER_PATH . '/modules/hr/hr_tabs.php');

if (strpos($path, "/hr_tabs_col") !== false)  require_once(SERVER_PATH . '/modules/hr/hr_tabs_col.php');

 
if (strpos($path, "/hr_department") !== false)   require_once(SERVER_PATH . '/modules/hr/hr_department.php');
 

if (strpos($path, "/hr_religion") !== false)  require_once(SERVER_PATH . '/modules/hr/hr_religion.php');

if (strpos($path, "/hr_employee_type") !== false)  require_once(SERVER_PATH . '/modules/hr/hr_employee_type.php');

if (strpos($path, "/hr_values") !== false)  require_once(SERVER_PATH . '/modules/hr/hr_values.php');

if (strpos($path, "/hr/employee") !== false)  require_once(SERVER_PATH . '/modules/hr/employee.php');

if (strpos($path, "/hr/leave") !== false)  require_once(SERVER_PATH . '/modules/hr/leave.php');


$app->run();
?>