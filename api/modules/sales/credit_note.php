<?php

// General Tab
//--------------------------------------
$app->post('/sales/credit-note/listings', function () use ($app) {
	global $objSales, $input;
	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objSales->get_credit_note_listings($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/credit-note/get-credit-note', function () use ($app) {
	global $objSales, $input;
	$array = array(
				"id"=> $input->id
	);
	
	$result = $objSales->get_credit_note_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/sales/credit-note/add-credit-note', function () use ($app) {
	global $objSales, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSales->add_credit_note($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/credit-note/update-credit-note', function () use ($app) {
	global $objSales, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSales->update_credit_note($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/credit-note/change-credit-note-status', function () use ($app) {
	global $objSales, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSales->change_credit_note_status($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/credit-note/delete-credit-note', function () use ($app) {
	global $objSales, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSales->delete_credit_note($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

// Invoicing
//--------------------------------------

$app->post('/sales/credit-note/invoice', function () use ($app) {
	global $objSales, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSales->credit_note_invoice($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

// Shipping
//--------------------------------------

$app->post('/sales/credit-note/shipping', function () use ($app) {
	global $objSales, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSales->credit_note_shipping($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

// Comment
//--------------------------------------

$app->post('/sales/credit-note/comment', function () use ($app) {
	global $objSales, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSales->credit_note_comment($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


?>

