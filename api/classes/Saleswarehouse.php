<?php
// error_reporting(E_ERROR);
require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/General.php");
<<<<<<< HEAD
require_once(SERVER_PATH. "/classes/Setup.php");
=======
require_once(SERVER_PATH . "/classes/Setup.php");
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

class Saleswarehouse extends Xtreme
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
        $Sql = "UPDATE $table_name SET  $column=0 	WHERE id = $id Limit 1";

        $RS = $this->objsetup->CSI($Sql);
        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        }
        /* 	$uploads_dir = UPLOAD_PATH.'sales/';
          $Sql1 = "SELECT *
          FROM document
          WHERE id='".$attr['id']."'
          LIMIT 1";
          $Row = $this->objsetup->CSI($Sql1)->FetchRow();
          if($Row[file] != '')
          unlink($uploads_dir.$Row[file]);
         */
        return $response;
    }

    function get_data_by_id($table_name, $id)
    {

        $Sql = "SELECT *
				FROM $table_name
				WHERE id=$id
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

<<<<<<< HEAD
//------------General Tab--------------------------
=======
    //------------General Tab--------------------------
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    function get_all_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT   c.id, c.name, c.code FROM  warehouse  c 
		left JOIN company on company.id=c.company_id 
		where  c.status=1 
		and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		group by  c.name ASC "; //c.user_id=".$this->arrUser['id']." 
        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['wrh_code'] . '-' . $Row['name'];
                $result['code'] = $Row['code'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }

        return $response;
    }

    function get_items_warehouse($attr)
    {
        // print_r($attr);
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT   c.id, c.name, c.wrh_code, SUM(wa.quantity) as prod_count FROM  warehouse  c 
		left JOIN company on company.id=c.company_id 
		left JOIN warehouse_allocation wa ON wa.warehouse_id = c.id
<<<<<<< HEAD
		where  c.status=1 and wa.product_id = '".$attr['item_id']."'
=======
		where  c.status=1 and wa.product_id = '" . $attr['item_id'] . "'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		group by  c.name ASC "; //c.user_id=".$this->arrUser['id']."
        //echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['wrh_code'] . '-' . $Row['name'] . '  (' . $Row['prod_count'] . ')';
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }

        return $response;
    }

    function get_warehouse_listings($attr)
    {

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";


        $response = array();

        $Sql = "SELECT  c.id, c.crm_no, c.name , c.contact_person , c.city  , c.postcode, c.phone
		From warehouse  c 
		left JOIN company on company.id=c.company_id 
	  	 where   c.status=1 and 
		(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		order by c.id ASC ";


        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                //	$result['code'] = $Row['code'];
                $result['code'] = 'WRH' . $Row['crm_no'];
                $result['name'] = $Row['name'];
                $result['contact_person'] = $Row['contact_person'];
                $result['city'] = $Row['city'];
                $result['postcode'] = $Row['postcode'];
                $result['phone'] = $Row['phone'];
                //$result['type'] = $Row['type'];
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

    function add_warehouse($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        //	print_r($arr_attr);exit;	
        $variable = '';
        $id = $arr_attr['id'];


        $update_check = "";
        if ($arr_attr['id'] > 0)
            $update_check = "  AND tst.id <> " . $id . " ";

        $data_pass = "   tst.name='" . $arr_attr['name'] . "'  and tst.code='" . $arr_attr['code'] . "  $update_check";
        $total = $this->objGeneral->count_duplicate_in_sql('warehouse', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($id == 0) {

<<<<<<< HEAD
            $Sql = "INSERT INTO warehouse SET code='$arr_attr[code]',crm_no='$arr_attr[crm_no]',name='".$arr_attr['name']."',type='".$arr_attr['type']."',contact_person='$arr_attr[contact_person]',address_1='$arr_attr[address_1]',job_title='$arr_attr[job_title]',address_2='$arr_attr[address_2]',phone='$arr_attr[phone]',city='$arr_attr[city]',fax='$arr_attr[fax]',county='$arr_attr[county]',country_id='$arr_attr[country_id]',mobile='$arr_attr[mobile]',postcode='$arr_attr[postcode]',direct_line='$arr_attr[direct_line]',support_person='$arr_attr[support_person]',email='$arr_attr[email]',salesperson_id='$arr_attr[salesperson_id]',turnover='$arr_attr[turnover]',internal_sales='$arr_attr[internal_sales]',company_type='$arr_attr[company_type]',source_of_crm='$arr_attr[source_of_crm]',web_address='$arr_attr[web_address]',buying_grp='$arr_attr[buying_grp]',credit_limit='$arr_attr[credit_limit]'
=======
            $Sql = "INSERT INTO warehouse SET code='$arr_attr[code]',crm_no='$arr_attr[crm_no]',name='" . $arr_attr['name'] . "',type='" . $arr_attr['type'] . "',contact_person='$arr_attr[contact_person]',address_1='$arr_attr[address_1]',job_title='$arr_attr[job_title]',address_2='$arr_attr[address_2]',phone='$arr_attr[phone]',city='$arr_attr[city]',fax='$arr_attr[fax]',county='$arr_attr[county]',country_id='$arr_attr[country_id]',mobile='$arr_attr[mobile]',postcode='$arr_attr[postcode]',direct_line='$arr_attr[direct_line]',support_person='$arr_attr[support_person]',email='$arr_attr[email]',salesperson_id='$arr_attr[salesperson_id]',turnover='$arr_attr[turnover]',internal_sales='$arr_attr[internal_sales]',company_type='$arr_attr[company_type]',source_of_crm='$arr_attr[source_of_crm]',web_address='$arr_attr[web_address]',buying_grp='$arr_attr[buying_grp]',credit_limit='$arr_attr[credit_limit]'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
,purchase_code='$arr_attr[purchase_code]',purchase_code_id='$arr_attr[purchase_code_id]'
,currency_id='$arr_attr[currency_id]'
,user_id='" . $this->arrUser['id'] . "',status=1,company_id='" . $this->arrUser['company_id'] . "'";
            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
            $variable = 'insert';
            // }
        } else {
            $Sql = "UPDATE warehouse SET  
<<<<<<< HEAD
name='".$arr_attr['name']."',type='".$arr_attr['type']."',contact_person='$arr_attr[contact_person]',address_1='$arr_attr[address_1]',job_title='$arr_attr[job_title]',address_2='$arr_attr[address_2]',phone='$arr_attr[phone]',city='$arr_attr[city]',fax='$arr_attr[fax]',county='$arr_attr[county]',country_id='$arr_attr[country_id]',mobile='$arr_attr[mobile]',postcode='$arr_attr[postcode]',support_person='$arr_attr[support_person]',direct_line='$arr_attr[direct_line]',email='$arr_attr[email]',salesperson_id='$arr_attr[salesperson_id]',turnover='$arr_attr[turnover]',internal_sales='$arr_attr[internal_sales]',company_type='$arr_attr[company_type]',source_of_crm='$arr_attr[source_of_crm]',status='$arr_attr[status]',web_address='$arr_attr[web_address]',buying_grp='$arr_attr[buying_grp]',credit_limit='$arr_attr[credit_limit]',currency_id='$arr_attr[currency_id]',purchase_code='$arr_attr[purchase_code]',purchase_code_id='$arr_attr[purchase_code_id]',currency_id='$arr_attr[currency_id]'
=======
name='" . $arr_attr['name'] . "',type='" . $arr_attr['type'] . "',contact_person='$arr_attr[contact_person]',address_1='$arr_attr[address_1]',job_title='$arr_attr[job_title]',address_2='$arr_attr[address_2]',phone='$arr_attr[phone]',city='$arr_attr[city]',fax='$arr_attr[fax]',county='$arr_attr[county]',country_id='$arr_attr[country_id]',mobile='$arr_attr[mobile]',postcode='$arr_attr[postcode]',support_person='$arr_attr[support_person]',direct_line='$arr_attr[direct_line]',email='$arr_attr[email]',salesperson_id='$arr_attr[salesperson_id]',turnover='$arr_attr[turnover]',internal_sales='$arr_attr[internal_sales]',company_type='$arr_attr[company_type]',source_of_crm='$arr_attr[source_of_crm]',status='" . $arr_attr['status'] . "',web_address='$arr_attr[web_address]',buying_grp='$arr_attr[buying_grp]',credit_limit='$arr_attr[credit_limit]',currency_id='$arr_attr[currency_id]',purchase_code='$arr_attr[purchase_code]',purchase_code_id='$arr_attr[purchase_code_id]',currency_id='$arr_attr[currency_id]'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
WHERE id = " . $id . "   Limit 1";
            $RS = $this->objsetup->CSI($Sql);
        }
        //	echo $Sql;exit;

        if ($id > 0) {
            $response['id'] = $id;
            $response['info'] = $variable;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['id'] = 0;
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
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

<<<<<<< HEAD
            $Sql = "UPDATE warehouse SET type = ".$attr['type'].", customer_no = $number
					WHERE id = ".$attr['id']."";
=======
            $Sql = "UPDATE warehouse SET type = " . $attr['type'] . ", customer_no = $number
					WHERE id = " . $attr['id'] . "";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            //echo $Sql; exit;
        } else {
            $Sqls = "SELECT max(crm_no) as count	FROM warehouse";
            $crm = $this->objsetup->CSI($Sqls)->FetchRow();

            $number = $crm['count'] + 1;

<<<<<<< HEAD
            $Sql = "UPDATE warehouse SET type = ".$attr['type'].", crm_no = $number
				WHERE id = ".$attr['id']."";
=======
            $Sql = "UPDATE warehouse SET type = " . $attr['type'] . ", crm_no = $number
				WHERE id = " . $attr['id'] . "";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        }

        /* $Sql = "UPDATE crm SET type = ".$attr['type']."
          WHERE id = ".$attr['id'].""; */

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


        /* $mSql = "SELECT prefix FROM `module_codes` WHERE `id` = 108";
          $code = $this->objsetup->CSI($mSql)->FetchRow();

          $Sql = "SELECT max(crm_no) as count	FROM warehouse";
          $crm = $this->objsetup->CSI($Sql)->FetchRow();
          //echo $mSql; exit;
          $nubmer = $crm['count'];

          if($attr['is_increment'] == 1 || $nubmer == '')
          $nubmer++;

          return array('code'=>$code['prefix'].$this->objGeneral->module_item_prefix($nubmer),'number'=>$nubmer); */
    }

<<<<<<< HEAD
//----------------Alt Contact Module----------------------
=======
    //----------------Alt Contact Module----------------------
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    function get_alt_contacts($attr)
    {


        /* 	global $objFilters;
          return $objFilters->get_module_listing(108, "srm_alt_contact
          ",'','','type');
          exit; */

        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";


        $response = array();


        $Sql = "SELECT c.id,c.location,c.contact_name,c.job_title,c.direct_line,c.mobile,c.email 
		From warehouse_alt_contact  c 
		left JOIN company on company.id=c.company_id 
<<<<<<< HEAD
	   where  c.crm_id=".$attr['id']." and c.status=1 and 
=======
	   where  c.crm_id=" . $attr['id'] . " and c.status=1 and 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
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
            $where_clause .= " AND contact_name LIKE '%$attr[keyword]%' ";
        }

        $response = array();

        $Sql = "SELECT id, contact_name, direct_line, mobile, email
				FROM warehouse_alt_contact
				WHERE 1
				" . $where_clause . "
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

        $data_pass = "   tst.contact_name='" . $arr_attr['contact_name'] . "'   $update_check";
        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_alt_contact', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
        if ($id == 0) {


            $Sql = "INSERT INTO warehouse_alt_contact SET
location='$arr_attr[location]',location_adress='$arr_attr[location_adress]',depot='$arr_attr[depot]',contact_name='$arr_attr[contact_name]',job_title='$arr_attr[job_title]'
<<<<<<< HEAD
,address_1='$arr_attr[address_1]',address_2='$arr_attr[address_2]',phone='$arr_attr[phone]',city='$arr_attr[city]',fax='$arr_attr[fax]',county='$arr_attr[county]',country='$arr_attr[country]',mobile='$arr_attr[mobile]',postcode='$arr_attr[postcode]',direct_line='$arr_attr[direct_line]',email='$arr_attr[email]',web_add='$arr_attr[web_add]',crm_id='$arr_attr[crm_id]',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
=======
,address_1='$arr_attr[address_1]',address_2='$arr_attr[address_2]',phone='$arr_attr[phone]',city='$arr_attr[city]',fax='$arr_attr[fax]',county='$arr_attr[county]',country='$arr_attr[country]',mobile='$arr_attr[mobile]',postcode='$arr_attr[postcode]',direct_line='$arr_attr[direct_line]',email='$arr_attr[email]',web_add='$arr_attr[web_add]',crm_id='" . $arr_attr['crm_id'] . "',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
            //  }
        } else {
            $Sql = "UPDATE warehouse_alt_contact SET  
<<<<<<< HEAD
									location='$arr_attr[location]',location_adress='$arr_attr[location_adress]',depot='$arr_attr[depot]',contact_name='$arr_attr[contact_name]',job_title='$arr_attr[job_title]',address_1='$arr_attr[address_1]',address_2='$arr_attr[address_2]',phone='$arr_attr[phone]',city='$arr_attr[city]',fax='$arr_attr[fax]',county='$arr_attr[county]',country='$arr_attr[country]',mobile='$arr_attr[mobile]',postcode='$arr_attr[postcode]',direct_line='$arr_attr[direct_line]',email='$arr_attr[email]',web_add='$arr_attr[web_add]',crm_id='$arr_attr[crm_id]'
=======
									location='$arr_attr[location]',location_adress='$arr_attr[location_adress]',depot='$arr_attr[depot]',contact_name='$arr_attr[contact_name]',job_title='$arr_attr[job_title]',address_1='$arr_attr[address_1]',address_2='$arr_attr[address_2]',phone='$arr_attr[phone]',city='$arr_attr[city]',fax='$arr_attr[fax]',county='$arr_attr[county]',country='$arr_attr[country]',mobile='$arr_attr[mobile]',postcode='$arr_attr[postcode]',direct_line='$arr_attr[direct_line]',email='$arr_attr[email]',web_add='$arr_attr[web_add]',crm_id='" . $arr_attr['crm_id'] . "'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
										WHERE id = " . $id . "   Limit 1";
            $RS = $this->objsetup->CSI($Sql);
        }
        //echo $Sql;exit;

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

    //----------------Warehouse Stock Allocation----------------------

    function get_stock_allocation($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";

        $response = array();


        if (!empty($attr['purchase_return_status']))
            $where_clause .= " AND purchase_return_status = 1 ";
        else
            $where_clause .= " AND purchase_return_status = 0 ";

        $Sql = "SELECT c.* ,
                       w.name as wname
                FROM warehouse_allocation  c  
                LEFT JOIN warehouse w on w.id=c.warehouse_id 
<<<<<<< HEAD
                WHERE   c.product_id=".$attr['item_id']." AND   
                        c.order_id=".$attr['order_id']." AND  
                        c.status=1 AND 
                        c.type='$attr[type_id]' 
=======
                WHERE   c.product_id=" . $attr['item_id'] . " AND   
                        c.order_id=" . $attr['order_id'] . " AND  
                        c.status=1 AND 
                        c.type='" . $attr['type_id'] . "' 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $where_clause  AND
                        c.company_id=" . $this->arrUser['company_id'] . "		 
                ORDER BY c.id ASC ";

        $RS = $this->objsetup->CSI($Sql);

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
            $response['response'][] = array();
        }


        if (!empty($attr['purchase_return_status'])) {
            $sql_total_purchase_return = "  SELECT  sum(quantity) as total  
                                            FROM  warehouse_allocation  c
<<<<<<< HEAD
                                            WHERE  c.product_id=".$attr['item_id']."  AND 
                                                   c.status=1 AND 
                                                   c.type=1 AND   
                                                   c.order_id=".$attr['order_id']." AND 
                                                   c.warehouse_id=$attr[warehouses_id] AND 
=======
                                            WHERE  c.product_id=" . $attr['item_id'] . "  AND 
                                                   c.status=1 AND 
                                                   c.type=1 AND   
                                                   c.order_id=" . $attr['order_id'] . " AND 
                                                   c.warehouse_id=" . $attr['warehouses_id'] . " AND 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                   purchase_return_status = 1  AND 
                                                   c.company_id=" . $this->arrUser['company_id'] . " ";

            $rs_count_pr = $this->objsetup->CSI($sql_total_purchase_return);
            $response['total_pr'] = $rs_count_pr->fields['total'];
        }

        $sql_total = "SELECT  sum(quantity) as total  
                      FROM warehouse_allocation  c 
<<<<<<< HEAD
                      WHERE  c.product_id=".$attr['item_id']."  AND  
                             c.status=1 AND 
                             c.type=1 AND   
                             c.order_id=".$attr['order_id']." AND 
                             c.warehouse_id=$attr[warehouses_id] AND 
=======
                      WHERE  c.product_id=" . $attr['item_id'] . "  AND  
                             c.status=1 AND 
                             c.type=1 AND   
                             c.order_id=" . $attr['order_id'] . " AND 
                             c.warehouse_id=" . $attr['warehouses_id'] . " AND 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                             purchase_return_status = 0 AND 
                             c.company_id=" . $this->arrUser['company_id'] . " ";

        $rs_count = $this->objsetup->CSI($sql_total);
        $response['total'] = $rs_count->fields['total'];

        return $response;
    }

    function add_stock_allocation($arr_attr)
    {
        if (!empty($arr_attr['purchase_return_status']))
            $purchase_return_status .= "  purchase_return_status = 1 ";
        else
            $purchase_return_status .= "  purchase_return_status = 0 ";

        $id = $arr_attr['id'];
        $update_check = "";
        if ($id > 0)
            $update_check = "  AND tst.id <> " . $id . " ";

<<<<<<< HEAD
        $data_pass = " tst.type=1 AND tst.status=1 AND tst.order_id=".$arr_attr['order_id']." AND tst.product_id=".$$arr_attr['item_id']."	AND tst.warehouse_id=".$arr_attr['warehouses_id']."  $update_check ";
=======
        $data_pass = " tst.type=1 AND tst.status=1 AND tst.order_id=" . $arr_attr['order_id'] . " AND tst.product_id=" . $$arr_attr['item_id'] . "	AND tst.warehouse_id=" . $arr_attr['warehouses_id'] . "  $update_check ";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_allocation', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

<<<<<<< HEAD
        $date_receivedUnConv = ""; 

        if($arr_attr['date_received'] > 0){
            $date_receivedUnConv = "date_receivedUnConv = '" . $this->objGeneral->convertUnixDateIntoConvDate($arr_attr['date_received']) . "',";            
        } 
        
=======
        $date_receivedUnConv = "";

        if ($arr_attr['date_received'] > 0) {
            $date_receivedUnConv = "date_receivedUnConv = '" . $this->objGeneral->convertUnixDateIntoConvDate($arr_attr['date_received']) . "',";
        }

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if ($id == 0) {

            $Sql = "INSERT INTO warehouse_allocation 
                                            SET
                                            " . $purchase_return_status . ",
                                            status=1,
                                            container_no='$arr_attr[container_no]',
<<<<<<< HEAD
                                            consignment_no='$attr[consignment_no]',
=======
                                            consignment_no='$arr_attr[consignment_no]',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                            bl_shipment_no='$arr_attr[bl_shipment_no]',
                                            quantity='$arr_attr[stock_qty]',
                                            remaining_qty='$arr_attr[stock_qty]',
                                            prod_date='" . $this->objGeneral->convert_date($arr_attr['prod_date']) . "',
                                            date_received='" . $this->objGeneral->convert_date($arr_attr['date_received']) . "',
                                            $date_receivedUnConv
                                            use_by_date='" . $this->objGeneral->convert_date($arr_attr['use_by_date']) . "',
                                            batch_no='$arr_attr[batch_no]',
                                            order_id='$arr_attr[order_id]',
<<<<<<< HEAD
                                            product_id='$arr_attr[item_id]',
                                            warehouse_id='".$arr_attr['warehouses_id']."',
                                            type='".$arr_attr['type']."' ,
                                            supplier_id='".$arr_attr['supplier_id']."',
                                            order_date='" . $this->objGeneral->convert_date($arr_attr['order_date']) . "',
                                            unit_measure='".$arr_attr['unit_of_measure_name']."',
=======
                                            product_id='" . $arr_attr['item_id'] . "',
                                            warehouse_id='" . $arr_attr['warehouses_id'] . "',
                                            type='" . $arr_attr['type'] . "' ,
                                            supplier_id='" . $arr_attr['supplier_id'] . "',
                                            order_date='" . $this->objGeneral->convert_date($arr_attr['order_date']) . "',
                                            unit_measure='" . $arr_attr['unit_of_measure_name'] . "',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                            user_id='" . $this->arrUser['id'] . "',
                                            AddedBy='" . $this->arrUser['id'] . "',
                                            AddedOn=UNIX_TIMESTAMP (NOW()),
                                            company_id='" . $this->arrUser['company_id'] . "'";

            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
        } else {
            $Sql = "UPDATE warehouse_allocation 
                                        SET
                                            container_no='$arr_attr[container_no]',
                                            batch_no='$arr_attr[batch_no]',
                                            quantity='$arr_attr[stock_qty]',
                                            remaining_qty='$arr_attr[stock_qty]',
                                            prod_date='" . $this->objGeneral->convert_date($arr_attr['prod_date']) . "',
                                            date_received='" . $this->objGeneral->convert_date($arr_attr['date_received']) . "',
                                            $date_receivedUnConv
                                            ChangedBy='" . $this->arrUser['id'] . "',
                                            ChangedOn=UNIX_TIMESTAMP (NOW()),
                                            use_by_date='" . $this->objGeneral->convert_date($arr_attr['use_by_date']) . "'
                                        WHERE id = " . $id . "   
                                        Limit 1";
            $RS = $this->objsetup->CSI($Sql);
        }

        /* echo $Sql;
        exit; */

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

    //----------------Item Journal Stock Allocation----------------------
<<<<<<< HEAD
    
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    /* function itemJournalStockAllocation($arr_attr)
    {
        $id = $arr_attr['id'];

        $update_check = "";

        if ($id > 0)
            $update_check = " AND tst.id <> " . $id . " ";

<<<<<<< HEAD
        $data_pass = " tst.type=3 AND tst.status=1 AND	tst.order_id=$$arr_attr[order_id] AND tst.product_id=$$arr_attr[item_id] AND tst.warehouse_id=".$arr_attr['warehouses_id']." $update_check ";
=======
        $data_pass = " tst.type=3 AND tst.status=1 AND	tst.order_id=$$arr_attr[order_id] AND tst.product_id=$".$arr_attr['item_id']." AND tst.warehouse_id=".$arr_attr['warehouses_id']." $update_check ";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_allocation', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $primary_unit_id = (isset($arr_attr['primary_unit_id']) && $arr_attr['primary_unit_id']!='')?$arr_attr['primary_unit_id']:0;  
        $unit_of_measure_id = (isset($arr_attr['unit_of_measure_id']) && $arr_attr['unit_of_measure_id']!='')?$arr_attr['unit_of_measure_id']:0;  

        if ($id == 0) {

            $Sql = "INSERT INTO warehouse_allocation 
                                            SET
                                                purchase_return_status = 0,
                                                status=1,
                                                item_journal_detail_id ='" . $arr_attr['orderLineID'] . "',
                                                container_no='" . $arr_attr['container_no'] . "',
                                                bl_shipment_no='".$arr_attr['bl_shipment_no']."',
                                                quantity='".$arr_attr['stock_qty']."',
                                                prod_date='" . $this->objGeneral->convert_date($arr_attr['prod_date']) . "',
                                                date_received='" . $this->objGeneral->convert_date($arr_attr['date_received']) . "',
                                                use_by_date='" . $this->objGeneral->convert_date($arr_attr['use_by_date']) . "',
                                                batch_no='".$arr_attr['batch_no']."',
                                                order_id='".$arr_attr['order_id']."',
                                                product_id='".$arr_attr['item_id']."',
                                                warehouse_id='".$arr_attr['warehouses_id']."',
                                                type=3,
                                                ledger_type = 1,
                                                journal_status=1,
                                                order_date='" . $this->objGeneral->convert_date($arr_attr['order_date']) . "',
                                                unit_measure='".$arr_attr['unit_of_measure_name']."',
                                                primary_unit_id='".$primary_unit_id."',
                                                primary_unit_name='".$arr_attr['primary_unit_name']."',
                                                primary_unit_qty='".$arr_attr['primary_unit_qty']."',
                                                unit_measure_id='".$unit_of_measure_id."',
                                                unit_measure_name='".$arr_attr['unit_of_measure_name']."',
                                                unit_measure_qty='".$arr_attr['unit_of_measure_qty']."',
                                                user_id='" . $this->arrUser['id'] . "',
                                                company_id='" . $this->arrUser['company_id'] . "'";

            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();

        } else {

            $Sql = "UPDATE warehouse_allocation 
                                        SET
                                            container_no='".$arr_attr['container_no']."',
                                            batch_no='".$arr_attr['batch_no']."',
                                            quantity='".$arr_attr['stock_qty']."',
                                            prod_date='" . $this->objGeneral->convert_date($arr_attr['prod_date']) . "',
                                            date_received='" . $this->objGeneral->convert_date($arr_attr['date_received']) . "',
                                            use_by_date='" . $this->objGeneral->convert_date($arr_attr['use_by_date']) . "'
                                        WHERE id = " . $id . "   
                                        Limit 1";

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
    } */

    //-----------Alt Depot Module---------------------------

    function get_alt_depots($attr)
    {
        /* global $objFilters;
          return $objFilters->get_module_listing(69, "crm_alt_depot",$attr[column],$attr[value],$attr[more_fields]);
         */


        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = "";

        $response = array();


        $Sql = "SELECT c.id,c.depot,c.contact_name as contact_person,c.direct_line,c.mobile,c.email ,c.role 
		From warehouse_alt_depot  c 
		left JOIN company on company.id=c.company_id 
<<<<<<< HEAD
	   where  c.crm_id=".$attr['id']." and c.status=1 and 
=======
	   where  c.crm_id=" . $attr['id'] . " and c.status=1 and 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		order by c.id ASC ";


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

        $data_pass = "   tst.contact_name='" . $arr_attr['contact_name'] . "'   $update_check";
        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_alt_depot', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
        if ($id == 0) {


            $Sql = "INSERT INTO warehouse_alt_depot SET
<<<<<<< HEAD
									depot='$arr_attr[depot]',depot_address='$arr_attr[depot_address]',role='$arr_attr[role]',contact_name='$arr_attr[contact_name]',role='$arr_attr[role]',address='$arr_attr[address]',address_2='$arr_attr[address_2]',telephone='$arr_attr[telephone]',city='$arr_attr[city]',fax='$arr_attr[fax]',county='$arr_attr[county]',country='$arr_attr[country]',mobile='$arr_attr[mobile]',postcode='$arr_attr[postcode]',direct_line='$arr_attr[direct_line]',email='$arr_attr[email]',web_add='$arr_attr[web_add]',crm_id='$arr_attr[crm_id]',book_in_contact='$arr_attr[book_in_contact]',book_in_tel='$arr_attr[book_in_tel]',book_in_email='$arr_attr[book_in_email]',book_in_fax='$arr_attr[book_in_fax]',booking_instructions='$arr_attr[booking_instructions]',booking_start_time='$arr_attr[booking_start_time]',booking_end_time='$arr_attr[booking_end_time]',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
=======
									depot='$arr_attr[depot]',depot_address='$arr_attr[depot_address]',role='$arr_attr[role]',contact_name='$arr_attr[contact_name]',role='$arr_attr[role]',address='$arr_attr[address]',address_2='$arr_attr[address_2]',telephone='$arr_attr[telephone]',city='$arr_attr[city]',fax='$arr_attr[fax]',county='$arr_attr[county]',country='$arr_attr[country]',mobile='$arr_attr[mobile]',postcode='$arr_attr[postcode]',direct_line='$arr_attr[direct_line]',email='$arr_attr[email]',web_add='$arr_attr[web_add]',crm_id='" . $arr_attr['crm_id'] . "',book_in_contact='$arr_attr[book_in_contact]',book_in_tel='$arr_attr[book_in_tel]',book_in_email='$arr_attr[book_in_email]',book_in_fax='$arr_attr[book_in_fax]',booking_instructions='$arr_attr[booking_instructions]',booking_start_time='$arr_attr[booking_start_time]',booking_end_time='$arr_attr[booking_end_time]',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
            //   }
        } else {
            $Sql = "UPDATE warehouse_alt_depot SET  
<<<<<<< HEAD
								depot='$arr_attr[depot]',depot_address='$arr_attr[job]',role='$arr_attr[role]',contact_name='$arr_attr[contact_name]',role='$arr_attr[role]',address='$arr_attr[address]',address_2='$arr_attr[address_2]',telephone='$arr_attr[telephone]',city='$arr_attr[city]',fax='$arr_attr[fax]',county='$arr_attr[county]',country='$arr_attr[country]',mobile='$arr_attr[mobile]',postcode='$arr_attr[postcode]',direct_line='$arr_attr[direct_line]',email='$arr_attr[email]',web_add='$arr_attr[web_add]',crm_id='$arr_attr[crm_id]',book_in_contact='$arr_attr[book_in_contact]',book_in_tel='$arr_attr[book_in_tel]',book_in_email='$arr_attr[book_in_email]',book_in_fax='$arr_attr[book_in_fax]',booking_instructions='$arr_attr[booking_instructions]',booking_start_time='$arr_attr[booking_start_time]',booking_end_time='$arr_attr[booking_end_time]' 
=======
								depot='$arr_attr[depot]',depot_address='$arr_attr[job]',role='$arr_attr[role]',contact_name='$arr_attr[contact_name]',role='$arr_attr[role]',address='$arr_attr[address]',address_2='$arr_attr[address_2]',telephone='$arr_attr[telephone]',city='$arr_attr[city]',fax='$arr_attr[fax]',county='$arr_attr[county]',country='$arr_attr[country]',mobile='$arr_attr[mobile]',postcode='$arr_attr[postcode]',direct_line='$arr_attr[direct_line]',email='$arr_attr[email]',web_add='$arr_attr[web_add]',crm_id='" . $arr_attr['crm_id'] . "',book_in_contact='$arr_attr[book_in_contact]',book_in_tel='$arr_attr[book_in_tel]',book_in_email='$arr_attr[book_in_email]',book_in_fax='$arr_attr[book_in_fax]',booking_instructions='$arr_attr[booking_instructions]',booking_start_time='$arr_attr[booking_start_time]',booking_end_time='$arr_attr[booking_end_time]' 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
									WHERE id = " . $id . "   Limit 1";
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

<<<<<<< HEAD
//----------------- SRM Price Offer-----------------------------------

    function get_price_offer_listings($attr)
    {

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";


=======
    //----------------- SRM Price Offer-----------------------------------

    function get_price_offer_listings($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $response = array();
        $response2 = array();


        $Sql = "SELECT c.id,c.name,c.description,c.type
<<<<<<< HEAD
		FROM  price_offer_volume  c 
		left JOIN company on company.id=c.company_id  
	    where c.status=1 and 
		(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		order by c.id ASC ";


        $RS = $this->objsetup->CSI($Sql);


=======
                FROM  price_offer_volume  c 
                where c.status=1 and c.company_id=" . $this->arrUser['company_id'] . " 
                order by c.id ASC ";

        $RS = $this->objsetup->CSI($Sql);

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['type'] = $Row['type'];
                $result['description'] = $Row['description'];
                $response2['response_price'][] = $result;
            }
        }

<<<<<<< HEAD

        $Sql = "SELECT c.*
		From warehouse_price_offer_listing  c 
		left JOIN company on company.id=c.company_id  
	    where  c.crm_id=".$attr['id']." and c.status=1 and 
		(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		order by c.id ASC "; //Volume 1


        $RS = $this->objsetup->CSI($Sql);


=======
        $Sql = "SELECT c.*
                From warehouse_price_offer_listing  c  
                where  c.crm_id=" . $attr['id'] . " and c.status=1 and c.company_id=" . $this->arrUser['company_id'] . "		 
                order by c.id ASC "; //Volume 1

        $RS = $this->objsetup->CSI($Sql);

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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
        if ($id > 0)
            $update_check = "  AND tst.id <> " . $id . " ";

<<<<<<< HEAD
        $data_pass = "   tst.offered_by='" . $attr['offered_by'] . "' and  tst.type = '".$attr['type']."' and  tst.module_id='" . $attr['crm_id'] . "'   $update_check";
=======
        $data_pass = "   tst.offered_by='" . $attr['offered_by'] . "' and  tst.type = '" . $attr['type'] . "' and  tst.module_id='" . $attr['crm_id'] . "'   $update_check";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_price_offer_listing', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($id == 0) {

            $Sql = "INSERT INTO warehouse_price_offer_listing
<<<<<<< HEAD
SET crm_id = '$attr[crm_id]',offered_by = '$attr[offered_by]',product_id = '$attr[product_id]',offered_by_id = '$attr[offered_by_id]',offer_method_id = '$attr[offer_method_id]',price_offered = '$attr[price_offered]',currency_id = '$attr[currency_id]',offer_date = '" . $this->objGeneral->convert_date($attr[offer_date]) . "',offer_valid_date ='" . $this->objGeneral->convert_date($attr[offer_valid_date]) . "',volume_1 = '$attr[volume_1]',volume_2 = '$attr[volume_2]',volume_3 = '$attr[volume_3]',`volume_1_price` = '$attr[volume_1_price]',`volume_2_price` = '$attr[volume_2_price]',`volume_3_price` = '$attr[volume_3_price]',`unit_of_measure_1` = '$attr[unit_of_measure_1]',`unit_of_measure_2` = '$attr[unit_of_measure_2]',`unit_of_measure_3` = '$attr[unit_of_measure_3]',comment = '$attr[comment]'
,type = '".$attr['type']."',product_code = '$attr[product_code]',product_description = '$attr[product_description]' ,user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
=======
                    SET crm_id = '" . $attr['crm_id'] . "',
                        offered_by = '" . $attr['offered_by'] . "',
                        product_id = '" . $attr['product_id'] . "',
                        offered_by_id = '" . $attr['offered_by_id'] . "',
                        offer_method_id = '$attr[offer_method_id]',
                        price_offered = '$attr[price_offered]',
                        currency_id = '$attr[currency_id]',
                        offer_date = '" . $this->objGeneral->convert_date($attr['offer_date']) . "',
                        offer_valid_date ='" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "',
                        volume_1 = '$attr[volume_1]',
                        volume_2 = '$attr[volume_2]',
                        volume_3 = '$attr[volume_3]',
                        `volume_1_price` = '$attr[volume_1_price]',`volume_2_price` = '$attr[volume_2_price]',`volume_3_price` = '$attr[volume_3_price]',
                        `unit_of_measure_1` = '$attr[unit_of_measure_1]',`unit_of_measure_2` = '$attr[unit_of_measure_2]',`unit_of_measure_3` = '$attr[unit_of_measure_3]',
                        comment = '$attr[comment]',
                        type = '" . $attr['type'] . "',product_code = '$attr[product_code]',product_description = '$attr[product_description]' ,
                        user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            //  }
        } else {


            $Sql = "UPDATE warehouse_price_offer_listing
<<<<<<< HEAD
SET product_id = '$attr[product_id]',offered_by = '$attr[offered_by]',offered_by_id = '$attr[offered_by_id]',offer_method_id = '$attr[offer_method_id]',price_offered = '$attr[price_offered]',currency_id = '$attr[currency_id]',offer_date = '" . $this->objGeneral->convert_date($attr['offer_date']) . "',offer_valid_date = '" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "',volume_1 = '$attr[volume_1]',volume_2 = '$attr[volume_2]',volume_3 = '$attr[volume_3]',`volume_1_price` = '$attr[volume_1_price]',`volume_2_price` = '$attr[volume_2_price]',`volume_3_price` = '$attr[volume_3_price]',`unit_of_measure_1` = '$attr[unit_of_measure_1]',`unit_of_measure_2` = '$attr[unit_of_measure_2]',`unit_of_measure_3` = '$attr[unit_of_measure_3]',comment = '$attr[comment]'
,type = '".$attr['type']."',product_code = '$attr[product_code]',product_description = '$attr[product_description]' 
WHERE id = $id ";
=======
                    SET product_id = '" . $attr['product_id'] . "',offered_by = '" . $attr['offered_by'] . "',
                    offered_by_id = '" . $attr['offered_by_id'] . "',
                    offer_method_id = '$attr[offer_method_id]',
                    price_offered = '$attr[price_offered]',currency_id = '$attr[currency_id]',
                    offer_date = '" . $this->objGeneral->convert_date($attr['offer_date']) . "',
                    offer_valid_date = '" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "',
                    volume_1 = '$attr[volume_1]',volume_2 = '$attr[volume_2]',volume_3 = '$attr[volume_3]',
                    `volume_1_price` = '$attr[volume_1_price]',`volume_2_price` = '$attr[volume_2_price]',`volume_3_price` = '$attr[volume_3_price]',
                    `unit_of_measure_1` = '$attr[unit_of_measure_1]',`unit_of_measure_2` = '$attr[unit_of_measure_2]',`unit_of_measure_3` = '$attr[unit_of_measure_3]',
                    comment = '$attr[comment]',type = '" . $attr['type'] . "',
                    product_code = '$attr[product_code]',product_description = '$attr[product_description]' 
                    WHERE id = $id ";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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
		left JOIN company on company.id=c.company_id 
<<<<<<< HEAD
	    where  c.crm_id=".$attr['id']." and c.status=1 and 
=======
	    where  c.crm_id=" . $attr['id'] . " and c.status=1 and 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
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
<<<<<<< HEAD
				WHERE type='".$attr['type']."' AND company_id =" . $this->arrUser['company_id'];
=======
				WHERE type='" . $attr['type'] . "' AND company_id =" . $this->arrUser['company_id'];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

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

<<<<<<< HEAD
//------------- Price Offer Volume Module-------------------------
=======
    //------------- Price Offer Volume Module-------------------------
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    function get_supplier_list_product_id($attr)
    {

        $this->objGeneral->mysql_clean($attr);


        $response = array();


        $Sql = "SELECT srm_volume_discount.id,srm_volume_discount.start_date,srm_volume_discount.end_date
		,srm_volume_discount.discount_value,srm_volume_discount.supplier_type
		,v.description 	,srm_volume_discount.purchase_price,srm_volume_discount.discount_price
		,srm_volume_discount.product_code
		FROM warehouse_volume_discount 
		Left JOIN price_offer_volume  v ON v.id = srm_volume_discount.volume_id 
<<<<<<< HEAD
		WHERE srm_volume_discount.crm_id='$attr[crm_id]' and srm_volume_discount.status=1
=======
		WHERE srm_volume_discount.crm_id='" . $attr['crm_id'] . "' and srm_volume_discount.status=1
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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

<<<<<<< HEAD
        $data_pass = "   tst.offered_by='" . $attr['offered_by'] . "' and tst.type = '".$attr['type']."' and tst.module_id='" . $attr['crm_id'] . "'   $update_check";
=======
        $data_pass = "   tst.offered_by='" . $attr['offered_by'] . "' and tst.type = '" . $attr['type'] . "' and tst.module_id='" . $attr['crm_id'] . "'   $update_check";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_volume_discount_listing', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($doc_id == 0) {


            $Sql = "INSERT INTO warehouse_volume_discount_listing
<<<<<<< HEAD
						SET crm_id = '$attr[crm_id]',offered_by = '$attr[offered_by]',offered_by_id = '$attr[offered_by_id]',product_id = '$attr[product_id]',product_code = '$attr[product_code]',product_description = '$attr[product_description]',offer_method_id = '$attr[offer_method_id]', offer_valid_date = '" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "',offer_date = '" . $this->objGeneral->convert_date($attr['offer_date']) . "' ,type = '".$attr['type']."' ,user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
=======
						SET crm_id = '" . $attr['crm_id'] . "',offered_by = '" . $attr['offered_by'] . "',offered_by_id = '" . $attr['offered_by_id'] . "',product_id = '" . $attr['product_id'] . "',product_code = '$attr[product_code]',product_description = '$attr[product_description]',offer_method_id = '$attr[offer_method_id]', offer_valid_date = '" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "',offer_date = '" . $this->objGeneral->convert_date($attr['offer_date']) . "' ,type = '" . $attr['type'] . "' ,user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


            //	$doc_id = $this->Conn->Insert_ID();$new='insert';
            $new = 'Add';
            $new_msg = 'Insert';
            //  }
        } else {


            $Sql = "UPDATE warehouse_volume_discount_listing
<<<<<<< HEAD
SET offered_by = '$attr[offered_by]',offered_by_id = '$attr[offered_by_id]',product_id = '$attr[product_id]',product_code = '$attr[product_code]',product_description = '$attr[product_description]',offer_method_id = '$attr[offer_method_id]', offer_valid_date = '" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "',offer_date = '" . $this->objGeneral->convert_date($attr['offer_date']) . "'  where id='".$attr['id']."'";
=======
SET offered_by = '" . $attr['offered_by'] . "',offered_by_id = '" . $attr['offered_by_id'] . "',product_id = '" . $attr['product_id'] . "',product_code = '$attr[product_code]',product_description = '$attr[product_description]',offer_method_id = '$attr[offer_method_id]', offer_valid_date = '" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "',offer_date = '" . $this->objGeneral->convert_date($attr['offer_date']) . "'  where id='" . $attr['id'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        }
        $RS = $this->objsetup->CSI($Sql);
        /* echo $Sql;
          exit; */

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
        //	echo '<pre>'; print_r($arr_attr); exit;

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
											,date_added=UNIX_TIMESTAMP (NOW())";
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
											,date_added=UNIX_TIMESTAMP (NOW())";
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
											,date_added=UNIX_TIMESTAMP (NOW())";
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
		group by  c.name ASC ";

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
            $update_check = "  AND tst.id <> " . $id . " ";

        $data_pass = "   tst.name='" . $attr->name . "'  and tst.type=1 and tst.status=1   $update_check";
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

        $Sql = "SELECT   c.id, c.name  FROM  get_method  c 
		left JOIN company on company.id=c.company_id 
		where c.status=1 and   c.type=2   
		and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		group by  c.name ASC ";

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
        $id = $attr->id;

        $update_check = "";
        if ($id > 0)
            $update_check = "  AND tst.id <> " . $id . " ";

        $data_pass = "   tst.name='" . $attr->name . "'  and tst.type=1 and tst.status=1   $update_check";
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

<<<<<<< HEAD
//----------SRM shiping Module----------------------------
    function get_shipping($attr)
    {
        /* 	global $objFilters;
          $where = array(0=>array('document.module_id'=>19),1=>array('document.row_id'=>$attr[crm_id]),2=>array('document.type'=>2));
=======
    //----------SRM shiping Module----------------------------
    function get_shipping($attr)
    {
        /* 	global $objFilters;
          $where = array(0=>array('document.module_id'=>19),1=>array('document.row_id'=>".$attr['crm_id']."),2=>array('document.type'=>2));
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
          return $objFilters->get_module_listing(12, "document",'','',$attr[more_fields],'',$where);
         */

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";


        $response = array();

        $Sql = "SELECT srm_agent_area_list.id,  srm_agent_area_list.coverage_area  
	 		 FROM warehouse_agent_area_list 
			left  JOIN company on company.id=srm_agent_area_list.company_id 
			where srm_agent_area_list.status=1 and
<<<<<<< HEAD
			 srm_agent_area_list.crm_id='".$attr['id']."' and ( srm_agent_area_list.company_id=" . $this->arrUser['company_id'] . " 
=======
			 srm_agent_area_list.crm_id='" . $attr['id'] . "' and ( srm_agent_area_list.company_id=" . $this->arrUser['company_id'] . " 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
			or  company.parent_id=" . $this->arrUser['company_id'] . ")
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

        //print_r($arr_attr); 	exit;

<<<<<<< HEAD
        $doc_id = $arr_attr[update_id];
        if ($doc_id == 0) {

            $Sql = "INSERT INTO warehouse_agent_area SET  
									 coverage_area='" . $arr_attr[coverage_area] . "'
									,coverage_area_id='" . $arr_attr[coverage_area_id] . "'
									,crm_id='" . $arr_attr[crm_id] . "'
=======
        $doc_id = $arr_attr['update_id'];
        if ($doc_id == 0) {

            $Sql = "INSERT INTO warehouse_agent_area SET  
									 coverage_area='" . $arr_attr['coverage_area'] . "'
									,coverage_area_id='" . $arr_attr['coverage_area_id'] . "'
									,crm_id='" . $arr_attr['crm_id'] . "'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
									,status='1'  
									,company_id='" . $this->arrUser['company_id'] . "' 
									,user_id='" . $this->arrUser['id'] . "'
									,date_added=UNIX_TIMESTAMP (NOW())";

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
                    $sql = "SELECT  count(id)  as total FROM warehouse_agent_area_list	
<<<<<<< HEAD
												WHERE cover_area_id='" . $area_id . "'   and  crm_id='" . $arr_attr[crm_id] . "'
=======
												WHERE cover_area_id='" . $area_id . "'   and  crm_id='" . $arr_attr['crm_id'] . "'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
												and company_id='" . $this->arrUser['company_id'] . "' ";
                    $rs_count = $this->objsetup->CSI($sql);
                    $total = $rs_count->fields['total'];
                    if ($total == 0) {
                        $Sql = "INSERT INTO warehouse_agent_area_list SET  
														cover_area_id='" . $area_id . "'
														,coverage_area='" . $area_name[$i] . "'    
														,sale_id='" . $sale_id . "' 
<<<<<<< HEAD
														,crm_id='" . $arr_attr[crm_id] . "' 
=======
														,crm_id='" . $arr_attr['crm_id'] . "' 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
														,status='1'   
														,company_id='" . $this->arrUser['company_id'] . "' 
														,user_id='" . $this->arrUser['id'] . "',
														date_added=UNIX_TIMESTAMP (NOW())";
                        $RS = $this->objsetup->CSI($Sql);
                    }
                    $i++;
                }
            }
<<<<<<< HEAD
        } else {
            {
=======
        } else { {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                //  $Sql = "DELETE FROM shipping_agent WHERE id = $sp_id";
                //	$RS = $this->objsetup->CSI($Sql);
                //	$Sql = "DELETE FROM shipping_agent_sale WHERE sale_id = $sp_id";
                //	$RS = $this->objsetup->CSI($Sql);

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
												,date_added=UNIX_TIMESTAMP (NOW())";

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

    function add_supplier_area_list($arr_attr)
    {

        print_r($arr_attr);
        exit;
        $tab_change = 'tab_doc';
<<<<<<< HEAD
        $doc_id = $arr_attr[update_id];
=======
        $doc_id = $arr_attr['update_id'];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if ($doc_id > 0) {
            //  $Sql = "DELETE FROM shipping_agent WHERE id = $sp_id";
            //	$RS = $this->objsetup->CSI($Sql);
            //	$Sql = "DELETE FROM shipping_agent_sale WHERE sale_id = $sp_id";
            //	$RS = $this->objsetup->CSI($Sql);

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
									,date_added=UNIX_TIMESTAMP (NOW())";
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
										date_added=UNIX_TIMESTAMP (NOW())";
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
<<<<<<< HEAD
		   FROM warehouse_agent_area_list c  where sale_id ='".$attr['id']."' and status=1 ";
=======
		   FROM warehouse_agent_area_list c  where sale_id ='" . $attr['id'] . "' and status=1 ";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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


        $limit_clause = $where_clause = "";


        $Sql = "SELECT  c.id, c.name, c.price
			FROM coverage_areas  c
			left  JOIN company on company.id= c.company_id 
			where c.status=1 and  ( c.company_id=" . $this->arrUser['company_id'] . " 
			or  company.parent_id=" . $this->arrUser['company_id'] . ")
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
<<<<<<< HEAD
		   FROM warehouse_agent_area_list c  where crm_id ='".$attr['id']."' and status=1 ";
=======
		   FROM warehouse_agent_area_list c  where crm_id ='" . $attr['id'] . "' and status=1 ";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";


        $response = array();


        $Sql = "SELECT srm_area_selected.id,srm_area_selected.offered_by , srm_area_selected.valid_from, srm_area_selected.valid_to, srm_area_selected.price, srm_area_selected.shipping_method , srm_area_selected.shipping_quantity  ,get_method.name  as  shipping_methods
		FROM warehouse_area_selected 
		left  JOIN company on company.id=srm_area_selected.company_id 
		left  JOIN get_method on get_method.id=srm_area_selected.shipping_method 
		where srm_area_selected.status=1 and 
<<<<<<< HEAD
		srm_area_selected.crm_id='".$attr['id']."' and ( srm_area_selected.company_id=" . $this->arrUser['company_id'] . " 
=======
		srm_area_selected.crm_id='" . $attr['id'] . "' and ( srm_area_selected.company_id=" . $this->arrUser['company_id'] . " 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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
        $up_id = $arr_attr['id'];

        $update_check = "";
        if ($up_id > 0)
            $update_check = "  AND tst.id <> " . $up_id . " ";

        $data_pass = "   tst.offered_by='" . $arr_attr['offered_by'] . "' and tst.shipping_quantity='" . $arr_attr['shipping_quantity'] . "'	and tst.price='" . $arr_attr['price'] . "'	and tst.crm_id='" . $arr_attr['crm_id'] . "'    $update_check";
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
										,date_added=UNIX_TIMESTAMP (NOW())";
            // }
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

<<<<<<< HEAD
//----------Rebate------------------------------------------
=======
    //----------Rebate------------------------------------------
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    function get_rebate_listings($attr)
    {


        /* global $objFilters;
          return $objFilters->get_module_listing(107, "srm_rebate",$attr[column],$attr[value]); */

        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = "";
<<<<<<< HEAD
        $where_clause = " AND crm_id = ".$attr['id']." AND rebt.company_id =" . $this->arrUser['company_id'];
=======
        $where_clause = " AND crm_id = " . $attr['id'] . " AND rebt.company_id =" . $this->arrUser['company_id'];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


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
		WHERE rebt.type!=0
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
								JOIN products as prd ON rbt.item_id = prd.id
								WHERE rbt.rebate_id = $Row[id]
								";
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
								WHERE rbt.rebate_id = $Row[id]
								";
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
<<<<<<< HEAD
            $response['total'] = $total;
=======
            $response['total'] = 0;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        } else {

            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_warehouse_rebate($attr)
    {

        // print_r($attr); 	exit;
        $id = $attr['id'];

        $update_check = "";
        if ($id > 0)
            $update_check = "  AND tst.id <> " . $id . " ";

        $data_pass = "   tst.price_offered='" . $attr['price_offered'] . "' and tst.universal_type='" . $attr['universal_type'] . "'
		and tst.offer_date='" . $this->objGeneral->convert_date($attr['offer_date']) . "'and tst.offer_date='" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "'
		and tst.crm_id='" . $attr['crm_id'] . "'   $update_check";
        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_rebate', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($id == 0) {


            $Sql = "INSERT INTO warehouse_rebate
<<<<<<< HEAD
SET crm_id = '$attr[crm_id]',type = '".$attr['type']."',item_type = '".$attr['item_type']."',category_type = '$attr[category_type]',universal_type = '$attr[universal_type]',price_offered = '$attr[price_offered]',volume_1 = '$attr[volume_1]',volume_2 = '$attr[volume_2]',volume_3 = '$attr[volume_3]',volume_rebate_1 = '$attr[volume_rebate_1]',volume_rebate_2 = '$attr[volume_rebate_2]',volume_rebate_3 = '$attr[volume_rebate_3]',revenue_1 = '$attr[revenue_1]',revenue_2 = '$attr[revenue_2]',revenue_3 = '$attr[revenue_3]',revenue_rebate_1 = '$attr[revenue_rebate_1]',revenue_rebate_2 = '$attr[revenue_rebate_2]',revenue_rebate_3 = '$attr[revenue_rebate_3]',created_date = NOW(),offer_valid_date = '" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "'
=======
SET crm_id = '" . $attr['crm_id'] . "',type = '" . $attr['type'] . "',item_type = '" . $attr['item_type'] . "',category_type = '$attr[category_type]',universal_type = '$attr[universal_type]',price_offered = '$attr[price_offered]',volume_1 = '$attr[volume_1]',volume_2 = '$attr[volume_2]',volume_3 = '$attr[volume_3]',volume_rebate_1 = '$attr[volume_rebate_1]',volume_rebate_2 = '$attr[volume_rebate_2]',volume_rebate_3 = '$attr[volume_rebate_3]',revenue_1 = '$attr[revenue_1]',revenue_2 = '$attr[revenue_2]',revenue_3 = '$attr[revenue_3]',revenue_rebate_1 = '$attr[revenue_rebate_1]',revenue_rebate_2 = '$attr[revenue_rebate_2]',revenue_rebate_3 = '$attr[revenue_rebate_3]',created_date = NOW(),offer_valid_date = '" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
,offer_date = '" . $this->objGeneral->convert_date($attr['offer_date']) . "',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
            if ($attr['type'] == 3)
                self::add_rebate_items($id, $attr['items'], 0);
            if ($attr['type'] == 2)
                self::add_rebate_categories($id, $attr['categories'], 0);
            // }
        } else {
            $Sql = "UPDATE warehouse_rebate
<<<<<<< HEAD
SET type = '".$attr['type']."',universal_type = '$attr[universal_type]',price_offered = '$attr[price_offered]',volume_1 = '$attr[volume_1]',volume_2 = '$attr[volume_2]',volume_3 = '$attr[volume_3]',volume_rebate_1 = '$attr[volume_rebate_1]',volume_rebate_2 = '$attr[volume_rebate_2]',volume_rebate_3 = '$attr[volume_rebate_3]',revenue_1 = '$attr[revenue_1]',revenue_2 = '$attr[revenue_2]',revenue_3 = '$attr[revenue_3]',revenue_rebate_1 = '$attr[revenue_rebate_1]',revenue_rebate_2 = '$attr[revenue_rebate_2]',revenue_rebate_3 = '$attr[revenue_rebate_3]',offer_date = '" . $this->objGeneral->convert_date($attr['offer_date']) . "',offer_valid_date = '" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "' WHERE id = " . $id . "   Limit 1";
=======
SET type = '" . $attr['type'] . "',universal_type = '$attr[universal_type]',price_offered = '$attr[price_offered]',volume_1 = '$attr[volume_1]',volume_2 = '$attr[volume_2]',volume_3 = '$attr[volume_3]',volume_rebate_1 = '$attr[volume_rebate_1]',volume_rebate_2 = '$attr[volume_rebate_2]',volume_rebate_3 = '$attr[volume_rebate_3]',revenue_1 = '$attr[revenue_1]',revenue_2 = '$attr[revenue_2]',revenue_3 = '$attr[revenue_3]',revenue_rebate_1 = '$attr[revenue_rebate_1]',revenue_rebate_2 = '$attr[revenue_rebate_2]',revenue_rebate_3 = '$attr[revenue_rebate_3]',offer_date = '" . $this->objGeneral->convert_date($attr['offer_date']) . "',offer_valid_date = '" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "' WHERE id = " . $id . "   Limit 1";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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

        $Sql = "SELECT item_id
				FROM warehouse_rebate_items
				WHERE rebate_id =" . $attr['rebate_id'];
        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['item_id'] = $Row['item_id'];
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
					SET rebate_id = " . $id . ",item_id = " . $item->id;
                $RS = $this->objsetup->CSI($Sql);
            }
        }
    }

<<<<<<< HEAD
//----------Rebate Volume Module----------------------------
=======
    //----------Rebate Volume Module----------------------------
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    function get_rebate_volumes($attr)
    {
        /* global $objFilters;
          return $objFilters->get_module_listing(106, "price_offer_volume"); */

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = "";
<<<<<<< HEAD
=======
        $where_clause = "";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

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
<<<<<<< HEAD
            $response['total'] = $total;
=======
            $response['total'] = 0;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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
<<<<<<< HEAD
				WHERE type='".$attr['type']."' AND company_id =" . $this->arrUser['company_id'];
=======
				WHERE type='" . $attr['type'] . "' AND company_id =" . $this->arrUser['company_id'];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


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
        $id = $arr_attr['id'];

        $update_check = "";

        if ($id > 0)
            $update_check = "  AND tst.id <> " . $id . " ";

        $data_pass = "   tst.name='" . $arr_attr['name'] . "'   $update_check";
        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_rebate_volume', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
        if ($id == 0) {

            $Sql = "INSERT INTO warehouse_rebate_volume SET
<<<<<<< HEAD
								SET name='".$arr_attr['name']."',description='$arr_attr[description]'
=======
								SET name='" . $arr_attr['name'] . "',description='" . $arr_attr['description'] . "'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
								,user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
            // }
        } else {
            $Sql = "UPDATE warehouse_rebate_volume
<<<<<<< HEAD
							SET name='".$arr_attr['name']."',description='$arr_attr[description]'
=======
							SET name='" . $arr_attr['name'] . "',description='" . $arr_attr['description'] . "'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
							WHERE id = " . $id . "   Limit 1";
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


    function getPurchaseStockforDebitNote($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";
<<<<<<< HEAD
        $response = array();                                  
        $where = "";
        
        $transitID = (isset($attr['transitID']) && $attr['transitID']!='')?$attr['transitID']:0;
        $order_id = (isset($attr['order_id']) && $attr['order_id']!='')?$attr['order_id']:0;


        if(isset($attr['purchaseInvoiceID']) && $attr['purchaseInvoiceID'] != '')
            $where .= " AND o.id = ".$attr['purchaseInvoiceID']." ";
=======
        $response = array();
        $where = "";

        $transitID = (isset($attr['transitID']) && $attr['transitID'] != '') ? $attr['transitID'] : 0;
        $order_id = (isset($attr['order_id']) && $attr['order_id'] != '') ? $attr['order_id'] : 0;


        if (isset($attr['purchaseInvoiceID']) && $attr['purchaseInvoiceID'] != '')
            $where .= " AND o.id = " . $attr['purchaseInvoiceID'] . " ";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        // ref_po_id is the warehouse allocation id to link back to its original id.

        //" . $transitID. "

        //'" . $transitID. "' -- AND sa.sale_status = 1
        $Sql = "(SELECT  o.id AS order_id, 
                        o.invoice_code, 
                        o.order_code,
                        o.invoice_date,  
                        wh_alloc.id, 
                        wh_alloc.quantity, 
                        wh_alloc.item_trace_unique_id, 
                        wh_alloc.product_id, 
                        wh_alloc.type, 
                        wh_alloc.location, 
                        wh_alloc.warehouse_id, 
                        wh_alloc.container_no, 
                        wh_alloc.batch_no, 
                        wh_alloc.prod_date, 
                        wh_alloc.date_received, 
                        wh_alloc.use_by_date,  
                        wh_info.name as wh_name, 
                        wh_info.wrh_code as wh_code,
                        
                        wh_alloc.quantity - COALESCE((SELECT SUM(sa.quantity) 
                                                      FROM warehouse_allocation sa
                                                      WHERE sa.item_trace_unique_id= wh_alloc.item_trace_unique_id AND 
                                                        sa.product_id = wh_alloc.product_id AND 
                                                        sa.warehouse_id=wh_alloc.warehouse_id AND
                                                        sa.type = 1 AND 
                                                        sa.purchase_return_status = 1 AND
                                                        sa.purchase_status IN (2, 3)  
                                                ),0) 
                                            + COALESCE((SELECT SUM(sa.quantity)
                                                        FROM warehouse_allocation AS sa  
                                                        WHERE sa.item_trace_unique_id= wh_alloc.item_trace_unique_id AND 
                                                              sa.product_id = wh_alloc.product_id AND 
                                                              sa.warehouse_id = wh_alloc.warehouse_id AND
                                                              sa.type =2 AND 
                                                              sa.sale_return_status = 1 AND
                                                              sa.sale_status IN (2, 3)),0)
                                            - COALESCE((SELECT SUM(sa.quantity) 
                                                        FROM warehouse_allocation sa
                                                        WHERE sa.item_trace_unique_id= wh_alloc.item_trace_unique_id AND 
                                                            sa.product_id = wh_alloc.product_id AND 
                                                            sa.warehouse_id=wh_alloc.warehouse_id AND
                                                            sa.type = 2 AND 
                                                            sa.sale_return_status = 0 AND
                                                            sa.sale_status >0 
                                                        ),0)
                                             - COALESCE((SELECT SUM(sa.quantity) 
                                                        FROM warehouse_allocation sa
                                                        WHERE sa.item_trace_unique_id= wh_alloc.item_trace_unique_id AND 
                                                            sa.product_id = wh_alloc.product_id AND 
                                                            sa.warehouse_id=wh_alloc.warehouse_id AND
                                                            sa.type = 5  AND
                                                            sa.ledger_type = 2 AND
                                                            sa.journal_status = 2 AND
                                                            sa.transfer_order_detail_id >0 
                                                        ),0) 
                                             - COALESCE((SELECT SUM(sa.quantity) 
                                                        FROM warehouse_allocation sa
                                                        WHERE sa.item_trace_unique_id= wh_alloc.item_trace_unique_id AND 
                                                            sa.product_id = wh_alloc.product_id AND 
                                                            sa.warehouse_id=wh_alloc.warehouse_id AND
                                                            sa.type = 3  AND
                                                            sa.ledger_type = 2 AND
                                                            sa.journal_status = 2
                                                        ),0)
                                             - COALESCE((SELECT SUM(sa.quantity) 
                                                        FROM warehouse_allocation sa
                                                        WHERE sa.item_trace_unique_id= wh_alloc.item_trace_unique_id AND 
                                                            sa.product_id = wh_alloc.product_id AND 
                                                            sa.warehouse_id=wh_alloc.warehouse_id AND
                                                            sa.type = 1  AND sa.purchase_return_status = 0 AND sa.raw_material_out = 1
                                                        ),0) AS avail_qty,  
                    
                        IFNULL(((SELECT SUM(sa.quantity) 
                                FROM warehouse_allocation sa
                                WHERE ((sa.type = 2 AND sa.sale_return_status = 0)OR 
                                        (sa.type = 1 AND sa.purchase_return_status = 1 AND sa.purchase_status IN (2, 3)) OR 
                                        (sa.type = 1 AND sa.purchase_return_status = 0 AND sa.raw_material_out = 1) OR 
                                        (sa.type = 3 AND sa.ledger_type = 2 AND sa.journal_status >0) OR 
                                        (sa.type = 5 AND sa.ledger_type = 2 AND sa.journal_status = 2)
                                        ) AND
                                      sa.ref_po_id = wh_alloc.id) - 
                                  (SELECT SUM(sa.quantity) 
                                   FROM warehouse_allocation sa
                                   WHERE sa.type = 2 AND sa.sale_return_status = 1 AND sa.sale_status IN (2, 3) AND sa.item_trace_unique_id= wh_alloc.item_trace_unique_id)  
                                ),0) AS qty_returned,

                        IFNULL((SELECT SUM(sa.quantity) 
                                FROM warehouse_allocation sa
                                WHERE sa.type = 1 AND 
                                      sa.purchase_return_status = 1 AND 
                                      sa.ref_po_id = wh_alloc.id  AND
<<<<<<< HEAD
                                      sa.order_id = '".$order_id."'  AND
=======
                                      sa.order_id = '" . $order_id . "'  AND
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                      sa.item_trace_unique_id= wh_alloc.item_trace_unique_id 
                                ),0) AS qty_currently_returned,
                                
                        prd_wrh_loc.warehouse_loc_id as storage_loc_id,
                        wrh_loc.title as location_title,
                        wrh_loc.bin_cost,
                        dim.title as dimtitle,
                        CASE  WHEN wrh_loc.cost_type_id = 1 THEN 'Fixed'
                              WHEN wrh_loc.cost_type_id = 2 THEN 'Daily'
                              WHEN wrh_loc.cost_type_id = 3 THEN 'Weekly'
                              WHEN wrh_loc.cost_type_id = 4 THEN 'Monthly'
                              WHEN wrh_loc.cost_type_id = 5 THEN 'Annually'
                              END AS cost_type
                FROM srm_invoice o
                LEFT JOIN srm_invoice_detail od ON od.invoice_id=o.id
                LEFT JOIN warehouse_allocation wh_alloc ON wh_alloc.order_id=o.id
                LEFT JOIN product_warehouse_location prd_wrh_loc ON prd_wrh_loc.id=wh_alloc.location
                LEFT JOIN warehouse_bin_location AS wrh_loc ON wrh_loc.id=prd_wrh_loc.warehouse_loc_id
                LEFT JOIN units_of_measure AS dim ON dim.id=wrh_loc.dimensions_id
                LEFT JOIN warehouse AS wh_info on wh_info.id = wh_alloc.warehouse_id
                WHERE   o.type IN (2,3) AND
                        o.id = '" . $attr['purchaseInvoiceID'] . "' AND
                        o.sell_to_cust_id = '" . $attr['supplierID'] . "' AND
                        wh_alloc.type = 1 AND
                        wh_alloc.warehouse_id = '" . $attr['warehouse_id'] . "' AND
                        wh_alloc.purchase_return_status = 0 AND
                        wh_alloc.purchase_status IN (2,3) AND
                        (wh_alloc.raw_material_out IS NULL OR wh_alloc.raw_material_out = 0) AND
                        wh_alloc.product_id = '" . $attr['item_id'] . "' AND
                        o.company_id = '" . $this->arrUser['company_id'] . "'
                group by wh_alloc.id)
                UNION ALL
                
                (SELECT  wh_alloc.order_id, 
                        tof.code AS invoice_code, 
                        '' AS order_code,
                        wh_alloc.date_received AS invoice_date,  
                        wh_alloc.id, 
                        wh_alloc.quantity, 
                        wh_alloc.item_trace_unique_id, 
                        wh_alloc.product_id, 
                        wh_alloc.type, 
                        wh_alloc.location, 
                        wh_alloc.warehouse_id, 
                        wh_alloc.container_no, 
                        wh_alloc.batch_no, 
                        wh_alloc.prod_date, 
                        wh_alloc.date_received, 
                        wh_alloc.use_by_date,  
                        wh_info.name AS wh_name, 
                        wh_info.wrh_code AS wh_code,
                        
                        wh_alloc.quantity - COALESCE((SELECT SUM(sa.quantity) 
                                                      FROM warehouse_allocation sa
                                                      WHERE sa.item_trace_unique_id= wh_alloc.item_trace_unique_id AND 
                                                        sa.product_id = wh_alloc.product_id AND 
                                                        sa.warehouse_id=wh_alloc.warehouse_id AND
                                                        sa.type = 1 AND 
                                                        sa.purchase_return_status = 1 AND
                                                        sa.purchase_status IN (2, 3)  
                                                ),0) 
                                            + COALESCE((SELECT SUM(sa.quantity)
                                                        FROM warehouse_allocation AS sa  
                                                        WHERE sa.item_trace_unique_id= wh_alloc.item_trace_unique_id AND 
                                                              sa.product_id = wh_alloc.product_id AND 
                                                              sa.warehouse_id = wh_alloc.warehouse_id AND
                                                              sa.type =2 AND 
                                                              sa.sale_return_status = 1 AND
                                                              sa.sale_status IN (2, 3)),0)
                                            - COALESCE((SELECT SUM(sa.quantity) 
                                                        FROM warehouse_allocation sa
                                                        WHERE sa.item_trace_unique_id= wh_alloc.item_trace_unique_id AND 
                                                            sa.product_id = wh_alloc.product_id AND 
                                                            sa.warehouse_id=wh_alloc.warehouse_id AND
                                                            sa.type = 2 AND 
                                                            sa.sale_return_status = 0 AND
                                                            sa.sale_status >0 
                                                        ),0)
                                            - COALESCE((SELECT SUM(sa.quantity) 
                                                        FROM warehouse_allocation sa
                                                        WHERE sa.item_trace_unique_id= wh_alloc.item_trace_unique_id AND 
                                                            sa.product_id = wh_alloc.product_id AND 
                                                            sa.warehouse_id=wh_alloc.warehouse_id AND
                                                            sa.type = 5  AND
                                                            sa.ledger_type = 2 AND
                                                            sa.journal_status = 2 AND
                                                            sa.transfer_order_detail_id >0 
                                                        ),0)
                                            - COALESCE((SELECT SUM(sa.quantity) 
                                                        FROM warehouse_allocation sa
                                                        WHERE sa.item_trace_unique_id= wh_alloc.item_trace_unique_id AND 
                                                            sa.product_id = wh_alloc.product_id AND 
                                                            sa.warehouse_id=wh_alloc.warehouse_id AND
                                                            sa.type = 3  AND
                                                            sa.ledger_type = 2 AND
                                                            sa.journal_status = 2
                                                        ),0)
                                            - COALESCE((SELECT SUM(sa.quantity) 
                                                      FROM warehouse_allocation sa
                                                      WHERE sa.item_trace_unique_id= wh_alloc.item_trace_unique_id AND 
                                                        sa.product_id = wh_alloc.product_id AND 
                                                        sa.warehouse_id=wh_alloc.warehouse_id AND
                                                        sa.type = 1 AND 
                                                        sa.purchase_return_status = 0 AND
                                                        sa.raw_material_out = 1 
                                                ),0) AS avail_qty,  
                    
                        IFNULL((SELECT SUM(sa.quantity) 
                                FROM warehouse_allocation sa
                                WHERE ((sa.type = 2 AND sa.sale_return_status = 0)OR 
                                        (sa.type = 1 AND sa.purchase_return_status = 1 AND sa.purchase_status IN (2, 3)) OR 
                                        (sa.type = 1 AND sa.purchase_return_status = 0 AND sa.raw_material_out = 1) OR 
                                        (sa.type = 3 AND sa.ledger_type = 2 AND sa.journal_status >0) OR 
                                        (sa.type = 5 AND sa.ledger_type = 2 AND sa.journal_status = 2)
                                        ) AND
                                      sa.ref_po_id = wh_alloc.id 
                                ),0) AS qty_returned,
                        IFNULL((SELECT SUM(sa.quantity) 
                                FROM warehouse_allocation sa
                                WHERE sa.type = 1 AND 
                                      sa.purchase_return_status = 1 AND 
                                      sa.ref_po_id = wh_alloc.id  AND
<<<<<<< HEAD
                                      sa.order_id = '".$order_id."'  AND
=======
                                      sa.order_id = '" . $order_id . "'  AND
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                      sa.item_trace_unique_id= wh_alloc.item_trace_unique_id 
                                ),0) AS qty_currently_returned,
                        prd_wrh_loc.warehouse_loc_id AS storage_loc_id,
                        wrh_loc.title AS location_title,
                        wrh_loc.bin_cost,
                        dim.title AS dimtitle,
                        CASE  WHEN wrh_loc.cost_type_id = 1 THEN 'Fixed'
                              WHEN wrh_loc.cost_type_id = 2 THEN 'Daily'
                              WHEN wrh_loc.cost_type_id = 3 THEN 'Weekly'
                              WHEN wrh_loc.cost_type_id = 4 THEN 'Monthly'
                              WHEN wrh_loc.cost_type_id = 5 THEN 'Annually'
                              END AS cost_type
                FROM warehouse_allocation wh_alloc 
                LEFT JOIN product_warehouse_location prd_wrh_loc ON prd_wrh_loc.id=wh_alloc.location
                LEFT JOIN warehouse_bin_location AS wrh_loc ON wrh_loc.id=prd_wrh_loc.warehouse_loc_id
                LEFT JOIN units_of_measure AS dim ON dim.id=wrh_loc.dimensions_id
                LEFT JOIN warehouse AS wh_info ON wh_info.id = wh_alloc.warehouse_id
                LEFT JOIN transfer_orders AS tof ON wh_alloc.order_id = tof.id
                WHERE  wh_alloc.type = 5 AND
                        wh_alloc.warehouse_id = '" . $attr['warehouse_id'] . "' AND
                        wh_alloc.purchase_return_status = 0 AND
                        wh_alloc.purchase_status IN (1) AND
                        wh_alloc.ledger_type = 1 AND
                        wh_alloc.journal_status = 2 AND
                        wh_alloc.item_trace_unique_id IN (SELECT item_trace_unique_id 
                                                          FROM warehouse_allocation 
                                                          WHERE order_id = '" . $attr['purchaseInvoiceID'] . "' AND 
                                                                purchase_order_detail_id = '" . $attr['purchaseInvoiceDetailID'] . "') AND 
                        wh_alloc.product_id = '" . $attr['item_id'] . "' AND
                        wh_alloc.company_id = '" . $this->arrUser['company_id'] . "'
                GROUP BY wh_alloc.id)";

        // echo $Sql;exit; 

        /* 
        
        QTY Returned
        
        sa.type = 1 AND 
                                      sa.purchase_return_status = 1 AND
                                      sa.purchase_status IN (2, 3)  AND AND
                                      sa.item_trace_unique_id= '" . $transitID . "'
                                      
                                       */

        /* 
                        wh_alloc.quantity - IFNULL((SELECT SUM(sa.quantity) 
                                                FROM warehouse_allocation sa
                                                WHERE sa.type = 1 AND 
                                                    sa.purchase_return_status = 1 AND
                                                    sa.purchase_status IN (2, 3)  AND
                                                    sa.ref_po_id = wh_alloc.id  AND
                                                    sa.item_trace_unique_id= '" . $transitID . "'
                                                ),0) - 
                                        IFNULL((SELECT SUM(sa.quantity) 
                                                FROM warehouse_allocation sa
                                                WHERE sa.type = 2 AND 
                                                    sa.sale_return_status = 0 AND
                                                    sa.sale_status IN (2, 3)  AND
                                                    sa.ref_po_id = wh_alloc.id  AND
                                                    sa.item_trace_unique_id= '" . $transitID . "'
                                                ),0) AS avail_qty,  */
        // GROUP BY sa.container_no

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
<<<<<<< HEAD
            while ($Row = $RS->FetchRow()) {                 

                if(intval($Row['qty_returned']) < intval($Row['quantity']) || 1)
                {
=======
            while ($Row = $RS->FetchRow()) {

                if (intval($Row['qty_returned']) < intval($Row['quantity']) || 1) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $result = array();
                    $result['id']               = $Row['id'];
                    $result['invoice_code']     = $Row['invoice_code'];
                    $result['order_code']       = $Row['order_code'];
                    $result['avail_qty']        = $Row['avail_qty'];
                    $result['avail_qty2']        = $Row['avail_qty2'];
                    // $result['qty_purchase']     = $Row['qty_purchase'];
                    $result['qty_purchase']     = $Row['quantity'];
                    $result['qty_returned']     = $Row['qty_returned'];
<<<<<<< HEAD
                    $result['qty_currently_returned']     = $Row['qty_currently_returned']; 

                    $result['invoice_date']     = $this->objGeneral->convert_unix_into_date($Row['invoice_date']);
                    
=======
                    $result['qty_currently_returned']     = $Row['qty_currently_returned'];

                    $result['invoice_date']     = $this->objGeneral->convert_unix_into_date($Row['invoice_date']);

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $result['order_id']         = $Row['order_id'];
                    $result['type']             = $Row['type'];
                    $result['WH_loc_id']        = $Row['location'];
                    $result['storage_loc_id']   = $Row['storage_loc_id'];
                    $result['warehouse_id']     = $Row['warehouse_id'];
                    $result['item_trace_unique_id'] = $Row['item_trace_unique_id'];
<<<<<<< HEAD
                    $result['warehouse_name']   = $Row['wh_code']."- ".$Row['wh_name'];
                    
=======
                    $result['warehouse_name']   = $Row['wh_code'] . "- " . $Row['wh_name'];

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $result['product_id']       = $Row['product_id'];
                    $result['location']         = $Row['location_title'] . " ( " . $Row['bin_cost'] . ", " . $Row['dimtitle'] . ", " . $Row['cost_type'] . ")";
                    $result['container_no']     = $Row['container_no'];
                    $result['batch_no']         = $Row['batch_no'];
                    $result['prod_date']        = $this->objGeneral->convert_unix_into_date($Row['prod_date']);
                    $result['date_received']    = $this->objGeneral->convert_unix_into_date($Row['date_received']);
                    $result['use_by_date']      = $this->objGeneral->convert_unix_into_date($Row['use_by_date']);

                    $response['response'][] = $result;
<<<<<<< HEAD
                } 
            }            
            
            // $sql2= "SELECT SR_CURRENT_STOCK('" . $attr['item_id'] . "','" . $this->arrUser['company_id'] . "')";
            
            $sql2= "SELECT SR_CURRENT_OR_AVAILABLE_STOCK('" . $attr['item_id'] . "','" . $this->arrUser['company_id'] . "',1)";
=======
                }
            }

            // $sql2= "SELECT SR_CURRENT_STOCK('" . $attr['item_id'] . "','" . $this->arrUser['company_id'] . "')";

            $sql2 = "SELECT SR_CURRENT_OR_AVAILABLE_STOCK('" . $attr['item_id'] . "','" . $this->arrUser['company_id'] . "',1)";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $stock = $this->objsetup->CSI($sql2);
            $response['currentStock'] = $stock->fields[0];

            $response['ack'] = 1;
            $response['error'] = NULL;
<<<<<<< HEAD
            $response['total'] = $total;
=======
            $response['total'] = 0;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function getPurchaseStockPositive($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";

        $response = array();
        $where = "";
        $having = "";

<<<<<<< HEAD
        $sale_order_detail_id = (isset($attr['sale_order_detail_id']) && $attr['sale_order_detail_id']!='')?$attr['sale_order_detail_id']:0;
        $warehouse_id = (isset($attr['warehouse_id']) && $attr['warehouse_id']!='')?$attr['warehouse_id']:0;
        $item_id = (isset($attr['item_id']) && $attr['item_id']!='')?$attr['item_id']:0;
        $order_id = (isset($attr['order_id']) && $attr['order_id']!='')?$attr['order_id']:0;


        if(isset($attr['isInvoice']) && $attr['isInvoice'] == 1)
        {
=======
        $sale_order_detail_id = (isset($attr['sale_order_detail_id']) && $attr['sale_order_detail_id'] != '') ? $attr['sale_order_detail_id'] : 0;
        $warehouse_id = (isset($attr['warehouse_id']) && $attr['warehouse_id'] != '') ? $attr['warehouse_id'] : 0;
        $item_id = (isset($attr['item_id']) && $attr['item_id'] != '') ? $attr['item_id'] : 0;
        $order_id = (isset($attr['order_id']) && $attr['order_id'] != '') ? $attr['order_id'] : 0;


        if (isset($attr['isInvoice']) && $attr['isInvoice'] == 1) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $where = "(SELECT IFNULL(SUM(sa.quantity), 0) 
                        FROM warehouse_allocation sa
                        WHERE sa.warehouse_id = '" . $warehouse_id . "' AND 
                                sa.type = 2 AND sa.sale_return_status = 0 AND
                                sa.product_id = '" . $item_id . "' AND 
                                sa.order_id = '" . $order_id . "' AND 
<<<<<<< HEAD
                                sa.sale_order_detail_id = '".$sale_order_detail_id."' AND 
                                wh_alloc.id = sa.ref_po_id AND
                                sa.company_id='" . $this->arrUser['company_id'] . "' ) > 0 AND ";
        }
        else if(isset($attr['isLedgerInvoice']) && $attr['isLedgerInvoice'] == 1)
        {
=======
                                sa.sale_order_detail_id = '" . $sale_order_detail_id . "' AND 
                                wh_alloc.id = sa.ref_po_id AND
                                sa.company_id='" . $this->arrUser['company_id'] . "' ) > 0 AND ";
        } else if (isset($attr['isLedgerInvoice']) && $attr['isLedgerInvoice'] == 1) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $where = "(SELECT IFNULL(SUM(sa.quantity), 0) 
                        FROM warehouse_allocation sa
                        WHERE sa.warehouse_id = '" . $warehouse_id . "' AND 
                                sa.type IN (2,3) AND 
                                sa.sale_return_status = 0 AND
                                sa.product_id = '" . $item_id . "' AND 
                                sa.order_id = '" . $order_id . "' AND 
<<<<<<< HEAD
                                (sa.sale_order_detail_id = '".$sale_order_detail_id."' OR 
                                 sa.sale_order_detail_id IS NULL) AND 
                                wh_alloc.id = sa.id AND
                                sa.company_id='" . $this->arrUser['company_id'] . "' ) > 0 AND ";
        }
        else
        {
            $having = " HAVING sold_qty < total_qty ";
        }
        
=======
                                (sa.sale_order_detail_id = '" . $sale_order_detail_id . "' OR 
                                 sa.sale_order_detail_id IS NULL) AND 
                                wh_alloc.id = sa.id AND
                                sa.company_id='" . $this->arrUser['company_id'] . "' ) > 0 AND ";
        } else {
            $having = " HAVING sold_qty < total_qty ";
        }

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $Sql = "SELECT SUM(quantity) AS total_qty,
                       SUM(quantity) - IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                                               WHERE sa.warehouse_id = '" . $warehouse_id . "' AND 
                                                    (
                                                        (sa.type = 2 AND sa.sale_return_status = 0) OR 
                                                        (sa.type = 1 AND sa.purchase_return_status = 1) OR 
                                                        (sa.type = 1 AND sa.purchase_return_status = 0 AND sa.raw_material_out = 1) OR  
                                                        (sa.type = 3 AND sa.ledger_type = 2)
                                                    ) AND
                                                     sa.product_id = '" . $item_id . "' AND wh_alloc.id = sa.ref_po_id AND
                                                     sa.company_id='" . $this->arrUser['company_id'] . "'
                                               ),0) AS avail_qty,                        

                       IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                               WHERE sa.warehouse_id = '" . $warehouse_id . "' AND 
                                     (
                                         (sa.type = 2 AND sa.sale_return_status = 0 AND sa.sale_status = 1) OR
                                         (sa.type = 3 AND sa.ledger_type = 2 AND sa.journal_status = 1)
                                     ) AND
                                     sa.product_id = '" . $item_id . "' AND wh_alloc.id = sa.ref_po_id AND
                                     sa.company_id='" . $this->arrUser['company_id'] . "'
                               ),0) AS allocated_qty,
                        IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                               WHERE sa.warehouse_id = '" . $warehouse_id . "' AND 
                                     (
                                         (sa.type = 2 AND sa.sale_return_status = 0 AND sa.sale_status IN (2, 3)) OR
                                         (sa.type = 1 AND sa.purchase_return_status = 1) OR 
                                         (sa.type = 1 AND sa.purchase_return_status = 0 AND sa.raw_material_out = 1) OR 
                                         (sa.type = 3 AND sa.ledger_type = 2 AND sa.journal_status = 2)                                         
                                     ) AND
                                     sa.product_id = '" . $item_id . "' AND wh_alloc.id = sa.ref_po_id AND
                                     sa.company_id='" . $this->arrUser['company_id'] . "'
                               ),0) AS sold_qty,
                        IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                               WHERE sa.warehouse_id = '" . $warehouse_id . "' AND sa.type = 2 AND sa.sale_return_status = 0 AND
                                     sa.product_id = '" . $item_id . "' AND 
                                     sa.order_id = '" . $order_id . "' AND 
<<<<<<< HEAD
                                     sa.sale_order_detail_id = '".$sale_order_detail_id."'
=======
                                     sa.sale_order_detail_id = '" . $sale_order_detail_id . "'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                     AND wh_alloc.id = sa.ref_po_id AND
                                     sa.company_id='" . $this->arrUser['company_id'] . "'
                               ),0) AS currently_allocated_qty,
                        IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                            WHERE sa.type = 2 AND sa.sale_return_status = 1 AND
                                sa.ref_po_id = wh_alloc.id AND
                                sa.sale_status IN (2, 3)  AND sa.product_id = '" . $item_id . "' AND wh_alloc.container_no = sa.container_no AND
                                sa.company_id= '" . $this->arrUser['company_id'] . "' 
                            ),0) AS qty_returned,
                       wh_alloc.*,
                       prd_wrh_loc.warehouse_loc_id AS storage_loc_id,
                       wrh_loc.title AS location_title,
                       wrh_loc.bin_cost,
                       dim.title AS dimtitle,
                       CASE  WHEN wrh_loc.cost_type_id = 1 THEN 'Fixed'
                              WHEN wrh_loc.cost_type_id = 2 THEN 'Daily'
                              WHEN wrh_loc.cost_type_id = 3 THEN 'Weekly'
                              WHEN wrh_loc.cost_type_id = 4 THEN 'Monthly'
                              WHEN wrh_loc.cost_type_id = 5 THEN 'Annually'
                              END AS cost_type
                FROM warehouse_allocation AS wh_alloc
                LEFT JOIN product_warehouse_location AS prd_wrh_loc ON prd_wrh_loc.id=wh_alloc.location
                LEFT JOIN warehouse_bin_location AS wrh_loc ON wrh_loc.id=prd_wrh_loc.warehouse_loc_id
                LEFT JOIN units_of_measure AS dim ON dim.id=wrh_loc.dimensions_id
				WHERE 
                    (
                        (wh_alloc.type = 1 AND wh_alloc.purchase_status IN (2,3) AND wh_alloc.purchase_return_status = 0 AND (wh_alloc.raw_material_out IS NULL OR wh_alloc.raw_material_out = 0)) OR
                        (wh_alloc.type = 2 AND wh_alloc.sale_status IN (2,3) AND wh_alloc.sale_return_status = 1) OR
                        (wh_alloc.type = 3 AND wh_alloc.ledger_type = 1 AND wh_alloc.journal_status = 2) 
                    ) AND 
                    wh_alloc.status = 1 AND
                    wh_alloc.product_id = '" . $item_id . "' AND wh_alloc.warehouse_id = '" . $warehouse_id . "' AND
                    $where
                    (wh_alloc.company_id='" . $this->arrUser['company_id'] . "' )
				GROUP BY wh_alloc.id
				$having

		    UNION

			SELECT SUM(quantity) AS total_qty,
                    SUM(quantity) - IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                                               WHERE sa.warehouse_id = '" . $warehouse_id . "' AND (
                                                        (sa.type = 2 AND sa.sale_return_status = 0) OR 
                                                        (sa.type = 1 AND sa.purchase_return_status = 1) OR 
                                                        (sa.type = 1 AND sa.purchase_return_status = 0 AND sa.raw_material_out = 1) OR 
                                                        (sa.type = 3 AND sa.ledger_type = 2)
                                                    ) AND
                                                     sa.product_id = '" . $item_id . "' AND wh_alloc.id = sa.ref_po_id AND
                                                     sa.company_id='" . $this->arrUser['company_id'] . "'
                                               ),0) AS avail_qty,                    
					
				    IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
					       WHERE sa.warehouse_id = '" . $warehouse_id . "' AND 
                             (
                                 (sa.type = 2 AND sa.sale_return_status = 0 AND sa.sale_status = 1) OR
                                 (sa.type = 3 AND sa.ledger_type = 2 AND sa.journal_status = 1)
                            ) AND
						     sa.product_id = '" . $item_id . "' AND wh_alloc.id = sa.ref_po_id AND
						     sa.company_id='" . $this->arrUser['company_id'] . "' 
					       ),0) AS allocated_qty,
					IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
					       WHERE sa.warehouse_id = '" . $warehouse_id . "' AND 
                             (
                                 (sa.type = 2 AND sa.sale_return_status = 0 AND sa.sale_status IN (2, 3) ) OR
                                 (sa.type = 1 AND sa.purchase_return_status = 1) OR
                                 (sa.type = 1 AND sa.purchase_return_status = 0 AND sa.raw_material_out = 1) OR 
                                 (sa.type = 3 AND sa.ledger_type = 2 AND sa.journal_status =2)
                             ) AND
						     sa.product_id = '" . $item_id . "' AND wh_alloc.id = sa.ref_po_id AND
						     sa.company_id='" . $this->arrUser['company_id'] . "' 
					       ),0) AS sold_qty,
					IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
					       WHERE sa.warehouse_id = '" . $warehouse_id . "' AND sa.type = 2 AND sa.sale_return_status = 0 AND
