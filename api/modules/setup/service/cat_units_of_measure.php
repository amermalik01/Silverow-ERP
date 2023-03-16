<?php
############	Start: Category Unit of Measures Section ############
$app->post('/setup/service/cat-unit/cat-unit', function () use ($app) {
	global $objServices, $input;	
	
	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	
	$result = $objServices->get_cat_unit($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/service/cat-unit/get-all-cat', function () use ($app) {
	global $objServices, $input;	
	
	$result = $objServices->get_all_categories($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/service/cat-unit/get-cat-unit-by-cat-nd-unit_id', function () use ($app) {
	global $objServices, $input;	
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objServices->get_cat_unit_by_cat_nd_unit_id($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/service/cat-unit/get-cat-unit', function () use ($app) {
	global $objServices, $input;	
	
//	$result = $objServices->get_cat_unit_by_id($input_array);
	$array = array(
				"id"=> $input->id
	);
	
	 $result = $objServices->get_data_by_id('service_category_units_of_measure',$array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/service/cat-unit/get-all-unit', function () use ($app) {
	global $objServices, $input;	
	
	$result = $objServices->get_all_units($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/service/cat-unit/add-cat-unit', function () use ($app) {
	global $objServices, $input;
	
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objServices->add_cat_unit($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/service/cat-unit/update-cat-unit', function () use ($app) {
	
	global $objServices, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objServices->add_cat_unit($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/service/cat-unit/delete-cat-unit', function () use ($app) {
	global $objServices, $input;
		$array = array(
				"id"=> $input->id
	);
	 $result = $objServices->delete_update_status('service_category_units_of_measure','status',$array['id']); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
############	End: Category Unit of Measures Section ##############
?>