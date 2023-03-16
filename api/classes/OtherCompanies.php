<?php
error_reporting(E_ERROR);
require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/General.php");
require_once(SERVER_PATH. "/classes/Setup.php");

class OtherCompanies extends Xtreme
{
    private $Conn = null;
    private $objGeneral = null;
    private $arrUser = null;
    private $objsetup = null;

    function __construct($user_info = array())
    {
        parent::__construct();
        $this->Conn = parent::GetConnection();
        $this->objGeneral = new General($user_info);
        $this->arrUser = $user_info;
        $this->objsetup = new Setup($this->arrUser);
    }

    function get_data_by_id($id)
    {
        $Sql = "SELECT c.*,fs.year_start_date,fs.year_end_date,fs.is_whole_seller,
                        fs.date_of_incorporation,fs.vat_scheme,fs.submission_frequency,fs.vat_number,
                        fs.hmrc_usesr_id,fs.company_reg_no,fs.vat_reg_no,fs.type_of_business_ownership,
                        fs.posting_start_date,fs.posting_end_date,fs.taxOfficeName,fs.vat_sales_type
				FROM company AS c
                LEFT JOIN financial_settings AS fs ON fs.company_id = c.id
				WHERE c.id=".$id."
				LIMIT 1";

        $RS = $this->objsetup->CSI($Sql);        

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();

            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $Row['year_start_date'] = $this->objGeneral->convert_unix_into_date($Row['year_start_date']);
            $Row['year_end_date'] = $this->objGeneral->convert_unix_into_date($Row['year_end_date']);
            $Row['date_of_incorporation'] = $this->objGeneral->convert_unix_into_date($Row['date_of_incorporation']);

            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'] = $Row;

            $result1 = $this->get_countries();
            $response['country_type_arr'] = $result1['response'];

            $result2 = $this->get_currencies_list();
            $response['arr_currency'] = $result2['response'];
        } 
        else {
            $response['ack'] = 0;
            $response['error'] = NULL;
            $response['response'] = array();
            $response['bucketFail'] = 1;
        }
        return $response;
    }

    //------------General Tab--------------------------
    function get_all_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT   c.* FROM  company  c 
                where  c.status=1";

        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                // $result['id'] = $Row['id'];
                // $result['name'] = $Row['wrh_code'] . '-' . $Row['name']; 
                // $response['response'][] = $result;
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }

        return $response;
    }


    function get_otherCompanies_listings($attr)
    {
        $searchKeyword = '';
        $searchKeyword = $attr['searchKeyword'];
        $where = $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";

        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.",$attr,$fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.",$attr,$fieldsMeta);

        $where = " tbl.company_id <> 11 ";    
        $response = array();

        $Sql = "SELECT * FROM (SELECT   
                                        c.id as rec_id,
                                        c.id as company_id,
                                        c.name, 
                                        c.num_user_login, 
                                        c.city, 
                                        c.postcode, 
                                        c.telephone, 
                                        c.fax, 
                                        c.email,
                                        c.currency_id,
                                        cr.name AS currency,
                                        cr.code AS curr_code
                                From company  c
                                LEFT JOIN currency AS cr ON cr.id = c.currency_id
                                where  c.status=1) AS tbl 
                WHERE 1 and ".$where.$where_clause." ";
        // echo $Sql;exit;

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        
        if ($order_clause == "")
            $order_type = " Order BY tbl.rec_id ASC ";
        else
            $order_type = $order_clause;

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['rec_id'];
                $result['curr_code'] = $Row['curr_code'];
                $result['name'] = $Row['name'];
                $result['currency'] = $Row['currency'];
                $result['telephone'] = $Row['telephone'];   
                $result['email'] = $Row['email'];
                $result['city'] = $Row['city'];
                $result['postcode'] = $Row['postcode'];
                $result['fax'] = $Row['fax'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;

        } else {
            $response['response'] = array();
            $response['ack'] = 1;
            $response['error'] = NULL;
        }

        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData("OtherCompanies");
        return $response;
    }


    function get_countries($attr = null)
    {
        $response = array();

        $Sql = "SELECT  c.id, LCASE(c.name) as n, c.iso
                FROM  country  c 
                where  c.status=1    
                order by c.name ASC";

        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = ucwords($Row['n']);
                $result['code'] = $Row['iso'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;

        } else  $response['response'][] = array();
        return $response;
    }

    function get_currencies_list($attr=null)
    {
        $response = array();

        $Sql = "SELECT   c.id, 
                         c.name, 
                         c.code
				FROM currency c 
                WHERE c.status=1";

        $RS = $this->objsetup->CSI($Sql);
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
        }
        return $response;
    }

    function add_otherCompanies($arr_attr=null)
    {
        // $this->Conn->beginTrans();
        // $this->Conn->autoCommit = false;
        $this->objGeneral->mysql_clean($arr_attr);

        $companyCurrency = $arr_attr['currency_ids'];  
        $companyName = $arr_attr['name'];  
        $adminEmail = $arr_attr['email'];  
        
        $Sql = "CALL sr_newCompanyCreation('".$companyName."','".$companyCurrency."','".$adminEmail."')";
        /* $Sql = "CALL SR_Purchase_order_received('".$purchaseInvoice_id."',
                                                        3,
                                                        ".$this->arrUser['company_id'].",
                                                        ".$this->arrUser['id'].",
                                                        ".$posting_grp.",
                                                        ".$directInvoice.",
                                                        0,
                                                        ".$invoiceCurrencyID.",
                                                        ".$defaultCurrencyID.",
                                                        ".$conversion_rate.",
                                                        ".$orderDate.",
                                                        @errorNo,
                                                        @param1,
                                                        @param2,
                                                        @param3,
                                                        @param4);"; */
        // echo $Sql;exit;
        $RSnew = $this->objsetup->CSI($Sql); 

        /* if ($RSnew->fields['Result'] > 0) 
        { */
            $response['info'] = '';
            $response['ack'] = 1;
            $response['error'] = NULL; 
            // $this->Conn->commitTrans();
            // $this->Conn->autoCommit = true;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['input_text'] = $Sql;

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        /* } else {
            $response['id'] = 0;
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
            $this->Conn->rollbackTrans();
            $this->Conn->autoCommit = true;
            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = "Error Code: ".$srLogTrace['ErrorCode']."  -- Message: 'Record not inserted'  -- Function: ". __FUNCTION__."  -- Query: ".$Sql." ";

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        } */

        return $response;
    }

    function get_hr_listing($attr)
    {
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $defaultFilter = false;

        $arg = 0;

        $where_clause = $this->objGeneral->flexiWhereRetriever("emp.",$attr,$fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("emp.",$attr,$fieldsMeta);

        if (empty($where_clause)){
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("HR",$this->arrUser);
        }
        $response = array();
        $Sql = "SELECT   * from sr_employee_sel emp where emp.company_id=" . $attr['company_id'] . " " . $where_clause . "  ";  

        if ($arg == 1) $direct_limit = cache_pagination_limit;
        else $direct_limit = pagination_limit;

        $total_limit = $direct_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
           $total_limit = $attr['pagination_limits'];
        $column = 'emp.' . 'id';       

        if ($order_clause == "")
        $order_type = "Order BY " . $column . " DESC";
        else $order_type = $order_clause;


        $response = $this->objGeneral->preListing($attr, $Sql, $response, $total_limit, 'emp', $order_type);
        // $RS = $this->objsetup->CSI($response['q']);
        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData('HR');
        $response['response']['tbl_meta_data']['defaultFilter'] = $defaultFilter;

        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


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
            $response = $this->objGeneral->postListing($attr, $response);

        } else
        {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'][] = array();
        }

        return $response;
    }
}
