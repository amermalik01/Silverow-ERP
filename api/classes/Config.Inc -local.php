<?php
error_reporting(E_ALL) ;
ini_set('display_errors', '1');
error_reporting(0);
// echo getcwd();

/* if (!defined('DATABASE_TYPE')) define('DATABASE_TYPE','mysqli');
if (!defined('DATABASE_HOST')) define('DATABASE_HOST','silverowdb.mysql.database.azure.com');
if (!defined('DATABASE_USER')) define('DATABASE_USER','development_user@silverowdb');
if (!defined('DATABASE_PASSWORD')) define('DATABASE_PASSWORD','$$N@v50N8362!!.');
if (!defined('DATABASE_NAME')) define('DATABASE_NAME','dev'); */ 

if (!defined('DATABASE_TYPE')) define('DATABASE_TYPE','mysqli');
if (!defined('DATABASE_HOST')) define('DATABASE_HOST','192.168.0.197');
if (!defined('DATABASE_USER')) define('DATABASE_USER','db_dev');
// if (!defined('DATABASE_PASSWORD')) define('DATABASE_PASSWORD','ChinMos439++');
if (!defined('DATABASE_PASSWORD')) define('DATABASE_PASSWORD','RunningUpThatHill');
if (!defined('DATABASE_NAME')) define('DATABASE_NAME','dev');  

// Dev server path
/* if (!defined('SERVER_PATH'))
    define('SERVER_PATH', "C:/wamp64/www/dev/api");
if (!defined('APP_PATH'))
    define('APP_PATH', "C:/wamp64/www/dev/");
if (!defined('WEB_PATH'))
    define('WEB_PATH', "http://62.253.222.154/dev");
if (!defined('TEMPLATES_PATH'))
    define('TEMPLATES_PATH', "C:/wamp64/www/dev/app");  
 */
 if (!defined('SERVER_PATH'))
    define('SERVER_PATH', "D:/xampp/htdocs/silverowGitNew/api");

if (!defined('APP_PATH'))
    define('APP_PATH', "D:/xampp/htdocs/silverowGitNew/");

if (!defined('WEB_PATH'))
    define('WEB_PATH', "http://localhost/silverowGitNew");

if (!defined('TEMPLATES_PATH'))
    define('TEMPLATES_PATH', "D:/xampp/htdocs/silverowGitNew/app"); 
    
require_once(SERVER_PATH . "/classes/Variables.php");
$url = "http" . (($_SERVER['SERVER_PORT'] == 443) ? "s://" : "://") . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
$find = 'www';
$pos = strpos($url, $find);
if ($pos === false) {
    //header("Location: ".WEB_PATH);
    //exit();
} 
?>
