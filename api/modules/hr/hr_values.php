<?php
############	Start: hr values ############
$app->post('/hr/hr_values', function () use ($app) {
    global $objHr, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->get_hr_listing($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/hr/hr_values/get-employee-details', function () use ($app) {
    global $objHr, $input;
    $array = array(
        "id" => $input->employee_id
    );
    //echo "Here in product details ===>";print_r($array);exit;
    $result = $objHr->get_employee_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/hr/hr_values/get-all-comapnies', function () use ($app) {
    global $objHr, $input;

    $result = $objHr->get_all_comapanies($input);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/hr/hr_values/get-cols-by-tab-id', function () use ($app) {
    global $objHr, $input;
    $array = array(
        "tab_id" => $input->tab_id,
        "employess_id" => $input->employess_id
    );
    $result = $objHr->get_cols_values($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/hr/hr_values/get_hr_value_employess', function () use ($app) {
    global $objHr, $input;

    $array = array(
        "tab_id" => $input->tab_id,
        "employee_id" => $input->employee_id
    );
    $result = $objHr->get_hr_value_employess($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/hr/hr_values/get_hr_value_by_defined', function () use ($app) {
    global $objHr, $input;

    $array = array(
        "tab_id" => $input->tab_id,
        "employee_id" => $input->employee_id
    );
    $result = $objHr->get_hr_value_by_defined($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/hr/hr_values/get_hr_value_by_undefined', function () use ($app) {
    global $objHr, $input;

    $array = array(
        "tab_id" => $input->tab_id,
        "employee_id" => $input->employee_id
    );
    $result = $objHr->get_hr_value_by_undefined($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/hr/hr_values/delete_hr_values', function () use ($app) {
    global $objHr, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->delete_hr_values($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/hr/hr_values/get-companies', function () use ($app) {
    global $objHr, $input;
    $array = array(
        "tab_id" => $input->tab_id,
        "employess_id" => $input->employess_id
    );
    //print_r($array);exit;
    $result = $objHr->get_companies($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/hr/hr_values/get-countries', function () use ($app) {
    global $objHr, $input;
    $array = array(
        "tab_id" => $input->tab_id,
        "employess_id" => $input->employess_id
    );
    //print_r($array);exit;
    $result = $objHr->get_countries($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/hr/hr_values/get-vat', function () use ($app) {
    global $objHr, $input;

    //print_r($array);exit;
    $result = $objHr->get_vat_list($input);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/hr/hr_values/get_emp_value', function () use ($app) {
    global $objHr, $input;
    $array = array(
        "tab_id" => $input->tab_id,
        "employess_id" => $input->employess_id
    );
    $result = $objHr->get_tab_val_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


<<<<<<< HEAD
$app->post('/hr/get-all-categories', function () use ($app) {
=======
/* $app->post('/hr/get-all-categories', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    global $objHr, $input;

    $result = $objHr->get_all_categories($input);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/hr/hr_values/update-tab-col-val', function () use ($app) {
    global $objHr, $input;

    $result = $objHr->update_emp_value($input, $input);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

$app->post('/hr/hr_values/update-hr-general', function () use ($app) {
    global $objHr, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->update_hr_general($input, $input);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/hr/hr_values/update-account-settings-detail', function () use ($app) {
    global $objHr, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->updateAccountSettings($input, $input);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/hr/hr_values/update-hr-contact', function () use ($app) {
    global $objHr, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->update_hr_contact($input, $input);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/hr/hr_values/update-hr-personal', function () use ($app) {
    global $objHr, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->update_hr_personal($input, $input);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/hr/hr_values/update-hr-salary', function () use ($app) {
    global $objHr, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->update_hr_salary($input, $input);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/hr/hr_values/update-hr-benefit', function () use ($app) {
    global $objHr, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->update_hr_benefit($input, $input);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/hr/hr_values/update-hr-role', function () use ($app) {
    global $objHr, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->update_hr_role($input, $input);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/hr/hr_values/update-hr-expense', function () use ($app) {
    global $objHr, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->update_hr_expense($input, $input);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/hr/hr_values/update-hr-subexpense', function () use ($app) {
    global $objHr, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->update_hr_subexpense($input, $input);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/hr/hr_values/update-hr-exppersonal', function () use ($app) {
    global $objHr, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->update_hr_exppersonal($input, $input);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/hr/hr_values/update-hr-expcompany', function () use ($app) {
    global $objHr, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->update_hr_expcompany($input, $input);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

<<<<<<< HEAD
$app->post('/hr/hr_values/get-code', function () use ($app) {
=======
/* $app->post('/hr/hr_values/get-code', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    global $objHr, $input;
    $array = array(
        "is_increment" => $input->is_increment
    );
    $result = $objHr->get_code($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


$app->post('/hr/hr_values/add-countries', function () use ($app) {
    global $objHr, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->add_countries($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/hr/hr_values/role_list', function () use ($app) {
    global $objHr, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->get_role_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});

$app->post('/hr/hr_values/role_by_id', function () use ($app) {
    global $objHr, $input;
    $array = array(
        "id" => $input->id
    );

    $result = $objHr->get_employeerole_by_id($array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD

});

$app->post('/hr/hr_values/role_document', function () use ($app) {
=======
});

/* $app->post('/hr/hr_values/role_document', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    global $objHr, $input;
    $array = array(
        "id" => $input->id
    );

    $result = $objHr->delete_employeerolee_id($array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

});

$app->post('/hr/hr_values/delete_roles', function () use ($app) {
    global $objHr, $input;
    $array = array(
        "id" => $input->id
    );

    $result = $objHr->delete_employeerolee_id($array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


$app->post('/hr/hr_values/expences_list', function () use ($app) {
    global $objHr, $input;
    $array = array(
        "employee_id" => $input->employee_id
    );

    $result = $objHr->expences_list($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});

$app->post('/hr/hr_values/expence_data_by_id', function () use ($app) {
    global $objHr, $input;
    $array = array(
        "employee_id" => $input->employee_id,
        "id" => $input->id
    );


    $result = $objHr->expence_data_by_id($array);
    // print_r($result);exit;
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});

$app->post('/hr/hr_values/delete_expence_main', function () use ($app) {
    global $objHr, $input;
    $array = array(
        "id" => $input->id
    );
    // print_r($array);exit;
    $result = $objHr->delete_expences_id($array);
    // print_r($result);exit;
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});

$app->post('/hr/hr_values/expences_sublist', function () use ($app) {
    global $objHr, $input;
    $array = array(
        "expense_id" => $input->expense_id,
        "employee_id" => $input->employee_id
    );

    $result = $objHr->sub_expence_list($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});
$app->post('/hr/hr_values/expences-perlist', function () use ($app) {
    global $objHr, $input;
    $array = array(
        "expense_id" => $input->expense_id,
        "employee_id" => $input->employee_id
    );

    $result = $objHr->expence_perlist($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});

$app->post('/hr/hr_values/expences_complist', function () use ($app) {
    global $objHr, $input;
    $array = array(
        "expense_id" => $input->expense_id,
        "employee_id" => $input->employee_id
    );

    $result = $objHr->comp_expence_list($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});

$app->post('/hr/hr_values/delete_expence_sub', function () use ($app) {
    global $objHr, $input;
    $array = array(
        "id" => $input->id
    );
    $result = $objHr->delete_expence_sub($array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});

$app->post('/hr/hr_values/delete_expence_sub_pv', function () use ($app) {
    global $objHr, $input;
    $array = array(
        "id" => $input->id
    );
    $result = $objHr->delete_expence_sub_pv($array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});

$app->post('/hr/hr_values/delete_expence_sub_cv', function () use ($app) {
    global $objHr, $input;
    $array = array(
        "id" => $input->id
    );
    $result = $objHr->delete_expence_sub_cv($array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});


$app->post('/hr/hr_values/get_company_base_currency', function () use ($app) {
    global $objHr, $input;


    // print_r($result);exit;
    $result = $objHr->get_company_base_currency($input);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});

$app->post('/hr/hr_values/get_currency_list', function () use ($app) {
    global $objHr, $input;


    // print_r($result);exit;
    $result = $objHr->get_currency_list($input);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});


$app->post('/hr/hr_values/sub_expence_data_by_id', function () use ($app) {
    global $objHr, $input;
    $array = array(
        "id" => $input->id
    );


    $result = $objHr->subexpence_data_by_id($array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});

$app->post('/hr/hr_values/get_parent_module_list', function () use ($app) {
    global $objHr, $input;

    // print_r($input);exit;
    $result = $objHr->get_parent_module_list($input);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});

$app->post('/hr/hr_values/get_child_module_list', function () use ($app) {
    global $objHr, $input;

    $array = array(
        "id" => $input->id
    );

    $result = $objHr->get_child_module_list($array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});

$app->post('/hr/hr_values/get_child_module_list_selected', function () use ($app) {
    global $objHr, $input;

    $array = array(
        "id" => $input->id,
        "permisions" => $input->permisions
    );

    $result = $objHr->get_child_module_list_selected($array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});


$app->post('/hr/hr_values/get_employee_type', function () use ($app) {
    global $objHr, $input;

    $result = $objHr->get_emp_type_list($input);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/hr/hr_values/get-employee-inactive-type', function () use ($app) {
    global $objHr, $input;

    $result = $objHr->get_employee_inactive_type($input);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/hr/hr_values/get-employee-leaving-reasons', function () use ($app) {
    global $objHr, $input;

    $result = $objHr->get_employee_leaving_reasons($input);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/hr/hr_values/submit_emp_type_form', function () use ($app) {
    global $objHr, $input;

    $result = $objHr->add_hr_employee_type($input);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/hr/hr_values/submit-emp-inactive-type-form', function () use ($app) {
    global $objHr, $input;

    $result = $objHr->submit_emp_inactive_type_form($input);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/hr/hr_values/submit-emp-leaving-reason-form', function () use ($app) {
    global $objHr, $input;

    $result = $objHr->submit_emp_leaving_reason_form($input);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/hr/hr_values/get_religion_type', function () use ($app) {
    global $objHr, $input;

    $result = $objHr->get_religion_type_list($input);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/hr/hr_values/submit_religion_form', function () use ($app) {
    global $objHr, $input;

    $result = $objHr->add_hr_religion($input);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


<<<<<<< HEAD
$app->post('/hr/hr_values/get_select_result', function () use ($app) {
=======
/* $app->post('/hr/hr_values/get_select_result', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    global $objHr, $input;

    $result = $objHr->get_select_result($input);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


$app->post('/hr/hr_values/get-all-employee-purchase-code', function () use ($app) {
    global $objHr, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->get_all_employee_purchase_code($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/hr/hr_values/add-all-employee-purchase-code', function () use ($app) {
    global $objHr, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->add_all_employee_purchase_code($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

// hr status history

$app->post('/hr/hr_values/employee-status-history', function () use ($app) {
    global $objHr, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->employee_status_history($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

// hr commission history

$app->post('/hr/hr_values/employee-commission-history', function () use ($app) {
    global $objHr, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->employees_commission_history($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

//codemark1
<<<<<<< HEAD
$app->post('/hr/hr_values/get-emp-form-details', function() use ($app){
    global $objHr, $input;
    
=======
$app->post('/hr/hr_values/get-emp-form-details', function () use ($app) {
    global $objHr, $input;

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    $empDetailArr = array(
        "id" => $input->employee_id
    );
    $empLastStatusHistoryArr = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $empRolesArr = array(
<<<<<<< HEAD
        "all"=> $input->all,
        "start"=> $input->start,
        "limit"=> $input->limit,
        "keyword"=> $input->keyword
=======
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    );

    $empGetRoleToEmpArr = array(
        "id" => $input->employee_id,
        "token" => $input->token,
        "type" => 1
    );

    $empGetCrmSalespersonArr = array(
        "id" => $input->employee_id,
        "token" => $input->token,
        "type" => 7
    );

    $empGetAllListings = array(
        "token" => $input->token,
        "all" => 1
    );

    $input_array = [$input, $empDetailArr, $empLastStatusHistoryArr, $empRolesArr, $empGetRoleToEmpArr, $empGetCrmSalespersonArr, $empGetAllListings];
<<<<<<< HEAD
    
    $result = $objHr->get_emp_form_details($input_array);
    
=======

    $result = $objHr->get_emp_form_details($input_array);

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    // $result = "";
    // $result["emp_type"] .= json_encode($objHr->get_emp_type_list($input));
    // $result["emp_inactive_type"] .= json_encode($objHr->get_employee_inactive_type($input));
    // $result["emp_leaving_reas"] .= json_encode($objHr->get_employee_leaving_reasons($input));
    // $result["emp_detail"] .= json_encode($objHr->get_employee_by_id($empDetailArr));
    // $result["emp_religion"] .= json_encode($objHr->get_religion_type_list($input));
    // $result["emp_last_status"] .= json_encode($objHr->employee_last_status_history($empLastStatusHistoryArr));
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});


$app->post('/hr/hr_values/employee-last-status-history', function () use ($app) {
    global $objHr, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->employee_last_status_history($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/hr/hr_values/employee-salary-history', function () use ($app) {
    global $objHr, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->employee_salary_history($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
//benefits
$app->post('/hr/hr_values/get-other-benefits', function () use ($app) {
    global $objHr, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->get_other_benefits($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/hr/hr_values/add-other-benefits', function () use ($app) {
    global $objHr, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->add_other_benefits($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/hr/hr_values/del-other-benefits', function () use ($app) {
    global $objHr, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->del_other_benefits($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/hr/hr_values/employee-benefit-history', function () use ($app) {
    global $objHr, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->get_employee_benefits_history($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/hr/hr_values/getDistance', function () use ($app) {
    global $objHr, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    // print_r($input_array);
    $postcode1 = urlencode($input_array['origins']);
    $postcode2 = urlencode($input_array['destination']);
    //$via="|".urlencode ($input_array['via']);

<<<<<<< HEAD
//$url = "http://maps.googleapis.com/maps/api/distancematrix/json?origins=".$postcode2."&destinations=".$postcode1."&mode=driving&language=en-EN&sensor=false";
=======
    //$url = "http://maps.googleapis.com/maps/api/distancematrix/json?origins=".$postcode2."&destinations=".$postcode1."&mode=driving&language=en-EN&sensor=false";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    if ($postcode2 != '') {
        // $url = "http://maps.googleapis.com/maps/api/distancematrix/json?origins=" . $postcode1 . "&destinations=" . $postcode2 . "&mode=driving&language=en-EN&sensor=false";
        $url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" . $postcode1 . "&destinations=" . $postcode2 . "&key=AIzaSyBP2-jPrmwpblyVI6NfzLPHXpO5cr4uPdU";
        $data = @file_get_contents($url);

        $result = json_decode($data, true);

        //echo "<pre>"; print_r($result);

        foreach ($result['rows'] as $distance) {
            $res = ($distance['elements'][0]['distance']['value'] / 1609.344);
        }
    } else {
        $res = "Please Add PostCode To...";
    }
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    //echo json_encode($url);
    //print_r($res);exit;
    echo json_encode(number_format($res, 2));
});

//Holidays

$app->post('/hr/hr_values/add-holiday', function () use ($app) {
    global $objHr, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->add_holiday($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/hr/hr_values/update-holiday', function () use ($app) {
    global $objHr, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->update_holiday($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/hr/hr_values/holiday-listing', function () use ($app) {
    global $objHr, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->holiday_listing($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/hr/hr_values/holiday-data-by-id', function () use ($app) {
    global $objHr, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->holiday_data_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/hr/hr_values/delete-holiday-by-id', function () use ($app) {
    global $objHr, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->delete_holiday_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/hr/hr_values/get-holiday-detail', function () use ($app) {
    global $objHr, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->get_holiday_detail($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/hr/hr_values/get-holiday-start-end-date-limits-byYear', function () use ($app) {
    global $objHr, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->get_holidayStartEndDateLimitsByYear($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/hr/hr_values/add-deduction', function () use ($app) {
    global $objHr, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->add_deduction($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/hr/hr_values/deduction-listing', function () use ($app) {
    global $objHr, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->deduction_listing($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/hr/hr_values/deduction-data-by-id', function () use ($app) {
    global $objHr, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->deduction_data_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
<<<<<<< HEAD
$app->post('/hr/hr_values/update-hr-deduction', function () use ($app) {
=======
/* $app->post('/hr/hr_values/update-hr-deduction', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    global $objHr, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->update_hr_deduction($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


$app->post('/hr/hr_values/get-expenses-setup', function () use ($app) {
    global $objHr, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->get_expenses_setup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/hr/hr_values/update-expenses-setup', function () use ($app) {
    global $objHr, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->update_expenses_setup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/hr/hr_values/convert-expense-to-purchase-order', function () use ($app) {
    global $objHr, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->convert_expense_to_purchase_order($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/hr/hr_values/add-hr-benefit-history', function () use ($app) {
    global $objHr, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->add_employees_benefit_history($input);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
############	End: hr    values ##############
<<<<<<< HEAD
?>
=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
