<?php
############	Start: Unit List ############
$app->post('/stock/unit-list/get-unit-list', function () use ($app) {
	global $objStock, $input;	
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objStock->get_unit_list($input_array); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

 
$app->post('/stock/unit-list/get-uni-by-id', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	} 
	$result = $objStock->get_data_by_id('dimentions',$input_array['id']); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/unit-list/add-unit-list', function () use ($app) {
	global $objStock, $input;	
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	  
	$result = $objStock->add_unit_list($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/unit-list/update-unit-list', function () use ($app) {
	global $objStock, $input;	
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	  
	$result = $objStock->update_unit_list($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/stock/unit-list/delete-unit-list', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	} 
	
	  $result = $objStock->delete_update_status('dimentions','status',$input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


############	End: Unit List ##############
?>