<<<<<<< HEAD
						     sa.product_id = '" . $item_id . "' AND sa.order_id = '" . $order_id . "' AND sa.sale_order_detail_id = '".$sale_order_detail_id."'
=======
						     sa.product_id = '" . $item_id . "' AND sa.order_id = '" . $order_id . "' AND sa.sale_order_detail_id = '" . $sale_order_detail_id . "'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
						     AND wh_alloc.id = sa.ref_po_id AND
						     sa.company_id='" . $this->arrUser['company_id'] . "'
					       ),0) AS currently_allocated_qty,
                    IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                            WHERE sa.type = 2 AND sa.sale_return_status = 1 AND
                                sa.sale_status IN (2, 3)  AND sa.product_id = '" . $item_id . "' AND wh_alloc.container_no = sa.container_no AND
                                sa.company_id= '" . $this->arrUser['company_id'] . "'
                            ),0) AS qty_returned,
				wh_alloc.*,
				prd_wrh_loc.warehouse_loc_id AS storage_loc_id,wrh_loc.title AS location_title,wrh_loc.bin_cost,dim.title AS dimtitle,
			       CASE  WHEN wrh_loc.cost_type_id = 1 THEN 'Fixed'
				      WHEN wrh_loc.cost_type_id = 2 THEN 'Daily'
				      WHEN wrh_loc.cost_type_id = 3 THEN 'Weekly'
				      WHEN wrh_loc.cost_type_id = 4 THEN 'Monthly'
				      WHEN wrh_loc.cost_type_id = 5 THEN 'Annually'
				      END AS cost_type
				FROM `warehouse_allocation` wh_alloc
				LEFT JOIN `opening_balance_stock` AS op_bal_stk ON `op_bal_stk`.id = `wh_alloc`.`opBalncID` 
				LEFT JOIN product_warehouse_location AS prd_wrh_loc ON prd_wrh_loc.id=wh_alloc.location
				LEFT JOIN warehouse_bin_location AS wrh_loc ON wrh_loc.id=prd_wrh_loc.warehouse_loc_id
				LEFT JOIN units_of_measure AS dim ON dim.id=wrh_loc.dimensions_id
				WHERE 
