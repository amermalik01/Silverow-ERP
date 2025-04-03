<?php

############	Start: Products Listing ############
$app->post('/sales/stock/products-listing', function () use ($app) {
    global $objStock, $input;
    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );

    $result = $objStock->get_products_listing($array);
    // print_r($array);exit;
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/stock/products-listing/get-products-popup', function () use ($app) {
    //echo "here";exit;
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->get_all_products($input_array);
    //print_r($input_array);exit;
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

});


$app->post('/sales/stock/products-listing/get-products-setup-list', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_products_setup_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/stock/products-listing/get-products-popup-invoice', function () use ($app) {
    //echo "here";exit;
    global $objStock, $input;
    $array = array(
        "all" => 1,
        "category_id" => $input->category_id,
        "search_string" => $input->search_string,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    //print_r($input);exit;
    $result = $objStock->get_products_popup_invoice($array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/stock/products-listing/get-purchased-products-popup', function () use ($app) {

    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_purchased_products_popup($input_array);
    // print_r($array);exit;
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/stock/products-listing/get-purchased-products-supplier-price-popup', function () use ($app) {

    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_purchased_products_supplier_price_popup($input_array);
    // print_r($array);exit;
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/stock/products-listing/get-all-products', function () use ($app) {
    //echo "here";exit;
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_all_products($input_array);
    // print_r($array);exit;
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/stock/products-listing/get-all-categories', function () use ($app) {
    // echo "here";exit;
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_all_categories($input_array);
    // print_r($array);exit;
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/stock/products-listing/get-all-brands', function () use ($app) {
    //echo "here";exit;
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_all_brands($input_array);
    // print_r($array);exit;
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/stock/products-listing/add-excluded-products', function () use ($app) {
    //echo "here";exit;
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->add_excluded_products($input_array);
    // print_r($array);exit;
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/stock/products-listing/add-price-adjustment-excluded-products', function () use ($app) {
    //echo "here";exit;
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->add_price_adjustment_excluded_products($input_array);
    // print_r($array);exit;
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/stock/products-listing/get-excluded-products', function () use ($app) {
    //echo "here";exit;
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_excluded_products($input_array);
    // print_r($array);exit;
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/stock/products-listing/get-price-adjustment-excluded-products', function () use ($app) {
    //echo "here";exit;
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_price_adjustment_excluded_products($input_array);
    // print_r($array);exit;
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/stock/products-listing/product_details', function () use ($app) {
    global $objStock, $input;
    $array = array(
        "product_id" => $input->product_id
    );
    //echo "Here in product details ===>";print_r($array);exit;
    $result = $objStock->get_product_details_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/stock/products-listing/products', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_products($input_array);
    // print_r($array);exit;
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/stock/products-listing/stock-sheet', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    //echo "here";exit;
    $result = $objStock->stock_sheet($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/stock/products-listing/get-purchase-products-popup', function () use ($app) {
    //echo "here";exit;
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->get_purchase_products_popup($input_array);
    // print_r($array);exit;
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/stock/products-listing/get-item-avg', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_item_avg($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/stock/products-listing/get-sale-margin', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_sale_margin($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/stock/products-listing/update-product', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->update_product($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/stock/products-listing/get-last-invoice-date', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_last_invoice_date($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


############	End: Products Listing ##############
?>