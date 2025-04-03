<?php

require 'Slim/Slim.php';
require_once 'classes/Config.Inc.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

#Getting Request
$request = $app->request();
$body = $request->getBody();
$input = json_decode($body);

$user_info = $objAuth->authentocate($input->token);
require_once(SERVER_PATH . "/classes/Setup.php");
$objSetup = new Setup($user_info);

$path = $app->request()->getPathInfo();

/*if (strpos($path, "/general")  !== false) {
	require_once(SERVER_PATH.'/modules/setup/general.php');
}*/


//-----------------------------------------------//
//					GENERAL SECTION             //
//-----------------------------------------------//


// Company Module
//--------------------------------------------------------------------

$app->post('/setup/companies', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objSetup->get_companies($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/get-company', function () use ($app) {
    global $objSetup, $input;
    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_company_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/add-company', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->add_company($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/update-company', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_company($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/delete-company', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_company($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Company Info Module
//--------------------------------------------------------------------

$app->post('/setup/get-company-info', function () use ($app) {
    global $objSetup, $input;
    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_company_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/update-company-info', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_company($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Modules Codes Module
//--------------------------------------------------------------------

$app->post('/setup/modules-codes', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objSetup->get_modules_codes($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/get-module-code', function () use ($app) {
    global $objSetup, $input;
    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_module_code_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/add-module-code', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->add_module_code($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/update-module-code', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_module_code($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/delete-module-code', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_module_code($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

// Bank Account Module
//--------------------------------------------------------------------

$app->post('/setup/bank-accounts', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );

    $result = $objSetup->get_bank_accounts($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/get-bank-account', function () use ($app) {
    global $objSetup, $input;
    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_bank_account_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/add-bank-account', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->add_bank_account($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/update-bank-account', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_bank_account($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/delete-bank-account', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_bank_account($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


//-----------------------------------------------//
//					SUPPLIER SECTION             //
//-----------------------------------------------//

// Coverage Area Module
//--------------------------------------------------------------------

$app->post('/setup/coverage-areas', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objSetup->get_coverage_areas($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/get-coverage-area', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_coverage_area_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/add-coverage-area', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->add_coverage_area($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/update-coverage-area', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_coverage_area($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/delete-coverage-area', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_coverage_area($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

// Shipping Measurment Module
//--------------------------------------------------------------------

$app->post('/setup/shipping-measurments', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objSetup->get_shipping_measurments($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/get-shipping-measurment', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_shipping_measurment_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/add-shipping-measurment', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->add_shipping_measurment($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/update-shipping-measurment', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_shipping_measurment($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/delete-shipping-measurment', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_shipping_measurment($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

// Coverage Module
//--------------------------------------------------------------------

$app->post('/setup/coverage-areas', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objSetup->get_coverage_areas($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/get-coverage-area', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_coverage_area_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/add-coverage-area', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->add_coverage_area($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/update-coverage-area', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_coverage_area($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/delete-coverage-area', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_coverage_area($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

//-----------------------------------------------//
//					LEDGER GROUP SECTION             //
//-----------------------------------------------//

// Predefines (Constants) Module
//--------------------------------------------------------------------

$app->post('/setup/predefines', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objSetup->get_predefines($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/get-predefine', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_predefine_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/add-predefine', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->add_predefine($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/update-predefine', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_predefine($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/delete-predefine', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_predefine($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// VAT Setup Module
//--------------------------------------------------------------------

$app->post('/setup/vats', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objSetup->get_vats($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/get-vat', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_vat_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/add-vat', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->add_vat($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/update-vat', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_vat($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/delete-vat', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_vat($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Posting Setup Module
//--------------------------------------------------------------------

$app->post('/setup/posting-setup-listing', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objSetup->get_posting_setup_listing($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/get-posting-setup', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_posting_setup_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/add-posting-setup', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->add_posting_setup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/update-posting-setup', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_posting_setup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/change-status-posting-setup', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->change_status_posting_setup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/delete-posting-setup', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_posting_setup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

//------------------------------------------------//
//				SALES & CRM SECTION 			  //
//------------------------------------------------//

// Shipment Methods Module
//--------------------------------------------------------------------

$app->post('/setup/shipment-methods', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objSetup->get_shipment_methods($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/get-shipment-method', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_shipment_method_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/add-shipment-method', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->add_shipment_method($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/update-shipment-method', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_shipment_method($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/delete-shipment-method', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_shipment_method($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Payment Methods Module
//--------------------------------------------------------------------

$app->post('/setup/payment-methods', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objSetup->get_payment_methods($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/get-payment-method', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_payment_method_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/add-payment-method', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->add_payment_method($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/update-payment-method', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_payment_method($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/delete-payment-method', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_payment_method($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Payment Terms Module
//--------------------------------------------------------------------

$app->post('/setup/payment-terms', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objSetup->get_payment_terms($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/get-payment-term', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_payment_term_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/add-payment-term', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->add_payment_term($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/update-payment-term', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_payment_term($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/delete-payment-term', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_payment_term($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

// Finance Charges Module
//--------------------------------------------------------------------

$app->post('/setup/finance-charges', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objSetup->get_finance_charges($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/get-finance-charges', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_finance_charges_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/add-finance-charges', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->add_finance_charges($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/update-finance-charges', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_finance_charges($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/delete-finance-charges', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_finance_charges($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

// Insurance Charges Module
//--------------------------------------------------------------------

$app->post('/setup/insurance-charges', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objSetup->get_insurance_charges($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/get-insurance-charges', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_insurance_charges_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/add-insurance-charges', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->add_insurance_charges($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/update-insurance-charges', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_insurance_charges($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/delete-insurance-charges', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_insurance_charges($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Sales Pipeline Target Charges Module
//--------------------------------------------------------------------

$app->post('/setup/sales-pipeline-targets', function () use ($app) {
    global $objSetup, $input;
    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objSetup->get_sales_pipeline_targets($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/get-sales-pipeline-target', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_sales_pipeline_target_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/add-sales-pipeline-target', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->add_sales_pipeline_target($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/update-sales-pipeline-target', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_sales_pipeline_target($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/delete-sales-pipeline-target', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_sales_pipeline_target($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


//---------------------------------------//
// 			HUMAN AND RESOURCES   	     //
//---------------------------------------//

// Cause of Inactivity Module
//--------------------------------------------------------------------

$app->post('/setup/cause-of-inactivity', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objSetup->get_cause_of_inactivity($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/get-cause-of-inactivity', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_cause_of_inactivity_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/add-cause-of-inactivity', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->add_cause_of_inactivity($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/update-cause-of-inactivity', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_cause_of_inactivity($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/delete-cause-of-inactivity', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_cause_of_inactivity($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Departments Module
//--------------------------------------------------------------------

$app->post('/setup/departments', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objSetup->get_departments($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/get-department', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_department_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/add-department', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->add_department($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/update-department', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->update_department($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/delete-department', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_department($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->run();