<<<<<<< HEAD
					`wh_alloc`.`product_id`='" .$item_id . "' AND
=======
					`wh_alloc`.`product_id`='" . $item_id . "' AND
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    wh_alloc.status = 1 AND
					`wh_alloc`.type = 4 AND 
                    wh_alloc.product_id = '" . $item_id . "' AND 
                    wh_alloc.warehouse_id = '" . $warehouse_id . "' AND
                    $where
                    (wh_alloc.company_id='" . $this->arrUser['company_id'] . "' )
				GROUP BY wh_alloc.id
                $having 
        ";

        /* 
        ((CASE  WHEN wh_alloc.type=1 THEN SR_STOCK_RAW_MATERIAL_FIFO('" . $item_id . "',wh_alloc.order_id,1,'" . $this->arrUser['company_id'] . "')
                                WHEN wh_alloc.type=2 THEN SR_STOCK_RAW_MATERIAL_FIFO('" .$item_id . "',wh_alloc.order_id,2,'" . $this->arrUser['company_id'] . "')
                                WHEN wh_alloc.type=3 THEN SR_STOCK_RAW_MATERIAL_FIFO('" . $item_id. "',wh_alloc.order_id,4,'" . $this->arrUser['company_id'] . "')
                                WHEN wh_alloc.type=4 THEN SR_STOCK_RAW_MATERIAL_FIFO('" . $item_id. "',wh_alloc.order_id,3,'" . $this->arrUser['company_id'] . "')
                                ELSE 0
                                END ) - IFNULL((SELECT SUM(sa.quantity) 
                                                FROM warehouse_allocation sa 
                                                WHERE sa.warehouse_id = '" . $warehouse_id . "' AND 
                                                    ( (sa.type = 2 AND sa.sale_return_status = 0 AND sa.sale_status = 1) OR (sa.type = 3 AND sa.ledger_type = 2 AND sa.journal_status = 1) ) AND 
                                                    sa.product_id = '" . $item_id . "' AND 
                                                    sa.ref_po_id = wh_alloc.id AND 
                                                    sa.company_id='" . $this->arrUser['company_id'] . "' ),0)) AS avail_qty,
        ======================


        (SR_STOCK_RAW_MATERIAL_FIFO('" . $item_id . "',wh_alloc.order_id,3,'" . $this->arrUser['company_id'] . "') - IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa WHERE sa.warehouse_id = '" . $warehouse_id . "' AND ( (sa.type = 2 AND sa.sale_return_status = 0 AND sa.sale_status = 1) OR (sa.type = 3 AND sa.ledger_type = 2 AND sa.journal_status = 1) ) AND sa.product_id = '" . $item_id. "' AND wh_alloc.id = sa.ref_po_id AND sa.company_id='" . $this->arrUser['company_id'] . "' ),0)) AS avail_qty,        
         */

        /* -- `op_bal_stk`.`allocated_qty` < `op_bal_stk`.qty AND */
        // echo $Sql;exit; 
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                // if($Row['sold_qty'] < $Row['total_qty'] || $attr['isInvoice'] == 1)
                {
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['order_id'] = $Row['order_id'];
                    $result['type']     = $Row['type'];
                    $result['WH_loc_id'] = $Row['location'];
                    $result['storage_loc_id'] = $Row['storage_loc_id'];
                    $result['warehouse_id'] = $Row['warehouse_id'];
                    $result['product_id'] = $Row['product_id'];
                    $result['location'] = $Row['location_title'] . " ( " . $Row['bin_cost'] . ", " . $Row['dimtitle'] . ", " . $Row['cost_type'] . ")";
                    $result['container_no'] = $Row['container_no'];
                    $result['consignment_no'] = $Row['consignment_no'];
<<<<<<< HEAD
                    
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $result['batch_no'] = $Row['batch_no'];
                    $result['prod_date'] = $this->objGeneral->convert_unix_into_date($Row['prod_date']);
                    $result['date_received'] = $this->objGeneral->convert_unix_into_date($Row['date_received']);
                    $result['use_by_date'] = $this->objGeneral->convert_unix_into_date($Row['use_by_date']);
                    $result['total_qty'] = $Row['total_qty'];
<<<<<<< HEAD
                    $result['sold_qty'] = $Row['sold_qty'];// - $Row['qty_returned'];
                    
=======
                    $result['sold_qty'] = $Row['sold_qty']; // - $Row['qty_returned'];

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $result['qty_returned'] = $Row['qty_returned'];
                    $result['allocated_qty'] = $Row['allocated_qty'];
                    $result['avail_qty'] = $Row['avail_qty'];
                    $result['currently_allocated_qty'] = $Row['currently_allocated_qty'];
                    // $result['bl_shipment_no'] = $Row['bl_shipment_no'];
                    $result['item_trace_unique_id'] = $Row['item_trace_unique_id'];
                    $result['opBalncID'] = $Row['opBalncID'];
                    $result['sale_return_status'] = $Row['sale_return_status'];
<<<<<<< HEAD
                    
                    $response['response'][] = $result; 
=======

                    $response['response'][] = $result;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                }
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
<<<<<<< HEAD
            $response['total'] = $total;
