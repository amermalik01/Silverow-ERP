<?php
require 'Slim/Slim.php';
require_once 'classes/Config.Inc.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim(); 

#Getting Request
$request = $app->request();
$body = $request->getBody();
$input = json_decode($body);

$app->post('/user/login', function () use ($app) {
    global $objAuth, $input;

    if(isset($input->cust)){

        $key = hash('sha256', SECRET_KEY);
        $iv = substr(hash('sha256', SECRET_IV), 0, 16);
        $outputInvName = openssl_decrypt(base64_decode($input->cust), SECRET_METHOD, $key, 0, $iv);
        $fileName = explode(",",$outputInvName);

        // echo '<pre>';print_r($fileName);exit;

        $customerID = $fileName[1];
        $portalUserName = $fileName[2];
        $portalUserPassword = $fileName[3];
        $portalCompanyID = $fileName[4];

        if($input->user_name == $portalUserName && $input->password == $portalUserPassword){

            $array = array(
                "user_name" => $input->user_name,
                "password" => $input->password,
                "cust" => $customerID,
                "portalUserName" => $portalUserName,
                "portalUserPassword" => $portalUserPassword,
                "portalCompanyID" => $portalCompanyID
            );
        }
        else{
            $array = array(
                "user_name" => $input->user_name,
                "password" => $input->password
            );
        }
    }
    else{
        $array = array(
            "user_name" => $input->user_name,
            "password" => $input->password
        );
    }
    
    // echo '<pre>';print_r($array);exit;
    $result = $objAuth->login($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->get('/user/login', function () use ($app) {
    
    global $objAuth, $input;
    $req = $app->request();
    $user_name = $req->get('user_name');
    $password = $req->get('password');
    $fromNode = $req->get('fromNode');
    $array['user_name'] = $user_name;
    $array['password']  = $password;
    $array['fromNode'] = $fromNode;
    $result = $objAuth->getToken($user_name, $password);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/user/upload', function () use ($app) {
    print_r($input);
    echo "<hr>";
    print_r($_FILES);
});

$app->post('/user/login/test', function () use ($app) {
    require_once(SERVER_PATH . "/classes/Hr.php");
    $objHr = new Hr($user_info);

    global $objHr, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objHr->get_all_table($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);


});


$app->run();