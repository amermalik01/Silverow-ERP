<?php
############	Start: Category Section ############
$app->post('/stock/categories', function () use ($app) {
    global $objStock, $input;
    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objStock->get_categories($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/categories/get-category', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
   // $result = $objStock->get_data_by_id('category', $input_array['id']);
    $result = $objStock->getCategoryByID($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/categories/get-all-categories', function () use ($app) {
    global $objStock, $input;
    $array = array(
        "id" => $input->id
    );
    $result = $objStock->get_all_categories($array, 0);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/categories/add-category', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->add_category($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/stock/categories/update-category', function () use ($app) {
    global $objStock, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->update_category($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/categories/delete-category', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    // $result = $objStock->delete_update_status('category', 'status', $input_array['id']);
    $result = $objStock->delete_category($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/categories/status-category', function () use ($app) {
    global $objStock, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->status_category($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
############	End: Category Section ##############


############	Start: category Warehouse Allocation Costs Section ##############

$app->post('/stock/categories/warehouse-allocation-cost-category-by-id', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_data_by_id('categories_warehouse_cost', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/categories/warehouse-allocation-cost-category', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_category_warehouse_allocation_cost($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/categories/add-warehouse-allocation-cost-category', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->add_warehouse_allocation_cost_category($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/stock/categories/update-warehouse-allocation-cost-category', function () use ($app) {
    global $objStock, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->add_warehouse_allocation_cost_category($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/categories/delete-warehouse-allocation-cost-category', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->delete_update_status('categories_warehouse_cost', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

############	End: Warehouse Allocation Costs Section ##############
?>