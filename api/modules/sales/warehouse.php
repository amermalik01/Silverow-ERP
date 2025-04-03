<?php
// General Tab/ Main Crm Info Module
//--------------------------------------

$app->post('/sales/warehouse/get-all-list', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_all_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

});

$app->post('/sales/warehouse/get-items-warehouse', function () use ($app) {

    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_items_warehouse($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

});


$app->post('/sales/warehouse/listings', function () use ($app) {
    global $objWarehouse, $input;
    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objWarehouse->get_warehouse_listings($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-warehouse', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objWarehouse->get_data_by_id('warehouse', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/warehouse/add-warehouse', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objWarehouse->add_warehouse($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/update-warehouse', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->add_warehouse($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/delete-warehouse', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->delete_update_status('warehouse', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/convert', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->convert($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-warehouse-code', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_warehouse_code($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/warehouse/update-finance', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->update_finance($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Alt Contact Module
//--------------------------------------

$app->post('/sales/warehouse/alt-contacts', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    // echo 'here';
    $result = $objWarehouse->get_alt_contacts($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-alt-contact', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objWarehouse->get_data_by_id('warehouse_alt_contact', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/warehouse/add-alt-contact', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->add_alt_contact($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/update-alt-contact', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->add_alt_contact($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-alt-contact-by-id', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array(
        "id" => $input->id
    );

    $result = $objWarehouse->get_data_by_id('warehouse_alt_contact', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/delete-alt-contact', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->delete_update_status('warehouse_alt_contact', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-alt-contacts-list', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_alt_contacts_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Alt Depot Module
//--------------------------------------

$app->post('/sales/warehouse/alt-depots', function () use ($app) {

    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objWarehouse->get_alt_depots($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-alt-depot-by-id', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objWarehouse->get_data_by_id('srm_alt_depot', $input_array['id']);
    //$result = $objWarehouse->get_alt_depot_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/warehouse/add-alt-depot', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objWarehouse->add_alt_depot($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/update-alt-depot', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->add_alt_depot($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/delete-alt-depot', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->delete_update_status('srm_alt_depot', 'status', $input_array['id']);
    //$result = $objWarehouse->delete_alt_depot($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// CRM Price Offer Listings
//--------------------------------------------


$app->post('/sales/warehouse/srm-price-offer-volume-list', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_price_list_in_volume($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/warehouse/srm-price-offer-listings', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_price_offer_listings($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-warehouse-price-offer-by-id', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objWarehouse->get_data_by_id('srm_price_offer_listing', $input_array['id']);
    //$result = $objWarehouse->get_warehouse_price_offer_listing_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/warehouse/add-warehouse-price-offer-listing', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->add_warehouse_price_offer_listing($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/warehouse/delete-warehouse-price-offer-listing', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->delete_update_status('srm_price_offer_listing', 'status', $input_array['id']);
    //$result = $objWarehouse->delete_warehouse_price_offer_listing($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/warehouse/get-method-list', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_method($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/sales/warehouse/add-method', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objWarehouse->add_method($input);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/warehouse/get-shiping-list', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_shipping_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/sales/warehouse/add-shiping-list', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objWarehouse->add_shipping($input);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


//----------SRM shipping  ----------------------------


$app->post('/sales/warehouse/srm-shipping', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_shipping($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-warehouse-shipping-by-id', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objWarehouse->get_data_by_id('srm_agent_area_list', $input_array['id']);
    //$result = $objWarehouse->get_warehouse_shipping_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/add-customer', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objWarehouse->add_cusomer($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/warehouse/add-warehouse-shipping', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objWarehouse->add_warehouse_shipping($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/delete-warehouse-shipping', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    // require_once(SERVER_PATH."/classes/General.php");

    //$objGnr = new General($user_info);
    //call  funtion in General File
    //$result = $objGnr->delete_update_status('srm_agent_area_list',$input_array['id']);

    //call static funtion in General File
    //$result =	General::delete_update_status('srm_agent_area_list',$input_array['id']);


    $result = $objWarehouse->delete_update_status('srm_agent_area_list', 'status', $input_array['id']);
    //$result = $objWarehouse->delete_warehouse_shipping($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


//----------SRM Area  ----------------------------

$app->post('/sales/warehouse/get-coverage-all-areas', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_coverage_all_areas($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/warehouse/get-selected-area', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objWarehouse->get_slected_areas($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/srm-area', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_area($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-warehouse-area-by-id', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objWarehouse->get_data_by_id('srm_area_selected', $input_array['id']);
    //$result = $objWarehouse->get_warehouse_area_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/warehouse/add-warehouse-area', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objWarehouse->add_warehouse_area($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/warehouse/delete-warehouse-area', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->delete_update_status('srm_area_selected', 'status', $input_array['id']);
    //	$result = $objWarehouse->delete_warehouse_area($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// CRM Document Module
//--------------------------------------

$app->post('/sales/warehouse/srm-documents', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_documents($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-warehouse-document-by-id', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objWarehouse->get_data_by_id('document', $input_array['id']);
    //$result = $objWarehouse->get_warehouse_document_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/warehouse/add-warehouse-document', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objWarehouse->add_warehouse_document($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/update-warehouse-document', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->update_warehouse_document($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/delete-warehouse-document', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->delete_update_status('document', 'status', $input_array['id']);
    //$result = $objWarehouse->delete_warehouse_document($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/folders', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objWarehouse->get_folders($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/add-folder', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objWarehouse->add_folder($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Price Offer Volume Module
//--------------------------------------

$app->post('/sales/warehouse/price-offer-volumes', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_price_offer_volumes($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-price-offer-volume', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objWarehouse->get_data_by_id('srm_volume_discount', $input_array['id']);
    //$result = $objWarehouse->get_price_offer_volume_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/warehouse/add-price-offer-volume', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    // print_r($input_array); exit;
    $result = $objWarehouse->add_price_offer_volume($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/update-price-offer-volume', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->update_price_offer_volume($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-price-offer-volume-by-id', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_data_by_id('srm_volume_discount', $input_array['id']);
    //$result = $objWarehouse->get_price_offer_volume_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/delete-price-offer-volume', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->delete_update_status('srm_volume_discount', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-price-offer-volume-by-type', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_price_offer_volume_by_type($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


///////////////// for volume discount ///////////////

$app->post('/sales/warehouse/supplier_list', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objWarehouse->get_supplier_list_product_id($input_array);
    //print_r($result);exit;
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

});

$app->post('/sales/warehouse/supplier_by_id', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objWarehouse->get_data_by_id('srm_volume_discount', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

});

$app->post('/sales/warehouse/delete_sp_id', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array(
        "id" => $input->id
    );

    $result = $objWarehouse->delete_update_status('srm_volume_discount', 'status', $input_array['id']);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

});

$app->post('/sales/warehouse/update_product_values', function () use ($app) {
    global $objWarehouse, $input;

    $result = $objWarehouse->update_product_value($input);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Rebate Volume Module
//--------------------------------------

$app->post('/sales/warehouse/rebate-volumes', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_rebate_volumes($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-rebate-volume', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array(
        "id" => $input->id
    );

    $result = $objWarehouse->get_data_by_id('srm_rebate_volume', $input_array['id']);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/warehouse/add-rebate-volume', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objWarehouse->add_rebate_volume($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/update-rebate-volume', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->add_rebate_volume($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-rebate-volume-by-id', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_data_by_id('srm_rebate_volume', $input_array['id']);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/delete-rebate-volume', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objWarehouse->delete_update_status('srm_rebate_volume', 'type', 0);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-rebate-volume-by-type', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_rebate_volume_by_type($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


//-------SRM Rebate -------------------------------------
$app->post('/sales/warehouse/srm-rebate-listings', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_rebate_listings($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-warehouse-rebate', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array(
        "id" => $input->id

    );
    $result = $objWarehouse->get_data_by_id('srm_rebate', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/warehouse/add-warehouse-rebate', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->add_warehouse_rebate($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/update-warehouse-rebate', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->add_warehouse_rebate($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/delete-warehouse-rebate', function () use ($app) {
    global $objWarehouse, $input;

    $input_array = array(
        "id" => $input->id
    );
    $result = $objWarehouse->delete_update_status('srm_rebate', 'type', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-rebate-items', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_rebate_items($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-rebate-categories', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_rebate_categories($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


//-------SRM invoice Stock allocation -------------------------------------

$app->post('/sales/warehouse/stk-allocation', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_stock_allocation($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/add-stk-allocation', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->add_stock_allocation($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/update-stk-allocation', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->add_stock_allocation($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-stk-allocation', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array(
        "id" => $input->id
    );

    $result = $objWarehouse->get_data_by_id('warehouse_allocation', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/delete-stk-allocation', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->delete_update_status('warehouse_allocation', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

//-------------- For Sale Order Stock------------

$app->post('/sales/warehouse/add-purchase-order-stock-allocation', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->addPurchaseOrderStockAllocation($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/add-order-stock-allocation', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->add_order_stock_allocation($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/add-order-stock-allocation-journal', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->add_order_stock_allocation_journal($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/add-order-stock-allocation-transfer-order', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->add_order_stock_allocation_transfer_order($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-purchase-stock-for-debit-note', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->getPurchaseStockforDebitNote($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-purchase-stock', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_purchase_stock($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-purchase-stock-positive', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->getPurchaseStockPositive($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-purchase-stock-journal', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_purchase_stock_journal($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-purchase-stock-transfer-order', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_purchase_stock_transfer_order($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-sale-stock', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_sale_stock($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-purchase-order-stock-allocation', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->getPurchaseOrderStockAllocation($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/get-order-stock-allocation', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    //echo 'd';exit;
    $result = $objWarehouse->get_order_stock_allocation($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/sales/warehouse/get-curent-stock-by-product-id', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_curent_stock_by_product_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/sales/warehouse/get-curent-stock-by-product-id-warehouse', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->get_curent_stock_by_product_id_warehouse($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/delete-debit-note-stock', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->deleteDebitNoteStock($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/deallocate-debit-note-stock', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->deallocateDebitNotestock($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/delete-sale-order-stock', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->delete_sale_order_stock($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/delete-item-journal-stock', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->delete_item_journal_stock($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/delete-item-transfer-order', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->delete_item_transfer_order($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/sales/warehouse/deallocate-sale-order-stock', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->deallocate_sale_order_stock($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/sales/warehouse/deallocate-item-journal-stock', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->deallocate_item_journal_stock($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/deallocate-item-transfer-order', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->deallocate_item_transfer_order($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/dispatch-stock', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->dispatch_stock($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/sales/warehouse/dispatch-debit-note-stock', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->dispatchDebitNotestock($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/sales/warehouse/invoice-stock', function () use ($app) {
    global $objWarehouse, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objWarehouse->invoice_stock($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

?>