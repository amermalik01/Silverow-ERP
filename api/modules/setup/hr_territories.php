<?php
// Crm region Info Module
//--------------------------------------

// $app->post('/setup/region/get-all-region-list', function () use ($app) {
//     global $objSetup, $input;
//     $input_array = array();
//     foreach ($input as $key => $val) {
//         $input_array[$key] = $val;
//     }
//     $result = $objSetup->get_all_region_list($input_array);
//     $app->response->setStatus(200);
//     $app->response()->headers->set('Content-Type', 'application/json');
//     echo json_encode($result);
// });


$app->post('/setup/territories_hr/listings', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->get_hr_territories_list($input_array);//get_region_listings
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/territories_hr/get-territory-byid', function () use ($app) {
    global $objSetup, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_hr_territory_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/territories_hr/add-hr-territory', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->add_hr_territory($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/territories_hr/update-hr-territory', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_hr_territory($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/territories_hr/delete-territory', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_update_status('hr_territories', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


?>