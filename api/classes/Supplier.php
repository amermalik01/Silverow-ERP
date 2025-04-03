<?php
// error_reporting(E_ERROR);
require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/General.php");
require_once(SERVER_PATH . "/classes/Srm.php");
require_once(SERVER_PATH . "/classes/Setup.php");

class Supplier extends Xtreme {

    private $Conn = null;
    private $objGeneral = null;
    private $arrUser = null;
    private $objSrm = null;
    private $objsetup = null;

    function __construct($user_info = array()) {
        parent::__construct();
        $this->Conn = parent::GetConnection();
        $this->objGeneral = new General($user_info);
        $this->objsetup = new Setup($user_info);
        $this->objSrm = new Srm($user_info);
        $this->arrUser = $user_info;
    }

    function delete_update($table_name, $column, $id) {
        $Sql = "UPDATE $table_name SET  $column=0 	WHERE srm_id = $id "; //Limit 1

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

    // static

    function delete_update_status($table_name, $column, $id) {
        //	$Sql = "DELETE FROM $table_name 	WHERE id = $id LIMIT 1 ";
        $Sql = "UPDATE $table_name SET  $column=0 	WHERE id = $id Limit 1";

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

    function delete_supplier($attr) {

        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['ErrorMessage'] = "";

        $this->objsetup->SRTraceLogsPHP($srLogTrace);
    
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;

        $arr_attr = array();
        $arr_attr = (array) $attr;
        $this->objGeneral->mysql_clean($arr_attr);

        $function = "SELECT SR_CheckTransactionBeforeDelete(".$arr_attr['id'].", " . $this->arrUser['company_id'] . ", 16,3)";
        $RS = $this->objsetup->CSI($function, "supplier_gneraltab", sr_DeletePermission);
        $function1 = "SELECT SR_CheckTransactionBeforeDelete(".$arr_attr['id'].", " . $this->arrUser['company_id'] . ", 17,7)";
        $RS1 = $this->objsetup->CSI($function1, "supplier_gneraltab", sr_DeletePermission);
        $function2 = "SELECT SR_CheckTransactionBeforeDelete(".$arr_attr['id'].", " . $this->arrUser['company_id'] . ", 18,2)";
        $RS2 = $this->objsetup->CSI($function2, "supplier_gneraltab", sr_DeletePermission);

        if ($RS->fields[0] == 'success' && $RS1->fields[0] == 'success' && $RS2->fields[0] == 'success') {
            $Sql = "UPDATE srm SET status=" . DELETED_STATUS . " WHERE id = ".$arr_attr['id']." AND SR_CheckTransactionBeforeDelete(".$attr['id'].", ".$this->arrUser['company_id'].", 2,0) = 'success'";
        } elseif ($RS->fields[0] != 'success') {
            $response['ack'] = 0;
            $response['error'] = 'A Note already exists against this record.';
            return $response;
        } elseif ($RS1->fields[0] != 'success') {
            $response['ack'] = 0;
            $response['error'] = 'A Document already exists against this record.';
            return $response;
        } elseif ($RS2->fields[0] != 'success') {
            $response['ack'] = 0;
            $response['error'] = 'An Email already exists against this record.';
            return $response;
        }

        // echo $Sql; exit;
        $RS3 = $this->objsetup->CSI($Sql, "supplier_gneraltab", sr_DeletePermission);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
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

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted.';

            $srLogTrace = array();

            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record cannot be deleted.';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }

        return $response;
    }

    function get_data_by_id($table_name, $id) {

        $Sql = "SELECT *
				FROM $table_name
				WHERE id=$id
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
        }
        return $response;
    }

    //--------------------General  supplier------------------
    function get_supplier_listings($attr=array()) {
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $defaultFilter = false;
        /* if (!empty($attr['searchKeyword'])) {
          $val = intval(preg_replace("/[^0-9]/", '', $attr['searchKeyword']));
          if ($val != 0) $where_clause .= " AND  d.customer_no LIKE '%$val%'  ";
          else $where_clause .= "   AND d.name LIKE '%$attr[searchKeyword]%'";
          } */
        if (!empty($attr['searchKeyword'])) {
            $where_clause = $this->objGeneral->flexiWhereRetriever("s.", $attr, $fieldsMeta);
            $order_clause = $this->objGeneral->flexiOrderRetriever("s.", $attr, $fieldsMeta);
        }
        if (empty($where_clause)) {
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("Supplier", $this->arrUser);
        }
        $response = array();
        $upToDate = date("Y-m-d");

        $Sql = "SELECT * from 
                    (SELECT  s.*,
                            CONCAT(purch.first_name,' ',purch.last_name) AS purchaser_code,
                            COALESCE((SELECT company_reg_no FROM srm_finance WHERE supplier_id = s.id LIMIT 1),'') AS company_reg_no
                    FROM sr_srm_general_sel as s
                    LEFT JOIN employees AS purch ON purch.id = s.salesperson_id
                    WHERE   s.type IN (2,3) AND
                            s.supplier_code IS NOT NULL AND
                            s.company_id=" . $this->arrUser['company_id'] . " ) as s
                where 1 " . $where_clause . "";
<<<<<<< HEAD
        //$Sql = $this->objsetup->whereClauseAppender($Sql, 24);
=======
        $Sql = $this->objsetup->whereClauseAppender($Sql, 24);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // echo $Sql;exit;
        /* ,c.country_id */
        /* , 
                         sr_getSupplierBalance('$upToDate',s.company_id,s.id) AS supplier_balance  */

        //defualt Variable
        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];


        if (!empty($attr['sort_column'])) {
<<<<<<< HEAD
            $column = 's.' . $attr[sort_column];
=======
            $column = 's.' . $attr['sort_column'];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            if ($attr['sort_column'] == 'code')
                $column = 's.' . 'srm_code';
            else if ($attr['sort_column'] == 'person')
                $column = 's.' . 'contact_person';
            else if ($attr['sort_column'] == "segment")
                $column = 'seg.' . 'title';
            else if ($attr['sort_column'] == "country_name")
                $column = 'cu.' . 'name';
            else if ($attr['sort_column'] == 'status')
                $column = 's.id';

            $order_type = "Order BY " . $column . " DESC";
        }

        $column = 's.id';

        if ($order_clause == "")
            $order_type = "Order BY " . $column . " DESC";
        else
            $order_type = $order_clause;

        $response = $this->objGeneral->preListing($attr, $Sql, $response, $total_limit, 's', $order_type);
        //echo $response['q'];exit;
        // $RS = $this->objsetup->CSI($response['q']);
        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData('Supplier');
        $response['response']['tbl_meta_data']['defaultFilter'] = $defaultFilter;

        // $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 's', $order_type);
        //echo "<pre>"; print_r($response);exit;
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q'], "supplier", sr_ViewPermission);

        // $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['srm_code'] = $Row['srm_code'];
                $result['supplier_code'] = $Row['supplier_code'];
                $result['supplier_no.'] = $Row['supplier_code'];
                $result['name'] = $Row['name'];

                $result['address_1'] = $Row['primary_address_1'];
                $result['address_2'] = $Row['primary_address_2'];
                $result['county'] = $Row['primary_county'];
                $result['web_address'] = $Row['web_address'];
                $result['email'] = $Row['email'];

                $result['primaryc_email'] = $Row['primaryc_email'];
                $result['country_name'] = $Row['primary_country_name']; 
                $result['supplier_classification'] = $Row['supplier_classification']; 
                $result['srm_classification_name'] = $Row['srm_classification_name']; 
                $result['purchaser_code'] = $Row['purchaser_code'];
                $result['company_reg_no'] = $Row['company_reg_no'];


                $result['primaryc_name'] = $Row['primaryc_name'];
                $result['primary_city'] = $Row['primary_city'];
                $result['primary_postcode'] = $Row['primary_postcode'];
                $result['primaryc_phone'] = $Row['primaryc_phone'];
                $result['type'] = $Row['type'];
                $result['Purchaser'] = $Row['Purchaser'];
                $result['region'] = ucwords($Row['region']);
                $result['segment'] = ucwords($Row['segment']);
                $result['selling_group'] = ucwords($Row['selling_group']);
                $result['statusp'] = $Row['statusp'];
                $result['currency'] = $Row['currency'];
                $result['posting_group'] = $Row['posting_group'];
                $result['payment_term'] = $Row['payment_term'];
                $result['bank_name'] = $Row['bank_name'];



                if ($attr['type']== '1') {
                    $result['account_payable_id'] = $Row['account_payable_id'];
                    $result['purchase_code_id'] = $Row['purchase_code_id'];
                    $result['purchaser_code'] = $Row['purchaser_code'];
                    $result['country_id'] = $Row['country_id'];
                    $result['anumber'] = $Row['account_payable_number'];
                    $result['pnumber'] = $Row['purchase_code_number'];
                    $result['payment_method'] = $Row['payment_method_id'];
                    $result['payment_term'] = $Row['payment_terms_id'];
                    $result['currency_id'] = $Row['currency_id'];
                    $result['contact_person'] = $Row['finance_contact_person'];
                    $result['fax'] = $Row['fax'];
                }
               
                $response['total'] = $Row['totalRecordCount'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'][] = array();
        }
        // $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData('Supplier');
        // $response['response']['tbl_meta_data']['defaultFilter'] = $defaultFilter;
        $response = $this->objGeneral->postListing($attr, $response);
        return $response;
    }

    function get_supplier_for_general_ledger($attr) {
        $response = array();

        $subQuery = "SELECT  s.id 
        FROM srm as s 
        WHERE   s.type IN (2,3) AND s.company_id=" . $this->arrUser['company_id'] . " ";
<<<<<<< HEAD
        //$subQuery = $this->objsetup->whereClauseAppender($subQuery, 24);
=======
        $subQuery = $this->objsetup->whereClauseAppender($subQuery, 24);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $Sql = "SELECT  s.*,CONCAT(`purch`.`first_name`,' ',`purch`.`last_name`) AS `purchaser_code` 
                FROM sr_srm_general_sel as s
                LEFT JOIN `employees` `purch` ON (`purch`.`id` = `s`.salesperson_id) 
                WHERE   s.type IN (2,3) AND 
                        s.supplier_code IS NOT NULL AND s.id IN (".$subQuery.") AND
                        (s.company_id=" . $this->arrUser['company_id'] . " )";

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['code'] = $Row['supplier_code'];
                $result['name'] = $Row['name'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'][] = array();
        }
        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData('Supplier');return $response;
    }

