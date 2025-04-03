<?php
//-------------------Predefines-------------------------------------------------
$app->post('/setup/ledger-group/predefines', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    if ($input_array[value] == "BUYING_GROUP") 
    {
        $input_array['crm_buying_group_type'] = 1;
    }
    else if ($input_array[value] == "SEGMENT")
    {
        $input_array['segment_type'] = 1;
    }
    $result = $objSetup->get_predefines($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/get-predefine', function () use ($app) {
    global $objSetup, $input;

   /* $array = array(
        "id" => $input->id
    );*/

    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_predefine_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/get-predefine-by-type', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "type" => $input->type
    );
    $result = $objSetup->get_predefine_by_type($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/ledger-group/add-predefine', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->add_predefine($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/update-predefine', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_predefine($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/delete-predefine', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_predefine($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/add-srmpredefine', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->add_predefine($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/update-srmpredefine', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_predefine($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/delete-srmpredefine', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
   // $input_array['segment_type']=1;
    $result = $objSetup->delete_predefine($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/setup/ledger-group/srmpredefines', function () use ($app) {
    global $objSetup, $input;

    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    if ($input_array['value'] == "BUYING_GROUP") 
    {
        $input_array['crm_buying_group_type'] = 2;
        }
    else if ($input_array['value'] == "SEGMENT")
    {
        $input_array['segment_type'] = 2;
        }
    $result = $objSetup->get_predefines($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/setup/ledger-group/get-srmpredefine', function () use ($app) {
    global $objSetup, $input;

    /* $array = array(
         "id" => $input->id
     );*/

    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_predefine_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/setup/ledger-group/get-predefine-types', function () use ($app) {
    global $objSetup, $input;
    $result = $objSetup->get_predefine_types($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


//-------------------Predefines-------------------------------------------------


//---------------------GL Category-----------------------------------------------


$app->post('/setup/ledger-group/gl-category-list', function () use ($app) {
    global $objSetup, $input;

    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_gl_category_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/get-gl-category-id', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_gl_category_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/get-gl-category-by-type', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "type" => $input->type
    );
    $result = $objSetup->get_gl_category_by_type($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/ledger-group/add-gl-category', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->add_gl_category($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/update-gl-category', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_gl_category($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/delete-gl-category', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_gl_category($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

//------------GL Category--------------------------------------------------------


// VAT Setup Module
//--------------------------------------------------------------------

$app->post('/setup/ledger-group/vat-setup', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objSetup->get_vats($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/get-vat-setup', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_vat_setup_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/get-vat', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_vat_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/ledger-group/add-vat-setup', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->add_vat($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/update-vat-setup', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_vat($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/delete-vat-setup', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_vat($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/get-vat-setup-by-customer', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_vat_setup_by_customer($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/get-vat', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_vat_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/get-all-vatRate', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->getVatRate($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/get-account-head', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_account_head($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

// VAT Rate Setup Module
//--------------------------------------------------------------------

$app->post('/setup/ledger-group/update-VatRate', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->updateVatRate($input_array);
$app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/delete-VatRate', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->deleteVatRate($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

// Supplier Classification Setup Module
//--------------------------------------------------------------------

$app->post('/setup/ledger-group/get-all-classification', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->getAllClassification($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/get-classification', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->getClassificationByID($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/update-Classification', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->updateClassification($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/delete-classification', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->deleteClassification($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

// Posting Group Setup Module
//--------------------------------------------------------------------

$app->post('/setup/ledger-group/get-all-postingGroup', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->getAllPostingGroup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/get-postingGroup', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->getPostingGroupByID($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/update-postingGroup', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->updatePostingGroup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/delete-postingGroup', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->deletePostingGroup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// VAT Posting Group Setup Module
//--------------------------------------------------------------------

$app->post('/setup/ledger-group/get-vat-posting-grp-setup-predata', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->getVATpostingGrpSetupPredata($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/ledger-group/get-all-vat-posting-grp-setup', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->getAllVATpostingGrpSetup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/ledger-group/get-vat-posting-grp-setup', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->getVATpostingGrpSetupByID($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/update-vat-posting-grp-setup', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->updateVATpostingGrpSetup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/delete-vat-posting-grp-setup', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->deleteVATpostingGrpSetup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Inventory Setup Module
//--------------------------------------------------------------------

$app->post('/setup/ledger-group/get-inventory-setup-predata', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->getInventorySetupPredata($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/ledger-group/get-all-inventory-setup', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->getAllInventorySetup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/ledger-group/get-inventory-setup', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->getInventorySetupByID($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/update-inventory-setup', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->updateInventorySetup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/delete-inventory-setup', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->deleteInventorySetup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

// Item Additional Cost Module
//--------------------------------------------------------------------

$app->post('/setup/ledger-group/get-all-item-additional-cost', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->getAllItemAdditionalCost($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/ledger-group/get-item-additional-cost', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->getItemAdditionalCostByID($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/update-item-additional-cost', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->updateItemAdditionalCost($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/delete-item-additional-cost', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->deleteItemAdditionalCost($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Posting Setup Module
//--------------------------------------------------------------------

$app->post('/setup/ledger-group/posting-setup-listing', function () use ($app) {
    global $objSetup, $input;

    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_posting_setup_listing($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/get-customer-dropdown', function () use ($app) {
    global $objSetup, $input;

    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_customer_dropdown($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/get-chart-of-accounts', function () use ($app) {
    global $objSetup, $input;

    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_chart_of_accounts($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/get-product-dropdown', function () use ($app) {
    global $objSetup, $input;

    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_product_dropdown($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/get-posting-setup', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_posting_setup_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/get-ledger-setup-by-type', function () use ($app) {
    global $objSetup, $input;

    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->get_ledger_setup_by_type($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/ledger-group/add-posting-setup', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->add_posting_setup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/update-posting-setup', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_posting_setup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/change-status-posting-setup', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->change_status_posting_setup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/delete-posting-setup', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_posting_setup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/get-ledger-posting', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_ledger_posting($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ledger-group/get-general-ledger-entry', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_general_ledger_entry($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
?>