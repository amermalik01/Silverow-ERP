<?php
// error_reporting(E_ERROR);
require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/General.php");
require_once(SERVER_PATH. "/classes/Setup.php");

class Warehouse extends Xtreme
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

    // static	
    function delete_update_status($table_name, $column, $id)
    {
        //	$Sql = "DELETE FROM $table_name 	WHERE id = $id Limit 1 ";
        $Sql = "DELETE FROM $table_name WHERE id = $id Limit 1";
        // echo $Sql;exit;
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

    function delete_chk_item_add_cost($table_name, $column, $id)
    {
        $Sql = "SELECT SR_CheckTransactionBeforeDelete($id, ".$this->arrUser['company_id'].", 22,0)";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if($RS->fields[0] == 'success'){
            $Sql1 = "DELETE FROM $table_name WHERE id = $id Limit 1";
            // echo $Sql;exit;
            $RS1 = $this->objsetup->CSI($Sql1);
            if ($this->Conn->Affected_Rows() > 0) {
                $response['ack'] = 1;
                $response['error'] = NULL;
                $response['success'] = 'Record Deleted Successfully';
            } else {
                $response['ack'] = 2;
                $response['error'] = 'Record can\'t be deleted!';
            }
            return $response;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Please remove any Item Additional Costs before deleting.';
        }
       
        return $response;
    }
    
    function delete_warehouse($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "UPDATE warehouse SET status=".DELETED_STATUS." WHERE id = ".$arr_attr['id']."  AND SR_CheckTransactionBeforeDelete(".$arr_attr['id'].", ".$this->arrUser['company_id'].", 5,0) = 'success'";
        // print_r($Sql);exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $Sql1 = "SELECT SR_CheckTransactionBeforeDelete(".$arr_attr['id'].", ".$this->arrUser['company_id'].", 5,0) AS error_msg";
            $RS1 = $this->objsetup->CSI($Sql1);
            $response['error'] = "This Warehouse is being used in another record!";
        }

        return $response;
    }

    function get_data_by_id($table_name, $id)
    {
        $Sql = "SELECT *
				FROM ".$table_name."
				WHERE id=".$id." and company_id = ".$this->arrUser['company_id']."
				LIMIT 1";

        $RS = $this->objsetup->CSI($Sql, "warehouse", sr_ViewPermission);        

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();

            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'] = $Row;
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

        $Sql = "SELECT   c.id, c.name, c.wrh_code FROM  warehouse  c 
                where  c.status=1 and c.company_id=" . $this->arrUser['company_id'] . "
                group by  c.name "; //c.user_id=".$this->arrUser['id']."

        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['wrh_code'] . '-' . $Row['name'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }

        return $response;
    }

    function stockReportPredatalistings($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT  wh.name,wh.id,wh.wrh_code
                FROM warehouse_bin_location  c
                LEFT JOIN warehouse as wh on wh.id =c.warehouse_id
                WHERE c.status=1 AND 
                      c.company_id=" . $this->arrUser['company_id'] . " 
                GROUP BY wh.id 
                ORDER BY wh.id DESC ";

        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['no.'] = $Row['wrh_code'];
                $result['name'] = $Row['name'];
                $response['warehouse'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response = array();
        }

        $Sql2 = "SELECT  c.title,c.id
                 FROM warehouse_bin_location  c
                 WHERE  c.status=1 AND 
                        c.company_id=" . $this->arrUser['company_id'] . " 
                 ORDER BY c.id DESC ";

        //echo $Sql2;exit;
        $RS2 = $this->objsetup->CSI($Sql2);

        if ($RS2->RecordCount() > 0) {
            while ($Row2 = $RS2->FetchRow()) {
                $result2 = array();
                $result2['id'] = $Row2['id'];
                $result2['title'] = $Row2['title'];
                $response['location'][] = $result2;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        }

        return $response;
    }

    function get_warehouse_listings($attr)
    {
        $searchKeyword = '';
        $searchKeyword = $attr['searchKeyword'];
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";

        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.",$attr,$fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.",$attr,$fieldsMeta);

        $where = " tbl.company_id = " . $this->arrUser['company_id'];    
        $response = array();

        $Sql = "SELECT * FROM (SELECT   c.direct_line,
                                        c.type,
                                        warehouse_storage_type.title as warehouse_type, 
                                        c.mobile, 
                                        c.id as rec_id,
                                        c.wrh_code, 
                                        c.name, 
                                        c.contact_person, 
                                        c.city, 
                                        c.postcode, 
                                        c.phone, 
                                        c.job_title, 
                                        c.fax, 
                                        c.email,
                                        c.company_id
                                From warehouse  c
                                left JOIN warehouse_storage_type on warehouse_storage_type.id=c.type
                                where   c.status=1) AS tbl 
                WHERE 1 and ".$where.$where_clause." ";
        //echo $Sql;exit;//order by c.id DESC 
        // $RS = $this->objsetup->CSI($Sql);

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        
        if ($order_clause == "")
            $order_type = " Order BY tbl.rec_id ASC ";
        else
            $order_type = $order_clause;

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        $RS = $this->objsetup->CSI($response['q'], "warehouse", sr_ViewPermission);
        $response['q'] = '';
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['rec_id'];
                $result['no.'] = $Row['wrh_code'];//'WRH' . $Row['crm_no'];
                $result['wrh_code'] = $Row['wrh_code'];//'WRH' . $Row['crm_no'];
                $result['name'] = $Row['name'];
                $result['contact_person'] = $Row['contact_person'];
                $result['job_title'] = $Row['job_title'];
                $result['phone'] = $Row['phone'];
                // $result['fax'] = $Row['fax'];
                $result['direct_line'] = $Row['direct_line'];                
                $result['mobile'] = $Row['mobile'];
                $result['email'] = $Row['email'];
                $result['city'] = $Row['city'];
                $result['postcode'] = $Row['postcode'];
                $result['warehouse_type'] = $Row['warehouse_type'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 1;
            $response['error'] = NULL;
        }

        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData("Warehouse");
        return $response;
    }

    function add_warehouse($arr_attr)
    {    
        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['Parameter2'] = 'id:'.$arr_attr['id'];
        $srLogTrace['ErrorMessage'] = "";

        $this->objsetup->SRTraceLogsPHP($srLogTrace);
        
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
        $this->objGeneral->mysql_clean($arr_attr);

        //	print_r($arr_attr);exit;
        $variable = '';
        $id = $arr_attr['id'];

        $update_check = "";
        if ($arr_attr['id'] > 0)
            $update_check = "  AND tst.id <> " . $id . " ";

        $data_pass = "   tst.status=1 AND tst.wrh_code='" . $arr_attr['wrh_code'] . "' ".$update_check;
        $total = $this->objGeneral->count_duplicate_in_sql('warehouse', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $wrh_no         = ($arr_attr['wrh_no'] != '')?$arr_attr['wrh_no']:'0';
        // $support_person = ($arr_attr['support_person'] != '')?$arr_attr['support_person']:'0';
        // $salesperson_id = ($arr_attr['salesperson_id'] != '')?$arr_attr['salesperson_id']:'0';
        $turnover       = ($arr_attr['turnover'] != '')?$arr_attr['turnover']:'0';
        $internal_sales = ($arr_attr['internal_sales'] != '')?$arr_attr['internal_sales']:'0';
        $company_type   = ($arr_attr['company_type'] != '')?$arr_attr['company_type']:'0';
        $source_of_crm  = ($arr_attr['source_of_crm'] != '')?$arr_attr['source_of_crm']:'0';
        $buying_grp     = ($arr_attr['buying_grp'] != '')?$arr_attr['buying_grp']:'0';
        $converted_price= ($arr_attr['converted_price'] != '')?$arr_attr['converted_price']:'0';
        $currency_ids = (isset($arr_attr['currency_ids']) && $arr_attr['currency_ids'] != '')? $arr_attr['currency_ids']: 0;  
        $country_ids = (isset($arr_attr['country_ids']) && $arr_attr['country_ids'] != '')? $arr_attr['country_ids']: 0;  
        $salesperson_id = (isset($arr_attr['salesperson_id']) && $arr_attr['salesperson_id'] != '')? $arr_attr['salesperson_id']: 0;  
        $support_person = (isset($arr_attr['support_person']) && $arr_attr['support_person'] != '')? $arr_attr['support_person']: 0;  
        $generate = (isset($arr_attr['generate']) && $arr_attr['generate'] !='') ? $arr_attr['generate'] : 0;

        if ($id == 0) {

            $Sql = "INSERT INTO warehouse SET
                                            wrh_no='".$wrh_no."',
                                            wrh_code='".$arr_attr['wrh_code']."',
                                            name='".$arr_attr['name']."',
                                            type='".$arr_attr['type']."',
                                            contact_person='".$arr_attr['contact_person']."',
                                            address_1='".$arr_attr['address_1']."',
                                            job_title='".$arr_attr['job_title']."',
                                            address_2='".$arr_attr['address_2']."',
                                            phone='".$arr_attr['phone']."',
                                            city='".$arr_attr['city']."',
                                            fax='".$arr_attr['fax']."',
                                            county='".$arr_attr['county']."',
                                            country_id='".$country_ids."',
                                            mobile='".$arr_attr['mobile']."',
                                            postcode='".$arr_attr['postcode']."',
                                            direct_line='".$arr_attr['direct_line']."',
                                            support_person='".$support_person."',
                                            email='".$arr_attr['email']."',
                                            generate='".$generate."',
                                            dispatchNoteEmail='".$arr_attr['dispatchNoteEmail']."',
                                            salesperson_id='".$salesperson_id."',
                                            turnover='".$turnover."',
                                            internal_sales='".$internal_sales."',
                                            company_type='".$company_type."',
                                            source_of_crm='".$source_of_crm."',
                                            web_address='".$arr_attr['web_address']."',
                                            buying_grp='".$buying_grp."',
                                            credit_limit='".$arr_attr['credit_limit']."',
                                            purchase_code='".$arr_attr['purchase_code']."',
                                            purchase_code_id='".$arr_attr['purchase_code_id']."',
                                            currency_id='".$currency_ids."',
											storage='".$arr_attr['storage']."',
											converted_price='".$converted_price."',
										    user_id='" . $this->arrUser['id'] . "',                                            
                                            AddedBy='" . $this->arrUser['id'] . "',
                                            AddedOn='" . current_date . "',
                                            status=1,
                                            company_id='" . $this->arrUser['company_id'] . "'";
            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
            $variable = 'insert';
            //exit;
            // }
        } else {
            $Sql = "UPDATE warehouse SET  
                                      name='".$arr_attr['name']."',
                                      type='".$arr_attr['type']."',
                                      contact_person='".$arr_attr['contact_person']."',
                                      address_1='".$arr_attr['address_1']."',
                                      job_title='".$arr_attr['job_title']."',
                                      address_2='".$arr_attr['address_2']."',
                                      phone='".$arr_attr['phone']."',
                                      city='".$arr_attr['city']."',
                                      fax='".$arr_attr['fax']."',
                                      county='".$arr_attr['county']."',
                                      country_id='".$country_ids."',
                                      mobile='".$arr_attr['mobile']."',
                                      postcode='".$arr_attr['postcode']."',
                                      support_person='".$support_person."',
                                      direct_line='".$arr_attr['direct_line']."',
                                      email='".$arr_attr['email']."',
                                      generate='".$generate."',
                                      dispatchNoteEmail='".$arr_attr['dispatchNoteEmail']."',
                                      salesperson_id='".$salesperson_id."',
                                      turnover='".$turnover."',
                                      internal_sales='".$internal_sales."',
                                      company_type='".$company_type."',
                                      source_of_crm='".$source_of_crm."',
                                      status='".$arr_attr['status']."',
                                      web_address='".$arr_attr['web_address']."',
                                      buying_grp=".$buying_grp.",
                                      credit_limit='".$arr_attr['credit_limit']."',
                                      currency_id='".$currency_ids."',
                                      purchase_code='".$arr_attr['purchase_code']."',
                                      purchase_code_id='".$arr_attr['purchase_code_id']."',
                                      storage='".$arr_attr['storage']."',
                                      ChangedBy='" . $this->arrUser['id'] . "',
                                      ChangedOn='" . current_date . "',
									  converted_price='$converted_price'
                                      WHERE id = " . $id . "   Limit 1";
            $RS = $this->objsetup->CSI($Sql);
        }
          	// echo $Sql;exit;

        if ($id > 0) {
            $response['id'] = $id;
            $response['info'] = $variable;
            $response['ack'] = 1;
            $response['error'] = NULL; $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['Parameter2'] = 'id:' . $id;
            $srLogTrace['input_text'] = $Sql;

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        } else {
            $response['id'] = 0;
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = "Error Code: ".$srLogTrace['ErrorCode']."  -- Message: 'Record not inserted'  -- Function: ". __FUNCTION__."  -- Query: ".$Sql." ";

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }

        return $response;
    }

    function convert($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if ($attr['module'] == 1) {
            $Sqls = "SELECT max(customer_no) as count	FROM warehouse";
            $crm = $this->objsetup->CSI($Sqls)->FetchRow();

            $number = $crm['count'] + 1;

            $Sql = "UPDATE warehouse SET type = ".$attr['type'].", customer_no = ".$number."
					WHERE id = ".$attr['id']." ";

            //echo $Sql; exit;
        } else {
            $Sqls = "SELECT max(crm_no) as count	FROM warehouse";
            $crm = $this->objsetup->CSI($Sqls)->FetchRow();

            $number = $crm['count'] + 1;

            $Sql = "UPDATE warehouse SET type = ".$attr['type'].", crm_no = ".$number."
				WHERE id = ".$attr['id']." ";
        }

        /* $Sql = "UPDATE crm SET type = ".$attr['type']."
          WHERE id = $attr['id']"; */

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

    function get_warehouse_code($attr)
    {
        $Sql = "SELECT max(id) as count	FROM warehouse";
        $crm = $this->objsetup->CSI($Sql)->FetchRow();
        $nubmer = $crm['count'];
        if ($attr['is_increment'] == 1 || $nubmer == '')
            $nubmer++;
        //$nubmer=$nubmer+1;
        $response['code'] = 'WRH' . $this->objGeneral->module_item_prefix($nubmer);
        $response['number'] = $this->objGeneral->module_item_prefix($nubmer);
        return $response;
    }

    //----------------Alt Contact Module----------------------

    function get_alt_contacts($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";
        $response = array();


        $Sql = "SELECT c.id,c.location,c.contact_name,c.job_title,c.direct_line,c.mobile,c.email 
                From warehouse_alt_contact  c
                where  c.wrh_id=".$attr['id']." and c.status=1 and c.company_id=" . $this->arrUser['company_id'] . "
                order by c.id ASC ";

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['contact_name'] = $Row['contact_name'];
                $result['job_title'] = $Row['job_title'];
                $result['location_name'] = $Row['location'];
                $result['direct_line'] = $Row['direct_line'];
                $result['mobile'] = $Row['mobile'];
                $result['email'] = $Row['email'];
                //	$result['status'] = ($Row['status'] == 1)?"Inactive":"Active";

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_alt_contacts_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = "";
        $where_clause = "AND company_id =" . $this->arrUser['company_id'];

        if (!empty($attr['keyword'])) {
            $where_clause .= " AND contact_name LIKE '%".$attr['keyword']."%' ";
        }

        $response = array();

        $Sql = "SELECT id, contact_name, direct_line, mobile, email
				FROM warehouse_alt_contact
				WHERE 1 " . $where_clause . " 
				ORDER BY id ASC";

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
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
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_alt_contact($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        //print_r($arr_attr);exit;
        $id = $arr_attr['id'];

        $update_check = "";

        if ($arr_attr['id'] > 0)
            $update_check = "  AND tst.id <> " . $id . " ";

        $data_pass = " tst.contact_name='" . $arr_attr['contact_name'] . "' ".$update_check;
        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_alt_contact', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $country = (isset($arr_attr['countrys']) && $arr_attr['countrys'] != '')?$arr_attr['countrys']:'0';

        if ($id == 0) {

            $Sql = "INSERT INTO warehouse_alt_contact
                                SET
                                    location='".$arr_attr['depot']."',
                                    location_adress='".$arr_attr['location_adress']."',
                                    depot='".$arr_attr['depot']."',
                                    contact_name='".$arr_attr['contact_name']."',
                                    job_title='".$arr_attr['job_title']."',
                                    address_1='".$arr_attr['address_1']."',
                                    address_2='".$arr_attr['address_2']."',
                                    phone='".$arr_attr['phone']."',
                                    city='".$arr_attr['city']."',
                                    fax='".$arr_attr['fax']."',
                                    county='".$arr_attr['county']."',
                                    country='".$country."',
                                    mobile='".$arr_attr['mobile']."',
                                    postcode='".$arr_attr['postcode']."',
                                    direct_line='".$arr_attr['direct_line']."',
                                    email='".$arr_attr['email']."',
                                    web_add='".$arr_attr['web_add']."',
                                    wrh_id='".$arr_attr['wrh_id']."',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "'";

            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
            
        } else {
            $Sql = "UPDATE warehouse_alt_contact
                            SET
								  location='".$arr_attr['depot']."',
								  location_adress='".$arr_attr['location_adress']."',
								  depot='".$arr_attr['depot']."',
								  contact_name='".$arr_attr['contact_name']."',
								  job_title='".$arr_attr['job_title']."',
								  address_1='".$arr_attr['address_1']."',
								  address_2='".$arr_attr['address_2']."',
								  phone='".$arr_attr['phone']."',
								  city='".$arr_attr['city']."',
								  fax='".$arr_attr['fax']."',
								  county='".$arr_attr['county']."',
								  country='".$country."',
								  mobile='".$arr_attr['mobile']."',
								  postcode='".$arr_attr['postcode']."',
								  direct_line='".$arr_attr['direct_line']."',
								  email='".$arr_attr['email']."',
								  web_add='".$arr_attr['web_add']."'
                            WHERE id = " . $id . "
                            Limit 1";

            $RS = $this->objsetup->CSI($Sql);
        }
        // echo $Sql;exit;

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

    //--------------------   Warehouse Additional Cost Title Start--------------------

    function get_warehouse_loc_additional_cost_title()
    {
        $response = array();
        $Sql = "SELECT c.id,c.title
                From warehouse_loc_additional_cost_title c
                where  c.company_id=" . $this->arrUser['company_id'] . "
                order by id ASC ";

        $RS = $this->objsetup->CSI($Sql);

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
        }
        return $response;
    }

    function add_warehouse_loc_additional_cost_title($arr_attr)
    {
        $data_pass = "   tst.title='" . $arr_attr['title'] . "'";
        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_loc_additional_cost_title', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO warehouse_loc_additional_cost_title SET title='".$arr_attr['title']."', company_id='" . $this->arrUser['company_id'] . "'";
        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

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
    //--------------------   Warehouse Additional Cost Title End --------------------

    ////--------------------   Warehouse Storage Type Start--------------------

    function get_warehouse_storage_type()
    {
        $response = array();

        $Sql = "SELECT c.id,c.title
                From warehouse_storage_type c
                where c.company_id=" . $this->arrUser['company_id'] . "
                ORDER BY id ASC ";

        $RS = $this->objsetup->CSI($Sql);


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
        }
        return $response;
    }

    function add_warehouse_storage_type($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        
        $sql_total = "SELECT  count(id) as total	
                      FROM warehouse_storage_type
                      WHERE  title='" . $arr_attr['title'] . "' AND  
                            company_id=" . $this->arrUser['company_id'] . " 
                      Limit 1";
        // echo $sql_total;exit;

        $rs_count = $this->objsetup->CSI($sql_total);


        if ($rs_count->fields['total'] > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO warehouse_storage_type SET title='".$arr_attr['title']."', company_id='" . $this->arrUser['company_id'] . "'";
        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

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
    //--------------------   Warehouse Storage Type End--------------------
    //----------------BIN location Module----------------------
    function get_bin_location($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";

        $response = array();

        $Sql = "SELECT c.id as wrh_locid,c.title as bintitle,c.warehouse_loc_sdate,c.warehouse_loc_edate,c.bin_cost,curr.code as crname,dim.title as dimtitle,
		        CASE  WHEN c.status = 1 THEN 'Active'
		              WHEN c.status = 2 THEN 'Inactive'
		              WHEN c.status = 0 THEN 'Delete'
		              END AS warehouse_status,
		        CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
		              WHEN c.cost_type_id = 2 THEN 'Daily'
		              WHEN c.cost_type_id = 3 THEN 'Weekly'
		              WHEN c.cost_type_id = 4 THEN 'Monthly'
		              WHEN c.cost_type_id = 5 THEN 'Annually'
		              END AS cost_type,
		        (SELECT id From warehouse_loc_additional_cost where warehouse_bin_loc_id=c.id and status=1 limit 1 ) as add_cost,
		        0 as cost_history,
		        (SELECT id From product_warehouse_location where warehouse_loc_id=c.id and status=1 limit 1 ) as item_assign
                From warehouse_bin_location  c
                left JOIN currency as curr on curr.id=c.currency_id
                left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                where  c.warehouse_id=" . $attr['wrh_id'] . " and c.parent_id=0 and c.status=" . $attr['status_id'] . " and
                 c.company_id=" . $this->arrUser['company_id'] . "
                 order by c.id ASC ";
        // echo $Sql; exit;
        //(SELECT id From warehouse_bin_loc_history where warehouse_loc_id=c.id limit 1 )

        //, (SELECT sum(cost) as total From warehouse_loc_additional_cost where warehouse_bin_loc_id=c.id ) as add_cost_total


        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['wrh_locid'];
                $result['Storage_location'] = $Row['bintitle'];
                $result['parent'] = 0;
                $result['Start_date'] = $this->objGeneral->convert_unix_into_date($Row['warehouse_loc_sdate']);

                // + $Row['add_cost_total']
                $result['cost_history'] = $Row['cost_history'];
                $result['item_assign'] = $Row['item_assign'];
                $result['Unit_of Measure'] = $Row['dimtitle'];
                $result['cost_frequency'] = $Row['cost_type'];
                /* if ($Row['warehouse_loc_edate'] > 0)
                    $result['End_date'] = $this->objGeneral->convert_unix_into_date($Row['warehouse_loc_edate']);
                else
                    $result['End_date'] = "-"; */

                // if (strlen($Row['add_cost']) > 0)
                $result['add_cost'] = $Row['add_cost'];
                $result['status'] = $Row['warehouse_status'];
                $result['Currency'] = $Row['crname'];

                if ($Row['bin_cost'] > 0)
                    $result['Cost'] = $Row['bin_cost'];
                else
                    $result['Cost'] = "-";


                $response['response'][] = $result;


                $Sql_subparent = "SELECT c.id as wrh_locid,c.title as bintitle,c.warehouse_loc_sdate,c.warehouse_loc_edate,c.bin_cost,curr.code as crname,dim.title as dimtitle,
                                    CASE  WHEN c.status = 1 THEN 'Active'
                                          WHEN c.status = 0 THEN 'Inactive'
                                          END AS warehouse_status,
                                    CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
                                          WHEN c.cost_type_id = 2 THEN 'Daily'
                                          WHEN c.cost_type_id = 3 THEN 'Weekly'
                                          WHEN c.cost_type_id = 4 THEN 'Monthly'
                                          WHEN c.cost_type_id = 5 THEN 'Annually'
                                          END AS cost_type,
                                    (SELECT id From warehouse_loc_additional_cost where warehouse_bin_loc_id=c.id and status=1 limit 1 ) as add_cost,
                                    0 as cost_history,
                                    (SELECT id From product_warehouse_location where warehouse_loc_id=c.id and status=1 limit 1 ) as item_assign

                                    From warehouse_bin_location  c
                                    left JOIN currency as curr on curr.id=c.currency_id
                                    left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                                    left JOIN company on company.id=c.company_id
                                    where  c.warehouse_id=".$attr['wrh_id']." and c.parent_id=" . $Row['wrh_locid'] . " and c.status=1 and
                                     c.company_id=" . $this->arrUser['company_id'] . "
                                     order by c.id ASC ";
                //,(SELECT sum(cost) as total From warehouse_loc_additional_cost where warehouse_bin_loc_id=c.id ) as add_cost_total

                $RS_subparent = $this->objsetup->CSI($Sql_subparent);

                if ($RS_subparent->RecordCount() > 0) {
                    while ($Row_subparent = $RS_subparent->FetchRow()) {
                        $result = array();
                        $result['id'] = $Row_subparent['wrh_locid'];
                        $result['Storage_location'] = $Row_subparent['bintitle'];
                        $result['parent'] = 1;
                        $result['Start_date'] = $this->objGeneral->convert_unix_into_date($Row_subparent['warehouse_loc_sdate']);
                        // + $Row_subparent['add_cost_total']
                        $result['cost_history'] = $Row_subparent['cost_history'];
                        $result['item_assign'] = $Row_subparent['item_assign'];
                        $result['Unit_of Measure'] = $Row_subparent['dimtitle'];
                        $result['cost_frequency'] = $Row_subparent['cost_type'];

                        if ($Row_subparent['warehouse_loc_edate'] > 0)
                            $result['End_date'] = $this->objGeneral->convert_unix_into_date($Row_subparent['warehouse_loc_edate']);
                        else
                            $result['End_date'] = "-";

                        //if (strlen($Row_subparent['add_cost']) > 0)
                        $result['add_cost'] = $Row_subparent['add_cost'];
                        $result['status'] = $Row_subparent['warehouse_status'];
                        $result['Currency'] = $Row_subparent['crname'];

                        if ($Row_subparent['bin_cost'] > 0)
                            $result['Cost'] = $Row_subparent['bin_cost'];
                        else
                            $result['Cost'] = "-";


                        $response['response'][] = $result;

                        $Sql_sub_subparent = "SELECT c.id as wrh_locid,c.title as bintitle,c.warehouse_loc_sdate,c.warehouse_loc_edate,c.bin_cost,curr.code as crname,dim.title as dimtitle,
                                                CASE  WHEN c.status = 1 THEN 'Active'
                                                      WHEN c.status = 0 THEN 'Inactive'
                                                      END AS warehouse_status,
                                                CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
                                                      WHEN c.cost_type_id = 2 THEN 'Daily'
                                                      WHEN c.cost_type_id = 3 THEN 'Weekly'
                                                      WHEN c.cost_type_id = 4 THEN 'Monthly'
                                                      WHEN c.cost_type_id = 5 THEN 'Annually'
                                                      END AS cost_type,
                                                (SELECT id From warehouse_loc_additional_cost where warehouse_bin_loc_id=c.id and status=1 limit 1 ) as add_cost,
                                                0 as cost_history,
                                                (SELECT id From product_warehouse_location where warehouse_loc_id=c.id and status=1 limit 1 ) as item_assign

                                                From warehouse_bin_location  c
                                                left JOIN currency as curr on curr.id=c.currency_id
                                                left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                                                where  c.warehouse_id=".$attr['wrh_id']." and c.parent_id=" . $Row_subparent['wrh_locid'] . " and c.status=1 and c.company_id=" . $this->arrUser['company_id'] . "
                                                order by c.id ASC ";
                        //, (SELECT sum(cost) as total From warehouse_loc_additional_cost where warehouse_bin_loc_id=c.id ) as add_cost_total

                        $RS_sub_subparent = $this->objsetup->CSI($Sql_sub_subparent);

                        if ($RS_sub_subparent->RecordCount() > 0) {
                            while ($Row_sub_subparent = $RS_sub_subparent->FetchRow()) {
                                $result = array();
                                $result['id'] = $Row_sub_subparent['wrh_locid'];
                                $result['Storage_location'] = $Row_sub_subparent['bintitle'];
                                $result['parent'] = 2;
                                $result['Start_date'] = $this->objGeneral->convert_unix_into_date($Row_sub_subparent['warehouse_loc_sdate']);
                                // + $Row_sub_subparent['add_cost_total']
                                $result['cost_history'] = $Row_sub_subparent['cost_history'];
                                $result['item_assign'] = $Row_sub_subparent['item_assign'];
                                $result['Unit_of Measure'] = $Row_sub_subparent['dimtitle'];
                                $result['cost_frequency'] = $Row_sub_subparent['cost_type'];
                                if ($Row_sub_subparent['warehouse_loc_edate'] > 0)
                                    $result['End_date'] = $this->objGeneral->convert_unix_into_date($Row_sub_subparent['warehouse_loc_edate']);
                                else
                                    $result['End_date'] = "-";
                                // if (strlen($Row_sub_subparent['add_cost']) > 0)
                                $result['add_cost'] = $Row_sub_subparent['add_cost'];
                                $result['status'] = $Row_sub_subparent['warehouse_status'];
                                $result['Currency'] = $Row_sub_subparent['crname'];

                                if ($Row_sub_subparent['bin_cost'] > 0)
                                    $result['Cost'] = $Row_sub_subparent['bin_cost'];
                                else
                                    $result['Cost'] = "-";

                                $response['response'][] = $result;

                                $Sql_sub_subparent2 = "SELECT c.id as wrh_locid,c.title as bintitle,c.warehouse_loc_sdate,c.warehouse_loc_edate,c.bin_cost,curr.code as crname,dim.title as dimtitle,
                                                            CASE  WHEN c.status = 1 THEN 'Active'
                                                                  WHEN c.status = 0 THEN 'Inactive'
                                                                  END AS warehouse_status,
                                                            CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
                                                                  WHEN c.cost_type_id = 2 THEN 'Daily'
                                                                  WHEN c.cost_type_id = 3 THEN 'Weekly'
                                                                  WHEN c.cost_type_id = 4 THEN 'Monthly'
                                                                  WHEN c.cost_type_id = 5 THEN 'Annually'
                                                                  END AS cost_type,
                                                            (SELECT id From warehouse_loc_additional_cost where warehouse_bin_loc_id=c.id and status=1 limit 1 ) as add_cost,
                                                            0 as cost_history,
                                                            (SELECT id From product_warehouse_location where warehouse_loc_id=c.id and status=1 limit 1 ) as item_assign

                                                            From warehouse_bin_location  c
                                                            left JOIN currency as curr on curr.id=c.currency_id
                                                            left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                                                            where  c.warehouse_id=".$attr['wrh_id']." and c.parent_id=" . $Row_sub_subparent['wrh_locid'] . " and c.status=1 and c.company_id=" . $this->arrUser['company_id'] . "
                                                             order by c.id ASC ";
                                //, (SELECT sum(cost) as total From warehouse_loc_additional_cost where warehouse_bin_loc_id=c.id ) as add_cost_total

                                $RS_sub_subparent2 = $this->objsetup->CSI($Sql_sub_subparent2);

                                if ($RS_sub_subparent2->RecordCount() > 0) {
                                    while ($Row_sub_subparent2 = $RS_sub_subparent2->FetchRow()) {
                                        $result = array();
                                        $result['id'] = $Row_sub_subparent2['wrh_locid'];
                                        $result['Storage_location'] = $Row_sub_subparent2['bintitle'];
                                        $result['parent'] = 3;
                                        $result['Start_date'] = $this->objGeneral->convert_unix_into_date($Row_sub_subparent2['warehouse_loc_sdate']);

                                        // + $Row_sub_subparent2['add_cost_total']
                                        $result['cost_history'] = $Row_sub_subparent2['cost_history'];
                                        $result['item_assign'] = $Row_sub_subparent2['item_assign'];
                                        $result['Unit_of Measure'] = $Row_sub_subparent2['dimtitle'];
                                        $result['cost_frequency'] = $Row_sub_subparent2['cost_type'];

                                        if ($Row_sub_subparent2['warehouse_loc_edate'] > 0)
                                            $result['End_date'] = $this->objGeneral->convert_unix_into_date($Row_sub_subparent2['warehouse_loc_edate']);
                                        else
                                            $result['End_date'] = "-";

                                        // if (strlen($Row_sub_subparent2['add_cost']) > 0)
                                        $result['add_cost'] = $Row_sub_subparent2['add_cost'];
                                        $result['status'] = $Row_sub_subparent2['warehouse_status'];
                                        $result['Currency'] = $Row_sub_subparent2['crname'];

                                        if ($Row_sub_subparent2['bin_cost'] > 0)
                                            $result['Cost'] = $Row_sub_subparent2['bin_cost'];
                                        else
                                            $result['Cost'] = "-";

                                        $response['response'][] = $result;


                                        $Sql_sub_subparent3 = "SELECT c.id as wrh_locid,c.title as bintitle,c.warehouse_loc_sdate,c.warehouse_loc_edate,c.bin_cost,curr.code as crname,dim.title as dimtitle,
                                            CASE  WHEN c.status = 1 THEN 'Active'
                                                  WHEN c.status = 0 THEN 'Inactive'
                                                  END AS warehouse_status,
                                            CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
                                                  WHEN c.cost_type_id = 2 THEN 'Daily'
                                                  WHEN c.cost_type_id = 3 THEN 'Weekly'
                                                  WHEN c.cost_type_id = 4 THEN 'Monthly'
                                                  WHEN c.cost_type_id = 5 THEN 'Annually'
                                                  END AS cost_type,
                                            (SELECT id From warehouse_loc_additional_cost where warehouse_bin_loc_id=c.id and status=1 limit 1 ) as add_cost,
                                            0 as cost_history,
		                                    (SELECT id From product_warehouse_location where warehouse_loc_id=c.id and status=1 limit 1 ) as item_assign

                                            From warehouse_bin_location  c
                                            left JOIN currency as curr on curr.id=c.currency_id
                                            left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                                            where  c.warehouse_id=".$attr['wrh_id']." and c.parent_id=" . $Row_sub_subparent2['wrh_locid'] . " and c.status=1 and c.company_id=" . $this->arrUser['company_id'] . "
                                             order by c.id ASC ";
                                        //, (SELECT sum(cost) as total From warehouse_loc_additional_cost where warehouse_bin_loc_id=c.id ) as add_cost_total

                                        $RS_sub_subparent3 = $this->objsetup->CSI($Sql_sub_subparent3);

                                        if ($RS_sub_subparent3->RecordCount() > 0) {
                                            while ($Row_sub_subparent3 = $RS_sub_subparent3->FetchRow()) {
                                                $result = array();
                                                $result['id'] = $Row_sub_subparent3['wrh_locid'];
                                                $result['Storage_location'] = $Row_sub_subparent3['bintitle'];
                                                $result['parent'] = 4;
                                                $result['Start_date'] = $this->objGeneral->convert_unix_into_date($Row_sub_subparent3['warehouse_loc_sdate']);
                                                // + $Row_sub_subparent3['add_cost_total']
                                                $result['cost_history'] = $Row_sub_subparent3['cost_history'];
                                                $result['item_assign'] = $Row_sub_subparent3['item_assign'];
                                                $result['Unit_of Measure'] = $Row_sub_subparent3['dimtitle'];
                                                $result['cost_frequency'] = $Row_sub_subparent3['cost_type'];

                                                if ($Row_sub_subparent3['warehouse_loc_edate'] > 0)
                                                    $result['End_date'] = $this->objGeneral->convert_unix_into_date($Row_sub_subparent3['warehouse_loc_edate']);
                                                else
                                                    $result['End_date'] = "-";

                                                //if (strlen($Row_sub_subparent3['add_cost']) > 0)
                                                $result['add_cost'] = $Row_sub_subparent3['add_cost'];
                                                $result['status'] = $Row_sub_subparent3['warehouse_status'];
                                                $result['Currency'] = $Row_sub_subparent3['crname'];

                                                if ($Row_sub_subparent3['bin_cost'] > 0)
                                                    $result['Cost'] = $Row_sub_subparent3['bin_cost'];
                                                else
                                                    $result['Cost'] = "-";

                                                $response['response'][] = $result;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_alt_bin_loc_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "SELECT c.*  From warehouse_bin_location c where c.id=".$attr['id']." limit 1 ";
        // echo $Sql; exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {

            $Row = $RS->FetchRow();

            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $Row['warehouse_loc_sdate'] = $this->objGeneral->convert_unix_into_date($Row['warehouse_loc_sdate']);
            $Row['warehouse_loc_edate'] = $this->objGeneral->convert_unix_into_date($Row['warehouse_loc_edate']);

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_parent_bin_location($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();
        $where = '';

        if($attr['bin_loc_wrh_id']  >0)
            $where = "c.id <> $attr[bin_loc_wrh_id] and ";        

        $Sql = "SELECT c.id,c.title,c.parent_id,c.bin_cost,curr.code as crname,dim.title as dimtitle,
		        CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
		              WHEN c.cost_type_id = 2 THEN 'Daily'
		              WHEN c.cost_type_id = 3 THEN 'Weekly'
		              WHEN c.cost_type_id = 4 THEN 'Monthly'
		              WHEN c.cost_type_id = 5 THEN 'Annually'
		              END AS cost_type
                From warehouse_bin_location  c
                left JOIN currency as curr on curr.id=c.currency_id
                left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                where  c.warehouse_id = ".$attr['wrh_id']." and ".$where." c.status=1 and c.parent_id=0 and
                       c.company_id=" . $this->arrUser['company_id'] . "
                 order by c.id ASC ";


        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];

                if ($Row['bin_cost'] > 0)
                    $result['title'] = $Row['title'] . "(" . $Row['crname'] . " " . $Row['bin_cost'] . ", " . $Row['dimtitle'] . ", " . $Row['cost_type'] . ")";
                else
                    $result['title'] = $Row['title'];

                $response['response'][] = $result;

                $Sql_subparent = "SELECT c.id,c.title,c.parent_id,c.bin_cost,curr.code as crname,dim.title as dimtitle,
                                    CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
                                          WHEN c.cost_type_id = 2 THEN 'Daily'
                                          WHEN c.cost_type_id = 3 THEN 'Weekly'
                                          WHEN c.cost_type_id = 4 THEN 'Monthly'
                                          WHEN c.cost_type_id = 5 THEN 'Annually'
                                          END AS cost_type
                                    From warehouse_bin_location  c
                                    left JOIN currency as curr on curr.id=c.currency_id
                                    left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                                    where  c.warehouse_id=".$attr['wrh_id']." and ".$where." c.status=1 and c.parent_id=" . $Row['id'] . " and
                                           c.company_id=" . $this->arrUser['company_id'] . "
                                     order by c.id ASC ";

                // echo $Sql_subparent; exit;
                $RS_subparent = $this->objsetup->CSI($Sql_subparent);

                if ($RS_subparent->RecordCount() > 0) {
                    while ($Row_subparent = $RS_subparent->FetchRow()) {

                        $result['id'] = $Row_subparent['id'];

                        if ($Row_subparent['bin_cost'] > 0)
                            $result['title'] = " -- " . $Row_subparent['title'] . "(" . $Row_subparent['crname'] . " " . $Row_subparent['bin_cost'] . ", " . $Row_subparent['dimtitle'] . ", " . $Row_subparent['cost_type'] . ")";
                        else
                            $result['title'] = " -- " . $Row_subparent['title'];

                        $response['response'][] = $result;

                        $Sql_sub_subparent = "SELECT c.id,c.title,c.parent_id,c.bin_cost,curr.code as crname,dim.title as dimtitle,
                                                CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
                                                      WHEN c.cost_type_id = 2 THEN 'Daily'
                                                      WHEN c.cost_type_id = 3 THEN 'Weekly'
                                                      WHEN c.cost_type_id = 4 THEN 'Monthly'
                                                      WHEN c.cost_type_id = 5 THEN 'Annually'
                                                      END AS cost_type
                                                From warehouse_bin_location  c
                                                left JOIN currency as curr on curr.id=c.currency_id
                                                left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                                                where  c.warehouse_id=".$attr['wrh_id']." and ".$where." c.status=1 and 
                                                c.parent_id=" . $Row_subparent['id'] . " and
                                                c.company_id=" . $this->arrUser['company_id'] . "
                                                 order by c.id ASC ";

                        // echo $Sql_sub_subparent; exit;
                        $RS_sub_subparent = $this->objsetup->CSI($Sql_sub_subparent);

                        if ($RS_sub_subparent->RecordCount() > 0) {
                            while ($Row_sub_subparent = $RS_sub_subparent->FetchRow()) {

                                $result['id'] = $Row_sub_subparent['id'];

                                if ($Row_sub_subparent['bin_cost'] > 0)
                                    $result['title'] = " -- -- " . $Row_sub_subparent['title'] . "(" . $Row_sub_subparent['crname'] . " " . $Row_sub_subparent['bin_cost'] . ", " . $Row_sub_subparent['dimtitle'] . ", " . $Row_sub_subparent['cost_type'] . ")";
                                else
                                    $result['title'] = " -- -- " . $Row_sub_subparent['title'];

                                $response['response'][] = $result;


                                $Sql_sub_subparent2 = "SELECT c.id,c.title,c.bin_cost,c.parent_id,curr.code as crname,dim.title as dimtitle,
                                                        CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
                                                              WHEN c.cost_type_id = 2 THEN 'Daily'
                                                              WHEN c.cost_type_id = 3 THEN 'Weekly'
                                                              WHEN c.cost_type_id = 4 THEN 'Monthly'
                                                              WHEN c.cost_type_id = 5 THEN 'Annually'
                                                              END AS cost_type
                                                        From warehouse_bin_location  c
                                                        left JOIN currency as curr on curr.id=c.currency_id
                                                        left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                                                        where  c.warehouse_id=".$attr['wrh_id']." and ".$where." c.status=1 and c.parent_id=" . $Row_sub_subparent['id'] . " and c.company_id=" . $this->arrUser['company_id'] . "
                                                         order by c.id ASC ";

                                // echo $Sql_sub_subparent2; exit;
                                $RS_sub_subparent2 = $this->objsetup->CSI($Sql_sub_subparent2);

                                if ($RS_sub_subparent2->RecordCount() > 0) {
                                    while ($Row_sub_subparent2 = $RS_sub_subparent2->FetchRow()) {

                                        $result['id'] = $Row_sub_subparent2['id'];
                                        if ($Row_sub_subparent2['bin_cost'] > 0)
                                            $result['title'] = " -- -- -- " . $Row_sub_subparent2['title'] . "(" . $Row_sub_subparent2['crname'] . " " . $Row_sub_subparent2['bin_cost'] . ", " . $Row_sub_subparent2['dimtitle'] . ", " . $Row_sub_subparent2['cost_type'] . ")";
                                        else
                                            $result['title'] = " -- -- -- " . $Row_sub_subparent2['title'];

                                        $response['response'][] = $result;


                                        /*$Sql_sub_subparent3 = "SELECT c.id,c.title,c.parent_id
                                                From warehouse_bin_location  c
                                                left JOIN company on company.id=c.company_id
                                                where  c.warehouse_id=$attr[wrh_id] and c.status=1 and c.parent_id=" . $Row_sub_subparent2['id'] . " and
                                                 (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                                 order by c.id ASC ";

                                        // echo $Sql_sub_subparent3; exit;
                                        $RS_sub_subparent3 = $this->objsetup->CSI($Sql_sub_subparent3);

                                        if ($RS_sub_subparent3->RecordCount() > 0) {
                                            while ($Row_sub_subparent3 = $RS_sub_subparent3->FetchRow()) {

                                                $result['id'] = $Row_sub_subparent3['id'];
                                                $result['title'] = " -- -- -- -- " . $Row_sub_subparent3['title'];
                                                $response['response'][] = $result;
                                            }
                                        }*/
                                    }
                                }
                            }
                        }
                    }
                }
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

    function get_warehouse_sub_location($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if ($attr['parent_id'] > 0)
            $selpar = "and c.parent_id=" . $attr['parent_id'] . " ";
        else
            $selpar = "and c.parent_id=0";

        $response = array();

        $Sql = "SELECT c.id,c.title,c.bin_cost,c.parent_id
                From warehouse_bin_location  c
                where  c.warehouse_id=".$attr['wrh_id']." and c.status=1  " . $selpar . " and c.company_id=" . $this->arrUser['company_id'] . "
                order by c.id ASC ";

        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['title'] = $Row['title'];
                $result['cost'] = $Row['bin_cost'];
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

    function get_warehouse_sub_loc_cost_uom($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "SELECT c.id,c.bin_cost,c.description,curr.name as crname,dim.title as dimtitle,
		        CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
		              WHEN c.cost_type_id = 2 THEN 'Daily'
		              WHEN c.cost_type_id = 3 THEN 'Weekly'
		              WHEN c.cost_type_id = 4 THEN 'Monthly'
		              WHEN c.cost_type_id = 5 THEN 'Annually'
		              END AS cost_type
                From warehouse_bin_location  c
                left JOIN currency as curr on curr.id=c.currency_id
                left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                where  c.status=1  and c.id=" . $attr['location_id'] . "  and c.company_id=" . $this->arrUser['company_id'] . "
                limit 1 ";

        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            //  while () {
            $result = array();
            $Row = $RS->FetchRow();
            $result['id'] = $Row['id'];
            $result['title'] = $Row['title'];
            $result['description'] = $Row['description'];
            $result['currency'] = $Row['crname'];
            $result['cost'] = $Row['bin_cost'];
            $result['uom'] = $Row['dimtitle'];
            $response['response'] = $result;
            // }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
            $response['response'][] = array();
        }
        return $response;
    }

    function add_bin_location($arr_attr)
    {    
        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['Parameter2'] = 'id:'.$arr_attr['id'];
        $srLogTrace['ErrorMessage'] = "";

        $this->objsetup->SRTraceLogsPHP($srLogTrace);
        
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
        
        $this->objGeneral->mysql_clean($arr_attr);
        $id = $arr_attr['id'];

        $dimensions_id = (isset($arr_attr['dimensions_id']) && $arr_attr['dimensions_id']!='')?$arr_attr['dimensions_id']:0;
        $cost_type_id = (isset($arr_attr['cost_type_id']) && $arr_attr['cost_type_id']!='')?$arr_attr['cost_type_id']:0;
        $currency_id = (isset($arr_attr['currency_id']) && $arr_attr['currency_id']!='')?$arr_attr['currency_id']:0;

        // check for duplicate warehouse location with same location name, date,uom and frequency.
        $update_check = "";
        if ($arr_attr['id'] > 0)
            $update_check = "  AND tst.id <> " . $id . " ";

        // $data_pass = "   tst.title='" . $arr_attr['title'] . "' and tst.warehouse_id='" . $arr_attr[wrh_id] . "' $update_check";

        $data_pass = "   tst.title='" . $arr_attr['title'] . "' and
                         tst.warehouse_id='" . $arr_attr['wrh_id'] . "' and
                         tst.warehouse_loc_sdate='" . $this->objGeneral->convert_date($arr_attr['warehouse_loc_sdate']) . "' and
                         tst.dimensions_id='" . $dimensions_id . "' and
                         tst.cost_type_id='" . $cost_type_id . "' and tst.status=1 ".$update_check;

        //(tst.dimensions_id='" . $arr_attr['dimensions_id'] . "' or tst.cost_type_id='" . $arr_attr['cost_type_id'] . "')
        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_bin_location', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($id == 0) {

            // check for duplicate warehouse location with same location name and update the end date start

            $prev_rec_Sql = "SELECT id,warehouse_loc_sdate From warehouse_bin_location where  title='" . $arr_attr['title'] . "' and warehouse_loc_edate=0 and status=1 order by id desc limit 1";
            $prev_rec_RS = $this->objsetup->CSI($prev_rec_Sql);

            if ($prev_rec_RS->RecordCount() > 0) {
                $prev_rec_Row = $prev_rec_RS->FetchRow();
                $prev_rec_sdate = $prev_rec_Row["warehouse_loc_sdate"];
                $current_date = $this->objGeneral->convert_date($arr_attr['warehouse_loc_sdate']);

                if ($current_date > $prev_rec_sdate) {
                    $previous_day_date = strtotime('-1 day', $current_date);

                    if ($previous_day_date < $prev_rec_sdate)
                        $previous_day_date = $prev_rec_sdate;

                    $update_prev_rec_end_date_Sql = "UPDATE warehouse_bin_location
                                                              SET warehouse_loc_edate='" . $previous_day_date . "'
                                                                  WHERE id = " . $prev_rec_Row["id"] . "   Limit 1";

                    $this->objsetup->CSI($update_prev_rec_end_date_Sql);
                }
            }

            // check for duplicate warehouse location with same location name end
            $parent_id = ($arr_attr['parent_id'] != '') ? $arr_attr['parent_id']: '0';
            $bin_cost = ($arr_attr['bin_cost'] != '') ? Round($arr_attr['bin_cost'],3): '0';
            
            $Sql = "INSERT INTO warehouse_bin_location
                                SET
                                      warehouse_id='".$arr_attr['wrh_id']."',
                                      title='".$arr_attr['title']."',
                                      description='".$arr_attr['description']."',
                                      parent_id='".$parent_id."',
                                      bin_cost='".$bin_cost."',
                                      currency_id='".$currency_id."',
                                      dimensions_id='".$dimensions_id."',
                                      cost_type_id='".$cost_type_id."',
                                      warehouse_loc_sdate='" . $this->objGeneral->convert_date($arr_attr['warehouse_loc_sdate']) . "',
                                      user_id='" . $this->arrUser['id'] . "',
                                      company_id='" . $this->arrUser['company_id'] . "',
                                      status='".$arr_attr['status']."',
                                      AddedBy='" . $this->arrUser['id'] . "',
                                      AddedOn='" . current_date . "'";
            // warehouse_loc_edate='" . $this->objGeneral->convert_date($arr_attr[warehouse_loc_edate]) . "',

            // echo $Sql;exit;

            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();

            if ($id > 0) {
                $arr_attr['warehouse_loc_id'] = $id;
                // $this->add_bin_loc_history($arr_attr);
            }

        } else {
            // check date from previous record.

            /* $sel_Sql = "SELECT warehouse_loc_sdate,warehouse_loc_edate from warehouse_bin_location WHERE id = " . $id . " Limit 1";
            //echo $sel_Sql;
            $sel_RS = $this->objsetup->CSI($sel_Sql);

            if ($sel_RS->RecordCount() > 0) {
                $sel_Row = $sel_RS->FetchRow();
                $previous_rec_date = $sel_Row['warehouse_loc_sdate'];
                $warehouse_loc_edate = $sel_Row['warehouse_loc_edate'];

                if ($this->objGeneral->convert_date($arr_attr['warehouse_loc_sdate']) < $previous_rec_date) {
                    $response['ack'] = 0;
                    $response['error'] = 'Date is Earlier than Previous Recorded Date';
                    return $response;
                }
            } */

            
            // Check for warehouse location assigned to item

            /*$assigned_loc_Sql = "SELECT id From product_warehouse_location where  warehouse_loc_id=" . $id . " and status=1  limit 1 ";
            $assigned_loc_RS = $this->objsetup->CSI($assigned_loc_Sql);

            if ($assigned_loc_RS->RecordCount() > 0) {
                $response['ack'] = 0;
                $response['error'] = 'This warehouse location is already assigned to an item .';
                return $response;
            }*/
            $parent_id = ($arr_attr['parent_id'] != '') ? $arr_attr['parent_id']: '0';
            $bin_cost = ($arr_attr['bin_cost'] != '') ? Round($arr_attr['bin_cost'],3): '0';
            
            $Sql = "UPDATE warehouse_bin_location
                              SET
									warehouse_id='".$arr_attr['wrh_id']."',
                                    title='".$arr_attr['title']."',
                                    description='".$arr_attr['description']."',
                                    parent_id='".$parent_id."',
                                    bin_cost='".$bin_cost."',
                                    currency_id='".$currency_id."',
                                    dimensions_id='".$dimensions_id."',
                                    cost_type_id='".$cost_type_id."',
                                    warehouse_loc_sdate='" . $this->objGeneral->convert_date($arr_attr['warehouse_loc_sdate']) . "',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    status='".$arr_attr['status']."',
                                    ChangedBy='" . $this->arrUser['id'] . "',
                                    ChangedOn='" . current_date . "'
                                    WHERE id = " . $id . "   Limit 1";
            //warehouse_loc_edate='" . $this->objGeneral->convert_date($arr_attr[warehouse_loc_edate]) . "',

            $RS = $this->objsetup->CSI($Sql);
            // echo $Sql;exit;

            /* if ($this->Conn->Affected_Rows() > 0) {

                $this->update_bin_loc_history($arr_attr['warehouse_loc_sdate'], $id);

                $arr_attr['warehouse_loc_id'] = $id;
                $this->add_bin_loc_history($arr_attr);
            } */
        }
        if ($id > 0) {
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
            $srLogTrace['input_text'] = $Sql;

            $this->objsetup->SRTraceLogsPHP($srLogTrace);

        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = "Error Code: $srLogTrace[ErrorCode]  -- Message: 'Record not inserted'  -- Function: ". __FUNCTION__."  -- Query: $Sql ";

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }
        return $response;
    }

    function alt_warehouse_loc_History($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";

        $response = array();

        $Sql = "SELECT c.id as wrh_loc_id,loc.title as parent,c.cost,c.loc_sdate,c.loc_edate,c.action_date,curr.code as crname,dim.title as dimtitle,
		        CASE  WHEN c.cost_type = 1 THEN 'Fixed'
		              WHEN c.cost_type = 2 THEN 'Daily'
		              WHEN c.cost_type = 3 THEN 'Weekly'
		              WHEN c.cost_type = 4 THEN 'Monthly'
		              WHEN c.cost_type = 5 THEN 'Annually'
		              END AS cost_type,
		              employees.first_name, employees.last_name
                From warehouse_bin_loc_history  c
                left JOIN currency as curr on curr.id=c.currency_id
                left JOIN units_of_measure as dim on dim.id=c.uom_id
                left JOIN warehouse_bin_location as loc on loc.id=c.parent_id
                left JOIN employees ON employees.id=c.user_id
                where  c.warehouse_loc_id=".$attr['wrh_loc_id']." and c.status=1 and c.company_id=" . $this->arrUser['company_id'] . "
                order by c.id ASC ";


        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['wrh_loc_id'];
                if (strlen($Row['parent']) > 0)
                    $result['parent_location'] = $Row['parent'];

                $result['Currency'] = $Row['crname'];
                $result['Cost'] = $Row['cost'];
                $result['Unit_of Measure'] = $Row['dimtitle'];
                $result['cost_frequency'] = $Row['cost_type'];
                $result['Start_date'] = $this->objGeneral->convert_unix_into_date($Row['loc_sdate']);

                if ($Row['loc_sdate'] > current_date)
                    $result['del_chk'] = 1;
                else
                    $result['del_chk'] = 0;
                $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['loc_edate']);
                $result['change_date'] = $this->objGeneral->convert_unix_into_date($Row['action_date']);
                $result['changed_by'] = $Row['first_name'] . " " . $Row['last_name'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function delete_bin_loc_history($rec)
    {
        $sel_Sql = "SELECT warehouse_loc_id from warehouse_bin_loc_history WHERE id = " . $rec['id'] . " and status=1 Limit 1";
        // echo $sel_Sql;exit;

        $sel_RS = $this->objsetup->CSI($sel_Sql);

        if ($sel_RS->RecordCount() > 0) {

            $sel_Row = $sel_RS->FetchRow();
            $warehouse_loc_id = $sel_Row['warehouse_loc_id'];
            //$rec_id = $sel_Row['id'];
            //$loc_sdate = $sel_Row['loc_sdate'];

            /*======= Query for store procedure start */

            $del_Sql = "CALL `SR_WH_loc_history_del`(" . $rec['id'] . "," . $warehouse_loc_id . ") ";
            // echo $del_Sql;exit;

            $this->objsetup->CSI($del_Sql);

            /*======= Query for store procedure end */

            if ($this->Conn->Affected_Rows() > 0) {
                $response['ack'] = 1;
                $response['error'] = NULL;
                $response['error'] = 'Record Deleted Successfully';
            } else {
                $response['ack'] = 0;
                $response['error'] = 'Record not Deleted!';
            }
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not Deleted!';
        }
        return $response;
    }

    //----------------Get All products to which a warehouse assigned ----------------------
    function get_prod_by_warehouse_loc_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "SELECT c.warehouse_loc_sdate,prd.product_code,prd.description as product,br.brandname as brand,cat.name as category,unt.title as uom
                    From product_warehouse_location  c
                    left JOIN product as prd on prd.id=c.item_id
                    LEFT JOIN brand br on br.id=prd.brand_id
                    LEFT JOIN category cat on cat.id=prd.category_id
                    LEFT JOIN units_of_measure unt on unt.id=prd.unit_id
                    where  c.warehouse_loc_id=".$attr['wrh_loc_id']." and c.status = 1 and prd.product_code IS NOT NULL and
                           c.company_id=" . $this->arrUser['company_id'] . "
                     order by c.id ASC ";

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['product_code'] = $Row['product_code'];
                $result['product'] = $Row['product'];
                $result['brand'] = $Row['brand'];
                $result['category'] = $Row['category'];
                $result['Unit_of Measure'] = $Row['uom'];
                $result['Start_date'] = $this->objGeneral->convert_unix_into_date($Row['warehouse_loc_sdate']);
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['response'][] = array();
        }
        return $response;
    }

    //----------------BIN location Additional Cost Module Start ----------------------

    function get_bin_loc_add_cost($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";
        $response = array();

        $Sql = "SELECT c.id as wrh_additiona_cost_id,
                       cost_title.title as costtitle,c.description as descr
                From warehouse_loc_additional_cost  c
                left JOIN warehouse_loc_additional_cost_title as cost_title on cost_title.id=c.add_cost_title_id
                left JOIN warehouse_bin_location as bin_location on bin_location.id=c.warehouse_bin_loc_id
                where  c.warehouse_id=".$attr['wrh_id']." and c.warehouse_bin_loc_id=".$attr['bin_loc_wrh_id']." and  c.status=1 and
                       c.company_id=" . $this->arrUser['company_id'] . "
                 order by c.id ASC ";
        // echo $Sql; exit;

        $RS = $this->objsetup->CSI($Sql);
        $response['bin_loc_id'] = $attr['bin_loc_wrh_id'];

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['wrh_additiona_cost_id'];
                $result['title'] = $Row['costtitle'];
                $result['Description'] = $Row['descr'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_bin_loc_add_cost_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "SELECT c.*  From warehouse_loc_additional_cost c where c.id=".$attr['id']." limit 1 ";
        // echo $Sql; exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {

            $Row = $RS->FetchRow();

            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $Row['additional_cost_sdate'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_bin_loc_add_cost($arr_attr)
    {
        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['Parameter2'] = 'id:'.$arr_attr['id'];
        $srLogTrace['Parameter3'] = 'warehouse_bin_loc_id:'.$arr_attr['warehouse_bin_loc_id'];
        $srLogTrace['ErrorMessage'] = "";

        $this->objsetup->SRTraceLogsPHP($srLogTrace);
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
        
        $this->objGeneral->mysql_clean($arr_attr);
        $id = $arr_attr['id'];

        $update_check = "";
        if ($arr_attr['id'] > 0)
            $update_check = "  AND tst.id <> " . $id . " ";

        if ($arr_attr['bin_loc_id'] == "") {
            $response['ack'] = 0;
            $response['error'] = 'Please Add Warehouse Location First ';
            return $response;
        }

        $dimensions_id = (isset($arr_attr['dimensions_id']) && $arr_attr['dimensions_id']!='')?$arr_attr['dimensions_id']:0;
        $cost_type_id = (isset($arr_attr['cost_type_id']) && $arr_attr['cost_type_id']!='')?$arr_attr['cost_type_id']:0;
        $bin_loc_id = (isset($arr_attr['bin_loc_id']) && $arr_attr['bin_loc_id']!='')?$arr_attr['bin_loc_id']:0;
        $wrh_id = (isset($arr_attr['wrh_id']) && $arr_attr['wrh_id']!='')?$arr_attr['wrh_id']:0;
        $title_id = (isset($arr_attr['title_id']) && $arr_attr['title_id']!='')?$arr_attr['title_id']:0;


        //$data_pass = "   tst.add_cost_title_id='" . $arr_attr['title_id'] . "' and tst.warehouse_id='" . $arr_attr['wrh_id'] . "' and tst.warehouse_bin_loc_id='" . $arr_attr['bin_loc_id'] . "' $update_check";

        $data_pass = "   tst.add_cost_title_id='" . $title_id . "' and
                         tst.warehouse_id='" . $wrh_id . "' and
                         tst.warehouse_bin_loc_id='" . $bin_loc_id . "' and 
                         tst.start_date='" . current_date. "' and
                         tst.status=1 ".$update_check;

        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_loc_additional_cost', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($id == 0) {

            // check for duplicate warehouse location additional cost with same name and update the end date

            $prev_rec_Sql = "SELECT id,start_date 
                             From warehouse_loc_additional_cost 
                             where  add_cost_title_id='" . $arr_attr['title_id'] . "' and 
                                    end_date=0 and 
                                    status=1 
                             order by id desc 
                             limit 1";

            $prev_rec_RS = $this->objsetup->CSI($prev_rec_Sql);

            if ($prev_rec_RS->RecordCount() > 0) {
                $prev_rec_Row = $prev_rec_RS->FetchRow();
                $prev_rec_sdate = $prev_rec_Row["start_date"];
                $new_date = $this->objGeneral->convert_date($arr_attr['additional_cost_sdate']);

                if ($new_date > $prev_rec_sdate) {
                    $previous_day_date = strtotime('-1 day', $new_date);

                    if ($previous_day_date < $prev_rec_sdate)
                        $previous_day_date = $prev_rec_sdate;

                    $update_prev_rec_end_date_Sql = "UPDATE warehouse_loc_additional_cost
                                                              SET end_date='" . $previous_day_date . "'
                                                                  WHERE id = " . $prev_rec_Row["id"] . "   Limit 1";

                    $this->objsetup->CSI($update_prev_rec_end_date_Sql);
                }
            }

            $Sql = "INSERT INTO warehouse_loc_additional_cost
                                SET
                                      warehouse_id='".$wrh_id."',
                                      warehouse_bin_loc_id='".$bin_loc_id."',
                                      title='".$arr_attr['title']."',
                                      add_cost_title_id='".$title_id."',
                                      description='".$arr_attr['description']."',
                                      start_date='" . current_date . "',
                                      user_id='" . $this->arrUser['id'] . "',
                                      company_id='" . $this->arrUser['company_id'] . "',
                                      status=1,
                                      AddedBy='" . $this->arrUser['id'] . "',
                                      AddedOn='" . current_date . "'";

            // echo $Sql;exit;
                                    //   cost='$arr_attr[cost]',
                                    /* 
                                      dimensions_id='$dimensions_id',
                                      cost_type_id='$cost_type_id', */
            

            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();

            /* if ($id > 0) {
                $arr_attr['wh_loc_additional_cost_id'] = $id;
                $this->add_bin_loc_add_cost_history($arr_attr);
            } */

        } else {

            // check date from previous record.

            $sel_Sql = "SELECT start_date,end_date from warehouse_loc_additional_cost WHERE id = " . $id . " Limit 1";
            //echo $sel_Sql;
            $sel_RS = $this->objsetup->CSI($sel_Sql);

            if ($sel_RS->RecordCount() > 0) {
                $sel_Row = $sel_RS->FetchRow();
                $previous_rec_date = $sel_Row['start_date'];
                $edate = $sel_Row['end_date'];

                if ($this->objGeneral->convert_date($arr_attr['additional_cost_sdate']) < $previous_rec_date) {
                    $response['ack'] = 0;
                    $response['error'] = 'Date is earlier than previous recorded date';
                    return $response;
                }
            }

            // Check for warehouse location assigned to item

            $Sql = "UPDATE warehouse_loc_additional_cost
                              SET
									warehouse_id='".$wrh_id."',
                                    warehouse_bin_loc_id='".$bin_loc_id."',
                                    title='".$arr_attr['title']."',
                                    add_cost_title_id='".$title_id."',
                                    description='".$arr_attr['description']."',
                                    start_date='" . current_date. "',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    status='".$arr_attr['status']."',
                                    ChangedBy='" . $this->arrUser['id'] . "',
                                    ChangedOn='" . current_date . "'
                                    WHERE id = " . $id . "   Limit 1";
             // cost='$arr_attr[cost]',

             /* 
                                    dimensions_id='$dimensions_id',
                                    cost_type_id='$cost_type_id', */
                                    
            //echo $Sql; exit;
            $RS = $this->objsetup->CSI($Sql);
            /* if ($this->Conn->Affected_Rows() > 0) {

                $this->update_bin_loc_add_cost_history($arr_attr['additional_cost_sdate'], $id);

                $arr_attr['wh_loc_additional_cost_id'] = $id;
                $this->add_bin_loc_add_cost_history($arr_attr);
            } */
        }
        //echo $Sql;exit;

        if ($id > 0) {
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
            $srLogTrace['Parameter3'] = 'warehouse_bin_loc_id:'. $bin_loc_id;
            $srLogTrace['input_text'] = $Sql;

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = "Error Code: ".$srLogTrace['ErrorCode']."  -- Message: 'Record not inserted'  -- Function: ". __FUNCTION__."  -- Query: ".$Sql." ";

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }
        return $response;
    }

    //----------------BIN location Additional Cost Module End ----------------------

    // warehouse location Additional Cost history Start
    //-------------------------------------------------
    function add_bin_loc_add_cost_history($arr_attr)
    {
        $dimensions_id = (isset($arr_attr['dimensions_id']) && $arr_attr['dimensions_id']!='')?$arr_attr['dimensions_id']:0;
        $cost_type_id = (isset($arr_attr['cost_type_id']) && $arr_attr['cost_type_id']!='')?$arr_attr['cost_type_id']:0;
        $title_id = (isset($arr_attr['title_id']) && $arr_attr['title_id']!='')?$arr_attr['title_id']:0;
        $wh_loc_additional_cost_id = (isset($arr_attr['wh_loc_additional_cost_id']) && $arr_attr['wh_loc_additional_cost_id']!='')?$arr_attr['wh_loc_additional_cost_id']:0;


        $Sql = "INSERT INTO warehouse_loc_additional_cost_history
                                SET
                                      loc_additional_cost_id='".$wh_loc_additional_cost_id."',
                                      cost_title_id='".$title_id."',
                                      description='".$arr_attr['description']."',
                                      start_date='" . current_date . "',
                                      action_date='" . current_date . "',
                                      status=1,
                                      user_id='" . $this->arrUser['id'] . "',
                                      company_id='" . $this->arrUser['company_id'] . "'
                                      ";
                                    //   cost='$arr_attr[cost]',
        //  echo $Sql; exit;
        // $this->objGeneral->convert_date($arr_attr['additional_cost_sdate'])

        /* 
                                      dimensions_id='$dimensions_id',
                                      cost_type_id='$cost_type_id', */

        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        return true;
    }

    function update_bin_loc_add_cost_history($date, $rec)
    {
        //$sel_Sql = "SELECT id,start_date,end_date from warehouse_loc_additional_cost_history WHERE warehouse_loc_id = " . $rec . " order by id desc Limit 1";
        $sel_Sql = "SELECT id,start_date,end_date from warehouse_loc_additional_cost_history WHERE loc_additional_cost_id = " . $rec . "  and status=1 order by id desc Limit 1";
        //echo $sel_Sql;exit;

        $sel_RS = $this->objsetup->CSI($sel_Sql);

        if ($sel_RS->RecordCount() > 0) {
            $sel_Row = $sel_RS->FetchRow();
            $rec_id = $sel_Row['id'];
            $start_date = $sel_Row['start_date'];
            $end_date = $sel_Row['end_date'];

            //$new_date = $this->objGeneral->convert_date($date);
            //$previous_day_date = strtotime('-1 day', current_date);

            $current_date = $this->objGeneral->convert_date($date);
            $previous_day_date = strtotime('-1 day', $current_date);

            if ($previous_day_date < $start_date)
                $previous_day_date = $start_date;

            $Sql = "UPDATE warehouse_loc_additional_cost_history 
                                SET 
                                    end_date='" . $previous_day_date . "' 
                                WHERE id = " . $rec_id . "   
                                Limit 1";
            /*echo $Sql;  exit;*/

            $RS = $this->objsetup->CSI($Sql);
            return true;
        } else
            return false;
    }

    function alt_warehouse_loc_add_cost_History($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "SELECT c.id as wrh_additiona_cost_id,cost_title.title as costtitle,c.cost,c.start_date,c.end_date,c.action_date,dim.title as dimtitle,
		        CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
		              WHEN c.cost_type_id = 2 THEN 'Daily'
		              WHEN c.cost_type_id = 3 THEN 'Weekly'
		              WHEN c.cost_type_id = 4 THEN 'Monthly'
		              WHEN c.cost_type_id = 5 THEN 'Annually'
		              END AS cost_type,
		              employees.first_name, employees.last_name
                From warehouse_loc_additional_cost_history  c
                left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                left JOIN warehouse_loc_additional_cost_title as cost_title on cost_title.id=c.cost_title_id
                left JOIN employees ON employees.id=c.user_id
                left JOIN company on company.id=c.company_id
                where  c.loc_additional_cost_id=".$attr['wrh_loc_id']." and c.status=1 and c.company_id=" . $this->arrUser['company_id'] . "
                order by c.id ASC ";


        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['wrh_additiona_cost_id'];
                $result['title'] = $Row['costtitle'];
                $result['Cost'] = $Row['cost'];
                $result['Unit_of Measure'] = $Row['dimtitle'];
                $result['cost_frequency'] = $Row['cost_type'];
                $result['Start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);

                if ($Row['start_date'] > current_date)
                    $result['del_chk'] = 1;
                else
                    $result['del_chk'] = 0;

                $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
                $result['change_date'] = $this->objGeneral->convert_unix_into_date($Row['action_date']);
                $result['changed_by'] = $Row['first_name'] . " " . $Row['last_name'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function delete_warehouse_loc_add_cost_history($rec)
    {
        $sel_Sql = "SELECT loc_additional_cost_id from warehouse_loc_additional_cost_history WHERE id = " . $rec['id'] . " and status=1 Limit 1";
        // echo $sel_Sql;exit;
        //id,loc_additional_cost_id,start_date

        $sel_RS = $this->objsetup->CSI($sel_Sql);

        if ($sel_RS->RecordCount() > 0) {

            $sel_Row = $sel_RS->FetchRow();
            $loc_additional_cost_id = $sel_Row['loc_additional_cost_id'];
            //$rec_id = $sel_Row['id'];
            // $start_date = $sel_Row['start_date'];

            /*======= Query for store procedure start */

            $del_Sql = "CALL `SR_WH_loc_add_cost_history_del`(" . $rec['id'] . "," . $loc_additional_cost_id . ") ";
            // echo $del_Sql;exit;

            $this->objsetup->CSI($del_Sql);

            /*======= Query for store procedure end */

            if ($this->Conn->Affected_Rows() > 0) {
                $response['ack'] = 1;
                $response['error'] = NULL;
                $response['error'] = 'Record Deleted Successfully';
            } else {
                $response['ack'] = 0;
                $response['error'] = 'Record not Deleted!';
            }
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not Deleted!';
        }
        return $response;
        /*if ($sel_RS->RecordCount() > 0) {
            $sel_Row = $sel_RS->FetchRow();
            $rec_id = $sel_Row['id'];
            $loc_additional_cost_id = $sel_Row['loc_additional_cost_id'];
            $start_date = $sel_Row['start_date'];

            $additional_cost_history_update_Sql = "UPDATE warehouse_loc_additional_cost_history SET status=0 WHERE id = " . $rec['id'] . " Limit 1";
            //echo $additional_cost_history_update_Sql; exit;

            $additional_cost_history_update_RS = $this->objsetup->CSI($additional_cost_history_update_Sql);

            $previous_day_date = strtotime('-1 day', $start_date);

            $sel_prev_rec_Sql = "SELECT * from warehouse_loc_additional_cost_history WHERE loc_additional_cost_id = " . $loc_additional_cost_id . " and end_date=" . $previous_day_date . "   Limit 1";

            $sel_prev_rec_RS = $this->objsetup->CSI($sel_prev_rec_Sql);

            if ($sel_prev_rec_RS->RecordCount() > 0) {

                $sel_prev_rec_Row = $sel_prev_rec_RS->FetchRow();

                $cost_title_id = $sel_prev_rec_Row['cost_title_id'];
                $description = $sel_prev_rec_Row['description'];
                $cost = $sel_prev_rec_Row['cost'];
                $dimensions_id = $sel_prev_rec_Row['dimensions_id'];
                $cost_type = $sel_prev_rec_Row['cost_type_id'];

                $Sql = "UPDATE warehouse_loc_additional_cost_history SET end_date='' WHERE loc_additional_cost_id = " . $loc_additional_cost_id . " and end_date=" . $previous_day_date . "   Limit 1";
                //echo $Sql;exit;

                $RS = $this->objsetup->CSI($Sql);

                $additional_cost_update_Sql = "UPDATE warehouse_loc_additional_cost
                                                  SET
                                                        add_cost_title_id='" . $cost_title_id . "',
                                                        description='" . $description . "',
                                                        cost='" . $cost . "',
                                                        dimensions_id='" . $dimensions_id . "',
                                                        cost_type_id='" . $cost_type . "',
                                                        start_date='" . $start_date . "',
                                                        end_date=''
                                                        WHERE id = " . $loc_additional_cost_id . "   Limit 1";
                //echo $additional_cost_update_Sql;  exit;
                $additional_cost_update_RS = $this->objsetup->CSI($additional_cost_update_Sql);
            }

            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record Deleted Successfully';

        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not Deleted!';
        }
        return $response;*/
    }

    // warehouse location Additional Cost history End
    //-----------------------------------------------

    // Product warehouse location Module Start
    //--------------------------------------

    function add_prod_warehouse_loc($arr_attr)
    {
        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['Parameter2'] = 'id:'.$arr_attr['id'];
        $srLogTrace['ErrorMessage'] = "";

        $this->objsetup->SRTraceLogsPHP($srLogTrace);
        
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
        
        $this->objGeneral->mysql_clean($arr_attr);
        $id = $arr_attr['id'];

        // check for duplicate warehouse location.
        $update_check = "";
        if ($arr_attr['id'] > 0)
            $update_check = "  AND tst.id <> " . $id . " ";
        
        $product_id = (isset($arr_attr['product_id']) && $arr_attr['product_id']!='')?$arr_attr['product_id']:0;
        $warehouse_id = (isset($arr_attr['warehouse_id']) && $arr_attr['warehouse_id']!='')?$arr_attr['warehouse_id']:0;
        $location_id = (isset($arr_attr['location_id']) && $arr_attr['location_id']!='')?$arr_attr['location_id']:0;
        $default_warehouse_id = (isset($arr_attr['default_warehouse_id']) && $arr_attr['default_warehouse_id']!='')?$arr_attr['default_warehouse_id']:0;
            

        $data_pass = "   tst.item_id='" . $product_id . "' and
                         tst.warehouse_id='" . $warehouse_id . "' and
                         tst.warehouse_loc_id='" . $location_id . "'
                         $update_check";

        $total = $this->objGeneral->count_duplicate_in_sql('product_warehouse_location', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        

        if ($id == 0) {

             if ($default_warehouse_id > 0) {

                $default_warehouse_Sql = "UPDATE product_warehouse_location
                                                    SET
                                                        default_warehouse=0
                                                        WHERE item_id = " . $product_id . " ";
                // echo $default_warehouse_Sql;exit;
                $default_warehouse_RS = $this->objsetup->CSI($default_warehouse_Sql);
            }

            $Sql = "INSERT INTO product_warehouse_location
                                SET
                                      item_id='" . $product_id . "',
                                      warehouse_id='" . $warehouse_id . "',
                                      warehouse_loc_id='" . $location_id. "',
                                      default_warehouse='" . $default_warehouse_id . "',
                                      user_id='" . $this->arrUser['id'] . "',
                                      company_id='" . $this->arrUser['company_id'] . "',
                                      status='" . $arr_attr['status'] . "',
                                      AddedBy='" . $this->arrUser['id'] . "',
                                      AddedOn='" . current_date . "'";

            // echo $Sql;exit;

            /*
             cost='$arr_attr[cost]',
                                      description='$arr_attr[description]',
                                      uom_id='$arr_attr[dimensions_id]',
                                      currency_id='$arr_attr[currency_id]',
                                      cost_type_id='$arr_attr[cost_type_id]',
                                      warehouse_loc_sdate='" . $this->objGeneral->convert_date($arr_attr[warehouse_loc_sdate]) . "',
            */
            // warehouse_loc_edate='" . $this->objGeneral->convert_date($arr_attr[warehouse_loc_edate]) . "',

            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();

            if ($id > 0) {
                $arr_attr['prod_warehouse_loc_id'] = $id;
                // $this->add_prod_warehouse_loc_history($arr_attr);
            }

        } else {

            // check date from previous record.

            $sel_Sql = "SELECT warehouse_loc_sdate from product_warehouse_location WHERE id = " . $id . " Limit 1";
            //echo $sel_Sql;

            $sel_RS = $this->objsetup->CSI($sel_Sql);

            if ($sel_RS->RecordCount() > 0) {
                $sel_Row = $sel_RS->FetchRow();
                $previous_rec_date = $sel_Row['warehouse_loc_sdate'];

                if ($this->objGeneral->convert_date($arr_attr['warehouse_loc_sdate']) < $previous_rec_date) {
                    $response['ack'] = 0;
                    $response['error'] = 'Date is earlier than previous recorded date';
                    return $response;
                }
            }

            if ($arr_attr["default_warehouse_id"] > 0) {

                $default_warehouse_Sql = "UPDATE product_warehouse_location
                                                  SET
                                                        default_warehouse=0
                                                        WHERE item_id = " . $product_id . " ";
                // echo $default_warehouse_Sql;exit;
                $default_warehouse_RS = $this->objsetup->CSI($default_warehouse_Sql);
            }

            $Sql = "UPDATE product_warehouse_location
                              SET
									item_id='" . $product_id . "',
									warehouse_id='" . $warehouse_id . "',
                                    warehouse_loc_id='" . $location_id . "',
                                    default_warehouse='" . $default_warehouse_id. "',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    status='" . $arr_attr['status'] . "',
                                    ChangedBy='" . $this->arrUser['id'] . "',
                                    ChangedOn='" . current_date . "'
                                    WHERE id = " . $id . "   Limit 1";
            //echo $Sql;exit;

            /*
             cost='$arr_attr[cost]',
                                    description='$arr_attr[description]',
                                    uom_id='$arr_attr[dimensions_id]',
                                    currency_id='$arr_attr[currency_id]',
                                    cost_type_id='$arr_attr[cost_type_id]',
                                    warehouse_loc_sdate='" . $this->objGeneral->convert_date($arr_attr[warehouse_loc_sdate]) . "',
            */
            $RS = $this->objsetup->CSI($Sql);

            if ($this->Conn->Affected_Rows() > 0) {

                // $this->update_prod_warehouse_loc_history($arr_attr['warehouse_loc_sdate'], $id);

                $arr_attr['prod_warehouse_loc_id'] = $id;
                // $this->add_prod_warehouse_loc_history($arr_attr);
            }
        }

        if ($id > 0) {
            $response['id'] = $id;
            $response['ack'] = 1;
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
            $srLogTrace['input_text'] = $Sql;

            $this->objsetup->SRTraceLogsPHP($srLogTrace);

        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';

            $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = "Error Code: $srLogTrace[ErrorCode]  -- Message: 'Record not inserted'  -- Function: ". __FUNCTION__."  -- Query: $Sql ";

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }
        return $response;
    }

    function alt_prod_warehouse_loc_History($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";
        $response = array();

        $Sql = "SELECT c.id as wrh_loc_id,loc.title as location,wrh.name as warehousename,c.cost,c.start_date,c.end_date,c.action_date,curr.code as crname,
                        dim.title as dimtitle,
                        CASE  WHEN c.cost_type = 1 THEN 'Fixed'
                            WHEN c.cost_type = 2 THEN 'Daily'
                            WHEN c.cost_type = 3 THEN 'Weekly'
                            WHEN c.cost_type = 4 THEN 'Monthly'
                            WHEN c.cost_type = 5 THEN 'Annually'
                            END AS cost_type
                From product_warehouse_loc_history  c
                left JOIN currency as curr on curr.id=c.currency_id
                left JOIN units_of_measure as dim on dim.id=c.uom_id
                left JOIN warehouse as wrh on wrh.id=c.warehouse_id
                left JOIN warehouse_bin_location as loc on loc.id=c.location_id
                where  c.product_warehouse_id=".$attr['wrh_loc_id']." and c.status=1 and c.company_id=" . $this->arrUser['company_id'] . " 
                order by c.id ASC ";

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['wrh_loc_id'];
                $result['warehouse'] = $Row['warehousename'];
                $result['Storage_Location'] = $Row['location'];
                $result['Currency'] = $Row['crname'];
                //$result['Cost'] = $Row['cost'];
                if ($Row['cost'] > 0)
                    $result['Cost'] = $Row['cost'];
                else
                    $result['Cost'] = "-";

                $result['Unit_of Measure'] = $Row['dimtitle'];
                $result['cost_frequency'] = $Row['cost_type'];
                $result['Start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);

                if ($Row['start_date'] > current_date)
                    $result['del_chk'] = 1;
                else
                    $result['del_chk'] = 0;

                $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
                $result['change_date'] = $this->objGeneral->convert_unix_into_date($Row['action_date']);

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function delete_prod_warehouse_loc_history($rec)
    {
        $sel_Sql = "SELECT id,product_warehouse_id,start_date from product_warehouse_loc_history WHERE id = " . $rec['id'] . " and status=1 Limit 1";
        // echo $sel_Sql;exit;

        $sel_RS = $this->objsetup->CSI($sel_Sql);

        if ($sel_RS->RecordCount() > 0) {
            $sel_Row = $sel_RS->FetchRow();
            $rec_id = $sel_Row['id'];
            $product_warehouse_id = $sel_Row['product_warehouse_id'];
            $start_date = $sel_Row['start_date'];

            $prod_warehouse_loc_history_update_Sql = "UPDATE product_warehouse_loc_history SET status=0 WHERE id = " . $rec['id'] . " Limit 1";
            //echo $prod_warehouse_loc_history_update_Sql; exit;

            $prod_warehouse_loc_history_update_RS = $this->objsetup->CSI($prod_warehouse_loc_history_update_Sql);

            $previous_day_date = strtotime('-1 day', $start_date);

            /*if ($previous_day_date1 < $start_date)
                $previous_day_date = $start_date;
            else
                $previous_day_date = $previous_day_date1;*/

            $sel_prev_rec_Sql = "SELECT * from product_warehouse_loc_history WHERE product_warehouse_id = " . $product_warehouse_id . " and end_date=" . $previous_day_date . "   Limit 1";

            $sel_prev_rec_RS = $this->objsetup->CSI($sel_prev_rec_Sql);

            if ($sel_prev_rec_RS->RecordCount() > 0) {

                $sel_prev_rec_Row = $sel_prev_rec_RS->FetchRow();

                $product_warehouse_id = $sel_prev_rec_Row['product_warehouse_id'];
                $warehouse_id = $sel_prev_rec_Row['warehouse_id'];
                $location_id = $sel_prev_rec_Row['location_id'];
                $description = $sel_prev_rec_Row['description'];
                $cost = $sel_prev_rec_Row['cost'];
                $uom_id = $sel_prev_rec_Row['uom_id'];
                $cost_type = $sel_prev_rec_Row['cost_type'];
                $currency_id = $sel_prev_rec_Row['currency_id'];

                $Sql = "UPDATE product_warehouse_loc_history SET end_date='' WHERE product_warehouse_id = " . $product_warehouse_id . " and end_date=" . $previous_day_date . "   Limit 1";
                //echo $Sql;exit;

                $RS = $this->objsetup->CSI($Sql);

                $prod_warehouse_loc_update_Sql = "UPDATE product_warehouse_location
                                                  SET
                                                        warehouse_id='" . $warehouse_id . "',
                                                        warehouse_loc_id='" . $location_id . "',
                                                        description='" . $description . "',
                                                        cost='" . $cost . "',
                                                        uom_id='" . $uom_id . "',
                                                        cost_type_id='" . $cost_type . "',
                                                        currency_id='" . $currency_id . "',
                                                        warehouse_loc_sdate='" . $start_date . "',
                                                        warehouse_loc_edate=''
                                                        WHERE id = " . $product_warehouse_id . "   Limit 1";
                //echo $prod_warehouse_loc_update_Sql;  exit;
                $prod_warehouse_loc_update_RS = $this->objsetup->CSI($prod_warehouse_loc_update_Sql);
            }

            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record Deleted Successfully';

        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not Deleted!';
        }
        return $response;
    }

    function get_prod_warehouse_loc($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";

        $response = array();

        //c.cost,c.warehouse_loc_sdate,
        /*left JOIN units_of_measure as dim on dim.id=c.uom_id
                left JOIN currency as curr on curr.id=c.currency_id*/
        $Sql = "SELECT c.id as prod_wrh_loc_id,c.warehouse_loc_id,c.warehouse_id,
                      curr.code as crname,dim.title as dimtitle,wrh.wrh_code as warehouseCode,wrh.name as warehouse,wrh_loc.title as warehouse_loc,
                      wrh_loc.bin_cost as cost,wrh_loc.currency_id,wrh_loc.cost_type_id,wrh_loc.warehouse_loc_sdate,
		        CASE  WHEN c.status = 1 THEN 'Active'
		              WHEN c.status = 2 THEN 'Inactive'
		              WHEN c.status = 0 THEN 'Delete'
		              END AS add_cost_status,
		        CASE  WHEN c.default_warehouse = 1 THEN 'Yes'
		              WHEN c.default_warehouse = 0 THEN ''
		              END AS default_warehouse,
		        CASE  WHEN wrh_loc.cost_type_id = 1 THEN 'Fixed'
		              WHEN wrh_loc.cost_type_id = 2 THEN 'Daily'
		              WHEN wrh_loc.cost_type_id = 3 THEN 'Weekly'
		              WHEN wrh_loc.cost_type_id = 4 THEN 'Monthly'
		              WHEN wrh_loc.cost_type_id = 5 THEN 'Annually'
		              END AS cost_type,
		        (SELECT id From product_warehouse_loc_additional_cost where product_warehouse_loc_id=c.id limit 1 ) as add_cost,
                (SELECT stock_check From product where id =" . $attr['prod_id'] . " limit 1 ) as stockcheck,
		        0 as cost_history

                From product_warehouse_location  c
                left JOIN warehouse_bin_location as wrh_loc on wrh_loc.id=c.warehouse_loc_id
                left JOIN units_of_measure as dim on dim.id=wrh_loc.dimensions_id
                left JOIN currency as curr on curr.id=wrh_loc.currency_id
                left JOIN warehouse as wrh on wrh.id=c.warehouse_id
                left JOIN company on company.id=c.company_id
                where  c.item_id=" . $attr['prod_id'] . " and c.status = " . $attr['status_id'] . " and wrh.status > 0 AND
                        c.company_id=" . $this->arrUser['company_id'] . "
                 order by c.id ASC ";

                 //(SELECT id From product_warehouse_loc_history where product_warehouse_id=c.id limit 1 ) as cost_history

        //, (SELECT sum(cost) as total From product_warehouse_loc_additional_cost where product_warehouse_loc_id=c.id ) as add_cost_total
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['prod_wrh_loc_id'];
                $result['no.'] = $Row['warehouseCode'];
                $result['warehouse'] = $Row['warehouse'];
                $result['warehouse_id'] = $Row['warehouse_id'];
                // $result['location_within Warehouse'] = $Row['warehouse_loc'];
                $result['storage_location'] = $Row['warehouse_loc'];
                $result['loc_id'] = $Row['warehouse_loc_id'];
                $result['currency'] = $Row['crname'];
                // $result['Cost'] = $Row['cost'];// + $Row['add_cost_total']
                if ($Row['cost'] > 0)
                    $result['Cost'] = $Row['cost'];
                else
                    $result['Cost'] = "-";
                $result['cost_history'] = $Row['cost_history'];
                $result['Unit_of Measure'] = $Row['dimtitle'];
                $result['cost_frequency'] = $Row['cost_type'];
                $result['stockcheck'] = $Row['stockcheck'];
                $result['Start_date'] = $this->objGeneral->convert_unix_into_date($Row['warehouse_loc_sdate']);
                // $result['add_cost'] = $Row['add_cost'];
                $result['Default'] = $Row['default_warehouse'];
                $result['status'] = $Row['add_cost_status'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_prod_warehouse_loc_byid($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT c.*,c.item_id,
                       c.warehouse_id,
                       c.status,
                       c.default_warehouse,
                       wrh_loc.description,
                       wrh_loc.bin_cost as cost,
                       wrh_loc.currency_id,
                       wrh_loc.dimensions_id as uom_id,
                       wrh_loc.cost_type_id,
                       wrh_loc.warehouse_loc_sdate
                From product_warehouse_location  c
                left JOIN warehouse_bin_location as wrh_loc on wrh_loc.id=c.warehouse_loc_id
                where  c.id=".$attr['id']." 
                limit 1 ";
        //echo $Sql;        

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();

            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            //echo "54<pre>"; print_r($Row);

            $Row['warehouse_loc_sdate'] = $this->objGeneral->convert_unix_into_date($Row['warehouse_loc_sdate']);
            //$Row['warehouse_loc_edate'] = $this->objGeneral->convert_unix_into_date($Row['warehouse_loc_edate']);

            $attr['unit_id'] = $Row['uom_id'];
            $attr['product_id'] = $Row['item_id'];
            $res = $this->get_predata($attr);
            //echo "54<pre>"; print_r($res); exit;           
            $Row['arr_warehouse'] = $res['response'];

            //$attr['id']=$Row['warehouse_loc_sdate'];
            //$attr['wrh_id']=$Row['warehouse_id'];

            $res2 = $this->get_location_by_warehouse_id_in_item($attr);
            $Row['WarehouseLocations'] = $res2['response']; 
             //echo "888<pre>"; print_r($res2);//exit; 

            $res3 = $this->get_bin_loc_add_cost($attr);
            $Row['warehouse_loc_add_cost_setup_Show'] = $res3['response']; 

            $res4 = $this->get_prod_warehouse_loc_add_cost($attr);
            $Row['prodWarehouseLocAddCostSetup'] = $res4['response'];

            // $res5 = $this->get_warehouse_loc_additional_cost_title();
            // $Row['additionalCostTitle'] = $res5['response'];  

            //echo "<pre>"; print_r($response);exit; 

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_warehouse_loc_cost_uom_by_itemid($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        // $response = array();

        $add_cost_chk_Sql = "SELECT bin_cost,description,warehouse_loc_sdate 
                             From warehouse_bin_location 
                             where id=" . $attr['location_id'] . "  and status=1 limit 1 ";
        //echo $add_cost_chk_Sql; exit;

        $add_cost_chk_RS = $this->objsetup->CSI($add_cost_chk_Sql);

        if ($add_cost_chk_RS->RecordCount() > 0) {
            $add_cost_chk_Row = $add_cost_chk_RS->FetchRow();
            $add_cost_chk = $add_cost_chk_Row['bin_cost'];

            $response['description'] = $add_cost_chk_Row['description'];
            $response['warehouse_loc_sdate'] = $this->objGeneral->convert_unix_into_date($add_cost_chk_Row['warehouse_loc_sdate']);

            // $add_cost_chk = $add_cost_chk_Row['currency_id'];

            if ($add_cost_chk > 0)
                $response['add_cost_chk'] = 1;
            else
                $response['add_cost_chk'] = 0;
        } else
            $response['add_cost_chk'] = 0;

        // $Sql = "SELECT c.id,c.bin_cost,c.description,c.warehouse_loc_sdate,c.cost_type_id,c.dimensions_id,c.currency_id
        //         From warehouse_bin_location  c
        //         left JOIN units_of_measure_setup as uom on uom.cat_id=c.dimensions_id
        //         left JOIN company on company.id=c.company_id
        //         where  c.status=1  and c.id=" . $attr['location_id'] . " and uom.product_id=" . $attr['prod_id'] . "  and
        //          (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
        //          limit 1 ";

        $Sql = "SELECT c.id,c.bin_cost,c.description,c.warehouse_loc_sdate,c.cost_type_id,c.dimensions_id,c.currency_id
                From warehouse_bin_location  c
                left JOIN units_of_measure_setup as uom on uom.cat_id=c.dimensions_id
                LEFT JOIN product AS prd ON prd.unit_id=c.dimensions_id
                where  c.status=1  AND 
                       c.id=" . $attr['location_id'] . " AND 
                       (uom.product_id=" . $attr['prod_id'] . " OR prd.id=" . $attr['prod_id'] . ")  AND
                       c.company_id=" . $this->arrUser['company_id'] . "
                 limit 1 ";

        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {

            $result = array();
            $Row = $RS->FetchRow();
            $result['id'] = $Row['id'];
            $result['title'] = $Row['title'];
            $result['currency'] = $Row['currency_id'];
            //$result['cost'] = $Row['bin_cost'];
            if ($Row['bin_cost'] > 0)
                $result['Cost'] = $Row['bin_cost'];
            else
                $result['Cost'] = "-";
            $result['cost_type_id'] = $Row['cost_type_id'];
            $result['uom_id'] = $Row['dimensions_id'];
            $result['description'] = $Row['description'];
            $result['warehouse_loc_sdate'] = $this->objGeneral->convert_unix_into_date($Row['warehouse_loc_sdate']);
            $response['response'] = $result;
            $response['ack'] = 1;
            $response['error'] = NULL;

        } else {

            $response['ack'] = 0;
            $response['error'] = NULL;
            $response['response'][] = array();
        }

        return $response;
    }

    // Product warehouse location Module End
    //--------------------------------------

    //----------------Product warehouse location Additional Cost Module----------------------

    function get_prod_warehouse_loc_add_cost($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";

        $response = array();

        $Sql = "SELECT c.id as wrh_additiona_cost_id,
                       cost_title.title as costtitle,
                       c.cost,
                       c.start_date,
                       dim.title as dimtitle,
		        CASE  WHEN c.status = 1 THEN 'Active'
		              WHEN c.status = 0 THEN 'Inactive'
		              END AS add_cost_status,
		        CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
		              WHEN c.cost_type_id = 2 THEN 'Daily'
		              WHEN c.cost_type_id = 3 THEN 'Weekly'
		              WHEN c.cost_type_id = 4 THEN 'Monthly'
		              WHEN c.cost_type_id = 5 THEN 'Annually'
		              END AS cost_type,
		        0 as cost_history
                From product_warehouse_loc_additional_cost  c
                left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                left JOIN warehouse_loc_additional_cost_title as cost_title on cost_title.id=c.add_cost_title_id
                where   c.item_id=".$attr['prod_id']." and 
                        c.product_warehouse_loc_id=".$attr['warehouse_loc_id']." and 
                        c.status = 1 and
                        c.company_id=" . $this->arrUser['company_id'] . "
                order by c.id ASC ";

        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);

        //$response['bin_loc_id'] = $attr[bin_loc_wrh_id];

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['wrh_additiona_cost_id'];
                $result['title'] = $Row['costtitle'];
                //$result['parent_location'] = $Row['parent_title'];
                $result['Cost'] = $Row['cost'];
                $result['Unit_of Measure'] = $Row['dimtitle'];
                $result['cost_frequency'] = $Row['cost_type'];
                $result['Start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                // $result['status'] = $Row['add_cost_status'];
                // $result['cost_history'] = $Row['cost_history'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_prod_warehouse_loc_add_cost_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $response = array();

        $Sql = "SELECT c.*  
                From product_warehouse_loc_additional_cost c 
                where c.id=".$attr['id']." 
                limit 1 ";
        // echo $Sql; exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {

            $Row = $RS->FetchRow();

            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $Row['additional_cost_sdate'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);

            $response['response'] = $Row;
            $response['additionalCostTitle'] = array();

            $Sql2 = "SELECT c.id as wrh_additiona_cost_id,
                       cost_title.title as costtitle,c.description as descr
                From warehouse_loc_additional_cost  c
                left JOIN warehouse_loc_additional_cost_title as cost_title on cost_title.id=c.add_cost_title_id
                left JOIN warehouse_bin_location as bin_location on bin_location.id=c.warehouse_bin_loc_id
                where  c.warehouse_id=".$attr['wrh_id']." and c.warehouse_bin_loc_id=".$attr['bin_loc_wrh_id']." and  c.status=1 and
                       c.company_id=" . $this->arrUser['company_id'] . "
                 order by c.id ASC ";
            // echo $Sql2; exit;

            $RS2 = $this->objsetup->CSI($Sql2);

            if ($RS2->RecordCount() > 0) {
                while ($Row2 = $RS2->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row2['wrh_additiona_cost_id'];
                    $result['title'] = $Row2['costtitle'];
                    $result['Description'] = $Row2['descr'];

                    $response['additionalCostTitle'][] = $result;
                }
            }


            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_item_warehouse_loc_add_cost_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "SELECT c.*  
                From product_warehouse_loc_additional_cost c 
                where c.id=".$attr['id']."
                limit 1 ";
        // echo $Sql; exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {

            $Row = $RS->FetchRow();

            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $Row['additional_cost_sdate'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);

            $response['response'] = $Row;
            // $response['additionalCostTitle'] = array();

            $res = $this->get_warehouse_loc_additional_cost_title();
            $response['additionalCostTitle'] = $res['response'];

            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_prod_warehouse_loc_add_cost($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        $id = $arr_attr['id'];

        $update_check = "";
        if ($arr_attr['id'] > 0)
            $update_check = "  AND tst.id <> " . $id . " ";

        $dimensions_id = (isset($arr_attr['dimensions_id']) && $arr_attr['dimensions_id']!='')?$arr_attr['dimensions_id']:0;
        $cost_type_id = (isset($arr_attr['cost_type_id']) && $arr_attr['cost_type_id']!='')?$arr_attr['cost_type_id']:0;


        $data_pass = "  tst.add_cost_title_id='" . $arr_attr['title_id'] . "' and
                        tst.item_id='" . $arr_attr['prod_id'] . "' and
                        tst.dimensions_id='" . $dimensions_id . "' and
                        tst.cost_type_id='" . $cost_type_id . "' and
                        tst.start_date='" . $this->objGeneral->convert_date($arr_attr['additional_cost_sdate']) . "' and
                        tst.product_warehouse_loc_id='" . $arr_attr['warehouse_loc_id'] . "'
                        and tst.status=1 ".$update_check;

        $total = $this->objGeneral->count_duplicate_in_sql('product_warehouse_loc_additional_cost', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($id == 0) {

            // check for duplicate warehouse location additional cost with same name and update the end date

            $prev_rec_Sql = "SELECT id,start_date 
                             From product_warehouse_loc_additional_cost 
                             where  add_cost_title_id='" . $arr_attr['title_id'] . "' and 
                                    end_date=0 and 
                                    status=1 
                             order by id desc 
                             limit 1";

            $prev_rec_RS = $this->objsetup->CSI($prev_rec_Sql);

            if ($prev_rec_RS->RecordCount() > 0) {
                $prev_rec_Row = $prev_rec_RS->FetchRow();
                $prev_rec_sdate = $prev_rec_Row["start_date"];

                $new_date = $this->objGeneral->convert_date($arr_attr['additional_cost_sdate']);

                if ($new_date > $prev_rec_sdate) {
                    $previous_day_date = strtotime('-1 day', $new_date);

                    if ($previous_day_date < $prev_rec_sdate)
                        $previous_day_date = $prev_rec_sdate;

                    $update_prev_rec_end_date_Sql = "UPDATE product_warehouse_loc_additional_cost
                                                     SET end_date='" . $previous_day_date . "'
                                                     WHERE id = " . $prev_rec_Row["id"] . "
                                                     Limit 1";

                    $this->objsetup->CSI($update_prev_rec_end_date_Sql);
                }
            }

            $Sql = "INSERT INTO product_warehouse_loc_additional_cost
                                SET
                                      item_id='".$arr_attr['prod_id']."',
                                      product_warehouse_loc_id='".$arr_attr['warehouse_loc_id']."',
                                      title='".$arr_attr['title']."',
                                      add_cost_title_id='".$arr_attr['title_id']."',
                                      description='".$arr_attr['description']."',
                                      cost='".$arr_attr['cost']."',
                                      dimensions_id='".$dimensions_id."',
                                      cost_type_id='".$cost_type_id."',
                                      start_date='" . $this->objGeneral->convert_date($arr_attr['additional_cost_sdate']) . "',
                                      user_id='" . $this->arrUser['id'] . "',
                                      company_id='" . $this->arrUser['company_id'] . "',
                                      status='".$arr_attr['status']."',
                                      AddedBy='" . $this->arrUser['id'] . "',
                                      AddedOn='" . current_date . "'";

            // echo $Sql;exit;

            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();

            if ($id > 0) {
                $arr_attr['wh_loc_additional_cost_id'] = $id;
                // $this->add_prod_loc_add_cost_history($arr_attr);
            }

        } else {

            // check date from previous record.

            $sel_Sql = "SELECT start_date,end_date 
                        from product_warehouse_loc_additional_cost 
                        WHERE id = " . $id . " 
                        Limit 1";
            //echo $sel_Sql;

            $sel_RS = $this->objsetup->CSI($sel_Sql);

            if ($sel_RS->RecordCount() > 0) {
                $sel_Row = $sel_RS->FetchRow();
                $previous_rec_date = $sel_Row['start_date'];
                $edate = $sel_Row['end_date'];

                /*if ($edate > 0) {
                    $response['ack'] = 0;
                    $response['error'] = 'This record is not editable';
                    return $response;
                }*/

                if ($this->objGeneral->convert_date($arr_attr['additional_cost_sdate']) < $previous_rec_date) {
                    $response['ack'] = 0;
                    $response['error'] = 'Date is earlier than previous recorded date';
                    return $response;
                }
            }

            $Sql = "UPDATE product_warehouse_loc_additional_cost
                              SET
									item_id='".$arr_attr['prod_id']."',
                                    product_warehouse_loc_id='".$arr_attr['warehouse_loc_id']."',
                                    title='".$arr_attr['title']."',
                                    add_cost_title_id='".$arr_attr['title_id']."',
                                    description='".$arr_attr['description']."',
                                    cost='".$arr_attr['cost']."',
                                    dimensions_id='".$dimensions_id."',
                                    cost_type_id='".$cost_type_id."',
                                    start_date='" . $this->objGeneral->convert_date($arr_attr['additional_cost_sdate']) . "',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    status='".$arr_attr['status']."',
                                    ChangedBy='" . $this->arrUser['id'] . "',
                                    ChangedOn='" . current_date . "'
                                WHERE id = " . $id . "  
                                Limit 1";
            // echo $Sql;exit;

            $RS = $this->objsetup->CSI($Sql);
            if ($this->Conn->Affected_Rows() > 0) {

                // $this->update_prod_loc_add_cost_history($arr_attr['additional_cost_sdate'], $id);

                $arr_attr['wh_loc_additional_cost_id'] = $id;
                // $this->add_prod_loc_add_cost_history($arr_attr);
            }
        }

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

    function get_location_by_warehouse_id_in_item($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "SELECT  c.id,c.title,c.dimensions_id,c.parent_id,c.bin_cost,
                        curr.code as crname,
                        dim.title as dimtitle,
                        ((SELECT COUNT(uom_setup.id) 
                         FROM units_of_measure_setup uom_setup 
                         WHERE  uom_setup.product_id='".$attr['product_id']."' AND 
                                uom_setup.cat_id=c.dimensions_id) +
                        (SELECT COUNT(product.unit_id) 
                         FROM product 
                         WHERE  product.id='".$attr['product_id']."' AND 
                                product.unit_id=c.dimensions_id))  as UOMexist,
                        CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
                            WHEN c.cost_type_id = 2 THEN 'Daily'
                            WHEN c.cost_type_id = 3 THEN 'Weekly'
                            WHEN c.cost_type_id = 4 THEN 'Monthly'
                            WHEN c.cost_type_id = 5 THEN 'Annually'
                            END AS cost_type
                From warehouse_bin_location  c
                left JOIN currency as curr on curr.id=c.currency_id
                left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                where  c.warehouse_id=".$attr['wrh_id']." and 
                       c.status=1 and
                       c.parent_id=0 and
                       c.company_id=" . $this->arrUser['company_id'] . "
                 order by c.id ASC ";
                 //='".$attr['unit_id']."' and 

        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];

                if($Row['UOMexist']>0){
                    if ($Row['bin_cost'] > 0)
                    $result['Storage_location'] = $Row['title'] . "(" . $Row['crname'] . " " . $Row['bin_cost'] . ", " . $Row['dimtitle'] . ", " . $Row['cost_type'] . ")";
                    else
                        $result['Storage_location'] = $Row['title'];
                    $response['response'][] = $result;
                }              

                $Sql_subparent = "SELECT c.id,c.title,c.dimensions_id,c.parent_id,c.bin_cost,
                                         curr.code as crname,dim.title as dimtitle,
                                         ((SELECT COUNT(uom_setup.id) 
                                          FROM units_of_measure_setup uom_setup 
                                          WHERE uom_setup.product_id='".$attr['product_id']."' AND 
                                                uom_setup.cat_id=c.dimensions_id) +
                                            (SELECT COUNT(product.unit_id) 
                                            FROM product 
                                            WHERE  product.id='".$attr['product_id']."' AND 
                                                    product.unit_id=c.dimensions_id)) as UOMexist,
                                          CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
                                                WHEN c.cost_type_id = 2 THEN 'Daily'
                                                WHEN c.cost_type_id = 3 THEN 'Weekly'
                                                WHEN c.cost_type_id = 4 THEN 'Monthly'
                                                WHEN c.cost_type_id = 5 THEN 'Annually'
                                                END AS cost_type
                                    From warehouse_bin_location  c
                                    left JOIN currency as curr on curr.id=c.currency_id
                                    left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                                    where   c.warehouse_id=".$attr['wrh_id']." AND 
                                            c.status=1 AND
                                            c.parent_id='" . $Row['id'] . "' AND
                                            c.company_id=" . $this->arrUser['company_id'] . "
                                     order by c.id ASC ";

                // echo $Sql_subparent; exit;
                $RS_subparent = $this->objsetup->CSI($Sql_subparent);

                if ($RS_subparent->RecordCount() > 0) {
                    while ($Row_subparent = $RS_subparent->FetchRow()) {

                        $result['id'] = $Row_subparent['id'];

                        if($Row_subparent['UOMexist']>0){
                            if ($Row_subparent['bin_cost'] > 0)
                                $result['Storage_location'] = " -- " . $Row_subparent['title'] . "(" . $Row_subparent['crname'] . " " . $Row_subparent['bin_cost'] . ", " . $Row_subparent['dimtitle'] . ", " . $Row_subparent['cost_type'] . ")";
                            else
                                $result['Storage_location'] = " -- " . $Row_subparent['title'];
                            $response['response'][] = $result;
                        }

                        $Sql_sub_subparent = "SELECT c.id,c.title,c.dimensions_id,c.parent_id,
                                                     c.bin_cost,curr.code as crname,
                                                     dim.title as dimtitle,
                                                     ((SELECT COUNT(uom_setup.id) 
                                                      FROM units_of_measure_setup uom_setup 
                                                      WHERE uom_setup.product_id='".$attr['product_id']."' AND 
                                                            uom_setup.cat_id=c.dimensions_id) +
                                                    (SELECT COUNT(product.unit_id) 
                                                    FROM product 
                                                    WHERE  product.id='".$attr['product_id']."' AND 
                                                            product.unit_id=c.dimensions_id)) as UOMexist,
                                                      CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
                                                            WHEN c.cost_type_id = 2 THEN 'Daily'
                                                            WHEN c.cost_type_id = 3 THEN 'Weekly'
                                                            WHEN c.cost_type_id = 4 THEN 'Monthly'
                                                            WHEN c.cost_type_id = 5 THEN 'Annually'
                                                       END AS cost_type
                                                From warehouse_bin_location  c
                                                left JOIN currency as curr on curr.id=c.currency_id
                                                left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                                                where   c.warehouse_id=".$attr['wrh_id']." and 
                                                        c.status=1 and 
                                                        c.parent_id=" . $Row_subparent['id'] . " and
                                                        c.company_id=" . $this->arrUser['company_id'] . "
                                                order by c.id ASC ";

                        // echo $Sql_sub_subparent; exit;
                        $RS_sub_subparent = $this->objsetup->CSI($Sql_sub_subparent);

                        if ($RS_sub_subparent->RecordCount() > 0) {
                            while ($Row_sub_subparent = $RS_sub_subparent->FetchRow()) {

                                $result['id'] = $Row_sub_subparent['id'];

                                if($Row_sub_subparent['UOMexist']>0){
                                    if ($Row_sub_subparent['bin_cost'] > 0)
                                        $result['Storage_location'] = " -- -- " . $Row_sub_subparent['title'] . "(" . $Row_sub_subparent['crname'] . " " . $Row_sub_subparent['bin_cost'] . ", " . $Row_sub_subparent['dimtitle'] . ", " . $Row_sub_subparent['cost_type'] . ")";
                                    else
                                        $result['Storage_location'] = " -- -- " . $Row_sub_subparent['title'];
                                    $response['response'][] = $result;
                                }


                                $Sql_sub_subparent2 = "SELECT c.id,c.title,c.dimensions_id,c.bin_cost,
                                                              c.parent_id,curr.code as crname,
                                                              dim.title as dimtitle,
                                                              ((SELECT COUNT(uom_setup.id) 
                                                               FROM units_of_measure_setup uom_setup 
                                                               WHERE uom_setup.product_id='".$attr['product_id']."' AND 
                                                                     uom_setup.cat_id=c.dimensions_id) +
                                                                (SELECT COUNT(product.unit_id) 
                                                                FROM product 
                                                                WHERE  product.id='".$attr['product_id']."' AND 
                                                                        product.unit_id=c.dimensions_id)) as UOMexist,
                                                                CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
                                                                    WHEN c.cost_type_id = 2 THEN 'Daily'
                                                                    WHEN c.cost_type_id = 3 THEN 'Weekly'
                                                                    WHEN c.cost_type_id = 4 THEN 'Monthly'
                                                                    WHEN c.cost_type_id = 5 THEN 'Annually'
                                                                    END AS cost_type
                                                        From warehouse_bin_location  c
                                                        left JOIN currency as curr on curr.id=c.currency_id
                                                        left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                                                        where   c.warehouse_id=".$attr['wrh_id']." and 
                                                                c.status=1 and 
                                                                c.parent_id=" . $Row_sub_subparent['id'] . " and
                                                                c.company_id=" . $this->arrUser['company_id'] . "
                                                        order by c.id ASC ";

                                // echo $Sql_sub_subparent2; exit;
                                $RS_sub_subparent2 = $this->objsetup->CSI($Sql_sub_subparent2);

                                if ($RS_sub_subparent2->RecordCount() > 0) {
                                    while ($Row_sub_subparent2 = $RS_sub_subparent2->FetchRow()) {

                                        $result['id'] = $Row_sub_subparent2['id'];
                                        
                                        if($Row_sub_subparent2['UOMexist']>0){
                                            if ($Row_sub_subparent2['bin_cost'] > 0)
                                                $result['Storage_location'] = " -- -- -- " . $Row_sub_subparent2['title'] . "(" . $Row_sub_subparent2['crname'] . " " . $Row_sub_subparent2['bin_cost'] . ", " . $Row_sub_subparent2['dimtitle'] . ", " . $Row_sub_subparent2['cost_type'] . ")";
                                            else
                                                $result['Storage_location'] = " -- -- -- " . $Row_sub_subparent2['title'];
                                            $response['response'][] = $result;
                                        }


                                        $Sql_sub_subparent3 = "SELECT c.id,c.title,c.dimensions_id,c.bin_cost,
                                                                      c.parent_id,curr.code as crname,
                                                                      dim.title as dimtitle,
                                                                      ((SELECT COUNT(uom_setup.id) 
                                                                        FROM units_of_measure_setup uom_setup 
                                                                        WHERE uom_setup.product_id='".$attr['product_id']."' AND 
                                                                                uom_setup.cat_id=c.dimensions_id) +
                                                                        (SELECT COUNT(product.unit_id) 
                                                                        FROM product 
                                                                        WHERE  product.id='".$attr['product_id']."' AND 
                                                                                product.unit_id=c.dimensions_id)) as UOMexist,
                                                                        CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
                                                                            WHEN c.cost_type_id = 2 THEN 'Daily'
                                                                            WHEN c.cost_type_id = 3 THEN 'Weekly'
                                                                            WHEN c.cost_type_id = 4 THEN 'Monthly'
                                                                            WHEN c.cost_type_id = 5 THEN 'Annually'
                                                                            END AS cost_type
                                                                From warehouse_bin_location  c
                                                                left JOIN currency as curr on curr.id=c.currency_id
                                                                left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                                                                where   c.warehouse_id=".$attr['wrh_id']." and 
                                                                        c.status=1 and 
                                                                        c.parent_id=" . $Row_sub_subparent2['id'] . " and
                                                                        c.company_id=" . $this->arrUser['company_id'] . "
                                                                order by c.id ASC ";

                                        // echo $Sql_sub_subparent3; exit;
                                        $RS_sub_subparent3 = $this->objsetup->CSI($Sql_sub_subparent3);

                                        if ($RS_sub_subparent3->RecordCount() > 0) {
                                            while ($Row_sub_subparent3 = $RS_sub_subparent3->FetchRow()) {

                                                $result['id'] = $Row_sub_subparent3['id'];

                                                if($Row_sub_subparent3['UOMexist']>0){
                                                    if ($Row_sub_subparent3['bin_cost'] > 0)
                                                        $result['Storage_location'] = " -- -- -- -- " . $Row_sub_subparent3['title'] . "(" . $Row_sub_subparent3['crname'] . " " . $Row_sub_subparent3['bin_cost'] . ", " . $Row_sub_subparent3['dimtitle'] . ", " . $Row_sub_subparent3['cost_type'] . ")";
                                                    else
                                                        $result['Storage_location'] = " -- -- -- -- " . $Row_sub_subparent3['title'];
                                                    $response['response'][] = $result;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
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

    function getLocByWarehouseIdLinktoItem($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "SELECT c.id AS prod_wh_loc_id,c.warehouse_loc_id AS wh_loc_id,wrh_loc.title,wrh_loc.bin_cost,curr.code AS crname,dim.title AS dimtitle,
                        CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
                            WHEN c.cost_type_id = 2 THEN 'Daily'
                            WHEN c.cost_type_id = 3 THEN 'Weekly'
                            WHEN c.cost_type_id = 4 THEN 'Monthly'
                            WHEN c.cost_type_id = 5 THEN 'Annually'
                            END AS cost_type
                From product_warehouse_location  c
                left JOIN warehouse_bin_location as wrh_loc on wrh_loc.id=c.warehouse_loc_id
                left JOIN currency as curr on curr.id=wrh_loc.currency_id
                left JOIN units_of_measure as dim on dim.id=wrh_loc.dimensions_id
                where  c.item_id=" . $attr['product_id'] . " AND 
                       c.warehouse_id='" . $attr['wrh_id']. "' AND 
                       c.status=1  AND
                       c.company_id=" . $this->arrUser['company_id'] . "
                 order by c.id ASC ";

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql, 'finance', sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['wh_loc_id'];
                $result['wh_loc_id'] = $Row['wh_loc_id'];
                $result['pwlID'] = $Row['prod_wh_loc_id'];

                if ($Row['bin_cost'] > 0)
                    $result['Storage_location'] = $Row['title'] . "(" . $Row['crname'] . " " . $Row['bin_cost'] . ", " . $Row['dimtitle'] . ", " . $Row['cost_type'] . ")";
                else
                    $result['Storage_location'] = $Row['title'];
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

    // Product warehouse location Additional Cost Module End
    //------------------------------------------------------

    // Product warehouse location Additional Cost history Start
    //-------------------------------------------------
    function add_prod_loc_add_cost_history($arr_attr)
    {
        $Sql = "INSERT INTO product_wh_loc_additional_cost_history
                                SET
                                      loc_additional_cost_id='".$arr_attr['wh_loc_additional_cost_id']."',
                                      cost_title_id='".$arr_attr['title_id']."',
                                      cost='".$arr_attr['cost']."',
                                      dimensions_id='".$arr_attr['dimensions_id']."',
                                      cost_type_id='".$arr_attr['cost_type_id']."',
                                      start_date='" . $this->objGeneral->convert_date($arr_attr['additional_cost_sdate']) . "',
                                      end_date =0,
                                      description = '".$arr_attr['description']."',
                                      action_date='" . current_date . "',
                                      status=1,
                                      user_id='" . $this->arrUser['id'] . "',
                                      company_id='" . $this->arrUser['company_id'] . "'
                                      ";
        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        return true;
    }

    function update_prod_loc_add_cost_history($date, $rec)
    {
        $sel_Sql = "SELECT id,start_date,end_date 
                    FROM product_wh_loc_additional_cost_history 
                    WHERE loc_additional_cost_id = " . $rec . " AND status=1 
                    ORDER BY id DESC 
                    LIMIT 1";
        //echo $sel_Sql;

        $sel_RS = $this->objsetup->CSI($sel_Sql);

        if ($sel_RS->RecordCount() > 0) {
            $sel_Row = $sel_RS->FetchRow();
            $rec_id = $sel_Row['id'];
            $start_date = $sel_Row['start_date'];
            $end_date = $sel_Row['end_date'];

            //$new_date = $this->objGeneral->convert_date($date);

            $current_date = $this->objGeneral->convert_date($date);
            $previous_day_date = strtotime('-1 day', $current_date);

            if ($previous_day_date < $start_date)
                $previous_day_date = $start_date;

            $Sql = "UPDATE product_wh_loc_additional_cost_history SET end_date='" . $previous_day_date . "' WHERE id = " . $rec_id . "   Limit 1";
            /*echo $Sql;  exit;*/

            $RS = $this->objsetup->CSI($Sql);
            return true;
        } else
            return false;
    }

    function alt_prod_warehouse_loc_add_cost_History($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "SELECT c.id as wrh_additiona_cost_id,cost_title.title as costtitle,c.cost,c.start_date,c.end_date,c.action_date,dim.title as dimtitle,
		        CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
		              WHEN c.cost_type_id = 2 THEN 'Daily'
		              WHEN c.cost_type_id = 3 THEN 'Weekly'
		              WHEN c.cost_type_id = 4 THEN 'Monthly'
		              WHEN c.cost_type_id = 5 THEN 'Annually'
		              END AS cost_type,
		              employees.first_name, employees.last_name
                From product_wh_loc_additional_cost_history  c
                left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                left JOIN warehouse_loc_additional_cost_title as cost_title on cost_title.id=c.cost_title_id
                left JOIN employees ON employees.id=c.user_id
                where  c.loc_additional_cost_id=".$attr['wrh_loc_id']." and c.status=1 and c.company_id=" . $this->arrUser['company_id'] . "
                order by c.id ASC ";


        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['wrh_additiona_cost_id'];
                $result['title'] = $Row['costtitle'];
                $result['Cost'] = $Row['cost'];
                $result['Unit_of Measure'] = $Row['dimtitle'];
                $result['cost_frequency'] = $Row['cost_type'];
                $result['Start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);

                if ($Row['start_date'] > current_date)
                    $result['del_chk'] = 1;
                else
                    $result['del_chk'] = 0;

                $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
                $result['change_date'] = $this->objGeneral->convert_unix_into_date($Row['action_date']);
                $result['changed_by'] = $Row['first_name'] . " " . $Row['last_name'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function delete_prod_warehouse_loc_add_cost_history($rec)
    {
        $sel_Sql = "SELECT id,loc_additional_cost_id,start_date from product_wh_loc_additional_cost_history WHERE id = " . $rec['id'] . " and status=1 Limit 1";
        // echo $sel_Sql;exit;

        $sel_RS = $this->objsetup->CSI($sel_Sql);

        if ($sel_RS->RecordCount() > 0) {
            $sel_Row = $sel_RS->FetchRow();
            $rec_id = $sel_Row['id'];
            $loc_additional_cost_id = $sel_Row['loc_additional_cost_id'];
            $start_date = $sel_Row['start_date'];

            $additional_cost_history_update_Sql = "UPDATE product_wh_loc_additional_cost_history SET status=0 WHERE id = " . $rec['id'] . " Limit 1";
            //echo $additional_cost_history_update_Sql; exit;

            $additional_cost_history_update_RS = $this->objsetup->CSI($additional_cost_history_update_Sql);

            $previous_day_date = strtotime('-1 day', $start_date);

            /*if ($previous_day_date1 < $start_date)
                $previous_day_date = $start_date;
            else
                $previous_day_date = $previous_day_date1;*/

            $sel_prev_rec_Sql = "SELECT * from product_wh_loc_additional_cost_history WHERE loc_additional_cost_id = " . $loc_additional_cost_id . " and end_date=" . $previous_day_date . "   Limit 1";

            $sel_prev_rec_RS = $this->objsetup->CSI($sel_prev_rec_Sql);

            if ($sel_prev_rec_RS->RecordCount() > 0) {

                $sel_prev_rec_Row = $sel_prev_rec_RS->FetchRow();

                $cost_title_id = $sel_prev_rec_Row['cost_title_id'];
                $description = $sel_prev_rec_Row['description'];
                $cost = $sel_prev_rec_Row['cost'];
                $dimensions_id = $sel_prev_rec_Row['dimensions_id'];
                $cost_type = $sel_prev_rec_Row['cost_type_id'];

                $Sql = "UPDATE product_wh_loc_additional_cost_history SET end_date='' WHERE loc_additional_cost_id = " . $loc_additional_cost_id . " and end_date=" . $previous_day_date . "   Limit 1";
                //echo $Sql;exit;

                $RS = $this->objsetup->CSI($Sql);

                $additional_cost_update_Sql = "UPDATE product_warehouse_loc_additional_cost
                                                  SET
                                                        add_cost_title_id='" . $cost_title_id . "',
                                                        description='" . $description . "',
                                                        cost='" . $cost . "',
                                                        dimensions_id='" . $dimensions_id . "',
                                                        cost_type_id='" . $cost_type . "',
                                                        start_date='" . $start_date . "',
                                                        end_date=''
                                                        WHERE id = " . $loc_additional_cost_id . "   Limit 1";
                //echo $additional_cost_update_Sql;  exit;
                $additional_cost_update_RS = $this->objsetup->CSI($additional_cost_update_Sql);
            }

            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record Deleted Successfully';

        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not Deleted!';
        }
        return $response;
    }

    // Product warehouse location Additional Cost history End
    //-----------------------------------------------

    function get_prod_WH_loc_for_stock_alloc($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT wrh_loc.description,wrh_loc.bin_cost as cost,wrh_loc.currency_id,
                      wrh_loc.dimensions_id as uom_id,wrh_loc.cost_type_id,wrh_loc.warehouse_loc_sdate,
                      c.warehouse_loc_id,c.warehouse_id,
                      curr.name as crname,dim.title as dimtitle,wrh.name as warehouse,wrh_loc.title as warehouse_loc,
                      wrh_loc.bin_cost as cost,wrh_loc.currency_id,wrh_loc.cost_type_id,wrh_loc.warehouse_loc_sdate,
		        CASE  WHEN c.default_warehouse = 1 THEN 'Yes'
		              WHEN c.default_warehouse = 0 THEN 'No'
		              END AS default_warehouse,
		        CASE  WHEN wrh_loc.cost_type_id = 1 THEN 'Fixed'
		              WHEN wrh_loc.cost_type_id = 2 THEN 'Daily'
		              WHEN wrh_loc.cost_type_id = 3 THEN 'Weekly'
		              WHEN wrh_loc.cost_type_id = 4 THEN 'Monthly'
		              WHEN wrh_loc.cost_type_id = 5 THEN 'Annually'
		              END AS cost_type
                From product_warehouse_location  c
                left JOIN warehouse_bin_location as wrh_loc on wrh_loc.id=c.warehouse_loc_id
                left JOIN units_of_measure as dim on dim.id=wrh_loc.dimensions_id
                left JOIN currency as curr on curr.id=wrh_loc.currency_id
                left JOIN warehouse as wrh on wrh.id=c.warehouse_id
                left JOIN company on company.id=c.company_id
                where c.id=" . $attr['loc_wrh_id'] . "  limit 1 ";
        //c.item_id=" . $attr['prod_id'] . " and c.warehouse_loc_id=" . $attr['loc_wrh_id'] . "

        //echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();

            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $Row['warehouse_loc_sdate'] = $this->objGeneral->convert_unix_into_date($Row['warehouse_loc_sdate']);

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_sel_warehouse_loc_in_stock_alloc($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "SELECT c.id as prod_wh_loc_id,c.warehouse_loc_id as wh_loc_id,wrh_loc.title,wrh_loc.bin_cost,curr.code as crname,dim.title as dimtitle,
		        CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
		              WHEN c.cost_type_id = 2 THEN 'Daily'
		              WHEN c.cost_type_id = 3 THEN 'Weekly'
		              WHEN c.cost_type_id = 4 THEN 'Monthly'
		              WHEN c.cost_type_id = 5 THEN 'Annually'
		              END AS cost_type
                From product_warehouse_location  c
                left JOIN warehouse_bin_location as wrh_loc on wrh_loc.id=c.warehouse_loc_id
                left JOIN currency as curr on curr.id=wrh_loc.currency_id
                left JOIN units_of_measure as dim on dim.id=wrh_loc.dimensions_id
                where   c.item_id=" . $attr['prod_id'] . " and 
                        c.warehouse_id='" . $attr['wrh_id'] . "' and c.status=1  and
                        c.company_id=" . $this->arrUser['company_id'] . "
                order by c.id ASC ";

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['prod_wh_loc_id'];
                $result['wh_loc_id'] = $Row['wh_loc_id'];
                if ($Row['bin_cost'] > 0)
                    $result['Storage_location'] = $Row['title'] . "(" . $Row['crname'] . " " . $Row['bin_cost'] . ", " . $Row['dimtitle'] . ", " . $Row['cost_type'] . ")";
                else
                    $result['Storage_location'] = $Row['title'];
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

    /* =====================================================================*/
    /*              warehouse allocation in orders and invoices start       */
    /* =====================================================================*/

    function get_all_product_warehouses($attr)
    {
        $response1 = array();

        //  $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT c.* 
                From sr_product_warehouses_sel as c
                where  c.item_id=" . $attr['prod_id'] . " and c.status ='1' and
                       c.company_id=" . $this->arrUser['company_id'] . "
                 group by  c.`warehouse`  order by c.id ASC ";

        $RS = $this->objsetup->CSI($Sql);

        //echo $Sql.';';
        if ($RS->RecordCount() > 0) {
            while ($Row2 = $RS->FetchRow()) {
                $result['id'] = $Row2['warehouse_id'];
                $result['name'] = $Row2['wrh_code'] . '-' . $Row2['warehouse'];

                if ($Row2['default_warehouse'] > 0) {
                    $response1['default_wh'] = $Row2['warehouse_id'];
                }

                $response1['response'][] = $result;
            }
            $response1['ack'] = 1;
            $response1['error'] = NULL;
        } else {
            $response1 = array();
        }
        return $response1;
    }

    function get_product_default_warehouse($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT c.warehouse_id,wrh.name as warehouse,wrh.wrh_code
                From product_warehouse_location  c
                left JOIN warehouse as wrh on wrh.id=c.warehouse_id
                where c.item_id=" . $attr['prod_id'] . " and c.status =1 and c.default_warehouse=1 and
                      c.company_id=" . $this->arrUser['company_id'] . "
                 limit 1 ";

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {

            $Row = $RS->FetchRow();
            $result['id'] = $Row['warehouse_id'];
            $response['response'] = $result;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    /* =====================================================================*/
    /*              warehouse allocation in orders and invoices End         */
    /* =====================================================================*/
    //----------------Warehouse Stock Allocation----------------------

    function get_stock_allocation_get_same_record($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";
        $response = array();

        if (!empty($attr['purchase_return_status'])) $where_clause .= " AND purchase_return_status = 1 ";
        else  $where_clause .= " AND purchase_return_status = 0 ";

        $Sql = "SELECT c.* ,w.name as wname 
                From warehouse_allocation  c 
                left JOIN warehouse w on w.id=c.warehouse_id 
                where   c.product_id='".$attr['item_id']."' AND 
                        c.order_id='".$attr['order_id']."' AND 
                        c.warehouse_id='".$attr['ware_id']."' AND
                        c.status=1 and c.type=1 AND 
                        c.company_id=" . $this->arrUser['company_id'] . "
                        ".$where_clause."
                Limit 1";

        $Sql3 = 'SELECT sum(quantity) as total_qty, wa.* 
                 FROM warehouse_allocation as wa
                 WHERE wa.product_id = ' . $attr['item_id'] . ' AND 
                        wa.order_id = ' . $attr['order_id'] . ' AND 
                        wa.ware_id = ' . $attr['ware_id'] . ' AND 
                        wa.company_id=' . $this->arrUser['company_id'] . '
                 Limit 1';

        $RS = $this->objsetup->CSI($Sql);
        // echo  $Sql;exit;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['location'] = $Row['wname'];
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
            $response['ack'] = 0;
            $response['response'][] = array();
        }

        return $response;
    }

    function get_stock_allocation_by_id($attr)
    {
        $Sql = "SELECT *
				FROM warehouse_allocation
				WHERE id=".$attr['id']."
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

            $Row['prod_date'] = $this->objGeneral->convert_unix_into_date($Row['prod_date']);
            $Row['date_received'] = $this->objGeneral->convert_unix_into_date($Row['date_received']);
            $Row['use_by_date'] = $this->objGeneral->convert_unix_into_date($Row['use_by_date']);

            $response['response'] = $Row;
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function deleteStkAllocation($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if($attr['order_id'] > 0){
            
            $checkAlreadyReceived = "SELECT purchaseStatus
                                    FROM srm_invoice 
                                    WHERE id= " . $attr['order_id']. " AND 
                                        company_id = '" . $this->arrUser['company_id'] . "'
                                    LIMIT 1";        
            $RsAlreadyReceived = $this->objsetup->CSI($checkAlreadyReceived);
            
            if($RsAlreadyReceived->fields['purchaseStatus'] == 2)
            {
                $response['ack'] = 2;
                $response['error'] = ' Already Received';
                return $response;
            }

            if($RsAlreadyReceived->fields['purchaseStatus'] == 3)
            {
                $response['ack'] = 2;
                $response['error'] = ' Already Invoiced';
                return $response;
            }
        }


        $Sql = "Delete from warehouse_allocation where id=" . $attr['id'];
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

    function get_stock_allocation($attr,$orderLineID)
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
                       w.id = '" . $attr['warehouses_id'] . "'and
                       c.purchase_order_detail_id = '" . $orderLineID. "'and
                       c.status=1 and c.type='" . $attr['type_id'] . "'
                       " . $where_clause . " and
                       c.company_id=" . $this->arrUser['company_id'] . "
                order by c.id ASC ";

        // echo $Sql;exit;
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
            $response['response'][] = array();
        }


        if (!empty($attr['purchase_return_status'])) {
            $sql_total_purchase_return = "SELECT  sum(quantity) as total  
                                            From warehouse_allocation  c 
                                            where  c.product_id=".$attr['product_id']."  and  c.status=1 and c.type=1 and
                                                   c.order_id=".$attr['order_id']." and c.warehouse_id=".$attr['warehouses_id']." and
                                                   purchase_return_status = 1  and c.company_id=" . $this->arrUser['company_id'] . " ";

            $rs_count_pr = $this->objsetup->CSI($sql_total_purchase_return);
            $response['total_pr'] = $rs_count_pr->fields['total'];

        }
        $sql_total = "SELECT  sum(quantity) as total  
                        From warehouse_allocation  c 
                        where  c.product_id=".$attr['product_id']."  and  c.status=1 and c.type=1 and
                               c.order_id=".$attr['order_id']." and c.warehouse_id=".$attr['warehouses_id']." AND
                               purchase_return_status = 0 and c.company_id=" . $this->arrUser['company_id'] . " ";

        $rs_count = $this->objsetup->CSI($sql_total);
        $response['total'] = $rs_count->fields['total'];

        return $response;
    }

    function add_stk_allocation($arr_attr)
    {
        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['ErrorMessage'] = "";

        $this->objsetup->SRTraceLogsPHP($srLogTrace);   
            
        $checkAlreadyReceived = "SELECT purchaseStatus
                                FROM srm_invoice 
                                WHERE id= " . $arr_attr['order_id']. " AND 
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

    
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false; 

        $purchase_return_status = "";
        $update_check = "";

        if (!empty($arr_attr['purchase_return_status']))
            $purchase_return_status .= "  purchase_return_status = 1 ";
        else
            $purchase_return_status .= "  purchase_return_status = 0 ";

        // $id = $arr_attr['id'];
        $id = (isset($arr_attr['id']) && $arr_attr['id']!='')?$arr_attr['id']:0;
        $primary_unit_id = (isset($arr_attr['primary_unit_id']) && $arr_attr['primary_unit_id']!='')?$arr_attr['primary_unit_id']:0;
        $unit_of_measure_id = (isset($arr_attr['unit_of_measure_id']) && $arr_attr['unit_of_measure_id']!='')?$arr_attr['unit_of_measure_id']:0;
        $unit_of_measure_qty = (isset($arr_attr['unit_of_measure_qty']) && $arr_attr['unit_of_measure_qty']!='')?$arr_attr['unit_of_measure_qty']:1;

        if ($id > 0)
            $update_check = "  AND tst.id <> " . $id . " ";

        if($arr_attr['container_no']!=''){
            // $container_no = "  tst.container_no='" . $arr_attr['container_no'] . "' and  ";
            /* else
                $container_no = ""; */
            //tst.container_no is not NULL   

            $data_pass = "  tst.type='" . $arr_attr['type'] . "' and
                            tst.order_id='" . $arr_attr['order_id'] . "'  and
                            tst.product_id='" . $arr_attr['product_id'] . "' and
                            tst.warehouse_id='" . $arr_attr['warehouses_id'] . "' and
                            tst.purchase_order_detail_id='" . $arr_attr['orderLineID'] . "' and
                            tst.purchase_return_status='" . $arr_attr['purchase_return_status'] . "' and
                            tst.location='" . $arr_attr['location'] . "' and
                            tst.container_no='" . $arr_attr['container_no'] . "'  
                            " . $update_check . " ";

            $total = $this->objGeneral->count_duplicate_in_sql('warehouse_allocation', $data_pass, $this->arrUser['company_id']);

            if ($total > 0) {
                $response['ack'] = 0;
                $response['error'] = 'Record Already Exists.';
                return $response;
            }
        }
        $date_receivedUnConv = ""; 

        if($arr_attr['date_received'] > 0){
            $date_receivedUnConv = "date_receivedUnConv = '" . $this->objGeneral->convertUnixDateIntoConvDate($arr_attr['date_received']) . "',";            
        }
        if ($id>0) {
            

            $Sql = "UPDATE warehouse_allocation
                            SET
                                container_no='" . $arr_attr['container_no'] . "',
                                purchase_order_detail_id='" . $arr_attr['orderLineID'] . "',
                                batch_no='" . $arr_attr['batch_no'] . "',
                                quantity='" . $arr_attr['stock_qty'] . "',
                                remaining_qty='" . $arr_attr['stock_qty'] . "',
                                prod_date='" . $this->objGeneral->convert_date($arr_attr['prod_date']) . "',
                                date_received='" . $this->objGeneral->convert_date($arr_attr['date_received']) . "',
                                ".$date_receivedUnConv."
                                use_by_date='" . $this->objGeneral->convert_date($arr_attr['use_by_date']) . "',
                                primary_unit_id='" . $primary_unit_id . "',
                                primary_unit_name='" . $arr_attr['primary_unit_name'] . "',
                                primary_unit_qty='" . $arr_attr['primary_unit_qty'] . "',
                                unit_measure_id='" . $unit_of_measure_id . "',
                                unit_measure_name='" . $arr_attr['unit_of_measure_name'] . "',
                                unit_measure_qty='" . $unit_of_measure_qty . "',
                                ChangedBy='" . $this->arrUser['id'] . "',
                                ChangedOn='" . current_date . "',
                                location='" . $arr_attr['location'] . "'
                    WHERE id = " . $id . "   Limit 1";

            /*,cost='" . $arr_attr[cost] . "'*/

        } else {
            

            $Sql = "INSERT INTO warehouse_allocation
                                SET
                                      " . $purchase_return_status . ",
                                      status=1,
                                      container_no='" . $arr_attr['container_no'] . "',
                                      purchase_order_detail_id='" . $arr_attr['orderLineID'] . "',
                                      purchase_status='" . $arr_attr['purchase_status'] . "',
                                      bl_shipment_no='" . $arr_attr['bl_shipment_no'] . "',
                                      quantity='" . $arr_attr['stock_qty'] . "',
                                      remaining_qty='" . $arr_attr['stock_qty'] . "',
                                      batch_no='" . $arr_attr['batch_no'] . "',
                                      order_id='" . $arr_attr['order_id'] . "',
                                      product_id='" . $arr_attr['product_id'] . "',
                                      warehouse_id='" . $arr_attr['warehouses_id'] . "',
                                      type='" . $arr_attr['type'] . "',
                                      supplier_id='" . $arr_attr['supplier_id'] . "',
                                      order_date='" . $this->objGeneral->convert_date($arr_attr['order_date']) . "',
                                      unit_measure='" . $arr_attr['unit_of_measure_name'] . "',
                                      primary_unit_id='" . $primary_unit_id . "',
                                      primary_unit_name='" . $arr_attr['primary_unit_name'] . "',
                                      primary_unit_qty='" . $arr_attr['primary_unit_qty'] . "' ,
                                      unit_measure_id='" . $unit_of_measure_id . "',
                                      unit_measure_name='" . $arr_attr['unit_of_measure_name'] . "',
                                      unit_measure_qty='" . $unit_of_measure_qty . "',
                                      item_trace_unique_id = UUID(),
                                      user_id='" . $this->arrUser['id'] . "',
                                      company_id='" . $this->arrUser['company_id'] . "',
                                      prod_date='" . $this->objGeneral->convert_date($arr_attr['prod_date']) . "',
                                      date_received='" . $this->objGeneral->convert_date($arr_attr['date_received']) . "',
                                      ".$date_receivedUnConv."  
                                      AddedBy='" . $this->arrUser['id'] . "',
                                      AddedOn='" . current_date . "',
                                      use_by_date='" . $this->objGeneral->convert_date($arr_attr['use_by_date']) . "',
                                      location='" . $arr_attr['location'] . "'";

            /*,cost='" . $arr_attr[cost] . "'*/
        }
        // echo $Sql; exit;

        $RS = $this->objsetup->CSI($Sql);
        $insertid = $this->Conn->Insert_ID();  
        //echo $id;exit;   

        if ($id > 0) {
            $response['id'] = $id;
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
            $srLogTrace['input_text'] = $Sql;

            $this->objsetup->SRTraceLogsPHP($srLogTrace);

        } elseif(!($id > 0)){
           $id=$insertid;

            if ($id >0){
                $response['id'] = $id;
                $response['ack'] = 1;
                $response['error'] = 'Record Inserted Successfully';
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
            }else{
                $response['ack'] = 0;
                $response['error'] = 'Record not inserted';

                $srLogTrace = array();
                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'Exit';
                $srLogTrace['ErrorMessage'] = "Error Code: $srLogTrace[ErrorCode]  -- Message: 'Record not inserted'  -- Function: ". __FUNCTION__."  -- Query: $Sql ";

                $this->objsetup->SRTraceLogsPHP($srLogTrace);

                $this->Conn->rollbackTrans();
                $this->Conn->autoCommit = true;
            }
        }
        else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';

            $srLogTrace = array();

            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = "Error Code: $srLogTrace[ErrorCode]  -- Message: 'Record not inserted'  -- Function: ". __FUNCTION__."  -- Query: $Sql ";

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            $this->Conn->rollbackTrans();
            $this->Conn->autoCommit = true;
        }
        return $response;
    }

    //----------------Item Journal Stock Allocation----------------------

    function itemJournalStockAllocation($arr_attr)
    {
        $purchase_return_status = "";

        if (!empty($arr_attr['purchase_return_status']))
            $purchase_return_status .= "  purchase_return_status = 1 ";
        else
            $purchase_return_status .= "  purchase_return_status = 0 ";

        // $id = $arr_attr['id'];
        $id = (isset($arr_attr['id']) && $arr_attr['id']!='')?$arr_attr['id']:0;
        
        if ($id > 0)
            $update_check = "  AND tst.id <> " . $id . " ";

        if($arr_attr['container_no']!=''){

            $data_pass = "  tst.type=3 and
                            tst.order_id='" . $arr_attr['order_id'] . "'  and
                            tst.product_id='" . $arr_attr['product_id'] . "' and
                            tst.warehouse_id='" . $arr_attr['warehouses_id'] . "' and
                            tst.item_journal_detail_id='" . $arr_attr['orderLineID'] . "' and
                            tst.location='" . $arr_attr['location'] . "' and
                            tst.container_no='" . $arr_attr['container_no'] . "'  
                            " . $update_check . " ";

            $total = $this->objGeneral->count_duplicate_in_sql('warehouse_allocation', $data_pass, $this->arrUser['company_id']);

            if ($total > 0) {
                $response['ack'] = 0;
                $response['error'] = 'Record Already Exists.';
                return $response;
            }
        }
        $date_receivedUnConv = ""; 

        if($arr_attr['date_received'] > 0){
            $date_receivedUnConv = "date_receivedUnConv = '" . $this->objGeneral->convertUnixDateIntoConvDate($arr_attr['date_received']) . "',";            
        }
        if ($id>0) {            

            $Sql = "UPDATE warehouse_allocation
                            SET
                                container_no='" . $arr_attr['container_no'] . "',
                                item_journal_detail_id='" . $arr_attr['orderLineID'] . "',
                                batch_no='" . $arr_attr['batch_no'] . "',
                                quantity='" . $arr_attr['stock_qty'] . "',
                                remaining_qty='" . $arr_attr['stock_qty'] . "',
                                prod_date='" . $this->objGeneral->convert_date($arr_attr['prod_date']) . "',
                                date_received='" . $this->objGeneral->convert_date($arr_attr['date_received']) . "',
                                ".$date_receivedUnConv."
                                use_by_date='" . $this->objGeneral->convert_date($arr_attr['use_by_date']) . "',
                                primary_unit_id='" . $this->objGeneral->emptyToZero($arr_attr['primary_unit_id']) . "',
                                primary_unit_name='" . $arr_attr['primary_unit_name'] . "',
                                primary_unit_qty='" . $this->objGeneral->emptyToZero($arr_attr['primary_unit_qty']) . "',
                                unit_measure_id='" . $this->objGeneral->emptyToZero($arr_attr['unit_of_measure_id']) . "',
                                unit_measure_name='" . $arr_attr['unit_of_measure_name'] . "',
                                unit_measure_qty='" . $this->objGeneral->emptyToZero($arr_attr['unit_of_measure_qty']) . "',
                                ChangedBy='" . $this->arrUser['id'] . "',
                                ChangedOn='" . current_date_time . "',
                                location='" . $arr_attr['location'] . "'
                            WHERE id = " . $id . "   
                            Limit 1";

        } else {
            

            $Sql = "INSERT INTO warehouse_allocation
                                SET
                                      " . $purchase_return_status . ",
                                      status=1,
                                      container_no='" . $arr_attr['container_no'] . "',
                                      item_journal_detail_id='" . $arr_attr['orderLineID'] . "',
                                      purchase_status=0,
                                      bl_shipment_no='" . $arr_attr['bl_shipment_no'] . "',
                                      quantity='" . $arr_attr['stock_qty'] . "',
                                      remaining_qty='" . $arr_attr['stock_qty'] . "',
                                      batch_no='" . $arr_attr['batch_no'] . "',
                                      order_id='" . $arr_attr['order_id'] . "',
                                      product_id='" . $arr_attr['product_id'] . "',
                                      warehouse_id='" . $arr_attr['warehouses_id'] . "',
                                      type=3,
                                      ledger_type = 1,
                                      journal_status=1,
                                      order_date='" . $this->objGeneral->convert_date($arr_attr['order_date']) . "',
                                      unit_measure='" . $arr_attr['unit_of_measure_name'] . "',
                                      primary_unit_id='" . $this->objGeneral->emptyToZero($arr_attr['primary_unit_id']) . "',
                                      primary_unit_name='" . $arr_attr['primary_unit_name'] . "',
                                      primary_unit_qty='" . $this->objGeneral->emptyToZero($arr_attr['primary_unit_qty']) . "' ,
                                      unit_measure_id='" . $this->objGeneral->emptyToZero($arr_attr['unit_of_measure_id']) . "',
                                      unit_measure_name='" . $arr_attr['unit_of_measure_name'] . "',
                                      unit_measure_qty='" . $this->objGeneral->emptyToZero($arr_attr['unit_of_measure_qty']) . "',
                                      user_id='" . $this->arrUser['id'] . "',
                                      company_id='" . $this->arrUser['company_id'] . "',
                                      prod_date='" . $this->objGeneral->convert_date($arr_attr['prod_date']) . "',
                                      date_received='" . $this->objGeneral->convert_date($arr_attr['date_received']) . "',
                                      ".$date_receivedUnConv."
                                      use_by_date='" . $this->objGeneral->convert_date($arr_attr['use_by_date']) . "',
                                      AddedBy='" . $this->arrUser['id'] . "',
                                      item_trace_unique_id = UUID(),
                                      AddedOn='" . current_date_time . "',
                                      location='" . $arr_attr['location'] . "'";
        }
        // echo $Sql; exit;

        $RS = $this->objsetup->CSI($Sql);
        $insertid = $this->Conn->Insert_ID();  
        //echo $id;exit;   

        if ($id > 0) {
            $response['id'] = $id;
            $response['ack'] = 1;
            $response['error'] = 'Record Updated Successfully';

        } elseif(!($id > 0)){
           $id=$insertid;

            if ($id >0){
                $response['id'] = $id;
                $response['ack'] = 1;
                $response['error'] = 'Record Inserted Successfully';
            }else{
                $response['ack'] = 0;
                $response['error'] = 'Record not inserted';
            }
        }
        else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
        }
        return $response;
    }

    //-----------Alt Depot Module---------------------------

    function get_alt_depots($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = "";
        $response = array();

        $Sql = "SELECT c.id,c.depot,c.contact_name AS contact_person,c.direct_line,c.mobile,c.email,c.role 
                FROM warehouse_alt_depot  c
                WHERE  c.wrh_id=".$attr['id']." AND c.status=1 AND c.company_id=" . $this->arrUser['company_id'] . "		 
                ORDER BY c.id ASC ";

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['contact_name'] = $Row['contact_person'];
                $result['job_title'] = $Row['role'];
                $result['location_name'] = $Row['depot'];
                $result['direct_line'] = $Row['direct_line'];
                $result['mobile'] = $Row['mobile'];
                $result['email'] = $Row['email'];
                //	$result['status'] = ($Row['status'] == 1)?"Inactive":"Active";

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_alt_depot($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        //print_r($arr_attr);exit;
        $id = $arr_attr['id'];

        $update_check = "";
        if ($arr_attr['id'] > 0)
            $update_check = "  AND tst.id <> " . $id . " ";

        $data_pass = "   tst.contact_name='" . $arr_attr['contact_name'] . "' ".$update_check;
        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_alt_depot', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
        if ($id == 0) {


            $Sql = "INSERT INTO warehouse_alt_depot 
                                    SET
									    depot='$arr_attr[depot]',
                                        depot_address='$arr_attr[depot_address]',
                                        role='$arr_attr[role]',
                                        contact_name='$arr_attr[contact_name]',
                                        role='$arr_attr[role]',
                                        address='$arr_attr[address]',
                                        address_2='$arr_attr[address_2]',
                                        telephone='$arr_attr[telephone]',
                                        city='$arr_attr[city]',
                                        fax='$arr_attr[fax]',
                                        county='$arr_attr[county]',
                                        country='$arr_attr[country]',
                                        mobile='$arr_attr[mobile]',
                                        postcode='$arr_attr[postcode]',
                                        direct_line='$arr_attr[direct_line]',
                                        email='$arr_attr[email]',
                                        web_add='$arr_attr[web_add]',
                                        crm_id='$arr_attr[crm_id]',
                                        book_in_contact='$arr_attr[book_in_contact]',
                                        book_in_tel='$arr_attr[book_in_tel]',
                                        book_in_email='$arr_attr[book_in_email]',
                                        book_in_fax='$arr_attr[book_in_fax]',
                                        booking_instructions='$arr_attr[booking_instructions]',
                                        booking_start_time='$arr_attr[booking_start_time]',
                                        booking_end_time='$arr_attr[booking_end_time]',
                                        user_id='" . $this->arrUser['id'] . "',
                                        company_id='" . $this->arrUser['company_id'] . "'";

            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
            // }
        } else {
            $Sql = "UPDATE warehouse_alt_depot 
                            SET  
								depot='$arr_attr[depot]',
                                depot_address='$arr_attr[job]',
                                role='$arr_attr[role]',
                                contact_name='$arr_attr[contact_name]',
                                role='$arr_attr[role]',
                                address='$arr_attr[address]',
                                address_2='$arr_attr[address_2]',
                                telephone='$arr_attr[telephone]',
                                city='$arr_attr[city]',
                                fax='$arr_attr[fax]',
                                county='$arr_attr[county]',
                                country='$arr_attr[country]',
                                mobile='$arr_attr[mobile]',
                                postcode='$arr_attr[postcode]',
                                direct_line='$arr_attr[direct_line]',
                                email='$arr_attr[email]',
                                web_add='$arr_attr[web_add]',
                                crm_id='$arr_attr[crm_id]',
                                book_in_contact='$arr_attr[book_in_contact]',
                                book_in_tel='$arr_attr[book_in_tel]',
                                book_in_email='$arr_attr[book_in_email]',
                                book_in_fax='$arr_attr[book_in_fax]',
                                booking_instructions='$arr_attr[booking_instructions]',
                                booking_start_time='$arr_attr[booking_start_time]',
                                booking_end_time='$arr_attr[booking_end_time]' 
                            WHERE id = " . $id . "   
                            Limit 1";
            $RS = $this->objsetup->CSI($Sql);
        }

        ///	 echo $Sql;exit;

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

    //----------------- SRM Price Offer-----------------------------------

    function get_price_offer_listings($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";

        $response = array();
        $response2 = array();

        $Sql = "SELECT c.id,c.name,c.description,c.type
                FROM  price_offer_volume  c  
                where c.status=1 and c.company_id=" . $this->arrUser['company_id'] . "		 
                order by c.id ASC ";

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['type'] = $Row['type'];
                $result['description'] = $Row['description'];
                $response2['response_price'][] = $result;
            }
        }

        $Sql = "SELECT c.*
                From warehouse_price_offer_listing  c 
                where  c.wrh_id=".$attr['id']." and c.status=1 and 
                        c.company_id=" . $this->arrUser['company_id'] . "		 
                order by c.id ASC "; //Volume 1


        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];

                $result['code'] = $Row['product_code'];
                $result['description'] = $Row['product_description'];

                if ($Row['type'] == 1) {
                    $result['Type'] = 'Item';
                } else {
                    $result['Type'] = 'Service';
                }

                $result['offered_by'] = $Row['offered_by'];
                $result['sdate'] = $this->objGeneral->convert_unix_into_date($Row['offer_date']);
                $result['edate'] = $this->objGeneral->convert_unix_into_date($Row['offer_valid_date']);

                foreach ($response2['response_price'] as $key => $m_id) {
                    if ($Row['volume_1'] == $m_id['id'] && $m_id['type'] == 'Volume 1')
                        $result['volume1'] = $m_id['description'];
                    if ($Row['volume_2'] == $m_id['id'] && $m_id['type'] == 'Volume 2')
                        $result['volume2'] = $m_id['description'];
                    if ($Row['volume_3'] == $m_id['id'] && $m_id['type'] == 'Volume 3')
                        $result['volume3'] = $m_id['description'];
                }

                $result['price1'] = $Row['volume_1_price'];
                $result['price2'] = $Row['volume_2_price'];
                $result['price3'] = $Row['volume_3_price'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_warehouse_price_offer_listing($attr)
    {
        //	print_r($attr);exit;
        $id = $attr['update_id'];

        $update_check = "";
        if ($attr['id'] > 0)
            $update_check = "  AND tst.id <> " . $id . " ";

        $data_pass = "  tst.offered_by='" . $attr['offered_by'] . "' and 
                        tst.type = '".$attr['type']."' and 
                        tst.module_id='" . $attr['crm_id'] . "'   ". $update_check;

        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_price_offer_listing', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($id == 0) {

            $Sql = "INSERT INTO warehouse_price_offer_listing
                    SET crm_id = '$attr[crm_id]',offered_by = '$attr[offered_by]',product_id = '$attr[product_id]',offered_by_id = '$attr[offered_by_id]',offer_method_id = '$attr[offer_method_id]',price_offered = '$attr[price_offered]',currency_id = '$attr[currency_id]',offer_date = '" . $this->objGeneral->convert_date($attr['offer_date']) . "',offer_valid_date ='" . $this->objGeneral->convert_date($attr[offer_valid_date]) . "',volume_1 = '$attr[volume_1]',volume_2 = '$attr[volume_2]',volume_3 = '$attr[volume_3]',`volume_1_price` = '$attr[volume_1_price]',`volume_2_price` = '$attr[volume_2_price]',`volume_3_price` = '$attr[volume_3_price]',`unit_of_measure_1` = '$attr[unit_of_measure_1]',`unit_of_measure_2` = '$attr[unit_of_measure_2]',`unit_of_measure_3` = '$attr[unit_of_measure_3]',comment = '$attr[comment]'
                    ,type = '".$attr['type']."',product_code = '$attr[product_code]',product_description = '$attr[product_description]' ,user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
            // }
        } else {


            $Sql = "UPDATE warehouse_price_offer_listing
                    SET product_id = '$attr[product_id]',offered_by = '$attr[offered_by]',offered_by_id = '$attr[offered_by_id]',offer_method_id = '$attr[offer_method_id]',price_offered = '$attr[price_offered]',currency_id = '$attr[currency_id]',offer_date = '" . $this->objGeneral->convert_date($attr['offer_date']) . "',offer_valid_date = '" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "',volume_1 = '$attr[volume_1]',volume_2 = '$attr[volume_2]',volume_3 = '$attr[volume_3]',`volume_1_price` = '$attr[volume_1_price]',`volume_2_price` = '$attr[volume_2_price]',`volume_3_price` = '$attr[volume_3_price]',`unit_of_measure_1` = '$attr[unit_of_measure_1]',`unit_of_measure_2` = '$attr[unit_of_measure_2]',`unit_of_measure_3` = '$attr[unit_of_measure_3]',comment = '$attr[comment]'
                    ,type = '".$attr['type']."',product_code = '$attr[product_code]',product_description = '$attr[product_description]' 
                    WHERE id = $id ";
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

    function get_price_list_in_volume($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";
        $response = array();

        $Sql = "SELECT c.*
                From warehouse_price_offer_listing  c 
                where  c.wrh_id=".$attr['id']." and c.status=1 and 
                        c.company_id=" . $this->arrUser['company_id'] . "		 
                order by c.id ASC ";

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];

                if ($Row['type'] == 1) {
                    $result['Type'] = 'Item';
                } else {
                    $result['Type'] = 'Service';
                }

                $result['item_code'] = $Row['product_code'];
                $result['item_description'] = $Row['product_description'];
                //$result['list_price'] = $Row['offer_date']; 
                $result['offered_by'] = $Row['offered_by'];
                $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['offer_date']);
                $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['offer_valid_date']);

                $result['volume_1'] = $Row['volume_1'];
                $result['volume_2'] = $Row['volume_2'];
                $result['volume_3'] = $Row['volume_3'];

                $result['volume_1_price'] = $Row['volume_1_price'];
                $result['volume_2_price'] = $Row['volume_2_price'];
                $result['volume_3_price'] = $Row['volume_3_price'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_price_offer_volume_by_type($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM warehouse_price_offer_listing
				WHERE type='".$attr['type']."' AND company_id =" . $this->arrUser['company_id'];

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

    //------------- Price Offer Volume Module-------------------------
    function get_supplier_list_product_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";
        $response = array();

        $Sql = "SELECT srm_volume_discount.id,srm_volume_discount.start_date,srm_volume_discount.end_date,
                        srm_volume_discount.discount_value,srm_volume_discount.supplier_type,v.description,
                        srm_volume_discount.purchase_price,srm_volume_discount.discount_price,srm_volume_discount.product_code
                FROM warehouse_volume_discount 
                Left JOIN price_offer_volume  v ON v.id = srm_volume_discount.volume_id 
                WHERE srm_volume_discount.crm_id='".$attr['crm_id']."' and srm_volume_discount.status=1
                order by srm_volume_discount.id ASC"; //,srm_volume_discount.type

        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['Volume'] = $Row['description'];

                $result[' Standard  Price'] = $Row['purchase_price'];
                $result['code'] = $Row['product_code'];
                // if($Row['type']==1){$result['Type'] = 'Item' ;}	else{$result['Type'] =  'Service';}

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

    function add_warehouse_volume_discount_listing($attr)
    {

        $doc_id = $attr['update_id'];

        $update_check = "";
        if ($doc_id > 0)
            $update_check = "  AND tst.id <> " . $doc_id . " ";

        $data_pass = "   tst.offered_by='" . $attr['offered_by'] . "' and tst.type = '".$attr['type']."' and tst.module_id='" . $attr['crm_id'] . "'    $update_check";
        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_volume_discount_listing', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($doc_id == 0) {


            $Sql = "INSERT INTO warehouse_volume_discount_listing
						SET crm_id = '$attr[crm_id]',offered_by = '$attr[offered_by]',offered_by_id = '$attr[offered_by_id]',product_id = '$attr[product_id]',product_code = '$attr[product_code]',product_description = '$attr[product_description]',offer_method_id = '$attr[offer_method_id]', offer_valid_date = '" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "',offer_date = '" . $this->objGeneral->convert_date($attr['offer_date']) . "' ,type = '".$attr['type']."' ,user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";


            //	$doc_id = $this->Conn->Insert_ID();$new='insert';
            $new = 'Add';
            $new_msg = 'Insert';
            // }
        } else {


            $Sql = "UPDATE warehouse_volume_discount_listing
                    SET offered_by = '$attr[offered_by]',offered_by_id = '$attr[offered_by_id]',product_id = '$attr[product_id]',product_code = '$attr[product_code]',product_description = '$attr[product_description]',offer_method_id = '$attr[offer_method_id]', offer_valid_date = '" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "',offer_date = '" . $this->objGeneral->convert_date($attr['offer_date']) . "'  where id='".$attr['id']."'";
        }
        $RS = $this->objsetup->CSI($Sql);
        //echo $Sql;  exit;

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
        }

        return $response;
    }

    function get_price_offer_volumes($attr)
    {

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";


        $response = array();

        $Sql = "SELECT srm_volume_discount.id, srm_volume_discount.name, srm_volume_discount_volume.code , srm_volume_discount_volume.status  FROM warehouse_volume_discount 
			left  JOIN company on company.id=srm_volume_discount.company_id 
			where srm_volume_discount.status=1 and ( srm_volume_discount.company_id=" . $this->arrUser['company_id'] . " 
			or  company.parent_id=" . $this->arrUser['company_id'] . ")
			order by srm_volume_discount.id ASC";


        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];

                $result['code'] = $Row['document_code'];
                $result['name'] = $Row['title'];
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

    function update_product_value($arr_attr)
    {

        $product_id = $arr_attr->product_id;
        $current_date = $this->objGeneral->convert_date(date('Y-m-d'));
        $tab_change = 'tab_supplier';
        $sp_id = $arr_attr->sp_id;
        if ($sp_id == 0) {


            $Sql1 = "INSERT INTO warehouse_volume_discount SET  
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

            $Sql2 = "INSERT INTO warehouse_volume_discount SET  
											 volume_id='" . $arr_attr->volume_2s . "' 
											  ,volume_2=2    ,product_code = '" . $arr_attr->product_code . "'  
											,supplier_type='" . $arr_attr->supplier_type_2s . "'  
											 ,purchase_price='" . $arr_attr->purchase_price_2 . "' 
											,discount_value='" . $arr_attr->discount_value_2 . "'  
											 ,discount_price='" . $arr_attr->discount_price_2 . "' 
									 		,price_list_id='" . $arr_attr->price_list_id . "' 
									 		,start_date=  '" . $this->objGeneral->convert_date($arr_attr->start_date) . "'
											,end_date=   '" . $this->objGeneral->convert_date($arr_attr->end_date) . "'
											,crm_id='" . $product_id . "' 	,status='1'  
											,company_id='" . $this->arrUser['company_id'] . "' 
											,user_id='" . $this->arrUser['id'] . "'
											,date_added='" . current_date . "'";
            if ($arr_attr->volume_2s != NULL)
                $RS = $this->objsetup->CSI($Sql2);

            $Sql3 = "INSERT INTO warehouse_volume_discount SET  
											 volume_id='" . $arr_attr->volume_3s . "'  
											 ,volume_3=3  ,product_code = '" . $arr_attr->product_code . "'  
											,supplier_type='" . $arr_attr->supplier_type_3s . "'  
											 ,purchase_price='" . $arr_attr->purchase_price_3 . "' 
											,discount_value='" . $arr_attr->discount_value_3 . "'  
											 ,discount_price='" . $arr_attr->discount_price_3 . "' 
											,price_list_id='" . $arr_attr->price_list_id . "' 
											,start_date=  '" . $this->objGeneral->convert_date($arr_attr->start_date) . "'
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


            $Sql1 = "UPDATE warehouse_volume_discount SET  
							purchase_price='" . $arr_attr->purchase_price_11 . "'  
							,discount_value='" . $arr_attr->discount_value_11 . "'
							,discount_price='" . $arr_attr->discount_price_11 . "'  
							WHERE id = " . $sp_id . "   Limit 1";


            $RS = $this->objsetup->CSI($Sql1);
        }

        if ($product_id > 0) {
            $response['product_id'] = $product_id;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['msg'] = $new_msg;
            $response['info'] = $new;
            $response['tab_change'] = $tab_change;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated!';
            $response['msg'] = $new_msg;
        }

        return $response;
    }

    function get_method($attr)
    {

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";


        $response = array();

        $Sql = "SELECT   c.id, c.name FROM  get_method  c 
		left JOIN company on company.id=c.company_id 
		where c.status=1 and   c.type=1   
		and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
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
        if ($attr->id > 0)
            $update_check = "  AND tst.id <> " . $id . " ";

        $data_pass = "   tst.name='" . $attr->name . "'  and tst.type=1 and tst.status=1    $update_check";
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

        $Sql = "SELECT c.id, c.name
                FROM  get_method  c  
                where c.status=1 and 
                      c.type=2 and 
                      c.company_id=" . $this->arrUser['company_id'] . "		 
                group by  c.name  ";

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

    function add_shipping($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        //print_r($arr_attr);exit;
        // $id = $arr_attr['id'];
        $id = $attr->id;

        $update_check = "";
        if ($attr->id > 0)
            $update_check = "  AND tst.id <> " . $id . " ";

        $data_pass = "   tst.name='" . $attr->name . "'  and tst.type=1 and tst.status=1    ".$update_check;
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
            // }
        } else {
            $Sql = "UPDATE get_method SET  
									 name='" . $attr->name . "' 
									WHERE id = " . $id . "   Limit 1";
            $RS = $this->objsetup->CSI($Sql);
        }

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
          $where = array(0=>array('document.module_id'=>19),1=>array('document.row_id'=>$attr[crm_id]),2=>array('document.type'=>2));
          return $objFilters->get_module_listing(12, "document",'','',$attr[more_fields],'',$where);
         */

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";


        $response = array();

        $Sql = "SELECT srm_agent_area_list.id,  srm_agent_area_list.coverage_area  
                FROM warehouse_agent_area_list 
                where srm_agent_area_list.status=1 and
                      srm_agent_area_list.crm_id='".$attr['id']."' and 
                      srm_agent_area_list.company_id=" . $this->arrUser['company_id'] . "
                order by srm_agent_area_list.id ASC";


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

    function add_warehouse_shipping($arr_attr)
    {


        $doc_id = $arr_attr['update_id'];

        if ($doc_id == 0) {

            $Sql = "INSERT INTO warehouse_agent_area SET  
									 coverage_area='" . $arr_attr['coverage_area'] . "'
									,coverage_area_id='" . $arr_attr['coverage_area_id'] . "'
									,crm_id='" . $arr_attr['crm_id'] . "'
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
                    $sql = "SELECT  count(id)  as total FROM warehouse_agent_area_list	
												WHERE cover_area_id='" . $area_id . "'   and  crm_id='" . $arr_attr['crm_id'] . "'
												and company_id='" . $this->arrUser['company_id'] . "' ";
                    $rs_count = $this->objsetup->CSI($sql);
                    $total = $rs_count->fields['total'];
                    if ($total == 0) {
                        $Sql = "INSERT INTO warehouse_agent_area_list SET  
														cover_area_id='" . $area_id . "'
														,coverage_area='" . $area_name[$i] . "'    
														,sale_id='" . $sale_id . "' 
														,crm_id='" . $arr_attr['crm_id'] . "' 
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
            {
                //  $Sql = "DELETE FROM shipping_agent WHERE id = $sp_id";
                //	$RS = $this->objsetup->CSI($Sql);
                //	$Sql = "DELETE FROM shipping_agent_sale WHERE sale_id = $sp_id";
                //	$RS = $this->objsetup->CSI($Sql);

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
        //$counter_supplier++;
        $tab_change = 'tab_doc';
        $sale_customer_id = $arr_attr['update_id'];

        if ($sale_customer_id > 0) {
            $Sql = "DELETE FROM shipping_agent WHERE sale_id = ".$sale_customer_id;
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

        print_r($arr_attr);
        exit;
        $tab_change = 'tab_doc';
        $doc_id = $arr_attr['update_id'];

        if ($doc_id > 0) {
            //  $Sql = "DELETE FROM shipping_agent WHERE id = $sp_id";
            //	$RS = $this->objsetup->CSI($Sql);
            //	$Sql = "DELETE FROM shipping_agent_sale WHERE sale_id = $sp_id";
            //	$RS = $this->objsetup->CSI($Sql);

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
									,crm_id='" . $arr_attr['crm_id'] . "'
									,status='1'  
									,company_id='" . $this->arrUser['company_id'] . "' 
									,user_id='" . $this->arrUser['id'] . "'
									,date_added='" . current_date . "'";
            $new = 'Add';
            $new_msg = 'Insert';
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
        //$response = array();

        $Sql = "SELECT  c.id, c.coverage_price, c.coverage_area, c.cover_area_id
		        FROM warehouse_agent_area_list c  
                where sale_id ='".$attr['id']."' and status=1 ";

        $RS = $this->objsetup->CSI($Sql);
        $selected = array();

        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {
                $selected[] = $Row['id'];

                $result['cover_area_id'] = $Row['cover_area_id'];
                $result['name'] = $Row['coverage_area'];
                //$result['price'] = $Row['coverage_price'];
                $response2['response_selected'][] = $result;
            }
        }

        //print_r($response2['response_selected']);exit;

        $limit_clause = $where_clause = "";


        $Sql = "SELECT  c.id, c.name, c.price
                FROM coverage_areas  c
                where c.status=1 and 
                      c.company_id=" . $this->arrUser['company_id'] . " 
                order by c.id ASC";


        $RS = $this->objsetup->CSI($Sql);


        $selected_count = 0;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
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
        } else {
            $response['response'][] = array();
        }
        $response['selected_count'] = $selected_count;


        return $response;
    }

    function get_slected_areas($attr)
    {
        //$response = array();

        $Sql = "SELECT  c.id, c.coverage_area
		   FROM warehouse_agent_area_list c  where crm_id ='".$attr['id']."' and status=1 ";
        $RS = $this->objsetup->CSI($Sql);

        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['coverage_area'];
                $response['response'][] = $result;
            }
        }

        return $response;
    }

    function get_area($attr)
    {
        /* 	global $objFilters;
          $where = array(0=>array('document.module_id'=>19),1=>array('document.row_id'=>$attr[crm_id]),2=>array('document.type'=>2));
          return $objFilters->get_module_listing(12, "document",'','',$attr[more_fields],'',$where);
         */

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";


        $response = array();


        $Sql = "SELECT srm_area_selected.id,srm_area_selected.offered_by , srm_area_selected.valid_from, srm_area_selected.valid_to, srm_area_selected.price, srm_area_selected.shipping_method , srm_area_selected.shipping_quantity  ,get_method.name  as  shipping_methods
		FROM warehouse_area_selected 
		left  JOIN company on company.id=srm_area_selected.company_id 
		left  JOIN get_method on get_method.id=srm_area_selected.shipping_method 
		where srm_area_selected.status=1 and 
		srm_area_selected.crm_id='".$attr['id']."' and ( srm_area_selected.company_id=" . $this->arrUser['company_id'] . " 
		or  company.parent_id=" . $this->arrUser['company_id'] . ")
		order by srm_area_selected.id ASC";


        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['received_by'] = $Row['offered_by'];
                $result['location_from'] = $Row['valid_from'];
                $result['location_to'] = $Row['valid_to'];
                $result['shipping_method'] = $Row['shipping_methods'];
                $result['shipping_quantity'] = $Row['shipping_quantity'];
                $result['price'] = $Row['price'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }

        return $response;
    }

    function add_warehouse_area($arr_attr)
    {

        // print_r($arr_attr); 	exit; 
        $up_id = $arr_attr['update_id'];

        $update_check = "";
        if ($arr_attr['id'] > 0)
            $update_check = "  AND tst.id <> " . $up_id . " ";

        $data_pass = "   tst.offered_by='" . $arr_attr['offered_by'] . "' and tst.shipping_quantity='" . $arr_attr['shipping_quantity'] . "'	and tst.price='" . $arr_attr['price'] . "'	and tst.crm_id='" . $arr_attr['crm_id'] . "'    ".$update_check;

        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_area_selected', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
        if ($up_id == 0) {

            $Sql = "INSERT INTO warehouse_area_selected SET
										offered_by='" . $arr_attr['offered_by'] . "'
										,offered_by_id='" . $arr_attr['offered_by_id'] . "'
										,shiping_coments='" . $arr_attr['shiping_coments'] . "'
										,valid_from='" . $arr_attr['valid_from'] . "'
										,valid_from_id='" . $arr_attr['valid_from'] . "'
										,valid_to='" . $arr_attr['valid_to'] . "'
										,valid_to_id='" . $arr_attr['valid_to_id'] . "' 
										,price_method='" . $arr_attr['price_method'] . "' 
										,shipping_method='" . $arr_attr['shipping_method'] . "' 
										,shipping_quantity='" . $arr_attr['shipping_quantity'] . "'
										,price='" . $arr_attr['price'] . "'
										,crm_id='" . $arr_attr['crm_id'] . "' 
										,company_id='" . $this->arrUser['company_id'] . "'
										 ,user_id='" . $this->arrUser['id'] . "'
										,date_added='" . current_date . "'";
            //  }
        } else {
            $Sql = "UPDATE  srm_area_selected SET  
									offered_by='" . $arr_attr['offered_by'] . "'
									,offered_by_id='" . $arr_attr['offered_by_id'] . "'
									,shiping_coments='" . $arr_attr['shiping_coments'] . "'
									,valid_from='" . $arr_attr['valid_from'] . "'
									,valid_from_id='" . $arr_attr['valid_from'] . "'
									,valid_to='" . $arr_attr['valid_to'] . "'
									,valid_to_id='" . $arr_attr['valid_to_id'] . "' 
									,price_method='" . $arr_attr['price_method'] . "' 
									,shipping_method='" . $arr_attr['shipping_method'] . "' 
									,shipping_quantity='" . $arr_attr['shipping_quantity'] . "'
									,price='" . $arr_attr['price'] . "'
									WHERE id = " . $up_id . "   Limit 1";
        }

        $RS = $this->objsetup->CSI($Sql);
        // echo $Sql;exit;


        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
        }

        return $response;
    }

//----------Rebate------------------------------------------
    function get_rebate_listings($attr)
    {
        /* global $objFilters;
          return $objFilters->get_module_listing(107, "srm_rebate",$attr[column],$attr[value]); */

        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = "";
        $where_clause = " AND crm_id = ".$attr['id']." AND rebt.company_id =" . $this->arrUser['company_id'];


        $response = array();

        $Sql = "SELECT rebt.*,srm.name as cust_name, vol1.name as rbt_volume_1, vol2.name as rbt_volume_2, vol3.name as rbt_volume_3, rev1.title as rbt_revenue_1, rev2.title as rbt_revenue_2, rev3.title as rbt_revenue_3
		FROM warehouse_rebate as rebt
		LEFT JOIN srm ON srm.id = rebt.crm_id
		LEFT JOIN srm_rebate_volume as vol1 ON rebt.volume_1 = vol1.id
		LEFT JOIN srm_rebate_volume as vol2 ON rebt.volume_2 = vol2.id
		LEFT JOIN srm_rebate_volume as vol3 ON rebt.volume_3 = vol3.id
		
		LEFT JOIN site_constants as rev1 ON rebt.revenue_1 = rev1.id AND rev1.type ='TURNOVER'
		LEFT JOIN site_constants as rev2 ON rebt.revenue_2 = rev2.id AND rev2.type='TURNOVER'
		LEFT JOIN site_constants as rev3 ON rebt.revenue_3 = rev3.id AND rev3.type='TURNOVER'
		WHERE rebt.type <> 0
		" . $where_clause . "
		ORDER BY id ASC";


        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                $result = array();
                if ($Row['type'] == 3) {
                    $items = array();
                    $SqlItem = "SELECT prd.description 
								FROM warehouse_rebate_items as rbt
								JOIN products as prd ON rbt.product_id = prd.id
								WHERE rbt.rebate_id = ".$Row['id'];
                    //echo $SqlItem; 
                    $RS1 = $this->objsetup->CSI($SqlItem);
                    while ($Row1 = $RS1->FetchRow()) {
                        $rsitem = array();
                        $rsitem['item_description'] = $Row1['description'];
                        $items[] = $rsitem;
                    }
                    $result['offer_to'] = $items;
                } else if ($Row['type'] == 2) {
                    $cats = array();

                    $SqlCat = "SELECT cat.name, cat.description 
								FROM warehouse_rebate_categories as rbt
								JOIN catagory as cat ON rbt.category_id = cat.id
								WHERE rbt.rebate_id = ".$Row['id'];

                    $RS2 = $this->objsetup->CSI($SqlCat);
                    while ($Row2 = $RS2->FetchRow()) {
                        $rscat = array();
                        $rscat['cat_name'] = $Row2['name'];
                        $rscat['cat_description'] = $Row2['description'];
                        $cats[] = $rscat;
                    }
                    $result['offer_to'] = $cats;
                } else {
                    $result['offer_to'] = $Row['cust_name'];
                }

                $result['id'] = $Row['id'];
                $result['price_offered'] = $Row['price_offered'];
                $result['created_date'] = $this->objGeneral->convert_unix_into_date($Row['created_date']);
                $result['offer_date'] = $this->objGeneral->convert_unix_into_date($Row['offer_date']);
                $result['offer_valid_date'] = $this->objGeneral->convert_unix_into_date($Row['offer_valid_date']);
                $result['volume_1'] = $Row['volume_1'];
                $result['volume_2'] = $Row['volume_2'];
                $result['volume_3'] = $Row['volume_3'];
                $result['rbt_volume_1'] = $Row['rbt_volume_1'];
                $result['rbt_volume_2'] = $Row['rbt_volume_2'];
                $result['rbt_volume_3'] = $Row['rbt_volume_3'];
                $result['volume_rebate_1'] = $Row['volume_rebate_1'];
                $result['volume_rebate_2'] = $Row['volume_rebate_2'];
                $result['volume_rebate_3'] = $Row['volume_rebate_3'];
                $result['revenue_1'] = $Row['revenue_1'];
                $result['revenue_2'] = $Row['revenue_2'];
                $result['revenue_3'] = $Row['revenue_3'];
                $result['rbt_revenue_1'] = $Row['rbt_revenue_1'];
                $result['rbt_revenue_2'] = $Row['rbt_revenue_2'];
                $result['rbt_revenue_3'] = $Row['rbt_revenue_3'];
                $result['revenue_rebate_1'] = $Row['revenue_rebate_1'];
                $result['revenue_rebate_2'] = $Row['revenue_rebate_2'];
                $result['revenue_rebate_3'] = $Row['revenue_rebate_3'];
                $result['type'] = $Row['type'];
                $result['universal_type'] = $Row['universal_type'];

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

    function add_warehouse_rebate($attr)
    {
        $id = $attr['update_id'];

        $update_check = "";
        if ($id > 0)
            $update_check = "  AND tst.id <> " . $id . " ";

        $data_pass = "   tst.price_offered='" . $attr['price_offered'] . "' and tst.universal_type='" . $attr['universal_type'] . "'
		                 and tst.offer_date='" . $this->objGeneral->convert_date($attr['offer_date']) . "'
		                 and tst.offer_date='" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "'
		                 and tst.crm_id='" . $attr['crm_id'] . "'    $update_check";
        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_rebate', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($id == 0) {

            $Sql = "INSERT INTO warehouse_rebate
SET crm_id = '$attr[crm_id]',type = '".$attr['type']."',item_type = '$attr[item_type]',category_type = '$attr[category_type]',universal_type = '$attr[universal_type]',price_offered = '$attr[price_offered]',volume_1 = '$attr[volume_1]',volume_2 = '$attr[volume_2]',volume_3 = '$attr[volume_3]',volume_rebate_1 = '$attr[volume_rebate_1]',volume_rebate_2 = '$attr[volume_rebate_2]',volume_rebate_3 = '$attr[volume_rebate_3]',revenue_1 = '$attr[revenue_1]',revenue_2 = '$attr[revenue_2]',revenue_3 = '$attr[revenue_3]',revenue_rebate_1 = '$attr[revenue_rebate_1]',revenue_rebate_2 = '$attr[revenue_rebate_2]',revenue_rebate_3 = '$attr[revenue_rebate_3]',created_date = '" . $this->objGeneral->convert_date(NOW()) . "',offer_valid_date = '" . $this->objGeneral->convert_date($attr[offer_valid_date]) . "'
,offer_date = '" . $this->objGeneral->convert_date($attr[offer_date]) . "',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
            if ($attr['type'] == 3)
                self::add_rebate_items($id, $attr['items'], 0);
            if ($attr['type'] == 2)
                self::add_rebate_categories($id, $attr['categories'], 0);
            // }
        } else {
            $Sql = "UPDATE warehouse_rebate
SET type = '".$attr['type']."',universal_type = '$attr[universal_type]',price_offered = '$attr[price_offered]',volume_1 = '$attr[volume_1]',volume_2 = '$attr[volume_2]',volume_3 = '$attr[volume_3]',volume_rebate_1 = '$attr[volume_rebate_1]',volume_rebate_2 = '$attr[volume_rebate_2]',volume_rebate_3 = '$attr[volume_rebate_3]',revenue_1 = '$attr[revenue_1]',revenue_2 = '$attr[revenue_2]',revenue_3 = '$attr[revenue_3]',revenue_rebate_1 = '$attr[revenue_rebate_1]',revenue_rebate_2 = '$attr[revenue_rebate_2]',revenue_rebate_3 = '$attr[revenue_rebate_3]',offer_date = '" . $this->objGeneral->convert_date($attr[offer_date]) . "',offer_valid_date = '" . $this->objGeneral->convert_date($attr[offer_valid_date]) . "' WHERE id = " . $id . "   Limit 1";
            $RS = $this->objsetup->CSI($Sql);

            if ($attr['type'] == 3 || $attr['universal_type'] == 2 || $attr['universal_type'] == 3)
                self::add_rebate_items($attr['id'], $attr['items'], 1);
            if ($attr['type'] == 2)
                self::add_rebate_categories($attr['id'], $attr['categories'], 1);
        }
        // echo $Sql;exit;
        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['edit'] = 0;
            /* 	if($attr['type'] == 3 || $attr['universal_type'] == 2 || $attr['universal_type'] == 3)
              self::add_warehouse_rebate_items($id,$attr['items'],0);
              if($attr['type'] == 2)
              self::add_warehouse_rebate_categories($id,$attr['categories'],0); */
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
            $response['edit'] = 0;
        }
        return $response;
    }

    function get_rebate_items($attr)
    {

        $Sql = "SELECT product_id
				FROM warehouse_rebate_items
				WHERE rebate_id =" . $attr['rebate_id'];
        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['product_id'] = $Row['product_id'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_rebate_categories($attr)
    {

        $Sql = "SELECT category_id
				FROM warehouse_rebate_categories
				WHERE rebate_id =" . $attr['rebate_id'];
        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['category_id'] = $Row['category_id'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_rebate_categories($id, $categories, $isEdit)
    {
        //	if($isEdit ==1 ){
        $Sql = "DELETE FROM warehouse_rebate_categories	WHERE rebate_id = " . $id;
        $RS = $this->objsetup->CSI($Sql);
        //}
        foreach ($categories as $cat) {
            if ($cat->chk) {
                $Sql = "INSERT INTO warehouse_rebate_categories
					SET rebate_id = " . $id . ",category_id = " . $cat->id;
                $RS = $this->objsetup->CSI($Sql);
            }
        }
    }

    function add_rebate_items($id, $items, $isEdit)
    {
        //if($isEdit ==1 ){
        $Sql = "DELETE FROM warehouse_rebate_items
					WHERE rebate_id = " . $id;
        $RS = $this->objsetup->CSI($Sql);
        //}
        foreach ($items as $item) {
            if ($item->chk) {
                $Sql = "INSERT INTO warehouse_rebate_items
					SET rebate_id = " . $id . ",product_id = " . $item->id;
                $RS = $this->objsetup->CSI($Sql);
            }
        }
    }

//----------Rebate Volume Module----------------------------
    function get_rebate_volumes($attr)
    {
        /* global $objFilters;
          return $objFilters->get_module_listing(106, "price_offer_volume"); */

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = "";
        $where_clause = "AND company_id =" . $this->arrUser['company_id'];


        $response = array();

        $Sql = "SELECT id, name, description
				FROM warehouse_rebate_volume
				WHERE 1
				" . $where_clause . "
				ORDER BY id ASC";


        $RS = $this->objsetup->CSI($Sql);


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
            //$response['total'] = $total;
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
				FROM warehouse_rebate_volume
				WHERE type='".$attr['type']."' AND company_id =" . $this->arrUser['company_id'];

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

        // print_r($attr); 	exit;
        $id = $arr_attr['update_id'];

        $update_check = "";
        if ($id > 0)
            $update_check = "  AND tst.id <> " . $id . " ";

        $data_pass = "   tst.name='" . $arr_attr['name'] . "' ".$update_check;
        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_rebate', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($id == 0) {

            $Sql = "INSERT INTO warehouse_rebate_volume SET
								SET name='".$arr_attr['name']."',
                                    description='".$arr_attr['description']."',
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "'";

            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
            // }
        } else {
            $Sql = "UPDATE warehouse_rebate_volume
							SET name='".$arr_attr['name']."',
                                description='".$arr_attr['description']."'
							WHERE id = " . $id . "   
                            Limit 1";
            $RS = $this->objsetup->CSI($Sql);
        }

        if ($id > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;
            $response['edit'] = 0;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
            $response['edit'] = 0;
        }

        return $response;
    }

    function get_purchase_stock($attr)
    {
        // $this->objGeneral->mysql_clean($attr);
        $response = array();
        $where_clause = "";

        if (!empty($attr['purchase_return_status']))
            $where_clause .= " AND wh_alloc.purchase_return_status = ".$attr['purchase_return_status'] ;
        else
            $where_clause .= " AND wh_alloc.purchase_return_status = 0 ";

        if (!empty($attr['type']))
            $where_clause .= " AND wh_alloc.type = ".$attr['type'];

        if($attr['type'] == 3){
            $Sql = 'SELECT sum(quantity) as total_qty,
                       sum(quantity) - IFNULL((SELECT sum(sa.quantity) 
                                               FROM warehouse_allocation sa
                                               WHERE sa.warehouse_id = ' . $attr['warehouse_id'] . ' AND 
                                                     ((sa.type = 2 AND sa.sale_return_status = 0) OR
                                                      (sa.type = 1 AND sa.raw_material_out = 1)) AND
                                                     sa.product_id = ' . $attr['product_id'] . ' AND 
                                                     wh_alloc.container_no = sa.container_no AND
                                                     sa.company_id=' . $this->arrUser['company_id'] . '
                                               ),0) as avail_qty,
                       IFNULL((SELECT sum(sa.quantity) 
                               FROM warehouse_allocation sa
                               WHERE sa.warehouse_id = ' . $attr['warehouse_id'] . ' AND 
                                     sa.type = 2 AND 
                                     sa.sale_return_status = 0 AND
                                     sa.product_id = ' . $attr['product_id'] . ' AND 
                                     wh_alloc.container_no = sa.container_no AND
                                     sa.company_id=' . $this->arrUser['company_id'] . '
                                ),0)as allocated_qty,
                       wh_alloc.*
                 FROM warehouse_allocation as wh_alloc
                 WHERE  wh_alloc.status = 1 and
                        wh_alloc.product_id = "' . $attr['product_id'] . '" and
                        wh_alloc.type = 3 and 
                        wh_alloc.ledger_type = 1 and 
                        wh_alloc.warehouse_id = "' . $attr['warehouse_id'] . '" AND
                        wh_alloc.order_id="' . $attr['order_id'] . '" AND 
                        wh_alloc.item_journal_detail_id="' . $attr['orderLineID'] . '" AND 
                        wh_alloc.company_id=' . $this->arrUser['company_id'] . '
                 group by wh_alloc.container_no';

            //echo $Sql;exit;

        }
        else{
            $Sql = 'SELECT sum(quantity) as total_qty,
                       sum(quantity) - IFNULL((SELECT sum(sa.quantity) 
                                               FROM warehouse_allocation sa
                                               WHERE sa.warehouse_id = ' . $attr['warehouse_id'] . ' AND 
                                                     ((sa.type = 2 AND sa.sale_return_status = 0) OR
                                                      (sa.type = 1 AND sa.raw_material_out = 1)) AND
                                                     sa.product_id = ' . $attr['product_id'] . ' AND 
                                                     wh_alloc.container_no = sa.container_no AND
                                                     sa.company_id=' . $this->arrUser['company_id'] . '
                                               ),0) as avail_qty,
                       IFNULL((SELECT sum(sa.quantity) 
                               FROM warehouse_allocation sa
                               WHERE sa.warehouse_id = ' . $attr['warehouse_id'] . ' AND 
                                     sa.type = 2 AND 
                                     sa.sale_return_status = 0 AND
                                     sa.product_id = ' . $attr['product_id'] . ' AND 
                                     wh_alloc.container_no = sa.container_no AND
                                     sa.company_id=' . $this->arrUser['company_id'] . '
                                ),0)as allocated_qty,
                       wh_alloc.*
                 FROM warehouse_allocation as wh_alloc
                 WHERE  wh_alloc.purchase_status in (2,3) and 
                        wh_alloc.status = 1 and
                        (wh_alloc.raw_material_out IS NULL OR wh_alloc.raw_material_out = 0)  AND
                        wh_alloc.product_id = "' . $attr['product_id'] . '" and 
                        wh_alloc.warehouse_id = "' . $attr['warehouse_id'] . '" AND
                        wh_alloc.order_id="' . $attr['order_id'] . '" and 
                        wh_alloc.company_id=' . $this->arrUser['company_id'] . '
                 group by wh_alloc.container_no';

            //echo $Sql;exit;
        }

        

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['container_no'] = $Row['container_no'];
                $result['batch_no'] = $Row['batch_no'];
                $result['prod_date'] = $this->objGeneral->convert_unix_into_date($Row['prod_date']);
                $result['date_received'] = $this->objGeneral->convert_unix_into_date($Row['date_received']);
                $result['use_by_date'] = $this->objGeneral->convert_unix_into_date($Row['use_by_date']);
                $result['total_qty'] = $Row['total_qty'];
                $result['allocated_qty'] = $Row['allocated_qty'];
                $result['avail_qty'] = $Row['avail_qty'];
                $result['bl_shipment_no'] = $Row['bl_shipment_no'];
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

    function add_order_stock_allocation($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $order_date = '"' . $attr[order_date] . '"';

        if (strpos($attr['order_date'], '/') == true) {
            $order_date = str_replace('/', '-', $attr['order_date']);
            $order_date = strtotime($order_date);
        }

        $sale_return_status = 0;

        if (isset($attr['sale_return_status']))
            $sale_return_status = $attr['sale_return_status'];

        if (!empty($attr['purchase_return_status']))
            $purchase_return_status = " , purchase_return_status = 1 ";
        else
            $purchase_return_status = " , purchase_return_status = 0 ";

        if (!empty($attr['purchase_status']))
            $purchase_status = " , purchase_status = 2 ";

        $id = $attr['id'];
        if (empty($id))
            $id = $attr['update_id'];

        $update_check = "";
        if ($id > 0)
            $update_check = "  AND tst.id <> " . $id . " ";

        $data_pass = " 	tst.type=".$attr['type']." and 
                        tst.status=1 and 
                        tst.order_id=".$attr['order_id']." and
                        tst.product_id=".$attr['item_id']."	and 
                        tst.warehouse_id=".$attr['warehouses_id']."    ".$update_check." ";

        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_allocation', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists .';
            return $response;
            exit;
        }
        $date_receivedUnConv = ""; 

        if($attr['date_received'] > 0){
            $date_receivedUnConv = "date_receivedUnConv = '" . $this->objGeneral->convertUnixDateIntoConvDate($attr['date_received']) . "',";            
        }
        $Sql = "INSERT INTO warehouse_allocation
                            SET
                                batch_no='".$attr['batch_no']."',
                                warehouse_id='".$attr['warehouse_id']."',
                                bl_shipment_no='".$attr['bl_shipment_no']."',
                                container_no='".$attr['container_no']."',
                                order_id='".$attr['order_id']."',
                                product_id='".$attr['product_id']."',
                                status=1,
                                quantity='".$attr['req_qty']."',
                                remaining_qty='".$attr['req_qty']."',
                                unit_measure='".$attr['unit_measure']."',
                                sale_return_status='" . $sale_return_status . "',
                                type='".$attr['type']."',
                                company_id='" . $this->arrUser['company_id'] . "' ,
                                user_id='" . $this->arrUser['id'] . "',
                                prod_date='" . $this->objGeneral->convert_date($attr['prod_date']) . "',
                                date_received='" . $this->objGeneral->convert_date($attr['date_received']) . "',
                                ".$date_receivedUnConv."                                                     
                                AddedBy='" . $this->arrUser['id'] . "',
                                AddedOn='" . current_date . "',       
                                use_by_date='" . $this->objGeneral->convert_date($attr['use_by_date']) . "',
                                order_date='" . $this->objGeneral->convert_date($attr['order_date']) . "'" . $purchase_return_status . $purchase_status;

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;
        } else {
            $response['id'] = 0;
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function get_order_stock_allocation($attr)
    {
        //$this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";

        $response = array();

        if($attr['orderLineID']>0){

            $Sql = 'SELECT sum(wa.quantity) as total_qty, wa.*
                    FROM warehouse_allocation wa
                    WHERE wa.product_id = ' . $attr['product_id'] . ' and 
                          wa.type = ' . $attr['type'] . ' and
                          wa.purchase_order_detail_id = ' . $attr['orderLineID'] . ' and
                          wa.order_id = ' . $attr['order_id'] . ' and
                          wa.company_id=' . $this->arrUser['company_id'] . '
                    group by wa.container_no';            

        }
        else{

            $Sql = 'SELECT sum(wa.quantity) as total_qty, wa.*
                    FROM warehouse_allocation wa
                    WHERE wa.product_id = ' . $attr['product_id'] . ' and 
                          wa.type = ' . $attr['type'] . ' and
                          wa.order_id = ' . $attr['order_id'] . ' and
                          wa.company_id=' . $this->arrUser['company_id'] . '
                    group by wa.container_no';
        }
        // echo $Sql;exit;       

        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['container_no'] = $Row['container_no'];
                $result['batch_no'] = $Row['batch_no'];
                $result['prod_date'] = $this->objGeneral->convert_unix_into_date($Row['prod_date']);
                $result['date_received'] = $this->objGeneral->convert_unix_into_date($Row['date_received']);
                $result['use_by_date'] = $this->objGeneral->convert_unix_into_date($Row['use_by_date']);
                $result['quantity'] = $Row['total_qty'];
                $result['order_id'] = $Row['order_id'];
                $result['warehouse_id'] = $Row['warehouse_id'];
                $result['product_id'] = $Row['product_id'];
                $result['purchase_status'] = $Row['purchase_status'];
                $result['sale_status'] = $Row['sale_status'];
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
        // exit;
        return $response;
    }

    function delete_sale_order_stock($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM warehouse_allocation WHERE id = ".$attr['id'];

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

    function dispatch_stock($attr)
    {

        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['Parameter2'] = 'order_id:' . $attr['order_id'];
        $srLogTrace['ErrorMessage'] = "";

        $this->objsetup->SRTraceLogsPHP($srLogTrace);

        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
        //echo "<pre>"; print_r($attr); exit;
        $Sql = "UPDATE warehouse_allocation	SET sale_status=2 WHERE order_id = ".$attr['order_id']." AND type = 2 and dispatch_date = '".current_date."'";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);


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
            $srLogTrace['Parameter2'] = 'order_id:' . $attr['order_id'];
            $srLogTrace['input_text'] = $Sql;

            $this->objsetup->SRTraceLogsPHP($srLogTrace);

        } else {
            //   $this->objsetup->terminateWithMessage("Journal can not be posted");
           $response['ack'] = 0;
           $response['error'] = 'Record not updated!';

           $srLogTrace = array();
            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = "Error Code: $srLogTrace[ErrorCode]  -- Message: 'Record not updated!'  -- Function: ". __FUNCTION__."  -- Query: $Sql ";

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }
        return $response;
    }


    function get_stock_allocation_get_same_record2($attr)
    {
        // $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";
        $response = array();

        $Sql = 'SELECT sum(quantity) as total_qty, wa.* FROM warehouse_allocation as wa
		LEFT JOIN company on company.id=wa.company_id
		WHERE wa.product_id = ' . $attr['item_id'] . ' and wa.order_id = ' . $attr['order_id'] . ' 
		and wa.ware_id = ' . $attr['ware_id'] . ' 
		ANd (wa.company_id=' . $this->arrUser['company_id'] . ' or  company.parent_id=1)
		Limit 1';

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['container_no'] = $Row['container_no'];
                $result['batch_no'] = $Row['batch_no'];
                $result['prod_date'] = $this->objGeneral->convert_unix_into_date($Row['prod_date']);
                $result['date_received'] = $this->objGeneral->convert_unix_into_date($Row['date_received']);
                $result['use_by_date'] = $this->objGeneral->convert_unix_into_date($Row['use_by_date']);
                $result['quantity'] = $Row['total_qty'];
                $result['order_id'] = $Row['order_id'];
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

    function get_predata($attr)
    {
        /* $Sql = "SELECT   c.id, c.name, c.wrh_code,wrh_loc.dimensions_id as uom_id 
                FROM  warehouse  c 
                left JOIN company on company.id=c.company_id
                left JOIN warehouse_bin_location as wrh_loc on wrh_loc.warehouse_id=c.id
                where  c.status=1 and 
                       (wrh_loc.dimensions_id IN (SELECT uom_setup.cat_id 
                                                  FROM units_of_measure_setup uom_setup 
                                                  WHERE uom_setup.product_id='".$attr['product_id']."') OR
                        wrh_loc.dimensions_id IN (SELECT product.unit_id
                                                  FROM product
                                                  WHERE product.id='".$attr['product_id']."')
                                                 )  AND
                       (c.company_id='" . $this->arrUser['company_id'] . "' or  
                        company.parent_id='" . $this->arrUser['company_id'] . "')
                group by  c.name ASC "; */

        $Sql = "SELECT   c.id, c.name, c.wrh_code,wrh_loc.dimensions_id as uom_id 
                FROM  warehouse  c 
                left JOIN warehouse_bin_location as wrh_loc on wrh_loc.warehouse_id=c.id
                where  c.status=1 and wrh_loc.status=1 and
                       wrh_loc.dimensions_id IN (SELECT uom_setup.cat_id 
                                                  FROM units_of_measure_setup uom_setup 
                                                  WHERE uom_setup.product_id='".$attr['product_id']."') AND
                       c.company_id='" . $this->arrUser['company_id'] . "'
                group by  c.name ";

        /*  wrh_loc.dimensions_id='".$attr['unit_id']."' and  */

        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['wrh_code'] . '-' . $Row['name'];
                $response['response'][] = $result;
            }

            $res = $this->get_warehouse_loc_additional_cost_title();
            //echo "<pre>"; print_r($res['response']);exit;

            $response['additionalCostTitle'] = $res['response'];
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else 
            $response['response'] = array();

        return $response;
    }

    function get_sale_stock_trail($attr)
    {
        // print_r($attr);exit;
        $this->objGeneral->mysql_clean($attr);
        $where_clause = "";
        $allocated_clause = "";
        $allocated_clause_journal = "";
        $where_clause_item_trace_item = "";
        // if(isset($attr['id']))
        //     $where_clause  .= " AND (wa.id = ". $attr['id']." OR wa.ref_po_id = ". $attr['id'].")";

        if(isset($attr['warehouse_id']))
            $where_clause  .= " AND wa.warehouse_id = ". $attr['warehouse_id']; // don't need warehouse id in case of credit note
        /*
        if(isset($attr['sale_status']))
            $where_clause  .= " AND wa.sale_status IN (". $attr['sale_status'].")";

        if(isset($attr['sale_return_status']) && $attr['sale_return_status'] == "1")
            $where_clause  .= " AND wa.ref_po_id =". $attr['id'];
        */
        if(isset($attr['item_trace_unique_id']) && $attr['list_type']!= 'available_stock')
        {
            $where_clause  .= " AND wa.item_trace_unique_id = '". $attr['item_trace_unique_id']."'";
            $where_clause_item_trace_item  .= " AND wa.item_trace_unique_id = '". $attr['item_trace_unique_id']."'";
        }

        $stockChkCondition = '';
        $stockChkCondition2 = '';
        $stockChkConditionSalesCase = '';

        if(isset($attr['warehouse_id'])){

            $stockChkCondition   = " 
                                     SR_CheckAllocatedStockByWarehouse(wa.item_trace_unique_id, 0,'".$attr['warehouse_id']."', wa.company_id) AS allocated_qty, ";
        
            $stockChkCondition2   = " SR_CheckRemaningStockByWarehouse(wa.item_trace_unique_id, wa.quantity,'".$attr['warehouse_id']."', wa.company_id) AS remaining_qty,
                                     SR_CheckAllocatedStockByWarehouse(wa.item_trace_unique_id, 0,'".$attr['warehouse_id']."', wa.company_id) AS allocated_qty, ";

            $stockChkConditionSalesCase = " SR_CheckRemaningStockByWarehouse(wa.item_trace_unique_id, wa.quantity,'".$attr['warehouse_id']."', wa.company_id) AS remaining_qty,SR_CheckAllocatedStockByWarehouse(wa.item_trace_unique_id, wa.sale_order_detail_id,'".$attr['warehouse_id']."', wa.company_id) AS allocated_qty, ";
        }
        else{
            
            $stockChkCondition   = " 
                                     SR_CheckAllocatedStock(wa.item_trace_unique_id, 0, wa.company_id) AS allocated_qty, ";

            $stockChkCondition2   = " SR_CheckRemaningStock(wa.item_trace_unique_id, wa.quantity, wa.company_id) AS remaining_qty,
                                     SR_CheckAllocatedStock(wa.item_trace_unique_id, 0, wa.company_id) AS allocated_qty, ";
            
            $stockChkConditionSalesCase = " SR_CheckRemaningStock(wa.item_trace_unique_id, wa.quantity, wa.company_id) AS remaining_qty,
                                            SR_CheckAllocatedStock(wa.item_trace_unique_id, wa.sale_order_detail_id, wa.company_id) AS allocated_qty, ";
        }

        
        $response = array();
        $having_clause = "";
        $having_clause_allocation = "";
        $allocated_clause_DN = "";

        $postedNotAlloc = " si.type = 2 AND ";
        
        if(isset($attr['list_type']))
        {
            if($attr['list_type']== 'current_stock')
            {
                $having_clause = " HAVING remaining_qty > 0 ";
                $having_clause_allocation = " OR allocated_qty > 0 ";
                $allocated_clause = " AND wa.sale_status = 1 ";
                $allocated_clause_journal = " AND wa.journal_status = 1 ";
            }
            else if($attr['list_type']== 'available_stock')
            {
                $having_clause = " HAVING remaining_qty > 0 ";
                
                if($attr['entries_type'] == 'si_dn_nij'){ 
                    // sales invoice, debit note, negative item journal
                    $having_clause = " ";
                    $allocated_clause = " AND wa.sale_status = 3 ";
                    $allocated_clause_journal = " AND wa.journal_status = 2 ";
                }
            }
            else if($attr['list_type']== 'allocated_stock')
            {
                // $having_clause_allocation = " HAVING allocated_qty > 0 ";
                $allocated_clause = " AND wa.sale_status = 1 ";
                $allocated_clause_journal = " AND wa.journal_status = 1 ";
                $allocated_clause_DN = " AND wa.purchase_status = 1 ";
                $postedNotAlloc = "";
            }
        }

        $SO_Sql = "SELECT o.sale_order_code AS code, 
                    o.sale_invioce_code AS invoice_code,
                    o.sell_to_cust_no as user_no,
                    o.sell_to_cust_name AS user_name,
                    'sales' AS doctype, 
                    o.type as order_type,
                    '1' AS trailtype,
                    o.dispatch_date as o_dispatch_date,
                    NULL AS receipt_date,
                    wbl.`title` AS location_name,
                    wa.id AS rec_id,
                    IFNULL((wa.quantity * wa.unit_measure_qty),0) as qty2,
                    ".$stockChkConditionSalesCase."
                    wa.* 
                    FROM warehouse_allocation wa
                    LEFT JOIN orders o ON o.id = wa.order_id  
                    LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                    LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id          
                    WHERE wa.product_id = '" . $attr['prod_id'] . "' AND 
                          wa.type = 2 AND 
                          wa.sale_return_status = 0 AND
                          wa.company_id='" . $this->arrUser['company_id'] . "'
                          ".$where_clause.$allocated_clause.$having_clause.$having_clause_allocation." ";

        //SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,wa.order_id,2,wa.company_id) AS remaining_qty,  
        $CN_Sql ="SELECT cn.return_order_code AS code, 
                    cn.return_invoice_code AS invoice_code,
                    cn.sell_to_cust_no as user_no,
                    cn.sell_to_cust_name AS user_name,
                    'creditnote' AS doctype, 
                    cn.type as order_type,
                    '2' AS trailtype,
                    NULL AS o_dispatch_date,
                    cn.delivery_date as receipt_date,
                    wbl.`title` AS location_name,
                    wa.id AS rec_id, 
                    IFNULL((wa.quantity * wa.unit_measure_qty),0) as qty2,                    
                    ".$stockChkCondition2."
                    wa.* 
                    FROM warehouse_allocation wa
                    LEFT JOIN return_orders cn ON cn.id = wa.order_id  
                    LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                    LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id          
                    WHERE wa.product_id = '" . $attr['prod_id'] . "' AND 
                          wa.type = 2 AND 
                          cn.type = 2 AND
                          wa.sale_return_status = 1 AND
                          wa.company_id='" . $this->arrUser['company_id'] . "'
                          ".$where_clause."   AND wa.sale_status = 3  
                    ".$having_clause.$having_clause_allocation." ";

        //SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,wa.order_id,1,wa.company_id) AS remaining_qty,
        $PO_Sql = "SELECT 
                    si.order_code AS code,
                    si.invoice_code AS invoice_code,
                    si.sell_to_cust_no as user_no,
                    si.sell_to_cust_name AS user_name,
                    'purchase' AS doctype,
                    si.type as order_type,
                    '3' AS trailtype,
                    NULL AS o_dispatch_date,
                    si.receiptDate as receipt_date,
                    wbl.title AS location_name,
                    wa.id AS rec_id, 
                    IFNULL((wa.quantity * wa.unit_measure_qty),0) as qty2,                    
                    ".$stockChkCondition2."
                    wa.* 
                    FROM warehouse_allocation wa
                    LEFT JOIN srm_invoice si ON si.id=wa.order_id 
                    LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                    LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id                
                    WHERE wa.product_id = '". $attr['prod_id'] ."' AND 
                          wa.type = 1 AND 
                          wa.purchase_status IN (2,3) AND 
                          (wa.raw_material_out IS NULL OR wa.raw_material_out = 0) AND 
                          wa.purchase_return_status = 0 AND
                          wa.company_id='" . $this->arrUser['company_id'] . "'
                          ".$where_clause.$having_clause." ";
                       
        $DN_Sql = "SELECT 
                    si.debitNoteCode AS code,
                    si.invoice_code AS invoice_code,
                    si.supplierNo as user_no,
                    si.supplierName AS user_name,
                    'debitnote' AS doctype,
                    si.type as order_type,
                    '4' AS trailtype,
                    NULL AS o_dispatch_date,
                    si.supplierReceiptDate as receipt_date,
                    wbl.title AS location_name,
                    wa.id AS rec_id, 
                    IFNULL((wa.quantity * wa.unit_measure_qty),0) as qty2,
                    ".$stockChkCondition2."
                    wa.* 
                    FROM warehouse_allocation wa
                    LEFT JOIN srm_order_return si ON si.id=wa.order_id 
                    LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                    LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id                
                    WHERE wa.product_id = '". $attr['prod_id'] ."' AND 
                          wa.type = 1 AND 
                          wa.purchase_return_status = 1 AND
                          wa.company_id='" . $this->arrUser['company_id'] . "'
                          ".$where_clause.$allocated_clause_DN.$having_clause.$having_clause_allocation." ";

        //SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,wa.order_id,3,wa.company_id) AS remaining_qty,
        $OB_Sql = "SELECT 
                    si.comm_book_in_no AS code,
                    '-' AS invoice_code,
                    '-' as user_no,
                    '-' AS user_name,
                    'opening_balance' AS doctype,
                    '5' as order_type,
                    '5' AS trailtype,
                    NULL AS o_dispatch_date,
                    si.date_received as receipt_date,
                    wbl.title AS location_name,
                    wa.id AS rec_id, 
                    IFNULL((wa.quantity),0) as qty2,                    
                    ".$stockChkCondition2."
                    wa.* 
                    FROM warehouse_allocation wa
                    LEFT JOIN opening_balance_stock si ON si.id=wa.opBalncID 
                    LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                    LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id                
                    WHERE wa.product_id = '". $attr['prod_id'] ."' AND 
                          wa.type = 4  AND
                          wa.company_id='" . $this->arrUser['company_id'] . "'  
                          ".$where_clause.$having_clause." ";

        // Item Ledger Positive
        //SR_STOCK_RAW_MATERIAL_FIFO(wa.product_id,wa.order_id,4,wa.company_id) AS remaining_qty,
        $itemLedgerPosSql =  "SELECT  '-' AS code,
                                        si.acc_code AS invoice_code,
                                        '-' as user_no,
                                        '-' AS user_name,
                                        'itemLedger' AS doctype,
                                        si.type as order_type,
                                        '6' AS trailtype,
                                        NULL AS o_dispatch_date,
                                        '-' as receipt_date,
                                        wbl.title AS location_name,
                                        wa.id AS rec_id, 
                                        IFNULL((wa.quantity * wa.unit_measure_qty),0) as qty2,                                        
                                        ".$stockChkCondition2."
                                        wa.* 
                                FROM warehouse_allocation wa
                                LEFT JOIN gl_journal_receipt si ON si.id=wa.order_id
                                LEFT JOIN item_journal_details ijd ON ijd.id=wa.item_journal_detail_id
                                LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                                LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id               
                                WHERE wa.product_id = '". $attr['prod_id'] ."' AND 
                                    wa.type = 3 AND
                                    wa.ledger_type = 1 AND
                                    si.type = 2 AND
                                    wa.status = 1 AND 
                                    wa.company_id='" . $this->arrUser['company_id'] . "'
                                    ".$where_clause.$where_clause_journal.$having_clause." ";
            
        // Item Ledger Negative
        $itemLedgerNegSql =  "SELECT  '-' AS code,
                                        si.acc_code AS invoice_code,
                                        '-' as user_no,
                                        '-' AS user_name,
                                        'itemLedger' AS doctype,
                                        si.type as order_type,
                                        '7' AS trailtype,
                                        NULL AS o_dispatch_date,
                                        '-' as receipt_date,
                                        wbl.title AS location_name,
                                        wa.id AS rec_id, 
                                        IFNULL((wa.quantity * wa.unit_measure_qty),0) as qty2,
                                        ".$stockChkCondition2."
                                        wa.* 
                                FROM warehouse_allocation wa
                                LEFT JOIN gl_journal_receipt si ON si.id=wa.order_id
                                LEFT JOIN item_journal_details ijd ON ijd.id=wa.item_journal_detail_id
                                LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                                LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id                
                                WHERE wa.product_id = '". $attr['prod_id'] ."' AND 
                                    wa.type = 3 AND
                                    wa.ledger_type = 2 AND
                                    wa.status = 1 AND 
                                    ".$postedNotAlloc."
                                    wa.company_id='" . $this->arrUser['company_id'] . "'
                                    ".$where_clause.$allocated_clause_journal.$having_clause.$having_clause_allocation." ";

        $TransferStockNegSql =  " UNION SELECT  '-' AS code,
                                        si.code AS invoice_code,
                                        '-' as user_no,
                                        '-' AS user_name,
                                        'transferStock' AS doctype,
                                        si.type as order_type,
                                        '8' AS trailtype,
                                        NULL AS o_dispatch_date,
                                        '-' as receipt_date,
                                        wbl.title AS location_name,
                                        wa.id AS rec_id, 
                                        IFNULL((wa.quantity * wa.unit_measure_qty),0) as qty2,
                                        ".$stockChkCondition2."
                                        wa.* 
                                FROM warehouse_allocation wa
                                LEFT JOIN transfer_orders si ON si.id=wa.order_id
                                LEFT JOIN transfer_orders_details ijd ON ijd.id=wa.item_journal_detail_id
                                LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                                LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id                
                                WHERE wa.product_id = '". $attr['prod_id'] ."' AND 
                                    wa.type = 5 AND
                                    wa.ledger_type = 2 AND
                                    si.type = 1 AND
                                    wa.status = 1 AND 
                                    wa.company_id='" . $this->arrUser['company_id'] . "'
                                    ".$where_clause.$allocated_clause_journal.$having_clause.$having_clause_allocation." ";

        $TransferStockPositiveSql =  " UNION SELECT  '-' AS code,
                                        si.code AS invoice_code,
                                        '-' as user_no,
                                        '-' AS user_name,
                                        'transferStock' AS doctype,
                                        si.type as order_type,
                                        '8' AS trailtype,
                                        NULL AS o_dispatch_date,
                                        '-' as receipt_date,
                                        wbl.title AS location_name,
                                        wa.id AS rec_id, 
                                        IFNULL((wa.quantity * wa.unit_measure_qty),0) as qty2,
                                        ".$stockChkCondition2."
                                        wa.* 
                                FROM warehouse_allocation wa
                                LEFT JOIN transfer_orders si ON si.id=wa.order_id
                                LEFT JOIN transfer_orders_details ijd ON ijd.id=wa.item_journal_detail_id
                                LEFT JOIN product_warehouse_location pw ON pw.id = wa.location   
                                LEFT JOIN warehouse_bin_location wbl ON wbl.id = pw.warehouse_loc_id                
                                WHERE wa.product_id = '". $attr['prod_id'] ."' AND 
                                    wa.type = 5 AND
                                    wa.ledger_type = 1 AND
                                    si.type = 1 AND
                                    wa.status = 1 AND 
                                    wa.company_id='" . $this->arrUser['company_id'] . "'
                                    ".$where_clause.$allocated_clause_journal.$having_clause.$having_clause_allocation." ";
        
        if(isset($attr['from_item']) && $attr['from_item'] == '1')
        {
            $TransferStockNegSql = "";
            $TransferStockPositiveSql = "";
        }

        $sub_sql = ""; 
        
        $sub_sql = "";
        /* if(isset($attr['type']))
        {
            if($attr['type'] == 1)
            {
                if(isset($attr['only_po']))
                    $sub_sql = $PO_Sql;
                else if(isset($attr['only_cn']))
                    $sub_sql = $CN_Sql;
                else if($attr['entry_type'] == "4") // only Opening balance entry
                    $sub_sql = $OB_Sql;
                else
                    $sub_sql = $PO_Sql." UNION ".$CN_Sql." UNION ".$OB_Sql;
            }
            else if($attr['type'] == 2)
            {
                if(isset($attr['only_so']))
                    $sub_sql = $SO_Sql;
                else
                    $sub_sql = $SO_Sql." UNION ".$DN_Sql;
            }
        }*/
        

        if(isset($attr['warehouse_id'])){

            // for warehouse Quantity, with warehouse check

            if(isset($attr['list_type']))
            {
                if($attr['list_type']== 'current_stock')
                {
                    $sub_sql = $PO_Sql." UNION ".$CN_Sql." UNION ".$SO_Sql." UNION ".$DN_Sql." UNION ".$OB_Sql." UNION ".$itemLedgerPosSql." UNION ".$itemLedgerNegSql." ".$TransferStockPositiveSql." ".$TransferStockNegSql;
                }
                else if($attr['list_type']== 'available_stock')
                {
                    if(isset($attr['entries_type']) && $attr['entries_type'] != '')
                    {
                        if($attr['entries_type'] == 'pi_ob_pij') // purchase invoice, opening balance, positive item journal
                            $sub_sql = $PO_Sql." UNION ".$OB_Sql." UNION ".$itemLedgerPosSql." ".$TransferStockPositiveSql;
                        else if($attr['entries_type'] == 'si_dn_nij') // sales invoice, debit note, negative item journal
                            $sub_sql = $SO_Sql." UNION ".$DN_Sql." UNION ".$itemLedgerNegSql." ".$TransferStockNegSql;
                        else if($attr['entries_type'] == 'cn') // sales invoice, debit note, negative item journal
                            $sub_sql = $CN_Sql;
                        
                    }
                    else
                        $sub_sql = $PO_Sql." UNION ".$CN_Sql." UNION ".$OB_Sql." UNION ".$itemLedgerPosSql." ".$TransferStockPositiveSql;

                    // $sub_sql = $PO_Sql." UNION ".$CN_Sql." UNION ".$SO_Sql." UNION ".$DN_Sql." UNION ".$OB_Sql." UNION ".$itemLedgerPosSql." UNION ".$itemLedgerNegSql." ".$TransferStockPositiveSql." ".$TransferStockNegSql;
                }
                else if($attr['list_type']== 'allocated_stock')
                {

                    $sub_sql = $SO_Sql." UNION ".$itemLedgerNegSql." ".$TransferStockNegSql;            
                }
            }
            else
            {
                $sub_sql = $PO_Sql." UNION ".$CN_Sql." UNION ".$SO_Sql." UNION ".$DN_Sql." UNION ".$OB_Sql." UNION ".$itemLedgerPosSql." UNION ".$itemLedgerNegSql."".$TransferStockPositiveSql." ".$TransferStockNegSql;            
            }
        }
        else{
            // Whole Quantity, without warehouse check
            if(isset($attr['list_type']))
            {
                if($attr['list_type']== 'current_stock')
                {
                    $sub_sql = $PO_Sql." UNION ".$OB_Sql." UNION ".$itemLedgerPosSql;//UNION ".$CN_Sql." 
                }
                else if($attr['list_type']== 'available_stock')
                {
                    if(isset($attr['entries_type']) && $attr['entries_type'] != '')
                    {
                        if($attr['entries_type'] == 'pi_ob_pij') // purchase invoice, opening balance, positive item journal
                            $sub_sql = $PO_Sql." UNION ".$OB_Sql." UNION ".$itemLedgerPosSql;
                        else if($attr['entries_type'] == 'si_dn_nij') // sales invoice, debit note, negative item journal
                            $sub_sql = $SO_Sql." UNION ".$DN_Sql." UNION ".$itemLedgerNegSql;
                        else if($attr['entries_type'] == 'cn') // sales invoice, debit note, negative item journal
                            $sub_sql = $CN_Sql;                        
                    }
                    else
                        $sub_sql = $PO_Sql." UNION ".$OB_Sql." UNION ".$itemLedgerPosSql;//UNION ".$CN_Sql." 
                }
                else if($attr['list_type']== 'allocated_stock')
                {
                    $sub_sql = $SO_Sql." UNION ".$itemLedgerNegSql." UNION ".$DN_Sql;            
                }
            }
            else
            {
                $sub_sql = $PO_Sql." UNION ".$CN_Sql." UNION ".$SO_Sql." UNION ".$DN_Sql." UNION ".$OB_Sql." UNION ".$itemLedgerPosSql." UNION ".$itemLedgerNegSql;            
            }
        }

        $Sql = $sub_sql." ORDER BY rec_id";                
                
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];

                $Row['Doc_type'] = $Row['doctype'];  

                if($Row['doctype'] == 'sales'){
                    if($Row['order_type'] == '1')
                        $result['doctype'] = 'Sales Order';                
                    else
                        $result['doctype'] = 'Sales Invoice';                

                }
                else if($Row['doctype'] == 'purchase'){
                   if($Row['order_type'] == '3')
                        $result['doctype'] = 'Purchase Order';                
                    else
                        $result['doctype'] = 'Purchase Invoice';                
                }
                else if($Row['doctype'] == 'debitnote'){
                    if($Row['order_type'] == '1')
                        $result['doctype'] = 'Debit Note';                
                    else
                        $result['doctype'] = 'Debit Note Invoice';                
                }
                else if($Row['doctype'] == 'creditnote'){
                    if($Row['order_type'] == '1')
                        $result['doctype'] = 'Credit Note';                
                    else
                        $result['doctype'] = 'Credit Note Invoice';                
                }
                else if($Row['doctype'] == 'opening_balance'){
                    $result['doctype'] = 'Opening Balance';                
                }
                else if($Row['doctype'] == 'itemLedger'){
                    if($Row['trailtype'] == '6')
                        $result['doctype'] = 'Item Ledger In';                
                    else
                        $result['doctype'] = 'Item Ledger Out';  

                    $consignmentNo  = $Row['consignmentNo'];              
                }
                else if($Row['doctype'] == 'transferStock'){
                    $result['doctype'] = 'Transfer Stock';                
                }


                $result['code']             = $Row['code'];
                $result['invoice_code']     = ($Row['invoice_code'] != '0') ? $Row['invoice_code']: '';
                $result['user_name']        = $Row['user_name'];
                $result['user_no']          = $Row['user_no'];     
                $result['location_name']    = $Row['location_name'];     
                $result['uom']              = $Row['unit_measure_name'];    
                $result['type']             = $Row['type'];    
                $result['order_type']       = $Row['order_type'];    
                $result['trailtype']        = $Row['trailtype']; 

                
                $result['remaining_qty']    = intval($Row['remaining_qty']); 
                $result['allocated_qty']    = intval($Row['allocated_qty']); 
                $result['quantity']         = intval($Row['qty2']); 
                $result['sold_qty']         = intval($Row['qty2']) - intval($Row['remaining_qty']);


                if(isset($attr['list_type']))
                {
                    if($attr['list_type']== 'current_stock')
                    {
                        if($Row['type'] == 2)
                        {
                            $result['sold_qty'] = '';
                            $result['remaining_qty'] = '';
                        }
                        else if($Row['type'] == 1 && $Row['purchase_return_status'] == 1)
                        {
                            $result['sold_qty'] = '';
                            $result['remaining_qty'] = '';
                            $result['allocated_qty'] = '';
                        }
                        else if($Row['type'] == 5)
                        {
                            $result['sold_qty'] = $result['quantity'];
                            $result['remaining_qty'] = '';
                            $result['allocated_qty'] = '';
                        }
                    }
                    else if($attr['list_type']== 'available_stock')
                    {
                        if($Row['type'] == 2)
                        {
                            $result['sold_qty'] = '';
                            $result['remaining_qty'] = '';
                            if($Row['sale_status'] > 1)
                                $result['allocated_qty'] = '';
                        }
                        else if($Row['type'] == 1 && $Row['purchase_return_status'] == 1)
                        {
                            $result['sold_qty'] = '';
                            $result['remaining_qty'] = '';
                            $result['allocated_qty'] = '';
                        }
                        else if($Row['type'] == 3)
                        {
                            if($Row['ledger_type'] == 2)
                            {
                                $result['sold_qty'] = '';
                                $result['remaining_qty'] = '';
                                if($Row['sale_status'] > 1)
                                    $result['allocated_qty'] = '';
                            }
                        }
                        else if($Row['type'] == 5)
                        {
                            $result['sold_qty'] = $result['quantity'];
                            $result['remaining_qty'] = '';
                            $result['allocated_qty'] = '';
                        }

                    }
                    else if($attr['list_type']== 'allocated_stock')
                    {
                        $result['sold_qty'] = '';
                        $result['remaining_qty'] = '';
                        $result['allocated_qty']    = intval($Row['qty2']);  
                    }
                }
                
                $result['available_qty'] = $result['quantity'] - $result['sold_qty'] - $result['allocated_qty'];

                /* if($Row['Doc_type'] == 'sales' || $Row['Doc_type'] == 'debitnote'){
                    $result['quantity'] = "(".$Row['qty2'].")";
                }
                else if($Row['Doc_type'] == 'purchase' || $Row['Doc_type'] == 'creditnote'  || $Row['Doc_type'] == 'opening_balance'){
                    $result['quantity'] = $Row['qty2']; 
                } 
                else if( $Row['Doc_type'] == 'itemLedger'){
                    if($Row['trailtype'] == '1')
                        $result['quantity'] = $Row['qty2'];                
                    else
                        $result['quantity'] = "(".$Row['qty2'].")";
                } */

                // $result['quantity']         = $Row['quantity'];
                $result['container_no']     = $Row['container_no'];
                $result['batch_no']         = $Row['batch_no'];
                $result['prod_date']        = $this->objGeneral->convert_unix_into_date($Row['prod_date']);
                $result['date_received']    = $this->objGeneral->convert_unix_into_date($Row['receipt_date']);
                $result['dispatch_date']    = $this->objGeneral->convert_unix_into_date($Row['o_dispatch_date']);
                $result['use_by_date']      = $this->objGeneral->convert_unix_into_date($Row['use_by_date']);
                $result['order_id']         = $Row['order_id'];
                $result['warehouse_id']     = $Row['warehouse_id'];
                $result['product_id']       = $Row['product_id'];
                $result['sale_status']      = $Row['sale_status'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['total'] = $total;
            // $response['Sql'] = $Sql;            
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
        } 
        return $response;
    }
}

?>