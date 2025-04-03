<?php

//error_reporting(E_ALL);
//ini_set('display_errors', '1');
error_reporting(0);
//echo $dir = dirname(__FILE__);
//   if ($_SERVER['HTTP_HOST'] == 'localhost')
#DATABASE CONSTANT
if (!defined('DATABASE_TYPE'))
    define('DATABASE_TYPE', 'mysqli');
if (!defined('DATABASE_HOST'))
    define('DATABASE_HOST', 'localhost'); //localhost
if (!defined('DATABASE_USER'))
    define('DATABASE_USER', 'root');
if (!defined('DATABASE_PASSWORD'))
    define('DATABASE_PASSWORD', '');
if (!defined('DATABASE_NAME'))
    define('DATABASE_NAME', 'navsonso_silver');


//if (!defined('DATABASE_TYPE')) define('DATABASE_TYPE','mysqli');
//if (!defined('DATABASE_HOST')) define('DATABASE_HOST','91.208.99.2:1122');
//if (!defined('DATABASE_USER')) define('DATABASE_USER','navsonso_silver');
//if (!defined('DATABASE_PASSWORD')) define('DATABASE_PASSWORD','NgDb@Navson321/');
//if (!defined('DATABASE_NAME')) define('DATABASE_NAME','navsonso_silver');
//
#GENERAL PATH CONSTANTS
if (!defined('SERVER_PATH'))
    define('SERVER_PATH', "E:/xampp/htdocs/SilverowLive\Live/api");
if (!defined('APP_PATH'))
    define('APP_PATH', "E:/xampp/htdocs/SilverowLive\Live/");
if (!defined('WEB_PATH'))
    define('WEB_PATH', "http://localhost/SilverowLive\Live"); //('WEB_PATH',"http://silverow.com/live");

require_once(SERVER_PATH . "/classes/Variables.php");

$url = "http" . (($_SERVER['SERVER_PORT'] == 443) ? "s://" : "://") . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
$find = 'www';
$pos = strpos($url, $find);
if ($pos === false) {
    //header("Location: ".WEB_PATH);
    //exit();
}
?>