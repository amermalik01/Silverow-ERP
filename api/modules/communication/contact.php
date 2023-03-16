<?php

$app->post('/communication/contact/addcontact', function () use ($app) {
    global $objContact, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objContact->addContact($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/contact/editcontact', function () use ($app) {
    global $objContact, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objContact->editContact($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/contact/deletecontact', function () use ($app) {
    global $objContact, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objContact->deleteContact($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/contact/contacts', function () use ($app) {
    global $objContact, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objContact->getContacts($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/communication/contact/smartcontacts', function () use ($app) {
    global $objContact, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objContact->getSmartContacts($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/contact/get_srm_contacts', function () use ($app) {
    global $objContact, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objContact->getSRMcontacts($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/contact/get_crm_contacts', function () use ($app) {
    global $objContact, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objContact->getCRMcontacts($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/contact/get_emp_contacts', function () use ($app) {
    global $objContact, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objContact->getEMPcontacts($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/communication/contact/employeesmartcontacts', function () use ($app) {
    global $objContact, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objContact->getEmployeeSmartContacts($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/contact/contact', function () use ($app) {
    global $objContact, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objContact->getContact($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/contact/uploadfile', function () use ($app) {

    global $objContact, $input, $user_info;

    check_dir_path(UPLOAD_PATH . 'contact_photo');
    $uploads_dir = UPLOAD_PATH . 'contact_photo';

    $tmp_name = $_FILES["file"]["tmp_name"];
    $name = $_FILES["file"]["name"];
    $explode_file = explode(".", $name);
    $new_file_name = mt_rand() . "." . $explode_file[1];
    $var_export = move_uploaded_file($tmp_name, $uploads_dir . "/" . $new_file_name);

    if ($var_export) {
        if ($new_file_name == "") {
            $result['photo'] = "profile.jpg";
        } else {
            $result['photo'] = $new_file_name;
        }
        $result['isError'] = 0;
        $result['message'] = "File uploaded successfully.";
    } else {
        $result['isError'] = 1;
        $result['message'] = "Error in file uploading!<br/>" . $_FILES["file"]["error"];
    }

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
