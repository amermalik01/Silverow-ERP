<?php

$app->post('/sales/crm/opportunity-cycle/opportunity-cycles', function () use ($app) {
	global $objCrm, $input;
	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objCrm->get_opportunity_cycles($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/crm/opportunity-cycle/get-opportunity-cycle', function () use ($app) {
	global $objCrm, $input;
	$array = array(
				"id"=> $input->id
	);
	$result = $objCrm->get_opportunity_cycle_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/sales/crm/opportunity-cycle/add-opportunity-cycle', function () use ($app) {
	global $objCrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCrm->add_opportunity_cycle($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/crm/opportunity-cycle/update-opportunity-cycle', function () use ($app) {
	global $objCrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCrm->update_opportunity_cycle($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/crm/opportunity-cycle/delete-opportunity-cycle', function () use ($app) {
	global $objCrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCrm->delete_opportunity_cycle($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/crm/opportunity-cycle/complete-opportunity-cycle', function () use ($app) {
	global $objCrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objCrm->complete_opportunity_cycle($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
<<<<<<< HEAD

?>

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
