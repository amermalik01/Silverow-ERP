<?php
############	Start: Category Unit of Measures Section ############
$app->post('/stock/cat-unit', function () use ($app) {
	global $objStock, $input;	
	
	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objStock->get_cat_unit($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/cat-unit/get-all-cat', function () use ($app) {
	global $objStock, $input;	
	
	$result = $objStock->get_all_categories($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/cat-unit/get-cat-unit-by-cat-nd-unit_id', function () use ($app) {
	global $objStock, $input;	
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objStock->get_cat_unit_by_cat_nd_unit_id($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/cat-unit/get-cat-unit', function () use ($app) {
	global $objStock, $input;	
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objStock->get_data_by_id('category_units_of_measure',$input_array['id']); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/stock/cat-unit/get-all-unit', function () use ($app) {
	global $objStock, $input;	
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objStock->get_all_units($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/cat-unit/add-cat-unit', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objStock->add_cat_unit($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/stock/cat-unit/update-cat-unit', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objStock->update_cat_unit($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/cat-unit/delete-cat-unit', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objStock->delete_update_status('category_units_of_measure','status',$input_array['id']); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
############	End: Category Unit of Measures Section ##############
?>