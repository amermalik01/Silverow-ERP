<?php

$app->post('/sales/crm/promotion/promotions', function () use ($app) {

	global $objCrm, $input;
	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objCrm->get_promotions($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/crm/promotion/get-promotion', function () use ($app) {
	global $objCrm, $input;
	$array = array(
				"id"=> $input->id
	);
	
	$result = $objCrm->get_promotion_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/sales/crm/promotion/add-promotion', function () use ($app) {
	global $objCrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objCrm->add_promotion($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/crm/promotion/update-promotion', function () use ($app) {
	global $objCrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCrm->update_promotion($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/crm/promotion/delete-promotion', function () use ($app) {
	global $objCrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCrm->delete_promotion($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/crm/promotion/add-promotion-product', function () use ($app) {
	global $objCrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objCrm->add_promotion_product($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/crm/promotion/get-promotion-products', function () use ($app) {
	global $objCrm, $input;
	$array = array(
				"id"=> $input->id
	);
	
	$result = $objCrm->get_promotion_products($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/crm/promotion/delete-promotion-product', function () use ($app) {
	global $objCrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCrm->delete_promotion($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

/* $app->post('/sales/crm/promotion/add-promotion-segment', function () use ($app) {
	global $objCrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objCrm->add_promotion_segment($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/crm/promotion/get-promotion-segments', function () use ($app) {
	global $objCrm, $input;
	$array = array(
				"id"=> $input->id
	);
	
	$result = $objCrm->get_promotion_segments($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/crm/promotion/delete-promotion-segment', function () use ($app) {
	global $objCrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCrm->delete_promotion_segment($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); */

/* $app->post('/sales/crm/promotion/add-promotion-customer', function () use ($app) {
	global $objCrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objCrm->add_promotion_customer($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/crm/promotion/get-promotion-customers', function () use ($app) {
	global $objCrm, $input;
	$array = array(
				"id"=> $input->id
	);
	
	$result = $objCrm->get_promotion_customers($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/crm/promotion/delete-promotion-customer', function () use ($app) {
	global $objCrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCrm->delete_promotion_customer($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
 */