    function getSupplierCompleteListing($attr) {
        $response = array();
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $str_where = '';
        $order_type = '';
        $defaultFilter = false;

        $where_clause = $this->objGeneral->flexiWhereRetriever("s.", $attr, $fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("s.", $attr, $fieldsMeta);
        if (empty($where_clause)) {
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("SupplierSingleSelModal", $this->arrUser);
        }
        //sr_srm_general_sel

<<<<<<< HEAD
        $currency_arr_local = $this->objsetup->get_currencies_list($temp_attr_currency);
=======
        $currency_arr_local = $this->objsetup->get_currencies_list();
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $response['currency_arr_local']= $currency_arr_local['response'];

        $subQuery = "SELECT  id 
                     FROM srm as s 
                     WHERE  s.type IN (2,3) AND 
                            s.supplier_code IS NOT NULL AND  
                            s.company_id=" . $this->arrUser['company_id'] . " ";
<<<<<<< HEAD
        //$subQuery = $this->objsetup->whereClauseAppender($subQuery, 24);
=======
        $subQuery = $this->objsetup->whereClauseAppender($subQuery, 24);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $Sql = "SELECT * FROM (SELECT  *, COUNT(alternateLocID) AS `countLoc`
                                FROM sr_supplierpurchaseorderlisting
                                WHERE   type IN (2,3) AND 
                                        code IS NOT NULL AND  
                                        status =1 AND
                                        company_id=" . $this->arrUser['company_id'] . " AND 
                                        id IN (".$subQuery.")
                                GROUP BY id ) as s 
                WHERE 1  " . $where_clause . " ";
        // echo $Sql;exit; //  

         $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $column = 's.code';

        if ($order_clause == "")
            $order_type = "Order BY " . $column . " DESC";
        else
            $order_type = $order_clause;

        $response = $this->objGeneral->preListing($attr, $Sql, $response, $total_limit, 's', $order_type);
        //echo $response['q'];exit;
        // $RS = $this->objsetup->CSI($response['q']);
        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData('SupplierSingleSelModal');
        $response['response']['tbl_meta_data']['defaultFilter'] = $defaultFilter;
        $RS = $this->objsetup->CSI($response['q'], "supplier", sr_ViewPermission);

        // $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['code'] = $Row['code'];
                $result['anonymous_supplier'] = $Row['anonymous_supplier'];
                $result['name'] = $Row['name'];
                $result['supplier_contact'] = $Row['supplier_contact'];
                $result['city'] = $Row['city'];
                $result['postcode'] = $Row['postcode'];
                $result['Telephone'] = $Row['Telephone'];
                $result['type'] = $Row['type'];
                $result['country_name'] = ucwords($Row['country_name']);
                $result['segment'] = ucwords($Row['segment']);
                $result['region'] = ucwords($Row['region']);
                $result['status'] = $Row['statusp'];

                // if($Row['anonymous_supplier'] == 0){
                //     $result['DefaultLocation']  = $this->getDefaultLocation($Row['id']);
                // }

                if ($Row['anonymous_supplier'] == 0) {

                    if ($Row['locationID'] > 0) {
                        $result['locationDepot'] = $Row['locationDepot'];
                        $result['locationAddress'] = $Row['locationAddress'];
                        $result['locationAddress2'] = $Row['locationAddress2'];
                        $result['locationCity'] = $Row['locationCity'];
                        $result['locationCounty'] = $Row['locationCounty'];
                        $result['locationPostcode'] = $Row['locationPostcode'];
                        $result['locationID'] = $Row['locationID'];
                        $result['ship_to_contact_shiping'] = $Row['ship_to_contact_shiping'];
                        $result['direct_line'] = $Row['direct_line'];
                        $result['ship_to_email'] = $Row['ship_to_email'];
                        $result['booking_telephone'] = $Row['booking_telephone'];
                    } elseif ($Row['countLoc'] == 1) {

                        $result['locationDepot'] = $Row['alternateLocDepot'];
                        $result['locationAddress'] = $Row['alternateLocAddress'];
                        $result['locationAddress2'] = $Row['alternateLocAddress2'];
                        $result['locationCity'] = $Row['alternateLocCity'];
                        $result['locationCounty'] = $Row['alternateLocCounty'];
                        $result['locationPostcode'] = $Row['alternateLocPostcode'];
                        $result['locationID'] = $Row['alternateLocID'];
                        $result['ship_to_contact_shiping'] = $Row['alternateLocShipToContactShiping'];
                        $result['direct_line'] = $Row['alternateLocContactDirect_line'];
                        $result['ship_to_email'] = $Row['alternateLocContactShip_to_email'];
                        $result['booking_telephone'] = $Row['alternateLocContactbooking_telephone'];
                    }
                }

                if ($attr['type'] == '1') {
                    $result['account_payable_id'] = $Row['account_payable_id']; //$Row['account_payable_id'];
                    $result['purchase_code_id'] = $Row['purchase_code_id']; //$Row['purchase_code_id'];

                    $result['posting_group_id'] = $Row['posting_group_id'];
                    $result['purchase_code'] = $Row['purchaser_code'];
                    $result['county'] = $Row['county'];
                    $result['address_1'] = $Row['address_1'];
                    $result['address_2'] = $Row['address_2'];
                    $result['country_id'] = $Row['country_id'];


                    $result['billing_address_1'] = $Row['billing_address_1'];
                    $result['billing_address_2'] = $Row['billing_address_2'];
                    $result['billing_city'] = $Row['billing_city'];
                    $result['billing_county'] = $Row['billing_county'];
                    $result['billing_postcode'] = $Row['billing_postcode'];
                    $result['billing_country'] = $Row['billing_country'];
                    $result['billing_country_name'] = $Row['billing_country_name'];

                    $result['anumber'] = $Row['account_payable_number'];
                    $result['pnumber'] = $Row['purchase_code_number'];
                    $result['bank_account_id'] = $Row['bank_account_id'];
                    $result['bank_name'] = $Row['bank_name'];
                    $result['payment_method'] = $Row['payment_method_id'];
                    $result['payment_term'] = $Row['payment_terms_id'];
                    $result['currency_id'] = $Row['currency_id'];
                    // $result['contact_person'] = $Row['contact_person'];
                    $result['contact_id'] = $Row['primaryc_id'];
                    $result['contact_person'] = $Row['primaryc_name'];
                    $result['primaryc_name'] = $Row['primaryc_name'];
                    $result['fax'] = $Row['primaryc_fax'];
                    $result['email'] = $Row['primaryc_email'];
                }

                $response['total'] = $Row['totalRecordCount'];  
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }

