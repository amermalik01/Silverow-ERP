<?php
// General Tab
//--------------------------------------	
$app->post('/purchase/srm/srmorderreturn/listings', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	
	$result = $objSrm->get_order_return_listings($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srmorderreturn/get-order-return-by-id', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	 $result = $objSrm->get_srm_order_return_by_id($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/purchase/srm/srmorderreturn/delete-order-return', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	
	 $result = $objSrm->delete_update_status('srm_order_return','status',$input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srmorderreturn/delete-srm-order-item', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;
	}

	$result = $objSrm->delete_srm_order_item($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srmorderreturn/get-order-return-code', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->get_order_return_code($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/purchase/srm/srmorderreturn/update-order-return', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->update_order_return($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srmorderreturn/update-posted-debit-note', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->updatePostedDebitNote($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srmorderreturn/delete-debit-note-before-save', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;
	}

	$result = $objSrm->deleteDebitNoteBeforeSave($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srmorderreturn/delete-debit-note-item', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val;
	}

	$result = $objSrm->deleteDebitNoteItems($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

 


//---------Invoicing Details-----------------------------


$app->post('/purchase/srm/srmorderreturn/save-debit-note-line', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val; 
	}
	$result = $objSrm->saveDebitNoteLine($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srmorderreturn/insert-debit-note-new-order-line', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val; 
	}
	$result = $objSrm->insertDebitNoteNewOrderLine($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srmorderreturn/get-sublist', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	 $result = $objSrm->get_sublist_return($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);

});
$app->post('/purchase/srm/srmorderreturn/update-sublist', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val; 
	}
	$result = $objSrm->update_sublist_return($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srmorderreturn/update-grand-total', function () use ($app) {

	global $objSrm, $input;
	$input_array = array();
 
	foreach($input as $key => $val){
		$input_array[$key] = $val; 
	}
	$result = $objSrm->updateDebitNoteGrandTotal($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srmorderreturn/get-debit-note-items', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val; 
	}
	$result = $objSrm->getDebitNoteItems($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

/* $app->post('/purchase/srm/srmorderreturn/get-debit-note-items', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val; 
	}
	$result = $objSrm->getDebitNoteItems($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); */

$app->post('/purchase/srm/srmorderreturn/get-purchase-invoices-for-debit-note', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	foreach($input as $key => $val){
		$input_array[$key] = $val; 
	}
	$result = $objSrm->getPurchaseInvoicesforDebitNote($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srmorderreturn/delete-sublist', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	 $result = $objSrm->delete_update_status('srm_order_return_detail','status',$input_array['id']); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/purchase/srm/srmorderreturn/get-orreturn-item-list', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	 $result = $objSrm->get_orreturn_item_list($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

//---------Invoicing Details-----------------------------



$app->post('/purchase/srm/srmorderreturn/convert-to-invoice', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->convertInToReturnInovice($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


/* $app->post('/purchase/srm/srmorderreturn/convert_order', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->convert_into_order_return($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); */

$app->post('/purchase/srm/srmorderreturn/update-purchase-status', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->convert_recieved_stock_order_detail($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/purchase/srm/srmorderreturn/get-order-return-number', function () use ($app) {
	global $objSrm, $input;
	$input_array = array();
	 foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objSrm->get_number_order_return($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});