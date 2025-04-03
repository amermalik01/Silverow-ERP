<?php
$app->post('/communication/migration/import-migration', function () use ($app) {
    global $objmigration, $input;

    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $input_array['migrationName'] = $_REQUEST['migrationName'];
    $input_array['additionalParams'] = $_REQUEST['additionalParams'];

    $result = $objmigration->migrateFile($_FILES, $input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
 
?>