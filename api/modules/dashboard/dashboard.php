<?php
$app->post('/dashboard/get-user-widgets', function () use ($app) {
    global $objDash, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objDash->getUserWidgets($input_array);
    $app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/dashboard/get-version-data', function () use ($app) {
    global $objDash, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objDash->getVersionData($input_array);
    $app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/dashboard/update-version-data', function () use ($app) {
    global $objDash, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objDash->updateVersionData($input_array);
    $app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/dashboard/update-widget-active', function () use ($app) {
    global $objDash, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objDash->updateWidgetActive($input_array);
    $app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/dashboard/save-widget-pos', function () use ($app) {
    global $objDash, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objDash->saveWidgetPos($input_array);
    $app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/dashboard/update-widget-contents', function () use ($app) {
    global $objDash, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objDash->updateWidgetContents($input_array);
    $app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/dashboard/open-widget-options-modal', function () use ($app) {
    global $objDash, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objDash->openWidgetOptionsModal($input_array);
    $app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

<<<<<<< HEAD
$app->post('/dashboard/get-widget-option-data-for-label', function () use ($app) {
=======
/* $app->post('/dashboard/get-widget-option-data-for-label', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    global $objDash, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objDash->getWidgetOptionsForLabel($input_array);
    $app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


$app->post('/dashboard/check-user-widgets', function () use ($app) {
    global $objDash, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objDash->checkUserWidgets($input_array);
    $app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/dashboard/get-widget-roles-for-setup', function () use ($app) {
    global $objDash, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objDash->getRolesForSetup($input_array);
    $app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/dashboard/get-report-roles-for-setup', function () use ($app) {
    global $objDash, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objDash->getReportRolesForSetup($input_array);
    $app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/dashboard/save-widget-role-in-setup', function () use ($app) {
    global $objDash, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objDash->saveWidgetRoles($input_array);
    $app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/dashboard/check-user-widgets-roles', function () use ($app) {
    global $objDash, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objDash->checkUserWidgetsRoles($input_array);
    $app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

// latest released version checking
$app->post('/dashboard/check-released-version', function () use ($app) {
    global $objDash, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objDash->check_released_version($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
<<<<<<< HEAD
?>
=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
