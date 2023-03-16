<?php
############	Start: Category Section ############
$app->post('/sales/stock/categories', function () use ($app) {
	
	global $objStock, $input;	
	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	); 
	$result = $objStock->get_categories($array); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/stock/categories/get-category', function () use ($app) {
	global $objStock, $input;	
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
		$result = $objStock->get_data_by_id('category',$input_array['id']); 
	//$result = $objStock->get_category_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/stock/categories/get-all-categories', function () use ($app) {
	global $objStock, $input;	
		$array = array(
				"id"=> $input->id
	);
	// print_r($array);exit;
	$result = $objStock->get_all_categories($array,0);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/stock/categories/add-category', function () use ($app) {
	global $objStock, $input;
	
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	
	$result = $objStock->add_category($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/sales/stock/categories/update-category', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	//print_($input_array);exit;
	$result = $objStock->add_category($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/stock/categories/delete-category', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objStock->delete_category($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

/* $app->post('/sales/stock/categories/status-category', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	//print_r($input_array);exit;
	$result = $objStock->status_category($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); */
############	End: Category Section ##############

?>