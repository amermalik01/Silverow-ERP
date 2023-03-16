<?php
############	Start: Unit of Measures Section ############
$app->post('/setup/service/unit-measure/units', function () use ($app) {
	global $objServices, $input;	
	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objServices->get_units($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/service/unit-measure/get-unit', function () use ($app) {
	global $objServices, $input;	
	
	$array = array(
				"id"=> $input->id
	);
	
	 $result = $objServices->get_data_by_id('service_units_of_measure',$array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/service/unit-measure/get-all-unit', function () use ($app) {
	global $objServices, $input;	
	
	$result = $objServices->get_all_units($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/service/unit-measure/add-unit', function () use ($app) {
	global $objServices, $input;
	
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objServices->add_unit($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/service/unit-measure/update-unit', function () use ($app) {
	global $objServices, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objServices->add_unit($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/service/unit-measure/delete-unit', function () use ($app) {
	global $objServices, $input;
	$array = array(
				"id"=> $input->id
	);
	
	
	 $result = $objServices->delete_update_status('service_units_of_measure','status',$array['id']); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

?>