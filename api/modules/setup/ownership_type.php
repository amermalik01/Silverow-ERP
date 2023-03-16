<?php
// Crm Ownership Type Info Module
//--------------------------------------

$app->post('/setup/ownership_type/get-all-ownership-list', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_all_ownership_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/ownership_type/listings', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->get_ownership_listings($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ownership_type/get-ownership-byid', function () use ($app) {
    global $objSetup, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_ownership_data_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/ownership_type/add-ownership', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->add_ownership($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ownership_type/update-ownership', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_ownership($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/ownership_type/delete-ownership', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_ownership('crm_owner', 'status', $input_array['id']);
    //$result = $objSetup->delete_update_status('crm_owner', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


?>