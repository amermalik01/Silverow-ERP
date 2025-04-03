<?php
<<<<<<< HEAD
############	 Sales Target ############

    
$app->post('/sales/customer/sale-bucket/get-sale-bucket-list', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}	 
	
=======
############	 Sales Target ############    
$app->post('/sales/customer/sale-bucket/get-sale-bucket-list', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	$result = $objcustomersale->get_sale_baket_list($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
<<<<<<< HEAD
  
$app->post('/sales/customer/sale-bucket/get-sale-bucket-by-id', function () use ($app) {
	global $objcustomersale, $input;	 
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	//print_r($objcustomersale);exit;
	//print_r($input_array['id']);exit;
	$result = $objcustomersale->get_sale_baket_data_by_id($input_array['id']);	
=======

$app->post('/sales/customer/sale-bucket/get-sale-bucket-by-id', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	//print_r($objcustomersale);exit;
	//print_r($input_array['id']);exit;
	$result = $objcustomersale->get_sale_baket_data_by_id($input_array['id']);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/customer/sale-bucket/get-sale-bucket-preData', function () use ($app) {
<<<<<<< HEAD
	global $objcustomersale, $input;	 
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objcustomersale->get_sale_baket_data_preData($input_array['id']);	
=======
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->get_sale_baket_data_preData($input_array['id']);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


<<<<<<< HEAD
$app->post('/sales/customer/sale-bucket/get-filter-results', function () use ($app) { 
	global $objcustomersale, $input;
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	} 
	
=======
$app->post('/sales/customer/sale-bucket/get-filter-results', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	$result = $objcustomersale->getFilterResults($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

<<<<<<< HEAD
$app->post('/sales/customer/sale-bucket/add-sale-bucket', function () use ($app) { 
	global $objcustomersale, $input;
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	} 
	
=======
$app->post('/sales/customer/sale-bucket/add-sale-bucket', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	$result = $objcustomersale->add_sale_baket($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

<<<<<<< HEAD
$app->post('/sales/customer/sale-bucket/update-sale-bucket', function () use ($app) { 
	global $objcustomersale, $input;
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	
=======
$app->post('/sales/customer/sale-bucket/update-sale-bucket', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	$result = $objcustomersale->add_sale_baket($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/sales/customer/sale-bucket/delete-sale-bucket', function () use ($app) {
	global $objcustomersale, $input;
<<<<<<< HEAD
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
=======
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	}
	$result = $objcustomersale->deleteSalesBucket($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


<<<<<<< HEAD
    
$app->post('/sales/customer/sale-bucket/add-crm-bucket', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}	 
	
=======

$app->post('/sales/customer/sale-bucket/add-crm-bucket', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	$result = $objcustomersale->add_crm_bucket($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/sales/customer/sale-bucket/get-crm-bucket', function () use ($app) {
	global $objcustomersale, $input;
<<<<<<< HEAD
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}	 
	
=======
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	$result = $objcustomersale->get_crm_bucket($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/customer/sale-bucket/check-bucket-validity', function () use ($app) {
	global $objcustomersale, $input;
<<<<<<< HEAD
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}	 
	
=======
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	$result = $objcustomersale->checkBucketValidity($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/sales/customer/sale-bucket/get-sales-person-bucket', function () use ($app) {
	global $objcustomersale, $input;
<<<<<<< HEAD
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}	 
	
=======
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	$result = $objcustomersale->get_sales_person_bucket($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/sales/customer/sale-bucket/get-sales-person-and-bucket', function () use ($app) {
	global $objcustomersale, $input;
<<<<<<< HEAD
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}	 
	
=======
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	$result = $objcustomersale->get_sales_person_and_bucket($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

//----------------------customer filter----------------


<<<<<<< HEAD
$app->post('/sales/customer/sale-bucket/get-customer-crm-filter-list', function () use ($app) { 
	global $objcustomersale, $input;
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
=======
$app->post('/sales/customer/sale-bucket/get-customer-crm-filter-list', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	}
	$result = $objcustomersale->get_customer_crm_filter_list($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

<<<<<<< HEAD
$app->post('/sales/customer/sale-bucket/get-sale-customer', function () use ($app) { 
	global $objcustomersale, $input;
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
=======
$app->post('/sales/customer/sale-bucket/get-sale-customer', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	}
	$result = $objcustomersale->get_sale_bucket_customer($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

<<<<<<< HEAD
$app->post('/sales/customer/sale-bucket/add-sale-customer', function () use ($app) { 
	global $objcustomersale, $input;
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
=======
$app->post('/sales/customer/sale-bucket/add-sale-customer', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	}
	$result = $objcustomersale->add_sale_bucket_customer($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/customer/sale-bucket/add-bucket-to-customer', function () use ($app) {
	global $objcustomersale, $input;
<<<<<<< HEAD
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}	 
	
=======
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	$result = $objcustomersale->assign_bucket_to_customer($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});







//----------------------product filter----------------

<<<<<<< HEAD
$app->post('/sales/customer/sale-bucket/get-product-filter-list', function () use ($app) { 
	global $objcustomersale, $input;
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
=======
$app->post('/sales/customer/sale-bucket/get-product-filter-list', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	}
	$result = $objcustomersale->get_product_filter_list($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

<<<<<<< HEAD
$app->post('/sales/customer/sale-bucket/getBucketFilters', function () use ($app) { 
	global $objcustomersale, $input;
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
=======
$app->post('/sales/customer/sale-bucket/getBucketFilters', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	}
	$result = $objcustomersale->getBucketFilters($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

<<<<<<< HEAD
$app->post('/sales/customer/sale-bucket/add-sale-bucket-product', function () use ($app) { 
	global $objcustomersale, $input;
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
=======
$app->post('/sales/customer/sale-bucket/add-sale-bucket-product', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	}
	$result = $objcustomersale->add_sale_bucket_product($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
<<<<<<< HEAD
 
 
 
 



$app->post('/sales/customer/sale-bucket/get-crm-salesperson', function () use ($app) { 
	global $objcustomersale, $input;
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
=======

$app->post('/sales/customer/sale-bucket/get-crm-salesperson', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	}
	$result = $objcustomersale->get_crm_salesperson($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

<<<<<<< HEAD
$app->post('/sales/customer/sale-bucket/add-crm-salesperson', function () use ($app) { 
	global $objcustomersale, $input;
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
=======
$app->post('/sales/customer/sale-bucket/add-crm-salesperson', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	}
	$result = $objcustomersale->add_crm_salesperson($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


<<<<<<< HEAD
$app->post('/sales/customer/sale-bucket/update-crm-salesperson', function () use ($app) { 
	global $objcustomersale, $input;
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
=======
$app->post('/sales/customer/sale-bucket/update-crm-salesperson', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	}
	$result = $objcustomersale->update_crm_salesperson($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

<<<<<<< HEAD
 
 //----------------------crm_sale_person_baket ----------------
=======

//----------------------crm_sale_person_baket ----------------
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


$app->post('/sales/customer/sale-bucket/get-sale-person-bucket-list', function () use ($app) {
	global $objcustomersale, $input;
<<<<<<< HEAD
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}	 
=======
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	$result = $objcustomersale->get_sale_person_baket_list($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
<<<<<<< HEAD
  
$app->post('/sales/customer/sale-bucket/get-sale-person-bucket-by-id', function () use ($app) {
	global $objcustomersale, $input;	 
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	 
	 $result = $objcustomersale->get_sale_person_baket_data_by_id($input_array['id']->id);		  
=======

$app->post('/sales/customer/sale-bucket/get-sale-person-bucket-by-id', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}

	$result = $objcustomersale->get_sale_person_baket_data_by_id($input_array['id']->id);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
<<<<<<< HEAD
$app->post('/sales/customer/sale-bucket/add-person-sale-bucket', function () use ($app) { 
	global $objcustomersale, $input;
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	} 
	
=======
$app->post('/sales/customer/sale-bucket/add-person-sale-bucket', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	$result = $objcustomersale->add_sale_person_baket($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

<<<<<<< HEAD
$app->post('/sales/customer/sale-bucket/update-person-sale-bucket', function () use ($app) { 
	global $objcustomersale, $input;
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
=======
$app->post('/sales/customer/sale-bucket/update-person-sale-bucket', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	}
	$result = $objcustomersale->add_sale_person_baket($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/sales/customer/sale-bucket/delete-person-sale-bucket', function () use ($app) {
	global $objcustomersale, $input;
<<<<<<< HEAD
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objcustomersale->delete_update_status('crm_sale_target','status',$input_array['id']);
=======
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->delete_update_status('crm_sale_target', 'status', $input_array['id']);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/customer/sale-bucket/get-sale-bucket-customize-list', function () use ($app) {
	global $objcustomersale, $input;
<<<<<<< HEAD
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}	 
	
=======
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	$result = $objcustomersale->get_sale_baket_customize_list($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/sales/customer/sale-bucket/delete-bucket-customer-card', function () use ($app) {
	global $objcustomersale, $input;
<<<<<<< HEAD
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}	 
	
	$result = $objcustomersale->delete_update_status('crm_bucket','status',$input_array['id']);
=======
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}

	$result = $objcustomersale->delete_update_status('crm_bucket', 'status', $input_array['id']);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	//$result = $objcustomersale->delete_bucket_customer_card($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});



 //----------------------crm_sale_person_customer ----------------
<<<<<<< HEAD

 

?>
=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
