<?php
############	 Sales Target ############

$app->post('/sales/customer/sale-target/get-sale-list', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->get_sale_target($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/customer/sale-target/get-sale-list-by-id', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}

	$result = $objcustomersale->get_sale_list_by_id($input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/customer/sale-target/generate-target', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->generateTarget($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/customer/sale-target/add-sale-list', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->add_sale_target($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/customer/sale-target/update-sale-list', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->add_sale_target($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/sales/customer/sale-target/delete-sale-list', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->delete_update_status('crm_sale_target', 'status', $input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/sales/customer/sale-target/get-unique-id', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->get_unique_id_add($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});




$app->post('/sales/customer/sale-target/get-prevoius-data', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->get_privous_data($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/customer/sale-target/get-sale-comision', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->get_sale_comision($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/sales/customer/sale-target/get-sale-comision-by-id', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}

	$result = $objcustomersale->get_data_by_id('crm_sale_target_commision_bonus', $input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/customer/sale-target/add-sale-comision', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->add_sale_comision($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/customer/sale-target/delete-sale-comision', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->delete_update_status('crm_sale_target_commision_bonus', 'status', $input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});




$app->post('/sales/customer/sale-target/get-prodcuts-sale-target', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->get_sale_target_type_data($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/sales/customer/sale-target/add-prodcuts-sale-target', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->add_sale_target_type_data($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});




$app->post('/sales/customer/sale-target/get-targettype-sale-target', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->get_sale_target_type_data($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/sales/customer/sale-target/add-targettype-sale-target', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->add_sale_target_type_data($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});



$app->post('/sales/customer/sale-target/get-sale-target-list-by-sale-person-id', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->get_sale_target_by_sale_person_id($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/sales/customer/sale-target/get-sale-person-sale-target-id', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->get_sale_person_by_sale_target_id($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});



$app->post('/sales/customer/sale-target/get-customer-crm-sale-person-id', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->get_customer_crm_by_sale_person_id($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/sales/customer/sale-target/get-customer-crm-sale-target', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->get_customer_crm_by_sale_target($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

############	 Sales Target  Detail############

$app->post('/sales/customer/sale-target/calculate-total-target-amount', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->calcute_total_target_amount($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/sales/customer/sale-target/calculate-level-remaining', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->calcute_level_remaining($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/customer/sale-target/get-sale-detail-list', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->get_sale_detail_list($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/sales/customer/sale-group/get-sale-group-list-by-group-id', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->get_sale_group_list_by_group_id($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/sales/customer/sale-target/get-sale-detail-list-by-id', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->get_sale_detail_list_by_id($input_array);
	//$result = $objcustomersale->get_data_by_id('crm_sale_target_detail',$input_array['id']); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/sales/customer/sale-target/get-unique-id-detail', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->get_unique_id_add_detail($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/sales/customer/sale-target/add-sale-detail', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->add_sale_detail($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/customer/sale-target/update-sale-detail', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->add_sale_detail($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/sales/customer/sale-target/delete-sale-detail', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->delete_update_status('crm_sale_target_detail', 'status', $input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});




$app->post('/sales/customer/sale-target/get-crm-sale-target-type-all', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->get_crm_sale_target_type_all($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/sales/customer/sale-target/get-crm-sale-target-type-detail', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->get_crm_sale_target_type_detail($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/sales/customer/sale-target/add-crm-sale-target-type-detail', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->add_crm_sale_target_type_detail($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/sales/customer/sale-target/add-crm-sale-target-type-detail-second', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->add_crm_sale_target_type_detail($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/sales/customer/sale-target/get-crm-sale-target-type-all-level', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->get_crm_sale_target_type_all_level($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

############	 Sales Forcast ############ 




$app->post('/sales/customer/sale-forcast/get-sale-forcast-list', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->get_sale_forcast_list($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/customer/sale-forcast/get-sale-forcast-by-id', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->get_sale_forcast_by_id($input_array['id']);
	//$result = $objcustomersale->get_data_by_id('crm_sale_forcast',$input_array['id']); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

/* $app->post('/sales/customer/sale-forcast/add-sale-forcast-list', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array(); 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objcustomersale->add_sale_forcast_list($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); */

$app->post('/sales/customer/sale-forcast/update-sale-forcast-list', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->update_sale_forcast_list($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/customer/sale-forcast/delete-sale-forcast-list', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->delete_update_status('crm_sale_forcast', 'status', $input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});





//------------------------Forcast  item --------------

$app->post('/sales/customer/sale-forcast/add-sale-forcast-items', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->add_sale_forcast_list_items($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});



$app->post('/sales/customer/sale-forcast/get-sale-forcast-items-details', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->get_sale_forcast_list_items($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/customer/sale-forcast/delete-sale-forcast-items', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->delete_update_status('crm_sale_forcast_detail', 'status', $input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});






$app->post('/sales/customer/sale-forcast/convert-approval', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->convert_approval($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/sales/customer/sale-forcast/convert-rejected', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->convert_rejected($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/sales/customer/sale-forcast/convert-to-order', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->convert_to_order($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


/* $app->post('/sales/customer/sale-forcast/send-for-approval', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array(); 
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objcustomersale->send_for_approval($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); */


$app->post('/sales/customer/sale-forcast/add-multiple-approval', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->add_multiple_approval($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

############	 Sales Group ###########

$app->post('/sales/customer/sale-group/get-sale-group-list', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->get_sale_group_list($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/sales/customer/sale-group/get-sale-group-list-by-id', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->get_data_by_id('crm_sale_group', $input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/sales/customer/sale-group/add-sale-group-list', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->add_sale_group_list($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/sales/customer/sale-group/update-sale-group-list', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->add_sale_group_list($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/sales/customer/sale-group/delete-sale-group-list', function () use ($app) {
	global $objcustomersale, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objcustomersale->delete_update_status('crm_sale_group', 'status', $input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
