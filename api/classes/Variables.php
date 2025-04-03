<?php
# Auth Object
require_once(SERVER_PATH."/classes/Auth.php");
$objAuth = new Auth();

require_once(SERVER_PATH."/classes/Filters.php");
$objFilters = new Filters();


# Encrytions Values
define('SECRET_KEY', '1a2s3dd6f5g4t7r8et1');
define('SECRET_IV', 'zxcvbm987465231!%*&9');
define('SECRET_METHOD', 'AES-256-CBC');
define('SECRET_SALT', '30Eou.9q1/8NkZiLH0mz7Y');

# User Types
define('SUPER_ADMIN_USER_TYPE', 1);
define('COMPANY_ADMIN_USER_TYPE', 2);
define('NORMAL_USER_TYPE', 3);

# Modules Constants
define('GENERAL_LEDGER', 1);
define('SALES_CRM', 2);
define('PURCHASE_PAYABLE', 3);
define('STOCK', 4);
define('HUMAN_RESOURCE', 5);

# Users Types
define('SUPER_ADMIN', 1);
define('COMPANY_ADMIN', 2);
define('EMPLOYEE', 3);

# Module Details Constants
define('CHARTS_OF_ACCOUNTS', 1);
define('CRM', 2);
define('SALES_OPP_CYCLE', 3);
define('SALES_PROMOTIONS', 4);
define('SALES_COMPETITORS', 5);
define('SALES_CUSTOMERS', 6);
define('SALES_QUOTES', 7);
define('SALES_ORDERS', 8);
define('SALES_TO_DO', 9);
define('SALES_PIPELINE', 10);
define('SALES_CREDIT_NOTES', 11);
define('SALES_COMPLETED_ORDERS', 12);
define('SALES_REPORTS', 13);
define('SALES_STATS', 14);
define('SALES_DOCUMENTS', 26);
define('PUR_SHIPPING_AGENT', 15);
define('PUR_SUPPLIERS', 16);
define('PUR_QUOTES', 17);
define('PUR_ORDERS', 18);
define('PUR_DEBIT_NOTES', 19);
define('PUR_DOCUMENTS', 20);
//define('STOCK_PRODUCTS', 21);
define('STOCK_PRODUCTS', 18);
define('HR_AREA_CODE', 22);
define('HR_EMPLOYEES', 23);
define('HR_ABSENCE_REG', 24);
define('HR_ROLES', 25);
define('pagination_limit', 25);
define('cache_pagination_limit', 1000);
define('CRM_ID', 1);
define('SRM_ID', 2);

//******* Column Type  ******//
define('INPUT_BOX',0);
define('CALENDAR',1);
define('DROPDOWN',2);
define('CONTANTS_DROPDOWN',4);

/* ***** Upload Path *** */
// define('UPLOAD_PATH', APP_PATH."/upload/");
<<<<<<< HEAD
define('UPLOAD_PATH', APP_PATH."/");
=======
/* define('UPLOAD_PATH', APP_PATH."/");
define('upload_limit',8500000); */

define('UPLOAD_PATH', APP_PATH."/upload/");

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
define('upload_limit',8500000);

/* ****** Check directory exisits of not ***** */
function check_dir_path($dir_path){
	//echo "Path =".$dir_path;exit;
	if(!is_dir($dir_path)) {
		//mkdir($dir_path, 0777, true);
		$oldmask = umask(0);
		mkdir($dir_path, 0777, true);
		umask($oldmask);
		// Checking
		if ($oldmask != umask()) {
			die('An error occurred while changing back the umask');
		}
	}
}





//****** Time Foramt *****//
define('CONST_AM',1);
define('CONST_am',2);
define('CONST_24',3);

//****** Date Foramt *****//
define('CONST_YMD',1);
define('CONST_MDY',2);
define('CONST_DMY',3);

//******* Setup posting   ledger *********//

//******* Posting Setup Type  ******//
define('GENERAL_POSTING',1);
define('VAT_POSTING',2);
define('CUSTOMER_POSTING',3);
define('SUPPLIER_POSTING',4);