=======
            $response['total'] = 0;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }
<<<<<<< HEAD
    
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    function get_purchase_stock($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";

        $response = array();
        $where = "";
        $op_where = "";
        $having = "";

<<<<<<< HEAD
        $sale_order_detail_id = (isset($attr['sale_order_detail_id']) && $attr['sale_order_detail_id']!='')?$attr['sale_order_detail_id']:0;
        $warehouse_id = (isset($attr['warehouse_id']) && $attr['warehouse_id']!='')?$attr['warehouse_id']:0;
        $item_id = (isset($attr['item_id']) && $attr['item_id']!='')?$attr['item_id']:0;
        $order_id = (isset($attr['order_id']) && $attr['order_id']!='')?$attr['order_id']:0;

        if(isset($attr['isInvoice']) && $attr['isInvoice'] == 1)
        {
=======
        $sale_order_detail_id = (isset($attr['sale_order_detail_id']) && $attr['sale_order_detail_id'] != '') ? $attr['sale_order_detail_id'] : 0;
        $warehouse_id = (isset($attr['warehouse_id']) && $attr['warehouse_id'] != '') ? $attr['warehouse_id'] : 0;
        $item_id = (isset($attr['item_id']) && $attr['item_id'] != '') ? $attr['item_id'] : 0;
        $order_id = (isset($attr['order_id']) && $attr['order_id'] != '') ? $attr['order_id'] : 0;

        if (isset($attr['isInvoice']) && $attr['isInvoice'] == 1) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $where = "(SELECT IFNULL(SUM(sa.quantity), 0) 
                        FROM warehouse_allocation sa
                        WHERE sa.warehouse_id = '" . $warehouse_id . "' AND 
                                sa.type = 2 AND sa.sale_return_status = 0 AND
                                sa.product_id = '" . $item_id . "' AND 
                                sa.order_id = '" . $order_id . "' AND 
<<<<<<< HEAD
                                sa.sale_order_detail_id = '".$sale_order_detail_id."' AND 
                                wh_alloc.id = sa.ref_po_id AND
                                sa.company_id='" . $this->arrUser['company_id'] . "' ) > 0 AND ";
        }
        else
        {
=======
                                sa.sale_order_detail_id = '" . $sale_order_detail_id . "' AND 
                                wh_alloc.id = sa.ref_po_id AND
                                sa.company_id='" . $this->arrUser['company_id'] . "' ) > 0 AND ";
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            // $op_where = "op_bal_stk.allocated_qty < op_bal_stk.qty AND ";
            $having = " HAVING sold_qty < total_qty ";
        }
        // ((sa.type = 2 AND sa.sale_return_status = 0 AND sa.sale_status = 1) OR (sa.type = 1 AND sa.purchase_return_status = 1 AND sa.purchase_status =1))
        $Sql = "SELECT SUM(quantity) AS total_qty,
                       SUM(quantity) - IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                                               WHERE sa.warehouse_id = '" . $warehouse_id . "' AND 
                                                    (
                                                        (sa.type = 2 AND sa.sale_return_status = 0) OR 
                                                        (sa.type = 1 AND sa.purchase_return_status = 1) OR  
                                                        (sa.type = 1 AND sa.purchase_return_status = 0 AND sa.raw_material_out = 1) OR 
                                                        (sa.type = 3 AND sa.ledger_type = 2) OR 
                                                        (sa.type = 5 AND sa.ledger_type = 2)
                                                    ) AND
                                                     sa.product_id = '" . $item_id . "' AND wh_alloc.id = sa.ref_po_id AND
                                                     sa.company_id='" . $this->arrUser['company_id'] . "'
                                               ),0) AS avail_qty,
                       IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                               WHERE sa.warehouse_id = '" . $warehouse_id . "' AND 
                                     (
                                         (sa.type = 2 AND sa.sale_return_status = 0 AND sa.sale_status = 1) OR
                                         (sa.type = 3 AND sa.ledger_type = 2 AND sa.journal_status = 1) OR
                                         (sa.type = 5 AND sa.ledger_type = 2 AND sa.journal_status = 1)
                                     ) AND
                                     sa.product_id = '" . $item_id . "' AND wh_alloc.id = sa.ref_po_id AND
                                     sa.company_id='" . $this->arrUser['company_id'] . "'
                               ),0) AS allocated_qty,
                        IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                               WHERE sa.warehouse_id = '" . $warehouse_id . "' AND 
                                     (
                                         (sa.type = 1 AND sa.purchase_return_status = 1 AND sa.purchase_status IN (2, 3)) OR
                                         (sa.type = 1 AND sa.purchase_return_status = 0 AND sa.raw_material_out = 1) OR 
                                         (sa.type = 2 AND sa.sale_return_status = 0 AND sa.sale_status IN (2, 3)) OR
                                         (sa.type = 3 AND sa.ledger_type = 2 AND sa.journal_status = 2) OR
                                         (sa.type = 5 AND sa.ledger_type = 2 AND sa.journal_status = 2)                                         
                                     ) AND
                                     sa.product_id = '" . $item_id . "' AND wh_alloc.id = sa.ref_po_id AND
                                     sa.company_id='" . $this->arrUser['company_id'] . "'
                               ),0) AS sold_qty,
                        IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                               WHERE sa.warehouse_id = '" . $warehouse_id . "' AND sa.type = 2 AND sa.sale_return_status = 0 AND
<<<<<<< HEAD
                                     sa.product_id = '" . $item_id . "' AND sa.order_id = '" . $order_id . "' AND sa.sale_order_detail_id = '".$sale_order_detail_id."'
=======
                                     sa.product_id = '" . $item_id . "' AND sa.order_id = '" . $order_id . "' AND sa.sale_order_detail_id = '" . $sale_order_detail_id . "'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                     AND wh_alloc.id = sa.ref_po_id AND
                                     sa.company_id='" . $this->arrUser['company_id'] . "'
                               ),0) AS currently_allocated_qty,
                        IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                            WHERE sa.type = 2 AND sa.sale_return_status = 1 AND
                                sa.ref_po_id = wh_alloc.id AND
                                sa.sale_status IN (2, 3)  AND sa.product_id = '" . $item_id . "' AND wh_alloc.container_no = sa.container_no AND
                                sa.company_id= '" . $this->arrUser['company_id'] . "' 
                            ),0) AS qty_returned,
                       wh_alloc.*,prd_wrh_loc.warehouse_loc_id AS storage_loc_id,wrh_loc.title AS location_title,wrh_loc.bin_cost,dim.title AS dimtitle,
                       CASE  WHEN wrh_loc.cost_type_id = 1 THEN 'Fixed'
                              WHEN wrh_loc.cost_type_id = 2 THEN 'Daily'
                              WHEN wrh_loc.cost_type_id = 3 THEN 'Weekly'
                              WHEN wrh_loc.cost_type_id = 4 THEN 'Monthly'
                              WHEN wrh_loc.cost_type_id = 5 THEN 'Annually'
                              END AS cost_type
                FROM warehouse_allocation AS wh_alloc
                LEFT JOIN product_warehouse_location AS prd_wrh_loc ON prd_wrh_loc.id=wh_alloc.location
                LEFT JOIN warehouse_bin_location AS wrh_loc ON wrh_loc.id=prd_wrh_loc.warehouse_loc_id
                LEFT JOIN units_of_measure AS dim ON dim.id=wrh_loc.dimensions_id
				WHERE 
                (
                    (wh_alloc.type = 1 AND wh_alloc.purchase_status IN (2,3) AND wh_alloc.purchase_return_status = 0 AND (wh_alloc.raw_material_out IS NULL OR wh_alloc.raw_material_out = 0) ) OR
                    (wh_alloc.type = 2 AND wh_alloc.sale_status IN (2,3) AND wh_alloc.sale_return_status = 1) OR
                    (wh_alloc.type = 3 AND wh_alloc.ledger_type = 1 AND wh_alloc.journal_status = 2) OR
                    (wh_alloc.type = 5 AND wh_alloc.ledger_type = 1 AND wh_alloc.journal_status = 2) 
				)
				AND wh_alloc.status = 1 AND
                wh_alloc.product_id = '" . $item_id . "' AND wh_alloc.warehouse_id = '" . $warehouse_id . "' AND
                $where
                (wh_alloc.company_id='" . $this->arrUser['company_id'] . "' )
				GROUP BY wh_alloc.id
				$having

		UNION

			SELECT SUM(quantity) AS total_qty,
					SUM(quantity) - IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                                               WHERE sa.warehouse_id = '" . $warehouse_id . "' AND (
                                                        (sa.type = 2 AND sa.sale_return_status = 0) OR 
                                                        (sa.type = 1 AND sa.purchase_return_status = 1) OR 
                                                        (sa.type = 1 AND sa.purchase_return_status = 0 AND sa.raw_material_out = 1) OR 
                                                        (sa.type = 3 AND sa.ledger_type = 2) OR 
                                                        (sa.type = 5 AND sa.ledger_type = 2)
                                                    ) AND
                                                     sa.product_id = '" . $item_id . "' AND wh_alloc.id = sa.ref_po_id AND
                                                     sa.company_id='" . $this->arrUser['company_id'] . "'
                                               ),0) AS avail_qty,
				       IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
					       WHERE sa.warehouse_id = '" . $warehouse_id . "' AND 
                             (
                                 (sa.type = 2 AND sa.sale_return_status = 0 AND sa.sale_status = 1) OR
                                 (sa.type = 3 AND sa.ledger_type = 2 AND sa.journal_status = 1) OR
                                 (sa.type = 5 AND sa.ledger_type = 2 AND sa.journal_status = 1)
                            ) AND
						     sa.product_id = '" . $item_id . "' AND wh_alloc.id = sa.ref_po_id AND
						     sa.company_id='" . $this->arrUser['company_id'] . "' 
					       ),0) AS allocated_qty,
					IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
					       WHERE sa.warehouse_id = '" . $warehouse_id . "' AND 
                             (
                                 (sa.type = 1 AND sa.purchase_return_status = 1 AND sa.purchase_status IN (2, 3)) OR
                                 (sa.type = 1 AND sa.purchase_return_status = 0 AND sa.raw_material_out = 1) OR 
                                 (sa.type = 2 AND sa.sale_return_status = 0 AND sa.sale_status IN (2, 3) ) OR
                                 (sa.type = 3 AND sa.ledger_type = 2 AND sa.journal_status =2) OR
                                 (sa.type = 5 AND sa.ledger_type = 2 AND sa.journal_status =2)
                             ) AND
						     sa.product_id = '" . $item_id . "' AND wh_alloc.id = sa.ref_po_id AND
						     sa.company_id='" . $this->arrUser['company_id'] . "' 
					       ),0) AS sold_qty,
					IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
					       WHERE sa.warehouse_id = '" . $warehouse_id . "' AND sa.type = 2 AND sa.sale_return_status = 0 AND
<<<<<<< HEAD
						     sa.product_id = '" . $item_id . "' AND sa.order_id = '" . $order_id . "' AND sa.sale_order_detail_id = '".$sale_order_detail_id."'
=======
						     sa.product_id = '" . $item_id . "' AND sa.order_id = '" . $order_id . "' AND sa.sale_order_detail_id = '" . $sale_order_detail_id . "'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
						     AND wh_alloc.id = sa.ref_po_id AND
						     sa.company_id='" . $this->arrUser['company_id'] . "'
					       ),0) AS currently_allocated_qty,
                    IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                            WHERE sa.type = 2 AND sa.sale_return_status = 1 AND
                                sa.sale_status IN (2, 3)  AND sa.product_id = '" . $item_id . "' AND wh_alloc.container_no = sa.container_no AND
                                sa.company_id= '" . $this->arrUser['company_id'] . "'
                            ),0) AS qty_returned,
				wh_alloc.*,
				prd_wrh_loc.warehouse_loc_id AS storage_loc_id,wrh_loc.title AS location_title,wrh_loc.bin_cost,dim.title AS dimtitle,
			       CASE  WHEN wrh_loc.cost_type_id = 1 THEN 'Fixed'
				      WHEN wrh_loc.cost_type_id = 2 THEN 'Daily'
				      WHEN wrh_loc.cost_type_id = 3 THEN 'Weekly'
				      WHEN wrh_loc.cost_type_id = 4 THEN 'Monthly'
				      WHEN wrh_loc.cost_type_id = 5 THEN 'Annually'
				      END AS cost_type
				FROM `warehouse_allocation` wh_alloc
				LEFT JOIN `opening_balance_stock` AS op_bal_stk ON `op_bal_stk`.id = `wh_alloc`.`opBalncID` 
				LEFT JOIN product_warehouse_location AS prd_wrh_loc ON prd_wrh_loc.id=wh_alloc.location
				LEFT JOIN warehouse_bin_location AS wrh_loc ON wrh_loc.id=prd_wrh_loc.warehouse_loc_id
				LEFT JOIN units_of_measure AS dim ON dim.id=wrh_loc.dimensions_id
				WHERE 
					$op_where
					`wh_alloc`.`product_id`='" . $item_id . "' AND
                    wh_alloc.status = 1 AND
					`wh_alloc`.type = 4 AND 
                    wh_alloc.product_id = '" . $item_id . "' AND 
<<<<<<< HEAD
                    wh_alloc.warehouse_id = '" . $warehouse_id. "' AND
=======
                    wh_alloc.warehouse_id = '" . $warehouse_id . "' AND
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $where
                    (wh_alloc.company_id='" . $this->arrUser['company_id'] . "' )
				GROUP BY wh_alloc.id
                $having 
        ";
        // echo $Sql;exit; 
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                // if($Row['sold_qty'] < $Row['total_qty'] || $attr['isInvoice'] == 1)
                {
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['order_id'] = $Row['order_id'];
                    $result['type']     = $Row['type'];
                    $result['source_type'] = $Row['type'];
                    $result['WH_loc_id'] = $Row['location'];
                    $result['storage_loc_id'] = $Row['storage_loc_id'];
                    $result['warehouse_id'] = $Row['warehouse_id'];
                    $result['product_id'] = $Row['product_id'];
                    $result['location'] = $Row['location_title'] . " ( " . $Row['bin_cost'] . ", " . $Row['dimtitle'] . ", " . $Row['cost_type'] . ")";
                    $result['container_no'] = $Row['container_no'];
                    $result['consignment_no'] = $Row['consignment_no'];
<<<<<<< HEAD
                    
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $result['batch_no'] = $Row['batch_no'];
                    $result['prod_date'] = $this->objGeneral->convert_unix_into_date($Row['prod_date']);
                    $result['date_received'] = $this->objGeneral->convert_unix_into_date($Row['date_received']);
                    $result['use_by_date'] = $this->objGeneral->convert_unix_into_date($Row['use_by_date']);
                    $result['total_qty'] = $Row['total_qty'];
<<<<<<< HEAD
                    $result['sold_qty'] = $Row['sold_qty'];// - $Row['qty_returned'];
                    
=======
                    $result['sold_qty'] = $Row['sold_qty']; // - $Row['qty_returned'];

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $result['qty_returned'] = $Row['qty_returned'];
                    $result['allocated_qty'] = $Row['allocated_qty'];
                    $result['avail_qty'] = $Row['avail_qty'];
                    $result['currently_allocated_qty'] = $Row['currently_allocated_qty'];
                    // $result['bl_shipment_no'] = $Row['bl_shipment_no'];
                    $result['item_trace_unique_id'] = $Row['item_trace_unique_id'];
                    $result['opBalncID'] = $Row['opBalncID'];
                    $result['sale_return_status'] = $Row['sale_return_status'];
                    $result['transfer_order_date'] = $this->objGeneral->convert_unix_into_date($Row['transfer_order_date']);
<<<<<<< HEAD
                    
                    $response['response'][] = $result; 
=======

                    $response['response'][] = $result;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                }
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
<<<<<<< HEAD
            $response['total'] = $total;
=======
            $response['total'] = 0;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }
    function get_purchase_stock_journal($attr)
    {
        $where = "";
        $having = "";
        $op_where = "";

<<<<<<< HEAD
        $item_journal_detail_id = (isset($attr['item_journal_detail_id']) && $attr['item_journal_detail_id']!='')?$attr['item_journal_detail_id']:0;
        $warehouse_id = (isset($attr['warehouse_id']) && $attr['warehouse_id']!='')?$attr['warehouse_id']:0;
        $item_id = (isset($attr['item_id']) && $attr['item_id']!='')?$attr['item_id']:0;
        $order_id = (isset($attr['order_id']) && $attr['order_id']!='')?$attr['order_id']:0;

        if(isset($attr['isInvoice']) && $attr['isInvoice'] == 1)
        {
            $where = "(SELECT IFNULL(SUM(sa.quantity), 0) FROM warehouse_allocation sa
                               WHERE sa.warehouse_id = '" . $warehouse_id . "' AND sa.type = 3 AND
                                     sa.product_id = '" . $item_id . "' AND sa.order_id = '" . $order_id . "' AND sa.item_journal_detail_id = '".$item_journal_detail_id."'
                                     AND wh_alloc.id = sa.ref_po_id AND
                                     (sa.company_id='" . $this->arrUser['company_id'] . "' )
                               ) > 0 AND ";
        }
        else
        {
=======
        $item_journal_detail_id = (isset($attr['item_journal_detail_id']) && $attr['item_journal_detail_id'] != '') ? $attr['item_journal_detail_id'] : 0;
        $warehouse_id = (isset($attr['warehouse_id']) && $attr['warehouse_id'] != '') ? $attr['warehouse_id'] : 0;
        $item_id = (isset($attr['item_id']) && $attr['item_id'] != '') ? $attr['item_id'] : 0;
        $order_id = (isset($attr['order_id']) && $attr['order_id'] != '') ? $attr['order_id'] : 0;

        if (isset($attr['isInvoice']) && $attr['isInvoice'] == 1) {
            $where = "(SELECT IFNULL(SUM(sa.quantity), 0) FROM warehouse_allocation sa
                               WHERE sa.warehouse_id = '" . $warehouse_id . "' AND sa.type = 3 AND
                                     sa.product_id = '" . $item_id . "' AND sa.order_id = '" . $order_id . "' AND sa.item_journal_detail_id = '" . $item_journal_detail_id . "'
                                     AND wh_alloc.id = sa.ref_po_id AND
                                     (sa.company_id='" . $this->arrUser['company_id'] . "' )
                               ) > 0 AND ";
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            // $op_where = "op_bal_stk.allocated_qty < op_bal_stk.qty AND ";
            $having = " HAVING sold_qty < total_qty ";
        }

        $p_prodType = 0;

<<<<<<< HEAD
            $Sql = "SELECT SUM(quantity) AS total_qty,SR_CURRENT_OR_AVAILABLE_STOCK(wh_alloc.product_id,wh_alloc.company_id,2) AS available_stock,
                        SUM(quantity) - IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                                                WHERE sa.warehouse_id = '" . $warehouse_id. "' AND 
=======
        $Sql = "SELECT SUM(quantity) AS total_qty,SR_CURRENT_OR_AVAILABLE_STOCK(wh_alloc.product_id,wh_alloc.company_id,2) AS available_stock,
                        SUM(quantity) - IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                                                WHERE sa.warehouse_id = '" . $warehouse_id . "' AND 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                                    (
                                                                        (sa.type = 2 AND sa.sale_return_status = 0) OR 
                                                                        (sa.type = 1 AND sa.purchase_return_status = 1) OR
                                                                        (sa.type = 1 AND sa.purchase_return_status = 0 AND sa.raw_material_out = 1) OR  
                                                                        (sa.type = 3 AND sa.ledger_type = 2) OR 
                                                                        (sa.type = 5 AND sa.ledger_type = 2)
                                                                    ) AND
                                                        sa.product_id = '" . $item_id . "' AND wh_alloc.id = sa.ref_po_id AND
                                                        (sa.company_id='" . $this->arrUser['company_id'] . "' )
                                                ),0) AS avail_qty,
                        IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                                WHERE sa.warehouse_id = '" . $warehouse_id . "' AND (
                                                        (sa.type = 2 AND sa.sale_return_status = 0 AND sa.sale_status = 1) OR
                                                        (sa.type = 3 AND sa.ledger_type = 2 AND sa.journal_status = 1) OR
                                                        (sa.type = 5 AND sa.ledger_type = 2 AND sa.journal_status = 1)
                                                    ) AND
                                        sa.product_id = '" . $item_id . "' AND wh_alloc.id = sa.ref_po_id AND
                                        (sa.company_id='" . $this->arrUser['company_id'] . "' )
                                ),0) AS allocated_qty,
                            IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                                WHERE sa.warehouse_id = '" . $warehouse_id . "' AND (
                                                (sa.type = 1 AND sa.purchase_return_status = 1 AND sa.purchase_status IN (2, 3)) OR
                                                (sa.type = 1 AND sa.purchase_return_status = 0 AND sa.raw_material_out = 1) OR
                                                (sa.type = 2 AND sa.sale_return_status = 0 AND sa.sale_status IN (2, 3)) OR
                                                (sa.type = 3 AND sa.ledger_type = 2 AND sa.journal_status = 2) OR
                                                (sa.type = 5 AND sa.ledger_type = 2 AND sa.journal_status = 2)                                         
                                            ) AND
                                        sa.product_id = '" . $item_id . "' AND wh_alloc.id = sa.ref_po_id AND
                                        (sa.company_id='" . $this->arrUser['company_id'] . "' )
                                ),0) AS sold_qty,
                            IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                                WHERE sa.warehouse_id = '" . $warehouse_id . "' AND sa.type = 3 AND sa.ledger_type= 2 AND
<<<<<<< HEAD
                                        sa.product_id = '" . $item_id . "' AND sa.order_id = '" . $order_id . "' AND sa.item_journal_detail_id = '".$item_journal_detail_id."'
=======
                                        sa.product_id = '" . $item_id . "' AND sa.order_id = '" . $order_id . "' AND sa.item_journal_detail_id = '" . $item_journal_detail_id . "'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                        AND wh_alloc.id = sa.ref_po_id AND
                                        (sa.company_id='" . $this->arrUser['company_id'] . "' )
                                ),0) AS currently_allocated_qty,
                            IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                                WHERE sa.type = 2 AND sa.sale_return_status = 1 AND
                                    sa.ref_po_id = wh_alloc.id AND
                                    sa.sale_status IN (2, 3)  AND sa.product_id = '" . $item_id . "' AND wh_alloc.container_no = sa.container_no AND
                                    (sa.company_id= '" . $this->arrUser['company_id'] . "' )
                                ),0) AS qty_returned,
                        wh_alloc.*,prd_wrh_loc.warehouse_loc_id AS storage_loc_id,wrh_loc.title AS location_title,wrh_loc.bin_cost,dim.title AS dimtitle,
                        CASE  WHEN wrh_loc.cost_type_id = 1 THEN 'Fixed'
                                WHEN wrh_loc.cost_type_id = 2 THEN 'Daily'
                                WHEN wrh_loc.cost_type_id = 3 THEN 'Weekly'
                                WHEN wrh_loc.cost_type_id = 4 THEN 'Monthly'
                                WHEN wrh_loc.cost_type_id = 5 THEN 'Annually'
                                END AS cost_type
                    FROM warehouse_allocation AS wh_alloc
                    LEFT JOIN product_warehouse_location AS prd_wrh_loc ON prd_wrh_loc.id=wh_alloc.location
                    LEFT JOIN warehouse_bin_location AS wrh_loc ON wrh_loc.id=prd_wrh_loc.warehouse_loc_id
                    LEFT JOIN units_of_measure AS dim ON dim.id=wrh_loc.dimensions_id
                    WHERE 
                    (
                        (wh_alloc.type = 1 AND wh_alloc.purchase_status IN (2,3) AND wh_alloc.purchase_return_status = 0 AND (wh_alloc.raw_material_out IS NULL OR wh_alloc.raw_material_out = 0)) OR
                        (wh_alloc.type = 2 AND wh_alloc.sale_status IN (2,3) AND wh_alloc.sale_return_status = 1) OR
                        (wh_alloc.type = 3 AND wh_alloc.ledger_type = 1 AND wh_alloc.journal_status = 2)  OR
                        (wh_alloc.type = 5 AND wh_alloc.ledger_type = 1) 
                    )
                    AND wh_alloc.status = 1 AND
                    wh_alloc.product_id = '" . $item_id . "' AND wh_alloc.warehouse_id = '" . $warehouse_id . "' AND
                    $where
                    (wh_alloc.company_id='" . $this->arrUser['company_id'] . "' )
                    GROUP BY wh_alloc.id
                    $having
                    
                UNION 
                    SELECT  SUM(quantity) AS total_qty,SR_CURRENT_OR_AVAILABLE_STOCK(wh_alloc.product_id,wh_alloc.company_id,2) AS available_stock,
                            SUM(quantity) - IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                                                    WHERE sa.warehouse_id = '" . $warehouse_id . "' AND (
                                                                            (sa.type = 2 AND sa.sale_return_status = 0) OR 
                                                                            (sa.type = 1 AND sa.purchase_return_status = 1) OR 
                                                                            (sa.type = 1 AND sa.purchase_return_status = 0 AND sa.raw_material_out = 1) OR 
                                                                            (sa.type = 3 AND sa.ledger_type = 2) OR 
                                                                            (sa.type = 5 AND sa.ledger_type = 2)
                                                                        ) AND
                                                            sa.product_id = '" . $item_id . "' AND wh_alloc.id = sa.ref_po_id AND
                                                            (sa.company_id='" . $this->arrUser['company_id'] . "' )
                                                    ),0) AS avail_qty,
                            IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                                WHERE sa.warehouse_id = '" . $warehouse_id . "' AND (
                                                            (sa.type = 2 AND sa.sale_return_status = 0 AND sa.sale_status = 1) OR
                                                            (sa.type = 3 AND sa.ledger_type = 2 AND sa.journal_status = 1) OR
                                                            (sa.type = 5 AND sa.ledger_type = 2 AND sa.journal_status = 1)
                                                        )  AND
                                    sa.product_id = '" . $item_id . "' AND wh_alloc.id = sa.ref_po_id AND
                                    (sa.company_id='" . $this->arrUser['company_id'] . "' )
                                ),0) AS allocated_qty,
                            IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                                WHERE sa.warehouse_id = '" . $warehouse_id . "' AND (
                                                    (sa.type = 1 AND sa.purchase_return_status = 1 AND sa.purchase_status IN (2, 3)) OR
                                                    (sa.type = 1 AND sa.purchase_return_status = 0 AND sa.raw_material_out = 1) OR
                                                    (sa.type = 2 AND sa.sale_return_status = 0 AND sa.sale_status IN (2, 3)) OR
                                                    (sa.type = 3 AND sa.ledger_type = 2 AND sa.journal_status = 2) OR
                                                    (sa.type = 5 AND sa.ledger_type = 2 AND sa.journal_status = 2)                                         
                                                ) AND
                                    sa.product_id = '" . $item_id . "' AND wh_alloc.id = sa.ref_po_id AND
                                    (sa.company_id='" . $this->arrUser['company_id'] . "' )
                                ),0) AS sold_qty,
                            IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                                WHERE sa.warehouse_id = '" . $warehouse_id . "' AND sa.type = 3 AND sa.ledger_type= 2 AND
<<<<<<< HEAD
                                    sa.product_id = '" . $item_id . "' AND sa.order_id = '" . $order_id . "' AND sa.item_journal_detail_id = '".$item_journal_detail_id."'
=======
                                    sa.product_id = '" . $item_id . "' AND sa.order_id = '" . $order_id . "' AND sa.item_journal_detail_id = '" . $item_journal_detail_id . "'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    AND wh_alloc.id = sa.ref_po_id AND
                                    (sa.company_id='" . $this->arrUser['company_id'] . "' )
                                ),0) AS currently_allocated_qty,
                            IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                                    WHERE sa.type = 2 AND sa.sale_return_status = 1 AND
                                        sa.sale_status IN (2, 3)  AND sa.product_id = '" . $item_id . "' AND wh_alloc.container_no = sa.container_no AND
                                        (sa.company_id= '" . $this->arrUser['company_id'] . "' )
                                    ),0) AS qty_returned,
                        wh_alloc.*,
                        prd_wrh_loc.warehouse_loc_id AS storage_loc_id,wrh_loc.title AS location_title,wrh_loc.bin_cost,dim.title AS dimtitle,
                        CASE  WHEN wrh_loc.cost_type_id = 1 THEN 'Fixed'
                            WHEN wrh_loc.cost_type_id = 2 THEN 'Daily'
                            WHEN wrh_loc.cost_type_id = 3 THEN 'Weekly'
                            WHEN wrh_loc.cost_type_id = 4 THEN 'Monthly'
                            WHEN wrh_loc.cost_type_id = 5 THEN 'Annually'
                            END AS cost_type
                    FROM `warehouse_allocation` wh_alloc
                    LEFT JOIN `opening_balance_stock` AS op_bal_stk ON `op_bal_stk`.id = `wh_alloc`.`opBalncID` 
                    LEFT JOIN product_warehouse_location AS prd_wrh_loc ON prd_wrh_loc.id=wh_alloc.location
                    LEFT JOIN warehouse_bin_location AS wrh_loc ON wrh_loc.id=prd_wrh_loc.warehouse_loc_id
                    LEFT JOIN units_of_measure AS dim ON dim.id=wrh_loc.dimensions_id
                    WHERE 
                        $op_where
                        `wh_alloc`.`product_id`='" . $item_id . "' AND
                        wh_alloc.status = 1 AND
                        `wh_alloc`.type = 4 AND  
                        wh_alloc.warehouse_id = '" . $warehouse_id . "' AND
                        $where
                        (wh_alloc.company_id='" . $this->arrUser['company_id'] . "' )
                    GROUP BY wh_alloc.id
                    $having
            ";

        // echo $Sql;exit; 
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                // if($Row['sold_qty'] < $Row['total_qty'] || $attr['isInvoice'] == 1)
                {
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['order_id'] = $Row['order_id'];
                    $result['type']     = $Row['type'];
                    $result['source_type'] = $Row['type'];
                    $result['WH_loc_id'] = $Row['location'];
                    $result['storage_loc_id'] = $Row['storage_loc_id'];
                    $result['warehouse_id'] = $Row['warehouse_id'];
                    $result['product_id'] = $Row['product_id'];
                    $result['location'] = $Row['location_title'] . " ( " . $Row['bin_cost'] . ", " . $Row['dimtitle'] . ", " . $Row['cost_type'] . ")";
                    $result['container_no'] = $Row['container_no'];
                    $result['consignment_no'] = $Row['consignment_no'];
<<<<<<< HEAD
                    
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $result['batch_no'] = $Row['batch_no'];
                    $result['prod_date'] = $this->objGeneral->convert_unix_into_date($Row['prod_date']);
                    $result['date_received'] = $this->objGeneral->convert_unix_into_date($Row['date_received']);
                    $result['use_by_date'] = $this->objGeneral->convert_unix_into_date($Row['use_by_date']);
                    $result['total_qty'] = $Row['total_qty'];
<<<<<<< HEAD
                    $result['sold_qty'] = $Row['sold_qty'];// - $Row['qty_returned'];
                    
=======
                    $result['sold_qty'] = $Row['sold_qty']; // - $Row['qty_returned'];

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $result['qty_returned'] = $Row['qty_returned'];
                    $result['allocated_qty'] = $Row['allocated_qty'];
                    $result['avail_qty'] = $Row['avail_qty'];
                    $result['available_stock'] = $Row['available_stock'];
                    $result['currently_allocated_qty'] = $Row['currently_allocated_qty'];
                    // $result['bl_shipment_no'] = $Row['bl_shipment_no'];
                    $result['item_trace_unique_id'] = $Row['item_trace_unique_id'];
                    $result['opBalncID'] = $Row['opBalncID'];
                    $result['sale_return_status'] = $Row['sale_return_status'];
<<<<<<< HEAD
                    
                    $response['response'][] = $result; 
=======

                    $response['response'][] = $result;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                }
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
<<<<<<< HEAD
            $response['total'] = $total;
