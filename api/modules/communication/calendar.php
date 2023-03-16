<?php

$app->post('/communication/calendar/events', function () use ($app) {
	global $objCalendar, $input;
	$input_array = array();
	foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCalendar->get_events($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/communication/calendar/monthcalendar', function () use ($app) {
	global $objCalendar, $input;
	$input_array = array();
	foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCalendar->getMonthCalendar($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/communication/calendar/weekcalendar', function () use ($app) {

	global $objCalendar, $input;
	$input_array = array();
	foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCalendar->getWeekCalendar($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/communication/calendar/daycalendar', function () use ($app) {

	global $objCalendar, $input;
	$input_array = array();
	foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCalendar->getDayCalendar($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/communication/calendar/event', function () use ($app) {

	global $objCalendar, $input;
	$input_array = array();
	foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCalendar->getEventById($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/communication/calendar/yearcalendar', function () use ($app) {

	global $objCalendar, $input;
	$input_array = array();
	foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCalendar->getYearCalendar($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/communication/calendar/addevent', function () use ($app) {

	global $objCalendar, $input;
	$input_array = array();
	foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCalendar->addEvent($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/communication/calendar/editevent', function () use ($app) {

	global $objCalendar, $input;
	$input_array = array();
	foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCalendar->editEvent($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/communication/calendar/deleteevent', function () use ($app) {

	global $objCalendar, $input;
	$input_array = array();
	foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCalendar->deleteEvent($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); 

$app->post('/communication/calendar/uploadfile', function () use ($app) {

    global $objCalendar, $input, $user_info;
        
	check_dir_path(UPLOAD_PATH.'calendar_event_attachment');
	$uploads_dir = UPLOAD_PATH.'calendar_event_attachment';
	
	$tmp_name = $_FILES["file"]["tmp_name"];
	$name = $_FILES["file"]["name"];
	$explode_file = explode(".", $name);
	$new_file_name = mt_rand().".".$explode_file[1];
	$var_export = move_uploaded_file($tmp_name, $uploads_dir."/".$new_file_name);
	
	if($var_export){
                $result['fileName'] = $name;
		$result['newFileName'] = $new_file_name;
	}else{
		$result['response'] = "Error in files uploading!";
	}
	
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/communication/calendar/users', function () use ($app) {

	global $objCalendar;
	
	$result = $objCalendar->getUsers();
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); 

$app->post('/communication/calendar/attende', function () use ($app) {

	global $objCalendar, $input;
	$input_array = array();
	foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCalendar->deleteEvent($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/communication/calendar/sharecalendar', function () use ($app) {

	global $objCalendar, $input;
	$input_array = array();
	foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCalendar->shareCalendar($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/communication/calendar/sharedcalendars', function () use ($app) {

	global $objCalendar, $input;
	$input_array = array();
	foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCalendar->getSharedCalendars($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

?>

