<?php

$app->post('/communication/mail/isconfigurationexist', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->isConfigurationExist($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/addclientconfiguration', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->addClientConfiguration($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/updateclientconfiguration', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->updateClientConfiguration($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/clientconfig', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->getClientConfiguration($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/search', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->getIMAPSearchResults($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/isimapvalid', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->isIMAPConfigValid($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/unread', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->hasUnreadMails($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/mailsfolders', function () use ($app) {
    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->getMailsFolders($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/signature', function () use ($app) {
    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->getSignature($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/mailfolders', function () use ($app) {
    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->getMailFolders($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/folders', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->getFolders($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/inbox', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->getInbox();

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/inboxmessage', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->getInboxMessage($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/folder', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->getFolder($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/folder-listing', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objMail->getFolder_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});




$app->post('/communication/mail/foldermessage', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->getFolderMessage($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/createsubfolder', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->createSubFolder($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/renamefolder', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->renameFolder($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/deletefolder', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->deleteFolder($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/downloadattachment', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->downloadAttachment($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/setflags', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->setFolderMessageFlags($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/unsetflags', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->unsetFolderMessageFlags($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

/* $app->post('/communication/mail/sendmail', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->sendMail($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
}); */

$app->post('/communication/mail/save_mail_internal', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->SaveMailInternal($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/communication/mail/save_draft_internal', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->SaveDraftlInternal($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/reply_mail_internal', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->ReplyMailInternal($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/get_emails_internal', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->getEmailInternalListing($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/get_draft_emails_internal', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->getDraftsInternalListing($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/move-archive-emails', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->move_archive_emails($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/communication/mail/move-inbox-emails', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->move_inbox_emails($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/delete-emails', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->delete_emails($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
// $app->post('/communication/mail/savemail', function () use ($app) {

//     global $objMail, $input;
//     $input_array = array();
//     foreach ($input as $key => $val) {
//         $input_array[$key] = $val;
//     }

//     $result = $objMail->saveMail($input_array);

//     $app->response->setStatus(200);
//     $app->response()->headers->set('Content-Type', 'application/json');
//     echo json_encode($result);
// });

$app->post('/communication/mail/getVirtualAccounts', function () use ($app) {
// this will get virtual accounts by employee
    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
	
    $result = $objMail->getVirtualAccounts($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

function safe_json_encode($value, $options = 0, $depth = 512){
    $encoded = json_encode($value, $options, $depth);
    switch (json_last_error()) {
        case JSON_ERROR_NONE:
            return $encoded;
        case JSON_ERROR_DEPTH:
            return 'Maximum stack depth exceeded'; // or trigger_error() or throw new Exception()
        case JSON_ERROR_STATE_MISMATCH:
            return 'Underflow or the modes mismatch'; // or trigger_error() or throw new Exception()
        case JSON_ERROR_CTRL_CHAR:
            return 'Unexpected control character found';
        case JSON_ERROR_SYNTAX:
            return 'Syntax error, malformed JSON'; // or trigger_error() or throw new Exception()
        case JSON_ERROR_UTF8:
            $clean = utf8ize($value);
            return safe_json_encode($clean, $options, $depth);
        default:
            return 'Unknown error'; // or trigger_error() or throw new Exception()

    }
}

function utf8ize($mixed) {
    if (is_array($mixed)) {
        foreach ($mixed as $key => $value) {
            $mixed[$key] = utf8ize($value);
        }
    } else if (is_string ($mixed)) {
        return utf8_encode($mixed);
    }
    return $mixed;
}

$app->post('/communication/mail/getInboxEmails', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
	
    $result = $objMail->getInboxEmails($input_array);
    // // print_r($result);
    // echo utf8_encode($result);
    // echo utf8_last_error();exit;
    // print_r($result);
    // echo PHP_EOL."------".PHP_EOL;
    echo safe_json_encode($result);
    // print_r(json_last_error());exit;
    
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
});

$app->post('/communication/mail/getDraftEmails', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
	
    $result = $objMail->getDraftEmails($input_array);
    // // print_r($result);
    // echo utf8_encode($result);
    // echo utf8_last_error();exit;
    // print_r($result);
    // echo PHP_EOL."------".PHP_EOL;
    echo safe_json_encode($result);
    // print_r(json_last_error());exit;
    
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
});

$app->post('/communication/mail/getModuleEmails', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
	
    $result = $objMail->getModuleEmails($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/configurations', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
	
    $result = $objMail->getMailConfigurations($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/configurationbyid', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->getMailConfigurationById($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/getDomains', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->getDomains($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/addVirtualEmail', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->addVirtualEmail($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->get('/communication/mail/getAllVirtualEmailsWithConfiguration', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->getAllVirtualEmailsWithConfiguration($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->get('/communication/mail/getVirtualEmailsWithConfiguration', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->getVirtualEmailsWithConfiguration($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/getVirtualEmails', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->getVirtualEmails($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/deleteVirtualMail', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->deleteVirtualMail($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/deletemail', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->deleteMail($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/deletemessage', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->deleteMessage($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/movemessage', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->moveMessage($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/userinfo', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->getUserInfo($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/new', function () use ($app) {

    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->getNewMailCount($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/uploadfile', function () use ($app) {
    global $objMail, $input, $user_info;
        
	check_dir_path(UPLOAD_PATH.'mail_attachments');
	$uploads_dir = UPLOAD_PATH.'mail_attachments';
	
      /*  echo "Files<pre>";
        print_r($_FILES["file"]);
        echo "</pre>";*/
	$tmp_name = $_FILES["file"]["tmp_name"];
	$name = $_FILES["file"]["name"];
	$explode_file = explode(".", $name);
	$new_file_name = mt_rand().".".$explode_file[1];
	$var_export = move_uploaded_file($tmp_name, $uploads_dir."/".$new_file_name);
	
	if($var_export){
                $result['ack'] = 1;
                $result['fileName'] = $name;
				$result['newFileName'] = $new_file_name;
	}else{
		$result['response'] = "Error in files uploading!";
	}
	
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});



$app->post('/communication/mail/new_unread_mail', function () use ($app) { 
    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->getunreadMailCount($input_array); 
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

// -------------- Email Integration ----------------------//


$app->get('/communication/mail/getToken', function () use ($app) { 
    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    //echo 'hello';exit;
    $req = $app->request();
    $user_id = $req->get('user_id');
    $secret = $req->get('secret');
    $result = $objMail->getToken($user_id, $secret); 
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->get('/communication/mail/verifyToken', function () use ($app) { 
    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    // don't need to do anything just return status 200
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/refreshToken', function () use ($app) { 
    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->refreshToken($input_array); 
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->get('/communication/mail/getAllEmployeeEmails', function () use ($app) {
    global $objMail, $input;

    $result = $objMail->getAllEmployeeEmails(); 
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->get('/communication/mail/getEmployeeEmails', function () use ($app) { 
    
    global $objMail, $input;

    $result = $objMail->getEmployeeEmails(); 
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->get('/communication/mail/getPrimaryConfiguration', function () use ($app) {
    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->getPrimaryConfiguration($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/updateInboxEmailSender', function () use ($app) { 
    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objMail->updateInboxEmailSender($input_array); 
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/unlinkRecord', function () use ($app) { 
    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objMail->unlinkRecord($input_array); 
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/getAssociations', function () use ($app) { 
    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objMail->getAssociations($input_array); 
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/unreadStatusUpdate', function () use ($app) { 
    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objMail->unreadStatusUpdate($input_array); 
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/UploadEmailCompanyLess', function () use ($app) { 
    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objMail->UploadEmailCompanyLess($input_array); 
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/UploadEmail', function () use ($app) { 
    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objMail->UploadEmail($input_array); 
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/Logout', function () use ($app) { 
    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->Logout($input_array); 
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/communication/mail/get-all-emails', function () use ($app) { 
    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->GetAllEmails($input_array); 
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});



$app->post('/communication/mail/attachment', function() use ($app) {
    $files = $_FILES;
    $destFileName = "";
    if(!empty($_FILES['file'])){
      $destFileName = "C:/xampp/htdocs/silverow/upload/attachments/" . $_FILES['file']['name'];
      move_uploaded_file($_FILES['file']['tmp_name'], $destFileName);
    }
    echo json_encode(array(
      'file' => array(
        'path' => $destFileName
      )
    ));
  });
  
  $app->post('/communication/mail/sendmail', function () use ($app) {
    global $objMail, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objMail->sendEmailFromModule($input_array); 
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

    //echo $result;
  });
  $app->post('/communication/mail/getmail', function () use ($app) {
    global $objMail, $input;
    $array = array(
        "to" => $input->to_recipients,
        "from" => $input->from,
        "subject" => $input->subject,
        "body" => $input->body,
        "cc"=>$input->cc_recipients,
        "bcc"=>$input->bcc_recipients
    );
    // $array = json_encode($array);
    $result = $objMail->getEmails($array);
    echo $result;
  });
  $app->post('/communication/mail/updatereadstatus', function () use ($app) {
    global $objMail, $input;
    $array = array(
        "id" => $input->id
    );
    // $array = json_encode($array);
    // print_r($array);die;
    $result = $objMail->updateReadStatus($array);
    echo $result;
  });
  $app->post('/communication/mail/sender', function () use ($app) {
    global $objMail, $input;
    $result = $objMail->getSender();
    echo $result;
  });
  
  $app->post('/communication/mail/savemail', function () use ($app) {
    global $objMail, $input;
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    
    $result = $objMail->saveEmail($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
  });

