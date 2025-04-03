<?php
$app->post('/permissions/get-all', function () use ($app) {
	global $objPermissions, $input;	
	//print_r($input);exit;
	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objPermissions->get_permissions($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/permissions/get-permission', function () use ($app) {
	global $objPermissions, $input;	
	$array = array(
				"id"=> $input->id
	);
	$result = $objPermissions->get_permission_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/permissions/get-permission-by-user', function () use ($app) {
	global $objPermissions, $input;	
	$array = array(
				"user_id"=> $input->user_id
	);
	$result = $objPermissions->get_permission_by_user($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/permissions/add-permission', function () use ($app) {
	global $objPermissions, $input;
	//print_r($input);exit;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objPermissions->add_permission($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/permissions/update-permission', function () use ($app) {
	global $objPermissions, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objPermissions->update_permission($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/permissions/delete-permission', function () use ($app) {
	global $objPermissions, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objPermissions->delete_permission($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/permissions/status-permission', function () use ($app) {
	global $objPermissions, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objPermissions->status_permission($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


?>