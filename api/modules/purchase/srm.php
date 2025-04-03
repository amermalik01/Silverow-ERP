<?php
// echo "here";exit;
// General Tab/ Main Crm Info Module
//--------------------------------------

$app->post('/purchase/srm/srm/listings', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_srm_listings($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/get-srm', function () use ($app) {
    global $objSrm, $input;
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_srm_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/get-unique-id', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_unique_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/add-srm', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->add_srm($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/update-srm', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->add_srm($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/delete-srm', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }


    /* $result = $objSrm->delete_update('srm_alt_contact', 'status', $input_array['id']);
    $result = $objSrm->delete_update('srm_alt_depot', 'status', $input_array['id']);
    $result = $objSrm->delete_update('srm_area_selected', 'status', $input_array['id']);
    $result = $objSrm->delete_update('srm_finance', 'status', $input_array['id']);
    $result = $objSrm->delete_update('srm_agent_area_list', 'status', $input_array['id']);
    $result = $objSrm->delete_update('srm_agent_area', 'status', $input_array['id']);
    $result = $objSrm->delete_update('srm_price_offer', 'status', $input_array['id']);
    $result = $objSrm->delete_update('srm_price_offer_listing', 'status', $input_array['id']);
    $result = $objSrm->delete_update('srm_rebate', 'status', $input_array['id']);
    $result = $objSrm->delete_update('srm_rebate_volume', 'status', $input_array['id']);
    $result = $objSrm->delete_update('srm_revenue_volume', 'status', $input_array['id']);
    $result = $objSrm->delete_update('srm_volume_discount', 'status', $input_array['id']);
 */
    //$result = $objSrm->delete_update_status('srm', 'type', $input_array['id']);
    $result = $objSrm->delete_srm($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/convert', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->convert($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/get-srm-code', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_srm_code($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/srm/srm/update-finance', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->update_finance($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Alt Contact Module
//--------------------------------------

$app->post('/purchase/srm/srm/get-list-contact-location', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_contact_location_dropdown($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/alt-contacts', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    // echo 'here';
    $result = $objSrm->get_alt_contacts($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/get-alt-contact', function () use ($app) {
    global $objSrm, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objSrm->get_data_by_id('srm_alt_contact', $input_array['id']);

    //$result = $objSrm->get_alt_contact_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/srm/srm/add-alt-contact', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->add_alt_contact($input_array, 0);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/load_srm_pre_data', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->load_srm_nested_data($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/srm/srm/update-alt-contact', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->update_alt_contact($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/get-alt-contact-by-id', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
  //  $result = $objSrm->get_data_by_id('srm_alt_contact', $input_array['id']);

    $result = $objSrm->get_alt_contact_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/delete-alt-contact', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->delete_update_status('alt_contact', 'status', $input_array['id']);
    //$result = $objSrm->delete_alt_contact($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/get-alt-contacts-list', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_alt_contacts_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

//add location and contact from general tab
$app->post('/purchase/srm/srm/add-list-contact-location-general', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->add_contact_location_dropdown_general($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/add-list-contact-location', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->add_contact_location_dropdown($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
// Alt Depot Module
//--------------------------------------

$app->post('/purchase/srm/srm/alt-depots', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSrm->get_alt_depots($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/alt-delivery-depots', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSrm->get_alt_deliverDepots($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/get-alt-depot', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    //$result = $objSrm->get_data_by_id('srm_alt_depot', $input_array['id']);
    $result = $objSrm->get_alt_depot_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/srm/srm/add-alt-depot', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSrm->add_alt_depot($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
/* $app->post('/purchase/srm/srm/add-location-time', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->add_location_time($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
}); */

/* $app->post('/purchase/srm/srm/get-list-location-time', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_list_location_time($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
}); */

/* $app->post('/purchase/srm/srm/delete-location-time', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSrm->delete_update_status('crm_delivery_time', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
}); */

$app->post('/purchase/srm/srm/update-alt-depot', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->update_alt_depot($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/delete-alt-depot', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->delete_update_status('alt_depot', 'status', $input_array['id']);
    //$result = $objSrm->delete_alt_depot($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});



// price module predata api for add form
$app->post('/purchase/srm/srm/price-form-predata', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->price_form_predata($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// CRM Price Offer Listings
//--------------------------------------------


/* $app->post('/purchase/srm/srm/add-srm-price-info', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->add_srm_price_info($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/update-srm-price-info', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->update_srm_price_info($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/srm/srm/update-price-volume-with-NewPrice', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->update_price_volume_with_NewPrice($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/get-cust-price-list-volume-listing', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_sup_price_list_volume_listing($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/get-srm-price-info', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_srm_price_info_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/add-srm-offer-volume', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->add_srm_offer_volume($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/get-srm-offer-volume-by-type', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_srm_offer_volume_by_type($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
 */

/* $app->post('/purchase/srm/srm/add-srm-price-offer-volume', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->add_srm_price_offer_volume($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/update-srm-price-offer-volume', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->update_srm_price_offer_volume($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/volume-discount-by-id', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->volume_discount_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
}); */


/* $app->post('/purchase/srm/srm/srm-price-info', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_srm_price_info($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/get-sup-price-offer-volume-listing', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_sup_price_offer_volume_listing($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/srm-price-offer-volume-list', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_price_list_in_volume($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
}); */


/* $app->post('/purchase/srm/srm/srm-price-offer-listings', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_price_offer_listings($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/get-srm-price-offer-by-id', function () use ($app) {
    global $objSrm, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objSrm->get_data_by_id('srm_price_offer_listing', $input_array['id']);
    //$result = $objSrm->get_srm_price_offer_listing_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/srm/srm/add-srm-price-offer-listing', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->add_srm_price_offer_listing($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/srm/srm/delete-srm-price-offer-listing', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->delete_update_status('srm_price_offer_listing', 'status', $input_array['id']);
    //$result = $objSrm->delete_srm_price_offer_listing($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/srm/srm/get-method-list', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_method($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/add-method', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSrm->add_method($input);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
}); */


$app->post('/purchase/srm/srm/get-shiping-list', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_shipping_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/add-shiping-list', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSrm->add_shipping($input);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


//----------SRM shipping  ----------------------------


$app->post('/purchase/srm/srm/srm-shipping', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_shipping($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/srm-areas', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_areas($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/srm-countries', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_countries($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/srm-regions', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_regions($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/srm-counties', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_counties($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/srm-areas1', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_areas1($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/srm-add-sale-area', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->add_sale_area($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/srm-sale-areas', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_sale_areas($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/srm-delete-sale-area', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->delete_sale_area($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/srm-add-sale-areas', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->add_sale_areas($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/get-srm-shipping-by-id', function () use ($app) {
    global $objSrm, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objSrm->get_data_by_id('srm_agent_area_list', $input_array['id']);
    //$result = $objSrm->get_srm_shipping_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/srm-sale-countries', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_sale_countries($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/get-warehouses-and-company-addresses', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_warehouses_and_company_addresses($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/get-warehouses-for-target-price', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_warehouses_target_price($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

/* $app->post('/purchase/srm/srm/get-srm-price-volume-history', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_srm_price_volume_history($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/get-srm-price-history', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_srm_price_history($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
}); */


$app->post('/purchase/srm/srm/get-covered-areas', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_covered_areas($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/srm-sale-regions', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_sale_regions($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/srm-sale-counties', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_sale_counties($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/srm-saleareas', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_saleAreas($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/srm/srm/add-customer', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSrm->add_cusomer($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/srm/srm/add-srm-shipping', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSrm->add_srm_shipping($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/delete-srm-shipping', function () use ($app) {
    global $objSrm, $input;
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


    $result = $objSrm->delete_update_status('srm_agent_area_list', 'status', $input_array['id']);
    //$result = $objSrm->delete_srm_shipping($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


//----------SRM Area  ----------------------------

$app->post('/purchase/srm/srm/get-coverage-all-areas', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_coverage_all_areas($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/srm/srm/get-selected-area', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSrm->get_slected_areas($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/get-haulier-database-listing', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->getHaulierDatabaseListing($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

//srm/srm-area
$app->post('/purchase/srm/srm/get-haulier-listing', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->getHaulierListing($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
//srm/get-srm-area-by-id
$app->post('/purchase/srm/srm/get-haulier-listing-by-id', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->getHaulierListingById($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

//srm/add-srm-area
$app->post('/purchase/srm/srm/add-new-haulier', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSrm->addNewHaulier($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/get-covered-country', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSrm->get_covered_country($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
/* $app->post('/purchase/srm/srm/search-covered-areas', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSrm->search_covered_areas($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
}); */

$app->post('/purchase/srm/srm/add-new-loc', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSrm->saveNewLoc($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/get-haulier-loc', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSrm->getHaulierLoc($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

//srm/delete-srm-area
//delete_srm_area
$app->post('/purchase/srm/srm/delete-haulier', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    // $result = $objSrm->delete_update_status('srm_area_selected', 'status', $input_array['id']);
    
    $result = $objSrm->deleteHaulier($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// CRM Document Module
//--------------------------------------

$app->post('/purchase/srm/srm/srm-documents', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_documents($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/get-srm-document-by-id', function () use ($app) {
    global $objSrm, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objSrm->get_data_by_id('document', $input_array['id']);
    //$result = $objSrm->get_srm_document_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/srm/srm/add-srm-document', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSrm->add_srm_document($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/update-srm-document', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->update_srm_document($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/delete-srm-document', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->delete_update_status('document', 'status', $input_array['id']);
    //$result = $objSrm->delete_srm_document($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/folders', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSrm->get_folders($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/add-folder', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSrm->add_folder($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Price Offer Volume Module
//--------------------------------------

/* $app->post('/purchase/srm/srm/price-offer-volumes', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_price_offer_volumes($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/get-price-offer-volume', function () use ($app) {
    global $objSrm, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objSrm->get_data_by_id('srm_volume_discount', $input_array['id']);
    //$result = $objSrm->get_price_offer_volume_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/srm/srm/add-price-offer-volume', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    // print_r($input_array); exit;
    $result = $objSrm->add_price_offer_volume($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/update-price-offer-volume', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->update_price_offer_volume($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/get-price-offer-volume-by-id', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_data_by_id('srm_volume_discount', $input_array['id']);
    //$result = $objSrm->get_price_offer_volume_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/delete-price-offer-volume', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->delete_update_status('srm_volume_discount', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
}); */

/* $app->post('/purchase/srm/srm/get-price-offer-volume-by-type', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_price_offer_volume_by_type($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
}); */


///////////////// for volume discount ///////////////

$app->post('/purchase/srm/srm/supplier_list', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSrm->get_supplier_list_product_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

});

$app->post('/purchase/srm/srm/supplier_by_id', function () use ($app) {
    global $objSrm, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objSrm->get_purchase_volume_discount_by_id($input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

});

$app->post('/purchase/srm/srm/delete_sp_id', function () use ($app) {
    global $objSrm, $input;
    $input_array = array(
        "id" => $input->id
    );

    $result = $objSrm->delete_update_status('srm_volume_discount', 'status', $input_array['id']);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

});

$app->post('/purchase/srm/srm/update_product_values', function () use ($app) {
    global $objSrm, $input;

    $result = $objSrm->update_product_values($input);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Rebate Volume Module
//--------------------------------------

$app->post('/purchase/srm/srm/rebate-volumes', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_rebate_volumes($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/get-rebate-volume', function () use ($app) {
    global $objSrm, $input;
    $input_array = array(
        "id" => $input->id
    );

    $result = $objSrm->get_data_by_id('srm_rebate_volume', $input_array['id']);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/srm/srm/add-rebate-volume', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSrm->add_rebate_volume($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/update-rebate-volume', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->add_rebate_volume($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/get-rebate-volume-by-id', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_data_by_id('srm_rebate_volume', $input_array['id']);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/delete-rebate-volume', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSrm->delete_update_status('srm_rebate_volume', 'type', 0);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/get-rebate-volume-by-type', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_rebate_volume_by_type($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


//-------SRM Rebate -------------------------------------
$app->post('/purchase/srm/srm/srm-rebate-listings', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_rebate_listings($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/get-srm-rebate', function () use ($app) {
    global $objSrm, $input;
    $input_array = array(
        "id" => $input->id
    );
    // $result = $objSrm->get_data_by_id('srm_rebate',$input_array['id']);
    $result = $objSrm->get_srm_rebate_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/srm/srm/add-srm-rebate', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->add_srm_rebate($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/update-srm-rebate', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->update_srm_rebate($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/delete-srm-rebate', function () use ($app) {
    global $objSrm, $input;

    $input_array = array(
        "id" => $input->id
    );
    $result = $objSrm->delete_update_status('srm_rebate', 'type', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/get-rebate-items', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_rebate_items($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/get-rebate-categories', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_rebate_categories($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/get-supplier-rebate-history', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_supplier_rebate_history($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/add-unit-record-popup', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->add_unit_record_popup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/get-unit-record-popup', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_unit_record_popup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/get-unit-setup-list-category', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_unit_setup_list_category($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/get-sale-offer-volume-by-type', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_sale_offer_volume_by_type($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/add-sale-offer-volume', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->add_sale_offer_volume($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/srm/srm/srm-history', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_srm_history($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/add-status-log', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->add_status_log($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/srm/srm/get-all-pref-method-of-comm', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_all_pref_method_of_comm($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/add-pref-method-of-comm', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->add_pref_method_of_comm($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/srm/srm/get-sale-offer-rev-by-type', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_sale_offer_rev_by_type($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/srm/srm/add-sale-offer-rev', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->add_sale_offer_rev($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/srm/srm/get-social-media', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_social_media($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/add-social-media', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->add_social_media($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/srm/srm/get-srm-social-media', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_srm_social_media($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/add-srm-social-media', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->add_srm_social_media($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/delete-srm-social-media', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->delete_update_status('srm_social_media', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/srm/srm/get-alt-contact-social-media', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->get_alt_contact_social_media($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/add-alt-contact-social-media', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->add_alt_contact_social_media($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/delete-alt-contact-social-media', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->delete_update_status('srm_alt_contact_social_media', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/duplication-chk-crm', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->duplicationChkSRM($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/price-list-email', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->priceListEmail($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/srm/srm/price-list-PDF-download', function () use ($app) {
    global $objSrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSrm->priceListPDFDownload($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

?>