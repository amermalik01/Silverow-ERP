<?php
############	Start: hr of Tabs ############
$app->post('/hr/hr-tabs', function () use ($app) {
	
	global $objHr, $input;	
	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	 // print_r($array); 
	$result = $objHr->get_tabs_hr($array);
//	 print_r($result);exit;
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json'); 
	echo json_encode($result);
});

$app->post('/hr/hr-tabs/get-tab', function () use ($app) {
	global $objHr, $input;	
	$array = array(
				"id"=> $input->id
	);
	$result = $objHr->get_tab_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/hr-tabs/get-all-tabs', function () use ($app) {
	global $objHr, $input;	
	 
	$result = $objHr->get_all_tabs($input);
	  //print_r($result);exit;
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/hr-tabs/add-tab', function () use ($app) {
	global $objHr, $input;
	
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	//print_r($input_array);exit;
	$result = $objHr->add_tab($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/hr/hr-tabs/update-tab', function () use ($app) {
 
	global $objHr, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	 
	$result = $objHr->update_tab($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/hr-tabs/delete-tab', function () use ($app) {
	global $objHr, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}

	//print_r($input_array);exit;
	$result = $objHr->delete_tab($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/hr-tabs/sort-tab', function () use ($app) {
	global $objHr, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}

	 
	$result = $objHr->sort_tab($input_array);
	//  print_r($result);exit;
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/hr/hr-tabs/status-tab', function () use ($app) {
	global $objHr, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	//print_r($input_array);exit;
	$result = $objHr->status_tab($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

############	End: hr of Tabs ##############
<<<<<<< HEAD
?>
=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
