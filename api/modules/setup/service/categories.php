<?php
############	Start: Category Section ############
$app->post('/setup/service/categories/categories', function () use ($app) {
	global $objServices, $input;	
	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objServices->get_categories($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/service/categories/get-category', function () use ($app) {
	global $objServices, $input;	
	$array = array(
				"id"=> $input->id
	);
	
	 $result = $objServices->get_data_by_id('service_catagory',$array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/service/categories/get-all-categories', function () use ($app) {
	global $objServices, $input;	
		$array = array(
				"id"=> $input->id
	);
	$result = $objServices->get_all_categories($array,0);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/service/categories/add-category', function () use ($app) {
	global $objServices, $input;
	
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	
	$result = $objServices->add_category($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/service/categories/update-category', function () use ($app) {
	global $objServices, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objServices->add_category($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/service/categories/delete-category', function () use ($app) {
	global $objServices, $input;
	
	$input_array = array( 
				"id"=> $input->id
	);
	 $result = $objServices->delete_update_status('service_catagory','status',$input_array['id']);
	
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

?>