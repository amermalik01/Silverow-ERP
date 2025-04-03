<?php
// Crm Credit Rating Info Module
//--------------------------------------

$app->post('/setup/credit-rating/get-all-credit_rating-list', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_all_credit_rating_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/credit-rating/listings', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->get_credit_rating_listings($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/credit-rating/get-credit_rating-byid', function () use ($app) {
    global $objSetup, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_credit_rating_data_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/credit-rating/add-credit_rating', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->add_credit_rating($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/credit-rating/update-credit_rating', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_credit_rating($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/credit-rating/delete-credit_rating', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_update_status('crm_credit_rating', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


?>