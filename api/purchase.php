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


if (isset($_POST['image_token'])) {
    $input = $_FILES;
    $user_info = $objAuth->authentocate($_POST['image_token']);
    //print_r($_POST);
} else {

    $input = json_decode($body);
    $user_info = $objAuth->authentocate($input->token);
    // print_r($$user_info); exit;
}


$path = $app->request()->getPathInfo();
/*require_once(SERVER_PATH."/classes/General.php");
$objGen = new General($user_info);*/


if (strpos($path, "/purchase/srm") !== false) {
    require_once(SERVER_PATH . "/classes/Srm.php");
    $objSrm = new Srm($user_info);

    if (strpos($path, "/srm/srm") !== false) {
        require_once(SERVER_PATH . '/modules/purchase/srm.php');
    }
    if (strpos($path, "/srm/srminvoice") !== false) {
        require_once(SERVER_PATH . '/modules/purchase/invoice.php');
    }
    if (strpos($path, "/srm/srmorderreturn") !== false) {
        require_once(SERVER_PATH . '/modules/purchase/order_return.php');
    }

}
else if (strpos($path, "/purchase/supplier") !== false) {
    require_once(SERVER_PATH . "/classes/Supplier.php");
    $objSupplier = new Supplier($user_info);
    require_once(SERVER_PATH . '/modules/purchase/supplier.php');
}
else if (strpos($path, "/shipping-agents") !== false)
    require_once(SERVER_PATH . '/modules/purchase/shipping_agents.php');

else if (strpos($path, "/shipping-prices") !== false)
    require_once(SERVER_PATH . '/modules/purchase/shipping_prices.php');

else if (strpos($path, "/vendors") !== false)
    require_once(SERVER_PATH . '/modules/purchase/vendors.php');

else if (strpos($path, "/vendors-finance") !== false)
    require_once(SERVER_PATH . '/modules/purchase/vendors_finance.php');
else if (strpos($path, "/purchase-contacts") !== false)
    require_once(SERVER_PATH . '/modules/purchase/purchase_contacts.php');
else if (strpos($path, "/quotes") !== false)
    require_once(SERVER_PATH . '/modules/purchase/purchase_quotes.php');

else if (strpos($path, "/documents") !== false) require_once(SERVER_PATH . '/modules/purchase/upload_documents.php');

else if (strpos($path, "/purchase-orders") !== false)
    require_once(SERVER_PATH . '/modules/purchase/purchase_orders.php');


//else {
////        $get_permission = $objAuth->check_permission($user_info['id'], $user_info['company_id'], PUR_QUOTES);
////        if ($get_permission['ack'] == 1) {
////            require_once(SERVER_PATH . '/modules/purchase/purchase_quotes.php');
////        } else {
////            $app->response->setStatus(200);
////            $app->response()->headers->set('Content-Type', 'application/json');
////            echo json_encode($get_permission);
////        }
//
//
//}
$app->run();