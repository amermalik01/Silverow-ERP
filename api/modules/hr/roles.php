<?php

/*	******** Start: User's Roles ********* */
$app->post('/hr/roles/user/all', function () use ($app) {
	global $objHr, $input;
	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);

	$result = $objHr->get_user_roles($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

/* $app->post('/hr/roles/user/get', function () use ($app) {
	global $objHr, $input;
	$array = array(
				"id"=> $input->id
	);
	$result = $objHr->get_user_role_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); */


$app->post('/hr/roles/user/add', function () use ($app) {
	global $objHr, $input;
	$result = $objHr->add_user_role($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/roles/user/update', function () use ($app) {
	global $objHr, $input;
	$result = $objHr->update_user_role($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/roles/user/delete', function () use ($app) {
	global $objHr, $input;
	$result = $objHr->delete_user_role($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/hr/roles/user/status', function () use ($app) {
	global $objHr, $input;
	$result = $objHr->status_user_role($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
/*	******** End: User's Roles ********* */



$app->post('/hr/roles/roles', function () use ($app) {
	global $objHr, $input;
	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objHr->get_roles($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/roles/get-role', function () use ($app) {
	global $objHr, $input;
	$array = array(
				"id"=> $input->id
	);
	$result = $objHr->get_role_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/hr/roles/add-role', function () use ($app) {
	global $objHr, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objHr->add_role($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/roles/update-role', function () use ($app) {
	global $objHr, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objHr->update_role($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/roles/delete-role', function () use ($app) {
	global $objHr, $input;
	 
	$result = $objHr->delete_role($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});



$app->post('/hr/roles/get-role-to-employee', function () use ($app) {
	global $objHr, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objHr->get_role_to_employee($input_array);
	
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/hr/roles/add-role-to-employee', function () use ($app) {
	global $objHr, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objHr->add_role_to_employee($input_array);
	
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


/*	******** Start: User Rights ********* */
$app->post('/hr/roles/get-user-rights-module-data', function () use ($app) {
	global $objHr, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	
	$result = $objHr->get_user_rights_module_data($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
/* $app->post('/hr/roles/add-user-rights-module-data', function () use ($app) {
	global $objHr, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	
	$result = $objHr->add_user_rights_module_data($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); */

$app->post('/hr/roles/user-rights-list', function () use ($app) {
	global $objHr, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objHr->get_user_rights_list($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/roles/get-user-rights-by-id', function () use ($app) {
	global $objHr, $input;
	$array = array(
				"id"=> $input->id
	);
	$result = $objHr->get_user_rights_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/roles/add-user-rights', function () use ($app) {
	global $objHr, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objHr->add_user_rights($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/roles/update-user-rights', function () use ($app) {
	global $objHr, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objHr->add_user_rights($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/roles/delete-user-rights', function () use ($app) {
	global $objHr, $input;
	 
	$result = $objHr->delete_user_rights($input);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


/*	*********Permission******** */

$app->post('/hr/roles/permision-list', function () use ($app) {
	global $objHr, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objHr->get_permision_list($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
/* $app->post('/hr/roles/get-permision-by-id', function () use ($app) {
	global $objHr, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
   $result = $objStock->get_data_by_id('ref_permisions',$input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); */
$app->post('/hr/roles/add-permision', function () use ($app) {
	global $objHr, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objHr->add_permision($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/hr/roles/update-permision', function () use ($app) {
	global $objHr, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objHr->add_permision($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
/* $app->post('/hr/roles/delete-permision', function () use ($app) {
	global $objHr, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	 $result = $objStock->delete_update_status('ref_permisions','status',$input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); */

//Assign Multiple Roles To employees

$app->post('/hr/roles/add-multiple-role-employee', function () use ($app) {
	global $objHr, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objHr->add_multiple_role_employee($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