        $response = $this->objGeneral->postListing($attr, $response);
        return $response;
    }

    function getSupplierInvListing($attr) {
        $response = array();

        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $str_where = '';
        $order_type = '';
        $defaultFilter = false;

        $where_clause = $this->objGeneral->flexiWhereRetriever("s.", $attr, $fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("s.", $attr, $fieldsMeta);
        if (empty($where_clause)) {
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("SupplierSingleSelModal", $this->arrUser);
        }

        $subQuery = "SELECT  id 
                     FROM sr_srm_general_sel as s 
                     WHERE  s.type IN (2,3) AND 
                            s.supplier_code IS NOT NULL AND  
                            s.company_id=" . $this->arrUser['company_id'] . " ";
<<<<<<< HEAD
        //$subQuery = $this->objsetup->whereClauseAppender($subQuery, 24);
=======
        $subQuery = $this->objsetup->whereClauseAppender($subQuery, 24);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $Sql = "SELECT * FROM (SELECT
                    `s`.`id`                                              AS `id`,
                    `s`.`unique_id`                                       AS `unique_id`,
                    `s`.`prev_code`                                       AS `prev_code`,
                    `s`.`srm_code`                                        AS `srm_code`,
                    `s`.`srm_no`                                          AS `srm_no`,
                    `s`.`supplier_code`                                   AS `code`,
                    `s`.`supplier_no`                                     AS `supplier_no`,
                    `s`.`anonymous_supplier`                              AS `anonymous_supplier`,
                    `s`.`name`                                            AS `name`,
                    `s`.`pref_method_of_communication`                    AS `pref_method_of_communication`,
                    `s`.`contact_person`                                  AS `contact_person`,
                    `s`.`segment_id`                                      AS `segment_id`,
                    `s`.`address_1`                                       AS `address_1`,
                    `s`.`job_title`                                       AS `job_title`,
                    `s`.`address_2`                                       AS `address_2`,
                    `s`.`phone`                                           AS `phone`,
                    `s`.`city`                                            AS `city`,
                    `s`.`fax`                                             AS `fax`,
                    `s`.`county`                                          AS `county`,
                    `s`.`mobile`                                          AS `mobile`,
                    `s`.`postcode`                                        AS `postcode`,
                    `s`.`direct_line`                                     AS `direct_line`,
                    `s`.`country_id`                                      AS `country_id`,
                    `s`.`email`                                           AS `email`,
                    `s`.`salesperson_id`                                  AS `salesperson_id`,
                    `s`.`support_person`                                  AS `support_person`,
                    `s`.`turnover`                                        AS `turnover`,
                    `s`.`source_of_crm`                                   AS `source_of_crm`,
                    `s`.`internal_sales`                                  AS `internal_sales`,
                    `s`.`company_type`                                    AS `company_type`,
                    `s`.`status`                                          AS `status`,
                    `s`.`status_date`                                     AS `status_date`,
                    `s`.`web_address`                                     AS `web_address`,
                    `s`.`selling_grp_id`                                  AS `selling_grp_id`,
                    `s`.`region_id`                                       AS `region_id`,
                    `s`.`credit_limit`                                    AS `credit_limit`,
                    `s`.`currency_id`                                     AS `currency_id`,
                    `s`.`type`                                            AS `type`,
                    `s`.`customer_status`                                 AS `customer_status`,
                    `s`.`company_id`                                      AS `company_id`,
                    `s`.`user_id`                                         AS `user_id`,
                    `s`.`customer_price`                                  AS `customer_price`,
                    `srm_loc_billing`.`id`                                AS `primary_id`,
                    `srm_loc_billing`.`location`                          AS `primary_location`,
                    `srm_loc_billing`.`is_billing_address`                AS `primary_is_billing_address`,
                    `srm_loc_billing`.`is_invoice_address`                AS `primary_is_invoice_address`,
                    `srm_loc_billing`.`is_delivery_collection_address`    AS `primary_is_delivery_collection_address`,
                    `srm_loc_billing`.`address`                           AS `primary_address_1`,
                    `srm_loc_billing`.`address_2`                         AS `primary_address_2`,
                    `srm_loc_billing`.`county`                            AS `primary_county`,
                    `srm_loc_billing`.`postcode`                          AS `primary_postcode`,
                    `srm_loc_billing`.`city`                              AS `primary_city`,
                    `srm_loc_billing`.`country`                           AS `primary_country`,
                    country.`nicename`                                   AS `primary_country_name`,
                    `srm_loc_billing`.`module_type`                       AS `loc_module_type`,
                    `srm_con_primary`.`module_type`                       AS `con_module_type`,
                    `srm_con_primary`.`id`                                AS `primaryc_id`,
                    `srm_con_primary`.`contact_name`                      AS `primaryc_name`,
                    `srm_con_primary`.`booking_instructions`              AS `primaryc_booking_instructions`,
                    `srm_con_primary`.`email`                             AS `primaryc_email`,
                    `srm_con_primary`.`fax`                               AS `primaryc_fax`,
                    `srm_con_primary`.`phone`                             AS `primaryc_phone`,
                    `srm_con_primary`.`mobile`                            AS `primaryc_mobile`,
                    `srm_con_primary`.`direct_line`                       AS `primaryc_direct_line`,
                    `srm_con_primary`.`job_title`                         AS `primaryc_job_title`,
                    `srm_con_primary`.`pref_method_of_communication`      AS `primaryc_pref_method_of_communication`,
                    `srm_finance`.`account_payable_id`     AS `account_payable_id`,
                    `srm_finance`.`bank_account_id`        AS `bank_account_id`,
                    `srm_finance`.`bank_name`              AS `bank_name`,
                    `srm_finance`.`purchase_code_id`       AS `purchase_code_id`,
                    `srm_finance`.`account_payable_number` AS `account_payable_number`,
                    `srm_finance`.`purchase_code_number`   AS `purchase_code_number`,
                    `srm_finance`.`payment_method_id`      AS `payment_method_id`,
                    `srm_finance`.`posting_group_id`       AS `posting_group_id`,
                    `srm_finance`.`payment_terms_id`       AS `payment_terms_id`,
                    `srm_finance`.`contact_person`         AS `finance_contact_person`,
                    `srm_finance`.`phone`                  AS `finance_phone`,
                    `srm_finance`.`email`                  AS `finance_email`,
                    `sr_sel_segment`(`s`.`company_id`,`s`.`segment_id`)  AS `segment`,
                    `sr_sel_region`(`s`.`company_id`,`s`.`region_id`)  AS `region`
                    FROM `srm` `s`
                    LEFT JOIN srm_finance ON srm_finance.supplier_id = s.id AND (s.type = 2 OR s.type = 3)
                    LEFT JOIN sr_alt_depot_billing_sel `srm_loc_billing` ON (`srm_loc_billing`.`acc_id` = `s`.`id` AND srm_loc_billing.`module_type` = 2 AND srm_loc_billing.`company_id` = `s`.`company_id`)
                    LEFT JOIN country ON (`srm_loc_billing`.`country` = `country`.`id`)
                    LEFT JOIN sr_alt_contact_primary_sel srm_con_primary ON (srm_con_primary.acc_id = `s`.`id`) AND (`srm_con_primary`.`module_type` = 2 AND srm_con_primary.`company_id` = `s`.`company_id`)
                    WHERE s.type IN (2,3) AND 
                        s.supplier_code IS NOT NULL AND                     
                        s.status = 1 AND
                        s.company_id = " . $this->arrUser['company_id'] . " AND 
                        s.id IN (".$subQuery.") ) as s 
                WHERE 1  " . $where_clause . " ";//" . $where_clause . " ";
        // echo $Sql;exit;

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $column = 's.code';

        if ($order_clause == "")
            $order_type = "Order BY " . $column . " DESC";
        else
            $order_type = $order_clause;

        $response = $this->objGeneral->preListing($attr, $Sql, $response, $total_limit, 's', $order_type);
        //echo $response['q'];exit;
        // $RS = $this->objsetup->CSI($response['q']);
        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData('SupplierSingleSelModal');
        $response['response']['tbl_meta_data']['defaultFilter'] = $defaultFilter;
        $RS = $this->objsetup->CSI($response['q'], "supplier", sr_ViewPermission);

        // $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['code'] = $Row['code'];
                $result['anonymous_supplier'] = $Row['anonymous_supplier'];
                $result['name'] = $Row['name'];
                $result['supplier_contact'] = $Row['contact_person'];
                // $result['Telephone'] = $Row['phone'];
                $result['type'] = $Row['type'];
                $result['country_name'] = ucwords($Row['primary_country_name']);
                $result['region'] = ucwords($Row['region']);
                $result['segment'] = ucwords($Row['segment']);
                $result['status'] = $Row['statusp'];
                $result['account_payable_id'] = $Row['account_payable_id'];
                $result['purchase_code_id'] = $Row['purchase_code_id'];

                $result['posting_group_id'] = $Row['posting_group_id'];
                $result['purchase_code'] = $Row['purchaser_code'];
                // $result['address_1'] = $Row['address_1'];
                // $result['address_2'] = $Row['address_2'];
                // $result['city'] = $Row['city'];
                // $result['county'] = $Row['county'];
                // $result['postcode'] = $Row['postcode'];
                // $result['country_id'] = $Row['country_id'];

                $result['address_1'] = $Row['primary_address_1'];
                $result['address_2'] = $Row['primary_address_2'];
                $result['city'] = $Row['primary_city'];
                $result['county'] = $Row['primary_county'];
                $result['postcode'] = $Row['primary_postcode'];
                $result['country_id'] = $Row['primary_country'];

                $result['anumber'] = $Row['account_payable_number'];
                $result['pnumber'] = $Row['purchase_code_number'];
                $result['bank_account_id'] = $Row['bank_account_id'];
                $result['bank_name'] = $Row['bank_name'];
                $result['payment_method'] = $Row['payment_method_id'];
                $result['payment_term'] = $Row['payment_terms_id'];
                $result['currency_id'] = $Row['currency_id'];
                // $result['contact_person'] = $Row['contact_person'];
                $result['contact_id'] = $Row['primaryc_id'];
                // $result['contact_person'] = $Row['primaryc_name'];
                $result['fax'] = $Row['primaryc_fax'];
                // $result['email'] = $Row['primaryc_email'];

                $result['contact_person'] = $Row['finance_contact_person'];
                $result['Telephone'] = $Row['finance_phone'];
                $result['email'] = $Row['finance_email'];

                $response['total'] = $Row['totalRecordCount']; 
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }

        $response = $this->objGeneral->postListing($attr, $response);
        return $response;
    }

    function getDefaultLocation($id) {
        // echo "<pre>";print_r($attr);

        $Sql = "SELECT d.id,d.depot,d.address,d.address_2,d.city,d.county,d.postcode,d.direct_line,
                       ac.contact_name as ship_to_contact_shiping,ac.direct_line,
                       ac.phone as booking_telephone,ac.email as ship_to_email
                FROM alt_depot d
                LEFT JOIN alt_contact as ac on d.alt_contact_id = ac.id 
                WHERE d.acc_id='$id' AND 
                      d.module_type=2 AND  
                      d.is_default=1 AND
                      d.company_id=" . $this->arrUser['company_id'] . "
                LIMIT 1";

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);
        $response = array();

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();

            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response = $Row;
        }
        else {

            $Sql2 = "SELECT d.id,d.depot,d.address,d.address_2,d.city,d.county,d.postcode,d.direct_line,
                            ac.contact_name as ship_to_contact_shiping,ac.direct_line,
                            ac.phone as booking_telephone,ac.email as ship_to_email,count(d.id) as did
                     FROM alt_depot d
                     LEFT JOIN alt_contact as ac on d.alt_contact_id = ac.id 
                     WHERE d.acc_id='$id' AND 
                           d.module_type=2 AND  
                           d.company_id=" . $this->arrUser['company_id'] . "
                     LIMIT 1";
            /* $Sql2 = "SELECT d.id,d.depot,d.address,d.address_2,d.city,d.county,d.postcode,d.direct_line,
              d.clcontact_name as ship_to_contact_shiping,d.cldirect_line as direct_line,
              d.clphone as booking_telephone,d.clemail as ship_to_email,count(d.id) as did
              FROM sr_alt_dept_sel d
              WHERE d.acc_id='$id' AND
              d.module_type=2 AND
              d.company_id=" . $this->arrUser['company_id'] . "
              LIMIT 1"; */

            //echo $Sql2; exit;
            //alt_depot,alt_contact
            $RS2 = $this->objsetup->CSI($Sql2);

            if ($RS2->RecordCount() > 0) {
                $Row2 = $RS2->FetchRow();

                foreach ($Row2 as $key => $value) {
                    if (is_numeric($key))
                        unset($Row2[$key]);
                }

                $Row2did = $Row2['did'];

                if ($Row2did == 1) {
                    $response = $Row2;
                } else {
                    $response = array();
                }
            } else {
                $response = array();
            }
        }

        return $response;
    }

    function add_supplier($arr_attr) {
    
        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['ErrorMessage'] = "";

        $this->objsetup->SRTraceLogsPHP($srLogTrace);
        
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
        $social_media_arr_contact = $arr_attr['social_media_arr_contact'];
        //print_r($arr_attr);   
        //echo "----".PHP_EOL;
        // $this->objGeneral->mysql_clean($arr_attr);
        //print_r($arr_attr);
        //exit;
        // echo "<pre>".print_r($arr_attr,true)."</pre>";exit;

        $social_media_str = "";
        $index = 1;

        foreach ($social_media_arr_contact as $sm) {
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

        $id = $arr_attr['acc_id'];
        $msg = 'Inserted';
        $update_check = "";

        if ($id > 0)
            $update_check = "  AND tst.id <> '" . $id . "'";  
        
        $data_pass = " tst.type IN (2,3) AND tst.supplier_code='" . $arr_attr['supplier_code'] . "' $update_check";
        $total = $this->objGeneral->count_duplicate_in_sql('srm', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Supplier No. Already Exists.';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record Already Exists.';
            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            return $response;
        }

        /* $data_pass = " tst.type IN (2,3) AND tst.supplier_code='" . $arr_attr['supplier_code'] . "' AND tst.name='" . $arr_attr['name'] . "' $update_check";

        $total = $this->objGeneral->count_duplicate_in_sql('srm', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record Already Exists.';
            $this->objsetup->SRTraceLogsPHP($srLogTrace);

            return $response;
        } */

        $pref_method_of_communication = (isset($arr_attr['pref_method_of_communication']) && $arr_attr['pref_method_of_communication'] != '') ? $arr_attr['pref_method_of_communication'] : 0;
        $purchaser_code_id = (isset($arr_attr['purchaser_code_id']) && $arr_attr['purchaser_code_id'] != '') ? $arr_attr['purchaser_code_id'] : 0;

        $region_id = (isset($arr_attr['region_id']) && $arr_attr['region_id'] != '') ? $arr_attr['region_id'] : 0;
        $support_person = (isset($arr_attr['support_person']) && $arr_attr['support_person'] != '') ? $arr_attr['support_person'] : 0;
        $selling_grp_id = (isset($arr_attr['selling_grp_id']) && $arr_attr['selling_grp_id'] != '') ? $arr_attr['selling_grp_id'] : 0;
        $turnover = (isset($arr_attr['turnover']) && $arr_attr['turnover'] != '') ? $arr_attr['turnover'] : 0;
        $internal_sales = (isset($arr_attr['internal_sales']) && $arr_attr['internal_sales'] != '') ? $arr_attr['internal_sales'] : 0;
        $company_type = (isset($arr_attr['company_type']) && $arr_attr['company_type'] != '') ? $arr_attr['company_type'] : 0;
        $source_of_crm = (isset($arr_attr['source_of_crm']) && $arr_attr['source_of_crm'] != '') ? $arr_attr['source_of_crm'] : 0;
        $supplier_no = (isset($arr_attr['supplier_no']) && $arr_attr['supplier_no'] != '') ? $arr_attr['supplier_no'] : 0;
        $anonymous_supplier = (isset($arr_attr['anonymous_supplier']) && $arr_attr['anonymous_supplier'] != '') ? $arr_attr['anonymous_supplier'] : 0;
        //$salesperson_id = (isset($arr_attr['salesperson_id']) && $arr_attr['salesperson_id'] != '')? $arr_attr['salesperson_id']: 0; 

        $locArray = $arr_attr['loc'];
        $contactArray = $arr_attr['contact'];

        // $LocExist = 0;
        // if(isset($arr_attr['loc'])) $LocExist = 1;

        $this->objGeneral->mysql_clean($arr_attr);

        if ($id == 0) {

            $Sql = "INSERT INTO srm 
                                SET
                                    transaction_id = SR_GetNextTransactionID(" . $this->arrUser['company_id'] . ", 2),
                                        unique_id = UUID(),
                                    supplier_code='$arr_attr[supplier_code]',
                                    supplier_no='$supplier_no' ,
                                    anonymous_supplier='$anonymous_supplier' ,
                                    pref_method_of_communication='$pref_method_of_communication',
                                    name='".$arr_attr['name']."',
                                    type=3,
                                    contact_person='$arr_attr[contact_person]',
                                    address_1='".preg_replace("/[^a-zA-Z0-9`_.,;@#%~'\"\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-\s\\\\]+/", "", $arr_attr['address_1'])."',
                                    job_title='$arr_attr[job_title]',
                                    address_2='".preg_replace("/[^a-zA-Z0-9`_.,;@#%~'\"\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-\s\\\\]+/", "", $arr_attr['address_2'])."',
                                    phone='$arr_attr[phone]',
                                    city='$arr_attr[city]',
                                    fax='$arr_attr[fax]',
                                    county='$arr_attr[county]',
                                    country_id='$arr_attr[country_id]',
                                    mobile='$arr_attr[mobile]',
                                    postcode='$arr_attr[postcode]',
                                    direct_line='$arr_attr[direct_line]',
                                    support_person='$support_person',
                                    email='$arr_attr[email]',
                                    salesperson_id='" . $purchaser_code_id . "',
                                    turnover='$turnover',
                                    internal_sales='$internal_sales',
                                    segment_id='$arr_attr[segment_id]',
                                    web_address='$arr_attr[web_address]',
                                    credit_limit='$arr_attr[credit_limit]',
                                    srm_classification='$arr_attr[supplier_classification]',
                                    supplier_classification='$arr_attr[supplier_classification]',
                                    additionalInformation = '$arr_attr[additionalInformation]',
                                    selling_grp_id='" . $selling_grp_id . "',
                                    region_id='" . $region_id . "',
                                    company_type='" . $company_type . "',
                                    source_of_crm='" . $source_of_crm . "',
                                    currency_id='$arr_attr[currency_id]',
                                    status_date= '" . $this->objGeneral->convert_date($arr_attr['status_date']) . "',
<<<<<<< HEAD
                                    status='$arr_attr[status]',
=======
                                    status='".$arr_attr['status']."',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    AddedBy='" . $this->arrUser['id'] . "',
                                    AddedOn='" . current_date . "',
                                    user_id='" . $this->arrUser['id'] . "',
                                    $social_media_str
                                    company_id='" . $this->arrUser['company_id'] . "'";

            // $RS = $this->objsetup->CSI($Sql);
            $RS = $this->objsetup->CSI($Sql, "supplier", sr_AddPermission);
            $id = $this->Conn->Insert_ID();
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {

            /* $checkLocSql = "SELECT COUNT(*) AS total FROM alt_depot
                                    WHERE acc_id = ".$arr_attr['id']." AND 
                                        module_type = 2 AND 
                                        company_id=" . $this->arrUser['company_id'];

            $RS_CheckLoc = $this->objsetup->CSI($checkLocSql);

            if($RS_CheckLoc->fields['total'] > 0)
            { */ 

            if ((isset($locArray->depot) && $locArray->depot != "" ) || (isset($locArray->postcode) && $locArray->postcode != "")) {  

                $whereLocID = '';

                if($locArray->alt_loc_id  >0)
                    $whereLocID = 'id <>  '.$locArray->alt_loc_id.' AND';


                if($locArray->is_billing_address == 0) 
                {
                    $checkBillingSql = "SELECT COUNT(*) AS total FROM alt_depot
                                        WHERE acc_id = ".$arr_attr['id']." AND 
                                              module_type = 2 AND 
                                              is_billing_address = 1 AND
                                              $whereLocID
                                              company_id=" . $this->arrUser['company_id'];

                    $RS_Check_billing = $this->objsetup->CSI($checkBillingSql);

                    if($RS_Check_billing->fields['total'] == 0)
                    {
                        $response['ack'] = 0;
                        $response['error'] = 'Please select billing and payment address';
                        return $response;
                    }
                }
                if($locArray->is_invoice_address == 0)
                {
                    $checkPaymentSql = "SELECT COUNT(*) AS total FROM alt_depot
                                        WHERE acc_id = ".$arr_attr['id']." AND 
                                              module_type = 2 AND 
                                              is_invoice_address = 1 AND
                                              $whereLocID
                                              company_id=" . $this->arrUser['company_id'];

                    $RS_Check_payment = $this->objsetup->CSI($checkPaymentSql);

                    if($RS_Check_payment->fields['total'] == 0 )
                    {
                        $response['ack'] = 0;
                        $response['error'] = 'Please select billing and payment address';
                        return $response;
                    }
                }
            }

            $Sql = "UPDATE srm 
                            SET   
                                supplier_code='$arr_attr[supplier_code]',
                                supplier_no='$supplier_no',
                                anonymous_supplier='$anonymous_supplier' ,
                                pref_method_of_communication='$pref_method_of_communication',
                                segment_id='$arr_attr[segment_id]',
                                name='".$arr_attr['name']."' ,
                                contact_person='$arr_attr[contact_person]',
                                address_1='".preg_replace("/[^a-zA-Z0-9`_.,;@#%~'\"\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-\s\\\\]+/", "", $arr_attr['address_1'])."',
                                job_title='$arr_attr[job_title]',
                                address_2='".preg_replace("/[^a-zA-Z0-9`_.,;@#%~'\"\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-\s\\\\]+/", "", $arr_attr['address_2'])."',
                                phone='$arr_attr[phone]',
                                city='$arr_attr[city]',
                                fax='$arr_attr[fax]',
                                county='$arr_attr[county]',
                                country_id='$arr_attr[country_id]',
                                mobile='$arr_attr[mobile]',
                                postcode='$arr_attr[postcode]',
                                direct_line='$arr_attr[direct_line]',
                                support_person='$support_person',
                                email='$arr_attr[email]',
                                salesperson_id='" . $purchaser_code_id . "',
                                turnover='$turnover',
                                internal_sales='$internal_sales',
                                web_address='$arr_attr[web_address]',
                                credit_limit='$arr_attr[credit_limit]',
                                srm_classification='$arr_attr[supplier_classification]',
                                supplier_classification='$arr_attr[supplier_classification]',
                                additionalInformation = '$arr_attr[additionalInformation]',
                                selling_grp_id='" . $selling_grp_id . "',
                                region_id='" . $region_id . "',
                                company_type='" . $company_type . "',
                                source_of_crm='" . $source_of_crm . "',
                                currency_id='$arr_attr[currency_id]',
                                ChangedBy='" . $this->arrUser['id'] . "',
                                ChangedOn='" . current_date . "',
                                status_date= '" . $this->objGeneral->convert_date($arr_attr['status_date']) . "',
                                $social_media_str
