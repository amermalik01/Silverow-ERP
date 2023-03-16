<?php

// General Document



$app->post('/communication/document_list', function () use ($app) {

    global $objdoc, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objdoc->get_document_all_main($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});





$app->post('/communication/document/document_list_all_tabs', function () use ($app) {

    global $objdoc, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objdoc->document_list_all_tabs($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/communication/document/get_document_folder_main', function () use ($app) {

    global $objdoc, $input;



    $result = $objdoc->get_documents_folder_main($input, 0);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});





$app->post('/communication/document/get-doc-by-id', function () use ($app) {

    global $objdoc, $input;



    $result = $objdoc->get_data_by_id('document', $input->id);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/communication/document/get_column_byid', function () use ($app) {

    global $objdoc, $input;

    $array = array(

        "tab_id" => $input->Id

    );

    $result = $objdoc->get_list_by_tab_id($array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/communication/document/get-selected-category', function () use ($app) {

    global $objdoc, $input;

    $array = array(

        "tab_id" => $input->tab_id

    );

    $result = $objdoc->get_selected_category($array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/communication/document/add-tab-col', function () use ($app) {

    global $objdoc, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objdoc->add_document_all_main($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});





$app->post('/communication/document/update-tab-col', function () use ($app) {

    global $objdoc, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objdoc->add_document($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/communication/document/delete-tab-col', function () use ($app) {

    global $objdoc, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objdoc->delete_update_status('document', 'status', $input_array['id']);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});





$app->post('/communication/document/set-default-image', function () use ($app) {

    global $objdoc, $input;

    $input_array = array(

        "id" => $input->id,

        "rid" => $input->rid,

        "rfImg" => $input->rfImg

    );



    $result = $objdoc->set_default_image('ref_image', 'default_flag', $input_array['id'], $input_array['rid'], $input_array['rfImg']);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);



});

$app->post('/communication/document/image-list', function () use ($app) {

    global $objdoc, $input;

    if (isset($input->sidebar)) {

        $array = array();

    } else {

        $array = array(

            "row_id" => $input->row_id,

            "module_id" => $input->module_id

        );

    }



    $result = $objdoc->get_images_all_list($array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);



});



$app->post('/communication/document/image-by-id', function () use ($app) {

    global $objdoc, $input;

    $input_array = array(

        "id" => $input->id

    );

    $result = $objdoc->get_image_by_id($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);



});



$app->post('/communication/document/delete-image', function () use ($app) {

    global $objdoc, $input;

    $input_array = array(

        "id" => $input->id

    );



    $result = $objdoc->delete_update_status('ref_image', 'status', $input_array['id']);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);



});



$app->post('/communication/document/image-code', function () use ($app) {

    global $objdoc, $input;

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objdoc->get_image_code($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);



});



$app->post('/communication/document/update-image', function () use ($app) {

    global $objdoc, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objdoc->update_image($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);



});





$app->post('/communication/document/image-folder', function () use ($app) {

    global $objdoc, $input;

    $array = array(

        "module_id" => $input->module_id

    );

    $result = $objdoc->get_image_folder_list($array, 0);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/communication/document/image-sub-folder', function () use ($app) {

    global $objdoc, $input;

    $array = array(

        "module_id" => $input->module_id

    );

    $result = $objdoc->get_image_folder_list($array, 1);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/communication/document/add-image-folder', function () use ($app) {

    global $objdoc, $input;

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objdoc->add_image_folder($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/communication/document/edit-image-folder', function () use ($app) {

    global $objdoc, $input;

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }



    $result = $objdoc->edit_image_folder($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});





$app->post('/communication/document/upload_emp_image', function () use ($app) {

    global $objdoc, $input, $user_info;



    /*	$array = array(

                    "employee_id"=> $input->employee_id,

                    "employee_id2"=> $input->id

        );





      print_r($input);	 print_r($array);	  echo "here in uploading";exit;

    */

    // check company path

    //check_dir_path(UPLOAD_PATH.'emp_images');

    check_dir_path(UPLOAD_PATH . 'company_logo_temp');

    // check company images path



    $uploads_dir = UPLOAD_PATH . 'company_logo_temp';

    $tmp_name = $_FILES["file"]["tmp_name"];

    $name = $_FILES["file"]["name"];

    $explode_file = explode(".", $name);

    $new_file_name = mt_rand() . "." . $explode_file[1];





    //echo "Full Path = ".$uploads_dir."/".$new_file_name;exit;

    $uploadOk = 1;





// Check if image file is a actual image or fake image

    if (isset($_FILES)) {

        $check = getimagesize($_FILES["file"]["tmp_name"]);

        if ($check !== false) {

            $msg = "File is an image - " . $check["mime"] . ".";

            $uploadOk = 1;

        } else {

            $msg = "File is not an image.";

            $uploadOk = 0;

        }

    }

    //echo upload_limit;

    //   echo $_FILES["file"]["size"] ;

// Check file size

    if ($_FILES["file"]["size"] > upload_limit) {

        $msg = "Sorry, your file is too large.";

        $uploadOk = 0;

    }

    $imageFileType = pathinfo($new_file_name, PATHINFO_EXTENSION);

// Allow certain file formats

    if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif") {

        $msg = "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";

        $uploadOk = 0;

    }



    if ($uploadOk > 0) {

        // upload file

        $var_export = move_uploaded_file($tmp_name, $uploads_dir . "/" . $new_file_name);

    }



//  $result = $objdoc->update_emp_pic($new_file_name ,$employee_id); 

    if ($var_export) {

        $response['ack'] = 1;

        $response['response'] = $new_file_name;

    } else {

        $response['ack'] = 0;

        //$response['response'] = "Error in files uploading Please check Size and Format JPG, Word or PDF!".$message;



        $response['response'] = "Error !" . $msg;

    }





    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($response);

});



$app->post('/communication/document/upload_doc', function () use ($app) {

    global $objdoc, $input, $user_info;



    //check_dir_path(UPLOAD_PATH.'emp_images');

    check_dir_path(UPLOAD_PATH . 'company_logo_temp');

    // check company images path



    $uploads_dir = UPLOAD_PATH . 'company_logo_temp';

    $tmp_name = $_FILES["file"]["tmp_name"];

    $name = $_FILES["file"]["name"];

    $name = str_replace(' ', '_', $name);

    $explode_file = explode(".", $name);

    //$new_file_name = mt_rand().".".$explode_file[1];

    $extention = strtolower(substr($name, strrpos($name, ".") + 1));

    $new_file_name = preg_replace('/[^A-Za-z0-9\-]/', '', $explode_file[0]);// mt_rand().".".$extention;



    $uploadOk = 1;

    // Check file size

    if ($_FILES["file"]["size"] > upload_limit) {

        $msg = "Sorry, your file is too large.";

        $uploadOk = 0;

    }

    // $imageFileType = pathinfo($new_file_name,PATHINFO_EXTENSION);

    $imageFileType = "." . $extention;

    //  echo $imageFileType;exit;



    // Allow certain file formats

    if ($imageFileType != ".jpg" && $imageFileType != ".png" && $imageFileType != ".jpeg" && $imageFileType != ".gif"

        && $imageFileType != ".doc" && $imageFileType != ".docx" && $imageFileType != ".pdf" && $imageFileType != ".xlsx"

        && $imageFileType != ".xls" && $imageFileType != ".txt"

    ) {

        $msg = "Sorry, only JPG, JPEG, PNG & GIF  DOC Excel and PDF is  files are Allowed.";

        $uploadOk = 0;

    }



    if ($imageFileType == ".jpg" || $imageFileType == "png" || $imageFileType == ".jpeg" || $imageFileType == ".gif")

        $image_number = 1;



    if ($imageFileType == ".doc" || $imageFileType == ".docx" || $imageFileType == ".pdf")

        $image_number = 2;



    if ($uploadOk > 0) $var_export = move_uploaded_file($tmp_name, $uploads_dir . "/" . $new_file_name);



//  $result = $objdoc->update_emp_pic($new_file_name ,$employee_id); 

    if ($var_export) {

        $response['ack'] = 1;

        $response['FileType'] = $imageFileType;

        $response['image_number'] = $image_number;

        $response['response'] = $new_file_name;

        $response['name'] = $new_file_name;

    } else {

        $response['ack'] = 0;

        //$response['response'] = "Error in files uploading Please check Size and Format JPG, Word or PDF!".$message;

        $response['response'] = "Error !" . $msg;

    }



    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($response);

});

$app->post('/communication/document/comments-listings', function () use ($app) {

    global $objdoc, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objdoc->get_comment_listings($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/document/comments-listings2', function () use ($app) {

    global $objdoc, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objdoc->get_comment_listings2($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});



$app->post('/communication/document/get-comments', function () use ($app) {

    global $objdoc, $input;

    $array = array(

        "id" => $input->id

    );



    $result = $objdoc->get_comment_by_id($array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/communication/document/update-comments', function () use ($app) {

    global $objdoc, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objdoc->update_comment($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/communication/document/delete-comments', function () use ($app) {

    global $objdoc, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objdoc->delete_comment($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});





$app->post('/communication/document/document_parent_child_folder', function () use ($app) {

    global $objdoc, $input;



    $result = $objdoc->document_parent_child_folder($input);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);



});



$app->post('/communication/document/document_list', function () use ($app) {

    global $objdoc, $input;

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objdoc->get_documents_all_list($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);



});



$app->post('/communication/document/document_by_id', function () use ($app) {

    global $objdoc, $input;

    $input_array = array(

        "id" => $input->id

    );

    $result = $objdoc->get_document_id($input_array);

    // $result = $objdoc->get_data_by_id('document',$input_array['id']);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);



});



$app->post('/communication/document/delete_document', function () use ($app) {

    global $objdoc, $input;

    $input_array = array(

        "id" => $input->id

    );



    $result = $objdoc->delete_update_status('document', 'status', $input_array['id']);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);



});



$app->post('/communication/document/doc_code', function () use ($app) {

    global $objdoc, $input;

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objdoc->doc_code($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);



});



$app->post('/communication/document/update_documents', function () use ($app) {

    global $objdoc, $input;

    $input_array = array();

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objdoc->update_documents($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);



});



$app->post('/communication/document/document_folder', function () use ($app) {

    global $objdoc, $input;

    $array = array(

        "module_id" => $input->module_id

    );

    $result = $objdoc->get_documents_folder_list($array, 0);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/communication/document/document_sub_folder', function () use ($app) {

    global $objdoc, $input;

    $array = array(

        "module_id" => $input->module_id

    );

    $result = $objdoc->get_documents_folder_list($array, 1);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/communication/document/submit_folder_form', function () use ($app) {

    global $objdoc, $input;

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objdoc->add_document_folder($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/communication/document/update-folder', function () use ($app) {

    global $objdoc, $input;

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objdoc->edit_document_folder($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/communication/document/get-folder-list-from-permision', function () use ($app) {

    global $objdoc, $input;

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objdoc->get_folder_list_from_permision($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});





$app->post('/communication/document/get-folder-permision', function () use ($app) {

    global $objdoc, $input;

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objdoc->get_folder_permision($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/communication/document/add-folder-permision', function () use ($app) {

    global $objdoc, $input;

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objdoc->add_folder_permision($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});



$app->post('/communication/document/document_list_module', function () use ($app) {

    global $objdoc, $input;

    foreach ($input as $key => $val) {

        $input_array[$key] = $val;

    }

    $result = $objdoc->document_list_module($input_array);

    $app->response->setStatus(200);

    $app->response()->headers->set('Content-Type', 'application/json');

    echo json_encode($result);

});





//--------------------------------------

?>