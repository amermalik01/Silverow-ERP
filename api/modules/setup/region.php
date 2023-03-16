<?php
// Crm region Info Module
//--------------------------------------

$app->post('/setup/region/get-all-region-list', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_all_region_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/region/listings', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->get_region_list($input_array);//get_region_listings
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/region/get-region-byid', function () use ($app) {
    global $objSetup, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_region_data_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/region/add-region', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->add_region($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/region/update-region', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_region($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/region/delete-region', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_update_status('crm_region', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


?>