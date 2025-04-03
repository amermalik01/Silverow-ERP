<?php

require 'Slim/Slim.php';



require_once 'classes/Config.Inc.php';

\Slim\Slim::registerAutoloader();



$app = new \Slim\Slim();



#Getting Request

//json_encode($request->getBody()) ?: $request->params();  $request->getParams()



$request = $app->request();



// if (isset($_GET['token'])){

if (isset($_REQUEST['token'])){

    $request = $app->request()->params('params');

    $input = array();

   // $body =$request->getBody();

} 

else{

    $body = $request->getBody();

    $input = json_decode($body);

}



if (isset($_POST['image_token'])) {

    $input = $_FILES;

    $user_info = $objAuth->authentocate($_POST['image_token']);

} 

else if (isset($_REQUEST['token'])) {

    $user_info = $objAuth->authentocate($_REQUEST['token']);

}

else if (isset($_GET['state'])){

    // callback from HMRC

    $token = explode("*",$_GET['state'])[0];

    $user_info = $objAuth->authentocate($token);

}

else if (isset($_GET['alpha'])){



    $key = hash('sha256', SECRET_KEY);

    $iv = substr(hash('sha256', SECRET_IV), 0, 16);

    $outputInvName = openssl_decrypt(base64_decode($_GET['alpha']), SECRET_METHOD, $key, 0, $iv);



    // $outputInvNamePath = WEB_PATH . '/api/setup/sale_invoice?alpha=';



    // echo $outputInvNamePath.$outputInvName;exit;



    $basePath = UPLOAD_PATH . 'attachments/';

    $file_url = $basePath . $outputInvName;   



    $fileName = explode(".",$outputInvName);



    $pdfName = $fileName[1].'.pdf';

    

    if(!(strlen($fileName[1])>0))

        $pdfName = $outputInvName;



        // echo $file_url; exit;

        header("Content-type:application/pdf");

    // It will be called downloaded.pdf

    header("Content-Disposition:inline;filename=".$pdfName."");

    header('Content-Transfer-Encoding: binary');

    header('Accept-Ranges: bytes');



    // The PDF source is in original.pdf

    @readfile($file_url);



    // redirect($file_url);

    // open_window($file_url);

    //  echo '<script type="text/javascript">

    //             window.open("'.$file_url.'");

    //         </script>'; 

    // header("Location: ".$file_url);



    // $myfile = fopen($file_url, "r") or die("File does not exist!"); 



    // header('Location: '.$outputInvNamePath.$outputInvName);

    exit;

}else if (isset($_GET['beta'])){



    $key = hash('sha256', SECRET_KEY);

    $iv = substr(hash('sha256', SECRET_IV), 0, 16);

    $outputInvName = openssl_decrypt(base64_decode($_GET['beta']), SECRET_METHOD, $key, 0, $iv);



    $basePath = UPLOAD_PATH . 'attachments/';

    if (isset($_GET['report'])){

        $basePath = TEMPLATES_PATH. '/views/invoice_templates_pdf/';

    }



    $file_url = $basePath . $outputInvName;



    $downloadName = $_GET['name'];



    header("Content-Description: File Transfer"); 

    header("Content-Type: application/octet-stream"); 

    header("Content-Disposition: attachment; filename=" . $downloadName); 

    header('Expires: 0');
	header('Cache-Control: must-revalidate');
	header('Pragma: public');
	// header('Content-Length: ' . filesize($filename));

    ob_clean();



    // The PDF source is in original.pdf

    @readfile($file_url);



    // redirect($file_url);

    // open_window($file_url);

    //  echo '<script type="text/javascript">

    //             window.open("'.$file_url.'");

    //         </script>'; 

    // header("Location: ".$file_url);



    // $myfile = fopen($file_url, "r") or die("File does not exist!"); 



    // header('Location: '.$outputInvNamePath.$outputInvName);

    exit;

}

else if (isset($_GET['zip'])){

        

    $key = hash('sha256', SECRET_KEY);

    $iv = substr(hash('sha256', SECRET_IV), 0, 16);

    $outputInvName = openssl_decrypt(base64_decode($_GET['zip']), SECRET_METHOD, $key, 0, $iv);



    // $outputInvNamePath = WEB_PATH . '/api/setup/sale_invoice?alpha=';



    // echo $outputInvNamePath.$outputInvName;exit;



    $basePath = UPLOAD_PATH . 'attachments/';

    $file_url = $basePath . $outputInvName. ".zip"; 

        

    // print_r($file_url);exit;

   



    $fileName = explode(".",$outputInvName);

    

    

    $pdfName = $fileName[0].'.zip';

    



    if(!(strlen($fileName[0])>0))

        {

            $pdfName = $outputInvName;

        }

        



    // It will be called downloaded.pdf

    header("Content-type:application/zip");

    header("Content-Disposition:attachment;filename=$pdfName");

    header('Content-Transfer-Encoding: binary');

    header('Accept-Ranges: bytes');



    // The PDF source is in original.pdf

    @readfile($file_url);



    exit;

}

