<?php 

// Coverage Area Module
//--------------------------------------------------------------------

$app->post('/setup/supplier/coverage-areas', function () use ($app) {
	global $objSetup, $input;

	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objSetup->get_coverage_areas($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/supplier/get-coverage-area', function () use ($app) {
	global $objSetup, $input;

	$array = array(
				"id"=> $input->id
	);
	$result = $objSetup->get_coverage_area_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/supplier/add-coverage-area', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetup->add_coverage_area($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/supplier/update-coverage-area', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->update_coverage_area($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/supplier/delete-coverage-area', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->delete_coverage_area($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

// Shipping Measurment Module
//--------------------------------------------------------------------

$app->post('/setup/supplier/shipping-measurments', function () use ($app) {
	global $objSetup, $input;

	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objSetup->get_shipping_measurments($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/supplier/get-shipping-measurment', function () use ($app) {
	global $objSetup, $input;

	$array = array(
				"id"=> $input->id
	);
	$result = $objSetup->get_shipping_measurment_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/supplier/add-shipping-measurment', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetup->add_shipping_measurment($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/supplier/update-shipping-measurment', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->update_shipping_measurment($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/supplier/delete-shipping-measurment', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->delete_shipping_measurment($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});






// Purchase Offer Volume Module
//--------------------------------------

$app->post('/setup/supplier/purchase_offer_volumes', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->get_purchase_offer_volume($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/supplier/get_purchase_offer_volume', function () use ($app) {
	global $objSetup, $input;
	$array = array(
				"id"=> $input->id
	);
	
	$result = $objSetup->get_purchase_offer_volume_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/supplier/add_purchase_offer_volume', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	// print_r($input_array); exit;
	$result = $objSetup->add_purchase_offer_volume($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/supplier/update_purchase_offer_volume', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->update_purchase_offer_volume($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/supplier/get_purchase_offer_volume-by-id', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->get_purchase_offer_volume_by_id($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/supplier/delete_purchase_offer_volume', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->delete_purchase_offer_volume($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/supplier/get_purchase_offer_volume_by_type', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->get_purchase_offer_volume_by_type($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


// Purchase Offer Volume Module
//--------------------------------------


//-------------------- Classifications ------------------------------//


$app->post('/setup/supplier/ref-classifications', function () use ($app) {
	global $objSetupsupplier, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetupsupplier->get_ref_classifications($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/supplier/supplier-classifications', function () use ($app) {
	global $objSetupsupplier, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetupsupplier->get_supplier_classifications($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/supplier/add-supplier-classification', function () use ($app) {
	global $objSetupsupplier, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetupsupplier->add_supplier_classification($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/setup/supplier/get-supplier-classification-by-id', function () use ($app) {
	global $objSetupsupplier, $input;
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetupsupplier->get_data_by_id('supplier_classification', $input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/supplier/delete-supplier-classification', function () use ($app) {
	global $objSetupsupplier, $input;
	$input_array = array();

	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetupsupplier->delete_update_status('supplier_classification', 'status', $input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});



?>