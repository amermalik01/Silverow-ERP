<?php
############	Start: Product of Tabs Columns ############
$app->post('/stock/product-tab-values', function () use ($app) {
	global $objStock, $input;	
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	
	$result = $objStock->get_tab_values($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


	 
	 
	 
$app->post('/stock/product-tab-values/get-tab-col', function () use ($app) {
	global $objStock, $input;	
	$array = array(
				"tab_id"=> $input->tab_id,
				"product_id"=> $input->product_id
	);
	//print_r($array);exit;
	$result = $objStock->get_tab_value_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/product-tab-values/customer_sale_list', function () use ($app) {
	global $objStock, $input;	
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	 
	$result = $objStock->get_customer_sale_list($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/stock/product-tab-values/get_customer_sale_list_filter', function () use ($app) {
	global $objStock, $input;	
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	
	$result = $objStock->get_customer_sale_list_filter($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});



$app->post('/stock/product-tab-values/add-tab-value', function () use ($app) {
	global $objStock, $input;
	//echo "here in controller<pre>";print_r($input);exit;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	
	$result = $objStock->add_tab_value($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/stock/product-tab-values/update-tab-value', function () use ($app) {
	//echo "here";exit;
	global $objStock, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	//print_r($input_array);exit;
	$result = $objStock->update_tab_value($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/product-tab-values/delete-tab-value', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objStock->delete_tab_value($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/stock/product-tab-values/get_pr_value_by_undefined', function () use ($app) {
	global $objStock, $input;	
	 
	$array = array(
				"tab_id"=> $input->tab_id,
				"product_id"=> $input->product_id
	);
	$result = $objStock->get_pr_value_by_undefined($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});



$app->post('/stock/product-tab-values/get_pr_value_by_defined', function () use ($app) {
	global $objStock, $input;	
	 
	$array = array(
				"tab_id"=> $input->tab_id,
				"product_id"=> $input->product_id
	);
	$result = $objStock->get_pr_value_by_defined($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});



$app->post('/stock/product-tab-values/status-tab-value', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objStock->status_tab_value($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/product-tab-values/get-cat-val', function () use ($app) {
	global $objStock, $input;	
	//echo "In get cat value";print_r($input);exit;
	$array = array(
				"product_id"=> $input->product_id
	);
	$result = $objStock->get_cat_value($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/stock/product-tab-values/get-brand-val', function () use ($app) {
	global $objStock, $input;	
	//echo "In get cat value";print_r($input);exit;
	$array = array(
				"product_id"=> $input->product_id
	);
	$result = $objStock->get_brand_value($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/product-tab-values/get-unit-measure-val', function () use ($app) {
	global $objStock, $input;	
	//echo "In get cat value";print_r($input);exit;
	$array = array(
				"product_id"=> $input->product_id
	);
	$result = $objStock->get_unit_measure_value($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});




$app->post('/stock/product-tab-values/update_product_values', function () use ($app) {
	global $objStock, $input;
	
	  
		 
		$result = $objStock->update_product_value($input);
	
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});




 

	 
	 

	  
	 
	 
	 
	 



$app->post('/stock/product-tab-values/getupload_emp_image', function () use ($app) {
	global $objStock, $input, $user_info;
	
	
	/*	$array = array( 
					"product_id"=> $input->product_id,
					"product_id2"=> $input->id
		);
	
	
	  print_r($input);	 print_r($array);	  echo "here in uploading";exit;
	*/
	// check company path
	//check_dir_path(UPLOAD_PATH.'emp_images');
	check_dir_path(UPLOAD_PATH.'company_logo_temp');
	// check company images path		
	$uploads_dir = UPLOAD_PATH.'company_logo_temp';
	$tmp_name = $_FILES["file"]["tmp_name"];
	$name = $_FILES["file"]["name"];
	$explode_file = explode(".", $name);
	  $new_file_name = mt_rand().".".$explode_file[1];
	
	
	//echo "Full Path = ".$uploads_dir."/".$new_file_name;exit;
	$uploadOk = 1;


// Check if image file is a actual image or fake image
 if(isset($_FILES)) {
	 	$check = getimagesize($_FILES["file"]["tmp_name"]);
    if($check !== false) {
        $message[]= "File is an image - " . $check["mime"] . ".";
        $uploadOk = 1;
    } else {
       $message[]= "File is not an image.";
        $uploadOk = 0;
    }
 }
	 

// Check file size
if ($_FILES["file"]["size"] < 1024) {
    //  "Sorry, your file is too large.";
    $uploadOk = 0;
}
$imageFileType = pathinfo($new_file_name,PATHINFO_EXTENSION);
// Allow certain file formats
if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"&& $imageFileType != "gif" ) {
     $message[]= "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
    $uploadOk = 0;
}
 
if ($uploadOk > 0) {
	// upload file
	 $var_export = move_uploaded_file($tmp_name, $uploads_dir."/".$new_file_name);
}

//  $result = $objStock->update_emp_pic($new_file_name ,$product_id); 
	if($var_export){
		 $response['ack'] = 1;
		$response['response'] = $new_file_name;
	}else{
			$response['ack'] = 0;
		$response['response'] = "Error in files uploading Please check Size and Format JPG, JPEG, PNG & GIF!".$message;
	}
	 
		
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($response);
});

	

	 
	 
############	End: Product of Tabs ##############







// CRM Document Module
//--------------------------------------

$app->post('/stock/product-tab-values/srm-documents', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objStock->get_documents($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/product-tab-values/get-srm-document-by-id', function () use ($app) {
	global $objStock, $input;
	$array = array(
				"id"=> $input->id
	);
	  $result = $objStock->get_data_by_id('document',$array['id']);
	
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/stock/product-tab-values/add-srm-document', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objStock->add_srm_document($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/product-tab-values/update-srm-document', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objStock->update_srm_document($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/product-tab-values/delete-srm-document', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

 	 $result = $objStock->delete_update_status('document','status',$input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/product-tab-values/folders', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objStock->get_folders($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/product-tab-values/add-folder', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objStock->add_folder($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


?>