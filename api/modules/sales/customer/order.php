<?php



// General Tab

//--------------------------------------





$app->post('/sales/customer/order/sel-cust-listings', function () use ($app) {



    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->getOrdersBySelCustListings($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/get-order-by-selCust', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->get_orderbySelCust($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/get-order-itemsby-selCust', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->get_order_itemsbySelCust($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/get-sales-order-stagesby-selCust', function () use ($app) {

	global $objCustomer, $input;

	$input_array = array();



	foreach($input as $key => $val){

		$input_array[$key] = $val;

	}

    // print_r($input_array);exit;

	$result = $objCustomer->get_salesOrderStagesbySelCust($input_array);

	$app->response->setStatus(200);

	$app->response()->headers->set('Content-Type', 'application/json');

	echo json_encode($result);

});



$app->post('/sales/customer/order/listings', function () use ($app) {



    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->get_order_listings($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});

$app->post('/sales/customer/order/invoice-for-payment-listings', function () use ($app) {



    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->get_customer_invoice_listings_for_payment($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/invoice-for-payment-listings-paid', function () use ($app) {



    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->get_customer_invoice_listings_for_payment_paid($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/invoice-for-refund-listings', function () use ($app) {



    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->get_customer_invoice_listings_for_refund($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/invoice-for-refund-listings-paid', function () use ($app) {



    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->get_customer_invoice_listings_for_refund_paid($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/all-orders', function () use ($app) {



    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->get_all_orders($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/get-approval-pre-data', function () use ($app) {

    global $objCustomer, $input;

    $array = array(

        "id" => $input->id

    );



    $result = $objCustomer->get_approval_pre_data($array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/get-order', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->get_order_by_id($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});





$app->post('/sales/customer/order/add-order', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->add_order($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/update-order', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->update_order($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});

$app->post('/sales/customer/order/update-link-po', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->updateLinkPO($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});



$app->post('/sales/customer/order/change-order-status', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->change_order_status($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/delete-order', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->delete_order($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/get-order-code', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->get_order_code($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});

$app->post('/sales/customer/order/post-all-orders', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->postAllOrders($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



// Invoicing

//--------------------------------------



$app->post('/sales/customer/order/invoice', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->order_invoice($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



// Shipping

//--------------------------------------



$app->post('/sales/customer/order/shipping', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->order_shipping($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



// Comment

//--------------------------------------



$app->post('/sales/customer/order/comment', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->order_comment($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/get-order-items', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->get_order_items($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/add-order-items', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->add_order_items($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/add-single-order-item', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->add_single_order_item($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



// convert to purchase Order

$app->post('/sales/customer/order/convert-quote-to-purchase-order', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->convertQuoteToPurchaseOrder($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/convert-quote-to-sale-order', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->convert_quote_to_sale_order($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});





$app->post('/sales/customer/return-order/add-single-order-item', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->add_single_return_order_item($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});

$app->post('/sales/customer/return-order/get-invoices-for-credit-notes', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->get_invoices_for_credit_notes($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);



    

});

$app->post('/sales/customer/order/print-invoice', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->print_invoice_vals($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/bulk-print-invoice', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->bulkPrintInvoiceVals($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});

$app->post('/sales/customer/order/bulk-xml-invoice', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->bulkXmlInvoiceVals($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});

$app->post('/sales/customer/order/test-print-invoice', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->bulkPrintToZip($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/navigate-invoice', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->navigate_invoice($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



// Finance

//--------------------------------------





$app->post('/sales/customer/customer/get-order-finance', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->get_order_finance_by_id($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/get-finance-by-order-id', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->get_finance_by_order_id($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/get-order-finance', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->get_order_finance($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});





$app->post('/sales/customer/order/add-order-finance', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->add_order_finance($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/update-order-finance', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->update_order_finance($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/add-order-invoice', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->add_order_invoice($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/update-order-invoice', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->update_order_invoice($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/purchase-orders', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->get_purchase_ordres($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/delete-order-item', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->delete_order_item($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});

$app->post('/sales/customer/order/update-grand-total', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->update_grand_total($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/delete-multiple-order-item', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->delete_multiple_order_item($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/convert-to-invoice', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->convert_to_invoice($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/email-invoice', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->email_invoice($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/user-email-account', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->user_email_account($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/get-warehouse-avail-stock', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->get_warehouse_avail_stock($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});





/*-------------------------------------*/

//				Order Return           //		

/*-------------------------------------*/



// General Tab

//--------------------------------------



$app->post('/sales/customer/return-order/sel-cust-listings', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->getReturnOrderSelCustlistings($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/return-order/listings', function () use ($app) {



    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->get_return_order_listings($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/return-order/get-order', function () use ($app) {

    global $objCustomer, $input;

    $array = array(

        "id" => $input->id

    );



    $result = $objCustomer->get_return_order_by_id($array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});





$app->post('/sales/customer/return-order/add-order', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->add_return_order($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/return-order/update-order', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->update_return_order($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/return-order/change-order-status', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->change_return_order_status($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/return-order/delete-order', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->delete_return_order($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/return-order/get-order-code', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->get_return_order_code($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



// Invoicing

//--------------------------------------



$app->post('/sales/customer/return-order/invoice', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->order_return_invoice($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



// Shipping

//--------------------------------------



$app->post('/sales/customer/return-order/shipping', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->return_order_shipping($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



// Comment

//--------------------------------------



$app->post('/sales/customer/return-order/comment', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->return_order_comment($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/return-order/get-order-items', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->get_return_order_items($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/return-order/add-order-items', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->add_return_order_items($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});

$app->post('/sales/customer/return-order/get-credit-note-items', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->get_credit_note_items($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});





// Finance

//--------------------------------------





/*$app->post('/sales/customer/customer/get-order-finance', function () use ($app) {

	global $objCustomer, $input;

	$input_array = array();

	 foreach($input as $key => $val){

	  $input_array[$key] = $val; 

	 }

	

	$result = $objCustomer->get_order_finance_by_id($input_array);

	$app->response->setStatus(200);

	$app->response()->headers->set('Content-Type', 'application/json');

	echo json_encode($result);

});*/



$app->post('/sales/customer/return-order/get-finance-by-order-id', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->get_finance_by_order_id($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/return-order/get-order-finance', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->get_order_finance($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});





$app->post('/sales/customer/return-order/add-order-finance', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCustomer->add_order_finance($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/return-order/update-order-finance', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->update_order_finance($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/return-order/purchase-orders', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->get_purchase_ordres($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/return-order/delete-order-item', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->delete_return_order_item($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/return-order/convert-to-invoice', function () use ($app) {

	global $objCustomer, $input;

	$input_array = array();

	 foreach($input as $key => $val){

	  $input_array[$key] = $val; 

	 }

	$result = $objCustomer->convert_return_order_to_invoice($input_array);

	$app->response->setStatus(200);

	$app->response()->headers->set('Content-Type', 'application/json');

	echo json_encode($result);

});



/*$app->post('/sales/customer/return-order/email-invoice', function () use ($app) {

	global $objCustomer, $input;

	$input_array = array();

	 foreach($input as $key => $val){

	  $input_array[$key] = $val; 

	 }

	$result = $objCustomer->email_invoice($input_array);

	$app->response->setStatus(200);

	$app->response()->headers->set('Content-Type', 'application/json');

	echo json_encode($result);

});*/



/*$app->post('/sales/customer/return-order/user-email-account', function () use ($app) {

	global $objCustomer, $input;

	$input_array = array();

	 foreach($input as $key => $val){

	  $input_array[$key] = $val; 

	 }

	$result = $objCustomer->user_email_account($input_array);

	$app->response->setStatus(200);

	$app->response()->headers->set('Content-Type', 'application/json');

	echo json_encode($result);

});

*/

/*$app->post('/sales/customer/return-order/get-warehouse-avail-stock', function () use ($app) {

	global $objCustomer, $input;

	$input_array = array();

	 foreach($input as $key => $val){

	  $input_array[$key] = $val; 

	 }

	$result = $objCustomer->get_warehouse_avail_stock($input_array);

	$app->response->setStatus(200);

	$app->response()->headers->set('Content-Type', 'application/json');

	echo json_encode($result);

});*/



/*    to store order stauts*/



/*    add order status*/



$app->post('/sales/customer/order/add-order-status', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->add_order_status($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



/*    del order status*/



$app->post('/sales/customer/order/del-order-status', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->del_order_status($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});





/*    get all order status*/



$app->post('/sales/customer/order/get-all-order-status', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->get_all_order_status($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});





$app->post('/sales/customer/order/update-sales-order-stages', function () use ($app) {

	global $objCustomer, $input;

	$input_array = array();



	foreach($input as $key => $val){

		$input_array[$key] = $val;

	}

    // print_r($input_array);exit;

	$result = $objCustomer->update_sales_order_stages($input_array);

	$app->response->setStatus(200);

	$app->response()->headers->set('Content-Type', 'application/json');

	echo json_encode($result);

});





$app->post('/sales/customer/order/get-sales-order-stages', function () use ($app) {

	global $objCustomer, $input;

	$input_array = array();



	foreach($input as $key => $val){

		$input_array[$key] = $val;

	}

    // print_r($input_array);exit;

	$result = $objCustomer->get_sales_order_stages($input_array);

	$app->response->setStatus(200);

	$app->response()->headers->set('Content-Type', 'application/json');

	echo json_encode($result);

});





$app->post('/sales/customer/order/get-sales-order-stats', function () use ($app) {

	global $objCustomer, $input;

	$input_array = array();



	foreach($input as $key => $val){

		$input_array[$key] = $val;

	}

    // print_r($input_array);exit;

	$result = $objCustomer->get_sales_order_stats($input_array);

	$app->response->setStatus(200);

	$app->response()->headers->set('Content-Type', 'application/json');

	echo json_encode($result);

});













$app->post('/sales/customer/order/fifo-so-emtry', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->fifo_account_entry($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/last-order', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->customerLastOrder($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/customer/order/customer-popup', function () use ($app) {

    global $objCustomer, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCustomer->customer_popup($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});





?>