//******* G/L Entry Type  ******//
define('GENERAL_ENTRY',1);
define('VAT_ENTRY',2);
define('CUSTOMER_ENTRY',3);
define('COSGS_ENTRY',4);
define('STOCK_ENTRY',5);

//******* G/L Posting Type  ******//
define('SALE',1);
define('PURCHASE',2);
define('CREDIT_NOTE',3);
define('DEBIT_NOTE',4);

//******* Product Tabs   Fields maximum limit constants  ******//
define('MAX_TABS_LIMIT',5);
define('MAX_FIELDS_LIMIT',5);

//******* site constants Type  ******//
define('TURNOVER',1);
define('SEGMENT',2);
define('CUST_STATUS',3);
define('BUYING_GROUP',4);
define('OFFER_METHOD',5);
define('SOURCES_OF_LEAD',6);
define('GEN_BUS_POSTING_GROUP',7);
define('VAT_BUS_POSTING_GROUP',8);
define('GEN_PRODUCT_POSTING_GROUP',9);
define('VAT_PRODUCT_POSTING_GROUP',10);
define('CUST_POSTING_GROUP',11);
define('PROD_INV_POSTING_GROUP',12);
define('SUPP_BUS_POSTING_GROUP',13);
define('SUPP_VAT_POSTING_GROUP',14);
define('SUPP_POSTING_GROUP',15);
//******* G/L hr Type  ******//
define('HR_MAX_TABS',5);
define('HR_MAX_FIELDS',5);

 $timezone = 'Europe/London';
   define('timezone', $timezone);
  
  

define('current_date',strtotime(date("d-m-Y")));	//)"now"
define('current_date_time',strtotime(date("d-m-Y H:i:s")));
define('today_date',strtotime(date("d-m-Y")));




/// ----------------------------------------------- Error Messages -----------------------------------------------//
define('Error_1451', 'Error: 1451. Record can not be deleted, other objects are associated with this record');

define('ACTIVE_STATUS', '1');
define('INACTIVE_STATUS', '0');
define('DELETED_STATUS', '-1');

$posting_setup_type = array(GENERAL_POSTING => 'General' ,VAT_POSTING => 'VAT',CUSTOMER_POSTING => 'Customer',SUPPLIER_POSTING => 'Supplier');



/*define('PRODUCT_ARRAY',  serialize( array(
	'General' => array(1 => "Item Code", 2 => "Description", 3 => "Category", 4 => "Brand", 5 => "Unit of Measure", 6 => "Current Stock Level", 7 => "Reorder Point", 8 => "Reorder Quantity", 9 => "Status"),
	'Details' => array(10 => "Dimensions", 11 => "Height", 12 => "Width", 13 => "Length", 14 => "Gross Weight", 15 => "Net Weight", 16 => "Image/Picture ", 17 => "Barcode", 18 => "Country of Origin", 19 => "Commodity Code"),
	'Invoicing'  => array(20 => "Unit Cost", 21 => "Costing Method", 22 => "Average Cost", 23 => "VAT Rate", 24 => "Standard Selling Price", 25 => "Average Selling Price", 26 => "Profit", 27 => "Profit %", 28 => "Purchase G/L Code", 29 => "Sale G/L Code"),
	'Supplier'  => array(30 => "Supplier No", 31 => "Supplier Name", 32 => "Item", 33 => "Unit Cost")
) ));
*/

