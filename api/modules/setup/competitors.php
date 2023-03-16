<?php
// this file will deal in all the APIs from Setup > Inventory > Competitor Brands, Competitor Items, Competitor Names

/* 
$app->post('/setup/competitors/getCompetitorPropertyListing', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->getCompetitorPropertyListing($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); */

$app->post('/setup/competitors/getCompetitorPropertyListingAllowed', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();

	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->getCompetitorPropertyListing($input_array, 1);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/competitors/getCompetitorPropertyById', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();

	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->getCompetitorPropertyById($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/competitors/addCompetitorProperty', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();

	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->addCompetitorProperty($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/competitors/updateCompetitorProperty', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();

	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->updateCompetitorProperty($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/competitors/deleteCompetitorProperty', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();

	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->deleteCompetitorProperty($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
