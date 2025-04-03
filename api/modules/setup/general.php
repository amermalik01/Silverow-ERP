<?php

$app->post('/setup/general/get-global-data-status', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    if (isset($input)) {
        foreach ($input as $key => $val) {
            $input_array[$key] = $val;
        }
    }
    $result = $objSetup->get_global_data_status($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-global-data', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    if (isset($input)) {
        foreach ($input as $key => $val) {
            $input_array[$key] = $val;
        }
    }
    $result = $objSetup->get_global_data($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

// Api to update global data single module array
$app->post('/setup/general/update-selected-global-data', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    if (isset($input)) {
        foreach ($input as $key => $val) {
            $input_array[$key] = $val;
        }
    }
    $result = $objSetup->updateSelectedGlobalData($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});



// Company Module
//--------------------------------------------------------------------
$app->post('/setup/general/companies', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_companies($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-company', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_company_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-vat-scheme', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_vat_scheme($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/chk-company-vat-scheme', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->chk_company_vat_scheme($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-company-opertunity', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_company_opertunity_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/general/add-company', function () use ($app) {
    global $objSetup, $input, $Product_tabs_array;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->add_company($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-companies-by-parent-id', function () use ($app) {
    global $objSetup, $input, $Product_tabs_array;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_companies_by_parent_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-company-emails', function () use ($app) {
    global $objSetup, $input, $Product_tabs_array;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_company_emails($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-company-currency', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->getCompanyCurrency($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/update-company', function () use ($app) {
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
$app->post('/setup/general/update-company-opertunity-cycle', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_company_opertunity_cycle($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/setup/general/delete-company', function () use ($app) {
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


// Company Addresses Module
//--------------------------------------------------------------------
$app->post('/setup/general/company-addresses', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_company_addresses($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/general/get-company-address', function () use ($app) {
    global $objSetup, $input;
    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_company_address_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/general/add-company-address', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->add_company_address($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/update-company-address', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_company_address($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/delete-company-address', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_company_address($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Financial Settings Module
//--------------------------------------------------------------------
$app->post('/setup/general/financial-settings', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objSetup->get_financial_settings($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-financial-setting', function () use ($app) {
    global $objSetup, $input;
    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_financial_setting_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/update-company-holiday-settings', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->updateCompanyHolidaySettings($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/company-holiday-settings', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->getCompanyHolidaySettings($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-company-financial-setting', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->getCompanyFinancialSettingByID($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-foreign-currency-movement-by-company-id', function () use ($app) {
    global $objSetup, $input;
    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_foreign_currency_movement_by_company_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

    /* global $objSetup, $input;
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_currencies($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
    */
});


$app->post('/setup/general/add-financial-setting', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->add_financial_setting($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/update-financial-setting', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_financial_setting($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/update-financial-exchange-rate', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_financial_exchange_rate($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/delete-financial_setting', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_financial_setting($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Company Info Module
//--------------------------------------------------------------------

$app->post('/setup/general/get-company-info', function () use ($app) {
    global $objSetup, $input;
    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_company_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/update-company-info', function () use ($app) {
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


// Currency Module
//--------------------------------------------------------------------

$app->post('/setup/general/currencies', function () use ($app) {

    global $objSetup, $input;
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_currencies($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/currency-list', function () use ($app) {
    global $objSetup, $input;

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->get_currencies_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/setup/general/ref-currency-list', function () use ($app) {
    global $objSetup, $input;

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->get_ref_currencies_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-currency', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_currency_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-currency-by-code', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_currency_by_code($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/add-currency', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->add_currency($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/update-currency', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_currency($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/delete-currency', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_currency($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-conversion-rate', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_conversion_rate_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/add-conversion-rate', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->add_conversion_rate($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/conversion-rate-history', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->conversion_rate_history($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/update-conversion-rate', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_conversion_rate($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

// Password Setting 

$app->post('/setup/general/get-password-settings', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_password_settings($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/update-password-settings', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_password_settings($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

//  finance and insurance charges

$app->post('/setup/general/update-fin-ins-charges', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->updateFinInsCharges($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-fin-ins-charges', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->getFinInsCharges($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

// Modules Codes Module
//--------------------------------------------------------------------

$app->post('/setup/general/modules-codes', function () use ($app) {
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

$app->post('/setup/general/filter-modules-codes', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objSetup->get_filter_modules_codes($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-module-code', function () use ($app) {
    global $objSetup, $input;
    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_module_code_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-module-value', function () use ($app) {
    global $objSetup, $input;
    $array = array(
        "controller" => $input->controller
    );
    $result = $objSetup->get_module_code_by_controller($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/general/add-module-code', function () use ($app) {
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

$app->post('/setup/general/update-module-code', function () use ($app) {
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

$app->post('/setup/general/delete-module-code', function () use ($app) {
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

$app->post('/setup/general/controllers', function () use ($app) {
    global $objSetup, $input;
    $result = $objSetup->get_controllers();
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-controller', function () use ($app) {
    global $objSetup, $input;
    $array = array(
        "table" => $input->controller
    );
    $result = $objSetup->get_controller($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/delete-module-rule', function () use ($app) {
    global $objSetup, $input;
    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->delete_module_rule($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-module-code-history', function () use ($app) {
    global $objSetup, $input;
    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_module_code_history($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Bank Account Module
//--------------------------------------------------------------------

$app->post('/setup/general/bank-accounts', function () use ($app) {
    global $objSetup, $input;

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->get_bank_accounts($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/general/bank-accounts-all', function () use ($app) {
    global $objSetup, $input;

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->get_bank_accounts_all($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/setup/general/get-bank-account', function () use ($app) {
    global $objSetup, $input;
    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_bank_account_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/general/add-bank-account', function () use ($app) {
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

$app->post('/setup/general/update-bank-account', function () use ($app) {
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

$app->post('/setup/general/delete-bank-account', function () use ($app) {
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


// Country Module
//--------------------------------------------------------------------

$app->post('/setup/general/countries', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    if (isset($input)) {
        foreach ($input as $key => $val) {
            $input_array[$key] = $val;
        }
    }
    $result = $objSetup->get_countries($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
     echo json_encode($result);
});

$app->post('/setup/general/get-country', function () use ($app) {
    global $objSetup, $input;
    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_country_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/general/add-country', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->add_country($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/update-country', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_country($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/delete-country', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_country($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// Modules Filters
//--------------------------------------------------------------------

$app->post('/setup/general/modules-filters', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objSetup->get_modules_filters($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-module-filter', function () use ($app) {
    global $objSetup, $input;
    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_module_filter_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-module-fields', function () use ($app) {
    global $objSetup, $input;
    $array = array(
        "module_id" => $input->module_id
    );
    $result = $objSetup->get_fields_by_module_code_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/general/add-module-filter', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->add_module_filter($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/add-filter-details', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->add_filter_details($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/update-module-filter', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_module_filter($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/delete-module-filter', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_module_filter($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-filter-details', function () use ($app) {
    global $objSetup, $input;
    $array = array(
        "filter_id" => $input->filter_id
    );
    $result = $objSetup->get_filter_details($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/delete-filter-details', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_filter_details($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/upload-image', function () use ($app) {
    global $objSetup, $input, $user_info;
    //echo "here in uploading";exit;
    // check company path
    check_dir_path(UPLOAD_PATH . 'company_logo_temp');
    // check company images path
    $uploads_dir = UPLOAD_PATH . 'company_logo_temp';

    //echo "Full Path = ".$uploads_dir."/".$new_file_name;exit;

    $tmp_name = $_FILES["file"]["tmp_name"];
    $name = $_FILES["file"]["name"];
    $name = str_replace(' ', '_', $name);
    $explode_file = explode(".", $name);
    $new_file_name = mt_rand() . "." . $explode_file[1];
    // upload file
    $var_export = move_uploaded_file($tmp_name, $uploads_dir . "/" . $new_file_name);

    if ($var_export) {
        $result['response'] = $new_file_name;
    } else {
        $result['response'] = "Error in files uploading!";
    }

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/upload-expense-image', function () use ($app) {
    global $objAtt, $input;
    $input_array = array();
	foreach($input as $key => $val){
	  $input_array[$key] = $val; 
	 }
	$result = $objAtt->uploadFile($_FILES,$_REQUEST);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

/* $app->post('/setup/general/upload-expense-image', function () use ($app) {
    global $objSetup, $input, $user_info;
    //echo "here in uploading";exit;
    // check company path
    check_dir_path(UPLOAD_PATH . 'expenses_files');
    // check company images path
    $uploads_dir = UPLOAD_PATH . 'expenses_files';

    //echo "Full Path = ".$uploads_dir."/".$new_file_name;exit;

    $tmp_name = $_FILES["file"]["tmp_name"];
    $name = $_FILES["file"]["name"];
    $explode_file = explode(".", $name);
    $new_file_name = mt_rand() . "." . $explode_file[1];
    // upload file
    $var_export = move_uploaded_file($tmp_name, $uploads_dir . "/" . $new_file_name);

    if ($var_export) {
        $result['response'] = $new_file_name;
    } else {
        $result['response'] = "Error in files uploading!";
    }

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
}); */

$app->post('/setup/general/fill-combo', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_fill_combo($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

//////////////////// Process of decision ////////////////////

//--------------------------------------------------------------------

$app->post('/setup/general/process-of-decision', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objSetup->get_process_of_decision($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-process-of-decision', function () use ($app) {
    global $objSetup, $input;

    $array = array(
        "id" => $input->id
    );
    $result = $objSetup->get_process_of_decision_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/general/add-process-of-decision', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->add_process_of_decision($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/update-process-of-decision', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->update_process_of_decision($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/delete-process-of-decision', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_process_of_decision($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/all-customer-product-type', function () use ($app) {
    global $objSetup, $input;

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->all_customer_product_type($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

//      Pricing Strategy      //

$app->post('/setup/general/add-pricing-strategy', function () use ($app) {
    global $objSetup, $input;

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->add_pricing_strategy($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-pricing-strategy', function () use ($app) {
    global $objSetup, $input;

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->get_pricing_strategy($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/pricing-strategy-types', function () use ($app) {
    global $objSetup, $input;

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->get_pricing_strategy_types($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/setup/general/get-company-start-end-date', function () use ($app) {
    global $objSetup, $input;
    $array = array(
        "id" => $input->company_id
    );

    $result = $objSetup->get_comp_start_end_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


//      Status listing generic Api      //

$app->post('/setup/general/all-status-list', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_all_status($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/add-status', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->add_status($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/update-status', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_status($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-status', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_status($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/delete-status', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->delete_status($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


############	Start: G/L Unit of Measures Section ############

$app->post('/setup/general/gl-units-of-measure', function () use ($app) {
    global $objSetup, $input;
    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objSetup->get_gl_units_of_measure($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-gl-units-of-measure', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->get_data_by_id('gl_units_of_measure', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-all-gl-units-of-measure', function () use ($app) {
    global $objSetup, $input;

    $result = $objSetup->get_all_gl_units_of_measure($input);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/add-gl-units-of-measure', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->add_gl_units_of_measure($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/update-gl-units-of-measure', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objSetup->update_gl_units_of_measure($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/delete-gl-units-of-measure', function () use ($app) {
    global $objSetup, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    //$result = $objSetup->delete_update_status('gl_units_of_measure', 'status', $input_array['id']);
    $result = $objSetup->delete_gl_units_of_measure($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


############	End: G/L Unit of Measures Section ############


// Ref Dimensions list start


$app->post('/setup/general/ref-dimension-list', function () use ($app) {
    global $objSetup, $input;

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objSetup->ref_dimension_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


############	End: Ref Dimensions list ############


//-------------------- Classifications ------------------------------//


$app->post('/setup/general/ref-classifications', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->get_ref_classifications($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/general/active-classifications', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->get_active_classifications($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/general/add-active-classification', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->add_active_classification($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
$app->post('/setup/general/get-active-classification-by-id', function () use ($app) {
	global $objSetup, $input;
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->get_data_by_id('srm_classification', $input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/general/delete-active-classification', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();

	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->delete_update_status('active_classification', 'status', $input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


//-------------------- Additional Cost ------------------------------//


$app->post('/setup/general/ref-item-additional-cost', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->get_ref_item_additional_cost($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/general/active-item-additional-cost', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->get_active_item_additional_cost($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/general/add-active-item-additional-cost', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->add_active_item_additional_cost($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/general/get-flexi-table-meta', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->GetTableMetaData($input_array);	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/general/bringNamesFromSubModule', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->bringNamesFromSubModule($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/general/bringEmployees', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->bringEmployees($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/general/bringNamesFromModule', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->bringNamesFromModule($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/general/bringEmployeeEmailsAddresses', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->bringEmployeeEmailsAddresses($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/general/bringEmailsFromModule', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->bringEmailsFromModule($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/general/update-flexi-table-meta', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->UpdateTableMetaData($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/general/getHistory', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->getHistory($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/general/update-email-JSON', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->updateEmailJSON($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/general/get-email-JSON', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->getEmailJSON($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/general/updateUserEmail', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->updateUserEmail($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/general/get-configured-email-addresses', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->getConfiguredEmailAddresses($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/general/getRequestedFile', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->getRequestedFile($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/general/print-pdf-invoice', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->printPdfInvoice($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/general/email-pdf-document', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->emailPdfDocument($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/general/performConfirmation', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->performConfirmation($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/setup/general/addConfirmation', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->addConfirmation($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/general/check-batch-for-add-cost', function () use ($app) {

    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 

    $result = $objSetup->checkBatchForAddCost($input_array);
    
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-additional-cost-entries', function () use ($app) {


    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 

    $result = $objSetup->getAdditionalCostEntries($input_array);
    
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/run-additional-cost-batch', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->runAdditionalCostBatch($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/setup/general/add-shortcuts', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->add_shortcuts($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/setup/general/get-shortcuts', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->get_shortcuts($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/check-setUp', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->check_setUp($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-pending-approvals', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->get_pending_approvals($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/setup/general/get-awaiting-approvals', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->get_awaiting_approvals($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-approvals', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->get_approvals($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/update-approvals', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->update_approvals($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/setup/general/get-approval-status', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->get_approval_status($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/setup/general/update-approval-comments', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->update_approval_comments($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/setup/general/check-for-approvals', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->check_for_approvals($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/setup/general/check-for-approvals-before-delete', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->check_for_approvals_before_del($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/setup/general/send-for-approval', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->send_for_approval($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/setup/general/send-for-approval-bulk', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->send_for_approval_bulk($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/setup/general/update-approval-status', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->update_approval_status($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/setup/general/delete-approval-history', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->delete_approval_history($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/setup/general/update-approvals-status-bulk', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->update_approvals_status_bulk($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/update-approval-status-direct', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->update_approval_status_direct($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/unlock-approved-order', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->unlock_approved_order($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-approvers-list', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->get_approvers_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/get-show-hide-add-btn', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->get_show_hide_add_btn($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/setup/general/update-show-hide-add-btn', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->update_show_hide_add_btn($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/change-all-passwords', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->change_all_passwords($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/check-setup-VAT-accounts', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->checkSetupVATAccounts($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/getHMRCRefreshToken', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->getHMRCRefreshToken($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/getHMRCToken', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->getHMRCToken($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/submitVATSummary', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->submitVATSummary($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/getVATSummary', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->getVATSummary($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/getVATObligations', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->getVATObligations($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/getProfitMarginView', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->getProfitMarginView($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/setup/general/setProfitMarginView', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->setProfitMarginView($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->get('/setup/general/takeAuthorizationCode', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    $req = $app->request();
    $input_array['code'] = $req->get('code');
    $input_array['token'] = explode("*",$req->get('state'))[0];
    $input_array['scope'] = explode("*",$req->get('state'))[1];
    
    $result = $objSetup->takeAuthorizationCode($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/setup/general/application-limitations', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->applicationLimitations($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

/* $app->post('/setup/general/get-active-item-additional-cost-by-id', function () use ($app) {
	global $objSetup, $input;
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->get_data_by_id('srm_classification', $input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/setup/general/delete-active-item-additional-cost', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();

	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->delete_update_status('active_classification', 'status', $input_array['id']);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
}); */

$app->post('/setup/general/holiday-cancellation-request', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->add_holiday_history($input_array,0);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/logout-time', function () use ($app) {
    global $objSetup, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objSetup->add_logout_time($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/setup/general/bringEmployeesLeft', function () use ($app) {
	global $objSetup, $input;
	$input_array = array();
	foreach ($input as $key => $val) {
		$input_array[$key] = $val;
	}
	$result = $objSetup->get_employees_leftside($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

?>