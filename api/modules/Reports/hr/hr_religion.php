<?php
############	Start: hr religion ############

$app->post('/hr/hr_religion/get-all-religion', function () use ($app) {
	global $objHr, $input;	
	 //  print_r($input);exit;
	$result = $objHr->get_all_hr_religion($input);
	
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
 

 
$app->post('/hr/hr_religion/get-religion', function () use ($app) {
	
	global $objHr, $input;	
	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objHr->get_hr_religion($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json'); 
	echo json_encode($result);
});

$app->post('/hr/hr_religion/get_religion_by_id', function () use ($app) {
	global $objHr, $input;	
	$array = array(
				"id"=> $input->id
	);
	$result = $objHr->get_hr_religion_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
 

$app->post('/hr/hr_religion/add_religion', function () use ($app) {
	global $objHr, $input;
	
	
	$result = $objHr->add_hr_religion($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


 

$app->post('/hr/hr_religion/delete-religion', function () use ($app) {
	global $objHr, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}

	$result = $objHr->delete_hr_religion($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

  
	 
 
############	End: hr religion ##############
?>