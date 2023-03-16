<?php

/* $app->post('/sales/crm/competitor/competitors', function () use ($app) {
	global $objCrm, $input;
	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objCrm->get_competitors($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/crm/competitor/get-competitor', function () use ($app) {
	global $objCrm, $input;
	$array = array(
				"id"=> $input->id
	);
	$result = $objCrm->get_competitor_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/sales/crm/competitor/add-competitor', function () use ($app) {
	global $objCrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCrm->add_competitor($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/crm/competitor/update-competitor', function () use ($app) {
	global $objCrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCrm->update_competitor($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/crm/competitor/delete-competitor', function () use ($app) {
	global $objCrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCrm->delete_competitor($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
 */