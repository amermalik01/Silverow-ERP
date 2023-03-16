<?php
require 'Slim/Slim.php';
require_once 'classes/Config.Inc.php';

\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();

#Getting Request
$request = $app->request();
$body = $request->getBody();

if (isset($_POST['token'])) {

    $input = array('multi_doc' => $_FILES['documents']);
    $user_info = $objAuth->authentocate($_POST['token']);
} 
else {

    $input = json_decode($body);
    $user_info = $objAuth->authentocate($input->token);
}

$path = $app->request()->getPathInfo();
$objFilters = new Filters($user_info);
//echo 'here';exit;

if (strpos($path, "/reports/module") !== false) {
    require_once(SERVER_PATH . "/classes/ReportCrm.php");

    $objReportCrm = new ReportCrm($user_info);
    require_once(SERVER_PATH . '/modules/Reports/reports.php');
    // require_once(SERVER_PATH . '/modules/Reports/sales.php');
} 
else if (strpos($path, "/reports/sales/crm") !== false) {
    require_once(SERVER_PATH . "/classes/ReportCrm.php");

    $objReportCrm = new ReportCrm($user_info);
    require_once(SERVER_PATH . '/modules/Reports/sales/crm.php');
} 
else if (strpos($path, "/reports/purchase/srm") !== false) {
    require_once(SERVER_PATH . "/classes/ReportSrm.php");

    $objReportSrm = new ReportSrm($user_info);
    if (strpos($path, "/reports/purchase/srm") !== false) 
        require_once(SERVER_PATH . '/modules/Reports/purchase/srm.php');
} 
else if (strpos($path, "/reports/humanresourse/hr") !== false) {
    require_once(SERVER_PATH . "/classes/ReportHr.php");

    $objReportHr = new ReportHr($user_info);
    if (strpos($path, "/reports/humanresourse/hr") !== false) 
        require_once(SERVER_PATH . '/modules/Reports/hr/hr.php');
} 
else if (strpos($path, "/reports/stock/item") !== false) {
    require_once(SERVER_PATH . "/classes/ReportItem.php");

    $objReportItem = new ReportItem($user_info);
    if (strpos($path, "/reports/stock/item") !== false) 
        require_once(SERVER_PATH . '/modules/Reports/stock/item.php');
} 
else if (strpos($path, "/reports/account/gl") !== false) {
    require_once(SERVER_PATH . "/classes/ReportGL.php");

    $objReportGL = new ReportGL($user_info);
    if (strpos($path, "/reports/account/gl") !== false) 
        require_once(SERVER_PATH . '/modules/Reports/account/gl.php');
}

$app->run();
?>