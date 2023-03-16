<?php

############	Start: Products Listing ############



 $app->post('/setup/service/products-listing/get-code', function () use ($app) { 
	global $objServices, $input;	
	 $array = array(  
				"is_increment"=> $input->is_increment
	);
	$result = $objServices->get_code($array); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
 
	 });
	 

$app->post('/setup/service/products-listing', function () use ($app) {
	 global $objServices, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 } 
	
	$result = $objServices->get_products_listing($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});



$app->post('/setup/service/products-listing/product-details', function () use ($app) {
	global $objServices, $input;	
	$array = array(
				"id"=> $input->product_id
	);
	 $result = $objServices->get_data_by_id('services',$array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/service/products-listing/update-values', function () use ($app) {
	global $objServices, $input;
		 
		$result = $objServices->update_value($input);
	
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/service/products-listing/delete-value', function () use ($app) {
	global $objServices, $input;	
	$input_array = array( 
				"id"=> $input->id
	);
	 $result = $objServices->delete_update_status('services','status',$input_array['id']);
		 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
	 
	 
//---------Sale---------------
	 
	 
	$app->post('/setup/service/products-listing/sale-list', function () use ($app) { 
	global $objServices, $input;	
	$array = array( 
				"product_id"=> $input->product_id
	);
 
	$result = $objServices->get_sale_list_product_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
 
	 });
	 
	 
	$app->post('/setup/service/products-listing/sale-by-id', function () use ($app) { 
	global $objServices, $input;	
	$array = array( 
				"id"=> $input->id
	);
   $result = $objServices->get_data_by_id('service_sale',$array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
 
	 });
	 
	  
	 $app->post('/setup/service/products-listing/delete-sale', function () use ($app) {  
	global $objServices, $input;	
	$array = array( 
				"id"=> $input->id
	);
  $result = $objServices->delete_update_status('service_sale','status',$array['id']);
	
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
 
	 });
	 
	 $app->post('/setup/service/products-listing/customer-sale-list', function () use ($app) {
	global $objServices, $input;	
	$array = array(
				"id"=> $input->id,
				"type"=> $input->type,
				"get_id"=> $input->get_id,
				"select_1s"=> $input->select_1s,
				"cat_ids"=> $input->cat_ids  ,
				"type"=> $input->type,
				"product_id"=> $input->product_id,
				"searchKeyword"=> $input->searchKeyword
	);
	 
	$result = $objServices->get_customer_sale_list($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/service/products-listing/customer-sale-list-filter', function () use ($app) {
	global $objServices, $input;	
	$array = array(
				"id"=> $input->id,
				"type"=> $input->type,
				"get_id"=> $input->get_id,
				"select_1s"=> $input->select_1s,
				"cat_ids"=> $input->cat_ids  ,
				"type"=> $input->type,
				"product_id"=> $input->product_id,
				"searchKeyword"=> $input->searchKeyword
	);
	$result = $objServices->get_customer_sale_list_filter($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

	 
	 
	 
	 
//---------Supplier ----------------
	 $app->post('/setup/service/products-listing/supplier-list', function () use ($app) { 
	global $objServices, $input;	
	$array = array( 
				"product_id"=> $input->product_id
	);
 
	$result = $objServices->get_supplier_list_product_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
 
	 });
	 
	 
	$app->post('/setup/service/products-listing/supplier-by-id', function () use ($app) { 
	global $objServices, $input;	
	$array = array( 
				"id"=> $input->id
	);
 
  $result = $objServices->get_data_by_id('service_product_supplier',$array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
 
	 });
	 
	 
	$app->post('/setup/service/products-listing/delete-sp', function () use ($app) {  
	global $objServices, $input;	
	$array = array( 
				"id"=> $input->id
	);
  $result = $objServices->delete_update_status('service_product_supplier','status',$array['id']);

	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
 
	 }); 
	 
	 
//---------Price Offer Volume----------------
$app->post('/setup/service/products-listing/price-offer-volumes', function () use ($app) {
	global $objServices, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objServices->get_price_offer_volumes($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/service/products-listing/get-service-price-offer-volumes', function () use ($app) {
	global $objServices, $input;
	$array = array(
				"id"=> $input->id
	);
	
	 $result = $objServices->get_data_by_id('service_price_offer_volume',$array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/service/products-listing/add-service-price-offer-volumes', function () use ($app) {
	global $objServices, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objServices->add_price_offer_volume($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/service/products-listing/update-service-price-offer-volumes', function () use ($app) {
	global $objServices, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objServices->add_price_offer_volume($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/service/products-listing/get-price-offer-volume-by-id', function () use ($app) {
	global $objServices, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objServices->get_data_by_id('service_price_offer_volume',$array['id']);

	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/service/products-listing/delete-service-price-offer-volumes', function () use ($app) {
	global $objServices, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	 $result = $objServices->delete_update_status('service_price_offer_volume','status',$input_array['id']);

	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/service/products-listing/get-price-offer-volume-by-type', function () use ($app) {
	global $objServices, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objServices->get_price_offer_volume_by_type($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
	 
	 
	 
//---------Purchase  ----------------
	$app->post('/setup/service/products-listing/purchase-list', function () use ($app) { 
	global $objServices, $input;	
	$array = array( 
				"product_id"=> $input->product_id
	);
 
	$result = $objServices->get_purchase_list_product_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
	 });
	 
	$app->post('/setup/service/products-listing/purchase-by-id', function () use ($app) { 
	global $objServices, $input;	
	$array = array( 
				"id"=> $input->id
	);
	
  $result = $objServices->get_data_by_id('service_product_purchaser',$array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
	 });
	 
	 
	$app->post('/setup/service/products-listing/delete-pr', function () use ($app) {  
	global $objServices, $input;	
	$array = array( 
				"id"=> $input->id
	);
	 $result = $objServices->delete_update_status('service_product_purchaser','status',$array['id']);

	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
 
	 });
	 
	 
	  
//--------------Purchase Offer Volume ------------------------
$app->post('/setup/service/products-listing/purchase-offer-volumes', function () use ($app) {
	global $objServices, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objServices->get_purchase_offer_volume($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/service/products-listing/get-purchase-offer-volume', function () use ($app) {
	global $objServices, $input;
	$array = array(
				"id"=> $input->id
	);
  $result = $objServices->get_data_by_id('service_purchase_offer_volume',$array['id']);
	
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/service/products-listing/add-purchase-offer-volume', function () use ($app) {
	global $objServices, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 } 
	$result = $objServices->add_purchase_offer_volume($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/service/products-listing/update-purchase-offer-volume', function () use ($app) {
	global $objServices, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objServices->add_purchase_offer_volume($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/service/products-listing/get-purchase-offer-volume-by-id', function () use ($app) {
	global $objServices, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
  $result = $objServices->get_data_by_id('service_purchase_offer_volume',$input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/service/products-listing/delete-purchase-offer-volume-by-id', function () use ($app) {
	global $objServices, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	
	 $result = $objServices->delete_update_status('service_purchase_offer_volume','status',$input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/service/products-listing/get-purchase-offer-volume-by-type', function () use ($app) {
	global $objServices, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objServices->get_purchase_offer_volume_by_type($input_array);
	
	
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 

$app->post('/setup/service/products-listing/get-products-popup', function () use ($app) {
	global $objServices, $input;	
$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	
	$result = $objServices->get_products_popup($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/service/products-listing/get-products-popup-invoice', function () use ($app) {
	//echo "here";exit;
	global $objServices, $input;	
	$array = array(
				"all"=> 1,
				"category_id"=> $input->category_id,
				"search_string"=> $input->search_string,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	//print_r($input);exit;
	$result = $objServices->get_products_popup_invoice($array);
	
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});




$app->post('/setup/service/products-listing/products', function () use ($app) {
	global $objServices, $input;	
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objServices->get_products($input_array);
	// print_r($array);exit;
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


############	End: Products Listing ##############
?>