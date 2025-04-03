<?php
/* ************ Start: Account Heads Table ************* */
$app->post('/gl/chart-accounts/check-for-chart-account', function () use ($app) {
    global $objGl, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->checkGlAccountsSetup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-all-gl-accounts', function () use ($app) {
    global $objGl, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->getAllGlAccounts($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-category-by-name', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_account_cat_name($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-gl-accounts-heading-by-name', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_gl_accounts_heading_by_name($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/gl/chart-accounts/get-gl-accounts-heading-by-cat-id', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_gl_accounts_heading_by_cat_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-currency-movements', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_currency_movements($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/update-currency-movements', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->update_currency_movements($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/gl/chart-accounts/get-opening-balance-setup-account', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->getOpeningBalanceSetupAccount($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/change-opening-balance-setup-account', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->changeOpeningBalanceSetupAccount($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/gl/chart-accounts/gl-list', function () use ($app) {

    global $objGl, $input;

    $array = array(
        "all" => $input->all,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );

    $result = $objGl->get_accounts_gl($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-account-popup', function () use ($app) {
    global $objGl, $input;
    $array = array(
        "all" => 1,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objGl->get_accounts_popup($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-accounts-history', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_accounts_history($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/gl-list', function () use ($app) {
    global $objGl, $input;
    $array = array(
        "all" => 1,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objGl->get_accounts_gl($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-parent', function () use ($app) {
    global $objGl, $input;
    $array = array(
        "id" => $input->id
    );
    $result = $objGl->get_parent($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-list-one', function () use ($app) {
    global $objGl, $input;
    $array = array(
        "id" => $input->id,
        "pid" => $input->pid
    );
    $result = $objGl->get_list_one($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get_new_number', function () use ($app) {
    global $objGl, $input;
    $array = array(
        "parent_id" => $input->pid,
        "cid" => $input->cid
    );
    $result = $objGl->get_new_number($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/add_account_values', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->add_account_heads($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
<<<<<<< HEAD

=======
/* 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
$app->post('/gl/chart-accounts/update-account-heads', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->update_account_heads($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

$app->post('/gl/chart-accounts/get-account-heads', function () use ($app) {
    global $objGl, $input;
    $input_array = array(
        "id" => $input->gl_id
    );
    $result = $objGl->get_data_by_id('account_heads', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/gl/chart-accounts/get-goods-received-account', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->getGoodsReceivedAccount($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/gl/chart-accounts/change-goods-received-account', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->changeGoodsReceivedAccount($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-vat-posting-account', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->getVatPostingAccount($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-vat-posting-account_new', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->getVatPostingAccount_new($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/change-vat-posting-account', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->changeVatPostingAccount($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/change-vat-posting-account_new', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->changeVatPostingAccount_new($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/gl/chart-accounts/change-vat-liability-account', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->changeVATliabilityAccount($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/gl/chart-accounts/change-inventory-setup-type', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->changeInventorySetupType($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

/* ************ End: Account Heads Table ************* */

/* ************ Start: General Ledger Posting Table ************* */
$app->post('/gl/chart-accounts/add-ledger-posting', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->add_general_ledger_posting($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/update-ledger-posting', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->update_general_ledger_posting($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-ledger-posting', function () use ($app) {
    global $objGl, $input;
    $array = array(
        "id" => $input->gl_id
    );
    $result = $objGl->get_ledger_posting_heads_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

/* ************ End: General Ledger Posting Table ************* */

$app->post('/gl/chart-accounts/get-enum-values', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_enum_values($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/delete-gl', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->delete_update_status('account_heads', 'status', $input_array['id']);
    //$result = $objGl->delete_gl($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-gl-popup', function () use ($app) {
    global $objGl, $input;
    $array = array(
        "id" => $input->id
    );
    $result = $objGl->get_gl_popup($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

/* **
	Start: Generating Tree
	Module Copy: Old CI
** */
$app->post('/gl/chart-accounts/generate-tree', function () use ($app) {
    global $objGl, $input;
    $data = $objGl->get_account_heads();
    $result = $objGl->get_total_amount();
    $arr_amount = array();
    foreach ($result as $row) {
        $arr_amount[$row['account_head']] = $row['total'];
    }
    $temp_array = array();
    $parent_array = array();
    $child_array = array();

    foreach ($data as $key => $value_array) {
        $temp_array[$value_array['id']]['record'] = $value_array;

        if ($value_array['category_id'] == 0)
            $temp_array[$value_array['id']]['is_main'] = '1';
        else
            $temp_array[$value_array['category_id']]['childs'][] = $value_array['id'];
    }

    foreach ($temp_array as $key2 => $my_array) {
        foreach ($my_array['record'] as $key => $rec_array) {

            if (isset($rec_array) && $rec_array['account_type'] == 'Heading') {
                $parent_array[$key] = $rec_array;
            }

            if (isset($rec_array['childs']) && count($rec_array['childs'] > 0)) {

                if (isset($rec_array['childs'])) {
                    foreach ($rec_array['childs'] as $t_val) {
                        $child_array[$key][$t_val] = $temp_array[$t_val];
                        $child_array[$key][$t_val]['is_partent'] = '1';
                    }
                }
            } else {
                $child_array[$rec_array['category_id']][$key] = $rec_array;
                $child_array[$rec_array['category_id']][$key]['is_partent'] = '0';
            }
        }
    }
    $final_result = array('parent' => $parent_array, 'child' => $child_array, 'total' => $arr_amount);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($final_result);
});

$app->post('/gl/chart-accounts/gl-type', function () use ($app) {
    global $objGl, $input;
    $array = array(
        "type_id" => $input->type_id
    );
    $result = $objGl->get_account_heads_type_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

/* **** End: Generating Tree ************* */

/*===========================================*/
/*			New GL Module functions Start 	*/
/*===========================================*/


$app->post('/gl/chart-accounts/upload-default-gl-accounts', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->uploadDefaultGlAccounts($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/gl/chart-accounts/get-gl-account-byID', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->getGlAccountbyID($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/gl/chart-accounts/get-predata-gl-account', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->getPredataGlAccount($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-sub-categories-by-parent_id', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->getSubCategoriesByParentID($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


/* $app->post('/gl/chart-accounts/get-all-categories-by-list', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_all_categories_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-parent-categories', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_parent_categories($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-sub-categories', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_sub_categories($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
}); */

/* $app->post('/gl/chart-accounts/get-sub-categories-by-parent_id', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_sub_categories_by_parent_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
}); */

$app->post('/gl/chart-accounts/get-all-gl-account-no', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->getAllGLAccountNo($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

});

$app->post('/gl/chart-accounts/get-gl-account-no-forDetailReport', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->getAllGLAccountNoforDetailReport($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

});

$app->post('/gl/chart-accounts/get-gl-heading', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->getGlHeading($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-level-list', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_level_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

});

$app->post('/gl/chart-accounts/add-new-account', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objGl->add_new_account($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-gl-account-by-id', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_gl_account_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/gl/chart-accounts/edit-gl-account', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objGl->edit_gl_account($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


/*==========================================================*/
/*			GL Accounts Details BY ID	            */
/*==========================================================*/

$app->post('/gl/chart-accounts/get-gl-account-debit-credit-by-id', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_gl_account_debit_credit_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

/*==========================================================*/
/*			GL Accounts CSV generation BY ID	            */
/*==========================================================*/

$app->post('/gl/chart-accounts/generate-gl-account-CSV-byID', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->generate_glAccountCSVbyID($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

/*==========================================================  */
/*			Delete GL Account Temporary Table on Modal Close  */
/*==========================================================  */

$app->post('/gl/chart-accounts/delete-gl-account-temp-table', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->deleteGlAccountTempTable($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


/*			Duplication of Gl accounts for new company	*/

$app->post('/gl/chart-accounts/add-gl-accounts-by-new-company', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->add_gl_accounts_by_new_company($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

/*===========================================*/
/*			New GL Module functions End 	*/
/*===========================================*/

/*==========================================================*/
/*			GL Module functions from setup for codes Start 	*/
/*==========================================================*/




$app->post('/gl/chart-accounts/get-all-ref-cat-list', function () use ($app) {
    global $objGl, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_all_ref_cat_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/add-gl-cat-by-new-company', function () use ($app) {
    global $objGl, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->add_gl_cat_by_new_company($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/add-new-cat-list', function () use ($app) {
    global $objGl, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->add_new_cat_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

/*==========================================================*/
/*			GL Module functions from setup for codes End  	*/
/*==========================================================*/
/*=============GL Journal    =============================================*/

$app->post('/gl/chart-accounts/get-jl-journal', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_gl_journal($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-jl-journal-by-id', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_jl_journal_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/add-jl-journal', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->add_gl_journal($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/delete-jl-journal', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->delete_update_status('gl_journal', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/convert-posting', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->convert_posting($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-all-account', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_all_account($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-gl-main-list', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_gl_main_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-gl-main-by-id', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_gl_main_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/add-gl-journal-main', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->add_gl_main_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

<<<<<<< HEAD
$app->post('/gl/chart-accounts/delete-gl-journal-main', function () use ($app) {
=======
/* $app->post('/gl/chart-accounts/delete-gl-journal-main', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->delete_gl_main_list('gl_journal_main', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

//  GL template

$app->post('/gl/chart-accounts/get-template-gl-list', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_template_gl_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-template-gl-by-id', function () use ($app) {
    global $objGl, $input;
    $array = array(
        "id" => $input->id
    );
    $result = $objGl->get_data_by_id('gl_template', $array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/add-template-gl', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->add_template_gl($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

<<<<<<< HEAD
$app->post('/gl/chart-accounts/update-template-gl', function () use ($app) {
=======
/* $app->post('/gl/chart-accounts/update-template-gl', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->update_template_gl($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

$app->post('/gl/chart-accounts/delete-template-gl', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->delete_template_gl($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/on-change-template', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->change_template($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/add-invoice-receipt', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->add_invoice_receipt($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-invoice-receipt', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_invoice_receipt($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

/*=============GL Journal   Recipt =============================================*/

$app->post('/gl/chart-accounts/get-gl-main-list-receipt', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_gl_main_list_receipt($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-gl-main-by-id-receipt', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_gl_main_by_id_receipt($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/add-gl-journal-main-receipt', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->add_gl_main_list_receipt($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

<<<<<<< HEAD
$app->post('/gl/chart-accounts/delete-gl-journal-main-receipt', function () use ($app) {
=======
/* $app->post('/gl/chart-accounts/delete-gl-journal-main-receipt', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->delete_gl_main_list('gl_journal_receipt', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

/*=============GL Journal   Receipt Sublist =============================================*/

$app->post('/gl/chart-accounts/get-jl-journal-receipt', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_gl_journal_receipt($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-jl-journal-receipt-item', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_gl_journal_receipt_item($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-jl-journal-by-id-receipt', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_jl_journal_by_id_receipt($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
// opening balance stock start

$app->post('/gl/chart-accounts/add-opening-balance-stock', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->addOpeningBalanceStock($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-opening-balance-stock', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->getOpeningBalanceStock($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/delete-opening-balnc-stock-item', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->deleteOpeningBalncStockItem($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

// opening balance stock end
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&


//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
// opening balance customer start

$app->post('/gl/chart-accounts/add-opening-balance-customer', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->addOpeningBalanceCustomer($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-opening-balance-customer', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->getOpeningBalanceCustomer($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/delete-opening-balnc-customer-item', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->deleteOpeningBalncCustomerRec($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

// opening balance customer end
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
// opening balance Supplier start

$app->post('/gl/chart-accounts/add-opening-balance-supplier', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->addOpeningBalanceSupplier($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-opening-balance-supplier', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->getOpeningBalanceSupplier($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/delete-opening-balnc-supplier-item', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->deleteOpeningBalncCustomerRec($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

// opening balance Supplier end
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
// opening balance Bank start

$app->post('/gl/chart-accounts/add-opening-balance-bank', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->addOpeningBalanceBank($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-opening-balance-bank', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->getOpeningBalanceBank($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/delete-opening-balnc-bank-rec', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->deleteOpeningBalncBankRec($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

// opening balance Supplier end
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
// opening balance GL start

$app->post('/gl/chart-accounts/add-opening-balance-gl', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->addOpeningBalanceGL($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-opening-balance-gl', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->getOpeningBalanceGL($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/delete-opening-balnc-gl-rec', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->deleteOpeningBalncGLRec($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

// opening balance GL end
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
// opening balance Posting Start

$app->post('/gl/chart-accounts/post-opening-balance', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->postOpeningBalance($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

// opening balance Posting end
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
// Get Customer Data for flexi modal popup

$app->post('/gl/chart-accounts/customer-data-for-flexi-modal', function () use ($app) {
    global $objGl, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objGl->customerDataForFlexiModal($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
// Get Supplier Data for flexi modal popup

$app->post('/gl/chart-accounts/supplier-data-for-flexi-modal', function () use ($app) {
    global $objGl, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objGl->supplierDataForFlexiModal($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
// Get Item Data for flexi modal popup

$app->post('/gl/chart-accounts/item-data-for-flexi-modal', function () use ($app) {
    global $objGl, $input; 
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    } 
    $result = $objGl->itemDataForFlexiModal($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/gl/chart-accounts/add-jl-journal-receipt', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->add_gl_journal_receipt($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

<<<<<<< HEAD
=======
$app->post('/gl/chart-accounts/update-posted-journal', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objGl->updatePostedJournal($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
$app->post('/gl/chart-accounts/add-jl-journal-receipt-single', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->add_gl_journal_receipt_single($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/add-jl-journal-receipt-item', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->add_gl_journal_receipt_item($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/add-jl-journal-receipt-item-single', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->add_gl_journal_receipt_item_single($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/gl/chart-accounts/delete-jl-journal-receipt', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->delete_payment_detail($input_array);
    // $result = $objGl->delete_update_status('gl_journal_receipt_detail', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

<<<<<<< HEAD
=======
$app->post('/gl/chart-accounts/delete-all-payment-allocations', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->delete_all_payment_allocations($input_array);
    // $result = $objGl->delete_update_status('gl_journal_receipt_detail', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
$app->post('/gl/chart-accounts/delete-jl-journal-receipt-item', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->delete_item_journal_details($input_array);
    // $result = $objGl->delete_update_status('gl_journal_receipt_detail', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/delete-jl-journal-main', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->delete_update_status('gl_journal_receipt', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/add-payment-allocation', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->add_payment_allocation($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/add-payment-allocation-customer', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->add_payment_allocation_customer($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/gl/chart-accounts/add-payment-allocation-supplier', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->add_payment_allocation_supplier($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/gl/chart-accounts/convert-posting-receipt', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->convert_posting_receipt($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/convert-posting-receipt-item', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->convert_posting_receipt_item($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-journal-allocated-cust', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_journal_allocated_cust($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-journal-allocated-supp', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_journal_allocated_cust($input_array);
    // $result = $objGl->get_journal_allocated_supp($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-refund-journal', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_refund($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/add-refund-journal', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->add_refund($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
// for currency conversion rate history

<<<<<<< HEAD
$app->post('/gl/chart-accounts/get-currency-conversion-rate-history', function () use ($app) {
=======
/* $app->post('/gl/chart-accounts/get-currency-conversion-rate-history', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_currency_conversion_rate_history($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

$app->post('/gl/chart-accounts/get-invoice-receipt-payment', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_invoice_receipt_payment($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-invoice-remaining-payment', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_invoice_remaining_payment($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

//...//
$app->post('/gl/chart-accounts/delete-invoice-receipt-payment', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->delete_invoice_receipt_payment($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-jl-journal-receipt-payment', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_gl_journal_receipt_payment($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-jl-journal-receipt-payment-customer', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_gl_journal_receipt_payment_customer($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-customer-activity-portal', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->getCustomerActivityPortal($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-jl-journal-receipt-payment-supplier', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_gl_journal_receipt_payment_supplier($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/gl/chart-accounts/get-jl-journal-receipt-payment-item', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_gl_journal_receipt_payment_item($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/gl/chart-accounts/get-all-items-activity', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_all_items_activity($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/accounts-entry', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->accounts_entry($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

/*=============GL Opening Balance Start=============================================*/

$app->post('/gl/chart-accounts/get-opening-balance-list', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_opening_balance_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-opening-balance-by-id', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_opening_balance_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/add-opening-balance', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->add_opening_balance($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/delete-opening-balance', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->delete_update_status('gl_opening_balance', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

/*=============GL Opening Balance End=============================================*/

/*=============GL Opening Balance sub records Start=============================================*/

$app->post('/gl/chart-accounts/get-opening-balance-detail-list', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_opening_balance_detail_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-opening-balance-detail-by-id', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_opening_balance_detail_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/add-opening-balance-detail', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->add_opening_balance_detail($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/delete-opening-balance-detail', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->delete_update_status('gl_opening_balance_detail', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
/*=============GL Opening Balance sub records End=============================================*/


// Posting date range

$app->post('/gl/chart-accounts/get-posting-date-range', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_posting_date_range($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/update-posting-date-range', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->update_posting_date_range($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/bank-statements', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->getBankStatements($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/sil-bank-statements', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->getSilBankStatements($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/change-on-hold-status', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->change_on_hold_status($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-on-hold-status', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_on_hold_status($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/add-comment-on-for-invoice-hold', function () use ($app) {
    global $objGl, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->add_comment_on_for_invoice_hold($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

//-------------------- Trnasfer Orders -----------------------------

$app->post('/gl/chart-accounts/get-all-transfer-orders', function () use ($app) {
    global $objGl, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_all_transfer_orders($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-transfer-order', function () use ($app) {
    global $objGl, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_transfer_order_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/update-transfer-order', function () use ($app) {
    global $objGl, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->update_transfer_order($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/add-jl-transfer-order-item-single', function () use ($app) {
    global $objGl, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->add_jl_transfer_order_item_single($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-transfer-orders-pre-data', function () use ($app) {
    global $objGl, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_transfer_orders_pre_data($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/delete-transfer-order-item', function () use ($app) {
    global $objGl, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->delete_transfer_order_item($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-items-by-warehouse-id', function () use ($app) {
    global $objGl, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_items_by_warehouse_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/post-transfer-order', function () use ($app) {
    global $objGl, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->post_transfer_order($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/gl/chart-accounts/transfer-order-pdf', function () use ($app) {
    global $objGl, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->transfer_order_pdf($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/gl/chart-accounts/get-financial-year-dates', function () use ($app) {
    global $objGl, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_financial_year_dates($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/gl/chart-accounts/get-finance-matrix', function () use ($app) {
    global $objGl, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_finance_matrix($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-sales-matrix', function () use ($app) {
    global $objGl, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_sales_matrix($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-sales-matrix-details', function () use ($app) {
    global $objGl, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_sales_matrix_details($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-purchase-matrix', function () use ($app) {
    global $objGl, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_purchase_matrix($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/gl/chart-accounts/get-purchase-matrix-details', function () use ($app) {
    global $objGl, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_purchase_matrix_details($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/gl/chart-accounts/get-inventory-matrix', function () use ($app) {
    global $objGl, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_inventory_matrix($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/gl/chart-accounts/get-inventory-matrix-details', function () use ($app) {
    global $objGl, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_inventory_matrix_details($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/gl/chart-accounts/get-hr-matrix', function () use ($app) {
    global $objGl, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objGl->get_hr_matrix($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
<<<<<<< HEAD


?>
=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