=======
            $response['total'] = 0;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function get_purchase_stock_transfer_order($attr)
    {
        $where = "";
        $having = "";
        $op_where = "";

<<<<<<< HEAD
        $transfer_order_detail_id = (isset($attr['transfer_order_detail_id']) && $attr['transfer_order_detail_id']!='')?$attr['transfer_order_detail_id']:0;
        $warehouse_id = (isset($attr['warehouse_id']) && $attr['warehouse_id']!='')?$attr['warehouse_id']:0;
        $item_id = (isset($attr['item_id']) && $attr['item_id']!='')?$attr['item_id']:0;
        $order_id = (isset($attr['order_id']) && $attr['order_id']!='')?$attr['order_id']:0;

        if(isset($attr['isInvoice']) && $attr['isInvoice'] == 1)
        {
            $where = "(SELECT IFNULL(SUM(sa.quantity), 0) FROM warehouse_allocation sa
                               WHERE sa.warehouse_id = '" . $warehouse_id . "' AND sa.type = 5 AND
                                     sa.product_id = '" . $item_id . "' AND sa.order_id = '" . $order_id . "' AND sa.transfer_order_detail_id = '".$transfer_order_detail_id."'
                                     AND wh_alloc.id = sa.ref_po_id AND
                                     (sa.company_id='" . $this->arrUser['company_id'] . "' )
                               ) > 0 AND ";
        }
        else
        {
=======
        $transfer_order_detail_id = (isset($attr['transfer_order_detail_id']) && $attr['transfer_order_detail_id'] != '') ? $attr['transfer_order_detail_id'] : 0;
        $warehouse_id = (isset($attr['warehouse_id']) && $attr['warehouse_id'] != '') ? $attr['warehouse_id'] : 0;
        $item_id = (isset($attr['item_id']) && $attr['item_id'] != '') ? $attr['item_id'] : 0;
        $order_id = (isset($attr['order_id']) && $attr['order_id'] != '') ? $attr['order_id'] : 0;

        if (isset($attr['isInvoice']) && $attr['isInvoice'] == 1) {
            $where = "(SELECT IFNULL(SUM(sa.quantity), 0) FROM warehouse_allocation sa
                               WHERE sa.warehouse_id = '" . $warehouse_id . "' AND sa.type = 5 AND
                                     sa.product_id = '" . $item_id . "' AND sa.order_id = '" . $order_id . "' AND sa.transfer_order_detail_id = '" . $transfer_order_detail_id . "'
                                     AND wh_alloc.id = sa.ref_po_id AND
                                     (sa.company_id='" . $this->arrUser['company_id'] . "' )
                               ) > 0 AND ";
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            // $op_where = "op_bal_stk.allocated_qty < op_bal_stk.qty AND ";
            $having = " HAVING sold_qty < total_qty ";

            $checkLocSql = "SELECT IFNULL(MAX(pwl.id),0)  AS id FROM product_warehouse_location AS pwl
                        WHERE 
                            pwl.item_id = $item_id AND
                            pwl.warehouse_id = $attr[to_warehouse_id] AND
                            pwl.warehouse_loc_id = $attr[to_location_id]";
            // echo $checkLocSql;exit;
            $RScheckLoc = $this->objsetup->CSI($checkLocSql);

<<<<<<< HEAD
            if($RScheckLoc->fields['id'] == 0)
            {
=======
            if ($RScheckLoc->fields['id'] == 0) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $response['ack'] = 0;
                $response['location_to_check'] = 1;
                $response['error'] = 'Stock can not be allocated to location';

                return $response;
            }
        }
<<<<<<< HEAD
        
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        // ((sa.type = 2 AND sa.sale_return_status = 0 AND sa.sale_status = 1) OR (sa.type = 1 AND sa.purchase_return_status = 1 AND sa.purchase_status =1))
        $Sql = "SELECT SUM(quantity) AS total_qty,
                       SUM(quantity) - IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                                               WHERE sa.warehouse_id = '" . $warehouse_id . "' AND 
                                                                (
                                                                    (sa.type = 2 AND sa.sale_return_status = 0) OR 
                                                                    (sa.type = 1 AND sa.purchase_return_status = 1) OR 
                                                                    (sa.type = 3 AND sa.ledger_type = 2) OR 
                                                                    (sa.type = 5 AND sa.ledger_type = 2)
                                                                ) AND
<<<<<<< HEAD
                                                     sa.product_id = '" . $item_id. "' AND wh_alloc.id = sa.ref_po_id AND
=======
                                                     sa.product_id = '" . $item_id . "' AND wh_alloc.id = sa.ref_po_id AND
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                     (sa.company_id='" . $this->arrUser['company_id'] . "' )
                                               ),0) AS avail_qty,
                       IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                               WHERE sa.warehouse_id = '" . $warehouse_id . "' AND (
                                                    (sa.type = 2 AND sa.sale_return_status = 0 AND sa.sale_status = 1) OR
                                                    (sa.type = 3 AND sa.ledger_type = 2 AND sa.journal_status = 1) OR
                                                    (sa.type = 5 AND sa.ledger_type = 2 AND sa.journal_status = 1)
                                                ) AND
                                     sa.product_id = '" . $item_id . "' AND wh_alloc.id = sa.ref_po_id AND
                                     (sa.company_id='" . $this->arrUser['company_id'] . "' )
                               ),0) AS allocated_qty,
                        IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                               WHERE sa.warehouse_id = '" . $warehouse_id . "' AND (
                                            (sa.type = 1 AND sa.purchase_return_status = 1 AND sa.purchase_status IN (2, 3)) OR
                                            (sa.type = 2 AND sa.sale_return_status = 0 AND sa.sale_status IN (2, 3)) OR
                                            (sa.type = 3 AND sa.ledger_type = 2 AND sa.journal_status = 2)           OR
                                            (sa.type = 5 AND sa.ledger_type = 2 AND sa.journal_status = 2)                                         
                                        ) AND
                                     sa.product_id = '" . $item_id . "' AND wh_alloc.id = sa.ref_po_id AND
                                     (sa.company_id='" . $this->arrUser['company_id'] . "' )
                               ),0) AS sold_qty,
                        IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                               WHERE sa.warehouse_id = '" . $warehouse_id . "' AND sa.type = 5 AND sa.ledger_type= 2 AND
<<<<<<< HEAD
                                     sa.product_id = '" . $item_id . "' AND sa.order_id = '" . $order_id . "' AND sa.transfer_order_detail_id = '".$transfer_order_detail_id."'
=======
                                     sa.product_id = '" . $item_id . "' AND sa.order_id = '" . $order_id . "' AND sa.transfer_order_detail_id = '" . $transfer_order_detail_id . "'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                     AND wh_alloc.id = sa.ref_po_id AND
                                     (sa.company_id='" . $this->arrUser['company_id'] . "' )
                               ),0) AS currently_allocated_qty,
                        IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                            WHERE sa.type = 2 AND sa.sale_return_status = 1 AND
                                sa.ref_po_id = wh_alloc.id AND
                                sa.sale_status IN (2, 3)  AND sa.product_id = '" . $item_id . "' AND wh_alloc.container_no = sa.container_no AND
                                (sa.company_id= '" . $this->arrUser['company_id'] . "' )
                            ),0) AS qty_returned,
                       wh_alloc.*,prd_wrh_loc.warehouse_loc_id AS storage_loc_id,wrh_loc.title AS location_title,wrh_loc.bin_cost,dim.title AS dimtitle,
                       CASE  WHEN wrh_loc.cost_type_id = 1 THEN 'Fixed'
                              WHEN wrh_loc.cost_type_id = 2 THEN 'Daily'
                              WHEN wrh_loc.cost_type_id = 3 THEN 'Weekly'
                              WHEN wrh_loc.cost_type_id = 4 THEN 'Monthly'
                              WHEN wrh_loc.cost_type_id = 5 THEN 'Annually'
                              END AS cost_type
                FROM warehouse_allocation AS wh_alloc
                LEFT JOIN product_warehouse_location AS prd_wrh_loc ON prd_wrh_loc.id=wh_alloc.location
                LEFT JOIN warehouse_bin_location AS wrh_loc ON wrh_loc.id=prd_wrh_loc.warehouse_loc_id
                LEFT JOIN units_of_measure AS dim ON dim.id=wrh_loc.dimensions_id
				WHERE 
                (
                    (wh_alloc.type = 1 AND wh_alloc.purchase_status IN (2,3) AND wh_alloc.purchase_return_status = 0) OR
                    (wh_alloc.type = 2 AND wh_alloc.sale_status IN (2,3) AND wh_alloc.sale_return_status = 1) OR
                    (wh_alloc.type = 3 AND wh_alloc.ledger_type = 1 AND wh_alloc.journal_status = 2)  OR
                    (wh_alloc.type = 5 AND wh_alloc.ledger_type = 1) 
				)
				AND wh_alloc.status = 1 AND
                wh_alloc.product_id = '" . $item_id . "' AND wh_alloc.warehouse_id = '" . $warehouse_id . "' AND  
                prd_wrh_loc.warehouse_loc_id = '" . $attr['from_location_id'] . "' AND 
                $where
                (wh_alloc.company_id='" . $this->arrUser['company_id'] . "' )
				GROUP BY wh_alloc.id
				$having
				
		UNION 
			SELECT SUM(quantity) AS total_qty,
					SUM(quantity) - IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                                               WHERE sa.warehouse_id = '" . $warehouse_id . "' AND (
                                                                    (sa.type = 2 AND sa.sale_return_status = 0) OR 
                                                                    (sa.type = 1 AND sa.purchase_return_status = 1) OR 
                                                                    (sa.type = 3 AND sa.ledger_type = 2) OR 
                                                                    (sa.type = 5 AND sa.ledger_type = 2)
                                                                ) AND
                                                     sa.product_id = '" . $item_id . "' AND wh_alloc.id = sa.ref_po_id AND
                                                     (sa.company_id='" . $this->arrUser['company_id'] . "' )
                                               ),0) AS avail_qty,
				       IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
					       WHERE sa.warehouse_id = '" . $warehouse_id . "' AND (
                                                    (sa.type = 2 AND sa.sale_return_status = 0 AND sa.sale_status = 1) OR
                                                    (sa.type = 3 AND sa.ledger_type = 2 AND sa.journal_status = 1) OR
                                                    (sa.type = 5 AND sa.ledger_type = 2 AND sa.journal_status = 1)
                                                )  AND
						     sa.product_id = '" . $item_id . "' AND wh_alloc.id = sa.ref_po_id AND
						     (sa.company_id='" . $this->arrUser['company_id'] . "' )
					       ),0) AS allocated_qty,
					IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
					       WHERE sa.warehouse_id = '" . $warehouse_id . "' AND (
                                            (sa.type = 1 AND sa.purchase_return_status = 1 AND sa.purchase_status IN (2, 3)) OR
                                            (sa.type = 2 AND sa.sale_return_status = 0 AND sa.sale_status IN (2, 3)) OR
                                            (sa.type = 3 AND sa.ledger_type = 2 AND sa.journal_status = 2)  OR
                                            (sa.type = 5 AND sa.ledger_type = 2 AND sa.journal_status = 2)                                         
                                        ) AND
						     sa.product_id = '" . $item_id . "' AND wh_alloc.id = sa.ref_po_id AND
						     (sa.company_id='" . $this->arrUser['company_id'] . "' )
					       ),0) AS sold_qty,
					IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
					       WHERE sa.warehouse_id = '" . $warehouse_id . "' AND sa.type = 5 AND sa.ledger_type= 2 AND
<<<<<<< HEAD
						     sa.product_id = '" . $item_id . "' AND sa.order_id = '" . $order_id . "' AND sa.transfer_order_detail_id = '".$transfer_order_detail_id."'
=======
						     sa.product_id = '" . $item_id . "' AND sa.order_id = '" . $order_id . "' AND sa.transfer_order_detail_id = '" . $transfer_order_detail_id . "'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
						     AND wh_alloc.id = sa.ref_po_id AND
						     (sa.company_id='" . $this->arrUser['company_id'] . "' )
					       ),0) AS currently_allocated_qty,
                    IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                            WHERE sa.type = 2 AND sa.sale_return_status = 1 AND
                                sa.sale_status IN (2, 3)  AND sa.product_id = '" . $item_id . "' AND wh_alloc.container_no = sa.container_no AND
                                (sa.company_id= '" . $this->arrUser['company_id'] . "' )
                            ),0) AS qty_returned,
				wh_alloc.*,
				prd_wrh_loc.warehouse_loc_id AS storage_loc_id,wrh_loc.title AS location_title,wrh_loc.bin_cost,dim.title AS dimtitle,
			       CASE  WHEN wrh_loc.cost_type_id = 1 THEN 'Fixed'
				      WHEN wrh_loc.cost_type_id = 2 THEN 'Daily'
				      WHEN wrh_loc.cost_type_id = 3 THEN 'Weekly'
				      WHEN wrh_loc.cost_type_id = 4 THEN 'Monthly'
				      WHEN wrh_loc.cost_type_id = 5 THEN 'Annually'
				      END AS cost_type
				FROM `warehouse_allocation` wh_alloc
				LEFT JOIN `opening_balance_stock` AS op_bal_stk ON `op_bal_stk`.id = `wh_alloc`.`opBalncID` 
				LEFT JOIN product_warehouse_location AS prd_wrh_loc ON prd_wrh_loc.id=wh_alloc.location
				LEFT JOIN warehouse_bin_location AS wrh_loc ON wrh_loc.id=prd_wrh_loc.warehouse_loc_id
				LEFT JOIN units_of_measure AS dim ON dim.id=wrh_loc.dimensions_id
				WHERE 
					$op_where
					wh_alloc.status = 1 AND
					`wh_alloc`.type = 4 AND 
                    wh_alloc.product_id = '" . $item_id . "' AND 
                    wh_alloc.warehouse_id = '" . $warehouse_id . "' AND
                    prd_wrh_loc.warehouse_loc_id = '" . $attr['from_location_id'] . "' AND 
                    $where
                    (wh_alloc.company_id='" . $this->arrUser['company_id'] . "' )
				GROUP BY wh_alloc.id
                $having
        ";
        // echo $Sql;exit; 
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                // if($Row['sold_qty'] < $Row['total_qty'] || $attr['isInvoice'] == 1)
                {
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['order_id'] = $Row['order_id'];
                    $result['type']     = $Row['type'];
                    $result['source_type'] = $Row['type'];
                    $result['WH_loc_id'] = $Row['location'];
                    $result['storage_loc_id'] = $Row['storage_loc_id'];
                    $result['warehouse_id'] = $Row['warehouse_id'];
                    $result['product_id'] = $Row['product_id'];
                    $result['location'] = $Row['location_title'] . " ( " . $Row['bin_cost'] . ", " . $Row['dimtitle'] . ", " . $Row['cost_type'] . ")";
                    $result['container_no'] = $Row['container_no'];
                    $result['consignment_no'] = $Row['consignment_no'];
<<<<<<< HEAD
                    
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $result['batch_no'] = $Row['batch_no'];
                    $result['prod_date'] = $this->objGeneral->convert_unix_into_date($Row['prod_date']);
                    $result['date_received'] = $this->objGeneral->convert_unix_into_date($Row['date_received']);
                    $result['use_by_date'] = $this->objGeneral->convert_unix_into_date($Row['use_by_date']);
                    $result['total_qty'] = $Row['total_qty'];
<<<<<<< HEAD
                    $result['sold_qty'] = $Row['sold_qty'];// - $Row['qty_returned'];
                    
=======
                    $result['sold_qty'] = $Row['sold_qty']; // - $Row['qty_returned'];

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $result['qty_returned'] = $Row['qty_returned'];
                    $result['allocated_qty'] = $Row['allocated_qty'];
                    $result['avail_qty'] = $Row['avail_qty'];
                    $result['currently_allocated_qty'] = $Row['currently_allocated_qty'];
                    // $result['bl_shipment_no'] = $Row['bl_shipment_no'];
                    $result['item_trace_unique_id'] = $Row['item_trace_unique_id'];
                    $result['opBalncID'] = $Row['opBalncID'];
                    $result['sale_return_status'] = $Row['sale_return_status'];
<<<<<<< HEAD
                    
                    $response['response'][] = $result; 
=======

                    $response['response'][] = $result;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                }
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
<<<<<<< HEAD
            $response['total'] = $total;
=======
            $response['total'] = 0;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }


    function get_sale_stock($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";

        $where = "";

<<<<<<< HEAD
        $order_detail_id = (isset($attr['order_detail_id']) && $attr['order_detail_id']!='')?$attr['order_detail_id']:0;
        $warehouse_id = (isset($attr['warehouse_id']) && $attr['warehouse_id']!='')?$attr['warehouse_id']:0;
        $item_id = (isset($attr['item_id']) && $attr['item_id']!='')?$attr['item_id']:0;
        $order_id = (isset($attr['order_id']) && $attr['order_id']!='')?$attr['order_id']:0;

        if(isset($attr['sale_invoice_id']) && $attr['sale_invoice_id'] != '')
            $where .= " AND o.id = ".$attr['sale_invoice_id']." ";

        $response = array();

            $Sql = "SELECT 
=======
        $order_detail_id = (isset($attr['order_detail_id']) && $attr['order_detail_id'] != '') ? $attr['order_detail_id'] : 0;
        $warehouse_id = (isset($attr['warehouse_id']) && $attr['warehouse_id'] != '') ? $attr['warehouse_id'] : 0;
        $item_id = (isset($attr['item_id']) && $attr['item_id'] != '') ? $attr['item_id'] : 0;
        $order_id = (isset($attr['order_id']) && $attr['order_id'] != '') ? $attr['order_id'] : 0;

        if (isset($attr['sale_invoice_id']) && $attr['sale_invoice_id'] != '')
            $where .= " AND o.id = " . $attr['sale_invoice_id'] . " ";

        $response = array();

        $Sql = "SELECT 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        o.id AS order_id, 
                        o.`sale_invioce_code`, 
                        o.`sale_order_code`, 
                        o.posting_date as invoice_date, 
                        wh_alloc.*, 
                        (SELECT wh1.container_no FROM warehouse_allocation as wh1 
                            WHERE wh1.order_id = $order_id AND 
                                wh1.sale_order_detail_id = $order_detail_id AND 
                                wh1.product_id =  $item_id AND 
                                wh1.type = 2 AND wh1.sale_return_status = 1 AND
                                wh1.company_id= '" . $this->arrUser['company_id'] . "' LIMIT 1) AS updated_container_no,
                        wh_info.name as wh_name, wh_info.wrh_code as wh_code, 
                        IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                                LEFT JOIN company ON company.id=sa.company_id
                                WHERE sa.type = 2 AND sa.sale_return_status = 1 AND
                                    sa.ref_po_id = wh_alloc.id AND
                                    sa.sale_status IN (2, 3)  AND sa.product_id = '" . $item_id  . "' AND 
                                    (sa.company_id= '" . $this->arrUser['company_id'] . "' )
                                ),0) AS qty_returned,
                        IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                                LEFT JOIN company ON company.id=sa.company_id
<<<<<<< HEAD
                                WHERE sa.type = 2 AND sa.sale_return_status = 1 AND sa.order_id= ".$order_id." AND
=======
                                WHERE sa.type = 2 AND sa.sale_return_status = 1 AND sa.order_id= " . $order_id . " AND
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    sa.ref_po_id = wh_alloc.id AND
                                    sa.product_id = '" . $item_id . "' AND 
                                    (sa.company_id= '" . $this->arrUser['company_id'] . "' )
                                ),0) AS qty_currently_returned,
                        IFNULL((SELECT SUM(sa.quantity) FROM warehouse_allocation sa
                                LEFT JOIN company ON company.id=sa.company_id
<<<<<<< HEAD
                                WHERE sa.type = 2 AND sa.sale_return_status = 1 AND sa.order_id= ".$order_id." AND sa.sale_order_detail_id = ".$order_detail_id." AND
=======
                                WHERE sa.type = 2 AND sa.sale_return_status = 1 AND sa.order_id= " . $order_id . " AND sa.sale_order_detail_id = " . $order_detail_id . " AND
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    sa.ref_po_id = wh_alloc.id AND
                                    sa.product_id = '" . $item_id . "' AND
                                    (sa.company_id= '" . $this->arrUser['company_id'] . "' )
                                ),0) AS qty_currently_returned_by_current_entry,                        
                        
                        prd_wrh_loc.warehouse_loc_id as storage_loc_id,wrh_loc.title as location_title,wrh_loc.bin_cost,dim.title as dimtitle,
                       CASE  WHEN wrh_loc.cost_type_id = 1 THEN 'Fixed'
                              WHEN wrh_loc.cost_type_id = 2 THEN 'Daily'
                              WHEN wrh_loc.cost_type_id = 3 THEN 'Weekly'
                              WHEN wrh_loc.cost_type_id = 4 THEN 'Monthly'
                              WHEN wrh_loc.cost_type_id = 5 THEN 'Annually'
                              END AS cost_type
                    FROM orders o
                    LEFT JOIN `order_details` od ON od.`order_id`=o.`id`
                    LEFT JOIN `warehouse_allocation` wh_alloc ON wh_alloc.`order_id`=o.id
                    LEFT JOIN product_warehouse_location prd_wrh_loc ON prd_wrh_loc.id=wh_alloc.location
                    LEFT JOIN company ON company.id=o.company_id
                    LEFT JOIN warehouse_bin_location AS wrh_loc ON wrh_loc.id=prd_wrh_loc.warehouse_loc_id
                    LEFT JOIN units_of_measure AS dim ON dim.id=wrh_loc.dimensions_id
                    LEFT JOIN warehouse AS wh_info on wh_info.id = wh_alloc.warehouse_id
                        WHERE
                        o.type IN (2,3) AND
                        o.sell_to_cust_id = '" . $attr['user_id'] . "' AND
                        wh_alloc.`type` = 2 AND
                        wh_alloc.`sale_return_status` = 0 AND
                        wh_alloc.sale_status IN (2,3) AND
                        wh_alloc.`product_id` = '" . $item_id . "' AND
                        o.`company_id` = '" . $this->arrUser['company_id'] . "'
                        $where
                        group by wh_alloc.id";
        // echo $Sql;exit;
