<?php
require 'Slim/Slim.php';
require_once 'classes/Config.Inc.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

#Getting Request
$request = $app->request();
$body = $request->getBody();


if(isset($_POST['image_token'])){
	$input = $_FILES;
	$user_info = $objAuth->authentocate($_POST['image_token']);
} else {

	$input = json_decode($body);
	$user_info = $objAuth->authentocate($input->token);
}

   $path =  $app->request()->getPathInfo();
/*require_once(SERVER_PATH."/classes/General.php");
$objGen = new General($user_info);*/


require_once(SERVER_PATH."/classes/Stock.php"); 
$objStock = new Stock($user_info);


		if (strpos($path, "/brands")  !== false)
			require_once(SERVER_PATH.'/modules/stock/brands.php');

		else if (strpos($path, "/categories")  !== false)
			require_once(SERVER_PATH.'/modules/stock/categories.php');

		else if (strpos($path, "/cat-unit")  !== false)
			require_once(SERVER_PATH.'/modules/stock/cat_units_of_measure.php');

		else if (strpos($path, "/unit-measure")  !== false)
			require_once(SERVER_PATH.'/modules/stock/units_of_measure.php');

		 else if (strpos($path, "/dimention")  !== false)
			require_once(SERVER_PATH.'/modules/stock/dimention_list.php');

		else if (strpos($path, "/product-status")  !== false)
			require_once(SERVER_PATH.'/modules/stock/product_status.php');

		else if (strpos($path, "/product-tabs")  !== false)
			require_once(SERVER_PATH.'/modules/stock/product_tabs.php'); 

		else if (strpos($path, "/product-tabs-col")  !== false)
			require_once(SERVER_PATH.'/modules/stock/product_tabs_col.php'); 

		else if (strpos($path, "/product-tab-values")  !== false)
			require_once(SERVER_PATH.'/modules/stock/product_tab_values.php');

		else if (strpos($path, "/products-listing")  !== false)
			require_once(SERVER_PATH.'/modules/stock/products_listing.php');
			
		else if (strpos($path, "/item-weight")  !== false)
			require_once(SERVER_PATH.'/modules/stock/items-weight.php');
			else if (strpos($path, "/item-cost")  !== false)
			require_once(SERVER_PATH.'/modules/stock/items-cost.php');

	 //$get_permission = $objAuth->check_permission($user_info,STOCK_PRODUCTS);
	 //($user_info['id'], $user_info['company_id'], STOCK_PRODUCTS);
	
//	if($get_permission['ack'] == 1){
//
//		if (strpos($path, "/brands")  !== false) {
//			require_once(SERVER_PATH.'/modules/stock/brands.php');
//		}
//		else if (strpos($path, "/categories")  !== false) {
//			require_once(SERVER_PATH.'/modules/stock/categories.php');
//		}
//		else if (strpos($path, "/cat-unit")  !== false) {
//			require_once(SERVER_PATH.'/modules/stock/cat_units_of_measure.php');
//		}
//		else if (strpos($path, "/unit-measure")  !== false) {
//			require_once(SERVER_PATH.'/modules/stock/units_of_measure.php');
//		}
//		 else if (strpos($path, "/dimention")  !== false) {
//			require_once(SERVER_PATH.'/modules/stock/dimention_list.php');
//		}
//		else if (strpos($path, "/product-status")  !== false) {
//			require_once(SERVER_PATH.'/modules/stock/product_status.php');
//		}
//		else if (strpos($path, "/product-tabs")  !== false) {
//			require_once(SERVER_PATH.'/modules/stock/product_tabs.php');
//		}
//		else if (strpos($path, "/product-tabs-col")  !== false) {
//			require_once(SERVER_PATH.'/modules/stock/product_tabs_col.php');
//		}
//		else if (strpos($path, "/product-tab-values")  !== false) {
//			require_once(SERVER_PATH.'/modules/stock/product_tab_values.php');
//		}
//		else if (strpos($path, "/products-listing")  !== false) {
//			require_once(SERVER_PATH.'/modules/stock/products_listing.php');
//		}
//
//	}
//	else {
//			$app->response->setStatus(200);
//			$app->response()->headers->set('Content-Type', 'application/json');
//			echo json_encode($get_permission);
//	}
//
	
	


$app->run();