/*define('HR_ARRAY',  serialize( array(
  
'General Information' => array( 
1=> array("name"=>"user_email","display_label" =>"User Email","display_type" =>"text","display_require" =>"1"),
2 => array("name"=>"user_password","display_label" =>"User Password","display_type" =>"text","display_require" =>"1"),
3 => array("name"=>"user_code","display_label" =>"User Code","display_type" =>"text","display_require" =>"1"),
4 => array("name"=>"company_id","display_label" =>"User Company","display_type" =>"select","display_require" =>"1"),
5 => array("name"=>"user_display_type","display_label" =>"User Type","display_type" =>"select","display_require" =>"1"),
6 => array("name"=>"job_title","display_label" =>"Job Title","display_type" =>"text","display_require" =>"0"),
7 => array("name"=>"first_name","display_label" =>"First Name","display_type" =>"text","display_require" =>"1"),
8 => array("name"=>"middle_name","display_label" =>"Middle Name","display_type" =>"text","display_require" =>"0"), 
9 => array("name"=>"last_name","display_label" =>"Last Name","display_type" =>"text","display_require" =>"1"), 
10 => array("name"=>"know_as","display_label" =>"Known as","display_type" =>"text","display_require" =>"0"),
11 => array("name"=>"address_1","display_label" =>"Address 1","display_type" =>"text","display_require" =>"0"),
12 => array("name"=>"address_2","display_label" =>"Address 2","display_type" =>"text","display_require" =>"0"),
13 => array("name"=>"city","display_label" =>"City","display_type" =>"text","display_require" =>"0"), 
14 => array("name"=>"country","display_label" =>"Country","display_type" =>"text","display_require" =>"0"), 
15 => array("name"=>"post_code","display_label" =>"Post Code","display_type" =>"text","display_require" =>"0"),
16 =>array("name"=>"post_code_country","display_label" =>"post code country","display_type" =>"text","display_require" =>"0"),
17 =>array("name"=>"internal_extention","display_label" =>"Internal Extention","display_type" =>"text","display_require" =>"0"), 
18 =>array("name"=>"work_phone","display_label" =>"Work Phone","display_type" =>"text","display_require" =>"0"), 
19 =>array("name"=>"mobile_phone","display_label" =>"Mobile Phone","display_type" =>"text","display_require" =>"0"), 
20 =>array("name"=>"home_phone","display_label" =>"Home Phone","display_type" =>"text","display_require" =>"0"),
21=> array("name"=>"personal_email","display_label" =>"Personal Email","display_type" =>"text","display_require" =>"0"), 
22 =>array("name"=>"work_email","display_label" =>"Work Email","display_type" =>"text","display_require" =>"0"),
23=> array("name"=>"department","display_label" =>"Department","display_type" =>"text","display_require" =>"0"), 
24 =>array("name"=>"line_manager_name","display_label" =>"Line Manager Name","display_type" =>"text","display_require" =>"0"),
25 =>array("name"=>"area","display_label" =>"Area(if applicable)","display_type" =>"text","display_require" =>"0"),
26 =>array("name"=>"start_date","display_label" =>"Start Date","display_type" =>"date_picker","display_require" =>"0"), 
27 =>array("name"=>"employee_display_type","display_label" =>"Employee Type","display_type" =>"select","display_require" =>"0") , 
28 =>array("name"=>"status","display_label" =>"status","display_type" =>"select","display_require" =>"0"),
29 =>array("name"=>"case_of_inactivity","display_label" =>"Case of Inactivity","display_type" =>"select","display_require" =>"0"), 
30 =>array("name"=>"leave_date","display_label" =>"Leave Date","display_type" =>"date_picker","display_require" =>"0"),
31 =>array("name"=>"reason_of_leaving","display_label" =>"Reason of Leaving","display_type" =>"select","display_require" =>"0"), 
32 =>array("name"=>"skype_id","display_label" =>"Skype ID","display_type" =>"text","display_require" =>"0") , 
33 =>array("name"=>"linked_id","display_label" =>"Linked ID","display_type" =>"text","display_require" =>"0"), 
34 =>array("name"=>"image","display_label" =>"Image","display_type" =>"picture","display_require" =>"0")),

'Personal ' => array(
1 => array("name"=>"gender","display_label" =>"Gender","display_type" =>"select","display_require" =>"0"),
2 => array("name"=>"date_of_birth","display_label" =>"Date of Birth","display_type" =>"date_picker","display_require" =>"0"),
3 => array("name"=>"next_of_kin","display_label" =>"Next of Kin","display_type" =>"text","display_require" =>"0"),
5 => array("name"=>"next_of_kin_phone","display_label" =>"Next of Kin Phone","display_type" =>"text","display_require" =>"0"), 
6 => array("name"=>"national_insurance_number","display_label" =>"National Insurance Number","display_type" =>"text","display_require" =>"0"),
7 => array("name"=>"entitle_holiday","display_label" =>"Entitled Holiday","display_type" =>"text","display_require" =>"0"),
8 => array("name"=>"ethnic_orign","display_label" =>"Ethnic Origin","display_type" =>"text","display_require" =>"0"),
9 => array("name"=>"religion","display_label" =>"Religion","display_type" =>"text","display_require" =>"0")

),

'Salary' => array(
1 =>  array("name"=>"salary","display_label" =>"Salary","display_type" =>"select","display_require" =>"0"),
2 =>  array("name"=>"over_time","display_label" =>"Over Time Rate","display_type" =>"text","display_require" =>"0"),
3 =>  array("name"=>"bonus","display_label" =>"Bonus","display_type" =>"text","display_require" =>"0"),
4 =>  array("name"=>"comission","display_label" =>"Commission","display_type" =>"text","display_require" =>"0"),
5 =>  array("name"=>"company_car","display_label" =>"Company Car","display_type" =>"text","display_require" =>"0"),
6 =>  array("name"=>"company_car_detail","display_label" =>"Company Car Detail","display_type" =>"subinputs","display_require" =>"0"),
7=>   array("name"=>"company_laptop","display_label" =>"Company Laptop","display_type" =>"subinputs","display_require" =>"0"),
8 =>  array("name"=>"company_mobile","display_label" =>"Company Mobile Phone","display_type" =>"subinputs","display_require" =>"0"),
9 =>  array("name"=>"other_benifits","display_label" =>"Other Benifits","display_type" =>"text","display_require" =>"0"),
10 => array("name"=>"ee_pention","display_label" =>"EE Pention Contribution %","display_type" =>"text","display_require" =>"0"),
11 => array("name"=>"er_pention","display_label" =>"ER Pention Contribution %","display_type" =>"text","display_require" =>"0"),
12 => array("name"=>"salary_effective_date","display_label" =>"Salary Effective Date","display_type" =>"date_picker","display_require" =>"0"),
13 => array("name"=>"salar_review_date","display_label" =>"Salary Review Effective Date","display_type" =>"date_picker","display_require" =>"0"))

) 
));*/

