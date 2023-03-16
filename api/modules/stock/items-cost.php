<?php
############	Start: Unit List ############
$app->post('/stock/item-cost/get-cost-description', function () use ($app) {
	global $objStock, $input;	
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objStock->get_all_items_cost_description($input_array); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/item-cost/update-cost-description', function () use ($app) {
	global $objStock, $input;	
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objStock->saveUpdateCost($input_array); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/item-cost/edit-cost-description', function () use ($app) {
	global $objStock, $input;	
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objStock->get_item_cost_description($input_array); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/item-cost/delete-cost-description', function () use ($app) {
	global $objStock, $input;	
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objStock->delete_item_cost_description($input_array); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/stock/item-cost/get-convertion-rate', function () use ($app) {
	global $objStock, $input;	
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objStock->getConvertionRate($input_array); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

 

############	End: Unit List ##############
?>