<?php
// Profile
//------------------------------------------

$app->post('/hr/employee/get-employee-global-data', function () use ($app) {
    global $objHr, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}

	$result = $objHr->getEmployeeGlobalData($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/hr/employee/listings', function () use ($app) {
	
	global $objHr, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}

	$result = $objHr->get_employees($input_array);
	//$result = $objHr->get_hr_listing($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});



$app->post('/hr/employee/get_log', function () use ($app) {
	global $objHr, $input;
	$array = array(
				"id"=> $input->id
	);
	$result = $objHr->get_employee_log_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/employee/get-employee', function () use ($app) {
	global $objHr, $input;
	$array = array(
				"id"=> $input->id
	);
	$result = $objHr->get_employee_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/hr/employee/add-employee', function () use ($app) {
	global $objHr, $input;
	$result = $objHr->add_employee($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/employee/update-employee', function () use ($app) {
	global $objHr, $input;
	$result = $objHr->update_employee($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/employee/change-status', function () use ($app) {
	global $objHr, $input;
	$result = $objHr->change_employee_status($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/employee/change-password', function () use ($app) {
	global $objHr, $input;
	$result = $objHr->change_password($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/employee/change-role', function () use ($app) {
	global $objHr, $input;
	$result = $objHr->change_employee_role($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/employee/delete-employee', function () use ($app) {
	global $objHr, $input;
	$result = $objHr->delete_employee($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

?>

