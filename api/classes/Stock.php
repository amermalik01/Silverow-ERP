<?php
// error_reporting(E_ERROR);
require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/General.php");
require_once(SERVER_PATH . "/classes/Setup.php");

class Stock extends Xtreme
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
        $this->objsetup = new Setup($user_info);
    }

    function getInventoryGlobalData($attr)
    {
        //load from global data in single json

        $attr['page'] = 1;
        $result4 = $this->getAllProductsList($attr);//, 1

        // echo '<pre>';print_r($result4); exit;
        $response['response']['prooduct_arr'] = $result4['response'];

        if($result4['error'] == 3)
            $response['error'] = 3;
        else
            $response['error'] = NULL;

        $response['ack'] = 1;
        $response['prodlastUpdateTime'] = $result4['prodlastUpdateTime']; 
        
        return $response;
    }

    function getInventorySetupGlobalData($attr)
    {
        $invSetuplastUpdateTime = $attr['invSetuplastUpdateTime'];

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
                {
                    $response['ack'] = 1;
                    $response['error'] = 3;
                    $response['invSetuplastUpdateTime'] = $invSetuplastUpdateTime;
                    return $response;
                }
            }
        }

        //load from global data in single json

        $result1 = $this->get_all_categories($attr);
        $response['response']['cat_prodcut_arr'] = $result1['response'];

        $result2 = $this->get_all_brands($attr);
        $response['response']['brand_prodcut_arr'] = $result2['response'];

        $result3 = $this->get_all_units($attr);
        $response['response']['uni_prooduct_arr'] = $result3['response'];

        $attr['page'] = 1;

        $result5 = $this->getAllOriginCountries($attr);
        $response['response']['itemOriginCountries'] = $result5['response'];        

        $Sql = "SELECT UNIX_TIMESTAMP(NOW()) AS current_date_time";
        // echo $Sql;exit;
        $RS = $this->Conn->Execute($Sql);
        $response['invSetuplastUpdateTime'] = $RS->fields['current_date_time'];
        
        $response['ack'] = 1;
        $response['error'] = NULL;
        
        return $response;
    }

    // static	
    function delete_product($attr)
    {
        $Sql = "UPDATE product SET status=".DELETED_STATUS." WHERE id = ".$attr['id']." AND SR_CheckTransactionBeforeDelete(".$attr['id'].", ".$this->arrUser['company_id'].", 4,0) = 'success' ";
        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql, "item_gneraltab", sr_DeletePermission);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $Sql1 = "SELECT SR_CheckTransactionBeforeDelete(".$attr['id'].", ".$this->arrUser['company_id'].", 4,0) AS error_msg";
            $RS1 = $this->objsetup->CSI($Sql1);
            $response['error'] = $RS1->fields['error_msg'];
        }
        return $response;
    }

    function delete_update_status($table_name, $column, $id)
    {
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

    function delete_units_of_measure($table_name, $column, $id)
    {

        $Sql = "UPDATE ".$table_name." SET status=".DELETED_STATUS." WHERE id = ".$id." AND SR_CheckTransactionBeforeDelete(".$id.", ".$this->arrUser['company_id'].", 21,0) = 'success' ";
        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);
        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['success'] = 'Record Deleted Successfully';
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'This UOM is being used in another record!';
        }
        return $response;
    }

    function get_data_by_id($table_name, $id)
    {
        $Sql = "SELECT *
                FROM ".$table_name."
                WHERE id=".$id."
                LIMIT 1";
        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql,'inventory_setup',sr_EditPermission);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key)) unset($Row[$key]);
            }
            $response['response'] = $Row;
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function get_product_standard_volume_by_id($id)
    {
        $Sql = "SELECT * FROM product_volume_discount	WHERE id='".$id."' LIMIT 1";
        //echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key)) unset($Row[$key]);
            }

            $Row['AddedOn'] = $this->objGeneral->convert_unix_into_date($Row['AddedOn']);
            $Row['ChangedOn'] = $this->objGeneral->convert_unix_into_date($Row['ChangedOn']);
            $Row['date_added'] = $this->objGeneral->convert_unix_into_date($Row['date_added']);
            $Row['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
            $Row['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);

            if($Row['sale_volume_item_gl_id']>0)
                $Row['sale_volume_item_gl_codes'] = $this->get_glaccount_byid($Row['sale_volume_item_gl_id']);
            else
                $Row['sale_volume_item_gl_codes'] = '';

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;

        } else $response['response'] = array();

        //print_r($response);exit;
        return $response;
    }

    function get_product_by_id($id)
    {
        //$Sql = "SELECT * FROM product	WHERE id='$id' LIMIT 1";
        /* $Sql = "SELECT  prd.*,
                        SR_CURRENT_OR_AVAILABLE_STOCK(
                        prd.id,prd.company_id,1)  AS current_stock1,
                        SR_CURRENT_OR_AVAILABLE_STOCK(
                        prd.id,prd.company_id,2)  AS available_stock1,
                        SR_CURRENT_OR_AVAILABLE_STOCK(
                        prd.id,prd.company_id,3)  AS allocated_stock1,
                        SR_CURRENT_OR_AVAILABLE_STOCK(
                        prd.id,prd.company_id,4)  AS unallocated_stock1,
                        SR_CURRENT_OR_AVAILABLE_STOCK(
                        prd.id,prd.company_id,5)  AS total_sales_order_stock1,
                        SR_CURRENT_OR_AVAILABLE_STOCK(
                        prd.id,prd.company_id,6)  AS total_purchase_order_stock1,
                        SR_CURRENT_OR_AVAILABLE_STOCK(
                        prd.id,prd.company_id,7)  AS total_sales_quote_stock1,
                        ( SELECT Count(uom_setup.id)  
                          FROM units_of_measure_setup as uom_setup
                          where uom_setup.product_id=prd.id) as uom_setup_status,
                        ( SELECT Count(pwd.id)  
                          FROM product_warehouse_location as pwd
                          where pwd.item_id=prd.id and pwd.status > 0 AND
                                pwd.company_id=" . $this->arrUser['company_id'] . ") as warehouseCount  
                FROM productcache as prd	
                WHERE prd.id='$id' AND prd.company_id = ".$this->arrUser['company_id']."  "; */
        
        $Sql = "SELECT  prd.*,
                        (CASE WHEN (prd.rawmaterialproduct = 1) THEN  SR_STOCK_RAW_MATERIAL(prd.id,prd.company_id,1)
                            ELSE SR_CURRENT_OR_AVAILABLE_STOCK(prd.id,prd.company_id,1)
                            END) AS current_stock1,
                        
                        (CASE WHEN (prd.rawmaterialproduct = 1) THEN  SR_STOCK_RAW_MATERIAL(prd.id,prd.company_id,2)
                            ELSE SR_CURRENT_OR_AVAILABLE_STOCK(prd.id,prd.company_id,2)
                            END) AS available_stock1,
                        
                        (CASE WHEN (prd.rawmaterialproduct = 1) THEN  SR_STOCK_RAW_MATERIAL(prd.id,prd.company_id,3)
                            ELSE SR_CURRENT_OR_AVAILABLE_STOCK(prd.id,prd.company_id,3)
                            END) AS allocated_stock1,
                        
                        (CASE WHEN (prd.rawmaterialproduct = 1) THEN  SR_STOCK_RAW_MATERIAL(prd.id,prd.company_id,4)
                            ELSE SR_CURRENT_OR_AVAILABLE_STOCK(prd.id,prd.company_id,4)
                            END) AS unallocated_stock1,
                        
                        (CASE WHEN (prd.rawmaterialproduct = 1) THEN  SR_STOCK_RAW_MATERIAL(prd.id,prd.company_id,5)
                            ELSE SR_CURRENT_OR_AVAILABLE_STOCK(prd.id,prd.company_id,5)
                            END) AS total_sales_order_stock1,
                        
                        (CASE WHEN (prd.rawmaterialproduct = 1) THEN  SR_STOCK_RAW_MATERIAL(prd.id,prd.company_id,6)
                            ELSE SR_CURRENT_OR_AVAILABLE_STOCK(prd.id,prd.company_id,6)
                            END) AS total_purchase_order_stock1,
                        
                        (CASE WHEN (prd.rawmaterialproduct = 1) THEN  SR_STOCK_RAW_MATERIAL(prd.id,prd.company_id,7)
                            ELSE SR_CURRENT_OR_AVAILABLE_STOCK(prd.id,prd.company_id,7)
                            END) AS total_sales_quote_stock1,

                        ( SELECT COUNT(uom_setup.id)  
                          FROM units_of_measure_setup as uom_setup
                          WHERE uom_setup.product_id=prd.id) as uom_setup_status,
                        
                        ( SELECT gtipNo  
                          FROM product AS p
                          WHERE p.id=prd.id) as gtipNo,

                          SR_CURRENT_OR_AVAILABLE_STOCK_ONRoute(prd.id,prd.company_id,2) AS total_stock_on_route, 

                        ( SELECT COUNT(pwd.id)  
                          FROM product_warehouse_location as pwd
                          WHERE pwd.item_id=prd.id and pwd.status > 0 AND
                                pwd.company_id=" . $this->arrUser['company_id'] . ") as warehouseCount  
                FROM productcache as prd	
                WHERE prd.id='".$id."' AND prd.company_id = ".$this->arrUser['company_id']."  ";

        /* $subQueryForBuckets = " SELECT  c.id
                                FROM productcache  c
                                WHERE c.id IS NOT NULL AND 
                                      c.company_id = " . $this->arrUser['company_id'] . "";

        //$subQueryForBuckets = $this->objsetup->whereClauseAppender($subQueryForBuckets, 11);
        //echo $subQueryForBuckets;exit; 

        $Sql .= " AND prd.id IN ($subQueryForBuckets) "; */

        $Sql .= " LIMIT 1 ";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql, "item_gneraltab", sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key)) unset($Row[$key]);
            }

            $Row['AddedOn'] = $this->objGeneral->convert_unix_into_date($Row['AddedOn']);
            $Row['ChangedOn'] = $this->objGeneral->convert_unix_into_date($Row['ChangedOn']);
            $Row['date_added'] = $this->objGeneral->convert_unix_into_date($Row['date_added']);
            $Row['margin_end_date'] = $this->objGeneral->convert_unix_into_date($Row['margin_end_date']);
            $Row['margin_start_date'] = $this->objGeneral->convert_unix_into_date($Row['margin_start_date']);

            /* $Row['avg_cost_edate'] = $this->objGeneral->convert_unix_into_date($Row['avg_cost_edate']);
            $Row['avg_cost_sdate'] = $this->objGeneral->convert_unix_into_date($Row['avg_cost_sdate']); */

            $Row['purchase_item_gl_codes'] = '';
            $Row['sale_item_gl_codes'] = '';

            $Row['reorder_quantity'] = (int)$Row['reorder_quantity'];
            $Row['available_stock'] = (int)$Row['available_stock'];

            $attr=array();
            $attr['product_id']=$Row['id'];
            $Row['substituteProducts'] = $this->get_sel_substitute_products_listing($attr);            
            $Row['rawMaterialEndProducts'] = $this->get_sel_raw_material_end_prod($attr);            

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else{
            $response['response'] = array();
            $response['bucketFail'] = 1;

        } 

        //print_r($response);exit;
        return $response;
    }

    function getItemPurchaseInfo($id)
    {
        $Sql = "SELECT  prd.costing_method_id,
                        prd.overall_avg_cost,
                        prd.standard_purchase_cost,
                        prd.purchase_item_gl_code,
                        prd.purchase_item_gl_id,                        
                        prd.avg_cost_edate,
                        prd.avg_cost_sdate,
                        prd.vat_chk,
                        prd.confidential,
                        SR_Calculate_Cost_FIFO(prd.id, 1, " . $this->arrUser['company_id'] . ") AS fifo_cost,
                        0 AS ma_cost,
                        (SELECT IFNULL(id, 0) FROM warehouse_allocation WHERE product_id=prd.id AND (purchase_status = 3 OR journal_status = 2 OR opBalncID > 0) LIMIT 1) AS item_transactions
                FROM sr_product_sel as prd	
                WHERE prd.id='".$id."' LIMIT 1";

        //SR_Calculate_Cost_Moving_Avg(prd.id, " . $this->arrUser['company_id'] . ") AS ma_cost,

        // echo $Sql;exit;
        
        $RS = $this->objsetup->CSI($Sql, "item_purchasetab", sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();

            foreach ($Row as $key => $value) {
                if (is_numeric($key)) unset($Row[$key]);
            }            
           // remove from item because we are uploading it from supplier price offer items 
          //  $Row['purchaseItemAdditionalCost'] = $this->getItemPurchaseAdditionalCost($id);
          
           /* if($Row['avg_cost_edate']>0){
               $sdate = $Row['avg_cost_sdate'];
               $edate = $Row['avg_cost_edate'];
           }
           else{ */
               $result8 = $this->objsetup->get_financial_settings();
        
               $sdate = ($result8['response'][0]['year_start_date'] != "") ? $result8['response'][0]['year_start_date'] : 0;
               $edate = ($result8['response'][0]['year_end_date'] != "") ? $result8['response'][0]['year_end_date']: 0;
               // }

            /* $sql_avg = "  SELECT 
                            CASE WHEN sd.qty>0 THEN SUM(sd.qty*sd.unit_price)/SUM(sd.qty)
                            ELSE 0
                            END  AS avgcost		
		                    FROM srm_invoice_detail sd
                            WHERE sd.status=1 AND 
                                  sd.invoice_type IN(2,3) AND 
                                  sd.product_id = '$id' AND 
                                  (sd.invoice_order_date BETWEEN $sdate AND $edate )"; */
            $sql_avg = "SELECT IFNULL(pp.standard_price,0) AS avgcost
                        FROM product_price AS pp 
                        WHERE pp.product_id=".$id." AND 
                                pp.type = 2 AND 
                                UNIX_TIMESTAMP (NOW()) BETWEEN pp.start_date AND pp.end_date LIMIT 1 ";

            // echo $sql_avg; exit;
            /* 
            case SUM(sd.qty*sd.unit_price)/SUM(sd.qty) as avgcost */

           
            $rs_avg = $this->objsetup->CSI($sql_avg);
            // $avg = $rs_count->fields['avg'];
            $avg = $rs_avg->fields['avgcost'];

            $SQL_Purchase_Info = "  SELECT i.id, id.product_id, id.product_name, 
                                        (id.unit_price/IFNULL(i.currency_rate,0)) AS unit_price, 
                                        id.supplier_id, 
                                        (SELECT supplier_code FROM srm WHERE id = id.supplier_id) AS supplier_code, 
                                        (SELECT NAME FROM srm WHERE id = id.supplier_id) AS supplier_name, 
                                        (CASE WHEN i.type = 2 OR i.type = 1 THEN i.invoice_code
                                              ELSE i.order_code
                                              END) AS code,
                                        (CASE WHEN i.type = 2 OR i.type = 1 THEN 'Purchase Invoice No.'
                                              ELSE 'Purchase Order No.'
                                              END) AS ptype, i.invoice_date, i.type
                                    FROM srm_invoice_detail id JOIN srm_invoice i ON id.invoice_id = i.id AND id.product_id = ".$id."
                                    WHERE id.type = 0  AND i.company_id = " . $this->arrUser['company_id'] . " 
                                    ORDER BY i.id DESC , i.invoice_date DESC 
                                    LIMIT 1;";

            $RS_Purchase_Info = $this->objsetup->CSI($SQL_Purchase_Info);
            if ($RS_Purchase_Info->RecordCount() > 0) {
                $Row['pi_id'] = $RS_Purchase_Info->fields['id'];
                $Row['pi_product_name'] = $RS_Purchase_Info->fields['product_name'];
                $Row['pi_unit_price'] = Round($RS_Purchase_Info->fields['unit_price'],5);
                $Row['pi_supplier_id'] = $RS_Purchase_Info->fields['supplier_id'];
                $Row['pi_supplier_code'] = $RS_Purchase_Info->fields['supplier_code'];
                $Row['pi_supplier_name'] = $RS_Purchase_Info->fields['supplier_name'];
                $Row['pi_code'] = $RS_Purchase_Info->fields['code'];
                $Row['pi_ptype'] = $RS_Purchase_Info->fields['ptype'];
                $Row['pi_invoice_date'] =  $this->objGeneral->convert_unix_into_date($RS_Purchase_Info->fields['invoice_date']);
                $Row['pi_is_last_used'] = 1;
            } else {
                $Row['pi_is_last_used'] = 0;
            }

            $Row['avg_cost_sdate'] = $this->objGeneral->convert_unix_into_date($sdate);
            $Row['avg_cost_edate'] = $this->objGeneral->convert_unix_into_date($edate);    
            $Row['avg'] = $avg;
            $temp_attr['type'] = 2;
            $temp_attr['product_id'] = $id;
            $Row['purchase_price'] = self::getItemsalesInfo($temp_attr);
            $Row['ma_cost'] = Round($Row['ma_cost'],5);

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else 
            $response['response'] = array();

            /* SELECT sd.invoice_order_date,sd.id
                FROM srm_invoice_detail sd 
                WHERE sd.status=1 AND sd.invoice_type IN(2,3) AND sd.product_id = '398' ORDER BY sd.id DESC LIMIT 1 */

        //print_r($response);exit;
        return $response;
    }

    function getItemPurchaseAdditionalCost($itema)
    {
        $Sql = "SELECT rf.id, rf.title as costTitle,(select itemAdditional.value 
                                        from item_purchase_additional_cost as itemAdditional
                                        WHERE itemAdditional.itemID='".$itema. "' AND 
                                              itemAdditional.company_id=" . $this->arrUser['company_id'] . " AND 
                                              itemAdditional.additionalCostID=rf.id) as costValue
                FROM active_item_additional_cost ac  
                LEFT JOIN item_additional_cost rf ON rf.id= ac.ref_id  
                WHERE ac.company_id=" . $this->arrUser['company_id'] . "
                      order by ac.ref_id ASC";
        
        //echo $Sql;exit;        
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['costTitle'] = $Row['costTitle'];
                $result['costValue'] = $Row['costValue'];
                $response[] = $result;
            }
        } 
        return $response;
    }

    function addItemPurchaseInfo($arr_attr)
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
        // echo "<pre>"; print_r($arr_attr); exit;
        $product_id = $arr_attr['product_id'];

        $additionalCostAffectedRows = $this->addItemPurchaseAdditionalCost($arr_attr);
        //exit;
        
        $costing_method_ids     = (isset($arr_attr['costing_method_ids']) && $arr_attr['costing_method_ids']!='')?$arr_attr['costing_method_ids']:0;     
        $overall_avg_costs      = (isset($arr_attr['overall_avg_costs']) && $arr_attr['overall_avg_costs']!='')?$arr_attr['overall_avg_costs']:0;
        $vat_chk                = (isset($arr_attr['vat_chk']) && $arr_attr['vat_chk']!='')?$arr_attr['vat_chk']:0;
        $confidential           = (isset($arr_attr['confidential']) && $arr_attr['confidential']!='')?$arr_attr['confidential']:0;
        $purchase_item_gl_id    = (isset($arr_attr['purchase_item_gl_id']) && $arr_attr['purchase_item_gl_id']!='')?$arr_attr['purchase_item_gl_id']:0;
        
        
        
        
        $Sql = "UPDATE product
                       SET
                            costing_method_id='" . $costing_method_ids  . "',
                            overall_avg_cost='" . $overall_avg_costs . "',
                            vat_chk = '" . $vat_chk . "',
                            confidential = '" . $confidential . "',
                            avg_cost_sdate='" . $this->objGeneral->convert_date($arr_attr['avg_cost_sdate']) . "',
                            avg_cost_edate='" . $this->objGeneral->convert_date($arr_attr['avg_cost_edate']) . "',
                            purchase_item_gl_code='" . $arr_attr['purchase_item_gl_code'] . "',
                            purchase_item_gl_id='" . $purchase_item_gl_id . "'
		        WHERE id = " . $product_id . "  Limit 1"; 

        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql, "item_purchasetab", sr_AddEditPermission);

        
        self::addItemSalesInfo($arr_attr);
        self::addProductPurchaseCost($arr_attr);
        if ($this->Conn->Affected_Rows() > 0 || $additionalCostAffectedRows>0) {
            $response['product_id'] = $product_id;
            $response['ack'] = 1;
            $response['error'] = 'Record Updated Successfully';
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
            
            $srLogTrace = array();

            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['Parameter2'] = 'parent_id:' . $product_id;

            $this->objsetup->SRTraceLogsPHP($srLogTrace);

        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Not Updated';
            $response['msg'] = $message;

            $srLogTrace = array();

            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['Parameter2'] = 'parent_id:' . $product_id;
            $srLogTrace['ErrorMessage'] = 'Record Not Updated';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }
        return $response;
    }

    /* item purchase costs */

    function getProductPurchaseCost($attr)
    {
        $date = $start_date = $this->objGeneral->convert_date(date("Y-m-d"));
        $Sql = "SELECT *,
            (CASE
                WHEN currency_id = ".$attr['defaultCurrency']." THEN
                    amount
                ELSE
                amount/SR_GetConversionRateByDate(".$date.", currency_id, ". $this->arrUser['company_id'].") 
                    END) AS amount_conv
         FROM product_purchase_cost where product_id = ".$attr['product_id']." ";
        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql, "item_purchasetab", sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            while($Row = $RS->FetchRow())
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);
                }
                $response['response'][] = $Row;
            }

            $response['ack'] = 1;
        }
        else
            $response['ack'] = 0;
        
        return $response;
    }

    function addProductPurchaseCost($attr)
    {
        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['Parameter2'] = 'product_id:'.$attr['product_id'];

        $this->objsetup->SRTraceLogsPHP($srLogTrace);
    
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
        $product_id = $attr['product_id'];
        
        foreach($attr['item_costs'] as $item)
        {
            $uom_id             = 0;//($item->uom_id != "") ? $item->uom_id->id :'0';
            $cost_id= ($item->cost_id != "" && $item->cost_id->id != null) ? $item->cost_id->id :'0';
            $currency_id        = ($item->currency_id != "" && $item->currency_id->id != null) ? $item->currency_id->id :'0';
            $amount             = ($item->amount != "") ? round($item->amount,2) :'0';
            
            if($item->id > 0)
            {
                $Sql = "UPDATE product_purchase_cost
                        SET
                            uom_id = '" . $uom_id  . "',
                            cost_id = '" . $cost_id  . "',
                            currency_id = '" . $currency_id  . "',
                            amount = '" . $amount  . "',
                            ChangedBy='" . $this->arrUser['id']  . "',
                            ChangedOn=UNIX_TIMESTAMP (NOW())
		                WHERE id = " . $item->id . "  Limit 1"; 
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            }
            else
            {
                $Sql = "INSERT INTO product_purchase_cost
                        SET
                        product_id = '" .$product_id  . "',
                        uom_id = '" . $uom_id  . "',
                        cost_id = '" . $cost_id  . "',
                        currency_id = '" . $currency_id  . "',
                        amount = '" . $amount  . "',
                        company_id='" . $this->arrUser['company_id'] . "',
                        AddedBy='" . $this->arrUser['id'] . "',
                        AddedOn=UNIX_TIMESTAMP (NOW()),
                        ChangedBy='" . $this->arrUser['id']  . "',
                        ChangedOn=UNIX_TIMESTAMP (NOW())";
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            }
        }

        $response['product_id'] = $product_id;
        $response['ack'] = 1;
        $response['error'] = 'Record Updated Successfully';
        $this->Conn->commitTrans();
        $this->Conn->autoCommit = true;
        
        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Exit';
        $srLogTrace['Parameter2'] = 'parent_id:' . $product_id;

        $this->objsetup->SRTraceLogsPHP($srLogTrace);
       
        return $response;
    }

    function deleteProductPurchaseCost($attr){
        $Sql = "DELETE FROM product_purchase_cost where id = ".$attr['id'];
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        }
        else
            $response = array();
        return $response;
    }

    function getConvertionRate($attr)
    {
        $date = $start_date = $this->objGeneral->convert_date(date("Y-m-d"));
        $Sql = "SELECT SR_GetConversionRateByDate('".$date."', '" . $attr['currency_id'] . "', '" . $this->arrUser['company_id'] . "') as conRate";
        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while($Row = $RS->FetchRow())
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);
                }
                $response['response'] = $Row;
            }

            $response['ack'] = 1;
        }
        else
            $response['ack'] = 0;
        
        return $response;
    }
    /* endsd */

    function get_supplier_prices_for_item($attr)
    {
        $start_date = $this->objGeneral->convert_date($attr['start_date']);
        $end_date = $this->objGeneral->convert_date($attr['end_date']);

        $product_id = ($attr['product_id'] != '') ? $attr['product_id'] : '0';

        $Sql = "SELECT s.id supplier_id, s.supplier_code, s.name AS supplier_name, po.name AS po_name, po.id AS po_id 
                FROM srm AS s, priceoffer AS po, priceofferitem AS poi
                WHERE 
                    po.moduleID = s.id AND 
                    po.id = poi.priceID AND
                    po.moduleType = 2 AND
                    po.priceType IN (2, 3) AND
                    po.start_date >= ".$start_date." AND
                    po.end_date <= ".$end_date." AND
                    poi.itemID = ".$product_id."
                    ";
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while($Row = $RS->FetchRow())
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);
                }         
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else
            $response['ack'] = 0;

        return $response;
    }

    function addItemPurchaseAdditionalCost($arr_attr)
    {
        // echo "<pre>"; print_r($arr_attr); exit;

        $product_id = $arr_attr['product_id'];
        $purchaseItemAdditionalCostArray = $arr_attr['purchaseItemAdditionalCost'];

        $count = 0;

        for($i=0; $i<sizeof($purchaseItemAdditionalCostArray); $i++){

            $costID = $purchaseItemAdditionalCostArray[$i]->id;
            $costTitle = $purchaseItemAdditionalCostArray[$i]->costTitle;
            $costValue = $purchaseItemAdditionalCostArray[$i]->costValue;

            $data_pass = "  tst.additionalCostID='".$costID."' and  tst.itemID='".$product_id."'";
            $total = $this->objGeneral->count_duplicate_in_sql('item_purchase_additional_cost', $data_pass, $this->arrUser['company_id']);

            if ($total > 0) {

                $Sql = "UPDATE item_purchase_additional_cost
                                            SET
                                                value='" . $costValue  . "',
                                                ChangedBy='" . $this->arrUser['id']  . "',
                                                ChangedOn=UNIX_TIMESTAMP (NOW())
                                            WHERE additionalCostID = '" . $costID . "' AND  
                                                  itemID='".$product_id."' AND
                                                  company_id='".$this->arrUser['company_id']."'
                                            Limit 1"; 
            } 
            else {

                $Sql = "INSERT INTO item_purchase_additional_cost
                                        SET
                                            additionalCostID='" . $costID  . "',
                                            value='" . $costValue  . "',
                                            itemID='" . $product_id  . "',
                                            status='1',
                                            user_id='" . $this->arrUser['id'] . "',
                                            company_id='" . $this->arrUser['company_id'] . "',
                                            AddedBy='" . $this->arrUser['id'] . "',
                                            AddedOn=UNIX_TIMESTAMP (NOW()),
                                            ChangedBy='" . $this->arrUser['id']  . "',
                                            ChangedOn=UNIX_TIMESTAMP (NOW())";                               
            } 
            //echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);

            if ($this->Conn->Affected_Rows() > 0)
                $count++;            
        }
        return $count;
    }

    function getRecomendedPurchasePrice($attr)
    {
        // print_r($attr);
        $orderDate = $this->objGeneral->convert_date($attr['orderDate']);
        // echo $orderDate = $attr['orderDate'];
        /* $Sql = "SELECT prdPrice.product_id,
                       prdPrice.standard_price,
                       prdPrice.min_max_sale_price AS MaxPrice,
                       prdPrice.min_qty,
                       prdPrice.max_qty,
                       prdPrice.start_date
                FROM product as prd
                LEFT JOIN product_price AS prdPrice on prd.id = prdPrice.product_id
                WHERE prdPrice.type = 2 AND 
                      prd.company_id='" . $this->arrUser['company_id'] . "' AND
                      $orderDate BETWEEN start_date AND end_date"; */

        $Sql = "SELECT prdPrice.product_id,
                       prdPrice.standard_price,
                       prdPrice.min_max_sale_price AS MaxPrice,
                       prdPrice.uom_id,
                       prdPrice.min_qty,
                       prdPrice.max_qty,
                       prdPrice.start_date
                FROM product as prd
                LEFT JOIN product_price AS prdPrice on prd.id = prdPrice.product_id
                WHERE prdPrice.type = 2 AND 
                      prd.company_id='" . $this->arrUser['company_id'] . "' AND
                      ".$orderDate." BETWEEN (FLOOR(start_date/86400)*86400) AND (FLOOR(end_date/86400)*86400)";

        // echo $Sql;exit; 

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while($Row = $RS->FetchRow())
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);
                }         

                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else 
            $response['response'] = array();

        // print_r($response);exit;
        return $response;
    }

    function getProductUOM($attr)
    {
        // print_r($attr);
        // $orderDate = $this->objGeneral->convert_date($attr['orderDate']);

        $price_dates_check = '';

        if(isset($attr['start_date']) && $attr['start_date'] != '' && isset($attr['end_date']) && $attr['end_date'] != '')
        {
            $price_dates_check = $this->objGeneral->convert_date($attr['start_date']). " >= (FLOOR(prdPrice.start_date/86400)*86400) AND ".$this->objGeneral->convert_date($attr['end_date']). " <= (FLOOR(prdPrice.end_date/86400)*86400) ";
        }


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
                        c.company_id=" . $this->arrUser['company_id'] . "
                GROUP BY c.product_id,us.title ASC 
                ORDER BY c.product_id,c.id ASC";

        // echo $Sqla;exit; 

        $RSa = $this->objsetup->CSI($Sqla);

        if ($RSa->RecordCount() > 0) {
            while($Rowa = $RSa->FetchRow())
            {
                foreach ($Rowa as $key => $value) {
                    if (is_numeric($key)) unset($Rowa[$key]);
                }         

                $response['responseUOM'][] = $Rowa;
            }
        }
        // $response['ack'] = 1;
        //     $response['error'] = NULL;
            
        $Sql = "SELECT prdPrice.product_id,
                       prdPrice.standard_price,
                       prdPrice.min_max_sale_price AS MaxPrice,
                       prdPrice.uom_id,
                       prdPrice.min_qty,
                       prdPrice.max_qty,
                       prdPrice.start_date
                FROM product as prd
                LEFT JOIN product_price AS prdPrice on prd.id = prdPrice.product_id
                WHERE prdPrice.type = 1 AND 
                      prd.company_id='" . $this->arrUser['company_id'] . "' AND
                      ".$price_dates_check." ";

        // echo $Sql;exit; 

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while($Row = $RS->FetchRow())
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);
                }         

                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else 
            $response['response'] = array();

        // print_r($response);exit;
        return $response;
    }

    function getItemsalesInfo($attr)
    {
        $Sql = "SELECT  *
                FROM product_price 
                WHERE type = ".$attr['type']." and product_id=".$attr['product_id']." ";

        // echo $Sql;exit; 
        $RS = $this->objsetup->CSI($Sql, "item_saletab", sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            while($Row = $RS->FetchRow())
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);
                }            
                
                $Row['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                $Row['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);    
                if($attr['type'] == 1)
                    $Row['volume_discount_arr'] = self::get_item_price_volume($Row['id']);
                
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else 
            $response['response'] = array();

        // print_r($response);exit;
        return $response;
    }

    function get_item_price_volume($price_id)
    {
        $response = array();
        $Sql = "SELECT  * 
                FROM product_price_volume	
                WHERE price_id=".$price_id;

        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while($Row = $RS->FetchRow())
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);
                }
                $Row['discount'] = floatval($Row['discount']);
                $Row['min_qty'] = floatval($Row['min_qty']);
                $response[] = $Row;
            }
        }
        return $response;
    }
    function get_glaccount_byid($acc_id)
    {

        $Sql = "SELECT account_code,name
				FROM company_gl_accounts
				WHERE id='".$acc_id."'
				LIMIT 1";
        // echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            return $Row["account_code"] . " - " . $Row["name"];
        }
        return 0;
    }

    function addItemSalesInfo($arr_attr)
    {
        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['Parameter2'] = 'product_id:'.$arr_attr['product_id'];
        $srLogTrace['Parameter3'] = 'type:'.$arr_attr['type'];

        $this->objsetup->SRTraceLogsPHP($srLogTrace);

        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
        // echo "<pre>"; print_r($arr_attr); exit;
        $product_id = $arr_attr['product_id'];
        $type       = $arr_attr['type'];
        
        foreach($arr_attr['price_items'] as $price_item)
        {
            $uom_id             = ($price_item->uom_id != "") ? $price_item->uom_id->id :'0';
            $discount_type      = ($price_item->discount_type != "" && $price_item->discount_type->id != null) ? $price_item->discount_type->id :'0';
            $start_date         = ($price_item->start_date != "") ? $this->objGeneral->convert_date($price_item->start_date) :'0';
            $end_date           = ($price_item->end_date != "") ? $this->objGeneral->convert_date($price_item->end_date) :'0';
            $standard_price     = ($price_item->standard_price != "") ? $price_item->standard_price :'0';
            $min_max_sale_price = ($price_item->min_max_sale_price != "") ? $price_item->min_max_sale_price :'0';
            $min_qty            = ($price_item->min_qty != "") ? $price_item->min_qty :'0';
            $max_qty            = ($price_item->max_qty != "") ? $price_item->max_qty :'0';
            
            

            if($price_item->id > 0)
            {
                $Sql = "UPDATE product_price
                        SET
                            uom_id = '" . $uom_id  . "',
                            start_date = '" . $start_date  . "',
                            end_date = '" . $end_date  . "',
                            discount_type = '" . $discount_type  . "',
                            standard_price = '" . $standard_price  . "',
                            min_max_sale_price = '" . $min_max_sale_price  . "',
                            min_qty = '" . $min_qty  . "',
                            max_qty = '" . $max_qty  . "'
		                WHERE id = " . $price_item->id . "  Limit 1"; 
                // echo $Sql;exit;

                $RS = $this->objsetup->CSI($Sql, "item_saletab", sr_AddEditPermission);


                if($type == 1)
                {
                    foreach($price_item->volume_discount_arr as $item_volume)
                    {
                        $discount = ($item_volume->discount !='') ? $item_volume->discount : '0';
                        $min_qty = ($item_volume->min_qty !='') ? $item_volume->min_qty : '0';

                        if($item_volume->id > 0)
                        {
                            $Sql1 = "UPDATE product_price_volume
                            SET
                                price_id = '" .  $price_item->id. "',
                                discount = '" . $discount . "',
                                min_qty = '" . $min_qty  . "'
                                WHERE id = " . $item_volume->id . "  Limit 1";
                            $RS1 = $this->objsetup->CSI($Sql1);
                        }
                        else
                        {
                            $Sql1 = "INSERT INTO product_price_volume
                                                    SET
                                                        price_id = '" .  $price_item->id. "',
                                                        discount = '" . $discount . "',
                                                        min_qty = '" . $min_qty."',
                                                        user_id='" . $this->arrUser['id'] . "',
                                                        company_id='" . $this->arrUser['company_id'] . "'";
                            // echo $Sql1;exit;
                            $RS1 = $this->objsetup->CSI($Sql1);
                        }
                    }       
                } 
            }
            else
            {
                $Sql = "INSERT INTO product_price
                                    SET
                                        product_id = '" .$product_id  . "',
                                        type = '" . $type . "',
                                        uom_id = '" . $uom_id  . "',
                                        start_date = '" . $start_date  . "',
                                        end_date = '" . $end_date  . "',
                                        discount_type = '" . $discount_type  . "',
                                        standard_price = '" . $standard_price  . "',
                                        min_max_sale_price = '" . $min_max_sale_price  . "',
                                        min_qty = '" . $min_qty  . "',
                                        max_qty = '" . $max_qty."',
                                        user_id='" . $this->arrUser['id'] . "',
                                        company_id='" . $this->arrUser['company_id'] . "'"; 
                // echo $Sql;exit;
                
                $RS = $this->objsetup->CSI($Sql, "item_saletab", sr_AddEditPermission);

                $id = $this->Conn->Insert_ID();
                if($type == 1)
                {
                    foreach($price_item->volume_discount_arr as $item_volume)
                    {
                        $discount = ($item_volume->discount !='') ? $item_volume->discount : '0';
                        $min_qty = ($item_volume->min_qty !='') ? $item_volume->min_qty : '0';

                        if($item_volume->id > 0)
                        {
                            $Sql1 = "UPDATE product_price_volume
                            SET
                                price_id = '" .  $id. "',
                                discount = '" . $discount . "',
                                min_qty = '" . $min_qty  . "'
                                WHERE id = " . $item_volume->id . "  Limit 1";
                            $RS1 = $this->objsetup->CSI($Sql1);
                        }
                        else 
                        {
                            
                            $Sql1 = "INSERT INTO product_price_volume
                            SET
                                price_id = '" .  $id. "',
                                discount = '" . $discount . "',
                                min_qty = '" . $min_qty  . "'";
                            $RS1 = $this->objsetup->CSI($Sql1);
                        }
                    }       
                } 
            }
        }
        
        if ($this->Conn->Affected_Rows() > 0) {
            $response['product_id'] = $product_id;
            $response['ack'] = 1;
            $response['error'] = 'Record Updated Successfully';
             $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
            
            $srLogTrace = array();

            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['Parameter2'] = 'parent_id:' . $product_id;

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Not Updated';
            $response['msg'] = $message;

            $srLogTrace = array();

            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['Parameter2'] = 'parent_id:' . $product_id;
            $srLogTrace['ErrorMessage'] = 'Record Not Updated';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }
        return $response;
    }   
    function addItemPriceOfferVolume($attr)
    {
        $id = 0;
        if($attr['id'] > 0)
        {
            $Sql1 = "UPDATE product_price_volume
                                    SET
                                        discount = '" . $attr['discount'] . "',
                                        min_qty = '" . $attr['min_qty']  . "'
                                        WHERE id = " . $attr['id']  . "  Limit 1";
            $RS1 = $this->objsetup->CSI($Sql1);

            $RS1 =  $this->objsetup->CSI($Sql1, "item_margin", sr_AddEditPermission);
            if(is_array($RS1) && $RS1['Error'] == 1){
                return $RS1;
            }
            else if (is_array($RS1) && $RS1['Access'] == 0){
                return $RS1;
            }

            if($this->Conn->Affected_Rows() > 0)
                $id = $attr['id'];
        }
        else
        {
            $price_id = ($attr['price_id'] != 0 ) ? $attr['price_id'] : 'NULL';
            $Sql1 = "INSERT INTO product_price_volume
                                    SET
                                        price_id = " .  $price_id. ",
                                        discount = '" . $attr['discount'] . "',
                                        min_qty = '" . $attr['min_qty']."'";

            $RS1 =  $this->objsetup->CSI($Sql1, "item_margin", sr_AddEditPermission);
            if(is_array($RS1) && $RS1['Error'] == 1){
                return $RS1;
            }
            else if (is_array($RS1) && $RS1['Access'] == 0){
                return $RS1;
            }

            $id = $this->Conn->Insert_ID();

        }
        if ($id> 0) {
            $response['id'] = $id;
            $response['ack'] = 1;
            $response['error'] = 'Record Updated Successfully';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Not Updated';
            $response['msg'] = $message;
        }
        return $response;
    }
    function deleteItemPriceOffer($attr){
        $Sql = "DELETE FROM product_price where id = ".$attr['id']."";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        }
        else
            $response = array();
        return $response;
    }
    
    function deleteItemPriceOfferVolume($attr)
    {
        $Sql = "DELETE FROM product_price_volume where id = ".$attr['id']."";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        }
        else
            $response = array();
        return $response;
    }

    function getItemMarginalAnalysis($attr)
    {
        $Sql = "SELECT * from product_marginal_analysis where product_id = ".$attr['product_id']." ";
        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql, "item_margin", sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            while($Row = $RS->FetchRow())
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);
                }
                $response['response'][] = $Row;
            }

            $response['ack'] = 1;
        }
        else
            $response['ack'] = 0;
        
        return $response;
    }

    function addItemMarginalAnalysis($attr)
    {
        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['Parameter2'] = 'product_id:'.$attr['product_id'];

        $this->objsetup->SRTraceLogsPHP($srLogTrace);
    
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
        $product_id = $attr['product_id'];
        
        foreach($attr['items'] as $item)
        {
            $uom_id             = ($item->uom_id != "") ? $item->uom_id->id :'0';
            $marginal_analysis_id= ($item->marginal_analysis_id != "" && $item->marginal_analysis_id->id != null) ? $item->marginal_analysis_id->id :'0';
            $currency_id        = ($item->currency_id != "" && $item->currency_id->id != null) ? $item->currency_id->id :'0';
            $amount             = ($item->amount != "") ? $item->amount :'0';
            
            if($item->id > 0)
            {
                $Sql = "UPDATE product_marginal_analysis
                        SET
                            uom_id = '" . $uom_id  . "',
                            marginal_analysis_id = '" . $marginal_analysis_id  . "',
                            currency_id = '" . $currency_id  . "',
                            amount = '" . $amount  . "'
		                WHERE id = " . $item->id . "  Limit 1"; 
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            }
            else
            {
                $Sql = "INSERT INTO product_marginal_analysis
                        SET
                        product_id = '" .$product_id  . "',
                        uom_id = '" . $uom_id  . "',
                        marginal_analysis_id = '" . $marginal_analysis_id  . "',
                        currency_id = '" . $currency_id  . "',
                        amount = '" . $amount  . "'"; 
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            }
        }

        $response['product_id'] = $product_id;
        $response['ack'] = 1;
        $response['error'] = 'Record Updated Successfully';
        $this->Conn->commitTrans();
        $this->Conn->autoCommit = true;
        
        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Exit';
        $srLogTrace['Parameter2'] = 'parent_id:' . $product_id;

        $this->objsetup->SRTraceLogsPHP($srLogTrace);
       
        return $response;
    }

    function deleteItemMarginalAnalysis($attr){
        $Sql = "DELETE FROM product_marginal_analysis where id = ".$attr['id']."";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        }
        else
            $response = array();
        return $response;
    }
    
    ############	Start: Category ############	
    function get_categories($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";

        if (!empty($attr['keyword']))
            $where_clause .= " AND name LIKE '%".$attr['keyword']."%' ";

        $response = array();

        $Sql = "SELECT   c.id, c.name, c.description 
                FROM  category  c
                where  c.status=1  and c.name <> '' and 
                       c.company_id=" . $this->arrUser['company_id'] . "	 
                group by  c.name"; 
        
        //c.user_id=".$this->arrUser['id']."
        $RS = $this->objsetup->CSI($Sql,"inventory_setup",sr_ViewPermission);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                // $result['description'] = $Row['description'];

                $Sql2 = "SELECT  brand.brandname
                         FROM  brandcategorymap  map
                         left JOIN brand on brand.id=map.brandID 
                         where map.categoryID='" . $Row['id']. "' and 
                               map.company_id=" . $this->arrUser['company_id'] . " "; 
                //echo  $Sql2; exit;

                $RS2 = $this->objsetup->CSI($Sql2);

                if ($RS2->RecordCount() > 0) {
                    while ($Row2 = $RS2->FetchRow()) {

                        foreach ($Row2 as $key => $value) {
                            if (is_numeric($key))
                                unset($Row2[$key]);
                        }
                        $result['brand'][] = $Row2['brandname'];
                    }
                }
                else{
                    $result['brand'] = '';
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

    function get_all_categories($attr, $remendar=null)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT   c.id, c.name, c.description 
                FROM  category  c 
                where   c.status=1  and c.name <> '' and 
                        c.company_id=" . $this->arrUser['company_id'] . "	 
                group by  c.name"; 

        //c.user_id=".$this->arrUser['id']." 
        
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['description'] = $Row['description'];
                $result['title'] = $Row['name'];

                $result['brands'] = array();

                /* ============================== */
                $Sql2 = "SELECT  map.id,map.brandID,map.categoryID
                        FROM  brandcategorymap  map 
                        where map.categoryID='" . $Row['id']. "' and 
                              map.company_id=" . $this->arrUser['company_id'] . " "; 

                $RS2 = $this->objsetup->CSI($Sql2);

                if ($RS2->RecordCount() > 0) {
                    while ($Row2 = $RS2->FetchRow()) {

                        foreach ($Row2 as $key => $value) {
                            if (is_numeric($key))
                                unset($Row2[$key]);
                        }
                        $result['brands'][] = $Row2;
                    }
                }
                else
                    $result['brands'] = 0;
                /* ============================== */

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }

        return $response;
    }

    function getCategoryByID($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "SELECT  *
                FROM  category 
                where  id='" . $attr['id'] . "' limit 1 "; 
        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql,'inventory_setup',sr_EditPermission);

        if ($RS->RecordCount() > 0) {

            $Row = $RS->FetchRow();
            $result = array();
            
            $Sql2 = "SELECT  map.id,map.brandID,map.categoryID
                     FROM  brandcategorymap  map 
                     where map.categoryID='" . $attr['id'] . "' "; 

            $RS2 = $this->objsetup->CSI($Sql2);

            if ($RS2->RecordCount() > 0) {
                while ($Row2 = $RS2->FetchRow()) {

                    foreach ($Row2 as $key => $value) {
                        if (is_numeric($key))
                            unset($Row2[$key]);
                    }
                    $response['brands'][] = $Row2;
                }
            }
            else
            $response['brands'] = 0;

            $response['id'] = $Row['id'];
            $response['name'] = $Row['name'];
            $response['description'] = $Row['description'];
            $response['status'] = $Row['status'];            
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_category($arr_attr)
    {
        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['Parameter2'] = 'product_id:'.$arr_attr['product_id'];

        $this->objsetup->SRTraceLogsPHP($srLogTrace);
    
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
        
        $brandSelArray = $arr_attr['brandSelArray'];
        $this->objGeneral->mysql_clean($arr_attr);

        //$total = $this->objGeneral->count_duplicate_in_sql('category', 'name', $arr_attr['name'], $this->arrUser['company_id']);
        $data_pass = "  tst.name='" . $arr_attr['name'] . "' ";
        $total = $this->objGeneral->count_duplicate_in_sql('category', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO category 
                                SET
                                name='" . $arr_attr['name'] . "',
                                status='" . $arr_attr['statusid'] . "',
                                description='$arr_attr[description]',
                                company_id='" . $this->arrUser['company_id'] . "',
                                user_id='" . $this->arrUser['id'] . "',
                                AddedBy='" . $this->arrUser['id'] . "',
                                AddedOn=UNIX_TIMESTAMP (NOW()),
                                ChangedBy='" . $this->arrUser['id'] . "',
                                ChangedOn=UNIX_TIMESTAMP (NOW())";

        $RS = $this->objsetup->CSI($Sql,'inventory_setup',sr_ViewPermission);
        $id = $this->Conn->Insert_ID();

        if ($id> 0) {

            $type=2;
            $this->addBrandCategory($brandSelArray,$id,$type);// Type for brand and category.

            $response['id'] = $id;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record Inserted Successfully';
            
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
            
            $srLogTrace = array();

            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['Parameter2'] = 'id:' . $id;
            $srLogTrace['Parameter3'] = 'type:'.$type;

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not Inserted.';
            $srLogTrace = array();

            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['Parameter2'] = 'id:' . $id;
            $srLogTrace['Parameter3'] = 'type:'.$type;
            $srLogTrace['ErrorMessage'] = 'Record not Inserted.';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }

        return $response;
    }

    function update_category($arr_attr)
    {
        $brandSelArray = $arr_attr['brandSelArray'];
        $this->objGeneral->mysql_clean($arr_attr);

        //print_r($arr_attr);exit;
        $id = $arr_attr['id'];

        $data_pass = "  tst.name='" . $arr_attr['name'] . "' AND tst.id <> ".$arr_attr['id']." ";
        $total = $this->objGeneral->count_duplicate_in_sql('category', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE category 
                            SET
                                name='".$arr_attr['name']."',
                                description='".$arr_attr['description']."',
                                status='".$arr_attr['statusid']."',
                                ChangedBy='" . $this->arrUser['id'] . "',
                                ChangedOn=UNIX_TIMESTAMP (NOW())
                        WHERE id = " . $id . "   
                        Limit 1";

        $RS = $this->objsetup->CSI($Sql);

        $type=2;
        $this->addBrandCategory($brandSelArray,$id,$type);// Type for brand and category.

       // if ($this->Conn->Affected_Rows() > 0) {
            

        $response['id'] = $id;
        $response['ack'] = 1;
        $response['error'] = NULL;
        /* } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Updated Successfully';
        } */
        return $response;
    }

    function delete_category($arr_attr)
    {        
        $Sql = "UPDATE category SET status=".DELETED_STATUS." 
                WHERE id = ".$arr_attr['id']." AND SR_CheckTransactionBeforeDelete(".$arr_attr['id'].", ".$this->arrUser['company_id'].", 20,0) = 'success'";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $Sql1 = "DELETE FROM brandcategorymap WHERE categoryID = '".$arr_attr['id']."' AND company_id='" . $this->arrUser['company_id'] . "'";
            $this->objsetup->CSI($Sql1); 

            $response['ack'] = 1;
            $response['success'] = 'Record Deleted Successfully';
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'This Category cannot be deleted because it is being used in another record.';
        }
        return $response;
    }


    ############	Start: Brands ##############
    function get_brands($attr)
    {
        //global $objFilters;
        //return $objFilters->get_module_listing(3, "brand");
        $this->objGeneral->mysql_clean($attr);
        //echo $this->arrUser['id']."<hr>";

        $limit_clause = $where_clause = "";

        if (!empty($attr['keyword'])) $where_clause .= " AND brandname LIKE '%".$attr['keyword']."%' ";

        $response = array();


        $Sql = "SELECT   c.id, c.brandname, c.brandcode  
                FROM  brand  c 
                where   c.status=1  and 
                        c.brandname <> '' and 
                        c.company_id=" . $this->arrUser['company_id'] . "
                group by c.brandname  "; 
                
        //c.user_id=".$this->arrUser['id']." 

        $RS = $this->objsetup->CSI($Sql,'inventory_setup',sr_ViewPermission);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['brand_name'] = $Row['brandname'];
                // $result['brand_code'] = $Row['brandcode'];
                //$result['name'] = $Row['brandname'];

                $Sql2 = "SELECT  category.name
                         FROM  brandcategorymap  map
                         left JOIN category on category.id=map.categoryID 
                         where map.brandID='" . $Row['id']. "' and 
                               map.company_id=" . $this->arrUser['company_id'] . " "; 
                //echo  $Sql2; exit;

                $RS2 = $this->objsetup->CSI($Sql2);

                if ($RS2->RecordCount() > 0) {
                    while ($Row2 = $RS2->FetchRow()) {

                        foreach ($Row2 as $key => $value) {
                            if (is_numeric($key))
                                unset($Row2[$key]);
                        }
                        $result['categories'][] = $Row2;
                    }
                }
                else{
                    $result['categories'] = '';
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

    function get_all_brands($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT  c.id, c.brandname, c.brandcode  
                FROM  brand  c 
                where   c.status=1  and 
                        c.brandname <> '' and 
                        c.company_id=" . $this->arrUser['company_id'] . "
                group by  c.brandname "; 
        
        //c.user_id=".$this->arrUser['id']." 

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['brandname'];
                $result['description'] = $Row['brandname'];
                $result['title'] = $Row['brandname'];

                $Sql2 = "SELECT  map.id,map.brandID,map.categoryID
                        FROM  brandcategorymap  map
                        where map.brandID='" . $Row['id']. "' and 
                              map.company_id=" . $this->arrUser['company_id'] . " "; 
                //echo  $Sql2; exit;

                $RS2 = $this->objsetup->CSI($Sql2);

                if ($RS2->RecordCount() > 0) {
                    while ($Row2 = $RS2->FetchRow()) {

                        foreach ($Row2 as $key => $value) {
                            if (is_numeric($key))
                                unset($Row2[$key]);
                        }
                        $result['categories'][] = $Row2;
                    }
                }
                else{
                    $result['categories'] = 0;
                }               

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;

        } else {
            $response['response'] = array();
        }
        /* echo "<pre>";
        print_r($response);
        exit; */
        return $response;
    }

    function getBrandByID($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "SELECT  *
                FROM  brand 
                where  id='" . $attr['id'] . "' limit 1 "; 
        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql,'inventory_setup',sr_EditPermission);

        if ($RS->RecordCount() > 0) {

            $Row = $RS->FetchRow();
            $result = array();
            
            $Sql2 = "SELECT  map.id,map.brandID,map.categoryID
                     FROM  brandcategorymap  map 
                     where map.brandID='" . $attr['id'] . "' "; 

            $RS2 = $this->objsetup->CSI($Sql2);

            if ($RS2->RecordCount() > 0) {
                while ($Row2 = $RS2->FetchRow()) {

                    foreach ($Row2 as $key => $value) {
                        if (is_numeric($key))
                            unset($Row2[$key]);
                    }
                    $response['categories'][] = $Row2;
                }
            }
            else
            $response['categories'] = 0;

            $response['id'] = $Row['id'];
            $response['brand_name'] = $Row['brandname'];
            $response['brand_code'] = $Row['brandcode'];
            $response['status'] = $Row['status'];            
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_brand($arr_attr)
    {
       $categorySelArray = $arr_attr['categorySelArray'];
       $this->objGeneral->mysql_clean($arr_attr);

        //print_r($arr_attr);exit;

        $data_pass = "  tst.brandname='" . $arr_attr['brandname'] . "' ";

        $total = $this->objGeneral->count_duplicate_in_sql('brand', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

       // $categoryID = (isset($arr_attr['categoryID']) && $arr_attr['categoryID']!="")? $arr_attr['categoryID']:0;


        $Sql = "INSERT INTO brand 
                                SET
                                    brandname='$arr_attr[brandname]',
                                    brandcode='$arr_attr[brandcode]',
                                    brandlogo='$arr_attr[brandlogo]',
                                    status='$arr_attr[statusid]',
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    user_id='" . $this->arrUser['id'] . "',
                                    AddedBy='" . $this->arrUser['id'] . "',
                                    AddedOn=UNIX_TIMESTAMP (NOW()),
                                    ChangedBy='" . $this->arrUser['id'] . "',
                                    ChangedOn=UNIX_TIMESTAMP (NOW()),
                                    DM_check=0,
                                    DM_file=0";

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql,'inventory_setup',sr_ViewPermission);
        $id= $this->Conn->Insert_ID();
        // $response = $this->objGeneral->run_query_exception($Sql);

        if ($id> 0) {

            $type=1;
            $this->addBrandCategory($categorySelArray,$id,$type);// Type for brand and category.

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

    function update_brand($arr_attr)
    {
        $categorySelArray = $arr_attr['categorySelArray'];

        $this->objGeneral->mysql_clean($arr_attr);

        //print_r($arr_attr);exit;
        $id = $arr_attr['id'];

        $data_pass = "  (tst.brandname='" . $arr_attr['brandname'] . "'  AND tst.id <> ".$arr_attr['id'].")";

        $total = $this->objGeneral->count_duplicate_in_sql('brand', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE brand 
                        SET  
                            brandname='$arr_attr[brandname]',
                            brandcode='$arr_attr[brandcode]',
                            brandlogo='$arr_attr[brandlogo]',
                            status='$arr_attr[statusid]',
                            ChangedBy='" . $this->arrUser['id'] . "',
                            ChangedOn=UNIX_TIMESTAMP (NOW())
				WHERE id = " . $id . "   Limit 1";

        //echo $Sql;exit;        

        $RS = $this->objsetup->CSI($Sql);

        // if ($this->Conn->Affected_Rows() > 0) {

            $type=1;
            $this->addBrandCategory($categorySelArray,$id,$type);// Type for brand and category.

            $response['id'] = $id;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record Updated Successfully';
        // } else {
        //     $response['ack'] = 0;
        //     $response['error'] = 'Record not Updated!';
        // }
        return $response;
    }

    function delete_brand($arr_attr)
    {
        $Sql = "UPDATE brand SET status=".DELETED_STATUS." WHERE id = ".$arr_attr['id']." AND SR_CheckTransactionBeforeDelete(".$arr_attr['id'].", ".$this->arrUser['company_id'].", 19,0) = 'success'";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $Sql1 = "DELETE FROM brandcategorymap WHERE brandID = '".$arr_attr['id']."' AND company_id='" . $this->arrUser['company_id'] . "'";
            $this->objsetup->CSI($Sql1); 

            $response['ack'] = 1;
            $response['success'] = 'Record Deleted Successfully';            
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'This Brand cannot be deleted because it is being used in another record.';            
        }
        
        return $response;
    }

    function addBrandCategory($categorySelArray,$recID,$type)
    {
        // for Brand Module            
        if($type==1){

            $Sql1 = "DELETE FROM brandcategorymap WHERE brandID = '".$recID."' AND company_id='" . $this->arrUser['company_id'] . "'";
            $this->objsetup->CSI($Sql1); 

            foreach ($categorySelArray as $value) {
                $Sql = "INSERT INTO brandcategorymap
                                    SET
                                        brandID = '".$recID."',
                                        categoryID = '".$value->id."',
                                        user_id='" . $this->arrUser['id'] . "',
                                        company_id='" . $this->arrUser['company_id'] . "',
                                        AddedBy='" . $this->arrUser['id'] . "',
                                        AddedOn=UNIX_TIMESTAMP (NOW()),
                                        ChangedBy='" . $this->arrUser['id'] . "',
                                        ChangedOn=UNIX_TIMESTAMP (NOW())";

                $RS = $this->objsetup->CSI($Sql);
            }
        }

        // for Category Module.
        if($type==2){

            $Sql1 = "DELETE FROM brandcategorymap WHERE categoryID = '".$recID."' AND company_id='" . $this->arrUser['company_id'] . "'";
            $this->objsetup->CSI($Sql1); 

            foreach ($categorySelArray as $value) {
                $Sql = "INSERT INTO brandcategorymap
                                    SET
                                        brandID = '".$value->id."',
                                        categoryID = '".$recID."',
                                        user_id='" . $this->arrUser['id'] . "',
                                        company_id='" . $this->arrUser['company_id'] . "',
                                        AddedBy='" . $this->arrUser['id'] . "',
                                        AddedOn=UNIX_TIMESTAMP (NOW()),
                                        ChangedBy='" . $this->arrUser['id'] . "',
                                        ChangedOn=UNIX_TIMESTAMP (NOW())";

                $RS = $this->objsetup->CSI($Sql);
            }
        }

        $response['ack'] = 1;
        $response['error'] = NULL;

        return $response;
    }


    ############	Start: Unit of Measures ####	

    function get_units($attr)
    {
        //global $objFilters;
        //return $objFilters->get_module_listing(45, "units_of_measure");

        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";

        if (!empty($attr['keyword'])) $where_clause .= " AND child.title LIKE '%$attr[keyword]%' ";

        $response = array();

        $Sql = "SELECT   c.id, c.title
		 FROM  units_of_measure  c 
		where  c.status=1  and c.title <> ''
		and c.company_id=" . $this->arrUser['company_id'] . "	 
		group by  c.title "; //c.user_id=".$this->arrUser['id']." 


        $RS = $this->objsetup->CSI($Sql,'inventory_setup',sr_ViewPermission);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                // $result['title'] = $Row['title'];
                $result['name'] = $Row['title'];
                //$result['title'] = $Row['childTitle'];
                //$result['parent_unit'] = $Row['parentTitle'];
                //	$result['parent_id'] = $Row['parent_id'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_all_units($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT  c.id, c.title 
                FROM  units_of_measure  c 
                where  c.status=1  and c.title <> '' and c.company_id=" . $this->arrUser['company_id'] . "		 
                group by  c.title "; //c.user_id=".$this->arrUser['id']." 

        $RS = $this->objsetup->CSI($Sql);

        $selected_count = 0;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];

                $result['title'] = $Row['title'];
                $result['description'] = $Row['description'];
                $result['name'] = $Row['title'];
                if ($selected_count == 0) $result['quantity'] = (float)1; else $result['quantity'] = (float)0;
                $selected_count++;
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;

        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function getAllOriginCountries($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT country.id, country.nicename  
                FROM  product  p 
                LEFT JOIN country on country.id=p.prd_country_origin 
                where  p.status=1 AND p.prd_country_origin IS NOT NULL
                and p.company_id=".$this->arrUser['company_id'];
                
        //echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        $selected_count = 0;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];

                $result['name'] = $Row['nicename'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;

        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function add_unit($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $data_pass = "  tst.title='" . $arr_attr['title'] . "' ";
        $total = $this->objGeneral->count_duplicate_in_sql('units_of_measure', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO units_of_measure SET
						title='" . $arr_attr['title'] . "' 
						,parent_id='" . $arr_attr['parent_id'] . "' 
						,status=1  
						,company_id='" . $this->arrUser['company_id'] . "'
						,user_id='" . $this->arrUser['id'] . "'	
						,AddedBy='" . $this->arrUser['id'] . "'
						,AddedOn=UNIX_TIMESTAMP (NOW())";
        $RS = $this->objsetup->CSI($Sql,'inventory_setup',sr_ViewPermission);
        $response['id'] = $this->Conn->Insert_ID();
        // $response = $this->objGeneral->run_query_exception($Sql);
        // return $response;


        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['error'] = 'Record Inserted Successfully';

        return $response;

    }

    function update_unit($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $id = $arr_attr['id'];

        $data_pass = "  (tst.title='" . $arr_attr['title'] . "'  AND tst.id <> ".$arr_attr['id'].")";

        $total = $this->objGeneral->count_duplicate_in_sql('units_of_measure', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE units_of_measure 
                            SET  title='".$arr_attr['title']."',
                                 parent_id='".$arr_attr['parent_id']."',
                                 ChangedBy='" . $this->arrUser['id'] . "',
                                 ChangedOn=UNIX_TIMESTAMP (NOW())
                            WHERE id = " . $id . " ";
        $RS = $this->objsetup->CSI($Sql);


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


    function sortBySubkey(&$array, $subkey, $sortType = SORT_DESC)
    {
        foreach ($array as $subarray) {
            $keys[] = $subarray[$subkey];
        }
        array_multisort($keys, $sortType, $array);
    }

    function orderBy($data, $field)
    {
        $code = "return strnatcmp(\$a['".$field."'], \$b['".$field."']);";
        arsort($data, create_function('$a,$b', $code));

        return $data;
    }


    function get_unit_record_popup($attr)
    {
        $response2 = array();
        $response = array();
        $total = "";

        $Sql = "SELECT  c.id, 
                        c.cat_id, 
                        c.record_id,
                        c.quantity,
                        c.ref_unit_id,
                        c.ref_quantity,
                        c.barcode,
                        c.DimensionType,
                        c.customDimension,
                        c.Dimension1,
                        c.Dimension1_value,
                        c.Dimension1_unit,
                        c.Dimension2,
                        c.Dimension2_value,
                        c.Dimension2_unit,
                        c.Dimension3,
                        c.Dimension3_value,
                        c.Dimension3_unit,
                        c.volume,                                                    
                        c.volume_unit,
                        c.weightUnit,
                        c.netweight,
                        c.packagingWeight 
                FROM  sr_unit_of_measure_setup  c 
                WHERE  	c.product_id= '" . $attr['product_id'] . "' AND 
                        c.unit_id=".$attr['unit_id']."  AND 
                        c.status=1 AND 
                        c.company_id=" . $this->arrUser['company_id'] . "		 
                order by  c.ref_quantity asc "; //order by  c.quantity DESC 

        $RS = $this->objsetup->CSI($Sql);

        /* 
                LEFT JOIN product_uom_details on product_uom_details.unitID=c.cat_id AND product_uom_details.itemID ='" . $attr['product_id'] . "' */
    //    echo $Sql;exit;
        $selected_count = 0;
        $value_count = 0;

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                $result = array();
                $result['rem_id'] = 1;
                $result['rec_id'] = $Row['id'];
                $value_count = 1;
                $result['check_id'] = $value_count;
                $result['quantity'] = $Row['quantity'];
                $result['cat_id'] = $Row['cat_id'];
                $result['DS'] = 0;
                $result['ref_unit_id'] = $Row['ref_unit_id'];
                $result['ref_quantity'] = $Row['ref_quantity'];
                $result['barcode'] = $Row['barcode'];
                $result['DimensionType'] = $Row['DimensionType'];
                $result['customDimension'] = $Row['customDimension'];
                $result['Dimension1'] = $Row['Dimension1'];
                $result['Dimension1_value'] = $Row['Dimension1_value'];
                $result['Dimension1_unit'] = $Row['Dimension1_unit'];
                $result['Dimension2'] = $Row['Dimension2'];
                $result['Dimension2_value'] = $Row['Dimension2_value'];
                $result['Dimension2_unit'] = $Row['Dimension2_unit'];
                $result['Dimension3'] = $Row['Dimension3'];
                $result['Dimension3_value'] = $Row['Dimension3_value'];
                $result['Dimension3_unit'] = $Row['Dimension3_unit'];
                $result['volume'] = $Row['volume'];
                $result['volume_unit'] = $Row['volume_unit'];
                $result['weightUnit'] = $Row['weightUnit'];
                $result['netweight'] = floatval($Row['netweight']);
                $result['packagingWeight'] = floatval($Row['packagingWeight']);
                $selected_count++;
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['total'] = $total;
        } 
        else    
            $response['response'][] = array();

        if ($selected_count == 0) 
            $response['selected_count'] = 0;
        else 
            $response['selected_count'] = $selected_count;

        return $response;
    }

    function add_unit_record_setup($arr_attr)
    {
        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['Parameter2'] = 'product_id:'.$arr_attr['product_id'];

        $this->objsetup->SRTraceLogsPHP($srLogTrace);
    
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
        $counter=0;
        // echo "<pre>"; print_r($arr_attr['data']);exit;
        foreach($arr_attr['data'] as $index=>$data){
           //echo "<pre>"; print_r($data);
            $update_check = "";
            $id=0;
            $id = (isset($data->rec_id) && $data->rec_id!='')?$data->rec_id:0;

            $DimensionType = (isset($data->DimensionType) && $data->DimensionType!='')?$data->DimensionType:0;
            $customDimension = (isset($data->isCustomCalculated) && $data->isCustomCalculated!='') ? $data->isCustomCalculated:0;
            
            $Dimension1 = (isset($data->Dimensions->d1_type) && $data->Dimensions->d1_type!='')?$data->Dimensions->d1_type:0;
            $Dimension2 = (isset($data->Dimensions->d2_type) && $data->Dimensions->d2_type!='')?$data->Dimensions->d2_type:0;
            $Dimension3 = (isset($data->Dimensions->d3_type) && $data->Dimensions->d3_type!='')?$data->Dimensions->d3_type:0;
            
            $Dimension1_value = (isset($data->Dimensions->d1_val) && $data->Dimensions->d1_val!='')?$data->Dimensions->d1_val:0;
            $Dimension2_value = (isset($data->Dimensions->d2_val) && $data->Dimensions->d2_val!='')?$data->Dimensions->d2_val:0;
            $Dimension3_value = (isset($data->Dimensions->d3_val) && $data->Dimensions->d3_val!='')?$data->Dimensions->d3_val:0;
            
            $Dimension1_unit = (isset($data->Dimensions->d1_unit) && $data->Dimensions->d1_unit!='')?$data->Dimensions->d1_unit:0;
            $Dimension2_unit = (isset($data->Dimensions->d2_unit) && $data->Dimensions->d2_unit!='')?$data->Dimensions->d2_unit:0;
            $Dimension3_unit = (isset($data->Dimensions->d3_unit) && $data->Dimensions->d3_unit!='')?$data->Dimensions->d3_unit:0;
            
            $volume         = (isset($data->volume) && $data->volume!='')?$data->volume:0;
            $volume_unit    = (isset($data->volume_unit) && $data->volume_unit!='')?$data->volume_unit:0;
            $weightUnit     = (isset($data->weightUnit) && $data->weightUnit!='')?$data->weightUnit:0;
            $net_weight     = (isset($data->netweight) && $data->netweight!='')?$data->netweight:0;
            $packaging_weight = (isset($data->packagingWeight) && $data->packagingWeight!='')?$data->packagingWeight:0;
            $cat_id         = ($data->cat_id->id && $data->cat_id->id != '') ? $data->cat_id->id : 0;
            $ref_unit_id    = ($data->ref_unit_id->id && $data->ref_unit_id->id != '') ? $data->ref_unit_id->id : 0;
            $quantity       = ($data->quantity && $data->quantity != '') ? $data->quantity : 0;
            $base_uom       = ($index == 0) ? 1 : 0;

            if ($id == 0) {
                $Sql = "INSERT INTO units_of_measure_setup 
                                            SET 
                                                product_id='" . $arr_attr['product_id'] . "',
                                                product_code='" . $arr_attr['product_code'] . "',  
                                                unit_id='" . $arr_attr['unit_id']->id . "', 
                                                record_id='" . $cat_id . "',
                                                ref_unit_id='" . $ref_unit_id . "',
                                                ref_quantity='" . $data->ref_quantity. "',
                                                check_id=1, 
                                                quantity='" . $quantity . "', 
                                                cat_id='" . $cat_id  . "',
                                                base_uom = $base_uom,
                                                barcode='" . addslashes($data->barcode) . "',
                                                DimensionType='" . $DimensionType . "',
                                                customDimension='" . $customDimension . "',
                                                Dimension1='" . $Dimension1 . "',
                                                Dimension1_value='" . $Dimension1_value . "',
                                                Dimension1_unit='" . $Dimension1_unit . "',
                                                Dimension2='" . $Dimension2 . "',
                                                Dimension2_value='" . $Dimension2_value. "',
                                                Dimension2_unit='" . $Dimension2_unit . "',
                                                Dimension3='" . $Dimension3 . "',
                                                Dimension3_value='" . $Dimension3_value . "',
                                                Dimension3_unit='" . $Dimension3_unit . "',
                                                volume='" . $volume . "',                                                    
                                                volume_unit='" . $volume_unit . "',
                                                weightUnit='" . $weightUnit . "',
                                                netweight='" . $net_weight . "',
                                                packagingWeight='" . $packaging_weight . "',
                                                
                                                status=1,
                                                user_id='" . $this->arrUser['id'] . "',
                                                company_id='" . $this->arrUser['company_id'] . "', 
                                                date_added=UNIX_TIMESTAMP (NOW()),
                                                AddedBy='" . $this->arrUser['id'] . "',
                                                AddedOn=UNIX_TIMESTAMP (NOW()),
                                                ChangedBy='" . $this->arrUser['id'] . "',
                                                ChangedOn=UNIX_TIMESTAMP (NOW())";
                // echo  $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
                $id = $this->Conn->Insert_ID();
            } 
            else {                    
                $Sql = "UPDATE units_of_measure_setup	
                                        SET  
                                            quantity='" . $quantity . "', 
                                            unit_id = '".$arr_attr['unit_id']->id."', 
                                            ref_unit_id = '".$ref_unit_id ."',
                                            ref_quantity='" . $data->ref_quantity. "',
                                            
                                            barcode='" . addslashes($data->barcode) . "',
                                            DimensionType='" . $DimensionType . "',
                                            customDimension='" . $customDimension . "',
                                            Dimension1='" . $Dimension1 . "',
                                            Dimension1_value='" . $Dimension1_value . "',
                                            Dimension1_unit='" . $Dimension1_unit . "',
                                            Dimension2='" . $Dimension2 . "',
                                            Dimension2_value='" . $Dimension2_value . "',
                                            Dimension2_unit='" . $Dimension2_unit . "',
                                            Dimension3='" . $Dimension3 . "',
                                            Dimension3_value='" . $Dimension3_value . "',
                                            Dimension3_unit='" . $Dimension3_unit . "',
                                            volume='" . $volume . "',                                                    
                                            volume_unit='" . $volume_unit . "',
                                            weightUnit='" . $weightUnit . "',
                                            netweight='" . $net_weight . "',
                                            packagingWeight='" . $packaging_weight . "'
                            WHERE id ='" . $id . "'	 
                            Limit 1 ";
                // echo  $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
                $counter++;
            }
            
            if ($this->Conn->Affected_Rows() > 0) 
                $counter++;                                  
        
        }        

        if ($counter > 0) {            
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['msg'] = ' Updated';
             $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;

            $srLogTrace = array();

            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['Parameter2'] = 'parent_id:' . $id;

            $this->objsetup->SRTraceLogsPHP($srLogTrace);

        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Not Updated.';

            $srLogTrace = array();

            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['Parameter2'] = 'parent_id:' . $id;
            $srLogTrace['ErrorMessage'] = 'Record not Inserted.';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }
        return $response;
    }

    function delete_setup_single($attr)
    {

        $total = $this->objGeneral->count_result('srm_invoice_detail', 'unit_measure_id', $attr['id']);
        $total = $this->objGeneral->count_result('order_details', 'unit_measure_id', $attr['id']);
        $total = $this->objGeneral->count_result('product_supplier', 'uom_id', $attr['id']);
        $total = $this->objGeneral->count_result('customer_item_info', 'unit_of_measure_id', $attr['id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record can not be Deleted';
        } else {

            $Sql = "UPDATE units_of_measure_setup SET  status =0 	WHERE id = ".$attr['id']."";


            $RS = $this->objsetup->CSI($Sql);
            if ($this->Conn->Affected_Rows() > 0) {
                $response['ack'] = 1;
                $response['error'] = NULL;
            } else {
                $response['ack'] = 0;
                $response['error'] = 'Record can\'t be deleted!';
            }
        }

        return $response;
    }

    function get_unit_setup_list_category($attr)
    {
        $response = array();
        $where = "";
        $total = "";

        // if ($attr['product_code']) $where .= "product_code= '" . $attr['product_code'] . "'  AND ";
        if ($attr['product_id']) $where .= "product_id= '" . $attr['product_id'] . "' AND ";

        $Sql = "SELECT   c.id,c.quantity,us.title as name,c.cat_id,c.ref_unit_id,c.ref_quantity
                FROM  units_of_measure_setup  c 
                right JOIN units_of_measure us on us.id=c.cat_id 
                where  ".$where." c.status=1 	and us.status=1  
                group by us.title order by c.id  ASC";

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['title'] = $Row['name'];

                if ($attr['product_id'] != 0) {
                    $result['quantity'] = $Row['quantity'];
                    $result['unit_id'] = $Row['cat_id'];
                    $result['ref_unit_id'] = $Row['ref_unit_id'];
                    $result['ref_quantity'] = $Row['ref_quantity'];
                }
                $response['response'][] = $result;

            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['total'] = $total;
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
            $response['response'][] = array();
        }

        return $response;
    }

    function get_unit_quanitity_setup($attr)
    {


        $Sql = "SELECT  c.quantity
		 FROM  units_of_measure_setup  c 
		where c.product_id= '" . $attr['product_id'] . "' and c.cat_id= '" . $attr['unit_id'] . "'    and c.status=1 
		and c.company_id=" . $this->arrUser['company_id'] . "		 
		order by  c.quantity DESC ";
        $rs_count = $this->objsetup->CSI($Sql);
        $total = $rs_count->fields['quantity'];

        if ($total > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['quantity'] = $total;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'No Unit of Measure setup for this item';
            // $response['error'] = 'Record not found!';
        }

        return $response;
    }

    function delete_unit_quantity($attr)
    {
        $Sql = "DELETE FROM units_of_measure_setup where id = ".$attr['id']."";
        // echo $Sql;exit;
        $rs_count = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['quantity'] = $total;
        return $response;
    }

    function get_unit_setup_category_invoice($attr)
    {

        $response = array();
        $total = "";

        if ($attr['product_id'] != 0) $where = "and product_id='" . $attr['product_id'] . "'  ";

        $Sql = "SELECT  us.id,c.quantity,us.title as name
                FROM  units_of_measure_setup  c 
                right JOIN units_of_measure us on us.id=c.cat_id 
                where  us.status=1  and c.status=1 	 ".$where."
                group by  us.id DESC "; //c.user_id=".$this->arrUser['id']." 

        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                if ($attr['product_id'] != 0) $result['quantity'] = $Row['quantity'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['total'] = $total;

        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
            $response['response'][] = array();
        }

        // print_r($response);exit;
        return $response;
    }

    function get_sale_offer_volume_by_type($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $where_clause = "";

        if (!empty($attr['product_id'])) $where_clause .= " AND p.product_id = ".$attr['product_id']." ";
        if (!empty($attr['supp_id'])) $where_clause .= " AND p.supplier_id = ".$attr['supp_id']." ";
        if (!empty($attr['type'])) $where_clause .= " AND p.type =  '" . $attr['type'] . "'   ";

        $Sql = "SELECT p.*
                FROM SR_crm_UnitOfMeasureVolume_sel p
                WHERE   p.status=1  and 
                        p.company_id='" . $this->arrUser['company_id'] . "' " . $where_clause;
        
        //echo $Sql;exit;
        $counter = 0;
        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();

                if (!empty($Row['cat_name'])) {
                    $counter++;
                    $result['id'] = $Row['id'];
                    $result['name'] = $Row['quantity_from'] . '-' . $Row['quantity_to'] . ' ' . $Row['cat_name'];
                    $result['quantity_from'] = $Row['quantity_from'];
                    $result['quantity_to'] = $Row['quantity_to'];
                    $response['response'][] = $result;
                }
            }
        }

        if ($counter > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_sale_offer_volume($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        //print_r($arr_attr);exit;

        $data_pass = "  (tst.category='" . $arr_attr['category'] . "'  AND tst.product_id='" . $arr_attr['product_id'] . "'  AND tst.unit_category='" . $arr_attr['unit_categorys'] . "'  and ($arr_attr[quantity_from] BETWEEN tst.quantity_from AND tst.quantity_to
								 or $arr_attr[quantity_to] BETWEEN tst.quantity_from AND tst.quantity_to ))";

        $total = $this->objGeneral->count_duplicate_in_sql('units_of_measure_volume', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO units_of_measure_volume SET
					type='" . $arr_attr['type'] . "'  
					,category='" . $arr_attr['category'] . "'   
					,supplier_id='" . $arr_attr['supplier_id'] . "'   
					,product_id='" . $arr_attr['product_id'] . "'  
					,quantity_from='" . $arr_attr['quantity_from'] . "'  
					,quantity_to='" . $arr_attr['quantity_to'] . "'  
					,unit_category='" . $arr_attr['unit_categorys'] . "'  
					,company_id='" . $this->arrUser['company_id'] . "'
					,user_id='" . $this->arrUser['id'] . "'
					
					,AddedBy='" . $this->arrUser['id'] . "'
					,AddedOn=UNIX_TIMESTAMP (NOW())";
        //echo $Sql;exit;
        $response = $this->objGeneral->run_query_exception($Sql);
        return $response;//'".$arr_attr['category']."'
        // }
    }

    ############	Start: Category Units ######

    function get_cat_unit($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);exit;
        $limit_clause = $total = $where_clause = "";

        if (!empty($attr['keyword'])) $where_clause .= " AND uom.title LIKE '%$attr[keyword]%' ";


        $response = array();

        $Sql = "SELECT cuom.id, category.name AS categoryName, uom.title AS unitName, cuom.value
				FROM category_units_of_measure AS cuom
				LEFT JOIN units_of_measure AS uom ON uom.id = cuom.unit_id
				LEFT JOIN category ON category.id = cuom.category_id
				WHERE  cuom.status=1
				ORDER BY cuom.id DESC";

        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['category_name'] = $Row['categoryName'];
                $result['unit_name'] = $Row['unitName'];
                $result['quantity'] = $Row['value'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['total'] = $total;

        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
            $response['response'][] = array();
        }
        return $response;
    }

    function get_cat_unit_by_cat_nd_unit_id($attr)
    {
        $Sql = "SELECT  c.*
                FROM  units_of_measure_setup  c 
                where  c.product_id= '" . $attr['product_id'] . "'  and 
                       c.unit_id=$attr[unit_id]  and 
                       c.status=1 and 
                       c.company_id=" . $this->arrUser['company_id'] . "
                order by  c.id DESC ";

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key)) unset($Row[$key]);
            }
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
            $response['response'] = array();
        }
        return $response;

    }

    function add_cat_unit($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);


        $Sql = "INSERT INTO category_units_of_measure 
                                    SET 
                                        category_id='$arr_attr[category_ids]',
                                        unit_id='$arr_attr[unit_ids]', 
                                        value='$arr_attr[value]', 
                                        layers='$arr_attr[layers]', 
                                        status=1,
                                        company_id='" . $this->arrUser['company_id'] . "',
                                        user_id='" . $this->arrUser['id'] . "',
                                        AddedBy='" . $this->arrUser['id'] . "',
                                        AddedOn=UNIX_TIMESTAMP (NOW())";
        $response = $this->objGeneral->run_query_exception($Sql);
        return $response;

    }

    function update_cat_unit($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        $id = $arr_attr['id'];

        $Sql = "UPDATE category_units_of_measure 
                                    SET  
                                        category_id='$arr_attr[category_ids]',
                                        unit_id='$arr_attr[unit_ids]', 
                                        status='$arr_attr[status]',
                                        value='$arr_attr[value]', 
                                        layers='$arr_attr[layers]',
                                        company_id='" . $this->arrUser['company_id'] . "',
                                        user_id='" . $this->arrUser['id'] . "'
                                    WHERE id = $id 
                                    LIMIT 1";

        $RS = $this->objsetup->CSI($Sql);

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


    ############	Start: Dimentions ######

    function get_dimention($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";
        $response = array();

        $Sql = "SELECT  c.id, 
                        c.name, 
                        c.code, 
                        c.type,
                        CASE  WHEN c.type = 1 THEN 'Height'  
                              WHEN c.type = 2 THEN 'Width' 
                              WHEN c.type = 3 THEN 'Length'  
                        END AS types
                FROM  dimentions  c 
                where  c.status=1 AND 
                       c.company_id=" . $this->arrUser['company_id'] . "
                ORDER BY  c.type ASC ";

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['type'] = $Row['types'];
                $result['name'] = $Row['name'];//strtolower();
                $result['display_name'] = $Row['code'];

                if ($attr['get_code_name'] > 0) {
                    $result['types'] = $Row['type'];
                    $result['name'] = strtolower($Row['code']);
                }
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else   $response['response'][] = array();

        return $response;
    }

    function add_dimention($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $data_pass = "  tst.name='" . $arr_attr['name'] . "'  AND 
                        tst.type='" . $arr_attr['type'] . "'";

        $total = $this->objGeneral->count_duplicate_in_sql('dimentions', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
        //strtolower($arr_attr['name']) 

        $Sql = "INSERT INTO dimentions 
                                SET 	
                                    type='" . $arr_attr['type'] . "',
                                    name='" . $arr_attr['name'] . "',
                                    code='" . $arr_attr['code'] . "'  ,
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    user_id='" . $this->arrUser['id'] . "',
                                    AddedBy='" . $this->arrUser['id'] . "',
                                    AddedOn=UNIX_TIMESTAMP (NOW())";

        $RS = $this->objsetup->CSI($Sql);
        $response['id'] = $this->Conn->Insert_ID();

        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['error'] = 'Record Inserted Successfully';

        return $response;
    }


    function update_dimention($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        //print_r($arr_attr);exit;
        $id = $arr_attr['id'];

        $data_pass = "  tst.name='" . $arr_attr['name'] . "'  AND 
                        tst.type='" . $arr_attr['type'] . "'  AND 
                        tst.id <> '" . $id . "'";

        $total = $this->objGeneral->count_duplicate_in_sql('dimentions', $data_pass, $this->arrUser['company_id']);

        if ($total >0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE dimentions 
                            SET  
                                type='" . $arr_attr['type'] . "',
                                name='" . $arr_attr['name'] . "',
                                code='" . $arr_attr['code'] . "',
                                ChangedBy='" . $this->arrUser['id'] . "',
                                ChangedOn=UNIX_TIMESTAMP (NOW())
                            WHERE id = " . $id . "   
                            Limit 1";

        $RS = $this->objsetup->CSI($Sql);

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


    ############	Start:   Status ######

    function get_status($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";

        if (!empty($attr['type'])) 
            $where_clause .= " AND c.type =".$attr['type']."	 ";

        $response = array();

        $Sql = "SELECT   c.id, c.name, c.code, c.type 
                FROM  product_status  c 
                where  c.status=1 and 
                       c.company_id=" . $this->arrUser['company_id'] . "
                       ".$where_clause."
                order by  c.name ASC "; //c.user_id=".$this->arrUser['id']." 

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                //$result['code'] = $Row['code']; 
                $result['name'] = ucwords($Row['name']);

                if ($Row['type'] == 1) $result['type'] = 'product purchase';
                else if ($Row['type'] == 2) $result['type'] = 'supplier';
                else if ($Row['type'] == 3) $result['type'] = 'crm';

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_status($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);


        $data_pass = "  (tst.name='" . ucwords($arr_attr['name']) . "'  AND tst.type='" . $arr_attr['type'] . "'  AND tst.code='" . $arr_attr['code'] . "')";

        $total = $this->objGeneral->count_duplicate_in_sql('product_status', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO product_status SET 
										type='" . $arr_attr['type'] . "'  
										,name='" . ucwords($arr_attr['name']) . "' 
										,code='" . $arr_attr['code'] . "'   
										
										,company_id='" . $this->arrUser['company_id'] . "'
										,user_id='" . $this->arrUser['id'] . "'
										,AddedBy='" . $this->arrUser['id'] . "'
										,AddedOn=UNIX_TIMESTAMP (NOW())";

        $response = $this->objGeneral->run_query_exception($Sql);
        return $response;
    }

    function update_status($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $data_pass = "  (tst.name='" . ucwords($arr_attr['name']) . "'  AND 
                         tst.type='" . $arr_attr['type'] . "'  AND 
                         tst.code='" . $arr_attr['code'] . "'   AND 
                         tst.id <> '" . $arr_attr['id'] . "')";

        $total = $this->objGeneral->count_duplicate_in_sql('product_status', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        //print_r($arr_attr);exit;

        $Sql = "UPDATE product_status SET  
			type='" . $arr_attr['type'] . "' 
			,name='" . $arr_attr['name'] . "' 
			,code='" . $arr_attr['code'] . "' 
			,ChangedBy='" . $this->arrUser['id'] . "'
			,ChangedOn=UNIX_TIMESTAMP (NOW())   
			WHERE id = " . $arr_attr['id'] . "   Limit 1";
        //echo $Sql;exit;
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


    ############	Start: Product of Tabs #####
    function get_tabs_create($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";


        $response = array();

        /*$Sql = "SELECT id, name, status, sort_id
				FROM product_tabs
				WHERE 1 
				".$where_clause."
				ORDER BY id DESC";
			*/

        $Sql = "SELECT product_tabs.id, product_tabs.name, product_tabs.status,product_tabs.sort_id 
			FROM product_tabs 
			where   product_tabs.status=1 and   product_tabs.id in(1,2,3)
			order by product_tabs.sort_id DESC";

        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['tab_name'] = $Row['name'];
                $result['sortid'] = $Row['sort_id'];
                $result['status'] = ($Row['status'] == 1) ? "Active" : "Inactive";
                $response['response'][] = $result;


            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_tabs($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";

        if (!empty($attr['keyword'])) {
            $where_clause .= " AND name LIKE '%$attr[keyword]%' ";
        }
        if (empty($attr['all'])) {
            if (empty($attr['start'])) $attr['start'] = 0;
            if (empty($attr['limit'])) $attr['limit'] = 10;
            $limit_clause = " LIMIT $attr[start] , $attr[limit]";
        }
        $response = array();

        $Sql = "SELECT product_tabs.id, product_tabs.name, product_tabs.status,product_tabs.sort_id 
			FROM product_tabs 
			where product_tabs.status=1 and 
			 product_tabs.company_id=" . $this->arrUser['company_id'] . "
			order by product_tabs.sort_id DESC";


        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['tab_name'] = $Row['name'];
                $result['sortid'] = $Row['sort_id'];
                $result['status'] = ($Row['status'] == 1) ? "Active" : "Inactive";
                $response['response'][] = $result;


            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_tab_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM product_tabs
				WHERE id='".$attr['id']."'
				LIMIT 1";
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key)) unset($Row[$key]);
            }
            $response['response'] = $Row;
        } else {
            $response['response'] = array();
        }
        return $response;

    }

    function get_all_tabs($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT id, name, status,sort_id 
                FROM product_tabs
                where status=1 and company_id=" . $this->arrUser['company_id'] . " 
		        order by sort_id DESC";

        $RS = $this->objsetup->CSI($Sql);
        //echo "<pre>";print_r($Sql);
        $response['ack'] = 1;

        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            //$Row = $RS->FetchRow();
            while ($Row = $RS->FetchRow()) {
                // echo "<pre>";print_r($Row);
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $response['response'][] = $result;
            }

        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function add_tab($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        //echo "before function";

        $sql_total = "SELECT  count(id) as total,id	FROM product_tabs	WHERE company_id='" . $this->arrUser['company_id'] . "'";
        $rs_count = $this->objsetup->CSI($sql_total);
        $total = $rs_count->fields['total'];
        $id = $rs_count->fields['id'];


        if ($total < MAX_TABS_LIMIT) {


            $sql_sort_id = "SELECT  Max(sort_id) as total  FROM product_tabs 
				WHERE company_id='" . $this->arrUser['company_id'] . "'";
            $rs_countttt = $this->objsetup->CSI($sql_sort_id);
            $total_sort = $rs_countttt->fields['total'];
            if (empty($total_sort)) {
                $total_s = 1;
            } else {
                $total_s = $total_sort + 1;
            }

            $Sql = "INSERT INTO product_tabs
					SET  
					name='".$arr_attr['name']."',
					status='$arr_attr[status]',
					sort_id='$total_s',  
					company_id='" . $this->arrUser['company_id'] . "',
					user_id='" . $this->arrUser['id'] . "'";

            $RS = $this->objsetup->CSI($Sql);
            //$id = $this->Conn->Insert_ID();

            if ($RS > 0) {
                $response['ack'] = 1;
                $response['error'] = NULL;
                return $response;
            }

        } else {
            $response['ack'] = 0;
            $response['error'] = 'Soryy Maximum limit is !  ' . HR_MAX_TABS;
            return $response;
        }
    }

    function update_tab($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "UPDATE product_tabs
				SET 
					name='".$arr_attr['name']."',
					status='$arr_attr[status]',  
					WHERE id = ".$arr_attr['id']." Limit 1";
        //exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not Updated!';
        }

        return $response;

    }

    function delete_tab($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        /*$Sql = "DELETE FROM product_tabs
				WHERE id = ".$arr_attr['id']." Limit 1";*/

        $Sql = "UPDATE product_tabs
		SET   status=0 WHERE id = ".$arr_attr['id']." Limit 1";
        //exit;

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

    function sort_tab($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);


        $upslide = strcmp($arr_attr['str'], "up");
        $downslide = strcmp($arr_attr['str'], "down");

        $add = $arr_attr['id'] + 1;
        $sort_id = $arr_attr['sort_id'];
        $sort_add = $sort_id + 1;
        $sort_drop = $sort_id - 1;
        $current = $arr_attr['id'];
        $count = 0;


        if ($upslide == 0) {
            $sql_total = "SELECT  sort_id	FROM product_tabs WHERE sort_id='" . $sort_drop . "'";
            $rs_count_start = $this->objsetup->CSI($sql_total);


            if ($rs_count_start->RecordCount() > 0) {


                $Sql = "UPDATE product_tabs SET sort_id = $sort_id WHERE sort_id =  $sort_drop Limit 1";
                $RS = $this->objsetup->CSI($Sql);

                $Sql2 = "UPDATE product_tabs SET sort_id = $sort_drop WHERE id = $current Limit 1 ";
                $RS2 = $this->objsetup->CSI($Sql2);

                $count++;
            }
        }

        if ($downslide == 0) {
            $sql_total = "SELECT  sort_id	FROM product_tabs WHERE sort_id='" . $sort_add . "'";

            $rs_count_start = $this->objsetup->CSI($sql_total);


            if ($rs_count_start->RecordCount() > 0) {

                $Sql = "UPDATE product_tabs SET sort_id = $sort_id WHERE sort_id = $sort_add Limit 1";
                $RS = $this->objsetup->CSI($Sql);

                $Sql2 = "UPDATE product_tabs SET sort_id = $sort_add WHERE id = $current Limit 1";
                $RS2 = $this->objsetup->CSI($Sql2);


                $count++;
            }
        }

        if ($count > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not deleted!';
        }

        return $response;

    }

    function status_tab($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "UPDATE product_tabs SET status='$arr_attr[status]' WHERE id = ".$arr_attr['id']." Limit 1";
        //exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not Updated!';
        }

        return $response;

    }
    ############	End: Product of Tabs  ######


    ############	Start: Product of Columns ##
    function get_tabs_col($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = "";

        if (!empty($attr['keyword'])) {
            $where_clause .= " AND name LIKE '%$attr[keyword]%' ";
        }
        if (empty($attr['all'])) {
            if (empty($attr['start'])) $attr['start'] = 0;
            if (empty($attr['limit'])) $attr['limit'] = 10;
            $limit_clause = " LIMIT $attr[start] , $attr[limit]";
        }
        $response = array();


        $Sql = "SELECT product_columns.id, product_columns.name, product_columns.sort_id, product_columns.description,
		product_columns.tab_id as t_id ,product_tabs.name as tabName  FROM product_columns
	
		LEFT JOIN product_tabs ON product_tabs.id = product_columns.tab_id
		LEFT  JOIN company on company.id=product_columns.company_id 
		where product_columns.status=1 and 
		( product_columns.company_id=" . $this->arrUser['company_id'] . " 
		or company.parent_id=" . $this->arrUser['company_id'] . ") 
		order by product_columns.tab_id DESC";


        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                /*	$result['tab_name'] = $Row['tabName'];  
				$result['id'] = $Row['id'];
				$result['Tabid'] = $Row['t_id'];
				$result['Sortid'] = $Row['sort_id'];
				$result['name'] = $Row['name'];
				//$result['tab_name'] = $Row['tabName'];
				$result['description'] = $Row['description']; 
				 $result['status'] = ($Row['status'] == "Active")?"InActive":"Active"; 
				 */

                $result['id'] = $Row['id'];
                $result['Tabid'] = $Row['t_id'];
                $result['Sortid'] = $Row['sort_id'];
                $result['name'] = $Row['name'];
                $result['tab_name'] = $Row['tabName'];
                //$result['description'] = $Row['description']; 
                //   $result['status'] =  $Row['status'] ;
                $result['status'] = ($Row['status'] == "1") ? "Active" : "Inactive";


                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_tab_col_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM product_columns
				WHERE status=1 and id='".$attr['id']."'
				LIMIT 1";
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key)) unset($Row[$key]);
            }
            $response['response'] = $Row;
        } else {
            $response['response'] = array();
        }
        return $response;

    }

    function get_cols_by_tab_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $where_clause = "";

        $Sql = "SELECT  product_columns.product_type,product_columns.sort_id,product_columns.tab_id,product_columns.name,
                        product_columns.id ,product_columns.display_label ,product_columns.display_type ,product_columns.display_require 
                FROM product_columns  
                where  product_columns.status=1  and product_columns.company_id=" . $this->arrUser['company_id'] . "
                and tab_id=$attr[tab_id] AND product_columns.status=1   
                " . $where_clause . "
                ORDER BY product_columns.sort_id DESC";//NOT IN(1,2,3,4,5) // AND product_columns.product_type =0
        $RS = $this->objsetup->CSI($Sql);
        
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {


                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['tab_id'] = $Row['tab_id'];
                $result['status'] = ($Row['status'] == "1") ? "Active" : "Inactive";
                $result['is_label'] = $Row['display_label'];
                $result['is_type'] = $Row['display_type'];
                $result['is_required'] = $Row['display_require'];/*
				$result['value'] = 'aa';
				if($total) {$result['value'] = $Row['value'];}   */
                $result['company_id'] = $Row['company_id'];
                $result['sort_id'] = $Row['sort_id'];
                $result['user_id'] = $Row['user_id'];
                $result['product_type'] = $Row['product_type'];
                $response['response'][] = $result;

            }
        } else {
            $response['response'] = array();
        }
        //echo "<pre>";print_r($response);exit;
        return $response;

    }

    function get_selected_category($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //echo "<pre>";print_r($attr);exit;
        $Sql = "SELECT *
				FROM product_columns
				WHERE status=1 and  tab_id='$attr[tab_id]' AND product_type=$attr[product_type]";
        //echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key)) unset($Row[$key]);
            }
            $response['response'] = $Row;
        } else {
            $response['response'] = array();
        }
        //echo "<pre>";print_r($response);exit;
        return $response;

    }

    function add_tab_col($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $sql_total = "SELECT  count(id) as total	FROM product_columns	WHERE tab_id='" . $arr_attr['tab_id'] . "' and
		company_id='" . $this->arrUser['company_id'] . "'";
        $rs_count = $this->objsetup->CSI($sql_total);
        $total = $rs_count->fields['total'];


        if ($total < MAX_FIELDS_LIMIT) {

            $sql_sort_id = "SELECT  Max(sort_id) as total  FROM product_columns 
				WHERE company_id='" . $this->arrUser['company_id'] . "' and tab_id='" . $arr_attr['tab_id'] . "'";
            $rs_countttt = $this->objsetup->CSI($sql_sort_id);
            $total_sort = $rs_countttt->fields['total'];
            if (empty($total_sort)) {
                $total_s = 1;
            } else {
                $total_s = $total_sort + 1;
            }
            //echo $total_s; 	 

            $Sql = "INSERT INTO product_columns
					SET 
					name='".$arr_attr['name']."',
					sort_id='$total_s',  
					description='$arr_attr[description]', 
					status='$arr_attr[status]', 
					tab_id='$arr_attr[tab_id]', 
					company_id='" . $this->arrUser['company_id'] . "',
					user_id='" . $this->arrUser['id'] . "'"; //sort_id='$arr_attr[sort_id]

            $RS = $this->objsetup->CSI($Sql);
            // echo $Sql ;exit;
            if ($RS > 0) {
                $response['ack'] = 1;
                $response['error'] = NULL;
                return $response;
            }
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Soryy Maximum limit is !  ' . HR_MAX_FIELDS;
            return $response;
        }
    }

    function update_tab_col($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "UPDATE product_columns
				SET 
					name='".$arr_attr['name']."',
					description='$arr_attr[description]', 
					status='$arr_attr[status]', 
					tab_id='$arr_attr[tab_id]',  
					sort_id='$arr_attr[sort_id]'
					WHERE id = ".$arr_attr['id']." LIMIT 1 ";
        //exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not Updated!';
        }

        return $response;

    }

    function update_tab_col_val($arr_attr, $category_id, $brand_id, $unit_id, $product_id, $product_name, $product_code)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        if ($product_id == 0) {
            //echo "In if";
            // Insert record into the Products table
            $SqlProducts = "INSERT INTO product
					SET 
						name='" . $product_name . "',
						product_code='" . $product_code . "',
						status='1', 
						company_id='" . $this->arrUser['company_id'] . "',
						user_id='" . $this->arrUser['id'] . "', 
						date_added=UNIX_TIMESTAMP (NOW())";
            $RSProducts = $this->objsetup->CSI($SqlProducts);
            $product_id = $this->Conn->Insert_ID();

            $response['heading'] = 'Add';
            $response['msg'] = 'Record Inserted Successfully';
        } else {
            //echo "In else";
            if (!empty($product_name) || !empty($product_code)) {
                $Sql = "UPDATE product SET name='" . $product_name . "', product_code='" . $product_code . "' WHERE id = " . $product_id;
                //echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            }
            $response['heading'] = 'Updated';
            $response['msg'] = 'Record Updated Successfully';
            $product_id = $product_id;
        }
        //exit;

        if ($category_id != 0) {
            $Sql = "SELECT * FROM product_columns WHERE company_id='" . $this->arrUser['company_id'] . "' AND product_type =1";
            $RS = $this->objsetup->CSI($Sql);
            $Row = $RS->FetchRow();

            if (!empty($Row['id'])) {
                $SqlCheck = "SELECT * FROM product_values WHERE product_id = " . $product_id . " AND column_id=" . $Row['id'] . " AND company_id=" . $this->arrUser['company_id'];
                $RSCheck = $this->objsetup->CSI($SqlCheck);
                $num_rows = $RSCheck->RecordCount();
            }

            if ($num_rows == 0 && $product_id == 0) {
                $Sql = "INSERT INTO product_values 
						SET  
						value='" . $category_id . "',
						product_id='" . $product_id . "',
						column_id='" . $Row['id'] . "',
						tab_id='" . $Row['tab_id'] . "',
						company_id='" . $this->arrUser['company_id'] . "',
						user_id='" . $this->arrUser['id'] . "'";
                $RS = $this->objsetup->CSI($Sql);
                $response['heading'] = 'Add';
                $response['msg'] = 'Record Inserted Successfully';

            } else if (empty($Row['id'])) {
                $Sql = "INSERT INTO product_values 
						SET  
						value='" . $category_id . "',
						product_id='" . $product_id . "',
						column_id='" . $Row['id'] . "',
						tab_id='" . $Row['tab_id'] . "',
						company_id='" . $this->arrUser['company_id'] . "',
						user_id='" . $this->arrUser['id'] . "'";
                $response['heading'] = 'Add';
                $response['msg'] = 'Record Inserted Successfully';

            } else {
                $Sql = "UPDATE product_values SET value='" . $category_id . "' WHERE product_id = " . $product_id . " AND column_id=" . $Row['id'] . " AND company_id=" . $this->arrUser['company_id'];
                $RS = $this->objsetup->CSI($Sql);
                $response['heading'] = 'Updated';
                $response['msg'] = 'Record Updated Successfully';
            }
        }


        if ($brand_id != 0) {
            $Sql = "SELECT * FROM product_columns WHERE company_id='" . $this->arrUser['company_id'] . "' AND product_type =2";
            $RS = $this->objsetup->CSI($Sql);
            $Row = $RS->FetchRow();

            if (!empty($Row['id'])) {
                $SqlCheck = "SELECT * FROM product_values WHERE product_id = " . $product_id . " AND column_id=" . $Row['id'] . " AND company_id=" . $this->arrUser['company_id'];
                $RSCheck = $this->objsetup->CSI($SqlCheck);
                $num_rows = $RSCheck->RecordCount();
            }

            if ($num_rows == 0 && $product_id == 0) {
                $Sql = "INSERT INTO product_values 
						SET  
						value='" . $brand_id . "',
						product_id='" . $product_id . "',
						column_id='" . $Row['id'] . "',
						tab_id='" . $Row['tab_id'] . "',
						company_id='" . $this->arrUser['company_id'] . "',
						user_id='" . $this->arrUser['id'] . "'";
                $RS = $this->objsetup->CSI($Sql);
                $response['heading'] = 'Add';
                $response['msg'] = 'Record Inserted Successfully';

            } else if (empty($Row['id'])) {
                $Sql = "INSERT INTO product_values 
						SET  
						value='" . $brand_id . "',
						product_id='" . $product_id . "',
						column_id='" . $Row['id'] . "',
						tab_id='" . $Row['tab_id'] . "',
						company_id='" . $this->arrUser['company_id'] . "',
						user_id='" . $this->arrUser['id'] . "'";
                $RS = $this->objsetup->CSI($Sql);
                $response['heading'] = 'Add';
                $response['msg'] = 'Record Inserted Successfully';

            } else {
                $Sql = "UPDATE product_values SET value='" . $brand_id . "' WHERE product_id = " . $product_id . " AND column_id=" . $Row['id'] . " AND company_id=" . $this->arrUser['company_id'];
                $RS = $this->objsetup->CSI($Sql);
                $response['heading'] = 'Updated';
                $response['msg'] = 'Record Updated Successfully';
            }

        }

        if ($unit_id != 0) {
            $Sql = "SELECT * FROM product_columns WHERE company_id='" . $this->arrUser['company_id'] . "' AND product_type =3";
            $RS = $this->objsetup->CSI($Sql);
            $Row = $RS->FetchRow();

            if (!empty($Row['id'])) {
                $SqlCheck = "SELECT * FROM product_values WHERE product_id = " . $unit_id . " AND column_id=" . $Row['id'] . " AND company_id=" . $this->arrUser['company_id'];
                $RSCheck = $this->objsetup->CSI($SqlCheck);
                $num_rows = $RSCheck->RecordCount();
            }


            if ($num_rows == 0 && $product_id == 0) {
                $Sql = "INSERT INTO product_values 
						SET  
						value='" . $unit_id . "',
						product_id='" . $product_id . "',
						column_id='" . $Row['id'] . "',
						tab_id='" . $Row['tab_id'] . "',
						company_id='" . $this->arrUser['company_id'] . "',
						user_id='" . $this->arrUser['id'] . "'";
                $RS = $this->objsetup->CSI($Sql);
                $response['heading'] = 'Add';
                $response['msg'] = 'Record Inserted Successfully';

            } else if (empty($Row['id'])) {
                $Sql = "INSERT INTO product_values 
						SET  
						value='" . $unit_id . "',
						product_id='" . $product_id . "',
						column_id='" . $Row['id'] . "',
						tab_id='" . $Row['tab_id'] . "',
						company_id='" . $this->arrUser['company_id'] . "',
						user_id='" . $this->arrUser['id'] . "'";
                $RS = $this->objsetup->CSI($Sql);
                $response['heading'] = 'Add';
                $response['msg'] = 'Record Inserted Successfully';

            } else {
                $Sql = "UPDATE product_values SET value='" . $unit_id . "' WHERE product_id = " . $product_id . " AND column_id=" . $Row['id'] . " AND company_id=" . $this->arrUser['company_id'];
                $RS = $this->objsetup->CSI($Sql);
                $response['heading'] = 'Updated';
                $response['msg'] = 'Record Updated Successfully';
            }
        }

        foreach ($arr_attr as $key => $value) {

            $SqlCheck = "SELECT * FROM product_values WHERE product_id = " . $product_id . " AND column_id=" . $key . " AND company_id=" . $this->arrUser['company_id'];
            $RSCheck = $this->objsetup->CSI($SqlCheck);
            $num_rows = $RSCheck->RecordCount();

            if ($product_id == 0 || $num_rows == 0) {

                $Sql = "SELECT * FROM product_columns WHERE id=" . $key;
                $RS = $this->objsetup->CSI($Sql);
                $Row = $RS->FetchRow();

                $Sql = "INSERT INTO product_values 
						SET  
						value='" . $value . "',
						product_id='" . $product_id . "',
						column_id='" . $key . "',
						tab_id='" . $Row['tab_id'] . "',
						company_id='" . $this->arrUser['company_id'] . "',
						user_id='" . $this->arrUser['id'] . "'";
                $RS = $this->objsetup->CSI($Sql);
                $response['heading'] = 'Add';
                $response['msg'] = 'Record Inserted Successfully';

            } else {
                $Sql = "UPDATE product_values SET value='" . $value . "' WHERE product_id = " . $product_id . " AND column_id=" . $key . " AND company_id=" . $this->arrUser['company_id'];
                $RS = $this->objsetup->CSI($Sql);
                $response['heading'] = 'Updated';
                $response['msg'] = 'Record Updated Successfully';
            }

        }


        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($product_id > 0) {
            $response['product_id'] = $product_id;
            $response['ack'] = 1;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not Updated!';
        }

        return $response;

    }

    function delete_tab_col($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        /*	$Sql = "DELETE FROM product_columns
				WHERE id = ".$arr_attr['id']." Limit 1";*/
        $Sql = "UPDATE product_columns SET status=0 WHERE id = ".$arr_attr['id']." Limit 1";
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

    function status_tab_col($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "UPDATE product_columns SET status='$arr_attr[status]' WHERE id = ".$arr_attr['id']." Limit 1";
        //exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not Updated!';
        }

        return $response;

    }


    function get_list_by_tab_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $id = $attr['tab_id']->id;


        $Sql = "SELECT product_columns.id, product_columns.name, product_columns.sort_id, product_columns.description,
		 product_columns.tab_id as t_id ,product_tabs.name as tabName  FROM product_columns
		
		LEFT JOIN product_tabs ON product_tabs.id = product_columns.tab_id
		LEFT  JOIN company on company.id=product_columns.company_id 
		where  product_columns.status=1 and product_columns.tab_id=$id and product_columns.company_id=" . $this->arrUser['company_id'] . " 
		or  company.parent_id=" . $this->arrUser['company_id'] . " 	
		
		order by product_columns.sort_id DESC";


        $RS = $this->objsetup->CSI($Sql);
        //echo "<pre>";print_r($Sql);exit;
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {

                $result['id'] = $Row['id'];
                $result['Tabid'] = $Row['t_id'];
                $result['Sortid'] = $Row['sort_id'];
                $result['name'] = $Row['name'];
                $result['tab_name'] = $Row['tabName'];
                //$result['description'] = $Row['description']; 
                $result['status'] = ($Row['status'] == "1") ? "Active" : "Inactive";
                $response['response'][] = $result;
            }
        } else {
            $response['response'] = array();
        }

        return $response;

    }

    function sort_tab_col($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        // print_r($arr_attr);exit;

        $upslide = strcmp($arr_attr['str'], "up");
        $downslide = strcmp($arr_attr['str'], "down");

        $add = $arr_attr['id'] + 1;
        $sort_id = $arr_attr['sort_id'];
        $sort_post = $sort_id + 1;
        $sort_pre = $sort_id - 1;

        $current = $arr_attr['id'];
        $count = 0;


        if ($upslide == 0)//&& $arr_attr['index']>=0
        {
            $sql_total = "SELECT  *	FROM product_columns WHERE sort_id='" . $sort_pre . "' and tab_id='" . $arr_attr['t_id'] . "'";
            $rs_count_start = $this->objsetup->CSI($sql_total);


            if ($rs_count_start->RecordCount() > 0) {


                $Sql = "UPDATE product_columns SET sort_id = $sort_id WHERE sort_id =  $sort_pre Limit 1 ";
                $RS = $this->objsetup->CSI($Sql);

                $Sql2 = "UPDATE product_columns SET sort_id = $sort_pre WHERE id = $current Limit 1 ";
                $RS2 = $this->objsetup->CSI($Sql2);

                $count++;
            }
        }

        if ($downslide == 0) //&& $arr_attr['index']>=0
        {
            $sql_total = "SELECT  *	FROM product_columns WHERE sort_id='" . $sort_post . "'and tab_id='" . $arr_attr['t_id'] . "'";
            $rs_count_start = $this->objsetup->CSI($sql_total);


            if ($rs_count_start->RecordCount() > 0) {

                $Sql = "UPDATE product_columns SET sort_id = $sort_id WHERE sort_id = $sort_post and tab_id='" . $arr_attr['t_id'] . "' Limit 1 ";
                $RS = $this->objsetup->CSI($Sql);

                $Sql2 = "UPDATE product_columns SET sort_id = $sort_post WHERE id = $current and tab_id='" . $arr_attr['t_id'] . "'Limit 1 ";
                $RS2 = $this->objsetup->CSI($Sql2);
                $count++;
            }
        }

        //exit;

        if ($count > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            return $response;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'record not updated!';
            return $response;
        }
    }

    ############	End: Product of Columns ####


    ############	Start: Tab values ##########
    function get_tab_values($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = "";


        $response = array();

        $Sql = "SELECT *
				FROM product_values
				WHERE 1 
				" . $where_clause . "
				ORDER BY id DESC";


        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['tab_name'] = $Row['tabName'];
                $result['description'] = $Row['description'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_tab_value_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT product_values.*, product_columns.product_type
				FROM product_values
				JOIN product_columns ON product_columns.id = product_values.column_id
				WHERE product_values.product_id='" . $attr['product_id'] . "' AND product_values.tab_id='" . $attr['tab_id'] . "' AND product_values.company_id=" . $this->arrUser['company_id'];
        //echo $Sql;exit;	
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $response['response'] = array();
            while ($Row = $RS->GetRows()) {
                /*foreach($Row as $key => $value){
				if(is_numeric($key)) unset($Row[$key]);
			}*/
                $response['response'] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }
        //echo "response<pre>";print_r($response);exit;
        return $response;

    }

    function add_tab_value($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        //echo "<pre>";print_r($arr_attr);exit;
        foreach ($arr_attr as $key => $value) {

            $Sql = "INSERT INTO product_values
				SET 
					value='$arr_attr[value]',
					column_id='$arr_attr[column_id]', 
					company_id='" . $this->arrUser['company_id'] . "',
					user_id='" . $this->arrUser['id'] . "'";
            //echo $Sql;exit;			
            $RS = $this->objsetup->CSI($Sql);
        }
        $id = $this->Conn->Insert_ID();
        //exit;
        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
        }

        return $response;

    }

    function update_tab_value($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "UPDATE product_values
				SET 
					value='$arr_attr[value]',
					column_id='$arr_attr[column_id]', 
					company_id='" . $this->arrUser['company_id'] . "',
					user_id='" . $this->arrUser['id'] . "'
					WHERE id = ".$arr_attr['id']." LIMIT 1";
        //exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not Updated!';
        }

        return $response;

    }

    function delete_tab_value($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        /*$Sql = "DELETE FROM product
				WHERE id = ".$arr_attr['id']." Limit 1";
		*/

        $Sql = "UPDATE product SET status=0 WHERE id = ".$arr_attr['id']." Limit 1";
        $RS = $this->objsetup->CSI($Sql);
        //  print_r($Sql);exit;
        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is already changed!';
        }

        return $response;
    }
    ############	Start: Tab values ##########


    ############	Start: Product Values ######
    function get_prod_values($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = "";


        $response = array();

        $Sql = "SELECT id, value
				FROM product_values
				WHERE 1 
				" . $where_clause . "
				ORDER BY id DESC";

        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['value'] = $Row['value'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_prod_value_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM product_values
				WHERE id='".$attr['id']."'
				LIMIT 1";
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key)) unset($Row[$key]);
            }
            $response['response'] = $Row;
        } else {
            $response['response'] = array();
        }
        return $response;

    }

    function add_prod_value($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "INSERT INTO product_values
				SET 
					value='$arr_attr[value]',
					column_id='$arr_attr[column_id]', 
					product_id='$arr_attr[product_id]', 
					company_id='$arr_attr[company_id]'";
        //exit;			
        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();
        //exit;
        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
        }

        return $response;

    }

    function update_prod_value($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "UPDATE product_values
				SET 
					value='$arr_attr[value]',
					column_id='$arr_attr[column_id]', 
					product_id='$arr_attr[product_id]', 
					company_id='$arr_attr[company_id]'
					WHERE id = ".$arr_attr['id']." LIMIT 1";
        //exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not Updated!';
        }

        return $response;

    }

    function delete_prod_value($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "UPDATE product_values SET status=0 WHERE id = ".$arr_attr['id']." Limit 1";
        //exit;
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

    function status_prod_value($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "UPDATE product_values SET status='$arr_attr[status]' WHERE id = ".$arr_attr['id']." Limit 1";
        //exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not Updated!';
        }

        return $response;

    }


    function get_product_details_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT * FROM product WHERE   id='$attr[product_id]' LIMIT 1";
        //echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key)) unset($Row[$key]);
            }
            $response['response'] = $Row;
        } else {
            $response['response'] = array();
        }
        //echo "<pre>";print_r($response);exit;
        return $response;

    }

    function get_pr_value_by_undefined($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT product_values.*, product_columns.product_type, product_columns.name 
		FROM product_values
		JOIN product_columns ON product_columns.id = product_values.column_id
		WHERE  product_columns.status=1 and  product_columns.product_type=0 and  product_values.product_id='" . $attr['product_id'] . "' 
		AND product_values.tab_id='" . $attr['tab_id'] . "'";//and product_columns.employee_type=0  
        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {

                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['value'] = $Row['value'];
                $result['employee_type'] = $Row['employee_type'];
                $result['employee_column_id'] = $Row['employee_column_id'];
                $result['tab_id'] = $Row['tab_id'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }


        return $response;

    }

    function get_pr_value_by_defined($attr)
    {
        return; // removing table employee_values from db as it is not being used
        $Sql = "SELECT employee_values.*, product_columns.employee_type, product_columns.name 
		FROM employee_values
		Left JOIN product_columns ON product_columns.id = employee_values.employee_column_id
		WHERE    product_columns.status=1 and  employee_values.emplyees_id='" . $attr['product_id'] . "' 
		AND employee_values.tab_id='" . $attr['tab_id'] . "'
		AND employee_values.company_id=" . $this->arrUser['company_id'];
        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {

                $result['id'] = $Row['id'];
                //$result['name'] = $Row['name'];
                //$result['tab_id'] = $Row['tab_id'];
                //$result['employee_type'] = $Row['employee_type'];

                //$result['is_label'] = $Row['display_label'];
                //$result['is_type'] = $Row['display_type'];
                //$result['is_required'] = $Row['display_require'];
                $result['field_name'] = $Row['field_name'];
                $result['value'] = $Row['value'];

                //$result['employee_column_id'] = $Row['employee_column_id']; 
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }
        return $response;

    }

    function get_cat_value($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT product_values.value
		FROM product_values
		INNER JOIN product_columns ON product_columns.id = product_values.column_id
		WHERE product_columns.status=1  and product_values.product_id=" . $attr['product_id'] . " AND product_columns.product_type=1 AND product_values.company_id=" . $this->arrUser['company_id'];

        //echo $Sql;exit;		
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key)) unset($Row[$key]);
            }
            $response['response'] = $Row;
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function get_brand_value($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT product_values.value
				FROM product_values
				INNER JOIN product_columns ON product_columns.id = product_values.column_id
				WHERE   product_columns.status=1  and product_values.product_id=" . $attr['product_id'] . " AND product_columns.product_type=2 AND product_values.company_id=" . $this->arrUser['company_id'];
        //echo $Sql;exit;	

        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key)) unset($Row[$key]);
            }
            $response['response'] = $Row;
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function get_unit_measure_value($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT product_values.value
				FROM product_values
				INNER JOIN product_columns ON product_columns.id = product_values.column_id
				WHERE  product_columns.status=1 and product_values.product_id=" . $attr['product_id'] . " AND product_columns.product_type=3 AND product_values.company_id=" . $this->arrUser['company_id'];
        //echo $Sql;exit;		
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key)) unset($Row[$key]);
            }
            $response['response'] = $Row;
        } else {
            $response['response'] = array();
        }
        return $response;
    }


    ############	Start: Products Listing ####


    function get_products_popup_invoice($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);exit;
        $limit_clause = $where_clause = "";

        if (!empty($attr['keyword'])) $where_clause .= " AND prd.name LIKE '%$attr[keyword]%' ";

        if (empty($attr['all'])) {
            if (empty($attr['start'])) $attr['start'] = 0;
            if (empty($attr['limit'])) $attr['limit'] = 10;
            $limit_clause = " LIMIT $attr[start] , $attr[limit]";
        }
        $response = array();


        $Sql = "SELECT prd.*,vat.vat_name as vat
	,prd.standard_price
		, " . $this->objGeneral->get_nested_query_list('cat', $this->arrUser['company_id']) . "
		, " . $this->objGeneral->get_nested_query_list('brand', $this->arrUser['company_id']) . "
		, " . $this->objGeneral->get_nested_query_list('unit', $this->arrUser['company_id']) . "
		, " . $this->objGeneral->current_stock_counter($this->arrUser['company_id']) . "
	From product  prd
	LEFT  JOIN vat on vat.id=prd.vat_rate_id 
	where prd.status=1  and prd.product_code IS NOT NULL 
	and prd.company_id=" . $this->arrUser['company_id'] . " " . $where_clause . "
	ORDER BY prd.id DESC";


        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);
                }

                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_purchased_products_popup($attr)
    {


        $this->objGeneral->mysql_clean($attr);
        //  print_r($attr);exit;
        $total = $where_clause = "";


        if (!empty($attr['category_id']))
            $where_clause .= " AND prd.category_id = " . $attr['category_id'];


        if (!empty($attr['search_string'])) {
            $where_clause .= " AND (prd.description LIKE '%$attr[search_string]%' OR prd.product_code LIKE '%$attr[search_string]%' OR prd.standard_price LIKE '%$attr[search_string]%') ";
        }

        $response = array();


        $Sql = "SELECT DISTINCT prd.id, prd.product_code, prd.description,company.name as company
,prd.prd_picture, prd.current_stock_level, prd.standard_price ,
prd.profit_percentage ,prd.prd_dimensions  
,prd.standard_price
		, " . $this->objGeneral->get_nested_query_list('cat', $this->arrUser['company_id']) . "
		, " . $this->objGeneral->get_nested_query_list('brand', $this->arrUser['company_id']) . "
		, " . $this->objGeneral->get_nested_query_list('unit', $this->arrUser['company_id']) . "
		, " . $this->objGeneral->current_stock_counter($this->arrUser['company_id']) . "  From product  prd
                INNER JOIN warehouse_allocation as wha ON prd.id = wha.product_id
                JOIN units_of_measure_setup st on st.product_id =prd.id
                where wha.type = 1 and wha.purchase_status in (2,3) and prd.status = 1 and
                      prd.company_id=" . $this->arrUser['company_id'] . " and
                       prd.product_code IS NOT NULL " . $where_clause . "
                ORDER BY prd.id DESC";

        // echo $Sql; exit;

        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);
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

    function get_purchase_products_popup($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $total = $where_clause = "";


        if (!empty($attr['category_id']))
            $where_clause .= " AND prd.category_id = " . $attr['category_id'];


        if (!empty($attr['search_string'])) {
            $where_clause .= " AND (prd.description LIKE '%$attr[search_string]%' OR prd.product_code LIKE '%$attr[search_string]%' OR prd.standard_price LIKE '%$attr[search_string]%') ";
        }

        $response = array();


        $Sql = "SELECT prd.*
		,prd.standard_price
		, " . $this->objGeneral->get_nested_query_list('cat', $this->arrUser['company_id']) . "
		, " . $this->objGeneral->get_nested_query_list('brand', $this->arrUser['company_id']) . "
		, " . $this->objGeneral->get_nested_query_list('unit', $this->arrUser['company_id']) . "
		, " . $this->objGeneral->current_stock_counter($this->arrUser['company_id']) . "
		
		From product prd
		where prd.status=1  and prd.product_code IS NOT NULL and
		prd.company_id=" . $this->arrUser['company_id'] . "	" . $where_clause . "
		ORDER BY prd.id DESC";
        $rs_count = $this->objsetup->CSI($Sql);


        if ($rs_count->RecordCount() > 0) {
            while ($Row = $rs_count->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);
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

    function get_products_listing($attr)
    {        
        //$this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $defaultFilter = false;
        //print_r($attr);exit;
        $fieldsMeta = '';
        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.",$attr,$fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.",$attr,$fieldsMeta);
        if (empty($where_clause)){
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("Item",$this->arrUser);
        }      

        $response = array();
        
        
        //echo $WhereQueries;
        //exit;
        $Sql = "select * from (SELECT *,
                        (CASE WHEN prd.stock_check > 0 THEN 'Yes' ELSE 'No' END) AS allocation_required,
                        (SELECT GROUP_CONCAT(psl.substitute_product_code SEPARATOR ',')
                            FROM product_substitute_link AS psl 
                            WHERE psl.product_id=prd.id) AS link_to_sub_items,
                        sr_sel_title_byName(
                            prd.company_id,'units_of_measure_setup',prd.id)  AS bar_code
                            
                FROM  productcache as prd 
                WHERE prd.product_code IS NOT NULL AND 
                     (prd.company_id=" . $this->arrUser['company_id'] . " )   ";
            
        /*
        ,
        SR_CURRENT_OR_AVAILABLE_STOCK(
            prd.id,prd.company_id,5)  AS total_sales_order_stock1,
        SR_CURRENT_OR_AVAILABLE_STOCK(
            prd.id,prd.company_id,7)  AS total_sales_quote_stock1
        */
        
          //$Sql = $this->objsetup->whereClauseAppender($Sql,11);

          $Sql .= "   ) as tbl where 1 
                     " . $where_clause . " ";
        // echo $Sql; exit;
        //or  company.parent_id=" . $this->arrUser['company_id'] . ")

        if ($arg == 1) 
            $direct_limit = cache_pagination_limit;
        else 
            $direct_limit = pagination_limit;

        //Generic method
        //defualt Variable
        $total_limit = $direct_limit;
        
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits']) 
            $total_limit = $attr['pagination_limits'];


        $column = 'tbl.id';

        if ($order_clause == "")
            $order_type = "Order BY " . $column . " DESC";
        else
            $order_type = $order_clause;           

        $response = $this->objGeneral->preListing($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        //  echo $response['q'];  exit;
        require_once(SERVER_PATH . "/classes/Setup.php");
        $objsetup = new Setup($this->arrUser);

         $response['response']['tbl_meta_data'] = $objsetup->GetTableMetaData('Item');
         $response['response']['tbl_meta_data']['defaultFilter'] = $defaultFilter;
         
        $RS =  $this->objsetup->CSI($response['q'], "item", sr_ViewPermission);
        

        $response['q'] = '';
        
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                // $Row['current_stock'] = $Row['current_stock1'];
                // $Row['available_stock'] = $Row['available_stock1'];
                // $Row['allocated_stock'] = $Row['allocated_stock1'];
                // $Row['unallocated_stock'] = $Row['unallocated_stock1'];
                // $Row['total_purchase_order_stock'] = $Row['total_purchase_order_stock1'];
                // $Row['total_sales_order_stock'] = $Row['total_sales_order_stock1'];
                // $Row['total_sales_quote_stock'] = $Row['total_sales_quote_stock1'];

                $Row['reorder_quantity'] = (int)$Row['reorder_quantity'];
                $Row['available_stock'] = (int)$Row['available_stock'];
                $response['total'] = $Row['totalRecordCount'];
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response = $this->objGeneral->postListing($attr, $response);
            
       
        } 
        else   {
            $response['ack'] = 1;
            $response['response'][] = array();
        }
        return $response;
    }

    function itemDetailsPriceQty($attr) {
        // $result = array();

        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $defaultFilter = false;
        $cond = $attr['cond'];  

        
        $orderDate = $this->objGeneral->convert_date($attr['orderDate']);     

        if (!empty($attr['searchKeyword'])) {
            $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.", $attr, $fieldsMeta);
            $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.", $attr, $fieldsMeta);
        } 

         if (empty($where_clause)) {
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("Item", $this->arrUser);
        } 

        $attr['itemCond'] = 'item';
        $attr['itemWhereClause'] = $where_clause;

        $response = array();

         /*  old code start */

        /* $Sql = "SELECT * FROM ( SELECT prd.*,prdPrice.standard_price AS RecStandardPrice,
                                         prdPrice.min_max_sale_price AS MaxPrice,
                                         prdPrice.min_qty,
                                         prdPrice.max_qty,
                                         prdPrice.start_date
                                FROM sr_product_purchaselist AS prd 
                                LEFT JOIN product_price AS prdPrice on prd.id = prdPrice.product_id
                                WHERE prdPrice.type = 2 AND 
                                    prdPrice.company_id='" . $this->arrUser['company_id'] . "' AND
                                    $orderDate BETWEEN (FLOOR(start_date/86400)*86400) AND (FLOOR(end_date/86400)*86400) AND 
                                    prd.company_id=" . $this->arrUser['company_id'] . ") AS tbl 
                    where 1 " . $where_clause . " ";  */
        
        $Sql = " SELECT tbl.*,prdPrice.standard_price AS RecStandardPrice,
                            prdPrice.min_max_sale_price AS MaxPrice,
                            prdPrice.min_qty,
                            prdPrice.max_qty,
                            prdPrice.start_date,
                            getSupplierPriceOffer(".$attr['srm_id'].",".$orderDate.",tbl.id," . $this->arrUser['company_id'] . ") AS price_offer                           

                 FROM sr_product_purchaselist AS tbl 
                 LEFT JOIN product_price AS prdPrice on tbl.id = prdPrice.product_id AND prdPrice.type = 2 AND 
                           prdPrice.company_id='" . $this->arrUser['company_id'] . "' AND
                           ".$orderDate." BETWEEN (FLOOR(prdPrice.start_date/86400)*86400) AND (FLOOR(prdPrice.end_date/86400)*86400)
                 
                 WHERE tbl.company_id=" . $this->arrUser['company_id'] . "  " . $where_clause . " "; 

        /* $Sql = "SELECT tbl.*
                    FROM sr_product_purchaselist AS tbl 
                    WHERE company_id=" . $this->arrUser['company_id'] . "  " . $where_clause . " "; */
        /* 
                            po.id AS poID, 
                            poi.itemOfferPrice AS price_offer, 
                            poi.`minQty` AS minPriceSaleQty,
                            poi.`maxQty` AS maxPriceSaleQty,
                            poiv.discount AS volumePricediscount,
                            poiv.discountType AS discountPricetype,
                            poiv.min AS minPriceqty

                            (SELECT poi.itemOfferPrice 
                             FROM priceofferitem AS poi 
                             LEFT JOIN priceoffer AS po ON po.id = poi.priceID AND po.priceType IN (2,3) AND po.moduleID =  ".$attr['srm_id']." AND  po.moduleType = 2 AND ($orderDate  BETWEEN (FLOOR(po.start_date/86400)*86400) AND 
                                (CASE WHEN po.end_date = 0 THEN 4099299120 
                                    ELSE (FLOOR(po.end_date/86400)*86400)
                                END ))
                             WHERE poi.itemID = tbl.id AND poi.minQty <= 1 
                             ORDER BY poi.id DESC 
                            LIMIT 1) AS price_offer

                 LEFT JOIN priceofferitem AS poi ON poi.itemID = tbl.id AND poi.minQty <= 1
                 LEFT JOIN priceoffer AS po ON po.id = poi.priceID and po.priceType IN (2,3) AND po.moduleID = ".$attr['srm_id']." AND  po.moduleType = 2 AND $orderDate                BETWEEN (FLOOR(po.start_date/86400)*86400) AND 
                            CASE WHEN po.end_date = 0 THEN 4099299120 
                                 ELSE (FLOOR(po.end_date/86400)*86400)
                            END                  
                 LEFT JOIN priceofferitemvolume AS poiv ON poiv.priceID = po.id  AND poiv.itemID = poi.itemID
         */

        $subQueryForBuckets = "SELECT  prd.id
                               FROM productcache prd
                               WHERE prd.id IS NOT NULL  AND 
                                     prd.company_id=" . $this->arrUser['company_id'] . "";
        //$subQueryForBuckets = $this->objsetup->whereClauseAppender($subQueryForBuckets, 11);

        // echo $subQueryForBuckets;exit;

        $Sql .= " AND (tbl.id IN (".$subQueryForBuckets.")) "; //GROUP BY tbl.id,COALESCE(tbl.wh_warehouse_id,0)

         // echo $Sql;exit;

        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if (!empty($attr['sort_column'])) {
            $column = 'tbl.' . $attr['sort_column'];

            if ($attr['sort_column'] == 'product_code')
                $column = 'tbl.' . 'product_code';
            else if ($attr['sort_column'] == 'description')
                $column = 'tbl.' . 'description';
            else if ($attr['sort_column'] == "statusp")
                $column = 'tbl.' . 'statusp';
            else if ($attr['sort_column'] == "category_name")
                $column = 'tbl.' . 'category_name';
            else if ($attr['sort_column'] == "brand_name")
                $column = 'tbl.' . 'brand_name';
            else if ($attr['sort_column'] == "unit_name")
                $column = 'tbl.' . 'unit_name';

            $order_type = "Order BY " . $column . " DESC";
        }

        $column = 'tbl.id';

        if ($order_clause == "")
            $order_type = "Order BY " . $column . " DESC";
        else
            $order_type = $order_clause;

        $response = $this->objGeneral->preListing($attr, $Sql, $response, $total_limit, 'tbl', $order_type);

        // $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        // echo $response['q'];exit;

        if ($cond == 'Detail')
            $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData('itemDetailPriceModal');
        else if ($cond == 'setupDetail')
            $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData('itemSetupDetailPriceModal');

        $RS = $this->objsetup->CSI($response['q'], "item", sr_ViewPermission);

        $response['q'] = '';

        // $RS = $this->objsetup->CSI($Sql);

        // echo '<pre>'; print_r($RS);

        $prev_row_id = 0;
        $prev_wh_id = 0;
        $count = -1;

        if ($RS->RecordCount() > 0) {
            
            while ($Row = $RS->FetchRow()) {
                
               foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);
                }            

                 if($prev_row_id != $Row['id'])
                {
                    $count++;
                    $attr['product_id'] = $Row['id'];
                    // $Row['arr_units'] = self::get_unit_setup_list_category_by_item($attr);

                    $uomArray['response'] = array();
                    $uomArray['response'][0] = (object) array();
                    $uomArray['response'][0]->id = $Row['uomSetupID'];
                    $uomArray['response'][0]->name = $Row['uom'];
                    $uomArray['response'][0]->quantity = $Row['uomSetupQty'];
                    $uomArray['response'][0]->unit_id = $Row['uomSetupCatID'];
                    $uomArray['response'][0]->ref_unit_id = $Row['uomSetupRefUnitID'];
                    $uomArray['response'][0]->ref_quantity = $Row['uomSetupRefQty'];

                    $Row['arr_units'] = $uomArray;
                    // $sales_prices = self::getSalesPriceOfferVolumebyItemID($Row['id']);
                    // $Row['sales_prices'] = $sales_prices['response'];
                    $Row['sales_prices'] = array();
                    // $Row['price_offer'] = $Row['price_offer'];
                    $Row['standard_price'] = $Row['RecStandardPrice'];
                    $Row['standard_purchase_cost'] = $Row['RecStandardPrice'];
                    $response['response'][$count] = $Row;

                    $prev_row_id = $Row['id'];
                }
                

                if($prev_row_id == $Row['id'])
                {
                    if($prev_wh_id != $Row['wh_warehouse_id'])
                    {
                        $temp['id']   = $Row['wh_warehouse_id'];
                        $temp['name'] = $Row['wh_wrh_code'] . '-' . $Row['wh_warehouse'];                        
                        $temp['total_quantity']         = ($Row['stock_check'] == 0) ? $Row['total_quantity'] : $Row['current_stock']; // if stock_check is true, then we wil get the warehouse stock, else we will get the stock from purchase orders
                        $temp['sold_quantity']          = $Row['sold_quantity'];
                        $temp['available_quantity']     = $Row['available_quantity'];
                        $temp['allocated_quantity']     = $Row['allocated_quantity'];
                        $temp['wh_status']              = $Row['wh_status'];

                        if ($Row['wh_default_warehouse'] > 0) {
                            $response['response'][$count]['arr_warehouse']['default_wh'] = $Row['wh_warehouse_id'];
                        }
                        $response['response'][$count]['arr_warehouse']['response'][]= $temp;
                    }
                } 

                $response['total'] = $Row['totalRecordCount'];
                
                // $response['response'][] = $Row;
                // $current_date_time = $Row['current_date_time'];
            }
            
            $response['ack'] = 1;
            $response['prodlastUpdateTime'] = $current_date_time;
            $response['error'] = null;
        } else {
            $response['ack'] = 1;
            $response['error'] = '';
            $response['response'][] = array();
        }
        $response = $this->objGeneral->postListing($attr, $response);
        
        /*  old code End */

       

        /* if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                $row = array();
                $row['id'] = $Row['id'];
                $row['product_code'] = $Row['product_code'];
                $row['description'] = $Row['description'];
                $row['category_name'] = $Row['category_name'];
                $row['brand_name'] = $Row['brand_name'];
                $row['unit_name'] = $Row['unit_name'];
                $row['calc_current_stock'] = $Row['current_stock'];
                $row['available_stock'] = $Row['available_stock'];
                $row['allocated_stock'] = $Row['allocated_stock'];
                $row['standard_price'] = $Row['standard_price'];
                $row['supplierPrice'] = '';

                $response['response'][] = $row;
            }
            $response['ack'] = 1;
            $response['error'] = null;
        }
        else {
            //change the ack to 1 beacause a bug was created to do so
            $response['ack'] = 1;
            $response['error'] = 'No Record found';
        } */

        
        // else
        //     $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData('itemModal');

        return $response;
    }

    function getCategories($attr) {
        $this->objGeneral->mysql_clean($attr);
        // echo "<pre>";print_r($attr);exit;
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $order_type = "";

        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.",$attr,$fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.",$attr,$fieldsMeta);
        if (empty($where_clause)){
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("category",$this->arrUser);
        }

        $response = array(); 
        $Sql = " SELECT * FROM  category AS tbl WHERE  tbl.status = 1 AND tbl.company_id=" . $this->arrUser['company_id'] . "
       " . $where_clause . "  "; 
         // echo $Sql;exit;
        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

            $column = "tbl.id";
        if ($order_clause == "")
        $order_type = " Order BY " . $column . " DESC";
        else $order_type = $order_clause;

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        // echo $response['q'];exit;
        // $RS = $this->objsetup->CSI($response['q']);
        $RS = $this->objsetup->CSI($response['q']);

        if ($RS->RecordCount() > 0) {
            
            while ($Row = $RS->FetchRow()) {
                
               foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);
                }          
                $row = array();
                $row['id'] = $Row['id'];
                $row['name'] = $Row['name'];

                $response['response'][] = $row;
            }
            
            $response['ack'] = 1;
            $response['error'] = null;
        } else {
            $response['ack'] = 1;
            $response['error'] = '';
            $response['response'][] = array();
        }
        
        require_once(SERVER_PATH . "/classes/Setup.php");
        $objsetup = new Setup($this->arrUser);
        $response['response']['tbl_meta_data'] = $objsetup->GetTableMetaData('CategoryDetailModal');
         $response['response']['tbl_meta_data']['defaultFilter'] = $defaultFilter;
        return $response;
    }

    function item_popup($attr)
    {
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $defaultFilter = false;

        $cond = $attr['cond'];
        $attr['itemCond'] = 'item'; 
        
        if (!empty($attr['searchKeyword'])) {
            $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.", $attr, $fieldsMeta);
            $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.", $attr, $fieldsMeta);
        } 
        
        if (empty($where_clause)) {
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("itemPopup", $this->arrUser);
        } 
        
        $price_dates_check = "";
        if(isset($attr['order_date']) && $attr['order_date'] != '')
        {
            $price_dates_check = $this->objGeneral->convert_date($attr['order_date']). " BETWEEN (FLOOR(prdPrice.start_date/86400)*86400) AND (FLOOR(prdPrice.end_date/86400)*86400) AND ";  

            $order_date = $this->objGeneral->convert_date($attr['order_date']);
        }
        else if(isset($attr['start_date']) && $attr['start_date'] != '' && isset($attr['end_date']) && $attr['end_date'] != '')
        {
            $price_dates_check = $this->objGeneral->convert_date($attr['start_date']). " >= (FLOOR(prdPrice.start_date/86400)*86400) AND ".$this->objGeneral->convert_date($attr['end_date']). " <= (FLOOR(prdPrice.end_date/86400)*86400) AND ";
        }
        else 
        {
            $price_dates_check = " UNIX_TIMESTAMP (NOW()) BETWEEN (FLOOR(prdPrice.start_date/86400)*86400) AND (FLOOR(prdPrice.end_date/86400)*86400) AND ";
            $order_date = " UNIX_TIMESTAMP (NOW()) ";
        }   

        $price_type = 1;
        if(isset($attr['price_type']) && $attr['price_type'] != '')
        {
            $price_type = $attr['price_type'];
        }


        $response = array();

        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData('itemPopup');
        
        $temp_where = "";

        if(isset($attr['sale_order_id']))
        {
            $temp_where .= " AND tbl.id IN (SELECT item_id 
                                        FROM order_details AS od 
                                        WHERE od.order_id = '".$attr['sale_order_id']."' AND 
                                            od.type=0 AND od.company_id=" . $this->arrUser['company_id'].") ";


        }
        if(isset($attr['credit_note_id']))
        {
            $temp_where .= " AND tbl.id IN (SELECT item_id 
                                        FROM return_order_details AS od 
                                        WHERE od.order_id = '".$attr['credit_note_id']."' AND 
                                            od.type=0 AND od.company_id=" . $this->arrUser['company_id'].") ";


        }
        if(isset($attr['item_journal_id']))
        {
            $temp_where .= " AND tbl.id IN (SELECT item_id 
                                        FROM item_journal_details AS od 
                                        WHERE od.parent_id = '".$attr['item_journal_id']."' AND 
                                            od.company_id=" . $this->arrUser['company_id'].") ";
        }
        
        if(isset($attr['price_id']))
        {
            $temp_where .= " AND tbl.id IN (SELECT itemID 
                                        FROM priceofferitem AS od 
                                        WHERE od.priceID = ".$attr['price_id']." AND 
                                            od.company_id=" . $this->arrUser['company_id'].") ";
        }
        
        if(isset($attr['subsituteItemID']))
        {
            $temp_where .= " AND tbl.id NOT IN (".$attr['subsituteItemID'].") ";
        }

        $price_offer = "";
        if(isset($attr['customer_id']))
        {
            $price_offer = " ,getCustomerPriceOffer(".$attr['customer_id'].",".$order_date.", tbl.id," . $this->arrUser['company_id'] . ") AS price_offer";
        }
        else
        {
            $price_offer = " , 0 AS price_offer ";
            foreach($response['response']['tbl_meta_data']['response']['colMeta'] as $index=>$obj)
            {
                if($obj['field_name'] == 'price_offer')
                {
                    array_splice($response['response']['tbl_meta_data']['response']['colMeta'], $index, 1);
                }
            }
            foreach($response['response']['tbl_meta_data']['response']['originalColMeta'] as $index=>$obj)
            {
                if($temp['field_name'] == 'price_offer')
                {                    
                    array_splice($response['response']['tbl_meta_data']['response']['originalColMeta'], $index, 1);
                }
            }
        }
        $where_clause .= $temp_where;

        $attr['itemWhereClause'] = $where_clause;
        
        $Sql = " SELECT tbl.*,
                        prdPrice.standard_price AS standard_price1,
                        prdPrice.min_max_sale_price AS min_max_sale_price,
                        prdPrice.min_qty AS min_sale_qty,
                        prdPrice.max_qty AS max_sale_qty,
                        prdPrice.start_date
                        ".$price_offer."
                FROM sr_product_purchaselist AS tbl 
                LEFT JOIN product_price AS prdPrice ON tbl.id = prdPrice.product_id AND 
                                                        prdPrice.type = ".$price_type." AND
                                                        ".$price_dates_check."
                                                        prdPrice.company_id=" . $this->arrUser['company_id'] . "
                WHERE tbl.company_id=" . $this->arrUser['company_id'] . "  ". $where_clause ; 
        // echo $Sql;exit;
        /* $Sql = "SELECT tbl.*
                    FROM sr_product_purchaselist AS tbl 
                    WHERE company_id=" . $this->arrUser['company_id'] . "  " . $where_clause . " "; */
                    
        $subQueryForBuckets = "SELECT  prd.id
                               FROM productcache prd
                               WHERE prd.id IS NOT NULL  AND 
                                     prd.company_id=" . $this->arrUser['company_id'] . "";
        //$subQueryForBuckets = $this->objsetup->whereClauseAppender($subQueryForBuckets, 11);

        // echo $subQueryForBuckets;exit;

        $Sql .= " AND (tbl.id IN (".$subQueryForBuckets.")) "; //GROUP BY tbl.id,COALESCE(tbl.wh_warehouse_id,0)

        if(isset($attr['no_limits']) && isset($attr['searchKeyword']))
        {
            $attr['searchKeyword']->totalRecords = -1;
        }

        $column = 'tbl.id';

        if ($order_clause == "")
            $order_type = "Order BY " . $column . " DESC";
        else
            $order_type = $order_clause;

        $response = $this->objGeneral->preListing($attr, $Sql, $response, $total_limit, 'tbl', $order_type);

        // $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        // echo $response['q'];exit;

        $RS = $this->objsetup->CSI($response['q']);

        /* if(isset($attr['no_permission']))
        {
            $RS = $this->objsetup->CSI($response['q']);
        }
        else
            $RS = $this->objsetup->CSI($response['q'], "item", sr_ViewPermission); */

        // $response['q'] = '';

        // $RS = $this->objsetup->CSI($Sql);

        // echo '<pre>'; print_r($RS);

        $prev_row_id = 0;
        $prev_wh_id = 0;
        $count = -1;

        if ($RS->RecordCount() > 0) {
            
            while ($Row = $RS->FetchRow()) {
                
               foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);
                }            
                $Row['stock_check'] = intval($Row['stock_check']);

                if($prev_row_id != $Row['id'])
                {
                    $count++;
                    $attr['product_id'] = $Row['id'];
                    // $Row['arr_units'] = self::get_unit_setup_list_category_by_item($attr);

                    $uomArray['response'] = array();
                    $uomArray['response'][0] = (object) array();
                    $uomArray['response'][0]->id = $Row['uomSetupID'];
                    $uomArray['response'][0]->name = $Row['uom'];
                    $uomArray['response'][0]->quantity = $Row['uomSetupQty'];
                    $uomArray['response'][0]->unit_id = $Row['uomSetupCatID'];
                    $uomArray['response'][0]->ref_unit_id = $Row['uomSetupRefUnitID'];
                    $uomArray['response'][0]->ref_quantity = $Row['uomSetupRefQty'];

                    $Row['arr_units'] = $uomArray;
                    // $sales_prices = self::getSalesPriceOfferVolumebyItemID($Row['id']);
                    // $Row['sales_prices'] = $sales_prices['response'];
                    $Row['sales_prices'] = array();                    
                    // $Row['price_offer'] = '';
                    $Row['standard_price'] = $Row['standard_price1'];

                    $response['response'][$count] = $Row;
                    $prev_row_id = $Row['id'];
                }
                

                if($prev_row_id == $Row['id'])
                {
                    if($prev_wh_id != $Row['wh_warehouse_id'])
                    {
                        $temp['id']   = $Row['wh_warehouse_id'];
                        $temp['name'] = $Row['wh_wrh_code'] . '-' . $Row['wh_warehouse'];                        
                        $temp['total_quantity']         = ($Row['stock_check'] == 0) ? $Row['total_quantity'] : $Row['current_stock']; // if stock_check is true, then we wil get the warehouse stock, else we will get the stock from purchase orders
                        $temp['sold_quantity']          = $Row['sold_quantity'];
                        $temp['available_quantity']     = $Row['available_quantity'];
                        $temp['allocated_quantity']     = $Row['allocated_quantity'];
                        $temp['wh_status']              = $Row['wh_status'];

                        if ($Row['wh_default_warehouse'] > 0) {
                            $response['response'][$count]['arr_warehouse']['default_wh'] = $Row['wh_warehouse_id'];
                        }
                        $response['response'][$count]['arr_warehouse']['response'][]= $temp;
                    }
                } 

                $response['total'] = $Row['totalRecordCount'];
                
                // $response['response'][] = $Row;
                // $current_date_time = $Row['current_date_time'];
            }
            
            $response['ack'] = 1;
            $response['prodlastUpdateTime'] = $current_date_time;
            $response['error'] = null;
            $response = $this->objGeneral->postListing($attr, $response);
        } else {
            $response['ack'] = 1;
            $response['error'] = '';
            $response['response'][] = array();
        }
        return $response;
    }

    function itemListWithBucketPopup($attr)
    {
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $defaultFilter = false;

        $cond = $attr['cond'];
        $attr['itemCond'] = 'item'; 
        
        if (!empty($attr['searchKeyword'])) {
            $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.", $attr, $fieldsMeta);
            $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.", $attr, $fieldsMeta);
        } 
        
        if (empty($where_clause)) {
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("itemPopup", $this->arrUser);
        } 
        
        $price_dates_check = "";
        if(isset($attr['order_date']) && $attr['order_date'] != '')
        {
            $price_dates_check = $this->objGeneral->convert_date($attr['order_date']). " BETWEEN (FLOOR(prdPrice.start_date/86400)*86400) AND (FLOOR(prdPrice.end_date/86400)*86400) AND ";  

            $order_date = $this->objGeneral->convert_date($attr['order_date']);
        }
        else if(isset($attr['start_date']) && $attr['start_date'] != '' && isset($attr['end_date']) && $attr['end_date'] != '')
        {
            $price_dates_check = $this->objGeneral->convert_date($attr['start_date']). " >= (FLOOR(prdPrice.start_date/86400)*86400) AND ".$this->objGeneral->convert_date($attr['end_date']). " <= (FLOOR(prdPrice.end_date/86400)*86400) AND ";
        }
        else 
        {
            $price_dates_check = " UNIX_TIMESTAMP (NOW()) BETWEEN (FLOOR(prdPrice.start_date/86400)*86400) AND (FLOOR(prdPrice.end_date/86400)*86400) AND ";
            $order_date = " UNIX_TIMESTAMP (NOW()) ";
        }   

        $price_type = 1;
        if(isset($attr['price_type']) && $attr['price_type'] != '')
        {
            $price_type = $attr['price_type'];
        }


        $response = array();

        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData('itemPopup');
        
        $temp_where = "";

        if(isset($attr['sale_order_id']))
        {
            $temp_where .= " AND tbl.id IN (SELECT item_id 
                                        FROM order_details AS od 
                                        WHERE od.order_id = ".$attr['sale_order_id']." AND 
                                            od.type=0 AND od.company_id=" . $this->arrUser['company_id'].") ";
        }

        if($cond == 'rawMaterialItemsDetail')
        {
            $temp_where .= " AND tbl.rawMaterialProduct = 1 ";
        }

        if(isset($attr['credit_note_id']))
        {
            $temp_where .= " AND tbl.id IN (SELECT item_id 
                                        FROM return_order_details AS od 
                                        WHERE od.order_id = ".$attr['credit_note_id']." AND 
                                            od.type=0 AND od.company_id=" . $this->arrUser['company_id'].") ";
        }

        if(isset($attr['item_journal_id']))
        {
            $temp_where .= " AND tbl.id IN (SELECT item_id 
                                        FROM item_journal_details AS od 
                                        WHERE od.parent_id = ".$attr['item_journal_id']." AND 
                                            od.company_id=" . $this->arrUser['company_id'].") ";
        }
        
        if(isset($attr['price_id']))
        {
            $temp_where .= " AND tbl.id IN (SELECT itemID 
                                        FROM priceofferitem AS od 
                                        WHERE od.priceID = ".$attr['price_id']." AND 
                                            od.company_id=" . $this->arrUser['company_id'].") ";
        }
        
        if(isset($attr['subsituteItemID']))
        {
            $temp_where .= " AND tbl.id NOT IN (".$attr['subsituteItemID'].") ";
        }

        $price_offer = "";

        if(isset($attr['customer_id']))
        {
            $price_offer = " ,getCustomerPriceOffer(".$attr['customer_id'].",".$order_date.", tbl.id," . $this->arrUser['company_id'] . ") AS price_offer";
        }
        else
        {
            $price_offer = " , 0 AS price_offer ";
            foreach($response['response']['tbl_meta_data']['response']['colMeta'] as $index=>$obj)
            {
                if($obj['field_name'] == 'price_offer')
                {
                    array_splice($response['response']['tbl_meta_data']['response']['colMeta'], $index, 1);
                }
            }
            foreach($response['response']['tbl_meta_data']['response']['originalColMeta'] as $index=>$obj)
            {
                if($temp['field_name'] == 'price_offer')
                {                    
                    array_splice($response['response']['tbl_meta_data']['response']['originalColMeta'], $index, 1);
                }
            }
        }

        $where_clause .= $temp_where;
        $attr['itemWhereClause'] = $where_clause;
        
        $Sql = " SELECT tbl.*,
                        prdPrice.standard_price AS standard_price1,
                        prdPrice.min_max_sale_price AS min_max_sale_price,
                        prdPrice.min_qty AS min_sale_qty,
                        prdPrice.max_qty AS max_sale_qty,
                        prdPrice.start_date
                        ".$price_offer."
                FROM sr_product_purchaselist AS tbl 
                LEFT JOIN product_price AS prdPrice ON tbl.id = prdPrice.product_id AND 
                                                        prdPrice.type = ".$price_type." AND
                                                        ".$price_dates_check."
                                                        prdPrice.company_id=" . $this->arrUser['company_id'] . "
                WHERE tbl.company_id=" . $this->arrUser['company_id'] . "  ". $where_clause ; 
        // echo $Sql;exit;
        /* $Sql = "SELECT tbl.*
                    FROM sr_product_purchaselist AS tbl 
                    WHERE company_id=" . $this->arrUser['company_id'] . "  " . $where_clause . " "; */
                    
        $subQueryForBuckets = "SELECT  prd.id
                               FROM productcache prd
                               WHERE prd.id IS NOT NULL  AND 
                                     prd.company_id=" . $this->arrUser['company_id'] . "";

        //$subQueryForBuckets = $this->objsetup->whereClauseAppenderForItem($subQueryForBuckets, 11,1);

        // echo $subQueryForBuckets;exit;

        $Sql .= " AND (tbl.id IN (".$subQueryForBuckets.")) "; //GROUP BY tbl.id,COALESCE(tbl.wh_warehouse_id,0)

        if(isset($attr['no_limits']))
        {
            $attr['searchKeyword']->totalRecords = -1;
        }

        $column = 'tbl.product_code';

        if ($order_clause == "")
            $order_type = "Order BY " . $column . " ASC";
        else
            $order_type = $order_clause;

        $response = $this->objGeneral->preListing($attr, $Sql, $response, $total_limit, 'tbl', $order_type);

        // $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        // echo $response['q'];exit;

        if(isset($attr['no_permission']))
        {
            $RS = $this->objsetup->CSI($response['q']);
        }
        else
            $RS = $this->objsetup->CSI($response['q'], "item", sr_ViewPermission);

        // $response['q'] = '';

        // $RS = $this->objsetup->CSI($Sql);

        // echo '<pre>'; print_r($RS);

        $prev_row_id = 0;
        $prev_wh_id = 0;
        $count = -1;

        if ($RS->RecordCount() > 0) {
            
            while ($Row = $RS->FetchRow()) {
                
               foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);
                }            
                $Row['stock_check'] = intval($Row['stock_check']);

                if($prev_row_id != $Row['id'])
                {
                    $count++;
                    $attr['product_id'] = $Row['id'];
                    // $Row['arr_units'] = self::get_unit_setup_list_category_by_item($attr);

                    $uomArray['response'] = array();
                    $uomArray['response'][0] = (object) array();
                    $uomArray['response'][0]->id = $Row['uomSetupID'];
                    $uomArray['response'][0]->name = $Row['uom'];
                    $uomArray['response'][0]->quantity = $Row['uomSetupQty'];
                    $uomArray['response'][0]->unit_id = $Row['uomSetupCatID'];
                    $uomArray['response'][0]->ref_unit_id = $Row['uomSetupRefUnitID'];
                    $uomArray['response'][0]->ref_quantity = $Row['uomSetupRefQty'];

                    $Row['arr_units'] = $uomArray;
                    // $sales_prices = self::getSalesPriceOfferVolumebyItemID($Row['id']);
                    // $Row['sales_prices'] = $sales_prices['response'];
                    $Row['sales_prices'] = array();                    
                    // $Row['price_offer'] = '';
                    $Row['standard_price'] = $Row['standard_price1'];

                    $response['response'][$count] = $Row;
                    $prev_row_id = $Row['id'];
                }
                

                if($prev_row_id == $Row['id'])
                {
                    if($prev_wh_id != $Row['wh_warehouse_id'])
                    {
                        $temp['id']   = $Row['wh_warehouse_id'];
                        $temp['name'] = $Row['wh_wrh_code'] . '-' . $Row['wh_warehouse'];                        
                        $temp['total_quantity']         = ($Row['stock_check'] == 0) ? $Row['total_quantity'] : $Row['current_stock']; // if stock_check is true, then we wil get the warehouse stock, else we will get the stock from purchase orders
                        $temp['sold_quantity']          = $Row['sold_quantity'];
                        $temp['available_quantity']     = $Row['available_quantity'];
                        $temp['allocated_quantity']     = $Row['allocated_quantity'];
                        $temp['wh_status']              = $Row['wh_status'];

                        if ($Row['wh_default_warehouse'] > 0) {
                            $response['response'][$count]['arr_warehouse']['default_wh'] = $Row['wh_warehouse_id'];
                        }
                        $response['response'][$count]['arr_warehouse']['response'][]= $temp;
                    }
                } 

                $response['total'] = $Row['totalRecordCount'];
                
                // $response['response'][] = $Row;
                // $current_date_time = $Row['current_date_time'];
            }
            
            $response['ack'] = 1;
            $response['prodlastUpdateTime'] = $current_date_time;
            $response['error'] = null;
            $response = $this->objGeneral->postListing($attr, $response);
        } else {
            $response['ack'] = 1;
            $response['error'] = '';
            $response['response'][] = array();
        }
        return $response;
    }

    function get_all_product_warehouses($attr)
    {
        $response1 = array();

        //  $this->objGeneral->mysql_clean($attr);

        /* $Sql = "SELECT c.* From sr_product_warehouses_sel as c
                where  c.item_id=" . $attr['product_id'] . " and c.status ='1' and
                       c.company_id=" . $this->arrUser['company_id'] . " 
                 group by  c.`warehouse`  order by c.id ASC "; */
        $where = '';

        if(!isset($attr['is_credit_note']))
            $where = " and c.wh_status ='1' ";

        $Sql = "SELECT c.* From sr_product_warehouses_sel as c
                where  c.wh_item_id=" . $attr['product_id'] . " and
                       c.wh_company_id=" . $this->arrUser['company_id'] . " and 
                       c.wh_status=1  
                       ".$where."
                 group by  c.wh_warehouse_id  order by c.wh_warehouse_id ASC ";

                 //or  c.parent_id=" . $this->arrUser['company_id'] . ")
        // echo $Sql.';';exit;
        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row2 = $RS->FetchRow()) {
                $result['id'] = $Row2['wh_warehouse_id'];
                $result['name'] = $Row2['wh_wrh_code'] . '-' . $Row2['wh_warehouse'];
                /* 
                $result['purchase_orders']      = $Row2['purchase_orders'];
                $result['purchase_returns']     = $Row2['purchase_returns'];
                $result['sales_orders']         = $Row2['sales_orders'];
                $result['sales_returns']        = $Row2['sales_returns'];
                
                $result['total_quantity']       = $Row2['total_quantity'];
                $result['available_quantity']   = intval($result['purchase_orders']) - (intval($result['purchase_orders'])  + intval($result['sales_orders']))+ intval($result['sales_returns']); //$Row2['available_quantity'];
                $result['allocated_quantity']   = $Row2['allocated_quantity'];
                */
                $result['total_quantity']       = $Row2['total_quantity'];
                $result['sold_quantity']        = $Row2['sold_quantity'];
                
                $result['available_quantity']   = $Row2['available_quantity'];
                $result['allocated_quantity']   = $Row2['allocated_quantity'];

                /* if($attr['product_id']==331){
                    echo "<pre>";
                    print_r($response1);
                    exit;
                    } */

                if ($Row2['wh_default_warehouse'] > 0) {
                    $response1['default_wh'] = $Row2['wh_warehouse_id'];
                    // $response1['default_wh'] = $Row2['warehouse_id'];
                }

                $response1['response'][] = $result;
            }
          /*  $response['ack'] = 1;
            $response['error'] = NULL;*/
        } else {
           // $response['response'] = array();
        }
        
        return $response1;
    }

    function get_products_popup($attr,$arg)
    {
        //$this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";
        if (!empty($attr['searchKeyword'])) {
            $val = intval(preg_replace("/[^0-9]/", '', $attr['searchKeyword']));

            if ($val != 0) $where_clause .= " AND  prd.product_no LIKE '%".$val."%'  ";
            else $where_clause .= "   AND prd.description LIKE '%".$attr['searchKeyword']."%'";
        }


        if (!empty($attr['units'])) $where_clause .= " AND prd.unit_id = " . $attr['units'];
        if (!empty($attr['brands'])) $where_clause .= " AND prd.brand_id = " . $attr['brands'];
        if (!empty($attr['cat_types'])) $where_clause .= " AND prd.category_id = " . $attr['cat_types'];
       // if (!empty($attr['filter_status']) || $attr['filter_status'] == "0") $where_clause .= " AND prd.status = " . $attr['filter_status'];

        /*  if ($attr[status]->value == '50') $where_clause .= " AND prd.status IN(1,2,3,4,0) ";
          if ($attr[status]->value != 50) $where_clause .= " AND prd.status =" . $attr[status]->value . " ";
          else { if ($attr[status]->value == 0) $where_clause .= " AND prd.status =0 ";
          } SR_products_sel*/

        $res = array();


        $Sql = "SELECT * from sr_product_sel as prd where prd.product_code IS NOT NULL
		AND prd.company_id=" . $this->arrUser['company_id'] . "
		" . $where_clause . " "; //or  company.parent_id=" . $this->arrUser['company_id'] . ")

        if ($arg == 1) $direct_limit = cache_pagination_limit;
        else $direct_limit = pagination_limit;

        //Generic method
        //defualt Variable
        //$total_limit = $direct_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits']) $total_limit = $attr['pagination_limits'];
        $order_type="";
        if (!empty($attr['sort_column'])) {
            $column = 'prd.' . $attr[sort_column];

            if ($attr['sort_column'] == 'code') $column = 'prd.' . 'product_code';
            else if ($attr['sort_column'] == "brand") $column = 'br.' . 'brandname';
            else if ($attr['sort_column'] == 'category') $column = 'catr.' . 'name';
            else if ($attr['sort_column'] == 'base unit of measure') $column = 'unt.' . 'title';
            //calculated value can be order by id
            else if ($attr['sort_column'] == 'Sales_orders') $column = 'prd.id';
            else if ($attr['sort_column'] == 'Items Assigned to Sales Orders') $column = 'prd.id';
            else if ($attr['sort_column'] == 'Sales Orders with Unassigned Items / Stock') $column = 'prd.id';
            else if ($attr['sort_column'] == 'On Purchase Order') $column = 'prd.id';
            else if ($attr['sort_column'] == 'On Route/ In Transit') $column = 'prd.id';
            else if ($attr['sort_column'] == 'DS') $column = 'prd.id';
            else if ($attr['sort_column'] == 'status') $column = 'prd.id';
            else if ($attr['sort_column'] == 'current_stock') $column = 'prd.id';


            $order_type = "Order BY " . $column . " $attr[sortform]";
        }
       // $res = $this->objGeneral->pagination_genral($attr, $Sql, $res, $direct_limit, 'prd',$order_type);
        // echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($Sql);
        $res['q'] = '';
        if (!$RS) {
            print $this->Conn->ErrorMsg();
        }

        if ($RS->RecordCount() > 0) {

            $Row1 = $RS->GetRows();

            foreach($Row1 as $Rows) {
                $attr['product_id'] = $Rows['id'];
                $res['response'][] = $Rows;
            }

           // print_r($Row1); exit;

            $res['ack'] = 1;
            $res['error'] = NULL;
        } else {
            $res['response'] = array();
            $res['ack'] = 0;
            $res['error'] = NULL;
        }
        //print_r($response);exit;
        return $res;
    }

    function getItemUnitOfMeasure($attr)
    {
        $response = array();
        $attr2 = array();
        $this->objGeneral->mysql_clean($attr);
        $items = $attr['items'];

        // echo '<pre>';print_r($items); exit;

        foreach($items as $snglItem){
            $attr2['product_id'] = $snglItem->product_id;
            $attr2['arr_units'] = self::get_unit_setup_list_category_by_item($attr2);
 
            $response['response'][$attr2['product_id']] = $attr2;
        }

        // echo '<pre>';print_r($response);exit;

        if (sizeof($items) > 0) {           
            
            $response['ack'] = 1;
            $response['error'] = null;
        } else {
            $response['ack'] = 1;
            $response['error'] = '';
            $response['response'][] = array();
        } 
        return $response;
    }

    
    function getSalesPriceOfferVolumebyItemID($itemID)
    {
        $Sql = "SELECT 	
                        pp.`product_id`,
                        pp.discount_type AS discountType,
                        pp.min_qty AS min_sale_qty,
                        pp.`max_qty`  AS max_sale_qty,
                        pp.standard_price,
                        pp.`min_max_sale_price`,
                        ppv.id,
                        pp.discount_type AS discountType,
                        ppv.discount,
                        ppv.min_qty as min
                        FROM product_price AS pp
                        JOIN product AS prd ON pp.product_id = prd.id
                        LEFT JOIN product_price_volume AS ppv ON ppv.price_id = pp.id
                            
                        WHERE
                            prd.id = ".$itemID." AND 
                            pp.type=1 AND
                            UNIX_TIMESTAMP(NOW()) BETWEEN pp.start_date AND pp.end_date";    
        // echo $Sql;exit;
        
        $RS = $this->objsetup->CSI($Sql);
        $prev_row_id = 0;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                
                
                if($prev_row_id != $Row['product_id'])
                {
                    $response['response']['standard_price'] = $Row['standard_price'];
                    $response['response']['min_sale_price'] = $Row['min_max_sale_price'];
                    $response['response']['min_sale_qty']   = $Row['min_sale_qty'];
                    $response['response']['max_sale_qty']   = $Row['max_sale_qty'];
                    $response['response']['discountType']   = $Row['discountType'];

                    $prev_row_id = $Row['product_id'];
                }

                if($prev_row_id == $Row['product_id'])
                {
                    if($Row['min'] != null && $Row['discount'] != null)
                    {
                        $temp_arr = array();
                        $temp_arr['min']            = $Row['min'];
                        $temp_arr['discount']       = $Row['discount'];
                        $response['response']['arr_sales_price'][] = $temp_arr; 
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


    function get_unit_setup_list_category_by_item($attr)
    {
        $response2 = array();
        $where = "";

        if (isset($attr['product_code'])) 
            $where .= "c.product_code= '" . $attr['product_code'] . "'  AND ";
        if (isset($attr['product_id'])) 
            $where .= "c.product_id= '" . $attr['product_id'] . "'  AND ";

         $Sql = "SELECT  c.id,
                        c.quantity,
                        us.title as name,
                        c.cat_id,
                        c.ref_unit_id,
                        c.ref_quantity
                FROM  units_of_measure_setup  c
                RIGHT JOIN units_of_measure us on us.id=c.cat_id
                where   ".$where."
                        c.status=1  AND 
                        us.status=1 AND
                        c.company_id=" . $this->arrUser['company_id'] . "
                GROUP BY us.title
                ORDER BY c.id  ASC"; 

        // $Sql = "CALL sr_unit_of_measure_list(" . $this->arrUser['company_id'] . "," . $attr['product_id'] . ")";
        // echo  $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row3 = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row3['id'];
                $result['name'] = $Row3['name'];

                if ($attr['product_id'] != 0) {
                    $result['quantity'] = $Row3['quantity'];
                    $result['unit_id'] = $Row3['cat_id'];
                    $result['ref_unit_id'] = $Row3['ref_unit_id'];
                    $result['ref_quantity'] = $Row3['ref_quantity'];
                }
                $response2['response'][] = $result;
            }
            /*$response['ack'] = 1;
            $response['error'] = NULL;
            $response['total'] = $total;*/
        } else {
          /*  $response['ack'] = 0;
            $response['error'] = NULL;
            $response['response'][] = array();*/
        }
        return $response2;
    }

    function get_products_setup_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";

        if (!empty($attr['searchKeyword'])) {
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

        if (!empty($attr['category_id'])) 
            $where_clause .= " AND prd.category_id = " . $attr['category_id'];

        $response = array();

        $Sql = "SELECT * 
                FROM sr_product_sel as prd 
                where prd.product_code IS NOT NULL AND 
                     (prd.company_id=" . $this->arrUser['company_id'] . ")" . $where_clause . " ";
        //	echo $Sql;exit;

        //defualt Variable
        $total_limit = pagination_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits']) 
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'prd');
        //echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);
                }
                $attr['product_id'] = $Row['id'];
                $Row['arr_warehouse'] = self::get_all_product_warehouses($attr);
                $Row['arr_units'] = self::get_unit_setup_list_category_by_item($attr);
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

    function getAllProductsList($attr)
    {
        $prodlastUpdateTime = $attr['prodLastUpdateTime'];
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $current_date_time = 0;

        if($prodlastUpdateTime > 0){  

            /* $Sqla = "SELECT UNIX_TIMESTAMP(changedOn) as updatedTime 
                        FROM sr_checksum 
                        WHERE tablename = 'product' AND company_id='" .  $this->arrUser['company_id']. "'
                        LIMIT 1"; */

            $Sqla = "SELECT MAX(UNIX_TIMESTAMP(changedOn)) as modifiedTime 
                        FROM sr_checksum 
                        WHERE tablename IN ('product','units_of_measure_setup','units_of_measure','product_warehouse_location','warehouse') AND 
                              company_id='" .  $this->arrUser['company_id']. "'
                        LIMIT 1"; // 'product_price_volume','product_price'

            // echo $Sqla;exit;
            $RSa = $this->objsetup->CSI($Sqla);
            
            if ($RSa->RecordCount() == 1) {

                if($prodlastUpdateTime > $RSa->fields['modifiedTime'])
                {
                    $response['ack'] = 1;
                    $response['error'] = 3;
                    $response['prodlastUpdateTime'] = $prodlastUpdateTime;
                    return $response;
                }
            }
        }

        /* New Code start */

        $prdFilter = '0';

        if ($this->arrUser['user_type'] != 1 && $this->arrUser['user_type'] != 2){
            $SqlBucketQry = "SELECT SR_get_bucket_where_clause(11," . $this->arrUser['company_id'] ."," . $this->arrUser['id']. ") as prdFilter";
            // echo $SqlBucketQry;exit;

            $RSBucketQry = $this->objsetup->CSI($SqlBucketQry);
            $prdFilter = $RSBucketQry->fields['prdFilter'];
            $this->objGeneral->mysql_clean($prdFilter);
        }        

        // $Sql = 'CALL sr_product_list(' . $this->arrUser['company_id'] .',' . $this->arrUser['id']. ','.$this->arrUser['user_type'].',"'.$prdFilter.'")';
        $Sql = "CALL sr_product_list(" . $this->arrUser['company_id'] ."," . $this->arrUser['id']. ",".$this->arrUser['user_type'].",'".$prdFilter."')";

        /* New Code End  */
        /* $subQuery = "SELECT prd.id 
                FROM  productcache as prd 
                WHERE prd.product_code IS NOT NULL AND 
                     (prd.company_id=" . $this->arrUser['company_id'] . " )
                      ";
            
        $subQuery = $this->objsetup->whereClauseAppender($subQuery,11); */

        /* $Sql = "SELECT *,UNIX_TIMESTAMP(NOW()) as current_date_time
                FROM sr_product_warehouse_improved AS prd 
                WHERE prd.company_id=" . $this->arrUser['company_id']." AND prd.id IN ($subQuery) ORDER BY prd.id"; */
        
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        // echo '<pre>'; print_r($RS);

        $prev_row_id = 0;
        $prev_wh_id = 0;
        $count = -1;
        if ($RS->RecordCount() > 0) {

            
            while ($Row = $RS->FetchRow()) {

                
               foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);
                }            

                if($prev_row_id != $Row['id'])
                {
                    $count++;
                    $attr['product_id'] = $Row['id'];
                    // $Row['arr_units'] = self::get_unit_setup_list_category_by_item($attr);

                    $uomArray['response'] = array();
                    $uomArray['response'][0] = (object) array();
                    $uomArray['response'][0]->id = $Row['uomSetupID'];
                    $uomArray['response'][0]->name = $Row['uom'];
                    $uomArray['response'][0]->quantity = $Row['uomSetupQty'];
                    $uomArray['response'][0]->unit_id = $Row['uomSetupCatID'];
                    $uomArray['response'][0]->ref_unit_id = $Row['uomSetupRefUnitID'];
                    $uomArray['response'][0]->ref_quantity = $Row['uomSetupRefQty'];

                    $Row['arr_units'] = $uomArray;
                    // $sales_prices = self::getSalesPriceOfferVolumebyItemID($Row['id']);
                    // $Row['sales_prices'] = $sales_prices['response'];
                    $Row['sales_prices'] = array();

                    $response['response'][$count] = $Row;
                    $prev_row_id = $Row['id'];
                }

                if($prev_row_id == $Row['id'])
                {
                    if($prev_wh_id != $Row['wh_warehouse_id'])
                    {
                        $temp['id']   = $Row['wh_warehouse_id'];
                        $temp['name'] = $Row['wh_wrh_code'] . '-' . $Row['wh_warehouse'];                        
                        $temp['total_quantity']         = ($Row['stock_check'] == 0) ? $Row['total_quantity'] : $Row['current_stock']; // if stock_check is true, then we wil get the warehouse stock, else we will get the stock from purchase orders
                        $temp['sold_quantity']          = $Row['sold_quantity'];
                        $temp['available_quantity']     = $Row['available_quantity'];
                        $temp['allocated_quantity']     = $Row['allocated_quantity'];
                        $temp['wh_status']              = $Row['wh_status'];

                        if ($Row['wh_default_warehouse'] > 0) {
                            $response['response'][$count]['arr_warehouse']['default_wh'] = $Row['wh_warehouse_id'];
                        }
                        $response['response'][$count]['arr_warehouse']['response'][]= $temp;
                    }
                }
                $current_date_time = $Row['current_date_time'];
            }
            
            $response['ack'] = 1;
            $response['prodlastUpdateTime'] = $current_date_time;
            $response['error'] = null;
        } else 
            $response['response'] = array();
        return $response;
    }

    function getAllProductsListforSel($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $cond = $attr['cond'];

        /* $subQuery = "SELECT prd.id 
                FROM  productcache as prd 
                WHERE prd.product_code IS NOT NULL AND 
                     (prd.company_id=" . $this->arrUser['company_id'] . " )
                      ";
            
          $subQuery = $this->objsetup->whereClauseAppender($subQuery,11);

        $Sql = "SELECT *,UNIX_TIMESTAMP(NOW()) as current_date_time
                FROM sr_product_warehouse_improved AS prd 
                WHERE prd.company_id=" . $this->arrUser['company_id']." AND prd.id IN ($subQuery) ORDER BY prd.id";
        
        //echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        $prev_row_id = 0;
        $prev_wh_id = 0;
        $count = -1;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);
                } 

                $Row['name'] = $Row['description'];           

                $Row['category'] = $Row['category_name'];           
                $Row['brand'] = $Row['brand_name'];           
                $Row['unit'] = $Row['unit_name'];           

                if($prev_row_id != $Row['id'])
                {
                    $count++;
                    $attr['product_id'] = $Row['id'];
                    $Row['arr_units'] = self::get_unit_setup_list_category_by_item($attr);
                    $sales_prices = self::getSalesPriceOfferVolumebyItemID($Row['id']);
                    $Row['sales_prices'] = $sales_prices['response'];

                    $response['response'][$count] = $Row;
                    $prev_row_id = $Row['id'];
                }

                if($prev_row_id == $Row['id'])
                {
                    if($prev_wh_id != $Row['wh_warehouse_id'])
                    {
                        $temp['id']   = $Row['wh_warehouse_id'];
                        $temp['name'] = $Row['wh_wrh_code'] . '-' . $Row['wh_warehouse'];                        
                        $temp['total_quantity']         = ($Row['stock_check'] == 0) ? $Row['total_quantity'] : $Row['current_stock']; // if stock_check is true, then we wil get the warehouse stock, else we will get the stock from purchase orders
                        $temp['sold_quantity']          = $Row['sold_quantity'];
                        $temp['available_quantity']     = $Row['available_quantity'];
                        $temp['allocated_quantity']     = $Row['allocated_quantity'];
                        $temp['wh_status']              = $Row['wh_status'];

                        if ($Row['wh_default_warehouse'] > 0) {
                            $response['response'][$count]['arr_warehouse']['default_wh'] = $Row['wh_warehouse_id'];
                        }
                        $response['response'][$count]['arr_warehouse']['response'][]= $temp;
                    }
                }
                $current_date_time = $Row['current_date_time'];
            }
                       

        } else 
            $response['response'] = array();   */

        require_once(SERVER_PATH . "/classes/Setup.php");
        $objsetup = new Setup($this->arrUser);

        $response['ack'] = 1;
        $response['error'] = null;
            
        if ($cond == 'Detail')
            $response['response']['tbl_meta_data'] = $objsetup->GetTableMetaData('itemDetailModal', 1);
        else
            $response['response']['tbl_meta_data'] = $objsetup->GetTableMetaData('itemModal', 1);     

        return $response;
    }

    function getStockSheetList($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        // $response = array();

        $searchKeyword = '';
        $searchKeyword = $attr['searchKeyword'];

        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";

        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.",$attr,$fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.",$attr,$fieldsMeta);

        if (empty($where_clause)){
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("StockSheet",$this->arrUser);
        } 

        $attr['itemCond'] = 'StockSheet';
        $attr['itemWhereClause'] = $where_clause;

        $where = " tbl.company_id = " . $this->arrUser['company_id'];    
        $response = array();


        $subQuery = "SELECT prd.id
                FROM  productcache as prd 
                WHERE prd.product_code IS NOT NULL AND 
                     (prd.company_id=" . $this->arrUser['company_id'] . " ) " ;
       // $subQuery = $this->objsetup->whereClauseAppender($subQuery,11);


        /* if ($attr['searchKeyword']->exportAsCSV){
                        
            $Sql = "SELECT DISTINCT id,product_code,
                                    description,
                                    category_name,
                                    brand_name,
                                    unit_name,
                                    available_stock,
                                    allocated_stock,
                                    current_stock 
                    FROM (SELECT  * 
                          FROM sr_product_sel AS prd 
                          WHERE prd.id IN ($subQuery) AND 
                                prd.company_id=" . $this->arrUser['company_id'].") as tbl
                    WHERE 1 and $where AND (tbl.available_stock>0 OR  tbl.allocated_stock>0 )  $where_clause "; //ORDER BY prd.id

        }else{

            $Sql = "SELECT DISTINCT id,product_code,
                                    description,
                                    category_name,
                                    brand_name,
                                    unit_name,
                                    available_stock,
                                    allocated_stock,
                                    current_stock 
                    FROM (SELECT  * 
                          FROM sr_product_sel AS prd 
                          WHERE prd.id IN ($subQuery) AND 
                                prd.company_id=" . $this->arrUser['company_id'].") as tbl
                    WHERE 1 and $where AND (tbl.available_stock>0 OR  tbl.allocated_stock>0 )  $where_clause ";
        } */

        /* $Sql = "SELECT  DISTINCT id,product_code,
                                description,
                                category_name,
                                brand_name,
                                unit_name,
                                available_stock,
                                allocated_stock,
                                current_stock  
                FROM sr_product_sel AS tbl 
                WHERE tbl.id IN ($subQuery) AND 
                        tbl.company_id = " . $this->arrUser['company_id']." AND 
                        (tbl.available_stock>0 OR  tbl.allocated_stock>0 )  
                        $where_clause"; */
        
        $Sql = "SELECT *
                FROM `sr_stock_sheet_sel` `tbl` 
                WHERE tbl.id IN (".$subQuery.") AND 
                        tbl.company_id = " . $this->arrUser['company_id']."  AND 
                        (tbl.available_stock>0 OR  tbl.allocated_stock>0 )  
                        ".$where_clause." ";
        
        // echo $Sql;exit;

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        
        if ($order_clause == "")
            $order_type = " Order BY tbl.id DESC ";
        else
            $order_type = $order_clause;

        $response = $this->objGeneral->preListing($attr, $Sql, $response, $total_limit, 'tbl', $order_type);

        // echo $response['q'];exit;
        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData("StockSheet");
        $RS = $this->objsetup->CSI($response['q'], "stock_sheet", sr_ViewPermission);
        // $RS = $this->objsetup->CSI($Sql);
        // $response['q'] = '';
        $prev_row_id = 0;
        $prev_wh_id = 0;
        $count = -1;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key)) 
                        unset($Row[$key]);
                } 
                $response['total'] = $Row['totalRecordCount'];
                $response['response'][]= $Row;   
            }
        }
        $response['ack'] = 1;
        $response['error'] = null;
        $response = $this->objGeneral->postListing($attr, $response);


        return $response;
    }

    
    function get_item_warehouse_uom_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();
        $Sql = "SELECT * 
                FROM sr_product_warehouse_improved AS prd 
                WHERE prd.company_id=" . $this->arrUser['company_id']." AND prd.id= ".$attr['item_id']." ";
        
        $RS = $this->objsetup->CSI($Sql);
        $prev_row_id = 0;
        $prev_wh_id = 0;
        $count = -1;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                 foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);

                }
                if($prev_row_id != $Row['id'])
                {
                    $count++;
                    $attr['product_id'] = $Row['id'];
                    $Row['arr_units'] = self::get_unit_setup_list_category_by_item($attr);
                    $response['response'][$count] = $Row;
                    $prev_row_id = $Row['id'];
                }

                if($prev_row_id == $Row['id'])
                {
                    if($prev_wh_id != $Row['wh_warehouse_id'])
                    {
                        $temp['id'] = $Row['wh_warehouse_id'];
                        $temp['name'] = $Row['wh_wrh_code'] . '-' . $Row['wh_warehouse'];
                        
                        $temp['total_quantity']       = $Row['total_quantity'];
                        $temp['sold_quantity']        = $Row['sold_quantity'];
                        $temp['available_quantity']   = $Row['available_quantity'];
                        $temp['allocated_quantity']   = $Row['allocated_quantity'];

                        if ($Row['wh_default_warehouse'] > 0) {
                            $response['response'][$count]['arr_warehouse']['default_wh'] = $Row['wh_warehouse_id'];
                        }
                        $response['response'][$count]['arr_warehouse']['response'][]= $temp;
                    }
                }
            }
            $response['ack'] = 1;
        } else 
            $response['response'] = array();
        return $response;
    }
    
    function get_sales_products_popup($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";

        if (!empty($attr['searchKeyword'])) {
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

        if (!empty($attr['category_id'])) 
            $where_clause .= " AND prd.category_id = " . $attr['category_id'];

        $order_date = $this->objGeneral->convert_date($attr['or_date']);

        $response = array();
        $Sql = "SELECT prd.*, o.sell_to_cust_id ,prd.description as product_description
			, " . $this->objGeneral->get_nested_query_list('cat', $this->arrUser['company_id']) . "
			, " . $this->objGeneral->get_nested_query_list('brand', $this->arrUser['company_id']) . "
			, " . $this->objGeneral->get_nested_query_list('unit', $this->arrUser['company_id']) . "
			, " . $this->objGeneral->current_stock_counter($this->arrUser['company_id']) . "
			,(SELECT cii.converted_price FROM customer_item_info as cii  where cii.product_id=prd.id  AND cii.crm_id = '".$attr['cust_id']."' AND (".$order_date." BETWEEN cii.start_date and cii.end_date) Limit 1) as unit_price
			,(SELECT sp.unit_price FROM product_supplier as sp  where sp.product_id=prd.id  Limit 1) as sup_unit_price
			,null as pmin_quantity,null as pmax_quantity From product  prd
			JOIN order_details od on od.item_id = prd.id 
			JOIN orders o on o.id = od.order_id
			JOIN company on company.id=prd.company_id WHERE o.sell_to_cust_id = '".$attr['cust_id']."' AND
			(prd.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
			and prd.status = 1  and prd.product_code IS NOT NULL
			" . $where_clause . " group by prd.id
			";
        //echo $Sql;exit;

        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits']) $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'prd');
        //echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);
                }

                if (empty($Row['unit_price'])) $Row['unit_price'] = $Row['standard_purchase_cost'];

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

    function check_purchase_uom_onchange($arr_attr)
    {
        $count_total = 0;
        $sql_total = "SELECT quantity as qty
                      FROM units_of_measure_setup 
                      WHERE product_id='" . $arr_attr['product_id'] . "' and  
                            id='" . $arr_attr['uom_id'] . "'";
        //echo	$sql_total;exit;
        $rs_count = $this->objsetup->CSI($sql_total);
        $total = ($rs_count->fields['qty'] * $arr_attr[qty]);

        if (($total >= $arr_attr[qty])) {
        } else {
            $count_total++;
            $msg = 'Maximum';
        }

        if (($total <= $arr_attr[qty])) {
        } else {
            $count_total++;
            $msg = 'Maximum';
        }	

        if ($count_total > 0) {
            $response['ack'] = 0;
            $response['error'] = " Quantity must be $msg order of item ";
            return $response;
        }
    }

    function getCode_General($attr)
    {
        $table = base64_decode($attr['tb']);
        $module_id = $attr['m_id'];
        $no = base64_decode($attr['no']);

        $where_clause = "";
        $response = array();

        $prefix = $range_from = $range_to = $type = $warning = $type = $number = 0;

        if (($no == 'supplier_no')) 
            $table = 'supplier';

        $Sql = "SELECT mv.*, mc.id AS mc_id, ct.name AS cat_name, bd.brandname AS bname 
                FROM ref_module_category_value mv
                LEFT JOIN ref_module_category mc ON mc.id = mv.module_category_id
                LEFT JOIN category ct ON ct.id = mv.category_id
                LEFT JOIN brand bd ON bd.id = mv.brand_id
                WHERE mv.module_code_id='" . $table . "'  and 
                      mv.status=1  and
                      mv.company_id=" . $this->arrUser['company_id'] . "
                ORDER BY mv.id DESC";    
        // and mv.user_id='" . $this->arrUser['id'] . "' 

        $RS = $this->objsetup->CSI($Sql);
        //echo $Sql;exit;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                if ($Row['module_category_id'] == 2) {
                    //generic
                    if ($Row['type'] == 0) {
                        $prefix = $Row['prefix'];
                        $range_from = $Row['range_from'];
                        $range_to = $Row['range_to'];
                        $type = $Row['type'];
                        break;
                    } else {
                        $type = $Row['type'];
                        break;
                    }
                } else if ($Row['module_category_id'] == 3) {
                    //category
                    if ($Row['type'] == 0) {
                        $prefix = $Row['prefix'];
                        $range_from = $Row['range_from'];
                        $range_to = $Row['range_to'];
                        $type = $Row['type'];
                        break;
                    } else {
                        $type = $Row['type'];
                        break;
                    }
                } else if ($Row['module_category_id'] == 1) {
                    //brand
                    if ($Row['type'] == 0) {
                        $prefix = $Row['prefix'];
                        $range_from = $Row['range_from'];
                        $range_to = $Row['range_to'];
                        $type = $Row['type'];
                        break;
                    } else {
                        $type = $Row['type'];
                        break;
                    }
                }
            }
        }

        $table = base64_decode($attr['tb']);

        if ($type != 1) {
            if (!empty($attr['type'])) 
                $where_clause .= " AND ef.type IN(".$attr['type'].") ";

            //number of record count
            $Sql = "SELECT max(ef.$no) as count
                    FROM $table ef
                    JOIN company ON company.id = ef.company_id
                    WHERE ef.status=1 and 
                         (ef.company_id=" . $this->arrUser['company_id'] . " or  
                          company.parent_id=" . $this->arrUser['company_id'] . ")" . $where_clause . " ";
            
            $srm = $this->objsetup->CSI($Sql)->FetchRow();
            //echo $Sql;exit;
            $nubmer = $range_from;
            
            if ($srm['count'] > $range_from && $srm['count'] < $range_to) 
                $nubmer = $srm['count'] + 1;

            if ($nubmer > $range_to) 
                $warning = 1;

            $code = $prefix . $nubmer;
            $code = $prefix . sprintf("%'.0" . strlen($range_from) . "d", $nubmer);
        }

        if ($warning == 0) {
            $response['code'] = $code;
            $response['nubmer'] = $nubmer;
            $response['type'] = $type;
            $response['ack'] = 1;
            $response['error'] = 'Code Generated Successfully';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Code Limit Exceed';
        }
        return $response;
    }

    function get_code_pre($attr)
    {
        $table = base64_decode($attr['tb']);
        $module_id = $attr['m_id'];
        $no = base64_decode($attr['no']);

        $where_clause = "";

        if (!empty($attr['type'])) 
            $where_clause .= " AND ef.type IN(".$attr['type'].") ";

        $mSql = "SELECT mf.prefix,mf.prefix_length
                 FROM ref_module_code md
                 JOIN ref_module_code_prefix mf ON mf.module_id = md.id
                 WHERE md.id = ".$module_id."  and  mf.status =1  ";

        $code = $this->objsetup->CSI($mSql)->FetchRow();
        $prefix = $code['prefix'];
        $prefix_length = $code['prefix_length'];

        if (empty($code['prefix'])) 
        {
            $mSql2 = "SELECT md.prefix
                      FROM ref_module_code md
                      WHERE md.id = ".$module_id."  ";

            $code2 = $this->objsetup->CSI($mSql2)->FetchRow();
            $prefix = $code2['prefix'];
            $prefix_length = 0;
        }

        //max(ef.id) 
        $Sql = "SELECT max(ef.$no) as count
		FROM $table ef
		JOIN company ON company.id = ef.company_id
		WHERE 
		ef.status=1 and (ef.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
		$where_clause";
        $srm = $this->objsetup->CSI($Sql)->FetchRow();
        //echo $Sql;exit;

        $nubmer = $srm['count'] + 1;

        //echo sprintf("%'.0".$code['prefix_length']."d\n", $nubmer); 
        return array('code' => $prefix . sprintf("%'.0" . $prefix_length . "d", $nubmer), 'number' => sprintf("%'.0" . $prefix_length . "d", $nubmer));
    }

    function getCode($attr)
    {
        $table = base64_decode($attr['tb']);

        // if ($table != 'product') {

            /*======= Query for MYSQL FUNCTION start */

            // if($attr['brand']=="")
            // $attr['brand']=0;
            $attr['brand'] = (isset($attr['brand']) && $attr['brand']!='')?$attr['brand']:0;
            $attr['category'] = (isset($attr['category']) && $attr['category']!='')?$attr['category']:0;


            // if($attr['category']=="")
            // $attr['category']=0;


            $MYSQL_FUNCTION_Sql = "SELECT  SR_GetNextSeq('" . $table . "','" . $this->arrUser['company_id'] . "','" . $attr['brand'] . "' ,'" . $attr['category'] . "') ";
           // echo $MYSQL_FUNCTION_Sql;exit;

            $code = $this->objsetup->CSI($MYSQL_FUNCTION_Sql);
            $code->close();

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
                $response['error'] = 'Code not Generated';
            }
            return $response;
            exit;

            /*=================  end =================*/
        // }


        $record_found = 0;
        $where = "";
        $where3 = "";
        //$table = base64_decode($attr['tb']);
        $module_id = $attr['m_id'];
        $no = base64_decode($attr['no']);

        $prefix = $range_from = $range_to = $warning = $number = $record_not_found = $record_genric = 0;


        if (!empty($attr['module_category_id'])) $where .= " AND mv.module_category_id = $attr[module_category_id] ";

        if (!empty($attr['brand'])) $where .= " AND mv.brand_id= $attr[brand] ";

        if (empty($attr['brand'])) {
            if (!empty($attr['category'])) {
                $where .= " AND mv.category_id= $attr[category] ";
            }
        }

        if (($no == 'supplier_no')) $table = 'supplier';
        if (($no == 'order_no')) $table = 'srm_order';
        if (($no == 'invoice_no')) $table = 'srm_invoice';
        if (($no == 'customer_no')) $table = 'customer';
        if (($no == 'sale_invioce_no')) $table = 'invoices';

        $Sql1 = "SELECT mv.id,mv.prefix,mv.range_from,mv.range_to,mv.type
		FROM ref_module_category_value mv
		JOIN ref_module_table rmt on rmt.id=mv.module_code_id 
		WHERE rmt.name='" . $table . "'  and mv.status=1 
		and  mv.company_id=" . $this->arrUser['company_id'] . "
		" . $where . "
		ORDER BY mv.id DESC Limit 1";
        //mv.module_code_id='" . $table . "'  // Now table name from ref_module_table#

        // echo $Sql1; exit;

        $RS = $this->objsetup->CSI($Sql1);
        $record_brand = $RS->fields['id'];

        if (empty($record_brand) && empty($attr['category']) && empty($attr['brand']) && ($table == 'product')) {
            $response['ack'] = 0;
            $response['error'] = "Please define $table code in setup";
            return $response;
        }

        if (!empty($attr['brand'])) {
            $record_brand_count = 0;
            $record_cat_count = 0;
            $record_genric_count = 0;

            if (!empty($record_brand)) $record_brand_count++;

        } else $record_genric++;

        if (empty($attr['brand'])) {
            if (($attr['category'] > 0)) {
                $record_brand_count = $record_cat_count = $record_genric = 0;
                if (!empty($record_brand)) $record_cat_count++;

            } else $record_genric++;
        }

        $where_code_number = $attr['module_category_id'];

        if (empty($record_brand) && $table != 'product') {
            $response['ack'] = 0;
            $response['error'] = "Please define $table code in setup";
            return $response;
        }

        // echo $table;

        if (empty($record_brand) && $table == 'product') {
            //brand 
            if (!empty($attr['category'])) {

                $Sql2 = "SELECT mv.id,mv.prefix,mv.range_from,mv.range_to,mv.type
				FROM ref_module_category_value mv
				JOIN ref_module_table rmt on rmt.id=mv.module_code_id 
				WHERE rmt.name='" . $table . "'  and mv.status=1 
				and  mv.company_id=" . $this->arrUser['company_id'] . "
				AND mv.module_category_id = 3 AND mv.category_id= $attr[category] 
				ORDER BY mv.id DESC";

                $RS = $this->objsetup->CSI($Sql2);
                $record_cat = $RS->fields['id'];
                $where_clause = '';
                $where_code_number = 3;

                $record_brand_count = 0;
                $record_cat_count = 0;
                $record_genric_count = 0;


                if (!empty($record_cat)) $record_cat_count++;

                if (empty($record_cat)) {

                    $where_clause = '';
                    $where_code_number = 2;

                    $Sql3 = "SELECT mv.id,mv.prefix,mv.range_from,mv.range_to,mv.type
					FROM ref_module_category_value mv
					JOIN ref_module_table rmt on rmt.id=mv.module_code_id 
					WHERE rmt.name='" . $table . "'  and mv.status=1 
					and  mv.company_id=" . $this->arrUser['company_id'] . "
					AND mv.module_category_id = 2 
					" . $where3 . " 
					ORDER BY mv.id DESC";
                    //	echo $Sql3;exit;
                    $RS = $this->objsetup->CSI($Sql3);
                    $record_genric = $RS->fields['id'];

                    $record_brand_count = 0;
                    $record_cat_count = 0;
                    $record_genric_count = 0;
                    if (!empty($record_genric)) $record_genric_count++;


                    if ($table == 'product') {
                        $where_code_type = " AND ef.code_type =2 ";

                    }

                }

            } else {
                //category  
                $Sql3 = "SELECT mv.id,mv.prefix,mv.range_from,mv.range_to,mv.type
                        FROM ref_module_category_value mv
                        WHERE mv.module_code_id='" . $table . "'  and mv.status=1 
                        and  mv.company_id=" . $this->arrUser['company_id'] . "
                        AND mv.module_category_id = 2  
                        ORDER BY mv.id DESC";
                	// echo $Sql3;exit;
                $RS = $this->objsetup->CSI($Sql3);
                $record_genric = $RS->fields['id'];
                $where_clause = '';
                $where_code_number = 2;

                $record_brand_count = 0;
                $record_cat_count = 0;
                $record_genric_count = 0;
                if (!empty($record_genric)) $record_genric_count++;
            }
        }

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                if ($Row['type'] == 0) {
                    $prefix = $Row['prefix'];
                    $range_from = $Row['range_from'];
                    $range_to = $Row['range_to'];
                    $type = $Row['type'];
                    $record_found++;
                } else if ($Row['type'] == 1) {
                    $type = $Row['type'];
                }
            }
        }

        $table = base64_decode($attr['tb']);

        if ($type == 0) {

            if ($table == 'product') {

                if (($record_brand_count > 0)) {
                    $where_clause .= " AND ef.brand_id= $attr[brand] ";
                    $where_clause .= " AND ef.code_type =1 ";
                } else if ($record_cat_count > 0) {
                    $where_clause .= " AND ef.category_id =$attr[category] ";
                    $where_clause .= " AND ef.code_type =3 ";
                } else
                    $where_clause .= " AND ef.code_type =2 ";
                //if ($record_genric_count > 0) 
            }

            if (!empty($attr['type'])) $where_clause .= " AND ef.type IN(".$attr['type'].") ";

            if ($table == 'product') $where_clause .= " AND ef.product_code IS NOT NULL ";
            //    if ($table == 'product') $where_clause .= " AND ef.code_internal_external =0 ";

            if (($no == 'customer_no')) $table = 'crm';


            if (($no == 'acc_no')) $where_clause2 = "AND module_type= $attr[module_type] ";
            if (($no == 'acc_no')) $table = 'gl_journal_receipt';

            //if(!empty($attr['status'])) $where_clause .= " AND ef.status !=18   ";
            //else  $where_clause .= " AND ef.status =1   ";


            $Sql = "SELECT max(ef.$no) as count 	FROM $table ef
                    JOIN company ON company.id = ef.company_id
                    WHERE 
                    (ef.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                    " . $where_clause . "  	" . $where_clause2 . "
                    ";
            //  echo $Sql;  
            // //  echo $Sql1 ;
            //  exit;

            $srm = $this->objsetup->CSI($Sql)->FetchRow();
            $nubmer = $range_from;

            if (($srm['count'] >= $range_from) && ($srm['count'] <= $range_to)) {
                $nubmer = $srm['count'] + 1;
            }

            if ($nubmer > $range_to) {
                $warning = 1;
                $msg_err = 'Code Limit Exceed';
            } else $warning = 0;

            $code = $prefix . sprintf("%'" . $range_from[0] . "" . strlen($range_from) . "d", $nubmer);
            $code_internal_external = 0;
        } else if ($type == 1) {
            $warning = 0;
            $where_code_types = 0;
            $code_internal_external = 1;
        } else {
            $msg_err = "Please define $table code in setup";
            $warning = 1;
        }

        //echo $type ;echo $code ;exit;

        if ($warning == 0) {
            $response['code'] = $code;
            $response['nubmer'] = $nubmer;
            $response['new_nubmer'] = $nubmer;
            $response['code_internal_external'] = $code_internal_external;
            $response['type'] = $type;
            $response['code_type'] = $where_code_number;
            $response['ack'] = 1;
            $response['error'] = 'Code Generated Successfully';
        } else {
            $response['ack'] = 0;
            $response['error'] = $msg_err;
        }
        return $response;

    }

    function get_unique_id($attr)
    {
        $unique_id = $this->objGeneral->get_unique_id_from_db($attr);

         $moduleCode = "SELECT mv.* 
                FROM ref_module_category_value mv
                WHERE  mv.module_code_id = 12 and mv.module_category_id = 2 AND                                              
                       mv.status=1 AND 
                       mv.company_id=" . $this->arrUser['company_id'] . "
                limit 1";
        $moduleCodeRS = $this->objsetup->CSI($moduleCode);
        if ($moduleCodeRS->RecordCount() > 0) {
            while ($Row = $moduleCodeRS->FetchRow()) {
                // type = 0 ? internal, type = 1 ? external
                $response['moduleCodeData'] = $Row['type'] == "0" ? "internal" : "external";
            }
        }


        $Sql = "INSERT INTO product 
                                SET 
                                    product_unique_id='" . $unique_id . "',
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    user_id='" . $this->arrUser['id'] . "',
                                    date_added=UNIX_TIMESTAMP (NOW()),
                                    AddedBy='" . $this->arrUser['id'] . "',
                                    AddedOn=UNIX_TIMESTAMP (NOW())";
        //echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();


        if ($this->Conn->Affected_Rows() > 0) {
            $response['product_unique_id'] = $unique_id;
            $response['id'] = $id;
            $response['ack'] = 1;
            $response['error'] = 'Record  Inserted.';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Not Insert.';
        }
        return $response;
    }

    function add_product($arr_attr)
    {      
     
        //echo  $this->objGeneral->convert_date($arr_attr->start_date);

        // check duplicate previous code
        if($arr_attr['old_code']){
            $checkDuplicatePrevCode = $this->checkDuplicatePrevCode($arr_attr['old_code']);
    
            if ($checkDuplicatePrevCode == 1) {
                $response['ack'] = 0;
                $response['error'] = 'Previous Item Code ('.$arr_attr['old_code'].') already exist!';
                return $response;
            }
        }

        foreach ($arr_attr as $key => $val) {
            $converted_array[$key] = $val;
            if ($key == "id") {
                $product_id = $val;
            }
        }

        $counter_supplier = 0;
        $counter_purchase = 0;
        if (!empty($arr_attr->id)) {
            $product_id = $arr_attr->id;
        }

        if (!empty($arr_attr->product_id)) {
            $product_id = $arr_attr->product_id;
        }

        $stock_check = (isset($arr_attr['stock_check']) && $arr_attr['stock_check']!='')?$arr_attr['stock_check']:0;
        $locations = (isset($arr_attr['locations']) && $arr_attr['locations']!='')?$arr_attr['locations']:0;
        $reorder_quantity = (isset($arr_attr['reorder_quantity']) && $arr_attr['reorder_quantity']!='')?$arr_attr['reorder_quantity']:0;
        $reoder_point_unit_id = (isset($arr_attr['reoder_point_unit_id']) && $arr_attr['reoder_point_unit_id']!='')?$arr_attr['reoder_point_unit_id']:0;
        $max_order_unit_ids = (isset($arr_attr['max_order_unit_ids']) && $arr_attr['max_order_unit_ids']!='')?$arr_attr['max_order_unit_ids']:0;
        $min_order_unit_ids = (isset($arr_attr['min_order_unit_ids']) && $arr_attr['min_order_unit_ids']!='')?$arr_attr['min_order_unit_ids']:0;
        $current_stock_level = (isset($arr_attr['current_stock_level']) && $arr_attr['current_stock_level']!='')?$arr_attr['current_stock_level']:0;
        $vat_rate_ids = (isset($arr_attr['vat_rate_ids']) && $arr_attr['vat_rate_ids']!='')?$arr_attr['vat_rate_ids']:0;
        $vat_chk = (isset($arr_attr['vat_chk']) && $arr_attr['vat_chk']!='')?$arr_attr['vat_chk']:0;
        $sale_item_gl_id = (isset($arr_attr['sale_item_gl_id']) && $arr_attr['sale_item_gl_id']!='')?$arr_attr['sale_item_gl_id']:0;
        $prd_country_origins = (isset($arr_attr['prd_country_origins']) && $arr_attr['prd_country_origins']!='')?$arr_attr['prd_country_origins']:0;
        $confidential = (isset($arr_attr['confidential']) && $arr_attr['confidential']!='')?$arr_attr['confidential']:0;
        $min_quantity = (isset($arr_attr['min_quantity']) && $arr_attr['min_quantity']!='')?$arr_attr['min_quantity']:0;
        $max_quantity = (isset($arr_attr['max_quantity']) && $arr_attr['max_quantity']!='')?$arr_attr['max_quantity']:0;
        $category_ids = (isset($arr_attr['category_ids']) && $arr_attr['category_ids']!='')?$arr_attr['category_ids']:0;
        $brand_ids = (isset($arr_attr['brand_ids']) && $arr_attr['brand_ids']!='')?$arr_attr['brand_ids']:0;
        $unit_ids = (isset($arr_attr['unit_ids']) && $arr_attr['unit_ids']!='')?$arr_attr['unit_ids']:0;

        $code_type = (isset($arr_attr['code_type']) && $arr_attr['code_type']!='')?$arr_attr['code_type']:0;
        

        // $product_code = ($arr_attr['product_code'] == '') ? "SR_GetNextSeq('product', '" . $this->arrUser['company_id'] . "',$brand_ids,$category_ids)" : "'".$arr_attr['product_code']."'";
        
        $Sql = "INSERT INTO product 
                            SET 
                                product_code=SR_GetNextSeq('product', '" . $this->arrUser['company_id'] . "',$brand_ids,$category_ids),
                                old_code='" . $arr_attr['old_code'] . "',
                                code_type='" . $code_type . "',
                                stock_check='" . $stock_check . "',
                                description='" . $arr_attr['description'] . "',
                                category_id='" . $category_ids . "' , 
                                brand_id='" . $brand_ids . "', 
                                unit_id='" . $unit_ids . "', 
                                current_stock_level='" . $current_stock_level . "' ,
                                reorder_quantity='" . $reorder_quantity . "' ,
                                prd_picture='" . $arr_attr['prd_picture'] . "'	  ,
                                min_quantity='" . $min_quantity . "' ,
                                max_quantity='" . $max_quantity . "' ,
                                vat_chk = '" . $vat_chk . "',
                                reoder_point_unit_id='" . $reoder_point_unit_id . "',
                                min_order_unit_id='" . $min_order_unit_ids. "',
                                max_order_unit_id='" . $max_order_unit_ids . "' ,
                                prd_country_origin='" . $prd_country_origins . "'  ,
                                prd_comidity_code='" . $arr_attr['prd_comidity_code'] . "',
                                vat_rate_id='" . $vat_rate_ids . "',
                                sale_item_gl_code='" . $arr_attr['sale_item_gl_code'] . "',
                                sale_item_gl_id='" . $sale_item_gl_id . "',
                                confidential= '" . $confidential . "',
                                gtipNo='" . $arr_attr['gtipNo'] . "',
                                company_id='" . $this->arrUser['company_id'] . "',
                                user_id='" . $this->arrUser['id'] . "', 
                                date_added=UNIX_TIMESTAMP (NOW()),
                                AddedBy='" . $this->arrUser['id'] . "',
                                AddedOn=UNIX_TIMESTAMP (NOW())";
        //echo $Sql;exit;
        // $response = $this->objGeneral->run_query_exception($Sql);

        $RS = $this->objsetup->CSI($Sql, "item_gneraltab", sr_ViewPermission);
        return $response;
        /* 
                                product_no='" . $arr_attr['product_no'] . "', */
    }

    function checkDuplicatePrevCode($prev_code,$product_id=0) {
        if($product_id!=0){
            $where = " AND id  <> ".$product_id." ";
        }else{
            $where = '';
        }
        $sqlResult = "SELECT id 
        FROM product
        WHERE old_code='" . $prev_code. "' 
        AND company_id=" . $this->arrUser['company_id']. "  ".$where."
        LIMIT 1";   
     $RS = $this->objsetup->CSI($sqlResult);
        if ($RS->RecordCount() > 0) {
            return 1;
        } else{
            return 0;
        } 
}

    function update_product($arr_attr)
    {  
        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['Parameter2'] = 'product_id:'.$arr_attr['product_id'];

        $this->objsetup->SRTraceLogsPHP($srLogTrace);

        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
        //print_r($arr_attr);exit;
       // echo "<pre>"; print_r($arr_attr); exit; 

        // check duplicate previous code
        if($arr_attr['old_code']){
            $checkDuplicatePrevCode = $this->checkDuplicatePrevCode($arr_attr['old_code'],$arr_attr['product_id']);

            if ($checkDuplicatePrevCode == 1) {
                $response['ack'] = 0;
                $response['error'] = 'Previous Item Code ('.$arr_attr['old_code'].') already exist!';
                return $response;
            }
        }

        $respose = $this->add_substitute_product($arr_attr);

        foreach ($arr_attr as $key => $val) {
            $converted_array[$key] = $val;
            if ($key == "id") {
                $product_id = $val;
            }
        }

        $counter_supplier = 0;
        $counter_purchase = 0;
        $message = "";

        if (!empty($arr_attr->id)) {
            $product_id = $arr_attr->id;
        }

        if (!empty($arr_attr->product_id)) {
            $product_id = $arr_attr->product_id;
        }

        $sql_total = "  SELECT  count(id) as total
                        FROM units_of_measure_setup 
                        WHERE  product_id='" . $arr_attr['product_id'] . "' AND 
                               cat_id='" . $arr_attr['unit_ids'] . "' AND 
                               status=1 ";
        //echo  $sql_total;exit;
        $rs_count = $this->objsetup->CSI($sql_total);

        if ($rs_count->fields['total'] == 0) {

            $Sqli = "DELETE FROM units_of_measure_setup 
                     WHERE product_id= '" . $arr_attr['product_id'] . "' ";
            $RS = $this->objsetup->CSI($Sqli);

            $Sql = "INSERT INTO units_of_measure_setup 
                                SET
                                    product_id = '" . $arr_attr['product_id'] . "',
                                    product_code = '" . $arr_attr['product_code'] . "',
                                    unit_id = '" . $arr_attr['unit_ids'] . "',
                                    record_id = '" . $arr_attr['unit_ids'] . "', 
                                    check_id = 1, 
                                    quantity = 1, 
                                    base_uom = 1,
                                    cat_id = '" . $arr_attr['unit_ids'] . "' ,
                                    company_id = '" . $this->arrUser['company_id'] . "', 
                                    date_added = UNIX_TIMESTAMP (NOW()), 
                                    user_id = '" . $this->arrUser['id'] . "',
                                    ref_quantity = 1,
                                    ref_unit_id =  '" . $arr_attr['unit_ids'] . "'";
                                    //below 2 lines commented by Ahmad to fix several bugs
                                    //
           //  echo  $Sql;exit;
            // $RS = $this->objsetup->CSI($Sql);
            $RS = $this->objsetup->CSI($Sql, "item_gneraltab", sr_AddEditPermission);

            $setup_id = $this->Conn->Insert_ID();
        }

        $stock_check = (isset($arr_attr['stock_check']) && $arr_attr['stock_check']!='')?$arr_attr['stock_check']:'0';
        $rawMaterialProduct = (isset($arr_attr['rawMaterialProduct']) && $arr_attr['rawMaterialProduct']!='')?$arr_attr['rawMaterialProduct']:'0';
        $raw_material_gl_id = (isset($arr_attr['raw_material_gl_id']) && $arr_attr['raw_material_gl_id']!='')?$arr_attr['raw_material_gl_id']:'0';

        $locations = (isset($arr_attr['locations']) && $arr_attr['locations']!='')?$arr_attr['locations']:'0';
        $reorder_quantity = (isset($arr_attr['reorder_quantity']) && $arr_attr['reorder_quantity']!='')?$arr_attr['reorder_quantity']:'0';
        $reoder_point_unit_id = (isset($arr_attr['reoder_point_unit_ids']) && $arr_attr['reoder_point_unit_ids']!='')?$arr_attr['reoder_point_unit_ids']:'0';
        $max_order_unit_ids = (isset($arr_attr['max_order_unit_ids']) && $arr_attr['max_order_unit_ids']!='')?$arr_attr['max_order_unit_ids']:'0';
        $min_order_unit_ids = (isset($arr_attr['min_order_unit_ids']) && $arr_attr['min_order_unit_ids']!='')?$arr_attr['min_order_unit_ids']:'0';
        $current_stock_level = (isset($arr_attr['current_stock_level']) && $arr_attr['current_stock_level']!='')?$arr_attr['current_stock_level']:'0';
        $vat_rate_ids = (isset($arr_attr['vat_rate_ids']) && $arr_attr['vat_rate_ids']!='')?$arr_attr['vat_rate_ids']:'0';
        $vat_chk = (isset($arr_attr['vat_chk']) && $arr_attr['vat_chk']!='')?$arr_attr['vat_chk']:'0';
        $sale_item_gl_id = (isset($arr_attr['sale_item_gl_id']) && $arr_attr['sale_item_gl_id']!='')?$arr_attr['sale_item_gl_id']:'0';
        $prd_country_origins = (isset($arr_attr['prd_country_origins']) && $arr_attr['prd_country_origins']!='')?$arr_attr['prd_country_origins']:'0';
        $confidential = (isset($arr_attr['confidential']) && $arr_attr['confidential']!='')?$arr_attr['confidential']:'0';
        $min_quantity = (isset($arr_attr['min_quantity']) && $arr_attr['min_quantity']!='')?$arr_attr['min_quantity']:'0';
        $max_quantity = (isset($arr_attr['max_quantity']) && $arr_attr['max_quantity']!='')?$arr_attr['max_quantity']:'0';
        $category_ids = (isset($arr_attr['category_ids']) && $arr_attr['category_ids']!='')?$arr_attr['category_ids']:'NULL';
        $brand_ids = (isset($arr_attr['brand_ids']) && $arr_attr['brand_ids']!='')?$arr_attr['brand_ids']:'NULL';
        $unit_ids = (isset($arr_attr['unit_ids']) && $arr_attr['unit_ids']!='')?$arr_attr['unit_ids']:'0';

        $minSaleQty = (isset($arr_attr['minSaleQty']) && $arr_attr['minSaleQty']!='')?$arr_attr['minSaleQty']:'0';
        $maxSaleQty = (isset($arr_attr['maxSaleQty']) && $arr_attr['maxSaleQty']!='')?$arr_attr['maxSaleQty']:'0';

        $code_type = (isset($arr_attr['code_type']) && $arr_attr['code_type']!='')?$arr_attr['code_type']:'0';
        $status = (isset($arr_attr['statuss']) && $arr_attr['statuss']!='')?$arr_attr['statuss']:'0';

        /* if($rawMaterialProduct == 1){
            $respose = $this->add_raw_material_item($arr_attr);
        }   */     

        $this->objGeneral->mysql_clean($arr_attr);

        $itemAdditionalDetail = $arr_attr['itemAdditionalDetail'];
        
        $itemAdditionalDetailStr = "";
        $index = 1;
        // print_r($itemAdditionalDetail);exit;
        
        foreach($itemAdditionalDetail as $rec)
        {
            // print_r(strlen($rec->value));
            if(!empty($rec) && strlen($rec->value) > 0)
            {
                $itemAdditionalDetailStr .= " itemAdditionalDetail".$index."_value = '".$rec->value."',";
                $index++;
            } 
        } 

        if($index<=5)
        {
            while($index <= 5)
            {
                $itemAdditionalDetailStr .= " itemAdditionalDetail".$index."_value = '',";
                $index++;
            }
        }
        // echo $itemAdditionalDetailStr;exit;
        // $itemAdditionalDetailStr = substr($itemAdditionalDetailStr, 0, -1); 

        $data_pass = "  (tst.product_code='" . $arr_attr['product_code'] . "' OR 
                         tst.description='" . $arr_attr['description'] . "') AND 
                         tst.product_code IS NOT NULL AND 
                         tst.code_type='" . $code_type . "' AND 
                         tst.id <> '" . $product_id . "'";

        $total = $this->objGeneral->count_duplicate_in_sql('product', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        } 

        if($arr_attr['product_code'] == ''){

            $Sql = "SELECT SR_GetNextSeq('product', '" . $this->arrUser['company_id'] . "',".$brand_ids.",".$category_ids.") AS productCode";
            //  echo  $Sql;exit;

            $RS = $this->objsetup->CSI($Sql);
            $productCode = $RS->fields['productCode'];

            if($productCode == "MaxReached"){
                $response['ack'] = 0;
                $response['error'] = 'Max Module No. Reached';
                return $response;
            }

            if($productCode == "MaxReached" || $productCode == "NoValueSet"){
                $response['ack'] = 0;
                $response['error'] = 'No value set for Module No.';
                return $response;
            }

            if($productCode == "" || $productCode == Null){
                $response['ack'] = 0;
                $response['error'] = 'Module No. not Generated';
                return $response;
            }
        }
        else{
            $productCode = $arr_attr['product_code'];
            // $productCode = ($arr_attr['product_code'] == '') ? "SR_GetNextSeq('product', '" . $this->arrUser['company_id'] . "',$brand_ids,$category_ids)" : "'".$arr_attr['product_code']."'";
        }


        $Sql = "UPDATE product 
                        SET
                            product_code='" . $productCode . "',
                            old_code='" . $arr_attr['old_code'] . "',
                            code_type=" . $code_type . ",
                            code_internal_external='" . $arr_attr['code_internal_external'] . "',
                            stock_check=" . $stock_check . ",
                            rawMaterialProduct=" . $rawMaterialProduct . ",

                            raw_material_gl_code='" . $arr_attr['raw_material_gl_codes'] . "',
                            raw_material_gl_name='" . $arr_attr['raw_material_gl_name'] . "',
                            raw_material_gl_id=" . $raw_material_gl_id  . ",


                            description='" . $arr_attr['description'] . "',
                            category_id=" . $category_ids . ", 
                            brand_id=" . $brand_ids . ", 
                            unit_id='" . $unit_ids . "', 
                            current_stock_level=" . $current_stock_level. " ,
                            reorder_quantity=" . $reorder_quantity . " ,
                            prd_picture='" . $arr_attr['prd_picture'] . "',
                            min_quantity=" . $min_quantity . " ,
                            max_quantity=" . $max_quantity . " ,
                            prd_country_origin=" . $prd_country_origins. ",
                            prd_comidity_code='" . $arr_attr['prd_comidity_code'] . "',
                            vat_rate_id=" . $vat_rate_ids . ",
                            reoder_point_unit_id=" . $reoder_point_unit_id . ",
                            location=" . $locations . ",
                            vat_chk = " . $vat_chk . ",
                            sale_item_gl_code='" . $arr_attr['sale_item_gl_code'] . "',
                            sale_item_gl_id=" . $sale_item_gl_id . ",
                            min_order_unit_id= " . $min_order_unit_ids . ",
                            max_order_unit_id= " . $max_order_unit_ids . ",
                            confidential= " . $confidential . ",                            
                            minSaleQty= " . $minSaleQty . ",
                            maxSaleQty= " . $maxSaleQty . ",
                            status='" . $status . "',
                            status_message='" . $arr_attr['status_message'] . "',
                            gtipNo='" . $arr_attr['gtipNo'] . "',
                            ".$itemAdditionalDetailStr."
                            ChangedBy='" . $this->arrUser['id'] . "',
                            ChangedOn=UNIX_TIMESTAMP (NOW())
                        WHERE id = " . $product_id . "  
                        Limit 1";

        // echo $Sql;exit; 
        //  product_no='" . $arr_attr['product_no'] . "',      
        
        $RS = $this->objsetup->CSI($Sql, "item_gneraltab", sr_AddEditPermission);

        if ($this->Conn->Affected_Rows() > 0) {
           // $this->copy_status_data($arr_attr, $product_id);
            $response['productCode'] = $productCode;
            $response['id'] = $product_id;
            $response['ack'] = 1;
            $response['error'] = 'Record Updated Successfully';
           
           
        }
        else {
            $response['ack'] = 1;
            $response['id'] = $product_id;
            $response['error'] = 'Record Updated Successfully';
            $response['msg'] = $message;
        }
          
         $this->Conn->commitTrans();
         $this->Conn->autoCommit = true;
        
        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Exit';
        $srLogTrace['Parameter2'] = 'parent_id:' . $product_id;

        $this->objsetup->SRTraceLogsPHP($srLogTrace);
        
        return $response;
    }


    function get_history_status($attr)
    {
        $Sql = "SELECT pr.id,pr.status_message as message,
                       pr.start_date as start_date,
                       pr.end_date as end_date,
                       us.first_name AS e_fname, 
                       us.last_name AS e_lname,
                         CASE 
                            WHEN pr.status = 1 THEN 'Active'
                            WHEN pr.status = 0 THEN 'Inactive'
                            WHEN pr.status>1 THEN ( SELECT e.title  
                                                    FROM product_status as e
                                                    WHERE  e.id= pr.status )		  
                            END AS status
                FROM product_status_log pr
                LEFT JOIN employees us ON us.id=pr.user_id
                WHERE pr.product_id='" . $attr['id'] . "' AND 
                      pr.company_id='" . $this->arrUser['company_id'] . "' 
                ORDER BY pr.id DESC";
           //echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['status'] = $Row['status'];
                $result['message'] = $Row['message'];
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
        return $response;
    }

    function copy_status_data($arr_attr, $product_id)
    {
        /*======= Query for store procedure start */

        /* $LabelString= "status,status_message";
        $InputString=  $arr_attr['statuss']."\',\'".$arr_attr['status_message'] ;

        $Sql = "CALL SR_MaintainHistoryLog('product_status_log','product_id','" . $product_id. "','".$LabelString."',\"" . $InputString . "\",'" . $this->arrUser['company_id'] . "','" . $this->arrUser['id'] . "')";
        //echo $Sql;exit;

        $this->objsetup->CSI($Sql); */
        /*======= Query for store procedure end */
    }

    function get_delete_products_listing($attr)
    {
        $limit_clause = $where_clause = "";
        $response2 = array();
        $response = array();


        $Sql = "SELECT * FROM product_delete_link  where product_id ='".$attr['product_id']."' and status=1 ";
        $RS = $this->objsetup->CSI($Sql);

        $selected = array();

        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {
                $selected[] = $Row['id'];
                $result['id'] = $Row['id'];
                $result['product_id'] = $Row['product_id'];
                $result['rec_id'] = $Row['id'];
                $result['delete_product_id'] = $Row['delete_product_id'];

                $response2['response_selected'][] = $result;
            }
        }
        //print_r($response2['response_selected']);exit;
        $limit_clause = $where_clause = "";


        if ($attr[edit_id] == 2) {
            $where_clause .= "  and (NOT EXISTS (SELECT product_delete_link.product_id FROM product_delete_link where 
       		 product_delete_link.delete_product_id= prd.id)) ";
        }
        if (!empty($attr['category_names'])) $where_clause .= " AND prd.category_id =" . $attr['category_names'] . "";
        if (!empty($attr['brand_names'])) $where_clause .= " AND prd.brand_id =" . $attr['brand_names'] . "";

        if (!empty($attr['unitss'])) $where_clause .= " AND prd.unit_id='" . $attr['unitss'] . "'";
        if (!empty($attr['searchBox'])) $where_clause .= " AND prd.description LIKE '%" . $attr['searchBox'] . "%'";
        $Sql = "SELECT prd.product_code,prd.description,prd.id
		, " . $this->objGeneral->get_nested_query_list('cat', $this->arrUser['company_id']) . "
		, " . $this->objGeneral->get_nested_query_list('brand', $this->arrUser['company_id']) . "
		, " . $this->objGeneral->get_nested_query_list('unit', $this->arrUser['company_id']) . "
		, " . $this->objGeneral->current_stock_counter($this->arrUser['company_id']) . "
		 From product  as prd
		LEFT JOIN units_of_measure as un on un.id=prd.unit_id
		where
		prd.status IN(0,4)	and prd.product_code IS NOT NULL and prd.id <>'$attr[product_id]' 
		and prd.company_id=" . $this->arrUser['company_id'] . "
		" . $where_clause . "";//.$where_clause.""
        //	echo $Sql;exit;

        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits']) $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'prd');
        //echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        $selected_count = 0;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                $result = array();
                $result['id'] = $Row['id'];
                $result['code'] = $Row['product_code'];
                $result['description'] = $Row['description'];
                $result['brand'] = $Row['brand_name'];
                $result['category'] = $Row['category_name'];
                $result['unit of measure'] = $Row['unit_name'];
                //$result['Current Stock Level'] = $Row['current_stock']; 
                //$result['DS'] = ($Row['delete_status'] ==1)?"1":"0";
                //$result['status'] = $Row['statusp'];

                $value_count = 0;
                foreach ($response2['response_selected'] as $key => $m_id) {
                    if ($Row['id'] == $m_id['delete_product_id']) {
                        $value_count = 1;
                        $selected_count++;
                        $result['checked'] = $value_count;
                        $result['rec_id'] = $m_id['rec_id'];
                    }
                }
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        $response['selected_count'] = $selected_count;


        return $response;
    }

    function add_delete_product($arr_attr)
    {
        $chk = 0;
        $i = 0;
        $msg = 0;

        //	 print_r($arr_attr);exit;

        $Sql = "INSERT INTO product_delete_link (delete_product_id,product_id, company_id, user_id,  date_added ,status,AddedBy,AddedOn) VALUES ";

        $del_product_ids = explode(",", $arr_attr[del_product_id]);
        foreach ($del_product_ids as $key => $del_product_id) {
            if (is_numeric($del_product_id)) {

                $Sql .= "(  '" . $del_product_id . "', '" . $arr_attr['product_id'] . "'
							,'" . $this->arrUser['company_id'] . "','" . $this->arrUser['id'] . "',UNIX_TIMESTAMP (NOW())
							,    1 ,'" . $this->arrUser['id'] . "',UNIX_TIMESTAMP (NOW())) , ";
                $chk++;
            }
            $i++;
        }
        $Sql = substr_replace(substr($Sql, 0, -1), "", -1);
        //  echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        //$response =$this->objGeneral->run_query_exception($Sql);
        //return $response;

        if ($chk > 0) {
            $response['ack'] = 1;
            $response['msg'] = $msg;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not Inserted.';
        }
        return $response;
    }

    function get_substitute_products_listing($attr)
    {
        $limit_clause = $where_clause = "";
        $response2 = array();
        $response = array();

        $page = (isset($attr['page'])) ? $attr['page'] : 1;
        $start_limit = ($page - 1) * 20;
        $end_limit = $page * 20;

        $limit_clause = " LIMIT $start_limit, $end_limit ";
        // $order_clause = " ORDER BY ri.id DESC";

        if (empty($attr['all'])) {
            if (empty($attr['start']))
                $attr['start'] = 0;
            if (empty($attr['limit']))
                $attr['limit'] = 10;
        }

        $Sql = "SELECT * 
                FROM product_substitute_link 
                where product_id ='$attr[product_id]' and status=1 ";

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        $selected = array();

        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {
                $selected[] = $Row['id'];
                $result['rec_id'] = $Row['id'];
                $result['product_id'] = $Row['product_id'];
                $result['substitute_product_id'] = $Row['substitute_product_id'];

                $response2['response_selected'][] = $result;
            }
        }
        //print_r($response2['response_selected']);exit;
        $limit_clause = $where_clause = "";

        if (!empty($attr['category_names'])) 
            $where_clause .= " AND prd.category_id =" . $attr['category_names'] . "";

        if (!empty($attr['brand_names'])) 
            $where_clause .= " AND prd.brand_id =" . $attr['brand_names'] . "";

        if (!empty($attr['unitss'])) 
            $where_clause .= " AND prd.unit_id='" . $attr['unitss'] . "'";

        if (!empty($attr['searchBox'])) 
            $where_clause .= " AND (prd.description LIKE '%" . $attr['searchBox'] . "%' OR prd.product_code LIKE '%" . $attr['searchBox'] . "%')";

        if ($attr['edit_id'] == 2) {
            $where_clause .= "  and (NOT EXISTS (SELECT product_substitute_link.product_id 
                                                 FROM product_substitute_link 
                                                 where product_substitute_link.substitute_product_id= prd.id)) ";
        }

        $Sql = "SELECT  prd.product_code,
                        prd.description,prd.id, 
                        " . $this->objGeneral->get_nested_query_list('cat', $this->arrUser['company_id']) . ", 
                        " . $this->objGeneral->get_nested_query_list('brand', $this->arrUser['company_id']) . ", 
                        " . $this->objGeneral->get_nested_query_list('unit', $this->arrUser['company_id']) . ", 
                        " . $this->objGeneral->current_stock_counter($this->arrUser['company_id']) . "
                 From product as prd
                 LEFT JOIN units_of_measure as un on un.id=prd.unit_id 
                 where  prd.status NOt in (0,4)	and 
                        prd.product_code IS NOT NULL and 
                        prd.id <> '$attr[product_id]' and 
                        prd.company_id=" . $this->arrUser['company_id'] . "
                         " . $where_clause . "";

        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits']) $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'prd');
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        $selected_count = 0;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                $result = array();
                $result['id'] = $Row['id'];
                $result['code'] = $Row['product_code'];
                $result['description'] = $Row['description'];
                $result['brand'] = $Row['brand_name'];
                $result['category'] = $Row['category_name'];
                $result['unit of measure'] = $Row['unit_name'];

                $value_count = 0;
                foreach ($response2['response_selected'] as $key => $m_id) {
                    if ($Row['id'] == $m_id['substitute_product_id']) {
                        $value_count = 1;
                        $selected_count++;
                        $result['checked'] = $value_count;
                        $result['rec_id'] = $m_id['rec_id'];
                    }
                }
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }

        $response['selected_count'] = $selected_count;
        return $response;
    }

    function get_sel_substitute_products_listing($attr)
    {
        $limit_clause = $where_clause = "";
        $response2 = array();
        $response = array();


        $page = (isset($attr['page'])) ? $attr['page'] : 1;
        $start_limit = ($page - 1) * 20;
        $end_limit = $page * 20;

        $limit_clause = " LIMIT $start_limit, $end_limit ";
        // $order_clause = " ORDER BY ri.id DESC";

        if (empty($attr['all'])) {
            if (empty($attr['start']))
                $attr['start'] = 0;
            if (empty($attr['limit']))
                $attr['limit'] = 10;
        }

        $Sql = "SELECT subitem.*,prd.description,prd.id,prd.product_code
                FROM product_substitute_link AS subitem
                LEFT JOIN product as prd on subitem.substitute_product_id=prd.id
                where subitem.product_id ='".$attr['product_id']."' and subitem.status=1 ";

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);
        $selected = array();

        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {
                $selected[] = $Row['id'];
                $result['id'] = $Row['id'];
                $result['rec_id'] = $Row['id'];
                $result['product_id'] = $Row['product_id'];
                $result['substitute_product_id'] = $Row['substitute_product_id'];
                $result['description'] = $Row['description'];
                $result['product_code'] = $Row['product_code'];

                $response2[] = $result;
            }
        }
        return $response2;//$response;
    }

    function add_substitute_product($arr_attr)
    {
        // print_r($arr_attr['substituteItems']);exit;
        $sqld = "DELETE FROM product_substitute_link
                                where  product_id='". $arr_attr['id']."'  and  
                                       company_id='" . $this->arrUser['company_id'] . "'";
        $this->objsetup->CSI($sqld);

        foreach ($arr_attr['substituteItems'] as $item) {
           // print_r($item);
            
             if ($item->substitute_product_id > 0) {

                $Sqle = "INSERT INTO product_substitute_link 
                                        SET 
                                            substitute_product_id='" . $item->substitute_product_id. "',
                                            substitute_product_code='" . $item->product_code. "',                                            
                                            product_id='" . $arr_attr['id'] . "',
                                            company_id='" . $this->arrUser['company_id'] . "',
                                            user_id='" . $this->arrUser['id'] . "',
                                            status='1',
                                            AddedBy='" . $this->arrUser['id'] . "',
                                            AddedOn='" . current_date. "',
                                            ChangedBy='" . $this->arrUser['id'] . "',
                                            ChangedOn='" . current_date. "',
                                            date_added='" . current_date. "'";
               // echo $Sqle; exit;
                $RS = $this->objsetup->CSI($Sqle);
            } 
        }
        return true;
    }

    function get_sel_raw_material_end_prod($attr)
    {
        $response2 = array();
        $Sql = "SELECT endProd.id,endProd.product_id,endProd.finished_item_id,endProd.raw_material_qty,prd.description,prd.product_code,
                       " . $this->objGeneral->get_nested_query_list('cat', $this->arrUser['company_id']) . ", 
                       endProd.finished_uom_name as unit_name
                FROM end_product_link as endProd
                LEFT JOIN product as prd on endProd.finished_item_id=prd.id
                WHERE endProd.product_id ='$attr[product_id]' AND endProd.status=1 ";

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['product_id'] = $Row['product_id'];
                $result['raw_material_qty'] = $Row['raw_material_qty'];
                $result['finished_item_id'] = $Row['finished_item_id'];
                $result['description'] = $Row['description'];
                $result['product_code'] = $Row['product_code'];
                $result['category_name'] = $Row['category_name'];
                $result['unit_name'] = $Row['unit_name'];

                $attr['product_id'] = $Row['finished_item_id'];
                $result['arr_units'] = self::get_unit_setup_list_category_by_item($attr);

                $response2[] = $result;
            }
        }
        return $response2;
    }

    function add_raw_material_item($arr_attr)
    {
        // echo '<pre>';print_r($arr_attr);exit;
        $rawMaterialProduct = (isset($arr_attr['rawMaterialProduct']) && $arr_attr['rawMaterialProduct']!='')?$arr_attr['rawMaterialProduct']:'0';
        $raw_material_gl_id = (isset($arr_attr['raw_material_gl_id']) && $arr_attr['raw_material_gl_id']!='')?$arr_attr['raw_material_gl_id']:'0';

        $Sql = "UPDATE product 
                        SET
                            rawMaterialProduct=" . $rawMaterialProduct . ",
                            raw_material_gl_code='" . $arr_attr['raw_material_gl_codes'] . "',
                            raw_material_gl_name='" . $arr_attr['raw_material_gl_name'] . "',
                            raw_material_gl_id=" . $raw_material_gl_id  . "
                        WHERE id = " . $arr_attr['itemID'] . "  
                        Limit 1";

        // echo $Sql;exit; 
        //  product_no='" . $arr_attr['product_no'] . "',      
        
        $RS = $this->objsetup->CSI($Sql, "item_gneraltab", sr_AddEditPermission);

        if ($this->Conn->Affected_Rows() > 0) {
           // $this->copy_status_data($arr_attr, $product_id);
            $response['productCode'] = $productCode;
            $response['id'] = $arr_attr['itemID'];
            $response['ack'] = 1;
            $response['error'] = 'Record Updated Successfully';             
        }
        else {
            $response['ack'] = 1;
            $response['id'] = $arr_attr['itemID'];
            $response['error'] = 'Record Updated Successfully';
            $response['msg'] = $message;
        }

        $sql = "DELETE FROM end_product_link
                                where  product_id='". $arr_attr['itemID']."'  and  
                                       company_id='" . $this->arrUser['company_id'] . "'";
        $this->objsetup->CSI($sql);

        foreach ($arr_attr['selectedRawMaterialItemsArr'] as $item) {
            
             if ($item->finished_item_id > 0) {

                $finished_uom_id = (isset($item->uomID) && $item->uomID != '')?$item->uomID:0;
                $finished_uom_qty = (isset($item->uomQty) && $item->uomQty != '')?$item->uomQty:0;

                $Sqle = "INSERT INTO end_product_link 
                                        SET 
                                            product_id = '" . $arr_attr['itemID']. "',                                          
                                            raw_material_qty = '" . $item->raw_material_qty . "',
                                            finished_item_id = '" . $item->finished_item_id . "',
                                            finished_uom_id = '" . $finished_uom_id . "',
                                            finished_uom_name = '" . $item->uom . "',
                                            finished_uom_qty = '" . $finished_uom_qty . "',
                                            status='1',
                                            company_id='" . $this->arrUser['company_id'] . "',
                                            AddedBy='" . $this->arrUser['id'] . "',
                                            AddedOn='" . current_date. "',
                                            ChangedBy='" . $this->arrUser['id'] . "',
                                            ChangedOn='" . current_date. "'";
               // echo $Sqle; exit;
                $RS = $this->objsetup->CSI($Sqle);
            } 
        }
        // return true;

        if ($this->Conn->Affected_Rows() > 0) {

            $Sql2 = "SELECT endProd.id,endProd.product_id,endProd.finished_item_id,endProd.raw_material_qty,prd.description,prd.product_code,
                            " . $this->objGeneral->get_nested_query_list('cat', $this->arrUser['company_id']) . ", 
                            endProd.finished_uom_name as unit_name
                    FROM end_product_link as endProd
                    LEFT JOIN product as prd on endProd.finished_item_id=prd.id
                    WHERE endProd.product_id ='" . $arr_attr['itemID']. "' AND endProd.status=1 ";

            // echo $Sql2; exit;
            $RS = $this->objsetup->CSI($Sql2);

            if ($RS->RecordCount() > 0) {
                $result = array();
                while ($Row = $RS->FetchRow()) {
                    $result['id'] = $Row['id'];
                    $result['product_id'] = $Row['product_id'];
                    $result['raw_material_qty'] = $Row['raw_material_qty'];
                    $result['finished_item_id'] = $Row['finished_item_id'];
                    $result['description'] = $Row['description'];
                    $result['product_code'] = $Row['product_code'];
                    $result['category_name'] = $Row['category_name'];
                    $result['unit_name'] = $Row['unit_name'];

                    $arr_attr['product_id'] = $Row['finished_item_id'];
                    $result['arr_units'] = self::get_unit_setup_list_category_by_item($arr_attr);

                    $response['response'][] = $result;
                }
            }

            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        }
        return $response;
    }
    
    function getFinishedGoodsInfo($arr_attr)
    {
        // echo '<pre>';print_r($arr_attr);exit;

        $Sql2 = "SELECT endProd.id,endProd.product_id,endProd.finished_item_id,endProd.raw_material_qty,prd.description,prd.product_code,prd2.rawMaterialProduct,
                        prd2.raw_material_gl_code,prd2.raw_material_gl_name,prd2.raw_material_gl_id,
                        " . $this->objGeneral->get_nested_query_list('cat', $this->arrUser['company_id']) . ", 
                        endProd.finished_uom_name as unit_name
                FROM end_product_link as endProd
                LEFT JOIN product as prd on endProd.finished_item_id=prd.id
                LEFT JOIN product as prd2 on endProd.product_id=prd2.id
                WHERE endProd.product_id ='" . $arr_attr['itemID']. "' AND endProd.status=1 ";

        // echo $Sql2; exit;
        $RS = $this->objsetup->CSI($Sql2);

        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['product_id'] = $Row['product_id'];
                $result['raw_material_qty'] = $Row['raw_material_qty'];
                $result['finished_item_id'] = $Row['finished_item_id'];
                $result['description'] = $Row['description'];
                $result['product_code'] = $Row['product_code'];
                $result['category_name'] = $Row['category_name'];
                $result['unit_name'] = $Row['unit_name'];

                $arr_attr['product_id'] = $Row['finished_item_id'];
                $result['arr_units'] = self::get_unit_setup_list_category_by_item($arr_attr);

                $response['rawMaterialProduct'] = $Row['rawMaterialProduct'];
                $response['raw_material_gl_code'] = $Row['raw_material_gl_code'];
                $response['raw_material_gl_name'] = $Row['raw_material_gl_name'];
                $response['raw_material_gl_id'] = $Row['raw_material_gl_id'];                

                $response['response'][] = $result;
            }

            $response['ack'] = 1;
            $response['error'] = NULL;
        }
        else {
            $response['ack'] = 0;
            $response['error'] = 'No Record Found';
        }
        return $response;
    }

    function delete_raw_material_item($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "Delete from end_product_link where id=" . $attr['id'];
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

    function get_product_detail_by_id($attr)
    {
        $response2 = array();
        $response = array();

        $Sql = "SELECT psp.* 
                FROM product_detail psp
                WHERE psp.status=1  AND 
                      psp.product_id=" . $attr['product_id'] . " 
                ORDER BY psp.id DESC";

        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);
                }
                $response2['response_selected'][] = $Row;
            }
        }

        $Sql = "SELECT  c.id,c.quantity,us.title as name
                FROM  units_of_measure_setup  c 
                right JOIN units_of_measure us on us.id=c.cat_id 
                where c.status=1 and 
                      us.status=1  and  
                      c.product_id=" . $attr['product_id'] . "
                group by us.title order by c.id  ASC";  
        
        $RS = $this->objsetup->CSI($Sql);
        //	echo  $Sql;exit;

        $selected_count = 0;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array(); //  $result['rem_id'] = 0;
                foreach ($response2['response_selected'] as $key => $m_id) {
                    if ($Row['id'] == $m_id['setup_unit_id']) {

                        $result['prd_comidity_code'] = $m_id['prd_comidity_code'];
                        $result['prd_country_origin'] = $m_id['prd_country_origin'];
                        $result['prd_net_weight'] = $m_id['prd_net_weight'];
                        $result['prd_net_weight_unit'] = $m_id['prd_net_weight_unit'];
                        $result['prd_bar_code'] = $m_id['prd_bar_code'];
                        $result['prd_height'] = $m_id['prd_height'];
                        $result['prd_width'] = $m_id['prd_width'];
                        $result['prd_length'] = $m_id['prd_length'];
                        $result['prd_dimension_unit'] = $m_id['prd_dimension_unit'];
                        $result['prd_weight'] = $m_id['prd_weight'];
                        $result['prd_weight_unit'] = $m_id['prd_weight_unit'];
                        $result['prd_pkg_weight'] = $m_id['prd_pkg_weight'];
                        $result['prd_pkg_weight_unit'] = $m_id['prd_pkg_weight_unit'];
                        $result['volume'] = $m_id['volume'];
                        $result['volume_unit'] = $m_id['volume_unit'];

                        //$result['rem_id'] = 1; $value_count=1;
                        //$result['check_id'] =$value_count;
                        $selected_count++;
                    }
                }
                $result['setup_unit_id'] = $Row['id'];
                $result['setup_unit_name'] = $Row['name'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else 
            $response['response'][] = array();

        $response['selected_counter'] = $selected_count;
        return $response;
    }

    function add_product_detail($arr_attr)
    {
        $chk = 0;
        $Sqli = "DELETE FROM product_detail 
                 WHERE product_id = $arr_attr[product_id]";

        //echo $Sqli;exit;
        $RS = $this->objsetup->CSI($Sqli);

        if ($this->Conn->Affected_Rows() > 0) 
            $msg = 'Updated';
        else 
            $msg = 'Inserted';

        $Sql = "INSERT INTO product_detail (product_id, setup_unit_id, setup_unit_name, prd_net_weight,prd_net_weight_unit,	prd_bar_code, prd_height,
                                            prd_width, prd_length, prd_dimension_unit, prd_weight, prd_weight_unit, volume, volume_unit, company_id, user_id,  
                                            date_added ,status,AddedBy,AddedOn,prd_pkg_weight,prd_pkg_weight_unit) VALUES ";

        for ($i = 0; $i < COUNT($arr_attr['data']); $i++) {

            if (!empty($arr_attr['data'][$i]->prd_bar_code)) {
                $Sql .= "(  '" . $arr_attr['product_id'] . "', '" . $arr_attr['data'][$i]->setup_unit_id . "', '" . $arr_attr['data'][$i]->setup_unit_name . "', " . "'" . 
                                $arr_attr['data'][$i]->prd_net_weight . "'," . "'" . $arr_attr['data'][$i]->prd_net_weight_unit->id . "','" . $arr_attr['data'][$i]->prd_bar_code . "','" . 
                                $arr_attr['data'][$i]->prd_height . "','" . $arr_attr['data'][$i]->prd_width . "','" . 
                                $arr_attr['data'][$i]->prd_length . "','" . $arr_attr['data'][$i]->prd_dimension_unit->id . "','" . 
                                $arr_attr['data'][$i]->prd_weight . "','" . $arr_attr['data'][$i]->prd_weight_unit->id . "',
                            '" . $arr_attr['data'][$i]->volume . "','" . $arr_attr['data'][$i]->volume_unit->id . "'
                            ,'" . $this->arrUser['company_id'] . "','" . $this->arrUser['id'] . "',UNIX_TIMESTAMP (NOW()),    1 ,
                            '" . $this->arrUser['id'] . "',UNIX_TIMESTAMP (NOW()),'" . $arr_attr['data'][$i]->prd_pkg_weight . "','" . $arr_attr['data'][$i]->prd_pkg_weight_unit->id . "' ) , ";

                $chk = true;
                //echo $Sql;
            }
        }
        
        $Sql = substr_replace(substr($Sql, 0, -1), "", -1);
        // echo  $Sql;exit;

        $RSProducts = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['msg'] = $msg;
            $response['error'] = NULL;
        } 
        else {
            $response['ack'] = 0;
            $response['error'] = 'Record not Inserted.';
        }
        return $response;
    }

    function get_purchase_info_listing($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $where_clause = "";

        $type = (isset($attr['type'])) ? $attr['type'] : 1;
        // $product_id = (isset($attr['product_id'])) ? $attr['product_id'] : 1;
        $response = array();

        if (!empty($attr['keyword']))
            $where_clause .= " AND name LIKE '%".$attr['keyword']."%' ";

        if (!empty($attr['product_id']))
            $where_clause .= " AND psp.product_id = '".$attr['product_id']."' ";

        if (!empty($attr['supp_id']))
            $where_clause .= " AND psp.supplier_id = '".$attr['supp_id']."' ";

        /* (SELECT Count(sv.id) as total
                FROM srm_volume_discount  sv
                WHERE  sv.purchase_info_id = psp.id  AND 
                       sv.status=1 AND
                      (sv.start_date >= '" . today_date . "' Or  
                       sv.end_date >='" . today_date . "'))as volume_after_curent_date,
            (SELECT Count(sv.id) as total
                FROM srm_volume_discount  sv
                WHERE sv.purchase_info_id = psp.id  and sv.status=1 AND
                     (sv.start_date <= '" . today_date . "' Or 
                      sv.end_date <='" . today_date . "'))as volume_before_curent_date,
            (SELECT Count(land_cost.id) as total
                FROM product_cost_details as land_cost
                WHERE land_cost.product_id = '" . $attr['product_id'] . "' AND land_cost.supp_id=psp.supplier_id) as landing_cost_chk, */
            
        $Sql = "SELECT psp.*,
                       srm.supplier_code,
                       srm.name as supplier_name,
                       pr.id as product_id,
                       pr.product_code,
                       pr.description as product_description,
                       uom.title as uom_name,
                       cr.code as custom_currency,                       
                       CASE  WHEN psp.status_id = 1 THEN 'Active'
                             WHEN psp.status_id = 0 THEN 'Inactive'
                             WHEN psp.status_id >1 THEN ps.title
                             END AS status_name
                FROM product_supplier psp
                left JOIN srm ON srm.id=psp.supplier_id
                left JOIN product_status ps ON ps.id=psp.status_id
                left JOIN product pr ON pr.id=psp.product_id
                left JOIN units_of_measure_setup uomsetup ON uomsetup.id = psp.uom_id
                left JOIN units_of_measure uom ON uom.id = uomsetup.cat_id
                left JOIN currency cr ON cr.id=psp.currency_id
                WHERE psp.status=1 AND 
                      psp.company_id=" . $this->arrUser['company_id'] . " " . $where_clause . " ";
        
        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $result = array();

                $result['id'] = $Row['id'];

                /* if ($attr['get_data'] == 1) {
                    $result['supplier_code'] = $Row['supplier_code'];
                    $result['supplier_name'] = $Row['supplier_name'];
                } else if ($attr['get_data'] == 2) {
                    
                } */
                $result['product_code'] = $Row['product_code'];
                $result['product_description'] = $Row['product_description'];

                $result['pid'] = $Row['product_id'];
                $result['unit of measure'] = $Row['uom_name'];
                $result['unit_price'] = $Row['priceCost'];
                $result['customcurrency'] = $Row['custom_currency'];

                //$result['landing_cost_chk'] = $Row['landing_cost_chk'];
                // $result['supplier_id'] = $Row['supplier_id'];

                $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);

                $result['status'] = ucwords($Row['status_name']);
                $result['status_date'] = $this->objGeneral->convert_unix_into_date($Row['status_date']);

                //$result['Purchase Volume Discount'] = '';
                /* if (!empty($Row['volume_after_curent_date']))
                    $result['purchasestatus'] = 'Active ';
                else if (!empty($Row['volume_before_curent_date']))
                    $result['purchasestatus'] = 'Yes Past';
                else
                    $result['purchasestatus'] = 'No'; */
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

    function get_purchase_info_by_id($attr)
    {
        $Sql = "SELECT psp.*,psp.id as pspid, 
                       srm.id,
                       srm.supplier_code as sale_code,
                       srm.name as sale_name, 
                       pr.product_code,
                       pr.description as product_description
		        FROM product_supplier psp 
                left JOIN srm ON srm.id=psp.supplier_id
                left JOIN product pr ON pr.id=psp.product_id
                WHERE psp.id=".$attr['id']."
                LIMIT 1";

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) 
        {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key)) unset($Row[$key]);
            }

            $Row['arr_units'] = self::get_unit_setup_list_category_by_item($Row);
            $Row['id'] = $Row['pspid'];

            $Row['AddedOn'] = $this->objGeneral->convert_unix_into_date($Row['AddedOn']);
            $Row['ChangedOn'] = $this->objGeneral->convert_unix_into_date($Row['ChangedOn']);
            $Row['date_added'] = $this->objGeneral->convert_unix_into_date($Row['date_added']);
            $Row['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
            $Row['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
            $Row['status_date'] = $this->objGeneral->convert_unix_into_date($Row['status_date']);
            $Row['average_year_start'] = $this->objGeneral->convert_unix_into_date($Row['average_year_start']);
            $Row['average_year_end'] = $this->objGeneral->convert_unix_into_date($Row['average_year_end']);

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {
            $response['ack'] = 0;
            $response['error'] = 'No purchase info exists for this item';
            // $response['error'] = 'Record not Exist!';
            $response['response'] = array();
        }

        return $response;
    }


    function get_last_po_date($attr)
    {
        $response = array();
        $where_clause = "";

        if (!empty($attr['product_id'])) 
            $where_clause .= " AND si.product_id = '".$attr['product_id']."' ";

        if (!empty($attr['supplier_id'])) 
            $where_clause .= " AND si.supplier_id = '".$attr['supplier_id']."' ";

        $sql_total = "  SELECT  MAX(si.order_date) as or_date  
                        FROM srm_invoice_detail si 
                        WHERE si.status=1  ".$where_clause." ";

        $rs_count = $this->objsetup->CSI($sql_total);
        $or_date = $rs_count->fields['or_date'];

        if (!empty($attr['product_id'])) {
            
            $Sql = "SELECT psp.*
                    FROM product_supplier psp 
                    where psp.status=1  AND 
                          psp.product_id = '".$attr['product_id']."' AND 
                          psp.supplier_id = '".$attr['supplier_id']."' AND  
                          psp.company_id=" . $this->arrUser['company_id'] . "
                    ORDER BY psp.id DESC  Limit 1";

            $RS = $this->objsetup->CSI($Sql);

            if ($RS->RecordCount() > 0) {
                $Row = $RS->FetchRow();
                foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);
                }
                $response['response'] = $Row;

                $response['ack'] = 1;
                $response['last_po_date'] = $this->objGeneral->convert_unix_into_date($or_date);
                $response['error'] = 'Record  Exit !';
            } 
            else {
                $response['ack'] = 0;
                // $response['error'] = 'Record not Exit !';
                $response['error'] = 'No PO exists for this item';
            }
        }
        return $response;
    }


    function get_unit_srm_purchase_info($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $where_clause = "";

        if (!empty($attr['product_id'])) 
            $where_clause .= " AND p.product_id = ".$attr['product_id']." ";

        if (!empty($attr['supplier_id'])) 
            $where_clause .= " AND p.supplier_id = ".$attr['supplier_id']." ";

        if (!empty($attr['type'])) 
            $where_clause .= " AND p.supplier_id = ".$attr['type']." ";

        if (!empty($attr['purchase_info_id'])) 
            $where_clause .= " AND p.purchase_info_id = $attr[purchase_info_id] ";

        $Sql = "SELECT  p.id,p.quantity_from,
                        p.quantity_to,
                        ( SELECT wh.title  
                          FROM units_of_measure_setup st 
                          LEFT JOIN units_of_measure as wh ON wh.id = st.cat_id
                          WHERE st.id =p.unit_category and 
                                st.status=1  
                          Limit 1) as cat_name
                FROM product_supplier_volume p
                WHERE p.status=1  " . $where_clause . "";

        $counter = 0;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();

                if (!empty($Row['cat_name'])) {
                    $counter++;
                    $result['id'] = $Row['id'];
                    $result['name'] = $Row['quantity_from'] . '-' . $Row['quantity_to'] . ' ' . $Row['cat_name'];

                    $result['quantity_from'] = $Row['quantity_from'];
                    $result['quantity_to'] = $Row['quantity_to'];
                    $response['response'][] = $result;
                }
            }
        }

        if ($counter > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }


    function add_unit_srm_purchase_info($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "INSERT INTO product_supplier_volume 
                                        SET 
                                            type='" . $arr_attr['type'] . "',
                                            supplier_id='" . $arr_attr['supplier_id'] . "',
                                            product_id='" . $arr_attr['product_id'] . "',
                                            purchase_info_id='" . $arr_attr['purchase_info_id'] . "',
                                            quantity_from='" . $arr_attr['quantity_from'] . "',
                                            quantity_to='" . $arr_attr['quantity_to'] . "',
                                            unit_category='" . $arr_attr['unit_categorys'] . "',
                                            company_id='" . $this->arrUser['company_id'] . "',
                                            user_id='" . $this->arrUser['id'] . "',
                                            AddedBy='" . $this->arrUser['id'] . "',
                                            AddedOn=UNIX_TIMESTAMP (NOW())";
        //echo $Sql;
        $response = $this->objGeneral->run_query_exception($Sql);
        return $response;
    }


    function add_purchase_info($arr_attr)
    {
        $data_pass = "( tst.product_id='" . $arr_attr['product_id'] . "' AND 
                        tst.supplier_id = '".$arr_attr['supplierID']."' AND 
                        tst.status=1 AND
                        (tst.start_date BETWEEN '" . $this->objGeneral->convert_date($arr_attr['start_date']) . "' AND '" . $this->objGeneral->convert_date($arr_attr['end_date']) . "' OR 
                         tst.end_date BETWEEN '" . $this->objGeneral->convert_date($arr_attr['start_date']) . "' AND '" . $this->objGeneral->convert_date($arr_attr['end_date']) . "' ) 
                         )";

        $total = $this->objGeneral->count_duplicate_in_sql('product_supplier', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $uom_id = (isset($arr_attr['uom_id']) && $arr_attr['uom_id']!='')?$arr_attr['uom_id']:0;
        $min_quantity = (isset($arr_attr['min_quantity']) && $arr_attr['min_quantity']!='')?$arr_attr['min_quantity']:0;
        $max_quantity = (isset($arr_attr['max_quantity']) && $arr_attr['max_quantity']!='')?$arr_attr['max_quantity']:0;
        $average_costs = (isset($arr_attr['average_costs']) && $arr_attr['average_costs']!='')?$arr_attr['average_costs']:0;

        $Sql = "INSERT Into product_supplier 
                                    SET
                                        product_id='" . $arr_attr['product_id'] . "' ,
                                        supplier_id='" . $arr_attr['supplierID'] . "' ,
                                        supplierItemCode='".$arr_attr['supplierItemCode']. "',
                                        priceCost=  '". $arr_attr['priceCost'] . "',
                                        uom_id='".$uom_id. "',
                                        currency_id='" . $arr_attr['currency_ids'] . "',
                                        converted_price='" .$arr_attr['converted_price']. "',
                                        purchase_message='".$arr_attr['purchase_message']. "',
                                        lead_time='".$arr_attr['lead_time']. "',
                                        lead_type='".$arr_attr['lead_typess']. "',
                                        max_quantity='" . $max_quantity . "',
                                        min_quantity='" . $min_quantity . "',                                                
                                        start_date= '" . $this->objGeneral->convert_date($arr_attr['start_date']) . "',
                                        end_date= '" . $this->objGeneral->convert_date($arr_attr['end_date']) . "',
                                        average_cost='" . $average_costs . "',                                                
                                        average_year_start= '" . $this->objGeneral->convert_date($arr_attr['average_year_start']) . "',
                                        average_year_end= '" . $this->objGeneral->convert_date($arr_attr['average_year_end']) . "',                                             
                                        status= 1,
                                        status_id='".$arr_attr['status_ids']. "',
                                        status_date= '" . $this->objGeneral->convert_date($arr_attr['status_date']) . "',
                                        company_id='" . $this->arrUser['company_id'] . "',
                                        user_id='". $this->arrUser['id'] . "',                                                
                                        AddedBy='" . $this->arrUser['id'] . "',
                                        AddedOn=UNIX_TIMESTAMP (NOW()),
                                        ChangedBy='" . $this->arrUser['id'] . "',
                                        ChangedOn=UNIX_TIMESTAMP (NOW())";
        //echo $Sql;  exit;
        $response = $this->objGeneral->run_query_exception($Sql);
        return $response;
    }


    function update_purchase_info($arr_attr)
    {
        $data_pass = "( tst.id <> '" . $arr_attr['id']  . "' AND 
                        tst.product_id='" . $arr_attr['product_id'] . "' AND 
                        tst.supplier_id = '".$arr_attr['supplierID']."' AND 
                        tst.status=1 AND
                        (tst.start_date BETWEEN '" . $this->objGeneral->convert_date($arr_attr['start_date']) . "' AND '" . $this->objGeneral->convert_date($arr_attr['end_date']) . "' OR 
                         tst.end_date BETWEEN '" . $this->objGeneral->convert_date($arr_attr['start_date']) . "' AND '" . $this->objGeneral->convert_date($arr_attr['end_date']) . "' ) 
                         )";

        $total = $this->objGeneral->count_duplicate_in_sql('product_supplier', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $uom_id = (isset($arr_attr['uom_id']) && $arr_attr['uom_id']!='')?$arr_attr['uom_id']:0;
        $min_quantity = (isset($arr_attr['min_quantity']) && $arr_attr['min_quantity']!='')?$arr_attr['min_quantity']:0;
        $max_quantity = (isset($arr_attr['max_quantity']) && $arr_attr['max_quantity']!='')?$arr_attr['max_quantity']:0;
        $average_costs = (isset($arr_attr['average_costs']) && $arr_attr['average_costs']!='')?$arr_attr['average_costs']:0;

        $Sql = "UPDATE product_supplier 
                                SET 
                                    supplierItemCode='".$arr_attr['supplierItemCode']. "',
                                    priceCost=  '". $arr_attr['priceCost'] . "',
                                    uom_id='".$uom_id. "',
                                    currency_id='" . $arr_attr['currency_ids'] . "',
                                    converted_price='" .$arr_attr['converted_price']. "',
                                    purchase_message='".$arr_attr['purchase_message']. "',
                                    lead_time='".$arr_attr['lead_time']. "',
                                    lead_type='".$arr_attr['lead_typess']. "',
                                    max_quantity='" . $max_quantity . "',
                                    min_quantity='" . $min_quantity . "',                                                
                                    start_date= '" . $this->objGeneral->convert_date($arr_attr['start_date']) . "',
                                    end_date= '" . $this->objGeneral->convert_date($arr_attr['end_date']) . "',
                                    average_cost='" . $average_costs . "',                                                
                                    average_year_start= '" . $this->objGeneral->convert_date($arr_attr['average_year_start']) . "',
                                    average_year_end= '" . $this->objGeneral->convert_date($arr_attr['average_year_end']) . "',                                             
                                    status_id='".$arr_attr['status_ids']. "',
                                    status_date= '" . $this->objGeneral->convert_date($arr_attr['status_date']) . "',
                                    ChangedBy='" . $this->arrUser['id'] . "',
                                    ChangedOn=UNIX_TIMESTAMP (NOW())
                                WHERE id = " . $arr_attr['id'] . "   
                                Limit 1";
        // echo $Sql;  exit;	
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['id'] = $arr_attr['id'];
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record Inserted Successfully';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
        }
        return $response;
    }


    function change_standard_purhcase_info($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "UPDATE product_supplier 
                                Set 
                                    unit_price='".$attr['unit_price']."'
				WHERE product_id = ".$attr['product_id']." ";
        //	echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        }
        return $response;
    }


    function add_purchase_info_volume($arr_attr)
    {
        $response = array();
        $response2 = array();

        $sql_volume = "SELECT   ef.id,
                                ef.start_date,
                                ef.volume_id,
                                ef.end_date
                        FROM srm_volume_discount ef
                        WHERE   ef.status=1  AND  
                                ef.product_id='" . $arr_attr['product_id'] . "' AND 
                                ef.supplier_id='" . $arr_attr['supplier_id'] . "' AND
                                ef.purchase_info_id='" . $arr_attr['purchase_info_id'] . "' AND 
                                ef.company_id=" . $this->arrUser['company_id'] . " ";
        
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

        $total = 0;
        $sql_total = "  SELECT  ef.id	
                        FROM product_supplier_volume ef
                        WHERE   ef.status=1 AND  
                                ef.product_id='" . $arr_attr['product_id'] . "' AND 
                                ef.supplier_id='" . $arr_attr['supplier_id'] . "' AND 
                                ef.purchase_info_id='" . $arr_attr['purchase_info_id'] . "' AND 
                                ('" . $arr_attr['volume_id']->quantity_from . "' BETWEEN ef.quantity_from AND ef.quantity_to OR 
                                 '" . $arr_attr['volume_id']->quantity_to . "'  BETWEEN ef.quantity_from AND ef.quantity_to ) AND 
                                ef.company_id=" . $this->arrUser['company_id'] . " ";
        
        $rs_count = $this->objsetup->CSI($sql_total);
        //echo $sql_total;exit;

        $from = $this->objGeneral->convert_date($arr_attr['start_date1']);//$this->objGeneral->convert_date($arr_attr['start_date1']);
        $to = $this->objGeneral->convert_date($arr_attr['end_date1']);//$this->objGeneral->convert_date($arr_attr['end_date1']);

        if ($rs_count->RecordCount() > 0) 
        {
            while ($Row = $rs_count->FetchRow()) 
            {
                foreach ($response2['response_volume'] as $key => $value) 
                {
                    if ($value['volume_id'] == $Row['id']) 
                    {
                        if ((($from >= $value['start_date']) && ($from <= $value['end_date']) || (($to >= $value['start_date']) && ($to <= $value['end_date'])))) 
                        {
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
            return $response;
        } 
        else {
            $Sql = "INSERT  INTO srm_volume_discount 
                                            SET  
                                                product_id='$arr_attr[product_id]',
                                                supplier_id='$arr_attr[supplier_id]',
                                                purchase_info_id='$arr_attr[purchase_info_id]',
                                                volume_id= '" . $arr_attr[volume_id]->id . "',
                                                supplier_type='" . $arr_attr[supplier_type]->id . "',
                                                purchase_price='$arr_attr[purchase_price]',
                                                discount_value='$arr_attr[discount_value]',
                                                discount_price='$arr_attr[discount_price]',
                                                start_date= '" . $from . "',
                                                end_date= '" . $to . "',
                                                company_id=" . $this->arrUser['company_id'] . ",
                                                date_added=UNIX_TIMESTAMP (NOW()),
                                                user_id=" . "'" . $this->arrUser['id'] . "',
                                                status= 1,
                                                AddedBy='" . $this->arrUser['id'] . "',
                                                AddedOn=UNIX_TIMESTAMP (NOW())";
            //	echo $Sql;exit;
            //$response =$this->objGeneral->run_query_exception($Sql);
            $RS = $this->objsetup->CSI($Sql);
        }
        if ($this->Conn->Affected_Rows() > 0) {
            //  $response['id'] = $id;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record Inserted Successfully';
        } 
        else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
        }
        return $response;
    }


    function update_purchase_info_volume($arr_attr)
    {
        $response = array();
        $response2 = array();
        $total = 0;

        $sql_volume = " SELECT  ef.id,
                                ef.volume_id,
                                ef.start_date,
                                ef.end_date,
                                ef.product_id
		                FROM srm_volume_discount ef
                        WHERE  ef.status=1  and  
                               ef.product_id='" . $arr_attr['product_id'] . "' and 
                               ef.supplier_id='" . $arr_attr['supplier_id'] . "' and 	
                               ef.purchase_info_id='" . $arr_attr['purchase_info_id'] . "' and 
                               ef.company_id=" . $this->arrUser['company_id'] . " ";

        $rs_volume = $this->objsetup->CSI($sql_volume);
        //echo $sql_volume;exit;
        if ($rs_volume->RecordCount() > 0) {
            $result = array();
            while ($Row = $rs_volume->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['volume_id'] = $Row['volume_id'];
                $result['product_id'] = $Row['product_id'];
                $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);

                $response2['response_volume'][] = $result;
            }
        }
        //print_r($response2['response_volume'] );


        $sql_total = "SELECT  ef.id	
                      FROM  product_supplier_volume ef
                      WHERE ef.status=1  and  
                            ef.product_id='" . $arr_attr['product_id'] . "' and 
                            ef.supplier_id='" . $arr_attr['supplier_id'] . "' and 
                            ef.purchase_info_id='" . $arr_attr['purchase_info_id'] . "' and 
                            ('" . $arr_attr['volume_id']->quantity_from . "' BETWEEN ef.quantity_from AND ef.quantity_to OR 
                             '" . $arr_attr['volume_id']->quantity_to . "'  BETWEEN ef.quantity_from AND ef.quantity_to ) and 
                            ef.company_id=" . $this->arrUser['company_id'] . " ";

        $rs_count = $this->objsetup->CSI($sql_total);
        //echo $sql_total;exit;

        $from = $this->objGeneral->convert_date($arr_attr['start_date1']);//$this->objGeneral->convert_date($arr_attr['start_date1']);
        $to = $this->objGeneral->convert_date($arr_attr['end_date1']);//$this->objGeneral->convert_date($arr_attr['end_date1']);

        if ($rs_count->RecordCount() > 0) 
        {
            while ($Row = $rs_count->FetchRow()) 
            {
                foreach ($response2['response_volume'] as $key => $value) 
                {
                    if ($value['volume_id'] == $Row['id']) {

                        if ((($from >= $value['start_date']) && ($from <= $value['end_date'])
                            || (($to >= $value['start_date']) && ($to <= $value['end_date']))))
                        {
                            if ($value['product_id'] != $arr_attr[product_id]) 
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
            return $response;
        } 
        else {

            $Sql = "UPDATE srm_volume_discount 
                                    SET  
                                        volume_id= '" . $arr_attr['volume_id']->id . "',
                                        supplier_type='" . $arr_attr['supplier_type']->id . "',
                                        purchase_price='$arr_attr[purchase_price]',
                                        discount_value='$arr_attr[discount_value]',
                                        discount_price='$arr_attr[discount_price]',
                                        start_date= '" . $from . "',
                                        end_date= '" . $to . "',
                                        ChangedBy='" . $this->arrUser['id'] . "',
                                        ChangedOn=UNIX_TIMESTAMP (NOW())  
                    WHERE id = " . $arr_attr['update_id'] . "   
                    Limit 1";
            //	echo $Sql;  exit;	
            $RS = $this->objsetup->CSI($Sql);
        }

        if ($this->Conn->Affected_Rows() > 0) {
            $response['id'] = $arr_attr['update_id'];
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record Inserted Successfully';
        }
        else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
        }
        return $response;
    }


    function update_purchase_info_ediatable($arr_attr)
    {
        $Sql = "INSERT INTO srm_volume_discount (product_id,supplier_id, volume_id, supplier_type,purchase_price, discount_value, discount_price,start_date,  end_date, company_id, date_added, user_id, status,AddedBy,AddedOn,volume_type) VALUES ";

        for ($i = 0; $i < COUNT($arr_attr); $i++) {

            if ($arr_attr[$i]->volume_id->id > 0) {

                $Sql .= "(  '" . $arr_attr[$i]->product_id . "', '" . $arr_attr[$i]->supplier_id . "', '" . $arr_attr[$i]->volume_id->id . "','" . $arr_attr[$i]->supplier_type->id . "',  '" . $arr_attr[$i]->purchase_price . "', " . "'" . $arr_attr[$i]->discount_value . "','" . $arr_attr[$i]->discount_price .
                    "'," . "'" . $this->objGeneral->convert_date($arr_attr[$i]->start_date) . "','" . $this->objGeneral->convert_date($arr_attr[$i]->end_date) . "','" . $this->arrUser['company_id'] . "',UNIX_TIMESTAMP (NOW()),"
                    . "'" . $this->arrUser['id'] . "', 1 ,'" . $this->arrUser['id'] . "',UNIX_TIMESTAMP (NOW()),'" . $arr_attr[$i]->volume_type . "'), ";

            }
        }
        $Sql = substr_replace(substr($Sql, 0, -1), "", -1);
        // echo  $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);
    }

    function update_volume_single($arr_attr, $sale_id, $product_id)
    {
        $Sqli = "DELETE FROM srm_volume_discount WHERE product_id =$product_id and supplier_id =$sale_id ";
        $RS = $this->objsetup->CSI($Sqli);

        $Sqli = "DELETE FROM srm_volume_discount WHERE  supplier_id =0 or product_id=0 ";
        $RS = $this->objsetup->CSI($Sqli);

        $Sql1 = "INSERT INTO srm_volume_discount 
                                        SET  
                                            product_id='" . $product_id . "' 
                                            ,volume_id='" . $arr_attr->volume_1s . "'  
                                            ,volume_1=1  
                                            ,supplier_type='" . $arr_attr->supplier_type_1s . "'  
                                            ,purchase_price='" . $arr_attr->purchase_price_1 . "' 
                                        ,discount_value='" . $arr_attr->discount_value_1 . "'  
                                        ,discount_price='" . $arr_attr->discount_price_1 . "' 
                                        ,price_list_id='" . $arr_attr->price_list_id . "' 
                                        ,start_date_1=  '" . $this->objGeneral->convert_date($arr_attr->start_date_1) . "'
                                        ,end_date_1=   '" . $this->objGeneral->convert_date($arr_attr->end_date_1) . "'
                                        ,supplier_id='" . $sale_id . "' 	,status='1'  
                                        ,company_id='" . $this->arrUser['company_id'] . "' 
                                        ,user_id='" . $this->arrUser['id'] . "'
                                        ,date_added=UNIX_TIMESTAMP (NOW())
                                        ,AddedBy='" . $this->arrUser['id'] . "'
                                        ,AddedOn=UNIX_TIMESTAMP (NOW())";
        //echo	 $Sql1;exit;
        if ($arr_attr->volume_1s != NULL) 
            $RS = $this->objsetup->CSI($Sql1);

        $Sql2 = "INSERT INTO srm_volume_discount SET  
												product_id='" . $product_id . "'
												 ,volume_id='" . $arr_attr->volume_2s . "' 
												  ,volume_2=2   
												,supplier_type='" . $arr_attr->supplier_type_2s . "'  
												 ,purchase_price='" . $arr_attr->purchase_price_2 . "' 
												,discount_value='" . $arr_attr->discount_value_2 . "'  
												 ,discount_price='" . $arr_attr->discount_price_2 . "' 
												,price_list_id='" . $arr_attr->price_list_id . "' 
												,start_date_2=  '" . $this->objGeneral->convert_date($arr_attr->start_date_2) . "'
												,end_date_2=   '" . $this->objGeneral->convert_date($arr_attr->end_date_2) . "'
												,supplier_id='" . $sale_id . "' 	,status='1'  
												,company_id='" . $this->arrUser['company_id'] . "' 
												,user_id='" . $this->arrUser['id'] . "'
												,date_added=UNIX_TIMESTAMP (NOW())
												,AddedBy='" . $this->arrUser['id'] . "'
												,AddedOn=UNIX_TIMESTAMP (NOW())";
        if ($arr_attr->volume_2s != NULL)
            $RS = $this->objsetup->CSI($Sql2);

        $Sql3 = "INSERT INTO srm_volume_discount SET  
												product_id='" . $product_id . "'  
												 ,volume_id='" . $arr_attr->volume_3s . "'  
												 ,volume_3=3  
												,supplier_type='" . $arr_attr->supplier_type_3s . "'  
												 ,purchase_price='" . $arr_attr->purchase_price_3 . "' 
												,discount_value='" . $arr_attr->discount_value_3 . "'  
												 ,discount_price='" . $arr_attr->discount_price_3 . "' 
												,price_list_id='" . $arr_attr->price_list_id . "' 
												,start_date_3=  '" . $this->objGeneral->convert_date($arr_attr->start_date_3) . "'
												,end_date_3=   '" . $this->objGeneral->convert_date($arr_attr->end_date_3) . "'
												,supplier_id='" . $sale_id . "' 	,status='1'  
												,company_id='" . $this->arrUser['company_id'] . "' 
												,user_id='" . $this->arrUser['id'] . "'
												,date_added=UNIX_TIMESTAMP (NOW())
												,AddedBy='" . $this->arrUser['id'] . "'
												,AddedOn=UNIX_TIMESTAMP (NOW())";
        if ($arr_attr->volume_3s != NULL) $RS = $this->objsetup->CSI($Sql3);
    }


    function get_sales_promotion_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";

        //$type = (isset($attr['type'])) ? $attr['type'] : 1;
        // $product_id = (isset($attr['product_id'])) ? $attr['product_id'] : 1;
        $response = array();
        $response2 = array();

        if (!empty($attr['keyword'])) 
            $where_clause .= " AND name LIKE '%$attr[keyword]%' ";

        if (!empty($attr['product_id'])) 
            $where_clause .= " AND psp.product_id = '$attr[product_id]' ";
        
        if (!empty($attr['supp_id'])) 
            $where_clause .= " AND psp.sale_id = '$attr[supp_id]' ";

        $page = (isset($attr['page'])) ? $attr['page'] : 1;
        $start_limit = ($page - 1) * 20;
        $end_limit = $page * 20;

        $limit_clause = " LIMIT $start_limit, $end_limit ";
        $order_clause = " ORDER BY ps.id DESC";
        // if (!empty($attr['country_keyword']) && $attr['country_keyword'] != "")       $keyword_clause .= " AND (ar.country LIKE '%$attr[country_keyword]%') ";

        if (empty($attr['all'])) {
            if (empty($attr['start']))
                $attr['start'] = 0;
            if (empty($attr['limit']))
                $attr['limit'] = 10;
        }

        $Sql = "SELECT ps.id,ps.customer_name
		,ps.sale_selling_check,ps.sale_selling_price,ps.discount_value,ps.discount_price
		,ps.start_date,ps.end_date,ps.discount_value,ps.type 
		FROM product_sale_promotion ps   
		WHERE ps.product_id='$attr[product_id]' and ps.status=1 
		 ";  //and ps.end_date >= '".current_date."'	

        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits']) 
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'ps');
        //echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['customers'] = $Row['customer_name'];
                if ($Row['sale_selling_price'] > 0) {
                    $result['Standard Selling Price'] = $Row['sale_selling_price'];
                    $result['discounted_price'] = $Row['discount_price'];
                } else {
                    $result['Standard Selling Price'] = 'NA';
                    $result['discounted_price'] = 'NA';
                }

                $result['type'] = ($Row['type'] == 1) ? "Percentage" : "Value";
                $result['discount'] = ($Row['supplier_type'] == 1) ? $Row['discount_value'] . "%" : $Row['discount_value'];

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


    function add_sales_promotion($arr_attr)
    {
        foreach ($arr_attr as $key => $val) {
            $converted_array[$key] = $val;

            if ($key == "id") {
                $product_id = $val;
            }
        }

        $counter_supplier = 0;
        $counter_purchase = 0;
        if (!empty($arr_attr->id)) {
            $product_id = $arr_attr->id;
        }
        if (!empty($arr_attr->product_id)) {
            $product_id = $arr_attr->product_id;
        }

        //	echo	$counter_supplier=0; print_r($arr_attr);exit;    
        $counter_supplier++;
        $price = 0;

        if ($arr_attr[sale_selling_checks] > 0) 
            $price = $arr_attr[sale_selling_price];

        $customer_price = explode(",", $arr_attr[customer_price2]);
        $customer_ids = explode(",", $arr_attr[sale_name_id2]);

        $customer_name = $arr_attr[sale_name2];

        /* 
								   $Sql = "DELETE FROM product_sale_promotion WHERE id = $sp_id";
									$RS = $this->objsetup->CSI($Sql);
									$Sql = "DELETE FROM product_sale_customer WHERE sale_promotion_id = $sp_id";
									$RS = $this->objsetup->CSI($Sql);
						 */
        //,supplier_unit_cost='".$price."'
        $Sql = "INSERT INTO product_sale_promotion SET  							
									customer_name='" . $customer_name . "'   
									,customer_id='" . $arr_attr[sale_name_id2] . "'   
									,sale_selling_price='" . $price . "' 
									,sale_selling_check='" . $arr_attr[sale_selling_checks] . "' 	
									,type='" . $arr_attr[supplier_types] . "'    
									,discount_value='" . $arr_attr[discount_value] . "'  
									,discount_price='" . $arr_attr[discount_price] . "'  
									,start_date= '" . $this->objGeneral->convert_date($arr_attr[start_date]) . "'
									,end_date=  '" . $this->objGeneral->convert_date($arr_attr[s_end_date]) . "'
									,product_id='" . $product_id . "' 	,status='1'  
									,company_id='" . $this->arrUser['company_id'] . "' 
									,user_id='" . $this->arrUser['id'] . "',
									date_added=UNIX_TIMESTAMP (NOW()) 
									
									,AddedBy='" . $this->arrUser['id'] . "'
									,AddedOn=UNIX_TIMESTAMP (NOW())";
        $RS = $this->objsetup->CSI($Sql);
        //echo 	$Sql;exit;

        $sale_id = $this->Conn->Insert_ID();
        $i = 0;

        $Sql_pro = "INSERT INTO product_sale_customer 	(customer_id, sale_promotion_id, status,customer_price,discount_type,discount_value, discounted_price,  company_id,  date_added,user_id,AddedBy,AddedOn) VALUES ";

        foreach ($customer_ids as $key => $customer_id) {
            if (is_numeric($customer_id)) {
                if ($arr_attr->sale_selling_checks == 0) $price = $customer_price[$i];

                if ($arr_attr->supplier_types == 1)
                    $discounted_price = $price - ($arr_attr->discount_value * $price / 100);
                else if ($arr_attr->supplier_types == 2)
                    $discounted_price = $price - ($arr_attr->discount_value);

                $Sql_pro .= "(  '" . $customer_id . "', '" . $sale_id . "', 1 ,'" . $price . "',  '" . $arr_attr->supplier_types . "', " . "'" . $arr_attr->discount_value . "','" . $discounted_price . "','" . $this->arrUser['company_id'] . "',UNIX_TIMESTAMP (NOW())," . "'" . $this->arrUser['id'] . "' 
," . "'" . $this->arrUser['id'] . "' ,UNIX_TIMESTAMP (NOW()) ), ";
            }
            $i++;
        }
        $Sql_pro = substr_replace(substr($Sql_pro, 0, -1), "", -1);
        // echo $Sql_pro;exit;
        $RS = $this->objsetup->CSI($Sql_pro);


        if ($sale_id > 0) {
            $response['product_id'] = $sale_id;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not Updated!';
            $response['msg'] = "";
        }

        return $response;
    }

    function update_sales_promotion($arr_attr)
    {
        //echo  $this->objGeneral->convert_date($arr_attr->start_date);

        foreach ($arr_attr as $key => $val) {
            $converted_array[$key] = $val;

            if ($key == "id") {
                $product_id = $val;
            }
        }

        $counter_supplier = 0;
        $counter_purchase = 0;
        if (!empty($arr_attr->id)) {
            $product_id = $arr_attr->id;
        }
        if (!empty($arr_attr->product_id)) {
            $product_id = $arr_attr->product_id;
        }

        $sale_id = $arr_attr[sale_promotion_id];

        //print_r($arr_attr);exit; 

        $Sql = "DELETE FROM product_sale_customer WHERE sale_promotion_id = $sale_id";
        $RS = $this->objsetup->CSI($Sql);


        $price = 0;
        if ($arr_attr[sale_selling_checks] > 0) $price = $arr_attr[sale_selling_price];

        $customer_price = explode(",", $arr_attr[customer_price2]);
        $customer_ids = explode(",", $arr_attr[sale_name_id2]);

        $customer_name = $arr_attr[sale_name2];


        $Sql = "UPDATE  product_sale_promotion SET customer_name='" . $customer_name . "'  WHERE id = " . $sale_id . "  Limit 1";
        $RS = $this->objsetup->CSI($Sql);

        $i = 0;
        $Sql_pro = "INSERT INTO product_sale_customer 	(customer_id, sale_promotion_id, status,customer_price,discount_type,discount_value, discounted_price,  company_id,  date_added,user_id,AddedBy,AddedOn) VALUES ";
        foreach ($customer_ids as $key => $customer_id) {
            if (is_numeric($customer_id)) {
                if ($arr_attr->sale_selling_checks == 0) $price = $customer_price[$i];

                if ($arr_attr->supplier_types == 1)
                    $discounted_price = $price - ($arr_attr->discount_value * $price / 100);
                else if ($arr_attr->supplier_types == 2)
                    $discounted_price = $price - ($arr_attr->discount_value);

                $Sql_pro .= "(  '" . $customer_id . "', '" . $sale_id . "', 1 ,'" . $price . "',  '" . $arr_attr->supplier_types . "', " . "'" . $arr_attr->discount_value . "','" . $discounted_price . "','" . $this->arrUser['company_id'] . "',UNIX_TIMESTAMP (NOW())," . "'" . $this->arrUser['id'] . "' 
," . "'" . $this->arrUser['id'] . "' ,UNIX_TIMESTAMP (NOW()) ), ";
            }
            $i++;
        }
        $Sql_pro = substr_replace(substr($Sql_pro, 0, -1), "", -1);
        //echo $Sql_pro;exit;
        $RS = $this->objsetup->CSI($Sql_pro);


        if ($sale_id > 0) {
            $response['product_id'] = $sale_id;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not Updated!';
            $response['msg'] = "";
        }

        return $response;

    }


    function get_customer_sale_list($attr)
    {
        $response2 = array();
        $response = array();

        $Sql = "SELECT customer_id as id,discount_type,discount_value,discounted_price,customer_price
	   FROM product_sale_customer  where sale_promotion_id ='".$attr['id']."' and status=1 ";
        $RS = $this->objsetup->CSI($Sql);
        $selected = array();

        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {
                $selected[] = $Row['id'];

                $result['id'] = $Row['id'];
                $result['discount_type'] = $Row['discount_type'];
                $result['discount_value'] = $Row['discount_value'];
                $result['discounted_price'] = $Row['discounted_price'];
                $result['customer_price'] = $Row['customer_price'];
                $response2['response_selected'][] = $result;
            }
        }
        //	print_r($response2['response_selected']);exit;
        $limit_clause = $where_clause = "";


        $Sql = "SELECT  d.id, d.name, d.contact_person, d.customer_no, d.customer_price, d.type
		, d.address_1, d.city, d.postcode 
		,(SELECT  pl.price_offered FROM customer_item_info   pl where product_id=$attr[product_id] and pl.crm_id=d.id 
		and pl.status =1 Limit 1)as price
		,(SELECT  cs1.title FROM site_constants  cs1
		where cs1.type='SEGMENT' and cs1.id=d.company_type
		Limit 1)as segment
		,(SELECT  cs2.title FROM site_constants  cs2
		where cs2.type='BUYING_GROUP' and cs2.id=d.buying_grp
		Limit 1)as buying_group 
		FROM crm  d
		left  JOIN company on company.id=d.company_id 
		where type in (2,3) and ( d.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	order by d.id DESC";
        $RS = $this->objsetup->CSI($Sql);

        $selected_count = 0;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                $result = array();
                $result['id'] = $Row['id'];
                $result['code'] = 'CUST' . $this->objGeneral->module_item_prefix($Row['customer_no']);

                if ($Row['type'] == 1) $result['code'] = 'CRM' . $this->objGeneral->module_item_prefix($Row['customer_no']);

                $result['name'] = $Row['name'];
                $result['address'] = $Row['address_1'];
                $result['city'] = $Row['city'];
                $result['postcode'] = $Row['postcode'];

                $result['segment'] = $Row['segment'];
                if ($Row['segment'] == '') $result['segment'] = "NA";

                $result['buying_group'] = $Row['buying_group'];
                if ($Row['buying_group'] == '') $result['buying_group'] = "NA";

                if ($attr['price_check'] == 0) $result['price'] = $Row['price'];
                $value_count = 0;

                foreach ($response2['response_selected'] as $key => $m_id) {
                    if ($Row['id'] == $m_id['id']) {
                        $value_count = 1;
                        $selected_count++;

                        $result['checked'] = $value_count;
                        $result['discount_type'] = ($m_id['discount_type'] == 1) ? "Percentage" : "Value";
                        $result['discount_value'] = $m_id['discount_value'];
                        $result['discounted_price'] = $m_id['discounted_price'];
                        //$Row['price'] - $discount_priceone ;
                        if ($m_id['discount_type'] == 1) {
                            $discount_priceone = $m_id['discount_value'] * $m_id['customer_price'] / 100;
                            $discount_price = $m_id['customer_price'] - $discount_priceone;
                            $result['discounted_price'] = $m_id['customer_price'] - $discount_priceone;
                        } else if ($m_id['discount_type'] == 2) {
                            $result['discounted_price'] = $m_id['customer_price'] - $m_id['discount_value'];
                        }
                    }
                }
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }


        $response['selected_count'] = $selected_count;
        $response['discount_type2'] = $m_id['discount_type'];
        $response['discount_value2'] = $m_id['discount_value'];
        $response['discounted_price2'] = $m_id['discounted_price'];
        return $response;
    }

    function get_customer_sale_list_filter($attr)
    {
        $response2 = array();
        $response = array();

        $Sql = "SELECT customer_id as id,discount_type,discount_value,discounted_price,customer_price
	   FROM product_sale_customer  where sale_promotion_id ='".$attr['id']."' and status=1 ";
        $RS = $this->objsetup->CSI($Sql);
        $selected = array();
        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {
                $selected[] = $Row['id'];
                $result['id'] = $Row['id'];
                $result['discount_type'] = $Row['discount_type'];
                $result['discount_value'] = $Row['discount_value'];
                $result['discounted_price'] = $Row['discounted_price'];
                $result['customer_price'] = $Row['customer_price'];
                $response2['response_selected'][] = $result;
            }
        }

        //	print_r($response2['response_selected']);exit;
        $limit_clause = $where_clause = "";


        $Where = "";
        $segment = "";
        $buying = "";
        $searchKeyword = trim($attr['searchKeyword']);
        //previus
        /*$filter_1 =	$attr[cat_ids];//$attr[select_1s]; 
		
		if($filter_1==1)	 $segment = "AND sc1.name LIKE  '%$searchKeyword%' ";
		else if($filter_1==2)	 $buying = "AND sc2.name LIKE '%$searchKeyword%' ";
		
		if($attr[cat_ids]=='address') $attr[cat_ids]='address_1';
		$filter_2 =	$attr[cat_ids];
		if($filter_2 != "") $Where .= " AND   d.$filter_2 LIKE '%$searchKeyword%' ";
		*/

        $filter = $attr['cat_ids'];

        if ($filter == 'customer_no') {

            $searchKeyword = filter_var($attr['searchKeyword'], FILTER_SANITIZE_NUMBER_INT);
            $searchKeyword = ltrim($searchKeyword, '0');
        }

        if ($attr['cat_ids'] != "") $Where .= " AND   d.$filter LIKE '%$searchKeyword%' ";

        if (empty($attr['type'])) $attr['type'] = 3;

        $Sql = "SELECT  d.id, d.name, d.contact_person, d.customer_no, d.customer_price, d.type, d.address_1, d.city, d.postcode 
		,(SELECT  pl.price_offered FROM customer_item_info   pl where product_id=$attr[product_id] and pl.crm_id=d.id 
		and pl.status =1 Limit 1)as price
		,(SELECT  sc1.title FROM site_constants  sc1	  where sc1.type='SEGMENT'  $segment
		and sc1.id=d.company_type Limit 1)as segment
		,(SELECT  sc2.title FROM site_constants sc2 where sc2.type='BUYING_GROUP'  $buying
		and sc2.id=d.buying_grp	Limit 1)as buying_group
		FROM crm  d
		left  JOIN company on company.id=d.company_id 
		where type in (2,3) and 
		( d.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
		$Where	order by d.id DESC";

        $RS = $this->objsetup->CSI($Sql);


        $selected_count = 0;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();

                $result['id'] = $Row['id'];
                if ($Row['type'] == 1) $result['code'] = 'CRM' . $this->objGeneral->module_item_prefix($Row['customer_no']);
                else $result['code'] = 'CUST' . $this->objGeneral->module_item_prefix($Row['customer_no']);

                $result['name'] = $Row['name'];
                $result['address'] = $Row['address_1'];
                $result['city'] = $Row['city'];
                $result['postcode'] = $Row['postcode'];


                if ($attr['type'] == 3) {
                    $result['segment'] = $Row['segment'];
                    $result['buying_group'] = $Row['buying_group'];
                } elseif ($attr['type'] == 1) $result['segment'] = $Row['segment'];
                elseif ($attr['type'] == 2) $result['buying_group'] = $Row['buying_group'];

                if ($attr['price_check'] == 0) $result['price'] = $Row['price'];

                $value_count = 0;
                if ($attr[get_id] > 0) {
                    //$result['discounted_price'] = '';

                    foreach ($response2['response_selected'] as $key => $m_id) {

                        if ($Row['id'] == $m_id['id']) {
                            $value_count = 1;
                            $selected_count++;

                            $result['checked'] = $value_count;
                            $result['discount_type'] = ($m_id['discount_type'] == 1) ? "Percentage" : "Value";
                            $result['discount_value'] = $m_id['discount_value'];
                            $result['discounted_price'] = $m_id['discounted_price'];


                            if ($m_id['discount_type'] == 1) {
                                $discount_priceone = $m_id['discount_value'] * $m_id['customer_price'] / 100;
                                $result['discounted2'] = $m_id['customer_price'] - $discount_priceone;
                                //$result['discounted_price'] =  $m_id['customer_price'] -  $discount_priceone ;

                            } else if ($m_id['discount_type'] == 2) {
                                $result['discounted2'] = round($m_id['customer_price'] - $m_id['discount_value'], 2);
                                //	$result['discounted_price'] =   $m_id['customer_price']  - $m_id['discount_value'];

                            }
                        }
                    }
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


    function get_product_standard_volume_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";

        //$type = (isset($attr['type'])) ? $attr['type'] : 1;
        // $product_id = (isset($attr['product_id'])) ? $attr['product_id'] : 1;
        $response = array();
        $response2 = array();


        if (!empty($attr['product_id'])) $where_clause .= " AND pv.product_id = '$attr[product_id]' ";
        if (!empty($attr['supp_id'])) $where_clause .= " AND pv.sale_id = '$attr[supp_id]' ";


        $page = (isset($attr['page'])) ? $attr['page'] : 1;
        $start_limit = ($page - 1) * 20;
        $end_limit = $page * 20;

        $limit_clause = " LIMIT $start_limit, $end_limit ";
        $order_clause = " ORDER BY pv.id DESC";
        // if (!empty($attr['country_keyword']) && $attr['country_keyword'] != "")       $keyword_clause .= " AND (ar.country LIKE '%$attr[country_keyword]%') ";

        if (empty($attr['all'])) {
            if (empty($attr['start']))
                $attr['start'] = 0;
            if (empty($attr['limit']))
                $attr['limit'] = 10;
        }

        //units_of_measure_volume
        $Sql2 = "SELECT p.*,
		( SELECT s.title FROM units_of_measure s  
		where s.id =p.unit_category and s.status=1 ) as cat_name
		FROM units_of_measure_volume p
		WHERE   p.status=1  ";
        /*	( SELECT wh.title  FROM units_of_measure_setup st 
		Left JOIN units_of_measure as wh ON wh.id = st.cat_id
		where st.id =p.unit_category ) as cat_name 
		*/

        //    AND p.type='".$attr['type']."'  AND p.category= 1 AND p.status=1 AND p.item_id='$attr[item_id]' "; 
        $RS2 = $this->objsetup->CSI($Sql2);
        if ($RS2->RecordCount() > 0) {
            while ($Row = $RS2->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['type'] = $Row['type'];
                $result['name'] = $Row['quantity_from'] . '-' . $Row['quantity_to'] . ' ' . $Row['cat_name'];
                $response2['response_volume'][] = $result;
            }
        }


        $Sql = "SELECT  pv.*
		FROM product_volume_discount   pv
		Left  JOIN company on company.id=pv.company_id 
		where   pv.status=1 
		and ( pv.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	
		$where_clause
		";

        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits']) $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'pv');
        //echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                $result = array();
                $result['id'] = $Row['id'];
                $result['sr'] = $Row['volume_type'];
                foreach ($response2['response_volume'] as $key => $m_id) {
                    if ($Row['volume_id'] == $m_id['id'])
                        $result['volume'] = $m_id['name'];
                }
                $result['price'] = $Row['purchase_price'];
                $result['type'] = ($Row['supplier_type'] == 1) ? 'Percentage' : 'Value';
                $result['currency_sign'] = ($Row['supplier_type'] == 1) ? 1 : 2;
                $result['discount'] = $Row['discount_price'];
                $result['discounted_price'] = $Row['discount_value'];
                $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);


                /*if (!empty($attr['product_id']))	{
					
					$result['purchase_price'] = $Row['purchase_price']; 
					$result['discount_value'] = $Row['discount_value'];
					$result['supplier_type'] = $Row['supplier_type'];
					
					$result['volume_id'] = $Row['volume_id'];
					
					
//					$result['volume_1'] = $Row['volume_1'];
//					$result['volume_2'] = $Row['volume_2'];
//					$result['volume_3'] = $Row['volume_3'];
//					$result['start_date_1'] = $Row['start_date_1'];
//                	$result['end_date_1'] = $Row['end_date_1'];
//					$result['start_date_2'] = $Row['start_date_2'];
//                	$result['end_date_2'] = $Row['end_date_2'];
//					$result['start_date_3'] = $Row['start_date_3'];
//                	$result['end_date_3'] = $Row['end_date_3'];
				
 
				}
               */

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }

        return $response;
    }

    function add_product_standard_volume_list_id($arr_attr)
    {

        foreach ($arr_attr as $key => $val) {
            $converted_array[$key] = $val;

            if ($key == "id") {
                $product_id = $val;
            }
        }

        $counter_supplier = 0;
        $counter_purchase = 0;
        if (!empty($arr_attr->id)) {
            $product_id = $arr_attr->id;
        }
        if (!empty($arr_attr->product_id)) {
            $product_id = $arr_attr->product_id;
        }
        $new = 'Edit';
        $new_msg = 'Updated';
        $sp_id = $arr_attr['sp_id'];


        $response = array();
        $response2 = array();
        $total = 0;


        $sql_volume = " SELECT  ef.id,ef.start_date,ef.volume_id,ef.end_date,ef.product_id
		                FROM product_volume_discount ef
                        WHERE ef.status=1  and  ef.product_id='" . $product_id . "' and ef.company_id=" . $this->arrUser['company_id'] . " ";

        $rs_volume = $this->objsetup->CSI($sql_volume);
        //echo $sql_volume;exit;
        if ($rs_volume->RecordCount() > 0) {
            $result = array();
            while ($Row = $rs_volume->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['volume_id'] = $Row['volume_id'];
                $result['product_id'] = $Row['product_id'];
                $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);

                $response2['response_volume'][] = $result;
            }
        }
        //print_r($response2['response_volume'] );

        $sql_total = "SELECT p.id,p.quantity_from,p.quantity_to,( SELECT s.title FROM units_of_measure s  where s.id =p.unit_category and s.status=1 ) as cat_name
                      FROM units_of_measure_volume p
                      WHERE    p.status=1   AND p.product_id = ".$product_id." and
                        ('" . $arr_attr['volume_id']->quantity_from . "' BETWEEN p.quantity_from AND p.quantity_to  OR  '" . $arr_attr['volume_id']->quantity_to . "'  BETWEEN p.quantity_from AND p.quantity_to )";
        //echo $sql_total;exit;
        $rs_count = $this->objsetup->CSI($sql_total);

        $from = $this->objGeneral->convert_date($arr_attr['start_date']);
        $to = $this->objGeneral->convert_date($arr_attr['end_date']);
        //strtotime($arr_attr['start_date']);	
        //$from = strtotime($arr_attr['start_date1']);

        if ($rs_count->RecordCount() > 0) {
            while ($Row = $rs_count->FetchRow()) {


                foreach ($response2['response_volume'] as $key => $value) {

                    if ($value['volume_id'] == $Row['id']) {
                        /*	 echo $from; echo '<br>';
							 echo $arr_attr['start_date1']; 
							 echo '<br>';
							 echo	gmdate("d-m-Y", $value['start_date']) ;
							 echo '<br>';
							 echo	gmdate("d-m-Y", $value['end_date']) ;
							echo $value['end_date'];
						*/
                        if ((($from >= $value['start_date']) && ($from <= $value['end_date'])
                            || (($to >= $value['start_date']) && ($to <= $value['end_date'])))
                        ) /* if( (  ( $from > $this->objGeneral->convert_date(gmdate("d-m-Y", $value['start_date'])) ) 
						&& ( $from < $this->objGeneral->convert_date(gmdate("d-m-Y", $value['end_date']) ) ) 
						)	||	( ( $to > $this->objGeneral->convert_date(gmdate("d-m-Yd", $value['start_date'])) )  	
						&& ( $to < $this->objGeneral->convert_date(gmdate("d-m-Y", $value['end_date']) )) )   )  
						*/ {
                            //($value['product_id'] != $product_id) && 
                            if (($value['id'] != $sp_id))
                                $total++;
                        }
                    }
                }
            }
        }

        //echo $total;
        // echo $sp_id;exit;

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        } else {

            if ($sp_id == 0) {

                $sql_total = "SELECT  count(id) as total
                              FROM product_volume_discount
                              WHERE status= 1  AND volume_id= '" . $arr_attr['volume_id']->id . "'	and product_id='" . $arr_attr['product_id'] . "' and
                                    ('" . $from . "' BETWEEN start_date AND end_date OR 	'" . $to . "' BETWEEN start_date AND end_date )";

                $rs_count = $this->objsetup->CSI($sql_total);
                $total = $rs_count->fields['total'];
                //echo $sql_total;exit;

                if ($total > 0) {
                    $response['ack'] = 0;
                    $response['error'] = 'Record Already Exists.';
                    return $response;
                    exit;
                } else {


                    $nubmer = 0;
                    $Sql1 = "INSERT INTO product_volume_discount
                                         SET
                                            product_id='$arr_attr[product_id]',
                                            volume_id= '" . $arr_attr['volume_id']->id . "',
                                            supplier_type='" . $arr_attr['supplier_type']->id . "',
                                            volume_type='" . $nubmer . "',
                                            purchase_price='$arr_attr[purchase_price]',
                                            discount_value='$arr_attr[discount_value]',
                                            discount_price='$arr_attr[discount_price]',
                                            sale_volume_item_gl_code='" . $arr_attr['sale_volume_item_gl_code'] . "',
                                            sale_volume_item_gl_id='" . $arr_attr['sale_volume_item_gl_id'] . "',
                                            start_date= '" . $from . "',
                                            end_date= '" . $to . "',
                                            company_id=" . $this->arrUser['company_id'] . ",
                                            date_added=UNIX_TIMESTAMP (NOW()),
                                            user_id=" . "'" . $this->arrUser['id'] . "',
                                            status= 1,
                                            AddedBy='" . $this->arrUser['id'] . "',
                                            AddedOn=UNIX_TIMESTAMP (NOW())";
                    // print_r($response);echo $Sql;exit;
                    //$response =$this->objGeneral->run_query_exception($Sql);

                    //	return $response;
                    $new = 'Add';
                    $new_msg = 'Inserted';
                }

            } else {

                $Sql1 = "UPDATE product_volume_discount
                                  SET
                                     volume_id= '" . $arr_attr['volume_id']->id . "',
                                     supplier_type='" . $arr_attr['supplier_type']->id . "',
                                     purchase_price='$arr_attr[purchase_price]',
                                     discount_value='$arr_attr[discount_value]',
                                     discount_price='$arr_attr[discount_price]',
                                     sale_volume_item_gl_code='" . $arr_attr['sale_volume_item_gl_code'] . "',
                                     sale_volume_item_gl_id='" . $arr_attr['sale_volume_item_gl_id'] . "',
                                     start_date= '" . $from . "',
                                     end_date= '" . $to . "'

                                    WHERE id = " . $sp_id . "   Limit 1";

            }
            // echo $Sql1;exit;

            $RS = $this->objsetup->CSI($Sql1);
        }


        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['msg'] = $new_msg;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['msg'] = 'Record not Updated.';
            $response['error'] = 'Record not Updated.';
        }

        return $response;
    }


    function get_purchase_list_product_id($attr)
    {

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";

        //$type = (isset($attr['type'])) ? $attr['type'] : 1;
        // $product_id = (isset($attr['product_id'])) ? $attr['product_id'] : 1;
        $response = array();
        $response2 = array();

        if (!empty($attr['keyword'])) 
            $where_clause .= " AND name LIKE '%".$attr['keyword']."%' ";

        if (!empty($attr['product_id'])) 
            $where_clause .= " AND psp.product_id = '".$attr['product_id']."' ";

        if (!empty($attr['supp_id'])) 
            $where_clause .= " AND psp.sale_id = '".$attr['supp_id']."' ";


        $page = (isset($attr['page'])) ? $attr['page'] : 1;
        $start_limit = ($page - 1) * 20;
        $end_limit = $page * 20;

        $limit_clause = " LIMIT ".$start_limit.", ".$end_limit." ";
        $order_clause = " ORDER BY product_purchaser.id DESC";
        // if (!empty($attr['country_keyword']) && $attr['country_keyword'] != "")       $keyword_clause .= " AND (ar.country LIKE '%$attr[country_keyword]%') ";

        if (empty($attr['all'])) {
            if (empty($attr['start']))
                $attr['start'] = 0;
            if (empty($attr['limit']))
                $attr['limit'] = 10;
        }

        $Sql = "SELECT product_purchaser.id,product_purchaser.discount_value,product_purchaser.purchase_type,product_purchaser.purchase_price,product_purchaser.discount_price,                 product_purchaser.volume_name
                FROM product_purchaser
                where product_purchaser.product_id='".$attr['product_id']."' and product_purchaser.status=1 
                and  product_purchaser.company_id=" . $this->arrUser['company_id'] . " ";


        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits']) $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'product_purchaser');
        //echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];

                $result['Volume'] = $Row['volume_name'];
                $result['Standard Unit Price '] = $Row['purchase_price'];
                $result['discount_type'] = 'Value';
                if ($Row['purchase_type'] == 1) $result['discount_type'] = 'Percentage';
                $result['Discount'] = ($Row['purchase_type'] == 1) ? $Row['discount_value'] . "%" : $Row['discount_value'];
                $result[' Discounted Price'] = $Row['discount_price'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }

        return $response;
    }

    function update_product_rep($arr_attr)
    {
        //echo  $this->objGeneral->convert_date($arr_attr->start_date);

        foreach ($arr_attr as $key => $val) {
            $converted_array[$key] = $val;

            if ($key == "id") {
                $product_id = $val;
            }
        }

        $counter_supplier = 0;
        $counter_purchase = 0;
        if (!empty($arr_attr->id)) {
            $product_id = $arr_attr->id;
        }
        if (!empty($arr_attr->product_id)) {
            $product_id = $arr_attr->product_id;
        }

        $new = 'Add';
        $new_msg = 'Updated';


        if ($arr_attr->tab_id_2 == 5) {

            $tab_change = 'tab_purchaser';
            $pr_id = $arr_attr->pr_id;
            if ($pr_id == 0) {

                $Sql1 = "INSERT INTO product_purchaser SET  
											 volume_id='" . $arr_attr->volume_1_purchases . "' 
											  , volume_name='" . $arr_attr->volume_1_purchase->name . "'   
											  ,volume_1=1 
											,purchase_type='" . $arr_attr->purchase_type_1s . "'  
											,discount_value='" . $arr_attr->p_discount_value_1 . "' 
											 ,purchase_price='" . $arr_attr->p_price_1 . "'  
											 ,discount_price='" . $arr_attr->discount_p_1 . "' 
											,p_start_date=  '" . $this->objGeneral->convert_date($arr_attr->p_start_date) . "'
											,p_end_date=     '" . $this->objGeneral->convert_date($arr_attr->p_end_date) . "'
											,product_id='" . $product_id . "' 
											,status='1'  
											,company_id='" . $this->arrUser['company_id'] . "' 
											,user_id='" . $this->arrUser['id'] . "'
											,date_added=UNIX_TIMESTAMP (NOW())";
                if ($arr_attr->volume_1_purchases != NULL) $RS = $this->objsetup->CSI($Sql1);


                $Sql2 = "INSERT INTO product_purchaser SET  
											 volume_id='" . $arr_attr->volume_2_purchases . "'  
											  , volume_name='" . $arr_attr->volume_2_purchase->name . "'   
											  ,volume_2=2
											,purchase_type='" . $arr_attr->purchase_type_2s . "' 
											,discount_value='" . $arr_attr->p_discount_value_2 . "' 
											 ,purchase_price='" . $arr_attr->p_price_2 . "'  
											 ,discount_price='" . $arr_attr->discount_p_2 . "' 
											,p_start_date=   '" . $this->objGeneral->convert_date($arr_attr->p_start_date) . "'
											,p_end_date=   '" . $this->objGeneral->convert_date($arr_attr->p_end_date) . "'
											,product_id='" . $product_id . "' 	,status='1'  
											,company_id='" . $this->arrUser['company_id'] . "' 
											,user_id='" . $this->arrUser['id'] . "'
											,date_added=UNIX_TIMESTAMP (NOW())";
                if ($arr_attr->volume_2_purchases != NULL) $RS = $this->objsetup->CSI($Sql2);

                $Sql3 = "INSERT INTO product_purchaser SET  
											 volume_id='" . $arr_attr->volume_3_purchases . "' 
											  , volume_name='" . $arr_attr->volume_3_purchase->name . "'   
											   ,volume_3=3 
											,purchase_type='" . $arr_attr->purchase_type_3s . "' 
											,discount_value='" . $arr_attr->p_discount_value_3 . "' 
											 ,purchase_price='" . $arr_attr->p_price_3 . "'  
											 ,discount_price='" . $arr_attr->discount_p_3 . "' 
											 ,p_start_date=  '" . $this->objGeneral->convert_date($arr_attr->p_start_date) . "'
											,p_end_date=  '" . $this->objGeneral->convert_date($arr_attr->p_end_date) . "'
											,product_id='" . $product_id . "' 	,status='1'  
											,company_id='" . $this->arrUser['company_id'] . "' 
											,user_id='" . $this->arrUser['id'] . "'
											,date_added=UNIX_TIMESTAMP (NOW())";
                if ($arr_attr->volume_3_purchases != NULL) $RS = $this->objsetup->CSI($Sql3);

                $new = 'Add';
                $new_msg = 'Inserted';

            } else {
                $Sql = "UPDATE product_purchaser SET   
									purchase_price='" . $arr_attr->purchase_price_11 . "'  
									,discount_value='" . $arr_attr->discount_value_11 . "'
									,discount_price='" . $arr_attr->discount_price_11 . "'  
									,purchase_type='" . $arr_attr->purchase_types . "'   
									WHERE id = " . $pr_id . "   Limit 1";
                $RS = $this->objsetup->CSI($Sql);
            }
        }

        //echo $Sql;exit;

        $message = "Record  $new_msg  ";

        if ($product_id > 0) {
            $response['product_id'] = $product_id;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['msg'] = $message;
            $response['info'] = $new;
            $response['tab_change'] = $tab_change;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not Updated!';
            $response['msg'] = $message;
        }

        return $response;
    }

    function get_customer_supplier_list($attr)
    {
        $response2 = array();
        $response = array();

        $type = (isset($attr['type'])) ? $attr['type'] : '';

        if ($type == 1) {
            $limit_clause = $where_clause = "";

            $Sql = "SELECT  d.id, 
                            d.name, 
                            d.contact_person, d.customer_no, d.customer_price, d.type, d.currency_id
                                , d.address_1, d.city, d.postcode 
                                ,(SELECT  volume_1_price FROM crm_price_offer_listing  where product_id=$attr[product_id] and crm_id=d.id Limit 1)as price
                                ,(SELECT  cs1.title FROM site_constants  cs1
                                where cs1.type='SEGMENT' and cs1.id=d.company_type
                                Limit 1)as segment
                                ,(SELECT  cs2.title FROM site_constants  cs2
                                where cs2.type='BUYING_GROUP' and cs2.id=d.buying_grp
                                Limit 1)as buying_group 
                                FROM crm  d
                                left  JOIN company on company.id=d.company_id 
                                where type in (2,3) and ( d.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	order by d.id DESC";
                            //echo	$Sql;exit;

            $RS = $this->objsetup->CSI($Sql);


            $selected_count = 0;


            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {

                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['code'] = 'CUST' . $this->objGeneral->module_item_prefix($Row['customer_no']);
                    if ($Row['type'] == 1)
                        $result['code'] = 'CRM' . $this->objGeneral->module_item_prefix($Row['customer_no']);

                    $result['name'] = $Row['name'];
                    $result['city'] = $Row['city'];
                    $result['postcode'] = $Row['postcode'];
                    $result['address'] = $Row['address_1'];
                    $result['currency_id'] = $Row['currency_id'];

                    $response['response'][] = $result;
                }
                $response['ack'] = 1;
                $response['error'] = NULL;
            } else {
                $response['response'][] = array();
            }
        } else if ($type == 2) {


            $limit_clause = $where_clause = "";

            if (!empty($attr['searchKeyword'])) {
                $val = intval(preg_replace("/[^0-9]/", '', $attr['searchKeyword']));

                if ($val != 0) 
                    $where_clause .= " AND  c.supplier_code LIKE '%".$val."%'  ";
                else 
                    $where_clause .= "   AND c.name LIKE '%".$attr['searchKeyword']."%'";
            }


            if (!empty($attr['segments'])) $where_clause .= "   AND c.segment_id =$attr[segments] ";
            if (!empty($attr['country_types'])) $where_clause .= "  AND c.country_id =$attr[country_types] ";


            $response = array();

            $Sql = "SELECT  c.*,c.name as cuname,sf.account_payable_number,sf.purchase_code_number
		,sf.payment_terms_id,sf.payment_method_id, " . $this->objGeneral->get_nested_query_list('srm_segment', $this->arrUser['company_id']) . "
		, " . $this->objGeneral->get_nested_query_list('country', $this->arrUser['company_id']) . "

		FROM srm  c
		left  JOIN company on company.id=c.company_id
		left  JOIN srm_finance sf on sf.supplier_id=c.id
		left  JOIN country cu on cu.id=c.country_id
		where  c.name <> '' AND  c.type in (2,3) AND ( c.company_id=" . $this->arrUser['company_id'] . "
		or  company.parent_id=" . $this->arrUser['company_id'] . ")
		" . $where_clause . "
		group by c.id DESC";


            //d.status=7 and
            //echo $Sql;exit;

            //defualt Variable
            $total_limit = pagination_limit;
            
        if (isset($attr['pagination_limits']) && $attr['pagination_limits']) $total_limit = $attr['pagination_limits'];

            $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c');
            //echo $response['q'];exit;
            $RS = $this->objsetup->CSI($response['q']);
            $response['q'] = '';


            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['id'];
                    // $result['code'] = 'SUP' . $this->objGeneral->module_item_prefix($Row['customer_no']);

                    $result['code'] = $Row['supplier_code'];

                    $result['name'] = $Row['name'];
                    $result['city'] = $Row['city'];
                    $result['postcode'] = $Row['postcode'];
                    $result['address'] = $Row['address_1'];
                    $result['currency_id'] = $Row['currency_id'];
                    $result['country_name'] = ucwords($Row['country_name']);
                    $response['response'][] = $result;
                }
                $response['ack'] = 1;
                $response['error'] = NULL;
                //$response['total'] = $total;
            } else {
                $response['response'][] = array();
            }
        }

        return $response;
    }

    function get_products($attr)
    {
        global $objFilters;
        $where = self::setCondtionArray($attr[condition]);
        return $objFilters->get_module_listing(29, "product", '', '', '', '', $where);
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

    //puchase order

    function get_item_avg_overall_po($attr)
    {
        $response = array();
        $where_clause = "";

        if (!empty($attr['fsdate'])) {
            $sdate = $attr['fsdate'];
            $edate = $attr['fedate'];
            $sdate = date("d-m-Y", $sdate);
            //  $edate = date("Y-m-d",strtotime("-1 year", strtotime($sdate)));
        }

        if (!empty($attr['sdate']) && (!empty($attr['edate']))) {
            $sdate = $attr['sdate'];
            $edate = $attr['edate'];
        }

        $sdate = $this->objGeneral->convert_date($sdate);
        $edate = $this->objGeneral->convert_date($edate);

        //$this->objGeneral->convert_date(gmdate("d-m-Y", $value['start_date']

        $sql_total = "SELECT  avg(sd.unit_price) as avg	
		              FROM srm_invoice_detail sd
                      WHERE sd.status=1 AND 
                            invoice_type IN(2,3) AND 
                            product_id = '".$attr['product_id']."' AND 
                            ( sd.invoice_order_date  BETWEEN ".$sdate." AND ".$edate." )";

        if (!empty($attr['product_id'])) 
            $where_clause .= " AND product_id = '".$attr['product_id']."' ";

        /*	$sql_total = "SELECT  avg(sd.price_offered) as avg	
			FROM customer_item_info sd WHERE   sd.status=1  	" . $where_clause . "
			";*/
        //echo 	$sql_total;exit;


        $rs_count = $this->objsetup->CSI($sql_total);
        $avg = $rs_count->fields['avg'];

        if ($avg == 0) {
            $response['ack'] = 0;
            // $response['error'] = 'Record not Exit.';
            $response['error'] = 'No Purchase info exists for this item';
        } else {
            $response['ack'] = 1;
            $response['avg'] = round($avg, 2);
            $response['error'] = 'Record  Exit.';
        }
        return $response;
    }

    function get_item_avg_overall_so($attr)
    {
        $response = array();
        $where_clause = "";

        if (!empty($attr['fsdate'])) {
            $sdate = $attr['fsdate'];
            $edate = $attr['fedate'];
            $sdate = date("d-m-Y", $sdate);
        }

        if (!empty($attr['sdate']) && (!empty($attr['edate']))) {
            $sdate = $attr['sdate'];
            $edate = $attr['edate'];
        }

        $sdate = $this->objGeneral->convert_date($sdate);
        $edate = $this->objGeneral->convert_date($edate);

        if (!empty($attr['product_id'])) $where_clause .= " AND product_id = '".$attr['product_id']."' ";

        $sql_total = "SELECT  avg(sd.price_offered) as avg
                      FROM customer_item_info sd 
                      WHERE sd.status=1 " . $where_clause . " ";

        //echo 	$sql_total;exit;
        $rs_count = $this->objsetup->CSI($sql_total);
        $avg = $rs_count->fields['avg'];

        if ($avg == 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record not Exit.';
        } else {
            $response['ack'] = 1;
            $response['avg'] = round($avg, 2);
            $response['error'] = 'Record  Exit.';
        }
        return $response;
    }


    function get_item_avg_purchase_info($attr)
    {
        $response = array();
        $where_clause = "";

        $sdate = $this->objGeneral->convert_date($attr['sdate']);
        $edate = $this->objGeneral->convert_date($attr['edate']);

        if (!empty($attr['product_id'])) $where_clause .= " AND product_id = '".$attr['product_id']."' ";
        if (!empty($attr['supplier_id'])) $where_clause .= " AND supplier_id = '".$attr['supplier_id']."' ";

        if (!empty($attr['sdate'])) $where_clause .= " AND (  ".$sdate." BETWEEN  sd.average_year_start  AND  sd.average_year_end  ) ";
        if (!empty($attr['edate'])) $where_clause .= " AND (  ".$edate." BETWEEN  sd.average_year_start  AND  sd.average_year_end  ) ";

        $sql_total = "SELECT avg(sd.unit_price) as avg	
                      FROM product_supplier sd 
                      WHERE  sd.status=1 " . $where_clause . " ";

        $rs_count = $this->objsetup->CSI($sql_total);
        $avg = $rs_count->fields['avg'];

        if ($avg == 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record not Exit.';
        } else {
            $response['ack'] = 1;
            $response['avg'] = round($avg, 2);
            $response['error'] = 'Record  Exit.';
        }
        return $response;
    }


    ############	 Stock Sheet ##############

    function get_product_stock_sheet($attr)
    { 
        $Sql = "SELECT  prd.id,
                        prd.product_code as code,
                        prd.description,
                        prd.standard_price
                From product  prd  limit 5";
        //echo $Sql; exit;        

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key)) unset($Row[$key]);
                }
                $response['response'][] = $Row;
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

    function stock_sheet($attr)
    {
        $searchKeyword = '';
        $searchKeyword = $attr['searchKeyword'];

        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";

        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.",$attr,$fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.",$attr,$fieldsMeta);

        $where = " tbl.company_id = " . $this->arrUser['company_id'];    
        $response = array();
        $stock_check = 0;
        $rawmaterialproduct = 0;

        if($attr['product_id'] > 0){
            
            $checkStkAlloc = "  SELECT stock_check,rawmaterialproduct
                                FROM product 
                                WHERE id= " . $attr['product_id']. " AND 
                                    company_id = '" . $this->arrUser['company_id'] . "'
                                LIMIT 1"; 

            $RsStkAlloc = $this->objsetup->CSI($checkStkAlloc);
            $stock_check = $RsStkAlloc->fields['stock_check'];
            $rawmaterialproduct = $RsStkAlloc->fields['rawmaterialproduct'];
        }

        $stockChkCondition = '';
        $stockChkCondition2 = '';
        $stockChkConditionSalesCase = '';        

        $rawMaterialPOCond = '';
        $rawMaterialCNCond = '';
        $rawMaterialOpBalncCond = '';
        $rawMaterialItemLedgerPosCond = '';

        if (isset($searchKeyword->exportAsCSV)){

            /* if($rawmaterialproduct>0){
                    $rawMaterialPOCond   = " SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,si.id,1, wa.company_id) AS remaining_qty,
                                             0 AS allocatedQty,
                                            (CASE WHEN (SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,si.id,1, wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,si.id,1, wa.company_id)) 
                                            ELSE 0 END) AS sold_qty,
                                            (IFNULL(wa.quantity,0) - 
                                            (CASE WHEN (SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,si.id,1, wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,si.id,1, wa.company_id)) 
                                        ELSE 0 END)) AS availableQty,"; 

                    $rawMaterialCNCond   = " SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,cn.id,2, wa.company_id) AS remaining_qty,
                                             0 AS allocatedQty,
                                            (CASE WHEN (SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,cn.id,2, wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,cn.id,2, wa.company_id)) 
                                            ELSE 0 END) AS sold_qty,
                                            (IFNULL(wa.quantity,0) - 
                                            (CASE WHEN (SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,cn.id,2, wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,cn.id,2, wa.company_id)) 
                                        ELSE 0 END)) AS availableQty,"; 

                    $rawMaterialOpBalncCond   = " SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,ob.id,3, wa.company_id) AS remaining_qty,
                                             0 AS allocatedQty,
                                            (CASE WHEN (SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,ob.id,3, wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,ob.id,3, wa.company_id)) 
                                            ELSE 0 END) AS sold_qty,
                                            (IFNULL(wa.quantity,0) - 
                                            (CASE WHEN (SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,ob.id,3, wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,ob.id,3, wa.company_id)) 
                                        ELSE 0 END)) AS availableQty,"; 

                    $rawMaterialItemLedgerPosCond   = " SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,si.id,4, wa.company_id) AS remaining_qty,
                                             0 AS allocatedQty,
                                            (CASE WHEN (SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,si.id,4, wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,si.id,4, wa.company_id)) 
                                            ELSE 0 END) AS sold_qty,
                                            (IFNULL(wa.quantity,0) - 
                                            (CASE WHEN (SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,si.id,4, wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,si.id,4, wa.company_id)) 
                                        ELSE 0 END)) AS availableQty,"; 
                                                          
            }else{ */

                if($stock_check>0){

                    $stockChkCondition   = " SR_CheckRemaningStockByWarehouse(wa.item_trace_unique_id, wa.quantity,wa.warehouse_id, wa.company_id) AS remaining_qty,
                                            SR_CheckAllocatedStockByWarehouse(wa.item_trace_unique_id, 0,wa.warehouse_id, wa.company_id) AS allocatedQty,
                                            (CASE WHEN (SR_CheckRemaningStockByWarehouse(wa.item_trace_unique_id, wa.quantity,wa.warehouse_id, wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_CheckRemaningStockByWarehouse(wa.item_trace_unique_id, wa.quantity,wa.warehouse_id, wa.company_id)) 
                                            ELSE 0 END) AS sold_qty,
                                            (IFNULL(wa.quantity,0) - (CASE WHEN (SR_CheckRemaningStockByWarehouse(wa.item_trace_unique_id, wa.quantity,wa.warehouse_id, wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_CheckRemaningStockByWarehouse(wa.item_trace_unique_id, wa.quantity,wa.warehouse_id, wa.company_id)) 
                                        ELSE 0 END) - SR_CheckAllocatedStock(wa.item_trace_unique_id, 0, wa.company_id)) AS availableQty,";
                    
                    $stockChkCondition2  = " IFNULL(wa.quantity,0) AS remaining_qty,
                                            IFNULL(wa.quantity,0) AS allocatedQty, ";
                                            
                    $stockChkConditionSalesCase = " SR_CheckRemaningStockByWarehouse(wa.item_trace_unique_id, wa.quantity,wa.warehouse_id, wa.company_id) AS remaining_qty,SR_CheckAllocatedStockByWarehouse(wa.item_trace_unique_id, wa.sale_order_detail_id,wa.warehouse_id, wa.company_id) AS allocatedQty, ";
                }
                else{
                    $stockChkCondition   = " SR_CheckRemaningStock(wa.item_trace_unique_id, wa.quantity, wa.company_id) AS remaining_qty,
                                            SR_CheckAllocatedStock(wa.item_trace_unique_id, 0, wa.company_id) AS allocatedQty,
                                            (CASE WHEN (SR_CheckRemaningStock(wa.item_trace_unique_id, wa.quantity,wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_CheckRemaningStock(wa.item_trace_unique_id, wa.quantity, wa.company_id)) 
                                            ELSE 0 END) AS sold_qty,
                                            (IFNULL(wa.quantity,0) - (CASE WHEN (SR_CheckRemaningStock(wa.item_trace_unique_id, wa.quantity,wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_CheckRemaningStock(wa.item_trace_unique_id, wa.quantity,wa.company_id)) 
                                        ELSE 0 END) - SR_CheckAllocatedStock(wa.item_trace_unique_id, 0, wa.company_id)) AS availableQty,";
                    
                    $stockChkCondition2  = " IFNULL(wa.quantity,0) AS remaining_qty,
                                            IFNULL(wa.quantity,0) AS allocatedQty, ";                
                    
                    $stockChkConditionSalesCase = " SR_CheckRemaningStock(wa.item_trace_unique_id, wa.quantity, wa.company_id) AS remaining_qty,
                    SR_CheckAllocatedStock(wa.item_trace_unique_id, wa.sale_order_detail_id, wa.company_id) AS allocatedQty, ";
                }
            // }
        }
        else{

            /* if($rawmaterialproduct>0){
                    $rawMaterialPOCond   = " SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,si.id,1, wa.company_id) AS remaining_qty,
                                             0 AS allocatedQty,";  

                    $rawMaterialCNCond   = " SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,cn.id,2, wa.company_id) AS remaining_qty,
                                             0 AS allocatedQty,"; 

                    $rawMaterialOpBalncCond   = " SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,ob.id,3, wa.company_id) AS remaining_qty,
                                             0 AS allocatedQty,";  

                    $rawMaterialItemLedgerPosCond   = " SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,si.id,4, wa.company_id) AS remaining_qty,
                                             0 AS allocatedQty,";                    
            }else{ */

                if($stock_check>0){
                    $stockChkCondition   = " SR_CheckRemaningStockByWarehouse(wa.item_trace_unique_id, wa.quantity,wa.warehouse_id, wa.company_id) AS remaining_qty,
                                            SR_CheckAllocatedStockByWarehouse(wa.item_trace_unique_id, 0,wa.warehouse_id, wa.company_id) AS allocatedQty, ";

                    $stockChkCondition2  = " IFNULL(wa.quantity,0) AS remaining_qty,
                                            IFNULL(wa.quantity,0) AS allocatedQty, ";
                                            //SR_CheckAllocatedStockByWarehouse(wa.item_trace_unique_id, 0,wa.warehouse_id, wa.company_id)
                    
                    $stockChkConditionSalesCase = " SR_CheckRemaningStockByWarehouse(wa.item_trace_unique_id, wa.quantity,wa.warehouse_id, wa.company_id) AS remaining_qty,SR_CheckAllocatedStockByWarehouse(wa.item_trace_unique_id, wa.sale_order_detail_id,wa.warehouse_id, wa.company_id) AS allocatedQty, ";

                }
                else{
                    $stockChkCondition   = " SR_CheckRemaningStock(wa.item_trace_unique_id, wa.quantity, wa.company_id) AS remaining_qty,
                                            SR_CheckAllocatedStock(wa.item_trace_unique_id, 0, wa.company_id) AS allocatedQty, ";

                    $stockChkCondition2  = " IFNULL(wa.quantity,0) AS remaining_qty,
                                            IFNULL(wa.quantity,0) AS allocatedQty, ";
                                            //SR_CheckAllocatedStock(wa.item_trace_unique_id, 0, wa.company_id)
                    
                    $stockChkConditionSalesCase = " SR_CheckRemaningStock(wa.item_trace_unique_id, wa.quantity, wa.company_id) AS remaining_qty,
                    SR_CheckAllocatedStock(wa.item_trace_unique_id, wa.sale_order_detail_id, wa.company_id) AS allocatedQty, ";

                }
            // }
        }

        //  seprate  union  query for results
        // IFNULL((wa.quantity * wa.unit_measure_qty),0) AS qty2,

        /* $SO_Sql = "SELECT   o.sale_order_code AS code, 
                            o.sale_invioce_code AS invoice_code,
                            o.posting_date AS posting_date,
                            o.sell_to_cust_no as user_no,
                            o.sell_to_cust_name AS user_name,
                            'sales' AS doctype2, 
                            (CASE WHEN o.type = 1 THEN 'Sales Order'
                                  WHEN o.type <> 1 THEN 'Sales Invoice'
                                  END) AS docType, 
                            o.type as order_type,
                            '1' AS trailtype,
                            o.dispatch_date as o_dispatch_date,
                            NULL AS receipt_date,
                            wbl.title AS location_name,
                            wa.id AS rec_id,
                            wh.name AS warehousename,  
                            '-' AS consignmentNo, 
                            wa.container_no AS container_no2,
                            wa.unit_measure_name as uom_name,
                            o.id as oid, 
                            IFNULL(wa.quantity,0) as qty2, 
                            $stockChkCondition2
                            wa.id,
                            wa.batch_no,
                            wa.prod_date,
                            wa.use_by_date,
                            wa.date_received,
                            wa.type,
                            wa.order_id,
                            wa.warehouse_id,
                            wa.product_id,
                            wa.sale_status,
                            wa.company_id
                    FROM warehouse_allocation wa
                    LEFT JOIN orders o ON o.id = wa.order_id  
                    LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id  
                    LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                    LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id         
                    WHERE wa.product_id = '" . $attr['product_id'] . "' AND 
                          wa.type = 2 AND 
                          wa.status = 1 AND
                          wa.sale_return_status = 0 AND                          
                          wa.sale_status=1 AND
                          wa.company_id='" . $this->arrUser['company_id'] . "'
                    HAVING allocatedQty > 0 "; //wa.sale_status  IN (2,3) AND */
        
        $CN_Sql =  "SELECT  cn.return_order_code AS code, 
                            cn.return_invoice_code AS invoice_code,
                            cn.posting_date AS posting_date,
                            cn.sell_to_cust_no as user_no,
                            cn.sell_to_cust_name AS user_name,
                            'creditnote' AS doctype2, 
                            (CASE WHEN cn.type = 1 THEN 'Credit Note'
                                  WHEN cn.type <> 1 THEN 'Credit Note Invoice'
                                  END) AS docType, 
                            cn.type as order_type,
                            '2' AS trailtype,
                            NULL AS o_dispatch_date,
                            cn.delivery_date as receipt_date,
                            wbl.title AS location_name,
                            wa.id AS rec_id, 
                            wh.name AS warehousename,  
                            '-' AS consignmentNo, 
                            wa.container_no AS container_no2,
                            wa.unit_measure_name as uom_name,
                            cn.id as oid, 
                            IFNULL((wa.quantity * wa.unit_measure_qty),0) AS qty2,
                            ".$stockChkCondition. $rawMaterialCNCond."
                            wa.id,
                            wa.batch_no,
                            wa.prod_date,
                            wa.use_by_date,
                            cn.delivery_date AS date_received,
                            wa.type,
                            wa.order_id,
                            wa.warehouse_id,
                            wa.product_id,
                            wa.sale_status,
                            wa.company_id
                    FROM warehouse_allocation wa
                    LEFT JOIN return_orders cn ON cn.id = wa.order_id  
                    LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id 
                    LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                    LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id           
                    WHERE wa.product_id = '" . $attr['product_id'] . "' AND 
                          wa.type = 2 AND 
                          wa.status = 1 AND
                          cn.type = 2 AND
                          wa.sale_return_status = 1 AND
                          wa.sale_status IN (2,3) AND
                          wa.company_id='" . $this->arrUser['company_id'] . "'
                    HAVING remaining_qty > 0 AND (SELECT COUNT(id) AS ttl 
                                                    FROM warehouse_allocation AS tbl2 
                                                    WHERE tbl2.product_id = wa.product_id AND 
                                                          tbl2.warehouse_id = wa.warehouse_id AND
                                                          tbl2.company_id = wa.company_id AND
                                                          tbl2.type = 1 AND 
                                                            tbl2.status = 1 AND
                                                            tbl2.purchase_return_status = 0 AND 
                                                            tbl2.purchase_status IN (2,3) AND                          
                                                            tbl2.raw_material_out IS NULL) = 0";
        
        $PO_Sql =  "SELECT  si.order_code AS code,
                            si.invoice_code AS invoice_code,
                            si.invoice_date AS posting_date,
                            si.sell_to_cust_no as user_no,
                            si.sell_to_cust_name AS user_name,
                            'purchase' AS doctype2,
                            (CASE WHEN si.type = 3 THEN 'Purchase Order'
                                  WHEN si.type <> 3 THEN 'Purchase Invoice'
                                  END) AS docType,
                            si.type as order_type,
                            '3' AS trailtype,
                            NULL AS o_dispatch_date,
                            si.receiptDate as receipt_date,
                            wbl.title AS location_name,
                            wa.id AS rec_id, 
                            wh.name AS warehousename, 
                            '-' AS consignmentNo,  
                            wa.container_no AS container_no2,
                            wa.unit_measure_name as uom_name,
                            si.id as oid, 
                            IFNULL((wa.quantity * wa.unit_measure_qty),0) AS qty2,
                            ".$stockChkCondition.$rawMaterialPOCond."
                            wa.id,
                            wa.batch_no,
                            wa.prod_date,
                            wa.use_by_date,
                            wa.date_received,
                            wa.type,
                            wa.order_id,
                            wa.warehouse_id,
                            wa.product_id,
                            wa.sale_status,
                            wa.company_id  
                    FROM warehouse_allocation wa
                    LEFT JOIN srm_invoice si ON si.id=wa.order_id
                    LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id 
                    LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                    LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id                 
                    WHERE wa.product_id = '". $attr['product_id'] ."' AND 
                          wa.type = 1 AND 
                          wa.status = 1 AND
                          wa.purchase_return_status = 0 AND                          
                          wa.raw_material_out IS NULL AND
                          wa.purchase_status IN (2,3) AND
                          wa.company_id='" . $this->arrUser['company_id'] . "'
                    HAVING remaining_qty > 0 ";
        // IFNULL((wa.quantity * wa.unit_measure_qty),0) AS qty2,          
        /* $DN_Sql =  "SELECT  si.debitNoteCode AS code,
                            si.invoice_code AS invoice_code,
                            si.supplierCreditNoteDate AS posting_date,
                            si.supplierNo as user_no,
                            si.supplierName AS user_name,
                            'debitnote' AS doctype2,
                            (CASE WHEN si.type = 3 THEN 'Debit Note'
                                  WHEN si.type <> 3 THEN 'Debit Note Invoice'
                                  END) AS docType,
                            si.type as order_type,
                            '4' AS trailtype,
                            NULL AS o_dispatch_date,
                            si.supplierReceiptDate as receipt_date,
                            wbl.title AS location_name,
                            wa.id AS rec_id, 
                            wh.name AS warehousename,  
                            '-' AS consignmentNo, 
                            wa.container_no AS container_no2, 
                            wa.unit_measure_name as uom_name,
                            si.id as oid,                             
                            IFNULL(wa.quantity,0) as qty2, 
                            $stockChkCondition2
                            wa.id,
                            wa.batch_no,
                            wa.prod_date,
                            wa.use_by_date,
                            wa.date_received,
                            wa.type,
                            wa.order_id,
                            wa.warehouse_id,
                            wa.product_id,
                            wa.sale_status,
                            wa.company_id
                    FROM warehouse_allocation wa
                    LEFT JOIN srm_order_return si ON si.id=wa.order_id 
                    LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id
                    LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                    LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id                 
                    WHERE wa.product_id = '". $attr['product_id'] ."' AND 
                          wa.type = 1 AND 
                          wa.status = 1 AND
                          wa.purchase_return_status = 1 AND
                          wa.purchase_status=1 AND
                          wa.company_id='" . $this->arrUser['company_id'] . "'";//= 2 wa.purchase_status IN(2,3) AND */

        // opening balance sql.
        $opBalnc_Sql =  "SELECT  '-' AS code,
                                '-' AS invoice_code,
                                ob.posting_date AS posting_date,
                                '-' as user_no,
                                '-' AS user_name,
                                'StockOpenBalanc' AS doctype2,
                                'Stock Opening Balances' AS docType, 
                                '-' as order_type,
                                '4' AS trailtype,
                                NULL AS o_dispatch_date,
                                NULL as receipt_date,
                                wbl.title AS location_name,
                                wa.id AS rec_id, 
                                wh.name AS warehousename,
                                ob.comm_book_in_no AS consignmentNo,
                                wa.container_no AS container_no2,   
                                wa.unit_measure_name as uom_name,
                                ob.id as oid, 
                                SUM(ob.qty) AS qty2,
                                $stockChkCondition
                                $rawMaterialOpBalncCond
                                wa.id,
                                wa.batch_no,
                                wa.prod_date,
                                wa.use_by_date,
                                wa.date_received,
                                wa.type,
                                wa.order_id,
                                wa.warehouse_id,
                                wa.product_id,
                                wa.sale_status,
                                wa.company_id 
                        FROM warehouse_allocation wa
                        LEFT JOIN opening_balance_stock ob ON ob.id=wa.opBalncID 
                        LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id
                        LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                        LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id                
                        WHERE wa.product_id = '". $attr['product_id'] ."' AND 
                            wa.type = 4 AND 
                            wa.status = 1 AND
                            wa.company_id='" . $this->arrUser['company_id'] . "'
                        GROUP BY wa.opBalncID
                        HAVING remaining_qty > 0 ";      
        
        // Item Ledger Positive
        $itemLedgerPosSql =  "SELECT  '-' AS code,
                                        si.acc_code AS invoice_code,
                                        ijd.posting_date AS posting_date,
                                        '-' as user_no,
                                        '-' AS user_name,
                                        'itemLedger' AS doctype2,
                                        'Item Ledger In' AS docType,
                                        si.type as order_type,
                                        '1' AS trailtype,
                                        NULL AS o_dispatch_date,
                                        NULL as receipt_date,
                                        wbl.title AS location_name,
                                        wa.id AS rec_id, 
                                        wh.name AS warehousename, 
                                        '-' AS consignmentNo,  
                                        wa.container_no AS container_no2,                                        
                                        ijd.uom_name,
                                        si.id as oid,                            
                                        IFNULL((wa.quantity * wa.unit_measure_qty),0) AS qty2,
                                        $stockChkCondition 
                                        $rawMaterialItemLedgerPosCond
                                        wa.id,
                                        wa.batch_no,
                                        wa.prod_date,
                                        wa.use_by_date,
                                        wa.date_received,
                                        wa.type,
                                        wa.order_id,
                                        wa.warehouse_id,
                                        wa.product_id,
                                        wa.sale_status,
                                        wa.company_id 
                                FROM item_journal_details ijd
                                LEFT JOIN warehouse_allocation wa ON ijd.id=wa.item_journal_detail_id
                                LEFT JOIN gl_journal_receipt si ON si.id=wa.order_id
                                LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id 
                                LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                                LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id               
                                WHERE wa.product_id = '". $attr['product_id'] ."' AND 
                                        wa.type = 3 AND
                                        wa.ledger_type = 1 AND
                                        wa.journal_status = 2 AND
                                        ijd.item_id  = '". $attr['product_id'] ."' AND 
                                        si.type = 2 AND
                                        wa.status = 1 AND 
                                        wa.company_id='" . $this->arrUser['company_id'] . "' AND 
                                        ijd.company_id='" . $this->arrUser['company_id'] . "'
                                HAVING remaining_qty > 0 ";
            
        // Item Ledger Negative
        //wa.unit_measure_name as uom_name,
        //IFNULL((wa.quantity * wa.unit_measure_qty),0) AS qty2, 
        /* $itemLedgerNegSql =  "SELECT  '-' AS code,
                                        si.acc_code AS invoice_code,
                                        ijd.posting_date AS posting_date,
                                        '-' as user_no,
                                        '-' AS user_name,
                                        'itemLedger' AS doctype2,
                                        'Item Ledger Out' AS docType,
                                        si.type as order_type,
                                        '2' AS trailtype,
                                        NULL AS o_dispatch_date,
                                        NULL as receipt_date,
                                        wbl.title AS location_name,
                                        wa.id AS rec_id, 
                                        wh.name AS warehousename, 
                                        '-' AS consignmentNo,  
                                        wa.container_no AS container_no2,                                        
                                        ijd.uom_name,
                                        si.id as oid,                                                           
                                        IFNULL(wa.quantity,0) as qty2, 
                                        $stockChkCondition2
                                        wa.id,
                                        wa.batch_no,
                                        wa.prod_date,
                                        wa.use_by_date,
                                        wa.date_received,
                                        wa.type,
                                        wa.order_id,
                                        wa.warehouse_id,
                                        wa.product_id,
                                        wa.sale_status,
                                        wa.company_id 
                                FROM item_journal_details ijd
                                LEFT JOIN warehouse_allocation wa ON ijd.id=wa.item_journal_detail_id
                                LEFT JOIN gl_journal_receipt si ON si.id=wa.order_id
                                LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id 
                                LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                                LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id             
                                WHERE wa.product_id = '". $attr['product_id'] ."' AND 
                                    wa.type = 3 AND
                                    wa.ledger_type = 2 AND
                                    wa.journal_status = 1 AND
                                    ijd.item_id  = '". $attr['product_id'] ."' AND 
                                    si.type = 2 AND
                                    wa.status = 1 AND 
                                    wa.company_id='" . $this->arrUser['company_id'] . "' AND 
                                    ijd.company_id='" . $this->arrUser['company_id'] . "'";//wa.journal_status = 2 AND */

        // Stock Transfer Positive
        $stockTransferPosSql =  "SELECT si.code AS code,
                                        '-' AS invoice_code,
                                        si.order_date AS posting_date,
                                        '-' as user_no,
                                        '-' AS user_name,
                                        'stockTransfer' AS doctype2,
                                        'Stock Transfer In' AS docType,
                                        si.type as order_type,
                                        '1' AS trailtype,
                                        NULL AS o_dispatch_date,
                                        NULL as receipt_date,
                                        wbl.title AS location_name,
                                        wa.id AS rec_id, 
                                        wh.name AS warehousename, 
                                        wa.container_no AS consignmentNo, 
                                        wa.container_no AS container_no2,                                       
                                        wa.unit_measure_name AS uom_name,
                                        si.id as oid,                            
                                        IFNULL(wa.quantity,0) AS qty2,  
                                        $stockChkCondition
                                        wa.id,
                                        wa.batch_no,
                                        wa.prod_date,
                                        wa.use_by_date,
                                        wa.date_received,
                                        wa.type,
                                        wa.order_id,
                                        wa.warehouse_id,
                                        wa.product_id,
                                        wa.sale_status,
                                        wa.company_id 
                                FROM transfer_orders_details ijd 
                                LEFT JOIN warehouse_allocation wa ON ijd.id=wa.transfer_order_detail_id
                                LEFT JOIN transfer_orders si ON si.id = wa.order_id
                                LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id  
                                LEFT JOIN product_warehouse_location pwl ON pwl.id = wa.location   
                                LEFT JOIN warehouse_bin_location wbl ON wbl.id = pwl.warehouse_loc_id                
                                WHERE wa.product_id = '". $attr['product_id'] ."' AND 
                                    wa.type = 5 AND
                                    wa.ledger_type = 1 AND
                                    wa.journal_status = 2 AND
                                    si.type = 1 AND
                                    wa.status = 1 AND 
                                    ijd.item_id  = '". $attr['product_id'] ."' AND 
                                    wa.company_id='" . $this->arrUser['company_id'] . "' AND 
                                    ijd.company_id='" . $this->arrUser['company_id'] . "'
                                HAVING remaining_qty > 0 ";
        /*  
        // Stock Transfer Negative
        $stockTransferNegSql =  "SELECT si.code AS code,
                                        '-' AS invoice_code,
                                        si.order_date AS posting_date,
                                        '-' as user_no,
                                        '-' AS user_name,
                                        'stockTransfer' AS doctype2,
                                        'Stock Transfer Out' AS docType,
                                        si.type as order_type,
                                        '2' AS trailtype,
                                        NULL AS o_dispatch_date,
                                        NULL as receipt_date,
                                        wbl.title AS location_name,
                                        wa.id AS rec_id, 
                                        wh.name AS warehousename, 
                                        wa.container_no AS consignmentNo,  
                                        wa.container_no AS container_no2,                                      
                                        wa.unit_measure_name as uom_name,
                                        si.id as oid,                            
                                        IFNULL(wa.quantity,0)*(-1) AS qty2,
                                        $stockChkCondition
                                        wa.id,
                                        wa.batch_no,
                                        wa.prod_date,
                                        wa.use_by_date,
                                        wa.date_received,
                                        wa.type,
                                        wa.order_id,
                                        wa.warehouse_id,
                                        wa.product_id,
                                        wa.sale_status,
                                        wa.company_id  
                                FROM transfer_orders_details ijd
                                LEFT JOIN  warehouse_allocation wa ON ijd.id = wa.transfer_order_detail_id
                                LEFT JOIN transfer_orders si ON si.id=wa.order_id
                                LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id 
                                LEFT JOIN product_warehouse_location pwl ON pwl.id = wa.location   
                                LEFT JOIN warehouse_bin_location wbl ON wbl.id = pwl.warehouse_loc_id              
                                WHERE wa.product_id = '". $attr['product_id'] ."' AND 
                                    wa.type = 5 AND
                                    wa.ledger_type = 2 AND
                                    wa.journal_status = 1 AND
                                    si.type = 1 AND
                                    wa.status = 1 AND 
                                    ijd.item_id  = '". $attr['product_id'] ."' AND 
                                    wa.company_id='" . $this->arrUser['company_id'] . "' AND 
                                    ijd.company_id='" . $this->arrUser['company_id'] . "'"; //wa.journal_status = 2 AND */

        $sub_sql = "";         

        if(isset($attr['type']) && $attr['type']>0)
        {
            if($attr['type'] == 1)
            {
                if(isset($attr['only_po']))
                    $sub_sql = $PO_Sql;
                else
                    $sub_sql = $PO_Sql." UNION ".$CN_Sql." UNION ".$opBalnc_Sql." UNION ".$itemLedgerPosSql." UNION ".$stockTransferPosSql;
            }
            else if($attr['type'] == 2)
            {
                if(isset($attr['only_so']))
                    $sub_sql = $SO_Sql;
                else
                    $sub_sql = $SO_Sql." UNION ".$DN_Sql." UNION ".$itemLedgerNegSql." UNION ".$stockTransferNegSql;
            }
        }
        else {
            // $sub_sql = $PO_Sql." UNION ".$CN_Sql." UNION ".$opBalnc_Sql." UNION ".$SO_Sql." UNION ".$DN_Sql." UNION ".$itemLedgerPosSql." UNION ".$itemLedgerNegSql." UNION ".$stockTransferPosSql." UNION ".$stockTransferNegSql;

            $sub_sql = $PO_Sql." UNION ".$CN_Sql." UNION ".$opBalnc_Sql." UNION ".$itemLedgerPosSql." UNION ".$stockTransferPosSql;
        }

        // $Sql = $sub_sql." ORDER BY rec_id";
        // echo $Sql;exit;

        $Sql = "SELECT * FROM (".$sub_sql.") AS tbl WHERE 1 and ".$where.$where_clause." ";
        // echo $Sql;exit;

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        
        if ($order_clause == "")
            $order_type = " Order BY tbl.rec_id ASC ";
        else
            $order_type = $order_clause;

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        // echo $response['q'];exit;
        //make seprate union select query for each status 
        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        $pallet = '';
        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                $result['id']               = $Row['id'];             
                $result['doctype2']         = $Row['doctype2'];               
                $result['docType']          = $Row['docType'];  
                $result['posting_date']     = $Row['posting_date'];
                $result['code']             = $Row['code'];
                $result['invoice_code']     = ($Row['invoice_code'] != '0') ? $Row['invoice_code']: ''; 
                $result['batch_no']         = $Row['batch_no'];
                $result['container_no2']    = $Row['container_no2'];
                $result['prod_date']        = $Row['prod_date'];
                $result['use_by_date']      = $Row['use_by_date'];
                $result['date_received']    = $Row['date_received'];
                $result['o_dispatch_date']  = $Row['o_dispatch_date'];                
                $result['user_name']        = $Row['user_name'];
                $result['user_no']          = $Row['user_no'];     
                $result['warehousename']    = $Row['warehousename'];  

                if($stock_check>0)
                    $result['location_name']    = $Row['location_name'];
                else
                    $result['location_name']    = '';
                    
                $result['qty2']             = $Row['qty2'];  
                $result['remainingQty']     = $Row['remaining_qty'];
                $result['allocatedQty']     = $Row['allocatedQty'];  

                if($Row['remaining_qty']>$Row['qty2']){
                    $Row['remaining_qty'] = $Row['qty2'];
                }

                if($result['doctype2'] == 'sales' || $result['doctype2'] == 'debitnote' || $result['docType'] == 'Item Ledger Out'){
                    $result['sold_qty']     = 0;
                    $result['availableQty'] = $result['qty2'];
                }
                else{

                    $result['sold_qty']         = intval($Row['qty2']) - intval($Row['remaining_qty']);
                    $result['availableQty'] = $result['qty2'] - $result['sold_qty'] - $result['allocatedQty'];
                }


                $result['uom_name']         = $Row['uom_name'];    
                $result['type']             = $Row['type'];    
                $result['trailtype']        = $Row['trailtype']; 
                $result['order_id']         = $Row['order_id'];
                $result['warehouse_id']     = $Row['warehouse_id'];
                $result['product_id']       = $Row['product_id'];
                $result['sale_status']      = $Row['sale_status'];

                $response['response'][]     = $result;                
            }
  
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {
            $response['response'][] = array();
            $response['ack'] = 1;
            $response['error'] = NULL;
        }
        //	print_r($response);exit;
        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData("StockActivity");
        return $response;
    }

    function stockSheetAvailable($attr)
    {
        $searchKeyword = '';
        $searchKeyword = $attr['searchKeyword'];

        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";

        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.",$attr,$fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.",$attr,$fieldsMeta);

        $where = " tbl.company_id = " . $this->arrUser['company_id'];    
        $response = array();//date_received

        $stock_check = 0;
        $rawmaterialproduct = 0;

        if($attr['product_id'] > 0){
            
            $checkStkAlloc = "  SELECT stock_check,rawmaterialproduct
                                FROM product 
                                WHERE id= " . $attr['product_id']. " AND 
                                    company_id = '" . $this->arrUser['company_id'] . "'
                                LIMIT 1"; 

            $RsStkAlloc = $this->objsetup->CSI($checkStkAlloc);
            $stock_check = $RsStkAlloc->fields['stock_check'];
            $rawmaterialproduct = $RsStkAlloc->fields['rawmaterialproduct'];
        }

        $stockChkCondition = '';        
        $stockChkConditionSalesCase = '';

        $rawMaterialPOCond = '';
        $rawMaterialCNCond = '';
        $rawMaterialOpBalncCond = '';
        $rawMaterialItemLedgerPosCond = '';

        if (isset($searchKeyword->exportAsCSV)){

            /* if($rawmaterialproduct>0){
                    $rawMaterialPOCond   = " SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,si.id,1, wa.company_id) AS remaining_qty,
                                             0 AS allocatedQty,
                                            (CASE WHEN (SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,si.id,1, wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,si.id,1, wa.company_id)) 
                                            ELSE 0 END) AS sold_qty,
                                            (IFNULL(wa.quantity,0) - 
                                            (CASE WHEN (SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,si.id,1, wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,si.id,1, wa.company_id)) 
                                        ELSE 0 END)) AS availableQty,"; 

                    $rawMaterialCNCond   = " SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,cn.id,2, wa.company_id) AS remaining_qty,
                                             0 AS allocatedQty,
                                            (CASE WHEN (SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,cn.id,2, wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,cn.id,2, wa.company_id)) 
                                            ELSE 0 END) AS sold_qty,
                                            (IFNULL(wa.quantity,0) - 
                                            (CASE WHEN (SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,cn.id,2, wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,cn.id,2, wa.company_id)) 
                                        ELSE 0 END)) AS availableQty,"; 

                    $rawMaterialOpBalncCond   = " SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,ob.id,3, wa.company_id) AS remaining_qty,
                                             0 AS allocatedQty,
                                            (CASE WHEN (SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,ob.id,3, wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,ob.id,3, wa.company_id)) 
                                            ELSE 0 END) AS sold_qty,
                                            (IFNULL(wa.quantity,0) - 
                                            (CASE WHEN (SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,ob.id,3, wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,ob.id,3, wa.company_id)) 
                                        ELSE 0 END)) AS availableQty,"; 

                    $rawMaterialItemLedgerPosCond   = " SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,si.id,4, wa.company_id) AS remaining_qty,
                                             0 AS allocatedQty,
                                            (CASE WHEN (SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,si.id,4, wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,si.id,4, wa.company_id)) 
                                            ELSE 0 END) AS sold_qty,
                                            (IFNULL(wa.quantity,0) - 
                                            (CASE WHEN (SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,si.id,4, wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,si.id,4, wa.company_id)) 
                                        ELSE 0 END)) AS availableQty,"; 
                                                          
            }else{ */

                if($stock_check>0){                

                    $stockChkCondition   = " SR_CheckRemaningStockByWarehouse(wa.item_trace_unique_id, wa.quantity,wa.warehouse_id, wa.company_id) AS remaining_qty,
                                         SR_CheckAllocatedStockByWarehouse(wa.item_trace_unique_id, 0,wa.warehouse_id, wa.company_id) AS allocatedQty,
                                         (CASE WHEN (SR_CheckRemaningStockByWarehouse(wa.item_trace_unique_id, wa.quantity,wa.warehouse_id, wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_CheckRemaningStockByWarehouse(wa.item_trace_unique_id, wa.quantity,wa.warehouse_id, wa.company_id)) 
                                         ELSE 0 END) AS sold_qty,
                                         (IFNULL(wa.quantity,0) - (CASE WHEN (SR_CheckRemaningStockByWarehouse(wa.item_trace_unique_id, wa.quantity,wa.warehouse_id, wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_CheckRemaningStockByWarehouse(wa.item_trace_unique_id, wa.quantity,wa.warehouse_id, wa.company_id)) 
                                       ELSE 0 END) - SR_CheckAllocatedStock(wa.item_trace_unique_id, 0, wa.company_id)) AS availableQty,";
                
                
                    $stockChkConditionSalesCase = " SR_CheckRemaningStockByWarehouse(wa.item_trace_unique_id, wa.quantity,wa.warehouse_id, wa.company_id) AS remaining_qty,SR_CheckAllocatedStockByWarehouse(wa.item_trace_unique_id, wa.sale_order_detail_id,wa.warehouse_id, wa.company_id) AS allocatedQty, ";
                }
                else{

                    
                    $stockChkCondition   = " SR_CheckRemaningStock(wa.item_trace_unique_id, wa.quantity, wa.company_id) AS remaining_qty,
                                            SR_CheckAllocatedStock(wa.item_trace_unique_id, 0, wa.company_id) AS allocatedQty,
                                            (CASE WHEN (SR_CheckRemaningStock(wa.item_trace_unique_id, wa.quantity,wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_CheckRemaningStock(wa.item_trace_unique_id, wa.quantity, wa.company_id)) 
                                            ELSE 0 END) AS sold_qty,
                                            (IFNULL(wa.quantity,0) - (CASE WHEN (SR_CheckRemaningStock(wa.item_trace_unique_id, wa.quantity,wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_CheckRemaningStock(wa.item_trace_unique_id, wa.quantity,wa.company_id)) 
                                        ELSE 0 END) - SR_CheckAllocatedStock(wa.item_trace_unique_id, 0, wa.company_id)) AS availableQty,";
                    
                    $stockChkConditionSalesCase = " SR_CheckRemaningStock(wa.item_trace_unique_id, wa.quantity, wa.company_id) AS remaining_qty,
                    SR_CheckAllocatedStock(wa.item_trace_unique_id, wa.sale_order_detail_id, wa.company_id) AS allocatedQty, ";
                }
            // }
        }
        else{
            /* if($rawmaterialproduct>0){
                    $rawMaterialPOCond   = " SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,si.id,1, wa.company_id) AS remaining_qty,
                                             0 AS allocatedQty,";  

                    $rawMaterialCNCond   = " SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,cn.id,2, wa.company_id) AS remaining_qty,
                                             0 AS allocatedQty,"; 

                    $rawMaterialOpBalncCond   = " SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,ob.id,3, wa.company_id) AS remaining_qty,
                                             0 AS allocatedQty,";  

                    $rawMaterialItemLedgerPosCond   = " SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,si.id,4, wa.company_id) AS remaining_qty,
                                             0 AS allocatedQty,";                    
            }else{ */

                if($stock_check>0){
                    $stockChkCondition   = " SR_CheckRemaningStockByWarehouse(wa.item_trace_unique_id, wa.quantity,wa.warehouse_id, wa.company_id) AS remaining_qty,
                                            SR_CheckAllocatedStockByWarehouse(wa.item_trace_unique_id, 0,wa.warehouse_id, wa.company_id) AS allocatedQty, ";
                    
                    $stockChkConditionSalesCase = " SR_CheckRemaningStockByWarehouse(wa.item_trace_unique_id, wa.quantity,wa.warehouse_id, wa.company_id) AS remaining_qty,SR_CheckAllocatedStockByWarehouse(wa.item_trace_unique_id, wa.sale_order_detail_id,wa.warehouse_id, wa.company_id) AS allocatedQty, ";
                }
                else{
                    $stockChkCondition   = " SR_CheckRemaningStock(wa.item_trace_unique_id, wa.quantity, wa.company_id) AS remaining_qty,
                                            SR_CheckAllocatedStock(wa.item_trace_unique_id, 0, wa.company_id) AS allocatedQty, ";
                    
                    $stockChkConditionSalesCase = " SR_CheckRemaningStock(wa.item_trace_unique_id, wa.quantity, wa.company_id) AS remaining_qty,
                    SR_CheckAllocatedStock(wa.item_trace_unique_id, wa.sale_order_detail_id, wa.company_id) AS allocatedQty, ";
                }
            // }
        }

        //  seprate  union  query for results
        
        // purchase Order
        $PO_Sql =  "SELECT  si.order_code AS code,
                            si.invoice_code AS invoice_code,
                            si.invoice_date AS posting_date,
                            si.sell_to_cust_no as user_no,
                            si.sell_to_cust_name AS user_name,
                            'purchase' AS doctype2,
                            (CASE WHEN si.type = 3 THEN 'Purchase Order'
                                  WHEN si.type <> 3 THEN 'Purchase Invoice'
                                  END) AS docType,
                            si.type as order_type,
                            '3' AS trailtype,
                            NULL AS o_dispatch_date,
                            si.receiptDate as receipt_date,
                            wbl.title AS location_name,
                            wa.id AS rec_id, 
                            wh.name AS warehousename, 
                            si.comm_book_in_no AS consignmentNo, 
                            wa.container_no AS container_no2, 
                            wa.unit_measure_name AS uom_name,
                            si.id as oid,                            
                            IFNULL(wa.quantity,0) AS qty2,  
                            ".$stockChkCondition.
                            $rawMaterialPOCond."
                            wa.id,
                            wa.batch_no,
                            wa.prod_date,
                            wa.use_by_date,
                            wa.date_received,
                            wa.type,
                            wa.order_id,
                            wa.warehouse_id,
                            wa.product_id,
                            wa.sale_status,
                            wa.company_id  
                    FROM warehouse_allocation wa
                    LEFT JOIN srm_invoice si ON si.id=wa.order_id
                    LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id 
                    LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                    LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id               
                    WHERE wa.product_id = '". $attr['product_id'] ."' AND 
                          wa.type = 1 AND
                          wa.status = 1 AND 
                          wa.purchase_return_status = 0 AND
                          wa.raw_material_out IS NULL AND
                          wa.purchase_status IN (2,3) AND
                          wa.company_id='" . $this->arrUser['company_id'] . "'
                    HAVING remaining_qty > 0 ";
        //  * wa.unit_measure_qty        

        /* // debit note            
        $DN_Sql =  "SELECT  si.debitNoteCode AS code,
                            si.invoice_code AS invoice_code,
                            si.supplierCreditNoteDate AS posting_date,
                            si.supplierNo as user_no,
                            si.supplierName AS user_name,
                            'debitnote' AS doctype2,
                            (CASE WHEN si.type = 3 THEN 'Debit Note'
                                  WHEN si.type <> 3 THEN 'Debit Note Invoice'
                                  END) AS docType,
                            si.type as order_type,
                            '4' AS trailtype,
                            si.dispatchDate AS o_dispatch_date,
                            si.supplierReceiptDate as receipt_date,
                            wbl.title AS location_name,
                            wa.id AS rec_id, 
                            wh.name AS warehousename,
                            '-' AS consignmentNo,   
                            wa.container_no AS container_no2, 
                            wa.unit_measure_name AS uom_name,
                            si.id as oid,
                            IFNULL(wa.quantity,0)*(-1) as qty2, 
                            $stockChkCondition
                            wa.id,
                            wa.batch_no,
                            wa.prod_date,
                            wa.use_by_date,
                            wa.date_received,
                            wa.type,
                            wa.order_id,
                            wa.warehouse_id,
                            wa.product_id,
                            wa.sale_status,
                            wa.company_id  
                    FROM warehouse_allocation wa
                    LEFT JOIN srm_order_return si ON si.id=wa.order_id 
                    LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id
                    LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                    LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id               
                    WHERE wa.product_id = '". $attr['product_id'] ."' AND 
                          wa.type = 1 AND 
                          wa.status = 1 AND
                          wa.purchase_status IN (2,3) AND
                          wa.purchase_return_status = 1 AND
                          wa.company_id='" . $this->arrUser['company_id'] . "'";
        
        # query for  SO Dispatched and invoiced
        $SO_Sql = "SELECT   o.sale_order_code AS code, 
                            o.sale_invioce_code AS invoice_code,
                            o.posting_date AS posting_date,
                            o.sell_to_cust_no as user_no,
                            o.sell_to_cust_name AS user_name,
                            'sales' AS doctype2, 
                            (CASE WHEN o.type = 1 THEN 'Sales Order'
                                  WHEN o.type <> 1 THEN 'Sales Invoice'
                                  END) AS docType,
                            o.type as order_type,
                            '1' AS trailtype,
                            o.dispatch_date as o_dispatch_date,
                            NULL AS receipt_date,
                            wbl.title AS location_name,
                            wa.id AS rec_id,
                            wh.name AS warehousename, 
                            '-' AS consignmentNo,  
                            wa.container_no AS container_no2, 
                            wa.unit_measure_name AS uom_name,
                            o.id as oid,
                            IFNULL(wa.quantity,0)*(-1) as qty2, 
                            $stockChkCondition
                            wa.id,
                            wa.batch_no,
                            wa.prod_date,
                            wa.use_by_date,
                            wa.date_received,
                            wa.type,
                            wa.order_id,
                            wa.warehouse_id,
                            wa.product_id,
                            wa.sale_status,
                            wa.company_id
                    FROM warehouse_allocation wa
                    LEFT JOIN orders o ON o.id = wa.order_id  
                    LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id  
                    LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                    LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id       
                    WHERE wa.product_id = '" . $attr['product_id'] . "' AND 
                          wa.type = 2 AND 
                          wa.sale_return_status = 0 AND
                          wa.status = 1 AND 
                          wa.sale_status IN (2,3) AND
                          wa.company_id='" . $this->arrUser['company_id'] . "'";
        # query for SO allocated */

        /* $SOA_Sql = "SELECT  o.sale_order_code AS code, 
                            o.sale_invioce_code AS invoice_code,
                            o.posting_date AS posting_date,
                            o.sell_to_cust_no as user_no,
                            o.sell_to_cust_name AS user_name,
                            'Allocated' AS doctype2, 
                            (CASE WHEN o.type = 1 THEN 'Sales Order'
                                  WHEN o.type <> 1 THEN 'Sales Invoice'
                                  END) AS docType,
                            o.type as order_type,
                            '1' AS trailtype,
                            o.dispatch_date as o_dispatch_date,
                            NULL AS receipt_date,
                            wbl.title AS location_name,
                            wa.id AS rec_id,
                            wh.name AS warehousename, 
                            '-' AS consignmentNo,  
                            wa.container_no AS container_no2, 
                            wa.unit_measure_name AS uom_name,
                            o.id as oid,
                            IFNULL(wa.quantity,0)*(-1) as qty2, 
                            $stockChkConditionSalesCase
                            wa.id,
                            wa.batch_no,
                            wa.prod_date,
                            wa.use_by_date,
                            wa.date_received,
                            wa.type,
                            wa.order_id,
                            wa.warehouse_id,
                            wa.product_id,
                            wa.sale_status,
                            wa.company_id 
                    FROM warehouse_allocation wa
                    LEFT JOIN orders o ON o.id = wa.order_id  
                    LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id  
                    LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                    LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id          
                    WHERE wa.product_id = '" . $attr['product_id'] . "' AND 
                          wa.type = 2 AND 
                          wa.sale_return_status = 0 AND
                          wa.status = 1 AND 
                          wa.sale_status = 1 AND
                          wa.company_id='" . $this->arrUser['company_id'] . "'"; */
        // credit note
        $CN_Sql =  "SELECT  cn.return_order_code AS code, 
                            cn.return_invoice_code AS invoice_code,
                            cn.posting_date AS posting_date,
                            cn.sell_to_cust_no as user_no,
                            cn.sell_to_cust_name AS user_name,
                            'creditnote' AS doctype2,
                            (CASE WHEN cn.type = 1 THEN 'Credit Note'
                                  WHEN cn.type <> 1 THEN 'Credit Note Invoice'
                                  END) AS docType, 
                            cn.type as order_type,
                            '2' AS trailtype,
                            NULL AS o_dispatch_date,
                            cn.delivery_date as receipt_date,
                            wbl.title AS location_name,
                            wa.id AS rec_id, 
                            wh.name AS warehousename,
                            '-' AS consignmentNo,  
                            wa.container_no AS container_no2, 
                            wa.unit_measure_name AS uom_name,
                            cn.id as oid,
                            IFNULL(wa.quantity,0) as qty2, 
                            ".$stockChkCondition.
                            $rawMaterialCNCond."
                            wa.id,
                            wa.batch_no,
                            wa.prod_date,
                            wa.use_by_date,
                            cn.delivery_date as date_received,
                            wa.type,
                            wa.order_id,
                            wa.warehouse_id,
                            wa.product_id,
                            wa.sale_status,
                            wa.company_id 
                    FROM warehouse_allocation wa
                    LEFT JOIN return_orders cn ON cn.id = wa.order_id  
                    LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id 
                    LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                    LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id        
                    WHERE wa.product_id = '" . $attr['product_id'] . "' AND 
                          wa.type = 2 AND 
                          wa.status = 1 AND
                          wa.sale_return_status = 1 AND
                          wa.sale_status IN (2,3) AND
                          wa.company_id='" . $this->arrUser['company_id'] . "'
                    HAVING remaining_qty > 0  AND (SELECT COUNT(id) AS ttl 
                                                    FROM warehouse_allocation AS tbl2 
                                                    WHERE tbl2.product_id = wa.product_id AND 
                                                          tbl2.warehouse_id = wa.warehouse_id AND
                                                          tbl2.company_id = wa.company_id AND
                                                          tbl2.type = 1 AND 
                                                            tbl2.status = 1 AND
                                                            tbl2.purchase_return_status = 0 AND 
                                                            tbl2.purchase_status IN (2,3) AND                         
                                                            tbl2.raw_material_out IS NULL ) = 0";


        // opening balance sql.
        $opBalnc_Sql =  "SELECT  '-' AS code,
                                '-' AS invoice_code,
                                ob.posting_date AS posting_date,
                                '-' as user_no,
                                '-' AS user_name,
                                'StockOpenBalanc' AS doctype2,
                                'Stock Opening Balances' AS docType, 
                                '-' as order_type,
                                '4' AS trailtype,
                                NULL AS o_dispatch_date,
                                NULL as receipt_date,
                                wbl.title AS location_name,
                                wa.id AS rec_id, 
                                wh.name AS warehousename,
                                ob.comm_book_in_no AS consignmentNo, 
                                wa.container_no AS container_no2,  
                                wa.unit_measure_name AS uom_name,
                                ob.id as oid,
                                SUM(ob.qty) as qty2,
                                ".$stockChkCondition.
                                $rawMaterialOpBalncCond."
                                wa.id,
                                wa.batch_no,
                                wa.prod_date,
                                wa.use_by_date,
                                wa.date_received,
                                wa.type,
                                wa.order_id,
                                wa.warehouse_id,
                                wa.product_id,
                                wa.sale_status,
                                wa.company_id  
                        FROM warehouse_allocation wa
                        LEFT JOIN opening_balance_stock ob ON ob.id=wa.opBalncID 
                        LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id
                        LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                        LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id               
                        WHERE wa.product_id = '". $attr['product_id'] ."' AND 
                            wa.type = 4 AND 
                            wa.status = 1 AND
                            wa.company_id='" . $this->arrUser['company_id'] . "'
                        GROUP BY wa.opBalncID
                        HAVING remaining_qty > 0 ";


        // Item Ledger Positive
        $itemLedgerPosSql =  "SELECT  '-' AS code,
                                        si.acc_code AS invoice_code,
                                        ijd.posting_date AS posting_date,
                                        '-' as user_no,
                                        '-' AS user_name,
                                        'itemLedger' AS doctype2,
                                        'Item Ledger In' AS docType,
                                        si.type as order_type,
                                        '1' AS trailtype,
                                        NULL AS o_dispatch_date,
                                        NULL as receipt_date,
                                        wbl.title AS location_name,
                                        wa.id AS rec_id, 
                                        wh.name AS warehousename, 
                                        wa.container_no AS consignmentNo, 
                                        wa.container_no AS container_no2,                                       
                                        ijd.uom_name,
                                        si.id as oid,                            
                                        IFNULL(wa.quantity,0) AS qty2, 
                                        ".$stockChkCondition.
                                        $rawMaterialItemLedgerPosCond."
                                        wa.id,
                                        wa.batch_no,
                                        wa.prod_date,
                                        wa.use_by_date,
                                        wa.date_received,
                                        wa.type,
                                        wa.order_id,
                                        wa.warehouse_id,
                                        wa.product_id,
                                        wa.sale_status,
                                        wa.company_id  
                                FROM item_journal_details ijd 
                                LEFT JOIN warehouse_allocation wa ON ijd.id=wa.item_journal_detail_id
                                LEFT JOIN gl_journal_receipt si ON si.id=wa.order_id
                                LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id 
                                LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                                LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id                
                                WHERE wa.product_id = '". $attr['product_id'] ."' AND 
                                    wa.type = 3 AND
                                    wa.ledger_type = 1 AND
                                    wa.journal_status = 2 AND
                                    si.type = 2 AND
                                    wa.status = 1 AND 
                                    ijd.item_id  = '". $attr['product_id'] ."' AND 
                                    wa.company_id='" . $this->arrUser['company_id'] . "' AND 
                                    ijd.company_id='" . $this->arrUser['company_id'] . "'
                                HAVING remaining_qty > 0 ";
            
        // Item Ledger Negative
        /* wa.unit_measure_name as uom_name, */
        /* $itemLedgerNegSql =  "SELECT  '-' AS code,
                                        si.acc_code AS invoice_code,
                                        ijd.posting_date AS posting_date,
                                        '-' as user_no,
                                        '-' AS user_name,
                                        'itemLedger' AS doctype2,
                                        'Item Ledger Out' AS docType,
                                        si.type as order_type,
                                        '2' AS trailtype,
                                        NULL AS o_dispatch_date,
                                        NULL as receipt_date,
                                        wbl.title AS location_name,
                                        wa.id AS rec_id, 
                                        wh.name AS warehousename, 
                                        wa.container_no AS consignmentNo,  
                                        wa.container_no AS container_no2,
                                        ijd.uom_name,
                                        si.id as oid,                            
                                        IFNULL(wa.quantity,0)*(-1) AS qty2,  
                                        $stockChkCondition
                                        wa.id,
                                        wa.batch_no,
                                        wa.prod_date,
                                        wa.use_by_date,
                                        wa.date_received,
                                        wa.type,
                                        wa.order_id,
                                        wa.warehouse_id,
                                        wa.product_id,
                                        wa.sale_status,
                                        wa.company_id  
                                FROM item_journal_details ijd
                                LEFT JOIN  warehouse_allocation wa ON ijd.id = wa.item_journal_detail_id
                                LEFT JOIN gl_journal_receipt si ON si.id=wa.order_id
                                LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id 
                                LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                                LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id                
                                WHERE wa.product_id = '". $attr['product_id'] ."' AND 
                                    wa.type = 3 AND
                                    wa.ledger_type = 2 AND
                                    wa.journal_status = 2 AND
                                    si.type = 2 AND
                                    wa.status = 1 AND 
                                    ijd.item_id  = '". $attr['product_id'] ."' AND 
                                    wa.company_id='" . $this->arrUser['company_id'] . "' AND 
                                    ijd.company_id='" . $this->arrUser['company_id'] . "'"; */
        
        // Stock Transfer Positive
        $stockTransferPosSql =  "SELECT  si.code AS code,
                                        '-' AS invoice_code,
                                        si.order_date AS posting_date,
                                        '-' as user_no,
                                        '-' AS user_name,
                                        'stockTransfer' AS doctype2,
                                        'Stock Transfer In' AS docType,
                                        si.type as order_type,
                                        '1' AS trailtype,
                                        NULL AS o_dispatch_date,
                                        NULL as receipt_date,
                                        wbl.title AS location_name,
                                        wa.id AS rec_id, 
                                        wh.name AS warehousename, 
                                        wa.container_no AS consignmentNo, 
                                        wa.container_no AS container_no2,                                       
                                        wa.unit_measure_name AS uom_name,
                                        si.id as oid,                            
                                        IFNULL(wa.quantity,0) AS qty2,
                                        ".$stockChkCondition."
                                        wa.id,
                                        wa.batch_no,
                                        wa.prod_date,
                                        wa.use_by_date,
                                        wa.date_received,
                                        wa.type,
                                        wa.order_id,
                                        wa.warehouse_id,
                                        wa.product_id,
                                        wa.sale_status,
                                        wa.company_id  
                                FROM transfer_orders_details ijd 
                                LEFT JOIN warehouse_allocation wa ON ijd.id=wa.transfer_order_detail_id
                                LEFT JOIN transfer_orders si ON si.id = wa.order_id
                                LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id
                                LEFT JOIN product_warehouse_location pwl ON pwl.id = wa.location   
                                LEFT JOIN warehouse_bin_location wbl ON wbl.id = pwl.warehouse_loc_id                 
                                WHERE wa.product_id = '". $attr['product_id'] ."' AND 
                                    wa.type = 5 AND
                                    wa.ledger_type = 1 AND
                                    wa.journal_status = 2 AND
                                    si.type = 1 AND
                                    wa.status = 1 AND 
                                    ijd.item_id  = '". $attr['product_id'] ."' AND 
                                    wa.company_id='" . $this->arrUser['company_id'] . "' AND 
                                    ijd.company_id='" . $this->arrUser['company_id'] . "'";
            
        // Stock Transfer Negative
        /*$stockTransferNegSql =  "SELECT  si.code AS code,
                                        '-' AS invoice_code,
                                        si.order_date AS posting_date,
                                        '-' as user_no,
                                        '-' AS user_name,
                                        'stockTransfer' AS doctype2,
                                        'Stock Transfer Out' AS docType,
                                        si.type as order_type,
                                        '2' AS trailtype,
                                        NULL AS o_dispatch_date,
                                        NULL as receipt_date,
                                        wbl.title AS location_name,
                                        wa.id AS rec_id, 
                                        wh.name AS warehousename, 
                                        wa.container_no AS consignmentNo,  
                                        wa.container_no AS container_no2,                                      
                                        wa.unit_measure_name as uom_name,
                                        si.id as oid,                            
                                        IFNULL(wa.quantity,0)*(-1) AS qty2,  
                                        $stockChkCondition
                                        wa.id,
                                        wa.batch_no,
                                        wa.prod_date,
                                        wa.use_by_date,
                                        wa.date_received,
                                        wa.type,
                                        wa.order_id,
                                        wa.warehouse_id,
                                        wa.product_id,
                                        wa.sale_status,
                                        wa.company_id  
                                FROM transfer_orders_details ijd
                                LEFT JOIN  warehouse_allocation wa ON ijd.id = wa.transfer_order_detail_id
                                LEFT JOIN transfer_orders si ON si.id=wa.order_id
                                LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id  
                                LEFT JOIN product_warehouse_location pwl ON pwl.id = wa.location   
                                LEFT JOIN warehouse_bin_location wbl ON wbl.id = pwl.warehouse_loc_id                 
                                WHERE wa.product_id = '". $attr['product_id'] ."' AND 
                                    wa.type = 5 AND
                                    wa.ledger_type = 2 AND
                                    wa.journal_status = 2 AND
                                    si.type = 1 AND
                                    wa.status = 1 AND 
                                    ijd.item_id  = '". $attr['product_id'] ."' AND 
                                    wa.company_id='" . $this->arrUser['company_id'] . "' AND 
                                    ijd.company_id='" . $this->arrUser['company_id'] . "'"; */
        $sub_sql = "";        

        if(isset($attr['type']) && $attr['type']>0)
        {
            if($attr['type'] == 1)
            {
                if(isset($attr['only_po']))
                    $sub_sql = $PO_Sql;
                else
                    $sub_sql = $PO_Sql." UNION ".$CN_Sql." UNION ".$opBalnc_Sql." UNION ".$itemLedgerPosSql." UNION ".$stockTransferPosSql;
            }
            else if($attr['type'] == 2)
            {
                if(isset($attr['only_so']))
                    $sub_sql = $SO_Sql;
                else
                    $sub_sql = $SO_Sql." UNION ".$DN_Sql." UNION ".$itemLedgerNegSql." UNION ".$stockTransferNegSql;
            }
        }
        else {
            // $sub_sql = $PO_Sql." UNION ".$CN_Sql." UNION ".$opBalnc_Sql." UNION ".$SO_Sql." UNION ".$DN_Sql." UNION ".$SOA_Sql." UNION ".$itemLedgerPosSql." UNION ".$itemLedgerNegSql." UNION ".$stockTransferPosSql." UNION ".$stockTransferNegSql;

            // $sub_sql = $PO_Sql." UNION ".$opBalnc_Sql." UNION ".$CN_Sql." UNION ".$itemLedgerPosSql." UNION ".$stockTransferPosSql." UNION ".$stockTransferNegSql;
            $sub_sql = $PO_Sql." UNION ".$opBalnc_Sql." UNION ".$CN_Sql." UNION ".$itemLedgerPosSql." UNION ".$stockTransferPosSql;
        }
        //ORDER BY rec_id

        $Sql = "SELECT * FROM (".$sub_sql.") AS tbl WHERE 1 and ".$where.$where_clause." ";
        // echo $Sql;exit;

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        
        if ($order_clause == "")
            $order_type = " Order BY tbl.rec_id ASC ";
        else
            $order_type = $order_clause;

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        // echo $response['q'];exit;
        //make seprate union select query for each status 
        $RS = $this->objsetup->CSI($response['q']);

        $response['q'] = '';
        $pallet = '';
        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                $result['id']               = $Row['id'];
                $result['doctype2']         = $Row['doctype2'];               
                $result['docType']          = $Row['docType']; 
                $result['posting_date']     = $Row['posting_date'];
                $result['code']             = $Row['code'];
                $result['invoice_code']     = ($Row['invoice_code'] != '0') ? $Row['invoice_code']: '';
                $result['batch_no']         = $Row['batch_no'];
                $result['container_no2']    = $Row['container_no2'];
                $result['prod_date']        = $Row['prod_date'];
                $result['use_by_date']      = $Row['use_by_date'];
                $result['date_received']    = $Row['date_received'];
                $result['o_dispatch_date']  = $Row['o_dispatch_date'];
                $result['user_name']        = $Row['user_name'];
                $result['user_no']          = $Row['user_no'];     
                $result['warehousename']    = $Row['warehousename'];   

                if($stock_check>0)
                    $result['location_name']    = $Row['location_name'];
                else
                    $result['location_name']    = '';

                $result['qty2']             = $Row['qty2'];   
                $result['remainingQty']     = $Row['remaining_qty'];
                $result['allocatedQty']     = $Row['allocatedQty']; 

                if($Row['remaining_qty']>$Row['qty2']){
                    $Row['remaining_qty'] = $Row['qty2'];
                }

                $result['sold_qty']         = intval($Row['qty2']) - intval($Row['remaining_qty']);


                $result['availableQty'] = $result['qty2'] - $result['sold_qty'] - $result['allocatedQty'];

                $result['uom_name']         = $Row['uom_name'];    
                $result['type']             = $Row['type'];    
                $result['trailtype']        = $Row['trailtype']; 
                $result['order_id']         = $Row['order_id'];
                $result['warehouse_id']     = $Row['warehouse_id'];
                $result['product_id']       = $Row['product_id'];
                $result['sale_status']      = $Row['sale_status'];  
                $response['response'][]     = $result;                   
            }

            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'][] = array();
        }

        // usort($response['response'], $this->build_sorter('date', 'DESC'));

        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData("StockActivity");

        return $response;
    }

    function stockSheetOnRoute($attr)
    {
        $searchKeyword = '';
        $searchKeyword = $attr['searchKeyword'];

        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";

        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.",$attr,$fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.",$attr,$fieldsMeta);

        $where = " tbl.company_id = " . $this->arrUser['company_id'];    
        $response = array();//date_received

        $stock_check = 0;
        $rawmaterialproduct = 0;

        if($attr['product_id'] > 0){
            
            $checkStkAlloc = "  SELECT stock_check,rawmaterialproduct
                                FROM product 
                                WHERE id= " . $attr['product_id']. " AND 
                                    company_id = '" . $this->arrUser['company_id'] . "'
                                LIMIT 1"; 

            $RsStkAlloc = $this->objsetup->CSI($checkStkAlloc);
            $stock_check = $RsStkAlloc->fields['stock_check'];
            $rawmaterialproduct = $RsStkAlloc->fields['rawmaterialproduct'];
        }

        $stockChkCondition = '';        
        $stockChkConditionSalesCase = '';

        $rawMaterialPOCond = '';
        $rawMaterialCNCond = '';
        $rawMaterialOpBalncCond = '';
        $rawMaterialItemLedgerPosCond = '';

        if (isset($searchKeyword->exportAsCSV)){

                if($stock_check>0){                

                    $stockChkCondition   = " SR_CheckRemaningStockByWarehouse(wa.item_trace_unique_id, wa.quantity,wa.warehouse_id, wa.company_id) AS remaining_qty,
                                         SR_CheckAllocatedStockByWarehouse(wa.item_trace_unique_id, 0,wa.warehouse_id, wa.company_id) AS allocatedQty,
                                         (CASE WHEN (SR_CheckRemaningStockByWarehouse(wa.item_trace_unique_id, wa.quantity,wa.warehouse_id, wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_CheckRemaningStockByWarehouse(wa.item_trace_unique_id, wa.quantity,wa.warehouse_id, wa.company_id)) 
                                         ELSE 0 END) AS sold_qty,
                                         (IFNULL(wa.quantity,0) - (CASE WHEN (SR_CheckRemaningStockByWarehouse(wa.item_trace_unique_id, wa.quantity,wa.warehouse_id, wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_CheckRemaningStockByWarehouse(wa.item_trace_unique_id, wa.quantity,wa.warehouse_id, wa.company_id)) 
                                       ELSE 0 END) - SR_CheckAllocatedStock(wa.item_trace_unique_id, 0, wa.company_id)) AS availableQty,";
                
                
                    $stockChkConditionSalesCase = " SR_CheckRemaningStockByWarehouse(wa.item_trace_unique_id, wa.quantity,wa.warehouse_id, wa.company_id) AS remaining_qty,SR_CheckAllocatedStockByWarehouse(wa.item_trace_unique_id, wa.sale_order_detail_id,wa.warehouse_id, wa.company_id) AS allocatedQty, ";
                }
                else{

                    
                    $stockChkCondition   = " SR_CheckRemaningStock(wa.item_trace_unique_id, wa.quantity, wa.company_id) AS remaining_qty,
                                            SR_CheckAllocatedStock(wa.item_trace_unique_id, 0, wa.company_id) AS allocatedQty,
                                            (CASE WHEN (SR_CheckRemaningStock(wa.item_trace_unique_id, wa.quantity,wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_CheckRemaningStock(wa.item_trace_unique_id, wa.quantity, wa.company_id)) 
                                            ELSE 0 END) AS sold_qty,
                                            (IFNULL(wa.quantity,0) - (CASE WHEN (SR_CheckRemaningStock(wa.item_trace_unique_id, wa.quantity,wa.company_id) < IFNULL(wa.quantity,0)) THEN (IFNULL(wa.quantity,0) - SR_CheckRemaningStock(wa.item_trace_unique_id, wa.quantity,wa.company_id)) 
                                        ELSE 0 END) - SR_CheckAllocatedStock(wa.item_trace_unique_id, 0, wa.company_id)) AS availableQty,";
                    
                    $stockChkConditionSalesCase = " SR_CheckRemaningStock(wa.item_trace_unique_id, wa.quantity, wa.company_id) AS remaining_qty,
                    SR_CheckAllocatedStock(wa.item_trace_unique_id, wa.sale_order_detail_id, wa.company_id) AS allocatedQty, ";
                }
            // }
        }
        else{            
                if($stock_check>0){
                    $stockChkCondition   = " SR_CheckRemaningStockByWarehouse(wa.item_trace_unique_id, wa.quantity,wa.warehouse_id, wa.company_id) AS remaining_qty,
                                            SR_CheckAllocatedStockByWarehouse(wa.item_trace_unique_id, 0,wa.warehouse_id, wa.company_id) AS allocatedQty, ";
                    
                    $stockChkConditionSalesCase = " SR_CheckRemaningStockByWarehouse(wa.item_trace_unique_id, wa.quantity,wa.warehouse_id, wa.company_id) AS remaining_qty,SR_CheckAllocatedStockByWarehouse(wa.item_trace_unique_id, wa.sale_order_detail_id,wa.warehouse_id, wa.company_id) AS allocatedQty, ";
                }
                else{
                    $stockChkCondition   = " SR_CheckRemaningStock(wa.item_trace_unique_id, wa.quantity, wa.company_id) AS remaining_qty,
                                            SR_CheckAllocatedStock(wa.item_trace_unique_id, 0, wa.company_id) AS allocatedQty, ";
                    
                    $stockChkConditionSalesCase = " SR_CheckRemaningStock(wa.item_trace_unique_id, wa.quantity, wa.company_id) AS remaining_qty,
                    SR_CheckAllocatedStock(wa.item_trace_unique_id, wa.sale_order_detail_id, wa.company_id) AS allocatedQty, ";
                }
            // }
        }
 
        //  seprate  union  query for results
        // get the onroute warehouse ids
        $Quer = "SELECT GROUP_CONCAT(wh.id) as warehous_ids
		FROM warehouse wh
		LEFT JOIN warehouse_storage_type ws ON ws.id=wh.type
		WHERE ws.title='Virtual' AND
        wh.company_id = '" . $this->arrUser['company_id'] . "'";
        
        $RSQ = $this->objsetup->CSI($Quer);

        $warehous_ids = '';
        if ($RSQ->RecordCount() > 0) 
        {
            while ($Row = $RSQ->FetchRow()) 
            {
                $warehous_ids = $Row['warehous_ids'];
            }
        }
        $where_warehous_ids = '';
        if($warehous_ids){
            $where_warehous_ids = " AND wh.id IN (".$warehous_ids.") ";
        }
       // echo $warehous_ids;exit;
        // purchase Order
        $PO_Sql =  "SELECT  si.order_code AS code,
                            si.invoice_code AS invoice_code,
                            si.invoice_date AS posting_date,
                            si.sell_to_cust_no as user_no,
                            si.sell_to_cust_name AS user_name,
                            'purchase' AS doctype2,
                            (CASE WHEN si.type = 3 THEN 'Purchase Order'
                                  WHEN si.type <> 3 THEN 'Purchase Invoice'
                                  END) AS docType,
                            si.type as order_type,
                            '3' AS trailtype,
                            NULL AS o_dispatch_date,
                            si.receiptDate as receipt_date,
                            wbl.title AS location_name,
                            wa.id AS rec_id, 
                            wh.name AS warehousename, 
                            si.comm_book_in_no AS consignmentNo, 
                            wa.container_no AS container_no2, 
                            wa.unit_measure_name AS uom_name,
                            si.id as oid,                            
                            IFNULL(wa.quantity,0) AS qty2,  
                            ".$stockChkCondition.
                            $rawMaterialPOCond."
                            wa.id,
                            wa.batch_no,
                            wa.prod_date,
                            wa.use_by_date,
                            wa.date_received,
                            wa.type,
                            wa.order_id,
                            wa.warehouse_id,
                            wa.product_id,
                            wa.sale_status,
                            wa.company_id  
                    FROM warehouse_allocation wa
                    LEFT JOIN srm_invoice si ON si.id=wa.order_id
                    LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id 
                    LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                    LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id               
                    WHERE wa.product_id = '". $attr['product_id'] ."' AND 
                          wa.type = 1 AND
                          wa.status = 1 AND 
                          wa.purchase_return_status = 0 AND
                          wa.raw_material_out IS NULL AND
                          wa.purchase_status IN (2,3) AND
                          wa.company_id='" . $this->arrUser['company_id'] . "'
                          ".$where_warehous_ids."
                    HAVING remaining_qty > 0 ";
        //  * wa.unit_measure_qty      
        
        // credit note
        $CN_Sql =  "SELECT  cn.return_order_code AS code, 
                            cn.return_invoice_code AS invoice_code,
                            cn.posting_date AS posting_date,
                            cn.sell_to_cust_no as user_no,
                            cn.sell_to_cust_name AS user_name,
                            'creditnote' AS doctype2,
                            (CASE WHEN cn.type = 1 THEN 'Credit Note'
                                  WHEN cn.type <> 1 THEN 'Credit Note Invoice'
                                  END) AS docType, 
                            cn.type as order_type,
                            '2' AS trailtype,
                            NULL AS o_dispatch_date,
                            cn.delivery_date as receipt_date,
                            wbl.title AS location_name,
                            wa.id AS rec_id, 
                            wh.name AS warehousename,
                            '-' AS consignmentNo,  
                            wa.container_no AS container_no2, 
                            wa.unit_measure_name AS uom_name,
                            cn.id as oid,
                            IFNULL(wa.quantity,0) as qty2, 
                            ".$stockChkCondition.
                            $rawMaterialCNCond."
                            wa.id,
                            wa.batch_no,
                            wa.prod_date,
                            wa.use_by_date,
                            cn.delivery_date as date_received,
                            wa.type,
                            wa.order_id,
                            wa.warehouse_id,
                            wa.product_id,
                            wa.sale_status,
                            wa.company_id 
                    FROM warehouse_allocation wa
                    LEFT JOIN return_orders cn ON cn.id = wa.order_id  
                    LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id 
                    LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                    LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id        
                    WHERE wa.product_id = '" . $attr['product_id'] . "' AND 
                          wa.type = 2 AND 
                          wa.status = 1 AND
                          wa.sale_return_status = 1 AND
                          wa.sale_status IN (2,3) AND
                          wa.company_id='" . $this->arrUser['company_id'] . "'
                          ".$where_warehous_ids."
                    HAVING remaining_qty > 0  AND (SELECT COUNT(id) AS ttl 
                                                    FROM warehouse_allocation AS tbl2 
                                                    WHERE tbl2.product_id = wa.product_id AND 
                                                          tbl2.warehouse_id = wa.warehouse_id AND
                                                          tbl2.company_id = wa.company_id AND
                                                          tbl2.type = 1 AND 
                                                            tbl2.status = 1 AND
                                                            tbl2.purchase_return_status = 0 AND 
                                                            tbl2.purchase_status IN (2,3) AND                         
                                                            tbl2.raw_material_out IS NULL ) = 0";


        // opening balance sql.
        $opBalnc_Sql =  "SELECT  '-' AS code,
                                '-' AS invoice_code,
                                ob.posting_date AS posting_date,
                                '-' as user_no,
                                '-' AS user_name,
                                'StockOpenBalanc' AS doctype2,
                                'Stock Opening Balances' AS docType, 
                                '-' as order_type,
                                '4' AS trailtype,
                                NULL AS o_dispatch_date,
                                NULL as receipt_date,
                                wbl.title AS location_name,
                                wa.id AS rec_id, 
                                wh.name AS warehousename,
                                ob.comm_book_in_no AS consignmentNo, 
                                wa.container_no AS container_no2,  
                                wa.unit_measure_name AS uom_name,
                                ob.id as oid,
                                SUM(ob.qty) as qty2,
                                ".$stockChkCondition.
                                $rawMaterialOpBalncCond."
                                wa.id,
                                wa.batch_no,
                                wa.prod_date,
                                wa.use_by_date,
                                wa.date_received,
                                wa.type,
                                wa.order_id,
                                wa.warehouse_id,
                                wa.product_id,
                                wa.sale_status,
                                wa.company_id  
                        FROM warehouse_allocation wa
                        LEFT JOIN opening_balance_stock ob ON ob.id=wa.opBalncID 
                        LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id
                        LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                        LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id               
                        WHERE wa.product_id = '". $attr['product_id'] ."' AND 
                            wa.type = 4 AND 
                            wa.status = 1 AND
                            wa.company_id='" . $this->arrUser['company_id'] . "'
                            ".$where_warehous_ids."
                        GROUP BY wa.opBalncID
                        HAVING remaining_qty > 0 ";


        // Item Ledger Positive
        $itemLedgerPosSql =  "SELECT  '-' AS code,
                                        si.acc_code AS invoice_code,
                                        ijd.posting_date AS posting_date,
                                        '-' as user_no,
                                        '-' AS user_name,
                                        'itemLedger' AS doctype2,
                                        'Item Ledger In' AS docType,
                                        si.type as order_type,
                                        '1' AS trailtype,
                                        NULL AS o_dispatch_date,
                                        NULL as receipt_date,
                                        wbl.title AS location_name,
                                        wa.id AS rec_id, 
                                        wh.name AS warehousename, 
                                        wa.container_no AS consignmentNo, 
                                        wa.container_no AS container_no2,                                       
                                        ijd.uom_name,
                                        si.id as oid,                            
                                        IFNULL(wa.quantity,0) AS qty2, 
                                        ".$stockChkCondition.
                                        $rawMaterialItemLedgerPosCond."
                                        wa.id,
                                        wa.batch_no,
                                        wa.prod_date,
                                        wa.use_by_date,
                                        wa.date_received,
                                        wa.type,
                                        wa.order_id,
                                        wa.warehouse_id,
                                        wa.product_id,
                                        wa.sale_status,
                                        wa.company_id  
                                FROM item_journal_details ijd 
                                LEFT JOIN warehouse_allocation wa ON ijd.id=wa.item_journal_detail_id
                                LEFT JOIN gl_journal_receipt si ON si.id=wa.order_id
                                LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id 
                                LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                                LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id                
                                WHERE wa.product_id = '". $attr['product_id'] ."' AND 
                                    wa.type = 3 AND
                                    wa.ledger_type = 1 AND
                                    wa.journal_status = 2 AND
                                    si.type = 2 AND
                                    wa.status = 1 AND 
                                    ijd.item_id  = '". $attr['product_id'] ."' AND 
                                    wa.company_id='" . $this->arrUser['company_id'] . "' AND 
                                    ijd.company_id='" . $this->arrUser['company_id'] . "'
                                    ".$where_warehous_ids."
                                HAVING remaining_qty > 0 ";
            
        // Stock Transfer Positive
        $stockTransferPosSql =  "SELECT  si.code AS code,
                                        '-' AS invoice_code,
                                        si.order_date AS posting_date,
                                        '-' as user_no,
                                        '-' AS user_name,
                                        'stockTransfer' AS doctype2,
                                        'Stock Transfer In' AS docType,
                                        si.type as order_type,
                                        '1' AS trailtype,
                                        NULL AS o_dispatch_date,
                                        NULL as receipt_date,
                                        wbl.title AS location_name,
                                        wa.id AS rec_id, 
                                        wh.name AS warehousename, 
                                        wa.container_no AS consignmentNo, 
                                        wa.container_no AS container_no2,                                       
                                        wa.unit_measure_name AS uom_name,
                                        si.id as oid,                            
                                        IFNULL(wa.quantity,0) AS qty2,
                                        ".$stockChkCondition."
                                        wa.id,
                                        wa.batch_no,
                                        wa.prod_date,
                                        wa.use_by_date,
                                        wa.date_received,
                                        wa.type,
                                        wa.order_id,
                                        wa.warehouse_id,
                                        wa.product_id,
                                        wa.sale_status,
                                        wa.company_id  
                                FROM transfer_orders_details ijd 
                                LEFT JOIN warehouse_allocation wa ON ijd.id=wa.transfer_order_detail_id
                                LEFT JOIN transfer_orders si ON si.id = wa.order_id
                                LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id
                                LEFT JOIN product_warehouse_location pwl ON pwl.id = wa.location   
                                LEFT JOIN warehouse_bin_location wbl ON wbl.id = pwl.warehouse_loc_id                 
                                WHERE wa.product_id = '". $attr['product_id'] ."' AND 
                                    wa.type = 5 AND
                                    wa.ledger_type = 1 AND
                                    wa.journal_status = 2 AND
                                    si.type = 1 AND
                                    wa.status = 1 AND 
                                    ijd.item_id  = '". $attr['product_id'] ."' AND 
                                    wa.company_id='" . $this->arrUser['company_id'] . "' AND 
                                    ijd.company_id='" . $this->arrUser['company_id'] . "'
                                    ".$where_warehous_ids." ";
            
        $sub_sql = "";        

        if(isset($attr['type']) && $attr['type']>0)
        {
            if($attr['type'] == 1)
            {
                if(isset($attr['only_po']))
                    $sub_sql = $PO_Sql;
                else
                    $sub_sql = $PO_Sql." UNION ".$CN_Sql." UNION ".$opBalnc_Sql." UNION ".$itemLedgerPosSql." UNION ".$stockTransferPosSql;
            }
            else if($attr['type'] == 2)
            {
                if(isset($attr['only_so']))
                    $sub_sql = $SO_Sql;
                else
                    $sub_sql = $SO_Sql." UNION ".$DN_Sql." UNION ".$itemLedgerNegSql." UNION ".$stockTransferNegSql;
            }
        }
        else {
            // $sub_sql = $PO_Sql." UNION ".$CN_Sql." UNION ".$opBalnc_Sql." UNION ".$SO_Sql." UNION ".$DN_Sql." UNION ".$SOA_Sql." UNION ".$itemLedgerPosSql." UNION ".$itemLedgerNegSql." UNION ".$stockTransferPosSql." UNION ".$stockTransferNegSql;

            // $sub_sql = $PO_Sql." UNION ".$opBalnc_Sql." UNION ".$CN_Sql." UNION ".$itemLedgerPosSql." UNION ".$stockTransferPosSql." UNION ".$stockTransferNegSql;
            $sub_sql = $PO_Sql." UNION ".$opBalnc_Sql." UNION ".$CN_Sql." UNION ".$itemLedgerPosSql." UNION ".$stockTransferPosSql;
        }
        //ORDER BY rec_id

        $Sql = "SELECT * FROM (".$sub_sql.") AS tbl WHERE 1 and ".$where.$where_clause." ";
        // echo $Sql;exit;

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        
        if ($order_clause == "")
            $order_type = " Order BY tbl.rec_id ASC ";
        else
            $order_type = $order_clause;

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        // echo $response['q'];exit;
        //make seprate union select query for each status 
        $RS = $this->objsetup->CSI($response['q']);

        $response['q'] = '';
        $pallet = '';
        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                $result['id']               = $Row['id'];
                $result['doctype2']         = $Row['doctype2'];               
                $result['docType']          = $Row['docType']; 
                $result['posting_date']     = $Row['posting_date'];
                $result['code']             = $Row['code'];
                $result['invoice_code']     = ($Row['invoice_code'] != '0') ? $Row['invoice_code']: '';
                $result['batch_no']         = $Row['batch_no'];
                $result['container_no2']    = $Row['container_no2'];
                $result['prod_date']        = $Row['prod_date'];
                $result['use_by_date']      = $Row['use_by_date'];
                $result['date_received']    = $Row['date_received'];
                $result['o_dispatch_date']  = $Row['o_dispatch_date'];
                $result['user_name']        = $Row['user_name'];
                $result['user_no']          = $Row['user_no'];     
                $result['warehousename']    = $Row['warehousename'];   

                if($stock_check>0)
                    $result['location_name']    = $Row['location_name'];
                else
                    $result['location_name']    = '';

                $result['qty2']             = $Row['qty2'];   
                $result['remainingQty']     = $Row['remaining_qty'];
                $result['allocatedQty']     = $Row['allocatedQty']; 

                if($Row['remaining_qty']>$Row['qty2']){
                    $Row['remaining_qty'] = $Row['qty2'];
                }

                $result['sold_qty']         = intval($Row['qty2']) - intval($Row['remaining_qty']);


                $result['availableQty'] = $result['qty2'] - $result['sold_qty'] - $result['allocatedQty'];

                $result['uom_name']         = $Row['uom_name'];    
                $result['type']             = $Row['type'];    
                $result['trailtype']        = $Row['trailtype']; 
                $result['order_id']         = $Row['order_id'];
                $result['warehouse_id']     = $Row['warehouse_id'];
                $result['product_id']       = $Row['product_id'];
                $result['sale_status']      = $Row['sale_status'];  
                $response['response'][]     = $result;                   
            }

            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'][] = array();
        }

        // usort($response['response'], $this->build_sorter('date', 'DESC'));

        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData("StockActivity");

        return $response;
    }

    //sort multi array with date
    function build_sorter($key, $dir='DESC') {
        
        return function ($a, $b) use ($key, $dir) {
            $t1 = strtotime(is_array($a) ? $a[$key] : $a->$key);
            $t2 = strtotime(is_array($b) ? $b[$key] : $b->$key);
            if ($t1 == $t2) return 0;
            return (strtoupper($dir) == 'ASC' ? ($t1 < $t2) : ($t1 > $t2)) ? -1 : 1;
        };
    }

    function stockSheetAllocated($attr)
    {
        $searchKeyword = '';
        $searchKeyword = $attr['searchKeyword'];

        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";

        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.",$attr,$fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.",$attr,$fieldsMeta);

        $where = " tbl.company_id = " . $this->arrUser['company_id'];    
        $response = array();

        if($attr['product_id'] > 0){
            
            $checkStkAlloc = "  SELECT stock_check
                                FROM product 
                                WHERE id= " . $attr['product_id']. " AND 
                                    company_id = '" . $this->arrUser['company_id'] . "'
                                LIMIT 1"; 

            $RsStkAlloc = $this->objsetup->CSI($checkStkAlloc);
            $stock_check = $RsStkAlloc->fields['stock_check'];
        }

        //  seprate  union  query for results

        $SO_Sql = "SELECT   o.sale_order_code AS code, 
                            o.sale_invioce_code AS invoice_code,
                            o.posting_date AS posting_date,
                            o.sell_to_cust_no as user_no,
                            o.sell_to_cust_name AS user_name,
                            'sales' AS doctype2, 
                            (CASE WHEN o.type = 1 THEN 'Sales Order'
                                  WHEN o.type <> 1 THEN 'Sales Invoice'
                                  END) AS docType,
                            o.type as order_type,
                            '1' AS trailtype,
                            o.dispatch_date as o_dispatch_date,
                            NULL AS receipt_date,
                            wbl.title AS location_name,
                            wa.id AS rec_id,
                            wh.name AS warehousename,
                            wa.container_no AS container_no2,  
                            wa.unit_measure_name as uom_name,
                            o.id as oid, 
                            IFNULL(wa.quantity,0)*(-1) as qty2, 
                            0 AS remaining_qty,
                            IFNULL(wa.quantity,0)*(-1) AS allocatedQty,
                            wa.id,
                            wa.batch_no,
                            wa.prod_date,
                            wa.use_by_date,
                            wa.date_received,
                            wa.type,
                            wa.order_id,
                            wa.warehouse_id,
                            wa.product_id,
                            wa.sale_status,
                            wa.company_id 
                    FROM warehouse_allocation wa
                    LEFT JOIN orders o ON o.id = wa.order_id  
                    LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id  
                    LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                    LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id           
                    WHERE wa.product_id = '" . $attr['product_id'] . "' AND 
                          wa.type = 2 AND 
                          wa.status = 1 AND 
                          wa.sale_status=1 AND
                          wa.sale_return_status = 0  AND
                          wa.company_id='" . $this->arrUser['company_id'] . "'";
                    
        $DN_Sql =  "SELECT  si.debitNoteCode AS code,
                            si.invoice_code AS invoice_code,
                            si.supplierCreditNoteDate AS posting_date,
                            si.supplierNo as user_no,
                            si.supplierName AS user_name,
                            'debitnote' AS doctype2,
                            (CASE WHEN si.type = 3 THEN 'Debit Note'
                                  WHEN si.type <> 3 THEN 'Debit Note Invoice'
                                  END) AS docType,
                            si.type as order_type,
                            '4' AS trailtype,
                            NULL AS o_dispatch_date,
                            si.supplierReceiptDate as receipt_date,
                            wbl.title AS location_name,
                            wa.id AS rec_id, 
                            wh.name AS warehousename,
                            wa.container_no AS container_no2, 
                            wa.unit_measure_name as uom_name,
                            si.id as oid,
                            IFNULL(wa.quantity,0)*(-1) as qty2,                             
                            0 AS remaining_qty,
                            IFNULL(wa.quantity,0)*(-1) AS allocatedQty, 
                            wa.id,
                            wa.batch_no,
                            wa.prod_date,
                            wa.use_by_date,
                            wa.date_received,
                            wa.type,
                            wa.order_id,
                            wa.warehouse_id,
                            wa.product_id,
                            wa.sale_status,
                            wa.company_id
                    FROM warehouse_allocation wa
                    LEFT JOIN srm_order_return si ON si.id=wa.order_id 
                    LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id
                    LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                    LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id               
                    WHERE wa.product_id = '". $attr['product_id'] ."' AND 
                          wa.type = 1 AND 
                          wa.status = 1 AND
                          wa.purchase_status=1 AND
                          wa.purchase_return_status = 1 AND
                          wa.company_id='" . $this->arrUser['company_id'] . "'";

        // Item Ledger Negative
        $itemLedgerNegSql =  "SELECT  '-' AS code,
                                        si.acc_code AS invoice_code,
                                        ijd.posting_date AS posting_date,
                                        '-' as user_no,
                                        '-' AS user_name,
                                        'itemLedger' AS doctype2,
                                        'Item Ledger Out' AS docType,
                                        si.type as order_type,
                                        '2' AS trailtype,
                                        NULL AS o_dispatch_date,
                                        NULL as receipt_date,
                                        wbl.title AS location_name,
                                        wa.id AS rec_id, 
                                        wh.name AS warehousename, 
                                        wa.container_no AS container_no2,
                                        ijd.uom_name,
                                        si.id as oid,                            
                                        IFNULL(wa.quantity,0)*(-1) AS qty2,                                          
                                        0 AS remaining_qty,
                                        IFNULL(wa.quantity,0)*(-1) AS allocatedQty,
                                        wa.id,
                                        wa.batch_no,
                                        wa.prod_date,
                                        wa.use_by_date,
                                        wa.date_received,
                                        wa.type,
                                        wa.order_id,
                                        wa.warehouse_id,
                                        wa.product_id,
                                        wa.sale_status,
                                        wa.company_id  
                                FROM item_journal_details ijd
                                LEFT JOIN  warehouse_allocation wa ON ijd.id = wa.item_journal_detail_id
                                LEFT JOIN gl_journal_receipt si ON si.id=wa.order_id
                                LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id 
                                LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                                LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id                
                                WHERE wa.product_id = '". $attr['product_id'] ."' AND 
                                    wa.type = 3 AND
                                    wa.ledger_type = 2 AND
                                    wa.journal_status = 1 AND
                                    si.type = 1 AND
                                    wa.status = 1 AND 
                                    ijd.item_id  = '". $attr['product_id'] ."' AND 
                                    wa.company_id='" . $this->arrUser['company_id'] . "' AND 
                                    ijd.company_id='" . $this->arrUser['company_id'] . "'"; 

        // Stock Transfer Negative
        $stockTransferNegSql =  "SELECT  si.code AS code,
                                        '-' AS invoice_code,
                                        si.order_date AS posting_date,
                                        '-' as user_no,
                                        '-' AS user_name,
                                        'stockTransfer' AS doctype2,
                                        'Stock Transfer Out' AS docType,
                                        si.type as order_type,
                                        '2' AS trailtype,
                                        NULL AS o_dispatch_date,
                                        NULL as receipt_date,
                                        wbl.title AS location_name,
                                        wa.id AS rec_id, 
                                        wh.name AS warehousename,  
                                        wa.container_no AS container_no2,                                      
                                        wa.unit_measure_name as uom_name,
                                        si.id as oid,                            
                                        IFNULL(wa.quantity,0)*(-1) AS qty2,                                         
                                        0 AS remaining_qty,
                                        IFNULL(wa.quantity,0)*(-1) AS allocatedQty,
                                        wa.id,
                                        wa.batch_no,
                                        wa.prod_date,
                                        wa.use_by_date,
                                        wa.date_received,
                                        wa.type,
                                        wa.order_id,
                                        wa.warehouse_id,
                                        wa.product_id,
                                        wa.sale_status,
                                        wa.company_id  
                                FROM transfer_orders_details ijd
                                LEFT JOIN  warehouse_allocation wa ON ijd.id = wa.transfer_order_detail_id
                                LEFT JOIN transfer_orders si ON si.id=wa.order_id
                                LEFT JOIN warehouse wh ON wh.id = wa.warehouse_id  
                                LEFT JOIN product_warehouse_location pwl ON pwl.id = wa.location  
                                LEFT JOIN warehouse_bin_location wbl ON wbl.id = pwl.warehouse_loc_id               
                                WHERE wa.product_id = '". $attr['product_id'] ."' AND 
                                    wa.type = 5 AND
                                    wa.ledger_type = 2 AND
                                    wa.journal_status = 1 AND
                                    si.type = 0 AND
                                    wa.status = 1 AND 
                                    ijd.item_id  = '". $attr['product_id'] ."' AND 
                                    wa.company_id='" . $this->arrUser['company_id'] . "' AND 
                                    ijd.company_id='" . $this->arrUser['company_id'] . "'"; 


        $sub_sql = "";
        // LEFT JOIN warehouse_bin_location wbl ON wbl.id = wa.location  
        $sub_sql = $SO_Sql." UNION ".$DN_Sql." UNION ".$itemLedgerNegSql;
        // $sub_sql = $SO_Sql." UNION ".$DN_Sql." UNION ".$itemLedgerNegSql." UNION ".$stockTransferNegSql;

        $Sql = $sub_sql." ORDER BY rec_id";
        $Sql = "SELECT * FROM (".$sub_sql.") AS tbl WHERE 1 and ".$where.$where_clause." ";
        // echo $Sql;exit;
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        
        if ($order_clause == "")
            $order_type = "Order BY tbl.rec_id ASC";
        else
            $order_type = $order_clause;

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        // echo $response['q'];exit;
        //make seprate union select query for each status 
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                $result['id']               = $Row['id'];
                $result['doctype2']         = $Row['doctype2'];               
                $result['docType']          = $Row['docType'];
                $result['posting_date']     = $Row['posting_date'];
                $result['code']             = $Row['code'];                
                $result['invoice_code']     = ($Row['invoice_code'] != '0') ? $Row['invoice_code']: '';
                $result['container_no2']    = $Row['container_no2'];
                $result['batch_no']         = $Row['batch_no'];
                $result['prod_date']        = $Row['prod_date'];
                $result['use_by_date']      = $Row['use_by_date'];
                $result['date_received']    = $Row['date_received'];
                $result['o_dispatch_date']  = $Row['o_dispatch_date'];                          
                $result['user_name']        = $Row['user_name'];
                $result['user_no']          = $Row['user_no'];     
                $result['warehousename']    = $Row['warehousename']; 

                if($stock_check>0)
                    $result['location_name']    = $Row['location_name'];
                else
                    $result['location_name']    = '';

                $result['qty2']             = $Row['qty2'];
                $result['remainingQty']     = $Row['remaining_qty'];
                $result['allocatedQty']     = $Row['allocatedQty'];

                $result['sold_qty']         = 0;//intval($Row['qty2']) - intval($Row['remaining_qty']);
                $result['availableQty'] = 0;//$result['qty2'] - $result['sold_qty'] - $result['allocatedQty'];

                $result['uom_name']         = $Row['uom_name'];    
                $result['type']             = $Row['type'];    
                $result['trailtype']        = $Row['trailtype']; 
                $result['order_id']         = $Row['order_id'];
                $result['warehouse_id']     = $Row['warehouse_id'];
                $result['product_id']       = $Row['product_id'];
                $result['sale_status']      = $Row['sale_status'];
                $response['response'][]     = $result;                                
            }

            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {
            $response['response'][] = array();
            $response['ack'] = 1;
            $response['error'] = NULL;
        }
        //	print_r($response);exit;

        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData("StockActivity");
        return $response;
    }

    ############ purchase-cost-detail start ##############

    function get_purchase_cost_detail_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "select land_cost.id,land_cost.title,land_cost.cost, land_cost.landing_cost_currency,land_cost.landing_conversion_cost,
                       land_cost.landing_gl_account	as gl, gl_ac.account_code, gl_ac.name, c.code as currency_code, uom.title as uom_title
                from product_cost_details as land_cost
                left join company_gl_accounts as gl_ac on gl_ac.id= land_cost.landing_gl_account
                left join currency as c on c.id= land_cost.landing_cost_currency
                left JOIN units_of_measure_setup as uom_stp ON uom_stp.id = land_cost.landing_cost_unit_of_measure
                left JOIN units_of_measure as uom ON uom.id = uom_stp.cat_id

                where land_cost.product_id=" . $attr['product_id'] . " and
                      land_cost.supp_id=" . $attr['supp_id'] . " and
                      c.company_id=" . $this->arrUser['company_id'] . "
                ORDER BY land_cost.created_date";

        //echo $Sql; exit;	//print_r($attr);exit;
        $RS = $this->objsetup->CSI($Sql);

        /*=============================================================*/
        /*               get purchase cost detail total Sql Start        */
        /*=============================================================*/

        $sum_Sql = "select
                       sum(land_cost.landing_conversion_cost) as total
                       from product_cost_details as land_cost
                       where land_cost.product_id=" . $attr['product_id'] . " and
                             land_cost.supp_id=" . $attr['supp_id'] . " and
                             land_cost.company_id=" . $this->arrUser['company_id'] . " ";

        $sum_RS = $this->objsetup->CSI($sum_Sql);

        if ($sum_RS->RecordCount() > 0) {
            $sum_Row = $sum_RS->FetchRow();
            $response['sum'] = $sum_Row['total'];
        }
        /*=============================================================*/
        /*               get purchase cost detail total Sql end        */
        /*=============================================================*/

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
        //	print_r($response);exit;
        return $response;
    }

    function get_purchase_cost_detail_total($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "SELECT SUM(land_cost.landing_conversion_cost) as total
                FROM product_cost_details as land_cost
                WHERE land_cost.product_id=" . $attr['product_id'] . " and
                      land_cost.supp_id=" . $attr['supp_id'] . " and
                      land_cost.company_id=" . $this->arrUser['company_id'] . " ";

        //echo $Sql; exit;	//print_r($attr);exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $response['response'] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        //	print_r($response);exit;
        return $response;
    }

    function get_purchase_cost_detail_byid($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "select land_cost.id,
                       land_cost.title,
                       land_cost.cost,
                       land_cost.landing_cost_currency,
                       land_cost.landing_cost_unit_of_measure,
                       land_cost.landing_conversion_cost,
                       land_cost.landing_gl_account	as gl,
                       gl_ac.account_code,
                       gl_ac.name
                from product_cost_details as land_cost
                left join company_gl_accounts as gl_ac on gl_ac.id= land_cost.landing_gl_account
                where land_cost.id=" . $attr['id'] . " limit 1";

        //echo $Sql; exit;	//print_r($attr);exit;

        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) 
        {
            while ($Row = $RS->FetchRow()) 
            {
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        //	print_r($response);exit;
        return $response;
    }

    function add_purchase_cost_detail($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $data_pass = "  tst.title='" . $arr_attr['title'] . "' and 
                        tst.product_id='" . $arr_attr['product_id'] . "' and 
                        tst.supp_id='" . $arr_attr['supp_id'] . "' ";
        $total = $this->objGeneral->count_duplicate_in_sql('product_cost_details', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO product_cost_details 
                                SET
                                    title='" . $arr_attr['title'] . "',
                                    product_id='" . $arr_attr['product_id'] . "',
                                    supp_id='" . $arr_attr['supp_id'] . "',
                                    landing_gl_account='" . $arr_attr['landing_cost_gl'] . "',
                                    landing_cost_currency='" . $arr_attr['landing_cost_currencys'] . "',
                                    landing_cost_unit_of_measure='" . $arr_attr['landing_cost_unit_of_measures'] . "',
                                    cost='" . $arr_attr['cost'] . "',
                                    landing_conversion_cost='" . $arr_attr['landing_conversion_cost'] . "',
                                    status=1,
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    user_id='" . $this->arrUser['id'] . "',
                                    AddedBy='" . $this->arrUser['id'] . "',
                                    created_date=UNIX_TIMESTAMP (NOW()),
                                    AddedOn=UNIX_TIMESTAMP (NOW())";

        $RS = $this->objsetup->CSI($Sql);
        if ($this->Conn->Affected_Rows() > 0) {

            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['msg'] = "Inserted";
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Not Added';
        }
        //$response = $this->objGeneral->run_query_exception($Sql);
        return $response;
    }

    function edit_purchase_cost_detail($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        $id = $arr_attr['id'];

        $data_pass = "  tst.title='" . $arr_attr['title'] . "' and 
                        tst.product_id='" . $arr_attr['product_id'] . "' and 
                        tst.supp_id='" . $arr_attr['supp_id'] . "' AND 
                        tst.id <> '" . $id . "'";
        $total = $this->objGeneral->count_duplicate_in_sql('product_cost_details', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE product_cost_details 
                            SET
                                title='".$arr_attr['title']."',
                                cost='$arr_attr[cost]',
                                landing_gl_account='$arr_attr[landing_cost_gl]',
                                landing_cost_currency='$arr_attr[landing_cost_currencys]',
                                landing_cost_unit_of_measure='$arr_attr[landing_cost_unit_of_measures]',
                                landing_conversion_cost='$arr_attr[landing_conversion_cost]',
                                ChangedBy='" . $this->arrUser['id'] . "',
                                ChangedOn=UNIX_TIMESTAMP (NOW())
                            WHERE id = " . $id . "   
                            Limit 1";

        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {

            $response['id'] = $id;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['msg'] = "Updated";

        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Not updated';
        }
        return $response;
    }

    function del_purchase_cost_detail($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "Delete from product_cost_details where id=" . $attr['id'];
        //echo $Sql; exit;	//print_r($attr);exit;
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

    ############ purchase-cost-detail end ##############

    ############ Warehouse Allocation Costs start ##############

    function add_warehouse_allocation_cost_category($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $id = $arr_attr['id'];
        $update_check = "";

        if ($arr_attr['id'] > 0)
            $update_check = "  AND tst.id <> " . $id . " ";

        $data_pass = " tst.cat_id='" . $arr_attr['cat_id'] . "' and 
                       tst.warehouse_id='" . $arr_attr['warehouse_id'] . "' 
                       $update_check";

        $total = $this->objGeneral->count_duplicate_in_sql('categories_warehouse_cost', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($id == 0) {

            $Sql = "INSERT INTO categories_warehouse_cost
                                SET
                                      cat_id='$arr_attr[cat_id]',
                                      warehouse_id='$arr_attr[warehouse_id]',
                                      cost='$arr_attr[cost]',
                                      currency_id='$arr_attr[currency_id]',
                                      cost_type_id='$arr_attr[cost_type_id]',
                                      user_id='" . $this->arrUser['id'] . "',
                                      company_id='" . $this->arrUser['company_id'] . "',
                                      status='$arr_attr[status]',
                                      AddedBy='" . $this->arrUser['id'] . "',
                                      AddedOn=UNIX_TIMESTAMP (NOW())";
            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
        } 
        else {
            $Sql = "UPDATE categories_warehouse_cost
                              SET
									cat_id='$arr_attr[cat_id]',
									warehouse_id='$arr_attr[warehouse_id]',
                                    cost='$arr_attr[cost]',
                                    currency_id='$arr_attr[currency_id]',
                                    cost_type_id='$arr_attr[cost_type_id]',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    status='$arr_attr[status]',
                                    ChangedBy='" . $this->arrUser['id'] . "',
                                    ChangedOn=UNIX_TIMESTAMP (NOW())
                                    WHERE id = " . $id . "   Limit 1";
            //echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
        }
        //echo $Sql;exit;

        if ($id > 0) {
            $response['id'] = $id;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record Inserted Successfully';
        } 
        else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
        }
        return $response;
    }

    function get_category_warehouse_allocation_cost($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";
        $response = array();

        $Sql = "SELECT  c.id as category_warehouse_id,
                        c.cost,
                        curr.name as crname,
                        wrh.name as warehouse,
                        CASE WHEN c.status = 1 THEN 'Active'
                             WHEN c.status = 0 THEN 'Inactive'
                        END AS cost_status,
                        CASE WHEN c.cost_type_id = 1 THEN 'Fixed'
                             WHEN c.cost_type_id = 2 THEN 'Hourly'
                             WHEN c.cost_type_id = 3 THEN 'Daily'
                             WHEN c.cost_type_id = 4 THEN 'Monthly'
                        END AS cost_type
                From categories_warehouse_cost  c
                left JOIN currency as curr on curr.id=c.currency_id
                left JOIN warehouse as wrh on wrh.id=c.warehouse_id
                where  c.cat_id=".$attr['cat_id']." and
                       c.company_id=" . $this->arrUser['company_id'] . "
                order by c.id ASC ";

        $RS = $this->objsetup->CSI($Sql);
        $response['total'] = $total;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['category_warehouse_id'];
                $result['warehouse'] = $Row['warehouse'];
                $result['currency'] = $Row['crname'];
                $result['Cost'] = $Row['cost'];
                $result['cost_frequency'] = $Row['cost_type'];
                $result['status'] = $Row['cost_status'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    ############ Warehouse Allocation Costs end ##############
    ############ Account Activity Start ##############

    function account_activity($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        /*print_r($attr);
        echo $attr["product_id"];
        exit;*/
        $Sql = "(SELECT d.id as invoice_id,
                        d.posting_date as invoice_date,
                        'Sale Invoice' as doc_type,
                        d.sale_order_code as code,
                        d.sell_to_cust_name as name,
                        od.qty as quantity,
                        uom.title as uomtitle, 
                        od.item_converted_price as amount,
                        currency.code as crcode,
                        wh.wrh_code as wrh_code
				FROM orders d
                left JOIN order_details as od on od.order_id=d.id
                left JOIN warehouse as wh ON wh.id = od.warehouse_id
                left JOIN units_of_measure_setup as uom_stp ON uom_stp.id = od.unit_measure_id
                left JOIN units_of_measure as uom ON uom.id = uom_stp.cat_id
                left JOIN currency on currency.id=d.currency_id
                where  d.status=1 AND 
                       od.item_id=" . $attr["product_id"] . " AND
                       d.company_id=" . $this->arrUser['company_id'] . "

	            )UNION(
	             SELECT  d.id as invoice_id,
                         d.invoice_date as invoice_date,
                         'Purchase Invoice' as doc_type,
                         d.invoice_code as code,
                         d.sell_to_cust_name as name,
                         inv_d.qty as quantity,
                         uom.title as uomtitle,
                         inv_d.item_converted_price as amount,
	                     currency.code as crcode,
                         wh.wrh_code as wrh_code
	             FROM srm_invoice  d
                 left JOIN srm_invoice_detail as inv_d on inv_d.invoice_id=d.id
                 left JOIN warehouse as wh ON wh.id = inv_d.warehouse_id
                 left JOIN units_of_measure_setup as uom_stp ON uom_stp.id = inv_d.unit_measure_id
                 left JOIN units_of_measure as uom ON uom.id = uom_stp.cat_id
                 left JOIN currency on currency.id=d.currency_id
                 where  d.status=1 AND 
                        inv_d.product_id=" . $attr["product_id"] . " AND 
                        d.company_id=" . $this->arrUser['company_id'] . "

                )UNION(
                    SELECT d.id as invoice_id,
                           d.posting_date as invoice_date,
                           'Sale Return' as doc_type,
                           d.return_order_code as code,
                           d.sell_to_cust_name as name,
                           od.qty as quantity,
                           uom.title as uomtitle, 
                           od.item_converted_price as amount,
                           currency.code as crcode,
                           wh.wrh_code as wrh_code
					FROM return_orders  d
                    left JOIN return_order_details as od on od.order_id=d.id
                    left JOIN warehouse as wh ON wh.id = od.warehouse_id
                    left JOIN units_of_measure_setup as uom_stp ON uom_stp.id = od.unit_measure_id
                    left JOIN units_of_measure as uom ON uom.id = uom_stp.cat_id
                    left JOIN currency on currency.id=d.currency_id
                    where d.status=1 AND 
                          od.item_id=" . $attr["product_id"] . " AND
                          d.company_id=" . $this->arrUser['company_id'] . "

				)UNION(
                    SELECT  d.id as invoice_id,
                            d.invoice_date as invoice_date,
                            'Purchase Return' as doc_type,
                            d.ret_invoice_code as code,
                            d.sell_to_cust_name as name,
                            inv_d.qty as quantity,
                            uom.title as uomtitle, 
                            inv_d.item_converted_price as amount,
                            currency.code as crcode,
                            wh.wrh_code as wrh_code
                    FROM srm_order_return  d
                    left JOIN srm_order_return_detail as inv_d on inv_d.invoice_id=d.id
                    left JOIN warehouse as wh ON wh.id = inv_d.warehouse_id
                    left JOIN units_of_measure_setup as uom_stp ON uom_stp.id = inv_d.unit_measure_id
                    left JOIN units_of_measure as uom ON uom.id = uom_stp.cat_id
                    left JOIN currency on currency.id=d.currency_id
                    where d.status=1 AND 
                          inv_d.product_id=" . $attr["product_id"] . " AND 
                          d.company_id=" . $this->arrUser['company_id'] . ")
	            ORDER BY invoice_date DESC";
        //echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                $result['id'] = $Row['invoice_id'];
                $result['posting_date'] = $this->objGeneral->convert_unix_into_date($Row['invoice_date']);
                $result['doc_type'] = $Row['doc_type'];
                $result['Invoice_code'] = $Row['code'];
                $result['Name'] = $Row['name'];
                $result['Quantity'] = $Row['quantity'];
                $result['U. O. M'] = $Row['uomtitle'];
                $result['Amount_in (LCY)'] = $Row['amount'];
                $result['warehouse_location Code'] = $Row['wrh_code'];
                /*$result['u. o. m.'] = $Row['unit_measure_name'];
                $result['quantity'] = $Row['quantity'];
                $result['remaining_stock'] = $Row['remaining_stock'];*/
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        //print_r($response);exit;
        return $response;
    }

    ############ Account Activity end ##############

    function getAddCostList($id)
    {
        $subQuery = "SELECT id 
        FROM  productcache as prd 
        WHERE prd.product_code IS NOT NULL AND 
             (prd.company_id=" . $this->arrUser['company_id'] . " )
             " . $where_clause . " ";
    
        //$subQuery = $this->objsetup->whereClauseAppender($subQuery,11);


        $Sql = "SELECT  addcost.id,
                        addcost.descriptionID,
                        addcost.description,
                        us.id as uomid,
                        us.title,
                        addcost.itemID,
                        addcost.cost_gl_code_id,
                        addcost.cost_gl_code,
                        gl.vatRateID,
                        priceoffer.moduleID
                FROM price_list_additional_cost as addcost
                LEFT JOIN priceofferitem as poi on addcost.priceID = poi.priceID and addcost.itemID = poi.itemID
                LEFT JOIN priceoffer on priceoffer.id = poi.priceID
                LEFT JOIN units_of_measure_setup c on c.id = poi.uomID
                LEFT JOIN units_of_measure us on us.id = c.cat_id
                LEFT JOIN gl_account gl on gl.id = addcost.cost_gl_code_id
                WHERE addcost.company_id = '" . $this->arrUser['company_id'] . "' AND
                      gl.company_id =  '" . $this->arrUser['company_id'] . "' AND
                      addcost.itemID IN (".$subQuery.")
                GROUP BY addcost.descriptionID,us.id,addcost.cost_gl_code_id";
                
                // GROUP BY addcost.descriptionID,us.title
        // echo $Sql;exit;//us.id //poi.uomID,priceoffer.name as priceOfferName
                        
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['descriptionID'] = $Row['descriptionID'];
                $result['description'] = $Row['description'];
                $result['uomID'] = $Row['uomid'];
                $result['uom'] = $Row['title'];
                $result['itemID'] = $Row['itemID'];
                $result['glAccountID'] = $Row['cost_gl_code_id'];
                $result['glAccountCode'] = $Row['cost_gl_code'];
                $result['addCostsupplierID'] = $Row['moduleID'];
                $result['vatRateID'] = $Row['vatRateID'];
                // $result['priceOfferName'] = $Row['priceOfferName'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else 
            $response['response'] = array();
        return $response;
    }

    ############ Template invoice ##############
    function putTemplateData($docID, $type)
    {
        if($type==1){

            $Sql1 = "INSERT INTO doc_header (company_id,doc_id,TYPE,po_order_no,po_supplier_no,NAME,address_1,address_2,city,postcode,county,contact_person,telephone,email,po_purchaser,
                                                po_consigment_no,po_supplier_order_no,invoice_date,po_supplier_invoice_no,order_date,po_requested_receipt_date,po_receipt_date,po_payable_bank,po_payment_terms,po_due_date,po_payment_method,po_currency)
                     SELECT " . $this->arrUser['company_id'] . "," . $docID . ", 1,inv.order_code,inv.sell_to_cust_no,inv.sell_to_cust_name,inv.sell_to_address,inv.sell_to_address2,inv.sell_to_city,inv.sell_to_post_code,inv.sell_to_county,inv.sell_to_contact_no,inv.cust_phone,inv.cust_email,inv.srm_purchase_code,inv.comm_book_in_no,inv.ship_to_contact,inv.invoice_date,inv.supp_order_no,inv.order_date,inv.requested_delivery_date,inv.receiptDate,inv.payable_bank,inv.payment_terms_code,inv.due_date,inv.payment_method_id,inv.currency_id
                        FROM srm_invoice AS inv
                        WHERE inv.id= '".$docID."';";
            $RS1 = $this->objsetup->CSI($Sql1); 

            $Sql2 = "INSERT INTO doc_detail (doc_header_id,TYPE,number,description,quantity,uom,warehouse,unit_price, discount_type, discount,vat_rate,vat)  
                     SELECT " . $docID . ", inv.type,inv.product_code,inv.product_name,inv.qty,inv.unit_measure,inv.warehouse,inv.unit_price,inv.discount_type,inv.discount_price,inv.vat,inv.vat_price
                        FROM srm_invoice_detail AS inv
                        WHERE inv.id= '".$docID."';";
            $RS2 = $this->objsetup->CSI($Sql2); 
        
        } elseif ($type==2) {

            $Sql1 = "INSERT INTO doc_header (company_id,doc_id,type,so_no,so_cust_no,name,address_1,address_2,city,postcode,county,contact_person,telephone,email,salesperson,customer_order_no,invoice_date,
                                                order_date,dispatch_date,so_requested_delivery_date,delivery_date,so_payable_bank,so_due_date,so_currency) 
                     SELECT " . $this->arrUser['company_id'] . "," . $docID . ", 2, sale_invioce_code, sell_to_cust_no,sell_to_cust_name,sell_to_address,sell_to_address2,sell_to_city,sell_to_post_code,sell_to_county,sell_to_contact_id,cust_phone,cust_email,sale_person,cust_order_no,posting_date,offer_date,dispatch_date,requested_delivery_date,delivery_date,bill_to_bank_name,due_date,currency_id
                        FROM orders AS inv
                        WHERE inv.id= '".$docID."';";
            $RS1 = $this->objsetup->CSI($Sql1); 

            $Sql2 = "INSERT INTO doc_detail (doc_header_id,TYPE,number,description,quantity,uom,warehouse,unit_price,discount_type,discount,vat_rate,vat)  
                     SELECT " . $docID . ", inv.type,inv.product_code,inv.item_name,inv.qty,inv.unit_measure,inv.warehouse,inv.unit_price,inv.discount_type,inv.discount_price,inv.vat_value,inv.vat_price
                        FROM order_details AS inv
                        WHERE inv.order_id= '".$docID."';";
            $RS2 = $this->objsetup->CSI($Sql2); 
            
        } elseif ($type==3) {

            $Sql1 = "INSERT INTO doc_header (company_id,doc_id,type,dn_order_no,dn_supplier_no,name,dn_apply_to_pi,address_1,address_2,city,postcode,county,country,contact_person,telephone,email,
                                            dn_purchaser,dn_supplier_ref_no,dn_supplier_cn_date,dn_supplier_cn_no,dn_date_dispatch,dn_supplier_receipt_date,dn_payable_bank,dn_payment_terms,dn_payment_method,dn_currency) 
                     SELECT " . $this->arrUser['company_id'] . "," . $docID . ", 3,inv.debitNoteCode,inv.supplierNo,inv.supplierName,inv.purchaseInvoice,inv.supplierAddress,inv.supplierAddress2,inv.supplierCity,inv.supplierPostCode,inv.supplierCounty,inv.supplierCountry,inv.supplierContactName,inv.supplierContactTelephone,inv.supplierContactEmail,inv.Purchaser,inv.supplierReferenceNo,inv.supplierCreditNoteDate,inv.supplierCreditNoteNo,inv.dispatchDate,inv.supplierReceiptDate,inv.payable_bank,inv.payment_terms_code,inv.payment_method_id,inv.currency_id
                        FROM srm_order_return AS inv
                        WHERE inv.id= '".$docID."' AND inv.type = 1;";
            $RS1 = $this->objsetup->CSI($Sql1); 

            $Sql2 = "INSERT INTO doc_detail (doc_header_id,TYPE,number,description,quantity,uom,warehouse,unit_price, discount_type, discount,vat_rate)  
                     SELECT " . $docID . ", inv.type,inv.product_code,inv.product_name,inv.qty,inv.unit_measure,inv.warehouse,inv.unit_price,inv.discount_type,inv.discount_price,inv.vat
                        FROM srm_order_return_detail AS inv
                        WHERE inv.id= '".$docID."';";
            $RS2 = $this->objsetup->CSI($Sql2); 

        } elseif ($type==4) {

            $Sql1 = "INSERT INTO doc_header (company_id,doc_id,TYPE,cn_order_no, cn_customer_no, NAME, cn_apply_to_si, address_1, address_2, city, postcode, county, contact_person, email, telephone, salesperson, invoice_date, order_date, cn_requested_receipt_date, cn_receipt_date, cn_currency) 
                     SELECT " . $this->arrUser['company_id'] . "," . $docID . ", 4, inv.return_order_code,inv.sell_to_cust_no,inv.sell_to_cust_name,inv.sale_invoice,inv.sell_to_address,inv.sell_to_address2,inv.sell_to_city,inv.sell_to_post_code,inv.sell_to_county,inv.sell_to_contact_no,inv.cust_email,inv.cust_phone,inv.sale_person,inv.posting_date,inv.offer_date,inv.requested_delivery_date,inv.delivery_date,inv.currency_id
                        FROM return_orders AS inv
                        WHERE inv.id= '".$docID."';";
            $RS1 = $this->objsetup->CSI($Sql1); 

            $Sql2 = "INSERT INTO doc_detail (doc_header_id,TYPE,number,description,quantity,uom,warehouse,unit_price, discount_type, discount,vat_rate)  
                     SELECT " . $docID . ", inv.type,inv.product_code,inv.item_name,inv.qty,inv.unit_measure,inv.warehouse,inv.unit_price,inv.discount_type,inv.discount_price,inv.vat_name
                        FROM return_order_details AS inv
                        WHERE inv.order_id= '".$docID."';";
            $RS2 = $this->objsetup->CSI($Sql2); 

        
        return $response;
        }
    }


    function chkForBrand($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if($attr['product_id'] >0){
            $product_id = $attr['product_id'];

            $Sql = "SELECT product_code,brand_id
                    FROM product
                    WHERE id = '" . $product_id . "' AND                                              
                          company_id=" . $this->arrUser['company_id'] . "
                    limit 1";

            // echo $Sql;
            $RS = $this->objsetup->CSI($Sql);
            // $Row = $RS->FetchRow();            
            
            $response['prevProductCode'] = $RS->fields['product_code'];
            $response['prevBrandID'] = $RS->fields['brand_id'];
        }

        $Sql = "SELECT mv.* 
                FROM ref_module_category_value mv
                WHERE  brand_id = '" . $attr['brand'] . "' AND                                              
                       mv.status=1 AND 
                       mv.company_id=" . $this->arrUser['company_id'] . "
                limit 1";

        // echo $Sql;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();

            /* $last_sequence_num = $Row['last_sequence_num'];
            $rangeFrom = $Row['range_from'];
            $rangeTo = $Row['range_to'];
            $moduleType = $Row['type']; */

            $response['moduleType'] = $Row['type'];
            $response['last_sequence_num'] = $Row['last_sequence_num'];
            $response['prefix'] = $Row['prefix'];
            $response['module_category_id'] = $Row['module_category_id'];
            $response['range_from'] = $Row['range_from'];
            $response['range_to'] = $Row['range_to'];
            $response['module_code_id'] = $Row['module_code_id'];

            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['moduleType'] = '';
            $response['ack'] = 0;
            $response['error'] = 'No module No. defines';
        }
        return $response;
    }

    // update Receipt Date for allocations in PO

    function updateReceiptDateChk($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $date_receivedUnConv = "";       
        
        if($arr_attr['receiptDate'] > 0){
            $date_receivedUnConv = "date_receivedUnConv = '" . $this->objGeneral->convertUnixDateIntoConvDate($arr_attr['receiptDate']) . "',";            
        } 
        else
            $date_receivedUnConv = "date_receivedUnConv = '(NULL)',";   

        $Sql = "UPDATE warehouse_allocation 
                                        SET
                                            date_received='" . $this->objGeneral->convert_date($arr_attr['receiptDate']) . "',
                                            ".$date_receivedUnConv."
                                            ChangedBy='" . $this->arrUser['id'] . "',
                                            ChangedOn='" . current_date . "'
                                        WHERE order_id = " . $arr_attr['invoice_id'] . " AND 
                                              type = 1 AND 
                                              purchase_return_status <> 1 AND 
                                              company_id = " . $this->arrUser['company_id'] . " ";

        // echo $Sql;

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

    function get_items_wieght($attr){
		
		$Sql3 = "SELECT * FROM items_weight_setup WHERE company_id=" . $this->arrUser['company_id'] ." ";
		// echo $Sql;exit;
		$RS3 = $this->objsetup->CSI($Sql3,'inventory_setup',sr_ViewPermission);
		// print_r($RS->RecordCount());exit;

		if ($RS3->RecordCount() > 0) {
            while ($Row3 = $RS3->FetchRow()) {
				foreach ($Row3 as $key => $value) {
					if (is_numeric($key))
					unset($Row3[$key]);
				}
				$res3[] = $Row3;				
			}
			$response['items_weight'] = $res3;

			$response['message'] = 'Got item Roles';
			$response['ack'] = 1;		
			$response['error'] = NULL;
		} else {
			$response['ack'] = 0;
			$response['success'] = 'Can\'t get item Roles';
		}
		return $response;
    }
    
    function saveItemRoles($attr){
        $updateFlag = 0;
        $unchagedFlag = 0;
        foreach ($attr['itemRoles'] as $key => $value){
            // print_r($value->permission);exit;
            $volume_permission =  ($value->volume_permission) ? 1 : 0;
            $weight_permission =  ($value->weight_permission) ? 1 : 0;

            $Sql = "UPDATE items_weight_setup SET volume_permission=".$volume_permission.",weight_permission=".$weight_permission."  WHERE id=".$value->id." AND company_id=".$this->arrUser['company_id'];
            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);

            if ($this->Conn->Affected_Rows() > 0) $updateFlag++;
            if ($this->Conn->Affected_Rows() == 0) $unchagedFlag++;
        }

        if ($updateFlag > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['success'] = 'Successfully updated Widget role';
        } elseif ($unchagedFlag > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Updated Successfully';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Can\'t update item role';
        }

        return $response;

    }

    function get_all_items_cost_description($attr){
            
        $this->objGeneral->mysql_clean($attr);

            $Sql = "SELECT  c.id,c.title as name , c.status,
                            CASE WHEN c.status = 0 THEN 'Inactive'
                                WHEN c.status = 1 THEN 'Active'
                                else ''
                            End  as astatus 
                    FROM  item_cost_description  c
                    where c.status <> -1 and
                        c.company_id=" . $this->arrUser['company_id']; 
            
            // echo $Sql;exit;
            //$RS = $this->CSI($Sql);
            $RS =  $this->objsetup->CSI($Sql);

            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {

                    foreach ($Row as $key => $value) {
                        if (is_numeric($key))
                            unset($Row[$key]);
                    }
                    $Row['value'] = 0;
                    $response['response'][] = $Row;              
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

    function saveUpdateCost($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $where_id=''; 

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "  tst.title = '".$attr['title']." ' ".$where_id." ";
        $total = $this->objGeneral->count_duplicate_in_sql('item_cost_description', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $id=$attr['id'];

        if ($id > 0){
            $Sql = "UPDATE item_cost_description
                                SET 
                                    title = '".$attr['title']."',
                                    status = '".$attr['statusid']."',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    ChangedBy='".$this->arrUser['id']."',
                                    ChangedOn='".current_date_time."'
                    WHERE id = ".$id."
                    Limit 1";
            //  echo $Sql; exit;
            $RS = $this->objsetup->CSI($Sql,'inventory_setup',sr_ViewPermission);

        }else{
            $Sql = "INSERT INTO item_cost_description
				                SET 
                                    title = '".$attr['title']."',
                                    status = '".$attr['statusid']."',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    AddedBy='".$this->arrUser['id']."',
                                    AddedOn='".current_date_time."',
                                    ChangedBy='".$this->arrUser['id']."',
                                    ChangedOn='".current_date_time."'";
            //  echo $Sql; exit;
            $RS = $this->objsetup->CSI($Sql,'inventory_setup',sr_ViewPermission);
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

    function get_item_cost_description($attr)
    {		
        $this->objGeneral->mysql_clean($attr);
    
        $Sql = "SELECT  c.id,c.title , c.status,
                        CASE WHEN c.status = 0 THEN 'Inactive'
                                WHEN c.status = 1 THEN 'Active'
                                else ''
                        End  as astatus 
                FROM  item_cost_description  c
                where c.status <> -1 and c.id='".$attr['id']."' and c.company_id=" . $this->arrUser['company_id']; 
        
        // echo $Sql;exit;
        //$RS = $this->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql,'inventory_setup',sr_ViewPermission);

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

    function delete_item_cost_description($attr)
    {
        // print_r($attr);exit;
        $this->objGeneral->mysql_clean($attr);
        /* SET status=".DELETED_STATUS."  */
        $Sql = "DELETE FROM item_cost_description WHERE id = ".$attr['id']." AND company_id=".$this->arrUser['company_id']."";

        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'This cannot be deleted .';
            $response['SQL'] = $Sql;
        }
        return $response;
    }


}

?>