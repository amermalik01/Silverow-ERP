<?php
// General Tab/ Main Crm Info Module
//--------------------------------------

$app->post('/purchase/supplier/supplier/listings', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSupplier->get_supplier_listings($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/supplier/supplier/getSupplierForGeneralLedger', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSupplier->get_supplier_for_general_ledger($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/supplier/supplier/supplierListings', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSupplier->getSupplierCompleteListing($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/supplier/supplier/supplierInvListings', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSupplier->getSupplierInvListing($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/supplier/supplier/get-supplier', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objSupplier->get_data_by_id('srm', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/supplier/supplier/get-unique-id', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->get_unique_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/supplier/supplier/check_for_module_code', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->check_for_module_code($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/supplier/supplier/add-supplier', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->add_supplier($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/supplier/supplier/update-supplier', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->add_supplier($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/supplier/supplier/delete-supplier', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    /*
    $result = $objSupplier->delete_update('srm_alt_contact', 'status', $input_array['id']);
    $result = $objSupplier->delete_update('srm_alt_depot', 'status', $input_array['id']);
    $result = $objSupplier->delete_update('srm_area_selected', 'status', $input_array['id']);
    $result = $objSupplier->delete_update('srm_finance', 'status', $input_array['id']);
    $result = $objSupplier->delete_update('srm_agent_area_list', 'status', $input_array['id']);
    $result = $objSupplier->delete_update('srm_agent_area', 'status', $input_array['id']);
    $result = $objSupplier->delete_update('srm_price_offer', 'status', $input_array['id']);
    $result = $objSupplier->delete_update('srm_price_offer_listing', 'status', $input_array['id']);
    $result = $objSupplier->delete_update('srm_rebate', 'status', $input_array['id']);
    $result = $objSupplier->delete_update('srm_rebate_volume', 'status', $input_array['id']);
    $result = $objSupplier->delete_update('srm_revenue_volume', 'status', $input_array['id']);
    $result = $objSupplier->delete_update('srm_volume_discount', 'status', $input_array['id']);
    */

    //$result = $objSupplier->delete_update_status('srm','type',$input_array['id']);
    $result = $objSupplier->delete_supplier($input_array);


    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

<<<<<<< HEAD
$app->post('/purchase/supplier/supplier/convert', function () use ($app) {
=======
/* $app->post('/purchase/supplier/supplier/convert', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->convert($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

$app->post('/purchase/supplier/supplier/get-supplier-code', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->get_supplier_code($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/supplier/supplier/get-supplier-finance', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    // $result = $objSupplier->get_finance_by_id('srm_finance', $input_array['supplier_id']);
    $result = $objSupplier->getSupplierFinance($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/supplier/supplier/update-finance', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->update_finance($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Alt Contact Module
//--------------------------------------

<<<<<<< HEAD
$app->post('/purchase/supplier/supplier/alt-contacts', function () use ($app) {
=======
/* $app->post('/purchase/supplier/supplier/alt-contacts', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    // echo 'here';
    $result = $objSupplier->get_alt_contacts($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

$app->post('/purchase/supplier/supplier/get-alt-contact', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objSupplier->get_data_by_id('srm_alt_contact', $input_array['id']);
    //$result = $objSupplier->get_alt_contact_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


<<<<<<< HEAD
$app->post('/purchase/supplier/supplier/add-alt-contact', function () use ($app) {
=======
/* $app->post('/purchase/supplier/supplier/add-alt-contact', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    // print_r($input_array); exit;
    $result = $objSupplier->add_alt_contact($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/supplier/supplier/update-alt-contact', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->update_alt_contact($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

$app->post('/purchase/supplier/supplier/get-alt-contact-by-id', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->get_data_by_id('srm_alt_contact', $input_array['id']);
//	$result = $objSupplier->get_alt_contact_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

<<<<<<< HEAD
$app->post('/purchase/supplier/supplier/delete-alt-contact', function () use ($app) {
=======
/* $app->post('/purchase/supplier/supplier/delete-alt-contact', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->delete_update_status('srm_alt_contact', 'status', $input_array['id']);

    $result = $objSupplier->delete_alt_contact($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/supplier/supplier/get-alt-contacts-list', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->get_alt_contacts_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


// Alt Depot Module
//--------------------------------------

<<<<<<< HEAD
$app->post('/purchase/supplier/supplier/alt-depots', function () use ($app) {
=======
/* $app->post('/purchase/supplier/supplier/alt-depots', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSupplier->get_alt_depots($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

$app->post('/purchase/supplier/supplier/get-alt-depot-by-id', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objSupplier->get_data_by_id('srm_alt_depot', $input_array['id']);
    //$result = $objSupplier->get_alt_depot_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


<<<<<<< HEAD
$app->post('/purchase/supplier/supplier/add-alt-depot', function () use ($app) {
=======
/* $app->post('/purchase/supplier/supplier/add-alt-depot', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    global $objSupplier, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSupplier->add_alt_depot($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/supplier/supplier/update-alt-depot', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->update_alt_depot($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

$app->post('/purchase/supplier/supplier/delete-alt-depot', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->delete_update_status('srm_alt_depot', 'status', $input_array['id']);

    //$result = $objSupplier->delete_alt_depot($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// CRM Price Offer Listings
//--------------------------------------------
$app->post('/purchase/supplier/supplier/srm-price-offer-listings', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->get_price_offer_listings($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/supplier/supplier/get-supplier-price-offer-by-id', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objSupplier->get_data_by_id('srm_price_offer_listing', $input_array['id']);
    //$result = $objSupplier->get_supplier_price_offer_listing_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/supplier/supplier/add-supplier-price-offer-listing', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->add_supplier_price_offer_listing($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/supplier/supplier/delete-supplier-price-offer-listing', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->delete_update_status('srm_price_offer_listing', 'status', $input_array['id']);

    //$result = $objSupplier->delete_supplier_price_offer_listing($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/supplier/supplier/get-method-list', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->get_method($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/supplier/supplier/add-method', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSupplier->add_method($input);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/supplier/supplier/get-shiping-list', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->get_shipping_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/purchase/supplier/supplier/add-shiping-list', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSupplier->add_shipping($input);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// CRM shipping Module
//--------------------------------------


$app->post('/purchase/supplier/supplier/get-coverage-all-areas', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->get_coverage_all_areas($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/supplier/supplier/srm-shipping', function () use ($app) {
    global $objSupplier, $input;
    //$input_array = array();
    /* foreach($input as $key => $val){
      $input_array[$key] = $val;
     }*/
    $input_array = array(
        "id" => $input->id
    );
    $result = $objSupplier->get_shipping($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/supplier/supplier/get-supplier-shipping-by-id', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objSupplier->get_data_by_id('shipping_agent_sale', $input_array['id']);

//	$result = $objSupplier->get_supplier_shipping_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/supplier/supplier/add-customer', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSupplier->add_cusomer($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/supplier/supplier/add-supplier-shipping', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSupplier->add_supplier_shipping($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/purchase/supplier/supplier/delete-supplier-shipping', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->delete_update_status('shipping_agent_sale', 'status', $input_array['id']);

    //$result = $objSupplier->delete_supplier_shipping($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// CRM Document Module
//--------------------------------------

<<<<<<< HEAD
$app->post('/purchase/supplier/supplier/srm-documents', function () use ($app) {
=======
/* $app->post('/purchase/supplier/supplier/srm-documents', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->get_documents($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

$app->post('/purchase/supplier/supplier/get-supplier-document-by-id', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objSupplier->get_data_by_id('document', $input_array['id']);

    //$result = $objSupplier->get_supplier_document_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


<<<<<<< HEAD
$app->post('/purchase/supplier/supplier/add-supplier-document', function () use ($app) {
=======
/* $app->post('/purchase/supplier/supplier/add-supplier-document', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    global $objSupplier, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSupplier->add_supplier_document($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/supplier/supplier/update-supplier-document', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->update_supplier_document($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

$app->post('/purchase/supplier/supplier/delete-supplier-document', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->delete_update_status('document', 'status', $input_array['id']);

    //$result = $objSupplier->delete_supplier_document($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

<<<<<<< HEAD
$app->post('/purchase/supplier/supplier/folders', function () use ($app) {
=======
/* $app->post('/purchase/supplier/supplier/folders', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    global $objSupplier, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSupplier->get_folders($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/supplier/supplier/add-folder', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSupplier->add_folder($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


// Price Offer Volume Module
//--------------------------------------

$app->post('/purchase/supplier/supplier/price-offer-volumes', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->get_price_offer_volumes($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/supplier/supplier/get-price-offer-volume', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objSupplier->get_data_by_id('srm_volume_discount', $input_array['id']);

    //$result = $objSupplier->get_price_offer_volume_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


<<<<<<< HEAD
$app->post('/purchase/supplier/supplier/add-price-offer-volume', function () use ($app) {
=======
/* $app->post('/purchase/supplier/supplier/add-price-offer-volume', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    // print_r($input_array); exit;
    $result = $objSupplier->add_price_offer_volume($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/supplier/supplier/update-price-offer-volume', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->update_price_offer_volume($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/purchase/supplier/supplier/get-price-offer-volume-by-id', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->get_price_offer_volume_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

$app->post('/purchase/supplier/supplier/delete-price-offer-volume', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->delete_update_status('srm_volume_discount', 'status', $input_array['id']);

    //$result = $objSupplier->delete_price_offer_volume($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

<<<<<<< HEAD
$app->post('/purchase/supplier/supplier/get-price-offer-volume-by-type', function () use ($app) {
=======
/* $app->post('/purchase/supplier/supplier/get-price-offer-volume-by-type', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSupplier->get_price_offer_volume_by_type($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

///////////////// for volume discount ///////////////

$app->post('/purchase/supplier/supplier/supplier_list', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSupplier->get_supplier_list_product_id($input_array);
    //print_r($result);exit;
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

});

$app->post('/purchase/supplier/supplier/supplier_by_id', function () use ($app) {
    global $objSupplier, $input;
    $array = array(
        "id" => $input->id
    );

    $result = $objSupplier->supplier_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

});

$app->post('/purchase/supplier/supplier/delete_sp_id', function () use ($app) {
    global $objSupplier, $input;
    $input_array = array(
        "id" => $input->id
    );

    $result = $objSupplier->delete_update_status('srm_volume_discount', 'status', $input_array['id']);


    //$result = $objSupplier->delete_sp_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

});

$app->post('/purchase/supplier/supplier/update_product_values', function () use ($app) {
    global $objSupplier, $input;

    $result = $objSupplier->update_product_value($input);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
<<<<<<< HEAD


?>

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
