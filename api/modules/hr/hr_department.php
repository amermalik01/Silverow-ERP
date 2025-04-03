<?php
############	Start: hr religions ############

$app->post('/hr/hr_department/get-all-department', function () use ($app) {
<<<<<<< HEAD
	global $objHr, $input;	
	 //  print_r($input);exit;
	$result = $objHr->get_all_hr_department($input);
	
=======
	global $objHr, $input;
	//  print_r($input);exit;
	$result = $objHr->get_all_hr_department($input);

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
<<<<<<< HEAD
 

 
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
=======



$app->post('/hr/hr_department/get-department', function () use ($app) {

	global $objHr, $input;
	$array = array(
		"all" => $input->all,
		"start" => $input->start,
		"limit" => $input->limit,
		"keyword" => $input->keyword
	);
	$result = $objHr->get_hr_department($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	echo json_encode($result);
});

$app->post('/hr/hr_department/get-tab', function () use ($app) {
<<<<<<< HEAD
	global $objHr, $input;	
	$array = array(
				"id"=> $input->id
=======
	global $objHr, $input;
	$array = array(
		"id" => $input->id
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	);
	$result = $objHr->get_hr_department_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
<<<<<<< HEAD
 

$app->post('/hr/hr_department/add_department', function () use ($app) {
	global $objHr, $input;
	
	
=======


$app->post('/hr/hr_department/add_department', function () use ($app) {
	global $objHr, $input;


>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	$result = $objHr->add_hr_department($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


<<<<<<< HEAD
 
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

$app->post('/hr/hr_department/delete-department', function () use ($app) {
	global $objHr, $input;
	$input_array = array();
<<<<<<< HEAD
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
=======

	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	}

	$result = $objHr->delete_hr_department($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

<<<<<<< HEAD
   $app->post('/hr/hr_department/dep_code', function () use ($app) { 
=======
/*    $app->post('/hr/hr_department/dep_code', function () use ($app) { 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	global $objHr, $input;	
	  
	$result = $objHr->dep_code($input); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
 
<<<<<<< HEAD
	 });
	 
 
############	End: hr religions ##############
?>
=======
	 }); */
	 
 
############	End: hr religions ##############
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
