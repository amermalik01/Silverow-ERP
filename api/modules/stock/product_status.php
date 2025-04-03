<?php
############	Start: Product Status ############

$app->post('/stock/product-status/get-status', function () use ($app) {
	global $objStock, $input;	
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objStock->get_status($input_array); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

 
$app->post('/stock/product-status/get-status-list-by-id', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	} 
	$result = $objStock->get_data_by_id('product_status',$input_array['id']); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/product-status/add-status-list', function () use ($app) {
	global $objStock, $input;	
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	} 
	$result = $objStock->add_status($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/product-status/update-status-list', function () use ($app) {
	global $objStock, $input;	
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	} 
	$result = $objStock->update_status($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/stock/product-status/delete-status-list', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}  
	  $result = $objStock->delete_update_status('product_status','status',$input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

 
?>