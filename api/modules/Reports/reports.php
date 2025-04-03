<?php   //Reports Section
$app->post('/reports/module/get-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->getReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/reports/module/aged-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->agedReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/reports/module/customer-listing-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->customerListing($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/get-listing-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->getListing($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/reports/module/vat-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->VATReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/post-vat-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->postVATReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/open-submitted-vat-returns-through-other-means', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->openSubmittedVATReturnsThroughOtherMeans($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/open-submitted-vat-returns-entries', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->openSubmittedVATReturnsEntries($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/customer-data-for-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->customerDataForReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/reports/module/sel-customer-for-statement-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->selCustomerforStatementReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/crm-data-for-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->crmDataForReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/reports/module/supplier-data-for-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->supplierDataForReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/reports/module/item-data-for-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->itemDataForReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/gl-data-for-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->GLDataForReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/reports/module/eu-countries-data-for-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->euCountriesDataForReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/reports/module/saleperson-data-for-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->salepersonDataForReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/reports/module/saleperson-data-from-orders', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->salepersonDataFromOrders($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/reports/module/territory-data-from-orders', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->territoryDataFromOrders($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/buying-group-data-from-orders', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->buyingGroupDataFromOrders($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/reports/module/segment-data-from-orders', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->segmentDataFromOrders($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/warehouse-data-for-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->warehouseDataForReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/get-brands', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->getBrands($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/get-categories', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->getCategories($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/storageLoc-data-for-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->storageLocDataForReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/get-employees-by-dept-id', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->get_employees_by_dept_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/trial-balnc-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->trialBalncReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/unPosted-order-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->unPostedOrderReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/unPosted-order-detail-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->unPostedOrderDetailReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/posted-customer-invoices-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->postedCustomerInvoicesReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/customer-payment-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->customerPaymentReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/stock-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->stockReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/stock-activity-for-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->stockActivityForReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/topCustomers', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->topCustomers($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/customer-depot-sales-analysis-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->customerDepotSalesAnalysisReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/inventoryFilterData', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->inventoryFilterData($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/inventoryList', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->inventoryList($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/employee-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->employeeReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/employee-absence-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->employeeAbsenceReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

// Employee List
//--------------------------------------

$app->post('/reports/module/employee-list', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->employeeList($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/employee-list-without-admin', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->employeeListWithoutAdmin($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/department-list', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->departmentList($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/remittance-advice', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->getRemittanceAdviceData($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/remittance-advice-email', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->remittanceAdviceEmail($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/salesperson-commission-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->salespersonCommissionReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/salesperson-system-login-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->salespersonSystemLoginReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/inland-distribution-analysis-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->inlandDistributionAnalysisReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/haulier-accrual-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->haulierAccrualReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/reports/module/customer-rebate-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->customerRebateReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/crm-rebate-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->crmRebateReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/supplier-rebate-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->supplierRebateReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/customer-with-no-activity-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->customerWithNoActivityReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/access-by-transaction-numbers-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->accessByTransNumReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/supplier-statement-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->supplierStatementReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/customer-statement-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->customerStatementReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/customer-statement-email', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->customerStatementEmail($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/salesperson-activity-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->salepersonActivityReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/sales-figure-report-customer', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->sales_figure_report_customer($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/item-sales-marginal-analysis', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->itemSalesMarginalAnalysis($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/sales-figure-by-GL', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->salesFigureByGL($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/get-ec-sales-list', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->get_ec_sales_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/reports/module/get-item-purchases-by-supplier', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->get_item_purchases_by_supplier($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/add-to-fav-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->addToFavReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/reports/module/get-fav-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->getFavReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/reports/module/profit-loss-statement', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->profitLossStatement($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/reports/module/balance-sheet', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->balanceSheetReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/supplier-activity-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->supplierActivityReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/open-sale-orders-detail', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->openSaleOrdersDetail($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/customer-activity-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->customerActivityReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/customer-price-list-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->customerPriceListReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/customer-price-list-report-portal', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->customerPriceListReportPortal($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});



$app->post('/reports/module/customer-avg-payment-days', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->customer_avg_payment_days($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/supplier-avg-payment-days', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->supplier_avg_payment_days($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/customer-reminders', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->customer_reminders($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/customer-reminders-email', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->customer_reminders_email($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/sales-forecast', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->sales_forecast($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/customer-item-prices-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->customerItemPriceReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/inventory-statistics-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->inventoryStatisticsReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/employee-benefits-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->get_employee_benefits($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/get-order-stages', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->get_order_stages($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/reports/module/sale-orders-for-report', function () use ($app) {
    global $objReportCrm, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objReportCrm->get_sale_orders($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


?>