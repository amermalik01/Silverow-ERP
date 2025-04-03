<?php

// General Tab/ Main Crm Info Module

//--------------------------------------



$app->post('/sales/crm/crm/get-unique-id', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_unique_id($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





$app->post('/sales/crm/crm/listings', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_crm_listings($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-crm', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }



    $result = $objCrm->get_crm_by_id($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});

$app->post('/sales/crm/crm/get-bucket-name-by-id', function () use ($app) {

    global $objCrm, $input;

    $array = array(

        "id" => $input->id

    );



    $result = $objCrm->get_bucket_name_by_id($array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/duplication-chk-crm', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    // print_r($input_array); exit;

    $result = $objCrm->duplicationChkCRM($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/checkAddressDuplication', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    // print_r($input_array); exit;

    $result = $objCrm->checkAddressDuplication($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





$app->post('/sales/crm/crm/updateDuplicationAddress', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    // print_r($input_array); exit;

    $result = $objCrm->updateDuplicationAddress($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





$app->post('/sales/crm/crm/add-crm', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    // print_r($input_array); exit;

    $result = $objCrm->add_crm($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/update-crm', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->update_crm($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/delete-crm', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->delete_crm($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/convert', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->convert($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});

$app->post('/sales/crm/crm/convert-to-crm', function () use ($app) {
    global $objCrm, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objCrm->convertToCRM($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});



$app->post('/sales/crm/crm/get-crm-code', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_crm_code($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});

$app->post('/sales/crm/crm/get-all-route-to-market', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_all_route_to_market($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});

$app->post('/sales/crm/crm/update-route-to-market', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->update_route_to_market($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});

$app->post('/sales/crm/crm/get-route-to-market-associated-indirect-crm', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_route_to_market_associated_indirect_crm($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});







// Alt Contact Module

//--------------------------------------



$app->post('/sales/crm/crm/alt-contacts', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_alt_contacts($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-alt-contact', function () use ($app) {

    global $objCrm, $input;

    /*$array = array(

        "id" => $input->id

    );*/

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }



    $result = $objCrm->get_alt_contact_by_id($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





$app->post('/sales/crm/crm/add-alt-contact', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }



    // print_r($input_array); exit;

    $result = $objCrm->add_alt_contact($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/update-alt-contact', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->update_alt_contact($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-alt-contact-by-id', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_alt_contact_by_id($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/delete-alt-contact', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->delete_alt_contact($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-alt-contacts-list', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_alt_contacts_list($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



/*--------------oppportunity Cycle get pre-requisits data-------*/

$app->post('/sales/crm/crm/get-crm-opp-cycle-pre-data', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_crm_opportunity_cycle_pre_data($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





// Alt Depot Module

//--------------------------------------



$app->post('/sales/crm/crm/get-PrimaryContact-Loc-Assign', function () use ($app) {



    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }



    $result = $objCrm->getPrimaryContactLocAssign($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/alt-depots', function () use ($app) {



    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }



    $result = $objCrm->get_alt_depots($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





$app->post('/sales/crm/crm/get-alt-depot', function () use ($app) {

    global $objCrm, $input;

    /*$array = array(

        "id" => $input->id

    );*/

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }



    $result = $objCrm->get_alt_depot_by_id($input_array);

    //$result = $objCrm->get_alt_depot_by_id($array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





$app->post('/sales/crm/crm/add-alt-depot', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }



    $result = $objCrm->add_alt_depot($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





<<<<<<< HEAD
$app->post('/sales/crm/crm/check-for-depot', function () use ($app) {
=======
/* $app->post('/sales/crm/crm/check-for-depot', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCrm->check_for_depot($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564



$app->post('/sales/crm/crm/update-alt-depot', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->update_alt_depot($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/delete-alt-depot', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->delete_alt_depot($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





// CRM Competitor Module

//--------------------------------------------

$app->post('/sales/crm/crm/crm-competitors', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_crm_competitors($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

});



=======
});


/* 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
$app->post('/sales/crm/crm/get-crm-competitor-files', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->get_crm_competitor_files($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/crm/crm/get-crm-competitor-file', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->get_crm_competitor_file($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/crm/crm/delete-crm-competitor-file', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->delete_crm_competitor_file($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/crm/crm/get-categories', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->get_categories($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564



$app->post('/sales/crm/crm/get-crm-competitor', function () use ($app) {

    global $objCrm, $input;

    /* $array = array(

        "id" => $input->id

    ); */

<<<<<<< HEAD
    
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_crm_competitor_by_id($input_array);

    // $result = $objCrm->get_crm_competitor_by_id($array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





$app->post('/sales/crm/crm/add-crm-competitor', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }



    $result = $objCrm->add_crm_competitor($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/update-crm-competitor', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->update_crm_competitor($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/delete-crm-competitor', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->delete_crm_competitor($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





// Price Offer

//--------------------------------------------

/* $app->post('/sales/crm/crm/price-offers', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->get_price_offers($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/crm/crm/get-price-offer', function () use ($app) {

    global $objCrm, $input;

    $array = array(

        "id" => $input->id

    );

    $result = $objCrm->get_price_offer_by_id($array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

}); */



// price module predata api for add form

$app->post('/sales/crm/crm/price-form-predata', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->price_form_predata($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



<<<<<<< HEAD
 $app->post('/sales/crm/crm/delete-price-offer', function () use ($app) {
=======
$app->post('/sales/crm/crm/delete-price-offer', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->deletePriceOffer($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

}); 



 $app->post('/sales/crm/crm/delete-price-offer-item', function () use ($app) {
=======
});



$app->post('/sales/crm/crm/delete-price-offer-item', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->deletePriceOfferItem($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

}); 



 $app->post('/sales/crm/crm/delete-price-offer-item-volume', function () use ($app) {
=======
});



$app->post('/sales/crm/crm/delete-price-offer-item-volume', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->deletePriceOfferItemVolume($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

}); 



 $app->post('/sales/crm/crm/delete-price-list-additional-cost', function () use ($app) {
=======
});



$app->post('/sales/crm/crm/delete-price-list-additional-cost', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->deletePriceListAdditionalCost($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



/* $app->post('/sales/crm/crm/add-price-offer', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->add_price_offer($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/crm/crm/update-price-offer', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->update_price_offer($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});

 */







// CRM Price Offer Listings

//--------------------------------------------

/* $app->post('/sales/crm/crm/crm-price-offer-listings', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->get_price_offer_listings($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/crm/crm/get-crm-price-offer-listing', function () use ($app) {

    global $objCrm, $input;

    $array = array(

        "id" => $input->id

    );

    $result = $objCrm->get_crm_price_offer_listing_by_id($array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});





$app->post('/sales/crm/crm/add-crm-price-offer-listing', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->add_crm_price_offer_listing($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/crm/crm/update-crm-price-offer-listing', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->update_crm_price_offer_listing($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/crm/crm/delete-crm-price-offer-listing', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->delete_crm_price_offer_listing($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

}); */





// CRM Opportunity Cycle

//-------------------------------------------



$app->post('/sales/crm/crm/opportunity-cycles', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_crm_opportunity_cycles($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-crm-opportunity-cycle', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_crm_opportunity_cycle_by_id($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-crm-opportunity-cycle-by-stageid', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_crm_opportunity_cycle_by_stageid($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-crm-opportunity-cycle-by-type', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_crm_opportunity_cycle_by_type($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-crm-opportunity-cycle-detail', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_crm_opportunity_cycle_detail($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





$app->post('/sales/crm/crm/add-crm-opportunity-cycle', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_crm_opportunity_cycle($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/add-crm-opportunity-cycle-details', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_crm_opportunity_cycle_details($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/update-crm-opportunity-cycle', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->update_crm_opportunity_cycle($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/update-crm-opportunity-cycle-details', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->update_crm_opportunity_cycle_details($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/delete-crm-opportunity-cycle', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->delete_crm_opportunity_cycle($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/complete-crm-opportunity-cycle', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->complete_crm_opportunity_cycle($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-all-opportunity-cycle', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_all_opportunity_cycle($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});







// CRM Promotion

//---------------------------------------------



$app->post('/sales/crm/crm/promotions', function () use ($app) {



    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_crm_promotions($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-promotion', function () use ($app) {

    global $objCrm, $input;

    $array = array(

        "id" => $input->id

    );



    $result = $objCrm->get_crm_promotion_by_id($array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





$app->post('/sales/crm/crm/add-promotion', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_crm_promotion($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/update-promotion', function () use ($app) {

    global $objCrm, $input;



    $result = $objCrm->update_crm_promotion($input);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/delete-promotion', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->delete_crm_promotion($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/update-crm-promotion', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->update_promotions($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/add-promotion-product', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }



    $result = $objCrm->add_crm_promotion_product($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-promotion-products', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }



    $result = $objCrm->get_crm_promotion_products($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/delete-crmpromotion-product', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->delete_crm_promotion_product($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



// CRM Document Module

//--------------------------------------



$app->post('/sales/crm/crm/crm-documents', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_documents($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-crm-document-by-id', function () use ($app) {

    global $objCrm, $input;

    $array = array(

        "id" => $input->id

    );



    $result = $objCrm->get_crm_document_by_id($array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





$app->post('/sales/crm/crm/add-crm-document', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }



    $result = $objCrm->add_crm_document($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/update-crm-document', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->update_crm_document($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



<<<<<<< HEAD
$app->post('/sales/crm/crm/delete-crm-document', function () use ($app) {
=======
/* $app->post('/sales/crm/crm/delete-crm-document', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->delete_crm_document($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564



$app->post('/sales/crm/crm/folders', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }



    $result = $objCrm->get_folders($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/add-folder', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }



    $result = $objCrm->add_folder($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



<<<<<<< HEAD
$app->post('/sales/crm/crm/get-document-code', function () use ($app) {
=======
/* $app->post('/sales/crm/crm/get-document-code', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->get_document_code($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564





// CRM Opportunity Cycle Document Module

//--------------------------------------



$app->post('/sales/crm/crm/crm-opp-documents', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_opp_documents($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-crm-opp-document-by-id', function () use ($app) {

    global $objCrm, $input;

    $array = array(

        "id" => $input->id

    );



    $result = $objCrm->get_crm_opp_document_by_id($array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





$app->post('/sales/crm/crm/add-crm-opp-document', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }



    $result = $objCrm->add_crm_opp_document($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/update-crm-opp-document', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->update_crm_opp_document($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/delete-crm-opp-document', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->delete_crm_opp_document($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/opp-cycle-folders', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }



    $result = $objCrm->get_opp_cycle_folders($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/add-opp-cycle-folder', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }



    $result = $objCrm->add_opp_cycle_folder($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





// Price Offer Volume Module

//--------------------------------------



$app->post('/sales/crm/crm/price-offer-volumes', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_price_offer_volumes($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-price-offer-volume', function () use ($app) {

    global $objCrm, $input;

    $array = array(

        "id" => $input->id

    );



    $result = $objCrm->get_price_offer_volume_by_id($array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





$app->post('/sales/crm/crm/add-price-offer-volume', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }



    // print_r($input_array); exit;

    $result = $objCrm->add_price_offer_volume($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/update-price-offer-volume', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->update_price_offer_volume($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-price-offer-volume-by-id', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_price_offer_volume_by_id($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/delete-price-offer-volume', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->delete_price_offer_volume($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-price-offer-volume-by-type', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_price_offer_volume_by_type($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-items-price-offers-by-custid', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_items_price_offer_by_custid($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});

$app->post('/sales/crm/crm/get-items-promotions-by-custid', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_items_promotions_by_custid($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});

$app->post('/sales/crm/crm/get-items-sale-price', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_items_sales_price_in_date_range($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});

$app->post('/sales/crm/crm/get-items-margin-cost', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_items_margin_cost($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



// Rebate Volume Module

//--------------------------------------



$app->post('/sales/crm/crm/rebate-volumes', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_rebate_volumes($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-rebate-volume', function () use ($app) {

    global $objCrm, $input;

    $array = array(

        "id" => $input->id

    );



    $result = $objCrm->get_rebate_volume_by_id($array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





$app->post('/sales/crm/crm/add-rebate-volume', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }



    // print_r($input_array); exit;

    $result = $objCrm->add_rebate_volume($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/update-rebate-volume', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->update_rebate_volume($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-rebate-volume-by-id', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_rebate_volume_by_id($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/delete-rebate-volume', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->delete_rebate_volume($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-rebate-volume-by-type', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_rebate_volume_by_type($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



// Customer Item Information

//--------------------------------------------

$app->post('/sales/crm/crm/customer-items-info', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_customer_items_info($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





$app->post('/sales/crm/crm/get-customer-item-info', function () use ($app) {

    /* global $objCrm, $input;

      $array = array(

      "id" => $input->id

      ); */

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_customer_item_info_by_id($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





/* $app->post('/sales/crm/crm/get-customer-item-info', function () use ($app) {

  global $objCrm, $input;

  $array = array(

  "id" => $input->id

  );

  $result = $objCrm->get_customer_item_info_by_id($array);

  $app->response->setStatus(200);

  $app->response()->headers->set('Content-Type', 'application/json');

  echo json_encode($result);

  }); */





$app->post('/sales/crm/crm/add-customer-item-info', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_customer_item_info($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/update-customer-item-info', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->update_customer_item_info($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

});



=======
});


/* 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
$app->post('/sales/crm/crm/delete-customer-item-info', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->delete_customer_item_info($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564



// Customer Item Information end

//--------------------------------------------





/* ================      Customer Price info  start   ================== */



/* $app->post('/sales/crm/crm/get-location-list', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->get_location_list($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

}); */



$app->post('/sales/crm/crm/price-offer-listing', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->priceOfferListing($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-price-data', function () use ($app) {



    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->priceOfferbyID($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/add-price-offer', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->addPriceOffer($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/update-price-offer', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->updatePriceOffer($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-item-sales-prices-in-date-range', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_item_sales_prices_in_date_range($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



// price offer item add/edit api call /edit api call 

$app->post('/sales/crm/crm/add-price-offer-item', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->addPriceOfferItem($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



// price offer item volume add/edit api call 

$app->post('/sales/crm/crm/add-price-offer-item-volume', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->addPriceOfferItemVolume($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



// price List item Additional Cost add/edit api call 

$app->post('/sales/crm/crm/add-price-list-additional-cost', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->addPriceListAdditionalCost($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



/* 

$app->post('/sales/crm/crm/customer-price-info', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->get_customer_price_info($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/crm/crm/get-customer-price-info', function () use ($app) {



    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->get_customer_price_info_by_id($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});

$app->post('/sales/crm/crm/add-customer-price-info', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->add_customer_price_info($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



 $app->post('/sales/crm/crm/update-customer-price-info', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->update_customer_price_info($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

}); */



<<<<<<< HEAD
$app->post('/sales/crm/crm/delete-customer-price-info', function () use ($app) {
=======
/* $app->post('/sales/crm/crm/delete-customer-price-info', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->delete_customer_price_info($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});
<<<<<<< HEAD

=======
 */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564




$app->post('/sales/crm/crm/convertion-price-list', function () use ($app) {

    global $objCrm, $input;

    $array = array(

        "id" => $input->id

    );



    $result = $objCrm->conversion_price_list($array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



/* ================      Customer Price info  end   ================== */



///////////////// for volume discount ///////////////



$app->post('/sales/crm/crm/supplier_list', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }



    $result = $objCrm->get_supplier_list_product_id($input_array);

    //print_r($result);exit;

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





/* $app->post('/sales/crm/crm/get-crm-price-volume-discount', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCrm->get_crm_price_volume_discount($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

}); */



$app->post('/sales/crm/crm/supplier_by_id', function () use ($app) {

    global $objCrm, $input;

    $array = array(

        "id" => $input->id

    );



    $result = $objCrm->supplier_by_id($array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/delete_sp_id', function () use ($app) {

    global $objCrm, $input;

    $array = array(

        "id" => $input->id

    );



    $result = $objCrm->delete_sp_id($array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/delete-customer-price-volume', function () use ($app) {

    global $objCrm, $input;

    $array = array(

        "id" => $input->id

    );



    $result = $objCrm->delete_customer_price_volume($array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/add-product-values', function () use ($app) {

    global $objCrm, $input;



    $result = $objCrm->add_product_value($input);



    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/update-product-values', function () use ($app) {

    global $objCrm, $input;



    $result = $objCrm->update_product_value($input);



    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



/* $app->post('/sales/crm/crm/volume_discount_by_id', function () use ($app) {

    global $objCrm, $input;



    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->volume_discount_by_id($input_array);



    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

}); */



$app->post('/sales/crm/crm/get-price-volume-discount-byID', function () use ($app) {

    global $objCrm, $input;



    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->getPriceVolumeDiscountByID($input_array);



    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





// CRM Price offer module

//--------------------------------------------



$app->post('/sales/crm/crm/get-sale-cust-price-offer-volume', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_sale_cust_price_offer_volume($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





$app->post('/sales/crm/crm/add-sale-cust-price-offer-volume', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_sale_cust_price_offer_volume($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/submit-price-volume-discount', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->submitPriceVolumeDiscount($input_array);

    //$result = $objCrm->add_price_volume_discount($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





/* $app->post('/sales/crm/crm/add-cust-price-offer-volume', function () use ($app) {

    global $objCrm, $input;

    $result = $objCrm->add_cust_price_offer_volume($input);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/crm/crm/update-cust-price-offer-volume', function () use ($app) {

    global $objCrm, $input;

    $result = $objCrm->update_cust_price_offer_volume($input);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

}); 



$app->post('/sales/crm/crm/get-cust-price-offer-volume-listing', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }





    $result = $objCrm->get_cust_price_offer_volume_listing($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

}); */



$app->post('/sales/crm/crm/get-price-volume-discount-listing', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_price_volume_discount_listing($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





// CRM Price list module start

//--------------------------------------------



// api to add price module volume 

$app->post('/sales/crm/crm/add-price-volume', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_price_volume($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



// api to get price module volume 

$app->post('/sales/crm/crm/get-price-volume', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_price_volume($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



<<<<<<< HEAD
$app->post('/sales/crm/crm/get-sale-cust-price-list-volume', function () use ($app) {
=======
/* $app->post('/sales/crm/crm/get-sale-cust-price-list-volume', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->get_sale_cust_price_list_volume($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564





/* $app->post('/sales/crm/crm/add-sale-cust-price-list-volume', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->add_sale_cust_price_list_volume($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/crm/crm/add-cust-price-list-volume', function () use ($app) {

    global $objCrm, $input;

    $result = $objCrm->add_cust_price_list_volume($input);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/crm/crm/update-cust-price-list-volume', function () use ($app) {

    global $objCrm, $input;

    $result = $objCrm->update_cust_price_list_volume($input);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/crm/crm/get-cust-price-list-volume-listing', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCrm->get_cust_price_list_volume_listing($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

}); */



<<<<<<< HEAD
$app->post('/sales/crm/crm/update-price-volume-with-NewPrice', function () use ($app) {
=======
/* $app->post('/sales/crm/crm/update-price-volume-with-NewPrice', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objCrm->update_price_volume_with_NewPrice($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564



// CRM Price list module end

//--------------------------------------------



// CRM Rebate Listings

//--------------------------------------------

/* $app->post('/sales/crm/crm/crm-rebate-listings', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->get_rebate_listings($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/crm/crm/get-crm-rebate', function () use ($app) {

    global $objCrm, $input;

    $array = array(

        "id" => $input->id

    );

    $result = $objCrm->get_crm_rebate_by_id($array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

}); */



$app->post('/sales/crm/crm/rebate-listings', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_rebate_listings($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-rebate', function () use ($app) {

    global $objCrm, $input;

    $array = array(

        "id" => $input->id

    );

    $result = $objCrm->getRebatebyID($array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





$app->post('/sales/crm/crm/add-rebate', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->addRebate($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/update-rebate', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->addRebate($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/delete-rebate', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->deleteRebate($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/discard-rebate', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->discardRebate($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





$app->post('/sales/crm/crm/get-rebate-items', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_rebate_items($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-rebate-categories', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_rebate_categories($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});

// Rebate Volume and Revenue Start

//----------------------------------------------------



$app->post('/sales/crm/crm/get-crm-rebate-volume-revenue', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_crm_rebate_volume_revenue($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-rebate-volume-revenue-byid', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_rebate_volume_revenue_byid($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/add-crm-rebate-volume-revenue', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_crm_rebate_volume_revenue($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/update-crm-rebate-volume-revenue', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->update_crm_rebate_volume_revenue($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



// Not in use //  Rebate Volume and Revenue Detail Start

//----------------------------------------------------





$app->post('/sales/crm/crm/get-crm-rebate-volume-revenue-detail', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_crm_rebate_volume_revenue_detail($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/add-crm-rebate-volume-revenue-detail', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_crm_rebate_volume_revenue_detail($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



// Not in use //  Rebate Volume and Revenue Detail End

//----------------------------------------------------



// Rebate Volume and Revenue End

//----------------------------------------------------



$app->post('/sales/crm/crm/add-crm-salesperson', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_crm_salesperson($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/add-crm-salesperson-log', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_crm_salesperson_log($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-crm-salesperson', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_crm_salesperson($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





$app->post('/sales/crm/crm/get-crm-salesperson-employee', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_crm_salesperson_employee($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





$app->post('/sales/crm/crm/get-crm-salesperson-ForOppCycle', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->getCRMSalespersons($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/add-opp-cycle-salesperson', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_opp_cycle_salesperson($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/add-opp-cycle-SupportStaff', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_opp_cycle_SupportStaff($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

});



=======
});


/* 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
$app->post('/sales/crm/crm/add-opp-cycle-salesperson-log', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->add_opp_cycle_salesperson_log($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});
<<<<<<< HEAD

=======
 */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


$app->post('/sales/crm/crm/get-opp-cycle-salesperson', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_opp_cycle_salesperson($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/pref-method-of-comm', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_pref_method_of_comm($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/add-pref-method-of-comm', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_pref_method_of_comm($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/add-crm-segment', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_crm_segment($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-crm-segments', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_crm_segments($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/add-crm-region', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_crm_region($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-crm-regions', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_crm_regions($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/add-alt-location-region', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_alt_location_region($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-alt-location-regions', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_alt_location_regions($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/add-crm-buying-group', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_crm_buying_group($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-crm-buying-groups', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_crm_buying_groups($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/add-credit-rating-log', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_credit_rating_log($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



/*$app->post('/sales/crm/crm/add-credit-limit-log', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->add_credit_limit_log($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});*/



$app->post('/sales/crm/crm/add-status-log', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_status_log($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

});



=======
});


/* 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
$app->post('/sales/crm/crm/all-status', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->get_all_status($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/crm/crm/add-crm-status', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->add_crm_status($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/crm/crm/update-crm-status', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->update_crm_status($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/crm/crm/get-crm-status', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->get_crm_status($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/crm/crm/delete-crm-status', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->delete_crm_status($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});
<<<<<<< HEAD

=======
 */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564




$app->post('/sales/crm/crm/get-all-competitor-volume', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_all_competitor_volume($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/add-all-competitor-volume', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_all_competitor_volume($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





$app->post('/sales/crm/crm/all-owner', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_all_owner($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/add-crm-owner', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_crm_owner($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





$app->post('/sales/crm/crm/add-adddress-type', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_adddress_type($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-all-address-types', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_all_address_types($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



////////////Mudassir///////////////

$app->post('/sales/crm/crm/crm-turnovers', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_crm_turnovers($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/add-crm-turnover', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_crm_turnover($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/crm-history', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_crm_history($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





$app->post('/sales/crm/crm/get-crm-social-media-by-id', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_data_by_id('ref_social_media', $input_array['id']);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/delete-social-media', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }



    $result = $objCrm->delete_update_status('ref_social_media', 'status', $input_array['id']);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





$app->post('/sales/crm/crm/add-social-media', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_social_media($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/social-medias', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_social_medias($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/add-crm-social-media', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_crm_social_media($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/crm-social-medias', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_crm_social_medias($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/delete-crm-social-media', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }



    $result = $objCrm->delete_update_status('crm_social_media', 'status', $input_array['id']);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/add-alt-contact-social-media', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_alt_contact_social_media($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/alt-contact-social-medias', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_alt_contact_social_medias($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/delete-alt-contact-social-media', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }



    $result = $objCrm->delete_update_status('alt_contact_social_media', 'status', $input_array['id']);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/add-crm-credit-rating', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_crm_credit_rating($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/crm-credit-ratings', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_crm_credit_ratings($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





//classification

/*

$app->post('/sales/crm/crm/ref-classifications', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    // echo "inside ref classification";exit;

    $result = $objCrm->get_ref_classifications($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/crm/crm/crm-classifications', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->get_crm_classifications($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/crm/crm/add-crm-classification', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->add_crm_classification($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});

$app->post('/sales/crm/crm/get-crm-classification-by-id', function () use ($app) {

    global $objCrm, $input;

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->get_data_by_id('crm_classification', $input_array['id']);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/sales/crm/crm/delete-crm-classification', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->delete_update_status('crm_classification', 'status', $input_array['id']);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});

*/





<<<<<<< HEAD
$app->post('/sales/crm/crm/add-location-time', function () use ($app) {
=======
/* $app->post('/sales/crm/crm/add-location-time', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->add_location_time($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

<<<<<<< HEAD
});



=======
}); */


/* 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
$app->post('/sales/crm/crm/get-list-location-time', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->get_list_location_time($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564



$app->post('/sales/crm/crm/delete-location-time', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }



    $result = $objCrm->delete_update_status('crm_delivery_time', 'status', $input_array['id']);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





//add location and contact dropdown from tabs

$app->post('/sales/crm/crm/add-list-contact-location', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_contact_location_dropdown($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



//add location and contact from general tab

$app->post('/sales/crm/crm/add-list-contact-location-general', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->add_contact_location_dropdown_general($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-list-contact-location', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_contact_location_dropdown($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





/* ================     Price Module History start   ================== */



<<<<<<< HEAD
$app->post('/sales/crm/crm/get-price-history', function () use ($app) {
=======
/* $app->post('/sales/crm/crm/get-price-history', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->get_price_history($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564



/* $app->post('/sales/crm/crm/get-customer-price-history', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->get_customer_price_history($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

}); */



/* ================     Price Module History End   ================== */



/* ================     Get Customer Rebate History start   ================== */



$app->post('/sales/crm/crm/get-customer-rebate-history', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_customer_rebate_history($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



/* ================     Get Customer Rebate History End   ================== */



/* ================     Get Customer Rebate Volume and Revenue History start   ================== */



$app->post('/sales/crm/crm/get-crm-rebate-volume-revenue-history', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->get_crm_rebate_volume_revenue_history($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



/* ================     Get Customer Rebate Volume and Revenue History End   ================== */



/* ================     Get Price Volume History start   ================== */



<<<<<<< HEAD
$app->post('/sales/crm/crm/get-price-volume-discount-history', function () use ($app) {
=======
/* $app->post('/sales/crm/crm/get-price-volume-discount-history', function () use ($app) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->get_price_volume_discount_history($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

<<<<<<< HEAD
});
=======
}); */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

/* $app->post('/sales/crm/crm/get-customer-price-volume-history', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objCrm->get_customer_price_volume_history($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

}); */



/* ================     Get Price Volume History End   ================== */



// orders





$app->post('/sales/crm/crm/get-crm-salesperson-orders', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->getCRMSalespersons($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-purchase-order', function () use ($app) {
    global $objCrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCrm->getPurchaseOrderListings($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});



$app->post('/sales/crm/crm/get-purchase-order-invoices', function () use ($app) {
    global $objCrm, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objCrm->getPurchaseOrderInvoicesListings($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});



$app->post('/sales/crm/crm/get-purchase-order-for-SO', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->getPurchaseOrderListingsForSO($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-purchase-order-by-sale-id', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->getPurchaseOrderListingsBySaleID($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/get-delivery-locations', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->getDeliveryLocations($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



/* ================     Unsubscribe Email from CRM   ================== */



$app->post('/sales/crm/crm/unsubscribe-email-from-CRM', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }

    $result = $objCrm->unsubscribeEmail($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});





/* ================     Customer Portal Settings  ================== */



$app->post('/sales/crm/crm/get-portal-settings', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }



    $result = $objCrm->getPortalSettings($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/update-portal-settings', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

    }

    
=======
    }


>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    $result = $objCrm->updatePortalSettings($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
});



$app->post('/sales/crm/crm/send-portal-link-email', function () use ($app) {

    global $objCrm, $input;

    $input_array = array();



    foreach ($input as $key => $val) {

        $input_array[$key] = $val;
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }



    $result = $objCrm->sendPortalLinkEmail($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);
<<<<<<< HEAD

});



?>
=======
});
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
