<?php
############	Start: hr employee_type ############

$app->post('/hr/hr_employee_type/get-all-department', function () use ($app) {
	global $objHr, $input;	
	 //  print_r($input);exit;
	$result = $objHr->get_all_hr_employee_type($input);
	
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
 

 $app->post('/hr/hr_employee_type/get_employee_type', function () use ($app) {
	
	global $objHr, $input;	
	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objHr->get_hr_employee_type($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json'); 
	echo json_encode($result);
});
 

$app->post('/hr/hr_employee_type/get_employee_type_by_id', function () use ($app) {
	global $objHr, $input;	
	$array = array(
				"id"=> $input->id
	);
	$result = $objHr->get_hr_employee_type_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
 

$app->post('/hr/hr_employee_type/add_employee_type', function () use ($app) {
	global $objHr, $input;
	
	
	$result = $objHr->add_hr_employee_type($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


 

$app->post('/hr/hr_employee_type/delete_employee_type', function () use ($app) {
	global $objHr, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}

	$result = $objHr->delete_hr_employee_type($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

  
	 
 
############	End: hr employee_type ##############
?>