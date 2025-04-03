<?php
require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/General.php");

class Warehouse extends Xtreme
{

    private $Conn = null;
    private $objGeneral = null;
    private $arrUser = null;

    function __construct($user_info = array())
    {
        parent::__construct();
        $this->Conn = parent::GetConnection();
        $this->objGeneral = new General($user_info);
        $this->arrUser = $user_info;
    }

    // static	
    function delete_update_status($table_name, $column, $id)
    {

        //	$Sql = "DELETE FROM $table_name 	WHERE id = $id Limit 1 ";
        $Sql = "UPDATE $table_name SET  $column=0 	WHERE id = $id Limit 1";

        $RS = $this->Conn->Execute($Sql);
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
          $Row = $this->Conn->Execute($Sql1)->FetchRow();
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
        $RS = $this->Conn->Execute($Sql);
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

//------------General Tab--------------------------
    function get_all_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT   c.id, c.name, c.wrh_code FROM  warehouse  c 
		left JOIN company on company.id=c.company_id 
		where  c.status=1 
		and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		group by  c.name ASC "; //c.user_id=".$this->arrUser['id']." 
        $RS = $this->Conn->Execute($Sql);
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

    function get_warehouse_listings($attr)
    {

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";


        if (!empty($attr['Serachkeyword'])) {
            $val = intval(preg_replace("/[^0-9]/", '', $attr['Serachkeyword']));
            $where_clause .= " AND  c.crm_no LIKE '%$val%'  OR c.name LIKE '%$attr[Serachkeyword]%'";
        }

        $response = array();

        $Sql = "SELECT  c.id, c.wrh_code, c.name , c.contact_person , c.city  , c.postcode, c.phone
		, c.job_title
		, c.fax
		, c.email
		From warehouse  c 
		left JOIN company on company.id=c.company_id 
	  	 where   c.status=1 and 
		(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		" . $where_clause . " order by c.id DESC ";


        $RS = $this->Conn->Execute($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['code'] = $Row['wrh_code'];;//'WRH' . $Row['crm_no'];
                $result['name'] = $Row['name'];
                $result['contact_person'] = $Row['contact_person'];
                $result['job_title'] = $Row['job_title'];
                $result['phone'] = $Row['phone'];
                $result['fax'] = $Row['fax'];
                $result['email'] = $Row['email'];
                $result['city'] = $Row['city'];
                $result['postcode'] = $Row['postcode'];
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
            $update_check = "  AND tst.id != " . $id . " ";

        $data_pass = "   tst.status=1 AND tst.wrh_code='" . $arr_attr[wrh_code] . "' $update_check";
        $total = $this->objGeneral->count_duplicate_in_sql('warehouse', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($id == 0) {

            $Sql = "INSERT INTO warehouse SET
                                            wrh_no='$arr_attr[wrh_no]',
                                            wrh_code='$arr_attr[wrh_code]',
                                            prev_code='$arr_attr[prev_code]',
                                            name='".$arr_attr['name']."',
                                            type='".$arr_attr['type']."',
                                            contact_person='$arr_attr[contact_person]',
                                            address_1='$arr_attr[address_1]',
                                            job_title='$arr_attr[job_title]',
                                            address_2='$arr_attr[address_2]',
                                            phone='$arr_attr[phone]',
                                            city='$arr_attr[city]',
                                            fax='$arr_attr[fax]',
                                            county='$arr_attr[county]',
                                            country_id='$arr_attr[country_ids]',
                                            mobile='$arr_attr[mobile]',
                                            postcode='$arr_attr[postcode]',
                                            direct_line='$arr_attr[direct_line]',
                                            support_person='$arr_attr[support_person]',
                                            email='$arr_attr[email]',
                                            salesperson_id='$arr_attr[salesperson_id]',
                                            turnover='$arr_attr[turnover]',
                                            internal_sales='$arr_attr[internal_sales]',
                                            company_type='$arr_attr[company_type]',
                                            source_of_crm='$arr_attr[source_of_crm]',
                                            web_address='$arr_attr[web_address]',
                                            buying_grp='$arr_attr[buying_grp]',
                                            credit_limit='$arr_attr[credit_limit]',
                                            purchase_code='$arr_attr[purchase_code]',
                                            purchase_code_id='$arr_attr[purchase_code_id]',
                                            currency_id='$arr_attr[currency_ids]',
											storage='$arr_attr[storage]',
											converted_price='$arr_attr[converted_price]',
										    user_id='" . $this->arrUser[id] . "',
                                            status=1,
                                            company_id='" . $this->arrUser[company_id] . "'";
            // echo $Sql;exit;
            $RS = $this->Conn->Execute($Sql);
            $id = $this->Conn->Insert_ID();
            $variable = 'insert';
            //exit;
            // }
        } else {
            $Sql = "UPDATE warehouse SET  
                                      name='".$arr_attr['name']."',
                                      prev_code='$arr_attr[prev_code]',
                                      type='".$arr_attr['type']."',
                                      contact_person='$arr_attr[contact_person]',
                                      address_1='$arr_attr[address_1]',
                                      job_title='$arr_attr[job_title]',
                                      address_2='$arr_attr[address_2]',
                                      phone='$arr_attr[phone]',
                                      city='$arr_attr[city]',
                                      fax='$arr_attr[fax]',
                                      county='$arr_attr[county]',
                                      country_id='$arr_attr[country_ids]',
                                      mobile='$arr_attr[mobile]',
                                      postcode='$arr_attr[postcode]',
                                      support_person='$arr_attr[support_person]',
                                      direct_line='$arr_attr[direct_line]',
                                      email='$arr_attr[email]',
                                      salesperson_id='$arr_attr[salesperson_id]',
                                      turnover='$arr_attr[turnover]',
                                      internal_sales='$arr_attr[internal_sales]',
                                      company_type='$arr_attr[company_type]',
                                      source_of_crm='$arr_attr[source_of_crm]',
<<<<<<< HEAD
                                      status='$arr_attr[status]',
=======
                                      status='".$arr_attr['status']."',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                      web_address='$arr_attr[web_address]',
                                      buying_grp='$arr_attr[buying_grp]',
                                      credit_limit='$arr_attr[credit_limit]',
                                      currency_id='$arr_attr[currency_ids]',
                                      purchase_code='$arr_attr[purchase_code]',
                                      purchase_code_id='$arr_attr[purchase_code_id]',
                                      storage='$arr_attr[storage]',
									  converted_price='$arr_attr[converted_price]'
                                      WHERE id = " . $id . "   Limit 1";
            $RS = $this->Conn->Execute($Sql);
        }
        //   	echo $Sql;exit;

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
            $crm = $this->Conn->Execute($Sqls)->FetchRow();

            $number = $crm['count'] + 1;

            $Sql = "UPDATE warehouse SET type = ".$attr['type'].", customer_no = $number
					WHERE id = ".$attr['id']."";

            //echo $Sql; exit;
        } else {
            $Sqls = "SELECT max(crm_no) as count	FROM warehouse";
            $crm = $this->Conn->Execute($Sqls)->FetchRow();

            $number = $crm['count'] + 1;

            $Sql = "UPDATE warehouse SET type = ".$attr['type'].", crm_no = $number
				WHERE id = ".$attr['id']."";
        }

        /* $Sql = "UPDATE crm SET type = ".$attr['type']."
          WHERE id = ".$attr['id'].""; */

        //echo $Sql."<hr>"; exit;
        $RS = $this->Conn->Execute($Sql);

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
        $crm = $this->Conn->Execute($Sql)->FetchRow();
        $nubmer = $crm['count'];
        if ($attr['is_increment'] == 1 || $nubmer == '')
            $nubmer++;
        //$nubmer=$nubmer+1;
        $response['code'] = 'WRH' . $this->objGeneral->module_item_prefix($nubmer);
        $response['number'] = $this->objGeneral->module_item_prefix($nubmer);
        return $response;


        /* $mSql = "SELECT prefix FROM `module_codes` WHERE `id` = 108";
          $code = $this->Conn->Execute($mSql)->FetchRow();

          $Sql = "SELECT max(crm_no) as count	FROM warehouse";
          $crm = $this->Conn->Execute($Sql)->FetchRow();
          //echo $mSql; exit;
          $nubmer = $crm['count'];

          if($attr['is_increment'] == 1 || $nubmer == '')
          $nubmer++;

          return array('code'=>$code['prefix'].$this->objGeneral->module_item_prefix($nubmer),'number'=>$nubmer); */
    }


//----------------Alt Contact Module----------------------

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
	   where  c.wrh_id=".$attr['id']." and c.status=1 and 
		(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		order by c.id ASC ";


        $RS = $this->Conn->Execute($Sql);

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
        $where_clause = "AND company_id =" . $this->arrUser[company_id];

        if (!empty($attr['keyword'])) {
            $where_clause .= " AND contact_name LIKE '%$attr[keyword]%' ";
        }

        $response = array();

        $Sql = "SELECT id, contact_name, direct_line, mobile, email
				FROM warehouse_alt_contact
				WHERE 1
				" . $where_clause . "
				ORDER BY id ASC";

        $RS = $this->Conn->Execute($Sql);


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
            $update_check = "  AND tst.id != " . $id . " ";

        $data_pass = "   tst.contact_name='" . $arr_attr[contact_name] . "' $update_check";
        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_alt_contact', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($id == 0) {


            $Sql = "INSERT INTO warehouse_alt_contact SET
location='$arr_attr[location]',location_adress='$arr_attr[location_adress]',depot='$arr_attr[depot]',contact_name='$arr_attr[contact_name]',job_title='$arr_attr[job_title]'
,address_1='$arr_attr[address_1]',address_2='$arr_attr[address_2]',phone='$arr_attr[phone]',city='$arr_attr[city]',fax='$arr_attr[fax]',county='$arr_attr[county]',country='$arr_attr[country]',mobile='$arr_attr[mobile]',postcode='$arr_attr[postcode]',direct_line='$arr_attr[direct_line]',email='$arr_attr[email]',web_add='$arr_attr[web_add]',wrh_id='$arr_attr[wrh_id]',user_id='" . $this->arrUser[id] . "',company_id='" . $this->arrUser[company_id] . "'";
            $RS = $this->Conn->Execute($Sql);
            $id = $this->Conn->Insert_ID();
            // }
        } else {
            $Sql = "UPDATE warehouse_alt_contact SET  
									location='$arr_attr[location]',location_adress='$arr_attr[location_adress]',depot='$arr_attr[depot]',contact_name='$arr_attr[contact_name]',job_title='$arr_attr[job_title]',address_1='$arr_attr[address_1]',address_2='$arr_attr[address_2]',phone='$arr_attr[phone]',city='$arr_attr[city]',fax='$arr_attr[fax]',county='$arr_attr[county]',country='$arr_attr[country]',mobile='$arr_attr[mobile]',postcode='$arr_attr[postcode]',direct_line='$arr_attr[direct_line]',email='$arr_attr[email]',web_add='$arr_attr[web_add]'  WHERE id = " . $id . "   Limit 1";
            $RS = $this->Conn->Execute($Sql);
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

//--------------------   Warehouse Additional Cost Title Start--------------------

    function get_warehouse_loc_additional_cost_title()
    {

        $response = array();


        $Sql = "SELECT c.id,c.title
                      From warehouse_loc_additional_cost_title c
                      left JOIN company on company.id=c.company_id
                      where  (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                      order by id ASC ";

        $RS = $this->Conn->Execute($Sql);


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

        $Sql = "INSERT INTO warehouse_loc_additional_cost_title SET title='".$arr_attr['title']."', company_id='" . $this->arrUser[company_id] . "'";
        // echo $Sql;exit;

        $RS = $this->Conn->Execute($Sql);
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
                      left JOIN company on company.id=c.company_id
                      where  (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                      order by id ASC ";

        $RS = $this->Conn->Execute($Sql);


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
        $data_pass = "   tst.title='" . $arr_attr['title'] . "'";
        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_storage_type', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO warehouse_storage_type SET title='".$arr_attr['title']."', company_id='" . $this->arrUser[company_id] . "'";
        // echo $Sql;exit;

        $RS = $this->Conn->Execute($Sql);
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

        /*$Sql = "SELECT c.id as wrh_locid,c.title as bintitle,c.description,c.bin_cost,curr.name as crname,dim.title as dimtitle,
		        CASE  WHEN c.status = 1 THEN 'Active'
		              WHEN c.status = 0 THEN 'Inactive'
		              END AS warehouse_status,
		        CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
		              WHEN c.cost_type_id = 2 THEN 'Daily'
		              WHEN c.cost_type_id = 3 THEN 'Weekly'
		              END AS cost_type
                From warehouse_bin_location  c
                left JOIN currency as curr on curr.id=c.currency_id
                left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                left JOIN company on company.id=c.company_id
                where  c.warehouse_id=$attr[wrh_id] and c.parent_id=0 and
                 (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                 order by c.id ASC ";*/

        $Sql = "SELECT c.id as wrh_locid,c.title as bintitle,c.warehouse_loc_sdate,c.warehouse_loc_edate,c.bin_cost,curr.code as crname,dim.title as dimtitle,
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
		        (SELECT id From warehouse_bin_loc_history where warehouse_loc_id=c.id limit 1 ) as cost_history,
		        (SELECT id From product_warehouse_location where warehouse_loc_id=c.id and status=1 limit 1 ) as item_assign
                From warehouse_bin_location  c
                left JOIN currency as curr on curr.id=c.currency_id
                left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                left JOIN company on company.id=c.company_id
                where  c.warehouse_id=$attr[wrh_id] and c.parent_id=0 and c.status=1 and
                 (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                 order by c.id ASC ";
        // echo $Sql; exit;

        //, (SELECT sum(cost) as total From warehouse_loc_additional_cost where warehouse_bin_loc_id=c.id ) as add_cost_total


        $RS = $this->Conn->Execute($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['wrh_locid'];
                $result['Storage_location'] = $Row['bintitle'];
                $result['parent'] = 0;
                $result['Currency'] = $Row['crname'];

                if ($Row['bin_cost'] > 0)
                    $result['Cost'] = $Row['bin_cost'];
                else
                    $result['Cost'] = "-";

                // + $Row['add_cost_total']
                $result['cost_history'] = $Row['cost_history'];
                $result['item_assign'] = $Row['item_assign'];
                $result['Unit_of Measure'] = $Row['dimtitle'];
                $result['cost_frequency'] = $Row['cost_type'];
                $result['Start_date'] = $this->objGeneral->convert_unix_into_date($Row['warehouse_loc_sdate']);
                if ($Row['warehouse_loc_edate'] > 0)
                    $result['End_date'] = $this->objGeneral->convert_unix_into_date($Row['warehouse_loc_edate']);
                else
                    $result['End_date'] = "-";

                // if (strlen($Row['add_cost']) > 0)
                $result['add_cost'] = $Row['add_cost'];
                $result['status'] = $Row['warehouse_status'];


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
                                    (SELECT id From warehouse_bin_loc_history where warehouse_loc_id=c.id limit 1 ) as cost_history,
                                    (SELECT id From product_warehouse_location where warehouse_loc_id=c.id and status=1 limit 1 ) as item_assign

                                    From warehouse_bin_location  c
                                    left JOIN currency as curr on curr.id=c.currency_id
                                    left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                                    left JOIN company on company.id=c.company_id
                                    where  c.warehouse_id=$attr[wrh_id] and c.parent_id=" . $Row['wrh_locid'] . " and c.status=1 and
                                     (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                     order by c.id ASC ";
                //,(SELECT sum(cost) as total From warehouse_loc_additional_cost where warehouse_bin_loc_id=c.id ) as add_cost_total

                $RS_subparent = $this->Conn->Execute($Sql_subparent);

                if ($RS_subparent->RecordCount() > 0) {
                    while ($Row_subparent = $RS_subparent->FetchRow()) {
                        $result = array();
                        $result['id'] = $Row_subparent['wrh_locid'];
                        $result['Storage_location'] = $Row_subparent['bintitle'];
                        $result['parent'] = 1;
                        $result['Currency'] = $Row_subparent['crname'];

                        if ($Row_subparent['bin_cost'] > 0)
                            $result['Cost'] = $Row_subparent['bin_cost'];
                        else
                            $result['Cost'] = "-";
                        // + $Row_subparent['add_cost_total']
                        $result['cost_history'] = $Row_subparent['cost_history'];
                        $result['item_assign'] = $Row_subparent['item_assign'];
                        $result['Unit_of Measure'] = $Row_subparent['dimtitle'];
                        $result['cost_frequency'] = $Row_subparent['cost_type'];
                        $result['Start_date'] = $this->objGeneral->convert_unix_into_date($Row_subparent['warehouse_loc_sdate']);

                        if ($Row_subparent['warehouse_loc_edate'] > 0)
                            $result['End_date'] = $this->objGeneral->convert_unix_into_date($Row_subparent['warehouse_loc_edate']);
                        else
                            $result['End_date'] = "-";

                        //if (strlen($Row_subparent['add_cost']) > 0)
                        $result['add_cost'] = $Row_subparent['add_cost'];
                        $result['status'] = $Row_subparent['warehouse_status'];


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
                                                (SELECT id From warehouse_bin_loc_history where warehouse_loc_id=c.id limit 1 ) as cost_history,
                                                (SELECT id From product_warehouse_location where warehouse_loc_id=c.id and status=1 limit 1 ) as item_assign

                                                From warehouse_bin_location  c
                                                left JOIN currency as curr on curr.id=c.currency_id
                                                left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                                                left JOIN company on company.id=c.company_id
                                                where  c.warehouse_id=$attr[wrh_id] and c.parent_id=" . $Row_subparent['wrh_locid'] . " and c.status=1 and
                                                 (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                                 order by c.id ASC ";
                        //, (SELECT sum(cost) as total From warehouse_loc_additional_cost where warehouse_bin_loc_id=c.id ) as add_cost_total

                        $RS_sub_subparent = $this->Conn->Execute($Sql_sub_subparent);

                        if ($RS_sub_subparent->RecordCount() > 0) {
                            while ($Row_sub_subparent = $RS_sub_subparent->FetchRow()) {
                                $result = array();
                                $result['id'] = $Row_sub_subparent['wrh_locid'];
                                $result['Storage_location'] = $Row_sub_subparent['bintitle'];
                                $result['parent'] = 2;
                                $result['Currency'] = $Row_sub_subparent['crname'];

                                if ($Row_sub_subparent['bin_cost'] > 0)
                                    $result['Cost'] = $Row_sub_subparent['bin_cost'];
                                else
                                    $result['Cost'] = "-";
                                // + $Row_sub_subparent['add_cost_total']
                                $result['cost_history'] = $Row_sub_subparent['cost_history'];
                                $result['item_assign'] = $Row_sub_subparent['item_assign'];
                                $result['Unit_of Measure'] = $Row_sub_subparent['dimtitle'];
                                $result['cost_frequency'] = $Row_sub_subparent['cost_type'];
                                $result['Start_date'] = $this->objGeneral->convert_unix_into_date($Row_sub_subparent['warehouse_loc_sdate']);
                                if ($Row_sub_subparent['warehouse_loc_edate'] > 0)
                                    $result['End_date'] = $this->objGeneral->convert_unix_into_date($Row_sub_subparent['warehouse_loc_edate']);
                                else
                                    $result['End_date'] = "-";
                                // if (strlen($Row_sub_subparent['add_cost']) > 0)
                                $result['add_cost'] = $Row_sub_subparent['add_cost'];
                                $result['status'] = $Row_sub_subparent['warehouse_status'];

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
                                                            (SELECT id From warehouse_bin_loc_history where warehouse_loc_id=c.id limit 1 ) as cost_history,
                                                            (SELECT id From product_warehouse_location where warehouse_loc_id=c.id and status=1 limit 1 ) as item_assign

                                                            From warehouse_bin_location  c
                                                            left JOIN currency as curr on curr.id=c.currency_id
                                                            left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                                                            left JOIN company on company.id=c.company_id
                                                            where  c.warehouse_id=$attr[wrh_id] and c.parent_id=" . $Row_sub_subparent['wrh_locid'] . " and c.status=1 and
                                                             (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                                             order by c.id ASC ";
                                //, (SELECT sum(cost) as total From warehouse_loc_additional_cost where warehouse_bin_loc_id=c.id ) as add_cost_total

                                $RS_sub_subparent2 = $this->Conn->Execute($Sql_sub_subparent2);

                                if ($RS_sub_subparent2->RecordCount() > 0) {
                                    while ($Row_sub_subparent2 = $RS_sub_subparent2->FetchRow()) {
                                        $result = array();
                                        $result['id'] = $Row_sub_subparent2['wrh_locid'];
                                        $result['Storage_location'] = $Row_sub_subparent2['bintitle'];
                                        $result['parent'] = 3;
                                        $result['Currency'] = $Row_sub_subparent2['crname'];

                                        if ($Row_sub_subparent2['bin_cost'] > 0)
                                            $result['Cost'] = $Row_sub_subparent2['bin_cost'];
                                        else
                                            $result['Cost'] = "-";

                                        // + $Row_sub_subparent2['add_cost_total']
                                        $result['cost_history'] = $Row_sub_subparent2['cost_history'];
                                        $result['item_assign'] = $Row_sub_subparent2['item_assign'];
                                        $result['Unit_of Measure'] = $Row_sub_subparent2['dimtitle'];
                                        $result['cost_frequency'] = $Row_sub_subparent2['cost_type'];
                                        $result['Start_date'] = $this->objGeneral->convert_unix_into_date($Row_sub_subparent2['warehouse_loc_sdate']);

                                        if ($Row_sub_subparent2['warehouse_loc_edate'] > 0)
                                            $result['End_date'] = $this->objGeneral->convert_unix_into_date($Row_sub_subparent2['warehouse_loc_edate']);
                                        else
                                            $result['End_date'] = "-";

                                        // if (strlen($Row_sub_subparent2['add_cost']) > 0)
                                        $result['add_cost'] = $Row_sub_subparent2['add_cost'];
                                        $result['status'] = $Row_sub_subparent2['warehouse_status'];

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
                                            (SELECT id From warehouse_bin_loc_history where warehouse_loc_id=c.id limit 1 ) as cost_history,
		                                    (SELECT id From product_warehouse_location where warehouse_loc_id=c.id and status=1 limit 1 ) as item_assign

                                            From warehouse_bin_location  c
                                            left JOIN currency as curr on curr.id=c.currency_id
                                            left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                                            left JOIN company on company.id=c.company_id
                                            where  c.warehouse_id=$attr[wrh_id] and c.parent_id=" . $Row_sub_subparent2['wrh_locid'] . " and c.status=1 and
                                             (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                             order by c.id ASC ";
                                        //, (SELECT sum(cost) as total From warehouse_loc_additional_cost where warehouse_bin_loc_id=c.id ) as add_cost_total

                                        $RS_sub_subparent3 = $this->Conn->Execute($Sql_sub_subparent3);

                                        if ($RS_sub_subparent3->RecordCount() > 0) {
                                            while ($Row_sub_subparent3 = $RS_sub_subparent3->FetchRow()) {
                                                $result = array();
                                                $result['id'] = $Row_sub_subparent3['wrh_locid'];
                                                $result['Storage_location'] = $Row_sub_subparent3['bintitle'];
                                                $result['parent'] = 4;
                                                $result['Currency'] = $Row_sub_subparent3['crname'];

                                                if ($Row_sub_subparent3['bin_cost'] > 0)
                                                    $result['Cost'] = $Row_sub_subparent3['bin_cost'];
                                                else
                                                    $result['Cost'] = "-";
                                                // + $Row_sub_subparent3['add_cost_total']
                                                $result['cost_history'] = $Row_sub_subparent3['cost_history'];
                                                $result['item_assign'] = $Row_sub_subparent3['item_assign'];
                                                $result['Unit_of Measure'] = $Row_sub_subparent3['dimtitle'];
                                                $result['cost_frequency'] = $Row_sub_subparent3['cost_type'];
                                                $result['Start_date'] = $this->objGeneral->convert_unix_into_date($Row_sub_subparent3['warehouse_loc_sdate']);

                                                if ($Row_sub_subparent3['warehouse_loc_edate'] > 0)
                                                    $result['End_date'] = $this->objGeneral->convert_unix_into_date($Row_sub_subparent3['warehouse_loc_edate']);
                                                else
                                                    $result['End_date'] = "-";

                                                //if (strlen($Row_sub_subparent3['add_cost']) > 0)
                                                $result['add_cost'] = $Row_sub_subparent3['add_cost'];
                                                $result['status'] = $Row_sub_subparent3['warehouse_status'];

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

        $RS = $this->Conn->Execute($Sql);

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
                left JOIN company on company.id=c.company_id
                where  c.warehouse_id=$attr[wrh_id] and c.status=1 and c.parent_id=0 and
                 (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                 order by c.id ASC ";


        // echo $Sql; exit;
        $RS = $this->Conn->Execute($Sql);


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
                                    left JOIN company on company.id=c.company_id
                                    where  c.warehouse_id=$attr[wrh_id] and c.status=1 and c.parent_id=" . $Row['id'] . " and
                                     (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                     order by c.id ASC ";

                // echo $Sql_subparent; exit;
                $RS_subparent = $this->Conn->Execute($Sql_subparent);

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
                                                left JOIN company on company.id=c.company_id
                                                where  c.warehouse_id=$attr[wrh_id] and c.status=1 and c.parent_id=" . $Row_subparent['id'] . " and
                                                 (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                                 order by c.id ASC ";

                        // echo $Sql_sub_subparent; exit;
                        $RS_sub_subparent = $this->Conn->Execute($Sql_sub_subparent);

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
                                                        left JOIN company on company.id=c.company_id
                                                        where  c.warehouse_id=$attr[wrh_id] and c.status=1 and c.parent_id=" . $Row_sub_subparent['id'] . " and
                                                         (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                                         order by c.id ASC ";

                                // echo $Sql_sub_subparent2; exit;
                                $RS_sub_subparent2 = $this->Conn->Execute($Sql_sub_subparent2);

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
                                        $RS_sub_subparent3 = $this->Conn->Execute($Sql_sub_subparent3);

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

<<<<<<< HEAD
        if ($attr[parent_id] > 0)
            $selpar = "and c.parent_id=" . $attr[parent_id] . " ";
=======
        if ($attr['parent_id'] > 0)
            $selpar = "and c.parent_id=" . $attr['parent_id'] . " ";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        else
            $selpar = "and c.parent_id=0";

        $response = array();

        $Sql = "SELECT c.id,c.title,c.bin_cost,c.parent_id
                From warehouse_bin_location  c
                left JOIN company on company.id=c.company_id
                where  c.warehouse_id=$attr[wrh_id] and c.status=1  " . $selpar . " and
                 (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                 order by c.id ASC ";

        // echo $Sql; exit;
        $RS = $this->Conn->Execute($Sql);


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

<<<<<<< HEAD
        /*if ($attr[parent_id] > 0)
=======
        /*if ($attr['parent_id'] > 0)
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $sel_parent = "";
        else
            $sel_parent = "and c.parent_id=0";*/

        $response = array();

        $Sql = "SELECT c.id,c.bin_cost,curr.name as crname,dim.title as dimtitle,
		        CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
		              WHEN c.cost_type_id = 2 THEN 'Daily'
		              WHEN c.cost_type_id = 3 THEN 'Weekly'
		              WHEN c.cost_type_id = 4 THEN 'Monthly'
		              WHEN c.cost_type_id = 5 THEN 'Annually'
		              END AS cost_type
                From warehouse_bin_location  c
                left JOIN currency as curr on curr.id=c.currency_id
                left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                left JOIN company on company.id=c.company_id
<<<<<<< HEAD
                where  c.status=1  and c.id=" . $attr[location_id] . "  and
=======
                where  c.status=1  and c.id=" . $attr['location_id'] . "  and
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                 (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                 limit 1 ";

        // echo $Sql; exit;
        $RS = $this->Conn->Execute($Sql);


        if ($RS->RecordCount() > 0) {
            //  while () {
            $result = array();
            $Row = $RS->FetchRow();
            $result['id'] = $Row['id'];
            $result['title'] = $Row['title'];
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
        $this->objGeneral->mysql_clean($arr_attr);


        $id = $arr_attr['id'];

        // check for duplicate warehouse location with same location name, date,uom and frequency.
        $update_check = "";
        if ($arr_attr['id'] > 0)
            $update_check = "  AND tst.id != " . $id . " ";

        // $data_pass = "   tst.title='" . $arr_attr['title'] . "' and tst.warehouse_id='" . $arr_attr[wrh_id] . "' $update_check";

        $data_pass = "   tst.title='" . $arr_attr['title'] . "' and
                         tst.warehouse_id='" . $arr_attr['wrh_id'] . "' and
                         tst.warehouse_loc_sdate='" . $this->objGeneral->convert_date($arr_attr['warehouse_loc_sdate']) . "' and
                         tst.dimensions_id='" . $arr_attr['dimensions_id'] . "' and
                         tst.cost_type_id='" . $arr_attr['cost_type_id'] . "' and tst.status=1
                         $update_check";
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
            $prev_rec_RS = $this->Conn->Execute($prev_rec_Sql);

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

                    $this->Conn->Execute($update_prev_rec_end_date_Sql);
                }
            }

            // check for duplicate warehouse location with same location name end

            $Sql = "INSERT INTO warehouse_bin_location
                                SET
                                      warehouse_id='$arr_attr[wrh_id]',
                                      title='".$arr_attr['title']."',
<<<<<<< HEAD
                                      description='$arr_attr[description]',
                                      parent_id='$arr_attr[parent_id]',
=======
                                      description='".$arr_attr['description']."',
                                      parent_id='".$arr_attr['parent_id']."',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                      bin_cost='$arr_attr[bin_cost]',
                                      currency_id='$arr_attr[currency_id]',
                                      dimensions_id='$arr_attr[dimensions_id]',
                                      cost_type_id='$arr_attr[cost_type_id]',
                                      warehouse_loc_sdate='" . $this->objGeneral->convert_date($arr_attr[warehouse_loc_sdate]) . "',
                                      user_id='" . $this->arrUser[id] . "',
                                      company_id='" . $this->arrUser[company_id] . "',
<<<<<<< HEAD
                                      status='$arr_attr[status]',
=======
                                      status='".$arr_attr['status']."',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                      AddedBy='" . $this->arrUser['id'] . "',
                                      AddedOn='" . current_date . "'";
            // warehouse_loc_edate='" . $this->objGeneral->convert_date($arr_attr[warehouse_loc_edate]) . "',

            // echo $Sql;exit;

            $RS = $this->Conn->Execute($Sql);
            $id = $this->Conn->Insert_ID();

            if ($id > 0) {
                $arr_attr['warehouse_loc_id'] = $id;
                $this->add_bin_loc_history($arr_attr);
            }

        } else {
            // check date from previous record.

            $sel_Sql = "SELECT warehouse_loc_sdate,warehouse_loc_edate from warehouse_bin_location WHERE id = " . $id . " Limit 1";
            //echo $sel_Sql;
            $sel_RS = $this->Conn->Execute($sel_Sql);

            if ($sel_RS->RecordCount() > 0) {
                $sel_Row = $sel_RS->FetchRow();
                $previous_rec_date = $sel_Row['warehouse_loc_sdate'];
                $warehouse_loc_edate = $sel_Row['warehouse_loc_edate'];

                /*if ($warehouse_loc_edate > 0) {
                    $response['ack'] = 0;
                    $response['error'] = 'This record is not editable';
                    return $response;
                }*/

                if ($this->objGeneral->convert_date($arr_attr['warehouse_loc_sdate']) < $previous_rec_date) {
                    $response['ack'] = 0;
                    $response['error'] = 'Date is Less than Previous Recorded Date';
                    return $response;
                }
            }

            // Check for warehouse location assigned to item

            /*$assigned_loc_Sql = "SELECT id From product_warehouse_location where  warehouse_loc_id=" . $id . " and status=1  limit 1 ";
            $assigned_loc_RS = $this->Conn->Execute($assigned_loc_Sql);

            if ($assigned_loc_RS->RecordCount() > 0) {
                $response['ack'] = 0;
                $response['error'] = 'This warehouse location is already assigned to an item .';
                return $response;
            }*/

            $Sql = "UPDATE warehouse_bin_location
                              SET
									warehouse_id='$arr_attr[wrh_id]',
                                    title='".$arr_attr['title']."',
<<<<<<< HEAD
                                    description='$arr_attr[description]',
                                    parent_id='$arr_attr[parent_id]',
=======
                                    description='".$arr_attr['description']."',
                                    parent_id='".$arr_attr['parent_id']."',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    bin_cost='$arr_attr[bin_cost]',
                                    currency_id='$arr_attr[currency_id]',
                                    dimensions_id='$arr_attr[dimensions_id]',
                                    cost_type_id='$arr_attr[cost_type_id]',
                                    warehouse_loc_sdate='" . $this->objGeneral->convert_date($arr_attr[warehouse_loc_sdate]) . "',
                                    user_id='" . $this->arrUser[id] . "',
                                    company_id='" . $this->arrUser[company_id] . "',
<<<<<<< HEAD
                                    status='$arr_attr[status]',
=======
                                    status='".$arr_attr['status']."',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    ChangedBy='" . $this->arrUser['id'] . "',
                                    ChangedOn='" . current_date . "'
                                    WHERE id = " . $id . "   Limit 1";
            //warehouse_loc_edate='" . $this->objGeneral->convert_date($arr_attr[warehouse_loc_edate]) . "',


            $RS = $this->Conn->Execute($Sql);
            // echo $Sql;exit;

            if ($this->Conn->Affected_Rows() > 0) {

                $this->update_bin_loc_history($arr_attr['warehouse_loc_sdate'], $id);

                $arr_attr['warehouse_loc_id'] = $id;
                $this->add_bin_loc_history($arr_attr);
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

    function add_bin_loc_history($arr_attr)
    {
        $sel_Sql = "SELECT id from warehouse_bin_loc_history WHERE warehouse_loc_id = " . $arr_attr['warehouse_loc_id'] . " Limit 1";
        //echo $sel_Sql;

        $sel_RS = $this->Conn->Execute($sel_Sql);

        if ($sel_RS->RecordCount() > 0)
            $loc_sdate = current_date;
        else
            $loc_sdate = $this->objGeneral->convert_date($arr_attr[warehouse_loc_sdate]);


        $Sql = "INSERT INTO warehouse_bin_loc_history
                                SET
                                      warehouse_loc_id='$arr_attr[warehouse_loc_id]',
<<<<<<< HEAD
                                      parent_id='$arr_attr[parent_id]',
=======
                                      parent_id='".$arr_attr['parent_id']."',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                      cost='$arr_attr[bin_cost]',
                                      uom_id='$arr_attr[dimensions_id]',
                                      cost_type='$arr_attr[cost_type_id]',
                                      currency_id='$arr_attr[currency_id]',
                                      loc_sdate='" . $loc_sdate . "',
                                      action_date='" . current_date . "',
                                      user_id='" . $this->arrUser[id] . "',
                                      company_id='" . $this->arrUser[company_id] . "'
                                      ";
        // echo $Sql;exit;
        // loc_edate='" . $this->objGeneral->convert_date($arr_attr[warehouse_loc_edate]) . "',

        $RS = $this->Conn->Execute($Sql);
        $id = $this->Conn->Insert_ID();

        return true;
    }

    function update_bin_loc_history($date, $rec)
    {
        $sel_Sql = "SELECT id,loc_edate,loc_sdate from warehouse_bin_loc_history WHERE warehouse_loc_id = " . $rec . " order by id desc Limit 1";
        //echo $sel_Sql;

        $sel_RS = $this->Conn->Execute($sel_Sql);

        if ($sel_RS->RecordCount() > 0) {
            $sel_Row = $sel_RS->FetchRow();
            $rec_id = $sel_Row['id'];
            $loc_edate = $sel_Row['loc_edate'];
            $loc_sdate = $sel_Row['loc_sdate'];

            //$new_date = $this->objGeneral->convert_date($date);

            /*$current_date = $this->objGeneral->convert_date($date);
            $previous_day_date = strtotime('-1 day', $current_date);*/

            $previous_day_date = strtotime('-1 day', current_date);

            if ($previous_day_date < $loc_sdate)
                $previous_day_date = $loc_sdate;

            $Sql = "UPDATE warehouse_bin_loc_history SET loc_edate='" . $previous_day_date . "' WHERE id = " . $rec_id . "   Limit 1";
            /*echo $Sql;  exit;*/

            $RS = $this->Conn->Execute($Sql);
            return true;
        } else
            return false;
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
                left JOIN company on company.id=c.company_id
                where  c.warehouse_loc_id=$attr[wrh_loc_id] and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                 order by c.id ASC ";


        $RS = $this->Conn->Execute($Sql);

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
                    left JOIN company on company.id=c.company_id
                    where  c.warehouse_loc_id=$attr[wrh_loc_id] and c.status = 1 and prd.product_code IS NOT NULL and
                          (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                     order by c.id ASC ";

//ECHO $Sql; exit;
        $RS = $this->Conn->Execute($Sql);

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


        $Sql = "SELECT c.id as wrh_additiona_cost_id,cost_title.title as costtitle,c.cost,curr.code,c.start_date,dim.title as dimtitle,
		        CASE  WHEN c.status = 1 THEN 'Active'
		              WHEN c.status = 0 THEN 'Inactive'
		              END AS add_cost_status,
		        CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
		              WHEN c.cost_type_id = 2 THEN 'Daily'
		              WHEN c.cost_type_id = 3 THEN 'Weekly'
		              WHEN c.cost_type_id = 4 THEN 'Monthly'
		              WHEN c.cost_type_id = 5 THEN 'Annually'
		              END AS cost_type,
		        (SELECT id From warehouse_loc_additional_cost_history where loc_additional_cost_id=c.id limit 1 ) as cost_history
                From warehouse_loc_additional_cost  c
                left JOIN company on company.id=c.company_id
                left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                left JOIN warehouse_loc_additional_cost_title as cost_title on cost_title.id=c.add_cost_title_id
                left JOIN warehouse_bin_location as bin_location on bin_location.id=c.warehouse_bin_loc_id
                left JOIN currency as curr on curr.id=bin_location.currency_id
                where  c.warehouse_id=$attr[wrh_id] and c.warehouse_bin_loc_id=$attr[bin_loc_wrh_id] and  c.status=1 and
                 (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                 order by c.id ASC ";


        $RS = $this->Conn->Execute($Sql);
        $response['bin_loc_id'] = $attr[bin_loc_wrh_id];

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['wrh_additiona_cost_id'];
                $result['title'] = $Row['costtitle'];
                //$result['parent_location'] = $Row['parent_title'];
                if ($Row['cost'] > 0) {
                    $result['Currency'] = $Row['code'];
                    $result['Cost'] = $Row['cost'];
                } else
                    $result['Cost'] = "-";
                $result['Unit_of Measure'] = $Row['dimtitle'];
                $result['cost_frequency'] = $Row['cost_type'];
                $result['Start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                //$result['status'] = $Row['add_cost_status'];
                $result['cost_history'] = $Row['cost_history'];

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

        $RS = $this->Conn->Execute($Sql);

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
        $this->objGeneral->mysql_clean($arr_attr);

        $id = $arr_attr['id'];

        $update_check = "";
        if ($arr_attr['id'] > 0)
            $update_check = "  AND tst.id != " . $id . " ";

        if ($arr_attr['bin_loc_id'] == "") {
            $response['ack'] = 0;
            $response['error'] = 'Please Add Warehouse Location First ';
            return $response;
        }

        //$data_pass = "   tst.add_cost_title_id='" . $arr_attr['title_id'] . "' and tst.warehouse_id='" . $arr_attr['wrh_id'] . "' and tst.warehouse_bin_loc_id='" . $arr_attr['bin_loc_id'] . "' $update_check";

        $data_pass = "   tst.add_cost_title_id='" . $arr_attr['title_id'] . "' and
                         tst.warehouse_id='" . $arr_attr['wrh_id'] . "' and
                         tst.warehouse_bin_loc_id='" . $arr_attr['bin_loc_id'] . "' and
                         tst.dimensions_id='" . $arr_attr['dimensions_id'] . "' and
                         tst.start_date='" . $this->objGeneral->convert_date($arr_attr['additional_cost_sdate']) . "' and
                         tst.cost_type_id='" . $arr_attr['cost_type_id'] . "' and tst.status=1
                         $update_check";

        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_loc_additional_cost', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($id == 0) {

            // check for duplicate warehouse location additional cost with same name and update the end date

            $prev_rec_Sql = "SELECT id,start_date From warehouse_loc_additional_cost where  add_cost_title_id='" . $arr_attr['title_id'] . "' and end_date=0 and status=1 order by id desc limit 1";
            $prev_rec_RS = $this->Conn->Execute($prev_rec_Sql);

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

                    $this->Conn->Execute($update_prev_rec_end_date_Sql);
                }
            }

            $Sql = "INSERT INTO warehouse_loc_additional_cost
                                SET
                                      warehouse_id='$arr_attr[wrh_id]',
                                      warehouse_bin_loc_id='$arr_attr[bin_loc_id]',
                                      title='".$arr_attr['title']."',
                                      add_cost_title_id='$arr_attr[title_id]',
<<<<<<< HEAD
                                      description='$arr_attr[description]',
=======
                                      description='".$arr_attr['description']."',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                      cost='$arr_attr[cost]',
                                      dimensions_id='$arr_attr[dimensions_id]',
                                      cost_type_id='$arr_attr[cost_type_id]',
                                      start_date='" . $this->objGeneral->convert_date($arr_attr[additional_cost_sdate]) . "',
                                      user_id='" . $this->arrUser[id] . "',
                                      company_id='" . $this->arrUser[company_id] . "',
<<<<<<< HEAD
                                      status='$arr_attr[status]',
=======
                                      status='".$arr_attr['status']."',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                      AddedBy='" . $this->arrUser['id'] . "',
                                      AddedOn='" . current_date . "'";

            // echo $Sql;exit;

            $RS = $this->Conn->Execute($Sql);
            $id = $this->Conn->Insert_ID();

            if ($id > 0) {
                $arr_attr['wh_loc_additional_cost_id'] = $id;
                $this->add_bin_loc_add_cost_history($arr_attr);
            }

        } else {

            // check date from previous record.

            $sel_Sql = "SELECT start_date,end_date from warehouse_loc_additional_cost WHERE id = " . $id . " Limit 1";
            //echo $sel_Sql;
            $sel_RS = $this->Conn->Execute($sel_Sql);

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
                    $response['error'] = 'Date is Less than Previous Recorded Date';
                    return $response;
                }
            }

            // Check for warehouse location assigned to item

            /*
            $assigned_loc_Sql = "SELECT id From product_warehouse_location where  warehouse_loc_id=" . $arr_attr['bin_loc_id'] . " and status=1  limit 1 ";
            $assigned_loc_RS = $this->Conn->Execute($assigned_loc_Sql);

            if ($assigned_loc_RS->RecordCount() > 0) {
                $response['ack'] = 0;
                $response['error'] = 'This warehouse location is already assigned to an item .';
                return $response;
            }*/

            $Sql = "UPDATE warehouse_loc_additional_cost
                              SET
									warehouse_id='$arr_attr[wrh_id]',
                                    warehouse_bin_loc_id='$arr_attr[bin_loc_id]',
                                    title='".$arr_attr['title']."',
                                    add_cost_title_id='$arr_attr[title_id]',
<<<<<<< HEAD
                                    description='$arr_attr[description]',
=======
                                    description='".$arr_attr['description']."',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    cost='$arr_attr[cost]',
                                    dimensions_id='$arr_attr[dimensions_id]',
                                    cost_type_id='$arr_attr[cost_type_id]',
                                    start_date='" . $this->objGeneral->convert_date($arr_attr[additional_cost_sdate]) . "',
                                    user_id='" . $this->arrUser[id] . "',
                                    company_id='" . $this->arrUser[company_id] . "',
<<<<<<< HEAD
                                    status='$arr_attr[status]',
=======
                                    status='".$arr_attr['status']."',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    ChangedBy='" . $this->arrUser['id'] . "',
                                    ChangedOn='" . current_date . "'
                                    WHERE id = " . $id . "   Limit 1";
//echo $Sql; exit;
            $RS = $this->Conn->Execute($Sql);
            if ($this->Conn->Affected_Rows() > 0) {

                $this->update_bin_loc_add_cost_history($arr_attr['additional_cost_sdate'], $id);

                $arr_attr['wh_loc_additional_cost_id'] = $id;
                $this->add_bin_loc_add_cost_history($arr_attr);
                /*echo "here";
                exit;*/
            }
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

//----------------BIN location Additional Cost Module End ----------------------

// warehouse location Additional Cost history Start
//-------------------------------------------------
    function add_bin_loc_add_cost_history($arr_attr)
    {
        $Sql = "INSERT INTO warehouse_loc_additional_cost_history
                                SET
                                      loc_additional_cost_id='$arr_attr[wh_loc_additional_cost_id]',
                                      cost_title_id='$arr_attr[title_id]',
                                      cost='$arr_attr[cost]',
                                      dimensions_id='$arr_attr[dimensions_id]',
                                      cost_type_id='$arr_attr[cost_type_id]',
                                      start_date='" . $this->objGeneral->convert_date($arr_attr[additional_cost_sdate]) . "',
                                      action_date='" . current_date . "',
                                      user_id='" . $this->arrUser[id] . "',
                                      company_id='" . $this->arrUser[company_id] . "'
                                      ";
        //  echo $Sql; exit;

        $RS = $this->Conn->Execute($Sql);
        $id = $this->Conn->Insert_ID();

        return true;
    }

    function update_bin_loc_add_cost_history($date, $rec)
    {
        $sel_Sql = "SELECT id,start_date,end_date from warehouse_loc_additional_cost_history WHERE warehouse_loc_id = " . $rec . " order by id desc Limit 1";
        //echo $sel_Sql;exit;

        $sel_RS = $this->Conn->Execute($sel_Sql);

        if ($sel_RS->RecordCount() > 0) {
            $sel_Row = $sel_RS->FetchRow();
            $rec_id = $sel_Row['id'];
            $start_date = $sel_Row['start_date'];
            $end_date = $sel_Row['end_date'];

            //$new_date = $this->objGeneral->convert_date($date);

            /*$current_date = $this->objGeneral->convert_date($date);
            $previous_day_date = strtotime('-1 day', $current_date);*/
            $previous_day_date = strtotime('-1 day', current_date);

            if ($previous_day_date < $start_date)
                $previous_day_date = $start_date;

            $Sql = "UPDATE warehouse_loc_additional_cost_history SET end_date='" . $previous_day_date . "' WHERE id = " . $rec_id . "   Limit 1";
            /*echo $Sql;  exit;*/

            $RS = $this->Conn->Execute($Sql);
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
                where  c.loc_additional_cost_id=$attr[wrh_loc_id] and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                 order by c.id ASC ";


        $RS = $this->Conn->Execute($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['wrh_additiona_cost_id'];
                $result['title'] = $Row['costtitle'];
                $result['Cost'] = $Row['cost'];
                $result['Unit_of Measure'] = $Row['dimtitle'];
                $result['cost_frequency'] = $Row['cost_type'];
                $result['Start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
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

// warehouse location Additional Cost history End
//-----------------------------------------------


// Product warehouse location Module Start
//--------------------------------------

    function add_prod_warehouse_loc($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $id = $arr_attr['id'];

        if ($id == 0) {

            $Sql = "INSERT INTO product_warehouse_location
                                SET
<<<<<<< HEAD
                                      item_id='$arr_attr[product_id]',
                                      warehouse_id='$arr_attr[warehouse_id]',
                                      warehouse_loc_id='$arr_attr[location_id]',
                                      default_warehouse='$arr_attr[default_warehouse_id]',
                                      cost='$arr_attr[cost]',
                                      description='$arr_attr[description]',
=======
                                      item_id='".$arr_attr['product_id']."',
                                      warehouse_id='".$arr_attr['warehouse_id']."',
                                      warehouse_loc_id='$arr_attr[location_id]',
                                      default_warehouse='$arr_attr[default_warehouse_id]',
                                      cost='$arr_attr[cost]',
                                      description='".$arr_attr['description']."',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                      uom_id='$arr_attr[dimensions_id]',
                                      currency_id='$arr_attr[currency_id]',
                                      cost_type_id='$arr_attr[cost_type_id]',
                                      warehouse_loc_sdate='" . $this->objGeneral->convert_date($arr_attr[warehouse_loc_sdate]) . "',
                                      user_id='" . $this->arrUser[id] . "',
                                      company_id='" . $this->arrUser[company_id] . "',
<<<<<<< HEAD
                                      status='$arr_attr[status]',
=======
                                      status='".$arr_attr['status']."',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                      AddedBy='" . $this->arrUser['id'] . "',
                                      AddedOn='" . current_date . "'";

            // echo $Sql;exit;
            // warehouse_loc_edate='" . $this->objGeneral->convert_date($arr_attr[warehouse_loc_edate]) . "',

            $RS = $this->Conn->Execute($Sql);
            $id = $this->Conn->Insert_ID();

            if ($id > 0) {
                $arr_attr['prod_warehouse_loc_id'] = $id;
                $this->add_prod_warehouse_loc_history($arr_attr);
            }

        } else {

            // check date from previous record.

            $sel_Sql = "SELECT warehouse_loc_sdate from product_warehouse_location WHERE id = " . $id . " Limit 1";
            //echo $sel_Sql;

            $sel_RS = $this->Conn->Execute($sel_Sql);

            if ($sel_RS->RecordCount() > 0) {
                $sel_Row = $sel_RS->FetchRow();
                $previous_rec_date = $sel_Row['warehouse_loc_sdate'];

                if ($this->objGeneral->convert_date($arr_attr['warehouse_loc_sdate']) < $previous_rec_date) {
                    $response['ack'] = 0;
                    $response['error'] = 'Date is Less than Previous Recorded Date';
                    return $response;
                }
            }

            if ($arr_attr["default_warehouse_id"] > 0) {

                $default_warehouse_Sql = "UPDATE product_warehouse_location
                                                  SET
                                                        default_warehouse=0
                                                        WHERE item_id = " . $arr_attr['product_id'] . " ";
                //echo $default_warehouse_Sql;exit;
                $default_warehouse_RS = $this->Conn->Execute($default_warehouse_Sql);
            }

            $Sql = "UPDATE product_warehouse_location
                              SET
<<<<<<< HEAD
									item_id='$arr_attr[product_id]',
									warehouse_id='$arr_attr[warehouse_id]',
                                    warehouse_loc_id='$arr_attr[location_id]',
                                    default_warehouse='$arr_attr[default_warehouse_id]',
                                    cost='$arr_attr[cost]',
                                    description='$arr_attr[description]',
=======
									item_id='".$arr_attr['product_id']."',
									warehouse_id='".$arr_attr['warehouse_id']."',
                                    warehouse_loc_id='$arr_attr[location_id]',
                                    default_warehouse='$arr_attr[default_warehouse_id]',
                                    cost='$arr_attr[cost]',
                                    description='".$arr_attr['description']."',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    uom_id='$arr_attr[dimensions_id]',
                                    currency_id='$arr_attr[currency_id]',
                                    cost_type_id='$arr_attr[cost_type_id]',
                                    warehouse_loc_sdate='" . $this->objGeneral->convert_date($arr_attr[warehouse_loc_sdate]) . "',
                                    user_id='" . $this->arrUser[id] . "',
                                    company_id='" . $this->arrUser[company_id] . "',
<<<<<<< HEAD
                                    status='$arr_attr[status]',
=======
                                    status='".$arr_attr['status']."',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    ChangedBy='" . $this->arrUser['id'] . "',
                                    ChangedOn='" . current_date . "'
                                    WHERE id = " . $id . "   Limit 1";
            //echo $Sql;exit;
            $RS = $this->Conn->Execute($Sql);

            if ($this->Conn->Affected_Rows() > 0) {

                $this->update_prod_warehouse_loc_history($arr_attr['warehouse_loc_sdate'], $id);

                $arr_attr['prod_warehouse_loc_id'] = $id;
                $this->add_prod_warehouse_loc_history($arr_attr);
            }
        }

        if ($id > 0) {
            $response['id'] = $id;
            $response['ack'] = 1;
            $response['error'] = 'Record Inserted Successfully';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
        }
        return $response;
    }

    function add_prod_warehouse_loc_history($arr_attr)
    {
        $Sql = "INSERT INTO product_warehouse_loc_history
                                SET
                                      product_warehouse_id='$arr_attr[prod_warehouse_loc_id]',
<<<<<<< HEAD
                                      warehouse_id='$arr_attr[warehouse_id]',
=======
                                      warehouse_id='".$arr_attr['warehouse_id']."',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                      location_id='$arr_attr[location_id]',
                                      cost='$arr_attr[cost]',
                                      uom_id='$arr_attr[dimensions_id]',
                                      cost_type='$arr_attr[cost_type_id]',
                                      currency_id='$arr_attr[currency_id]',
                                      start_date='" . $this->objGeneral->convert_date($arr_attr[warehouse_loc_sdate]) . "',
                                      action_date='" . current_date . "',
                                      user_id='" . $this->arrUser[id] . "',
                                      company_id='" . $this->arrUser[company_id] . "'
                                      ";
        // echo $Sql;exit;

        //end_date='" . $this->objGeneral->convert_date($arr_attr[warehouse_loc_edate]) . "',

        $RS = $this->Conn->Execute($Sql);
        $id = $this->Conn->Insert_ID();

        return true;
    }

    function update_prod_warehouse_loc_history($date, $rec)
    {
        $sel_Sql = "SELECT id,start_date,end_date from product_warehouse_loc_history WHERE product_warehouse_id = " . $rec . " order by id desc Limit 1";
        //echo $sel_Sql;

        $sel_RS = $this->Conn->Execute($sel_Sql);

        if ($sel_RS->RecordCount() > 0) {
            $sel_Row = $sel_RS->FetchRow();
            $rec_id = $sel_Row['id'];
            $start_date = $sel_Row['start_date'];
            $end_date = $sel_Row['end_date'];

            $new_date = $this->objGeneral->convert_date($date);

            $Sql = "UPDATE product_warehouse_loc_history  SET end_date='" . $this->objGeneral->convert_date($date) . "' WHERE id = " . $rec_id . "   Limit 1";

            /*echo $Sql;  exit;*/

            $RS = $this->Conn->Execute($Sql);
            return true;
        } else
            return false;
    }

    function alt_prod_warehouse_loc_History($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";

        $response = array();


        $Sql = "SELECT c.id as wrh_loc_id,loc.title as location,wrh.name as warehousename,c.cost,c.start_date,c.end_date,c.action_date,curr.code as crname,dim.title as dimtitle,
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
                left JOIN company on company.id=c.company_id
                where  c.product_warehouse_id=$attr[wrh_loc_id] and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                 order by c.id ASC ";

        $RS = $this->Conn->Execute($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['prod_wrh_loc_id'];
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

    function get_prod_warehouse_loc($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";

        $response = array();


        $Sql = "SELECT c.id as prod_wrh_loc_id,c.cost,c.warehouse_loc_sdate,c.warehouse_loc_id,c.warehouse_id,curr.name as crname,dim.title as dimtitle,wrh.name as warehouse,wrh_loc.title as warehouse_loc,
		        CASE  WHEN c.status = 1 THEN 'Active'
		              WHEN c.status = 0 THEN 'Inactive'
		              END AS add_cost_status,
		        CASE  WHEN c.default_warehouse = 1 THEN 'Yes'
		              WHEN c.default_warehouse = 0 THEN ''
		              END AS default_warehouse,
		        CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
		              WHEN c.cost_type_id = 2 THEN 'Daily'
		              WHEN c.cost_type_id = 3 THEN 'Weekly'
		              WHEN c.cost_type_id = 4 THEN 'Monthly'
		              WHEN c.cost_type_id = 5 THEN 'Annually'
		              END AS cost_type,
		        (SELECT id From product_warehouse_loc_additional_cost where product_warehouse_loc_id=c.id limit 1 ) as add_cost,
		        (SELECT id From product_warehouse_loc_history where product_warehouse_id=c.id limit 1 ) as cost_history

                From product_warehouse_location  c
                left JOIN units_of_measure as dim on dim.id=c.uom_id
                left JOIN currency as curr on curr.id=c.currency_id
                left JOIN warehouse as wrh on wrh.id=c.warehouse_id
                left JOIN warehouse_bin_location as wrh_loc on wrh_loc.id=c.warehouse_loc_id
                left JOIN company on company.id=c.company_id
                where  c.item_id=$attr[prod_id] and c.status = 1 and
                 (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                 order by c.id ASC ";

        //, (SELECT sum(cost) as total From product_warehouse_loc_additional_cost where product_warehouse_loc_id=c.id ) as add_cost_total

        $RS = $this->Conn->Execute($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['prod_wrh_loc_id'];
                $result['warehouse'] = $Row['warehouse'];
                $result['warehouse_id'] = $Row['warehouse_id'];
                $result['location_within Warehouse'] = $Row['warehouse_loc'];
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
                $result['Start_date'] = $this->objGeneral->convert_unix_into_date($Row['warehouse_loc_sdate']);
                $result['add_cost'] = $Row['add_cost'];
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

        $Sql = "SELECT c.* From product_warehouse_location  c where  c.id=".$attr['id']." limit 1 ";

        $RS = $this->Conn->Execute($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();

            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $Row['warehouse_loc_sdate'] = $this->objGeneral->convert_unix_into_date($Row['warehouse_loc_sdate']);
            //$Row['warehouse_loc_edate'] = $this->objGeneral->convert_unix_into_date($Row['warehouse_loc_edate']);

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_warehouse_loc_cost_uom_by_itemid($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        // $response = array();

        $add_cost_chk_Sql = "SELECT bin_cost,description,warehouse_loc_sdate From warehouse_bin_location where id=" . $attr['location_id'] . "  and status=1 limit 1 ";
        //echo $add_cost_chk_Sql; exit;

        $add_cost_chk_RS = $this->Conn->Execute($add_cost_chk_Sql);

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

        $Sql = "SELECT c.id,c.bin_cost,c.description,c.warehouse_loc_sdate,c.cost_type_id,c.dimensions_id,c.currency_id
                From warehouse_bin_location  c
                left JOIN units_of_measure_setup as uom on uom.cat_id=c.dimensions_id
                left JOIN company on company.id=c.company_id
<<<<<<< HEAD
                where  c.status=1  and c.id=" . $attr[location_id] . " and uom.product_id=" . $attr[prod_id] . "  and
=======
                where  c.status=1  and c.id=" . $attr['location_id'] . " and uom.product_id=" . $attr['prod_id'] . "  and
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                 (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                 limit 1 ";

        //echo $Sql; exit;
        $RS = $this->Conn->Execute($Sql);


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


        $Sql = "SELECT c.id as wrh_additiona_cost_id,cost_title.title as costtitle,c.cost,c.start_date,dim.title as dimtitle,
		        CASE  WHEN c.status = 1 THEN 'Active'
		              WHEN c.status = 0 THEN 'Inactive'
		              END AS add_cost_status,
		        CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
		              WHEN c.cost_type_id = 2 THEN 'Daily'
		              WHEN c.cost_type_id = 3 THEN 'Weekly'
		              WHEN c.cost_type_id = 4 THEN 'Monthly'
		              WHEN c.cost_type_id = 5 THEN 'Annually'
		              END AS cost_type
                From product_warehouse_loc_additional_cost  c
                left JOIN company on company.id=c.company_id
                left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                left JOIN warehouse_loc_additional_cost_title as cost_title on cost_title.id=c.add_cost_title_id
                where  c.item_id=$attr[prod_id] and c.product_warehouse_loc_id=$attr[warehouse_loc_id] and c.status = 1 and
                 (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                 order by c.id ASC ";

        $RS = $this->Conn->Execute($Sql);

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

        $Sql = "SELECT c.*  From product_warehouse_loc_additional_cost c where c.id=".$attr['id']." limit 1 ";
        // echo $Sql; exit;

        $RS = $this->Conn->Execute($Sql);

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

    function add_prod_warehouse_loc_add_cost($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $id = $arr_attr['id'];

        $update_check = "";
        if ($arr_attr['id'] > 0)
            $update_check = "  AND tst.id != " . $id . " ";

        $data_pass = "   tst.add_cost_title_id='" . $arr_attr['title_id'] . "' and tst.item_id='" . $arr_attr['prod_id'] . "' and tst.product_warehouse_loc_id='" . $arr_attr['warehouse_loc_id'] . "'  and tst.status=1  $update_check";
        $total = $this->objGeneral->count_duplicate_in_sql('product_warehouse_loc_additional_cost', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($id == 0) {

            $Sql = "INSERT INTO product_warehouse_loc_additional_cost
                                SET
                                      item_id='$arr_attr[prod_id]',
                                      product_warehouse_loc_id='$arr_attr[warehouse_loc_id]',
                                      title='".$arr_attr['title']."',
                                      add_cost_title_id='$arr_attr[title_id]',
<<<<<<< HEAD
                                      description='$arr_attr[description]',
=======
                                      description='".$arr_attr['description']."',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                      cost='$arr_attr[cost]',
                                      dimensions_id='$arr_attr[dimensions_id]',
                                      cost_type_id='$arr_attr[cost_type_id]',
                                      start_date='" . $this->objGeneral->convert_date($arr_attr[additional_cost_sdate]) . "',
                                      user_id='" . $this->arrUser[id] . "',
                                      company_id='" . $this->arrUser[company_id] . "',
<<<<<<< HEAD
                                      status='$arr_attr[status]',
=======
                                      status='".$arr_attr['status']."',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                      AddedBy='" . $this->arrUser['id'] . "',
                                      AddedOn='" . current_date . "'";

            //echo $Sql;exit;

            $RS = $this->Conn->Execute($Sql);
            $id = $this->Conn->Insert_ID();

        } else {

            $Sql = "UPDATE product_warehouse_loc_additional_cost
                              SET
									item_id='$arr_attr[prod_id]',
                                    product_warehouse_loc_id='$arr_attr[warehouse_loc_id]',
                                    title='".$arr_attr['title']."',
                                    add_cost_title_id='$arr_attr[title_id]',
<<<<<<< HEAD
                                    description='$arr_attr[description]',
=======
                                    description='".$arr_attr['description']."',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    cost='$arr_attr[cost]',
                                    dimensions_id='$arr_attr[dimensions_id]',
                                    cost_type_id='$arr_attr[cost_type_id]',
                                    start_date='" . $this->objGeneral->convert_date($arr_attr[additional_cost_sdate]) . "',
                                    user_id='" . $this->arrUser[id] . "',
                                    company_id='" . $this->arrUser[company_id] . "',
<<<<<<< HEAD
                                    status='$arr_attr[status]',
=======
                                    status='".$arr_attr['status']."',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    ChangedBy='" . $this->arrUser['id'] . "',
                                    ChangedOn='" . current_date . "'
                                    WHERE id = " . $id . "   Limit 1";

            // echo $Sql;exit;

            $RS = $this->Conn->Execute($Sql);
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
                left JOIN company on company.id=c.company_id
                where  c.warehouse_id=$attr[wrh_id] and c.status=1 and c.parent_id=0 and
                 (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                 order by c.id ASC ";


        // echo $Sql; exit;
        $RS = $this->Conn->Execute($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                if ($Row['bin_cost'] > 0)
                    $result['Storage_location'] = $Row['title'] . "(" . $Row['crname'] . " " . $Row['bin_cost'] . ", " . $Row['dimtitle'] . ", " . $Row['cost_type'] . ")";
                else
                    $result['Storage_location'] = $Row['title'];
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
                                    left JOIN company on company.id=c.company_id
                                    where  c.warehouse_id=$attr[wrh_id] and c.status=1 and c.parent_id=" . $Row['id'] . " and
                                     (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                     order by c.id ASC ";

                // echo $Sql_subparent; exit;
                $RS_subparent = $this->Conn->Execute($Sql_subparent);

                if ($RS_subparent->RecordCount() > 0) {
                    while ($Row_subparent = $RS_subparent->FetchRow()) {

                        $result['id'] = $Row_subparent['id'];

                        if ($Row_subparent['bin_cost'] > 0)
                            $result['Storage_location'] = " -- " . $Row_subparent['title'] . "(" . $Row_subparent['crname'] . " " . $Row_subparent['bin_cost'] . ", " . $Row_subparent['dimtitle'] . ", " . $Row_subparent['cost_type'] . ")";
                        else
                            $result['Storage_location'] = " -- " . $Row_subparent['title'];

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
                                                left JOIN company on company.id=c.company_id
                                                where  c.warehouse_id=$attr[wrh_id] and c.status=1 and c.parent_id=" . $Row_subparent['id'] . " and
                                                 (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                                 order by c.id ASC ";

                        // echo $Sql_sub_subparent; exit;
                        $RS_sub_subparent = $this->Conn->Execute($Sql_sub_subparent);

                        if ($RS_sub_subparent->RecordCount() > 0) {
                            while ($Row_sub_subparent = $RS_sub_subparent->FetchRow()) {

                                $result['id'] = $Row_sub_subparent['id'];

                                if ($Row_sub_subparent['bin_cost'] > 0)
                                    $result['Storage_location'] = " -- -- " . $Row_sub_subparent['title'] . "(" . $Row_sub_subparent['crname'] . " " . $Row_sub_subparent['bin_cost'] . ", " . $Row_sub_subparent['dimtitle'] . ", " . $Row_sub_subparent['cost_type'] . ")";
                                else
                                    $result['Storage_location'] = " -- -- " . $Row_sub_subparent['title'];

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
                                                        left JOIN company on company.id=c.company_id
                                                        where  c.warehouse_id=$attr[wrh_id] and c.status=1 and c.parent_id=" . $Row_sub_subparent['id'] . " and
                                                         (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                                         order by c.id ASC ";

                                // echo $Sql_sub_subparent2; exit;
                                $RS_sub_subparent2 = $this->Conn->Execute($Sql_sub_subparent2);

                                if ($RS_sub_subparent2->RecordCount() > 0) {
                                    while ($Row_sub_subparent2 = $RS_sub_subparent2->FetchRow()) {

                                        $result['id'] = $Row_sub_subparent2['id'];
                                        if ($Row_sub_subparent2['bin_cost'] > 0)
                                            $result['Storage_location'] = " -- -- -- " . $Row_sub_subparent2['title'] . "(" . $Row_sub_subparent2['crname'] . " " . $Row_sub_subparent2['bin_cost'] . ", " . $Row_sub_subparent2['dimtitle'] . ", " . $Row_sub_subparent2['cost_type'] . ")";
                                        else
                                            $result['Storage_location'] = " -- -- -- " . $Row_sub_subparent2['title'];

                                        $response['response'][] = $result;


                                        $Sql_sub_subparent3 = "SELECT c.id,c.title,c.bin_cost,c.parent_id,curr.code as crname,dim.title as dimtitle,
                                                                CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
                                                                      WHEN c.cost_type_id = 2 THEN 'Daily'
                                                                      WHEN c.cost_type_id = 3 THEN 'Weekly'
                                                                      WHEN c.cost_type_id = 4 THEN 'Monthly'
                                                                      WHEN c.cost_type_id = 5 THEN 'Annually'
                                                                      END AS cost_type
                                                                From warehouse_bin_location  c
                                                                left JOIN currency as curr on curr.id=c.currency_id
                                                                left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                                                                left JOIN company on company.id=c.company_id
                                                                where  c.warehouse_id=$attr[wrh_id] and c.status=1 and c.parent_id=" . $Row_sub_subparent2['id'] . " and
                                                                 (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                                                 order by c.id ASC ";

                                        // echo $Sql_sub_subparent3; exit;
                                        $RS_sub_subparent3 = $this->Conn->Execute($Sql_sub_subparent3);

                                        if ($RS_sub_subparent3->RecordCount() > 0) {
                                            while ($Row_sub_subparent3 = $RS_sub_subparent3->FetchRow()) {

                                                $result['id'] = $Row_sub_subparent3['id'];

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
                                      loc_additional_cost_id='$arr_attr[wh_loc_additional_cost_id]',
                                      cost_title_id='$arr_attr[title_id]',
                                      cost='$arr_attr[cost]',
                                      uom_id='$arr_attr[dimensions_id]',
                                      cost_type_id='$arr_attr[cost_type_id]',
                                      start_date='" . $this->objGeneral->convert_date($arr_attr[additional_cost_sdate]) . "',
                                      action_date='" . current_date . "',
                                      user_id='" . $this->arrUser[id] . "',
                                      company_id='" . $this->arrUser[company_id] . "'
                                      ";
        // echo $Sql;exit;

        $RS = $this->Conn->Execute($Sql);
        $id = $this->Conn->Insert_ID();

        return true;
    }

    function update_prod_loc_add_cost_history($date, $rec)
    {
        $sel_Sql = "SELECT id,start_date,end_date from product_wh_loc_additional_cost_history WHERE loc_additional_cost_id = " . $rec . " order by id desc Limit 1";
        //echo $sel_Sql;

        $sel_RS = $this->Conn->Execute($sel_Sql);

        if ($sel_RS->RecordCount() > 0) {
            $sel_Row = $sel_RS->FetchRow();
            $rec_id = $sel_Row['id'];
            $start_date = $sel_Row['start_date'];
            $end_date = $sel_Row['end_date'];

            //$new_date = $this->objGeneral->convert_date($date);

            $current_date = $this->objGeneral->convert_date($date);
            $previous_day_date = strtotime('-1 day', $current_date);

            $Sql = "UPDATE product_wh_loc_additional_cost_history SET end_date='" . $previous_day_date . "' WHERE id = " . $rec_id . "   Limit 1";
            /*echo $Sql;  exit;*/

            $RS = $this->Conn->Execute($Sql);
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
		              END AS cost_type
                From product_wh_loc_additional_cost_history  c
                left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                left JOIN warehouse_loc_additional_cost_title as cost_title on cost_title.id=c.cost_title_id
                left JOIN company on company.id=c.company_id
                left JOIN employees ON employees.id=c.user_id
                where  c.loc_additional_cost_id=$attr[wrh_loc_id] and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                 order by c.id ASC ";


        $RS = $this->Conn->Execute($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['wrh_additiona_cost_id'];
                $result['title'] = $Row['costtitle'];
                $result['Cost'] = $Row['cost'];
                $result['Unit_of Measure'] = $Row['dimtitle'];
                $result['cost_frequency'] = $Row['cost_type'];
                $result['Start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
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

// Product warehouse location Additional Cost history End
//-----------------------------------------------

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
		left JOIN company on company.id=c.company_id 
		left JOIN warehouse w on w.id=c.warehouse_id 
<<<<<<< HEAD
		where  c.product_id='$attr[item_id]' AND   c.order_id='$attr[order_id]' AND   c.warehouse_id='$attr[ware_id]'
=======
		where  c.product_id='$attr[item_id]' AND   c.order_id='".$attr['order_id']."' AND   c.warehouse_id='$attr[ware_id]'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		AND   c.status=1 and c.type=1 		
		AND(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		$where_clause 
		Limit 1";


        $Sql3 = 'SELECT sum(quantity) as total_qty, wa.* FROM warehouse_allocation as wa
		LEFT JOIN company on company.id=wa.company_id
		WHERE wa.product_id = ' . $attr['item_id'] . ' AND wa.order_id = ' . $attr['order_id'] . ' AND wa.ware_id = ' . $attr['ware_id'] . ' AND (wa.company_id=' . $this->arrUser['company_id'] . ' or  company.parent_id=1)
		Limit 1';
        $RS = $this->Conn->Execute($Sql);

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
        $RS = $this->Conn->Execute($Sql);
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

    function get_stock_allocation($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";


        $response = array();


        if (!empty($attr['purchase_return_status'])) $where_clause .= " AND purchase_return_status = 1 ";
        else  $where_clause .= " AND purchase_return_status = 0 ";

        $Sql = "SELECT c.* ,w.name as wname 
                        From warehouse_allocation  c
                        left JOIN company on company.id=c.company_id
                        left JOIN warehouse w on w.id=c.warehouse_id
<<<<<<< HEAD
                        where  c.product_id='$attr[product_id]' and   c.order_id='$attr[order_id]'
                        and w.id = '$attr[warehouses_id]'
=======
                        where  c.product_id='".$attr['product_id']."' and   c.order_id='".$attr['order_id']."'
                        and w.id = '".$attr['warehouses_id']."'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        and  c.status=1 and c.type='$attr[type_id]'
                        $where_clause
                        and(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                        order by c.id ASC ";
        $RS = $this->Conn->Execute($Sql);

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
            $sql_total_purchase_return = "SELECT  sum(quantity) as total  From warehouse_allocation  c 
			left JOIN company on company.id=c.company_id 
<<<<<<< HEAD
			where  c.product_id=$attr[product_id]  and  c.status=1 and c.type=1
			 and   c.order_id=$attr[order_id] and c.warehouse_id=$attr[warehouses_id] 
=======
			where  c.product_id=".$attr['product_id']."  and  c.status=1 and c.type=1
			 and   c.order_id=".$attr['order_id']." and c.warehouse_id=".$attr['warehouses_id']." 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
			AND purchase_return_status = 1 
			and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")";
            $rs_count_pr = $this->Conn->Execute($sql_total_purchase_return);
            $response['total_pr'] = $rs_count_pr->fields['total'];

        }
        $sql_total = "SELECT  sum(quantity) as total  From warehouse_allocation  c 
			left JOIN company on company.id=c.company_id 
<<<<<<< HEAD
			where  c.product_id=$attr[product_id]  and  c.status=1 and c.type=1
			 and   c.order_id=$attr[order_id] and c.warehouse_id=$attr[warehouses_id] 
=======
			where  c.product_id=".$attr['product_id']."  and  c.status=1 and c.type=1
			 and   c.order_id=".$attr['order_id']." and c.warehouse_id=".$attr['warehouses_id']." 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
			AND purchase_return_status = 0
			and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")";
        $rs_count = $this->Conn->Execute($sql_total);

        $response['total'] = $rs_count->fields['total'];

        return $response;
    }

    function add_stk_allocation($arr_attr)
    {
        $purchase_return_status = "";

        if (!empty($arr_attr['purchase_return_status'])) $purchase_return_status .= "  purchase_return_status = 1 ";
        else  $purchase_return_status .= "  purchase_return_status = 0 ";

        $id = $arr_attr['id'];
        if ($arr_attr['id'] > 0) $update_check = "  AND tst.id != " . $id . " ";

<<<<<<< HEAD
        $data_pass = "   tst.type=".$arr_attr['type']." and tst.order_id='$arr_attr[order_id]'  and tst.product_id='$arr_attr[product_id]'
=======
        $data_pass = "   tst.type=".$arr_attr['type']." and tst.order_id='$arr_attr[order_id]'  and tst.product_id='".$arr_attr['product_id']."'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		and tst.warehouse_id='" . $arr_attr['warehouses_id'] . "'
		 and purchase_return_status='$arr_attr[purchase_return_status]' and container_no='$arr_attr[container_no]'
		 $update_check";
        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_allocation', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }
        $date_receivedUnConv = ""; 

        if($arr_attr['date_received'] > 0){
            $date_receivedUnConv = "date_receivedUnConv = '" . $this->objGeneral->convertUnixDateIntoConvDate($arr_attr['date_received']) . "',";            
        }
        if ($id == 0) {

            $Sql = "INSERT INTO warehouse_allocation
                                SET
                                      " . $purchase_return_status . ",
                                      status=1,
                                      container_no='$arr_attr[container_no]',
                                      purchase_status='$arr_attr[purchase_status]',
                                      bl_shipment_no='$arr_attr[bl_shipment_no]',
                                      quantity='$arr_attr[stock_qty]',
                                      batch_no='$arr_attr[batch_no]',
                                      order_id='$arr_attr[order_id]',
<<<<<<< HEAD
                                      product_id='$arr_attr[product_id]',
                                      warehouse_id='".$arr_attr['warehouses_id']."',
                                      type='".$arr_attr['type']."',
                                      supplier_id='$arr_attr[supplier_id]',
=======
                                      product_id='".$arr_attr['product_id']."',
                                      warehouse_id='".$arr_attr['warehouses_id']."',
                                      type='".$arr_attr['type']."',
                                      supplier_id='".$arr_attr['supplier_id']."',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                      order_date='" . $this->objGeneral->convert_date($arr_attr[order_date]) . "',
                                      unit_measure='$arr_attr[unit_of_measure_name]',
                                      primary_unit_id='$arr_attr[primary_unit_id]',
                                      primary_unit_name='$arr_attr[primary_unit_name]',
                                      primary_unit_qty='$arr_attr[primary_unit_qty]' ,
                                      unit_measure_id='$arr_attr[unit_of_measure_id]',
                                      unit_measure_name='$arr_attr[unit_of_measure_name]',
                                      unit_measure_qty='$arr_attr[unit_of_measure_qty]',
                                      user_id='" . $this->arrUser[id] . "',
                                      company_id='" . $this->arrUser[company_id] . "',
                                      prod_date='" . $this->objGeneral->convert_date($arr_attr['prod_date']) . "',
                                      date_received='" . $this->objGeneral->convert_date($arr_attr['date_received']) . "',
                                      $date_receivedUnConv
                                      use_by_date='" . $this->objGeneral->convert_date($arr_attr['use_by_date']) . "',
                                      location='" . $arr_attr[location] . "',
                                      cost='" . $arr_attr[cost] . "'
                                      ";

        } else {

            $Sql = "UPDATE warehouse_allocation
                            SET
                                container_no='$arr_attr[container_no]',
                                batch_no='$arr_attr[batch_no] ',
                                quantity='$arr_attr[stock_qty]',
                                prod_date='" . $this->objGeneral->convert_date($arr_attr['prod_date']) . "',
                                date_received='" . $this->objGeneral->convert_date($arr_attr['date_received']) . "',
                                $date_receivedUnConv
                                use_by_date='" . $this->objGeneral->convert_date($arr_attr['use_by_date']) . "',
                                primary_unit_id='$arr_attr[primary_unit_id]',
                                primary_unit_name='$arr_attr[primary_unit_name]',
                                primary_unit_qty='$arr_attr[primary_unit_qty]',
                                unit_measure_id='$arr_attr[unit_of_measure_id]',
                                unit_measure_name='$arr_attr[unit_of_measure_name]',
                                unit_measure_qty='$arr_attr[unit_of_measure_qty]',
                                location='" . $arr_attr[location] . "',
                                cost='" . $arr_attr[cost] . "'

                                WHERE id = " . $id . "   Limit 1";
        }


        $RS = $this->Conn->Execute($Sql);
        if ($id == 0) $id = $this->Conn->Insert_ID();

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
	   where  c.wrh_id=".$attr['id']." and c.status=1 and 
		(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		order by c.id ASC ";


        $RS = $this->Conn->Execute($Sql);


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
            $update_check = "  AND tst.id != " . $id . " ";

        $data_pass = "   tst.contact_name='" . $arr_attr['contact_name'] . "'    $update_check";
        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_alt_depot', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
        if ($id == 0) {


            $Sql = "INSERT INTO warehouse_alt_depot SET
<<<<<<< HEAD
									depot='$arr_attr[depot]',depot_address='$arr_attr[depot_address]',role='$arr_attr[role]',contact_name='$arr_attr[contact_name]',role='$arr_attr[role]',address='$arr_attr[address]',address_2='$arr_attr[address_2]',telephone='$arr_attr[telephone]',city='$arr_attr[city]',fax='$arr_attr[fax]',county='$arr_attr[county]',country='$arr_attr[country]',mobile='$arr_attr[mobile]',postcode='$arr_attr[postcode]',direct_line='$arr_attr[direct_line]',email='$arr_attr[email]',web_add='$arr_attr[web_add]',crm_id='$arr_attr[crm_id]',book_in_contact='$arr_attr[book_in_contact]',book_in_tel='$arr_attr[book_in_tel]',book_in_email='$arr_attr[book_in_email]',book_in_fax='$arr_attr[book_in_fax]',booking_instructions='$arr_attr[booking_instructions]',booking_start_time='$arr_attr[booking_start_time]',booking_end_time='$arr_attr[booking_end_time]',user_id='" . $this->arrUser[id] . "',company_id='" . $this->arrUser[company_id] . "'";
=======
									depot='$arr_attr[depot]',depot_address='$arr_attr[depot_address]',role='$arr_attr[role]',contact_name='$arr_attr[contact_name]',role='$arr_attr[role]',address='$arr_attr[address]',address_2='$arr_attr[address_2]',telephone='$arr_attr[telephone]',city='$arr_attr[city]',fax='$arr_attr[fax]',county='$arr_attr[county]',country='$arr_attr[country]',mobile='$arr_attr[mobile]',postcode='$arr_attr[postcode]',direct_line='$arr_attr[direct_line]',email='$arr_attr[email]',web_add='$arr_attr[web_add]',crm_id='".$arr_attr['crm_id']."',book_in_contact='$arr_attr[book_in_contact]',book_in_tel='$arr_attr[book_in_tel]',book_in_email='$arr_attr[book_in_email]',book_in_fax='$arr_attr[book_in_fax]',booking_instructions='$arr_attr[booking_instructions]',booking_start_time='$arr_attr[booking_start_time]',booking_end_time='$arr_attr[booking_end_time]',user_id='" . $this->arrUser[id] . "',company_id='" . $this->arrUser[company_id] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            $RS = $this->Conn->Execute($Sql);
            $id = $this->Conn->Insert_ID();
            // }
        } else {
            $Sql = "UPDATE warehouse_alt_depot SET  
<<<<<<< HEAD
								depot='$arr_attr[depot]',depot_address='$arr_attr[job]',role='$arr_attr[role]',contact_name='$arr_attr[contact_name]',role='$arr_attr[role]',address='$arr_attr[address]',address_2='$arr_attr[address_2]',telephone='$arr_attr[telephone]',city='$arr_attr[city]',fax='$arr_attr[fax]',county='$arr_attr[county]',country='$arr_attr[country]',mobile='$arr_attr[mobile]',postcode='$arr_attr[postcode]',direct_line='$arr_attr[direct_line]',email='$arr_attr[email]',web_add='$arr_attr[web_add]',crm_id='$arr_attr[crm_id]',book_in_contact='$arr_attr[book_in_contact]',book_in_tel='$arr_attr[book_in_tel]',book_in_email='$arr_attr[book_in_email]',book_in_fax='$arr_attr[book_in_fax]',booking_instructions='$arr_attr[booking_instructions]',booking_start_time='$arr_attr[booking_start_time]',booking_end_time='$arr_attr[booking_end_time]' 
=======
								depot='$arr_attr[depot]',depot_address='$arr_attr[job]',role='$arr_attr[role]',contact_name='$arr_attr[contact_name]',role='$arr_attr[role]',address='$arr_attr[address]',address_2='$arr_attr[address_2]',telephone='$arr_attr[telephone]',city='$arr_attr[city]',fax='$arr_attr[fax]',county='$arr_attr[county]',country='$arr_attr[country]',mobile='$arr_attr[mobile]',postcode='$arr_attr[postcode]',direct_line='$arr_attr[direct_line]',email='$arr_attr[email]',web_add='$arr_attr[web_add]',crm_id='".$arr_attr['crm_id']."',book_in_contact='$arr_attr[book_in_contact]',book_in_tel='$arr_attr[book_in_tel]',book_in_email='$arr_attr[book_in_email]',book_in_fax='$arr_attr[book_in_fax]',booking_instructions='$arr_attr[booking_instructions]',booking_start_time='$arr_attr[booking_start_time]',booking_end_time='$arr_attr[booking_end_time]' 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
									WHERE id = " . $id . "   Limit 1";
            $RS = $this->Conn->Execute($Sql);
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
		left JOIN company on company.id=c.company_id  
	    where c.status=1 and 
		(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		order by c.id ASC ";


        $RS = $this->Conn->Execute($Sql);


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
		left JOIN company on company.id=c.company_id  
	    where  c.wrh_id=".$attr['id']." and c.status=1 and 
		(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		order by c.id ASC "; //Volume 1


        $RS = $this->Conn->Execute($Sql);


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
<<<<<<< HEAD
        $id = $attr[update_id];
=======
        $id = $attr['update_id'];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $update_check = "";
        if ($attr['id'] > 0)
            $update_check = "  AND tst.id != " . $id . " ";

<<<<<<< HEAD
        $data_pass = "   tst.offered_by='" . $attr[offered_by] . "' and tst.type = '".$attr['type']."' and tst.module_id='" . $attr[crm_id] . "'    $update_check";
=======
        $data_pass = "   tst.offered_by='" . $attr['offered_by'] . "' and tst.type = '".$attr['type']."' and tst.module_id='" . $attr['crm_id'] . "'    $update_check";
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
=======
SET crm_id = '".$attr['crm_id']."',offered_by = '".$attr['offered_by']."',product_id = '".$attr['product_id']."',offered_by_id = '".$attr['offered_by_id']."',offer_method_id = '$attr[offer_method_id]',price_offered = '$attr[price_offered]',currency_id = '$attr[currency_id]',offer_date = '" . $this->objGeneral->convert_date($attr[offer_date]) . "',offer_valid_date ='" . $this->objGeneral->convert_date($attr[offer_valid_date]) . "',volume_1 = '$attr[volume_1]',volume_2 = '$attr[volume_2]',volume_3 = '$attr[volume_3]',`volume_1_price` = '$attr[volume_1_price]',`volume_2_price` = '$attr[volume_2_price]',`volume_3_price` = '$attr[volume_3_price]',`unit_of_measure_1` = '$attr[unit_of_measure_1]',`unit_of_measure_2` = '$attr[unit_of_measure_2]',`unit_of_measure_3` = '$attr[unit_of_measure_3]',comment = '$attr[comment]'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
,type = '".$attr['type']."',product_code = '$attr[product_code]',product_description = '$attr[product_description]' ,user_id='" . $this->arrUser[id] . "',company_id='" . $this->arrUser[company_id] . "'";
            // }
        } else {


            $Sql = "UPDATE warehouse_price_offer_listing
<<<<<<< HEAD
SET product_id = '$attr[product_id]',offered_by = '$attr[offered_by]',offered_by_id = '$attr[offered_by_id]',offer_method_id = '$attr[offer_method_id]',price_offered = '$attr[price_offered]',currency_id = '$attr[currency_id]',offer_date = '" . $this->objGeneral->convert_date($attr[offer_date]) . "',offer_valid_date = '" . $this->objGeneral->convert_date($attr[offer_valid_date]) . "',volume_1 = '$attr[volume_1]',volume_2 = '$attr[volume_2]',volume_3 = '$attr[volume_3]',`volume_1_price` = '$attr[volume_1_price]',`volume_2_price` = '$attr[volume_2_price]',`volume_3_price` = '$attr[volume_3_price]',`unit_of_measure_1` = '$attr[unit_of_measure_1]',`unit_of_measure_2` = '$attr[unit_of_measure_2]',`unit_of_measure_3` = '$attr[unit_of_measure_3]',comment = '$attr[comment]'
=======
SET product_id = '".$attr['product_id']."',offered_by = '".$attr['offered_by']."',offered_by_id = '".$attr['offered_by_id']."',offer_method_id = '$attr[offer_method_id]',price_offered = '$attr[price_offered]',currency_id = '$attr[currency_id]',offer_date = '" . $this->objGeneral->convert_date($attr[offer_date]) . "',offer_valid_date = '" . $this->objGeneral->convert_date($attr[offer_valid_date]) . "',volume_1 = '$attr[volume_1]',volume_2 = '$attr[volume_2]',volume_3 = '$attr[volume_3]',`volume_1_price` = '$attr[volume_1_price]',`volume_2_price` = '$attr[volume_2_price]',`volume_3_price` = '$attr[volume_3_price]',`unit_of_measure_1` = '$attr[unit_of_measure_1]',`unit_of_measure_2` = '$attr[unit_of_measure_2]',`unit_of_measure_3` = '$attr[unit_of_measure_3]',comment = '$attr[comment]'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
,type = '".$attr['type']."',product_code = '$attr[product_code]',product_description = '$attr[product_description]' 
WHERE id = $id ";
        }
        $RS = $this->Conn->Execute($Sql);
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
	    where  c.wrh_id=".$attr['id']." and c.status=1 and 
		(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		order by c.id ASC ";


        $RS = $this->Conn->Execute($Sql);


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
				WHERE type='".$attr['type']."' AND company_id =" . $this->arrUser[company_id];

        //echo $Sql; exit;
        $RS = $this->Conn->Execute($Sql);
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


        $Sql = "SELECT srm_volume_discount.id,srm_volume_discount.start_date,srm_volume_discount.end_date
		,srm_volume_discount.discount_value,srm_volume_discount.supplier_type
		,v.description 	,srm_volume_discount.purchase_price,srm_volume_discount.discount_price
		,srm_volume_discount.product_code
		FROM warehouse_volume_discount 
		Left JOIN price_offer_volume  v ON v.id = srm_volume_discount.volume_id 
<<<<<<< HEAD
		WHERE srm_volume_discount.crm_id='$attr[crm_id]' and srm_volume_discount.status=1
=======
		WHERE srm_volume_discount.crm_id='".$attr['crm_id']."' and srm_volume_discount.status=1
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		order by srm_volume_discount.id ASC"; //,srm_volume_discount.type

        $RS = $this->Conn->Execute($Sql);


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

<<<<<<< HEAD
        $doc_id = $attr[update_id];
=======
        $doc_id = $attr['update_id'];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $update_check = "";
        if ($doc_id > 0)
            $update_check = "  AND tst.id != " . $doc_id . " ";

<<<<<<< HEAD
        $data_pass = "   tst.offered_by='" . $attr[offered_by] . "' and tst.type = '".$attr['type']."' and tst.module_id='" . $attr[crm_id] . "'    $update_check";
=======
        $data_pass = "   tst.offered_by='" . $attr['offered_by'] . "' and tst.type = '".$attr['type']."' and tst.module_id='" . $attr['crm_id'] . "'    $update_check";
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
						SET crm_id = '$attr[crm_id]',offered_by = '$attr[offered_by]',offered_by_id = '$attr[offered_by_id]',product_id = '$attr[product_id]',product_code = '$attr[product_code]',product_description = '$attr[product_description]',offer_method_id = '$attr[offer_method_id]', offer_valid_date = '" . $this->objGeneral->convert_date($attr[offer_valid_date]) . "',offer_date = '" . $this->objGeneral->convert_date($attr[offer_date]) . "' ,type = '".$attr['type']."' ,user_id='" . $this->arrUser[id] . "',company_id='" . $this->arrUser[company_id] . "'";
=======
						SET crm_id = '".$attr['crm_id']."',offered_by = '".$attr['offered_by']."',offered_by_id = '".$attr['offered_by_id']."',product_id = '".$attr['product_id']."',product_code = '$attr[product_code]',product_description = '$attr[product_description]',offer_method_id = '$attr[offer_method_id]', offer_valid_date = '" . $this->objGeneral->convert_date($attr[offer_valid_date]) . "',offer_date = '" . $this->objGeneral->convert_date($attr[offer_date]) . "' ,type = '".$attr['type']."' ,user_id='" . $this->arrUser[id] . "',company_id='" . $this->arrUser[company_id] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


            //	$doc_id = $this->Conn->Insert_ID();$new='insert';
            $new = 'Add';
            $new_msg = 'Insert';
            // }
        } else {


            $Sql = "UPDATE warehouse_volume_discount_listing
<<<<<<< HEAD
SET offered_by = '$attr[offered_by]',offered_by_id = '$attr[offered_by_id]',product_id = '$attr[product_id]',product_code = '$attr[product_code]',product_description = '$attr[product_description]',offer_method_id = '$attr[offer_method_id]', offer_valid_date = '" . $this->objGeneral->convert_date($attr[offer_valid_date]) . "',offer_date = '" . $this->objGeneral->convert_date($attr[offer_date]) . "'  where id='".$attr['id']."'";
=======
SET offered_by = '".$attr['offered_by']."',offered_by_id = '".$attr['offered_by_id']."',product_id = '".$attr['product_id']."',product_code = '$attr[product_code]',product_description = '$attr[product_description]',offer_method_id = '$attr[offer_method_id]', offer_valid_date = '" . $this->objGeneral->convert_date($attr[offer_valid_date]) . "',offer_date = '" . $this->objGeneral->convert_date($attr[offer_date]) . "'  where id='".$attr['id']."'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        }
        $RS = $this->Conn->Execute($Sql);
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


        $RS = $this->Conn->Execute($Sql);


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
                $RS = $this->Conn->Execute($Sql1);

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
                $RS = $this->Conn->Execute($Sql2);

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
                $RS = $this->Conn->Execute($Sql3);
            $new = 'Add';
            $new_msg = 'Insert';
        } else {


            $Sql1 = "UPDATE warehouse_volume_discount SET  
							purchase_price='" . $arr_attr->purchase_price_11 . "'  
							,discount_value='" . $arr_attr->discount_value_11 . "'
							,discount_price='" . $arr_attr->discount_price_11 . "'  
							WHERE id = " . $sp_id . "   Limit 1";


            $RS = $this->Conn->Execute($Sql1);
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

        $RS = $this->Conn->Execute($Sql);


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
            $update_check = "  AND tst.id != " . $id . " ";

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
            $RS = $this->Conn->Execute($Sql);
            $id = $this->Conn->Insert_ID();
            // }
        } else {
            $Sql = "UPDATE brand SET  
									 name='" . $attr->name . "' 
									WHERE id = " . $id . "   Limit 1";
            $RS = $this->Conn->Execute($Sql);
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

        $RS = $this->Conn->Execute($Sql);


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
            $update_check = "  AND tst.id != " . $id . " ";

        $data_pass = "   tst.name='" . $attr->name . "'  and tst.type=1 and tst.status=1    $update_check";
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
            $RS = $this->Conn->Execute($Sql);
            $id = $this->Conn->Insert_ID();
            // }
        } else {
            $Sql = "UPDATE get_method SET  
									 name='" . $attr->name . "' 
									WHERE id = " . $id . "   Limit 1";
            $RS = $this->Conn->Execute($Sql);
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
<<<<<<< HEAD
          $where = array(0=>array('document.module_id'=>19),1=>array('document.row_id'=>$attr[crm_id]),2=>array('document.type'=>2));
=======
          $where = array(0=>array('document.module_id'=>19),1=>array('document.row_id'=>$attr['crm_id']),2=>array('document.type'=>2));
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
			 srm_agent_area_list.crm_id='".$attr['id']."' and ( srm_agent_area_list.company_id=" . $this->arrUser['company_id'] . " 
			or  company.parent_id=" . $this->arrUser['company_id'] . ")
			order by srm_agent_area_list.id ASC";


        $RS = $this->Conn->Execute($Sql);


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
									,date_added='" . current_date . "'";

            $RS = $this->Conn->Execute($Sql);
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
                    $rs_count = $this->Conn->Execute($sql);
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
														date_added='" . current_date . "'";
                        $RS = $this->Conn->Execute($Sql);
                    }
                    $i++;
                }
            }
        } else {
            {
                //  $Sql = "DELETE FROM shipping_agent WHERE id = $sp_id";
                //	$RS = $this->Conn->Execute($Sql);
                //	$Sql = "DELETE FROM shipping_agent_sale WHERE sale_id = $sp_id";
                //	$RS = $this->Conn->Execute($Sql);

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
                $RS = $this->Conn->Execute($Sql);
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
            $RS = $this->Conn->Execute($Sql);

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

                    $RS = $this->Conn->Execute($Sql);
                }
                $i++;
            }

<<<<<<< HEAD
            $Sql = "UPDATE  shipping_agent_sale SET coverage_area='" . $arr_attr[coverage_area2] . "'  
=======
            $Sql = "UPDATE  shipping_agent_sale SET coverage_area='" . $arr_attr['coverage_area2'] . "'  
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
									WHERE id = " . $sale_customer_id . "  Limit 1";
            $RS = $this->Conn->Execute($Sql);
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
            //	$RS = $this->Conn->Execute($Sql);
            //	$Sql = "DELETE FROM shipping_agent_sale WHERE sale_id = $sp_id";
            //	$RS = $this->Conn->Execute($Sql);

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
            $RS = $this->Conn->Execute($Sql);
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
            $RS = $this->Conn->Execute($Sql);
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
                    $RS = $this->Conn->Execute($Sql);
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
		   FROM warehouse_agent_area_list c  where sale_id ='".$attr['id']."' and status=1 ";
        $RS = $this->Conn->Execute($Sql);
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
			left  JOIN company on company.id= c.company_id 
			where c.status=1 and  ( c.company_id=" . $this->arrUser['company_id'] . " 
			or  company.parent_id=" . $this->arrUser['company_id'] . ")
			order by c.id ASC";


        $RS = $this->Conn->Execute($Sql);


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
        $RS = $this->Conn->Execute($Sql);

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
<<<<<<< HEAD
          $where = array(0=>array('document.module_id'=>19),1=>array('document.row_id'=>$attr[crm_id]),2=>array('document.type'=>2));
=======
          $where = array(0=>array('document.module_id'=>19),1=>array('document.row_id'=>$attr['crm_id']),2=>array('document.type'=>2));
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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


        $RS = $this->Conn->Execute($Sql);


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
<<<<<<< HEAD
        $up_id = $arr_attr[update_id];
=======
        $up_id = $arr_attr['update_id'];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $update_check = "";
        if ($arr_attr['id'] > 0)
            $update_check = "  AND tst.id != " . $up_id . " ";

<<<<<<< HEAD
        $data_pass = "   tst.offered_by='" . $arr_attr[offered_by] . "' and tst.shipping_quantity='" . $arr_attr[shipping_quantity] . "'	and tst.price='" . $arr_attr[price] . "'	and tst.crm_id='" . $arr_attr[crm_id] . "'    $update_check";
=======
        $data_pass = "   tst.offered_by='" . $arr_attr[offered_by] . "' and tst.shipping_quantity='" . $arr_attr[shipping_quantity] . "'	and tst.price='" . $arr_attr[price] . "'	and tst.crm_id='" . $arr_attr['crm_id'] . "'    $update_check";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_area_selected', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
        if ($up_id == 0) {

            $Sql = "INSERT INTO warehouse_area_selected SET
										offered_by='" . $arr_attr[offered_by] . "'
										,offered_by_id='" . $arr_attr[offered_by_id] . "'
										,shiping_coments='" . $arr_attr[shiping_coments] . "'
										,valid_from='" . $arr_attr[valid_from] . "'
										,valid_from_id='" . $arr_attr[valid_from] . "'
										,valid_to='" . $arr_attr[valid_to] . "'
										,valid_to_id='" . $arr_attr[valid_to_id] . "' 
										,price_method='" . $arr_attr[price_method] . "' 
										,shipping_method='" . $arr_attr[shipping_method] . "' 
<<<<<<< HEAD
										,shipping_quantity='" . $arr_attr[shipping_quantity] . "'
										,price='" . $arr_attr[price] . "'
										,crm_id='" . $arr_attr[crm_id] . "' 
=======
										,shipping_quantity='" . $arr_attr['shipping_quantity'] . "'
										,price='" . $arr_attr['price'] . "'
										,crm_id='" . $arr_attr['crm_id'] . "' 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
										,company_id='" . $this->arrUser['company_id'] . "'
										 ,user_id='" . $this->arrUser['id'] . "'
										,date_added='" . current_date . "'";
            //  }
        } else {
            $Sql = "UPDATE  srm_area_selected SET  
									offered_by='" . $arr_attr[offered_by] . "'
									,offered_by_id='" . $arr_attr[offered_by_id] . "'
									,shiping_coments='" . $arr_attr[shiping_coments] . "'
									,valid_from='" . $arr_attr[valid_from] . "'
									,valid_from_id='" . $arr_attr[valid_from] . "'
									,valid_to='" . $arr_attr[valid_to] . "'
									,valid_to_id='" . $arr_attr[valid_to_id] . "' 
									,price_method='" . $arr_attr[price_method] . "' 
									,shipping_method='" . $arr_attr[shipping_method] . "' 
									,shipping_quantity='" . $arr_attr[shipping_quantity] . "'
									,price='" . $arr_attr[price] . "'
									WHERE id = " . $up_id . "   Limit 1";
        }

        $RS = $this->Conn->Execute($Sql);
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
        $where_clause = " AND crm_id = ".$attr['id']." AND rebt.company_id =" . $this->arrUser[company_id];


        $response = array();

        $Sql = "SELECT rebt.*,srm.name as cust_name, vol1.name as rbt_volume_1, vol2.name as rbt_volume_2, vol3.name as rbt_volume_3, rev1.name as rbt_revenue_1, rev2.name as rbt_revenue_2, rev3.name as rbt_revenue_3
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


        $RS = $this->Conn->Execute($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                $result = array();
                if ($Row['type'] == 3) {
                    $items = array();
                    $SqlItem = "SELECT prd.description 
								FROM warehouse_rebate_items as rbt
								JOIN products as prd ON rbt.product_id = prd.id
								WHERE rbt.rebate_id = $Row[id]
								";
                    //echo $SqlItem; 
                    $RS1 = $this->Conn->Execute($SqlItem);
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
                    $RS2 = $this->Conn->Execute($SqlCat);
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
            $response['total'] = $total;
        } else {

            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_warehouse_rebate($attr)
    {


<<<<<<< HEAD
        $id = $attr[update_id];
=======
        $id = $attr['update_id'];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $update_check = "";
        if ($id > 0)
            $update_check = "  AND tst.id != " . $id . " ";

<<<<<<< HEAD
        $data_pass = "   tst.price_offered='" . $attr[price_offered] . "' and tst.universal_type='" . $attr[universal_type] . "'
		                 and tst.offer_date='" . $this->objGeneral->convert_date($attr[offer_date]) . "'
		                 and tst.offer_date='" . $this->objGeneral->convert_date($attr[offer_valid_date]) . "'
		                 and tst.crm_id='" . $attr[crm_id] . "'    $update_check";
=======
        $data_pass = "   tst.price_offered='" . $attr['price_offered'] . "' and tst.universal_type='" . $attr['universal_type'] . "'
		                 and tst.offer_date='" . $this->objGeneral->convert_date($attr['offer_date']) . "'
		                 and tst.offer_date='" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "'
		                 and tst.crm_id='" . $attr['crm_id'] . "'    $update_check";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_rebate', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($id == 0) {

            $Sql = "INSERT INTO warehouse_rebate
<<<<<<< HEAD
SET crm_id = '$attr[crm_id]',type = '".$attr['type']."',item_type = '$attr[item_type]',category_type = '$attr[category_type]',universal_type = '$attr[universal_type]',price_offered = '$attr[price_offered]',volume_1 = '$attr[volume_1]',volume_2 = '$attr[volume_2]',volume_3 = '$attr[volume_3]',volume_rebate_1 = '$attr[volume_rebate_1]',volume_rebate_2 = '$attr[volume_rebate_2]',volume_rebate_3 = '$attr[volume_rebate_3]',revenue_1 = '$attr[revenue_1]',revenue_2 = '$attr[revenue_2]',revenue_3 = '$attr[revenue_3]',revenue_rebate_1 = '$attr[revenue_rebate_1]',revenue_rebate_2 = '$attr[revenue_rebate_2]',revenue_rebate_3 = '$attr[revenue_rebate_3]',created_date = '" . $this->objGeneral->convert_date(NOW()) . "',offer_valid_date = '" . $this->objGeneral->convert_date($attr[offer_valid_date]) . "'
=======
SET crm_id = '".$attr['crm_id']."',type = '".$attr['type']."',item_type = '$attr[item_type]',category_type = '$attr[category_type]',universal_type = '$attr[universal_type]',price_offered = '$attr[price_offered]',volume_1 = '$attr[volume_1]',volume_2 = '$attr[volume_2]',volume_3 = '$attr[volume_3]',volume_rebate_1 = '$attr[volume_rebate_1]',volume_rebate_2 = '$attr[volume_rebate_2]',volume_rebate_3 = '$attr[volume_rebate_3]',revenue_1 = '$attr[revenue_1]',revenue_2 = '$attr[revenue_2]',revenue_3 = '$attr[revenue_3]',revenue_rebate_1 = '$attr[revenue_rebate_1]',revenue_rebate_2 = '$attr[revenue_rebate_2]',revenue_rebate_3 = '$attr[revenue_rebate_3]',created_date = '" . $this->objGeneral->convert_date(NOW()) . "',offer_valid_date = '" . $this->objGeneral->convert_date($attr[offer_valid_date]) . "'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
,offer_date = '" . $this->objGeneral->convert_date($attr[offer_date]) . "',user_id='" . $this->arrUser[id] . "',company_id='" . $this->arrUser[company_id] . "'";
            $RS = $this->Conn->Execute($Sql);
            $id = $this->Conn->Insert_ID();
            if ($attr['type'] == 3)
                self::add_rebate_items($id, $attr['items'], 0);
            if ($attr['type'] == 2)
                self::add_rebate_categories($id, $attr['categories'], 0);
            // }
        } else {
            $Sql = "UPDATE warehouse_rebate
SET type = '".$attr['type']."',universal_type = '$attr[universal_type]',price_offered = '$attr[price_offered]',volume_1 = '$attr[volume_1]',volume_2 = '$attr[volume_2]',volume_3 = '$attr[volume_3]',volume_rebate_1 = '$attr[volume_rebate_1]',volume_rebate_2 = '$attr[volume_rebate_2]',volume_rebate_3 = '$attr[volume_rebate_3]',revenue_1 = '$attr[revenue_1]',revenue_2 = '$attr[revenue_2]',revenue_3 = '$attr[revenue_3]',revenue_rebate_1 = '$attr[revenue_rebate_1]',revenue_rebate_2 = '$attr[revenue_rebate_2]',revenue_rebate_3 = '$attr[revenue_rebate_3]',offer_date = '" . $this->objGeneral->convert_date($attr[offer_date]) . "',offer_valid_date = '" . $this->objGeneral->convert_date($attr[offer_valid_date]) . "' WHERE id = " . $id . "   Limit 1";
            $RS = $this->Conn->Execute($Sql);

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
        $RS = $this->Conn->Execute($Sql);


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
        $RS = $this->Conn->Execute($Sql);


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
        $RS = $this->Conn->Execute($Sql);
        //}
        foreach ($categories as $cat) {
            if ($cat->chk) {
                $Sql = "INSERT INTO warehouse_rebate_categories
					SET rebate_id = " . $id . ",category_id = " . $cat->id;
                $RS = $this->Conn->Execute($Sql);
            }
        }
    }

    function add_rebate_items($id, $items, $isEdit)
    {
        //if($isEdit ==1 ){
        $Sql = "DELETE FROM warehouse_rebate_items
					WHERE rebate_id = " . $id;
        $RS = $this->Conn->Execute($Sql);
        //}
        foreach ($items as $item) {
            if ($item->chk) {
                $Sql = "INSERT INTO warehouse_rebate_items
					SET rebate_id = " . $id . ",product_id = " . $item->id;
                $RS = $this->Conn->Execute($Sql);
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
        $where_clause = "AND company_id =" . $this->arrUser[company_id];


        $response = array();

        $Sql = "SELECT id, name, description
				FROM warehouse_rebate_volume
				WHERE 1
				" . $where_clause . "
				ORDER BY id ASC";


        $RS = $this->Conn->Execute($Sql);


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
            $response['total'] = $total;
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
				WHERE type='".$attr['type']."' AND company_id =" . $this->arrUser[company_id];

        //echo $Sql; exit;
        $RS = $this->Conn->Execute($Sql);
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
<<<<<<< HEAD
        $id = $arr_attr[update_id];
=======
        $id = $arr_attr['update_id'];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $update_check = "";
        if ($id > 0)
            $update_check = "  AND tst.id != " . $id . " ";

        $data_pass = "   tst.name='" . $arr_attr['name'] . "'     $update_check";
        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_rebate', $data_pass, $this->arrUser['company_id']);


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
								SET name='".$arr_attr['name']."',description='".$arr_attr['description']."'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
								,user_id='" . $this->arrUser[id] . "',company_id='" . $this->arrUser[company_id] . "'";
            $RS = $this->Conn->Execute($Sql);
            $id = $this->Conn->Insert_ID();
            // }
        } else {
            $Sql = "UPDATE warehouse_rebate_volume
<<<<<<< HEAD
							SET name='".$arr_attr['name']."',description='$arr_attr[description]'
=======
							SET name='".$arr_attr['name']."',description='".$arr_attr['description']."'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
							WHERE id = " . $id . "   Limit 1";
            $RS = $this->Conn->Execute($Sql);
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


        if (!empty($attr['purchase_return_status'])) $where_clause .= " AND warehouse_allocation.purchase_return_status = $attr[purchase_return_status] ";
        else  $where_clause .= " AND warehouse_allocation.purchase_return_status = 0 ";

        if (!empty($attr['type'])) $where_clause .= " AND warehouse_allocation.type = ".$attr['type']." ";


        $Sql = 'SELECT sum(quantity) as total_qty, sum(quantity)
		 - IFNULL((SELECT sum(sa.quantity)
		FROM warehouse_allocation sa 
		left join company on company.id=sa.company_id 
		WHERE sa.warehouse_id = ' . $attr['warehouse_id'] . ' AND sa.type = 2 AND sa.sale_return_status = 0 and sa.product_id = ' . $attr['product_id'] . ' and warehouse_allocation.container_no = sa.container_no and (sa.company_id=' . $this->arrUser['company_id'] . ' or  company.parent_id=' . $this->arrUser['company_id'] . ') ),0) as avail_qty, IFNULL((SELECT sum(sa.quantity) FROM warehouse_allocation sa 
		left join company on company.id=sa.company_id  WHERE sa.warehouse_id = ' . $attr['warehouse_id'] . ' AND sa.type = 2
		AND sa.sale_return_status = 0 and sa.product_id = ' . $attr['product_id'] . ' 
		and warehouse_allocation.container_no = sa.container_no and 
		(sa.company_id=' . $this->arrUser['company_id'] . ' or  company.parent_id=' . $this->arrUser['company_id'] . ') ),0)as allocated_qty, 
		warehouse_allocation.*
		 FROM warehouse_allocation 
		left JOIN company on company.id=warehouse_allocation.company_id
		 WHERE  
		  purchase_status in (2,3) and    warehouse_allocation.status = 1 
		and product_id = ' . $attr['product_id'] . ' and warehouse_id = ' . $attr['warehouse_id'] . ' 
<<<<<<< HEAD
		AND   warehouse_allocation.order_id=$attr[order_id]
=======
		AND   warehouse_allocation.order_id=".$attr['order_id']."
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		and (warehouse_allocation.company_id=' . $this->arrUser['company_id'] . ' or 
		company.parent_id=' . $this->arrUser['company_id'] . ') 
		group by warehouse_allocation.container_no';


        $RS = $this->Conn->Execute($Sql);

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
            $response['total'] = $total;
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
        if (isset($attr['sale_return_status'])) $sale_return_status = $attr['sale_return_status'];


        if (!empty($attr['purchase_return_status'])) $purchase_return_status = " , purchase_return_status = 1 ";
        else  $purchase_return_status = " , purchase_return_status = 0 ";

        if (!empty($attr['purchase_status'])) $purchase_status = " , purchase_status = 2 ";


        $id = $attr['id'];
        if (empty($id)) $id = $attr['update_id'];
        $update_check = "";
        if ($id > 0) $update_check = "  AND tst.id != " . $id . " ";

<<<<<<< HEAD
        $data_pass = "  	tst.type=".$attr['type']." and tst.status=1 and	tst.order_id=$attr[order_id]
		and tst.product_id=$attr[item_id]	and tst.warehouse_id=$attr[warehouses_id]    $update_check ";
=======
        $data_pass = "  	tst.type=".$attr['type']." and tst.status=1 and	tst.order_id=".$attr['order_id']."
		and tst.product_id=$attr[item_id]	and tst.warehouse_id=".$attr['warehouses_id']."    $update_check ";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_allocation', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists .';
            return $response;
            exit;
        }

        $Sql = "INSERT INTO warehouse_allocation SET batch_no='$attr[batch_no]',warehouse_id='$attr[warehouse_id]'
<<<<<<< HEAD
		, bl_shipment_no='$attr[bl_shipment_no]',container_no='$attr[container_no]',order_id='$attr[order_id]'
		,product_id='$attr[product_id]',status=1,quantity='$attr[req_qty]',,unit_measure='$attr[unit_measure]'
=======
		, bl_shipment_no='$attr[bl_shipment_no]',container_no='$attr[container_no]',order_id='".$attr['order_id']."'
		,product_id='".$attr['product_id']."',status=1,quantity='$attr[req_qty]',,unit_measure='$attr[unit_measure]'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		,sale_return_status='" . $sale_return_status . "' 	,type='".$attr['type']."'
		,company_id='" . $this->arrUser['company_id'] . "' ,user_id='" . $this->arrUser['id'] . "' 
		,prod_date='" . $this->objGeneral->convert_date($attr['prod_date']) . "'
		,date_received='" . $this->objGeneral->convert_date($attr['date_received']) . "'
		,use_by_date='" . $this->objGeneral->convert_date($attr['use_by_date']) . "'
		,order_date='" . $this->objGeneral->convert_date($attr['order_date']) . "'
		$purchase_return_status   $purchase_status 
		";

        //echo $Sql; exit;
        $RS = $this->Conn->Execute($Sql);
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

        $Sql = 'SELECT sum(wa.quantity) as total_qty, wa.* FROM warehouse_allocation wa
		LEFT JOIN company on company.id=wa.company_id
		WHERE wa.product_id = ' . $attr['product_id'] . ' and wa.order_id = ' . $attr['order_id'] . ' 
		and (wa.company_id=' . $this->arrUser['company_id'] . ' or  company.parent_id=1) 
		group by wa.container_no';


        $RS = $this->Conn->Execute($Sql);


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
            $response['total'] = $total;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function delete_sale_order_stock($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM warehouse_allocation
				WHERE id = ".$attr['id']." ";

        //echo $Sql."<hr>"; exit;
        $RS = $this->Conn->Execute($Sql);

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
        //echo "<pre>"; print_r($attr); exit;
<<<<<<< HEAD
        $Sql = "UPDATE warehouse_allocation	SET sale_status=2 WHERE order_id = $attr[order_id] AND type = 2";
=======
        $Sql = "UPDATE warehouse_allocation	SET sale_status=2 WHERE order_id = ".$attr['order_id']." AND type = 2";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $RS = $this->Conn->Execute($Sql);


        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated!';
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


        $RS = $this->Conn->Execute($Sql);


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
            $response['total'] = $total;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }
}

?>