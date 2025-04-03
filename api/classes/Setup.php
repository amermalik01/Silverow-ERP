<?php
// error_reporting(E_ERROR);
require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/General.php");
require_once(SERVER_PATH . "/classes/QueryMaster.php");
// require_once(SERVER_PATH . "/classes/Mail.php");


class Setup extends Xtreme
{
    private $Conn = null;
    private $ConnTrace = null;
    private $objGeneral = null;
    private $objQueryMaster = null;
    private $arrUser = null;
    // private $objMail = null;

    private $objstock = null;
    private $objhr = null;
    private $objcustomersale = null;

    function __construct($user_info = array())
    {
        parent::__construct();
        $this->Conn = parent::GetConnection();
        $this->ConnTrace = parent::GetTraceConnection();
        $this->objGeneral = new General($user_info);
        $this->objQueryMaster = new QueryMaster($user_info);
        $this->arrUser = $user_info;
        // $this->objMail = new Mail($this->arrUser);
    }

    // static
    function delete_update_status($table_name, $column, $id)
    {
        if($table_name == "crm_credit_rating"){
            $tableNoun = "credit rating";
            $pi_type = 29;
        } 
        else if($table_name == "crm_region"){
            $tableNoun = "Territory";
            $pi_type = 8;
        }
        else {
            $tableNoun = $table_name;
            $pi_type = 8;
        }
        $Sql = "UPDATE $table_name SET status=".DELETED_STATUS." WHERE id = $id AND SR_CheckTransactionBeforeDelete($id, ".$this->arrUser['company_id'].", $pi_type,0) = 'success'";
        
        // echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'This '.$tableNoun. ' cannot be deleted because it is being used in another record.';
            $response['SQL'] = $Sql;
        }
        return $response;
    }

    function delete_crm_stages($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $id = $attr['id'];
        $type = $attr['type'];
        //$table_name

        $Sql = "DELETE FROM ref_crm_order_stages  WHERE id = ".$id." AND SR_CheckTransactionBeforeDelete($id, ".$this->arrUser['company_id'].", 25,0) = 'success'";
        
        // echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;

            if($type == 1)
                $response['error'] = 'This Sale Order Stage cannot be deleted because is being used in another record.';
            elseif($type == 2)
                $response['error'] = 'This Purchase Order Stage cannot be deleted because is being used in another record.';
            elseif($type == 3)
                $response['error'] = 'This Debit Note Stage cannot be deleted because is being used in another record.';
            elseif($type == 4)
                $response['error'] = 'This Credit Note Stage cannot be deleted because is being used in another record.';
            // $response['error'] = 'Record cannot be deleted';
        }
        return $response;
    }

    function delete_ownership($table_name, $column, $id)
    {
        $Sql = "UPDATE $table_name SET  $column='inactive' 	WHERE id = $id Limit 1";
        //echo $Sql; exit;

        $RS = $this->CSI($Sql);
        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }
        return $response;
    }

    function get_data_by_id($table_name, $id)
    {
        $Sql = "SELECT *
				FROM ".$table_name."
				WHERE id=".$id."
				LIMIT 1";
        $RS = $this->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function get_crm_order_stage_by_id($attr)
    {
        $Sql = "SELECT *
				FROM ref_crm_order_stages
				WHERE id=".$attr['id']." AND
                company_id='" . $this->arrUser['company_id'] . "'
				LIMIT 1";
       //$RS = $this->CSI($Sql);
       $RS = $this->CSI($Sql, "sales_crm", sr_ViewPermission);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
        } else {
            $response['response'] = array();
            $response['bucketFail'] = 1;
        }
        return $response;
    }

    function getDetailsCustPortal($attr) {
        $this->objGeneral->mysql_clean($attr);

        if(isset($attr['selCust'])){

            $key = hash('sha256', SECRET_KEY);
            $iv = substr(hash('sha256', SECRET_IV), 0, 16);
            $outputInvName = openssl_decrypt(base64_decode($attr['selCust']), SECRET_METHOD, $key, 0, $iv);
            $fileName = explode(",",$outputInvName);

            $customerID = $fileName[1];

            $Sql = "SELECT c.id as cid,c.customer_code,c.name,c.company_id,
                           company.name as compName,company.url,company.address,
                           company.address_2,company.county,company.postcode,company.telephone,
                           company.fax,company.city,company.logo
                    FROM crm c
                    LEFT JOIN company on company.id = c.company_id
                    WHERE c.type IN (2,3) AND 
                        c.customer_code IS NOT NULL AND 
                        c.name <> '' AND 
                        c.id=" . $customerID. "";
            // echo $Sql;exit;
            $RS = $this->CSI($Sql);

            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {

                    foreach ($Row as $key => $value) {
                        if (is_numeric($key))
                            unset($Row[$key]);
                    }

                    $row = array();
                    $attr['cust_id'] = $Row['cid'];
                    $attr['custCode'] = $Row['customer_code'];
                    $attr['custName'] = $Row['name'];

                    $attr['compName'] = $Row['compName'];
                    $attr['compURL'] = $Row['url'];
                    $attr['address'] = $Row['address'];
                    $attr['address_2'] = $Row['address_2'];
                    $attr['county'] = $Row['county'];
                    $attr['postcode'] = $Row['postcode'];
                    $attr['telephone'] = $Row['telephone'];
                    $attr['fax'] = $Row['fax'];
                    $attr['city'] = $Row['city'];
                    $attr['logo'] = $Row['logo'];

                    $this->arrUser['company_id'] = $Row['company_id'];
                }
                $response['customerID'] = $customerID;
                $response['custCode'] = $attr['custCode'];
                $response['custName'] = $attr['custName'];

                $response['compName'] = $attr['compName'];
                $response['compURL'] = $attr['compURL'];
                $response['address'] = $attr['address'];
                $response['address_2'] = $attr['address_2'];
                $response['county'] = $attr['county'];
                $response['postcode'] = $attr['postcode'];
                $response['telephone'] = $attr['telephone'];
                $response['fax'] = $attr['fax'];
                $response['city'] = $attr['city'];
                $response['logo'] = $attr['logo'];

                $response['ack'] = 1;
                $response['error'] = NULL;
                $response['response'][] = array();
                return $response;

            } else {
                $response['ack'] = 0;
                $response['error'] = 'UnAuthenticate user';
                $response['response'][] = array();
                return $response;
            }
        }
        else{
            $response['ack'] = 0;
            $response['error'] = 'UnAuthenticate user';
            $response['response'][] = array();
            return $response;
        }
    }


    function getVatRange($attr)
    {
        $response = [];

        if($this->arrUser['company_id'] == 133){

            // PBI: Requirment In GL For Vat GL Calculation in Vat column instead of general calculation. 
            $sqlvat = " SELECT gl1.id AS gl1ID,gl1.accountCode AS gl1AccountCode,gl1.displayName AS gl1DisplayName,
                               gl2.id AS gl2ID,gl2.accountCode AS gl2AccountCode,gl2.displayName AS gl2DisplayName,
                               gl3.id AS gl3ID,gl3.accountCode AS gl3AccountCode,gl3.displayName AS gl3DisplayName
                        FROM financial_settings AS fs 
                        LEFT JOIN gl_account AS gl1 ON gl1.id = fs.VatPosting_gl_account_sale
                        LEFT JOIN gl_account AS gl2 ON gl2.id = fs.VatPosting_gl_account_purchase
                        LEFT JOIN gl_account AS gl3 ON gl3.id = fs.VatPosting_gl_account_imp
                        WHERE fs.company_id='" . $this->arrUser['company_id'] . "' AND 
                              gl1.company_id='" . $this->arrUser['company_id'] . "' AND
                              gl2.company_id='" . $this->arrUser['company_id'] . "' AND
                              gl3.company_id='" . $this->arrUser['company_id'] . "'  ";

        }
        else{

            // PBI: Requirment In GL For Vat GL Calculation in Vat column instead of general calculation. 
            $sqlvat = " SELECT startRangeCode,endRangeCode 
                        FROM gl_account 
                        WHERE id = (SELECT VatPosting_gl_account 
                                    FROM financial_settings
                                    WHERE company_id='" . $this->arrUser['company_id'] . "')";
        }
                    
        //   echo $sqlvat;
        $RSV = $this->Conn->Execute($sqlvat);
        // $RSV = $this->CSI($sqlvat);
            //print_r($RSV);
        if ($RSV->RecordCount() > 0) 
        {
            while ($Row = $RSV->FetchRow()) 
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;                  
    }

    function get_global_data_status($attr=array())
    {    
        $setupGlobalLastUpdateTime = (isset($attr['setupGlobalLastUpdateTime'])) ? $attr['setupGlobalLastUpdateTime']: 0;
        $prodLastUpdateTime = (isset($attr['prodLastUpdateTime'])) ? $attr['prodLastUpdateTime']: 0;
        $invSetuplastUpdateTime = (isset($attr['invSetuplastUpdateTime'])) ? $attr['invSetuplastUpdateTime']: 0;
        $empllastUpdateTime = (isset($attr['empllastUpdateTime'])) ? $attr['empllastUpdateTime']: 0;
        $customer_checksum_id = (isset($attr['customer_checksum_id'])) ? $attr['customer_checksum_id']: 0;
        /* $prodlastUpdateTime = $attr['prodLastUpdateTime'];
        $invSetuplastUpdateTime = $attr['invSetuplastUpdateTime'];
        $empllastUpdateTime = $attr['empllastUpdateTime'];
        $customer_checksum_id = $attr['customer_checksum_id']; */    

        if($setupGlobalLastUpdateTime > 0){       

            $Sqla = "SELECT MAX(UNIX_TIMESTAMP(changedOn)) as updatedTime 
                     FROM sr_checksum 
                     WHERE tablename IN ('crm_segment','crm_buying_group','crm_region','currency','currency_histroy',
                                         'payment_terms','srm_payment_methods','payment_methods','srm_payment_terms',
                                         'gl_units_of_measure','shipment_methods','active_classification','ref_classification',
                                         'ref_posting_group','crm_pref_method_of_communiction','ref_social_media') AND 
                           company_id='" .  $this->arrUser['company_id']. "'
                     LIMIT 1";

            // echo $Sqla;exit;
            $RSa = $this->Conn->Execute($Sqla);
            
            if ($RSa->RecordCount() == 1) {

                if($setupGlobalLastUpdateTime > $RSa->fields['updatedTime'])
                    $response['setupGlobalLastUpdateTimeAck'] = 1;
                else
                    $response['setupGlobalLastUpdateTimeAck'] = 0;
            }
            else
                $response['setupGlobalLastUpdateTimeAck'] = 0;
        }else{
            $response['setupGlobalLastUpdateTimeAck'] = 0;
        }

        if($prodlastUpdateTime > 0){  

            $Sqla = "SELECT MAX(UNIX_TIMESTAMP(changedOn)) as modifiedTime 
                     FROM sr_checksum 
                        WHERE tablename IN ('product','units_of_measure_setup','units_of_measure','product_warehouse_location','warehouse') AND 
                              company_id='" .  $this->arrUser['company_id']. "'
                        LIMIT 1";

            // echo $Sqla;exit;
            $RSa = $this->Conn->Execute($Sqla);
            
            if ($RSa->RecordCount() == 1) {

                if($prodlastUpdateTime > $RSa->fields['modifiedTime'])
                    $response['prodlastUpdateTimeAck'] = 1;
                else
                    $response['prodlastUpdateTimeAck'] = 0;
            }
            else
                $response['prodlastUpdateTimeAck'] = 0;
        }
        else
            $response['prodlastUpdateTimeAck'] = 0;

        if($invSetuplastUpdateTime > 0){    

            $Sqla = "SELECT MAX(UNIX_TIMESTAMP(changedOn)) as updatedTime 
                        FROM sr_checksum 
                        WHERE tablename IN ('category','brand','brandcategorymap','units_of_measure') AND 
                              company_id='" .  $this->arrUser['company_id']. "'
                        LIMIT 1";

            // echo $Sqla;exit;
            $RSa = $this->Conn->Execute($Sqla);
            
            if ($RSa->RecordCount() == 1) {

                if($invSetuplastUpdateTime > $RSa->fields['updatedTime'])
                    $response['invSetuplastUpdateTimeAck'] = 1;
                else
                    $response['invSetuplastUpdateTimeAck'] = 0;
            }
            else
                $response['invSetuplastUpdateTimeAck'] = 0;
        }
        else
            $response['invSetuplastUpdateTimeAck'] = 0;

        if($empllastUpdateTime > 0){    

            $Sqla = "SELECT MAX(UNIX_TIMESTAMP(changedOn)) as updatedTime 
                        FROM sr_checksum 
                        WHERE tablename IN ('departments','employee_type','employees','vat','vat_posting_grp_setup','ref_posting_group') AND 
                              company_id='" .  $this->arrUser['company_id']. "'
                        LIMIT 1";

            // echo $Sqla;exit;
            $RSa = $this->Conn->Execute($Sqla);
            
            if ($RSa->RecordCount() == 1) {

                if($empllastUpdateTime > $RSa->fields['updatedTime'])
                    $response['empllastUpdateTimeAck'] = 1;
                else
                    $response['empllastUpdateTimeAck'] = 0;
            }
            else
                $response['empllastUpdateTimeAck'] = 0;
        }
        else
            $response['empllastUpdateTimeAck'] = 0;

        if($customer_checksum_id > 0){

            $Check_Exist = "INSERT INTO sr_checksum (company_id, checksum_id, tableName, ChangedOn, ChangedBy) 
                            SELECT * 
                            FROM (SELECT " . $this->arrUser['company_id'] . ", 1, 'crm', CURRENT_TIMESTAMP," . $this->arrUser['id'] . ") AS temp
                            WHERE NOT EXISTS (SELECT  * from sr_checksum where tableName = 'crm' AND company_id = " . $this->arrUser['company_id'] . ")";
            // echo $Check_Exist;exit;      
            $RS_CHECK = $this->Conn->Execute($Check_Exist);

            $Sql = "SELECT  * 
                    FROM sr_checksum 
                    WHERE tableName = 'crm' AND 
                          checksum_id <> $customer_checksum_id AND 
                          company_id = " . $this->arrUser['company_id'];

            // echo $Sql;exit;
            $RS = $this->Conn->Execute($Sql);

            if ($RS->RecordCount() > 0) {
                $response['customerLastUpdateTimeAck'] = 1;
            }
            else
                $response['customerLastUpdateTimeAck'] = 0;
        }        
        else
            $response['customerLastUpdateTimeAck'] = 0;

        $response['ack'] = 1;
        $response['error'] = NULL;
        // print_r($response);  exit;
        return $response;
    }


    function get_global_data($attr)
    {        
        // $setupGlobalLastUpdateTime = $attr['setupGlobalLastUpdateTime'];
        $setupGlobalLastUpdateTime = (isset($attr['setupGlobalLastUpdateTime'])) ? $attr['setupGlobalLastUpdateTime']: 0;

//         error_reporting(E_ALL);
// ini_set('display_error', 1);

        if($setupGlobalLastUpdateTime > 0){       

            $Sqla = "SELECT MAX(UNIX_TIMESTAMP(changedOn)) as updatedTime 
                        FROM sr_checksum 
                        WHERE tablename IN ('crm_segment','crm_buying_group','crm_region','currency','currency_histroy',
                        'payment_terms','srm_payment_methods','payment_methods','srm_payment_terms','gl_units_of_measure',
                        'shipment_methods','active_classification','ref_classification','ref_posting_group','crm_pref_method_of_communiction',
                        'ref_social_media') AND 
                              company_id='" .  $this->arrUser['company_id']. "'
                        LIMIT 1"; // 'product_price_volume','product_price'

            // echo $Sqla;exit;
            $RSa = $this->Conn->Execute($Sqla);
            
            if ($RSa->RecordCount() == 1) {

                if($setupGlobalLastUpdateTime > $RSa->fields['updatedTime'])
                {
                    $response['ack'] = 1;
                    $response['error'] = 3;
                    $response['setupGlobalLastUpdateTime'] = $setupGlobalLastUpdateTime;
                    return $response;
                }
            }
        }

        // error_reporting(E_ALL);

        //load from Setup class in single json
        $result1 = $this->get_segment_list($attr);
        $response['response']['segment_customer_arr'] = $result1['response'];

        $result2 = $this->get_buying_group_list($attr);
        $response['response']['bying_group_customer_arr'] = $result2['response'];

        $temp_attr=array();
        $temp_attr['type'] = 1;
        $result3 = $this->get_region_list($temp_attr, 1);
        $response['response']['region_customer_arr'] = $result3['response'];

        $result4 = $this->get_countries($attr);
        $response['response']['country_type_arr'] = $result4['response'];

        $result5 = $this->get_currencies_list($attr);
        $response['response']['arr_currency'] = $result5['response'];

    
        $result6 = $this->get_payment_terms_list($attr);
        $response['response']['arr_payment_terms'] = $result6['response'];

        $result7 = $this->get_payment_methods_list($attr);
        $response['response']['arr_payment_methods'] = $result7['response'];        

        $result8 = $this->get_payment_terms_list_srm($attr);
        $response['response']['arr_srm_payment_terms'] = $result8['response'];

        $result9 = $this->get_payment_methods_list_srm($attr, 1);
        $response['response']['arr_srm_payment_methods'] = $result9['response'];

        $result10 = $this->get_gl_units_of_measure($attr, 1); // passing 2nd parameter = 1 means that it should be given access without the permission check..
        $response['response']['gl_arr_units'] = $result10['response'];

        $result11 = $this->get_srmsegment_list($attr);
        $response['response']['segment_supplier_arr'] = $result11['response'];

        $result12 = $this->get_selling_group_list($attr);
        $response['response']['selling_group_arr'] = $result12['response'];

        $result13 = $this->get_crm_shipment_method_list($attr);
        $response['response']['crm_shippment_methods_arr'] = $result13['response'];

        $result14 = $this->get_srm_shipment_method_list($attr);
        $response['response']['srm_shippment_methods_arr'] = $result14['response'];

        $attr['main_type'] = "1, 12";
        $result15 = $this->get_active_classifications($attr);
        $response['response']['arr_crm_classification'] = $result15['response'];

        $attr['main_type'] = "2, 12";
        $result16 = $this->get_active_classifications($attr);
        $response['response']['arr_customer_classification'] = $result16['response'];

        $attr['main_type'] = "3, 34";
        $result17 = $this->get_active_classifications($attr);
        $response['response']['arr_srm_classification'] = $result17['response'];

        $attr['main_type'] = "4, 34";
        $result18 = $this->get_active_classifications($attr);
        $response['response']['arr_supplier_classification'] = $result18['response'];

        $result19 = $this->getAllPostingGroup($attr,1);
        $response['response']['postingGroups'] = $result19['response'];

        //load from crm class in single json
        require_once(SERVER_PATH . "/classes/Crm.php");        
        $objcrm = new Crm($this->arrUser);

        $result20 = $objcrm->get_pref_method_of_comm($attr);
        $response['response']['arr_pref_method_comm'] = $result20['response'];

        $attr['forGlobalArray'] = 1;
        $result21 = $objcrm->get_social_medias($attr);
        $response['response']['social_medias'] = $result21['response'];

        
        
        $result22 = $this->get_ref_currencies_list($attr);
        $response['response']['ref_currency_list'] = $result22['response'];
        
        $temp_attr=array();
        $temp_attr['type'] = 3;
        $result23 = $this->get_region_list($temp_attr, 1);
        $response['response']['region_supplier_arr'] = $result23['response'];

        $result24 = $this->getAllInventorySetup($attr,1);
        $response['response']['inventorySetup'] = $result24['vat_sales_type'];

        //load from hr class in single json
        // require_once(SERVER_PATH . "/classes/Hr.php");
        // $this->objhr = new Hr($this->arrUser);

        // $result21 = $this->objhr->get_all_hr_department($attr);
        // $response['response']['deprtment_arr'] = $result21['response'];

        // $result22 = $this->objhr->get_hr_employee_type($attr);
        // $response['response']['emp_type_arr'] = $result22['response'];

        // $attr['deprtment_type'] = 2;
        // $result23 = $this->objhr->get_employees($attr, 1);//get sales person listing
        // $response['response']['salesperson_arr'] = $result23['response'];

        // $result24 = $this->objhr->get_vat_list($attr);
        // $response['response']['arr_vat'] = $result24['response'];

        //load from stock class in single json
        // require_once(SERVER_PATH . "/classes/Stock.php");
        // $this->objstock = new Stock($this->arrUser);

        // $result25 = $this->objstock->get_all_categories($attr);
        // $response['response']['cat_prodcut_arr'] = $result25['response'];

        // $result26 = $this->objstock->get_all_brands($attr);
        // $response['response']['brand_prodcut_arr'] = $result26['response'];

        // $result27 = $this->objstock->get_all_units($attr);
        // $response['response']['uni_prooduct_arr'] = $result27['response'];

        // error_reporting(E_ALL);
        //ini_set('display_errors', '1');

        // $attr['page'] = 1;
        // $result28 = $this->objstock->getAllProductsList($attr, 1);
        // $response['response']['prooduct_arr'] = $result28['response']; 

        $Sql = "SELECT UNIX_TIMESTAMP(NOW()) AS current_date_time";
        // echo $Sql;exit;
        $RS = $this->Conn->Execute($Sql);
        $response['setupGlobalLastUpdateTime'] = $RS->fields['current_date_time'];

        $response['response']['bucket_arr'] = '';

        $response['ack'] = 1;
        $response['error'] = NULL;
        // print_r($response);  exit;
        return $response;
    }

    // function to update global data single module array
    function updateSelectedGlobalData($attr)
    {
        //load from stock class in single json
        require_once(SERVER_PATH . "/classes/Stock.php");

        $this->objstock = new Stock($this->arrUser);

        if($attr["module"]=="category"){
            $result1 = $this->objstock->get_all_categories($attr);
            $response['response']['cat_prodcut_arr'] = $result1['response'];
            $response['error'] = NULL;
        }

        if($attr["module"]=="brand"){
            $result2 = $this->objstock->get_all_brands($attr);
            $response['response']['brand_prodcut_arr'] = $result2['response'];
            $response['error'] = NULL;
        }

        if($attr["module"]=="uom"){
            $result3 = $this->objstock->get_all_units($attr);
            $response['response']['uni_prooduct_arr'] = $result3['response'];
            $response['error'] = NULL;
        }

        if($attr["module"]=="item"){
           // $result13 = $this->objstock->get_products_setup_list($attr, 1);
            $result13 = $this->objstock->getAllProductsList($attr);//, 1
            $response['response']['prooduct_arr'] = $result13['response']; 
            $response['prodlastUpdateTime'] = $result13['prodlastUpdateTime']; 

            if($result13['error'] == 3) $response['error'] = 3;
            else $response['error'] = NULL;
        }        

        if($attr["module"]=="srmclassification"){
            $attr['main_type'] = "3, 34";
            $result17 = $this->get_active_classifications($attr);
            $response['response']['arr_srm_classification'] = $result17['response'];
            $response['error'] = NULL;
        }

        if($attr["module"]=="supplierclassification"){
            $attr['main_type'] = "4, 34";
            $result18 = $this->get_active_classifications($attr);
            $response['response']['arr_supplier_classification'] = $result18['response'];
            $response['error'] = NULL;
        }    
        
        $response['ack'] = 1;

        // print_r($response);  exit;
        return $response;
    }   

    //----------GL Category--------------------------------------

    function get_gl_category_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();
        $Sql = "SELECT  gl_category.id, 
                        gl_category.name,  
                        gl_category.code,  
                        gl_category.start_amount,  
                        gl_category.end_amount 
                FROM gl_category
                left JOIN company on company.id=gl_category.company_id
                where gl_category.status=1 and 
                     (gl_category.company_id=" . $this->arrUser['company_id'] . " or 
                      company.parent_id=" . $this->arrUser['company_id'] . ")";

        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'gl_category', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';
        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['account_code'] = $Row['code'];
                $result['account_name'] = $Row['name'];
                $result['start Account Number'] = $Row['start_amount'];
                $result['end Account Number'] = $Row['end_amount'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_gl_category_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM gl_category
				WHERE id='".$attr['id']."'
				LIMIT 1";
        $RS = $this->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function add_gl_category($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $data_pass = "  ".$arr_attr['start_amount']." BETWEEN tst.start_amount AND tst.end_amount or  
                        ".$arr_attr['end_amount']." BETWEEN tst.start_amount AND 
                        tst.end_amount ";
        $total = $this->objGeneral->count_duplicate_in_sql('gl_category', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO gl_category
							SET
								name='".$arr_attr['name']."',
								code='".$arr_attr['code']."',
								start_amount='".$arr_attr['start_amount']."',
								end_amount='".$arr_attr['end_amount']."',
								status=1,
								company_id='" . $this->arrUser['company_id'] . "',
								user_id='" . $this->arrUser['id'] . "',
								date_added='" . current_date . "'";

        $RS = $this->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
        }
        return $response;
    }

    function update_gl_category($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        if ($arr_attr['id'] > 0)
            $where_id = " AND tst.id <> '".$arr_attr['id']."' ";

        $data_pass = "  ".$arr_attr['start_amount']." BETWEEN tst.start_amount AND tst.end_amount or  
                        ".$arr_attr['end_amount']." BETWEEN tst.start_amount AND tst.end_amount  ";

        $total = $this->objGeneral->count_duplicate_in_sql('gl_category', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE gl_category
                        SET
                            name='".$arr_attr['name']."',
                            code='".$arr_attr['code']."',
                            start_amount='".$arr_attr['start_amount']."',
                            end_amount='".$arr_attr['end_amount']."',
                            status='".$arr_attr['statuss']."',
                            company_id='".$arr_attr['company_id']."'
                        WHERE id = ".$arr_attr['id']." 
                        Limit 1";

        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated!';
        }
        return $response;
    }

    function delete_gl_category($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "UPDATE gl_category
				SET status = 0
				WHERE id = ".$arr_attr['id']." Limit 1";
        /* $Sql = "DELETE FROM gl_category
          WHERE  Limit 1"; */
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not deleted!';
        }
        return $response;
    }

    function get_gl_category_by_type($attr)
    {
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT gl_category.id, gl_category.name
		        FROM gl_category
		        left  JOIN company on company.id=gl_category.company_id
                where gl_category.status=1 and 
                     (gl_category.company_id=" . $this->arrUser['company_id'] . " or  
                      company.parent_id=" . $this->arrUser['company_id'] . ")";

        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'gl_category', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $response['response'][] = $result;
            }
        } 
        else {
            $response['response'] = array();
        }
        return $response;
    }

    //----------------------------------------------------//
    //					GENERAL SECTION					  //
    //----------------------------------------------------//
    // Company Module
    //----------------------------------------------------

    function get_companies($attr)
    {
        $limit_clause = $where_clause = $order_type = "";

        // global $objFilters;
        // $where = self::setCondtionArray($attr[condition]);
        // return $objFilters->get_module_listing(25, "company", '', '', '', '', $where);

        // if ($this->arrUser['user_type'] == NORMAL_USER_TYPE) {
        //     $response['ack'] = 0;
        //     $response['error'] = 'You don\'t have permission!';
        //     return $response;
        // }

        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = "";
        $response = array();

        

        $Sql = "SELECT  ri.parent_id,
                        ri.id AS c_id, 
                        ri.name, 
                        ri.url, 
                        ri.city, 
                        ri.postcode, 
                        ri.telephone, 
                        ri.logo, 
                        c.name AS country,ri.id 
                FROM company ri
                LEFT JOIN country c ON  ri.country_id = c.id
                WHERE ri.status=1 AND 
                     (ri.id=".$this->arrUser['company_id']." OR 
                      ri.parent_id=".$this->arrUser['company_id'].")";

        // echo $Sql;exit;
        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'ri', $order_type);
        $RS = $this->CSI($response['q'], "general", sr_ViewPermission);
        $response['q'] = '';
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id']       = $Row['c_id'];
                $result['name']     = $Row['name'];
                $result['url']      = $Row['url'];
                $result['city']     = $Row['city'];
                $result['postcode'] = $Row['postcode'];
                $result['telephone']= $Row['telephone'];
                $result['logo']     = $Row['logo'];
                $result['country']  = $Row['country'];
                
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_company_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if (isset($attr['set_defaut_company']))
            $this->arrUser['company_id'] = $attr['id'];

        $Sql = "SELECT *
				FROM company
				WHERE id='".$attr['id']."'
				LIMIT 1";

        // $RS = $this->CSI($Sql);
        $RS = $this->CSI($Sql, "general", sr_ViewPermission);

        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }


    function get_company_emails($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT *
				FROM client_configuration
				WHERE company_id='".$attr['company']."' and 
                      user_id = '".$attr['user']."' and 
                      status = 1";
        //echo $Sql;
        
        $RS = $this->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;

        while ($Row = $RS->FetchRow()) {
            $res['email'] = $Row['username'];
            $res['alias'] = $Row['alias'];
            $res['signature'] = $Row['id'];
            $response['response'][] = $res;
        }
        return $response;
    }

    function get_company_opertunity_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if (isset($attr['set_defaut_company']))
            $this->arrUser['company_id'] = $attr['id'];

        $Sql = "SELECT opp_cycle_limit,
                       oop_cycle_edit_role,
                       oppCycleFreqstartmonth 
                FROM company 
                WHERE id='".$attr['id']."' 
                LIMIT 1";

        $RS = $this->CSI($Sql, 'sales_crm', sr_ViewPermission);
        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_companies_by_parent_id($attr)
    {
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $this->objGeneral->mysql_clean($attr);
        //echo "user==.>".$this->arrUser[user_type]; exit;

       if ($this->arrUser['user_type'] != NORMAL_USER_TYPE)
            $where_clause .= " AND parent_id = '".$attr['parent_id']."' ";

        $Sql = "SELECT c.id,c.name,c.logo 
                FROM company c 	
                WHERE 1 " . $where_clause;

        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        
        $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['name'] = $Row['name'];
                    $result['logo'] = $Row['logo'];
                }
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_company($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $parent_id = 0;

        if ($this->arrUser['user_type'] == SUPER_ADMIN_USER_TYPE || $this->arrUser['user_type'] == COMPANY_ADMIN_USER_TYPE) {
            $parent_id = $this->arrUser['company_id'];
        }

        $opp_cycle_limit = isset($attr['opp_cycle_limit'])?$attr['opp_cycle_limit']:5;
        $oppCycleFreqstartmonth = isset($attr['oppCycleFreqstartmonth'])?$attr['oppCycleFreqstartmonth']:0;        
        $decimal_range   = isset($attr['decimal_range'])?$attr['decimal_range']:0;
        
        $Sql = "INSERT INTO company
                                SET 
                                    name = '".$attr['name']."',
                                    url = '".$attr['url']."', 
                                    address = '".$attr['address']."',
                                    address_2 = '".$attr['address_2']."',
                                    city = '".$attr['city']."', 
                                    county = '".$attr['county']."',
                                    postcode = '".$attr['postcode']."', 
                                    country_id = '".$attr['country_id']."',
                                    email = '".$attr['email']."',
                                    telephone = '".$attr['telephone']."',
                                    fax = '".$attr['fax']."', 	
                                    direct_line = '".$attr['direct_line']."',
                                    timezone = '".$attr['timezone']."', 
                                    date_format = '".$attr['date_format']."',
                                    time_format = '".$attr['time_format']."',
                                    currency_id = '".$attr['currency_id']."',
                                    theme = '".$attr['theme']."',
                                    logo = '".$attr['logo']."',
                                    parent_id = '".$parent_id."' ,
                                    additionalInformation = '".$attr['additionalInformation']."',
                                    decimal_range = '".$decimal_range."',
                                    num_user_login = '10',
                                    opp_cycle_limit = '".$opp_cycle_limit."',
                                    oppCycleFreqstartmonth = '".$oppCycleFreqstartmonth."',
                                    user_id = " . $this->arrUser['id'] . " ";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);
        $id = $this->Conn->Insert_ID();
        // insert product tabs and fields array
        //$this->create_product_tabs_fields($id, 0);
        // insert hr tabs and fields array
        //$this->create_hr_tabs_fields($id, $this->arrUser['id']);

        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['id'] = $id;


            $companydef = $this->UploadCompanyDefaults($id, $attr['currency_id']);

            // Inserting ownership types 
            $segments = array("Soletrader", "Partnership", "Limited", "plc");
            $Sql = "INSERT INTO crm_owner (title, description, status, owner_type, company_id,user_id, created_date,
                                             AddedBy, AddedOn, ChangedBy, ChangedOn) VALUES ";
            foreach($segments as $title)
            {
                 $Sql .="('".$title."', '', 1, 1, ".$id.", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()),
                        ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), ".$this->arrUser['id'].", 
                        UNIX_TIMESTAMP (NOW())),"; 
            } 

            $RS = $this->CSI(substr($Sql, 0, -1));
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
        }
        return $response;
    }

    function UploadCompanyDefaults($companyID, $currency_id){
        // ref posting groups
        $Sql = "INSERT INTO ref_posting_group (ref_id, name, status, date_created, company_id,user_id) VALUES 
                                              (1, 'UK', 1,UNIX_TIMESTAMP (NOW()), ".$companyID.", ".$this->arrUser['id']."),
                                              (2, 'EU', 1,UNIX_TIMESTAMP (NOW()), ".$companyID.", ".$this->arrUser['id']."),
                                              (3, 'Outside EU', 1,UNIX_TIMESTAMP (NOW()), ".$companyID.", ".$this->arrUser['id'].")"; 
            
        $RS = $this->CSI($Sql);
        // vat 
        $Sql2 = "INSERT INTO vat (ref_id, vat_name, vat_value,status,company_id,user_id) VALUES 
                                (1, '20% VAT', '20','Active',".$companyID.", ".$this->arrUser['id']."),
                                (2, '5% VAT', '5','Active',".$companyID.", ".$this->arrUser['id']."),
                                (3, 'Zero Rated', '0','Active',".$companyID.", ".$this->arrUser['id']."),
                                (4, 'Exempt', '0','Active',".$companyID.", ".$this->arrUser['id'].")"; 
            
        $RS2 = $this->CSI($Sql2); 

 
        $Sql3 = "INSERT INTO vat_posting_grp_setup (vatRateID,ref_id, postingGrpID, vat, company_id,user_id, AddedBy, AddedOn) 
                                SELECT v.id, 1,rfg.id, 
                                    CASE    
                                        WHEN rfg.name = 'UK' THEN v.vat_value 
                                        ELSE 0
                                    END
                                    , 
                                    ".$companyID.", ".$this->arrUser['id'].", ".$this->arrUser['id'].",UNIX_TIMESTAMP (NOW())
                                FROM vat AS v, ref_posting_group AS rfg
                                WHERE 
                                v.company_id = ".$companyID." AND rfg.company_id=".$companyID; 
        // echo $Sql3;exit;
        $RS3 = $this->CSI($Sql3);
        
        
        
        // module codes
        $Sql4=" INSERT INTO ref_module_category_value (module_code_id, module_category_id, type, prefix, range_from, range_to, status, company_id, user_id, date_created)
                SELECT id, 2, 0, default_prefix, default_range_from, default_range_to, 1, ".$companyID.",".$this->arrUser['id'].",UNIX_TIMESTAMP (NOW()) FROM ref_module_table";
        $RS4 = $this->CSI($Sql4); 

        
        // currency
        $Sql5=" INSERT INTO currency (name, code, ref_currency_id, status, company_id, user_id, start_date, conversion_rate)
                SELECT name, code, id, 'Active', ".$companyID.",".$this->arrUser['id'].",0, 1 FROM ref_currency where id=$currency_id";
        $RS5 = $this->CSI($Sql5); //start_date = UNIX_TIMESTAMP (NOW())
        $cid = $this->Conn->Insert_ID();

        // update with latest currency id
        $Sql6=" UPDATE company SET currency_id = ".$cid." WHERE id=".$companyID;
        $RS6 = $this->CSI($Sql6);

        // currency history insert
        $Sql10=" INSERT INTO currency_histroy (currency_id, conversion_rate, start_date, status, company_id, emp_id) VALUES 
                                              (".$cid.", '1', 0, 'Active','".$companyID."', '".$this->arrUser['id']."')";
        $RS10 = $this->CSI($Sql10); //start_date =UNIX_TIMESTAMP (NOW())


         // Default Social media
        $Sql6=" INSERT INTO ref_social_media (NAME, description, company_id, user_id, STATUS, date_created)VALUES 
                                             ('Skype', 'skype', '".$companyID."', '".$this->arrUser['id']."', '1', UNIX_TIMESTAMP(NOW())), 
                                             ('Youtube', 'youtube', '".$companyID."', '".$this->arrUser['id']."', '1', UNIX_TIMESTAMP(NOW())),
                                             ('Twitter', 'twitter', '".$companyID."', '".$this->arrUser['id']."', '1', UNIX_TIMESTAMP(NOW())),
                                             ('Flickr', 'flickr', '".$companyID."', '".$this->arrUser['id']."', '1', UNIX_TIMESTAMP(NOW())),
                                             ('Outlook', 'outlook', '".$companyID."', '".$this->arrUser['id']."', '1', UNIX_TIMESTAMP(NOW())),
                                             ('Google Plus', 'google plus', '".$companyID."', '".$this->arrUser['id']."', '1', UNIX_TIMESTAMP(NOW())),
                                             ('Gmail', 'gmail', '".$companyID."', '".$this->arrUser['id']."', '1', UNIX_TIMESTAMP(NOW())),
                                             ('Whatsapp', 'whatsapp', '".$companyID."', '".$this->arrUser['id']."', '1', UNIX_TIMESTAMP(NOW())),
                                             ('Vimeo', 'vimeo', '".$companyID."', '".$this->arrUser['id']."', '1', UNIX_TIMESTAMP(NOW())),
                                             ('Pinterest', 'pinterest', '".$companyID."', '".$this->arrUser['id']."', '1', UNIX_TIMESTAMP(NOW())),
                                             ('Facebook', 'facebook', '".$companyID."', '".$this->arrUser['id']."', '1', UNIX_TIMESTAMP(NOW())),
                                             ('Instagram', 'instagram', '".$companyID."', '".$this->arrUser['id']."', '1', UNIX_TIMESTAMP(NOW())),
                                             ('LinkedIn', 'linkedin', '".$companyID."', '".$this->arrUser['id']."', '1', UNIX_TIMESTAMP(NOW()));";
        $RS6 = $this->CSI($Sql6);


        // Default Sales Department
        $Sql7 = "INSERT INTO config_departments (name,ref_id, company_id, user_id, status, type, AddedBy, AddedOn) VALUES 
                                                ('Sales',1, ".$companyID.", ".$this->arrUser['id'].", 1,2,UNIX_TIMESTAMP (NOW()),".$this->arrUser['id'].")"; 
            
        $RS7 = $this->CSI($Sql7);

        // Default Cause of Inactivity as instructed by Nevid bhai
        $Sql8 = "INSERT INTO cause_of_inactivity (name, company_id, user_id, status) VALUES 
                             ('Sick', " .$companyID. ", " . $this->arrUser['id']. ", 1),
                             ('Holiday', " .$companyID. ", " . $this->arrUser['id']. ", 1),
                             ('Maternity Leave', " .$companyID. ", " . $this->arrUser['id']. ", 1),
                             ('Garden Leave', " .$companyID. ", " . $this->arrUser['id']. ", 1),
                             ('Paternity pay', " .$companyID. ", " . $this->arrUser['id']. ", 1),
                             ('Left the Company', " .$companyID. ", " . $this->arrUser['id']. ", 1)";
        $RS8 = $this->CSI($Sql8);


        $Sql9 = "INSERT INTO warehouse_storage_type (title,company_id) VALUES 
                                                    ('Transit', " .$companyID. "),
                                                    ('Virtual', " .$companyID. ")"; 
        $RS9 = $this->CSI($Sql9);
        
        // margin analysis
        /* $Sql10 = "INSERT INTO item_additional_cost (title, ref_id, status, user_id, company_id, type, AddedBy, AddedOn) VALUES
                                                ('Item Cost', '1', '1', " . $this->arrUser['id']. "," .$companyID. ", '2', " . $this->arrUser['id']. ", UNIX_TIMESTAMP(NOW())),
                                                ('Shipment Charges', '2', '1', " . $this->arrUser['id']. "," .$companyID. ", '2', " . $this->arrUser['id']. ", UNIX_TIMESTAMP(NOW())),
                                                ('Customs Clearance', '3', '1', " . $this->arrUser['id']. "," .$companyID. ", '2', " . $this->arrUser['id']. ", UNIX_TIMESTAMP(NOW())),
                                                ('Shunting Charges', '4', '1', " . $this->arrUser['id']. "," .$companyID. ", '2', " . $this->arrUser['id']. ", UNIX_TIMESTAMP(NOW())),
                                                ('Demurrage Charges', '5', '1', " . $this->arrUser['id']. "," .$companyID. ", '2', " . $this->arrUser['id']. ", UNIX_TIMESTAMP(NOW())),
                                                ('Palletisation Costs', '6', '1', " . $this->arrUser['id']. "," .$companyID. ", '2', " . $this->arrUser['id']. ", UNIX_TIMESTAMP(NOW()))";
          */
        $Sql10 = "INSERT INTO item_additional_cost (title, ref_id, status, user_id, company_id, type, AddedBy, AddedOn) VALUES
                                                ('Item Cost', '1', '1', " . $this->arrUser['id']. "," .$companyID. ", '2', " . $this->arrUser['id']. ", UNIX_TIMESTAMP(NOW())),
                                                ('Additional Cost 1', '2', '1', " . $this->arrUser['id']. "," .$companyID. ", '2', " . $this->arrUser['id']. ", UNIX_TIMESTAMP(NOW())),
                                                ('Additional Cost 2', '3', '1', " . $this->arrUser['id']. "," .$companyID. ", '2', " . $this->arrUser['id']. ", UNIX_TIMESTAMP(NOW())),
                                                ('Additional Cost 3', '4', '1', " . $this->arrUser['id']. "," .$companyID. ", '2', " . $this->arrUser['id']. ", UNIX_TIMESTAMP(NOW())),
                                                ('Additional Cost 4', '5', '1', " . $this->arrUser['id']. "," .$companyID. ", '2', " . $this->arrUser['id']. ", UNIX_TIMESTAMP(NOW()))";
        
        $RS10 = $this->CSI($Sql10);
        
        // CRM/CUSTOMER classification
        // for($i=1; $i<=6; $i++)
        {
            $Sql11 = "INSERT INTO ref_classification (name, status, user_id, company_id, type, date_created) VALUES
                                                ('Lead', '1',  " . $this->arrUser['id']. "," .$companyID. ", '1', UNIX_TIMESTAMP(NOW()))";
            $RS11 = $this->CSI($Sql11);
            $id = $this->Conn->Insert_ID();
            
            $Sql12 = "INSERT INTO active_classification (company_id, ref_type, user_id, created_date, type) VALUES
                                                (" .$companyID. ", $id,  " . $this->arrUser['id']. ",UNIX_TIMESTAMP(NOW()), '1')";
            $RS12 = $this->CSI($Sql12);
            // ------------------------------------------------------------------------------------------------------------------------
            $Sql11 = "INSERT INTO ref_classification (name, status, user_id, company_id, type, date_created) VALUES
                                                ('Indirect Customer', '1',  " . $this->arrUser['id']. "," .$companyID. ", '1', UNIX_TIMESTAMP(NOW()))";
            $RS11 = $this->CSI($Sql11);
            $id = $this->Conn->Insert_ID();
            
            $Sql12 = "INSERT INTO active_classification (company_id, ref_type, user_id, created_date, type) VALUES
                                                (" .$companyID. ", $id,  " . $this->arrUser['id']. ",UNIX_TIMESTAMP(NOW()), '1')";
            $RS12 = $this->CSI($Sql12);
            // ------------------------------------------------------------------------------------------------------------------------
            $Sql11 = "INSERT INTO ref_classification (name, status, user_id, company_id, type, date_created) VALUES
                                                ('Prospect', '1',  " . $this->arrUser['id']. "," .$companyID. ", '1', UNIX_TIMESTAMP(NOW()))";
            $RS11 = $this->CSI($Sql11);
            $id = $this->Conn->Insert_ID();
            
            $Sql12 = "INSERT INTO active_classification (company_id, ref_type, user_id, created_date, type) VALUES
                                                (" .$companyID. ", $id,  " . $this->arrUser['id']. ",UNIX_TIMESTAMP(NOW()), '1')";
            $RS12 = $this->CSI($Sql12);
            // ------------------------------------------------------------------------------------------------------------------------
            
            $Sql11 = "INSERT INTO ref_classification (name, status, user_id, company_id, type, date_created) VALUES                                    
                                                ('Not Relevant', '1', " . $this->arrUser['id']. "," .$companyID. ", '1', UNIX_TIMESTAMP(NOW()))";
            $RS11 = $this->CSI($Sql11);
            $id = $this->Conn->Insert_ID();
            
            $Sql12 = "INSERT INTO active_classification (company_id, ref_type, user_id, created_date, type) VALUES
                                                (" .$companyID. ", $id,  " . $this->arrUser['id']. ",UNIX_TIMESTAMP(NOW()), '1')";
            $RS12 = $this->CSI($Sql12);
            // ------------------------------------------------------------------------------------------------------------------------
           
            $Sql11 = "INSERT INTO ref_classification (name, status, user_id, company_id, type, date_created) VALUES
                                                ('Customer', '1', " . $this->arrUser['id']. "," .$companyID. ", '12', UNIX_TIMESTAMP(NOW()))";
            $RS11 = $this->CSI($Sql11);
            $id = $this->Conn->Insert_ID();
            
            $Sql12 = "INSERT INTO active_classification (company_id, ref_type, user_id, created_date, type) VALUES
                                                (" .$companyID. ", $id,  " . $this->arrUser['id']. ",UNIX_TIMESTAMP(NOW()), '12')";
            $RS12 = $this->CSI($Sql12);
            // ------------------------------------------------------------------------------------------------------------------------
           
            $Sql11 = "INSERT INTO ref_classification (name, status, user_id, company_id, type, date_created) VALUES
                                                ('Previous Customer',  '1', " . $this->arrUser['id']. "," .$companyID. ", '12', UNIX_TIMESTAMP(NOW()))";
            $RS11 = $this->CSI($Sql11);
            $id = $this->Conn->Insert_ID();
            
            $Sql12 = "INSERT INTO active_classification (company_id, ref_type, user_id, created_date, type) VALUES
                                                (" .$companyID. ", $id,  " . $this->arrUser['id']. ",UNIX_TIMESTAMP(NOW()), '12')";
            $RS12 = $this->CSI($Sql12);
            // ------------------------------------------------------------------------------------------------------------------------
           
            $Sql11 = "INSERT INTO ref_classification (name, status, user_id, company_id, type, date_created) VALUES
                                                ('Dissolved/Liquidated', '1', " . $this->arrUser['id']. "," .$companyID. ", '12', UNIX_TIMESTAMP(NOW()))";
            $RS11 = $this->CSI($Sql11);
            $id = $this->Conn->Insert_ID();
            
            $Sql12 = "INSERT INTO active_classification (company_id, ref_type, user_id, created_date, type) VALUES
                                                (" .$companyID. ", $id,  " . $this->arrUser['id']. ",UNIX_TIMESTAMP(NOW()), '12')";
            $RS12 = $this->CSI($Sql12);
        }
        
        
        // SRM/SUPPLIER classification
        // for($i=1; $i<=4; $i++)
        {
            $Sql11 = "INSERT INTO ref_classification (name, status, user_id, company_id, type, date_created) VALUES
                                                ('Potential Supplier', '1',  " . $this->arrUser['id']. "," .$companyID. ", '3', UNIX_TIMESTAMP(NOW()))";
            $RS11 = $this->CSI($Sql11);
            $id = $this->Conn->Insert_ID();
            
            $Sql12 = "INSERT INTO active_classification (company_id, ref_type, user_id, created_date, type) VALUES
                                                (" .$companyID. ", $id,  " . $this->arrUser['id']. ",UNIX_TIMESTAMP(NOW()), '3')";
            $RS12 = $this->CSI($Sql12);
            // ------------------------------------------------------------------------------------------------------------------------
           
            $Sql11 = "INSERT INTO ref_classification (name, status, user_id, company_id, type, date_created) VALUES
                                                ('Supplier', '1',  " . $this->arrUser['id']. "," .$companyID. ", '34', UNIX_TIMESTAMP(NOW()))";
            $RS11 = $this->CSI($Sql11);
            $id = $this->Conn->Insert_ID();
            
            $Sql12 = "INSERT INTO active_classification (company_id, ref_type, user_id, created_date, type) VALUES
                                                (" .$companyID. ", $id,  " . $this->arrUser['id']. ",UNIX_TIMESTAMP(NOW()), '34')";
            $RS12 = $this->CSI($Sql12);
            // ------------------------------------------------------------------------------------------------------------------------
           
            $Sql11 = "INSERT INTO ref_classification (name, status, user_id, company_id, type, date_created) VALUES
                                                ('Previous Supplier', '1',  " . $this->arrUser['id']. "," .$companyID. ", '34', UNIX_TIMESTAMP(NOW()))";
            $RS11 = $this->CSI($Sql11);
            $id = $this->Conn->Insert_ID();
            
            $Sql12 = "INSERT INTO active_classification (company_id, ref_type, user_id, created_date, type) VALUES
                                                (" .$companyID. ", $id,  " . $this->arrUser['id']. ",UNIX_TIMESTAMP(NOW()), '34')";
            $RS12 = $this->CSI($Sql12);
            // ------------------------------------------------------------------------------------------------------------------------
           
            $Sql11 = "INSERT INTO ref_classification (name, status, user_id, company_id, type, date_created) VALUES
                                                ('Dissolved/Liquidated', '1',  " . $this->arrUser['id']. "," .$companyID. ", '34', UNIX_TIMESTAMP(NOW()))";
            $RS11 = $this->CSI($Sql11);
            $id = $this->Conn->Insert_ID();
            
            $Sql12 = "INSERT INTO active_classification (company_id, ref_type, user_id, created_date, type) VALUES
                                                (" .$companyID. ", $id,  " . $this->arrUser['id']. ",UNIX_TIMESTAMP(NOW()), '34')";
            $RS12 = $this->CSI($Sql12);
        }

        $widgetUsersSql = "INSERT INTO widgetuser (company_id,widget_id,user_id,active,pos,query)
                                    SELECT ".$companyID.",id,".$this->arrUser['id'].",0,pos,queryDef
                                    FROM widgets;";

        // echo $widgetUsersSql;
        $widgetUsers = $this->CSI($widgetUsersSql);
        return 1;

    }

    function update_company($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if ($attr['old_logo'] != $attr['logo']) {
            unlink(UPLOAD_PATH . $attr['old_logo']);
        }
        $num_user_login = ($attr['num_user_login'] != '') ? $attr['num_user_login'] : 0;
        $Sql = "UPDATE company   
                            SET    
                                name = '".$attr['name']."',
                                url = '".$attr['url']."',    
                                address = '".$attr['address']."',    
                                address_2 = '".$attr['address_2']."',    
                                city = '".$attr['city']."',   
                                county = '".$attr['county']."',   
                                postcode = '".$attr['postcode']."',   
                                country_id = '".$attr['country_id']."',  
                                email = '".$attr['email']."',   
                                telephone = '".$attr['telephone']."',  
                                fax = '".$attr['fax']."',   
                                direct_line = '".$attr['direct_line']."',    
                                timezone = '".$attr['timezone']."',    
                                date_format = '".$attr['date_format']."',   
                                time_format = '".$attr['time_format']."',   
                                currency_id = '".$attr['currency_id']."',   
                                theme = '".$attr['theme']."',   
                                logo = '".$attr['logo']."', 
                                additionalInformation = '".$attr['additionalInformation']."',  
                                decimal_range = '".$attr['decimal_range']."',    
                                num_user_login = '".$num_user_login."'    
                            WHERE id = ".$attr['id']." 
                            Limit 1";
                                
        //,opp_cycle_limit = '$attr[opp_cycle_limit]'
        //  echo $Sql; exit;

        // $RS = $this->CSI($Sql);
        $RS = $this->CSI($Sql, "general", sr_ViewPermission);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['Update'] = 1;
            $response['id'] = $attr['id'];
        } elseif ($this->Conn->Affected_Rows() == 0) {
            $response['ack'] = 2;
            $response['error'] = 'Record Updated Successfully';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }
        return $response;
    }

    function update_company_opertunity_cycle($attr)
    {
        $this->objGeneral->mysql_clean($attr);        
        $oppCycleFreqstartmonth = isset($attr['oppCycleFreqstartmonth'])?$attr['oppCycleFreqstartmonth']:0;

        $Sql = "UPDATE company
                            SET
                                 opp_cycle_limit = '" . $attr['opp_cycle_limit'] . "',
                                 oop_cycle_edit_role = '" . $attr['oop_cycle_edit_role'] . "',
                                 oppCycleFreqstartmonth = '".$oppCycleFreqstartmonth."'
                                 WHERE id = '" . $attr['id'] . "' Limit 1";

        /* echo $Sql . "<hr>";
        exit; */
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['Update'] = 1;
            $response['id'] = $attr['id'];
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }
        return $response;
    }

    function delete_company($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "update  company set status=0 WHERE id = ".$attr['id']." ";
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }
        return $response;
    }

    // Company Addresses Module
    //----------------------------------------------------
    function get_company_addresses($attr)
    {
        $limit_clause = $where_clause = $order_type = "";

        // if ($this->arrUser['user_type'] == NORMAL_USER_TYPE) {
        //     $response['ack'] = 0;
        //     $response['error'] = 'You don\'t have permission!';
        //     $response['no_permission'] = 1;
        //     return $response;
        // }

        $this->objGeneral->mysql_clean($attr);

        if (!empty($attr['company_id'])) {
            $where_clause .= " AND company_id = $attr[company_id]";
        }

        if (!empty($attr['keyword'])) {
            $where_clause .= " AND name LIKE '%$attr[keyword]%' ";
        }

        $response = array();

        $Sql = "SELECT c.*
				FROM company_addresses c
				WHERE 1 " . $where_clause . " ";

        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        
        $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        // $RS = $this->CSI($response['q']);

        $RS = $this->CSI($response['q'], "general", sr_ViewPermission);

        $response['q'] = '';
        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                    $result = array();
                    $result['id'] = $Row['id'];
                    // $result['address_code'] = $Row['address_code'];
                    $result['name'] = $Row['name'];
                    $result['address_1'] = $Row['address_1'];
                    $result['city'] = $Row['city'];
                    $result['postcode'] = $Row['postcode'];
                    $result['contact_person'] = $Row['contact_person'];
                    $result['mobile'] = $Row['mobile'];
                    $result['email'] = $Row['email'];
                }
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_company_address_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM company_addresses
				WHERE id='".$attr['id']."'
				LIMIT 1";

        // $RS = $this->CSI($Sql);
        $RS = $this->CSI($Sql, "general", sr_ViewPermission);

        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_company_address($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        // $parent_id = 0;

        /* if ($this->arrUser['user_type'] == COMPANY_ADMIN_USER_TYPE) {
            $parent_id = $this->arrUser['company_id'];
        } */

        $data_pass = " tst.name = '".$attr['name']."' ";
        $total = $this->objGeneral->count_duplicate_in_sql('company_addresses', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO company_addresses
				                    SET 
                                        company_id = '".$attr['company_id']."',
                                        name = '".$attr['name']."',
                                        address_1 = '".$attr['address_1']."',
                                        address_2 = '".$attr['address_2']."',
                                        county = '".$attr['county']."',
                                        postcode = '".$attr['postcode']."',
                                        country_id = '".$attr['country_id']."',
                                        city = '".$attr['city']."',
                                        telephone = '".$attr['telephone']."',
                                        fax = '".$attr['fax']."',
                                        status =1,
                                        contact_person = '".$attr['contact_person']."',
                                        job_title = '".$attr['job_title']."',
                                        email = '".$attr['email']."',
                                        mobile = '".$attr['mobile']."'";

        // echo $Sql; exit;
        // $RS = $this->CSI($Sql);
        $RS = $this->CSI($Sql, "general", sr_ViewPermission);

        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
        }
        return $response;
    }

    function update_company_address($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $where_id = '';

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = " tst.name = '".$attr['name']."'  ".$where_id;
        $total = $this->objGeneral->count_duplicate_in_sql('company_addresses', $data_pass, $this->arrUser['company_id']);

        if ($total >0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
        $id = $attr['id'];

        if($id>0){

            $Sql = "UPDATE company_addresses
				                SET 
                                    name = '".$attr['name']."',
                                    address_1 = '".$attr['address_1']."',
                                    address_2 = '".$attr['address_2']."',
                                    county = '".$attr['county']."',
                                    postcode = '".$attr['postcode']."',
                                    country_id = '".$attr['country_id']."',
                                    city = '".$attr['city']."',
                                    telephone = '".$attr['telephone']."',
                                    fax = '".$attr['fax']."',
                                    contact_person = '".$attr['contact_person']."',
                                    job_title = '".$attr['job_title']."',
                                    email = '".$attr['email']."',
                                    mobile = '".$attr['mobile']."'
				                WHERE id = ".$id." 
                                Limit 1";
            // echo $Sql; exit;
            // $RS = $this->CSI($Sql);  
            
            $RS = $this->CSI($Sql, "general", sr_ViewPermission);
        }
        else{
            $Sql = "INSERT INTO company_addresses
				                    SET 
                                        company_id = '".$attr['company_id']."',
                                        name = '".$attr['name']."',
                                        address_1 = '".$attr['address_1']."',
                                        address_2 = '".$attr['address_2']."',
                                        county = '".$attr['county']."',
                                        postcode = '".$attr['postcode']."',
                                        country_id = '".$attr['country_id']."',
                                        city = '".$attr['city']."',
                                        telephone = '".$attr['telephone']."',
                                        fax = '".$attr['fax']."',
                                        status =1,
                                        contact_person = '".$attr['contact_person']."',
                                        job_title = '".$attr['job_title']."',
                                        email = '".$attr['email']."',
                                        mobile = '".$attr['mobile']."'";
            // echo $Sql; exit;
            // $RS = $this->CSI($Sql);
            $RS = $this->CSI($Sql, "general", sr_ViewPermission);

            $id = $this->Conn->Insert_ID();
        }

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;
        } elseif ($this->Conn->Affected_Rows() == 0) {
            $response['ack'] = 2;
            $response['error'] = 'Record Updated Successfully';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }
        return $response;
    }

    function delete_company_address($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM company_addresses
				WHERE id = ".$attr['id'] ;

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }
        return $response;
    }

    // Financial Settings Module
    //----------------------------------------------------
    function get_financial_settings()
    {
        // if ($this->arrUser['user_type'] == NORMAL_USER_TYPE) {
        //     $response['ack'] = 0;
        //     $response['error'] = 'You don\'t have permission!';
        //     return $response;
        // }

        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $Sql = "SELECT   c.* 
                FROM  financial_settings c
                LEFT JOIN company on company.id=c.company_id
                WHERE  c.company_id=" . $this->arrUser['company_id']; 
        
        //c.user_id=".$this->arrUser['id']."
        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        
        $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response'][] = $Row;
            }
        } 
        else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_glaccount_byid($acc_id)
    {
        $Sql = "SELECT accountCode,displayName
				FROM gl_account
				WHERE id='".$acc_id."'
				LIMIT 1";

        /* $Sql = "SELECT account_code,name
				FROM company_gl_accounts
				WHERE id='$acc_id'
				LIMIT 1"; */
    
        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            return $Row["accountCode"] . " - " . $Row["displayName"];
        }
        return 0;
    }

    function get_financial_setting_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT fs.*,(SELECT CONCAT(accountCode,' - ',displayName)
                             FROM gl_account
                             WHERE id=fs.vat_lieability_receve_gl_account
                             LIMIT 1) AS vat_lieability_receve_gl_account_code
                        
				FROM financial_settings AS fs
				WHERE fs.company_id='".$attr['id']."'
				LIMIT 1";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();

            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }            

            $Row['date_of_incorporation'] = $this->objGeneral->convert_unix_into_date($Row['date_of_incorporation']);
            $Row['year_end_date'] = $this->objGeneral->convert_unix_into_date($Row['year_end_date']);
            $Row['year_start_date'] = $this->objGeneral->convert_unix_into_date($Row['year_start_date']);
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {
            $response['response'] = null;
            $response['ack'] = 0;
            $response['error'] = NULL;
        }        
        return $response;
    }

    function updateCompanyHolidaySettings($attr){
        $Sql = "UPDATE company SET
                                holiday_start_month = ".$attr['month']." WHERE id = " . $this->arrUser['company_id'] . " ";
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
                $response['ack'] = 1;
                $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }

        return $response;
    }

    function getCompanyHolidaySettings($attr){
        $Sql = "SELECT holiday_start_month FROM company where id = " . $this->arrUser['company_id'] . " ";

        /* $Sql = "SELECT account_code,name
				FROM company_gl_accounts
				WHERE id='$acc_id'
				LIMIT 1"; */
    
        //echo $Sql; exit;
        $RS = $this->CSI($Sql, "human_resource", sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['ack'] = 1;
            $response['holiday_start_month'] = $Row['holiday_start_month'];
        }
        else{
            $response['ack'] = 0;
        }
        return $response;
    }

    function getCompanyFinancialSettingByID($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT id,company_id,year_start_date,year_end_date,is_whole_seller,
                        date_of_incorporation,vat_scheme,submission_frequency,vat_number,
                        hmrc_usesr_id,company_reg_no,vat_reg_no,type_of_business_ownership,
                        posting_start_date,posting_end_date,taxOfficeName
				FROM financial_settings
				WHERE company_id=" . $this->arrUser['company_id'] . "
				LIMIT 1";

        //echo $Sql; exit;
        // $RS = $this->CSI($Sql);
        if($attr['isAllowed']){
            $RS = $this->CSI($Sql);
        }else{
            $RS = $this->CSI($Sql, "general", sr_ViewPermission);
        }

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();

            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            
            $Row['year_start_date'] = $this->objGeneral->convert_unix_into_date($Row['year_start_date']);
            $Row['year_end_date'] = $this->objGeneral->convert_unix_into_date($Row['year_end_date']);
            $Row['date_of_incorporation'] = $this->objGeneral->convert_unix_into_date($Row['date_of_incorporation']);

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {
            $response['response'] = null;
            $response['ack'] = 0;
            $response['error'] = NULL;
        }        
        return $response;
    }

    function get_foreign_currency_movement_by_company_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT fs.realised_movement_gl_ac,
                       fs.unrealised_movement_gl_ac,
                        (SELECT CONCAT(accountCode,' - ',displayName)
                             FROM gl_account
                             WHERE id=fs.realised_movement_gl_ac
                             LIMIT 1) AS realised_movement_gl_ac_code,
                        (SELECT CONCAT(accountCode,' - ',displayName)
                             FROM gl_account
                             WHERE id=fs.unrealised_movement_gl_ac
                             LIMIT 1) AS unrealised_movement_gl_ac_code
				FROM financial_settings as fs
				WHERE fs.company_id='".$attr['id']."'
				LIMIT 1";
        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = null;
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_financial_setting($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $parent_id = 0;

        if ($this->arrUser['user_type'] == COMPANY_ADMIN_USER_TYPE) {
            $parent_id = $this->arrUser['company_id'];
        }
        
        $vat_lieability_receve_gl_account = (isset($attr['vat_lieability_receve_gl_account']) && $attr['vat_lieability_receve_gl_account'] != '')?$attr['vat_lieability_receve_gl_account']: 0;  
        $vat_sales_type = (isset($attr['vat_sales_type']) && $attr['vat_sales_type'] != '')?$attr['vat_sales_type']: 0; 
        $is_whole_seller = (isset($attr['is_whole_seller']) && $attr['is_whole_seller'] == true)? 1: 0;

        $submission_frequency = (isset($attr['submission_frequency']) && $attr['submission_frequency'] != '')? $attr['submission_frequency']: 0;

        $sqla = "SELECT id	
                      FROM financial_settings
                      WHERE company_id='" . $this->arrUser['company_id'] . "'
                      Limit 1";

        // echo $sqla;exit;
        $rsa = $this->CSI($sqla);

        $id = $rsa->fields['id'];

        if ($id > 0) {            

            $Sql = "UPDATE financial_settings
                        SET
                            year_start_date = '" . $this->objGeneral->convert_date($attr['year_start_date']) . "',
                            year_end_date = '" . $this->objGeneral->convert_date($attr['year_end_date']) . "',
                            date_of_incorporation = '" . $this->objGeneral->convert_date($attr['date_of_incorporation']) . "',
                            vat_scheme = '".$attr['vat_scheme']."',
                            submission_frequency = '".$submission_frequency."',
                            vat_number = '".$attr['vat_number']."',
                            hmrc_usesr_id = '".$attr['hmrc_usesr_id']."',
                            vat_reg_no = '".$attr['vat_reg_no']."',
                            taxOfficeName='".$attr['taxOfficeName']."',
                            company_reg_no = '".$attr['company_reg_no']."',
                            type_of_business_ownership = '".$attr['type_of_business_ownership']."',
                            is_whole_seller = '".$is_whole_seller."'
                        WHERE id = ".$id." ";

            $RS = $this->CSI($Sql);
            /* 
                            vat_sales_type = '$vat_sales_type',
                            vat_lieability_receve_gl_account = '$vat_lieability_receve_gl_account', */

            if ($this->Conn->Affected_Rows() > 0) {
                $response['ack'] = 1;
                $response['error'] = NULL;
            } else {
                $response['ack'] = 0;
                $response['error'] = 'Record cannot be updated';
            }
                            
        }else{    

            $Sql = "INSERT INTO financial_settings
                            SET
                                user_id='" . $this->arrUser['id'] . "',
                                company_id = '".$attr['company_id']."',
                                year_start_date = '" . $this->objGeneral->convert_date($attr['year_start_date']) . "',
                                year_end_date = '" . $this->objGeneral->convert_date($attr['year_end_date']) . "',
                                date_of_incorporation = '" . $this->objGeneral->convert_date($attr['date_of_incorporation']) . "',
                                vat_scheme = '".$attr['vat_scheme']."',
                                submission_frequency = '".$submission_frequency."',
                                vat_number = '".$attr['vat_number']."',
                                taxOfficeName='".$attr['taxOfficeName']."',
                                hmrc_usesr_id = '".$attr['hmrc_usesr_id']."',
                                vat_reg_no = '".$attr['vat_reg_no']."',
                                company_reg_no = '".$attr['company_reg_no']."',
                                type_of_business_ownership = '".$attr['type_of_business_ownership']."',
                                is_whole_seller = '".$is_whole_seller."'";

                                /* 
                                vat_sales_type = '".$vat_sales_type."', 
                                vat_lieability_receve_gl_account = '".$vat_lieability_receve_gl_account."',*/

            /* vat_sale_gl = '$attr[vat_sale_gl]',
            vat_purchase_gl = '$attr[vat_purchase_gl]',
            vat_lieability_receve_gl = '$attr[vat_lieability_receve_gl]' */

            // echo $Sql; exit;
            $RS = $this->CSI($Sql);
            $id = $this->Conn->Insert_ID();
         

            if ($id > 0) {
                $response['ack'] = 1;
                $response['error'] = NULL;
            } else {
                $response['ack'] = 0;
                $response['error'] = 'Record not inserted!';
            }
        }
        return $response;
    }

    function update_financial_setting($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $vat_lieability_receve_gl_account = (isset($attr['vat_lieability_receve_gl_account']) && $attr['vat_lieability_receve_gl_account'] != '')? $attr['vat_lieability_receve_gl_account']: 0;  
        $vat_sales_type = (isset($attr['vat_sales_type']) && $attr['vat_sales_type'] != '')? $attr['vat_sales_type']: 0;  
        $submission_frequency = (isset($attr['submission_frequency']) && $attr['submission_frequency'] != '')? $attr['submission_frequency']: 0;  
        $is_whole_seller = (isset($attr['is_whole_seller']) && $attr['is_whole_seller'] == true)? 1: 0;  


        $Sql = "UPDATE financial_settings
                       SET
                          year_start_date = '" . $this->objGeneral->convert_date($attr['year_start_date']) . "',
                          year_end_date = '" . $this->objGeneral->convert_date($attr['year_end_date']) . "',
                          date_of_incorporation = '" . $this->objGeneral->convert_date($attr['date_of_incorporation']) . "',
                          vat_scheme = '".$attr['vat_scheme']."',
                          submission_frequency = '".$submission_frequency."',
                          vat_number = '".$attr['vat_number']."',
                          hmrc_usesr_id = '".$attr['hmrc_usesr_id']."',
                          vat_reg_no = '".$attr['vat_reg_no']."',
                          taxOfficeName='".$attr['taxOfficeName']."',
                          company_reg_no = '".$attr['company_reg_no']."',
                          type_of_business_ownership = '".$attr['type_of_business_ownership']."',
                          is_whole_seller = '".$is_whole_seller."'

                          WHERE id = ".$attr['id']." 
                          Limit 1";

                          /* 
                          vat_sales_type = '$vat_sales_type',
                          vat_lieability_receve_gl_account = '$vat_lieability_receve_gl_account', */

        // echo $Sql; exit;
        /* vat_sale_gl = '$attr[vat_sale_gl]',
          vat_purchase_gl = '$attr[vat_purchase_gl]',
          vat_lieability_receve_gl = '$attr[vat_lieability_receve_gl]', */

        // $RS = $this->CSI($Sql);

        $RS = $this->CSI($Sql, "general", sr_AddEditPermission);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }
        return $response;
    }

    function update_financial_exchange_rate($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if ($attr['id'] > 0) {

            $Sql = "UPDATE financial_settings
                       SET
                          realised_movement_gl_ac = '".$attr['realised_movement_gl_ac']."',
                          unrealised_movement_gl_ac = '".$attr['unrealised_movement_gl_ac']."'
                          WHERE id = ".$attr['id']." 
                          Limit 1";
        } else {

            $Sql = "INSERT INTO financial_settings
                        SET
                            user_id='" . $this->arrUser['id'] . "',
                            company_id = '".$attr['company_id']."',
                            realised_movement_gl_ac = '".$attr['realised_movement_gl_ac']."',
                            unrealised_movement_gl_ac = '".$attr['unrealised_movement_gl_ac']."'";
        }
        // echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }
        return $response;
    }

    function delete_financial_settings($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "Update financial_settings 
                Set status=0
				WHERE id = ".$attr['id']." 
                Limit 1";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }
        return $response;
    }

    function get_comp_start_end_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT year_end_date,year_start_date
				FROM financial_settings
				WHERE company_id='".$attr['id']."'
				LIMIT 1";
        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = null;
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    // Module Codes Module
    //-----------------------------------------------------

    function get_modules_codes($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $where_clause = "";

        $Sql = "SELECT  mv.*, 
                        mc.id AS mc_id, 
                        ct.name AS cat_name, 
                        bd.brandname AS bname,
                        rmt.display_name as module_table,
                        rmt.parent_cat_id,
                        rmpc.name as parent_cat_name
				FROM ref_module_category_value mv
				LEFT JOIN category ct ON ct.id = mv.category_id
				LEFT JOIN brand bd ON bd.id = mv.brand_id 
                LEFT JOIN ref_module_table rmt ON rmt.id = mv.module_code_id
				LEFT JOIN company ON company.id = mv.company_id
				LEFT JOIN ref_module_category mc ON mc.id = mv.module_category_id
                LEFT JOIN ref_module_parent_categories rmpc on rmpc.id = rmt.parent_cat_id
				WHERE mv.status=1 AND 
                      rmt.status=1 AND
                     (mv.company_id=" . $this->arrUser['company_id'] . "  or
                      company.parent_id=" . $this->arrUser['company_id'] . ")" . $where_clause . "
				ORDER BY rmt.parent_cat_id, mv.id ASC";//rmt.sort_id
        //  echo $Sql ;exit;

        $RS = $this->CSI($Sql, 'general', sr_ViewPermission);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $cat_type = ($Row['type'] == 0) ? 'Internal' : 'External';
                $cat_name = ($Row['cat_name'] != NULL) ? ", Category: " . $Row['cat_name'] : "";
                $bnd_name = ($Row['bname'] != NULL) ? ", Brand: " . $Row['bname'] : "";
                $range_from_length = strlen($Row['range_from']);
                $last_sequence_num_length = strlen($Row['last_sequence_num']);
                $count = $this->objGeneral->getCounter($range_from_length, $last_sequence_num_length);
                
                $result["id"]           =  $Row['id'];
                $result["module"]       =  $Row['module_table'];
                $result["type"]         =  $cat_type . $cat_name . $bnd_name;
                $result["brand_name"]   =  $Row['bname'];
                $result["prefix"]       =  $Row['prefix'];
                $result["range_from"]   =  $Row['range_from'];
                $result["range_to"]     =  $Row['range_to'];
                $last_sequence_num      = ($Row['last_sequence_num'] != null) ? ($Row['last_sequence_num']-1) : '';
                $result["last_code"]    =  ($Row['last_sequence_num'] != null) ? $Row['prefix'].substr($Row['range_from'], 0, $count).($Row['last_sequence_num']-1):'';
                $result["parent_cat_id"]=  $Row['parent_cat_id'];
                
                $response['response'][$Row['parent_cat_name']][] = $result;

            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = "no record found!";
        }

        return $response;
    }

    function get_module_code_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT mv.*, mc.id AS mc_id, ct.name AS cat_name, bd.brandname AS bname
                FROM ref_module_category_value mv
                INNER JOIN ref_module_category mc ON mc.id = mv.module_category_id
                LEFT JOIN category ct ON ct.id = mv.category_id
                LEFT JOIN brand bd ON bd.id = mv.brand_id
                LEFT JOIN company ON company.id = mv.company_id
                WHERE  mv.id='".$attr['id']."' AND 
                       mv.status=1 AND 
                       (mv.company_id=" . $this->arrUser['company_id'] . " or  
                        company.parent_id=" . $this->arrUser['company_id'] . ")
                LIMIT 1";
        //echo $Sql; exit;

        $RS = $this->CSI($Sql);      

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['modulesList'] = $this->get_controllers();
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = null;
            $response['ack'] = 0;
            $response['error'] = "no record found!";
        }
        return $response;
    }

    function get_module_code_by_controller($attr)
    {
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $this->objGeneral->mysql_clean($attr); //md.controller AS md_controller, //INNER JOIN ref_module_code md ON md.controller = mv.module_code_id
        $Sql = "SELECT mv.*, mc.id AS mc_id, ct.name AS cat_name, bd.brandname AS bname
				FROM ref_module_category_value mv
				INNER JOIN ref_module_category mc ON mc.id = mv.module_category_id
				LEFT JOIN category ct ON ct.id = mv.category_id
				LEFT JOIN brand bd ON bd.id = mv.brand_id
				WHERE mv.module_code_id='" . $attr['controller'] . "' and 
                      mv.user_id='" . $this->arrUser['id'] . "' and
                      mv.company_id='" . $this->arrUser['company_id'] . "' ";

        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        
        $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'mc', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                if ($Row['module_category_id'] == 2) {

                    $response['response']['generic'][] = array(
                        "id" => $Row['id'],
                        "brand" => $Row['brand_id'],
                        "category" => $Row['category_id'],
                        "mc_id" => $Row['mc_id'],
                        "module_category_id" => $Row['module_category_id'],
                        "module_code_id" => $Row['module_code_id'],
                        "prefix" => $Row['prefix'],
                        "range_from" => $Row['range_from'],
                        "range_to" => $Row['range_to'],
                        "status" => $Row['status'],
                        "type" => $Row['type'],
                    );
                } 
                else if ($Row['module_category_id'] == 3) {
                    $cat_type = ($Row['type'] == 0) ? 'Internal' : 'External';

                    $response['response']['category'][] = array(
                        "id" => $Row['id'],
                        "category_id" => $Row['category_id'],
                        "category" => $Row['cat_name'],
                        "type" => $cat_type,
                        "mc_id" => $Row['mc_id'],
                        "module_category_id" => $Row['module_category_id'],
                        "module_code_id" => $Row['module_code_id'],
                        "prefix" => $Row['prefix'],
                        "range_from" => $Row['range_from'],
                        "range_to" => $Row['range_to'],
                        "status" => $Row['status']
                    );
                } 
                else if ($Row['module_category_id'] == 1) {
                    $bnd_type = ($Row['type'] == 0) ? 'Internal' : 'External';

                    $response['response']['brand'][] = array(
                        "id" => $Row['id'],
                        "brand_id" => $Row['brand_id'],
                        "brand" => $Row['bname'],
                        "type" => $bnd_type,
                        "mc_id" => $Row['mc_id'],
                        "module_category_id" => $Row['module_category_id'],
                        "module_code_id" => $Row['module_code_id'],
                        "prefix" => $Row['prefix'],
                        "range_from" => $Row['range_from'],
                        "range_to" => $Row['range_to'],
                        "status" => $Row['status']
                    );
                }
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = null;
            $response['ack'] = 0;
            $response['error'] = "no record found!";
        }
        return $response;
    }

    function add_module_code($attr)
    {
        $srLogTrace = array();
        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['ErrorMessage'] = "";

        $this->SRTraceLogsPHP($srLogTrace);

        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
        // echo "<pre>";
        // print_r($attr); exit;

        $RecordAdded = "";
        $DuplicateRange = 0;
        $DuplicateMessage = "";
        $module_category = (isset($attr['module_category'])) ? $attr['module_category'] : '';
        
        if ($module_category == '2') { // Without Brands module
            
            if (isset($attr['genericIntExt']) && $attr['genericIntExt'] == 0) {
                $Sql = "";
                $moduleCodeId = "";

                if ($attr['generic_id'] >0) {

                    $Sql = "UPDATE ref_module_category_value	
                                            SET 
                                                status='" . $attr['g_status'] . "', 
                                                module_code_id = '" . $attr['controller'] . "',
                                                module_category_id=2,
                                                type=0,
                                                category_id='0',
                                                brand_id='0', 
                                                prefix='" . $attr['generic_prefix'] . "', 
                                                range_from='" . $attr['generic_range_from'] . "', 
                                                range_to='" . $attr['generic_range_to'] . "', 
                                                user_id='" . $this->arrUser['id'] . "',
                                                company_id='" . $this->arrUser['company_id'] . "'
                                            WHERE id=" . $attr['generic_id'];

                    $moduleCodeId = "mv.id <> ".$attr['generic_id']." AND ";

                } else {
                    $Sql = "INSERT INTO ref_module_category_value
                                                    SET 
                                                        status=1, 
                                                        module_code_id = '" . $attr['controller'] . "',
                                                        module_category_id=2,
                                                        type=0,  
                                                        prefix='" . $attr['generic_prefix'] . "', 
                                                        range_from='" . $attr['generic_range_from'] . "', 
                                                        range_to='" . $attr['generic_range_to'] . "', 
                                                        user_id='" . $this->arrUser['id'] . "',
                                                        company_id='" . $this->arrUser['company_id'] . "', 
                                                        date_created='" . strtotime('now') . "'";
                }

                // echo $Sql;exit;
                $SqlCheckRange = "SELECT mv.* 
                                  FROM ref_module_category_value mv
                                  WHERE  ".$moduleCodeId." 
                                         module_code_id = '" . $attr['controller'] . "' AND 
                                         mv.status=1 AND 
                                         LOWER(mv.prefix)=LOWER('" . $attr['generic_prefix'] . "') AND 
                                         mv.company_id=" . $this->arrUser['company_id'] . "
                                  LIMIT 1";

                // echo  $SqlCheckRange;exit;

                $RSCheckRange = $this->CSI($SqlCheckRange);
                $DuplicateCheck = 0;

                if ($RSCheckRange->RecordCount() > 0) {
                    while ($Range = $RSCheckRange->FetchRow()) {
                        if (($attr['generic_range_from'] >= $Range['range_from'] && $attr['generic_range_from'] <= $Range['range_to']) || ($attr['generic_range_to'] >= $Range['range_from'] && $attr['generic_range_to'] <= $Range['range_to'])) {
                            $DuplicateCheck = 1;
                        }
                    }
                }
                // echo $DuplicateCheck;exit;

                if ($DuplicateCheck > 0) {
                    $DuplicateRange = 1;
                    $DuplicateMessage = "Duplicate Range";
                } 
                else {
                    $RS = $this->CSI($Sql);

                    if ($attr['generic_id'] == "") {
                        $response['id'] = $this->Conn->Insert_ID();
                    } 
                    else {
                        $response['id'] = "";
                    }
                    $RecordAdded = 1;
                }
            } 
            /* else if ($attr['generic_id'] != "") {

                $Sql = "DELETE FROM ref_module_category_value 
                        WHERE id=" . $attr['generic_id'];

                $RS = $this->CSI($Sql);
                $RecordAdded = 1;
            } */

            if (isset($attr['genericIntExt']) && $attr['genericIntExt'] == 1) {
                $Sql = "";

                if ($attr['generic_id'] != "") {
                    $Sql = "UPDATE ref_module_category_value
                                                SET 
                                                    status=1, 
                                                    module_code_id = '" . $attr['controller'] . "',
                                                    module_category_id=2,
                                                    type=1, 
                                                    category_id='0', 
                                                    brand_id='0', 
                                                    prefix='',
                                                    range_from='', 
                                                    range_to='', 
                                                    user_id='" . $this->arrUser['id'] . "',
                                                    company_id='" . $this->arrUser['company_id'] . "' 
                                                WHERE id=" . $attr['generic_id'] . "
                                                Limit 1";
                } 
                else {
                    $Sql = "INSERT INTO ref_module_category_value
                                                SET 
                                                    status=1,
                                                    module_code_id = '" . $attr['controller'] . "',
                                                    module_category_id=2,
                                                    type=1, 
                                                    category_id='', 
                                                    brand_id='', 
                                                    prefix='', 
                                                    range_from='', 
                                                    range_to='', 
                                                    user_id='" . $this->arrUser['id'] . "',
                                                    company_id='" . $this->arrUser['company_id'] . "', 
                                                    date_created='" . strtotime('now') . "'";
                }

                $RS = $this->CSI($Sql);

                if ($attr['generic_id'] == "") {
                    $response['id'] = $this->Conn->Insert_ID();
                } 
                else {
                    $response['id'] = "";
                }

                $RecordAdded = 1;
            } 
            /* else if ($attr['generic_id'] != "") {

                $Sql = "DELETE FROM ref_module_category_value 
                        WHERE id=" . $attr['generic_id'];

                $RS = $this->CSI($Sql);
                $RecordAdded = 1;
            } */
        } 
        else if ($module_category == '3') {

            if ($attr['category_category'] != "" && $attr['category_type'] != "" && $attr['category_status'] != "") {
                
                $cat_category = isset($attr['category_category']) ? $attr['category_category']->id : '';
                $cat_prefix = isset($attr['category_prefix']) ? $attr['category_prefix'] : '';
                $cat_range_from = isset($attr['category_range_from']) ? $attr['category_range_from'] : '';
                $cat_range_to = isset($attr['category_range_to']) ? $attr['category_range_to'] : '';
                $cat_status = isset($attr['category_status']) ? $attr['category_status']->id : '';
                $cat_type = 0;

                if ($attr['category_type']->id == "1") {
                    $cat_prefix = "";
                    $cat_range_from = "";
                    $cat_range_to = "";
                    $cat_type = 1;
                }

                $Sql = "";
                $HSql = "";
                $Action = "";
                $Code_id = "";

                $Action_status = ($cat_status == 1) ? 'Active' : 'Inactive';

                if ($attr['category_id'] != "") {
                    $Sql = "UPDATE ref_module_category_value
                                            SET 
                                                status=".$cat_status.", 
                                                module_code_id = '" . $attr['controller'] . "',
                                                module_category_id=3,
                                                type=".$cat_type.", 
                                                category_id='".$cat_category."', 
                                                brand_id='0', 
                                                prefix='".$cat_prefix."',
                                                range_from='".$cat_range_from."', 
                                                range_to='".$cat_range_to."', 
                                                user_id='" . $this->arrUser['id'] . "',
                                                company_id='" . $this->arrUser['company_id'] . "' 
                                            WHERE id=" . $attr['category_id'];

                    $moduleCodeId = "mv.id <> ".$attr['category_id']." AND ";
                } 
                else {
                    $Sql = "INSERT INTO ref_module_category_value
                                            SET 
                                                status=".$cat_status.", 
                                                module_code_id = '" . $attr['controller'] . "',
                                                module_category_id=3,
                                                type=".$cat_type.", 
                                                category_id='".$cat_category."', 
                                                brand_id='', 
                                                prefix='".$cat_prefix."',
                                                range_from='".$cat_range_from."', 
                                                range_to='".$cat_range_to."', 
                                                user_id='" . $this->arrUser['id'] . "',
                                                company_id='" . $this->arrUser['company_id'] . "', 
                                                date_created='" . strtotime('now') . "'";
                }
                // echo $Sql;exit;
                //$SqlCheckRange = "SELECT mv.id FROM ref_module_category_value mv INNER JOIN company ON company.id=mv.company_id WHERE $moduleCodeId module_code_id = '" . $attr['controller'] . "' AND LOWER(mv.prefix)=LOWER('" . $cat_prefix . "') AND (('" . $cat_range_from . "' BETWEEN mv.range_from AND mv.range_to) OR ('" . $cat_range_to . "' BETWEEN mv.range_from AND mv.range_to) OR (mv.range_from BETWEEN '" . $cat_range_from . "' AND '" . $cat_range_to . "') OR (mv.range_to BETWEEN '" . $cat_range_from . "' AND '" . $cat_range_to . "')) AND mv.status=1";
                if ($cat_type == 0) {

                    $SqlCheckRange = "SELECT mv.* 
                                      FROM ref_module_category_value mv
                                      INNER JOIN company ON company.id=mv.company_id
                                      WHERE  ".$moduleCodeId." 
                                             module_code_id = '" . $attr['controller'] . "' AND 
                                             mv.status=1 AND 
                                             LOWER(mv.prefix)=LOWER('" . $cat_prefix . "') AND 
                                             (mv.company_id=" . $this->arrUser['company_id'] . " or
                                              company.parent_id=" . $this->arrUser['company_id'] . ")
                                      LIMIT 1";

                    $RSCheckRange = $this->CSI($SqlCheckRange);
                    $DuplicateCheck = 0;

                    if ($RSCheckRange->RecordCount() > 0) {
                        while ($Range = $RSCheckRange->FetchRow()) {
                            if (($cat_range_from >= $Range['range_from'] && $cat_range_from <= $Range['range_to']) || ($cat_range_to >= $Range['range_from'] && $cat_range_to <= $Range['range_to'])) {
                                $DuplicateCheck = 1;
                                break;
                            }
                        }
                    }
                    // if ($RSCheckRange->RecordCount() > 0) {
                    if ($DuplicateCheck > 0) {
                        $DuplicateRange = 1;
                        $DuplicateMessage = "Duplicate Range";
                    } 
                    else {
                        if ($Sql != "") {

                            $RS = $this->CSI($Sql);
                            if ($attr['category_id'] == "") {
                                $response['id'] = $this->Conn->Insert_ID();
                                $Action = "Add";
                                $Code_id = $response['id'];
                            } 
                            else {
                                $Action = "Edit";
                                $Code_id = $attr['category_id'];
                                $response['id'] = "";
                            }

                            $RecordAdded = 1;
                        }
                    }
                } 
                else if ($cat_type == 1) {
                    if ($attr['category_id'] == "") {

                        $SSql = "SELECT mv.*
                                 FROM ref_module_category_value mv
                                 INNER JOIN company ON company.id=mv.company_id
                                 WHERE  category_id = '".$cat_category."' AND 
                                        type=1 AND 
                                        (mv.company_id=" . $this->arrUser['company_id'] . " or  
                                        company.parent_id=" . $this->arrUser['company_id'] . ")";


                        $RSS = $this->CSI($SSql);
                        if ($RSS->RecordCount() > 0) {
                            $Sql = "";
                        }
                    }

                    if ($Sql != "") {
                        $RS = $this->CSI($Sql);
                        if ($attr['category_id'] == "") {
                            $response['id'] = $this->Conn->Insert_ID();
                            $Action = "Add";
                            $Code_id = $response['id'];
                        } 
                        else {
                            $Action = "Edit";
                            $Code_id = $attr['category_id'];
                            $response['id'] = "";
                        }
                        $RecordAdded = 1;
                    }
                }

                if ($RecordAdded == 1) {
                    $HSql = "INSERT INTO ref_module_code_history
                                                SET
                                                    code_id='" . $Code_id . "',
                                                    action_status='".$Action_status."',
                                                    user_id='" . $this->arrUser['id'] . "', 
                                                    company_id='" . $this->arrUser['company_id'] . "', 
                                                    action='".$Action."', 
                                                    status=1, 
                                                    date_created='" . current_date . "'";
                            
                    $HRS = $this->CSI($HSql);
                }
            }
        } 
        else if ($module_category == '1') { // With Brands module

            if ($attr['brand_brand'] != "" && $attr['brand_type'] != "" && $attr['brand_status'] != "") {
                
                $bnd_brand = isset($attr['brand_brand']) ? $attr['brand_brand']->id : '';
                $bnd_prefix = isset($attr['brand_prefix']) ? $attr['brand_prefix'] : '';
                $bnd_range_from = isset($attr['brand_range_from']) ? $attr['brand_range_from'] : '';
                $bnd_range_to = isset($attr['brand_range_to']) ? $attr['brand_range_to'] : '';
                $bnd_status = isset($attr['brand_status']) ? $attr['brand_status']->id : '';
                $bnd_type = 0;

                if ($attr['brand_type']->id == "1") {
                    $bnd_prefix = "";
                    $bnd_range_from = "";
                    $bnd_range_to = "";
                    $bnd_type = 1;
                }

                $HSql = "";
                $Action = "";
                $Code_id = "";
                $Action_status = ($bnd_status == 1) ? 'Active' : 'Inactive';
                $Sql = "";

                $Exist = 0;
                $last_sequence_num = 0;
                $rangeFrom = 0;
                $rangeTo = 0;

                if ($attr['brand_id'] != "") {
                    $SqlDUPChk = "SELECT mv.* 
                                      FROM ref_module_category_value mv
                                      WHERE  brand_id = '" . $attr['brand_id'] . "' AND                                              
                                             mv.status=1 AND 
                                             mv.company_id=" . $this->arrUser['company_id'] . "
                                      limit 1";

                    $RSDUPChk = $this->CSI($SqlDUPChk);

                    if ($RSDUPChk->RecordCount() > 0) { //
                        $RowDUPChk = $RSDUPChk->FetchRow();
                        $last_sequence_num = $RowDUPChk['last_sequence_num'];
                        $rangeFrom = $RowDUPChk['range_from'];
                        $rangeTo = $RowDUPChk['range_to'];
                        $moduleType = $RowDUPChk['type'];

                        $Exist = 1;
                    }
                }
                else{
                    $Exist = 1;
                }

                if($last_sequence_num > $rangeFrom && $moduleType != $bnd_type && $Exist > 0){
                    $response['ack'] = 0;
                    $response['error'] = 'Sequence No. for this Brand is already generated';

                    $srLogTrace = array();
                    $srLogTrace['ErrorCode'] = '';
                    $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                    $srLogTrace['Function'] = __FUNCTION__;
                    $srLogTrace['CLASS'] = __CLASS__;
                    $srLogTrace['Parameter1'] = 'Exit';
                    $srLogTrace['ErrorMessage'] = 'Sequence No. for this Brand is already generated';

                    $this->SRTraceLogsPHP($srLogTrace);
                    return $response;                  
                }

                $moduleCodeId = '';

                // if ($attr['brand_id'] != "") {
                if ($Exist >0) {
                    $Sql = "UPDATE ref_module_category_value
                                        SET 
                                            status=".$bnd_status.", 
                                            module_code_id = '" . $attr['controller'] . "',
                                            module_category_id=1,
                                            type=".$bnd_type.", 
                                            category_id='0', 
                                            brand_id='".$bnd_brand."', 
                                            prefix='".$bnd_prefix."',
                                            range_from='".$bnd_range_from."', 
                                            range_to='".$bnd_range_to."', 
                                            user_id='" . $this->arrUser['id'] . "',
                                            company_id='" . $this->arrUser['company_id'] . "' 
                                        WHERE id=" . $attr['generic_id'];

                    $moduleCodeId = "mv.id <> ".$attr['generic_id']." AND ";
                } 
                else {
                    $Sql = "INSERT INTO ref_module_category_value
                                                SET 
                                                    status=".$bnd_status.", 
                                                    module_code_id = '" . $attr['controller'] . "',
                                                    module_category_id=1,
                                                    type=".$bnd_type.",  
                                                    brand_id='".$bnd_brand."', 
                                                    prefix='".$bnd_prefix."',
                                                    range_from='".$bnd_range_from."', 
                                                    range_to='".$bnd_range_to."', 
                                                    user_id='" . $this->arrUser['id'] . "',
                                                    company_id='" . $this->arrUser['company_id'] . "', 
                                                    date_created='" . current_date . "'";
                }
                
                if ($bnd_type == 0) {

                    $SqlCheckRange = "SELECT mv.* 
                                      FROM ref_module_category_value mv
                                      WHERE  ".$moduleCodeId."
                                             module_code_id = '" . $attr['controller'] . "' AND 
                                             LOWER(mv.prefix)=LOWER('" . $bnd_prefix . "') AND 
                                             mv.status=1 AND
                                             mv.company_id=" . $this->arrUser['company_id'] . " ";


                    $RSCheckRange = $this->CSI($SqlCheckRange);
                    $DuplicateCheck = 0;

                    if ($RSCheckRange->RecordCount() > 0) {
                        while ($Range = $RSCheckRange->FetchRow()) {
                            if (($bnd_range_from >= $Range['range_from'] && $bnd_range_from <= $Range['range_to']) || ($bnd_range_to >= $Range['range_from'] && $bnd_range_to <= $Range['range_to'])) {
                                $DuplicateCheck = 1;
                                break;
                            }
                        }
                    }

                    if($Exist >0 && ($last_sequence_num >0 && $rangeFrom != $bnd_range_from)){

                        $DuplicateRange = 1;
                        $DuplicateMessage = "Sequence No. for Range From is already generated";
                    } 
                    elseif($Exist >0 && ($last_sequence_num >0 && $bnd_range_to < $last_sequence_num)){

                        $DuplicateRange = 1;
                        $DuplicateMessage = "Range To is less than generated sequence No.";
                    }                   
                    elseif ($DuplicateCheck > 0) {
                        $DuplicateRange = 1;
                        $DuplicateMessage = "Duplicate Range";
                    } else {

                        if ($Sql != "") {
                            // echo $Sql;exit;
                            $RS = $this->CSI($Sql);

                            if ($attr['brand_id'] == "") {
                                $response['id'] = $this->Conn->Insert_ID();
                                $Action = "Add";
                                $Code_id = $response['id'];
                            } else {
                                $response['id'] = "";
                                $Action = "Edit";
                                $Code_id = $attr['brand_id'];
                            }
                            $RecordAdded = 1;
                        }
                    }
                } else if ($bnd_type == 1) {

                    if ($attr['brand_id'] == "") {

                        $SSql = "SELECT mv.* 
                                 FROM ref_module_category_value mv
                                 WHERE  brand_id = '".$bnd_brand."' AND 
                                        type=1 AND 
                                        mv.company_id=" . $this->arrUser['company_id'] . " ";

                        $RSS = $this->CSI($SSql);
                        if ($RSS->RecordCount() > 0) {
                            $Sql = "";
                        }
                    }

                    if ($Sql != "") {
                        $RS = $this->CSI($Sql);
                        if ($attr['brand_id'] == "") {
                            $response['id'] = $this->Conn->Insert_ID();
                            $Action = "Add";
                            $Code_id = $response['id'];
                        } else {
                            $response['id'] = "";
                            $Action = "Edit";
                            $Code_id = $attr['brand_id'];
                        }
                        $RecordAdded = 1;
                    }
                }


                if ($RecordAdded == 1) {
                    // 

                    $HSql = "INSERT INTO ref_module_code_history
                                                SET
                                                    code_id='" . $Code_id . "',
                                                    action_status='".$Action_status."', 
                                                    user_id='" . $this->arrUser['id'] . "', 
                                                    company_id='" . $this->arrUser['company_id'] . "', 
                                                    action='".$Action."', 
                                                    status=1, 
                                                    date_created='" . current_date . "'";
                    // echo $HSql;exit;
                    $HRS = $this->CSI($HSql);
                }
            }
        }

        if ($DuplicateRange > 0) {
            $response['ack'] = 2;
            $response['action'] = $Action;            
            $response['error'] = $DuplicateMessage;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = "";

            $this->SRTraceLogsPHP($srLogTrace);

        } else if ($RecordAdded > 0) {
            // echo 'stop1';exit;
            $response['ack'] = 1;
            $response['action'] = $Action; 
            $response['error'] = NULL;
             $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = "";

            $this->SRTraceLogsPHP($srLogTrace);
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record not inserted!';

            $this->SRTraceLogsPHP($srLogTrace);
        }
        return $response;
    }

    function delete_module_rule($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "DELETE FROM ref_module_category_value WHERE id=".$attr['id'];
        $RS = $this->CSI($Sql);
        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $HSql = "UPDATE ref_module_code_history SET status=0 WHERE code_id='" . $attr['id'] . "'";
            $HRS = $this->CSI($HSql);
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }

        return $response;
    }

    function update_module_code($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "UPDATE ref_module_code_prefix
				SET prefix = '".$attr['prefix']."',
                    prefix_length = '".$attr['prefix_length']."'
				WHERE id = ".$attr['id']." Limit 1";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }

        return $response;
    }

    function delete_module_code($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "UPDATE ref_module_category_value
			SET  status=0
			WHERE id = ".$attr['id']. " Limit 1";


        /* $Sql = "DELETE FROM ref_module_code_prefix
          WHERE id = ".$attr['id']." ";
         */
        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }

        return $response;
    }

    function get_module_code_history($attr)
    {
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT mh.*  FROM ref_module_code_history mh
            INNER JOIN company ON company.id = mh.company_id
            INNER JOIN ref_module_category_value mv ON mv.id=mh.code_id
				WHERE mh.status=1 AND mh.code_id='" . $attr['id'] . "' AND mh.company_id='" . $this->arrUser['company_id'] . "' AND mh.user_id='" . $this->arrUser['id'] . "'";


        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        
        $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $response['response'][] = array(
                    "id" => $Row['id'],
                    "user" => $this->arrUser['user_name'],
                    "action" => $Row['action'],
                    "status" => $Row['action_status'],
                    "date" => $this->objGeneral->convert_unix_into_date($Row['date_created'])
                );
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
            $response['response'] = array();
        }
        return $response;
    }

    function get_controllers()
    {
        // $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";

        $response = array();

        $Sql = "SELECT   c.id,c.name,c.display_name   
                FROM ref_module_table c where  c.status=1 ";

        $order_type = "order By c.sort_id ASC";
        $total_limit = 100; //pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        
        $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['display_name'] = $Row['display_name'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }

        return $response;
    }

    function get_controller($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM module_codes
				WHERE `table`='".$attr['table']."'
				LIMIT 1";
        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

// Bank Accounts Module
//-----------------------------------------------------
    function get_bank_accounts($attr)
    {
        // global $objFilters;
        // return $objFilters->get_module_listing(51, "bank_account", $attr[column], $attr[value], '', $attr[filter_id]);
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();
        $company_id = (isset($attr['column']) && $attr['column'] == 'company_id') ? $attr['value'] : $this->arrUser['company_id'];
        $chkPerm = (isset($attr['chkPerm']) && $attr['chkPerm'] != '') ? $attr['chkPerm'] : 0;

        $Sql = "SELECT bk.*,currency.name as crname
                FROM bank_account AS bk
                left JOIN company on company.id=bk.company_id
                left JOIN currency on currency.id=bk.currency_id
                WHERE bk.status=1 and bk.company_id=" . $company_id . "
                " . $where_clause . " ";
        // echo $Sql;exit;

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if($chkPerm == 0){
            $order_type = " ORDER BY bk.display_name ";
        }
        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'bk', $order_type);
        //echo $response['q'];exit;

        if($chkPerm>0)
            $RS = $this->CSI($response['q'], "General", sr_ViewPermission);
        else
            $RS = $this->CSI($response['q']);

        $response['q'] = '';
        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                // $result['preffered_name'] = ($Row['account_name'] != '') ?$Row['account_name'] : $Row['account_name'];
                $result['preferred_name'] = $Row['display_name'];
                $result['bank_name'] = $Row['name'];
                $result['currency'] = $Row['crname'];
                $result['account_name'] = $Row['account_name'];
                $result['sort_code'] = $Row['sort_code'];
                $result['account_no.'] = $Row['account_no'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_bank_accounts_all($attr)
    {
        //global $objFilters;
        //return $objFilters->get_module_listing(51, "bank_account",$attr[column],$attr[value],'',$attr[filter_id]);
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        if (!empty($attr['keyword'])) {
            $where_clause .= " AND module_title LIKE '%".$attr['keyword']."%' ";
        }

        $Sql = "SELECT bk.id, bk.name, bk.address, bk.city, bk.county, bk.account_no
			FROM bank_account bk
			left JOIN company on company.id=bk.company_id
			WHERE bk.status=1 and (bk.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
			" . $where_clause . " ";

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        
        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'bk', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['adddress'] = $Row['adddress'];
                $result['city'] = $Row['city'];
                $result['county'] = $Row['county'];
                $result['account_no'] = $Row['account_no'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_bank_account_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM bank_account
				WHERE id='".$attr['id']."'
				LIMIT 1";

        //echo $Sql; exit;
        // $RS = $this->CSI($Sql);
        $RS = $this->CSI($Sql, "general", sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = null;
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_bank_account($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $data_pass = "tst.account_no = '".$attr['account_no']."'  AND tst.name = '".$attr['name']."'  ";

        $total = $this->objGeneral->count_duplicate_in_sql('payment_methods', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $country_id = (isset($attr['country_id']) && $attr['country_id']!='')?$attr['country_id']:0;      
        $currency_id = (isset($attr['currency_id']) && $attr['currency_id']!='')?$attr['currency_id']:0;       
        // $gl_id = (isset($attr['gl_id']) && $attr['gl_id']!='')?$attr['gl_id']:0;   
        $gl_id = (isset($attr['gl_id']) && $attr['gl_id']!='')?$attr['gl_id']:'NULL';   


        if ($total == 0) {

            /* $Sql = "INSERT INTO bank_account
				SET account_name = '$attr[account_name]'
				,name = '".$attr['name']."',address = '$attr[address]',address_2 = '$attr[address_2]'
				,city = '$attr[city]',`county` = '$attr[county]',postcode = '$attr[postcode]'
				,country_id = '$attr[country_id]',phone_no = '$attr[phone_no]'
				,contact = '$attr[contact]',sort_code = '$attr[sort_code]'
				,account_no = '$attr[account_no]',fax = '$attr[fax]'
				,email = '$attr[email]',currency_id = '$attr[currency_id]'
				,gl_id = '$attr[gl_id]'
				,gl_name = '$attr[gl_name]'
				,gl_posting = '$attr[gl_posting]'
                ,swift_code = '$attr[swift_code]'
				,iban = '$attr[iban]',company_id = '$attr[company_id]'
				,mobile = '$attr[mobile]'" ; */
            $Sql = "Insert into bank_account
                                    SET 
                                        account_name = '".$attr['account_name']."',
                                        display_name = '".$attr['display_name']."',
                                        name = '".$attr['name']."',
                                        address = '".$attr['address']."',
                                        address_2 = '".$attr['address_2']."',
                                        city = '".$attr['city']."',
                                        county = '".$attr['county']."',
                                        postcode = '".$attr['postcode']."',
                                        country_id = '".$country_id."',
                                        phone_no = '".$attr['phone_no']."',
                                        contact = '".$attr['contact']."',
                                        sort_code = '".$attr['sort_code']."',
                                        account_no = '".$attr['account_no']."',
                                        fax = '".$attr['fax']."',
                                        email = '".$attr['email']."',
                                        currency_id = '".$currency_id."',
                                        gl_id = ".$gl_id.",
                                        gl_name = '".$attr['gl_name']."',                
                                        gl_posting = '".$attr['gl_posting']."',
                                        swift_code = '".$attr['swift_code']."',
                                        iban = '".$attr['iban']."' ,
                                        status=1,
                                        mobile = '".$attr['mobile']."',
                                        user_id='" . $this->arrUser['id'] . "',
                                        company_id='" . $this->arrUser['company_id'] . "'";
                
                //,status = '$attr[status]'
            $RS = $this->CSI($Sql);
            $response['id'] = $this->Conn->Insert_ID();
            // $response = $this->objGeneral->run_query_exception($Sql);
            // return $response;


            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record Inserted Successfully';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record already Exists';
        }
        return $response;
    }

    function update_bank_account($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        // print_r($attr);exit;
        $id = $attr['id'];
        $msg = 'Inserted';

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = " tst.account_no = '$attr[account_no]' AND tst.name = '".$attr['name']."' ".$where_id;//tst.account_name = '$attr[account_name]'
        $total = $this->objGeneral->count_duplicate_in_sql('bank_account', $data_pass, $this->arrUser['company_id']);

        if ($total >0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
        
        $country_id = (isset($attr['country_id']) && $attr['country_id']!='')?$attr['country_id']:0;      
        $currency_id = (isset($attr['currency_id']) && $attr['currency_id']!='')?$attr['currency_id']:0;      
        // $gl_id = (isset($attr['gl_id']) && $attr['gl_id']!='')?$attr['gl_id']:0;    
        $gl_id = (isset($attr['gl_id']) && $attr['gl_id']!='')?$attr['gl_id']:'NULL';    

        if ($id == 0) {

            $Sql = "INSERT INTO bank_account
                                    SET 
                                        account_name = '".$attr['account_name']."',
                                        display_name = '".$attr['display_name']."',
                                        name = '".$attr['name']."',
                                        address = '".$attr['address']."',
                                        address_2 = '".$attr['address_2']."',
                                        city = '".$attr['city']."',
                                        county = '".$attr['county']."',
                                        postcode = '".$attr['postcode']."',
                                        country_id = '".$country_id."',
                                        phone_no = '".$attr['phone_no']."',
                                        contact = '".$attr['contact']."',
                                        sort_code = '".$attr['sort_code']."',
                                        account_no = '".$attr['account_no']."',
                                        fax = '".$attr['fax']."',
                                        email = '".$attr['email']."',
                                        currency_id = '".$currency_id."',
                                        gl_id = ".$gl_id.",
                                        gl_name = '".$attr['gl_name']."',                
                                        gl_posting = '".$attr['gl_posting']."',
                                        swift_code = '".$attr['swift_code']."',
                                        iban = '".$attr['iban']."' ,
                                        status=1,
                                        mobile = '".$attr['mobile']."',
                                        user_id='" . $this->arrUser['id'] . "',
                                        company_id='" . $this->arrUser['company_id'] . "'"; 

            // $RS = $this->CSI($Sql);
            $RS = $this->CSI($Sql, "general", sr_ViewPermission);
            $id = $this->Conn->Insert_ID();
        } else {
            $Sql = "UPDATE bank_account
                                    SET 
                                        account_name = '".$attr['account_name']."',
                                        name = '".$attr['name']."',
                                        display_name = '".$attr['display_name']."',
                                        address = '".$attr['address']."',
                                        address_2 = '".$attr['address_2']."',
                                        city = '".$attr['city']."',
                                        county = '".$attr['county']."',
                                        postcode = '".$attr['postcode']."',
                                        country_id = '".$country_id."',
                                        phone_no = '".$attr['phone_no']."',
                                        contact = '".$attr['contact']."',
                                        sort_code = '".$attr['sort_code']."',
                                        account_no = '".$attr['account_no']."',
                                        fax = '".$attr['fax']."',
                                        email = '".$attr['email']."',
                                        currency_id = '".$currency_id."',
                                        gl_id = ".$gl_id.",
                                        gl_name = '".$attr['gl_name']."',
                                        gl_posting = '".$attr['gl_posting']."',
                                        swift_code = '".$attr['swift_code']."',
                                        iban = '".$attr['iban']."',
                                        mobile = '".$attr['mobile']."'
                                    WHERE id = " . $id . "   
                                    Limit 1"; 
                //,status = '$attr[statuss]'
            // $RS = $this->CSI($Sql);
            $RS = $this->CSI($Sql, "general", sr_ViewPermission);

            $msg = 'Update';
        }
        	// echo $Sql;exit;

        if ($id > 0) {
            $response['id'] = $id;
            $response['info'] = $msg;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['id'] = 0;
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
        }

        return $response;
    }

    function delete_bank_account($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "UPDATE bank_account SET status=".DELETED_STATUS." WHERE id = ".$attr['id']."  AND SR_CheckTransactionBeforeDelete(".$attr['id'].", ".$this->arrUser['company_id'].", 15,0) = 'success'";

        // echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['success'] = "Record deleted successfully";
        } else {
            $response['ack'] = 0;
            $response['error'] = 'This Bank Account is being used in another record';
        }
        return $response;
    }

    function getCompanyCurrency($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT *
				FROM company
				WHERE id='".$this->arrUser['company_id']."'
				LIMIT 1";

        $RS = $this->CSI($Sql,'general',sr_ViewPermission);
        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;

            $Sql2 = "SELECT   c.*,
                    IFNULL((SELECT d.conversion_rate  
                            FROM currency_histroy d
                            WHERE d.currency_id=c.id  
                            ORDER BY d.start_date DESC, d.action_date DESC
                            LIMIT 1), 1) AS conversion_rate_1,
                    IFNULL((SELECT d.start_date  
                            FROM currency_histroy d
                            WHERE d.currency_id=c.id   
                            ORDER BY d.start_date DESC, d.action_date DESC
                            LIMIT 1), c.start_date) AS start_date_1

                     FROM  currency c
                     left JOIN company on company.id=c.company_id
                     where  c.status=1 AND 
                        c.company_id=" . $this->arrUser['company_id']. "";

            $RS2 = $this->CSI($Sql2);

            if ($RS2->RecordCount() > 0) {
                while ($Row2 = $RS2->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row2['id'];
                    $result['code'] = $Row2['code'];
                    $result['name'] = $Row2['name'];
                    $result['symbol'] = $Row2['symbol'];
                    $result['conversion_rate'] = $Row2['conversion_rate_1'];
                    $result['exchange_rate'] = $Row2['conversion_rate_1'];
                    $result['start_date'] = $Row2['start_date_1'];
                    $result['end_date'] = $Row2['end_date'];

                    $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row2['start_date_1']);
                    $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row2['end_date']);
                    $response['response']['currencies'][] = $result;
                }  

            } else {
                $response['response']['currency'][] = array();
            }


        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    //  Currency Module
    //-----------------------------------------------------
    function get_currencies($attr=null)
    {
        //  global $objFilters;
        // return $objFilters->get_module_listing(8, "currency", $attr[column], $attr[value]);
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();
        // $where_clause = "AND currency.company_id =" . $this->arrUser['company_id'];

        if (!empty($attr['keyword']))
            $where_clause .= " AND currency.name LIKE '%".$attr['keyword']."%' ";
        
        $Sql = "SELECT   c.*,
                IFNULL((SELECT d.conversion_rate  
                            FROM currency_histroy d
                            WHERE d.currency_id=c.id  
                            ORDER BY d.start_date DESC, d.action_date DESC
                            LIMIT 1), 1) AS conversion_rate_1,
                    IFNULL((SELECT d.start_date  
                            FROM currency_histroy d
                            WHERE d.currency_id=c.id   
                            ORDER BY d.start_date DESC, d.action_date DESC
                            LIMIT 1), c.start_date) AS start_date_1

                FROM  currency c
                left JOIN company on company.id=c.company_id
                where  c.status=1 AND 
                    c.company_id=" . $this->arrUser['company_id']. $where_clause . "";
        // echo $Sql;exit;
        //, curr_comp.conversion_rate, curr_comp.start_date, curr_comp.end_date, curr_comp.status
        // JOIN currency_company as curr_comp ON c.id = curr_comp.currency_id

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        
        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        // $RS = $this->CSI($response['q']);
        $RS = $this->CSI($response['q'], "general", sr_ViewPermission);

        $response['q'] = '';

        $response['ack'] = 1;
        $response['error'] = NULL;


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['code'] = $Row['code'];
                $result['name'] = $Row['name'];
                $result['symbol'] = $Row['symbol'];
                $result['conversion_rate'] = $Row['conversion_rate_1'];
                $result['exchange_rate'] = $Row['conversion_rate_1'];
                $result['start_date'] = $Row['start_date_1'];
                $result['end_date'] = $Row['end_date'];

                $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date_1']);
                $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
                //  $result['status'] = $Row['status'] == 1 ? 'Active' : 'Inactive';
                $response['response'][] = $result;
            }            
            // $result1 = $this->get_currencies_list($attr);
            // $response['response']['arr_currency'] = $result1['response'];

        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    // Country Module
    //----------------------------------------------------
    function get_currencies_list($attr=null)
    {
        // if (!empty($attr['date']))
        // $where_clause .= "  ANd '".$this->objGeneral->convert_date($attr[date])."'  between c.start_date and c.end_date ";

        $limit_clause = $where_clause = $order_type = "";
        $response = array();
        // $company_id = (isset($attr['company_id']) && $attr['company_id'] != '') ? $attr['company_id'] : $this->arrUser['company_id'];
        //	 ('" . $this->objGeneral->convert_date($attr['date'])	. "' between d.start_date and d.end_date)

        $where_clause = (isset($attr['currency_id']) && $attr['currency_id'] != '') ? " c.id = ".$attr['currency_id']." AND " : "";

        if (!isset($attr['date'])) $attr['date'] = current_date_time;

        $Sql = "SELECT   c.id, 
                         c.name, 
                         c.code,
                        (SELECT d.conversion_rate  
                         FROM currency_histroy d
                         JOIN company on company.id=d.company_id
                         WHERE d.currency_id=c.id and   
                              (d.start_date <= '" . $this->objGeneral->convert_date($attr['date']) . "') and  
                              d.company_id=" . $this->arrUser['company_id']. "
						order by d.action_date desc
						LIMIT 1) as conversion_r
				FROM currency c 
                LEFT JOIN company on company.id=c.company_id
                WHERE ".$where_clause." c.status=1 AND 
                     c.company_id=" . $this->arrUser['company_id']." ";

        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        
        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['conversion_rate'] = $Row['conversion_r'];
                $result['code'] = $Row['code'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_currenciesListByCompanyID($attr,$companyID)
    {
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $where_clause = ($attr['currency_id'] != '') ? " c.id = ".$attr['currency_id']." AND " : "";

        $Sql = "SELECT   c.id, 
                         c.name, 
                         c.code,
                        (SELECT d.conversion_rate  
                         FROM currency_histroy d
                         JOIN company on company.id=d.company_id
                         WHERE d.currency_id=c.id and   
                              (d.start_date <= '" . $this->objGeneral->convert_date($attr['date']) . "') and  
                              d.company_id=" . $companyID. "
						order by d.action_date desc
						LIMIT 1) as conversion_r
				FROM currency c 
                LEFT JOIN company on company.id=c.company_id
                WHERE ".$where_clause." c.status=1 AND 
                     c.company_id=" . $companyID;

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['conversion_rate'] = $Row['conversion_r'];
                $result['code'] = $Row['code'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_ref_currencies_list($attr)
    {
        $response = array();

        $Sql = "SELECT * FROM ref_currency";
        // echo $Sql;exit;
        $RS = $this->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id']       = $Row['id'];
                $result['name']     = $Row['name'];
                $result['code']     = $Row['code'];
                // $result['numeric_code']   = $Row['numeric_code'];
                // $result['symbol']   = $Row['symbol'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }
    function get_currency_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *,
                IFNULL((SELECT d.conversion_rate  
                            FROM currency_histroy d
                            WHERE d.currency_id=c.id  
                            ORDER BY d.start_date DESC, d.action_date DESC
                            LIMIT 1), 1) AS conversion_rate_1,
                    IFNULL((SELECT d.start_date  
                            FROM currency_histroy d
                            WHERE d.currency_id=c.id   
                            ORDER BY d.start_date DESC, d.action_date DESC
                            LIMIT 1), c.start_date) AS start_date_1

				FROM currency AS c
				WHERE c.id='".$attr['id']."'
				LIMIT 1";
        // $RS = $this->CSI($Sql);
        // echo $Sql;exit;

        $RS = $this->CSI($Sql, "general", sr_ViewPermission);
        
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $Row['conversion_rate'] = $Row['conversion_rate_1'];
            $Row['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date_1']);
            $Row['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
            $response['response'] = $Row;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_currency_by_code($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $where_clause = "AND company_id = ".$attr['company_id']." AND code = '".$attr['code']."'";

        $Sql = "SELECT *
				FROM currency
				WHERE 1 " . $where_clause . " ";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $Row['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
            $Row['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_currency($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        // $rs_check = self::get_currency_by_code($attr);

        // and start_date = '" . $this->objGeneral->convert_date($attr[start_date]) . "'
        $data_pass = "  tst.code = '".$attr['code']."'  ";
        $company_id = (isset($attr['company_id']) && $attr['company_id'] != '') ? $attr['company_id'] : $this->arrUser['company_id'];
        $total = $this->objGeneral->count_duplicate_in_sql('currency', $data_pass, $company_id);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }
        $status = 'Active';
        $conversion_rate =  Round($attr['conversion_rate'],5);
        $Sql = "INSERT INTO currency 
                                SET 
                                    name = '".$attr['name']."',
                                    code = '".$attr['code']."',
                                    ref_currency_id = '".$attr['ref_currency_id']."',                    
                                    conversion_rate = '".$conversion_rate."',
                                    start_date = '" . $this->objGeneral->convert_date($attr['start_date']) . "',
                                    end_date = '" . $this->objGeneral->convert_date($attr['end_date']) . "',
                                    status = '".$status."',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id=".$company_id." ";
        // echo $Sql; exit;
        $RS = $this->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {

            self::get_currency_by_start_date($attr, $id);

            $response['id'] = $id;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['msg'] = 'Record Inserted Successfully';
        } else {
            $response['ack'] = 0;
            $response['msg'] = 'Record not inserted!';
        }
        return $response;
    }

    function get_currency_by_start_date($attr, $id)
    {
        $start_date = $this->objGeneral->convert_date($attr['start_date']);

        $HstrySql = "INSERT INTO currency_histroy
                                        SET 
                                            conversion_rate = '".$attr['conversion_rate']."',
                                            start_date = '" . $this->objGeneral->convert_date($attr['start_date']) . "', 
                                            end_date = '" . $this->objGeneral->convert_date($attr['end_date']) . "', 
                                            action_date = UNIX_TIMESTAMP (NOW()) ,
                                            status = '".$attr['status']."',
                                            currency_id = '".$id."',
                                            user_id='" . $this->arrUser['id'] . "',
                                            company_id = '" . $this->arrUser['company_id'] . "',
                                            emp_id='" . $this->arrUser['id'] . "'";
        // echo $HstrySql; exit;
        $this->CSI($HstrySql);
    }

    function update_currency($attr)
    {
        $srLogTrace = array();
        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['ErrorMessage'] = "";

        $this->SRTraceLogsPHP($srLogTrace);
    
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
        
        $this->objGeneral->mysql_clean($attr);

        //$rs_check = self::get_currency_by_code($attr);
        //$rs_check2 = self::get_currency_by_start_date($attr);


        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "  tst.code = '".$attr['code']."'  and 
                        start_date = '" . $this->objGeneral->convert_date($attr['start_date']) . "' ".$where_id;

        $total = $this->objGeneral->count_duplicate_in_sql('currency', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }

        $conversion_rate =  Round($attr['conversion_rate'],5);

        $Sql = "UPDATE currency 
                    SET name = '".$attr['name']."',
                        code = '".$attr['code']."', 
                        ref_currency_id = '".$attr['ref_currency_id']."',  
                        conversion_rate = '".$conversion_rate."',
                        start_date = '" . $this->objGeneral->convert_date($attr['start_date']) . "',
                        end_date = '" . $this->objGeneral->convert_date($attr['end_date']) . "'
                WHERE id = ".$attr['id']."
                Limit 1";

        // echo $Sql;exit;
        // $RS = $this->CSI($Sql);

        $RS = $this->CSI($Sql, "general", sr_ViewPermission);

        if ($this->Conn->Affected_Rows() > 0) {


            self::get_currency_by_start_date($attr, $attr['id']);

            $response['id'] = $attr['id'];
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['msg'] = 'Record Updated Successfully';
            
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = "";

            $this->SRTraceLogsPHP($srLogTrace);

        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Not Updated';
            $response['msg'] = 'Record Not Updated';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record Not Updated';

            $this->SRTraceLogsPHP($srLogTrace);
        }

        return $response;
    }

    function delete_currency($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "Update currency Set status='InActive' WHERE id = ".$attr['id']." Limit 1";

        // echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }

        return $response;
    }

    function add_conversion_rate($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "INSERT INTO currency_company
				        SET currency_id = '".$attr['currency_id']."',
                            conversion_rate = '".$attr['conversion_rate']."',
                            start_date = '" . $this->objGeneral->convert_date($attr['start_date']) . "',
                            end_date = '" . $this->objGeneral->convert_date($attr['end_date']) . "',
                            action_date = '" . $this->objGeneral->convert_date($attr['action_date']) . "',
                            status = '".$attr['status']."',
                            user_id='" . $this->arrUser['id'] . "',
                            company_id='" . $this->arrUser['company_id'] . "'";
        //echo $Sql; exit;
        $RS = $this->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
        }

        return $response;
    }

    function get_conversion_rate_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM currency_company
				WHERE currency_id='".$attr['id']."' AND status = 1
				ORDER BY id DESC
				LIMIT 1";

        //echo $Sql.'<hr/>'; exit;
        $RS = $this->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
        } else {
            $response['response'] = null;
        }
        return $response;
    }

    function conversion_rate_history($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT 
                    (SELECT AVG(currency_histroy.conversion_rate) 
                        FROM currency_histroy 
                        WHERE currency_histroy.currency_id='".$attr['id']."' GROUP BY currency_id) AS  total_avg_rate ,
                    (SELECT AVG(`conversion_rate`) 
                        FROM currency_histroy 
                        WHERE (`start_date` between UNIX_TIMESTAMP(MAKEDATE(YEAR(NOW()),1)) AND 
                            UNIX_TIMESTAMP(NOW()) AND 
                            currency_histroy.currency_id='".$attr['id']."' ) GROUP BY (`currency_id`) ) AS  annual_avg_rate,
                    curr_history.conversion_rate, 
                    curr_history.start_date, 
                    curr_history.end_date, 
                    curr_history.action_date, 
                    curr_history.status,
                    concat(emp.first_name,' ',emp.last_name) as emp_name FROM currency_histroy as curr_history 
                    LEFT JOIN employees as emp ON emp.id = curr_history.emp_id 
                    WHERE curr_history.currency_id='".$attr['id']."' 
                    order by curr_history.`start_date` DESC, curr_history.action_date DESC";

        // echo $Sql; exit;
        $RS = $this->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['conversion_rate'] = $Row['conversion_rate'];
                $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
                $result['emp_name'] = $Row['emp_name'];
                $result['action_date'] = $this->objGeneral->convert_unix_into_datetime($Row['action_date']);
                $result['status'] = $Row['status'];
                $result['total_avg_rate'] = $Row['total_avg_rate'];
                $result['annual_avg_rate'] = $Row['annual_avg_rate'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function update_conversion_rate($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $action_date = date('Y-m-d');

        if ($attr['update_id'] == '0') {

            $Sql = "INSERT INTO currency_company
				        SET conversion_rate = '".$attr['conversion_rate']."',
                            start_date = '" . $this->objGeneral->convert_date($attr['start_date']) . "', 
                            end_date = '" . $this->objGeneral->convert_date($attr['end_date']) . "', 
                            action_date = NOW(),
                            status = '".$attr['status']."',
                            currency_id = '".$attr['currency_id']."',
                            company_id = '" . $this->arrUser['company_id'] . "',
                            emp_id='" . $this->arrUser['id'] . "'";

        } else {

            $Sql = "UPDATE currency_company
				            SET conversion_rate = '".$attr['conversion_rate']."',
                                start_date = '" . $this->objGeneral->convert_date($attr['start_date']) . "', 
                                end_date = '" . $this->objGeneral->convert_date($attr['end_date']) . "', 
                                action_date = NOW(),
                                status = '".$attr['status']."',
                                currency_id = '".$attr['currency_id']."'
				            WHERE id = ".$attr['update_id']." 
                            Limit 1";
                
        }

        //echo $Sql; exit;

        $HstrySql = "INSERT INTO currency_histroy
				            SET conversion_rate = '".$attr['conversion_rate']."',
                                start_date = '" . $this->objGeneral->convert_date($attr['start_date']) . "',
                                end_date = '" . $this->objGeneral->convert_date($attr['end_date']) . "', 
                                action_date = NOW(),
                                status = '".$attr['status']."',
                                currency_id = '".$attr['currency_id']."',
                                user_id='" . $this->arrUser['id'] . "',
                                company_id = '" . $this->arrUser['company_id'] . "',
                                emp_id='" . $this->arrUser['id'] . "'";
        //echo $Sql; exit;
        $this->CSI($HstrySql);
        $RS = $this->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0 || $this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
        }

        return $response;
    }


    //----------------------- PASSWORD SETTINGS -----------------------//
    function get_password_settings($attr)
    {
        $Sql = "SELECT password_expiry_days,
                    password_reminder_days,
                    password_grace_period,
                    account_lock_attempts
                FROM company
                WHERE id=" . $this->arrUser['company_id'];
        
        // $RS = $this->CSI($Sql);

        $RS = $this->CSI($Sql, "general", sr_ViewPermission);
        
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();

                $result['password_expiry_days']     = $Row['password_expiry_days'];
                $result['password_reminder_days']   = $Row['password_reminder_days'];
                $result['password_grace_period']    = $Row['password_grace_period'];
                $result['account_lock_attempts']    = $Row['account_lock_attempts'];
                
                $response['response'] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function update_password_settings($attr)
    {
        $password_expiry_days   = ($attr['password_expiry_days'] != '') ? $attr['password_expiry_days'] : 0;
        $password_reminder_days = ($attr['password_reminder_days'] != '') ? $attr['password_reminder_days'] : 0;
        $password_grace_period  = ($attr['password_grace_period'] != '') ? $attr['password_grace_period'] : 0;
        $account_lock_attempts  = ($attr['account_lock_attempts'] != '') ? $attr['account_lock_attempts'] : 0;

        $Sql = "UPDATE company SET
                    password_expiry_days = ".$password_expiry_days.",
                    password_reminder_days = ".$password_reminder_days.",
                    password_grace_period =  ".$password_grace_period.",
                    account_lock_attempts = ".$account_lock_attempts." 
                WHERE id=" . $this->arrUser['company_id'];
        // echo $Sql;exit;
        // $RS = $this->CSI($Sql);
        $RS = $this->CSI($Sql, "general", sr_ViewPermission);
        

        if ($this->Conn->Affected_Rows()) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    
    //-----------------------------------------------//
    //					SUPPLIER SECTION             //
    //-----------------------------------------------//
    // Coverage Areas
    //------------------------------------------------

    function get_coverage_areas($attr)
    {
        // global $objFilters;
        // return $objFilters->get_module_listing(59, "coverage_areas");

        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();


        $Sql = "SELECT   c.id, c.name  FROM  coverage_areas  c
		where  c.status=1
		and c.company_id=" . $this->arrUser['company_id'] . " 
		 "; //c.user_id=".$this->arrUser['id']."

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';


        $response['ack'] = 1;
        $response['error'] = NULL;


        $RS = $this->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                // $result['company_id'] = $Row['company_id'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_coverage_area_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM coverage_areas
				WHERE id='".$attr['id']."'
				LIMIT 1";
        $RS = $this->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_coverage_area($attr)
    {
        $this->objGeneral->mysql_clean($attr);


        $data_pass = "    tst.account_name = '".$attr['account_name']."' ";
        $total = $this->objGeneral->count_duplicate_in_sql('coverage_areas', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }

        $Sql = "INSERT INTO coverage_areas
				SET name = '".$attr['name']."',status=1,user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
        $RS = $this->CSI($Sql);// price = '$attr[price]',
        $response['id'] = $this->Conn->Insert_ID();
        // $response = $this->objGeneral->run_query_exception($Sql);
        // return $response;


        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['error'] = 'Record Inserted Successfully';

        return $response;
    }

    function update_coverage_area($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "    tst.account_name = '".$attr['account_name']."' ";
        $total = $this->objGeneral->count_duplicate_in_sql('coverage_areas', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }
        $Sql = "UPDATE coverage_areas
				SET name = '".$attr['name']."',
                    status = '".$attr['status']."'
				WHERE id = ".$attr['id']." 
                Limit 1";//price = '$attr[price]',

        //	echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }

        return $response;
    }

    function delete_coverage_area($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM coverage_areas
				WHERE id = ".$attr['id'];

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }

        return $response;
    }

// Shipping Measurment Module
//------------------------------------------------

    function get_shipping_measurments($attr)
    {
        // global $objFilters;
        // return $objFilters->get_module_listing(60, "shipping_measurements");

        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();


        $Sql = "SELECT   c.id, c.name  FROM  shipping_measurements  c
		left JOIN company on company.id=c.company_id
		where  c.status=1
		and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
		  "; //c.user_id=".$this->arrUser['id']."

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        
        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';


        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['company_id'] = $Row['company_id'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_shipping_measurment_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM shipping_measurements
				WHERE id='".$attr['id']."'
				LIMIT 1";
        $RS = $this->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
        } else {
            $response['response'] = null;
        }
        return $response;
    }

    function add_shipping_measurment($attr)
    {
        $this->objGeneral->mysql_clean($attr);


        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "    tst.name = '".$attr['name']."' ";
        $total = $this->objGeneral->count_duplicate_in_sql('shipping_measurements', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }


        $Sql = "INSERT INTO shipping_measurements
				SET name = '".$attr['name']."',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";

        $RS = $this->CSI($Sql);
        $response['id'] = $this->Conn->Insert_ID();
        // $response = $this->objGeneral->run_query_exception($Sql);
        // return $response;


        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['error'] = 'Record Inserted Successfully';

        return $response;
    }

    function update_shipping_measurment($attr)
    {
        $this->objGeneral->mysql_clean($attr);


        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "    tst.name = '".$attr['name']."' ";
        $total = $this->objGeneral->count_duplicate_in_sql('shipping_measurements', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }


        $Sql = "UPDATE shipping_measurements SET name = '".$attr['name']."'
				WHERE id = ".$attr['id']." Limit 1";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }

        return $response;
    }

    function delete_shipping_measurment($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM shipping_measurements
				WHERE id = ".$attr['id'];

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }

        return $response;
    }

    // Shipping Agents Module
//------------------------------------------------

    function get_shipping_agents($attr)
    {
        // global $objFilters;
        // return $objFilters->get_module_listing(86, "shipping_agent");

        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();


        $Sql = "SELECT   c.id, c.name  FROM  shipping_measurements  c
		left JOIN company on company.id=c.company_id
		where  c.status=1
		and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
		  "; //c.user_id=".$this->arrUser['id']."

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';


        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['company_id'] = $Row['company_id'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

//-----------------------------------------------//
//				LEDGER GROUP SECTION             //
//-----------------------------------------------//
// Predefines (Constants) Module
//------------------------------------------------

    function get_predefines($attr)
    {
        // print_r($attr);exit;
        // global $objFilters;
        //  return $objFilters->get_module_listing(78, "site_constants", $attr[column], $attr[value]);
        $this->objGeneral->mysql_clean($attr);
        
        $limit_clause = $where_clause = $order_type = "";
        $response = array();


        /* $Sql = "SELECT   c.* FROM  site_constants  c
          left JOIN company on company.id=c.company_id
          where  c.status=1
          and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
          order by  c.name"; //c.user_id=".$this->arrUser['id']." */


        $tbl_name = "site_constants";

        if ($attr['value'] == "BUYING_GROUP") {
            $tbl_name = "crm_buying_group";
            $where_clause = ' and c.crm_buying_group_type=' . intval($attr['crm_buying_group_type']) . ' ';
        } 
        elseif ($attr['value'] == "SEGMENT") {
            $where_clause = ' and c.segment_type=' . intval($attr['segment_type']) . ' ';
            $tbl_name = "crm_segment";
        }
        elseif ($attr['value'] == "OFFER_METHOD") {
            $where_clause = ' and c.type=' . intval($attr['module_type']) . ' ';
            $tbl_name = "crm_offer_method";
        }
        elseif ($attr['value'] == 'ITEM_ADDITIONAL_COST')
        {
            $tbl_name = "item_additional_cost";
        }
        elseif ($attr['value'] == 'SOURCES_OF_CRM')
        {
            $where_clause = " and c.type='SOURCES_OF_CRM'";
        }

        $Sql = "SELECT c.* 
                FROM ".$tbl_name." c  
                LEFT JOIN company on company.id=c.company_id
                where  c.status=1 AND 
                      (c.company_id=" . $this->arrUser['company_id'] . " or  
                       company.parent_id=" . $this->arrUser['company_id'] . ") 
                       " . $where_clause;

        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        $RS = $this->CSI($response['q'], 'sales_crm', sr_ViewPermission);
        $response['q'] = '';
        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['title'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_predefine_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $tbl_name = "site_constants";

        if ($attr['type'] == "BUYING_GROUP")
            $tbl_name = "crm_buying_group";

        elseif ($attr['type'] == "SEGMENT")
            $tbl_name = "crm_segment";
        
        elseif ($attr['type'] == "OFFER_METHOD")
            $tbl_name = "crm_offer_method";
        
        elseif ($attr['type'] == "ITEM_ADDITIONAL_COST")
            $tbl_name = "item_additional_cost";

        $Sql = "SELECT * FROM ".$tbl_name." WHERE id='".$attr['id']."' LIMIT 1";
        
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = null;
            $response['ack'] = 1;
            $response['error'] = NULL;
        }
        return $response;
    }

    function get_predefine_by_type($attr)
    {
        $response = array();
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT c.* 
                FROM site_constants c 
                WHERE c.type= '".$attr['type']."' AND 
                      c.company_id =" . $this->arrUser['company_id'] . " ";

        $total_limit = pagination_limit;

        $order_by = ' ORDER BY c.title ';

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        
        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c',$order_by);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['type'] = $Row['type'];
                $result['name'] = $Row['title'];
                $result['title'] = $Row['title'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else   $response['response'] = array();

        return $response;
    }

    function add_predefine($attr)
    {
        // print_r($attr['title']); exit;
        $response = array();
        $this->objGeneral->mysql_clean($attr);

        $tbl_name = "site_constants";

        if ($attr['type'] == "BUYING_GROUP"){            
            $tbl_name = "crm_buying_group";
            $moduleType = $attr['crm_buying_group_type'];

            $data_pass = " tst.title = '" . trim($attr['title']) . "' and 
                           tst.crm_buying_group_type='".$moduleType. "'";
        }           
        elseif ($attr['type'] == "SEGMENT"){
            $tbl_name = "crm_segment";
            $moduleType = $attr['segment_type'];

            $data_pass = " tst.title = '" . trim($attr['title']) . "' and 
                           tst.segment_type='".$moduleType. "'";
        }                
        elseif ($attr['type'] == "OFFER_METHOD"){
            $tbl_name = "crm_offer_method";
            $moduleType = $attr['module_type'];

            $data_pass = " tst.title = '" . trim($attr['title']) . "' and 
                           tst.type='".$moduleType. "'";
        } 
        elseif ($attr['type'] == "ITEM_ADDITIONAL_COST"){
            $tbl_name = "item_additional_cost";
            $moduleType = $attr['type'];

            $data_pass = " tst.title = '" . trim($attr['title']) . "' and 
                           tst.type='".$moduleType. "'";
        } 
        elseif ($attr['type'] == "SOURCES_OF_CRM"){
            $attr['title'] = $attr['title'];
            $moduleType = $attr['type'];

            $data_pass = " tst.title = '" . trim($attr['title']) . "' and 
                           tst.type='".$moduleType. "'";
        } 
        else{
            $data_pass = " tst.title = '" . trim($attr['title']) . "' and 
                           tst.type='".$moduleType. "'";
        }           

        
        $total = $this->objGeneral->count_duplicate_in_sql($tbl_name, $data_pass, $this->arrUser['company_id']);

        if ($total >0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($attr['type'] == "SEGMENT") {
            $Sql = "INSERT INTO $tbl_name  
                                SET 
                                    title = '" . trim($attr['title']) . "',   
                                    description = '".$attr['description']."',
                                    segment_type='".$attr['segment_type']."',  
                                    company_id='" . $this->arrUser['company_id'] . "',   
                                    status = 1,    
                                    user_id='" . $this->arrUser['id'] . "', 
                                    ChangedBy='" . $this->arrUser['id'] . "', 
                                    ChangedOn='" . current_date_time . "',  
                                    AddedBy='" . $this->arrUser['id'] . "',   
                                    AddedOn='" . current_date_time . "'    ";
        
        } 
        else if ($attr['type'] == "BUYING_GROUP") {

            $Sql = "INSERT INTO $tbl_name  
                                    SET 
                                        title = '" . trim($attr['title']) . "',   
                                        description = '".$attr['description']."',
                                        crm_buying_group_type='".$attr['crm_buying_group_type']."',  
                                        company_id='" . $this->arrUser['company_id'] . "',   
                                        status = 1,    
                                        user_id='" . $this->arrUser['id'] . "',   
                                        AddedBy='" . $this->arrUser['id'] . "',   
                                        AddedOn='" . current_date_time . "'    ";
        // echo $Sql;exit;
                                        
        } 
        else if ($attr['type'] == "OFFER_METHOD") {

            $Sql = "INSERT INTO $tbl_name  
                                    SET 
                                        title = '" . trim($attr['title']) . "',   
                                        description = '".$attr['description']."',
                                        type ='".$attr['module_type']."', 
                                        company_id='" . $this->arrUser['company_id'] . "',   
                                        status = 1,   
                                        user_id='" . $this->arrUser['id']."', 
                                        ChangedBy='" . $this->arrUser['id'] . "', 
                                        ChangedOn='" . current_date_time . "',  
                                        AddedBy='" . $this->arrUser['id'] . "',   
                                        AddedOn='" . current_date_time . "'    ";
        } 
        elseif ($attr['type'] == "ITEM_ADDITIONAL_COST"){

            $Sql = "INSERT INTO $tbl_name  
                                    SET 
                                        title = '" . trim($attr['title']) . "',
                                        company_id='" . $this->arrUser['company_id'] . "',   
                                        status = 1,    
                                        user_id='" . $this->arrUser['id']."', 
                                        ChangedBy='" . $this->arrUser['id'] . "', 
                                        ChangedOn='" . current_date_time . "',  
                                        AddedBy='" . $this->arrUser['id'] . "',   
                                        AddedOn='" . current_date_time . "'    ";
        }
        else {
            
            $Sql = "INSERT INTO $tbl_name  
                                    SET 
                                        title = '" . trim($attr['title']) . "',   
                                        description = '".$attr['description']."',
                                        type='".$attr['type']."',  
                                        company_id='" . $this->arrUser['company_id'] . "',   
                                        status = 1,   
                                        user_id='" . $this->arrUser['id'] . "',   
                                        AddedBy='" . $this->arrUser['id'] . "',  
                                        AddedOn='" . current_date . "' ";
        }

        // echo $Sql;exit;

        $RS = $this->CSI($Sql);
        $response['id'] = $this->Conn->Insert_ID();

        if ($response['id'] > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record Inserted Successfully';
        } else {
            $response['ack'] = 0;
            // $response['error'] = 'Record not inserted';
            if(strpos($this->Conn->ErrorMsg(), 'Duplicate') !== false){
                // $response['error'] = "'".$attr['title']."' already inserted for this user";
                $response['error'] = "Record Already Exists.";
            }
            else
                $response['error'] = "Record not inserted";
        }
        return $response;
    }

    function update_predefine($attr)
    {
        //print_r($attr);exit;
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);exit;

        $tbl_name = "site_constants";

        $where_id = '';

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        if ($attr['type'] == "BUYING_GROUP"){            
            $tbl_name = "crm_buying_group";
            $moduleType = $attr['crm_buying_group_type'];

            $data_pass = " tst.title = '" . trim($attr['title']) . "' and 
                           tst.crm_buying_group_type=".$moduleType.$where_id;
        }           
        elseif ($attr['type'] == "SEGMENT"){
            $tbl_name = "crm_segment";
            $moduleType = $attr['segment_type'];

            $data_pass = " tst.title = '" . trim($attr['title']) . "' and 
                           tst.segment_type=".$moduleType.$where_id;
        }                
        elseif ($attr['type'] == "OFFER_METHOD"){
            $tbl_name = "crm_offer_method";
            $moduleType = $attr['module_type'];

            $data_pass = " tst.title = '" . trim($attr['title']) . "' and 
                           tst.type=".$moduleType.$where_id;
        } 
        elseif ($attr['type'] == "ITEM_ADDITIONAL_COST"){
            $tbl_name = "item_additional_cost";
            $moduleType = $attr['type'];

            $data_pass = " tst.title = '" . trim($attr['title']) . "' and 
                           tst.type=".$moduleType.$where_id;
        } 
        elseif ($attr['type'] == "SOURCES_OF_CRM"){
            $attr['title'] = $attr['title'];
            $moduleType = $attr['type'];

            $data_pass = " tst.title = '" . trim($attr['title']) . "' and 
                           tst.type='".$moduleType."' ".$where_id;
        } 
        else{
            $data_pass = " tst.title = '" . trim($attr['title']) . "' and 
                           tst.type=".$moduleType.$where_id;
        }           

        
        $total = $this->objGeneral->count_duplicate_in_sql($tbl_name, $data_pass, $this->arrUser['company_id']);

        if ($total >0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($attr['type'] == "SEGMENT") {
            
            $Sql = "UPDATE $tbl_name    
                                SET 
                                    title = '" . trim($attr['title']) . "',   
                                    description = '".$attr['description']."',
                                    ChangedBy='" . $this->arrUser['id'] . "', 
                                    ChangedOn='" . current_date_time . "', 
                                    segment_type='" . trim($attr['segment_type']) . "'
                                WHERE id = ".$attr['id']."   
                                Limit 1";
        } 
        else if ($attr['type'] == "OFFER_METHOD") {

            $Sql = "UPDATE $tbl_name    
                                SET 
                                    title = '" . trim($attr['title']) . "',   
                                    description = '".$attr['description']."',
                                    ChangedBy='" . $this->arrUser['id'] . "', 
                                    ChangedOn='" . current_date_time . "' 
                                WHERE id = ".$attr['id']."   
                                Limit 1";
        }
        elseif ($attr['type'] == "ITEM_ADDITIONAL_COST"){

            $Sql = "UPDATE $tbl_name 
                                SET 
                                    title = '" . trim($attr['title']) . "',
                                    ChangedBy='" . $this->arrUser['id'] . "', 
                                    ChangedOn='" . current_date_time . "'
                                WHERE id = ".$attr['id']."    
                                Limit 1";
        } 
        else {
            $Sql = "UPDATE $tbl_name    
                                SET 
                                    title = '" . trim($attr['title']) . "',   
                                    description = '".$attr['description']."',
                                    ChangedBy='" . $this->arrUser['id'] . "',  
                                    ChangedOn='" . current_date_time . "'
                                WHERE id = ".$attr['id']."    
                                Limit 1";
        }
        //  echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 2;
            $response['error'] = 'Record Updated Successfully';
        }
        return $response;
    }

    function delete_predefine($attr)
    {
        //print_r($attr);exit;
        $this->objGeneral->mysql_clean($attr);

        $tbl_name = "site_constants";

        if ($attr['type'] == "BUYING_GROUP"){
            $tbl_name = "crm_buying_group";
            $pi_type = 7;
            $name = 'Buying Group';
        } else if ($attr['type'] == "SELLING_GROUP"){
            $tbl_name = "crm_buying_group";
            $pi_type = 7;
            $name = 'Selling Group';
        } elseif ($attr['type'] == "SEGMENT"){
            $tbl_name = "crm_segment";
            $pi_type = 6;
            $name = 'Segment';            
        } elseif ($attr['type'] == "OFFER_METHOD"){
            $tbl_name = "crm_offer_method";
            $pi_type = 12;
            $name = 'Price Offer Method';  
        } elseif ($attr['type'] == "ITEM_ADDITIONAL_COST"){
            $tbl_name = "item_additional_cost";
            $pi_type = 13;
            $name = 'Additional Cost';
        } elseif ($attr['type'] == "SOURCES_OF_CRM"){
            $pi_type = 23;
        }


        $Sql = "SELECT SR_CheckTransactionBeforeDelete(".$attr['id'].", ".$this->arrUser['company_id'].", ".$pi_type.",0) AS error_msg";
        // echo $Sql;exit;

        $RS = $this->CSI($Sql);

        $errorMsg = $RS->fields['error_msg'];
        $tableChk = strpos($errorMsg, "CRM");
        if ($tableChk == 0){
            $tableName = 'CRM';
        }

        if ($RS->fields['error_msg'] == 'success'){
            $SqlDel = "DELETE FROM $tbl_name WHERE id = ".$attr['id'];
            // echo $SqlDel;exit;
            $RSDel = $this->CSI($SqlDel);
            if ($RSDel = $this->Conn->Affected_Rows() > 0) {
                $response['ack'] = 1;
                $response['error'] = NULL;
                $response['success'] = 'Record Deleted Successfully';
            } else {
                $response['ack'] = 2;
                $response['error'] = 'Record cannot be deleted';
            }
        } else{
            $response['ack'] = 0;
            $response['error'] = 'This '.$name.' cannot be deleted because it is being used in another record.';
        }
        return $response;
    }

    function get_predefine_types()
    {
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $Sql = "SHOW COLUMNS FROM site_constants c WHERE Field = 'type'";

        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';
        $Row = $RS->FetchRow();

        preg_match("/^enum\(\'(.*)\'\)$/", $Row[Type], $matches);
        $enum = explode("','", $matches[1]);
        $records = array();

        foreach ($enum as $value) {
            $records[] = array('value' => $value, 'label' => $value);
        }

        $response['response'] = $records;
        $response['ack'] = 1;
        $response['error'] = NULL;

        return $response;
    }

    // finance and insurance charges
    //------------------------------------------------

    function updateFinInsCharges($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        
        $finChargesChk = (isset($attr['finChargesChk']) && $attr['finChargesChk']!='')?$attr['finChargesChk']:0;
        $finChargesType = (isset($attr['finChargesType']) && $attr['finChargesType']!='')?$attr['finChargesType']:0;
        $finCharges = (isset($attr['finCharges']) && $attr['finCharges']!='')?$attr['finCharges']:0;
        $insChargesChk = (isset($attr['insChargesChk']) && $attr['insChargesChk']!='')?$attr['insChargesChk']:0;
        $insChargesType = (isset($attr['insChargesType']) && $attr['insChargesType']!='')?$attr['insChargesType']:0;
        $insCharges = (isset($attr['insCharges']) && $attr['insCharges']!='')?$attr['insCharges']:0;
        
        $Sql = "UPDATE financial_settings
				            SET 
                                finchargechk = '".$finChargesChk."',
                                finchargetype = '".$finChargesType."',
                                fincharges = '".$finCharges."',
                                inschargechk = '".$insChargesChk."',
                                inschargetype = '".$insChargesType."',
                                inscharges = '".$insCharges."'
                            WHERE company_id = '" . $this->arrUser['company_id'] . "' 
                            Limit 1";

        // echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Updated Successfully';
        }
        return $response; 
    }


    function getFinInsCharges($attr)
    {
        $Sql = "SELECT  finchargechk,
                        finchargetype,
                        fincharges,
                        inschargechk,
                        inschargetype,
                        inscharges
				FROM financial_settings
				WHERE company_id='" . $this->arrUser['company_id'] . "'
				LIMIT 1";

        $RS = $this->CSI($Sql, 'sales_crm', sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();

            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = NULL;
            $response['ack'] = 0;
            $response['error'] = 'No Record Found!';
        }
        return $response;
    }

    // VAT Setup Module
    //------------------------------------------------

    function get_vats($attr)
    {
        // global $objFilters;
        // return $objFilters->get_module_listing(80, "vat_setup");

        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $Sql = "SELECT   c.* 
                FROM  vat_setup  c
                left JOIN company on company.id=c.company_id
                where  c.status=1 and 
                       c.company_id='" . $this->arrUser['company_id'] . "'"; 

                    /* or  
                    company.parent_id=" . $this->arrUser['company_id'] . ") */
        //c.user_id=".$this->arrUser['id']."

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['customer'] = $Row['customer'];
                $result['product'] = $Row['product'];
                $result['vat'] = $Row['vat'];
                $result['status'] = $Row['status'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_vat_setup_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM vat_setup
				WHERE id='".$attr['id']."'
				LIMIT 1";
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = NULL;
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function get_vat_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *,Round(vat_value,2) as vat_value
				FROM vat
				WHERE id='".$attr['id']."'
				LIMIT 1";
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();

            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = NULL;
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_vat($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $data_pass = "   tst.vat_business_posting = '".$attr['vat_business_posting']."' ";
        $total = $this->objGeneral->count_duplicate_in_sql('vat_setup', $data_pass, $this->arrUser['company_id']);

        if ($total >0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO vat_setup
				                SET 
                                    vat_business_posting = '".$attr['vat_business_posting']."',
                                    vat_product_posting = '".$attr['vat_product_posting']."',
                                    vat = '".$attr['vat']."',
                                    status = '".$attr['status']."',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "'";
        //echo $Sql; exit;
        $RS = $this->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
        }
        return $response;
    }

    function update_vat($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "   tst.vat_business_posting = '".$attr['vat_business_posting']."' ";
        $total = $this->objGeneral->count_duplicate_in_sql('vat_setup', $data_pass, $this->arrUser['company_id']);

        if ($total >0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE vat_setup
				            SET 
                                vat_business_posting = '".$attr['vat_business_posting']."',
                                vat_product_posting = '".$attr['vat_product_posting']."',
                                vat = '".$attr['vat']."',
                                status = '".$attr['status']."'
				WHERE id = ".$attr['id']."
                Limit 1";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }
        return $response;
    }

    function delete_vat($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM vat_setup
				WHERE id = ".$attr['id'];

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }
        return $response;
    }

    function getVatRate($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT * FROM vat where company_id='" . $this->arrUser['company_id'] . "'";
        //where  company_id='" . $this->arrUser['company_id'] . "'
        // echo $Sql;exit;
        $RS = $this->CSI($Sql, 'finance', sr_ViewPermission);

        if ($RS->RecordCount() > 0) {

            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['VAT_name'] = $Row['vat_name'];
                $result['VAT_RATE'] = $Row['vat_name'];
                $result['VAT_percentage'] = Round($Row['vat_value'],2);
                // $result['status'] = $Row['status'];

                

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = NULL;
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function updateVatRate($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $where_id=''; 
        // echo $attr['status']->value;
        // print_r($attr);exit;

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "   tst.vat_name = '".$attr['vat_name']."' ".$where_id;
        $total = $this->objGeneral->count_duplicate_in_sql('vat', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $id=$attr['id'];
        $vat_value = Round($attr['vat_value'],2);
        if ($id > 0){
            $Sql = "UPDATE vat
                                SET 
                                    vat_name = '".$attr['vat_name']."',
                                    vat_value = '".$vat_value."',
                                    status = '".$attr['statusid']."'
                    WHERE id = ".$id." 
                    Limit 1";
            //  echo $Sql; exit;
            $RS = $this->CSI($Sql);

        }else{
            $Sql = "INSERT INTO vat
				                SET 
                                    vat_name = '".$attr['vat_name']."',
                                    vat_value = '".$vat_value."',
                                    status = '".$attr['statusid']."',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "'";
            // echo $Sql; exit;
            $RS = $this->CSI($Sql);
            $id = $this->Conn->Insert_ID();
        }        

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['id'] = $id;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }
        return $response;
    }

    function deleteVatRate($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM vat
				WHERE id = ".$attr['id'];

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }
        return $response;
    }

    function get_vat_setup_by_customer($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM vat_setup
				WHERE customer='".$attr['customer']."' AND product='".$attr['product']."'
				LIMIT 1";

        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = NULL;
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }
  
    // Supplier Classification Setup Module
    //------------------------------------------------

    function getAllClassification($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        /* $Sql = "SELECT ref.*,
                       CASE  WHEN ac.id = 1 THEN 'Enable'  
                             WHEN ac.id = 2 THEN 'Disable'  
                       END AS activeInactive
                FROM ref_classification as ref
                left join active_classification as ac on ac.ref_type=ref.id
                where ref.company_id='" . $this->arrUser['company_id'] . "' and 
                      ac.company_id='" . $this->arrUser['company_id'] . "' and
                      ref.type =4 and 
                      ref.status =1"; */

        $Sql ="SELECT ref.*,(SELECT ac.id 
                             FROM active_classification AS ac 
                             WHERE ac.ref_type=ref.id AND 
                                   ac.company_id='" . $this->arrUser['company_id'] . "') AS bstatus
                FROM ref_classification AS ref
                WHERE ref.company_id='" . $this->arrUser['company_id'] . "' AND 
                      ref.type IN(".$attr['type'].") AND 
                      ref.status =1";

        // echo $Sql;exit;
        
        $RS = $this->CSI($Sql,'purchases',sr_ViewPermission);

        if ($RS->RecordCount() > 0) {

            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['type'] = $Row['type'];

                /* if($Row['bstatus']>0)
                    $result['status'] = "Enable"; 
                else
                    $result['status'] = "Disable";  */

                /* if($Row['type']==3)
                    $result['type'] = "SRM"; 
                elseif($Row['type']==4)
                    $result['type'] = "Supplier"; */

                /* if($Row['status']==1)
                    $result['status'] = "Active"; 
                else
                    $result['status'] = "Inactive";  */
                                
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }


    function getClassificationByID($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT ref.*,(SELECT id 
                              FROM active_classification AS ac 
                              WHERE ac.ref_type=ref.id AND 
                                    ac.company_id='" . $this->arrUser['company_id'] . "') AS bstatus
				FROM ref_classification AS ref
				WHERE ref.id='".$attr['id']."' and ref.status =1
				LIMIT 1";

        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();

            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {
            $response['response'] = NULL;
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }


    function updateClassification($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $where_id=''; 
        // echo $attr['status']->value;
        // print_r($attr);exit;

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = " tst.name = '".$attr['name']."' && tst.type='".$attr['type']."' ".$where_id ;
        $total = $this->objGeneral->count_duplicate_in_sql('ref_classification', $data_pass, $this->arrUser['company_id']);

        if ($total >0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $id = $attr['id'];
        $showStatusid = $attr['showStatusid'];

        if ($id > 0){
            $Sql = "UPDATE ref_classification
                                SET 
                                    name = '".$attr['name']."',
                                    type = '".$attr['type']."'
                    WHERE id = ".$id."
                    Limit 1";
            //  echo $Sql; exit;
            $RS = $this->CSI($Sql);

        }else{
            $Sql = "INSERT INTO ref_classification
				                SET 
                                    name = '".$attr['name']."',
                                    type = '".$attr['type']."',
                                    status = '1',
                                    date_created = '".current_date."',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "'";
            // echo $Sql; exit;
            $RS = $this->CSI($Sql);
            $id = $this->Conn->Insert_ID();
        }   

        if($showStatusid>0){

            $sqld = "SELECT id 
                        FROM active_classification 
                        WHERE  type='".$attr['type']."' AND
                            ref_type=".$id." AND  
                            company_id='" . $this->arrUser['company_id'] . "'";

            $RSd = $this->CSI($sqld);

            if (!($RSd->RecordCount() > 0)) {
                $Sqle = "INSERT INTO active_classification 
                                            SET 
                                                type = '".$attr['type']."',
                                                ref_type = ".$id.", 
                                                company_id = '" . $this->arrUser['company_id'] . "',
                                                user_id = '" . $this->arrUser['id'] . "',
                                                created_date = '".current_date."'";
                //  echo $Sqle; exit;
                $RSE = $this->CSI($Sqle);
            }                         
        }
        else{                
            $sqld = "DELETE FROM active_classification 
                        WHERE  type = '".$attr['type']."' AND  
                            ref_type=".$id." AND
                            company_id = '" . $this->arrUser['company_id'] . "'";
            $this->CSI($sqld);
        }   

        if ($this->Conn->Affected_Rows() > 0) {

            

            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['id'] = $id;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }
        return $response;
    }

    function deleteClassification($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM ref_classification
				WHERE id = ".$attr['id'];

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }
        return $response;
    }

    // Posting Group Setup Module
    //------------------------------------------------

    function getAllPostingGroup($attr,$dontCheck=null)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT * FROM ref_posting_group where  company_id='" . $this->arrUser['company_id'] . "'";
        // echo $Sql;exit;
        if($dontCheck == 1) {
            $RS = $this->CSI($Sql);
        }
        else {
            $RS = $this->CSI($Sql,'finance',sr_ViewPermission);
        }

        if ($RS->RecordCount() > 0) {

            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['posting_group'] = $Row['name'];

                /* if($Row['status']==1)
                    $result['status'] = "Active"; 
                else
                    $result['status'] = "Inactive";  */

                // $result['status'] = $Row['status'];            
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = NULL;
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function getPostingGroupByID($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM ref_posting_group
				WHERE id='".$attr['id']."'
				LIMIT 1";
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();

            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = NULL;
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function updatePostingGroup($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $where_id=''; 
        // echo $attr['status']->value;
        // print_r($attr);exit;

        if ($attr['id'] > 0)
            $where_id = " AND tst.id != '".$attr['id']."' ";

        $data_pass = "   tst.name = '".$attr['name']."'". $where_id;
        $total = $this->objGeneral->count_duplicate_in_sql('ref_posting_group', $data_pass, $this->arrUser['company_id']);

        if ($total >0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $id=$attr['id'];

        if ($id > 0){
            $Sql = "UPDATE ref_posting_group
                                SET 
                                    name = '".$attr['name']."',
                                    status = '".$attr['statusid']."'
                    WHERE id = ".$id." 
                    Limit 1";
            //  echo $Sql; exit;
            $RS = $this->CSI($Sql);

        }else{
            $Sql = "INSERT INTO ref_posting_group
				                SET 
                                    name = '".$attr['name']."',
                                    status = '".$attr['statusid']."',
                                    date_created = '".current_date."',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "'";
            // echo $Sql; exit;
            $RS = $this->CSI($Sql);
            $id = $this->Conn->Insert_ID();
        }        

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['id'] = $id;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }
        return $response;
    }

    function deletePostingGroup($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM ref_posting_group
				WHERE id = ".$attr['id']." AND 
                SR_CheckTransactionBeforeDelete(".$attr['id'].", ".$this->arrUser['company_id'].", 24,0) = 'success'";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] =  'This Posting Group cannot be deleted because it is being used in another record.';
        }
        return $response; // 'Record cannot be deleted';
    }

    // VAT Posting Group Setup Module
    //------------------------------------------------

    function getVATpostingGrpSetupPredata($attr)
    {
        $Sql = "SELECT * FROM ref_posting_group where status=1 and company_id='" . $this->arrUser['company_id'] . "'";
        // echo $Sql;exit;
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {

            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['posting_group'] = $Row['name'];        
                $response['postingGroup'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;          

            $response['vatRate']=$this->getVatRate();
        } else {
            $response['response'] = NULL;
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
       
        return $response;
    }

    function getAllVATpostingGrpSetup($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT c.id,c.vat, vat.vat_name as vat_rate,postgrp.name as post_grp
                FROM vat_posting_grp_setup as c 
                left join ref_posting_group as postgrp on postgrp.id=c.postingGrpID
                left join vat on vat.id=c.vatRateID
                where postgrp.company_id='" . $this->arrUser['company_id'] . "' AND 
                      c.company_id='" . $this->arrUser['company_id'] . "'";
        // echo $Sql;exit;
        $RS = $this->CSI($Sql, 'finance', sr_ViewPermission);
        $response=array();

        if ($RS->RecordCount() > 0) {

            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['posting_group'] = $Row['post_grp'];          
                $result['vat_rate'] = $Row['vat_rate'];          
                $result['vat'] = $Row['vat'];         
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = NULL;
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function getVATpostingGrpSetupByID($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM vat_posting_grp_setup
				WHERE id='".$attr['id']."' and 
                      company_id='" . $this->arrUser['company_id'] . "'
				LIMIT 1";
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();

            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['postingGrp']=$this->getpostingGrp();
            $response['vatRate']=$this->getVatRate();
        } else {
            $response['response'] = NULL;
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function getpostingGrp($attr=null)
    {
        $Sql = "SELECT * FROM ref_posting_group where status=1 and 
                      company_id='" . $this->arrUser['company_id'] . "'";
        // echo $Sql;exit;
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {

            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['posting_group'] = $Row['name'];        
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = NULL;
            $response['ack'] = 0;
            $response['error'] = NULL;
        }       
        return $response;
    }

    function updateVATpostingGrpSetup($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $where_id=''; 

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "  tst.vatRateID = '".$attr['vat_rateid']."' AND 
                        tst.postingGrpID = '".$attr['posting_grpid']."' ".$where_id;

        $total = $this->objGeneral->count_duplicate_in_sql('vat_posting_grp_setup', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $id=$attr['id'];

        if ($id > 0){
            $Sql = "UPDATE vat_posting_grp_setup
                                SET 
                                    vatRateID = '".$attr['vat_rateid']."',
                                    postingGrpID = '".$attr['posting_grpid']."',
                                    vat = '".$attr['vat']."',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    ChangedBy='".$this->arrUser['id']."',
                                    ChangedOn='".current_date_time."'
                    WHERE id = $id 
                    Limit 1";
            //  echo $Sql; exit;
            $RS = $this->CSI($Sql);

        }else{
            $Sql = "INSERT INTO vat_posting_grp_setup
				                SET 
                                    vatRateID = '".$attr['vat_rateid']."',
                                    postingGrpID = '".$attr['posting_grpid']."',
                                    vat = '".$attr['vat']."',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    AddedBy='".$this->arrUser['id']."',
                                    AddedOn='".current_date_time."',
                                    ChangedBy='".$this->arrUser['id']."',
                                    ChangedOn='".current_date_time."'";
            // echo $Sql; exit;
            $RS = $this->CSI($Sql);
            $id = $this->Conn->Insert_ID();
        }        

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['id'] = $id;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }
        return $response;
    }

    function deleteVATpostingGrpSetup($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM vat_posting_grp_setup
				WHERE id = ".$attr['id'];

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }
        return $response;
    }

    // Inventory Setup Module
    //------------------------------------------------

    function getInventorySetupPredata($attr)
    {
        $Sql = "SELECT * FROM ref_posting_group 
                where status=1 AND company_id='" . $this->arrUser['company_id'] . "'";
        // echo $Sql;exit;
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {

            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['posting_group'] = $Row['name'];        
                $response['postingGroup'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL; 
        } else {
            $response['response'] = NULL;
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
       
        return $response;
    }

    function getAllInventorySetup($attr, $isAllowed=null)
    {
        $this->objGeneral->mysql_clean($attr);
        $response=array();
        
        $Sql2 = "SELECT fs.vat_sales_type,
                        fs.vat_lieability_receve_gl_account,
                        (SELECT CONCAT(accountCode,' - ',displayName)
                         FROM gl_account
                         WHERE id=fs.vat_lieability_receve_gl_account
                         LIMIT 1) AS vat_lieability_receve_gl_account_code
                 FROM financial_settings AS fs
                 WHERE fs.company_id=" . $this->arrUser['company_id'];
        
        // echo $Sql2;exit;        
        $RS2 = $this->CSI($Sql2);        

        if ($RS2->RecordCount() > 0) {

            $Row2 = $RS2->FetchRow();
            $response['ack'] = 1;
            $response['vat_sales_type'] = $Row2['vat_sales_type'];
            $response['vat_lieability_receve_gl_account'] = $Row2['vat_lieability_receve_gl_account'];
            $response['vat_lieability_receve_gl_account_code'] = $Row2['vat_lieability_receve_gl_account_code'];
        }

        

        // print_r($attr);// exit;//['inventorySetupSystemType']
        $Sql = "SELECT c.id as recid,c.*,postgrp.name as post_grp
                FROM inventory_setup as c 
                left join ref_posting_group as postgrp on postgrp.id=c.postingGroup
                where c.company_id='" . $this->arrUser['company_id'] . "'";
        // echo $Sql;exit;
       

        if ($isAllowed){
            $RS = $this->CSI($Sql);
        }
        else{
             $RS = $this->CSI($Sql, 'finance', sr_ViewPermission);
        }
        

        if ($RS->RecordCount() > 0) {

            while ($Row = $RS->FetchRow()) {

                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $result = array();
                $result2 = array();

                if($Row['type']==1){                    
                    $result['recid'] = $Row['recid'];
                    // $result= $Row;          
                    $result['posting_group'] = $Row['post_grp'];
                    $result['Debtors'] = $this->get_glaccount_byid($Row['salesAccountDebators']);
                    $result['Sales'] = $this->get_glaccount_byid($Row['salesAccountSales']);
                    $result['Sales_Discount'] = $this->get_glaccount_byid($Row['salesAccountSalesDiscount']);
                    $result['Sales VAT'] = $this->get_glaccount_byid($Row['salesAccountSalesVAT']);

                    if($response['vat_sales_type'] != 2){
                        $result['Cost_Of_Goods_Sold'] = $this->get_glaccount_byid($Row['salesAccountCostOfGoodsSold']);
                        $result['Stock'] = $this->get_glaccount_byid($Row['salesAccountStock']);// (Balance Sheet)
                    }                    
                    
                    $response['salesResponse'][] = $result;
                }  
                elseif($Row['type']==2){
                    $result2['recid'] = $Row['recid'];
                    // $result= $Row;          
                    $result2['posting_group'] = $Row['post_grp'];
                    $result2['Creditors'] = $this->get_glaccount_byid($Row['purchaseAccountCreditors']);
                    $result2['Stock'] = $this->get_glaccount_byid($Row['purchaseAccountStock']);// (Balance Sheet)
                    $result2['Purchase_Discount'] = $this->get_glaccount_byid($Row['purchaseAccountPurchasesDisc']);
                    $result2['Purchase_VAT'] = $this->get_glaccount_byid($Row['purchaseAccountPurchasesVAT']);
                    $response['purchaseResponse'][] = $result2;
                }                       
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['salesResponse'] = NULL;
            $response['purchaseResponse'] = NULL;
            $response['ack'] = 0;
            $response['error'] = NULL;
        }


        $Sql3 = "SELECT id,name as posting_group 
                 FROM ref_posting_group 
                 WHERE status=1 AND 
                       company_id='" . $this->arrUser['company_id'] . "'";

        // echo $Sql3;exit;
        $RS3 = $this->CSI($Sql3);

        if ($RS3->RecordCount() > 0) {

            while ($Row3 = $RS3->FetchRow()) {  

                foreach ($Row3 as $key => $value) {
                    if (is_numeric($key))
                        unset($Row3[$key]);
                }

                $response['postingGroup'][] = $Row3;
            }
            $response['ack'] = 1;
            $response['error'] = NULL; 
        }

        return $response;
    }

    function getInventorySetupByID($attr)
    {
        // error_reporting(E_ALL) ;
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM inventory_setup
				WHERE id='".$attr['id']."'
				LIMIT 1";
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();

            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            // $result['posting_group'] = $Row['post_grp'];

            if($Row['type']==1){
                $Row['salesAccountDebatorsCode'] = $this->get_glaccount_byid($Row['salesAccountDebators']);
                $Row['salesAccountSalesCode'] = $this->get_glaccount_byid($Row['salesAccountSales']);
                $Row['salesAccountSalesDiscountCode'] = $this->get_glaccount_byid($Row['salesAccountSalesDiscount']);
                $Row['salesAccountSalesVATCode'] = $this->get_glaccount_byid($Row['salesAccountSalesVAT']);

                if($Row['salesAccountCostOfGoodsSold']>0)
                    $Row['salesAccountCostOfGoodsSoldCode'] = $this->get_glaccount_byid($Row['salesAccountCostOfGoodsSold']);
                else
                    $Row['salesAccountCostOfGoodsSoldCode'] = '';

                if($Row['salesAccountStock']>0)
                    $Row['salesAccountStockCode'] = $this->get_glaccount_byid($Row['salesAccountStock']);
                else
                    $Row['salesAccountStockCode'] = '';
            }  
            elseif($Row['type']==2){
                $Row['purchaseAccountCreditorsCode'] = $this->get_glaccount_byid($Row['purchaseAccountCreditors']);
                $Row['purchaseAccountStockCode'] = $this->get_glaccount_byid($Row['purchaseAccountStock']);
                $Row['purchaseAccountPurchasesDiscCode'] = $this->get_glaccount_byid($Row['purchaseAccountPurchasesDisc']);
                $Row['purchaseAccountPurchasesVATCode'] = $this->get_glaccount_byid($Row['purchaseAccountPurchasesVAT']);
            }  

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['postingGrp']=$this->getpostingGrp();
            
        } else {
            $response['response'] = NULL;
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function updateInventorySetup($attr)
    {
        $srLogTrace = array();
        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['ErrorMessage'] = "";

        $this->SRTraceLogsPHP($srLogTrace);
    
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
        
        $this->objGeneral->mysql_clean($attr);
        $where_id=''; 

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";


        $salesAccountDebators = (isset($attr['salesAccountDebators']) && $attr['salesAccountDebators']!='')?$attr['salesAccountDebators']:'NULL';
        $salesAccountSales = (isset($attr['salesAccountSales']) && $attr['salesAccountSales']!='')?$attr['salesAccountSales']:'NULL';
        $salesAccountSalesDiscount = (isset($attr['salesAccountSalesDiscount']) && $attr['salesAccountSalesDiscount']!='')?$attr['salesAccountSalesDiscount']:'NULL';
        $salesAccountSalesVAT = (isset($attr['salesAccountSalesVAT']) && $attr['salesAccountSalesVAT']!='')?$attr['salesAccountSalesVAT']:'NULL';
        $salesAccountCostOfGoodsSold = (isset($attr['salesAccountCostOfGoodsSold']) && $attr['salesAccountCostOfGoodsSold']!='')?$attr['salesAccountCostOfGoodsSold']:'NULL';
        $salesAccountStock = (isset($attr['salesAccountStock']) && $attr['salesAccountStock']!='')?$attr['salesAccountStock']:'NULL';
        
        $purchaseAccountCreditors = (isset($attr['purchaseAccountCreditors']) && $attr['purchaseAccountCreditors']!='')?$attr['purchaseAccountCreditors']:'NULL';
        $purchaseAccountStock = (isset($attr['purchaseAccountStock']) && $attr['purchaseAccountStock']!='')?$attr['purchaseAccountStock']:'NULL';
        $purchaseAccountPurchasesDisc = (isset($attr['purchaseAccountPurchasesDisc']) && $attr['purchaseAccountPurchasesDisc']!='')?$attr['purchaseAccountPurchasesDisc']:'NULL';
        $purchaseAccountPurchasesVAT = (isset($attr['purchaseAccountPurchasesVAT']) && $attr['purchaseAccountPurchasesVAT']!='')?$attr['purchaseAccountPurchasesVAT']:'NULL';
        
        $data_pass = "  tst.type = '".$attr['typeid']."' AND 
                        tst.postingGroup = '".$attr['posting_grpid']."'".$where_id;

        $total = $this->objGeneral->count_duplicate_in_sql('inventory_setup', $data_pass, $this->arrUser['company_id']);

        // exit;
        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $id=$attr['id'];

        if ($id > 0){
            $Sql = "UPDATE inventory_setup
                                SET 
                                    type = '".$attr['typeid']."',
                                    postingGroup = '".$attr['posting_grpid']."',
                                    salesAccountDebators = ".$salesAccountDebators.",
                                    salesAccountSales = ".$salesAccountSales.",
                                    salesAccountSalesDiscount = ".$salesAccountSalesDiscount.",
                                    salesAccountSalesVAT = ".$salesAccountSalesVAT.",
                                    salesAccountCostOfGoodsSold = ".$salesAccountCostOfGoodsSold.",
                                    salesAccountStock = ".$salesAccountStock.",
                                    purchaseAccountCreditors = ".$purchaseAccountCreditors.",
                                    purchaseAccountStock = ".$purchaseAccountStock.",
                                    purchaseAccountPurchasesDisc = ".$purchaseAccountPurchasesDisc.",
                                    purchaseAccountPurchasesVAT = ".$purchaseAccountPurchasesVAT.",
                                    status=1,
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    ChangedBy='".$this->arrUser['id']."',
                                    ChangedOn='".current_date_time."'
                    WHERE id = $id 
                    Limit 1";
            //  echo $Sql; exit;
            $RS = $this->CSI($Sql);

        }else{
            $Sql = "INSERT INTO inventory_setup
				                SET 
                                    type = '".$attr['typeid']."',
                                    postingGroup = '".$attr['posting_grpid']."',
                                    salesAccountDebators = ".$salesAccountDebators.",
                                    salesAccountSales = ".$salesAccountSales.",
                                    salesAccountSalesDiscount = ".$salesAccountSalesDiscount.",
                                    salesAccountSalesVAT = ".$salesAccountSalesVAT.",
                                    salesAccountCostOfGoodsSold = ".$salesAccountCostOfGoodsSold.",
                                    salesAccountStock = ".$salesAccountStock.",
                                    purchaseAccountCreditors = ".$purchaseAccountCreditors.",
                                    purchaseAccountStock = ".$purchaseAccountStock.",
                                    purchaseAccountPurchasesDisc = ".$purchaseAccountPurchasesDisc.",
                                    purchaseAccountPurchasesVAT = ".$purchaseAccountPurchasesVAT.",
                                    status=1,
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    AddedBy='".$this->arrUser['id']."',
                                    AddedOn='".current_date_time."',
                                    ChangedBy='".$this->arrUser['id']."',
                                    ChangedOn='".current_date_time."'";
            //  echo $Sql; exit;
            $RS = $this->CSI($Sql);
            $id = $this->Conn->Insert_ID();
        }        

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['id'] = $id;
             $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
            
            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = "";

            $this->SRTraceLogsPHP($srLogTrace);
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record cannot be updated';

            $this->SRTraceLogsPHP($srLogTrace);
        }
        return $response;
    }

    function deleteInventorySetup($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM inventory_setup
				WHERE id = ".$attr['id'];

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }
        return $response;
    }
    
    function get_universal_rebate($attr)
    {
        $order_date = $this->objGeneral->convert_date($attr['order_date']);
        
        $response = array();
        $Sql = "SELECT * 
                FROM rebate AS reb
                WHERE 
                    reb.status = 1 AND
                    reb.moduleType = 1 AND 
                    reb.moduleID = ".$attr['crm_id']." AND                   
                    ".$order_date."
                    BETWEEN reb.start_date AND CASE WHEN reb.end_date = 0 THEN 4099299120  ELSE reb.end_date END";
        // echo $Sql;exit;
        //  reb.universal_type = 1 AND
        $RS = $this->CSI($Sql);
         
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $attr['rebate_id'] = $Row['id'];
                 if (($Row['universal_type'] == 2) || ($Row['universal_type'] == 3)){
                    $Row['revenueVolume'] = $this->get_rebateRevenueVolume($attr);
                 }

                if($Row['universal_type'] == 2 || $Row['universal_type'] == 3 || $Row['rebate_type'] == 3){
                $Row['items'] = $this->get_rebate_items($attr);
                }

                if($Row['rebate_type'] == 2){
                $Row['cat_items'] = $this->get_rebate_category_items($attr);
                }

                $response['response'][] = $Row;          

            }
            $response['ack'] = 1;
        } else {
            $response['ack'] =0;
            $response['response'] = array();
        }
        return $response; 
    }

    function get_rebateRevenueVolume($attr)
    {
        $Sql = "SELECT * FROM rebate_volume_revenue WHERE rebate_id = " . $attr['rebate_id']." order by revenue_volume_from DESC";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['revenue_volume_from'] = $Row['revenue_volume_from'];
                $result['revenue_volume_to'] = $Row['revenue_volume_to'];
                $result['type'] = $Row['type'];
                $result['rebate_type'] = $Row['rebate_type'];
                $result['rebate'] = $Row['rebate'];
                $result['qtyID'] = $Row['id'];
                $result['mode'] = 1;
                $result['editchk'] = 0;
                $response[] = $result;
            }
        } else {
            $response[] = array();
        }
        return $response;
    }

    function get_rebate_items($attr)
    {
        $Sql = "SELECT SP.* 
                FROM rebate_items AS reb 
                LEFT JOIN sr_product_purchaselist AS SP ON SP.id = reb.item_id
                WHERE reb.rebate_id = ".$attr['rebate_id']."
                GROUP BY SP.id";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }  
                $result = array();
                // $result['item_id'] = $Row['item_id'];
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function get_rebate_category_items($attr)
    {
        $Sql = "SELECT SP.*
        FROM rebate_categories reb_cat
        LEFT JOIN product p ON p.category_id= reb_cat.category_id
         LEFT JOIN sr_product_purchaselist AS SP ON SP.id = p.id
        WHERE reb_cat.rebate_id = ".$attr['rebate_id']."
        AND reb_cat.company_id='" . $this->arrUser['company_id'] . "'
                GROUP BY SP.id";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }  
                $result = array();
                // $result['item_id'] = $Row['item_id'];
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function getAllItemAdditionalCost($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $where = "";
        $extraClause = "";

        if(isset($attr['defaults']) && $attr['defaults'] != '')
            $where .= " AND ref_id > 0";

        if(isset($attr['check_status']) && $attr['check_status'] != '')
            $where .= " AND c.status=1 ";

        // if ($attr['type'] == 2)
        $extraClause = " AND c.status <> -1";
    
        $Sql = "SELECT  c.id,c.title as name , c.status,
                        CASE WHEN c.status = 0 THEN 'Inactive'
                             WHEN c.status = 1 THEN 'Active'
                             else ''
                        End  as astatus 
                FROM  item_additional_cost  c
                where c.type=".$attr['type']." ".$where.$extraClause." and 
                    c.company_id=" . $this->arrUser['company_id']; 
        
        // echo $Sql;exit;
        //$RS = $this->CSI($Sql);
        if ($attr['notAllowed']){
            if($attr['type']==1){
                $RS = $this->CSI($Sql, 'purchases', sr_ViewPermission);
            }else{
                $RS = $this->CSI($Sql, 'inventory_setup', sr_ViewPermission);
            }
        }
        else{
            $RS = $this->CSI($Sql);
        }

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $Row['value'] = 0;
                $response['response'][] = $Row;              
            }
            if(isset($attr['get_rebate']) && $attr['get_rebate'] == 1)
                $response['universal_rebate'] = self::get_universal_rebate($attr);
                                   
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }

        return $response;
    }

    function getItemAdditionalCostByID($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *, (SELECT count(*) from product_marginal_analysis where marginal_analysis_id = '".$attr['id']."') as is_used
				FROM item_additional_cost
				WHERE id='".$attr['id']."'
				LIMIT 1";
        $RS = $this->CSI($Sql,'inventory_setup',sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();

            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            } 

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
            
        } else {
            $response['response'] = NULL;
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }
    
    function updateItemAdditionalCost($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $where_id=''; 

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "  tst.title = '".$attr['title']."' AND tst.type='".$attr['type']."' ".$where_id ;
        $total = $this->objGeneral->count_duplicate_in_sql('item_additional_cost', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $id=$attr['id'];

        if ($id > 0){
            $Sql = "UPDATE item_additional_cost
                                SET 
                                    title = '".$attr['title']."',
                                    status = '".$attr['statusid']."',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    ChangedBy='".$this->arrUser['id']."',
                                    ChangedOn='".current_date_time."'
                    WHERE id = $id 
                    Limit 1";
            //  echo $Sql; exit;
            $RS = $this->CSI($Sql,'inventory_setup',sr_ViewPermission);

        }else{
            $Sql = "INSERT INTO item_additional_cost
				                SET 
                                    title = '".$attr['title']."',
                                    status = '".$attr['statusid']."',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    type='".$attr['type']."',
                                    AddedBy='".$this->arrUser['id']."',
                                    AddedOn='".current_date_time."',
                                    ChangedBy='".$this->arrUser['id']."',
                                    ChangedOn='".current_date_time."'";
            //  echo $Sql; exit;
            $RS = $this->CSI($Sql,'inventory_setup',sr_ViewPermission);
            $id = $this->Conn->Insert_ID();
        }        
        
        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['id'] = $id;
        } else {
            $response['ack'] = 2;
            $response['error'] = 'Record Updated Successfully';
        }
        return $response;
    }


    function deleteItemAdditionalCost($attr)
    {
        // print_r($attr);exit;
        $this->objGeneral->mysql_clean($attr);

        if ($attr['type'] == 'MarginAnal'){
            $moduleName = 'Margin Analysis';
            $pi_type = 14;
        } else if ($attr['type'] == 'AddCost'){
            $moduleName = 'Additional Cost';   
            $pi_type = 13;      
        }

        /* SET status=".DELETED_STATUS."  */
        $Sql = "DELETE FROM item_additional_cost 
                WHERE id = ".$attr['id']." AND 
                      SR_CheckTransactionBeforeDelete(".$attr['id'].", ".$this->arrUser['company_id'].", ".$pi_type.",0) = 'success'";

        // echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'This '.$moduleName.' cannot be deleted because it is being used in another record.';
            $response['SQL'] = $Sql;
        }
        return $response;
    }

    function get_posting_setup_listing($attr)
    {
        //global $objFilters;
        //  return $objFilters->get_module_listing(79, "general_ledger_setup", $attr[column], $attr[value], $attr[more_fields], $attr[filter_id]);

        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $Sql = "SELECT  gl_setup.id, 
                        gl_setup.type, 
                        gl_setup.account, 
                        gl_setup.account_2, 
                        gl_setup.cogs_account, 
                        gl_setup.inventory_account, 
                        gl_setup.status, 
                        cust_const.name as customer, 
                        prod_const.title as product
                FROM general_ledger_setup as gl_setup
                LEFT JOIN site_constants as cust_const ON cust_const.id = gl_setup.customer
                LEFT JOIN site_constants as prod_const ON prod_const.id = gl_setup.product
                WHERE 1 " . $where_clause . " ";

        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'gl_setup', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['customer'] = $Row['customer'];
                $result['product'] = $Row['product'];
                $result['type'] = $Row['type'];
                $result['account'] = $Row['account'];
                $result['account_2'] = $Row['account_2'];
                $result['cogs_account'] = $Row['inventory_account'];
                $result['status'] = $Row['status'];

                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        // return $response;
        return array('filters_dropdown' => $filters_dropdown,
                     'columns' => $head, 'filter_dict' => $filter_dict,
                     'filters' => $record['column_id'], 
                     'record' => array('total' => $record['num_rows'], 
                     'result' => $response['response'], 
                     'response' => $record['response']));
    }

    function get_posting_setup_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM general_ledger_setup
				WHERE id='".$attr['id']."'
				LIMIT 1";
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = null;
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function get_ledger_setup_by_type($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM general_ledger_setup
				WHERE 1 AND type='".$attr['type']."' AND 
                      customer ='$attr[customer]' AND 
                      product ='$attr[product]'
				LIMIT 1";
        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'][] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_posting_setup($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "INSERT INTO general_ledger_setup
				                    SET 
                                        customer = '$attr[customer]',
                                        product = '$attr[product]',
                                        type = '".$attr['type']."',
                                        account = '$attr[account]',
                                        account_2 = '$attr[account_2]',
                                        cogs_account = '$attr[cogs_account]',
                                        inventory_account = '$attr[inventory_account]',
                                        status = '$attr[status]',
                                        user_id='" . $this->arrUser['id'] . "',
                                        company_id='" . $this->arrUser['company_id'] . "'";
        //echo $Sql; exit;
        $RS = $this->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
        }
        return $response;
    }

    function update_posting_setup($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "UPDATE general_ledger_setup
				                SET 
                                    customer = '$attr[customer]',
                                    product = '$attr[product]',
                                    type = '".$attr['type']."',
                                    account = '$attr[account]',
                                    account_2 = '$attr[account_2]',
                                    cogs_account = '$attr[cogs_account]',
                                    inventory_account = '$attr[inventory_account]',
                                    status = '$attr[status]'
				WHERE id = ".$attr['id']." 
                Limit 1";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }
        return $response;
    }

    function change_status_posting_setup($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "UPDATE general_ledger_setup
				SET status = '$attr[status]'
				WHERE id = ".$attr['id']." Limit 1";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }
        return $response;
    }

    function delete_posting_setup($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM general_ledger_setup
				WHERE id = ".$attr['id'];

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }
        return $response;
    }

    function get_ledger_posting($attr)
    {
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $this->objGeneral->mysql_clean($attr);
        $Sql = 'SELECT * 
                FROM general_ledger_posting 
                WHERE account_head = ' . $attr['account'] . ' AND 
                      g_posting_type = ' . $attr['order_type'] . '';

        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function get_general_ledger_entry($attr)
    {
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $this->objGeneral->mysql_clean($attr);
        $Sql = 'SELECT * FROM general_ledger_entry WHERE business_posting_title = ' . $attr['business_posting_title'] . ' AND product_posting_title = ' . $attr['product_posting_title'] . '';

        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'general_ledger_entry', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function get_account_head($attr)
    {
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $this->objGeneral->mysql_clean($attr);
        $Sql = 'SELECT c.* FROM account_heads  c WHERE `number` = ' . $attr['number'] . ' AND account_type = ' . $attr['account_type'] . '';

        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    //------------------------------------------------//
    //				SALES & CRM SECTION 			  //
    //------------------------------------------------//
    // Shipping Measurment Module
    //------------------------------------------------

    function get_shipment_methods($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $Sql = "SELECT   c.* 
                FROM  shipment_methods  c
                where   c.status=1 and 
                        shipment_type=".$attr['shipment_type']." and 
                        c.company_id=" . $this->arrUser['company_id'] . " "; //c.user_id=".$this->arrUser['id']."

        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q'], 'sales_crm', sr_ViewPermission);
        $response['q'] = '';
        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
               // $result['code'] = $Row['code'];
                $result['name'] = $Row['name'];
               // $result['company_id'] = $Row['company_id'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_shipment_method_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM shipment_methods
				WHERE id='".$attr['id']."'
				LIMIT 1";

        $RS = $this->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = 'No record found!';
        }
        return $response;
    }

    function add_shipment_method($attr)
    {
        $this->objGeneral->mysql_clean($attr);
       // print_r($attr);

        $data_pass = " tst.name = '".$attr['name']."' AND  shipment_type='".$attr['shipment_type']."'";
        $total = $this->objGeneral->count_duplicate_in_sql('shipment_methods', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO shipment_methods
				                    SET 
                                        name = '".$attr['name']."',
                                        shipment_type='".$attr['shipment_type']."', 
                                        user_id='" . $this->arrUser['id'] . "',
                                        company_id='" . $this->arrUser['company_id'] . "'";
        // echo $Sql;exit;                                
        $RS = $this->CSI($Sql);
        $response['id'] = $this->Conn->Insert_ID();
        // $response = $this->objGeneral->run_query_exception($Sql);
        // return $response;

        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['error'] = 'Record Inserted Successfully';
        return $response;
    }

    function update_shipment_method($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = " tst.name = '".$attr['name']."' AND shipment_type='".$attr['shipment_type']."'".$where_id;
        $total = $this->objGeneral->count_duplicate_in_sql('shipment_methods', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE shipment_methods
				SET name = '".$attr['name']."'
				WHERE id = ".$attr['id']." Limit 1";

        // echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 2;
            $response['error'] = 'Record Updated Successfully';
        }
        return $response;
    }

    function delete_shipment_method($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "update shipment_methods set status=0
                WHERE id = ".$attr['id'];
                
        $Sql = "UPDATE shipment_methods 
                SET STATUS=-1 
                WHERE id = ".$attr['id']." AND 
                      SR_CheckTransactionBeforeDelete(".$attr['id'].",".$this->arrUser['company_id'].", 9,0) = 'success';";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['SQL'] = $Sql;
            $response['ack'] = 0;
            $response['error'] = 'This Shipment cannot be deleted because it is being used in another record.';
        }
        return $response;
    }

    // Payment Methods Module
    //------------------------------------------------

    function get_payment_methods($attr)
    {
        // global $objFilters;
        // return $objFilters->get_module_listing(42, "payment_methods");
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $Sql = "SELECT   c.id, c.name  
                FROM  payment_methods  c
                where  c.status=1 and c.company_id=" . $this->arrUser['company_id']; //c.user_id=".$this->arrUser['id']."

        $order_type = " order by c.name ASC";
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q'],'sales_crm',sr_ViewPermission);
        $response['q'] = '';


        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['Description'] = $Row['name'];
                /* $result['name'] = $Row['name'];
                  $result['company_id'] = $Row['company_id']; */
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_payment_methods_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $Sql = "SELECT   c.id, c.name  
                FROM  payment_methods  c
                where  c.status=1 and c.company_id=" . $this->arrUser['company_id']; //c.user_id=".$this->arrUser['id']."
        
        $order_type = " order by c.name ASC";

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['description'] = $Row['name'];

                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_payment_method_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT *
				FROM payment_methods
				WHERE id='".$attr['id']."'
				LIMIT 1";

        $RS = $this->CSI($Sql,'sales_crm',sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = 'No record found!';
        }
        return $response;
    }

    function add_payment_method($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $data_pass = "   tst.name = '".$attr['name']."' ";
        $total = $this->objGeneral->count_duplicate_in_sql('payment_methods', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO payment_methods
				SET name = '".$attr['name']."',
                    user_id='" . $this->arrUser['id'] . "',
                    company_id='" . $this->arrUser['company_id'] . "'";

        $RS = $this->CSI($Sql,'sales_crm',sr_ViewPermission);
        $response['id'] = $this->Conn->Insert_ID();
        // $response = $this->objGeneral->run_query_exception($Sql);
        // return $response;
        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['error'] = 'Record Inserted Successfully';

        return $response;
    }

    function update_payment_method($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "   tst.name = '".$attr['name']."' $where_id ";
        $total = $this->objGeneral->count_duplicate_in_sql('payment_methods', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE payment_methods
				SET name = '".$attr['name']."'
				WHERE id = ".$attr['id']." 
                Limit 1";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 2;
            $response['error'] = 'Record Updated Successfully';
        }
        return $response;
    }

    function delete_payment_method($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        // print_r($attr);exit;

        $Sql = "UPDATE payment_methods 
                SET status=".DELETED_STATUS." 
                WHERE id = ".$attr['id']." AND 
                      SR_CheckTransactionBeforeDelete(".$attr['id'].", ".$this->arrUser['company_id'].", 10,0) = 'success'";

        // echo $Sql;exit;
        $RS = $this->CSI($Sql);

        if ($RS = $this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['success'] = 'Record Deleted Successfully';
        } else{
            $response['ack'] = 0;
            $response['error'] = 'This Payment Method cannot be deleted because it is being used in another record.';
        }

        return $response;
    }

    // Haulier Target Module
    //------------------------------------------------
    // Payment Methods Module
    //------------------------------------------------

    function get_haulier_targets($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $Sql = "SELECT   c.id, 
                        (CASE 
                            WHEN (c.from_location_id > 0 AND c.from_location_type =1) THEN (SELECT CONCAT(com.name ,' - Company Address') 
                            FROM company AS com 
                            WHERE com.id= c.company_id)
                            
                            WHEN (c.from_location_id > 0 AND c.from_location_type =2) THEN (SELECT CONCAT(compAdd.name ,' - Company Address') 
                            FROM company_addresses AS compAdd 
                            WHERE compAdd.id= c.from_location_id)
                            
                            WHEN (c.from_location_id > 0 AND c.from_location_type =3) THEN (SELECT CONCAT(wrhSel.name ,' - ',wrhSel.wrh_code) 
                            FROM sr_warehouses_sel AS wrhSel 
                            WHERE wrhSel.id= c.from_location_id)
                        END ) AS location_from,
                        CONCAT(ac.area_code,'-',ac.area_covered) AS area_covered,c.shipping_method_name AS shipment_method,c.price ,c.STATUS 
                FROM  haulier_target  c
                LEFT JOIN haulier_target_postcodes ac ON ac.id=c.to_location_id
                WHERE  c.company_id=" . $this->arrUser['company_id'] . " ";

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q'],'sales_crm',sr_ViewPermission);
        $response['q'] = '';


        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['Location From'] = $Row['location_from'];
                $result['Area Covered'] = $Row['area_covered'];
                $result['Shipment Method'] = $Row['shipment_method'];
                $result['Target Price'] = $Row['price'];
                $result['Status'] = ($Row['STATUS']==1) ? 'Active' : 'Inactive';
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_haulier_target_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();


        $Sql = "SELECT  c.id, 
                        (CASE 
                            WHEN (c.from_location_id > 0 AND c.from_location_type =1) THEN (SELECT CONCAT(com.name ,' - Company Address') 
                            FROM company AS com 
                            WHERE com.id= c.company_id)
                            
                            WHEN (c.from_location_id > 0 AND c.from_location_type =2) THEN (SELECT CONCAT(compAdd.name ,' - Company Address') 
                            FROM company_addresses AS compAdd 
                            WHERE compAdd.id= c.from_location_id)
                            
                            WHEN (c.from_location_id > 0 AND c.from_location_type =3) THEN (SELECT CONCAT(wrhSel.name ,' - ',wrhSel.wrh_code) 
                            FROM sr_warehouses_sel AS wrhSel 
                            WHERE wrhSel.id= c.from_location_id)
                        END ) AS location_from,
                        CONCAT(ac.area_code,'-',ac.area_covered) AS area_covered,c.shipping_method_name AS shipment_method,c.price,c.STATUS 
                FROM  haulier_target  c
                LEFT JOIN haulier_target_postcodes ac ON ac.id=c.to_location_id
                WHERE  c.status=1
                AND c.company_id=" . $this->arrUser['company_id'] . " ";

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        
        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';


        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['location_from'] = $Row['location_from'];
                $result['area_covered'] = $Row['area_covered'];
                $result['shipment_method'] = $Row['shipment_method'];
                $result['price'] = $Row['price'];
                $result['status'] = ($Row['STATUS']==1) ? 'Active' : 'Inactive';
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_haulier_target_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT *
				FROM haulier_target
				WHERE id='".$attr['id']."'
				LIMIT 1";
        $RS = $this->CSI($Sql,'sales_crm',sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
            // get area covered
            $Sql2 = "SELECT *
            FROM haulier_target_postcodes
            WHERE id='$Row[to_location_id]'
            LIMIT 1";
            $RS2 = $this->CSI($Sql2);
            $Row2 = $RS2->FetchRow();
            foreach ($Row2 as $key => $value) {
                if (is_numeric($key))
                    unset($Row2[$key]);
            }
            $response['response']['areaCovered'] = $Row2;

            // from location

            $Sql = "SELECT d.`id`             AS `id`,
                     `d`.`wrh_code`       AS `wrh_code`,
                     `d`.`postcode`       AS `postcode`,
                     `d`.`name`           AS `name`,
                     `d`.`city`           AS `city`,
                     `d`.`mobile`         AS `mobile`,
                     `d`.`email`          AS `email`,
                     `d`.`contact_person` AS `contact_person`,
                     `d`.`phone`          AS `phone`,
                     `d`.`fax`            AS `fax`,
                     `d`.`job_title`      AS `job_title`,
                     `d`.`address_1`      AS `address`,
                     `d`.`company_id`     AS `company_id`,
                    3 AS type
                FROM warehouse as d 
                WHERE d.company_id = ".$this->arrUser['company_id'] . " AND d.status = 1
                ORDER BY d.id";

        $RS = $this->CSI($Sql);

        $locations = [];
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['code'] = $Row['wrh_code'];
                $result['name'] = $Row['name'];
                $result['address'] = $Row['address'];
                $result['type'] = $Row['type'];
                $locations[]  = $result;
            }
            $response['response']['location_from']  = $locations;
        } 

            // shipment methds

            $Sql4 = "SELECT id,name
                    FROM shipment_methods
                    WHERE company_id = ".$this->arrUser['company_id'] . " AND status = 1 AND shipment_type=1
                    ORDER BY id";

            $RS4 = $this->CSI($Sql4);

            $shipment_methods = [];
            if ($RS4->RecordCount() > 0) {
                while ($Row = $RS4->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['name'] = $Row['name'];
                    $shipment_methods[]  = $result;
                }
                //echo '<pre>';print_r($shipment_methods); 
                $response['response']['shipment_methods']  = $shipment_methods; 
            } 

            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = 'No record found!';
        }
        return $response;
    }

    function get_area_covered($attr)
    {
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $str_where = '';
        $order_type = '';
        $defaultFilter = false;
        $response = array();
        //print_r($attr);exit;
        $where_clause = $this->objGeneral->flexiWhereRetriever("c.", $attr, $fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("c.", $attr, $fieldsMeta);
        if (empty($where_clause)) {
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("AreaCovered", $this->arrUser);
        }

        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT * FROM (SELECT * FROM haulier_target_postcodes) as c WHERE 1  " . $where_clause;
        $total_limit = pagination_limit;

        //echo $total_limit."limit";

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];


        $column = $code_check;


        if ($order_clause == "")
            $order_type = " Order BY c.id ASC";
        else
            $order_type = $order_clause;

        $response = $this->objGeneral->preListing($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        // $RS = $this->CSI($response['q']);
        $response['response']['tbl_meta_data'] = $this->GetTableMetaData('AreaCovered');
        $response['response']['tbl_meta_data']['defaultFilter'] = $defaultFilter;
        $RS = $this->CSI($response['q'], "sales_crm", sr_ViewPermission);
        // $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['total'] = $Row['totalRecordCount'];                
                $response['response'][] = $Row;
            }

            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 1;
            $response['error'] = NULL;
        }
        $response = $this->objGeneral->postListing($attr, $response);

        return $response;
        
    }

     function add_haulier_target($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $from_location = $attr['from_location_id']->id;
        $from_location_type = $attr['from_location_id']->type;
        $to_location = $attr['to_location_id'];
        $shipment_method = $attr['haulierShippingMethod_Name']->name;
        $status = $attr['status']->id;
        $currency_id = $attr['currency_id']->id;

        $data_pass = "  tst.from_location_id = '".$from_location."' AND 
                        tst.to_location_id = '".$to_location."' AND 
                        shipping_method_name='".$shipment_method."'";

        $total = $this->objGeneral->count_duplicate_in_sql('haulier_target', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO haulier_target
				SET 
                    from_location_id = '".$from_location."',
                    from_location_type = '".$from_location_type."',
                    to_location_id = '".$to_location."',
                    shipping_method_name='".$shipment_method."',
                    price='".$attr['price']."',
                    currency_id='".$currency_id."',
                    notes='".$attr['notes']."',
                    STATUS='".$status."',
                    company_id='" . $this->arrUser['company_id'] . "',
                    AddedBy='" . $this->arrUser['id'] . "',
                    AddedOn='" . current_date . "'";

        $RS = $this->CSI($Sql,'sales_crm',sr_ViewPermission);
        $response['id'] = $this->Conn->Insert_ID();
        // $response = $this->objGeneral->run_query_exception($Sql);
        // return $response;
        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['error'] = 'Record Inserted Successfully';

        return $response;
    }

    function update_haulier_target($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $from_location = $attr['from_location_id']->id;
        $from_location_type = $attr['from_location_id']->type;
        $to_location = $attr['to_location_id'];
        $shipment_method = $attr['haulierShippingMethod_Name']->name;
        $status = $attr['status']->id;
        $currency_id = $attr['currency_id']->id;

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "  tst.from_location_id = '".$from_location."' AND  
                        tst.to_location_id = '".$to_location."' AND 
                        shipping_method_name='".$shipment_method."'".$where_id;

        $total = $this->objGeneral->count_duplicate_in_sql('haulier_target', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE haulier_target
				SET 
                    from_location_id = '".$from_location."',
                    from_location_type = '".$from_location_type."',
                    to_location_id = '".$to_location."',
                    shipping_method_name='".$shipment_method."',
                    price='".$attr['price']."',
                    currency_id='".$currency_id."',
                    notes='".$attr['notes']."',
                    STATUS='".$status."',
                    company_id='" . $this->arrUser['company_id'] . "',
                    ChangedBy='" . $this->arrUser['id'] . "',
                    ChangedOn='" . current_date . "'
				WHERE id = ".$attr['id']." 
                Limit 1";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 2;
            $response['error'] = 'Record Updated Successfully';
        }
        return $response;
    }

    function delete_haulier_target($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        // print_r($attr);exit;

        $Sql = "DELETE FROM haulier_target WHERE id = ".$attr['id'];
        // echo $Sql;exit;
        $RS = $this->CSI($Sql);

        if ($RS = $this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['success'] = 'Record Deleted Successfully';
        } else{
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be Deleted.';
        }

        return $response;
    }
    // Payment Terms Module
    //------------------------------------------------

    function get_payment_terms($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $Sql = "SELECT   c.id, c.name,c.days  
                FROM  payment_terms  c
                where   c.status=1 and 
                        c.company_id=" . $this->arrUser['company_id'] . "
                ORDER BY c.days ASC"; 
        // echo $Sql ;exit;

        // $total_limit = pagination_limit;
         
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        // $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($Sql, 'sales_crm', sr_ViewPermission);
        $response['q'] = '';
        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['Description'] = $Row['name'];
                $result['days'] = $Row['days'];
                /* $result['name'] = $Row['name'];
                  $result['company_id'] = $Row['company_id']; */
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_payment_terms_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $Sql = "SELECT   c.id, c.name,c.days,c.company_id  
                FROM  payment_terms  c
		        where   c.status=1 and 
                        c.company_id=" . $this->arrUser['company_id'] . " ";

        $order_type = " Order by c.name ASC";
        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['description'] = $Row['name'];
                $result['days'] = $Row['days'];
                $result['company_id'] = $Row['company_id'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            // $response['total'] = $total;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function get_payment_term_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM payment_terms
				WHERE id='".$attr['id']."'
				LIMIT 1";
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = 'No record found!';
        }
        return $response;
    }

    function add_payment_term($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $data_pass = " tst.name = '".$attr['name']."' ";
        $total = $this->objGeneral->count_duplicate_in_sql('payment_terms', $data_pass, $this->arrUser['company_id']);
        
        if ($total == 1) {
            $response['ack'] = 2;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO payment_terms
				                SET 
                                    name = '".$attr['name']."',
                                    days = '".$attr['days']."',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "'";

        $RS = $this->CSI($Sql);
        $response['id'] = $this->Conn->Insert_ID();

        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['error'] = 'Record Inserted Successfully';
        return $response;
    }

    function update_payment_term($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "  tst.name = '".$attr['name']."' $where_id ";
        $total = $this->objGeneral->count_duplicate_in_sql('payment_terms', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE payment_terms
				SET name = '".$attr['name']."',
                    days = '".$attr['days']."'
				WHERE id = ".$attr['id']." 
                Limit 1";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 2;
            $response['error'] = 'Record Updated Successfully';
        }
        return $response;
    }

    function delete_payment_term($attr)
    {
        // print_r($attr);exit;
        $this->objGeneral->mysql_clean($attr);
                
        $Sql = "UPDATE payment_terms SET status=".DELETED_STATUS." WHERE id = ".$attr['id']." AND SR_CheckTransactionBeforeDelete(".$attr['id'].", ".$this->arrUser['company_id'].", 31,0) = 'success'";
        
        // echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'This Payment Term cannot be deleted because it is being used in another record.';
        }
        return $response;
    }

    // Finance Charges Module
    //------------------------------------------------

    function get_payment_terms_list_srm($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = "";       
        $response = array();
        
        $Sql = "SELECT c.* 
                FROM srm_payment_terms  c 
                where  c.status=1 and 
                       c.company_id=" . $this->arrUser['company_id'] . "
                order by  c.days ASC "; //c.user_id=".$this->arrUser['id']." 
      
        $RS = $this->CSI($Sql);
		
        $response['ack'] = 1;
        $response['error'] = NULL; 

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['days'] = $Row['days'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_payment_methods_list_srm($attr, $isAllowed=null)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = "";         
        $response = array();
        
        $Sql = "SELECT   c.* 
                FROM  srm_payment_methods  c 
                where c.status=1 and 
                      c.company_id=" . $this->arrUser['company_id'] . "
                order by  c.name ASC "; //c.user_id=".$this->arrUser['id']." 
     

        if ($isAllowed){
            $RS = $this->CSI($Sql);
        }
        else{
            $RS = $this->CSI($Sql, 'sales_crm', sr_ViewPermission); 
        }
        
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_finance_charges($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = "";
        $where_clause = "AND type = 1  ";
        $order_type = "";
        $response = array();

        $Sql = "SELECT c.*
                FROM charges c
                WHERE  type = 1 AND c.company_id =" . $this->arrUser['company_id'];

        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';
        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['finance_Charges'] = $Row['value'];
                /* $result['name'] = $Row['name'];
                  $result['value'] = $Row['value'];
                  $result['type'] = $Row['type'];
                  $result['company_id'] = $Row['company_id']; */
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_charges_code($attr)
    {
        $mSql = "SELECT prefix FROM `module_codes` WHERE `id` = ".$attr['module_id'];
        $code = $this->CSI($mSql)->FetchRow();

        $Sql = "SELECT max(id) as count	FROM crm";
        $crm = $this->CSI($Sql)->FetchRow();
        //echo $mSql; exit;
        $nubmer = $crm['count'];

        if ($attr['is_increment'] == 1 || $nubmer == '')
            $nubmer++;

        return array('code' => $code['prefix'] . self::module_item_prefix($nubmer), 'number' => $nubmer);
    }

    function module_item_prefix($id)
    {
        $count_id = strlen($id);
        switch ($count_id) {
            case 1:
                $id = '00' . $id;
                break;
            case 2:
                $id = '0' . $id;
                break;
            default :
                $id = $id;
                break;
        }
        return $id;
    }

    function get_finance_charges_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT *
				FROM charges
				WHERE id='".$attr['id']."' AND type = '1'
				LIMIT 1";
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = 'Record not found!';
        }
        return $response;
    }

    function add_finance_charges($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $data_pass = "  tst.name = '".$attr['name']."' AND 
                        tst.type = '1' and 
                        tst.value= ".$attr['value']." and 
                        tst.company_id =" . $this->arrUser['company_id'];

        $total = $this->objGeneral->count_duplicate_in_sql('charges', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO charges
				                SET 
                                    name = '".$attr['name']."',
                                    discount_type = 'Percentage',
                                    value = '".$attr['value']."', 
                                    type = '1',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "'";
        //echo $Sql; exit;
        $RS = $this->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['id'] = 0;
            $response['error'] = 'Record not inserted!';
        }
        return $response;
    }

    function update_finance_charges($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = " tst.name = '".$attr['name']."' AND tst.type = '1'   ";
        $total = $this->objGeneral->count_duplicate_in_sql('charges', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE charges
				            SET 
                                name = '".$attr['name']."',
                                discount_type = 'Percentage',
                                value = '".$attr['value']."'
				WHERE id = ".$attr['id']." AND 
                      type = 1 
                Limit 1";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }
        return $response;
    }

    function delete_finance_charges($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM charges
				WHERE id = ".$attr['id'];

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }
        return $response;
    }

    // Insurance Charges Module
    //------------------------------------------------

    function get_insurance_charges($attr)
    {
        // global $objFilters;
        // return $objFilters->get_module_listing(53, "charges", $attr[column], $attr[value], '', '', '', $attr['order_by']);

        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = "";
        $where_clause = "AND type = '2' ";

        $order_type = "";
        $response = array();

        $Sql = "SELECT c.*
                FROM charges c
                WHERE c.type=2 AND c.company_id =" . $this->arrUser['company_id'];

        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';
        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['insurance_Charges'] = $Row['value'];
                /* $result['name'] = $Row['name'];
                  $result['value'] = $Row['value'];
                  $result['type'] = $Row['type'];
                  $result['company_id'] = $Row['company_id']; */
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_insurance_charges_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT *
				FROM charges
				WHERE id='".$attr['id']."' AND type = '2'
				LIMIT 1";

        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = 'Record not found!';
        }
        return $response;
    }

    function add_insurance_charges($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $data_pass = "  tst.name = '".$attr['name']."' AND 
                        tst.type = '2' and 
                        tst.value= ".$attr['value']." and 
                        tst.company_id =" . $this->arrUser['company_id'];

        $total = $this->objGeneral->count_duplicate_in_sql('charges', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO charges
				                SET 
                                    name = '".$attr['name']."',
                                    discount_type = 'Percentage',
                                    value = '".$attr['value']."', 
                                    type = '2',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "'";
        //echo $Sql; exit;
        $RS = $this->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['id'] = 0;
            $response['error'] = 'Record not inserted!';
        }

        return $response;
    }

    function update_insurance_charges($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "  tst.name = '".$attr['name']."' AND tst.type = '2'   ";
        $total = $this->objGeneral->count_duplicate_in_sql('charges', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE charges
				            SET 
                                discount_type = 'Percentage',
                                name = '".$attr['name']."',
                                value = '".$attr['value']."'
				WHERE id = ".$attr['id']." AND type = 2 
                Limit 1";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }
        return $response;
    }


    function delete_insurance_charges($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM charges
				WHERE id = ".$attr['id'];

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }

        return $response;
    }

    // Overrider Module
    //------------------------------------------------

    function get_overrider($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $Sql = "SELECT c.id, c.name  
                FROM  overrider  c
		        where c.status=1 and 
                      c.company_id=" . $this->arrUser['company_id'];

        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';
        $response['ack'] = 1;
        $response['error'] = NULL;


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['charge'] = $Row['value'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }


    function get_overrider_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT *
				FROM overrider
				WHERE id='".$attr['id']."'
				LIMIT 1";

        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = 'Record not found!';
        }
        return $response;
    }


    function add_overrider($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $data_pass = " tst.value = '".$attr['value']."'   ";
        $total = $this->objGeneral->count_duplicate_in_sql('overrider', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO overrider
				                SET 
                                    value = '".$attr['value']."',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "'";
        
        $RS = $this->CSI($Sql);
        $response['id'] = $this->Conn->Insert_ID();
        // $response = $this->objGeneral->run_query_exception($Sql);
        // return $response;
        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['error'] = 'Record Inserted Successfully';
        return $response;
    }


    function update_overrider($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "  tst.value = '".$attr['value']."'   ";
        $total = $this->objGeneral->count_duplicate_in_sql('overrider', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE overrider
				SET value = '".$attr['value']."'
				WHERE id = ".$attr['id']." 
                Limit 1";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }
        return $response;
    }

    function get_vat_scheme($attr)
    {
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT c.* FROM ref_vat_scheme c";
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {

            while ($Row = $RS->FetchRow()) {
                $response['response'][] = $Row;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }


    function chk_company_vat_scheme($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT vat_scheme FROM financial_settings where company_id = " . $this->arrUser['company_id'];
        $rs_count = $this->CSI($Sql);


        // print_r($vat_scheme);exit;
        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($rs_count->RecordCount() > 0) {
            $response['vat_scheme'] = $rs_count->fields['vat_scheme'];
        } else {
            $response['vat_scheme'] = "";
        }
        return $response;
    }

    // customer finance posting  General
    //------------------------------------------------

    function get_posting_general($attr)
    {
        /* global $objFilters;
          return $objFilters->get_module_listing(53, "charges",$attr[column],$attr[value]); */

        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $Sql = "SELECT   c.id, c.name  
                FROM  ref_posting_general  c
                where  c.status=1 and 
                       c.company_id=" . $this->arrUser['company_id'] . "
                order by  c.id ASC ";

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';
        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_posting_general($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $data_pass = "  tst.name = '".$attr['name']."'   ";
        $total = $this->objGeneral->count_duplicate_in_sql('ref_posting_general', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
        
        $Sql = "INSERT INTO ref_posting_general
                                            SET 
                                                name = '".$attr['name']."',
                                                user_id='" . $this->arrUser['id'] . "',
                                                company_id='" . $this->arrUser['company_id'] . "'";
        $RS = $this->CSI($Sql);
        $response['id'] = $this->Conn->Insert_ID();
        // $response = $this->objGeneral->run_query_exception($Sql);
        // return $response;

        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['error'] = 'Record Inserted Successfully';

        return $response;
    }

    function update_posting_general($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "  tst.name = '".$attr['name']."'   ";
        $total = $this->objGeneral->count_duplicate_in_sql('ref_posting_general', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE ref_posting_general
				SET name = '".$attr['name']."'
				WHERE id = ".$attr['id'];

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }

        return $response;
    }

    // customer finance posting group
    //------------------------------------------------

    function get_postingGroupCustPortal($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if(isset($attr['selCust'])){

            $key = hash('sha256', SECRET_KEY);
            $iv = substr(hash('sha256', SECRET_IV), 0, 16);
            $outputInvName = openssl_decrypt(base64_decode($attr['selCust']), SECRET_METHOD, $key, 0, $iv);
            $fileName = explode(",",$outputInvName);

            $customerID = $fileName[1];

            $Sql = "SELECT c.id as cid,c.customer_code,c.name,c.company_id
                    FROM crm c
                    WHERE c.type IN (2,3) AND 
                        c.customer_code IS NOT NULL AND 
                        c.name !='' AND 
                        c.id=" . $customerID. "";
            
            $RS = $this->CSI($Sql);

            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {

                    foreach ($Row as $key => $value) {
                        if (is_numeric($key))
                            unset($Row[$key]);
                    }

                    $row = array();
                    $attr['cust_id'] = $Row['cid'];
                    $this->arrUser['company_id'] = $Row['company_id'];
                }
                $response['customerID'] = $customerID;
            } else {
                $response['ack'] = 1;
                $response['error'] = NULL;
                $response['response'][] = array();
                return $response;
            }
        }
        else{
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'][] = array();
            return $response;
        }
        //print_r($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $Sql = "SELECT c.id, c.name  
                FROM  ref_posting_group  c 
                where  c.status=1  and 
                       c.company_id=" . $this->arrUser['company_id'];
        // echo	$Sql;exit;

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';
        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $response['response'][] = $result;
            }
        } 
        else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_posting_group($attr)
    {
        /* global $objFilters;
          return $objFilters->get_module_listing(53, "charges",$attr[column],$attr[value]); */

        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $Sql = "SELECT c.id, c.name  
                FROM  ref_posting_group  c 
                where  c.status=1  and 
                       c.company_id=" . $this->arrUser['company_id'];

        /*  $Sql = "SELECT   c.id, c.name  FROM  ref_posting_group  c
          left JOIN company on company.id=c.company_id
          where  c.status=1
          and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
          order by  c.id DESC "; */
        // echo	$Sql;exit;

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';
        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $response['response'][] = $result;
            }
        } 
        else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_posting_group($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $data_pass = "  tst.name = '".$attr['name']."'   ";
        $total = $this->objGeneral->count_duplicate_in_sql('ref_posting_group', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO ref_posting_group 
                                        SET 
                                            name = '".$attr['name']."',
                                            user_id='" . $this->arrUser['id'] . "',
                                            company_id='" . $this->arrUser['company_id'] . "'";
        //echo   $Sql;exit;

        $RS = $this->CSI($Sql);
        $response['id'] = $this->Conn->Insert_ID();
        $response['ack'] = 1;
        $response['error'] = 'Record Inserted Successfully';
        return $response;
    }


    function update_posting_group($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "  tst.name = '".$attr['name']."'   ";
        $total = $this->objGeneral->count_duplicate_in_sql('ref_posting_group', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE ref_posting_group
				                SET 
                                    name = '".$attr['name']."'
				WHERE id = ".$attr['id']."";
        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }
        return $response;
    }

    // customer finance posting vat
    //------------------------------------------------

    function get_posting_vat($attr)
    {
        /* global $objFilters;
          return $objFilters->get_module_listing(53, "charges",$attr[column],$attr[value]); */

        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $Sql = "SELECT   c.*  
                FROM  ref_posting_vat  c 
                where   c.status=1 and 
                        c.company_id=" . $this->arrUser['company_id'] . "
                order by  c.id ASC ";
        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';
        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['value1'] = $Row['value1'];
                $result['value2'] = $Row['value2'];
                $result['value3'] = $Row['value3'];
                $result['ref_posting_group_id'] = $Row['ref_posting_group_id'];
                $response['response'][] = $result;
            }
        } else
            $response['response'][] = array();

        return $response;
    }

    function update_posting_vat($attr)
    {
        //  $this->objGeneral->mysql_clean($attr);


        /* $data_pass = "  tst.name = '".$attr['name']."'   ";
          $total = $this->objGeneral->count_duplicate_in_sql('ref_posting_vat', $data_pass, $this->arrUser['company_id']);
          if ($total == 1) {
          $response['ack'] = 0;
          $response['error'] = 'Record Already Exists.';
          return $response;
          exit;
          } */

        $chk = 0;
        $Sqli = "DELETE FROM ref_posting_vat WHERE company_id= '" . $this->arrUser['company_id'] . "' ";
        $RS = $this->CSI($Sqli);

        if ($this->Conn->Affected_Rows() > 0)
            $msg = 'Updated';
        else
            $msg = 'Inserted';

        $Sql = "INSERT INTO ref_posting_vat (value1,value2, value3, ref_posting_group_id, date_created,company_id, user_id) VALUES ";

        foreach ($attr['selectdata'] as $item) {
            // if (($item->value1 > 0)) {
            $Sql .= "(  '" . $item->value1 . "','" . $item->value2 . "',  '" . $item->value3 . "'	, " . "'" . $item->ref_posting_group_id . "', '" . current_date . "',  '" . $this->arrUser['company_id'] . "' 	,'" . $this->arrUser['id'] . "' ),";
            // }
        }
        $Sql = substr($Sql, 0, -1);
        // echo   $Sql ;exit;
        $RS = $this->CSI($Sql);
        // $response['id'] = $this->Conn->Insert_ID();

        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['error'] = "Record  $msg";
        return $response;
    }

    //  Sales Pipeline Targets Module
    //------------------------------------------------

    function get_sales_pipeline_targets($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $Sql = "SELECT c.*
				FROM sales_pipeline_target c
				WHERE 1 " . $where_clause;


        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        
        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'sales_pipeline_target', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['code'] = $Row['code'];
                $result['description'] = $Row['description'];
                $result['start_period'] = $Row['start_period'];
                $result['end_period'] = $Row['end_period'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            //$response['total'] = $total;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function get_sales_pipeline_target_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT id, code, description,start_period, end_period
				FROM sales_pipeline_target
				WHERE id='".$attr['id']."'
				LIMIT 1";

        //echo $Sql;exit;
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_sales_pipeline_target($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();
        $check = 0;
        $start_period = $this->objGeneral->convert_date($attr['start_period']);
        $end_period = $this->objGeneral->convert_date($attr['end_period']);

        if (isset($attr['opp_cycle_id']) && $attr['opp_cycle_id'] > 0) {

            $Sqls = "SELECT * 
                     FROM sales_pipeline_target 
                     WHERE opp_cycle_id='".$attr['opp_cycle_id']."' AND tab_id='".$attr['tab_id']."' 	
                     LIMIT 1";

            //echo $Sqls;exit;
            $RS = $this->CSI($Sqls);
            if ($RS->RecordCount() > 0)
                $check = 1;
        }

        if ($check == 0) {

            $Sql = "INSERT INTO sales_pipeline_target 
                    SET code = '".$attr['code']."',
                        description = '".$attr['description']."',
                        start_period = '".$start_period."',
                        end_period = '".$end_period."',
                        opp_cycle_id = '".$attr['opp_cycle_id']."',
                        tab_id = '".$attr['tab_id']."',
                        user_id='" . $this->arrUser['id'] . "',
                        company_id='" . $this->arrUser['company_id'] . "'";

            $RS = $this->CSI($Sql);
            $id = $this->Conn->Insert_ID();

            if (isset($attr['opp_cycle_id']) && $attr['opp_cycle_id'] > 0)
                $response['opp'] = 1;
            else
                $response['opp'] = 0;

            if ($id > 0) {
                $response['ack'] = 1;
                $response['Update'] = 0;
                $response['error'] = NULL;
            } else {
                $response['ack'] = 0;
                $response['Update'] = 0;
                $response['error'] = 'Record not inserted!';
            }
        } else {

            $upSql = "UPDATE sales_pipeline_target 
                        SET code = '".$attr['code']."',
                            description = '".$attr['description']."',
                            start_period = '".$start_period."',
                            end_period = '".$end_period."',
                            opp_cycle_id = '".$attr['opp_cycle_id']."',
                            tab_id = '".$attr['tab_id']."' 
                        WHERE opp_cycle_id = '".$attr['opp_cycle_id']."'  "; //AND tab_id = '$attr[tab_id]'


            $RS = $this->CSI($upSql);

            if (isset($attr['opp_cycle_id']) && $attr['opp_cycle_id'] > 0)
                $response['opp'] = 1;
            else
                $response['opp'] = 0;

            if ($this->Conn->Affected_Rows() > 0) {
                $response['ack'] = 1;
                $response['Update'] = 1;
                $response['error'] = NULL;
            } else {
                $response['ack'] = 0;
                $response['Update'] = 1;
                $response['error'] = 'Record cannot be updated';
            }
        }

        return $response;
    }

    function update_sales_pipeline_target($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "UPDATE sales_pipeline_target 
                SET code = '".$attr['code']."',
                    description = '".$attr['description']."',
                    start_period = '".$start_period."',
                    end_period = '".$end_period."' 
                WHERE id = '".$attr['id']."'  "; //AND tab_id = '$attr[tab_id]'

        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }

        return $response;
    }

    function delete_sales_pipeline_target($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM sales_pipeline_target
				WHERE id = ".$attr['id'];

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }

        return $response;
    }

    // CRM Tabs Module
    //------------------------------------------------

    function get_crm_tabs($attr)
    {

        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $Sql = "SELECT  c.*
				FROM crm_tabsc
				WHERE 1" . $where_clause;


        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'crm_tabs', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['status'] = $Row['status'];
                $result['rank'] = $Row['rank'];
                $result['module_id'] = $Row['module_id'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['total'] = $total;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = 'No record found!';
        }
        return $response;
    }

    function get_crm_tab_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM crm_tabs
				WHERE id='".$attr['id']."'
				LIMIT 1";

        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = 'No record found!';
        }
        return $response;
    }

    function add_crm_tab($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "INSERT INTO crm_tabs
				SET name = '".$attr['name']."',
                    status = '".$attr['status']."',
                    module_id = '".$attr['module_id']."',
                    is_default = '".$attr['is_default']."',
                    user_id='" . $this->arrUser['id'] . "',
                    company_id='" . $this->arrUser['company_id'] . "'";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
        }

        return $response;
    }

    function update_crm_tab($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "UPDATE crm_tabs
				SET name = '".$attr['name']."',
                    module_id = '".$attr['module_id']."',
                    status = '".$attr['status']."',
                    is_default = '".$attr['is_default']."'
				WHERE id = ".$attr['id']." ";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }

        return $response;
    }

    function delete_crm_tab($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM crm_tabs
				WHERE id = ".$attr['id'];

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }

        return $response;
    }

    function sort_tab($arr_attr)
    {
        //echo '<pre>'; print_r($arr_attr['record']);exit;
        $count = 1;
        foreach ($arr_attr['record'] as $value) {
            $Sql = "UPDATE crm_tabs SET `rank` = ".$count." WHERE id =  ".$value->id;
            //echo "<hr />".$Sql;
            $RS = $this->CSI($Sql);
            $count++;
        }
        $response['ack'] = 1;
        $response['error'] = NULL;
        return $response;
    }

    // CRM Opportunity Cycle Tabs Module
    //------------------------------------------------

    function getArrayValue($array, $key)
    {
        $key = preg_match("/\[['\"]{1}(.+)['\"]{1}\]\[['\"]{1}(.+)['\"]{1}\]/", $key, $matches);
        if (count($matches) !== 3) {
            return NULL;
        }
        $first = $matches[1];
        $second = $matches[2];
        return $array[$first][$second];
    }

    function get_opportunity_cycle_tabs($attr)
    {

        $this->objGeneral->mysql_clean($attr);
        //print_r($attr); exit;
        $limit_clause = "";
        // if ($attr['is_opp_cyle'] == 1)  $where_clause = " and   c.is_default = 1";// AND c.status =1 OR
        if ($attr['is_opp_cyle'] == 0 && $this->arrUser['user_type'] != SUPER_ADMIN_USER_TYPE)
            $where_clause = "AND c.company_id =" . $this->arrUser['company_id'] . " AND c.is_default = 0";
        else
            $where_clause = " AND c.company_id =" . $this->arrUser['company_id'];

        if (!empty($attr['opp_cycle_limit']))
            $limit = "LIMIT  ".$attr['opp_cycle_limit']." ";


        if (!empty($attr['status'])) $where_clause2 = "and c.status=1 ";

        $response = array();

        $Sql = "SELECT   c.*  
                FROM opp_cycle_tabs  c   
                where  c.company_id=" . $this->arrUser['company_id'] . " " . $where_clause .$where_clause2;

        $order_type = " order by c.start_end,c.rank ASC ";

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //  echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                // $result['name'] = (strlen($Row['name']>25)) ? substr($Row['name'], 0, 150).'... ' : $Row['name'];

                $result['rank'] = $Row['rank'];
                $result['edit_percentage'] = $Row['edit_percentage'];
                $result['percentage'] = $Row['percentage'];
                $result['Probability'] = $Row['percentage'];
                $result['start_end'] = $Row['start_end'];
                $result['status'] = $Row['status'] == 1 ? 'Active' : 'Inactive';
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;

        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = 'No record found!';
        }
        return $response;
    }

    function get_opportunity_cycle_tab_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT c.*,
                      (select op.id
                       from (SELECT id,MAX(crm_opportunity_cycle_id),stage_id,is_complete,company_id
                             FROM crm_opportunity_cycle_detail
                             GROUP BY crm_opportunity_cycle_id DESC) as op
                       where op.stage_id=c.id AND 
                             op.is_complete=0 AND 
                             op.company_id=" . $this->arrUser['company_id'] . "
                       limit 1 ) * c.status AS restrict_status_change
                FROM opp_cycle_tabs c
                WHERE id='".$attr['id']."'
				LIMIT 1";

      

        $RS = $this->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            //print_r($Row['restrict_status_change']);exit;
            $response['oop_cycle_codes'] = "";

            if ($Row['restrict_status_change'] > 0)
                $response['oop_cycle_codes'] = self::get_opportunity_cycle_restricted_stage_code($attr);

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = 'No record found!';
        }
        return $response;
    }

    function get_opportunity_cycle_restricted_stage_code($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $order_type = "";
        $response = array();

        $Sql = "select oop.oop_code
                from (SELECT id,MAX(crm_opportunity_cycle_id),crm_opportunity_cycle_id,stage_id,is_complete,company_id
                        FROM crm_opportunity_cycle_detail
                        GROUP BY crm_opportunity_cycle_id DESC) as op
                left JOIN company on company.id=op.company_id
                left JOIN crm_opportunity_cycle as oop on oop.id=op.crm_opportunity_cycle_id
                where op.stage_id='" . $attr['id'] . "' AND op.is_complete=0
                        AND (op.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                            AND oop.status = 1";


        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['oop_code'] = $Row['oop_code'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_opportunity_cycle_tab($attr)
    {
        //  $this->objGeneral->mysql_clean($attr);

        $idx = 0;
        $pre = "";

        $data_pass = " tst.name = '".$attr['name']."'";
        $total = $this->objGeneral->count_duplicate_in_sql('opp_cycle_tabs', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            $response['duplicate'] = 1;
            return $response;
        }

        if($attr['tab_postions'] == 2){

            $data_pass2 = " tst.start_end = 2";
            $total2 = $this->objGeneral->count_duplicate_in_sql('opp_cycle_tabs', $data_pass2, $this->arrUser['company_id']);

            if ($total2 == 1) {
                $response['ack'] = 0;
                $response['error'] = 'End Record Already Exists.';
                $response['duplicate'] = 1;
                return $response;
            }
        }

        // if(!empty($attr[array_tab]))
        $crm_id = $attr['crm_id'];
        foreach ($attr['array_tab'] as $key => $value) {

            if ($value->id == $attr['after_befor_tab']->id) {
                $idx = $key;
                $pre = $pre;
                break;
            }
            $pre = $value->id;
        }
        if (!empty($pre)) { //crm_opportunity_cycle_main
            $sql_total1 = " SELECT  count(cp.id) as total,cp.is_complete
                            FROM crm_opportunity_cycle_detail  cp
                            Inner Join crm_opportunity_cycle  cm on  cm.id=cp.crm_opportunity_cycle_id
                            WHERE   cp.tab_id =".$pre." AND 
                                    cm.crm_id =".$crm_id."   AND
                                    cp.company_id=" . $this->arrUser['company_id'] . "
                            Limit 1";
            $rs_count1 = $this->CSI($sql_total1);
            $pre_count = $rs_count1->fields['is_complete'];
        }

        $idx = $idx + 1;
        foreach ($attr['array_tab'] as $key => $value) {
            if ($idx == $key) {
                $nxt = $value->id;
                break;
            }
        }
        if (!empty($nxt)) {
            $sql_total2 = " SELECT  count(cp.id) as total,cp.is_complete
                            FROM crm_opportunity_cycle_detail  cp
                            Inner Join crm_opportunity_cycle  cm on  cm.id=cp.crm_opportunity_cycle_id
                            WHERE cp.tab_id =".$nxt." AND cm.crm_id =".$crm_id."  AND
                                  cp.company_id=" . $this->arrUser['company_id'] . "
                            Limit 1";

            $rs_count2 = $this->CSI($sql_total2);
            $next_count = $rs_count2->fields['is_complete'];
        }

        if ($pre_count == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Prev Tab Data is completed Change Current Location.';
            return $response;
            exit;
        }

        if ($next_count == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Next Tab Data is completed Change Current Location.';
            return $response;
            exit;
        }


        // $Sql_company = "SELECT opp_cycle_limit,oop_cycle_edit_role FROM company WHERE id='".$attr['id']."' LIMIT 1";
        //  $crm = $this->CSI($Sql)->FetchRow();
        $arr['id'] = $this->arrUser['company_id'];
        $result = $this->get_company_opertunity_by_id($arr);


        if (empty($result)) {

            $response['ack'] = 0;
            $response['error'] = 'Opp cycle Max Limit is not Define ';
            return $response;
            exit;
        }
        //max(rank)

        $Sql = "SELECT count(id) as countresult FROM opp_cycle_tabs where company_id='" . $this->arrUser['company_id'] . "' ";
        $crm = $this->CSI($Sql)->FetchRow();
        $rank = $crm['countresult'];

        if ($rank >= $result['response']['opp_cycle_limit']) { //opp_cycle_limit
            $response['ack'] = 0;
            $response['error'] = 'Max Limit Exceed.';
            return $response;
            exit;
        }


        if ($attr['tab_postions'] == 1 || $attr['tab_postions'] == 2) {

            $Sql1 = "UPDATE opp_cycle_tabs 
                            SET start_end =1.1  
                            WHERE start_end = ".$attr['tab_postions']."    AND 
                                company_id=" . $this->arrUser['company_id'] . "  
                            limit 1";

            $RS = $this->CSI($Sql1);
            $tab_postions = $attr['tab_postions'];

        } else
            $tab_postions = '1.1';

        $percentage = ($attr['percentage'] != '') ? $attr['percentage'] : 'NULL';

        $Sql = "INSERT INTO opp_cycle_tabs 
                    SET 
                    name = '".$attr['name']."', 
                    `rank` = " . $rank . " ,
                    user_id='" . $this->arrUser['id'] . "',
                    company_id='" . $this->arrUser['company_id'] . "' ,
                    edit_percentage = '".$attr['edit_percentages']."',
                    percentage = ".$percentage."  ,
                    start_end = '".$tab_postions."'  ";

        // echo $Sql;exit;
        $RS = $this->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['id'] = 0;
            $response['error'] = 'Record cannot be Saved.';
        }

        return $response;
    }

    function update_opportunity_cycle_tab($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $where_id = "";

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = " tst.name='" . $attr['name'] . "'". $where_id;
        $total = $this->objGeneral->count_duplicate_in_sql('opp_cycle_tabs', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            $response['duplicate'] = 1;
            return $response;
        }

        if($attr['tab_postions'] == 2){

            $data_pass2 = " tst.start_end = 2 ".$where_id;
            $total2 = $this->objGeneral->count_duplicate_in_sql('opp_cycle_tabs', $data_pass2, $this->arrUser['company_id']);

            if ($total2 == 1) {
                $response['ack'] = 0;
                $response['error'] = 'End Record Already Exists.';
                $response['duplicate'] = 1;
                return $response;
            }
        }

        if ($attr['tab_postions'] == 1 || $attr['tab_postions'] == 2) {

            $Sql1 = "UPDATE opp_cycle_tabs 
                                    SET 
                                        start_end =1.1  
                     WHERE start_end = ".$attr['tab_postions']." AND 
                           company_id=" . $this->arrUser['company_id'] . "  
                     limit 1";
            $RS = $this->CSI($Sql1);
        }

        $percentage = ($attr['percentage'] != '') ? $attr['percentage'] : 0;

        $Sql = "UPDATE opp_cycle_tabs 
                        SET 
                            name = '".$attr['name']."',
                            status = '".$attr['statuss']."',
                            is_default = '".$attr['is_default']."',
                            edit_percentage = '".$attr['edit_percentage']."',
                            percentage = ".$percentage.",
                            start_end = ".$attr['tab_postions']."  
                        WHERE id = ".$attr['id']." AND company_id=" . $this->arrUser['company_id'] . " 
                        limit 1";

        // echo $Sql;exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Updated Successfully';
        }

        return $response;
    }

    function delete_opportunity_cycle_tab($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        //  $Sql = "update opp_cycle_tabs set status=0 WHERE id = ".$attr['id']."    AND company_id=" . $this->arrUser['company_id'] . " limit 1 ";

        $Sql = "SELECT count(c.id) as count  
                FROM crm_opportunity_cycle_detail c
                left join crm_opportunity_cycle coc on coc.id = c.crm_opportunity_cycle_id 
                WHERE c.company_id= " . $this->arrUser['company_id'] . " and  
                      c.tab_id = ".$attr['id']." AND 
                      coc.status = 1 
                LIMIT 1  ";

        $RS1 = $this->CSI($Sql);

        if ($RS1->fields['count'] > 0) {

            $response['ack'] = 0;
            $response['error'] = 'Record Can not Delete.';

            return $response;
            exit;
        } else {

            $Sql2 = "DELETE FROM opp_cycle_tabs 
                     WHERE id = ".$attr['id']." AND 
                     company_id=" . $this->arrUser['company_id'] . "
                     LIMIT 1 ";

            // echo $Sql2;exit;
            $RS = $this->CSI($Sql2);
        }

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }

        return $response;
    }

    function sort_opportunity_cycle_tabs($arr_attr)
    {
        //echo '<pre>'; print_r($arr_attr['record']);exit;
        /* $Sql = "SELECT max(rank) as count	FROM opp_cycle_tabs WHERE is_default = 1";
          $opptb = $this->CSI($Sql)->FetchRow(); */
        //echo $mSql; exit;
        //$count = $opptb['count']+1;

        $count = 1;

        foreach ($arr_attr['record'] as $value) {

            $Sql = "UPDATE opp_cycle_tabs 
                    SET `rank` = ".$count." 
                    WHERE id =  ".$value->id." and 
                          start_end =1.1 AND 
                          company_id=" . $this->arrUser['company_id'] . "  ";

            $RS = $this->CSI($Sql);
            $count++;
        }

        $response['ack'] = 1;
        $response['error'] = NULL;
        return $response;
    }

    function add_opportunity_cycle_tab_popup($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT max(`rank`) as count FROM opp_cycle_tabs  where company_id='" . $this->arrUser['company_id'] . "'";
        $crm = $this->CSI($Sql)->FetchRow();
        //echo $mSql; exit;
        $rank = $crm['count'] + 1;

        $Sql = "INSERT INTO opp_cycle_tabs 
                SET name = '".$attr['name']."',
                    status = '".$attr['status']."',
                    `rank` = ".$rank.",
                    user_id='" . $this->arrUser['id'] . "',
                    company_id='" . $this->arrUser['company_id'] . "'";

        $RS = $this->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
        }

        return $response;
    }

    // CRM Tabs Fields Module
    //------------------------------------------------

    function get_crm_tabs_fields($attr)
    {

        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        if (!empty($attr['tab_id'])) {
            $where_clause .= " AND tab_id = '".$attr['tab_id']."' ";
        }

        $Sql = "SELECT  c.*
				FROM crm_tabs_fields c
				WHERE 1 " . $where_clause;

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'crm_tabs_fields', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['label'] = $Row['label'];
                $result['field_name'] = $Row['field_name'];
                $result['type'] = $Row['type'];
                $result['column'] = $Row['column'];
                $result['status'] = $Row['status'];
                $result['sort_id'] = $Row['sort_id'];
                $result['tab_id'] = $Row['tab_id'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            // $response['total'] = $total;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = 'No record found!';
        }
        return $response;
    }

    function get_crm_tab_field_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM crm_tabs_fields
				WHERE id='".$attr['id']."'
				LIMIT 1";
        $RS = $this->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = 'No record found!';
        }
        return $response;
    }

    function get_crm_tab_field_by_name($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT *
				FROM crm_tabs_fields
				WHERE field_name='".$attr['field_name']."' AND tab_id='".$attr['tab_id']."'
				LIMIT 1";

        $RS = $this->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'No record found!';
        }
        return $response;
    }

    function get_crm_tab_field_by_tab_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $where_clause = "AND company_id =" . $this->arrUser['company_id'] . " AND 
                             status = 'Active' AND 
                             tab_id='".$attr['tab_id']."' OR 
                             (is_default = 1 AND tab_id='".$attr['tab_id']."') ";

        $Sql = "SELECT c.*
				FROM crm_tabs_fields c
				WHERE 1 " . $where_clause;


        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'crm_tabs_fields', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'No record found!';
        }
        return $response;
    }

    function add_crm_tab_field($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "INSERT INTO crm_tabs_fields
				SET field_name = '".$attr['field_name']."',
                    `status` = '".$attr['status']."',
                    description = '".$attr['description']."',
                    tab_id = '".$attr['tab_id']."',
                    is_required = '".$attr['is_required']."',
                    is_default = '".$attr['is_default']."',
                    `column` = '".$attr['column']."',
                    `label` = '".$attr['label']."',
                    module_id = '".$attr['module_id']."',
                    `type` = '".$attr['type']."',
                    user_id='" . $this->arrUser['id'] . "',
                    company_id='" . $this->arrUser['company_id'] . "'";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
        }

        return $response;
    }

    function update_crm_tab_field($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "UPDATE crm_tabs_fields
				SET  field_name = '".$attr['field_name']."',
                     status = '".$attr['status']."',
                     description = '".$attr['description']."',
                     tab_id = '".$attr['tab_id']."',
                     is_required = '".$attr['is_required']."',
                     is_default = '".$attr['is_default']."',
                     `column` = '".$attr['column']."',
                     `label` = '".$attr['label']."',
                     module_id = '".$attr['module_id']."',
                     `type` = '".$attr['type']."'
				WHERE id = ".$attr['id'];

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }

        return $response;
    }

    function delete_crm_tab_field($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM crm_tabs_fields
				WHERE id = ".$attr['id'];

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }

        return $response;
    }

    function sort_tab_fields($arr_attr)
    {
        //echo '<pre>'; print_r($arr_attr[tab_id]);exit;
        $count = 1;
        foreach ($arr_attr['record'] as $value) {
            $Sql = "UPDATE crm_tabs_fields SET sort_id = ".$count." WHERE id =  ".$value->id." AND tab_id = ".$arr_attr['tab_id']." ";
            //echo "<hr />".$Sql;
            $RS = $this->CSI($Sql);
            $count++;
        }
        $response['ack'] = 1;
        $response['error'] = NULL;
        return $response;
    }

//---------------------------------------------//
//			HUMAN RESOURCES SECTION            //
//---------------------------------------------//
// Cause of Inactivity Module
//------------------------------------------------

    function get_cause_of_inactivity($attr)
    {
        // global $objFilters;
        // return $objFilters->get_module_listing(7, "cause_of_inactivity");

        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();


        $Sql = "SELECT   c.id, c.name, c.company_id  
                FROM  cause_of_inactivity  c
                where  c.status=1
                and c.company_id=" . $this->arrUser['company_id']; //c.user_id=".$this->arrUser['id']."

        //echo $Sql; exit;
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q'],'human_resource',sr_ViewPermission);
        $response['q'] = '';


        $response['ack'] = 1;
        $response['error'] = NULL;


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['company_id'] = $Row['company_id'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_cause_of_inactivity_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT *
				FROM cause_of_inactivity
				WHERE id='".$attr['id']."'
                and company_id = " . $this->arrUser['company_id'] . "
                LIMIT 1";
        // echo $Sql;exit;

        $RS = $this->CSI($Sql, "human_resource", sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = null;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['bucketFail'] = 1;
        }
        return $response;
    }

    function add_cause_of_inactivity($attr)
    {
        $this->objGeneral->mysql_clean($attr);


        $data_pass = "  tst.name = '".$attr['name']."'   ";
        $total = $this->objGeneral->count_duplicate_in_sql('cause_of_inactivity', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            $response['duplicate'] = 1;
            return $response;
            exit;
        }


        $Sql = "INSERT INTO cause_of_inactivity
				SET name = '".$attr['name']."',
                    user_id='" . $this->arrUser['id'] . "',
                    status='1',
                    company_id='" . $this->arrUser['company_id'] . "'";

        $RS = $this->CSI($Sql);
        $response['id'] = $this->Conn->Insert_ID();
        // $response = $this->objGeneral->run_query_exception($Sql);
        // return $response;


        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['error'] = 'Record Inserted Successfully';

        return $response;
    }

    function update_cause_of_inactivity($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "    tst.name='" . $attr['name'] . "'".$where_id;
        $total = $this->objGeneral->count_duplicate_in_sql('cause_of_inactivity', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }


        $Sql = "UPDATE cause_of_inactivity
				SET name = '".$attr['name']."'
				WHERE id = ".$attr['id'];

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }

        return $response;
    }

    function delete_cause_of_inactivity($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        // $Sql = "DELETE FROM cause_of_inactivity
        //         WHERE id = ".$attr['id']." ";
                
        $Sql = "UPDATE cause_of_inactivity
				SET status = 0
				WHERE id = ".$attr['id']." AND 
                      SR_CheckTransactionBeforeDelete(".$attr['id'].", ".$this->arrUser['company_id'].", 28,0) = 'success'";

        // echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 2;
            $response['error'] = 'Record cannot be deleted.';
        }

        return $response;
    }

    // Departments Module
    //------------------------------------------------

    function get_department($attr)
    {
        // global $objFilters;
        // return $objFilters->get_module_listing(11, "departments");

        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();


        $Sql = "SELECT   c.*  
                FROM  departments  c
                where  c.status=1 and c.company_id=" . $this->arrUser['company_id']; 

        //c.user_id=".$this->arrUser['id']."

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';


        $response['ack'] = 1;
        $response['error'] = NULL;


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['phone'] = $Row['phone'];
                $result['fax'] = $Row['fax'];
                $result['email'] = $Row['email'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_department_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM departments
				WHERE id='".$attr['id']."'
				LIMIT 1";
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = null;
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_department($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $data_pass = "  tst.name = '".$attr['name']."'   ";
        $total = $this->objGeneral->count_duplicate_in_sql('departments', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }


        $Sql = "INSERT INTO config_departments
				    SET name = '".$attr['name']."',
                        phone = '".$attr['phone']."',
                        fax = '".$attr['fax']."',
                        email = '".$attr['email']."',
                        user_id='" . $this->arrUser['id'] . "',
                        company_id='" . $this->arrUser['company_id'] . "'";


        $RS = $this->CSI($Sql);
        $response['id'] = $this->Conn->Insert_ID();
        // $response = $this->objGeneral->run_query_exception($Sql);
        // return $response;


        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['error'] = 'Record Inserted Successfully';

        return $response;
    }

    function update_department($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "  tst.name = '".$attr['name']."'   ";
        $total = $this->objGeneral->count_duplicate_in_sql('departments', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }


        $Sql = "UPDATE departments
				SET name = '".$attr['name']."',
                    phone = '".$attr['phone']."',
                    fax = '".$attr['fax']."',
                    email = '".$attr['email']."'
				WHERE id = ".$attr['id']." ";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }

        return $response;
    }

    function delete_department($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM departments
				WHERE id = ".$attr['id']." ";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }

        return $response;
    }

    // Job Title Module
    //------------------------------------------------

    function get_job_title($attr)
    {
        //global $objFilters;
        //return $objFilters->get_module_listing(99, "job_title", '', '', '', '', 'title');
        //$this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        if (!empty($attr['type']))
            $where_clause = "and c.type= '".$attr['type']."' ";

        $Sql = "SELECT   c.* ,  CASE WHEN type = 1 THEN 'HR' WHEN type = 2 THEN 'Opp_cycle' End  as tname   
                FROM job_title c  
                left JOIN company on company.id=c.company_id 
                where  c.status=1  AND 
                    (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")  " . $where_clause . "  ";


        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);

        $RS = $this->CSI($response['q'], 'sales_crm', sr_ViewPermission);
        $response['q'] = '';


        $response = array();

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['title'] = $Row['title'];
                //  $result['type'] = $Row['tname'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        return $response;
    }

    function get_job_title_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT *
				FROM job_title
				WHERE id='".$attr['id']."'
				LIMIT 1";
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = null;
            $response['ack'] = 1;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_job_title($attr)
    {
        $this->objGeneral->mysql_clean($attr);


        $data_pass = "  tst.title = '".$attr['title']."'  and tst.type= '".$attr['types']."'   ";
        $total = $this->objGeneral->count_duplicate_in_sql('job_title', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }
        $Sql = "INSERT INTO job_title
				        SET title = '".$attr['title']."',
                            level = '".$attr['level']."',
                            user_id = '" . $this->arrUser['id'] . "',
                            company_id = '" . $this->arrUser['company_id'] . "',
                            type = '".$attr['types']."',
                            status = 1 ";

        $RS = $this->CSI($Sql);
        $response['id'] = $this->Conn->Insert_ID();


        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['error'] = 'Record Inserted Successfully';

        return $response;
    }

    function update_job_title($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "  tst.title = '".$attr['title']."'  and tst.type= '".$attr['types']."'".$where_id;
        $total = $this->objGeneral->count_duplicate_in_sql('job_title', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }


        $Sql = "UPDATE job_title 
                        SET title = '".$attr['title']."',
                            level = '".$attr['level']."',
                            type = '".$attr['types']."',
                            status = '".$attr['statuss']."'
                        WHERE id = '".$attr['id']."'  
                        Limit 1 ";


        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }

        return $response;
    }

    function delete_job_title($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "Update job_title Set status=0
				WHERE id = ".$attr['id']." AND 
                      SR_CheckTransactionBeforeDelete(".$attr['id'].", ".$this->arrUser['company_id'].", 32,0) = 'success' ";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }

        return $response;
    }

    // Job Title Module
    //------------------------------------------------
        //    department category
    //------------------------------------------------

    function get_depart_category($attr)
    {
        //global $objFilters;
        //return $objFilters->get_module_listing(99, "job_title", '', '', '', '', 'title');

        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        //print_r($attr);
        if ($attr['type'] > 0)
            $where_clause = "and type= '".$attr['type']."' ";

        $Sql = "SELECT   c.*  FROM department_category c   where  c.status=1     	  " . $where_clause . "  ";


        //        $Sql = "SELECT   c.*    FROM department_category c  left JOIN company on company.id=c.company_id where  c.status=1  AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	  " . $where_clause . "  ";
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        $response = array();
        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['title'] = $Row['title'];

                $response['response'][] = $result;
            }
        } else
            $response['response'][] = array();

        return $response;
    }

    function get_depart_category_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT * FROM department_category WHERE id='".$attr['id']."' LIMIT 1";
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = null;
            $response['ack'] = 1;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_depart_category($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $data_pass = "  tst.title = '".$attr['title']."'      ";
        $total = $this->objGeneral->count_duplicate_in_sql('department_category', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }

        $Sql = "INSERT INTO department_category 
                            SET title = '".$attr['title']."',
                                description = '".$attr['level']."',
                                user_id='" . $this->arrUser['id'] . "',
                                company_id='" . $this->arrUser['company_id'] . "',
                                status=1 ";

        $RS = $this->CSI($Sql);
        $response['id'] = $this->Conn->Insert_ID();


        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['error'] = 'Record Inserted Successfully';

        return $response;
    }

    function update_depart_category($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "  tst.title = '".$attr['title']."'   ".$where_id." ";
        $total = $this->objGeneral->count_duplicate_in_sql('department_category', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }


        $Sql = "UPDATE department_category 
                            SET title = '".$attr['title']."',
                                description = '".$attr['level']."',
                                status= '".$attr['statuss']."'  
                            WHERE id = '".$attr['id']."'  
                            Limit 1 ";
        //echo  $Sql;exit;

        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }

        return $response;
    }

    function delete_depart_category($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "Update  department_category Set status=0 WHERE id = ".$attr['id'];

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }

        return $response;
    }

    //    department category
//------------------------------------------------


    function get_process_of_decision($attr)
    {
        /* global $objFilters;
          return $objFilters->get_module_listing(99, "job_title"); */

        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();


        $Sql = "SELECT   c.*  
                FROM  process_of_decision  c
                WHERE   c.status=1 AND 
                        c.company_id=" . $this->arrUser['company_id']; 
        
        //c.user_id=".$this->arrUser['id']."


        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        
        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q'], 'sales_crm', sr_ViewPermission);
        $response['q'] = '';


        $response['ack'] = 1;
        $response['error'] = NULL;


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                // $result['description'] = $Row['description'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_process_of_decision_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM process_of_decision
				WHERE id='".$attr['id']."'
				LIMIT 1";
        $RS = $this->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = null;
            $response['ack'] = 1;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_process_of_decision($attr)
    {
        $this->objGeneral->mysql_clean($attr);


        $data_pass = "  tst.name = '".$attr['name']."'   ";
        $total = $this->objGeneral->count_duplicate_in_sql('process_of_decision', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }

        $Sql = "INSERT INTO process_of_decision
                        SET name = '".$attr['name']."',
                            description = '".$attr['description']."',
                            user_id='" . $this->arrUser['id'] . "',
                            company_id='" . $this->arrUser['company_id'] . "'";

        $RS = $this->CSI($Sql);
        $response['id'] = $this->Conn->Insert_ID();
        // $response = $this->objGeneral->run_query_exception($Sql);
        // return $response;


        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['error'] = 'Record Inserted Successfully';

        return $response;
    }

    function update_process_of_decision($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "  tst.name = '".$attr['name']."'   ";
        $total = $this->objGeneral->count_duplicate_in_sql('process_of_decision', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }
        $Sql = "UPDATE process_of_decision
				SET name = '".$attr['name']."',
                    description = '".$attr['description']."'
				WHERE id = ".$attr['id']." ";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }

        return $response;
    }

    function delete_process_of_decision($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM process_of_decision
				WHERE id = ".$attr['id']." ";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }

        return $response;
    }

// Country Module
//----------------------------------------------------
    function get_countries($attr)
    {
        //  $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = "";

        $response = array();
        /*  $Sql = "SELECT   c.id, LCASE(c.name) as n, c.iso ,c.country_account_type FROM  country  c
          left JOIN company on company.id=c.company_id
          where  c.status=1 and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
          group  by  c.name ASC "; */
        // $conn = mysqli_connect(DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME);

        $Sql = "SELECT  c.id, LCASE(c.name) as n, c.iso ,c.country_account_type FROM  country  c where  c.status=1    order by c.name ASC limit 500";
        $RS = $this->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = ucwords($Row['n']);
                $result['code'] = $Row['iso'];
                $result['country_account_type'] = $Row['country_account_type'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;

        } else  $response['response'][] = array();

        return $response;
    }

    function get_country_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM country
				WHERE id='".$attr['id']."'
				LIMIT 1";

        $RS = $this->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_country($attr)
    {
        $this->objGeneral->mysql_clean($attr);


        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "  tst.name = '".$attr['name']."'   ";
        $total = $this->objGeneral->count_duplicate_in_sql('country', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }


        $Sql = "INSERT INTO country
		                SET status=1,
                            name='".$attr['name']."',
                            user_id='" . $this->arrUser['id'] . "',
                            company_id='" . $this->arrUser['company_id'] . "'";

        $RS = $this->CSI($Sql);
        $response['id'] = $this->Conn->Insert_ID();
        // $response = $this->objGeneral->run_query_exception($Sql);
        // return $response;


        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['error'] = 'Record Inserted Successfully';

        return $response;
    }

    function update_country($attr)
    {
        $this->objGeneral->mysql_clean($attr);


        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "  tst.name = '".$attr['name']."'   ";
        $total = $this->objGeneral->count_duplicate_in_sql('country', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }
        $Sql = "UPDATE country
				SET name = '".$attr['name']."'
				WHERE id = ".$attr['id']." ";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }

        return $response;
    }

    function delete_country($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM country
				WHERE id = ".$attr['id']." ";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }

        return $response;
    }

// Modules Filters Module
//----------------------------------------------------
    function get_modules_filters($attr)
    {
        // global $objFilters;
        //return $objFilters->get_module_listing(75, "filter");

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        if (!empty($attr['module_id']))
            $where_clause .= " AND module_codes_id = " . $attr['module_id'];


        $Sql = "SELECT filter.*,ref_module_code.module_title as module_name
		  ,CONCAT(employees.first_name,' ',employees.last_name) as emp_name
          FROM filter
          LEFT JOIN ref_module_code ON ref_module_code.id = filter.module_codes_id
          LEFT JOIN employees ON employees.id = filter.created_by
          WHERE 1
          " . $where_clause . "
          ";


        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'filter', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        $response['ack'] = 1;
        $response['error'] = NULL;


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_module_filter_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM filter
				WHERE id='".$attr['id']."' limit 1";

        $RS = $this->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['module_codes_id'] = $Row['module_codes_id'];
                $result['name'] = $Row['name'];
                $result['is_default'] = $Row['is_default'];
                $result['is_public'] = $Row['is_public'];
                $response['response'] = $result;
            }
        } else {
            $response['ack'] = 1;
            $response['error'] = 'No record found!';
            $response['response'][] = array();
        }
        return $response;
    }

    function get_fields_by_module_code_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT id, description
				FROM field
				WHERE module_codes_id ='".$attr['module_id']."'
				 limit 1";
        //echo $Sql; exit;
        $RS = $this->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['description'] = $Row['description'];
                $response['response'][$Row['id']] = $result;
            }
        } else {
            $response['ack'] = 0;
            $response['error'] = 'No record found!';
            $response['response'] = null;
        }
        return $response;
    }

    function add_module_filter($attr)
    {
        return; // removing table filter_details from db as it is not being used
        $this->objGeneral->mysql_clean($attr);

        $Sql = "INSERT INTO filter
				SET name = '".$attr['name']."',fields = '$attr[fields]',module_codes_id = '$attr[module_codes_id]',is_default = '$attr[is_default]',is_public = '$attr[is_public]',created_by='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        $arrFields = explode(',', $attr[fields]);
        foreach ($arrFields as $key => $value) {
            $SqlDetail = "INSERT INTO filter_details
					SET filter_id = '" . $id . "',field_id = '" . $value . "',sequence = '" . $key . "'";
            $RS = $this->CSI($SqlDetail);
        }

        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
        }

        return $response;
    }

    function add_filter_details($attr)
    {
        return; // removing table filter_details from db as it is not being used
        $this->objGeneral->mysql_clean($attr);

        $Sql = "INSERT INTO filter_details
					SET filter_id = '$attr[filter_id]',field_id = '$attr[field_id]',sequence = '$attr[sequence]'";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
        }

        return $response;
    }

    function update_module_filter($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "UPDATE filter
				SET name = '".$attr['name']."',
                    is_default = '".$attr['is_default']."',
                    fields = '".$attr['fields']."',
                    is_public = '".$attr['is_public']."'
				WHERE id = ".$attr['id']." ";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be updated';
        }

        return $response;
    }

    function delete_module_filter($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM filter
				WHERE id = ".$attr['id']." ";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }

        return $response;
    }

    function get_filter_details($attr)
    {
        return; // removing table filter_details from db as it is not being used
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT c.field_id
				FROM filter_details c
				WHERE filter_id ='$attr[filter_id]'
				";

        $order = "ORDER BY sequence ASC";
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['field_id'] = $Row['field_id'];
                $response['response'][] = $result;
            }
        } else {
            $response['ack'] = 0;
            $response['error'] = 'No record found!';
            $response['response'] = null;
        }
        return $response;
    }

    function delete_filter_details($attr)
    {
        return; // removing table filter_details from db as it is not being used
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM filter_details
				WHERE filter_id = ".$attr['id'];

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted';
        }

        return $response;
    }

//////////////////////////////////////////////////////////

    function get_customer_dropdown($attr)
    {
        $where_site_constant['company_id'] = $this->arrUser['company_id'];
        $arrCustomerPostingType = array();
        $response = array();

        if ($posting_setup_type[GENERAL_POSTING] == $posting_type) {
            $where_site_constant['site_constants.type'] = GEN_BUS_POSTING_GROUP; // business posting constant
            $arrCustomerPostingType = $this->_get_constants_for_dropdown($where_site_constant);
            $dropdowntitle = "General Business Posting";
        } else if ($posting_type == $posting_setup_type[VAT_POSTING]) {
            $where_site_constant['site_constants.type'] = VAT_BUS_POSTING_GROUP; // vat posting constant
            $arrCustomerPostingType = $this->_get_constants_for_dropdown($where_site_constant);
            $dropdowntitle = "VAT Business Posting";
        } else if ($posting_type == $posting_setup_type[CUSTOMER_POSTING]) {
            $where_site_constant['site_constants.type'] = CUST_POSTING_GROUP; // customer posting constant
            $arrCustomerPostingType = $this->_get_constants_for_dropdown($where_site_constant);
            $dropdowntitle = "Customer Posting";
        } else if ($posting_type == $posting_setup_type[SUPPLIER_POSTING]) {
            $where_site_constant['site_constants.type'] = SUPP_POSTING_GROUP; // customer posting constant
            $arrCustomerPostingType = $this->_get_constants_for_dropdown($where_site_constant);
            $dropdowntitle = "Supplier Posting";
        }
        $response['dropdowntitle'] = $dropdowntitle;
        $response['arrCustomerPostingType'] = $arrCustomerPostingType;

        return $response;
    }

    function get_product_dropdown()
    {
        $posting_type = $attr['type'];
        $where_site_constant['company_id'] = $this->arrUser['company_id'];
        $response = array();
        $arrProductPostingType = array();
        if ($posting_type == $posting_setup_type[GENERAL_POSTING]) {
            $where_site_constant['site_constants.type'] = GEN_PRODUCT_POSTING_GROUP; // general product posting constant
            $arrProductPostingType = $this->_get_constants_for_dropdown($where_site_constant);
            $dropdowntitle = "General Product Posting";
        } else if ($posting_type == $posting_setup_type[VAT_POSTING]) {
            $where_site_constant['site_constants.type'] = VAT_PRODUCT_POSTING_GROUP; // vat product posting constant
            $arrProductPostingType = $this->_get_constants_for_dropdown($where_site_constant);
            $dropdowntitle = "VAT Product Posting";
        }
        $response['dropdowntitle'] = $dropdowntitle;
        $response['arrProductPostingType'] = $arrProductPostingType;

        return $response;
    }

    function _get_constants_for_dropdown($arr_col)
    {
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        foreach ($arr_col as $key => $value) {
            $where_clause .= " AND $key = $value";
        }

        $result = array();

        $Sql = "SELECT c.id, c.title
				FROM site_constants c
				WHERE 1
				" . $where_clause . "
				 ";


        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result[$Row['id']] = $Row['title'];
            }
        }
        return $result;
    }

    function create_product_tabs_fields($company_id, $user_id)
    {

        $Product_tabs_array = unserialize(PRODUCT_ARRAY);

        if (isset($Product_tabs_array) && !empty($Product_tabs_array)) {
            foreach ($Product_tabs_array as $key => $val) {

                $Sql = "INSERT INTO products_tabs
					SET
						name='" . $key . "',
						status='1',
						company_id='" . $company_id . "',
						user_id='" . $user_id . "'";
                $RS = $this->CSI($Sql);
                $tab_id = $this->Conn->Insert_ID();

                $Sql = "UPDATE products_tabs SET sort_id='" . $tab_id . "' WHERE id =" . $tab_id . " limit 1";
                $RS = $this->CSI($Sql);

                foreach ($val as $keys => $vals) {
                    $SqlColums = "INSERT INTO products_columns
						SET
							name='" . $vals . "',
							description='" . $vals . "',
							status='1',
							tab_id='" . $tab_id . "',
							company_id='" . $company_id . "',
							user_id='" . $user_id . "',
							product_type='" . $keys . "',
							sort_id='0'";
                    $RSColumns = $this->CSI($SqlColums);
                    $field_id = $this->Conn->Insert_ID();

                    $Sql = "UPDATE products_columns SET sort_id='" . $field_id . "' WHERE id =" . $field_id;
                    $RS = $this->CSI($Sql);
                }
            }
        }
    }

    function create_hr_tabs_fields($company_id, $user_id)
    {
        return; // removing table employee_tabs from db as it is not being used
        $HR_tabs_array = unserialize(HR_ARRAY);


        if (isset($HR_tabs_array) && !empty($HR_tabs_array)) {
            foreach ($HR_tabs_array as $key => $val) {

                $Sql = "INSERT INTO employee_tabs
					SET
						name='" . $key . "',
						status='1',
						company_id='" . $company_id . "',
						user_id='" . $user_id . "'";


                $RS = $this->CSI($Sql);
                $tab_id = $this->Conn->Insert_ID();

                $Sql = "UPDATE employee_tabs SET sort_id='" . $tab_id . "' WHERE id =" . $tab_id . " Limit 1";
                $RS = $this->CSI($Sql);


                foreach ($val as $keys => $vals) {
                    // print_r($keys);exit;


                    $SqlColums = "INSERT INTO employee_columns
							SET
							name='" . $vals['name'] . "',
							description='" . $vals['name'] . "',
							status='1',
							tab_id='" . $tab_id . "',
							company_id='" . $company_id . "',
							user_id='" . $user_id . "',
							employee_type='" . $keys . "',
							sort_id='0',
							display_label='" . $vals['display_label'] . "',
							display_type='" . $vals['display_type'] . "',
							display_require='" . $vals['display_require'] . "' ";

                    $RSColumns = $this->CSI($SqlColums);
                    $field_id = $this->Conn->Insert_ID();

                    $Sql = "UPDATE employee_columns SET sort_id='" . $field_id . "',
					name='" . $vals['name'] . "',
					display_label='" . $vals['display_label'] . "',
					display_type='" . $vals['display_type'] . "',
					display_require='" . $vals['display_require'] . "'
					 WHERE id =" . $field_id . " Limit 1";
                    $RS = $this->CSI($Sql);
                }
            }
        }

        //print_r($HR_tabs_array); exit;
    }

    function get_fill_combo($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = "";
        $where_clause = "";
        $where_clause2 = "";
        //$where_clause = "AND company_id =".$this->arrUser['company_id'];


        if (!empty($attr['keyword'])) {
            $where_clause .= " AND name LIKE '%$attr[keyword]%' ";
        }

        if (!empty($attr['module_id'])) {
            $where_clause .= " AND id = '$attr[module_id]'";
        }

        if (empty($attr['all'])) {
            if (empty($attr['start']))
                $attr['start'] = 0;
            if (empty($attr['limit']))
                $attr['limit'] = 10;
            $limit_clause = " LIMIT $attr[start] , $attr[limit]";
        }
        $response = array();

        $ModuleSql = "SELECT id,table,module_condition
				FROM module_codes
				WHERE 1
				" . $where_clause . "
				ORDER BY id ASC";

        //echo $ModuleSql.'<hr>'; //exit;
        $mRS = $this->CSI($ModuleSql)->FetchRow();

        if (!empty($mRS['module_condition'])) {
            $where_clause2 .= " AND $mRS[module_condition]";
        }

        $Sql = "SELECT id,name
				FROM ".$mRS['table']."
				WHERE 1
				" . $where_clause2 . "
				ORDER BY id ASC";
        //echo $Sql.'<hr>'; exit;
        $RS = $this->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = 'No record found!';
        }
        return $response;
    }

    function setCondtionArray($condition)
    {
        $where = array();
        if (isset($condition) && !empty($condition)) {
            $arr_cond = explode('@', $condition);

            if (count($arr_cond) > 1 && $arr_cond[0]) {
                foreach ($arr_cond as $cond) {
                    list($col, $val) = explode('*', $cond);
                    $where[][$col] = $val;
                }
            } else {
                list($col, $val) = explode('*', $condition);
                $where[][$col] = $val;
            }
        }

        return $where;
    }

// Purchase Offer Volume Module
//--------------------------------------

    function get_purchase_offer_volume($attr)
    {
        //global $objFilters;
        //	return $objFilters->get_module_listing(106, "purchase_offer_volume");

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = $order_type = "";
        $response = array();


        $Sql = "SELECT purchase_offer_volume.id, purchase_offer_volume.name,  purchase_offer_volume.status
			,purchase_offer_volume.type ,purchase_offer_volume.description
			FROM purchase_offer_volume
			left  JOIN company on company.id=purchase_offer_volume.company_id
			where purchase_offer_volume.status=1 and ( purchase_offer_volume.company_id=" . $this->arrUser['company_id'] . "
			or  company.parent_id=" . $this->arrUser['company_id'] . ")
			 ";


        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'purchase_offer_volume', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                //	$result['name'] = $Row['name'];
                //	$result['type'] = $Row['type'];
                $result['description'] = $Row['description'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            //$response['total'] = $total;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function get_purchase_offer_volume_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM purchase_offer_volume
				WHERE id='".$attr['id']."'
				LIMIT 1";
        $RS = $this->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function get_purchase_offer_volume_by_type($attr)
    {
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT c.*
				FROM purchase_offer_volume c
				WHERE type='".$attr['type']."' AND company_id =" . $this->arrUser['company_id'];


        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['description'] = $Row['description'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_purchase_offer_volume($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);


        $data_pass = " `tst.type`='".$arr_attr['type']."',  `tst.name`='".$arr_attr['name']."'  ";
        $total = $this->objGeneral->count_duplicate_in_sql('purchase_offer_volume', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }


        $Sql = "INSERT INTO purchase_offer_volume
		SET status=1,`type`='".$arr_attr['type']."',  `name`='".$arr_attr['name']."',`description`='".$arr_attr['description']."',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";

        // echo $Sql; exit;
        $RS = $this->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['Update'] = 0;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
            $response['Update'] = 0;
        }

        return $response;
    }

    function update_purchase_offer_volume($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);


        if ($arr_attr['id'] > 0)
            $where_id = " AND tst.id <> '".$arr_attr['id']."' ";

        $data_pass = " `tst.type`='".$arr_attr['type']."',  `tst.name`='".$arr_attr['name']."'  ";
        $total = $this->objGeneral->count_duplicate_in_sql('purchase_offer_volume', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }

        $Sql = "UPDATE purchase_offer_volume
				SET type='".$arr_attr['type']."',name='".$arr_attr['name']."',description='".$arr_attr['description']."'
				WHERE id = ".$arr_attr['id']." ";

        // echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['Update'] = 1;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated!';
            $response['Update'] = 0;
        }

        return $response;
    }

    function delete_purchase_offer_volume($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "UPDATE purchase_offer_volume
			                        SET status=0
			    WHERE id = ".$arr_attr['id']." 
                Limit 1";

        /* $Sql = "DELETE FROM purchase_offer_volume
          WHERE id = ".$arr_attr['id']." ";
         */
        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated!';
        }

        return $response;
    }

    function all_customer_product_type($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $response = array();

        $Sql = "SELECT id, title
				FROM customer_product_type
				ORDER BY id ASC";

        $RS = $this->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['title'] = $Row['title'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

// CRM BUYING GROUP Module
//--------------------------------------------------------------------
    function get_buying_group_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $Sql = "SELECT   c.*  
                FROM  crm_buying_group  c
                where   c.status=1 and 
                        c.crm_buying_group_type=1 and 
                        c.company_id=" . $this->arrUser['company_id'] . " 
                ORDER BY c.title";


        // $total_limit = pagination_limit;

        
        // if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
        //     $total_limit = $attr['pagination_limits'];

        // $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        // //echo $response['q'];exit;
        // $RS = $this->CSI($response['q']);

        $RS = $this->CSI($Sql);
        // $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['title'] = $Row['title'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function get_selling_group_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $Sql = "SELECT   c.*  
                FROM  crm_buying_group  c
                where  c.status=1 and 
                       c.crm_buying_group_type=2 and 
                       c.company_id=" . $this->arrUser['company_id'];


        $total_limit = pagination_limit;
        $order_type = ' ORDER BY c.title ';
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['title'] = $Row['title'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function get_crm_shipment_method_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $response = array();
        $limit_clause = $where_clause = "";

        $Sql = "SELECT   c.* 
                FROM  shipment_methods  c
                where   c.status=1 and 
                        c.shipment_type=1 and 
                        c.company_id=" . $this->arrUser['company_id'];


        $total_limit = pagination_limit;
        $order_by = ' ORDER BY c.name ';
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_by);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            //echo $Sql;die();
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['code'] = $Row['code'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        //print_r($response);die();
        return $response;
    }
    function get_srm_shipment_method_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $response = array();
        $limit_clause = $where_clause = "";

        $Sql = "SELECT   c.* 
                FROM  shipment_methods  c
                where c.status=1 and 
                      c.shipment_type=2 and 
                      c.company_id=" . $this->arrUser['company_id'];

        $total_limit = pagination_limit;
        $order_by = ' ORDER BY c.name ';
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_by);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['code'] = $Row['code'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_buying_group($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        $data_pass = "  `tst.title`='".$arr_attr['title']."'  ";
        $total = $this->objGeneral->count_duplicate_in_sql('crm_buying_group', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO crm_buying_group
		                                SET 
                                            status=1,
                                            title='".$arr_attr['title']."',
                                            description='".$arr_attr['description']."',
                                            user_id='" . $this->arrUser['id'] . "',
                                            company_id='" . $this->arrUser['company_id'] . "'";


                                            // echo $Sql;exit;
        $RS = $this->CSI($Sql);
        $response['id'] = $this->Conn->Insert_ID();
        // $response = $this->objGeneral->run_query_exception($Sql);
        // return $response;

        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['error'] = 'Record Inserted Successfully';
        return $response;
    }

    // CRM REGION Module
    //--------------------------------------------------------------------
    function get_region_list($attr, $isAllowed=null)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $response = array();

        if ($isAllowed){
            $orderChk = ' ORDER BY c.title ';
        }
        else{
            $orderChk = ' ';
        }

        $view = ($attr['type'] && $attr['type'] == '3') ? 'sr_srm_region_sel' : 'sr_crm_region_sel';

        $Sql = "SELECT   c.id, c.title, c.status
                FROM  ".$view."  c
                where  c.status=1 and
                       c.company_id=" . $this->arrUser['company_id'] . " ".$orderChk;
                      //c.user_id=".$this->arrUser['id']."
        
        //defualt Variable
        $total_limit = 1000;//pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $order_by = ' ORDER BY c.title ';

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c',$order_by);
        // echo $response['q'];exit;

        if ($isAllowed){
            $RS = $this->CSI($Sql);
        }
        else{
            $RS = $this->CSI($response['q'], 'sales_crm', sr_ViewPermission);
        }
        
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['title'] = $Row['title'];
                /*if ($Row['status'] == 1)
                    $result['status'] = "Active";
                elseif ($Row['status'] == 2)
                    $result['status'] = "InActive";
                elseif ($Row['status'] == 0)
                    $result['status'] = "Delete";*/
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }
    

    function add_region($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        // 
        $data_pass = "  tst.title='".$arr_attr['title']."' AND tst.region_type=".$arr_attr['region_type']." ";
        $total = $this->objGeneral->count_duplicate_in_sql('crm_region', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO crm_region
		                            SET 
                                        status=1,
                                        title='".$arr_attr['title']."',
                                        region_type='".$arr_attr['region_type']."',
                                        description='".$arr_attr['description']."',
                                        user_id='" . $this->arrUser['id'] . "',
                                        company_id='" . $this->arrUser['company_id'] . "'";

        $RS = $this->CSI($Sql);
        $response['id'] = $this->Conn->Insert_ID();
        // $response = $this->objGeneral->run_query_exception($Sql);
        // return $response;
        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['error'] = 'Record Inserted Successfully';
        return $response;
    }

    // CRM SEGMENT Module
    //--------------------------------------------------------------------
    function get_segment_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $response = array();
        $limit_clause = $where_clause = "";

        $Sql = "SELECT c.id, c.title  
                FROM  crm_segment  c
                where  c.status=1 and 
                       c.segment_type=1 and 
                       c.company_id=" . $this->arrUser['company_id'] . " 
                ORDER BY c.title"; 
        //c.user_id=".$this->arrUser['id']."

        //defualt Variable
        // $total_limit = pagination_limit;
        
        // if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
        //     $total_limit = $attr['pagination_limits'];

        // $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c');
        //  echo $response['q'];exit;
        // $RS = $this->CSI($response['q']);
        $RS = $this->CSI($Sql);
        // $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['title'] = $Row['title'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else   
            $response['response'][] = array();

        // print_r($response);exit;
        return $response;
    }

    function get_srmsegment_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $response = array();
        $limit_clause = $where_clause = "";

        $Sql = "SELECT   c.id, c.title  
                FROM  crm_segment  c
                where  c.status=1 and 
                       c.segment_type=2 and 
                       c.company_id=" . $this->arrUser['company_id']; //c.user_id=".$this->arrUser['id']."

        //defualt Variable
        $total_limit = pagination_limit;
        $order_by = ' ORDER BY c.title ';
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c',$order_by);
        //  echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['title'] = $Row['title'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else   
            $response['response'][] = array();
        // print_r($response);exit;
        return $response;
    }

    function add_segment($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        $data_pass = " tst.title='".$arr_attr['title']."' ";
        $total = $this->objGeneral->count_duplicate_in_sql('crm_segment', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO crm_segment
		                            SET 
                                        status=1,
                                        title='".$arr_attr['title']."',
                                        description='".$arr_attr['description']."',
                                        user_id='" . $this->arrUser['id'] . "',
                                        company_id='" . $this->arrUser['company_id'] . "'";

        $RS = $this->CSI($Sql);
        $response['id'] = $this->Conn->Insert_ID();
        // $response = $this->objGeneral->run_query_exception($Sql);
        // return $response;
        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['error'] = 'Record Inserted Successfully';
        return $response;
    }

    // CRM OFFER METHOD Module
    //--------------------------------------------------------------------
    function get_offer_method_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $response = array();
        $order_type = "";

        $Sql = "SELECT c.id, c.title  
                FROM   crm_offer_method  c
                where c.status=1 and 
                      c.company_id=" . $this->arrUser['company_id'] . " ";
        //echo	$Sql;exit;

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';
        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['title'] = $Row['title'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_offer_method($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        $data_pass = " tst.title='".$arr_attr['title']."'  ";
        $total = $this->objGeneral->count_duplicate_in_sql('crm_offer_method', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO crm_offer_method
		                                SET 
                                            status=1,
                                            title='".$arr_attr['title']."',
                                            description='".$arr_attr['description']."',
                                            user_id='" . $this->arrUser['id'] . "',
                                            company_id='" . $this->arrUser['company_id'] . "'";
        //echo $Sql; exit;
        $RS = $this->CSI($Sql);
        $response['id'] = $this->Conn->Insert_ID();
        // $response = $this->objGeneral->run_query_exception($Sql);
        // return $response;
        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['error'] = 'Record Inserted Successfully';
        return $response;
    }

    // Pricing Strategy   //
    function add_pricing_strategy($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        $ERows1 = -1;
        if (isset($arr_attr['strategy1']) && $arr_attr['strategy1']) {
            $Sql = "SELECT ss.* FROM ref_selected_strategy ss
                INNER JOIN company ON company.id = ss.company_id
                WHERE ss.type=1 AND ss.user_id='" . $this->arrUser['id'] . "' AND ss.company_id='" . $this->arrUser['company_id'] . "' ORDER BY ss.id ASC";

            $RS = $this->CSI($Sql);

            if ($RS->RecordCount() > 0) {
                $selectedType = "";
                $nonSelectedType = "";
                while ($Row = $RS->FetchRow()) {
                    if ($Row['strategy_id'] == $arr_attr['strategy1']) {
                        $selectedType = $Row['id'];
                    } else {
                        if ($nonSelectedType == "") {
                            $nonSelectedType = "id=" . $Row['id'];
                        } else {
                            $nonSelectedType .= " OR id=" . $Row['id'];
                        }
                    }
                }
                if ($selectedType != "") {
                    $Sql = "UPDATE ref_selected_strategy SET status=1 WHERE id=$selectedType";
                    $RS = $this->CSI($Sql);
                    if ($this->Conn->Affected_Rows() > 0) {
                        $ERows1 = 1;
//                        $response['ack'] = 1;
//                        $response['error'] = NULL;
                    } else {
//                        $response['ack'] = 0;
//                        $response['error'] = 'Record not updated!';
                    }
                } else {
                    $ERows1 = 0;
                }
            } else {
                $ERows1 = 0;
            }

            if ($ERows1 == 0) {
                $Sql = "INSERT INTO ref_selected_strategy (strategy_id, type, status, company_id, user_id, date_created) VALUES ('" . $arr_attr['strategy1'] . "', 1, 1, '" . $this->arrUser['company_id'] . "', '" . $this->arrUser['id'] . "', NOW())";
                $RS = $this->CSI($Sql);
                $id = $this->Conn->Insert_ID();
                if ($id > 0) {
                    $ERows1 = 2;
//                    $response['ack'] = 1;
//                    $response['error'] = NULL;
//                    $response['Update'] = 0;
//                    $response['id'] = $id;
                } else {
                    $ERows1 = 0;
//                    $response['ack'] = 0;
//                    $response['error'] = 'Record already exist.';
//                    $response['Update'] = 0;
                }
            }
            if ($nonSelectedType != "") {
                $Sql = "UPDATE ref_selected_strategy SET status=0 WHERE $nonSelectedType";
                $RS = $this->CSI($Sql);
                if ($this->Conn->Affected_Rows() > 0) {
//                    $response['ack'] = 1;
//                    $response['error'] = NULL;
                } else {
//                    $response['ack'] = 0;
//                    $response['error'] = 'Record not updated!';
                }
            }
        }
        $ERows2 = -1;
        if (isset($arr_attr['strategy2']) && $arr_attr['strategy2']) {
            $Sql = "SELECT ss.* FROM ref_selected_strategy ss
                INNER JOIN company ON company.id = ss.company_id
                WHERE ss.type=2 AND ss.user_id='" . $this->arrUser['id'] . "' AND ss.company_id='" . $this->arrUser['company_id'] . "' ORDER BY ss.id ASC";

            $RS = $this->CSI($Sql);


            if ($RS->RecordCount() > 0) {
                $selectedType = "";
                $nonSelectedType = "";
                while ($Row = $RS->FetchRow()) {
                    if ($Row['strategy_id'] == $arr_attr['strategy2']) {
                        $selectedType = $Row['id'];
                    } else {
                        if ($nonSelectedType == "") {
                            $nonSelectedType = "id=" . $Row['id'];
                        } else {
                            $nonSelectedType .= " OR id=" . $Row['id'];
                        }
                    }
                }
                if ($selectedType != "") {
                    $Sql = "UPDATE ref_selected_strategy SET status=1 WHERE id=$selectedType";
                    $RS = $this->CSI($Sql);
                    if ($this->Conn->Affected_Rows() > 0) {
                        $ERows2 = 1;
//                        $response['ack'] = 1;
//                        $response['error'] = NULL;
                    } else {
//                        $response['ack'] = 0;
//                        $response['error'] = 'Record not updated!';
                    }
                } else {
                    $ERows2 = 0;
                }
            } else {
                $ERows2 = 0;
            }

            if ($ERows2 == 0) {
                $Sql = "INSERT INTO ref_selected_strategy (strategy_id, type, status, company_id, user_id, date_created) VALUES ('" . $arr_attr['strategy2'] . "', 2, 1, '" . $this->arrUser['company_id'] . "', '" . $this->arrUser['id'] . "', NOW())";
                $RS = $this->CSI($Sql);
                $id = $this->Conn->Insert_ID();
                if ($id > 0) {
                    $ERows2 = 2;
//                    $response['ack'] = 1;
//                    $response['error'] = NULL;
//                    $response['Update'] = 0;
//                    $response['id'] = $id;
                } else {
//                    $response['ack'] = 0;
//                    $response['error'] = 'Record already exist.';
//                    $response['Update'] = 0;
                }
            }
            if ($nonSelectedType != "") {
                $Sql = "UPDATE ref_selected_strategy SET status=0 WHERE $nonSelectedType";
                $RS = $this->CSI($Sql);
                if ($this->Conn->Affected_Rows() > 0) {
//                    $response['ack'] = 1;
//                    $response['error'] = NULL;
                } else {
//                    $response['ack'] = 0;
//                    $response['error'] = 'Record not updated!';
                }
            }
        }
        if ($ERows1 == 0 && $ERows2 == 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record already exist.';
            $response['Update'] = 0;
        } else if (($ERows1 == 1 && $ERows2 == 0) || ($ERows1 == 0 && $ERows2 == 1) || ($ERows1 == 1 && $ERows2 == 1) || ($ERows1 == -1 && $ERows2 == 1) || ($ERows1 == 1 && $ERows2 == -1) || ($ERows1 == 0 && $ERows2 == -1) || ($ERows1 == -1 && $ERows2 == 0)) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['Update'] = 0;
        } else if (($ERows1 == 2 && $ERows2 == 2) || ($ERows1 == 2 && $ERows2 == 0) || ($ERows1 == 2 && $ERows2 == 1) || ($ERows1 == 0 && $ERows2 == 2) || ($ERows1 == 1 && $ERows2 == 2) || ($ERows1 == -1 && $ERows2 == 0) || ($ERows1 == -1 && $ERows2 == 1) || ($ERows1 == -1 && $ERows2 == 2) || ($ERows1 == 0 && $ERows2 == -1) || ($ERows1 == 1 && $ERows2 == -1) || ($ERows1 == 2 && $ERows2 == -1)) {
            $response['ack'] = 2;
            $response['error'] = NULL;
            $response['Update'] = 0;
        }

        return $response;
    }


    function add_pricing_strategy_old($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $ERows = -1;
        if (isset($arr_attr['pricing_strategy_types']) && $arr_attr['pricing_strategy_types']) {
            $Sql = "SELECT ss.* FROM ref_selected_strategy ss
                INNER JOIN company ON company.id = ss.company_id
                WHERE ss.user_id='" . $this->arrUser['id'] . "' AND ss.company_id='" . $this->arrUser['company_id'] . "' ORDER BY ss.id ASC";

            $RS = $this->CSI($Sql);


            if ($RS->RecordCount() > 0) {
                $selectedType = "";
                $nonSelectedType = "";
                while ($Row = $RS->FetchRow()) {
                    if ($Row['type_id'] == $arr_attr['pricing_strategy_types']) {
                        $selectedType = $Row['id'];
                    } else {
                        if ($nonSelectedType == "") {
                            $nonSelectedType = "id=" . $Row['id'];
                        } else {
                            $nonSelectedType .= " OR id=" . $Row['id'];
                        }
                    }
                }
                if ($selectedType != "") {
                    $Sql = "UPDATE ref_selected_strategy SET status=1 WHERE id=$selectedType";
                    $RS = $this->CSI($Sql);
                    if ($this->Conn->Affected_Rows() > 0) {
                        $response['ack'] = 1;
                        $response['error'] = NULL;
                    } else {
                        $response['ack'] = 0;
                        $response['error'] = 'Record not updated!';
                    }
                } else {
                    $ERows = 0;
                }
            } else {
                $ERows = 0;
            }

            if ($ERows == 0) {
                $Sql = "INSERT INTO ref_selected_strategy (type_id, status, company_id, user_id, date_created) VALUES ('" . $arr_attr['pricing_strategy_types'] . "', 1, '" . $this->arrUser['company_id'] . "', '" . $this->arrUser['id'] . "', NOW())";
                $RS = $this->CSI($Sql);
                $id = $this->Conn->Insert_ID();
                if ($id > 0) {
                    $response['ack'] = 1;
                    $response['error'] = NULL;
                    $response['Update'] = 0;
                    $response['id'] = $id;
                } else {
                    $response['ack'] = 0;
                    $response['error'] = 'Record already exist.';
                    $response['Update'] = 0;
                }
            }
            if ($nonSelectedType != "") {
                $Sql = "UPDATE ref_selected_strategy SET status=0 WHERE $nonSelectedType";
                $RS = $this->CSI($Sql);
                if ($this->Conn->Affected_Rows() > 0) {
                    $response['ack'] = 1;
                    $response['error'] = NULL;
                } else {
                    $response['ack'] = 0;
                    $response['error'] = 'Record not updated!';
                }
            }
        }
        $ERows = -1;
        if (isset($arr_attr['pricing_volume_discount']) && $arr_attr['pricing_volume_discount'] != "") {
            $Sql = "SELECT ss.* FROM ref_price_type ss
                INNER JOIN company ON company.id = ss.company_id
                WHERE ss.user_id='" . $this->arrUser['id'] . "' AND ss.company_id='" . $this->arrUser['company_id'] . "' ORDER BY ss.id ASC";

            $RS = $this->CSI($Sql);


            if ($RS->RecordCount() > 0) {
                $selectedType = "";
                $nonSelectedType = "";
                while ($Row = $RS->FetchRow()) {
                    if ($Row['discount_id'] == $arr_attr['pricing_volume_discount']) {
                        $selectedType = $Row['id'];
                    } else {
                        if ($nonSelectedType == "") {
                            $nonSelectedType = "id=" . $Row['id'];
                        } else {
                            $nonSelectedType .= " OR id=" . $Row['id'];
                        }
                    }
                }
                if ($selectedType != "") {
                    $Sql = "UPDATE ref_price_type SET status=1 WHERE id=$selectedType";
                    $RS = $this->CSI($Sql);
                    if ($this->Conn->Affected_Rows() > 0) {
                        $response['ack'] = 1;
                        $response['error'] = NULL;
                    } else {
                        $response['ack'] = 0;
                        $response['error'] = 'Record not updated!';
                    }
                } else {
                    $ERows = 0;
                }
            } else {
                $ERows = 0;
            }

            if ($ERows == 0) {
                $Sql = "INSERT INTO ref_price_type (discount_id, status, company_id, user_id, date_created) VALUES ('" . $arr_attr['pricing_volume_discount'] . "', 1, '" . $this->arrUser['company_id'] . "', '" . $this->arrUser['id'] . "', NOW())";
                $RS = $this->CSI($Sql);
                $id = $this->Conn->Insert_ID();
                if ($id > 0) {
                    $response['ack'] = 1;
                    $response['error'] = NULL;
                    $response['Update'] = 0;
                    $response['id'] = $id;
                } else {
                    $response['ack'] = 0;
                    $response['error'] = 'Record already exist.';
                    $response['Update'] = 0;
                }
            }
            if ($nonSelectedType != "") {
                $Sql = "UPDATE ref_price_type SET status=0 WHERE $nonSelectedType";
                $RS = $this->CSI($Sql);
                if ($this->Conn->Affected_Rows() > 0) {
                    $response['ack'] = 1;
                    $response['error'] = NULL;
                } else {
                    $response['ack'] = 0;
                    $response['error'] = 'Record not updated!';
                }
            }
        }

        return $response;
    }

    function get_pricing_strategy($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $Sql = "SELECT st.id, st.type FROM ref_price_strategy_types st
                INNER JOIN ref_selected_strategy ss ON ss.strategy_id=st.id
                INNER JOIN company ON company.id = ss.company_id
                WHERE ss.status=1 AND ss.user_id='" . $this->arrUser['id'] . "' AND ss.company_id='" . $this->arrUser['company_id'] . "'";


        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        
        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'st', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        $ack = 0;
        if ($RS->RecordCount() > 0) {
            $selectedType = "";
            $nonSelectedType = "";
            while ($Row = $RS->FetchRow()) {
                $ack = 1;
                $response['response'][$Row['type']] = array('id' => $Row['id'], 'type' => $Row['type']);
            }
        }


        if ($ack == 1) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = "No Record Found";
        }

        return $response;
    }

    function get_pricing_strategy_old($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "SELECT ss.type_id FROM ref_selected_strategy ss
                INNER JOIN company ON company.id = ss.company_id
                WHERE ss.status=1 AND ss.user_id='" . $this->arrUser['id'] . "' AND ss.company_id='" . $this->arrUser['company_id'] . "' LIMIT 1";

        $RS = $this->CSI($Sql);

        $ack = 0;
        if ($RS->RecordCount() > 0) {
            $selectedType = "";
            $nonSelectedType = "";
            while ($Row = $RS->FetchRow()) {
                $ack = 1;
                $response['type_id'] = $Row['type_id'];
            }
        }

        $Sql = "SELECT pt.discount_id FROM ref_price_type pt
                INNER JOIN company ON company.id = pt.company_id
                WHERE pt.status = 1 AND pt.user_id='" . $this->arrUser['id'] . "' AND pt.company_id='" . $this->arrUser['company_id'] . "' LIMIT 1";

        $RS = $this->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            $selectedType = "";
            $nonSelectedType = "";
            while ($Row = $RS->FetchRow()) {
                $ack = 1;
                $response['discount_id'] = $Row['discount_id'];
            }
        }

        if ($ack == 1) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = "No Record Found";
        }

        return $response;
    }

    function get_pricing_strategy_types($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $Sql = "SELECT st.id, st.name, st.type FROM ref_price_strategy_types st
                WHERE st.status=1  ";


        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'st', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            $selectedType = "";
            $nonSelectedType = "";
            while ($Row = $RS->FetchRow()) {
                $response['ack'] = 1;
                $response['error'] = NULL;
                $response['response'][$Row['type']][] = array('id' => $Row['id'], 'name' => $Row['name'], 'type' => $Row['type']);
            }
        } else {
            $response['ack'] = 0;
            $response['error'] = "No Record Found";
        }

        return $response;
    }

    //----------------- CRM -------------------------------//
    // Order Stages Module
    //------------------------------------------------
    //------------------------------------------------

    /*   Listing to CRM order status        */

    //------------------------------------------------
    function get_order_stages_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();
        
        if($attr['type']>1)
            $where_clause = " AND module_id='".$attr['type']."'";
        else
            $where_clause = " AND module_id='1'";

        if($attr['type']==1 || $attr['type']==4)
            $module = 'sales_crm';
        else if($attr['type']==2 || $attr['type']==3)
            $module = 'purchases';
        else
            $module = 'sales_crm';
        /* echo "<pre>";
        print_r($attr); exit; */
        $Sql = "SELECT  d.id, d.name, d.rank 
                FROM ref_crm_order_stages  d
                where  d.status=1  and
                       d.company_id=" . $this->arrUser['company_id'] . "
                       ".$where_clause."
                ORDER BY d.rank";
        //echo $attr['isAllowed'];exit;
       //$RS = $this->CSI($Sql);
        if ($attr['isAllowed']){
            $RS = $this->CSI($Sql);
        }
        else{
            $RS = $this->CSI($Sql, $module, sr_ViewPermission);
        }


        
        $count = 1;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['rank'] = $Row['rank'];
                $result['first_or_last'] = ($count == $RS->RecordCount()) ? 1 : 0;
                // $result['status'] = "Active";
                $count++;
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    //------------------------------------------------

    /*   Add/Edit to CRM order status        */

    //------------------------------------------------

    function add_order_stages_crm($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $where_clause ="";

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $type = (isset($attr['type']) && $attr['type'] != '') ? $attr['type'] : '1';
      
        $where_clause = " AND module_id=".$type." ";

        $data_pass = "  tst.name='".$attr['name']."' ".$where_clause.$where_id." ";
        $total = $this->objGeneral->count_duplicate_in_sql('ref_crm_order_stages', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $doc_id = $attr['id'];
        $total_price = (isset($item->total_price) && $item->total_price!='')?$item->total_price:0;


        if ($doc_id == 0) {

            $Sql = "INSERT INTO ref_crm_order_stages 
                                SET
                                    module_id = '".$type."',
                                    name = '".$attr['name']."',
                                    `rank` = (SELECT COUNT(*)+1 FROM ref_crm_order_stages AS r WHERE r.company_id='" . $this->arrUser['company_id'] . "' AND r.module_id=".$type."),
                                    user_id='" . $this->arrUser['id'] . "' ,
                                    company_id='" . $this->arrUser['company_id'] . "' ,
                                    date_created='" . current_date . "'";
            // echo $Sql;exit;
            $RS = $this->CSI($Sql,'purchases',sr_ViewPermission);
            $doc_id = $this->Conn->Insert_ID();

        } else {

            $Sql = "UPDATE ref_crm_order_stages 
                                SET  
                                    name = '".$attr['name']."',
                                    status = '".$attr['stats']."' 
                                WHERE id = ".$doc_id." ";
            // echo $Sql;exit;            
            $RS = $this->CSI($Sql);
        }

        // if ($this->Conn->Affected_Rows() > 0) {
        if($doc_id>0){
            $response['ack'] = 1;
            //$response['id'] = $doc_id;
            $response['msg'] = 'Record  Inserted !';
            $response['error'] = NULL;
        } else {
            $response['ack'] = 2;
            $response['error'] = 'Record Updated Successfully';
        }
        return $response;
    }

    //------------------------------------------------

    /*   Order by ranking to CRM order status        */

    //------------------------------------------------


    function sort_crm_order_stages($arr_attr)
    {
        $count = 1;
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();
        
        if($attr['type']>1)
            $where_clause = " AND module_id='".$attr['type']."'";
        else
            $where_clause = " AND module_id='1'";            

        foreach ($arr_attr['record'] as $value) {
            $Sql = "UPDATE ref_crm_order_stages 
                                    SET 
                                    `rank` = ".$count." 
                                    WHERE id =  ".$value->id." ";
            // echo "<hr />".$Sql;
            $RS = $this->CSI($Sql);
            $count++;
        }
        $response['ack'] = 1;
        $response['error'] = NULL;
        return $response;
    }


    //------------------------------------------------

    /*   Status Listing by table name     */

    //------------------------------------------------

    function get_all_status($attr, $type)
    {
        // $this->objGeneral->mysql_clean($attr);
        // print_r($attr);exit;
        $response = array();
        $where_clause = "";

        $table_name = base64_decode($attr["tbl"]);

        $Sql = "SELECT  ri.id,ri.title,ri.description  FROM ".$table_name." ri  WHERE ri.status=1   ";
        $order_type = "Order By ri.id ASC";


        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'ri', $order_type);
        //  echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';
        $result = array();
        if ($type == 1) {

            $result['id'] = 0;
            $result['title'] = "InActive";
            $result['id'] = 1;
            $result['title'] = "Active";

            $response['response'][] = $result;
        }

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();


                $result['id'] = $Row['id'];
                $result['title'] = $Row['title'];
                $result['description'] = $Row['description'];


                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else   $response['response'][] = array();

        //  print_r($response['response']);


        return $response;
    }

    function get_status($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $response = array();

        $table_name = base64_decode($attr["tbl"]);

        $Sql = "SELECT id, title,description
				FROM ".$table_name."
				WHERE id = '".$attr['id']."' 
                limit 1";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else  $response['response'] = array();


        return $response;
    }

    function add_status($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        //print_r($arr_attr);exit;

        $table_name = base64_decode($arr_attr["tbl"]);


        if ($arr_attr['id'] > 0)
            $where_id = " AND tst.id <> '".$arr_attr['id']."' ";

        $data_pass = "  tst.title='".$arr_attr['title']."'   $where_id ";
        $total = $this->objGeneral->count_duplicate_in_sql($table_name, $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }

        $Sql = "INSERT INTO $table_name 
                                SET
                                    title='" . $arr_attr['title'] . "',
                                    description='" . $arr_attr['description'] . "',
                                    status=  '" . $arr_attr['statuss'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    user_id='" . $this->arrUser['id'] . "',
                                    created_date='" . current_date . "'";
        //echo $Sql;exit;
        $response = $this->objGeneral->run_query_exception($Sql);
        return $response;
    }

    function update_status($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $table_name = base64_decode($arr_attr["tbl"]);

        if ($arr_attr['id'] > 0)
            $where_id = " AND tst.id <> '".$arr_attr['id']."' ";

        $data_pass = "  tst.title='".$arr_attr['title']."'   $where_id ";
        $total = $this->objGeneral->count_duplicate_in_sql($table_name, $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }

        $Sql = "UPDATE ".$table_name." 
                        SET 
                            title='".$arr_attr['title']."',
                            description='".$arr_attr['description']."',
                            status=  '" . $arr_attr['statuss'] . "'
                        WHERE id = '".$arr_attr['id']."'";

        //   echo $Sql; exit;
        $RS = $this->CSI($Sql);
        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['Update'] = 1;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record already exist.';
            $response['Update'] = 1;
        }

        return $response;
    }

    function delete_status($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $table_name = base64_decode($arr_attr["tbl"]);

        $Sql = "Update  ".$table_name." Set status=0
        		WHERE id ='".$arr_attr['id']."'";

        // echo $Sql; exit;
        $RS = $this->CSI($Sql);
        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = '';
        }

        return $response;
    }

    ############	Start: G/L Unit of Measures Section ############

    function get_gl_units_of_measure($attr, $isAllowed=null)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $Sql = "SELECT   c.id, c.title,CASE
                                            WHEN c.status = 1 THEN 'Active'
                                            WHEN c.status = 0 THEN 'Inactive'
                                            WHEN c.status = 2 THEN 'Deleted'
                                            END AS gl_status
                 FROM  gl_units_of_measure  c
                 where  c.company_id=" . $this->arrUser['company_id'] . " and 
                        c.status <> 2 
                 ORDER BY c.id ASC";
                 
        if ($isAllowed){
            $RS = $this->CSI($Sql);
        }
        else{
            $RS = $this->CSI($Sql, 'finance', sr_ViewPermission);
        }
        
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {

            /* $result = array();
            $result['id'] = 0;
            $result['name'] = '';
            $result['title'] = '';
            $result['status'] = 0;
            $response['response'][] = $result; */

            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['title'];
                $result['title'] = $Row['title'];
                $result['status'] = $Row['gl_status'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_all_gl_units_of_measure($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        $Sql = "SELECT  c.id, c.title,CASE
                                            WHEN c.status = 1 THEN 'Active'
                                            WHEN c.status = 0 THEN 'Inactive'
                                            WHEN c.status = 2 THEN 'Deleted'
                                            END AS gl_status
                         FROM  gl_units_of_measure  c
                         where  c.company_id=" . $this->arrUser['company_id'];


        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        $selected_count = 0;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['title'] = $Row['title'];
                $result['status'] = $Row['gl_status'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function add_gl_units_of_measure($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $data_pass = "  tst.title='" . $arr_attr['title'] . "' ";
        $total = $this->objGeneral->count_duplicate_in_sql('gl_units_of_measure', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO gl_units_of_measure
                            SET
						          title='" . $arr_attr['title'] . "',
						          status=1,
                                  user_id='" . $this->arrUser['id'] . "',
						          company_id='" . $this->arrUser['company_id'] . "',
						          AddedBy='" . $this->arrUser['id'] . "',
						          AddedOn='" . current_date . "'";

        $RS = $this->CSI($Sql);
        $response['id'] = $this->Conn->Insert_ID();
        // $response = $this->objGeneral->run_query_exception($Sql);
        // return $response;


        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['error'] = 'Record Inserted Successfully';

        return $response;
    }

    function update_gl_units_of_measure($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $id = $arr_attr['id'];

        $data_pass = "  (tst.title='" . $arr_attr['title'] . "'  AND tst.id <> ".$arr_attr['id'].")";

        $total = $this->objGeneral->count_duplicate_in_sql('gl_units_of_measure', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE gl_units_of_measure
                            SET
                                title='".$arr_attr['title']."',
                                status='".$arr_attr['statusid']."',
                                ChangedBy='" . $this->arrUser['id'] . "',
                                ChangedOn='" . current_date_time . "'
                                WHERE id = " . $id . "   Limit 1";

        $RS = $this->CSI($Sql);


        if ($this->Conn->Affected_Rows() > 0) {
            $response['id'] = $id;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record Inserted Successfully';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
        }
        return $response;
    }

    function delete_gl_units_of_measure($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        $response =array();

        $id = $arr_attr['id'];

        $selectSql = " SELECT count(id) as total 
                       FROM srm_invoice_detail 
                       WHERE company_id = '" . $this->arrUser['company_id'] . "' AND 
                             type=1 and unit_measure_id = '" . $id . "'
                       UNION                       
                       SELECT count(id) as total 
                       FROM srm_order_return_detail 
                       WHERE company_id = '" . $this->arrUser['company_id'] . "' AND 
                             type=1 and unit_measure_id = '" . $id . "'
                       UNION                             
                       SELECT count(id) as total 
                       FROM order_details 
                       WHERE company_id = '" . $this->arrUser['company_id'] . "' AND 
                             type=1 and unit_measure_id = '" . $id . "'
                       UNION
                       SELECT count(id) as total 
                       FROM return_order_details 
                       WHERE company_id = '" . $this->arrUser['company_id'] . "' AND 
                             type=1 and unit_measure_id = '" . $id . "' ";
        // echo $selectSql;exit;

        $selectRS = $this->CSI($selectSql);

        $total = 0;

        if ($selectRS->RecordCount() > 0) {
            while ($selectRow = $selectRS->FetchRow()) {
                $total =  $total + $selectRow['total'];
            }

            if($total>0){
                $response['ack'] = 0;
                $response['error'] = "Record has already been used in orders!";
                return $response;
            }            
        }
        // return $response;


        $Sql = "UPDATE gl_units_of_measure
                            SET
                                status=2,
                                ChangedBy='" . $this->arrUser['id'] . "',
                                ChangedOn='" . current_date_time . "'
                                WHERE id = " . $id . "   Limit 1";

        $RS = $this->CSI($Sql);


        if ($this->Conn->Affected_Rows() > 0) {
            $response['id'] = $id;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record  Deleted!';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not Deleted!';
        }
        return $response;
    }

    ############	End: G/L Unit of Measures Section ###########


    /*                  regions module              */


    function get_region_data_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM crm_region
				WHERE id='".$attr['id']."'
				LIMIT 1";

        // echo $Sql; exit;

        $RS = $this->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $response['response'] = $Row;
        } else {
            $response['response'] = array();
        }
        //print_r($response);exit;
        return $response;
    }

    function update_region($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $id = $arr_attr['id'];

        $data_pass = "  (tst.title='" . $arr_attr['title'] . "' AND tst.region_type=".$arr_attr['region_type']." AND tst.id <> '" . $id . "')";
        $total = $this->objGeneral->count_duplicate_in_sql('crm_region', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE crm_region
                            SET
                                title='".$arr_attr['title']."',
                                description='".$arr_attr['description']."',
                                ChangedBy='" . $this->arrUser['id'] . "',
                                ChangedOn='" . current_date_time . "'
                                WHERE id = " . $id . "   Limit 1";

        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['id'] = $id;
            $response['ack'] = 1;
            $response['error'] = 'Record Updated Successfully';
        } else {
            $response['ack'] = 2;
            $response['error'] = 'Record Updated with no changes!';
        }
        return $response;
    }

    /*     Ownership Type module              */

    function get_ownership_listings($attr)
    {
        $response = array();
        $order_type = "";

        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT  *
                from sr_crm_owner_sel  c
                where  c.status=1 and 
                       c.company_id=" . $this->arrUser['company_id'];

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);

        //echo $response['q'];exit;

        $RS = $this->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['title'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        return $response;
    }

    function get_ownership_data_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM sr_crm_owner_sel
				WHERE id='".$attr['id']."'
				LIMIT 1";
        $RS = $this->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function update_ownership($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $id = $arr_attr['id'];

        $data_pass = "  (tst.title='" . $arr_attr['title'] . "'  AND tst.id <> '" . $id . "')";
        $total = $this->objGeneral->count_duplicate_in_sql('crm_owner', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE crm_owner
                            SET
                                title='".$arr_attr['title']."',
                                description='".$arr_attr['description']."',
                                ChangedBy='" . $this->arrUser['id'] . "',
                                ChangedOn='" . current_date_time . "'
                                WHERE id = " . $id . "   Limit 1";

        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['id'] = $id;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record Updated Successfully';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not Updated!';
        }
        return $response;
    }

    function add_ownership($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $data_pass = "  `tst.title`='".$arr_attr['title']."'  ";
        $total = $this->objGeneral->count_duplicate_in_sql('crm_owner', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO crm_owner SET title='".$arr_attr['title']."', 
                description='".$arr_attr['description']."', status = 1, owner_type=1,
                company_id='" . $this->arrUser['company_id'] . "', user_id='" . $this->arrUser['id'] . "',
                created_date = UNIX_TIMESTAMP (NOW()), AddedBy='" . $this->arrUser['id'] . "', 
                AddedOn = UNIX_TIMESTAMP (NOW()), ChangedBy= '" . $this->arrUser['id'] . "', 
                ChangedOn = UNIX_TIMESTAMP (NOW())";
            
        $RS = $this->CSI($Sql);
        $response['id'] = $this->Conn->Insert_ID();

        if ($response['id'] > 0) {
            $response['id'] = $response['id'];
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record Inserted Successfully';
        } else {
            $response['ack'] = 0;
            // $response['error'] = 'Record not inserted';
            if(strpos($this->Conn->ErrorMsg(), 'Duplicate') !== false){
                //$response['error'] = "'".$arr_attr['title']."' already inserted for this user";
                $response['error'] = "Record Already Exists.";
            }
            else
                $response['error'] = "Record not inserted";
        }

        return $response;
    }

    /*     Credit Rating module              */

    function get_credit_rating_listings($attr)
    {
        $response = array();
        $order_type = "";

        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT  *
                from sr_crm_credit_rating_sel  c
                where  c.status=1 and c.company_id=" . $this->arrUser['company_id'];

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);

        //echo $response['q'];exit;

        $RS = $this->CSI($response['q'], 'sales_crm', sr_ViewPermission);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = utf8_encode($Row['title']);//$Row['title'];

                /*if ($Row['status'] == 1)
                    $result['status'] = "Active";
                elseif ($Row['status'] == 2)
                    $result['status'] = "InActive";
                elseif ($Row['status'] == 0)
                    $result['status'] = "Delete";*/

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        return $response;
    }

    function get_credit_rating_data_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM sr_crm_credit_rating_sel
				WHERE id='".$attr['id']."'
				LIMIT 1";
        $RS = $this->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $Row['title'] = utf8_encode($Row['title']);

            $response['response'] = $Row;
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function update_credit_rating($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $id = $arr_attr['id'];

        $data_pass = "  (tst.title='" . $arr_attr['title'] . "'  AND tst.id <> '" . $id . "')";
        $total = $this->objGeneral->count_duplicate_in_sql('crm_credit_rating', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE crm_credit_rating
                            SET
                                title='".utf8_encode($arr_attr['title'])."',
                                description='".$arr_attr['description']."'
                                WHERE id = " . $id . "   Limit 1";

        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['id'] = $id;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record Updated Successfully';
        } else {
            $response['ack'] = 2;
            $response['error'] = 'Record Updated with no changes!';
        }
        return $response;
    }

    function add_credit_rating($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $data_pass = " tst.title='".$arr_attr['title']."'  ";
        $total = $this->objGeneral->count_duplicate_in_sql('crm_credit_rating', $data_pass, $this->arrUser['company_id']);

        if ($total >= 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }


        $Sql = "INSERT INTO crm_credit_rating
		SET `status`=1,`title`='".utf8_encode($arr_attr['title'])."',`credit_rating_type`=1,`description`='".$arr_attr['description']."',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";

        $RS = $this->CSI($Sql);
        $response['id'] = $this->Conn->Insert_ID();

        if ($response['id'] > 0) {
            $response['id'] = $response['id'];
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record Inserted Successfully';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
        }

        return $response;
    }

// SRM REGION Module
//--------------------------------------------------------------------

    function add_srm_region($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $data_pass = "  tst.title='".$arr_attr['title']."' AND tst.region_type='".$arr_attr['region_type']."' ";
        $total = $this->objGeneral->count_duplicate_in_sql('crm_region', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO crm_region
                                SET 
                                    status=1,
                                    title='".$arr_attr['title']."',
                                    region_type='".$arr_attr['region_type']."',
                                    description='".$arr_attr['description']."',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "'";

        $RS = $this->CSI($Sql);
        $response['id'] = $this->Conn->Insert_ID();
        // $response = $this->objGeneral->run_query_exception($Sql);
        // return $response;
        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['error'] = 'Record Inserted Successfully';
        return $response;
    }


    //----------------------------- Classification ----------------------------------------------------//

    function get_ref_classifications($attr)
    {
        // $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $order_type = "";
        $response = array();
        $strWhere = "";
        if (isset($attr['main_type']))
            $strWhere .= " and c.type =" . $attr["main_type"];

        $Sql = "SELECT c.id,c.name,(select ac.id from active_classification ac where ac.ref_type=c.id and ac.company_id=" . $this->arrUser['company_id'] . " and   ac.type=".$attr['main_type']."   limit  1) as options FROM ref_classification c   WHERE  c.status=1 and c.type=".$attr['main_type']." ";
        
        if ($attr['main_type'] == 1)
            $view_name = 'sr_active_crm_classification';
        else if ($attr['main_type'] == 2)
            $view_name = 'sr_active_customer_classification';
        else if ($attr['main_type'] == 3)
            $view_name = 'sr_active_srm_classification';
        else if ($attr['main_type'] == 4)
            $view_name = 'sr_active_supplier_classification';

        // $Sql = "SELECT * from $view_name as v where v.company_id =". $this->arrUser['company_id'];
        // echo $Sql;exit;
        /* $order_type = "order by c.sorting ASC";
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit; */
        $RS = $this->CSI($Sql);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['option'] = ($Row['options']) ? true: false;
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }


    function get_active_classifications($attr)
    {
        $order_type = "";
        $response = array();
        $strWhere = "";

        if (isset($attr['main_type']))
            $strWhere .= " and ac.type IN(" . $attr["main_type"].")";

        $Sql = "SELECT rf.id, rf.name as title FROM active_classification ac  INNER JOIN ref_classification  rf ON rf.id= ac.ref_type  WHERE ac.company_id='" . $this->arrUser['company_id'] . "'  ".$strWhere." order by rf.id ASC";
        
        if ($attr['main_type'] == "1, 12")
            $view_name = 'sr_active_crm_classification';
        else if ($attr['main_type'] == "2, 12")
            $view_name = 'sr_active_customer_classification';
        else if ($attr['main_type'] == "3, 34")
            $view_name = 'sr_active_srm_classification';
        else if ($attr['main_type'] == "4, 34")
            $view_name = 'sr_active_supplier_classification';


        // $Sql = "SELECT v.id, v.name as title from $view_name as v";
        // echo $Sql;exit;
        // $order_type = "";
        // $total_limit = pagination_limit;
         
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        // $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        
        $RS = $this->CSI($Sql);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['title'] = $Row['title'];
                //$result['options'] = $Row['options'];
                //$result['description'] = $Row['description'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_active_classification($arr_attr)
    {
        $sqld = "DELETE FROM active_classification where   type=".$arr_attr['types']." and  company_id=" . $this->arrUser['company_id'] . " ";
        $this->CSI($sqld);

        $Sqle = "INSERT INTO active_classification (type,ref_type, company_id,user_id,created_date) VALUES ";

        foreach ($arr_attr['arr_module_types'] as $item) {
            if ($item->option)
                $Sqle .= "( $arr_attr[types],$item->id," . $this->arrUser['company_id'] . ", " . $this->arrUser['id'] . ", '" . current_date . "'),";
        }
        //echo $Sqle;exit;

        $RS = $this->CSI((substr($Sqle, 0, -1)));


        $response['ack'] = 1;
        $response['error'] = NULL;
        return $response;
        
    }

    //----------------------------- Item Additional Cost  ----------------------------------------------------//

    function get_ref_item_additional_cost($attr)
    {
        // $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $order_type = "";
        $response = array();
        $strWhere = "";

        $Sql = "SELECT c.id,c.title,(select ac.id from active_item_additional_cost ac where ac.ref_id=c.id and ac.company_id=" . $this->arrUser['company_id'] . " limit  1) as options FROM item_additional_cost c   WHERE  c.status=1";
        
        //echo $response['q'];exit; 
        $RS = $this->CSI($Sql);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['title'] = $Row['title'];
                $result['option'] = ($Row['options']) ? true: false;
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }


    function get_active_item_additional_cost($attr)
    {
        $order_type = "";
        $response = array();
        $strWhere = "";

        $Sql = "SELECT rf.id, rf.name as title FROM active_item_additional_cost ac  INNER JOIN item_additional_cost  rf ON rf.id= ac.ref_id  WHERE ac.company_id='" . $this->arrUser['company_id'] . "'  $strWhere order by ac.ref_id ASC";
        
        // echo $response['q'];exit;
        
        $RS = $this->CSI($Sql);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['title'] = $Row['title'];
                //$result['options'] = $Row['options'];
                //$result['description'] = $Row['description'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_active_item_additional_cost($arr_attr)
    {
        $sqld = "DELETE FROM active_item_additional_cost where company_id=" . $this->arrUser['company_id'];
        $this->CSI($sqld);

        $Sqle = "INSERT INTO active_item_additional_cost (ref_id, company_id,user_id,created_date) VALUES ";

        foreach ($arr_attr['arr_additional_cost_items'] as $item) {
            if ($item->option)
                $Sqle .= "(".$item->id."," . $this->arrUser['company_id'] . ", " . $this->arrUser['id'] . ", '" . current_date . "'),";
        }

        $RS = $this->CSI((substr($Sqle, 0, -1)));


        $response['ack'] = 1;
        $response['error'] = NULL;
        return $response;
        
    }

    
    function add_shortcuts($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $response = array();
        foreach($attr['shortcuts'] as $key=> $value)
        {
            if(intval($attr['shortcuts']->$key) == 0)
                $attr['shortcuts']->$key = 0;
        }
        // print_r($attr['shortcuts']);exit;
        $id = $attr['shortcuts']->id;

        if($id > 0)
        {
            $Sql = "UPDATE shortcuts
				        SET 
                            user_id =".$this->arrUser['id']. ",
                            company_id =".$this->arrUser['company_id']. ",
                            sale_quote = ".$attr['shortcuts']->sale_quote.",
                            sale_order = ".$attr['shortcuts']->sale_order.",
                            customer = ".$attr['shortcuts']->customer.",
                            purchase_order = ".$attr['shortcuts']->purchase_order.",
                            supplier = ".$attr['shortcuts']->supplier.",
                            item = ".$attr['shortcuts']->item.",
                            crm = ".$attr['shortcuts']->crm.",
                            srm = ".$attr['shortcuts']->srm.",
                            employee = ".$attr['shortcuts']->employee.",
                            holiday = ".$attr['shortcuts']->holiday.",
                            expense = ".$attr['shortcuts']->expense."
                    WHERE
                        id=".$attr['shortcuts']->id;
            $RS = $this->CSI($Sql);

        }
        else
        {
            $Sql = "INSERT INTO shortcuts
				        SET 
                            user_id =".$this->arrUser['id']. ",
                            company_id =".$this->arrUser['company_id']. ",
                            sale_quote = ".$attr['shortcuts']->sale_quote.",
                            sale_order = ".$attr['shortcuts']->sale_order.",
                            customer = ".$attr['shortcuts']->customer.",
                            purchase_order = ".$attr['shortcuts']->purchase_order.",
                            supplier = ".$attr['shortcuts']->supplier.",
                            item = ".$attr['shortcuts']->item.",
                            crm = ".$attr['shortcuts']->crm.",
                            srm = ".$attr['shortcuts']->srm.",
                            employee = ".$attr['shortcuts']->employee.",
                            holiday = ".$attr['shortcuts']->holiday.",
                            expense = ".$attr['shortcuts']->expense;
            // echo $Sql;exit;
            $RS = $this->CSI($Sql);
            $id = $this->Conn->Insert_ID();
        }
        

        //echo $Sql."<hr>"; exit;
        
        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['id'] = $id;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted.';

        }

        return $response;
    }
    
    function get_shortcuts($attr)
    {
        $response = array();
        $Sql = "SELECT * FROM shortcuts
				        WHERE 
                        user_id =".$this->arrUser['id']. " AND
                            company_id =".$this->arrUser['company_id']." LIMIT 1";
        // echo $Sql;exit;
        $RS = $this->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            if ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);
                }
                $response['response'] = $Row;
            }
            $response['ack'] = 1;
        }
        else
        {
            $response['ack'] = 0;
        }

        return $response;
    }

    function check_setUp($attr)
    {
        $Sql = "SELECT *
				FROM ref_crm_order_stages
				WHERE 
                company_id='" . $this->arrUser['company_id'] . "'
				LIMIT 1";
       //$RS = $this->CSI($Sql);
       $RS = $this->CSI($Sql, "setup", sr_ViewPermission);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
        } else {
            $response['response'] = array();
           // $response['bucketFail'] = 1;
        }
        return $response;
    }

    function exportAsCSV($attr, $query){
        $uniqid = uniqid();
        $filename = APP_PATH . "csvs/".$attr['searchKeyword']->exportAsCSV."_".$uniqid.".csv";
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="'.$filename.'"');
        $output = fopen($filename, 'w+');
        $metaData = $this->GetTableMetaData($attr['searchKeyword']->exportAsCSV);
        $cols = $metaData['response']['colMeta'];
        unset($metaData['response']['tbl_meta_data']);
        $header = "";
        $body = "";
        $newCols = array();
        foreach ($cols as $key => $value) {
            if ($value['visible'] == "0" || strpos($value['field_name'], 'button') === 0){
                continue;
            }
            else{
                unset($value['drop_down_list']);
                $header .= "\"" . $value['title'] . "\",";
                array_push($newCols, $value);
            }
        };
        fwrite($output, $header);
        fwrite($output, "\n");
        // echo $query;exit;
        $RS1 = $this->CSI($query); 
        // print_r($RS);exit;
        if ($RS1->RecordCount() > 0) {
            while ($data = $RS1->FetchRow()) {
                $body = "";
                    foreach($newCols as $key2 => $value2){
                        // print_r($value);exit;
                        $val = $data[$value2['field_name']];

                        if ($value2['data_type'] == 'date' && !strpos($val, "/")){
                            $val = $this->objGeneral->convert_unix_into_date($val);
                        }
                        else if ($value2['data_type'] == 'number' && $val){
                            $val = number_format($val, 2);
                        }
                        else if ($value2['data_type'] == 'checkbox'){
                            $val = $val == "1" ? "Yes" : "No";
                            $val .= $data[$value2['placeholder']] ? (" (" . $data[$value2['placeholder']] . ")") : "";
                        }
                        $body .= "\"" . $val . "\",";
                }
                fwrite($output, $body);
                fwrite($output, "\n");
            }
        }
        fclose($output);
        return WEB_PATH . "/csvs/".$attr['searchKeyword']->exportAsCSV."_".$uniqid.".csv";
    }
    

    function GetTableMetaData($module,$report=null)
    {

        if ($report>0){
            $defaultFileName = "flexiTableDefaults/modalDefaults/".$module.".json";           
        }
        else{
            $defaultFileName = "flexiTableDefaults/defaultTables/".$module.".json";
        }
        //echo $defaultFileName;exit;

        $response = array();
        
        $Sql = "SELECT * 
                FROM html_table_structure 
                WHERE table_name = '".$module."' AND 
                       company_id =".$this->arrUser['company_id']. "  AND 
                       user_id =".$this->arrUser['id']. " 
                ORDER BY display_order";
        $RS = $this->CSI($Sql);

        $resultSetDB= [];

        $Sql2 = "SELECT * 
                FROM flexi_table_meta 
                WHERE tableName = '".$module."' AND 
                       company_id =".$this->arrUser['company_id']. "  AND 
                       user_id =".$this->arrUser['id']. " ";
        $RS2 = $this->CSI($Sql2);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);
                }
                $resultSetDB[] = $Row;
            }
            
        }
        if ($RS2->RecordCount() > 0) {
            while ($Row = $RS2->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);
                }
                $resultSetTblDB[] = $Row;
            }
        }
        if(file_exists($defaultFileName)){  
            //echo "here"; 
            $default_file = fopen($defaultFileName, "r");
            $default_options      = fread($default_file,filesize($defaultFileName));
            fclose($default_file);
            $options_json = json_decode($default_options, true);  
            $resultSet = $options_json;
            if (!array_key_exists('tblMeta', $resultSet)){
                $resultSet['colMeta'] = $resultSet;
                $resultSet['tblMeta']['autoAdjust'] = false;
            }
            else{
                $response['response']['originalTblMeta'] = $resultSet['tblMeta'];
            }
            $response['source'] = "Default";
        }
        //print_r($resultSet);exit;
        if ($resultSet){
                foreach ($resultSet['tblMeta'] as $key => $value) {
                    foreach ($resultSetTblDB as $key2 => $value2) {
                        if ($value2['property'] == $key){
                            $resultSet['tblMeta'][$key] = $value2['value'];
                        }
                    }
                }
                $resultSet['tblMeta']['autoAdjust'] = $resultSet['tblMeta']['autoAdjust'] == "0" ? false : true;
            $response['response']['tblMeta'] = $resultSet['tblMeta'];
            for ($i = 0; $i < sizeof($resultSet['colMeta']); $i++){
                $Row = $resultSet['colMeta'][$i];
                foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);
                }

                $fileName = "flexiTableDefaults/dropdown_files/".$module."_".$Row['field_name'].".json";
                if($Row['data_type'] == 'drop_down' && file_exists($fileName))
                {   
                    $options_file = fopen($fileName, "r");
                    $options      = fread($options_file,filesize($fileName));
                    fclose($options_file);
                    $options_json = json_decode($options, true);                    
                    $Row['drop_down_list'] = $options_json;
                }
                else if ($Row['data_type'] == 'drop_down' && !empty($Row['db_table']) && !empty($Row['db_field'])){
                    $where = "";
                    if ($Row['db_where']){
                        $where = $Row['db_where'] . " AND ";
                    }
                    $Sql = "SELECT DISTINCT ".$Row['db_field']." FROM ".$Row['db_table']. " WHERE  ".$where." company_id = " . $this->arrUser['company_id'];
                    //echo $Sql;exit;
                    $dropDownList = $this->CSI($Sql);
                    $Row['drop_down_list'][$Row['field_name']][] = [
                                "name" => "NULL",
                                "id" => 999999
                            ];
                    if ($dropDownList->RecordCount() > 0) {
                        $count = 1;
                        while ($dropDownListItem = $dropDownList->FetchRow()) {
                            $Row['drop_down_list'][$Row['field_name']][] = [
                                "name" => $dropDownListItem[$Row['db_field']],
                                "id" => $count
                            ];
                            $count++;
                        }
                    }
                }
                else 
                    $Row['drop_down_list']      = '';

                for ($j = 0; $j < sizeof($resultSetDB); $j++){
                    if ($Row['field_name'] == $resultSetDB[$j]['field_name']){
                        $Row['visible'] = $resultSetDB[$j]['visible'];
                        $Row['pinned'] = $resultSetDB[$j]['pinned'];
                        $Row['color'] = $resultSetDB[$j]['color'];
                        $Row['width'] = $resultSetDB[$j]['width'];
                        $Row['display_order'] = $resultSetDB[$j]['display_order'];
                    }
                }
                $response['response']['colMeta'][] = $Row;
            }
            if (sizeof($resultSetDB)){
                array_multisort(array_column($response['response']['colMeta'], 'display_order'), SORT_ASC, $response['response']['colMeta']);
            }

            for ($i = 0; $i < sizeof($resultSet['colMeta']); $i++){
                $Row = array();
                $Row['title'] = $resultSet['colMeta'][$i]['title'];
                $Row['width'] = $resultSet['colMeta'][$i]['width'];
                $Row['color'] = $resultSet['colMeta'][$i]['color'];
                $Row['visible'] = $resultSet['colMeta'][$i]['visible'];
                $Row['pinned'] = $resultSet['colMeta'][$i]['pinned'];
                $response['response']['originalColMeta'][] = $Row;
            }
            
            $response['ack'] = 1;
            $response['error'] = NULL;
        }  else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        //print_r($response);exit;
        return $response;
    }

     function UpdateTableMetaData($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $tableName = $attr['tableName'];
        $attr = $attr['tblMetaParam'];
        $response = array();
        $Sql = "";
        $removeSql = "DELETE FROM html_table_structure WHERE table_name = '".$tableName."' AND company_id = '".$this->arrUser['company_id']."' AND user_id = '".$this->arrUser['id']."'";
        // echo $removeSql;
            $RS = $this->CSI($removeSql);
        foreach($attr->colMeta as $rec){
            $visible    = (!$rec->visible) ? '0' : '1';
            $pinned     = (!$rec->pinned) ? '0' : '1';
            $Sql = "INSERT INTO html_table_structure
                            SET 
                            table_name      =  '".$tableName."', 
                            company_id      =  '".$this->arrUser['company_id']."', 
                            user_id         =  '".$this->arrUser['id']."', 
                            field_name      =  '".$rec->field_name."',
                            visible         =  '".$visible."', 
                            pinned          =  '".$pinned."', 
                            color           =  '".$rec->color."', 
                            width           =  '".$rec->width."', 
                            display_order   =  '".$rec->display_order."'
                            ";
           
            // echo $Sql . "\n";
            $RS = $this->CSI($Sql);
        }
        $removeSql = "DELETE FROM flexi_table_meta WHERE tableName = '".$tableName."' and company_id = '".$this->arrUser['company_id']."' AND user_id = '".$this->arrUser['id']."'";
        $RS = $this->CSI($removeSql);
        foreach ($attr->tblMeta as $key => $value) {
            $Sql = "INSERT INTO flexi_table_meta
                        SET
                            tableName = '".$tableName."', 
                            property = '".$key."', 
                            value = '".$value."', 
                            user_id = '".$this->arrUser['id']."',
                            company_id = '".$this->arrUser['company_id']."'
            ";
            // echo $Sql;
            $RS = $this->CSI($Sql);
            
        }
        
        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    } 

    function updateEmailJSON ($attr){
        //print_r($attr);exit;
        $this->objGeneral->mysql_clean($attr);
        //echo json_encode($attr['json']);exit;
        //$attr['json'] = str_replace("\\\\","\\",json_encode($attr['json']));
        //print_r($attr['json']);exit;
        // echo stripslashes($attr['json']->templateBody).PHP_EOL."---".PHP_EOL;
        // echo addslashes(stripslashes($attr['json']->templateBody)).PHP_EOL."---".PHP_EOL;
        // echo trim(addslashes(stripslashes($attr['json']->templateBody))).PHP_EOL."---".PHP_EOL;
        // echo json_encode(trim(addslashes(stripslashes($attr['json']->templateBody)))).PHP_EOL."---".PHP_EOL;

       // exit;
        //trim(addslashes(stripslashes($attr['json'])));
        if (empty($attr['templateId'])){
            $Sql = "INSERT INTO auto_email_templates SET
                    mainModule = '".$attr['mainModule']."',
                    template_name = '".$attr['templateName']."',
                    json = '" . str_replace("\\\\","\\",json_encode($attr['json'])) . "',
                    company_id = " . $this->arrUser['company_id'] . ",
                    AddedOn = " . current_date . ",
                    AddedBy = " . $this->arrUser['id'] . "
                    ";
        }
        else{
            $Sql = "UPDATE auto_email_templates SET
                    mainModule = '".$attr['mainModule']."',
                    template_name = '".$attr['templateName']."',
                    json = '" . str_replace("\\\\","\\",json_encode($attr['json'])) . "',
                    company_id = " . $this->arrUser['company_id'] . ",
                    ChangedOn = " . current_date . ",
                    ChangedBy = " . $this->arrUser['id'] . "
                    WHERE id = ".$attr['templateId'];
        }
        //echo $Sql;exit;
        $RS = $this->CSI($Sql, "auto_email_config", sr_ViewPermission);
        if (empty($attr['templateId'])){
            $id = $this->Conn->Insert_ID();
        }
        else{
            $id = $attr['templateId'];
        }
        if ($id > 0) {
            $response['id'] = $id;
            $response['dbWrite'] = 1;
            $response['ack'] = 1;
            $response['error'] = null;
        }
        else{
            $response['ack'] = 0;
            $response['error'] = null;
        }
            
        return $response;
    }

    function updateUserEmail($attr){
        return; // removing table email_defaults_for_user from db as it is not being used
        //print_r($attr);exit;
        $chkSql = "DELETE FROM email_defaults_for_user WHERE template_name = '".$attr['template_name']."' AND user_id='" . $this->arrUser['id'] . "' AND 
        company_id='" . $this->arrUser['company_id'] . "'";
        //echo $chkSql;exit;
        $RS = $this->CSI($chkSql);
        // print_r($attr);exit;
        $Sql = "INSERT INTO email_defaults_for_user
		                            SET template_name='".$attr['template_name']."',
                                        default_email='".$attr['userEmail']."',
                                        user_id='" . $this->arrUser['id'] . "',
                                        company_id='" . $this->arrUser['company_id'] . "'";
        // echo $Sql;exit;
        $RS = $this->CSI($Sql);
        $response['id'] = $this->Conn->Insert_ID();
        // $response = $this->objGeneral->run_query_exception($Sql);
        // return $response;
        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['error'] = 'Record Inserted Successfully';
        return $response;
    }

    function getHMRCRefreshToken($attr){
        // 
        $endpoint_url = 'https://api.service.hmrc.gov.uk/oauth/token';
        $data_to_post = [
            'client_secret' => HMRC_SECRET,
            'client_id' => HMRC_ID,
            'grant_type' => client_credentials,//'refresh_token',
            'scope' => 'read:vat'//'read:vat write:vat'
           // 'refresh_token' => $attr['data']->refresh_token
        ];
        // print_r($data_to_post);
        $options = [
            CURLOPT_URL        => $endpoint_url,
            CURLOPT_POST       => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POSTFIELDS => $data_to_post,
        ];
        $curl = curl_init();
        curl_setopt_array($curl, $options);
        $result = json_decode(curl_exec($curl));
        $error = curl_error($curl);
        if (!$error){
            if ($result->error){
                return $result;
            }
            else{
                // now is the time to put the credentials in db
                // $sqlDelete = "DELETE FROM hmrc_tokens WHERE scope = '".$response->scope."' and user_id = " . $this->arrUser['id'] . ";";
                // $RS = $this->CSI($sqlDelete);
                $sqlUpdate = "UPDATE hmrc_tokens set 
                                    access_token = '".$result->access_token."',
                                    refresh_token = '".$result->refresh_token."',
                                    user_id = '".$this->arrUser['id']."',
                                    company_id = '".$this->arrUser['company_id']."'
                                    WHERE id = " . $attr['data']->id;
                                    // echo $sqlUpdate;
                $RS = $this->CSI($sqlUpdate);

                $Sql = "SELECT * FROM hmrc_tokens where id = " . $attr['data']->id;
                $RS = $this->CSI($Sql);

                if ($RS->RecordCount() > 0) {
                    $Row = $RS->FetchRow();
                    foreach ($Row as $key => $value) {
                            if (is_numeric($key))
                                unset($Row[$key]);
                        }
                    $response['response'] = $Row;
                }

                $response['ack'] = 1;
                $response['null'] = null;
                return $response;
            }
        }
    }

    function getCompanyVRN(){
        $Sql = "SELECT vat_reg_no
				FROM financial_settings
				WHERE company_id='" . $this->arrUser['company_id'] . "'
				LIMIT 1";

        //echo $Sql; exit;
        // $RS = $this->CSI($Sql);

        $RS = $this->CSI($Sql);
        return $RS->FetchRow()['vat_reg_no'];
    }

    function checkSetupVATAccounts(){
        $Sql = "SELECT vat_lieability_receve_gl_account
				FROM financial_settings
				WHERE company_id='" . $this->arrUser['company_id'] . "'
				LIMIT 1";

        //echo $Sql; exit;

        $RS = $this->CSI($Sql);

        $response['ack'] = 1;
        $response['setupVATAccounts'] = $RS->FetchRow()['vat_lieability_receve_gl_account'];
        return $response;

        // return $RS->FetchRow()['vat_lieability_receve_gl_account'];
    }

    function getProfitMarginView($isAllowed){
        // $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT marginAnalysisView
				FROM company
				WHERE id='" . $this->arrUser['company_id'] . "' ";
        if ($isAllowed){
            $RS = $this->CSI($Sql);
        }
        else{
            $RS = $this->CSI($Sql, 'sales_crm', sr_ViewPermission);
        }

        $response['ack'] = 1;
        $response['marginAnalysisView'] = $RS->FetchRow()['marginAnalysisView'];
        return $response;
    }

    function setProfitMarginView($attr){
        $this->objGeneral->mysql_clean($attr);
        $Sql = "UPDATE company
                SET marginAnalysisView = ".$attr['marginAnalysisView']."
				WHERE id='" . $this->arrUser['company_id'] . "' ";

        $RS = $this->CSI($Sql);

        $response['ack'] = 1;
        return $response;
    }

    function getVATObligations($attr){
        $vrn = $this->getCompanyVRN();
        if (empty($vrn)){
            $response['ack'] = false;
            $response['VRNMissing'] = true;
            $response['error'] = "VAT Reg. No. is missing in company financial settings.";
            return $response;
        }

        $ipaddress = '';
        if (isset($_SERVER['HTTP_CLIENT_IP']))
            $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
        else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
            $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
        else if(isset($_SERVER['HTTP_X_FORWARDED']))
            $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
        else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
            $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
        else if(isset($_SERVER['HTTP_FORWARDED']))
            $ipaddress = $_SERVER['HTTP_FORWARDED'];
        else if(isset($_SERVER['REMOTE_ADDR']))
            $ipaddress = $_SERVER['REMOTE_ADDR'];


        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,"https://api.service.hmrc.gov.uk/organisations/vat/" . $vrn . "/obligations?" . $attr['submitted']);
        // curl_setopt($ch, CURLOPT_POST, 1);
        // curl_setopt($ch, CURLOPT_POSTFIELDS,$vars);  //Post Fields
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $fraudHeaders['Gov-Client-Public-IP'] = $ipaddress;//$_SERVER['REMOTE_ADDR'];
        $fraudHeaders['Gov-Client-Public-Port'] = $_SERVER['REMOTE_PORT'];
        $fraudHeaders['Gov-Client-Device-ID'] = 'f5c486f7-e2d1-11ea-8ec3-c68f78acf4c5';//'';
        $fraudHeaders['Gov-Client-User-IDs'] = "Silverow=".$this->arrUser['user_no'];
        $fraudHeaders['Gov-Client-Timezone'] = $attr['fraudHeaders']->timezone;
        $fraudHeaders['Gov-Client-Local-IPs'] = $attr['fraudHeaders']->clientLocalIP;//'';
        $fraudHeaders['Gov-Client-Screens'] = $attr['fraudHeaders']->screens;
        $fraudHeaders['Gov-Client-Window-Size'] = $attr['fraudHeaders']->window;
        $fraudHeaders['Gov-Client-Browser-Plugins'] = $attr['fraudHeaders']->browserPlugins;
        $fraudHeaders['Gov-Client-Browser-JS-User-Agent'] = $attr['fraudHeaders']->userAgent;
        $fraudHeaders['Gov-Client-Browser-Do-Not-Track'] = $attr['fraudHeaders']->doNotTrack;
        $fraudHeaders['Gov-Client-Multi-Factor'] = '';
        $fraudHeaders['Gov-Vendor-Version'] = $attr['fraudHeaders']->applicationVersion;
        $fraudHeaders['Gov-Vendor-License-IDs'] = '';
        $fraudHeaders['Gov-Vendor-Public-IP'] = $_SERVER['SERVER_ADDR'];
        $fraudHeaders['Gov-Vendor-Forwarded'] = "by=" . $fraudHeaders['Gov-Vendor-Public-IP'] . "&for=" . $fraudHeaders['Gov-Client-Public-IP'];
        
        $headers = [
            'Accept: application/vnd.hmrc.1.0+json',
            'Authorization: Bearer ' . $attr['accessData']->access_token,
            'Content-Type: application/json',
            'Gov-Client-Connection-Method: WEB_APP_VIA_SERVER',
            'Gov-Client-Public-IP: ' . $fraudHeaders['Gov-Client-Public-IP'],
            'Gov-Client-Public-Port: ' . $fraudHeaders['Gov-Client-Public-Port'],
            'Gov-Client-Device-ID: ' . $fraudHeaders['Gov-Client-Device-ID'],
            'Gov-Client-User-IDs: ' . $fraudHeaders['Gov-Client-User-IDs'],
            'Gov-Client-Timezone: ' . $fraudHeaders['Gov-Client-Timezone'],
            'Gov-Client-Local-IPs: ' . $fraudHeaders['Gov-Client-Local-IPs'],
            'Gov-Client-Screens: ' . $fraudHeaders['Gov-Client-Screens'],
            'Gov-Client-Window-Size: ' . $fraudHeaders['Gov-Client-Window-Size'],
            'Gov-Client-Browser-Plugins: ' . $fraudHeaders['Gov-Client-Browser-Plugins'],
            'Gov-Client-Browser-JS-User-Agent: ' . $fraudHeaders['Gov-Client-Browser-JS-User-Agent'],
            'Gov-Client-Browser-Do-Not-Track: ' . $fraudHeaders['Gov-Client-Browser-Do-Not-Track'],
            'Gov-Client-Multi-Factor: ' . $fraudHeaders['Gov-Client-Multi-Factor'],
            'Gov-Vendor-Version: ' . $fraudHeaders['Gov-Vendor-Version'],
            'Gov-Vendor-License-IDs: ' . $fraudHeaders['Gov-Vendor-License-IDs'],
            'Gov-Vendor-Public-IP: ' . $fraudHeaders['Gov-Vendor-Public-IP'],
            'Gov-Vendor-Forwarded: ' . $fraudHeaders['Gov-Vendor-Forwarded'],

        ];

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $server_output = curl_exec ($ch);
        $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        curl_close ($ch);
        $response['statusCode'] = $httpcode;
        if ($httpcode != 200){
            $response['errors'] = json_decode($server_output);
            $response['ack'] = false;
        }
        else{
            $response['response'] = json_decode($server_output);
            $response['vrn'] = $vrn;
            $response['ack'] = true;
        }
        return $response;
    }

    function submitVATSummary($attr){
        $vrn = $this->getCompanyVRN();
        $url = "https://api.service.hmrc.gov.uk/organisations/vat/" . $vrn . "/returns";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_HEADERFUNCTION,
            function($curl, $header) use (&$headers)
            {
                $len = strlen($header);
                $header = explode(':', $header, 2);
                if (count($header) < 2) // ignore invalid headers
                return $len;

                $name = strtolower(trim($header[0]));
                if (!array_key_exists($name, $headers))
                $headers[$name] = [trim($header[1])];
                else
                $headers[$name][] = trim($header[1]);

                return $len;
            }
        );
        curl_setopt($ch, CURLOPT_POSTFIELDS,json_encode($attr['data']));  //Post Fields
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $fraudHeaders['Gov-Client-Public-IP'] = $_SERVER['REMOTE_ADDR'];
        $fraudHeaders['Gov-Client-Public-Port'] = $_SERVER['REMOTE_PORT'];
        $fraudHeaders['Gov-Client-Device-ID'] = 'f5c486f7-e2d1-11ea-8ec3-c68f78acf4c5';//'';
        $fraudHeaders['Gov-Client-User-IDs'] = "Silverow=".$this->arrUser['user_no'];//$this->arrUser['id'];
        $fraudHeaders['Gov-Client-Timezone'] = $attr['fraudHeaders']->timezone;
        $fraudHeaders['Gov-Client-Local-IPs'] = $attr['fraudHeaders']->clientLocalIP;//'';
        $fraudHeaders['Gov-Client-Screens'] = $attr['fraudHeaders']->screens;
        $fraudHeaders['Gov-Client-Window-Size'] = $attr['fraudHeaders']->window;
        $fraudHeaders['Gov-Client-Browser-Plugins'] = $attr['fraudHeaders']->browserPlugins;
        $fraudHeaders['Gov-Client-Browser-JS-User-Agent'] = $attr['fraudHeaders']->userAgent;
        $fraudHeaders['Gov-Client-Browser-Do-Not-Track'] = $attr['fraudHeaders']->doNotTrack;
        $fraudHeaders['Gov-Client-Multi-Factor'] = '';
        $fraudHeaders['Gov-Vendor-Version'] = $attr['fraudHeaders']->applicationVersion;
        $fraudHeaders['Gov-Vendor-License-IDs'] = '';
        $fraudHeaders['Gov-Vendor-Public-IP'] = $_SERVER['SERVER_ADDR'];
        $fraudHeaders['Gov-Vendor-Forwarded'] = "by=" . $fraudHeaders['Gov-Vendor-Public-IP'] . "&for=" . $fraudHeaders['Gov-Client-Public-IP'];
        
        $reqheaders = [
            'Accept: application/vnd.hmrc.1.0+json',
            'Authorization: Bearer ' . $attr['accessData']->access_token,
            'Content-Type: application/json',
            'Gov-Client-Connection-Method: WEB_APP_VIA_SERVER',
            'Gov-Client-Public-IP: ' . $fraudHeaders['Gov-Client-Public-IP'],
            'Gov-Client-Public-Port: ' . $fraudHeaders['Gov-Client-Public-Port'],
            'Gov-Client-Device-ID: ' . $fraudHeaders['Gov-Client-Device-ID'],
            'Gov-Client-User-IDs: ' . $fraudHeaders['Gov-Client-User-IDs'],
            'Gov-Client-Timezone: ' . $fraudHeaders['Gov-Client-Timezone'],
            'Gov-Client-Local-IPs: ' . $fraudHeaders['Gov-Client-Local-IPs'],
            'Gov-Client-Screens: ' . $fraudHeaders['Gov-Client-Screens'],
            'Gov-Client-Window-Size: ' . $fraudHeaders['Gov-Client-Window-Size'],
            'Gov-Client-Browser-Plugins: ' . $fraudHeaders['Gov-Client-Browser-Plugins'],
            'Gov-Client-Browser-JS-User-Agent: ' . $fraudHeaders['Gov-Client-Browser-JS-User-Agent'],
            'Gov-Client-Browser-Do-Not-Track: ' . $fraudHeaders['Gov-Client-Browser-Do-Not-Track'],
            'Gov-Client-Multi-Factor: ' . $fraudHeaders['Gov-Client-Multi-Factor'],
            'Gov-Vendor-Version: ' . $fraudHeaders['Gov-Vendor-Version'],
            'Gov-Vendor-License-IDs: ' . $fraudHeaders['Gov-Vendor-License-IDs'],
            'Gov-Vendor-Public-IP: ' . $fraudHeaders['Gov-Vendor-Public-IP'],
            'Gov-Vendor-Forwarded: ' . $fraudHeaders['Gov-Vendor-Forwarded'],

        ];

        curl_setopt($ch, CURLOPT_HTTPHEADER, $reqheaders);

        $server_output = curl_exec ($ch);
        $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        curl_close ($ch);
        $response['statusCode'] = $httpcode;
        
        if ($httpcode != 201){
            $response['errors'] = json_decode($server_output);
            $response['ack'] = false;
        }
        else{
            $response['headers'] = $headers;
            $response['response'] = json_decode($server_output);
            $response['ack'] = true;
        }
        return $response;
    }

    function getVATSummary($attr){
        $vrn = $this->getCompanyVRN();
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,"https://api.service.hmrc.gov.uk/organisations/vat/" . $vrn . "/returns" . "/" . $attr['periodKey']);
        // https://api.service.hmrc.gov.uk
        // curl_setopt($ch, CURLOPT_POST, 1);
        // curl_setopt($ch, CURLOPT_POSTFIELDS,$vars);  //Post Fields
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $ipaddress = '';
        if (isset($_SERVER['HTTP_CLIENT_IP']))
            $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
        else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
            $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
        else if(isset($_SERVER['HTTP_X_FORWARDED']))
            $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
        else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
            $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
        else if(isset($_SERVER['HTTP_FORWARDED']))
            $ipaddress = $_SERVER['HTTP_FORWARDED'];
        else if(isset($_SERVER['REMOTE_ADDR']))
            $ipaddress = $_SERVER['REMOTE_ADDR'];

        
        $fraudHeaders['Gov-Client-Public-IP'] = $ipaddress;//$_SERVER['REMOTE_ADDR'];
        $fraudHeaders['Gov-Client-Public-Port'] = $_SERVER['REMOTE_PORT'];
        $fraudHeaders['Gov-Client-Device-ID'] = 'f5c486f7-e2d1-11ea-8ec3-c68f78acf4c5';//'';
        $fraudHeaders['Gov-Client-User-IDs'] = "Silverow=".$this->arrUser['user_no'];//$this->arrUser['id'];
        $fraudHeaders['Gov-Client-Timezone'] = $attr['fraudHeaders']->timezone;
        $fraudHeaders['Gov-Client-Local-IPs'] = $attr['fraudHeaders']->clientLocalIP;//'';
        $fraudHeaders['Gov-Client-Screens'] = $attr['fraudHeaders']->screens;
        $fraudHeaders['Gov-Client-Window-Size'] = $attr['fraudHeaders']->window;
        $fraudHeaders['Gov-Client-Browser-Plugins'] = $attr['fraudHeaders']->browserPlugins;
        $fraudHeaders['Gov-Client-Browser-JS-User-Agent'] = $attr['fraudHeaders']->userAgent;
        $fraudHeaders['Gov-Client-Browser-Do-Not-Track'] = $attr['fraudHeaders']->doNotTrack;
        $fraudHeaders['Gov-Client-Multi-Factor'] = '';
        $fraudHeaders['Gov-Vendor-Version'] = $attr['fraudHeaders']->applicationVersion;
        $fraudHeaders['Gov-Vendor-License-IDs'] = '';
        $fraudHeaders['Gov-Vendor-Public-IP'] = $_SERVER['SERVER_ADDR'];
        $fraudHeaders['Gov-Vendor-Forwarded'] = "by=" . $fraudHeaders['Gov-Vendor-Public-IP'] . "&for=" . $fraudHeaders['Gov-Client-Public-IP'];
        
        $headers = [
            'Accept: application/vnd.hmrc.1.0+json',
            'Authorization: Bearer ' . $attr['accessData']->access_token,
            'Content-Type: application/json',
            'Gov-Client-Connection-Method: WEB_APP_VIA_SERVER',
            'Gov-Client-Public-IP: ' . $fraudHeaders['Gov-Client-Public-IP'],
            'Gov-Client-Public-Port: ' . $fraudHeaders['Gov-Client-Public-Port'],
            'Gov-Client-Device-ID: ' . $fraudHeaders['Gov-Client-Device-ID'],
            'Gov-Client-User-IDs: ' . $fraudHeaders['Gov-Client-User-IDs'],
            'Gov-Client-Timezone: ' . $fraudHeaders['Gov-Client-Timezone'],
            'Gov-Client-Local-IPs: ' . $fraudHeaders['Gov-Client-Local-IPs'],
            'Gov-Client-Screens: ' . $fraudHeaders['Gov-Client-Screens'],
            'Gov-Client-Window-Size: ' . $fraudHeaders['Gov-Client-Window-Size'],
            'Gov-Client-Browser-Plugins: ' . $fraudHeaders['Gov-Client-Browser-Plugins'],
            'Gov-Client-Browser-JS-User-Agent: ' . $fraudHeaders['Gov-Client-Browser-JS-User-Agent'],
            'Gov-Client-Browser-Do-Not-Track: ' . $fraudHeaders['Gov-Client-Browser-Do-Not-Track'],
            'Gov-Client-Multi-Factor: ' . $fraudHeaders['Gov-Client-Multi-Factor'],
            'Gov-Vendor-Version: ' . $fraudHeaders['Gov-Vendor-Version'],
            'Gov-Vendor-License-IDs: ' . $fraudHeaders['Gov-Vendor-License-IDs'],
            'Gov-Vendor-Public-IP: ' . $fraudHeaders['Gov-Vendor-Public-IP'],
            'Gov-Vendor-Forwarded: ' . $fraudHeaders['Gov-Vendor-Forwarded'],
        ];

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $server_output = curl_exec ($ch);
        $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        curl_close ($ch);
        $response['statusCode'] = $httpcode;
        if ($httpcode != 200){
            $response['errors'] = json_decode($server_output);
            $response['ack'] = false;
        }
        else{
            $response['response'] = json_decode($server_output);
            $response['ack'] = true;
        }
        return $response;
    }

    function getHMRCToken($attr){

        $Sql = "SELECT * FROM hmrc_tokens where company_id = " . $this->arrUser['company_id'];
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
            $response['response'] = $Row;
        }

        $response['ack'] = 1;
        $response['null'] = null;
        return $response;
    }

    function takeAuthorizationCode ($attr){
        //  https://test-api.service.hmrc.gov.uk
        $endpoint_url = 'https://api.service.hmrc.gov.uk/oauth/token';
        $redirect_url = WEB_PATH . '/api/setup/general/takeAuthorizationCode';
        $data_to_post = [
            'client_secret' => HMRC_SECRET,
            'client_id' => HMRC_ID,
            'grant_type' => 'authorization_code',
            'code' => $attr['code'],
            'redirect_uri' => $redirect_url
        ];
        $options = [
            CURLOPT_URL        => $endpoint_url,
            CURLOPT_POST       => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POSTFIELDS => $data_to_post,
        ];
        $curl = curl_init();
        curl_setopt_array($curl, $options);
        $response = json_decode(curl_exec($curl));
        $error = curl_error($curl);
        if (!$error){
            if ($response->error){
                echo "something went wrong.. please retry..<script>setTimeout (window.close, 5000);</script>";
            }
            else{
                // now is the time to put the credentials in db
                $sqlDelete = "DELETE FROM hmrc_tokens WHERE scope = '".$response->scope."' and company_id = " . $this->arrUser['company_id'] . ";";
                $RS = $this->CSI($sqlDelete);
                $sqlInsert = "INSERT INTO hmrc_tokens set 
                                    scope = '".$response->scope."',
                                    access_token = '".$response->access_token."',
                                    refresh_token = '".$response->refresh_token."',
                                    user_id = '".$this->arrUser['id']."',
                                    company_id = '".$this->arrUser['company_id']."'
                                    ";
                $RS = $this->CSI($sqlInsert);
                 echo "<script>setTimeout (window.close, 2000);</script>";
            }
        }
        exit;
    }

    function getEmailJSON ($attr){
        $mailConfigObj = (object)array();
        $mailConfigObj->id = $this->arrUser['id'];
        $mailConfigObj->token = $attr['token'];

        

        require_once(SERVER_PATH . "/classes/Mail.php");        
        $this->objMail = new Mail($this->arrUser);
    
        $userEmailConfigurations = $this->objMail->getMailConfigurations();
        $response['userEmailConfigurations'] = $userEmailConfigurations;

        $virtualEmails = $this->objMail->getVirtualEmails();
        $response['virtualEmails'] = $virtualEmails;

        // removing table email_defaults_for_user from db as it is not being used
        // 
        // $defaultUserEmailSQL = "SELECT default_email FROM email_defaults_for_user WHERE template_name = '$attr[templateName]' AND user_id='" . $this->arrUser['id'] . "' AND 
        // company_id='" . $this->arrUser['company_id'] . "'";
        // // echo $defaultUserEmailSQL;exit;
        // $RS = $this->CSI($defaultUserEmailSQL);
        // if ($RS->RecordCount() > 0) {
        //     $response['default_email'] = $RS->FetchRow()[0];
        // }


        $id = "";
        $Sql = "SELECT id,json FROM auto_email_templates WHERE company_id = " . $this->arrUser['company_id'] . " AND mainModule = '".$attr['mainModule']."' AND template_name = '".$attr['templateName']."' ";
        // echo $Sql;exit;
        if ($attr['fromSetup']){
            $RS = $this->CSI($Sql,'auto_email_config',sr_ViewPermission);
        }
        else{
            $RS = $this->CSI($Sql);
        }
        if ($RS->RecordCount() > 0) {
            $record = $RS->FetchRow();
            $id = $record['id'];
            $txt = $record['json'];
        }
        elseif(isset($attr['mainModule']) && isset($attr['templateName'])){
            $filePath = SERVER_PATH . "/autoEmailTemplates/".$attr['mainModule']."_".$attr['templateName']. ".json";
            $myfile = fopen($filePath , "r");
            $txt = fread($myfile, filesize($filePath));
            fclose($myfile);
        }
        

        if ($txt){
            $response['id'] = $id;
            $txt = preg_replace('/\R+/', " ", $txt);
            $response['template'] = json_decode($txt);
            // removing table email_defaults_for_user from db as it is not being used
            // if (empty($response['default_email'])){
            //     // if there is no default set by the user, the template default will be the user's default
            // }

            /* $actualFileName = $response['template']->fileName;

            if($actualFileName){
                $key = hash('sha256', SECRET_KEY);
                $iv = substr(hash('sha256', SECRET_IV), 0, 16);
                $outputInvName = openssl_encrypt($actualFileName, SECRET_METHOD, $key, 0, $iv);
                $outputInvName = base64_encode($outputInvName);

                $outputInvNamePath = WEB_PATH . '/api/setup/document?alpha='.$outputInvName; 
                $response['outputInvNamePath'] = $outputInvNamePath; 
            } */

            $response['default_email'] = $response['template']->senderEmail;
            $response['ack'] = 1;
            $response['error'] = null;
        }
        else{
            $response['ack'] = 0;
            $response['error'] = null;
        }
        return $response;
    }

    function bringEmployeeEmailsAddresses($attr){

        // print_r($attr);exit;
        $Sql = "SELECT id,user_email FROM employees WHERE status <> -1 and company_id = ".$this->arrUser['company_id'];
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response'][] = $Row;
            }   
            
        } else {
            $response['response'] = array();
        }


        if (count($response['response'])){
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function bringEmailsFromModule($attr){
        if ($attr['id']){
            if ($attr['module'] == "crm"){
                $EmailSql = "SELECT c.email, 
                                GROUP_CONCAT(ac.email SEPARATOR ',') as alt_contact, 
                                GROUP_CONCAT(ad.email SEPARATOR ',') as alt_depot, 
                                GROUP_CONCAT(ad.booking_email SEPARATOR ',') as alt_depot_booking 
                            FROM crm c 
                            LEFT JOIN alt_contact ac ON c.id = ac.acc_id  AND ac.module_type = 1 
                            LEFT JOIN alt_depot ad ON c.id = ad.acc_id  AND ad.module_type = 1
                            WHERE c.id = ".$attr['id'];
                //echo $EmailSql;exit;
                $RSEmails = $this->CSI($EmailSql);
                if ($RSEmails->RecordCount() > 0) {
                    $Row = $RSEmails->FetchRow();
                    $Emails = $Row['email'] .",".$Row['alt_contact'].",".$Row['alt_depot'].",".$Row['alt_depot_booking'];
                }
            }
            else if ($attr['module'] == "customer"){
                $EmailSql = "SELECT c.email, 
                                    GROUP_CONCAT(ac.email SEPARATOR ',') as alt_contact, 
                                    GROUP_CONCAT(ad.email SEPARATOR ',') as alt_depot, 
                                    GROUP_CONCAT(ad.booking_email SEPARATOR ',') as alt_depot_booking, 
                                    fin.email as finance_email, 
                                    fin.alt_contact_email, 
                                    fin.statement_email, 
                                    fin.reminder_email, 
                                    fin.invoice_email 
                            FROM (((crm c LEFT JOIN alt_contact ac ON c.id = ac.acc_id AND ac.module_type = 1) 
                                    LEFT JOIN alt_depot ad ON c.id = ad.acc_id  AND ad.module_type = 1) 
                                    LEFT JOIN finance fin ON c.id = fin.customer_id) WHERE c.id = ".$attr['id'];
                //echo $EmailSql;exit;
                $RSEmails = $this->CSI($EmailSql);
                if ($RSEmails->RecordCount() > 0) {
                    $Row = $RSEmails->FetchRow();
                    $Emails = $Row['email'] .",".$Row['alt_contact'].",".$Row['alt_depot'].",".$Row['alt_depot_booking'].",".$Row['finance_email'].",".$Row['alt_contact_email'].",".$Row['statement_email'].",".$Row['reminder_email'].",".$Row['invoice_email'];
                    $Emails = str_replace(";",",",$Emails);
                }
            }
            else if ($attr['module'] == "srm"){
                $EmailSql = "SELECT c.email, 
                                    GROUP_CONCAT(ac.email SEPARATOR ',') as alt_contact, 
                                    GROUP_CONCAT(ad.email SEPARATOR ',') as alt_depot, 
                                    GROUP_CONCAT(ad.booking_email SEPARATOR ',') as alt_depot_booking 
                            FROM (((srm c LEFT JOIN alt_contact ac ON c.id = ac.acc_id AND ac.module_type = 2) 
                                LEFT JOIN alt_depot ad ON c.id = ad.acc_id  AND ad.module_type = 2)) 
                            WHERE c.id =". $attr['id'];
                //echo $EmailSql;exit;
                $RSEmails = $this->CSI($EmailSql);
                if ($RSEmails->RecordCount() > 0) {
                    $Row = $RSEmails->FetchRow();
                    $Emails = $Row['email'] .",".$Row['alt_contact'].",".$Row['alt_depot'].",".$Row['alt_depot_booking'];
                    $Emails = str_replace(";",",",$Emails);
                }
            }
            else if ($attr['module'] == "supplier"){
                $EmailSql = "SELECT c.email, 
                                    GROUP_CONCAT(ac.email SEPARATOR ',') as alt_contact, 
                                    GROUP_CONCAT(ad.email SEPARATOR ',') as alt_depot, 
                                    GROUP_CONCAT(ad.booking_email SEPARATOR ',') as alt_depot_booking, 
                                    fin.email as finance_email, fin.alt_contact_email, 
                                    fin.purchaseOrderEmail, fin.debitNoteEmail, 
                                    fin.remittanceAdviceEmail 
                            FROM (((srm c LEFT JOIN alt_contact ac ON c.id = ac.acc_id AND ac.module_type = 2) 
                                    LEFT JOIN alt_depot ad ON c.id = ad.acc_id AND ad.module_type = 2) 
                                    LEFT JOIN srm_finance fin ON c.id = fin.supplier_id) 
                                WHERE c.id =".$attr['id'];
                //echo $EmailSql;exit;
                $RSEmails = $this->CSI($EmailSql);
                if ($RSEmails->RecordCount() > 0) {
                    $Row = $RSEmails->FetchRow();
                    $Emails = $Row['email'] .",".$Row['alt_contact'].",".$Row['alt_depot'].",".$Row['alt_depot_booking'].",".$Row['finance_email'].",".$Row['alt_contact_email'].",".$Row['purchaseOrderEmail'].",".$Row['debitNoteEmail'].",".$Row['remittanceAdviceEmail'];
                    $Emails = str_replace(";",",",$Emails);
                }
            }
            else if ($attr['module'] == "hr"){
                $EmailSql = "SELECT user_email, work_email, personal_email, next_of_kin_email FROM employees WHERE id = ".$attr['id'];
                //echo $EmailSql;exit;
                $RSEmails = $this->CSI($EmailSql);
                if ($RSEmails->RecordCount() > 0) {
                    $Row = $RSEmails->FetchRow();
                    $Emails = $Row['user_email'] .",".$Row['work_email'].",".$Row['personal_email'].",".$Row['next_of_kin_email'];
                    $Emails = str_replace(";",",",$Emails);
                }
            }
            else if ($attr['module'] == "warehouse"){
                $EmailSql = "SELECT wrh.email, dispatchNoteEmail, GROUP_CONCAT(DISTINCT cnt.email SEPARATOR ',') as alt_contact FROM warehouse wrh LEFT JOIN warehouse_alt_contact cnt ON (wrh.id = cnt.wrh_id) WHERE wrh.id = ".$attr['id'];
                //echo $EmailSql;exit;
                $RSEmails = $this->CSI($EmailSql);
                if ($RSEmails->RecordCount() > 0) {
                    $Row = $RSEmails->FetchRow();
                    $Emails = $Row['email'] .",".$Row['dispatchNoteEmail'] . "," . $Row['alt_contact'];
                    $Emails = str_replace(";",",",$Emails);
                }
            }

            //echo $EmailSql;exit;
        }
        $Emails = array_values(array_unique(array_filter(explode(",",$Emails))));
        if ($Emails){
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['Emails'] = $Emails;
            $response['id'] = $attr['id'];
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function bringNamesFromSubModule ($attr){
        // print_r($attr);exit;
        if ($attr['subModule']->tab_id == "crm_competetor_module" || $attr['subModule']->tab_id == "cust_competetor_tab_module"){
            $Sql = "SELECT id,(SELECT title FROM competitor_properties WHERE id = compt.supplier_name) as supplier_name  FROM crm_competitor compt where crm_id = ".$attr['record'];
            //echo $Sql;exit;
            $RS = $this->CSI($Sql);
            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['name'] = $Row['supplier_name'];
                    $response['response'][] = $result;
                }   
            }
        }
        if ($attr['subModule']->tab_id == "crm_oop_cycle_tab_module" || $attr['subModule']->tab_id == "cust_oop_cycle_tab_module"){

            $Sql = "SELECT oppmain.id,oppmain.name
                FROM crm_opportunity_cycle as oppmain
                where oppmain.crm_id = ".$attr['record'];
            //echo $Sql;exit;
            $RS = $this->CSI($Sql);
            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['name'] = $Row['name'];
                    $response['response'][] = $result;
                }   
            }
        }
        if ($attr['subModule']->tab_id == "crm_price_tab_module" || $attr['subModule']->tab_id == "cust_price_tab_module"){

            $Sql = "SELECT reb.id, (CASE WHEN reb.rebate_type = 1 THEN CONCAT('Universal Rebate for the Customer ', FROM_UNIXTIME(FLOOR(reb.start_date/86400)*86400))
                                WHEN reb.rebate_type = 2 THEN CONCAT('Separate Rebate for Category(ies) ',FROM_UNIXTIME(FLOOR(reb.start_date/86400)*86400))
                                WHEN reb.rebate_type = 3 THEN CONCAT('Separate Rebate for Item(s) ',FROM_UNIXTIME(FLOOR(reb.start_date/86400)*86400))
                                ELSE ''
                                END ) AS rebate 
                    FROM rebate AS reb
                    WHERE reb.moduleID = ".$attr['record']." AND 
                          reb.company_id = ".$this->arrUser['company_id']." AND
                          reb.moduleType =1";
            //echo $Sql;exit;
            $RS = $this->CSI($Sql);
            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['name'] = $Row['rebate'];
                    $response['response'][] = $result;
                }   
            }
        } 

        if ($attr['subModule']->tab_id == "crm_promotion_tab_module" || $attr['subModule']->tab_id == "cust_promotion_tab_module"){

            $result = array();
            $result['id'] = '1';
            $result['name'] = 'Promotion Record';
            $response['response'][] = $result;
        }

        if (sizeof($response['response'])){
            $response['ack'] = 1;
            $response['error'] = NULL;
        }
        else{
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'][] = array();
        }
        return $response;
    }    
    function getRequestedFile($attr){
        $reportParam = "";
        if ($attr['report']){
            $reportParam = "&report=1";
            $basePath = TEMPLATES_PATH. '/views/invoice_templates_pdf/';
        }
        else{
            $basePath = UPLOAD_PATH . 'attachments/';
        }
        $downloadNameParam = "";
        if($attr['downloadName']){
            $downloadNameParam = "&name=".$attr['downloadName'];
        }
        if ($attr['fileName']){

            $key = hash('sha256', SECRET_KEY);
            $iv = substr(hash('sha256', SECRET_IV), 0, 16);
            $outputInvName = openssl_encrypt($attr['fileName'], SECRET_METHOD, $key, 0, $iv);
            $outputInvName = base64_encode($outputInvName);

            $response['file_url'] = WEB_PATH . '/api/setup/document?beta='.$outputInvName.$reportParam.$downloadNameParam; 

            //$file_url = $basePath . $attr['fileName'];
            //$base64 = chunk_split(base64_encode(file_get_contents($file_url)));
        }
        //$response['base64'] = $base64;
        return $response;
    }

    function bringEmployees($attr){

        $Sql = "SELECT id, user_code as code, CONCAT(first_name, ' ', last_name) as name FROM employees WHERE user_code IS NOT null AND status = 1 AND user_code <> '' AND  company_id = ".$this->arrUser['company_id'];

        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['code'] . " - " . $Row['name'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function bringNamesFromModule ($attr){

        $noRoleAssigned = $attr['noRoleAssigned'];
        $whereClauseNoRoleAssigned = '';

        if($noRoleAssigned >0){
            $whereClauseNoRoleAssigned = ' AND 1<>1 ';
        }      
        
        if ($attr['module'] == "crm"){
            /* $Sql = "SELECT id, crm_code as code, name FROM sr_crm_listing c WHERE crm_code IS NOT null AND name <> '' AND crm_code <> '' and type IN (1) AND  company_id = ".$this->arrUser['company_id']." "; */

            $Sql = " SELECT  c.id, c.crm_code as code, c.name
                     FROM sr_crm_listing c
                     WHERE c.type IN (1) AND 
                           c.company_id=" . $this->arrUser['company_id'] . " ";

            /* $Sql = " SELECT  c.id, c.crm_code as code, c.name
                     FROM crm c
                     WHERE c.type IN (1) AND 
                           c.company_id=" . $this->arrUser['company_id'] . ""; */

           // $Sql = $this->whereClauseAppender($Sql,40);
            $Sql .= " order by c.id desc ";
        }

        else if ($attr['module'] == "customer"){
            /* $Sql = "SELECT id, customer_code as code, name FROM sr_crm_listing c WHERE customer_code IS NOT null AND name <> '' AND customer_code <> '' and type IN (2,3) AND  company_id = ".$this->arrUser['company_id']." "; */

            $Sql = " SELECT  c.id, c.customer_code as code, c.name
                     FROM sr_crm_listing c
                     WHERE c.type IN (2,3) AND 
                           c.company_id=" . $this->arrUser['company_id'] . " ";

            /* $Sql = " SELECT  c.id, c.customer_code as code, c.name
                     FROM crm c
                     WHERE c.type IN (2,3) AND 
                           c.company_id=" . $this->arrUser['company_id'] . ""; */
            //$Sql = $this->whereClauseAppender($Sql,48);
            $Sql .= " order by c.id desc ";
        }

        else if ($attr['module'] == "srm"){
            $Sql = "SELECT id, srm_code as code, name FROM sr_srm_general_sel s WHERE srm_code IS NOT null AND name <> '' AND srm_code <> '' and type = 1 AND  company_id = ".$this->arrUser['company_id']." ";
            //$Sql = $this->whereClauseAppender($Sql,18);
            $Sql .= " order by s.id desc ";
        }

        else if ($attr['module'] == "supplier"){
            $Sql = "SELECT id, supplier_code as code, name FROM sr_srm_general_sel s WHERE supplier_code IS NOT null AND name <> '' AND supplier_code <> '' and type in (2,3) AND  company_id = ".$this->arrUser['company_id']." ";
            //$Sql = $this->whereClauseAppender($Sql,24);
            $Sql .= " order by s.id desc ";
        }

        else if ($attr['module'] == "items"){
            $Sql = "SELECT id, product_code as code, description as name FROM productcache prd WHERE product_code IS NOT null AND description <> '' AND product_code <> '' AND  company_id = ".$this->arrUser['company_id']." ";
            //$Sql = $this->whereClauseAppender($Sql,11);
            $Sql .= " order by prd.id desc ";
        }

        else if ($attr['module'] == "hr"){
            $Sql = "SELECT id, user_code as code, CONCAT(first_name, ' ', last_name) as name FROM employees WHERE user_code IS NOT null ".$whereClauseNoRoleAssigned." AND status <> -1 AND user_code <> '' AND
            user_type <> 1 AND  company_id = ".$this->arrUser['company_id']." order by id desc ";
        }
        else if ($attr['module'] == "warehouse"){
            $Sql = "SELECT id, wrh_code as code, name FROM warehouse WHERE wrh_code IS NOT null AND status <> -1 ".$whereClauseNoRoleAssigned." AND wrh_code <> '' AND  company_id = ".$this->arrUser['company_id']."  order by id desc";
        }

        else if ($attr['module'] == "sales"){
            $Sql = "SELECT id,CONCAT_WS('/',if(sale_quote_code = '',null,sale_quote_code),if(sale_order_code = '',null,sale_order_code),if(sale_invioce_code = '',null,sale_invioce_code)) AS code, 
                (CASE 
                    WHEN type = 0 THEN 'sales quote' 
                    WHEN type = 1 THEN 'sales order' 
                    WHEN type = 2 THEN 'sales invoice' END) AS additional,
                    sell_to_cust_name AS name 
                    FROM orderscache 
                    WHERE status = 1 AND company_id = ".$this->arrUser['company_id']."";

            /* $subQueryForBuckets = "SELECT  c.id
                                   FROM sr_crm_listing  c
                                   WHERE  c.id IS NOT NULL "; */

            /* $subQueryForBuckets = "SELECT  c.id
                                   FROM crm  c
                                   WHERE  c.type IN (2,3) AND 
                                          c.company_id=" . $this->arrUser['company_id'] . ""; */
            $subQueryForBuckets = "SELECT  c.id
                                   FROM sr_crm_listing  c
                                   WHERE  c.type IN (2,3) AND 
                                          c.company_id=" . $this->arrUser['company_id'] . "";

            //$subQueryForBuckets = $this->whereClauseAppender($subQueryForBuckets, 48);
            //echo subQueryForBuckets;exit;

            $Sql .= " AND sell_to_cust_id IN (".$subQueryForBuckets.") ";
            $Sql .= " order by id desc ";
        }

        else if ($attr['module'] == "purchase"){
            $Sql = "SELECT id,CONCAT_WS('/',order_code,if(invoice_code = '0', null,invoice_code)) AS code,
                (CASE 
                    WHEN type = 3 THEN 'purchase order' 
                    WHEN type = 2 THEN 'purchase invoice' 
                    END) AS additional,
                     sell_to_cust_name AS name 
                    FROM srm_invoicecache 
                    WHERE status = 1 AND company_id = ".$this->arrUser['company_id']."";//srm_invoice
            
            $subQueryForBuckets = " SELECT  s.supplier_code 
                                    FROM sr_srm_general_sel as s
                                    WHERE  s.type IN (2,3) AND 
                                           s.company_id=" . $this->arrUser['company_id'] . " ";
        
            //$subQueryForBuckets = $this->whereClauseAppender($subQueryForBuckets,24);
            //echo subQueryForBuckets;exit;

            $Sql .= " AND sell_to_cust_no IN (".$subQueryForBuckets.") ";
            $Sql .= " order by id desc ";
        }

        else if ($attr['module'] == "credit_note"){
            $Sql = "SELECT id,CONCAT_WS('/',return_order_code,return_invoice_code) AS code,
                (CASE 
                    WHEN type = 1 THEN 'credit_note unposted' 
                    WHEN type = 2 THEN 'credit_note posted' 
                    END) AS additional, sell_to_cust_name AS name 
                    FROM return_orders 
                    WHERE status = 1 AND company_id = ".$this->arrUser['company_id']." ";            
            
            /* $subQueryForBuckets = "SELECT  c.id
                                   FROM sr_crm_listing  c
                                   WHERE  c.id IS NOT NULL "; */
            $subQueryForBuckets = "SELECT  c.id
                                   FROM sr_crm_listing  c
                                   WHERE  c.type IN (2,3) AND 
                                          c.company_id=" . $this->arrUser['company_id'] . "";
            /* $subQueryForBuckets = "SELECT  c.id
                                   FROM crm  c
                                   WHERE  c.type IN (2,3) AND 
                                          c.company_id=" . $this->arrUser['company_id'] . ""; */

            //$subQueryForBuckets = $this->whereClauseAppender($subQueryForBuckets, 48);
            //echo subQueryForBuckets;exit;

            $Sql .= " AND sell_to_cust_id IN (".$subQueryForBuckets.") ";
            $Sql .= " order by id desc ";
        }

        else if ($attr['module'] == "debit_note"){

            $Sql = "SELECT id,CONCAT_WS('/',debitNoteCode,invoice_code) AS code,
                (CASE 
                    WHEN type = 1 THEN 'debit_note unposted' 
                    WHEN type = 2 THEN 'debit_note posted' 
                    END) AS additional, supplierName AS name 
                    FROM srm_order_returncache
                    WHERE status = 1 AND company_id = ".$this->arrUser['company_id']."";//srm_order_return
            
            $subQueryForBuckets = " SELECT  s.id 
                                    FROM sr_srm_general_sel as s
                                    WHERE s.id IS NOT NULL ";

            //$subQueryForBuckets = $this->whereClauseAppender($subQueryForBuckets,24);
            //echo subQueryForBuckets;exit;

            $Sql .= " AND supplierID IN (".$subQueryForBuckets.") ";
            $Sql .= " order by id desc ";
        }

        //$Sql .= " LIMIT 10";
        // echo $Sql;exit;
        if (empty($Sql)){
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
            return $response;
        }
        $response['module'] = $attr['module'];
        $response['q'] = $Sql;
        $RS = $this->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['additional'] = $Row['additional'];
                $result['name'] = $Row['code'] . " - " . $Row['name'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function getConfiguredEmailAddresses ($attr){
        //print_r($attr);exit;
        $Sql = "SELECT username FROM client_configuration WHERE company_id = " .  $this->arrUser['company_id'] . " AND status = 1 ";
        $RS = $this->CSI($Sql);
        //echo $Sql;exit;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                
                $response['emailList'][] = $Row['username'];
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }


    function get_hr_territories_list($attr)
    {
        return; // removing table hr_territories from db as it is not being used

        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $response = array();
        
        $Sql = "SELECT   c.id, c.name, c.status
                FROM  hr_territories  c
                left JOIN company on company.id=c.company_id
                where  c.status=1 and
                      (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")";
                      //c.user_id=".$this->arrUser['id']."
        
        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c');
        // echo $response['q'];exit;
        $RS = $this->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                /*if ($Row['status'] == 1)
                    $result['status'] = "Active";
                elseif ($Row['status'] == 2)
                    $result['status'] = "InActive";
                elseif ($Row['status'] == 0)
                    $result['status'] = "Delete";*/
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_hr_territory($arr_attr)
    {
        return; // removing table hr_territories from db as it is not being used
        $this->objGeneral->mysql_clean($arr_attr);

        $data_pass = "  `tst.name`='".$arr_attr['name']."'  ";
        $total = $this->objGeneral->count_duplicate_in_sql('hr_territories', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO hr_territories
		                            SET 
                                        status=1,
                                        name='".$arr_attr['name']."',
                                        user_id='" . $this->arrUser['id'] . "',
                                        company_id='" . $this->arrUser['company_id'] . "'";
        $RS = $this->CSI($Sql);
        $response['id'] = $this->Conn->Insert_ID();
        // $response = $this->objGeneral->run_query_exception($Sql);
        // return $response;
        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['error'] = 'Record Inserted Successfully';
        return $response;
    }

    function get_hr_territory_by_id($attr)
    {
        return; // removing table hr_territories from db as it is not being used
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM hr_territories
				WHERE id='".$attr['id']."'
				LIMIT 1";

        /*echo $Sql;
        exit;*/
        $RS = $this->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $response['response'] = $Row;
        } else {
            $response['response'] = array();
        }
        //print_r($response);exit;
        return $response;
    }

    function update_hr_territory($arr_attr)
    {
        return; // removing table hr_territories from db as it is not being used
        $this->objGeneral->mysql_clean($arr_attr);

        $id = $arr_attr['id'];

        $data_pass = "  (tst.name='" . $arr_attr['name'] . "'  AND tst.id <> '" . $id . "')";
        $total = $this->objGeneral->count_duplicate_in_sql('hr_territories', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE hr_territories
                            SET
                                name='".$arr_attr['name']."',
                                ChangedBy='" . $this->arrUser['id'] . "',
                                ChangedOn='" . current_date . "'
                                WHERE id = " . $id . "   Limit 1";
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['id'] = $id;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record Updated Successfully';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not Updated!';
        }
        return $response;
    }

    /* function getBucketFilterData(){
        $Sql = "SELECT * FROM bucket_config WHERE status = 1 ORDER BY group_order,`rank` ";
        // echo $Sql;exit;
        $RS = $this->CSI($Sql);
        // $Row = $RS->FetchRow();
        //     foreach ($Row as $key => $value) {
        //         if (is_numeric($key))
        //             unset($Row[$key]);
        //     }
        // $result = [];
        
        $moduleName = "module";
        $response = [];
        $response['response'] = array();
        // error_reporting(E_ALL);
        echo '<pre> ';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                //echo $Row['field_name'];
                switch ($Row['module_id']){
                    case 1: $moduleName = "HR";break;
                    case 11: $moduleName = "Item";break;
                    case 48: $moduleName = "Customer"; break;
                    case 65: $moduleName = "General Ledger";break;
                    case 40: $moduleName = "CRM";break;
                    case 18: $moduleName = "SRM";break;
                    case 24: $moduleName = "Supplier"; break;
                }

                
                // echo $Row['sql'];
                //$Row['sql'] = "";
                if ($Row['sql'] != ""){
                    $SqlInner = $Row['sql'];
                    $SqlWhere = "";
                    if ($Row['where_clause'] == 1){
                        
                        if ($Row['group_clause'] != ""){
                            $SqlInner .= " " . $Row['group_clause'] . " ";
                        }
                    }
                    else{
                        $SqlWhere = " WHERE company_id = ".$this->arrUser['company_id'];
                        $SqlInner .= $SqlWhere;
                        if ($Row['where_clause'] != ""){
                            $SqlInner .= " AND " . $Row['where_clause'] . " ";
                        }
                        if ($Row['group_clause'] != ""){
                            $SqlInner .= " " . $Row['group_clause'] . " ";
                        }
                    }
                    echo 'Main Level= ';
                    echo $SqlInner;
                    // 
                    $RSResult = $this->CSI($SqlInner);
                    if ($RSResult->RecordCount() > 0) {
                        
                        while ($Row2 = $RSResult->FetchRow()) {
                            
                            // $rowResult = [];
                            
                            $rowResult = array();
                            $rowResultMeta = array();

                            $rowResult['id'] = $Row2[0];
                            $rowResult['name'] = trim($Row2[1]);  

                            // echo 'Level-A = ';
                            // print_r($rowResult);
                            

                                                     

                            $rowResultMeta['field_name'] = $Row['field_name'];
                            $rowResultMeta['display_field_name'] = $Row['display_field_name'];
                            $rowResultMeta['foreign_key_id'] = $Row['foreign_key_id'];
                            $rowResultMeta['foreign_key_name'] = $Row['foreign_key_name'];
                            $rowResultMeta['module_name'] = $moduleName;
                            $rowResultMeta['is_numeric'] = $Row['is_numeric'];
                            $rowResultMeta['limitedFields'] = $Row['limitedFields'];
                            echo 'Level1A = ';
                            print_r($rowResultMeta); 
                            echo 'Level2A = ';
                            
                            print_r($response);
                            echo 'Level3A = ';
                            // print_r($response['response'][$moduleName]);
                            error_reporting(E_ALL);
                            // print_r($response['response'][$moduleName][$Row['display_field_name']]);

                            

                            $response['response'][$moduleName][$Row['display_field_name']]['meta'] = $rowResultMeta;
                            $response['response'][$moduleName][$Row['display_field_name']]['data'][] = $rowResult;
                            $response['response'][$moduleName]["id"] = $Row['module_id'];
                            $response['response'][$moduleName]['order'] = $Row['group_order'];

                            
                        }
                    }
                    else{
                        // $rowResult = [];
                        $rowResult = array();
                        $rowResultMeta = array();

                        $rowResultMeta['field_name'] = $Row['field_name'];
                        $rowResultMeta['display_field_name'] = $Row['display_field_name'];
                        $rowResultMeta['foreign_key_id'] = $Row['foreign_key_id'];
                        $rowResultMeta['foreign_key_name'] = $Row['foreign_key_name'];
                        $rowResultMeta['module_name'] = $moduleName;
                        $rowResultMeta['is_numeric'] = $Row['is_numeric'];
                        $rowResultMeta['limitedFields'] = $Row['limitedFields'];
                        $response['response'][$moduleName][$Row['display_field_name']]['meta'] = $rowResultMeta;
                        $response['response'][$moduleName][$Row['display_field_name']]['data'][] = $rowResult;
                        $response['response'][$moduleName]["id"] = $Row['module_id'];
                        $response['response'][$moduleName]['order'] = $Row['group_order'];

                        // echo 'Level3A = ';
                        //     print_r($response);
                    }                    
                }
                else{
                    // $rowResultMeta = [];
                    // $rowResult = array();
                    $rowResultMeta = array();
                    $rowResultMeta['field_name'] = $Row['field_name'];
                    $rowResultMeta['display_field_name'] = $Row['display_field_name'];
                    $rowResultMeta['foreign_key_id'] = $Row['foreign_key_id'];
                    $rowResultMeta['foreign_key_name'] = $Row['foreign_key_name'];
                    $rowResultMeta['module_name'] = $moduleName;  
                    $rowResultMeta['is_numeric'] = $Row['is_numeric'];
                    $rowResultMeta['limitedFields'] = $Row['limitedFields'];
                    $response['response'][$moduleName][$Row['display_field_name']]['meta'] = $rowResultMeta;
                    $response['response'][$moduleName]["id"] = $Row['module_id'];
                    
                    $response['response'][$moduleName]['order'] = $Row['group_order'];

                    // echo 'Level4A = ';
                    //         print_r($response);
                }                
            }
            //exit;
            //print_r($response);
            //print_r($result);exit;
            //print_r($result);exit;
            //$response['response'] = $result;
        }
        exit;
        $response['ack'] = 1;
            $response['error'] = NULL;
        return $response;
    } */

    function getBucketFilterData(){
        $Sql = "SELECT * FROM bucket_config WHERE status = 1 ORDER BY group_order,`rank` ";
        //echo $Sql;exit;
        $RS = $this->CSI($Sql);
        $result = [];
        $moduleName = "module";
        $response = [];
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                //echo $Row['field_name'];
                switch ($Row['module_id']){
                    case 1: $moduleName = "HR";break;
                    case 11: $moduleName = "Item";break;
                    case 48: $moduleName = "Customer"; break;
                    case 65: $moduleName = "General Ledger";break;
                    case 40: $moduleName = "CRM";break;
                    case 18: $moduleName = "SRM";break;
                    case 24: $moduleName = "Supplier"; break;
                }
                //echo $Row['sql'];
                //$Row['sql'] = "";
                if ($Row['sql'] != ""){
                    $SqlInner = $Row['sql'];
                    $SqlWhere = "";
                    if ($Row['where_clause'] == 1){
                        
                        if ($Row['group_clause'] != ""){
                            $SqlInner .= " " . $Row['group_clause'] . " ";
                        }
                    }
                    else{
                        $SqlWhere = " WHERE company_id = ".$this->arrUser['company_id'];
                        $SqlInner .= $SqlWhere;
                        if ($Row['where_clause'] != ""){
                            $SqlInner .= " AND " . $Row['where_clause'] . " ";
                        }
                        if ($Row['group_clause'] != ""){
                            $SqlInner .= " " . $Row['group_clause'] . " ";
                        }
                    }
                    $RSResult = $this->CSI($SqlInner);
                    if ($RSResult->RecordCount() > 0) {
                        while ($Row2 = $RSResult->FetchRow()) {
                            $rowResult = [];
                            $rowResult['id'] = $Row2[0];
                            $rowResult['name'] = trim($Row2[1]);

                            $rowResultMeta['field_name'] = $Row['field_name'];
                            $rowResultMeta['display_field_name'] = $Row['display_field_name'];
                            $rowResultMeta['foreign_key_id'] = $Row['foreign_key_id'];
                            $rowResultMeta['foreign_key_name'] = $Row['foreign_key_name'];
                            $rowResultMeta['module_name'] = $moduleName;
                            $rowResultMeta['is_numeric'] = $Row['is_numeric'];
                            $rowResultMeta['limitedFields'] = $Row['limitedFields'];
                            $response['response'][$moduleName][$Row['display_field_name']]['meta'] = $rowResultMeta;
                            $response['response'][$moduleName][$Row['display_field_name']]['data'][] = $rowResult;
                            $response['response'][$moduleName]["id"] = $Row['module_id'];
                            $response['response'][$moduleName]['order'] = $Row['group_order'];
                        }
                    }
                    else{
                        $rowResult = [];
                        $rowResultMeta['field_name'] = $Row['field_name'];
                        $rowResultMeta['display_field_name'] = $Row['display_field_name'];
                        $rowResultMeta['foreign_key_id'] = $Row['foreign_key_id'];
                        $rowResultMeta['foreign_key_name'] = $Row['foreign_key_name'];
                        $rowResultMeta['module_name'] = $moduleName;
                        $rowResultMeta['is_numeric'] = $Row['is_numeric'];
                        $rowResultMeta['limitedFields'] = $Row['limitedFields'];
                        $response['response'][$moduleName][$Row['display_field_name']]['meta'] = $rowResultMeta;
                        $response['response'][$moduleName][$Row['display_field_name']]['data'][] = $rowResult;
                        $response['response'][$moduleName]["id"] = $Row['module_id'];
                        $response['response'][$moduleName]['order'] = $Row['group_order'];
                    }                    
                }
                else{
                    $rowResultMeta = [];
                    $rowResultMeta['field_name'] = $Row['field_name'];
                    $rowResultMeta['display_field_name'] = $Row['display_field_name'];
                    $rowResultMeta['foreign_key_id'] = $Row['foreign_key_id'];
                    $rowResultMeta['foreign_key_name'] = $Row['foreign_key_name'];
                    $rowResultMeta['module_name'] = $moduleName;  
                    $rowResultMeta['is_numeric'] = $Row['is_numeric'];
                    $rowResultMeta['limitedFields'] = $Row['limitedFields'];
                    $response['response'][$moduleName][$Row['display_field_name']]['meta'] = $rowResultMeta;
                    $response['response'][$moduleName]["id"] = $Row['module_id'];
                    
                    $response['response'][$moduleName]['order'] = $Row['group_order'];
                }                
            }
            //exit;
            //print_r($response);
            //print_r($result);exit;
            //print_r($result);exit;
            //$response['response'] = $result;
        }
        $response['ack'] = 1;
            $response['error'] = NULL;
        return $response;
    }

    function whereClauseAppender($Sql,$moduleId){
        // Created by Ahmad, this function will add Bucket Filters to the $Sql statement if any..
        //$employeeId = 83;
        //print_r($this->arrUser);exit;

        // $moduleId = 40-> CRM, 48-> Customer, 18-> SRM, 24-> Supplier, 11-> Items, 65-> GL
        if ($this->arrUser['user_type'] == 1 || $this->arrUser['user_type'] == 2){
            $WhereQueries .= " AND 1 ";
            $Sql .= $WhereQueries;
            return $Sql;
        }
        
        $employeeId = $this->arrUser['id'];
        $companyId = $this->arrUser['company_id'];
        //echo "$moduleId, $employeeId, $companyId";exit;
        // $SqlLimitIncreaser = "SET @@group_concat_max_len = 99999;";
        // $RS = $this->CSI($SqlLimitIncreaser); 
        $SqlWhere = "SELECT SR_get_bucket_where_clause($moduleId," . $companyId ."," . $employeeId . ")";
        //echo $SqlWhere;exit;
        $RS = $this->CSI($SqlWhere);
        $WhereQueries = "";

        while ($Row = $RS->FetchRow()) {
            if (!empty($Row[0])){
                $WhereQueries .= " AND (" . $Row[0] . ")";
                //print_r($Row);exit;
            }
            else{
                    $WhereQueries .= " AND 0 ";
            }            
        }

        //echo $WhereQueries;exit;
        $Sql .= $WhereQueries; 
        //echo $Sql;exit;
        return $Sql;
    }    

    function whereClauseAppenderForItem($Sql,$moduleId,$moduleType){

        $WhereQueries = "";

        if ($this->arrUser['user_type'] == 1 || $this->arrUser['user_type'] == 2){
            $WhereQueries .= " AND 1 ";
            $Sql .= $WhereQueries;
            return $Sql;
        }
        
        $employeeId = $this->arrUser['id'];
        $companyId = $this->arrUser['company_id'];

        $SqlWhere = "SELECT SR_getBucketEmployeeSpecific(".$moduleId."," . $companyId ."," . $employeeId . ")";
        //echo $SqlWhere;exit;
        $RS = $this->CSI($SqlWhere);
        $WhereQueries = "";

        while ($Row = $RS->FetchRow()) {
            if (!empty($Row[0])){
                $WhereQueries .= " AND (" . $Row[0] . ")";
            }
            else{
                    $WhereQueries .= " AND 0 ";
            }            
        }

        //echo $WhereQueries;exit;
        $Sql .= $WhereQueries; 
        //echo $Sql;exit;
        return $Sql;
    } 

    function emailPdfDocument($attr){
        $filename = $attr['filename'];
        $fileAlias = "temp";
        if (sizeof(explode(".",$filename)) == 3){
            $fileAlias = explode(".",$filename)[1];
        }
        $doc_id = (isset($attr['doc_id']) && $attr['doc_id']!='')?$attr['doc_id']:0;  

        $type = $attr['attachmentsType'];

        if($type==6) {
            $path = TEMPLATES_PATH. '/views/invoice_templates_pdf/'.$filename.'.pdf';            
        } else {
            $uploads_dir = UPLOAD_PATH . 'attachments';
            $path = $uploads_dir . "/" .$filename.'.pdf';
        }

        $result = "";
        $server_output = "";
        $file_url = $path;
        if($attr['jsonData']->templateType == "salesQuote"){
            $result->template->shortid = "r1gu5oJ13N";
            $result->data->response = $attr['jsonData'];
        } else {            
            $result->template->shortid = "SJeL63wRAV";
            $result->data = $attr['jsonData'];
        }
        

        if(file_exists($path)){
            unlink($path);
        }
        
        $fileExists = file_exists($path);

        //generate pdf here 
        // $url = 'http://silverowreports.azurewebsites.net/api/report';
        $url = 'https://silverowjsreport2.azurewebsites.net/api/report';

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);

        // echo "<pre>";print_r($result); exit;

        curl_setopt($ch, CURLOPT_POSTFIELDS,json_encode($result));  //Post Fields
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $reqheaders = [
            'Authorization: "Basic '.base64_encode("admin:admin123").'"',
            'Content-Type: application/json'              
        ];

        curl_setopt($ch, CURLOPT_HTTPHEADER, $reqheaders);
        

        $server_output = curl_exec ($ch);
        $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        $errors = curl_error($ch);

        // print_r($errors);exit;

        curl_close ($ch);               
        // header("Content-type:application/pdf");      
        try {

            // echo $file_url;
            $open = file_get_contents($file_url); 
            
            // Write the contents back to the file 
            file_put_contents($file_url, $server_output); 

        } catch (HttpException $ex) {
            echo $ex;
            $response['file_url'] = $ex;
            exit;
        } 


        if(file_exists($file_url)){
            $fileSize = filesize($path);
            $Sql = "INSERT INTO attachments SET 
                                name = '".$filename.".pdf',
                                description = '".$filename.".pdf',
                                alias = '".$fileAlias."',
                                size = ".$fileSize.",
                                fileType = 'pdf',
                                path = '".$path."',
                                date_created = " . current_date_time . ",
                                date_uploaded = " . current_date_time . ",
                                user_id = ". $this->arrUser['id']. ",
                                company_id =". $this->arrUser['company_id'].",
                                type = '".$type."',
                                typeId = ".$doc_id." ";
            // echo $Sql;exit;
            $RS = $this->CSI($Sql);
            $id = $this->Conn->Insert_ID();
            if ($id > 0) {
                $response['lastId'] = $id;
                $response['ack'] = 1;
                $response['error'] = NULL;
            

                $key = hash('sha256', SECRET_KEY);
                $iv = substr(hash('sha256', SECRET_IV), 0, 16);
                $outputInvName = openssl_encrypt($filename . '.pdf', SECRET_METHOD, $key, 0, $iv);
                $outputInvName = base64_encode($outputInvName);

                // echo $filename; exit;
                $response['path'] = WEB_PATH . '/api/setup/invoice?alpha='.$outputInvName; 
                
            }
            else{
                $response['SQLack'] = 0;
                    $response['SQLError'] = 'SQL Failed. Record not inserted.';
                    $response['SQL'] = $Sql;
            }   
        }      else {
            $response['ack'] = 0;
            $response['error'] = 'PDF not generated.';    
        }               
          
        return $response; 
    }


    function printPdfInvoice($attr){
        // print_r($attr['dataPdf']);exit; 
        //below code is to create a PDF for invoices
        
        //Coming from Js
        $filename = $attr['filename'];
        $fileAlias = "";
        if (sizeof(explode(".",$filename)) == 3){
            $fileAlias = explode(".",$filename)[1];
        }
        $file = $attr['dataPdf'];
        // $doc_id = $attr['doc_id'];
        $doc_id = (isset($attr['doc_id']) && $attr['doc_id']!='')?$attr['doc_id']:0;  

        $type = $attr['attachmentsType'];

        $module = $attr['module']; 
        $separate_by_warehouse = 0;
        $separate_by_allocation = 0;

        // error_reporting(E_ALL);
        // echo '<pre>';print_r($attr);exit;

        $company_logo_url = $attr['company_logo_url'];

        if($type == 2){
            $OptionType = 1;

            if($module == 'salesQuote'){
                $recordType = 0; 
            }
            else if($module == 'salesOrder'){
                $recordType = 1;
            }
            else if($module == 'salesDelivery'){
                $recordType = 3;
                $separate_by_warehouse = 1;
            }
            else if($module == 'salesWarehouse'){
                $recordType = 4;
                $separate_by_warehouse = 1;
                $separate_by_allocation = 1;
            } 
            else{// if($module == 'salesInvoice')
                $recordType = 2;
            }
        }
        else if($type == 3){

            $OptionType = 2;
                                        
            if($module == 'purchaseOrder'){
                $recordType = 3;
            }
            else{ // if($module == 'purchaseInvoice')
                $recordType = 1;
            }
        }
        else if($type == 4){

            $OptionType = 4;

            if($module == 'creditNote'){
                $recordType = 1;
            }
            else if($module == 'postedCreditNote'){
                $recordType = 2;
            }

        }
        else if($type == 5){

            $OptionType = 3;

            if($module == 'debitNote'){
                $recordType = 1;
            }
            else if($module == 'postedDebitNote'){
                $recordType = 2;
            }

        }
        else {
            $recordType = 2;
            $OptionType = 0;
        }

        if($type == 2 || $type == 3 || $type == 4 || $type == 5){
            $result = $this->CreatePrintTemplate($doc_id,$OptionType,$company_logo_url,$recordType,$separate_by_warehouse,$separate_by_allocation);//$rec->type

            if($result['ack'] == 1){
                // echo '<pre>'; print_r($result);exit;
                $filename = $result['invoiceName'];
            }

        }else{

        


            //MPDF Configuration
            require_once(SERVER_PATH . '/libraries/mpdf/mpdf/mpdf.php');
            $objpdf = new mPDF('utf-8','A4','5','','8','8','10','10','10','7','P');
            $objpdf->setAutoBottomMargin = 'stretch';
            $objpdf->setAutoTopMargin = 'stretch';
            $objpdf->setDisplayMode('fullpage');
            $objpdf->useOnlyCoreFonts = true;
            $objpdf->SetCompression(true);
            $objpdf->useSubstitutions = false; 
            $objpdf->simpleTables = true;
            // $objpdf->setFooter('Page {PAGENO} of {nb}');
            $objpdf->defaultfooterline=0;
            $objpdf->mirrorMargins = 1;
            // $objpdf->SetHTMLHeader($header);
            $objpdf->SetHTMLHeader('MyCustomHeader');
            $objpdf->allow_charset_conversion=true;
            $objpdf->charset_in='UTF-8';
            $objpdf->SetHTMLFooter($footer);
            // $objpdf->shrink_tables_to_fit = 1;

            // LOAD a stylesheet
            $stylesheet = file_get_contents(TEMPLATES_PATH.'/css/print.css');
            $objpdf->WriteHTML('.fa { font-family: fontawesome;}',1);
            $objpdf->WriteHTML($stylesheet,1);
            //Create PDF

            ini_set('max_execution_time', 9999);
            $objpdf->WriteHTML($file,0);

        }
        

        if($type==6) {
            $path = TEMPLATES_PATH. '/views/invoice_templates_pdf/'.$filename.'.pdf';            
        } else {

            if($type == 2 || $type == 3 || $type == 4 || $type == 5){

                $uploads_dir = UPLOAD_PATH . "attachments";
                $path = $uploads_dir . "/" .$filename;
            }
            else{

                $uploads_dir = UPLOAD_PATH . 'attachments';
                $path = $uploads_dir . "/" .$filename.'.pdf';
            }
        }

        

        if($type != 2 && $type != 3 && $type != 4 && $type != 5){

            if(file_exists($path)){
                unlink($path);
            }

            $objpdf->Output($path, 'F');
        }

        $fileSize = filesize($path);
        $fileExists = file_exists($path);

        /* echo file_exists($path);

        print_r(file_exists($path));echo $path;exit;
         */
        
        if ($fileExists > 0){

            if($type == 2 || $type == 3 || $type == 4 || $type == 5){

                    $Sql = "INSERT INTO attachments SET 
                                    name = '".$filename."',
                                    description = '".$filename."',
                                    alias = '".$fileAlias."',
                                    size = ".$fileSize.",
                                    fileType = 'pdf',
                                    path = '".$path."',
                                    date_created = " . current_date_time . ",
                                    date_uploaded = " . current_date_time . ",
                                    user_id = ". $this->arrUser['id']. ",
                                    company_id =". $this->arrUser['company_id'].",
                                    type = '".$type."',
                                    typeId = ".$doc_id." ";
            }
            else{

                $Sql = "INSERT INTO attachments SET 
                                    name = '".$filename.".pdf',
                                    description = '".$filename.".pdf',
                                    alias = '".$fileAlias."',
                                    size = ".$fileSize.",
                                    fileType = 'pdf',
                                    path = '".$path."',
                                    date_created = " . current_date_time . ",
                                    date_uploaded = " . current_date_time . ",
                                    user_id = ". $this->arrUser['id']. ",
                                    company_id =". $this->arrUser['company_id'].",
                                    type = '".$type."',
                                    typeId = ".$doc_id." ";
            }
            // echo $Sql;exit;
            $RS = $this->CSI($Sql);
            $id = $this->Conn->Insert_ID();

            if ($id > 0) {
                $response['lastId'] = $id;
                $response['ack'] = 1;
                $response['error'] = NULL;
                $response['message'] = 'Record Inserted Successfully';

                if($type == 2 || $type == 3 || $type == 4 || $type == 5){
                    
                        $response['path'] = WEB_PATH. '/upload/attachments/' . $filename;
                }
                else{

                    if($type==6)
                        $response['path'] = WEB_PATH. '/app/views/invoice_templates_pdf/' . $filename . '.pdf';
                    else
                        $response['path'] = WEB_PATH. '/upload/attachments/' . $filename . '.pdf';
                }


            } else{
                $response['SQLack'] = 0;
                $response['SQLError'] = 'SQL Failed. Record not inserted.';
                $response['SQL'] = $Sql;
            }
        } else {
            $response['ack'] = 0;
            $response['error'] = 'PDF not generated.';    
        }
        // Below code is to generate pdf and send it to the customer..
        /* if ($attr['email']){
            $response['htmlInvoice'] = $file;
            $emailObj = [];
            $emailObj['emailFromModule'] = 1;
            if ($attr['emailType'] == "salesInvoice"){
                $emailObj['subject'] = "Sales Invoice for Order No. " . $attr['emailData']->orderNo;
                $emailObj['from'] = "sales@navson.com";
                $emailObj['fromName'] = "Sales - Navson";
                $emailObj['attachmentName'] = "Sales Invoice for ".$attr['emailData']->orderNo;
                $emailObj['to'] = $attr['emailData']->customerEmail;
            }
            
            $emailObj['body'] = "PFA.";
            $emailObj['attachmentPath'] = $path;
            $this->objMail->sendMail($emailObj);
        } */
        return $response;
    }

    function CreatePrintTemplate($recID,$OptionType,$company_logo_url,$recType,$separate_by_warehouse,$separate_by_allocation){
        // $recID = '';

        // echo $recID;exit;

        $response = array();
        $result = array();
        $invoiceName = '';

        $Sql2 = "DELETE FROM doc_header WHERE doc_id = ".$recID." AND TYPE=".$OptionType." AND company_id = ".$this->arrUser['company_id'];
        //  echo $Sql2;exit;
        $RS2 = $this->CSI($Sql2);

        $Sql3 = "DELETE FROM doc_detail WHERE doc_header_id = ".$recID." AND doc_header_type=".$OptionType." AND company_id = ".$this->arrUser['company_id'];
        //  echo $Sql3;exit;
        $RS3 = $this->CSI($Sql3);

        $Sql4 = "SELECT id,additionalInformation 
                 FROM company 
                 WHERE id = " . $this->arrUser['company_id'] . " ";

        // echo $Sql4;exit;
        $RS4 = $this->CSI($Sql4);

        $additionalInformation = '';

        if ($RS4->fields['id'] > 0) 
            $additionalInformation = $RS4->fields['additionalInformation'];
        if($OptionType == 1){ //Sales Order

            $Sql4 = "INSERT INTO doc_header ( company_id, doc_id, TYPE, order_no, invoice_no, supp_cust_no, NAME, address_1, address_2, city, postcode, county, 
                                            contact_person, telephone, email, salesperson, cust_order_no, invoice_date, order_date, date_dispatched, req_recpt_del_date, delivery_date, payable_bank, payment_terms, due_date, payment_method, currency, AddedOn, AddedBy, PrintedOn, PrintedBy, notes, bank_name, account_name, sort_code, swift_code, account_no, iban, com_name, com_address_1, com_address_2, com_city, com_county, com_postcode, com_telephone, com_fax, vat_reg_no, bill_to_cust_no, cust_vat_reg_no, net_amount, grand_total, tax_amount, discount, ship_name, ship_address_1, ship_address_2, ship_city, ship_county, ship_postcode, posting_group, quote_no, user_id, cust_wh_ref, shipping_agent_code, warehouse_booking_ref, ship_ref_no, ship_delivery_time, additional_information)  
                    SELECT ".$this->arrUser['company_id'].", ".$recID.", 1, inv.sale_order_code, inv.sale_invioce_code, inv.sell_to_cust_no, inv.sell_to_cust_name, 
                            inv.sell_to_address, inv.sell_to_address2, inv.sell_to_city, inv.sell_to_post_code, inv.sell_to_county, inv.sell_to_contact_id, inv.cust_phone, inv.cust_email, inv.sale_person, inv.cust_order_no, inv.posting_date, inv.offer_date, inv.dispatch_date, inv.requested_delivery_date, inv.delivery_date, inv.bill_to_bank_name, inv.payment_terms_code, inv.due_date, inv.payment_method_code, c.code, UNIX_TIMESTAMP(NOW()), " . $this->arrUser['id'] . ", UNIX_TIMESTAMP(NOW()), " . $this->arrUser['id'] . ", externalnote, b.name, b.account_name, b.sort_code, b.swift_code, b.account_no, b.iban, com.name, com.address, com.address_2, com.city, com.county, com.postcode, com.telephone, com.fax, f.vat_reg_no, sell_to_cust_no, fi.vat_number, inv.net_amount, inv.grand_total, inv.tax_amount, inv.items_net_discount, inv.ship_to_name, inv.ship_to_address, inv.ship_to_address2, inv.ship_to_city, inv.ship_to_county, inv.ship_to_post_code, (SELECT NAME FROM ref_posting_group WHERE id=fi.posting_group_id), inv.sale_quote_code, " . $this->arrUser['id'] . ", inv.customer_warehouse_ref, inv.shipping_agent_code, inv.warehouse_booking_ref, inv.container_no, inv.ship_delivery_time, com.additionalInformation
                    FROM orders AS inv
                    LEFT JOIN finance AS fi ON fi.customer_id = inv.sell_to_cust_id
                    LEFT JOIN financial_settings AS f ON f.company_id = inv.company_id
                    LEFT JOIN company AS com ON com.id = inv.company_id
                    LEFT JOIN bank_account AS b ON b.id = inv.bill_to_bank_id
                    LEFT JOIN currency AS c ON c.id = inv.currency_id
                    WHERE inv.id=".$recID." ";
            //  echo $Sql4;exit;
            $RS4 = $this->CSI($Sql4);

            if($separate_by_allocation > 0){

                $Sql5 = "INSERT INTO doc_detail (doc_header_id, doc_header_type, company_id, TYPE,number,description,quantity,uom,warehouse,unit_price,discount_type,discount, vat_rate, total_amount,vat, discount_price,warehouse_id, warehouse_address_1, warehouse_address_2, warehouse_city, warehouse_county, warehouse_post_code, warehouse_telephone, case_qty, pallet_qty,ref_no, batch_no,volume,volume_unit,weightUnit,weight)  
                    SELECT ".$recID.",1,".$this->arrUser['company_id'].",inv.type,inv.product_code,inv.item_name,wh_alloc.quantity,inv.unit_measure,inv.warehouse,
                        inv.unit_price,inv.discount_type, inv.discount,inv.vat_name, inv.total_price,
                        inv.vat_price, inv.discount_price,inv.warehouse_id, w.address_1, w.address_2, w.city, w.county, w.postcode, w.phone, (SELECT MIN(inv.qty/us.quantity) FROM units_of_measure_setup AS us, units_of_measure AS u WHERE us.product_id=inv.item_id AND u.title='Case' AND u.company_id=".$this->arrUser['company_id']." AND us.company_id=".$this->arrUser['company_id']." AND us.cat_id=u.id) AS CaseQty,(SELECT MIN(inv.qty/us.quantity) FROM units_of_measure_setup AS us, units_of_measure AS u WHERE us.product_id=inv.item_id AND u.title='Pallet' AND u.company_id=".$this->arrUser['company_id']." AND us.company_id=".$this->arrUser['company_id']." AND us.cat_id=u.id) PalletQty,wh_alloc.container_no, wh_alloc.batch_no,
                        (uomsetup.volume * wh_alloc.quantity),
                        (CASE WHEN uomsetup.DimensionType = 1 THEN 5 ELSE uomsetup.volume_unit END),
                        uomsetup.weightunit,
                        ((CASE WHEN uomsetup.weightunit = 1 THEN (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2)) / 1000
                            ELSE (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2))
                            END) * wh_alloc.quantity) AS weight
                FROM order_details AS inv
                LEFT JOIN warehouse AS w ON inv.warehouse_id = w.id
                LEFT JOIN units_of_measure_setup AS uomsetup ON inv.unit_measure_id = uomsetup.id
                LEFT JOIN warehouse_allocation AS wh_alloc ON wh_alloc.order_id = inv.order_id AND wh_alloc.sale_order_detail_id=inv.id AND wh_alloc.type=2 AND wh_alloc.warehouse_id=w.id
                WHERE inv.order_id = ".$recID." AND inv.type=0 
                ORDER BY inv.id ASC";
                //  echo $Sql5;exit;
                
            }
            else{
                if($separate_by_warehouse > 0){

                    $Sql5 = "INSERT INTO doc_detail (doc_header_id, doc_header_type, company_id, TYPE,number,description,quantity,uom,warehouse,unit_price,discount_type,discount, vat_rate, total_amount,vat, discount_price,warehouse_id, warehouse_address_1, warehouse_address_2, warehouse_city, warehouse_county, warehouse_post_code, warehouse_telephone, case_qty, pallet_qty,volume,volume_unit,weightUnit,weight,batch_no)  
				     SELECT ".$recID.",1,".$this->arrUser['company_id'].",inv.type,inv.product_code,inv.item_name,inv.qty,inv.unit_measure,inv.warehouse,
                            inv.unit_price,inv.discount_type, inv.discount,inv.vat_name, inv.total_price,
                            inv.vat_price, inv.discount_price,inv.warehouse_id, w.address_1, w.address_2, w.city, w.county, w.postcode, w.phone, (SELECT MIN(inv.qty/us.quantity) FROM units_of_measure_setup AS us, units_of_measure AS u WHERE us.product_id=inv.item_id AND u.title='Case' AND u.company_id=".$this->arrUser['company_id']." AND us.company_id=".$this->arrUser['company_id']." AND us.cat_id=u.id) AS CaseQty,(SELECT MIN(inv.qty/us.quantity) FROM units_of_measure_setup AS us, units_of_measure AS u WHERE us.product_id=inv.item_id AND u.title='Pallet' AND u.company_id=".$this->arrUser['company_id']." AND us.company_id=".$this->arrUser['company_id']." AND us.cat_id=u.id) PalletQty,
                            (uomsetup.volume * inv.qty),
                            (CASE WHEN uomsetup.DimensionType = 1 THEN 5 ELSE uomsetup.volume_unit END),
                            uomsetup.weightunit,
                            ((CASE WHEN uomsetup.weightunit = 1 THEN (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2)) / 1000
                                ELSE (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2))
                                END) * inv.qty) AS weight,
                            (SELECT GROUP_CONCAT(wh_alloc.batch_no) AS batch
                             FROM warehouse_allocation AS wh_alloc 
                             WHERE  wh_alloc.order_id = inv.order_id AND wh_alloc.sale_order_detail_id=inv.id AND wh_alloc.type=2 AND wh_alloc.warehouse_id=w.id) AS batch_no
                    FROM order_details AS inv
                    LEFT JOIN warehouse AS w ON inv.warehouse_id = w.id
                    LEFT JOIN units_of_measure_setup AS uomsetup ON inv.unit_measure_id = uomsetup.id
                    WHERE inv.order_id = ".$recID." AND inv.type=0
                    ORDER BY inv.id ASC";
                    //  echo $Sql5;exit;

                }
                else{

                    $Sql5 = "INSERT INTO doc_detail (doc_header_id, doc_header_type, company_id, TYPE,number,description,quantity,uom,warehouse,unit_price,discount_type,discount, vat_rate, total_amount,vat, discount_price,warehouse_id, warehouse_address_1, warehouse_address_2, warehouse_city, warehouse_county, warehouse_post_code, warehouse_telephone, case_qty, pallet_qty,volume,volume_unit,weightUnit,weight,batch_no)  
				     SELECT ".$recID.",1,".$this->arrUser['company_id'].",inv.type,inv.product_code,inv.item_name,inv.qty,inv.unit_measure,inv.warehouse,
                            inv.unit_price,inv.discount_type, inv.discount,inv.vat_name, inv.total_price,
                            inv.vat_price, inv.discount_price,inv.warehouse_id, w.address_1, w.address_2, w.city, w.county, w.postcode, w.phone, (SELECT MIN(inv.qty/us.quantity) FROM units_of_measure_setup AS us, units_of_measure AS u WHERE us.product_id=inv.item_id AND u.title='Case' AND u.company_id=".$this->arrUser['company_id']." AND us.company_id=".$this->arrUser['company_id']." AND us.cat_id=u.id) AS CaseQty,(SELECT MIN(inv.qty/us.quantity) FROM units_of_measure_setup AS us, units_of_measure AS u WHERE us.product_id=inv.item_id AND u.title='Pallet' AND u.company_id=".$this->arrUser['company_id']." AND us.company_id=".$this->arrUser['company_id']." AND us.cat_id=u.id) PalletQty,
                            (uomsetup.volume * inv.qty),
                            (CASE WHEN uomsetup.DimensionType = 1 THEN 5 ELSE uomsetup.volume_unit END),
                            uomsetup.weightunit,
                            ((CASE WHEN uomsetup.weightunit = 1 THEN (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2)) / 1000
                                ELSE (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2))
                                END) * inv.qty) AS weight,
                            (SELECT GROUP_CONCAT(wh_alloc.batch_no) AS batch
                             FROM warehouse_allocation AS wh_alloc 
                             WHERE  wh_alloc.order_id = inv.order_id AND wh_alloc.sale_order_detail_id=inv.id AND wh_alloc.type=2 AND wh_alloc.warehouse_id=w.id) AS batch_no
                    FROM order_details AS inv
                    LEFT JOIN warehouse AS w ON inv.warehouse_id = w.id
                    LEFT JOIN units_of_measure_setup AS uomsetup ON inv.unit_measure_id = uomsetup.id
                    WHERE inv.order_id = ".$recID."
                    ORDER BY inv.id ASC";
                    //  echo $Sql5;exit;
                }
            }            

            $RS5 = $this->CSI($Sql5);   

            $volume = 0;
            $volume_unit = '';
            $weight = 0;
            $weightunit = '';
            $weight_permission = 0;  
            $volume_permission = 0;  

            $Sqla = "SELECT  SUM(uomsetup.volume * inv.qty) AS volume,
                        SUM((CASE WHEN uomsetup.weightunit = 1 THEN (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2)) / 1000
                            ELSE (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2))
                            END)* inv.qty) AS weight,
                        'cm3' AS volume_unit,
                        'kg' AS weightunit,
                        (SELECT weight_permission FROM orders 
                        LEFT JOIN items_weight_setup AS w ON ((w.title = 'Sales Quote' AND orders.type=0) OR 
                                (w.title = 'Sales Order' AND orders.type=1) OR 
                                (w.title = 'Sales Invoice' AND orders.type=2) ) AND 
                    orders.company_id = w.company_id WHERE orders.id= '".$recID."') AS weight_permission,
                        (SELECT volume_permission FROM orders 
                        LEFT JOIN items_weight_setup AS w ON ((w.title = 'Sales Quote' AND orders.type=0) OR 
                                (w.title = 'Sales Order' AND orders.type=1) OR 
                                (w.title = 'Sales Invoice' AND orders.type=2) ) AND 
                    orders.company_id = w.company_id WHERE orders.id= '".$recID."') AS volume_permission
                    FROM order_details AS inv
                    LEFT JOIN units_of_measure_setup AS uomsetup ON inv.unit_measure_id = uomsetup.id AND inv.type=0
                    WHERE inv.order_id='".$recID."' ";
            //echo $Sqla."<hr>"; exit;

            $rsa = $this->CSI($Sqla);

            if ($rsa->RecordCount() > 0){
                $volume = $rsa->fields['volume'];
                $volume_unit = $rsa->fields['volume_unit'];
                $weight = $rsa->fields['weight'];
                $weightunit = $rsa->fields['weightunit'];
                $weight_permission = $rsa->fields['weight_permission'];
                $volume_permission = $rsa->fields['volume_permission'];
            }


            $Sql6 = "SELECT * from doc_header WHERE doc_id = ".$recID." AND type = 1 LIMIT 1";
            //  echo $Sql6;exit;

            $RS6 = $this->CSI($Sql6); 

            if ($RS6->RecordCount() > 0) {
                
                if ($Row = $RS6->FetchRow()) {
                    
                    foreach ($Row as $key => $value) {
                        if (is_numeric($key))
                            unset($Row[$key]);
                    }
                    
                    $Row['delivery_date'] = (intval($Row['delivery_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['delivery_date']) : '';
                    $Row['order_date'] = (intval($Row['order_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['order_date']) : '';
                    $Row['due_date'] = (intval($Row['due_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['due_date']) : '';
                    $Row['req_recpt_del_date'] = (intval($Row['req_recpt_del_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['req_recpt_del_date']) : '';
                    $Row['cn_date'] = (intval($Row['cn_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['cn_date']) : '';
                    $Row['date_dispatched'] = (intval($Row['date_dispatched']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['date_dispatched']) : '';
                    $Row['invoice_date'] = (intval($Row['invoice_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['invoice_date']) : '';
                    $Row['supp_cn_date'] = (intval($Row['supp_cn_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['supp_cn_date']) : 0;
                    $Row['receipt_date'] = (intval($Row['receipt_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['receipt_date']) : 0;

                    
                    if($recType == 3 || $recType == 4){
                        $Row['doc_details_arr'] = self::get_doc_details($recID, $OptionType, 1, $this->arrUser['company_id']);
                    }
                    else{
                        $Row['doc_details_arr'] = self::get_doc_details($recID, $OptionType, 0, $this->arrUser['company_id']);
                    }

                    $Row['discount'] = 0;

                    $Row['totalVolume'] = $volume;
                    $Row['totalvolume_unit'] = $volume_unit;
                    $Row['totalweightunit'] = $weightunit;
                    $Row['totalweight'] = $weight;
                    $Row['weight_permission'] = $weight_permission;
                    $Row['volume_permission'] = $volume_permission;

                    if($recType == 3 || $recType == 4){

                        foreach ($Row['doc_details_arr'] as $rec) {

                            foreach ($rec as $snglrec) {
                                $Row['discount'] += $snglrec['discount'];
                            }
                        }

                        // print_r(json_encode($Row['doc_details_arr'] ));exit;

                        if($Row['discount'] > 0){
                            $counter =1;
                            $Row['discount'] = 0;
                            
                            foreach ($Row['doc_details_arr'] as $rec) {

                                $counter1 =0;
                                $uom_qty = 0;
                                $pallet_qty = 0;

                                foreach ($rec as $snglrec) {

                                    $discount_amount = 0;

                                    if($rec['discount_type'] == 'Value'){
                                        $discount_amount = $snglrec['discount'];
                                    }
                                    elseif($rec['discount_type'] == 'Percentage'){
                                        $discount_amount = ((($snglrec['quantity'] * $snglrec['unit_price']) * $snglrec['discount']) / 100);
                                    }
                                    else{
                                        $discount_amount = $snglrec['quantity'] * $snglrec['discount'];
                                    }

                                    $Row['doc_details_arr'][$counter][$counter1]['discount_amount'] = $discount_amount;
                                    $Row['discount'] += ROUND($discount_amount,2);

                                    if($rec['discount'] != 0) $Row['doc_details_arr'][$counter][$counter1]['discountchk'] = 1;

                                    $Row['doc_details_arr'][$counter][$counter1]['volume_permission'] = $volume_permission;
                                    $Row['doc_details_arr'][$counter][$counter1]['weight_permission'] = $weight_permission;
                                    $uom_qty += $snglrec['quantity'];
                                    $pallet_qty += $snglrec['pallet_qty'];
                                    $Row['doc_details_arr'][$counter][$counter1]['uom_qty'] += $snglrec['quantity'];
                                    $Row['doc_details_arr'][$counter][$counter1]['pallet_qty2'] += $snglrec['pallet_qty'];
                                    $counter1 ++;
                                }

                                // $Row['doc_details_arr'][$counter][$counter1]['uom_qty'] = $uom_qty;
                                // $Row['doc_details_arr'][$counter][$counter1]['pallet_qty'] = $pallet_qty;

                                $counter ++;
                            }  
                        }
                        else{

                            $counter = 0;
                            
                            foreach ($Row['doc_details_arr'] as $rec) {
                                
                                $counter1 =0;
                                $uom_qty = 0;
                                $pallet_qty = 0;                                

                                foreach ($rec as $snglrec) {
                                    $Row['doc_details_arr'][$counter][$counter1]['volume_permission'] = $volume_permission;
                                    $Row['doc_details_arr'][$counter][$counter1]['weight_permission'] = $weight_permission;
                                    // $Row['doc_details_arr'][$counter][$counter1]['company_logo_url'] = $company_logo_url;
                                    $uom_qty += $snglrec['quantity'];
                                    $pallet_qty += $snglrec['pallet_qty'];
                                    $Row['doc_details_arr'][$counter][$counter1]['uom_qty'] += $snglrec['quantity'];
                                    $Row['doc_details_arr'][$counter][$counter1]['pallet_qty2'] += $snglrec['pallet_qty'];

                                    // $Row['doc_details_arr'][$counter]['uom_qty'] += $snglrec['quantity'];
                                    // $Row['doc_details_arr'][$counter]['pallet_qty2'] += $snglrec['pallet_qty'];
                                    
                                    $counter1 ++;
                                }

                                // $Row['doc_details_arr'][$counter][$counter1]['uom_qty'] = $uom_qty;
                                // $Row['doc_details_arr'][$counter][$counter1]['pallet_qty'] = $pallet_qty;

                                $counter ++;
                            }
                        }
                    }
                    else{

                        foreach ($Row['doc_details_arr'] as $rec) {
                            $Row['discount'] += $rec['discount'];
                        }

                        if($Row['discount'] > 0){
                            $counter =0;
                            $Row['discount'] = 0;
                            
                            foreach ($Row['doc_details_arr'] as $rec) {

                                $discount_amount = 0;

                                if($rec['discount_type'] == 'Value'){
                                    $discount_amount = $rec['discount'];
                                }
                                elseif($rec['discount_type'] == 'Percentage'){
                                    $discount_amount = ((($rec['quantity'] * $rec['unit_price']) * $rec['discount']) / 100);
                                }
                                else{
                                    $discount_amount = $rec['quantity'] * $rec['discount'];
                                }

                                $Row['doc_details_arr'][$counter]['discount_amount'] = $discount_amount;
                                $Row['discount'] += ROUND($discount_amount,2);

                                if($rec['discount'] != 0) $Row['doc_details_arr'][$counter]['discountchk'] = 1;

                                $Row['doc_details_arr'][$counter]['volume_permission'] = $volume_permission;
                                $Row['doc_details_arr'][$counter]['weight_permission'] = $weight_permission;
                                $counter ++;
                            }  
                        }
                        else{
                            $counter =0;
                            
                            foreach ($Row['doc_details_arr'] as $rec) {
                                $Row['doc_details_arr'][$counter]['volume_permission'] = $volume_permission;
                                $Row['doc_details_arr'][$counter]['weight_permission'] = $weight_permission;
                                $counter ++;
                            }
                        }

                    }


                    $Row['uom_qty'] = $uom_qty;
                    $Row['pallet_qty'] = $pallet_qty;

                    $Row['shipData'] = 0;

                    if($Row['ship_name'] || $Row['ship_address_1'] || $Row['ship_address_2'] || $Row['ship_city'] || $Row['ship_postcode']){
                        $Row['shipData'] = 1;
                    }
                    
                    $Row['company_logo_url'] = $company_logo_url;
                    //"SalesOrders"

                    if($recType == 0){
                        $Row['templateType'] = 'salesQuote';
                        $invoiceName = 'SQ.'.$Row['quote_no'].'.'.$this->arrUser['company_id'] .'.pdf';
                    }
                    elseif($recType == 1){
                        $Row['templateType'] = 'salesOrder';
                        $invoiceName = 'SO.'.$Row['order_no'].'.'.$this->arrUser['company_id'] .'.pdf';
                    }
                    elseif($recType == 2){
                        $Row['templateType'] = 'salesInvoice';
                        $invoiceName = 'SI.'.$Row['invoice_no'].'.'.$this->arrUser['company_id'] .'.pdf';
                    }
                    elseif($recType == 3){
                        $Row['templateType'] = 'salesDelivery';
                        $invoiceName = 'DLN.'.$Row['order_no'].'.'.$this->arrUser['company_id'] .'.pdf';

                        
                    }
                    elseif($recType == 4){
                        $Row['templateType'] = 'salesWarehouse';
                        $invoiceName = 'WHI.'.$Row['order_no'].'.'.$this->arrUser['company_id'] .'.pdf';
                    }
                    // $attachmentPath = UPLOAD_PATH . 'attachments' . '/'.$invoiceName;

                    $basePath = UPLOAD_PATH . 'attachments/';
                    $file_url = $basePath . $invoiceName; 

                    $Row['printableAddInfo'] = $additionalInformation;                  

                    $response['response'] = $Row;
                }
                // error_reporting(E_ALL);
                $result = "";
                $server_output = "";

                if($recType == 3 || $recType == 4){

                    if($recType == 3){
                        $result->template->shortid = "t1HrT8KxFc";
                        // print_r(json_encode($response));exit;
                    }
                    elseif($recType == 4){
                        $result->template->shortid = "BJeo2KYcpN";
                        // print_r(json_encode($response));exit;
                    }

                }
                else{
                    if($this->arrUser['company_id'] == 2) $result->template->shortid = "40Xj4YP3vZ";
                    else $result->template->shortid = "r1gu5oJ13N";
                }


                $result->data = $response;

                // print_r(json_encode($result));exit;

                // $url = 'http://silverowreports.azurewebsites.net/api/report';
                $url = 'https://silverowjsreport2.azurewebsites.net/api/report';

                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_POST, 1);

                curl_setopt($ch, CURLOPT_POSTFIELDS,json_encode($result));  //Post Fields
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                
                $reqheaders = [
                    'Authorization: "Basic '.base64_encode("admin:admin123").'"',
                    'Content-Type: application/json'              
                ];

                curl_setopt($ch, CURLOPT_HTTPHEADER, $reqheaders);
                

                $server_output = curl_exec ($ch);
                $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

                $errors = curl_error($ch);

                // print_r($errors);exit;

                curl_close ($ch);               
                // header("Content-type:application/pdf");                
                
                try {
                    if (file_exists($file_url)) unlink($file_url);
                    // unlink($file_url);
                    // Open the file to get existing content 

                    // echo $file_url;
                    $open = file_get_contents($file_url); 

                    // phpinfo();                    
                    // Append a new person to the file 
                    // $open .= $server_output; 
                    
                    // Write the contents back to the file 
                    file_put_contents($file_url, $server_output); 

                } catch (HttpException $ex) {
                    echo $ex;
                    $response['file_url'] = $ex;
                    $response['invoiceName'] = '';
                    exit;
                } 
                

                if(file_exists($file_url)){
                    // $response['rejectedPdfCounter'] = 0;
                    // $response['createdPdfCounter'] = 1;
                    $response['ack'] = 1; 

                    $key = hash('sha256', SECRET_KEY);
                    $iv = substr(hash('sha256', SECRET_IV), 0, 16);
                    $outputInvName = openssl_encrypt($invoiceName, SECRET_METHOD, $key, 0, $iv);
                    $outputInvName = base64_encode($outputInvName);

                    $response['file_url'] = WEB_PATH . '/api/setup/document?alpha='.$outputInvName; 
                    $response['invoiceName'] = $invoiceName; 
                }
                else{
                    $response['ack'] = 0; 
                    $response['file_url'] = ''; 
                    $response['invoiceName'] = '';
                }                               
            }
            else{            
                $response['ack'] = 0;  
                $response['file_url'] = ''; 
                $response['invoiceName'] = '';    
                // $response['error'] = null;
                // $response['rejectedPdfCounter'] = 0;
                // $response['createdPdfCounter'] = 0;         
            } 
            // print_r($response);exit;            
            return $response;               
        }
        elseif($OptionType == 2){ //Purchase Order

            $Sql4 = "INSERT INTO doc_header ( company_id, doc_id, TYPE, order_no,invoice_no, supp_cust_no, NAME, address_1, address_2, 
                                            city, postcode, county, contact_person, telephone, email, purchaser, consignment_no, supplier_order_no, invoice_date, supplier_invoice_no, order_date, req_recpt_del_date, receipt_date, payable_bank, payment_terms, payment_method, due_date, currency, AddedOn, AddedBy, PrintedOn, PrintedBy, com_name, com_address_1, com_address_2, com_city, com_county, com_postcode, com_telephone, com_fax, bank_name, account_name, sort_code,swift_code, account_no, iban, notes, net_amount, grand_total, tax_amount, bill_to_cust_no, ship_name, ship_address_1, ship_address_2, ship_city, ship_county, ship_postcode, supp_vat_reg, posting_group, vat_reg_no, user_id)  
                    SELECT ".$this->arrUser['company_id'].", ".$recID.", 2, inv.order_code, inv.invoice_code, inv.sell_to_cust_no, inv.sell_to_cust_name, 
                            inv.sell_to_address, inv.sell_to_address2, inv.sell_to_city, inv.sell_to_post_code, inv.sell_to_county, inv.sell_to_contact_no, 
                            inv.cust_phone, inv.cust_email, inv.srm_purchase_code, inv.comm_book_in_no, inv.cust_order_no, inv.invoice_date, inv.supp_order_no, 
                            inv.order_date, inv.requested_delivery_date, inv.receiptDate, inv.payable_bank, pt.name, pm.name, inv.due_date, c.code, 
                            UNIX_TIMESTAMP(NOW()), " . $this->arrUser['id'] . ", UNIX_TIMESTAMP(NOW()), " . $this->arrUser['id'] . ", com.name, com.address, 
                            com.address_2, com.city, com.county, com.postcode, com.telephone, com.fax, b.name, b.account_name, b.sort_code, b.swift_code, b.account_no, b.iban, 
                            inv.note, inv.net_amount, inv.grand_total, inv.tax_amount, inv.bill_to_cust_no, inv.ship_to_name, inv.ship_to_address, inv.ship_to_address2, inv.ship_to_city, inv.ship_to_county, inv.ship_to_post_code, fi.vat_number, (SELECT NAME FROM ref_posting_group WHERE id=fi.posting_group_id), f.vat_reg_no, " . $this->arrUser['id'] . "
                    FROM srm_invoice AS inv
                    LEFT JOIN srm_finance AS fi ON fi.supplier_id = inv.sell_to_cust_id
                    LEFT JOIN financial_settings AS f ON f.company_id = inv.company_id
                    LEFT JOIN srm_payment_methods AS pm ON pm.id = inv.payment_method_id
                    LEFT JOIN srm_payment_terms AS pt ON pt.id = inv.payment_terms_code
                    LEFT JOIN currency AS c ON c.id = inv.currency_id
                    LEFT JOIN company AS com ON com.id = inv.company_id
                    LEFT JOIN bank_account AS b ON b.id = inv.bank_account_id
                    WHERE inv.id = ".$recID."
                    GROUP BY inv.id ";
            //  echo $Sql4;exit;
            $RS4 = $this->CSI($Sql4);

            $Sql5 = "INSERT INTO doc_detail (doc_header_id, doc_header_type, company_id, TYPE,number,description,quantity,uom,
                                             warehouse,unit_price, discount_type, discount,vat_rate,vat,total_amount, discount_amount,volume,volume_unit,weightUnit,weight)  
                    SELECT ".$recID.", 2, ".$this->arrUser['company_id'].",inv.type,inv.product_code,inv.product_name,inv.qty,inv.unit_measure,inv.warehouse,inv.unit_price,inv.discount_type,inv.discount,inv.vat,inv.vat_price,inv.total_price,inv.discount_price,
                    (uomsetup.volume * inv.qty),
                    (CASE WHEN uomsetup.DimensionType = 1 THEN 5 ELSE uomsetup.volume_unit END),
                    uomsetup.weightunit,
                    ((CASE WHEN uomsetup.weightunit = 1 THEN (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2)) / 1000
                        ELSE (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2))
                        END)* inv.qty) AS weight
                    FROM srm_invoice_detail AS inv
                    LEFT JOIN units_of_measure_setup AS uomsetup ON inv.unit_measure_id = uomsetup.id
                    WHERE inv.invoice_id = ".$recID." ";
            //  echo $Sql5;exit;
            $RS5 = $this->CSI($Sql5);

            $volume = 0;
            $volume_unit = '';
            $weight = 0;
            $weightunit = '';
            $weight_permission = 0;  
            $volume_permission = 0;    

            $Sqla = "SELECT  SUM(uomsetup.volume * inv.qty) AS volume,
                        'cm3' AS volume_unit,
                        SUM((CASE WHEN uomsetup.weightunit = 1 THEN (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2)) / 1000
                            ELSE (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2))
                            END)* inv.qty) AS weight,
                        'kg' AS weightunit,weight_permission,volume_permission
                    FROM srm_invoice_detail AS inv
                    LEFT JOIN units_of_measure_setup AS uomsetup ON inv.unit_measure_id = uomsetup.id
                    LEFT JOIN items_weight_setup AS w ON w.title = 'Purchase Order' AND inv.company_id = w.company_id
                    WHERE inv.invoice_id='".$recID."' AND inv.type=0";
            //echo $Sqla."<hr>"; exit;

            $rsa = $this->CSI($Sqla);

            if ($rsa->RecordCount() > 0){
                $volume = $rsa->fields['volume'];
                $volume_unit = $rsa->fields['volume_unit'];
                $weight = $rsa->fields['weight'];
                $weightunit = $rsa->fields['weightunit'];
                $weight_permission = $rsa->fields['weight_permission'];
                $volume_permission = $rsa->fields['volume_permission'];
            }

            $Sql6 = "SELECT * from doc_header WHERE doc_id = ".$recID." AND type = 2 LIMIT 1";
            //  echo $Sql6;exit;

            $RS6 = $this->CSI($Sql6); 

            if ($RS6->RecordCount() > 0) {
                
                if ($Row = $RS6->FetchRow()) {
                    
                    foreach ($Row as $key => $value) {
                        if (is_numeric($key))
                            unset($Row[$key]);
                    }
                    
                    $Row['delivery_date'] = (intval($Row['delivery_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['delivery_date']) : '';
                    $Row['order_date'] = (intval($Row['order_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['order_date']) : '';
                    $Row['due_date'] = (intval($Row['due_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['due_date']) : '';
                    $Row['req_recpt_del_date'] = (intval($Row['req_recpt_del_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['req_recpt_del_date']) : '';
                    $Row['cn_date'] = (intval($Row['cn_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['cn_date']) : '';
                    $Row['date_dispatched'] = (intval($Row['date_dispatched']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['date_dispatched']) : '';
                    $Row['invoice_date'] = (intval($Row['invoice_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['invoice_date']) : '';
                    $Row['supp_cn_date'] = (intval($Row['supp_cn_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['supp_cn_date']) : 0;
                    $Row['receipt_date'] = (intval($Row['receipt_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['receipt_date']) : 0;
                    
                    $Row['doc_details_arr'] = self::get_doc_details($recID, $OptionType, 0, $this->arrUser['company_id']);

                    $Row['discount'] = 0;
                    
                    $Row['totalVolume'] = $volume;
                    $Row['totalvolume_unit'] = $volume_unit;
                    $Row['totalweightunit'] = $weightunit;
                    $Row['totalweight'] = $weight;
                    $Row['weight_permission'] = $weight_permission;
                    $Row['volume_permission'] = $volume_permission;

                    foreach ($Row['doc_details_arr'] as $rec) {
                        $Row['discount'] += $rec['discount'];
                    }

                    if($Row['discount'] > 0){
                        $counter =0;
                        $Row['discount'] = 0;
                        
                        foreach ($Row['doc_details_arr'] as $rec) {

                            $discount_amount = 0;

                            if($rec['discount_type'] == 'Value'){
                                $discount_amount = $rec['discount'];
                            }
                            elseif($rec['discount_type'] == 'Percentage'){
                                $discount_amount = ((($rec['quantity'] * $rec['unit_price']) * $rec['discount']) / 100);
                            }
                            else{
                                $discount_amount = $rec['quantity'] * $rec['discount'];
                            }

                            $Row['doc_details_arr'][$counter]['discount_amount'] = $discount_amount;
                            $Row['discount'] += ROUND($discount_amount,2);

                            if($rec['discount'] != 0) $Row['doc_details_arr'][$counter]['discountchk'] = 1;   

                            $Row['doc_details_arr'][$counter]['volume_permission'] = $volume_permission;
                            $Row['doc_details_arr'][$counter]['weight_permission'] = $weight_permission;
                            $counter ++;
                        }  
                    }                    
                    else{
                        $counter =0;
                        
                        foreach ($Row['doc_details_arr'] as $rec) {
                            $Row['doc_details_arr'][$counter]['volume_permission'] = $volume_permission;
                            $Row['doc_details_arr'][$counter]['weight_permission'] = $weight_permission;
                            $counter ++;
                        }
                    }
                    $Row['shipData'] = 0;

                    if($Row['ship_name'] || $Row['ship_address_1'] || $Row['ship_address_2'] || $Row['ship_city'] || $Row['ship_postcode']){
                        $Row['shipData'] = 1;
                    }
                    
                    $Row['company_logo_url'] = $company_logo_url;   
                    $Row['printableAddInfo'] = $additionalInformation;                   
                    
                    if($recType == 2 || $recType == 3){

                        $Row['templateType'] = 'purchaseOrder';
                        $invoiceName = 'PO.'.$Row['order_no'].'.'.$this->arrUser['company_id'] .'.pdf';

                        $basePath = UPLOAD_PATH . 'attachments/';
                        $file_url = $basePath . $invoiceName;                    

                        $response['response'] = $Row;

                        $result = "";
                        $server_output = "";

                        $result->template->shortid = "r1eEV7H-hN";
                        $result->data = $response;
                    }
                    elseif($recType == 1){

                        $Row['templateType'] = 'purchaseInvoice';
                        $invoiceName = 'PI.'.$Row['invoice_no'].'.'.$this->arrUser['company_id'] .'.pdf';

                        $basePath = UPLOAD_PATH . 'attachments/';
                        $file_url = $basePath . $invoiceName;                    

                        $response['response'] = $Row;

                        $result = "";
                        $server_output = "";

                        $result->template->shortid = "BklSqUU-2V";
                        $result->data = $response;
                    }                    
                }
                // error_reporting(E_ALL);                

                $url = 'https://silverowjsreport2.azurewebsites.net/api/report';

                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_POST, 1);

                curl_setopt($ch, CURLOPT_POSTFIELDS,json_encode($result));  //Post Fields
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                
                $reqheaders = [
                    'Authorization: "Basic '.base64_encode("admin:admin123").'"',
                    'Content-Type: application/json'              
                ];

                curl_setopt($ch, CURLOPT_HTTPHEADER, $reqheaders);
                

                $server_output = curl_exec ($ch);
                $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

                $errors = curl_error($ch);

                // print_r($errors);exit;

                curl_close ($ch);                    
                
                try {
                    if (file_exists($file_url)) unlink($file_url);

                    // Open the file to get existing content 
                    $open = file_get_contents($file_url); 
                    
                    // Write the contents back to the file 
                    file_put_contents($file_url, $server_output); 

                } catch (HttpException $ex) {
                    echo $ex;
                    $response['file_url'] = $ex;
                    $response['invoiceName'] = '';
                    exit;
                }                 

                if(file_exists($file_url)){
                    $response['ack'] = 1; 

                    $key = hash('sha256', SECRET_KEY);
                    $iv = substr(hash('sha256', SECRET_IV), 0, 16);
                    $outputInvName = openssl_encrypt($invoiceName, SECRET_METHOD, $key, 0, $iv);
                    $outputInvName = base64_encode($outputInvName);

                    $response['file_url'] = WEB_PATH . '/api/setup/document?alpha='.$outputInvName; 
                    $response['invoiceName'] = $invoiceName; 
                }
                else{
                    $response['ack'] = 0; 
                    $response['file_url'] = ''; 
                    $response['invoiceName'] = ''; 
                }                               
            }
            else{            
                $response['ack'] = 0;  
                $response['file_url'] = '';   
                $response['invoiceName'] = '';     
            } 
            // print_r($response);exit;            
            return $response; 
        }
        elseif($OptionType == 3){ // Debit Note

            $Sql4 = "INSERT INTO doc_header (company_id, doc_id, TYPE, order_no,supp_cust_no, NAME, apply_to_pi_si, address_1, address_2, city, 
                                            postcode, county, contact_person, telephone, email, purchaser, supplier_ref_no, supp_cn_date, supp_cn_no, date_dispatched, supplier_receipt_date, delivery_date,payable_bank, payment_terms, payment_method, currency, AddedOn, AddedBy, PrintedOn, PrintedBy, notes,com_name, com_address_1, com_address_2, com_city, com_county, com_postcode, com_telephone, com_fax, debit_code, shipment_date, invoice_no,    net_amount, grand_total, tax_amount, discount,       vat_reg_no, supplier_order_no, supp_vat_reg, posting_group, user_id, bank_name, account_name, sort_code, swift_code, account_no, iban) 
                    SELECT ".$this->arrUser['company_id'].", ".$recID.", 3, inv.debitNoteCode, inv.supplierNo, inv.supplierName, inv.purchaseInvoice,
                            inv.supplierAddress,inv.supplierAddress2, inv.supplierCity, inv.supplierPostCode, inv.supplierCounty, inv.supplierContactName, inv.supplierContactTelephone, inv.supplierContactEmail, inv.Purchaser, inv.supplierReferenceNo, inv.supplierCreditNoteDate, inv.supplierCreditNoteNo, inv.dispatchDate, inv.supplierReceiptDate, inv.deliveryDate,inv.payable_bank, pt.name, pm.name, c.code, UNIX_TIMESTAMP(NOW()), " . $this->arrUser['id'] . ", UNIX_TIMESTAMP(NOW()), " . $this->arrUser['id'] . ", inv.note, com.name, com.address, com.address_2, com.city, com.county, com.postcode, com.telephone, com.fax, inv.invoice_code, inv.shipment_date, inv.invoice_code,inv.net_amount, inv.grand_total, inv.tax_amount, inv.items_net_discount, f.vat_reg_no, inv.supplierNo, fi.vat_number, (SELECT NAME FROM ref_posting_group WHERE id=fi.posting_group_id), " . $this->arrUser['id'] . ", b.name,b.account_name, b.sort_code, b.swift_code, b.account_no, b.iban
                    FROM srm_order_return AS inv
                    LEFT JOIN srm_finance AS fi ON fi.supplier_id = inv.supplierID
                    LEFT JOIN srm_payment_methods AS pm ON pm.id = inv.payment_method_id
                    LEFT JOIN srm_payment_terms AS pt ON pt.id = inv.payment_terms_code
                    LEFT JOIN financial_settings AS f ON f.company_id = inv.company_id
                    LEFT JOIN currency AS c ON c.id = inv.currency_id
                    LEFT JOIN company AS com ON com.id = inv.company_id
                    LEFT JOIN bank_account AS b ON b.id = inv.bank_account_id
                    WHERE inv.id = ".$recID." ";
            //  echo $Sql4;exit;
            $RS4 = $this->CSI($Sql4);

            $Sql5 = "INSERT INTO doc_detail (doc_header_id, doc_header_type, company_id, TYPE,number,description,quantity,uom,warehouse,
                                             unit_price, discount_type, discount,vat_rate, total_amount,volume,volume_unit,weightUnit,weight)  
                    SELECT ".$recID.",3,".$this->arrUser['company_id'].",inv.type,inv.product_code,inv.product_name,inv.qty,inv.unit_measure,inv.warehouse,inv.unit_price,inv.discount_type,inv.discount,inv.vat,inv.total_price,(uomsetup.volume * inv.qty),
                    (CASE WHEN uomsetup.DimensionType = 1 THEN 5 ELSE uomsetup.volume_unit END),                    uomsetup.weightunit,
                    ((CASE WHEN uomsetup.weightunit = 1 THEN (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2)) / 1000
                        ELSE (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2))
                        END) * inv.qty) AS weight
                    FROM srm_order_return_detail AS inv
                    LEFT JOIN units_of_measure_setup AS uomsetup ON inv.unit_measure_id = uomsetup.id AND inv.type = 0 
                    WHERE inv.invoice_id = ".$recID." ";
            //  echo $Sql5;exit;
            $RS5 = $this->CSI($Sql5);

            $volume = 0;
            $volume_unit = '';
            $weight = 0;
            $weightunit = '';
            $weight_permission = 0;  
            $volume_permission = 0;  

            $Sqla = "SELECT  SUM(uomsetup.volume * inv.qty) AS volume,
                        'cm3' AS volume_unit,
                        SUM((CASE WHEN uomsetup.weightunit = 1 THEN (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2)) / 1000
                            ELSE (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2))
                            END)* inv.qty) AS weight,
                        'kg' AS weightunit,weight_permission,volume_permission
                    FROM srm_order_return_detail AS inv
                    LEFT JOIN units_of_measure_setup AS uomsetup ON inv.unit_measure_id = uomsetup.id AND inv.type=0
                    LEFT JOIN items_weight_setup AS w ON w.title = 'Debit Note' AND inv.company_id = w.company_id
                    WHERE inv.invoice_id='".$recID."' ";
            //echo $Sqla."<hr>"; exit;

            $rsa = $this->CSI($Sqla);

            if ($rsa->RecordCount() > 0){
                $volume = $rsa->fields['volume'];
                $volume_unit = $rsa->fields['volume_unit'];
                $weight = $rsa->fields['weight'];
                $weightunit = $rsa->fields['weightunit'];
                $weight_permission = $rsa->fields['weight_permission'];
                $volume_permission = $rsa->fields['volume_permission'];
            }

            $Sql6 = "SELECT * from doc_header WHERE doc_id = ".$recID." AND type = 3 LIMIT 1";
            //  echo $Sql6;exit;

            $RS6 = $this->CSI($Sql6); 

            if ($RS6->RecordCount() > 0) {
                
                if ($Row = $RS6->FetchRow()) {
                    
                    foreach ($Row as $key => $value) {
                        if (is_numeric($key))
                            unset($Row[$key]);
                    }
                    
                    $Row['delivery_date'] = (intval($Row['delivery_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['delivery_date']) : '';
                    $Row['order_date'] = (intval($Row['order_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['order_date']) : '';
                    $Row['due_date'] = (intval($Row['due_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['due_date']) : '';
                    $Row['req_recpt_del_date'] = (intval($Row['req_recpt_del_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['req_recpt_del_date']) : '';
                    $Row['cn_date'] = (intval($Row['cn_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['cn_date']) : '';
                    $Row['date_dispatched'] = (intval($Row['date_dispatched']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['date_dispatched']) : '';
                    $Row['invoice_date'] = (intval($Row['invoice_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['invoice_date']) : '';
                    $Row['supp_cn_date'] = (intval($Row['supp_cn_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['supp_cn_date']) : 0;
                    $Row['receipt_date'] = (intval($Row['receipt_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['receipt_date']) : 0;
                    $Row['shipment_date'] = (intval($Row['shipment_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['shipment_date']) : 0;
                    
                    $Row['doc_details_arr'] = self::get_doc_details($recID, $OptionType, 0, $this->arrUser['company_id']);

                    $Row['discount'] = 0;

                    $Row['totalVolume'] = $volume;
                    $Row['totalvolume_unit'] = $volume_unit;
                    $Row['totalweightunit'] = $weightunit;
                    $Row['totalweight'] = $weight;
                    $Row['weight_permission'] = $weight_permission;
                    $Row['volume_permission'] = $volume_permission;


                    foreach ($Row['doc_details_arr'] as $rec) {
                        $Row['discount'] += $rec['discount'];
                    }

                    if($Row['discount'] > 0){
                        $counter =0;
                        $Row['discount'] = 0;
                        
                        foreach ($Row['doc_details_arr'] as $rec) {

                            $discount_amount = 0;

                            if($rec['discount_type'] == 'Value'){
                                $discount_amount = $rec['discount'];
                            }
                            elseif($rec['discount_type'] == 'Percentage'){
                                $discount_amount = ((($rec['quantity'] * $rec['unit_price']) * $rec['discount']) / 100);
                            }
                            else{
                                $discount_amount = $rec['quantity'] * $rec['discount'];
                            }

                            $Row['doc_details_arr'][$counter]['discount_amount'] = $discount_amount;
                            $Row['discount'] += ROUND($discount_amount,2);

                            if($rec['discount'] != 0)  $Row['doc_details_arr'][$counter]['discountchk'] = 1;  

                            $Row['doc_details_arr'][$counter]['volume_permission'] = $volume_permission;
                            $Row['doc_details_arr'][$counter]['weight_permission'] = $weight_permission;
                            $counter ++;
                        }  
                    }
                    else{
                        $counter =0;
                        
                        foreach ($Row['doc_details_arr'] as $rec) {
                            $Row['doc_details_arr'][$counter]['volume_permission'] = $volume_permission;
                            $Row['doc_details_arr'][$counter]['weight_permission'] = $weight_permission;
                            $counter ++;
                        }
                    }

                    $Row['shipData'] = 0;

                    if($Row['ship_name'] || $Row['ship_address_1'] || $Row['ship_address_2'] || $Row['ship_city'] || $Row['ship_postcode']){
                        $Row['shipData'] = 1;
                    }
                    
                    $Row['company_logo_url'] = $company_logo_url;
                    $Row['printableAddInfo'] = $additionalInformation;                      
                    
                    if($recType == 1){
                        $Row['templateType'] = 'debitNote';
                        $invoiceName = 'DN.'.$Row['order_no'].'.'.$this->arrUser['company_id'] .'.pdf';
                    }
                    elseif($recType == 2){
                        $Row['templateType'] = 'postedDebitNote';
                        $invoiceName = 'PDN.'.$Row['invoice_no'].'.'.$this->arrUser['company_id'] .'.pdf';
                    }

                    $basePath = UPLOAD_PATH . 'attachments/';
                    $file_url = $basePath . $invoiceName;                    

                    $response['response'] = $Row;
                }

                // error_reporting(E_ALL);
                $result = "";
                $server_output = "";

                $result->template->shortid = "HJQ3pU-h4";
                $result->data = $response;

                // echo '<pre>';print_r($result);exit;

                $url = 'https://silverowjsreport2.azurewebsites.net/api/report';

                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_POST, 1);

                curl_setopt($ch, CURLOPT_POSTFIELDS,json_encode($result));  //Post Fields
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                
                $reqheaders = [
                    'Authorization: "Basic '.base64_encode("admin:admin123").'"',
                    'Content-Type: application/json'              
                ];

                curl_setopt($ch, CURLOPT_HTTPHEADER, $reqheaders);
                

                $server_output = curl_exec ($ch);
                $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

                $errors = curl_error($ch);

                // print_r($errors);exit;

                curl_close ($ch);                    
                
                try {
                    if (file_exists($file_url)) unlink($file_url);

                    // Open the file to get existing content 
                    $open = file_get_contents($file_url); 
                    
                    // Write the contents back to the file 
                    file_put_contents($file_url, $server_output); 

                } catch (HttpException $ex) {
                    echo $ex;
                    $response['file_url'] = $ex;
                    $response['invoiceName'] = '';
                    exit;
                }                 

                if(file_exists($file_url)){
                    $response['ack'] = 1; 

                    $key = hash('sha256', SECRET_KEY);
                    $iv = substr(hash('sha256', SECRET_IV), 0, 16);
                    $outputInvName = openssl_encrypt($invoiceName, SECRET_METHOD, $key, 0, $iv);
                    $outputInvName = base64_encode($outputInvName);

                    $response['file_url'] = WEB_PATH . '/api/setup/document?alpha='.$outputInvName; 
                    $response['invoiceName'] = $invoiceName; 
                }
                else{
                    $response['ack'] = 0; 
                    $response['file_url'] = ''; 
                    $response['invoiceName'] = ''; 
                }                               
            }
            else{            
                $response['ack'] = 0;  
                $response['file_url'] = ''; 
                $response['invoiceName'] = '';       
            } 
            // print_r($response);exit;            
            return $response; 
        }
        elseif($OptionType == 4){ // Cedit Note

            $Sql4 = "INSERT INTO doc_header ( company_id, doc_id, TYPE, order_no, cust_code, NAME, apply_to_pi_si, address_1, address_2, city, postcode, 
                                            county, contact_person, email, telephone, salesperson, cn_date, order_date, req_recpt_del_date, receipt_date, currency, AddedOn, AddedBy, PrintedOn, PrintedBy, notes, com_name, com_address_1, com_address_2, com_city, com_county, com_postcode, com_telephone, com_fax, bill_to_cust_no, discount, grand_total, net_amount,tax_amount, vat,shipping_agent_code, shipment_method_code, cust_vat_reg_no , ship_name, ship_address_1, ship_address_2, ship_city, ship_county, ship_postcode, credit_code, bank_name,account_name,  sort_code, swift_code, account_no, iban, vat_reg_no, supp_vat_reg, posting_group, cust_order_no, invoice_no, user_id) 
                    SELECT ".$this->arrUser['company_id'].", ".$recID.", 4, inv.return_order_code, inv.sell_to_cust_no, inv.sell_to_cust_name,
                            inv.sale_invoice,inv.sell_to_address, inv.sell_to_address2, inv.sell_to_city, inv.sell_to_post_code, inv.sell_to_county, inv.sell_to_contact_no, inv.cust_email, inv.cust_phone, inv.sale_person, inv.posting_date, inv.offer_date, inv.requested_delivery_date, inv.delivery_date, c.code, UNIX_TIMESTAMP(NOW()), " . $this->arrUser['id'] . ", UNIX_TIMESTAMP(NOW()), " . $this->arrUser['id'] . ", inv.note, com.name, com.address, com.address_2, com.city, com.county, com.postcode, com.telephone, com.fax, inv.bill_to_cust_no, inv.items_net_discount,  inv.grand_total, inv.net_amount,inv.tax_amount,inv.items_net_vat, inv.shipping_agent_code, inv.shipment_method_code, fi.vat_number, inv.ship_to_name, inv.ship_to_address, inv.ship_to_address2, inv.ship_to_city, inv.ship_to_county, inv.ship_to_post_code, inv.return_invoice_code, b.display_name, b.account_name, b.sort_code, b.swift_code, b.account_no, b.iban, f.vat_reg_no, fi.vat_number, (SELECT NAME FROM ref_posting_group WHERE id=fi.posting_group_id), inv.cust_order_no, inv.return_invoice_code, " . $this->arrUser['id'] . "
                    FROM return_orders AS inv
                    LEFT JOIN currency AS c ON c.id = inv.currency_id
                    LEFT JOIN company AS com ON com.id = inv.company_id
                    LEFT JOIN finance AS fi ON fi.customer_id = inv.sell_to_cust_id
                    LEFT JOIN bank_account AS b ON b.id = fi.bank_account_id
                    LEFT JOIN financial_settings AS f ON f.company_id = inv.company_id
                    WHERE inv.id = ".$recID." ";
            //  echo $Sql4;exit;
            $RS4 = $this->CSI($Sql4);

            $Sql5 = "INSERT INTO doc_detail (doc_header_id, doc_header_type, company_id, TYPE,number,description,quantity,uom,warehouse,unit_price, 
                                             discount_type, discount,vat_rate,original_amount, discount_amount,volume,volume_unit,weightUnit,weight)  
                    SELECT ".$recID.",4,".$this->arrUser['company_id'].", inv.type,inv.product_code,inv.item_name,inv.qty,inv.unit_measure,inv.warehouse,inv.unit_price,
                           inv.discount_type,inv.discount,inv.vat_name,inv.total_price,inv.discount_price,
                    (uomsetup.volume * inv.qty),
                    (CASE WHEN uomsetup.DimensionType = 1 THEN 5 ELSE uomsetup.volume_unit END),
                    uomsetup.weightunit,
                    ((CASE WHEN uomsetup.weightunit = 1 THEN (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2)) / 1000
                        ELSE (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2))
                        END) * inv.qty) AS weight
                    FROM return_order_details AS inv
                    LEFT JOIN units_of_measure_setup AS uomsetup ON inv.unit_measure_id = uomsetup.id AND inv.type=0
                    WHERE inv.order_id = ".$recID."
                    ORDER BY inv.id ASC ";
            //  echo $Sql5;exit;
            $RS5 = $this->CSI($Sql5);

            $volume = 0;
            $volume_unit = '';
            $weight = 0;
            $weightunit = '';
            $weight_permission = 0;  
            $volume_permission = 0;  

            $Sqla = "SELECT  SUM(uomsetup.volume * inv.qty) AS volume,
                        SUM((CASE WHEN uomsetup.weightunit = 1 THEN (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2)) / 1000
                            ELSE (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2))
                            END)* inv.qty) AS weight,
                        'cm3' AS volume_unit,
                        'kg' AS weightunit,
                        (SELECT weight_permission FROM return_orders 
                        LEFT JOIN items_weight_setup AS w ON ((w.title = 'Credit Note' AND return_orders.type=1) OR 
                                (w.title = 'Posted Credit Note' AND return_orders.type=2) ) AND 
                    return_orders.company_id = w.company_id WHERE return_orders.id= '".$recID."') AS weight_permission,
                        (SELECT volume_permission FROM return_orders 
                        LEFT JOIN items_weight_setup AS w ON ((w.title = 'Credit Note' AND return_orders.type=1) OR 
                                (w.title = 'Posted Credit Note' AND return_orders.type=2) ) AND 
                    return_orders.company_id = w.company_id WHERE return_orders.id= '".$recID."') AS volume_permission
                    FROM return_order_details AS inv
                    LEFT JOIN units_of_measure_setup AS uomsetup ON inv.unit_measure_id = uomsetup.id AND inv.type=0
                    WHERE inv.order_id='".$recID."' ";
            //echo $Sqla."<hr>"; exit;

            $rsa = $this->CSI($Sqla);

            if ($rsa->RecordCount() > 0){
                $volume = $rsa->fields['volume'];
                $volume_unit = $rsa->fields['volume_unit'];
                $weight = $rsa->fields['weight'];
                $weightunit = $rsa->fields['weightunit'];
                $weight_permission = $rsa->fields['weight_permission'];
                $volume_permission = $rsa->fields['volume_permission'];
            }

            $Sql6 = "SELECT * from doc_header WHERE doc_id = ".$recID." AND type = 4 LIMIT 1";
            //  echo $Sql6;exit;

            $RS6 = $this->CSI($Sql6); 

            if ($RS6->RecordCount() > 0) {
                
                if ($Row = $RS6->FetchRow()) {
                    
                    foreach ($Row as $key => $value) {
                        if (is_numeric($key))
                            unset($Row[$key]);
                    }
                    
                    $Row['delivery_date'] = (intval($Row['delivery_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['delivery_date']) : '';
                    $Row['order_date'] = (intval($Row['order_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['order_date']) : '';
                    $Row['due_date'] = (intval($Row['due_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['due_date']) : '';
                    $Row['req_recpt_del_date'] = (intval($Row['req_recpt_del_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['req_recpt_del_date']) : '';
                    $Row['cn_date'] = (intval($Row['cn_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['cn_date']) : '';
                    $Row['date_dispatched'] = (intval($Row['date_dispatched']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['date_dispatched']) : '';
                    $Row['invoice_date'] = (intval($Row['invoice_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['invoice_date']) : '';
                    $Row['supp_cn_date'] = (intval($Row['supp_cn_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['supp_cn_date']) : 0;
                    $Row['receipt_date'] = (intval($Row['receipt_date']) > 0) ? $this->objGeneral->convert_unix_into_date($Row['receipt_date']) : 0;
                    
                    $Row['doc_details_arr'] = self::get_doc_details($recID, $OptionType, 0, $this->arrUser['company_id']);

                    $Row['discount'] = 0;

                    $Row['totalVolume'] = $volume;
                    $Row['totalvolume_unit'] = $volume_unit;
                    $Row['totalweightunit'] = $weightunit;
                    $Row['totalweight'] = $weight;
                    $Row['weight_permission'] = $weight_permission;
                    $Row['volume_permission'] = $volume_permission;

                    foreach ($Row['doc_details_arr'] as $rec) {
                        $Row['discount'] += $rec['discount'];
                    }

                    if($Row['discount'] > 0){
                        $counter =0;
                        $Row['discount'] = 0;
                        
                        foreach ($Row['doc_details_arr'] as $rec) {

                            $discount_amount = 0;

                            if($rec['discount_type'] == 'Value'){
                                $discount_amount = $rec['discount'];
                            }
                            elseif($rec['discount_type'] == 'Percentage'){
                                $discount_amount = ((($rec['quantity'] * $rec['unit_price']) * $rec['discount']) / 100);
                            }
                            else{
                                $discount_amount = $rec['quantity'] * $rec['discount'];
                            }

                            $Row['doc_details_arr'][$counter]['discount_amount'] = $discount_amount;
                            $Row['discount'] += ROUND($discount_amount,2);

                            if($rec['discount'] != 0)  $Row['doc_details_arr'][$counter]['discountchk'] = 1;  

                            $Row['doc_details_arr'][$counter]['volume_permission'] = $volume_permission;
                            $Row['doc_details_arr'][$counter]['weight_permission'] = $weight_permission;
                            $counter ++;
                        }  
                    }
                    else{
                        $counter =0;
                        
                        foreach ($Row['doc_details_arr'] as $rec) {
                            $Row['doc_details_arr'][$counter]['volume_permission'] = $volume_permission;
                            $Row['doc_details_arr'][$counter]['weight_permission'] = $weight_permission;
                            $counter ++;
                        }
                    }

                    $Row['shipData'] = 0;

                    if($Row['ship_name'] || $Row['ship_address_1'] || $Row['ship_address_2'] || $Row['ship_city'] || $Row['ship_postcode']){
                        $Row['shipData'] = 1;
                    }
                    
                    $Row['company_logo_url'] = $company_logo_url;
                    $Row['printableAddInfo'] = $additionalInformation;  
                    
                    if($recType == 1){
                        $Row['templateType'] = 'creditNote';
                        $invoiceName = 'CN.'.$Row['order_no'].'.'.$this->arrUser['company_id'] .'.pdf';
                    }
                    elseif($recType == 2){
                        $Row['templateType'] = 'postedCreditNote';
                        $invoiceName = 'PCN.'.$Row['invoice_no'].'.'.$this->arrUser['company_id'] .'.pdf';
                    }

                    $basePath = UPLOAD_PATH . 'attachments/';
                    $file_url = $basePath . $invoiceName;                    

                    $response['response'] = $Row;
                }
                //echo '<pre>';print_r($response);exit;
                // error_reporting(E_ALL);
                $result = "";
                $server_output = "";

                $result->template->shortid = "SyltHmDW3V";
                $result->data = $response;

                // echo '<pre>';print_r($result);exit;

                $url = 'https://silverowjsreport2.azurewebsites.net/api/report';

                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_POST, 1);

                curl_setopt($ch, CURLOPT_POSTFIELDS,json_encode($result));  //Post Fields
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                
                $reqheaders = [
                    'Authorization: "Basic '.base64_encode("admin:admin123").'"',
                    'Content-Type: application/json'              
                ];

                curl_setopt($ch, CURLOPT_HTTPHEADER, $reqheaders);
                

                $server_output = curl_exec ($ch);
                $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

                $errors = curl_error($ch);

                // print_r($errors);exit;

                curl_close ($ch);                    
                
                try {
                    if (file_exists($file_url)) unlink($file_url);

                    // Open the file to get existing content 
                    $open = file_get_contents($file_url); 
                    
                    // Write the contents back to the file 
                    file_put_contents($file_url, $server_output); 

                } catch (HttpException $ex) {
                    echo $ex;
                    $response['file_url'] = $ex; 
                    $response['invoiceName'] = ''; 
                    exit;
                }                 

                if(file_exists($file_url)){
                    $response['ack'] = 1; 

                    $key = hash('sha256', SECRET_KEY);
                    $iv = substr(hash('sha256', SECRET_IV), 0, 16);
                    $outputInvName = openssl_encrypt($invoiceName, SECRET_METHOD, $key, 0, $iv);
                    $outputInvName = base64_encode($outputInvName);

                    $response['file_url'] = WEB_PATH . '/api/setup/document?alpha='.$outputInvName; 
                    $response['invoiceName'] = $invoiceName;
                }
                else{
                    $response['ack'] = 0; 
                    $response['file_url'] = ''; 
                    $response['invoiceName'] = '';
                }                               
            }
            else{            
                $response['ack'] = 0;  
                $response['file_url'] = ''; 
                $response['invoiceName'] = '';       
            } 
            // print_r($response);exit;            
            return $response; 
        }      

    }

    function get_doc_details($id, $type, $separate_by_warehouse, $company_id) {
        $response = array();
        $order_by = '';

        if($separate_by_warehouse == 1)
        {
            $order_by = " ORDER BY dd.warehouse_id, dd.id";
        }
        else
        {
            $order_by = " ORDER BY dd.id";
        }

        $Sql = "SELECT dd.*,
                       dd.number AS moduleCode,
                       (CASE WHEN dd.volume_unit = 1 THEN 'mm'
                            WHEN dd.volume_unit = 2 THEN 'cm'
                            WHEN dd.volume_unit = 3 THEN 'in'
                            WHEN dd.volume_unit = 4 THEN 'm'
                            WHEN dd.volume_unit = 5 THEN 'cm3'
                            ELSE ''
                            END) AS volumeUnit,
                        (CASE WHEN dd.volume >0 THEN volume
                            ELSE '0'
                            END) AS volume,
                        (CASE WHEN dd.weight >0 THEN weight
                            ELSE '0'
                            END) AS weight,
				       'kg' AS weightUnit2,

                       (CASE WHEN (dd.company_id=133 AND dd.type =0 ) THEN (SELECT p.gtipNo FROM product AS p WHERE p.product_code =  dd.number AND p.company_id=133)
                       ELSE ''
                       END ) AS gtipNo 
                FROM doc_detail AS dd
                WHERE 
                        dd.doc_header_id = ".$id." AND 
                        dd.company_id= ".$company_id." AND 
                        dd.doc_header_type = ".$type.$order_by." ";
        // echo $Sql;exit;
        /* (CASE WHEN weightUnit = 1 THEN 'g'
                            WHEN weightUnit = 2 THEN 'Kg'
                            ELSE ''
                            END) AS weightUnit2 */
        $RS = $this->CSI($Sql);
        $prev_wh_id = 0;
        $count = 0;
        if ($RS->RecordCount() > 0) {
            if($separate_by_warehouse == 1)
            {
                while ($Row = $RS->FetchRow()) {
                    foreach ($Row as $key => $value) {
                        if (is_numeric($key))
                            unset($Row[$key]);
                    }

                    if($count == 0) $prev_wh_id = $Row['warehouse_id'];

                    elseif($prev_wh_id != $Row['warehouse_id'])
                    {
                        $prev_wh_id = $Row['warehouse_id'];
                        $count = $count + 1;
                    }
                    $response[$count][] = $Row;
                }
            }
            else
            {
                while ($Row = $RS->FetchRow()) {
                    foreach ($Row as $key => $value) {
                        if (is_numeric($key))
                            unset($Row[$key]);
                    }
                    $response[] = $Row;
                }
            }

        }
        return $response;
    }


    //------------------------------------------------

    /*   Competitor Properties include Names, Brands, Volume and Item Names, they are set up in the Setup page and can be seen in CRM > Competitor's page as Dropdowns     */

    //------------------------------------------------


    function getCompetitorPropertyListing($attr, $isAllowed)
    {
        //global $objFilters;
        //return $objFilters->get_module_listing(99, "job_title", '', '', '', '', 'title');

        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = $order_type = "";
        $response = array();

        //print_r($attr);
        if ($attr['type'] > 0)
            $where_clause = "and type= '".$attr['type']."' ";

        $Sql = "SELECT   c.*    FROM competitor_properties c   where  c.status=1  AND company_id=  ".$this->arrUser['company_id']." 	  " . $where_clause . "  ";
        $Sql .= " order by c.id DESC";
        //echo $Sql;exit;
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        //$response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        if ($isAllowed){
            $RS = $this->CSI($Sql);
        }
        else{
            $RS = $this->CSI($Sql, 'sales_crm', sr_ViewPermission);
        }
        $response['q'] = '';


        $response = array();


        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['title'] = $Row['title'];
                if (empty($attr['type'])){
                    if ($Row['type'] == 1){
                        $response['response']['namesArr'][] = $result;
                    }
                    if ($Row['type'] == 2){
                        $response['response']['brandsArr'][] = $result;
                    }
                    if ($Row['type'] == 3){
                        $response['response']['itemsArr'][] = $result;
                    }
                    if ($Row['type'] == 4){
                        $response['response']['volumesArr'][] = $result;
                    }
                }
                else
                    $response['response'][] = $result;
            }
        } else
            $response['response'][] = array();

        return $response;
    }

    function getCompetitorPropertyById($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT * FROM competitor_properties WHERE id='".$attr['id']."' LIMIT 1";
        $RS = $this->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = null;
            $response['ack'] = 1;
            $response['error'] = NULL;
        }
        return $response;
    }

    function addCompetitorProperty($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $data_pass = " tst.title = '".$attr['title']."' and tst.type = '".$attr['type']."' ";
        $total = $this->objGeneral->count_duplicate_in_sql('competitor_properties', $data_pass, $this->arrUser['company_id']);

        if ($total >0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
        $Sql = "INSERT INTO competitor_properties  SET 
                    title = '".$attr['title']."',
                    type = '".$attr['type']."',
                    company_id='" . $this->arrUser['company_id'] . "',
                    AddedOn='" .  current_date ."',
                    AddedBy='" . $this->arrUser['id'] . "',
                    status=1 ";
        //echo $Sql;exit;
        $RS = $this->CSI($Sql);
        $response['id'] = $this->Conn->Insert_ID();


        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['error'] = 'Record Inserted Successfully';

        return $response;
    }

    function updateCompetitorProperty($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "  tst.title = '".$attr['title']."' $where_id";
        $total = $this->objGeneral->count_duplicate_in_sql('competitor_properties', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }


        $Sql = "UPDATE competitor_properties SET
                        title = '".$attr['title']."',
                        ChangedOn='" .  current_date ."',
                        ChangedBy='" . $this->arrUser['id'] . "'
                        WHERE id = '".$attr['id']."'  Limit 1 ";
        //echo  $Sql;exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 2;
            $response['error'] = 'Record Updated Successfully';
        }

        return $response;
    }

    function deleteCompetitorProperty($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "Update competitor_properties Set status=0 WHERE id = ".$attr['id']." AND SR_CheckTransactionBeforeDelete(".$attr['id'].", ".$this->arrUser['company_id'].", 30,0) = 'success' ";

        //echo $Sql; exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 2;
            $response['error'] = 'Record cannot be deleted.';
        }

        return $response;
    }


    function addConfirmation($attr){

        return; // removing table confirmation_management from db as it is not being used

        $Sql = "INSERT INTO confirmation_management SET
                    secret = '$attr[secret]',
                    action = '$attr[action]',
                    action_on = '$attr[action_on]',
                    AddedBy = '" . $this->arrUser['id'] . "',
                    company_id = '" . $this->arrUser['company_id'] . "',
                    AddedOn = '" . current_date . "'
                ";
                //echo $Sql;exit;
        $RS = $this->CSI($Sql);
        $id = $this->Conn->Insert_ID();
        if ($id > 0) {
            $response['path'] = WEB_PATH;
            $response['id'] = $id;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
        }
        return $response;
    }


    function performConfirmation($attr){
        // this function will be responsible for performing actions using the confirmation links from emails..
        return; // removing table confirmation_management from db as it is not being used
        $Sql = "SELECT * FROM confirmation_management WHERE id = ".$attr['id']." and secret = '".$attr['key']."' LIMIT 1";
        //echo $Sql;exit;
        $RS = $this->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $this->arrUser['id']            =   $Row['AddedBy'];
            $this->arrUser['company_id']    =   $Row['company_id'];

            if ($Row['action'] == 1){
                // Convert Sales Order to Sales Invoice
                $response['message'] = "Sales Order Number: " . $Row['action_on'] . " will be converted to Sales Invoice.";

            }

            if ($Row['action'] == 2){
                // Convert Sales Order to Sales Invoice
                $response['message'] = "Debit Note: " . $Row['action_on'] . " will be Posted.";

            }


            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = null;
            $response['ack'] = 1;
            $response['error'] = NULL;
        }
        return $response;


    }
    
    function checkBatchForAddCost($attr)
    {
        $Sql = "SELECT s.id, s.sales_invoice_id, s.purchase_invoice_id, 
								s.product_id, s.product_code, s.total_sales_qty, s.taken_qty_from_purchase_ac, 
								s.AC1_unit_price, s.AC1_id, s.AC1_description, s.total_sales_qty, 
                                s.posting_date, o.grand_total, o.sale_invioce_code,
                                SR_Calculate_Actual_Additional_Cost(s.AC1_id, s.product_id, s.AC1_unit_price, s.taken_qty_from_purchase_ac, s.purchase_invoice_id, " . $this->arrUser["company_id"] . ") AS actual_cost
								
                                FROM `sales_invoice_accrued_additional_cost` AS s 
                                LEFT JOIN orders o on o.id = s.sales_invoice_id                         
								WHERE 
									s.type = 1 AND
									s.status = 0 AND
									s.`AC1_unit_price` IS NOT NULL AND
                                    s.company_id = " . $this->arrUser["company_id"] . " AND
                                    s.taken_qty_from_purchase_ac <= SR_Get_Paid_Additional_Cost_Qty(s.purchase_invoice_id, s.product_id, s.AC1_id);";   

        // echo $Sql;exit;
        $RS = $this->CSI($Sql, "finance", sr_ViewPermission);
        
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $Row['total_estimated_cost'] = $Row['taken_qty_from_purchase_ac'] * $Row['AC1_unit_price'];
                // $Row['actual_cost'] = 2.3;
                // $Row['total_actual_cost'] = $Row['taken_qty_from_purchase_ac'] * $Row['actual_cost'];
                $Row['total_actual_cost'] = $Row['actual_cost'];
                $Row['difference']= $Row['total_estimated_cost'] - $Row['total_actual_cost'];
                $Row['posting_date'] = $this->objGeneral->convert_unix_into_date($Row['posting_date']);
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
        } else {
            $response['ack'] = 0;
            $response['response'] = array();
        }

        return $response;
    }
	// Get Batch additional cost
	function getAdditionalCostEntries($attr)
    {
        $dateFrom = $this->objGeneral->convert_date($attr['dateFrom']);
        $dateTo = $this->objGeneral->convert_date($attr['dateTo']);

        $Sql = "SELECT s.id, s.sales_invoice_id, s.purchase_invoice_id, 
								s.product_id, s.product_code, s.total_sales_qty, s.taken_qty_from_purchase_ac, 
								s.AC1_unit_price, s.AC1_id, s.AC1_description, s.total_sales_qty, 
                                s.posting_date, o.grand_total, o.sale_invioce_code,
                                SR_Calculate_Actual_Additional_Cost(s.AC1_id, s.product_id, s.AC1_unit_price, s.taken_qty_from_purchase_ac, s.purchase_invoice_id, " . $this->arrUser["company_id"] . ") AS actual_cost
								
                                FROM `sales_invoice_accrued_additional_cost` AS s 
                                LEFT JOIN orders o on o.id = s.sales_invoice_id                         
								WHERE 
									s.type = 1 AND
									s.status = 0 AND
									s.`AC1_unit_price` IS NOT NULL AND
                                    s.company_id = " . $this->arrUser["company_id"] . " AND
									(s.posting_date BETWEEN " . $dateFrom . " AND " . $dateTo . "+1) AND
                                    s.taken_qty_from_purchase_ac <= SR_Get_Paid_Additional_Cost_Qty(s.purchase_invoice_id, s.product_id, s.AC1_id);";   

        // echo $Sql;exit;
        $RS = $this->CSI($Sql, "finance", sr_ViewPermission);
        
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $Row['total_estimated_cost'] = $Row['taken_qty_from_purchase_ac'] * $Row['AC1_unit_price'];
                // $Row['actual_cost'] = 2.3;
                // $Row['total_actual_cost'] = $Row['taken_qty_from_purchase_ac'] * $Row['actual_cost'];
                $Row['total_actual_cost'] = $Row['actual_cost'];
                $Row['difference']= $Row['total_estimated_cost'] - $Row['total_actual_cost'];
                $Row['posting_date'] = $this->objGeneral->convert_unix_into_date($Row['posting_date']);
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
        } else {
            $response['ack'] = 0;
            $response['response'] = array();
        }

        return $response;
    }

    function runAdditionalCostBatch($attr)
    {
        $dateFrom = $this->objGeneral->convert_date($attr['dateFrom']);
        $dateTo = $this->objGeneral->convert_date($attr['dateTo']);
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;

        $Sql = "CALL SR_Sales_Additional_Cost_Batch(".$dateFrom.",
                                                     ".$dateTo.", 
                                                        " . $this->arrUser["company_id"] . ", 
                                                        " . $this->arrUser["id"] . ",
                                                        @errorNo,
                                                        @param1,
                                                        @param2,
                                                        @param3,
                                                        @param4)";   

        // echo $Sql;exit;
        $RS = $this->CSI($Sql);
        if($RS->msg == 1)
        {             
            $response['ack'] = 1;
            $response['error'] = NULL;
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
            // $this->terminateWithMessage("postPurchaseInvoice");
        } 
        else {
            $response['ack'] =0;
            $response['error'] = $RS->Error;
            $response['response'] = array();
        }

        return $response;
    }

    function get_pending_approvals($attr)
    {
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.", $attr, $fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.", $attr, $fieldsMeta);

        $response = array();

        $Sql = "SELECT * FROM (SELECT ah.*,
                                (CASE
                                    WHEN ah.status = 0 THEN 'Queued for Approval'
                                    WHEN ah.status = 1 THEN 'Awaiting Approval'
                                    WHEN ah.status = 2 THEN 'Approved' 
                                    WHEN ah.status = 3 OR ah.status = 4 THEN 'Disapproved'
                                    WHEN ah.status = 7 THEN 'On Hold' 
                                END) AS statuss,
                                (CASE WHEN ah.type = 1 OR ah.type = 2 THEN (SELECT offer_date FROM orders WHERE id = ah.object_id) 
                                    WHEN ah.type = 3 OR ah.type = 8 THEN (SELECT offer_date FROM return_orders WHERE id = ah.object_id) 
                                    WHEN ah.type = 4 OR ah.type = 7 THEN (SELECT order_date FROM srm_invoice WHERE id = ah.object_id) 
                                    WHEN ah.type = 5 OR ah.type = 6  OR ah.type = 9 THEN NULL 
                                    END) AS order_date, 

                                (CASE WHEN ah.type = 1 OR ah.type = 2 THEN (SELECT posting_date FROM orders WHERE id = ah.object_id) 
                                    WHEN ah.type = 3 OR ah.type = 8 THEN (SELECT posting_date FROM return_orders WHERE id = ah.object_id) 
                                    WHEN ah.type = 4 OR ah.type = 7 THEN (SELECT invoice_date FROM srm_invoice WHERE id = ah.object_id) 
                                    WHEN ah.type = 5 OR ah.type = 6  OR ah.type = 9 THEN NULL 
                                    END) AS posting_date, 
                                (CASE
                                    WHEN ah.type = 1 OR ah.type = 2 THEN 
                                        (SELECT 
                                            net_amount
                                        FROM
                                            orders 
                                        WHERE id = ah.object_id)  
                                    WHEN ah.type = 3 OR ah.type = 8 THEN 
                                        (SELECT 
                                            net_amount 
                                        FROM
                                            return_orders 
                                        WHERE id = ah.object_id) 
                                    WHEN ah.type = 4 OR ah.type = 7 THEN 
                                        (SELECT 
                                            net_amount 
                                        FROM
                                            srm_invoice 
                                        WHERE id = ah.object_id) 
                                    WHEN ah.type = 5 THEN 
                                        (COALESCE((SELECT ROUND(SUM(es.total_sum) ,2)  
                                                    FROM employee_expenses_detail  es 
                                                    WHERE es.employee_id=ah.detail_id AND es.exp_id=ah.object_id AND es.status=1),0) + 
                                         COALESCE(( SELECT ROUND(SUM(epv.amount) ,2)  
                                                    FROM expense_personel_vehicle  epv 
                                                    WHERE epv.employee_id=ah.detail_id AND epv.expense_id=ah.object_id AND epv.status=1),0) + 
                                         COALESCE((SELECT ROUND(SUM(ecv.amount) ,2)  
                                                   FROM expense_company_vehicle  ecv
                                                   WHERE ecv.employee_id=ah.detail_id AND ecv.expense_id=ah.object_id AND ecv.status=1),0))
                                    WHEN ah.type = 6  OR ah.type = 9  THEN 
                                        NULL
                                END) AS amount_excl_vat,

                                (CASE WHEN ah.type = 1 OR ah.type = 2 THEN NULL 
                                      WHEN ah.type = 3 OR ah.type = 8 THEN NULL 
                                      WHEN ah.type = 4 OR ah.type = 7 THEN (SELECT supp_order_no FROM srm_invoice WHERE id = ah.object_id)
                                      WHEN ah.type = 5 OR ah.type = 6  OR ah.type = 9 THEN NULL 
                                      END) AS suppInvoiceNo,                                 

                                (CASE
                                    WHEN ah.type = 1 OR ah.type = 2 THEN 
                                        (SELECT 
                                            (case when type>1 THEN 0
                                                ELSE 1
                                                END) AS objectStatus
                                        FROM
                                            orders 
                                        WHERE id = ah.object_id
                                        LIMIT 1)  
                                    WHEN ah.type = 3 OR ah.type = 8 THEN 
                                        (SELECT 
                                            (case when type>1 THEN 0
                                                ELSE 1
                                                END) AS objectStatus
                                        FROM
                                            return_orders 
                                        WHERE id = ah.object_id
                                        LIMIT 1) 
                                    WHEN ah.type = 4 OR ah.type = 7 THEN 
                                        (SELECT 
                                            (case when type < 3 THEN 0
                                                ELSE 1
                                                END) AS objectStatus
                                        FROM
                                            srm_invoice 
                                        WHERE id = ah.object_id
                                        LIMIT 1)
                                    WHEN ah.type = 5 THEN 1
                                    WHEN ah.type = 6  OR ah.type = 9  THEN 1
                                    END) AS objectStatus,

                                (CASE
                                    WHEN ah.type = 1 OR ah.type = 2 THEN 
                                        (SELECT 
                                            grand_total
                                        FROM
                                            orders 
                                        WHERE id = ah.object_id)  
                                    WHEN ah.type = 3 OR ah.type = 8 THEN 
                                        (SELECT 
                                            grand_total 
                                        FROM
                                            return_orders 
                                        WHERE id = ah.object_id) 
                                    WHEN ah.type = 4 OR ah.type = 7 THEN 
                                        (SELECT 
                                            grand_total 
                                        FROM
                                            srm_invoice 
                                        WHERE id = ah.object_id) 
                                    WHEN ah.type = 5 THEN 
                                        (COALESCE((SELECT ROUND(SUM(es.total_sum) ,2)  
                                                    FROM employee_expenses_detail  es 
                                                    WHERE es.employee_id=ah.detail_id AND es.exp_id=ah.object_id AND es.status=1),0) + 
                                         COALESCE(( SELECT ROUND(SUM(epv.amount) ,2)  
                                                    FROM expense_personel_vehicle  epv 
                                                    WHERE epv.employee_id=ah.detail_id AND epv.expense_id=ah.object_id AND epv.status=1),0) + 
                                         COALESCE((SELECT ROUND(SUM(ecv.amount) ,2)  
                                                   FROM expense_company_vehicle  ecv
                                                   WHERE ecv.employee_id=ah.detail_id AND ecv.expense_id=ah.object_id AND ecv.status=1),0))
                                    WHEN ah.type = 6 THEN 
                                        NULL
                                END) AS amount_inc_vat,
                                (CASE
                                    WHEN ah.type = 1 OR ah.type = 2 THEN
                                        (Select si.order_code FROM link_so_po AS sp, srm_invoice AS si
                                            WHERE sp.saleOrderID=ah.object_id AND si.id = sp.purchaseOrderID AND sp.company_id = ".$this->arrUser['company_id']." LIMIT 1)
                                    WHEN ah.type = 3 OR ah.type = 8 THEN
                                        (Select ro.sale_invoice FROM return_orders AS ro
                                            WHERE ro.id=ah.object_id AND ro.company_id = ".$this->arrUser['company_id']." LIMIT 1)
                                    WHEN ah.type = 4 OR ah.type = 7 THEN
                                        (Select od.sale_order_code FROM link_so_po AS sp, orders AS od
                                            WHERE sp.purchaseOrderID=ah.object_id AND od.id = sp.saleOrderID AND sp.company_id = ".$this->arrUser['company_id']." LIMIT 1)
                                    ELSE
                                        NULL
                                END) AS linked_so_po,
                                (CASE
                                    WHEN ah.type = 1 OR ah.type = 2 THEN
                                        (Select si.id FROM link_so_po AS sp, srm_invoice AS si
                                            WHERE sp.saleOrderID=ah.object_id AND si.id = sp.purchaseOrderID AND sp.company_id = ".$this->arrUser['company_id']." LIMIT 1)
                                    WHEN ah.type = 3 OR ah.type = 8 THEN
                                        (Select CONCAT(ro.sale_invoice_id, '^^^^^', ro.sale_invoice_type) FROM return_orders AS ro
                                            WHERE ro.id=ah.object_id AND ro.company_id = ".$this->arrUser['company_id']." LIMIT 1)
                                    WHEN ah.type = 4 OR ah.type = 7 THEN
                                        (Select od.id FROM link_so_po AS sp, orders AS od
                                            WHERE sp.purchaseOrderID=ah.object_id AND od.id = sp.saleOrderID AND sp.company_id = ".$this->arrUser['company_id']." LIMIT 1)
                                    ELSE
                                        NULL
                                END) AS linked_so_po_id,
                                (CASE
                                    WHEN ah.type = 1 OR ah.type = 2 THEN
                                        (Select si.ship_to_city FROM link_so_po AS sp, srm_invoice AS si
                                            WHERE sp.saleOrderID=ah.object_id AND si.id = sp.purchaseOrderID AND sp.company_id = ".$this->arrUser['company_id']." LIMIT 1)
                                    WHEN ah.type = 3 OR ah.type = 8 THEN
                                        (Select ro.ship_to_city FROM return_orders AS ro
                                            WHERE ro.id=ah.object_id AND ro.company_id = ".$this->arrUser['company_id']." LIMIT 1)
                                    WHEN ah.type = 4 OR ah.type = 7 THEN
                                        (Select od.ship_to_city FROM link_so_po AS sp, orders AS od
                                            WHERE sp.purchaseOrderID=ah.object_id AND od.id = sp.saleOrderID AND sp.company_id = ".$this->arrUser['company_id']." LIMIT 1)
                                    ELSE
                                        NULL
                                END) AS linked_so_po_city,
                                (CASE
                                    WHEN ah.type = 1 THEN 'Sales Order' 
                                    WHEN ah.type = 2 THEN 'Sales Order' 
                                    WHEN ah.type = 3 OR ah.type = 8 THEN 'Credit Note' 
                                    WHEN ah.type = 4 OR ah.type = 7 THEN 'Purchase Order' 
                                    WHEN ah.type = 5 THEN 'Expense' 
                                    WHEN ah.type = 6  OR ah.type = 9  THEN 'Holiday' 
                                END) AS ttype,
                                (CASE
                                    WHEN ah.type = 1 THEN 'Sales Margin' 
                                    WHEN ah.type = 2 THEN 'Credit Limit' 
                                    WHEN ah.type = 3 THEN 'Credit Note Level 1' 
                                    WHEN ah.type = 4 THEN 'PO Level 1' 
                                    WHEN ah.type = 5 THEN 'Expense' 
                                    WHEN ah.type = 6 THEN 'Holiday' 
                                    WHEN ah.type = 7 THEN 'PO Level 2'
                                    WHEN ah.type = 8 THEN 'Credit Note Level 2' 
                                    WHEN ah.type = 9 THEN 'Cancel Holiday' 
                                END) AS reason,
                                (SELECT user_email FROM employees AS emp WHERE emp.id = ah.requested_by AND emp.company_id = " . $this->arrUser['company_id']. ") AS requested_by_email
                                FROM approval_history AS ah 
                                WHERE ah.status IN (1, 7) AND 
                                    ah.company_id = ".$this->arrUser['company_id']." AND 
                                    ".$this->arrUser['id']." IN (
                                        ah.emp_id_1,
                                        ah.emp_id_2,
                                        ah.emp_id_3,
                                        ah.emp_id_4,
                                        ah.emp_id_5,
                                        ah.emp_id_6
                                    )
                                HAVING objectStatus>0
                                Order by ah.id DESC) as tbl 
                WHERE 1 " . $where_clause . "                  
                GROUP BY tbl.object_id,tbl.type  ";
        
        if ($order_clause == "")
            $order_type = " Order by tbl.id DESC";
        else
            $order_type = $order_clause;

        $total_limit = pagination_limit;

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        // $RS = $this->CSI($response['q']);
        // echo '<pre>'.$response['q'];exit;

        $RS = $this->CSI($response['q']);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $id_type = explode('^^^^^', $Row['linked_so_po_id']);

                $Row['linked_so_po_id']     = $id_type[0];
                $Row['invoice_type']        = $id_type[1];

                $Row['disabled'] = ($Row['status'] == '7') ? 1 : 0;

                $Row['order_date'] = $this->objGeneral->convert_unix_into_date($Row['order_date']);
                $Row['posting_date'] = $this->objGeneral->convert_unix_into_date($Row['posting_date']);
                
                $Row['code_type'] = $Row['object_code'].' - '.$Row['ttype'];
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
        }
        else
            $response['ack'] = 0;
        
        $response['response']['tbl_meta_data'] = $this->GetTableMetaData("PendingApprovals");
        return $response;
    }
    
    function get_awaiting_approvals($attr)
    {
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.", $attr, $fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.", $attr, $fieldsMeta);

        $response = array();

        $Sql = "SELECT * FROM (SELECT ah.*,
                                (CASE
                                    WHEN ah.status = 0 THEN 'Queued for Approval'
                                    WHEN ah.status = 1 THEN 'Awaiting Approval'
                                    WHEN ah.status = 2 THEN 'Approved' 
                                    WHEN ah.status = 3 OR ah.status = 4 THEN 'Disapproved'
                                END) AS statuss,
                                (CASE
                                    WHEN ah.type = 1 OR ah.type = 2 THEN 
                                        (SELECT 
                                            net_amount
                                        FROM
                                            orders 
                                        WHERE id = ah.object_id)  
                                    WHEN ah.type = 3 OR ah.type = 8 THEN 
                                        (SELECT 
                                            net_amount 
                                        FROM
                                            return_orders 
                                        WHERE id = ah.object_id) 
                                    WHEN ah.type = 4 OR ah.type = 7 THEN 
                                        (SELECT 
                                            net_amount 
                                        FROM
                                            srm_invoice 
                                        WHERE id = ah.object_id) 
                                    WHEN ah.type = 5 THEN 
                                        (COALESCE((SELECT ROUND(SUM(es.total_sum) ,2)  
                                                    FROM employee_expenses_detail  es 
                                                    WHERE es.employee_id=ah.detail_id AND es.exp_id=ah.object_id AND es.status=1),0) + 
                                         COALESCE(( SELECT ROUND(SUM(epv.amount) ,2)  
                                                    FROM expense_personel_vehicle  epv 
                                                    WHERE epv.employee_id=ah.detail_id AND epv.expense_id=ah.object_id AND epv.status=1),0) + 
                                         COALESCE((SELECT ROUND(SUM(ecv.amount) ,2)  
                                                   FROM expense_company_vehicle  ecv
                                                   WHERE ecv.employee_id=ah.detail_id AND ecv.expense_id=ah.object_id AND ecv.status=1),0)) 
                                    WHEN ah.type = 6 OR  ah.type = 9 THEN 
                                        NULL
                                END) AS amount_excl_vat,

                                
                                (CASE
                                    WHEN ah.type = 1 OR ah.type = 2 THEN 
                                        (SELECT 
                                            (case when type>1 THEN 0
                                                ELSE 1
                                                END) AS objectStatus
                                        FROM
                                            orders 
                                        WHERE id = ah.object_id
                                        LIMIT 1)  
                                    WHEN ah.type = 3 OR ah.type = 8 THEN 
                                        (SELECT 
                                            (case when type>1 THEN 0
                                                ELSE 1
                                                END) AS objectStatus
                                        FROM
                                            return_orders 
                                        WHERE id = ah.object_id
                                        LIMIT 1) 
                                    WHEN ah.type = 4 OR ah.type = 7 THEN 
                                        (SELECT 
                                            (case when type < 3 THEN 0
                                                ELSE 1
                                                END) AS objectStatus
                                        FROM
                                            srm_invoice 
                                        WHERE id = ah.object_id
                                        LIMIT 1)
                                    WHEN ah.type = 5 THEN 1
                                    WHEN ah.type = 6  OR  ah.type = 9 THEN 1
                                END) AS objectStatus,


                                (CASE
                                    WHEN ah.type = 1 OR ah.type = 2 THEN 
                                        (SELECT 
                                            grand_total
                                        FROM
                                            orders 
                                        WHERE id = ah.object_id)  
                                    WHEN ah.type = 3 OR ah.type = 8 THEN 
                                        (SELECT 
                                            grand_total 
                                        FROM
                                            return_orders 
                                        WHERE id = ah.object_id) 
                                    WHEN ah.type = 4 OR ah.type = 7 THEN 
                                        (SELECT 
                                            grand_total 
                                        FROM
                                            srm_invoice 
                                        WHERE id = ah.object_id) 
                                    WHEN ah.type = 5 THEN 
                                        (COALESCE((SELECT ROUND(SUM(es.total_sum) ,2)  
                                                    FROM employee_expenses_detail  es 
                                                    WHERE es.employee_id=ah.detail_id AND es.exp_id=ah.object_id AND es.status=1),0) + 
                                         COALESCE(( SELECT ROUND(SUM(epv.amount) ,2)  
                                                    FROM expense_personel_vehicle  epv 
                                                    WHERE epv.employee_id=ah.detail_id AND epv.expense_id=ah.object_id AND epv.status=1),0) + 
                                         COALESCE((SELECT ROUND(SUM(ecv.amount) ,2)  
                                                   FROM expense_company_vehicle  ecv
                                                   WHERE ecv.employee_id=ah.detail_id AND ecv.expense_id=ah.object_id AND ecv.status=1),0))
                                    WHEN ah.type = 6  OR  ah.type = 9 THEN 
                                        NULL
                                END) AS amount_inc_vat,
                                (CASE
                                    WHEN ah.type = 1 OR ah.type = 2 THEN
                                        (Select si.order_code FROM link_so_po AS sp, srm_invoice AS si
                                            WHERE sp.saleOrderID=ah.object_id AND si.id = sp.purchaseOrderID AND sp.company_id = ".$this->arrUser['company_id']." LIMIT 1)
                                    WHEN ah.type = 3 OR ah.type = 8 THEN
                                        (Select ro.sale_invoice FROM return_orders AS ro
                                            WHERE ro.id=ah.object_id AND ro.company_id = ".$this->arrUser['company_id']." LIMIT 1)
                                    WHEN ah.type = 4 OR ah.type = 7 THEN
                                        (Select od.sale_order_code FROM link_so_po AS sp, orders AS od
                                            WHERE sp.purchaseOrderID=ah.object_id AND od.id = sp.saleOrderID AND sp.company_id = ".$this->arrUser['company_id']." LIMIT 1)
                                    ELSE
                                        NULL
                                END) AS linked_so_po,
                                (CASE
                                    WHEN ah.type = 1 OR ah.type = 2 THEN
                                        (Select si.id FROM link_so_po AS sp, srm_invoice AS si
                                            WHERE sp.saleOrderID=ah.object_id AND si.id = sp.purchaseOrderID AND sp.company_id = ".$this->arrUser['company_id']." LIMIT 1)
                                    WHEN ah.type = 3 OR ah.type = 8 THEN
                                        (Select CONCAT(ro.sale_invoice_id, '^^^^^', ro.sale_invoice_type) FROM return_orders AS ro
                                            WHERE ro.id=ah.object_id AND ro.company_id = ".$this->arrUser['company_id']." LIMIT 1)
                                    WHEN ah.type = 4 OR ah.type = 7 THEN
                                        (Select od.id FROM link_so_po AS sp, orders AS od
                                            WHERE sp.purchaseOrderID=ah.object_id AND od.id = sp.saleOrderID AND sp.company_id = ".$this->arrUser['company_id']." LIMIT 1)
                                    ELSE
                                        NULL
                                END) AS linked_so_po_id,
                                (CASE
                                    WHEN ah.type = 1 OR ah.type = 2 THEN
                                        (Select si.ship_to_city FROM link_so_po AS sp, srm_invoice AS si
                                            WHERE sp.saleOrderID=ah.object_id AND si.id = sp.purchaseOrderID AND sp.company_id = ".$this->arrUser['company_id']." LIMIT 1)
                                    WHEN ah.type = 3 OR ah.type = 8 THEN
                                        (Select ro.ship_to_city FROM return_orders AS ro
                                            WHERE ro.id=ah.object_id AND ro.company_id = ".$this->arrUser['company_id']." LIMIT 1)
                                    WHEN ah.type = 4 OR ah.type = 7 THEN
                                        (Select od.ship_to_city FROM link_so_po AS sp, orders AS od
                                            WHERE sp.purchaseOrderID=ah.object_id AND od.id = sp.saleOrderID AND sp.company_id = ".$this->arrUser['company_id']." LIMIT 1)
                                    ELSE
                                        NULL
                                END) AS linked_so_po_city,
                                (CASE
                                    WHEN ah.type = 1 THEN 'Sales Order' 
                                    WHEN ah.type = 2 THEN 'Sales Order' 
                                    WHEN ah.type = 3 OR ah.type = 8 THEN 'Credit Note' 
                                    WHEN ah.type = 4 OR ah.type = 7 THEN 'Purchase Order' 
                                    WHEN ah.type = 5 THEN 'Expense' 
                                    WHEN ah.type = 6 OR  ah.type = 9 THEN 'Holiday' 
                                END) AS ttype,
                                (CASE
                                    WHEN ah.type = 1 THEN 'Sales Margin' 
                                    WHEN ah.type = 2 THEN 'Credit Limit' 
                                    WHEN ah.type = 3 THEN 'Credit Note Level 1' 
                                    WHEN ah.type = 4 THEN 'PO Level 1' 
                                    WHEN ah.type = 5 THEN 'Expense' 
                                    WHEN ah.type = 6 THEN 'Holiday' 
                                    WHEN ah.type = 7 THEN 'PO Level 2' 
                                    WHEN ah.type = 8 THEN 'Credit Note Level 2' 
                                    WHEN ah.type = 9 THEN 'Cancel Holiday' 
                                END) AS reason 
                                FROM approval_history AS ah 
                                WHERE ah.status IN(0) AND 
                                    ah.company_id = ".$this->arrUser['company_id']." AND 
                                    ".$this->arrUser['id']." IN (ah.requested_by) 
                                HAVING objectStatus>0
                                Order by ah.id DESC) as tbl 
                WHERE 1 " . $where_clause . "  
                GROUP BY tbl.object_id,tbl.type ";
        
        if ($order_clause == "")
            $order_type = " Order by tbl.id DESC";
        else
            $order_type = $order_clause;

        $total_limit = pagination_limit;

        if(!isset($attr['searchKeyword'])) $attr['searchKeyword'] = '';
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        // $RS = $this->CSI($response['q']);
        
        $RS = $this->CSI($response['q']);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $id_type = explode('^^^^^', $Row['linked_so_po_id']);

                $Row['linked_so_po_id']     = $id_type[0];
                $Row['invoice_type']        = $id_type[1];

                $Row['code_type'] = $Row['object_code'].' - '.$Row['ttype'];
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
        }
        else
            $response['ack'] = 0;
        
        $response['response']['tbl_meta_data'] = $this->GetTableMetaData("AwaitingApprovals");
        return $response;
    }
    
    function get_approvals($attr)
    {
        $Sql = "SELECT * FROM approval_setup WHERE company_id = " . $this->arrUser["company_id"]." ORDER BY type";
        $RS = $this->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            
            $Result = array();
            while ($Row = $RS->FetchRow()) {
                


                $Result['selected_emps_codes_type_'.$Row['type']] = '';

                $temp_data_1['id'] = $Row['emp_id_1'];
                $temp_data_1['code'] = $Row['emp_code_1'];
                $Result['selected_emps_codes_type_'.$Row['type']] .= ($temp_data_1['code'] != '') ? $temp_data_1['code'].', ' : '';

                $temp_data_2['id'] = $Row['emp_id_2'];
                $temp_data_2['code'] = $Row['emp_code_2'];
                $Result['selected_emps_codes_type_'.$Row['type']] .= ($temp_data_2['code'] != '') ? $temp_data_2['code'].', ' : '';
                
                $temp_data_3['id'] = $Row['emp_id_3'];
                $temp_data_3['code'] = $Row['emp_code_3'];
                $Result['selected_emps_codes_type_'.$Row['type']] .= ($temp_data_3['code'] != '') ? $temp_data_3['code'].', ' : '';
                
                $temp_data_4['id'] = $Row['emp_id_4'];
                $temp_data_4['code'] = $Row['emp_code_4'];
                $Result['selected_emps_codes_type_'.$Row['type']] .= ($temp_data_4['code'] != '') ? $temp_data_4['code'].', ' : '';
                
                $temp_data_5['id'] = $Row['emp_id_5'];
                $temp_data_5['code'] = $Row['emp_code_5'];
                $Result['selected_emps_codes_type_'.$Row['type']] .= ($temp_data_5['code'] != '') ? $temp_data_5['code'].', ' : '';
                
                $temp_data_6['id'] = $Row['emp_id_6'];
                $temp_data_6['code'] = $Row['emp_code_6'];
                $Result['selected_emps_codes_type_'.$Row['type']] .= ($temp_data_6['code'] != '') ? $temp_data_6['code'].', ' : '';
                
                if(strlen($Result['selected_emps_codes_type_'.$Row['type']]) > 0)
                    $Result['selected_emps_codes_type_'.$Row['type']] = (substr($Result['selected_emps_codes_type_'.$Row['type']],0, -2));

                $temp_arr = array();
                if($temp_data_1['id'] > 0)
                    $temp_arr[] = $temp_data_1;
                if($temp_data_2['id'] > 0)
                    $temp_arr[] = $temp_data_2;
                if($temp_data_3['id'] > 0)
                    $temp_arr[] = $temp_data_3;
                if($temp_data_4['id'] > 0)
                    $temp_arr[] = $temp_data_4;
                if($temp_data_5['id'] > 0)
                    $temp_arr[] = $temp_data_5;
                if($temp_data_6['id'] > 0)
                    $temp_arr[] = $temp_data_6;

                $Result['selected_emps_type_'.$Row['type']]  = ($Row['status'] == 1) ? $temp_arr : [];//$temp_arr;
                
                $Result['id_'.$Row['type']] = $Row['id'];
                $Result['type_'.$Row['type']] = $Row['type'];
                $Result['status_'.$Row['type']] = ($Row['status'] == 1) ? true : false;;
                $Result['criteria_'.$Row['type']] = (float)$Row['criteria'];
                if($Row['status'] == 0)
                {
                    $Result['selected_emps_codes_type_'.$Row['type']] = '';
                    $Result['criteria_'.$Row['type']] = '';
                }

                
            }
            $response['response']['approvals'] = $Result;
            $response['ack'] = 1;
        } else {
            $response['ack'] = 0;
            $response['response']['approvals'] = array();
        }

        $Sql1 = "SELECT e.id, e.user_code AS code, e.first_name AS name, e.user_email AS email 
                    FROM  employees AS e WHERE e.status=1 AND e.user_type <> 1 AND e.company_id = " . $this->arrUser['company_id'];  

        $RS = $this->CSI($Sql1, "human_resource", sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['code'] = $Row['code'];
                $result['email'] = $Row['email'];
                $response['response']['employees'][] = $result;
            }
        }

        return $response;
    }

    function update_approvals($attr)
    {
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;

        $this->objGeneral->mysql_clean($attr);

        $update_id = ($attr['id'] != '') ? $attr['id'] : 0;
        
        foreach($attr['approvals'] as $approval)
        {
            $update_id = ($approval->id != '') ? $approval->id : 0;
            $criteria = ($approval->criteria != '') ? $approval->criteria : 0; 
            $status = ($approval->status != '') ? $approval->status: 0; 
            
            $emp_id_1 = ($approval->selected_emps[0]->id != '' && intval($approval->selected_emps[0]->id) > 0) ? $approval->selected_emps[0]->id : 'NULL';
            $emp_id_2 = ($approval->selected_emps[1]->id != '' && intval($approval->selected_emps[1]->id) > 0) ? $approval->selected_emps[1]->id : 'NULL';
            $emp_id_3 = ($approval->selected_emps[2]->id != '' && intval($approval->selected_emps[2]->id) > 0) ? $approval->selected_emps[2]->id : 'NULL';
            $emp_id_4 = ($approval->selected_emps[3]->id != '' && intval($approval->selected_emps[3]->id) > 0) ? $approval->selected_emps[3]->id : 'NULL';
            $emp_id_5 = ($approval->selected_emps[4]->id != '' && intval($approval->selected_emps[4]->id) > 0) ? $approval->selected_emps[4]->id : 'NULL';
            $emp_id_6 = ($approval->selected_emps[5]->id != '' && intval($approval->selected_emps[5]->id) > 0) ? $approval->selected_emps[5]->id : 'NULL';
            
            $emp_code_1 = ($approval->selected_emps[0]->code != '') ? $approval->selected_emps[0]->code : '';
            $emp_code_2 = ($approval->selected_emps[1]->code != '') ? $approval->selected_emps[1]->code : '';
            $emp_code_3 = ($approval->selected_emps[2]->code != '') ? $approval->selected_emps[2]->code : '';
            $emp_code_4 = ($approval->selected_emps[3]->code != '') ? $approval->selected_emps[3]->code : '';
            $emp_code_5 = ($approval->selected_emps[4]->code != '') ? $approval->selected_emps[4]->code : '';
            $emp_code_6 =  ($approval->selected_emps[5]->code != '') ? $approval->selected_emps[5]->code : '';
            
            if($update_id == 0)
            {
                $Sql = "INSERT INTO approval_setup
                            SET 
                                type = ".$approval->type.",
                                status = ".$status.",
                                criteria = ".$criteria.",
                                company_id = " . $this->arrUser["company_id"] . ",
                                user_id = " . $this->arrUser["id"] . ",
                                emp_id_1 = ".$emp_id_1.",
                                emp_id_2 = ".$emp_id_2.",
                                emp_id_3 = ".$emp_id_3.",
                                emp_id_4 = ".$emp_id_4.",
                                emp_id_5 = ".$emp_id_5.",
                                emp_id_6 = ".$emp_id_6.",
                                emp_code_1 = '".$emp_code_1."',
                                emp_code_2 = '".$emp_code_2."',
                                emp_code_3 = '".$emp_code_3."',
                                emp_code_4 = '".$emp_code_4."',
                                emp_code_5 = '".$emp_code_5."',
                                emp_code_6 = '".$emp_code_6."',                                
                                AddedOn  = UNIX_TIMESTAMP (NOW()),
                                AddedBy = " . $this->arrUser["id"] . ",
                                ChangedOn = UNIX_TIMESTAMP (NOW()),
                                ChangedBy = " . $this->arrUser["id"] . "
                                ";
                // echo $Sql;exit;
            }
            else
            {
                $Sql = "UPDATE approval_setup
                            SET 
                                type = ".$approval->type.",
                                status = ".$status.",
                                criteria = ".$criteria.",
                                company_id = " . $this->arrUser["company_id"] . ",
                                user_id = " . $this->arrUser["id"] . ",
                                emp_id_1 = ".$emp_id_1.",
                                emp_id_2 = ".$emp_id_2.",
                                emp_id_3 = ".$emp_id_3.",
                                emp_id_4 = ".$emp_id_4.",
                                emp_id_5 = ".$emp_id_5.",
                                emp_id_6 = ".$emp_id_6.",
                                emp_code_1 = '".$emp_code_1."',
                                emp_code_2 = '".$emp_code_2."',
                                emp_code_3 = '".$emp_code_3."',
                                emp_code_4 = '".$emp_code_4."',
                                emp_code_5 = '".$emp_code_5."',
                                emp_code_6 = '".$emp_code_6."',
                                ChangedOn = UNIX_TIMESTAMP (NOW()),
                                ChangedBy = " . $this->arrUser["id"] . "
                            WHERE id = ".$update_id;
                // echo $Sql;exit;
            }
            
            $RS = $this->CSI($Sql);
        }

       


        $this->Conn->commitTrans();
        $this->Conn->autoCommit = true;

        $response['ack'] = 1;
        return $response;

    }

    function get_approval_status($attr)
    {
        $attr['type'] = ($attr['type']==6) ? $attr['type'].',9' : $attr['type'];
        if($attr['expense_id']>0){
           $attr['type'] = ($attr['type']=='4, 7') ? $attr['type'].',5' : $attr['type']; 
           $where_object =   "ah.object_id IN ('".$attr['object_id']."','".$attr['expense_id']."')";
        }else{
            $where_object =  "ah.object_id = ".$attr['object_id'];
        }
        $Sql = "SELECT *, 
                    (SELECT user_email FROM employees AS emp WHERE emp.id = ah.requested_by AND emp.company_id = " . $this->arrUser['company_id']. ") AS requested_by_email,
                    (SELECT concat(emp.first_name,' ',emp.last_name) FROM employees AS emp WHERE emp.id = ah.requested_by AND emp.company_id = " . $this->arrUser['company_id']. ") AS requested_by_name,
                    (SELECT concat(emp.first_name,' ',emp.last_name) FROM employees AS emp WHERE emp.id = ah.responded_by AND emp.company_id = " . $this->arrUser['company_id']. ") AS responded_by_name,
                    (SELECT concat(emp.first_name,' ',emp.last_name) FROM employees AS emp WHERE emp.id = ah.emp_id_1 AND emp.company_id = " . $this->arrUser['company_id']. ") AS emp_id_1_name,
                    (SELECT concat(emp.first_name,' ',emp.last_name) FROM employees AS emp WHERE emp.id = ah.emp_id_2 AND emp.company_id = " . $this->arrUser['company_id']. ") AS emp_id_2_name,
                    (SELECT concat(emp.first_name,' ',emp.last_name) FROM employees AS emp WHERE emp.id = ah.emp_id_3 AND emp.company_id = " . $this->arrUser['company_id']. ") AS emp_id_3_name,
                    (SELECT concat(emp.first_name,' ',emp.last_name) FROM employees AS emp WHERE emp.id = ah.emp_id_4 AND emp.company_id = " . $this->arrUser['company_id']. ") AS emp_id_4_name,
                    (SELECT concat(emp.first_name,' ',emp.last_name) FROM employees AS emp WHERE emp.id = ah.emp_id_5 AND emp.company_id = " . $this->arrUser['company_id']. ") AS emp_id_5_name,
                    (SELECT concat(emp.first_name,' ',emp.last_name) FROM employees AS emp WHERE emp.id = ah.emp_id_6 AND emp.company_id = " . $this->arrUser['company_id']. ") AS emp_id_6_name,
                    (CASE
                    WHEN ah.status = 0 AND ah.type = 9 THEN
                            'Queued for Cancellation' 
                        WHEN ah.status = 1 AND ah.type = 9 THEN
                            'Awaiting Cancellation' 
                        WHEN ah.status = 2 AND ah.type = 9 THEN
                            'Cancelled'
                        WHEN ah.status = 0 THEN
                            'Queued for Approval' 
                        WHEN ah.status = 1 THEN
                            'Awaiting Approval' 
                        WHEN ah.status = 2 THEN
                            'Approved'
                        WHEN ah.status = 3 OR ah.status = 4  OR ah.status = 6 THEN 
                            'Disapproved'
                        WHEN ah.status = 5 THEN 
                                'Not Responded'
                        WHEN ah.status = 7 THEN 'On Hold'
                        
                    END) AS statuss,
                    (CASE
                        WHEN ah.type = 1 THEN 'Sales Margin' 
                        WHEN ah.type = 2 THEN 'Credit Limit' 
                        WHEN ah.type = 3 THEN 'Credit Note Level 1' 
                        WHEN ah.type = 4 THEN 'Purchase Order Level 1' 
                        WHEN ah.type = 5 THEN 'Expense' 
                        WHEN ah.type = 6 THEN 'Holiday' 
                        WHEN ah.type = 7 THEN 'Purchase Order Level 2'
                        WHEN ah.type = 8 THEN 'Credit Note Level 2' 
                        WHEN ah.type = 9 THEN 'Cancel Holiday'
                    END) AS ttype,
                    (CASE
                        WHEN (ah.status = 1 OR ah.status = 2) AND " . $this->arrUser['id']. " IN (ah.`emp_id_1`, ah.`emp_id_2`, ah.`emp_id_3`, ah.`emp_id_4`, ah.`emp_id_5`, ah.`emp_id_6`) THEN
                            1
                        ELSE
                            0
                    END) AS approver,
                    (CASE
                        WHEN ah.status = 7 THEN 
                            (SELECT concat('(',emp.first_name,' ',emp.last_name,')') FROM employees AS emp WHERE emp.id = ah.OnHoldBy AND emp.company_id = " . $this->arrUser['company_id']. ")
                        ELSE 
                            '' 
                    END) AS on_hold_by

                    FROM approval_history AS ah 
                    WHERE 
                        ".$where_object." AND
                        ah.type IN (".$attr['type'].") AND
                        ah.company_id = " . $this->arrUser['company_id'];  
        // echo '<pre>'. $Sql;exit;
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $Row['forwarded_to'] = '';
                if($Row['emp_id_1_name'] != '')
                    $Row['forwarded_to'] .= $Row['emp_id_1_name'].', ';
                if($Row['emp_id_2_name'] != '')
                    $Row['forwarded_to'] .= $Row['emp_id_2_name'].', ';
                if($Row['emp_id_3_name'] != '')
                    $Row['forwarded_to'] .= $Row['emp_id_3_name'].', ';
                if($Row['emp_id_4_name'] != '')
                    $Row['forwarded_to'] .= $Row['emp_id_4_name'].', ';
                if($Row['emp_id_5_name'] != '')
                    $Row['forwarded_to'] .= $Row['emp_id_5_name'].', ';
                if($Row['emp_id_6_name'] != '')
                    $Row['forwarded_to'] .= $Row['emp_id_6_name'].', ';


                if(strlen($Row['forwarded_to']) > 0)
                    $Row['forwarded_to'] = (substr($Row['forwarded_to'],0, -2));

                $Row['requested_on'] = $this->objGeneral->convert_unix_into_datetime($Row['requested_on']);
                $Row['responded_on'] = $this->objGeneral->convert_unix_into_datetime($Row['responded_on']);
                
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
        }
        else
            $response['ack'] = 0;

        return $response;
    }

    function check_for_approvals($attr)
    {
        /* if (strpos($a, 'are') !== false) {
            echo 'true';
        } */
        $where = "";
        $history_where = "";
        $history_where_1 = "";
        
        $types = explode(",", $attr['type']);

        $profit_percentage = ($attr['profit_percentage'] != '') ? $attr['profit_percentage'] : 0;
        $current_value = ($attr['current_value'] != '') ? $attr['current_value'] : 0;

        if($types[0] == '4')
        {
            $sqla = "SELECT sell_to_cust_id,sell_to_cust_no,sell_to_cust_name 
                     FROM srm_invoice 
                     WHERE id=".$attr['object_id'];

            $RSa = $this->CSI($sqla);

            if ($RSa->RecordCount() > 0) {
                $Rowb = $RSa->FetchRow();

                $sell_to_cust_id =  $Rowb['sell_to_cust_id'];
                $sell_to_cust_no =  $Rowb['sell_to_cust_no'];
                $sell_to_cust_name =  addslashes($Rowb['sell_to_cust_name']);

                $sqlb = "UPDATE approval_history SET 
                                                    source_code =  '".$sell_to_cust_no."',
                                                    source_name =  '".$sell_to_cust_name."'
                         WHERE object_id =".$attr['object_id']." AND
                               type IN (4) AND  
                               company_id = " . $this->arrUser['company_id']. " ";

                $this->CSI($sqlb);
            }
        }

        if($types[0] == '1')
        {
            $sqla = "SELECT sell_to_cust_id,sell_to_cust_no,sell_to_cust_name 
                     FROM orders 
                     WHERE id=".$attr['object_id'];

            $RSa = $this->CSI($sqla);

            if ($RSa->RecordCount() > 0) {
                $Rowb = $RSa->FetchRow();

                $sell_to_cust_id =  $Rowb['sell_to_cust_id'];
                $sell_to_cust_no =  $Rowb['sell_to_cust_no'];
                $sell_to_cust_name =  addslashes($Rowb['sell_to_cust_name']);

                $sqlb = "UPDATE approval_history SET 
                                                    source_code =  '".$sell_to_cust_no."',
                                                    source_name =  '".$sell_to_cust_name."'
                         WHERE object_id =".$attr['object_id']." AND 
                               type IN (1) AND 
                               company_id = " . $this->arrUser['company_id'];

                $this->CSI($sqlb);
            }
        }

        if($types[0] == '3')
        {
            $sqla = "SELECT sell_to_cust_id,sell_to_cust_no,sell_to_cust_name 
                     FROM return_orders 
                     WHERE id=".$attr['object_id'];

            $RSa = $this->CSI($sqla);

            if ($RSa->RecordCount() > 0) {
                $Rowb = $RSa->FetchRow();

                $sell_to_cust_id =  $Rowb['sell_to_cust_id'];
                $sell_to_cust_no =  $Rowb['sell_to_cust_no'];
                $sell_to_cust_name =  addslashes($Rowb['sell_to_cust_name']);

                $sqlb = "UPDATE approval_history SET 
                                                    source_code =  '".$sell_to_cust_no."',
                                                    source_name =  '".$sell_to_cust_name."'
                         WHERE object_id =".$attr['object_id']." AND 
                               type IN (3) AND 
                               company_id = " . $this->arrUser['company_id']. " ";

                $this->CSI($sqlb);
            }
        }

        if(count($types) >= 1)
        {
            if($types[0] == '1')
            {
                $where = " a.criteria >= ".$attr['profit_percentage']." AND ";
                $history_where = " ((ah.status < 4 AND ah.current_value <= ".$attr['profit_percentage'].") OR ah.status = 7) AND ";
            }   
            if($types[1] == '2' && $attr['credit_limit_exceded_by']!= null )
                $history_where_1 = " ((ah.status < 4 AND ah.current_value <= ".$attr['credit_limit_exceded_by'].") OR ah.status = 7) AND";
            if($types[0] == '4')
            {
                $where = " a.criteria <= ".$attr['purchase_order_total']." / SR_GetConversionRateByDate( " . $this->objGeneral->convert_date($attr['order_date']) . ", ".$attr['currency_id'].", " . $this->arrUser['company_id']. ") AND ";
                 $history_where = " ((ah.status < 4 ) OR ah.status = 7) AND "; // AND ah.current_value >= $attr[purchase_order_total]
            }
            
            $Sql = "SELECT a.*, 
                        IFNULL((SELECT IFNULL(ah.status, 0) FROM approval_history AS ah WHERE $history_where ah.approval_id = a.id AND ah.object_id = ".$attr['object_id']." AND ah.company_id = " . $this->arrUser['company_id']. " ORDER BY ah.id DESC LIMIT 1), -1) AS prev_status,
                        (SELECT concat(emp.first_name,' ',emp.last_name) 
                                FROM employees AS emp, approval_history AS ah 
                                    WHERE emp.id = ah.responded_by AND ah.object_id = ".$attr['object_id']." AND emp.company_id = " . $this->arrUser['company_id']. " ORDER BY ah.id DESC LIMIT 1) AS responded_by,
                        (SELECT emp.user_email
                                FROM employees AS emp
                                    WHERE emp.id = a.emp_id_1) AS emp_email_1,
                        (SELECT emp.user_email
                                FROM employees AS emp
                                    WHERE emp.id = a.emp_id_2) AS emp_email_2,
                        (SELECT emp.user_email
                                FROM employees AS emp
                                    WHERE emp.id = a.emp_id_3) AS emp_email_3,
                        (SELECT emp.user_email
                                FROM employees AS emp
                                    WHERE emp.id = a.emp_id_4) AS emp_email_4,
                        (SELECT emp.user_email
                                FROM employees AS emp
                                    WHERE emp.id = a.emp_id_5) AS emp_email_5,
                        (SELECT emp.user_email
                                FROM employees AS emp
                                    WHERE emp.id = a.emp_id_6) AS emp_email_6                              
                        FROM approval_setup AS a
                        WHERE $where a.type = ".$types[0]." AND
                                a.status iN (1) AND company_id = " . $this->arrUser['company_id'];  
        }
        if(count($types) == 2) // IF CREDIT LIMIT IS EXCEDING THEN WILL CHECK IF THE CREDIT LIMIT APPROVAL IS REQUIRED OR NOT
        {
            if($types[1] == '2' && $attr['credit_limit_exceded_by'] > 0)
            {
                $Sql .= " UNION 
                        SELECT a.*, 
                            IFNULL((SELECT IFNULL(ah.status, 0) FROM approval_history AS ah WHERE ".$history_where_1." ah.approval_id = a.id AND ah.object_id = ".$attr['object_id']." AND ah.company_id = " . $this->arrUser['company_id']. " ORDER BY ah.id DESC LIMIT 1), -1) AS prev_status,
                            (SELECT concat(emp.first_name,' ',emp.last_name) 
                                    FROM employees AS emp, approval_history AS ah 
                                        WHERE emp.id = ah.responded_by AND ah.object_id = ".$attr['object_id']." AND emp.company_id = " . $this->arrUser['company_id']. " ORDER BY ah.id DESC LIMIT 1) AS responded_by,
                            (SELECT emp.user_email
                                    FROM employees AS emp
                                        WHERE emp.id = a.emp_id_1) AS emp_email_1,
                            (SELECT emp.user_email
                                    FROM employees AS emp
                                        WHERE emp.id = a.emp_id_2) AS emp_email_2,
                            (SELECT emp.user_email
                                    FROM employees AS emp
                                        WHERE emp.id = a.emp_id_3) AS emp_email_3,
                            (SELECT emp.user_email
                                    FROM employees AS emp
                                        WHERE emp.id = a.emp_id_4) AS emp_email_4,
                            (SELECT emp.user_email
                                    FROM employees AS emp
                                        WHERE emp.id = a.emp_id_5) AS emp_email_5,
                            (SELECT emp.user_email
                                    FROM employees AS emp
                                        WHERE emp.id = a.emp_id_6) AS emp_email_6                              
                            FROM approval_setup AS a
                            WHERE a.type = ".$types[1]." AND
                                    a.status IN (1) AND company_id = " . $this->arrUser['company_id'];  
            }
            else if($types[1] == '7')
            {
                $where_1 = " a.criteria <= ".$attr['purchase_order_total']."/ SR_GetConversionRateByDate( " . $this->objGeneral->convert_date($attr['order_date']) . ", ".$attr['currency_id'].", " . $this->arrUser['company_id']. ") AND ";
                $history_where_1 = " ((ah.status < 4 AND ah.current_value >= ".$attr['purchase_order_total'].") OR ah.status = 7)  AND ";

                $Sql .= " UNION 
                        SELECT a.*, 
                            IFNULL((SELECT IFNULL(ah.status, 0) FROM approval_history AS ah WHERE ".$history_where_1." ah.approval_id = a.id AND ah.object_id = ".$attr['object_id']." AND ah.company_id = " . $this->arrUser['company_id']. " ORDER BY ah.id DESC LIMIT 1), -1) AS prev_status,
                            (SELECT concat(emp.first_name,' ',emp.last_name) 
                                    FROM employees AS emp, approval_history AS ah 
                                        WHERE emp.id = ah.responded_by AND ah.object_id = ".$attr['object_id']." AND emp.company_id = " . $this->arrUser['company_id']. " ORDER BY ah.id DESC LIMIT 1) AS responded_by,
                            (SELECT emp.user_email
                                    FROM employees AS emp
                                        WHERE emp.id = a.emp_id_1) AS emp_email_1,
                            (SELECT emp.user_email
                                    FROM employees AS emp
                                        WHERE emp.id = a.emp_id_2) AS emp_email_2,
                            (SELECT emp.user_email
                                    FROM employees AS emp
                                        WHERE emp.id = a.emp_id_3) AS emp_email_3,
                            (SELECT emp.user_email
                                    FROM employees AS emp
                                        WHERE emp.id = a.emp_id_4) AS emp_email_4,
                            (SELECT emp.user_email
                                    FROM employees AS emp
                                        WHERE emp.id = a.emp_id_5) AS emp_email_5,
                            (SELECT emp.user_email
                                    FROM employees AS emp
                                        WHERE emp.id = a.emp_id_6) AS emp_email_6                              
                            FROM approval_setup AS a
                            WHERE ".$where_1." a.type = ".$types[1]." AND
                                    a.status IN (1) AND company_id = " . $this->arrUser['company_id'];  
            }
            else if($types[1] == '8')
            {
                $where_1 = " ";
                $history_where_1 = " ";

                $Sql .= " UNION 
                        SELECT a.*, 
                            IFNULL((SELECT IFNULL(ah.status, 0) FROM approval_history AS ah WHERE ".$history_where_1." ah.approval_id = a.id AND ah.object_id = ".$attr['object_id']." AND ah.company_id = " . $this->arrUser['company_id']. " ORDER BY ah.id DESC LIMIT 1), -1) AS prev_status,
                            (SELECT concat(emp.first_name,' ',emp.last_name) 
                                    FROM employees AS emp, approval_history AS ah 
                                        WHERE emp.id = ah.responded_by AND ah.object_id = ".$attr['object_id']." AND emp.company_id = " . $this->arrUser['company_id']. " ORDER BY ah.id DESC LIMIT 1) AS responded_by,
                            (SELECT emp.user_email
                                    FROM employees AS emp
                                        WHERE emp.id = a.emp_id_1) AS emp_email_1,
                            (SELECT emp.user_email
                                    FROM employees AS emp
                                        WHERE emp.id = a.emp_id_2) AS emp_email_2,
                            (SELECT emp.user_email
                                    FROM employees AS emp
                                        WHERE emp.id = a.emp_id_3) AS emp_email_3,
                            (SELECT emp.user_email
                                    FROM employees AS emp
                                        WHERE emp.id = a.emp_id_4) AS emp_email_4,
                            (SELECT emp.user_email
                                    FROM employees AS emp
                                        WHERE emp.id = a.emp_id_5) AS emp_email_5,
                            (SELECT emp.user_email
                                    FROM employees AS emp
                                        WHERE emp.id = a.emp_id_6) AS emp_email_6                              
                            FROM approval_setup AS a
                            WHERE ".$where_1." a.type = ".$types[1]." AND
                                    a.status IN (1) AND company_id = " . $this->arrUser['company_id'];  
            }
        }
        $Sql .= " ORDER BY type";

        //echo $Sql;exit;
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $flg = 0;
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $Row['emp_id_1'] = ($Row['emp_id_1'] != '') ? $Row['emp_id_1'] : '0';
                $Row['emp_id_2'] = ($Row['emp_id_2'] != '') ? $Row['emp_id_2'] : '0';
                $Row['emp_id_3'] = ($Row['emp_id_3'] != '') ? $Row['emp_id_3'] : '0';
                $Row['emp_id_4'] = ($Row['emp_id_4'] != '') ? $Row['emp_id_4'] : '0';
                $Row['emp_id_5'] = ($Row['emp_id_5'] != '') ? $Row['emp_id_5'] : '0';
                $Row['emp_id_6'] = ($Row['emp_id_6'] != '') ? $Row['emp_id_6'] : '0';
                if($Row['prev_status'] != 2)
                    $flg = 1;
                $response['response'][] = $Row;
            }
            if($flg == 1)
                $response['ack'] = 0;
            else
                $response['ack'] = 1;
        }
        else
            $response['ack'] = 1;
            
        $response['Sql'] = $Sql;
        return $response;
    }

    function check_for_approvals_before_del($attr)
    {        
                   
        $Sql = "SELECT a.*                            
                FROM approval_history AS a
                WHERE   a.type IN (".$attr['type'].") AND 
                        a.object_id = ".$attr['object_id']." AND 
                        a.company_id = " . $this->arrUser['company_id'];

        // echo $Sql;exit;
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {

            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response'][] = $Row;
            }
            
            $response['ack'] = 1;
        }
        else
            $response['ack'] = 0;
            
        // $response['rec'] = $RS->RecordCount();
        $response['Sql'] = $Sql;
        return $response;
    }

    function send_for_approval($attr, $status)
    {
       // echo '<pre>';print_r($attr);exit;
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
        $this->objGeneral->mysql_clean($attr);

        $current_value = ($attr['current_value'] != '') ? $attr['current_value'] : '0';
        $emp_id_1 = ($attr['emp_id_1'] != '' && intval($attr['emp_id_1']) > 0) ? $attr['emp_id_1'] : 'NULL';
        $emp_id_2 = ($attr['emp_id_2'] != '' && intval($attr['emp_id_2']) > 0) ? $attr['emp_id_2'] : 'NULL';
        $emp_id_3 = ($attr['emp_id_3'] != '' && intval($attr['emp_id_3']) > 0) ? $attr['emp_id_3'] : 'NULL';
        $emp_id_4 = ($attr['emp_id_4'] != '' && intval($attr['emp_id_4']) > 0) ? $attr['emp_id_4'] : 'NULL';
        $emp_id_5 = ($attr['emp_id_5'] != '' && intval($attr['emp_id_5']) > 0) ? $attr['emp_id_5'] : 'NULL';
        $emp_id_6 = ($attr['emp_id_6'] != '' && intval($attr['emp_id_6']) > 0) ? $attr['emp_id_6'] : 'NULL';

        $statuss = (isset($status) && $status == 1) ? 1 : 0;
        $prev_status = (isset($attr['prev_status'])) ? $attr['prev_status'] : 0;
       // echo $prev_status;exit;
        $Sql = "INSERT INTO approval_history SET
                        approval_id     = ".$attr['approval_id'].",
                        object_id       = ".$attr['object_id'].",
                        object_code     = '".$attr['object_code']."',
                        source_code     = '".$attr['source_code']."',
                        source_name     = '".$attr['source_name']."',
                        detail_id       = ".$attr['detail_id'].",
                        current_value   = ".$current_value.",
                        currency_code   = '".$attr['currency_code']."',                        
                        type            = ".$attr['type'].",
                        status          = ".$statuss.", 
                        requested_by    = ".$this->arrUser["id"].",
                        requested_on    = UNIX_TIMESTAMP(NOW()), 
                        company_id      = ".$this->arrUser["company_id"].",
                        emp_id_1        = ".$emp_id_1.",
                        emp_id_2        = ".$emp_id_2.",
                        emp_id_3        = ".$emp_id_3.",
                        emp_id_4        = ".$emp_id_4.",
                        emp_id_5        = ".$emp_id_5.",
                        emp_id_6        = ".$emp_id_6." ";  
        //echo $Sql;exit;
        $RS = $this->CSI($Sql);
        $id = $this->Conn->Insert_ID();
        // echo $id;exit;
        if ($id > 0) {
            if($statuss == 1 || $prev_status==3)
            {
                $document = "";
                $link = "";
                $reason = "";
                if($attr['type'] == 1)
                {
                    $document = 'Sales Order ('.$attr['object_code'].')';
                    $link = WEB_PATH."#/app/orders/".$attr['object_id']."/edit";
                    $reason = " as the profit margin % is below the authroised profit margin limit of $attr[criteria]%";
                }
                else if($attr['type'] == 2)
                {
                    $document = 'Sales Order ('.$attr['object_code'].')';
                    $link = WEB_PATH."#/app/orders/".$attr['object_id']."/edit";
                    $reason = " as it exceeds the authorised credit limit";
                }
                else if($attr['type'] == 3 || $attr['type'] == 8)
                {
                    $document = 'Credit Note ('.$attr['object_code'].')';
                    $link = WEB_PATH."#/app/return-orders/".$attr['object_id']."/edit";
                }
                else if($attr['type'] == 4 || $attr['type'] == 7)
                {
                    $document = 'Purchase Order ('.$attr['object_code'].')';
                    $link = WEB_PATH."#/app/purchase_order/".$attr['object_id']."/edit";
                    $reason = " as it exceeds the authroised limit of ".number_format($attr['criteria'], 2);
                }
                else if($attr['type'] == 5)
                {
                    $document = 'Expense ('.$attr['object_code'].')';
                    $link = WEB_PATH."#/app/hr_values/".$attr['detail_id']."/edit?isTab=2";
                    if($prev_status==3){
                        $Sql_update = "UPDATE employee_expenses SET expense_status = 0 WHERE id=".$attr['object_id']." AND company_id = ".$this->arrUser["company_id"];
                    }else{
                        $Sql_update = "UPDATE employee_expenses SET expense_status = 1 WHERE id=".$attr['object_id']." AND company_id = ".$this->arrUser["company_id"];
                    }
                     
                    $RS1 = $this->CSI($Sql_update);
                }
                else if($attr['type'] == 6)
                {
                    $document = 'Holiday ('.$attr['object_code'].')';
                    $link = WEB_PATH."#/app/hr_values/".$attr['detail_id']."/edit?isTab=1";
                    if($prev_status==3){
                        $Sql_update = "UPDATE hr_holidays SET holidayStatus = 0 WHERE id=".$attr['object_id']. "AND company_id = ".$this->arrUser["company_id"];
                    }else{
                        $Sql_update = "UPDATE hr_holidays SET holidayStatus = 1 WHERE id=".$attr['object_id']." AND company_id = ".$this->arrUser["company_id"];
                    }
                   
                    $RS1 = $this->CSI($Sql_update);
                }
                // email will be sent here
                
                $emails_to = ''; //noor.alam@silverow.com;';
                if($attr['emp_email_1'] != '')
                    $emails_to .= $attr['emp_email_1'].";";
                if($attr['emp_email_2'] != '')
                    $emails_to .= $attr['emp_email_2'].";";
                if($attr['emp_email_3'] != '')
                    $emails_to .= $attr['emp_email_3'].";";
                if($attr['emp_email_4'] != '')
                    $emails_to .= $attr['emp_email_4'].";";
                if($attr['emp_email_5'] != '')
                    $emails_to .= $attr['emp_email_5'].";";
                if($attr['emp_email_6'] != '')
                    $emails_to .= $attr['emp_email_6'].";";
                    
                // echo $link;exit;
                $temp_attr['to'] = substr($emails_to, 0, -1);
                $temp_attr['body'] = "This ".$document." requires your approval ".$reason.", <a href='".$link."'> View Document </a>";

                if($this->arrUser["company_id"] == 133){
                    $temp_attr['subject'] = $document.' Approval Email Navson Tukey';
                }
                else
                $temp_attr['subject'] = $document.' Approval Email';

                require_once(SERVER_PATH . "/classes/Mail.php");        
                $this->objMail = new Mail($this->arrUser);            
                $sendEmail = $this->objMail->SendSimpleEmail($temp_attr);
                
                if($sendEmail['ack'] == 1)
                {
                    $this->Conn->commitTrans();
                    $this->Conn->autoCommit = true;
                    $response['ack'] = 1;
                }
                else
                {
                    $this->Conn->rollbackTrans();
                    $this->Conn->autoCommit = true;
                    
                    $response['error'] = 'Error while sending Approval Email.';
                    $response['ack'] = 0;
                }
            }
            else
            {
                $this->Conn->commitTrans();
                $this->Conn->autoCommit = true;
                $response['ack'] = 1;
            }
        }
        else
            $response['ack'] = 0;

        return $response;
    }

    function send_for_approval_bulk($attr)
    {
        $count = 0;
        $res = array();

        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;

        
        if($attr['status'] != 0)
        {
            $emp_id_1 = (isset($attr['emails_to'][0])) ? $attr['emails_to'][0]->id : 'NULL';
            $emp_id_2 = (isset($attr['emails_to'][1])) ? $attr['emails_to'][1]->id : 'NULL';
            $emp_id_3 = (isset($attr['emails_to'][2])) ? $attr['emails_to'][2]->id : 'NULL';
            $emp_id_4 = (isset($attr['emails_to'][3])) ? $attr['emails_to'][3]->id : 'NULL';
            $emp_id_5 = (isset($attr['emails_to'][4])) ? $attr['emails_to'][4]->id : 'NULL';
            $emp_id_6 = (isset($attr['emails_to'][5])) ? $attr['emails_to'][5]->id : 'NULL';


            $temp_attr = array();
            $document_types = "0";
            foreach($attr['selected_data'] as $rec)
            {
                $temp_document = array();
                $temp_document['id']                = $rec->record->id;
                $temp_document['status']            = $attr['status'];
                $temp_document['object_id']         = $rec->record->object_id;
                $temp_document['object_code']       = $rec->record->object_code;
                $temp_document['source_name']       = $rec->record->source_name;
                $temp_document['source_code']       = $rec->record->source_code;
                $temp_document['code']              = $rec->record->object_code;
                $temp_document['code_type']         = $rec->record->code_type;
                $temp_document['comments']          = $rec->record->comments;
                $temp_document['detail_id']         = $rec->record->detail_id;
                $temp_document['type']              = $rec->record->type;
                $temp_document['ttype']             = $rec->record->ttype;
                $temp_document['requested_by_email']= $rec->record->requested_by_email;
                $temp_document['current_value']     = $rec->record->current_value;
                $temp_document['currency_code']     = $rec->record->currency_code;
                
                $temp_attr[$rec->record->type][]    = $temp_document;

                $document_types .= ", ".$rec->record->type;


                $Sql_update = "UPDATE approval_history 
                                SET status = 1,
                                    emp_id_1 = ".$emp_id_1.",
                                    emp_id_2 = ".$emp_id_2.",
                                    emp_id_3 = ".$emp_id_3.",
                                    emp_id_4 = ".$emp_id_4.",
                                    emp_id_5 = ".$emp_id_5.",
                                    emp_id_6 = ".$emp_id_6."
                                WHERE id = ".$rec->record->id." AND 
                                      company_id = ".$this->arrUser["company_id"];  
                // echo $Sql_update;exit;
                $RS_update_1 = $this->CSI($Sql_update);

                $Sql_update_2 = "UPDATE approval_history SET status = 4
                                    WHERE object_id = ".$rec->record->object_id." AND
                                        type = ".$rec->record->type." AND
                                        status = 3 AND 
                                        company_id = ".$this->arrUser["company_id"];
                // echo $Sql_update;exit;
                $RS_update_2 = $this->CSI($Sql_update_2);
                if($rec->record->type==9){
                    $Sql_update_3 = "UPDATE hr_holidays SET holidayStatus =5 
                    WHERE id = ".$rec->record->object_id." AND
                        company_id = ".$this->arrUser["company_id"];
                        $this->CSI($Sql_update_3);

                    $Sql_update_3 = "UPDATE holiday_history SET status =1 
                    WHERE object_id = ".$rec->record->object_id."  AND
                            status =0 AND type = 0 AND
                        company_id = ".$this->arrUser["company_id"];
                        $this->CSI($Sql_update_3);
                }

            }

            $count = 0;
            $emails_to = array(); //noor.alam@silverow.com;';
            // $approval_sql = "SELECT a.*,
            //                     (CASE WHEN a.emp_id_1 > 0 THEN
            //                         (SELECT CONCAT(emp.first_name, '****', emp.user_email) AS emp_details
            //                             FROM employees AS emp
            //                                 WHERE emp.id = a.emp_id_1)
            //                         ELSE 
            //                             ''
            //                     END) AS emp_email_1,
            //                         (CASE WHEN a.emp_id_2 > 0 THEN
            //                             (SELECT CONCAT(emp.first_name, '****', emp.user_email) AS emp_details
            //                                 FROM employees AS emp
            //                                     WHERE emp.id = a.emp_id_2)
            //                         ELSE 
            //                             ''
            //                     END) AS emp_email_2,
            //                         (CASE WHEN a.emp_id_3 > 0 THEN
            //                             (SELECT CONCAT(emp.first_name, '****', emp.user_email) AS emp_details
            //                                 FROM employees AS emp
            //                                     WHERE emp.id = a.emp_id_3)
            //                         ELSE 
            //                             ''
            //                     END) AS emp_email_3,
            //                         (CASE WHEN a.emp_id_4 > 0 THEN
            //                             (SELECT CONCAT(emp.first_name, '****', emp.user_email) AS emp_details
            //                                 FROM employees AS emp
            //                                     WHERE emp.id = a.emp_id_4)
            //                         ELSE 
            //                             ''
            //                     END) AS emp_email_4,
            //                         (CASE WHEN a.emp_id_5 > 0 THEN
            //                             (SELECT CONCAT(emp.first_name, '****', emp.user_email) AS emp_details
            //                                 FROM employees AS emp
            //                                     WHERE emp.id = a.emp_id_5)
            //                         ELSE 
            //                             ''
            //                     END) AS emp_email_5,
            //                         (CASE WHEN a.emp_id_6 > 0 THEN
            //                             (SELECT CONCAT(emp.first_name, '****', emp.user_email) AS emp_details
            //                                 FROM employees AS emp
            //                                     WHERE emp.id = a.emp_id_6)
            //                         ELSE 
            //                             ''
            //                     END) AS emp_email_6                                 
            //                 FROM approval_setup AS a
            //                      WHERE type IN (".$document_types.") AND
            //                             company_id = ".$this->arrUser["company_id"];
            // // echo $approval_sql;exit;
            // $RS_approval = $this->CSI($approval_sql);
           
            // if ($RS_approval->RecordCount() > 0) {
            //     while($Row1 = $RS_approval->FetchRow()) {
            //         foreach ($Row1 as $key => $value) {
            //             if (is_numeric($key))
            //                 unset($Row1[$key]);
            //         }                        
                
            //         if($Row1['emp_email_1'] != '' && !(in_array($Row1['emp_email_1'], $emails_to)))
            //             $emails_to[] = $Row1['emp_email_1'];
            //         if($Row1['emp_email_2'] != '' && !(in_array($Row1['emp_email_2'], $emails_to)))
            //             $emails_to[] = $Row1['emp_email_2'];
            //         if($Row1['emp_email_3'] != '' && !(in_array($Row1['emp_email_3'], $emails_to)))
            //             $emails_to[] = $Row1['emp_email_3'];
            //         if($Row1['emp_email_4'] != '' && !(in_array($Row1['emp_email_4'], $emails_to)))
            //             $emails_to[] = $Row1['emp_email_4'];
            //         if($Row1['emp_email_5'] != '' && !(in_array($Row1['emp_email_5'], $emails_to)))
            //             $emails_to[] = $Row1['emp_email_5'];
            //         if($Row1['emp_email_6'] != '' && !(in_array($Row1['emp_email_6'], $emails_to)))
            //             $emails_to[] = $Row1['emp_email_6'];
            //     }
            // }

            foreach($attr['emails_to'] as $emp)
            {
                $email_attr = array();
                $email_attr['to'] = $emp->email;
                $email_attr['body'] = "Dear ".$emp->name.", <br/><br/> One or more documents require your approval. <br/> Thanks & Regards, <br/>".$this->arrUser["user_name"];
                $email_attr['subject'] = 'Approval Email';

                require_once(SERVER_PATH . "/classes/Mail.php");        
                $this->objMail = new Mail($this->arrUser);       
                $sendEmail = $this->objMail->SendSimpleEmail($email_attr);
                
                if($sendEmail['ack'] == 1)
                {
                    $count = $count + 1;
                }
                else
                {
                    // $this->Conn->rollbackTrans();
                    // $this->Conn->autoCommit = true;

                    $count = 0;
                    $response['error'] = 'Error while sending Approval Email.';
                    $response['count'] = 0;
                    $response['ack'] = 0;

                    return $response;
                }
            }
            


            // print_r($temp_attr);exit;

            // Send separate emails for each category
            /* foreach($temp_attr as $type=>$approval_type)
            {
                $body = "";
                foreach($approval_type as $document)
                {
                    if($type == 1)
                    {
                        $document_name = 'Sales Order ('.$document['code'].')';
                        $link = WEB_PATH."#/app/orders/".$document['object_id']."/edit";
                        $reason = " as the profit margin % is below the authroised profit margin limit of $document[criteria]%";
                    }
                    else if($type == 2)
                    {
                        $document_name = 'Sales Order ('.$document['code'].')';
                        $link = WEB_PATH."#/app/orders/".$document['object_id']."/edit";
                        $reason = " as it exceeds the authorised credit limit";
                    }
                    else if($type == 3)
                    {
                        $document_name = 'Credit Note ('.$document['code'].')';
                        $link = WEB_PATH."#/app/return-orders/".$document['object_id']."/edit";
                    }
                    else if($type == 4)
                    {
                        $document_name = 'Purchase Order ('.$document['code'].')';
                        $link = WEB_PATH."#/app/purchase_order/".$document['object_id']."/edit";
                        $reason = " as it exceeds the authroised limit of ".number_format($document['criteria'], 2);
                    }
                    else if($type == 5)
                    {
                        $document_name = 'Expense ('.$document['code'].')';
                        $link = WEB_PATH."#/app/hr_values/".$document['detail_id']."/edit?isTab=2";
                        $reason = "";
                        $Sql_update = "UPDATE employee_expenses SET expense_status = 1 WHERE id=$document[object_id] AND company_id = ".$this->arrUser["company_id"];
                        $RS1 = $this->CSI($Sql_update);
                    }
                    else if($type == 6)
                    {
                        $document_name = 'Holiday ('.$document['code'].')';
                        $link = WEB_PATH."#/app/hr_values/".$document['detail_id']."/edit?isTab=1";
                        $reason = "";
                        $Sql_update = "UPDATE hr_holidays SET holidayStatus = 1 WHERE id=$document[object_id] AND company_id = ".$this->arrUser["company_id"];
                        $RS1 = $this->CSI($Sql_update);
                    }
                    
                    

                    $body .= "This $document_name requires your approval $reason, <a href='".$link."'> View Document </a> <br/>";
                    $Sql_update = "UPDATE approval_history SET status = 1
                                WHERE id = $document[id]";  
                    // echo $Sql_update;exit;
                    $RS_update_1 = $this->CSI($Sql_update);   
                }
                $approval_sql = "SELECT a.*,
                                (SELECT emp.user_email
                                        FROM employees AS emp
                                            WHERE emp.id = a.emp_id_1) AS emp_email_1,
                                (SELECT emp.user_email
                                        FROM employees AS emp
                                            WHERE emp.id = a.emp_id_2) AS emp_email_2,
                                (SELECT emp.user_email
                                        FROM employees AS emp
                                            WHERE emp.id = a.emp_id_3) AS emp_email_3,
                                (SELECT emp.user_email
                                        FROM employees AS emp
                                            WHERE emp.id = a.emp_id_4) AS emp_email_4,
                                (SELECT emp.user_email
                                        FROM employees AS emp
                                            WHERE emp.id = a.emp_id_5) AS emp_email_5,
                                (SELECT emp.user_email
                                        FROM employees AS emp
                                            WHERE emp.id = a.emp_id_6) AS emp_email_6
                                 FROM approval_setup AS a
                                 WHERE type= ".$type." AND
                                        company_id = ".$this->arrUser["company_id"];
                // echo $approval_sql;exit;
                $RS_approval = $this->CSI($approval_sql);
                if ($RS_approval->RecordCount() > 0) {
                    if ($Row1 = $RS_approval->FetchRow()) {
                        foreach ($Row1 as $key => $value) {
                            if (is_numeric($key))
                                unset($Row1[$key]);
                        }                        
                    
                        $emails_to = ''; //noor.alam@silverow.com;';
                        if($Row1['emp_email_1'] != '')
                            $emails_to .= $Row1['emp_email_1'].";";
                        if($Row1['emp_email_2'] != '')
                            $emails_to .= $Row1['emp_email_2'].";";
                        if($Row1['emp_email_3'] != '')
                            $emails_to .= $Row1['emp_email_3'].";";
                        if($Row1['emp_email_4'] != '')
                            $emails_to .= $Row1['emp_email_4'].";";
                        if($Row1['emp_email_5'] != '')
                            $emails_to .= $Row1['emp_email_5'].";";
                        if($Row1['emp_email_6'] != '')
                            $emails_to .= $Row1['emp_email_6'].";";
                            
                        // echo $link;exit;
                        $email_attr = array();
                        $email_attr['to'] = substr($emails_to, 0, -1);
                        $email_attr['body'] = $body;
                        $email_attr['subject'] = $approval_type[0]['ttype'].' Approval Email';

                        require_once(SERVER_PATH . "/classes/Mail.php");        
                        $this->objMail = new Mail($this->arrUser);       
                        $sendEmail = $this->objMail->SendSimpleEmail($email_attr);
                        
                        if($sendEmail['ack'] == 1)
                        {
                            $count = $count + 1;
                        }
                        else
                        {
                            // $this->Conn->rollbackTrans();
                            // $this->Conn->autoCommit = true;

                            $count = 0;
                            $response['error'] = 'Error while sending Approval Email.';
                            $response['count'] = 0;
                            $response['ack'] = 0;

                            return $response;
                        }
                    }
                }
            } */
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;

            $res['count'] = $count;
            $res['ack'] = 1;
        }
        else
        {
            $temp_ids_delete = "0";
            $temp_ids_update = "0";
            foreach($attr['selected_data'] as $rec)
            {
                if($rec->record->status == 3)
                    $temp_ids_update .= ", ".$rec->record->id;
                else
                    $temp_ids_delete .= ", ".$rec->record->id;

                $count = $count + 1;
            }
            $Sql = "DELETE FROM approval_history WHERE id IN (".$temp_ids_delete.")";
            $RS = $this->CSI($Sql);
            $deleted_rows = $this->Conn->Affected_Rows();

            $Sql1 = "UPDATE approval_history SET status = 4 WHERE id IN (".$temp_ids_update.")";
            $RS1 = $this->CSI($Sql1);

            $updated_rows = $this->Conn->Affected_Rows();
            
            if ($deleted_rows > 0 || $updated_rows > 0) {

                $this->Conn->commitTrans();
                $this->Conn->autoCommit = true;

                $res['count'] = $count;
                $res['ack'] = 1;
            }
            else
            {
                $this->Conn->rollbackTrans();
                $this->Conn->autoCommit = true;
                $res['ack'] = 0;
            }
        }
        return $res;
    }

    function update_approval_comments($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $status = (isset($attr['status'])) ? ", status = ".$attr['status'] : "";
        $on_hold = (isset($attr['status']) && $attr['status'] == 7) ? ", OnHoldBy =".$this->arrUser['id']." " : "";

        $Sql = "UPDATE approval_history 
                        SET comments = '".$attr['comments']."' ".$status.$on_hold."
                    WHERE id= ".$attr['id']." ";
        // echo $Sql;exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
        }
        else
            $response['ack'] = 0;

        return $response;
    }

    function update_approval_status($attr, $transaction)
    {
        $this->objGeneral->mysql_clean($attr);

        $transaction_req = (isset($transaction) && $transaction == 1) ? 0 : 1;

        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;

        $Sql = "UPDATE approval_history 
                        SET status=".$attr['status'].",
                            responded_by =" .$this->arrUser['id'] . ",
                            responded_on = UNIX_TIMESTAMP(NOW()),
                            comments = '".$attr['comments']."'
                    WHERE id= ".$attr['id']." AND
                        company_id = ".$this->arrUser["company_id"];
        // echo $Sql;exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            // email
            $document = "";
            $link = "";
            $reason = "";
            if($attr['type'] == 1)
            {
                $document = 'Sales Order';
                $link = WEB_PATH."#/app/orders/".$attr['object_id']."/edit";
                $reason = " because profit margin less than specified in approval setup";
            }
            else if($attr['type'] == 2)
            {
                $document = 'Sales Order';
                $link = WEB_PATH."#/app/orders/".$attr['object_id']."/edit";
                $reason = " because the customer credit limit is exceeding";
            }
            else if($attr['type'] == 3)
            {
                $document = 'Credit Note';
                $link = WEB_PATH."#/app/return-orders/".$attr['object_id']."/edit";
                $reason = "";
                if($attr['status'] == 2)
                {
                    $temp_approval = array();

                    $approval_sql = "SELECT * 
                                    FROM approval_setup 
                                    WHERE type=8 AND status = 1 AND
                                            company_id = ".$this->arrUser["company_id"];
                    // echo $approval_sql;exit;
                    $RS_approval = $this->CSI($approval_sql);
                    if ($RS_approval->RecordCount() > 0) {
                        if ($Row1 = $RS_approval->FetchRow()) {
                            foreach ($Row1 as $key => $value) {
                                if (is_numeric($key))
                                    unset($Row1[$key]);
                            }
                            $temp_approval['object_id']     = $attr['object_id'];
                            $temp_approval['object_code']   = $attr['object_code'];
                            $temp_approval['source_code']   = $attr['source_code'];
                            $temp_approval['source_name']   = $attr['source_name'];
                            $temp_approval['detail_id']     = $attr['detail_id'];
                            $temp_approval['current_value'] = $attr['current_value'];
                            $temp_approval['currency_code']  = $attr['currency_code'];
                            
                            $temp_approval['approval_id']   = $Row1['id'];
                            $temp_approval['type']          = $Row1['type'];
                            $temp_approval['emp_id_1']      = $Row1['emp_id_1'];
                            $temp_approval['emp_id_2']      = $Row1['emp_id_2'];
                            $temp_approval['emp_id_3']      = $Row1['emp_id_3'];
                            $temp_approval['emp_id_4']      = $Row1['emp_id_4'];
                            $temp_approval['emp_id_5']      = $Row1['emp_id_5'];
                            $temp_approval['emp_id_6']      = $Row1['emp_id_6'];
                        }
                        $send_approval_check = $this->send_for_approval($temp_approval, 1);
                        if($send_approval_check['ack'] == 0)
                        {
                            $response['ack'] = 0;
                            return $response;
                        }
                    }
                }
            }
            else if($attr['type'] == 4)
            {
                $document = 'Purchase Order';
                $link = WEB_PATH."#/app/purchase_order/".$attr['object_id']."/edit";
                $reason = " because the total amount is exceeding the limit specified in approval setup";

                if($attr['status'] == 2)
                {
                    $temp_approval = array();

                    $approval_sql = "SELECT * 
                                    FROM approval_setup 
                                    WHERE type=7 AND status = 1 AND
                                            company_id = ".$this->arrUser["company_id"];
                    // echo $approval_sql;exit;
                    $RS_approval = $this->CSI($approval_sql);
                    if ($RS_approval->RecordCount() > 0) {
                        if ($Row1 = $RS_approval->FetchRow()) {
                            foreach ($Row1 as $key => $value) {
                                if (is_numeric($key))
                                    unset($Row1[$key]);
                            }
                            $temp_approval['object_id']     = $attr['object_id'];
                            $temp_approval['object_code']   = $attr['object_code'];
                            $temp_approval['source_code']   = $attr['source_code'];
                            $temp_approval['source_name']   = $attr['source_name'];
                            $temp_approval['detail_id']     = $attr['detail_id'];

                            $curr_value = "SELECT grand_total FROM srm_invoice WHERE id= ".$attr['object_id'];
                            $RS_curr_value = $this->CSI($curr_value);
                            $temp_approval['current_value'] = $RS_curr_value->fields[0];

                            $temp_approval['currency_code']  = $attr['currency_code'];
                            
                            $temp_approval['approval_id']   = $Row1['id'];
                            $temp_approval['type']          = $Row1['type'];
                            $temp_approval['emp_id_1']      = $Row1['emp_id_1'];
                            $temp_approval['emp_id_2']      = $Row1['emp_id_2'];
                            $temp_approval['emp_id_3']      = $Row1['emp_id_3'];
                            $temp_approval['emp_id_4']      = $Row1['emp_id_4'];
                            $temp_approval['emp_id_5']      = $Row1['emp_id_5'];
                            $temp_approval['emp_id_6']      = $Row1['emp_id_6'];
                        }
                        $send_approval_check = $this->send_for_approval($temp_approval, 1);
                        if($send_approval_check['ack'] == 0)
                        {
                            $response['ack'] = 0;
                            return $response;
                        }
                    }
                }
            }
            else if($attr['type'] == 5)
            {
                $document = 'Expense';
                $Sql_update = "UPDATE employee_expenses SET expense_status = ".$attr['status']." WHERE id=".$attr['object_id']." AND company_id = ".$this->arrUser["company_id"];
                $link = WEB_PATH."#/app/hr_values/".$attr['detail_id']."/edit?isTab=2";
                $RS1 = $this->CSI($Sql_update);
            }
            else if($attr['type'] == 6)
            {
                $document = 'Holiday';
                $Sql_update = "UPDATE hr_holidays SET holidayStatus = ".$attr['status']." WHERE id=".$attr['object_id']." AND company_id = ".$this->arrUser["company_id"];
                $link = WEB_PATH."#/app/hr_values/".$attr['detail_id']."/edit?isTab=1";
                $RS1 = $this->CSI($Sql_update);
                $this->add_holiday_history($attr,1);
            }
            else if($attr['type'] == 7)
            {
                $document = 'Purchase Order';
                $link = WEB_PATH."#/app/purchase_order/".$attr['object_id']."/edit";
                $reason = " because the total amount is exceeding the limit specified in approval setup";
            }
            else if($attr['type'] == 8)
            {
                $document = 'Credit Note';
                $link = WEB_PATH."#/app/return-orders/".$attr['object_id']."/edit";
                $reason = "";
            }
            else if($attr['type'] == 9)
            {
                $no_of_days=0;                
                $holidays=0;
                $selectHolidayHistory = "SELECT SUM(hh.no_of_days) AS no_of_days,hrh.total_holiday FROM holiday_history hh LEFT JOIN hr_holidays hrh ON hrh.id=hh.object_id WHERE hh.object_id=".$attr['object_id']." AND hh.status=1 AND hh.type=0";
                $RS = $this->CSI($selectHolidayHistory);
                if ($RS->RecordCount() > 0) {
                    while($Row = $RS->FetchRow()) {
                        foreach ($Row as $key => $value) {
                            if (is_numeric($key))
                                unset($Row[$key]);
                        }                     
                        $no_of_days = $Row['no_of_days'];
                        $total_holiday = $Row['total_holiday'];
                        $holidays = $total_holiday - $no_of_days;
                    }
                }
                
                $Sql_update1 = "UPDATE holiday_history SET status = 2 WHERE object_id=".$attr['object_id']." AND status=1 AND type=0 ";
                $this->CSI($Sql_update1);

                $holidayStatus = ($holidays >0) ? 2 : 6;

                $document = 'Cancel Holiday';
                $Sql_update = "UPDATE hr_holidays SET holidayStatus = ".$holidayStatus." , total_holiday = total_holiday-".$no_of_days.", remaining_holidays = remaining_holidays+".$no_of_days." WHERE id=".$attr['object_id']." AND company_id = ".$this->arrUser["company_id"];
                $link = WEB_PATH."#/app/hr_values/".$attr['detail_id']."/edit?isTab=1";
                $RS1 = $this->CSI($Sql_update);
               // echo $Sql_update;exit;
            }
            

            $approval_sql = "SELECT a.*,COALESCE(CONCAT(emp.first_name, '****', emp.user_email),'') AS emp_email_1                     
                             FROM approval_history AS a
                             LEFT JOIN employees AS emp ON emp.id = a.requested_by AND a.emp_id_1 > 0
                             WHERE a.id= ".$attr['id']." AND
                                   a.company_id = ".$this->arrUser["company_id"];
            // echo $approval_sql;exit;
            $RS_approval = $this->CSI($approval_sql);
           
            if ($RS_approval->RecordCount() > 0) {
                while($Row1 = $RS_approval->FetchRow()) {
                    foreach ($Row1 as $key => $value) {
                        if (is_numeric($key))
                            unset($Row1[$key]);
                    }                        
                
                    if($Row1['emp_email_1'] != '')
                        $emails_to[] = $Row1['emp_email_1'];
                }
            }


            $emp_details = explode("****", $emails_to[0]);
            $temp_attr['to'] = $attr['requested_by_email'];
            // $temp_attr['body'] = "The $document (".$attr['object_code'].") pending for approval $reason has been responded, <a href='".$link."'> View Document </a>";
            // $temp_attr['subject'] = $document."(".$attr['object_code'].") Approval Response Email";
            $temp_attr['body'] = "Dear ".$emp_details[0].", <br/><br/> The ".$document." (".$attr['object_code'].") pending for approval ".$reason." has been responded, <a href='".$link."'> View Document </a>. <br/> Thanks & Regards, <br/>".$this->arrUser["user_name"];
            $temp_attr['subject'] = "Approval Response Email";

            require_once(SERVER_PATH . "/classes/Mail.php");        
            $this->objMail = new Mail($this->arrUser);            
            $sendEmail = $this->objMail->SendSimpleEmail($temp_attr);
            $response['sendMailReq'] = $temp_attr;
            $response['sendMailRes'] = $sendEmail;
            
            if($sendEmail['ack'] == 1)
            {
                if($attr['type'] == 5 && $attr['status'] == 2)
                {
                    $Sql_convert = "CALL SR_Convert_Expense_To_Purchase_Order(".$attr['object_id'].", " . $this->arrUser['company_id'] . ", " . $this->arrUser['id'] . ")";
                    // echo $Sql_convert;exit;
                    $RS_convert = $this->CSI($Sql_convert);
                    if($RS_convert->fields['Result']==1)
                    {
                        
                        $this->Conn->commitTrans();
                        $this->Conn->autoCommit = true;
                        $response['ack'] = 1;
                    }
                    else
                    {   
                        $this->Conn->rollbackTrans();
                        $this->Conn->autoCommit = true;
                        $response['ack'] = 0;
                    } 
                }
                else
                {
                
                    $this->Conn->commitTrans();
                    $this->Conn->autoCommit = true;
                    $response['ack'] = 1;
                }
            }
            else
            {
                $this->Conn->rollbackTrans();
                $this->Conn->autoCommit = true;
                $response['ack'] = 0;
            }
            return $response;
        }
        $response['ack'] = 0;
        return $response;

    }

    function add_holiday_history($attr,$type){
        
        if($type==1){

            $getTotalApprovedholiday = "SELECT hrh.total_holiday,ah.approval_id  FROM hr_holidays hrh  LEFT JOIN approval_history ah ON ah.object_id=hrh.id WHERE hrh.id=".$attr['object_id'];
            $RS_approval = $this->CSI($getTotalApprovedholiday);
            $no_of_days = 0;
            $approval_id = 0;
            if ($RS_approval->RecordCount() > 0) {
                while($Row = $RS_approval->FetchRow()) {
                    foreach ($Row as $key => $value) {
                        if (is_numeric($key))
                            unset($Row[$key]);
                    }                        
                    $no_of_days = $Row['total_holiday'];
                    $approval_id = $Row['approval_id']; 
                }
                $add_history = "INSERT INTO holiday_history SET
                            approval_id = '". $approval_id."',
                            object_id = '". $attr['object_id']."',
                            object_code = '". $attr['object_code']."',
                            source_code = '". $attr['source_code']."',
                            source_name = '". $attr['source_name']."',
                            detail_id = '". $attr['detail_id']."',
                            no_of_days = '". $no_of_days."',
                            type = 1,
                            status = '". $attr['status']."',
                            requested_by = '". $this->arrUser['id']."',
                            requested_on = UNIX_TIMESTAMP (NOW()),
                            responded_by = 0,
                            responded_on = 0,
                            company_id = '". $this->arrUser['company_id']."',
                            emp_id_1 = 0,
                            emp_id_2 = 0,
                            emp_id_3 = 0,
                            emp_id_4 = 0,
                            emp_id_5 = 0,
                            emp_id_6 = 0,
                            comments = '0',
                            AddedBy = '". $this->arrUser['id']."',
                            AddedOn = UNIX_TIMESTAMP (NOW()),
                            ChangedBy = '".$this->arrUser['id']."',
                            ChangedOn = UNIX_TIMESTAMP (NOW())
                        ";
                        $this->CSI($add_history);
            }
        }else{
            $getTotalApprovedholiday = "SELECT * FROM approval_history WHERE object_id=$attr[holiday_id]";
            $RS_approval = $this->CSI($getTotalApprovedholiday);
            $no_of_days = 0;
            if ($RS_approval->RecordCount() > 0) {
                while($Row = $RS_approval->FetchRow()) {
                    foreach ($Row as $key => $value) {
                        if (is_numeric($key))
                            unset($Row[$key]);
                    } 

                $add_history = "INSERT INTO holiday_history SET
                            approval_id = '". $Row['approval_id']."',
                            object_id = '". $Row['object_id']."',
                            object_code = '". $Row['object_code']."',
                            source_code = '". $Row['source_code']."',
                            source_name = '". $Row['source_name']."',
                            detail_id = '". $this->arrUser['id']."',
                            no_of_days = '". $attr['cancel_no_of_days']."',
                            type = 0,
                            status = 0,
                            requested_by = '". $this->arrUser['id']."',
                            requested_on = UNIX_TIMESTAMP (NOW()),
                            responded_by = 0,
                            responded_on = 0,
                            company_id = '". $Row['company_id']."',
                            emp_id_1 = 0,
                            emp_id_2 = 0,
                            emp_id_3 = 0,
                            emp_id_4 = 0,
                            emp_id_5 = 0,
                            emp_id_6 = 0,
                            comments = '0',
                            AddedBy = '". $this->arrUser['id']."',
                            AddedOn = UNIX_TIMESTAMP (NOW()),
                            ChangedBy = '".$this->arrUser['id']."',
                            ChangedOn = UNIX_TIMESTAMP (NOW())
                        ";
                        $this->CSI($add_history);
                        if ($this->Conn->Affected_Rows() > 0) {
                            // change approval status to queue                    
                            //$updateStatus = "UPDATE approval_history SET type=9 , status=0 WHERE object_id=$attr[holiday_id]";
                           // $this->CSI($updateStatus);
                            $emp_id_1 = ($Row['emp_id_1'] != '' && intval($Row['emp_id_1']) > 0) ? $Row['emp_id_1'] : 'NULL';
                            $emp_id_2 = ($Row['emp_id_2'] != '' && intval($Row['emp_id_2']) > 0) ? $Row['emp_id_2'] : 'NULL';
                            $emp_id_3 = ($Row['emp_id_3'] != '' && intval($Row['emp_id_3']) > 0) ? $Row['emp_id_3'] : 'NULL';
                            $emp_id_4 = ($Row['emp_id_4'] != '' && intval($Row['emp_id_4']) > 0) ? $Row['emp_id_4'] : 'NULL';
                            $emp_id_5 = ($Row['emp_id_5'] != '' && intval($Row['emp_id_5']) > 0) ? $Row['emp_id_5'] : 'NULL';
                            $emp_id_6 = ($Row['emp_id_6'] != '' && intval($Row['emp_id_6']) > 0) ? $Row['emp_id_6'] : 'NULL';
                            $Sql = "INSERT INTO approval_history SET
                                            approval_id     = ".$Row['approval_id'].",
                                            object_id       = ".$Row['object_id'].",
                                            object_code     = '".$Row['object_code']."',
                                            source_code     = '".$Row['source_code']."',
                                            source_name     = '".$Row['source_name']."',
                                            detail_id       = ".$this->arrUser["id"].",
                                            current_value   = 0,
                                            currency_code   = '$Row[currency_code]',                        
                                            type            = 9,
                                            status          = 0, 
                                            requested_by    = ".$this->arrUser["id"].",
                                            requested_on    = UNIX_TIMESTAMP(NOW()), 
                                            company_id      = ".$this->arrUser["company_id"].",
                                            emp_id_1        = ".$emp_id_1.",
                                            emp_id_2        = ".$emp_id_2.",
                                            emp_id_3        = ".$emp_id_3.",
                                            emp_id_4        = ".$emp_id_4.",
                                            emp_id_5        = ".$emp_id_5.",
                                            emp_id_6        = ".$emp_id_6." ";  
                            //echo $Sql;exit;
                            $RS = $this->CSI($Sql);
                            // change holiday status to queue  for cancel                  
                            $updateStatus2 = "UPDATE hr_holidays SET holidayStatus=4  WHERE id=".$attr['holiday_id'];
                            $this->CSI($updateStatus2);
                        }
                    }
            }

        }

        if($type==0){
            $response['ack'] = 1;
            $response['error'] = "Holiday Cancellation Request sent.";
            return $response;
        }else{
            return true;
        }       

    }

    function delete_approval_history($attr, $transaction)
    {
        $Sql = "DELETE FROM approval_history 
                    WHERE object_id= ".$attr['object_id']." AND 
                        type IN (".$attr['type'].") AND 
                        company_id = ".$this->arrUser["company_id"];
        // echo $Sql;exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
        }
        else
            $response['ack'] = 0;

        return $response;
    }
    
    function update_approvals_status_bulk($attr)
    {        
        $count = 0;
        foreach($attr['selected_data'] as $rec)
        {
            $temp_attr = array();
            $temp_attr['id']                = $rec->record->id;
            $temp_attr['status']            = $attr['status'];
            $temp_attr['object_id']         = $rec->record->object_id;
            $temp_attr['object_code']       = $rec->record->object_code;
            $temp_attr['source_name']       = $rec->record->source_name;
            $temp_attr['source_code']       = $rec->record->source_code;    
            $temp_attr['comments']          = $rec->record->comments;
            $temp_attr['detail_id']         = $rec->record->detail_id;
            $temp_attr['requested_by_email']= $rec->record->requested_by_email;
            $temp_attr['current_value']     = $rec->record->current_value;
            $temp_attr['currency_code']     = $rec->record->currency_code;
            $temp_attr['type']              = $rec->record->type;
            
            $res = $this->update_approval_status($temp_attr);

            if($res['ack'] == 1)
                $count = $count + 1;
        }
        $res['count'] = $count;
        $res['ack'] = 1;
        return $res;
    }

    function update_approval_status_direct($attr)
    {
        if($attr['type'] == 5)
        {
            $Sql_update = "UPDATE employee_expenses SET expense_status = ".$attr['status']." WHERE id=".$attr['object_id']." AND company_id = ".$this->arrUser["company_id"];
            $RS1 = $this->CSI($Sql_update);
            if ($this->Conn->Affected_Rows() > 0)
                $response['ack'] = 1;
            else
                $response['ack'] = 0;
        }
        else if($attr['type'] == 6)
        {
            $Sql_update = "UPDATE hr_holidays SET holidayStatus = ".$attr['status']." WHERE id=".$attr['object_id']." AND company_id = ".$this->arrUser["company_id"];
            $RS1 = $this->CSI($Sql_update);
            if ($this->Conn->Affected_Rows() > 0)
                $response['ack'] = 1;
            else
                $response['ack'] = 0;
        }
        return $response;
    }

    function unlock_approved_order($attr)
    {
        $response = array();
        
        $Sql_update = "UPDATE approval_history SET status = 6 WHERE object_id=".$attr['object_id']." AND type in (".$attr['type'].") AND company_id = ".$this->arrUser["company_id"];
        $RS1 = $this->CSI($Sql_update);
        if ($this->Conn->Affected_Rows() > 0)
            $response['ack'] = 1;
        else
            $response['ack'] = 0;
        
        return $response;

    }

    function get_approvers_list($attr)
    {
        $response = array();
        $emails_to = array(array());
        $approvers = array();

        $attr['approval_types'] = ($attr['approval_types']==9) ? 6 : $attr['approval_types'];

        $approval_sql = "SELECT a.*,
                            (CASE WHEN a.emp_id_1 > 0 THEN
                                (SELECT CONCAT(emp.id, '****', emp.first_name, '****', emp.user_email) AS emp_details
                                    FROM employees AS emp
                                        WHERE emp.id = a.emp_id_1)
                                ELSE 
                                    ''
                            END) AS emp_email_1,
                                (CASE WHEN a.emp_id_2 > 0 THEN
                                    (SELECT CONCAT(emp.id, '****', emp.first_name, '****', emp.user_email) AS emp_details
                                        FROM employees AS emp
                                            WHERE emp.id = a.emp_id_2)
                                ELSE 
                                    ''
                            END) AS emp_email_2,
                                (CASE WHEN a.emp_id_3 > 0 THEN
                                    (SELECT CONCAT(emp.id, '****', emp.first_name, '****', emp.user_email) AS emp_details
                                        FROM employees AS emp
                                            WHERE emp.id = a.emp_id_3)
                                ELSE 
                                    ''
                            END) AS emp_email_3,
                                (CASE WHEN a.emp_id_4 > 0 THEN
                                    (SELECT CONCAT(emp.id, '****', emp.first_name, '****', emp.user_email) AS emp_details
                                        FROM employees AS emp
                                            WHERE emp.id = a.emp_id_4)
                                ELSE 
                                    ''
                            END) AS emp_email_4,
                                (CASE WHEN a.emp_id_5 > 0 THEN
                                    (SELECT CONCAT(emp.id, '****', emp.first_name, '****', emp.user_email) AS emp_details
                                        FROM employees AS emp
                                            WHERE emp.id = a.emp_id_5)
                                ELSE 
                                    ''
                            END) AS emp_email_5,
                                (CASE WHEN a.emp_id_6 > 0 THEN
                                    (SELECT CONCAT(emp.id, '****', emp.first_name, '****', emp.user_email) AS emp_details
                                        FROM employees AS emp
                                            WHERE emp.id = a.emp_id_6)
                                ELSE 
                                    ''
                            END) AS emp_email_6                                 
                        FROM approval_setup AS a
                                WHERE type IN (".$attr['approval_types'].") AND
                                    company_id = ".$this->arrUser["company_id"];
        // echo $approval_sql;exit;
        $RS_approval = $this->CSI($approval_sql);
        
        if ($RS_approval->RecordCount() > 0) {
            while($Row1 = $RS_approval->FetchRow()) {
                foreach ($Row1 as $key => $value) {
                    if (is_numeric($key))
                        unset($Row1[$key]);
                }                        
            
                if($Row1['emp_email_1'] != '')
                    $emails_to[$Row1['emp_id_1']][] = $Row1['emp_email_1'];

                if($Row1['emp_email_2'] != '')
                    $emails_to[$Row1['emp_id_2']][] = $Row1['emp_email_2'];

                if($Row1['emp_email_3'] != '')
                    $emails_to[$Row1['emp_id_3']][] = $Row1['emp_email_3'];

                if($Row1['emp_email_4'] != '')
                    $emails_to[$Row1['emp_id_4']][] = $Row1['emp_email_4'];

                if($Row1['emp_email_5'] != '')
                    $emails_to[$Row1['emp_id_5']][] = $Row1['emp_email_5'];

                if($Row1['emp_email_6'] != '')
                    $emails_to[$Row1['emp_id_6']][] = $Row1['emp_email_6'];
                
            }
            
            
            $types_arr = explode(",", $attr['approval_types']);
            $input_types = count($types_arr);
            
            foreach($emails_to as $index=>$arr)
            {
                if(count($arr) == $input_types)
                {
                    $temp = explode("****", $arr[0]);
                    $obj['id'] = $temp[0];
                    $obj['name'] = $temp[1];
                    $obj['email'] = $temp[2];
                    $approvers[] = $obj;
                }
            }

            
        }
        $response['ack']  = 1;
        $response['approvers']  = $approvers;
        // $response['emails_to']  = $emails_to;

        return $response;
    }


    function get_show_hide_add_btn($attr)
    {
        $Sql = "SELECT show_sales_add_btn, show_customer_add_btn, show_supplier_add_btn
                    FROM company 
                    WHERE 
                        id = " . $this->arrUser['company_id'];  
        // echo $Sql;exit;
        $RS = $this->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response'] = $Row;
            }
            $response['ack'] = 1;
        }
        else
            $response['ack'] = 0;

        return $response;
    }
    
    function update_show_hide_add_btn($attr)
    {
        $Sql = "UPDATE company SET
                        show_sales_add_btn = ".$attr['show_sales_add_btn'].", 
                        show_customer_add_btn = ".$attr['show_customer_add_btn'].",
                         show_supplier_add_btn = ".$attr['show_supplier_add_btn']."
                    WHERE 
                        id = " . $this->arrUser['company_id'];  
        // echo $Sql;exit;
        $RS = $this->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0)
            $response['ack'] = 1;
        else
            $response['ack'] = 2;

        return $response;
    }

    function change_all_passwords()
    {
        ini_set('max_execution_time', '360');
        $Sql = "SELECT id, user_password FROM employees";
        // echo $Sql;exit;
        $RS = $this->Conn->Execute($Sql);
        if ($RS->RecordCount() > 0) {

            while ($Row = $RS->FetchRow()) {
                $password = $this->objGeneral->decrypt_password($Row['user_password']);
                $enc_password = $this->objGeneral->encrypt_password_1($password);
                $update_Sql = "UPDATE employees SET user_password_1 = '$enc_password' WHERE id=$Row[id]";
                // echo $update_Sql;exit;
                $RS1 = $this->Conn->Execute($update_Sql);
            }
        }
        $response['ack'] = 1;
        return $response;
    }
    
    function moduleDecider ($moduleType, $moduleId){
        // decides if the module type is for crm, customer, srm or a supplier..
        $moduleForPermission = "";
        if ($moduleType == 1){
            $Sql = " SELECT type FROM crm WHERE id = ".$moduleId." AND company_id = '" .$this->arrUser['company_id'] . "' ";
            $RS = $this->CSI($Sql);

            $type = $RS->fields[0];

            if ($type == 1 || $type == 4){
                $moduleForPermission = "crm";
            }
            else if ($type == 3 || $type == 2){
                $moduleForPermission = "customer";

            }
        }
        else if ($moduleType == 2){

            $Sql = " SELECT type FROM srm WHERE id = ".$moduleId." AND company_id = '" .$this->arrUser['company_id'] . "' ";
            $RS = $this->CSI($Sql);
            $type = $RS->fields[0];

            if ($type == 1){
                $moduleForPermission = "srm";
            }
            else if ($type == 3 || $type == 2){
                $moduleForPermission = "supplier";
            }
        }
        return $moduleForPermission;
    }
    
    function SRTraceLogsSQL($query, $query_response, $type) // type = 1-> SQL, type = 2 --> everything else
    {
       return $this->objQueryMaster->SRTraceLogsSQL($query, $query_response, $type);
    }


    function SRTraceLogsPHP($srLogTrace)
    {
        return $this->objQueryMaster->SRTraceLogsPHP($srLogTrace);
    } 
    
    

    function removeWhiteSpace($text)
    {
        return $this->objQueryMaster->removeWhiteSpace($text);
    }

    function CSI($query, $permissionModule=null, $permission=null){
        return $this->objQueryMaster->CSI($query, $permissionModule, $permission);
        // echo $permission;exit;
    }

    function applicationLimitations ($attr) {
        $this->objGeneral->mysql_clean($attr);
        

         $Sql = "SELECT num_user_login, name, 
            SUM(case when allow_login = 1 then 1 else 0 end) as allow_login_users, 
            SUM(case when allow_login = 0 then 1 else 0 end)  as current_users,
            SUM(case when allow_login = 0 then 1 else 1 end)  as total_users ,
            (SELECT last_activity_time FROM employees 
             where company_id = emp.company_id 
             ORDER BY last_activity_time DESC 
             limit 1) as  last_activity_time,
            (SELECT known_as FROM employees 
             where company_id = emp.company_id 
             ORDER BY last_activity_time DESC 
             limit 1) as  known_as,
            (SELECT user_email FROM employees 
             where company_id = emp.company_id 
             ORDER BY last_activity_time DESC 
             limit 1) as  user_email
            FROM company, employees  AS emp where company.id =".$this->arrUser['company_id']."
            AND company.id = emp.company_id ;" 
                ;
        // echo $Sql; exit;
        $RS = $this->CSI($Sql);
        // print_r($RS);exit;
        $response = array();
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $row = array(); 
                $row['num_max_user_login'] = $Row['num_user_login'];
                $row['name'] = $Row['name'];
                $row['allow_login_users'] = $Row['allow_login_users'];
                $row['current_users'] = $Row['current_users'];
                $row['total_users'] = $Row['total_users'];
                $row['last_activity_time'] = $this->objGeneral->convert_unix_into_datetime($Row['last_activity_time']);
                $row['last_activity_known_as'] = $Row['known_as'];
                $row['last_activity_user_email'] = $Row['user_email'];
                $row['sales_invoices'] = "12";
                $row['storage_purchased'] = "50";
                $row['storage_used'] = "3";
                $row['storage_available'] = "47";
                $row['total_rows'] = $RS->RecordCount();
                $response['response'][] = $row; 
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;            
    }

    function getHistory($attr){
            // print_r($attr);exit;
        $Sql = "CALL SRArchiveReturnHistory('".$attr['screen']."', ";
        for ($i = 0; $i < sizeof($attr['params']); $i++){
            if ($i){
                $Sql .= ", ";
            }
            $Sql .= "'" . $attr['params'][$i]->key . "'," . "'" . $attr['params'][$i]->value . "'";
        }

        for ($i; $i < 4; $i++){
            if ($i){
                $Sql .= ", ";
            }
            $Sql .= "'N_A'," . "'N_A'";
        }
        
        
        $Sql .= ")";
        
        $RS = $this->CSI($Sql);
        // print_r($RS);exit;
        $response = array();
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $Row['ChangedOn'] = $this->objGeneral->convert_unix_into_datetime($Row['ChangedOn']);
                $response['response'][] = $Row; 
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_logout_time($attr){

        $Sql = "UPDATE employee_activity SET  logout_time = UNIX_TIMESTAMP(NOW())
        WHERE
        emp_id = '".$this->arrUser['id']."' AND
        company_id = '".$this->arrUser['company_id']."' AND
        login_ip = '".$this->objGeneral->getRealIpAddr()."'
        ";
        //ORDER BY id DESC LIMIT 1
    
        $RS = $this->CSI($Sql);
        
        return true;
    }

    function get_employees_leftside($attr)
    {
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $str_where = '';
        $order_type = '';
        $defaultFilter = false;
        $response = array();
        //print_r($attr);exit;
        $where_clause = $this->objGeneral->flexiWhereRetriever("c.", $attr, $fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("c.", $attr, $fieldsMeta);
        if (empty($where_clause)) {
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("EmployeeLeft", $this->arrUser);
        }

        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT * FROM (SELECT id, user_code as code, CONCAT(first_name, ' ', last_name) as name FROM employees WHERE user_code IS NOT null AND status = 1 AND user_code <> '' AND  user_type <> 1 AND  company_id = ".$this->arrUser['company_id'].") as c WHERE 1  ".$where_clause . " ";
        $total_limit = pagination_limit;

        //echo $total_limit."limit";

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];


        $column = $code_check;


        if ($order_clause == "")
            $order_type = " Order BY c.id ASC";
        else
            $order_type = $order_clause;

        $response = $this->objGeneral->preListing($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        // $RS = $this->CSI($response['q']);
        $response['response']['tbl_meta_data'] = $this->GetTableMetaData('EmployeeLeft');
        $response['response']['tbl_meta_data']['defaultFilter'] = $defaultFilter;
        $RS = $this->CSI($response['q']);
        // $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['total'] = $Row['totalRecordCount'];                
                $response['response'][] = $Row;
            }

            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 1;
            $response['error'] = NULL;
        }
        $response = $this->objGeneral->postListing($attr, $response);

        return $response;
        
    }
}

?>