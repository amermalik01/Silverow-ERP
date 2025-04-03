<?php
$app->post('/hr/leave/leaves', function () use ($app) {
	global $objHr, $input;
	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	//echo "<pre>";print_r($array);exit;
	$result = $objHr->get_leaves($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/leave/get-leave', function () use ($app) {
	global $objHr, $input;
	$array = array(
				"id"=> $input->id
	);
	$result = $objHr->get_leave_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/hr/leave/add-leave', function () use ($app) {
	global $objHr, $input;
	$result = $objHr->add_leave($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/leave/update-leave', function () use ($app) {
	global $objHr, $input;
	$result = $objHr->update_leave($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/leave/change-status', function () use ($app) {
	global $objHr, $input;
	$result = $objHr->change_leave_status($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/leave/delete-leave', function () use ($app) {
	global $objHr, $input;
	$result = $objHr->delete_leave($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
<<<<<<< HEAD

?>

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
