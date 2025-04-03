<?php
// error_reporting(E_ERROR);
require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/General.php");
require_once(SERVER_PATH . "/classes/Setup.php");
require_once(SERVER_PATH . "/classes/Stock.php");
require_once(SERVER_PATH . "/classes/Hr.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require(SERVER_PATH . "/vendor/sendgrid-php/sendgrid-php.php");
//require_once(SERVER_PATH . "/classes/class.phpmailer.php");
require 'vendor/autoload.php';

class Srm extends Xtreme
{

    private $Conn = null;
    private $objGeneral = null;
    private $arrUser = null;
    private $objsetup = null;
    private $objstock = null;
    private $objHr = null;

    function __construct($user_info = array())
    {
        parent::__construct();
        $this->Conn = parent::GetConnection();
        $this->objGeneral = new General($user_info);
        $this->objsetup = new Setup($user_info);
        $this->objstock = new Stock($user_info);
        $this->objHr = new Hr($user_info);
        $this->arrUser = $user_info;              
        $this->sendgrid = new \SendGrid('SG.U1fh-cwZQfSPoO8WzzWe0w.0w0gH1UCAQEPbOsnipbF0iU0SPzJpGNU8C1CCPg03h0');
    }

    // static
    function delete_update($table_name, $column, $id)
    {
        $Sql = "UPDATE $table_name SET  $column=0 	WHERE srm_id = $id ";

        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted.';
        }
        return $response;
    }

    function deletePurchaseOrderBeforeSave($attr)
    {
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

        $Sql = "DELETE FROM srm_invoice	
                WHERE id = ".$attr['id']." 
                Limit 1 ";

        //echo $Sql;exit;

        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {

            $delSql = "DELETE FROM warehouse_allocation	
                        WHERE order_id = ".$attr['id']." AND type=1";

            //echo $Sql;exit;
            $delRS = $this->objsetup->CSI($delSql, 'purchase_order', sr_EditPermission);

            $updateSeqSql = "UPDATE  ref_module_category_value 
                                            SET 
                                                last_sequence_num = last_sequence_num-1
                             WHERE module_code_id =18 AND 
                                   company_id='" . $this->arrUser['company_id'] . "' AND 
                                   last_sequence_num>0";

            //echo $updateSeqSql;exit;
            $updateSeqRS = $this->objsetup->CSI($updateSeqSql, 'purchase_order', sr_EditPermission);          

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
            $srLogTrace['input_text'] = $Sql;

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

    function deletePurchaseOrderitems($attr)
    {
        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['ErrorMessage'] = "";

        $this->objsetup->SRTraceLogsPHP($srLogTrace);

        if($attr['item_type'] == 0){
            
            $checkAlreadyReceived = "SELECT purchaseStatus
                                    FROM srm_invoice 
                                    WHERE id= " . $attr['orderid']. " AND 
                                        company_id = '" . $this->arrUser['company_id'] . "'
                                    LIMIT 1";        
            $RsAlreadyReceived = $this->objsetup->CSI($checkAlreadyReceived);
            
            if($RsAlreadyReceived->fields['purchaseStatus'] == 2)
            {
                $response['ack'] = 2;
                $response['error'] = ' Already Received';

                $srLogTrace = array();

                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'Exit';
                $srLogTrace['ErrorMessage'] = 'Already Received!';

                $this->objsetup->SRTraceLogsPHP($srLogTrace);
                return $response;
            }

            if($RsAlreadyReceived->fields['purchaseStatus'] == 3)
            {
                $response['ack'] = 2;
                $response['error'] = ' Already Invoiced';

                $srLogTrace = array();

                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'Exit';
                $srLogTrace['ErrorMessage'] = 'Already Invoiced';

                $this->objsetup->SRTraceLogsPHP($srLogTrace);
                return $response;
            }
        }

        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
        //echo "<pre>";	print_r($attr);exit;
        $this->objGeneral->mysql_clean($attr);

        $item_type = $attr['item_type'];

        $Sql = "DELETE FROM ".$attr['table']." WHERE id = ".$attr['id']." ";

        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, 'purchase_order', sr_EditPermission);

        if ($this->Conn->Affected_Rows() > 0) {            

            if($item_type==2){
                $stkSql2 = " DELETE FROM gl_account_additional_cost_txn 
                             WHERE company_id='" . $this->arrUser['company_id'] . "' AND 
                                   invoice_id =".$attr['orderid']." and 
                                   orderLineID = ".$attr['id']." ";

                // echo $stkSql2."<hr>"; exit;
                $this->objsetup->CSI($stkSql2, 'purchase_order', sr_EditPermission);
            }

            if($item_type == 0){

                $Sql1 = " DELETE FROM item_in_cost_entries 
                             WHERE company_id='" . $this->arrUser['company_id'] . "' AND 
                                   invoice_id =".$attr['orderid']." and 
                                   order_detail_id = ".$attr['id']." ";

                // echo $Sql1."<hr>"; exit;
                $this->objsetup->CSI($Sql1);

                $Sql2 = " DELETE FROM purchaseordertxn 
                             WHERE company_id='" . $this->arrUser['company_id'] . "' AND 
                                   invoice_id =".$attr['orderid']." and 
                                   ObjectDetailID = ".$attr['id']." ";

                // echo $Sql2."<hr>"; exit;
                $this->objsetup->CSI($Sql2);
            }

            $stkSql = " DELETE FROM warehouse_allocation
                        WHERE order_id = ".$attr['orderid']." AND
                              purchase_order_detail_id = ".$attr['id']." AND
                              company_id='" . $this->arrUser['company_id'] . "' AND
                              type=1";
            
            //   product_id = $attr[productid] AND
            //   warehouse_id = $attr[warehouse_id] AND  

            // echo $stkSql."<hr>"; exit;
            $this->objsetup->CSI($stkSql, 'purchase_order', sr_EditPermission);

            $volume = 0;
            $volume_unit = '';
            $weight = 0;
            $weightunit = '';
            $weight_permission = 0;  
            $volume_permission = 0;    

            $Sql4 = "SELECT  SUM(uomsetup.volume * inv.qty) AS volume,
                        'cm3' AS volume_unit,
                        SUM((CASE WHEN uomsetup.weightunit = 1 THEN (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2)) / 1000
                            ELSE (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2))
                            END)* inv.qty) AS weight,
                        'kg' AS weightunit,weight_permission,volume_permission
                    FROM srm_invoice_detail AS inv
                    LEFT JOIN units_of_measure_setup AS uomsetup ON inv.unit_measure_id = uomsetup.id
                    LEFT JOIN items_weight_setup AS w ON w.title = 'Purchase Order' AND inv.company_id = w.company_id
                    WHERE inv.invoice_id='".$attr['id']."' AND inv.type=0";
            //echo $Sql4."<hr>"; exit;

            $rs4 = $this->objsetup->CSI($Sql4);

            if ($rs4->RecordCount() > 0){
                $volume = $rs4->fields['volume'];
                $volume_unit = $rs4->fields['volume_unit'];
                $weight = $rs4->fields['weight'];
                $weightunit = $rs4->fields['weightunit'];
                $weight_permission = $rs4->fields['weight_permission'];
                $volume_permission = $rs4->fields['volume_permission'];
            }

            $response['volume'] = $volume;
            $response['volume_unit'] = $volume_unit;
            $response['weight'] = $weight;
            $response['weightunit'] = $weightunit;
            $response['weight_permission'] = $weight_permission;
            $response['volume_permission'] = $volume_permission; 
            
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
            $srLogTrace['input_text'] = $stkSql;

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        } else {
            $response['ack'] = 0;
            $response['error'] = "Record cannot be deleted";

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

    function deleteDebitNoteItems($attr)
    {
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
        //echo "<pre>";	print_r($attr);exit;
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM $attr[table] WHERE id = ".$attr['id']." ";
        $RS = $this->objsetup->CSI($Sql, 'purchase_return', sr_EditPermission);


        if($attr['table'] == 'srm_order_return_detail'){

            $volume = 0;
            $volume_unit = '';
            $weight = 0;
            $weightunit = '';
            $weight_permission = 0;  
            $volume_permission = 0;  

            $Sql4 = "SELECT  SUM(uomsetup.volume * inv.qty) AS volume,
                        'cm3' AS volume_unit,
                        SUM((CASE WHEN uomsetup.weightunit = 1 THEN (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2)) / 1000
                            ELSE (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2))
                            END)* inv.qty) AS weight,
                        'kg' AS weightunit,weight_permission,volume_permission
                    FROM srm_order_return_detail AS inv
                    LEFT JOIN units_of_measure_setup AS uomsetup ON inv.unit_measure_id = uomsetup.id AND inv.type=0
                    LEFT JOIN items_weight_setup AS w ON w.title = 'Debit Note' AND inv.company_id = w.company_id
                    WHERE inv.invoice_id='".$attr['id']."' ";
            //echo $Sql4."<hr>"; exit;

            $rs4 = $this->objsetup->CSI($Sql4);

            if ($rs4->RecordCount() > 0){
                $volume = $rs4->fields['volume'];
                $volume_unit = $rs4->fields['volume_unit'];
                $weight = $rs4->fields['weight'];
                $weightunit = $rs4->fields['weightunit'];
                $weight_permission = $rs4->fields['weight_permission'];
                $volume_permission = $rs4->fields['volume_permission'];
            }

            $response['volume'] = $volume;
            $response['volume_unit'] = $volume_unit;
            $response['weight'] = $weight;
            $response['weightunit'] = $weightunit;
            $response['weight_permission'] = $weight_permission;
            $response['volume_permission'] = $volume_permission;
        } 

        // $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            
            $stkSql = " DELETE FROM warehouse_allocation
                        WHERE order_id = ".$attr['invoice_id']." AND
                              purchase_order_detail_id = ".$attr['id']." AND
                              product_id = ".$attr['productid']." AND
                              purchase_return_status=1 AND 
                              type=1";

            //echo $stkSql."<hr>"; exit;
            $RS = $this->objsetup->CSI($stkSql, 'purchase_return', sr_EditPermission);

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
            $srLogTrace['input_text'] = $stkSql;

            $this->objsetup->SRTraceLogsPHP($srLogTrace);

        } else {
            $response['ack'] = 0;
            $response['error'] = "Record cannot be deleted";

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

    function deleteDebitNoteBeforeSave($attr)
    {
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

        $Sql = "DELETE FROM srm_order_return	
                WHERE id = ".$attr['id']." 
                Limit 1 ";

        //echo $Sql;exit;

        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {

            $delSql = "DELETE FROM warehouse_allocation	
                        WHERE order_id = ".$attr['id']." AND purchase_return_status=1 AND type=1";

            //echo $Sql;exit;
            $delRS = $this->objsetup->CSI($delSql);//, 'purchase_return', sr_DeletePermission

            $updateSeqSql = "UPDATE  ref_module_category_value 
                                            SET 
                                                last_sequence_num = last_sequence_num-1
                             WHERE module_code_id =20 AND 
                                   company_id='" . $this->arrUser['company_id'] . "' AND 
                                   last_sequence_num>0";

            //echo $updateSeqSql;exit;
            $updateSeqRS = $this->objsetup->CSI($updateSeqSql);//, 'purchase_return', sr_DeletePermission

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
            $srLogTrace['input_text'] = $updateSeqSql;

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
            $response['error'] = 'Record cannot be deleted.';
        }
        return $response;
    }

    function get_data_by_id($table_name, $id)
    {
        $Sql = "SELECT *
				FROM ".$table_name."
				WHERE id=".$id."
				LIMIT 1";

        $RS = $this->objsetup->CSI($Sql);
        
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();

            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
                if ($table_name == 'srm_area_selected') {
                    $Row['price'] = number_format((float)$Row['price'], 2, '.', '');
                }
            }
            
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'] = $Row;
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
            $response['response'] = array();
        }
        return $response;
    }

    function get_srm_classifications($attr)
    {
        $order_type = "";
        $response = array();
        $strWhere = "";

        if (isset($attr['main_type']))
            $strWhere .= " and c.type =" . $attr["main_type"];

        $Sql = "SELECT rf.id, rf.name as title,c.ref_value 
                FROM srm_classification c  
                INNER JOIN ref_classification  rf ON rf.id=c.ref_type  
                WHERE c.ref_value=1 AND c.company_id='" . $this->arrUser['company_id'] . "'  and 
                      c.type = 3 ";
        //echo $Sql;exit;

        $order_type = "order by rf.sorting ASC";
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

            $attr['page'] = 0;
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);

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

    function get_srm_by_id($attr)
    {
        // IFNULL(SR_CalculateSupplierBalance($attr['id'], " . $this->arrUser['company_id'] . "), 0) AS supplier_balance
        // $Sql = "SELECT * FROM srm WHERE id='".$attr['id']."' LIMIT 1";
        /* 
                         
        IFNULL(SR_rep_aged_supp_sum(s.id,DATE_SUB('$upToDate', INTERVAL 14600 DAY),DATE_ADD('$upToDate', INTERVAL 14600 DAY),s.company_id,'sr_rep',2,'',DATE_ADD('$upToDate', INTERVAL 14600 DAY)), 0)*(-1) AS supplier_balance */

        $upToDate = date("Y-m-d");  
        $moduleCodeType = 1;

        $balanceInSupplierCurrency = '';

        if(isset($attr['defaultCurrency']) && $attr['defaultCurrency'] > 0){

            $balanceInSupplierCurrency = ",
                         (CASE WHEN (s.type <> 1 AND s.currency_id <> ".$attr['defaultCurrency'].") THEN sr_getSupplierBalanceInActualCurrency('".$upToDate."',s.company_id,s.id)
                               ELSE 0
                               END) AS balanceInSupplierCurrency";
        }
        
        if ($attr['type'] == "Supplier"){
            $bucketType = 24;
            $gneraltab = 'supplier_gneraltab';

            $Sqla = "SELECT type
                    FROM ref_module_category_value
                    WHERE  module_code_id = 17 AND status = 1 AND company_id=" . $this->arrUser['company_id'] . "
                    LIMIT 1";
            // echo  $Sqla;exit;

            $rs4 = $this->objsetup->CSI($Sqla);

            if ($rs4->RecordCount() > 0){
                $moduleCodeType = $rs4->fields['type'];
            }
        }
        else{
            $bucketType = 18;
            $gneraltab = 'srm_gneraltab';

            $Sqla ="SELECT type
                    FROM ref_module_category_value
                    WHERE  module_code_id = 16 AND status = 1 AND company_id=" . $this->arrUser['company_id'] . "
                    LIMIT 1";
            // echo  $Sqla;exit;

            $rs4 = $this->objsetup->CSI($Sqla);

            if ($rs4->RecordCount() > 0){
                $moduleCodeType = $rs4->fields['type'];
            }
        }

        $Sql = "SELECT  s.*,
                        CONCAT(`purch`.`first_name`,' ',`purch`.`last_name`) AS `purchaser_code`,
                        purch.id, 
                        (SELECT invoice_dateUnConv 
                         FROM srm_invoice 
                         WHERE sell_to_cust_id=".$attr['id']." AND company_id=" .$this->arrUser['company_id'] . "
                         ORDER BY id DESC LIMIT 1) as lastPODate,
                         (CASE WHEN (s.type = 1) THEN '0'
                                ELSE sr_getSupplierBalance('".$upToDate."',s.company_id,s.id)
                                END) AS supplier_balance ".$balanceInSupplierCurrency."
                FROM  sr_srm_general_sel  s 
                LEFT JOIN `employees` `purch` ON (`purch`.`id` = `s`.salesperson_id)
                WHERE s.id=".$attr['id']." AND s.company_id=" .$this->arrUser['company_id'] . " ";

        $subQueryForBuckets = " SELECT  c.id
                                from sr_srm_general_sel  c
                                where  c.id IS NOT NULL ";
        //$subQueryForBuckets = $this->objsetup->whereClauseAppender($subQueryForBuckets, $bucketType);
        //echo $subQueryForBuckets;exit;

        // $Sql .= " AND s.id IN ($subQueryForBuckets) ";

        $Sql .= " LIMIT 1 ";
        // echo $Sql;exit;

        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, $gneraltab, sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $Row['AddedOn'] = $this->objGeneral->convert_unix_into_date($Row['AddedOn']);
            $Row['ChangedOn'] = $this->objGeneral->convert_unix_into_date($Row['ChangedOn']);
            $Row['status_date'] = $this->objGeneral->convert_unix_into_date($Row['status_date']);

            if($Row['lastPODate'] != 0 && $Row['lastPODate'] != '')
              $Row['lastPODate'] = date("d/m/Y", strtotime($Row['lastPODate']));

            // if($Row['supplier_balance'] == '333333333' || $Row['supplier_balance'] == '-333333333') 
            //     $Row['supplier_balance'] = 0;

            $Row['id'] = $attr['id'];
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else{
            $response['response'] = array();
            $response['bucketFail'] = 1;
        }

        $response = $this->load_srm_nested_data($attr, $response);
        $response['moduleCodeType'] = $moduleCodeType;
        return $response;
    }

    function delete_srm($attr)
    {
        $arr_attr = array();
        $arr_attr = (array)$attr;
        $this->objGeneral->mysql_clean($arr_attr);

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


        $function = "SELECT SR_CheckTransactionBeforeDelete(".$arr_attr['id'].", ".$this->arrUser['company_id'].", 16,3)";
        $RS = $this->objsetup->CSI($function, "srm_gneraltab", sr_DeletePermission);
        $function1 = "SELECT SR_CheckTransactionBeforeDelete(".$arr_attr['id'].", ".$this->arrUser['company_id'].", 17,7)";
        $RS1 = $this->objsetup->CSI($function1, "srm_gneraltab", sr_DeletePermission);
        $function2 = "SELECT SR_CheckTransactionBeforeDelete(".$arr_attr['id'].", ".$this->arrUser['company_id'].", 18,2)";
        $RS2 = $this->objsetup->CSI($function2, "srm_gneraltab", sr_DeletePermission);

        if($RS->fields[0] == 'success' && $RS1->fields[0] == 'success' && $RS2->fields[0] == 'success'){

            $Sql = "UPDATE srm SET status=".DELETED_STATUS." WHERE id = ".$arr_attr['id'].";";

        } elseif ($RS->fields[0] != 'success') {
            $response['ack'] = 0;
            $response['error'] = 'A Note already exists against this record.';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'A Note already exists against this record..';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);

            return $response;
        } elseif ($RS1->fields[0] != 'success') {
            $response['ack'] = 0;
            $response['error'] = 'A Document already exists against this record.';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'A Document already exists against this record.';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);

            return $response;
        } elseif ($RS2->fields[0] != 'success') {
            $response['ack'] = 0;
            $response['error'] = 'A Email already exists against this record.';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'A Email already exists against this record.';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            return $response;
        }

        $Sql = "UPDATE srm SET status=".DELETED_STATUS." 
                WHERE id = ".$arr_attr['id']."  AND SR_CheckTransactionBeforeDelete(".$arr_attr['id'].", ".$this->arrUser['company_id'].", 2,0) = 'success'";

        // echo $Sql; exit;
        $RS3 = $this->objsetup->CSI($Sql, "srm_gneraltab", sr_DeletePermission);

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

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        } else {
            $response['ack'] = 0;
            $response['error'] ='Record cannot be deleted.';
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

    function add_contact_location_dropdown_general($arr_attr)
    {
        // print_r($arr_attr);exit;
        if ($arr_attr['alt_contact_id'] > 0 && $arr_attr['alt_location_id'] > 0 && $arr_attr['acc_id'] > 0) 
        {
            $Sqle = "INSERT INTO alt_depot_contact
                             set location_id= '" . $arr_attr['alt_location_id'] . "',
                                  acc_id='" . $arr_attr['acc_id'] . "',
                                   module_type='" . $arr_attr['module_type'] . "',
                                  contact_id='" . $arr_attr['alt_contact_id'] . "',
                                  company_id='" . $this->arrUser['company_id'] . "',
                                  user_id='" . $this->arrUser['id'] . "',
                                  date_created ='" . current_date . "'";
            //echo $Sqle; exit;
            
            $RS = $this->objsetup->CSI($Sqle);
            $id3 = $this->Conn->Insert_ID();

            if ($id3 > 0)
                $arr_attr['contact_location'] = true;
        } else {
            $arr_attr['contact_location'] = false;
        }
        return $arr_attr;
    }
    
    function load_srm_nested_data($attr, $response)
    {
        $attr['srm_id'] = $attr['id'];
        $attr['value'] = $attr['id'];
        $attr['is_primary'] = 1;
        $attr['primaryc_id'] = $response["response"]['primaryc_id'];

        $attr['tbl'] = base64_encode('srm_status');
        $attr['type'] = 'SOURCES_OF_CRM';

        // $result1 = $this->get_pref_method_of_comm($attr);
        // $response['response']['arr_pref_method_comm'] = $result1['response'];

        $result2 = $this->get_method($attr);
        $response['response']['price_method_list'] = $result2['response'];        

        // require_once(SERVER_PATH . "/classes/Setup.php");
        // $objsetup = new Setup($this->arrUser);
        // $result3 = $objsetup->get_predefine_by_type($attr);
        // $response['response']['arr_sources_of_srm'] = $result3['response'];

        // $result4 = $objsetup->get_all_status($attr, 1);
        // $response['response']['arr_srm_status'] = $result4['response'];
        
        $result3 = $this->objsetup->get_predefine_by_type($attr);
        $response['response']['arr_sources_of_srm'] = $result3['response'];

        $result4 = $this->objsetup->get_all_status($attr, 1);
        $response['response']['arr_srm_status'] = $result4['response'];
        
        if($attr['primaryc_id']>0)
        {
            $result5 = $this->getPrimaryContactLocAssigntotal($attr);
            $response['response']['totalLocAssigned'] = $result5['showdata'];
            } 

        // print_r($response['response']['arr_crm_status']);exit;
        return $response;        
    }

    function get_srm_invoice_by_id($id)
    {
        $Sql = "SELECT * FROM (SELECT *,(SELECT is_whole_seller 
                                         FROM financial_settings 
                                         WHERE company_id = " . $this->arrUser['company_id'] . " 
                                         LIMIT 1) AS is_whole_seller,
                                         IFNULL((CASE WHEN (SELECT STATUS FROM approval_setup WHERE company_id=" . $this->arrUser['company_id'] . " AND TYPE=4) = 1 THEN
                                        (SELECT IFNULL(status, 0) AS status FROM approval_history WHERE object_id=".$id." AND company_id=" . $this->arrUser['company_id'] . " AND TYPE=4 ORDER BY id DESC LIMIT 1)
                                            WHEN (SELECT STATUS FROM approval_setup WHERE company_id=" . $this->arrUser['company_id'] . " AND TYPE=7) = 1 THEN
                                                2
                                            ELSE
                                                0
                                        END), 0) AS approval_type_1,
                                        IFNULL((CASE WHEN (SELECT STATUS FROM approval_setup WHERE company_id=" . $this->arrUser['company_id'] . " AND TYPE=7) = 1 THEN
                                                (SELECT IFNULL(status, 0) AS status FROM approval_history WHERE object_id=".$id." AND company_id=" . $this->arrUser['company_id'] . " AND TYPE=7 ORDER BY id DESC LIMIT 1)
                                            WHEN (SELECT STATUS FROM approval_setup WHERE company_id=" . $this->arrUser['company_id'] . " AND TYPE=4) = 1 THEN
                                                2
                                            ELSE
                                                0
                                        END), 0) AS approval_type_2

                                FROM srm_invoice s 
                                WHERE id='".$id."' AND 
                                      company_id = " . $this->arrUser['company_id'] . ") AS tbl 
                WHERE 1 ";

        /* $subQueryForBuckets = " SELECT  s.id
                                from sr_srm_general_sel  s
                                where  s.id IS NOT NULL "; */
        
        $subQueryForBuckets = " SELECT s.id 
                                FROM srm as s
                                WHERE s.type IN (2,3) AND 
                                      s.company_id=" . $this->arrUser['company_id'] . " ";

        //$subQueryForBuckets = $this->objsetup->whereClauseAppender($subQueryForBuckets, 24);
        //echo $subQueryForBuckets;exit;

        // $Sql .= " AND (tbl.sell_to_cust_id IN ($subQueryForBuckets) OR tbl.sell_to_cust_id =0 OR tbl.sell_to_cust_id IS NULL) ";
        $Sql .= " LIMIT 1 ";
        // echo $Sql;exit;

        // $RS = $this->objsetup->CSI($Sql);

        $RS = $this->objsetup->CSI($Sql, 'purchase_order', sr_ViewPermission);

        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            /* $SqlFileExistance = "SELECT name FROM attachments WHERE type = 3 AND typeId = $id AND company_id = " . $this->arrUser['company_id'] . "; ";
            //echo $SqlFileExistance;exit;
            $ResultFileExistance = $this->objsetup->CSI($SqlFileExistance, 'purchase_order', sr_ViewPermission);

            $FileName = $ResultFileExistance->FetchRow()['name'];
            if ($FileName && (file_exists(TEMPLATES_PATH. '/views/invoice_templates_pdf/'.$FileName))){
                $Row['generatedPDFPath'] = WEB_PATH. '/app/views/invoice_templates_pdf/'.$FileName;
            }
            else{
                $Row['generatedPDFPath'] = '';
            } */
            $supplier_id = $Row['sell_to_cust_id'];
            $Row['delivery_date'] = $this->objGeneral->convert_unix_into_date($Row['delivery_date']);
            $Row['invoice_date'] = $this->objGeneral->convert_unix_into_date($Row['invoice_date']);
            $Row['order_date'] = $this->objGeneral->convert_unix_into_date($Row['order_date']);
            $Row['posting_date'] = $this->objGeneral->convert_unix_into_date($Row['posting_date']);
            $Row['recpt_date'] = $this->objGeneral->convert_unix_into_date($Row['recpt_date']);
            $Row['requested_delivery_date'] = $this->objGeneral->convert_unix_into_date($Row['requested_delivery_date']);
            $Row['receiptDate'] = $this->objGeneral->convert_unix_into_date($Row['receiptDate']);
            $Row['shipment_date'] = $this->objGeneral->convert_unix_into_date($Row['shipment_date']);
            $Row['sup_date'] = $this->objGeneral->convert_unix_into_date($Row['sup_date']);
            $Row['due_date'] = $this->objGeneral->convert_unix_into_date($Row['due_date']);
            
            // $Row['SaleOrders'] = $this->selectLink_SO_PO($id, 1);// 2nd parameter is for type purchase/sale. 1 for purchase,2 for sale.
            // $Row['SaleOrderslisting'] = $this->getSalesOrderListings();
            $Row['selSaleOrderslisting'] = $this->getselLink_SO_PO($id, 1);

            if(!($supplier_id>0)){
                $Row['bill_to_posting_group_id'] = $this->defaultPostingGrp();                
            }

            $temp_attr['posting_group_id'] = $Row['bill_to_posting_group_id'];
            $posting_group_arr = $this->objHr->get_vat_group_by_posting_group($temp_attr);
            $response['arrVATPostGrpPurchase'] = ($posting_group_arr['ack'] == 1) ? $posting_group_arr['response'] : array();

            // $currencyID = $Row['currency_id'];
            // $temp_attr_currency['currency_id'] = $currencyID;
            $currency_arr_local = $this->objsetup->get_currencies_list($temp_attr_currency);
            $response['currency_arr_local']= $currency_arr_local['response'];

            $response['response'] = $Row;
            
            if($supplier_id>0){
                $response['response']['e_emails'] = self::get_e_emails($supplier_id);
                $response['response']['supplier_emails'] = self::get_supplier_emails($supplier_id);
            }

        } else{
            $response['response'] = array();
            $response['bucketFail'] = 1;
        }

        //print_r($response);exit;
        return $response;
    }

    function get_supplier_all_emails($supplier_id){
        $response = array();
        if($supplier_id>0){
            $response['response']['e_emails'] = self::get_e_emails($supplier_id);
            $response['response']['supplier_emails'] = self::get_supplier_emails($supplier_id);
            $response['ack'] = 1;
            $response['error'] = NULL;
        }else{
            $response['ack'] = 0;
            $response['response'] = array();
        }

        return $response;
    }

    function defaultPostingGrp(){
        $Sql = "SELECT id 
                FROM ref_posting_group 
                WHERE company_id = " . $this->arrUser['company_id'] . " AND 
                      ref_id = 1";

        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->fields['id'] > 0) 
            $postingGrpID = $RS->fields['id'];
        else
            $postingGrpID = 0;
            
        return $postingGrpID;
    }

    function get_e_emails($attr){
        
        $EmailSql = "SELECT fin.purchaseOrderEmail, fin.debitNoteEmail, fin.remittanceAdviceEmail 
                     FROM srm c 
                     LEFT JOIN srm_finance fin ON c.id = fin.supplier_id 
                     WHERE c.id = $attr";
        // echo $EmailSql;exit;
        $RSEmails = $this->objsetup->CSI($EmailSql);
        if ($RSEmails->RecordCount() > 0) {
            $Row = $RSEmails->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $Emails = $Row;
        }
        if ($Emails){
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'] = $Emails;
            $response['id'] = $attr; //$attr['supplier_id'];
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function get_supplier_emails($attr){      
        $EmailSql = "SELECT c.email, 
                        GROUP_CONCAT(ac.email SEPARATOR ',') as alt_contact, 
                        GROUP_CONCAT(ad.email SEPARATOR ',') as alt_depot, 
                        GROUP_CONCAT(ad.booking_email SEPARATOR ',') as alt_depot_booking, 
                        fin.email as finance_email, 
                        fin.alt_contact_email, 
                        fin.purchaseOrderEmail, 
                        fin.debitNoteEmail, 
                        fin.remittanceAdviceEmail 
                    FROM (((srm c LEFT JOIN alt_contact ac ON c.id = ac.acc_id AND ac.module_type = 2) 
                        LEFT JOIN alt_depot ad ON c.id = ad.acc_id AND ad.module_type = 2) 
                        LEFT JOIN srm_finance fin ON c.id = fin.supplier_id) 
                    WHERE c.id = ".$attr." ";

        $RSEmails = $this->objsetup->CSI($EmailSql);

        if ($RSEmails->RecordCount() > 0) {
            $Row = $RSEmails->FetchRow();
            $Emails = $Row['email'] .",".$Row['alt_contact'].",".$Row['alt_depot'].",".$Row['alt_depot_booking'].",".$Row['finance_email'].",".$Row['alt_contact_email'].",".$Row['purchaseOrderEmail'].",".$Row['debitNoteEmail'].",".$Row['remittanceAdviceEmail'];
            $Emails = str_replace(";",",",$Emails);
        }

        $Emails = array_values(array_unique(array_filter(explode(",",$Emails))));
        if ($Emails){
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['Emails'] = $Emails;
            $response['id'] = $attr;//$attr['customer_id'];
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }
    
    function selectLink_SO_PO($id,$type)
    {
        $response = array();
        // type 1 is for Purchase Order

        if ($type == 1) {
            $sqld = "Select sp.* FROM link_so_po sp
                     where  sp.purchaseOrderID='".$id."'  and 
                            sp.company_id='" . $this->arrUser['company_id'] . "'";
        }
        else if ($type == 2) {
            $sqld = "Select sp.* FROM link_so_po sp
                     where  sp.saleOrderID='".$id."'  and 
                            sp.company_id='" . $this->arrUser['company_id'] . "'";
        }
        
        // echo $sqld;exit;
        $RS = $this->objsetup->CSI($sqld);

        if ($RS->RecordCount() > 0) {
            //$Row = $RS->FetchRow();
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response[] = $Row;
            }
        } else
            $response = array();

        return $response;        
    }

    function selectLink_SO_PO2($id,$type)
    {
        $response = array();
        
        if ($type == 1) { // type 1 is for get all linked Sale Order codes

            $sqld = "SELECT s.sale_order_code AS code 
					 FROM link_so_po sp
					 LEFT JOIN orders as s on s.id = sp.saleOrderID 
                     WHERE  sp.purchaseOrderID='".$id."'  AND 
                            sp.company_id='" . $this->arrUser['company_id'] . "' AND
							s.company_id='" . $this->arrUser['company_id'] . "'";
        }
        else if ($type == 2) { // type 2 is for get all linked Purchase Order codes

            $sqld = "SELECT s.order_code AS code 
					 FROM link_so_po sp
					 LEFT JOIN srm_invoice as s on s.id = sp.purchaseOrderID 
                     WHERE  sp.saleOrderID='".$id."'  AND 
                            sp.company_id='" . $this->arrUser['company_id'] . "' AND
							s.company_id='" . $this->arrUser['company_id'] . "'";
        }
		
        // echo $sqld;exit;
        $RS = $this->objsetup->CSI($sqld);

        if ($RS->RecordCount() > 0) {

            $codesArray = '';

            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $codesArray .= $Row['code'].', ';				
            }
			
			$codesArray = substr($codesArray, 0, -2);
        } else
            $codesArray = '';

        return $codesArray;
        
    }

    function get_srm_order_return_by_id($attr)
    {
        // print_r($attr);exit;
        $id = $attr['id'];
        $Sql = "SELECT * FROM (SELECT * FROM srm_order_return s	WHERE id='$id' ) AS tbl WHERE 1 ";

        /* $subQueryForBuckets = "SELECT  s.id
            from sr_srm_general_sel  s
            where  s.id IS NOT NULL "; */
        
        $subQueryForBuckets = " SELECT s.id 
                                FROM srm as s
                                WHERE s.type IN (2,3) AND 
                                      s.company_id=" . $this->arrUser['company_id'] . " ";

        //$subQueryForBuckets = $this->objsetup->whereClauseAppender($subQueryForBuckets, 24);
        //echo $subQueryForBuckets;exit;

        // $Sql .= " AND (tbl.supplierID IN ($subQueryForBuckets) OR tbl.supplierID =0 OR tbl.supplierID IS NULL )";

        $Sql .= " LIMIT 1 ";
        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, $attr['moduleNameForRoles'], sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            /* $SqlFileExistance = "SELECT name FROM attachments WHERE type = 4 AND typeId = $id AND company_id = " . $this->arrUser['company_id'] . "; ";
            //echo $SqlFileExistance;
            $ResultFileExistance = $this->objsetup->CSI($SqlFileExistance);
            $FileName = $ResultFileExistance->FetchRow()['name'];
            if ($FileName && (file_exists(TEMPLATES_PATH. '/views/invoice_templates_pdf/'.$FileName))){
                $Row['generatedPDFPath'] = WEB_PATH. '/app/views/invoice_templates_pdf/'.$FileName;
            }
            else{
                $Row['generatedPDFPath'] = '';
            } */

            $Row['dispatchDate'] = $this->objGeneral->convert_unix_into_date($Row['dispatchDate']);
            $Row['supplierCreditNoteDate'] = $this->objGeneral->convert_unix_into_date($Row['supplierCreditNoteDate']);
            $Row['supplierReceiptDate'] = $this->objGeneral->convert_unix_into_date($Row['supplierReceiptDate']);
            $Row['shipment_date'] = $this->objGeneral->convert_unix_into_date($Row['shipment_date']);
            $Row['deliveryDate'] = $this->objGeneral->convert_unix_into_date($Row['deliveryDate']);

            $response['response'] = $Row;
            $response['response']['e_emails'] = self::get_e_emails($response['response']['billToSupplierID']);
            $response['response']['supplier_emails'] = self::get_supplier_emails($response['response']['billToSupplierID']);

            $temp_attr['posting_group_id'] = $Row['bill_to_posting_group_id'];
            $posting_group_arr = $this->objHr->get_vat_group_by_posting_group($temp_attr);
            $response['arrVATPostGrpPurchase'] = ($posting_group_arr['ack'] == 1) ? $posting_group_arr['response'] : array();


            // $currencyID = $Row['currency_id'];
            // $temp_attr_currency['currency_id'] = $currencyID;
            $currency_arr_local = $this->objsetup->get_currencies_list($temp_attr_currency);
            $response['currency_arr_local']= $currency_arr_local['response'];

        } else{
            $response['response'] = array();
            $response['bucketFail'] = 1;

        }

        $response['ack'] = 1;
        $response['error'] = NULL;
        return $response;
    }

    //------------General Tab--------------------------

    function get_srm_listings($attr)
    {
        //$this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $defaultFilter = false;

        if (!empty($attr['searchKeyword'])) {
            $where_clause = $this->objGeneral->flexiWhereRetriever("s.",$attr,$fieldsMeta);
            $order_clause = $this->objGeneral->flexiOrderRetriever("s.",$attr,$fieldsMeta);
        }
        if (empty($where_clause)){
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("SRM",$this->arrUser);
        }
        

        $response = array();

        // $Sql = "SELECT  s.*,CONCAT(e.first_name,' ',e.last_name) as Purchaser,COALESCE((SELECT company_reg_no FROM srm_finance WHERE supplier_id = s.id LIMIT 1),'') AS company_reg_no FROM sr_srm_general_sel as s left join employees e ON e.id = s.salesperson_id WHERE s.type IN (1) AND s.srm_code IS NOT NULL AND s.name !='' AND (s.company_id=" . $this->arrUser['company_id'] . " )" . $where_clause . "";//,2

        $Sql = "SELECT * from (SELECT  s.*,CONCAT(`purch`.`first_name`,' ',`purch`.`last_name`) AS `Purchaser`, 
                        COALESCE((SELECT company_reg_no FROM srm_finance WHERE supplier_id = s.id LIMIT 1),'') AS company_reg_no
                FROM sr_srm_general_sel as s
                LEFT JOIN `employees` `purch` ON (`purch`.`id` = `s`.salesperson_id) 
                WHERE   s.type IN (1) AND 
                        s.srm_code IS NOT NULL AND  
                        s.name <>'' AND 
                        (s.company_id=" . $this->arrUser['company_id'] . " )) as s where 1" . $where_clause . "";
        //$Sql = $this->objsetup->whereClauseAppender($Sql,18);
        // echo $Sql;exit;
        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if (!empty($attr['sort_column'])) 
        {
            $column = 's.' . $attr['sort_column'];

            if ($attr['sort_column'] == 'code')
                $column = 's.' . 'srm_code';
            else if ($attr['sort_column'] == 'person')
                $column = 's.' . 'contact_person';
            else if ($attr['sort_column'] == "segment")
                $column = 'seg.' . 'title';
            else if ($attr['sort_column'] == "country_name")
                $column = 'cu.' . 'name';
            //calculated value can be order by id
            else if ($attr['sort_column'] == 'status')
                $column = 's.statusp';//'s.id';

            $order_type = "Order BY " . $column . " $attr[sortform]";
        }

        $column = "s.id";

        if ($order_clause == "")
            $order_type = "Order BY " . $column . " DESC";
        else
            $order_type = $order_clause;
        
        $response = $this->objGeneral->preListing($attr, $Sql, $response, $total_limit, 's', $order_type);
        //echo $response['q'];exit;
        // $RS = $this->objsetup->CSI($response['q']);
        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData('SRM');
        $response['response']['tbl_meta_data']['defaultFilter'] = $defaultFilter;

        // $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 's',$order_type);
        // echo $response['q'];exit;
        // $RS = $this->objsetup->CSI($response['q']);
        $RS = $this->objsetup->CSI($response['q'], "srm", sr_ViewPermission);
        // $response['q'] = '';

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                $result = array();
                $result['id'] = $Row['id'];
                $result['srm_code'] = $Row['srm_code'];
                $result['name'] = $Row['name'];

                /* $result['address_1'] = $Row['address_1'];
                $result['address_2'] = $Row['address_2'];
                $result['county'] = $Row['county'];*/

                $result['address_1'] = $Row['primary_address_1'];
                $result['address_2'] = $Row['primary_address_2'];
                $result['county'] = $Row['primary_county'];
                $result['web_address'] = $Row['web_address'];
                $result['email'] = $Row['email']; 

                $result['primaryc_email'] = $Row['primaryc_email'];
                // $result['country_name'] = $Row['country_name']; 
                $result['country_name'] = $Row['primary_country_name']; 
                $result['srm_classification_name'] = $Row['srm_classification_name']; 
                $result['company_reg_no'] = $Row['company_reg_no'];

                $result['primaryc_name'] = $Row['primaryc_name'];
                $result['primary_city'] = $Row['primary_city'];
                $result['primary_postcode'] = $Row['primary_postcode'];
                $result['phone'] = $Row['phone'];
                $result['type'] = $Row['type'];
                $result['Purchaser'] = $Row['Purchaser'];
                $result['region'] = ucwords($Row['region']);
                $result['segment'] = ucwords($Row['segment']);
                $result['selling_group'] = ucwords($Row['selling_group']);
                $result['statusp'] = $Row['statusp'];
                $result['currency'] = $Row['currency'];

                $response['total'] = $Row['totalRecordCount'];  
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else{
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'][] = array();
        }

        // $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData('SRM');
        // $response['response']['tbl_meta_data']['defaultFilter'] = $defaultFilter;
        $response = $this->objGeneral->postListing($attr, $response);
        return $response;
    }

    function duplicationChkSRM($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $response = array();
        $response['ack'] = 0;
        $response['error'] = '';

        $Sql = "SELECT  c1.name,c1.srm_code,c1.supplier_code,c1.web_address,c1.postcode,c1.primaryc_phone,c1.type,c1.primary_address_1,c1.email
                FROM sr_srm_general_sel c1
                WHERE   c1.company_id = '" . $this->arrUser['company_id'] . "' AND  
                        ((IFNULL(c1.`name`,'#1') = '".$attr['name']."' AND c1.name <> '') OR 
                        (IFNULL(c1.`email`,'#1') = '".$attr['email']."' AND c1.email <> '') OR 
                        (IFNULL(c1.`postcode`,'#1') = '".$attr['postcode']."' AND c1.postcode <> '') OR 
                        (IFNULL(c1.`web_address`,'#1') = '".$attr['web_address']."' AND c1.web_address <> '') OR 
                        (IFNULL(c1.`primary_address_1`,'#1') = '".$attr['address_1']."' AND c1.primary_address_1 <> '') OR 
                        (IFNULL(c1.`primaryc_phone`,'#1') = '".$attr['phone']."' AND c1.primaryc_phone <> '')) AND 	
                        c1.statusp ='Active'
                LIMIT 1";
        // echo  $Sql;exit;

        if($attr['srmModuleType'] == 1)
            $RS = $this->objsetup->CSI($Sql, "srm", sr_AddPermission); 
        else
            $RS = $this->objsetup->CSI($Sql, "supplier", sr_AddPermission); 

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $response['ack'] = 1;

            if($Row['type'] == 1){
                $response['error'] = 'Same record already exist under '.$Row['name'].'('.$Row['srm_code'].'). Are you sure, you want to duplicate?';
            }
            else{
                $response['error'] = 'Same record already exist under '.$Row['name'].'('.$Row['supplier_code'].'). Are you sure, you want to duplicate?';
            }            
        }

        return $response;
    }

    function add_srm($arr_attr)
    {
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

        $response = array();
        //$this->objGeneral->mysql_clean($arr_attr);
        //echo "<pre>"; print_r($arr_attr);//exit;
        $id = $arr_attr['acc_id'];
        $arr_attr['module_type'] = 2;
        $msg = 'Inserted';

        /// $id = $arr_attr['id'];
        $update_check = "";

        if ($id > 0)
            $update_check = "  AND tst.id <> '" . $arr_attr['acc_id'] . "'";
        
        $data_pass = " tst.type IN (2,1) AND tst.srm_code='" . $arr_attr['srm_code'] . "' $update_check";
        $total = $this->objGeneral->count_duplicate_in_sql('srm', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) 
        {
            $response['ack'] = 0;
            $response['error'] = 'SRM No. Already Exists.';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record Already Exists';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);

            return $response;
        }
        
        //(  )

        /* $data_pass = " tst.type IN (2,1) AND tst.srm_code='" . $arr_attr['srm_code'] . "' AND tst.name='" . $arr_attr['name'] . "' $update_check";

        $total = $this->objGeneral->count_duplicate_in_sql('srm', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) 
        {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record Already Exists';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);

            return $response;
        } */

        $social_media_arr = $arr_attr['social_media_arr'];
        
        $social_media_str = "";
        $index = 1;
        // print_r($social_media_arr);exit;
        foreach($social_media_arr as $sm)
        {
            if(!empty($sm) && $sm->id > 0)
            {
                $social_media_str .= " socialmedia".$index." = '" . $sm->id . "',
                socialmedia".$index."_value = '" . addslashes($sm->value) . "',";
                $index++;
                }
            }

        if($index<=5)
        {
            while($index <= 5)
            {
                $social_media_str .= " socialmedia".$index." = '0',
                socialmedia".$index."_value = '',";
                $index++;
            }
        }
        // echo $social_media_str;exit;
        $social_media_str = substr($social_media_str, 0, -1);

        $pref_method_of_communication = (isset($arr_attr['pref_method_of_communication']) && $arr_attr['pref_method_of_communication'] != '')?$arr_attr['pref_method_of_communication']:0;
        $purchaser_code_id  = (isset($arr_attr['purchaser_code_id']) && $arr_attr['purchaser_code_id'] != '')? $arr_attr['purchaser_code_id']: 0;
        $selling_grp_id = (isset($arr_attr['selling_grp_id']) && $arr_attr['selling_grp_id'] != '')? $arr_attr['selling_grp_id']: 0;
        $region_id  = (isset($arr_attr['region_id']) && $arr_attr['region_id'] != '')? $arr_attr['region_id']: 0;
        $support_person = (isset($arr_attr['support_person']) && $arr_attr['support_person'] != '')? $arr_attr['support_person']: 0;
        $turnover = (isset($arr_attr['turnover']) && $arr_attr['turnover'] != '')? $arr_attr['turnover']: 0;
        $internal_sales = (isset($arr_attr['internal_sales']) && $arr_attr['internal_sales'] != '')? $arr_attr['internal_sales']: 0;
        $company_type = (isset($arr_attr['company_type']) && $arr_attr['company_type'] != '')? $arr_attr['company_type']: 0;
        $source_of_crm = (isset($arr_attr['source_of_crm']) && $arr_attr['source_of_crm'] != '')? $arr_attr['source_of_crm']: 0;  
        $anonymous_supplier = (isset($arr_attr['anonymous_supplier']) && $arr_attr['anonymous_supplier'] != '')? $arr_attr['anonymous_supplier']: 0;  

        $locArray = $arr_attr['loc'];
        $contactArray = $arr_attr['contact'];
        $this->objGeneral->mysql_clean($arr_attr); 
        
        if ($id == 0) {

            $Sql = "INSERT INTO srm 
                                SET
                                    transaction_id = SR_GetNextTransactionID(".$this->arrUser['company_id'].", 2),
                                    unique_id = UUID(),
                                    srm_code='".$arr_attr['srm_code']."',
                                    pref_method_of_communication='".$pref_method_of_communication."',
                                    status='" . $arr_attr['status'] . "',
                                    status_date='" . $this->objGeneral->convert_date($arr_attr['status_date']) . "',
                                    segment_id='".$arr_attr['segment_id']."',
                                    name='".$arr_attr['name']."',
                                    type='".$arr_attr['type']."',
                                    contact_person='".$arr_attr['contact_person']."',
                                    address_1='".preg_replace("/[^a-zA-Z0-9`_.,;@#%~'\"\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-\s\\\\]+/", "", $arr_attr['address_1']) ."',
                                    address_2='".preg_replace("/[^a-zA-Z0-9`_.,;@#%~'\"\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-\s\\\\]+/", "", $arr_attr['address_2'])."',
                                    job_title='".$arr_attr['job_title']."',
                                    additionalInformation='".$arr_attr['additionalInformation']."',
                                    phone='".$arr_attr['phone']."',
                                    city='".$arr_attr['city']."',
                                    fax='".$arr_attr['fax']."',
                                    county='".$arr_attr['county']."',
                                    country_id='".$arr_attr['country_id']."',
                                    mobile='".$arr_attr['mobile']."',
                                    postcode='".$arr_attr['postcode']."',
                                    supplier_classification='$arr_attr[srm_classification]',
                                    srm_classification='".$arr_attr['srm_classification']."',
                                    support_person='".$support_person."',
                                    anonymous_supplier='".$anonymous_supplier."',
                                    direct_line='".$arr_attr['direct_line']."',
                                    email='".$arr_attr['email']."',
                                    salesperson_id='".$purchaser_code_id."',
                                    turnover='".$turnover."',
                                    internal_sales='".$internal_sales."',
                                    company_type='".$company_type."',
                                    source_of_crm='".$source_of_crm."',
                                    web_address='".$arr_attr['web_address']."',
                                    selling_grp_id='".$selling_grp_id."',
                                    region_id='".$region_id."',
                                    credit_limit='".$arr_attr['credit_limit']."',
                                    currency_id='".$arr_attr['currency_id']."',
                                    $social_media_str,
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    AddedBy='" . $this->arrUser['id'] . "',
                                    AddedOn=UNIX_TIMESTAMP (NOW())";
            // echo $Sql;exit;
            // $RS = $this->Conn->Execute($Sql);
            $RS = $this->objsetup->CSI($Sql, "srm", sr_AddPermission);
            $id = $this->Conn->Insert_ID();
            $response['ack'] = 1;
            $response['error'] = NULL;

        } else {

            if ((isset($locArray->depot) && $locArray->depot != "" ) || (isset($locArray->postcode) && $locArray->postcode != "")) {   
                $whereLocID = '';

                if($locArray->alt_loc_id  >0)
                    $whereLocID = 'id <>  '.$locArray->alt_loc_id.' AND';

                if($locArray->is_billing_address == 0) 
                {
                    $checkBillingSql = "SELECT COUNT(*) AS total FROM alt_depot
                                        WHERE acc_id = ".$id." AND 
                                              module_type = 2 AND 
                                              is_billing_address = 1 AND
                                              ".$whereLocID."
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
                                        WHERE acc_id = ".$id." AND 
                                              module_type = 2 AND 
                                              is_invoice_address = 1 AND
                                              ".$whereLocID."
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
                                srm_code='".$arr_attr['srm_code']."',
                                pref_method_of_communication='".$pref_method_of_communication."',
                                status='" . $arr_attr['status'] . "',
                                status_date='" . $this->objGeneral->convert_date($arr_attr['status_date']) . "',
                                segment_id='".$arr_attr['segment_id']."',
                                name='".$arr_attr['name']."',
                                contact_person='".$arr_attr['contact_person']."',
                                address_1='".preg_replace("/[^a-zA-Z0-9`_.,;@#%~'\"\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-\s\\\\]+/", "", $arr_attr['address_1'])."',
                                address_2='".preg_replace("/[^a-zA-Z0-9`_.,;@#%~'\"\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-\s\\\\]+/", "", $arr_attr['address_2'])."',
                                job_title='".$arr_attr['job_title']."',
                                additionalInformation='".$arr_attr['additionalInformation']."',
                                phone='".$arr_attr['phone']."',
                                city='".$arr_attr['city']."',
                                fax='".$arr_attr['fax']."',
                                county='".$arr_attr['county']."',
                                country_id='".$arr_attr['country_id']."',
                                mobile='".$arr_attr['mobile']."',
                                postcode='".$arr_attr['postcode']."',
                                supplier_classification='$arr_attr[srm_classification]',
                                srm_classification='".$arr_attr['srm_classification']."',
                                support_person='".$support_person."',
                                anonymous_supplier='".$anonymous_supplier."',
                                direct_line='".$arr_attr['direct_line']."',
                                email='".$arr_attr['email']."',
                                salesperson_id='".$purchaser_code_id."',
                                turnover='".$turnover."',
                                internal_sales='".$internal_sales."',
                                company_type='".$company_type."',
                                source_of_crm='".$source_of_crm."',
                                web_address='".$arr_attr['web_address']."',
                                selling_grp_id='".$selling_grp_id."',
                                region_id='".$region_id."',
                                credit_limit='".$arr_attr['credit_limit']."',
                                currency_id='".$arr_attr['currency_id']."',
                                $social_media_str,
                                ChangedBy='" . $this->arrUser['id'] . "',
                                ChangedOn=UNIX_TIMESTAMP (NOW())
                                WHERE id = " . $id . "   
                                      Limit 1";

        //    echo $Sql;exit;
            /* $RS = $this->objsetup->CSI($Sql);
            $msg = 'Updated'; */

            // $response = $this->objGeneral->any_query_exception($Sql);
            $response = $this->objsetup->CSI($Sql, "srm", sr_AddEditPermission);
            $response99['ack'] = 1;
            $response99['error'] = NULL;
            $response = $response99;
        } 
        
        /* ======================== */

        $response2[] = array();

        $response2['id'] = $id;
        $response['id'] = $id;
        

        $locArray->acc_id = $id;
        $locArray->module_type = 2;

        $contactArray->acc_id = $id;
        $contactArray->module_type = 2;

        // $response2['id'] = $id;
        // $response['id'] = $id;

        // $arr_attr['loc']->acc_id = $id;
        // $arr_attr['loc']->module_type = 2;

        // $arr_attr['contact']->acc_id = $id;
        // $arr_attr['contact']->module_type = 2; 

        if ((isset($locArray->depot) && $locArray->depot != "") || (isset($locArray->postcode) && $locArray->postcode != "")) {

            if (empty($arr_attr['alt_loc_id']))
                $response2 = $this->add_alt_depot2($locArray, $response2);
            else
                $response2 = $this->update_alt_depot2($locArray, $response2);

            if($response2['ack']==0 && $response2['ack']!="")  return $response2;
        }
     
        
        if ((isset($contactArray->contact_name) && $contactArray->contact_name != "") || $arr_attr['alt_contact_id']>0) {

            $contactArray->alt_contact_id = $arr_attr['alt_contact_id'];
          
            if (empty($arr_attr['alt_contact_id']))
                $response2 = $this->add_alt_contact2($contactArray, $response2);
            else
                $response2 = $this->update_alt_contact2($contactArray, $response2);   
        }           

        if (!($arr_attr['alt_contact_id']>0))
            $arr_attr['alt_contact_id']=$response2['alt_contact_id'];          

        if (!($arr_attr['alt_loc_id']>0))
            $arr_attr['alt_loc_id']=$response2['alt_location_id'];

         //echo "<pre>"; print_r($response2);exit;   

        $response['alt_loc_id'] = $arr_attr['alt_loc_id'];
        $response['alt_contact_id'] = $arr_attr['alt_contact_id']; 


        if ($arr_attr['alt_loc_id'] > 0 && $arr_attr['alt_contact_id'] > 0) 
        {
            $sqlC = "SELECT COUNT(*) as loc_con_count
                     From alt_depot_contact
                     WHERE acc_id = '$id' and module_type = '2' and 
                           location_id = '$arr_attr[alt_loc_id]' and
                           contact_id = '$arr_attr[alt_contact_id]'";
            //echo $sqlC;
            $RSC = $this->objsetup->CSI($sqlC);
            $Row = $RSC->FetchRow();

            if ($Row['loc_con_count'] == 0) 
            {
                $response2['srm_id'] = $id;
                $response2['acc_id'] = $id;
                $response2['module_type'] = 2;
                $response2['alt_location_id'] = $arr_attr['alt_loc_id'];
                $response2['alt_contact_id'] = $arr_attr['alt_contact_id'];
                $response3 = $this->add_contact_location_dropdown_general($response2);
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
    function get_unique_id($attr)
    {
        /* $unique_id = $this->objGeneral->get_unique_id_from_db($attr);

        $Sql = "INSERT INTO $attr[table] 
                                SET 
                                    transaction_id = SR_GetNextTransactionID(".$this->arrUser['company_id'].", 2),
                                    unique_id='" . $unique_id . "',
                                    type=".$attr['type'].",
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "'";
        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($this->Conn->Affected_Rows() > 0) {
            $response['unique_id'] = $unique_id;
            $response['id'] = $id;
            
            $response['error'] = 'Record  Inserted.';            

        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Not Insert.';
        } */

        $moduleCodeType = 1;

        if($attr['type'] == 1 ){

            $Sql = "SELECT type
                    FROM ref_module_category_value
                    WHERE  module_code_id = 16 AND status = 1 AND company_id=" . $this->arrUser['company_id'] . "
                    LIMIT 1";
            // echo  $Sql;exit;

            $rs4 = $this->objsetup->CSI($Sql);

            if ($rs4->RecordCount() > 0){
                $moduleCodeType = $rs4->fields['type'];
            }

        }

        $response['ack'] = 1;
        $response['moduleCodeType'] = $moduleCodeType;

        $response = $this->load_srm_nested_data($attr, $response);
        return $response;
    }

    function convert($attr)
    {
        //   $this->objGeneral->mysql_clean($attr);
        // print_r($attr);
        // supplier_no = " . $attr['supplier_no'] . ",
        
        // srm_no =  " . $attr['srm_no'] . ",

        if ($attr['module'] == 1) 
        {
            $Sql = "UPDATE srm 
                            SET 
                                type = ".$attr['type'].", 
                                supplier_code = '" . $attr['supplier_code'] . "',
                                srm_classification = (SELECT id FROM ref_classification WHERE name = 'Supplier' AND company_id='" . $this->arrUser['company_id'] . "' LIMIT 1),
                                supplier_classification = (SELECT id FROM ref_classification WHERE name = 'Supplier' AND company_id='" . $this->arrUser['company_id'] . "' LIMIT 1)
                            WHERE id = ".$attr['id']." 
                            limit 1";
            $moduleForPermission = "srm_gneraltab";
        } 
        elseif ($attr['module'] == 2) 
        {
            $Sql = "UPDATE srm 
                            SET 
                                type = ".$attr['type'].",  
                                srm_code =  '" . $attr['srm_code'] . "' 
                                WHERE id = ".$attr['id']." 
                                limit 1";
            $moduleForPermission = "supplier_gneraltab";
        }

        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, $moduleForPermission, sr_ConvertPermission);


        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated';
        }
        return $response;
    }

    function add_status_log($arr_attr)
    {
        $current_date = date('Y-m-d H:i:s');
        $Sql = "INSERT INTO srm_status_log
		                        SET 
                                    status_id='".$arr_attr['status_id']."',
                                    srm_id='".$arr_attr['id']."',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "', 
                                    created_date='" . strtotime($current_date) . "'";
        // echo $Sql ;exit;
        $RS = $this->objsetup->CSI($Sql);
    }

    function get_srm_history($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        if ($attr['type'] == "Salespersons") {
            return; // removing table crm_salesperson_log from db as it is not being used

            $Sql = "SELECT crm_salesperson_log.*, employees.first_name, employees.last_name, us.first_name AS e_fname, us.last_name AS e_lname FROM crm_salesperson_log 
            INNER JOIN company ON company.id=crm_salesperson_log.company_id
            INNER JOIN employees ON employees.id=crm_salesperson_log.salesperson_id
            INNER JOIN employees us ON us.id=crm_salesperson_log.user_id
            WHERE crm_salesperson_log.company_id='" . $this->arrUser['company_id'] . "' AND crm_salesperson_log.user_id='" . $this->arrUser['id'] . "' AND crm_salesperson_log.crm_id='" . $attr['crm_id'] . "'
       ";


            $total_limit = pagination_limit;
            
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
                $total_limit = $attr['pagination_limits'];

            $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'crm_salesperson_log', $order_by);
            //   echo $response['q'];  exit;
            $RS = $this->objsetup->CSI($response['q']);
            $response['q'] = '';


            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['name'] = $Row['first_name'] . ' ' . $Row['last_name'];
                    $result['is_primary'] = $Row['is_primary'];
                    $result['changed_by'] = $Row['e_fname'] . " " . $Row['e_lname'];
                    $result['date'] = date('d/m/Y H:i:s', $Row['created_date']);
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

            $Sql = "SELECT crm_credit_limit_log.*, crm_credit_rating.title AS credit_limit, us.first_name AS e_fname, us.last_name AS e_lname FROM crm_credit_limit_log 
                INNER JOIN company ON company.id=crm_credit_limit_log.company_id
                INNER JOIN crm_credit_rating ON crm_credit_rating.id=crm_credit_limit_log.credit_limit
                INNER JOIN employees us ON us.id=crm_credit_limit_log.user_id
                WHERE crm_credit_limit_log.company_id='" . $this->arrUser['company_id'] . "' AND crm_credit_limit_log.user_id='" . $this->arrUser['id'] . "' AND crm_credit_limit_log.crm_id='" . $attr['crm_id'] . "'
        ";


            $total_limit = pagination_limit;
            
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
                $total_limit = $attr['pagination_limits'];

            $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'crm_credit_limit_log', $order_by);
            //   echo $response['q'];  exit;
            $RS = $this->objsetup->CSI($response['q']);
            $response['q'] = '';


            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['credit_rating'] = $Row['credit_limit'];
                    $result['changed_by'] = $Row['e_fname'] . " " . $Row['e_lname'];
                    $result['date'] = $this->objGeneral->convert_unix_into_date($Row['created_date']);
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

            $Sql = "SELECT srm_status_log.*, us.first_name AS e_fname, us.last_name AS e_lname,
                           CASE WHEN srm_status_log.status_id = 0 THEN 'Active'
                                WHEN srm_status_log.status_id = 1 THEN 'InActive'
                                else srm_status.title
                           End  as stitle
                    FROM srm_status_log
                    LEFT JOIN srm_status ON srm_status.id=srm_status_log.status_id
                    LEFT JOIN employees us ON us.id=srm_status_log.user_id
                    WHERE srm_status_log.company_id='" . $this->arrUser['company_id'] . "' AND srm_status_log.user_id='" . $this->arrUser['id'] . "' AND
                          srm_status_log.srm_id='" . $attr['srm_id'] . "'
                    ORDER BY id DESC";

            //echo $Sql;exit;

            $RS = $this->objsetup->CSI($Sql);

            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['status'] = $Row['stitle'];
                    $result['changed_by'] = $Row['e_fname'] . " " . $Row['e_lname'];
                    $result['date'] = $this->objGeneral->convert_unix_into_date($Row['created_date']);
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

    function get_social_media($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "SELECT c.* 
                FROM ref_social_media c   
                WHERE  c.status=1";

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_by);
        //   echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

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

        $id = $arr_attr['id'];

        $update_check = "";

        if ($id > 0)
            $update_check = " AND tst.id <> '" . $id . "'";

        $data_pass = " tst.name='" . $arr_attr['name'] . "' $update_check";
        $total = $this->objGeneral->count_duplicate_in_sql('ref_social_media', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($id == 0) {

            $Sql = "INSERT INTO ref_social_media
                                    SET
                                        name='" . $arr_attr['name'] . "',
                                        description='" . $arr_attr['description'] . "',
                                        status=1,
                                        company_id='" . $this->arrUser['company_id'] . "',
                                        user_id='" . $this->arrUser['id'] . "',
                                        date_created='" . current_date . "'";

            $rs = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
            //$response =$this->objGeneral->run_query_exception($Sql);
            //return $response; exit;
        } else {
            $Sql = "UPDATE ref_social_media
			                SET 
                                name='" . $arr_attr['name'] . "',
                                description='" . $arr_attr['description'] . "'
                                WHERE id = $id 
                                Limit 1 ";
            $rs = $this->objsetup->CSI($Sql);
        }
        //echo $Sql;exit;

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'error';
        }
        return $response;
    }

    function get_srm_social_media($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "SELECT sc.*, ref_social_media.name AS sname
                FROM srm_social_media sc 
                INNER JOIN company ON company.id=sc.company_id
                INNER JOIN ref_social_media ON ref_social_media.id=sc.media_id
                WHERE sc.company_id='" . $this->arrUser['company_id'] . "' 
                    AND sc.user_id='" . $this->arrUser['id'] . "' 
                    AND sc.srm_id='" . $attr['srm_id'] . "'
                    AND sc.status=1 ";

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'sc', $order_by);
        //   echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['social_media'] = $Row['sname'];
                $result['address'] = $Row['address'];
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

    function add_srm_social_media($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "SELECT sc.id
		FROM srm_social_media  sc
		INNER JOIN company ON company.id=sc.company_id
		INNER JOIN ref_social_media ON ref_social_media.id=sc.media_id
		WHERE sc.company_id='" . $this->arrUser['company_id'] . "' "
            . "AND sc.user_id='" . $this->arrUser['id'] . "' AND "
            . "sc.srm_id='" . $arr_attr[srm_id] . "' AND "
            . "sc.media_id='" . $arr_attr[media_id] . "' AND "
            . "sc.address='" . $arr_attr[address] . "'
		ORDER BY sc.id DESC limit 1";
        //echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exist.';
            $response['Update'] = 0;
        } else {

            $Sql = "INSERT INTO srm_social_media
			SET `status`=1,`srm_id`='$arr_attr[srm_id]',`media_id`='$arr_attr[media_id]',`address`='" . $arr_attr[address] . "'
			,user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "', date_created=NOW()";
            //echo $Sql;exit;
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

    function get_alt_contact_social_media($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "SELECT ac.*, ref_social_media.name AS sname
		FROM srm_alt_contact_social_media ac 
		INNER JOIN company ON company.id=ac.company_id
		INNER JOIN ref_social_media ON ref_social_media.id=ac.media_id
		WHERE ac.company_id='" . $this->arrUser['company_id'] . "' AND ac.user_id='" . $this->arrUser['id'] . "'
		AND ac.srm_id='" . $attr['srm_id'] . "' AND ac.alt_contact_id='" . $attr['alt_contact_id'] . "' 
		AND ac.status=1 
		 ";
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'ac', $order_by);
        //   echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['social_media'] = $Row['sname'];
                $result['address'] = $Row['address'];
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
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "SELECT ac.id
		FROM srm_alt_contact_social_media ac 
		INNER JOIN company ON company.id=ac.company_id
		INNER JOIN ref_social_media ON ref_social_media.id=ac.media_id
		WHERE ac.company_id='" . $this->arrUser['company_id'] . "' "
            . "AND ac.user_id='" . $this->arrUser['id'] . "' AND "
            . "ac.alt_contact_id='" . $arr_attr[alt_contact_id] . "' AND "
            . "ac.srm_id='" . $arr_attr[srm_id] . "' AND "
            . "ac.media_id='" . $arr_attr[media_id] . "' AND "
            . "ac.address='" . $arr_attr[address] . "'
		ORDER BY ac.id DESC limit 1";
        //echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record already exist.';
            $response['Update'] = 0;
        } else {
            $Sql = "INSERT INTO srm_alt_contact_social_media
                                SET 
                                    `status`=1,
                                    `alt_contact_id`='$arr_attr[alt_contact_id]',
                                    `srm_id`='$arr_attr[srm_id]',
                                    `media_id`='$arr_attr[media_id]',
                                    `address`='" . $arr_attr[address] . "',
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
        }
        return $response;
    }

    ############	Start: SRM predifine comunication method  ######

    function get_pref_method_of_comm($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";
        $response = array();

        $Sql = "SELECT c.* FROM srm_pref_method_of_communiction c ";
        //c.user_id=".$this->arrUser['id']."

        $order_by = "group by  c.id DESC";
        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_by);
        //  echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                $result = array();
                $result['id'] = $Row['id'];
                // $result['code'] = $Row['code'];
                $result['title'] = $Row['title'];
                // $result['status'] = ($Row['status'] == "1")?"Active":"Inactive";
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_all_pref_method_of_comm($attr)
    {

        $Sql = "SELECT c.id, c.title 
                FROM  srm_pref_method_of_communiction  c
                where  c.status=1 and 
                       c.company_id=" . $this->arrUser['company_id'] . "
                group by  c.title DESC "; 
        //c.user_id=".$this->arrUser['id']."
        
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                $result['id'] = $Row['id'];
                $result['title'] = $Row['title'];
                $response['response'][] = $result;
                }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }

        return $response;
    }

    function add_pref_method_of_comm($arr_attr)
    {
        $id = $arr_attr['id'];
        $update_check = "";

        if ($id > 0)
            $update_check = "  AND tst.id <> '" . $id . "'";

        $data_pass = " tst.title='" . $arr_attr['title'] . "' and tst.status=1 ".$update_check." ";
        $total = $this->objGeneral->count_duplicate_in_sql('srm_pref_method_of_communiction', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($id == 0) 
        {
             $Sql = "INSERT INTO srm_pref_method_of_communiction
									SET  
										title='".$arr_attr['title']."',
										description='".$arr_attr['description']."',
										company_id='" . $this->arrUser['company_id'] . "',
										user_id='" . $this->arrUser['id'] . "'";

            $rs = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
        } 
        else {
            $Sql = "UPDATE srm_pref_method_of_communiction
							SET 
							title='".$arr_attr['title']."',
							description='".$arr_attr['description']."',
							status='".$arr_attr['status']."'
							WHERE id = ".$arr_attr['id']." 
                            Limit 1 ";

            $rs = $this->objsetup->CSI($Sql);
        }
        //echo $Sql;exit;
        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;
            
        } else {
            $response['ack'] = 0;
            $response['error'] = 'error';
        }
        return $response;
    }

    //----------------Alt Contact Module----------------------

    function get_alt_contact_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);        

        $Sql = " SELECT  * 
                 FROM sr_alt_contact_sel  
                 WHERE  id='" . $attr['id'] . "' and  
                        module_type ='".$attr['module_type']."' and 
                        company_id='" .$this->arrUser['company_id'] . "' ";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) 
        {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) 
            {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $response['response'] = $Row;

            $Sql2 ="SELECT c.location_id
                    FROM alt_depot_contact c
                    where  c.status=1 and  c.acc_id='".$Row['acc_id']."'  and 
                            c.module_type='".$attr['module_type']."' and
                            c.contact_id='" . $attr['id'] . "' and
                            c.company_id=" . $this->arrUser['company_id'] . " ";
            // echo $Sql2;exit;
            $RS2 = $this->objsetup->CSI($Sql2);

            if ($RS2->RecordCount() > 0) 
            {
                while ($Row2 = $RS2->FetchRow()) 
                {
                    $result = array();
                    $result['id'] = $Row2['location_id'];
                    $response['response']['ContactLoc'][] = $result;
                }
            }

            $Sql3 ="SELECT c.*
                    FROM sr_alt_dept_sel c
                    where   c.acc_id='".$Row['acc_id']."'  and 
                            c.module_type='".$attr['module_type']."' and
                            c.company_id=" . $this->arrUser['company_id'] . " ";
            // echo $Sql3;exit;
            $RS3 = $this->objsetup->CSI($Sql3);

            if ($RS3->RecordCount() > 0) 
            {
                while ($Row3 = $RS3->FetchRow()) 
                {
                    foreach ($Row3 as $key => $value) {
                        if (is_numeric($key))
                            unset($Row3[$key]);
                    }
                    $response['response']['loc'][] = $Row3;
                }
            }
            
        } else {
            $response['response'] = array();
        }
        return $response;
    }


    function get_alt_contacts($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $filters_dropdown = "";
        $head = "";
        $filter_dict = "";

        $acc_id = $attr["acc_id"];

        $response = array();
        $record = array();
        $moduleForPermission = $this->objsetup->moduleDecider($attr['module_type'], $acc_id);
        $moduleForPermission = $moduleForPermission . "_contacttab";

        $Sql = " SELECT c.*
                 From sr_alt_contact_sel c
                 WHERE  c.status=1 and 
                        c.contact_name <> '' and 
                        c.acc_id='" . $acc_id . "' and 
                        c.module_type='" . $attr['module_type'] . "' and 
                        c.company_id='" .$this->arrUser['company_id'] . "'";

        $order_type = "order by c.is_primary DESC";

        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);

        // $RS = $this->objsetup->CSI($response['q'], $moduleForPermission, sr_ViewPermission);

        $response['q'] = '';

        if ($attr['type'] == 2)
            $type = 2;
        else
            $type = 1;

        //echo $type;exit;

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['contact_name'];
                // echo "<pre>";
                // print_r($Row);

                if ($type == 1) 
                {
                    $result['job_title'] = $Row['job_title'];
                    $result['direct_line'] = $Row['direct_line'];
                    $result['mobile'] = $Row['mobile'];
                    $result['phone'] = $Row['phone'];
                    $result['email'] = $Row['email'];
                    $result['fax'] = $Row['fax'];
                    $result['is_primary'] = $Row['is_primary'];
                    $result['pref_method_of_communication'] = $Row['pref_method_of_communication'];

                    // $result['notesContact'] = $Row['notes'];

                    if($attr['module_type'] == 1)
                        $result['notesContact'] = $Row['booking_instructions'];
                    else
                        $result['notesContact'] = $Row['notes'];
                    
                    $result['notes'] = $Row['booking_instructions'];
                    
                }

                $response['response'][] = $result;
                $record['results'][] = $result;
            }
            
            $response['ack'] = 1;
            $response['error'] = NULL;
            $ack = 1;
        } else {
            $ack = 0;
            $response['ack'] = 0;
            $response['error'] = NULL;
            $response['response'][] = array();
        }

        return array('filters_dropdown' => $filters_dropdown,
                     'columns' => $head,
                     'filter_dict' => $filter_dict,
                     'filters' => $record['column_id'],
                     'record' => array('total' => $response['total'],
                     'result' => $record['results'],
                     'response' => $record['response'],
                     'ack' => $ack));
        // return $response;
    }

    function get_list_location_time($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();
        $order_type = "";

        $Sql = "SELECT c.day_limit,c.id,c.notes,c.booking_start_time,c.booking_end_time,
                       CASE  WHEN c.day_limit = 1 then 'Monday'
                             WHEN c.day_limit = 2 then 'Tuesday'
                             WHEN c.day_limit = 3 then 'Wednesday'
                             WHEN c.day_limit = 4 then 'Thursday'
                             WHEN c.day_limit = 5 then 'Friday'
                             WHEN c.day_limit = 6 then 'Saturday'
                             WHEN c.day_limit = 7 then 'sunday'
                             ELSE NUll  End  AS dayname
                 FROM loc_delivery_time  c
                 where  c.status=1 and  
                        c.acc_id='".$attr['acc_id']."' and  
                        c.module_type='".$attr['module_type']."' and  
                        c.location_id='".$attr['rec_loc_location_id']."' and
                        c.company_id=" . $this->arrUser['company_id'] . " ";

        $order_type = "order by c.id ASC";

        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                $result = array();
                $result['id'] = $Row['id'];
                $result['day_limit'] = $Row['day_limit'];
                $result['day'] = $Row['dayname'];
                $result['booking_start_time'] = $Row['booking_start_time'];
                $result['booking_end_time'] = $Row['booking_end_time'];
                $result['notes'] = $Row['notes'];

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

    function add_location_time($arr_attr)
    {
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
        // $this->objGeneral->mysql_clean($arr_attr);

        $sqld = "DELETE FROM loc_delivery_time   
                 where  acc_id='".$arr_attr['acc_id']."'  AND 
                        module_type = '".$arr_attr['module_type']."' AND 
                        company_id='" . $this->arrUser['company_id'] . "' AND 
                        location_id='".$arr_attr['rec_loc_location_id']."' ";

        $this->objsetup->CSI($sqld);

        $Sqle = "INSERT INTO 
                            loc_delivery_time 
                                    (location_id,acc_id,module_type,day_limit,booking_start_time,booking_end_time,notes, company_id,user_id,date_created,closed_chk) VALUES ";

        foreach ($arr_attr['loccaiontiming'] as $item) {

            if ($item->day_limit->id) $closed_chk = 1;
            else $closed_chk = 0;

            $Sqle .= "('" . $arr_attr['rec_loc_location_id'] . "','" . $arr_attr['acc_id'] . "','" .
                $arr_attr['module_type'] . "','" .$item->day_limit->id . "' ,'" . $item->booking_start_time . "','" . $item->booking_end_time . "','" . $item->notes . "' ,'" . $this->arrUser['company_id'] . "','" . $this->arrUser['id'] . "','" . current_date . "',$closed_chk ),";
        }
        //echo $Sqle; exit;

        $RS = $this->objsetup->CSI((substr($Sqle, 0, -1)));


        $this->Conn->commitTrans();
        $this->Conn->autoCommit = true;
        
        $srLogTrace = array();
        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Exit';

        $this->objsetup->SRTraceLogsPHP($srLogTrace);

        return true;
        exit;




        //old method single record
        $data_pass = "  tst.acc_id='".$arr_attr['acc_id']."' and 
                        tst.location_id='$arr_attr[rec_loc_location_id]' and 
                        tst.day_limit='$arr_attr[day_limits]' and 
                        tst.booking_start_time='" . $arr_attr['booking_start_time'] . "' and 
                        tst.booking_end_time='" . $arr_attr['booking_end_time'] . "' ";

        $total = $this->objGeneral->count_duplicate_in_sql('loc_delivery_time', $data_pass,$this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }

        $Sql = "INSERT INTO loc_delivery_time
                                SET   
                                    acc_id='$arr_attr[acc_id]',
                                    module_type='$arr_attr[module_type]' ,
                                    location_id='$arr_attr[rec_loc_location_id]' ,
                                    day_limit='$arr_attr[day_limits]',
                                    booking_start_time='" . $arr_attr['booking_start_time'] . "',
                                    booking_end_time='" . $arr_attr['booking_end_time'] . "',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "', 
                                    date_created=NOW()";

        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
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

    //add location and contact dropdown from tabs
    function get_contact_location_dropdown($arr_attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();
        $order_type = "";

        if ($arr_attr['type'] == 1)
        {
            $Sql2 ="SELECT c.*
                    FROM alt_depot_contact c
                    where c.status=1 and c.acc_id='".$arr_attr['acc_id']."'  and 
                        c.module_type='".$arr_attr['module_type']."' and
                        c.location_id='" . $arr_attr['rec_id'] . "' and
                        c.company_id=" . $this->arrUser['company_id'] . " ";

        }else if ($arr_attr['type'] == 2) 
        {
            $order_type = "order by c.id  ASC";
            $Sql2 ="SELECT c.*
                    FROM alt_depot_contact c
                    where  c.status=1 and  c.acc_id='".$arr_attr['acc_id']."'  and 
                            c.module_type='".$arr_attr['module_type']."' and
                            c.contact_id='" . $arr_attr['rec_id'] . "' and
                            c.company_id=" . $this->arrUser['company_id'] . " ";
        }

        $order_type = "order by c.id ASC";

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql2, $response, $total_limit, 'c', $order_type);
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                $result = array();
                $result['id'] = $Row['id'];
                $result['location_id'] = $Row['location_id'];
                $result['contact_id'] = $Row['contact_id'];
                $result['rec_id'] = $Row['rec_id'];
                $result['notes'] = $Row['notes'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else
            $response = array();
        return $response;
    }

    function delete_alt_depot($arr_attr)
    {
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
        $this->objGeneral->mysql_clean($arr_attr);
        $moduleForPermission = $this->objsetup->moduleDecider($arr_attr['module_type'], $arr_attr['acc_id']);
        $moduleForPermission = $moduleForPermission . "_locationtab";

        $sqld = "DELETE FROM alt_depot_contact
                     where  acc_id='" . $arr_attr['acc_id'] . "' and 
                            module_type='" . $arr_attr['module_type'] . "' and  
                            company_id='" . $this->arrUser['company_id'] . "' 
                            and location_id='" . $arr_attr['id'] . "' ";

        // $this->objsetup->CSI($sqld);
        $RS = $this->objsetup->CSI($sqld, $moduleForPermission, sr_DeletePermission);


        $Sql = "Update alt_depot 
                        set 
                            status=0 
                        WHERE id = ".$arr_attr['id']." and 
                              acc_id='" . $arr_attr['acc_id'] . "' and 
                              module_type='" . $arr_attr['module_type'] . "'";

        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, $moduleForPermission, sr_DeletePermission);


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

            $this->objsetup->SRTraceLogsPHP($srLogTrace);

        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated';
            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record not updated';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }

        return $response;
    }

    function delete_alt_contact($arr_attr)
    {
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
        $this->objGeneral->mysql_clean($arr_attr);
        $moduleForPermission = $this->objsetup->moduleDecider($arr_attr['module_type'], $arr_attr['acc_id']);          

        $moduleForPermission = $moduleForPermission . "_contacttab";

        $sqld = "DELETE 
                 FROM alt_depot_contact
                 where  acc_id='" . $arr_attr['acc_id'] . "' and 
                        module_type='" . $arr_attr['module_type'] . "' and
                        contact_id='" . $arr_attr['id'] . "'  and  
                        company_id='" . $this->arrUser['company_id'] . "' ";
        //echo $sqld;exit;
        // $this->objsetup->CSI($sqld);
        $RS = $this->objsetup->CSI($sqld);
        // $RS = $this->objsetup->CSI($sqld, $moduleForPermission, sr_DeletePermission);


        $Sql = "Update alt_contact 
                            set 
                                status=0 
                            WHERE   id = ".$arr_attr['id']." and  
                                    acc_id='" . $arr_attr['acc_id'] . "' and 
                                    module_type='" . $arr_attr['module_type'] . "'";

        $RS = $this->objsetup->CSI($Sql);
        // $RS = $this->objsetup->CSI($Sql, $moduleForPermission, sr_DeletePermission);


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

            $this->objsetup->SRTraceLogsPHP($srLogTrace);

        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record not updated';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }
        return $response;
    }

    function add_contact_location_dropdown($arr_attr)
    {
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
        // $this->objGeneral->mysql_clean($arr_attr);
        if ($arr_attr['type'] == 1) {


            $sqld = "DELETE FROM alt_depot_contact
                     where  acc_id='".$arr_attr['acc_id']."'  and 
                            module_type='".$arr_attr['module_type']."'  and  
                            company_id='" . $this->arrUser['company_id'] . "' and 
                            location_id='" . $arr_attr['rec_id'] . "' ";

            $this->objsetup->CSI($sqld);
            if ($arr_attr['rec_id'] > 0) {
                foreach ($arr_attr['addcontactslisting'] as $item) {
                    if ($item->id > 0) {
                        $Sqle = "INSERT INTO 
                                        alt_depot_contact (location_id,acc_id,module_type,contact_id,company_id,user_id,
            date_created) VALUES ( '" . $arr_attr['rec_id'] . "','" . $arr_attr['acc_id'] . "','" . $arr_attr['module_type'] . "','" . $item->id . "'," . $this->arrUser['company_id'] . "," . $this->arrUser['id'] . ",'" . current_date . "')";

                        $RS = $this->objsetup->CSI($Sqle);
                    }
                }
            }
        } 
        else if ($arr_attr['type'] == 2) 
        {
            $sqld = "DELETE 
                     FROM alt_depot_contact
                     where  acc_id='".$arr_attr['acc_id']."'  and 
                            module_type='".$arr_attr['module_type']."'  and  
                            company_id='" . $this->arrUser['company_id'] . "' and 
                            contact_id='" . $arr_attr['rec_id'] . "' ";

            $this->objsetup->CSI($sqld);
            if ($arr_attr['rec_id'] > 0) {
                foreach ($arr_attr['addcontactslisting'] as $item) {
                    if ($item->id > 0) {
                        $Sqle = "INSERT INTO alt_depot_contact (location_id,acc_id,module_type,contact_id,company_id,user_id,
            date_created) VALUES ('" . $item->id . "','" . $arr_attr['acc_id'] . "','" . $arr_attr['module_type'] . "','" . $arr_attr['rec_id'] . "'," . $this->arrUser['company_id'] . "," . $this->arrUser['id'] . ",'" . current_date . "')";
                        //echo $Sqle;echo "2";   exit;
                        $RS = $this->objsetup->CSI($Sqle);
                    }
                }
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

        return true;
    }

    function get_alt_contacts_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = "";
        $where_clause = "AND company_id =" . $this->arrUser['company_id'];
        $response = array();

        $Sql = "SELECT id, contact_name, direct_line, mobile, email
				FROM srm_alt_contact
				WHERE 1 " . $where_clause . " 
                      ORDER BY id DESC";


        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['contact_name'];
                $result['direct_line'] = $Row['direct_line'];
                $result['mobile'] = $Row['mobile'];
                $result['email'] = $Row['email'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else 
        {
            $response['response'][] = array();
        }
        return $response;
    }

    function update_alt_contact($arr_attr)
    {
        $social_media_arr_contact = $arr_attr['social_media_arr_contact'];
        
        $this->objGeneral->mysql_clean($arr_attr);

        $moduleForPermission = $this->objsetup->moduleDecider($arr_attr['module_type'], $arr_attr['acc_id']);      
        $moduleForPermission = $moduleForPermission . "_contacttab";

        $id = 0;

        if (isset($arr_attr['alt_contact_id']))
            $id = $arr_attr['alt_contact_id'];
        else
            $id = $arr_attr['id'];
        //echo "<pre>"; print_r($arr_attr); exit;

        $index = 1;
        foreach($social_media_arr_contact as $sm)
        {
            if(!empty($sm) && $sm->id>0)
            {
                $social_media_str .= " socialmedia".$index." = '" . $sm->id . "',
                socialmedia".$index."_value = '" . $sm->value . "',";
                $index++;
            }
        }

        if($index<=5)
        {
            while($index <= 5)
            {
                $social_media_str .= " socialmedia".$index." = '0',
                socialmedia".$index."_value = '',";
                $index++;
            }
        }
        $pref_method_of_communication = (isset($arr_attr['pref_method_of_communication']) && $arr_attr['pref_method_of_communication'] != '')?$arr_attr['pref_method_of_communication']:0;
        $Sql = "UPDATE alt_contact
                        SET
                              depot='" . $arr_attr['depot'] . "',
                              pref_method_of_communication='" . $pref_method_of_communication . "',
                              contact_name='" . $arr_attr['contact_name'] . "',
                              job_title='" . $arr_attr['job_title'] . "',
                              address_1='" . preg_replace("/[^a-zA-Z0-9`_.,;@#%~'\"\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-\s\\\\]+/", "", $arr_attr['address_1']) . "',
                              address_2='" . preg_replace("/[^a-zA-Z0-9`_.,;@#%~'\"\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-\s\\\\]+/", "", $arr_attr['address_2']) . "',
                              phone='" . $arr_attr['phone'] . "',
                              city='" . $arr_attr['city'] . "',
                              fax='" . $arr_attr['fax'] . "',
                              county='" . $arr_attr['county'] . "',
                              mobile='" . $arr_attr['mobile'] . "',
                              postcode='" . $arr_attr['postcode'] . "',
                              direct_line='" . $arr_attr['direct_line'] . "',
                              email='" . $arr_attr['email'] . "',
                              web_add='" . $arr_attr['web_add'] . "',
                              notes='" . $arr_attr['notes'] . "',
                              acc_id='" . $arr_attr['acc_id'] . "',
                              booking_instructions='" . $arr_attr['booking_instructions'] . "'  ,
                              $social_media_str
                              module_type ='" . $arr_attr['module_type'] . "'
                              WHERE id = " . $id . " and company_id='" . $this->arrUser['company_id'] . "' 
                                    Limit 1";
        //echo  $Sql;exit;

        // $response = $this->objGeneral->any_query_exception($Sql);
        $response = $this->objsetup->CSI($Sql);
        // $response = $this->objsetup->CSI($Sql, $moduleForPermission, sr_EditPermission);
        $response99['ack'] = 1;
        $response99['error'] = NULL;
        $response = $response99;

        if($arr_attr['is_primary']== 1)
        {
            $Sql = "CALL SR_Update_Primary_Contact('" .$id . "','" . $arr_attr['acc_id'] . "','".$this->arrUser['company_id']  . "','" .$this->arrUser['id'] . "','" . $arr_attr['module_type'] . "')";
            //echo $Sql;
            $RS = $this->objsetup->CSI($Sql);
        }
        return $response;
    }

    function update_alt_contact2($arr_attr, $response)
    {        
        $social_media_arr_contact = $arr_attr->social_media_arr_contact;       
        $arr_attr = (array)$arr_attr;
        $this->objGeneral->mysql_clean($arr_attr);

        $moduleForPermission = $this->objsetup->moduleDecider($arr_attr['module_type'], $arr_attr['acc_id']);      
        $moduleForPermission = $moduleForPermission . "_contacttab";

        $id = 0;
        if (isset($arr_attr['alt_contact_id']))
            $id = $arr_attr['alt_contact_id'];
        else
            $id = $arr_attr['id'];
        
        $social_media_str = "";
        $index = 1;
        foreach($social_media_arr_contact as $sm)
        {
            if(!empty($sm) && $sm->id>0)
            {
                $social_media_str .= " socialmedia".$index." = '" . $sm->id . "',
                socialmedia".$index."_value = '" . $sm->value . "',";
                $index++;
            }
        }

        if($index<=5)
        {
            while($index <= 5)
            {
                $social_media_str .= " socialmedia".$index." = '0',
                socialmedia".$index."_value = '',";
                $index++;
            }
        }

        $pref_method_of_communication = (isset($arr_attr['pref_method_of_communication']) && $arr_attr['pref_method_of_communication'] != '')?$arr_attr['pref_method_of_communication']:0;
        // echo $social_media_str;exit;
        $Sql = "UPDATE alt_contact
                        SET
                              depot='" . $arr_attr['depot'] . "',
                              pref_method_of_communication='" . $pref_method_of_communication . "',
                              contact_name='" . $arr_attr['contact_name'] . "',
                              job_title='" . $arr_attr['job_title'] . "',
                              address_1='" . preg_replace("/[^a-zA-Z0-9`_.,;@#%~'\"\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-\s\\\\]+/", "", $arr_attr['address_1']) . "',
                              address_2='" . preg_replace("/[^a-zA-Z0-9`_.,;@#%~'\"\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-\s\\\\]+/", "", $arr_attr['address_2']). "',
                              phone='" . $arr_attr['phone'] . "',
                              city='" . $arr_attr['city'] . "',
                              fax='" . $arr_attr['fax'] . "',
                              county='" . $arr_attr['county'] . "',
                              mobile='" . $arr_attr['mobile'] . "',
                              postcode='" . $arr_attr['postcode'] . "',
                              direct_line='" . $arr_attr['direct_line'] . "',
                              email='" . $arr_attr['email'] . "',
                              web_add='" . $arr_attr['web_add'] . "',
                              notes='" . $arr_attr['notes'] . "',
                              acc_id='" . $arr_attr['acc_id'] . "',
                              booking_instructions='" . $arr_attr['booking_instructions'] . "'  ,
                              $social_media_str
                              module_type ='" . $arr_attr['module_type'] . "'
                              WHERE id = " . $id . " and company_id='" . $this->arrUser['company_id'] . "' 
                                    Limit 1";
        // echo  $Sql;exit;

        $rs = $this->objsetup->CSI($Sql);
        // $rs = $this->objsetup->CSI($Sql, $moduleForPermission, sr_EditPermission);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['alt_contact_ack'] = 1;
            $response['alt_contact_error'] = NULL;
            $response['alt_contact_id'] = $id;
        }else
            $response = array();

        return $response;
    }

    function add_alt_contact($arr_attr)
    {
        $social_media_arr_contact = $arr_attr['social_media_arr_contact'];

        $moduleForPermission = $this->objsetup->moduleDecider($arr_attr['module_type'], $arr_attr['acc_id']);      
        $moduleForPermission = $moduleForPermission . "_contacttab";
        
        $this->objGeneral->mysql_clean($arr_attr);
        $arr_attr['update_id'] = 0;
        // $this->objGeneral->mysql_clean($arr_attr);
        // and tst.email='$arr_attr[email]'

        $data_pass = " tst.acc_id='" . $arr_attr['acc_id'] . "' and tst.module_type='" . $arr_attr['module_type'] . "' and tst.contact_name='" . $arr_attr['contact_name']. "'";
        $total = $this->objGeneral->count_duplicate_in_sql('alt_contact', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 2;
            $response['error'] = 'Duplicate name for contact !';
            return $response;
        }
        
        $social_media_str = "";
        $index = 1;
        foreach($social_media_arr_contact as $sm)
        {
            if(!empty($sm) && $sm->id>0)
            {
                $social_media_str .= " socialmedia".$index." = '" . $sm->id . "',
                socialmedia".$index."_value = '" . $sm->value . "',";
                $index++;
            }
        }

        if($index<=5)
        {
            while($index <= 5)
            {
                $social_media_str .= " socialmedia".$index." = '0',
                socialmedia".$index."_value = '',";
                $index++;
            }
        }
        $pref_method_of_communication = (isset($arr_attr['pref_method_of_communication']) && $arr_attr['pref_method_of_communication'] != '')?$arr_attr['pref_method_of_communication']:0;
        
        $Sql = "INSERT INTO alt_contact
                                SET
                                      depot='" . $arr_attr['depot'] . "',
                                      pref_method_of_communication='" .$pref_method_of_communication. "',
                                      contact_name='" . $arr_attr['contact_name'] . "',
                                      job_title='" . $arr_attr['job_title'] . "',
                                      address_1='" . preg_replace("/[^a-zA-Z0-9`_.,;@#%~'\"\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-\s\\\\]+/", "", $arr_attr['address_1']) . "',
                                      address_2='" . preg_replace("/[^a-zA-Z0-9`_.,;@#%~'\"\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-\s\\\\]+/", "", $arr_attr['address_2']) . "',
                                      phone='" . $arr_attr['phone'] . "',
                                      city='" . $arr_attr['city'] . "',
                                      fax='" . $arr_attr['fax'] . "',
                                      county='" . $arr_attr['county'] . "',
                                      mobile='" . $arr_attr['mobile'] . "',
                                      postcode='" . $arr_attr['postcode'] . "',
                                      direct_line='" . $arr_attr['direct_line'] . "',
                                      email='" . $arr_attr['email'] . "',
                                      web_add='" . $arr_attr['web_add'] . "',
                                      notes='" . $arr_attr['notes'] . "',
                                      acc_id='" . $arr_attr['acc_id'] . "',
                                      booking_instructions= '" . $arr_attr['booking_instructions'] . "' ,
                                      user_id='" . $this->arrUser['id'] . "',
                                      company_id='" . $this->arrUser['company_id'] . "'  ,
                                      $social_media_str
                                      AddedBy='" . $this->arrUser['id'] . "',
                                      AddedOn=UNIX_TIMESTAMP (NOW()),
                                      module_type ='" . $arr_attr['module_type'] . "'
                                     ";
                                     // country='" . $arr_attr['country'] . "',
        // echo $Sql;

        $RS = $this->objsetup->CSI($Sql);
        // $RS = $this->objsetup->CSI($Sql, $moduleForPermission, sr_AddPermission);

        /* if ($RS)
            print $this->Conn->ErrorMsg(); */

        $id = $this->Conn->Insert_ID();

        if($arr_attr['is_primary']== 1)
        {
            $Sql = "CALL SR_Update_Primary_Contact('" .$id . "','" . $arr_attr['acc_id'] . "','".$this->arrUser['company_id']  . "','" .$this->arrUser['id'] . "','" . $arr_attr['module_type'] . "')";
            //echo $Sql;exit; 
            $RS = $this->objsetup->CSI($Sql);
        }

        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['id'] = $id;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
            $response['edit'] = 0;
        }
        return $response;
    }

    function add_alt_contact2($arr_attr, $response)
    {
        // print_r($arr_attr->acc_id);echo "23";exit;
        if (isset($arr_attr->contact_name) && $arr_attr->contact_name == "" ) {
            $response['ack'] = 2;
            $response['contact_error'] = 'Contact data is missing';
            return $response;
        }

        // $this->objGeneral->mysql_clean($arr_attr);
        // and tst.email='$arr_attr[email]'

        $moduleForPermission = $this->objsetup->moduleDecider($arr_attr->module_type, $arr_attr->acc_id);      
        $moduleForPermission = $moduleForPermission . "_contacttab";

        $data_pass = " tst.acc_id='" . $arr_attr->acc_id . "' and tst.module_type='" . $arr_attr->module_type . "' and tst.contact_name='" . $arr_attr->contact_name . "'";
        $total = $this->objGeneral->count_duplicate_in_sql('alt_contact', $data_pass,$this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 2;
            $response['error'] = 'Record Already Exists.';
            return $response;
        } 

        if (!empty($arr_attr->is_primary)) 
        {
            // print_r($arr_attr);exit;
            $add_pass2 = ", is_primary=1 ";

            $data_pass2 = " tst.acc_id='" . $arr_attr->acc_id . "' and tst.is_primary=1 and tst.module_type='" . $arr_attr->module_type . "' ";
            $total = $this->objGeneral->count_duplicate_in_sql('alt_contact', $data_pass2,$this->arrUser['company_id']);

            if ($total > 0) {
                $response['ack'] = 2;
                $response['error'] = 'Record Already Exists.';
                return $response;
            }
        }
        //  print_r($arr_attr); exit;
        //country='" . $arr_attr->country . "',

        $social_media_arr_contact = $arr_attr->social_media_arr_contact;        
        $social_media_str = "";
        $index = 1;

        foreach($social_media_arr_contact as $sm)
        {
            if(!empty($sm) && $sm->id>0)
            {
                $social_media_str .= " socialmedia".$index." = '" . $sm->id . "',
                socialmedia".$index."_value = '" . $sm->value . "',";
                $index++;
            }
        }

        if($index<=5)
        {
            while($index <= 5)
            {
                $social_media_str .= " socialmedia".$index." = '0',
                socialmedia".$index."_value = '',";
                $index++;
            }
        }
        // echo $social_media_str;exit;
        $pref_method_of_communication = (isset($arr_attr->pref_method_of_communication) && $arr_attr->pref_method_of_communication != '')?$arr_attr->pref_method_of_communication:'0';
        $Sql = "INSERT INTO alt_contact
                                SET
                                      depot='" . $arr_attr->depot . "',
                                      pref_method_of_communication='$pref_method_of_communication',
                                      contact_name='" . $arr_attr->contact_name . "',
                                      job_title='" . $arr_attr->job_title . "',
                                      address_1='" . preg_replace("/[^a-zA-Z0-9`_.,;@#%~'\"\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-\s\\\\]+/", "", $arr_attr->address_1) . "',
                                      address_2='" . preg_replace("/[^a-zA-Z0-9`_.,;@#%~'\"\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-\s\\\\]+/", "", $arr_attr->address_2) . "',
                                      phone='" . $arr_attr->phone . "',
                                      city='" . $arr_attr->city . "',
                                      fax='" . $arr_attr->fax . "',
                                      county='" . $arr_attr->county . "',
                                      mobile='" . $arr_attr->mobile . "',
                                      postcode='" . $arr_attr->postcode . "',
                                      direct_line='" . $arr_attr->direct_line . "',
                                      email='" . $arr_attr->email . "',
                                      web_add='" . $arr_attr->web_add . "',
                                      notes='" . $arr_attr->notes . "',
                                      acc_id='" . $arr_attr->acc_id . "',
                                      is_primary=1,
                                      booking_instructions= '" . $arr_attr->booking_instructions . "' ,
                                      user_id='" . $this->arrUser['id'] . "',
                                      company_id='" . $this->arrUser['company_id'] . "'  ,
                                      $social_media_str
                                      AddedBy='" . $this->arrUser['id'] . "',
                                      AddedOn=UNIX_TIMESTAMP (NOW()),
                                      module_type ='" . $arr_attr->module_type . "'
                                      $add_pass";

        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        // $RS = $this->objsetup->CSI($Sql, $moduleForPermission, sr_AddPermission);

        $id2 = $this->Conn->Insert_ID();

        if ($RS)
            print $this->Conn->ErrorMsg();

        if ($id2 > 0) {
            $response['alt_contact_ack'] = 1;
            $response['alt_contact_error'] = NULL;
            $response['alt_contact_id'] = $id2;
        } else {
            $response['alt_contact_ack'] = 0;
            $response['alt_contact_error'] = 'Record not inserted!';
            $response['alt_contact_edit'] = 0;
        }

        return $response;
    }

    //-----------Alt Depot Module---------------------------

    function get_alt_depot_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $moduleForPermission = $this->objsetup->moduleDecider($attr['module_type'], $attr['acc_id']);
        $moduleForPermission = $moduleForPermission . "_locationtab";

        $Sql = " SELECT  d.*
                 From sr_alt_dept_sel d
                 WHERE d.id='" . $attr['id'] . "' and 
                       d.module_type = '".$attr['module_type']."' and 
                       d.acc_id = '".$attr['acc_id']."' and
                       d.company_id='" . $this->arrUser['company_id'] ."' ";

        // echo $Sql;exit;
        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, $moduleForPermission, sr_ViewPermission);

        $result2 = $this->get_alt_contacts($attr);
        $response['loc_contact'] = $result2['record']['result'];

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;

            $Sql2 ="SELECT c.contact_id
                    FROM alt_depot_contact c
                    where  c.status=1 and  c.acc_id='".$Row['acc_id']."'  and 
                            c.module_type='".$attr['module_type']."' and
                            c.location_id='" . $attr['id'] . "' and
                            c.company_id=" . $this->arrUser['company_id'] . " ";
            // echo $Sql2;exit;
            $RS2 = $this->objsetup->CSI($Sql2);
            // $RS2 = $this->objsetup->CSI($Sql2, $moduleForPermission, sr_ViewPermission);

            if ($RS2->RecordCount() > 0) 
            {
                while ($Row2 = $RS2->FetchRow()) 
                {
                    $result = array();
                    $result['id'] = $Row2['contact_id'];
                    $response['response']['ContactLoc'][] = $result;
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

    function getPrimaryContactLocAssigntotal($attr)
    {
        $where = '';
        if($attr['id']>0) $where = ' and contLoc.acc_id='.$attr['id'];

        $Sql = " SELECT  contLoc.id
                 FROM alt_depot_contact as contLoc
                 where contLoc.status=1 and 
                       contLoc.contact_id='" . $attr['primaryc_id'] . "' ".$where." ";
        //echo $Sql; exit;                 

        $RS = $this->objsetup->CSI($Sql);
        $showdata = $RS->RecordCount();
        $response['showdata'] = $showdata;

        return $response;
    }

    function get_alt_depots($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $moduleForPermission = $this->objsetup->moduleDecider($attr['module_type'], $attr['acc_id']);
        $moduleForPermission = $moduleForPermission . "_locationtab";

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

        if (!empty($attr['is_primary']))
            $where_type .= " AND c.is_primary  =1   ";

        if (!empty($attr['is_delivery_collection_address']))
            $where_type .= " AND ( c.is_delivery_collection_address  =1 OR is_default =1) ";
        
        if (!empty($attr['is_billing_address']))
            $where_type .= " AND c.is_billing_address  =1   ";

        $Sql = "SELECT c.*,
                       crm_region.title as region,
                       (SELECT nicename
                        FROM country
                        WHERE country.id = c.country
                        LIMIT 1) as countryName
                FROM sr_alt_dept_sel c
                left JOIN crm_region on crm_region.id=c.region_id
                where   c.status=1 and 
                        c.acc_id=".$acc_id." and 
                        c.module_type = '" . $attr['module_type'] . "' and 
                        c.depot<>'' and
                        c.company_id=" . $this->arrUser['company_id'] . "  
                        ".$where_type." ";

        /*c.contact_name, c.direct_line, c.mobile, c.email*/

        $order_type = "order by c.is_primary DESC,c.is_default DESC";

        if (!empty($attr['is_primary']) || !empty($attr['is_delivery_collection_address']) || !empty($attr['is_billing_address']))
            $total_limit = 1;
        else
            $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        // $RS = $this->objsetup->CSI($response['q']);

        
        $RS = $this->objsetup->CSI($response['q'], $moduleForPermission, sr_ViewPermission);

        $response['q'] = '';
        $response['ack'] = 1;
        $response['error'] = NULL;

        $record['num_rows'] = $total;

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                $result = array();
                $result['id'] = $Row['id'];
                $result['location'] = $Row['depot'];

                $address_type = "";

                if ($Row['is_billing_address'] > 0)
                    $address_type .= "Billing, ";

                if ($Row['is_invoice_address'] > 0)
                    $address_type .= "Payment, ";

                if ($Row['is_delivery_collection_address'] > 0) 
                {
                    if ($attr['module_type'] == 2)
                        $address_type .= "Collection, ";
                    else if ($attr['module_type'] == 1)
                        $address_type .= "Delivery, ";
                }

                $address_type = substr($address_type, 0, strlen($address_type) - 2);
                if (strlen($address_type) < 1) $address_type = " - ";

                //$result['region'] = $Row['region'];
                $result['address_1'] = $Row['address'];
                $result['address_2'] = $Row['address_2'];
                $result['city'] = $Row['city'];
                $result['county'] = $Row['county'];
                $result['postcode'] = $Row['postcode'];  
                $result['country'] = $Row['country'];
                $result['countryName'] = $Row['countryName'];
                $result['Location_type'] = $address_type;
                $result['is_primary'] = $Row['is_primary'];
                $result['is_default'] = $Row['is_default'];                

                if (!empty($attr['is_primary'])) {
                    $result['address_1'] = $Row['address'];
                    $result['address_2'] = $Row['address_2'];
                    $result['city'] = $Row['city'];
                    $result['county'] = $Row['county'];
                    $result['postcode'] = $Row['postcode'];
                    $result['depo_country_id'] = $Row['depo_country_id'];
                    $result['is_delivery_collection_address'] = $Row['is_delivery_collection_address'];
                    $result['is_invoice_address'] = $Row['is_invoice_address'];
                    $result['is_billing_address'] = $Row['is_billing_address'];
                    $result['country'] = $Row['country'];
                    $result['countryName'] = $Row['countryName'];
                }

                if(!empty($attr['is_delivery_collection_address']))
                {

                    $result['clcontact_name'] = $Row['clcontact_name'];
                    $result['cldirect_line'] = $Row['cldirect_line'];
                    $result['clphone'] = $Row['clphone'];
                    $result['clemail'] = $Row['clemail'];
                }
                $result['notes'] = $Row['booking_instructions'];
                $response['response'][] = $result;
                $record['results'][] = $result;
            }
            $ack = 1;
        } 
        else   
            $response['response'][] = array();

        return array('filters_dropdown' => $filters_dropdown, 
                     'columns' => $head, 
                     'filter_dict' => $filter_dict,
                     'filters' => $record['column_id'], 
                     'record' => array( 'total' => $response['total'], 
                                        'result' => $record['results'], 
                                        'response' => $record['response'], 
                                        'ack' => $ack));
        // return $response;
    }

    function get_alt_deliverDepots($attr)
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

        if (!empty($attr['is_primary']))
            $where_type .= " AND c.is_primary  =1   ";


        $Sql = "SELECT c.*,crm_region.title as region,country.nicename AS countryName
                FROM sr_alt_dept_sel c
                left JOIN crm_region on crm_region.id = c.region_id                
                LEFT JOIN country ON country.id = c.country
                where   c.status=1 and 
                        c.acc_id=".$acc_id." and 
                        c.module_type = '" . $attr['module_type'] . "' and 
                        c.depot<>'' and
                        c.is_delivery_collection_address=1 and
                        c.company_id=" . $this->arrUser['company_id'] . "  
                        ".$where_type." ";

        /*c.contact_name, c.direct_line, c.mobile, c.email*/

        //$order_type = "order by c.is_primary  DESC";
        
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        $response['q'] = '';
        $response['ack'] = 1;
        $response['error'] = NULL;

        $record['num_rows'] = $total;

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                $result = array();
                $result['id'] = $Row['id'];
                $result['location'] = $Row['depot'];

                $address_type = "";

                if ($Row['is_billing_address'] > 0)
                    $address_type .= "Billing, ";

                if ($Row['is_invoice_address'] > 0)
                    $address_type .= "Payment, ";

                if ($Row['is_delivery_collection_address'] > 0) 
                {
                    if ($attr['module_type'] == 2)
                        $address_type .= "Collection, ";
                    else if ($attr['module_type'] == 1)
                        $address_type .= "Delivery, ";
                }

                $address_type = substr($address_type, 0, strlen($address_type) - 2);
                if (strlen($address_type) < 1) $address_type = " - ";

                //$result['region'] = $Row['region'];
                $result['Location_type'] = $address_type;
                $result['address_1'] = $Row['address'];
                $result['address_2'] = $Row['address_2'];
                $result['city'] = $Row['city'];
                $result['county'] = $Row['county'];
                $result['postcode'] = $Row['postcode'];  
                $result['is_primary'] = $Row['is_primary'];
                $result['is_default'] = $Row['is_default'];
                $result['country_id'] = $Row['country'];
                $result['country'] = $Row['countryName'];


                $result['clcontact_name'] = $Row['clcontact_name'];                
                $result['clphone'] = $Row['clphone'];                
                $result['clemail'] = $Row['clemail'];                
                $result['clfax'] = $Row['clfax'];                
                $result['cldirect_line'] = $Row['cldirect_line'];                
                $result['contact_id'] = $Row['contact_id'];                

                if (!empty($attr['is_primary'])) {
                    $result['address_1'] = $Row['address'];
                    $result['address_2'] = $Row['address_2'];
                    $result['city'] = $Row['city'];
                    $result['county'] = $Row['county'];
                    $result['postcode'] = $Row['postcode'];
                    $result['depo_country_id'] = $Row['depo_country_id'];
                    $result['is_delivery_collection_address'] = $Row['is_delivery_collection_address'];
                    $result['is_invoice_address'] = $Row['is_invoice_address'];
                    $result['is_billing_address'] = $Row['is_billing_address'];
                    $result['country'] = $Row['country'];
                }
                $response['response'][] = $result;
                $record['results'][] = $result;
            }
            $ack = 1;
        } 
        else   
            $response['response'][] = array();

        return array('filters_dropdown' => $filters_dropdown, 
                     'columns' => $head, 
                     'filter_dict' => $filter_dict,
                     'filters' => $record['column_id'], 
                     'record' => array( 'total' => $response['total'], 
                                        'result' => $record['results'], 
                                        'response' => $record['response'], 
                                        'ack' => $ack));
        // return $response;
    }

    function add_alt_depot2($arr_attr, $response)
    {
        $attr = array();
        $attr = (array)$arr_attr; 
        $this->objGeneral->mysql_clean($attr);  

        $moduleForPermission = $this->objsetup->moduleDecider($attr['module_type'], $attr['acc_id']);
        $moduleForPermission = $moduleForPermission . "_locationtab";      

        $data_pass = "   tst.acc_id='" . $attr['acc_id'] . "' and tst.module_type='" . $attr['module_type'] . "' and tst.postcode='".$attr['postcode']."' and tst.depot='".$attr['depot']."'";
        $total = $this->objGeneral->count_duplicate_in_sql('alt_depot', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if (!empty($attr['is_primary']))
            $add_pass = ", is_primary=1 "; 
            
        if (($attr['is_billing_address'] != 0 || $attr['is_invoice_address'] != 0)) {

            $location_chk = $this->objGeneral->duplication_for_location_address_check($attr, $attr['acc_id'], $attr['module_type'], $this->arrUser['company_id']);

            if (strlen($location_chk) > 1) {
                $response['ack'] = '0';
                $response['error'] = $location_chk;
                return $response;
            }
        }        

        $region_id  = (isset($attr['region_ids']) && $attr['region_ids'] != '')? $attr['region_ids']: 0; 
        $country  = (isset($attr['country']) && $attr['country'] != '')? $attr['country']: 0; 

        $is_billing_address  = (isset($attr['is_billing_address']) && $attr['is_billing_address'] != '')? $attr['is_billing_address']: 0; 
        $is_delivery_collection_address  = (isset($attr['is_delivery_collection_address']) && $attr['is_delivery_collection_address'] != '')? $attr['is_delivery_collection_address']: 0; 
        $is_invoice_address  = (isset($attr['is_invoice_address']) && $attr['is_invoice_address'] != '')? $attr['is_invoice_address']: 0;   
        $address_2  = (isset($attr['address_2']) && $attr['address_2'] != '')? preg_replace("/[^a-zA-Z0-9`_.,;@#%~'\"\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-\s\\\\]+/", "", $attr['address_2']) : '';   

           
              
        $Sql = "INSERT INTO alt_depot
                                SET
                                    depot = '".$attr['depot']. "',
                                    module_type = '".$attr['module_type']. "',
                                    contact_name = '".$attr['contact_name']. "',
                                    address = '".preg_replace("/[^a-zA-Z0-9`_.,;@#%~'\"\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-\s\\\\]+/", "", $attr['address']). "',
                                    address_2 = '".$address_2. "',
                                    telephone = '".$attr['telephone']. "',
                                    city = '".$attr['city']. "',
                                    fax = '".$attr['fax']. "',
                                    county = '".$attr['county']. "',
                                    country = '".$country. "',
                                    mobile = '".$attr['mobile']. "',
                                    postcode = '".$attr['postcode']. "',
                                    direct_line = '".$attr['direct_line']. "',
                                    region_id = '".$region_id. "',
                                    email = '".$attr['email']. "',
                                    acc_id = '".$attr['acc_id']. "',
                                    booking_email = '".$attr['booking_email']. "',
                                    user_id = '" . $this->arrUser['id'] . "',
                                    company_id = '" . $this->arrUser['company_id'] . "',
                                    is_billing_address = '".$is_billing_address. "',
                                    is_delivery_collection_address = '".$is_delivery_collection_address. "',
                                    is_invoice_address = '".$is_invoice_address. "',
                                    AddedBy='".$this->arrUser['id']."',
                                    AddedOn=UNIX_TIMESTAMP (NOW()),
                                    gen_office_phone = '".$attr['phone']. "',
                                    gen_email_address = '".$attr['email']. "'
                                    $add_pass ";

        // echo $Sql; exit;

        
        // $RS = $this->objsetup->CSI($Sql, $moduleForPermission, sr_AddPermission);

        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        /* if (!empty($attr['is_primary']))
        {
            $Sql = "CALL SR_Update_Primary_Location('" .$id . "','" . $attr['acc_id'] . "','".$this->arrUser['company_id']  . "','" .$this->arrUser['id'] . "','" . $attr['module_type'] . "')";
            echo $Sql; exit;
            $RS = $this->objsetup->CSI($Sql);
        } */

        if ($id > 0) {
            $response['location_ack'] = 1;
            $response['location_error'] = NULL;
            $response['location_edit'] = 0;
            $response['alt_location_id'] = $id;
            $response['ack'] = 1;
        } else {
            $response['dept_ack'] = 0;
            $response['dept_error'] = 'Record not inserted!';
            $response['depot_edit'] = 0;
            $response['ack'] = 1;
        }
        return $response;
    }

    function add_alt_depot($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr); 

        $moduleForPermission = $this->objsetup->moduleDecider($arr_attr['module_type'], $arr_attr['acc_id']);
        $moduleForPermission = $moduleForPermission . "_locationtab";

        $data_pass = "  tst.acc_id='" . $arr_attr['acc_id'] . "'  and 
                        tst.postcode='$arr_attr[postcode]' and 
                        tst.depot='$arr_attr[depot]' and 
                        tst.module_type='" . $arr_attr['module_type'] . "' and 
                        tst.contact_name='$arr_attr[contact_name]' ";
        $total = $this->objGeneral->count_duplicate_in_sql('alt_depot', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if (($arr_attr['is_billing_address'] != 0 || $arr_attr['is_invoice_address'] != 0)) 
        {
            $location_chk = $this->objGeneral->check_duplication_for_location_address($arr_attr, $arr_attr['acc_id'], $arr_attr['module_type'], $this->arrUser['company_id'], $arr_attr['id'], 1);

            if (strlen($location_chk) > 1) {
                $response['ack'] = 0;
                $response['error'] = $location_chk;
                return $response;
            }
        }
        

        $region_id  = (isset($arr_attr['region_ids']) && $arr_attr['region_ids'] != '')? $arr_attr['region_ids']: 0;
        $country  = (isset($arr_attr['country']) && $arr_attr['country'] != '')? $arr_attr['country']: 0; 

        $is_billing_address  = (isset($arr_attr['is_billing_address']) && $arr_attr['is_billing_address'] != '')? $arr_attr['is_billing_address']: 0; 
        $is_delivery_collection_address  = (isset($arr_attr['is_delivery_collection_address']) && $arr_attr['is_delivery_collection_address'] != '')? $arr_attr['is_delivery_collection_address']: 0; 
        $is_invoice_address  = (isset($arr_attr['is_invoice_address']) && $arr_attr['is_invoice_address'] != '')? $arr_attr['is_invoice_address']: 0; 

        $telephone  = (isset($arr_attr['telephone']) && $arr_attr['telephone'] != '')? $arr_attr['telephone']: $arr_attr['phone'];          

        $Sql = "INSERT INTO alt_depot 
                                    SET  
                                        depot='$arr_attr[depot]', 
                                        module_type='" . $arr_attr['module_type'] . "', 
                                        pref_method_of_communication='$arr_attr[pref_method_of_communication]', 
                                        contact_name='$arr_attr[contact_name]',   
                                        role='$arr_attr[role]', 
                                        address='".preg_replace("/[^a-zA-Z0-9`_.,;@#%~'\"\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-\s\\\\]+/", "", $arr_attr['address'])."',  
                                        address_2='".preg_replace("/[^a-zA-Z0-9`_.,;@#%~'\"\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-\s\\\\]+/", "", $arr_attr['address_2'])."' ,  
                                        telephone='$telephone', 
                                        city='$arr_attr[city]',  
                                        fax='$arr_attr[fax]', 
                                        county='$arr_attr[county]',  
                                        country='$country',  
                                        mobile='$arr_attr[mobile]', 
                                        postcode='$arr_attr[postcode]', 
                                        direct_line='$arr_attr[direct_line]',
                                        region_id = '".$region_id. "', 
                                        email='$arr_attr[email]',   
                                        acc_id='$arr_attr[acc_id]',   
                                        alt_contact_id='$arr_attr[booking_contacts]',
                                        booking_instructions='$arr_attr[booking_instructions]', 
                                        booking_email='$arr_attr[booking_email]',  
                                        user_id='" . $this->arrUser['id'] . "',
                                        company_id='" . $this->arrUser['company_id'] . "', 
                                        is_billing_address='".$is_billing_address."',
                                        is_delivery_collection_address='".$is_delivery_collection_address."',     
                                        is_invoice_address='".$is_invoice_address."',  
                                        monday_start_time='" . $arr_attr['monday_start_time'] . "', 
                                        monday_end_time='" . $arr_attr['monday_end_time'] . "',     
                                        monday_notes='" . $arr_attr['monday_notes'] . "',  
                                        tuesday_start_time='" . $arr_attr['tuesday_start_time'] . "',  
                                        tuesday_end_time='" . $arr_attr['tuesday_end_time'] . "',    
                                        tuesday_notes='" . $arr_attr['tuesday_notes'] . "',  
                                        wednesday_start_time='" . $arr_attr['wednesday_start_time'] . "', 
                                        wednesday_end_time='" . $arr_attr['wednesday_end_time'] . "',  
                                        wednesday_notes='" . $arr_attr['wednesday_notes'] . "',
                                        thursday_start_time='" . $arr_attr['thursday_start_time'] . "',  
                                        thursday_end_time='" . $arr_attr['thursday_end_time'] . "', 
                                        thursday_notes='" . $arr_attr['thursday_notes'] . "', 
                                        friday_start_time='" . $arr_attr['friday_start_time'] . "', 
                                        friday_end_time='" . $arr_attr['friday_end_time'] . "' , 
                                        friday_notes='" . $arr_attr['friday_notes'] . "', 
                                        saturday_start_time='" . $arr_attr['saturday_start_time'] . "', 
                                        saturday_end_time='" . $arr_attr['saturday_end_time'] . "', 
                                        saturday_notes='" . $arr_attr['saturday_notes'] . "' , 
                                        sunday_start_time='" . $arr_attr['sunday_start_time'] . "',   
                                        sunday_end_time='" . $arr_attr['sunday_end_time'] . "', 
                                        sunday_notes='" . $arr_attr['sunday_notes'] . "',
                                        gen_office_phone='" . $arr_attr['phone'] . "',
                                        gen_email_address='" . $arr_attr['email'] . "',                                        
                                        AddedBy='".$this->arrUser['id']."',
                                        AddedOn=UNIX_TIMESTAMP (NOW())";
                                        
        // echo $Sql; exit;
        /*  contact_id='$arr_attr[contact_id]',
            type='".$arr_attr['type']."', 
         */
        $RS = $this->objsetup->CSI($Sql);
        // $RS = $this->objsetup->CSI($Sql, $moduleForPermission, sr_AddPermission);

        $id = $this->Conn->Insert_ID();

        if($arr_attr['is_primary']== 1)
        {
            $Sql = "CALL SR_Update_Primary_Location('" .$id . "','" . $arr_attr['acc_id'] . "','".$this->arrUser['company_id']  . "','" .$this->arrUser['id'] . "','" . $arr_attr['module_type'] . "')";
            $RS = $this->objsetup->CSI($Sql);
        }

        if($arr_attr['is_default']== 1)
        {
            $Sql = "CALL SR_UpdateDefaultLocation('" .$id . "','" . $arr_attr['acc_id'] . "','".$this->arrUser['company_id']  . "','" .$this->arrUser['id'] . "','" . $arr_attr['module_type'] . "')";
            $RS = $this->objsetup->CSI($Sql);
        } 

        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['edit'] = 0;
            $response['id'] = $id;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
            $response['edit'] = 0;
        }
        return $response;
    }

    function update_alt_depot($attr)
    {
        $arr_attr = array();
        $arr_attr = (array)$attr;

        $this->objGeneral->mysql_clean($arr_attr);

        $moduleForPermission = $this->objsetup->moduleDecider($arr_attr['module_type'], $arr_attr['acc_id']);
        $moduleForPermission = $moduleForPermission . "_locationtab";

        $id = 0;
        if (isset($arr_attr['alt_loc_id']))
            $id = $arr_attr['alt_loc_id'];
        else
            $id = $arr_attr['id'];

        if (!empty($arr_attr['is_primary']))
            $add_pass = ", is_primary=1 ";


        // && empty($arr_attr['is_primary'])
        if (($arr_attr['is_billing_address'] != 0 || $arr_attr['is_invoice_address'] != 0)) 
        {
            $location_chk = $this->objGeneral->check_duplication_for_location_address($arr_attr, $arr_attr['acc_id'], $arr_attr['module_type'], $this->arrUser['company_id'], $id, 0);

            if (strlen($location_chk) > 1) {
                $response['ack'] = 0;
                $response['error'] = $location_chk;
                return $response;
            }
        }  

        $region_id  = (isset($arr_attr['region_ids']) && $arr_attr['region_ids'] != '')? $arr_attr['region_ids']: 0;

        $is_billing_address  = (isset($arr_attr['is_billing_address']) && $arr_attr['is_billing_address'] != '')? $arr_attr['is_billing_address']: 0; 
        $is_delivery_collection_address  = (isset($arr_attr['is_delivery_collection_address']) && $arr_attr['is_delivery_collection_address'] != '')? $arr_attr['is_delivery_collection_address']: 0; 
        $is_invoice_address  = (isset($arr_attr['is_invoice_address']) && $arr_attr['is_invoice_address'] != '')? $arr_attr['is_invoice_address']: 0;  
        $is_default  = (isset($arr_attr['is_default']) && $arr_attr['is_default'] != '')? $arr_attr['is_default']: 0;  
        
        $telephone  = (isset($arr_attr['telephone']) && $arr_attr['telephone'] != '')? $arr_attr['telephone']: $arr_attr['phone']; 

        $shipment_method_id  = (isset($arr_attr['shipment_method']->id) && $arr_attr['shipment_method']->id != '')? $arr_attr['shipment_method']->id: 0;
        $target_amount  = (isset($arr_attr['target_amount']) && $arr_attr['target_amount'] != '')? $arr_attr['target_amount']: 0;

        $Sql = "UPDATE alt_depot  
                            SET  
                                acc_id='" . $arr_attr['acc_id'] . "',
                                depot='" . $arr_attr['depot'] . "',   
                                is_same_as_general='" . $arr_attr['is_same_as_general'] . "',   
                                pref_method_of_communication='" . $arr_attr['pref_method_of_communication'] . "', 
                                contact_name='" . $arr_attr['contact_name'] . "',
                                role='" . $arr_attr['role'] . "',
                                address='".preg_replace("/[^a-zA-Z0-9`_.,;@#%~'\"\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-\s\\\\]+/", "", $arr_attr['address'])."',
                                address_2='".preg_replace("/[^a-zA-Z0-9`_.,;@#%~'\"\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-\s\\\\]+/", "", $arr_attr['address_2'])."',
                                telephone='" . $telephone . "',
                                city='" . $arr_attr['city'] . "',
                                fax='" . $arr_attr['fax'] . "',
                                county='" . $arr_attr['county'] . "',
                                country='" . $arr_attr['country'] . "',
                                mobile='" . $arr_attr['mobile'] . "',
                                postcode='" . $arr_attr['postcode'] . "',
                                direct_line='" . $arr_attr['direct_line'] . "',
                                region_id = '".$region_id. "',
                                email='" . $arr_attr['email'] . "',
                                web_add='" . $arr_attr['web_add'] . "',
                                alt_contact_id='" . $arr_attr['booking_contacts'] . "',
                                booking_instructions='" . $arr_attr['booking_instructions'] . "',   
                                booking_email='" . $arr_attr['booking_email'] . "' ,
                                is_billing_address='" . $is_billing_address . "',
                                is_delivery_collection_address='" . $is_delivery_collection_address . "',
                                is_invoice_address='" . $is_invoice_address . "',
                                monday_start_time='" . $arr_attr['monday_start_time'] . "',
                                monday_end_time='" . $arr_attr['monday_end_time'] . "',
                                monday_notes='" . $arr_attr['monday_notes'] . "',
                                tuesday_start_time='" . $arr_attr['tuesday_start_time'] . "',
                                tuesday_end_time='" . $arr_attr['tuesday_end_time'] . "',
                                tuesday_notes='" . $arr_attr['tuesday_notes'] . "',
                                wednesday_start_time='" . $arr_attr['wednesday_start_time'] . "',
                                wednesday_end_time='" . $arr_attr['wednesday_end_time'] . "',
                                wednesday_notes='" . $arr_attr['wednesday_notes'] . "',
                                thursday_start_time='" . $arr_attr['thursday_start_time'] . "',
                                thursday_end_time='" . $arr_attr['thursday_end_time'] . "',
                                thursday_notes='" . $arr_attr['thursday_notes'] . "',
                                friday_start_time='" . $arr_attr['friday_start_time'] . "',
                                friday_end_time='" . $arr_attr['friday_end_time'] . "' ,
                                friday_notes='" . $arr_attr['friday_notes'] . "',
                                saturday_start_time='" . $arr_attr['saturday_start_time'] . "',
                                saturday_end_time='" . $arr_attr['saturday_end_time'] . "',
                                saturday_notes='" . $arr_attr['saturday_notes'] . "' ,
                                sunday_start_time='" . $arr_attr['sunday_start_time'] . "',
                                sunday_end_time='" . $arr_attr['sunday_end_time'] . "',    
                                sunday_notes='" . $arr_attr['sunday_notes'] . "',    
                                gen_office_phone='" . $arr_attr['phone'] . "',   
                                gen_email_address='" . $arr_attr['email'] . "' ,
                                shipment_method_id='" . $shipment_method_id . "' ,   
                                target_amount='" . $target_amount . "'
                                WHERE   id = '" . $id . "' and 
                                        acc_id= '" . $arr_attr['acc_id'] . "' and 
                                        company_id='" . $this->arrUser['company_id'] . "' and 
                                        module_type='" . $arr_attr['module_type'] . "'  
                                limit 1";
                                

        // print_r($Sql); exit;
        // $response = $this->objGeneral->any_query_exception($Sql);
        // $response = $this->objsetup->CSI($Sql, $moduleForPermission, sr_EditPermission);
        $response = $this->objsetup->CSI($Sql);
        $response99['ack'] = 1;
        $response99['error'] = NULL;
        $response = $response99;

        if($arr_attr['is_primary']== 1)
        {
            $Sql = "CALL SR_Update_Primary_Location('" .$id . "','" . $arr_attr['acc_id'] . "','".$this->arrUser['company_id']  . "','" .$this->arrUser['id'] . "','" . $arr_attr['module_type'] . "')";
            $RS = $this->objsetup->CSI($Sql);
        }

        if($arr_attr['is_default']== 1)
        {
            $Sql = "CALL SR_UpdateDefaultLocation('" .$id . "','" . $arr_attr['acc_id'] . "','".$this->arrUser['company_id']  . "','" .$this->arrUser['id'] . "','" . $arr_attr['module_type'] . "')";
            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
        }
        return $response;
    }

    function update_alt_depot2($attr, $response)
    {
        $arr_attr = array();
        $arr_attr = (array)$attr;
        $this->objGeneral->mysql_clean($arr_attr);

        $moduleForPermission = $this->objsetup->moduleDecider($arr_attr['module_type'], $arr_attr['acc_id']);          

        $moduleForPermission = $moduleForPermission . "_locationtab";

        $id = 0;
        if (isset($arr_attr['alt_loc_id']))
            $id = $arr_attr['alt_loc_id'];
        else
            $id = $arr_attr['id'];        


        if (($arr_attr['is_billing_address'] != 0 || $arr_attr['is_invoice_address'] != 0)) 
        {
            $location_chk = $this->objGeneral->check_duplication_for_location_address($arr_attr, $arr_attr['acc_id'],$arr_attr['module_type'], $this->arrUser['company_id'], $id, 0);

            if (strlen($location_chk) > 1) {
                $response['ack'] = '2';
                $response['error'] = $location_chk;
                return $response;
            }
        }          

        $region_id  = (isset($arr_attr['region_ids']) && $arr_attr['region_ids'] != '')? $arr_attr['region_ids']: 0;

        $is_billing_address  = (isset($arr_attr['is_billing_address']) && $arr_attr['is_billing_address'] != '')? $arr_attr['is_billing_address']: 0; 
        $is_delivery_collection_address  = (isset($arr_attr['is_delivery_collection_address']) && $arr_attr['is_delivery_collection_address'] != '')? $arr_attr['is_delivery_collection_address']: 0; 
        $is_invoice_address  = (isset($arr_attr['is_invoice_address']) && $arr_attr['is_invoice_address'] != '')? $arr_attr['is_invoice_address']: 0; 
        
        $Sqlu = "UPDATE alt_depot  
                                SET
                                    depot = '".$arr_attr['depot']. "',
                                    module_type = '".$arr_attr['module_type']. "',
                                    contact_name = '".$arr_attr['contact_name']. "',
                                    address = '".preg_replace("/[^a-zA-Z0-9`_.,;@#%~'\"\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-\s\\\\]+/", "", $arr_attr['address'])."',
                                    address_2 = '".preg_replace("/[^a-zA-Z0-9`_.,;@#%~'\"\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-\s\\\\]+/", "", $arr_attr['address_2'])."',
                                    telephone = '".$arr_attr['telephone']. "',
                                    city = '".$arr_attr['city']. "',
                                    fax = '".$arr_attr['fax']. "',
                                    county = '".$arr_attr['county']. "',
                                    country = '".$arr_attr['country']. "',
                                    mobile = '".$arr_attr['mobile']. "',
                                    postcode = '".$arr_attr['postcode']. "',
                                    direct_line = '".$arr_attr['direct_line']. "',
                                    region_id = '".$region_id. "',
                                    email = '".$arr_attr['email']. "',
                                    acc_id = '".$arr_attr['acc_id']. "',
                                    booking_email = '".$arr_attr['booking_email']. "',
                                    user_id = '" . $this->arrUser['id'] . "',
                                    company_id = '" . $this->arrUser['company_id'] . "',
                                    is_billing_address = '".$is_billing_address. "',
                                    is_delivery_collection_address = '".$is_delivery_collection_address. "',
                                    is_invoice_address = '".$is_invoice_address. "',
                                    gen_office_phone = '".$arr_attr['phone']. "',
                                    gen_email_address = '".$arr_attr['email']. "'                                                                     
                                WHERE   id = '" . $id . "' and   
                                        acc_id= '" . $arr_attr['acc_id'] . "' and   
                                        company_id='" . $this->arrUser['company_id'] . "' and 
                                        module_type='" . $arr_attr['module_type'] . "'  
                                limit 1";
                                    
        // print_r($Sqlu); exit;
        
        $rc = $this->objsetup->CSI($Sqlu);
        // $rc = $this->objsetup->CSI($Sqlu, $moduleForPermission, sr_EditPermission);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['alt_location_ack'] = 1;
            $response['alt_location_error'] = NULL;
            $response['alt_location_id'] = $id;
        }
        return $response;
    }

    //----------------- SRM Price Offer-----------------------------------

    // price module predata api for add form
    function price_form_predata($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $SqlOfferMethod = " SELECT   c.id, c.title  
                            FROM  crm_offer_method  c
                            where  c.status=1 and c.type=2 and
                                   c.company_id=" . $this->arrUser['company_id'];

        //    echo $SqlOfferMethod; exit;
        $RSOfferMethod = $this->objsetup->CSI($SqlOfferMethod);

        if ($RSOfferMethod->RecordCount() > 0) {
            while ($Row = $RSOfferMethod->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['title'] = $Row['title'];
                $response['response']['OfferMethod'][] = $result;
            }
        } else{
            $response['response']['OfferMethod'][]= array(); 
        }      
        $response['ack'] = 1;
        $response['error'] = NULL;
        return $response;
    }

    function update_product_values($arr_attr)
    {
        // 	echo '<pre>'; print_r($arr_attr); exit;
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

        $product_id = $arr_attr->product_id;
        $srm_id = $arr_attr->srm_id;
        $tab_change = 'tab_supplier';
        $sp_id = $arr_attr->sp_id;
        if ($sp_id == 0) {// ,volume_1=1  
            $Sql1 = "INSERT INTO srm_volume_discount SET
											 product_id='" . $product_id . "'
											 ,supplier_id='" . $srm_id . "' 
											 ,volume_id='" . $arr_attr->volume_1s . "'  
											
											 ,supplier_type='" . $arr_attr->supplier_type_1s . "'  
											 ,purchase_price='" . $arr_attr->purchase_price_1 . "' 
											,discount_value='" . $arr_attr->discount_value_1 . "'  
											 ,discount_price='" . $arr_attr->discount_price_1 . "' 
									 		,price_list_id='" . $arr_attr->price_list_id . "' 
											,start_date=  '" . $this->objGeneral->convert_date($attr['start_date']) . "'
											,end_date=  '" . $this->objGeneral->convert_date($attr['end_date']) . "'
												,status='1'  
											,company_id='" . $this->arrUser['company_id'] . "' 
											,user_id='" . $this->arrUser['id'] . "'
											,date_added='" . current_date . "'";
            //	echo $Sql1;exit;

            if ($arr_attr->volume_1s != NULL)
                $RS = $this->objsetup->CSI($Sql1);

            $Sql2 = "INSERT INTO srm_volume_discount SET
											product_id='" . $product_id . "'
											,supplier_id='" . $srm_id . "' 
											 ,volume_id='" . $arr_attr->volume_2s . "'  
											,supplier_type='" . $arr_attr->supplier_type_2s . "'  
											 ,purchase_price='" . $arr_attr->purchase_price_2 . "' 
											,discount_value='" . $arr_attr->discount_value_2 . "'  
											 ,discount_price='" . $arr_attr->discount_price_2 . "' 
									 		,price_list_id='" . $arr_attr->price_list_id . "' 
									 		,start_date=  '" . $this->objGeneral->convert_date($attr['start_date']) . "'
											,end_date= '" . $this->objGeneral->convert_date($attr['end_date']) . "'
												,status='1'  
											,company_id='" . $this->arrUser['company_id'] . "' 
											,user_id='" . $this->arrUser['id'] . "'
											,date_added='" . current_date . "'";
            if ($arr_attr->volume_2s != NULL)
                $RS = $this->objsetup->CSI($Sql2);

            $Sql3 = "INSERT INTO srm_volume_discount SET
											product_id='" . $product_id . "'
											,supplier_id='" . $srm_id . "'   
											 ,volume_id='" . $arr_attr->volume_3s . "'   
											,supplier_type='" . $arr_attr->supplier_type_3s . "'  
											 ,purchase_price='" . $arr_attr->purchase_price_3 . "' 
											,discount_value='" . $arr_attr->discount_value_3 . "'  
											 ,discount_price='" . $arr_attr->discount_price_3 . "' 
											,price_list_id='" . $arr_attr->price_list_id . "' 
											,start_date= '" . $this->objGeneral->convert_date($attr['start_date']) . "'
											 ,end_date=   '" . $this->objGeneral->convert_date($attr['end_date']) . "'
											,status='1'  
											,company_id='" . $this->arrUser['company_id'] . "' 
											,user_id='" . $this->arrUser['id'] . "'
											,date_added='" . current_date . "'";
            if ($arr_attr->volume_3s != NULL)
                $RS = $this->objsetup->CSI($Sql3);
            $new = 'Add';
            $new_msg = 'Inserted';
        } else {
            $Sql1 = "UPDATE srm_volume_discount SET
				 purchase_price='" . $arr_attr->purchase_price_11 . "'  
				,discount_value='" . $arr_attr->discount_value_11 . "'
				,discount_price='" . $arr_attr->discount_price_11 . "'  
				,supplier_type='" . $arr_attr->supplier_types . "' 
				WHERE id = " . $sp_id . "   Limit 1";
            //echo  $Sql1;exit;

            $RS = $this->objsetup->CSI($Sql1);
        }

        if ($product_id > 0) {
            $response['product_id'] = $product_id;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['msg'] = $message;
            $response['info'] = $new;
            $response['tab_change'] = $tab_change;

            
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);

        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated';
            $response['msg'] = $message;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record not updated';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }

        return $response;
    }

    function get_method($attr)
    {
        $response = array();
        return $response;

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";


        $response = array();

        $Sql = "SELECT   c.id, c.name FROM  get_method  c 
		where c.status=1 and   c.type=1   
		and c.company_id=" . $this->arrUser['company_id'] . "		 
		group by  c.name ";

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

    function add_method($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        //print_r($arr_attr);exit;
        $id = $attr->id;

        $update_check = "";

        if ($id > 0)
            $update_check = "  AND tst.id <> '" . $id . "'";

        $data_pass = "  tst.name='" . $attr->name . "'  and tst.type=1 and tst.status=1 ".$update_check." ";
        $total = $this->objGeneral->count_duplicate_in_sql('get_method', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($id == 0) {

            $Sql = "INSERT INTO get_method SET
									type=1,status=1,
									name='" . $attr->name . "', 
									company_id='" . $this->arrUser['company_id'] . "',
									user_id='" . $this->arrUser['id'] . "'	";
            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
            // }
        } else {
            $Sql = "UPDATE brand SET  
									 name='" . $attr->name . "' 
									WHERE id = " . $id . "   Limit 1";
            $RS = $this->objsetup->CSI($Sql);
        }
        //	echo $Sql;exit;

        if ($id > 0) {
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

    function get_shipping_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";
        $response = array();

        $Sql = "SELECT   c.id, c.name  
                FROM  get_method  c 
                where c.status=1 and   c.type=2   
                and c.company_id=" . $this->arrUser['company_id'] . "	 
                group by  c.name ";

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

    function get_areas($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $page = (isset($attr['page'])) ? $attr['page'] : 1;
        $start_limit = ($page - 1) * 20;
        $end_limit = $page * 20;

        $response = array();

        $Sql = "SELECT ar.id, ar.postcode_sector, ar.name, ar1.county, ar2.region, ar3.country FROM areas ar 
                    inner join areas_county ar1 on ar.county = ar1.id
                    inner join areas_region ar2 on ar.region = ar2.id
                    inner join areas_country ar3 on ar.country = ar3.id WHERE ar.status=1 ".$keyword_clause." ";

        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'ar');
        //echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['postcode'] = $Row['postcode_sector'];
                $result['name'] = $Row['name'];
                $result['county'] = $Row['county'];
                $result['region'] = $Row['region'];
                $result['country'] = $Row['country'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_countries($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $page = (isset($attr['page'])) ? $attr['page'] : 1;
        $start_limit = ($page - 1) * 20;
        $end_limit = $page * 20;
        $response = array();

        $Sql = "SELECT ar.id, ar.country FROM areas_country ar "
            . "WHERE ar.status=1 ".$keyword_clause." ";

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['total'] = $total;
            $totalPages = ceil($total / pagination_limit);
            $response['total_pages'] = $totalPages;
            $response['cpage'] = $page;
            $response['ppage'] = $page - 1;
            $response['npage'] = $page + 1;
            $response['pages'] = array();
            if ($page == 1 || $page == 2) {
                for ($i = 1; $i <= $totalPages; $i++) {
                    $response['pages'][] = $i;
                    if ($i == 5) {
                        break;
                    }
                }
            } else if ($page == $totalPages - 1 || $page == $totalPages) {
                for ($i = $page - 2, $j = 1; $i <= $totalPages; $i++, $j++) {
                    $response['pages'][] = $i;
                    if ($j == 5) {
                        break;
                    }
                }
            } else if ($totalPages >= 5) {
                $response['pages'] = array($page - 2, $page - 1, $page, $page + 1, $page + 2);
            }
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['country'] = $Row['country'];
                $response['response'][] = $result;
            }
            if (COUNT($response['response']) > 0) {
                $SqlCount = "SELECT sal.cover_area_id as cid FROM srm_agent_area_list sal "
                    . "INNER JOIN company on company.id=sal.company_id "
                    . "WHERE sal.cover_area_id in (";
                for ($i = 0; $i < COUNT($response['response']) - 1; $i++) {
                    $SqlCount .= $response['response'][$i]['id'] . ",";
                }
                $SqlCount .= $response['response'][COUNT($response['response']) - 1]['id'] . ") AND sal.status=1 AND sal.user_id=" . $this->arrUser['id'] . " AND sal.type=1 AND sal.srm_id=" . $attr['id'] . " AND ";
                $SqlCount .= "( sal.company_id=" . $this->arrUser['company_id'] . " 
			or  company.parent_id=" . $this->arrUser['company_id'] . ")
			order by sal.cover_area_id DESC";
                // echo $SqlCount;
                $RS = $this->objsetup->CSI($SqlCount);
                if ($RS->RecordCount() > 0) {
                    while ($Row = $RS->FetchRow()) {
                        $response['countries'][] = $Row['cid'];
                    }
                }
            }
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = "No Record found.";
        }

        return $response;
    }

    function get_regions($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $page = (isset($attr['page'])) ? $attr['page'] : 1;
        $start_limit = ($page - 1) * 20;
        $end_limit = $page * 20;

        $limit_clause = " LIMIT $start_limit, $end_limit ";
        $order_clause = " ORDER BY ar.region ASC";
        $keyword_clause = "";

        $response = array();

        $SqlCheck = "SELECT DISTINCT sal2.cover_area_id FROM srm_agent_area_list sal2 "
            . "INNER JOIN company ON company.id=sal2.company_id "
            . " WHERE sal2.status=1 and sal2.type=1 and sal2.srm_id=" . $attr['id'] . " AND sal2.user_id=" . $this->arrUser['id'] . " AND"
            . "( sal2.company_id=" . $this->arrUser['company_id'] . "
			or  company.parent_id=" . $this->arrUser['company_id'] . ") Limit 1";

        $sql_check_total = "SELECT COUNT(*) as total FROM ($SqlCheck) as tabless";
        $rs_check_count = $this->objsetup->CSI($sql_check_total);

        $Sql = "";
        if ($rs_check_count->fields['total'] > 0) {
            $Sql = "SELECT DISTINCT ar.id, ar.region FROM areas_region ar "
                . " INNER JOIN areas ars on ars.region=ar.id "
                . " INNER JOIN srm_agent_area_list sal1 on sal1.cover_area_id=ars.country"
                . " WHERE sal1.status=1 and sal1.type=1 and sal1.srm_id=" . $attr['id'] . " and ar.status=1 $keyword_clause";
        } else {
            $Sql = "SELECT DISTINCT ar.id, ar.region FROM areas_region ar "
                . " WHERE ar.status=1 $keyword_clause";
        }


        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['total'] = $total;
            $totalPages = ceil($total / pagination_limit);
            $response['total_pages'] = $totalPages;
            $response['cpage'] = $page;
            $response['ppage'] = $page - 1;
            $response['npage'] = $page + 1;
            $response['pages'] = array();
            if ($page == 1 || $page == 2) {
                for ($i = 1; $i <= $totalPages; $i++) {
                    $response['pages'][] = $i;
                    if ($i == 5) {
                        break;
                    }
                }
            } else if ($page == $totalPages - 1 || $page == $totalPages) {
                for ($i = $page - 2, $j = 1; $i <= $totalPages; $i++, $j++) {
                    $response['pages'][] = $i;
                    if ($j == 5) {
                        break;
                    }
                }
            } else if ($totalPages >= 5) {
                $response['pages'] = array($page - 2, $page - 1, $page, $page + 1, $page + 2);
            }
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['region'] = $Row['region'];
                $response['response'][] = $result;
            }
            if (COUNT($response['response']) > 0) {

                $SqlCount = "SELECT sal.cover_area_id as cid FROM srm_agent_area_list sal "
                    . "INNER JOIN company on company.id=sal.company_id "
                    . "WHERE sal.cover_area_id in (";

                for ($i = 0; $i < COUNT($response['response']) - 1; $i++) {
                    $SqlCount .= $response['response'][$i]['id'] . ",";
                }

                $SqlCount .= $response['response'][COUNT($response['response']) - 1]['id'] . ") AND sal.status=1 AND sal.user_id=" . $this->arrUser['id'] . " AND sal.type=2 AND sal.srm_id=" . $attr['id'] . " AND ";
                $SqlCount .= "( sal.company_id=" . $this->arrUser['company_id'] . " 
			or  company.parent_id=" . $this->arrUser['company_id'] . ")
			order by sal.cover_area_id DESC";

                // echo $SqlCount;
                $RS = $this->objsetup->CSI($SqlCount);
                if ($RS->RecordCount() > 0) {
                    while ($Row = $RS->FetchRow()) {
                        $response['regions'][] = $Row['cid'];
                    }
                }
            }
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = "No Record found.";
        }

        return $response;
    }

    function get_counties($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $page = (isset($attr['page'])) ? $attr['page'] : 1;
        $start_limit = ($page - 1) * 20;
        $end_limit = $page * 20;

        $limit_clause = " LIMIT $start_limit, $end_limit ";
        $order_clause = " ORDER BY ar.county ASC";
        $keyword_clause = "";
        if (!empty($attr['county_keyword']) && $attr['county_keyword'] != "") {
            $keyword_clause .= " AND (ar.county LIKE '%$attr[county_keyword]%') ";
        }
        if (empty($attr['all'])) {
            if (empty($attr['start']))
                $attr['start'] = 0;
            if (empty($attr['limit']))
                $attr['limit'] = 10;
            //$limit_clause = " LIMIT $attr[start] , $attr[limit]";
        }
        $response = array();

        $SqlCheck = "SELECT DISTINCT sal2.cover_area_id FROM srm_agent_area_list sal2 "
            . "INNER JOIN company ON company.id=sal2.company_id "
            . " WHERE sal2.status=1 and sal2.type=2 and sal2.srm_id=" . $attr['id'] . " AND sal2.user_id=" . $this->arrUser['id'] . " AND"
            . "( sal2.company_id=" . $this->arrUser['company_id'] . "
			or  company.parent_id=" . $this->arrUser['company_id'] . ") Limit 1";

        $sql_check_total = "SELECT COUNT(*) as total FROM ($SqlCheck) as tabless";
        $rs_check_count = $this->objsetup->CSI($sql_check_total);

        $Sql = "";
        if ($rs_check_count->fields['total'] > 0) {
            $Sql = "SELECT DISTINCT ar.id, ar.county FROM areas_county ar "
                . " INNER JOIN areas ars on ars.county=ar.id "
                . " INNER JOIN srm_agent_area_list sal1 on sal1.cover_area_id=ars.region"
                . " WHERE sal1.status=1 and sal1.type=2 and sal1.srm_id=" . $attr['id'] . " and ar.status=1 $keyword_clause";
        } else {
            $Sql = "SELECT DISTINCT ar.id, ar.county FROM areas_county ar "
                . " WHERE ar.status=1 $keyword_clause";
        }


        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['total'] = $total;
            $totalPages = ceil($total / pagination_limit);
            $response['total_pages'] = $totalPages;
            $response['cpage'] = $page;
            $response['ppage'] = $page - 1;
            $response['npage'] = $page + 1;
            $response['pages'] = array();
            if ($page == 1 || $page == 2) {
                for ($i = 1; $i <= $totalPages; $i++) {
                    $response['pages'][] = $i;
                    if ($i == 5) {
                        break;
                    }
                }
            } else if ($page == $totalPages - 1 || $page == $totalPages) {
                for ($i = $page - 2, $j = 1; $i <= $totalPages; $i++, $j++) {
                    $response['pages'][] = $i;
                    if ($j == 5) {
                        break;
                    }
                }
            } else if ($totalPages >= 5) {
                $response['pages'] = array($page - 2, $page - 1, $page, $page + 1, $page + 2);
            }
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['county'] = $Row['county'];
                $response['response'][] = $result;
            }
            if (COUNT($response['response']) > 0) {
                $SqlCount = "SELECT sal.cover_area_id as cid FROM srm_agent_area_list sal "
                    . "INNER JOIN company on company.id=sal.company_id "
                    . "WHERE sal.cover_area_id in (";
                for ($i = 0; $i < COUNT($response['response']) - 1; $i++) {
                    $SqlCount .= $response['response'][$i]['id'] . ",";
                }

                $SqlCount .= $response['response'][COUNT($response['response']) - 1]['id'] . ") AND sal.status=1 AND sal.user_id=" . $this->arrUser['id'] . " AND sal.type=3 AND sal.srm_id=" . $attr['id'] . " AND ";
                $SqlCount .= "( sal.company_id=" . $this->arrUser['company_id'] . " 
			or  company.parent_id=" . $this->arrUser['company_id'] . ")
			order by sal.cover_area_id DESC";

                // echo $SqlCount;
                $RS = $this->objsetup->CSI($SqlCount);
                if ($RS->RecordCount() > 0) {
                    while ($Row = $RS->FetchRow()) {
                        $response['counties'][] = $Row['cid'];
                    }
                }
            }
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = "No Record found.";
        }

        return $response;
    }

    function get_areas1($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $page = (isset($attr['page'])) ? $attr['page'] : 1;
        $start_limit = ($page - 1) * 20;
        $end_limit = $page * 20;

        $limit_clause = " LIMIT ".$start_limit.",".$end_limit." ";
        $order_clause = " ORDER BY ar.name ASC";
        $keyword_clause = "";
        if (!empty($attr['name_keyword']) && $attr['name_keyword'] != "") {
            $keyword_clause .= " AND (ar.name LIKE '%".$attr['name_keyword']."%') ";
        }

        $response = array();

        $SqlCheck = "SELECT DISTINCT sal2.cover_area_id FROM srm_agent_area_list sal2 "
            . "INNER JOIN company ON company.id=sal2.company_id "
            . " WHERE sal2.status=1 and sal2.type=3 and sal2.srm_id=" . $attr['id'] . " AND sal2.user_id=" . $this->arrUser['id'] . " AND "
            . "( sal2.company_id=" . $this->arrUser['company_id'] . "
			or  company.parent_id=" . $this->arrUser['company_id'] . ") Limit 1";

        $sql_check_total = "SELECT COUNT(*) as total FROM (".$SqlCheck.") as tabless";
        $rs_check_count = $this->objsetup->CSI($sql_check_total);

        $Sql = "";
        if ($rs_check_count->fields['total'] > 0) {
            $Sql = "SELECT DISTINCT ar.id, ar.name, ar.postcode_sector FROM areas ar "
                . " INNER JOIN srm_agent_area_list sal1 on sal1.cover_area_id=ar.county"
                . " WHERE sal1.status=1 and sal1.type=3 and sal1.srm_id=" . $attr['id'] . " and ar.status=1 ".$keyword_clause." ";
        } else {
            $Sql = "SELECT DISTINCT ar.id, ar.name, ar.postcode_sector FROM areas ar "
                . " WHERE ar.status=1 ".$keyword_clause." ";
        }


        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['total'] = $total;
            $totalPages = ceil($total / pagination_limit);
            $response['total_pages'] = $totalPages;
            $response['cpage'] = $page;
            $response['ppage'] = $page - 1;
            $response['npage'] = $page + 1;
            $response['pages'] = array();
            if ($page == 1 || $page == 2) {
                for ($i = 1; $i <= $totalPages; $i++) {
                    $response['pages'][] = $i;
                    if ($i == 5) {
                        break;
                    }
                }
            } else if ($page == $totalPages - 1 || $page == $totalPages) {
                for ($i = $page - 2, $j = 1; $i <= $totalPages; $i++, $j++) {
                    $response['pages'][] = $i;
                    if ($j == 5) {
                        break;
                    }
                }
            } else if ($totalPages >= 5) {
                $response['pages'] = array($page - 2, $page - 1, $page, $page + 1, $page + 2);
            }
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['postcode'] = $Row['postcode_sector'];
                $response['response'][] = $result;
            }
            if (COUNT($response['response']) > 0) {
                $SqlCount = "SELECT sal.cover_area_id as cid FROM srm_agent_area_list sal "
                    . "INNER JOIN company on company.id=sal.company_id "
                    . "WHERE sal.cover_area_id in (";
                for ($i = 0; $i < COUNT($response['response']) - 1; $i++) {
                    $SqlCount .= $response['response'][$i]['id'] . ",";
                }
                $SqlCount .= $response['response'][COUNT($response['response']) - 1]['id'] . ") AND sal.status=1 AND sal.user_id=" . $this->arrUser['id'] . " AND sal.type=4 AND sal.srm_id=" . $attr['id'] . " AND ";
                $SqlCount .= "( sal.company_id=" . $this->arrUser['company_id'] . " 
			or  company.parent_id=" . $this->arrUser['company_id'] . ")
			order by sal.cover_area_id DESC";
                // echo $SqlCount;
                $RS = $this->objsetup->CSI($SqlCount);
                if ($RS->RecordCount() > 0) {
                    while ($Row = $RS->FetchRow()) {
                        $response['areas'][] = $Row['cid'];
                    }
                }
            }
        } else {
            $response['ack'] = 0;
            $response['error'] = "No Record found.";
            $response['response'][] = array();
        }

        return $response;
    }

    function get_sale_areas($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $page = (isset($attr['page'])) ? $attr['page'] : 1;
        $start_limit = ($page - 1) * 20;
        $end_limit = $page * 20;

        $limit_clause = " LIMIT $start_limit, $end_limit ";
        $order_clause = " ORDER BY ar.name ASC";
        $keyword_clause = "";
        if (!empty($attr['keyword']) && $attr['keyword'] != "") {
            $keyword_clause .= " AND (ar.postcode_sector LIKE '%$attr[keyword]%'  OR ar.name LIKE '%$attr[keyword]%' OR ar1.county LIKE '%$attr[keyword]%' "
                . "OR ar2.region LIKE '%$attr[keyword]%' OR ar3.country LIKE '%$attr[keyword]%') ";
        }

        $response = array();

        $Sql = "SELECT DISTINCT ar.id, ar.postcode_sector, ar.name, ar1.county, ar2.region, ar3.country FROM areas ar 
                    inner join areas_county ar1 on ar.county = ar1.id
                    inner join areas_region ar2 on ar.region = ar2.id
                    inner join areas_country ar3 on ar.country = ar3.id
                    inner join srm_agent_area_list al on al.cover_area_id=ar.id
                    inner join company on company.id=al.company_id
                    WHERE ar.status=1 and ar1.status=1 and ar2.status=1 and ar3.status=1 and al.status=1 and al.type=4 and al.user_id=" . $this->arrUser['id'] . " and al.srm_id='".$attr['id']."' and "
            . "( al.company_id=" . $this->arrUser['company_id'] . "
			or  company.parent_id=" . $this->arrUser['company_id'] . ") $keyword_clause";

        if ($total == 0) {
            $Sql = "SELECT DISTINCT ar.id, ar.postcode_sector, ar.name, ar1.county, ar2.region, ar3.country FROM areas ar 
                    inner join areas_county ar1 on ar.county = ar1.id 
                    inner join areas_region ar2 on ar.region = ar2.id
                    inner join areas_country ar3 on ar.country = ar3.id
                    inner join srm_agent_area_list al on al.cover_area_id=ar1.id
                    inner join company on company.id=al.company_id
                    WHERE ar.status=1 and ar1.status=1 and ar2.status=1 and ar3.status=1 and al.status=1 and al.type=3 and al.user_id=" . $this->arrUser['id'] . " and al.srm_id='".$attr['id']."' and "
                . "( al.company_id=" . $this->arrUser['company_id'] . "
			or  company.parent_id=" . $this->arrUser['company_id'] . ") $keyword_clause";

            if ($total == 0) {
                $Sql = "SELECT DISTINCT ar.id, ar.postcode_sector, ar.name, ar1.county, ar2.region, ar3.country FROM areas ar 
                    inner join areas_county ar1 on ar.county = ar1.id
                    inner join areas_region ar2 on ar.region = ar2.id
                    inner join areas_country ar3 on ar.country = ar3.id                    
                    inner join srm_agent_area_list al on al.cover_area_id=ar2.id
                    inner join company on company.id=al.company_id
                    WHERE ar.status=1 and ar1.status=1 and ar2.status=1 and ar3.status=1 and al.status=1 and al.type=2 and al.user_id=" . $this->arrUser['id'] . " and al.srm_id='".$attr['id']."' and "
                    . "( al.company_id=" . $this->arrUser['company_id'] . "
			or  company.parent_id=" . $this->arrUser['company_id'] . ") $keyword_clause";

                if ($total == 0) {
                    $Sql = "SELECT DISTINCT ar.id, ar.postcode_sector, ar.name, ar1.county, ar2.region, ar3.country FROM areas ar 
                    inner join areas_county ar1 on ar.county = ar1.id
                    inner join areas_region ar2 on ar.region = ar2.id
                    inner join areas_country ar3 on ar.country = ar3.id                   
                    inner join srm_agent_area_list al on al.cover_area_id=ar3.id
                    inner join company on company.id=al.company_id
                    WHERE ar.status=1 and ar1.status=1 and ar2.status=1 and ar3.status=1 and al.status=1 and al.type=1 and al.user_id=" . $this->arrUser['id'] . " and al.srm_id='".$attr['id']."' and "
                        . "( al.company_id=" . $this->arrUser['company_id'] . "
			or  company.parent_id=" . $this->arrUser['company_id'] . ") $keyword_clause";
                }
            }
        }
        if ($total > 0) {
            $Sql .= "$order_clause $limit_clause ";
            $RS = $this->objsetup->CSI($Sql);
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['total'] = $total;
            $totalPages = ceil($total / pagination_limit);
            $response['total_pages'] = $totalPages;
            $response['cpage'] = $page;
            $response['ppage'] = $page - 1;
            $response['npage'] = $page + 1;
            $response['pages'] = array();
            if ($page == 1 || $page == 2) {
                for ($i = 1; $i <= $totalPages; $i++) {
                    $response['pages'][] = $i;
                    if ($i == 5) {
                        break;
                    }
                }
            } else if ($page == $totalPages - 1 || $page == $totalPages) {
                for ($i = $page - 2, $j = 1; $i <= $totalPages; $i++, $j++) {
                    $response['pages'][] = $i;
                    if ($j == 5) {
                        break;
                    }
                }
            } else if ($totalPages >= 5) {
                $response['pages'] = array($page - 2, $page - 1, $page, $page + 1, $page + 2);
            }
            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['postcode'] = $Row['postcode_sector'];
                    $result['name'] = $Row['name'];
                    $result['county'] = $Row['county'];
                    $result['region'] = $Row['region'];
                    $result['country'] = $Row['country'];
                    $response['response'][] = $result;
                }
            } else {
                $response['response'][] = array();
            }
        } else {
            $response['ack'] = 0;
            $response['error'] = "Please select area(s) from Area Coverd!";
            $response['response'][] = array();
        }

        return $response;
    }

    function delete_sale_area($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $id = (isset($attr['id'])) ? $attr['id'] : 1;

        $Sql = "DELETE FROM srm_agent_area_list
				WHERE id = ".$attr['id']." LIMIT 1";

        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql);
        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = "Record cannot be deleted";
        }

        return $response;
    }

    function add_sale_areas($attr)
    {


        if (COUNT($attr['data']) > 0) {
            $Sql = "INSERT INTO srm_agent_area_list (cover_area_id, coverage_area, srm_id, status, company_id, user_id, date_added) VALUES ";
            for ($i = 0; $i < COUNT($attr['data']) - 1; $i++) {
                $Sql .= "(" . $attr['data'][$i]->id . ", '" . $attr['data'][$i]->postcode . "', " . $attr['srm_id'] . ", 1, " . $this->arrUser['company_id'] . ","
                    . $this->arrUser['id'] . ", " . current_date . "), ";
            }
            $last = COUNT($attr['data']) - 1;
            $Sql .= "(" . $attr['data'][$last]->id . ", '" . $attr['data'][$last]->name . $attr['data'][$last]->postcode . "', " . $attr['srm_id'] . ", 1, " . $this->arrUser['company_id'] . ","
                . $this->arrUser['id'] . ", " . current_date . ") ";
            $RS = $this->objsetup->CSI($Sql);
        }

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

    function add_sale_area($attr)
    {

        if (COUNT($attr['data_old']) > 0) {
            $SqlDel = "DELETE FROM srm_agent_area_list WHERE cover_area_id in (";
            for ($i = 0; $i < COUNT($attr['data_old']) - 1; $i++) {
                $SqlDel .= $attr['data_old'][$i]->id . ",";
            }
            $last1 = COUNT($attr['data_old']) - 1;
            $SqlDel .= $attr['data_old'][$last1]->id;
            $SqlDel .= ") and status=1 and type=" . $attr['type'] . " and user_id=" . $this->arrUser['id'] . " and
			 srm_id='$attr[srm_id]' and ( company_id=" . $this->arrUser['company_id'] . ")";
            $RSDel = $this->objsetup->CSI($SqlDel);
        }
        if (COUNT($attr['data']) > 0) {
            $Sql = "INSERT INTO srm_agent_area_list (cover_area_id, type, srm_id, status, company_id, user_id, date_added) VALUES ";

            for ($i = 0; $i < COUNT($attr['data']) - 1; $i++) {
                $Sql .= "(" . $attr['data'][$i]->id . ", '" . $attr['type'] . "', " . $attr['srm_id'] . ", 1, " . $this->arrUser['company_id'] . ","
                    . $this->arrUser['id'] . ", " . current_date . "), ";
            }
            $last = COUNT($attr['data']) - 1;
            $Sql .= "(" . $attr['data'][$last]->id . ", '" . $attr['type'] . "', " . $attr['srm_id'] . ", 1, " . $this->arrUser['company_id'] . ","
                . $this->arrUser['id'] . ", " . current_date . ") ";
            $RS = $this->objsetup->CSI($Sql);
        }

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

    function get_sale_countries($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $page = (isset($attr['page'])) ? $attr['page'] : 1;
        $start_limit = ($page - 1) * 20;
        $end_limit = $page * 20;

        $limit_clause = " LIMIT $start_limit, $end_limit ";
        $order_clause = " ORDER BY ar.country ASC";

        if (!empty($attr['country_keyword']) && $attr['country_keyword'] != "") {
            $keyword_clause .= " AND (ar.country LIKE '%".$attr['country_keyword']."%') ";
        }

        $response = array();

        $Sql = "SELECT DISTINCT sal.id as id, ar.country FROM areas_country ar "
            . " INNER JOIN srm_agent_area_list sal on sal.cover_area_id=ar.id"
            . " INNER JOIN company on company.id=sal.company_id"
            . " WHERE ar.status=1 and sal.status=1 and sal.type=1 and srm_id=" . $attr['id'] . " and ( sal.company_id=" . $this->arrUser['company_id'] . "
			or  company.parent_id=" . $this->arrUser['company_id'] . ") and sal.user_id=" . $this->arrUser['id'] . " $keyword_clause";

        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'sal');
        //echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['country'] = $Row['country'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_warehouses_and_company_addresses($attr)
    {
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

                UNION ALL

                SELECT
                    1  AS `id`,
                    'Company Address' AS `wrh_code`,
                    postcode,
                    name,
                    city,
                    '' AS `mobile`,
                    email,
                    '' AS `contact_person`,
                    telephone AS `phone`,
                    fax,
                    '' AS `job_title`,
                    address,
                    ".$this->arrUser['company_id']."     AS `company_id`,
                    1 AS type
                FROM `company`
                WHERE id = ".$this->arrUser['company_id']."

                UNION ALL

                SELECT
                    id,
                    'Company Address' AS `wrh_code`,
                    postcode,
                    name,
                    city,
                    mobile AS `mobile`,
                    email,
                    '' AS `contact_person`,
                    telephone AS `phone`,
                    fax,
                    job_title AS `job_title`,
                    address_1 AS address,
                    ".$this->arrUser['company_id']."     AS `company_id`,
                    2 AS type
                FROM `company_addresses`
                WHERE company_id = ".$this->arrUser['company_id'] . "

                ORDER BY type";

        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['code'] = $Row['wrh_code'];
                $result['name'] = $Row['name'];
                $result['address'] = $Row['address'];
                $result['type'] = $Row['type'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }

        return $response;
    }

    function get_warehouses_target_price($attr)
    {
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

        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['code'] = $Row['wrh_code'];
                $result['name'] = $Row['name'];
                $result['address'] = $Row['address'];
                $result['type'] = $Row['type'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }

        return $response;
    }

    function get_covered_areas($attr)
    {
        $Sql = "Select a.* from sr_areas_sel as a";

        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            $Row = $RS->GetRows();
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }

        return $response;
    }

    function get_sale_regions($attr)
    {

        $this->objGeneral->mysql_clean($attr);

        $page = (isset($attr['page'])) ? $attr['page'] : 1;
        $start_limit = ($page - 1) * 20;
        $end_limit = $page * 20;

        $limit_clause = " LIMIT $start_limit, $end_limit ";
        $order_clause = " ORDER BY ar.region ASC";

        if (!empty($attr['region_keyword']) && $attr['region_keyword'] != "") {
            $keyword_clause .= " AND (ar.region LIKE '%".$attr['region_keyword']."%') ";
        }

        $response = array();

        $Sql = "SELECT DISTINCT sal.id as id, ar.region FROM areas_region ar "
            . " INNER JOIN srm_agent_area_list sal on sal.cover_area_id=ar.id"
            . " INNER JOIN company on company.id=sal.company_id"
            . " WHERE ar.status=1 and sal.status=1 and sal.type=2 and srm_id=" . $attr['id'] . " and ( sal.company_id=" . $this->arrUser['company_id'] . "
			or  company.parent_id=" . $this->arrUser['company_id'] . ") and sal.user_id=" . $this->arrUser['id'] . " $keyword_clause";

        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'sal');
        //echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['region'] = $Row['region'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_sale_counties($attr)
    {

        $this->objGeneral->mysql_clean($attr);

        $page = (isset($attr['page'])) ? $attr['page'] : 1;
        $start_limit = ($page - 1) * 20;
        $end_limit = $page * 20;

        $limit_clause = " LIMIT $start_limit, $end_limit ";
        //  $order_clause = " ORDER BY ar.county ASC";
        if (!empty($attr['county_keyword']) && $attr['county_keyword'] != "") {
            $keyword_clause .= " AND (ar.county LIKE '%$attr[county_keyword]%') ";
        }

        $response = array();

        $Sql = "SELECT DISTINCT sal.id as id, ar.county FROM areas_county ar "
            . " INNER JOIN srm_agent_area_list sal on sal.cover_area_id=ar.id"
            . " INNER JOIN company on company.id=sal.company_id"
            . " WHERE ar.status=1 and sal.status=1 and sal.type=3 and srm_id=" . $attr['id'] . " and ( sal.company_id=" . $this->arrUser['company_id'] . "
			or  company.parent_id=" . $this->arrUser['company_id'] . ") and sal.user_id=" . $this->arrUser['id'] . " $keyword_clause";

        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'sal');
        //echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['county'] = $Row['county'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_saleAreas($attr)
    {

        $this->objGeneral->mysql_clean($attr);

        $page = (isset($attr['page'])) ? $attr['page'] : 1;
        $start_limit = ($page - 1) * 20;
        $end_limit = $page * 20;

        $limit_clause = " LIMIT $start_limit, $end_limit ";
        $order_clause = " ORDER BY ar.name ASC";
        if (!empty($attr['name_keyword']) && $attr['name_keyword'] != "") {
            $keyword_clause .= " AND (ar.name LIKE '%$attr[name_keyword]%') ";
        }

        $response = array();

        $Sql = "SELECT DISTINCT sal.id as id, ar.name, ar.postcode_sector FROM areas ar "
            . " INNER JOIN srm_agent_area_list sal on sal.cover_area_id=ar.id"
            . " INNER JOIN company on company.id=sal.company_id"
            . " WHERE ar.status=1 and sal.status=1 and sal.type=4 and srm_id=" . $attr['id'] . " and ( sal.company_id=" . $this->arrUser['company_id'] . "
			or  company.parent_id=" . $this->arrUser['company_id'] . ") and sal.user_id=" . $this->arrUser['id'] . " $keyword_clause";


        $response['ack'] = 1;
        $response['error'] = NULL;


        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'sal');
        //echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['postcode'] = $Row['postcode_sector'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_shipping($attr)
    {
        //$this->objGeneral->mysql_clean($arr_attr);
        //print_r($arr_attr);exit;
        // $id = $arr_attr['id'];

        $id = $attr->id;

        $update_check = "";

        if ($id > 0)
            $update_check = "  AND tst.id <> '" . $id . "'";

        $data_pass = "  tst.name='" . $attr->name . "'  and tst.type=1 and tst.status=1 $update_check";

        $total = $this->objGeneral->count_duplicate_in_sql('get_method', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
        if ($id == 0) {


            $Sql = "INSERT INTO get_method SET
									type=2,status=1,
									name='" . $attr->name . "', 
									company_id='" . $this->arrUser['company_id'] . "',
									user_id='" . $this->arrUser['id'] . "'	";
            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
            //  }
        } else {
            $Sql = "UPDATE get_method SET  
									 name='" . $attr->name . "' 
									WHERE id = " . $id . "   Limit 1";
            $RS = $this->objsetup->CSI($Sql);
        }
        echo $Sql;
        exit;

        if ($id > 0) {
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

    //----------SRM shiping Module----------------------------
    function get_shipping($attr)
    {
        /* 	global $objFilters;
          $where = array(0=>array('document.module_id'=>19),1=>array('document.row_id'=>$attr[srm_id]),2=>array('document.type'=>2));
          return $objFilters->get_module_listing(12, "document",'','',$attr[more_fields],'',$where);
         */

        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";
        $response = array();

        $Sql = "SELECT srm_agent_area_list.id,  srm_agent_area_list.coverage_area  
                FROM srm_agent_area_list 
                where srm_agent_area_list.status=1 and srm_agent_area_list.srm_id='".$attr['id']."' and srm_agent_area_list.company_id=" . $this->arrUser['company_id'] . " 
                order by srm_agent_area_list.id DESC";

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['area'] = $Row['coverage_area'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }

        return $response;
    }

    function add_srm_shipping($arr_attr)
    {

        //print_r($arr_attr); 	exit;

        $doc_id = $arr_attr['update_id'];
        if ($doc_id == 0) {

            $Sql = "INSERT INTO srm_agent_area SET  
									 coverage_area='" . $arr_attr['coverage_area'] . "'
									,coverage_area_id='" . $arr_attr['coverage_area_id'] . "'
									,srm_id='" . $arr_attr['srm_id'] . "'
									,status='1'  
									,company_id='" . $this->arrUser['company_id'] . "' 
									,user_id='" . $this->arrUser['id'] . "'
									,date_added='" . current_date . "'";

            $RS = $this->objsetup->CSI($Sql);
            $sale_id = $this->Conn->Insert_ID();

            //$price_id= explode(",",  $arr_attr[coverage_price]);
            $sale_name_id = explode(",", $arr_attr['coverage_area_id']);
            $area_name = explode(",", $arr_attr['coverage_area']);

            $i = 0;
            foreach ($sale_name_id as $key => $area_id) {
                if (is_numeric($area_id)) {

                    $sql = "SELECT  count(id)  as total FROM srm_agent_area_list	
												WHERE cover_area_id='" . $area_id . "'   and  srm_id='" . $arr_attr['srm_id'] . "'
												and company_id='" . $this->arrUser['company_id'] . "' ";
                    $rs_count = $this->objsetup->CSI($sql);
                    $total = $rs_count->fields['total'];

                    if ($total == 0) {
                        $Sql = "INSERT INTO srm_agent_area_list SET  
														cover_area_id='" . $area_id . "'
														,coverage_area='" . $area_name[$i] . "'    
														,sale_id='" . $sale_id . "' 
														,srm_id='" . $arr_attr['srm_id'] . "' 
														,status='1'   
														,company_id='" . $this->arrUser['company_id'] . "' 
														,user_id='" . $this->arrUser['id'] . "',
														date_added='" . current_date . "'";
                        $RS = $this->objsetup->CSI($Sql);
                    }
                    $i++;
                }
            }
        } else {

                $Sql = "UPDATE  shipping_agent_sale SET  
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
									WHERE id = " . $doc_id . "  Limit 1";
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

    function add_cusomer($arr_attr)
    {
        //  print_r($arr_attr);   	exit; 
        // $counter_supplier++;
        $tab_change = 'tab_doc';
        $sale_customer_id = $arr_attr['update_id'];

        if ($sale_customer_id > 0) {
            $Sql = "DELETE FROM shipping_agent WHERE sale_id = $sale_customer_id ";
            $RS = $this->objsetup->CSI($Sql);

            $coverage_area2 = explode(",", $arr_attr['coverage_area2']);
            $coverage_area_id2 = explode(",", $arr_attr['coverage_area_id2']);
            $coverage_price2 = explode(",", $arr_attr['coverage_price2']);

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

            $Sql = "UPDATE  shipping_agent_sale SET coverage_area='" . $arr_attr['coverage_area2'] . "'  
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

    function add_supplier_area_list($arr_attr)
    {

        //	print_r($arr_attr); 	exit;
        $tab_change = 'tab_doc';
        $doc_id = $arr_attr[update_id];

        if ($doc_id > 0) {

            $Sql = "UPDATE  shipping_agent_sale SET  
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
									WHERE id = " . $doc_id . "  Limit 1";
            $RS = $this->objsetup->CSI($Sql);
        } else {

            $Sql = "INSERT INTO shipping_agent_sale SET  							
									
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
									,srm_id='" . $arr_attr['srm_id'] . "'
									,status='1'  
									,company_id='" . $this->arrUser['company_id'] . "' 
									,user_id='" . $this->arrUser['id'] . "'
									,date_added='" . current_date . "'";
            $new = 'Add';
            $new_msg = 'Inserted';
            $RS = $this->objsetup->CSI($Sql);
            $sale_id = $this->Conn->Insert_ID();

            $customer_price_id = explode(",", $arr_attr['coverage_price']);
            $sale_name_id = explode(",", $arr_attr['coverage_area_id']);
            $customer_area = explode(",", $arr_attr['coverage_area']);

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

    //----------SRM Area----------------------------
    function get_coverage_all_areas($attr)
    {
        $Sql = "SELECT  c.id, c.coverage_price, c.coverage_area, c.cover_area_id
		        FROM srm_agent_area_list c 
                where sale_id ='".$attr['id']."' and 
                      status=1 ";

        $RS = $this->objsetup->CSI($Sql);
        $selected = array();

        if ($RS->RecordCount() > 0) 
        {
            $result = array();
            while ($Row = $RS->FetchRow())
            {
                $selected[] = $Row['id'];

                $result['cover_area_id'] = $Row['cover_area_id'];
                $result['name'] = $Row['coverage_area'];
                //$result['price'] = $Row['coverage_price'];
                $response2['response_selected'][] = $result;
            }
        }
        //print_r($response2['response_selected']);exit;
        $limit_clause = $where_clause = "";

        if (!empty($attr['keyword'])) {
            $where_clause .= " AND name LIKE '%".$attr['keyword']."%' ";
        }

        if (empty($attr['all'])) {
            if (empty($attr['start']))
                $attr['start'] = 0;

            if (empty($attr['limit']))
                $attr['limit'] = 10;
            $limit_clause = " LIMIT ".$attr['start'] .",".$attr['limit']." ";
        }

        $Sql = "SELECT  c.id, c.name, c.price
                FROM coverage_areas  c 
                where c.status=1 and  
                      c.company_id=" . $this->arrUser['company_id'] . " 
                order by c.id DESC";

        $RS = $this->objsetup->CSI($Sql);
        $selected_count = 0;

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                //	$result['price'] = $Row['price'];

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
        }
         else {
            $response['response'][] = array();
        }
        $response['selected_count'] = $selected_count;
        return $response;
    }

    function get_slected_areas($attr)
    {
        $Sql = "SELECT  c.id, c.coverage_area
                FROM srm_agent_area_list c  
                where srm_id ='".$attr['id']."' and status=1 ";

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) 
        {
            $result = array();
            while ($Row = $RS->FetchRow())
            {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['coverage_area'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        }
        return $response;
    }

    function get_covered_country($attr)
    {
        $Sql = "select * from areas_country";
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow())
            {
                $result = array();
                $result['id'] = $Row['id'];
                $result['country'] = $Row['country'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {
            $response['response'][] = array();
        }
        return $response;
    }

    // function search_covered_areas($attr)
    // {
    //     $this->objGeneral->mysql_clean($arr_attr);
    //     $limit_clause = $where_clause = "";        
    //     $response = array();

    //     if (!empty($attr['country']))
    //         $where_clause = " AND a.country = '$attr[country]' ";

    //     if (!empty($attr['searchAreas']))
    //         $where_clause .= " AND ((a.postcode LIKE '%$attr[searchAreas]%') OR 
    //                                 (a.name LIKE '%$attr[searchAreas]%') OR 
    //                                 (a.county LIKE '%$attr[searchAreas]%') OR 
    //                                 (a.region LIKE '%$attr[searchAreas]%')) ";
        
    //     $Sql = "SELECT a.* from sr_areas_sel as a where 1=1 $where_clause";
    //     //echo $Sql; exit;
    //     $RS = $this->objsetup->CSI($Sql);

    //     if ($RS->RecordCount() > 0) 
    //     {
    //         $Row = $RS->GetRows();
    //         $response['response'] = $Row;
    //         $response['ack'] = 1;
    //         $response['error'] = NULL;
    //     } else {
    //         $response['response'][] = array();
    //     }
    //     return $response;
    // }

    function saveNewLoc($attr) {

        $this->objGeneral->mysql_clean($attr);

        if(isset($attr['region']) && $attr['region']!=''){

            $region = strtolower($attr['region']) ; 

            if($region == 'all')
                $region = 'ALL';
            else
                $region = $attr['region'];         
        }

        if(isset($attr['county']) && $attr['county']!=''){

            $county = strtolower($attr['county']) ; 

            if($county == 'all')
                $county = 'ALL';
            else
                $county = $attr['county'];         
        }

        if(isset($attr['area']) && $attr['area']!=''){

            $area = strtolower($attr['area']) ; 

            if($area == 'all')
                $area = 'ALL';
            else
                $area = $attr['area'];         
        }

        if ($region == 'ALL' && ($county != 'ALL' || $area != 'ALL')) {
            $response['ack'] = 0;
            $response['error'] = "Region is already selected as 'All' for all Counties and Areas.";
            return $response;
        }

        if ($county == 'ALL' && $area != 'ALL') {
            $response['ack'] = 0;
            $response['error'] = "County is already selected as 'All' for all Areas.";
            return $response;
        }


        $sql_total = "SELECT  count(id) as total	
                      FROM haulierloc
                      WHERE level1 = '" . $region . "' AND
                            level2 = '" . $county . "' AND
                            level3 = '" . $area . "' ";
        // echo $sql_total;exit;

        $rs_count = $this->objsetup->CSI($sql_total);

        if ($rs_count->fields['total'] > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO haulierloc 
                                SET
                                    level1='" . $region . "',
                                    level2='" . $county . "',
                                    level3='" . $area . "',
                                    AddedBy='" . $this->arrUser['id'] . "',
                                    AddedOn='" . current_date . "'";
        
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) 
        {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not Added!';
        }

        return $response;
    }

    function getHaulierLoc($attr) {
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $defaultFilter = false;    
        // echo '<pre>';print_r($attr['searchKeyword']); 
        // echo   $attr['searchKeyword']->level3;exit;     

        if (!empty($attr['searchKeyword'])) {
            // $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.", $attr, $fieldsMeta);

            if($attr['searchKeyword']->level1)
                $where_clause = " AND (tbl.level1 LIKE '%".$attr['searchKeyword']->level1."%' OR 
                                        tbl.level2 LIKE '%".$attr['searchKeyword']->level1."%' OR 
                                        tbl.level3 LIKE '%".$attr['searchKeyword']->level1."%' )";

            if($attr['searchKeyword']->level2)
                $where_clause = " AND (tbl.level1 LIKE '%".$attr['searchKeyword']->level2."%' OR 
                                        tbl.level2 LIKE '%".$attr['searchKeyword']->level2."%' OR 
                                        tbl.level3 LIKE '%".$attr['searchKeyword']->level2."%' )";

            if($attr['searchKeyword']->level3)
                $where_clause = " AND (tbl.level1 LIKE '%".$attr['searchKeyword']->level3."%' OR
                                        tbl.level2 LIKE '%".$attr['searchKeyword']->level3."%' OR
                                        tbl.level3 LIKE '%".$attr['searchKeyword']->level3."%' )";

            if($attr['searchKeyword']->search)
                $where_clause = " AND (tbl.level1 LIKE '%".$attr['searchKeyword']->search."%' OR
                                        tbl.level2 LIKE '%".$attr['searchKeyword']->search."%' OR
                                        tbl.level3 LIKE '%".$attr['searchKeyword']->search."%' )";

            $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.", $attr, $fieldsMeta);
        }        

        $response = array();

        $Sql = "  SELECT * 
                  FROM (SELECT id,level1,level2,level3
                        FROM haulierloc) AS tbl  
                  WHERE 1  " . $where_clause . " ";

        // echo $Sql;exit;

        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if (!empty($attr['sort_column'])) {
            $column = 'tbl.' . $attr['sort_column'];

            if ($attr['sort_column'] == 'level1')
                $column = 'tbl.' . 'level1';
            else if ($attr['sort_column'] == 'level2')
                $column = 'tbl.' . 'level2';
            else if ($attr['sort_column'] == "level3")
                $column = 'tbl.' . 'level3';
           
            $order_type = "Order BY " . $column . " ASC";
        }

        $column = 'tbl.id';

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

                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                $row = array();
                $row['id'] = $Row['id'];
                $row['level1'] = $Row['level1'];
                $row['level2'] = $Row['level2'];
                $row['level3'] = $Row['level3'];
                
                $response['response'][] = $row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'][] = array();
        }

            $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData('haulierLoc');
        
        $response['response']['tbl_meta_data']['defaultFilter'] = $defaultFilter;
        return $response;
    }

    function getHaulierDatabaseListing($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $suppliersArray = '';

        /* $sqla = "SELECT s.id 
                 FROM sr_srm_general_sel s
                 WHERE s.type IN (2,3) AND 
                       s.company_id=" . $this->arrUser['company_id'] . " "; */
        
        $sqla = " SELECT s.id 
                    FROM srm as s
                    WHERE s.type IN (2,3) AND 
                            s.company_id=" . $this->arrUser['company_id'] . " ";
        //1<>1 AND

        //$sqla = $this->objsetup->whereClauseAppender($sqla, 24);
        // echo $sqla;exit;
        $RSa = $this->objsetup->CSI($sqla);

        if ($RSa->RecordCount() > 0) {
            while ($Rowa = $RSa->FetchRow()) {

                foreach ($Rowa as $key => $value) {
                    if (is_numeric($key))
                        unset($Rowa[$key]);
                }

                $suppliersArray .= $Rowa['id'] . ',';
            }
            $suppliersArray = substr($suppliersArray, 0, -1);
        }  

        $Sqlb = "SELECT  s.id
                 FROM sr_srm_general_sel as s
                 WHERE  s.type IN (1) AND 
                        s.company_id=" . $this->arrUser['company_id'] . " ";

        //$Sqlb = $this->objsetup->whereClauseAppender($Sqlb,18);
        // echo $Sqlb;exit;
        $RSb = $this->objsetup->CSI($Sqlb);

        if ($RSb->RecordCount() > 0) {

            // if(isset($suppliersArray))
            if(strlen($suppliersArray)>0)
                $suppliersArray .= ',';

            while ($Rowb = $RSb->FetchRow()) {

                foreach ($Rowb as $key => $value) {
                    if (is_numeric($key))
                        unset($Rowb[$key]);
                }

                $suppliersArray .= $Rowb['id'] . ',';
            }
            $suppliersArray = substr($suppliersArray, 0, -1);
        }

        if ($RSa->RecordCount() == 0 && $RSb->RecordCount() == 0) {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
            // $response['response'][] = array();
            return $response;
        }
        // print_r($suppliersArray);

        $where = " a.company_id=" . $this->arrUser['company_id'] . " ";
        $where1 = " a1.company_id=" . $this->arrUser['company_id'] . " ";
        $where2 = " a2.company_id=" . $this->arrUser['company_id'] . " ";
        $where3 = " a3.company_id=" . $this->arrUser['company_id'] . " ";
        // echo '<pre>';print_r($attr);
        
        $filter = $attr['filter'];

        $locOptionFrom = $filter->haulierLocType_fromID;
        $locOptionTo = $filter->haulierLocType_toID;

        $locFromID = $filter->haulierLoc_fromID;
        $locToID = $filter->haulierLoc_toID;

        $haulierShippingMethodID = $filter->haulierShippingMethodID;
        $haulierShippingMethod = $filter->haulierShippingMethod;

        $areasHaulierLocToArray = $filter->areasHaulierLocTo;
        $locOptionFromType = $filter->haulierLoc_fromType;
        $locOptionToType = $filter->haulierLoc_toType;  
       

        if($locOptionTo == 2){

            $areasHaulierLocTo  = " AND (";   
            $areasHaulierLocTo1 = " AND (";   
            $areasHaulierLocTo2 = " AND (";   
            $areasHaulierLocTo3 = " AND (";   
            $areasHaulierLocToSel = " AND (";   

            $loopCounter = 0;

            foreach($areasHaulierLocToArray AS $rec){
                // echo $rec->level1;

                if($loopCounter>0){
                    $areasHaulierLocTo  .= " OR ";   
                    $areasHaulierLocTo1 .= " OR ";   
                    $areasHaulierLocTo2 .= " OR ";   
                    $areasHaulierLocTo3 .= " OR "; 
                    $areasHaulierLocToSel .= " OR "; 
                }

                $haulierLoc_to_level1 = $rec->level1; 
                $haulierLoc_to_level2 = $rec->level2; 
                $haulierLoc_to_level3 = $rec->level3; 

                if($haulierLoc_to_level1 == 'ALL'){

                    $areasHaulierLocTo  .= " 1 ";
                    $areasHaulierLocTo1 .= " 1 ";
                    $areasHaulierLocTo2 .= " 1 ";
                    $areasHaulierLocTo3 .= " 1 ";
                    $areasHaulierLocToSel .= " 1 ";
                }
                elseif($haulierLoc_to_level2 == 'ALL'){

                    $areasHaulierLocTo  .= "(halLoc.haulierLoc_to_level1 = \'".$haulierLoc_to_level1."\' OR halLoc.haulierLoc_to_level1 = \'ALL\')";
                    $areasHaulierLocTo1 .= "(halLoc1.haulierLoc_to_level1 = \'".$haulierLoc_to_level1."\' OR halLoc1.haulierLoc_to_level1 = \'ALL\')";
                    $areasHaulierLocTo2 .= "(halLoc2.haulierLoc_to_level1 = \'".$haulierLoc_to_level1."\' OR halLoc2.haulierLoc_to_level1 = \'ALL\')";
                    $areasHaulierLocTo3 .= "(halLoc3.haulierLoc_to_level1 = \'".$haulierLoc_to_level1."\' OR halLoc3.haulierLoc_to_level1 = \'ALL\')";
                    $areasHaulierLocToSel .= "(selHL.haulierLoc_to_level1 = \'".$haulierLoc_to_level1."\' OR selHL.haulierLoc_to_level1 = \'ALL\')";
                }
                elseif($haulierLoc_to_level3 == 'ALL'){

                    $areasHaulierLocTo .= "((halLoc.haulierLoc_to_level1 = \'".$haulierLoc_to_level1."\' OR halLoc.haulierLoc_to_level1 = \'ALL\')   AND
                                            (halLoc.haulierLoc_to_level2 = \'".$haulierLoc_to_level2."\' OR halLoc.haulierLoc_to_level2 = \'ALL\'))";

                    $areasHaulierLocTo1 .= "((halLoc1.haulierLoc_to_level1 = \'".$haulierLoc_to_level1."\' OR halLoc1.haulierLoc_to_level1 = \'ALL\') AND
                                             (halLoc1.haulierLoc_to_level2 = \'".$haulierLoc_to_level2."\' OR halLoc1.haulierLoc_to_level2 = \'ALL\'))";

                    $areasHaulierLocTo2 .= "((halLoc2.haulierLoc_to_level1 = \'".$haulierLoc_to_level1."\' OR halLoc2.haulierLoc_to_level1 = \'ALL\') AND
                                             (halLoc2.haulierLoc_to_level2 = \'".$haulierLoc_to_level2."\' OR halLoc2.haulierLoc_to_level2 = \'ALL\'))";

                    $areasHaulierLocTo3 .= "((halLoc3.haulierLoc_to_level1 = \'".$haulierLoc_to_level1."\' OR halLoc3.haulierLoc_to_level1 = \'ALL\') AND
                                             (halLoc3.haulierLoc_to_level2 = \'".$haulierLoc_to_level2."\' OR halLoc3.haulierLoc_to_level2 = \'ALL\'))";

                    $areasHaulierLocToSel .= "((selHL.haulierLoc_to_level1 = \'".$haulierLoc_to_level1."\' OR selHL.haulierLoc_to_level1 = \'ALL\') AND
                                                (selHL.haulierLoc_to_level2 = \'".$haulierLoc_to_level2."\' OR selHL.haulierLoc_to_level2 = \'ALL\'))";
                }
                else{

                    $areasHaulierLocTo .= "((halLoc.haulierLoc_to_level1 = \'".$haulierLoc_to_level1."\' OR halLoc.haulierLoc_to_level1 = \'ALL\')   AND
                                            (halLoc.haulierLoc_to_level2 = \'".$haulierLoc_to_level2."\' OR halLoc.haulierLoc_to_level2 = \'ALL\') AND
                                            (halLoc.haulierLoc_to_level3 = \'".$haulierLoc_to_level3."\' OR halLoc.haulierLoc_to_level3 = \'ALL\'))";

                    $areasHaulierLocTo1 .= "((halLoc1.haulierLoc_to_level1 = \'".$haulierLoc_to_level1."\' OR halLoc1.haulierLoc_to_level1 = \'ALL\') AND
                                             (halLoc1.haulierLoc_to_level2 = \'".$haulierLoc_to_level2."\' OR halLoc1.haulierLoc_to_level2 = \'ALL\') AND
                                             (halLoc1.haulierLoc_to_level3 = \'".$haulierLoc_to_level3."\' OR halLoc1.haulierLoc_to_level3 = \'ALL\'))";

                    $areasHaulierLocTo2 .= "((halLoc2.haulierLoc_to_level1 = \'".$haulierLoc_to_level1."\' OR halLoc2.haulierLoc_to_level1 = \'ALL\') AND
                                             (halLoc2.haulierLoc_to_level2 = \'".$haulierLoc_to_level2."\' OR halLoc2.haulierLoc_to_level2 = \'ALL\') AND
                                             (halLoc2.haulierLoc_to_level3 = \'".$haulierLoc_to_level3."\' OR halLoc2.haulierLoc_to_level3 = \'ALL\'))";

                    $areasHaulierLocTo3 .= "((halLoc3.haulierLoc_to_level1 = \'".$haulierLoc_to_level1."\' OR halLoc3.haulierLoc_to_level1 = \'ALL\') AND
                                             (halLoc3.haulierLoc_to_level2 = \'".$haulierLoc_to_level2."\' OR halLoc3.haulierLoc_to_level2 = \'ALL\') AND
                                             (halLoc3.haulierLoc_to_level3 = \'".$haulierLoc_to_level3."\' OR halLoc3.haulierLoc_to_level3 = \'ALL\'))";

                    $areasHaulierLocToSel .= "((selHL.haulierLoc_to_level1 = \'".$haulierLoc_to_level1."\' OR selHL.haulierLoc_to_level1 = \'ALL\') AND
                                                (selHL.haulierLoc_to_level2 = \'".$haulierLoc_to_level2."\' OR selHL.haulierLoc_to_level2 = \'ALL\') AND
                                                (selHL.haulierLoc_to_level3 = \'".$haulierLoc_to_level3."\' OR selHL.haulierLoc_to_level3 = \'ALL\'))";
                }
                
                $loopCounter++;
            } 

            $areasHaulierLocTo  .= " )";   
            $areasHaulierLocTo1  .= " )";   
            $areasHaulierLocTo2 .= " )";   
            $areasHaulierLocTo3 .= " )"; 
            $areasHaulierLocToSel .= " )"; 
        }

        $qty = (isset($filter->qty)&& $filter->qty !='')?$filter->qty:0;

         $Sql = "CALL srrep_HaulierDatabaseSearchReport(".$this->arrUser['company_id'].",
                                                        '".$qty."',
                                                        '".$suppliersArray."',
                                                        '".$areasHaulierLocTo."',
                                                        '".$areasHaulierLocTo1."',
                                                        '".$areasHaulierLocTo2."',
                                                        '".$areasHaulierLocTo3."',
                                                        '".$areasHaulierLocToSel."',

                                                        '".$locOptionFrom."',
                                                        '".$locOptionTo."',

                                                        '".$locOptionFromType."',
                                                        '".$locOptionToType."',

                                                        '".$locFromID."',
                                                        '".$locToID."',

                                                        '".$filter->haulierLoc_from_level1."',
                                                        '".$filter->haulierLoc_from_level2."',
                                                        '".$filter->haulierLoc_from_level3."',

                                                        '".$haulierShippingMethodID."',
                                                        '".$haulierShippingMethod."')"; 

        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);
        // $RS = $this->objsetup->CSI($Sql, "srm_pricetab", sr_ViewPermission);

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                $result = array();
                $result['id'] = $Row['id'];
                $result['supplierNo'] = $Row['supplierNo'];
                $result['supplierName'] = $Row['supplierName'];
                $result['supplierTelephone'] = $Row['supplierTelephone'];
                /* $result['qty'] = $Row['shipQtyMin'].' - '.$Row['shipQtyMax'];
                $result['price'] = number_format((float)$Row['price_lcy'], 2, '.', '');*/

                $result['qty'] = $Row['qty'];
                $result['haulierShippingMethod_Name'] = $Row['haulierShippingMethod_Name'];
                $result['price'] = $Row['price'];
                $result['location_from'] = $Row['location_from'];
                $result['location_to'] = $Row['location_to'];

                $result['minPrice'] = $Row['minPrice'];
                $result['maxPrice'] = $Row['maxPrice'];
                $result['avgPrice'] = $Row['avgPrice'];
                
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function getHaulierListing($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";
        $response = array();
        $response2 = array();

        if (!empty($attr['keyword']))
            $where_clause .= " AND name LIKE '%$attr[keyword]%' ";

        $page = (isset($attr['page'])) ? $attr['page'] : 1;
        $start_limit = ($page - 1) * 20;
        $end_limit = $page * 20;

        $limit_clause = " LIMIT $start_limit, $end_limit ";
        $order_clause = " ORDER BY a.id DESC";

        //user_code AS received_by,

        $Sql = "SELECT a.*,
                        CONCAT(emp.first_name,' ',emp.last_name) AS received_by,                        
                        (CASE WHEN (a.status = 0) THEN 'Inactive'
                              WHEN (a.status = 1) THEN 'Active'
                              ELSE ''
                              END
                        ) as aStatus,
                        (CASE WHEN (haulierLoc_from_warehouse_id > 0 AND haulierLoc_from_warehouse_type =1) THEN (SELECT CONCAT(c.name ,' - Company Address') 
                                                                    FROM company AS c 
                                                                    WHERE c.id= a.company_id)
                            WHEN (haulierLoc_from_warehouse_id > 0 AND haulierLoc_from_warehouse_type =2) THEN (SELECT CONCAT(compAdd.name ,' - Company Address') 
                                                                    FROM company_addresses AS compAdd 
                                                                    WHERE compAdd.id= a.haulierLoc_from_warehouse_id)
                            WHEN (haulierLoc_from_warehouse_id > 0 AND haulierLoc_from_warehouse_type =3) THEN (SELECT CONCAT(wrhSel.name ,' - ',wrhSel.wrh_code) 
                                                                    FROM sr_warehouses_sel AS wrhSel 
                                                                    WHERE wrhSel.id= a.haulierLoc_from_warehouse_id)
                            ELSE (CASE
                                        WHEN (haulierLoc_from_level1 = 'ALL') THEN 'ALL'
                                        WHEN (haulierLoc_from_level2 = 'ALL') THEN haulierLoc_from_level1
                                        WHEN (haulierLoc_from_level3 = 'ALL') THEN haulierLoc_from_level2
                                        ELSE haulierLoc_from_level3
                                        END)
                            END ) AS location_from,
                        (CASE WHEN (haulierLoc_to_warehouse_id > 0 AND haulierLoc_to_warehouse_type =1) THEN (SELECT CONCAT(c.name ,' - Company Address') 
                                                                    FROM company AS c 
                                                                    WHERE c.id= a.company_id)
                            WHEN (haulierLoc_to_warehouse_id > 0 AND haulierLoc_to_warehouse_type =2) THEN (SELECT CONCAT(compAdd.name ,' - Company Address') 
                                                                    FROM company_addresses AS compAdd 
                                                                    WHERE compAdd.id= a.haulierLoc_to_warehouse_id)
                            WHEN (haulierLoc_to_warehouse_id > 0 AND haulierLoc_to_warehouse_type =3) THEN (SELECT CONCAT(wrhSel.name ,' - ',wrhSel.wrh_code) 
                                                                    FROM sr_warehouses_sel AS wrhSel 
                                                                    WHERE wrhSel.id= a.haulierLoc_to_warehouse_id)
                            ELSE (SELECT  group_concat(DISTINCT 
                                                        CASE
                                                        WHEN (selHL.haulierLoc_to_level1 = 'ALL') THEN 'ALL'
                                                        WHEN (selHL.haulierLoc_to_level2 = 'ALL') THEN selHL.haulierLoc_to_level1
                                                        WHEN (selHL.haulierLoc_to_level3 = 'ALL') THEN selHL.haulierLoc_to_level2
                                                        ELSE selHL.haulierLoc_to_level3
                                                        END)
                                  FROM haulierloc_to_selected AS selHL where selHL.haulier_id = a.id AND selHL.company_id = a.company_id)
                            END ) AS location_to
                       
                FROM haulier a
                LEFT JOIN  employees AS emp ON a.PriceAddedByEmployeeID = emp.id
                WhERE a.status IN (0,1) and 
                      a.srm_id='".$attr['srmID']."' and 
                      a.company_id=" . $this->arrUser['company_id'] . " ";
        //echo $Sql;
        $RS = $this->objsetup->CSI($Sql);
        // $RS = $this->objsetup->CSI($Sql, "srm_pricetab", sr_ViewPermission);

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                $result = array();
                $result['id'] = $Row['id'];
                $result['received_by'] = $Row['received_by'];
                $result['location_from'] = $Row['location_from'];

                $result['location_to'] = $Row['location_to'];

                $result['shipping_method'] = $Row['haulierShippingMethod_Name'];
                $result['shipping_quantity'] = $Row['shipQtyMin'].' - '.$Row['shipQtyMax'];//$Row['shipping_quantity'];
                $result['price'] = number_format((float)$Row['price'], 2, '.', '');
                
                $result['status'] = $Row['aStatus'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function getHaulierListingById($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        //user_code AS received_by,

        $Sql = "SELECT a.*,CONCAT(emp.first_name,' ',emp.last_name) AS received_by 
                FROM haulier a
                LEFT JOIN  employees AS emp ON a.PriceAddedByEmployeeID = emp.id
				WHERE a.id=".$attr['id']."
				LIMIT 1";

        $RS = $this->objsetup->CSI($Sql);
        
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();

            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            
            $Row['price'] = number_format((float)$Row['price'], 2, '.', '');

            $Row['priceDate'] = $this->objGeneral->convert_unix_into_date($Row['priceDate']);
            
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'] = $Row;
            $response['areasLocTo'] = $this->getHaulierAreasLocTo($attr['id']);

            
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
            $response['response'] = array();
        }
        return $response;
    }

    function deleteHaulier($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        // $sql = "DELETE FROM haulier WHERE id = ".$attr['id']."";

        $Sql = "UPDATE haulier 
                                SET 
                                    status=-1,
                                    ChangedBy='" . $this->arrUser['id'] . "',                                        
                                    ChangedOn='" . current_date . "'
                                WHERE id = ".$attr['id']."   
                                Limit 1";
        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);
        
        if ($this->Conn->Affected_Rows() > 0) 
        {
            $response['ack'] = 1;
            $response['error'] = NULL;

            
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
        }

        return $response;
    }

    function getHaulierAreasLocTo($haulierID){

        $Sql = "SELECT *
				FROM haulierloc_to_selected
				WHERE haulier_id=".$haulierID." ";

        $RS = $this->objsetup->CSI($Sql);
        
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) 
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                $result = array();
                $result['id'] = $Row['haulierloc_id'];
                $result['level1'] = $Row['haulierLoc_to_level1'];
                $result['level2'] = $Row['haulierLoc_to_level2'];
                $result['level3'] = $Row['haulierLoc_to_level3'];
                $response[] = $result;
            }

            
        } else {
            $response = array();
        }
        return $response;

    }

    function addNewHaulier($arr_attr)
    {
        $update_id = $arr_attr['id'];
        $update_check = "";

        $areasLocToArray = $arr_attr['areasLocTo'];

        $this->objGeneral->mysql_clean($arr_attr);

        if ($update_id > 0){
            
            $update_check = "  AND hal.id <> '" . $update_id . "'";
            $update_check2 = "  AND tst.id <> '" . $update_id . "'";        
        }

        $priceDate = $this->objGeneral->convert_date($arr_attr['priceDate']);

        $areasLocToError = array();
        $areasLocToErrorLabel = '';
        $areasLocToErrorCounter = 0;
        
        foreach($areasLocToArray as $areasLocTo){

            $query = " SELECT count(hal.id)
                        FROM  haulier AS hal
                        LEFT JOIN haulierloc_to_selected AS halLocToSel on halLocToSel.haulier_id = hal.id 
                        WHERE  hal.haulierLocType_from_name='" . $arr_attr['haulierLocType_from_name'] . "' AND
                                    hal.haulierLoc_from_level1='" . $arr_attr['haulierLoc_from_level1'] . "' AND
                                    hal.haulierLoc_from_level2='" . $arr_attr['haulierLoc_from_level2'] . "' AND
                                    hal.haulierLoc_from_level3='" . $arr_attr['haulierLoc_from_level3'] . "' AND
                                    hal.haulierLocType_to_name='" . $arr_attr['haulierLocType_to_name'] . "' AND
                                    halLocToSel.haulierloc_id='" . $areasLocTo->id . "' AND
                                    hal.priceDate='".$priceDate ."' AND 
                                    hal.srm_id=". $arr_attr['srm_id']." AND 
                                    hal.status=1 AND 
                                    hal.company_id = '" . $this->arrUser['company_id'] . "' ".$update_check." ";

            $rs_count = $this->objsetup->CSI($query);

            if ($rs_count->fields['total'] > 0) {
                array_push($areasLocToError,$areasLocTo->level3);
                $areasLocToErrorLabel .= $areasLocTo->level3.', ';
                $areasLocToErrorCounter++;
            }  
        }

        if($areasLocToErrorCounter>0){
            $response['ack'] = 0;
            $response['error'] = "Record already exists for following locations To (".$areasLocToErrorLabel.")";
            return $response;
        }

        if($arr_attr['haulierLocType_to_name'] == 'Company Warehouse' ){

            $data_pass = "  tst.haulierLocType_from_name='" . $arr_attr['haulierLocType_from_name'] . "' AND
                            tst.haulierLoc_from_level1='" . $arr_attr['haulierLoc_from_level1'] . "' AND
                            tst.haulierLoc_from_level2='" . $arr_attr['haulierLoc_from_level2'] . "' AND
                            tst.haulierLoc_from_level3='" . $arr_attr['haulierLoc_from_level3'] . "' AND
                            tst.haulierLocType_to_name='" . $arr_attr['haulierLocType_to_name'] . "' AND
                            tst.haulierLoc_to_warehouse_id = '" . $arr_attr['warehouseLocToID'] . "' AND
                            tst.haulierLoc_to_warehouse_type ='" . $arr_attr['warehouseLocToType'] . "' AND    
                            tst.priceDate='".$priceDate ."' AND                       
                            tst.srm_id=". $arr_attr['srm_id']."  ".$update_check2." "; 

            $total = $this->objGeneral->count_duplicate_in_sql('haulier', $data_pass, $this->arrUser['company_id']);

            if ($total > 0) {
                $response['ack'] = 0;
                $response['error'] = 'Record Already Exists.';
                return $response;
            }
        }

        $price = (isset($arr_attr['price']) && $arr_attr['price'] != '')?$arr_attr['price']:0;
        $price_lcy = (isset($arr_attr['price_lcy']) && $arr_attr['price_lcy'] != '')?$arr_attr['price_lcy']:0;
        $currency_history_conversion_rate = (isset($arr_attr['currency_history_conversion_rate']) && $arr_attr['currency_history_conversion_rate'] != '')?$arr_attr['currency_history_conversion_rate']:0;

        if ($update_id == 0) {

            $Sql = "INSERT INTO haulier 
                                    SET
										PriceAddedByEmployeeID='" . $arr_attr['price_received_by'] . "',
                                        haulierLocType_from_name='" . $arr_attr['haulierLocType_from_name'] . "',

                                        haulierLoc_from_warehouse_id = '" . $arr_attr['warehouseLocfromID'] . "',
                                        haulierLoc_from_warehouse_type ='" . $arr_attr['warehouseLocFromType'] . "',

                                        haulierLoc_from_level1='" . $arr_attr['haulierLoc_from_level1'] . "',
                                        haulierLoc_from_level2='" . $arr_attr['haulierLoc_from_level2'] . "',
                                        haulierLoc_from_level3='" . $arr_attr['haulierLoc_from_level3'] . "',
                                        haulierLocType_to_name='" . $arr_attr['haulierLocType_to_name'] . "',

                                        haulierLoc_to_warehouse_id = '" . $arr_attr['warehouseLocToID'] . "',
                                        haulierLoc_to_warehouse_type ='" . $arr_attr['warehouseLocToType'] . "',

                                        units_of_measure_id='" . $arr_attr['uomId'] . "',
                                        haulierShippingMethod_Name='" . $arr_attr['haulierShippingMethod'] . "',
                                        shipQtyMin='" . $arr_attr['shipQtyMin'] . "',
                                        shipQtyMax='" . $arr_attr['shipQtyMax'] . "',
                                        currency_id='" . $arr_attr['currency'] . "',
                                        price='" . $price . "',
                                        priceDate='" . $priceDate . "',
                                        price_lcy='" . $price_lcy . "',                                        
                                        currency_history_id='" . $arr_attr['currency_history'] . "',
                                        currency_history_conversion_rate='" . $currency_history_conversion_rate . "',
                                        notes='" . $arr_attr['notes'] . "',
                                        srm_id='" . $arr_attr['srm_id'] . "',
                                        status='" . $arr_attr['statusID'] . "',
                                        company_id='" . $this->arrUser['company_id'] . "',
                                        AddedBy='" . $this->arrUser['id'] . "',                                        
                                        AddedOn='" . current_date . "'";
        } 
        else 
        {           
            $Sql = "UPDATE haulier 
                                SET
									PriceAddedByEmployeeID='" . $arr_attr['price_received_by'] . "',
                                    haulierLocType_from_name='" . $arr_attr['haulierLocType_from_name'] . "',

                                    haulierLoc_from_warehouse_id = '" . $arr_attr['warehouseLocfromID'] . "',
                                    haulierLoc_from_warehouse_type ='" . $arr_attr['warehouseLocFromType'] . "',

                                    haulierLoc_from_level1='" . $arr_attr['haulierLoc_from_level1'] . "',
                                    haulierLoc_from_level2='" . $arr_attr['haulierLoc_from_level2'] . "',
                                    haulierLoc_from_level3='" . $arr_attr['haulierLoc_from_level3'] . "',
                                    haulierLocType_to_name='" . $arr_attr['haulierLocType_to_name'] . "',

                                    haulierLoc_to_warehouse_id = '" . $arr_attr['warehouseLocToID'] . "',
                                    haulierLoc_to_warehouse_type ='" . $arr_attr['warehouseLocToType'] . "',

                                    units_of_measure_id='" . $arr_attr['uomId'] . "',
                                    haulierShippingMethod_Name='" . $arr_attr['haulierShippingMethod'] . "',
                                    shipQtyMin='" . $arr_attr['shipQtyMin'] . "',
                                    shipQtyMax='" . $arr_attr['shipQtyMax'] . "',
                                    currency_id='" . $arr_attr['currency'] . "',
                                    price='" . $price . "',
                                    priceDate='" . $priceDate . "',
                                    price_lcy='" . $price_lcy . "',                                        
                                    currency_history_id='" . $arr_attr['currency_history'] . "',
                                    currency_history_conversion_rate='" . $currency_history_conversion_rate . "',
                                    notes='" . $arr_attr['notes'] . "',
                                    status='" . $arr_attr['statusID'] . "',
                                    ChangedBy='" . $this->arrUser['id'] . "',                                        
                                    ChangedOn='" . current_date . "'
                                WHERE id = " . $update_id . "   
                                Limit 1";
        }

        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);        

        if ($this->Conn->Affected_Rows() > 0) 
        {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['id'] = $update_id;

            
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
        }

        if($update_id > 0 || $response['ack'] == 1){

            if($update_id > 0){

                $sql2 = "DELETE FROM haulierloc_to_selected 
                         WHERE haulier_id = ". $update_id." AND 
                               company_id = '" . $this->arrUser['company_id'] . "'";

                $rs = $this->objsetup->CSI($sql2);
            }
            else
                $update_id = $this->Conn->Insert_ID();

            foreach($areasLocToArray as $areasLocTo){

                $insertSql = "INSERT INTO haulierloc_to_selected 
                                            SET
                                                haulier_id='" . $update_id . "',
                                                haulierloc_id='" . $areasLocTo->id . "',
                                                haulierLoc_to_level1='" . $areasLocTo->level1. "',
                                                haulierLoc_to_level2='" . $areasLocTo->level2 . "',
                                                haulierLoc_to_level3='" . $areasLocTo->level3 . "',                                        
                                                company_id='" . $this->arrUser['company_id'] . "',
                                                AddedBy='" . $this->arrUser['id'] . "',                                        
                                                AddedOn='" . current_date . "'";
                // echo $insertSql;
                $rs2 = $this->objsetup->CSI($insertSql);
            }

            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['id'] = $update_id;

        }

        return $response;
    }
    //----------Rebate------------------------------------------

    function get_unit_record_popup($attr)
    {
        $response2 = array();
        $response = array();

        $Sql = "SELECT  c.*
                FROM  units_of_measure_setup  c 
                where   c.product_id= '" . $attr['product_id'] . "' and 
                        c.unit_id=".$attr['unit_id']."  and 
                        c.status=1 and 
                        c.company_id=" . $this->arrUser['company_id'] . "		 
                order by  c.quantity DESC "; 
                //c.user_id=".$this->arrUser['id']." 

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response2['response_selected'][] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['total'] = $total;
        }

        //print_r($response2['response_selected']);exit;
        $limit_clause = $where_clause = "";

        $Sql = "SELECT  d.id, d.title 
                FROM units_of_measure  d
                where   d.status=1 and 
                        d.company_id=" . $this->arrUser['company_id'] . "
                group by d.title DESC";

        $RS = $this->objsetup->CSI($Sql);

        $selected_count = 0;
        $first_count = 0;

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                $result = array();
                $result['id'] = $Row['id'];
                $result['title'] = $Row['title'];
                // echo $Row['index']; exit;
                $result['quantity'] = 'a';

                if ($first_count == 0)
                    $result['quantity'] = (float)1; //else $result['quantity'] ='';
                $first_count++;

                $value_count = 0;
                foreach ($response2['response_selected'] as $key => $m_id) 
                {
                    if ($Row['id'] == $m_id['record_id']) 
                    {
                        $value_count = 1;
                        $result['check_id'] = $value_count;
                        //	if($m_id['quantity']!=0)
                        $result['quantity'] = (float)$m_id['quantity'];
                        $result['cat_id'] = $m_id['cat_id'];

                        if ($selected_count == 0)
                            $result['quantity'] = (float)1;
                        $selected_count++;
                    }
                }
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }

        if ($selected_count == 0)
            $response['selected_count'] = 0;
        else
            $response['selected_count'] = $selected_count;
        //print_r($response['response']);
        //$response_sort=array();
        //sort array associate
        $response['response'] = $this->orderBy($response['response'], 'quantity');
        //print_r($response_sort);
        return $response;
    }

    function orderBy($data, $field)
    {
        $code = "return strnatcmp(\$a['".$field."'], \$b['".$field."']);";
        usort($data, create_function('$a,$b', $code));
        return $data;
    }

    function add_unit_record_popup($arr_attr)
    {
        //$this->objGeneral->mysql_clean($arr_attr);
        //print_r($arr_attr);exit;
        $chk = 0;
        $Sqli = "DELETE FROM units_of_measure_setup WHERE product_id = ".$arr_attr['product_id']." ";
        $RS = $this->objsetup->CSI($Sqli);

        foreach ($arr_attr['Data'] as $item) 
        {
            // if($item->check_id>0)	
            if ($chk == 0)
                $item->cat_id = $arr_attr['unit_id'];

            if ($item->cat_id > 0) 
            {
                $SqlQuote = "INSERT INTO units_of_measure_setup
                                            SET 
                                                product_id='" . $arr_attr['product_id'] . "',
                                                product_code='" . $arr_attr['product_code'] . "',
                                                unit_id='" . $arr_attr['unit_id'] . "',
                                                record_id='" . $item->id . "',
                                                check_id='" . $item->check_id . "',
                                                quantity='" . $item->quantity . "',
                                                cat_id='" . $item->cat_id . "',
                                                company_id='" . $this->arrUser['company_id'] . "',
                                                user_id='" . $this->arrUser['id'] . "'";

                                            //,unit_id='".$arr_attr['unit_id']."' ,
                                            //cat_id='".$item->cat_id->id."' 
                $RS = $this->objsetup->CSI($SqlQuote);

                if ($this->Conn->Affected_Rows() > 0)
                    $chk = true;
                else
                    $chk = false;
            }
        }
        //echo $SqlQuote."<hr>"; exit;
        if ($chk) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated';
        }

        return $response;
    }

    function get_unit_setup_list_category($attr)
    {
        $response = array();

        $Sql = "SELECT  c.id,us.title as name
                FROM  units_of_measure_setup  c
                LEFT JOIN units_of_measure us on us.id=c.cat_id 
                where   c.status=1  and 
                        product_id='" . $attr['product_id'] . "' and 
                        c.company_id=" . $this->arrUser['company_id'] . "
                order by  c.id DESC "; 
        
        //c.user_id=".$this->arrUser['id']."

        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow())
             {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['total'] = $total;
        }

        // print_r($response);exit;
        return $response;
    }

    function get_sale_offer_volume_by_type($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT p.*,
                       (SELECT wh.title  FROM units_of_measure_setup st 
                        Left JOIN units_of_measure as wh ON wh.id = st.cat_id
                        where st.id =p.unit_category ) as cat_name 
                FROM srm_rebate_volume p
                WHERE p.type='".$attr['type']."'  AND p.category= '".$attr['category']."'  AND p.status=1 AND p.srm_id='".$attr['srm_id']."'
                AND p.product_id='".$attr['product_id']."' ";

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['quantity_from'] . '-' . $Row['quantity_to'] . ' ' . $Row['cat_name'];
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

    function add_sale_offer_volume($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        //print_r($arr_attr);exit;
        $id = $arr_attr['id'];
        $update_check = "";

        if ($id > 0)
            $update_check = "  AND tst.id <> '" . $id . "'";

        $data_pass = "  tst.category='" . $arr_attr['category'] . "' and 
                        tst.product_id='" . $arr_attr['product_id'] . "' and 
                        tst.srm_id='" . $arr_attr['srm_id'] . "' and 
                        tst.unit_category='" . $arr_attr['unit_categorys'] . "' and
                        ($arr_attr[quantity_from] BETWEEN tst.quantity_from AND tst.quantity_to or 
                         $arr_attr[quantity_to] BETWEEN tst.quantity_from AND tst.quantity_to ) $update_check ";

        $total = $this->objGeneral->count_duplicate_in_sql('srm_rebate_volume', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) 
        {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($id == 0) 
        {
            // Insert record into the document
            $Sql = "INSERT INTO srm_rebate_volume 
                                    SET
										type='" . $arr_attr['type'] . "', 
                                        category='" . $arr_attr['category'] . "', 
                                        product_id='" . $arr_attr['product_id'] . "', 
                                        srm_id='" . $arr_attr['srm_id'] . "', 
                                        quantity_from='" . $arr_attr['quantity_from'] . "',
                                        quantity_to='" . $arr_attr['quantity_to'] . "',
                                        unit_category='" . $arr_attr['unit_categorys'] . "',
                                        company_id='" . $this->arrUser['company_id'] . "',
                                        user_id='" . $this->arrUser['id'] . "'";

            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
        }

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

    function get_sale_offer_rev_by_type($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT p.*,
                       (SELECT wh.title  FROM units_of_measure_setup st 
                        Left JOIN units_of_measure as wh ON wh.id = st.cat_id
                        where st.id =p.unit_category AND 
                              st.product_id='$attr[product_id]'  
                              limit 1) as cat_name 
                FROM srm_revenue_volume p
                WHERE p.type='".$attr['type']."' AND 
                      p.category= '$attr[category]'  AND 
                      p.status=1 AND 
                      p.srm_id='$attr[srm_id]' AND 
                      p.product_id='$attr[product_id]'  ";

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['quantity_from'] . '-' . $Row['quantity_to'] . ' ' . $Row['cat_name'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else 
        {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_sale_offer_rev($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        //print_r($arr_attr);exit;
        $id = $arr_attr['id'];
        $update_check = "";

        if ($id > 0)
            $update_check = "  AND tst.id <> '" . $id . "'";

        $data_pass = " tst.category='" . $arr_attr['category'] . "' and 
                       tst.product_id='" . $arr_attr['product_id'] . "' and 
                       tst.srm_id='" . $arr_attr['srm_id'] . "' and 
                       tst.unit_category='" . $arr_attr['unit_categorys'] . "' and 
                       ($arr_attr[quantity_from] BETWEEN tst.quantity_from AND tst.quantity_to or 
                        $arr_attr[quantity_to] BETWEEN tst.quantity_from AND tst.quantity_to ) $update_check";

        $total = $this->objGeneral->count_duplicate_in_sql('srm_revenue_volume', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) 
        {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($id == 0) 
        {
            $Sql = "INSERT INTO srm_revenue_volume 
                                    SET
										type='" . $arr_attr['type'] . "', 
                                        category='" . $arr_attr['category'] . "', 
                                        product_id='" . $arr_attr['product_id'] . "', 
                                        srm_id='" . $arr_attr['srm_id'] . "', 
                                        quantity_from='" . $arr_attr['quantity_from'] . "',
                                        quantity_to='" . $arr_attr['quantity_to'] . "',
                                        unit_category='" . $arr_attr['unit_categorys'] . "',
                                        company_id='" . $this->arrUser['company_id'] . "',
                                        user_id='" . $this->arrUser['id'] . "'";
        }
        //	echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) 
        {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record Inserted Successfully';
        } 
        else 
        {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
        }
        return $response;
    }

    function get_rebate_data($attr)
    {
        //print_r($attr);
        $Sql = "SELECT sr.*,st.rebate_id,st.product_id
				FROM srm_rebate sr
				left join srm_rebate_items st on st.rebate_id= sr.id
				WHERE sr.id=".$attr['id']."
				LIMIT 1";
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) 
        {
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

    function get_listing_order($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";
        $response = array();

        if ($attr['type'] == 3)
            $add = "AND d.type in (".$attr['type'].") ";
        else
            $add = "AND d.type in (2,".$attr['type'].") ";

        $Sql = "SELECT  d.*,srm.id as ids
                FROM srm_invoice  d
                left  JOIN company on company.id=d.company_id 
                left  JOIN srm on srm.id=d.sell_to_cust_id 
                where d.status=1 AND 
                      d.company_id=" . $this->arrUser['company_id'] . "  ".$add."  " . $where_clause . " 
                order by d.id DESC";

        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, 'purchase_order', sr_ViewPermission);


        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                $result = array();
                $result['id'] = $Row['ids'];
                $result['invoice_id'] = $Row['id'];
                $result['type'] = $Row['type'];
                $result['code'] = $Row['invoice_code'];
                $result['name'] = $Row['sell_to_cust_name'];
                $result['address_1'] = $Row['sell_to_address'];
                $result['address_2'] = $Row['sell_to_address2'];
                $result['city'] = $Row['sell_to_city'];
                $result['country'] = $Row['country']; // $Row['cuname'];
                $result['contact_person'] = $Row['sell_to_contact_no'];

                if ($attr[more_fields] == '1') 
                {
                    $result['outstanding'] = $Row['outstanding'];
                    $result['account_payable_id'] = $Row['account_payable_id'];
                    $result['purchase_code_id'] = $Row['purchase_code_id'];
                    $result['postcode'] = $Row['sell_to_post_code'];
                    $result['phone'] = $Row['sell_to_contact_no'];
                    $result['email'] = $Row['email'];
                    $result['fax'] = $Row['fax'];
                    $result['srm_purchase_code'] = $Row['srm_purchase_code'];
                    $result['cust_phone'] = $Row['cust_phone'];
                    $result['cust_fax'] = $Row['cust_fax'];
                    $result['cust_email'] = $Row['cust_email'];
                    $result['supp_order_no'] = $Row['supp_order_no'];
                    $result['requested_delivery_date'] = $this->objGeneral->convert_unix_into_date($Row['requested_delivery_date']);
                    $result['receiptDate'] = $this->objGeneral->convert_unix_into_date($Row['receiptDate']);
                    $result['invoice_date'] = $this->objGeneral->convert_unix_into_date($Row['invoice_date']);
                    $result['order_date'] = $this->objGeneral->convert_unix_into_date($Row['order_date']);
                    $result['comm_book_in_no'] = $Row['comm_book_in_no'];
                    $result['order_list_name'] = $Row['order_list_name'];
                    //$result['anumber'] = $Row['account_payable_number'];
                    //$result['pnumber'] = $Row['purchase_code_number'];
                    //$result['payment_method'] = $Row['payment_method_id'];
                    //$result['payment_term'] = $Row['payment_terms_id'];
                    $result['currency_id'] = $Row['currency_id'];
                    $result['currency_rate'] = $Row['currency_rate'];
                }
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }
    
    function get_supplier_invoice_listings_for_refund($attr)
    {
        // print_r($attr);exit;
        $posting_date = $this->objGeneral->convert_date($attr['posting_date']);

        $response = array();
        $Sql = "SELECT  
                d.id, d.invoice_code as code, 
                d.invoice_date AS posting_date, 
                d.sell_to_cust_name as name, 
                d.grand_total as total_amount, 
                d.grand_total_converted AS converted_amount,
                d.currency_id,
                d.converted_currency_id,
                d.currency_rate,
                (SELECT code from currency where id = d.currency_id) as currency_code,
                (SELECT code from currency where id = d.converted_currency_id) as converted_currency_code,
                (SELECT COALESCE(SUM(amount_allocated),0)  -- get temp allocated in case of journal (in case of posted that are already added to setteled amount)
                                FROM payment_allocation pa, gl_journal_receipt AS gl_jr
                                WHERE 
                                    pa.company_id = " . $this->arrUser['company_id'] . " AND
                                    pa.payment_id = gl_jr.id AND
                                    pa.status = 0 AND
                                    gl_jr.type = 1 AND
                                        (
                                            (pa.document_type = 3 AND pa.invoice_id = d.id) OR
                                            (pa.invoice_type = 3 AND pa.payment_id = d.id)
                                        )
                                    ) + 
                        d.setteled_amount AS paid_amount,
                'Purchase Invoice' AS payment_type,
                '0' AS cust_payment_id,
                d.on_hold,
                (CASE
                    WHEN d.on_hold = 1 THEN
                        (SELECT comments FROM on_hold_invoice WHERE invoice_id=d.id AND invoice_type = 3 ORDER BY id DESC LIMIT 1)
                    ELSE
                        ''
                END) AS on_hold_message
                FROM srm_invoice  d
                WHERE d.type IN(2,3) AND 
                      d.company_id=" . $this->arrUser['company_id'] . " AND 
                      d.sell_to_cust_id = ".$attr['account_id']." AND 
                      d.currency_id = ".$attr['currency_id']." AND 
                      ROUND(d.remaining_amount, 2) > 0

                UNION
                
                SELECT  
                    d.id, 
                    d.invoiceNo as code, 
                    d.posting_date, 
                    d.moduleNo as name, 
                    (CASE
                            WHEN d.creditAmount > 0 THEN d.creditAmount
                            WHEN d.debitAmount > 0 THEN d.debitAmount
                        END ) AS total_amount,
                    d.converted_price AS converted_amount,
                    d.currency_id,
                    d.converted_currency_id,
                    d.convRate AS currency_rate,
                    (SELECT code from currency where id = d.currency_id) as currency_code,
                    (SELECT code from currency where id = d.converted_currency_id) as converted_currency_code,
                    (SELECT COALESCE(SUM(amount_allocated),0)  -- get temp allocated in case of journal (in case of posted that are already added to setteled amount)
                                FROM payment_allocation pa, gl_journal_receipt AS gl_jr
                                WHERE 
                                    pa.company_id = " . $this->arrUser['company_id'] . " AND
                                    pa.status = 0 AND
                                    pa.payment_id = gl_jr.id AND
                                    gl_jr.type = 1 AND
                                        (
                                            (pa.document_type = 9 AND pa.invoice_id = d.id) OR
                                            (pa.invoice_type = 9 AND pa.payment_id = d.id)
                                        )
                                    ) + d.allocated_amount as paid_amount,
                    'Opening Balance Invoice' AS payment_type,
                    '0' AS cust_payment_id,
                    d.on_hold,
                    (CASE
                        WHEN d.on_hold = 1 THEN
                            (SELECT comments FROM on_hold_invoice WHERE invoice_id=d.id AND invoice_type = 6 ORDER BY id DESC LIMIT 1)
                        ELSE
                            ''
                    END) AS on_hold_message 
                    FROM opening_balance_customer  d
                    WHERE 
                            d.type = 2 AND
                            d.docType = 1 AND
                            d.postStatus = 1 AND
                            d.company_id=" . $this->arrUser['company_id'] . " AND 
                            d.moduleID = ".$attr['account_id']." AND 
                            d.currency_id = ".$attr['currency_id']." AND 
                            (CASE
                                WHEN d.creditAmount > 0 THEN d.creditAmount
                                WHEN d.debitAmount > 0 THEN d.debitAmount
                            END ) > ROUND(d.allocated_amount, 2)
                    
                UNION
                
                SELECT  
                    d.id, 
                    d.invoiceNo as code, 
                    d.posting_date, 
                    d.moduleNo as name, 
                    (CASE
                            WHEN d.creditAmount > 0 THEN d.creditAmount
                            WHEN d.debitAmount > 0 THEN d.debitAmount
                        END ) AS total_amount,
                    d.converted_price AS converted_amount,
                    d.currency_id,
                    d.converted_currency_id,
                    d.convRate AS currency_rate,
                    (SELECT code from currency where id = d.currency_id) as currency_code,
                    (SELECT code from currency where id = d.converted_currency_id) as converted_currency_code,
                    (SELECT COALESCE(SUM(amount_allocated),0)  -- get temp allocated in case of journal (in case of posted that are already added to setteled amount)
                                FROM payment_allocation pa, gl_journal_receipt AS gl_jr
                                WHERE 
                                    pa.company_id = " . $this->arrUser['company_id'] . " AND
                                    pa.status = 0 AND
                                    pa.payment_id = gl_jr.id AND
                                    gl_jr.type = 1 AND
                                        (
                                            (pa.document_type = 14 AND pa.invoice_id = d.id) OR
                                            (pa.invoice_type = 14 AND pa.payment_id = d.id)
                                        )
                                    ) + d.allocated_amount as paid_amount,
                    'Bank Opening Balance Refund' AS payment_type,
                    '0' AS cust_payment_id,
                    d.on_hold,
                    (CASE
                        WHEN d.on_hold = 1 THEN
                            (SELECT comments FROM on_hold_invoice WHERE invoice_id=d.id AND invoice_type = 7 ORDER BY id DESC LIMIT 1)
                        ELSE
                            ''
                    END) AS on_hold_message
                    FROM opening_balance_bank  d
                    WHERE 
                            d.type = 2 AND
                            d.docType = 2 AND
                            d.postStatus = 1 AND
                            d.company_id=" . $this->arrUser['company_id'] . " AND 
                            d.moduleID = ".$attr['account_id']." AND 
                            d.currency_id = ".$attr['currency_id']." AND 
                            (CASE
                                WHEN d.creditAmount > 0 THEN d.creditAmount
                                WHEN d.debitAmount > 0 THEN d.debitAmount
                            END ) > ROUND(d.allocated_amount, 2)
                    
                UNION
                
                SELECT pd.id, 
                        pd.document_no AS code, 
                        pd.posting_date, 
                        pd.account_name as cust_name, 
                        (CASE
                            WHEN pd.credit_amount > 0 THEN pd.credit_amount
                            WHEN pd.debit_amount > 0 THEN pd.debit_amount
                        END ) AS total_amount,
                        pd.converted_price AS converted_amount,
                        pd.currency_id,
                        pd.converted_currency_id,
                        pd.cnv_rate AS currency_rate,
                        (SELECT code from currency where id = pd.currency_id) as currency_code,
                        (SELECT code from currency where id = pd.converted_currency_id) as converted_currency_code,
                        (pd.allocated_amount + pd.temp_allocated_amount) as paid_amount,
                        'Refund' AS payment_type,
                        gl_jr.id AS cust_payment_id,
                        pd.on_hold,
                        (CASE
                            WHEN pd.on_hold = 1 THEN
                                (SELECT comments FROM on_hold_invoice WHERE invoice_id=pd.id AND invoice_type = 5 ORDER BY id DESC LIMIT 1)
                            ELSE
                                ''
                        END) AS on_hold_message
                FROM gl_journal_receipt AS gl_jr, payment_details AS pd
                WHERE
                    gl_jr.id = pd.parent_id AND 
                    gl_jr.type = 2 AND
                    pd.document_type IN (1, 3) AND
                    pd.credit_amount > 0 AND
                    pd.transaction_type = 3 AND 
                    pd.currency_id = ".$attr['currency_id']." AND 
                    (CASE
                        WHEN pd.credit_amount > 0 THEN pd.credit_amount
                        WHEN pd.debit_amount > 0 THEN pd.debit_amount
                    END ) > ROUND(pd.allocated_amount, 2) AND
                    pd.account_id = ".$attr['account_id']."
                    
                order by posting_date DESC";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                $result = array();

                $result['order_id']             = $Row['id'];
                $result['code']                 = $Row['code'];
                $result['invoice_date']         = $this->objGeneral->convert_unix_into_date($Row['posting_date']);
                $result['name']                 = $Row['name'];
                $result['grand_total']          = $Row['total_amount'];
                $result['converted_amount']     = $Row['converted_amount'];
                $result['paid_amount']          = $Row['paid_amount'];
                $result['outstanding_amount']   = $Row['total_amount'] - $Row['paid_amount'];
                $result['currency_code']        = $Row['currency_code'];
                $result['converted_currency_code']= ($Row['converted_currency_code'] != null) ? $Row['converted_currency_code'] : $Row['currency_code'];
                $result['currency_id']          = $Row['currency_id'];
                $result['currency_rate']        = $Row['currency_rate'];
                $result['converted_currency_id']= $Row['converted_currency_id'];
                $result['payment_type']         = $Row['payment_type'];
                $result['cust_payment_id']      = $Row['cust_payment_id'];
                $result['on_hold']              = $Row['on_hold'];
                $result['on_hold_message']      = $Row['on_hold_message'];
                
                if($posting_date > strtotime(date('Y-m-d')) || $Row['posting_date'] > strtotime(date('Y-m-d')))
                {
                    $result['allocation_date'] = ($posting_date >=  $Row['posting_date']) ? $this->objGeneral->convert_unix_into_date($posting_date) : $this->objGeneral->convert_unix_into_date($Row['posting_date']);
                }
                else
                {
                    $result['allocation_date'] = $this->objGeneral->convert_unix_into_date(strtotime(date('Y-m-d')));
                }

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();
        
        return $response;
    }

    function get_supplier_invoice_listings_for_payment($attr)
    {
        // print_r($attr);exit;
        $response = array();
        $posting_date = $this->objGeneral->convert_date($attr['posting_date']);
        
        $Sql = "SELECT  d.id, d.invoice_code as code, 
                        d.supplierCreditNoteDate as posting_date, 
                        d.supplierName as cust_name, 
                        d.grand_total as total_amount, 
                        d.grand_total_converted AS converted_amount,
                        d.currency_id,
                        d.converted_currency_id,
                        d.currency_rate,
                        (SELECT code from currency where id = d.currency_id) as currency_code,
                        (SELECT code from currency where id = d.converted_currency_id) as converted_currency_code,
                        (SELECT COALESCE(SUM(amount_allocated),0)  -- get temp allocated in case of journal (in case of posted that are already added to setteled amount)
                                FROM payment_allocation pa, gl_journal_receipt AS gl_jr
                                WHERE 
                                    pa.company_id = " . $this->arrUser['company_id'] . " AND
                                    pa.status = 0 AND
                                    pa.payment_id = gl_jr.id AND
                                    gl_jr.type = 1 AND
                                        (
                                            (pa.document_type = 4 AND pa.invoice_id = d.id) OR
                                            (pa.invoice_type = 4 AND pa.payment_id = d.id)
                                        )
                                    ) + 
                        d.setteled_amount AS paid_amount,
                        'Debit Note' AS payment_type,
                        '0' AS cust_payment_id,
                        d.on_hold,
                        (CASE
                            WHEN d.on_hold = 1 THEN
                                (SELECT comments FROM on_hold_invoice WHERE invoice_id=d.id AND invoice_type = 4 ORDER BY id DESC LIMIT 1)
                            ELSE
                                ''
                        END) AS on_hold_message
                FROM srm_order_return  d
                LEFT JOIN currency on currency.id=d.currency_id
                WHERE d.type IN(2,3) AND 
                      d.company_id=" . $this->arrUser['company_id'] . " AND 
                      d.supplierID = ".$attr['account_id']." AND 
                      d.currency_id = ".$attr['currency_id']." AND 
                      ROUND(d.remaining_amount, 2) > 0
                UNION
                
                SELECT  
                    d.id, 
                    d.invoiceNo as code, 
                    d.posting_date, 
                    d.moduleNo as name, 
                    (CASE
                            WHEN d.creditAmount > 0 THEN d.creditAmount
                            WHEN d.debitAmount > 0 THEN d.debitAmount
                        END ) AS total_amount,
                    d.converted_price AS converted_amount,
                    d.currency_id,
                    d.converted_currency_id,
                    d.convRate AS currency_rate,
                    (SELECT code from currency where id = d.currency_id) as currency_code,
                    (SELECT code from currency where id = d.converted_currency_id) as converted_currency_code,
                    (SELECT COALESCE(SUM(amount_allocated),0)  -- get temp allocated in case of journal (in case of posted that are already added to setteled amount)
                                FROM payment_allocation pa, gl_journal_receipt AS gl_jr
                                WHERE 
                                    pa.company_id = " . $this->arrUser['company_id'] . " AND
                                    pa.status = 0 AND
                                    pa.payment_id = gl_jr.id AND
                                    gl_jr.type = 1 AND
                                        (
                                            (pa.document_type = 10 AND pa.invoice_id = d.id) OR
                                            (pa.invoice_type = 10 AND pa.payment_id = d.id)
                                        )
                                    ) + d.allocated_amount as paid_amount,
                    'Opening Balance Debit Note' AS payment_type,
                    '0' AS cust_payment_id,
                    d.on_hold,
                        (CASE
                            WHEN d.on_hold = 1 THEN
                                (SELECT comments FROM on_hold_invoice WHERE invoice_id=d.id AND invoice_type = 6 ORDER BY id DESC LIMIT 1)
                            ELSE
                                ''
                        END) AS on_hold_message
                    FROM opening_balance_customer  d
                    WHERE 
                            d.type = 2 AND
                            d.docType = 2 AND
                            d.postStatus = 1 AND
                            d.company_id=" . $this->arrUser['company_id'] . " AND 
                            d.moduleID = ".$attr['account_id']." AND 
                            d.currency_id = ".$attr['currency_id']." AND 
                            (CASE
                                WHEN d.creditAmount > 0 THEN d.creditAmount
                                WHEN d.debitAmount > 0 THEN d.debitAmount
                            END ) > ROUND(d.allocated_amount, 2)
                    
                
                UNION
                
                SELECT  
                    d.id, 
                    d.invoiceNo as code, 
                    d.posting_date, 
                    d.moduleNo as name, 
                    (CASE
                            WHEN d.creditAmount > 0 THEN d.creditAmount
                            WHEN d.debitAmount > 0 THEN d.debitAmount
                        END ) AS total_amount,
                    d.converted_price AS converted_amount,
                    d.currency_id,
                    d.converted_currency_id,
                    d.convRate AS currency_rate,
                    (SELECT code from currency where id = d.currency_id) as currency_code,
                    (SELECT code from currency where id = d.converted_currency_id) as converted_currency_code,
                    (SELECT COALESCE(SUM(amount_allocated),0)  -- get temp allocated in case of journal (in case of posted that are already added to setteled amount)
                                FROM payment_allocation pa, gl_journal_receipt AS gl_jr
                                WHERE 
                                    pa.company_id = " . $this->arrUser['company_id'] . " AND
                                    pa.status = 0 AND
                                    pa.payment_id = gl_jr.id AND
                                    gl_jr.type = 1 AND
                                        (
                                            (pa.document_type = 13 AND pa.invoice_id = d.id) OR
                                            (pa.invoice_type = 13 AND pa.payment_id = d.id)
                                        )
                                    ) + d.allocated_amount as paid_amount,
                    'Bank Opening Balance Payment' AS payment_type,
                    '0' AS cust_payment_id,
                    d.on_hold,
                        (CASE
                            WHEN d.on_hold = 1 THEN
                                (SELECT comments FROM on_hold_invoice WHERE invoice_id=d.id AND invoice_type = 7 ORDER BY id DESC LIMIT 1)
                            ELSE
                                ''
                        END) AS on_hold_message
                    FROM opening_balance_bank  d
                    WHERE 
                            d.type = 2 AND
                            d.docType = 1 AND
                            d.postStatus = 1 AND
                            d.company_id=" . $this->arrUser['company_id'] . " AND 
                            d.moduleID = ".$attr['account_id']." AND 
                            d.currency_id = ".$attr['currency_id']." AND 
                            (CASE
                                WHEN d.creditAmount > 0 THEN d.creditAmount
                                WHEN d.debitAmount > 0 THEN d.debitAmount
                            END ) > ROUND(d.allocated_amount, 2)
                    
                
                UNION
                
                SELECT pd.id, pd.document_no AS code, 
                        pd.posting_date, 
                        pd.account_name as cust_name, 
                        (CASE
                            WHEN pd.credit_amount > 0 THEN pd.credit_amount
                            WHEN pd.debit_amount > 0 THEN pd.debit_amount
                        END ) AS total_amount,
                        pd.converted_price AS converted_amount,
                        pd.currency_id,
                        pd.converted_currency_id,
                        pd.cnv_rate AS currency_rate,
                        (SELECT code from currency where id = pd.currency_id) as currency_code,
                        (SELECT code from currency where id = pd.converted_currency_id) as converted_currency_code,
                        (pd.allocated_amount + pd.temp_allocated_amount) as paid_amount,
                        'Payment' AS payment_type,
                        gl_jr.id AS cust_payment_id,
                        pd.on_hold,
                        (CASE
                            WHEN pd.on_hold = 1 THEN
                                (SELECT comments FROM on_hold_invoice WHERE invoice_id=pd.id AND invoice_type = 5 ORDER BY id DESC LIMIT 1)
                            ELSE
                                ''
                        END) AS on_hold_message
                FROM gl_journal_receipt AS gl_jr, payment_details AS pd
                WHERE
                    gl_jr.id = pd.parent_id AND 
                    gl_jr.type = 2 AND
                    pd.document_type IN (1, 2) AND
                    pd.debit_amount > 0 AND
                    pd.transaction_type = 3 AND 
                    pd.currency_id = ".$attr['currency_id']." AND 
                    (CASE
                        WHEN pd.credit_amount > 0 THEN pd.credit_amount
                        WHEN pd.debit_amount > 0 THEN pd.debit_amount
                    END ) > ROUND(pd.allocated_amount, 2) AND
                    pd.account_id = ".$attr['account_id']."
                    
                    
                ORDER BY posting_date DESC
                ";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                $result = array();

                $result['order_id']             = $Row['id'];
                $result['code']                 = $Row['code'];
                $result['invoice_date']         = $this->objGeneral->convert_unix_into_date($Row['posting_date']);
                $result['name']                 = $Row['name'];
                $result['grand_total']          = $Row['total_amount'];
                $result['converted_amount']     = $Row['converted_amount'];
                $result['paid_amount']          = $Row['paid_amount'];
                $result['outstanding_amount']   = $Row['total_amount'] - $Row['paid_amount'];
                $result['currency_code']        = $Row['currency_code'];
                $result['converted_currency_code']= ($Row['converted_currency_code'] != null) ? $Row['converted_currency_code'] : $Row['currency_code'];
                $result['currency_id']          = $Row['currency_id'];
                $result['currency_rate']        = $Row['currency_rate'];
                $result['converted_currency_id']= $Row['converted_currency_id'];
                $result['payment_type']         = $Row['payment_type'];
                $result['cust_payment_id']      = $Row['cust_payment_id'];
                $result['on_hold']              = $Row['on_hold'];
                $result['on_hold_message']      = $Row['on_hold_message'];

                if($posting_date > strtotime(date('Y-m-d')) || $Row['posting_date'] > strtotime(date('Y-m-d')))
                {
                    $result['allocation_date'] = ($posting_date >=  $Row['posting_date']) ? $this->objGeneral->convert_unix_into_date($posting_date) : $this->objGeneral->convert_unix_into_date($Row['posting_date']);
                }
                else
                {
                    $result['allocation_date'] = $this->objGeneral->convert_unix_into_date(strtotime(date('Y-m-d')));
                }
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();
        
        return $response;
    }
  
    function get_supplier_invoice_listings_for_payment_paid($attr)
    {
        // print_r($attr);exit;
        $response = array();
        // invoices and refund
        if($attr['invoice_type'] == 3) // Purchase invoices
        {
            $Sql = "SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoice_code AS code,
                        o.supplierCreditNoteDate AS posting_date,                        
                        o.currency_rate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        o.grand_total AS original_amount,
                        'Debit Note' AS payment_type
                        FROM srm_order_return AS o, payment_allocation AS pa
                        WHERE
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
                                pa.payment_id = ".$attr['invoice_id']." AND
                                pa.invoice_id =o.id   AND 
                                pa.invoice_type= 3 AND
                                pa.`document_type` = 4 AND
                                pa.payment_type = 2
                            )
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoice_code AS code,
                        o.supplierCreditNoteDate AS posting_date,                        
                        o.currency_rate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        o.grand_total AS original_amount,
                        'Debit Note' AS payment_type
                        FROM srm_order_return AS o, payment_allocation AS pa
                        WHERE
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            (
                                pa.payment_id = o.id AND
                                pa.invoice_id = ".$attr['invoice_id']." AND 
                                pa.invoice_type= 4 AND
                                pa.`document_type` = 3 AND
                                pa.payment_type = 2
                            )
                    UNION ALL
                    SELECT 
                        gjr.id AS id,
                        amount_allocated AS paid_amount,
                        pd.document_no AS code,
                        pd.`posting_date`,
                        pd.cnv_rate,
                        (SELECT code from currency where id = pd.currency_id) as currency_code,
                        (SELECT code from currency where id = pd.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN pd.credit_amount > 0 THEN pd.credit_amount
                            WHEN pd.debit_amount > 0 THEN pd.debit_amount
                        END ) AS original_amount,
                        'Payment' AS payment_type
                        FROM payment_allocation AS pa, payment_details AS pd, `gl_journal_receipt` AS gjr
                    WHERE
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                        gjr.id = pd.parent_id AND
                        (
                            
                            (
                                pd.id = `pa`.`payment_detail_id` AND
                                pd.document_type IN (1, 2) AND
                                pd.debit_amount > 0 AND
                                pd.transaction_type = 3 AND 
                                pa.invoice_id = ".$attr['invoice_id']." AND 
                                pa.invoice_type= 5 AND
                                pa.document_type= 3 AND
                                pa.payment_type = 1
                            )
                        ) 
                    
                    UNION ALL
                    SELECT 
                        gjr.id AS id,
                        amount_allocated AS paid_amount,
                        pd.document_no AS code,
                        pd.`posting_date`,
                        pd.cnv_rate,
                        (SELECT code from currency where id = pd.currency_id) as currency_code,
                        (SELECT code from currency where id = pd.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN pd.credit_amount > 0 THEN pd.credit_amount
                            WHEN pd.debit_amount > 0 THEN pd.debit_amount
                        END ) AS original_amount,
                        'Payment' AS payment_type
                        FROM payment_allocation AS pa, payment_details AS pd, `gl_journal_receipt` AS gjr
                    WHERE
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                        gjr.id = pd.parent_id AND
                        (
                            (
                                pd.id = `pa`.`invoice_id` AND
                                pd.document_type IN (1, 2) AND
                                pd.debit_amount > 0 AND
                                pd.transaction_type = 3 AND 
                                pa.payment_id = ".$attr['invoice_id']." AND 
                                pa.invoice_type= 3 AND
                                pa.document_type= 5 AND
                                pa.payment_type = 2
                            )
                        ) 
                    
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Opening Balance Debit Note' AS payment_type
                        FROM opening_balance_customer AS o, payment_allocation AS pa
                        WHERE
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                             
                            (
				                pa.payment_id = ".$attr['invoice_id']." AND
                                pa.invoice_id = o.id AND 
                                pa.invoice_type= 3 AND
                                pa.document_type= 10 AND
                                pa.payment_type = 2
                            )
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Opening Balance Debit Note' AS payment_type
                        FROM opening_balance_customer AS o, payment_allocation AS pa
                        WHERE
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                             
                            (
                                pa.payment_id = o.id AND
                                pa.invoice_id = ".$attr['invoice_id']." AND 
                                pa.invoice_type= 10 AND
                                pa.document_type= 3 AND
                                pa.payment_type = 1
                            )
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Bank Opening Balance Payment' AS payment_type
                        FROM opening_balance_bank AS o, payment_allocation AS pa
                        WHERE
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                             
                            (
				                pa.payment_id = ".$attr['invoice_id']." AND
                                pa.invoice_id = o.id AND 
                                pa.invoice_type= 3 AND
                                pa.document_type= 13 AND
                                pa.payment_type = 2
                            )  
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Bank Opening Balance Payment' AS payment_type
                        FROM opening_balance_bank AS o, payment_allocation AS pa
                        WHERE
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                             
                            (
                                pa.payment_id = o.id AND
                                pa.invoice_id = ".$attr['invoice_id']." AND 
                                pa.invoice_type= 13 AND
                                pa.document_type= 3 AND
                                pa.payment_type = 1
                            )             
                    "; //
        }
        else if($attr['invoice_type'] == 6)
        {
            $Sql = "SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoice_code AS code,
                        o.supplierCreditNoteDate AS posting_date,
                        o.currency_rate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        o.grand_total AS original_amount,
                        'Debit Note' AS payment_type
                        FROM srm_order_return AS o, payment_allocation AS pa
                        WHERE
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                             
                            (
                                pa.invoice_id = ".$attr['detail_id']." AND
                                pa.payment_id = o.id AND 
                                pa.invoice_type= 4 AND
                                pa.`document_type` = 6 AND
                                pa.payment_type = 1
                            )
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoice_code AS code,
                        o.supplierCreditNoteDate AS posting_date,
                        o.currency_rate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        o.grand_total AS original_amount,
                        'Debit Note' AS payment_type
                        FROM srm_order_return AS o, payment_allocation AS pa
                        WHERE
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                             
                            (
                                pa.invoice_id = o.id AND
                                pa.payment_detail_id = ".$attr['detail_id']." AND 
                                pa.invoice_type= 6 AND
                                pa.`document_type` = 4 AND
                                pa.payment_type = 1
                            )
                    UNION ALL
                    SELECT 
                        gjr.id AS id,
                        amount_allocated AS paid_amount,
                        pd.document_no AS code,
                        pd.`posting_date`,
                        pd.cnv_rate,
                        (SELECT code from currency where id = pd.currency_id) as currency_code,
                        (SELECT code from currency where id = pd.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN pd.credit_amount > 0 THEN pd.credit_amount
                            WHEN pd.debit_amount > 0 THEN pd.debit_amount
                        END ) AS original_amount,                        
                        'Payment' AS payment_type
                        FROM payment_allocation AS pa, payment_details AS pd, `gl_journal_receipt` AS gjr
                    WHERE
                        pa.company_id = " . $this->arrUser['company_id'] . " AND
                        gjr.id = pd.parent_id AND
                        (
                            (
                                pd.id = `pa`.`payment_detail_id` AND
                                pd.document_type IN (1, 2) AND
                                pd.debit_amount > 0 AND
                                pd.transaction_type = 3 AND 
                                pa.invoice_id = ".$attr['detail_id']." AND 
                                pa.invoice_type= 5 AND
                                pa.document_type = 6
                            )
                        )
                         AND
                        pa.payment_type = 1
                    UNION ALL
                    SELECT 
                        gjr.id AS id,
                        amount_allocated AS paid_amount,
                        pd.document_no AS code,
                        pd.`posting_date`,
                        pd.cnv_rate,
                        (SELECT code from currency where id = pd.currency_id) as currency_code,
                        (SELECT code from currency where id = pd.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN pd.credit_amount > 0 THEN pd.credit_amount
                            WHEN pd.debit_amount > 0 THEN pd.debit_amount
                        END ) AS original_amount,                        
                        'Payment' AS payment_type
                        FROM payment_allocation AS pa, payment_details AS pd, `gl_journal_receipt` AS gjr
                    WHERE
                        pa.company_id = " . $this->arrUser['company_id'] . " AND
                        gjr.id = pd.parent_id AND
                        (
                            (
                                pd.id = `pa`.`invoice_id` AND
                                pd.document_type IN (1, 2) AND
                                pd.debit_amount > 0 AND
                                pd.transaction_type = 3 AND 
                                pa.payment_detail_id = ".$attr['detail_id']." AND 
                                pa.invoice_type= 6 AND
                                pa.document_type = 5
                            )
                        )
                         AND
                        pa.payment_type = 1
           
                    
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Opening Balance Debit Note' AS payment_type
                        FROM opening_balance_customer AS o, payment_allocation AS pa
                        WHERE
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            (
                                pa.invoice_id = ".$attr['detail_id']."   AND
                                pa.payment_id = o.id AND 
                                pa.invoice_type= 10 AND
                                pa.document_type= 6 AND
                                pa.payment_type = 1
                            )             
                    
                            UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Opening Balance Debit Note' AS payment_type
                        FROM opening_balance_customer AS o, payment_allocation AS pa
                        WHERE
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                             
                            (
                                pa.payment_detail_id = ".$attr['detail_id']."  AND
                                pa.invoice_id = o.id AND 
                                pa.invoice_type= 6 AND
                                pa.document_type= 10 AND
                                pa.payment_type = 1
                            )   
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Bank Opening Balance Payment' AS payment_type
                        FROM opening_balance_bank AS o, payment_allocation AS pa
                        WHERE
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                             
                            (
				                pa.payment_detail_id = ".$attr['detail_id']." AND
                                pa.invoice_id = o.id AND 
                                pa.invoice_type= 6 AND
                                pa.document_type= 13 AND
                                pa.payment_type = 1
                            )    
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Bank Opening Balance Payment' AS payment_type
                        FROM opening_balance_bank AS o, payment_allocation AS pa
                        WHERE
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                             
                            (
                                pa.payment_id = o.id AND
                                pa.invoice_id = ".$attr['detail_id']." AND 
                                pa.invoice_type= 13 AND
                                pa.document_type= 6 AND
                                pa.payment_type = 1
                            )        
                    "; //
        }        
        else if($attr['invoice_type'] == 9)
        {
            $Sql = "SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoice_code AS code,
                        o.supplierCreditNoteDate AS posting_date,                        
                        o.currency_rate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        o.grand_total AS original_amount,
                        'Debit Note' AS payment_type
                        FROM srm_order_return AS o, payment_allocation AS pa
                        WHERE
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                             
                            (
                                pa.payment_id = o.id  AND
                                pa.invoice_id = ".$attr['invoice_id']." AND 
                                pa.invoice_type= 4 AND
                                pa.`document_type` = 9 AND
                                pa.payment_type = 2 
                            )
                            
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoice_code AS code,
                        o.supplierCreditNoteDate AS posting_date,                        
                        o.currency_rate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        o.grand_total AS original_amount,
                        'Debit Note' AS payment_type
                        FROM srm_order_return AS o, payment_allocation AS pa
                        WHERE
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                             
                            (
                                pa.payment_id = ".$attr['invoice_id']." AND
                                pa.invoice_id = o.id AND 
                                pa.invoice_type= 9 AND
                                pa.`document_type` = 4 AND
                                pa.payment_type = 1 
                            )
                            
                    UNION ALL
                    SELECT 
                        gjr.id AS id,
                        amount_allocated AS paid_amount,
                        pd.document_no AS code,
                        pd.`posting_date`,
                        pd.cnv_rate,
                        (SELECT code from currency where id = pd.currency_id) as currency_code,
                        (SELECT code from currency where id = pd.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN pd.credit_amount > 0 THEN pd.credit_amount
                            WHEN pd.debit_amount > 0 THEN pd.debit_amount
                        END ) AS original_amount,
                        'Payment' AS payment_type
                        FROM payment_allocation AS pa, payment_details AS pd, `gl_journal_receipt` AS gjr
                    WHERE
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                        gjr.id = pd.parent_id AND
                        (
                            (
                                pd.id = `pa`.`payment_detail_id` AND
                                pd.document_type IN (1, 2) AND
                                pd.debit_amount > 0 AND
                                pd.transaction_type = 3 AND 
                                pa.invoice_id = ".$attr['invoice_id']." AND 
                                pa.invoice_type= 5 AND
                                pa.document_type = 9
                            )                                
                        )
                         AND
                        pa.payment_type = 1

                    UNION ALL
                    SELECT 
                        gjr.id AS id,
                        amount_allocated AS paid_amount,
                        pd.document_no AS code,
                        pd.`posting_date`,
                        pd.cnv_rate,
                        (SELECT code from currency where id = pd.currency_id) as currency_code,
                        (SELECT code from currency where id = pd.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN pd.credit_amount > 0 THEN pd.credit_amount
                            WHEN pd.debit_amount > 0 THEN pd.debit_amount
                        END ) AS original_amount,
                        'Payment' AS payment_type
                        FROM payment_allocation AS pa, payment_details AS pd, `gl_journal_receipt` AS gjr
                    WHERE
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                        gjr.id = pd.parent_id AND
                        (
                            (
                                pd.id = `pa`.`invoice_id` AND
                                pd.document_type IN (1, 2) AND
                                pd.debit_amount > 0 AND
                                pd.transaction_type = 3 AND 
                                pa.payment_id = ".$attr['invoice_id']." AND 
                                pa.invoice_type= 9 AND
                                pa.document_type = 5
                            )                            
                        )
                         AND
                        pa.payment_type = 1

                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Opening Balance Debit Note' AS payment_type
                        FROM opening_balance_customer AS o, payment_allocation AS pa
                        WHERE 
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
                                pa.payment_id = o.id AND
                                pa.invoice_id = ".$attr['invoice_id']."  AND 
                                pa.invoice_type= 10 AND
                                pa.document_type= 9 AND
                                pa.payment_type = 1
                            ) 
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Opening Balance Debit Note' AS payment_type
                        FROM opening_balance_customer AS o, payment_allocation AS pa
                        WHERE 
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
                                pa.payment_id = ".$attr['invoice_id']."  AND
                                pa.invoice_id = o.id AND 
                                pa.invoice_type= 9 AND
                                pa.document_type= 10 AND
                                pa.payment_type = 1
                            ) 
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Bank Opening Balance Payment' AS payment_type
                        FROM opening_balance_bank AS o, payment_allocation AS pa
                        WHERE 
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
				                pa.payment_id = ".$attr['invoice_id']." AND
                                pa.invoice_id = o.id AND 
                                pa.invoice_type= 9 AND
                                pa.document_type= 13 AND
                                pa.payment_type = 1
                            )   
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Bank Opening Balance Payment' AS payment_type
                        FROM opening_balance_bank AS o, payment_allocation AS pa
                        WHERE 
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
                                pa.payment_id = o.id AND
                                pa.invoice_id = ".$attr['invoice_id']." AND 
                                pa.invoice_type= 13 AND
                                pa.document_type= 9 AND
                                pa.payment_type = 1
                            )
                    "; //
        }        
        else if($attr['invoice_type'] == 14)
        {
            $Sql = "SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoice_code AS code,
                        o.supplierCreditNoteDate AS posting_date,                        
                        o.currency_rate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        o.grand_total AS original_amount,
                        'Debit Note' AS payment_type
                        FROM srm_order_return AS o, payment_allocation AS pa
                        WHERE 
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
                                pa.payment_id = o.id  AND
                                pa.invoice_id = ".$attr['invoice_id']." AND 
                                pa.invoice_type= 4 AND
                                pa.`document_type` = 14 AND
                                pa.payment_type = 2 
                            )
                            
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoice_code AS code,
                        o.supplierCreditNoteDate AS posting_date,                        
                        o.currency_rate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        o.grand_total AS original_amount,
                        'Debit Note' AS payment_type
                        FROM srm_order_return AS o, payment_allocation AS pa
                        WHERE 
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
                                pa.payment_id = ".$attr['invoice_id']." AND
                                pa.invoice_id = o.id AND 
                                pa.invoice_type= 14 AND
                                pa.`document_type` = 4 AND
                                pa.payment_type = 1 
                            )
                            
                    UNION ALL
                    SELECT 
                        gjr.id AS id,
                        amount_allocated AS paid_amount,
                        pd.document_no AS code,
                        pd.`posting_date`,
                        pd.cnv_rate,
                        (SELECT code from currency where id = pd.currency_id) as currency_code,
                        (SELECT code from currency where id = pd.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN pd.credit_amount > 0 THEN pd.credit_amount
                            WHEN pd.debit_amount > 0 THEN pd.debit_amount
                        END ) AS original_amount,
                        'Payment' AS payment_type
                        FROM payment_allocation AS pa, payment_details AS pd, `gl_journal_receipt` AS gjr
                    WHERE
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                        gjr.id = pd.parent_id AND
                        (
                            (
                                pd.id = `pa`.`payment_detail_id` AND
                                pd.document_type IN (1, 2) AND
                                pd.debit_amount > 0 AND
                                pd.transaction_type = 3 AND 
                                pa.invoice_id = ".$attr['invoice_id']." AND 
                                pa.invoice_type= 5 AND
                                pa.document_type = 14
                            )                                
                        )
                         AND
                        pa.payment_type = 1
  
                    UNION ALL
                    SELECT 
                        gjr.id AS id,
                        amount_allocated AS paid_amount,
                        pd.document_no AS code,
                        pd.`posting_date`,
                        pd.cnv_rate,
                        (SELECT code from currency where id = pd.currency_id) as currency_code,
                        (SELECT code from currency where id = pd.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN pd.credit_amount > 0 THEN pd.credit_amount
                            WHEN pd.debit_amount > 0 THEN pd.debit_amount
                        END ) AS original_amount,
                        'Payment' AS payment_type
                        FROM payment_allocation AS pa, payment_details AS pd, `gl_journal_receipt` AS gjr
                    WHERE
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                        gjr.id = pd.parent_id AND
                        (
                            (
                                pd.id = `pa`.`invoice_id` AND
                                pd.document_type IN (1, 2) AND
                                pd.debit_amount > 0 AND
                                pd.transaction_type = 3 AND 
                                pa.payment_id = ".$attr['invoice_id']." AND 
                                pa.invoice_type= 14 AND
                                pa.document_type = 5
                            )                          
                        )
                         AND
                        pa.payment_type = 1

                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Opening Balance Debit Note' AS payment_type
                        FROM opening_balance_customer AS o, payment_allocation AS pa
                        WHERE 
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            (
                                pa.payment_id = o.id AND
                                pa.invoice_id = ".$attr['invoice_id']."  AND 
                                pa.invoice_type= 10 AND
                                pa.document_type= 14 AND
                                pa.payment_type = 1
                            ) 
                            UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Opening Balance Debit Note' AS payment_type
                        FROM opening_balance_customer AS o, payment_allocation AS pa
                        WHERE 
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
                                pa.payment_id = ".$attr['invoice_id']."  AND
                                pa.invoice_id = o.id AND 
                                pa.invoice_type= 14 AND
                                pa.document_type= 10 AND
                                pa.payment_type = 1
                            )
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Bank Opening Balance Payment' AS payment_type
                        FROM opening_balance_bank AS o, payment_allocation AS pa
                        WHERE 
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            (
				                pa.payment_id = ".$attr['invoice_id']." AND
                                pa.invoice_id = o.id AND 
                                pa.invoice_type= 14 AND
                                pa.document_type= 13 AND
                                pa.payment_type = 1
                            )    
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Bank Opening Balance Payment' AS payment_type
                        FROM opening_balance_bank AS o, payment_allocation AS pa
                        WHERE 
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
                                pa.payment_id = o.id AND
                                pa.invoice_id = ".$attr['invoice_id']." AND 
                                pa.invoice_type= 13 AND
                                pa.document_type= 14 AND
                                pa.payment_type = 1
                            )
                    "; //
        }
        
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                if($Row['id'] > 0)
                {
                    $result = array();
                    $result['order_id']         = $Row['id'];
                    $result['code']             = $Row['code'];
                    $result['original_amount']  = $Row['original_amount'];
                    $result['paid_amount']      = $Row['paid_amount'];
                    $result['payment_type']     = $Row['payment_type'];
                    $result['currency_code']    = $Row['currency_code'];
                    
                    $result['invoice_date']     = $this->objGeneral->convert_unix_into_date($Row['posting_date']);
                    $result['allocation_date']     = $this->objGeneral->convert_unix_into_date($Row['allocation_date']);

                    $response['response'][] = $result;
                }
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();
        
        return $response;
    }

    function get_supplier_invoice_listings_for_refund_paid($attr)
    {
        // print_r($attr);exit;
        $response = array();
        if($attr['invoice_type'] == 4) // Debit Note
        {
            $Sql = "SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoice_code AS code,
                        o.invoice_date AS posting_date,
                        o.currency_rate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        o.grand_total AS original_amount,
                        'Purchase Invoice' AS payment_type
                        FROM srm_invoice AS o, payment_allocation AS pa
                        WHERE 
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
				                pa.payment_id = ".$attr['invoice_id']." AND
                                pa.invoice_id = o.id AND 
                                pa.invoice_type= 4 AND
                                pa.document_type= 3 AND
                                pa.payment_type = 2
                            )
                
                    
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoice_code AS code,
                        o.invoice_date AS posting_date,
                        o.currency_rate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        o.grand_total AS original_amount,
                        'Purchase Invoice' AS payment_type
                        FROM srm_invoice AS o, payment_allocation AS pa
                        WHERE 
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
                                pa.payment_id = o.id AND
                                pa.invoice_id = ".$attr['invoice_id']." AND 
                                pa.invoice_type= 3 AND
                                pa.document_type= 4 AND
                                pa.payment_type = 2
                            )
                    
                    UNION ALL
                    SELECT 
                        gjr.id AS id,
                        amount_allocated AS paid_amount,
                        pd.document_no AS code,
                        pd.`posting_date`,
                        pd.cnv_rate,
                        (SELECT code from currency where id = pd.currency_id) as currency_code,
                        (SELECT code from currency where id = pd.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN pd.credit_amount > 0 THEN pd.credit_amount
                            WHEN pd.debit_amount > 0 THEN pd.debit_amount
                        END ) AS original_amount,
                        'Refund' AS payment_type
                        FROM payment_allocation AS pa, payment_details AS pd, `gl_journal_receipt` AS gjr
                    WHERE 
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                        gjr.id = pd.parent_id AND
                        (
                            (
                                pd.id = `pa`.`payment_detail_id` AND
                                pd.document_type IN (1, 3) AND
                                pd.credit_amount > 0 AND
                                pd.transaction_type = 3 AND 
                                pa.invoice_id = ".$attr['invoice_id']."  AND 
                                pa.invoice_type= 6 AND
                                pa.`document_type`=4
                            )
                        )
                        AND
                            pa.payment_type = 1
                    UNION ALL
                    SELECT 
                        gjr.id AS id,
                        amount_allocated AS paid_amount,
                        pd.document_no AS code,
                        pd.`posting_date`,
                        pd.cnv_rate,
                        (SELECT code from currency where id = pd.currency_id) as currency_code,
                        (SELECT code from currency where id = pd.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN pd.credit_amount > 0 THEN pd.credit_amount
                            WHEN pd.debit_amount > 0 THEN pd.debit_amount
                        END ) AS original_amount,
                        'Refund' AS payment_type
                        FROM payment_allocation AS pa, payment_details AS pd, `gl_journal_receipt` AS gjr
                    WHERE 
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                        gjr.id = pd.parent_id AND
                        (
                            (
                                pd.id = `pa`.`invoice_id` AND
                                pd.document_type IN (1, 3) AND
                                pd.credit_amount > 0 AND
                                pd.transaction_type = 3 AND 
                                pa.payment_id = ".$attr['invoice_id']." AND 
                                pa.invoice_type= 4 AND
                                pa.document_type= 6
                                
                            )
                        )
                        AND
                            pa.payment_type = 1

                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Opening Balance Invoice' AS payment_type
                        FROM opening_balance_customer AS o, payment_allocation AS pa
                        WHERE  
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            (
				                pa.invoice_id = ".$attr['invoice_id']." AND
                                pa.payment_id = o.id AND 
                                pa.invoice_type= 9 AND
                                pa.document_type= 4 AND
                                pa.payment_type = 1
                            )     
                            
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Opening Balance Invoice' AS payment_type
                        FROM opening_balance_customer AS o, payment_allocation AS pa
                        WHERE  
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
				                pa.payment_id = ".$attr['invoice_id']." AND
                                pa.invoice_id = o.id AND 
                                pa.invoice_type= 4 AND
                                pa.document_type= 9 AND
                                pa.payment_type = 2
                            )  
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Bank Opening Balance Refund' AS payment_type
                        FROM opening_balance_bank AS o, payment_allocation AS pa
                        WHERE  
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
				                pa.invoice_id = ".$attr['invoice_id']." AND
                                pa.payment_id = o.id AND 
                                pa.invoice_type= 14 AND
                                pa.document_type= 4 AND
                                pa.payment_type = 1
                            )    
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Bank Opening Balance Refund' AS payment_type
                        FROM opening_balance_bank AS o, payment_allocation AS pa
                        WHERE  
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
				                pa.payment_id = ".$attr['invoice_id']." AND
                                pa.invoice_id = o.id AND 
                                pa.invoice_type= 4 AND
                                pa.document_type= 14 AND
                                pa.payment_type = 2
                            )        
                    "; //

        }
        if($attr['invoice_type'] == 5) // Payment
        {
            $Sql = "SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoice_code AS code,
                        o.invoice_date AS posting_date,
                        o.currency_rate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        o.grand_total AS original_amount,
                        'Purchase Invoice' AS payment_type
                        FROM srm_invoice AS o, payment_allocation AS pa
                        WHERE  
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
                                pa.payment_detail_id = ".$attr['detail_id']." AND
                                pa.invoice_id = o.id AND 
                                pa.invoice_type  = 5 AND
                                pa.`document_type` = 3 AND
                                pa.payment_type = 1
                            )
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoice_code AS code,
                        o.invoice_date AS posting_date,
                        o.currency_rate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        o.grand_total AS original_amount,
                        'Purchase Invoice' AS payment_type
                        FROM srm_invoice AS o, payment_allocation AS pa
                        WHERE  
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
                                pa.payment_id = o.id AND
                                pa.invoice_id = ".$attr['detail_id']." AND 
                                pa.invoice_type  = 3 AND
                                pa.`document_type` = 5 AND
                                pa.payment_type = 2
                            )
                    UNION ALL
                    SELECT 
                        gjr.id AS id,
                        amount_allocated AS paid_amount,
                        pd.document_no AS code,
                        pd.`posting_date`,
                        pd.cnv_rate,
                        (SELECT code from currency where id = pd.currency_id) as currency_code,
                        (SELECT code from currency where id = pd.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN pd.credit_amount > 0 THEN pd.credit_amount
                            WHEN pd.debit_amount > 0 THEN pd.debit_amount
                        END ) AS original_amount,
                        'Refund' AS payment_type
                        FROM payment_allocation AS pa, payment_details AS pd, `gl_journal_receipt` AS gjr
                    WHERE 
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                        gjr.id = pd.parent_id AND
                        (
                            (
                                pd.id = `pa`.`payment_detail_id` AND
                                -- pd.document_type IN (1, 3) AND
                                pd.debit_amount > 0 AND
                                pd.transaction_type = 3 AND 
                                pa.invoice_id = ".$attr['detail_id']." AND 
                                pa.invoice_type= 5 AND
                                pa.document_type = 6
                            )
                        )
                         AND
                        pa.payment_type = 1
                    UNION ALL
                    SELECT 
                        gjr.id AS id,
                        amount_allocated AS paid_amount,
                        pd.document_no AS code,
                        pd.`posting_date`,
                        pd.cnv_rate,
                        (SELECT code from currency where id = pd.currency_id) as currency_code,
                        (SELECT code from currency where id = pd.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN pd.credit_amount > 0 THEN pd.credit_amount
                            WHEN pd.debit_amount > 0 THEN pd.debit_amount
                        END ) AS original_amount,
                        'Refund' AS payment_type
                        FROM payment_allocation AS pa, payment_details AS pd, `gl_journal_receipt` AS gjr
                    WHERE 
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                        gjr.id = pd.parent_id AND
                        (
                             (
                                pd.id = `pa`.`payment_detail_id` AND
				                -- pd.document_type IN (1, 3) AND
                                pd.credit_amount > 0 AND
                                pd.transaction_type = 3 AND 
                                pa.invoice_id = ".$attr['detail_id']." AND 
                                pa.invoice_type= 6 AND
                                pa.document_type = 5
                            )
                            
                        )
                         AND
                        pa.payment_type = 1
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Opening Balance Invoice' AS payment_type
                        FROM opening_balance_customer AS o, payment_allocation AS pa
                        WHERE 
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
                                pa.invoice_id = ".$attr['detail_id']." AND
                                pa.payment_id = o.id AND 
                                pa.invoice_type= 9 AND
                                pa.document_type= 5 AND
                                pa.payment_type = 1
                            )
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Opening Balance Invoice' AS payment_type
                        FROM opening_balance_customer AS o, payment_allocation AS pa
                        WHERE 
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
				                pa.payment_detail_id = ".$attr['detail_id']." AND
                                pa.invoice_id = o.id AND 
                                pa.invoice_type= 5 AND
                                pa.document_type= 9 AND
                                pa.payment_type = 1
                            ) 
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Bank Opening Balance Refund' AS payment_type
                        FROM opening_balance_bank AS o, payment_allocation AS pa
                        WHERE  
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
				                pa.invoice_id = ".$attr['detail_id']." AND
                                pa.payment_id = o.id AND 
                                pa.invoice_type= 14 AND
                                pa.document_type= 5 AND
                                pa.payment_type = 1
                            )    
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Bank Opening Balance Refund' AS payment_type
                        FROM opening_balance_bank AS o, payment_allocation AS pa
                        WHERE  
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
				                pa.payment_detail_id = ".$attr['detail_id']." AND
                                pa.invoice_id = o.id AND 
                                pa.invoice_type= 5 AND
                                pa.document_type= 14 AND
                                pa.payment_type = 1
                            )                           
                    "; //
        }
        if($attr['invoice_type'] == 10) // Opening balance credit note
        {
            $Sql = "SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoice_code AS code,
                        o.invoice_date AS posting_date,
                        o.currency_rate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        o.grand_total AS original_amount,
                        'Purchase Invoice' AS payment_type
                        FROM srm_invoice AS o, payment_allocation AS pa
                        WHERE  
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
                                pa.payment_id = ".$attr['invoice_id']." AND
                                pa.invoice_id = o.id AND 
                                pa.invoice_type = 10 AND
                                pa.document_type = 3 AND
                                pa.payment_type = 1
                            )
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoice_code AS code,
                        o.invoice_date AS posting_date,
                        o.currency_rate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        o.grand_total AS original_amount,
                        'Purchase Invoice' AS payment_type
                        FROM srm_invoice AS o, payment_allocation AS pa
                        WHERE  
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
                                pa.payment_id = o.id AND
                                pa.invoice_id = ".$attr['invoice_id']." AND 
                                pa.invoice_type = 3 AND
                                pa.document_type = 10 AND
                                pa.payment_type = 2
                            )
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Opening Balance Invoice' AS payment_type
                        FROM opening_balance_customer AS o, payment_allocation AS pa
                        WHERE 
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            (
                                pa.invoice_id = o.id AND 
                                pa.payment_id = ".$attr['invoice_id']." AND
                                pa.invoice_type= 10 AND
                                pa.document_type= 9 AND
                                pa.payment_type = 1
                            )
                            UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Opening Balance Invoice' AS payment_type
                        FROM opening_balance_customer AS o, payment_allocation AS pa
                        WHERE 
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
                                pa.invoice_id = ".$attr['invoice_id']." AND
                                pa.payment_id = o.id AND 
                                pa.invoice_type= 9 AND
                                pa.document_type= 10 AND
                                pa.payment_type = 1
                            ) 
                    UNION ALL
                    SELECT 
                        gjr.id AS id,
                        amount_allocated AS paid_amount,
                        pd.document_no AS code,
                        pd.`posting_date`,
                        pd.cnv_rate,
                        (SELECT code from currency where id = pd.currency_id) as currency_code,
                        (SELECT code from currency where id = pd.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN pd.credit_amount > 0 THEN pd.credit_amount
                            WHEN pd.debit_amount > 0 THEN pd.debit_amount
                        END ) AS original_amount,
                        'Refund' AS payment_type
                        FROM payment_allocation AS pa, payment_details AS pd, `gl_journal_receipt` AS gjr
                    WHERE 
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                        gjr.id = pd.parent_id AND
                        (
                            (
				                pd.id = `pa`.`payment_detail_id` AND
                                pa.invoice_id = ".$attr['invoice_id']." AND 
				                pd.document_type IN (1, 3) AND
                                pd.credit_amount > 0 AND
                                pd.transaction_type = 3 AND 
                                pa.invoice_type= 6 AND
                                pa.document_type = 10
                            )                            
                        )
                         AND
                        pa.payment_type = 1      
                    UNION ALL
                    SELECT 
                        gjr.id AS id,
                        amount_allocated AS paid_amount,
                        pd.document_no AS code,
                        pd.`posting_date`,
                        pd.cnv_rate,
                        (SELECT code from currency where id = pd.currency_id) as currency_code,
                        (SELECT code from currency where id = pd.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN pd.credit_amount > 0 THEN pd.credit_amount
                            WHEN pd.debit_amount > 0 THEN pd.debit_amount
                        END ) AS original_amount,
                        'Refund' AS payment_type
                        FROM payment_allocation AS pa, payment_details AS pd, `gl_journal_receipt` AS gjr
                    WHERE 
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                        gjr.id = pd.parent_id AND
                        (
                            (
                                pd.id = `pa`.`invoice_id` AND
                                pa.payment_id = ".$attr['invoice_id']." AND 
				                pd.document_type IN (1, 3) AND
                                pd.credit_amount > 0 AND
                                pd.transaction_type = 3 AND 
                                pa.invoice_type= 10 AND
                                pa.document_type = 6
                            )                      
                        )
                         AND
                        pa.payment_type = 1      
                    
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Bank Opening Balance Refund' AS payment_type
                        FROM opening_balance_bank AS o, payment_allocation AS pa
                        WHERE  
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            (
				                pa.invoice_id = ".$attr['invoice_id']." AND
                                pa.payment_id = o.id AND 
                                pa.invoice_type= 14 AND
                                pa.document_type= 10 AND
                                pa.payment_type = 1
                            )      
                    
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Bank Opening Balance Refund' AS payment_type
                        FROM opening_balance_bank AS o, payment_allocation AS pa
                        WHERE  
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
				                pa.payment_id = ".$attr['invoice_id']." AND
                                pa.invoice_id = o.id AND 
                                pa.invoice_type= 10 AND
                                pa.document_type= 14 AND
                                pa.payment_type = 1
                            )      
                    ";
        }
        if($attr['invoice_type'] == 13) // Bank Opening balance payment
        {
            $Sql = "SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoice_code AS code,
                        o.invoice_date AS posting_date,
                        o.currency_rate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        o.grand_total AS original_amount,
                        'Purchase Invoice' AS payment_type
                        FROM srm_invoice AS o, payment_allocation AS pa
                        WHERE  
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
                                pa.payment_id = ".$attr['invoice_id']." AND
                                pa.invoice_id = o.id AND 
                                pa.invoice_type = 13 AND
                                pa.document_type = 3 AND
                                pa.payment_type = 1
                            )
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoice_code AS code,
                        o.invoice_date AS posting_date,
                        o.currency_rate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        o.grand_total AS original_amount,
                        'Purchase Invoice' AS payment_type
                        FROM srm_invoice AS o, payment_allocation AS pa
                        WHERE  
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
                                pa.payment_id = o.id AND
                                pa.invoice_id = ".$attr['invoice_id']." AND 
                                pa.invoice_type = 3 AND
                                pa.document_type = 13 AND
                                pa.payment_type = 2
                            )
                    UNION ALL
                    SELECT 
                        gjr.id AS id,
                        amount_allocated AS paid_amount,
                        pd.document_no AS code,
                        pd.`posting_date`,
                        pd.cnv_rate,
                        (SELECT code from currency where id = pd.currency_id) as currency_code,
                        (SELECT code from currency where id = pd.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN pd.credit_amount > 0 THEN pd.credit_amount
                            WHEN pd.debit_amount > 0 THEN pd.debit_amount
                        END ) AS original_amount,
                        'Refund' AS payment_type
                        FROM payment_allocation AS pa, payment_details AS pd, `gl_journal_receipt` AS gjr
                    WHERE 
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                        gjr.id = pd.parent_id AND
                        (
                           
                            (
				                pd.id = `pa`.`payment_detail_id` AND
                                pa.invoice_id = ".$attr['invoice_id']." AND 
				                pd.document_type IN (1, 3) AND
                                pd.credit_amount > 0 AND
                                pd.transaction_type = 3 AND 
                                pa.invoice_type= 6 AND
                                pa.document_type = 13
                            )                            
                        )
                         AND
                        pa.payment_type = 1      
                        UNION ALL
                    SELECT 
                        gjr.id AS id,
                        amount_allocated AS paid_amount,
                        pd.document_no AS code,
                        pd.`posting_date`,
                        pd.cnv_rate,
                        (SELECT code from currency where id = pd.currency_id) as currency_code,
                        (SELECT code from currency where id = pd.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN pd.credit_amount > 0 THEN pd.credit_amount
                            WHEN pd.debit_amount > 0 THEN pd.debit_amount
                        END ) AS original_amount,
                        'Refund' AS payment_type
                        FROM payment_allocation AS pa, payment_details AS pd, `gl_journal_receipt` AS gjr
                    WHERE 
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                        gjr.id = pd.parent_id AND
                        (
                            (
                                pd.id = `pa`.`invoice_id` AND
                                pa.payment_id = ".$attr['invoice_id']." AND 
				                pd.document_type IN (1, 3) AND
                                pd.credit_amount > 0 AND
                                pd.transaction_type = 3 AND 
                                pa.invoice_type= 13 AND
                                pa.document_type = 6
                            )                     
                        )
                         AND
                        pa.payment_type = 1      
                        
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Opening Balance Invoice' AS payment_type
                        FROM opening_balance_customer AS o, payment_allocation AS pa
                        WHERE 
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
                                pa.invoice_id = o.id AND 
                                pa.payment_id = ".$attr['invoice_id']." AND
                                pa.invoice_type= 13 AND
                                pa.document_type= 9 AND
                                pa.payment_type = 1
                            )
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Opening Balance Invoice' AS payment_type
                        FROM opening_balance_customer AS o, payment_allocation AS pa
                        WHERE 
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
                                pa.invoice_id = ".$attr['invoice_id']." AND
                                pa.payment_id = o.id AND 
                                pa.invoice_type= 9 AND
                                pa.document_type= 13 AND
                                pa.payment_type = 1
                            ) 
                        
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Bank Opening Balance Refund' AS payment_type
                        FROM opening_balance_bank AS o, payment_allocation AS pa
                        WHERE  
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
				                pa.invoice_id = ".$attr['invoice_id']." AND
                                pa.payment_id = o.id AND 
                                pa.invoice_type= 14 AND
                                pa.document_type= 13 AND
                                pa.payment_type = 1
                            ) 
                    UNION ALL
                    SELECT 
                        o.id AS id,
                        amount_allocated AS paid_amount,
                        o.invoiceNo AS code,
                        o.`posting_date`,
                        o.convRate,
                        (SELECT code from currency where id = o.currency_id) as currency_code,
                        (SELECT code from currency where id = o.converted_currency_id) as converted_currency_code,
                        pa.allocation_date,
                        (CASE
                            WHEN o.creditAmount > 0 THEN o.creditAmount
                            WHEN o.debitAmount > 0 THEN o.debitAmount
                        END ) AS original_amount,
                        'Bank Opening Balance Refund' AS payment_type
                        FROM opening_balance_bank AS o, payment_allocation AS pa
                        WHERE  
                            pa.company_id = " . $this->arrUser['company_id'] . " AND
                            
                            (
				                pa.payment_id = ".$attr['invoice_id']." AND
                                pa.invoice_id = o.id AND 
                                pa.invoice_type= 13 AND
                                pa.document_type= 14 AND
                                pa.payment_type = 1
                            ) 
                        ";
        }
        // echo $Sql;exit;  
        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                if($Row['id'] > 0)
                {
                    $result = array();
                    $result['order_id']         = $Row['id'];
                    $result['code']             = $Row['code'];
                    $result['original_amount']  = $Row['original_amount'];
                    $result['paid_amount']      = $Row['paid_amount'];
                    $result['payment_type']     = $Row['payment_type'];
                    $result['currency_code']    = $Row['currency_code'];
                    
                    $result['invoice_date']     = $this->objGeneral->convert_unix_into_date($Row['posting_date']);
                    $result['allocation_date']     = $this->objGeneral->convert_unix_into_date($Row['allocation_date']);

                    $response['response'][] = $result;
                }
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();
        
        return $response;
    }

    function get_invoice_listings($attr)
    {
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $order_clause = "";
        $response = array();

         if (!empty($attr['searchKeyword'])) {
            // echo 'here'; exit;            
            $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.",$attr,$fieldsMeta);
            $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.",$attr,$fieldsMeta);
        } 

        //echo $where_clause;exit;
        // echo '<pre>'; print_r($attr);exit;
        

        if ($attr['type'] == 3)
            $where_clause .= " AND tbl.type in ('".$attr['type']."')  "; // AND d.order_no LIKE '%$val%'
        else
            $where_clause .= " AND tbl.type=2 ";    //AND d.invoice_no LIKE '%$val%'

        // new view query
        /* $subQuery = "SELECT  s.supplier_code 
                     FROM sr_srm_general_sel as s
                     WHERE  s.type IN (2,3) AND 
                            (s.company_id=" . $this->arrUser['company_id'] . " ) "; */
        
        $subQuery = "SELECT  s.id 
                     FROM srm as s
                     WHERE  s.type IN (2,3) AND 
                            s.company_id=" . $this->arrUser['company_id'] . " ";
        
        //$subQuery = $this->objsetup->whereClauseAppender($subQuery,24);
        // sr_link_po_so(d.id) AS LinkToSo,

        $Sql = "select * FROM (SELECT d.*,
                                (SELECT COALESCE(GROUP_CONCAT(orders.sale_order_code),'') 
                                 FROM orders, link_so_po AS link 
                                 WHERE orders.id=link.saleOrderID AND 
                                     link.purchaseOrderID = d.id) AS LinkToSo,
                                (SELECT COUNT(*) FROM document_association AS da WHERE da.record_id = d.id AND da.module_type='document' AND da.additional like '%order' AND da.record_type = 'Purchase') as documentPOCount, 
                                (SELECT COUNT(*) FROM document_association AS da WHERE da.record_id = d.id AND da.module_type='document' AND da.additional like '%invoice' AND da.record_type = 'Purchase') as documentPICount, 
                                (SELECT COUNT(*) FROM document_association AS da, email_save as es WHERE es.id = da.module_id and es.type = 1 and da.record_id = d.id AND da.module_type='email' AND da.record_type = 'Purchase') as emailCount,
                                (SELECT (CASE 
                                        WHEN status = 0 THEN 
                                            'Queued for Approval'
                                        WHEN status = 1 THEN 
                                            'Awaiting Approval'
                                        WHEN status = 2 THEN 
                                            'Approved'
                                        WHEN status = 3 OR status = 4 OR status = 5 THEN 
                                            'Disapproved'
                                        WHEN status = 7 THEN 
                                            'On Hold'
                                        ELSE    
                                            '-'
                                    END)
                                FROM approval_history AS ah 
                                WHERE ah.object_id=d.id AND ah.type = 4 ORDER BY ah.id DESC LIMIT 1
                            ) AS l1_approval_status,
                            (SELECT (CASE 
                                        WHEN status = 0 THEN 
                                            'Queued for Approval'
                                        WHEN status = 1 THEN 
                                            'Awaiting Approval'
                                        WHEN status = 2 THEN 
                                            'Approved'
                                        WHEN status = 3 OR status = 4 OR status = 5 THEN 
                                            'Disapproved'
                                        WHEN status = 7 THEN 
                                            'On Hold'
                                        ELSE    
                                            '-'
                                    END)
                                FROM approval_history AS ah 
                                WHERE ah.object_id=d.id AND ah.type = 7 ORDER BY ah.id DESC LIMIT 1
                            ) AS l2_approval_status
                            FROM srm_invoicecache AS d 
                            where  d.status=1 AND 
                                   d.company_id=" . $this->arrUser['company_id'] . " ) as tbl where 1
                                    " . $where_clause . " ";//
                            //and (d.sell_to_cust_no is null OR d.sell_to_cust_no = '' OR d.sell_to_cust_id IN ($subQuery))
                            //where  d.status=1 and (d.sell_to_cust_no is null OR d.sell_to_cust_no = '' OR d.sell_to_cust_no IN ($subQuery)) AND 

        //defualt Variable
        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $column = 'tbl.id';
        if ($order_clause == ""){

            // $order_type = "Order BY " . $column . " DESC";
            if ($attr['type'] == 2 || $attr['type'] == 0) 
                $order_type = "ORDER BY tbl.invoice_date DESC,tbl.invoice_code DESC";
            else $order_type = "ORDER BY tbl.order_date DESC,tbl.order_code DESC";
        }
        else
            $order_type = $order_clause;

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        //  echo $response['q'];  exit;
        
        // $RS = $this->objsetup->CSI($response['q']);

        if ($attr['type'] == 2 || $attr['type'] == 0) $moduleForPermission = "purchase_invoice";
        else $moduleForPermission = "purchase_order";


        $RS = $this->objsetup->CSI($response['q'], $moduleForPermission, sr_ViewPermission);

        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['type'] = $Row['type'];
                /* $result['name'] = $Row['sell_to_cust_name']; */
                $result['current_stage'] =$Row['current_stage'];

                //$result['order_date'] = $this->objGeneral->convert_unix_into_date($Row['order_date']);
                $result['order_code'] = $Row['order_code'];
                $result['prev_code'] = $Row['prev_code'];
                $result['order_date'] = $this->objGeneral->convert_unix_into_date($Row['order_date']);
                $result['invoice_date'] = $this->objGeneral->convert_unix_into_date($Row['invoice_date']);
                $result['requested_delivery_date'] = $this->objGeneral->convert_unix_into_date($Row['requested_delivery_date']);
                $result['receiptDate'] = $this->objGeneral->convert_unix_into_date($Row['receiptDate']);
                $result['due_date'] = $this->objGeneral->convert_unix_into_date($Row['due_date']);
                //$result['Invoice No.'] = $Row['invoice_no']; previous
                $result['supp_order_no'] = utf8_encode($Row['supp_order_no']);
                $result['invoice_code'] = $Row['invoice_code'];

                //$result['order_code'] = $Row['order_code'];
                
                $result['sell_to_cust_no'] = $Row['sell_to_cust_no'];
                $result['sell_to_cust_name'] = $Row['sell_to_cust_name'];
                $result['sell_to_address'] = $Row['sell_to_address'];
                $result['sell_to_address2'] = $Row['sell_to_address2'];
                $result['sell_to_post_code'] = $Row['sell_to_post_code'];
                $result['sell_to_city'] = $Row['sell_to_city'];
                $result['sell_to_county'] = $Row['sell_to_county'];
                $result['shipping_agent'] = $Row['shipping_agent'];
                $result['sell_to_contact_no'] = $Row['sell_to_contact_no'];
                $result['cust_phone'] = $Row['cust_phone'];
                $result['cust_email'] = $Row['cust_email'];
                $result['srm_purchase_code'] = $Row['srm_purchase_code'];
                $result['net_amount'] = $Row['net_amount'];//number_format($Row['net_amount'], 2);
                $result['currency_id'] = $Row['currency_id'];
                $result['crcode'] = $Row['crcode'];
                $result['sale_person'] = $Row['sale_person'];
                // $result['order_value_in_LCY'] = $Row['net_amount_converted'];
                $result['grand_total'] = $Row['grand_total']; //Amount (incl VAT) // number_format($Row['grand_total'], 2);
                
                
                /* if($Row['type'] == 2 || $Row['type'] == 3){

                    // $result['Link to So'] = $this->selectLink_SO_PO2($Row['id'], 1);
                    $result['LinkToSo'] = $this->selectLink_SO_PO2($Row['id'], 1);

                }else{
                    // $result['Link to So'] = '';
                    $result['LinkToSo'] = '';
                } */
                $result['LinkToSo'] = $Row['LinkToSo'];
                $result['Salesperson(s)'] = $Row['sale_person'];
                $result['total_items'] = $Row['total_items'];
                $result['total_allocated'] = $Row['total_allocated'];
                $result['partially_allocated'] = $Row['partially_allocated'];
                $result['total_dispatched'] = $Row['total_dispatched'];

                $result['tax_amount'] = $Row['tax_amount'];
                $result['ship_to_address'] = $Row['ship_to_address'];
                $result['ship_to_address2'] = $Row['ship_to_address2'];
                $result['ship_to_city'] = $Row['ship_to_city'];
                $result['ship_to_county'] = $Row['ship_to_county'];
                $result['ship_to_post_code'] = $Row['ship_to_post_code'];
                $result['book_in_contact'] = $Row['book_in_contact'];
                $result['book_in_tel'] = $Row['book_in_tel'];
                $result['book_in_email'] = $Row['book_in_email'];
                $result['warehouse_booking_ref'] = $Row['warehouse_booking_ref'];
                $result['consignmentNo'] = $Row['consignmentNo'];
                $result['country'] = $Row['country'];
                $result['shipment_method'] = $Row['shipment_method'];
                $result['posting_grp'] = $Row['posting_grp'];
                $result['segment'] = $Row['segment'];
                $result['cust_order_no'] = $Row['cust_order_no'];
                $result['supp_wh_no'] = '';
                $result['documentPOCount'] = $Row['documentPOCount'];
                $result['documentPICount'] = $Row['documentPICount'];
                $result['emailCount'] = $Row['emailCount'];
                $result['l1_approval_status'] = $Row['l1_approval_status'];
                $result['l2_approval_status'] = $Row['l2_approval_status'];
                
                /* if ($attr['type'] == 3){
                    $Sql2 = "SELECT SUM(total_price) AS netAmount
                             FROM srm_invoice_detail 
                             where status=1 AND invoice_id= ".$Row['id']." AND
                                   company_id=" . $this->arrUser['company_id'] . "";
                    $RS2 = $this->objsetup->CSI($Sql2);

                    if ($RS2->RecordCount() > 0) {
                        $Row2 = $RS2->FetchRow();
                        $result['net_amount'] = $Row2['netAmount'];// number_format($Row2['netAmount'], 2); //
                    }
                } */
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'][] = array();
        }
        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData($attr['tableMetaData']);
        
        return $response;
    }

    function updateGrandTotal($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $net_amount = (isset($attr['netTotal']) && $attr['netTotal']!='')?$attr['netTotal']:0; 
        $tax_amount = (isset($attr['calcVat']) && $attr['calcVat']!='')?$attr['calcVat']:0; 
        $grand_total = (isset($attr['grandTotal']) && $attr['grandTotal']!='')?$attr['grandTotal']:0; 
        $order_id = (isset($attr['order_id']) && $attr['order_id']!='')?$attr['order_id']:0;
        $invoiceCurrencyID = (isset($attr['invoiceCurrencyID']) && $attr['invoiceCurrencyID']!='')?$attr['invoiceCurrencyID']:0;

        $conversion_rate = 1;

        if (!empty($attr['order_date']) || $attr['order_date'] != '')
            $current_date = $this->objGeneral->convert_date($attr['order_date']);
        else
            $current_date = current_date;

        if($invoiceCurrencyID != $attr['defaultCurrencyID']){            

            $Sql = "SELECT d.conversion_rate  
                    FROM currency_histroy d 
                    WHERE d.currency_id = '".$invoiceCurrencyID."' AND  
                          (FLOOR(d.start_date/86400)*86400) <= '" . $current_date . "' AND
                          d.company_id =	'" . $this->arrUser['company_id'] . "'
                    order by d.start_date DESC, d.action_date desc LIMIT 1  ";

            // $RS = $this->objsetup->CSI($Sql);
            $RS = $this->objsetup->CSI($Sql);

             if ($RS->RecordCount() > 0) {
                $Row = $RS->FetchRow();
                $conversion_rate = $Row['conversion_rate'];

                $net_amount_converted = bcdiv($net_amount, $conversion_rate, 2);
                $tax_amount_converted = bcdiv($tax_amount, $conversion_rate, 2);
                $grand_total_converted = bcdiv($grand_total, $conversion_rate, 2);
            }
            else{
                $response['ack'] = 0;
                $response['error'] = 'Please set the currency conversion rate!';
                return $response;
            }             
        }
        else{
            $net_amount_converted = $net_amount;
            $tax_amount_converted = $tax_amount;
            $grand_total_converted = $grand_total;
        } 

        if ($order_id > 0) 
        {
            $Sql = "UPDATE srm_invoice
                            SET 
                                net_amount='" . $net_amount. "', 
                                grand_total='" . $grand_total . "', 
                                tax_amount='" . $tax_amount . "',	
                                net_amount_converted='" . $net_amount_converted . "', 
                                grand_total_converted='" . $grand_total_converted . "', 
                                tax_amount_converted='" . $tax_amount_converted . "'
                    WHERE id = $order_id  
                    limit 1";

            // echo $Sql;exit;
            
            $RS = $this->objsetup->CSI($Sql, 'purchase_order', sr_AddEditPermission);
        }

        $response['ack'] = 1;
        $response['error'] = NULL;

        return $response;

    }

    function update_srminvoice($attr)
    { 
       // echo '<pre>';print_r($attr);exit;
        $srLogTrace = array();
        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';

        $this->objsetup->SRTraceLogsPHP($srLogTrace);    
        //echo '<pre>';  print_r($attr['SaleOrderArr']);exit;
        $SaleOrderArr = $attr['SaleOrderArr'];
        //echo '<pre>';  print_r($SaleOrderArr);exit;
        $this->objGeneral->mysql_clean($attr);

        $update_id = $attr['id'];
        $update_check = "";

        if ($update_id > 0)
            $update_check = "  AND tst.id <> '" . $update_id . "'";

        $data_pass = " tst.status=1 and tst.type IN (2,3)  AND tst.order_code='" . $attr['order_code'] . "'  ".$update_check." ";
        $total = $this->objGeneral->count_duplicate_in_sql('srm_invoice', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) 
        {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record Already Exists';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            return $response;
        }
        
        $unique_id = (isset($attr['unique_id']) && $attr['unique_id']!='')?$attr['unique_id']:0;
        $invoice_code = (isset($attr['invoice_code']) && $attr['invoice_code']!='')?$attr['invoice_code']:0;
        $invoice_no = (isset($attr['invoice_no']) && $attr['invoice_no']!='')?$attr['invoice_no']:0;
        $order_no = (isset($attr['order_no']) && $attr['order_no']!='')?$attr['order_no']:0;
        $sell_to_contact_id = (isset($attr['sell_to_contact_id']) && $attr['sell_to_contact_id']!='')?$attr['sell_to_contact_id']:0;
        $delivery_time = (isset($attr['delivery_time']) && $attr['delivery_time']!='')?$attr['delivery_time']:0;
        $campaign_id = (isset($attr['campaign_id']) && $attr['campaign_id']!='')?$attr['campaign_id']:0;
        $sale_person_id = (isset($attr['sale_person_id']) && $attr['sale_person_id']!='')?$attr['sale_person_id']:0;
        $converted_currency_id = (isset($attr['converted_currency_id']) && $attr['converted_currency_id']!='')?$attr['converted_currency_id']:0;
        $converted_unit_price = (isset($attr['converted_unit_price']) && $attr['converted_unit_price']!='')? Round($attr['converted_unit_price'],2):0;
        $supplierID = (isset($attr['sell_to_cust_id']) && $attr['sell_to_cust_id']!='')?$attr['sell_to_cust_id']:0;
        
        $bill_to_cust_id = (isset($attr['bill_to_cust_id']) && $attr['bill_to_cust_id']!='')?$attr['bill_to_cust_id']:0;
        $bill_to_contact_id = (isset($attr['bill_to_contact_id']) && $attr['bill_to_contact_id']!='')?$attr['bill_to_contact_id']:0;
        $payment_discount = (isset($attr['payment_discount']) && $attr['payment_discount']!='')? Round($attr['payment_discount'],2):0;
        $price_including_vat = (isset($attr['price_including_vat']) && $attr['price_including_vat']!='')? Round($attr['price_including_vat'],2):0;
        $alt_depo_id = (isset($attr['alt_depo_id']) && $attr['alt_depo_id']!='')?$attr['alt_depo_id']:0;
        $shipment_method_id = (isset($attr['shipment_method_id']) && $attr['shipment_method_id']!='')?$attr['shipment_method_id']:0;
        $shipment_method = (isset($attr['shipment_method']) && $attr['shipment_method']!='')?$attr['shipment_method']:0;
        $shipping_agent_id = (isset($attr['shipping_agent_id']) && $attr['shipping_agent_id']!='')?$attr['shipping_agent_id']:0;
        $freight_charges = (isset($attr['freight_charges']) && $attr['freight_charges']!='')? Round($attr['freight_charges'],2) :0;
        //$sale_person_id = (isset($attr['sale_person_id']) && $attr['sale_person_id']!='')?$attr['sale_person_id']:0; 

        $billToSupplierCountry = (isset($attr['billToSupplierCountrys']) && $attr['billToSupplierCountrys']!='')?$attr['billToSupplierCountrys']:0;
        $shipToSupplierLocCountry = (isset($attr['shipToSupplierLocCountrys']) && $attr['shipToSupplierLocCountrys']!='')?$attr['shipToSupplierLocCountrys']:0;      
        //$attr[countrys]
        
        $account_payable_id = (isset($attr['account_payable_id']) && $attr['account_payable_id']!='')?$attr['account_payable_id']:0;      
        $purchase_code_id = (isset($attr['purchase_code_id']) && $attr['purchase_code_id']!='')?$attr['purchase_code_id']:0;      
        
        $posting_group_id = (isset($attr['posting_group_id']) && $attr['posting_group_id']!='')?$attr['posting_group_id']:0;      
        // $currency_id = (isset($attr['currency_id']) && $attr['currency_id']!='')?$attr['currency_id']:0;      
        $currency_id = (isset($attr['currency_id']->id) && $attr['currency_id']->id!='')?$attr['currency_id']->id:0;      
        
        if(!($currency_id>0)){
            $currency_id = (isset($attr['currency_ids']) && $attr['currency_ids']!='')?$attr['currency_ids']:0;               
        }

        if (!empty($attr['currencyExchangeRateDate']) || $attr['currencyExchangeRateDate'] != '')
            $current_date = $this->objGeneral->convert_date($attr['currencyExchangeRateDate']);
        elseif (!empty($attr['order_date']) || $attr['order_date'] != '')
            $current_date = $this->objGeneral->convert_date($attr['order_date']);
        else
            $current_date = current_date;


        if($currency_id == 0 && $supplierID>0){
            $response['ack'] = 0;
            $response['error'] = 'Currency is missing!';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Currency is missing!';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            return $response;
        }

        $net_amount = (isset($attr['net_amount']) && $attr['net_amount']!='')? Round($attr['net_amount'],2) :0; 
        $tax_amount = (isset($attr['tax_amount']) && $attr['tax_amount']!='')? Round($attr['tax_amount'],2) :0; 
        $grand_total = (isset($attr['grand_total']) && $attr['grand_total']!='')? Round($attr['grand_total'],2) :0; 

        $conversion_rate = 1;

        if($currency_id != $attr['defaultCurrencyID'] && $supplierID>0){            

            $Sql = "SELECT d.conversion_rate  
                    FROM currency_histroy d 
                    WHERE d.currency_id = '".$currency_id."' AND  
                          (FLOOR(d.start_date/86400)*86400) <= '" . $current_date . "' AND
                          d.company_id =	'" . $this->arrUser['company_id'] . "'
                    order by d.start_date DESC, d.action_date desc LIMIT 1  ";

            // $RS = $this->objsetup->CSI($Sql);
            $RS = $this->objsetup->CSI($Sql);

             if ($RS->RecordCount() > 0) {
                $Row = $RS->FetchRow();
                $conversion_rate = $Row['conversion_rate'];

                $net_amount_converted = bcdiv($net_amount, $conversion_rate, 2);
                $tax_amount_converted = bcdiv($tax_amount, $conversion_rate, 2);
                $grand_total_converted = bcdiv($grand_total, $conversion_rate, 2);
            }
            else{
                $response['ack'] = 0;
                $response['error'] = 'Please set the currency conversion rate!';

                $srLogTrace = array();
                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'Exit';
                $srLogTrace['ErrorMessage'] = 'Please set the currency conversion rate!';

                $this->objsetup->SRTraceLogsPHP($srLogTrace);
                return $response;
            }             
        }
        else{
            $net_amount_converted = $net_amount;
            $tax_amount_converted = $tax_amount;
            $grand_total_converted = $grand_total;
        }

        // $country = (isset($attr['country']->id) && $attr['country']->id!='')?$attr['country']->id:0;
        $country = (isset($attr['countrys']) && $attr['countrys']!='')?$attr['countrys']:0; 
        $payment_method_id = (isset($attr['payment_method_id']) && $attr['payment_method_id']!='')?$attr['payment_method_id']:0;  
        $sell_to_anonymous_supplier = (isset($attr['sell_to_anonymous_supplier']) && $attr['sell_to_anonymous_supplier']!='')?$attr['sell_to_anonymous_supplier']:0; 
        $bill_to_anonymous_supplier = (isset($attr['bill_to_anonymous_supplier']) && $attr['bill_to_anonymous_supplier']!='')?$attr['bill_to_anonymous_supplier']:0;
        $bank_account_id = (isset($attr['bank_account_id']) && $attr['bank_account_id']!='')?$attr['bank_account_id']:0; 
        $shippingPONotReq = (isset($attr['shippingPONotReq']) && $attr['shippingPONotReq']!='')?$attr['shippingPONotReq']:0; 
        $selectedShippingPOid = (isset($attr['selectedShippingPOid']) && $attr['selectedShippingPOid']!='')?$attr['selectedShippingPOid']:0; 

        $postponed_vat = (isset($attr['postponed_vat']) && $attr['postponed_vat']!='')?$attr['postponed_vat']:0;

        // marketing promotion fields addition                      
        $linktoCustID = (isset($attr['linktoCustID']) && $attr['linktoCustID']!='')?$attr['linktoCustID']:0;               
        $marketingProm = (isset($attr['marketingProm']) && $attr['marketingProm']!='')?$attr['marketingProm']:0; 
        
        $order_dateUnConv = "";
        $invoice_dateUnConv = "";            

        if($attr['order_date'] > 0){
            $order_dateUnConv = " order_dateUnConv = '" . $this->objGeneral->convertUnixDateIntoConvDate($attr['order_date']) . "',";            
        }  

        if($attr['invoice_date'] > 0){
            $invoice_dateUnConv = " invoice_dateUnConv = '" . $this->objGeneral->convertUnixDateIntoConvDate($attr['invoice_date']) . "',";            
        }     

        $defaultCurrencyID = (isset($attr['defaultCurrencyID']) && $attr['defaultCurrencyID']!='')?$attr['defaultCurrencyID']:0;  

        if($converted_currency_id == 0) $converted_currency_id = $defaultCurrencyID;

        if($supplierID == 0) {

            $supplierID = 'NULL';
            $currency_id = 'NULL';
        }

        if ($update_id == 0) 
        {          
            $tab_msg = 'Inserted';

            $Sql = "INSERT INTO srm_invoice
                                SET
                                    transaction_id = SR_GetNextTransactionID(".$this->arrUser['company_id'].", 2),
                                    type='".$attr['type']."',
                                    unique_id='$unique_id',
                                    invoice_code='$invoice_code',
                                    invoice_no='$invoice_no',
                                    order_code='$attr[order_code]',
                                    prev_code='$attr[prev_code]',
                                    order_no='$order_no',
                                    account_payable_id='$account_payable_id',
                                    purchase_code_id='$purchase_code_id',
                                    sell_to_contact_no='$attr[sell_to_contact_no]',
                                    supp_order_no='$attr[supp_order_no]',
                                    sell_to_cust_id='$supplierID',
                                    sell_to_cust_no='$attr[sell_to_cust_no]',
                                    sell_to_anonymous_supplier='$sell_to_anonymous_supplier',
                                    sell_to_contact_id='$sell_to_contact_id',
                                    sell_to_cust_name='$attr[sell_to_cust_name]',
                                    sell_to_address='$attr[sell_to_address]',
                                    delivery_time='$delivery_time',
                                    sell_to_address2='$attr[sell_to_address2]',
                                    cust_order_no='$attr[cust_order_no]',
                                    sell_to_city='$attr[sell_to_city]',
                                    sell_to_county='$attr[sell_to_county]',
                                    campaign_id='$campaign_id',
                                    campaign_no='$attr[campaign_no]',
                                    sell_to_contact='$attr[sell_to_contact]',
                                    sale_person_id='$sale_person_id',
                                    sale_person='$attr[sale_person]',
                                    cust_phone='$attr[cust_phone]',
                                    cust_fax='$attr[cust_fax]',
                                    cust_email='$attr[cust_email]',
                                    currency_id='$currency_id',
                                    comm_book_in_no='$attr[comm_book_in_no]',
                                    book_in_email='$attr[book_in_email]',
                                    comm_book_in_contact='$attr[comm_book_in_contact]',
                                    converted_currency_id='$converted_currency_id',
                                    converted_currency_code='$attr[converted_currency_code]',                                  
                                    converted_unit_price='$converted_unit_price',
                                    sell_to_post_code='$attr[sell_to_post_code]',
                                    bill_to_cust_id='$bill_to_cust_id',
                                    bill_to_cust_no='$attr[bill_to_cust_no]',
                                    bill_to_anonymous_supplier='$bill_to_anonymous_supplier',
                                    bill_to_contact_id='$bill_to_contact_id',
                                    bank_account_id='$bank_account_id',
                                    payable_bank='$attr[payable_bank]',
                                    payment_terms_code='$attr[payment_terms_code]',
                                    bill_to_name='$attr[bill_to_name]',
                                    linktoCustID='$linktoCustID',
                                    linktoCustName='$attr[linktoCustName]',
                                    marketingProm='$marketingProm',
                                    currency_rate='$conversion_rate',
                                    due_date='" . $this->objGeneral->convert_date($attr['due_date']) . "',
                                    bill_to_address='$attr[bill_to_address]',
                                    payment_discount='$payment_discount',
                                    bill_to_address2='$attr[bill_to_address2]',
                                    payment_method_id='$payment_method_id',
                                    payment_method_code='$attr[payment_method_code]',
                                    bill_to_city='$attr[bill_to_city]',
                                    price_including_vat='$price_including_vat',
                                    bill_to_county='$attr[bill_to_county]',
                                    bill_to_post_code='$attr[bill_to_post_code]',
                                    billToSupplierCountry='$billToSupplierCountry',
                                    bill_to_contact='$attr[bill_to_contact]',
                                    alt_depo_id='$alt_depo_id',
                                    shipment_method_id='$shipment_method_id',
                                    shipping_agent='$attr[shipping_agent]',
                                    ship_to_name='$attr[ship_to_name]',
                                    shipping_agent_id='$shipping_agent_id',
                                    ship_to_address='$attr[ship_to_address]',
                                    ship_to_address2='$attr[ship_to_address2]',
                                    freight_charges='$freight_charges',
                                    ship_to_city='$attr[ship_to_city]',
                                    container_no='$attr[container_no]',
                                    ship_to_county='$attr[ship_to_county]',
                                    ship_to_post_code='$attr[ship_to_post_code]',
                                    shipToSupplierLocCountry='$shipToSupplierLocCountry' ,
                                    ship_to_contact='$attr[ship_to_contact]',
                                    ship_to_phone='$attr[ship_to_phone]',
                                    ship_to_email='$attr[ship_to_email]',
                                    ship_delivery_time='$attr[ship_delivery_time]',
                                    book_in_tel='$attr[book_in_tel]',
                                    warehouse_booking_ref='$attr[warehouse_booking_ref]',
                                    customer_warehouse_ref='$attr[customer_warehouse_ref]',
                                    location_code='$attr[location_code]',
                                    bill_to_contact_no='$attr[bill_to_contact_no]',
                                    bill_to_contact_invoice='$attr[bill_to_contact_invoice]',
                                    ship_to_contact_shiping='$attr[ship_to_contact_shiping]' ,
                                    country='$country' ,
                                    srm_purchase_code='$attr[srm_purchase_code]',
                                    bill_phone='$attr[bill_phone]' ,
                                    note='$attr[note]' ,
                                    externalnote='$attr[externalnote]',
                                    bill_fax='$attr[bill_fax]' ,
                                    bill_email='$attr[bill_email]',
                                    bill_to_posting_group_id='$posting_group_id',
                                    order_list_id='$attr[order_list_id]',
                                    order_list_name='$attr[order_list_name]',
                                    payable_number='$attr[payable_number]',
                                    purchase_number='$attr[purchase_number]',
                                    posting_date='" . $this->objGeneral->convert_date($attr['posting_date']) . "',
                                    sup_date='" . $this->objGeneral->convert_date($attr['sup_date']) . "',
                                    order_date='" . $this->objGeneral->convert_date($attr['order_date']) . "',
                                    $order_dateUnConv
                                    requested_delivery_date='" . $this->objGeneral->convert_date($attr['requested_delivery_date']) . "',
                                    receiptDate='" . $this->objGeneral->convert_date($attr['receiptDate']) . "',
                                    delivery_date='" . $this->objGeneral->convert_date($attr['delivery_date']) . "',
                                    invoice_date='" . $this->objGeneral->convert_date($attr['invoice_date']) . "',
                                    $invoice_dateUnConv
                                    shipment_date='" . $this->objGeneral->convert_date($attr['shipment_date']) . "',
                                    recpt_date='" . $this->objGeneral->convert_date($attr['recpt_date']) . "',
                                    shippingPONotReq = '$shippingPONotReq',
                                    ReasonForshippingNotReq = '$attr[ReasonForshippingNotReq]',
                                    selectedShippingPO = '$attr[selectedShippingPO]',
                                    selectedShippingPOid = '$selectedShippingPOid',
                                    postponed_vat = '$postponed_vat',
                                    user_id='" . $this->arrUser['id'] . "',
                                    AddedBy='" . $this->arrUser['id'] . "',
                                    AddedOn=UNIX_TIMESTAMP (NOW()),
                                    company_id='" . $this->arrUser['company_id'] . "'
                                    ";                                   
        } 
        else 
        {             

            $Sql = "UPDATE srm_invoice
                            SET 
                                account_payable_id='$account_payable_id',
                                purchase_code_id='$purchase_code_id',
                                prev_code='$attr[prev_code]',
                                sell_to_contact_no='$attr[sell_to_contact_no]',
                                supp_order_no='$attr[supp_order_no]',
                                sell_to_cust_id=$supplierID,
                                sell_to_cust_no='$attr[sell_to_cust_no]',
                                sell_to_contact_id='$sell_to_contact_id', 
                                sell_to_cust_name='$attr[sell_to_cust_name]',
                                sell_to_address='$attr[sell_to_address]',
                                delivery_time='$delivery_time',
                                sell_to_address2='$attr[sell_to_address2]',
                                cust_order_no='$attr[cust_order_no]',
                                sell_to_city='$attr[sell_to_city]',
                                sell_to_county='$attr[sell_to_county]',
                                campaign_id='$campaign_id',
                                campaign_no='$attr[campaign_no]',
                                sell_to_contact='$attr[sell_to_contact]',
                                sale_person_id='$sale_person_id',
                                sale_person='$attr[sale_person]',
                                cust_phone='$attr[cust_phone]',
                                cust_fax='$attr[cust_fax]',
                                cust_email='$attr[cust_email]',
                                currency_id=$currency_id,
                                comm_book_in_no='$attr[comm_book_in_no]',
                                book_in_email='$attr[book_in_email]',
                                comm_book_in_contact='$attr[comm_book_in_contact]',
                                converted_currency_id='$converted_currency_id',
                                converted_currency_code='$attr[converted_currency_code]',
                                converted_unit_price='$converted_unit_price',
                                sell_to_post_code='$attr[sell_to_post_code]',
                                bill_to_cust_id='$bill_to_cust_id',
                                bill_to_cust_no='$attr[bill_to_cust_no]',
                                bill_to_contact_id='$bill_to_contact_id',
                                bank_account_id='$bank_account_id',
                                payable_bank='$attr[payable_bank]',
                                payment_terms_code='$attr[payment_terms_code]',
                                bill_to_name='$attr[bill_to_name]',
                                linktoCustID='$linktoCustID',
                                linktoCustName='$attr[linktoCustName]',
                                marketingProm='$marketingProm',
                                currency_rate='$conversion_rate',
                                due_date='" . $this->objGeneral->convert_date($attr['due_date']) . "',
                                bill_to_address='$attr[bill_to_address]',
                                payment_discount='$payment_discount',
                                bill_to_address2='$attr[bill_to_address2]',
                                payment_method_id='$payment_method_id',
                                payment_method_code='$attr[payment_method_code]',
                                bill_to_city='$attr[bill_to_city]',
                                price_including_vat='$price_including_vat',
                                bill_to_county='$attr[bill_to_county]',
                                bill_to_post_code='$attr[bill_to_post_code]',
                                billToSupplierCountry='$billToSupplierCountry',
                                bill_to_contact='$attr[bill_to_contact]',
                                alt_depo_id='$alt_depo_id',
                                shipment_method_id='$shipment_method_id',
                                shipping_agent='$attr[shipping_agent]',
                                ship_to_name='$attr[ship_to_name]',
                                shipping_agent_id='$shipping_agent_id',
                                ship_to_address='$attr[ship_to_address]',
                                ship_to_address2='$attr[ship_to_address2]',
                                freight_charges='$freight_charges',
                                ship_to_city='$attr[ship_to_city]',
                                container_no='$attr[container_no]',
                                ship_to_county='$attr[ship_to_county]',
                                ship_to_post_code='$attr[ship_to_post_code]',
                                shipToSupplierLocCountry='$shipToSupplierLocCountry' ,
                                ship_to_contact='$attr[ship_to_contact]',
                                ship_to_phone='$attr[ship_to_phone]',
                                ship_to_email='$attr[ship_to_email]',
                                ship_delivery_time='$attr[ship_delivery_time]',
                                book_in_tel='$attr[book_in_tel]',
                                warehouse_booking_ref='$attr[warehouse_booking_ref]',
                                customer_warehouse_ref='$attr[customer_warehouse_ref]',
                                location_code='$attr[location_code]',
                                bill_to_contact_no='$attr[bill_to_contact_no]',
                                bill_to_contact_invoice='$attr[bill_to_contact_invoice]',
                                ship_to_contact_shiping='$attr[ship_to_contact_shiping]',
                                country='$country',
                                srm_purchase_code='$attr[srm_purchase_code]',
                                bill_phone='$attr[bill_phone]',
                                note='$attr[note]',
                                externalnote='$attr[externalnote]',
                                bill_fax='$attr[bill_fax]',
                                bill_email='$attr[bill_email]',
                                bill_to_posting_group_id='$posting_group_id',
                                order_list_id='$attr[order_list_id]',
                                order_list_name='$attr[order_list_name]',
                                payable_number='$attr[payable_number]',
                                purchase_number='$attr[purchase_number]',
                                posting_date='" . $this->objGeneral->convert_date($attr['posting_date']) . "',
                                sup_date='" . $this->objGeneral->convert_date($attr['sup_date']) . "',
                                order_date='" . $this->objGeneral->convert_date($attr['order_date']) . "',
                                $order_dateUnConv
                                requested_delivery_date='" . $this->objGeneral->convert_date($attr['requested_delivery_date']) . "',
                                receiptDate='" . $this->objGeneral->convert_date($attr['receiptDate']) . "',
                                delivery_date='" . $this->objGeneral->convert_date($attr['delivery_date']) . "',
                                invoice_date='" . $this->objGeneral->convert_date($attr['invoice_date']) . "',
                                $invoice_dateUnConv
                                shipment_date='" . $this->objGeneral->convert_date($attr['shipment_date']) . "',
                                recpt_date='" . $this->objGeneral->convert_date($attr['recpt_date']) . "', 
                                converted_currency_id = '" . $attr['defaultCurrencyID'] . "', 
                                net_amount='" . $net_amount. "', 
                                grand_total='" . $grand_total . "', 
                                tax_amount='" . $tax_amount . "',	
                                net_amount_converted='" . $net_amount_converted . "', 
                                grand_total_converted='" . $grand_total_converted . "', 
                                tax_amount_converted='" . $tax_amount_converted . "',
                                shippingPONotReq = '$shippingPONotReq',
                                ReasonForshippingNotReq = '$attr[ReasonForshippingNotReq]',
                                selectedShippingPO = '$attr[selectedShippingPO]',
                                selectedShippingPOid = '$selectedShippingPOid',
                                postponed_vat = '$postponed_vat',
                                ChangedBy='" . $this->arrUser['id'] . "',
                                ChangedOn=UNIX_TIMESTAMP (NOW()),
                                refSaleQuoteStatus=1
                                WHERE id = $update_id   limit 1";
        }

        // echo $Sql;exit;

        // $RS = $this->objsetup->CSI($Sql);  

        if ($update_id == 0){
            $RS = $this->objsetup->CSI($Sql, 'purchase_order', sr_AddPermission);


        }else{
            $RS = $this->objsetup->CSI($Sql, 'purchase_order', sr_AddEditPermission);
        } 
            
        
        // echo $this->Conn->Affected_Rows();

        $is_whole_seller = 0;
        
        if ($this->Conn->Affected_Rows() > 0) 
        {
            if ($update_id == 0){
                $update_id = $this->Conn->Insert_ID();

                if($update_id > 0)
                {
                    $Sql2 = "SELECT id,(SELECT is_whole_seller 
                                         FROM financial_settings 
                                         WHERE company_id = " . $this->arrUser['company_id'] . " 
                                         LIMIT 1) AS is_whole_seller 
                            FROM ref_crm_order_stages 
                            WHERE module_id = 2 and 
                                company_id='" . $this->arrUser['company_id'] . "' and 
                                status = 1 
                            ORDER BY `rank`";
                    // echo $Sql2; exit;

                    $RS2 = $this->objsetup->CSI($Sql2);
                    $stage_count = 0;

                    if ($RS2->RecordCount() > 0) {
                        while ($Row2 = $RS2->FetchRow()) {
                            $Sql3 = "INSERT INTO ref_order_stage_list
                                                    SET    
                                                        order_id = $update_id,
                                                        ref_stage_id = $Row2[id],
                                                        company_id = ".$this->arrUser['company_id'].", 
                                                        user_id = ".$this->arrUser['id'].", ";

                                        if($stage_count == 0)
                                        {
                                            $stage_count =1;
                                            $Sql3 .=" state = 'active'";
                                        }
                                        else
                                        $Sql3 .=" state = 'outstanding'";

                            // echo $Sql3;exit;
                            $RS3 = $this->objsetup->CSI($Sql3);

                            $is_whole_seller = $Row2['is_whole_seller'];
                        }                    
                    }
                    // just to update cache
                    $Sql1 = "update srm_invoice set changedOn=UNIX_TIMESTAMP (NOW()) WHERE id=$update_id; -- just to update cache for order stage";
                    // echo $Sql1;exit;
                    $RS1 = $this->objsetup->CSI($Sql1); 
                }
            }
            // exit
            if(sizeof($SaleOrderArr)>0){
                $response2 = $this->addLink_SO_PO($SaleOrderArr, $update_id,1);
            }
            else{
                $response2 = $this->removeLink_SO_PO($update_id,1);
            }
                
            $response['ack'] = 1;
            $response['is_whole_seller'] = $is_whole_seller;
            $response['id'] = $update_id;
            $response['info'] = $tab_msg;
            $response['error'] = NULL;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        } 
        else {
                        
            if(sizeof($SaleOrderArr)>0){
                $response2 = $this->addLink_SO_PO($SaleOrderArr, $update_id,1);
            }else{
                $response2 = $this->removeLink_SO_PO($update_id,1);
            }

            // just to update cache table
            $Sql1 = "UPDATE srm_invoice SET changedOn=UNIX_TIMESTAMP (NOW()) WHERE id=$update_id";
            // echo $Sql1;exit;
            $RS1 = $this->objsetup->CSI($Sql1); 

            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record is Not updated!';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }

        return $response;
    }

    function getSalesOrderListings($attr)
    {
        $response = array();  

        $where_clause = "";      
        $where_clause = " AND d.type in (1,2) ";

        $subQueryForBuckets = "SELECT  c.id
                                FROM sr_crm_listing c
                                WHERE c.type IN (2,3) AND 
                                    c.company_id=" . $this->arrUser['company_id'] . "";

        /* $subQueryForBuckets = "SELECT  c.id
                                FROM crm c
                                WHERE c.type IN (2,3) AND 
                                    c.company_id=" . $this->arrUser['company_id'] . ""; */

        //$subQueryForBuckets = $this->objsetup->whereClauseAppender($subQueryForBuckets, 48);

        $Sql = "SELECT  d.id,d.type,
                        d.sale_invioce_code,
                        d.posting_date,
                        d.offer_date,
                        d.requested_delivery_date,
                        d.sell_to_cust_no,
                        d.prev_code,
                        d.sell_to_cust_name,
                        d.sale_order_code,
                        d.cust_order_no,
                        d.sell_to_contact_no,
                        d.net_amount,
                        d.currency_id,
                        d.currency_rate,
                        d.net_amount_converted,
                        d.grand_total,
                        d.sell_to_cust_id as ids
                FROM orders  d        
                where  d.status=1   AND 
                       d.company_id=" . $this->arrUser['company_id'] . " AND 
                       d.sale_order_code IS NOT NULL AND 
                       d.sale_order_code <> ''  AND 
                       d.sell_to_cust_no IS NOT NULL
                       " . $where_clause . "    
                Order by d.id DESC";

        /*   AND 
                       (d.sell_to_cust_id = 0 OR 
                        d.sell_to_cust_id IS NULL OR 
                        d.sell_to_cust_id IN ($subQueryForBuckets))  */
        /*  
                left JOIN crm on crm.id=d.sell_to_cust_id AND crm.type<>4   */
        //echo $Sql;exit;

        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, 'purchase_order', sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['type'] = $Row['type'];
                $result['code'] = $Row['sale_invioce_code'];

                /* if ($attr['type'] == 1)
                    $result['code'] = $Row['sale_order_code']; */

                $result['invoice_date'] = $this->objGeneral->convert_unix_into_date($Row['posting_date']);                
                $result['order_date'] = $this->objGeneral->convert_unix_into_date($Row['offer_date']);
                $result['rq_delivery_date'] = $this->objGeneral->convert_unix_into_date($Row['requested_delivery_date']);

                $result['sell_to_cust_no'] = $Row['sell_to_cust_no'];
                $result['prev_code'] = $Row['prev_code'];
                $result['sell_to_cust_name'] = $Row['sell_to_cust_name'];
                $result['sale_order_code'] = $Row['sale_order_code'];
                $result['cust_order_no'] = $Row['cust_order_no'];
                $result['sell_to_contact_no'] = $Row['sell_to_contact_no'];
                // $result['order_code'] = $Row['order_code'];
                $result['net_amount'] = $Row['net_amount']; 
                $result['currency_id'] = $Row['currency_id'];
                $result['currency_rate'] = $Row['currency_rate'];
                $result['net_amount_converted'] = $Row['net_amount_converted'];
                $result['grand_total'] = $Row['grand_total'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        return $response;
    }

    function getSalesOrderListingsForPO($attr)
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
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("SalesOrderListingsForPO", $this->arrUser);
        }

        $response = array(); 

        $where_clause2 = "";      
        $where_clause2 = " AND d.type in (1,2) ";
        $subQueryForBuckets = "";      

        // if ($this->arrUser['user_type'] != 1 && $this->arrUser['user_type'] != 2){

            $subQueryForBuckets = "SELECT  c.id
                                    FROM crm c
                                    WHERE c.type IN (2,3) AND 
                                        c.company_id=" . $this->arrUser['company_id'] . "";

            //$subQueryForBuckets = $this->objsetup->whereClauseAppender($subQueryForBuckets, 48);
        // }

        $Sql = "SELECT * FROM (SELECT   d.id,d.type,
                                        d.sale_invioce_code,
                                        d.posting_date,
                                        d.offer_date,
                                        d.requested_delivery_date,
                                        d.sell_to_cust_no,
                                        d.prev_code,
                                        d.sell_to_cust_name,
                                        d.sale_order_code,
                                        d.cust_order_no,
                                        d.sell_to_contact_no,
                                        d.net_amount,
                                        d.currency_id,
                                        d.currency_rate,
                                        d.net_amount_converted,
                                        d.grand_total,
                                        d.sell_to_cust_id as ids
                                FROM orders  d        
                                where  d.status=1   AND 
                                    d.company_id=" . $this->arrUser['company_id'] . " AND 
                                    d.sale_order_code IS NOT NULL AND 
                                    d.sale_order_code <> ''  AND 
                                    d.sell_to_cust_no IS NOT NULL
                                    " . $where_clause2 . "    
                                Order by d.id DESC) AS tbl  where 1 " . $where_clause . " ";
        //echo $Sql;exit;

        /*   AND 
                                    (d.sell_to_cust_id = 0 OR 
                                        d.sell_to_cust_id IS NULL OR 
                                        d.sell_to_cust_id IN ($subQueryForBuckets))  */

        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if (!empty($attr['sort_column'])) {
            $column = 'tbl.' . $attr['sort_column'];

            /* if ($attr['sort_column'] == 'sale_invioce_code')
                $column = 'tbl.' . 'sale_invioce_code';
            else if ($attr['sort_column'] == 'name')
                $column = 'tbl.' . 'name';
            else if ($attr['sort_column'] == "statusp")
                $column = 'tbl.' . 'statusp';
            else if ($attr['sort_column'] == "region")
                $column = 'tbl.' . 'region';
            else if ($attr['sort_column'] == "segment")
                $column = 'tbl.' . 'segment';
            else if ($attr['sort_column'] == "postingGrp")
                $column = 'tbl.' . 'postingGrp';
            else if ($attr['sort_column'] == 'selling_group')
                $column = 'tbl.selling_group'; */

            $order_type = "Order BY " . $column . " DESC";
        }
        else{
            $column = 'tbl.sale_invioce_code';
        }        

        if ($order_clause == "")
            $order_type = "Order BY " . $column . " ASC";
        else
            $order_type = $order_clause;

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q'], 'purchase_order', sr_ViewPermission);
        $response['q'] = '';        

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                
                $result = array();
                $result['id'] = $Row['id'];
                $result['type'] = $Row['type'];
                $result['sale_invioce_code'] = $Row['sale_invioce_code'];

                $result['invoice_date'] = $this->objGeneral->convert_unix_into_date($Row['posting_date']);
                $result['offer_date'] = $this->objGeneral->convert_unix_into_date($Row['offer_date']);
                $result['requested_delivery_date'] = $this->objGeneral->convert_unix_into_date($Row['requested_delivery_date']);

                $result['sell_to_cust_no'] = $Row['sell_to_cust_no'];
                $result['prev_code'] = $Row['prev_code'];
                $result['sell_to_cust_name'] = $Row['sell_to_cust_name'];
                $result['sale_order_code'] = $Row['sale_order_code'];
                $result['cust_order_no'] = $Row['cust_order_no'];
                $result['sell_to_contact_no'] = $Row['sell_to_contact_no'];
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

        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData('SalesOrderListingsForPO');
        $response['response']['tbl_meta_data']['defaultFilter'] = $defaultFilter;

        return $response;
    }

    function getselLink_SO_PO($id,$type)
    {
        $response = array();  

        $where_clause = "";      
        $where_clause = " AND d.type in (1,2) ";

        $subQueryForBuckets = "SELECT  c.id
                                FROM crm c
                                WHERE c.type IN (2,3) AND 
                                    c.company_id=" . $this->arrUser['company_id'] . "";

        //$subQueryForBuckets = $this->objsetup->whereClauseAppender($subQueryForBuckets, 48);

        // type 1 is for Purchase Order
        $sqld = "SELECT d.id,d.type,
                        d.sale_invioce_code,
                        d.posting_date,
                        d.offer_date,
                        d.requested_delivery_date,
                        d.sell_to_cust_no,
                        d.prev_code,
                        d.sell_to_cust_name,
                        d.sale_order_code,
                        d.cust_order_no,
                        d.sell_to_contact_no,
                        d.net_amount,
                        d.currency_id,
                        d.currency_rate,
                        d.net_amount_converted,
                        d.grand_total,
                        d.sell_to_cust_id AS ids 
                 FROM link_so_po sp
                 LEFT JOIN orders AS d ON d.id=sp.saleOrderID    
                 WHERE  sp.purchaseOrderID='".$id."'  AND 
                        sp.company_id='" . $this->arrUser['company_id'] . "'";
        
        // echo $sqld;exit;
        $RS = $this->objsetup->CSI($sqld);

        if ($RS->RecordCount() > 0) {
            //$Row = $RS->FetchRow();
            /* while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response[] = $Row;
            } */
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['type'] = $Row['type'];
                $result['sale_invioce_code'] = $Row['sale_invioce_code'];

                $result['invoice_date'] = $this->objGeneral->convert_unix_into_date($Row['posting_date']);                
                $result['offer_date'] = $this->objGeneral->convert_unix_into_date($Row['offer_date']);
                $result['requested_delivery_date'] = $this->objGeneral->convert_unix_into_date($Row['requested_delivery_date']);

                $result['sell_to_cust_no'] = $Row['sell_to_cust_no'];
                $result['prev_code'] = $Row['prev_code'];
                $result['sell_to_cust_name'] = $Row['sell_to_cust_name'];
                $result['sale_order_code'] = $Row['sale_order_code'];
                $result['cust_order_no'] = $Row['cust_order_no'];
                $result['sell_to_contact_no'] = $Row['sell_to_contact_no'];
                $result['net_amount'] = $Row['net_amount']; 
                $result['currency_id'] = $Row['currency_id'];
                $result['currency_rate'] = $Row['currency_rate'];
                $result['net_amount_converted'] = $Row['net_amount_converted'];
                $result['grand_total'] = $Row['grand_total'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response = array();

        return $response;
        
    }

    function getSalesOrderListingsbyPurchaseID($attr)
    {
        $response = array(); 

        $Sql = "SELECT  orders.*,crm.id AS ids
                FROM link_so_po d 
                LEFT JOIN orders ON orders.id=d.saleOrderID   
                LEFT JOIN crm ON crm.id=orders.sell_to_cust_id      
                WHERE  d.status=1   AND 
			           d.purchaseOrderID = ".$attr['id']." AND
                       d.company_id=" . $this->arrUser['company_id'] . "   
                ORDER BY d.id DESC";
        // echo $Sql;exit;

        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, 'purchase_order', sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['type'] = $Row['type'];
                $result['sale_invioce_code'] = $Row['sale_invioce_code'];

                $result['invoice_date'] = $this->objGeneral->convert_unix_into_date($Row['posting_date']);                
                $result['offer_date'] = $this->objGeneral->convert_unix_into_date($Row['offer_date']);
                $result['requested_delivery_date'] = $this->objGeneral->convert_unix_into_date($Row['requested_delivery_date']);

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

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        return $response;
    }

    function addLink_SO_PO($SaleOrderArr,$update_id,$type)
    {
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

        // type 1 is for Purchase Order
        if ($type == 1) {
            $sqld = "DELETE FROM link_so_po
                     where  purchaseOrderID='".$update_id."'  and 
                            company_id='" . $this->arrUser['company_id'] . "'";

            $this->objsetup->CSI($sqld);

            if ($update_id > 0) {
                foreach ($SaleOrderArr as $order) {
                    // echo '<pre>';  print_r($order->id);
                    if ($order->id > 0) {
                        $Sqle = "INSERT INTO  link_so_po 
                                                SET
                                                    saleOrderID='".$order->id."',
                                                    purchaseOrderID='".$update_id."',
                                                    status=1,
                                                    company_id='" . $this->arrUser['company_id'] . "',
                                                    user_id='" . $this->arrUser['id'] . "',
                                                    AddedBy='" . $this->arrUser['id'] . "',
                                                    AddedOn=UNIX_TIMESTAMP (NOW()),
                                                    ChangedBy='" . $this->arrUser['id'] . "',
                                                    ChangedOn=UNIX_TIMESTAMP (NOW())";

                        // echo $Sqle;
                        $RS = $this->objsetup->CSI($Sqle);
                    } 
                }
                // exit;
            }
        } 
        else if ($type == 2) // type 2 is for Sale Order
        {
            $sqld = "DELETE 
                     FROM link_so_po
                     where  saleOrderID='".$update_id."'  and 
                            company_id='" . $this->arrUser['company_id'] . "' ";

            $this->objsetup->CSI($sqld);

            if ($update_id > 0) {
                foreach ($SaleOrderArr as $order) {
                    if ($order->id > 0) {
                        $Sqle = "INSERT INTO  link_so_po 
                                                SET
                                                    saleOrderID='".$update_id."',
                                                    purchaseOrderID='".$order->id."',
                                                    status=1,
                                                    company_id='" . $this->arrUser['company_id'] . "',
                                                    user_id='" . $this->arrUser['id'] . "',
                                                    AddedBy='" . $this->arrUser['id'] . "',
                                                    AddedOn=UNIX_TIMESTAMP (NOW()),
                                                    ChangedBy='" . $this->arrUser['id'] . "',
                                                    ChangedOn=UNIX_TIMESTAMP (NOW())";
                        // echo $Sqle;exit;
                        $RS = $this->objsetup->CSI($Sqle); 
                    }
                }
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
        return true;
    }

    function removeLink_SO_PO($update_id,$type)
    {        
        $this->Conn->autoCommit = false;

        // type 1 is for Purchase Order
        if ($type == 1) {
            $sqld = "DELETE FROM link_so_po
                     where  purchaseOrderID='$update_id'  and 
                            company_id='" . $this->arrUser['company_id'] . "'";

            $this->objsetup->CSI($sqld);
        } 
        else if ($type == 2) // type 2 is for Sale Order
        {
            $sqld = "DELETE 
                     FROM link_so_po
                     where  saleOrderID='$update_id'  and 
                            company_id='" . $this->arrUser['company_id'] . "' ";

            $this->objsetup->CSI($sqld);
        }
        
        $this->Conn->commitTrans();
        $this->Conn->autoCommit = true;
        return true;
    }

    function get_invoice_number($attr)
    {
        $sql_total = "SELECT  count(id) as total FROM srm_invoice where  supp_order_no=".$attr['id']." ";
        $rs_count = $this->objsetup->CSI($sql_total);
        $total = $rs_count->fields['total'];

        if ($total == 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Invoice Number is Record Already Exists';
        }
        return $response;
    }

    function get_invoice_code($attr)
    {
        $mSql = "SELECT prefix FROM module_codes WHERE id = 38";
        $code = $this->objsetup->CSI($mSql)->FetchRow();

        $Sql = "SELECT max(invoice_no) as count FROM srm_invoice";
        $crm = $this->objsetup->CSI($Sql)->FetchRow();
        //echo $mSql; exit;
        $nubmer = $crm['count'];

        if ($attr['is_increment'] == 1 || $nubmer == '')
            $nubmer++;

        //return array('code'=>$code['prefix'].$this->objGeneral->module_invoice_prefix($nubmer),'number'=>$nubmer,'prefix'=>$code['prefix']);
        if ($attr['type'] == 1)
            $code_name = 'PI';
        else
            $code_name = 'PO';
        return array('code' => $code_name . $this->objGeneral->module_invoice_prefix($nubmer), 'number' => $nubmer, 'prefix' => $code['prefix']);
    }

    function get_contact_code($attr)
    {
        $mSql = "SELECT prefix FROM `module_codes` WHERE `id` = 68";
        $code = $this->objsetup->CSI($mSql)->FetchRow();
        return array('prefix' => $code['prefix']);
    }

    function convert_purchase_to_sale_order($attr)
    {
        $InvoiceSql = "CALL SR_Convert_Purchase_To_Sales_Order(".$attr['order_id'].",".$this->arrUser['company_id'].",".$this->arrUser['id'].")";
        // echo $InvoiceSql;exit;
        // $RS = $this->objsetup->CSI($InvoiceSql);
        $RS = $this->objsetup->CSI($InvoiceSql, 'purchase_order', sr_ConvertPermission);

        if($RS->fields['SaleOrderID'] > 1)
        {
            $response['ack'] = 1;
            $response['SaleOrderID'] = $RS->fields['SaleOrderID'];
            
        }
        else
        {
            $response['ack'] = 0;
            $response['error'] = 'Could not convert to Sales Order';
        }
        
        return $response;
    }

    function convert_recieved_stock($attr)
    {
        // print_r($attr['defaultCurrencyID']);
        // echo $attr['orderDate']; exit;
        
        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['Parameter2'] = 'invoice_id:'.$attr['invoice_id'];
        $srLogTrace['ErrorMessage'] = "";

        $this->objsetup->SRTraceLogsPHP($srLogTrace);
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;


        $allItemsArray = $attr['allItemsArray'];
        $receivedItems = $attr['receivedItems'];
        $NoStockAllocReqArray = $attr['NoStockAllocReqArray'];
        $recReceivedMode = $attr['recReceivedMode']; // 1 means Goods are going to be received first but not invoiced
        $supplierID = $attr['supplierID'];
        $directInvoice = (isset($attr['directInvoice']) && $attr['directInvoice']!='')?$attr['directInvoice']:0;
        $recGoodsReceived = (isset($attr['recGoodsReceived']) && $attr['recGoodsReceived']!='')?$attr['recGoodsReceived']:0;
        $purchaseInvoice_id = (isset($attr['invoice_id']) && $attr['invoice_id']!='')?$attr['invoice_id']:0;

        $suppInvNo = (isset($attr['suppInvNo']) && $attr['suppInvNo']!='')?trim(addslashes(stripslashes($attr['suppInvNo']))):'0';  
        
        $invoiceCurrencyID = (isset($attr['invoiceCurrencyID']) && $attr['invoiceCurrencyID']!='')?$attr['invoiceCurrencyID']:0;
        $defaultCurrencyID = $attr['defaultCurrencyID'];   

        /* 
        (SELECT s.purchaseStatus 
                                                                                       FROM srm_invoice AS s 
                                                                                       WHERE s.id = si.selectedShippingPOid AND
                                                                                             s.company_id = si.company_id )
                                                                                              */ 

        $checkAlreadyReceived = "SELECT si.purchaseStatus,
                                        (CASE WHEN (si.selectedShippingPOid > 0) THEN 3
                                              ELSE 3
                                              END) AS postedLinkedShippingPO
                                 FROM srm_invoice AS si
                                 WHERE si.id= " . $attr['invoice_id']. " AND 
                                       si.company_id = '" . $this->arrUser['company_id'] . "'
                                 LIMIT 1";
        // echo $checkAlreadyReceived; exit;        
        $RsAlreadyReceived = $this->objsetup->CSI($checkAlreadyReceived);

        $purchaseStatus = $RsAlreadyReceived->fields['purchaseStatus'];
        $postedLinkedShippingPO = $RsAlreadyReceived->fields['postedLinkedShippingPO'];
        
        if($purchaseStatus == 2 && $directInvoice == 0)
        {
            $response['ack'] = 2;
            $response['error'] = ' Already Received';

            $srLogTrace = array();

            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Already Received!';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            return $response;
        }
        elseif($purchaseStatus == 3)
        {
            $response['ack'] = 3;
            $response['error'] = ' Already Posted';

            $srLogTrace = array();

            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Already Posted';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            return $response;
        }

        if($postedLinkedShippingPO != 3)
        {
            $response['ack'] = 2;
            $response['error'] = 'Linked Shipping PO is Not Posted Yet!';

            $srLogTrace = array();

            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Linked Shipping PO is Not Posted Yet!';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            return $response;
        }

        if($purchaseStatus == 2){
            $recReceivedMode = 0;
            $recGoodsReceived = 1;
        }

        if($suppInvNo != '0'){

            $data_pass = " tst.status=1 and 
                        tst.supp_order_no='" . $suppInvNo . "' AND 
                        tst.sell_to_cust_id='" . $supplierID . "' AND 
                        tst.id <> " . $purchaseInvoice_id . ""; 
            $totalREC = $this->objGeneral->count_duplicate_in_sql('srm_invoice', $data_pass, $this->arrUser['company_id']);

            if ($totalREC > 0) 
            {
                // $this->objsetup->terminateWithMessage("Supplier Invoice No. Already Exists!");
                $response['ack'] = 0;
                $response['error'] = 'Supplier Invoice No. Already Exists!';

                $srLogTrace = array();
                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'Exit';
                $srLogTrace['ErrorMessage'] = 'Supplier Invoice No. Already Exists!';

                $this->objsetup->SRTraceLogsPHP($srLogTrace);
                return $response;                 
            }
        }
        $posting_grp = '';
        $ref_posting = ''; 
        $conversion_rate = 1;

        if($invoiceCurrencyID == 0){
            // $this->objsetup->terminateWithMessage("Currency is missing!");  
            $response['ack'] = 0;
            $response['error'] = 'Currency is missing!';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Currency is missing!';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);

            return $response; 
        }

        $date_ReceiveUnConvNoStockAllocReq = ""; 

        if (!empty($attr['currencyExchangeRateDate']) || $attr['currencyExchangeRateDate'] != ''){

            $currencyExchangeRateDate = $this->objGeneral->convert_date($attr['currencyExchangeRateDate']);

            if($attr['currencyExchangeRateDate'] > 0){
                $date_ReceiveUnConvNoStockAllocReq = "date_receivedUnConv = '" . $this->objGeneral->convertUnixDateIntoConvDate($attr['currencyExchangeRateDate']) . "',";     
            }
        }
        elseif (!empty($attr['orderDate']) || $attr['orderDate'] != ''){

            $currencyExchangeRateDate = $this->objGeneral->convert_date($attr['orderDate']);

            if($attr['orderDate'] > 0){
                $date_ReceiveUnConvNoStockAllocReq = "date_receivedUnConv = '" . $this->objGeneral->convertUnixDateIntoConvDate($attr['orderDate']) . "',";     
            }
        }
        else{

            $currencyExchangeRateDate = current_date;
            $date_ReceiveUnConvNoStockAllocReq = "date_receivedUnConv = '" . $this->objGeneral->convertUnixDateIntoConvDate(current_date) . "',";     
        }     

        if (!empty($attr['orderDate']) || $attr['orderDate'] != '')
            $orderDate = $this->objGeneral->convert_date($attr['orderDate']);
        else
            $orderDate = current_date;

        $srLogTrace = array();
        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_3;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'orderDate:'.$orderDate;

        $this->objsetup->SRTraceLogsPHP($srLogTrace);        

        if($invoiceCurrencyID != $defaultCurrencyID){            

            $Sqla = "SELECT d.conversion_rate  
                    FROM currency_histroy d 
                    WHERE d.currency_id='".$invoiceCurrencyID."' AND 
                          (FLOOR(d.start_date/86400)*86400) <= '" . $currencyExchangeRateDate . "' AND
                          d.company_id =	'" . $this->arrUser['company_id'] . "'	
                    order by d.start_date DESC, d.action_date desc LIMIT 1  ";       

            $RSa = $this->objsetup->CSI($Sqla);

            if ($RSa->RecordCount() > 0) {
                $Rowa = $RSa->FetchRow();
                $conversion_rate = $Rowa['conversion_rate'];
            }
            else{
                $response['ack'] = 0;
                $response['error'] = "Please set the currency conversion rate!";

                $srLogTrace = array();
                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'Exit';
                $srLogTrace['ErrorMessage'] = 'Please set the currency conversion rate!';

                $this->objsetup->SRTraceLogsPHP($srLogTrace);
                return $response; 
            }             
        }  

        $SqlSupp = "SELECT d.posting_group_id,
                        ref_posting_group.name as ref_posting
                    FROM srm_finance d
                    LEFT JOIN ref_posting_group on ref_posting_group.id=d.posting_group_id
                    WHERE d.supplier_id=$supplierID
                    LIMIT 1";
                    
        //echo 	$SqlSupp;exit;
        $RSSupp = $this->objsetup->CSI($SqlSupp);      

        if ($RSSupp->RecordCount() > 0) {
            $RowSupp = $RSSupp->FetchRow();
            $posting_grp = $RowSupp['posting_group_id'];
            $ref_posting = $RowSupp['ref_posting'];
        } 
        else{
            $response['ack'] = 0;
            $response['error'] = 'Supplier Posting Group is not selected!';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Supplier Posting Group is not selected!';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            return $response; 
        }         
     
        if($NoStockAllocReqArray)
        {
            foreach($NoStockAllocReqArray as $item){

                $purchase_return_status = "";
                $itemPurchase_return_status = (isset($item->purchase_return_status) && $item->purchase_return_status!='')?$item->purchase_return_status:0; 

                if ($itemPurchase_return_status>0)
                    $purchase_return_status .= "  purchase_return_status = 1 ";
                else
                    $purchase_return_status .= "  purchase_return_status = 0 ";  

                $purchase_order_detail_id = (isset($item->update_id) && $item->update_id!='')?$item->update_id:0;          
                $qty = (isset($item->qty) && $item->qty!='')?$item->qty:0;          
                $invoice_id = (isset($item->invoice_id) && $item->invoice_id!='')?$item->invoice_id:0;          
                $productid = (isset($item->productid) && $item->productid!='')?$item->productid:0;          
                $warehouse_id = (isset($item->warehouse_id) && $item->warehouse_id!='')?$item->warehouse_id:0;          
                $type = (isset($item->type) && $item->type!='')?$item->type:0;          
                $supplier_id = (isset($item->supplier_id) && $item->supplier_id!='')?$item->supplier_id:0;          
                $primary_unit_id = (isset($item->primary_unit_id) && $item->primary_unit_id!='')?$item->primary_unit_id:0;          
                $primary_unit_qty = (isset($item->primary_unit_qty) && $item->primary_unit_qty!='')?$item->primary_unit_qty:0;          
                $unit_measure_id = (isset($item->unit_measure_id) && $item->unit_measure_id!='')?$item->unit_measure_id:0;          
                $unit_measure_qty = (isset($item->unit_measure_qty) && $item->unit_measure_qty!='')?$item->unit_measure_qty:1;        

                $data_pass = "  tst.type='" . $type . "' and
                                tst.order_id='" . $invoice_id . "'  and
                                tst.product_id='" . $productid . "' and
                                tst.supplier_id='" . $supplier_id . "' and
                                tst.warehouse_id='" . $warehouse_id . "' and
                                tst.purchase_order_detail_id='" . $purchase_order_detail_id. "' and
                                tst.purchase_return_status = 0"; //tst.purchase_return_status = 0

                $duplicateRecordID = $this->objGeneral->getDuplicateRecordID('warehouse_allocation', $data_pass, $this->arrUser['company_id']);

                /* $date_received = $this->objGeneral->convert_date($attr['currencyExchangeRateDate']);

                $date_receivedUnConv = ""; 

                if($attr['currencyExchangeRateDate'] > 0){
                    $date_receivedUnConv = "date_receivedUnConv = '" . $this->objGeneral->convertUnixDateIntoConvDate($attr['currencyExchangeRateDate']) . "',";            
                } */
      

                if ($duplicateRecordID == 0) {

                    $Sql1 = "INSERT INTO warehouse_allocation
                                        SET
                                            " . $purchase_return_status . ",
                                            status=1,
                                            purchase_order_detail_id='" . $purchase_order_detail_id . "',
                                            purchase_status='2',
                                            quantity='" . $qty . "',
                                            remaining_qty = '" . $qty . "',
                                            order_id='" . $invoice_id . "',
                                            product_id='" . $productid . "',
                                            warehouse_id='" . $warehouse_id . "',
                                            type='" . $type . "',
                                            supplier_id='" . $supplier_id . "',
                                            order_date='" . $this->objGeneral->convert_date($item->order_date) . "',
                                            unit_measure='" . $item->unit_measure_name . "',
                                            primary_unit_id='" . $primary_unit_id . "',
                                            primary_unit_name='" . $item->primary_unit_name . "',
                                            primary_unit_qty='" . $primary_unit_qty . "' ,
                                            unit_measure_id='" . $unit_measure_id . "',
                                            unit_measure_name='" . $item->unit_measure_name . "',
                                            unit_measure_qty='" . $unit_measure_qty . "',
                                            dispatch_date='" . $orderDate . "',
                                            date_received='" . $currencyExchangeRateDate. "',
                                            $date_ReceiveUnConvNoStockAllocReq
                                            item_trace_unique_id = UUID(),
                                            user_id='" . $this->arrUser['id'] . "',
                                            company_id='" . $this->arrUser['company_id'] . "'";
                } else {
                     $Sql1 = "UPDATE warehouse_allocation
                                    SET
                                        quantity='" . $qty . "',
                                        remaining_qty = '" . $qty . "',
                                        primary_unit_id='" . $primary_unit_id . "',
                                        primary_unit_name='" . $item->primary_unit_name . "',
                                        primary_unit_qty='" . $primary_unit_qty . "',
                                        purchase_status='2',
                                        dispatch_date='" . $orderDate . "',
                                        date_received='" . $currencyExchangeRateDate. "',
                                        $date_ReceiveUnConvNoStockAllocReq
                                        unit_measure_id='" . $unit_measure_id . "',
                                        unit_measure_name='" . $item->unit_measure_name . "',
                                        unit_measure_qty='" . $unit_measure_qty . "'
                                    WHERE id = " . $duplicateRecordID . "   
                                    Limit 1"; 
                }

                $RS1 = $this->objsetup->CSI($Sql1);
                
                if ($duplicateRecordID == 0)
                    $duplicateRecordID = $this->Conn->Insert_ID();                    
            } 
        } 

        /* 
        (CASE WHEN (SR_CURRENT_OR_AVAILABLE_STOCK(endlink.product_id,'" . $this->arrUser['company_id'] . "',2) > (endlink.raw_material_qty * sid.qty))
                                    THEN 1
                                    ELSE 0
                                    END )AS availRawMaterailStock
         */

        if($purchaseStatus != 2){
            
            $sqlRawMaterialChk="SELECT sid.id,prd.description,prd.product_code,sid.qty,sid.unit_measure,sid.product_code AS finishedGoodItemCode,
                                    (CASE WHEN (COALESCE((SELECT SUM(remaining_qty) 
                                                    FROM item_in_cost_entries 
                                                    WHERE company_id = sid.company_id AND product_id = endlink.product_id AND remaining_qty > 0),0)+1 > 
                                                    ((endlink.raw_material_qty/endlink.finished_uom_qty) * sid.qty))
                                        THEN 1
                                        ELSE 0
                                        END ) AS availRawMaterailStock
                                FROM srm_invoice_detail AS sid
                                LEFT JOIN end_product_link AS endlink ON endlink.finished_item_id = sid.product_id
                                LEFT JOIN product as prd on endlink.product_id = prd.id
                                WHERE sid.company_id='" . $this->arrUser['company_id'] . "' AND 
                                    sid.invoice_id = '" . $purchaseInvoice_id . "' AND 
                                    sid.rawMaterialProduct = 0 AND
                                    sid.type = 0 AND 
                                    endlink.product_id >0";
                                    /* 
                                HAVING availRawMaterailStock>0 */

            $RsRawMaterialChk = $this->objsetup->CSI($sqlRawMaterialChk);

            $rawMaterialErrorCounter = 0;
            $prevLineItem = 0;
            // $rawMaterialErrorMsg = 'Following Raw Material(s) Stock is not Enough ';
            $rawMaterialErrorMsg = '';
            $rawMaterialErrorMsgFinishedGood = '';
            // $rawMaterialErrorMsg = 'There is not enough Qty available of raw material BY787, BY790 to purchase 98 cases of AVT768. ';

            $noofRec = $RsRawMaterialChk->RecordCount();
            $noofRecCounter = 0;

            if ($noofRec > 0) {
                while ($RowRawMaterialChk = $RsRawMaterialChk->FetchRow()) {

                    $noofRecCounter++;

                    if($RowRawMaterialChk['availRawMaterailStock'] == 0){

                        $lineId = $RowRawMaterialChk['id'];

                        if($prevLineItem != $lineId){

                            if($prevLineItem >0){
                                $rawMaterialErrorMsg = rtrim($rawMaterialErrorMsg,",");

                                $rawMaterialErrorMsg .= ' to purchase '.$RowRawMaterialChk['qty'].' '.$RowRawMaterialChk['unit_measure']. ' of '.$rawMaterialErrorMsgFinishedGood. '. ';

                                // $rawMaterialErrorMsg .= 'to purchase '.$RowRawMaterialChk['qty'].' '.$RowRawMaterialChk['unit_measure']. ' of '.$RowRawMaterialChk['finishedGoodItemCode']. '. ';
                            }

                            $rawMaterialErrorMsg .= 'There is not enough Qty available of raw material ';

                            $prevLineItem = $lineId; 
                        }

                        $rawMaterialErrorCounter++;
                        // $rawMaterialErrorMsg .= ' '.$RowRawMaterialChk['description'].'('.$RowRawMaterialChk['product_code'].'),';
                        $rawMaterialErrorMsg .= ' '.$RowRawMaterialChk['product_code'].',';

                        $rawMaterialErrorMsgFinishedGood = $RowRawMaterialChk['finishedGoodItemCode'];
                    }

                    if($noofRec == $noofRecCounter && $rawMaterialErrorCounter>0){
                        // $rawMaterialErrorMsg .= 'to purchase '.$RowRawMaterialChk['qty'].' '.$RowRawMaterialChk['unit_measure']. ' of '.$RowRawMaterialChk['finishedGoodItemCode']. '. ';
                        $rawMaterialErrorMsg = rtrim($rawMaterialErrorMsg,",");
                        $rawMaterialErrorMsg .= ' to purchase '.$RowRawMaterialChk['qty'].' '.$RowRawMaterialChk['unit_measure']. ' of '.$rawMaterialErrorMsgFinishedGood. '. ';
                    }
                }
            }

            // $rawMaterialErrorMsg = rtrim($rawMaterialErrorMsg,",");

            if($rawMaterialErrorCounter > 0){
                $response['ack'] = 0;
                $response['error'] = $rawMaterialErrorMsg;

                $srLogTrace = array();
                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'Exit';
                $srLogTrace['ErrorMessage'] = $rawMaterialErrorMsg;

                $this->objsetup->SRTraceLogsPHP($srLogTrace);
                return $response;
            }
        }
          
        $additionalCostCurr = 0;

        if($allItemsArray)
        {
            foreach($allItemsArray as $item){                
                    
                $productid = (isset($item->productid) && $item->productid!='')?$item->productid:0;
                $item_type = (isset($item->item_type) && $item->item_type!='')?$item->item_type:0;                             
                $qty = (isset($item->qty) && $item->qty!='')?$item->qty:0;                             
                $price = (isset($item->price) && $item->price!='')?$item->price:0;                             
                $consignmentNo = (isset($item->consignmentNo) && $item->consignmentNo!='')?$item->consignmentNo:0;                             
                $supplier_id = (isset($item->supplier_id) && $item->supplier_id!='')?$item->supplier_id:0; 
                $invoice_id = (isset($item->invoice_id) && $item->invoice_id!='')?$item->invoice_id:0; 
                $orderLineID = (isset($item->update_id) && $item->update_id!='')?$item->update_id:0; 
                $itemDiscountAmount = (isset($item->itemDiscountAmount) && $item->itemDiscountAmount!='')?$item->itemDiscountAmount:0;                
                $unit_measure_id = (isset($item->unit_measure_id) && $item->unit_measure_id!='')?$item->unit_measure_id:0; 
                $VATID = (isset($item->VATID) && $item->VATID!='')?$item->VATID:0; 
                $warehouse_id = (isset($item->warehouse_id) && $item->warehouse_id!='')?$item->warehouse_id:0; 

                $rawMaterialProduct = (isset($item->rawMaterialProduct) && $item->rawMaterialProduct!='')?$item->rawMaterialProduct:0; 
                $raw_material_gl_id = (isset($item->raw_material_gl_id) && $item->raw_material_gl_id!='')?$item->raw_material_gl_id:0; 

                $itemAmount = $qty*$price;

                if($productid>0 && $supplier_id>0 && $item_type==0){

                    $Sql4 = "SELECT addCost.priceID,
                                    addCost.itemID,
                                    addCost.descriptionID,
                                    addCost.description,
                                    addCost.cost,
                                    addCost.currencyID,
                                    addCost.cost_gl_code_id,
                                    addCost.cost_gl_code 
                             FROM price_list_additional_cost addCost
                             LEFT JOIN priceoffer ON priceoffer.id = addCost.priceID
                             WHERE addCost.status=1 AND 
                                   addCost.itemID='" . $productid . "' AND
                                   priceoffer.moduleID='" . $supplier_id . "' AND
                                   priceoffer.moduleType=2 AND
                                   priceoffer.priceType IN (2,3) AND
                                   (FLOOR(priceoffer.start_date/86400)*86400)  <= '" . $orderDate . "' AND
                                   CASE WHEN priceoffer.end_date = 0 THEN 4099299120 
                                        ELSE (FLOOR(priceoffer.end_date/86400)*86400) 
                                    END >= '" . $orderDate . "' AND
                                   addCost.company_id='" . $this->arrUser['company_id'] . "'";
                    // echo $Sql4;exit;
                    // $RS4 = $this->objsetup->CSI($Sql4);
                    // $costTtl = $price;
                    // echo $RS4->RecordCount();

                    $RS4 = $this->objsetup->CSI($Sql4);

                    if ($RS4->RecordCount() > 0) {
                        while ($Row = $RS4->FetchRow()) {
                            $result = array();
                            $id = $Row['id'];
                            // $descriptionID = $Row['descriptionID'];
                            $descriptionID = (isset($Row['descriptionID']) && $Row['descriptionID']!='')?$Row['descriptionID']:0; 
                            $addPriceCurrencyID = (isset($Row['currencyID']) && $Row['currencyID']!='')?$Row['currencyID']:0; 

                            $priceID = (isset($Row['priceID']) && $Row['priceID']!='')?$Row['priceID']:0; 

                            $description = $Row['description'];
                            $cost = $Row['cost'];                            

                            $amount = $cost*$qty;                       
                           
                            $cost_gl_code_id = $Row['cost_gl_code_id'];
                            $cost_gl_code = $Row['cost_gl_code'];
                            
                            // $addPriceCurrencyID = $Row['currencyID'];
                            // $addPricecurrencyCode = $Row['currencyCode'];

                            $cost_gl_code = explode("-",$cost_gl_code);
                            $costGLNumber =$cost_gl_code[0];
                            $costGLName =$cost_gl_code[1];

                            $data_pass = "  tst.invoice_id='" . $invoice_id . "' and
                                            tst.transactionType=1  and
                                            tst.descriptionID='" . $descriptionID . "' and
                                            tst.product_id='" . $productid . "' and
                                            tst.supplier_id='" . $supplier_id . "' and
                                            tst.orderLineID='" . $orderLineID . "' and
                                            tst.gl_account_id='" . $cost_gl_code_id . "'";

                            $duplicateCHK = $this->objGeneral->getDuplicateRecordID('gl_account_additional_cost_txn', $data_pass, $this->arrUser['company_id']);
                
                            if ($duplicateCHK == 0) {

                                // $costTtl += $cost;

                                if( $addPriceCurrencyID == $defaultCurrencyID){
                                    $currencyRate = 1;
                                }
                                else{
                                    $currencyRate = -1;

                                    $sqlb=" SELECT COALESCE((SELECT conversion_rate
                                                             FROM currency_histroy
                                                             WHERE currency_id = $addPriceCurrencyID AND  
                                                                   (FLOOR(start_date/86400)*86400) <= $currencyExchangeRateDate AND
                                                                   company_id = '" . $this->arrUser['company_id'] . "'
                                                             ORDER BY start_date DESC, action_date DESC 
                                                             LIMIT 1),-1) AS retVal";

                                    $RSb = $this->objsetup->CSI($sqlb);
                                    $Rowb = $RSb->FetchRow();
                                    $currencyRate =  $Rowb['retVal'];

                                    if($currencyRate == -1){
                                        /* $response['ack'] = 0;
                                        $response['error'] = 'Conversion Rate Is not defined for Additional Cost Currency!';
                                        $additionalCostCurr++;
                                        return $response; */
                                        $this->objsetup->terminateWithMessage("Conversion Rate Is not defined for Additional Cost Currency!");
                                    }
                                }                                

                                //SR_GetConversionRateByDate('".$orderDate."', '" . $addPriceCurrencyID . "', '" . $this->arrUser['company_id'] . "'),

                                $Sql5 = "INSERT INTO gl_account_additional_cost_txn
                                                        SET                               
                                                            gl_account_id='" . $cost_gl_code_id . "',
                                                            gl_account_name='" . $costGLName . "',
                                                            gl_account_code='" . $costGLNumber . "',
                                                            postingDate='" . $orderDate. "',
                                                            transactionType='1',
                                                            invoice_id='".$invoice_id."',
                                                            priceoffer_id='".$priceID."',
                                                            descriptionID='".$descriptionID."',
                                                            description='".$description."',
                                                            uomID='".$unit_measure_id."',
                                                            consignmentNo='" . $consignmentNo . "',
                                                            qty='" . $qty. "',
                                                            unitPrice='" . $cost . "',
                                                            currencyID='" . $addPriceCurrencyID . "',
                                                            currency_rate = '" . $currencyRate . "',
                                                            amount='" . $amount . "',
                                                            product_id='" . $productid . "',
                                                            supplier_id='" . $supplier_id . "',
                                                            paymentStatus=0,
                                                            inOutTransaction=0,
                                                            orderLineID='" . $orderLineID . "',
                                                            user_id='" . $this->arrUser['id'] . "',
                                                            company_id='" . $this->arrUser['company_id'] . "',
                                                            AddedBy='" . $this->arrUser['id'] . "',
                                                            AddedOn=UNIX_TIMESTAMP (NOW())";
                                // echo $Sql5;exit;

                                $RS5 = $this->objsetup->CSI($Sql5);

                                // mysqli_free_result($RS5);
                            }                                                     
                        }                        
                    }
                    // echo "###############".$recReceivedMode;

                    // 1 means Goods are going to be received first but not invoiced.
                    if($recReceivedMode>0){

                        $rawMaterialProduct = 0;
                        

                         $Sql6 = "INSERT INTO purchaseordertxn
                                                        SET 
                                                            invoice_id='".$invoice_id."',
                                                            itemID='".$productid."',
                                                            itemAmount='".$itemDiscountAmount."',
                                                            postStatus='0',
                                                            user_id='" . $this->arrUser['id'] . "',
                                                            company_id='" . $this->arrUser['company_id'] . "',
                                                            AddedBy='" . $this->arrUser['id'] . "',
                                                            AddedOn=UNIX_TIMESTAMP (NOW()),
                                                            ObjectDetailID='" . $orderLineID . "',
                                                            VATID='" . $VATID . "',
                                                            VATName='" . $item->VATName . "',
                                                            rawMaterialProduct = '" . $rawMaterialProduct. "',
                                                            raw_material_gl_id = '" . $raw_material_gl_id . "',
                                                            raw_material_gl_code = '" . $item->raw_material_gl_code . "',
                                                            raw_material_gl_name = '" . $item->raw_material_gl_name . "'
                                                            ";
                        /*                                                             
                        GLorProductID='" . $productid . "',
                        GLorProductCode='" . $item->code . "',
                        GlorProductName='" . $item->product_name . "', */
                        // echo $Sql6;exit;
                        $RS6 = $this->objsetup->CSI($Sql6);                      
                    } 

                    // Raw Material Allocation To finished goods

                    if($rawMaterialProduct == 0){

                        /* $sqlAllocatedRow = "SELECT id,ref_po_id,item_trace_unique_id
                                            FROM warehouse_allocation
                                            WHERE company_id = '" . $this->arrUser['company_id'] . "' AND 
                                                  order_id = '" . $invoice_id . "' AND 
                                                  type=1 AND 
                                                  purchase_order_detail_id='" . $orderLineID . "' AND
                                                  status = 1";

                        $RsAllocatedRow = $this->objsetup->CSI($sqlAllocatedRow);     

                        $warehoueAllocID = $RsAllocatedRow->fields['id'];
                        $warehoueAllocRefPOID = $RsAllocatedRow->fields['ref_po_id'];
                        $warehoueAllocUniqueID = $RsAllocatedRow->fields['item_trace_unique_id'];

                        echo $warehoueAllocID.'======='.$warehoueAllocRefPOID.'\\\\\\\\\\'.$warehoueAllocUniqueID.'=======';exit; */


                        // /*  ================================ */

                        /* $sqlRawMaterialAlloc = "SELECT raw_material_qty,finished_uom_qty,product_id
                                                FROM end_product_link
                                                WHERE company_id='" . $this->arrUser['company_id'] . "' AND 
                                                      finished_item_id = '" . $productid . "' AND 
                                                      status = 1";

                        $RsRawMaterialAlloc = $this->objsetup->CSI($sqlRawMaterialAlloc);                       

                        if ($RsRawMaterialAlloc->RecordCount() > 0) {

                            while ($RowRawMaterialAlloc= $RsRawMaterialAlloc->FetchRow()) {


                                // $sqlRawMaterialtraceId = "  SELECT wa.quantity,iice.remaining_qty,wa.item_trace_unique_id,wa.id,wa.warehouse_id
                                //                             FROM item_in_cost_entries AS iice
                                //                             LEFT JOIN warehouse_allocation AS wa ON (wa.product_id = iice.product_id AND 
                                //                                                 ((wa.order_id = iice.invoice_id AND wa.purchase_order_detail_id = iice.order_detail_id AND wa.type = 1 AND iice.invoice_type = 1)  OR 
                                //                                                 (wa.order_id = iice.invoice_id AND wa.sale_order_detail_id = iice.order_detail_id AND wa.type = 2 AND iice.invoice_type = 2)OR 
                                //                                                 (wa.order_id = iice.invoice_id AND wa.item_journal_detail_id = iice.order_detail_id AND wa.type = 3 AND iice.invoice_type = 4) OR 
                                //                                                 (wa.opBalncID = iice.invoice_id AND wa.type = 4 AND iice.invoice_type = 3)))
                                //                             WHERE   iice.company_id = '" . $this->arrUser['company_id'] . "' AND 
                                //                                     iice.product_id = '" . $rawMaterialProdID . "' AND 
                                //                                     iice.remaining_qty > 0 
                                //                             ORDER BY iice.posting_date, iice.posted_on";

                                // $RsRawMaterialtraceId = $this->objsetup->CSI($sqlRawMaterialtraceId);                       

                                // if ($RsRawMaterialtraceId->RecordCount() > 0) {

                                //     while ($RowRawMaterialtrace= $RsRawMaterialtraceId->FetchRow()) {

                                //         $remaining_qty = $RowRawMaterialtrace['remaining_qty'];
                                //         $actualQty = $RowRawMaterialtrace['quantity'];
                                //         $item_trace_unique_id = $RowRawMaterialtrace['item_trace_unique_id'];
                                //         $refPOid = $RowRawMaterialtrace['id'];
                                //         $warehouse_id = $RowRawMaterialtrace['warehouse_id'];

                                //     }
                                // } 

                                $dupRecRawMaterialID = 0;
                                $totalRawMaterialQty = 0;

                                $totalRawMaterialQty = ($RowRawMaterialAlloc['raw_material_qty']/$RowRawMaterialAlloc['finished_uom_qty'] ) * $qty;   
                                $rawMaterialProdID = $RowRawMaterialAlloc['product_id'];   

                                $data_pass = "  tst.type = 1 and
                                                tst.order_id = '" . $invoice_id . "'  and
                                                tst.product_id = '" . $rawMaterialProdID . "' and
                                                tst.supplier_id = '" . $supplier_id . "' and
                                                tst.raw_material_out = 1 and
                                                tst.purchase_order_detail_id='" . $orderLineID. "' and
                                                tst.purchase_return_status = 0 ";

                                $dupRecRawMaterialID = $this->objGeneral->getDuplicateRecordID('warehouse_allocation', $data_pass, $this->arrUser['company_id']);              

                                if ($dupRecRawMaterialID == 0) {

                                    $SqlRawMaterial = "INSERT INTO warehouse_allocation
                                                        SET
                                                            purchase_return_status = 0,
                                                            status=1,
                                                            purchase_order_detail_id='" . $orderLineID . "',
                                                            sale_status='0',
                                                            purchase_status='0',
                                                            quantity='" . $totalRawMaterialQty . "',
                                                            remaining_qty='" . $totalRawMaterialQty . "',                                                            
                                                            order_id='" . $invoice_id . "',
                                                            product_id='" . $rawMaterialProdID . "',
                                                            warehouse_id='" . $warehouse_id . "',
                                                            type=1,
                                                            supplier_id='" . $supplier_id . "',
                                                            unit_measure_id='" . $unit_measure_id . "',
                                                            unit_measure_qty=1,
                                                            item_trace_unique_id = UUID(),
                                                            raw_material_out = 1,
                                                            user_id='" . $this->arrUser['id'] . "',
                                                            company_id='" . $this->arrUser['company_id'] . "'";
                                } else {
                                    $SqlRawMaterial = "UPDATE warehouse_allocation
                                                        SET
                                                            quantity='" . $totalRawMaterialQty . "',
                                                            remaining_qty='" . $totalRawMaterialQty . "',  
                                                            purchase_status='0',
                                                            raw_material_out = 1,
                                                            unit_measure_id='" . $unit_measure_id . "'
                                                        WHERE id = " . $dupRecRawMaterialID . "   
                                                        Limit 1"; 
                                }

                                $RSRawMaterial = $this->objsetup->CSI($SqlRawMaterial);
                            }
                        } */
                    }
                }              

                $item_converted_price = Round(($price/$conversion_rate),3); // bcdiv($price, $conversion_rate, 3);

                $sql3 = "UPDATE srm_invoice_detail 
                                    SET 
                                        item_converted_price = '" . $item_converted_price . "',
                                        ChangedBy='" . $this->arrUser['id'] . "',
                                        ChangedOn=UNIX_TIMESTAMP (NOW())
                                    WHERE id = " . $orderLineID . " 
                                    LIMIT 1";
                //echo $sql3;
                $RS3 = $this->objsetup->CSI($sql3, 'purchase_order', sr_EditPermission);                               
            }           
        }

        if($additionalCostCurr>0){
            /* $response['ack'] = 0;
            $response['error'] = 'Conversion Rate Is not defined for Additional Cost Currency!';
            return $response; */
            $this->objsetup->terminateWithMessage("Conversion Rate Is not defined for Additional Cost Currency!");
        }


        // 1 means Goods are going to be received first but not invoiced

        //  echo $recReceivedMode;exit;
        if($recReceivedMode>0){

            $Sql4 = "UPDATE srm_invoice 
                            SET 
                                bill_to_posting_group_id = '" . $posting_grp . "', 
                                bill_to_posting_group_name = '" . $ref_posting . "'
                     WHERE id = " . $purchaseInvoice_id . " 
                     limit 1";

            // echo $Sql4;exit;
            $RS4 = $this->objsetup->CSI($Sql4);            

            $Sqlnew = "CALL SR_Purchase_order_received('".$purchaseInvoice_id."',
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
                                                        @param4);";
            // echo $Sqlnew;exit;
            $RSnew = $this->objsetup->CSI($Sqlnew); 
            // $RSnew->close();
            // mysqli_free_result($RSnew); 
            // print_r($RSnew); 

            if($RSnew->msg == 1)
            {             
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

                $this->objsetup->SRTraceLogsPHP($srLogTrace);
                return $response;
                // $this->objsetup->terminateWithMessage("postPurchaseInvoice");
            } 
            else
            { 
                $response['ack'] = 0;
                $response['error'] = $RSnew->Error;

                $srLogTrace = array();
                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'Exit';
                $srLogTrace['ErrorMessage'] = $RSnew->Error;

                $this->objsetup->SRTraceLogsPHP($srLogTrace);

                return $response;
            }           
        }
        else{
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

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            return $response;

        } 
        // echo $recGoodsReceived; exit;
    }

    // Post Purchase Invoice function

    function postPurchaseInvoice($attr)
    {       
        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['Parameter2'] = 'order_id:'.$attr['rec']->order_id;
        $srLogTrace['ErrorMessage'] = "";

        $this->objsetup->SRTraceLogsPHP($srLogTrace);

        $checkAlreadyPosted = "SELECT purchaseStatus, invoice_code 
                                FROM srm_invoice 
                                WHERE id= " . $attr['rec']->order_id . " AND 
                                      company_id = '" . $this->arrUser['company_id'] . "'
                                LIMIT 1";        
        $RsAlreadyPosted = $this->objsetup->CSI($checkAlreadyPosted);

        $purchaseStatus = $RsAlreadyPosted->fields['purchaseStatus'];
        
        if($purchaseStatus == 3)
        {
            // $this->objsetup->terminateWithMessage("Journal already Posted");
            $response['ack'] = 2;
            $response['error'] = ' Already posted with Invoice No. '.$RsAlreadyPosted->fields['invoice_code'];

            $srLogTrace = array();

            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Already posted!';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            return $response;
        }
        // else
        // {
        
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
              
        $conversion_rate = 1;
        $itemsArray = $attr['itemsArray'];
        $noItemExist = $attr['noItemExist'];

        $recReceivedMode = (isset($attr['recReceivedMode']) && $attr['recReceivedMode']!='')?$attr['recReceivedMode']:0;
        // $suppInvNo = (isset($attr['suppInvNo']) && $attr['suppInvNo']!='')?$attr['suppInvNo']:0; 
        $suppInvNo = (isset($attr['suppInvNo']) && $attr['suppInvNo']!='')?trim(addslashes(stripslashes($attr['suppInvNo']))):'0';  
        $supplierID = (isset($attr['supplier_id']) && $attr['supplier_id']!='')?$attr['supplier_id']:0;        
        $invoiceCurrencyID = (isset($attr['invoiceCurrencyID']) && $attr['invoiceCurrencyID']!='')?$attr['invoiceCurrencyID']:0;        

        $data_pass = "  tst.status=1 and 
                        tst.supp_order_no='" . $suppInvNo . "' AND 
                        tst.sell_to_cust_id='" . $supplierID . "' AND 
                        tst.id <> " . $attr['rec']->order_id . ""; 
        $totalREC = $this->objGeneral->count_duplicate_in_sql('srm_invoice', $data_pass, $this->arrUser['company_id']);

        if ($totalREC > 0) 
        {
            // $this->objsetup->terminateWithMessage("Supplier Invoice No. Already Exists!");

            $response['ack'] = 0;
            $response['error'] = "Supplier Invoice No. Already Exists!";

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Supplier Invoice No. Already Exists!';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            return $response;
        }

        if($purchaseStatus == 2)
        {
            $recReceivedMode = 0;
        }

        if (!empty($attr['currencyExchangeRateDate']) || $attr['currencyExchangeRateDate'] != '')
            $currencyExchangeRateDate = $this->objGeneral->convert_date($attr['currencyExchangeRateDate']);
        elseif (!empty($attr['orderDate']) || $attr['orderDate'] != '')
            $currencyExchangeRateDate = $this->objGeneral->convert_date($attr['orderDate']);
        else
            $currencyExchangeRateDate = current_date;

        if (!empty($attr['orderDate']) || $attr['orderDate'] != '')
            $current_date = $this->objGeneral->convert_date($attr['orderDate']);
        else
            $current_date = current_date; 

        $srLogTrace = array();
        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_3;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'current_date:'.$current_date;

        $this->objsetup->SRTraceLogsPHP($srLogTrace);        
        
        if($invoiceCurrencyID == 0){
            // $this->objsetup->terminateWithMessage("Currency is missing!"); 
            $response['ack'] = 0;
            $response['error'] = "Currency is missing!";

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Currency is missing!';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            return $response;           
        } 

        $net_amount = (isset($attr['rec']->net_amount) && $attr['rec']->net_amount!='')?$attr['rec']->net_amount:0; 
        $tax_amount = (isset($attr['rec']->tax_amount) && $attr['rec']->tax_amount!='')?$attr['rec']->tax_amount:0; 
        $grand_total = (isset($attr['rec']->grand_total) && $attr['rec']->grand_total!='')?$attr['rec']->grand_total:0;        

        if($attr['invoiceCurrencyID'] != $attr['defaultCurrencyID']){            

            $Sql = "SELECT d.conversion_rate  
                    FROM currency_histroy d 
                    WHERE d.currency_id='".$attr['invoiceCurrencyID']."' AND 
                          (FLOOR(d.start_date/86400)*86400) <= '" . $currencyExchangeRateDate . "' AND
                          d.company_id =	'" . $this->arrUser['company_id'] . "'	
                    order by d.start_date DESC, d.action_date desc LIMIT 1  ";

            // $RS = $this->objsetup->CSI($Sql);        

            $RS = $this->objsetup->CSI($Sql, 'purchase_order', sr_PostPermission);

            if ($RS->RecordCount() > 0) {
                $Row = $RS->FetchRow();
                $conversion_rate = $Row['conversion_rate'];

                $net_amount_converted = bcdiv($net_amount, $conversion_rate, 2);
                $tax_amount_converted = bcdiv($tax_amount, $conversion_rate, 2);
                $grand_total_converted = bcdiv($grand_total, $conversion_rate, 2);
            }
            else{
                // $this->objsetup->terminateWithMessage("Please set the currency conversion rate!");
                $response['ack'] = 0;
                $response['error'] = "Please set the currency conversion rate!";

                $srLogTrace = array();
                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'Exit';
                $srLogTrace['ErrorMessage'] = 'Please set the currency conversion rate!';

                $this->objsetup->SRTraceLogsPHP($srLogTrace);
                return $response; 
            }             
        }
        else{
            $net_amount_converted = $net_amount;
            $tax_amount_converted = $tax_amount;
            $grand_total_converted = $grand_total;
        } 
        
        if($itemsArray)
        {
            foreach($itemsArray as $item){
                
                $item_converted_price = Round(($item->standard_price/$conversion_rate),3); //bcdiv($item->standard_price, $conversion_rate, 3);

                $sql3 = "UPDATE srm_invoice_detail 
                                    SET 
                                        item_converted_price = '" . $item_converted_price . "',
                                        purchase_status = 3,
                                        ChangedBy='" . $this->arrUser['id'] . "',
                                        ChangedOn=UNIX_TIMESTAMP (NOW())
                                    where id = " . $item->update_id . " 
                                    limit 1";
                //echo $sql3;
                // $RS3 = $this->objsetup->CSI($sql3);          
                $RS3 = $this->objsetup->CSI($sql3, 'purchase_order', sr_PostPermission);                             
            }
        }
   
        $posting_grp = 0;
        $ref_posting = '';        

        if($supplierID>0){

            $SqlSupp = "SELECT d.posting_group_id,
                               ref_posting_group.name as ref_posting
                        FROM srm_finance d
                        LEFT JOIN ref_posting_group on ref_posting_group.id=d.posting_group_id
                        WHERE d.supplier_id=".$supplierID."
                        LIMIT 1";
                        
            //echo 	$SqlSupp;exit;
            $RSSupp = $this->objsetup->CSI($SqlSupp);      

            if ($RSSupp->RecordCount() > 0) {
                $RowSupp = $RSSupp->FetchRow();
                $posting_grp = $RowSupp['posting_group_id'];
                $ref_posting = $RowSupp['ref_posting'];
            }
            else{
                // $this->objsetup->terminateWithMessage("Supplier Posting Group is not Selected!");
                $response['ack'] = 0;
                $response['error'] = "Supplier Posting Group is not Selected!";

                $srLogTrace = array();
                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'Exit';
                $srLogTrace['ErrorMessage'] = 'Supplier Posting Group is not Selected!';

                $this->objsetup->SRTraceLogsPHP($srLogTrace);

                return $response; 
            }
        }
        else{
                // $this->objsetup->terminateWithMessage("Supplier is not Selected!");
                $response['ack'] = 0;
                $response['error'] = "Supplier is not Selected!";

                $srLogTrace = array();
                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'Exit';
                $srLogTrace['ErrorMessage'] = 'Supplier is not Selected!';

                $this->objsetup->SRTraceLogsPHP($srLogTrace);

                return $response; 
        }

        /* 
        $sql5 = " SELECT product_id 
                    FROM warehouse_allocation
                    WHERE order_id = '".$attr['rec']->order_id."' AND 
                        type=1";  
        
        // $RS5 = $this->objsetup->CSI($sql5);
        $RS5 = $this->objsetup->CSI($sql5);

        if ($RS5->RecordCount() > 0) {
            while ($Row = $RS5->FetchRow()) {

                $product_id = $Row['product_id'];

                $Sql7 = "UPDATE warehouse_allocation 	
                            SET  item_trace_unique_id = UUID()
                            WHERE order_id = '".$attr['rec']->order_id."' AND 
                                type=1 AND 
                                product_id= '".$product_id."'";
        
                $RS7 = $this->objsetup->CSI($Sql7, 'purchase_order', sr_PostPermission);
            } 
        } 
        */

        // Already received stock before invoice.
        // echo $recReceivedMode;exit;

        if($recReceivedMode == 0 && $attr['rec']->order_id>0){

            $SqlGoodsReceived = "CALL SR_PurchaseInvoiceGoodsReceived('".$attr['rec']->order_id."',
                                                                      ".$this->arrUser['company_id'].",
                                                                      ".$this->arrUser['id'].",
                                                                      1,
                                                                      ".$attr['invoiceCurrencyID'].",
                                                                      ".$attr['defaultCurrencyID'].",
                                                                      ".$this->objGeneral->convert_date($attr['orderDate']).",
                                                                        @errorNo,
                                                                        @param1,
                                                                        @param2,
                                                                        @param3,
                                                                        @param4);";
            // echo $SqlGoodsReceived;
            // exit;
            $RSGoodsReceived = $this->objsetup->CSI($SqlGoodsReceived); 
        }

        $Sql4 = "UPDATE srm_invoice 
                            SET
                                converted_currency_id = '" . $attr['defaultCurrencyID'] . "', 
                                bill_to_posting_group_id = '" . $posting_grp . "', 
                                bill_to_posting_group_name = '" . $ref_posting . "',
                                net_amount='" . $net_amount. "', 
                                grand_total='" . $grand_total . "', 
                                tax_amount='" . $tax_amount . "',	
                                net_amount_converted='" . $net_amount_converted . "', 
                                grand_total_converted='" . $grand_total_converted . "', 
                                tax_amount_converted='".$tax_amount_converted."',
                                ChangedBy='" . $this->arrUser['id'] . "',
                                ChangedOn=UNIX_TIMESTAMP (NOW()),
                                currency_rate ='" . $conversion_rate . "' 
                WHERE id = " . $attr['rec']->order_id . " 
                limit 1";
            
        // $RS4 = $this->objsetup->CSI($Sql4);
        
        $RS4 = $this->objsetup->CSI($Sql4, 'purchase_order', sr_PostPermission);
         
        $items_net_discount = (isset($attr['rec']->items_net_discount) && $attr['rec']->items_net_discount!='')?$attr['rec']->items_net_discount:0; 

        $SqlPostAdditionalItemCosts = "CALL SR_PurchaseInvPostAddItemCosts('".$attr['rec']->order_id."',
                                                                        ".$this->arrUser['company_id'].",
                                                                        ".$this->arrUser['id'].", 
                                                                        ".$posting_grp.", 
                                                                        ".$attr['rec']->items_net_total.", 
                                                                        ".$attr['rec']->items_net_vat.", 
                                                                        ".$items_net_discount.", 
                                                                        ".$attr['rec']->grand_total.",
                                                                        ".$recReceivedMode.",
                                                                        @errorNo,
                                                                        @param1,
                                                                        @param2,
                                                                        @param3,
                                                                        @param4);";
        // echo $SqlPostAdditionalItemCosts;
        // exit;
      
        $RsPostAddItemCosts = $this->objsetup->CSI($SqlPostAdditionalItemCosts);

        if($RsPostAddItemCosts->msg == 1)
        {             
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

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            return $response;
            // $this->objsetup->terminateWithMessage("postPurchaseInvoice");
        }        
        else
        { 
            // print_r($RsPostAddItemCosts);exit
            $response['ack'] = 0;
            $response['error'] = $RsPostAddItemCosts->Error;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = $RsPostAddItemCosts->Error;

            $this->objsetup->SRTraceLogsPHP($srLogTrace);

            return $response;
            // $this->objsetup->terminateWithMessage("Cannot convert into invoice");
        }                
    } 
    
    //--------- srm order   details-----------------------------

    function get_location($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();
        $limit_clause = $where_clause = "";

        $Sql = "SELECT  warehouse.id , warehouse.name 
		        From warehouse
                where   warehouse.company_id=" . $this->arrUser['company_id'] . "	and 
                        warehouse.status = 1 " . $where_clause . " ";

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'warehouse', $order_by);
        //   echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['total'] = $total;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function get_invoice_sublist($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";
        $response = array();
        
        if ($attr['orderType'] == 1) $moduleForPermission = "purchase_invoice";
        else  $moduleForPermission = "purchase_order";

        $Sql = "SELECT *,(SELECT dispatchNoteEmail FROM warehouse WHERE id=es.warehouse_id) AS warehouse_email, 
                COALESCE((SELECT SUM(wa.quantity)
                            FROM warehouse_allocation wa
                            WHERE wa.purchase_order_detail_id = es.id AND
                                  wa.order_id = es.invoice_id AND 
                                  wa.company_id=" . $this->arrUser['company_id'] . "),0) AS allocQty
                FROM srm_invoice_detail es   
                WHERE   es.status=1 and 
                        es.invoice_id='".$attr['invoice_id']."'";

        // echo $Sql;  exit;
        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, $moduleForPermission, sr_ViewPermission);

        $Sql3 = "SELECT sell_to_cust_id,bill_to_posting_group_id From srm_invoice
                 WHERE id='".$attr['invoice_id']."'";
        //echo $Sql3."<hr>"; exit;

        $rs3 = $this->objsetup->CSI($Sql3);

        if ($rs3->RecordCount() > 0){
            $bill_to_posting_group_id = $rs3->fields['bill_to_posting_group_id'];
            $supplierId = $rs3->fields['sell_to_cust_id'];

            $temp_attr['posting_group_id'] = $bill_to_posting_group_id;
            $posting_group_arr = $this->objHr->get_vat_group_by_posting_group($temp_attr);
            $response['arrVATPostGrpPurchase'] = ($posting_group_arr['ack'] == 1) ? $posting_group_arr['response'] : array();
        }

        $volume = 0;
        $volume_unit = '';
        $weight = 0;
        $weightunit = '';
        $weight_permission = 0;  
        $volume_permission = 0;    

        $Sql4 = "SELECT  SUM(uomsetup.volume * inv.qty) AS volume,
                    'cm3' AS volume_unit,
                    SUM((CASE WHEN uomsetup.weightunit = 1 THEN (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2)) / 1000
                        ELSE (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2))
                        END)* inv.qty) AS weight,
                    'kg' AS weightunit,weight_permission,volume_permission
                FROM srm_invoice_detail AS inv
                LEFT JOIN units_of_measure_setup AS uomsetup ON inv.unit_measure_id = uomsetup.id
                LEFT JOIN items_weight_setup AS w ON w.title = 'Purchase Order' AND inv.company_id = w.company_id
                WHERE inv.invoice_id='".$attr['invoice_id']."' AND inv.type=0";
        //echo $Sql4."<hr>"; exit;

        $rs4 = $this->objsetup->CSI($Sql4);

        if ($rs4->RecordCount() > 0){
            $volume = $rs4->fields['volume'];
            $volume_unit = $rs4->fields['volume_unit'];
            $weight = $rs4->fields['weight'];
            $weightunit = $rs4->fields['weightunit'];
            $weight_permission = $rs4->fields['weight_permission'];
            $volume_permission = $rs4->fields['volume_permission'];
        }   

        if (!($supplierId>0)){
            $bill_to_posting_group_id  = $this->defaultPostingGrp();
            // $bill_to_posting_group_id = 0;
        }          


        if ($RS->RecordCount() > 0) 
        {          
            // require_once(SERVER_PATH . "/classes/Stock.php");
            // $this->objstock = new Stock($this->arrUser);

            while ($Row = $RS->FetchRow()) 
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                $attr['product_id'] = $Row['product_id'];
                $attr['warehouse_id'] = $Row['warehouse_id'];

                 if ($Row['type'] == '1') {

                    if($this->arrUser['company_id'] == 133){

                        // PBI: Requirment In GL For Vat GL Calculation in Vat column instead of general calculation. 
                        $sqlvat = " SELECT gl1.id AS gl1ID,gl1.accountCode AS gl1AccountCode,
                                        gl2.id AS gl2ID,gl2.accountCode AS gl2AccountCode,
                                        gl3.id AS gl3ID,gl3.accountCode AS gl3AccountCode
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
                        $sqlvat = "SELECT startRangeCode,endRangeCode 
                            FROM gl_account 
                            WHERE id = (SELECT VatPosting_gl_account 
                                            FROM financial_settings
                                            WHERE company_id='" . $this->arrUser['company_id'] . "')";
                    }

                    $RSV = $this->objsetup->CSI($sqlvat);
                    
                    if ($RSV->RecordCount() > 0) {
                        while ($RowVat = $RSV->FetchRow()) {
                            foreach ($RowVat as $key => $value) {
                                if (is_numeric($key))
                                    unset($RowVat[$key]);
                            }

                            if($this->arrUser['company_id'] == 133){
                                $Row['vatRange']['gl1AccountCode'] = $RowVat['gl1AccountCode'];
                                $Row['vatRange']['gl2AccountCode'] = $RowVat['gl2AccountCode'];
                                $Row['vatRange']['gl3AccountCode'] = $RowVat['gl3AccountCode'];
                            }
                            else{ 
                                //  print_r($RowVat);
                                $Row['vatRange']['startRangeCode'] = $RowVat['startRangeCode'];
                                $Row['vatRange']['endRangeCode'] = $RowVat['endRangeCode'];
                            }
                        }
                    }
                    
                }
                if($Row['type'] == 0){
                    $Row['arr_warehouse'] = $this->objstock->get_all_product_warehouses($attr);  
                    $Row['arr_units'] = $this->objstock->get_unit_setup_list_category_by_item($attr);                    
                    // $Row['currentStock'] = self::getCurrentStockByProductID($attr);   
                    $Row['currentStock'] = self::getCurrentStockByProductIDwarehouseID($attr); 

                    if ($supplierId > 0){
                        $Row['supplier_id'] = $supplierId;  
                        $Row['priceOfferArray'] = self::getArrVolumeDiscounts($Row);      
                        $Row['pricePurchaseInfoArray'] = self::getPricePurchaseInfo($Row);      
                    }
                }
                elseif($Row['type'] == 2){
                    $Sql2 = "select Coalesce(SUM(atc.amount),0) as additionAmount
                                from gl_account_additional_cost_txn as atc
                                where atc.inOutTransaction=1 AND
                                      atc.invoice_id ='".$attr['invoice_id']."' AND
                                      atc.orderLineID='" . $Row['id'] . "' AND
                                      atc.company_id='" . $this->arrUser['company_id'] . "' AND 
                                      atc.descriptionID='" . $Row['descriptionID'] . "'";

                    // echo $Sql2;  exit;
                    // $RS2 = $this->objsetup->CSI($Sql2);
                    
                    $RS2 = $this->objsetup->CSI($Sql2);

                    $Row2 = $RS2->FetchRow();
                    $Row['alreadyAddedAmount'] = $Row2['additionAmount'];
                }
                else{
                    $Row['arr_warehouse'] = '';  
                    $Row['arr_units'] = '';                    
                    $Row['currentStock'] = 0; 
                }
                
                $Row['bill_to_posting_group_id'] = $bill_to_posting_group_id; 
                
                // echo "<pre>";print_r($Row); exit;
                
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else 
        {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }

        $response['volume'] = $volume;
        $response['volume_unit'] = $volume_unit;
        $response['weight'] = $weight;
        $response['weightunit'] = $weightunit;
        $response['weight_permission'] = $weight_permission;
        $response['volume_permission'] = $volume_permission;

        //echo "<pre>";print_r($response); exit;
        return $response;
    }

    function getArrVolumeDiscounts($attr){
        $this->objGeneral->mysql_clean($attr);

        // echo '<pre>';print_r($attr);exit;

        $whereCond='';
        $whereCond="po.moduleID = ".$attr['supplier_id']." AND  po.moduleType = 2 AND";

        $Sql2 = "select order_date
                 from srm_invoice
                 where  id ='" . $Row['invoice_id'] . "'";

        // echo $Sql2;  exit;        
        $RS2 = $this->objsetup->CSI($Sql2);

        $Row2 = $RS2->FetchRow();
        $order_date = $Row2['order_date'];


        if(isset($order_date))
        {
            // $order_date = $this->objGeneral->convert_date($attr['order_date']);

            $whereCond .=" $order_date BETWEEN (FLOOR(po.start_date/86400)*86400) AND 
                            CASE WHEN po.end_date = 0 THEN 4099299120 
                                 ELSE (FLOOR(po.end_date/86400)*86400)
                            END AND ";
        }
        else
        {
            $whereCond .=" UNIX_TIMESTAMP (NOW()) BETWEEN (FLOOR(po.start_date/86400)*86400) AND 
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
                WHERE ".$whereCond." 
                      po.priceType IN (2,3) AND poi.itemID = ".$attr['product_id']."
                ORDER BY poi.`itemID`, poiv.min";

        // echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);
        $prev_item_id = 0;
        $count = -1;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                if($prev_item_id != $Row['item_id'])
                {
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

                if($prev_item_id == $Row['item_id'] && $Row['item_volume_id'] != null )
                {
                    $temp['volume_discount'] = $Row['volume_discount'];
                    $temp['discount_type']   = $Row['discount_type'];
                    $temp['min_qty']         = $Row['min_qty'];
                    
                    $response['response'][$count]['arr_volume_discounts'][]= $temp;
                }
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }

        return $response['response']; 

    }

    function getPricePurchaseInfo($attr){

        $this->objGeneral->mysql_clean($attr);

        // echo '<pre>';print_r($attr);exit;

        $whereCond='';

        $Sql2 = "select order_date
                 from srm_invoice
                 where  id ='" . $Row['invoice_id'] . "'";

        // echo $Sql2;  exit;        
        $RS2 = $this->objsetup->CSI($Sql2);

        $Row2 = $RS2->FetchRow();
        $order_date = $Row2['order_date'];


        if(isset($order_date))
        {
            $whereCond .=" $order_date BETWEEN (FLOOR(po.start_date/86400)*86400) AND 
                            CASE WHEN po.end_date = 0 THEN 4099299120 
                                 ELSE (FLOOR(po.end_date/86400)*86400)
                            END AND ";
        }
        else
        {
            $whereCond .=" UNIX_TIMESTAMP (NOW()) BETWEEN (FLOOR(po.start_date/86400)*86400) AND 
                            CASE WHEN po.end_date = 0 THEN 4099299120 
                                 ELSE (FLOOR(po.end_date/86400)*86400) 
                            END AND ";
        }

        $Sql = "SELECT  po.max_qty,po.min_max_sale_price AS maxPurchasePrice,po.min_qty,po.standard_price,po.uom_id
                FROM product_price AS po
                WHERE ".$whereCond."  po.type = 2 and po.product_id=".$attr['product_id']." 
                LIMIT 1";

        // echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);
        
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                $response['response']= $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }

        return $response['response']; 
    }


    function getCurrentStockByProductID($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT product.id,
                      " . $this->objGeneral->current_stock_counter($this->arrUser['company_id']) . "
                From product
                WHERE product.status=1  and 
                      product.product_code IS NOT NULL and 
                      product.id='" . $attr['product_id'] . "'  
                Limit 1";
        //echo $Sql."<hr>"; exit;

        // $rs_count = $this->objsetup->CSI($Sql);
        $rs_count = $this->objsetup->CSI($Sql);

        if ($rs_count->RecordCount() > 0)
            $currentStock = $rs_count->fields['current_stock'];
        else
            $currentStock = 0;

        
        return $currentStock;
    }


    function getCurrentStockByProductIDwarehouseID($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT prd.id,
                      " . $this->objGeneral->current_stock_counter_warehouse($this->arrUser['company_id'],$attr['warehouse_id']) . "
                From product as prd
                WHERE prd.status=1  and 
                      prd.product_code IS NOT NULL and 
                      prd.id='" . $attr['product_id'] . "'  
                Limit 1";
        //echo $Sql."<hr>"; exit;

        // $rs_count = $this->objsetup->CSI($Sql);
        $rs_count = $this->objsetup->CSI($Sql);

        if ($rs_count->RecordCount() > 0)
            $currentStock = $rs_count->fields['current_stock'];
        else
            $currentStock = 0;

        
        return $currentStock;
    }

    function getWarehouseAllocOrderLine($attr)
    {        
        $item = $attr['itemData'];     

        $invoice_id = (isset($item->orderID) && $item->orderID!='')?$item->orderID:0;
        $supplier_id = (isset($item->supplier_id) && $item->supplier_id!='')?$item->supplier_id:0;
        $selWarehousesid = (isset($item->warehouses->id) && $item->warehouses->id!='')?$item->warehouses->id:0;
        $selProduct_id = (isset($item->id) && $item->id!='')?$item->id:0;      
        $update_id = (isset($item->update_id) && $item->update_id!='')?$item->update_id:0;      

            
        require_once(SERVER_PATH . "/classes/Warehouse.php");
        $this->objWarehouse = new Warehouse($this->arrUser);

        $attr['wrh_id'] = $selWarehousesid;
        $attr['prod_id'] = $selProduct_id;

        $response['storage_loc'] = $this->objWarehouse->get_sel_warehouse_loc_in_stock_alloc($attr);

        $attr['warehouses_id'] = $selWarehousesid;
        $attr['product_id'] = $selProduct_id;
        $attr['order_id'] = $invoice_id;
        $attr['type_id'] = 1;// 1 for purchase order and 2 for sale order.

        $response['stockAlloc'] = $this->objWarehouse->get_stock_allocation($attr,$update_id);

        $response['ack'] = 1;
        $response['orderLineID'] = $update_id;
        // $response['orderLineID'] = $selRecordID;
        $response['error'] = NULL; 
        return $response;
    } 

    function insertNewOrderLine($attr)
    { 
        $tempOrderData = $attr['tempOrderData'];
        $tempOrderLineitemsArray = $attr['tempOrderLineitems'];
        $updateRec=0; 
        $selRecordID=0;

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
        

        // echo "<pre>";
        // print_r($tempOrderData);
        //  echo "====================<pre>";
        // print_r($tempOrderLineitemsArray);
        // exit;     

        $invoice_id = (isset($tempOrderData->orderID) && $tempOrderData->orderID!='')?$tempOrderData->orderID:0;
        $supplier_id = (isset($tempOrderData->supplier_id) && $tempOrderData->supplier_id!='')?$tempOrderData->supplier_id:0;
        $selWarehousesid = (isset($tempOrderData->warehouses->id) && $tempOrderData->warehouses->id!='')?$tempOrderData->warehouses->id:0;
        $itemType = (isset($tempOrderData->type_id) && $tempOrderData->type_id!='')?$tempOrderData->type_id:0;

        if(!($invoice_id>0)){
            $response['ack'] = 0;
            $response['error'] = 'Record Not Updated.';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record not updated';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);

            return $response;
        }

        $checkAlreadyPosted = "SELECT purchaseStatus, invoice_code 
                                FROM srm_invoice 
                                WHERE id= " . $invoice_id . " AND 
                                      company_id = '" . $this->arrUser['company_id'] . "'
                                LIMIT 1";        
        $RsAlreadyPosted = $this->objsetup->CSI($checkAlreadyPosted);
        $purchaseStatus = $RsAlreadyPosted->fields['purchaseStatus'];
        
        if($purchaseStatus == 3)
        {
            $response['ack'] = 2;
            $response['error'] = ' Already posted with Invoice No. '.$RsAlreadyPosted->fields['invoice_code'];

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Already posted!';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            return $response;
        }

        $this->objGeneral->mysql_clean($tempOrderLineitemsArray); 


        if($purchaseStatus == 2 && ($tempOrderLineitemsArray[0]->item_type == 0 || $tempOrderLineitemsArray[0]->item_type == 2))
        {
            $response['ack'] = 2;
            $response['error'] = 'Already Received';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Already Received';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            return $response;
        }

        foreach ($tempOrderLineitemsArray as $item2) 
        {

            $max_quantity = (isset($item2->max_quantity) && $item2->max_quantity!='')?$item2->max_quantity:0;
            $min_quantity = (isset($item2->min_quantity) && $item2->min_quantity!='')?$item2->min_quantity:0;
            $unit_measure_id = (isset($item2->units->id) && $item2->units->id!='')?$item2->units->id:0;
            $unit_qty = (isset($item2->units->quantity) && $item2->units->quantity!='')?$item2->units->quantity:0;
            $unit_parent_id = (isset($item2->units->parent_id) && $item2->units->parent_id!='')?$item2->units->parent_id:0;
            $unit_measure = (isset($item2->units->name) && $item2->units->name!='')?$item2->units->name:'';
            $conv_unit_price = (isset($item2->conv_unit_price) && $item2->conv_unit_price!='')?$item2->conv_unit_price:0;
            $purchase_unit_id = (isset($item2->purchase_unit_id) && $item2->purchase_unit_id!='')?$item2->purchase_unit_id:0;
            $discount_type_id = (isset($item2->discount_type_id->id) && $item2->discount_type_id->id!='')?$item2->discount_type_id->id:0;
            $discount = (isset($item2->discount) && $item2->discount!='')? Round($item2->discount,2) :0;
            $total_price = (isset($item2->total_price) && $item2->total_price!='')? Round($item2->total_price,2):0;
            $cat_id = (isset($item2->category_id) && $item2->category_id!='')?$item2->category_id:0;
            $sale_unit_id = (isset($item2->sale_unit_id) && $item2->sale_unit_id!='')?$item2->sale_unit_id:0;
            $primary_unit_of_measure_id = (isset($item2->primary_unit_of_measure_id) && $item2->primary_unit_of_measure_id!='')?$item2->primary_unit_of_measure_id:0;
            $primary_unit_of_measure_name = (isset($item2->primary_unit_of_measure_name) && $item2->primary_unit_of_measure_name!='')?$item2->primary_unit_of_measure_name:0;
            
            $vatsid = (isset($item2->vats->id) && $item2->vats->id!='')?$item2->vats->id:0;
            $vat_value = (isset($item2->vats->vat_value) && $item2->vats->vat_value!='')?$item2->vats->vat_value:0;
            $warehousesid = (isset($item2->warehouses->id) && $item2->warehouses->id!='')?$item2->warehouses->id:0;
            $warehousesname = (isset($item2->warehouses->name) && $item2->warehouses->name!='')?$item2->warehouses->name:0;
            $qty = (isset($item2->qty) && $item2->qty!='')?$item2->qty:0;
            $unit_price = (isset($item2->standard_price) && $item2->standard_price!='')?round($item2->standard_price,5):0;//$item2->standard_price
            $stock_check = (isset($item2->stock_check) && $item2->stock_check!='')?$item2->stock_check:0;
            $descriptionID = (isset($item2->descriptionID) && $item2->descriptionID!='')?$item2->descriptionID:0;
            $item_type = (isset($item2->item_type) && $item2->item_type!='')?$item2->item_type:0;           

            if($unit_measure_id == 0){
                $unit_measure_id = (isset($item2->arr_units[0]->id) && $item2->arr_units[0]->id!='')?$item2->arr_units[0]->id:0;
                $unit_measure = (isset($item2->unit_name) && $item2->unit_name!='')?$item2->unit_name:'';
            } 

            if($primary_unit_of_measure_id == 0){
                $primary_unit_of_measure_id = (isset($item2->unit_id) && $item2->unit_id!='')?$item2->unit_id:0;
                $primary_unit_of_measure_name = (isset($item2->unit_name) && $item2->unit_name!='')?$item2->unit_name:0;
            } 

            if($item_type==2){
                $unit_measure_id = (isset($item2->uomID) && $item2->uomID!='')?$item2->uomID:0;  
                $unit_measure = (isset($item2->uom) && $item2->uom!='')?$item2->uom:'';              
            } 

            if($item_type==0){
                
                $max_quantity = (isset($item2->maxPurchaseQty) && $item2->maxPurchaseQty!='')?$item2->maxPurchaseQty:0;
                $min_quantity = (isset($item2->minPurchaseQty) && $item2->minPurchaseQty!='')?$item2->minPurchaseQty:0;                          
            }  

            $vat_price = 0;

            if($vat_value>0){
                $vat_price = ($vat_value/100)*$unit_price;
            }        

            $selItemChk = (isset($item2->chk) && $item2->chk!='')?$item2->chk:0;

            $rawMaterialProduct = (isset($item2->rawMaterialProduct) && $item2->rawMaterialProduct!='')?$item2->rawMaterialProduct:0;
            $raw_material_gl_id = (isset($item2->raw_material_gl_id) && $item2->raw_material_gl_id!='')?$item2->raw_material_gl_id:0;

            $Sql = "INSERT INTO srm_invoice_detail
                                    SET
                                        invoice_id='" . $invoice_id . "',
                                        invoice_code='" . $tempOrderData->invoice_code . "',
                                        invoice_type='" . $tempOrderData->invoice_type . "',
                                        supplier_id='" . $supplier_id . "',
                                        product_id='" .$item2->id . "',
                                        product_name='" .$item2->product_name . "',
                                        product_code='" .$item2->product_code . "',
                                        descriptionID='" .$descriptionID . "',
                                        invoice_order_date='" . $this->objGeneral->convert_date($attr['order_date']) . "',
                                        max_quantity='" .$max_quantity . "',
                                        min_quantity='" .$min_quantity . "',
                                        uom_id='" .$unit_measure_id . "',
                                        qty='" .$qty. "',
                                        unit_price='" .$unit_price . "',
                                        vat='" . $item2->vats->name . "',
                                        vat_id='" . $vatsid . "',
                                        vat_price='" . $vat_price . "',
                                        vat_value='" . $vat_value . "',
                                        total_price='" .$total_price . "',
                                        unit_measure='" . $unit_measure . "',
                                        unit_measure_id='" . $unit_measure_id . "',
                                        unit_qty='" . $unit_qty . "',
                                        unit_parent_id='" . $unit_parent_id . "',
                                        cat_id='" .$cat_id . "',
                                        type='" .$item2->item_type . "',
                                        discount_type='" . $discount_type_id . "',
                                        discount='" .$discount . "',
                                        sale_unit_id='" .$sale_unit_id . "',
                                        warehouse_id='" . $warehousesid . "',
                                        warehouse='" . $warehousesname . "',
                                        primary_unit_of_measure_name ='" .$primary_unit_of_measure_name . "',
                                        primary_unit_of_measure_id ='" .$primary_unit_of_measure_id . "',
                                        stock_check='" .$stock_check . "',                                            
                                        rawMaterialProduct='" .$rawMaterialProduct . "',                                            
                                        raw_material_gl_id='" .$raw_material_gl_id . "', 
                                        raw_material_gl_code='" .$item2->raw_material_gl_code . "',
                                        raw_material_gl_name='" .$item2->raw_material_gl_name . "',                                           
                                        user_id='" . $this->arrUser['id'] . "', 
                                        company_id='" . $this->arrUser['company_id'] . "',
                                        AddedBy='" . $this->arrUser['id'] . "',
                                        AddedOn=UNIX_TIMESTAMP (NOW())";
            
                // echo $Sql;exit;  
                // $RS = $this->objsetup->CSI($Sql);
                $RS = $this->objsetup->CSI($Sql, 'purchase_order', sr_AddPermission);
        
                $update_id = $this->Conn->Insert_ID(); 
                $item2->update_id = $update_id; 


            if ($update_id > 0){
                $updateRec++;

                if($selItemChk>1){
                    $selRecordID = $update_id;
                }                    
            }
        } 
        // exit;

        if ($updateRec > 0){
            $response['ack'] = 1;
            // $response['orderLineID'] = $update_id;
            $this->updateItemCacheTableInPO($invoice_id);

            foreach ($tempOrderLineitemsArray as $item2) 
            {
                $item2->product_name = stripslashes($item2->product_name);
            } 
            
            $response['allitemArray'] = $tempOrderLineitemsArray;
            $response['error'] = NULL;
            
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record not updated';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }  
        return $response;
    }

    function updateItemCacheTableInPO($invoice_id){
        $sql = "DELETE FROM productcache 
                WHERE id IN (SELECT product_id 
                             FROM srm_invoice_detail 
                             WHERE invoice_id = ".$invoice_id." AND 
                                    company_id= " . $this->arrUser['company_id'] . " AND 
                                    type = 0 )";

        $RS = $this->objsetup->CSI($sql);

        $sql2 = "INSERT INTO productcache SELECT *,NOW() FROM sr_product_sel 
                 WHERE id IN (SELECT product_id 
                              FROM srm_invoice_detail 
                              WHERE invoice_id = ".$invoice_id." AND 
                                    company_id= " . $this->arrUser['company_id'] . " AND 
                                    type = 0)";

        $RS = $this->objsetup->CSI($sql2);
        return 1;
    }  

    function saveOrderLine($attr)
    {        
        $item = $attr['itemData'];
        $allitemArray = $attr['itemDataArr'];
        $updateRec=0; 
        $selRecordID=0; 

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

        $invoice_id = (isset($item->orderID) && $item->orderID!='')?$item->orderID:0;
        $supplier_id = (isset($item->supplier_id) && $item->supplier_id!='')?$item->supplier_id:0;
        $selWarehousesid = (isset($item->warehouses->id) && $item->warehouses->id!='')?$item->warehouses->id:0;
        $selProduct_id = (isset($item->id) && $item->id!='')?$item->id:0;      
        $itemType = (isset($item->type_id) && $item->type_id!='')?$item->type_id:0;    
             
        // echo "<pre>";
        // print_r($allitemArray);exit;

        $this->objGeneral->mysql_clean($allitemArray);

        foreach ($allitemArray as $item2) 
        {
            $update_id = $item2->update_id;
            $updateCHK = '';

            if($update_id>0)
                $updateCHK = ' AND tst.id!='.$update_id;   

            $max_quantity = (isset($item2->max_quantity) && $item2->max_quantity!='')?$item2->max_quantity:0;
            $min_quantity = (isset($item2->min_quantity) && $item2->min_quantity!='')?$item2->min_quantity:0;
            $unit_measure_id = (isset($item2->units->id) && $item2->units->id!='')?$item2->units->id:0;
            $unit_qty = (isset($item2->units->quantity) && $item2->units->quantity!='')?$item2->units->quantity:0;
            $unit_parent_id = (isset($item2->units->parent_id) && $item2->units->parent_id!='')?$item2->units->parent_id:0;
            $unit_measure = (isset($item2->units->name) && $item2->units->name!='')?$item2->units->name:'';
            $conv_unit_price = (isset($item2->conv_unit_price) && $item2->conv_unit_price!='')?$item2->conv_unit_price:0;
            $purchase_unit_id = (isset($item2->purchase_unit_id) && $item2->purchase_unit_id!='')?$item2->purchase_unit_id:0;
            $discount_type_id = (isset($item2->discount_type_id->id) && $item2->discount_type_id->id!='' && $item2->discount_type_id->id!='None')?$item2->discount_type_id->id:0;
            $discount = (isset($item2->discount) && $item2->discount!='')? Round($item2->discount,2):0;
            $total_price = (isset($item2->total_price) && $item2->total_price!='')? Round($item2->total_price,2):0;
            $cat_id = (isset($item2->category_id) && $item2->category_id!='')?$item2->category_id:0;
            $sale_unit_id = (isset($item2->sale_unit_id) && $item2->sale_unit_id!='')?$item2->sale_unit_id:0;
            $primary_unit_of_measure_id = (isset($item2->primary_unit_of_measure_id) && $item2->primary_unit_of_measure_id!='')?$item2->primary_unit_of_measure_id:0;
            
            $vatsid = (isset($item2->vats->id) && $item2->vats->id!='')?$item2->vats->id:0;
            $vat_value = (isset($item2->vats->vat_value) && $item2->vats->vat_value!='')?$item2->vats->vat_value:0;
            $warehousesid = (isset($item2->warehouses->id) && $item2->warehouses->id!='')?$item2->warehouses->id:0;
            $warehousesname = (isset($item2->warehouses->name) && $item2->warehouses->name!='')?$item2->warehouses->name:0;
            $qty = (isset($item2->qty) && $item2->qty!='')?$item2->qty:0;
            $unit_price = (isset($item2->standard_price) && $item2->standard_price!='')?round($item2->standard_price,5):0;//$item2->standard_price
            $stock_check = (isset($item2->stock_check) && $item2->stock_check!='')?$item2->stock_check:0;
            $descriptionID = (isset($item2->descriptionID) && $item2->descriptionID!='')?$item2->descriptionID:0;
            $item_type = (isset($item2->item_type) && $item2->item_type!='')?$item2->item_type:0;

            if($item_type==2){
                $unit_measure_id = (isset($item2->uomID) && $item2->uomID!='')?$item2->uomID:0;  
                $unit_measure = (isset($item2->uom) && $item2->uom!='')?$item2->uom:'';              
            }            

            $selItemChk = (isset($item2->chk) && $item2->chk!='')?$item2->chk:0;

            $rawMaterialProduct = (isset($item2->rawMaterialProduct) && $item2->rawMaterialProduct!='')?$item2->rawMaterialProduct:0;
            $raw_material_gl_id = (isset($item2->raw_material_gl_id) && $item2->raw_material_gl_id!='')?$item2->raw_material_gl_id:0;

            if($update_id>0){
                $Sql = "UPDATE srm_invoice_detail
                                        SET
                                            supplier_id='" . $supplier_id . "',
                                            product_name='" .$item2->product_name . "',
                                            descriptionID='" .$descriptionID . "',
                                            invoice_order_date='" . $this->objGeneral->convert_date($attr['order_date']) . "',
                                            uom_id='" .$unit_measure_id . "',
                                            qty='" .$qty . "',
                                            unit_price='" .$unit_price . "',
                                            vat='" . $item2->vats->name . "',
                                            vat_id='" . $vatsid . "',
                                            vat_value='" . $vat_value . "',
                                            total_price='" .$total_price . "',
                                            unit_measure='" . $unit_measure . "',
                                            unit_measure_id='" . $unit_measure_id . "',
                                            unit_qty='" . $unit_qty . "',
                                            unit_parent_id='" . $unit_parent_id . "',
                                            cat_id='" .$cat_id . "',
                                            discount_type='" . $discount_type_id . "',
                                            discount='" .$discount . "',
                                            sale_unit_id='" .$sale_unit_id . "',
                                            warehouse_id='" . $warehousesid . "',
                                            warehouse='" . $warehousesname . "',
                                            primary_unit_of_measure_name ='" .$item2->primary_unit_of_measure_name . "',
                                            primary_unit_of_measure_id ='" .$primary_unit_of_measure_id . "',
                                            ChangedBy='" . $this->arrUser['id'] . "',
                                            ChangedOn=UNIX_TIMESTAMP (NOW()),
                                            rawMaterialProduct='" .$rawMaterialProduct . "',                                            
                                            raw_material_gl_id='" .$raw_material_gl_id . "', 
                                            raw_material_gl_code='" .$item2->raw_material_gl_code . "',
                                            raw_material_gl_name='" .$item2->raw_material_gl_name . "', 
                                            stock_check='" .$stock_check . "'
                        WHERE id=".$update_id." ";
            
                // echo $Sql;//exit; 
                // $RS = $this->objsetup->CSI($Sql);
                $RS = $this->objsetup->CSI($Sql, 'purchase_order', sr_EditPermission);
            }

            if ($update_id > 0){
                $updateRec++;

                if($selItemChk>1){
                    $selRecordID = $update_id;
                }                    
            }
        } 

        if ($updateRec > 0){
            
            require_once(SERVER_PATH . "/classes/Warehouse.php");
            $this->objWarehouse = new Warehouse($this->arrUser);

            $attr['wrh_id'] = $selWarehousesid;
            $attr['prod_id'] = $selProduct_id;
            $response['orderLineID'] = $selRecordID;

            $this->updateItemCacheTableInPO($invoice_id);

            $response['storage_loc'] = $this->objWarehouse->get_sel_warehouse_loc_in_stock_alloc($attr);

            $attr['warehouses_id'] = $selWarehousesid;
            $attr['product_id'] = $selProduct_id;
            $attr['order_id'] = $invoice_id;
            $attr['type_id'] = 1;// 1 for purchase order and 2 for sale order.
            $attr['orderLineID'] = $selRecordID;

            $response['stockAlloc'] = $this->getPurchaseStockAllocation($attr);
            $response['ack'] = 1;
            // $response['orderLineID'] = $update_id;
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
            
            $response['allitemArray'] = $allitemArray;
            $response['error'] = NULL;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record not updated';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }  
        return $response;
    } 

    function getPurchaseStockAllocation($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $where_clause = "";
        $response = array();
        if (!empty($attr['purchase_return_status']))
            $where_clause .= " AND purchase_return_status = 1 ";
        else
            $where_clause .= " AND purchase_return_status = 0 ";

        $Sql = "SELECT  c.* ,w.name as wname,prd_wrh_loc.warehouse_loc_id as storage_loc_id,wrh_loc.title as location_title,wrh_loc.bin_cost,dim.title as dimtitle,
                        CASE  WHEN wrh_loc.cost_type_id = 1 THEN 'Fixed'
                              WHEN wrh_loc.cost_type_id = 2 THEN 'Daily'
                              WHEN wrh_loc.cost_type_id = 3 THEN 'Weekly'
                              WHEN wrh_loc.cost_type_id = 4 THEN 'Monthly'
                              WHEN wrh_loc.cost_type_id = 5 THEN 'Annually'
                              END AS cost_type
                From warehouse_allocation  c
                left JOIN product_warehouse_location as prd_wrh_loc on prd_wrh_loc.id=c.location
                left JOIN warehouse_bin_location as wrh_loc on wrh_loc.id=prd_wrh_loc.warehouse_loc_id
                left JOIN units_of_measure as dim on dim.id=wrh_loc.dimensions_id
                left JOIN warehouse w on w.id=c.warehouse_id
                where  c.product_id='" . $attr['product_id'] . "' and
                       c.order_id='" . $attr['order_id'] . "' and
                       c.purchase_order_detail_id='" . $attr['orderLineID'] . "' and
                       w.id = '" . $attr['warehouses_id'] . "'and
                       c.status=1 and c.type='" . $attr['type_id'] . "'
                       " . $where_clause . " and
                       c.company_id=" . $this->arrUser['company_id'] . "
                order by c.id ASC ";

        // echo $Sql;exit;
        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];

                $result['warehouse'] = $Row['wname'];
                $result['WH_loc_id'] = $Row['location'];
                $result['storage_loc_id'] = $Row['storage_loc_id'];
                $result['warehouse_id'] = $Row['warehouse_id'];
                $result['location'] = $Row['location_title'] . " ( " . $Row['bin_cost'] . ", " . $Row['dimtitle'] . ", " . $Row['cost_type'] . ")";
                $result['container_no'] = $Row['container_no'];
                $result['batch_no'] = $Row['batch_no'];

                $result['prod_date'] = $this->objGeneral->convert_unix_into_date($Row['prod_date']);
                $result['date_received'] = $this->objGeneral->convert_unix_into_date($Row['date_received']);
                $result['use_by_date'] = $this->objGeneral->convert_unix_into_date($Row['use_by_date']);
                $result['quantity'] = $Row['quantity'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            // $response['ack'] = 0;
            $response['response'] = array();
        }


        if (!empty($attr['purchase_return_status'])) {
            $sql_total_purchase_return = "SELECT  sum(quantity) as total  From warehouse_allocation  c 
                                            where  c.product_id=".$attr['product_id']."  and  c.status=1 and c.type=1 and
                                                   c.order_id=".$attr['order_id']." and c.warehouse_id=".$attr['warehouses_id']." and
                                                   purchase_return_status = 1  and 
                                                   c.company_id=" . $this->arrUser['company_id'] . " ";

            $rs_count_pr = $this->objsetup->CSI($sql_total_purchase_return);
            $response['total_pr'] = $rs_count_pr->fields['total'];

        }
        $sql_total = "SELECT  sum(quantity) as total  From warehouse_allocation  c 
                        where  c.product_id=".$attr['product_id']."  and  
                               c.status=1 and 
                               c.type=1 and
                               c.order_id=".$attr['order_id']." and 
                               c.purchase_order_detail_id='" . $attr['orderLineID'] . "' and
                               c.warehouse_id=".$attr['warehouses_id']." AND
                               purchase_return_status = 0 and 
                               c.company_id=" . $this->arrUser['company_id'] . " ";

        $rs_count = $this->objsetup->CSI($sql_total);
        $response['total'] = $rs_count->fields['total'];

        return $response;
    }

    function saveAdditionalCostOrderLine($attr)
    {        
        $item = $attr['itemData'];
        $allitemArray = $attr['itemDataArr'];
        $updateRec=0; 
        $selRecordID=0;  
        $response = array();

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

        $invoice_id = (isset($item->orderID) && $item->orderID!='')?$item->orderID:0;
        $supplier_id = (isset($item->supplier_id) && $item->supplier_id!='')?$item->supplier_id:0;
        $selWarehousesid = (isset($item->warehouses->id) && $item->warehouses->id!='')?$item->warehouses->id:0;
        $selProduct_id = (isset($item->id) && $item->id!='')?$item->id:0;      
        $itemType = (isset($item->type_id) && $item->type_id!='')?$item->type_id:0;
        
        $currenctOrderLineID = (isset($attr['currenctOrderLineID']) && $attr['currenctOrderLineID']!='')?$attr['currenctOrderLineID']:0;     
        // echo "<pre>";
        // print_r($allitemArray);exit;

        $this->objGeneral->mysql_clean($allitemArray);

        foreach ($allitemArray as $item2) 
        {
            $update_id = $item2->update_id;
            $updateCHK = '';

            if($update_id>0)
                $updateCHK = ' AND tst.id <>'.$update_id;   

            $max_quantity = (isset($item2->max_quantity) && $item2->max_quantity!='')?$item2->max_quantity:0;
            $min_quantity = (isset($item2->min_quantity) && $item2->min_quantity!='')?$item2->min_quantity:0;
            $unit_measure_id = (isset($item2->units->id) && $item2->units->id!='')?$item2->units->id:0;
            $unit_qty = (isset($item2->units->quantity) && $item2->units->quantity!='')?$item2->units->quantity:0;
            $unit_parent_id = (isset($item2->units->parent_id) && $item2->units->parent_id!='')?$item2->units->parent_id:0;
            $unit_measure = (isset($item2->units->name) && $item2->units->name!='')?$item2->units->name:'';
            $conv_unit_price = (isset($item2->conv_unit_price) && $item2->conv_unit_price!='')?$item2->conv_unit_price:0;
            $purchase_unit_id = (isset($item2->purchase_unit_id) && $item2->purchase_unit_id!='')?$item2->purchase_unit_id:0;
            $discount_type_id = (isset($item2->discount_type_id->id) && $item2->discount_type_id->id!='' && $item2->discount_type_id->id!='None')?$item2->discount_type_id->id:0;
            $discount = (isset($item2->discount) && $item2->discount!='')? Round($item2->discount,2):0;
            $total_price = (isset($item2->total_price) && $item2->total_price!='')? Round($item2->total_price,2):0;
            $cat_id = (isset($item2->category_id) && $item2->category_id!='')?$item2->category_id:0;
            $sale_unit_id = (isset($item2->sale_unit_id) && $item2->sale_unit_id!='')?$item2->sale_unit_id:0;
            $primary_unit_of_measure_id = (isset($item2->primary_unit_of_measure_id) && $item2->primary_unit_of_measure_id!='')?$item2->primary_unit_of_measure_id:0;
            
            $vatsid = (isset($item2->vats->id) && $item2->vats->id!='')?$item2->vats->id:0;
            $vat_value = (isset($item2->vats->vat_value) && $item2->vats->vat_value!='')?$item2->vats->vat_value:0;
            $warehousesid = (isset($item2->warehouses->id) && $item2->warehouses->id!='')?$item2->warehouses->id:0;
            $warehousesname = (isset($item2->warehouses->name) && $item2->warehouses->name!='')?$item2->warehouses->name:0;
            $qty = (isset($item2->qty) && $item2->qty!='')?$item2->qty:0;
            $unit_price = (isset($item2->standard_price) && $item2->standard_price!='')?round($item2->standard_price,5):0;//$item2->standard_price
            $stock_check = (isset($item2->stock_check) && $item2->stock_check!='')?$item2->stock_check:0;
            $item_type = (isset($item2->item_type) && $item2->item_type!='')?$item2->item_type:0;
            $descriptionID = (isset($item2->descriptionID) && $item2->descriptionID!='')?$item2->descriptionID:0;
            
            $rawMaterialProduct = (isset($item2->rawMaterialProduct) && $item2->rawMaterialProduct!='')?$item2->rawMaterialProduct:0;
            $raw_material_gl_id = (isset($item2->raw_material_gl_id) && $item2->raw_material_gl_id!='')?$item2->raw_material_gl_id:0;
            
            
            if($item_type==2){
                $unit_measure_id = (isset($item2->uomID) && $item2->uomID!='')?$item2->uomID:0;  
                // $unit_measure = (isset($item->uom) && $item->uom!='')?$item->uom:0;              
                $unit_measure = (isset($item2->uom) && $item2->uom!='')?$item2->uom:'';              
            }

            $selItemChk = (isset($item2->chk) && $item2->chk!='')?$item2->chk:0;

            $data_pass = "  tst.invoice_id='" .$invoice_id . "' AND 
                            tst.product_id='" .$item2->id . "' AND
                            tst.stock_check <> 0 AND 
                            tst.warehouse_id='" .$warehousesid . "' AND 
                            tst.supplier_id='" .$supplier_id. "'
                            ".$updateCHK." ";

            $total = $this->objGeneral->count_duplicate_in_sql('srm_invoice_detail', $data_pass, $this->arrUser['company_id']);

            if ($total == 1) {
                $response['ack'] = 0;
                $response['error'] = '"'.$item2->product_name.'"  Product Qty already allocated in this warehouse!';

                $srLogTrace = array();
                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'Exit';
                $srLogTrace['ErrorMessage'] = '"'.$item2->product_name.'"  Product Qty already allocated in this warehouse!';

                $this->objsetup->SRTraceLogsPHP($srLogTrace);
                return $response;                
            } 

            if($update_id>0){
                $Sql = "UPDATE srm_invoice_detail
                                        SET
                                            supplier_id='" . $supplier_id . "',
                                            product_name='" .$item2->product_name . "',
                                            descriptionID='" .$descriptionID . "',
                                            invoice_order_date='" . $this->objGeneral->convert_date($attr['order_date']) . "',
                                            uom_id='" .$unit_measure_id . "',
                                            qty='" .$qty . "',
                                            unit_price='" .$unit_price . "',
                                            vat='" . $item2->vats->name . "',
                                            vat_id='" . $vatsid . "',
                                            vat_value='" . $vat_value . "',
                                            total_price='" .$total_price . "',
                                            unit_measure='" . $unit_measure . "',
                                            unit_measure_id='" . $unit_measure_id . "',
                                            unit_qty='" . $unit_qty . "',
                                            unit_parent_id='" . $unit_parent_id . "',
                                            cat_id='" .$cat_id . "',
                                            discount_type='" . $discount_type_id . "',
                                            discount='" .$discount . "',
                                            sale_unit_id='" .$sale_unit_id . "',
                                            warehouse_id='" . $warehousesid . "',
                                            warehouse='" . $warehousesname . "',
                                            primary_unit_of_measure_name ='" .$item2->primary_unit_of_measure_name . "',
                                            primary_unit_of_measure_id ='" .$primary_unit_of_measure_id . "',
                                            ChangedBy='" . $this->arrUser['id'] . "',
                                            ChangedOn=UNIX_TIMESTAMP (NOW()),
                                            rawMaterialProduct='" .$rawMaterialProduct . "',                                            
                                            raw_material_gl_id='" .$raw_material_gl_id . "', 
                                            raw_material_gl_code='" .$item2->raw_material_gl_code . "',
                                            raw_material_gl_name='" .$item2->raw_material_gl_name . "', 
                                            stock_check='" .$stock_check . "'
                        WHERE id=".$update_id." ";
            
                // echo $Sql;//exit; 
                // $RS = $this->objsetup->CSI($Sql);
                $RS = $this->objsetup->CSI($Sql, 'purchase_order', sr_EditPermission);
            }

            if ($update_id > 0){
                $updateRec++;
                if($selItemChk>1){
                    $selRecordID = $update_id;
                }                    
            }
        } 
        // exit;
                

        //if ($this->Conn->Affected_Rows() > 0){
        if ($updateRec > 0){

            $attr['product_id'] = $selProduct_id;
            $attr['order_id'] = $invoice_id;
            $response['orderLineID'] = $selRecordID;
            $attr['descriptionID'] = $item->descriptionID;
            $attr['orderLineID'] = $selRecordID;
            // $attr['type_id'] = 1;// 1 for purchase order and 2 for sale order.

            $this->updateItemCacheTableInPO($invoice_id);

            if($itemType==3){
                $response['itemAddCostPurchaseOrder'] = $this->getItemAddCostPurchaseOrder($attr);
            }

            $response['ack'] = 1;
            // $response['orderLineID'] = $update_id;            
            $response['allitemArray'] = $allitemArray;
            $response['error'] = NULL;
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record not updated';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        } 
        // echo "<pre>";
        //     print_r($response); exit; 
        return $response;
    } 

    function getItemAddCostPurchaseOrder($attr)
    {
        /*      echo "<pre>";
        print_r($attr['itemData']);
        exit; */
        
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;

        $item = $attr['itemData'];
        $additionalCostCurr = 0;

        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['Parameter2'] = 'orderID:'.$item->orderID;
        $srLogTrace['ErrorMessage'] = "";

        $this->objsetup->SRTraceLogsPHP($srLogTrace);


        $invoice_id = (isset($item->orderID) && $item->orderID!='')?$item->orderID:0;
        $uomID = (isset($item->uomID) && $item->uomID!='')?$item->uomID:0;
        $currenctOrderLineID = (isset($attr['currenctOrderLineID']) && $attr['currenctOrderLineID']!='')?$attr['currenctOrderLineID']:0;         
        $invoiceRec = (isset($attr['invoiceRec']) && $attr['invoiceRec']!='')?$attr['invoiceRec']:0;    
        $defaultCurrencyID = (isset($attr['defaultCurrencyID']) && $attr['defaultCurrencyID']!='')?$attr['defaultCurrencyID']:0;    
        

        $sql1 = "SELECT sid.id,sid.invoice_id,sid.supplier_id,sid.product_id,sid.unit_measure_id,sid.qty,si.comm_book_in_no,si.invoice_date
                 FROM srm_invoice_detail as sid
                 LEFT JOIN srm_invoice as si on si.id = sid.invoice_id
                 WHERE sid.company_id='" . $this->arrUser['company_id'] . "'  AND 
                       sid.invoice_id='" . $invoice_id . "' AND 
                       sid.type=0";

        // echo $sql1;exit;
        // $rs1 = $this->objsetup->CSI($sql1);
        $rs1 = $this->objsetup->CSI($sql1, 'purchase_order', sr_ViewPermission);

        if ($rs1->RecordCount() > 0) {
            while ($Row1 = $rs1->FetchRow()) {
                $product_id = $Row1['product_id'];
                $supplier_id = $Row1['supplier_id'];
                $unit_measure_id = $Row1['unit_measure_id'];
                $qty = $Row1['qty'];
                $orderLineID = $Row1['id'];
                $consignmentNo = $Row1['comm_book_in_no'];
                $invoice_date = $Row1['invoice_date'];

                if($product_id>0 && $supplier_id>0){

                    $Sql4 = "SELECT addCost.priceID,
                                    addCost.itemID,
                                    addCost.descriptionID,
                                    addCost.description,
                                    addCost.cost,
                                    addCost.currencyID,
                                    addCost.cost_gl_code_id,
                                    addCost.cost_gl_code 
                             FROM price_list_additional_cost addCost
                             LEFT JOIN priceoffer ON priceoffer.id = addCost.priceID
                             WHERE addCost.status=1 AND 
                                   addCost.itemID='" . $product_id . "' AND
                                   priceoffer.moduleID='" . $supplier_id . "' AND
                                   priceoffer.moduleType=2 AND
                                   priceoffer.priceType IN (2,3) AND
                                   (FLOOR(priceoffer.start_date/86400)*86400)  <= '" . current_date . "' AND
                                   CASE WHEN priceoffer.end_date = 0 THEN 4099299120 
                                        ELSE (FLOOR(priceoffer.end_date/86400)*86400) 
                                    END >= '" . current_date . "' AND
                                   addCost.company_id='" . $this->arrUser['company_id'] . "'";
                    // echo $Sql4;exit;
                    // $RS4 = $this->objsetup->CSI($Sql4);
                    $RS4 = $this->objsetup->CSI($Sql4, 'purchase_order', sr_ViewPermission);

                    if ($RS4->RecordCount() > 0) {
                        while ($Row = $RS4->FetchRow()) {
                            $result = array();
                            $id = $Row['id'];
                            $descriptionID = (isset($Row['descriptionID']) && $Row['descriptionID']!='')?$Row['descriptionID']:0; 
                            $addPriceCurrencyID = (isset($Row['currencyID']) && $Row['currencyID']!='')?$Row['currencyID']:0;

                            $priceID = (isset($Row['priceID']) && $Row['priceID']!='')?$Row['priceID']:0;  
                            $description = $Row['description'];
                            $cost = $Row['cost'];                            

                            $amount = $cost*$qty;                       
                           
                            $cost_gl_code_id = $Row['cost_gl_code_id'];
                            $cost_gl_code = $Row['cost_gl_code'];

                            $cost_gl_code = explode("-",$cost_gl_code);
                            $costGLNumber =$cost_gl_code[0];
                            $costGLName =$cost_gl_code[1];

                            $data_pass = "  tst.invoice_id='" . $invoice_id . "' and
                                            tst.transactionType=1  and
                                            tst.descriptionID='" . $descriptionID . "' and
                                            tst.product_id='" . $product_id . "' and
                                            tst.supplier_id='" . $supplier_id . "' and
                                            tst.uomID='" . $unit_measure_id . "' and
                                            tst.orderLineID='" . $orderLineID . "' and
                                            tst.gl_account_id='" . $cost_gl_code_id . "'";

                            $duplicateCHK = $this->objGeneral->getDuplicateRecordID('gl_account_additional_cost_txn', $data_pass, $this->arrUser['company_id']);
                
                            if ($duplicateCHK == 0) {

                                // $costTtl += $cost;

                                if($addPriceCurrencyID == $defaultCurrencyID){
                                    $currencyRate = 1;

                                }else{
                                    $currencyRate = -1;

                                    /* $sqlb=" SELECT COALESCE(conversion_rate,-1) AS retVal
                                            FROM currency_histroy
                                            WHERE currency_id = $addPriceCurrencyID AND  
                                                (FLOOR(start_date/86400)*86400) <= $invoice_date AND
                                                company_id = '" . $this->arrUser['company_id'] . "'
                                            ORDER BY start_date DESC, action_date DESC 
                                            LIMIT 1"; */
                                    $sqlb=" SELECT COALESCE((SELECT conversion_rate
                                                             FROM currency_histroy
                                                             WHERE currency_id = ".$addPriceCurrencyID." AND  
                                                                   (FLOOR(start_date/86400)*86400) <= ".$invoice_date." AND
                                                                   company_id = '" . $this->arrUser['company_id'] . "'
                                                             ORDER BY start_date DESC, action_date DESC 
                                                             LIMIT 1),-1) AS retVal";

                                    $RSb = $this->objsetup->CSI($sqlb);
                                    $Rowb = $RSb->FetchRow();
                                    $currencyRate =  $Rowb['retVal'];

                                    if($currencyRate == -1){
                                        // $response['ack'] = 0;
                                        // $response['error'] = 'Conversion Rate Is not defined for Additional Cost Currency!';
                                        $additionalCostCurr++;
                                        // return $response;
                                        $this->objsetup->terminateWithMessage("Conversion Rate Is not defined for Additional Cost Currency!");
                                        // $response['ack'] = 0;
                                        // $response['error'] = "Conversion Rate Is not defined for Additional Cost Currency!";
                                        // return $response;
                                    }
                                }
                                //SR_GetConversionRateByDate('".$invoice_date."', '" . $addPriceCurrencyID . "', '" . $this->arrUser['company_id'] . "'),

                                $Sql5 = "INSERT INTO gl_account_additional_cost_txn
                                                        SET                               
                                                            gl_account_id='" . $cost_gl_code_id . "',
                                                            gl_account_name='" . $costGLName . "',
                                                            gl_account_code='" . $costGLNumber . "',
                                                            postingDate='" . current_date. "',
                                                            transactionType='1',
                                                            invoice_id='".$invoice_id."',                                                            
                                                            priceoffer_id='".$priceID."',
                                                            descriptionID='".$descriptionID."',
                                                            description='".$description."',
                                                            uomID='".$unit_measure_id."',
                                                            consignmentNo='" . $consignmentNo . "',
                                                            qty='" . $qty. "',
                                                            unitPrice='" . $cost . "',
                                                            currencyID='" . $addPriceCurrencyID . "',                                                            
                                                            currency_rate = '" . $currencyRate . "', 
                                                            amount='" . $amount . "',
                                                            product_id='" . $product_id . "',
                                                            supplier_id='" . $supplier_id . "',
                                                            paymentStatus=0,
                                                            inOutTransaction=0,
                                                            orderLineID='" . $orderLineID . "',
                                                            user_id='" . $this->arrUser['id'] . "',
                                                            company_id='" . $this->arrUser['company_id'] . "',
                                                            AddedBy='" . $this->arrUser['id'] . "',
                                                            AddedOn=UNIX_TIMESTAMP (NOW())";
                                // echo $Sql5;exit;
                                // $RS5 = $this->objsetup->CSI($Sql5);
                                $RS5 = $this->objsetup->CSI($Sql5, 'purchase_order', sr_AddPermission);
                            }                                                     
                        }                        
                    }
                }
            }
        }

        if($additionalCostCurr>0){
            /*$response['ack'] = 0;
            $response['error'] = 'Conversion Rate Is not defined for Additional Cost Currency!';
            return $response; */
            // $this->objsetup->terminateWithMessage("Conversion Rate Is not defined for Additional Cost Currency!");
            $response['ack'] = 0;
            $response['error'] = "Conversion Rate Is not defined for Additional Cost Currency!";

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = "Conversion Rate Is not defined for Additional Cost Currency!";

            $this->objsetup->SRTraceLogsPHP($srLogTrace);

            return $response;
        }

        $where = '';

        if($invoiceRec>0)
            $where = " AND atc.invoice_id = '" . $attr['order_id'] . "' AND atc.orderLineID = '" . $currenctOrderLineID . "'";
        
        // this is for flexi filter for reference no.
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        
        $searchKeyword2 =array();

        if ($attr['searchKeyword']->wa->container_no){
            $searchKeyword2['wa.container_no'] = $attr['searchKeyword']->wa->container_no;
        }
        if ($attr['searchKeyword']->si->invoice_code){
            $searchKeyword2['si.invoice_code'] = $attr['searchKeyword']->si->invoice_code;
        }
        $attr['searchKeyword'] = $searchKeyword2;

        // print_r($searchKeyword2);

        $ifWhereParam ='';

        if (count($searchKeyword2)>0){

            $ifWhereParam = " OR COALESCE((SELECT atc.unitPrice
                                           FROM gl_account_additional_cost_txn as atc
                                           WHERE atc.inOutTransaction=1 AND
                                                 atc.originaltxnID = addcosttbl.id AND
                                                 atc.invoice_id ='".$attr['order_id']."' AND
                                                 atc.orderLineID='" . $currenctOrderLineID . "' AND
                                                 atc.company_id='" . $this->arrUser['company_id'] . "' AND
                                                 atc.allocationID = wa.id ),0) > 0";
        }


        //print_r($searchKeyword2);exit;
        $where_clause = $this->objGeneral->flexiWhereRetriever("",$attr,$fieldsMeta,$ifWhereParam);

        if(!($uomID>0)){
            $uomID = (isset($attr['uomID']) && $attr['uomID']!='')?$attr['uomID']:0;   
        }
        /* 
                       addcosttbl.postingDate, */


        $sql = "SELECT addcosttbl.id,
                       addcosttbl.invoice_id,
                       addcosttbl.gl_account_id,
                       addcosttbl.gl_account_name,
                       addcosttbl.gl_account_code,
                       addcosttbl.uomID,
                       si.invoice_date as postingDate,
                       addcosttbl.consignmentNo,
                       addcosttbl.product_id,
                       addcosttbl.paymentStatus,
                       addcosttbl.inOutTransaction,
                       addcosttbl.descriptionID,
                       addcosttbl.description AS addcostDesc,
                       addcosttbl.qty,
                       addcosttbl.orderLineID,
                       addcosttbl.unitPrice,
                       addcosttbl.amount,
                       addcosttbl.currencyID,
                       COALESCE((SELECT atc.unitPrice
                                 FROM gl_account_additional_cost_txn as atc
                                 WHERE atc.inOutTransaction=1 AND
                                       atc.originaltxnID = addcosttbl.id AND
                                       atc.invoice_id ='".$attr['order_id']."' AND
                                       atc.orderLineID='" . $currenctOrderLineID . "' AND
                                       atc.company_id='" . $this->arrUser['company_id'] . "' AND
                                       atc.allocationID = wa.id ),0) as additionAmount,
                        (SELECT count(atc.id) as posted
                                FROM gl_account_additional_cost_txn as atc
                                WHERE atc.inOutTransaction=1 AND
                                      atc.originaltxnID =addcosttbl.id AND
                                      atc.paymentStatus=1 AND 
                                      atc.company_id='" . $this->arrUser['company_id'] . "' AND
                                      atc.allocationID = wa.id $where) as postedCount, 

                        COALESCE((SELECT si.order_code
                                FROM gl_account_additional_cost_txn AS atc 
                                LEFT JOIN srm_invoice AS si ON si.id=atc.invoice_id 
                                WHERE atc.inOutTransaction=1 AND 
                                      atc.originaltxnID =addcosttbl.id AND 
                                      atc.company_id='" . $this->arrUser['company_id'] . "' AND 
                                      atc.allocationID = wa.id 
                                LIMIT 1 ),0) AS AllocPurchaseCode, 
                        
                        COALESCE((SELECT si.invoice_code
                                FROM gl_account_additional_cost_txn AS atc 
                                LEFT JOIN srm_invoice AS si ON si.id=atc.invoice_id 
                                WHERE atc.inOutTransaction=1 AND 
                                      atc.originaltxnID =addcosttbl.id AND 
                                      atc.company_id='" . $this->arrUser['company_id'] . "' AND 
                                      atc.allocationID = wa.id 
                                LIMIT 1 ),0) AS AllocPurchaseInv, 
                       si.order_code,
                       si.invoice_code,
                       poDetail.unit_measure,
                       prd.description as prddescription,
                       prd.product_code,
                       wa.id as allocationRecID,
                       COALESCE(wa.container_no,0) as ref_no,
                       wa.quantity
                FROM gl_account_additional_cost_txn as addcosttbl
                LEFT JOIN srm_invoice_detail as poDetail ON poDetail.id=addcosttbl.orderLineID
                LEFT JOIN warehouse_allocation as wa ON  wa.order_id=addcosttbl.invoice_id AND wa.purchase_order_detail_id=poDetail.id                       
                LEFT JOIN srm_invoice AS si ON si.id=addcosttbl.invoice_id
                LEFT JOIN product AS prd ON prd.id=addcosttbl.product_id
                LEFT JOIN units_of_measure_setup AS uom ON uom.id=addcosttbl.uomID
                WHERE addcosttbl.company_id='" . $this->arrUser['company_id'] . "' AND 
                      poDetail.company_id='" . $this->arrUser['company_id'] . "' AND 
                      si.company_id='" . $this->arrUser['company_id'] . "' AND 
                      prd.company_id='" . $this->arrUser['company_id'] . "' AND 
                      wa.type=1 AND 
                      addcosttbl.transactionType=1 AND
                      addcosttbl.paymentStatus=0 AND
                      addcosttbl.inOutTransaction=0 AND
                      addcosttbl.descriptionID='" . $attr['descriptionID'] . "' AND 
                      uom.unit_id='" . $uomID . "' ".$where_clause." 
                GROUP BY wa.id
                ORDER BY addcosttbl.invoice_id DESC,wa.id ASC ";
        // echo $sql;exit;
        // poDetail.invoice_id=addcosttbl.invoice_id AND poDetail.product_id=addcosttbl.product_id
        // GROUP BY addcosttbl.orderLineID 
        //
                    //   addcosttbl.uomID='" . $uomID . "'

        /* (select count(atc.id) as posted
                                from gl_account_additional_cost_txn as atc
                                where atc.inOutTransaction=1 AND
                                      atc.originaltxnID =addcosttbl.id AND
                                      atc.paymentStatus=1 AND
                                      atc.company_id='" . $this->arrUser['company_id'] . "' $where 
                                ORDER BY atc.id DESC LIMIT 1 ) as postedChk, */

        //COALESCE(atc.qty,0)
        //COALESCE(atc.unitPrice,0)
        // echo $sql;exit;
        // $rs = $this->objsetup->CSI($sql);
        $rs = $this->objsetup->CSI($sql, 'purchase_order', sr_ViewPermission);

        if ($rs->RecordCount() > 0) {
            while ($Row = $rs->FetchRow()) {
                $result = array();
                
                if($Row['allocationRecID']>0){
                    /* $postedCount = $Row['postedCount'];

                        if($warehouseAllocationsCount > $postedCount){
                        $result['postedChk'] = 0;
                    }
                    else{
                            $result['postedChk'] = 1;
                    } */
                        $result['postedChk'] = $Row['postedCount'];

                    // foreach($WarehouseAllocations as $warehouseRec){
                        $result['originaltxnID'] = $Row['id'];
                        // $result['postedAmount'] = $Row['postedAmount'];
                        // $result['postedCalcAmount']=$Row['postedAmount']*$Row['postedQty'];
                        $result['order_code'] = $Row['order_code'];

                        // $result['qty'] = $Row['qty'];

                        $result['allocationRecID'] = $Row['allocationRecID'];
                        $result['ref_no'] = $Row['ref_no'];
                        $result['qty'] = $Row['quantity'];

                        // $result['allocationRecID'] = $warehouseRec['id'];
                        // $result['ref_no'] = $warehouseRec['container_no'];
                        // $result['qty'] = $warehouseRec['quantity'];
                        // $result['postedQty'] = $Row['postedQty'];

                        $result['invoice_id'] = $Row['invoice_id'];
                        $result['gl_account_id'] = $Row['gl_account_id'];
                        $result['gl_account_name'] = $Row['gl_account_name'];
                        $result['gl_account_code'] = $Row['gl_account_code'];
                        $result['invoice_code'] = $Row['invoice_code'];
                        $result['consignmentNo'] = $Row['consignmentNo'];
                        
                        $result['additionAmount'] = $Row['additionAmount'];
                        $result['allocatedAmount'] = $Row['additionAmount'];

                        $result['AllocPurchaseCode'] = $Row['AllocPurchaseCode'];
                        $result['AllocPurchaseInv'] = $Row['AllocPurchaseInv'];

                        // $result['additionAmount'] = $Row['unitPrice'];
                        // $result['allocatedAmount'] = $Row['unitPrice'];

                        // $result['allocatedAmount'] = $Row['allocatedAmount'];
                        // $result['allocatedQty'] = $Row['allocatedQty'];
                        // $result['allocatedQty'] = $Row['qty'];
                        $result['allocatedQty'] = $Row['quantity'];

                        // $result['calcAmount']=$Row['additionAmount']*$Row['qty'];                
                        $result['calcAmount']=$Row['additionAmount']*$Row['quantity'];                
                        // $result['calcAmount']=$Row['unitPrice']*$Row['qty'];                
                        // $result['calcAmount'] = $Row['additionAmount']*$Row['allocatedQty'];                
                        $result['postingDate'] = $this->objGeneral->convert_unix_into_date($Row['postingDate']);
                        $result['product_id'] = $Row['product_id'];                            

                        if($invoiceRec>0)
                            $result['postedChk'] =  $Row['postedCount'];

                        $result['prddescription'] = $Row['prddescription'];
                        $result['product_code'] = $Row['product_code'];
                        
                        $result['price'] = $Row['unitPrice'];
                        $result['amount'] = $Row['amount'];
                        $result['currencyID'] = $Row['currencyID'];
                        $result['uomID'] = $Row['uomID'];
                        $result['uom'] = $Row['unit_measure'];
                        $result['descriptionID'] = $Row['descriptionID'];
                        $result['addcostDesc'] = $Row['addcostDesc'];
                        $result['paymentStatus'] = $Row['paymentStatus'];
                        $result['inOutTransaction'] = $Row['inOutTransaction'];
                        $response['response'][] = $result;

                    // }                      
                }
                else{
                    $result['postedChk'] = 0;

                    $result['originaltxnID'] = $Row['id'];
                    // $result['postedAmount'] = $Row['postedAmount'];
                    // $result['postedCalcAmount']=$Row['postedAmount']*$Row['postedQty'];
                    $result['order_code'] = $Row['order_code'];                       

                    $result['ref_no'] = '-';
                    $result['qty'] = $this->getOrderQtyForAddCost($Row['orderLineID']);

                    // $result['postedQty'] = $Row['postedQty'];
                    $result['invoice_id'] = $Row['invoice_id'];
                    $result['gl_account_id'] = $Row['gl_account_id'];
                    $result['gl_account_name'] = $Row['gl_account_name'];
                    $result['gl_account_code'] = $Row['gl_account_code'];
                    $result['invoice_code'] = $Row['invoice_code'];
                    $result['consignmentNo'] = $Row['consignmentNo'];
                    $result['additionAmount'] = $Row['additionAmount'];
                    $result['allocatedAmount'] = $Row['additionAmount'];

                    $result['AllocPurchaseCode'] = $Row['AllocPurchaseCode'];
                    $result['AllocPurchaseInv'] = $Row['AllocPurchaseInv'];

                    $result['allocatedQty'] = $Row['qty'];             
                    $result['calcAmount'] = $Row['additionAmount']*$Row['qty'];                
                    // $result['calcAmount'] = $Row['unitPrice']*$Row['qty'];                
                    $result['postingDate'] = $this->objGeneral->convert_unix_into_date($Row['postingDate']);
                    $result['product_id'] = $Row['product_id'];                        

                    if($invoiceRec>0)
                        $result['postedChk'] =  $Row['postedCount'];

                    $result['prddescription'] = $Row['prddescription'];
                    $result['product_code'] = $Row['product_code'];
                    $result['qty'] = $Row['qty'];
                    $result['price'] = $Row['unitPrice'];
                    $result['amount'] = $Row['amount'];
                    $result['currencyID'] = $Row['currencyID'];
                    $result['uomID'] = $Row['uomID'];
                    $result['uom'] = $Row['unit_measure'];
                    $result['descriptionID'] = $Row['descriptionID'];
                    $result['addcostDesc'] = $Row['addcostDesc'];
                    $result['paymentStatus'] = $Row['paymentStatus'];
                    $result['inOutTransaction'] = $Row['inOutTransaction'];
                    $response['response'][] = $result;
                    }           
            }
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

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        } 
        else {
            $response['response'] = array();
            // echo "<pre>";
            // print_r($response); exit;
            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }
            
        return $response;
    }

    function getAllWarehouseAllocations($invoiceID,$invoiceDetailID,$descriptionID){  

        $sql = 'SELECT wa.id,wa.container_no,wa.batch_no,wa.quantity,wrh_loc.title as prdloc,
                warehouse.name as warehouseName,warehouse.wrh_code,
                       (SELECT count(gltxn.id) 
                        FROM gl_account_additional_cost_txn as gltxn 
                        WHERE gltxn.allocationID = wa.id and 
                              gltxn.company_id="'.$this->arrUser['company_id'].'" AND 
                              gltxn.transactionType=1 AND
                              gltxn.inOutTransaction=1 AND 
                              gltxn.descriptionID="'.$descriptionID.'") as AllocatedLoc
                FROM warehouse_allocation as wa
                LEFT JOIN product_warehouse_location as prdLoc on prdLoc.id=wa.location
                LEFT JOIN warehouse_bin_location as wrh_loc on wrh_loc.id=prdLoc.warehouse_loc_id
                LEFT JOIN warehouse on warehouse.id=prdLoc.warehouse_id
                WHERE wa.company_id="'.$this->arrUser['company_id'].'" AND 
                      wa.order_id="'.$invoiceID.'" AND 
                      wa.purchase_order_detail_id="'.$invoiceDetailID.'" AND 
                      wa.type=1 AND 
                      wa.status=1';
        // echo $sql;exit;
        $rs = $this->objsetup->CSI($sql);

        if ($rs->RecordCount() > 0) {
            while ($Row = $rs->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key)) 
                    unset($Row[$key]);
                }
                $response[] = $Row;
            }
        } 
        else 
            $response = array();

        return $response;        
    }

    function getOrderQtyForAddCost($invoiceDetailID){  

        $sql = 'SELECT COALESCE(qty,0) as quantity
                FROM srm_invoice_detail
                WHERE company_id="'.$this->arrUser['company_id'].'" AND  id="'.$invoiceDetailID.'"';
        // echo $sql;exit;
        $rs = $this->objsetup->CSI($sql);

        if ($rs->RecordCount() > 0) {

            $Row = $rs->FetchRow();
            $qty = $Row['quantity'];
        } 

        return $qty;        
    }

    function getAdditionalCostPurchaseOrder($attr)
    {
        $item = $attr['itemData'];

        $invoice_id = (isset($item->orderID) && $item->orderID!='')?$item->orderID:0;
        $uomID = (isset($item->uomID) && $item->uomID!='')?$item->uomID:0;
        $currenctOrderLineID = (isset($attr['currenctOrderLineID']) && $attr['currenctOrderLineID']!='')?$attr['currenctOrderLineID']:0;         
        $invoiceRec = (isset($attr['invoiceRec']) && $attr['invoiceRec']!='')?$attr['invoiceRec']:0;         

        $where = '';

        if(!($uomID>0)){
            $uomID = (isset($attr['uomID']) && $attr['uomID']!='')?$attr['uomID']:0;   
        }
        

        if($invoiceRec>0)
            $where = " AND atc.invoice_id = '" . $attr['order_id'] . "' AND atc.orderLineID = '" . $currenctOrderLineID . "'";
            /* 
                       addcosttbl.postingDate, */
        
        $sql = "SELECT addcosttbl.id,
                       addcosttbl.invoice_id,
                       addcosttbl.gl_account_id,
                       addcosttbl.gl_account_name,
                       addcosttbl.gl_account_code,
                       addcosttbl.uomID,
                       si.invoice_date as postingDate,
                       addcosttbl.consignmentNo,
                       addcosttbl.product_id,
                       addcosttbl.paymentStatus,
                       addcosttbl.inOutTransaction,
                       addcosttbl.descriptionID,
                       addcosttbl.description AS addcostDesc,
                       addcosttbl.qty,
                       addcosttbl.orderLineID,
                       addcosttbl.unitPrice,
                       addcosttbl.amount,
                       addcosttbl.currencyID,
                       (select COALESCE(atc.unitPrice,0)
                                from gl_account_additional_cost_txn as atc
                                where atc.inOutTransaction=1 AND
                                      atc.originaltxnID = addcosttbl.id AND
                                      atc.invoice_id ='".$attr['order_id']."' AND
                                      atc.orderLineID='" . $currenctOrderLineID . "' AND
                                      atc.company_id='" . $this->arrUser['company_id'] . "' AND
                                      atc.allocationID = wa.id ) as additionAmount,
                        (select count(atc.id) as posted
                                from gl_account_additional_cost_txn as atc
                                where atc.inOutTransaction=1 AND
                                      atc.originaltxnID =addcosttbl.id AND
                                      atc.paymentStatus=1 AND 
                                      atc.company_id='" . $this->arrUser['company_id'] . "' AND
                                      atc.allocationID = wa.id $where) as postedCount, 
                          
                       si.order_code,
                       si.invoice_code,
                       poDetail.unit_measure,
                       prd.description as prddescription,
                       prd.product_code,
                       wa.id as allocationRecID,
                       wa.container_no as ref_no,
                       wa.quantity
                FROM gl_account_additional_cost_txn as addcosttbl
                LEFT JOIN srm_invoice_detail as poDetail ON poDetail.id=addcosttbl.orderLineID 
                LEFT JOIN warehouse_allocation as wa ON  wa.order_id=addcosttbl.invoice_id AND wa.purchase_order_detail_id=poDetail.id                       
                LEFT JOIN srm_invoice AS si ON si.id=addcosttbl.invoice_id
                LEFT JOIN product AS prd ON prd.id=addcosttbl.product_id
                LEFT JOIN units_of_measure_setup AS uom ON uom.id=addcosttbl.uomID
                WHERE addcosttbl.company_id='" . $this->arrUser['company_id'] . "' AND 
                      poDetail.company_id='" . $this->arrUser['company_id'] . "' AND 
                      si.company_id='" . $this->arrUser['company_id'] . "' AND 
                      prd.company_id='" . $this->arrUser['company_id'] . "' AND 
                      wa.type=1 AND 
                      addcosttbl.transactionType=1 AND
                      addcosttbl.paymentStatus=0 AND
                      addcosttbl.inOutTransaction=0 AND
                      addcosttbl.descriptionID='" . $attr['descriptionID'] . "' AND 
                      (select COALESCE(atc.id,0)
                                from gl_account_additional_cost_txn as atc
                                where atc.inOutTransaction=1 AND
                                      atc.originaltxnID = addcosttbl.id AND
                                      atc.invoice_id ='".$attr['order_id']."' AND
                                      atc.orderLineID='" . $currenctOrderLineID . "' AND
                                      atc.company_id='" . $this->arrUser['company_id'] . "' AND
                                      atc.allocationID = wa.id limit 1)>0 AND 
                      uom.unit_id='" . $uomID . "' 
                GROUP BY wa.id
                ORDER BY addcosttbl.invoice_id DESC,wa.id ASC";

        // echo $sql;exit;
        // poDetail.invoice_id=addcosttbl.invoice_id AND poDetail.product_id=addcosttbl.product_id
        // $rs = $this->objsetup->CSI($sql);
        $rs = $this->objsetup->CSI($sql, 'purchase_order', sr_ViewPermission);

        if ($rs->RecordCount() > 0) {
            while ($Row = $rs->FetchRow()) {
                $result = array();
                    if($Row['allocationRecID']>0){
                            $result['postedChk'] = $Row['postedCount'];
                            
                            $result['originaltxnID'] = $Row['id'];
                            $result['order_code'] = $Row['order_code'];

                            $result['allocationRecID'] = $Row['allocationRecID'];
                            $result['ref_no'] = $Row['ref_no'];
                            $result['qty'] = $Row['quantity'];
                            

                            $result['invoice_id'] = $Row['invoice_id'];
                            $result['gl_account_id'] = $Row['gl_account_id'];
                            $result['gl_account_name'] = $Row['gl_account_name'];
                            $result['gl_account_code'] = $Row['gl_account_code'];
                            $result['invoice_code'] = $Row['invoice_code'];
                            $result['consignmentNo'] = $Row['consignmentNo'];

                            
                            $result['additionAmount'] = $Row['additionAmount'];
                            $result['allocatedAmount'] = $Row['additionAmount'];
                            $result['allocatedQty'] = $Row['quantity'];
                                            
                            $result['calcAmount']=$Row['additionAmount']*$Row['quantity'];                   
                            $result['postingDate'] = $this->objGeneral->convert_unix_into_date($Row['postingDate']);
                            $result['product_id'] = $Row['product_id'];                            

                            if($invoiceRec>0)
                                $result['postedChk'] =  $Row['postedCount'];

                            $result['prddescription'] = $Row['prddescription'];
                            $result['product_code'] = $Row['product_code'];
                            
                            $result['price'] = $Row['unitPrice'];
                            $result['amount'] = $Row['amount'];
                            $result['currencyID'] = $Row['currencyID'];
                            $result['uomID'] = $Row['uomID'];
                            $result['uom'] = $Row['unit_measure'];
                            $result['descriptionID'] = $Row['descriptionID'];
                            $result['addcostDesc'] = $Row['addcostDesc'];
                            $result['paymentStatus'] = $Row['paymentStatus'];
                            $result['inOutTransaction'] = $Row['inOutTransaction'];
                            $response['response'][] = $result;                     
                    }
                    else{
                        $result['postedChk'] = 0;

                        $result['originaltxnID'] = $Row['id'];
                        $result['order_code'] = $Row['order_code'];                       

                        $result['ref_no'] = '-';
                        $result['qty'] = $this->getOrderQtyForAddCost($Row['orderLineID']);

                        
                        $result['invoice_id'] = $Row['invoice_id'];
                        $result['gl_account_id'] = $Row['gl_account_id'];
                        $result['gl_account_name'] = $Row['gl_account_name'];
                        $result['gl_account_code'] = $Row['gl_account_code'];
                        $result['invoice_code'] = $Row['invoice_code'];
                        $result['consignmentNo'] = $Row['consignmentNo'];
                        $result['additionAmount'] = $Row['additionAmount'];
                        $result['allocatedAmount'] = $Row['additionAmount'];
                        $result['allocatedQty'] = $Row['qty'];             
                        $result['calcAmount'] = $Row['additionAmount']*$Row['qty'];                   
                        $result['postingDate'] = $this->objGeneral->convert_unix_into_date($Row['postingDate']);
                        $result['product_id'] = $Row['product_id'];                        

                        if($invoiceRec>0)
                            $result['postedChk'] =  $Row['postedCount'];

                        $result['prddescription'] = $Row['prddescription'];
                        $result['product_code'] = $Row['product_code'];
                        $result['qty'] = $Row['qty'];
                        $result['price'] = $Row['unitPrice'];
                        $result['amount'] = $Row['amount'];
                        $result['currencyID'] = $Row['currencyID'];
                        $result['uomID'] = $Row['uomID'];
                        $result['uom'] = $Row['unit_measure'];
                        $result['descriptionID'] = $Row['descriptionID'];
                        $result['addcostDesc'] = $Row['addcostDesc'];
                        $result['paymentStatus'] = $Row['paymentStatus'];
                        $result['inOutTransaction'] = $Row['inOutTransaction'];
                        $response['response'][] = $result;
                        }        
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else 
            $response['response'] = array();
        return $response;
    }

    function saveSelAdditionalCostPurchaseOrder($attr)
    {
         /* echo "<pre>";
        print_r($attr['seladditionalcostPurchaseOrder']);
        print_r($attr['supplierID']); exit; */

        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['Parameter2'] = 'order_id:'.$attr['order_id'];
        $srLogTrace['ErrorMessage'] = "";

        $this->objsetup->SRTraceLogsPHP($srLogTrace);
    
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;

        $supplierID = (isset($attr['supplierID']) && $attr['supplierID']!='')?$attr['supplierID']:0;        
        $order_id = (isset($attr['order_id']) && $attr['order_id']!='')?$attr['order_id']:0;        
        $orderLineID = (isset($attr['orderLineID']) && $attr['orderLineID']!='')?$attr['orderLineID']:0;  
        $defaultCurrencyID = (isset($attr['defaultCurrencyID']) && $attr['defaultCurrencyID']!='')?$attr['defaultCurrencyID']:0;  

        $sql2=" DELETE FROM gl_account_additional_cost_txn 
                WHERE company_id='" . $this->arrUser['company_id'] . "' AND 
                    invoice_id =".$order_id." and 
                    orderLineID = ".$orderLineID." ";

        $RS2 = $this->objsetup->CSI($sql2);
        // $RS2 = $this->objsetup->CSI($sql2, 'purchase_order', sr_DeletePermission);

        $sqla=" SELECT invoice_date,order_date
                FROM srm_invoice 
                WHERE id = ".$order_id." ";

        // $RSa = $this->objsetup->CSI($sqla);
        $RSa = $this->objsetup->CSI($sqla, 'purchase_order', sr_ViewPermission);

        $Rowa = $RSa->FetchRow();

        if($Rowa['invoice_date']>0) $invoice_date =  $Rowa['invoice_date'];
        else $invoice_date =  $Rowa['order_date'];

        $additionalCostCurr = 0;
              

        foreach($attr['seladditionalcostPurchaseOrder'] as $item){

            $invoice_id = (isset($item->invoice_id) && $item->invoice_id!='')?$item->invoice_id:0;  
            $descriptionID = (isset($item->descriptionID) && $item->descriptionID!='')?$item->descriptionID:0;  
            $productid = (isset($item->product_id) && $item->product_id!='')?$item->product_id:0;  
            // $productid = (isset($item->productid) && $item->productid!='')?$item->productid:0;  
            $gl_account_id = (isset($item->gl_account_id) && $item->gl_account_id!='')?$item->gl_account_id:0;  
            $gl_account_code = (isset($item->gl_account_code) && $item->gl_account_code!='')?$item->gl_account_code:0;                             
            $qty = (isset($item->qty) && $item->qty!='')?$item->qty:0;                             
            $cost = (isset($item->additionAmount) && $item->additionAmount!='')?$item->additionAmount:0;                            
            $calcAmount = (isset($item->calcAmount) && $item->calcAmount!='')?$item->calcAmount:0;                             
            $originaltxnID = (isset($item->originaltxnID) && $item->originaltxnID!='')?$item->originaltxnID:0;                             
            $currencyID = (isset($item->currencyID) && $item->currencyID!='')?$item->currencyID:0; 
            $unit_measure_id = (isset($item->unit_measure_id) && $item->unit_measure_id!='')?$item->unit_measure_id:0;
            $allocationRecID = (isset($item->allocationRecID) && $item->allocationRecID!='')?$item->allocationRecID:0;

            if(!($unit_measure_id>0)){
                $unit_measure_id = (isset($item->uomID) && $item->uomID!='')?$item->uomID:0;
            }

            
            if($currencyID == $defaultCurrencyID){
                $currencyRate = 1;
            }
            else{
                $currencyRate = -1;

                /* $sqlb=" SELECT COALESCE(conversion_rate,-1) AS retVal
                        FROM currency_histroy
                        WHERE currency_id = $currencyID AND  
                            (FLOOR(start_date/86400)*86400) <= $invoice_date AND
                            company_id = '" . $this->arrUser['company_id'] . "'
                        ORDER BY start_date DESC, action_date DESC 
                        LIMIT 1"; */
                $sqlb=" SELECT COALESCE((SELECT conversion_rate
                                         FROM currency_histroy
                                         WHERE currency_id = ".$currencyID." AND  
                                               (FLOOR(start_date/86400)*86400) <= ".$invoice_date." AND
                                               company_id = '" . $this->arrUser['company_id'] . "'
                                         ORDER BY start_date DESC, action_date DESC 
                                         LIMIT 1),-1) AS retVal";

                $RSb = $this->objsetup->CSI($sqlb);
                $Rowb = $RSb->FetchRow();
                $currencyRate =  $Rowb['retVal'];

                if($currencyRate == -1){
                    $this->objsetup->terminateWithMessage("Conversion Rate Is not defined for '".$item->addcostDesc."' Additional Cost Currency");
                    $additionalCostCurr++;
                    
                }
            }         
 

            $data_pass = "  tst.invoice_id='" . $order_id . "' and
                            tst.transactionType=1  and
                            tst.inOutTransaction=1  and
                            tst.descriptionID='" . $descriptionID . "' and
                            tst.orderLineID='" . $orderLineID . "' and
                            tst.originaltxnID='" . $originaltxnID . "' and
                            tst.allocationID='" . $allocationRecID . "' and
                            tst.product_id='" . $productid . "' and
                            tst.supplier_id='" . $supplierID . "'";//item_additional_cost_purchase_order

            $duplicateCHK = $this->objGeneral->getDuplicateRecordID('gl_account_additional_cost_txn', $data_pass, $this->arrUser['company_id']);

            if ($duplicateCHK == 0) { //  $description , $consignmentNo
                /* SR_GetConversionRateByDate('".$invoice_date."', '" . $currencyID . "', '" . $this->arrUser['company_id'] . "') */

                $Sql5 = "INSERT INTO gl_account_additional_cost_txn
                                        SET 
                                            gl_account_id='" . $gl_account_id . "',
                                            gl_account_name='" . $item->gl_account_name . "',
                                            gl_account_code='" . $gl_account_code . "',
                                            postingDate='" . $this->objGeneral->convert_date($item->postingDate) ."',
                                            transactionType='1',
                                            invoice_id='".$order_id."',
                                            descriptionID='".$descriptionID."',
                                            description='".$item->addcostDesc."',
                                            uomID='".$unit_measure_id."',
                                            consignmentNo='" . $item->consignmentNo . "',
                                            qty='" . $qty. "',
                                            unitPrice='" . $cost . "',
                                            amount='" . $calcAmount . "',
                                            product_id='" . $productid . "',
                                            supplier_id='" . $supplierID . "',
                                            currencyID='" . $currencyID . "',                                                            
                                            currency_rate = '" . $currencyRate . "',
                                            originaltxnID='" . $originaltxnID . "',
                                            inOutTransaction=1,
                                            orderLineID='" . $orderLineID . "',
                                            allocationID='" . $allocationRecID . "',
                                            user_id='" . $this->arrUser['id'] . "',
                                            company_id='" . $this->arrUser['company_id'] . "',
                                            AddedBy='" . $this->arrUser['id'] . "',
                                            AddedOn=UNIX_TIMESTAMP (NOW())";
                    //  echo $Sql5;//exit;
                // $RS5 = $this->objsetup->CSI($Sql5);
                $RS5 = $this->objsetup->CSI($Sql5, 'purchase_order', sr_AddPermission);

            }
            else{
                $Sql5 = "UPDATE  gl_account_additional_cost_txn
                                        SET 
                                            gl_account_id='" . $gl_account_id . "',
                                            gl_account_name='" . $item->gl_account_name . "',
                                            gl_account_code='" . $gl_account_code . "',
                                            postingDate='" . $this->objGeneral->convert_date($item->postingDate) ."',
                                            description='".$item->addcostDesc."',
                                            uomID='".$unit_measure_id."',
                                            consignmentNo='" . $item->consignmentNo. "',
                                            qty='" . $qty. "',
                                            unitPrice='" . $cost . "',
                                            amount='" . $calcAmount . "',
                                            currencyID='" . $currencyID . "',                                                           
                                            currency_rate = '" . $currencyRate . "',
                                            originaltxnID='" . $originaltxnID . "'
                                            
                                where invoice_id='" . $order_id . "' and
                                    transactionType=1  and
                                    inOutTransaction=1  and
                                    descriptionID='" . $descriptionID . "' and
                                    orderLineID='" . $orderLineID . "' and
                                    allocationID='" . $allocationRecID . "' and
                                    originaltxnID='" . $originaltxnID . "' AND
                                    product_id='" . $productid . "' and
                                    supplier_id='" . $supplierID . "'";
                // echo $Sql5;//exit;
                // $RS5 = $this->objsetup->CSI($Sql5);
                $RS5 = $this->objsetup->CSI($Sql5, 'purchase_order', sr_EditPermission);

            }                                             
        }

        if($additionalCostCurr>0){
            // $response['ack'] = 0;
            // $response['error'] = 'Conversion Rate Is not defined for Additional Cost Currency!';
            // $this->objsetup->terminateWithMessage("Conversion Rate Is not defined for '".$item->addcostDesc."' Additional Cost Currency");
            $response['ack'] = 0;
            $response['error'] = "Conversion Rate Is not defined for Additional Cost Currency";
            

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = "Conversion Rate Is not defined for Additional Cost Currency!";

            $this->objsetup->SRTraceLogsPHP($srLogTrace);

            return $response;
        }else{
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

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }
        return $response;
    }

    function updatePurchaseOrder($attr)
    {
        $conversion_rate = 1;
        $itemsArray = $attr['items'];

        $this->objGeneral->mysql_clean($attr);
        

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

        // echo "<pre>";
        // print_r($attr);
        // exit;

        $net_amount = (isset($attr['net_amount']) && $attr['net_amount']!='')? Round($attr['net_amount'],2):0; 
        $tax_amount = (isset($attr['tax_amount']) && $attr['tax_amount']!='')? Round($attr['tax_amount'],2) :0; 
        $grand_total = (isset($attr['grand_total']) && $attr['grand_total']!='')? Round($attr['grand_total'],2) :0; 
        $tax_rate = (isset($attr['tax_rate']) && $attr['tax_rate']!='')?$attr['tax_rate']:0; 

        $items_net_total = (isset($attr['items_net_total']) && $attr['items_net_total']!='')? Round($attr['items_net_total'],2) :0; 
        $items_net_discount = (isset($attr['items_net_discount']) && $attr['items_net_discount']!='')? Round($attr['items_net_discount'],2) :0; 
        $items_net_vat = (isset($attr['items_net_vat']) && $attr['items_net_vat']!='')? Round($attr['items_net_vat'],2):0; 

        if($attr['currency_id'] != $attr['defaultCurrencyID']){

            if (!empty($attr['orderDate']) || $attr['orderDate'] != '')
                $current_date = $this->objGeneral->convert_date($attr['orderDate']);
            else
                $current_date = current_date;

            $Sql = "SELECT d.conversion_rate  
                    FROM currency_histroy d 
                    WHERE d.currency_id='".$attr['currency_id']."' AND  
                          (FLOOR(d.start_date/86400)*86400) <= '" . $current_date . "' AND
                          d.company_id =	'" . $this->arrUser['company_id'] . "'		
                    order by d.start_date DESC, d.action_date desc LIMIT 1  ";

           // echo $Sql;exit;

            // $RS = $this->objsetup->CSI($Sql);
            $RS = $this->objsetup->CSI($Sql);


            if ($RS->RecordCount() > 0) {
                $Row = $RS->FetchRow();
                $conversion_rate = $Row['conversion_rate'];

                $net_amount_converted = bcdiv($net_amount, $conversion_rate, 2);
                $tax_amount_converted = bcdiv($tax_amount, $conversion_rate, 2);
                $grand_total_converted = bcdiv($grand_total, $conversion_rate, 2);
            }
            else{
                $response['ack'] = 0;
                $response['error'] = 'Please set the currency conversion rate!';

                $srLogTrace = array();
                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'Exit';
                $srLogTrace['ErrorMessage'] = "Please set the currency conversion rate!";

                $this->objsetup->SRTraceLogsPHP($srLogTrace);
                return $response;
            }             
        }
        else{
            $net_amount_converted = $net_amount;
            $tax_amount_converted = $tax_amount;
            $grand_total_converted = $grand_total;
        } 


        $Sql = "UPDATE srm_invoice 
                        SET 
                            net_amount='".$net_amount."', 
                            grand_total='".$grand_total."', 
                            tax_amount='".$tax_amount."',
                            tax_rate='".$tax_rate."',
                            note='".$attr['note']."',
                            net_amount_converted='".$net_amount_converted."', 
                            grand_total_converted='".$grand_total_converted."',
                            tax_amount_converted='".$tax_amount_converted."',
                            ChangedBy='" . $this->arrUser['id'] . "',
                            ChangedOn=UNIX_TIMESTAMP (NOW()),
                            items_net_total='".$items_net_total."',
                            items_net_discount='".$items_net_discount."',
                            items_net_vat='".$items_net_vat."'
                WHERE id = ".$attr['invoice_id']." 
                limit 1";
        // echo    $Sql ;exit;

        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, 'purchase_order', sr_AddEditPermission);

        $chk = false;
        $updateCHK2 = false;  

        // $this->objGeneral->mysql_clean($attr['items']);
        $this->objGeneral->mysql_clean($itemsArray);

        foreach ($itemsArray as $item) 
        {              
            $max_quantity = (isset($item->max_quantity) && $item->max_quantity!='')?$item->max_quantity:0;
            $min_quantity = (isset($item->min_quantity) && $item->min_quantity!='')?$item->min_quantity:0;
            $unit_measure_id = (isset($item->units->id) && $item->units->id!='')?$item->units->id:0;
            $unit_qty = (isset($item->units->quantity) && $item->units->quantity!='')?$item->units->quantity:0;
            $unit_parent_id = (isset($item->units->parent_id) && $item->units->parent_id!='')?$item->units->parent_id:0;
            $unit_measure = (isset($item->units->name) && $item->units->name!='')?$item->units->name:'';
            $conv_unit_price = (isset($item->conv_unit_price) && $item->conv_unit_price!='')?$item->conv_unit_price:0;
            $purchase_unit_id = (isset($item->purchase_unit_id) && $item->purchase_unit_id!='')?$item->purchase_unit_id:0;
            $discount_type_id = (isset($item->discount_type_id->id) && $item->discount_type_id->id!='' && $item->discount_type_id->id!='None')?$item->discount_type_id->id:0;
            $discount = (isset($item->discount) && $item->discount!='')? Round($item->discount,2):0;
            $stock_check = (isset($item->stock_check) && $item->stock_check!='')?$item->stock_check:0;
            $category_id = (isset($item->category_id) && $item->category_id!='')?$item->category_id:0;
            $sale_unit_id = (isset($item->sale_unit_id) && $item->sale_unit_id!='')?$item->sale_unit_id:0;
            $primary_unit_of_measure_id = (isset($item->primary_unit_of_measure_id) && $item->primary_unit_of_measure_id!='')?$item->primary_unit_of_measure_id:0;

            $vatsid = (isset($item->vats->id) && $item->vats->id!='')?$item->vats->id:0;
            $vat_value = (isset($item->vats->vat_value) && $item->vats->vat_value!='')?$item->vats->vat_value:0;
            $warehousesid = (isset($item->warehouses->id) && $item->warehouses->id!='')?$item->warehouses->id:0;
            $warehousesname = (isset($item->warehouses->name) && $item->warehouses->name!='')?$item->warehouses->name:0;
            $descriptionID = (isset($item->descriptionID) && $item->descriptionID!='')?$item->descriptionID:0;
            
            $invoice_id = (isset($attr['invoice_id']) && $attr['invoice_id']!='')?$attr['invoice_id']:0;
            $invoice_no = (isset($attr['invoice_no']) && $attr['invoice_no']!='')?$attr['invoice_no']:0;
            $supplier_id = (isset($attr['supplier_id']) && $attr['supplier_id']!='')?$attr['supplier_id']:0;
           
            $qty = (isset($item->qty) && $item->qty!='')?$item->qty:0;
            $unit_price = (isset($item->standard_price) && $item->standard_price!='')?round($item->standard_price,5):0;//3
            $total_price = (isset($item->total_price) && $item->total_price!='')?$item->total_price:0;
            $vat_price   = ($item->vat_price != '') ? $item->vat_price : '0';
            $discount_price = ($item->discount_price != '') ? $item->discount_price : '0';

            $item_type = (isset($item->item_type) && $item->item_type!='')?$item->item_type:0;

            if($item_type==2){
                $unit_measure_id = (isset($item->uomID) && $item->uomID!='')?$item->uomID:0;              
                $unit_measure = (isset($item->uom) && $item->uom!='')?$item->uom:'';              
            }

            $rawMaterialProduct = (isset($item->rawMaterialProduct) && $item->rawMaterialProduct!='')?$item->rawMaterialProduct:0;
            $raw_material_gl_id = (isset($item->raw_material_gl_id) && $item->raw_material_gl_id!='')?$item->raw_material_gl_id:0;

            $update_id = (isset($item->update_id) && $item->update_id!='')?$item->update_id:0;                
            $updateCHK = '';

            if($update_id>0 && $item->item_type==0)
                $updateCHK = ' AND tst.id <> '.$update_id;


            if($update_id>0){

                $Sql = "UPDATE srm_invoice_detail
                                SET
                                    supplier_id='" . $supplier_id . "',
                                    product_name='" .$item->product_name . "',
                                    descriptionID='" .$descriptionID . "',
                                    invoice_order_date='" . $this->objGeneral->convert_date($attr['order_date']) . "',
                                    uom_id='" .$unit_measure_id . "',
                                    qty='" .$qty . "',
                                    unit_price='" .$unit_price . "',
                                    vat='" . $item->vats->name . "',
                                    vat_id='" . $vatsid . "',
                                    vat_price=" . $vat_price . ",
                                    vat_value='" . $vat_value . "',
                                    total_price='" .$total_price . "',
                                    unit_measure='" . $unit_measure . "',
                                    unit_measure_id='" . $unit_measure_id . "',
                                    unit_qty='" . $unit_qty . "',
                                    unit_parent_id='" . $unit_parent_id . "',
                                    cat_id='" .$category_id . "',
                                    discount_type='" . $discount_type_id . "',
                                    discount='" .$discount . "',
                                    discount_price='$discount_price',
                                    sale_unit_id='" .$sale_unit_id . "',
                                    warehouse_id='" . $warehousesid . "',
                                    warehouse='" . $warehousesname . "',
                                    primary_unit_of_measure_name ='" .$item->primary_unit_of_measure_name . "',
                                    primary_unit_of_measure_id ='" .$primary_unit_of_measure_id  . "',
                                    ChangedBy='" . $this->arrUser['id'] . "',
                                    ChangedOn=UNIX_TIMESTAMP (NOW()),
                                    rawMaterialProduct='" .$rawMaterialProduct . "',                                            
                                    raw_material_gl_id='" .$raw_material_gl_id . "', 
                                    raw_material_gl_code='" .$item->raw_material_gl_code . "',
                                    raw_material_gl_name='" .$item->raw_material_gl_name . "', 
                                    stock_check='" .$stock_check . "'
                        WHERE id=".$update_id." ";
    
                // echo $Sql;//exit; 
                // $RS = $this->objsetup->CSI($Sql);
                $RS = $this->objsetup->CSI($Sql, 'purchase_order', sr_AddEditPermission);
                $updateCHK2 = true;                
            }   
            
            if ($this->Conn->Affected_Rows() > 0){
                $item->orderLineID = $update_id;
                $chk = true;
            }                    
            else
                $chk = false;                              
        }

        if ($chk) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['returnItems'] = $itemsArray;

            $this->updateItemCacheTableInPO($attr['invoice_id']);
            
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        } 
        elseif($updateCHK2) {
            $response['ack'] = 2;
            $response['error'] = 'Record Updated Successfully';// with no Changes
            $response['returnItems'] = $itemsArray;
            
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }
        else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = "Record not updated";

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }
        return $response;
    }

    function delete_invoice_item($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "Update srm_invoice_detail 
                                Set 
                                    status=0,
                                    ChangedBy='" . $this->arrUser['id'] . "',
                                    ChangedOn=UNIX_TIMESTAMP (NOW())
                                WHERE id = ".$attr['id']." 
                                LIMIT 1";
        //echo $Sql."<hr>"; exit;
        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, 'purchase_order', sr_EditPermission);

        if ($this->Conn->Affected_Rows() > 0) 
        {
            $this->updateItemCacheTableInPO($invoice_id);
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = "Record cannot be deleted";
        }
        return $response;
    }

    function checkCurrencyRate($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $response = array();

        if (!empty($attr['orderDate']) || $attr['orderDate'] != '')
            $orderDate = $this->objGeneral->convert_date($attr['orderDate']);
        else
            $orderDate = current_date;

        if (!empty($attr['invoiceDate']) || $attr['invoiceDate'] != '')
            $invoiceDate = $this->objGeneral->convert_date($attr['invoiceDate']);
        else
            $invoiceDate = current_date;

        if(($attr['currencyID'] != $attr['defaultCurrencyID']) && ($orderDate != $invoiceDate)){            

            $Sql = "SELECT d.conversion_rate AS orderRate,
                           (SELECT d.conversion_rate
                            FROM currency_histroy d 
                            WHERE d.currency_id='".$attr['currencyID']."' AND  
                                (FLOOR(d.start_date/86400)*86400) <= '" . $invoiceDate . "' AND
                                d.company_id =	'" . $this->arrUser['company_id'] . "'		
                            ORDER BY d.start_date DESC, d.action_date desc 
                            LIMIT 1) AS invoiceRate
                    FROM currency_histroy d 
                    WHERE d.currency_id='".$attr['currencyID']."' AND  
                          (FLOOR(d.start_date/86400)*86400) <= '" . $orderDate . "' AND
                          d.company_id =	'" . $this->arrUser['company_id'] . "'		
                    ORDER BY d.start_date DESC, d.action_date desc 
                    LIMIT 1";

            $RS = $this->objsetup->CSI($Sql);

            if ($RS->RecordCount() > 0) {
                $Row = $RS->FetchRow();
                // $orderRate = $Row['orderRate'];
                // $invoiceRate = $Row['invoiceRate'];
                $response['response'] = $Row;
            }
            else{
                $response['ack'] = 0;
                $response['error'] = 'Please set the currency conversion rate!';
                return $response;
            }             
        }
        elseif($attr['currencyID'] != $attr['defaultCurrencyID']){

            $Sql = "SELECT d.conversion_rate AS orderRate
                    FROM currency_histroy d 
                    WHERE d.currency_id='".$attr['currencyID']."' AND  
                          (FLOOR(d.start_date/86400)*86400) <= '" . $orderDate . "' AND
                          d.company_id =	'" . $this->arrUser['company_id'] . "'		
                    ORDER BY d.start_date DESC, d.action_date desc 
                    LIMIT 1";

            $RS = $this->objsetup->CSI($Sql);

            if ($RS->RecordCount() > 0) {
                $Row = $RS->FetchRow();
                // $orderRate = $Row['orderRate'];
                $Row['invoiceRate'] = $Row['orderRate'];
                $response['response'] = $Row;
            }
            else{
                $response['ack'] = 0;
                $response['error'] = 'Please set the currency conversion rate!';
                return $response;
            }
        }
        else{
            // Will Do it from Stored Procedure.
            /* $Sql = "UPDATE srm_invoice 
                                SET 
                                    currencyRateDate = '" . $orderDate . "'
                    WHERE id='".$attr['recID']."'
                    LIMIT 1";

            $RS = $this->objsetup->CSI($Sql); */

            $Row['orderRate'] = 1;
            $Row['invoiceRate'] = 1;
            $response['response'] = $Row;
        }

        $response['ack'] = 1;
        $response['error'] = '';

        return $response;
    }

    //--------- srm order return-----------------------------

    function get_order_return_listings($attr)
    {
        //$this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $response = array();

        $where_clause = "";
        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.",$attr,$fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.",$attr,$fieldsMeta);

        if ($attr['type'] == 1){
            $where_clause .= "AND tbl.type in (".$attr['type'].") ";
            $moduleNameForCount = "Debit Note";
            $moduleNameForRoles = "purchase_return";
        }
        else{
            $where_clause .= "AND tbl.type in (3,".$attr['type'].") ";
            $moduleNameForCount = "Debit Note";
            $moduleNameForRoles = "posted_debit_note";
        }

        if (!empty($attr['parent_id']))
            $where_clauseperson = "and wa.parent_id=  " . $attr['parent_id'] . "";

        if (!empty($attr['supplierID'])) {
            $where_clause2 .= " AND tbl.supplierID  = '".$attr['supplierID']."'";
        } 
             

        $Sql = "select * from (SELECT d.*,
                       d.crcode AS currency_code,
                       d.net_amount AS Amount,
                       country.iso  AS country,
                       shipment_methods.name AS shipment_method, 
                       sr_sel_postingGrp(d.company_id,d.supplierID) AS posting_grp,
                       sr_sel_segment(d.company_id,srm.segment_id) AS segment,  
                       d.grand_total AS 'Amount (incl VAT)',
                       (SELECT COUNT(record_id) AS D1 FROM document_association AS da WHERE da.record_id = d.id AND da.module_type='document' AND da.additional like '% unposted' AND da.record_type = '".$moduleNameForCount."') AS documentDNCount,
                       (SELECT COUNT(record_id) AS D2 FROM document_association AS da WHERE da.record_id = d.id AND da.module_type='document' AND da.additional like '% posted' AND da.record_type = '".$moduleNameForCount."') AS documentPDNCount,
                            (SELECT COUNT(record_id) AS D3 FROM document_association AS da, email_save as es WHERE es.id = da.module_id and es.type = 1 and da.record_id = d.id AND da.module_type='email' AND da.record_type = '".$moduleNameForCount."') AS emailCount
                FROM srm_order_returncache d
                LEFT JOIN country ON country.id = d.supplierCountry   
                LEFT JOIN shipment_methods ON shipment_methods.id = d.shipment_method_id
                LEFT JOIN srm  ON srm.id = d.supplierID
                WHERE (d.status=1 and
                       d.company_id=" . $this->arrUser['company_id'] . ")) as tbl where 1
                      " . $where_clause2 . "  " . $where_clause . " ";

        /* $subQueryForBuckets = " SELECT  s.id 
                                FROM sr_srm_general_sel as s
                                WHERE s.id IS NOT NULL "; */
        
        $subQueryForBuckets = " SELECT s.id 
                                FROM srm as s
                                WHERE s.type IN (2,3) AND 
                                      s.company_id=" . $this->arrUser['company_id'] . " ";

        //$subQueryForBuckets = $this->objsetup->whereClauseAppender($subQueryForBuckets,24);
        //echo $subQueryForBuckets;exit;

        // $Sql .= " AND (tbl.supplierID is null OR tbl.supplierID = '' OR tbl.supplierID IN ($subQueryForBuckets)) ";

        //echo $Sql;exit;                      

        if ($order_clause == ""){

            // $order_type = "order by tbl.id DESC";
            if ($attr['type'] == 1){
                $order_type = "ORDER BY tbl.supplierCreditNoteDate DESC,tbl.debitNoteCode DESC";
            }
            else{
                $order_type = "ORDER BY tbl.supplierCreditNoteDate DESC,tbl.invoice_code DESC";
            }
        }            
        else
            $order_type = $order_clause;

        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        // echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($response['q'], $moduleNameForRoles, sr_ViewPermission);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                $result = array();
                $result['id'] = $Row['id'];
                $result['type'] = $Row['type'];

                if($Row['supplierNo'] == '')
                    $result['current_stage'] ='';
                else
                    $result['current_stage'] = $Row['current_stage'];
                
                $result['supplierCreditNoteDate'] = $this->objGeneral->convert_unix_into_date($Row['supplierCreditNoteDate']);
                $result['dispatchDate'] = $this->objGeneral->convert_unix_into_date($Row['dispatchDate']);
                $result['receipt_date'] = $this->objGeneral->convert_unix_into_date($Row['supplierReceiptDate']);
                $result['deliveryDate'] = $this->objGeneral->convert_unix_into_date($Row['deliveryDate']);
                
                // $result['Invoice No.'] = $Row['invoice_code'];
                
                $result['debitNoteCode'] = $Row['debitNoteCode'];
                $result['invoice_code'] = $Row['invoice_code'];
                $result['supplierNo'] = $Row['supplierNo'];
                $result['supplierName'] = $Row['supplierName'];
                $result['supplierAddress'] = $Row['supplierAddress'];
                $result['supplierAddress2'] = $Row['supplierAddress2'];
                $result['supplierReferenceNo'] = $Row['supplierReferenceNo'];

                $result['shipToSupplierLocAddress'] = $Row['shipToSupplierLocAddress'];
                $result['shipToSupplierLocAaddress2'] = $Row['shipToSupplierLocAaddress2'];
                $result['shipToSupplierLocCity'] = $Row['shipToSupplierLocCity'];
                $result['shipToSupplierLocPostCode'] = $Row['shipToSupplierLocPostCode'];
                $result['shipToSupplierLocCounty'] = $Row['shipToSupplierLocCounty'];

                $result['shippingAgentRefNo'] = $Row['shippingAgentRefNo'];
                $result['shipping_agent_code'] = $Row['shipping_agent_code'];
                $result['shipment_method'] = $Row['shipment_method'];
                $result['posting_grp'] = $Row['posting_grp'];
                $result['segment'] = $Row['segment'];
                $result['country'] = $Row['country'];


                $result['supplierPostCode'] = $Row['supplierPostCode'];
                $result['supplierCity'] = $Row['supplierCity'];
                $result['supplierCounty'] = $Row['supplierCounty'];
                $result['sell_to_contact_no'] = $Row['sell_to_contact_no'];
                $result['supplierContactName'] = $Row['supplierContactName'];
                $result['purchaser'] = $Row['purchaser'];
                $result['supplierContactTelephone'] = $Row['supplierContactTelephone'];
                $result['supplierContactEmail'] = $Row['supplierContactEmail'];
                $result['warehouse_booking_ref'] = $Row['warehouse_booking_ref'];
                $result['purchaseInvoice'] = $Row['purchaseInvoice'];
                // $result['net_amount'] = number_format($Row['net_amount'], 2);//$Row['net_amount']; 
                $result['currency_id'] = $Row['currency_id'];
                $result['currency_code'] = $Row['crcode'];
                $result['Amount'] = $Row['net_amount'];
                $result['Amount (incl VAT)'] = $Row['grand_total'];
                $result['Link to So'] = '';
                $result['tax_amount'] = $Row['tax_amount'];
                $result['total_items'] = $Row['total_items'];
                $result['total_allocated'] = $Row['total_allocated'];
                $result['partially_allocated'] = $Row['partially_allocated'];
                $result['total_dispatched'] = $Row['total_dispatched'];
                $result['supplierCreditNoteNo'] = $Row['supplierCreditNoteNo'];
                $result['book_in_tel'] = $Row['book_in_tel'];
                $result['book_in_contact'] = $Row['book_in_contact'];
                $result['book_in_email'] = $Row['book_in_email'];
                $result['customer_warehouse_ref'] = $Row['customer_warehouse_ref'];
                $result['documentDNCount'] = $Row['documentDNCount'];
                $result['documentPDNCount'] = $Row['documentPDNCount'];
                $result['emailCount'] = $Row['emailCount'];

                if ($attr['more_fields'] == '1') {
                    $result['grand_total'] = $Row['grand_total_converted'];
                    $result['grand_total_converted'] = $Row['grand_total_converted'];
                    $result['orignal_grand_total'] = $Row['grand_total'];

                    $result['sale_invioce_code'] = $Row['invoice_code'];
                    $result['sale_order_code'] = $Row['debitNoteCode'];

                    $result['outstanding'] = $Row['outstanding'];
                    $result['postcode'] = $Row['sell_to_post_code'];
                    $result['phone'] = $Row['sell_to_contact_no'];
                    $result['email'] = $Row['email'];
                    $result['fax'] = $Row['fax'];
                    $result['purchaser_code'] = $Row['purchase_code'];

                    $result['cust_phone'] = $Row['cust_phone'];
                    $result['cust_fax'] = $Row['cust_fax'];
                    $result['cust_email'] = $Row['cust_email'];
                    $result['supp_order_no'] = $Row['supp_order_no'];

                    $result['requested_delivery_date'] = $this->objGeneral->convert_unix_into_date($Row['requested_delivery_date']);
                    $result['consigment_no'] = $Row['comm_book_in_no'];
                    $result['order_list_name'] = $Row['order_list_name'];

                    $result['currency_id'] = $Row['currency_id'];
                    $result['currency_rate'] = $Row['currency_rate'];
                    $result['due_date'] = '';
                    $day = 0;
                    $day = $Row['payment_days'];

                    if ($day > 0)
                        $result['due_date'] = date('d/m/Y', strtotime(date('Y/m/d ', $Row['invoice_date'], timezone) . " + $day  days"));
                }
                $result['prev_code'] = $Row['prev_code'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'][] = array();
        }

        $tableName = "";
        if ($attr['type'] == 1) $tableName = "DebitNotes";
        else if ($attr['type'] == 2) $tableName = "PostedDebitNotes";
        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData($tableName);return $response;
    }

    function get_order_return_code($attr)
    {
        $mSql = "SELECT prefix FROM `module_codes` WHERE `id` = 38";
        $code = $this->objsetup->CSI($mSql)->FetchRow();

        $Sql = "SELECT max(invoice_no) as count FROM srm_order_return";
        $crm = $this->objsetup->CSI($Sql)->FetchRow();
        //echo $mSql; exit;
        $nubmer = $crm['count'];

        if ($attr['is_increment'] == 1 || $nubmer == '')
            $nubmer++;

        $code_name = 'PR';

        return array('code' => $code_name . $this->objGeneral->module_invoice_prefix($nubmer), 
                     'number' => $nubmer, 
                     'prefix' => $code['prefix']);
    }

    function get_number_order_return($attr)
    {
        $sql_total = "SELECT  count(id) as total FROM srm_order_return where supp_order_no=".$attr['id']."";
        $rs_count = $this->objsetup->CSI($sql_total);
        $total = $rs_count->fields['total'];

        if ($total == 0) 
        {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {
            $response['ack'] = 0;
            $response['error'] = 'Invoice Number is Record Already Exists';
        }
        return $response;
    }

    function updateDebitNoteGrandTotal($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $net_amount = (isset($attr['netTotal']) && $attr['netTotal']!='')?$attr['netTotal']:0; 
        $tax_amount = (isset($attr['calcVat']) && $attr['calcVat']!='')?$attr['calcVat']:0; 
        $grand_total = (isset($attr['grandTotal']) && $attr['grandTotal']!='')?$attr['grandTotal']:0; 
        $order_id = (isset($attr['order_id']) && $attr['order_id']!='')?$attr['order_id']:0;
        $invoiceCurrencyID = (isset($attr['invoiceCurrencyID']) && $attr['invoiceCurrencyID']!='')?$attr['invoiceCurrencyID']:0;

        $conversion_rate = 1;

        if (!empty($attr['supplierCreditNoteDate']) || $attr['supplierCreditNoteDate'] != '')
            $current_date = $this->objGeneral->convert_date($attr['supplierCreditNoteDate']);
        else
            $current_date = current_date;

        if($invoiceCurrencyID != $attr['defaultCurrencyID']){            

            $Sql = "SELECT d.conversion_rate  
                    FROM currency_histroy d 
                    WHERE d.currency_id = '".$invoiceCurrencyID."' AND  
                          (FLOOR(d.start_date/86400)*86400) <= '" . $current_date . "' AND
                          d.company_id =	'" . $this->arrUser['company_id'] . "'
                    order by d.start_date DESC, d.action_date desc LIMIT 1  ";

            // $RS = $this->objsetup->CSI($Sql);
            $RS = $this->objsetup->CSI($Sql);

             if ($RS->RecordCount() > 0) {
                $Row = $RS->FetchRow();
                $conversion_rate = $Row['conversion_rate'];

                $net_amount_converted = bcdiv($net_amount, $conversion_rate, 2);
                $tax_amount_converted = bcdiv($tax_amount, $conversion_rate, 2);
                $grand_total_converted = bcdiv($grand_total, $conversion_rate, 2);
            }
            else{
                $response['ack'] = 0;
                $response['error'] = 'Please set the currency conversion rate!';
                return $response;
            }             
        }
        else{
            $net_amount_converted = $net_amount;
            $tax_amount_converted = $tax_amount;
            $grand_total_converted = $grand_total;
        } 

        if ($order_id > 0) 
        {
            $Sql = "UPDATE srm_order_return
                            SET 
                                net_amount='" . $net_amount. "', 
                                grand_total='" . $grand_total . "', 
                                tax_amount='" . $tax_amount . "',	
                                net_amount_converted='" . $net_amount_converted . "', 
                                grand_total_converted='" . $grand_total_converted . "', 
                                tax_amount_converted='" . $tax_amount_converted . "'
                    WHERE id = ".$order_id."  
                    limit 1";

            // echo $Sql;exit;
            
            $RS = $this->objsetup->CSI($Sql, 'purchase_return', sr_AddEditPermission);
        }

        $response['ack'] = 1;
        $response['error'] = NULL;

        return $response;

    }

    function convertInToReturnInovice($attr)
    {
        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['Parameter2'] = 'id:'.$attr['id'];
        $srLogTrace['ErrorMessage'] = "";

        $this->objsetup->SRTraceLogsPHP($srLogTrace);
    
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
        //print_r($attr);exit;
        $posting_grp = (isset($attr['posting_grp']) && $attr['posting_grp']!='')?$attr['posting_grp']:0;
        $converted_currency_id = (isset($attr['converted_currency_id']) && $attr['converted_currency_id']!='')?$attr['converted_currency_id']:0;
        $recReceivedMode = (isset($attr['recReceivedMode']) && $attr['recReceivedMode']!='')?$attr['recReceivedMode']:0;

        $items_net_amt = (isset($attr['items_net_amt']) && $attr['items_net_amt']!='')?$attr['items_net_amt']:0;
        $items_net_vat = (isset($attr['items_net_vat']) && $attr['items_net_vat']!='')?$attr['items_net_vat']:0;
        $items_net_disc = (isset($attr['items_net_disc']) && $attr['items_net_disc']!='')?$attr['items_net_disc']:0; 
        $grand_total = (isset($attr['grand_total']) && $attr['grand_total']!='')?$attr['grand_total']:0; 

        $invoiceCurrencyID = (isset($attr['invoiceCurrencyID']) && $attr['invoiceCurrencyID']!='')?$attr['invoiceCurrencyID']:0;
        $defaultCurrencyID = $attr['converted_currency_id']; 

        $allItemsArray = $attr['allItemsArray'];         

        $srLogTrace = array();
        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_3;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'grand_total:'.$grand_total;
        $srLogTrace['Parameter2'] = 'posting_grp:'.$posting_grp;
        $srLogTrace['Parameter3'] = 'ref_posting:'.$attr['ref_posting'];
        $srLogTrace['Parameter4'] = 'items_net_amt:'.$items_net_amt;
        $srLogTrace['Parameter5'] = 'items_net_vat:'.$items_net_vat;
        $srLogTrace['Parameter6'] = 'items_net_disc:'.$items_net_disc;

        $this->objsetup->SRTraceLogsPHP($srLogTrace);

        if($invoiceCurrencyID == 0){
            // $this->objsetup->terminateWithMessage("Currency is missing!");  
            $response['ack'] = 0;
            $response['error'] = 'Currency is missing!';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Currency is missing!';
            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            return $response; 
        }

        $net_amount = (isset($attr['net_amount']) && $attr['net_amount']!='')?$attr['net_amount']:0;      
        $tax_amount = (isset($attr['tax_amount']) && $attr['tax_amount']!='')?$attr['tax_amount']:0;      
        // $grand_total = (isset($attr['grand_total']) && $attr['grand_total']!='')?$attr['grand_total']:0; 

        $supplierID = (isset($attr['supplier_id']) && $attr['supplier_id']!='')?$attr['supplier_id']:0;      

        if (!empty($attr['supplierCreditNoteDate']) || $attr['supplierCreditNoteDate'] != '')
            $current_date = $this->objGeneral->convert_date($attr['supplierCreditNoteDate']);
        else
            $current_date = current_date;        

        $conversion_rate = 1;

        if($invoiceCurrencyID != $defaultCurrencyID){            

            $Sql = "SELECT d.conversion_rate  
                    FROM currency_histroy d 
                    WHERE d.currency_id='".$invoiceCurrencyID."' AND  
                          (FLOOR(d.start_date/86400)*86400) <= '" . $current_date . "' AND
                          d.company_id =	'" . $this->arrUser['company_id'] . "'		
                    order by d.start_date DESC, d.action_date desc LIMIT 1  ";

            $RS = $this->objsetup->CSI($Sql);

             if ($RS->RecordCount() > 0) {
                $Row = $RS->FetchRow();
                $conversion_rate = $Row['conversion_rate'];

                $net_amount_converted = bcdiv($net_amount, $conversion_rate, 2);
                $tax_amount_converted = bcdiv($tax_amount, $conversion_rate, 2);
                $grand_total_converted = bcdiv($grand_total, $conversion_rate, 2);
            }
            else{
                $response['ack'] = 0;
                $response['error'] = 'Please set the currency conversion rate!';

                $srLogTrace = array();
                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'Exit';
                $srLogTrace['ErrorMessage'] = 'Please set the currency conversion rate!';

                $this->objsetup->SRTraceLogsPHP($srLogTrace);
                return $response;
            }             
        }
        else{
            $net_amount_converted = $net_amount;
            $tax_amount_converted = $tax_amount;
            $grand_total_converted = $grand_total;
        }

        $supplierCreditNoteNo = (isset($attr['supplierCreditNoteNo']) && $attr['supplierCreditNoteNo']!='')?trim(addslashes(stripslashes($attr['supplierCreditNoteNo']))):'0'; 

        if($supplierCreditNoteNo != '0'){

            $data_pass = " tst.supplierCreditNoteNo = '" . $supplierCreditNoteNo . "' AND 
                           tst.supplierID = '" . $supplierID . "' AND 
                           tst.id <> " . $attr['id'] . " "; 

            $totalREC = $this->objGeneral->count_duplicate_in_sql('srm_order_return', $data_pass, $this->arrUser['company_id']);

            if ($totalREC > 0)
            {
                $response['ack'] = 0;
                $response['error'] = 'Supplier Credit Note No. Already Exists!';

                $srLogTrace = array();
                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'Exit';
                $srLogTrace['ErrorMessage'] = 'Supplier Credit Note No. Already Exists!';

                $this->objsetup->SRTraceLogsPHP($srLogTrace);
                return $response;                
            }
        }

        $purchaseInvoiceIDChk = '';

        if(isset($attr['purchaseInvoiceID']) && $attr['purchaseInvoiceID']>0){
            $purchaseInvoiceIDChk = "invoice_id = '" . $attr['purchaseInvoiceID'] . "' AND ";
        } 
        
        $sqlRawMaterialChk="SELECT sid.id,sid.product_name,sid.product_code,
                                (CASE WHEN (COALESCE((SELECT SUM(remaining_qty) 
                                                      FROM item_in_cost_entries 
                                                      WHERE company_id = sid.company_id AND 
                                                            product_id = sid.product_id AND 
                                                            ".$purchaseInvoiceIDChk."
                                                            remaining_qty > 0),0) + 1 > sid.qty)
                                    THEN 1
                                    ELSE 0
                                    END) AS availRawMaterailStock
                            FROM srm_order_return_detail AS sid
                            WHERE sid.company_id='" . $this->arrUser['company_id'] . "' AND 
                                  sid.invoice_id = '" . $attr['id'] . "' AND 
                                  sid.rawMaterialProduct = 1";

        $RsRawMaterialChk = $this->objsetup->CSI($sqlRawMaterialChk);

        $rawMaterialErrorCounter = 0;
        $rawMaterialErrorMsg = 'Following Raw Material(s) Stock is not Enough ';

        if ($RsRawMaterialChk->RecordCount() > 0) {
            while ($RowRawMaterialChk = $RsRawMaterialChk->FetchRow()) {

                if($RowRawMaterialChk['availRawMaterailStock'] == 0){

                    $rawMaterialErrorCounter++;
                    $rawMaterialErrorMsg .= ' '.$RowRawMaterialChk['product_name'].'('.$RowRawMaterialChk['product_code'].'),';
                }
            }
        }

        $rawMaterialErrorMsg = rtrim($rawMaterialErrorMsg,",");

        if($rawMaterialErrorCounter > 0){
            $response['ack'] = 0;
            $response['error'] = $rawMaterialErrorMsg;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = $rawMaterialErrorMsg;

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            return $response;
        }


        if($allItemsArray)
        {
            foreach($allItemsArray as $item){
                
                $item_converted_price = Round(($item->standard_price/$conversion_rate),3);//bcdiv($item->standard_price, $conversion_rate, 3);

                $sql3 = "UPDATE srm_order_return_detail 
                                    SET 
                                        item_converted_price = '" . $item_converted_price . "',
                                        ChangedBy='" . $this->arrUser['id'] . "',
                                        ChangedOn=UNIX_TIMESTAMP (NOW())
                                    where id = " . $item->update_id . " 
                                    limit 1";
                //echo $sql3;        
                $RS3 = $this->objsetup->CSI($sql3, 'purchase_return', sr_PostPermission);                             
            }
        }

        $posting_grp = 0;
        $ref_posting = '';        

        if($supplierID>0){

            $SqlSupp = "SELECT d.posting_group_id,
                               ref_posting_group.name as ref_posting
                        FROM srm_finance d
                        LEFT JOIN ref_posting_group on ref_posting_group.id=d.posting_group_id
                        WHERE d.supplier_id = ".$supplierID."
                        LIMIT 1";
                        
            //echo 	$SqlSupp;exit;
            $RSSupp = $this->objsetup->CSI($SqlSupp);      

            if ($RSSupp->RecordCount() > 0) {
                $RowSupp = $RSSupp->FetchRow();
                $posting_grp = $RowSupp['posting_group_id'];
                $ref_posting = $RowSupp['ref_posting'];
            }
            else{
                // $this->objsetup->terminateWithMessage("Supplier Posting Group is not Selected!");
                $response['ack'] = 0;
                $response['error'] = "Supplier Posting Group is not Selected!";

                $srLogTrace = array();
                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'Exit';
                $srLogTrace['ErrorMessage'] = 'Supplier Posting Group is not Selected!';

                $this->objsetup->SRTraceLogsPHP($srLogTrace);

                return $response; 
            }
        }
        else{
                $response['ack'] = 0;
                $response['error'] = "Supplier is not Selected!";

                $srLogTrace = array();
                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'Exit';
                $srLogTrace['ErrorMessage'] = 'Supplier is not Selected!';

                $this->objsetup->SRTraceLogsPHP($srLogTrace);

                return $response; 
        }

        $Sql = "UPDATE srm_order_return 
                        SET 
                            net_amount='" . $net_amount . "', 
                            grand_total='" . $grand_total . "', 
                            tax_amount='" . $tax_amount . "',	
                            net_amount_converted='" . $net_amount_converted . "', 
                            grand_total_converted='" . $grand_total_converted . "', 
                            tax_amount_converted='" . $tax_amount_converted . "',
                            currency_rate ='" . $conversion_rate . "',
                            converted_currency_id = '" . $converted_currency_id . "', 
                            bill_to_posting_group_id = '" . $posting_grp . "', 
                            bill_to_posting_group_name = '" . $ref_posting . "' 
                WHERE id = ".$attr['id']." ";
       // echo $Sql;exit; // $attr['ref_posting'] 

        $RS = $this->objsetup->CSI($Sql, 'purchase_return', sr_PostPermission);

        $Sql2 = "CALL SR_DebitNote_Invoice_Post(".$attr['id'].", 
                                                    ".$this->arrUser['company_id'].", 
                                                    ".$this->arrUser['id'].", 
                                                    ".$posting_grp.", 
                                                    ".$items_net_amt.", 
                                                    ".$items_net_vat.", 
                                                    ".$items_net_disc.", 
                                                    ".$grand_total.",
                                                    ".$recReceivedMode.",
                                                    @errorNo,
                                                    @param1,
                                                    @param2,
                                                    @param3,
                                                    @param4
                                                )";
        // echo $Sql2;exit;
        $RS2 = $this->objsetup->CSI($Sql2, 'purchase_return', sr_PostPermission);

        // echo '<pre>';print_r($RS2);exit;

        if($RS2->msg == 1)
        {             
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

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            return $response;
            // $this->objsetup->terminateWithMessage("postPurchaseInvoice");
        }        
        else
        {
            // $this->objsetup->terminateWithMessage("Cannot convert into invoice");
            $response['ack'] = 0;
            $response['error'] = $RS2->Error;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = $RS2->Error;

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            return $response;            
        }
    }

    function convert_recieved_stock_order_detail($attr)
    {
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
        // print_r($attr); exit;	 
        $Sql = "UPDATE srm_order_return_detail 
                                    SET  
                                        purchase_status=2,
                                        ChangedBy='" . $this->arrUser['id'] . "',
                                        ChangedOn=UNIX_TIMESTAMP (NOW()) 
                                    WHERE invoice_id = ".$attr['invoice_id']." ";
        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, 'purchase_return', sr_EditPermission);


        $Sql2 = "UPDATE warehouse_allocation	
                                    SET  
                                        purchase_status=2 
                                    WHERE order_id = ".$attr['invoice_id']." ";
        $RS2 = $this->objsetup->CSI($Sql2);

        $Sql3 = "UPDATE srm_order_return 
                                    SET 
                                        type=2 
                                    WHERE id = ".$attr['invoice_id']." 
                                    Limit 1";
        // $RS = $this->objsetup->CSI($Sql3);
        $RS = $this->objsetup->CSI($Sql3, 'purchase_return', sr_EditPermission);


        if ($this->Conn->Affected_Rows() > 0) 
        {
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

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record not updated';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }
        return $response;
    }

    function update_order_return($attr)
    {        
        $this->objGeneral->mysql_clean($attr);
        //echo '<pre>';  print_r($attr);exit;

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

        $update_id = $attr['id'];
        $update_check = "";

        if ($update_id > 0)
            $update_check = "  AND tst.id <> '" . $update_id . "'";
        //tst.type IN (2,3)  AND 

        $data_pass = " tst.status=1 and tst.debitNoteCode='" . $attr['debitNoteCode'] . "'  ".$update_check." ";
        $total = $this->objGeneral->count_duplicate_in_sql('srm_order_return', $data_pass, $this->arrUser['company_id']);

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
        }
        

        $debitNoteCode = (isset($attr['debitNoteCode']) && $attr['debitNoteCode']!='')?$attr['debitNoteCode']:0;
        $supplierID = (isset($attr['supplierID']) && $attr['supplierID']!='')?$attr['supplierID']:0;
        $supplierCountry = (isset($attr['supplierCountrys']) && $attr['supplierCountrys']!='')?$attr['supplierCountrys']:0;
        $supplierContactID = (isset($attr['supplierContactID']) && $attr['supplierContactID']!='')?$attr['supplierContactID']:0;
        $purchaserID = (isset($attr['purchaserID']) && $attr['purchaserID']!='')?$attr['purchaserID']:0;
        $billToSupplierID = (isset($attr['billToSupplierID']) && $attr['billToSupplierID']!='')?$attr['billToSupplierID']:0;
        $billToSupplierCountry = (isset($attr['billToSupplierCountrys']) && $attr['billToSupplierCountrys']!='')?$attr['billToSupplierCountrys']:0;
        $shipToSupplierLocCountry = (isset($attr['shipToSupplierLocCountrys']) && $attr['shipToSupplierLocCountrys']!='')?$attr['shipToSupplierLocCountrys']:0;      
        $billToSupplierContactID = (isset($attr['billToSupplierContactID']) && $attr['billToSupplierContactID']!='')?$attr['billToSupplierContactID']:0;
        // $currency_id = (isset($attr['currency_id']) && $attr['currency_id']!='')?$attr['currency_id']:0;        
        $currency_id = (isset($attr['currency_ids']) && $attr['currency_ids']!='')?$attr['currency_ids']:0;        
        $shipToSupplierLocID = (isset($attr['shipToSupplierLocID']) && $attr['shipToSupplierLocID']!='')?$attr['shipToSupplierLocID']:0;
        $payment_method_id = (isset($attr['payment_method_id']) && $attr['payment_method_id']!='')?$attr['payment_method_id']:0;
        $shipment_method_id = (isset($attr['shipment_method_id']) && $attr['shipment_method_id']!='')?$attr['shipment_method_id']:0;
        $shipping_agent_id = (isset($attr['shipping_agent_id']) && $attr['shipping_agent_id']!='')?$attr['shipping_agent_id']:0;
        $freight_charges = (isset($attr['freight_charges']) && $attr['freight_charges']!='')? Round($attr['freight_charges'],2):0;
        $payment_discount = (isset($attr['payment_discount']) && $attr['payment_discount']!='')? Round($attr['payment_discount'],2):0;
        $type = (isset($attr['type']) && $attr['type']!='')?$attr['type']:0;        
        $bank_account_id = (isset($attr['bank_account_id']) && $attr['bank_account_id']!='')?$attr['bank_account_id']:0;        
        $purchaseInvoiceID = (isset($attr['purchaseInvoiceID']) && $attr['purchaseInvoiceID']!='')?$attr['purchaseInvoiceID']:0;        
        $purchaseInvoiceType = (isset($attr['purchaseInvoiceType']) && $attr['purchaseInvoiceType']!='')?$attr['purchaseInvoiceType']:0;        
        // $shipToSupplierLocID = (isset($attr['shipToSupplierLocID']) && $attr['shipToSupplierLocID']!='')?$attr['shipToSupplierLocID']:0;     


        $supplierCreditNoteNo = (isset($attr['supplierCreditNoteNo']) && $attr['supplierCreditNoteNo']!='')?trim(addslashes(stripslashes($attr['supplierCreditNoteNo']))):'0'; 

        if($supplierCreditNoteNo != '0' && $update_id > 0){

            $data_pass = " tst.supplierCreditNoteNo='" . $supplierCreditNoteNo . "' AND 
                           tst.supplierID='" . $supplierID . "' AND 
                           tst.id <> " . $update_id . " "; 
            $totalREC = $this->objGeneral->count_duplicate_in_sql('srm_order_return', $data_pass, $this->arrUser['company_id']);

            if ($totalREC > 0) 
            {
                $response['ack'] = 0;
                $response['error'] = 'Supplier Credit Note No. Already Exists!';

                $srLogTrace = array();
                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'Exit';
                $srLogTrace['ErrorMessage'] = 'Supplier Credit Note No. Already Exists!';

                $this->objsetup->SRTraceLogsPHP($srLogTrace);
                return $response;                
            }
        }


        $posting_group_id = (isset($attr['posting_group_id']) && $attr['posting_group_id']!='')?$attr['posting_group_id']:0;  

        $anonymous_supplier = (isset($attr['supplierAnonymousSupplier']) && $attr['supplierAnonymousSupplier']!='')?$attr['supplierAnonymousSupplier']:0;               
        $bill_anonymousSupplier = (isset($attr['bill_to_anonymous_supplier']) && $attr['bill_to_anonymous_supplier']!='')?$attr['bill_to_anonymous_supplier']:0; 

        $net_amount = (isset($attr['net_amount']) && $attr['net_amount']!='')? Round($attr['net_amount'],2):0;      
        $tax_amount = (isset($attr['tax_amount']) && $attr['tax_amount']!='')? Round($attr['tax_amount'],2):0;      
        $grand_total = (isset($attr['grand_total']) && $attr['grand_total']!='')? Round($attr['grand_total'],2):0;

        $postponed_vat = (isset($attr['postponed_vat']) && $attr['postponed_vat']!='')?$attr['postponed_vat']:0;      

        if (!empty($attr['supplierCreditNoteDate']) || $attr['supplierCreditNoteDate'] != '')
            $current_date = $this->objGeneral->convert_date($attr['supplierCreditNoteDate']);
        else
            $current_date = current_date;


        if($currency_id != $attr['defaultCurrencyID']  && $supplierID>0){            

            $Sql = "SELECT d.conversion_rate  
                    FROM currency_histroy d 
                    WHERE d.currency_id='".$currency_id."' AND  
                          (FLOOR(d.start_date/86400)*86400) <= '" . $current_date . "' AND
                          d.company_id =	'" . $this->arrUser['company_id'] . "'		
                    order by d.start_date DESC, d.action_date desc LIMIT 1  ";

            $RS = $this->objsetup->CSI($Sql);

             if ($RS->RecordCount() > 0) {
                $Row = $RS->FetchRow();
                $conversion_rate = $Row['conversion_rate'];

                $net_amount_converted = bcdiv($net_amount, $conversion_rate, 2);
                $tax_amount_converted = bcdiv($tax_amount, $conversion_rate, 2);
                $grand_total_converted = bcdiv($grand_total, $conversion_rate, 2);
            }
            else{
                $response['ack'] = 0;
                $response['error'] = 'Please set the currency conversion rate!';

                $srLogTrace = array();
                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'Exit';
                $srLogTrace['ErrorMessage'] = 'Please set the currency conversion rate!';

                $this->objsetup->SRTraceLogsPHP($srLogTrace);
                return $response;
            }             
        }
        else{
            $net_amount_converted = $net_amount;
            $tax_amount_converted = $tax_amount;
            $grand_total_converted = $grand_total;
        }

        $supplierCreditNoteDateUnConv = ""; 

        if($attr['supplierCreditNoteDate'] > 0){
            $supplierCreditNoteDateUnConv = "supplierCreditNoteDateUnConv = '" . $this->objGeneral->convertUnixDateIntoConvDate($attr['supplierCreditNoteDate']) . "',";            
        } 

        if($supplierID == 0) {
            $supplierID = 'NULL';
        }                   

        if ($update_id == 0) 
        {
            $Sql = "INSERT INTO srm_order_return
                                    SET
                                        transaction_id = SR_GetNextTransactionID(".$this->arrUser['company_id'].", 2), 
                                        debitNoteCode='$debitNoteCode',
                                        prev_code='$attr[prev_code]',
                                        supplierNo='$attr[supplierNo]',
                                        supplierID='$supplierID',
                                        supplierName='$attr[supplierName]',
                                        supplierAddress='$attr[supplierAddress]',
                                        supplierAddress2='$attr[supplierAddress2]',
                                        supplierCity='$attr[supplierCity]',
                                        supplierCounty='$attr[supplierCounty]',
                                        supplierPostCode='$attr[supplierPostCode]',
                                        supplierCountry='$supplierCountry',
                                        supplierContactID='$supplierContactID',
                                        supplierContactName='$attr[supplierContactName]',
                                        supplierContactTelephone='$attr[supplierContactTelephone]',
                                        supplierContactFax='$attr[supplierContactFax]',
                                        supplierContactEmail='$attr[supplierContactEmail]',
                                        supplierCreditNoteDate='" . $this->objGeneral->convert_date($attr['supplierCreditNoteDate']) . "',
                                        $supplierCreditNoteDateUnConv
                                        supplierCreditNoteNo='$attr[supplierCreditNoteNo]',
                                        anonymous_supplier = $anonymous_supplier,
                                        dispatchDate='" . $this->objGeneral->convert_date($attr['dispatchDate']) . "',
                                        supplierReceiptDate='" . $this->objGeneral->convert_date($attr['supplierReceiptDate']) . "',
                                        supplierReferenceNo='$attr[supplierReferenceNo]',
                                        purchaserID='$purchaserID',
                                        purchaser='$attr[Purchaser]',
                                        billToSupplierID='$billToSupplierID',                                        
                                        billToSupplierNo='$attr[billToSupplierNo]',
                                        billToSupplierName='$attr[billToSupplierName]',
                                        billToSupplierAddress='$attr[billToSupplierAddress]',
                                        billToSupplierAddress2='$attr[billToSupplierAddress2]',
                                        billToSupplierCity='$attr[billToSupplierCity]',
                                        billToSupplierCounty='$attr[billToSupplierCounty]',
                                        billToSupplierCountry='$billToSupplierCountry',
                                        billToSupplierPostCode='$attr[billToSupplierPostCode]',
                                        billToSupplierContactID='$billToSupplierContactID',
                                        billToSupplierContact='$attr[billToSupplierContact]',
                                        billToSupplierTelephone='$attr[billToSupplierTelephone]',
                                        billToSupplierFax='$attr[billToSupplierFax]',
                                        billToSupplierEmail='$attr[billToSupplierEmail]',
                                        bill_anonymousSupplier = $bill_anonymousSupplier,
                                        currency_id='$currency_id',
                                        bank_account_id='$bank_account_id',
                                        payment_method_id='$payment_method_id',
                                        payment_method_code='$attr[payment_method_code]',
                                        payment_terms_code='$attr[payment_terms_code]',
                                        payable_bank='$attr[payable_bank]',
                                        shipToSupplierLocID='$shipToSupplierLocID',
                                        shipToSupplierLocName='$attr[shipToSupplierLocName]',
                                        shipToSupplierLocAddress='$attr[shipToSupplierLocAddress]',
                                        shipToSupplierLocAaddress2='$attr[shipToSupplierLocAaddress2]',
                                        shipToSupplierLocCity='$attr[shipToSupplierLocCity]',
                                        shipToSupplierLocCounty='$attr[shipToSupplierLocCounty]',
                                        shipToSupplierLocCountry='$shipToSupplierLocCountry' ,
                                        shipToSupplierLocPostCode='$attr[shipToSupplierLocPostCode]',
                                        shipToSupplierLocContact='$attr[shipToSupplierLocContact]',
                                        ship_to_contact_shiping='$attr[ship_to_contact_shiping]',
                                        shipment_method_id='$shipment_method_id',
                                        shipment_method_code='$attr[shipment_method_code]',
                                        shipping_agent_code='$attr[shipping_agent_code]',
                                        type='$type',
                                        note='".$attr['note']."',
                                        status=1,
                                        shipping_agent_id='$shipping_agent_id',
                                        freight_charges='$freight_charges',
                                        payment_discount='$payment_discount',                                        
                                        shipment_date='" . $this->objGeneral->convert_date($attr['shipment_date']) . "',
                                        deliveryDate='" . $this->objGeneral->convert_date($attr['deliveryDate']) . "',
                                        ship_delivery_time='$attr[ship_delivery_time]',
                                        shippingAgentRefNo='$attr[shippingAgentRefNo]',
                                        book_in_tel='$attr[book_in_tel]',                                   
                                        book_in_contact='$attr[book_in_contact]',                                   
                                        book_in_email='$attr[book_in_email]',
                                        purchaseInvoiceID='$purchaseInvoiceID', 
                                        purchaseInvoiceType='$purchaseInvoiceType', 
                                        purchaseInvoice='$attr[purchaseInvoice]', 
                                        bill_to_posting_group_id = '" . $posting_group_id . "', 
                                        bill_to_posting_group_name = '" . $attr['ref_posting'] . "', 
                                        warehouse_booking_ref='$attr[warehouse_booking_ref]', 
                                        customer_warehouse_ref='$attr[customer_warehouse_ref]',
                                        postponed_vat = '" . $postponed_vat . "', 
                                        user_id='" . $this->arrUser['id'] . "',
                                        company_id='" . $this->arrUser['company_id'] . "',
                                        AddedBy='" . $this->arrUser['id'] . "',
                                        AddedOn=UNIX_TIMESTAMP (NOW()),
                                        ChangedBy='" . $this->arrUser['id']  . "',
                                        ChangedOn=UNIX_TIMESTAMP (NOW())";
        } 
        else {
            $Sql = "UPDATE srm_order_return
                                SET 
                                    supplierNo='$attr[supplierNo]',
                                    supplierID=$supplierID,
                                    prev_code='$attr[prev_code]',
                                    supplierName='$attr[supplierName]',
                                    supplierAddress='$attr[supplierAddress]',
                                    supplierAddress2='$attr[supplierAddress2]',
                                    supplierCity='$attr[supplierCity]',
                                    supplierCounty='$attr[supplierCounty]',
                                    supplierPostCode='$attr[supplierPostCode]',
                                    supplierCountry='$supplierCountry',
                                    supplierContactID='$supplierContactID',
                                    supplierContactName='$attr[supplierContactName]',
                                    supplierContactTelephone='$attr[supplierContactTelephone]',
                                    supplierContactFax='$attr[supplierContactFax]',
                                    supplierContactEmail='$attr[supplierContactEmail]',                                    
                                    supplierCreditNoteDate='" . $this->objGeneral->convert_date($attr['supplierCreditNoteDate']) . "',
                                    $supplierCreditNoteDateUnConv
                                    supplierCreditNoteNo='$attr[supplierCreditNoteNo]',
                                    anonymous_supplier = $anonymous_supplier,
                                    dispatchDate='" . $this->objGeneral->convert_date($attr['dispatchDate']) . "',
                                    supplierReceiptDate='" . $this->objGeneral->convert_date($attr['supplierReceiptDate']) . "',
                                    supplierReferenceNo='$attr[supplierReferenceNo]',
                                    purchaserID='$purchaserID',
                                    purchaser='$attr[Purchaser]',
                                    billToSupplierID='$billToSupplierID',
                                    billToSupplierNo='$attr[billToSupplierNo]',
                                    billToSupplierName='$attr[billToSupplierName]',
                                    billToSupplierAddress='$attr[billToSupplierAddress]',
                                    billToSupplierAddress2='$attr[billToSupplierAddress2]',
                                    billToSupplierCity='$attr[billToSupplierCity]',
                                    billToSupplierCounty='$attr[billToSupplierCounty]',
                                    billToSupplierCountry='$billToSupplierCountry',
                                    billToSupplierPostCode='$attr[billToSupplierPostCode]',
                                    billToSupplierContactID='$billToSupplierContactID',
                                    billToSupplierContact='$attr[billToSupplierContact]',
                                    billToSupplierTelephone='$attr[billToSupplierTelephone]',
                                    billToSupplierFax='$attr[billToSupplierFax]',
                                    billToSupplierEmail='$attr[billToSupplierEmail]',
                                    bill_anonymousSupplier = $bill_anonymousSupplier,                                 
                                    currency_id='$currency_id',
                                    payment_method_id='$payment_method_id',
                                    bank_account_id='$bank_account_id',
                                    payment_method_code='$attr[payment_method_code]',
                                    payment_terms_code='$attr[payment_terms_code]',
                                    payable_bank='$attr[payable_bank]',
                                    shipToSupplierLocID='$shipToSupplierLocID',
                                    shipToSupplierLocName='$attr[shipToSupplierLocName]',
                                    shipToSupplierLocAddress='$attr[shipToSupplierLocAddress]',
                                    shipToSupplierLocAaddress2='$attr[shipToSupplierLocAaddress2]',
                                    shipToSupplierLocCity='$attr[shipToSupplierLocCity]',
                                    shipToSupplierLocCounty='$attr[shipToSupplierLocCounty]',
                                    shipToSupplierLocCountry='$shipToSupplierLocCountry' ,
                                    shipToSupplierLocPostCode='$attr[shipToSupplierLocPostCode]',
                                    shipToSupplierLocContact='$attr[shipToSupplierLocContact]',
                                    ship_to_contact_shiping='$attr[ship_to_contact_shiping]',
                                    shipment_method_id='$shipment_method_id',
                                    shipment_method_code='$attr[shipment_method_code]',
                                    shipping_agent_code='$attr[shipping_agent_code]',
                                    note='".$attr['note']."',
                                    type='$type',
                                    shipping_agent_id='$shipping_agent_id',
                                    freight_charges='$freight_charges',
                                    payment_discount='$payment_discount',                                       
                                    shipment_date='" . $this->objGeneral->convert_date($attr['shipment_date']) . "',
                                    deliveryDate='" . $this->objGeneral->convert_date($attr['deliveryDate']) . "',
                                    ship_delivery_time='$attr[ship_delivery_time]',
                                    shippingAgentRefNo='$attr[shippingAgentRefNo]', 
                                    book_in_tel='$attr[book_in_tel]',                                   
                                    book_in_contact='$attr[book_in_contact]',                                   
                                    book_in_email='$attr[book_in_email]',
                                    purchaseInvoiceID='$purchaseInvoiceID',  
                                    purchaseInvoiceType='$purchaseInvoiceType',
                                    purchaseInvoice='$attr[purchaseInvoice]', 
                                    bill_to_posting_group_id = '" . $posting_group_id . "', 
                                    bill_to_posting_group_name = '" . $attr['ref_posting'] . "',  
                                    warehouse_booking_ref='$attr[warehouse_booking_ref]', 
                                    customer_warehouse_ref='$attr[customer_warehouse_ref]',
                                    converted_currency_id = '" . $attr['defaultCurrencyID'] . "', 
                                    net_amount='" . $net_amount. "', 
                                    grand_total='" . $grand_total . "', 
                                    tax_amount='" . $tax_amount . "',	
                                    net_amount_converted='" . $net_amount_converted . "', 
                                    grand_total_converted='" . $grand_total_converted . "', 
                                    tax_amount_converted='" . $tax_amount_converted . "', 
                                    postponed_vat = '" . $postponed_vat . "',                                    
                                    ChangedBy='" . $this->arrUser['id']  . "',
                                    ChangedOn=UNIX_TIMESTAMP (NOW())
                            WHERE id = $update_id 
                            limit 1";
        }
        // echo $Sql;exit;

        // $RS = $this->objsetup->CSI($Sql);  

        if ($update_id == 0){
            $RS = $this->objsetup->CSI($Sql, 'purchase_return', sr_AddPermission);
        }else{
            $RS = $this->objsetup->CSI($Sql, 'purchase_return', sr_AddEditPermission);
        }      

        if ($this->Conn->Affected_Rows() > 0) 
        {
            if ($update_id == 0){

                $update_id = $this->Conn->Insert_ID();

                if($update_id > 0)
                {
                    $Sql2 = "SELECT id 
                             FROM ref_crm_order_stages 
                             WHERE module_id = 3 and 
                                   company_id='" . $this->arrUser['company_id'] . "' and 
                                   status = 1 
                             ORDER BY `rank`";
                    // echo $Sql2; exit;

                    $RS2 = $this->objsetup->CSI($Sql2);
                    $stage_count = 0;

                    if ($RS2->RecordCount() > 0) {
                        while ($Row2 = $RS2->FetchRow()) {
                            $Sql3 = "INSERT INTO ref_order_stage_list
                                                    SET    
                                                        order_id = $update_id,
                                                        ref_stage_id = $Row2[id],
                                                        company_id = ".$this->arrUser['company_id'].", 
                                                        user_id = ".$this->arrUser['id'].", ";

                            if($stage_count == 0)
                            {
                                $stage_count =1;
                                $Sql3 .=" state = 'active'";
                            }
                            else
                                $Sql3 .=" state = 'outstanding'";

                            // echo $Sql3;exit;
                            $RS3 = $this->objsetup->CSI($Sql3);
                        }                    
                    } 
                    // just to update cache
                    $Sql1 = "update srm_order_return set changedOn=UNIX_TIMESTAMP (NOW()) WHERE id=$update_id; -- just to update cache for order stage";
                    // echo $Sql1;exit;
                    $RS1 = $this->objsetup->CSI($Sql1); 
                }
            }
                

            $response['ack'] = 1;
            $response['id'] = $update_id;
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
            $response['error'] = NULL;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
            $response['id'] = $update_id;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record is Not updated!';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }

        return $response;
    }

    //--------- srm order  return details-----------------------------
    function get_orreturn_item_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if (!empty($attr['searchKeyword'])) 
        {
            $val = intval(preg_replace("/[^0-9]/", '', $attr['searchKeyword']));

            if ($val != 0)
                $where_clause .= " AND  prd.product_no LIKE '%".$val."%'  ";
            else
                $where_clause .= "   AND prd.description LIKE '%".$attr['searchKeyword']."%'";
        }

        if (!empty($attr['units']))
            $where_clause .= " AND prd.unit_id = " . $attr['units'];

        if (!empty($attr['brands']))
            $where_clause .= " AND prd.brand_id = " . $attr['brands'];

        if (!empty($attr['cat_types']))
            $where_clause .= " AND prd.category_id = " . $attr['cat_types'];

        $response = array();
        if (!empty($attr['suppler_id']))
            $where_price .= " AND sp.supplier_id = " . $attr['suppler_id'];

        if (!empty($attr['invoice_id']))
            $where_clause .= " AND sd.invoice_id = " . $attr['invoice_id'];

        $Sql = "SELECT  prd.id as pid,
                        sd.id as id,
                        prd.description,
                        prd.product_code,
                        prd.vat_rate_id,
                        prd.unit_id,
                        prd.standard_price ,
                        prd.max_quantity,
                        prd.min_quantity,
                        prd.min_quantity,
                        prd.min_quantity,
                        sd.unit_measure_id,
                        sd.unit_price,
                        sd.warehouse_id, 
                        " . $this->objGeneral->get_nested_query_list('cat', $this->arrUser['company_id']) . ", 
                        " . $this->objGeneral->get_nested_query_list('brand', $this->arrUser['company_id']) . ", 
                        " . $this->objGeneral->get_nested_query_list('unit', $this->arrUser['company_id']) . ", 
                        " . $this->objGeneral->current_stock_counter($this->arrUser['company_id']) . ",                        
                        (SELECT wh.name 
                         FROM warehouse wh 
                         WHERE wh.id =sd.warehouse_id 
                         Limit 1)as warehouse_name
                From product  prd
                JOIN srm_invoice_detail sd on sd.product_id=prd.id
                where sd.status = 1 and  
                      sd.invoice_id='".$attr['invoice_id']."' AND 
                      prd.company_id='" . $this->arrUser['company_id'] . "' " . $where_clause . " ";

        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'prd', $order_by);
        //   echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
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

    function get_sublist_return($attr)
    {
        $volume = 0;
        $volume_unit = '';
        $weight = 0;
        $weightunit = '';
        $weight_permission = 0;  
        $volume_permission = 0;  

        $Sql4 = "SELECT  SUM(uomsetup.volume * inv.qty) AS volume,
                    'cm3' AS volume_unit,
                    SUM((CASE WHEN uomsetup.weightunit = 1 THEN (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2)) / 1000
                        ELSE (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2))
                        END)* inv.qty) AS weight,
                    'kg' AS weightunit,weight_permission,volume_permission
                FROM srm_order_return_detail AS inv
                LEFT JOIN units_of_measure_setup AS uomsetup ON inv.unit_measure_id = uomsetup.id AND inv.type=0
                LEFT JOIN items_weight_setup AS w ON w.title = 'Debit Note' AND inv.company_id = w.company_id
                WHERE inv.invoice_id='".$attr['invoice_id']."' ";
        //echo $Sql4."<hr>"; exit;

        $rs4 = $this->objsetup->CSI($Sql4);

        if ($rs4->RecordCount() > 0){
            $volume = $rs4->fields['volume'];
            $volume_unit = $rs4->fields['volume_unit'];
            $weight = $rs4->fields['weight'];
            $weightunit = $rs4->fields['weightunit'];
            $weight_permission = $rs4->fields['weight_permission'];
            $volume_permission = $rs4->fields['volume_permission'];
        }

        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "SELECT es.*,(SELECT wh.item_trace_unique_id 
                             FROM warehouse_allocation AS wh
                             WHERE wh.order_id= '".$attr['purchaseInvoiceID']."' AND
                                   wh.product_id= es.product_id AND  
                                   wh.type=1 AND 
                                   wh.purchase_status=3 AND 
                                   wh.purchase_return_status=0   
                                   LIMIT 1) as item_trace_unique_id 
                FROM srm_order_return_detail es
                WHERE es.status=1 and 
                      es.invoice_id='".$attr['invoice_id']."'"; 
         //echo $Sql; exit;

        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, 'purchase_return', sr_ViewPermission);

        
        if ($RS->RecordCount() > 0) 
        {
            // require_once(SERVER_PATH . "/classes/Stock.php");
            // $this->objstock = new Stock($this->arrUser);

            while ($Row = $RS->FetchRow()) 
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                } 
                $attr['product_id'] = $Row['product_id'];
                $attr['item_trace_unique_id'] = $Row['item_trace_unique_id'];

                //$Row['prodQty'] = self::getCurrentStockByInvoice($attr);
                // exit;

                $temp_attr['type']      = 1;
                $temp_attr['item_id']   = $Row['product_id'];
                $temp_attr['order_id']  = $Row['invoice_id'];
                $temp_attr['wh_id']     = $Row['warehouse_id'];
                $temp_attr['purchaseReturn']= 1;
                $temp_attr['purchase_order_detail_id']= $Row['id'];
                    
                require_once(SERVER_PATH . "/classes/Saleswarehouse.php");
                $ObjWH = new Saleswarehouse($this->arrUser);
                $Row['item_stock_allocation'] = $ObjWH->getPurchaseOrderStockAllocation($temp_attr);


                $Row['arr_warehouse'] = $this->objstock->get_all_product_warehouses($attr);
                $Row['arr_units'] = $this->objstock->get_unit_setup_list_category_by_item($attr);
                // $Row['currentStock'] = self::getCurrentStockByProductID($attr);
                $Row['currentStock'] =$Row['prodQty'];

                if ($Row['type'] == '1') {

                    if($this->arrUser['company_id'] == 133){

                        // PBI: Requirment In GL For Vat GL Calculation in Vat column instead of general calculation. 
                        $sqlvat = " SELECT gl1.id AS gl1ID,gl1.accountCode AS gl1AccountCode,
                                        gl2.id AS gl2ID,gl2.accountCode AS gl2AccountCode,
                                        gl3.id AS gl3ID,gl3.accountCode AS gl3AccountCode
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
                        $sqlvat = "SELECT startRangeCode,endRangeCode 
                            FROM gl_account 
                            WHERE id = (SELECT VatPosting_gl_account 
                                            FROM financial_settings
                                            WHERE company_id='" . $this->arrUser['company_id'] . "')";
                    }
                    
                    $RSV = $this->objsetup->CSI($sqlvat);
                    
                    if ($RSV->RecordCount() > 0) {
                        while ($RowVat = $RSV->FetchRow()) {
                            foreach ($RowVat as $key => $value) {
                                if (is_numeric($key))
                                    unset($RowVat[$key]);
                            }

                            if($this->arrUser['company_id'] == 133){
                                $Row['vatRange']['gl1AccountCode'] = $RowVat['gl1AccountCode'];
                                $Row['vatRange']['gl2AccountCode'] = $RowVat['gl2AccountCode'];
                                $Row['vatRange']['gl3AccountCode'] = $RowVat['gl3AccountCode'];
                            }
                            else{ 
                                //  print_r($RowVat);
                                $Row['vatRange']['startRangeCode'] = $RowVat['startRangeCode'];
                                $Row['vatRange']['endRangeCode'] = $RowVat['endRangeCode'];
                            }
                        }
                    }
                    
                }
                 
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        }
         else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }        
            
        $response['volume'] = $volume;
        $response['volume_unit'] = $volume_unit;
        $response['weight'] = $weight;
        $response['weightunit'] = $weightunit;
        $response['weight_permission'] = $weight_permission;
        $response['volume_permission'] = $volume_permission;

        // echo "<pre>";print_r($response); exit;
        return $response;
    }

    /* function getCurrentStockByInvoice($attr)
    {
        // echo "<pre>";print_r($attr); exit;
        $this->objGeneral->mysql_clean($attr);

        $Sql="SELECT SUM(aqty.Avail_qty) as prodQty 
              FROM SR_avaialbleQTY as aqty
              WHERE aqty.item_trace_unique_id='".$attr['item_trace_unique_id']."' AND
                    aqty.product_id ='" . $attr['product_id'] . "'";

        // echo $Sql."<hr>"; exit;
        
        $rs_count = $this->objsetup->CSI($Sql);

        if ($rs_count->RecordCount() > 0)
            $prodStock = $rs_count->fields['prodQty'];
        else
            $prodStock = 0;        
        return $prodStock;
    }  */

    // Debit Note Order line save 
    function saveDebitNoteLine($attr)
    { 
        // echo "<pre>";
        // print_r($attr);  
        // exit;    

        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['Parameter2'] = 'id:'.$attr['id'];
        $srLogTrace['ErrorMessage'] = "";

        $this->objsetup->SRTraceLogsPHP($srLogTrace);
    
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
         
        $item = $attr['item'];
        $allitemArray = $attr['itemDataArr'];
        // $allitemArray = $attr['itemArray'];
        $updateRec=0; 
        $selRecordID=0; 
        $this->objGeneral->mysql_clean($item);  

        $invoice_id = (isset($item->orderID) && $item->orderID!='')?$item->orderID:0;
        $supplier_id = (isset($item->supplier_id) && $item->supplier_id!='')?$item->supplier_id:'NULL';
        $selWarehousesid = (isset($item->warehouses->id) && $item->warehouses->id!='')?$item->warehouses->id:0;
        // $selWarehousesid = (isset($item->warehouses) && $item->warehouses!='')?$item->warehouses:0;
        $selProduct_id = (isset($item->product_id) && $item->product_id!='')?$item->product_id:0;
        // $selProduct_id = (isset($item->id) && $item->id!='')?$item->id:0;        

        foreach ($allitemArray as $item2) 
        {
            $this->objGeneral->mysql_clean($item2);
            // echo '<pre>';print_r($item2);exit;

            $update_id = $item2->update_id;
            $updateCHK = '';

            if($update_id>0)
                $updateCHK = ' AND tst.id!='.$update_id;              
            
            $unit_measure_id = (isset($item2->units->id) && $item2->units->id!='')?$item2->units->id:'NULL';
            $unit_qty = (isset($item2->units->quantity) && $item2->units->quantity!='')?$item2->units->quantity:0;
            $unit_parent_id = (isset($item2->units->parent_id) && $item2->units->parent_id!='')?$item2->units->parent_id:0;
            $unit_measure = (isset($item2->units->name) && $item2->units->name!='')?$item2->units->name:0;
            $conv_unit_price = (isset($item2->conv_unit_price) && $item2->conv_unit_price!='')?$item2->conv_unit_price:0;
            $purchase_unit_id = (isset($item2->purchase_unit_id) && $item2->purchase_unit_id!='')?$item2->purchase_unit_id:0;
            $discount_type_id = (isset($item2->discount_type_id->id) && $item2->discount_type_id->id!='')?$item2->discount_type_id->id:0;
            $discount = (isset($item2->discount) && $item2->discount!='')? Round($item2->discount,2):0;            
            
            // $warehousesid = (isset($item->warehouses->id) && $item->warehouses->id!='')?$item->warehouses->id:0;
            /* $warehousesid = (isset($item2->warehouses) && $item2->warehouses!='')?$item2->warehouses:0;
            $warehousesname = (isset($item2->warehouse_name) && $item2->warehouse_name!='')?$item2->warehouse_name:0; */
            // $warehousesname = (isset($item->warehouses->name) && $item->warehouses->name!='')?$item->warehouses->name:0;

            // $warehousesid = (isset($item2->warehouse_id) && $item2->warehouse_id!='')?$item2->warehouse_id:0;
            // $warehousesname = (isset($item2->warehouse_name) && $item2->warehouse_name!='')?$item2->warehouse_name:0;

            $warehousesid = (isset($item2->warehouses->id) && $item2->warehouses->id!='')?$item2->warehouses->id:0;
            $warehousesname = (isset($item2->warehouses->name) && $item2->warehouses->name!='')?$item2->warehouses->name:0;

            $total_price = (isset($item2->total_price) && $item2->total_price!='')?$item2->total_price:0;

            $stock_check = (isset($item2->stock_check) && $item2->stock_check!='')?$item2->stock_check:0;
            $category_id = (isset($item2->category_id) && $item2->category_id!='')?$item2->category_id:0;
            $sale_unit_id = (isset($item2->sale_unit_id) && $item2->sale_unit_id!='')?$item2->sale_unit_id:0;
            $primary_unit_of_measure_id = (isset($item2->primary_unit_of_measure_id) && $item2->primary_unit_of_measure_id!='')?$item2->primary_unit_of_measure_id:0;

            $vatsid = (isset($item2->vats->id) && $item2->vats->id!='')?$item2->vats->id:0;
            $vat_name = (isset($item2->vats->name) && $item2->vats->name!='')?$item2->vats->name:0;
            $vat_value = (isset($item2->vats->vat_value) && $item2->vats->vat_value!='')?$item2->vats->vat_value:0;
            
            $qty = (isset($item2->qty) && $item2->qty!='')?$item2->qty:0;
            $unit_price = (isset($item2->standard_price) && $item2->standard_price!='')?round($item2->standard_price,5):0;//$item2->standard_price
            $actualPrice = (isset($item2->actualPrice) && $item2->actualPrice!='')?$item2->actualPrice:0;
            
            $selItemChk = (isset($item2->chk) && $item2->chk!='')?$item2->chk:0;
            $update_id = (isset($item2->update_id) && $item2->update_id!='')?$item2->update_id:0; 
            $prdInvQty = (isset($item2->prdInvQty) && $item2->prdInvQty!='')?$item2->prdInvQty:0; 
            // $prdInvQty  = ($item->prdInvQty != '') ? $item->prdInvQty : '0';            

            if($update_id>0){
                $Sql = "UPDATE srm_order_return_detail
                                SET
                                    supplier_id=" . $supplier_id . ",
                                    prdInvQty='" .$prdInvQty . "',
                                    product_name='" .$item2->product_name . "',
                                    qty='" .$item2->qty . "',
                                    unit_price='" .$unit_price . "',
                                    actualPrice='" .$actualPrice . "',
                                    vat='" . $vat_name . "',
                                    vat_id='" . $vatsid . "',
                                    vat_value='" . $vat_value . "',
                                    total_price='" .$total_price . "',                                    
                                    discount_type='" . $discount_type_id . "',
                                    discount='" .$discount . "',
                                    sale_unit_id='" .$sale_unit_id . "',
                                    warehouse_id='" . $warehousesid . "',
                                    warehouse='" . $warehousesname . "',
                                    stock_check='" .$stock_check . "',
                                    ChangedBy='" . $this->arrUser['id'] . "',
                                    ChangedOn=UNIX_TIMESTAMP (NOW())
                                    WHERE id=".$update_id." ";

                //  echo $Sql;exit; 

                /* unit_measure='" . $unit_measure . "',
                                    unit_measure_id='" . $unit_measure_id . "',
                                    unit_qty='" . $unit_qty . "',
                                    unit_parent_id='" . $unit_parent_id . "',
                                    cat_id='" .$category_id . "',
                                    primary_unit_of_measure_name ='" .$item2->primary_unit_of_measure_name . "',
                                    primary_unit_of_measure_id ='" .$primary_unit_of_measure_id  . "', */
                // $RS = $this->objsetup->CSI($Sql);
                $RS = $this->objsetup->CSI($Sql, 'purchase_return', sr_AddEditPermission);
                // $updateCHK2 = true;
                        
            }
            // exit;

            if ($update_id > 0){
                $updateRec++;

                if($selItemChk>1){
                    $selRecordID = $update_id;
                }                    
            }
        } 
            
        if ($update_id > 0){
            
            require_once(SERVER_PATH . "/classes/Warehouse.php");
            $this->objWarehouse = new Warehouse($this->arrUser);

            $attr['wrh_id'] = $selWarehousesid;
            $attr['prod_id'] = $selProduct_id;
            $response['orderLineID'] = $selRecordID;

            $response['storage_loc'] = $this->objWarehouse->get_sel_warehouse_loc_in_stock_alloc($attr);

            $attr['warehouses_id'] = $selWarehousesid;
            $attr['product_id'] = $selProduct_id;
            $attr['supplier_id'] = $supplier_id;
            $attr['invoice_id'] = $invoice_id;
            $attr['type_id'] = 1;// 1 for purchase order and 2 for sale order.

            $response['stockAlloc'] = $this->getAllStockAllocation($attr);

            $response['ack'] = 1;
            $response['allitemArray'] = $allitemArray;
            $response['error'] = NULL;
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);

        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated'; 

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record is Not updated!';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }  
        return $response;
    }

    // Debit Note Order line Insert New Line 
    function insertDebitNoteNewOrderLine($attr)
    { 
        // echo "<pre>";
        // print_r($attr);  
        // exit;
        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['Parameter2'] = 'id:'.$attr['id'];
        $srLogTrace['ErrorMessage'] = "";

        $this->objsetup->SRTraceLogsPHP($srLogTrace);
        
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;        
        $tempOrderData = $attr['tempOrderData'];
        $tempOrderLineitemsArray = $attr['tempOrderLineitems'];

        $updateRec=0; 
        $selRecordID=0; 

        $invoice_id = (isset($tempOrderData->orderID) && $tempOrderData->orderID!='')?$tempOrderData->orderID:'NULL';
        $supplier_id = (isset($tempOrderData->supplier_id) && $tempOrderData->supplier_id!='')?$tempOrderData->supplier_id:'NULL';
        $selWarehousesid = (isset($tempOrderData->warehouses->id) && $tempOrderData->warehouses->id!='')?$tempOrderData->warehouses->id:'NULL';
        $selProduct_id = (isset($tempOrderData->type_id) && $tempOrderData->type_id!='')?$tempOrderData->type_id:'NULL';

        foreach ($tempOrderLineitemsArray as $item2) 
        {
            $this->objGeneral->mysql_clean($item2);

            $max_quantity = (isset($item2->max_quantity) && $item2->max_quantity!='')?$item2->max_quantity:0;
            $min_quantity = (isset($item2->min_quantity) && $item2->min_quantity!='')?$item2->min_quantity:0;
            $unit_measure_id = (isset($item2->units->id) && $item2->units->id!='')?$item2->units->id:'NULL';
            $unit_qty = (isset($item2->units->quantity) && $item2->units->quantity!='')?$item2->units->quantity:0;
            $unit_parent_id = (isset($item2->units->parent_id) && $item2->units->parent_id!='')?$item2->units->parent_id:0;
            $unit_measure = (isset($item2->units->name) && $item2->units->name!='')?$item2->units->name:'';
            $conv_unit_price = (isset($item2->conv_unit_price) && $item2->conv_unit_price!='')?$item2->conv_unit_price:0;
            $purchase_unit_id = (isset($item2->purchase_unit_id) && $item2->purchase_unit_id!='')?$item2->purchase_unit_id:0;
            $discount_type_id = (isset($item2->discount_type_id->id) && $item2->discount_type_id->id!='')?$item2->discount_type_id->id:0;
            $discount = (isset($item2->discount) && $item2->discount!='')? Round($item2->discount,2):0;
            $total_price = (isset($item2->total_price) && $item2->total_price!='')? Round($item2->total_price,2):0;
            $category_id = (isset($item2->category_id) && $item2->category_id!='')?$item2->category_id:0;
            $sale_unit_id = (isset($item2->sale_unit_id) && $item2->sale_unit_id!='')?$item2->sale_unit_id:0;
            $primary_unit_of_measure_id = (isset($item2->primary_unit_of_measure_id) && $item2->primary_unit_of_measure_id!='')?$item2->primary_unit_of_measure_id:0;

            $costing_method_id = (isset($item2->costing_method_id) && $item2->costing_method_id!='')?$item2->costing_method_id:0;
            
            $vatsid = (isset($item2->vats->id) && $item2->vats->id!='')?$item2->vats->id:0;
            
            $vat_name = (isset($item->vats->name) && $item->vats->name!='')?$item->vats->name:0;
            $vat_value = (isset($item2->vats->vat_value) && $item2->vats->vat_value!='')?$item2->vats->vat_value:0;
            // $warehousesid = (isset($item2->warehouses->id) && $item2->warehouses->id!='')?$item2->warehouses->id:0;
            // $warehousesname = (isset($item2->warehouses->name) && $item2->warehouses->name!='')?$item2->warehouses->name:0;

            $warehousesid = (isset($item2->warehouse_id) && $item2->warehouse_id!='')?$item2->warehouse_id:0;
            $warehousesname = (isset($item2->warehouse) && $item2->warehouse!='')?$item2->warehouse:0;

            $qty = (isset($item2->qty) && $item2->qty!='')?$item2->qty:0;
            $unit_price = (isset($item2->standard_price) && $item2->standard_price!='')?round($item2->standard_price,5):0;//$item2->standard_price
            $actualPrice = (isset($item2->actualPrice) && $item2->actualPrice!='')? Round($item2->actualPrice,2):0;
            $stock_check = (isset($item2->stock_check) && $item2->stock_check!='')?$item2->stock_check:0;
            $descriptionID = (isset($item2->descriptionID) && $item2->descriptionID!='')?$item2->descriptionID:0;
            $item_type = (isset($item2->item_type) && $item2->item_type!='')?$item2->item_type:0;

            $invoiceDetailID = (isset($item2->invoiceDetailID) && $item2->invoiceDetailID!='')?$item2->invoiceDetailID:0;

            if($item_type==2){
                $unit_measure_id = (isset($item2->uomID) && $item2->uomID!='')?$item2->uomID:'NULL'; 
                $unit_measure = (isset($item->uom) && $item->uom!='')?$item->uom:'';              
            }  

            if($item_type==0){
                
                $max_quantity = (isset($item2->maxPurchaseQty) && $item2->maxPurchaseQty!='')?$item2->maxPurchaseQty:0;
                $min_quantity = (isset($item2->minPurchaseQty) && $item2->minPurchaseQty!='')?$item2->minPurchaseQty:0;                          
            }          

            $selItemChk = (isset($item2->chk) && $item2->chk!='')?$item2->chk:0;

            $rawMaterialProduct = (isset($item2->rawMaterialProduct) && $item2->rawMaterialProduct!='')?$item2->rawMaterialProduct:0;
            $raw_material_gl_id = (isset($item2->raw_material_gl_id) && $item2->raw_material_gl_id!='')?$item2->raw_material_gl_id:0;

            /* ==================== */
            $prdInvQty = (isset($item2->prdInvQty) && $item2->prdInvQty!='')?$item2->prdInvQty:0; 
            $product_id = (isset($item2->product_id) && $item2->product_id!='')?$item2->product_id:'NULL'; 
        
            // $update_id = (isset($item->update_id) && $item->update_id!='')?$item->update_id:0; 
            // $prdInvQty  = ($item->prdInvQty != '') ? $item->prdInvQty : '0';            

            $SqlQuote = "INSERT INTO srm_order_return_detail
                                        SET
                                            stock_check='" .$stock_check . "',
                                            product_id=" .$product_id . ",
                                            product_name='" .$item2->product_name . "',
                                            product_code='" .$item2->product_code . "',
                                            prdInvQty='" .$prdInvQty . "',
                                            qty='" .$item2->qty . "',                                              
                                            unit_measure='" . $unit_measure . "',
                                            unit_measure_id=" . $unit_measure_id . ",
                                            unit_parent_id='" . $unit_parent_id . "',
                                            unit_qty='" . $unit_qty . "',                                              
                                            warehouse_id='" . $warehousesid . "',
                                            warehouse='" . $warehousesname . "',
                                            discount_type='" . $discount_type_id . "',
                                            discount='" .$discount . "',
                                            unit_price='" .$unit_price . "',
                                            actualPrice='" .$actualPrice . "',
                                            total_price='" .$total_price . "',
                                            vat='" . $vat_name . "',
                                            vat_id='" . $vatsid . "',
                                            vat_value='" . $vat_value . "',
                                            cat_id='" .$category_id . "',
                                            type='" .$item2->item_type . "',
                                            sale_unit_id='" .$sale_unit_id . "',
                                            primary_unit_of_measure_name ='" .$item2->primary_unit_of_measure_name . "',
                                            primary_unit_of_measure_id ='" .$primary_unit_of_measure_id . "',
                                            supplier_id=" . $supplier_id . ",
                                            invoice_id=" . $invoice_id . ",
                                            costing_method_id=" . $costing_method_id . ", 
                                            rawMaterialProduct='" .$rawMaterialProduct . "',                                            
                                            raw_material_gl_id='" .$raw_material_gl_id . "', 
                                            raw_material_gl_code='" .$item2->raw_material_gl_code . "',
                                            raw_material_gl_name='" .$item2->raw_material_gl_name . "', 
                                            srm_invoice_detail='" . $invoiceDetailID . "',
                                            debitNoteCode='" . $item2->invoice_code. "',
                                            user_id='" . $this->arrUser['id'] . "', 
                                            company_id='" . $this->arrUser['company_id'] . "',
                                            AddedBy='" . $this->arrUser['id'] . "',
                                            AddedOn=UNIX_TIMESTAMP (NOW())";
            
            // echo $SqlQuote;exit;
            // $RS = $this->objsetup->CSI($SqlQuote);
            $RS = $this->objsetup->CSI($SqlQuote, 'purchase_return', sr_AddPermission);

            $update_id = $this->Conn->Insert_ID(); 
            $item2->update_id = $update_id;  
            $item2->id = $update_id;  
            // exit; 

            if ($update_id > 0){
                $updateRec++;

                if($selItemChk>1){
                    $selRecordID = $update_id;
                }                    
            }
        }
            
        if ($updateRec > 0){
            $response['ack'] = 1;
            $response['allitemArray'] = $tempOrderLineitemsArray;
            $response['error'] = NULL;
            
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record is Not updated!';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }  
        return $response;
    } 

    function nousefunction(){
        foreach ($allitemArray as $item2) 
        {
            $update_id = $item2->update_id;
            $updateCHK = '';

            if($update_id>0)
                $updateCHK = ' AND tst.id!='.$update_id;   
         
            $unit_measure_id = (isset($item2->units->id) && $item2->units->id!='')?$item2->units->id:0;
            $unit_qty = (isset($item2->units->quantity) && $item2->units->quantity!='')?$item2->units->quantity:0;
            $unit_parent_id = (isset($item2->units->parent_id) && $item2->units->parent_id!='')?$item2->units->parent_id:0;
            $unit_measure = (isset($item2->units->name) && $item2->units->name!='')?$item2->units->name:0;
            $conv_unit_price = (isset($item2->conv_unit_price) && $item2->conv_unit_price!='')?$item2->conv_unit_price:0;
            $purchase_unit_id = (isset($item2->purchase_unit_id) && $item2->purchase_unit_id!='')?$item2->purchase_unit_id:0;
            $discount_type_id = (isset($item2->discount_type_id->id) && $item2->discount_type_id->id!='')?$item2->discount_type_id->id:0;
            $discount = (isset($item2->discount) && $item->discount!='')? Round($item2->discount,2):0;            
            
            $warehousesid = (isset($item2->warehouses->id) && $item2->warehouses->id!='')?$item2->warehouses->id:0;
            $warehousesname = (isset($item2->warehouses->name) && $item2->warehouses->name!='')?$item2->warehouses->name:0;
            $total_price = (isset($item2->total_price) && $item2->total_price!='')? Round($item2->total_price,2):0;

            $stock_check = (isset($item2->stock_check) && $item2->stock_check!='')?$item2->stock_check:0;
            $category_id = (isset($item2->category_id) && $item2->category_id!='')?$item2->category_id:0;
            $sale_unit_id = (isset($item2->sale_unit_id) && $item2->sale_unit_id!='')?$item2->sale_unit_id:0;
            $primary_unit_of_measure_id = (isset($item2->primary_unit_of_measure_id) && $item2->primary_unit_of_measure_id!='')?$item2->primary_unit_of_measure_id:0;

            $vatsid = (isset($item2->vats->id) && $item2->vats->id!='')?$item2->vats->id:0;
            $vat_value = (isset($item2->vats->vat_value) && $item2->vats->vat_value!='')?$item2->vats->vat_value:0;
            
            $qty = (isset($item2->qty) && $item2->qty!='')?$item2->qty:0;
            $unit_price = (isset($item2->standard_price) && $item2->standard_price!='')?round($item2->standard_price,5):0;//$item2->standard_price
            
            $selItemChk = (isset($item2->chk) && $item2->chk!='')?$item2->chk:0;
            $update_id = (isset($item2->update_id) && $item2->update_id!='')?$item2->update_id:0; 

            
            if ($update_id > 0){
                $updateRec++;

                //$item2->update_id=$update_id;

                // echo "===".$selItemChk."####".$update_id."####".$item2->product_name;

                // if($selWarehousesid == $warehousesid && $selProduct_id==$item2->id){
                if($selItemChk>1){
                    $selRecordID = $update_id;
                }                    
            }
        } 
    }

    function update_sublist_return($attr)
    {
        //$this->objGeneral->mysql_clean($attr);
        // echo "<pre>";
        // print_r($attr['items']);
        // exit;

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

        $invoice_id = (isset($attr['invoice_id']) && $attr['invoice_id']!='')?$attr['invoice_id']:'NULL';
        $mode = (isset($attr['mode']) && $attr['mode']!='')?$attr['mode']:0;

        $net_amount = (isset($attr['net_amount']) && $attr['net_amount']!='')? Round($attr['net_amount'],2):0;
        $grand_total = (isset($attr['grand_total']) && $attr['grand_total']!='')? Round($attr['grand_total'],2):0;
        $tax_amount = (isset($attr['tax_amount']) && $attr['tax_amount']!='')? Round($attr['tax_amount'],2):0;
        $tax_rate = (isset($attr['tax_rate']) && $attr['tax_rate']!='')?$attr['tax_rate']:0;

        $net_amount_converted = (isset($attr['net_amount_converted']) && $attr['net_amount_converted']!='')? Round($attr['net_amount_converted'],2):0;
        $grand_total_converted = (isset($attr['grand_total_converted']) && $attr['grand_total_converted']!='')? Round($attr['grand_total_converted'],2):0;
        $tax_amount_converted = (isset($attr['tax_amount_converted']) && $attr['tax_amount_converted']!='')? Round($attr['tax_amount_converted'],2):0;
        $items_net_total = (isset($attr['items_net_total']) && $attr['items_net_total']!='')? Round($attr['items_net_total'],2):0;
        $items_net_discount = (isset($attr['items_net_discount']) && $attr['items_net_discount']!='')? Round($attr['items_net_discount'],2):0;
        $items_net_vat = (isset($attr['items_net_vat']) && $attr['items_net_vat']!='')? Round($attr['items_net_vat'],2):0;

        $this->objGeneral->mysql_clean($attr['note']);

        $Sql = "UPDATE srm_order_return 
                        SET 
                            net_amount='$net_amount', 
                            grand_total='$grand_total', 
                            tax_amount='$tax_amount',
                            tax_rate='$tax_rate',
                            note='".$attr['note']."',
                            net_amount_converted='$net_amount_converted', 
                            grand_total_converted='$grand_total_converted',
                            tax_amount_converted='$tax_amount_converted',
                            items_net_total='$items_net_total',
                            items_net_discount='$items_net_discount',
                            items_net_vat='$items_net_vat' 
                        WHERE id = $invoice_id 
                        limit 1";
        // echo    $Sql ;exit;
        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, 'purchase_return', sr_AddEditPermission);


        $chk = false;
        $updateCHK2 = false;

        foreach ($attr['items'] as $item) 
        {
            $this->objGeneral->mysql_clean($item);
             
            $unit_measure_id = (isset($item->units->id) && $item->units->id!='')?$item->units->id:'NULL';
            $unit_qty = (isset($item->units->quantity) && $item->units->quantity!='')?$item->units->quantity:0;
            $unit_parent_id = (isset($item->units->parent_id) && $item->units->parent_id!='')?$item->units->parent_id:0;
            $unit_measure = (isset($item->units->name) && $item->units->name!='')?$item->units->name:'';
            $conv_unit_price = (isset($item->conv_unit_price) && $item->conv_unit_price!='')? Round($item->conv_unit_price,2):0;
            $purchase_unit_id = (isset($item->purchase_unit_id) && $item->purchase_unit_id!='')?$item->purchase_unit_id:0;
            $discount_type_id = (isset($item->discount_type_id->id) && $item->discount_type_id->id!='' && $item->discount_type_id->id!='None')?$item->discount_type_id->id:0;
            $discount = (isset($item->discount) && $item->discount!='')? Round($item->discount,2):0;
            $stock_check = (isset($item->stock_check) && $item->stock_check!='')?$item->stock_check:0;
            $category_id = (isset($item->category_id) && $item->category_id!='')?$item->category_id:0;
            $sale_unit_id = (isset($item->sale_unit_id) && $item->sale_unit_id!='')?$item->sale_unit_id:0;
            $primary_unit_of_measure_id = (isset($item->primary_unit_of_measure_id) && $item->primary_unit_of_measure_id!='')?$item->primary_unit_of_measure_id:0;

            $total_price = (isset($item->total_price) && $item->total_price!='')? Round($item->total_price,2):0;
            // $warehousesid = (isset($item->warehouses) && $item->warehouses!='')?$item->warehouses:0;
            // // $warehousesname = (isset($item->warehouses->name) && $item->warehouses->name!='')?$item->warehouses->name:0;
            // $warehousesname = (isset($item->warehouse) && $item->warehouse!='')?$item->warehouse:0;

            
            $warehousesid = (isset($item->warehouses->id) && $item->warehouses->id!='')?$item->warehouses->id:0;
            $warehousesname = (isset($item->warehouses->name) && $item->warehouses->name!='')?$item->warehouses->name:0;

            $vat_id = (isset($item->vats->id) && $item->vats->id!='')?$item->vats->id:0;
            $vat = (isset($item->vats->name) && $item->vats->name!='')?$item->vats->name:0;
            $vat_value = (isset($item->vats->vat_value) && $item->vats->vat_value!='')?$item->vats->vat_value:0;                     

            $update_id = (isset($item->update_id) && $item->update_id!='')?$item->update_id:0;                
            $unit_price = (isset($item->standard_price) && $item->standard_price!='')? Round($item->standard_price,5):0;
            $actualPrice = (isset($item->actualPrice) && $item->actualPrice!='')? Round($item->actualPrice,2):0;

            $vat_price = (isset($item->vat_price) && $item->vat_price!='')? Round($item->vat_price,2):0;
            $discount_price = (isset($item->discount_price) && $item->discount_price!='')? Round($item->discount_price,2):0;
            $prdInvQty = (isset($item->prdInvQty) && $item->prdInvQty!='')?$item->prdInvQty:0;

            // $srm_invoice_detailID = (isset($item->id) && $item->id!='')?$item->id:0;
            $srm_invoice_detailID = (isset($item->invoiceDetailID) && $item->invoiceDetailID!='')?$item->invoiceDetailID:0;
            $product_id = (isset($item->product_id) && $item->product_id!='')?$item->product_id :'NULL';
            $supplier_id = (isset($attr['supplier_id']) && $attr['supplier_id']!='')?$attr['supplier_id']:'NULL';


            // $vat_price       = ($item->vat_price != '') ? $item->vat_price : '0';
            // $discount_price  = ($item->discount_price != '') ? $item->discount_price : '0';              
            // $prdInvQty  = ($item->prdInvQty != '') ? $item->prdInvQty : '0';             

            if($update_id>0){
                $Sql = "UPDATE srm_order_return_detail
                                SET
                                    supplier_id=" . $supplier_id . ",
                                    product_name='" .$item->product_name . "',
                                    prdInvQty='" .$prdInvQty . "',
                                    qty='" .$item->qty . "',
                                    unit_price='" .$unit_price . "',
                                    actualPrice='" .$actualPrice . "',
                                    vat='" . $vat . "',
                                    vat_id='" . $vat_id . "',
                                    vat_value='" . $vat_value . "',
                                    total_price='" .$total_price . "',
                                    unit_measure='" . $unit_measure . "',
                                    unit_measure_id=" . $unit_measure_id . ",
                                    unit_qty='" . $unit_qty . "',
                                    unit_parent_id='" . $unit_parent_id . "',
                                    cat_id='" .$category_id . "',
                                    discount_type='" . $discount_type_id . "',
                                    discount='" .$discount . "',
                                    discount_price='$discount_price',
                                    vat_price=" . $vat_price . ",
                                    sale_unit_id='" .$sale_unit_id . "',
                                    warehouse_id='" . $warehousesid . "',
                                    warehouse='" . $warehousesname . "',
                                    primary_unit_of_measure_name ='" .$item->primary_unit_of_measure_name . "',
                                    primary_unit_of_measure_id ='" .$primary_unit_of_measure_id  . "',
                                    stock_check='" .$stock_check . "',
                                    ChangedBy='" . $this->arrUser['id'] . "',
                                    ChangedOn=UNIX_TIMESTAMP (NOW())
                                    WHERE id=$update_id";
    
                // echo $Sql;exit; 
                // $RS = $this->objsetup->CSI($Sql);
                $RS = $this->objsetup->CSI($Sql, 'purchase_return', sr_AddEditPermission);
                $updateCHK2 = true;
                
            }else{
                $SqlQuote = "INSERT INTO srm_order_return_detail
                                        SET
                                            stock_check='" .$stock_check . "',
                                            product_id=" .$product_id . ",
                                            product_name='" .$item->product_name . "',
                                            prdInvQty='" .$prdInvQty . "',
                                            product_code='" .$item->product_code . "',
                                            qty='" .$item->qty . "',                                              
                                            unit_measure='" . $unit_measure . "',
                                            unit_measure_id=" . $unit_measure_id . ",
                                            unit_parent_id='" . $unit_parent_id . "',
                                            unit_qty='" . $unit_qty . "',                                              
                                            warehouse_id='" . $warehousesid . "',
                                            warehouse='" . $warehousesname . "',
                                            discount_type='" . $discount_type_id . "',
                                            discount='" .$discount . "',
                                            discount_price='$discount_price',
                                            vat_price=" . $vat_price . ",
                                            unit_price='" .$unit_price . "',
                                            actualPrice='" .$actualPrice . "',
                                            total_price='" .$total_price . "',
                                            vat='" . $vat . "',
                                            vat_id='" . $vat_id . "',
                                            vat_value='" . $vat_value . "',
                                            cat_id='" .$category_id . "',
                                            type='" .$item->item_type . "',
                                            sale_unit_id='" .$sale_unit_id . "',
                                            primary_unit_of_measure_name ='" .$item->primary_unit_of_measure_name . "',
                                            primary_unit_of_measure_id ='" .$primary_unit_of_measure_id . "',
                                            supplier_id=" . $supplier_id . ",
                                            invoice_id=" . $invoice_id . ",
                                            srm_invoice_detail='" . $srm_invoice_detailID . "',
                                            debitNoteCode='" . $attr['debitNoteCode'] . "',
                                            user_id='" . $this->arrUser['id'] . "', 
                                            company_id='" . $this->arrUser['company_id'] . "',
                                            AddedBy='" . $this->arrUser['id'] . "',
                                            AddedOn=UNIX_TIMESTAMP (NOW())";
            
                //  echo $SqlQuote;exit;
                // $RS = $this->objsetup->CSI($SqlQuote);
                $RS = $this->objsetup->CSI($SqlQuote, 'purchase_return', sr_AddPermission);

                $lastInsertid = $this->Conn->Insert_ID();
            } 
            
            if ($this->Conn->Affected_Rows() > 0){
                $item->orderLineID = $lastInsertid; 

                if(!($update_id>0)) $update_id = $lastInsertid;

                if($srm_invoice_detailID >0 && $item->item_type == 0 && $stock_check == 0){                

                    $Purchase_SQL = "SELECT wh.item_trace_unique_id,wh.id AS whID,wh.product_id,wh.batch_no,wh.bl_shipment_no,
                                            wh.container_no,COALESCE(wh.date_received,0) AS date_received,COALESCE(wh.prod_date,0) AS prod_date,
                                            COALESCE(wh.use_by_date,0) AS use_by_date,COALESCE(wh.date_receivedUnConv,0) AS date_receivedUnConv
                                     FROM srm_invoice_detail as sid,warehouse_allocation as wh 
                                     where sid.id = $srm_invoice_detailID AND
                                           wh.order_id = sid.invoice_id AND 
                                           wh.purchase_order_detail_id = sid.id AND  
                                           wh.purchase_return_status = 0 AND 
                                           sid.company_id ='" . $this->arrUser['company_id'] . "'";

                    //  echo $Purchase_SQL;//exit;                                       
                                            
                    $RS = $this->objsetup->CSI($Purchase_SQL);

                    if ($RS->RecordCount() > 0) {
                        while ($Row = $RS->FetchRow()) {
                            $ref_po_id   = $Row['whID'];
                            $item_trace_unique_id   = $Row['item_trace_unique_id'];
                            $product_id   = $Row['product_id'];
                            $batch_no   = $Row['batch_no'];
                            $bl_shipment_no   = $Row['bl_shipment_no'];
                            $container_no   = $Row['container_no'];
                            $date_received   = $Row['date_received'];
                            $prod_date   = $Row['prod_date'];
                            $use_by_date   = $Row['use_by_date'];

                            if($date_received>0)
                                $date_receivedUnConv = "'".$Row['date_receivedUnConv']."'";
                            else
                                $date_receivedUnConv = 'NULL';
                        }  

                        $duplicate_SQL = "SELECT id 
                                          FROM warehouse_allocation 
                                          where order_id = '$invoice_id' and 
                                                supplier_id = '$supplier_id' and
                                                purchase_return_status = 1 AND
                                                purchase_order_detail_id='$update_id' AND
                                                ref_po_id='$ref_po_id' AND 
                                                item_trace_unique_id='" . $item_trace_unique_id . "' AND
                                                product_id = '$product_id'";

                        // echo $duplicate_SQL;exit;                                                
                                                
                        $RS = $this->objsetup->CSI($duplicate_SQL);

                        if ($RS->RecordCount() > 0) {
                            while ($Row = $RS->FetchRow()) {
                                $wa_id = $Row['id'];
                            }  
                        } 
                               

                        if($wa_id >0){ 
                            $Sql = "UPDATE warehouse_allocation 
                                                        SET
                                                            quantity = '$item->qty',
                                                            remaining_qty = '$item->qty',
                                                            ChangedBy='" . $this->arrUser['id'] . "',
                                                            ChangedOn='" . current_date . "'
                                    WHERE   ref_po_id='$ref_po_id' AND 
                                            supplier_id='$supplier_id' AND 
                                            product_id='$product_id' AND 
                                            order_id = '$invoice_id' AND 
                                            purchase_return_status = 1 AND
                                            item_trace_unique_id='" . $item_trace_unique_id . "' AND
                                            purchase_order_detail_id='$update_id' AND
                                            type='1'";          
                        }
                        else
                        {        
                            $Sql = "INSERT INTO warehouse_allocation 
                                                        SET 
                                                            batch_no='$batch_no',
                                                            purchase_order_detail_id='$update_id', 
                                                            warehouse_id='$warehousesid', 
                                                            supplier_id='$supplier_id', 
                                                            bl_shipment_no='$bl_shipment_no',
                                                            container_no='$container_no',
                                                            date_received='" . $date_received . "',
                                                            date_receivedUnConv = " . $date_receivedUnConv . ",                                                            
                                                            order_id='$invoice_id',
                                                            product_id='$product_id',
                                                            status=1,
                                                            quantity='$item->qty',
                                                            remaining_qty = '$item->qty',
                                                            unit_measure_id='" . $unit_measure_id. "',
                                                            unit_measure_qty=1,
                                                            unit_measure_name='" . $unit_measure . "',
                                                            primary_unit_id='" . $primary_unit_of_measure_id . "',
                                                            primary_unit_qty='1',
                                                            primary_unit_name='" . $item->primary_unit_of_measure_name . "',
                                                            order_date='" . current_date. "',
                                                            type=1,
                                                            ref_po_id='$ref_po_id',
                                                            company_id='" . $this->arrUser['company_id'] . "',
                                                            user_id='" . $this->arrUser['id'] . "',
                                                            item_trace_unique_id='" . $item_trace_unique_id . "',
                                                            purchase_return_status =1,
                                                            purchase_status =1,
                                                            AddedBy='" . $this->arrUser['id'] . "',
                                                            AddedOn='" . current_date . "'";            
                        }
                        /* 
                                                            prod_date='" . $prod_date . "',
                                                            use_by_date='" . $use_by_date . "', */

                        // echo $Sql; exit;
                        $RS = $this->objsetup->CSI($Sql);
                    } 
                }

                $chk = true;
            }                    
            else
                $chk = false; 
          
        }

        if($mode>0){

            $Sql3 = "UPDATE warehouse_allocation	
                                    SET 
                                        purchase_status=2
                                        WHERE order_id = $invoice_id AND 
                                            type = 1 ";
            // echo $Sql3;exit;
            // $RS3 = $this->objsetup->CSI($Sql3);
            $RS3 = $this->Conn->Execute($Sql3);

            $Sql5 = "UPDATE srm_order_return	
                                SET 
                                    purchaseStatus=2
                                    WHERE id = $invoice_id  
                                    Limit 1";
            // echo $Sql5;exit;
            // $RS5 = $this->objsetup->CSI($Sql5);
            $RS5 = $this->Conn->Execute($Sql5);

            $Sql4 = "UPDATE srm_order_return_detail 
                                    SET 
                                        purchase_status=2,
                                        ChangedBy='" . $this->arrUser['id'] . "',
                                        ChangedOn=UNIX_TIMESTAMP (NOW())  
                                    WHERE invoice_id = $invoice_id ";
            // echo $Sql4;exit;
            // $RS4 = $this->objsetup->CSI($Sql4);
            $RS4 = $this->objsetup->CSI($Sql4, 'purchase_return', sr_EditPermission);

            if(is_array($RS4) && $RS4['Error'] == 1){
                return $RS4;
            }
            else if (is_array($RS4) && $RS4['Access'] == 0){
                return $RS4;
            }
        }

        if ($chk) {
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

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }
        elseif($updateCHK2) {
            $response['ack'] = 2;
            $response['error'] = 'Record Updated Successfully';

            
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        } 
        else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record is Not updated!';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }
        return $response;
    }

    function getAllStockAllocation($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $where_clause = "";
        $response = array();
        if (!empty($attr['purchase_return_status']))
            $where_clause .= " AND purchase_return_status = 1 ";
        else
            $where_clause .= " AND purchase_return_status = 0 ";

        $Sql = "SELECT  c.* ,w.name as wname,
                        prd_wrh_loc.warehouse_loc_id as storage_loc_id,
                        pr.comm_book_in_no as consignment,
                        wrh_loc.title as location_title,
                        wrh_loc.bin_cost,
                        dim.title as dimtitle,
                        (select COALESCE(SUM(`w1`.`quantity`),0) 
                         From warehouse_allocation w1 
                         where w1.product_id='" . $attr['product_id'] . "' and
                               w1.supplier_id='" . $attr['supplier_id'] . "' and
                               w1.warehouse_id = '" . $attr['warehouses_id'] . "'and
                               w1.status=1 and 
                               w1.type='" . $attr['type_id'] . "' and
                               w1.purchase_return_status = 1 and
                               w1.company_id=" . $this->arrUser['company_id'] . ") as debitQty,
                        CASE  WHEN wrh_loc.cost_type_id = 1 THEN 'Fixed'
                              WHEN wrh_loc.cost_type_id = 2 THEN 'Daily'
                              WHEN wrh_loc.cost_type_id = 3 THEN 'Weekly'
                              WHEN wrh_loc.cost_type_id = 4 THEN 'Monthly'
                              WHEN wrh_loc.cost_type_id = 5 THEN 'Annually'
                              END AS cost_type
                From warehouse_allocation  c
                left JOIN product_warehouse_location as prd_wrh_loc on prd_wrh_loc.id=c.location
                left JOIN warehouse_bin_location as wrh_loc on wrh_loc.id=prd_wrh_loc.warehouse_loc_id
                left JOIN units_of_measure as dim on dim.id=wrh_loc.dimensions_id
                left JOIN warehouse w on w.id=c.warehouse_id
                left JOIN srm_invoice pr on pr.id=c.order_id AND c.type=1 AND c.purchase_return_status=0
                where  c.product_id='" . $attr['product_id'] . "' and
                       c.supplier_id='" . $attr['supplier_id'] . "' and
                       w.id = '" . $attr['warehouses_id'] . "' and
                       c.status=1 and c.type='" . $attr['type_id'] . "'
                       " . $where_clause . " and
                       c.company_id=" . $this->arrUser['company_id'] . "
                order by c.id ASC ";

        // echo $Sql;exit;
        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, 'purchase_order', sr_ViewPermission);

        

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];

                $result['warehouse'] = $Row['wname'];
                $result['WH_loc_id'] = $Row['location'];
                $result['storage_loc_id'] = $Row['storage_loc_id'];
                $result['warehouse_id'] = $Row['warehouse_id'];
                $result['location'] = $Row['location_title'] . " ( " . $Row['bin_cost'] . ", " . $Row['dimtitle'] . ", " . $Row['cost_type'] . ")";
                $result['container_no'] = $Row['container_no'];
                $result['consignment'] = $Row['consignment'];
                $result['batch_no'] = $Row['batch_no'];
                $result['purchase_return_status'] = $Row['purchase_return_status'];

                $result['prod_date'] = $this->objGeneral->convert_unix_into_date($Row['prod_date']);
                $result['date_received'] = $this->objGeneral->convert_unix_into_date($Row['date_received']);
                $result['use_by_date'] = $this->objGeneral->convert_unix_into_date($Row['use_by_date']);
                $result['quantity'] = $Row['quantity'];
                $result['debitQty'] = $Row['debitQty'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }

        /* 
        $response['orderLineID'] = $update_id;

            $response['storage_loc'] = $this->objWarehouse->get_sel_warehouse_loc_in_stock_alloc($attr);

            $attr['warehouses_id'] = $warehousesid;
            $attr['product_id'] = $item->id;
            $attr['supplier_id'] = $supplier_id;
            $attr['invoice_id'] = $invoice_id;//order_id
             */

        if (!empty($attr['purchase_return_status'])) {

            $sql_total_purchase_return = "SELECT  sum(quantity) as total  From warehouse_allocation  c 
                                            where  c.product_id=".$attr['product_id']."  and  c.status=1 and c.type=1 and
                                                   c.order_id=".$attr['orderLineID']." and 
                                                   c.warehouse_id=".$attr['warehouses_id']." and
                                                   c.purchase_return_status = 1  and 
                                                   c.company_id=" . $this->arrUser['company_id'] . " ";

            $rs_count_pr = $this->objsetup->CSI($sql_total_purchase_return);
            $response['total_pr'] = $rs_count_pr->fields['total'];

        }

        $sql_total = "SELECT  sum(quantity) as total  From warehouse_allocation  c 
                        where  c.product_id=".$attr['product_id']."  and  c.status=1 and c.type=1 and
                               c.order_id=".$attr['invoice_id']." and 
                               c.warehouse_id=".$attr['warehouses_id']." AND
                               c.purchase_return_status = 0 and 
                               c.company_id=" . $this->arrUser['company_id'] . " ";

        $rs_count = $this->objsetup->CSI($sql_total);
        $response['total'] = $rs_count->fields['total'];

        return $response;
    }

    function getDebitNoteItems($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();  

        /* $Sql = "SELECT od.*,wh.item_trace_unique_id
                FROM srm_invoice_detail AS od
                left join warehouse_allocation as wh on wh.order_id= od.invoice_id AND wh.type=1 AND wh.purchase_status IN(2,3) AND wh.purchase_return_status=0 
                WHERE  od.invoice_id = ".$attr['purchaseInvoiceID']." AND  od.type=0
                GROUP BY od.product_id";  */ 
        /* 
                                                                        wa.ref_po_id =od.invoice_id AND  */
        $Sql = "SELECT od.*,p.costing_method_id,
                            wh.item_trace_unique_id,
                            (CASE WHEN (od.stock_check>0) THEN (od.qty - COALESCE((SELECT SUM(wa.quantity)
                                                                                FROM warehouse_allocation AS wa  
                                                                                WHERE wa.item_trace_unique_id= wh.item_trace_unique_id AND
                                                                                        wa.product_id=od.product_id AND 
                                                                                        wa.warehouse_id=od.warehouse_id AND
                                                                                        wa.type =2 AND 
                                                                                        wa.sale_status >0 AND 
                                                                                        wa.sale_return_status = 0 ),0)
                                                                    + COALESCE((SELECT SUM(wa.quantity)
                                                                                FROM warehouse_allocation AS wa  
                                                                                WHERE wa.item_trace_unique_id= wh.item_trace_unique_id AND
                                                                                        wa.product_id=od.product_id AND 
                                                                                        wa.warehouse_id=od.warehouse_id AND
                                                                                        wa.type =2 AND 
                                                                                        wa.sale_return_status = 1 AND
                                                                                        wa.sale_status IN (2, 3)),0)
                                                                    - COALESCE((SELECT SUM(wa.quantity)
                                                                                FROM warehouse_allocation AS wa  
                                                                                WHERE wa.item_trace_unique_id= wh.item_trace_unique_id AND
                                                                                        wa.product_id=od.product_id AND 
                                                                                        wa.warehouse_id=od.warehouse_id AND
                                                                                        wa.type =3 AND 
                                                                                        wa.status = 1 AND 
                                                                                        wa.ledger_type = 2 AND
                                                                                        wa.journal_status >0),0)
                                                                    - COALESCE((SELECT SUM(wa.quantity)
                                                                                FROM warehouse_allocation AS wa  
                                                                                WHERE wa.item_trace_unique_id= wh.item_trace_unique_id AND
                                                                                        wa.product_id=od.product_id AND 
                                                                                        wa.warehouse_id=od.warehouse_id AND
                                                                                        wa.type =5 AND 
                                                                                        wa.status = 1 AND 
                                                                                        wa.ledger_type = 2 AND
                                                                                        wa.journal_status >0),0)
                                                                    - COALESCE((SELECT SUM(wa.quantity)
                                                                                FROM warehouse_allocation AS wa  
                                                                                WHERE   wa.item_trace_unique_id= wh.item_trace_unique_id AND
                                                                                        wa.product_id=od.product_id AND 
                                                                                        wa.warehouse_id=od.warehouse_id AND
                                                                                        wa.type =1 AND 
                                                                                        wa.raw_material_out = 1 AND 
                                                                                        wa.purchase_return_status = 0 AND
                                                                                        wa.purchase_status > 0 ),0)
                                                                                        
                                                                    - COALESCE((SELECT SUM(wa.quantity)
                                                                                FROM warehouse_allocation AS wa  
                                                                                WHERE wa.item_trace_unique_id= wh.item_trace_unique_id AND 
                                                                                        wa.product_id=od.product_id AND 
                                                                                        wa.warehouse_id=od.warehouse_id AND
                                                                                        wa.type =1 AND 
                                                                                        wa.purchase_return_status = 1 AND
                                                                                        wa.purchase_status > 0 ),0))
                                       
                                       WHEN (od.stock_check = 0) THEN (od.qty - COALESCE((SELECT SUM(wa.quantity)
                                                                                FROM warehouse_allocation AS wa  
                                                                                WHERE 
                                                                                        wa.item_trace_unique_id= wh.item_trace_unique_id AND
                                                                                        wa.product_id=od.product_id AND 
                                                                                        
                                                                                        wa.type =2 AND 
                                                                                        wa.sale_status >0 AND 
                                                                                        wa.sale_return_status = 0 ),0)
                                                                    + COALESCE((SELECT SUM(wa.quantity)
                                                                                FROM warehouse_allocation AS wa  
                                                                                WHERE 
                                                                                        wa.item_trace_unique_id= wh.item_trace_unique_id AND
                                                                                        wa.product_id=od.product_id AND 
                                                                                        
                                                                                        wa.type =2 AND 
                                                                                        wa.sale_return_status = 1 AND
                                                                                        wa.sale_status IN (2, 3)),0)
                                                                    - COALESCE((SELECT SUM(wa.quantity)
                                                                                FROM warehouse_allocation AS wa  
                                                                                WHERE 
                                                                                        wa.item_trace_unique_id= wh.item_trace_unique_id AND
                                                                                        wa.product_id=od.product_id AND 
                                                                                        
                                                                                        wa.type =3 AND 
                                                                                        wa.status = 1 AND 
                                                                                        wa.ledger_type = 2 AND
                                                                                        wa.journal_status >0),0)
                                                                    - COALESCE((SELECT SUM(wa.quantity)
                                                                                FROM warehouse_allocation AS wa  
                                                                                WHERE 
                                                                                        wa.item_trace_unique_id= wh.item_trace_unique_id AND
                                                                                        wa.product_id=od.product_id AND 
                                                                                        
                                                                                        wa.type =5 AND 
                                                                                        wa.status = 1 AND 
                                                                                        wa.ledger_type = 2 AND
                                                                                        wa.journal_status >0),0)

                                                                    - COALESCE((SELECT SUM(wa.quantity)
                                                                                FROM warehouse_allocation AS wa  
                                                                                WHERE   wa.item_trace_unique_id= wh.item_trace_unique_id AND
                                                                                        wa.product_id = od.product_id AND 
                                                                                        wa.type =1 AND 
                                                                                        wa.raw_material_out = 1 AND 
                                                                                        wa.purchase_return_status = 0 AND
                                                                                        wa.purchase_status > 0 ),0)

                                                                    - COALESCE((SELECT SUM(wa.quantity)
                                                                                FROM warehouse_allocation AS wa  
                                                                                WHERE 
                                                                                        wa.item_trace_unique_id= wh.item_trace_unique_id AND
                                                                                        wa.product_id=od.product_id AND 
                                                                                        
                                                                                        wa.type =1 AND 
                                                                                        wa.purchase_return_status = 1 AND
                                                                                        wa.purchase_status >0 ),0))
                                       ELSE 0
                                       END) AS remainingQty
                FROM srm_invoice_detail AS od
                LEFT JOIN warehouse_allocation AS wh ON wh.order_id = od.invoice_id AND wh.purchase_order_detail_id = od.id AND wh.type=1 AND wh.purchase_status IN(2,3) AND wh.purchase_return_status = 0 
                LEFT JOIN product AS p ON p.id = od.product_id
                WHERE od.invoice_id = ".$attr['purchaseInvoiceID']." AND od.type = 0 AND p.status > 0
                GROUP BY od.id";   // od.product_id //wa.warehouse_id=od.warehouse_id AND
        
        // echo $Sql;exit;
        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, 'purchase_return', sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) 
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key)) 
                        unset($Row[$key]);
                }
                
                // require_once(SERVER_PATH . "/classes/Stock.php");
                // $this->objstock = new Stock($this->arrUser);
                
                // $Row['id'] = $Row['product_id'];
                $attr['product_id'] = $Row['product_id'];

                $temp =  $this->objstock->get_all_product_warehouses($attr);                

                if(count($temp['response']) > 0)
                    $Row['arr_warehouse'] =$temp['response'];                   

                $Row['arr_units'] = $this->objstock->get_unit_setup_list_category_by_item($attr);

                if($Row['remainingQty']> 0){
                    $Row['qty'] = $Row['remainingQty'];
                    $response['response'] []= $Row;     
                } 
                

                         
            }
            if(empty($response['response'])){
                $response['ack'] = 0;
            } else {
                $response['ack'] = 1;
            }
            
        } else 
            $response['response'] = array();      

        return $response;
    }

    //stock entry by third party stock check is nULL   add entry in warehouse allocation  allocated_external=1
    function add_stock_allocated_external($attr)
    {
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
        // echo "<pre>"; print_r($attr); exit;
        foreach ($attr['items'] as $item) 
        {
            $data_pass = "  tst.order_id='$attr[order_id]' AND 
                            tst.product_id='$item->id' AND 
                            warehouse_id= '" . $item->warehouses->id . "'";
            $total = $this->objGeneral->count_duplicate_in_sql('warehouse_allocation', $data_pass, $this->arrUser['company_id']);
            
            if ($total == 0) 
            {
                $date_receivedUnConv = ""; 

                if($attr['date_received'] > 0){
                    $date_receivedUnConv = "date_receivedUnConv = '" . $this->objGeneral->convertUnixDateIntoConvDate($attr['order_date']) . "',";            
                }
                $SqlQuote = "INSERT INTO warehouse_allocation 
                                          SET 
                                                status=1,
                                                quantity='$item->qty',
                                                remaining_qty = '$item->qty',
                                                type=1,
                                                allocated_external=1,
                                                batch_no='$item->description',
                                                warehouse_id= '" . $item->warehouses->id . "', 
                                                bl_shipment_no='$item->description',
                                                container_no='$item->description',
                                                date_received='" . $this->objGeneral->convert_date($attr['order_date']) . "',
                                                $date_receivedUnConv
                                                prod_date='" . $this->objGeneral->convert_date($attr['order_date']) . "',
                                                use_by_date='" . $this->objGeneral->convert_date($attr['order_date']) . "',
                                                unit_measure_id='" . $item->units->id . "',
                                                unit_measure_qty='" . $item->units->quantity . "',
                                                unit_measure_name='" . $item->units->name . "',
                                                primary_unit_id='" . $item->default_units->id . "',
                                                primary_unit_qty=1,
                                                primary_unit_name='" . $item->default_units->name . "',
                                                sale_return_status=0,
                                                order_date='" . $this->objGeneral->convert_date($order_date) . "',
                                                order_id='$attr[invoice_id]',
                                                purchase_status=3,
                                                purchase_return_status=0,
                                                product_id='$item->id',
                                                item_trace_unique_id = UUID(),
                                                company_id='" . $this->arrUser['company_id'] . "',
                                                user_id='" . $this->arrUser['id'] . "'";
                //echo $SqlQuote."<hr>"; exit;
                $RS = $this->objsetup->CSI($SqlQuote);
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

        return true;
    }

    function getPurchaseInvoicesforDebitNote($attr)
    {
        // print_r($attr);exit;
        $this->objGeneral->mysql_clean($attr);       
        $response = array();

        $Sql = "SELECT o.id, 
                       o.order_code, 
                       o.invoice_code,
                       o.supp_order_no, 
                       o.posting_date, 
                       o.invoice_date, 
                       o.order_date, 
                       o.receiptDate, 
                       o.grand_total, 
                       '1' AS docType,
                       currency.code AS currency_code
                FROM srm_invoice o 
                LEFT JOIN currency ON currency.id = currency_id
                WHERE o.sell_to_cust_id = ".$attr['supplierID']."  AND
                      o.type IN (1,2) AND 
                      o.status = 1 AND 
                      o.invoice_code IS NOT NULL
                UNION
                SELECT o.id, 
                       o.extRefNo AS order_code, 
                       o.invoiceNo AS invoice_code, 
                       o.extRefNo AS supp_order_no,
                       o.posting_date, 
                       o.posting_date AS invoice_date, 
                       '-' AS order_date, 
                       '-' AS receiptDate, 
                       o.creditAmount AS grand_total,
                       '2' AS docType, 
                       currency.code AS currency_code
                FROM opening_balance_customer AS o
                LEFT JOIN currency ON currency.id = currency_id
                WHERE   o.moduleID = ".$attr['supplierID']."  AND 
                        o.docType = 1 AND
                        o.type = 2 AND
                        postStatus = 1";     
        // echo $Sql;exit;

        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, 'purchase_return', sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id']               = $Row['id'];
                $result['order_code']       = $Row['order_code'];
                $result['invoice_code']     = $Row['invoice_code'];
                $result['supp_order_no']     = $Row['supp_order_no'];
                $result['docType']     = $Row['docType'];
                // $result['invoice_date']     = $this->objGeneral->convert_unix_into_date($Row['posting_date']);
                $result['invoice_date']     = $this->objGeneral->convert_unix_into_date($Row['invoice_date']);
                $result['order_date']       = $this->objGeneral->convert_unix_into_date($Row['order_date']);
                $result['delivery_date']    = $this->objGeneral->convert_unix_into_date($Row['receiptDate']);
                $result['currency_code']    = $Row['currency_code'];
                $result['amount']           = $Row['grand_total'];
                
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
        } 
        return $response;
    }

    function genarate_pdf($arr)
    {
        require_once(SERVER_PATH . "libraries/mpdf/mpdf/mpdf.php");
        $objpdf = new mPDF();

        //  $contents = $this->input->post('contents');
        $contents = '<div style="text-align:center">
                     <table width="100%">
                        <tr>
                        <td style="text-align:center;font-weight:bolder;font-size:18px;">heelo</td>
                        </tr>
                        <tr height="20px;">
                        <td><div align="center" style="margin-bottom:10px;">&nbsp;&nbsp;</div>
                        </td>
                        </tr>
                        </table></div>  
                        ';
        $college_id = '';
        $college_id = 'Navson Suprer Company';
        $departmnet_id = '';
        $departmnet_id = 'IT';
        $file_name = 'Atendance';
        $file_name = 'new';
        $clg_id = '';
        $clg_id = $this->input->post('clg_id');

        $footer_msg = '&copy;Copyright 2015.All Right Reserved STMU-ITS';
        //$footer_msg = $this->input->post('footer_msg');  
        $atd_year = 'Monthly - Report -';
        //$atd_year = $this->input->post('atd_yearr');
        $file_name = $file_name . '_sheet-of- ' . $atd_year . "";
        $contents = stripslashes(strip_tags($contents, '<table><tr><td><div><span><font><strong><b><i><th><img><br><label><hr>'));

        $mpdf = new mPDF('c', 'A4-L', '', '', 5, 25, 45, 37, 10, 10);
        //<htmlpageheader name="firstpage"> 
        $header = '<div style="text-align:center">
                    <table width="100%">
                    <tr>
                    <td style="text-align:center;font-weight:bolder;font-size:18px;">' . ucfirst($college_id) . ' <br> ' . $departmnet_id .
                                '<br>' . $atd_year . "" . '</td>
                    </tr>
                    <tr height="20px;">
                    <td><div align="center" style="margin-bottom:10px;">&nbsp;&nbsp;</div>
                    </td>
                    </tr>
                    </table></div>  
                    ';
        //</htmlpageheader>

        /* <htmlpageheader name="otherpage" style="display:none">
          </htmlpageheader>
          <sethtmlpageheader name="firstpage" show-this-page="1" value="on" />
          <sethtmlpageheader name="otherpage" value="on" /> */

        $headerE = '<table width="100%">
                    <tr>
                    <td><div align="center">&nbsp;&nbsp;</div>
                    </td>
                    </tr>
                    </table> 
                    ';
        /* <hr>  <div style="text-align:right">   Page:{PAGENO} / {nbpg}</div> 	 */

        $footer = '<div style="text-align:center">  <table width="100%" >
                    <tr>
                    <td width="100%" align="center" valign="middle"><div style="width:100%; display:block; vertical-align:middle;"><strong> ' . $footer_msg . "" . ' </strong></div></td>
                    </tr> 
                    </table>
                    </div> ';
        $footerE = '<div align="center"></div>';

        // $mpdf->useOddEven = true;
        // $contents = $header . $contents  ;
        // $mpdf->useOddEven = true; 
        // $mpdf->SetDisplayMode('fullpage');
        $mpdf->SetHTMLHeader($header);
        $mpdf->SetHTMLHeader($headerE, 'E');
        $mpdf->SetWatermarkText('STMU-HRMS | Shifa Tameer-e-Millat University Human Resourse Management System');
        $mpdf->showWatermarkText = true;

        $stylesheet = file_get_contents($this->config->base_url() . 'asset/admin/css/bootstrap.min.css');
        $mpdf->WriteHTML($stylesheet, 1);

        $stylesheet_2 = file_get_contents($this->config->base_url() . 'asset/admin/css/mpdf.css');
        $mpdf->WriteHTML($stylesheet_2, 1);

        $mpdf->WriteHTML($contents);
        echo $contents;
        exit;

        $mpdf->SetHTMLFooter($footer);
        $mpdf->SetHTMLFooter($footerE, 'E');
        // Set a simple Footer including the page number
        //  $mpdf->setFooter('Page:{PAGENO} / {nbpg}');
        $mpdf->debug = true;
        $mpdf->showImageErrors = true;

        $today = date("d-m-Y");
        $file_name = $file_name . "-Of-" . $today . ".pdf";
        $mpdf->Output($file_name, "D");
    }


    function update_converted_items_price($attr)
    {
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

        $netAmount = (isset($attr['currency_data']->net_amount) && $attr['currency_data']->net_amount!='')?$attr['currency_data']->net_amount:0;
        $grand_total = (isset($attr['currency_data']->grand_total) && $attr['currency_data']->grand_total!='')?$attr['currency_data']->grand_total:0;
        $tax_amount = (isset($attr['currency_data']->tax_amount) && $attr['currency_data']->tax_amount!='')?$attr['currency_data']->tax_amount:0;
        
        $net_amount_converted = (isset($attr['currency_data']->net_amount_converted) && $attr['currency_data']->net_amount_converted!='')?$attr['currency_data']->net_amount_converted:0;
        $grand_total_converted = (isset($attr['currency_data']->grand_total_converted) && $attr['currency_data']->grand_total_converted!='')?$attr['currency_data']->grand_total_converted:0;
        $tax_amount_converted = (isset($attr['currency_data']->tax_amount_converted) && $attr['currency_data']->tax_amount_converted!='')?$attr['currency_data']->tax_amount_converted:0;
        
        

        $Sql = "UPDATE " . $attr['currency_data']->table . " 
                            SET	
                                net_amount='" . $netAmount . "', 
                                grand_total='" . $grand_total . "', 
                                tax_amount='" . $tax_amount . "',	
                                net_amount_converted='" . $net_amount_converted . "', 
                                grand_total_converted='" . $grand_total_converted . "', 
                                tax_amount_converted='" . $tax_amount_converted . "',
                                currency_rate ='" . $attr['currency_data']->currency_rate . "'
                            WHERE id = " . $attr['currency_data']->order_id . " 
                            limit 1";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        foreach ($attr['items_rate'] as $data) 
        {
            $item_converted_price = (isset($data->item_converted_price) && $data->item_converted_price!='')?$data->item_converted_price:0;
            $update_id = (isset($data->update_id) && $data->update_id!='')?$data->update_id:0;

            $sql = "UPDATE " . $attr['tbs'] . " 
                                SET 
                                    item_converted_price = '" . $item_converted_price . "' 
                                where id = " . $update_id . " 
                                limit 1";
            //echo $sql;
            $RS = $this->objsetup->CSI($sql);
        }

        $chk = true;

        if ($chk) 
        {
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

            $this->objsetup->SRTraceLogsPHP($srLogTrace);

        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record is Not updated!';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }
        return $response;
    }


    function delete_srm_order_item($attr)
    {
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
        //echo "<pre>";	print_r($attr);exit;
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM ".$attr['table']." WHERE id = ".$attr['id']." ";

        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, 'purchase_order', sr_EditPermission);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $stkSql = " DELETE FROM warehouse_allocation
                        WHERE order_id = ".$attr['order_id']." AND 
                              product_id = ".$attr['id']." ";

            //echo $stkSql."<hr>"; exit;
            $this->objsetup->CSI($stkSql);
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            
        } else {
            $response['ack'] = 0;
            $response['error'] = "Record cannot be deleted";

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record cannot be deleted';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }
        return $response;
    }


    // Rebate start
    // //----------------------------------------------------
    function get_rebate_listings($attr)
    {
        /* global $objFilters;
          return $objFilters->get_module_listing(107, "crm_rebate",$attr[column],$attr[value]); */
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = "";
        $order_type = "";
        $response = array();

        $Sql = "SELECT rebt.*,srm.name as sup_name,
                      ( CASE
                          WHEN rebt.rebate_type = 1 THEN 'Universal Rebate for the Customer'
                          WHEN rebt.rebate_type = 2 THEN 'Separate Rebate for Item Category(ies)'
                          WHEN rebt.rebate_type = 3 THEN 'Separate Rebate for Item(s)'
                        END ) AS rebate_type_name,

                       (CASE
                          WHEN rebt.universal_type = 1 THEN 'Universal Rebate'
                          WHEN rebt.universal_type = 2 THEN 'Volume Based Rebate'
                          WHEN rebt.universal_type = 3 THEN 'Revenue Based Rebate'
                        ELSE 0  END ) AS universal_type_name,
                        IFNULL((SELECT history.id 
                                From srm_rebate_history as history
                                where history.srm_rebate_id = rebt.id 
                                limit 1 ),0) as rebate_history

                FROM srm_rebate as rebt
                LEFT JOIN srm ON srm.id = rebt.srm_id
                WHERE rebt.srm_id = '".$attr['value']."'";

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
                                    WHERE rbt.rebate_id = ".$Row['id']." ";/*limit 1*/
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
                                    WHERE rbt.rebate_id = ".$Row['id']."      ";/*limit 1*/
                        //echo $SqlItem;

                        $RS1 = $this->objsetup->CSI($SqlItem);
                        while ($Row1 = $RS1->FetchRow()) {
                            $rsitem = array();
                            $rsitem['item_description'] = $Row1['description'];
                            $items[] = $rsitem;
                        }
                        $result['offer_to'] = $items;
                    }
                } 
                else if ($Row['rebate_type'] == 2) {

                    if ($Row['category_type'] == 1) {
                        $cats = array();
                        $SqlCat = "SELECT cat.name, cat.description
                                   FROM rebate_categories as rbt
                                   JOIN category as cat ON rbt.category_id = cat.id
                                   WHERE rbt.rebate_id = ".$Row['id']." ";/*limit 1 */

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
                                   WHERE rbt.rebate_id = ".$Row['id']." limit 1 ";

                        $RS2 = $this->objsetup->CSI($SqlCat);
                        while ($Row2 = $RS2->FetchRow()) {
                            $rscat = array();
                            $rscat['cat_name'] = $Row2['name'];
                            $rscat['cat_description'] = $Row2['description'];
                            $cats[] = $rscat;
                        }
                        $result['offer_to'] = $cats;
                    }
                } 
                else {
                    $result['offer_to'] = $Row['cust_name'];
                }

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
                $result['rebate'] = $Row['rebate_price'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {

            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }


    function get_srm_rebate_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT srm_rebate.*,employees.first_name, employees.last_name
                FROM srm_rebate
                left JOIN employees ON employees.id=srm_rebate.user_id
                WHERE srm_rebate.id='".$attr['id']."' 
                LIMIT 1";
        /* echo $Sql;
          exit; */
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) 
        {
            $Row = $RS->FetchRow();

            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $Row['created_date'] = $this->objGeneral->convert_unix_into_date($Row['created_date']);
            /* $Row['offer_date'] = $this->objGeneral->convert_unix_into_date($Row['offer_date']);
              $Row['offer_valid_date'] = $this->objGeneral->convert_unix_into_date($Row['offer_valid_date']); */
            $Row['offer_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
            $Row['offer_valid_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
            $Row['created_by'] = $Row['first_name'] . ' ' . $Row['last_name'];

            $response['response'] = $Row;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_srm_rebate($attr)
    {
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
        /* $this->objGeneral->mysql_clean($attr); */
        $start_date = $this->objGeneral->convert_date($attr['offer_date']);
        $end_date = $this->objGeneral->convert_date($attr['offer_valid_date']);
        $current_date = $this->objGeneral->convert_date(date('Y-m-d'));

        if ($end_date > 0) {
            if ($start_date > $end_date) {
                $response['ack'] = 0;
                $response['error'] = 'Start Date is Greater than End Date';

                $srLogTrace = array();
                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'Exit';
                $srLogTrace['ErrorMessage'] = 'Start Date is Greater than End Date';
                $this->objsetup->SRTraceLogsPHP($srLogTrace);

                return $response;
            }
        }

        if ($attr['universal_type'] == 2 || $attr['universal_type'] == 3 || $attr['type'] == 3) 
        {
            foreach ($attr['items'] as $item) 
            {
                $DupCHKSql = "SELECT reb.id,product.description
                                FROM srm_rebate as reb
                                left JOIN rebate_items ON rebate_items.rebate_id=reb.id
                                left JOIN product ON product.id=rebate_items.item_id
                                WHERE rebate_items.item_id='" . $item->id . "' and reb.srm_id='" . $attr['srm_id'] . "' and
                                      reb.rebate_type = '" . $attr['type'] . "' and
                                      ('" . $start_date . "' BETWEEN reb.start_date AND reb.end_date
                                          or '" . $end_date . "' BETWEEN reb.start_date AND reb.end_date ) LIMIT 1";
                /*echo $DupCHKSql;
                 exit;*/
                $DupCHKRS = $this->objsetup->CSI($DupCHKSql);

                if ($DupCHKRS->RecordCount() > 0) 
                {
                    $DupCHKRow = $DupCHKRS->FetchRow();

                    $response['ack'] = 0;
                    $response['error'] = 'Record Already Exists for "' . $DupCHKRow['description'] . '" Item!';

                    $srLogTrace = array();
                    $srLogTrace['ErrorCode'] = '';
                    $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                    $srLogTrace['Function'] = __FUNCTION__;
                    $srLogTrace['CLASS'] = __CLASS__;
                    $srLogTrace['Parameter1'] = 'Exit';
                    $srLogTrace['ErrorMessage'] = 'Record Already Exists for "' . $DupCHKRow['description'] . '" Item!';
                    $this->objsetup->SRTraceLogsPHP($srLogTrace);

                    return $response;
                }
            }
        } 
        elseif ($attr['type'] == 2) 
        {
            foreach ($attr['categories'] as $cat) 
            {
                $DupCHKcatSql = "SELECT reb.id,category.name
                                FROM srm_rebate as reb
                                left JOIN rebate_categories ON rebate_categories.rebate_id=reb.id
                                left JOIN category ON category.id=rebate_categories.category_id
                                WHERE rebate_categories.category_id='" . $cat->id . "' and reb.srm_id='" . $attr['srm_id'] . "' and
                                      reb.rebate_type = '" . $attr['type'] . "' and
                                      ('" . $start_date . "' BETWEEN reb.start_date AND reb.end_date
                                          or '" . $end_date . "' BETWEEN reb.start_date AND reb.end_date ) LIMIT 1";
                /*echo $DupCHKcatSql;
                 exit;*/
                $DupCHKcatRS = $this->objsetup->CSI($DupCHKcatSql);

                if ($DupCHKcatRS->RecordCount() > 0) 
                {
                    $DupCHKcatRow = $DupCHKcatRS->FetchRow();
                    $response['ack'] = 0;
                    $response['error'] = 'Record Already Exists for "' . $DupCHKcatRow['name'] . '" Category!';

                    $srLogTrace = array();
                    $srLogTrace['ErrorCode'] = '';
                    $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                    $srLogTrace['Function'] = __FUNCTION__;
                    $srLogTrace['CLASS'] = __CLASS__;
                    $srLogTrace['Parameter1'] = 'Exit';
                    $srLogTrace['ErrorMessage'] = 'Record Already Exists for "' . $DupCHKcatRow['name'] . '" Category!';
                    $this->objsetup->SRTraceLogsPHP($srLogTrace);

                    return $response;
                }
            }
        } 
        else 
        {
            $DupCHKSql = "SELECT reb.id
                                FROM srm_rebate as reb
                                WHERE reb.srm_id='" . $attr['srm_id'] . "' and reb.rebate_type = '" . $attr['type'] . "' and
                                      ('" . $start_date . "' BETWEEN reb.start_date AND reb.end_date
                                          or '" . $end_date . "' BETWEEN reb.start_date AND reb.end_date ) LIMIT 1";
            /*echo $DupCHKSql;
             exit;*/
            $DupCHKRS = $this->objsetup->CSI($DupCHKSql);

            if ($DupCHKRS->RecordCount() > 0) 
            {
                $DupCHKRow = $DupCHKRS->FetchRow();

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
            }
        }

        $Sql = "INSERT INTO srm_rebate
                        SET
                            srm_id = '" . $attr['srm_id'] . "',
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

         /*echo $Sql . " < hr>";
          exit;*/
        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();


        if ($id > 0) 
        {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['edit'] = 0;
            $response['id'] = $id;

            if ($attr['universal_type'] == 2 || $attr['universal_type'] == 3 || $attr['type'] == 3)
                self::add_rebate_items($id, $attr['items'], 0);

            if ($attr['type'] == 2)
                self::add_rebate_categories($id, $attr['categories'], 0);

            $attr['srm_rebate_id'] = $id;
            $this->add_supplier_rebate_history($attr);

            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
            $response['edit'] = 0;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record not inserted';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }
        // exit;
        return $response;
    }

    function add_rebate_items($id, $items, $isEdit)
    {
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
        $current_date = $this->objGeneral->convert_date(date('Y-m-d'));

        if ($isEdit == 1) {
            $Sql = "DELETE FROM rebate_items WHERE rebate_id = " . $id;
            $RS = $this->objsetup->CSI($Sql);
        }

        foreach ($items as $item) 
        {
            $Sql = "INSERT INTO rebate_items
                                    SET
                                        rebate_id = '" . $id . "',
                                        item_id = '" . $item->id . "',
                                        status = 1,
                                        user_id = '" . $this->arrUser['id'] . "',
                                        company_id = '" . $this->arrUser['company_id'] . "',
                                        created_date = '" . $current_date . "'";
            // echo '<hr>' . $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
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
        return true;
    }

    function add_rebate_categories($id, $categories, $isEdit)
    {
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
        $current_date = $this->objGeneral->convert_date(date('Y-m-d'));

        if ($isEdit == 1) 
        {
            $Sql = "DELETE FROM rebate_categories WHERE rebate_id = " . $id;
            $RS = $this->objsetup->CSI($Sql);
        }

        foreach ($categories as $cat) 
        {
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

        $this->Conn->commitTrans();
        $this->Conn->autoCommit = true;

        $srLogTrace = array();
        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Exit';

        $this->objsetup->SRTraceLogsPHP($srLogTrace);
        return true;
    }

    function get_rebate_items($attr)
    {
        $Sql = "SELECT item_id FROM rebate_items WHERE rebate_id = " . $attr['rebate_id'];
        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                $result = array();
                $result['item_id'] = $Row['item_id'];
                $response['response'][] = $result;
            }

            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_rebate_categories($attr)
    {
        $Sql = "SELECT category_id 
                FROM rebate_categories 
                WHERE rebate_id = " . $attr['rebate_id'];

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                $result = array();
                $result['category_id'] = $Row['category_id'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {
            $response['response'][] = array();
        }
        return $response;
    }

    function update_srm_rebate($attr)
    {
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
        $start_date = $this->objGeneral->convert_date($attr['offer_date']);
        $end_date = $this->objGeneral->convert_date($attr['offer_valid_date']);

        if ($end_date > 0) {
            if ($start_date > $end_date) {
                $response['ack'] = 0;
                $response['error'] = 'Start Date is Greater than End Date';

                $srLogTrace = array();
                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'Exit';
                $srLogTrace['ErrorMessage'] = 'Start Date is Greater than End Date';

                $this->objsetup->SRTraceLogsPHP($srLogTrace);

                return $response;
            }
        }

        if ($attr['universal_type'] == 2 || $attr['universal_type'] == 3 || $attr['type'] == 3) 
        {
            foreach ($attr['items'] as $item) 
            {
                $DupCHKSql = "SELECT reb.id,product.description
                                FROM srm_rebate as reb
                                left JOIN rebate_items ON rebate_items.rebate_id=reb.id
                                left JOIN product ON product.id=rebate_items.item_id
                                WHERE rebate_items.item_id='" . $item->id . "' and 
                                      reb.srm_id='" . $attr['srm_id'] . "' and
                                      reb.rebate_type = '" . $attr['type'] . "' and
                                      ('" . $start_date . "' BETWEEN reb.start_date AND reb.end_date or 
                                       '" . $end_date . "' BETWEEN reb.start_date AND reb.end_date ) AND 
                                       reb.id <> '" . $attr['id'] . "' LIMIT 1";
                /*echo $DupCHKSql;
                 exit;*/
                $DupCHKRS = $this->objsetup->CSI($DupCHKSql);

                if ($DupCHKRS->RecordCount() > 0) 
                {
                    $DupCHKRow = $DupCHKRS->FetchRow();
                    $response['ack'] = 0;
                    $response['error'] = 'Record Already Exists for "' . $DupCHKRow['description'] . '" Item!';

                    $srLogTrace = array();
                    $srLogTrace['ErrorCode'] = '';
                    $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                    $srLogTrace['Function'] = __FUNCTION__;
                    $srLogTrace['CLASS'] = __CLASS__;
                    $srLogTrace['Parameter1'] = 'Exit';
                    $srLogTrace['ErrorMessage'] = 'Record Already Exists for "' . $DupCHKRow['description'] . '" Item!';
                    $this->objsetup->SRTraceLogsPHP($srLogTrace);

                    return $response;
                }
            }
        } 
        elseif ($attr['type'] == 2) 
        {
            foreach ($attr['categories'] as $cat) 
            {
                $DupCHKcatSql = "   SELECT reb.id,category.name
                                    FROM srm_rebate as reb
                                    left JOIN rebate_categories ON rebate_categories.rebate_id=reb.id
                                    left JOIN category ON category.id=rebate_categories.category_id
                                    WHERE rebate_categories.category_id='" . $cat->id . "' and 
                                        reb.srm_id='" . $attr['srm_id'] . "' and
                                        reb.rebate_type = '" . $attr['type'] . "' and
                                        ('" . $start_date . "' BETWEEN reb.start_date AND reb.end_date or 
                                        '" . $end_date . "' BETWEEN reb.start_date AND reb.end_date ) AND 
                                        reb.id <> '" . $attr['id'] . "' 
                                    LIMIT 1";
                /*echo $DupCHKcatSql;
                 exit;*/
                $DupCHKcatRS = $this->objsetup->CSI($DupCHKcatSql);

                if ($DupCHKcatRS->RecordCount() > 0) 
                {
                    $DupCHKcatRow = $DupCHKcatRS->FetchRow();
                    $response['ack'] = 0;
                    $response['error'] = 'Record Already Exists for "' . $DupCHKcatRow['name'] . '" Category!';

                    $srLogTrace = array();
                    $srLogTrace['ErrorCode'] = '';
                    $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                    $srLogTrace['Function'] = __FUNCTION__;
                    $srLogTrace['CLASS'] = __CLASS__;
                    $srLogTrace['Parameter1'] = 'Exit';
                    $srLogTrace['ErrorMessage'] = 'Record Already Exists for "' . $DupCHKcatRow['name'] . '" Category!';
                    $this->objsetup->SRTraceLogsPHP($srLogTrace);

                    return $response;
                }
            }
        } 
        else 
        {
            $DupCHKSql = "  SELECT reb.id
                            FROM srm_rebate as reb
                            WHERE reb.srm_id='" . $attr['srm_id'] . "' and 
                                  reb.rebate_type = '" . $attr['type'] . "' and
                                  ('" . $start_date . "' BETWEEN reb.start_date AND reb.end_date or 
                                   '" . $end_date . "' BETWEEN reb.start_date AND reb.end_date ) AND 
                                  reb.id <> '" . $attr['id'] . "' 
                            LIMIT 1";
            //echo $DupCHKSql; exit;
            $DupCHKRS = $this->objsetup->CSI($DupCHKSql);

            if ($DupCHKRS->RecordCount() > 0) {

                $DupCHKRow = $DupCHKRS->FetchRow();

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
            }
        }

        $Sql = "UPDATE srm_rebate
                        SET
                            universal_type = '" . $attr['universal_type'] . "',
                            rebate_price_type = '" . $attr['rebate_price_type'] . "',
                            rebate_price = '" . $attr['rebate_price'] . "',
                            uom = '" . $attr['uom'] . "',
                            start_date = '" . $start_date . "',
                            end_date = '" . $end_date . "'
                        WHERE id = '" . $attr['id'] . "' limit 1";


        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            if ($attr['type'] == 3 || $attr['universal_type'] == 2 || $attr['universal_type'] == 3)
                self::add_rebate_items($attr['id'], $attr['items'], 1);
            if ($attr['type'] == 2)
                self::add_rebate_categories($attr['id'], $attr['categories'], 1);

            $attr['srm_rebate_id'] = $attr['id'];
            $this->add_supplier_rebate_history($attr);

            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['edit'] = 1;
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        } else {
            $response['ack'] = 0;
            $response['edit'] = 0;
            $response['error'] = 'Record cannot be updated';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record cannot be updated';
            $this->objsetup->SRTraceLogsPHP($srLogTrace);

        }
        return $response;
    }

    function delete_srm_rebate($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "update crm_rebate set status = 0 WHERE id = ".$attr['id']." ";
        //echo $Sql." < hr>"; exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record cannot be deleted.';
        }
        return $response;
    }

    // Rebate Volume and Revenue Start
    //----------------------------------------------------
    function get_srm_rebate_volume_revenue($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "SELECT rebate_vr.*,wh.title as uom,
                        IFNULL((SELECT history.id 
                                From rebate_volume_revenue_history as history
                                where history.rebate_volume_revenue_id = rebate_vr.id 
                                limit 1 ),0) as rebate_volume_revenue_history
                FROM rebate_volume_revenue as rebate_vr
                LEFT JOIN units_of_measure as wh ON wh.id = rebate_vr.uom
                WHERE rebate_vr.rebate_id = '" . $attr['rebate_id'] . "' and 
                      rebate_vr.type = '" . $attr['rebate_type'] . "'";

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                $result = array();
                $result['id'] = $Row['id'];
                $result['rebate_volume_revenue_history'] = $Row['rebate_volume_revenue_history'];
                $result['created_date'] = $this->objGeneral->convert_unix_into_date($Row['create_date']);
                /*$result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);*/
                //$result['volume_revenue_detail'] = $Row['range_from'] . " - " . $Row['range_to'] . ' ' . $Row['cat_name'];
                $result['revenue_volume_from'] = $Row['revenue_volume_from'];
                $result['revenue_volume_to'] = $Row['revenue_volume_to'];
                $result['uom'] = $Row['uom'];
                $result['rebate_type'] = $Row['rebate_type'];
                $result['rebate'] = $Row['rebate'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else 
        {
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
                WHERE rebate_vr.id = '" . $attr['RebateRevenueRebate_id'] . "' 
                      limit 1";

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow())
            {
                $result = array();
                $result['id'] = $Row['id'];
                $result['created_date'] = $this->objGeneral->convert_unix_into_date($Row['create_date']);
                /*$result['start_date1'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                $result['end_date1'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);*/
                //$result['volume'] = $Row['rebate_volume_revenue_detail_id'];
                $result['revenue_volume_from'] = $Row['revenue_volume_from'];
                $result['revenue_volume_to'] = $Row['revenue_volume_to'];
                $result['uom'] = $Row['uom'];
                $result['rebate_type'] = $Row['rebate_type'];
                $result['rebate'] = $Row['rebate'];
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

    function add_srm_rebate_volume_revenue($attr)
    {
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
        $this->objGeneral->mysql_clean($attr);
        /*$start_date = $this->objGeneral->convert_date($attr['start_date1']);
        $end_date = $this->objGeneral->convert_date($attr['end_date1']);*/
        $current_date = $this->objGeneral->convert_date(date('Y-m-d'));

        $data_pass = " tst.rebate_id='" . $attr['rebate_id'] . "'  and
                        ('" . $attr['revenue_volume_from'] . "' BETWEEN tst.revenue_volume_from AND tst.revenue_volume_to or 
                         '" . $attr['revenue_volume_to'] . "' BETWEEN tst.revenue_volume_from AND tst.revenue_volume_to )";

        $total = $this->objGeneral->count_duplicate_in_sql('rebate_volume_revenue', $data_pass, $this->arrUser['company_id']);

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
        }

        $Sql = "INSERT INTO rebate_volume_revenue
                        SET
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
        $id = $this->Conn->Insert_ID();

        if ($id > 0) 
        {
            $attr['rebate_volume_revenue_id'] = $id;
            $this->add_srm_rebate_volume_revenue_history($attr);

            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['edit'] = 0;
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        } 
        else 
        {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
            $response['edit'] = 0;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record not inserted!';
            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }
        // exit;
        return $response;
    }

    function update_srm_rebate_volume_revenue($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $data_pass = " tst.rebate_id='" . $attr['rebate_id'] . "'  and
                       ('" . $attr['revenue_volume_from'] . "' BETWEEN tst.revenue_volume_from AND tst.revenue_volume_to or 
                        '" . $attr['revenue_volume_to'] . "' BETWEEN tst.revenue_volume_from AND tst.revenue_volume_to ) AND 
                        tst.id <> '" . $attr['id'] . "'";

        $total = $this->objGeneral->count_duplicate_in_sql('rebate_volume_revenue', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE rebate_volume_revenue
                        SET
                            revenue_volume_from = '" . $attr['revenue_volume_from'] . "',
                            revenue_volume_to = '" . $attr['revenue_volume_to'] . "',
                            uom = '" . $attr['uom'] . "',
                            rebate_type = '" . $attr['rebate_type'] . "',
                            rebate = '" . $attr['rebate'] . "'
                        WHERE id = '" . $attr['id'] . "'  limit 1";
        //echo $Sql; exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) 
        {
            $attr['rebate_volume_revenue_id'] = $attr['id'];
            $this->add_srm_rebate_volume_revenue_history($attr);

            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['edit'] = 1;
        } 
        else 
        {
            $response['ack'] = 0;
            $response['edit'] = 0;
            $response['error'] = 'Record Updated Successfully';
        }
        return $response;
    }

    // Not in use // Rebate Volume and Revenue Detail Start
    //----------------------------------------------------
    function get_srm_rebate_volume_revenue_detail($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "SELECT p.id,p.range_to,p.range_from,
                        ( SELECT wh.title  FROM units_of_measure_setup st
                          JOIN units_of_measure as wh ON wh.id = st.cat_id
                          where st.id =p.uom and st.status=1 ) as cat_name
                FROM rebate_volume_revenue_detail as p
                WHERE p.rebate_id = '".$attr['rebate_id']."'";

        //echo $Sql; exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
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

    function add_srm_rebate_volume_revenue_detail($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $data_pass = " (tst.rebate_id='" . $attr['rebate_id'] . "' AND 
                        tst.uom = '" . $attr['uom'] . "'  AND
                        ('" . $attr['quantity_from'] . "' BETWEEN tst.range_from AND tst.range_to or 
                         '" . $attr['quantity_to'] . "' BETWEEN tst.range_from AND tst.range_to ))";

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


    function add_supplier_rebate_history($attr)
    {
        $start_date = $this->objGeneral->convert_date($attr['offer_date']);
        $end_date = $this->objGeneral->convert_date($attr['offer_valid_date']);
        $current_date = $this->objGeneral->convert_date(date('Y-m-d'));
        $Sql = "INSERT INTO srm_rebate_history
                        SET
                            srm_rebate_id = '" . $attr['srm_rebate_id'] . "',
                            srm_id = '" . $attr['srm_id'] . "',
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

    function get_supplier_rebate_history($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $order_type = "";
        $response = array();

        $Sql = "SELECT rebt.*,srm.name as cust_name,
                      ( CASE
                          WHEN rebt.rebate_type = 1 THEN 'Universal Rebate for the Customer'
                          WHEN rebt.rebate_type = 2 THEN 'Separate Rebate for Item Category(ies)'
                          WHEN rebt.rebate_type = 3 THEN 'Separate Rebate for Item(s)'
                        END ) AS rebate_type_name,

                       (CASE
                          WHEN rebt.universal_type = 1 THEN 'Universal Rebate'
                          WHEN rebt.universal_type = 2 THEN 'Volume Based Rebate'
                          WHEN rebt.universal_type = 3 THEN 'Revenue Based Rebate'
                        ELSE 0  END ) AS universal_type_name

                FROM srm_rebate_history as rebt
                LEFT JOIN srm ON srm.id = rebt.srm_id
                WHERE rebt.srm_rebate_id = '" . $attr['id'] . "'";
        
        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'rebt', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                $result = array();
                if ($Row['rebate_type'] == 3 || ($Row['universal_type'] == 2 || $Row['universal_type'] == 3)) 
                {
                    if ($Row['item_type'] == 1) 
                    {
                        $items = array();
                        $SqlItem = "SELECT prd.description
                                    FROM rebate_items as rbt
                                    JOIN product as prd ON rbt.item_id = prd.id
                                    WHERE rbt.rebate_id = '" . $Row['id'] . "' limit 1";
                        //echo '<hr>'.$SqlItem;

                        $RS1 = $this->objsetup->CSI($SqlItem);
                        while ($Row1 = $RS1->FetchRow()) 
                        {
                            $rsitem = array();
                            $rsitem['item_description'] = $Row1['description'];
                            $items[] = $rsitem;
                        }
                        $result['offer_to'] = $items;
                    }
                    if ($Row['item_type'] == 2) 
                    {
                        $items = array();
                        $SqlItem = "SELECT prd.description
                                    FROM rebate_items as rbt
                                    JOIN services as prd ON rbt.item_id = prd.id
                                    WHERE rbt.rebate_id = '" . $Row['id'] . "' limit 1  ";
                        //echo $SqlItem;

                        $RS1 = $this->objsetup->CSI($SqlItem);
                        while ($Row1 = $RS1->FetchRow()) 
                        {
                            $rsitem = array();
                            $rsitem['item_description'] = $Row1['description'];
                            $items[] = $rsitem;
                        }
                        $result['offer_to'] = $items;
                    }
                } else if ($Row['rebate_type'] == 2) 
                {
                    if ($Row['category_type'] == 1) 
                    {
                        $cats = array();
                        $SqlCat = "SELECT cat.name, cat.description
                                   FROM rebate_categories as rbt
                                   JOIN category as cat ON rbt.category_id = cat.id
                                   WHERE rbt.rebate_id = '" . $Row['id'] . "' limit 1 ";

                        $RS2 = $this->objsetup->CSI($SqlCat);
                        while ($Row2 = $RS2->FetchRow()) 
                        {
                            $rscat = array();
                            $rscat['cat_name'] = $Row2['name'];
                            $rscat['cat_description'] = $Row2['description'];
                            $cats[] = $rscat;
                        }
                        $result['offer_to'] = $cats;
                    }

                    if ($Row['category_type'] == 2) 
                    {
                        $cats = array();
                        $SqlCat = "SELECT cat.name, cat.description
                                   FROM rebate_categories as rbt
                                   JOIN service_catagory as cat ON rbt.category_id = cat.id
                                   WHERE rbt.rebate_id = '" . $Row['id'] . "' limit 1 ";

                        $RS2 = $this->objsetup->CSI($SqlCat);
                        while ($Row2 = $RS2->FetchRow()) 
                        {
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

    // price List Email
    //----------------------------------------------------
    function priceListEmail($attr)
    {
        $mainRec = $attr['mainRec'];  

        if($mainRec->moduleType == 1) $accountCode = $mainRec->Customer_Code;
        else $accountCode = $mainRec->Supplier_Code;

        // $file_name = 'priceList.'.$accountCode.'.'.$this->arrUser['company_id'] .'.pdf';
        $file_name = $accountCode.'.priceList.'.$this->arrUser['company_id'] .'.pdf';
        $basePath = UPLOAD_PATH . 'attachments/';
        $file_url = $basePath . $file_name; 

        $result = "";
        $server_output = "";
        $relatedRec = "";        
        $relatedRec->reportsDataArr = $mainRec->items;
        $invoiceEmail = $mainRec->emailPriceList;
        $priceListName = $mainRec->name;        

        foreach($relatedRec->reportsDataArr as $singleItemRec){
           if(isset($singleItemRec->uomID) && is_array($singleItemRec->arr_units)){
               foreach($singleItemRec->arr_units as $singleUOMRec){
                   if($singleUOMRec->id == $singleItemRec->uomID){
                       $singleItemRec->UOM = $singleUOMRec->name;
                   }
               }
            }
        }

        $relatedRec->priceListName = $mainRec->name;
        // $relatedRec->Customer_Name = $mainRec->Supplier_Name;
        // $relatedRec->Customer_Code = $mainRec->Supplier_Code;
        $relatedRec->dateFrom = $mainRec->offer_date;
        $relatedRec->dateTo = $mainRec->offer_valid_date;  
        $relatedRec->company_name = $attr['company_name'];  
        $relatedRec->company_logo_url = $attr['company_logo_url'];
        $relatedRec->reportName = $mainRec->name;
        $relatedRec->reportType = $mainRec->name;

        $relatedRec->offered_by = $mainRec->offered_by;
        $relatedRec->moduleType = $mainRec->moduleType;
        $relatedRec->currencyCode = $mainRec->Code;

        $relatedRec->accountAddress = '';

        // if($mainRec->moduleType == 1){

        $Sql = "SELECT depot,address,address_2,city,postcode
                FROM alt_depot
                WHERE module_type = '" . $mainRec->moduleType . "' AND 
                        acc_id = '" . $mainRec->moduleID . "' AND 
                        is_primary = 1 LIMIT 1";

        //  echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($row = $RS->FetchRow()) {
                $relatedRec->accountAddress = $row['address'];
                $relatedRec->accountAddress2 = $row['address_2'];
                $relatedRec->city = $row['city'];
                $relatedRec->postcode = $row['postcode'];
            }
        }

        if($mainRec->moduleType == 1) $relatedRec->accountName = $mainRec->Customer_Name;
        else $relatedRec->accountName = $mainRec->Supplier_Name;

        $result->template->shortid = "HkgalmDSpB";
        $result->interceptorHeaders = $attr['interceptorHeaders'];
        $result->data = $relatedRec;      
        // print_r(json_encode($result));exit;

        // $url = 'http://silverowreports.azurewebsites.net/api/report';
        $url = 'https://silverowjsreport2.azurewebsites.net/api/report';

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS,json_encode($result));
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
            $response['ack'] = 1; 

            $key = hash('sha256', SECRET_KEY);
            $iv = substr(hash('sha256', SECRET_IV), 0, 16);
            $outputInvName = openssl_encrypt($file_name, SECRET_METHOD, $key, 0, $iv);
            $outputInvName = base64_encode($outputInvName);

            $response['file_url'] = WEB_PATH . '/api/setup/PriceList?alpha='.$outputInvName; //


            if(isset($response['file_url'])){
                $fileActualUrl = $response['file_url'];

                $Sql = "SELECT username,alias
                        FROM virtual_emails ve 
                        WHERE company_id = " . $this->arrUser['company_id'] . "
                        LIMIT 1";

                //  echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);

                if ($RS->RecordCount() > 0) {
                    while ($row = $RS->FetchRow()) {
                        $clientConfiguration = array('username' => $row['username'],
                                                    'alias' => $row['alias']);
                    }
                }
                else{
                    $clientConfiguration = array();
                }

                if(!empty($clientConfiguration)){
                    //Mail object initialization
                    
                    $response2 = [];
                    $mail = new \SendGrid\Mail\Mail();      

                    $emailSubject = $priceListName; //'Price List';
                    $emailBody = "<p><span style=\"font-size: 12px;\">Dear Sir / Madam,</span></p><p><span style=\"font-size: 12px;\">Please click on this link to check the Price List '$priceListName'.&nbsp;</span> <a target='_blank' href='$fileActualUrl'> View Price List </a></p><p><span style=\"font-size: 12px;\"><i>Please do not reply to this email. This is an auto generated&nbsp;email.&nbsp;</i></span><br><br></p><p><span style=\"font-size: 12px;\">Kind regards</span></p><p>Finance Team</p>"; 

                    $emailDetails = array(
                        "to" => array_unique(explode(';',$invoiceEmail)),
                        "cc" => '',
                        "from" => $clientConfiguration['username'],
                        "fromName" => $clientConfiguration['alias'],
                        "subject" => $emailSubject,
                        "body" =>  $emailBody,
                        "attachment" => ''
                    );   
                
                    if($invoiceEmail){
                        try {                    
                            //Recipients
                            $mail->setFrom($emailDetails['from'], $emailDetails['fromName']);
                            for ($k = 0; $k < count($emailDetails['to']); $k++) {
                                //echo '<br>'. $emailDetails['to'][$k];
                                $mail->AddTo($emailDetails['to'][$k]);
                            }                                
                            
                            //Content
                            $mail->setSubject($emailDetails['subject']);
                            $mail->addContent("text/html",$emailDetails['body']);

                            // echo '<pre>';print_r($attachment);
                            try {
                                $result2 = $this->sendgrid->send($mail);   
                                $result2 =  (array) $result2;
                                $statusCode=[];
                                foreach ($result2 as $key => $value) {
                                    if (strpos($key, "statusCode") > -1){
                                        $statusCode['statusCode'] = $value;
                                    }
                                    else if (strpos($key, "body") > -1){
                                        $response2['body'] = json_decode($value);
                                    }
                                }

                                if ($statusCode['statusCode'] == 202){
                                    $response2['message'] =  "E-mail sent successfully";
                                    $response2['ack'] = 1;
                                    $response2['id'] = $res['id'];
                                    $sendEmailInvoicesCounter++;
                                    array_push($response2['sendEmailInvoices'],$file_name); 
                                }
                                else{
                                    $response2['mailObj'] = $mail;
                                    $response2['ack'] = 0;
                                    $response2['message'] =  $response['body']->errors[0]->message;
                                }
                                $response2['sentData'][] = $response2;                                                   
                                        
                            } catch (Exception $e) {
                                array_push($response2['sendFailedEmailInvoices'],$file_name);                                    
                            } 

                        } catch (Exception $e) {
                            $response2['configIssue'] = 1;
                            $response2['message'] =   $mail->ErrorInfo;
                            $response2['mailObj'] = $mail;
                            $response2['debug'] = $mail->smtp->smtp_errors;                            
                            $rejectedInvoicesReason .= 'Email sending Failed, ';
                            $rejectedInvoicesCounter++; 
                        }
                    }
                    else{
                        $rejectedInvoicesReason .= $customer_name.' Email is Missing, ';
                        $rejectedInvoicesCounter++; 
                    }

                    // echo $sendEmailInvoicesCounter;
                    if($sendEmailInvoicesCounter >0 && $rejectedInvoicesCounter >0){
                        $response2['ack'] = 0;
                        $response2['error'] = $rejectedInvoicesReason;
                    }
                    elseif($sendEmailInvoicesCounter >0){
                        $response2['ack'] = 1;
                    }
                    elseif($rejectedInvoicesCounter >0){
                        $response2['ack'] = 0;
                        $response2['error'] = $rejectedInvoicesReason;
                    }
                    else{
                        $response2['ack'] = 0;
                        $response2['error'] = $rejectedInvoicesReason;
                        $response2['response'] = array();
                    } 
                }
                else{

                    $response2['error'] = 'Email configuration does not exist.';  
                    $response2['rejectedInvoices'] .= 'Email configuration does not exist.';      
                    $rejectedInvoicesCounter++;   
                }
            }
            else{
                $response2['ack'] = 0; 
                $response2['file_url'] = ''; 
            }
        }
        else{
            $response2['ack'] = 0; 
            $response2['file_url'] = ''; 
        }
        // echo '<pre>';
        // print_r($response2);exit;                               
          
        return $response2; 
    }

    // price List PDF Download
    //----------------------------------------------------
    function priceListPDFDownload($attr)
    {
        $mainRec = $attr['mainRec'];  

        if($mainRec->moduleType == 1) $accountCode = $mainRec->Customer_Code;
        else $accountCode = $mainRec->Supplier_Code;

        $file_name = $accountCode.'.priceList.'.$this->arrUser['company_id'] .'.pdf';
        $basePath = UPLOAD_PATH . 'attachments/';
        $file_url = $basePath . $file_name; 

        $result = "";
        $server_output = "";
        $relatedRec = "";        
        $relatedRec->reportsDataArr = $mainRec->items;
        // $invoiceEmail = $mainRec->emailPriceList;
        $priceListName = $mainRec->name;        

        foreach($relatedRec->reportsDataArr as $singleItemRec){
           if(isset($singleItemRec->uomID) && is_array($singleItemRec->arr_units)){
               foreach($singleItemRec->arr_units as $singleUOMRec){
                   if($singleUOMRec->id == $singleItemRec->uomID){
                       $singleItemRec->UOM = $singleUOMRec->name;
                   }
               }
            }
        }

        $relatedRec->priceListName = $mainRec->name;
        $relatedRec->dateFrom = $mainRec->offer_date;
        $relatedRec->dateTo = $mainRec->offer_valid_date;  
        $relatedRec->company_name = $attr['company_name'];  
        $relatedRec->company_logo_url = $attr['company_logo_url'];
        $relatedRec->reportName = $mainRec->name;
        $relatedRec->reportType = $mainRec->name;

        $relatedRec->offered_by = $mainRec->offered_by;
        $relatedRec->moduleType = $mainRec->moduleType;
        $relatedRec->currencyCode = $mainRec->Code;

        $relatedRec->accountAddress = '';

        // if($mainRec->moduleType == 1){

        $Sql = "SELECT depot,address,address_2,city,postcode
                FROM alt_depot
                WHERE module_type = '" . $mainRec->moduleType . "' AND 
                        acc_id = '" . $mainRec->moduleID . "' AND 
                        is_primary = 1 LIMIT 1";

        //  echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($row = $RS->FetchRow()) {
                $relatedRec->accountAddress = $row['address'];
                $relatedRec->accountAddress2 = $row['address_2'];
                $relatedRec->city = $row['city'];
                $relatedRec->postcode = $row['postcode'];
            }
        }

        if($mainRec->moduleType == 1) $relatedRec->accountName = $mainRec->Customer_Name;
        else $relatedRec->accountName = $mainRec->Supplier_Name;

        $result->template->shortid = "HkgalmDSpB";
        $result->interceptorHeaders = $attr['interceptorHeaders'];
        $result->data = $relatedRec;      
        // print_r(json_encode($result));exit;

        // $url = 'http://silverowreports.azurewebsites.net/api/report';
        $url = 'https://silverowjsreport2.azurewebsites.net/api/report';

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS,json_encode($result));
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
            $response['ack'] = 1; 

            $key = hash('sha256', SECRET_KEY);
            $iv = substr(hash('sha256', SECRET_IV), 0, 16);
            $outputInvName = openssl_encrypt($file_name, SECRET_METHOD, $key, 0, $iv);
            $outputInvName = base64_encode($outputInvName);

            $response['file_url'] = WEB_PATH . '/api/setup/PriceList?alpha='.$outputInvName;
            $response2['ack'] = 1; 
            $response2['file_url'] = $response['file_url']; 
        }
        else{
            $response2['ack'] = 0; 
            $response2['file_url'] = ''; 
        }
        // echo '<pre>';
        // print_r($response2);exit;                               
          
        return $response2; 
    }
}
?>