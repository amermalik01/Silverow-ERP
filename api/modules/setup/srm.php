<?php
// Shipment Method Module
//--------------------------------------------------------------------
$app->post('/setup/srm/shipment-methods', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();

	foreach($input as $key => $val){
		$input_array[$key] = $val;
	}
	$input_array['shipment_type']=2;
	$result = $objSetup->get_shipment_methods($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/setup/srm/getVatRange', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();

	foreach($input as $key => $val){
		$input_array[$key] = $val;
	}
	$input_array['shipment_type']=2;
	$result = $objSetup->getVatRange($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/setup/srm/add-shipment-method', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();

	foreach($input as $key => $val){
		$input_array[$key] = $val;
	}

	$result = $objSetup->add_shipment_method($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/update-shipment-method', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();

	foreach($input as $key => $val){
		$input_array[$key] = $val;
	}
	$result = $objSetup->update_shipment_method($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/delete-shipment-method', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();

	foreach($input as $key => $val){
		$input_array[$key] = $val;
	}
	$result = $objSetup->delete_shipment_method($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/setup/srm/get-shipment-method', function () use ($app) {
	global $objSetup, $input;

	$array = array(
		"id"=> $input->id
	);

	$result = $objSetup->get_shipment_method_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
// Payment Methods Module 
//--------------------------------------------------------------------

$app->post('/setup/srm/srm-payment-methods', function () use ($app) {
	global $objSetupsrm, $input;

	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objSetupsrm->get_payment_methods_srm($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-get-payment-method-by-id', function () use ($app) {
	global $objSetupsrm, $input;

	$input_array = array(
				"id"=> $input->id
	);
 
	 $result = $objSetupsrm->get_data_by_id('srm_payment_methods',$input_array['id']);
	//$result = $objSetupsrm->get_payment_method_by_id_srm($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/srm/srm-add-payment-method', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetupsrm->add_payment_method_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/srm/srm-delete-payment-method', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	 $result = $objSetupsrm->delete_update_status('srm_payment_methods','status',$input_array['id']);
	//$result = $objSetupsrm->delete_payment_method_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-get-payment-methods-list', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetupsrm->get_payment_methods_list_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});



 

// Payment Terms Module 
//--------------------------------------------------------------------

$app->post('/setup/srm/srm-payment-terms', function () use ($app) {
	global $objSetupsrm, $input;

	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objSetupsrm->get_payment_terms_srm($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-get-payment-term-by-id', function () use ($app) {
	global $objSetupsrm, $input;

	$input_array = array(
				"id"=> $input->id
	);
	 $result = $objSetupsrm->get_data_by_id('srm_payment_terms',$input_array['id']);
	
	//$result = $objSetupsrm->get_payment_term_by_id_srm($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-get-srm-payment-terms-list', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetupsrm->get_payment_terms_list_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-add-payment-term', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetupsrm->add_payment_term_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
 

$app->post('/setup/srm/srm-delete-payment-term', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	 //print_r($input_array);exit;
	  $result = $objSetupsrm->delete_payment_term($input_array);
	
	//$result = $objSetupsrm->delete_payment_term_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


// Shipment Methods Module
//--------------------------------------------------------------------

$app->post('/setup/srm/srm-shipment-methods', function () use ($app) {
	global $objSetupsrm, $input;

	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->get_shipment_methods_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-get-shipment-method', function () use ($app) {
	global $objSetupsrm, $input;

	$array = array(
				"id"=> $input->id
	);

	$result = $objSetupsrm->get_shipment_method_by_id_srm($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/srm/srm-add-shipment-method', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetupsrm->add_shipment_method_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-delete-shipment-method', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->delete_shipment_method_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});





// Purchase Order Stages Module
//--------------------------------------------------------------------


/* $app->post('/setup/srm/srm-get-order-stages-by-id', function () use ($app) {
	global $objSetupsrm, $input;

	$input_array = array(
		"id"=> $input->id
	);
	$result = $objSetupsrm->get_data_by_id('ref_crm_order_stages',$input_array['id']);

	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/get-order-stages-list', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();

	foreach($input as $key => $val){
		$input_array[$key] = $val;
	}

	$result = $objSetupsrm->get_order_stages_list($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/add-order-stages-list', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();

	foreach($input as $key => $val){
		$input_array[$key] = $val;
	}

	$result = $objSetupsrm->add_order_stages_crm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/srm/update-order-stages-list', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();

	foreach($input as $key => $val){
		$input_array[$key] = $val;
	}

	$result = $objSetupsrm->add_order_stages_crm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-delete-order-stages', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();

	foreach($input as $key => $val){
		$input_array[$key] = $val;
	}
	$result = $objSetupsrm->delete_update_status('ref_crm_order_stages','status',$input_array['id']);

	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/sort-srm-order-stages', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();

	foreach($input as $key => $val){
		$input_array[$key] = $val;
	}
	$result = $objSetupsrm->sort_crm_order_stages($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); */










// Finance Charges Module
//--------------------------------------------------------------------

$app->post('/setup/srm/srm-finance-charges', function () use ($app) {
	global $objSetupsrm, $input;

	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->get_finance_charges_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-get-finance-charges', function () use ($app) {
	global $objSetupsrm, $input;

	$array = array(
				"id"=> $input->id
	);
	$result = $objSetupsrm->get_finance_charges_by_id_srm($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/srm/srm-add-finance-charges', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetupsrm->add_finance_charges_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-update-finance-charges', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->update_finance_charges_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-delete-finance-charges', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->delete_finance_charges_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-get-finance-charge-code', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->get_charges_code_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-get-insurance-charge-code', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->get_charges_code_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

// Insurance Charges Module
//--------------------------------------------------------------------

$app->post('/setup/srm/srm-insurance-charges', function () use ($app) {
	global $objSetupsrm, $input;

	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->get_insurance_charges_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-get-insurance-charges', function () use ($app) {
	global $objSetupsrm, $input;

	$array = array(
				"id"=> $input->id
	);
	$result = $objSetupsrm->get_insurance_charges_by_id_srm($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/srm/srm-add-insurance-charges', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetupsrm->add_insurance_charges_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-update-insurance-charges', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->update_insurance_charges_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-delete-insurance-charges', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->delete_insurance_charges_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


// Insurance Charges Module
//--------------------------------------------------------------------

$app->post('/setup/srm/srm-overrider', function () use ($app) {
	global $objSetupsrm, $input;

	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->get_overrider_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-get-overrider', function () use ($app) {
	global $objSetupsrm, $input;

	$array = array(
				"id"=> $input->id
	);
	$result = $objSetupsrm->get_overrider_by_id_srm($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/srm/srm-add-overrider', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetupsrm->add_overrider_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-update-overrider', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->update_overrider_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-delete-overrider', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->delete_overrider_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


// Sales Pipeline Target Charges Module
//--------------------------------------------------------------------

$app->post('/setup/srm/srm-sales-pipeline-targets', function () use ($app) {
	global $objSetupsrm, $input;
	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objSetupsrm->get_sales_pipeline_targets_srm($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-get-sales-pipeline-target', function () use ($app) {
	global $objSetupsrm, $input;

	$array = array(
				"id"=> $input->id
	);
	$result = $objSetupsrm->get_sales_pipeline_target_by_id_srm($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/srm/srm-add-sales-pipeline-target', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetupsrm->add_sales_pipeline_target_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-update-sales-pipeline-target', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->update_sales_pipeline_target_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-delete-sales-pipeline-target', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->delete_sales_pipeline_target_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

// Shipping Agents Module
//--------------------------------------------------------------------

$app->post('/setup/srm/srm-shipping-agents', function () use ($app) {
	global $objSetupsrm, $input;

	$$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->get_shipping_agents_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


// CRM Tabs Module
//--------------------------------------------------------------------

$app->post('/setup/srm/srm-crm-tabs', function () use ($app) {
	global $objSetupsrm, $input;

	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objSetupsrm->get_crm_tabs_srm($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-get-crm-tab', function () use ($app) {
	global $objSetupsrm, $input;

	$array = array(
				"id"=> $input->id
	);
	$result = $objSetupsrm->get_crm_tab_by_id_srm($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/srm/srm-add-crm-tab', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetupsrm->add_crm_tab_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-update-crm-tab', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->update_crm_tab_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-delete-crm-tab', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->delete_crm_tab_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-sort-tab', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->sort_tab_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


// CRM Opportunity Cycle Tabs Module
//--------------------------------------------------------------------

$app->post('/setup/srm/srm-opportunity-cycle-tabs', function () use ($app) {
	global $objSetupsrm, $input;

	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->get_opportunity_cycle_tabs_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-get-opportunity-cycle-tab', function () use ($app) {
	global $objSetupsrm, $input;

	$array = array(
				"id"=> $input->id
	);
	$result = $objSetupsrm->get_opportunity_cycle_tab_by_id_srm($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/srm/srm-add-opportunity-cycle-tab', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetupsrm->add_opportunity_cycle_tab_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-add-opportunity-cycle-tab-popup', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetupsrm->add_opportunity_cycle_tab_popup_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-update-opportunity-cycle-tab', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->update_opportunity_cycle_tab_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-delete-opportunity-cycle-tab', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->delete_opportunity_cycle_tab_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-sort-opportunity-cycle-tabs', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->sort_opportunity_cycle_tabs_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


// CRM Tabs Module
//--------------------------------------------------------------------

$app->post('/setup/srm/srm-crm-tabs-fields', function () use ($app) {
	global $objSetupsrm, $input;

	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->get_crm_tabs_fields_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-get-crm-tab-field', function () use ($app) {
	global $objSetupsrm, $input;

	$array = array(
				"id"=> $input->id
	);
	$result = $objSetupsrm->get_crm_tab_field_by_id_srm($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/srm/srm-add-crm-tab-field', function () use ($app) {
	global $objSetupsrm, $input;
	 $input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetupsrm->add_crm_tab_field_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-update-crm-tab-field', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->update_crm_tab_field_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-delete-crm-tab-field', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->delete_crm_tab_field_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-sort-tab-fields', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetupsrm->sort_tab_fields_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-get-crm-tab-field-by-name', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetupsrm->get_crm_tab_field_by_name_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/srm/srm-get-crm-tab-field-by-tab-id', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetupsrm->get_crm_tab_field_by_tab_id_srm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});




// Purchase Order Stages Module
//--------------------------------------------------------------------

/* $app->post('/setup/srm/srm-get-order-stages-by-id', function () use ($app) {
	global $objSetupsrm, $input;

	$input_array = array(
		"id"=> $input->id
	);
	$result = $objSetupsrm->get_data_by_id('purchase_order_stages',$input_array['id']);

	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/get-order-stages-list', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();

	foreach($input as $key => $val){
		$input_array[$key] = $val;
	}

	$result = $objSetupsrm->get_order_stages_list($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/add-order-stages-list', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();

	foreach($input as $key => $val){
		$input_array[$key] = $val;
	}

	$result = $objSetupsrm->addPurchaseOrderStages($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/srm/update-order-stages-list', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();

	foreach($input as $key => $val){
		$input_array[$key] = $val;
	}

	$result = $objSetupsrm->addPurchaseOrderStages($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-delete-order-stages', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();

	foreach($input as $key => $val){
		$input_array[$key] = $val;
	}
	$result = $objSetupsrm->delete_update_status('purchase_order_stages','status',$input_array['id']);

	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); */
/* //-------------------- Classifications ------------------------------//


$app->post('/setup/srm/ref-classifications', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetupsrm->get_ref_classifications($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/srm-classifications', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetupsrm->get_srm_classifications($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/add-srm-classification', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetupsrm->add_srm_classification($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/setup/srm/get-srm-classification-by-id', function () use ($app) {
	global $objSetupsrm, $input;
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetupsrm->get_data_by_id('srm_classification', $input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/srm/delete-srm-classification', function () use ($app) {
	global $objSetupsrm, $input;
	$input_array = array();

	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetupsrm->delete_update_status('srm_classification', 'status', $input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
 */

?>