<?php
//echo "here";exit;
// General Tab/ Main Crm Info Module
//--------------------------------------
$app->post('/sales/customer/customer/get-unique-id', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->get_unique_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/check_for_module_code', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->check_for_module_code($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

});

$app->post('/sales/customer/customer/listings', function () use ($app) {
    global $objCustomer, $input;

    /*$array = array(
                "all"=> $input->all,
                "start"=> $input->start,
                "limit"=> $input->limit,
                "keyword"=> $input->keyword,
                "get_id"=> $input->get_id
    );*/

    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    //print_r($input_array);exit;
    if ($input_array['get_id'] == 1) {
        $result = $objCustomer->get_customer_listings_2($input_array);
    } else {
        $result = $objCustomer->get_customer_listings($input_array);
    }
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-customer-global', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->get_customer_global($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/customer/customer/get-customer', function () use ($app) {
    global $objCustomer, $input;
    $array = array(
        "id" => $input->id
    );

    $result = $objCustomer->get_customer_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/customer/customer/add-customer', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->add_customer($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/popup-listing', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    //$result = $objCustomer->get_customer_listings_popup($input_array);
    $result = $objCustomer->get_customer_crm_listings_popup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/getCustomerListings', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    //$result = $objCustomer->get_customer_listings_popup($input_array);
    $result = $objCustomer->get_customer_order_listings_popup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/getCustomerForOrder', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    //$result = $objCustomer->get_customer_listings_popup($input_array);
    $result = $objCustomer->get_customer_for_order($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/generate-graph-for-targets', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    //$result = $objCustomer->get_customer_listings_popup($input_array);
    $result = $objCustomer->generateTargetGraph($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/getCustomerForGeneralLedger', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    //$result = $objCustomer->get_customer_listings_popup($input_array);
    $result = $objCustomer->get_customer_for_general_ledger($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/popup-listing-for-cust-sales-return', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    //$result = $objCustomer->get_customer_listings_popup($input_array);
    $result = $objCustomer->get_cust_sales_return_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/customer/customer/get-customers-for-popup', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    // $result = $objCustomer->get_customers_for_popup($input_array);
    $result = $objCustomer->get_customer_for_order($input_array);
    //$result = $objCustomer->get_customer_listings($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/popup-listing-for-alt-location', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->get_customer_listings_for_alt_location($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/customer/customer/popup-listing-crm-customer', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->get_customer_crm_listings_popup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/popup-listing-for-groups', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->get_customer_listings_for_groups($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/update-customer', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->update_customer($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/change-status', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->change_status($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/delete-customer', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->delete_customer($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-crm-code', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->get_crm_code($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/check-customer-limit', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->check_customer_limit($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Finance
//--------------------------------------


$app->post('/sales/customer/customer/finance-listings', function () use ($app) {

    global $objCustomer, $input;
    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objCustomer->get_finance_listings($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-finance', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->get_finance_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-finance-by-customer-id', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->get_finance_by_customer_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-customer-finance', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->get_customer_finance($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/customer/customer/add-finance', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->add_finance($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/update-finance', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->update_finance($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/change-finance-status', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->change_finance_status($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/delete-finance', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->delete_finance($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Alt Contact Module
//--------------------------------------

$app->post('/sales/customer/customer/alt-contacts', function () use ($app) {
    global $objCustomer, $input;
    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objCustomer->get_alt_contacts($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-alt-contact', function () use ($app) {
    global $objCustomer, $input;
    $array = array(
        "id" => $input->id
    );

    $result = $objCustomer->get_alt_contact_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/customer/customer/add-alt-contact', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->add_alt_contact($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/update-alt-contact', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->update_alt_contact($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/delete-alt-contact', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->delete_alt_contact($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Alt Depot Module
//--------------------------------------

$app->post('/sales/customer/customer/alt-depots', function () use ($app) {

    global $objCustomer, $input;
    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );

    $result = $objCustomer->get_alt_depots($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-alt-depot', function () use ($app) {
    global $objCustomer, $input;
    $array = array(
        "id" => $input->id
    );

    $result = $objCustomer->get_alt_depot_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/customer/customer/add-alt-depot', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->add_alt_depot($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/update-alt-depot', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->update_alt_depot($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/delete-alt-depot', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->delete_alt_depot($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// CRM Competitor Module
//--------------------------------------------
$app->post('/sales/customer/customer/crm-competitors', function () use ($app) {
    global $objCustomer, $input;
    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objCustomer->get_crm_competitors($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-crm-competitor', function () use ($app) {
    global $objCustomer, $input;
    $array = array(
        "id" => $input->id
    );
    $result = $objCustomer->get_crm_competitor_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/customer/customer/add-crm-competitor', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->add_crm_competitor($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/update-crm-competitor', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->update_crm_competitor($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/delete-crm-competitor', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->delete_crm_competitor($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Price Offer
//--------------------------------------------
$app->post('/sales/customer/customer/price-offers', function () use ($app) {
    global $objCustomer, $input;
    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objCustomer->get_price_offers($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-price-offer', function () use ($app) {
    global $objCustomer, $input;
    $array = array(
        "id" => $input->id
    );
    $result = $objCustomer->get_price_offer_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/customer/customer/add-price-offer', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->add_price_offer($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/update-price-offer', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->update_price_offer($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/delete-price-offer', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->delete_price_offer($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// CRM Promotion
//---------------------------------------------

$app->post('/sales/customer/customer/promotions', function () use ($app) {

    global $objCustomer, $input;
    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objCustomer->get_crm_promotions($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-promotion', function () use ($app) {
    global $objCustomer, $input;
    $array = array(
        "id" => $input->id
    );

    $result = $objCustomer->get_crm_promotion_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/customer/customer/add-promotion', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->add_crm_promotion($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/update-promotion', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->update_crm_promotion($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/delete-promotion', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->delete_crm_promotion($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/add-promotion-product', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->add_crm_promotion_product($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-promotion-products', function () use ($app) {
    global $objCustomer, $input;
    $array = array(
        "id" => $input->id
    );

    $result = $objCustomer->get_crm_promotion_products($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/delete-crmpromotion-product', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->delete_promotion($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Customer Item Information
//--------------------------------------------
$app->post('/sales/customer/customer/customer-items-info', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->get_customer_items_info($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/change-standard-price-slae-info', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->change_standard_price_sale_info($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-customer-item-info', function () use ($app) {
    /* global $objCustomer, $input;
    $array = array(
        "id" => $input->id
    ); */
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->get_customer_item_info_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/customer/customer/add-customer-item-info', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->add_customer_item_info($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/update-customer-item-info', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->update_customer_item_info($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/delete-customer-item-info', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->delete_customer_item_info($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

// Sale Promotion
//--------------------------------------------
$app->post('/sales/customer/customer/sale-promotions', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->get_sale_promotions($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/sale-promotion-detail', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->get_sale_promotion_detail($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-sale-promotion', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->get_sale_promotion_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/customer/customer/add-sale-promotion', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->add_sale_promotion($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/update-sale-promotion', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->update_sale_promotion($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/add-sale-promotion-detail', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->add_sale_promotion_detail($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/update-sale-promotion-detail', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->update_sale_promotion_detail($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/delete-sale-promotion', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->delete_sale_promotion($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/sale-promotion-excluded-customers', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->get_sale_promotion_excluded_customers($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// EXCLUDED CUSTOMERS
$app->post('/sales/customer/customer/add-excluded-customers', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->add_excluded_customers($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-excluded-customers', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->get_excluded_customers($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/add-promotion-excluded-customers', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->add_promotion_excluded_customers($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-promotion-excluded-customers', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->get_promotion_excluded_customers($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/sale-excluded-customers', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->get_sale_excluded_customers($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/all-promotion-types', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->all_promotion_types($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/all-product-promotion-types', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->all_product_promotion_types($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-group-of-customers', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->get_group_of_customers($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-promotion-products-customers', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->get_promotion_products_customers($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-sale-products-customers', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->get_sale_products_customers($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Price Adjustment
//--------------------------------------

$app->post('/sales/customer/customer/price-adjustments', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->get_price_adjustments($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/price-adjustment-detail', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->get_price_adjustment_detail($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-customer-price-adjustment', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->get_customer_price_adjustment($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-customer-price-adjustment-detail', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->get_customer_price_adjustment_detail($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-price-adjustment', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->get_price_adjustment_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/customer/customer/add-price-adjustment', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->add_price_adjustment($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/update-price-adjustment', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->update_price_adjustment($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/add-price-adjustment-detail', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->add_price_adjustment_detail($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/update-price-adjustment-detail', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->update_price_adjustment_detail($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/check-nd-delete-price-adjustment', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->check_nd_delete_price_adjustment($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/delete-price-adjustment', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->delete_price_adjustment($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Price Adjustment EXCLUDED CUSTOMERS
//--------------------------------------------
$app->post('/sales/customer/customer/price-adjustment-excluded-customers', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->get_price_adjustment_excluded_customers($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/add-price-adjustment-excluded-customers', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->add_price_adjustment_excluded_customers($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/customer/customer/get-price-adjustment-excluded-customers', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->get_price_adjustment_excluded_customers($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/sale-price_adjustment-excluded-customers', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCustomer->get_sale_price_adjustment_excluded_customers($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-price-adjustment-products-customers', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->get_price_adjustment_products_customers($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/add-customer-price-adjustment', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->add_customer_price_adjustment($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-customer-pricing', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->get_customer_pricing($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/customer/customer/get-promotions', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->get_latest_promotions($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-currency-conversion-rate', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->get_currency_conversion_rate($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/save-sales-target', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->save_sales_target($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-sales-forecast', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->get_sales_forecast($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-customer-forecast', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->get_customer_forecast($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/get-customer-forecast-details', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->get_customer_forecast_details($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/save-customer-forecast-details', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->save_customer_forecast_details($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/delete-customer-forecast-details', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->delete_customer_forecast_details($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/customer/customer/lock-customer-forecast', function () use ($app) {
    global $objCustomer, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCustomer->lock_customer_forecast($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
<<<<<<< HEAD

?>

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
