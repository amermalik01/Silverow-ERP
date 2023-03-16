<?php 
$app->post('/setup/crm/get-details-cust-portal', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	}
	$result = $objSetup->getDetailsCustPortal($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

// Shipment Methods Module
//--------------------------------------------------------------------

$app->post('/setup/crm/shipment-methods', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$input_array['shipment_type']=1;
	$result = $objSetup->get_shipment_methods($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/get-shipment-method', function () use ($app) {
	global $objSetup, $input;

	$array = array(
				"id"=> $input->id
	);

	$result = $objSetup->get_shipment_method_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/crm/add-shipment-method', function () use ($app) {
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

$app->post('/setup/crm/update-shipment-method', function () use ($app) {
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

$app->post('/setup/crm/delete-shipment-method', function () use ($app) {
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


// Payment Methods Module
//--------------------------------------------------------------------

$app->post('/setup/crm/payment-methods', function () use ($app) {
	global $objSetup, $input;

	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objSetup->get_payment_methods($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/get-payment-method', function () use ($app) {
	global $objSetup, $input;

	$array = array(
				"id"=> $input->id
	);
	$result = $objSetup->get_payment_method_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/crm/add-payment-method', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetup->add_payment_method($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/update-payment-method', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->update_payment_method($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/delete-payment-method', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->delete_payment_method($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/get-payment-methods-list', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetup->get_payment_methods_list($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

// Haulier Target Module
//--------------------------------------------------------------------

$app->post('/setup/crm/haulier-targets', function () use ($app) {
	global $objSetup, $input;

	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objSetup->get_haulier_targets($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/get-haulier-target', function () use ($app) {
	global $objSetup, $input;

	$array = array(
				"id"=> $input->id
	);
	$result = $objSetup->get_haulier_target_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/get-area-covered', function () use ($app) {
	global $objSetup, $input;

	foreach($input as $key => $val){
		$input_array[$key] = $val; 
	   }
	$result = $objSetup->get_area_covered($input_array);
	$app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

 $app->post('/setup/crm/add-haulier-target', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetup->add_haulier_target($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/update-haulier-target', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->update_haulier_target($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/delete-haulier-target', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->delete_haulier_target($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

// Payment Terms Module
//--------------------------------------------------------------------

$app->post('/setup/crm/payment-terms', function () use ($app) {
	global $objSetup, $input;

	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objSetup->get_payment_terms($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/get-payment-term', function () use ($app) {
	global $objSetup, $input;

	$array = array(
				"id"=> $input->id
	);
	$result = $objSetup->get_payment_term_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/get-payment-terms-list', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetup->get_payment_terms_list($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/add-payment-term', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetup->add_payment_term($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/update-payment-term', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->update_payment_term($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/delete-payment-term', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->delete_payment_term($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

// Finance Charges Module
//--------------------------------------------------------------------

$app->post('/setup/crm/finance-charges', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->get_finance_charges($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/get-finance-charges', function () use ($app) {
	global $objSetup, $input;

	$array = array(
				"id"=> $input->id
	);
	$result = $objSetup->get_finance_charges_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/crm/add-finance-charges', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetup->add_finance_charges($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/update-finance-charges', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->update_finance_charges($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/delete-finance-charges', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->delete_finance_charges($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/get-finance-charge-code', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->get_charges_code($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/get-insurance-charge-code', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->get_charges_code($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

// Insurance Charges Module
//--------------------------------------------------------------------

$app->post('/setup/crm/insurance-charges', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->get_insurance_charges($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/get-insurance-charges', function () use ($app) {
	global $objSetup, $input;

	$array = array(
				"id"=> $input->id
	);
	$result = $objSetup->get_insurance_charges_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/crm/add-insurance-charges', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetup->add_insurance_charges($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/update-insurance-charges', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->update_insurance_charges($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/delete-insurance-charges', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->delete_insurance_charges($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


// Insurance Charges Module
//--------------------------------------------------------------------

$app->post('/setup/crm/overrider', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->get_overrider($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/get-overrider', function () use ($app) {
	global $objSetup, $input;

	$array = array(
				"id"=> $input->id
	);
	$result = $objSetup->get_overrider_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/crm/add-overrider', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetup->add_overrider($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/update-overrider', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->update_overrider($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/delete-overrider', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->delete_overrider($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


// Sales Pipeline Target Charges Module
//--------------------------------------------------------------------

$app->post('/setup/crm/sales-pipeline-targets', function () use ($app) {
	global $objSetup, $input;
	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objSetup->get_sales_pipeline_targets($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/get-sales-pipeline-target', function () use ($app) {
	global $objSetup, $input;

	$array = array(
				"id"=> $input->id
	);
	$result = $objSetup->get_sales_pipeline_target_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/crm/add-sales-pipeline-target', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetup->add_sales_pipeline_target($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/update-sales-pipeline-target', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->update_sales_pipeline_target($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/delete-sales-pipeline-target', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->delete_sales_pipeline_target($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

// Shipping Agents Module
//--------------------------------------------------------------------

$app->post('/setup/crm/shipping-agents', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->get_shipping_agents($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


// CRM Tabs Module
//--------------------------------------------------------------------

$app->post('/setup/crm/crm-tabs', function () use ($app) {
	global $objSetup, $input;

	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	$result = $objSetup->get_crm_tabs($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/get-crm-tab', function () use ($app) {
	global $objSetup, $input;

	$array = array(
				"id"=> $input->id
	);
	$result = $objSetup->get_crm_tab_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/crm/add-crm-tab', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetup->add_crm_tab($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/update-crm-tab', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->update_crm_tab($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/delete-crm-tab', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->delete_crm_tab($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/sort-tab', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->sort_tab($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


// CRM Opportunity Cycle Tabs Module
//--------------------------------------------------------------------

$app->post('/setup/crm/opportunity-cycle-tabs', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->get_opportunity_cycle_tabs($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/get-opportunity-cycle-tab', function () use ($app) {
	global $objSetup, $input;

	$array = array(
		"id"=> $input->id
	);
	$result = $objSetup->get_opportunity_cycle_tab_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/crm/add-opportunity-cycle-tab', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetup->add_opportunity_cycle_tab($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/add-opportunity-cycle-tab-popup', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetup->add_opportunity_cycle_tab_popup($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/update-opportunity-cycle-tab', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->update_opportunity_cycle_tab($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/delete-opportunity-cycle-tab', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->delete_opportunity_cycle_tab($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/sort-opportunity-cycle-tabs', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->sort_opportunity_cycle_tabs($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


// CRM Tabs Module
//--------------------------------------------------------------------

$app->post('/setup/crm/crm-tabs-fields', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->get_crm_tabs_fields($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/get-crm-tab-field', function () use ($app) {
	global $objSetup, $input;

	$array = array(
				"id"=> $input->id
	);
	$result = $objSetup->get_crm_tab_field_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/crm/add-crm-tab-field', function () use ($app) {
	global $objSetup, $input;
	 $input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetup->add_crm_tab_field($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/update-crm-tab-field', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->update_crm_tab_field($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/delete-crm-tab-field', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->delete_crm_tab_field($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/sort-tab-fields', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->sort_tab_fields($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/get-crm-tab-field-by-name', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetup->get_crm_tab_field_by_name($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/crm/get-crm-tab-field-by-tab-id', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSetup->get_crm_tab_field_by_tab_id($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


// CRM BUYING GROUP Module
//--------------------------------------------------------------------

$app->post('/setup/crm/buying-group-list', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->get_buying_group_list($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/add-buying-group', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->add_buying_group($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

// CRM REGION Module
//--------------------------------------------------------------------

$app->post('/setup/crm/region-list', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->get_region_list($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/add-region', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->add_region($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

// CRM SEGMENT Module
//--------------------------------------------------------------------

$app->post('/setup/crm/segment-list', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->get_segment_list($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/add-segment', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->add_segment($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

// CRM OFFER METHOD Module
//--------------------------------------------------------------------

$app->post('/setup/crm/offer-method-list', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->get_offer_method_list($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/add-offer-method', function () use ($app) {
	global $objSetup, $input;

	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->add_offer_method($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


// Order Stages Module
//--------------------------------------------------------------------


$app->post('/setup/crm/crm-get-order-stages-by-id', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;
	}
	$result = $objSetup->get_crm_order_stage_by_id($input_array);

	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/get-order-stages-list', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;
	}
	$result = $objSetup->get_order_stages_list($input_array); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/sort-order-stages', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->sort_crm_order_stages($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/add-order-stages-list', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();

	foreach($input as $key => $val){
		$input_array[$key] = $val;
	}

	$result = $objSetup->add_order_stages_crm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/crm/update-order-stages-list', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();

	foreach($input as $key => $val){
		$input_array[$key] = $val;
	}

	$result = $objSetup->add_order_stages_crm($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/crm-delete-order-stages', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();

	foreach($input as $key => $val){
		$input_array[$key] = $val;
	}
	// $result = $objSetup->delete_crm_stages('ref_crm_order_stages','status',$input_array['id']);
	$result = $objSetup->delete_crm_stages($input_array);

	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/sort-crm-order-stages', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();

	foreach($input as $key => $val){
		$input_array[$key] = $val;
	}
	$result = $objSetup->sort_crm_order_stages($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});






//  customer finance posting group
$app->post('/setup/crm/posting-general-list', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	// echo 'dd';exit;
	$result = $objSetup->get_posting_general($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/get-posting-general-by-id', function () use ($app) {
	global $objSetup, $input;
	$array = array(
				"id"=> $input->id
	);
	
	$result = $objSetup->get_data_by_id('ref_posting_general',$array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/crm/add-posting-general', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->add_posting_general($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/update-posting-general', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->update_posting_general($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/delete-posting-general', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
		$result = $objSetup->delete_update_status('ref_posting_general','status',$input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


//  customer finance posting group
$app->post('/setup/crm/posting-group-list', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	// echo 'dd';exit;
	$result = $objSetup->get_posting_group($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/posting-group-list-cust-portal', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	}
	$result = $objSetup->get_postingGroupCustPortal($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/get-posting-group-by-id', function () use ($app) {
	global $objSetup, $input;
	$array = array(
				"id"=> $input->id
	);
$result = $objSetup->get_data_by_id('ref_posting_group',$array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/crm/add-posting-group', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->add_posting_group($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/update-posting-group', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->update_posting_group($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/delete-posting-group', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
			$result = $objSetup->delete_update_status('ref_posting_group','status',$input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});



//  customer finance posting_vat
$app->post('/setup/crm/posting-vat-list', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->get_posting_vat($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/get-posting-vat-by-id', function () use ($app) {
	global $objSetup, $input;
	$array = array(
				"id"=> $input->id
	);
	$result = $objSetup->get_data_by_id('ref_posting_vat',$array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/crm/update-posting-vat', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSetup->update_posting_vat($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/crm/delete-posting-vat', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
		$result = $objSetup->delete_update_status('ref_posting_vat','status',$input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


?>