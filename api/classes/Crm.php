<?php
// error_reporting(E_ALL);
require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/General.php");
require_once(SERVER_PATH . "/classes/Setup.php");
require_once(SERVER_PATH . "/classes/Stock.php");
require_once(SERVER_PATH . "/classes/Hr.php");
require_once(SERVER_PATH . "/classes/Srm.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require(SERVER_PATH . "/vendor/sendgrid-php/sendgrid-php.php");
//require_once(SERVER_PATH . "/classes/class.phpmailer.php");
require 'vendor/autoload.php';


class Crm extends Xtreme
{
    private $Conn = null;
    private $objGeneral = null;
    private $arrUser = null;
    private $objsetup = null;
    private $objstock = null;
    private $objHr = null;
    private $objSrm = null;

    function __construct($user_info = array())
    {

        parent::__construct();
        $this->Conn = parent::GetConnection();
        $this->objGeneral = new General($user_info);
        $this->objstock = new Stock($user_info);
        $this->objsetup = new Setup($user_info);
        $this->objHr = new Hr($user_info);
        $this->objSrm = new Srm($user_info);
        $this->arrUser = $user_info;
        $this->sendgrid = new \SendGrid('SG.U1fh-cwZQfSPoO8WzzWe0w.0w0gH1UCAQEPbOsnipbF0iU0SPzJpGNU8C1CCPg03h0');
    }

    // General Tab/ Main Crm Info Module
    //--------------------------------------
    // static
    function delete_update($table_name, $column, $id)
    {

        $Sql = "UPDATE $table_name SET  $column=0 	WHERE crm_id = $id";

        $RS = $this->objsetup->CSI($Sql);
        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        }

        return $response;
    } // commit

    function delete_update_status($table_name, $column, $id)
    {

        //	$Sql = "DELETE FROM $table_name 	WHERE id = $id Limit 1 ";
        $Sql = "UPDATE $table_name SET  $column=0 	WHERE id = $id Limit 1";
        //echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        }

        return $response;
    }

    function get_data_by_id($table_name, $id)
    {

        $Sql = "SELECT *
		FROM $table_name
		WHERE id=$id
		LIMIT 1";
        //	echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);
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

    function get_all_employees($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "SELECT * FROM employees
            WHERE company_id='" . $this->arrUser['company_id'] . "' AND user_type <> 1  AND status=1 ORDER BY user_code ASC";

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['first_name'] . ' ' . $Row['last_name'];
                $result['email'] = $Row['email'];
                $result['user_code'] = $Row['user_code'];
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

    function load_crm_nested_data($attr, $response, $type, $notselect = null)
    {
        $attr['crm_id'] = $attr['id'];
        $attr['value'] = $attr['id'];
        $attr['primaryc_id'] = $response["response"]['primaryc_id'];

        $attr['is_primary'] = 1;

        if ($type == 'crm' || $type == 'customer') {
            $attr['tbl'] = base64_encode('crm_status');
            $attr['type'] = 'SOURCES_OF_CRM';


            //load from crm class in single json
            $result1 = $this->get_crm_credit_ratings();
            $response['response']['arr_crm_credit_rating'] = $result1['response'];
            // $result2 = $this->get_all_owner();
            // $response['response']['arr_ownership'] = $result2['response'];
            /* $result3 = $this->get_crm_classifications();//$attr[main_type] = '1'
            $response['response']['arr_crm_classification'] = $result3['response']; */
            $result4 = $this->get_pref_method_of_comm();
            $response['response']['arr_pref_method_comm'] = $result4['response'];
            if (isset($attr['id'])) {
                $result5 = $this->get_crmSalesPerson($attr);
                $response['response']['crmSalesPerson'] = $result5['response'];
            }


            require_once(SERVER_PATH . "/classes/Setup.php");
            $objsetup = new Setup($this->arrUser);
            $result8 = $objsetup->get_predefine_by_type($attr);
            $response['response']['arr_sources_of_crm'] = $result8['response'];


            if (isset($attr['customer'])) {
                $attr['tbl'] = base64_encode('customer_status');
                $result9 = $objsetup->get_all_status($attr, 1);
                $response['response']['arr_crm_status'] = $result9['response'];
            }

            $attr["type"] = 1;
            $attr["module_id"] = $attr['id'];

            if ($attr['primaryc_id'] > 0) {
                $result10 = $this->getPrimaryContactLocAssigntotal($attr);
                $response['response']['totalLocAssigned'] = $result10['showdata'];
            }

            /* Commented by Ahmad End */


            // if(empty($notselect))  $result9 = $objsetup->get_all_status($attr,1);
            // if(empty($notselect))   $response['response']['arr_crm_status'] = $result9['response'];
        }
        // print_r($response['response']['arr_crm_status']);exit;

        return $response;
    }

    function get_sales_person_bucket($attr)
    {
        $ids = "";
        $response = array();
        $where_clause = "";
        // print_r($attr);//exit;
        // if (!empty($attr['bucket_selected_array'])) {
        foreach ($attr['bucket_selected_array'] as $item) {
            // echo $item;
            // print_r($item);
            $ids .= $item['id'] . ',';
        }
        $ids = substr($ids, 0, -1);

        $Sql = "SELECT emp.id as spid ,emp.is_primary, es.job_title,CONCAT( es.first_name,' ',es.last_name) as  name, csb.name as bucket_name,CONCAT( es.id,'.',emp.id) as  id2,es.id as id,csb.id as  bucket_id, SR_EMPLOYEE_DEPARTMENTS(es.id, es.user_company) AS dep_name
                    FROM crm_salesperson emp  left JOIN bucket csb on csb.id=emp.module_id
                    left JOIN employees  es on es.id=emp.salesperson_id
                    WHERE emp.company_id='" . $this->arrUser['company_id'] . "' AND
                           emp.type = '" . $attr['type'] . "' AND  emp.end_date=0  AND emp.module_id IN ('" . $attr['module_id'] . "') 
                    GROUP BY es.id ";

        //$ids

        $order_by = 'order by  csb.name DESC ';

        $total_limit = pagination_limit;


        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_by);
        // echo $response['q'];exit;
        // exit;

        $RS = $this->objsetup->CSI($response['q']);
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
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function get_crm_listings($attr)
    {
        // print_r($attr);exit;

        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";

        $response = array();
        $defaultFilter = false;
        //$this->objGeneral->mysql_clean($attr);
        $where_clause = $this->objGeneral->flexiWhereRetriever("c.", $attr, $fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("c.", $attr, $fieldsMeta);
        if (empty($where_clause)) {
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("CRM", $this->arrUser);
        }

        // $type = (isset($attr['retailer']) && $attr['retailer'] == 1) ? 4 : 1;
        $type = (isset($attr['retailer']) && $attr['retailer'] == 1 && $attr['retailer'] != 2) ? 4 : 1;
        $type = (isset($attr['retailer']) && $attr['retailer'] != 1 && $attr['retailer'] == 2) ? 0 : 1;

        $Sql = "SELECT  c.id,c.crm_code,c.region,c.statusp,c.segment,c.buying_group,c.name,
                        c.primaryc_name,c.primaryc_email, c.company_email, c.primary_county, c.primary_city,
                        c.primary_postcode,c.phone,c.type,c.salesperson_name,c.crm_classification,
                        c.social_media_name,c.address_1,c.address_2,c.web_address,c.company_reg_no,
                        c.turnover,c.primary_country,c.currency,c.credit_limit,c.credit_rating,c.verifiedStatus,
                        c.source_of_crm
                FROM sr_crm_listing AS c 
                where c.type IN (" . $type . ") AND c.crm_code IS NOT NULL AND
                      c.company_id=" . $this->arrUser['company_id'] . "  " . $where_clause . " ";



        // echo $Sql;exit;
        /* if($type==1){
           $Sql = $this->objsetup->whereClauseAppender($Sql,40); 
        } */

        //or  company.parent_id=" . $this->arrUser['company_id'] . "
        //defualt Variable

        $column = 'c.id';
        if (!empty($attr['sort_column'])) {
            $column = 'c.' . $attr['sort_column'];

            if ($attr['sort_column'] == 'code')
                $column = 'c.crm_code';
            else if ($attr['sort_column'] == 'person')
                $column = 'c.primaryc_name'; //$column = 'c.contact_person';
            else if ($attr['sort_column'] == "Region")
                $column = 'c.region'; //$column = 'cr.' . 'title';
            else if ($attr['sort_column'] == "Segment")
                $column = 'c.segment'; //$column = 'seg.' . 'title';
            else if ($attr['sort_column'] == "Buying Group")
                $column = 'c.buying_group'; //$column = 'bs.' . 'title';
            //calculated value can be order by id
            else if ($attr['sort_column'] == 'status')
                $column = 'c.statusp'; //$column = 'c.id';

            //$order_type = "Order BY " . $column . " $attr[sortform]";

        }

        if ($order_clause == "")
            $order_type = " Order BY c.id DESC ";
        else $order_type = $order_clause;


        //$order_type = "Order BY " . $column . " DESC";
        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->preListing($attr, $Sql, $response, $total_limit, 'c', $order_type);

        //echo $response['q'];
        if (isset($attr['retailer']) && $attr['retailer'] == 1) {
            $tableName = "CRM_retailer";
        } else {
            if ($attr['bucketTable']) $tableName = "crm_bucket";
            else $tableName = "CRM";
        }
        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData($tableName);
        $response['response']['tbl_meta_data']['defaultFilter'] = $defaultFilter;
        //echo $Sql;exit;
        $RS = $this->objsetup->CSI($response['q'], "crm", sr_ViewPermission);
        // $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id']                 = $Row['id'];
                $result['crm_code']           = $Row['crm_code'];
                $result['name']               = $Row['name'];
                $result['primary_location']   = $Row['primary_location'];
                // $result['person'] = $Row['contact_person'];
                $result['primaryc_name']      = $Row['primaryc_name'];
                $result['primaryc_email']     = $Row['primaryc_email'];
                //$result['city'] = $Row['city'];
                $result['primary_city']       = $Row['primary_city'];
                // $result['postcode'] = $Row['postcode'];
                $result['primary_postcode']   = $Row['primary_postcode'];
                $result['primary_county']     = $Row['primary_county'];
                //$result['phone'] = $Row['phone'];
                $result['phone']              = $Row['phone'];
                $result['type']               = $Row['type'];
                $result['company_email']      = $Row['company_email'];
                $result['region']             = $Row['region'];
                $result['buying_group']       = $Row['buying_group'];
                $result['segment']            = $Row['segment'];
                $result['crm_classification'] = $Row['crm_classification'];
                $result['salesperson_name']   = $Row['salesperson_name'];
                $result['statusp']            = $Row['statusp'];
                $result['social_media_name']  = $Row['social_media_name'];
                $result['address_1']  = $Row['address_1'];
                $result['address_2']  = $Row['address_2'];
                $result['web_address']  = $Row['web_address'];
                $result['company_reg_no']  = $Row['company_reg_no'];
                $result['turnover']  = $Row['turnover'];
                $result['primary_country']  = $Row['primary_country'];
                $result['currency']  = $Row['currency'];
                $result['credit_limit']  = $Row['credit_limit'];
                $result['credit_rating']  = $Row['credit_rating'];
                $result['verifiedStatus'] = $Row['verifiedStatus'];
                $result['source_of_crm'] = $Row['source_of_crm'];
                //if ($Row['status'] == 0)    $result['status_name'] = "Deleted";
                //$result['status_date'] = $this->objGeneral->convert_unix_into_date($Row['status_date']);
                $response['total'] = $Row['totalRecordCount'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response = $this->objGeneral->postListing($attr, $response);
        } else {
            $response['ack'] = 1;
            $response['response'][] = array();
        }


        return $response;
    }

    function get_crm_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //$Sql = "SELECT * FROM crm WHERE id='".$attr['id']."' 	LIMIT 1";
        $response['response'] = array();
        $upToDate = date("Y-m-d");

        $moduleCodeType = 1;

        $balanceInCustomerCurrency = '';

        if (isset($attr['defaultCurrency']) && $attr['defaultCurrency'] > 0) {
            $balanceInCustomerCurrency = ",
                         (CASE WHEN (c.type <> 1 AND c.currency_id <> " . $attr['defaultCurrency'] . ") THEN sr_getCustomerBalanceInActualCurrency('$upToDate',c.company_id,c.id)
                               ELSE 0
                               END) AS balanceInCustomerCurrency";
        }

        /* if ($attr['customer'] == "customer"){
            $bucketType = 48;
        }
        else{
            $bucketType = 40;
        } */
        //IFNULL(SR_CalculateCustomerBalance(".$attr['id'].", " . $this->arrUser['company_id'] . "), 0) AS customer_balance     

        $Sql = "SELECT  *,
                        IFNULL(SR_rep_aged_cust_sum(c.id,DATE_SUB('$upToDate', INTERVAL 14600 DAY),DATE_ADD('$upToDate', INTERVAL 14600 DAY),c.company_id,'LCY_total',2,'',DATE_ADD('$upToDate', INTERVAL 14600 DAY)), 0) AS customer_balance,
                        IFNULL(SR_Payment_Days_Avg(c.id,DATE_SUB('$upToDate', INTERVAL 14600 DAY),'$upToDate',c.company_id,1), 0) AS custAvgPaymentDays   
                         $balanceInCustomerCurrency            
                FROM sr_crm  c 
                WHERE c.id=" . $attr['id'] . " AND c.company_id=" . $this->arrUser['company_id'] . "  ";

        /* $subQueryForBuckets = "SELECT  c.id
            from sr_crm_listing  c
            where  c.id IS NOT NULL "; */

        if ($attr['customer'] == "customer") { //crm
            $subQueryForBuckets = "SELECT  c.id
                                    FROM sr_crm_listing c
                                    WHERE c.type IN (2,3) AND 
                                        c.company_id=" . $this->arrUser['company_id'] . "";
            $bucketType = 48;
        } else {
            $subQueryForBuckets = "SELECT  c.id
                            FROM sr_crm_listing c
                            WHERE c.type IN (1,2) AND 
                                c.company_id=" . $this->arrUser['company_id'] . "";
            $bucketType = 40;
        }
        // $subQueryForBuckets = $this->objsetup->whereClauseAppender($subQueryForBuckets, $bucketType);
        //echo $subQueryForBuckets;exit;
        /* if(!isset($attr['is_retailer']) && $attr['is_retailer']!=1){
           $Sql .= " AND c.id IN ($subQueryForBuckets) "; 
        } */

        $Sql .= " LIMIT 1 ";
        // echo $Sql;exit;
        if ($attr['customer'] == "customer") {
            $RS = $this->objsetup->CSI($Sql, "customer_gneraltab", sr_ViewPermission);
        } else {
            $RS = $this->objsetup->CSI($Sql, "crm_gneraltab", sr_ViewPermission);
        }

        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $Row['date_of_inc'] = $this->objGeneral->convert_unix_into_date($Row['date_of_inc']);

            if ($Row['customer_balance'] == '333333333')
                $Row['customer_balance'] = 0;

            $response['response'] = $Row;

            // if(strlen($Row['crm_code']) > 0)
            {
                $temp_attr = array();
                if ($Row['crm_type'] != "1") {
                    $temp_attr['crm_id'] = $Row['id'];
                    $temp_attr['fromData'] = 1;

                    if ($Row['crm_type'] == 2)
                        $temp_attr['type'] = 1;
                    else
                        $temp_attr['type'] = 2;

                    $response['response']['RouteToMarket'] = $this->get_all_route_to_market($temp_attr);

                    $Sql = "SELECT type
                            FROM ref_module_category_value
                            WHERE  module_code_id = 2 AND status = 1 AND company_id=" . $this->arrUser['company_id'] . "
                            LIMIT 1";
                    // echo  $Sql;exit;

                    $rs4 = $this->objsetup->CSI($Sql);

                    if ($rs4->RecordCount() > 0) {
                        $moduleCodeType = $rs4->fields['type'];
                    }
                } else {
                    $Sql = "SELECT type
                            FROM ref_module_category_value
                            WHERE  module_code_id=1 AND status=1 AND company_id=" . $this->arrUser['company_id'] . "
                            LIMIT 1";
                    // echo  $Sql;exit;

                    $rs4 = $this->objsetup->CSI($Sql);

                    if ($rs4->RecordCount() > 0) {
                        $moduleCodeType = $rs4->fields['type'];
                    }
                }
            }
        } else {
            $response['response'] = array();
            $response['bucketFail'] = 1;
        }

        if (!empty($attr['customer'])) {
            $type = 'customer';
        } else {
            $type = 'crm';
        }

        $response = $this->load_crm_nested_data($attr, $response, $type);
        $response['moduleCodeType'] = $moduleCodeType;

        return $response;
    }

    function get_unique_id($attr)
    {

        $moduleCodeType = 1;

        if ($attr['type'] == 1) {

            $Sql = "SELECT type
                    FROM ref_module_category_value
                    WHERE  module_code_id=1 AND status=1 AND company_id=" . $this->arrUser['company_id'] . "
                    LIMIT 1";
            // echo  $Sql;exit;

            $rs4 = $this->objsetup->CSI($Sql);

            if ($rs4->RecordCount() > 0) {
                $moduleCodeType = $rs4->fields['type'];
            }
        }

        $response['ack'] = 1;
        $response['moduleCodeType'] = $moduleCodeType;
        $response = $this->load_crm_nested_data($attr, $response, 'crm', 'notselect');


        return $response;
    }

    function add_crm($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        if (!empty($arr_attr['id']))
            $where_id = "AND tst.id <>  '" . $arr_attr['id'] . "' ";

        $data_pass = " tst.type IN (1,2) AND tst.name='" . $arr_attr['name'] . "' $where_id ";
        $total = $this->objGeneral->count_duplicate_in_sql('crm', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $is_billing_address  = (isset($arr_attr['is_billing_address']) && $arr_attr['is_billing_address'] != '') ? $arr_attr['is_billing_address'] : 0;
        $is_delivery_collection_address  = (isset($arr_attr['is_delivery_collection_address']) && $arr_attr['is_delivery_collection_address'] != '') ? $arr_attr['is_delivery_collection_address'] : 0;
        $is_invoice_address  = (isset($arr_attr['is_invoice_address']) && $arr_attr['is_invoice_address'] != '') ? $arr_attr['is_invoice_address'] : 0;

        $anonymous_customer = (isset($arr_attr['anonymous_customer']) && $arr_attr['anonymous_customer'] != '') ? $arr_attr['anonymous_customer'] : 0;
        $unsubscribeEmail = (isset($arr_attr['unsubscribeEmail']) && $arr_attr['unsubscribeEmail'] != '') ? $arr_attr['unsubscribeEmail'] : 0;

        $Sql = "INSERT INTO crm 
                            SET 
                            transaction_id = SR_GetNextTransactionID(" . $this->arrUser['company_id'] . ", 2),
                            crm_code='" . $arr_attr['crm_code'] . "',
                            crm_classification='" . $arr_attr['crm_classification'] . "',
                            name='" . $arr_attr['name'] . "',
                            type='" . $arr_attr['type'] . "',
                            ownership_type='" . $arr_attr['ownership_type'] . "',
                            address_type='" . $arr_attr['address_type'] . "',
                            contact_person='" . $arr_attr['contact_person'] . "',
                            address_1='" . $arr_attr['address_1'] . "',
                            job_title='" . $arr_attr['job_title'] . "',
                            address_2='" . $arr_attr['address_2'] . "',
                            phone='" . $arr_attr['phone'] . "',
                            city='" . $arr_attr['city'] . "',
                            fax='" . $arr_attr['fax'] . "',
                            county='" . $arr_attr['county'] . "',
                            country_id='" . $arr_attr['country_id'] . "',
                            mobile='" . $arr_attr['mobile'] . "',
                            postcode='" . $arr_attr['postcode'] . "',
                            direct_line='" . $arr_attr['direct_line'] . "',
                            support_person='" . $arr_attr['support_person'] . "',
                            email='" . $arr_attr['email'] . "',
                            salesperson_id='" . $arr_attr['salesperson_id'] . "',
                            turnover='" . $arr_attr['turnover'] . "',
                            internal_sales='" . $arr_attr['internal_sales'] . "',
                            company_type='" . $arr_attr['company_type'] . "',
                            source_of_crm='" . $arr_attr['source_of_crm'] . "',
                            pref_method_of_communication='" . $arr_attr['pref_method_of_communication'] . "',
                            status='" . $arr_attr['status'] . "',
                            web_address='" . $arr_attr['web_address'] . "',
                            buying_grp='" . $arr_attr['buying_grp'] . "',
                            region_id='" . $arr_attr['region_id'] . "',
                            credit_rating='" . $arr_attr['credit_rating'] . "',
                            currency_id='" . $arr_attr['currency_id'] . "',
                            anonymous_customer='" . $anonymous_customer . "',
                            user_id='" . $this->arrUser['id'] . "',
                            company_id='" . $this->arrUser['company_id'] . "',
                            AddedBy='" . $this->arrUser['id'] . "',
                            AddedOn= UNIX_TIMESTAMP (NOW()),
                            emp_no='" . $arr_attr['emp_no'] . "',
                            unsubscribeEmail='" . $unsubscribeEmail . "',
                            is_billing_address='" . $is_billing_address . "',
                            is_shipping_address='" . $is_delivery_collection_address . "',
                            is_invoice_address='" . $is_invoice_address . "'";

        //echo $Sql."<hr>"; exit;

        // prev_code='$arr_attr[prev_code]',
        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {


            $response['id'] = $id;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['id'] = 0;
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
        }

        return $response;
    }

    function updateDuplicationAddress($attr)
    {

        $acc_id      = $attr['rec']->acc_id;
        $module_type = $attr['rec']->module_type;
        $billing     = $attr['reccheckaddress']->billing;
        $payment     = $attr['reccheckaddress']->payment;
        $company_id  = $this->arrUser['company_id'];

        if ($billing == 1 && $payment == 1) {

            $Sql = "SELECT id   FROM alt_depot WHERE is_billing_address = 1 AND acc_id = '$acc_id' AND module_type = '$module_type' AND company_id = '$company_id'";

            $RS = $this->objsetup->CSI($Sql);

            if ($RS->RecordCount() > 0) {
                $Sql = "UPDATE alt_depot SET is_billing_address = 0 WHERE acc_id = '$acc_id' AND module_type = '$module_type' AND company_id = '$company_id'";
                $this->objsetup->CSI($Sql);
            }

            $Sql = "SELECT id   FROM alt_depot WHERE is_invoice_address = 1 AND acc_id = '$acc_id' AND module_type = '$module_type' AND company_id = '$company_id'";

            $RS = $this->objsetup->CSI($Sql);

            if ($RS->RecordCount() > 0) {
                $Sql = "UPDATE alt_depot SET is_invoice_address = 0 WHERE acc_id = '$acc_id' AND module_type = '$module_type' AND company_id = '$company_id'";
                $this->objsetup->CSI($Sql);
            }
        } else if ($billing == 1) {

            $Sql = "SELECT id   FROM alt_depot WHERE is_billing_address = 1 AND acc_id = '$acc_id' AND module_type = '$module_type' AND company_id = '$company_id'";

            $RS = $this->objsetup->CSI($Sql);

            if ($RS->RecordCount() > 0) {

                $Sql = "UPDATE alt_depot SET is_billing_address = 0 WHERE acc_id = '$acc_id' AND module_type = '$module_type' AND company_id = '$company_id'";
                $this->objsetup->CSI($Sql);
            }
        } else if ($payment == 1) {
            $Sql = "SELECT id   FROM alt_depot WHERE is_invoice_address = 1 AND acc_id = '$acc_id' AND module_type = '$module_type' AND company_id = '$company_id'";

            $RS = $this->objsetup->CSI($Sql);

            if ($RS->RecordCount() > 0) {
                $Sql = "UPDATE alt_depot SET is_invoice_address = 0 WHERE acc_id = '$acc_id' AND module_type = '$module_type' AND company_id = '$company_id'";

                $this->objsetup->CSI($Sql);
            }
        }

        return;
    }

    function checkAddressDuplication($attr)
    {
        //print_r($attr); exit;
        $attr['rec'] =  (array) $attr['rec'];

        $response = $this->objGeneral->check_duplication_for_location_address($attr['rec'], $attr['rec']['acc_id'], $attr['rec']['module_type'], $this->arrUser['company_id'], $attr['rec']['id'], 1);
        return $response;
    }

    function duplicationChkCRM($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $response = array();
        $response['ack'] = 0;
        $response['error'] = '';

        $Sql1 = "SELECT  c1.name,c1.crm_code,c1.customer_code,c1.type
                 FROM crm AS c1
                 WHERE  c1.company_id = '" . $this->arrUser['company_id'] . "' AND  
                        c1.web_address = '" . $attr['web_address'] . "' AND 
                        c1.web_address <> '' AND
                        c1.status <> -1
                 LIMIT 1";
        //echo  $Sql1;exit;

        if ($attr['crmModuleType'] == 1)
            $RS1 = $this->objsetup->CSI($Sql1, "crm", sr_AddPermission);
        else
            $RS1 = $this->objsetup->CSI($Sql1, "customer", sr_AddPermission);

        if ($RS1->RecordCount() > 0) {
            $Row1 = $RS1->FetchRow();
            foreach ($Row1 as $key => $value) {
                if (is_numeric($key))
                    unset($Row1[$key]);
            }

            $response['ack'] = 1;

            if ($Row1['type'] == 1) {
                $response['error'] = ' Same web address already exist under ' . $Row1['name'] . '(' . $Row1['crm_code'] . '). Are you sure, you want to duplicate?';
            } else {
                $response['error'] = ' Same web address already exist under ' . $Row1['name'] . '(' . $Row1['customer_code'] . '). Are you sure, you want to duplicate?';
            }
        }


        $Sql = "SELECT  c1.name,c1.crm_code,c1.customer_code,c1.company_email,c1.primary_postcode,c1.phone,c1.type
                FROM sr_crm_listing c1
                WHERE   c1.company_id = '" . $this->arrUser['company_id'] . "' AND  
                        ((IFNULL(c1.`name`,'#1') = '" . $attr['name'] . "' AND c1.name <> '') OR 
                        (IFNULL(c1.`company_email`,'#1') = '" . $attr['email'] . "' AND c1.company_email <> '') OR 
                        (IFNULL(c1.`primary_postcode`,'#1') = '" . $attr['postcode'] . "' AND c1.primary_postcode <> '') OR 
                        (IFNULL(c1.`phone`,'#1') = '" . $attr['phone'] . "' AND c1.phone <> '')) AND 	
                        c1.statusp ='Active'
                LIMIT 1";
        // echo  $Sql;exit;

        /*  '' Same record already exist under CRM626 Top Shop Ltd'' */
        $RS = $this->objsetup->CSI($Sql, "crm", sr_AddPermission);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $response['ack'] = 1;


            if ($Row['type'] == 1) {
                $response['error'] = 'Same record already exist under ' . $Row['name'] . '(' . $Row['crm_code'] . '). Are you sure, you want to duplicate?';
            } else {
                $response['error'] = 'Same record already exist under ' . $Row['name'] . '(' . $Row['customer_code'] . '). Are you sure, you want to duplicate?';
            }
        }

        return $response;
    }


    function update_crm($arr_attr)
    {

        if ($arr_attr['turnover'] == '')
            $turnover = 0;
        else
            $turnover = $arr_attr['turnover'];


        if ($arr_attr['emp_no'] == '')
            $emp_no = 0;
        else
            $emp_no = $arr_attr['emp_no'];

        $social_media_arr = $arr_attr['social_media_arr'];

        $social_media_str = "";
        $index = 1;
        // print_r($social_media_arr);exit;
        foreach ($social_media_arr as $sm) {
            if (!empty($sm) && $sm->id > 0) {
                $social_media_str .= " socialmedia" . $index . " = '" . $sm->id . "',
                socialmedia" . $index . "_value = '" . addslashes($sm->value) . "',";
                $index++;
            }
        }
        if ($index <= 5) {
            while ($index <= 5) {
                $social_media_str .= " socialmedia" . $index . " = '0',
                socialmedia" . $index . "_value = '',";
                $index++;
            }
        }
        // echo $social_media_str;exit;
        $social_media_str = substr($social_media_str, 0, -1);

        $locArray = $arr_attr['loc'];
        $contactArray = $arr_attr['contact'];
        $this->objGeneral->mysql_clean($arr_attr);


        if (!empty($arr_attr['id']))
            $where_id = "AND tst.id <> '" . $arr_attr['id'] . "' ";


        $data_pass = " tst.type IN (1,2) AND tst.crm_code='" . $arr_attr['crm_code'] . "'  $where_id ";
        $total = $this->objGeneral->count_duplicate_in_sql('crm', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'CRM No. Already Exists.';
            return $response;
        }


        $data_pass = " tst.type IN (1,2) AND (tst.crm_code='" . $arr_attr['crm_code'] . "' AND  tst.name='" . $arr_attr['name'] . "' )  $where_id ";
        $total = $this->objGeneral->count_duplicate_in_sql('crm', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $is_billing_address  = (isset($arr_attr['is_billing_address']) && $arr_attr['is_billing_address'] != '') ? $arr_attr['is_billing_address'] : 0;
        $is_delivery_collection_address  = (isset($arr_attr['is_delivery_collection_address']) && $arr_attr['is_delivery_collection_address'] != '') ? $arr_attr['is_delivery_collection_address'] : 0;
        $is_invoice_address  = (isset($arr_attr['is_invoice_address']) && $arr_attr['is_invoice_address'] != '') ? $arr_attr['is_invoice_address'] : 0;
        $anonymous_customer = (isset($arr_attr['anonymous_customer']) && $arr_attr['anonymous_customer'] != '') ? $arr_attr['anonymous_customer'] : 0;
        // $unsubscribeEmail = (isset($arr_attr['unsubscribeEmail']) && $arr_attr['unsubscribeEmail'] != '')? $arr_attr['unsubscribeEmail']: 0;
        $unsubscribeEmail = (isset($arr_attr['unsubscribeEmail_address']) && $arr_attr['unsubscribeEmail_address'] != '') ? $arr_attr['unsubscribeEmail_address'] : 0;
        $verified = (isset($arr_attr['verified_chk']) && $arr_attr['verified_chk'] != '') ? $arr_attr['verified_chk'] : 0;
        $crm_segment_id = (isset($arr_attr['crm_segment_id']) && $arr_attr['crm_segment_id'] != '' && intval($arr_attr['crm_segment_id']) > 0) ? $arr_attr['crm_segment_id'] : 'NULL';

        $saleperson_code_id = (isset($arr_attr['saleperson_code_id']) && $arr_attr['saleperson_code_id'] != '' && intval($arr_attr['saleperson_code_id']) > 0) ? $arr_attr['saleperson_code_id'] : 0;

        $address_type = (isset($arr_attr['address_type'])) ? $arr_attr['address_type'] : '';





        if (empty($arr_attr['id'])) {

            $type = (isset($arr_attr['retailer']) && $arr_attr['retailer'] == 1 && $arr_attr['retailer'] != 2) ? 4 : 1;
            $type = (isset($arr_attr['retailer']) && $arr_attr['retailer'] == 2) ? 0 : 1;

            $Sql = "INSERT INTO crm 
                                SET 
                                    transaction_id = SR_GetNextTransactionID(" . $this->arrUser['company_id'] . ", 2),
                                    unique_id = UUID(),
                                    type='$type',
                                    crm_code='" . $arr_attr['crm_code'] . "',
                                    name='" . $arr_attr['name'] . "',
                                    customer_classification='" . $arr_attr['crm_classification'] . "',
                                    crm_classification='" . $arr_attr['crm_classification'] . "',
                                    ownership_type='" . $arr_attr['ownership_types'] . "',
                                    address_type='" . $address_type . "',
                                    contact_person='" . $arr_attr['contact_person'] . "',
                                    address_1='" . $arr_attr['address_1'] . "',
                                    job_title='" . $arr_attr['job_title'] . "',
                                    address_2='" . $arr_attr['address_2'] . "',
                                    phone='" . $arr_attr['phone'] . "',
                                    city='" . $arr_attr['city'] . "',
                                    fax='" . $arr_attr['fax'] . "',
                                    county='" . $arr_attr['county'] . "',
                                    country_id='" . $arr_attr['country_id'] . "',
                                    mobile='" . $arr_attr['mobile'] . "',
                                    postcode='" . $arr_attr['postcode'] . "',
                                    direct_line='" . $arr_attr['direct_line'] . "',
                                    email='" . $arr_attr['email'] . "',
                                    turnover='$turnover',
                                    crm_segment_id=$crm_segment_id,
                                    additionalInformation = '" . $arr_attr['additionalInformation'] . "',
                                    source_of_crm='" . $arr_attr['source_of_crm'] . "',
                                    pref_method_of_communication='" . $arr_attr['pref_method_of_communication'] . "',
                                    status='" . $arr_attr['status'] . "',
                                    web_address='" . $arr_attr['web_address'] . "',
                                    buying_grp='" . $arr_attr['buying_grp'] . "',
                                    region_id='" . $arr_attr['region_ids'] . "',
                                    credit_rating='" . $arr_attr['credit_ratings'] . "',
                                    currency_id='" . $arr_attr['currency_id'] . "',
                                    is_billing_address='" . $is_billing_address . "',
                                    is_shipping_address='" . $is_delivery_collection_address . "',
                                    is_invoice_address='" . $is_invoice_address . "' ,
                                    anonymous_customer='" . $anonymous_customer . "',
                                    emp_no = '$emp_no',
                                    company_reg_no='" . $arr_attr['company_reg_no'] . "',
                                    salesperson_id='$saleperson_code_id',
                                    date_of_inc='" . $this->objGeneral->convert_date($arr_attr['date_of_inc']) . "',
                                    crm_type = '" . $arr_attr['crm_type'] . "',
                                    crm_posting_group_id = '" . $arr_attr['crm_posting_group_id'] . "',
                                    crm_bank_account_id = '" . $arr_attr['crm_bank_account_id'] . "',
                                    crm_bank_name = '" . $arr_attr['crm_bank_name'] . "',
                                    unsubscribeEmail='" . $unsubscribeEmail . "',
                                    verified='" . $verified . "',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    AddedBy='" . $this->arrUser['id'] . "',
                                    AddedOn=UNIX_TIMESTAMP (NOW()),
                                    " . $social_media_str . "
                                    ";
            // echo  $Sql;exit;

            $response = $this->objsetup->CSI($Sql, "crm", sr_AddPermission);

            $id = $this->Conn->Insert_ID();
            $arr_attr['id'] = $id;
        } else {

            if ((isset($locArray->depot) && $locArray->depot != "") || (isset($locArray->postcode) && $locArray->postcode != "")) {

                $whereLocID = '';

                if ($locArray->alt_loc_id  > 0)
                    $whereLocID = 'id <>  ' . $locArray->alt_loc_id . ' AND';


                if ($locArray->is_billing_address == 0) {
                    $checkBillingSql = "SELECT COUNT(*) AS total FROM alt_depot
                                        WHERE acc_id = " . $arr_attr['id'] . " AND 
                                              module_type = 1 AND 
                                              is_billing_address = 1 AND
                                              " . $whereLocID . "
                                              company_id=" . $this->arrUser['company_id'];

                    $RS_Check_billing = $this->objsetup->CSI($checkBillingSql);
                    if ($RS_Check_billing->fields['total'] == 0) {
                        $response['ack'] = 0;
                        $response['error'] = 'Please select billing and payment address';
                        return $response;
                    }
                }
                if ($locArray->is_invoice_address == 0) {
                    $checkPaymentSql = "SELECT COUNT(*) AS total FROM alt_depot
                                        WHERE acc_id = " . $arr_attr['id'] . " AND 
                                              module_type = 1 AND 
                                              is_invoice_address = 1 AND
                                              " . $whereLocID . "
                                              company_id=" . $this->arrUser['company_id'];

                    $RS_Check_payment = $this->objsetup->CSI($checkPaymentSql);


                    if ($RS_Check_payment->fields['total'] == 0) {
                        $response['ack'] = 0;
                        $response['error'] = 'Please select billing and payment address';
                        return $response;
                    }
                }
            }


            $Sql = "UPDATE crm
                            SET
                                crm_code='" . $arr_attr['crm_code'] . "',
                                name='" . $arr_attr['name'] . "',
                                customer_classification='" . $arr_attr['crm_classification'] . "',
                                crm_classification='" . $arr_attr['crm_classification'] . "',
                                ownership_type='" . $arr_attr['ownership_types'] . "',
                                address_type='" . $address_type . "',
                                contact_person='" . $arr_attr['contact_person'] . "',
                                address_1='" . $arr_attr['address_1'] . "',
                                job_title='" . $arr_attr['job_title'] . "',
                                address_2='" . $arr_attr['address_2'] . "',
                                phone='" . $arr_attr['phone'] . "',
                                city='" . $arr_attr['city'] . "',
                                fax='" . $arr_attr['fax'] . "',
                                county='" . $arr_attr['county'] . "',
                                country_id='" . $arr_attr['country_id'] . "',
                                mobile='" . $arr_attr['mobile'] . "',
                                postcode='" . $arr_attr['postcode'] . "',
                                direct_line='" . $arr_attr['direct_line'] . "',
                                email='" . $arr_attr['email'] . "',
                                turnover='$turnover',
                                crm_segment_id=$crm_segment_id,
                                additionalInformation = '" . $arr_attr['additionalInformation'] . "',
                                source_of_crm='" . $arr_attr['source_of_crm'] . "',
                                pref_method_of_communication='" . $arr_attr['pref_method_of_communication'] . "',
                                status='" . $arr_attr['status'] . "',
                                web_address='" . $arr_attr['web_address'] . "',
                                buying_grp='" . $arr_attr['buying_grp'] . "',
                                region_id='" . $arr_attr['region_ids'] . "',
                                credit_rating='" . $arr_attr['credit_ratings'] . "',
                                currency_id='" . $arr_attr['currency_id'] . "',
                                is_billing_address='" . $is_billing_address . "',
                                is_shipping_address='" . $is_delivery_collection_address . "',
                                is_invoice_address='" . $is_invoice_address . "' ,
                                anonymous_customer='" . $anonymous_customer . "',
                                ChangedBy='" . $this->arrUser['id'] . "',
                                ChangedOn='" . current_date_time . "',
                                emp_no = '$emp_no',
                                company_reg_no='" . $arr_attr['company_reg_no'] . "',
                                salesperson_id='$saleperson_code_id',
                                date_of_inc='" . $this->objGeneral->convert_date($arr_attr['date_of_inc']) . "',
                                crm_type = '" . $arr_attr['crm_type'] . "',
                                crm_posting_group_id = '" . $arr_attr['crm_posting_group_id'] . "',
                                crm_bank_account_id = '" . $arr_attr['crm_bank_account_id'] . "',
                                crm_bank_name = '" . $arr_attr['crm_bank_name'] . "',
                                unsubscribeEmail='" . $unsubscribeEmail . "',
                                verified='" . $verified . "',
                                $social_media_str

                                WHERE id = " . $arr_attr['id'] . "   and
                                    company_id=" . $this->arrUser['company_id'] . "
                                limit 1";
            // echo $Sql;  exit;

            $response = $this->objsetup->CSI($Sql, "crm_gneraltab", sr_AddEditPermission);
        }

        $response99['ack'] = 1;
        $response99['error'] = NULL;
        $response = $response99;

        $response2[] = array();
        $response2['id'] = $arr_attr['id'];

        $locArray->acc_id = $arr_attr['id'];
        $locArray->module_type = 1;

        $contactArray->acc_id = $arr_attr['id'];
        $contactArray->module_type = 1;

        // error_reporting(E_ALL) ;

        if ((isset($locArray->depot) && $locArray->depot != "") || (isset($locArray->postcode) && $locArray->postcode != "")) {

            if (empty($arr_attr['alt_loc_id']))
                $response2 = $this->objSrm->add_alt_depot2($locArray, $response2);
            else
                $response2 = $this->objSrm->update_alt_depot2($locArray, $response2);

            if ($response2['ack'] == 0 && $response2['ack'] != "")  return $response2;
        }

        if ((isset($contactArray->contact_name) && $contactArray->contact_name != "") || $arr_attr['alt_contact_id'] > 0) {

            $contactArray->alt_contact_id = $arr_attr['alt_contact_id'];

            if (empty($arr_attr['alt_contact_id']))
                $response2 = $this->objSrm->add_alt_contact2($contactArray, $response2);
            else
                $response2 = $this->objSrm->update_alt_contact2($contactArray, $response2);
        }

        if (!($arr_attr['alt_contact_id'] > 0))
            $arr_attr['alt_contact_id'] = $response2['alt_contact_id'];

        if (!($arr_attr['alt_loc_id'] > 0))
            $arr_attr['alt_loc_id'] = $response2['alt_location_id'];

        $response['alt_loc_id'] = $arr_attr['alt_loc_id'];
        $response['alt_contact_id'] = $arr_attr['alt_contact_id'];
        $response['crm_id'] = $arr_attr['id'];

        if ($arr_attr['alt_loc_id'] > 0 && $arr_attr['alt_contact_id'] > 0) {

            $sqlC = "SELECT COUNT(*) as loc_con_count
                     From alt_depot_contact
                     WHERE acc_id = '" . $arr_attr['id'] . "' and module_type = '1' and location_id = '" . $arr_attr['alt_loc_id'] . "' and
                           contact_id = '" . $arr_attr['alt_contact_id'] . "'";
            //echo $sqlC;
            $RSC = $this->objsetup->CSI($sqlC);
            $Row = $RSC->FetchRow();

            if ($Row['loc_con_count'] == 0) {

                $response2['crm_id'] = $arr_attr['id'];
                $response2['acc_id'] = $arr_attr['id'];
                $response2['module_type'] = 1;
                $response2['alt_location_id'] = $arr_attr['alt_loc_id'];
                $response2['alt_contact_id'] = $arr_attr['alt_contact_id'];
                $response3 = $this->add_contact_location_dropdown_general($response2);
            }
        }

        if (!empty($arr_attr['selectedSalesBucket'])  && empty($arr_attr['CRMBucketList'])) {
            $input_arr = [];
            $input_arr["module_id"] = $arr_attr['id'];
            $input_arr["bucket_id"] = $arr_attr['selectedSalesBucket']->id;
            require_once(SERVER_PATH . "/classes/Customersales.php");
            $ObjCSale = new Customersales($this->arrUser);
            $result = $ObjCSale->checkBucketValidity($input_arr, 40);
            if ($result['valid']) {
                $response['validBucket'] = 1;
                $insertBucketSql = "INSERT INTO crm_bucket (module_id,bucket_id,type,is_primary,company_id,user_id,start_date,AddedBy,AddedOn) VALUES (" . $arr_attr['id'] . "," . $input_arr['bucket_id'] . ",1,0, " . $this->arrUser['company_id'] . ", " . $this->arrUser['id'] . "," . current_date . "," . $this->arrUser['id'] . ",UNIX_TIMESTAMP (NOW()))";
                //echo $insertBucketSql;exit;
                $RS = $this->objsetup->CSI($insertBucketSql);
                //print_r($RS);exit;
                if ($this->Conn->Insert_ID() > 0) {
                    $response['bucketAdded'] = 1;
                    $selectSalePersonsFromBucket = "SELECT " . $input_arr['module_id'] . ", employee_id, is_primary, " . $this->arrUser['company_id'] . "," . $this->arrUser['id'] . ",2," . $input_arr['bucket_id'] . "," . current_date . "," . $this->arrUser['id'] . "," . current_date . " FROM employee_bucket WHERE bucket_id = " . $input_arr['bucket_id'] . " ";
                    $insertSalePersonSql = "INSERT INTO crm_salesperson (module_id, salesperson_id, is_primary, company_id, user_id, type, bucket_id, start_date, AddedBy, AddedOn) ($selectSalePersonsFromBucket)";
                    //echo $insertSalePersonSql;exit;
                    $RS = $this->objsetup->CSI($insertSalePersonSql);
                    if ($this->Conn->Insert_ID() > 0) {
                        $response['salesPersonsAdded'] = 1;
                    }
                    $sqlForceCRMUpdate = "UPDATE crm SET name = name WHERE id = '" . $arr_attr['id'] . "' ";
                    $x = $this->objsetup->CSI($sqlForceCRMUpdate);
                }
            } else {
                $response['validBucket'] = 0;
            }
        }
        /* 
        ### Akhtar's Code to change customer bucket from customer card.
        */ elseif (!empty($arr_attr['selectedSalesBucket']) && !empty($arr_attr['CRMBucketList']) && $arr_attr['last_selected_bucket'] != $arr_attr['selectedSalesBucket']->id) {
            //echo $arr_attr['last_selected_bucket'];exit;
            $input_arr = [];
            $input_arr["module_id"] = $arr_attr['id'];
            $input_arr["bucket_id"] = $arr_attr['selectedSalesBucket']->id;
            require_once(SERVER_PATH . "/classes/Customersales.php");
            $ObjCSale = new Customersales($this->arrUser);
            $result = $ObjCSale->checkBucketValidity($input_arr, 40);

            if ($result['valid']) {
                ////--------------------------------------------///
                $SQ = "DELETE FROM crm_bucket WHERE module_id= " . $arr_attr['id'] . "";
                $this->objsetup->CSI($SQ);
                $SQ1 = "DELETE FROM crm_salesperson WHERE module_id= " . $arr_attr['id'] . "";
                $this->objsetup->CSI($SQ1);

                $response['validBucket'] = 1;
                $insertBucketSql = "INSERT INTO crm_bucket (module_id,bucket_id,type,is_primary,company_id,user_id,start_date,AddedBy,AddedOn) VALUES (" . $arr_attr['id'] . "," . $input_arr['bucket_id'] . ",1,0, " . $this->arrUser['company_id'] . ", " . $this->arrUser['id'] . "," . current_date . "," . $this->arrUser['id'] . ",UNIX_TIMESTAMP (NOW()))";
                //echo $insertBucketSql;exit;
                $RS = $this->objsetup->CSI($insertBucketSql);
                //print_r($RS);exit;
                if ($this->Conn->Insert_ID() > 0) {
                    $response['bucketAdded'] = 1;
                    $selectSalePersonsFromBucket = "SELECT $input_arr[module_id], employee_id, is_primary, " . $this->arrUser['company_id'] . "," . $this->arrUser['id'] . ",2," . $input_arr['bucket_id'] . "," . current_date . "," . $this->arrUser['id'] . "," . current_date . " FROM employee_bucket WHERE bucket_id = " . $input_arr['bucket_id'] . " ";
                    $insertSalePersonSql = "INSERT INTO crm_salesperson (module_id, salesperson_id, is_primary, company_id, user_id, type, bucket_id, start_date, AddedBy, AddedOn) ($selectSalePersonsFromBucket)";
                    //echo $insertSalePersonSql;exit;
                    $RS = $this->objsetup->CSI($insertSalePersonSql);
                    if ($this->Conn->Insert_ID() > 0) {
                        $response['salesPersonsAdded'] = 1;
                    }
                    $sqlForceCRMUpdate = "UPDATE crm SET name = name WHERE id = " . $arr_attr['id'] . "; ";
                    $x = $this->objsetup->CSI($sqlForceCRMUpdate);
                }
            } else {
                $response['validBucket'] = 0;
            }
        }
        $response['crm_id'] = $arr_attr['id'];

        return $response;
    }

    function delete_crm($attr)
    {
        $arr_attr = array();
        $arr_attr = (array) $attr;
        $this->objGeneral->mysql_clean($arr_attr);

        $function = "SELECT SR_CheckTransactionBeforeDelete(" . $arr_attr['id'] . ", " . $this->arrUser['company_id'] . ", 16,4)"; //notes
        $RS = $this->objsetup->CSI($function, "crm_gneraltab", sr_DeletePermission);
        $function1 = "SELECT SR_CheckTransactionBeforeDelete(" . $arr_attr['id'] . ", " . $this->arrUser['company_id'] . ", 17,1)"; //documents
        $RS1 = $this->objsetup->CSI($function1, "crm_gneraltab", sr_DeletePermission);
        $function2 = "SELECT SR_CheckTransactionBeforeDelete(" . $arr_attr['id'] . ", " . $this->arrUser['company_id'] . ", 18,1)"; //email
        $RS2 = $this->objsetup->CSI($function2, "crm_gneraltab", sr_DeletePermission);
        $function3 = "SELECT SR_CheckTransactionBeforeDelete(" . $arr_attr['id'] . ", " . $this->arrUser['company_id'] . ", 1,0)"; // for type 1
        $RS3 = $this->objsetup->CSI($function3, "crm_gneraltab", sr_DeletePermission);
        //echo $RS3->fields[0];exit;
        // asked to remove the documetn check on Monday, 17th June 2019 , && $RS1->fields[0] == 'success' 
        if ($RS->fields[0] == 'success' && $RS2->fields[0] == 'success' && $RS3->fields[0] == 'success') {
            $Sql = "UPDATE crm SET status=" . DELETED_STATUS . " WHERE id = " . $arr_attr['id'] . " AND SR_CheckTransactionBeforeDelete(" . $attr['id'] . ", " . $this->arrUser['company_id'] . ", 1,0) = 'success'";
            // remove doc association
            $Sql_sel = "SELECT * FROM document_association where record_id = " . $arr_attr['id'] . "";
            $RS_sel = $this->objsetup->CSI($Sql_sel);
            if ($this->Conn->Affected_Rows() > 0) {
                $function_del = "DELETE from document_association where record_id = " . $arr_attr['id'] . "";
                $RS_del = $this->objsetup->CSI($function_del);
            }
        } elseif ($RS->fields[0] != 'success') {
            $response['ack'] = 0;
            $response['error'] = 'A Note already exists against this record.';
            return $response;
        } /* elseif ($RS1->fields[0] != 'success') {
            $response['ack'] = 0;
            $response['error'] = 'A Document already exists against this record.';
            return $response;
        } */ elseif ($RS2->fields[0] != 'success') {
            $response['ack'] = 0;
            $response['error'] = 'An Email already exists against this record.';
            return $response;
        } elseif ($RS3->fields[0] != 'success') {
            $response['ack'] = 0;
            $response['error'] = $RS3->fields[0];
            return $response;
        }
        //echo $Sql;exit;

        $RS4 = $this->objsetup->CSI($Sql, "crm_gneraltab", sr_DeletePermission);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 2;
            $response['error'] = 'Record cannot be deleted.';
        }

        return $response;
    }

    function convert($attr)
    {
        // echo '<pre>';print_r($attr);exit;
        $this->objGeneral->mysql_clean($attr);
        $moduleForPermission = "";
        if ($attr['module'] == 1) {
            $Sql = "UPDATE crm SET 
                        type =2,  
                        customer_code= '" . $attr['cust_code'] . "', convertedBy = '" . $this->arrUser['id'] . "', convertedOn ='" . current_date_time . "',
                        customer_classification = (SELECT id FROM ref_classification WHERE name = 'Customer' AND company_id='" . $this->arrUser['company_id'] . "' LIMIT 1),
                        crm_classification = (SELECT id FROM ref_classification WHERE name = 'Customer' AND company_id='" . $this->arrUser['company_id'] . "' LIMIT 1)
					WHERE id = " . $attr['id'] . " and company_id='" . $this->arrUser['company_id'] . "'  limit 1";
            //customer_no=' " . $attr[cust_no] . "', 
            $moduleForPermission = "crm_gneraltab";
        } elseif ($attr['module'] == 2) {
            $Sql = "UPDATE crm SET type = 2, 
                crm_code =  '" . $attr['crm_code'] . "' 
                WHERE id = " . $attr['id'] . " and company_id='" . $this->arrUser['company_id'] . "' limit 1";
            //crm_no =  '" . $attr[crm_no] . "', 
            $moduleForPermission = "customer_gneraltab";
        }
        // echo  $Sql;exit;

        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, $moduleForPermission, sr_ConvertPermission);


        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;

            // deleting buckets and salespersons for that crm/customer
            $SqlDeleteSp = "DELETE FROM crm_salesperson where module_id = " . $attr['id'] . " and company_id = '" . $this->arrUser['company_id'] . "'; ";
            $SqlDeleteBucks  = "DELETE From crm_bucket where module_id = " . $attr['id'] . " and company_id = '" . $this->arrUser['company_id'] . "'";
            $SqlDeleteOfferedBy  = "UPDATE priceoffer set offeredByID =0  where moduleID = " . $attr['id'] . " and company_id = '" . $this->arrUser['company_id'] . "'";
            $RS2 = $this->objsetup->CSI($SqlDeleteSp);
            $RS3 = $this->objsetup->CSI($SqlDeleteBucks);
            $RS4 = $this->objsetup->CSI($SqlDeleteOfferedBy);

            // insert posting grp and bank account
            $Sql1 = "select crm_posting_group_id,crm_bank_account_id from crm WHERE id = " . $attr['id'] . " and company_id='" . $this->arrUser['company_id'] . "'  limit 1";
            $RS1 = $this->objsetup->CSI($Sql1)->FetchRow();
            $crm_posting_group_id = $RS1['crm_posting_group_id'];
            $crm_bank_account_id = $RS1['crm_bank_account_id'];
            $data = "";
            if ($crm_posting_group_id) {
                $data = " posting_group_id = '" . $crm_posting_group_id . "', ";
            }
            if ($crm_bank_account_id) {
                $data .= " bank_account_id = '" . $crm_bank_account_id . "', ";
            }
            if ($data != "") {
                $InsertF = "INSERT INTO finance SET " . $data . " customer_id=" . $attr['id'] . ",type='1'";
                $RSF = $this->objsetup->CSI($InsertF);
            }

            // changing crm code to customer code in orders table
            $UpdateOrders = "UPDATE orders SET sell_to_cust_no = '" . $attr['cust_code'] . "'  WHERE sell_to_cust_id=" . $attr['id'] . " ";
            $RSO = $this->objsetup->CSI($UpdateOrders);
            $UpdateOrdersC = "UPDATE orderscache SET sell_to_cust_no = '" . $attr['cust_code'] . "'  WHERE sell_to_cust_id=" . $attr['id'] . " ";
            //echo $UpdateOrdersC;exit;
            $RSOC = $this->objsetup->CSI($UpdateOrdersC);
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated!';
        }
        return $response;
        exit;
        if ($attr['module'] == 1) {
            $Sqls = "SELECT max(customer_no) as count	FROM crm  where company_id='" . $this->arrUser['company_id'] . "'";
            $crm = $this->objsetup->CSI($Sqls)->FetchRow();

            $number = $crm['count'] + 1;
            $code = "CUST" . $number;
            $Sql = "UPDATE crm SET type = " . $attr['type'] . ", customer_no = $number,customer_code='$code'
					WHERE id = " . $attr['id'] . " ";

            //echo $Sql."-".$Sqls; exit;
        } else {
            $Sqls = "SELECT max(crm_no) as count	FROM crm";
            $crm = $this->objsetup->CSI($Sqls)->FetchRow();

            //$number = $crm['count'] + 1;
            $code = "CRM" . $number;
            $Sql = "UPDATE crm SET type = " . $attr['type'] . ", crm_no = $number,crm_code='$code'
				WHERE id = " . $attr['id'] . " ";
            //echo $Sql."2"; exit;
        }
    }

    function convertToCRM($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "UPDATE crm SET type =1
                WHERE id = " . $attr['id'] . " AND company_id='" . $this->arrUser['company_id'] . "'  LIMIT 1";

        // echo  $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated!';
        }
        return $response;
    }

    function get_crm_code($attr)
    {
        $mSql = "SELECT prefix FROM `module_codes` WHERE `id` = 19";
        $code = $this->objsetup->CSI($mSql)->FetchRow();

        $Sql = "SELECT max(crm_no) as count	FROM crm";
        $crm = $this->objsetup->CSI($Sql)->FetchRow();
        //echo $mSql; exit;
        $number = $crm['count'];

        if ($attr['is_increment'] == 1 || $number == '')
            $number++;

        return array('code' => $code['prefix'] . self::module_item_prefix($number), 'number' => $number);
    }

    /* ================     Unsubscribe Email from CRM   ================== */

    function unsubscribeEmail($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        if (!empty($arr_attr['id']))
            $where_id = "AND tst.id !=  '" . $arr_attr['id'] . "'";

        $unsubscribeEmail = (isset($arr_attr['unsubscribeEmail']) && $arr_attr['unsubscribeEmail'] != '') ? $arr_attr['unsubscribeEmail'] : 0;

        $Sql = "UPDATE crm
                        SET 
 
                            unsubscribeEmail='" . $unsubscribeEmail . "'
                        WHERE id = " . $arr_attr['id'] . "  and
                                  company_id=" . $this->arrUser['company_id'] . "
                        limit 1";

        //echo $Sql."<hr>"; exit;

        $RS = $this->objsetup->CSI($Sql);

        /* if ($id > 0) {
            $response['id'] = $id;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else { */
        $response['id'] = 0;
        $response['ack'] = 0;
        $response['error'] = 'Record not inserted!';
        // }

        return $response;
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
            default:
                $id = $id;
                break;
        }
        return $id;
    }

    function get_all_route_to_market($attr)
    {
        $fromDataChk = '';

        if ($attr['fromData'] > 0) {

            if ($attr['type'] == 1)  // (From Indirect to RTM)
            {
                $fromDataChk = "c.crm_code IN ( SELECT (CASE WHEN rtm.type = 1 THEN rtm.from_crm_code
                                                            WHEN rtm.type = 2 THEN rtm.link_crm_code
                                                            ELSE 0
                                                            END) AS crmCode 
                                                FROM route_to_market_link as rtm
                                                WHERE rtm.company_id = c.company_id AND 
                                                        ((rtm.type = 1 AND rtm.link_crm_id = " . $attr['crm_id'] . ") OR 
                                                        (rtm.type = 2 AND rtm.from_crm_id = " . $attr['crm_id'] . "))) AND 2=2 AND";
            } elseif ($attr['type'] == 2) // (From RTM To Indirect )
            {
                $fromDataChk = "c.crm_code IN ( SELECT (CASE WHEN rtm.type = 2 THEN rtm.from_crm_code
                                                            WHEN rtm.type = 1 THEN rtm.link_crm_code
                                                            ELSE 0
                                                            END) AS crmCode 
                                                FROM route_to_market_link as rtm
                                                WHERE rtm.company_id = c.company_id AND 
                                                        ((rtm.type = 2 AND rtm.link_crm_id = " . $attr['crm_id'] . ") OR 
                                                        (rtm.type = 1 AND rtm.from_crm_id = " . $attr['crm_id'] . "))) AND 1=1 AND ";
            }
        }

        if ($attr['type'] == 1)  // (From Indirect to RTM)
        {
            $Sql = "SELECT link_crm_id AS crm_id, link_crm_code AS code, is_prefered
                    FROM route_to_market_link
                    WHERE type = 2 AND 
                          from_crm_id = " . $attr['crm_id'] . " AND 
                          company_id=" . $this->arrUser['company_id'] . "
                    UNION

                    SELECT from_crm_id AS crm_id, from_crm_code AS code, 0 AS is_prefered
                    FROM route_to_market_link
                    WHERE type = 1 AND 
                          link_crm_id = " . $attr['crm_id'] . " AND 
                          company_id=" . $this->arrUser['company_id'] . " ";

            $customers_sql = "SELECT c.id,
                                    c.crm_code AS code, 
                                    c.name, 
                                    c.primary_city AS city, 
                                    c.primary_postcode AS postcode, 
                                    c.region, 
                                    c.segment,
                                    c.buying_group,
                                    c.contact_person,
                                    c.primaryc_phone,
                                    c.crm_type,
                                    0 AS associated_indirect_crm
                                FROM sr_crm AS c
                                WHERE 
                                    c.id <> " . $attr['crm_id'] . " AND
                                    c.type IN (1,2) AND c.crm_code IS NOT NULL AND
                                    c.status = 1 AND 
                                    " . $fromDataChk . "
                                    c.crm_type IN (1,3) AND c.company_id=" . $this->arrUser['company_id'];


            /* $subQueryForBuckets = " SELECT  c.id
                                    FROM sr_crm_listing c
                                    WHERE c.type IN (1,2) AND 
                                        c.company_id=" . $this->arrUser['company_id'] . "";

            //$subQueryForBuckets = $this->objsetup->whereClauseAppender($subQueryForBuckets, 40);
            $customers_sql .= " AND c.id IN ($subQueryForBuckets) "; */
        } else if ($attr['type'] == 2) // (From RTM To Indirect )
        {
            $Sql = "SELECT link_crm_id AS crm_id, link_crm_code AS code, is_prefered
                    FROM route_to_market_link
                    WHERE 
                        type = 1 AND 
                        from_crm_id = " . $attr['crm_id'] . " AND
                        company_id=" . $this->arrUser['company_id'] . "
                    UNION 
                    SELECT from_crm_id AS crm_id, from_crm_code AS code, 0 AS is_prefered
                    FROM route_to_market_link
                    WHERE 
                        type = 2 AND 
                        link_crm_id = " . $attr['crm_id'] . " AND
                        company_id=" . $this->arrUser['company_id'] . " ";

            $customers_sql = "SELECT c.id,
                                    c.crm_code AS code, 
                                    c.name, 
                                    c.primary_city AS city, 
                                    c.primary_postcode AS postcode, 
                                    c.region, 
                                    c.segment,
                                    c.buying_group,
                                    c.contact_person,
                                    c.primaryc_phone,
                                    c.crm_type,
                                    (SELECT COUNT(rtm.id)
                                        FROM route_to_market_link AS rtm
                                            WHERE 
                                                rtm.from_crm_id = c.id) AS associated_indirect_crm
                                FROM sr_crm AS c 
                                    WHERE 
                                        c.id <> " . $attr['crm_id'] . " AND
                                        c.type IN (1,2) AND c.crm_code IS NOT NULL AND  c.name !='' AND
                                        c.crm_type = 2 AND 
                                        c.status = 1 AND  
                                        $fromDataChk
                                        c.company_id=" . $this->arrUser['company_id'];

            /* $subQueryForBuckets = " SELECT  c.id
                                    FROM sr_crm_listing c
                                    WHERE c.type IN (1,2) AND 
                                        c.company_id=" . $this->arrUser['company_id'] . "";

            //$subQueryForBuckets = $this->objsetup->whereClauseAppender($subQueryForBuckets, 40);
            $customers_sql .= " AND c.id IN ($subQueryForBuckets) "; */
        }
        // echo $customers_sql;exit;
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($customers_sql);
        $linked_crms = '';

        if ($RS->RecordCount() > 0) {

            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response']['RTMCrmList'][] = $Row;
            }

            $RS1 = $this->objsetup->CSI($Sql);

            while ($Row1 = $RS1->FetchRow()) {
                foreach ($Row1 as $key => $value) {
                    if (is_numeric($key))
                        unset($Row1[$key]);
                }
                $linked_crms .= $Row1['code'] . ", ";
                $response['response']['LinkedRTMCrmList'][] = $Row1;
            }

            if (strlen($linked_crms) > 0) {
                $linked_crms =  substr($linked_crms, 0, -2);
                $response['response']['LinkedRTMCrmString'] = $linked_crms;
            }

            $response['ack'] = 1;
        } else {
            $response['ack'] = 0;
            $response['response'] = array();
        }
        return $response;
    }

    function update_route_to_market($attr)
    {
        // print_r($attr);exit;
        $Sql = "DELETE FROM route_to_market_link WHERE from_crm_id = " . $attr['crm_id'] . " OR link_crm_id = " . $attr['crm_id'] . " ";
        $RS = $this->objsetup->CSI($Sql);

        $crm_ids_arr = array();
        if ($attr['type'] == 1)
            return;
        if ($attr['type'] == 2) // route to market
        {
            $type = 2;
            foreach ($attr['rmt_list'] as $rmt_item) {
                $crm_ids_arr[] = $rmt_item->id;
            }
            $crm_ids_list = implode(',', $crm_ids_arr);
        } else if ($attr['type'] == 3) // indirect
        {
            $type = 1;
        }

        foreach ($attr['rmt_list'] as $rmt_item) {
            $is_prefered = ($rmt_item->is_prefered != '') ? $rmt_item->is_prefered : '0';
            $Sql = "INSERT INTO route_to_market_link SET
                        from_crm_id = " . $attr['crm_id'] . ",
                        from_crm_code = '$attr[crm_code]',
                        link_crm_id = $rmt_item->id,
                        link_crm_code = '$rmt_item->code',
                        type = $type,
                        is_prefered = $is_prefered,
                        company_id = " . $this->arrUser['company_id'] . ",
                        user_id = " . $this->arrUser['id'] . ",
                        AddedBy = " . $this->arrUser['id'] . ",
                        AddedOn = UNIX_TIMESTAMP (NOW())
                ";
            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
        }

        if ($attr['type'] == 2 && strlen($crm_ids_list) > 0) {
            $Sql1 = "UPDATE crm SET crm_type=3 WHERE crm_type <> 3 AND id IN ($crm_ids_list)";
            // echo $Sql1;exit;
            $RS1 = $this->objsetup->CSI($Sql1);
        }
        $response['ack'] = 1;
        return $response;
    }

    function get_route_to_market_associated_indirect_crm($attr)
    {
        $Sql = "SELECT c.id,
                        c.crm_code AS code, 
                        c.name, 
                        c.primary_city AS city, 
                        c.primary_postcode AS postcode, 
                        c.region, 
                        c.segment,
                        c.buying_group,
                        c.contact_person,
                        c.primaryc_phone
                    FROM sr_crm AS c, route_to_market_link AS rtm
                        WHERE 
                            c.crm_type = 3 AND 
                            rtm.link_crm_id = c.id AND
                            from_crm_id = '" . $attr['crm_id'] . "' AND
                            c.company_id=" . $this->arrUser['company_id'];
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
        } else
            $response['ack'] = 0;
        return $response;
    }
    function get_bucket_name_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT name
				FROM crm_sale_bucket
				WHERE id='" . $attr['id'] . "'
				LIMIT 1";
        $RS = $this->objsetup->CSI($Sql);
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
    // Alt Contact Module
    //--------------------------------------

    function get_alt_contacts($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $attr['acc_id'] = $attr["value"];
        $response = $this->objSrm->get_alt_contacts($attr);
        return $response;
    }

    function get_alt_contacts_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = "";
        $where_clause = "";

        if (!empty($attr['crm_id']))
            $where_clause .= " AND acc_id = '" . $attr['crm_id'] . "' ";

        if (!empty($attr['is_primary']))
            $where_clause .= " AND c.is_primary  =1  ";

        $response = array();

        //load data from view

        $Sql = "SELECT c.*
                FROM  sr_alt_contact_sel c
                where  c.status=1 and c.module_type='" . $attr['module_type'] . "' and
                       c.company_id=" . $this->arrUser['company_id'] . "  and
                       c.contact_name!=''    $where_clause ";

        // $order_type = "Order BY  c.contact_name DESC ";

        $order_type = "order by c.is_primary DESC";
        if (!empty($attr['is_primary']))
            $total_limit = 1;
        else
            $total_limit = pagination_limit;


        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        $response['ack'] = 1;
        $response['error'] = NULL;


        if ($attr['type'] == 2)
            $type = 2;
        else
            $type = 1;


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();

                $result['id'] = $Row['id'];
                $result['name'] = $Row['contact_name'];

                if ($type == 1) {
                    $result['job_title'] = $Row['job_title'];
                    $result['direct_line'] = $Row['direct_line'];
                    $result['mobile'] = $Row['mobile'];
                    $result['email'] = $Row['email'];
                    $result['phone'] = $Row['phone'];
                    $result['fax'] = $Row['fax'];
                    $result['booking_instructions'] = $Row['booking_instructions'];
                    $result['pref_method_of_communication'] = $Row['pref_method_of_communication'];
                    $result['socialmedia1'] = $Row['socialmedia1'];
                    $result['socialmedia1_value'] = $Row['socialmedia1_value'];
                    $result['socialmedia2'] = $Row['socialmedia2'];
                    $result['socialmedia2_value'] = $Row['socialmedia2_value'];
                    $result['socialmedia3'] = $Row['socialmedia3'];
                    $result['socialmedia3_value'] = $Row['socialmedia3_value'];
                    $result['socialmedia4'] = $Row['socialmedia4'];
                    $result['socialmedia4_value'] = $Row['socialmedia4_value'];
                    $result['socialmedia5'] = $Row['socialmedia5'];
                    $result['socialmedia5_value'] = $Row['socialmedia5_value'];
                }

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
            $response['response'][] = array();
        }
        return $response;
    }

    function get_alt_contact_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = $this->objSrm->get_alt_contact_by_id($attr);
        return $response;
    }

    function add_alt_contact($arr_attr)
    {
        $response = $this->objSrm->add_alt_contact($arr_attr);
        return $response;
    }

    function update_alt_contact($arr_attr)
    {
        $response = $this->objSrm->update_alt_contact($arr_attr);
        return $response;
    }

    function delete_alt_contact($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        $arr_attr['acc_id'] = $arr_attr['crm_id'];
        $response = $this->objSrm->delete_alt_contact($arr_attr);
        return $response;
    }

    // Alt Depot Module
    //--------------------------------------

    function getPrimaryContactLocAssigntotal($attr)
    {
        $Sql = " SELECT  contLoc.id
                FROM alt_depot_contact as contLoc
                where contLoc.status=1 and contLoc.contact_id='" . $attr['primaryc_id'] . "'";
        //echo $Sql; exit;                 

        $RS = $this->objsetup->CSI($Sql);
        $showdata = $RS->RecordCount();
        // exit; 
        $response['showdata'] = $showdata;

        return $response;
    }

    function getPrimaryContactLocAssign($attr)
    {
        //$attr['acc_id'] = $attr['value'];
        // $response = $this->objSrm->get_alt_depots($attr);
        $where = '';
        if ($attr['acc_id'] > 0) $where = ' and contLoc.acc_id=' . $attr['acc_id'];

        $Sql = " SELECT  contLoc.id,contLoc.module_type,
                        loc.depot,
                        loc.is_billing_address,
                        loc.is_invoice_address,
                        loc.is_delivery_collection_address,
                        loc.address,
                        loc.address_2,
                        loc.city,
                        loc.postcode,
                        loc.county,
                        loc.is_primary,
                        loc.is_default,
                        loc.booking_instructions as locationNotes,
                        (SELECT nicename
                        FROM country
                        WHERE country.id = loc.country
                        LIMIT 1) as countryName
                FROM alt_depot_contact as contLoc
                left JOIN  alt_depot as loc  on loc.id=contLoc.location_id
                where   contLoc.status=1 and contLoc.contact_id='" . $attr['primaryc_id'] . "' and 
                        contLoc.company_id=" . $this->arrUser['company_id'] . " $where";
        // echo $Sql; exit;                 

        $RS = $this->objsetup->CSI($Sql);
        $showdata = $RS->RecordCount();
        // exit; 
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();

                $result['id'] = $Row['id'];
                $result['location'] = $Row['depot'];
                $result['is_primary'] = $Row['is_primary'];
                $result['is_default'] = $Row['is_default'];
                $result['chk'] = 1;

                $address_type = "";

                if ($Row['is_billing_address'] > 0)
                    $address_type .= "Billing, ";

                if ($Row['is_invoice_address'] > 0)
                    $address_type .= "Payment, ";

                if ($Row['is_delivery_collection_address'] > 0) {
                    if ($Row['module_type'] == 2)
                        $address_type .= "Collection, ";
                    else if ($Row['module_type'] == 1)
                        $address_type .= "Delivery, ";
                }

                $address_type = substr($address_type, 0, strlen($address_type) - 2);

                if (strlen($address_type) < 1) $address_type = " - ";

                $result['address'] = $Row['address'];
                $result['address_2'] = $Row['address_2'];
                $result['city'] = $Row['city'];
                $result['county'] = $Row['county'];
                $result['country'] = $Row['countryName'];
                $result['postcode'] = $Row['postcode'];
                $result['Location_type'] = $address_type;
                $result['location_Notes'] = $Row['locationNotes'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            /* print_r($response);echo "<hr>";
            exit; */

            $response['showdata'] = $showdata;
        } else
            $response['response'] = array();

        return $response;
    }

    function get_alt_depots($attr)
    {
        $attr['acc_id'] = $attr['value'];
        $response = $this->objSrm->get_alt_depots($attr);
        return $response;
    }

    function get_alt_depot_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $attr['acc_id'] = $attr['crm_id'];
        $response = $this->objSrm->get_alt_depot_by_id($attr);
        return $response;
    }

    function add_alt_depot($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        $response = $this->objSrm->add_alt_depot($arr_attr);
        return $response;
    }

    function update_alt_depot($attr)
    {

        $response = $this->objSrm->update_alt_depot($attr);
        return $response;
    }

    function delete_alt_depot($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        $arr_attr['acc_id'] = $arr_attr['crm_id'];
        $response = $this->objSrm->delete_alt_depot($arr_attr);
        return $response;
    }


    //add location and contact dropdown from tabs
    function get_contact_location_dropdown($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        $arr_attr['acc_id'] = $arr_attr["crm_id"];
        $response = $this->objSrm->get_contact_location_dropdown($arr_attr);
        return $response;
    }

    function add_contact_location_dropdown($arr_attr)
    {
        $response = $this->objSrm->add_contact_location_dropdown($arr_attr);
        return $response;
    }

    // for general form
    function add_contact_location_dropdown_general($arr_attr)
    {
        $arr_attr['acc_id'] = $arr_attr['crm_id'];
        $response = $this->objSrm->add_contact_location_dropdown_general($arr_attr);
        return $response;
    }

    // Opportunity Cycle Module
    //----------------------------------------------------
    function get_opportunity_cycles($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr); exit;
        $limit_clause = "";
        $filters_dropdown = "";
        $head = "";
        $filter_dict = "";
        $record = "";
        $order_type = "";

        $where_clause = "AND opcyle.company_id =" . $this->arrUser['company_id'];


        $response = array();

        $Sql = "SELECT opcyle.id, opcyle.subject, opcyle.forecast_amount, crm.name as crm_name, opcyle.stage_id
          FROM crm_opportunity_cycle as opcyle JOIN crm ON crm.id = opcyle.crm_id WHERE 1 " . $where_clause . "  ";


        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'opcyle', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        $response['ack'] = 1;
        $response['error'] = NULL;


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['subject'] = $Row['subject'];
                $result['forecast_amount'] = $Row['forecast_amount'];
                $result['crm_name'] = $Row['crm_name'];
                $result['current_stage'] = $Row['stage_id'];
                $response['response'][] = $result;
            }
            $ack = 1;
        } else {
            $ack = 0;
            $response['response'][] = array();
        }


        return array(
            'filters_dropdown' => $filters_dropdown, 'columns' => $head, 'filter_dict' => $filter_dict,
            'filters' => $record['column_id'], 'record' => array('total' => $response['total'], 'result' => $record['results'], 'response' => $record['response'], 'ack' => $ack)
        );
        // return $response;
    }

    function get_opportunity_cycle_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *  FROM crm_opportunity_cycle WHERE id='" . $attr['id'] . "' LIMIT 1";
        $RS = $this->objsetup->CSI($Sql);
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

    function add_opportunity_cycle($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $mainSql = "INSERT INTO crm_opportunity_cycle SET subject = '$attr[subject]',forecast_amount = '$attr[forecast_amount]',crm_id = '" . $attr['crm_id'] . "',stage_id = '" . $attr['type'] . "',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";

        $this->Conn->StartTrans();
        $mRS = $this->objsetup->CSI($mainSql);
        $mId = $this->Conn->Insert_ID();

        $detailSql = "INSERT INTO crm_opportunity_cycle_detail SET start_date = '" . $this->objGeneral->convert_date($attr['start_date']) . "',end_date = '" . $this->objGeneral->convert_date($attr['end_date']) . "',probability = '$attr[probability]',description = '$attr[description]',tab_id = '" . $attr['type'] . "',crm_opportunity_cycle_id = '$mId',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";


        $dRS = $this->objsetup->CSI($detailSql);
        $dId = $this->Conn->Insert_ID();
        $this->Conn->CompleteTrans();

        if ($mId > 0 && $dId > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
        }

        return $response;
    }

    function update_opportunity_cycle($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $mainSql = "UPDATE crm_opportunity_cycle SET subject = '$attr[subject]',forecast_amount = '$attr[forecast_amount]' WHERE id = '" . $attr['id'] . "' limit 1";


        $detailSql = "UPDATE crm_opportunity_cycle_detail SET start_date = '" . $this->objGeneral->convert_date($attr['start_date']) . "',end_date = '" . $this->objGeneral->convert_date($attr['end_date']) . "',probability = '$attr[probability]',description = '$attr[description]' WHERE crm_opportunity_cycle_id = '" . $attr['id'] . "' AND tab_id = " . $attr['type'] . " limit 1";

        /* echo $mainSql."<hr>";
          echo $detailSql."<hr>"; exit; */
        $this->objsetup->CSI($mainSql);
        $this->objsetup->CSI($detailSql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be updated!';
        }

        return $response;
    }

    function delete_opportunity_cycle($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "update   crm_opportunity_cycle set status=0 WHERE id = '" . $attr['id'] . "'";

        //echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        }

        return $response;
    }

    function complete_opportunity_cycle($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "UPDATE crm_opportunity_cycle_detail SET complete_date = NOW(), is_complete = '1',end_date = '" . $this->objGeneral->convert_date($attr['end_date']) . "' WHERE crm_opportunity_cycle_id = '" . $attr['id'] . "' AND type = " . $attr['type'] . " ";

        //echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be updated!';
        }

        return $response;
    }

    // Promotions Module
    //----------------------------------------------------
    function get_promotions($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = "";
        $where_clause = "";
        $order_type = "";


        $response = array();

        $Sql = "SELECT id, name, starting_date, customer_type FROM promotions WHERE 1 " . $where_clause . "  ";

        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'promotions', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';
        $response['ack'] = 1;
        $response['error'] = NULL;


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['starting_date'] = $this->objGeneral->convert_unix_into_date($Row['starting_date']);
                $result['ending_date'] = $this->objGeneral->convert_unix_into_date($Row['ending_date']);
                $result['customer_type'] = $Row['customer_type'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_promotion_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM promotions
				WHERE id='" . $attr['id'] . "'
				LIMIT 1";
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $Row['starting_date'] = $this->objGeneral->convert_unix_into_date($Row['starting_date']);
            $Row['ending_date'] = $this->objGeneral->convert_unix_into_date($Row['ending_date']);


            $response['response'] = $Row;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_promotion($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $id = $attr['id'];

        if ($id > 0)
            $update_check = "  AND tst.id <> '" . $id . "'";

        $data_pass = " tst.description='" . $attr['description'] . "'  $update_check  ";
        $total = $this->objGeneral->count_duplicate_in_sql('promotions', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }


        $Sql = "INSERT INTO promotions SET starting_date = '" . $this->objGeneral->convert_date($attr['starting_date']) . "',ending_date = '" . $this->objGeneral->convert_date($attr['ending_date']) . "',offer_type = '$attr[offer_type]',customer_type = '$attr[customer_type]',discount_type = '$attr[discount_type]',discount = '$attr[discount]',name = '" . $attr['name'] . "',file = '$attr[file]',description = '$attr[description]',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
        //echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);
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

    function update_promotion($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "UPDATE promotions SET starting_date = '" . $this->objGeneral->convert_date($attr['starting_date']) . "',ending_date = '" . $this->objGeneral->convert_date($attr['ending_date']) . "',offer_type = '$attr[offer_type]',customer_type = '$attr[customer_type]',discount_type = '$attr[discount_type]',discount = '$attr[discount]',name = '" . $attr['name'] . "',file = '$attr[file]',description = '$attr[description]' WHERE id = " . $attr['id'] . " limit 1";

        //  echo $Sql."<hr>";exit;
        $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be updated!';
        }

        return $response;
    }

    function update_promotions($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "UPDATE crm_promotions 	SET type = '" . $attr['type'] . "'
					WHERE id = '" . $attr['id'] . "' limit 1";

        /* echo $Sql."<hr>";exit; */
        $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be updated!';
        }

        return $response;
    }

    function delete_promotion($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "update   promotions set status =0
				WHERE id = '" . $attr['id'] . "' ";

        //echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        }

        return $response;
    }

    function get_promotion_products($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = "";


        $order_type = "";
        $response = array();

        $Sql = "SELECT c.id, c.product_id FROM promotions_items c WHERE c.promotion_id = '" . $attr['id'] . "'";

        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'promotions_items', $order_type);
        // echo $response['q'];exit;
        $pItemRS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($pItemRS->RecordCount() > 0) {
            $arr_ids = array();
            $str_ids = '';
            while ($Row = $pItemRS->FetchRow())
                $arr_ids[] = $Row['product_id'];
            $str_ids = implode(',', $arr_ids);

            $itemSql = "SELECT prod.id, prod.item_code, prod.pr_name, prod.description, prod.standard_price, brand.brandname, cat.name as category 
				FROM products as prod
				LEFT JOIN brand ON brand.id = prod.brand_id
				LEFT JOIN catagory as cat ON cat.id = prod.category_id
				WHERE prod.id IN ($str_ids)";


            $itemRS = $this->objsetup->CSI($itemSql);
            $response['ack'] = 1;
            $response['error'] = NULL;


            if ($itemRS->RecordCount() > 0) {
                while ($Row = $itemRS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['category'] = $Row['category'];
                    $result['item_no.'] = $Row['item_code'];
                    $result['name'] = $Row['description'];
                    $result['unit_price'] = $Row['standard_price'];
                    $result['brand'] = $Row['brandname'];
                    $response['response'][] = $result;
                }
            } else
                $response['response'][] = array();
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_promotion_product($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "INSERT INTO promotions_items
					SET product_id = '" . $attr['product_id'] . "',promotion_id = '" . $attr['promotion_id'] . "',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
        //echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);
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

    function delete_promotion_product($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "update promotions_items set sttaus=0
				WHERE id = '" . $attr['id'] . "'";

        //echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        }

        return $response;
    }


    // CRM Competitors Module
    //----------------------------------------------------
    function get_crm_competitors($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = "";
        $order_type = "";
        $response = array();

        $moduleForPermission = $this->objsetup->moduleDecider(1, $attr['value']);

        if ($moduleForPermission == 'crm') $moduleForPermission = $moduleForPermission . "_competetortab";
        else $moduleForPermission = $moduleForPermission . "_competetorab";

        $Sql = "SELECT compt.id,compt.price,compt.sale_price,compt.lead_time,compt.created_date,
                        cat.name as category, 
                        (SELECT title FROM competitor_properties WHERE id = compt.supplier_name) as supp_name, 
                        (SELECT title FROM competitor_properties WHERE id = compt.brand) as brand, 
                        (SELECT title FROM competitor_properties WHERE id = compt.volume) as volume, 
                        (SELECT title FROM competitor_properties WHERE id = compt.item_notes) as item_notes,
                        currency.code as Code,
                        uom.title as vol_uom_title,
                        uom2.title as uom_title,
                        ( CASE
                              WHEN compt.lead_type = 1 THEN 'Days'
                              WHEN compt.lead_type = 2 THEN 'Weeks'
                              WHEN compt.lead_type = 3 THEN 'Months'
                              WHEN compt.lead_type = 4 THEN 'Years'
                            ELSE '' END ) AS leadtitle
                  FROM crm_competitor as compt
                  left join units_of_measure as uom on uom.id = compt.vol_unit
                  left join units_of_measure as uom2 on uom2.id = compt.unit_id
                  LEFT JOIN category as cat on cat.id = compt.category_id
                  LEFT JOIN company on company.id=compt.company_id
                  LEFT JOIN currency on currency.id = company.currency_id
                  WHERE compt.status=1 AND compt.crm_id  =" . $attr['value'] . "
                   ";
        //   LEFT JOIN brand on brand.id = compt.brand
        // brand.brandname,
        //echo $Sql;exit;
        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $order_type = "order by compt.id asc";

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'compt', $order_type);
        //echo $response['q'];exit;
        // $RS = $this->objsetup->CSI($response['q']);
        $RS = $this->objsetup->CSI($response['q'], $moduleForPermission, sr_ViewPermission);

        $response['q'] = '';

        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['supp_name'];
                $result['brand'] = $Row['brand'];
                $result['category'] = $Row['category'];
                $result['item'] = $Row['item_notes'];

                if ($Row['price'] > 0)
                    $result['Purchase Price'] = $Row['price'] . " " . $Row['Code'] . " /" . $Row['uom_title']; //$Row['Code']
                else
                    $result['Purchase Price'] = "";

                if ($Row['sale_price'] > 0)
                    $result['Selling Price'] = $Row['sale_price'] . " " . $Row['Code'] . " /" . $Row['uom_title'];
                else
                    $result['Selling Price'] = "";

                $result['volume'] = $Row['volume'];

                if ($Row['lead_time'] > 0)
                    $result['order_frequency'] = $Row['lead_time'] . " " . $Row['leadtitle'];
                else
                    $result['order_frequency'] = "";

                $result['creation_date'] = $this->objGeneral->convert_unix_into_date($Row["created_date"]);


                $response['response'][] = $result;
            }
        } else
            $response['response'][] = array();

        $response['competitorProperties'] = $this->objsetup->getCompetitorPropertyListing($attr, 1);
        return $response;
    }

    function get_crm_competitor_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $moduleForPermission = $this->objsetup->moduleDecider(1, $attr['value']);

        if ($moduleForPermission == 'crm') $moduleForPermission = $moduleForPermission . "_competetortab";
        else $moduleForPermission = $moduleForPermission . "_competetorab";

        $Sql = " SELECT * From sr_crm_competitors_sel WHERE id='" . $attr['id'] . "'  ";
        // $RS = $this->objsetup->CSI($Sql);

        $RS = $this->objsetup->CSI($Sql, $moduleForPermission, sr_ViewPermission);


        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $Row["created_date"] = $this->objGeneral->convert_unix_into_date($Row["created_date"]);
            $response['response'] = $Row;
        } else {
            $response['response'][] = array();
        }


        $response['competitorProperties'] = $this->objsetup->getCompetitorPropertyListing($attr, 1);
        return $response;
    }

    function add_crm_competitor($attr)
    {
        $files = $attr['files'];
        $attr = $attr['frmData'];
        $count = count($files['name']);

        $this->objGeneral->mysql_clean($attr);

        $moduleForPermission = $this->objsetup->moduleDecider(1, $attr['crm_id']);

        if ($moduleForPermission == 'crm') $moduleForPermission = $moduleForPermission . "_competetortab";
        else $moduleForPermission = $moduleForPermission . "_competetorab";

        if ($attr['purchase_price_vat_chk'] == true)
            $purchase_price_vat_chk = 1;
        else
            $purchase_price_vat_chk = 0;

        if ($attr['wholesale_price_vat_chk'] == true)
            $wholesale_price_vat_chk = 1;
        else
            $wholesale_price_vat_chk = 0;

        $start_date = date('Y-m-d');

        if (!empty($attr['created_date'])) {
            if (strpos($attr['created_date'], '/') == true) {
                $date = str_replace('/', '-', $attr['created_date']);
                $start_date = date("Y-m-d", strtotime($date));
            } else {
                $start_date = $attr['created_date'];
            }
        }


        $data_pass = "  tst.supplier_name='" . $attr['supplier_name_id'] . "'  and 
                        tst.crm_id='" . $attr['crm_id'] . "' and
                        tst.category_id='" . $attr['category_id'] . "' and
                        tst.item_notes='" . $attr['item_notes_id'] . "' and
                        tst.brand='" . $attr['brand_id'] . "' "; //$attr['brand_id'] 

        $total = $this->objGeneral->count_duplicate_in_sql('crm_competitor', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($attr['lead_time'] == '')
            $lead_time = 0;
        else
            $lead_time = $attr['lead_time'];

        $price = Round($attr['price'], 5);
        $sale_price = Round($attr['sale_price'], 5);
        //print_r($attr);exit;
        $Sql = "INSERT INTO crm_competitor 
                                    SET 
                                        category_id = '$attr[category_id]',
                                        category_type = '$attr[category_type]',  
                                        brand = '$attr[brand_id]',    
                                        unit_id = '" . $attr['unit_id'] . "',  
                                        lead_time = '" . $lead_time . "',     
                                        lead_type = '" . $attr['lead_type'] . "',  
                                        price = '$price',  
                                        item_notes = '$attr[item_notes_id]',   
                                        volume = '$attr[volume_id]',  
                                        note = '$attr[note]',  
                                        order_frequency = '$attr[lead_time]',   
                                        crm_id = '" . $attr['crm_id'] . "', 
                                        created_date = '" . $this->objGeneral->convert_date($attr['created_date']) . "',  
                                        sale_price='$sale_price', 
                                        purchase_price_vat_chk = " . $purchase_price_vat_chk . ",    
                                        wholesale_price_vat_chk = " . $wholesale_price_vat_chk . ",  
                                        vol_unit = '$attr[vol_unit]' ,  
                                        supplier_name = '" . $attr['supplier_name_id'] . "',  
                                        user_id='" . $this->arrUser['id'] . "',  
                                        company_id='" . $this->arrUser['company_id'] . "',
                                        AddedBy='" . $this->arrUser['id'] . "',
                                        AddedOn=UNIX_TIMESTAMP (NOW())";
        // echo $Sql."<hr>"; exit;
        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, "crm_competetortab", sr_AddPermission);


        $id = $this->Conn->Insert_ID();

        if ($id > 0) {

            $response['ack'] = 1;
            $response['edit'] = 0;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['edit'] = 0;
            $response['error'] = 'Record not inserted!';
        }

        return $response;
    }

    function update_crm_competitor($attr)
    {
        $files = $attr['files'];
        $attr = $attr['frmData'];
        //echo "<pre>"; print_r($attr);exit;

        $this->objGeneral->mysql_clean($attr);

        $count = count($files['name']);
        $moduleForPermission = $this->objsetup->moduleDecider(1, $attr['crm_id']);

        if ($moduleForPermission == 'crm') $moduleForPermission = $moduleForPermission . "_competetortab";
        else $moduleForPermission = $moduleForPermission . "_competetorab";


        if ($attr['purchase_price_vat_chk'] == true)
            $purchase_price_vat_chk = 1;
        else
            $purchase_price_vat_chk = 0;

        if ($attr['wholesale_price_vat_chk'] == true)
            $wholesale_price_vat_chk = 1;
        else
            $wholesale_price_vat_chk = 0;


        if ($attr['id'] > 0)
            $update_check = "  AND tst.id <> '" . $attr['id'] . "'";

        $data_pass = "  tst.supplier_name='" . $attr['supplier_name_id'] . "'  and 
                        tst.crm_id='" . $attr['crm_id'] . "' and
                        tst.category_id='" . $attr['category_id'] . "' and
                        tst.item_notes='" . $attr['item_notes_id'] . "' and
                        tst.brand='" . $attr['brand_id'] . "' $update_check"; //brand_id

        $total = $this->objGeneral->count_duplicate_in_sql('crm_competitor', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($attr['lead_time'] == '')
            $lead_time = 0;
        else
            $lead_time = $attr['lead_time'];

        $price = Round($attr['price'], 5);
        $sale_price = Round($attr['sale_price'], 5);

        $Sql = "UPDATE crm_competitor  
                                    SET 
                                        category_id = '$attr[category_id]',  
                                        category_type = '$attr[category_type]',  
                                        brand = '$attr[brand_id]',  
                                        item_notes = '$attr[item_notes_id]',  
                                        unit_id = '" . $attr['unit_id'] . "' ,  
                                        supplier_name = '" . $attr['supplier_name_id'] . "', 
                                        lead_time = '" . $lead_time . "',   
                                        lead_type = '" . $attr['lead_type'] . "', 
                                        price = '$price',   
                                        volume = '$attr[volume_id]',  
                                        note = '$attr[note]',  
                                        order_frequency = '$attr[lead_time]',   
                                        created_date = '" . $this->objGeneral->convert_date($attr['created_date']) . "',  
                                        sale_price='$sale_price',  
                                        purchase_price_vat_chk = " . $purchase_price_vat_chk . ",   
                                        wholesale_price_vat_chk = " . $wholesale_price_vat_chk . ",   
                                        vol_unit = '$attr[vol_unit]'    
                        WHERE id = " . $attr['id'] . "  
                        limit 1";

        //echo $Sql; exit;

        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, $moduleForPermission, sr_EditPermission);

        if ($this->Conn->Affected_Rows() > 0) {

            $response['ack'] = 1;
            $response['edit'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['edit'] = 1;
            $response['error'] = 'Record can\'t be updated!';
        }

        return $response;
    }

    function delete_crm_competitor($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $moduleForPermission = $this->objsetup->moduleDecider(1, $attr['value']);

        if ($moduleForPermission == 'crm') $moduleForPermission = $moduleForPermission . "_competetortab";
        else $moduleForPermission = $moduleForPermission . "_competetorab";

        $Sql = "Update crm_competitor set status=0 WHERE id = '" . $attr['id'] . "' ";

        //echo $Sql."<hr>"; exit;
        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, $moduleForPermission, sr_DeletePermission);


        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        }

        return $response;
    }
    // price module predata api for add form
    function price_form_predata($attr = null)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $SqlOfferMethod = " SELECT   c.id, c.title  
                            FROM  crm_offer_method  c
                            where  c.status=1 and c.type=1 and
                                   c.company_id=" . $this->arrUser['company_id'] . " ";

        // echo $SqlOfferMethod; exit;
        $RSOfferMethod = $this->objsetup->CSI($SqlOfferMethod);

        if ($RSOfferMethod->RecordCount() > 0) {
            while ($Row = $RSOfferMethod->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['title'] = $Row['title'];
                $response['response']['OfferMethod'][] = $result;
            }
        } else {
            $response['response']['OfferMethod'][] = array();
        }


        $response['ack'] = 1;
        $response['error'] = NULL;
        return $response;
    }

    // Rebate start
    // //----------------------------------------------------
    function get_rebate_listings($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        // echo "<pre>";print_r($attr);exit;
        $order_type = "";
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";

        $where_clause = $this->objGeneral->flexiWhereRetriever("rebt.", $attr, $fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("rebt.", $attr, $fieldsMeta);
        if (empty($where_clause)) {
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("Rebates", $this->arrUser);
        }

        $response = array();

        $moduleForPermission = "";
        if ($attr['moduleType'] == 1) {
            // coming from customer
            $Sql = "SELECT id,rebate_history,created_date,start_date,end_date,rebate_type_name,
                           rebate_type,item_type,category_type,universal_type,
                           (CASE WHEN rebt.universal_type = 0 THEN '-'
                                 WHEN rebt.universal_type <> 0 THEN rebt.universal_type_name
                                 END) AS universal_type_name,
                           rebate_price_type,rebate_price 
                    FROM sr_crm_rebate_listing rebt
                    WHERE rebt.moduleID = '" . $attr['moduleID'] . "' AND 
                          rebt.moduleType = 1 AND 
                          rebt.status <> 0 " . $where_clause . "";
            $moduleForPermission = "customer_pricetab";
        } elseif ($attr['moduleType'] == 2) {
            // coming from supplier
            $Sql = "SELECT id,rebate_history,created_date,start_date,end_date,rebate_type_name,
                           rebate_type,item_type,category_type,universal_type,
                           (CASE WHEN rebt.universal_type = 0 THEN '-'
                                 WHEN rebt.universal_type <> 0 THEN rebt.universal_type_name
                                 END) AS universal_type_name,
                           rebate_price_type,rebate_price 
                    FROM sr_srm_rebate_listing rebt
                    WHERE rebt.moduleID = '" . $attr['moduleID'] . "' AND 
                          rebt.moduleType = 2 AND 
                          rebt.status <> 0 " . $where_clause . "";
            $moduleForPermission = "supplier_pricetab";
        }

        // echo $Sql; exit;

        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $column = "rebt.id";
        if ($order_clause == "")
            $order_type = " Order BY " . $column . " DESC";
        else $order_type = $order_clause;

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'rebt', $order_type);
        // echo $response['q'];exit;
        // $RS = $this->objsetup->CSI($response['q']);
        $RS = $this->objsetup->CSI($response['q'], $moduleForPermission, sr_ViewPermission);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                $result = array();

                $result['id'] = $Row['id'];
                $result['rebate_history'] = $Row['rebate_history'];
                $result['created_date'] = $this->objGeneral->convert_unix_into_date($Row['created_date']);
                $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
                $result['rebate_type_name'] = $Row['rebate_type_name'];
                $result['rebate_type'] = $Row['rebate_type'];
                $result['universal_type'] = $Row['universal_type'];
                $result['universal_type_name'] = $Row['universal_type_name'];
                $result['item_type'] = $Row['item_type'];
                $result['category_type'] = $Row['category_type'];
                $result['rebate_price_type'] = $Row['rebate_price_type'];

                if ($Row['rebate_price'])
                    $result['rebate_price'] = $Row['rebate_price'];
                else
                    $result['rebate_price'] = '';
                $result['action'] = 1;


                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {

            $response['response'][] = array();
            $response['ack'] = 1;
            $response['error'] = NULL;
        }

        require_once(SERVER_PATH . "/classes/Setup.php");
        $objsetup = new Setup($this->arrUser);
        $response['response']['tbl_meta_data'] = $objsetup->GetTableMetaData('Rebates');
        $response['response']['tbl_meta_data']['defaultFilter'] = $defaultFilter;
        return $response;
    }

    function getRebatebyID($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT rebate.*,employees.first_name, employees.last_name
                FROM rebate
                left JOIN employees ON employees.id=rebate.user_id
                WHERE rebate.id='" . $attr['id'] . "' LIMIT 1";
        /* echo $Sql;
          exit; */
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();

            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $attr['rebate_id'] = $Row['id'];

            // print_r($Row['rebate_type']);exit;
            // && $Row['rebate_type'] == 1

            if (($Row['universal_type'] == 2) || ($Row['universal_type'] == 3))
                $Row['revenueVolume'] = $this->get_rebateRevenueVolume($attr);

            if ($Row['rebate_type'] == 2) {

                $Row['categories'] = $this->get_rebate_categories($attr);
            } else  // || $Row['rebate_type']==3
                if ($Row['universal_type'] == 2 || $Row['universal_type'] == 3 || $Row['rebate_type'] == 3) {

                    $Row['items'] = $this->get_rebate_items($attr);
                }


            $Row['created_date'] = $this->objGeneral->convert_unix_into_date($Row['created_date']);
            $Row['offer_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
            $Row['offer_valid_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
            $Row['created_by'] = $Row['first_name'] . ' ' . $Row['last_name'];

            $response['response'] = $Row;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_rebateRevenueVolume($attr)
    {
        $Sql = "SELECT * FROM rebate_volume_revenue WHERE rebate_id = " . $attr['rebate_id'];

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

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
                WHERE reb.rebate_id = " . $attr['rebate_id'] . "
                GROUP BY SP.id";

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

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

    function get_rebate_categories($attr)
    {
        $Sql = "SELECT rc.category_id,c.name
        FROM rebate_categories  rc
        LEFT JOIN category AS c ON c.id = rc.category_id
        WHERE rc.rebate_id = " . $attr['rebate_id'];
        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['category_id'];
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

    function addRebate($attr)
    {
        // echo "<pre>"; print_r($attr); exit;

        $modulePermission = "";
        $moduleForPermission = "";
        if ($attr['moduleType'] == 1) {
            $moduleForPermission = "customer_pricetab";
        } else if ($attr['moduleType'] == 2) {
            $moduleForPermission = "supplier_pricetab";
        }
        $start_date = $this->objGeneral->convert_date($attr['offer_date']);
        $end_date = $this->objGeneral->convert_date($attr['offer_valid_date']);
        $infiniteEndDate = '4099766400';
        $current_date = $this->objGeneral->convert_date(date('Y-m-d'));

        if ($end_date > 0) {
            if ($start_date > $end_date) {
                $response['ack'] = 0;
                $response['error'] = 'Start Date is Greater than End Date';
                return $response;
            }
        }

        $updateCHK = '';
        $id = $attr['id'];

        if ($id > 0)
            $updateCHK = " AND reb.id != '" . $id . "'";

        // check duplicate if universal rebate is already exist for these dates
        // if($attr['type']==2 || $attr['type']==3) {
        $DupCHKSql = "SELECT reb.id
                          FROM rebate as reb
                          WHERE reb.moduleID='" . $attr['moduleID'] . "' AND 
                                reb.moduleType='" . $attr['moduleType'] . "' AND 
                                reb.universal_type = 1 AND
                                (reb.rebate_type = '1'  OR reb.rebate_type = '" . $attr['type'] . "') AND
                                (('" . $start_date . "' BETWEEN reb.start_date AND (CASE WHEN reb.end_date = 0 THEN 4099299120  ELSE reb.end_date END)) OR 
                                 ('" . $end_date . "' BETWEEN reb.start_date AND (CASE WHEN reb.end_date = 0 THEN 4099299120  ELSE reb.end_date END))  OR 
                                 (reb.start_date BETWEEN '" . $start_date . "' AND '" . $end_date . "') OR 
                                 ((CASE WHEN reb.end_date = 0 THEN 4099299120 
                                        ELSE reb.end_date 
                                        END ) BETWEEN '" . $start_date . "' AND '" . $end_date . "'))  AND 
                                reb.status <> 0 " . $updateCHK . "
                            LIMIT 1";
        // echo $DupCHKSql;exit;

        $DupCHKRS = $this->objsetup->CSI($DupCHKSql);

        if ($DupCHKRS->RecordCount() > 0) {

            $DupCHKRow = $DupCHKRS->FetchRow();

            $response['ack'] = 0;
            $response['error'] = 'Rebate Already Exists!';
            return $response;
        }
        // }
        // for universal rebate for customer
        if ($attr['type'] == 1) {
            $DupCHKSql = "SELECT reb.id
                          FROM rebate as reb
                          WHERE reb.moduleID='" . $attr['moduleID'] . "' AND 
                                reb.moduleType='" . $attr['moduleType'] . "' AND 
                                reb.universal_type = 1 AND
                                (('" . $start_date . "' BETWEEN reb.start_date AND (CASE WHEN reb.end_date = 0 THEN 4099299120  ELSE reb.end_date END)) OR 
                                 ('" . $end_date . "' BETWEEN reb.start_date AND (CASE WHEN reb.end_date = 0 THEN 4099299120  ELSE reb.end_date END))  OR 
                                 (reb.start_date BETWEEN '" . $start_date . "' AND '" . $end_date . "') OR 
                                 ((CASE WHEN reb.end_date = 0 THEN 4099299120 
                                        ELSE reb.end_date 
                                        END ) BETWEEN '" . $start_date . "' AND '" . $end_date . "'))  AND 
                                reb.status <> 0 " . $updateCHK . "
                            LIMIT 1";
            // echo $DupCHKSql;exit;
            /* 
                                reb.rebate_type = '" . $attr['type'] . "' AND */
            $DupCHKRS = $this->objsetup->CSI($DupCHKSql);

            if ($DupCHKRS->RecordCount() > 0) {

                $DupCHKRow = $DupCHKRS->FetchRow();

                $response['ack'] = 0;
                $response['error'] = 'Universal Rebate Already Exists!';
                return $response;
            }
        }
        // for seperate rebate for category
        if ($attr['type'] == 2) {

            $dupChkError = 0;
            $products = '';
            $products2 = '';
            $cats = '';

            foreach ($attr['categories'] as $item) {
                //check for duplicate category
                $DupCHKSql = "SELECT reb.id,category.name
                                FROM rebate as reb
                                left JOIN rebate_categories rc ON rc.rebate_id = reb.id
                                left JOIN category ON category.id = rc.category_id
                                WHERE rc.category_id = '" . $item->id . "' AND 
                                      reb.moduleID='" . $attr['moduleID'] . "' AND 
                                      reb.moduleType='" . $attr['moduleType'] . "' AND
                                     
                                      reb.universal_type =  '" . $attr['universal_type'] . "' AND
                                      (('" . $start_date . "' BETWEEN reb.start_date AND (CASE WHEN reb.end_date = 0 THEN 4099299120  ELSE reb.end_date END)) OR 
                                       ('" . $end_date . "' BETWEEN reb.start_date AND (CASE WHEN reb.end_date = 0 THEN 4099299120  ELSE reb.end_date END))  OR 
                                       (reb.start_date BETWEEN '" . $start_date . "' AND '" . $end_date . "') OR 
                                       ((CASE WHEN reb.end_date = 0 THEN 4099299120 
                                                ELSE reb.end_date 
                                                END ) BETWEEN '" . $start_date . "' AND '" . $end_date . "')) AND 
                                      reb.status <> 0 " . $updateCHK . "
                                LIMIT 1"; //COALESCE(reb.end_date,'4099766400') 
                //echo $DupCHKSql; exit;
                // reb.rebate_type = '" . $attr['type'] . "' AND
                $DupCHKRS = $this->objsetup->CSI($DupCHKSql);

                if ($DupCHKRS->RecordCount() > 0) {

                    $DupCHKRow = $DupCHKRS->FetchRow();
                    $dupChkError++;

                    // $response['ack'] = 0;
                    // $response['error'] = 'Rebate Already Exists for "' . $DupCHKRow['description'] . '" Item!';
                    // return $response;product_code
                    $products .= $DupCHKRow['name'] . ',';
                }

                //check for duplicate category items
                $DupCHKSql = "SELECT reb.id,category.name
                                FROM rebate as reb
                                left JOIN rebate_items ON rebate_items.rebate_id = reb.id
                                left JOIN product ON product.id = rebate_items.item_id
                                left JOIN category ON category.id = product.category_id
                                WHERE product.category_id = '" . $item->id . "' AND 
                                      reb.moduleID='" . $attr['moduleID'] . "' AND 
                                      reb.moduleType='" . $attr['moduleType'] . "' AND
                                     
                                      reb.universal_type =  '" . $attr['universal_type'] . "' AND
                                      (('" . $start_date . "' BETWEEN reb.start_date AND (CASE WHEN reb.end_date = 0 THEN 4099299120  ELSE reb.end_date END)) OR 
                                       ('" . $end_date . "' BETWEEN reb.start_date AND (CASE WHEN reb.end_date = 0 THEN 4099299120  ELSE reb.end_date END))  OR 
                                       (reb.start_date BETWEEN '" . $start_date . "' AND '" . $end_date . "') OR 
                                       ((CASE WHEN reb.end_date = 0 THEN 4099299120 
                                                ELSE reb.end_date 
                                                END ) BETWEEN '" . $start_date . "' AND '" . $end_date . "')) AND 
                                      reb.status <> 0 " . $updateCHK . "
                                LIMIT 1"; //COALESCE(reb.end_date,'4099766400') 
                //echo $DupCHKSql; exit;
                // reb.rebate_type = '" . $attr['type'] . "' AND
                $DupCHKRS = $this->objsetup->CSI($DupCHKSql);

                if ($DupCHKRS->RecordCount() > 0) {

                    $DupCHKRow = $DupCHKRS->FetchRow();
                    $dupChkError++;

                    // $response['ack'] = 0;
                    // $response['error'] = 'Rebate Already Exists for "' . $DupCHKRow['description'] . '" Item!';
                    // return $response;product_code
                    $products .= $DupCHKRow['name'] . ',';
                    $cats .= $DupCHKRow['name'] . ',';
                }
            }

            if ($dupChkError > 0) {

                $products2 = substr($products, 0, -1);
                $response['ack'] = 0;
                if ($cats != '') {
                    $response['error'] = 'Rebate Already Exists for "' . $products2 . '" Category Items!';
                } else {
                    $response['error'] = 'Rebate Already Exists for "' . $products2 . '" Category(ies)!';
                }

                return $response;
            }
        }
        // for seperate rebate for item
        if ($attr['type'] == 3) {

            $dupChkError = 0;
            $products = '';
            $products2 = '';
            $cats = '';
            foreach ($attr['items'] as $item) {
                //cehck duplicate item
                $DupCHKSql = "SELECT reb.id,product.product_code,product.description
                                FROM rebate as reb
                                left JOIN rebate_items ON rebate_items.rebate_id = reb.id
                                left JOIN product ON product.id = rebate_items.item_id
                                WHERE rebate_items.item_id = '" . $item->id . "' AND 
                                      reb.moduleID='" . $attr['moduleID'] . "' AND 
                                      reb.moduleType='" . $attr['moduleType'] . "' AND
                                     
                                      reb.universal_type =  '" . $attr['universal_type'] . "' AND
                                      (('" . $start_date . "' BETWEEN reb.start_date AND (CASE WHEN reb.end_date = 0 THEN 4099299120  ELSE reb.end_date END)) OR 
                                       ('" . $end_date . "' BETWEEN reb.start_date AND (CASE WHEN reb.end_date = 0 THEN 4099299120  ELSE reb.end_date END))  OR 
                                       (reb.start_date BETWEEN '" . $start_date . "' AND '" . $end_date . "') OR 
                                       ((CASE WHEN reb.end_date = 0 THEN 4099299120 
                                                ELSE reb.end_date 
                                                END ) BETWEEN '" . $start_date . "' AND '" . $end_date . "')) AND 
                                      reb.status <> 0 " . $updateCHK . "
                                LIMIT 1"; //COALESCE(reb.end_date,'4099766400') 
                // echo $DupCHKSql; exit;
                // reb.rebate_type = '" . $attr['type'] . "' AND
                $DupCHKRS = $this->objsetup->CSI($DupCHKSql);

                if ($DupCHKRS->RecordCount() > 0) {

                    $DupCHKRow = $DupCHKRS->FetchRow();
                    $dupChkError++;

                    // $response['ack'] = 0;
                    // $response['error'] = 'Rebate Already Exists for "' . $DupCHKRow['description'] . '" Item!';
                    // return $response;product_code
                    $products .= $DupCHKRow['description'] . '(' . $DupCHKRow['product_code'] . '),';
                }

                // check duplicate category

                $DupCHKSql = "SELECT reb.id,product.product_code,product.description
                                FROM rebate as reb
                                left JOIN rebate_categories ON rebate_categories.rebate_id = reb.id
                                left JOIN product ON product.category_id = rebate_categories.category_id
                                WHERE product.id = '" . $item->id . "' AND 
                                      reb.moduleID='" . $attr['moduleID'] . "' AND 
                                      reb.moduleType='" . $attr['moduleType'] . "' AND
                                     
                                      reb.universal_type =  '" . $attr['universal_type'] . "' AND
                                      (('" . $start_date . "' BETWEEN reb.start_date AND (CASE WHEN reb.end_date = 0 THEN 4099299120  ELSE reb.end_date END)) OR 
                                       ('" . $end_date . "' BETWEEN reb.start_date AND (CASE WHEN reb.end_date = 0 THEN 4099299120  ELSE reb.end_date END))  OR 
                                       (reb.start_date BETWEEN '" . $start_date . "' AND '" . $end_date . "') OR 
                                       ((CASE WHEN reb.end_date = 0 THEN 4099299120 
                                                ELSE reb.end_date 
                                                END ) BETWEEN '" . $start_date . "' AND '" . $end_date . "')) AND 
                                      reb.status <> 0 " . $updateCHK . "
                                LIMIT 1"; //COALESCE(reb.end_date,'4099766400') 
                // echo $DupCHKSql; exit;
                // reb.rebate_type = '" . $attr['type'] . "' AND
                $DupCHKRS = $this->objsetup->CSI($DupCHKSql);

                if ($DupCHKRS->RecordCount() > 0) {

                    $DupCHKRow = $DupCHKRS->FetchRow();
                    $dupChkError++;

                    // $response['ack'] = 0;
                    // $response['error'] = 'Rebate Already Exists for "' . $DupCHKRow['description'] . '" Item!';
                    // return $response;product_code
                    $products .= $DupCHKRow['description'] . '(' . $DupCHKRow['product_code'] . '),';
                    $cats .= $DupCHKRow['description'] . '(' . $DupCHKRow['product_code'] . '),';
                }
            }

            if ($dupChkError > 0) {

                $products2 = substr($products, 0, -1);
                $response['ack'] = 0;
                if ($cats != '') {
                    $response['error'] = 'Rebate Already Exists for "' . $products2 . '" Item(s) Category!';
                } else {
                    $response['error'] = 'Rebate Already Exists for "' . $products2 . '" Item(s)!';
                }

                return $response;
            }
        }

        // exit;

        $category_type = (isset($attr['category_type'])  && $attr['category_type'] != '') ? $attr['category_type'] : 0;
        $rebate_price = (isset($attr['rebate_price'])  && $attr['rebate_price'] != '') ? $attr['rebate_price'] : 0;
        $item_type = (isset($attr['item_type'])  && $attr['item_type'] != '') ? $attr['item_type'] : 0;
        $universal_type = (isset($attr['universal_type']) && $attr['universal_type'] != '') ? $attr['universal_type'] : 0;

        $recVolumeRevenue = $attr['recVolumeRevenue'];
        $items = $attr['items'];
        $categories = $attr['categories'];
        //echo '<pre>';print_r($categories);exit;
        if ($universal_type == 0)
            $universal_type = (isset($attr['universal_types']) && $attr['universal_types'] != '') ? $attr['universal_types'] : 0;

        $rebate_price_types = (isset($attr['rebate_price_types']->id) && $attr['rebate_price_types'] != '') ? $attr['rebate_price_types']->id : 0;

        if ($id > 0) {
            $modulePermission = sr_EditPermission;

            $this->objGeneral->mysql_clean($attr);

            $Sql = "UPDATE rebate
				        SET
				            universal_type = '" . $universal_type . "',
                            rebate_price_type = '" . $attr['rebate_price_type'] . "',
				            rebate_price = '" . $attr['rebate_price'] . "',
				            uom = '" . $attr['uom'] . "',
				            notes = '" . $attr['notes'] . "',
                            start_date = '" . $start_date . "',
                            end_date = '" . $end_date . "'
				        WHERE id = '" . $id . "' 
                        limit 1";

            // $RS = $this->objsetup->CSI($Sql);
            $RS = $this->objsetup->CSI($Sql, $moduleForPermission, $modulePermission);


            if (($attr['universal_type'] == 2) || ($attr['universal_type'] == 3))
                self::addRevenueVolume($id, $recVolumeRevenue, $attr['universal_type'], 1);

            if ($attr['universal_type'] == 2 || $attr['universal_type'] == 3 || $attr['type'] == 3)
                self::add_rebate_items($attr['id'], $items, 1); // || $attr['type'] == 3

            if ($attr['type'] == 2)
                self::add_rebate_categories($attr['id'], $categories, 1);
        } else {
            $modulePermission = sr_AddPermission;

            $this->objGeneral->mysql_clean($attr);

            $Sql = "INSERT INTO rebate
                            SET
                                moduleID='" . $attr['moduleID'] . "',
                                moduleType='" . $attr['moduleType'] . "',
                                rebate_type = '" . $attr['type'] . "',
                                item_type = '" . $item_type . "',
                                uom = '" . $attr['uom'] . "',
                                notes = '" . $attr['notes'] . "',
                                category_type = '" . $category_type . "',
                                universal_type = '" . $universal_type . "',
                                rebate_price_type = '" . $rebate_price_types . "',
                                rebate_price = '" . $rebate_price . "',
                                created_date = '" . $current_date . "',
                                start_date = '" . $start_date . "',
                                end_date = '" . $end_date . "',
                                status = 1,
                                user_id = '" . $this->arrUser['id'] . "',
                                company_id = '" . $this->arrUser['company_id'] . "'";

            //echo $Sql;exit; 
            // $RS = $this->objsetup->CSI($Sql);
            $RS = $this->objsetup->CSI($Sql, $moduleForPermission, $modulePermission);
            $id = $this->Conn->Insert_ID();

            if ($id > 0) {
                //print_r($attr['recVolumeRevenue']->revenue_volume_to);

                if (($attr['universal_type'] == 2) || ($attr['universal_type'] == 3))
                    self::addRevenueVolume($id, $recVolumeRevenue, $attr['universal_type'], 0);


                if ($attr['universal_type'] == 2 || $attr['universal_type'] == 3 || $attr['type'] == 3)
                    self::add_rebate_items($id, $items, 1); // || $attr['type'] == 3

                if ($attr['type'] == 2)
                    self::add_rebate_categories($id, $categories, 0);
            }
        }

        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['edit'] = 0;
            $response['id'] = $id;

            $attr['crm_rebate_id'] = $attr['id'];
            // if($attr['crm_rebate_id'] > 0)
            //     $this->add_customer_rebate_history($attr);

        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
            $response['edit'] = 0;
        }
        return $response;
    }

    function addRevenueVolume($id, $recVolumeRevenue, $volumeRevenuetype, $isEdit)
    {
        $current_date = $this->objGeneral->convert_date(date('Y-m-d'));
        $uom = (isset($recVolumeRevenue['uom']) && $recVolumeRevenue['uom'] != '') ? $recVolumeRevenue['uom'] : 0;


        if ($isEdit == 1) {
            $Sql = "DELETE FROM rebate_volume_revenue WHERE rebate_id = " . $id;
            $RS = $this->objsetup->CSI($Sql);
        }

        foreach ($recVolumeRevenue as $rec) {
            if ($rec->revenue_volume_from > 0) // && $rec->revenue_volume_to > 0
            {
                $rebate_types = (isset($rec->rebate_types->id) && $rec->rebate_types->id != '') ? $rec->rebate_types->id : 0;

                $Sql = "INSERT INTO rebate_volume_revenue
                            SET
                                rebate_id = '" . $id . "',
                                revenue_volume_from = '" . $rec->revenue_volume_from . "',
                                revenue_volume_to = 0,
                                uom = '" . $uom . "',
                                type = '" . $volumeRevenuetype . "',
                                rebate_type = '" . $rebate_types . "',
                                rebate = '" . $rec->rebate . "',
                                create_date = '" . $current_date . "',
                                status = 1,
                                user_id = '" . $this->arrUser['id'] . "',
                                company_id = '" . $this->arrUser['company_id'] . "'";
                // echo '<hr>' . $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            }
        }
        return true;
    }



    function add_rebate_items($id, $items, $isEdit)
    {
        // echo "<pre>"; print_r($items);echo $id, exit; 
        $current_date = $this->objGeneral->convert_date(date('Y-m-d'));

        if ($isEdit == 1) {
            $Sql = "DELETE FROM rebate_items WHERE rebate_id = " . $id;
            $RS = $this->objsetup->CSI($Sql);
        }

        foreach ($items as $item) {
            $Sql = "INSERT INTO rebate_items
					                SET
					                    rebate_id = '" . $id . "',
					                    item_id = '" . $item->id . "',
					                    status = 1,
					                    user_id = '" . $this->arrUser['id'] . "',
					                    company_id = '" . $this->arrUser['company_id'] . "',
					                    created_date = '" . $current_date . "'";
            // echo '<hr>' . $Sql;
            $RS = $this->objsetup->CSI($Sql);
        }
        // exit;
        return true;
    }

    function add_rebate_categories($id, $categories, $isEdit)
    {
        $current_date = $this->objGeneral->convert_date(date('Y-m-d'));

        if ($isEdit == 1) {
            $Sql = "DELETE FROM rebate_categories WHERE rebate_id = " . $id;
            $RS = $this->objsetup->CSI($Sql);
        }
        foreach ($categories as $cat) {
            $Sql = "INSERT INTO rebate_categories
                                      SET
                                            rebate_id = '" . $id . "',
                                            category_id = '" . $cat->id . "',
                                            status = 1,
                                            user_id = '" . $this->arrUser['id'] . "',
                                            company_id = '" . $this->arrUser['company_id'] . "',
                                            created_date = '" . $current_date . "'";

            $RS = $this->objsetup->CSI($Sql);
        }
        return true;
    }

    function deleteRebate($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $modulePermission = "";

        $Sql = "SELECT moduleType,start_date,end_date,moduleID 
                FROM rebate 
                WHERE id = " . $attr['id'] . "";

        $RS = $this->objsetup->CSI($Sql);

        $moduleType = $RS->fields['moduleType'];
        $accID = $RS->fields['moduleID'];
        $start_date = $RS->fields['start_date'];
        $end_date = $RS->fields['end_date'];

        if ($moduleType == 1) {

            $modulePermission = "customer_pricetab";

            $Sql2 = "SELECT id 
                     FROM orders 
                     WHERE sell_to_cust_id = $accID AND type=1 AND
                           offer_date >= $start_date AND 
                           offer_date <= $end_date ";

            $RS2 = $this->objsetup->CSI($Sql2);

            if ($RS2->RecordCount() > 0) {
                $response['ack'] = 0;
                $response['error'] = 'This Rebate cannot be deleted because it is being used in another record.';
                return $response;
            }
        } else if ($moduleType == 2)
            $modulePermission = "supplier_pricetab";

        $Sql = "UPDATE rebate SET status = '0' WHERE id = " . $attr['id'] . " ";

        //echo $Sql; exit;
        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, $modulePermission, sr_DeletePermission);


        if ($this->Conn->Affected_Rows() > 0) {

            $Sql2 = "UPDATE rebate_items SET status = '0' WHERE rebate_id = " . $attr['id'] . " ";
            $RS2 = $this->objsetup->CSI($Sql2);

            $Sql3 = "UPDATE rebate_categories SET status = '0' WHERE rebate_id = " . $attr['id'] . " ";
            $RS3 = $this->objsetup->CSI($Sql3);

            $Sql4 = "UPDATE rebate_volume_revenue SET status = '0' WHERE rebate_id = " . $attr['id'] . " ";
            $RS4 = $this->objsetup->CSI($Sql4);

            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {

            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        }

        return $response;
    }

    function discardRebate($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "Delete from rebate WHERE id = " . $attr['id'] . " ";

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {

            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        }

        return $response;
    }

    // Rebate Volume and Revenue Start
    //----------------------------------------------------
    function get_crm_rebate_volume_revenue($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "SELECT rebate_vr.*,wh.title as uom,
                IFNULL((SELECT history.id From rebate_volume_revenue_history as history
                      where history.rebate_volume_revenue_id = rebate_vr.id limit 1 ),0) as rebate_volume_revenue_history

				FROM rebate_volume_revenue as rebate_vr
				LEFT JOIN units_of_measure as wh ON wh.id = rebate_vr.uom
				WHERE rebate_vr.rebate_id = '" . $attr['rebate_id'] . "' and rebate_vr.type = '" . $attr['rebate_type'] . "'";

        //echo $Sql; exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                $result = array();

                $result['id'] = $Row['id'];
                $result['rebate_volume_revenue_history'] = $Row['rebate_volume_revenue_history'];
                $result['created_date'] = $this->objGeneral->convert_unix_into_date($Row['create_date']);
                $result['revenue_volume_from'] = $Row['revenue_volume_from'];
                $result['revenue_volume_to'] = $Row['revenue_volume_to'];
                $result['uom'] = $Row['uom'];
                $result['rebate_type'] = $Row['rebate_type'];
                $result['rebate'] = $Row['rebate'];

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

    function get_rebate_volume_revenue_byid($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $response = array();

        $Sql = "SELECT rebate_vr.*,wh.title as uom
				FROM rebate_volume_revenue as rebate_vr
				LEFT JOIN units_of_measure as wh ON wh.id = rebate_vr.uom
				WHERE rebate_vr.id = '" . $attr['RebateRevenueRebate_id'] . "' limit 1";

        //echo $Sql; exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                $result = array();

                $result['id'] = $Row['id'];
                $result['created_date'] = $this->objGeneral->convert_unix_into_date($Row['create_date']);
                /*$result['start_date1'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                $result['end_date1'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);*/
                //$result['volume'] = $Row['rebate_volume_revenue_detail_id'];
                $result['revenue_volume_from'] = $Row['revenue_volume_from'];
                $result['revenue_volume_to'] = $Row['revenue_volume_to'];
                $result['uom'] = $Row['uom'];
                //$result['volume_revenue_detail'] = $Row['range_to'] . " - " . $Row['range_from'];
                $result['rebate_type'] = $Row['rebate_type'];
                $result['rebate'] = $Row['rebate'];
                $result['type'] = $Row['type'];

                $response['response'] = $result;
                //$response['response'][] = $result;
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

    function add_crm_rebate_volume_revenue($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $current_date = $this->objGeneral->convert_date(date('Y-m-d'));


        $data_pass = "   tst.rebate_id='" . $attr['rebate_id'] . "'  and
                         ('" . $attr['revenue_volume_from'] . "' BETWEEN tst.revenue_volume_from AND tst.revenue_volume_to
								 or '" . $attr['revenue_volume_to'] . "' BETWEEN tst.revenue_volume_from AND tst.revenue_volume_to )";

        $total = $this->objGeneral->count_duplicate_in_sql('rebate_volume_revenue', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
        $uom = ($attr['uom']) ? $attr['uom'] : 0;
        $Sql = "INSERT INTO rebate_volume_revenue
                        SET
                            rebate_id = '" . $attr['rebate_id'] . "',
                            revenue_volume_from = '" . $attr['revenue_volume_from'] . "',
                            revenue_volume_to = '" . $attr['revenue_volume_to'] . "',
                            uom = '" . $uom . "',
                            type = '" . $attr['type'] . "',
                            rebate_type = '" . $attr['rebate_type'] . "',
                            rebate = '" . $attr['rebate'] . "',
                            create_date = UNIX_TIMESTAMP (NOW()),
                            status = 1,
                            user_id = '" . $this->arrUser['id'] . "',
                            company_id = '" . $this->arrUser['company_id'] . "'";
        //echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {

            $attr['rebate_volume_revenue_id'] = $id;
            $this->add_crm_rebate_volume_revenue_history($attr);

            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['edit'] = 0;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
            $response['edit'] = 0;
        }
        // exit;
        return $response;
    }

    function update_crm_rebate_volume_revenue($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $data_pass = "   tst.rebate_id='" . $attr['rebate_id'] . "'  and
                         ('" . $attr['revenue_volume_from'] . "' BETWEEN tst.revenue_volume_from AND tst.revenue_volume_to
								 or '" . $attr['revenue_volume_to'] . "' BETWEEN tst.revenue_volume_from AND tst.revenue_volume_to )
					      AND tst.id != '" . $attr['id'] . "'";

        $total = $this->objGeneral->count_duplicate_in_sql('rebate_volume_revenue', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
        $uom = ($attr['uom']) ? $attr['uom'] : 0;

        $Sql = "UPDATE rebate_volume_revenue
				        SET
				            revenue_volume_from = '" . $attr['revenue_volume_from'] . "',
				            revenue_volume_to = '" . $attr['revenue_volume_to'] . "',
				            uom = '" . $uom . "',
                            rebate_type = '" . $attr['rebate_type'] . "',
                            rebate = '" . $attr['rebate'] . "'
				        WHERE id = '" . $attr['id'] . "'  limit 1";

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {

            $attr['rebate_volume_revenue_id'] = $attr['id'];
            $this->add_crm_rebate_volume_revenue_history($attr);

            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['edit'] = 1;
        } else {
            $response['ack'] = 0;
            $response['edit'] = 0;
            $response['error'] = 'Record Updated Successfully';
        }
        return $response;
    }

    // Not in use // Rebate Volume and Revenue Detail Start
    //----------------------------------------------------
    function get_crm_rebate_volume_revenue_detail($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $response = array();

        $Sql = "SELECT p.id,p.range_to,p.range_from,
                        ( SELECT wh.title  FROM units_of_measure_setup st
                          JOIN units_of_measure as wh ON wh.id = st.cat_id
                          where st.id =p.uom and st.status=1 ) as cat_name
				FROM rebate_volume_revenue_detail as p
				WHERE p.rebate_id = '$attr[rebate_id]'";

        //echo $Sql; exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                $result = array();

                $result['id'] = $Row['id'];
                $result['name'] = $Row['range_from'] . " - " . $Row['range_to'] . ' ' . $Row['cat_name'];

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

    function add_crm_rebate_volume_revenue_detail($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $data_pass = "  (tst.rebate_id='" . $attr['rebate_id'] . "'  AND tst.uom = '" . $attr['uom'] . "'  AND
                              ('" . $attr['quantity_from'] . "' BETWEEN tst.range_from AND tst.range_to
								 or '" . $attr['quantity_to'] . "' BETWEEN tst.range_from AND tst.range_to ))";

        $total = $this->objGeneral->count_duplicate_in_sql('rebate_volume_revenue_detail', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO rebate_volume_revenue_detail
                        SET
                            rebate_id = '" . $attr['rebate_id'] . "',
                            range_to = '" . $attr['quantity_to'] . "',
                            range_from = '" . $attr['quantity_from'] . "',
                            uom = '" . $attr['uom'] . "',
                            user_id = '" . $this->arrUser['id'] . "',
                            company_id = '" . $this->arrUser['company_id'] . "'";

        /* echo $Sql . " < hr>";
          exit; */
        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();


        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['edit'] = 0;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
            $response['edit'] = 0;
        }
        // exit;
        return $response;
    }

    // Not in use // Rebate Volume and Revenue Detail End
    //----------------------------------------------------
    // Rebate Volume and Revenue End
    //----------------------------------------------------
    // Crm Opportunity Cycle
    //----------------------------------------------------


    function get_crm_opportunity_cycles($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $moduleForPermission = $this->objsetup->moduleDecider(1, $attr['value']);

        if ($moduleForPermission == 'crm') $moduleForPermission = $moduleForPermission . "_oopCycle_tab";
        else $moduleForPermission = $moduleForPermission . "_oop_cycletab";

        $order_type = "";
        $response = array();

        $filters_dropdown = "";
        $head = "";
        $filter_dict = "";

        $check_cond = '';
        $check_cond = (isset($attr['value']) && $attr['value'] != '') ? " oppmain.crm_id = $attr[value] AND " : "";

        $Sql = "SELECT oppmain.id,oppmain.oop_code,oppmain.name,oppmain.date_added,
                        (SELECT COUNT(id) FROM crm_opportunity_cycle_detail 
                         WHERE crm_opportunity_cycle_id = oppmain.id AND is_complete = 1 AND 
                               company_id = " . $this->arrUser['company_id'] . " ) AS stageComplete
                FROM crm_opportunity_cycle as oppmain
                where  $check_cond oppmain.status=1 and oppmain.company_id=" . $this->arrUser['company_id'] . " ";

        // echo $Sql;exit;
        // $order_type = "Group by opp.crm_opportunity_cycle_id DESC";

        $total_limit = pagination_limit;


        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $order_type = " order by oppmain.id DESC";
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'oppmain', $order_type);
        // echo $response['q'];   exit;

        // $RS = $this->objsetup->CSI($response['q']);
        $RS = $this->objsetup->CSI($response['q'], $moduleForPermission, sr_ViewPermission);

        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['opp._no.'] = $Row['oop_code'];
                $result['name'] = $Row['name'];
                // $result['stageComplete'] = $Row['stageComplete'];
                $result['value'] = $attr['value'];

                $result2 = array();

                // $result2 = $this->get_crm_opportunity_cycle_detail($result, 1);
                $result2 = $this->get_crm_opportunityCycleStageListing($result, 1);

                if (count($result2) > 0) {

                    $result['child_id'] = $result2['response'][0]['id'];
                    /*$result['name'] = $result2[response][0]['subject'];*/
                    $result['forecast_amount'] = $result2['response'][0]['forecast_amount'];
                    // $result['start_date'] = $this->objGeneral->convert_unix_into_date($result2['start_date']);
                    //$result['due_date'] = $result2['due_date'];
                    // $result['end_date'] = $this->objGeneral->convert_unix_into_date($result2['end_date']);
                    $result['probability'] = $result2['response'][0]['probability'];
                    $result['expected_date'] = $result2['response'][0]['expected_close_date'];
                    $result['stage_id'] = $result2['response'][0]['tab_id'];
                    $result['stage'] = $result2['response'][0]['stagename'];
                    $result['is_complete'] = $result2['response'][0]['is_complete'];
                    $result['creation_date'] = $this->objGeneral->convert_unix_into_date($Row['date_added']);
                    //$result['date_added'] = $result2[response][0]['opp_date_added'];
                }


                $result['history'] = '';

                $response['response'][] = $result;
                $record['results'][] = $result;
            }
            $ack = 1;
        } else {
            $ack = 0;
            $response['response'][] = array();
        }


        return array(
            'filters_dropdown' => $filters_dropdown,
            'columns' => $head,
            'filter_dict' => $filter_dict,
            'filters' => $record['column_id'],
            'record' => array(
                'total' => $response['total'],
                'result' => $record['results'],
                'response' => $record['response'],
                'ack' => $ack
            )
        );
    }

    function get_job_title($attr)
    {
        $where_clause = "";
        $order_type = "";
        $response = array();
        //print_r($attr);
        if (!empty($attr['type']))
            $where_clause = "and c.type= '" . $attr['type'] . "' ";

        $Sqla = "SELECT  c.oppCycleFreqstartmonth,c.oop_cycle_edit_role
                FROM company c
                where c.id = " . $this->arrUser['company_id'] . " ";

        $RSa = $this->objsetup->CSI($Sqla);


        if ($RSa->fields['oppCycleFreqstartmonth'] > 0) {
            $oppCycleFreqstartmonth = $RSa->fields['oppCycleFreqstartmonth'];
            $oop_cycle_edit_role = $RSa->fields['oop_cycle_edit_role'];
        } else {

            $oppCycleFreqstartmonth = 0;
            $oop_cycle_edit_role = $RSa->fields['oop_cycle_edit_role'];
        }

        $Sql = "SELECT  c.*,
                        CASE WHEN type = 1 THEN 'HR'
                             WHEN type = 2 THEN 'Opp_cycle'
                        End  as tname
                 FROM job_title c
                 where c.status=1  AND c.company_id=" . $this->arrUser['company_id'] . "
                        " . $where_clause . "  ";


        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);

        $RS = $this->objsetup->CSI($response['q']);
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
            $response['oppCycleFreqstartmonth'] = $oppCycleFreqstartmonth;
            $response['oop_cycle_edit_role'] = $oop_cycle_edit_role;
        } else
            $response['response'][] = array();

        return $response;
    }

    function get_opportunity_cycle_tabs($attr)
    {

        $this->objGeneral->mysql_clean($attr);
        //print_r($attr); exit;
        $limit_clause = "";
        // if ($attr['is_opp_cyle'] == 1)  $where_clause = " and   c.is_default = 1";// AND c.status =1 OR
        if ($attr['is_opp_cyle'] == 0 && $this->arrUser['user_type'] != SUPER_ADMIN_USER_TYPE)
            $where_clause = "AND c.company_id ='" . $this->arrUser['company_id'] . "' AND c.is_default = 0";
        else
            $where_clause = " AND c.company_id =" . $this->arrUser['company_id'];

        if (!empty($attr['opp_cycle_limit']))
            $limit = "LIMIT  $attr[opp_cycle_limit]";


        //if (!empty($attr['status'])) $where_clause2 = "and c.status=1 ";

        $response = array();

        $Sql = "SELECT   c.*  
                FROM opp_cycle_tabs  c   
                where c.company_id=" . $this->arrUser['company_id'] . "  
                        " . $where_clause . "  and c.status=1 "; //$where_clause2


        $order_type = "order by c.start_end,c.rank ASC ";

        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;

        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        $index = 1;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                // $result['name'] = (strlen($Row['name']>25)) ? substr($Row['name'], 0, 150).'... ' : $Row['name'];

                $result['stage_number'] = $index;
                $result['rank'] = $Row['rank'];
                $result['edit_percentage'] = $Row['edit_percentage'];
                $result['percentage'] = $Row['percentage'];
                $result['Probability'] = $Row['percentage'];
                $result['start_end'] = $Row['start_end'];
                $result['status'] = $Row['status'] == 1 ? 'Active' : 'Inactive';
                $response['response'][] = $result;
                $index = $index + 1;
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

    function get_process_of_decision($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $order_type = "";
        $response = array();


        $Sql = "SELECT   c.*  
                FROM  process_of_decision  c
                where  c.status=1 and 
                       c.company_id=" . $this->arrUser['company_id'] . " ";

        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        $response['ack'] = 1;
        $response['error'] = NULL;


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['description'] = $Row['description'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function getAutoCode($attr)
    {
        $table = base64_decode($attr['tb']);

        if ($table != 'product') {

            /*======= Query for MYSQL FUNCTION start */

            $MYSQL_FUNCTION_Sql = "SELECT  SR_GetNextSeq('" . $attr['tb'] . "','" . $this->arrUser['company_id'] . "','" . $attr['brand'] . "' ,'" . $attr['category'] . "') ";
            //echo $MYSQL_FUNCTION_Sql;exit;

            $code = $this->objsetup->CSI($MYSQL_FUNCTION_Sql);

            /*echo "<pre>";
            print_r($code);
            exit;*/

            $SR_GetNextseqcode = $code->fields[0];

            /*======= Query for MYSQL FUNCTION  end */

            if ($SR_GetNextseqcode == "MaxReached" || $SR_GetNextseqcode == "NoValueSet") {
                $response['ack'] = 0;
                $response['error'] = $SR_GetNextseqcode;
            } elseif ($SR_GetNextseqcode != "") {

                $response['code'] = $SR_GetNextseqcode;
                $response['ack'] = 1;
                $response['error'] = 'Code Generated Successfully';
            } else {
                $response['ack'] = 0;
                $response['error'] = 'Code not Generated';;
                //$response['error'] = $msg_err;
            }
            return $response;

            /*=================  end =================*/
        }
    }

    function get_crm_opportunity_cycle_pre_data($attr)
    {
        // print_r($attr); exit;
        // $result['code'] = self::getAutoCode($attr);
        $attr['module_type'] = 1;
        $result['alt_contacts'] = self::get_alt_contacts_list($attr);

        $result['process_of_decission'] = self::get_process_of_decision($attr);
        $result['stages'] = self::get_opportunity_cycle_tabs($attr);
        $result['job_titles'] = self::get_job_title($attr);
        $result['crmsaleperson'] = self::getCRMSalespersons($attr);

        $result['ack'] = true;
        // print_r($result);
        return $result;
    }

    function getOpportunityCycleStagesStatus($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $moduleForPermission = $this->objsetup->moduleDecider(1, $attr['crm_id']);

        if ($moduleForPermission == 'crm') $moduleForPermission = $moduleForPermission . "_oopCycle_tab";
        else $moduleForPermission = $moduleForPermission . "_oop_cycletab";

        $Sql = " SELECT c.stage_id,c.is_complete
                 From sr_crm_opportunitycycle_sel c
                 WHERE c.crm_id='" . $attr['crm_id'] . "' and 
                       c.crm_opportunity_cycle_id='" . $attr['crm_opportunity_cycle_id'] . "' AND
                       c.company_id='" . $this->arrUser['company_id'] . "' ";

        //echo $Sql; exit;

        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, "crm_oopCycle_tab", sr_ViewPermission);


        if ($RS->RecordCount() > 0) {

            $activeRec = 0;

            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                if ($activeRec == 0) {
                    $Row["activeRec"] = 1;
                    $activeRec = 1;
                } else {
                    $Row["activeRec"] = 0;
                }

                $response['response'][] = $Row;
            }
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
            return $response;
        }
        // print_r($response);exit;
        $response['ack'] = 1;
        $response['error'] = NULL;
        return $response;
    }

    function get_crm_opportunity_cycle_by_stageid($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $custom_find = 0;

        $moduleForPermission = $this->objsetup->moduleDecider(1, $attr['crm_id']);

        if ($moduleForPermission == 'crm') $moduleForPermission = $moduleForPermission . "_oopCycle_tab";
        else $moduleForPermission = $moduleForPermission . "_oop_cycletab";

        $Sql = " SELECT c.*
                 From sr_crm_opportunitycycle_sel c
                 WHERE c.crm_id='" . $attr['crm_id'] . "' and c.crm_opportunity_cycle_id='" . $attr['crm_opportunity_cycle_id'] . "' AND c.stage_id = '" . $attr['stage_id'] . "' AND
                       c.company_id='" . $this->arrUser['company_id'] . "' ";

        // echo $Sql; exit;

        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, $moduleForPermission, sr_ViewPermission);


        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $attr['history'] = 'history';
            $Row['stage_change'] = $custom_find;

            $Row['date_added'] = $this->objGeneral->convert_unix_into_date($Row['date_added']);
            $Row['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
            $Row['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
            $Row['expected_close_date'] = $this->objGeneral->convert_unix_into_date($Row['expected_close_date']);

            $attr['id'] = $attr['crm_opportunity_cycle_id'];

            $Row['tabsDetail'] = self::get_crm_opportunity_cycle_detail($attr);

            $attr['module_type'] = 1;
            $Row['alt_contacts'] = self::get_alt_contacts_list($attr);
            $Row['process_of_decission'] = self::get_process_of_decision($attr);
            $Row['stages'] = self::get_opportunity_cycle_tabs($attr);
            $Row['job_titles'] = self::get_job_title($attr);

            // print_r($Row);
            $response['response'] = $Row;
        } else {
            $response['response'] = array();

            $moduleForPermission = $this->objsetup->moduleDecider(1, $attr['crm_id']);

            if ($moduleForPermission == 'crm') $moduleForPermission = $moduleForPermission . "_oopCycle_tab";
            else $moduleForPermission = $moduleForPermission . "_oop_cycletab";

            $Sql2 = " SELECT c.*
                     From sr_crm_opportunitycycle_sel c
                     WHERE c.crm_id='" . $attr['crm_id'] . "' and 
                           c.crm_opportunity_cycle_id='" . $attr['crm_opportunity_cycle_id'] . "' AND
                           c.company_id='" . $this->arrUser['company_id'] . "' limit 1";

            // echo $Sql2; exit;

            // $RS2 = $this->objsetup->CSI($Sql2);
            $RS2 = $this->objsetup->CSI($Sql2, $moduleForPermission, sr_ViewPermission);

            if ($RS2->RecordCount() > 0) {
                $Row2 = $RS2->FetchRow();
                foreach ($Row2 as $key => $value) {
                    if (is_numeric($key))
                        unset($Row2[$key]);
                }

                // print_r($Row2);
                $response['response2'] = $Row2;
            }


            $response['ack'] = 0;
            $response['error'] = NULL;
            return $response;
        }
        //echo "<pre>";print_r($attr);exit;
        $response['response']['stagesStatus'] = self::getOpportunityCycleStagesStatus($attr);

        $response['ack'] = 1;
        $response['error'] = NULL;
        return $response;
    }

    function get_crm_opportunity_cycle_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $moduleForPermission = $this->objsetup->moduleDecider(1, $attr['crm_id']);

        if ($moduleForPermission == 'crm') $moduleForPermission = $moduleForPermission . "_oopCycle_tab";
        else $moduleForPermission = $moduleForPermission . "_oop_cycletab";

        $custom_find = 0;

        $Sql = " SELECT c.*
                        From sr_crm_opportunitycycle_sel c
                        WHERE c.crm_opportunity_cycle_id='" . $attr['id'] . "' AND 
                              c.id = '$attr[child_id]' AND 
                              c.company_id='" . $this->arrUser['company_id'] . "' ";
        //c.crm_id='".$attr['crm_id']."' and

        //echo $Sql; exit;
        $attr['crm_opportunity_cycle_id'] = $attr['id'];

        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, $moduleForPermission, sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }


            $attr['history'] = 'history';

            $Row['tabsDetail'] = self::get_crm_opportunity_cycle_detail($attr);

            $Row['date_added'] = $this->objGeneral->convert_unix_into_date($Row['date_added']);
            $Row['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
            $Row['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
            $Row['expected_close_date'] = $this->objGeneral->convert_unix_into_date($Row['expected_close_date']);

            $Row['stage_change'] = $custom_find;

            $attr['module_type'] = 1;
            $Row['alt_contacts'] = self::get_alt_contacts_list($attr);
            $Row['process_of_decission'] = self::get_process_of_decision($attr);
            $Row['stages'] = self::get_opportunity_cycle_tabs($attr);
            $Row['job_titles'] = self::get_job_title($attr);

            $attr['id'] = $attr['child_id'];
            $Row['saleperson'] = self::get_opp_cycle_salesperson($attr);
            $Row['supportperson'] = self::get_opp_cycle_support_staff($attr);

            $attr['id'] = $attr['crm_id'];
            $Row['crmsaleperson'] = self::getCRMSalespersons($attr);

            $Row['employees'] = $this->objHr->get_employees();

            //print_r($Row);exit;

            $response['response'] = $Row;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
            return $response;
        }
        //echo "<pre>";print_r($attr);exit;

        $response['response']['stagesStatus'] = self::getOpportunityCycleStagesStatus($attr);

        $response['ack'] = 1;
        $response['error'] = NULL;
        return $response;
    }

    function get_crm_opportunity_cycle_by_type($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $custom_find = 0;

        $Sql = "SELECT c.* 
                FROM crm_opportunity_cycle c  
                where  c.id='$attr[crm_opportunity_cycle_id]' AND 
                       c.tab_id='" . $attr['type'] . "'   AND 
                       c.company_id=" . $this->arrUser['company_id'] . "
                LIMIT 1";

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() == 0) {
            $custom_find = 1;
            $Sql = "SELECT c.*   FROM crm_opportunity_cycle c  
                    where  c.id='$attr[crm_opportunity_cycle_id]' AND c.company_id=" . $this->arrUser['company_id'] . " 
                    LIMIT 1";
            $RS = $this->objsetup->CSI($Sql);
        }

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $Row['stage_change'] = $custom_find;

            $Row['date_added'] = $this->objGeneral->convert_unix_into_date($Row['date_added']);
            $Row['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
            $Row['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
            $Row['expected_close_date'] = $this->objGeneral->convert_unix_into_date($Row['expected_close_date']);


            $response['response'] = $Row;

            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            //$response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        // print_r($response);exit;

        return $response;
    }

    function get_crm_opportunity_cycle_detail($attr, $type = null)
    {
        $order_type = "";
        $response = "";

        if (!empty($type))
            $alias = "opp.ids";
        else if (!empty($attr['history'])) {
            $alias = "opp.crm_opportunity_cycle_id";
            $wherehistory = "and opp.is_complete=1";
        } else
            $alias = "opp.id";
        //order by st.id DESC

        $moduleForPermission = $this->objsetup->moduleDecider(1, $attr['crm_id']);

        if ($moduleForPermission == 'crm') $moduleForPermission = $moduleForPermission . "_oopCycle_tab";
        else $moduleForPermission = $moduleForPermission . "_oop_cycletab";

        $Sql = "SELECT  opp.*
                from sr_crm_opportunitycycle_details_sel opp
                WHERE $alias='" . $attr['id'] . "' AND opp.company_id=" . $this->arrUser['company_id'] . "  $wherehistory";

        // echo $Sql; exit;

        if (!empty($type))
            $total_limit = 1;  //$order_type="Order by opp.id DESC  ";
        else
            $total_limit = pagination_limit;



        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'opp', $order_type);
        // echo $response['q'];exit;

        // $RS = $this->objsetup->CSI($response['q']);
        $RS = $this->objsetup->CSI($response['q'], $moduleForPermission, sr_ViewPermission);

        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                if (($Row['statuss']) == 0)
                    $Row['stagename'] = $Row['stagename'] . ' - InActive';

                $Row['stageNumber'] = '';
                $Row['history'] = '1';
                $Row['date_added'] = $this->objGeneral->convert_unix_into_date($Row['date_added']);
                $Row['opp_date_added'] = $this->objGeneral->convert_unix_into_date($Row['opp_date_added']);

                $Row['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
                $Row['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                $Row['expected_close_date'] = $this->objGeneral->convert_unix_into_date($Row['expected_close_date']);

                $response['response'][] = $Row;
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

    function get_crm_opportunityCycleStageListing($attr, $type)
    {
        $moduleForPermission = $this->objsetup->moduleDecider(1, $attr['value']);

        if ($moduleForPermission == 'crm') $moduleForPermission = $moduleForPermission . "_oopCycle_tab";
        else $moduleForPermission = $moduleForPermission . "_oop_cycletab";

        $Sql = "SELECT  opp.*
                from sr_crm_opportunitycycle_details_sel opp
                WHERE opp.ids='" . $attr['id'] . "' AND opp.company_id=" . $this->arrUser['company_id'] . " ORDER BY opp.id DESC LIMIT 1";

        // echo $Sql; exit;
        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, $moduleForPermission, sr_ViewPermission);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                if (($Row['statuss']) == 0)
                    $Row['stagename'] = $Row['stagename'] . ' - InActive';

                $Row['stageNumber'] = '';
                $Row['history'] = '1';
                $Row['date_added'] = $this->objGeneral->convert_unix_into_date($Row['date_added']);
                $Row['opp_date_added'] = $this->objGeneral->convert_unix_into_date($Row['opp_date_added']);

                $Row['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
                $Row['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                $Row['expected_close_date'] = $this->objGeneral->convert_unix_into_date($Row['expected_close_date']);

                $response['response'][] = $Row;
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

    function add_crm_opportunity_cycle($attr)
    {
        $moduleForPermission = $this->objsetup->moduleDecider(1, $attr['crm_id']);

        if ($moduleForPermission == 'crm') $moduleForPermission = $moduleForPermission . "_oopCycle_tab";
        else $moduleForPermission = $moduleForPermission . "_oop_cycletab";

        $this->objGeneral->mysql_clean($attr);

        $mainSql = "INSERT INTO crm_opportunity_cycle
                                    SET
                                        crm_id = '" . $attr['crm_id'] . "' ,
                                        oop_code = '" . $attr['oop_code'] . "' ,
                                        name = '" . $attr['name'] . "' ,
                                        user_id='" . $this->arrUser['id'] . "',
                                        company_id='" . $this->arrUser['company_id'] . "' ,
                                        date_added='" . current_date . "' ";

        // $mRS = $this->objsetup->CSI($mainSql);
        $mRS = $this->objsetup->CSI($mainSql, $moduleForPermission, sr_AddPermission);

        $mId = $this->Conn->Insert_ID();

        if ($mId > 0) {

            $attr['crm_opportunity_cycle_id'] = $mId;
            $resp = self::add_crm_opportunity_cycle_details($attr);
            // print_r($resp);
            $response['child'] = $resp['id'];
            $response['stagesStatus'] = $resp['stagesStatus'];
            $response['id'] = $mId;

            $response['ack'] = 1;
            $response['edit'] = 0;
            $response['error'] = NULL;
        } else {
            $response['id'] = 0;
            $response['ack'] = 0;
            $response['edit'] = 0;
            $response['error'] = 'Record not inserted!';
        }

        return $response;
    }

    function add_crm_opportunity_cycle_details($attr)
    {
        //echo "<pre>";print_r($attr); exit;
        $moduleForPermission = $this->objsetup->moduleDecider(1, $attr['crm_id']);

        if ($moduleForPermission == 'crm') $moduleForPermission = $moduleForPermission . "_oopCycle_tab";
        else $moduleForPermission = $moduleForPermission . "_oop_cycletab";


        $attr_array = $attr;
        $attr_array = (array) $attr_array;

        $this->objGeneral->mysql_clean($attr);

        if ($attr['frequency_ids'] != 1 && $attr['frequency_ids'] != 2) {

            $equalSpread = 0;
            $freqJanuary = 0;
            $freqFebruary = 0;
            $freqMarch = 0;
            $freqApril = 0;
            $freqMay = 0;
            $freqJune = 0;
            $freqJuly = 0;
            $freqAugust = 0;
            $freqSeptember = 0;
            $freqOctober = 0;
            $freqNovember = 0;
            $freqDecember = 0;
            $freqStartmonth = 0;
            $freqFirstQuartermonth = 0;
            $freqSecondQuartermonth = 0;
            $freqThirdQuartermonth = 0;
        } else {

            $equalSpread = (isset($attr['recfrequeny']->equalSpread) && $attr['recfrequeny']->equalSpread != "") ? $attr['recfrequeny']->equalSpread : 0;
            $freqJanuary = (isset($attr['recfrequeny']->monthlySpreadArr->January) && $attr['recfrequeny']->monthlySpreadArr->January != "") ? $attr['recfrequeny']->monthlySpreadArr->January : 0;
            $freqFebruary = (isset($attr['recfrequeny']->monthlySpreadArr->February) && $attr['recfrequeny']->monthlySpreadArr->February != "") ? $attr['recfrequeny']->monthlySpreadArr->February : 0;
            $freqMarch = (isset($attr['recfrequeny']->monthlySpreadArr->March) && $attr['recfrequeny']->monthlySpreadArr->March != "") ? $attr['recfrequeny']->monthlySpreadArr->March : 0;
            $freqApril = (isset($attr['recfrequeny']->monthlySpreadArr->April) && $attr['recfrequeny']->monthlySpreadArr->April != "") ? $attr['recfrequeny']->monthlySpreadArr->April : 0;
            $freqMay = (isset($attr['recfrequeny']->monthlySpreadArr->May) && $attr['recfrequeny']->monthlySpreadArr->May != "") ? $attr['recfrequeny']->monthlySpreadArr->May : 0;
            $freqJune = (isset($attr['recfrequeny']->monthlySpreadArr->June) && $attr['recfrequeny']->monthlySpreadArr->June != "") ? $attr['recfrequeny']->monthlySpreadArr->June : 0;
            $freqJuly = (isset($attr['recfrequeny']->monthlySpreadArr->July) && $attr['recfrequeny']->monthlySpreadArr->July != "") ? $attr['recfrequeny']->monthlySpreadArr->July : 0;
            $freqAugust = (isset($attr['recfrequeny']->monthlySpreadArr->August) && $attr['recfrequeny']->monthlySpreadArr->August != "") ? $attr['recfrequeny']->monthlySpreadArr->August : 0;
            $freqSeptember = (isset($attr['recfrequeny']->monthlySpreadArr->September) && $attr['recfrequeny']->monthlySpreadArr->September != "") ? $attr['recfrequeny']->monthlySpreadArr->September : 0;
            $freqOctober = (isset($attr['recfrequeny']->monthlySpreadArr->October) && $attr['recfrequeny']->monthlySpreadArr->October != "") ? $attr['recfrequeny']->monthlySpreadArr->October : 0;
            $freqNovember = (isset($attr['recfrequeny']->monthlySpreadArr->November) && $attr['recfrequeny']->monthlySpreadArr->November != "") ? $attr['recfrequeny']->monthlySpreadArr->November : 0;
            $freqDecember = (isset($attr['recfrequeny']->monthlySpreadArr->December) && $attr['recfrequeny']->monthlySpreadArr->December != "") ? $attr['recfrequeny']->monthlySpreadArr->December : 0;
            $freqStartmonth = (isset($attr['recfrequeny']->startmonths) && $attr['recfrequeny']->startmonths != "") ? $attr['recfrequeny']->startmonths : 0;
            $freqFirstQuartermonth = (isset($attr['recfrequeny']->firstquarter) && $attr['recfrequeny']->firstquarter != "") ? $attr['recfrequeny']->firstquarter : 0;
            $freqSecondQuartermonth = (isset($attr['recfrequeny']->secondquarter) && $attr['recfrequeny']->secondquarter != "") ? $attr['recfrequeny']->secondquarter : 0;
            $freqThirdQuartermonth = (isset($attr['recfrequeny']->thirdquarter) && $attr['recfrequeny']->eqthirdquarterualSpread != "") ? $attr['recfrequeny']->thirdquarter : 0;
        }

        //$this->objGeneral->mysql_clean($attr);

        $end_date = $this->objGeneral->convert_date($attr['end_date']);
        $start_date = $this->objGeneral->convert_date($attr['start_date']);
        $date_added = $this->objGeneral->convert_date($attr['date_added']);
        $complete_date = $this->objGeneral->convert_date($attr['complete_date']);
        $expected_close_date = $this->objGeneral->convert_date($attr['expected_close_date']);

        // subject = '$attr[subject]',
        /* crm_id = '".$attr['crm_id']."',*/
        $currency_id = (isset($attr['currency_id']) && $attr['currency_id']->id != "") ? $attr['currency_id']->id : '0';
        $contact_person_1 = (isset($attr['contact_person_1']) && $attr['contact_person_1'] != "") ? $attr['contact_person_1'] : '0';
        $contact_person_2 = (isset($attr['contact_person_2']) && $attr['contact_person_2'] != "") ? $attr['contact_person_2'] : '0';
        $contact_person_3 = (isset($attr['contact_person_3']) && $attr['contact_person_3'] != "") ? $attr['contact_person_3'] : '0';

        $role_1 = (isset($attr['role_1']) && $attr['role_1'] != "") ? $attr['role_1'] : '0';
        $role_2 = (isset($attr['role_2']) && $attr['role_2'] != "") ? $attr['role_2'] : '0';
        $role_3 = (isset($attr['role_3']) && $attr['role_3'] != "") ? $attr['role_3'] : '0';

        $stage_ids = (isset($attr['stage_ids']) && $attr['stage_ids'] != "") ? $attr['stage_ids'] : '0';
        $final_steps = (isset($attr['final_steps']) && $attr['final_steps'] != "") ? $attr['final_steps'] : '0';
        $frequency_ids = (isset($attr['frequency_ids']) && $attr['frequency_ids'] != "") ? $attr['frequency_ids'] : '0';
        $process_of_decision = (isset($attr['process_of_decision']) && $attr['process_of_decision'] != "") ? $attr['process_of_decision'] : '0';
        $percentage_stage = (isset($attr['stage_id']->percentage) && $attr['stage_id']->percentage != "") ? $attr['stage_id']->percentage : '0';

        $crm_opportunity_cycle_id = $attr['crm_opportunity_cycle_id'];

        $sql_total = "SELECT  count(tst.id) as total	
                      FROM crm_opportunity_cycle_detail as tst
                      WHERE tst.is_complete!=1 AND 
                            tst.stage_id!='" . $stage_ids . "' AND
                            tst.crm_opportunity_cycle_id = '" . $crm_opportunity_cycle_id . "' AND  
                            tst.company_id=" . $this->arrUser['company_id'] . "
                      Limit 1";
        // echo $sql_total;exit;

        $rs_count = $this->objsetup->CSI($sql_total);

        if ($rs_count->fields['total'] > 0) {
            $response['ack'] = 0;
            $response['error'] = 'First complete the opened stage!';
            return $response;
        }

        $mainSql = "INSERT INTO crm_opportunity_cycle_detail
                                SET
                                  forecast_amount = '" . $attr['forecast_amount'] . "',
                                  stage_id = '" . $stage_ids . "',
                                  process_of_decision = '" . $process_of_decision . "',
                                  contact_person_1 = '" . $contact_person_1 . "',
                                  contact_person_2 = '" . $contact_person_2 . "',
                                  contact_person_3 = '" . $contact_person_3 . "',
                                  role_1 = '" . $role_1 . "',
                                  role_2 = '" . $role_2 . "',
                                  role_3 = '" . $role_3 . "',
                                  description = '" . $attr['description'] . "',
                                  outcome = '" . $attr['outcome'] . "',
                                  percentage_stage =  '" . $percentage_stage . "',
                                  currency_id = '" . $currency_id . "',
                                  convert_amount = '$attr[convert_amount]',
                                  start_date = '" . $start_date . "',
                                  end_date = '" . $end_date . "',
                                  expected_close_date = '" . $expected_close_date . "',
                                  tab_id = '" . $attr['stage_ids'] . "',
                                  crm_opportunity_cycle_id = '$attr[crm_opportunity_cycle_id]',
                                  probability = '$attr[probability]',
                                  user_id='" . $this->arrUser['id'] . "',
                                  company_id='" . $this->arrUser['company_id'] . "',
                                  date_added='" . $date_added . "',
                                  final_step = '" . $final_steps . "',
                                  notes = '$attr[notes]',
                                  frequencyID = '" . $frequency_ids . "',
                                  equalSpread = '" . $equalSpread . "',
                                    freqJanuary = '" . $freqJanuary . "',
                                    freqFebruary = '" . $freqFebruary . "',
                                    freqMarch = '" . $freqMarch . "',
                                    freqApril = '" . $freqApril . "',
                                    freqMay = '" . $freqMay . "',
                                    freqJune = '" . $freqJune . "',
                                    freqJuly = '" . $freqJuly . "',
                                    freqAugust = '" . $freqAugust . "',
                                    freqSeptember = '" . $freqSeptember . "',
                                    freqOctober = '" . $freqOctober . "',
                                    freqNovember = '" . $freqNovember . "',
                                    freqDecember = '" . $freqDecember . "',
                                    freqStartmonth = '" . $freqStartmonth . "',
                                    freqFirstQuartermonth = '" . $freqFirstQuartermonth . "',
                                    freqSecondQuartermonth = '" . $freqSecondQuartermonth . "',
                                    freqThirdQuartermonth = '" . $freqThirdQuartermonth . "'";
        /* 
                                  contact_id = '$attr[contact_id]', */

        // echo $mainSql . "<hr>";  exit;
        /*current_status = '$attr[current_statuss]',*/

        // $dRS = $this->objsetup->CSI($mainSql);
        $dRS = $this->objsetup->CSI($mainSql, $moduleForPermission, sr_AddPermission);



        $dId = $this->Conn->Insert_ID();

        if ($dId > 0) {
            $response['id'] = $dId;
            $response['ack'] = 1;
            $response['edit'] = 0;
            $response['error'] = NULL;

            $attr_array['supportstaff'] = $attr_array['salespersons_support'];

            $attr_array['id'] = $dId;
            $sqlSalesperson = self::add_opp_cycle_salesperson($attr_array);
            $sqlSupportStaff = self::add_opp_cycle_SupportStaff($attr_array);

            $response['stagesStatus'] = self::getOpportunityCycleStagesStatus($attr_array);
        } else {
            $response['id'] = 0;
            $response['ack'] = 0;
            $response['edit'] = 0;
            $response['error'] = 'Record not inserted!';
        }

        return $response;
    }

    function update_crm_opportunity_cycle($attr)
    {
        $moduleForPermission = $this->objsetup->moduleDecider(1, $attr['value']);

        if ($moduleForPermission == 'crm') $moduleForPermission = $moduleForPermission . "_oopCycle_tab";
        else $moduleForPermission = $moduleForPermission . "_oop_cycletab";

        $contact_person_1 = (isset($attr['contact_person_1']) && $attr['contact_person_1'] != "") ? $attr['contact_person_1'] : '0';
        $contact_person_2 = (isset($attr['contact_person_2']) && $attr['contact_person_2'] != "") ? $attr['contact_person_2'] : '0';
        $contact_person_3 = (isset($attr['contact_person_3']) && $attr['contact_person_3'] != "") ? $attr['contact_person_3'] : '0';

        $role_1 = (isset($attr['role_1']) && $attr['role_1'] != "") ? $attr['role_1'] : '0';
        $role_2 = (isset($attr['role_2']) && $attr['role_2'] != "") ? $attr['role_2'] : '0';
        $role_3 = (isset($attr['role_3']) && $attr['role_3'] != "") ? $attr['role_3'] : '0';

        $process_of_decision = (isset($attr['process_of_decision']) && $attr['process_of_decision'] != "") ? $attr['process_of_decision'] : '0';
        $stage_ids = (isset($attr['stage_ids']) && $attr['stage_ids'] != "") ? $attr['stage_ids'] : '0';

        $currency_id = (isset($attr['currency_id']) && $attr['currency_id']->id != "") ? $attr['currency_id']->id : '0';

        //subject = '$attr[subject]',
        // $this->objGeneral->mysql_clean($attr);
        $mainSql = "UPDATE crm_opportunity_cycle_detail 
                                                SET 
                                                    forecast_amount = '" . $attr['forecast_amount'] . "',
                                                    stage_id = '" . $stage_ids . "', 
                                                    process_of_decision = '" . $process_of_decision . "',
                                                    contact_person_1 = '" . $contact_person_1 . "',
                                                    contact_person_2 = '" . $contact_person_2 . "',
                                                    contact_person_3 = '" . $contact_person_3 . "',
                                                    role_1 = '" . $role_1 . "',
                                                    role_2 = '" . $role_2 . "',
                                                    role_3 = '" . $role_3 . "',
                                                    description = '" . $attr['description'] . "',
                                                    outcome = '" . $attr['outcome'] . "',
                                                    currency_id = '" . $currency_id . "' ,
                                                    convert_amount = '" . $attr['convert_amount'] . "' 
                                                    WHERE id = " . $attr['id'] . " 
                                                    limit 1";

        $this->objsetup->CSI($mainSql);

        if ($this->Conn->Affected_Rows() > 0) {

            $response['ack'] = 1;
            $response['edit'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['edit'] = 0;
            $response['error'] = 'Record can\'t be updated!';
        }
        $response['ack'] = 1;
        $response['edit'] = 1;
        return $response;
    }

    function update_crm_opportunity_cycle_details($attr)
    {
        // $this->objGeneral->mysql_clean($attr);
        // echo "<pre>";print_r($attr); exit;
        $moduleForPermission = $this->objsetup->moduleDecider(1, $attr['crm_id']);

        if ($moduleForPermission == 'crm') $moduleForPermission = $moduleForPermission . "_oopCycle_tab";
        else $moduleForPermission = $moduleForPermission . "_oop_cycletab";


        // $attr_array = $attr;
        // $attr_array = (array)$attr_array;

        $this->objGeneral->mysql_clean($attr);

        if ($attr['frequency_ids'] != 1 && $attr['frequency_ids'] != 2) {

            $equalSpread = 0;
            $freqJanuary = 0;
            $freqFebruary = 0;
            $freqMarch = 0;
            $freqApril = 0;
            $freqMay = 0;
            $freqJune = 0;
            $freqJuly = 0;
            $freqAugust = 0;
            $freqSeptember = 0;
            $freqOctober = 0;
            $freqNovember = 0;
            $freqDecember = 0;
            $freqStartmonth = 0;
            $freqFirstQuartermonth = 0;
            $freqSecondQuartermonth = 0;
            $freqThirdQuartermonth = 0;
        } else {

            $equalSpread = (isset($attr['recfrequeny']->equalSpread) && $attr['recfrequeny']->equalSpread != "") ? $attr['recfrequeny']->equalSpread : 0;
            $freqJanuary = (isset($attr['recfrequeny']->monthlySpreadArr->January) && $attr['recfrequeny']->monthlySpreadArr->January != "") ? $attr['recfrequeny']->monthlySpreadArr->January : 0;
            $freqFebruary = (isset($attr['recfrequeny']->monthlySpreadArr->February) && $attr['recfrequeny']->monthlySpreadArr->February != "") ? $attr['recfrequeny']->monthlySpreadArr->February : 0;
            $freqMarch = (isset($attr['recfrequeny']->monthlySpreadArr->March) && $attr['recfrequeny']->monthlySpreadArr->March != "") ? $attr['recfrequeny']->monthlySpreadArr->March : 0;
            $freqApril = (isset($attr['recfrequeny']->monthlySpreadArr->April) && $attr['recfrequeny']->monthlySpreadArr->April != "") ? $attr['recfrequeny']->monthlySpreadArr->April : 0;
            $freqMay = (isset($attr['recfrequeny']->monthlySpreadArr->May) && $attr['recfrequeny']->monthlySpreadArr->May != "") ? $attr['recfrequeny']->monthlySpreadArr->May : 0;
            $freqJune = (isset($attr['recfrequeny']->monthlySpreadArr->June) && $attr['recfrequeny']->monthlySpreadArr->June != "") ? $attr['recfrequeny']->monthlySpreadArr->June : 0;
            $freqJuly = (isset($attr['recfrequeny']->monthlySpreadArr->July) && $attr['recfrequeny']->monthlySpreadArr->July != "") ? $attr['recfrequeny']->monthlySpreadArr->July : 0;
            $freqAugust = (isset($attr['recfrequeny']->monthlySpreadArr->August) && $attr['recfrequeny']->monthlySpreadArr->August != "") ? $attr['recfrequeny']->monthlySpreadArr->August : 0;
            $freqSeptember = (isset($attr['recfrequeny']->monthlySpreadArr->September) && $attr['recfrequeny']->monthlySpreadArr->September != "") ? $attr['recfrequeny']->monthlySpreadArr->September : 0;
            $freqOctober = (isset($attr['recfrequeny']->monthlySpreadArr->October) && $attr['recfrequeny']->monthlySpreadArr->October != "") ? $attr['recfrequeny']->monthlySpreadArr->October : 0;
            $freqNovember = (isset($attr['recfrequeny']->monthlySpreadArr->November) && $attr['recfrequeny']->monthlySpreadArr->November != "") ? $attr['recfrequeny']->monthlySpreadArr->November : 0;
            $freqDecember = (isset($attr['recfrequeny']->monthlySpreadArr->December) && $attr['recfrequeny']->monthlySpreadArr->December != "") ? $attr['recfrequeny']->monthlySpreadArr->December : 0;
            $freqStartmonth = (isset($attr['recfrequeny']->startmonths) && $attr['recfrequeny']->startmonths != "") ? $attr['recfrequeny']->startmonths : 0;
            $freqFirstQuartermonth = (isset($attr['recfrequeny']->firstquartermonth) && $attr['recfrequeny']->firstquartermonth != "") ? $attr['recfrequeny']->firstquartermonth : 0;
            $freqSecondQuartermonth = (isset($attr['recfrequeny']->secondquartermonth) && $attr['recfrequeny']->secondquartermonth != "") ? $attr['recfrequeny']->secondquartermonth : 0;
            $freqThirdQuartermonth = (isset($attr['recfrequeny']->thirdquartermonth) && $attr['recfrequeny']->thirdquartermonth != "") ? $attr['recfrequeny']->thirdquartermonth : 0;
        }

        $end_date = $this->objGeneral->convert_date($attr['end_date']);
        $start_date = $this->objGeneral->convert_date($attr['start_date']);
        $complete_date = $this->objGeneral->convert_date($attr['complete_date']);
        $expected_close_date = $this->objGeneral->convert_date($attr['expected_close_date']);

        $contact_person_1 = (isset($attr['contact_person_1']) && $attr['contact_person_1'] != "") ? $attr['contact_person_1'] : '0';
        $contact_person_2 = (isset($attr['contact_person_2']) && $attr['contact_person_2'] != "") ? $attr['contact_person_2'] : '0';
        $contact_person_3 = (isset($attr['contact_person_3']) && $attr['contact_person_3'] != "") ? $attr['contact_person_3'] : '0';

        $role_1 = (isset($attr['role_1']) && $attr['role_1'] != "") ? $attr['role_1'] : '0';
        $role_2 = (isset($attr['role_2']) && $attr['role_2'] != "") ? $attr['role_2'] : '0';
        $role_3 = (isset($attr['role_3']) && $attr['role_3'] != "") ? $attr['role_3'] : '0';

        $stage_ids = (isset($attr['stage_ids']) && $attr['stage_ids'] != "") ? $attr['stage_ids'] : '0';
        $final_steps = (isset($attr['final_steps']) && $attr['final_steps'] != "") ? $attr['final_steps'] : '0';
        $currency_id = (isset($attr['currency_id']) && $attr['currency_id']->id != "") ? $attr['currency_id']->id : '0';
        $frequency_ids = (isset($attr['frequency_ids']) && $attr['frequency_ids'] != "") ? $attr['frequency_ids'] : '0';
        $percentageStage = (isset($attr['stage_id']->percentage) && $attr['stage_id']->percentage != "") ? $attr['stage_id']->percentage : '0';
        $process_of_decision = (isset($attr['process_of_decision']) && $attr['process_of_decision'] != "") ? $attr['process_of_decision'] : '0';

        $crm_opportunity_cycle_id = $attr['crm_opportunity_cycle_id'];

        $sql_total = "SELECT  count(tst.id) as total	
                      FROM crm_opportunity_cycle_detail as tst
                      WHERE tst.is_complete!=1 AND 
                            tst.stage_id!='" . $stage_ids . "' AND
                            tst.crm_opportunity_cycle_id = '" . $crm_opportunity_cycle_id . "' AND  
                            tst.company_id=" . $this->arrUser['company_id'] . "
                      Limit 1";
        // echo $sql_total;exit;

        $rs_count = $this->objsetup->CSI($sql_total);

        if ($rs_count->fields['total'] > 0) {
            $response['ack'] = 0;
            $response['error'] = 'First complete the opened stage!';
            return $response;
        }

        $detailSql = "UPDATE crm_opportunity_cycle_detail
                                SET
                                      forecast_amount = '" . $attr['forecast_amount'] . "',
                                      stage_id = '" . $stage_ids . "',
                                      process_of_decision = '" . $process_of_decision . "',
                                      contact_person_1 = '" . $contact_person_1 . "',
                                      contact_person_2 = '" . $contact_person_2 . "',
                                      contact_person_3 = '" . $contact_person_3 . "',
                                      role_1 = '" . $role_1 . "',
                                      role_2 = '" . $role_2 . "',
                                      role_3 = '" . $role_3 . "',
                                      description = '" . $attr['description'] . "',
                                      outcome = '" . $attr['outcome'] . "',
                                      percentage_stage =  '" . $percentageStage . "' ,
                                      currency_id = '" . $currency_id . "',
                                      convert_amount = '" . $attr['convert_amount'] . "',
                                      start_date = '" . $start_date . "',
                                      end_date = '" . $end_date . "',
                                      expected_close_date = '" . $expected_close_date . "',
                                      is_complete = '" . $attr['is_complete'] . "',
                                      complete_date = '" . $complete_date . "' ,
                                      probability = '" . $attr['probability'] . "',
                                      final_step = '" . $final_steps . "',
                                      notes = '" . $attr['notes'] . "',
                                      frequencyID = '" . $frequency_ids . "',
                                      equalSpread = '" . $equalSpread . "',
                                      freqJanuary = '" . $freqJanuary . "',
                                      freqFebruary = '" . $freqFebruary . "',
                                      freqMarch = '" . $freqMarch . "',
                                      freqApril = '" . $freqApril . "',
                                      freqMay = '" . $freqMay . "',
                                      freqJune = '" . $freqJune . "',
                                      freqJuly = '" . $freqJuly . "',
                                      freqAugust = '" . $freqAugust . "',
                                      freqSeptember = '" . $freqSeptember . "',
                                      freqOctober = '" . $freqOctober . "',
                                      freqNovember = '" . $freqNovember . "',
                                      freqDecember = '" . $freqDecember . "',
                                      freqStartmonth = '" . $freqStartmonth . "',
                                      freqFirstQuartermonth = '" . $freqFirstQuartermonth . "',
                                      freqSecondQuartermonth = '" . $freqSecondQuartermonth . "',
                                      freqThirdQuartermonth = '" . $freqThirdQuartermonth . "'
                                      WHERE id = $attr[did] 
                                      limit 1 ";

        /*
        contact_id = '$attr[contact_id]',
        crm_id = '".$attr['crm_id']."',
        subject = '$attr[subject]',
        probability_type = '".$attr['probability_type']."'  ,*/

        // echo $detailSql; exit;     

        // $this->objsetup->CSI($detailSql);

        $RS = $this->objsetup->CSI($detailSql, "crm_oopCycle_tab", sr_EditPermission);

        $attr1['crm_id'] = $attr['crm_id'];
        $attr1['id'] = $attr['id'];
        $attr1['opp_cycle_id'] = $attr['crm_opportunity_cycle_id'];
        $attr1['tab_id'] = $attr['stage_ids'];
        $attr1['salespersons'] = $attr['salespersons'];
        $attr1['supportstaff'] = $attr['salespersons_support'];

        $sqlSalesperson = self::add_opp_cycle_salesperson($attr1);
        $sqlSupportStaff = self::add_opp_cycle_SupportStaff($attr1);
        $response['stagesStatus'] = self::getOpportunityCycleStagesStatus($attr);

        if ($this->Conn->Affected_Rows() > 0) {

            $response['ack'] = 1;
            $response['edit'] = 0;
            $response['error'] = NULL;
        } else {

            $response['ack'] = 0;
            $response['edit'] = 1;
            $response['error'] = 'Record Updated Successfully';
        }

        return $response;
    }

    function delete_crm_opportunity_cycle($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $moduleForPermission = $this->objsetup->moduleDecider(1, $attr['crm_id']);

        if ($moduleForPermission == 'crm') $moduleForPermission = $moduleForPermission . "_oopCycle_tab";
        else $moduleForPermission = $moduleForPermission . "_oop_cycletab";

        //    $Sql = "Update crm_opportunity_cycle 
        //                                    set 
        //                                        status=0 
        //                                    WHERE id = '".$attr['id']."' AND 
        //                                          company_id='" . $this->arrUser['company_id'] . "'";
        $Sql = "UPDATE crm_opportunity_cycle coc 
                JOIN crm_opportunity_cycle_detail cocd ON cocd.crm_opportunity_cycle_id = coc.id 
                SET coc.ChangedOn = UNIX_TIMESTAMP (NOW()),  
                    coc.ChangedBy = " . $this->arrUser['id'] . ", 
                    coc.status=0 
                WHERE coc.id = '" . $attr['id'] . "' AND 
                      coc.company_id='" . $this->arrUser['company_id'] . "' AND 
                      cocd.is_complete = 0";

        // echo $Sql; exit; // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, $moduleForPermission, sr_DeletePermission);


        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        }

        return $response;
    }

    function complete_crm_opportunity_cycle($attr)
    {
        $moduleForPermission = $this->objsetup->moduleDecider(1, $attr['crm_id']);

        if ($moduleForPermission == 'crm') $moduleForPermission = $moduleForPermission . "_oopCycle_tab";
        else $moduleForPermission = $moduleForPermission . "_oop_cycletab";

        //final_step //notes
        $this->objGeneral->mysql_clean($attr);
        $Sql = "UPDATE crm_opportunity_cycle_detail 
                                        SET 
                                            complete_date = '" . current_date . "' ,  
                                            is_complete = '1' ,
                                            end_date = '" . $this->objGeneral->convert_date($attr['end_date']) . "' 
                                        WHERE crm_opportunity_cycle_id = '" . $attr['id'] . "' AND 
                                              tab_id = '" . $attr['tab_id'] . "'   AND 
                                              company_id='" . $this->arrUser['company_id'] . "'  
                                        limit 1";

        //  echo $Sql."<hr>"; exit;
        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, $moduleForPermission, sr_EditPermission);


        $attr['crm_id'] = $attr['crm_id'];
        $attr['crm_opportunity_cycle_id'] = $attr['id'];

        if ($this->Conn->Affected_Rows() > 0) {

            $Sql2 = "UPDATE crm_opportunity_cycle 
                                        SET  
                                            stageComplete = '1'
                                        WHERE id = '" . $attr['id'] . "' ";

            //  echo $Sql2."<hr>"; exit;
            $RS2 = $this->objsetup->CSI($Sql2);


            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['stagesStatus'] = self::getOpportunityCycleStagesStatus($attr);
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be updated!';
        }

        return $response;
    }

    function get_all_opportunity_cycle($attr)
    {
        $Sql = "SELECT oppmain.id,oppmain.oop_code,oppmain.name,oppmain.date_added,oppmain.crm_id, c.type AS crm_type,
                (CASE
                    WHEN c.type = 1 THEN
                        c.crm_code
                    ELSE
                        c.customer_code
                END) AS code,
                        (SELECT COUNT(id) FROM crm_opportunity_cycle_detail 
                         WHERE crm_opportunity_cycle_id = oppmain.id AND is_complete = 1 AND 
                               company_id = " . $this->arrUser['company_id'] . " ) AS stageComplete
                FROM crm_opportunity_cycle as oppmain, crm as c
                where c.id = oppmain.crm_id AND oppmain.status=1 and oppmain.company_id=" . $this->arrUser['company_id'] . " ";

        //  echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['opp_code'] = $Row['oop_code'];
                $result['code'] = $Row['code'];
                $result['name'] = $Row['name'];
                $result['stageComplete'] = $Row['stageComplete'];
                $result['crm_id'] = $Row['crm_id'];
                $result['value'] = $Row['crm_id'];
                $result['crm_type'] = $Row['crm_type'];

                $result2 = array();

                // $result2 = $this->get_crm_opportunity_cycle_detail($result, 1);
                $result2 = $this->get_crm_opportunityCycleStageListing($result, 1);
                if (count($result2) > 0) {

                    $result['child_id'] = $result2['response'][0]['id'];
                    /*$result['name'] = $result2[response][0]['subject'];*/
                    $result['forecast_amount'] = $result2['response'][0]['forecast_amount'];
                    // $result['start_date'] = $this->objGeneral->convert_unix_into_date($result2['start_date']);
                    //$result['due_date'] = $result2['due_date'];
                    // $result['end_date'] = $this->objGeneral->convert_unix_into_date($result2['end_date']);
                    $result['probability'] = $result2['response'][0]['probability'];
                    $result['expected_date'] = $result2['response'][0]['expected_close_date'];
                    $result['stage_id'] = $result2['response'][0]['tab_id'];
                    $result['stage'] = $result2['response'][0]['stagename'];
                    $result['is_complete'] = $result2['response'][0]['is_complete'];
                    $result['creation_date'] = $this->objGeneral->convert_unix_into_date($Row['date_added']);
                    //$result['date_added'] = $result2[response][0]['opp_date_added'];
                }


                $result['history'] = '';

                $response['response'][] = $result;
                $record['results'][] = $result;
            }
            $response['ack'] = 1;
        } else {
            $response['ack'] = 0;
            $response['response'][] = array();
        }

        return $response;
    }
    // Crm Promotions Module
    //----------------------------------------------------
    function get_crm_promotions($attr)
    {
        // global $objFilters;
        //  return $objFilters->get_module_listing(41, "crm_promotions", $attr[column], $attr[value]);

        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = "";
        $order_type = "";

        if (!empty($attr['value']))
            $where_clause = "AND c.crm_id =" . $attr['value'] . " ";

        $response = array();

        $Sql = "SELECT   c.* FROM  crm_promotions c
                JOIN company on company.id=c.company_id
                where  c.status=1 AND(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                        " . $where_clause . " ";

        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['start_Date'] = $this->objGeneral->convert_unix_into_date($Row['starting_date']);
                $result['end_Date'] = $this->objGeneral->convert_unix_into_date($Row['ending_date']);

                $response['response'][] = $result;
            }

            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        return $response;
    }

    function get_crm_promotion_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM crm_promotions
				WHERE id='" . $attr['id'] . "'
				LIMIT 1";
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $Row['ending_date'] = $this->objGeneral->convert_unix_into_date($Row['ending_date']);
            $Row['starting_date'] = $this->objGeneral->convert_unix_into_date($Row['starting_date']);

            $attr['type'] = 1;
            $Row['promotion_products'] = self::get_crm_promotion_products($attr);
            // echo "<pre>";print_r($Row);exit;
            $response['response'] = $Row;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_crm_promotion($attr)
    {
        $files = $attr['files'];
        $attr = $attr['frmData'];

        $new_file_name = '';
        if (isset($files["name"]) && $files["name"] != '') {
            $uploads_dir = UPLOAD_PATH . 'sales/crm/';
            //echo "Full Path = ".$uploads_dir.$new_file_name;exit;
            $tmp_name = $files["tmp_name"];
            $name = $files["name"];
            $explode_file = explode(".", $name);
            $new_file_name = mt_rand() . "." . $explode_file[1];
            // upload file
            $var_export = move_uploaded_file($tmp_name, $uploads_dir . $new_file_name);
        }

        if ($attr['id'] > 0)
            $update_check = "  AND tst.id <> '" . $attr['id'] . "'";

        $data_pass = "tst.description='" . $attr['description'] . "'  and tst.crm_id='" . $attr['crm_id'] . "'  $update_check  ";
        $total = $this->objGeneral->count_duplicate_in_sql('crm_promotions', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
        $offer_type = ($attr['offer_type']) ? $attr['offer_type'] : 0;
        $customer_type = ($attr['customer_type']) ? $attr['customer_type'] : 0;

        $Sql = "INSERT INTO crm_promotions
                              SET
                                    starting_date = '" . $this->objGeneral->convert_date($attr['starting_date']) . "',
                                    ending_date = '" . $this->objGeneral->convert_date($attr['ending_date']) . "',
                                    offer_type = '$offer_type',
                                    customer_type = '$customer_type',
                                    discount_type = '$attr[discount_type]',
                                    discount = '$attr[discount]',
                                    name = '" . $attr['name'] . "',
                                    file_title = '$attr[file_title]',
                                    file = '" . $new_file_name . "',
                                    description = '$attr[description]',
                                    crm_id = '" . $attr['crm_id'] . "',
                                    user_id='" . $this->arrUser['id'] . "',
                                    AddedBy='" . $this->arrUser['id'] . "',
                                    AddedOn= UNIX_TIMESTAMP (NOW()),
                                    ChangedBy='" . $this->arrUser['id'] . "',
                                    ChangedOn= UNIX_TIMESTAMP (NOW()),
                                    company_id='" . $this->arrUser['company_id'] . "'";
        // echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['edit'] = 0;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['id'] = 0;
            $response['edit'] = 0;
            $response['error'] = 'Record not inserted!';
        }

        return $response;
    }

    function update_crm_promotion($attr)
    {
        $files = $attr['files'];
        $attr = $attr['frmData'];
        //echo "<pre>"; print_r($attr);exit;

        $new_file_name = $attr['old_file'];
        //if(empty($attr[old_file]))  $new_file_name = $_FILES["file"]["name"];

        if (isset($files["name"]) && $files["name"] != '') {
            $uploads_dir = UPLOAD_PATH . 'sales/crm/';
            //echo "Full Path = ".$uploads_dir.$new_file_name;exit;
            $tmp_name = $files["tmp_name"];
            $name = $files["name"];
            $explode_file = explode(".", $name);
            $new_file_name = mt_rand() . "." . $explode_file[1];
            // upload file
            $var_export = move_uploaded_file($tmp_name, $uploads_dir . $new_file_name);
            if ($var_export) {
                unlink($uploads_dir . $attr['old_file']);
            }
        }

        if ($attr['id'] > 0)
            $update_check = "  AND tst.id <> '" . $attr['id'] . "'";

        $data_pass = "tst.description='" . $attr['description'] . "'  and tst.crm_id='" . $attr['crm_id'] . "'  $update_check  ";
        $total = $this->objGeneral->count_duplicate_in_sql('crm_promotions', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE crm_promotions
                          SET
                                starting_date = '" . $this->objGeneral->convert_date($attr['starting_date']) . "',
                                ending_date = '" . $this->objGeneral->convert_date($attr['ending_date']) . "',
                                offer_type = '$attr[offer_type]',
                                customer_type = '$attr[customer_type]',
                                discount_type = '$attr[discount_type]',
                                discount = '$attr[discount]',
                                name = '" . $attr['name'] . "',
                                file_title = '$attr[file_title]',
                                file = '" . $new_file_name . "',
                                description = '$attr[description]'
                                WHERE id = " . $attr['id'] . " limit 1";

        //echo $Sql."<hr>";exit;
        $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['edit'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['edit'] = 0;
            $response['error'] = 'Record can\'t be updated!';
        }
        return $response;
    }

    function delete_crm_promotion($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $uploads_dir = UPLOAD_PATH . 'sales/crm/';

        // $Sql = "SELECT * 	FROM crm_promotions WHERE id='".$attr['id']."' LIMIT 1";
        //$Row = $this->objsetup->CSI($Sql)->FetchRow();
        //if ($Row[file] != '')
        // unlink($uploads_dir . $Row[file]);

        $Sql = "update  crm_promotions  set status=0 WHERE id = " . $attr['id'] . " ";

        //echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        }

        return $response;
    }

    function get_crm_promotion_products($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = "";
        $order_type = "";
        $response = array();

        $Sql = "SELECT c.id, c.product_id FROM crm_promotions_items c WHERE  c.promotion_id = " . $attr['id'] . "";

        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //   echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            $arr_ids = array();
            $str_ids = '';
            while ($Row = $RS->FetchRow())
                $arr_ids[] = $Row['product_id'];

            $str_ids = implode(',', $arr_ids);

            if ($attr['type'] == 1) {
                $itemSql = "SELECT prod.id, prod.product_code, prod.description, prod.standard_price, brand.brandname, cat.name as category
                            FROM product as prod
                            LEFT JOIN brand ON brand.id = prod.brand_id
                            LEFT JOIN category as cat ON cat.id = prod.category_id
                            WHERE prod.id IN ($str_ids)";
            }
            if ($attr['type'] == 2) {
                $itemSql = "SELECT prod.id, prod.code, prod.description, prod.standard_price,brand.brandname,cat.name as category
                            FROM services as prod
                            LEFT JOIN brand ON brand.id = prod.brand_id
                            LEFT JOIN service_catagory as cat ON cat.id = prod.category_id
                            WHERE prod.id IN ($str_ids)";
            }

            $itemRS = $this->objsetup->CSI($itemSql);


            if ($itemRS->RecordCount() > 0) {
                while ($Row = $itemRS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['category'] = $Row['category'];
                    $result['code.'] = $attr['type'] == 1 ? $Row['product_code'] : $Row['code'];
                    $result['description'] = $Row['description'];
                    $result['unit_price'] = $Row['standard_price'];
                    $response['response'][] = $result;
                }
                $response['ack'] = 1;
                $response['error'] = NULL;
            } else {
                $response['response'] = array();
                $response['ack'] = 0;
                $response['error'] = 'No record found!';
            }
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = 'No record found!';
        }
        /*echo "<pre>";
        print_r($response);
        exit;*/
        return $response;
    }

    function add_crm_promotion_product($attr)
    {
        //$this->objGeneral->mysql_clean($attr);
        //echo "<pre>"; print_r($attr); exit;
        $Sql1 = "DELETE FROM crm_promotions_items WHERE promotion_id = '" . $attr['promotion_id'] . "'";
        $this->objsetup->CSI($Sql1);

        /*echo "<pre>"; print_r($attr['promotion_product']);
        exit;*/
        foreach ($attr['promotion_product'] as $value) {

            if ($value->chk == true) {
                $Sql = "INSERT INTO crm_promotions_items
                                      SET
                                          product_id = '$value->id',
                                          promotion_id = '" . $attr['promotion_id'] . "',
                                          user_id='" . $this->arrUser['id'] . "',
                                          company_id='" . $this->arrUser['company_id'] . "'";

                $RS = $this->objsetup->CSI($Sql);
            }
        }

        $response['ack'] = 1;
        $response['error'] = NULL;

        return $response;
    }

    function delete_crm_promotion_product($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "update crm_promotions_items set status=0 WHERE product_id = " . $attr['product_id'] . " AND promotion_id = $attr[prom_id]";

        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        }

        return $response;
    }

    // CRM Document Module
    //--------------------------------------

    function get_documents($attr)
    {
        global $objFilters;
        $where = array(0 => array('document.module_id' => 19), 1 => array('document.row_id' => $attr['crm_id']), 2 => array('document.type' => 2));
        return $objFilters->get_module_listing(12, "document", '', '', $attr['more_fields'], '', $where);
    }

    function get_crm_document_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM document
				WHERE id='" . $attr['id'] . "'
				LIMIT 1";
        $RS = $this->objsetup->CSI($Sql);
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

    function add_folder($attr)
    {
        $Sql = "INSERT INTO document
					SET module_id = 19,row_id = '$attr[row_id]',folder_id = '$attr[folder_id]',title = '" . $attr['title'] . "',type = 1,create_date = '" . $this->objGeneral->convert_date(date('Y-m-d')) . "',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "',user_name='" . $this->arrUser[user_name] . "'";
        //echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['id'] = $id;
            $response['ack'] = 1;
            $response['edit'] = 0;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['edit'] = 0;
            $response['error'] = 'Record not inserted!';
        }

        return $response;
    }

    function add_crm_document($attr)
    {

        $files = $attr['files'];
        $attr = $attr['frmData'];

        /* print_r($this->arrUser);
          echo "<pre>"; print_r($files); exit; */

        //echo "here==>>>".$files["name"];exit;
        $new_file_name = '';
        if (isset($files["name"]) && $files["name"] != '') {
            $uploads_dir = UPLOAD_PATH . 'sales/crm/';
            //echo "Full Path = ".$uploads_dir.$new_file_name;exit;
            $tmp_name = $files["tmp_name"];
            $name = $files["name"];
            $explode_file = explode(".", $name);
            $new_file_name = mt_rand() . "." . $explode_file[1];
            // upload file
            $var_export = move_uploaded_file($tmp_name, $uploads_dir . $new_file_name);
        }

        $Sql = "INSERT INTO document
					SET module_id = 19,row_id = '$attr[row_id]',title = '" . $attr['title'] . "',folder_id = '$attr[folder_id]',document_code = '$attr[document_code]',name = '" . $new_file_name . "',type = 2,create_date = '" . $this->objGeneral->convert_date(date('Y-m-d')) . "',file_size = " . $files["size"] . ",user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "',user_name='" . $this->arrUser[user_name] . "'";
        //echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['ack'] = 1;
            $response['edit'] = 0;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['edit'] = 0;
            $response['error'] = 'Record not inserted!';
        }

        return $response;
    }

    function update_crm_document($attr)
    {
        $files = $attr['files'];
        $attr = $attr['frmData'];
        /* echo'<pre>'; print_r($attr); echo "</pre>";
          exit; */
        $new_file_name = $attr['old_file'];
        $file_size = $attr["file_size"];
        if (isset($files["name"]) && $files["name"] != '') {
            $uploads_dir = UPLOAD_PATH . 'sales/crm/';
            //echo "Full Path = ".$uploads_dir.$new_file_name;exit;
            $tmp_name = $files["tmp_name"];
            $name = $files["name"];
            $explode_file = explode(".", $name);
            $new_file_name = mt_rand() . "." . $explode_file[1];
            $file_size = $files["size"];
            // upload file
            $var_export = move_uploaded_file($tmp_name, $uploads_dir . $new_file_name);
            if ($var_export) {
                //echo $uploads_dir.$attr[file];
                unlink($uploads_dir . $attr['old_file']);
            }
        }


        $Sql = "UPDATE document
					SET title = '" . $attr['title'] . "',folder_id = '$attr[folder_id]',document_code = '$attr[document_code]',name = '" . $new_file_name . "',file_size = " . $file_size . ",type = 2,modified_date = '" . $this->objGeneral->convert_date(date('Y-m-d')) . "'
					WHERE id = " . $attr['id'] . "";

        //echo $Sql."<hr>";exit;
        $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['edit'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['edit'] = 0;
            $response['error'] = 'Record can\'t be updated!';
        }

        return $response;
    }

    function get_folders($attr)
    {
        $order_type = "";
        $response = array();

        $Sql = "SELECT c.id, c.title as name,c.folder_id as parent_id
                FROM  document  c 
                where   c.company_id=" . $this->arrUser['company_id'] . "  AND 
                        type=1 AND 
                        module_id = 19 
                        order by c.id ASC ";
        //and  c.parent_id=0 and //c.id  != 7 and

        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        //echo $Sql; exit;
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {

                if ($Row['parent_id'] == 0) {
                    $result['id'] = $Row['id'];
                    $result['name'] = $Row['name'];
                    $result['parent_id'] = $Row['parent_id'];
                    $response['response_parent'][] = $result;
                } else {

                    $result['id'] = $Row['id'];
                    $result['name'] = $Row['name'];
                    $result['parent_id'] = $Row['parent_id'];
                    $response['response_child'][] = $result;
                }
            }
        }


        foreach ($response['response_parent'] as $key => $value) {

            $result['id'] = $value['id'];
            $result['name'] = $value['name'];
            $result['parent_id'] = $value['parent_id'];
            $response['response'][] = $result;

            // $response['response'][] =  $this->recurcise_child($response['response_child'],$value['id']);

            foreach ($response['response_child'] as $key2 => $value_2) {

                if ($value_2['parent_id'] == $value['id']) {
                    $result['id'] = $value_2['id'];
                    $result['name'] = "   - " . $value_2['name'];
                    $result['parent_id'] = $value_2['parent_id'];
                    $response['response'][] = $result;

                    foreach ($response['response_child'] as $key2 => $value_3) {

                        if ($value_3['parent_id'] == $value_2['id']) {
                            $result['id'] = $value_3['id']; //"  --".$value_3['name'];
                            $result['name'] = "  -- " . $value_3['name']; // str_pad($value_3['name'],5,".");
                            $result['parent_id'] = $value_3['parent_id'];
                            $response['response'][] = $result;

                            foreach ($response['response_child'] as $key2 => $value_4) {

                                if ($value_4['parent_id'] == $value_3['id']) {
                                    $result['id'] = $value_4['id']; //"  --".$value_3['name'];
                                    $result['name'] = "  --- " . $value_4['name']; // str_pad($value_3['name'],5,".");
                                    $result['parent_id'] = $value_4['parent_id'];
                                    $response['response'][] = $result;
                                }
                            }
                        }
                    }
                }
            }
        }

        // print_r($response['response']);exit;
        /* if($p==0){
          $result['id'] = -1;
          $result['name'] = '++ Add New ++';
          $response['response'][] = $result;
          } */


        return $response;
    }

    function recurcise_child($array, $parent_id)
    {

        foreach ($array as $key2 => $value_2) {
            if ($value_2['parent_id'] == $parent_id) {

                $result['id'] = $value_2['id'];
                $result['name'] = "   -" . $value_2['name'];
                $result['parent_id'] = $value_2['parent_id'];
                $response['response'][] = $result;

                //  $response['response'][] =  $this->recurcise_child($array,$value_2['id']);
            }
        }

        return $response;
    }

    function get_folders__aaa($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = "";
        $where_clause = "AND type = 1 AND company_id =" . $this->arrUser['company_id'];

        if (!empty($attr['keyword'])) {
            $where_clause .= " AND title LIKE '%$attr[keyword]%' ";
        }
        /* if(empty($attr['all'])){
          if(empty($attr['start'])) $attr['start'] = 0;
          if(empty($attr['limit'])) $attr['limit'] = 10;
          $limit_clause = " LIMIT $attr[start] , $attr[limit]";
          } */
        $response = array();
        $temp_arr = array();

        $Sql = "SELECT id, title,folder_id
				FROM document
				WHERE 1
				" . $where_clause . "
				ORDER BY id ASC";

        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['title'] = $Row['title'];
                $result['folder_id'] = $Row['folder_id'];
                $temp_arr[] = $result;
            }
            //echo '<pre>';print_r($temp_arr);
            if (isset($attr['all']) && $attr['all'] != '')
                $response['response'] = $temp_arr;
            else
                $response['response'] = $this->_generate_folder_array($temp_arr);
            //echo '<pre>';print_r($response['response']);exit;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }

        return $response;
    }

    function _generate_folder_array($arr_folder, $parent = 0)
    {
        $folders = array();
        foreach ($arr_folder as $folder) {
            if (trim($folder['folder_id']) == trim($parent)) {
                $folder['sub'] = isset($folder['sub']) ? $folder['sub'] : $this->_generate_folder_array($arr_folder, $folder['id']);
                $folders[] = $folder;
            }
        }
        return $folders;
    }

    // CRM Opportunity Document Module
    //--------------------------------------

    function get_opp_documents($attr)
    {
        global $objFilters;
        $where = array(0 => array('document.module_id' => 49), 1 => array('document.row_id' => $attr['crm_id']), 2 => array('document.type' => 2));
        return $objFilters->get_module_listing(12, "document", '', '', $attr['more_fields'], '', $where);
    }

    function get_crm_opp_document_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT *
				FROM document
				WHERE id='" . $attr['id'] . "'
				LIMIT 1";

        $RS = $this->objsetup->CSI($Sql);
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

    function add_opp_cycle_folder($attr)
    {
        $Sql = "INSERT INTO document
					SET module_id = 49,row_id = '$attr[row_id]',folder_id = '$attr[folder_id]',title = '" . $attr['title'] . "',type = 1,create_date = '" . $this->objGeneral->convert_date(date('Y-m-d')) . "',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "',user_name='" . $this->arrUser[user_name] . "'";
        //echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['id'] = $id;
            $response['ack'] = 1;
            $response['edit'] = 0;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['edit'] = 0;
            $response['error'] = 'Record not inserted!';
        }

        return $response;
    }

    function add_crm_opp_document($attr)
    {

        $files = $attr['files'];
        $attr = $attr['frmData'];

        $new_file_name = '';
        if (isset($files["name"]) && $files["name"] != '') {
            $uploads_dir = UPLOAD_PATH . 'sales/crm/';
            //echo "Full Path = ".$uploads_dir.$new_file_name;exit;
            $tmp_name = $files["tmp_name"];
            $name = $files["name"];
            $explode_file = explode(".", $name);
            $new_file_name = mt_rand() . "." . $explode_file[1];
            // upload file
            $var_export = move_uploaded_file($tmp_name, $uploads_dir . $new_file_name);
        }

        $Sql = "INSERT INTO document
					SET module_id = 49,row_id = '$attr[row_id]',title = '" . $attr['title'] . "',folder_id = '$attr[folder_id]',document_code = '$attr[document_code]',name = '" . $new_file_name . "',type = 2,create_date = '" . $this->objGeneral->convert_date(date('Y-m-d')) . "',file_size = " . $files["size"] . ",user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "',user_name='" . $this->arrUser[user_name] . "'";
        //echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['ack'] = 1;
            $response['edit'] = 0;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['edit'] = 0;
            $response['error'] = 'Record not inserted!';
        }

        return $response;
    }

    function update_crm_opp_document($attr)
    {
        $files = $attr['files'];
        $attr = $attr['frmData'];
        /* echo'<pre>'; print_r($attr); echo "</pre>";
          exit; */
        $new_file_name = $attr['old_file'];
        $file_size = $attr["file_size"];
        if (isset($files["name"]) && $files["name"] != '') {
            $uploads_dir = UPLOAD_PATH . 'sales/crm/';
            //echo "Full Path = ".$uploads_dir.$new_file_name;exit;
            $tmp_name = $files["tmp_name"];
            $name = $files["name"];
            $explode_file = explode(".", $name);
            $new_file_name = mt_rand() . "." . $explode_file[1];
            $file_size = $files["size"];
            // upload file
            $var_export = move_uploaded_file($tmp_name, $uploads_dir . $new_file_name);
            if ($var_export) {
                //echo $uploads_dir.$attr[file];
                unlink($uploads_dir . $attr['old_file']);
            }
        }


        $Sql = "UPDATE document
					SET title = '" . $attr['title'] . "',folder_id = '$attr[folder_id]',document_code = '$attr[document_code]',name = '" . $new_file_name . "',file_size = " . $file_size . ",type = 2,modified_date = '" . $this->objGeneral->convert_date(date('Y-m-d')) . "' WHERE id = " . $attr['id'] . " limit 1";

        //echo $Sql."<hr>";exit;
        $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['edit'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['edit'] = 0;
            $response['error'] = 'Record can\'t be updated!';
        }

        return $response;
    }

    function delete_crm_opp_document($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $uploads_dir = UPLOAD_PATH . 'sales/crm/';

        $Sql1 = "SELECT *
				FROM document
				WHERE id='" . $attr['id'] . "'
				LIMIT 1";

        //echo $Sql1."<hr>"; exit;
        $Row = $this->objsetup->CSI($Sql1)->FetchRow();
        if ($Row['file'] != '')
            unlink($uploads_dir . $Row['file']);

        $Sql = "DELETE FROM document
				WHERE id = " . $attr['id'] . " ";

        //echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        }

        return $response;
    }

    function get_opp_cycle_folders($attr)
    {
        $order_type = "";
        $response = array();

        $Sql = "SELECT c.id, c.title as name ,  c.folder_id as parent_id 
                FROM  document  c 
                where   c.company_id=" . $this->arrUser['company_id'] . "  AND 
                        type=1 AND 
                        module_id = 49";

        //and  c.parent_id=0 and //c.id  != 7 and

        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        //echo $Sql; exit;
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {

                if ($Row['parent_id'] == 0) {
                    $result['id'] = $Row['id'];
                    $result['name'] = $Row['name'];
                    $result['parent_id'] = $Row['parent_id'];
                    $response['response_parent'][] = $result;
                } else {

                    $result['id'] = $Row['id'];
                    $result['name'] = $Row['name'];
                    $result['parent_id'] = $Row['parent_id'];
                    $response['response_child'][] = $result;
                }
            }
        }


        foreach ($response['response_parent'] as $key => $value) {

            $result['id'] = $value['id'];
            $result['name'] = $value['name'];
            $result['parent_id'] = $value['parent_id'];
            $response['response'][] = $result;

            // $response['response'][] =  $this->recurcise_child($response['response_child'],$value['id']);

            foreach ($response['response_child'] as $key2 => $value_2) {

                if ($value_2['parent_id'] == $value['id']) {
                    $result['id'] = $value_2['id'];
                    $result['name'] = "   - " . $value_2['name'];
                    $result['parent_id'] = $value_2['parent_id'];
                    $response['response'][] = $result;

                    foreach ($response['response_child'] as $key2 => $value_3) {

                        if ($value_3['parent_id'] == $value_2['id']) {
                            $result['id'] = $value_3['id']; //"  --".$value_3['name'];
                            $result['name'] = "  -- " . $value_3['name']; // str_pad($value_3['name'],5,".");
                            $result['parent_id'] = $value_3['parent_id'];
                            $response['response'][] = $result;

                            foreach ($response['response_child'] as $key2 => $value_4) {

                                if ($value_4['parent_id'] == $value_3['id']) {
                                    $result['id'] = $value_4['id']; //"  --".$value_3['name'];
                                    $result['name'] = "  --- " . $value_4['name']; // str_pad($value_3['name'],5,".");
                                    $result['parent_id'] = $value_4['parent_id'];
                                    $response['response'][] = $result;
                                }
                            }
                        }
                    }
                }
            }
        }

        // print_r($response['response']);exit;
        /* if($p==0){
          $result['id'] = -1;
          $result['name'] = '++ Add New ++';
          $response['response'][] = $result;
          } */


        return $response;
    }

    // Price Offer Volume Module
    //--------------------------------------

    function get_price_offer_volumes($attr)
    {
        global $objFilters;
        return $objFilters->get_module_listing(106, "price_offer_volume");
    }

    function get_price_offer_volume_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM price_offer_volume
				WHERE id='" . $attr['id'] . "'
				LIMIT 1";
        $RS = $this->objsetup->CSI($Sql);
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

    function get_price_offer_volume_by_type($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM price_offer_volume
				WHERE type='" . $attr['type'] . "' AND company_id =" . $this->arrUser['company_id'];

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['description'] = $Row['description'];
                $result['name'] = $Row['name'];
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

    function add_price_offer_volume($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        $Sql = "INSERT INTO price_offer_volume
				SET status=1, `type`='" . $arr_attr['type'] . "',`name`='" . $arr_attr['name'] . "',`description`='" . $arr_attr['description'] . "',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";

        //echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;
            $response['edit'] = 0;
        } else {
            $response['ack'] = 0;
            $response['id'] = 0;
            $response['error'] = 'Record not inserted!';
            $response['edit'] = 0;
        }

        return $response;
    }

    function update_price_offer_volume($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "UPDATE price_offer_volume
				SET `type`='" . $arr_attr['type'] . "',`name`='" . $arr_attr['name'] . "',`description`='" . $arr_attr['description'] . "'
				WHERE id = " . $arr_attr['id'] . "  limit 1";

        //echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['edit'] = 1;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated!';
            $response['edit'] = 0;
        }

        return $response;
    }

    function delete_price_offer_volume($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "update price_offer_volume set status=0 WHERE id = " . $arr_attr['id'] . " ";

        //echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated!';
        }

        return $response;
    }

    function get_items_price_offer_by_custid($attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $whereCond = '';

        if ($attr['crm_id'] > 0)
            $whereCond = "po.moduleID = " . $attr['crm_id'] . " AND  po.moduleType = 1 AND";
        elseif ($attr['srm_id'] > 0)
            $whereCond = "po.moduleID = " . $attr['srm_id'] . " AND  po.moduleType = 2 AND";

        if (isset($attr['order_date'])) {
            $order_date = $this->objGeneral->convert_date($attr['order_date']);
            /* $whereCond .=" $order_date BETWEEN po.start_date AND 
                            CASE WHEN po.end_date = 0 THEN 4099299120 
                                ELSE po.end_date 
                            END AND "; */
            $whereCond .= " $order_date BETWEEN (FLOOR(po.start_date/86400)*86400) AND 
                            CASE WHEN po.end_date = 0 THEN 4099299120 
                                 ELSE (FLOOR(po.end_date/86400)*86400)
                            END AND ";
        } else {
            /* $whereCond .=" UNIX_TIMESTAMP (NOW()) BETWEEN po.start_date AND 
                            CASE WHEN po.end_date = 0 THEN 4099299120 
                                ELSE po.end_date 
                            END AND "; */
            $whereCond .= " UNIX_TIMESTAMP (NOW()) BETWEEN (FLOOR(po.start_date/86400)*86400) AND 
                            CASE WHEN po.end_date = 0 THEN 4099299120 
                                 ELSE (FLOOR(po.end_date/86400)*86400) 
                            END AND ";
        }
        $Sql = "SELECT  po.id AS id, 
                        poi.itemOfferPrice AS price_offer, 
                        poi.`itemID` AS item_id, 
                        poi.`uomID` AS uom_id,
                        poi.`minQty` AS minSaleQty,
                        poi.`maxQty` AS maxSaleQty,
                        poiv.id AS item_volume_id,
                        poiv.discount AS volume_discount,
                        poiv.discountType AS discount_type,
                        poiv.min AS min_qty
                FROM priceofferitem AS poi 
                JOIN `priceoffer` AS po ON po.id = poi.`priceID`
                LEFT JOIN `priceofferitemvolume` AS poiv ON poiv.priceID = po.id  AND poiv.`itemID` = poi.`itemID`
                WHERE " . $whereCond . " 
                      po.priceType IN (2,3)
                ORDER BY poi.`itemID`, poiv.min";

        /* po.moduleID = ".$attr['crm_id']." AND                    
                po.moduleType = 1 AND */

        // echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);
        $prev_item_id = 0;
        $count = -1;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                if ($prev_item_id != $Row['item_id']) {
                    $prev_item_id = $Row['item_id'];
                    $count++;
                    $temp_arr['id']             = $Row['id'];
                    $temp_arr['price_offer']    = $Row['price_offer'];
                    $temp_arr['minSaleQty']     = $Row['minSaleQty'];
                    $temp_arr['maxSaleQty']     = $Row['maxSaleQty'];

                    $temp_arr['uom_id']         = $Row['uom_id'];
                    $temp_arr['item_id']        = $Row['item_id'];
                    $response['response'][$count] = $temp_arr;
                }

                if ($prev_item_id == $Row['item_id'] && $Row['item_volume_id'] != null) {
                    $temp['volume_discount'] = $Row['volume_discount'];
                    $temp['discount_type']   = $Row['discount_type'];
                    $temp['min_qty']         = $Row['min_qty'];

                    $response['response'][$count]['arr_volume_discounts'][] = $temp;
                }
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

    function get_items_promotions_by_custid($attr)
    {
        $response = array();
        $order_date = $this->objGeneral->convert_date($attr['order_date']);
        $crm_id = ($attr['crm_id'] != '') ? $attr['crm_id'] : 0;
        $Sql = "SELECT 
                    pp.product_id, 
                    sp.id, sp.promotion_gl_id, 
                    sp.promotion_gl_name, 
                    sp.promotion_gl_code, 
                    sp.discount_type,
                    (CASE
                        WHEN sp.discount_type = 1 THEN
                            sp.discount
                        ELSE
                            sp.discount/SR_GetConversionRateByDate($order_date, sp.currency_id, " . $this->arrUser['company_id'] . ") 
                    END) AS discount,                    
                    sp.strategy_type_id AS strategy_type, 
                    sp.strategy_id AS strategy,
                    sp.start_date,
                    sp.end_date
                FROM
                `promotion_products` AS pp, `promotion_customers` AS pc, `sale_promotion` AS sp
                WHERE
                    (
                        '" . $order_date . "' BETWEEN sp.start_date AND sp.end_date
                    ) AND 
                    sp.company_id = " . $this->arrUser['company_id'] . " AND
                    pp.promotion_id = sp.id AND 
                    pc.promotion_id = sp.id AND
                    pc.customer_id = $crm_id
                    GROUP BY pp.`product_id`
                    ";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
        } else
            $response['ack'] = 0;

        return $response;
    }

    function get_items_sales_price_in_date_range($attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        $order_date = $this->objGeneral->convert_date($attr['order_date']);
        $currency_id = ($attr['currency_id'] != '') ? $attr['currency_id'] : 0;

        $Sql = "SELECT 	pp.product_id,
                        pp.discount_type AS discountType,
                        pp.min_qty AS min_sale_qty,
                        pp.max_qty  AS max_sale_qty,
                        ROUND((pp.standard_price*SR_GetConversionRateByDate($order_date, $currency_id, " . $this->arrUser['company_id'] . ")), 3) AS standard_price,
                        ROUND((pp.min_max_sale_price*SR_GetConversionRateByDate($order_date, $currency_id, " . $this->arrUser['company_id'] . ")), 3) AS min_max_sale_price,
                        ppv.id,
                        ppv.discount,
                        ppv.min_qty as min
                        FROM product_price AS pp
                        JOIN product AS prd ON pp.product_id = prd.id
                        LEFT JOIN product_price_volume AS ppv ON ppv.price_id = pp.id
                            
                        WHERE
                            prd.id IN($attr[item_ids]) AND 
                            pp.type=1 AND
                            $order_date BETWEEN pp.start_date AND pp.end_date";
        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);
        $prev_row_id = 0;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                if ($prev_row_id != $Row['product_id']) {
                    $response['response'][$Row['product_id']]['standard_price'] = $Row['standard_price'];
                    $response['response'][$Row['product_id']]['min_sale_price'] = $Row['min_max_sale_price'];
                    $response['response'][$Row['product_id']]['min_sale_qty']   = $Row['min_sale_qty'];
                    $response['response'][$Row['product_id']]['max_sale_qty']   = $Row['max_sale_qty'];
                    $response['response'][$Row['product_id']]['discountType']   = $Row['discountType'];

                    $prev_row_id = $Row['product_id'];
                }

                if ($prev_row_id == $Row['product_id']) {
                    if ($Row['min'] != null && $Row['discount'] != null) {
                        $temp_arr = array();
                        $temp_arr['min']            = $Row['min'];
                        $temp_arr['discount']       = $Row['discount'];
                        $response['response'][$prev_row_id]['arr_sales_price'][] = $temp_arr;
                    }
                }
            }
            $response['ack'] = 1;
        } else {
            $response['ack'] = 0;
            $response['response'] = array();
        }
        return $response;
    }

    /* function ($dispatch_date, $transfer_order_date, $offer_date, $quantity, $ref_po_id)
    {
        $Sql = "SELECT SR_CalculateTransferOrderCost($dispatch_date, $transfer_order_date, $offer_date, $quantity, $ref_po_id, ".$this->arrUser['company_id'].") AS cost";
        $RS = $this->objsetup->CSI($Sql);
        return $RS->fields['cost'];
    } */
    function get_items_storage_cost($attr)
    {

        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT wh_loc.product_id,  wh_loc.sale_order_detail_id,
                        SUM(CASE 
                            WHEN (SELECT w.type FROM `warehouse_allocation` AS w WHERE w.id = wh_loc.ref_po_id) = 5 THEN -- IF STOCK IS ALLOCATED FROM TRANSFER ORDER
                            (
                                ((((
                                    (CASE 
                                        WHEN wh_bin_loc.cost_type_id = 1 -- fixed
                                            THEN 
                                                wh_bin_loc.bin_cost
                                        WHEN wh_bin_loc.cost_type_id = 2 -- daily
                                            THEN 
                                                (CASE
                                                    WHEN DATEDIFF( FROM_UNIXTIME(o.dispatch_date), FROM_UNIXTIME(wh_loc.transfer_order_date)) > 0
                                                    THEN
                                                        DATEDIFF( FROM_UNIXTIME(o.dispatch_date), FROM_UNIXTIME(wh_loc.transfer_order_date)) * wh_bin_loc.bin_cost
                                                    ELSE
                                                        wh_bin_loc.bin_cost
                                                END)
                                        WHEN wh_bin_loc.cost_type_id = 3 -- weekly
                                            THEN
                                                (CASE
                                                    WHEN DATEDIFF( FROM_UNIXTIME(o.dispatch_date), FROM_UNIXTIME(wh_loc.transfer_order_date)) > 6
                                                    THEN
                                                        CEIL(DATEDIFF( FROM_UNIXTIME(o.dispatch_date), FROM_UNIXTIME(wh_loc.transfer_order_date))/7) * wh_bin_loc.bin_cost
                                                    ELSE
                                                        wh_bin_loc.bin_cost
                                                END)
                                        WHEN wh_bin_loc.cost_type_id = 4 -- monthly
                                            THEN 
                                                (CASE
                                                    WHEN DATEDIFF( FROM_UNIXTIME(o.dispatch_date), FROM_UNIXTIME(wh_loc.transfer_order_date)) > 29
                                                    THEN
                                                        CEIL(DATEDIFF( FROM_UNIXTIME(o.dispatch_date), FROM_UNIXTIME(wh_loc.transfer_order_date))/30) * wh_bin_loc.bin_cost
                                                    ELSE
                                                        wh_bin_loc.bin_cost
                                                END)
                                        WHEN wh_bin_loc.cost_type_id = 5 -- annually
                                            THEN 
                                                (CASE
                                                    WHEN DATEDIFF( FROM_UNIXTIME(o.dispatch_date), FROM_UNIXTIME(wh_loc.transfer_order_date)) > 364
                                                    THEN
                                                        CEIL(DATEDIFF( FROM_UNIXTIME(o.dispatch_date), FROM_UNIXTIME(wh_loc.transfer_order_date))/365) * wh_bin_loc.bin_cost
                                                    ELSE
                                                        wh_bin_loc.bin_cost
                                                END)  
                                    END)
                                ) / (SELECT uoms.ref_quantity FROM `units_of_measure_setup` AS uoms WHERE uoms.product_id = wh_loc.product_id AND uoms.unit_id=wh_loc.primary_unit_id AND uoms.record_id=wh_bin_loc.dimensions_id LIMIT 1)) * wh_loc.quantity) / SR_GetConversionRateByDate(o.offer_date, wh_bin_loc.currency_id, " . $this->arrUser['company_id'] . "))
                            )
                            ELSE  -- IF STOCK IS NOT ALLOCATED FROM TRANSFER ORDER
                            (
                                ((((
                                    (CASE 
                                        WHEN wh_bin_loc.cost_type_id = 1 -- fixed
                                            THEN 
                                                wh_bin_loc.bin_cost
                                        WHEN wh_bin_loc.cost_type_id = 2 -- daily
                                            THEN 
                                                (CASE
                                                    WHEN DATEDIFF( FROM_UNIXTIME(o.dispatch_date), FROM_UNIXTIME(wh_loc.date_received)) > 0
                                                    THEN
                                                        DATEDIFF( FROM_UNIXTIME(o.dispatch_date), FROM_UNIXTIME(wh_loc.date_received)) * wh_bin_loc.bin_cost
                                                    ELSE
                                                        wh_bin_loc.bin_cost
                                                END)
                                        WHEN wh_bin_loc.cost_type_id = 3 -- weekly
                                            THEN
                                                (CASE
                                                    WHEN DATEDIFF( FROM_UNIXTIME(o.dispatch_date), FROM_UNIXTIME(wh_loc.date_received)) > 6
                                                    THEN
                                                        CEIL(DATEDIFF( FROM_UNIXTIME(o.dispatch_date), FROM_UNIXTIME(wh_loc.date_received))/7) * wh_bin_loc.bin_cost
                                                    ELSE
                                                        wh_bin_loc.bin_cost
                                                END)
                                        WHEN wh_bin_loc.cost_type_id = 4 -- monthly
                                            THEN 
                                                (CASE
                                                    WHEN DATEDIFF( FROM_UNIXTIME(o.dispatch_date), FROM_UNIXTIME(wh_loc.date_received)) > 29
                                                    THEN
                                                        CEIL(DATEDIFF( FROM_UNIXTIME(o.dispatch_date), FROM_UNIXTIME(wh_loc.date_received))/30) * wh_bin_loc.bin_cost
                                                    ELSE
                                                        wh_bin_loc.bin_cost
                                                END)
                                        WHEN wh_bin_loc.cost_type_id = 5 -- annually
                                            THEN 
                                                (CASE
                                                    WHEN DATEDIFF( FROM_UNIXTIME(o.dispatch_date), FROM_UNIXTIME(wh_loc.date_received)) > 364
                                                    THEN
                                                       CEIL(DATEDIFF( FROM_UNIXTIME(o.dispatch_date), FROM_UNIXTIME(wh_loc.date_received))/365) * wh_bin_loc.bin_cost
                                                    ELSE
                                                        wh_bin_loc.bin_cost
                                                END)  
                                    END)
                                ) / (SELECT uoms.ref_quantity FROM `units_of_measure_setup` AS uoms WHERE uoms.product_id = wh_loc.product_id AND uoms.unit_id=wh_loc.primary_unit_id AND uoms.record_id=wh_bin_loc.dimensions_id LIMIT 1)) * wh_loc.quantity) / SR_GetConversionRateByDate(o.offer_date, wh_bin_loc.currency_id, " . $this->arrUser['company_id'] . "))
                            )
                        END) +
                        -- GO ON STEP BACK TO CHECK THE STORAGE COST
                        SUM(CASE
                            WHEN (SELECT w.type FROM `warehouse_allocation` AS w WHERE w.id = wh_loc.ref_po_id) = 5 then
                                SR_CalculateTransferOrderCost(wh_loc.transfer_order_date, wh_loc.date_received, o.offer_date, wh_loc.quantity, wh_loc.ref_po_id, " . $this->arrUser['company_id'] . ")
                            ELSE
                                0 -- SR_CalculateTransferOrderCost(o.dispatch_date, wh_loc.date_received, o.offer_date, wh_loc.quantity, wh_loc.ref_po_id, " . $this->arrUser['company_id'] . ")
                        END) AS storage_cost
                        FROM 
                            `warehouse_allocation` AS wh_loc, 
                            product_warehouse_location AS prd_wh_loc, 
                            `warehouse_bin_location` AS wh_bin_loc,
                            orders AS o
                        WHERE  
                            wh_loc.type=2 AND 
                            o.id = wh_loc.order_id AND
                            wh_bin_loc.id = prd_wh_loc.`warehouse_loc_id` AND 
                            wh_loc.location = prd_wh_loc.id AND
                            wh_loc.company_id= " . $this->arrUser['company_id'] . " AND 
                            wh_loc.order_id= " . $attr['order_id'] . "
                            GROUP BY wh_loc.sale_order_detail_id";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response'][$Row['sale_order_detail_id']] = $Row['storage_cost'];
            }
            $response['ack'] = 1;
        } else {
            $response['ack'] = 0;
            $response['response'] = array();
        }
        return $response;
    }

    function get_items_original_fifo_additional_cost($attr)
    {
        // echo 'helosd';exit;
        $additional_cost = 0;
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT od.id, od.item_id, (IFNULL(SR_Calculate_AdditionalCost_FIFO(" . $attr['order_id'] . ", od.id, od.item_id, SUM(od.qty), " . $this->arrUser['company_id'] . ", $attr[order_date], FALSE),0)) AS additional_cost
						FROM order_details AS od
						WHERE od.order_id= " . $attr['order_id'] . " AND od.type = 0 AND  od.costing_method_id = 1
						GROUP BY od.item_id";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                // $additional_cost += $Row['additional_cost'];
                $response['response'][] = $Row;
            }
            // $response['response'] = $additional_cost;
            $response['ack'] = 1;
        } else {
            $response['ack'] = 0;
            $response['response'] = array();
        }
        return $response;
    }

    function get_items_purchase_cost($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sqla = "SELECT vat_sales_type
                FROM financial_settings
                WHERE company_id= " . $this->arrUser['company_id'] . "
                LIMIT 1";
        // echo $Sqla;exit;
        // SELECT marginAnalysisView
        //	FROM company
        //	WHERE id=

        $RSa = $this->objsetup->CSI($Sqla);
        $postingType = $RSa->fields['vat_sales_type'];

        if ($postingType == 1) {

            $Sql = "SELECT prd.id as product_id,
                            (CASE
                                WHEN prd.costing_method_id=1
                                    THEN IFNULL(SR_Calculate_Cost_FIFO(od.item_id, SUM(od.qty),  " . $this->arrUser['company_id'] . "), 0)
                                
                                WHEN prd.costing_method_id=3
                                    THEN IFNULL((SELECT standard_price FROM product_price WHERE product_id = prd.id AND type = 2 
                                                AND $attr[order_date] BETWEEN start_date AND end_date), 0)
                                ELSE
					                od.unit_price
                            END) AS purchase_cost
                FROM product AS prd, order_details AS od
                WHERE prd.id = od.item_id AND od.order_id= " . $attr['order_id'] . " AND od.company_id= " . $this->arrUser['company_id'] . "
                GROUP BY prd.id";

            /* WHEN prd.costing_method_id=2
                    THEN IFNULL(SR_Calculate_Cost_Moving_Avg(od.item_id,  ".$this->arrUser['company_id']."), 0) */
        } else {

            $Sql = "SELECT prd.id as product_id,
                           (CASE WHEN (od.type =0) THEN IFNULL((SELECT 
                                                                SUM(COALESCE((ppc.amount/SR_GetConversionRateByDate($attr[order_date],ppc.currency_id,ppc.company_id)),0)) AS price 
                                                                FROM product_purchase_cost AS ppc 
                                                                WHERE ppc.product_id = prd.id AND ppc.company_id = prd.company_id), 0)
                                    
                            ELSE 0
                            END) AS purchase_cost
                    FROM product AS prd, order_details AS od
                    WHERE prd.id = od.item_id AND od.order_id= " . $attr['order_id'] . " AND od.company_id= " . $this->arrUser['company_id'] . "
                    GROUP BY prd.id";
        }

        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response'][$Row['product_id']] = $Row['purchase_cost'];
            }
            $response['ack'] = 1;
        } else {
            $response['ack'] = 0;
            $response['response'] = array();
        }
        return $response;
    }

    function get_items_level_rebate($attr)
    {
        $response = array();
        /*
            (
                    reb.rebate_type IN (2, 3) OR 
                    (reb.rebate_type = 1 AND reb.universal_type IN (2,3)) 
                )
                AND
                
        */
        $crm_id = ($attr['crm_id'] != '') ? $attr['crm_id'] : 0;
        $Sql = "SELECT * 
                FROM rebate AS reb
                WHERE 
                reb.status = 1 AND
                reb.moduleType = 1 AND 
                reb.moduleID = $crm_id AND 
                $attr[order_date]
                BETWEEN reb.start_date AND CASE WHEN reb.end_date = 0 THEN 4099299120  ELSE reb.end_date END";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                $attr['rebate_id'] = $Row['id'];
                /* if (($Row['universal_type'] == 2) || ($Row['universal_type'] == 3) && $Row['rebate_type'] == 1)
                    $Row['revenue_volume_rebate'] = $this->get_rebateRevenueVolume($attr);
                
                if($Row['rebate_type']==2){
                    
                    $Row['categories_rebate'] = $this->get_rebate_categories($attr);

                }else if($Row['universal_type'] == 2 || $Row['universal_type'] == 3 || $Row['rebate_type']==3){

                    $Row['items_rebate'] = $this->get_rebate_items($attr);
                }  */
                if ($Row['universal_type'] != 1) {
                    $Row['items_rebate'] = $this->get_rebate_items($attr);
                    $Row['revenue_volume_rebate'] = $this->get_rebateRevenueVolume($attr);
                }

                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
        } else {
            $response['ack'] = 0;
            $response['response'] = array();
        }
        return $response;
    }
    function get_items_margin_cost($attr)
    {
        $order_date = $this->objGeneral->convert_date($attr['order_date']);
        $this->objGeneral->mysql_clean($arr_attr);
        $currency_id = ($attr['currency_id'] != '') ? $attr['currency_id'] : '0';
        $Sql = "SELECT
                        pma.id, 
                        pma.`marginal_analysis_id`, 
                        pma.product_id, 
                        pma.uom_id, 
                        pma.currency_id, 
                        pma.amount/SR_GetConversionRateByDate($order_date, pma.currency_id, " . $this->arrUser['company_id'] . ") AS amount,
                        SR_GetConversionRateByDate($order_date, pma.currency_id, " . $this->arrUser['company_id'] . ") AS margin_analysis_conversion_rate,
                        idc.title AS name, 
                        idc.ref_id,
                        SR_GetConversionRateByDate($order_date, $currency_id, " . $this->arrUser['company_id'] . ") AS conversion_rate
                FROM product_marginal_analysis AS pma
                    JOIN product AS prd ON pma.product_id = prd.id
                    JOIN item_additional_cost AS idc ON pma.marginal_analysis_id =idc.id
                    WHERE
                    prd.id IN($attr[item_ids])";
        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $temp_row = array();
                $temp_row['marginal_analysis_id']   = $Row['marginal_analysis_id'];
                $temp_row['name']                   = $Row['name'];
                $temp_row['uom_id']                 = $Row['uom_id'];
                $temp_row['currency_id']            = $Row['currency_id'];
                $temp_row['conversion_rate']        = $Row['conversion_rate'];
                $temp_row['margin_analysis_conversion_rate'] = $Row['margin_analysis_conversion_rate'];
                $temp_row['amount']                 = $Row['amount']; // * $temp_row['conversion_rate'];
                $temp_row['ref_id']                 = $Row['ref_id'];
                $margin_response[$Row['product_id']][] = $temp_row;
            }
            $response['response']['margin_analysis']    = $margin_response;
        } else {
            $response['response']['margin_analysis'] = array();
        }
        $response['ack'] = 1;
        $attr['order_date'] = $order_date;
        $purchase_cost = self::get_items_purchase_cost($attr);
        $storage_cost = self::get_items_storage_cost($attr);
        $rebate = self::get_items_level_rebate($attr);
        $original_additional_cost = self::get_items_original_fifo_additional_cost($attr);

        $response['response']['purchase_cost']              = $purchase_cost['response'];
        $response['response']['storage_cost']               = $storage_cost['response'];
        $response['response']['items_rebate']               = $rebate['response'];
        $response['response']['original_additional_cost']   = $original_additional_cost['response'];


        return $response;
    }
    // Rebate Volume Module
    //--------------------------------------

    function get_rebate_volumes($attr)
    {
        /* global $objFilters;
          return $objFilters->get_module_listing(106, "price_offer_volume"); */

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = "";
        $where_clause = "";

        $order_type = "";
        $response = array();

        $Sql = "SELECT id, name, description
				FROM rebate_volume
				WHERE 1
				" . $where_clause . "
				 ";

        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'rebate_volume', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
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

    function get_rebate_volume_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT *
				FROM rebate_volume
				WHERE id='" . $attr['id'] . "'
				LIMIT 1";

        $RS = $this->objsetup->CSI($Sql);
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

    function get_rebate_volume_by_type($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM rebate_volume
				WHERE type='" . $attr['type'] . "' AND company_id =" . $this->arrUser['company_id'];

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);
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

    function add_rebate_volume($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        $Sql = "INSERT INTO rebate_volume
				SET status=1,`name`='" . $arr_attr['name'] . "',`description`='" . $arr_attr['description'] . "',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";

        //echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;
            $response['edit'] = 0;
        } else {
            $response['ack'] = 0;
            $response['id'] = 0;
            $response['error'] = 'Record not inserted!';
            $response['edit'] = 0;
        }

        return $response;
    }

    function update_rebate_volume($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "UPDATE rebate_volume
				SET `name`='" . $arr_attr['name'] . "',`description`='" . $arr_attr['description'] . "'
				WHERE id = " . $arr_attr['id'] . "  limit 1";

        //echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['edit'] = 1;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated!';
            $response['edit'] = 0;
        }

        return $response;
    }

    function delete_rebate_volume($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "update rebate_volume set status=0
				WHERE id = " . $arr_attr['id'] . " ";

        //echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated!';
        }

        return $response;
    }

    /////////////////////// for volume discount /////////////////

    function get_supplier_list_product_id($attr)
    {

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";
        $order_type = "";
        $response = array();

        $Sql = "SELECT crm_volume_discount.id,crm_volume_discount.start_date,crm_volume_discount.end_date,crm_volume_discount.created_date
		,crm_volume_discount.discount_value,crm_volume_discount.supplier_type
		,CONCAT(pVolume_1.quantity_from,'-',pVolume_1.quantity_to,' ',uom1.title) as volume
		,crm_volume_discount.purchase_price,crm_volume_discount.discount_price

		FROM crm_volume_discount 

		LEFT OUTER JOIN units_of_measure_volume as pVolume_1 ON ( pVolume_1.id = crm_volume_discount.volume_id)
			LEFT JOIN units_of_measure_setup AS unitSetup1 ON (pVolume_1.unit_category = unitSetup1.id)
			LEFT JOIN units_of_measure AS uom1 ON (uom1.id = unitSetup1.cat_id) 

		WHERE crm_volume_discount.crm_id='" . $attr['crm_id'] . "' and crm_volume_discount.status=1
		 ";


        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'crm_volume_discount', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';
        $response['ack'] = 1;
        $response['error'] = NULL;


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['Volume'] = $Row['volume'];

                $result[' Standard Selling Price'] = $Row['purchase_price'];
                if ($Row['supplier_type'] == 1) {
                    $result['Type'] = 'Percentage';
                } else {
                    $result['Type'] = 'Value';
                }
                $result['Discount'] = ($Row['supplier_type'] == 1) ? $Row['discount_value'] . "%" : $Row['discount'];
                $result[' Discounted Price'] = $Row['discounted_price'];

                $result['discount_date'] = $this->objGeneral->convert_unix_into_date($Row['created_date']);
                $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);

                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }

        return $response;
    }

    function supplier_by_id($attr)
    {

        //$this->objGeneral->mysql_clean($attr);
        $strIds = implode(',', $attr['id']);

        if (isset($attr["price_volume_disc"]))
            $strwhere = " AND cvd.price_volume_disc_chk=" . $attr["price_volume_disc"];
        else
            $strwhere = " AND cvd.price_volume_disc_chk=0";

        $Sql = "SELECT cvd.*,(SELECT wh.title  FROM units_of_measure_setup st 
			JOIN units_of_measure as wh ON wh.id = st.cat_id
			where st.id =cpv.unit_category_id and st.status=1 ) as cat_name,
			crm.name as crm_name,alt_depot.depot as alt_location,crm_region.title as crm_region
			,crm_segment.title as crm_segment,crm_buying_group.title as crm_buying_group
			  ,cpv.quantity_from,cpv.quantity_to,customer_item_info.customer_product_type_id as type

		  	FROM crm_volume_discount as cvd
		  	LEFT JOIN crm ON (crm.id = cvd.crm_id)
			LEFT JOIN alt_depot ON (alt_depot.id = cvd.crm_id)
			LEFT JOIN crm_region ON (crm_region.id = cvd.crm_id)
			LEFT JOIN crm_segment ON (crm_segment.id = cvd.crm_id)
			LEFT JOIN crm_buying_group ON (crm_buying_group.id = cvd.crm_id)
			JOIN customer_item_info ON (customer_item_info.id = cvd.customer_item_info_id)

		  JOIN crm_product_volume as cpv ON (cpv.id = cvd.volume_id)
		  where cvd.customer_item_info_id IN (" . $strIds . ")" . $strwhere;

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $crm = '';
                if ($Row['type'] == 1)
                    $crm = $Row['crm_name'];
                if ($Row['type'] == 2)
                    $crm = $Row['alt_location'];
                if ($Row['type'] == 3)
                    $crm = $Row['crm_region'];
                if ($Row['type'] == 4)
                    $crm = $Row['crm_segment'];
                if ($Row['type'] == 5)
                    $crm = $Row['crm_buying_group'];

                $result['id'] = $Row['id'];
                $result['volume'] = $Row['quantity_from'] . '-' . $Row['quantity_to'] . ' ' . $Row['cat_name'] . '-' . $crm;
                $result['price'] = $Row['price'];
                $result['discount_type'] = $Row['discount_type'] == 1 ? 'Percentage' : 'Value';
                $result['discount'] = $Row['discount'];
                $result['discounted_price'] = $Row['discounted_price'];
                $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = 'No record found.';
        }
        return $response;
    }

    function getPriceVolumeDiscountByID($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT * FROM priceOfferListVolumeDiscount where id = " . $attr['id'] . "";

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $Row['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                $Row['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
                $response['response'] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = 'No record found.';
        }
        return $response;
    }

    function delete_sp_id($attr)
    {

        $arr_attr = array();
        $arr_attr = (array) $attr;
        $this->objGeneral->mysql_clean($arr_attr);

        /* $Sql = "UPDATE crm_volume_discount
          SET
          status=0
          WHERE id = ".$arr_attr['id']." Limit 1"; */

        $Sql = "DELETE FROM crm_volume_discount
			WHERE id = " . $arr_attr['id'] . " Limit 1";


        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not delete!';
        }

        return $response;
    }

    function delete_customer_price_volume($attr)
    {
        $arr_attr = array();
        $arr_attr = (array) $attr;
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "UPDATE crm_volume_discount
                          SET
                              status=0
                              WHERE id = " . $arr_attr['id'] . " Limit 1";

        /*$Sql = "DELETE FROM crm_volume_discount
			WHERE id = ".$arr_attr['id']." Limit 1";*/

        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not deleted!';
        }
        return $response;
    }

    function add_purchase_info_volume($arr_attr)
    {
        //$this->objGeneral->mysql_clean($arr_attr);

        $response = array();
        $response2 = array();

        $sql_volume = "SELECT  ef.id,ef.start_date,ef.volume_id,ef.end_date
		FROM srm_volume_discount ef
		WHERE  
		ef.status=1  and  ef.product_id='" . $arr_attr['product_id'] . "' 	and ef.supplier_id='" . $arr_attr['supplier_id'] . "' 
		and 	ef.purchase_info_id='" . $arr_attr['purchase_info_id'] . "'
		and ef.company_id=" . $this->arrUser['company_id'] . " ";
        $rs_volume = $this->objsetup->CSI($sql_volume);
        //echo $sql_volume;exit;
        if ($rs_volume->RecordCount() > 0) {
            $result = array();
            while ($Row = $rs_volume->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['volume_id'] = $Row['volume_id'];
                $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);

                $response2['response_volume'][] = $result;
            }
        }

        //print_r($response2['response_volume'] );

        $sql_total = "SELECT  ef.id	FROM 
		product_supplier_volume ef
		WHERE  
		ef.status=1  and  ef.product_id='" . $arr_attr['product_id'] . "' 	and ef.supplier_id='" . $arr_attr['supplier_id'] . "' 
		and 
		('" . $arr_attr['volume_id']->quantity_from . "' BETWEEN ef.quantity_from AND ef.quantity_to 
		OR 
		'" . $arr_attr['volume_id']->quantity_to . "'  BETWEEN ef.quantity_from AND ef.quantity_to )
		and ef.company_id=" . $this->arrUser['company_id'] . "
		";
        $rs_count = $this->objsetup->CSI($sql_total);
        //	echo $sql_total;exit;

        $from = $this->objGeneral->convert_date($arr_attr['start_date1']); //$this->objGeneral->convert_date($arr_attr['start_date1']);
        $to = $this->objGeneral->convert_date($arr_attr['end_date1']); //$this->objGeneral->convert_date($arr_attr['end_date1']);

        $total = 0;
        if ($rs_count->RecordCount() > 0) {
            while ($Row = $rs_count->FetchRow()) {

                foreach ($response2['response_volume'] as $key => $value) {

                    if ($value['volume_id'] == $Row['id']) {

                        if ((($from >= $value['start_date']) && ($from <= $value['end_date']) || (($to >= $value['start_date']) && ($to <= $value['end_date'])))) /* if( (  ( $from > $this->objGeneral->convert_date(gmdate("d-m-Y", $value['start_date'])) )
                          && ( $from < $this->objGeneral->convert_date(gmdate("d-m-Y", $value['end_date']) ) )
                          )	||	( ( $to > $this->objGeneral->convert_date(gmdate("d-m-Yd", $value['start_date'])) )
                          && ( $to < $this->objGeneral->convert_date(gmdate("d-m-Y", $value['end_date']) )) )   )
                         */ {
                            $total++;
                        }
                    }
                }
            }
        }
        //echo $total;exit;

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
        } else {


            $Sqli = "SELECT max(ef.volume_type) as count
			FROM srm_volume_discount ef
			WHERE ef.status=1
			and volume_id= '" . $arr_attr['volume_id']->id . "'	and product_id='" . $arr_attr['product_id'] . "' 
			and supplier_id='" . $arr_attr['supplier_id'] . "'  and 	purchase_info_id='" . $arr_attr['purchase_info_id'] . "'
			and ef.company_id=" . $this->arrUser['company_id'] . " ";
            $crm = $this->objsetup->CSI($Sqli)->FetchRow();
            $nubmer = $crm['count'] + 1;
            //echo $Sqli; exit;

            $Sql = "INSERT  INTO srm_volume_discount SET  
			product_id='" . $arr_attr['product_id'] . "'  
			,supplier_id='" . $arr_attr['supplier_id'] . "' 
			,purchase_info_id='$arr_attr[purchase_info_id]'
			,volume_id= '" . $arr_attr['volume_id']->id . "'
			,supplier_type='" . $arr_attr['supplier_type']->id . "'
			,volume_type='" . $nubmer . "'
			,purchase_price='$arr_attr[purchase_price]'
			,discount_value='$arr_attr[discount_value]'
			,discount_price='$arr_attr[discount_price]'
			,start_date= '" . $this->objGeneral->convert_date($arr_attr['start_date']) . "'
			,end_date= '" . $this->objGeneral->convert_date($arr_attr['end_date']) . "'
			 
			,company_id=" . $this->arrUser['company_id'] . " 
			,date_added='" . current_date . "'
			,user_id=" . "'" . $this->arrUser['id'] . "'
			,status= 1
			,AddedBy='" . $this->arrUser['id'] . "'
			,AddedOn=UNIX_TIMESTAMP (NOW())";
            //	echo $Sql;exit;

            $response = $this->objGeneral->run_query_exception($Sql);
        }

        return $response;
    }

    function add_product_value($arr_attr)
    {
        //exit;
        /* error_reporting(E_ALL);
          ini_set('display_errors', 1); */
        $current_date = $this->objGeneral->convert_date(date('Y-m-d'));
        $start_date1 = $this->objGeneral->convert_date($arr_attr->start_date1);
        $end_date1 = $this->objGeneral->convert_date($arr_attr->end_date1);

        $response = array();
        $response2 = array();

        $sql_volume = "SELECT  ef.id,ef.start_date,ef.volume_id,ef.end_date
		FROM crm_volume_discount ef
		WHERE  
		ef.status=1  and  ef.customer_item_info_id='" . $arr_attr->customer_item_info_id . "'
		and ef.company_id=" . $this->arrUser['company_id'] . " ";
        $rs_volume = $this->objsetup->CSI($sql_volume);
        // echo $sql_volume;//exit;
        if ($rs_volume->RecordCount() > 0) {
            $result = array();
            while ($Row = $rs_volume->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['volume_id'] = $Row['volume_id'];
                $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);

                $response2['response_volume'][] = $result;
            }
        }


        $sql_total = "SELECT  ef.id	FROM 
		crm_product_volume ef
		WHERE  
		ef.status=1  and  ef.customer_item_info_id='" . $arr_attr->customer_item_info_id . "' and
		('" . $arr_attr->quantity_from . "' BETWEEN ef.quantity_from AND ef.quantity_to 
		OR 
		'" . $arr_attr->quantity_to . "'  BETWEEN ef.quantity_from AND ef.quantity_to )
		and ef.company_id=" . $this->arrUser['company_id'] . " ";
        $rs_count = $this->objsetup->CSI($sql_total);
        //echo $sql_total;exit;


        $from = $this->objGeneral->convert_date($arr_attr->start_date1);
        $to = $this->objGeneral->convert_date($arr_attr->end_date1);

        $total = 0;
        if ($rs_count->RecordCount() > 0) {
            while ($Row = $rs_count->FetchRow()) {

                foreach ($response2['response_volume'] as $key => $value) {

                    if ($value['volume_id'] == $Row['id']) {
                        /* 		  echo $from;
                          echo '<br>';

                          echo $arr_attr['start_date1'];
                          echo '<br>';
                          echo	gmdate("d-m-Y", $value['start_date']) ;
                          echo '<br>';
                          echo	gmdate("d-m-Y", $value['end_date']) ;
                          echo $value['end_date'];
                         */
                        if ((($from >= $value['start_date']) && ($from <= $value['end_date']) || (($to >= $value['start_date']) && ($to <= $value['end_date'])))) /* if( (  ( $from > $this->objGeneral->convert_date(gmdate("d-m-Y", $value['start_date'])) )
                          && ( $from < $this->objGeneral->convert_date(gmdate("d-m-Y", $value['end_date']) ) )
                          )	||	( ( $to > $this->objGeneral->convert_date(gmdate("d-m-Yd", $value['start_date'])) )
                          && ( $to < $this->objGeneral->convert_date(gmdate("d-m-Y", $value['end_date']) )) )   )
                         */ {
                            $total++;
                        }
                    }
                }
            }
        }
        //echo $total;exit;
        if ($total > 0) {

            $response['ack'] = 2;
            $response['error'] = 'Record not inserted!';
            $response['edit'] = 0;
            return $response;
            exit;
        } else {

            $Sql1 = "INSERT INTO crm_volume_discount SET  
			 volume_id='" . $arr_attr->volume_1s . "'  
			 ,volume_type=1
			,discount_type='" . $arr_attr->supplier_type_1s . "' 
			,customer_item_info_id='" . $arr_attr->customer_item_info_id . "' 
			,customer_product_type_id='" . $arr_attr->customer_product_type_id . "' 
			 ,price='" . $arr_attr->purchase_price_1 . "' 
			,discount='" . $arr_attr->discount_value_1 . "'  
			 ,discounted_price='" . $arr_attr->discount_price_1 . "'	
			 ,product_id='" . $arr_attr->item_id . "'											 		
			,start_date=  '" . $start_date1 . "'
			,end_date=   '" . $end_date1 . "'
			,crm_id='" . $arr_attr->crm_id . "' 	,status='1'  
			,company_id='" . $this->arrUser['company_id'] . "' 
			,user_id='" . $this->arrUser['id'] . "'
			,date_added='" . $current_date . "'";
        }

        //echo $Sql1; exit;
        $RS = $this->objsetup->CSI($Sql1);
        $id = $this->Conn->Insert_ID();
        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['id'] = $id;
            $response['edit'] = 0;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
            $response['edit'] = 0;
        }
        return $response;
    }

    function update_product_value($arr_attr)
    {
        $current_date = $this->objGeneral->convert_date(date('Y-m-d'));
        $start_date1 = $this->objGeneral->convert_date($arr_attr->start_date1);
        $end_date1 = $this->objGeneral->convert_date($arr_attr->end_date1);

        $Sql1 = "UPDATE crm_volume_discount SET  
				 			volume_id='" . $arr_attr->volume_1s . "'
							,discount_type='" . $arr_attr->supplier_type_1s . "' 
							 ,price='" . $arr_attr->purchase_price_1 . "' 
							,discount='" . $arr_attr->discount_value_1 . "'  
							 ,discounted_price='" . $arr_attr->discount_price_1 . "'	
							 ,product_id='" . $arr_attr->item_id . "'											 		
							,start_date=  '" . $start_date1 . "'
							,end_date=   '" . $end_date1 . "'  
							WHERE id = '" . $arr_attr->id . "' limit 1";
        $RS = $this->objsetup->CSI($Sql1);

        //echo $Sql1; exit;

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['edit'] = 1;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated!';
            $response['edit'] = 1;
        }

        return $response;
    }

    // CRM Price offer module start
    //--------------------------------------------

    function get_sale_cust_price_offer_volume($attr)
    {
        //$this->objGeneral->mysql_clean($attr);
        $order_type = "";
        $response = array();

        $customer_price_info_id = $attr['customer_price_info_id'][0];
        $strLimit = '';

        if (isset($attr['isAdded']) && $attr['isAdded'] > 0)
            $strLimit = ' ORDER BY p.id DESC limit ' . count($attr['customer_price_info_id']);

        $Sql = "SELECT p.*,
		( SELECT wh.title  FROM units_of_measure_setup st
		 JOIN units_of_measure as wh ON wh.id = st.cat_id
		where st.id =p.unit_category_id and st.status=1 ) as cat_name ,
		crm.name as crm_name
		FROM crm_product_volume p
		LEFT JOIN crm ON (crm.id = p.crm_id)

		WHERE p.customer_price_info_id =" . $customer_price_info_id . "  AND p.status=1 " . $strLimit;

        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'p', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();

                $result['id'] = $Row['id'];
                $result['crm_id'] = $Row['crm_id'];
                $crm = $Row['crm_name'];
                $result['quantity_to'] = $Row['quantity_from'];
                $result['quantity_from'] = $Row['crm_id'];
                $result['customer_price_info_id'] = $Row['customer_price_info_id'];
                $result['name'] = $Row['quantity_from'] . '-' . $Row['quantity_to'] . ' ' . $Row['cat_name'] . '-' . $crm;

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        /* echo "<pre>";
          print_r($response);exit; */
        return $response;
    }

    function add_sale_cust_price_offer_volume($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        //	print_r($arr_attr);exit;
        $id = $arr_attr['id'];

        $update_check = "";

        if ($id > 0)
            $update_check = "  AND tst.id <> '" . $id . "'";

        $data_pass = "   tst.type='" . $arr_attr['type'] . "'
								 and tst.product_id='" . $arr_attr['item_id'] . "'
								 and tst.crm_id='" . $arr_attr['crm_id'] . "'
								 and tst.unit_category_id='" . $arr_attr['unit_categorys'] . "'
							 	 and (($arr_attr[quantity_from] BETWEEN tst.quantity_from AND tst.quantity_to)
							 	 OR ($arr_attr[quantity_to] BETWEEN tst.quantity_from AND tst.quantity_to))

								 and tst.customer_price_info_id = '" . $arr_attr['customer_price_info_id'] . " $update_check
								 ";
        $total = $this->objGeneral->count_duplicate_in_sql('crm_product_volume', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($id == 0) {


            $Sql = "INSERT INTO crm_product_volume SET
										type='" . $arr_attr['type'] . "'
										,crm_id='" . $arr_attr['crm_id'] . "'
										,product_id='" . $arr_attr['item_id'] . "'
										,quantity_from='" . $arr_attr['quantity_from'] . "'
										,quantity_to='" . $arr_attr['quantity_to'] . "'
										,unit_category_id='" . $arr_attr['unit_categorys'] . "'
										,customer_price_info_id='" . $arr_attr['customer_price_info_id'] . "'
										,company_id='" . $this->arrUser['company_id'] . "'
										,user_id='" . $this->arrUser['id'] . "'";
            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
        } else {
            $Sql = "UPDATE crm_product_volume SET
										 type='" . $arr_attr['type'] . "'
										WHERE id = " . $id . "   Limit 1";
            $RS = $this->objsetup->CSI($Sql);
        }
        //echo $Sql;exit;

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;
            $response['error'] = 'Record Inserted Successfully';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
        }
        return $response;
    }

    function submitPriceVolumeDiscount($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        $current_date = $this->objGeneral->convert_date(date('Y-m-d'));
        $start_date1 = $this->objGeneral->convert_date($arr_attr['start_date1']);
        $end_date1 = $this->objGeneral->convert_date($arr_attr['end_date1']);

        //print_r($arr_attr);exit;
        $id = $arr_attr['id'];

        $response = array();
        $response2 = array();

        $sqlVolumeDisc = "SELECT vd.id,
                                 vd.start_date,
                                 vd.end_date,                                 
                                 vd.priceVolID
                          FROM priceOfferListVolumeDiscount vd
                          WHERE vd.status=1  and  
                                vd.priceID='" . $arr_attr['priceID'] . "' and
                                vd.company_id=" . $this->arrUser['company_id'] . " ";

        //echo $sqlVolumeDisc;//exit;
        $rsVolumeDisc = $this->objsetup->CSI($sqlVolumeDisc);

        if ($rsVolumeDisc->RecordCount() > 0) {
            $result = array();
            while ($Row = $rsVolumeDisc->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['priceVolID'] = $Row['priceVolID'];
                $result['start_date'] = $Row['start_date'];
                $result['end_date'] = $Row['end_date'];

                $response2['responsePriceVolume'][] = $result;
            }
        }

        $sqlPriceVol = "SELECT  Pv.id
                        FROM priceOfferListVolume Pv
                        WHERE   Pv.status=1  and  
                                Pv.priceID='" . $arr_attr['priceID'] . "' and
                                ('" . $arr_attr['quantity_from'] . "' BETWEEN Pv.quantity_from AND Pv.quantity_to OR
                                 '" . $arr_attr['quantity_to'] . "'  BETWEEN Pv.quantity_from AND Pv.quantity_to ) and
                                Pv.company_id=" . $this->arrUser['company_id'] . " ";

        $rsPriceVol = $this->objsetup->CSI($sqlPriceVol);

        $from = $this->objGeneral->convert_date($arr_attr['start_date1']);
        $to = $this->objGeneral->convert_date($arr_attr['end_date1']);

        $total = 0;

        if ($rsPriceVol->RecordCount() > 0 && $rsVolumeDisc->RecordCount() > 0) {
            while ($Row = $rsPriceVol->FetchRow()) {
                foreach ($response2['responsePriceVolume'] as $key => $value) {
                    if ($value['priceVolID'] == $Row['id']) {
                        if ((($from >= $value['start_date']) && ($from <= $value['end_date']) || (($to >= $value['start_date']) && ($to <= $value['end_date'])))) {
                            if ($id > 0) {
                                if ($value['id'] != $id)
                                    $total++;
                            } else
                                $total++;
                        }
                    }
                }
            }
        }

        if ($total > 0) {

            $response['ack'] = 2;
            $response['error'] = 'Record Date Overlaps !';
            $response['edit'] = 0;
            return $response;
        }


        if ($id > 0) {

            $Sql = "UPDATE priceOfferListVolumeDiscount
                            SET
                                price='" . $arr_attr['price'] . "',
                                discountType='" . $arr_attr['discountType'] . "',
                                discount='" . $arr_attr['discount'] . "',
                                discountedPrice='" . $arr_attr['discountedPrice'] . "',
                                start_date=  '" . $start_date1 . "',
                                end_date=   '" . $end_date1 . "',
                                ChangedBy='" . $this->arrUser['id'] . "',
                                ChangedOn='" . $current_date . "'
                                WHERE id = " . $id;
            //echo $Sql; exit;
            $RS = $this->objsetup->CSI($Sql);

            if ($this->Conn->Affected_Rows() > 0) {
                $response['ack'] = 1;
                $response['error'] = NULL;
                $response['id'] = $id;
                $response['edit'] = 0;

                $arr_attr['priceVolDiscID'] = $id;
                // $this->addPriceVolDiscHistory($arr_attr);
            } else {
                $response['ack'] = 0;
                $response['error'] = 'Record not insert !';
                $response['edit'] = 1;
            }
        } else {


            $Sql1 = "INSERT INTO priceOfferListVolumeDiscount
                                    SET
                                        priceID='" . $arr_attr['priceID'] . "',
                                        product_id='" . $arr_attr['product_id'] . "',
                                        priceVolID='" . $arr_attr['priceVolID'] . "',                                      
                                        price='" . $arr_attr['price'] . "',
                                        discountType='" . $arr_attr['discountType'] . "',
                                        discount='" . $arr_attr['discount'] . "',
                                        discountedPrice='" . $arr_attr['discountedPrice'] . "',
                                        start_date=  '" . $start_date1 . "',
                                        end_date=   '" . $end_date1 . "',
                                        status='1',
                                        company_id='" . $this->arrUser['company_id'] . "',
                                        user_id='" . $this->arrUser['id'] . "',
                                        created_date='" . $current_date . "',
                                        AddedBy='" . $this->arrUser['id'] . "',
                                        AddedOn=UNIX_TIMESTAMP (NOW()),
                                        ChangedBy='" . $this->arrUser['id'] . "',
                                        ChangedOn='" . $current_date . "'";

            //echo $Sql1; exit;                              

            $RS = $this->objsetup->CSI($Sql1);
            $id = $this->Conn->Insert_ID();

            if ($id > 0) {
                $response['ack'] = 1;
                $response['error'] = NULL;
                $response['id'] = $id;
                $response['edit'] = 0;

                $arr_attr['priceVolDiscID'] = $id;
                // $this->addPriceVolDiscHistory($arr_attr);
            } else {
                $response['ack'] = 0;
                $response['error'] = 'Record not insert !';
                $response['edit'] = 0;
            }
        }

        return $response;
    }

    function get_price_volume_discount_listing($attr)
    {
        $Sql = "SELECT pvd.*
                FROM SR_PriceVolumeDiscount_sel as pvd
                where pvd.priceID ='" . $attr['id'] . "' AND pvd.status=1 ";

        //echo $Sql; exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();

                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                if ($Row['moduleType'] == 1)
                    $modulename = $Row['crm_name'];
                elseif ($Row['moduleType'] == 2)
                    $modulename = $Row['srm_name'];

                $result['id'] = $Row['id'];
                $result['price_volume_history'] = $Row['price_volume_history'];
                $result['volume'] = $Row['quantity_from'] . '-' . $Row['quantity_to'] . ' ' . $Row['uom'] . '-' . $modulename;
                $result['price'] = $Row['price'];
                $result['discount_type'] = $Row['discountType'] == 1 ? 'Percentage' : 'Value';
                $result['discount'] = $Row['discountType'] == 1 ? $Row['discount'] . ' %' : $Row['discount'];
                $result['discounted_price'] = $Row['discountedPrice'];
                $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;

            //echo "<pre>"; print_r($response['response']); exit;

        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = 'No record found.';
        }
        return $response;
    }

    // CRM Price offer module end
    //--------------------------------------------
    // CRM Price list module start
    //--------------------------------------------

    // function to add price module volume 

    function add_price_volume($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        //print_r($arr_attr);exit;
        $current_date = $this->objGeneral->convert_date(date('Y-m-d'));

        $data_pass = "  tst.product_id='" . $arr_attr['item_id'] . "' and 
                        tst.uomID='" . $arr_attr['uomID'] . "' and
                        tst.quantity_from = '" . $arr_attr['quantity_from'] . "' and 
                        tst.quantity_to = '" . $arr_attr['quantity_to'] . "' and 
                        tst.priceID = '" . $arr_attr['priceID'] . "'";

        $total = $this->objGeneral->count_duplicate_in_sql('priceOfferListVolume', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }


        $Sql = "INSERT INTO priceOfferListVolume 
                                    SET
                                        priceID='" . $arr_attr['priceID'] . "',
                                        uomID='" . $arr_attr['uomID'] . "',
                                        quantity_from='" . $arr_attr['quantity_from'] . "',
                                        quantity_to='" . $arr_attr['quantity_to'] . "',
                                        product_id='" . $arr_attr['item_id'] . "',
                                        company_id='" . $this->arrUser['company_id'] . "',
                                        status=1,
                                        user_id='" . $this->arrUser['id'] . "',
                                        AddedBy='" . $this->arrUser['id'] . "',
                                        AddedOn=UNIX_TIMESTAMP (NOW()),
                                        created_date='" . $current_date . "'";
        //echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;
            $response['error'] = 'Record Inserted Successfully';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
        }
        return $response;
    }

    // function to get price module volume

    function get_price_volume($attr)
    {
        $Sql = "SELECT  pv.*,p.moduleType,
                        ( SELECT wh.title  
                          FROM units_of_measure_setup st
                          JOIN units_of_measure as wh ON wh.id = st.cat_id
                          where st.id =pv.uomID and 
                                st.status=1 ) as uom_name ,
                        crm_module.name as crmmodulename,
                        srm_module.name as srmmodulename
                FROM priceOfferListVolume pv
                LEFT JOIN priceOfferListModule as p ON (p.id = pv.priceID)
                LEFT JOIN crm as crm_module ON (crm_module.id = p.moduleID and p.moduleType =1)
                LEFT JOIN srm as srm_module ON (srm_module.id = p.moduleID and p.moduleType =2)
                WHERE pv.priceID ='" . $attr['priceID'] . "'  AND 
                      pv.status=1 ";

        //echo $Sql; exit;

        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();

                $modulename = '';


                if ($Row['moduleType'] == 1)
                    $modulename = $Row['crmmodulename'];
                elseif ($Row['moduleType'] == 2)
                    $modulename = $Row['srmmodulename'];

                $result['id'] = $Row['id'];
                $result['quantity_to'] = $Row['quantity_to'];
                $result['quantity_from'] = $Row['quantity_from'];
                $result['name'] = $Row['quantity_from'] . '-' . $Row['quantity_to'] . ' ' . $Row['uom_name'] . '-' . $modulename;

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


    // CRM Price list module end
    //--------------------------------------------


    function get_crm_salesperson($arr_attr)
    {
        $type = "";
        $order_type = "";
        $response = array();

        if (!empty($arr_attr['type']))
            $type .= "and type = '" . $arr_attr['type'] . "' ";
        if (!empty($arr_attr['bucket_id']))
            $type .= "and bucket_id = '" . $arr_attr['bucket_id'] . "' ";

        $Sql = "SELECT c.* 
                FROM crm_salesperson c 
                LEFT JOIN bucket b on c.bucket_id = b.id
                WHERE b.status = 1 AND module_id = '" . $arr_attr['id'] . "'  " . $type . " AND  
                      (end_date IS NULL OR end_date=0) ";


        $total_limit = pagination_limit;
        if ($arr_attr['pagination_limits'])
            $total_limit = $arr_attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($arr_attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;

        $RS = $this->objsetup->CSI($response['q']);
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
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_crm_salesperson($arr_attr)
    {
        $value = "";
        $bucket_ids = "";
        $ids = "";

        //print_r($arr_attr);
        if ($arr_attr['type'] == 1) {
            $Sql2 = "UPDATE crm_sale_target_detail SET status=0 WHERE   cd.sale_group_id='" . $arr_attr['id'] . "'";
            $rs = $this->objsetup->CSI($Sql2);
        }

        $check = false;
        $Sql = "INSERT INTO crm_salesperson (module_id,salesperson_id,type,is_primary,company_id, user_id,bucket_id,start_date) VALUES ";

        foreach ($arr_attr['salespersons'] as $item) {

            // echo "<pre>";print_r($item);
            if ($item->bucket_id > 0)
                $bucket_ids .= $item->bucket_id . ',';
            else
                $item->bucket_id = 0;

            // $id = explode('.', $item->id);
            // $ids .= $id[0] . ',';
            $ids .= $item->id . ',';


            if ($item->isPrimary > 0)
                $is_primary = $item->isPrimary;
            else
                $is_primary = 0;

            $Sql .= "(  '" . $arr_attr['id'] . "' ," . $item->id . " ," . $arr_attr['type'] . ", '" . $is_primary . "' ," . $this->arrUser['company_id'] . " ," . $this->arrUser['id'] . ",'" . $item->bucket_id . "' ,'" . current_date . "' ), ";
            $check = true;

            if ($arr_attr['type'] == 1)
                $this->set_target_detail($value->id, $arr_attr['id']);
        }

        $bucket_ids = substr($bucket_ids, 0, -1);
        if ($bucket_ids)
            $where_del = "AND bucket_id IN ($bucket_ids)";
        else
            $where_del = "AND bucket_id =0";

        $where_del = "";

        $ids = substr($ids, 0, -1);
        $sql_del = "DELETE FROM crm_salesperson WHERE module_id='" . $arr_attr['id'] . "' AND type='" . $arr_attr['type'] . "' $where_del ";
        //echo $sql_del;
        //  echo "<hr/>";
        // echo $Sql;
        // exit; 
        $rssql_del = $this->objsetup->CSI($sql_del);

        $Sql = substr_replace(substr($Sql, 0, -1), "", -1);
        $RS = $this->objsetup->CSI($Sql);


        if ($check) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function set_target_detail($id, $module)
    {


        /*  SELECT  FROM crm_sale_target_detail cp  WHERE
          not EXISTS  (
          SELECT ct.salesperson_id FROM `crm_salesperson` ct
          where  cp.sale_person_id = ct.salesperson_id and ct.module_id=58
          )
         */
        // if($RS->RecordCount()>0){
        // while($Row = $RS->FetchRow()){
        //if($Row['id']==$id)  {
        $Sql = "UPDATE crm_sale_target_detail cd SET status=1 WHERE  cd.sale_person_id =$id and ct.module_id=$module Limit 1 ";
        //echo $Sql  ;exit;
        $rs = $this->objsetup->CSI($Sql);
        //}
        //}
        //}
    }

    function getCrmSalesTargetUsingEmpId($arr_attr)
    {
        // written by Ahmad
        // primary purpose to get Commission information inside "HR Employee Salary, Pension and Entitled Holiday" Page
        $Sql = "SELECT id,sale_code FROM crm_sale_target WHERE sale_person_id = '" . $arr_attr['id'] . "'";
        $RS = $this->objsetup->CSI($Sql);
        $response = "";
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
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
        //print_r($response['response']);exit;
    }

    function get_crm_salesperson_employee($arr_attr)
    {
        $where_clause = "";
        $order_type = "";
        $response = array();

        //print_r($arr_attr);exit;
        $Sql = "SELECT c.salesperson_id FROM crm_salesperson  c
  WHERE module_id = '" . $arr_attr['id'] . "'  and type =2  
  and c.company_id=" . $this->arrUser['company_id'] . " ";
        //echo $Sql;exit;
        $total_limit = pagination_limit;
        if ($arr_attr['pagination_limits'])
            $total_limit = $arr_attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($arr_attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';
        $arrIds = array();
        $strIds = '';
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $arrIds[] = $Row['salesperson_id'];
            };
        }

        $strIds = implode(',', $arrIds);
        $response = array();


        if (!empty($strIds)) {
            $Sql = "SELECT es.id  ,es.user_code,es.first_name,es.last_name,es.job_title
  ,
        SR_EMPLOYEE_DEPARTMENTS(es.id, es.user_company) AS `dname`
  from employees  es
  where es.user_company=" . $this->arrUser['company_id'] . "
  " . $where_clause . " 
  and es.id in (" . $strIds . ") 
  ORDER BY es.id DESC";
            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);

            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['user_code'] = $Row['user_code'];
                    $result['first_name'] = $Row['first_name'];
                    $result['last_name'] = $Row['last_name'];

                    $result['job_title'] = $Row['job_title'];
                    $result['department'] = $Row['dname'];

                    $response['response'][] = $result;
                }
                $response['ack'] = 1;
                $response['error'] = NULL;
            }
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_crm_salesperson_log($arr_attr)
    {
        return; // removing table crm_salesperson_log from db as it is not being used
        //date_default_timezone_set('Australia/Melbourne');
        // $current_date = date('Y-m-d H:i:s');
        foreach ($arr_attr['salespersons'] as $value) {
            $salespersonarray[] = $value->id;
        }

        $strIds = implode(',', $salespersonarray);

        $Sql1 = "UPDATE crm_salesperson_log  
                            SET  
                                end_date = '" . current_date . "'
                                WHERE  end_date IS NULL and 
                                       crm_id= '" . $arr_attr['id'] . "' and 
                                       salesperson_id NOT IN (" . $strIds . ") and 
                                       company_id='" . $this->arrUser['company_id'] . "'";

        $RS1 = $this->objsetup->CSI($Sql1);

        foreach ($arr_attr['salespersons'] as $value) {

            $is_primary = 0;

            if ($value->isPrimary > 0)
                $is_primary = $value->isPrimary;
            else
                $is_primary = 0;

            if ($is_primary > 0) {
                $is_primarySql = "UPDATE crm_salesperson_log  
                                  SET  
                                    is_primary = 0
                                    WHERE  is_primary=1 and 
                                        crm_id= '" . $arr_attr['id'] . "' and 
                                        company_id='" . $this->arrUser['company_id'] . "'";

                /* echo $is_primarySql;
                exit; */
                $is_primaryRS1 = $this->objsetup->CSI($is_primarySql);
            }

            /*======= Query for store procedure start */

            // $LabelString= "salesperson_id,is_primary";
            // $InputString= $value->id."\',\'".$is_primary;

            // $Sql = "CALL SR_MaintainHistoryLog('crm_salesperson_log','crm_id','" . $arr_attr['id']. "','".$LabelString."',\"" . $InputString . "\",'" . $this->arrUser['company_id'] . "','" . $this->arrUser['id'] . "')";
            //echo $Sql;

            //$this->objsetup->CSI($Sql);
            /*======= Query for store procedure end */

            $selSql = "SELECT id
                        FROM crm_salesperson_log
                        WHERE end_date IS NULL AND
                              crm_id= '" . $arr_attr['id'] . "' AND 
                              salesperson_id= '" . $value->id . "' AND 
                              company_id='" . $this->arrUser['company_id'] . "'";

            $selRS1 = $this->objsetup->CSI($selSql);

            if ($selRS1->RecordCount() == 0) {

                $Sql = "INSERT INTO crm_salesperson_log
                                                SET 
                                                    salesperson_id='" . $value->id . "',
                                                    crm_id='" . $arr_attr['id'] . "',
                                                    is_primary='" . $is_primary . "',
                                                    company_id='" . $this->arrUser['company_id'] . "',
                                                    user_id='" . $this->arrUser['id'] . "',
                                                    created_date='" . current_date . "',
                                                    start_date='" . current_date . "'";
                //echo $Sql;// exit;
                $RS = $this->objsetup->CSI($Sql);
            } elseif ($selRS1->RecordCount() > 0 && $is_primary > 0) {

                $Sql = "UPDATE crm_salesperson_log  
                                  SET  
                                    is_primary='" . $is_primary . "',
                                    WHERE  is_primary =0 and 
                                        crm_id= '" . $arr_attr['id'] . "' and
                                        salesperson_id= '" . $value->id . "' AND  
                                        company_id='" . $this->arrUser['company_id'] . "'";
                //echo $Sql;// exit;
                $RS = $this->objsetup->CSI($Sql);
            }
        }
        //exit;
    }

    ///Opportunity Cycle tab area Starts

    function getCRMSalespersons($arr_attr)
    {
        $type = "";
        $order_type = "";
        $response = array();

        if (isset($arr_attr['type']))
            $type .= "and crm_sp.type = '" . $arr_attr['type'] . "' ";

        $Sql = "SELECT emp.id,emp.user_code as code,CONCAT(emp.first_name,' ',emp.last_name) as name,emp.job_title,emp.user_email as email,
                       emp.work_phone as telephone, crm_sp.is_primary AS is_primary
                FROM crm_salesperson as crm_sp
                LEFT JOIN employees as emp on emp.id= crm_sp.salesperson_id
                WHERE crm_sp.module_id = '" . $arr_attr['crm_id'] . "'  " . $type . " AND (crm_sp.end_date IS NULL OR crm_sp.end_date=0)";

        // echo $Sql;exit;
        $total_limit = pagination_limit;
        if ($arr_attr['pagination_limits'])
            $total_limit = $arr_attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($arr_attr, $Sql, $response, $total_limit, 'crm_sp', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
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
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_opp_cycle_salesperson($arr_attr)
    {
        // print_r($arr_attr); exit;
        $current_date = date('Y-m-d H:i:s');

        $sql = "DELETE FROM crm_opp_cycle_salesperson WHERE crm_opportunity_cycle_detail_id='" . $arr_attr['id'] . "'";
        $this->objsetup->CSI($sql);

        //echo "<pre>"; print_r($arr_attr['salespersons']);

        $check = false;

        foreach ($arr_attr['salespersons'] as $value) {
            // print_r($arr_attr[currency_id]->id); //exit;
            $Sql = "INSERT INTO crm_opp_cycle_salesperson
                                      SET
                                            salesperson_id=" . $value->id . ",
                                            crm_opportunity_cycle_detail_id='" . $arr_attr['id'] . "',
                                            user_id='" . $this->arrUser['id'] . "',
                                            company_id='" . $this->arrUser['company_id'] . "',
                                            added_on='" . strtotime($current_date) . "'
                                            ";
            // echo "<hr>".$Sql;exit;
            // is_primary='" . $value->isPrimary . "',
            //crm_id='".$arr_attr['crm_id']."',opp_cycle_id='$arr_attr[opp_cycle_id]',
            //tab_id='$arr_attr[tab_id]',
            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();

            if ($id > 0)
                $check = true;
            else
                $check = false;
        }

        $response = array();
        if ($check) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_opp_cycle_SupportStaff($arr_attr)
    {
        $current_date = date('Y-m-d H:i:s');

        $sql = "DELETE FROM crm_opp_cycle_SupportStaff 
                WHERE crm_opportunity_cycle_detail_id='" . $arr_attr['id'] . "'";
        $this->objsetup->CSI($sql);

        //echo "<pre>"; print_r($arr_attr);exit;

        $check = false; //supportstaff
        foreach ($arr_attr['supportstaff'] as $value) {
            $Sql = "INSERT INTO crm_opp_cycle_SupportStaff
                                      SET
                                            employee_id=" . $value->id . ",
                                            crm_opportunity_cycle_detail_id='" . $arr_attr['id'] . "',
                                            user_id='" . $this->arrUser['id'] . "',
                                            company_id='" . $this->arrUser['company_id'] . "',
                                            added_on='" . strtotime($current_date) . "'
                                            ";
            // echo "<hr>".$Sql;exit;
            //crm_id='".$arr_attr['crm_id']."',opp_cycle_id='$arr_attr[opp_cycle_id]',
            //tab_id='$arr_attr[tab_id]',
            //is_primary='" . $value->isPrimary . "',
            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
            if ($id > 0) {
                $check = true;
            } else
                $check = false;
        }
        //exit;

        $response = array();
        if ($check) {

            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function get_opp_cycle_salesperson($arr_attr)
    {
        $Sql = "SELECT * FROM crm_opp_cycle_salesperson  WHERE crm_opportunity_cycle_detail_id='" . $arr_attr['id'] . "'";

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

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
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function get_opp_cycle_support_staff($arr_attr)
    {
        $Sql = "SELECT * 
                FROM crm_opp_cycle_SupportStaff  
                WHERE crm_opportunity_cycle_detail_id='" . $arr_attr['id'] . "'";

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

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
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function get_pref_method_of_comm($attr = null)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $response = array();
        // WHERE    c.company_id =" . $this->arrUser['company_id'] . " 
        $Sql = "SELECT c.* FROM crm_pref_method_of_communiction c ";

        //defualt Variable
        $total_limit = pagination_limit;
        $order_by = 'ORDER BY c.title ';

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_by);
        //echo $response['q'];   exit;
        $RS = $this->objsetup->CSI($response['q']);
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

    function get_crmSalesPerson($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $response = array();
        // WHERE    c.company_id =" . $this->arrUser['company_id'] . " 
        /* $Sql = "SELECT emp.id as spid ,emp.is_primary, es.job_title,CONCAT( es.first_name,' ',es.last_name) as  name, CONCAT( es.id,'.',emp.id) as  id2,es.id as id,SR_EMPLOYEE_DEPARTMENTS(es.id, es.user_company) AS dep_name
                    FROM crm_salesperson emp  
                    left JOIN employees  es on es.id=emp.salesperson_id
                    WHERE emp.company_id=" . $this->arrUser['company_id'] . " AND emp.module_id IN (".$attr['id'].") 
                    GROUP BY es.id "; */

        $Sql = "SELECT emp.id,CONCAT( emp.first_name,' ',emp.last_name) as  name 
                FROM crm c  
                left JOIN employees  emp on emp.id = c.salesperson_id
                WHERE c.company_id=" . $this->arrUser['company_id'] . " AND c.id IN (" . $attr['id'] . ")";

        //defualt Variable
        $total_limit = pagination_limit;
        $order_by = 'ORDER BY emp.id ';

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_by);
        //echo $response['q'];   exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $response['response'] = $result;
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

    function add_pref_method_of_comm($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        $Sql = "INSERT INTO crm_pref_method_of_communiction
			SET `status`=1,`title`='" . $arr_attr['title'] . "',`description`='" . $arr_attr['description'] . "',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";

        //echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);
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

        return $response;
    }

    function add_crm_segment($arr_attr)
    {
        $sql = "DELETE FROM crm_selected_segment WHERE crm_id='" . $arr_attr['id'] . "'";
        $this->objsetup->CSI($sql);
        //echo "<pre>"; print_r($arr_attr['segments']);
        foreach ($arr_attr['segments'] as $value) {
            $Sql = "INSERT INTO crm_selected_segment
					SET segment_id=" . $value->id . ",crm_id='" . $arr_attr['id'] . "',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
            //echo $Sql; //exit;
            $RS = $this->objsetup->CSI($Sql);
        }
    }

    function get_crm_segments($arr_attr)
    {
        $Sql = "SELECT segment_id FROM crm_selected_segment WHERE crm_id = " . $arr_attr['id'] . "";

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $response['response'][] = $Row['segment_id'];
            };
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_crm_region($arr_attr)
    {
        $sql = "DELETE FROM crm_selected_region WHERE crm_id='" . $arr_attr['id'] . "'";
        $this->objsetup->CSI($sql);
        //echo "<pre>"; print_r($arr_attr['customers']);
        foreach ($arr_attr['regions'] as $value) {
            $Sql = "INSERT INTO crm_selected_region
					SET region_id=" . $value->id . ",crm_id='" . $arr_attr['id'] . "',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
            //echo $Sql; //exit;
            $RS = $this->objsetup->CSI($Sql);
        }
    }

    function get_crm_regions($arr_attr)
    {
        $Sql = "SELECT region_id FROM crm_selected_region
			WHERE crm_id = " . $arr_attr['id'] . "";

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $response['response'][] = $Row['region_id'];
            };
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_crm_buying_group($arr_attr)
    {
        $sql = "DELETE FROM crm_selected_buying_group WHERE crm_id='" . $arr_attr['id'] . "'";
        $this->objsetup->CSI($sql);
        //echo "<pre>"; print_r($arr_attr['customers']);
        foreach ($arr_attr['buying_groups'] as $value) {
            $Sql = "INSERT INTO crm_selected_buying_group
					SET buying_group_id=" . $value->id . ",crm_id='" . $arr_attr['id'] . "',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
            //echo $Sql; //exit;
            $RS = $this->objsetup->CSI($Sql);
        }
    }

    function get_crm_buying_groups($arr_attr)
    {
        $Sql = "SELECT buying_group_id FROM crm_selected_buying_group
			WHERE crm_id = " . $arr_attr['id'] . "";

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $response['response'][] = $Row['buying_group_id'];
            };
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_credit_rating_log($arr_attr)
    {
    }



    function add_status_log($arr_attr)
    {
    }

    function add_alt_location_region($arr_attr)
    {
        $sql = "DELETE FROM crm_alt_location_selected_region WHERE alt_location_id='" . $arr_attr['id'] . "'";
        $this->objsetup->CSI($sql);
        //echo "<pre>"; print_r($arr_attr['customers']);
        foreach ($arr_attr['regions'] as $value) {
            $Sql = "INSERT INTO crm_alt_location_selected_region
					SET region_id=" . $value->id . ",alt_location_id='" . $arr_attr['id'] . "',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
            //echo $Sql; //exit;
            $RS = $this->objsetup->CSI($Sql);
        }
    }

    function get_alt_location_regions($arr_attr)
    {
        $Sql = "SELECT region_id FROM crm_alt_location_selected_region
			WHERE alt_location_id = " . $arr_attr['id'] . "";

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $response['response'][] = $Row['region_id'];
            };
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    // CRM Ownership  Module
    //--------------------------------------------------------------------
    function get_all_owner($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $order_type = "";
        $response = array();

        $Sql = "SELECT id, title,description FROM crm_owner where status=1 AND company_id='" . $this->arrUser['company_id'] . "'  ";

        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'crm_owner', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


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
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_crm_owner($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);


        //print_r($arr_attr);exit;
        $Sql = "INSERT INTO crm_owner SET 
			title='" . $arr_attr['title'] . "'
			,description='" . $arr_attr['description'] . "'
			,status=1 
			,company_id='" . $this->arrUser['company_id'] . "'
			,user_id='" . $this->arrUser['id'] . "'
			,created_date='" . current_date . "'
			";
        //echo $Sql;exit;
        $response = $this->objGeneral->run_query_exception($Sql);
        return $response;
    }

    // CRM volume competeter  Module
    //--------------------------------------------------------------------
    function get_all_competitor_volume($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $order_type = "";
        $response = array();

        $Sql = "SELECT id, title,description  FROM crm_competitor_volume ";

        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'crm_competitor_volume', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


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
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_all_competitor_volume($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);


        //print_r($arr_attr);exit;
        $Sql = "INSERT INTO crm_competitor_volume SET 
			title='" . $arr_attr['title'] . "'
			,description='" . $arr_attr['description'] . "'
			,status=1 
			,company_id='" . $this->arrUser['company_id'] . "'
			,user_id='" . $this->arrUser['id'] . "'
			,created_date='" . current_date . "'
			";
        //echo $Sql;exit;
        $response = $this->objGeneral->run_query_exception($Sql);
        return $response;
    }

    function get_all_address_types($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $order_type = "";
        $response = array();

        $Sql = "SELECT id, title,description   FROM ref_address_type";
        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'ref_address_type', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
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
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_adddress_type($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        $current_date = date('Y-m-d H:i:s');
        $Sql = "INSERT INTO ref_address_type
    SET `status`=1,`title`='" . $arr_attr['title'] . "',`description`='" . $arr_attr['description'] . "',created_date='" . strtotime($current_date) . "',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";

        // echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);
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

        return $response;
    }

    ////////////Mudassir/////
    function get_crm_turnovers($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "SELECT crm_turnover.* FROM crm_turnover 
            INNER JOIN company ON company.id=crm_turnover.company_id
            WHERE crm_turnover.company_id='" . $this->arrUser['company_id'] . "' AND crm_turnover.user_id='" . $this->arrUser['id'] . "' AND crm_turnover.status=1
        ORDER BY id DESC";

        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['turns'] = $Row['turn_from'] . " - " . $Row['turn_to'];
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

    function add_crm_turnover($arr_attr)
    {

        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "INSERT INTO crm_turnover
    SET `status`=1,`turn_from`='$arr_attr[turn_from]',`turn_to`='$arr_attr[turn_to]',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";

        $RS = $this->objsetup->CSI($Sql);
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

        return $response;
    }

    function get_crm_history($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        if ($attr['type'] == "Salespersons") {
            return; // removing table crm_salesperson_log from db as it is not being used


            $Sql = "SELECT crm_salesperson_log.*, employees.first_name, employees.last_name, employees.job_title,
                           us.first_name AS e_fname, us.last_name AS e_lname
                    FROM crm_salesperson_log
                    LEFT JOIN employees ON employees.id=crm_salesperson_log.salesperson_id
                    LEFT JOIN employees us ON us.id=crm_salesperson_log.user_id
                    WHERE crm_salesperson_log.company_id='" . $this->arrUser['company_id'] . "' AND crm_salesperson_log.user_id='" . $this->arrUser['id'] . "' AND
                          crm_salesperson_log.crm_id='" . $attr['crm_id'] . "'
                    ORDER BY id DESC";
            //echo $Sql;exit;

            $RS = $this->objsetup->CSI($Sql);

            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['id'];
                    /*$result['first_name'] = $Row['first_name'];
                    $result['last_name'] = $Row['last_name'];*/
                    $result['Saleperson'] = $Row['first_name'] . " " . $Row['last_name'];
                    $result['job_title'] = $Row['job_title'];
                    //$result['changed_on'] = $this->objGeneral->convert_unix_into_date($Row['created_date']);
                    //$result['is_primary'] = $Row['is_primary'];
                    $result['changed_by'] = $Row['e_fname'] . " " . $Row['e_lname'];
                    $result['Start_date'] = $this->objGeneral->convert_unix_into_datetime($Row['start_date']);
                    $result['End_date'] = $this->objGeneral->convert_unix_into_datetime($Row['end_date']);

                    $response['response'][] = $result;
                }
                $response['ack'] = 1;
                $response['error'] = NULL;
            } else {
                $response['response'][] = array();
                $response['ack'] = 0;
                $response['error'] = NULL;
            }
        } else if ($attr['type'] == "CreditLimit") {

            $Sql = "SELECT crm_credit_limit_log.*, crm_credit_rating.title AS credit_limit, us.first_name AS e_fname, us.last_name AS e_lname
                    FROM crm_credit_limit_log
                    LEFT JOIN crm_credit_rating ON crm_credit_rating.id=crm_credit_limit_log.credit_limit
                    LEFT JOIN employees us ON us.id=crm_credit_limit_log.user_id
                    WHERE crm_credit_limit_log.company_id='" . $this->arrUser['company_id'] . "' AND crm_credit_limit_log.user_id='" . $this->arrUser['id'] . "'
                          AND crm_credit_limit_log.crm_id='" . $attr['crm_id'] . "'
                    ORDER BY id DESC";

            /*echo $Sql;
            exit;*/
            $RS = $this->objsetup->CSI($Sql);

            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['credit_rating'] = $Row['credit_limit'];
                    $result['changed_by'] = $Row['e_fname'] . " " . $Row['e_lname'];
                    // $result['date'] = $this->objGeneral->convert_unix_into_date($Row['created_date']);                   
                    $result['Start_date'] = $this->objGeneral->convert_unix_into_datetime($Row['start_date']);
                    $result['End_date'] = $this->objGeneral->convert_unix_into_datetime($Row['end_date']);
                    $response['response'][] = $result;
                }
                $response['ack'] = 1;
                $response['error'] = NULL;
            } else {
                $response['response'][] = array();
                $response['ack'] = 0;
                $response['error'] = NULL;
            }
        } else if ($attr['type'] == "Status") {
            //crm_status.title AS stitle,

            $Sql = "SELECT crm_status_log.*, us.first_name AS e_fname, us.last_name AS e_lname,
                           CASE WHEN crm_status_log.status_id = 0 THEN 'Active'
                                WHEN crm_status_log.status_id = 1 THEN 'InActive'
                                else crm_status.title
                           End  as stitle
                    FROM crm_status_log
                    LEFT JOIN crm_status ON crm_status.id=crm_status_log.status_id
                    LEFT JOIN employees us ON us.id=crm_status_log.user_id
                    WHERE crm_status_log.company_id='" . $this->arrUser['company_id'] . "' AND crm_status_log.user_id='" . $this->arrUser['id'] . "' AND
                          crm_status_log.crm_id='" . $attr['crm_id'] . "'
                    ORDER BY id DESC";

            //	echo $Sql;exit;

            $RS = $this->objsetup->CSI($Sql);

            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['status'] = $Row['stitle'];
                    $result['changed_by'] = $Row['e_fname'] . " " . $Row['e_lname'];
                    //$result['date'] = $this->objGeneral->convert_unix_into_date($Row['created_date']);                    
                    $result['Start_date'] = $this->objGeneral->convert_unix_into_datetime($Row['start_date']);
                    $result['End_date'] = $this->objGeneral->convert_unix_into_datetime($Row['end_date']);
                    $response['response'][] = $result;
                }
                $response['ack'] = 1;
                $response['error'] = NULL;
            } else {
                $response['response'][] = array();
                $response['ack'] = 0;
                $response['error'] = NULL;
            }
        }

        return $response;
    }

    function get_social_medias($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $forGlobalArrayChk = '';

        if ($attr['forGlobalArray'] > 0) {

            $forGlobalArrayChk = 'ORDER BY ref.name';
        } else {

            $forGlobalArrayChk = 'ORDER BY ref.id DESC';
        }

        $Sql = "SELECT ref.* 
                FROM ref_social_media as ref
                WHERE  ref.status=1 and 
                       ref.company_id='" . $this->arrUser['company_id'] . "'    
                $forGlobalArrayChk";

        $RS = $this->objsetup->CSI($Sql);

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
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_social_media($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        //print_r($arr_attr);exit;


        if (!empty($arr_attr['id']))
            $where_id = "AND tst.id <> '" . $arr_attr['id'] . "'";

        $data_pass = "   tst.name='" . $arr_attr['name'] . "'   $where_id ";
        $total = $this->objGeneral->count_duplicate_in_sql('ref_social_media', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }


        $Sql = "INSERT INTO ref_social_media SET  name='" . $arr_attr['name'] . "' ,description='" . $arr_attr['description'] . "' ,status=1  ,company_id='" . $this->arrUser['company_id'] . "' ,user_id='" . $this->arrUser['id'] . "' ,date_created='" . current_date . "' ";
        //echo $Sql;exit;
        $response = $this->objGeneral->run_query_exception($Sql);
        return $response;
    }

    function update_crm_social_media($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);


        if (!empty($arr_attr['id']))
            $where_id = "AND tst.id <>  '" . $arr_attr['id'] . "' ";

        $data_pass = "   tst.name='" . $arr_attr['name'] . "'   $where_id ";
        $total = $this->objGeneral->count_duplicate_in_sql('ref_social_media', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }


        $Sql = "update   ref_social_media SET  name='" . $arr_attr['name'] . "'    where id= " . $arr_attr['id'] . "  limit 1";

        $response = $this->objGeneral->run_query_exception($Sql);
        return $response;
    }

    function add_crm_social_media($arr_attr)
    {
        //  $this->objGeneral->mysql_clean($arr_attr);

        $sqld = "DELETE FROM crm_social_media   where    crm_id=" . $arr_attr['id'] . "  and  company_id='" . $this->arrUser['company_id'] . "' ";
        $this->objsetup->CSI($sqld);

        $Sqle = "INSERT INTO crm_social_media (crm_id,media_id,address, company_id,user_id,date_created) VALUES ";

        //echo "<pre>";print_r($arr_attr['social_mediascrm']);exit;

        foreach ($arr_attr['social_mediascrm'] as $item) {
            if ($item->media_id->id)
                $Sqle .= "(  " . $arr_attr['id'] . ",'" . $item->media_id->id . "' ,'" . $item->addrees . "'," . $this->arrUser['company_id'] . "	," . $this->arrUser['id'] . "	,'" . current_date . "' ),";
        }


        $RS = $this->objsetup->CSI((substr($Sqle, 0, -1)));
        return true;
        exit;
        //old method single record

        $Sql = "SELECT crm_social_media.id FROM crm_social_media INNER JOIN company ON company.id=crm_social_media.company_id
		INNER JOIN ref_social_media ON ref_social_media.id=crm_social_media.media_id WHERE crm_social_media.company_id='" . $this->arrUser['company_id'] . "' "
            . "AND crm_social_media.user_id='" . $this->arrUser['id'] . "' AND "
            . "crm_social_media.media_id='" . $arr_attr['media_id'] . "' AND "
            . "crm_social_media.address='" . $arr_attr['address'] . "'
		AND crm_social_media.status=1 
		AND crm_social_media.crm_id='" . $arr_attr['crm_id'] . "' 
		ORDER BY id DESC limit 1";
        //echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record already exist.';
            $response['Update'] = 0;
            return $response;
            exit;
        }


        $Sql = "INSERT INTO crm_social_media   SET `status`=1,`crm_id`='" . $arr_attr['crm_id'] . "',`media_id`='$arr_attr[media_id]' ,`address`='" . $arr_attr['address'] . "',user_id='" . $this->arrUser['id'] . "' ,company_id='" . $this->arrUser['company_id'] . "', date_created=NOW()";


        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['Update'] = 0;
            $response['id'] = $id;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not Saved.';
            $response['Update'] = 0;
        }
        return $response;
    }

    function get_crm_social_medias($attr)
    {
        // $this->objGeneral->mysql_clean($attr);
        $order_type = "";
        $response = array();

        $Sql = "SELECT crm_social_media.*, ref_social_media.name AS sname  FROM crm_social_media  INNER JOIN company ON company.id=crm_social_media.company_id INNER JOIN ref_social_media ON ref_social_media.id=crm_social_media.media_id WHERE crm_social_media.company_id='" . $this->arrUser['company_id'] . "' 	AND crm_social_media.user_id='" . $this->arrUser['id'] . "'  AND crm_social_media.status=1  AND crm_social_media.crm_id='" . $attr['crm_id'] . "'    ";

        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'crm_social_media', $order_type);
        //echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['social_media'] = $Row['sname'];
                $result['media_id'] = $Row['media_id'];
                $result['addrees'] = $Row['address'];

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

    function add_alt_contact_social_media($arr_attr)
    {

        //  $this->objGeneral->mysql_clean($arr_attr);

        $sqld = "DELETE FROM alt_contact_social_media   where    crm_id=" . $arr_attr['crm_id'] . "  and  company_id='" . $this->arrUser['company_id'] . "' and alt_contact_id='$arr_attr[alt_contact_id]' ";
        $this->objsetup->CSI($sqld);

        $Sqle = "INSERT INTO alt_contact_social_media (alt_contact_id,crm_id,media_id,address, company_id,user_id,date_created) VALUES ";

        foreach ($arr_attr['alitcotact_scoial'] as $item) {
            if ($item->media_id->id)
                $Sqle .= "(   $arr_attr[alt_contact_id]," . $arr_attr['crm_id'] . ",'" . $item->media_id->id . "' ,'" . $item->addrees . "'," . $this->arrUser['company_id'] . "	," . $this->arrUser['id'] . "	,'" . current_date . "' ),";
        }
        //echo $Sqle;exit;

        $RS = $this->objsetup->CSI((substr($Sqle, 0, -1)));
        return true;
        exit;
        //old method single record
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "SELECT alt_contact_social_media.id FROM alt_contact_social_media 
                INNER JOIN company ON company.id=alt_contact_social_media.company_id
                INNER JOIN ref_social_media ON ref_social_media.id=alt_contact_social_media.media_id
                WHERE alt_contact_social_media.company_id='" . $this->arrUser['company_id'] . "' "
            . "AND alt_contact_social_media.user_id='" . $this->arrUser['id'] . "' AND "
            . "alt_contact_social_media.alt_contact_id='" . $arr_attr['alt_contact_id'] . "' AND "
            . "alt_contact_social_media.crm_id='" . $arr_attr['crm_id'] . "' AND "
            . "alt_contact_social_media.media_id='" . $arr_attr['media_id'] . "' AND "
            . "alt_contact_social_media.address='" . $arr_attr['address'] . "'
        AND alt_contact_social_media.status=1 ORDER BY id DESC";

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record already exist.';
            $response['Update'] = 0;
        } else {
            $Sql = "INSERT INTO alt_contact_social_media
                    SET `status`=1,`alt_contact_id`='$arr_attr[alt_contact_id]',`crm_id`='" . $arr_attr['crm_id'] . "',`media_id`='$arr_attr[media_id]',`address`='" . $arr_attr['address'] . "',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "', date_created=NOW()";

            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();

            if ($id > 0) {
                $response['ack'] = 1;
                $response['error'] = NULL;
                $response['Update'] = 0;
                $response['id'] = $id;
            } else {
                $response['ack'] = 0;
                $response['error'] = 'Record not Saved.';
                $response['Update'] = 0;
            }
        }
        return $response;
    }

    function get_alt_contact_social_medias($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "SELECT alt_contact_social_media.*, ref_social_media.name AS sname  FROM alt_contact_social_media 
            INNER JOIN company ON company.id=alt_contact_social_media.company_id
            INNER JOIN ref_social_media ON ref_social_media.id=alt_contact_social_media.media_id
            WHERE alt_contact_social_media.company_id='" . $this->arrUser['company_id'] . "' AND alt_contact_social_media.user_id='" . $this->arrUser['id'] . "' AND alt_contact_social_media.crm_id='" . $attr['crm_id'] . "' AND alt_contact_social_media.alt_contact_id='" . $attr['alt_contact_id'] . "' AND alt_contact_social_media.status=1 ORDER BY id DESC";

        /// echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['sname'] = $Row['sname'];
                $result['media_id'] = $Row['media_id'];
                $result['addrees'] = $Row['address'];
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

    function add_crm_credit_rating($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);


        $data_pass = "  tst.company_id='" . $this->arrUser['company_id'] . "'
                        AND tst.user_id='" . $this->arrUser['id'] . "'
                        AND  tst.crm_id='" . $arr_attr['crm_id'] . "'
                        AND  tst.title='" . $arr_attr['title'] . "'
                        AND tst.status=1";
        $total = $this->objGeneral->count_duplicate_in_sql('crm_credit_rating', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO crm_credit_rating
                                        SET 
                                            `status`=1,
                                            `crm_id`='" . $arr_attr['crm_id'] . "',
                                            `title`='" . $arr_attr['title'] . "',
                                            `description`='" . $arr_attr['description'] . "',
                                            user_id='" . $this->arrUser['id'] . "',
                                            company_id='" . $this->arrUser['company_id'] . "', 
                                            date_created=NOW()";

        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['Update'] = 0;
            $response['id'] = $id;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not Saved.';
            $response['Update'] = 0;
        }
        // }
        return $response;
    }

    function get_crm_credit_ratings($attr = null)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "SELECT *  
                FROM crm_credit_rating
                WHERE company_id='" . $this->arrUser['company_id'] . "'  AND 
                      status=1 
                ORDER BY id DESC";

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['title'] = utf8_encode($Row['title']);
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

    /* ================      customer item info Add form changes start   ================== */

    function get_customer_items_info($attr)
    {
        $strWhere = '';
        $order_type = "";
        $response = "";

        if (isset($attr['crm_ids'])) {
            $strWhere .= " and crm_price_offer.crm_id =" . $attr["crm_ids"];
        }

        if (isset($attr['price_type'])) {
            $strWhere .= " and crm_price_offer.price_type in (" . $attr["price_type"] . ",3)";
        }


        $Sql = "Select crm_price_offer.*,crm_price_offer.customer_product_type_id as type,currency.code as Code,crm_price_offer.is_sales_vol_disc,
				crm.customer_code as Customer_Code,
		crm.name as 'Customer_Name',
		alt_depot.depot as Alt_Location,
		crm_region.title as Region,
		crm_segment.title as Segment,
		crm_buying_group.title as Buying_Group,

		IFNULL((SELECT count(crmVD.id) FROM crm_volume_discount as crmVD
					  WHERE crmVD.customer_item_info_id = crm_price_offer.id),0) as is_vol_disc,

		IFNULL((SELECT count(exCust.id) FROM excluded_customer as exCust
					  WHERE exCust.customer_item_info_id = crm_price_offer.id),0) as is_exclud_cust,

		
		products.product_code as Item_Code,products.description as Item_Description, CONCAT(employeesOffered_By.first_name,' ',employeesOffered_By.last_name) as Offered_By,uom.title as 'Unit_Of_Measure',crm_price_offer.price_offered as Price,crm_price_offer.start_date as Start_Date,crm_price_offer.end_date as End_Date
			 FROM customer_item_info as crm_price_offer

			LEFT OUTER JOIN employees employeesOffered_By ON ( employeesOffered_By.id = crm_price_offer.offered_by_id)

			LEFT OUTER JOIN crm ON ( crm.id = crm_price_offer.crm_id and (crm_price_offer.customer_product_type_id = 1 OR crm_price_offer.customer_product_type_id = 2))
			LEFT OUTER JOIN crm_region ON ( crm_region.id = crm_price_offer.crm_id and crm_price_offer.customer_product_type_id = 3)
			LEFT OUTER JOIN crm_segment ON ( crm_segment.id = crm_price_offer.crm_id and crm_price_offer.customer_product_type_id = 4)
			LEFT OUTER JOIN crm_buying_group ON ( crm_buying_group.id = crm_price_offer.crm_id and crm_price_offer.customer_product_type_id = 5)
			LEFT OUTER JOIN alt_depot ON ( alt_depot.id = crm_price_offer.crm_alt_location_id)

			LEFT OUTER JOIN currency ON ( currency.id = crm_price_offer.currency_id) 

			LEFT JOIN units_of_measure_setup AS unitSetup1 ON (crm_price_offer.unit_of_measure_id = unitSetup1.id)
			LEFT JOIN units_of_measure AS uom ON (uom.id = unitSetup1.cat_id)

			LEFT OUTER JOIN product products ON ( products.id = crm_price_offer.product_id)



		WHERE 1 " . $strWhere . "  and crm_price_offer.user_id='" . $this->arrUser['id'] . "' and crm_price_offer.company_id='" . $this->arrUser['company_id'] . "'  ";
        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'crm_price_offer', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $Row['created_date'] = $this->objGeneral->convert_unix_into_date($Row['created_date']);
                $Row['Start_Date'] = $this->objGeneral->convert_unix_into_date($Row['Start_Date']);
                $Row['End_Date'] = $this->objGeneral->convert_unix_into_date($Row['End_Date']);

                $Row['detail'] = array();
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 1;
            $response['error'] = NULL;
        }
        return $response;
    }

    function get_customer_item_info_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $order_type = "";
        $response = "";

        $Sql = "Select crm_price_offer.*,crm_price_offer.customer_product_type_id as type,currency.code as Code,crm_price_offer.is_sales_vol_disc,
				crm.customer_code as Customer_Code,
		crm.name as 'Customer_Name',

		IFNULL((SELECT count(crmVD.id) FROM crm_volume_discount as crmVD
					  WHERE crmVD.customer_item_info_id = crm_price_offer.id),0) as is_vol_disc,

		IFNULL((SELECT count(exCust.id) FROM excluded_customer as exCust
					  WHERE exCust.customer_item_info_id = crm_price_offer.id),0) as is_exclud_cust,

		
		products.product_code as `Item_Code`,products.description as `Item_Description`, CONCAT(employeesOffered_By.first_name,' ',employeesOffered_By.last_name) as `Offered_By`,uom.title as 'Unit_Of_Measure',crm_price_offer.price_offered as `Price`,crm_price_offer.start_date as `Start_Date`,crm_price_offer.end_date as `End_Date` 
			 FROM `customer_item_info` as crm_price_offer

			LEFT OUTER JOIN employees employeesOffered_By ON ( employeesOffered_By.id = crm_price_offer.offered_by_id)

			LEFT OUTER JOIN crm ON ( crm.id = crm_price_offer.crm_id and (crm_price_offer.customer_product_type_id = 1 OR crm_price_offer.customer_product_type_id = 2))
			

			LEFT OUTER JOIN currency ON ( currency.id = crm_price_offer.currency_id) 

			LEFT JOIN units_of_measure_setup AS unitSetup1 ON (crm_price_offer.unit_of_measure_id = unitSetup1.id)
			LEFT JOIN units_of_measure AS uom ON (uom.id = unitSetup1.cat_id)

			LEFT OUTER JOIN product products ON ( products.id = crm_price_offer.product_id)



		WHERE crm_price_offer.id='" . $attr['id'] . "'";

        /* ".$strWhere."  and crm_price_offer.user_id='".$this->arrUser['id']."' and crm_price_offer.company_id='".$this->arrUser['company_id']."' ORDER BY crm_price_offer.id DESC */

        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'crm_price_offer', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $Row['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
            $Row['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);

            $response['response'] = $Row;
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function add_customer_item_info($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $start_date = $this->objGeneral->convert_date($attr['offer_date']);
        $end_date = $this->objGeneral->convert_date($attr['offer_valid_date']);

        if ($start_date > $end_date) {
            $response['ack'] = 0;
            $response['error'] = 'Start Date is Greater than End Date';
            return $response;
        }

        $current_date = $this->objGeneral->convert_date(date('Y-m-d'));

        $loc_string = $attr['location_id'];
        $loc_string = rtrim($loc_string, ',');

        $locArray = explode(',', $loc_string);

        if (sizeof($locArray) > 0) {

            for ($i = 0; $i < sizeof($locArray); $i++) {
                $crm_loc = $locArray[$i];

                if ($crm_loc > 0) {
                    $data_pass1 = "  tst.crm_id='" . $attr['crm_id'] . "' AND
                                     tst.product_id = '" . $attr['product_id'] . "' AND
                                     tst.customer_product_type_id = 1 AND
                                     ('" . $start_date . "' BETWEEN tst.start_date AND tst.end_date OR
                                      '" . $end_date . "'   BETWEEN tst.start_date AND tst.end_date ) AND
                                     FIND_IN_SET($crm_loc, crm_alt_location_id) ";

                    /*AND tst.id!=$attr['id']*/

                    /*
                                     tst.end_date >= '" . $start_date . "' AND*/

                    $loc_total = $this->objGeneral->count_duplicate_in_sql('customer_item_info', $data_pass1, $this->arrUser['company_id']);

                    if ($loc_total > 0) {
                        $response['ack'] = 0;
                        $response['error'] = 'Price Already Exists for Same Location in Same Dates.';
                        return $response;
                    }
                }
            }
        } else {
            $data_pass = "  tst.crm_id='" . $attr['crm_id'] . "' AND tst.product_id = '" . $attr['product_id'] . "' AND
                            tst.customer_product_type_id = '$attr[customer_product_type_id]' AND
                            tst.end_date >= '" . $start_date . "'";
            $total = $this->objGeneral->count_duplicate_in_sql('customer_item_info', $data_pass, $this->arrUser['company_id']);

            if ($total > 0) {
                $response['ack'] = 0;
                $response['error'] = 'Record Already Exists.';
                return $response;
            }
        }

        $is_sales_vol_disc = (isset($attr['is_sales_vol_disc'])) ? $attr['is_sales_vol_disc'] : 0;
        $vat_chk = (isset($attr['vat_chk'])) ? $attr['vat_chk'] : 0;

        $Sql = "INSERT INTO customer_item_info
                              SET
                                    crm_id = '" . $attr['crm_id'] . "',
                                    product_id = '" . $attr['product_id'] . "',
                                    crm_alt_location_id = '" . $attr['location_id'] . "',
                                    offered_by_id = '" . $attr['offered_by_id'] . "',
                                    offer_method_id = '" . $attr['offer_method_id'] . "',
                                    currency_id = '" . $attr['currency_id'] . "',
                                    is_sales_vol_disc = '" . $is_sales_vol_disc . "',
                                    min_order_qty = '" . $attr['min_order_qty'] . "',
                                    max_order_qty = '" . $attr['max_order_qty'] . "',
                                    price_offered = '" . $attr['price_offered'] . "',
                                    converted_price = '" . $attr['converted_price'] . "',
                                    vat_chk = '" . $vat_chk . "',
                                    customer_product_type_id = 1,
                                    price_type = 2,
                                    end_date = '" . $end_date . "',
                                    start_date = '" . $start_date . "',
                                    unit_of_measure_id = '" . $attr['unit_of_measure'] . "',
                                    created_date = '" . $current_date . "',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "'";

        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $attr['custPriceID'] = $id;
            $attr['price_type'] = 2;
            // $this->add_customer_price_history($attr);

            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['edit'] = 0;
            $response['id'] = $id;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted.';
            $response['edit'] = 0;
            $response['id'] = 0;
        }

        return $response;
    }

    function update_customer_item_info($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $start_date = $this->objGeneral->convert_date($attr['offer_date']);
        $end_date = $this->objGeneral->convert_date($attr['offer_valid_date']);

        if ($start_date > $end_date) {
            $response['ack'] = 0;
            $response['error'] = 'Start Date is Greater than End Date';
            return $response;
        }

        $loc_string = $attr['location_id'];
        $loc_string = rtrim($loc_string, ',');
        $locArray = explode(',', $loc_string);

        if (sizeof($locArray) > 0) {
            for ($i = 0; $i < sizeof($locArray); $i++) {
                $crm_loc = $locArray[$i];

                if ($crm_loc > 0) {
                    $data_pass1 = "  tst.crm_id='" . $attr['crm_id'] . "' AND
                                     tst.product_id = '" . $attr['product_id'] . "' AND
                                     ('" . $start_date . "' BETWEEN tst.start_date AND tst.end_date OR
                                      '" . $end_date . "'   BETWEEN tst.start_date AND tst.end_date ) AND
                                     FIND_IN_SET($crm_loc, crm_alt_location_id) AND tst.id!=" . $attr['id'] . "";

                    /*
                     * tst.end_date >= '" . $start_date . "' AND
                                     tst.customer_product_type_id = '$attr[customer_product_type_id]' AND*/

                    $loc_total = $this->objGeneral->count_duplicate_in_sql('customer_item_info', $data_pass1, $this->arrUser['company_id']);

                    if ($loc_total > 0) {
                        $response['ack'] = 0;
                        $response['error'] = 'Price Already Exists for Same Location in Same Dates.';
                        return $response;
                    }
                }
            }
        } else {
            $data_pass = "  tst.crm_id='" . $attr['crm_id'] . "' AND tst.product_id = '" . $attr['product_id'] . "' AND
                            tst.customer_product_type_id = 1 AND
                            ('" . $start_date . "' BETWEEN tst.start_date AND tst.end_date OR
                                      '" . $end_date . "'   BETWEEN tst.start_date AND tst.end_date )";
            /*
                                        tst.end_date >= '" . $start_date . "'*/

            $total = $this->objGeneral->count_duplicate_in_sql('customer_item_info', $data_pass, $this->arrUser['company_id']);

            if ($total > 0) {
                $response['ack'] = 0;
                $response['error'] = 'Record Already Exists.';
                return $response;
            }
        }

        $is_sales_vol_disc = (isset($attr['is_sales_vol_disc'])) ? $attr['is_sales_vol_disc'] : 0;
        $vat_chk = (isset($attr['vat_chk'])) ? $attr['vat_chk'] : 0;

        $Sql = "UPDATE customer_item_info
                        SET
                              product_id = '" . $attr['product_id'] . "',
                              crm_alt_location_id = '" . $attr['location_id'] . "',
                              offered_by_id = '" . $attr['offered_by_id'] . "',
                              offer_method_id = '" . $attr['offer_method_id'] . "',
                              currency_id = '" . $attr['currency_id'] . "',
                              is_sales_vol_disc = '" . $is_sales_vol_disc . "',
                              price_offered = '" . $attr['price_offered'] . "',
                              converted_price = '" . $attr['converted_price'] . "',
                              vat_chk = '" . $vat_chk . "',
                              min_order_qty = '" . $attr['min_order_qty'] . "',
                              max_order_qty = '" . $attr['max_order_qty'] . "',
                              end_date = '" . $end_date . "',
                              start_date = '" . $start_date . "',
                              unit_of_measure_id = '" . $attr['unit_of_measure'] . "'

                              WHERE id = " . $attr['id'] . "  Limit 1";

        /* crm_alt_location_id ='" . $attr['location_id'] . "', */

        // echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $attr['custPriceID'] = $attr['id'];
            $attr['price_type'] = 2;
            // $this->add_customer_price_history($attr);

            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['edit'] = 1;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be updated!';
            $response['edit'] = 0;
        }

        return $response;
    }

    /* ================      customer item info end   ================== */

    /* ================      Customer Price info  start   ================== */

    function priceOfferListing($attr)
    {
        $strWhere = '';
        $order_type = "";
        $response = array();

        $moduleForPermission = $this->objsetup->moduleDecider($attr["moduleType"], $attr["moduleID"]);

        $moduleForPermission = $moduleForPermission . "_pricetab";
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";

        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.", $attr, $fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.", $attr, $fieldsMeta);

        $Sql = "SELECT * FROM  (Select c.*,
                        (CASE
                            WHEN moduleType = 1 THEN
                                (concat(hr.first_name, ' ', hr.last_name))
                            ELSE    
                                ac.contact_name
                        END) AS offered_by1,
                       ac.contact_name
                FROM sr_priceoffersel as c
                left join sr_employee_sel as hr on c.offeredByID=hr.id AND c.moduleType = 1
                left join alt_contact as ac on c.offeredByID = ac.id AND c.moduleType = 2
                WHERE c.moduleID='" . $attr["moduleID"] . "' AND
                      c.moduleType='" . $attr["moduleType"] . "' AND
                      c.priceType in (" . $attr["priceType"] . ") AND
                      c.status=1 AND
                      c.company_id='" . $this->arrUser['company_id'] . "') AS tbl WHERE 1 $where_clause";

        $total_limit = pagination_limit;

        if ($order_clause == "")
            $order_type = "Order BY tbl.id DESC";
        else
            $order_type = $order_clause;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        // echo $response['q'];exit;
        // $RS = $this->objsetup->CSI($response['q']);
        $RS = $this->objsetup->CSI($response['q'], $moduleForPermission, sr_ViewPermission);

        $response['q'] = '';
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                // if ($attr["moduleType"] == 2)
                // {
                //     $Row['Offered_By'] = $Row['contact_name'];
                //     $Row['first_name'] = $Row['contact_name'];
                //     //print_r($Row);exit;
                // }
                // else
                // {
                //     $Row['Offered_By'] = $Row['offered_by1'];
                // }

                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 1;
            $response['error'] = NULL;
        }
        $tableName = $attr['priceType'] == "2,3" ? "PriceList" : "PriceOffer";
        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData($tableName);
        return $response;
    }

    function priceOfferbyID($attr)
    {
        $this->objGeneral->mysql_clean($attr);


        $moduleForPermission = $this->objsetup->moduleDecider($attr["moduleType"], $attr["moduleID"]);

        $moduleForPermission = $moduleForPermission . "_pricetab";

        if ($attr["moduleType"] == 2) {
            $Sql = "SELECT c.*,
                            cont.contact_name AS Offered_By,
                            cont.contact_name AS first_name,
                            '' AS last_name
                        FROM sr_priceoffersel as c
                        LEFT JOIN alt_contact as cont on c.offeredByID = cont.id AND cont.module_type =2
                        WHERE c.id='" . $attr['id'] . "' ";
        } else {

            $Sql = "SELECT c.*,
                        CONCAT(hr.first_name,' ',hr.last_name) AS Offered_By,
                        hr.first_name,
                        hr.last_name
                    FROM sr_priceoffersel as c
                    LEFT JOIN sr_employee_sel as hr on c.offeredByID=hr.id
                    WHERE c.id='" . $attr['id'] . "' ";
        }


        // echo $Sql;exit;

        // $RS = $this->objsetup->CSI($Sql);

        $RS = $this->objsetup->CSI($Sql, $moduleForPermission, sr_ViewPermission);

        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $Row['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
            $Row['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
            $attr['crm_id'] = $Row['moduleID'];
            $attr['module_type'] = $Row['moduleType'];
            $attr['priceID'] = $attr['id'];

            $response['response'] = $Row;
            //echo "<pre>";print_r($attr);exit;

            // setup class function
            /* $result1 = $this->objsetup->get_offer_method_list();
            $response['response']['OfferMethod'] = $result1['response']; */

            if ($Row['moduleType'] == 1) {
                $result1 = $this->price_form_predata();
            } elseif ($Row['moduleType'] == 2) {
                $result1 = $this->objSrm->price_form_predata();
            }


            $response['response']['OfferMethod'] = $result1['response']['OfferMethod'];

            // fetching price items function
            $result2 = $this->priceOfferItembyID($attr['priceID']);
            $response['response']['items'] = $result2['response'];

            //echo "<pre>";print_r($response['response']);exit;
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function priceOfferItembyID($priceID)
    {
        $Sql = "Select *
                FROM sr_priceitemsel
                WHERE priceID='" . $priceID . "' AND status=1 ";
        //echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                $itemID = $Row['itemID'];
                $itemrecID = $Row['id'];

                //echo "<pre>";print_r($response);exit;

                // fetching price items volume function
                $result = $this->priceOfferItemVolumebyID($itemID, $itemrecID, $priceID);
                $Row['itemsVolume'] = $result['response'];

                // fetching price items Additional Cost function
                $result = $this->priceListAdditionalCostbyID($itemID, $itemrecID, $priceID);
                $Row['itemsAdditionalCost'] = $result['response'];

                //$result2 = $this->objstock->get_products_setup_list($attr, 1);

                $Row['product_id'] = $itemID;

                $result2 = $this->objstock->get_unit_setup_list_category_by_item($Row);
                $Row['arr_units'] = $result2['response'];
                //$Row['uom'] = $result['response'];
                //$response['response']['prooduct_arr'] = $result13['response']; 

                // echo "<pre>";print_r($Row);exit;

                $response['response'][] = $Row;
            }
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function priceOfferItemVolumebyID($itemID, $itemrecID, $priceID)
    {
        $Sql = "Select id,discountType,discount,min
                FROM priceofferitemvolume
                WHERE priceID='" . $priceID . "' AND 
                      itemID='" . $itemID . "' AND 
                      status=1";
        //echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                $response['response'][] = $Row;
            }
            //echo "<pre>";print_r($response);exit;
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function priceListAdditionalCostbyID($itemID, $itemrecID, $priceID)
    {
        $Sql = "Select plac.id,
                        plac.description,
                        plac.cost,
                        plac.currencyID,
                        plac.currencyCode,
                        plac.cost_gl_code_id,
                        plac.cost_gl_code,
                        iac.title as description,
                        iac.id as iacid
                FROM price_list_additional_cost as plac
                LEFT JOIN item_additional_cost as iac on plac.descriptionID = iac.id
                WHERE plac.priceID='" . $priceID . "' AND 
                      plac.itemID='" . $itemID . "' AND 
                      plac.status=1";
        //echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                $response['response'][] = $Row;
            }
            //echo "<pre>";print_r($response);exit;
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function priceOfferItemVolumebyItemID($itemID)
    {
        $Sql = "Select id,discountType,discount,min
                FROM priceofferitemvolume
                WHERE
                      itemID='" . $itemID . "' AND 
                      type=2 AND
                      status=1";
        //echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                $response['response'][] = $Row;
            }
            //echo "<pre>";print_r($response);exit;
        } else {
            $response['response'] = array();
        }
        return $response;
    }


    function addPriceOffer($attr)
    {
        $itemsArr = $attr['items'];
        $this->objGeneral->mysql_clean($attr);

        $moduleForPermission = $this->objsetup->moduleDecider($attr["moduleType"], $attr["moduleID"]);

        $moduleForPermission = $moduleForPermission . "_pricetab";


        $start_date = $this->objGeneral->convert_date($attr['offer_date']);
        $end_date = $this->objGeneral->convert_date($attr['offer_valid_date']);
        $current_date = $this->objGeneral->convert_date(date('Y-m-d'));

        $data_pass = "  tst.moduleID='$attr[moduleID]' AND 
                        tst.moduleType='" . $attr['moduleType'] . "' AND
                        tst.priceType='" . $attr['priceType'] . "' AND
                        tst.name = '" . $attr['name'] . "' AND
                        tst.end_date >= '" . $start_date . "'";

        $total = $this->objGeneral->count_duplicate_in_sql('priceoffer', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;

        $offeredByID = (isset($attr['offeredByID']) && $attr['offeredByID'] != '') ? $attr['offeredByID'] : '0';
        $currency_id = (isset($attr['currency_id']) && $attr['currency_id'] != '') ? $attr['currency_id'] : '0';
        $Sql = "INSERT INTO priceoffer
                            SET
                                moduleID = '" . $attr['moduleID'] . "',
                                moduleType = '" . $attr['moduleType'] . "',
                                priceType = '" . $attr['priceType'] . "',
                                name = '" . $attr['name'] . "',
                                offeredByID = '" . $offeredByID . "',
                                offerMethodID = '" . $attr['offer_method_id'] . "',
                                currencyID = '" . $currency_id . "',
                                start_date = '" . $start_date . "',
                                end_date = '" . $end_date . "',
                                user_id='" . $this->arrUser['id'] . "',
                                status=1,
                                company_id='" . $this->arrUser['company_id'] . "',
                                AddedBy='" . $this->arrUser['id'] . "',
                                AddedOn=UNIX_TIMESTAMP (NOW()),
                                ChangedBy='" . $this->arrUser['id'] . "',
                                ChangedOn=UNIX_TIMESTAMP (NOW())";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql, $moduleForPermission, sr_AddPermission);


        // $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['edit'] = 0;
            $response['id'] = $id;

            foreach ($itemsArr as $item) {
                $itemID = $item->ItemID;
                $moduleID = $attr['moduleID'];
                $moduleType = $attr['moduleType'];

                $sql2 = " SELECT count(pf.id) as total 
                        FROM priceofferitem AS pft
                        LEFT JOIN priceoffer AS pf ON pft.priceID=pf.id
                        WHERE pft.company_id='" . $this->arrUser['company_id'] . "' AND 
                                pft.itemID='" . $itemID . "' AND 
                                pf.moduleID='" . $moduleID . "' AND 
                                pf.moduleType='" . $moduleType . "' AND 
                                pft.status=1  AND 
                                pf.id != " . $attr['id'] . " AND
                                (('" . $start_date . "' BETWEEN pf.start_date AND pf.end_date) OR 
                                ('" . $start_date . "' >= pf.start_date AND pf.end_date = 0) OR 
                                ('" . $end_date . "' BETWEEN pf.start_date AND pf.end_date) OR 
                                ('" . $end_date . "' >= pf.start_date AND pf.end_date = 0))";
                // echo $sql2;exit;

                $rs2 = $this->objsetup->CSI($sql2);

                if ($rs2->fields['total'] > 0) {
                    $this->Conn->rollbackTrans();
                    $this->Conn->autoCommit = true;

                    $response['ack'] = 0;
                    $response['error'] = 'Price offer dates for Item ovelaps with previous price offer!';
                    return $response;
                }
            }

            foreach ($itemsArr as $item) {
                $item->itemID = $item->ItemID;
                $item->uomID = $item->UOM->id;
                $item->startDate = $attr['offer_date'];
                $item->endDate = $attr['offer_valid_date'];
                $item->moduleID = $attr['moduleID'];
                $item->moduleType = $attr['moduleType'];

                $item->priceID = $id;
                $item = json_decode(json_encode($item), True);
                self::addPriceOfferItem($item);
            }

            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted.';
            $response['edit'] = 0;
            $response['id'] = 0;
        }
        return $response;
    }

    function updatePriceOffer($attr)
    {
        $moduleForPermission = $this->objsetup->moduleDecider($attr["moduleType"], $attr["moduleID"]);

        $moduleForPermission = $moduleForPermission . "_pricetab";

        $itemsArr = $attr['items'];
        $this->objGeneral->mysql_clean($attr);


        $start_date = $this->objGeneral->convert_date($attr['offer_date']);
        $end_date = $this->objGeneral->convert_date($attr['offer_valid_date']);

        $current_date = $this->objGeneral->convert_date(date('Y-m-d'));

        $data_pass = "  tst.moduleID='" . $attr['moduleID'] . "' AND
                        tst.moduleType='" . $attr['moduleType'] . "' AND
                        tst.priceType='" . $attr['priceType'] . "' AND
                        tst.name = '" . $attr['name'] . "' AND
                        tst.end_date >= '" . $start_date . "' AND tst.id!=" . $attr['id'] . "";

        $total = $this->objGeneral->count_duplicate_in_sql('priceoffer', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists in Same Dates!';
            return $response;
        }
        $offeredByID = (isset($attr['offeredByID']) && $attr['offeredByID'] != '') ? $attr['offeredByID'] : '0';

        $Sql = "UPDATE priceoffer
                        SET
                              name = '" . $attr['name'] . "',
                              offeredByID = '" . $offeredByID . "',
                              offerMethodID = '" . $attr['offer_method_id'] . "',
                              currencyID = '" . $attr['currency_id'] . "',
                              start_date = '" . $start_date . "',
                              end_date = '" . $end_date . "',
                              ChangedBy='" . $this->arrUser['id'] . "',
                              ChangedOn='" . $current_date . "'

                              WHERE id = " . $attr['id'] . "  Limit 1";
        //addslashes($attr['name']) 
        $RS = $this->objsetup->CSI($Sql, $moduleForPermission, sr_AddEditPermission);

        // echo $Sql."<hr>"; exit;
        // $RS = $this->objsetup->CSI($Sql);

        // if ($this->Conn->Affected_Rows() > 0) {
        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['edit'] = 1;
        // print_r($attr);exit;
        // print_r($attr['items']);exit;       


        $priceID = $attr['id'];

        foreach ($itemsArr as $item) {
            $itemID = $item->ItemID;
            $moduleID = $attr['moduleID'];
            $moduleType = $attr['moduleType'];

            $sql2 = " SELECT count(pf.id) as total 
                      FROM priceofferitem AS pft
                      LEFT JOIN priceoffer AS pf ON pft.priceID=pf.id
                      WHERE pft.company_id='" . $this->arrUser['company_id'] . "' AND 
                            pft.itemID='" . $itemID . "' AND 
                            pf.moduleID='" . $moduleID . "' AND 
                            pf.moduleType='" . $moduleType . "' AND 
                            pft.status=1  AND 
                            pf.id != " . $attr['id'] . " AND
                            (('" . $start_date . "' BETWEEN pf.start_date AND pf.end_date) OR 
                            ('" . $start_date . "' >= pf.start_date AND pf.end_date = 0) OR 
                            ('" . $end_date . "' BETWEEN pf.start_date AND pf.end_date) OR 
                            ('" . $end_date . "' >= pf.start_date AND pf.end_date = 0))";
            // echo $sql2;exit;

            $rs2 = $this->objsetup->CSI($sql2);

            if ($rs2->fields['total'] > 0) {
                $response['ack'] = 0;
                $response['error'] = 'Price offer dates for Item ovelaps with previous price offer!';
                return $response;
            }
        }

        foreach ($itemsArr as $item) {

            $item->itemID = $item->ItemID;
            $item->uomID = $item->UOM->id;
            $item->priceID = $attr['id'];
            $item = json_decode(json_encode($item), True);
            self::addPriceOfferItem($item);
        }


        // } else {
        //     $response['ack'] = 1;
        //     $response['error'] = 'Record not update!';
        //     $response['edit'] = 0;
        // }
        return $response;
    }

    function get_item_sales_prices_in_date_range($attr)
    {
        // echo "hello";exit;
        $start_date = $this->objGeneral->convert_date($attr['date_from']);
        $end_date = $this->objGeneral->convert_date($attr['date_to']);

        if ($end_date == 0) {
            $end_date = 4099299120;
        }
        $Sql = "SELECT *, COUNT(*) AS total_records FROM product_price
                WHERE
                    type = " . $attr['type'] . " AND
                    product_id IN($attr[selected_items]) AND
                    start_date <= $start_date AND end_date >= $end_date
                GROUP BY product_id
                HAVING total_records = 1";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $response['ack'] = 1;
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $Row['productUOM'] = self::getProductUOM($Row['product_id']);
                $response['response'][] = $Row;
            }
        } else {
            $response['ack'] = 0;
        }
        // echo '<pre>';print_r($response);exit;
        return $response;
    }

    function getProductUOM($product_id)
    {
        $Sqla = "SELECT c.product_id,c.id,
                        c.quantity,
                        us.title as name,
                        c.cat_id,
                        c.ref_unit_id,
                        c.ref_quantity
                FROM  units_of_measure_setup  c
                RIGHT JOIN units_of_measure us on us.id=c.cat_id
                where   c.status=1  AND 
                        us.status=1 AND
                        c.product_id=" . $product_id . " AND
                        c.company_id=" . $this->arrUser['company_id'] . "
                GROUP BY c.product_id,us.title ASC 
                ORDER BY c.product_id,c.id ASC";

        // echo $Sqla;exit; 

        $RSa = $this->objsetup->CSI($Sqla);

        if ($RSa->RecordCount() > 0) {
            while ($Rowa = $RSa->FetchRow()) {
                foreach ($Rowa as $key => $value) {
                    if (is_numeric($key)) unset($Rowa[$key]);
                }

                $response[] = $Rowa;
            }
        }
        //['responseUOM']

        return $response;
    }
    // price offer item add/edit function 
    function addPriceOfferItem($attr)
    {
        $where_id = "";
        // $this->objGeneral->mysql_clean($attr);
        $current_date = $this->objGeneral->convert_date(date('Y-m-d'));
        $id = $attr['id'];

        $minOrderQty = (isset($attr['Min']) && $attr['Min'] != '') ? $attr['Min'] : 0;
        $maxOrderQty = (isset($attr['Max']) && $attr['Max'] != '') ? $attr['Max'] : 0;
        $maxPurchasePriceoffer = (isset($attr['maxPurchasePriceLCY']) && $attr['maxPurchasePriceLCY'] != '') ? $attr['maxPurchasePriceLCY'] : 0;
        $min_max_price = (isset($attr['min_max_price']) && $attr['min_max_price'] != '') ? $attr['min_max_price'] : 0;
        $minAllowedQty = (isset($attr['minAllowedQty']) && $attr['minAllowedQty'] != '') ? $attr['minAllowedQty'] : 0;
        $maxAllowedQty = (isset($attr['maxAllowedQty']) && $attr['maxAllowedQty'] != '') ? $attr['maxAllowedQty'] : 0;
        $standard_price = (isset($attr['StdPrice']) && $attr['StdPrice'] != '') ? Round($attr['StdPrice'], 3) : 0;
        $price_offer = (isset($attr['priceoffer']) && $attr['priceoffer'] != '') ? Round($attr['priceoffer'], 3) : 0;
        $price_offer_lcy = (isset($attr['lCY']) && $attr['lCY'] != '') ? Round($attr['lCY'], 3) : 0;



        if (!empty($id))
            $where_id = "AND tst.id <>  '$id' ";

        $data_pass = " tst.priceID='$attr[priceID]' AND 
                       tst.itemID='" . $attr['itemID'] . "' $where_id";

        $total = $this->objGeneral->count_duplicate_in_sql('priceofferitem', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
        $uomID = ($attr['UOM']['id'] != "") ? $attr['UOM']['id']  : 0;
        if ($id > 0) {
            $Sql = "UPDATE priceofferitem
                        SET                              
                              uomID = '" . $uomID . "',
                              itemOfferPrice = '" . $price_offer . "',
                              itemOfferPriceLcy = '" . $price_offer_lcy . "',
                              maxPurchasePrice = '" . $maxPurchasePriceoffer . "',
                              min_max_price = '$min_max_price',
                              standard_price = '$standard_price',
                              minAllowedQty = '$minAllowedQty',
                              maxAllowedQty = '$maxAllowedQty',
                              minQty = '" . $minOrderQty . "',
                              maxQty = '" . $maxOrderQty . "',
                              ChangedBy='" . $this->arrUser['id'] . "',
                              ChangedOn='" . $current_date . "'

                              WHERE id = " . $attr['id'] . "  Limit 1";

            // echo $Sql."<hr>"; exit;
            $RS = $this->objsetup->CSI($Sql);
        } else {

            $Sql = "INSERT INTO priceofferitem
                                SET
                                    priceID = '" . $attr['priceID'] . "',
                                    itemID = '" . $attr['ItemID'] . "',
                                    uomID = '" . $uomID . "',
                                    itemOfferPrice = '" . $price_offer . "',
                                    itemOfferPriceLcy = '" . $price_offer_lcy . "',
                                    maxPurchasePrice = '" . $maxPurchasePriceoffer . "',
                                    minQty = '" . $minOrderQty . "',
                                    maxQty = '" . $maxOrderQty . "',
                                    min_max_price = '$min_max_price',
                                    standard_price = '$standard_price',
                                    minAllowedQty = '$minAllowedQty',
                                    maxAllowedQty = '$maxAllowedQty',
                                    user_id='" . $this->arrUser['id'] . "',
                                    status=1,
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    AddedBy='" . $this->arrUser['id'] . "',
                                    AddedOn=UNIX_TIMESTAMP (NOW()),
                                    ChangedBy='" . $this->arrUser['id'] . "',
                                    ChangedOn=UNIX_TIMESTAMP (NOW())";
            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
        }

        foreach ($attr['discountDetails'] as $discount_details) {
            $discount_details['discountType'] = $attr['discountType'];
            $discount_details['type'] = $attr['type'];
            $discount_details['priceID'] = $attr['priceID'];
            $discount_details['itemID'] = $attr['ItemID'];

            // print_r( $discount_details);exit;
            // $item = json_decode(json_encode($item), True);
            self::addPriceOfferItemVolume($discount_details);
        }

        foreach ($attr['additionalCosts'] as $additional_costs) {
            $additional_costs['priceID'] = $attr['priceID'];
            $additional_costs['itemID'] = $attr['ItemID'];

            $additional_costs['moduleID'] = $attr['moduleID'];
            $additional_costs['moduleType'] = $attr['moduleType'];

            $additional_costs['startDate'] = $attr['startDate'];
            $additional_costs['endDate'] = $attr['endDate'];
            $additional_costs['descriptionIDs'] = $additional_costs['iacid'];
            $additional_costs['descriptionName'] = $additional_costs['description'];

            // print_r( $additional_costs);exit;
            self::addPriceListAdditionalCost($additional_costs);
        }


        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['edit'] = 0;
            $response['id'] = $id;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'No change in record.';
            $response['edit'] = 0;
            $response['id'] = 0;
        }
        return $response;
    }

    function deletePriceOffer($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "Delete from priceoffer WHERE id = " . $attr['id'] . " AND SR_CheckTransactionBeforeDelete(" . $attr['id'] . ", " . $this->arrUser['company_id'] . ", 33,0) = 'success'";
        // $Sql = "Delete from priceoffer WHERE id = $attr[offeredByID]";
        // echo $Sql."<hr>"; exit;
        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, "crm_pricetab", sr_DeletePermission);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        }
        return $response;
    }

    function deletePriceOfferItem($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if ($attr['priceID'] > 0) {

            $Sql = "DELETE FROM priceofferitem 
                    WHERE priceID = $attr[priceID] and 
                          itemID = $attr[ItemID]  AND SR_CheckTransactionBeforeDelete($attr[priceID], " . $this->arrUser['company_id'] . ", 33,0) = 'success'";
            // echo $Sql."<hr>"; exit;
            $RS = $this->objsetup->CSI($Sql);

            // delete all of items discount also
            $Sql = "DELETE FROM priceofferitemvolume 
                    WHERE priceID = $attr[priceID] and 
                          itemID = $attr[ItemID] AND SR_CheckTransactionBeforeDelete($attr[priceID], " . $this->arrUser['company_id'] . ", 33,0) = 'success'";
            // echo $Sql."<hr>"; exit;
            $RS = $this->objsetup->CSI($Sql);

            // delete all of items Additional Cost
            $Sql2 = "DELETE FROM price_list_additional_cost 
                     WHERE priceID = $attr[priceID] and 
                           itemID = $attr[ItemID] AND SR_CheckTransactionBeforeDelete($attr[priceID], " . $this->arrUser['company_id'] . ", 33,0) = 'success'";
            // echo $Sql2."<hr>"; exit;
            $RS2 = $this->objsetup->CSI($Sql2);

            if ($this->Conn->Affected_Rows() > 0) {
                $response['ack'] = 1;
                $response['error'] = NULL;
            } else {
                $response['ack'] = 0;
                $response['error'] = 'Record can\'t be deleted!';
            }
        } else {
            $response['ack'] = 1;
            $response['error'] = NULL;
        }

        return $response;
    }

    function deletePriceOfferItemVolume($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "DELETE FROM priceofferitemvolume  
                WHERE id = " . $attr['id'] . "";
        // echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        }
        return $response;
    }

    // price offer item volume add/edit function
    function addPriceOfferItemVolume($attr)
    {
        // print_r($attr);exit;
        $where_id = "";
        $this->objGeneral->mysql_clean($attr);
        $current_date = $this->objGeneral->convert_date(date('Y-m-d'));

        $minOrderQty = (isset($attr['Min']) && $attr['Min'] != '') ? $attr['Min'] : 0;
        if ($minOrderQty == 0) {
            $minOrderQty = (isset($attr['min']) && $attr['min'] != '') ? $attr['min'] : 0;
        }
        $priceID = (isset($attr['priceID']) && $attr['priceID'] != '') ? $attr['priceID'] : 'NULL';
        $type = (isset($attr['type']) && $attr['type'] != '') ? $attr['type'] : '1';

        $id = $attr['id'];

        if (!empty($attr['id']))
            $where_id = "AND tst.id <> '" . $attr['id'] . "' ";

        /* $data_pass = " tst.priceID='$priceID' AND 
                       tst.itemID='" . $attr['itemID'] . "' AND 
                       tst.discount='" . $attr['discount'] . "' AND 
                       tst.min='" . $minOrderQty . "' $where_id";

        $total = $this->objGeneral->count_duplicate_in_sql('priceofferitemvolume',$data_pass,$this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }   */

        $discount =  (isset($attr['discount']) && $attr['discount'] != '') ? Round($attr['discount'], 2) : 0;
        if ($attr['id'] > 0) {
            $Sql = "UPDATE priceofferitemvolume
                        SET                              
                              discountType = '" . $attr['discountType'] . "',
                              discount = '" . $discount . "',
                              min = '" . $minOrderQty . "',
                              ChangedBy='" . $this->arrUser['id'] . "',
                              ChangedOn='" . $current_date . "'

                              WHERE id = " . $attr['id'] . "  Limit 1";
            //   echo $Sql."<hr>"; exit;
            $RS = $this->objsetup->CSI($Sql);
        } else {

            $Sql = "INSERT INTO priceofferitemvolume
                                SET
                                    priceID = " . $priceID . ",
                                    itemID = '" . $attr['itemID'] . "',
                                    discountType = '" . $attr['discountType'] . "',
                                    discount = '" . $discount . "',
                                    min = '" . $minOrderQty . "',
                                    user_id='" . $this->arrUser['id'] . "',
                                    status=1,
                                    type = " . $type . ",
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    AddedBy='" . $this->arrUser['id'] . "',
                                    AddedOn=UNIX_TIMESTAMP (NOW()),
                                    ChangedBy='" . $this->arrUser['id'] . "',
                                    ChangedOn=UNIX_TIMESTAMP (NOW())";
            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
        }

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['edit'] = 0;
            $response['id'] = $id;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'No change in Record.';
            $response['edit'] = 0;
            $response['id'] = 0;
        }
        return $response;
    }

    // price List item Additional Cost add/edit function
    function addPriceListAdditionalCost($attr)
    {
        $where_id = "";
        $this->objGeneral->mysql_clean($attr);
        $current_date = $this->objGeneral->convert_date(date('Y-m-d'));

        $startDate = $this->objGeneral->convert_date($attr['startDate']);
        $endDate = $this->objGeneral->convert_date($attr['endDate']);

        $cost = (isset($attr['cost']) && $attr['cost'] != '') ? $attr['cost'] : 0;
        $currencyID = (isset($attr['currencyID']) && $attr['currencyID'] != '') ? $attr['currencyID'] : 0;
        $currencyCode = (isset($attr['currencyCode']) && $attr['currencyCode'] != '') ? $attr['currencyCode'] : 0;
        $cost_gl_code_id = (isset($attr['cost_gl_code_id']) && $attr['cost_gl_code_id'] != '') ? $attr['cost_gl_code_id'] : 0;
        $priceID = (isset($attr['priceID']) && $attr['priceID'] != '') ? $attr['priceID'] : 0;
        $descriptionID = (isset($attr['descriptionIDs']) && $attr['descriptionIDs'] != '') ? $attr['descriptionIDs'] : 0;

        $sql2 = " SELECT count(pf.id) as total 
                    FROM priceofferitem AS pft
                    LEFT JOIN priceoffer AS pf ON pft.priceID=pf.id
                    WHERE pft.company_id='" . $this->arrUser['company_id'] . "' AND 
                        pft.itemID='" . $attr['itemID'] . "' AND 
                        pf.moduleID='" . $attr['moduleID'] . "' AND 
                        pf.moduleType='" . $attr['moduleType'] . "' AND 
                        pft.status=1  AND 
                        pf.id != $priceID AND
                        (('" . $startDate . "' BETWEEN pf.start_date AND pf.end_date) OR 
                        ('" . $startDate . "' >= pf.start_date AND pf.end_date = 0) OR 
                        ('" . $endDate . "' BETWEEN pf.start_date AND pf.end_date) OR 
                        ('" . $endDate . "' >= pf.start_date AND pf.end_date = 0))";
        // echo $sql2;exit;

        $rs2 = $this->objsetup->CSI($sql2);

        if ($rs2->fields['total'] > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Price offer dates for Item ovelaps with previous price offer!';
            return $response;
        }

        $id = $attr['id'];

        if (!empty($attr['id']))
            $where_id = "AND tst.id <>  '" . $attr['id'] . "' ";

        $data_pass = " tst.priceID='$priceID' AND 
                       tst.itemID='" . $attr['itemID'] . "' AND 
                       tst.descriptionID='" . $descriptionID . "' $where_id";
        //tst.description='" . $attr['description'] . "'

        $total = $this->objGeneral->count_duplicate_in_sql('price_list_additional_cost', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($attr['id'] > 0) {
            $Sql = "UPDATE price_list_additional_cost
                        SET                              
                              descriptionID = '" . $descriptionID . "',
                              description = '" . $attr['descriptionName'] . "',
                              cost = '" . $cost . "',
                              currencyID= '" . $currencyID . "',
                              currencyCode= '" . $currencyCode . "',
                              cost_gl_code_id = '" . $cost_gl_code_id . "',
                              cost_gl_code = '" . $attr['cost_gl_code'] . "',
                              ChangedBy='" . $this->arrUser['id'] . "',
                              ChangedOn='" . $current_date . "'

                              WHERE id = " . $attr['id'] . "  Limit 1";
            //  echo $Sql."<hr>"; exit;
            $RS = $this->objsetup->CSI($Sql);
        } else {

            $Sql = "INSERT INTO price_list_additional_cost
                                SET
                                    priceID = " . $priceID . ",
                                    itemID = '" . $attr['itemID'] . "',
                                    descriptionID = '" . $descriptionID . "',
                                    description = '" . $attr['descriptionName'] . "',
                                    cost = '" . $cost . "',
                                    currencyID= '" . $currencyID . "',
                                    currencyCode= '" . $currencyCode . "',
                                    cost_gl_code_id = '" . $cost_gl_code_id . "',
                                    cost_gl_code = '" . $attr['cost_gl_code'] . "',
                                    user_id='" . $this->arrUser['id'] . "',
                                    status=1,
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    AddedBy='" . $this->arrUser['id'] . "',
                                    AddedOn=UNIX_TIMESTAMP (NOW()),
                                    ChangedBy='" . $this->arrUser['id'] . "',
                                    ChangedOn=UNIX_TIMESTAMP (NOW())";
            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
        }

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['edit'] = 0;
            $response['id'] = $id;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'No change in Record.';
            $response['edit'] = 0;
            $response['id'] = 0;
        }
        return $response;
    }

    function deletePriceListAdditionalCost($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM price_list_additional_cost as plac 
                WHERE plac.id = " . $attr['id'] . "  AND SR_CheckTransactionBeforeDelete(plac.priceID, " . $this->arrUser['company_id'] . ", 33,0) = 'success";
        // echo $Sql."<hr>"; exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        }
        return $response;
    }

    function conversion_price_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "UPDATE priceoffer
                        SET
                              priceType = '3'
                              WHERE id = " . $attr['id'] . "  Limit 1";

        // echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['edit'] = 1;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be updated!';
            $response['edit'] = 0;
        }
        return $response;
    }

    /* ================      Customer Price info  end   ================== */

    /* ================      Customer Rebate History start   ================== */

    function add_customer_rebate_history($attr)
    {
        $start_date = $this->objGeneral->convert_date($attr['offer_date']);
        $end_date = $this->objGeneral->convert_date($attr['offer_valid_date']);
        $current_date = $this->objGeneral->convert_date(date('Y-m-d'));
        // echo '<pre>';print_r($attr['moduleID']);exit;
        // $this->objGeneral->emptyToZero($attr['moduleID'])

        $Sql = "INSERT INTO crm_rebate_history
                        SET
                            crm_rebate_id = '" . $attr['crm_rebate_id'] . "',
                            crm_id = '" . $attr['moduleID'] . "',
                            rebate_type = '" . $attr['type'] . "',
                            item_type = '" . $attr['item_type'] . "',
                            uom = '" . $attr['uom'] . "',
                            category_type = '" . $attr['category_type'] . "',
                            universal_type = '" . $attr['universal_type'] . "',
                            rebate_price_type = '" . $attr['rebate_price_type'] . "',
                            rebate_price = '" . $attr['rebate_price'] . "',
                            created_date = '" . $current_date . "',
                            start_date = '" . $start_date . "',
                            end_date = '" . $end_date . "',
                            status = 1,
                            user_id = '" . $this->arrUser['id'] . "',
                            company_id = '" . $this->arrUser['company_id'] . "'";

        $RS = $this->objsetup->CSI($Sql);
        return true;
    }

    function get_customer_rebate_history($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $order_type = "";
        $response = array();

        $Sql = "SELECT rebt.*,crm.name as cust_name,
                       (CASE
                          WHEN rebt.rebate_type = 1 THEN 'Universal Rebate for the Customer'
                          WHEN rebt.rebate_type = 2 THEN 'Separate Rebate for Item Category(ies)'
                          WHEN rebt.rebate_type = 3 THEN 'Separate Rebate for Item(s)'
                        END ) AS rebate_type_name,
                       (CASE
                          WHEN rebt.universal_type = 1 THEN 'Universal Rebate'
                          WHEN rebt.universal_type = 2 THEN 'Volume Based Rebate'
                          WHEN rebt.universal_type = 3 THEN 'Revenue Based Rebate'
                        ELSE 0  END ) AS universal_type_name
				FROM crm_rebate_history as rebt
				LEFT JOIN crm ON crm.id = rebt.crm_id
				WHERE rebt.crm_rebate_id = '" . $attr['id'] . "'";
        //echo $Sql; exit;

        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'rebt', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                $result = array();

                if ($Row['rebate_type'] == 3 || ($Row['universal_type'] == 2 || $Row['universal_type'] == 3)) {
                    if ($Row['item_type'] == 1) {
                        $items = array();
                        $SqlItem = "SELECT prd.description
                                    FROM rebate_items as rbt
                                    JOIN product as prd ON rbt.item_id = prd.id
                                    WHERE rbt.rebate_id = '" . $Row['id'] . "' limit 1";
                        //echo '<hr>'.$SqlItem;

                        $RS1 = $this->objsetup->CSI($SqlItem);
                        while ($Row1 = $RS1->FetchRow()) {
                            $rsitem = array();
                            $rsitem['item_description'] = $Row1['description'];
                            $items[] = $rsitem;
                        }
                        $result['offer_to'] = $items;
                    }
                    if ($Row['item_type'] == 2) {
                        $items = array();
                        $SqlItem = "SELECT prd.description
                                    FROM rebate_items as rbt
                                    JOIN services as prd ON rbt.item_id = prd.id
                                    WHERE rbt.rebate_id = '" . $Row['id'] . "' limit 1 	";
                        //echo $SqlItem;

                        $RS1 = $this->objsetup->CSI($SqlItem);
                        while ($Row1 = $RS1->FetchRow()) {
                            $rsitem = array();
                            $rsitem['item_description'] = $Row1['description'];
                            $items[] = $rsitem;
                        }
                        $result['offer_to'] = $items;
                    }
                } else if ($Row['rebate_type'] == 2) {
                    if ($Row['category_type'] == 1) {
                        $cats = array();
                        $SqlCat = "SELECT cat.name, cat.description
                                   FROM rebate_categories as rbt
                                   JOIN category as cat ON rbt.category_id = cat.id
                                   WHERE rbt.rebate_id = '" . $Row['id'] . "' limit 1 ";

                        $RS2 = $this->objsetup->CSI($SqlCat);
                        while ($Row2 = $RS2->FetchRow()) {
                            $rscat = array();
                            $rscat['cat_name'] = $Row2['name'];
                            $rscat['cat_description'] = $Row2['description'];
                            $cats[] = $rscat;
                        }
                        $result['offer_to'] = $cats;
                    }
                    if ($Row['category_type'] == 2) {
                        $cats = array();
                        $SqlCat = "SELECT cat.name, cat.description
                                   FROM rebate_categories as rbt
                                   JOIN service_catagory as cat ON rbt.category_id = cat.id
                                   WHERE rbt.rebate_id = '" . $Row['id'] . "' limit 1 ";

                        $RS2 = $this->objsetup->CSI($SqlCat);
                        while ($Row2 = $RS2->FetchRow()) {
                            $rscat = array();
                            $rscat['cat_name'] = $Row2['name'];
                            $rscat['cat_description'] = $Row2['description'];
                            $cats[] = $rscat;
                        }
                        $result['offer_to'] = $cats;
                    }
                } else {
                    $result['offer_to'] = $Row['cust_name'];
                }

                $result['id'] = $Row['id'];
                $result['created_date'] = $this->objGeneral->convert_unix_into_date($Row['created_date']);
                $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
                $result['rebate_type_name'] = $Row['rebate_type_name'];
                $result['rebate_type'] = $Row['rebate_type'];
                $result['universal_type'] = $Row['universal_type'];
                $result['universal_type_name'] = $Row['universal_type_name'];
                $result['item_type'] = $Row['item_type'];
                $result['category_type'] = $Row['category_type'];
                $result['rebate_price_type'] = $Row['rebate_price_type'];
                $result['rebate'] = $Row['rebate_price'];

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

    /* ================      Customer Rebate History End   ================== */

    /* ================      Customer Rebate Volume and Revenue History start   ================== */

    function add_crm_rebate_volume_revenue_history($attr)
    {
        $current_date = $this->objGeneral->convert_date(date('Y-m-d'));

        $Sql = "INSERT INTO rebate_volume_revenue_history
                        SET
                            rebate_volume_revenue_id = '" . $attr['rebate_volume_revenue_id'] . "',
                            rebate_id = '" . $attr['rebate_id'] . "',
                            revenue_volume_from = '" . $attr['revenue_volume_from'] . "',
                            revenue_volume_to = '" . $attr['revenue_volume_to'] . "',
                            uom = '" . $attr['uom'] . "',
                            type = '" . $attr['type'] . "',
                            rebate_type = '" . $attr['rebate_type'] . "',
                            rebate = '" . $attr['rebate'] . "',
                            create_date = '" . $current_date . "',
                            status = 1,
                            user_id = '" . $this->arrUser['id'] . "',
                            company_id = '" . $this->arrUser['company_id'] . "'";

        $RS = $this->objsetup->CSI($Sql);
        return true;
    }

    function get_crm_rebate_volume_revenue_history($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT rebate_vr.*,wh.title as uom
				FROM rebate_volume_revenue_history as rebate_vr
				LEFT JOIN units_of_measure as wh ON wh.id = rebate_vr.uom
				WHERE rebate_vr.rebate_volume_revenue_id = '" . $attr['id'] . "'";

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                $result = array();
                $result['id'] = $Row['id'];
                $result['created_date'] = $this->objGeneral->convert_unix_into_date($Row['create_date']);
                $result['revenue_volume_from'] = $Row['revenue_volume_from'];
                $result['revenue_volume_to'] = $Row['revenue_volume_to'];
                $result['uom'] = $Row['uom'];
                $result['rebate_type'] = $Row['rebate_type'];
                $result['rebate'] = $Row['rebate'];
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

    function getPurchaseOrderListings($attr)
    {
        //print_r($attr);
        $response = array();
        $where_clause = "";
        // $where_clause = " AND d.type in (3, 4) ";

        if (isset($attr['invoice_id']) && $attr['invoice_id'] > 0) {
            $where_clause = " AND d.id <> " . $attr['invoice_id'] . " ";
        }

        $Sql = "SELECT  d.*, currency.code AS currency_code
                FROM srm_invoice  d
                LEFT JOIN currency on currency.id = d.currency_id
                WHERE  d.status=1   AND 
                       d.company_id=" . $this->arrUser['company_id'] . " 
                        AND d.type = 3  $where_clause
                Order by d.order_code DESC";
        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['type'] = $Row['type'];
                $result['code'] = $Row['sale_invioce_code'];
                $result['currency_code'] = $Row['currency_code'];

                /* if ($attr['type'] == 1)
                    $result['code'] = $Row['sale_order_code']; */

                $result['invoice_date'] = $this->objGeneral->convert_unix_into_date($Row['posting_date']);


                $result['order_date'] = $this->objGeneral->convert_unix_into_date($Row['order_date']);
                $result['rq_delivery_date'] = $this->objGeneral->convert_unix_into_date($Row['requested_delivery_date']);

                $result['sell_to_cust_no'] = $Row['sell_to_cust_no'];
                $result['sell_to_cust_name'] = $Row['sell_to_cust_name'];
                $result['sale_order_code'] = $Row['sale_order_code'];
                $result['cust_order_no'] = $Row['cust_order_no'];
                $result['cust_phone'] = $Row['cust_phone'];
                $result['sell_to_address'] = $Row['sell_to_address'];
                $result['sell_to_address2'] = $Row['sell_to_address2'];

                $result['sell_to_contact_no'] = $Row['sell_to_contact_no'];
                $result['order_code'] = $Row['order_code'];
                $result['net_amount'] = $Row['net_amount'];
                $result['currency_id'] = $Row['currency_id'];
                $result['currency_rate'] = $Row['currency_rate'];
                $result['net_amount_converted'] = $Row['net_amount_converted'];
                $result['grand_total'] = $Row['grand_total'];
                /*$result['Salesperson(s)'] = $Row['sale_person']; */

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        return $response;
    }

    function getPurchaseOrderInvoicesListings($attr)
    {
        //print_r($attr);
        $response = array();
        $where_clause = "";
        // $where_clause = " AND d.type in (3, 4) ";

        if (isset($attr['invoice_id']) && $attr['invoice_id'] > 0) {
            $where_clause = " AND d.id <> " . $attr['invoice_id'] . " ";
        }

        $Sql = "SELECT  d.*, currency.code AS currency_code
                FROM srm_invoice  d
                LEFT JOIN currency on currency.id = d.currency_id
                WHERE  d.status=1   AND 
                       d.company_id=" . $this->arrUser['company_id'] . " 
                    $where_clause
                Order by d.order_code DESC";
        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['type'] = $Row['type'];
                $result['code'] = $Row['sale_invioce_code'];
                $result['currency_code'] = $Row['currency_code'];

                /* if ($attr['type'] == 1)
                    $result['code'] = $Row['sale_order_code']; */

                $result['invoice_date'] = $this->objGeneral->convert_unix_into_date($Row['posting_date']);


                $result['order_date'] = $this->objGeneral->convert_unix_into_date($Row['order_date']);
                $result['rq_delivery_date'] = $this->objGeneral->convert_unix_into_date($Row['requested_delivery_date']);

                $result['sell_to_cust_no'] = $Row['sell_to_cust_no'];
                $result['sell_to_cust_name'] = $Row['sell_to_cust_name'];
                $result['sale_order_code'] = $Row['sale_order_code'];
                $result['cust_order_no'] = $Row['cust_order_no'];
                $result['cust_phone'] = $Row['cust_phone'];
                $result['sell_to_address'] = $Row['sell_to_address'];
                $result['sell_to_address2'] = $Row['sell_to_address2'];

                $result['sell_to_contact_no'] = $Row['sell_to_contact_no'];
                $result['order_code'] = $Row['order_code'];
                $result['net_amount'] = $Row['net_amount'];
                $result['currency_id'] = $Row['currency_id'];
                $result['currency_rate'] = $Row['currency_rate'];
                $result['net_amount_converted'] = $Row['net_amount_converted'];
                $result['grand_total'] = $Row['grand_total'];
                /*$result['Salesperson(s)'] = $Row['sale_person']; */

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        return $response;
    }

    function getPurchaseOrderListingsForSO($attr)
    {
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $defaultFilter = false;
        $cond = $attr['cond'];

        if (!empty($attr['searchKeyword'])) {
            $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.", $attr, $fieldsMeta);
            $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.", $attr, $fieldsMeta);
        }

        if (empty($where_clause)) {
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("PurchaseOrderListingsForSO", $this->arrUser);
        }

        $response = array();
        $where_clause2 = "";

        if (isset($attr['invoice_id']) && $attr['invoice_id'] > 0) {
            $where_clause2 = " AND d.id <> " . $attr['invoice_id'] . " ";
        }

        $Sql = "SELECT * FROM (SELECT  d.*, currency.code AS currency_code
                                FROM srm_invoice  d
                                LEFT JOIN currency on currency.id = d.currency_id
                                WHERE   d.status=1   AND 
                                        d.company_id=" . $this->arrUser['company_id'] . " AND 
                                        d.type = 3  $where_clause2
                                Order by d.order_code DESC) AS tbl  where 1 " . $where_clause . " ";
        //echo $Sql;exit;

        //defualt Variable
        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if (!empty($attr['sort_column'])) {
            $column = 'tbl.' . $attr['sort_column'];
            $order_type = "Order BY " . $column . " DESC";
        } else {
            $column = 'tbl.order_code';
        }

        if ($order_clause == "")
            $order_type = "Order BY " . $column . " ASC";
        else
            $order_type = $order_clause;

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['type'] = $Row['type'];
                $result['invoice_code'] = $Row['invoice_code'];
                $result['currency_code'] = $Row['currency_code'];

                $result['posting_date'] = $this->objGeneral->convert_unix_into_date($Row['posting_date']);
                $result['order_date'] = $this->objGeneral->convert_unix_into_date($Row['order_date']);
                $result['requested_delivery_date'] = $this->objGeneral->convert_unix_into_date($Row['requested_delivery_date']);

                $result['sell_to_cust_no'] = $Row['sell_to_cust_no'];
                $result['sell_to_cust_name'] = $Row['sell_to_cust_name'];
                $result['cust_order_no'] = $Row['cust_order_no'];
                $result['cust_phone'] = $Row['cust_phone'];
                $result['sell_to_address'] = $Row['sell_to_address'];
                $result['sell_to_address2'] = $Row['sell_to_address2'];

                $result['sell_to_contact_no'] = $Row['sell_to_contact_no'];
                $result['order_code'] = $Row['order_code'];
                $result['net_amount'] = $Row['net_amount'];
                $result['currency_id'] = $Row['currency_id'];
                $result['currency_rate'] = $Row['currency_rate'];
                $result['net_amount_converted'] = $Row['net_amount_converted'];
                $result['grand_total'] = $Row['grand_total'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'][] = array();
        }

        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData('PurchaseOrderListingsForSO');
        $response['response']['tbl_meta_data']['defaultFilter'] = $defaultFilter;

        return $response;
    }

    function getPurchaseOrderListingsBySaleID($attr)
    {
        //print_r($attr);
        $response = array();
        $Sql = "SELECT  srminv.*,srm.id AS ids
                FROM link_so_po d 
                LEFT JOIN srm_invoice srminv ON srminv.id=d.purchaseOrderID     
                LEFT JOIN srm ON srm.id=srminv.sell_to_cust_id      
                WHERE  d.status=1   AND 
			    d.saleOrderID = " . $attr['id'] . " AND
                      d.company_id=" . $this->arrUser['company_id'] . "   
                ORDER BY srminv.order_code DESC";
        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['type'] = $Row['type'];
                $result['code'] = $Row['sale_invioce_code'];

                /* if ($attr['type'] == 1)
                    $result['code'] = $Row['sale_order_code']; */

                $result['invoice_date'] = $this->objGeneral->convert_unix_into_date($Row['posting_date']);


                $result['order_date'] = $this->objGeneral->convert_unix_into_date($Row['order_date']);
                $result['rq_delivery_date'] = $this->objGeneral->convert_unix_into_date($Row['requested_delivery_date']);


                $result['sell_to_cust_no'] = $Row['sell_to_cust_no'];
                $result['sell_to_cust_name'] = $Row['sell_to_cust_name'];
                $result['sale_order_code'] = $Row['sale_order_code'];
                $result['cust_order_no'] = $Row['cust_order_no'];
                $result['sell_to_contact_no'] = $Row['sell_to_contact_no'];
                $result['order_code'] = $Row['order_code'];
                $result['net_amount'] = $Row['net_amount'];
                $result['currency_id'] = $Row['currency_id'];
                $result['currency_rate'] = $Row['currency_rate'];
                $result['net_amount_converted'] = $Row['net_amount_converted'];
                $result['grand_total'] = $Row['grand_total'];
                /*$result['Salesperson(s)'] = $Row['sale_person']; */

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        return $response;
    }

    function getDeliveryLocations($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = "";
        $where_clause = "";
        $where_type = "";
        $total = "";
        $filters_dropdown = "";
        $head = "";
        $filter_dict = "";

        $acc_id = $attr["acc_id"];

        $response = array();
        $record = array();

        $Sql = "SELECT c.*
                FROM sr_alt_dept_sel c
                where   c.status=1 and 
                        c.acc_id=$acc_id and 
                        c.module_type = '" . $attr['module_type'] . "' and 
                        c.depot!='' and
                        c.company_id=" . $this->arrUser['company_id'] . "
                        and is_delivery_collection_address=1 ";

        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        $response['q'] = '';
        $response['ack'] = 1;
        $response['error'] = NULL;

        $record['num_rows'] = $total;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['location'] = $Row['depot'];

                $address_type = "";

                if ($Row['is_billing_address'] > 0)
                    $address_type .= "Billing, ";

                if ($Row['is_invoice_address'] > 0)
                    $address_type .= "Payment, ";

                if ($Row['is_delivery_collection_address'] > 0) {
                    if ($attr['module_type'] == 2)
                        $address_type .= "Collection, ";
                    else if ($attr['module_type'] == 1)
                        $address_type .= "Delivery, ";
                }

                $address_type = substr($address_type, 0, strlen($address_type) - 2);
                if (strlen($address_type) < 1) $address_type = " - ";
                $result['Address_type'] = $address_type;
                $result['address_1'] = $Row['address'];
                $result['address_2'] = $Row['address_2'];
                $result['city'] = $Row['city'];
                $result['county'] = $Row['county'];
                $result['postcode'] = $Row['postcode'];
                $result['country'] = $Row['country'];
                $result['is_primary'] = $Row['is_primary'];
                $result['is_default'] = $Row['is_default'];
                $result['clcontact_name'] = $Row['clcontact_name'];
                $result['cldirect_line'] = $Row['cldirect_line'];
                $result['clphone'] = $Row['clphone'];
                $result['clemail'] = $Row['clemail'];
                $response['response'][] = $result;
                $record['results'][] = $result;
            }
            $ack = 1;
        } else
            $response['response'][] = array();

        return array(
            'filters_dropdown' => $filters_dropdown,
            'columns' => $head,
            'filter_dict' => $filter_dict,
            'filters' => $record['column_id'],
            'record' => array(
                'total' => $response['total'],
                'result' => $record['results'],
                'response' => $record['response'],
                'ack' => $ack
            )
        );
        // return $response;
    }

    /* ================      Customer Rebate Volume and Revenue History End   ================== */


    /* ================     Customer Portal Settings  ================== */

    function getPortalSettings($attr)
    {
        //print_r($attr);
        $response = array();
        $Sql = "SELECT  d.*
                FROM cust_portal_settings d    
                WHERE d.crm_id = " . $attr['crm_id'] . " AND
                      d.company_id=" . $this->arrUser['company_id'] . " 
                limit 1 ";
        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $result = array();

            $result['id'] = $RS->fields['id'];
            $result['user_email'] = $RS->fields['user_email'];
            $result['user_password'] = $RS->fields['user_password'];
            $result['custEmail'] = $RS->fields['custEmail'];
            $response['response'] = $result;

            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        return $response;
    }

    function updatePortalSettings($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $id = $attr['id'];

        if (!empty($attr['id']))
            $where_id = "AND tst.id <>  '" . $attr['id'] . "' ";

        $crm_id = (isset($attr['crm_id']) && $attr['crm_id'] != '') ? $attr['crm_id'] : 0;
        $data_pass = " tst.crm_id='" . $crm_id . "' $where_id";

        $total = $this->objGeneral->count_duplicate_in_sql('cust_portal_settings', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($attr['id'] > 0) {
            $Sql = "UPDATE cust_portal_settings
                        SET                              
                              user_email = '" . $attr['user_email'] . "',
                              user_password = '" . $attr['user_password'] . "',
                              custEmail = '" . $attr['custEmail'] . "',
                              ChangedBy='" . $this->arrUser['id'] . "',
                              ChangedOn=UNIX_TIMESTAMP (NOW())
                    WHERE id = " . $attr['id'] . "  
                    Limit 1";
            //  echo $Sql."<hr>"; exit;
            $RS = $this->objsetup->CSI($Sql);
        } else {

            $Sql = "INSERT INTO cust_portal_settings
                                SET
                                    crm_id = '" . $crm_id . "',
                                    user_email = '" . $attr['user_email'] . "',
                                    user_password = '" . $attr['user_password'] . "',
                                    custEmail = '" . $attr['custEmail'] . "',
                                    status = 1,
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    AddedBy='" . $this->arrUser['id'] . "',
                                    AddedOn=UNIX_TIMESTAMP (NOW()),
                                    ChangedBy='" . $this->arrUser['id'] . "',
                                    ChangedOn=UNIX_TIMESTAMP (NOW())";
            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
        }

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['edit'] = 0;
            $response['id'] = $id;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'No change in Record.';
            $response['edit'] = 0;
            $response['id'] = 0;
        }
        return $response;
    }

    function sendPortalLinkEmail($attr)
    {
        $res = $this->updatePortalSettings($attr);
        // echo '<pre>';print_r($res['ack']);exit;

        if ($res['ack'] == 1) {

            $user_email = $attr['user_email'];
            $user_password = $attr['user_password'];
            $invoiceEmail = $attr['custEmail'];
            $custID = $attr['crm_id'];
            $response = array();

            $invoiceName = 'CUST,' . $custID . ',' . $user_email . ',' . $user_password . ',' . $this->arrUser['company_id'] . '';

            // $senderEmailID = $response['template']->senderEmail;            
            // $templateSubject = strip_tags($response['template']->templateSubject);  

            $Sql = "SELECT username,alias
                    FROM virtual_emails ve 
                    WHERE company_id = " . $this->arrUser['company_id'] . "
                    LIMIT 1";

            //  echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);

            if ($RS->RecordCount() > 0) {
                while ($row = $RS->FetchRow()) {
                    $clientConfiguration = array(
                        'username' => $row['username'],
                        'alias' => $row['alias']
                    );
                }
            } else {
                $clientConfiguration = array();
            }

            $rejectedInvoicesCounter = 0;
            $sendEmailInvoicesCounter = 0;
            $file_name = '';
            $customer_name = '';

            if (!empty($clientConfiguration)) {
                //Mail object initialization

                $response2 = [];

                $templateBody = $response['template']->templateBody;
                $mail = new \SendGrid\Mail\Mail();

                $key = hash('sha256', SECRET_KEY);
                $iv = substr(hash('sha256', SECRET_IV), 0, 16);
                $outputInvName = openssl_encrypt($invoiceName, SECRET_METHOD, $key, 0, $iv);
                $outputInvName = base64_encode($outputInvName);

                $file_url = WEB_PATH . '/?customer=' . $outputInvName; //customerPortal.html

                $emailSubject = 'Customer Portal Link';
                $emailBody = "<p><span style=\"font-size: 12px;\">Dear Sir / Madam,</span></p><p><span style=\"font-size: 12px;\">Please click on this link to get access to Customer Portal &nbsp;</span> <a target='_blank' href='$file_url'> View Portal </a></p><p><span style=\"font-size: 12px;\">Login Details</span></p><p><span style=\"font-size: 12px;\">User Email &nbsp;:&nbsp; $user_email</span></p><p><span style=\"font-size: 12px;\">Password &nbsp;: &nbsp; $user_password</span></p><p><span style=\"font-size: 12px;\"><i>Please do not reply to this email. This is an auto generated&nbsp;email.&nbsp;</i></span><br><br></p><p><span style=\"font-size: 12px;\">Kind regards</span></p><p>Finance Team</p>";
                // $emailSubject = str_replace('[[customer_no]]', $rec->customer_code, $templateSubject);
                // $emailBody .= str_replace('[[customer_no]]', $rec->customer_code, $templateBody);

                $emailDetails = array(
                    "to" => array_unique(explode(';', $invoiceEmail)),
                    "cc" => '',
                    "from" => $clientConfiguration['username'],
                    "fromName" => $clientConfiguration['alias'],
                    "subject" => $emailSubject,
                    "body" =>  $emailBody,
                    "attachment" => ''
                );

                if ($invoiceEmail) {
                    try {
                        //Recipients
                        $mail->setFrom($emailDetails['from'], $emailDetails['fromName']);
                        for ($k = 0; $k < count($emailDetails['to']); $k++) {
                            //echo '<br>'. $emailDetails['to'][$k];
                            $mail->AddTo($emailDetails['to'][$k]);
                        }

                        //Content
                        $mail->setSubject($emailDetails['subject']);
                        $mail->addContent("text/html", $emailDetails['body']);

                        // echo '<pre>';print_r($attachment);
                        try {
                            $result2 = $this->sendgrid->send($mail);
                            $result2 =  (array) $result2;
                            $statusCode = [];
                            foreach ($result2 as $key => $value) {
                                if (strpos($key, "statusCode") > -1) {
                                    $statusCode['statusCode'] = $value;
                                } else if (strpos($key, "body") > -1) {
                                    $response2['body'] = json_decode($value);
                                }
                            }

                            if ($statusCode['statusCode'] == 202) {
                                $response2['message'] =  "E-mail sent successfully";
                                $response2['ack'] = 1;
                                $response2['id'] = $res['id'];
                                $sendEmailInvoicesCounter++;
                                array_push($response2['sendEmailInvoices'], $file_name);
                            } else {
                                $response2['mailObj'] = $mail;
                                $response2['ack'] = 0;
                                $response2['message'] =  $response['body']->errors[0]->message;
                            }
                            $response2['sentData'][] = $response2;
                        } catch (Exception $e) {
                            array_push($response2['sendFailedEmailInvoices'], $file_name);
                        }
                    } catch (Exception $e) {
                        $response2['configIssue'] = 1;
                        $response2['message'] =   $mail->ErrorInfo;
                        $response2['mailObj'] = $mail;
                        $response2['debug'] = $mail->smtp->smtp_errors;

                        $rejectedInvoicesReason .= 'Email sending Failed, ';

                        $rejectedInvoicesCounter++;
                    }
                } else {
                    $rejectedInvoicesReason .= $customer_name . ' Email is Missing, ';
                    $rejectedInvoicesCounter++;
                }

                // echo $sendEmailInvoicesCounter;
                if ($sendEmailInvoicesCounter > 0 && $rejectedInvoicesCounter > 0) {
                    $response2['ack'] = 0;
                    $response2['error'] = $rejectedInvoicesReason;
                } elseif ($sendEmailInvoicesCounter > 0) {
                    $response2['ack'] = 1;
                } elseif ($rejectedInvoicesCounter > 0) {
                    $response2['ack'] = 0;
                    $response2['error'] = $rejectedInvoicesReason;
                } else {
                    $response2['ack'] = 0;
                    $response2['error'] = $rejectedInvoicesReason;
                    $response2['response'] = array();
                }
            } else {

                $response2['error'] = 'Email configuration does not exist.';
                $response2['rejectedInvoices'] .= 'Email configuration does not exist.';
                $rejectedInvoicesCounter++;
            }
        }
        return $response2;
    }
}
