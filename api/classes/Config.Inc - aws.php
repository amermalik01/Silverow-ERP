<?php
error_reporting(E_ALL) ;
ini_set('display_errors', '1'); 
error_reporting(E_ERROR);
// error_reporting(0);
//echo getcwd();

if (!defined('DATABASE_TYPE')) define('DATABASE_TYPE','mysqli');
if (!defined('DATABASE_HOST')) define('DATABASE_HOST','aafwl3rulabia.cggfbf9xic5k.us-east-1.rds.amazonaws.com');
if (!defined('DATABASE_USER')) define('DATABASE_USER','ulvm5uotocpba');
if (!defined('DATABASE_PASSWORD')) define('DATABASE_PASSWORD','dbwmqgzwoqrala');
if (!defined('DATABASE_NAME')) define('DATABASE_NAME','silverowdb');  

//echo ' ====  '.$_SERVER['DOCUMENT_ROOT'].' ====  ';

 if (!defined('SERVER_PATH'))
    define('SERVER_PATH', "/var/www/html/Silverow/api");

if (!defined('APP_PATH'))
    define('APP_PATH', "/var/www/html/Silverow/");

if (!defined('WEB_PATH'))
    define('WEB_PATH', "http://silverow.us-east-1.elasticbeanstalk.com");// https://www.mode2.co.uk

if (!defined('TEMPLATES_PATH'))
    define('TEMPLATES_PATH', "/var/www/html/Silverow/app");

/* if (!defined('HMRC_ID'))
define('HMRC_ID', "0oJpqSP2XKavLses4RBkLRkVkrYa");

if (!defined('HMRC_SECRET'))
define('HMRC_SECRET', "6da9bd0f-8ad3-42a7-b2b1-c56322ad8ffe");   */ 

if (!defined('HMRC_ID'))
define('HMRC_ID', "xhJI83s8AKi7pr8JewHGcJi39G6i");

if (!defined('HMRC_SECRET'))
define('HMRC_SECRET', "58892e70-9341-448e-9b46-de6bfbcc49e4");

require_once(SERVER_PATH . "/classes/Variables.php");

$url = "http" . (($_SERVER['SERVER_PORT'] == 443) ? "s://" : "://") . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
$find = 'www';
$pos = strpos($url, $find);
if ($pos === false) {
    //header("Location: ".WEB_PATH);
    //exit();
} 
?>