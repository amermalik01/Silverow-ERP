<?php
############	Start: Unit List ############
$app->post('/stock/item-weight/get-item-weight', function () use ($app) {
	global $objStock, $input;	
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objStock->get_items_wieght($input_array); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/item-weight/save-item-weight', function () use ($app) {
	global $objStock, $input;	
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objStock->saveItemRoles($input_array); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

 

############	End: Unit List ##############
?>