<?php

require 'Slim/Slim.php';
require_once 'classes/Config.Inc.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

#Getting Request
$request = $app->request();
$body = $request->getBody();

if (isset($_POST['token'])) {
    $input = array('files' => $_FILES['file'], 'frmData' => $_POST);
    $user_info = $objAuth->authentocate($_POST['token']);

} else {
    $input = json_decode($body);
    $user_info = $objAuth->authentocate($input->token);
}

$path = $app->request()->getPathInfo();
$objFilters = new Filters($user_info);

if (strpos($path, "/sales/crm") !== false) {
    require_once(SERVER_PATH . "/classes/Crm.php");
    $objCrm = new Crm($user_info);

    if (strpos($path, "/crm/crm") !== false) {
        require_once(SERVER_PATH . '/modules/sales/crm/crm.php');
    } else if (strpos($path, "/crm/opportunity-cycle") !== false) {
        require_once(SERVER_PATH . '/modules/sales/crm/opportunity-cycle.php');
    } else if (strpos($path, "/crm/promotion") !== false) {
        require_once(SERVER_PATH . '/modules/sales/crm/promotions.php');
    } else if (strpos($path, "/crm/competitor") !== false) {
        require_once(SERVER_PATH . '/modules/sales/crm/competitors.php');
    }

} else if (strpos($path, "/sales/customer") !== false) {

    require_once(SERVER_PATH . "/classes/Customer.php");

    $objCustomer = new Customer($user_info);
    
    if (strpos($path, "/customer/customer") !== false) {
        require_once(SERVER_PATH . '/modules/sales/customer/customer.php');
    } 
    else if (strpos($path, "/customer/quote") !== false) {
        require_once(SERVER_PATH . '/modules/sales/customer/quote.php');
    } 
    else if (strpos($path, "/customer/order") !== false || strpos($path, "/customer/return-order") !== false) {
        require_once(SERVER_PATH . '/modules/sales/customer/order.php');
    } 
    else if (strpos($path, "/customer/sale-target") !== false) {
        require_once(SERVER_PATH . "/classes/Customersales.php");
        $objcustomersale = new Customersales($user_info);
        require_once(SERVER_PATH . '/modules/sales/sales_target.php');
    } 
    else if (strpos($path, "/customer/sale-forcast") !== false) {
        require_once(SERVER_PATH . "/classes/Customersales.php");
        $objcustomersale = new Customersales($user_info);
        require_once(SERVER_PATH . '/modules/sales/sales_target.php');
    } 
    else if (strpos($path, "/customer/sale-group") !== false) {
        require_once(SERVER_PATH . "/classes/Customersales.php");
        $objcustomersale = new Customersales($user_info);
        require_once(SERVER_PATH . '/modules/sales/sales_target.php');
    } 
    else if (strpos($path, "/customer/sale-bucket") !== false) {
        require_once(SERVER_PATH . "/classes/Customersales.php");
        $objcustomersale = new Customersales($user_info);
        require_once(SERVER_PATH . '/modules/sales/sales_bucket.php');
    }


} else if (strpos($path, "/sales/stock") !== false) {
    require_once(SERVER_PATH . "/classes/Salestock.php");

    $objStock = new Salestock($user_info);
    if (strpos($path, "/categories") !== false) {
        require_once(SERVER_PATH . '/modules/sales/stock/categories.php');
    }
    if (strpos($path, "/products-listing") !== false) {
        require_once(SERVER_PATH . '/modules/sales/stock/products_listing.php');
    }
    if (strpos($path, "/unit-measure") !== false) {
        require_once(SERVER_PATH . '/modules/sales/stock/units_of_measure.php');
    }
} else if (strpos($path, "/sales/warehouse") !== false) {

    require_once(SERVER_PATH . "/classes/Saleswarehouse.php");
    $objWarehouse = new Saleswarehouse($user_info);
    require_once(SERVER_PATH . '/modules/sales/warehouse.php');

} else {
    require_once(SERVER_PATH . "/classes/Sales.php");
    $objSales = new Sales($user_info);
    if (strpos($path, "/to-do") !== false) {
        require_once(SERVER_PATH . '/modules/sales/to_do.php');
    } else if (strpos($path, "/sales-pipeline") !== false) {
        require_once(SERVER_PATH . '/modules/sales/sales_pipeline.php');
    } else if (strpos($path, "/credit-note") !== false) {
        require_once(SERVER_PATH . '/modules/sales/credit_note.php');
    } else if (strpos($path, "/sales-statistics") !== false) {
        require_once(SERVER_PATH . '/modules/sales/sales_statistics.php');
    }
}


$app->run();