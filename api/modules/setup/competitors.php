<?php
<<<<<<< HEAD

// this file will deal in all the APIs from Setup > Inventory > Competitor Brands, Competitor Items, Competitor Names


=======
// this file will deal in all the APIs from Setup > Inventory > Competitor Brands, Competitor Items, Competitor Names

/* 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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
<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

$app->post('/setup/competitors/getCompetitorPropertyListingAllowed', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();
<<<<<<< HEAD
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->getCompetitorPropertyListing($input_array,1);
=======

	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->getCompetitorPropertyListing($input_array, 1);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/competitors/getCompetitorPropertyById', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();
<<<<<<< HEAD
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
=======

	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	$result = $objSetup->getCompetitorPropertyById($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/competitors/addCompetitorProperty', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();
<<<<<<< HEAD
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
=======

	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	$result = $objSetup->addCompetitorProperty($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/competitors/updateCompetitorProperty', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();
<<<<<<< HEAD
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
=======

	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	$result = $objSetup->updateCompetitorProperty($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/competitors/deleteCompetitorProperty', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();
<<<<<<< HEAD
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
=======

	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	$result = $objSetup->deleteCompetitorProperty($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
<<<<<<< HEAD

?>
=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
