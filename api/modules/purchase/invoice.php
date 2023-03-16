<?php
//	 $result = $objSrm->get_data_by_id('srm_invoice',$input_array['id']);
//	 $result = $objSrm->delete_update_status('srm_invoice','status',$input_array['id']);

/* $app->post('/purchase/srm/srminvoice/accounts-entry', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->accounts_entry($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); */


// General Tab
//--------------------------------------


$app->post('/purchase/srm/srminvoice/listing_order', function () use ($app) {

	global $objSrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->get_listing_order($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


	
$app->post('/purchase/srm/srminvoice/listings', function () use ($app) {

	global $objSrm, $input;
	$input_array = array();
 
	foreach($input as $key => $val){
		$input_array[$key] = $val; 
	}
	$result = $objSrm->get_invoice_listings($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


	
$app->post('/purchase/srm/srminvoice/update-grand-total', function () use ($app) {

	global $objSrm, $input;
	$input_array = array();
 
	foreach($input as $key => $val){
		$input_array[$key] = $val; 
	}
	$result = $objSrm->updateGrandTotal($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

	
$app->post('/purchase/srm/srminvoice/invoice-for-payment-listings', function () use ($app) {

	global $objSrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->get_supplier_invoice_listings_for_payment($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});	
$app->post('/purchase/srm/srminvoice/invoice-for-payment-listings-paid', function () use ($app) {

	global $objSrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->get_supplier_invoice_listings_for_payment_paid($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});	
$app->post('/purchase/srm/srminvoice/invoice-for-refund-listings', function () use ($app) {

	global $objSrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->get_supplier_invoice_listings_for_refund($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/purchase/srm/srminvoice/invoice-for-refund-listings-paid', function () use ($app) {

	global $objSrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->get_supplier_invoice_listings_for_refund_paid($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

/* $app->post('/purchase/srm/srminvoice/convert_order', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->convert_into_inovice($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); */

$app->post('/purchase/srm/srminvoice/convertPurchaseToSalesOrder', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->convert_purchase_to_sale_order($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srminvoice/update-purchase-status', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->convert_recieved_stock($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

/* $app->post('/purchase/srm/srminvoice/purchase-stock-received', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val; 
		}

	$result = $objSrm->purchaseStockReceived($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); */

$app->post('/purchase/srm/srminvoice/post-purchase-invoice', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->postPurchaseInvoice($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srminvoice/get-invoice', function () use ($app) {
	global $objSrm, $input;
	$input_array = array(
				"id"=> $input->id
	);
	 $result = $objSrm->get_srm_invoice_by_id($input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srminvoice/get-supplier-emails', function () use ($app) {
	global $objSrm, $input;
	$input_array = array(
				"id"=> $input->supplier_id
	);
	 $result = $objSrm->get_supplier_all_emails($input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srminvoice/update_converted_items_price', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	
	 $result = $objSrm->update_converted_items_price($input_array);
	
	 $app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srminvoice/update-srminvoice', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->update_srminvoice($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srminvoice/update-posted-invoice', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->update_posted_invoice($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

/* $app->post('/purchase/srm/srminvoice/update-posted-invoice', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->update_posted_invoice($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); */


$app->post('/purchase/srm/srminvoice/delete-srminvoice', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	
	 $result = $objSrm->delete_update_status('srm_invoice','status',$input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srminvoice/get-quote-code', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->get_invoice_code($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srminvoice/get-invoice-number', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->get_invoice_number($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/purchase/srm/srminvoice/get-contact-code', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->get_contact_code($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

/* $app->post('/purchase/supplier/supplier/check-customer-limit', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->check_customer_limit($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); */

//---------Invoicing Details-----------------------------

$app->post('/purchase/srm/srminvoice/check-currency-rate', function () use ($app) {	
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	 
	$result = $objSrm->checkCurrencyRate($input_array);	
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result); 
});

$app->post('/purchase/srm/srminvoice/save-additional-cost-order-line', function () use ($app) {	
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	 
	$result = $objSrm->saveAdditionalCostOrderLine($input_array);	
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result); 
});

$app->post('/purchase/srm/srminvoice/save-sel-additional-cost-purchase-order', function () use ($app) {	
	global $objSrm, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;
		}
	 
	$result = $objSrm->saveSelAdditionalCostPurchaseOrder($input_array);	
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result); 
});

$app->post('/purchase/srm/srminvoice/get-additional-cost-purchase-order', function () use ($app) {	
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->getAdditionalCostPurchaseOrder($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srminvoice/get-item-add-cost-purchase-order', function () use ($app) {	
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->getItemAddCostPurchaseOrder($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srminvoice/get-supplier-journal-for-invoice', function () use ($app) {	
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->getSuppJournalInvoice($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srminvoice/add-supplier-journal-for-invoice', function () use ($app) {	
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->addSuppJournalInvoice($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srminvoice/insert-new-order-line', function () use ($app) {	
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->insertNewOrderLine($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srminvoice/save-order-line', function () use ($app) {	
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->saveOrderLine($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srminvoice/get-warehouse-alloc-order-line', function () use ($app) {	
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->getWarehouseAllocOrderLine($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srminvoice/get-invoice-sublist', function () use ($app) {	
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	 // print_r($input);
	 $result = $objSrm->get_invoice_sublist($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

/* $app->post('/purchase/srm/srminvoice/update-invoice-url', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }	
	 $result = $objSrm->update_order_invoice($input_array);	
	 $app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); */

$app->post('/purchase/srm/srminvoice/update-purchase-order', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();

	foreach($input as $key => $val){
		$input_array[$key] = $val; 
	}

	$result = $objSrm->updatePurchaseOrder($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srminvoice/delete-Purchase-Order-before-save', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();

	foreach($input as $key => $val){
		$input_array[$key] = $val; 
	}	

	$result = $objSrm->deletePurchaseOrderBeforeSave($input_array); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srminvoice/delete-Purchase-order-item', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val; 
	}

	$result = $objSrm->deletePurchaseOrderitems($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/purchase/srm/srminvoice/delete-invoice-sublist', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();

	foreach($input as $key => $val){
		$input_array[$key] = $val; 
	}	

	$result = $objSrm->delete_update_status('srm_invoice_detail','status',$input_array['id']); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srminvoice/getSalesOrder', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSrm->getSalesOrderListings($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srminvoice/getSalesOrderforPO', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSrm->getSalesOrderListingsForPO($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srminvoice/getSalesOrderbyPurchaseID', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->getSalesOrderListingsbyPurchaseID($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Invoicing
//--------------------------------------

/* $app->post('/purchase/srm/srminvoice/invoice', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
 
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }

	$result = $objSrm->quote_invoice($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); */

// Shipping
//--------------------------------------

/* $app->post('/purchase/srm/srminvoice/shipping', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->quote_shipping($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); */

// Comment
//--------------------------------------

/* $app->post('/purchase/srm/srminvoice/comment', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->quote_comment($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); */


$app->post('/purchase/srm/srminvoice/genarate-pdf', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->genarate_pdf($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