else {

    $input = json_decode($body);

    $user_info = $objAuth->authentocate($input->token);

}

//print_r($_GET);

//print_r($user_info);

//exit;



/* else if (isset($_GET['token'])) {

    $user_info = $objAuth->authentocate($_GET['token']);

} */



$path = $app->request()->getPathInfo();

// echo $path;exit;

$objFilters = new Filters($user_info);





if (strpos($path, "setup/warehouse") !== false) {

    require_once(SERVER_PATH . "/classes/Warehouse.php");

    $objWarehouse = new Warehouse($user_info);

    require_once(SERVER_PATH . '/modules/setup/warehouse.php');

}



else if (strpos($path, "setup/service") !== false) {

    require_once(SERVER_PATH . "/classes/Services.php");

    $objServices = new Services($user_info);



    if (strpos($path, "setup/service/brands") !== false) {

        require_once(SERVER_PATH . '/modules/setup/service/brands.php');

    } 

    else if (strpos($path, "setup/service/categories") !== false) {//echo 'there';

        require_once(SERVER_PATH . '/modules/setup/service/categories.php');

    } 

    else if (strpos($path, "setup/service/cat-unit") !== false) {

        require_once(SERVER_PATH . '/modules/setup/service/cat_units_of_measure.php');

    } 

    else if (strpos($path, "setup/service/unit-measure") !== false) {

        require_once(SERVER_PATH . '/modules/setup/service/units_of_measure.php');

    } 

    else if (strpos($path, "setup/service/product-tabs") !== false) {

        require_once(SERVER_PATH . '/modules/setup/service/product_tabs.php');

    } 

    else if (strpos($path, "setup/service/product-tabs-col") !== false) {

        require_once(SERVER_PATH . '/modules/setup/service/product_tabs_col.php');

    } 

    else if (strpos($path, "setup/service/product-tab-values") !== false) {

        require_once(SERVER_PATH . '/modules/setup/service/product_tab_values.php');

    } 

    else if (strpos($path, "setup/service/products-listing") !== false) {

        require_once(SERVER_PATH . '/modules/setup/service/products_listing.php');

    }

}



else if (strpos($path, "setup/srm") !== false) {

    require_once(SERVER_PATH . "/classes/Setupsrm.php");

    $objSetupsrm = new Setupsrm($user_info);    //echo 'here';exit;

    require_once(SERVER_PATH . '/modules/setup/srm.php');

}

else if (strpos($path, "setup/supplier") !== false) {

    require_once(SERVER_PATH . "/classes/Supplier.php");

    $objSetupsupplier = new Supplier($user_info);    //echo 'here';exit;

    require_once(SERVER_PATH . '/modules/setup/supplier.php');

}



require_once(SERVER_PATH. "/classes/QueryMaster.php");

$objQueryMaster = new QueryMaster($user_info);





require_once(SERVER_PATH . "/classes/Setup.php");

$objSetup = new Setup($user_info);

require_once(SERVER_PATH . "/classes/Attachments.php");

    $objAtt = new Attachments($user_info);    //echo 'here';exit;

if (strpos($path, "setup/general") !== false) 

    require_once(SERVER_PATH . '/modules/setup/general.php');



else if (strpos($path, "setup/supplier") !== false) 

    require_once(SERVER_PATH . '/modules/setup/supplier.php');



else if (strpos($path, "setup/ledger-group") !== false) 

    require_once(SERVER_PATH . '/modules/setup/ledger-group.php');



else if (strpos($path, "setup/crm") !== false) 

    require_once(SERVER_PATH . '/modules/setup/crm.php');



else if (strpos($path, "setup/hr") !== false) 

    require_once(SERVER_PATH . '/modules/setup/hr.php');



else if (strpos($path, "setup/region") !== false) 

    require_once(SERVER_PATH . '/modules/setup/region.php');



else if (strpos($path, "setup/srm_region") !== false) 

    require_once(SERVER_PATH . '/modules/setup/srm_region.php');



else if (strpos($path, "setup/territories_hr") !== false) require_once(SERVER_PATH . '/modules/setup/hr_territories.php');



else if (strpos($path, "setup/ownership") !== false) 

    require_once(SERVER_PATH . '/modules/setup/ownership_type.php');



else if (strpos($path, "setup/credit-rating") !== false) 

    require_once(SERVER_PATH . '/modules/setup/credit_rating.php');



else if (strpos($path, "setup/competitors") !== false) 

    require_once(SERVER_PATH . '/modules/setup/competitors.php');



else if (strpos($path, "setup/attachments") !== false) {

    //print_r($objAtt);exit;

    require_once(SERVER_PATH . '/modules/attachments/attachments.php');



}

    

$app->run();