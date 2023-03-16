<?php
############	Start: Unit of Measures Section ############
$app->post('/sales/stock/unit-measure/units', function () use ($app) {
	//echo "here";exit;
	global $objStock, $input;	
	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	//print_r($array);exit;
	$result = $objStock->get_units($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

/* $app->post('/sales/stock/unit-measure/get-unit', function () use ($app) {
	global $objStock, $input;	
	$array = array(
				"id"=> $input->id
	);
	$result = $objStock->get_unit_by_id($array);
	//echo "<pre>";print_r($array);exit;
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); */

$app->post('/sales/stock/unit-measure/get-all-unit', function () use ($app) {
	global $objStock, $input;	
	
	$result = $objStock->get_all_units($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/stock/unit-measure/add-unit', function () use ($app) {
	global $objStock, $input;
	
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	//print_r($input_array);exit;
	$result = $objStock->add_unit($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/stock/unit-measure/update-unit', function () use ($app) {
	//echo "here";exit;
	global $objStock, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	//print_r($input_array);exit;
	$result = $objStock->add_unit($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

/* $app->post('/sales/stock/unit-measure/delete-unit', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objStock->delete_unit($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); */

/* $app->post('/sales/stock/unit-measure/add-unit-record-popup', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objStock->add_unit_record_popup($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
 */

$app->post('/sales/stock/unit-measure/get-unit-record-popup', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objStock->get_unit_record_popup($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

/* $app->post('/sales/stock/unit-measure/get-unit-quanitity-record-popup', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objStock->get_unit_quanitity_record_popup($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); */
############	End: Unit of Measures Section ##############

$app->post('/sales/stock/unit-measure/get-unit-setup-list-category', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objStock->get_unit_setup_list_category($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/stock/unit-measure/get-unit-setup-category', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objStock->get_unit_setup_category_invoice($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/stock/unit-measure/get-sale-offer-volume-by-type', function () use ($app) {
	global $objStock, $input; 
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	
	$result = $objStock->get_sale_offer_volume_by_type($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/stock/unit-measure/add-sale-offer-volume', function () use ($app) {
	global $objStock, $input; 
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	
	$result = $objStock->add_sale_offer_volume($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
