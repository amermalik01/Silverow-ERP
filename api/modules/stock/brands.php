<?php
$app->post('/stock/brands', function () use ($app) {
	global $objStock, $input;	
	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objStock->get_brands($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/brands/get-brand', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	//$result = $objStock->get_data_by_id('brand',$input_array['id']);
	$result = $objStock->getBrandByID($input_array);  
	
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/brands/get-all-brands', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objStock->get_all_brands($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/brands/add-brand', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objStock->add_brand($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/stock/brands/update-brand', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objStock->update_brand($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/brands/delete-brand', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	// $result = $objStock->delete_update_status('brand','status',$input_array['id']);
	$result = $objStock->delete_brand($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});



$app->post('/stock/brands/upload-image', function () use ($app) {
	global $objStock, $input, $user_info;
	
	// check company path
	check_dir_path(UPLOAD_PATH.$user_info['company_id']);
	// check company images path
	check_dir_path(UPLOAD_PATH.$user_info['company_id'].'/images');
	// check company brand images path
	check_dir_path(UPLOAD_PATH.$user_info['company_id'].'/images/brand');
	
	$uploads_dir = UPLOAD_PATH.$user_info['company_id'].'/images/brand';
	
	echo "Full Path = ".$uploads_dir."/".$new_file_name;exit;
	//echo phpinfo();exit;
	
	$tmp_name = $_FILES["file"]["tmp_name"];
	$name = $_FILES["file"]["name"];
	$explode_file = explode(".", $name);
	$new_file_name = mt_rand().".".$explode_file[1];
	// upload file
	$var_export = move_uploaded_file($tmp_name, $uploads_dir."/".$new_file_name);
	
	if($var_export){
		$result['response'] = $new_file_name;
	}else{
		$result['response'] = "Error in files uploading!";
	}
	
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

?>