<<<<<<< HEAD
                        
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
<<<<<<< HEAD
                if(intval($Row['qty_returned']) < intval($Row['quantity']) || 1) //&& intval($result['qty_currently_returned']) > 0
                {
                    $result = array();
                    $result['id']               = $Row['id'];
                    $result['sale_invioce_code']= $Row['sale_invioce_code'];
=======
                if (intval($Row['qty_returned']) < intval($Row['quantity']) || 1) //&& intval($result['qty_currently_returned']) > 0
                {
                    $result = array();
                    $result['id']               = $Row['id'];
                    $result['sale_invioce_code'] = $Row['sale_invioce_code'];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $result['sale_order_code']  = $Row['sale_order_code'];
                    $result['qty_sold']         = $Row['quantity'];
                    $result['qty_returned']     = $Row['qty_returned'];
                    $result['qty_currently_returned']     = $Row['qty_currently_returned'];
                    $result['qty_currently_returned_by_current_entry']     = $Row['qty_currently_returned_by_current_entry'];
<<<<<<< HEAD
                    
                    if($Row['qty_currently_returned_by_current_entry'] > 0)
                    {
                        $SubSql = "SELECT location FROM warehouse_allocation 
                                    WHERE 
                                    ref_po_id='$Row[id]' AND product_id='$item_id' AND 
                                    sale_return_status=1 AND warehouse_id = ".$warehouse_id." AND
                                    sale_order_detail_id='$order_detail_id' AND 
                                    company_id= " . $this->arrUser['company_id'] . " AND
                                    type='".$attr['type']."'";
=======

                    if ($Row['qty_currently_returned_by_current_entry'] > 0) {
                        $SubSql = "SELECT location FROM warehouse_allocation 
                                    WHERE 
                                    ref_po_id='$Row[id]' AND product_id='$item_id' AND 
                                    sale_return_status=1 AND warehouse_id = " . $warehouse_id . " AND
                                    sale_order_detail_id='$order_detail_id' AND 
                                    company_id= " . $this->arrUser['company_id'] . " AND
                                    type='" . $attr['type'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        // echo $SubSql;exit;
                        $SubRS = $this->objsetup->CSI($SubSql);
                        $result['wh_location'] = $SubRS->fields['location'];
                    }
                    $result['invoice_date']     = $this->objGeneral->convert_unix_into_date($Row['invoice_date']);
<<<<<<< HEAD
                    
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $result['order_id'] = $Row['order_id'];
                    $result['type']     = $Row['type'];
                    $result['WH_loc_id'] = $Row['location'];
                    $result['storage_loc_id'] = $Row['storage_loc_id'];
                    $result['warehouse_id'] = $Row['warehouse_id'];
<<<<<<< HEAD
                    $result['warehouse_name'] = $Row['wh_code']."- ".$Row['wh_name'];
                    
                    $result['product_id'] = $Row['product_id'];
                    $result['location'] = $Row['location_title'] . " ( " . $Row['bin_cost'] . ", " . $Row['dimtitle'] . ", " . $Row['cost_type'] . ")";
                    $result['container_no'] = ($Row['qty_currently_returned_by_current_entry'] > 0) ? $Row['updated_container_no'] : $Row['container_no'];
                    
=======
                    $result['warehouse_name'] = $Row['wh_code'] . "- " . $Row['wh_name'];

                    $result['product_id'] = $Row['product_id'];
                    $result['location'] = $Row['location_title'] . " ( " . $Row['bin_cost'] . ", " . $Row['dimtitle'] . ", " . $Row['cost_type'] . ")";
                    $result['container_no'] = ($Row['qty_currently_returned_by_current_entry'] > 0) ? $Row['updated_container_no'] : $Row['container_no'];

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $result['batch_no'] = $Row['batch_no'];
                    $result['item_trace_unique_id'] = $Row['item_trace_unique_id'];
                    $result['prod_date'] = $this->objGeneral->convert_unix_into_date($Row['prod_date']);
                    $result['date_received'] = $this->objGeneral->convert_unix_into_date($Row['date_received']);
                    $result['use_by_date'] = $this->objGeneral->convert_unix_into_date($Row['use_by_date']);
<<<<<<< HEAD
                    
                    $result['opBalncID'] = $Row['opBalncID'];
                    
=======

                    $result['opBalncID'] = $Row['opBalncID'];

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    // $result['total_qty'] = $Row['total_qty'];
                    // $result['allocated_qty'] = $Row['allocated_qty'];
                    // $result['avail_qty'] = $Row['avail_qty'];
                    // $result['currently_allocated_qty'] = $Row['currently_allocated_qty'];
                    // $result['bl_shipment_no'] = $Row['bl_shipment_no'];
                    $response['response']['sales_activities'][] = $result;
                }
            }
            require_once(SERVER_PATH . "/classes/Warehouse.php");
            $objWH = new Warehouse($this->arrUser);
            $temp_attr['wrh_id']    = $attr['warehouse_id'];
            $temp_attr['prod_id']   = $item_id;
            $response['response']['warehouse_locations'] = $objWH->get_sel_warehouse_loc_in_stock_alloc($temp_attr);
<<<<<<< HEAD
            
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['total'] = $total;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

<<<<<<< HEAD
    
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    function add_order_stock_allocation($attr)
    {
        // echo "<pre>"; print_r($attr); exit;
        // $this->objGeneral->mysql_clean($attr);
<<<<<<< HEAD
        
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;

        $order_date = isset($attr['order_date']) ? '"' . $attr['order_date'] . '"' : '';

        if (strpos($attr['order_date'], '/') == true) {
            $order_date = str_replace('/', '-', $attr['order_date']);
            $order_date = $order_date;
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
        $update_id = "";

<<<<<<< HEAD
 
        // $data_pass = "  tst.ref_po_id=".$attr['id']." and	tst.type=".$attr['type']." and tst.status=1 and	tst.order_id=".$attr['order_id']."
		// and tst.product_id=".$attr['item_id']."	and tst.warehouse_id=$attr[warehouses_id]    $update_check ";
=======

        // $data_pass = "  tst.ref_po_id=".$attr['id']." and	tst.type=".$attr['type']." and tst.status=1 and	tst.order_id=".$attr['order_id']."
        // and tst.product_id=".$attr['item_id']."	and tst.warehouse_id=".$attr['warehouses_id']."    $update_check ";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // $total = $this->objGeneral->count_duplicate_in_sql('warehouse_allocation', $data_pass, $this->arrUser['company_id']);

        // if ($total > 0) {
        //     $response['ack'] = 0;
        //     $response['error'] = 'Record Already Exists .';
        //     return $response;
        //     exit;
        // }
<<<<<<< HEAD
 
        // validate the stock
        if($sale_return_status == 0) // for orders
        {
            
=======

        // validate the stock
        if ($sale_return_status == 0) // for orders
        {

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $v_sql = "SELECT IFNULL(SUM(quantity), 0) AS qty, IFNULL(od.qty, 0) AS org_qty
                        FROM warehouse_allocation AS wh_alloc, order_details AS od, orders AS o
                        WHERE
                            od.order_id = o.id AND
                            o.id = wh_alloc.order_id AND
                            od.id = wh_alloc.`sale_order_detail_id` AND
                            wh_alloc.company_id= " . $this->arrUser['company_id'] . " AND
                            wh_alloc.type = 2 AND 
                            wh_alloc.sale_return_status = $sale_return_status AND
                            wh_alloc.sale_order_detail_id = $attr[sale_order_detail_id] AND
<<<<<<< HEAD
                            wh_alloc.product_id = ".$attr['item_id']."";
=======
                            wh_alloc.product_id = " . $attr['item_id'] . "";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            // echo $v_sql;exit;
            $v_RS = $this->objsetup->CSI($v_sql);
            $validate_already_allocated = $v_RS->fields['qty'];
            $total_qty = $v_RS->fields['org_qty'];
            // echo $validate_already_allocated;exit;
<<<<<<< HEAD
            if($validate_already_allocated > 0 && $total_qty < $validate_already_allocated + $attr['req_qty'])
            {
=======
            if ($validate_already_allocated > 0 && $total_qty < $validate_already_allocated + $attr['req_qty']) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $response['id'] = 0;
                $response['ack'] = 0;
                $response['error'] = 'Quanity already allocated limit exceed !';
                return $response;
            }
            $validate_stock = self::get_purchase_stock($attr);
<<<<<<< HEAD
            
            // print_r($validate_stock);exit;
            if($validate_stock['ack'] == 1)
            {
                foreach($validate_stock['response'] as $neededObject)
                {
                    if($neededObject['id'] == $attr['id'] && $neededObject['avail_qty'] < $attr['req_qty'] )
                    {
=======

            // print_r($validate_stock);exit;
            if ($validate_stock['ack'] == 1) {
                foreach ($validate_stock['response'] as $neededObject) {
                    if ($neededObject['id'] == $attr['id'] && $neededObject['avail_qty'] < $attr['req_qty']) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $response['id'] = 0;
                        $response['ack'] = 0;
                        $response['error'] = 'Available quantity is less than the requested quantity';
                        return $response;
                    }
                }
<<<<<<< HEAD
            }
            else
            {
=======
            } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $response['id'] = 0;
                $response['ack'] = 0;
                $response['error'] = 'Available quantity is less than the requested quantity';
                return $response;
            }
<<<<<<< HEAD
        }
        else // for credit note
        {
            $table_name = ($sale_return_status == 0) ? "orders" : "return_orders";
            $v_sql = "SELECT IFNULL(SUM(quantity), 0) AS qty, (SELECT sell_to_cust_id FROM $table_name WHERE id = ".$attr['order_id'].") AS cust_id
=======
        } else // for credit note
        {
            $table_name = ($sale_return_status == 0) ? "orders" : "return_orders";
            $v_sql = "SELECT IFNULL(SUM(quantity), 0) AS qty, (SELECT sell_to_cust_id FROM $table_name WHERE id = " . $attr['order_id'] . ") AS cust_id
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        FROM warehouse_allocation AS wh_alloc
                        WHERE
                            wh_alloc.type = 2 AND 
                            wh_alloc.sale_return_status = $sale_return_status AND
                            wh_alloc.company_id= " . $this->arrUser['company_id'] . " AND
<<<<<<< HEAD
                            wh_alloc.order_id = ".$attr['order_id']." AND
                            wh_alloc.sale_order_detail_id = $attr[sale_order_detail_id] AND
                            wh_alloc.product_id = ".$attr['item_id']."";
=======
                            wh_alloc.order_id = " . $attr['order_id'] . " AND
                            wh_alloc.sale_order_detail_id = $attr[sale_order_detail_id] AND
                            wh_alloc.product_id = " . $attr['item_id'] . "";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            // echo $v_sql;exit;
            $v_RS = $this->objsetup->CSI($v_sql);
            $validate_already_allocated = $v_RS->fields['qty'];
            // $total_qty = $v_RS->fields['org_qty'];
            // echo $validate_already_allocated;exit;
            /* if($validate_already_allocated > 0 && $total_qty < $validate_already_allocated + $attr['req_qty'])
            {
                $response['id'] = 0;
                $response['ack'] = 0;
                $response['error'] = 'Quanity already allocated limit exceed !';
                return $response;
            } */
            $attr['order_detail_id'] = $attr['sale_order_detail_id'];
            $attr['user_id'] = $validate_already_allocated = $v_RS->fields['cust_id'];
<<<<<<< HEAD
            
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $validate_stock = self::get_sale_stock($attr);
            // print_r($validate_stock);exit;
            // echo $validate_stock['ack'] ;exit;

<<<<<<< HEAD
            if($validate_stock['ack'] == 1)
            {
                // print_r($validate_stock['response']['sales_activities']);exit;
                $validate_stock_temp = $validate_stock['response']['sales_activities'];
                // print_r($validate_stock_temp);exit;
                foreach($validate_stock_temp as $neededObject)
                {
                    if($neededObject['id'] == $attr['id'] && $neededObject['qty_sold'] < $neededObject['qty_currently_returned'] + $neededObject['qty_returned'] + $attr['req_qty'] )
                    {
=======
            if ($validate_stock['ack'] == 1) {
                // print_r($validate_stock['response']['sales_activities']);exit;
                $validate_stock_temp = $validate_stock['response']['sales_activities'];
                // print_r($validate_stock_temp);exit;
                foreach ($validate_stock_temp as $neededObject) {
                    if ($neededObject['id'] == $attr['id'] && $neededObject['qty_sold'] < $neededObject['qty_currently_returned'] + $neededObject['qty_returned'] + $attr['req_qty']) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        // print_r($neededObject);exit;
                        $response['id'] = 0;
                        $response['ack'] = 0;
                        $response['error'] = 'Available quantity is less than the requested quantity';
                        return $response;
                    }
                }
<<<<<<< HEAD
            }
            else
            {
=======
            } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $response['id'] = 0;
                $response['ack'] = 0;
                $response['error'] = 'Available quantity is less than the requested quantity';
                return $response;
            }
        }

        $duplicate_SQL = "SELECT * 
                          FROM warehouse_allocation 
<<<<<<< HEAD
                          where ref_po_id = '".$attr['id']."' AND 
                                order_id = '".$attr['order_id']."' AND 
                                product_id = '$attr[product_id]' AND
=======
                          where ref_po_id = '" . $attr['id'] . "' AND 
                                order_id = '" . $attr['order_id'] . "' AND 
                                product_id = '" . $attr['product_id'] . "' AND
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                company_id= " . $this->arrUser['company_id'] . " AND
                                sale_order_detail_id = '$attr[sale_order_detail_id]'
                                
                                ";
        // $duplicate_SQL = "SELECT * FROM warehouse_allocation WHERE product_id = '295'";
<<<<<<< HEAD
         
        $RS = $this->objsetup->CSI($duplicate_SQL);
          if ($RS->RecordCount() > 0) {
             while ($Row = $RS->FetchRow()) {
                $update_id   = $Row['id'];
                $ref_po_id   = $Row['ref_po_id'];
                $current_qty =  intval($attr['req_qty']) + intval($Row['quantity']);
            }  
        }  
=======

        $RS = $this->objsetup->CSI($duplicate_SQL);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $update_id   = $Row['id'];
                $ref_po_id   = $Row['ref_po_id'];
                $current_qty =  intval($attr['req_qty']) + intval($Row['quantity']);
            }
        }
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // wh_location in case of credit note
        $location_id = (isset($attr['wh_location'])) ? $attr['wh_location'] : $attr['WH_loc_id'];
        $warehouse_id = (isset($attr['targeted_warehouse_id'])) ? $attr['targeted_warehouse_id'] : $attr['warehouse_id'];
        $item_trace_unique_id = ($attr['item_trace_unique_id'] != "") ? $attr['item_trace_unique_id'] : 0;
        $opBalncID = ($attr['opBalncID'] != "") ? $attr['opBalncID'] : 'NULL';
        // echo $duplicate_SQL;exit;
        // order_date='" . $this->objGeneral->convert_date($order_date). "',
<<<<<<< HEAD
        $date_receivedUnConv = ""; 

        if($attr['date_received'] > 0){
            $date_receivedUnConv = "date_receivedUnConv = '" . $this->objGeneral->convertUnixDateIntoConvDate($attr['date_received']) . "',";            
        } 
        
        if($update_id == ''){
        
                $Sql = "INSERT INTO warehouse_allocation 
=======
        $date_receivedUnConv = "";

        if ($attr['date_received'] > 0) {
            $date_receivedUnConv = "date_receivedUnConv = '" . $this->objGeneral->convertUnixDateIntoConvDate($attr['date_received']) . "',";
        }

        if ($update_id == '') {

            $Sql = "INSERT INTO warehouse_allocation 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                            SET 
                                                batch_no='$attr[batch_no]',
                                                sale_order_detail_id='$attr[sale_order_detail_id]', 
                                                warehouse_id='$attr[warehouse_id]', 
                                                location = '$location_id',
                                                bl_shipment_no='$attr[bl_shipment_no]',
                                                consignment_no='$attr[consignment_no]',
                                                container_no='$attr[container_no]',
                                                date_received='" . $this->objGeneral->convert_date($attr['date_received']) . "',
                                                $date_receivedUnConv
<<<<<<< HEAD
                                                order_id='".$attr['order_id']."',
                                                product_id='".$attr['item_id']."',
=======
                                                order_id='" . $attr['order_id'] . "',
                                                product_id='" . $attr['item_id'] . "',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                prod_date='" . $this->objGeneral->convert_date($attr['prod_date']) . "',
                                                transfer_order_date='" . $this->objGeneral->convert_date($attr['transfer_order_date']) . "',
                                                status=1,
                                                quantity='$attr[req_qty]',
                                                remaining_qty='$attr[req_qty]',
                                                use_by_date='" . $this->objGeneral->convert_date($attr['use_by_date']) . "',
                                                unit_measure_id='" . $attr['units']->id . "',
                                                unit_measure_qty='" . $attr['units']->quantity . "',
                                                unit_measure_name='" . $attr['units']->name . "',
                                                primary_unit_id='" . $attr['primary_unit_id'] . "',
                                                primary_unit_qty='1',
                                                primary_unit_name='" . $attr['primary_unit_name'] . "',
                                                sale_return_status=$sale_return_status,
<<<<<<< HEAD
                                                order_date='" . current_date. "',
                                                type='".$attr['type']."',
                                                ref_po_id='".$attr['id']."',                                                
=======
                                                order_date='" . current_date . "',
                                                type='" . $attr['type'] . "',
                                                ref_po_id='" . $attr['id'] . "',                                                
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                AddedBy='" . $this->arrUser['id'] . "',
                                                AddedOn=UNIX_TIMESTAMP (NOW()),
                                                company_id='" . $this->arrUser['company_id'] . "',
                                                user_id='" . $this->arrUser['id'] . "',
<<<<<<< HEAD
                                                item_trace_unique_id='" . $item_trace_unique_id. "',
                                                opBalncID=" . $opBalncID. "
                                                $purchase_return_status   
                                                $purchase_status ";           
        }
        else
        {
             $Sql = "UPDATE warehouse_allocation 
=======
                                                item_trace_unique_id='" . $item_trace_unique_id . "',
                                                opBalncID=" . $opBalncID . "
                                                $purchase_return_status   
                                                $purchase_status ";
        } else {
            $Sql = "UPDATE warehouse_allocation 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                        SET
                                            quantity = '$current_qty',
                                            remaining_qty = '$current_qty',
                                            location = '$location_id',
                                            ChangedBy='" . $this->arrUser['id'] . "',
                                            ChangedOn=UNIX_TIMESTAMP (NOW()),
<<<<<<< HEAD
                                            item_trace_unique_id='" . $item_trace_unique_id. "'
                     where  ref_po_id='".$attr['id']."' AND 
                            product_id='".$attr['item_id']."' AND 
                            order_id = '".$attr['order_id']."' AND 
                            company_id= " . $this->arrUser['company_id'] . " AND
                            sale_return_status='" . $sale_return_status . "' AND 
                            sale_order_detail_id='$attr[sale_order_detail_id]' AND
                            type='".$attr['type']."'";            
=======
                                            item_trace_unique_id='" . $item_trace_unique_id . "'
                     where  ref_po_id='" . $attr['id'] . "' AND 
                            product_id='" . $attr['item_id'] . "' AND 
                            order_id = '" . $attr['order_id'] . "' AND 
                            company_id= " . $this->arrUser['company_id'] . " AND
                            sale_return_status='" . $sale_return_status . "' AND 
                            sale_order_detail_id='$attr[sale_order_detail_id]' AND
                            type='" . $attr['type'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        }

        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

<<<<<<< HEAD
        if($update_id == '')
            $id = $this->Conn->Insert_ID();
        else{
            $id = $attr['id'];
        }
        
=======
        if ($update_id == '')
            $id = $this->Conn->Insert_ID();
        else {
            $id = $attr['id'];
        }

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if ($id > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;

            $opBalncID = ($attr['opBalncID'] != '') ? $attr['opBalncID'] : 0;

<<<<<<< HEAD
            if($attr['source_type'] == 4)
            {
               
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty = temp_allocated_qty + $attr[req_qty] WHERE id = $opBalncID";
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            }
            else if($attr['source_type'] == 5)
            {
=======
            if ($attr['source_type'] == 4) {

                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty = temp_allocated_qty + $attr[req_qty] WHERE id = $opBalncID";
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            } else if ($attr['source_type'] == 5) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty_returned = temp_allocated_qty_returned + $attr[req_qty] WHERE id = $opBalncID";
                $RS = $this->objsetup->CSI($Sql);
            }

            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
        } else {
            $response['id'] = 0;
            $response['ack'] = 0;
            $response['error'] = 'Record Can not be updated';
        }
        return $response;
    }

    function add_order_stock_allocation_journal($attr)
    {
<<<<<<< HEAD
        
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;

        $duplicate_SQL = "SELECT * 
                          FROM warehouse_allocation 
<<<<<<< HEAD
                          where ref_po_id = '".$attr['id']."' AND 
                                order_id = '".$attr['order_id']."' AND 
                                company_id= " . $this->arrUser['company_id'] . " AND
                                product_id = '$attr[product_id]' AND
=======
                          where ref_po_id = '" . $attr['id'] . "' AND 
                                order_id = '" . $attr['order_id'] . "' AND 
                                company_id= " . $this->arrUser['company_id'] . " AND
                                product_id = '" . $attr['product_id'] . "' AND
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                item_journal_detail_id = '$attr[item_journal_detail_id]'
                                
                                ";
        // echo $duplicate_SQL;exit;
        $RS = $this->objsetup->CSI($duplicate_SQL);
<<<<<<< HEAD
          if ($RS->RecordCount() > 0) {
             while ($Row = $RS->FetchRow()) {
                $update_id   = $Row['id'];
                $ref_po_id   = $Row['ref_po_id'];
                $current_qty =  intval($attr['req_qty']) + intval($Row['quantity']);
            }  
        }  

        
=======
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $update_id   = $Row['id'];
                $ref_po_id   = $Row['ref_po_id'];
                $current_qty =  intval($attr['req_qty']) + intval($Row['quantity']);
            }
        }


>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (isset($attr['sale_return_status']))
            $sale_return_status = $attr['sale_return_status'];

        if (!empty($attr['purchase_return_status']))
            $purchase_return_status = " , purchase_return_status = 1 ";
        else
            $purchase_return_status = " , purchase_return_status = 0 ";

        // wh_location in case of credit note
        $location_id = (isset($attr['wh_location'])) ? $attr['wh_location'] : $attr['WH_loc_id'];
        $warehouse_id = (isset($attr['targeted_warehouse_id'])) ? $attr['targeted_warehouse_id'] : $attr['warehouse_id'];
        $item_trace_unique_id = ($attr['item_trace_unique_id'] != "") ? $attr['item_trace_unique_id'] : 0;
        $unit_measure_id = ($attr['unit_measure_id'] != "") ? $attr['unit_measure_id'] : 0;
        $primary_unit_id = ($attr['primary_unit_id'] != "") ? $attr['primary_unit_id'] : 0;
        $opBalncID = ($attr['opBalncID'] != "") ? $attr['opBalncID'] : 'NULL';
        // echo $duplicate_SQL;exit;
        // order_date='" . $this->objGeneral->convert_date($order_date). "',

<<<<<<< HEAD
        
        $date_receivedUnConv = ""; 

        if($attr['date_received'] > 0){
            $date_receivedUnConv = "date_receivedUnConv = '" . $this->objGeneral->convertUnixDateIntoConvDate($attr['date_received']) . "',";            
        }

        if($update_id == ''){
        
                $Sql = "INSERT INTO warehouse_allocation 
=======

        $date_receivedUnConv = "";
        $purchase_status = "";

        if ($attr['date_received'] > 0) {
            $date_receivedUnConv = "date_receivedUnConv = '" . $this->objGeneral->convertUnixDateIntoConvDate($attr['date_received']) . "',";
        }

        if ($update_id == '') {

            $Sql = "INSERT INTO warehouse_allocation 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                            SET 
                                                batch_no='$attr[batch_no]',
                                                item_journal_detail_id='$attr[item_journal_detail_id]', 
                                                warehouse_id='$attr[warehouse_id]', 
                                                location = '$location_id',
                                                bl_shipment_no='$attr[bl_shipment_no]',
                                                container_no='$attr[container_no]',
                                                consignment_no='$attr[consignment_no]',
                                                date_received='" . $this->objGeneral->convert_date($attr['date_received']) . "',
                                                $date_receivedUnConv
<<<<<<< HEAD
                                                order_id='".$attr['order_id']."',
                                                product_id='".$attr['item_id']."',
=======
                                                order_id='" . $attr['order_id'] . "',
                                                product_id='" . $attr['item_id'] . "',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                prod_date='" . $this->objGeneral->convert_date($attr['prod_date']) . "',
                                                status=1,
                                                quantity='$attr[req_qty]',
                                                remaining_qty='$attr[req_qty]',
                                                use_by_date='" . $this->objGeneral->convert_date($attr['use_by_date']) . "',
                                                transfer_order_date='" . $this->objGeneral->convert_date($attr['transfer_order_date']) . "',
<<<<<<< HEAD
                                                unit_measure_id='" . $unit_measure_id. "',
                                                unit_measure_qty='1',
                                                unit_measure_name='" . $attr['uom_name'] . "',
                                                primary_unit_id='" . $primary_unit_id. "',
                                                primary_unit_qty='1',
                                                primary_unit_name='" . $attr['primary_unit_name'] . "',
                                                sale_return_status=$sale_return_status,
                                                order_date='" . current_date. "',
                                                type='".$attr['type']."',
                                                ledger_type = 2,
                                                ref_po_id='".$attr['id']."',                                                
=======
                                                unit_measure_id='" . $unit_measure_id . "',
                                                unit_measure_qty='1',
                                                unit_measure_name='" . $attr['uom_name'] . "',
                                                primary_unit_id='" . $primary_unit_id . "',
                                                primary_unit_qty='1',
                                                primary_unit_name='" . $attr['primary_unit_name'] . "',
                                                sale_return_status=$sale_return_status,
                                                order_date='" . current_date . "',
                                                type='" . $attr['type'] . "',
                                                ledger_type = 2,
                                                ref_po_id='" . $attr['id'] . "',                                                
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                AddedBy='" . $this->arrUser['id'] . "',
                                                AddedOn=UNIX_TIMESTAMP (NOW()),
                                                company_id='" . $this->arrUser['company_id'] . "',
                                                user_id='" . $this->arrUser['id'] . "',
<<<<<<< HEAD
                                                item_trace_unique_id='" . $item_trace_unique_id. "',
                                                opBalncID=" . $opBalncID. "
                                                $purchase_return_status   
                                                $purchase_status ";           
        }
        else
        {
             $Sql = "UPDATE warehouse_allocation 
=======
                                                item_trace_unique_id='" . $item_trace_unique_id . "',
                                                opBalncID=" . $opBalncID . "
                                                $purchase_return_status   
                                                $purchase_status ";
        } else {
            $Sql = "UPDATE warehouse_allocation 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                        SET
                                            quantity = '$current_qty',
                                            remaining_qty = '$current_qty',
                                            location = '$location_id',
                                            ChangedBy='" . $this->arrUser['id'] . "',
                                            ChangedOn=UNIX_TIMESTAMP (NOW()),
<<<<<<< HEAD
                                            item_trace_unique_id='" . $item_trace_unique_id. "'
                     where  ref_po_id='".$attr['id']."' AND 
                            product_id='".$attr['item_id']."' AND 
                            order_id = '".$attr['order_id']."' AND 
                            company_id= " . $this->arrUser['company_id'] . " AND
                            ledger_type='2' AND 
                            item_journal_detail_id='$attr[item_journal_detail_id]' AND
                            type='".$attr['type']."'";            
=======
                                            item_trace_unique_id='" . $item_trace_unique_id . "'
                     where  ref_po_id='" . $attr['id'] . "' AND 
                            product_id='" . $attr['item_id'] . "' AND 
                            order_id = '" . $attr['order_id'] . "' AND 
                            company_id= " . $this->arrUser['company_id'] . " AND
                            ledger_type='2' AND 
                            item_journal_detail_id='$attr[item_journal_detail_id]' AND
                            type='" . $attr['type'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        }

        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

<<<<<<< HEAD
        if($update_id == '')
            $id = $this->Conn->Insert_ID();
        else{
            $id = $attr['id'];
        }
        
=======
        if ($update_id == '')
            $id = $this->Conn->Insert_ID();
        else {
            $id = $attr['id'];
        }

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if ($id > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;
            $opBalncID = ($attr['opBalncID'] != '') ? $attr['opBalncID'] : 0;
<<<<<<< HEAD
            
            if($attr['source_type'] == 4)
            {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty = temp_allocated_qty + $attr[req_qty] WHERE id = $opBalncID";
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            }
            else if($attr['source_type'] == 5)
            {
=======

            if ($attr['source_type'] == 4) {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty = temp_allocated_qty + $attr[req_qty] WHERE id = $opBalncID";
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            } else if ($attr['source_type'] == 5) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty_returned = temp_allocated_qty_returned + $attr[req_qty] WHERE id = $opBalncID";
                $RS = $this->objsetup->CSI($Sql);
            }

            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
        } else {
            $response['id'] = 0;
            $response['ack'] = 0;
            $response['error'] = 'Record Can not be updated';
        }
        return $response;
    }

    function add_order_stock_allocation_transfer_order($attr)
    {
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;

        $duplicate_SQL = "SELECT * 
                          FROM warehouse_allocation 
<<<<<<< HEAD
                          where ref_po_id = '".$attr['id']."' AND 
                                order_id = '".$attr['order_id']."' AND 
                                company_id= " . $this->arrUser['company_id'] . " AND
                                product_id = '$attr[product_id]' AND
                                transfer_order_detail_id = '$attr[transfer_order_detail_id]'";
        // echo $duplicate_SQL;exit;
        $RS = $this->objsetup->CSI($duplicate_SQL);
          if ($RS->RecordCount() > 0) {
             while ($Row = $RS->FetchRow()) {
                $update_id   = $Row['id'];
                $ref_po_id   = $Row['ref_po_id'];
                $current_qty =  intval($attr['req_qty']) + intval($Row['quantity']);
            }  
        }  

        
=======
                          where ref_po_id = '" . $attr['id'] . "' AND 
                                order_id = '" . $attr['order_id'] . "' AND 
                                company_id= " . $this->arrUser['company_id'] . " AND
                                product_id = '" . $attr['product_id'] . "' AND
                                transfer_order_detail_id = '$attr[transfer_order_detail_id]'";
        // echo $duplicate_SQL;exit;
        $RS = $this->objsetup->CSI($duplicate_SQL);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $update_id   = $Row['id'];
                $ref_po_id   = $Row['ref_po_id'];
                $current_qty =  intval($attr['req_qty']) + intval($Row['quantity']);
            }
        }


>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (isset($attr['sale_return_status']))
            $sale_return_status = $attr['sale_return_status'];

        if (!empty($attr['purchase_return_status']))
            $purchase_return_status = " , purchase_return_status = 1 ";
        else
            $purchase_return_status = " , purchase_return_status = 0 ";

<<<<<<< HEAD
        
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $from_location_id = (isset($attr['from_location_id'])) ? $attr['from_location_id'] : 0;
        $to_location_id = (isset($attr['to_location_id'])) ? $attr['to_location_id'] : 0;

        $from_warehouse_id = (isset($attr['from_warehouse_id'])) ? $attr['from_warehouse_id'] : 0;
        $to_warehouse_id = (isset($attr['to_warehouse_id'])) ? $attr['to_warehouse_id'] : 0;
        $item_trace_unique_id = ($attr['item_trace_unique_id'] != "") ? $attr['item_trace_unique_id'] : 0;
        $opBalncID = ($attr['opBalncID'] != "") ? $attr['opBalncID'] : 'NULL';
<<<<<<< HEAD
        
        $date_receivedUnConv = ""; 

        if($attr['date_received'] > 0){
            $date_receivedUnConv = "date_receivedUnConv = '" . $this->objGeneral->convertUnixDateIntoConvDate($attr['date_received']) . "',";            
        }

        if($update_id == ''){
        
                $from_Sql = "INSERT INTO warehouse_allocation 
=======

        $date_receivedUnConv = "";
        $purchase_status = "";

        if ($attr['date_received'] > 0) {
            $date_receivedUnConv = "date_receivedUnConv = '" . $this->objGeneral->convertUnixDateIntoConvDate($attr['date_received']) . "',";
        }

        if ($update_id == '') {

            $from_Sql = "INSERT INTO warehouse_allocation 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                            SET 
                                                batch_no='$attr[batch_no]',
                                                transfer_order_detail_id='$attr[transfer_order_detail_id]', 
                                                warehouse_id='$from_warehouse_id', 
<<<<<<< HEAD
                                                location = IFNULL((SELECT pwl.id FROM `product_warehouse_location` AS pwl WHERE pwl.warehouse_id=$from_warehouse_id AND pwl.warehouse_loc_id= $from_location_id AND pwl.item_id = ".$attr['item_id']." LIMIT 1), 0),
=======
                                                location = IFNULL((SELECT pwl.id FROM `product_warehouse_location` AS pwl WHERE pwl.warehouse_id=$from_warehouse_id AND pwl.warehouse_loc_id= $from_location_id AND pwl.item_id = " . $attr['item_id'] . " LIMIT 1), 0),
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                -- location = $from_location_id,
                                                bl_shipment_no='$attr[bl_shipment_no]',
                                                container_no='$attr[container_no]',
                                                consignment_no='$attr[consignment_no]',
                                                date_received='" . $this->objGeneral->convert_date($attr['date_received']) . "',
                                                $date_receivedUnConv
<<<<<<< HEAD
                                                order_id='".$attr['order_id']."',
                                                product_id='".$attr['item_id']."',
=======
                                                order_id='" . $attr['order_id'] . "',
                                                product_id='" . $attr['item_id'] . "',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                prod_date='" . $this->objGeneral->convert_date($attr['prod_date']) . "',
                                                status=1,
                                                quantity='$attr[req_qty]',
                                                remaining_qty='$attr[req_qty]',
                                                use_by_date='" . $this->objGeneral->convert_date($attr['use_by_date']) . "',
                                                transfer_order_date='" . $this->objGeneral->convert_date($attr['transfer_order_date']) . "',
                                                unit_measure_id='" . $attr['unit_measure_id'] . "',
                                                unit_measure_qty='1',
                                                unit_measure_name='" . $attr['uom_name'] . "',
                                                primary_unit_id='" . $attr['primary_unit_id'] . "',
                                                primary_unit_qty='1',
                                                primary_unit_name='" . $attr['primary_unit_name'] . "',
                                                sale_return_status=$sale_return_status,
<<<<<<< HEAD
                                                order_date='" . current_date. "',
                                                type='".$attr['type']."',
                                                ref_po_id='".$attr['id']."',    
=======
                                                order_date='" . current_date . "',
                                                type='" . $attr['type'] . "',
                                                ref_po_id='" . $attr['id'] . "',    
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                ledger_type = 2,                                               
                                                AddedBy='" . $this->arrUser['id'] . "',
                                                AddedOn=UNIX_TIMESTAMP (NOW()),
                                                company_id='" . $this->arrUser['company_id'] . "',
                                                user_id='" . $this->arrUser['id'] . "',
<<<<<<< HEAD
                                                item_trace_unique_id='" . $item_trace_unique_id. "',
                                                opBalncID=" . $opBalncID. "
                                                $purchase_return_status   
                                                $purchase_status "; 
                                
                $to_Sql = "INSERT INTO warehouse_allocation 
=======
                                                item_trace_unique_id='" . $item_trace_unique_id . "',
                                                opBalncID=" . $opBalncID . "
                                                $purchase_return_status   
                                                $purchase_status ";

            $to_Sql = "INSERT INTO warehouse_allocation 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                            SET 
                                                batch_no='$attr[batch_no]',
                                                transfer_order_detail_id='$attr[transfer_order_detail_id]', 
                                                warehouse_id='$to_warehouse_id', 
<<<<<<< HEAD
                                                location = IFNULL((SELECT pwl.id FROM `product_warehouse_location` AS pwl WHERE pwl.warehouse_id=$to_warehouse_id AND pwl.warehouse_loc_id= $to_location_id AND pwl.item_id = ".$attr['item_id']." LIMIT 1), 0),
=======
                                                location = IFNULL((SELECT pwl.id FROM `product_warehouse_location` AS pwl WHERE pwl.warehouse_id=$to_warehouse_id AND pwl.warehouse_loc_id= $to_location_id AND pwl.item_id = " . $attr['item_id'] . " LIMIT 1), 0),
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                -- location = $to_location_id,
                                                bl_shipment_no='$attr[bl_shipment_no]',
                                                container_no='$attr[container_no]',
                                                consignment_no='$attr[consignment_no]',
                                                date_received='" . $this->objGeneral->convert_date($attr['date_received']) . "',
                                                $date_receivedUnConv
<<<<<<< HEAD
                                                order_id='".$attr['order_id']."',
                                                product_id='".$attr['item_id']."',
=======
                                                order_id='" . $attr['order_id'] . "',
                                                product_id='" . $attr['item_id'] . "',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                prod_date='" . $this->objGeneral->convert_date($attr['prod_date']) . "',
                                                status=1,
                                                quantity='$attr[req_qty]',
                                                remaining_qty='$attr[req_qty]',
                                                use_by_date='" . $this->objGeneral->convert_date($attr['use_by_date']) . "',
                                                transfer_order_date='" . $this->objGeneral->convert_date($attr['transfer_order_date']) . "',
                                                unit_measure_id='" . $attr['unit_measure_id'] . "',
                                                unit_measure_qty='1',
                                                unit_measure_name='" . $attr['uom_name'] . "',
                                                primary_unit_id='" . $attr['primary_unit_id'] . "',
                                                primary_unit_qty='1',
                                                primary_unit_name='" . $attr['primary_unit_name'] . "',
                                                sale_return_status=$sale_return_status,
<<<<<<< HEAD
                                                order_date='" . current_date. "',
                                                type='".$attr['type']."',
                                                ref_po_id='".$attr['id']."',
=======
                                                order_date='" . current_date . "',
                                                type='" . $attr['type'] . "',
                                                ref_po_id='" . $attr['id'] . "',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                ledger_type = 1,                                                
                                                AddedBy='" . $this->arrUser['id'] . "',
                                                AddedOn=UNIX_TIMESTAMP (NOW()),
                                                company_id='" . $this->arrUser['company_id'] . "',
                                                user_id='" . $this->arrUser['id'] . "',
<<<<<<< HEAD
                                                item_trace_unique_id='" . $item_trace_unique_id. "',
                                                opBalncID=" . $opBalncID. "
                                                $purchase_return_status   
                                                $purchase_status ";           
        }
        else
        {
             $from_Sql = "UPDATE warehouse_allocation 
=======
                                                item_trace_unique_id='" . $item_trace_unique_id . "',
                                                opBalncID=" . $opBalncID . "
                                                $purchase_return_status   
                                                $purchase_status ";
        } else {
            $from_Sql = "UPDATE warehouse_allocation 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                        SET
                                            quantity = '$current_qty',
                                            remaining_qty = '$current_qty',
                                            ChangedBy='" . $this->arrUser['id'] . "',
                                            ChangedOn=UNIX_TIMESTAMP (NOW())
                                            
<<<<<<< HEAD
                     where  ref_po_id='".$attr['id']."' AND 
                            product_id='".$attr['item_id']."' AND 
                            order_id = '".$attr['order_id']."' AND 
                            company_id= " . $this->arrUser['company_id'] . " AND
                            ledger_type='2' AND 
                            transfer_order_detail_id='$attr[transfer_order_detail_id]' AND
                            item_trace_unique_id='" . $item_trace_unique_id. "' AND
                            type='".$attr['type']."'";

             $to_Sql = "UPDATE warehouse_allocation 
=======
                     where  ref_po_id='" . $attr['id'] . "' AND 
                            product_id='" . $attr['item_id'] . "' AND 
                            order_id = '" . $attr['order_id'] . "' AND 
                            company_id= " . $this->arrUser['company_id'] . " AND
                            ledger_type='2' AND 
                            transfer_order_detail_id='$attr[transfer_order_detail_id]' AND
                            item_trace_unique_id='" . $item_trace_unique_id . "' AND
                            type='" . $attr['type'] . "'";

            $to_Sql = "UPDATE warehouse_allocation 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                        SET
                                            quantity = '$current_qty',
                                            remaining_qty = '$current_qty',
                                            ChangedBy='" . $this->arrUser['id'] . "',
                                            ChangedOn=UNIX_TIMESTAMP (NOW())
<<<<<<< HEAD
                     where  ref_po_id='".$attr['id']."' AND 
                            product_id='".$attr['item_id']."' AND 
                            order_id = '".$attr['order_id']."' AND 
                            company_id= " . $this->arrUser['company_id'] . " AND
                            ledger_type='1' AND 
                            transfer_order_detail_id='$attr[transfer_order_detail_id]' AND
                            item_trace_unique_id='" . $item_trace_unique_id. "' AND
                            type='".$attr['type']."'";            
=======
                     where  ref_po_id='" . $attr['id'] . "' AND 
                            product_id='" . $attr['item_id'] . "' AND 
                            order_id = '" . $attr['order_id'] . "' AND 
                            company_id= " . $this->arrUser['company_id'] . " AND
                            ledger_type='1' AND 
                            transfer_order_detail_id='$attr[transfer_order_detail_id]' AND
                            item_trace_unique_id='" . $item_trace_unique_id . "' AND
                            type='" . $attr['type'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        }

        // echo $to_Sql; exit;
        $RS = $this->objsetup->CSI($from_Sql);
        $RS = $this->objsetup->CSI($to_Sql);

<<<<<<< HEAD
        if($update_id == '')
            $id = $this->Conn->Insert_ID();
        else{
            $id = $attr['id'];
        }
        
=======
        if ($update_id == '')
            $id = $this->Conn->Insert_ID();
        else {
            $id = $attr['id'];
        }

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if ($id > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;

            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;

            $opBalncID = ($attr['opBalncID'] != '') ? $attr['opBalncID'] : 0;

<<<<<<< HEAD
            if($attr['source_type'] == 4)
            {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty = temp_allocated_qty + $attr[req_qty] WHERE id = $opBalncID";
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            }
            else if($attr['source_type'] == 5)
            {
=======
            if ($attr['source_type'] == 4) {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty = temp_allocated_qty + $attr[req_qty] WHERE id = $opBalncID";
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            } else if ($attr['source_type'] == 5) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty_returned = temp_allocated_qty_returned + $attr[req_qty] WHERE id = $opBalncID";
                $RS = $this->objsetup->CSI($Sql);
            }
        } else {
            $response['id'] = 0;
            $response['ack'] = 0;
            $response['error'] = 'Record Can not be updated';
        }
        return $response;
    }

    function addPurchaseOrderStockAllocation($attr)
<<<<<<< HEAD
    {        
=======
    {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        /* 
        $order_date = isset($attr['order_date']) ? '"' . $attr['order_date'] . '"' : '';

        if (strpos($attr['order_date'], '/') == true) {
            $order_date = str_replace('/', '-', $attr['order_date']);
            $order_date = $order_date;
        } 
        */

        // $sale_return_status = 0;
        // $purchase_return_status = 0;
        // $purchase_status = 0;
<<<<<<< HEAD
        
        $purchase_return_status = (isset($attr['purchase_return_status']) && $attr['purchase_return_status'] != '')? $attr['purchase_return_status']: 0;  
        $purchase_status = (isset($attr['purchase_status']) && $attr['purchase_status'] != '')? $attr['purchase_status']: 0;  
        $sale_return_status = (isset($attr['sale_return_status']) && $attr['sale_return_status'] != '')? $attr['sale_return_status']: 0;          
=======

        $purchase_return_status = (isset($attr['purchase_return_status']) && $attr['purchase_return_status'] != '') ? $attr['purchase_return_status'] : 0;
        $purchase_status = (isset($attr['purchase_status']) && $attr['purchase_status'] != '') ? $attr['purchase_status'] : 0;
        $sale_return_status = (isset($attr['sale_return_status']) && $attr['sale_return_status'] != '') ? $attr['sale_return_status'] : 0;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        // if (isset($attr['sale_return_status']))
        //     $sale_return_status = $attr['sale_return_status'];

        // if (!empty($attr['purchase_return_status']))
        //     $purchase_return_status = " , purchase_return_status = 1 ";
        // else
        //     $purchase_return_status = " , purchase_return_status = 0 ";

        // if (!empty($attr['purchase_status']))
        //     $purchase_status = " , purchase_status = 0 ";
        //     $purchase_status = " , purchase_status = 2 ";

        $id = $attr['id'];

        if (empty($id))
<<<<<<< HEAD
            $id = (isset($attr['update_id']) && $attr['update_id'] != '')? $attr['update_id']: 0;
        // $id = $attr['update_id'];

        $location_id = (isset($attr['wh_location'])) ? $attr['wh_location'] : $attr['WH_loc_id'];
        $unit_id = (isset($attr['unit_id']) && $attr['unit_id']!='')?$attr['unit_id']:0;
        $unit_of_measure_name = (isset($attr['unit_of_measure_name']) && $attr['unit_of_measure_name']!='')?$attr['unit_of_measure_name']:0;
        $primary_unit_id = (isset($attr['primary_unit_id']) && $attr['primary_unit_id']!='')?$attr['primary_unit_id']:0;
        $req_qty = (isset($attr['req_qty']) && $attr['req_qty']!='')?$attr['req_qty']:0;
        $warehouse_id = (isset($attr['warehouse_id']) && $attr['warehouse_id']!='')?$attr['warehouse_id']:0;
        $supplier_id = (isset($attr['supplier_id']) && $attr['supplier_id']!='')?$attr['supplier_id']:0;
        $purchase_order_detail_id = (isset($attr['purchase_order_detail_id']) && $attr['purchase_order_detail_id']!='')?$attr['purchase_order_detail_id']:0;
        $order_id = (isset($attr['order_id']) && $attr['order_id']!='')?$attr['order_id']:0;
        $item_id = (isset($attr['product_id']) && $attr['product_id']!='')?$attr['product_id']:0;

        $current_qty = $req_qty;
        $update_check = "";
        $update_id = ""; 

        if ($id > 0)
            $update_check = "  AND tst.id != " . $id . " ";       
=======
            $id = (isset($attr['update_id']) && $attr['update_id'] != '') ? $attr['update_id'] : 0;
        // $id = $attr['update_id'];

        $location_id = (isset($attr['wh_location'])) ? $attr['wh_location'] : $attr['WH_loc_id'];
        $unit_id = (isset($attr['unit_id']) && $attr['unit_id'] != '') ? $attr['unit_id'] : 0;
        $unit_of_measure_name = (isset($attr['unit_of_measure_name']) && $attr['unit_of_measure_name'] != '') ? $attr['unit_of_measure_name'] : 0;
        $primary_unit_id = (isset($attr['primary_unit_id']) && $attr['primary_unit_id'] != '') ? $attr['primary_unit_id'] : 0;
        $req_qty = (isset($attr['req_qty']) && $attr['req_qty'] != '') ? $attr['req_qty'] : 0;
        $warehouse_id = (isset($attr['warehouse_id']) && $attr['warehouse_id'] != '') ? $attr['warehouse_id'] : 0;
        $supplier_id = (isset($attr['supplier_id']) && $attr['supplier_id'] != '') ? $attr['supplier_id'] : 0;
        $purchase_order_detail_id = (isset($attr['purchase_order_detail_id']) && $attr['purchase_order_detail_id'] != '') ? $attr['purchase_order_detail_id'] : 0;
        $order_id = (isset($attr['order_id']) && $attr['order_id'] != '') ? $attr['order_id'] : 0;
        $item_id = (isset($attr['product_id']) && $attr['product_id'] != '') ? $attr['product_id'] : 0;

        $current_qty = $req_qty;
        $update_check = "";
        $update_id = "";

        if ($id > 0)
            $update_check = "  AND tst.id != " . $id . " ";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $duplicate_SQL = "SELECT * 
                          FROM warehouse_allocation 
                          where order_id = '$order_id' and 
                                supplier_id = '$supplier_id' and
                                purchase_return_status = 1 AND
                                purchase_order_detail_id='$purchase_order_detail_id' AND
<<<<<<< HEAD
                                ref_po_id='".$attr['id']."' AND 
=======
                                ref_po_id='" . $attr['id'] . "' AND 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                item_trace_unique_id='" . $attr['item_trace_unique_id'] . "' AND
                                product_id = '$item_id'";

        // echo $duplicate_SQL;exit;
<<<<<<< HEAD
                                
                                
        $RS = $this->objsetup->CSI($duplicate_SQL);
        if ($RS->RecordCount() > 0) {
             while ($Row = $RS->FetchRow()) {
                $update_id   = $Row['id'];
                $ref_po_id   = $Row['ref_po_id'];
                $current_qty =  intval($attr['req_qty']) + intval($Row['quantity']);
            }  
        }  
        // wh_location in case of credit note        
        // $warehouse_id = (isset($attr['targeted_warehouse_id'])) ? $attr['targeted_warehouse_id'] : $attr['warehouse_id'];
        
        // echo $duplicate_SQL;exit;
        //unit_measure_qty='" . $attr['units']->quantity . "',
        // order_date='" . $this->objGeneral->convert_date($order_date). "',
        
        $date_receivedUnConv = ""; 

        if($attr['date_received'] > 0){
            $date_receivedUnConv = "date_receivedUnConv = '" . $this->objGeneral->convertUnixDateIntoConvDate($attr['date_received']) . "',";            
        }

        if($attr['supplierCreditNoteDate'])
            $order_date = $this->objGeneral->convert_date($attr['supplierCreditNoteDate']);
        else
            $order_date = current_date;        

        if($update_id >0){ 
=======


        $RS = $this->objsetup->CSI($duplicate_SQL);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $update_id   = $Row['id'];
                $ref_po_id   = $Row['ref_po_id'];
                $current_qty =  intval($attr['req_qty']) + intval($Row['quantity']);
            }
        }
        // wh_location in case of credit note        
        // $warehouse_id = (isset($attr['targeted_warehouse_id'])) ? $attr['targeted_warehouse_id'] : $attr['warehouse_id'];

        // echo $duplicate_SQL;exit;
        //unit_measure_qty='" . $attr['units']->quantity . "',
        // order_date='" . $this->objGeneral->convert_date($order_date). "',

        $date_receivedUnConv = "";

        if ($attr['date_received'] > 0) {
            $date_receivedUnConv = "date_receivedUnConv = '" . $this->objGeneral->convertUnixDateIntoConvDate($attr['date_received']) . "',";
        }

        if ($attr['supplierCreditNoteDate'])
            $order_date = $this->objGeneral->convert_date($attr['supplierCreditNoteDate']);
        else
            $order_date = current_date;

        if ($update_id > 0) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $Sql = "UPDATE warehouse_allocation 
                                        SET
                                            quantity = '$current_qty',
                                            remaining_qty = '$current_qty',
<<<<<<< HEAD
                                            order_date = '" . $order_date. "',
                                            ChangedBy = '" . $this->arrUser['id'] . "',
                                            ChangedOn = UNIX_TIMESTAMP (NOW())
                    where   ref_po_id='".$attr['id']."' AND 
=======
                                            order_date = '" . $order_date . "',
                                            ChangedBy = '" . $this->arrUser['id'] . "',
                                            ChangedOn = UNIX_TIMESTAMP (NOW())
                    where   ref_po_id='" . $attr['id'] . "' AND 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            supplier_id='$supplier_id' AND 
                            product_id='$item_id' AND 
                            order_id = '$order_id' AND 
                            purchase_return_status = 1 AND
                            item_trace_unique_id='" . $attr['item_trace_unique_id'] . "' AND
                            purchase_order_detail_id='$purchase_order_detail_id' AND
<<<<<<< HEAD
                            type='1'";          
        }
        else
        {        
=======
                            type='1'";
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $Sql = "INSERT INTO warehouse_allocation 
                                        SET 
                                            batch_no='$attr[batch_no]',
                                            purchase_order_detail_id='$purchase_order_detail_id', 
                                            warehouse_id='$warehouse_id', 
                                            supplier_id='$supplier_id', 
                                            location = '$location_id',
                                            bl_shipment_no='$attr[bl_shipment_no]',
                                            container_no='$attr[container_no]',
                                            date_received='" . $this->objGeneral->convert_date($attr['date_received']) . "',
                                            $date_receivedUnConv
                                            order_id='$order_id',
                                            product_id='$item_id',
                                            prod_date='" . $this->objGeneral->convert_date($attr['prod_date']) . "',
                                            status=1,
                                            quantity='$req_qty',
                                            remaining_qty='$req_qty',
                                            use_by_date='" . $this->objGeneral->convert_date($attr['use_by_date']) . "',
<<<<<<< HEAD
                                            unit_measure_id='" . $unit_id. "',
=======
                                            unit_measure_id='" . $unit_id . "',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                            unit_measure_qty=1,
                                            unit_measure_name='" . $unit_of_measure_name . "',
                                            primary_unit_id='" . $primary_unit_id . "',
                                            primary_unit_qty='1',
                                            primary_unit_name='" . $attr['primary_unit_name'] . "',
                                            sale_return_status='" . $sale_return_status . "',
<<<<<<< HEAD
                                            order_date='" . $order_date. "',
                                            type='".$attr['type']."',
                                            ref_po_id='".$attr['id']."',
                                            company_id='" . $this->arrUser['company_id'] . "',
                                            user_id='" . $this->arrUser['id'] . "',
                                            item_trace_unique_id='" . $attr['item_trace_unique_id'] . "',
                                            purchase_return_status ='".$purchase_return_status."',
                                            purchase_status ='".$purchase_status."',
                                            AddedBy='" . $this->arrUser['id'] . "',
                                            AddedOn=UNIX_TIMESTAMP (NOW())";            
=======
                                            order_date='" . $order_date . "',
                                            type='" . $attr['type'] . "',
                                            ref_po_id='" . $attr['id'] . "',
                                            company_id='" . $this->arrUser['company_id'] . "',
                                            user_id='" . $this->arrUser['id'] . "',
                                            item_trace_unique_id='" . $attr['item_trace_unique_id'] . "',
                                            purchase_return_status ='" . $purchase_return_status . "',
                                            purchase_status ='" . $purchase_status . "',
                                            AddedBy='" . $this->arrUser['id'] . "',
                                            AddedOn=UNIX_TIMESTAMP (NOW())";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        }

        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

<<<<<<< HEAD
        if($update_id == '')
            $id = $this->Conn->Insert_ID();
        else
            $id = $attr['id'];
        
=======
        if ($update_id == '')
            $id = $this->Conn->Insert_ID();
        else
            $id = $attr['id'];

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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

    function getPurchaseOrderStockAllocation($attr)
    {
        //print_r($attr);//exit;
        $this->objGeneral->mysql_clean($attr);
        $where_clause = "";
        $response = array();
<<<<<<< HEAD
        
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (!empty($attr['purchaseOrder']))
            $where_clause .= " AND wa.type = 1 AND wa.purchase_return_status = 0 ";

        if (!empty($attr['purchaseReturn']))
<<<<<<< HEAD
            $where_clause .= " AND wa.type = 1 AND wa.purchase_return_status = 1 ";       
            
=======
            $where_clause .= " AND wa.type = 1 AND wa.purchase_return_status = 1 ";

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $wh_id = $attr['wh_id'] != '' ? $attr['wh_id'] : '0';

        $Sql = "SELECT sum(quantity) as total_qty, wa.* 
                FROM warehouse_allocation as wa
                LEFT JOIN company on company.id=wa.company_id
                WHERE wa.product_id = " . $attr['item_id'] . " AND 
                      wa.order_id = " . $attr['order_id'] . " AND 
<<<<<<< HEAD
                      wa.company_id=". $this->arrUser['company_id'] ." $where_clause  AND 
                      wa.warehouse_id = $wh_id  AND 
                      wa.purchase_order_detail_id = ".$attr['purchase_order_detail_id']."
=======
                      wa.company_id=" . $this->arrUser['company_id'] . " $where_clause  AND 
                      wa.warehouse_id = $wh_id  AND 
                      wa.purchase_order_detail_id = " . $attr['purchase_order_detail_id'] . "
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                group by wa.container_no";

        // echo $Sql ;exit;

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
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
<<<<<<< HEAD
            $response['total'] = $total;
=======
            $response['total'] = 0;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function get_order_stock_allocation($attr)
    {
        // print_r($attr);exit;
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";


        $response = array();
<<<<<<< HEAD
        
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (!empty($attr['sale_order']))
            $where_clause .= " AND wa.type = 2 AND wa.sale_return_status = 0 ";
        if (!empty($attr['sale_return']))
            $where_clause .= " AND wa.type = 2 AND wa.sale_return_status = 1 ";
        if (!empty($attr['sale_order_detail_id']))
<<<<<<< HEAD
            $where_clause .= " AND wa.sale_order_detail_id = ".$attr['sale_order_detail_id'];
        
        if (!empty($attr['item_journal']))
            $where_clause .= " AND wa.type = 3 AND wa.ledger_type IN (1,2)";
        if (!empty($attr['item_journal_detail_id']))
            $where_clause .= " AND wa.item_journal_detail_id = ".$attr['item_journal_detail_id'];
        
        if (!empty($attr['transfer_order']))
            $where_clause .= " AND wa.type = 5 AND wa.ledger_type IN (2)";
        if (!empty($attr['transfer_order_detail_id']))
            $where_clause .= " AND wa.transfer_order_detail_id = ".$attr['transfer_order_detail_id'];
        
=======
            $where_clause .= " AND wa.sale_order_detail_id = " . $attr['sale_order_detail_id'];

        if (!empty($attr['item_journal']))
            $where_clause .= " AND wa.type = 3 AND wa.ledger_type IN (1,2)";
        if (!empty($attr['item_journal_detail_id']))
            $where_clause .= " AND wa.item_journal_detail_id = " . $attr['item_journal_detail_id'];

        if (!empty($attr['transfer_order']))
            $where_clause .= " AND wa.type = 5 AND wa.ledger_type IN (2)";
        if (!empty($attr['transfer_order_detail_id']))
            $where_clause .= " AND wa.transfer_order_detail_id = " . $attr['transfer_order_detail_id'];

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $wh_id = $attr['wh_id'] != '' ? $attr['wh_id'] : '0';

        $Sql = "SELECT sum(quantity) as total_qty, wa.* FROM
		warehouse_allocation as wa
		WHERE wa.product_id = " . $attr['item_id'] . " AND wa.order_id = " . $attr['order_id'] . "
<<<<<<< HEAD
		AND wa.company_id=". $this->arrUser['company_id'] ." AND wa.warehouse_id = $wh_id ". $where_clause . "
=======
		AND wa.company_id=" . $this->arrUser['company_id'] . " AND wa.warehouse_id = $wh_id " . $where_clause . "
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		group by wa.container_no";
        // echo $Sql ;exit;

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
                $result['sale_status'] = $Row['sale_status'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
<<<<<<< HEAD
            $response['total'] = $total;
=======
            $response['total'] = 0;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        } else {
            // $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function deleteDebitNoteStock($attr)
<<<<<<< HEAD
    { 
        // echo "<pre>";print_r($attr);exit; 
        
=======
    {
        // echo "<pre>";print_r($attr);exit; 

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        /* $Sql = "DELETE FROM warehouse_allocation 
                WHERE item_trace_unique_id = '".$attr['postData']->item_trace_unique_id ."' AND 
                                            order_id = '".$attr['postData']->order_id ."' AND 
                                            type = 1 and 
                                            product_id = '".$attr['postData']->product_id."' AND 
                                            purchase_return_status = 1";  */

        $Sql = "DELETE FROM warehouse_allocation 
<<<<<<< HEAD
                WHERE order_id = '".$attr['order_id'] ."' AND 
                      type = 1 AND 
                      purchase_status = 1 AND
                      purchase_order_detail_id = '".$attr['purchase_order_detail_id'] ."' AND 
                      purchase_return_status = 1"; 
         
=======
                WHERE order_id = '" . $attr['order_id'] . "' AND 
                      type = 1 AND 
                      purchase_status = 1 AND
                      purchase_order_detail_id = '" . $attr['purchase_order_detail_id'] . "' AND 
                      purchase_return_status = 1";

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // echo $Sql; exit;
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

    function deallocateDebitNotestock($attr)
    {
        // echo "<pre>";print_r($attr);exit; 
<<<<<<< HEAD
        
        $Sql = "update warehouse_allocation 
                                    set 
                                        quantity = quantity - ".$attr['req_qty'].",
                                        ChangedBy='" . $this->arrUser['id'] . "',
                                        ChangedOn=UNIX_TIMESTAMP (NOW())
                                    WHERE   ref_po_id='".$attr['ref_po_id']."' AND 
                                            supplier_id='".$attr['supplier_id']."' AND 
                                            product_id='".$attr['product_id']."' AND 
                                            order_id = '".$attr['order_id'] ."' AND 
                                            item_trace_unique_id='" . $attr['item_trace_unique_id']. "' AND
                                            purchase_status = 1 AND
                                            purchase_order_detail_id = '".$attr['purchase_order_detail_id'] ."' AND 
                                            purchase_return_status = 1 AND
                                            type=1 ";          
         
=======

        $Sql = "update warehouse_allocation 
                                    set 
                                        quantity = quantity - " . $attr['req_qty'] . ",
                                        ChangedBy='" . $this->arrUser['id'] . "',
                                        ChangedOn=UNIX_TIMESTAMP (NOW())
                                    WHERE   ref_po_id='" . $attr['ref_po_id'] . "' AND 
                                            supplier_id='" . $attr['supplier_id'] . "' AND 
                                            product_id='" . $attr['product_id'] . "' AND 
                                            order_id = '" . $attr['order_id'] . "' AND 
                                            item_trace_unique_id='" . $attr['item_trace_unique_id'] . "' AND
                                            purchase_status = 1 AND
                                            purchase_order_detail_id = '" . $attr['purchase_order_detail_id'] . "' AND 
                                            purchase_return_status = 1 AND
                                            type=1 ";

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // echo $Sql; exit; 

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

    function delete_sale_order_stock($attr)
    {
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;

        $v_sql = "SELECT SUM(quantity) AS qty
                    FROM warehouse_allocation AS wh_alloc, orders AS o
                    WHERE
                        o.id = wh_alloc.order_id AND
                        wh_alloc.type = 2 AND 
                        wh_alloc.company_id= " . $this->arrUser['company_id'] . " AND
<<<<<<< HEAD
                        wh_alloc.sale_return_status = ".$attr['postData']->sale_return_status." AND
                        wh_alloc.sale_order_detail_id = ".$attr['postData']->sale_order_detail_id." AND
                        wh_alloc.product_id = ".$attr['postData']->item_id;
=======
                        wh_alloc.sale_return_status = " . $attr['postData']->sale_return_status . " AND
                        wh_alloc.sale_order_detail_id = " . $attr['postData']->sale_order_detail_id . " AND
                        wh_alloc.product_id = " . $attr['postData']->item_id;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // echo $v_sql;exit;
        $v_RS = $this->objsetup->CSI($v_sql);
        $validate_remaining_to_allocate = $v_RS->fields['qty'];
        // echo $attr['postData']->req_qty;exit;
<<<<<<< HEAD
        if($validate_remaining_to_allocate < $attr['postData']->req_qty)
        {
=======
        if ($validate_remaining_to_allocate < $attr['postData']->req_qty) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $response['ack'] = 0;
            $response['error'] = 'The quantity to deallocate is greater than the quantity already allocated !';
        }



<<<<<<< HEAD
        $sale_return_status = (isset($attr['postData']->sale_return_status)) ? " AND sale_return_status = ".$attr['postData']->sale_return_status : '';
        $warehouse_id = (isset($attr['postData']->targeted_warehouse_id)) ? " AND warehouse_id = ".$attr['postData']->targeted_warehouse_id : " AND warehouse_id = ".$attr['postData']->warehouse_id;
        
        $Sql = "DELETE FROM warehouse_allocation 
                WHERE order_id = '".$attr['postData']->order_id ."' AND 
                      ref_po_id = '".$attr['postData']->id ."' AND 
                      company_id= " . $this->arrUser['company_id'] . " AND
                      type = 2 and 
                      product_id = '".$attr['postData']->product_id."' AND 
                      location = '".$attr['postData']->WH_loc_id."'   
                      $warehouse_id 
                      $sale_return_status
                      ";       
         
        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);
        
=======
        $sale_return_status = (isset($attr['postData']->sale_return_status)) ? " AND sale_return_status = " . $attr['postData']->sale_return_status : '';
        $warehouse_id = (isset($attr['postData']->targeted_warehouse_id)) ? " AND warehouse_id = " . $attr['postData']->targeted_warehouse_id : " AND warehouse_id = " . $attr['postData']->warehouse_id;

        $Sql = "DELETE FROM warehouse_allocation 
                WHERE order_id = '" . $attr['postData']->order_id . "' AND 
                      ref_po_id = '" . $attr['postData']->id . "' AND 
                      company_id= " . $this->arrUser['company_id'] . " AND
                      type = 2 and 
                      product_id = '" . $attr['postData']->product_id . "' AND 
                      location = '" . $attr['postData']->WH_loc_id . "'   
                      $warehouse_id 
                      $sale_return_status
                      ";

        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if ($this->Conn->_affected > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $opBalncID = ($attr['postData']->opBalncID != '') ? $attr['postData']->opBalncID : 0;
<<<<<<< HEAD
            if($attr['postData']->source_type == 4)
            {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty = temp_allocated_qty - ".$attr['postData']->req_qty." WHERE id = ".$opBalncID;
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            }
            else if($attr['postData']->source_type == 5)
            {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty_returned = temp_allocated_qty_returned - ".$attr['postData']->req_qty." WHERE id = ".$opBalncID;
=======
            if ($attr['postData']->source_type == 4) {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty = temp_allocated_qty - " . $attr['postData']->req_qty . " WHERE id = " . $opBalncID;
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            } else if ($attr['postData']->source_type == 5) {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty_returned = temp_allocated_qty_returned - " . $attr['postData']->req_qty . " WHERE id = " . $opBalncID;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            }
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated!';
        }

        return $response;
    }
    function delete_item_journal_stock($attr)
    {
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;

        $v_sql = "SELECT SUM(quantity) AS qty
                    FROM warehouse_allocation AS wh_alloc, orders AS o
                    WHERE
                        o.id = wh_alloc.order_id AND
                        wh_alloc.type = 3 AND 
                        wh_alloc.company_id= " . $this->arrUser['company_id'] . " AND
<<<<<<< HEAD
                        wh_alloc.ledger_type = ".$attr['postData']->ledger_type." AND
                        wh_alloc.item_journal_detail_id = ".$attr['postData']->item_journal_detail_id." AND
                        wh_alloc.product_id = ".$attr['postData']->item_id;
=======
                        wh_alloc.ledger_type = " . $attr['postData']->ledger_type . " AND
                        wh_alloc.item_journal_detail_id = " . $attr['postData']->item_journal_detail_id . " AND
                        wh_alloc.product_id = " . $attr['postData']->item_id;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // echo $v_sql;exit;
        $v_RS = $this->objsetup->CSI($v_sql);
        $validate_remaining_to_allocate = $v_RS->fields['qty'];
        // echo $attr['postData']->req_qty;exit;
<<<<<<< HEAD
        if($validate_remaining_to_allocate < $attr['postData']->req_qty)
        {
=======
        if ($validate_remaining_to_allocate < $attr['postData']->req_qty) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $response['ack'] = 0;
            $response['error'] = 'The quantity to deallocate is greater than the quantity already allocated !';
        }



        // $sale_return_status = (isset($attr['postData']->sale_return_status)) ? " AND sale_return_status = ".$attr['postData']->sale_return_status : '';
<<<<<<< HEAD
        $warehouse_id = (isset($attr['postData']->targeted_warehouse_id)) ? " AND warehouse_id = ".$attr['postData']->targeted_warehouse_id : " AND warehouse_id = ".$attr['postData']->warehouse_id;
        
        $Sql = "DELETE FROM warehouse_allocation 
                WHERE order_id = '".$attr['postData']->order_id ."' AND 
                      ref_po_id = '".$attr['postData']->id ."' AND 
                      company_id= " . $this->arrUser['company_id'] . " AND
                      type = 3 and 
                      product_id = '".$attr['postData']->product_id."' AND 
                      location = '".$attr['postData']->WH_loc_id."'   
                      $warehouse_id 
                      ";       
         
=======
        $warehouse_id = (isset($attr['postData']->targeted_warehouse_id)) ? " AND warehouse_id = " . $attr['postData']->targeted_warehouse_id : " AND warehouse_id = " . $attr['postData']->warehouse_id;

        $Sql = "DELETE FROM warehouse_allocation 
                WHERE order_id = '" . $attr['postData']->order_id . "' AND 
                      ref_po_id = '" . $attr['postData']->id . "' AND 
                      company_id= " . $this->arrUser['company_id'] . " AND
                      type = 3 and 
                      product_id = '" . $attr['postData']->product_id . "' AND 
                      location = '" . $attr['postData']->WH_loc_id . "'   
                      $warehouse_id 
                      ";

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
<<<<<<< HEAD
            
            $opBalncID = ($attr['postData']->opBalncID != '') ? $attr['postData']->opBalncID : 0;
            
            if($attr['postData']->source_type == 4)
            {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty = temp_allocated_qty - ".$attr['postData']->req_qty." WHERE id = ".$opBalncID;
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            }
            else if($attr['postData']->source_type == 5)
            {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty_returned = temp_allocated_qty_returned - ".$attr['postData']->req_qty." WHERE id = ".$opBalncID;
=======

            $opBalncID = ($attr['postData']->opBalncID != '') ? $attr['postData']->opBalncID : 0;

            if ($attr['postData']->source_type == 4) {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty = temp_allocated_qty - " . $attr['postData']->req_qty . " WHERE id = " . $opBalncID;
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            } else if ($attr['postData']->source_type == 5) {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty_returned = temp_allocated_qty_returned - " . $attr['postData']->req_qty . " WHERE id = " . $opBalncID;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            }

            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated!';
        }

        return $response;
    }
<<<<<<< HEAD
    
    function delete_item_transfer_order($attr)
    {
        
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;

        
=======

    function delete_item_transfer_order($attr)
    {

        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;


>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $v_sql = "SELECT SUM(quantity) AS qty
                    FROM warehouse_allocation AS wh_alloc, orders AS o
                    WHERE
                        o.id = wh_alloc.order_id AND
                        wh_alloc.type = 5 AND 
                        wh_alloc.company_id= " . $this->arrUser['company_id'] . " AND
<<<<<<< HEAD
                        wh_alloc.ledger_type = ".$attr['postData']->ledger_type." AND
                        wh_alloc.transfer_order_detail_id = ".$attr['postData']->transfer_order_detail_id." AND
                        wh_alloc.product_id = ".$attr['postData']->item_id;
=======
                        wh_alloc.ledger_type = " . $attr['postData']->ledger_type . " AND
                        wh_alloc.transfer_order_detail_id = " . $attr['postData']->transfer_order_detail_id . " AND
                        wh_alloc.product_id = " . $attr['postData']->item_id;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // echo $v_sql;exit;
        $v_RS = $this->objsetup->CSI($v_sql);
        $validate_remaining_to_allocate = $v_RS->fields['qty'];
        // echo $attr['postData']->req_qty;exit;
<<<<<<< HEAD
        if($validate_remaining_to_allocate < $attr['postData']->req_qty)
        {
=======
        if ($validate_remaining_to_allocate < $attr['postData']->req_qty) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $response['ack'] = 0;
            $response['error'] = 'The quantity to deallocate is greater than the quantity already allocated !';
        }



        // $sale_return_status = (isset($attr['postData']->sale_return_status)) ? " AND sale_return_status = ".$attr['postData']->sale_return_status : '';
<<<<<<< HEAD
        $warehouse_id = (isset($attr['postData']->targeted_warehouse_id)) ? " AND warehouse_id = ".$attr['postData']->targeted_warehouse_id : " AND warehouse_id = ".$attr['postData']->warehouse_id;
        
        $Sql = "DELETE FROM warehouse_allocation 
                WHERE order_id = '".$attr['postData']->order_id ."' AND 
                      ref_po_id = '".$attr['postData']->id ."' AND 
                      company_id= " . $this->arrUser['company_id'] . " AND
                      type = 5 and 
                      product_id = '".$attr['postData']->product_id."' AND 
                      transfer_order_detail_id = ".$attr['postData']->transfer_order_detail_id."
                      ";       
         
=======
        $warehouse_id = (isset($attr['postData']->targeted_warehouse_id)) ? " AND warehouse_id = " . $attr['postData']->targeted_warehouse_id : " AND warehouse_id = " . $attr['postData']->warehouse_id;

        $Sql = "DELETE FROM warehouse_allocation 
                WHERE order_id = '" . $attr['postData']->order_id . "' AND 
                      ref_po_id = '" . $attr['postData']->id . "' AND 
                      company_id= " . $this->arrUser['company_id'] . " AND
                      type = 5 and 
                      product_id = '" . $attr['postData']->product_id . "' AND 
                      transfer_order_detail_id = " . $attr['postData']->transfer_order_detail_id . "
                      ";

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
<<<<<<< HEAD
            
            $opBalncID = ($attr['postData']->opBalncID != '') ? $attr['postData']->opBalncID : 0;
            if($attr['postData']->source_type == 4)
            {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty = temp_allocated_qty - ".$attr['postData']->req_qty." WHERE id = ".$opBalncID;
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            }
            else if($attr['postData']->source_type == 5)
            {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty_returned = temp_allocated_qty_returned - ".$attr['postData']->req_qty." WHERE id = ".$opBalncID;
=======

            $opBalncID = ($attr['postData']->opBalncID != '') ? $attr['postData']->opBalncID : 0;
            if ($attr['postData']->source_type == 4) {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty = temp_allocated_qty - " . $attr['postData']->req_qty . " WHERE id = " . $opBalncID;
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            } else if ($attr['postData']->source_type == 5) {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty_returned = temp_allocated_qty_returned - " . $attr['postData']->req_qty . " WHERE id = " . $opBalncID;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            }

            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated!';
        }

        return $response;
    }
    function deallocate_sale_order_stock($attr)
    {
<<<<<<< HEAD
     
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;

        $sale_return_status = (isset($attr['postData']->sale_return_status)) ? " AND sale_return_status = ".$attr['postData']->sale_return_status : '';
        $warehouse_id = (isset($attr['postData']->targeted_warehouse_id)) ? " AND warehouse_id = ".$attr['postData']->targeted_warehouse_id : " AND warehouse_id = ".$attr['postData']->warehouse_id;
        
        $v_sql = "SELECT SUM(quantity) AS qty
                    FROM warehouse_allocation
                    WHERE 
                        order_id = '".$attr['postData']->order_id ."' AND 
                        ref_po_id = '".$attr['postData']->id ."' AND 
                        company_id= " . $this->arrUser['company_id'] . " AND
                        type = 2 and product_id = '".$attr['postData']->product_id."' AND 
                        location = '".$attr['postData']->WH_loc_id."'           
=======

        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;

        $sale_return_status = (isset($attr['postData']->sale_return_status)) ? " AND sale_return_status = " . $attr['postData']->sale_return_status : '';
        $warehouse_id = (isset($attr['postData']->targeted_warehouse_id)) ? " AND warehouse_id = " . $attr['postData']->targeted_warehouse_id : " AND warehouse_id = " . $attr['postData']->warehouse_id;

        $v_sql = "SELECT SUM(quantity) AS qty
                    FROM warehouse_allocation
                    WHERE 
                        order_id = '" . $attr['postData']->order_id . "' AND 
                        ref_po_id = '" . $attr['postData']->id . "' AND 
                        company_id= " . $this->arrUser['company_id'] . " AND
                        type = 2 and product_id = '" . $attr['postData']->product_id . "' AND 
                        location = '" . $attr['postData']->WH_loc_id . "'           
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $warehouse_id 
                        $sale_return_status";
        // echo $v_sql;exit;
        $v_RS = $this->objsetup->CSI($v_sql);
        $validate_already_allocated = $v_RS->fields['qty'];
        // echo $attr['postData']->req_qty;exit;
        // echo $validate_already_allocated;exit;
<<<<<<< HEAD
        if($attr['postData']->req_qty > $validate_already_allocated)
        {
=======
        if ($attr['postData']->req_qty > $validate_already_allocated) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $response['ack'] = 0;
            $response['error'] = 'The quantity to deallocate is greater than the quantity already allocated !';
            return $response;
        }

        $Sql = "UPDATE warehouse_allocation 
                SET 
<<<<<<< HEAD
                    quantity = quantity - ".$attr['postData']->req_qty.",
                    ChangedBy='" . $this->arrUser['id'] . "',
                    ChangedOn=UNIX_TIMESTAMP (NOW())
                WHERE 
                order_id = '".$attr['postData']->order_id ."' AND 
                company_id= " . $this->arrUser['company_id'] . " AND
                ref_po_id = '".$attr['postData']->id ."' AND 
                type = 2 and product_id = '".$attr['postData']->product_id."' AND 
                location = '".$attr['postData']->WH_loc_id."'           
                $warehouse_id 
                $sale_return_status
                ";        
         
=======
                    quantity = quantity - " . $attr['postData']->req_qty . ",
                    ChangedBy='" . $this->arrUser['id'] . "',
                    ChangedOn=UNIX_TIMESTAMP (NOW())
                WHERE 
                order_id = '" . $attr['postData']->order_id . "' AND 
                company_id= " . $this->arrUser['company_id'] . " AND
                ref_po_id = '" . $attr['postData']->id . "' AND 
                type = 2 and product_id = '" . $attr['postData']->product_id . "' AND 
                location = '" . $attr['postData']->WH_loc_id . "'           
                $warehouse_id 
                $sale_return_status
                ";

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $opBalncID = ($attr['postData']->opBalncID != '') ? $attr['postData']->opBalncID : 0;
<<<<<<< HEAD
            if($attr['postData']->source_type == 4)
            {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty = temp_allocated_qty - ".$attr['postData']->req_qty." WHERE id = ".$opBalncID;
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            }
            else if($attr['postData']->source_type == 5)
            {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty_returned = temp_allocated_qty_returned - ".$attr['postData']->req_qty." WHERE id = ".$opBalncID;
=======
            if ($attr['postData']->source_type == 4) {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty = temp_allocated_qty - " . $attr['postData']->req_qty . " WHERE id = " . $opBalncID;
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            } else if ($attr['postData']->source_type == 5) {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty_returned = temp_allocated_qty_returned - " . $attr['postData']->req_qty . " WHERE id = " . $opBalncID;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            }

            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated!';
        }

        return $response;
    }

    function deallocate_item_journal_stock($attr)
    {
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;

<<<<<<< HEAD
        $sale_return_status = (isset($attr['postData']->sale_return_status)) ? " AND sale_return_status = ".$attr['postData']->sale_return_status : '';
        $warehouse_id = (isset($attr['postData']->targeted_warehouse_id)) ? " AND warehouse_id = ".$attr['postData']->targeted_warehouse_id : " AND warehouse_id = ".$attr['postData']->warehouse_id;
        
        $v_sql = "SELECT SUM(quantity) AS qty
                    FROM warehouse_allocation
                    WHERE 
                        order_id = '".$attr['postData']->order_id ."' AND 
                        ref_po_id = '".$attr['postData']->id ."' AND 
                        company_id= " . $this->arrUser['company_id'] . " AND
                        item_journal_detail_id = '".$attr['postData']->item_journal_detail_id ."' AND
                        type = 3 and product_id = '".$attr['postData']->product_id."' AND 
                        location = '".$attr['postData']->WH_loc_id."'           
=======
        $sale_return_status = (isset($attr['postData']->sale_return_status)) ? " AND sale_return_status = " . $attr['postData']->sale_return_status : '';
        $warehouse_id = (isset($attr['postData']->targeted_warehouse_id)) ? " AND warehouse_id = " . $attr['postData']->targeted_warehouse_id : " AND warehouse_id = " . $attr['postData']->warehouse_id;

        $v_sql = "SELECT SUM(quantity) AS qty
                    FROM warehouse_allocation
                    WHERE 
                        order_id = '" . $attr['postData']->order_id . "' AND 
                        ref_po_id = '" . $attr['postData']->id . "' AND 
                        company_id= " . $this->arrUser['company_id'] . " AND
                        item_journal_detail_id = '" . $attr['postData']->item_journal_detail_id . "' AND
                        type = 3 and product_id = '" . $attr['postData']->product_id . "' AND 
                        location = '" . $attr['postData']->WH_loc_id . "'           
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $warehouse_id 
                        $sale_return_status";
        // echo $v_sql;exit;
        $v_RS = $this->objsetup->CSI($v_sql);
        $validate_already_allocated = $v_RS->fields['qty'];
        // echo $attr['postData']->req_qty;exit;
        // echo $validate_already_allocated;exit;
<<<<<<< HEAD
        if($attr['postData']->req_qty > $validate_already_allocated)
        {
=======
        if ($attr['postData']->req_qty > $validate_already_allocated) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $response['ack'] = 0;
            $response['error'] = 'The quantity to deallocate is greater than the quantity already allocated !';
            return $response;
        }

        $Sql = "UPDATE warehouse_allocation 
                SET 
<<<<<<< HEAD
                    quantity = quantity - ".$attr['postData']->req_qty.",
                    ChangedBy='" . $this->arrUser['id'] . "',
                    ChangedOn=UNIX_TIMESTAMP (NOW())
                WHERE 
                order_id = '".$attr['postData']->order_id ."' AND 
                company_id= " . $this->arrUser['company_id'] . " AND
                ref_po_id = '".$attr['postData']->id ."' AND 
                item_journal_detail_id = '".$attr['postData']->item_journal_detail_id ."' AND
                type = 3 and product_id = '".$attr['postData']->product_id."' AND 
                location = '".$attr['postData']->WH_loc_id."'           
                $warehouse_id 
                $sale_return_status
                ";        
         
=======
                    quantity = quantity - " . $attr['postData']->req_qty . ",
                    ChangedBy='" . $this->arrUser['id'] . "',
                    ChangedOn=UNIX_TIMESTAMP (NOW())
                WHERE 
                order_id = '" . $attr['postData']->order_id . "' AND 
                company_id= " . $this->arrUser['company_id'] . " AND
                ref_po_id = '" . $attr['postData']->id . "' AND 
                item_journal_detail_id = '" . $attr['postData']->item_journal_detail_id . "' AND
                type = 3 and product_id = '" . $attr['postData']->product_id . "' AND 
                location = '" . $attr['postData']->WH_loc_id . "'           
                $warehouse_id 
                $sale_return_status
                ";

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $opBalncID = ($attr['postData']->opBalncID != '') ? $attr['postData']->opBalncID : 0;
<<<<<<< HEAD
            if($attr['postData']->source_type == 4)
            {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty = temp_allocated_qty - ".$attr['postData']->req_qty." WHERE id = ".$opBalncID;
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            }
            else if($attr['postData']->source_type == 5)
            {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty_returned = temp_allocated_qty_returned - ".$attr['postData']->req_qty." WHERE id = ".$opBalncID;
=======
            if ($attr['postData']->source_type == 4) {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty = temp_allocated_qty - " . $attr['postData']->req_qty . " WHERE id = " . $opBalncID;
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            } else if ($attr['postData']->source_type == 5) {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty_returned = temp_allocated_qty_returned - " . $attr['postData']->req_qty . " WHERE id = " . $opBalncID;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            }

            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated!';
        }

        return $response;
    }

<<<<<<< HEAD
    
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    function deallocate_item_transfer_order($attr)
    {
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
        $v_sql = "SELECT SUM(quantity) AS qty
                    FROM warehouse_allocation
                    WHERE 
<<<<<<< HEAD
                        order_id = '".$attr['postData']->order_id ."' AND 
                        ref_po_id = '".$attr['postData']->id ."' AND 
                        company_id= " . $this->arrUser['company_id'] . " AND
                        transfer_order_detail_id = '".$attr['postData']->transfer_order_detail_id ."' AND
                        type = 5 AND
                        ledger_type = 2 AND 
                        product_id = '".$attr['postData']->product_id."' AND 
                        warehouse_id = ".$attr['postData']->warehouse_from;
=======
                        order_id = '" . $attr['postData']->order_id . "' AND 
                        ref_po_id = '" . $attr['postData']->id . "' AND 
                        company_id= " . $this->arrUser['company_id'] . " AND
                        transfer_order_detail_id = '" . $attr['postData']->transfer_order_detail_id . "' AND
                        type = 5 AND
                        ledger_type = 2 AND 
                        product_id = '" . $attr['postData']->product_id . "' AND 
                        warehouse_id = " . $attr['postData']->warehouse_from;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // echo $v_sql;exit;
        $v_RS = $this->objsetup->CSI($v_sql);
        $validate_already_allocated = $v_RS->fields['qty'];
        // echo $attr['postData']->req_qty;exit;
        // echo $validate_already_allocated;exit;
<<<<<<< HEAD
        if($attr['postData']->req_qty > $validate_already_allocated)
        {
=======
        if ($attr['postData']->req_qty > $validate_already_allocated) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $response['ack'] = 0;
            $response['error'] = 'The quantity to deallocate is greater than the quantity already allocated !';
            return $response;
        }

        $from_Sql = "UPDATE warehouse_allocation 
                SET 
<<<<<<< HEAD
                    quantity = quantity - ".$attr['postData']->req_qty.",
                    ChangedBy='" . $this->arrUser['id'] . "',
                    ChangedOn= UNIX_TIMESTAMP (NOW())
                WHERE 
                order_id = '".$attr['postData']->order_id ."' AND 
                company_id= " . $this->arrUser['company_id'] . " AND
                ref_po_id = '".$attr['postData']->id ."' AND 
                transfer_order_detail_id = '".$attr['postData']->transfer_order_detail_id ."' AND
                type = 5  and 
                ledger_type = 2 and 
                product_id = '".$attr['postData']->product_id."' AND 
                location = IFNULL((SELECT pwl.id FROM `product_warehouse_location` AS pwl WHERE pwl.warehouse_id=".$attr['postData']->warehouse_from." AND pwl.warehouse_loc_id= ".$attr['postData']->location_from." AND pwl.item_id = ".$attr['postData']->product_id." LIMIT 1), 0) AND       
                warehouse_id = ".$attr['postData']->warehouse_from."
                ";        
         
=======
                    quantity = quantity - " . $attr['postData']->req_qty . ",
                    ChangedBy='" . $this->arrUser['id'] . "',
                    ChangedOn= UNIX_TIMESTAMP (NOW())
                WHERE 
                order_id = '" . $attr['postData']->order_id . "' AND 
                company_id= " . $this->arrUser['company_id'] . " AND
                ref_po_id = '" . $attr['postData']->id . "' AND 
                transfer_order_detail_id = '" . $attr['postData']->transfer_order_detail_id . "' AND
                type = 5  and 
                ledger_type = 2 and 
                product_id = '" . $attr['postData']->product_id . "' AND 
                location = IFNULL((SELECT pwl.id FROM `product_warehouse_location` AS pwl WHERE pwl.warehouse_id=" . $attr['postData']->warehouse_from . " AND pwl.warehouse_loc_id= " . $attr['postData']->location_from . " AND pwl.item_id = " . $attr['postData']->product_id . " LIMIT 1), 0) AND       
                warehouse_id = " . $attr['postData']->warehouse_from . "
                ";

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // echo $Sql; exit;
        $RS1 = $this->objsetup->CSI($from_Sql);

        $to_Sql = "UPDATE warehouse_allocation 
                SET 
<<<<<<< HEAD
                    quantity = quantity - ".$attr['postData']->req_qty.",
                    ChangedBy='" . $this->arrUser['id'] . "',
                    ChangedOn= UNIX_TIMESTAMP (NOW())
                WHERE 
                order_id = '".$attr['postData']->order_id ."' AND 
                company_id= " . $this->arrUser['company_id'] . " AND
                ref_po_id = '".$attr['postData']->id ."' AND 
                transfer_order_detail_id = '".$attr['postData']->transfer_order_detail_id ."' AND
                type = 5 and 
                ledger_type = 1 and 
                product_id = '".$attr['postData']->product_id."' AND 
                location = IFNULL((SELECT pwl.id FROM `product_warehouse_location` AS pwl WHERE pwl.warehouse_id=".$attr['postData']->warehouse_to." AND pwl.warehouse_loc_id= ".$attr['postData']->location_to." AND pwl.item_id = ".$attr['postData']->product_id." LIMIT 1), 0) AND   
                warehouse_id = ".$attr['postData']->warehouse_to."
                ";        
         
=======
                    quantity = quantity - " . $attr['postData']->req_qty . ",
                    ChangedBy='" . $this->arrUser['id'] . "',
                    ChangedOn= UNIX_TIMESTAMP (NOW())
                WHERE 
                order_id = '" . $attr['postData']->order_id . "' AND 
                company_id= " . $this->arrUser['company_id'] . " AND
                ref_po_id = '" . $attr['postData']->id . "' AND 
                transfer_order_detail_id = '" . $attr['postData']->transfer_order_detail_id . "' AND
                type = 5 and 
                ledger_type = 1 and 
                product_id = '" . $attr['postData']->product_id . "' AND 
                location = IFNULL((SELECT pwl.id FROM `product_warehouse_location` AS pwl WHERE pwl.warehouse_id=" . $attr['postData']->warehouse_to . " AND pwl.warehouse_loc_id= " . $attr['postData']->location_to . " AND pwl.item_id = " . $attr['postData']->product_id . " LIMIT 1), 0) AND   
                warehouse_id = " . $attr['postData']->warehouse_to . "
                ";

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // echo $Sql; exit;
        $RS2 = $this->objsetup->CSI($to_Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $opBalncID = ($attr['postData']->opBalncID != '') ? $attr['postData']->opBalncID : 0;
<<<<<<< HEAD
            if($attr['postData']->source_type == 4)
            {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty = temp_allocated_qty - ".$attr['postData']->req_qty." WHERE id = ".$opBalncID;
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            }
            else if($attr['postData']->source_type == 5)
            {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty_returned = temp_allocated_qty_returned - ".$attr['postData']->req_qty." WHERE id = ".$opBalncID;
=======
            if ($attr['postData']->source_type == 4) {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty = temp_allocated_qty - " . $attr['postData']->req_qty . " WHERE id = " . $opBalncID;
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            } else if ($attr['postData']->source_type == 5) {
                $Sql = "UPDATE opening_balance_stock SET temp_allocated_qty_returned = temp_allocated_qty_returned - " . $attr['postData']->req_qty . " WHERE id = " . $opBalncID;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            }
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated!';
        }

        return $response;
    }
    function get_curent_stock_by_product_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT prd.id,	   " . $this->objGeneral->current_stock_counter($this->arrUser['company_id']) . "
		From product  prd
		LEFT JOIN company on company.id=prd.company_id 
		WHERE  prd.status=1  and prd.product_code IS NOT NULL 
		and (prd.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
		and prd.id=" . $attr['item_id'] . "  Limit 1";

        $rs_count = $this->objsetup->CSI($Sql);
        $current_stock = $rs_count->fields['current_stock'];
        // echo $Sql."<hr>"; exit;

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['current_stock'] = $current_stock;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated!';
        }

        return $response;
    }

    function get_curent_stock_by_product_id_warehouse($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT prd.id,	   
                " . $this->objGeneral->current_stock_counter_warehouse($this->arrUser['company_id'], $attr['warehouse_id']) . "
		From product  prd
		LEFT JOIN company on company.id=prd.company_id 
		WHERE  prd.status=1  and 
               prd.product_code IS NOT NULL  and 
               (prd.company_id=" . $this->arrUser['company_id'] . " or  
                company.parent_id=" . $this->arrUser['company_id'] . ") and 
               prd.id=" . $attr['item_id'] . "  
        Limit 1";
<<<<<<< HEAD
        
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $rs_count = $this->objsetup->CSI($Sql);
        $current_stock = $rs_count->fields['current_stock'];
        // echo $Sql; exit;

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['current_stock'] = $current_stock;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated!';
        }

        return $response;
    }

    function dispatch_stock($attr)
    {

        $WHERE = '';

        if (!empty($attr['sale_return_status']))
            $WHERE = ' AND sale_return_status = ' . $attr['sale_return_status'];

        //echo "<pre>"; print_r($attr); exit;
<<<<<<< HEAD
        $Sql = "UPDATE warehouse_allocation	SET sale_status=2, dispatch_date = UNIX_TIMESTAMP (NOW()) WHERE order_id = ".$attr['order_id']." AND company_id= " . $this->arrUser['company_id'] . " AND type = 2 ".$WHERE;
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if($attr['sale_return_status'] == 0)
        {
            $Sql2 = "UPDATE orders SET dispatched=1 WHERE id = ".$attr['order_id']." Limit 1";
            $RS = $this->objsetup->CSI($Sql2);
        }
        else if($attr['sale_return_status'] == 1)
        {
            $Sql3 = "UPDATE return_orders SET dispatched=1 WHERE id = ".$attr['order_id']." Limit 1";
            $RS = $this->objsetup->CSI($Sql3);
        }
        $Cache_Sql = "UPDATE product SET force_update = !force_update 
                            WHERE company_id = " . $this->arrUser['company_id'] ." AND 
                                    id IN (SELECT product_id FROM warehouse_allocation WHERE 
                            order_id = ".$attr['order_id']." AND company_id= " . $this->arrUser['company_id'] . " AND type = 2 ".$WHERE." )";
=======
        $Sql = "UPDATE warehouse_allocation	SET sale_status=2, dispatch_date = UNIX_TIMESTAMP (NOW()) WHERE order_id = " . $attr['order_id'] . " AND company_id= " . $this->arrUser['company_id'] . " AND type = 2 " . $WHERE;
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($attr['sale_return_status'] == 0) {
            $Sql2 = "UPDATE orders SET dispatched=1 WHERE id = " . $attr['order_id'] . " Limit 1";
            $RS = $this->objsetup->CSI($Sql2);
        } else if ($attr['sale_return_status'] == 1) {
            $Sql3 = "UPDATE return_orders SET dispatched=1 WHERE id = " . $attr['order_id'] . " Limit 1";
            $RS = $this->objsetup->CSI($Sql3);
        }
        $Cache_Sql = "UPDATE product SET force_update = !force_update 
                            WHERE company_id = " . $this->arrUser['company_id'] . " AND 
                                    id IN (SELECT product_id FROM warehouse_allocation WHERE 
                            order_id = " . $attr['order_id'] . " AND company_id= " . $this->arrUser['company_id'] . " AND type = 2 " . $WHERE . " )";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $Cache_RS = $this->objsetup->CSI($Cache_Sql);
        /*
        $refresh_cache_1 = "DELETE FROM Productcache WHERE id IN (SELECT product_id FROM warehouse_allocation WHERE 
                            order_id = ".$attr['order_id']." AND company_id= " . $this->arrUser['company_id'] . " AND type = 2 ".$WHERE."
            )";
        $this->objsetup->CSI($refresh_cache_1);
        $refresh_cache_2 = "INSERT INTO Productcache SELECT *,NOW() FROM sr_product_sel WHERE id IN (SELECT product_id FROM warehouse_allocation WHERE 
                        order_id = ".$attr['order_id']." AND company_id= " . $this->arrUser['company_id'] . " AND type = 2 ".$WHERE."
        )";
        $this->objsetup->CSI($refresh_cache_2);
        */
        $response['ack'] = 1;
        $response['error'] = NULL;
        return $response;
    }

    function dispatchDebitNotestock($attr)
<<<<<<< HEAD
    {            
=======
    {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        //echo "<pre>"; print_r($attr); exit;

        $purchaseInvoiceIDChk = '';

<<<<<<< HEAD
        if(isset($attr['purchaseInvoiceID']) && $attr['purchaseInvoiceID']){
            $purchaseInvoiceIDChk = "invoice_id = '" . $attr['purchaseInvoiceID'] . "' AND ";
        }  
        
        $sqlRawMaterialChk="SELECT sid.id,sid.product_name,sid.product_code,
=======
        if (isset($attr['purchaseInvoiceID']) && $attr['purchaseInvoiceID']) {
            $purchaseInvoiceIDChk = "invoice_id = '" . $attr['purchaseInvoiceID'] . "' AND ";
        }

        $sqlRawMaterialChk = "SELECT sid.id,sid.product_name,sid.product_code,
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                (CASE WHEN (COALESCE((SELECT SUM(remaining_qty) 
                                                      FROM item_in_cost_entries 
                                                      WHERE company_id = sid.company_id AND 
                                                            product_id = sid.product_id AND 
                                                            $purchaseInvoiceIDChk
                                                            remaining_qty > 0),0) > sid.qty)
                                    THEN 1
                                    ELSE 0
                                    END) AS availRawMaterailStock
                            FROM srm_order_return_detail AS sid
                            WHERE sid.company_id='" . $this->arrUser['company_id'] . "' AND 
                                  sid.invoice_id = '" . $attr['order_id'] . "' AND 
                                  sid.rawMaterialProduct = 1";

        $RsRawMaterialChk = $this->objsetup->CSI($sqlRawMaterialChk);

        $rawMaterialErrorCounter = 0;
        $rawMaterialErrorMsg = 'Following Raw Material(s) Stock is not Enough ';

        if ($RsRawMaterialChk->RecordCount() > 0) {
            while ($RowRawMaterialChk = $RsRawMaterialChk->FetchRow()) {

<<<<<<< HEAD
                if($RowRawMaterialChk['availRawMaterailStock'] == 0){

                    $rawMaterialErrorCounter++;
                    $rawMaterialErrorMsg .= ' '.$RowRawMaterialChk['product_name'].'('.$RowRawMaterialChk['product_code'].'),';
=======
                if ($RowRawMaterialChk['availRawMaterailStock'] == 0) {

                    $rawMaterialErrorCounter++;
                    $rawMaterialErrorMsg .= ' ' . $RowRawMaterialChk['product_name'] . '(' . $RowRawMaterialChk['product_code'] . '),';
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                }
            }
        }

<<<<<<< HEAD
        $rawMaterialErrorMsg = rtrim($rawMaterialErrorMsg,",");

        if($rawMaterialErrorCounter > 0){
=======
        $rawMaterialErrorMsg = rtrim($rawMaterialErrorMsg, ",");

        if ($rawMaterialErrorCounter > 0) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $response['ack'] = 2;
            $response['error'] = $rawMaterialErrorMsg;
            return $response;
        }
<<<<<<< HEAD
        
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $Sql = "UPDATE warehouse_allocation	
                                SET 
                                    purchase_status=2,
                                    ChangedBy='" . $this->arrUser['id'] . "',
                                    ChangedOn=UNIX_TIMESTAMP (NOW())
<<<<<<< HEAD
                WHERE order_id = ".$attr['order_id']." AND 
=======
                WHERE order_id = " . $attr['order_id'] . " AND 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        type = 1 ";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        $Sql2 = "UPDATE srm_order_return_detail 
                                SET 
                                    purchase_status=2 
<<<<<<< HEAD
                                WHERE invoice_id = ".$attr['order_id']." 
=======
                                WHERE invoice_id = " . $attr['order_id'] . " 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                Limit 1";
        // echo $Sql2;exit;
        $response2 = $this->objsetup->CSI($Sql2);

        $Sql3 = "UPDATE srm_order_return	
                                SET 
                                    purchaseStatus=2
<<<<<<< HEAD
                                    WHERE id = ".$attr['order_id']." ";
=======
                                    WHERE id = " . $attr['order_id'] . " ";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // echo $Sql3;exit;
        $RS3 = $this->objsetup->CSI($Sql3);

        $response['ack'] = 1;
        $response['error'] = NULL;
        return $response;
    }

    function invoice_stock($attr)
    {
        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['ErrorMessage'] = "";

        $this->objsetup->SRTraceLogsPHP($srLogTrace);

        $table = '';
        $type = '';
<<<<<<< HEAD
        if($attr['type'] == 1)
        {
            $checkAlreadyPosted = "SELECT type, sale_invioce_code as invoice_code FROM orders WHERE id= ".$attr['order_id']." LIMIT 1";
            $type = 'Sales Order';
        }
        else if($attr['type'] == 2)
        {
            $checkAlreadyPosted = "SELECT type, return_invoice_code as invoice_code FROM return_orders WHERE id= ".$attr['order_id']." LIMIT 1";
            $type = 'Credit Note';
        }
        
        $RS = $this->objsetup->CSI($checkAlreadyPosted);
        
        if($RS->fields['type'] == 2 || $RS->fields['type'] == 3)
        {
            // $this->objsetup->terminateWithMessage("Journal already Posted");
            $response['ack'] = 0;
            $response['error'] = $type.' already posted with Invoice No. '.$RS->fields['invoice_code'];
=======
        if ($attr['type'] == 1) {
            $checkAlreadyPosted = "SELECT type, sale_invioce_code as invoice_code FROM orders WHERE id= " . $attr['order_id'] . " LIMIT 1";
            $type = 'Sales Order';
        } else if ($attr['type'] == 2) {
            $checkAlreadyPosted = "SELECT type, return_invoice_code as invoice_code FROM return_orders WHERE id= " . $attr['order_id'] . " LIMIT 1";
            $type = 'Credit Note';
        }

        $RS = $this->objsetup->CSI($checkAlreadyPosted);

        if ($RS->fields['type'] == 2 || $RS->fields['type'] == 3) {
            // $this->objsetup->terminateWithMessage("Journal already Posted");
            $response['ack'] = 0;
            $response['error'] = $type . ' already posted with Invoice No. ' . $RS->fields['invoice_code'];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            $srLogTrace = array();

            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
<<<<<<< HEAD
            $srLogTrace['ErrorMessage'] = $type.' already Posted';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            return $response;
        }
        else
        {
            $this->Conn->beginTrans();
            $this->Conn->autoCommit = false;

            
            $InvoiceSql = "CALL SR_Sales_Invoice_Post(".$attr['order_id'].", 
                                                        ".$attr['type'].", 
                                                        ".$this->arrUser['company_id'].", 
                                                        ".$this->arrUser['id'].",
=======
            $srLogTrace['ErrorMessage'] = $type . ' already Posted';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            return $response;
        } else {
            $this->Conn->beginTrans();
            $this->Conn->autoCommit = false;


            $InvoiceSql = "CALL SR_Sales_Invoice_Post(" . $attr['order_id'] . ", 
                                                        " . $attr['type'] . ", 
                                                        " . $this->arrUser['company_id'] . ", 
                                                        " . $this->arrUser['id'] . ",
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                                        @errorNo,
                                                        @param1,
                                                        @param2,
                                                        @param3,
                                                        @param4
                                                    )";
            // echo $InvoiceSql;exit;  
            $RS = $this->objsetup->CSI($InvoiceSql);

<<<<<<< HEAD
            if($RS->msg == 1)
            {             
=======
            if ($RS->msg == 1) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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

                return $response;
                // $this->objsetup->terminateWithMessage("postPurchaseInvoice");
<<<<<<< HEAD
            }        
            else
            {
=======
            } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $response['ack'] = 0;
                $response['error'] = $RS->Error;
                $srLogTrace = array();

                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'Exit';
                $srLogTrace['ErrorMessage'] = $RS->Error;

                $this->objsetup->SRTraceLogsPHP($srLogTrace);
                return $response;
                // $this->objsetup->terminateWithMessage("Cannot convert into invoice");
            }
        }

        /* if($RS->fields['Result'] == 1)
        {
            $response['ack'] = 1;
            $response['error'] = NULL;
        }
        else if($RS->fields['Result'] == 2)
        {
            $response['ack'] = 0;
            if($RS->fields['Message'] != '')
                $response['error'] = $RS->fields['Message'];
            else
                $response['error'] = 'Could not convert order to invoice!';
        }
        else
        {
            $response['ack'] = 0;
            $response['error'] = 'Could not convert order to invoice';
        }
        
        return $response; */
    }
<<<<<<< HEAD


}

?>
=======
}
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