<<<<<<< HEAD
                                status='$arr_attr[status]'
=======
                                status='".$arr_attr['status']."'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                WHERE id = $id 
                                Limit 1";

            // echo $Sql;exit;
            $response = $this->objsetup->CSI($Sql, "supplier_gneraltab", sr_AddEditPermission);
            $response99['ack'] = 1;
            $response99['error'] = NULL;
            $response = $response99;
        }

        $response2[] = array();

        $response2['id'] = $id;
        $response['id'] = $id;

        $locArray->acc_id = $id;
        $locArray->module_type = 2;

        $contactArray->acc_id = $id;
        $contactArray->module_type = 2; 

        if ((isset($locArray->depot) && $locArray->depot != "" ) || (isset($locArray->postcode) && $locArray->postcode != "")) {

            if (empty($arr_attr['alt_loc_id']))
                $response2 = $this->objSrm->add_alt_depot2($locArray, $response2);
            else
                $response2 = $this->objSrm->update_alt_depot2($locArray, $response2);

            if ($response2['ack'] == 0 && $response2['ack'] != "")
                return $response2;
        }       

        if ((isset($contactArray->contact_name) && $contactArray->contact_name != "") || $arr_attr['alt_contact_id']>0) {

            $contactArray->alt_contact_id = $arr_attr['alt_contact_id'];

            if (empty($arr_attr['alt_contact_id']))
                $response2 = $this->objSrm->add_alt_contact2($contactArray, $response2);
            else
                $response2 = $this->objSrm->update_alt_contact2($contactArray, $response2);
        }



        /* if (empty($arr_attr['alt_loc_id']))
          $response2 = $this->objSrm->add_alt_depot2($arr_attr['loc'], $response2);
          else
          $response2 = $this->objSrm->update_alt_depot2($arr_attr['loc'], $response2);

          if($response2['ack']==0 && $response2['ack']!="")  return $response2;

          if (isset($contactArray->contact_name) && $arr_attr['contact']->contact_name != "" )
          {
          if (empty($arr_attr['alt_contact_id']))
          $response2 = $this->objSrm->add_alt_contact2($arr_attr['contact'], $response2);
          else
          $response2 = $this->objSrm->update_alt_contact2($arr_attr['contact'], $response2);
          } */

        if (!($arr_attr['alt_contact_id'] > 0))
            $arr_attr['alt_contact_id'] = $response2['alt_contact_id'];

        if (!($arr_attr['alt_loc_id'] > 0))
            $arr_attr['alt_loc_id'] = $response2['alt_location_id'];

        //echo "<pre>"; print_r($response2);exit; 
        
        $response['alt_loc_id'] = $arr_attr['alt_loc_id'];
        $response['alt_contact_id'] = $arr_attr['alt_contact_id'];  


        if ($arr_attr['alt_loc_id'] > 0 && $arr_attr['alt_contact_id'] > 0) {
            $sqlC = "SELECT COUNT(*) as loc_con_count
                     From alt_depot_contact
                     WHERE acc_id = '$id' and module_type = '2' and 
                           location_id = '$arr_attr[alt_loc_id]' and
                           contact_id = '$arr_attr[alt_contact_id]'";
            //echo $sqlC;
            $RSC = $this->objsetup->CSI($sqlC);
            $Row = $RSC->FetchRow();

            if ($Row['loc_con_count'] == 0) {
                $response2['srm_id'] = $id;
                $response2['acc_id'] = $id;
                $response2['module_type'] = 2;
                $response2['alt_location_id'] = $arr_attr['alt_loc_id'];
                $response2['alt_contact_id'] = $arr_attr['alt_contact_id'];
                $response3 = $this->objSrm->add_contact_location_dropdown_general($response2);
            }
        }
        
        $this->Conn->commitTrans();
        $this->Conn->autoCommit = true;

        $srLogTrace = array();
        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Exit';

        $this->objsetup->SRTraceLogsPHP($srLogTrace);

        return $response;
    }

    // for insertion of unique id to enter records
    function get_unique_id($attr) {
        //unique id procedure removed from here. reason: no more requirment at this stage.

        $moduleCodeType = 1;

        $Sql = "SELECT type
                FROM ref_module_category_value
                WHERE  module_code_id = 17 AND status = 1 AND company_id=" . $this->arrUser['company_id'] . "
                LIMIT 1";
        // echo  $Sql;exit;

        $rs4 = $this->objsetup->CSI($Sql);

        if ($rs4->RecordCount() > 0){
            $moduleCodeType = $rs4->fields['type'];
        }

        $response['ack'] = 1;
        $response['moduleCodeType'] = $moduleCodeType;
        $response['error'] = 'Record  Inserted.';
        $response = $this->objSrm->load_srm_nested_data($attr, $response);
        return $response;
    }

    function check_for_module_code($attr) {
        //unique id procedure removed from here. reason: no more requirment at this stage.

        $moduleCodeType = 1;

        $Sql = "SELECT type
                FROM ref_module_category_value
                WHERE  module_code_id = 17 AND status = 1 AND company_id=" . $this->arrUser['company_id'] . "
                LIMIT 1";
        // echo  $Sql;exit;

        $rs4 = $this->objsetup->CSI($Sql);

        if ($rs4->RecordCount() > 0){
            $moduleCodeType = $rs4->fields['type'];
        }

        $response['ack'] = 1;
        $response['moduleCodeType'] = $moduleCodeType;
        $response['error'] = 'Record  Inserted.';
        
        return $response;
    }

    function get_supplier_code($attr) {
        $Sql = "SELECT max(ef.customer_no) as count
                FROM srm ef
                WHERE ef.status=1 and ef.type IN (2,3)
                and ef.company_id=" . $this->arrUser['company_id'] . " ";


        $crm = $this->objsetup->CSI($Sql)->FetchRow();
        //echo $Sql; exit;
        $nubmer = $crm['count'] + 1;

        // if ($attr['is_increment'] == 1 || $nubmer == '')   $nubmer++;
        //	$code ='SUP'; //if($attr['type']==3) $code ='SUP';//$code['prefix'];

        return array('code' => 'SUP' . $this->objGeneral->module_item_prefix($nubmer), 'number' => $nubmer);
    }

