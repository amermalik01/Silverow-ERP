<?php
 // Task Module
//--------------------------------------

$app->post('/communication/task/task_list', function () use ($app) {
	global $objTask, $input;
        
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
         
	$result = $objTask->get_task($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/communication/task/notifiable_task_list', function () use ($app) {
	global $objTask, $input;
        
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
         
	$result = $objTask->get_notifiable_tasks($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/communication/task/get_task', function () use ($app) {
	global $objTask, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	// echo $input_array['id'];
	$result = $objTask->get_data_by_id('employee_task',$input_array['id']);
	
	//$result = $objTask->get_task_by_id($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/communication/task/deleteTask', function () use ($app) {
	global $objTask, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objTask->deleteTask($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/communication/task/mark_task', function () use ($app) {
	global $objTask, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objTask->mark_task($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/communication/task/markChecked', function () use ($app) {
	global $objTask, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objTask->markChecked($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/communication/task/add_task', function () use ($app) {
	global $objTask, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objTask->add_task($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/communication/task/update_task', function () use ($app) {
	global $objTask, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objTask->update_task($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/communication/task/get_task-by-id', function () use ($app) {
	global $objTask, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	 	$result = $objTask->get_data_by_id('employee_task',$input_array['id']);
	
	//$result = $objTask->get_task_by_id($input_array); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/communication/task/delete_task', function () use ($app) {
	global $objTask, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	 
 	$result = $objTask->delete_update_status('employee_task','status',$input_array['id']);
 
	//$result = $objTask->delete_task($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/communication/task/get_task_by_type', function () use ($app) {
	global $objTask, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objTask->get_task_by_type($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/communication/task/status', function () use ($app) {
	global $objTask, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objTask->getAllStatus($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/communication/task/employees', function () use ($app) {
	global $objTask, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objTask->getCompanyEmployees($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


// Task Module
//--------------------------------------
?>