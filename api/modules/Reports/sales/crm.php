<?php   

$app->post('/reports/sales/crm/sale-invoice', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->sale_invoice($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});



?>