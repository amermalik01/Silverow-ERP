<?php
############	Start: hr religions ############

$app->post('/hr/hr_department/get-all-department', function () use ($app) {
	global $objHr, $input;	
	 //  print_r($input);exit;
	$result = $objHr->get_all_hr_department($input);
	
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
 

 
$app->post('/hr/hr_department/get-department', function () use ($app) {
	
	global $objHr, $input;	
	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objHr->get_hr_department($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json'); 
	echo json_encode($result);
});

$app->post('/hr/hr_department/get-tab', function () use ($app) {
	global $objHr, $input;	
	$array = array(
				"id"=> $input->id
	);
	$result = $objHr->get_hr_department_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
 

$app->post('/hr/hr_department/add_department', function () use ($app) {
	global $objHr, $input;
	
	
	$result = $objHr->add_hr_department($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


 

$app->post('/hr/hr_department/delete-department', function () use ($app) {
	global $objHr, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}

	$result = $objHr->delete_hr_department($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

   $app->post('/hr/hr_department/dep_code', function () use ($app) { 
	global $objHr, $input;	
	  
	$result = $objHr->dep_code($input); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
 
	 });
	 
 
############	End: hr religions ##############
?>