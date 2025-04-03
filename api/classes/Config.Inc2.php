<?php
error_reporting(E_ALL) ;
ini_set('display_errors', '1');
error_reporting(0);
// echo getcwd();

if (!defined('DATABASE_TYPE')) define('DATABASE_TYPE','mysqli');
if (!defined('DATABASE_HOST')) define('DATABASE_HOST','localhost');
if (!defined('DATABASE_USER')) define('DATABASE_USER','u7cpzix8v5x7m');
if (!defined('DATABASE_PASSWORD')) define('DATABASE_PASSWORD','oeuybsrfj5cj');
if (!defined('DATABASE_NAME')) define('DATABASE_NAME','db3e9izx2swwm2');  

 if (!defined('SERVER_PATH'))
    define('SERVER_PATH', "/home/customer/www/mode2.co.uk/public_html/api");

if (!defined('APP_PATH'))
    define('APP_PATH', "/home/customer/www/mode2.co.uk/public_html/");

if (!defined('WEB_PATH'))
    define('WEB_PATH', "https://www.mode2.co.uk");

if (!defined('TEMPLATES_PATH'))
    define('TEMPLATES_PATH', "/home/customer/www/mode2.co.uk/public_html/app");

if (!defined('HMRC_ID'))
define('HMRC_ID', "0oJpqSP2XKavLses4RBkLRkVkrYa");

if (!defined('HMRC_SECRET'))
define('HMRC_SECRET', "6da9bd0f-8ad3-42a7-b2b1-c56322ad8ffe");   

require_once(SERVER_PATH . "/classes/Variables.php");

$url = "http" . (($_SERVER['SERVER_PORT'] == 443) ? "s://" : "://") . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
$find = 'www';
$pos = strpos($url, $find);
if ($pos === false) {
    //header("Location: ".WEB_PATH);
    //exit();
} 
?>