<?php 
// Cause of Inactivity Module
//--------------------------------------------------------------------

$app->post('/setup/hr/cause-of-inactivity', function () use ($app) {
	global $objSetup, $input;

	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objSetup->get_cause_of_inactivity($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/hr/get-cause-of-inactivity', function () use ($app) {
	global $objSetup, $input;

	$array = array(
				"id"=> $input->id
	);
	$result = $objSetup->get_cause_of_inactivity_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/hr/get-bucket-filter-data', function () use ($app) {
	global $objSetup, $input;
	$result = $objSetup->getBucketFilterData();
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/hr/add-cause-of-inactivity', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetup->add_cause_of_inactivity($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/hr/update-cause-of-inactivity', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->update_cause_of_inactivity($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/hr/delete-cause-of-inactivity', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->delete_cause_of_inactivity($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


// Departments Module
//--------------------------------------------------------------------

$app->post('/setup/hr/department', function () use ($app) {
	global $objSetup, $input;

	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objSetup->get_department($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/hr/get-department', function () use ($app) {
	global $objSetup, $input;

	$array = array(
				"id"=> $input->id
	);
	$result = $objSetup->get_department_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/hr/add-department', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetup->add_department($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/hr/update-department', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetup->update_department($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/hr/delete-department', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->delete_department($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

//////////////////// Job Title ////////////////////
// Departments Module
//--------------------------------------------------------------------

$app->post('/setup/hr/job-title', function () use ($app) {
	 global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->get_job_title($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/hr/get-job-title', function () use ($app) {
	global $objSetup, $input;

	$array = array(
				"id"=> $input->id
	);
	$result = $objSetup->get_job_title_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/hr/add-job-title', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetup->add_job_title($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/hr/update-job-title', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetup->update_job_title($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/hr/delete-job-title', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->delete_job_title($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});




//
$app->post('/setup/hr/depart-category-list', function () use ($app) {
	global $objSetup, $input;

	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objSetup->get_depart_category($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/hr/get-depart-category-list', function () use ($app) {
	global $objSetup, $input;

	$array = array(
				"id"=> $input->id
	);
	$result = $objSetup->get_depart_category_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/hr/add-depart-category-list', function () use ($app) {
	global $objSetup, $input;
	$input_array = array(); 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetup->add_depart_category($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/hr/update-depart-category-list', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetup->update_depart_category($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/hr/delete-depart-category-list', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->delete_depart_category($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
?>