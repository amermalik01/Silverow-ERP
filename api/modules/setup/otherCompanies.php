<?php
$app->post('/setup/otherCompanies/get-all-list', function () use ($app) {
    global $objSetupOtherCompanies, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetupOtherCompanies->get_all_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/otherCompanies/listings', function () use ($app) {
    global $objSetupOtherCompanies, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetupOtherCompanies->get_otherCompanies_listings($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
 
$app->post('/setup/otherCompanies/get-otherCompanies', function () use ($app) {
    global $objSetupOtherCompanies, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objSetupOtherCompanies->get_data_by_id($input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/otherCompanies/hr-listing', function () use ($app) {
    global $objSetupOtherCompanies, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetupOtherCompanies->get_hr_listing($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

 $app->post('/setup/otherCompanies/add-otherCompanies', function () use ($app) {
    global $objSetupOtherCompanies, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetupOtherCompanies->add_otherCompanies($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

/*
$app->post('/setup/otherCompanies/update-otherCompanies', function () use ($app) {
    global $objSetupOtherCompanies, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetupOtherCompanies->add_otherCompanies($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
}); */


// Alt Contact Module
//--------------------------------------

/* $app->post('/setup/otherCompanies/alt-contacts', function () use ($app) {
    global $objSetupOtherCompanies, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetupOtherCompanies->get_alt_contacts($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/otherCompanies/get-alt-contact', function () use ($app) {
    global $objSetupOtherCompanies, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objSetupOtherCompanies->get_data_by_id('warehouse_alt_contact', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/otherCompanies/add-alt-contact', function () use ($app) {
    global $objSetupOtherCompanies, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetupOtherCompanies->add_alt_contact($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/otherCompanies/update-alt-contact', function () use ($app) {
    global $objSetupOtherCompanies, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetupOtherCompanies->add_alt_contact($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/otherCompanies/get-alt-contact-by-id', function () use ($app) {
    global $objSetupOtherCompanies, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objSetupOtherCompanies->get_data_by_id('warehouse_alt_contact', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/otherCompanies/delete-alt-contact', function () use ($app) {
    global $objSetupOtherCompanies, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetupOtherCompanies->delete_update_status('warehouse_alt_contact', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/otherCompanies/get-alt-contacts-list', function () use ($app) {
    global $objSetupOtherCompanies, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetupOtherCompanies->get_alt_contacts_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
}); */
?>