//******* ORDER STATUS ******//
define('WAITING',1);
define('PENDING',2);
define('CANCEL',3);
define('WAREHOUSE_PICK',4);
define('HAULAGE_REQUESTED',5);
define('CONFIRM_RECEIVED',6);
define('DELIVERED',7);
define('ORDER_COMPLETED',8);
define('ORDER_INVOICE',9);




/* Roles And Permissions Constants */
define('sr_AddPermission', 1);
define('sr_EditPermission', 2);
define('sr_ViewPermission', 3);
define('sr_DeletePermission', 4);
define('sr_ApprovePermission', 5);
define('sr_ConvertPermission', 6);
define('sr_DispatchPermission', 7);
define('sr_PostPermission', 8);
define('sr_ReceivePermission', 9);

define('sr_AddEditPermission', "1,2");

// Log level constants
// 0=No Logging required, 1=Errors Only, 2=Errors & Warning 3=Everyhting should be logged. This Parameter is read from the config file on user login
if (!defined('LOG_LEVEL_1')) define('LOG_LEVEL_1','1');
if (!defined('LOG_LEVEL_2')) define('LOG_LEVEL_2','2');
if (!defined('LOG_LEVEL_3')) define('LOG_LEVEL_3','3');
if (!defined('LOG_LEVEL_4')) define('LOG_LEVEL_4','4');

if (!defined('LOG_LEVEL')) define('LOG_LEVEL', LOG_LEVEL_3);


if (!defined('SR_TRACE_SQL')) define('SR_TRACE_SQL', 1);
if (!defined('SR_TRACE_PHP')) define('SR_TRACE_PHP', 2);


if (!defined('SR_TRACE_FN_IN')) define('SR_TRACE_FN_IN', 1);
if (!defined('SR_TRACE_FN_OUT')) define('SR_TRACE_FN_OUT', 2);


if (!defined('MAX_REPORT_RECORDS')) define('MAX_REPORT_RECORDS',500);
<<<<<<< HEAD


?>
=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
