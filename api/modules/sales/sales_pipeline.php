<?php

<<<<<<< HEAD
$app->post('/sales/sales-pipeline', function () use ($app) {
=======
/* $app->post('/sales/sales-pipeline', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	global $objCrm, $input;
	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objCrm->get_sales_pipeline($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/get-sales-pipeline', function () use ($app) {
	global $objCrm, $input;
	$array = array(
				"id"=> $input->id
	);
	$result = $objCrm->get_sales_pipeline_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/sales/add-sales-pipeline', function () use ($app) {
	global $objCrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCrm->add_sales_pipeline($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/update-sales-pipeline', function () use ($app) {
	global $objCrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCrm->update_sales_pipeline($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/delete-sales-pipeline', function () use ($app) {
	global $objCrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCrm->delete_sales_pipeline($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564



?>