<<<<<<< HEAD
//------------------ supplier Finance--------------------
=======
    //------------------ supplier Finance--------------------
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    function get_finance_listings($attr) {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = "";
        $where_clause = "AND type =1 AND company_id =" . $this->arrUser['company_id'];
        if (!empty($attr['keyword'])) {
            $where_clause .= " AND name LIKE '%$attr[keyword]%' ";
        }
        if (empty($attr['all'])) {
            if (empty($attr['start']))
                $attr['start'] = 0;
            if (empty($attr['limit']))
                $attr['limit'] = 10;
            $limit_clause = " LIMIT $attr[start] , $attr[limit]";
        }
        $response = array();

        $Sql = "SELECT id, contact_person, email
				FROM srm_finance
				WHERE 1 
				" . $where_clause . "
				ORDER BY id DESC";

        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['contact_person'] = $Row['contact_person'];
                $result['email'] = $Row['email'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_supplier_finance($attr) {
        $Sql = "SELECT finance.*,bank_account.name as bank_name,payment_terms.name as payment_term, fncharge.name as finance_charges,incharge.name as insurance_charges
                    FROM srm_finance
                    LEFT JOIN bank_account on bank_account.id = finance.bank_account_id
                    LEFT JOIN payment_terms on payment_terms.id = finance.payment_terms_id
                    LEFT JOIN charges as fncharge on fncharge.id = finance.finance_charges_id
                    LEFT JOIN charges as incharge on incharge.id = finance.insurance_charges_id
<<<<<<< HEAD
                    WHERE supplier_id='$attr[supplier_id]' AND finance.type = 'customer'
=======
                    WHERE supplier_id='".$attr['supplier_id']."' AND finance.type = 'customer'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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

    function get_finance_by_id($table_name, $id) {
        $Sql = "SELECT d.*,srm.currency_id,ref_posting_group.name as ref_posting
                FROM srm_finance d
                LEFT JOIN srm on srm.id=d.supplier_id
                LEFT JOIN ref_posting_group on ref_posting_group.id=d.posting_group_id
                WHERE supplier_id=$id
                LIMIT 1";

        //echo 	$Sql;exit;
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
        }
        return $response;
    }

    function getSupplierFinance($attr) {
        $Sql = "SELECT d.*,srm.currency_id,bank_account.name as bank_name,ref_posting_group.name as ref_posting
                FROM srm_finance d
                LEFT JOIN srm on srm.id=d.supplier_id
                LEFT JOIN ref_posting_group on ref_posting_group.id=d.posting_group_id
                LEFT JOIN bank_account ON bank_account.id = d.bank_account_id
<<<<<<< HEAD
                WHERE supplier_id=$attr[supplier_id]
=======
                WHERE supplier_id=".$attr['supplier_id']."
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                LIMIT 1";

        // echo 	$Sql;exit; 
        $RS = $this->objsetup->CSI($Sql, "supplier_financetab", sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            require_once(SERVER_PATH . "/classes/Hr.php");
            $objHr = new Hr($this->arrUser);

            $temp_attr['posting_group_id'] = $Row['posting_group_id'];
            $posting_group_arr = $objHr->get_vat_group_by_posting_group($temp_attr);
            $response['arrVATPostGrpPurchase'] = ($posting_group_arr['ack'] == 1) ? $posting_group_arr['response'] : array();

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function update_finance($attr) {
        $msg = "";
        $this->objGeneral->mysql_clean($attr);
        
<<<<<<< HEAD
        $sql_total = "SELECT  id,count(id) as total	FROM srm_finance where  supplier_id='" . $attr[supplier_id] . "'  LIMIT 1 ";
=======
        $sql_total = "SELECT  id,count(id) as total	FROM srm_finance where  supplier_id='" . $attr['supplier_id'] . "'  LIMIT 1 ";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $rs_count = $this->objsetup->CSI($sql_total);
        $doc_id = $rs_count->fields['id'];
        $total = $rs_count->fields['total'];

        $posting = (isset($attr['posting']) && $attr['posting'] != '') ? $attr['posting'] : 0;
        $customer_status = (isset($attr['customer_status']) && $attr['customer_status'] != '') ? $attr['customer_status'] : 0;
        $account_payable_id = (isset($attr['account_payable_id']) && $attr['account_payable_id'] != '') ? $attr['account_payable_id'] : 0;
        $purchase_code_id = (isset($attr['purchase_code_id']) && $attr['purchase_code_id'] != '') ? $attr['purchase_code_id'] : 0;
        $contact_id = (isset($attr['contact_id']) && $attr['contact_id'] != '') ? $attr['contact_id'] : 0;
        $bill_to_customer_id = (isset($attr['bill_to_customer_id']) && $attr['bill_to_customer_id'] != '') ? $attr['bill_to_customer_id'] : 0;
        $gen_bus_posting_group = (isset($attr['gen_bus_posting_group']) && $attr['gen_bus_posting_group'] != '') ? $attr['gen_bus_posting_group'] : 0;
        $status = (isset($attr['status']) && $attr['status'] != '') ? $attr['status'] : 0;
        $finance_charges_id = (isset($attr['finance_charges_id']) && $attr['finance_charges_id'] != '') ? $attr['finance_charges_id'] : 0;
        $insurance_charges_id = (isset($attr['insurance_charges_id']) && $attr['insurance_charges_id'] != '') ? $attr['insurance_charges_id'] : 0;
        $vat_id = (isset($attr['vat_id']) && $attr['vat_id'] != '') ? $attr['vat_id'] : 0;
        $posting_group_id = (isset($attr['posting_group_id']) && $attr['posting_group_id'] != '') ? $attr['posting_group_id'] : 0;
        $payment_terms_id = (isset($attr['payment_terms_id']) && $attr['payment_terms_id'] != '') ? $attr['payment_terms_id'] : 0;
        $payment_method_id = (isset($attr['payment_method_id']) && $attr['payment_method_id'] != '') ? $attr['payment_method_id'] : 0;
        $bank_account_id = (isset($attr['bank_account_id']) && $attr['bank_account_id'] != '') ? $attr['bank_account_id'] : 0;
        $excl_from_report = (isset($attr['excl_from_report']) && $attr['excl_from_report'] != '') ? $attr['excl_from_report'] : 0;


        if ($total > 0) {
            $msg = "Updated";
            $Sql = "UPDATE srm_finance
                           SET
                                account_payable_id='$account_payable_id',
                                account_payable_number='$attr[account_payable_number]',
                                purchase_code_id='$purchase_code_id',
                                overrider_id='$attr[overrider_id]',
                                purchase_code_number='$attr[purchase_code_number]',
                                contact_person='$attr[contact_person]',
                                phone='$attr[phone]',
                                alt_contact_person='$attr[alt_contact_person]',
                                alt_contact_email='$attr[alt_contact_email]',
                                contact_id='$contact_id',
                                fax='$attr[fax]',
                                posting='$posting',
                                bill_to_customer='$attr[bill_to_customer]',
                                bill_to_customer_id='$bill_to_customer_id',
                                payment_terms_id='$payment_terms_id',
                                payment_method_id='$payment_method_id',
                                email='$attr[email]',
                                bank_account_id='$bank_account_id',
                                generate='$attr[generate]',
                                purchaseOrderEmail = '$attr[purchaseOrderEmail]',
                                debitNoteEmail = '$attr[debitNoteEmail]',
                                remittanceAdviceEmail = '$attr[remittanceAdviceEmail]',
                                currency='$attr[currency]',
                                gen_bus_posting_group='$gen_bus_posting_group',
                                status='$status',
                                vat_bus_posting_group='$attr[vat_bus_posting_group]',
                                customer_posting_group='$attr[customer_posting_group]',
                                company_reg_no='$attr[company_reg_no]',
                                finance_charges_id='$finance_charges_id',
                                insurance_charges_id='$insurance_charges_id',
                                vat_id='$vat_id',
                                customer_status='$customer_status',
                                rebate='$attr[rebate]',
                                vat_number='$attr[vat_number]',
                                account_name='$attr[account_name]',
                                sort_code='$attr[sort_code]',
                                account_no='$attr[account_no]',
                                swift_no='$attr[swift_no]',
                                iban='$attr[iban]',
                                bill_bank_name='$attr[bill_bank_name]',
                                payment_term='$attr[payment_term]',
                                excl_from_report='$excl_from_report',
                                bank_name='$attr[bank_name]',
                                bank_address='$attr[bank_address]',
                                posting_group_id='$posting_group_id'

                                WHERE id = $doc_id";

            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql, "supplier_financetab", sr_AddEditPermission);

            $response['update_id'] = $doc_id;
            $response['status'] = 'update';
        } else {
            $msg = "Inserted";
            $Sql = "INSERT INTO srm_finance
                                SET
<<<<<<< HEAD
                                    supplier_id='$attr[supplier_id]',
=======
                                    supplier_id='".$attr['supplier_id']."',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    type='1',
                                    account_payable_id='$account_payable_id',
                                    overrider_id='$attr[overrider_id]',
                                    account_payable_number='$attr[account_payable_number]',
                                    purchase_code_id='$purchase_code_id',
                                    purchase_code_number='$attr[purchase_code_number]',
                                    contact_person='$attr[contact_person]',
                                    phone='$attr[phone]',
                                    alt_contact_person='$attr[alt_contact_person]',
                                    alt_contact_email='$attr[alt_contact_email]',
                                    contact_id='$contact_id',
                                    fax='$attr[fax]',
                                    posting='$posting',
                                    bill_to_customer='$attr[bill_to_customer]',
                                    bill_to_customer_id='$bill_to_customer_id',
                                    payment_terms_id='$payment_terms_id',
                                    payment_method_id='$payment_method_id',
                                    email='$attr[email]',
                                    bank_account_id='$bank_account_id',
                                    generate='$attr[generate]',
                                    purchaseOrderEmail = '$attr[purchaseOrderEmail]',
                                    debitNoteEmail = '$attr[debitNoteEmail]',
                                    remittanceAdviceEmail = '$attr[remittanceAdviceEmail]',
                                    currency='$attr[currency]',
                                    gen_bus_posting_group='$gen_bus_posting_group',
                                    status='$status',
                                    vat_bus_posting_group='$attr[vat_bus_posting_group]',
                                    customer_posting_group='$attr[customer_posting_group]',
                                    company_reg_no='$attr[company_reg_no]',
                                    finance_charges_id='$finance_charges_id',
                                    insurance_charges_id='$insurance_charges_id',
                                    vat_id='$vat_id',
                                    customer_status='$customer_status',
                                    rebate='$attr[rebate]',
                                    vat_number='$attr[vat_number]',
                                    account_name='$attr[account_name]',
                                    sort_code='$attr[sort_code]',
                                    account_no='$attr[account_no]',
                                    swift_no='$attr[swift_no]',
                                    iban='$attr[iban]',
                                    bill_bank_name='$attr[bill_bank_name]',
                                    payment_term='$attr[payment_term]',
                                    excl_from_report='$excl_from_report',
                                    bank_name='$attr[bank_name]',
                                    bank_address='$attr[bank_address]',
                                    posting_group_id='$posting_group_id',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "'
                                    ";
            // $response['update_id'] = 0;
            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql, "supplier_financetab", sr_AddEditPermission);

            $response['update_id'] = $this->Conn->Insert_ID();
            $response['status'] = 'insert';
        }

        $response['ack'] = 1;
        $response['error'] = NULL;
        
        return $response;
    }

    //----------------- SRM Price Offer-----------------------------------

    function get_price_offer_listings($attr) {

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";

        if (!empty($attr['keyword'])) {
            $where_clause .= " AND name LIKE '%$attr[keyword]%' ";
        }
        if (empty($attr['all'])) {
            if (empty($attr['start']))
                $attr['start'] = 0;
            if (empty($attr['limit']))
                $attr['limit'] = 10;
            $limit_clause = " LIMIT $attr[start] , $attr[limit]";
        }
        $response = array();

        $Sql = "SELECT c.id,c.offer_date,c.offer_valid_date,c.product_code,c.product_description,c.volume_1_price
                FROM  srm_price_offer_listing  c
                where  c.crm_id=".$attr['id']." and c.status=1 and
                c.company_id=" . $this->arrUser['company_id'] . "
                order by c.id DESC ";
        //echo $Sql;exit;


        $RS = $this->objsetup->CSI($Sql);



        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['item_no'] = $Row['product_code'];
                $result['desciption'] = $Row['product_description'];
                $result['price'] = $Row['volume_1_price'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_supplier_price_offer_listing($attr) {
        ///	print_r($attr);exit;
        $doc_id = $attr['id'];

        $update_check = "";

        if ($doc_id > 0)
            $update_check = "  AND tst.id <> '" . $doc_id . "'";

        $data_pass = "  tst.offered_by='" . $attr['offered_by'] . "'  AND tst.crm_id='" . $attr['crm_id'] . "' $update_check";

        $total = $this->objGeneral->count_duplicate_in_sql('srm_price_offer_listing', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
        if ($doc_id == 0) {




            $Sql = "INSERT INTO srm_price_offer_listing
						SET
<<<<<<< HEAD
						      crm_id = '$attr[crm_id]',
						      offered_by = '$attr[offered_by]',
						      offered_by_id = '$attr[offered_by_id]',
						      product_id = '$attr[product_id]',
=======
						      crm_id = '".$attr['crm_id']."',
						      offered_by = '".$attr['offered_by']."',
						      offered_by_id = '".$attr['offered_by_id']."',
						      product_id = '".$attr['product_id']."',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
						      product_code = '$attr[product_code]',
						      product_description = '$attr[product_description]',
						      offer_method_id = '$attr[offer_method_id]',
						      offer_valid_date = '" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "' '" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "',
						      offer_date =  '" . $this->objGeneral->convert_date($attr['offer_date']) . "' ,
						      volume_1_price = '$attr[volume_1_price]',
						      user_id='" . $this->arrUser['id'] . "',
						      company_id='" . $this->arrUser['company_id'] . "'
						      ";


            $new = 'Add';
            $new_msg = 'Insert';
        } else {


            $Sql = "UPDATE srm_price_offer_listing
						   SET
<<<<<<< HEAD
						        offered_by = '$attr[offered_by]',
						        offered_by_id = '$attr[offered_by_id]',
						        product_id = '$attr[product_id]',
=======
						        offered_by = '".$attr['offered_by']."',
						        offered_by_id = '".$attr['offered_by_id']."',
						        product_id = '".$attr['product_id']."',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
						        product_code = '$attr[product_code]',
						        product_description = '$attr[product_description]',
						        offer_method_id = '$attr[offer_method_id]',
						        offer_valid_date = '" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "' ,
						        offer_date = '" . $this->objGeneral->convert_date($attr['offer_date']) . "' ,
						        volume_1_price = '$attr[volume_1_price]'

						        where id='".$attr['id']."'";
        }
        $RS = $this->objsetup->CSI($Sql);



        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
        }

        return $response;
    }

    function get_price_offers($attr) {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = "";
        $where_clause = "AND cpoffer.company_id =" . $this->arrUser['company_id'];




        $response = array();


        $Sql = "SELECT c.id,c.offer_date,c.offer_valid_date,c.product_code,c.product_description,c.volume_1_price
                    FROM  srm_price_offer_listing  c
                    where  c.crm_id=".$attr['id']." and c.status=1 and
                    c.company_id=" . $this->arrUser['company_id'] . "
                    order by c.id DESC ";

        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['offered_by'] = $Row['offered_by'];
                $result['product_no'] = $Row['product_no'];
                $result['product_description'] = $Row['product_description'];
                $result['one_four_pallet'] = $Row['one_four_pallet'];
                $result['half_load'] = $Row['half_load'];
                $result['primary'] = $Row['primary'];
                $result['valid_from'] = $Row['valid_from'];
                $result['valid_until'] = $Row['valid_until'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_price_offer_by_id($attr) {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM srm_price_offer_listing
				WHERE id='".$attr['id']."'
				LIMIT 1";
        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'] = $Row;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_price_offer($attr) {
        //print_r($attr);exit;
        $doc_id = $attr['update_id'];

        $update_check = "";

        if ($doc_id > 0)
            $update_check = "  AND tst.id <> '" . $doc_id . "'";

        $data_pass = "  tst.offered_by='" . $attr['offered_by'] . "'  AND tst.crm_id='" . $attr['crm_id'] . "' $update_check";

        $total = $this->objGeneral->count_duplicate_in_sql('srm_price_offer_listing', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($doc_id == 0) {



            $Sql = "INSERT INTO srm_price_offer_listing
						        SET
<<<<<<< HEAD
						            crm_id = '$attr[crm_id]',
						            offered_by = '$attr[offered_by]',
						            offered_by_id = '$attr[offered_by_id]',
						            product_id = '$attr[product_id]',
=======
						            crm_id = '".$attr['crm_id']."',
						            offered_by = '".$attr['offered_by']."',
						            offered_by_id = '".$attr['offered_by_id']."',
						            product_id = '".$attr['product_id']."',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
						            product_code = '$attr[product_code]',
						            product_description = '$attr[product_description]',
						            offer_method_id = '$attr[offer_method_id]',
						            offer_valid_date = '" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "',
						            offer_date ='" . $this->objGeneral->convert_date($attr['offer_date']) . "' ,
						            volume_1_price = '$attr[volume_1_price]',
						            user_id='" . $this->arrUser['id'] . "',
						            company_id='" . $this->arrUser['company_id'] . "'
						            ";


            $new = 'Add';
            $new_msg = 'Insert';
        } else {


            $Sql = "UPDATE srm_price_offer_listing
						   SET
<<<<<<< HEAD
						        offered_by = '$attr[offered_by]',
						        offered_by_id = '$attr[offered_by_id]',
						        product_id = '$attr[product_id]',
=======
						        offered_by = '".$attr['offered_by']."',
						        offered_by_id = '".$attr['offered_by_id']."',
						        product_id = '".$attr['product_id']."',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
						        product_code = '$attr[product_code]',
						        product_description = '$attr[product_description]',
						        offer_method_id = '$attr[offer_method_id]',
						        offer_valid_date = '" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "',
						        offer_date = '" . $this->objGeneral->convert_date($attr['offer_date']) . "',
						        volume_1_price = '$attr[volume_1_price]'
						        where id='".$attr['id']."'";
        }
        $RS = $this->objsetup->CSI($Sql);
        //echo $Sql;exit;


        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
        }

        return $response;
    }

    function delete_price_offer($attr) {

        $this->objGeneral->mysql_clean($attr);

        /* 	$Sql = "DELETE FROM srm_price_offer_listing
          WHERE id = ".$attr['id']." LIMIT 1";
         */
        //echo $Sql."<hr>"; exit;


        $Sql = "UPDATE srm_price_offer_listing SET  status=0 WHERE id = ".$attr['id']." Limit 1";
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

<<<<<<< HEAD
//------------- Price Offer Volume Module-------------------------
=======
    //------------- Price Offer Volume Module-------------------------
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    function get_supplier_list_product_id($attr) {

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";

        if (!empty($attr['keyword'])) {
            $where_clause .= " AND name LIKE '%$attr[keyword]%' ";
        }
        if (empty($attr['all'])) {
            if (empty($attr['start']))
                $attr['start'] = 0;
            if (empty($attr['limit']))
                $attr['limit'] = 10;
            $limit_clause = " LIMIT $attr[start] , $attr[limit]";
        }
        $response = array();


        $Sql = "SELECT srm_volume_discount.id,srm_volume_discount.start_date,srm_volume_discount.end_date
                        ,srm_volume_discount.discount_value,srm_volume_discount.supplier_type
                        ,v.description 	,srm_volume_discount.purchase_price,srm_volume_discount.discount_price
                        ,srm_volume_discount.product_code
                        FROM srm_volume_discount
                        Left JOIN price_offer_volume  v ON v.id = srm_volume_discount.volume_id
<<<<<<< HEAD
                        WHERE srm_volume_discount.crm_id='$attr[crm_id]' and srm_volume_discount.status=1
=======
                        WHERE srm_volume_discount.crm_id='".$attr['crm_id']."' and srm_volume_discount.status=1
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        order by srm_volume_discount.id DESC";



        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['Volume'] = $Row['description'];

                $result[' Standard  Price'] = $Row['purchase_price'];
                $result[' item code'] = $Row['product_code'];
                if ($Row['supplier_type'] == 1) {
                    $result['Type'] = 'Percentage';
                } else {
                    $result['Type'] = 'Value';
                }
                $result['Discount'] = ($Row['supplier_type'] == 1) ? $Row['discount_value'] . "%" : $Row['discount_value'];
                $result[' Discounted Price'] = $Row['discount_price'];

                $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }

        return $response;
    }

    function get_supplier_volume_discount_listing_by_id($attr) {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM srm_volume_discount_listing
				WHERE id='".$attr['id']."'
				LIMIT 1";
        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'] = $Row;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_supplier_volume_discount_listing($attr) {

        $doc_id = $attr['id'];

        $update_check = "";

        if ($doc_id > 0)
            $update_check = "  AND tst.id <> '" . $doc_id . "'";

        $data_pass = "  tst.offered_by='" . $attr['offered_by'] . "'  AND tst.crm_id='" . $attr['crm_id'] . "' $update_check";

        $total = $this->objGeneral->count_duplicate_in_sql('srm_volume_discount_listing', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
        if ($doc_id == 0) {



            $Sql = "INSERT INTO srm_volume_discount_listing
<<<<<<< HEAD
						SET crm_id = '$attr[crm_id]',offered_by = '$attr[offered_by]',offered_by_id = '$attr[offered_by_id]',product_id = '$attr[product_id]',product_code = '$attr[product_code]',product_description = '$attr[product_description]',offer_method_id = '$attr[offer_method_id]', offer_valid_date = '" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "' ,offer_date ='" . $this->objGeneral->convert_date($attr['offer_date']) . "'  ,user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
=======
						SET crm_id = '".$attr['crm_id']."',offered_by = '".$attr['offered_by']."',offered_by_id = '".$attr['offered_by_id']."',product_id = '".$attr['product_id']."',product_code = '$attr[product_code]',product_description = '$attr[product_description]',offer_method_id = '$attr[offer_method_id]', offer_valid_date = '" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "' ,offer_date ='" . $this->objGeneral->convert_date($attr['offer_date']) . "'  ,user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


            //	$doc_id = $this->Conn->Insert_ID();$new='Inserted';
            $new = 'Add';
            $new_msg = 'Insert';
        } else {


            $Sql = "UPDATE srm_volume_discount_listing
<<<<<<< HEAD
	SET offered_by = '$attr[offered_by]',offered_by_id = '$attr[offered_by_id]',product_id = '$attr[product_id]',product_code = '$attr[product_code]',product_description = '$attr[product_description]',offer_method_id = '$attr[offer_method_id]', offer_valid_date = '" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "',offer_date ='" . $this->objGeneral->convert_date($attr['offer_date']) . "' where id='".$attr['id']."'";
=======
	SET offered_by = '".$attr['offered_by']."',offered_by_id = '".$attr['offered_by_id']."',product_id = '".$attr['product_id']."',product_code = '$attr[product_code]',product_description = '$attr[product_description]',offer_method_id = '$attr[offer_method_id]', offer_valid_date = '" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "',offer_date ='" . $this->objGeneral->convert_date($attr['offer_date']) . "' where id='".$attr['id']."'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        }
        $RS = $this->objsetup->CSI($Sql);


        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
        }

        return $response;
    }

    function get_price_offer_volumes($attr) {

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";

        if (!empty($attr['keyword'])) {
            $where_clause .= " AND name LIKE '%$attr[keyword]%' ";
        }
        if (empty($attr['all'])) {
            if (empty($attr['start']))
                $attr['start'] = 0;
            if (empty($attr['limit']))
                $attr['limit'] = 10;
            $limit_clause = " LIMIT $attr[start] , $attr[limit]";
        }
        $response = array();

        $Sql = "SELECT srm_volume_discount.id, srm_volume_discount.name, srm_volume_discount_volume.code , srm_volume_discount_volume.status  FROM srm_volume_discount 
			left  JOIN company on company.id=srm_volume_discount.company_id 
			where srm_volume_discount.status=1 and ( srm_volume_discount.company_id=" . $this->arrUser['company_id'] . " 
			or  company.parent_id=" . $this->arrUser['company_id'] . ")
			order by srm_volume_discount.id DESC";



        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];

                $result['document_code'] = $Row['document_code'];
                $result['document_title'] = $Row['title'];
                $result['folder_name'] = $Row['fname'];
                $result['image'] = $Row['name'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }

        return $response;
    }

    function delete_price_offer_volume($arr_attr) {
        $this->objGeneral->mysql_clean($arr_attr);

        /* $Sql = "DELETE FROM srm_volume_discount
          WHERE id = ".$arr_attr['id']." LIMIT 1";

         */
        $Sql = "UPDATE srm_volume_discount 
			SET  
			status=0
<<<<<<< HEAD
			WHERE id = ".$attr['id']." Limit 1";
=======
			WHERE id = ".$arr_attr['id']." Limit 1";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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

    function supplier_by_id($attr) {

        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT *  FROM srm_volume_discount  where id='".$attr['id']."' 	LIMIT 1";
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'] = $Row;
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function update_product_value($arr_attr) {
        //	echo '<pre>'; print_r($arr_attr); exit;

        $product_id = $arr_attr->product_id;
        $current_date = strtotime(date('Y-m-d'));
        $tab_change = 'tab_supplier';
        $sp_id = $arr_attr->sp_id;
        if ($sp_id == 0) {


            $Sql1 = "INSERT INTO srm_volume_discount SET
											 volume_id='" . $arr_attr->volume_1s . "'  
											 ,volume_1=1  ,product_code = '" . $arr_attr->product_code . "'  
											,supplier_type='" . $arr_attr->supplier_type_1s . "'  
											 ,purchase_price='" . $arr_attr->purchase_price_1 . "' 
											,discount_value='" . $arr_attr->discount_value_1 . "'  
											 ,discount_price='" . $arr_attr->discount_price_1 . "' 
									 		,price_list_id='" . $arr_attr->price_list_id . "' 
											,start_date=  '" . $this->objGeneral->convert_date($arr_attr->start_date) . "'
											,end_date=   '" . $this->objGeneral->convert_date($arr_attr->end_date) . "'
											,crm_id='" . $product_id . "' 	,status='1'  
											,company_id='" . $this->arrUser['company_id'] . "' 
											,user_id='" . $this->arrUser['id'] . "'
											,date_added='" . current_date . "'";
            if ($arr_attr->volume_1s != NULL)
                $RS = $this->objsetup->CSI($Sql1);

            $Sql2 = "INSERT INTO srm_volume_discount SET  
											 volume_id='" . $arr_attr->volume_2s . "' 
											  ,volume_2=2    ,product_code = '" . $arr_attr->product_code . "'  
											,supplier_type='" . $arr_attr->supplier_type_2s . "'  
											 ,purchase_price='" . $arr_attr->purchase_price_2 . "' 
											,discount_value='" . $arr_attr->discount_value_2 . "'  
											 ,discount_price='" . $arr_attr->discount_price_2 . "' 
									 		,price_list_id='" . $arr_attr->price_list_id . "' 
									 		,start_date=   '" . $this->objGeneral->convert_date($arr_attr->start_date) . "'
											,end_date=    '" . $this->objGeneral->convert_date($arr_attr->end_date) . "'
											,crm_id='" . $product_id . "' 	,status='1'  
											,company_id='" . $this->arrUser['company_id'] . "' 
											,user_id='" . $this->arrUser['id'] . "'
											,date_added='" . current_date . "'";
            if ($arr_attr->volume_2s != NULL)
                $RS = $this->objsetup->CSI($Sql2);

            $Sql3 = "INSERT INTO srm_volume_discount SET  
											 volume_id='" . $arr_attr->volume_3s . "'  
											 ,volume_3=3  ,product_code = '" . $arr_attr->product_code . "'  
											,supplier_type='" . $arr_attr->supplier_type_3s . "'  
											 ,purchase_price='" . $arr_attr->purchase_price_3 . "' 
											,discount_value='" . $arr_attr->discount_value_3 . "'  
											 ,discount_price='" . $arr_attr->discount_price_3 . "' 
											,price_list_id='" . $arr_attr->price_list_id . "' 
											,start_date=   '" . $this->objGeneral->convert_date($arr_attr->start_date) . "'
											,end_date=   '" . $this->objGeneral->convert_date($arr_attr->end_date) . "'
											,crm_id='" . $product_id . "' 	,status='1'  
											,company_id='" . $this->arrUser['company_id'] . "' 
											,user_id='" . $this->arrUser['id'] . "'
											,date_added='" . current_date . "'";
            if ($arr_attr->volume_2s != NULL)
                $RS = $this->objsetup->CSI($Sql3);
            $new = 'Add';
            $new_msg = 'Insert';
        } else {

            $Sql1 = "UPDATE srm_volume_discount SET  
											 volume_id='" . $arr_attr->volume_ids . "'  
											,supplier_type='" . $arr_attr->supplier_types . "' 
											,discount_value='" . $arr_attr->discount_value . "'  
											WHERE id = " . $sp_id . "   Limit 1";
            $RS = $this->objsetup->CSI($Sql1);
        }

        if ($product_id > 0) {
            $response['product_id'] = $product_id;
            $response['ack'] = 1;
            $response['error'] = NULL;
<<<<<<< HEAD
            $response['msg'] = $message;
=======
            $response['msg'] = NULL;//$message;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $response['info'] = $new;
            $response['tab_change'] = $tab_change;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated!';
<<<<<<< HEAD
            $response['msg'] = $message;
=======
            $response['msg'] = 'Record not updated!';//$message;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        }

        return $response;
    }

    function get_method($attr) {

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";

        if (!empty($attr['keyword'])) {
            $where_clause .= " AND name LIKE '%$attr[keyword]%' ";
        }
        if (empty($attr['all'])) {
            if (empty($attr['start']))
                $attr['start'] = 0;
            if (empty($attr['limit']))
                $attr['limit'] = 10;
            $limit_clause = " LIMIT $attr[start] , $attr[limit]";
        }
        $response = array();

        $Sql = "SELECT c.id,c.code,c.name
		FROM  get_method  c 
	    where   c.status=1 and   c.type=1 and 
		c.company_id=" . $this->arrUser['company_id'] . "	 
		order by c.id DESC ";



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
        }
        return $response;
    }

    function add_method($attr) {


        $data_pass = "  tst.type=1 AND  tst.name='" . $attr->name . "'";

        $total = $this->objGeneral->count_duplicate_in_sql('get_method', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO get_method
					SET  
					type=1
					name='" . $attr->name . "', 
					company_id='" . $this->arrUser['company_id'] . "',
					user_id='" . $this->arrUser['id'] . "'";
        $RS = $this->objsetup->CSI($Sql);


        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record Inserted Successfully';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
        }
        return $response;
    }

    function get_shipping_list($attr) {

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";

        if (!empty($attr['keyword'])) {
            $where_clause .= " AND name LIKE '%$attr[keyword]%' ";
        }
        if (empty($attr['all'])) {
            if (empty($attr['start']))
                $attr['start'] = 0;
            if (empty($attr['limit']))
                $attr['limit'] = 10;
            $limit_clause = " LIMIT $attr[start] , $attr[limit]";
        }
        $response = array();

        $Sql = "SELECT c.id,c.code,c.name
		FROM  get_method  c 
	    where   c.status=1 and   c.type=2   and
		c.company_id=" . $this->arrUser['company_id'] . "	 
		order by c.id DESC ";
        //echo $Sql;exit;


        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                //$result['code'] = $Row['code'];
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

    function add_shipping($attr) {



        $data_pass = "  tst.name='" . $attr->name . "'  and  tst.type=2 )";

        $total = $this->objGeneral->count_duplicate_in_sql('get_method', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO get_method
				SET  
				type=2,
				name='" . $attr->name . "', 
				company_id='" . $this->arrUser['company_id'] . "',
				user_id='" . $this->arrUser['id'] . "'";
        $RS = $this->objsetup->CSI($Sql);


        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record Inserted Successfully';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
        }
        return $response;
    }

<<<<<<< HEAD
//----------SRM shiping Module----------------------------

    function get_shipping($attr) {
        /* 	global $objFilters;
          $where = array(0=>array('document.module_id'=>19),1=>array('document.row_id'=>$attr[crm_id]),2=>array('document.type'=>2));
=======
    //----------SRM shiping Module----------------------------

    function get_shipping($attr) {
        /* 	global $objFilters;
          $where = array(0=>array('document.module_id'=>19),1=>array('document.row_id'=>$attr['crm_id']),2=>array('document.type'=>2));
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
          return $objFilters->get_module_listing(12, "document",'','',$attr[more_fields],'',$where);
         */

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";

        if (!empty($attr['keyword'])) {
            $where_clause .= " AND name LIKE '%$attr[keyword]%' ";
        }
        if (empty($attr['all'])) {
            if (empty($attr['start']))
                $attr['start'] = 0;
            if (empty($attr['limit']))
                $attr['limit'] = 10;
            $limit_clause = " LIMIT $attr[start] , $attr[limit]";
        }
        $response = array();

        $Sql = "SELECT srm_agent_area_list.id,  srm_agent_area_list.coverage_area  
	 		 FROM srm_agent_area_list 
			left  JOIN company on company.id=srm_agent_area_list.company_id 
			where srm_agent_area_list.status=1 and
			 srm_agent_area_list.sale_id='".$attr['id']."' and ( srm_agent_area_list.company_id=" . $this->arrUser['company_id'] . " 
			or  company.parent_id=" . $this->arrUser['company_id'] . ")
			order by srm_agent_area_list.id DESC";



        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['area'] = $Row['coverage_area'];
                //	$result['coverage_area'] = $Row['coverage_area'];
                // 	$result['receive_by'] = $Row['offered_by'];
                // $result['shipping_quantity'] = $Row['shipping_quantity'];  
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }

        return $response;
    }

    function add_supplier_shipping($arr_attr) {
<<<<<<< HEAD
        $doc_id = $arr_attr[update_id];
=======
        $doc_id = $arr_attr['update_id'];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if ($doc_id > 0) {

            $Sql = "UPDATE  shipping_agent_sale SET  
<<<<<<< HEAD
									offered_by='" . $arr_attr[offered_by] . "'
									,offered_by_id='" . $arr_attr[offered_by_id] . "'
									,price_method='" . $arr_attr[price_method] . "' 
									,shipping_method='" . $arr_attr[shipping_method] . "' 
									,shipping_quantity='" . $arr_attr[shipping_quantity] . "'
									,valid_from='" . $arr_attr[valid_from] . "'
									,valid_from_id='" . $arr_attr[valid_from] . "'
									,valid_to='" . $arr_attr[valid_to] . "'
									,valid_to_id='" . $arr_attr[valid_to_id] . "' 
									,offer_method='" . $arr_attr[offer_method] . "'
									,shiping_coments='" . $arr_attr[shiping_coments] . "'
=======
									offered_by='" . $arr_attr['offered_by'] . "'
									,offered_by_id='" . $arr_attr['offered_by_id'] . "'
									,price_method='" . $arr_attr['price_method'] . "' 
									,shipping_method='" . $arr_attr['shipping_method'] . "' 
									,shipping_quantity='" . $arr_attr['shipping_quantity'] . "'
									,valid_from='" . $arr_attr['valid_from'] . "'
									,valid_from_id='" . $arr_attr['valid_from'] . "'
									,valid_to='" . $arr_attr['valid_to'] . "'
									,valid_to_id='" . $arr_attr['valid_to_id'] . "' 
									,offer_method='" . $arr_attr['offer_method'] . "'
									,shiping_coments='" . $arr_attr['shiping_coments'] . "'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
									WHERE id = " . $doc_id . "  Limit 1";
            $RS = $this->objsetup->CSI($Sql);
        } else {

            $Sql = "INSERT INTO srm_agent_area SET  							
									
<<<<<<< HEAD
									 coverage_area='" . $arr_attr[coverage_area] . "'
									,coverage_area_id='" . $arr_attr[coverage_area_id] . "'
									
									,crm_id='" . $arr_attr[crm_id] . "'
=======
									 coverage_area='" . $arr_attr['coverage_area'] . "'
									,coverage_area_id='" . $arr_attr['coverage_area_id'] . "'
									
									,crm_id='" . $arr_attr['crm_id'] . "'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
									,status='1'  
									,company_id='" . $this->arrUser['company_id'] . "' 
									,user_id='" . $this->arrUser['id'] . "'
									,date_added='" . current_date . "'";

            $RS = $this->objsetup->CSI($Sql);
            $sale_id = $this->Conn->Insert_ID();

            //$price_id= explode(",",  $arr_attr[coverage_price]);
<<<<<<< HEAD
            $sale_name_id = explode(",", $arr_attr[coverage_area_id]);
            $area_name = explode(",", $arr_attr[coverage_area]);
=======
            $sale_name_id = explode(",", $arr_attr['coverage_area_id']);
            $area_name = explode(",", $arr_attr['coverage_area']);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            $i = 0;
            foreach ($sale_name_id as $key => $area_id) {
                if (is_numeric($area_id)) {

                    $Sql = "INSERT INTO srm_agent_area_list SET  
										cover_area_id='" . $area_id . "'
										,coverage_area='" . $area_name[$i] . "'    
										,sale_id='" . $sale_id . "'  
										,status='1'   
										,company_id='" . $this->arrUser['company_id'] . "' 
										,user_id='" . $this->arrUser['id'] . "',
										date_added='" . current_date . "'";
                    $RS = $this->objsetup->CSI($Sql);
                }
                $i++;
            }
        }

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
        }

        return $response;
    }

    function add_cusomer($arr_attr) {

        // $counter_supplier++;
<<<<<<< HEAD
        $sale_customer_id = $arr_attr[update_id];
=======
        $sale_customer_id = $arr_attr['update_id'];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if ($sale_customer_id > 0) {
            $Sql = "DELETE FROM shipping_agent WHERE sale_id = $sale_customer_id";
            $RS = $this->objsetup->CSI($Sql);

<<<<<<< HEAD
            $coverage_area2 = explode(",", $arr_attr[coverage_area2]);
            $coverage_area_id2 = explode(",", $arr_attr[coverage_area_id2]);
            $coverage_price2 = explode(",", $arr_attr[coverage_price2]);
=======
            $coverage_area2 = explode(",", $arr_attr['coverage_area2']);
            $coverage_area_id2 = explode(",", $arr_attr['coverage_area_id2']);
            $coverage_price2 = explode(",", $arr_attr['coverage_price2']);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            $i = 0;
            foreach ($coverage_area_id2 as $key => $customer_id) {
                if (is_numeric($customer_id)) {
                    $Sql = "INSERT INTO shipping_agent SET  
												cover_area_id='" . $customer_id . "'
												,coverage_price='" . $coverage_price2[$i] . "'  
												,coverage_area='" . $coverage_area2[$i] . "'    
												,sale_id='" . $sale_customer_id . "' ,status='1'   
												,company_id='" . $this->arrUser['company_id'] . "' 
												,user_id='" . $this->arrUser['id'] . "'
												,date_added='" . current_date . "'";

                    $RS = $this->objsetup->CSI($Sql);
                }
                $i++;
            }

<<<<<<< HEAD
            $Sql = "UPDATE  shipping_agent_sale SET coverage_area='" . $arr_attr[coverage_area2] . "'  
=======
            $Sql = "UPDATE  shipping_agent_sale SET coverage_area='" . $arr_attr['coverage_area2'] . "'  
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
									WHERE id = " . $sale_customer_id . "  Limit 1";
            $RS = $this->objsetup->CSI($Sql);
        }


        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
        }

        return $response;
    }

    function get_coverage_all_areas($attr) {
        $response = array();

        $Sql = "SELECT  c.id, c.coverage_price, c.coverage_area, c.cover_area_id
		   FROM shipping_agent c  where sale_id ='".$attr['id']."' and status=1 ";
        $RS = $this->objsetup->CSI($Sql);
        $selected = array();
        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {
                $selected[] = $Row['id'];

                $result['cover_area_id'] = $Row['cover_area_id'];
                $result['name'] = $Row['coverage_area'];
                $result['price'] = $Row['coverage_price'];
                $response2['response_selected'][] = $result;
            }
        }

        //print_r($response2['response_selected']);exit;

        $limit_clause = $where_clause = "";

        if (!empty($attr['keyword'])) {
            $where_clause .= " AND name LIKE '%$attr[keyword]%' ";
        }
        if (empty($attr['all'])) {
            if (empty($attr['start']))
                $attr['start'] = 0;
            if (empty($attr['limit']))
                $attr['limit'] = 10;
            $limit_clause = " LIMIT $attr[start] , $attr[limit]";
        }


        $Sql = "SELECT  c.id, c.name, c.price
			FROM coverage_areas  c
			left  JOIN company on company.id= c.company_id 
			where c.status=1 and  ( c.company_id=" . $this->arrUser['company_id'] . " 
			or  company.parent_id=" . $this->arrUser['company_id'] . ")
			order by c.id DESC";



        $RS = $this->objsetup->CSI($Sql);



        $selected_count = 0;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                //$result['price'] = $Row['price'];

                $value_count = 0;
                foreach ($response2['response_selected'] as $key => $m_id) {
                    // echo $m_id['cover_area_id'];
                    if ($Row['id'] == $m_id['cover_area_id']) {
                        $value_count = 1;
                        $selected_count++;
                    }

                    $result['checked'] = $value_count;
                }

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        $response['selected_count'] = $selected_count;

        //	print_r($response);exit;
        return $response;
    }

    function add_supplier_area_list($arr_attr) {
        $tab_change = 'tab_doc';
<<<<<<< HEAD
        $doc_id = $arr_attr[update_id];
=======
        $doc_id = $arr_attr['update_id'];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if ($doc_id > 0) {

            $Sql = "UPDATE  shipping_agent_sale SET  
<<<<<<< HEAD
									offered_by='" . $arr_attr[offered_by] . "'
									,offered_by_id='" . $arr_attr[offered_by_id] . "'
									,price_method='" . $arr_attr[price_method] . "' 
									,shipping_method='" . $arr_attr[shipping_method] . "' 
									,shipping_quantity='" . $arr_attr[shipping_quantity] . "'
									,valid_from='" . $arr_attr[valid_from] . "'
									,valid_from_id='" . $arr_attr[valid_from] . "'
									,valid_to='" . $arr_attr[valid_to] . "'
									,valid_to_id='" . $arr_attr[valid_to_id] . "' 
									,offer_method='" . $arr_attr[offer_method] . "'
									,shiping_coments='" . $arr_attr[shiping_coments] . "'
=======
									offered_by='" . $arr_attr['offered_by'] . "'
									,offered_by_id='" . $arr_attr['offered_by_id'] . "'
									,price_method='" . $arr_attr['price_method'] . "' 
									,shipping_method='" . $arr_attr['shipping_method'] . "' 
									,shipping_quantity='" . $arr_attr['shipping_quantity'] . "'
									,valid_from='" . $arr_attr['valid_from'] . "'
									,valid_from_id='" . $arr_attr['valid_from'] . "'
									,valid_to='" . $arr_attr['valid_to'] . "'
									,valid_to_id='" . $arr_attr['valid_to_id'] . "' 
									,offer_method='" . $arr_attr['offer_method'] . "'
									,shiping_coments='" . $arr_attr['shiping_coments'] . "'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
									WHERE id = " . $doc_id . "  Limit 1";
            $RS = $this->objsetup->CSI($Sql);
        } else {

            $Sql = "INSERT INTO shipping_agent_sale SET  							
									
<<<<<<< HEAD
									 coverage_area='" . $arr_attr[coverage_area] . "'
									,coverage_area_id='" . $arr_attr[coverage_area_id] . "'
									,coverage_price='" . $arr_attr[coverage_price] . "'
									,offered_by='" . $arr_attr[offered_by] . "'
									,offered_by_id='" . $arr_attr[offered_by_id] . "'
									,price_method='" . $arr_attr[price_method] . "' 
									,shipping_method='" . $arr_attr[shipping_method] . "' 
									,shipping_quantity='" . $arr_attr[shipping_quantity] . "'
									,valid_from='" . $arr_attr[valid_from] . "'
									,valid_from_id='" . $arr_attr[valid_from] . "'
									,valid_to='" . $arr_attr[valid_to] . "'
									,valid_to_id='" . $arr_attr[valid_to_id] . "' 
									,offer_method='" . $arr_attr[offer_method] . "'
									,shiping_coments='" . $arr_attr[shiping_coments] . "'
									,crm_id='" . $arr_attr[crm_id] . "'
=======
									 coverage_area='" . $arr_attr['coverage_area'] . "'
									,coverage_area_id='" . $arr_attr['coverage_area_id'] . "'
									,coverage_price='" . $arr_attr['coverage_price'] . "'
									,offered_by='" . $arr_attr['offered_by'] . "'
									,offered_by_id='" . $arr_attr['offered_by_id'] . "'
									,price_method='" . $arr_attr['price_method'] . "' 
									,shipping_method='" . $arr_attr['shipping_method'] . "' 
									,shipping_quantity='" . $arr_attr['shipping_quantity'] . "'
									,valid_from='" . $arr_attr['valid_from'] . "'
									,valid_from_id='" . $arr_attr['valid_from'] . "'
									,valid_to='" . $arr_attr['valid_to'] . "'
									,valid_to_id='" . $arr_attr['valid_to_id'] . "' 
									,offer_method='" . $arr_attr['offer_method'] . "'
									,shiping_coments='" . $arr_attr['shiping_coments'] . "'
									,crm_id='" . $arr_attr['crm_id'] . "'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
									,status='1'  
									,company_id='" . $this->arrUser['company_id'] . "' 
									,user_id='" . $this->arrUser['id'] . "'
									,date_added='" . current_date . "'";
            $new = 'Add';
            $new_msg = 'Insert';
            $RS = $this->objsetup->CSI($Sql);
            $sale_id = $this->Conn->Insert_ID();

<<<<<<< HEAD
            $customer_price_id = explode(",", $arr_attr[coverage_price]);
            $sale_name_id = explode(",", $arr_attr[coverage_area_id]);
            $customer_area = explode(",", $arr_attr[coverage_area]);
=======
            $customer_price_id = explode(",", $arr_attr['coverage_price']);
            $sale_name_id = explode(",", $arr_attr['coverage_area_id']);
            $customer_area = explode(",", $arr_attr['coverage_area']);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            $i = 0;
            foreach ($sale_name_id as $key => $customer_id) {
                if (is_numeric($customer_id)) {

                    $Sql = "INSERT INTO shipping_agent SET  
										cover_area_id='" . $customer_id . "'
										,coverage_price='" . $customer_price_id[$i] . "'  
										,coverage_area='" . $customer_area[$i] . "'    
										,sale_id='" . $sale_id . "'  
										,status='1'   
										,company_id='" . $this->arrUser['company_id'] . "' 
										,user_id='" . $this->arrUser['id'] . "',
										date_added='" . current_date . "'";
                    $RS = $this->objsetup->CSI($Sql);
                }
                $i++;
            }
        }

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
        }

        return $response;
    }

    //----------------------------- Classification ----------------------------------------------------//

    function get_ref_classifications($attr) {
        // $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $order_type = "";
        $response = array();
        $strWhere = "";
        if (isset($attr['main_type']))
            $strWhere .= " and c.type =" . $attr["main_type"];

        $Sql = "SELECT c.id,c.name,(select rf.ref_value from srm_classification rf where rf.ref_type=c.id and rf.company_id=" . $this->arrUser['company_id'] . " and   rf.type=$attr[main_type]   limit  1) as options FROM ref_classification c     WHERE  c.status=1 and c.type=$attr[main_type] ";
        //echo $Sql;exit;
        $order_type = "order by c.sorting ASC";
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //  echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['option'] = $Row['options'];
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

    function get_supplier_classifications($attr) {
        // $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $order_type = "";
        $response = array();
        $strWhere = "";

<<<<<<< HEAD
//        $Sql = "SELECT c.id, c.title,c.description FROM crm_classification c  INNER JOIN company ON company.id=c.company_id
//            WHERE  c.status=1	 AND c.company_id='" . $this->arrUser['company_id'] . "'  $strWhere ";
=======
    //    $Sql = "SELECT c.id, c.title,c.description FROM crm_classification c  INNER JOIN company ON company.id=c.company_id
    //        WHERE  c.status=1	 AND c.company_id='" . $this->arrUser['company_id'] . "'  $strWhere ";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if (isset($attr['main_type']))
            $strWhere .= " and c.type =" . $attr["main_type"];

        $Sql = "SELECT rf.id, rf.name as title,c.ref_value FROM srm_classification c  INNER JOIN ref_classification  rf ON rf.id=c.ref_type  WHERE c.ref_value=1 AND c.company_id='" . $this->arrUser['company_id'] . "'  $strWhere ";
        //echo $Sql;exit;
        $order_type = "order by rf.sorting ASC";
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

    function add_supplier_classification($arr_attr) {
        $sqld = "DELETE FROM srm_classification   where   type=$arr_attr[types] and  company_id=" . $this->arrUser['company_id'] . " ";
        $this->objsetup->CSI($sqld);

        $Sqle = "INSERT INTO srm_classification (type,ref_type,ref_value, company_id,user_id,created_date) VALUES ";

        foreach ($arr_attr['arr_module_types'] as $item) {
            if ($item->option)
                $Sqle .= "(  $arr_attr[types],$item->id,$item->option," . $this->arrUser['company_id'] . "	," . $this->arrUser['id'] . "	,'" . current_date . "' ),";
        }


        $RS = $this->objsetup->CSI(substr($Sqle, 0, -1));


        $response['ack'] = 1;
        $response['error'] = NULL;
        return $response;
        exit;

        //old method single record

        if ($arr_attr['id'] == 0) {

<<<<<<< HEAD
            $Sql = "INSERT INTO srm_classification    SET   type=$arr_attr[types],ref_type=$arr_attr[ref_types],`title`='".$arr_attr['title']."',`description`='$arr_attr[description]',created_date='" . current_date . "',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
=======
            $Sql = "INSERT INTO srm_classification    SET   type=$arr_attr[types],ref_type=$arr_attr[ref_types],`title`='".$arr_attr['title']."',`description`='".$arr_attr['description']."',created_date='" . current_date . "',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
        } else {

            $Sql = "Update srm_classification    SET   `title`='".$arr_attr['title']."'  where id=".$arr_attr['id']."  and company_id='" . $this->arrUser['company_id'] . "'";

            $RS = $this->objsetup->CSI($Sql);
        }

        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['Update'] = 0;
            $response['id'] = $id;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Not updated';
            $response['Update'] = 0;
        }
        return $response;
    }

}
<<<<<<< HEAD

?>
=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
