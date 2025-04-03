<?php
// error_reporting(E_ERROR);
require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/General.php");
require_once(SERVER_PATH. "/classes/Setup.php");

class Sales extends Xtreme
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

    // To-Do Module
    //--------------------------------------

    function get_to_do($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = "";
        $where_clause = "AND to_do.company_id =" . $this->arrUser['company_id'];
        if (!empty($attr['keyword'])) {
            $where_clause .= " AND to_do.subject LIKE '%$attr[keyword]%' ";
        }
        if (empty($attr['all'])) {
            if (empty($attr['start'])) $attr['start'] = 0;
            if (empty($attr['limit'])) $attr['limit'] = 10;
            $limit_clause = " LIMIT $attr[start] , $attr[limit]";
        }
        $response = array();

        $Sql = "SELECT to_do.id, to_do.subject, emp.name as assigned_to, to_do.start_date, to_do.end_date, to_do.start_time
				FROM to_do
				JOIN employee as emp ON emp.id = to_do.assigned_to
				WHERE 1 
				" . $where_clause . "
				ORDER BY id ASC";

        
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
       

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['subject'] = $Row['subject'];
                $result['assigned_to'] = $Row['assigned_to'];
                $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
                $result['start_time'] = $Row['start_time'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_to_do_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM to_do
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

    function add_to_do($attr)
    {
        $arr_attr = array();
        $arr_attr = (array)$attr;
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "INSERT INTO to_do
<<<<<<< HEAD
				SET subject='$arr_attr[subject]',assigned_to='$arr_attr[assigned_to]',start_date='" . $this->objGeneral->convert_date($arr_attr[start_date]) . "',end_date='" . $this->objGeneral->convert_date($arr_attr[end_date]) . "',type='".$arr_attr['type']."',employee_id='$arr_attr[employee_id]',start_time='$arr_attr[start_time]',contact_person='$arr_attr[contact_person]',status='$arr_attr[status]',is_send_notification='$arr_attr[is_send_notification]',location='$arr_attr[location]',description='$arr_attr[description]',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
=======
				SET subject='$arr_attr[subject]',assigned_to='$arr_attr[assigned_to]',start_date='" . $this->objGeneral->convert_date($arr_attr['start_date']) . "',end_date='" . $this->objGeneral->convert_date($arr_attr['end_date']) . "',type='".$arr_attr['type']."',employee_id='$arr_attr[employee_id]',start_time='$arr_attr[start_time]',contact_person='$arr_attr[contact_person]',status='".$arr_attr['status']."',is_send_notification='$arr_attr[is_send_notification]',location='$arr_attr[location]',description='".$arr_attr['description']."',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

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

    function update_crm($attr)
    {
        $arr_attr = array();
        $arr_attr = (array)$attr;
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "UPDATE to_do
<<<<<<< HEAD
				SET subject='$arr_attr[subject]',assigned_to='$arr_attr[assigned_to]',start_date='" . $this->objGeneral->convert_date($arr_attr[start_date]) . "',end_date='" . $this->objGeneral->convert_date($arr_attr[end_date]) . "',type='".$arr_attr['type']."',employee_id='$arr_attr[employee_id]',start_time='$arr_attr[start_time]',contact_person='$arr_attr[contact_person]',status='$arr_attr[status]',is_send_notification='$arr_attr[is_send_notification]',location='$arr_attr[location]',description='$arr_attr[description]'
=======
				SET subject='$arr_attr[subject]',assigned_to='$arr_attr[assigned_to]',start_date='" . $this->objGeneral->convert_date($arr_attr['start_date']) . "',end_date='" . $this->objGeneral->convert_date($arr_attr['end_date']) . "',type='".$arr_attr['type']."',employee_id='$arr_attr[employee_id]',start_time='$arr_attr[start_time]',contact_person='$arr_attr[contact_person]',status='".$arr_attr['status']."',is_send_notification='$arr_attr[is_send_notification]',location='$arr_attr[location]',description='".$arr_attr['description']."'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
				WHERE id = ".$arr_attr['id']." ";

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

    function delete_to_do($attr)
    {
        $arr_attr = array();
        $arr_attr = (array)$attr;
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "DELETE FROM to_do
				WHERE id = ".$arr_attr['id']." ";

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

    // Alt Contact Module
    //--------------------------------------

    function get_alt_contacts($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = "";
        $where_clause = "AND company_id =" . $this->arrUser['company_id'];

        if (!empty($attr['keyword'])) {
            $where_clause .= " AND contact_name LIKE '%$attr[keyword]%' ";
        }
        if (empty($attr['all'])) {
            if (empty($attr['start'])) $attr['start'] = 0;
            if (empty($attr['limit'])) $attr['limit'] = 10;
            $limit_clause = " LIMIT $attr[start] , $attr[limit]";
        }
        $response = array();

        $Sql = "SELECT id, contact_name, role, direct_line, mobile, email
				FROM crm_alt_contact
				WHERE 1
				" . $where_clause . "
				ORDER BY id ASC";
      
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
   

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['contact_name'] = $Row['contact_name'];
                $result['role'] = $Row['role'];
                $result['direct_line'] = $Row['direct_line'];
                $result['mobile'] = $Row['mobile'];
                $result['email'] = $Row['email'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_alt_contact_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM crm_alt_contact
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

    function add_alt_contact($attr)
    {
        $arr_attr = array();
        $arr_attr = (array)$attr;
        $this->objGeneral->mysql_clean($arr_attr);
        $Sql = "INSERT INTO crm_alt_contact
<<<<<<< HEAD
				SET depot='$arr_attr[depot]',contact_name='$arr_attr[contact_name]',role='$arr_attr[role]',address='$arr_attr[address]',address_2='$arr_attr[address_2]',telephone='$arr_attr[telephone]',city='$arr_attr[city]',fax='$arr_attr[fax]',county='$arr_attr[county]',country='$arr_attr[country]',mobile='$arr_attr[mobile]',postcode='$arr_attr[postcode]',direct_line='$arr_attr[direct_line]',email='$arr_attr[email]',web_add='$arr_attr[web_add]',crm_id='$arr_attr[crm_id]',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
=======
				SET depot='$arr_attr[depot]',contact_name='$arr_attr[contact_name]',role='$arr_attr[role]',address='$arr_attr[address]',address_2='$arr_attr[address_2]',telephone='$arr_attr[telephone]',city='$arr_attr[city]',fax='$arr_attr[fax]',county='$arr_attr[county]',country='$arr_attr[country]',mobile='$arr_attr[mobile]',postcode='$arr_attr[postcode]',direct_line='$arr_attr[direct_line]',email='$arr_attr[email]',web_add='$arr_attr[web_add]',crm_id='".$arr_attr['crm_id']."',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

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

    function update_alt_contact($attr)
    {
        $arr_attr = array();
        $arr_attr = (array)$attr;
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "UPDATE crm_alt_contact
<<<<<<< HEAD
				SET depot='$arr_attr[depot]',contact_name='$arr_attr[contact_name]',role='$arr_attr[role]',address='$arr_attr[address]',address_2='$arr_attr[address_2]',telephone='$arr_attr[telephone]',city='$arr_attr[city]',fax='$arr_attr[fax]',county='$arr_attr[county]',country='$arr_attr[country]',mobile='$arr_attr[mobile]',postcode='$arr_attr[postcode]',direct_line='$arr_attr[direct_line]',email='$arr_attr[email]',web_add='$arr_attr[web_add]',crm_id='$arr_attr[crm_id]',user_id='$arr_attr[user_id]',company_id='$arr_attr[company_id]'
=======
				SET depot='$arr_attr[depot]',contact_name='$arr_attr[contact_name]',role='$arr_attr[role]',address='$arr_attr[address]',address_2='$arr_attr[address_2]',telephone='$arr_attr[telephone]',city='$arr_attr[city]',fax='$arr_attr[fax]',county='$arr_attr[county]',country='$arr_attr[country]',mobile='$arr_attr[mobile]',postcode='$arr_attr[postcode]',direct_line='$arr_attr[direct_line]',email='$arr_attr[email]',web_add='$arr_attr[web_add]',crm_id='".$arr_attr['crm_id']."',user_id='".$arr_attr['user_id']."',company_id='".$arr_attr['company_id']."'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
				WHERE id = ".$arr_attr['id']." ";

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

    function delete_alt_contact($attr)
    {
        $arr_attr = array();
        $arr_attr = (array)$attr;
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "DELETE FROM crm_alt_contact
				WHERE id = ".$arr_attr['id']." ";

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

    // Alt Depot Module
    //--------------------------------------
    function get_alt_depots($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = "";
        $where_clause = "AND company_id =" . $this->arrUser['company_id'];

        if (!empty($attr['keyword'])) {
            $where_clause .= " AND contact_name LIKE '%$attr[keyword]%' ";
        }
        if (empty($attr['all'])) {
            if (empty($attr['start'])) $attr['start'] = 0;
            if (empty($attr['limit'])) $attr['limit'] = 10;
            $limit_clause = " LIMIT $attr[start] , $attr[limit]";
        }
        $response = array();

        $Sql = "SELECT id, depot, contact_name, direct_line, mobile, email
				FROM crm_alt_depot
				WHERE 1
				" . $where_clause . "
				ORDER BY id ASC";

       
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['depot'] = $Row['depot'];
                $result['contact_name'] = $Row['contact_name'];
                $result['direct_line'] = $Row['direct_line'];
                $result['mobile'] = $Row['mobile'];
                $result['email'] = $Row['email'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_alt_depot_by_id($attr)
    {

        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM crm_alt_depot
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

    function add_alt_depot($attr)
    {
        $arr_attr = array();
        $arr_attr = (array)$attr;
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "INSERT INTO crm_alt_depot
<<<<<<< HEAD
				SET depot='$arr_attr[depot]',contact_name='$arr_attr[contact_name]',role='$arr_attr[role]',address='$arr_attr[address]',address_2='$arr_attr[address_2]',telephone='$arr_attr[telephone]',city='$arr_attr[city]',fax='$arr_attr[fax]',county='$arr_attr[county]',country='$arr_attr[country]',mobile='$arr_attr[mobile]',postcode='$arr_attr[postcode]',direct_line='$arr_attr[direct_line]',email='$arr_attr[email]',web_add='$arr_attr[web_add]',crm_id='$arr_attr[crm_id]',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
=======
				SET depot='$arr_attr[depot]',contact_name='$arr_attr[contact_name]',role='$arr_attr[role]',address='$arr_attr[address]',address_2='$arr_attr[address_2]',telephone='$arr_attr[telephone]',city='$arr_attr[city]',fax='$arr_attr[fax]',county='$arr_attr[county]',country='$arr_attr[country]',mobile='$arr_attr[mobile]',postcode='$arr_attr[postcode]',direct_line='$arr_attr[direct_line]',email='$arr_attr[email]',web_add='$arr_attr[web_add]',crm_id='".$arr_attr['crm_id']."',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

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

    function update_alt_depot($attr)
    {
        $arr_attr = array();
        $arr_attr = (array)$attr;
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "UPDATE crm_alt_depot
<<<<<<< HEAD
				SET depot='$arr_attr[depot]',contact_name='$arr_attr[contact_name]',role='$arr_attr[role]',address='$arr_attr[address]',address_2='$arr_attr[address_2]',telephone='$arr_attr[telephone]',city='$arr_attr[city]',fax='$arr_attr[fax]',county='$arr_attr[county]',country='$arr_attr[country]',mobile='$arr_attr[mobile]',postcode='$arr_attr[postcode]',direct_line='$arr_attr[direct_line]',email='$arr_attr[email]',web_add='$arr_attr[web_add]',crm_id='$arr_attr[crm_id]',user_id='$arr_attr[user_id]',company_id='$arr_attr[company_id]'
=======
				SET depot='$arr_attr[depot]',contact_name='$arr_attr[contact_name]',role='$arr_attr[role]',address='$arr_attr[address]',address_2='$arr_attr[address_2]',telephone='$arr_attr[telephone]',city='$arr_attr[city]',fax='$arr_attr[fax]',county='$arr_attr[county]',country='$arr_attr[country]',mobile='$arr_attr[mobile]',postcode='$arr_attr[postcode]',direct_line='$arr_attr[direct_line]',email='$arr_attr[email]',web_add='$arr_attr[web_add]',crm_id='".$arr_attr['crm_id']."',user_id='".$arr_attr['user_id']."',company_id='".$arr_attr['company_id']."'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
				WHERE id = ".$arr_attr['id']." ";

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

    function delete_alt_depot($attr)
    {
        $arr_attr = array();
        $arr_attr = (array)$attr;
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "DELETE FROM crm_alt_depot
				WHERE id = ".$arr_attr['id']." ";

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

    // Opportunity Cycle Module
    //----------------------------------------------------
    function get_opportunity_cycles($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr); exit;

        $limit_clause = "";
        $where_clause = "AND opcyle.company_id =" . $this->arrUser['company_id'];

        if (!empty($attr['keyword'])) {
            $where_clause .= " AND opcyle.subject LIKE '%$attr[keyword]%' ";
        }

        if (empty($attr['all'])) {
            if (empty($attr['start'])) $attr['start'] = 0;
            if (empty($attr['limit'])) $attr['limit'] = 10;
            $limit_clause = " LIMIT $attr[start] , $attr[limit]";
        }
        $response = array();

        $Sql = "SELECT opcyle.id, opcyle.subject, opcyle.forecast_amount, crm.name as crm_name, opcyle.current_status
				FROM crm_opportunity_cycle_main as opcyle
				JOIN crm ON crm.id = opcyle.crm_id
				WHERE 1
				" . $where_clause . "
				ORDER BY id ASC";

        
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['subject'] = $Row['subject'];
                $result['forecast_amount'] = $Row['forecast_amount'];
                $result['crm_name'] = $Row['crm_name'];
                $result['current_status'] = $Row['current_status'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_opportunity_cycle_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM crm_opportunity_cycle_main
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
            $response['response'][] = array();
        }
        return $response;

    }

    function add_opportunity_cycle($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $mainSql = "INSERT INTO crm_opportunity_cycle_main
<<<<<<< HEAD
				SET subject = '$attr[subject]',forecast_amount = '$attr[forecast_amount]',crm_id = '$attr[crm_id]',current_status = '".$attr['type']."',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
=======
				SET subject = '$attr[subject]',forecast_amount = '$attr[forecast_amount]',crm_id = '".$attr['crm_id']."',current_status = '".$attr['type']."',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $this->Conn->StartTrans();
        $mRS = $this->objsetup->CSI($mainSql);
        $mId = $this->Conn->Insert_ID();

        $detailSql = "INSERT INTO crm_opportunity_cycle
<<<<<<< HEAD
				SET start_date = '" . $this->objGeneral->convert_date($attr[start_date]) . "',end_date = '" . $this->objGeneral->convert_date($attr[end_date]) . "',description = '$attr[description]',type = '".$attr['type']."',parent_id = '$mId',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
=======
				SET start_date = '" . $this->objGeneral->convert_date($attr['start_date']) . "',end_date = '" . $this->objGeneral->convert_date($attr['end_date']) . "',description = '$attr[description]',type = '".$attr['type']."',parent_id = '$mId',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        /*echo $mainSql."<hr>";
        echo $detailSql."<hr>"; exit;*/
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
        $mainSql = "UPDATE crm_opportunity_cycle_main
					SET subject = '".$attr['subject']."',forecast_amount = '$attr[forecast_amount]'
					WHERE id = ".$attr['id']."";


        $detailSql = "UPDATE crm_opportunity_cycle
				SET start_date = '" . $this->objGeneral->convert_date($attr['start_date']) . "',end_date = '" . $this->objGeneral->convert_date($attr['end_date']) . "',description = '".$attr['description']."'
				WHERE parent_id = ".$attr['id']." AND type = ".$attr['type']."";

        /*echo $mainSql."<hr>";
        echo $detailSql."<hr>"; exit;*/
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

        $Sql = "DELETE FROM crm_opportunity_cycle_main
				WHERE id = ".$attr['id']." ";

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
        $Sql = "UPDATE crm_opportunity_cycle
				SET complete_date = NOW(), is_complete = '1'
				WHERE parent_id = ".$attr['id']." AND type = ".$attr['type']."";

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
        $where_clause = "AND company_id =" . $this->arrUser['company_id'];

        if (!empty($attr['keyword'])) {
            $where_clause .= " AND name LIKE '%$attr[keyword]%' ";
        }

        if (empty($attr['all'])) {
            if (empty($attr['start'])) $attr['start'] = 0;
            if (empty($attr['limit'])) $attr['limit'] = 10;
            $limit_clause = " LIMIT $attr[start] , $attr[limit]";
        }
        $response = array();

        $Sql = "SELECT id, name, starting_date, customer_type
				FROM promotions
				WHERE 1
				" . $where_clause . "
				ORDER BY id ASC";

      
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['starting_date'] = $this->objGeneral->convert_unix_into_date($Row['starting_date']);
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
            $response['response'][] = array();
        }
        return $response;

    }

    function add_promotion($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "INSERT INTO promotions
<<<<<<< HEAD
					SET starting_date = '" . $this->objGeneral->convert_date($attr[starting_date]) . "',ending_date = '" . $this->objGeneral->convert_date($attr[ending_date]) . "',offer_type = '$attr[offer_type]',customer_type = '$attr[customer_type]',discount_type = '$attr[discount_type]',discount = '$attr[discount]',name = '".$attr['name']."',file = '$attr[file]',description = '$attr[description]',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
=======
					SET starting_date = '" . $this->objGeneral->convert_date($attr['starting_date']) . "',ending_date = '" . $this->objGeneral->convert_date($attr['ending_date']) . "',offer_type = '$attr[offer_type]',customer_type = '$attr[customer_type]',discount_type = '$attr[discount_type]',discount = '$attr[discount]',name = '".$attr['name']."',file = '$attr[file]',description = '$attr[description]',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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
        $Sql = "UPDATE promotions
<<<<<<< HEAD
					SET starting_date = '" . $this->objGeneral->convert_date($attr[starting_date]) . "',ending_date = '" . $this->objGeneral->convert_date($attr[ending_date]) . "',offer_type = '$attr[offer_type]',customer_type = '$attr[customer_type]',discount_type = '$attr[discount_type]',discount = '$attr[discount]',name = '".$attr['name']."',file = '$attr[file]',description = '$attr[description]'
=======
					SET starting_date = '" . $this->objGeneral->convert_date($attr['starting_date']) . "',ending_date = '" . $this->objGeneral->convert_date($attr['ending_date']) . "',offer_type = '$attr[offer_type]',customer_type = '$attr[customer_type]',discount_type = '$attr[discount_type]',discount = '$attr[discount]',name = '".$attr['name']."',file = '$attr[file]',description = '$attr[description]'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
					WHERE id = ".$attr['id']."";

        /*echo $Sql."<hr>";exit;*/
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

        $Sql = "DELETE FROM promotions
				WHERE id = ".$attr['id']." ";

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
        $where_clause = "AND company_id =" . $this->arrUser['company_id'];

        if (!empty($attr['keyword']))   $where_clause .= " AND name LIKE '%$attr[keyword]%' ";
        

       
        $response = array();

        $pItemSql = "SELECT id, product_id
				FROM promotions_items
				WHERE promotion_id = ".$attr['id']."";

        //echo $pItemSql."<hr>"; exit;
        $pItemRS = $this->objsetup->CSI($pItemSql);

        if ($pItemRS->RecordCount() > 0) {
            $arr_ids = array();
            $str_ids = '';
            while ($Row = $pItemRS->FetchRow())
                $arr_ids[] = $Row['product_id'];
            $str_ids = implode(',', $arr_ids);

            $itemSql = "SELECT prod.id, prod.productnumber, prod.name, prod.unitprice, brand.brandname, cat.name as category
				FROM product as prod
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
                    $result['name'] = $Row['name'];
                    $result['prod_no'] = $Row['productnumber'];
                    $result['unit_price'] = $Row['unitprice'];
                    $result['brand'] = $Row['brandname'];
                    $result['category'] = $Row['category'];
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
<<<<<<< HEAD
					SET product_id = '$attr[product_id]',promotion_id = '$attr[promotion_id]',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
=======
					SET product_id = '".$attr['product_id']."',promotion_id = '".$attr['promotion_id']."',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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

        $Sql = "DELETE FROM promotions_items
				WHERE id = ".$attr['id']."";

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

    function get_promotion_segments($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = "";
        $where_clause = "AND company_id =" . $this->arrUser['company_id'];

        if (!empty($attr['keyword']))   $where_clause .= " AND name LIKE '%$attr[keyword]%' ";
        

       

        $response = array();

        $pItemSql = "SELECT id, segment_id
				FROM promotions_segment
				WHERE promotion_id = ".$attr['id']."";

        //echo $pItemSql."<hr>"; exit;
        $pItemRS = $this->objsetup->CSI($pItemSql);

        if ($pItemRS->RecordCount() > 0) {
            $arr_ids = array();
            $str_ids = '';
            while ($Row = $pItemRS->FetchRow())
                $arr_ids[] = $Row['segment_id'];
            $str_ids = implode(',', $arr_ids);

            $itemSql = "SELECT id, title
				FROM site_constants
				WHERE id IN ($str_ids)";

           
            $itemRS = $this->objsetup->CSI($itemSql);
            $response['ack'] = 1;
            $response['error'] = NULL; 

            if ($itemRS->RecordCount() > 0) {
                while ($Row = $itemRS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['name'] = $Row['title'];
                    $response['response'][] = $result;
                }
            } else
                $response['response'][] = array();

        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_promotion_segment($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "INSERT INTO promotions_segment
<<<<<<< HEAD
					SET segment_id = '$attr[segment_id]',promotion_id = '$attr[promotion_id]',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
=======
					SET segment_id = '$attr[segment_id]',promotion_id = '".$attr['promotion_id']."',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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

    function delete_promotion_segment($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM promotions_segment
				WHERE id = ".$attr['id']."";

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

    function get_promotion_customers($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = "";
        $where_clause = "AND company_id =" . $this->arrUser['company_id'];

        if (!empty($attr['keyword']))   $where_clause .= " AND name LIKE '%$attr[keyword]%' ";
         

        
        $response = array();

        $pItemSql = "SELECT id, customer_id
				FROM promotions_customer
				WHERE promotion_id = ".$attr['id']."";

        //echo $pItemSql."<hr>"; exit;
        $pItemRS = $this->objsetup->CSI($pItemSql);

        if ($pItemRS->RecordCount() > 0) {
            $arr_ids = array();
            $str_ids = '';
            while ($Row = $pItemRS->FetchRow())
                $arr_ids[] = $Row['customer_id'];
            $str_ids = implode(',', $arr_ids);

            $itemSql = "SELECT id, name, address, county, city, postcode, telephone, mobile
				FROM crm
				WHERE id IN ($str_ids)";

           
            $itemRS = $this->objsetup->CSI($itemSql);
            $response['ack'] = 1;
            $response['error'] = NULL; 

            if ($itemRS->RecordCount() > 0) {
                while ($Row = $itemRS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['name'] = $Row['name'];
                    $result['address'] = $Row['address'];
                    $result['county'] = $Row['county'];
                    $result['city'] = $Row['city'];
                    $result['postcode'] = $Row['postcode'];
                    $result['telephone'] = $Row['telephone'];
                    $result['mobile'] = $Row['mobile'];
                    $response['response'][] = $result;
                }
            } else
                $response['response'][] = array();

        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_promotion_customer($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "INSERT INTO promotions_customer
<<<<<<< HEAD
					SET customer_id = '$attr[customer_id]',promotion_id = '$attr[promotion_id]',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
=======
					SET customer_id = '".$attr['customer_id']."',promotion_id = '".$attr['promotion_id']."',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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

    function delete_promotion_customer($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM promotions_customer
				WHERE id = ".$attr['id']."";

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

    // Competitors Module
    //----------------------------------------------------
    function get_competitors($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = "";
        $where_clause = "AND compt.company_id =" . $this->arrUser['company_id'];

        if (!empty($attr['keyword']))    $where_clause .= " AND compt.name LIKE '%$attr[keyword]%' ";
        

       
        $response = array();

        $Sql = "SELECT compt.id, compt.price, compt.volume, compt.note, compt.brand, cat.name as category
				FROM competitors as compt
				LEFT JOIN catagory as cat ON cat.id = compt.category_id
				WHERE 1
				" . $where_clause . "
				ORDER BY id ASC";


       
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL; 

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['category'] = $Row['category'];
                $result['brand'] = $Row['brand'];
                $result['price'] = $Row['price'];
                $result['volume'] = $Row['volume'];
                $result['note'] = $Row['note'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_competitor_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM competitors
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
            $response['response'][] = array();
        }
        return $response;

    }

    function add_competitor($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "INSERT INTO competitors
				SET category_id = '$attr[category_id]',brand = '$attr[brand]',price = '$attr[price]',volume = '$attr[volume]',file = '$attr[file]',note = '$attr[note]',order_frequency = '$attr[order_frequency]',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";

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

    function update_competitor($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "UPDATE competitors
				SET category_id = '$attr[category_id]',brand = '$attr[brand]',price = '$attr[price]',volume = '$attr[volume]',file = '$attr[file]',note = '$attr[note]',order_frequency = '$attr[order_frequency]'
				WHERE id = ".$attr['id']." ";

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

    function delete_competitor($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM competitors
				WHERE id = ".$attr['id']." ";

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
        $where_clause = "AND company_id =" . $this->arrUser['company_id'];

        if (!empty($attr['keyword']))  $where_clause .= " AND name LIKE '%$attr[keyword]%' ";
        

        
        $response = array();

        $Sql = "SELECT compt.id, compt.price, compt.volume, compt.note, compt.brand, cat.name as category
				FROM crm_competitor as compt
				LEFT JOIN catagory as cat ON cat.id = compt.category_id
				WHERE 1
				" . $where_clause . "
				ORDER BY id ASC";


      
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL; 

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['category'] = $Row['category'];
                $result['brand'] = $Row['brand'];
                $result['price'] = $Row['price'];
                $result['volume'] = $Row['volume'];
                $result['note'] = $Row['note'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_crm_competitor_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM crm_competitor
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
            $response['response'][] = array();
        }
        return $response;

    }

    function add_crm_competitor($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "INSERT INTO crm_competitor
<<<<<<< HEAD
				SET category_id = '$attr[category_id]',brand = '$attr[brand]',price = '$attr[price]',volume = '$attr[volume]',file = '$attr[file]',note = '$attr[note]',order_frequency = '$attr[order_frequency]',crm_id = '$attr[crm_id]',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
=======
				SET category_id = '$attr[category_id]',brand = '$attr[brand]',price = '$attr[price]',volume = '$attr[volume]',file = '$attr[file]',note = '$attr[note]',order_frequency = '$attr[order_frequency]',crm_id = '".$attr['crm_id']."',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

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

    function update_crm_competitor($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "UPDATE crm_competitor
				SET category_id = '$attr[category_id]',brand = '$attr[brand]',price = '$attr[price]',volume = '$attr[volume]',file = '$attr[file]',note = '$attr[note]',order_frequency = '$attr[order_frequency]'
				WHERE id = ".$attr['id']." ";

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

    function delete_crm_competitor($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM crm_competitor
				WHERE id = ".$attr['id']." ";

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

    // Price Offer
    //----------------------------------------------------
    function get_price_offers($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = "";
        $where_clause = "AND company_id =" . $this->arrUser['company_id'];

        if (!empty($attr['keyword']))   $where_clause .= " AND name LIKE '%$attr[keyword]%' ";
        

        
        $response = array();

        $Sql = "SELECT cpoffer.id, emp.name as offered_by, cpoffer.product_id as product_no, prod.name as product_description, cpoffer.one_four_pallet, cpoffer.half_load,cpoffer.full_load,cpoffer.primary,cpoffer.offer_date as valid_from, cpoffer.offer_valid_date as valid_until
				FROM crm_price_offer as cpoffer
				LEFT JOIN employee as emp ON emp.id = cpoffer.offered_by_id
				LEFT JOIN product as prod ON prod.id = cpoffer.product_id
				WHERE 1
				" . $where_clause . "
				ORDER BY id ASC";

        
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL; 

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
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_price_offer_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM crm_price_offer
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
            $response['response'][] = array();
        }
        return $response;

    }

    function add_price_offer($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "INSERT INTO crm_price_offer
<<<<<<< HEAD
				SET crm_id = '$attr[crm_id]',product_id = '$attr[product_id]',offered_by_id = '$attr[offered_by_id]',offer_method_id = '$attr[offer_method_id]',price_offered = '$attr[price_offered]',currency_id = '$attr[currency_id]',offer_date = '" . $this->objGeneral->convert_date($attr[offer_valid_date]) . "',one_four_pallet = '$attr[one_four_pallet]',half_load = '$attr[half_load]',full_load = '$attr[full_load]',primary = '$attr[primary]',comment = '$attr[comment]',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
=======
				SET crm_id = '".$attr['crm_id']."',product_id = '".$attr['product_id']."',offered_by_id = '".$attr['offered_by_id']."',offer_method_id = '$attr[offer_method_id]',price_offered = '$attr[price_offered]',currency_id = '$attr[currency_id]',offer_date = '" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "',one_four_pallet = '$attr[one_four_pallet]',half_load = '$attr[half_load]',full_load = '$attr[full_load]',primary = '$attr[primary]',comment = '$attr[comment]',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

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

    function update_price_offer($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "UPDATE crm_price_offer
<<<<<<< HEAD
				SET product_id = '$attr[product_id]',offered_by_id = '$attr[offered_by_id]',offer_method_id = '$attr[offer_method_id]',price_offered = '$attr[price_offered]',currency_id = '$attr[currency_id]',offer_date = '" . $this->objGeneral->convert_date($attr[offer_valid_date]) . "',one_four_pallet = '$attr[one_four_pallet]',half_load = '$attr[half_load]',full_load = '$attr[full_load]',primary = '$attr[primary]',comment = '$attr[comment]'
=======
				SET product_id = '".$attr['product_id']."',offered_by_id = '".$attr['offered_by_id']."',offer_method_id = '$attr[offer_method_id]',price_offered = '$attr[price_offered]',currency_id = '$attr[currency_id]',offer_date = '" . $this->objGeneral->convert_date($attr['offer_valid_date']) . "',one_four_pallet = '$attr[one_four_pallet]',half_load = '$attr[half_load]',full_load = '$attr[full_load]',primary = '$attr[primary]',comment = '$attr[comment]'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
				WHERE id = ".$attr['id']." ";

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

    function delete_price_offer($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM crm_price_offer
				WHERE id = ".$attr['id']." ";

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

    // Crm Opportunity Cycle
    //----------------------------------------------------
    function get_crm_opportunity_cycles($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);

        $limit_clause = "";
        $where_clause = "AND company_id =" . $this->arrUser['company_id'];

        if (!empty($attr['keyword']))    $where_clause .= " AND subject LIKE '%$attr[keyword]%' ";
        

        
        $response = array();

        $Sql = "SELECT oppmain.id, oppmain.subject, oppmain.forecast_amount, oppmain.current_status, opp.end_date as due_date
				FROM crm_opportunity_cycle_main as oppmain
				JOIN crm_opportunity_cycle as opp ON oppmain.id = opp.parent_id AND oppmain.current_status = opp.type
				WHERE 1
				" . $where_clause . "
				ORDER BY id ASC";

         
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL; 

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['subject'] = $Row['subject'];
                $result['forecast_amount'] = $Row['forecast_amount'];
                $result['current_status'] = $Row['current_status'];
                $result['due_date'] = $this->objGeneral->convert_unix_into_date($Row['due_date']);
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_crm_opportunity_cycle_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT oppmain.*, opp.*
				FROM crm_opportunity_cycle_main as oppmain
				JOIN crm_opportunity_cycle as opp ON oppmain.id = opp.parent_id AND oppmain.current_status = opp.type
				WHERE oppmain.id='".$attr['id']."'
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
            $response['response'][] = array();
        }
        return $response;

    }

    function add_crm_opportunity_cycle($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $mainSql = "INSERT INTO crm_opportunity_cycle_main
<<<<<<< HEAD
				SET subject = '$attr[subject]',forecast_amount = '$attr[forecast_amount]',crm_id = '$attr[crm_id]',current_status = '".$attr['type']."',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
=======
				SET subject = '$attr[subject]',forecast_amount = '$attr[forecast_amount]',crm_id = '".$attr['crm_id']."',current_status = '".$attr['type']."',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $this->Conn->StartTrans();
        $mRS = $this->objsetup->CSI($mainSql);
        $mId = $this->Conn->Insert_ID();

        $detailSql = "INSERT INTO crm_opportunity_cycle
<<<<<<< HEAD
				SET start_date = '" . $this->objGeneral->convert_date($attr[start_date]) . "',end_date = '" . $this->objGeneral->convert_date($attr[end_date]) . "',description = '$attr[description]',type = '".$attr['type']."',parent_id = '$mId',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
=======
				SET start_date = '" . $this->objGeneral->convert_date($attr['start_date']) . "',end_date = '" . $this->objGeneral->convert_date($attr['end_date']) . "',description = '$attr[description]',type = '".$attr['type']."',parent_id = '$mId',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        /*echo $mainSql."<hr>";
        echo $detailSql."<hr>"; exit;*/
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

    function update_crm_opportunity_cycle($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $mainSql = "UPDATE crm_opportunity_cycle_main
					SET subject = '$attr[subject]',forecast_amount = '$attr[forecast_amount]'
					WHERE id = ".$attr['id']."";


        $detailSql = "UPDATE crm_opportunity_cycle
<<<<<<< HEAD
				SET start_date = '" . $this->objGeneral->convert_date($attr[start_date]) . "',end_date = '" . $this->objGeneral->convert_date($attr[end_date]) . "',description = '$attr[description]'
=======
				SET start_date = '" . $this->objGeneral->convert_date($attr['start_date']) . "',end_date = '" . $this->objGeneral->convert_date($attr['end_date']) . "',description = '$attr[description]'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
				WHERE parent_id = ".$attr['id']." AND type = ".$attr['type']."";

        /*echo $mainSql."<hr>";
        echo $detailSql."<hr>"; exit;*/
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

    function delete_crm_opportunity_cycle($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM crm_opportunity_cycle_main
				WHERE id = ".$attr['id']." ";

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

    function complete_crm_opportunity_cycle($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "UPDATE crm_opportunity_cycle
				SET complete_date = NOW(), is_complete = '1'
				WHERE parent_id = ".$attr['id']." AND type = ".$attr['type']."";

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

    // Crm Promotions Module
    //----------------------------------------------------
    function get_crm_promotions($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = "";
        $where_clause = "AND company_id =" . $this->arrUser['company_id'];

        if (!empty($attr['keyword']))   $where_clause .= " AND name LIKE '%$attr[keyword]%' ";
        

        
        $response = array();

        $Sql = "SELECT id, name, starting_date, ending_date
				FROM crm_promotions
				WHERE 1
				" . $where_clause . "
				ORDER BY id ASC";

      
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL; 

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['starting_date'] = $this->objGeneral->convert_unix_into_date($Row['starting_date']);
                $result['ending_date'] = $this->objGeneral->convert_unix_into_date($Row['ending_date']);
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_crm_promotion_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM crm_promotions
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
            $response['response'][] = array();
        }
        return $response;

    }

    function add_crm_promotion($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "INSERT INTO crm_promotions
<<<<<<< HEAD
					SET starting_date = '" . $this->objGeneral->convert_date($attr[starting_date]) . "',ending_date = '" . $this->objGeneral->convert_date($attr[ending_date]) . "',offer_type = '$attr[offer_type]',customer_type = '$attr[customer_type]',discount_type = '$attr[discount_type]',discount = '$attr[discount]',name = '".$attr['name']."',file = '$attr[file]',description = '$attr[description]',crm_id = '$attr[crm_id]',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
=======
					SET starting_date = '" . $this->objGeneral->convert_date($attr['starting_date']) . "',ending_date = '" . $this->objGeneral->convert_date($attr['ending_date']) . "',offer_type = '$attr[offer_type]',customer_type = '$attr[customer_type]',discount_type = '$attr[discount_type]',discount = '$attr[discount]',name = '".$attr['name']."',file = '$attr[file]',description = '$attr[description]',crm_id = '".$attr['crm_id']."',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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

    function update_crm_promotion($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "UPDATE crm_promotions
<<<<<<< HEAD
					SET starting_date = '" . $this->objGeneral->convert_date($attr[starting_date]) . "',ending_date = '" . $this->objGeneral->convert_date($attr[ending_date]) . "',offer_type = '$attr[offer_type]',customer_type = '$attr[customer_type]',discount_type = '$attr[discount_type]',discount = '$attr[discount]',name = '".$attr['name']."',file = '$attr[file]',description = '$attr[description]'
=======
					SET starting_date = '" . $this->objGeneral->convert_date($attr['starting_date']) . "',ending_date = '" . $this->objGeneral->convert_date($attr['ending_date']) . "',offer_type = '$attr[offer_type]',customer_type = '$attr[customer_type]',discount_type = '$attr[discount_type]',discount = '$attr[discount]',name = '".$attr['name']."',file = '$attr[file]',description = '$attr[description]'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
					WHERE id = ".$attr['id']."";

        /*echo $Sql."<hr>";exit;*/
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

    function delete_crm_promotion($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM crm_promotions
				WHERE id = ".$attr['id']." ";

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
        $where_clause = "AND company_id =" . $this->arrUser['company_id'];

        if (!empty($attr['keyword']))   $where_clause .= " AND name LIKE '%$attr[keyword]%' ";
         

       

        $response = array();

        $pItemSql = "SELECT id, product_id
				FROM crm_promotions_items
				WHERE promotion_id = ".$attr['id']."";

        //echo $pItemSql."<hr>"; exit;
        $pItemRS = $this->objsetup->CSI($pItemSql);

        if ($pItemRS->RecordCount() > 0) {
            $arr_ids = array();
            $str_ids = '';
            while ($Row = $pItemRS->FetchRow())
                $arr_ids[] = $Row['product_id'];
            $str_ids = implode(',', $arr_ids);

            $itemSql = "SELECT prod.id, prod.productnumber, prod.name, prod.unitprice, brand.brandname, cat.name as category
				FROM product as prod
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
                    $result['name'] = $Row['name'];
                    $result['prod_no'] = $Row['productnumber'];
                    $result['unit_price'] = $Row['unitprice'];
                    $result['brand'] = $Row['brandname'];
                    $result['category'] = $Row['category'];
                    $response['response'][] = $result;
                }
            } else
                $response['response'][] = array();

        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_crm_promotion_product($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "INSERT INTO crm_promotions_items
<<<<<<< HEAD
					SET product_id = '$attr[product_id]',promotion_id = '$attr[promotion_id]',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
=======
					SET product_id = '".$attr['product_id']."',promotion_id = '".$attr['promotion_id']."',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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

    function delete_crm_promotion_product($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM crm_promotions_items
				WHERE id = ".$attr['id']."";

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

    // General Tab/ Main Credit Note Info Module
    //--------------------------------------
    function get_credit_note_listings($attr)
    {

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = "";
        $where_clause = "AND company_id =" . $this->arrUser['company_id'];
        if (!empty($attr['keyword']))    $where_clause .= " AND name LIKE '%$attr[keyword]%' ";
        
        
        $response = array();

        $Sql = "SELECT id, order_no, sell_to_cust_name, sell_to_address
				FROM credit_notes
				WHERE 1 
				" . $where_clause . "
				ORDER BY id ASC";

       
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL; 

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['order_no'] = $Row['order_no'];
                $result['sell_to_cust_name'] = $Row['sell_to_cust_name'];
                $result['sell_to_address'] = $Row['sell_to_address'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_credit_note_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM credit_notes
				WHERE id='".$attr['id']."'
				LIMIT 1";
        //echo $Sql."<hr>"; exit;
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

    function add_credit_note($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "INSERT INTO credit_notes
				SET order_no='$attr[order_no]',
<<<<<<< HEAD
				posting_date='" . $this->objGeneral->convert_date($attr[posting_date]) . "',
				sell_to_cust_id='$attr[sell_to_cust_id]',sell_to_cust_no='$attr[sell_to_cust_no]',order_date='" . $this->objGeneral->convert_date($attr[order_date]) . "',sell_to_contact_id='$attr[sell_to_contact_id]',
				requested_delivery_date='" . $this->objGeneral->convert_date($attr[requested_delivery_date]) . "',
				sell_to_cust_name='$attr[sell_to_cust_name]',
				delivery_date='" . $this->objGeneral->convert_date($attr[delivery_date]) . "',
=======
				posting_date='" . $this->objGeneral->convert_date($attr['posting_date']) . "',
				sell_to_cust_id='$attr[sell_to_cust_id]',sell_to_cust_no='$attr[sell_to_cust_no]',order_date='" . $this->objGeneral->convert_date($attr['order_date']) . "',sell_to_contact_id='$attr[sell_to_contact_id]',
				requested_delivery_date='" . $this->objGeneral->convert_date($attr['requested_delivery_date']) . "',
				sell_to_cust_name='$attr[sell_to_cust_name]',
				delivery_date='" . $this->objGeneral->convert_date($attr['delivery_date']) . "',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
				sell_to_address='$attr[sell_to_address]',delivery_time='$attr[delivery_time]',sell_to_address2='$attr[sell_to_address2]',cust_order_no='$attr[cust_order_no]',sell_to_city='$attr[sell_to_city]',sell_to_county='$attr[sell_to_county]',campaign_id='$attr[campaign_id]',campaign_no='$attr[campaign_no]',sell_to_contact='$attr[sell_to_contact]',sale_person_id='$attr[sale_person_id]',sale_person='$attr[sale_person]',cust_phone='$attr[cust_phone]',cust_fax='$attr[cust_fax]',cust_email='$attr[cust_email]',currency_id='$attr[currency_id]',comm_book_in_no='$attr[comm_book_in_no]',book_in_email='$attr[book_in_email]',comm_book_in_contact='$attr[comm_book_in_contact]',converted_currency_id='$attr[converted_currency_id]',converted_currency_code='$attr[converted_currency_code]',currency_rate='$attr[currency_rate]',converted_unit_price='$attr[converted_unit_price]',sell_to_post_code='$attr[sell_to_post_code]',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";

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

    function update_credit_note($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "UPDATE credit_notes
				SET order_no='$attr[order_no]',
<<<<<<< HEAD
				posting_date='" . $this->objGeneral->convert_date($attr[posting_date]) . "',sell_to_cust_id='$attr[sell_to_cust_id]',sell_to_cust_no='$attr[sell_to_cust_no]',
				order_date='" . $this->objGeneral->convert_date($attr[order_date]) . "',
				sell_to_contact_id='$attr[sell_to_contact_id]',
				requested_delivery_date='" . $this->objGeneral->convert_date($attr[requested_delivery_date]) . "',
				sell_to_cust_name='$attr[sell_to_cust_name]',
				delivery_date='" . $this->objGeneral->convert_date($attr[delivery_date]) . "',
=======
				posting_date='" . $this->objGeneral->convert_date($attr['posting_date']) . "',sell_to_cust_id='$attr[sell_to_cust_id]',sell_to_cust_no='$attr[sell_to_cust_no]',
				order_date='" . $this->objGeneral->convert_date($attr['order_date']) . "',
				sell_to_contact_id='$attr[sell_to_contact_id]',
				requested_delivery_date='" . $this->objGeneral->convert_date($attr['requested_delivery_date']) . "',
				sell_to_cust_name='$attr[sell_to_cust_name]',
				delivery_date='" . $this->objGeneral->convert_date($attr['delivery_date']) . "',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
				sell_to_address='$attr[sell_to_address]',delivery_time='$attr[delivery_time]',sell_to_address2='$attr[sell_to_address2]',cust_order_no='$attr[cust_order_no]',sell_to_city='$attr[sell_to_city]',sell_to_county='$attr[sell_to_county]',campaign_id='$attr[campaign_id]',campaign_no='$attr[campaign_no]',sell_to_contact='$attr[sell_to_contact]',sale_person_id='$attr[sale_person_id]',sale_person='$attr[sale_person]',cust_phone='$attr[cust_phone]',cust_fax='$attr[cust_fax]',cust_email='$attr[cust_email]',currency_id='$attr[currency_id]',comm_book_in_no='$attr[comm_book_in_no]',book_in_email='$attr[book_in_email]',comm_book_in_contact='$attr[comm_book_in_contact]',converted_currency_id='$attr[converted_currency_id]',converted_currency_code='$attr[converted_currency_code]',currency_rate='$attr[currency_rate]',converted_unit_price='$attr[converted_unit_price]',sell_to_post_code='$attr[sell_to_post_code]'
				WHERE id = ".$attr['id']." ";

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

    function delete_credit_note($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM credit_notes
				WHERE id = ".$attr['id']." ";

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

    // Credit Note Invoicing
    //-------------------------------------------

    function credit_note_invoice($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "UPDATE credit_note
				SET  bill_to_cust_id='$attr[bill_to_cust_id]',bill_to_cust_no='$attr[bill_to_cust_no]',bill_to_contact_id='$attr[bill_to_contact_id]',payable_bank='$attr[payable_bank]',payment_terms_code='$attr[payment_terms_code]',bill_to_name='$attr[bill_to_name]',
<<<<<<< HEAD
				due_date='" . $this->objGeneral->convert_date($attr[due_date]) . "',
=======
				due_date='" . $this->objGeneral->convert_date($attr['due_date']) . "',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
				bill_to_address='$attr[bill_to_address]',payment_discount='$attr[payment_discount]',bill_to_address2='$attr[bill_to_address2]',payment_method_id='$attr[payment_method_id]',payment_method_code='$attr[payment_method_code]',bill_to_city='$attr[bill_to_city]',price_including_vat='$attr[price_including_vat]',bill_to_county='$attr[bill_to_county]',bill_to_post_code='$attr[bill_to_post_code]',bill_to_contact='$attr[bill_to_contact]'
				WHERE id = ".$attr['id']." ";

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

    // Credit Note Shipping
    //-------------------------------------------

    function credit_note_shipping($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "UPDATE credit_notes
				SET  alt_depo_id='$attr[alt_depo_id]',shipment_method_id='$attr[shipment_method_id]',shipment_method_code='$attr[shipment_method_code]',shipping_agent_code='$attr[shipping_agent_code]',ship_to_name='$attr[ship_to_name]',shipping_agent_id='$attr[shipping_agent_id]',ship_to_address='$attr[ship_to_address]',ship_to_address2='$attr[ship_to_address2]',freight_charges='$attr[freight_charges]',ship_to_city='$attr[ship_to_city]',container_no='$attr[container_no]',ship_to_county='$attr[ship_to_county]',ship_to_post_code='$attr[ship_to_post_code]',
<<<<<<< HEAD
				shipment_date='" . $this->objGeneral->convert_date($attr[shipment_date]) . "',
=======
				shipment_date='" . $this->objGeneral->convert_date($attr['shipment_date']) . "',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
				ship_to_contact='$attr[ship_to_contact]',ship_delivery_time='$attr[ship_delivery_time]',book_in_tel='$attr[book_in_tel]',warehouse_booking_ref='$attr[warehouse_booking_ref]',customer_warehouse_ref='$attr[customer_warehouse_ref]',location_code='$attr[location_code]'
				WHERE id = ".$attr['id']." ";

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

    // Credit Note Comment
    //-------------------------------------------

    function credit_notes_comment($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "UPDATE credit_notes
				SET  comment='$attr[comment]'
				WHERE id = ".$attr['id']."";

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

    // Credit Note products
    //--------------------------------------

    function credit_note_products($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $SqlQuote = "UPDATE credit_notes
				SET  net_amount='$attr[net_amount]',grand_total='$attr[grand_total]',tax_rate='$attr[tax_rate]',tax_amount='$attr[tax_amount]'
				WHERE id = ".$attr['id']."";

        $SqlQuote = "UPDATE credit_notes_details
				SET  qty='$attr[qty]',unit_price='$attr[unit_price]',vat='$attr[vat]',vat_id='$attr[vat_id]',vat_value='$attr[vat_value]',item_name='$attr[item_name]',item_id='$attr[item_id]',total_price='$attr[total_price]',unit_measure='$attr[unit_measure]',unit_measure_id='$attr[unit_measure_id]',unit_parent_id='$attr[unit_parent_id]',unit_qty='$attr[unit_qty]',cat_id='$attr[cat_id]',order_id='".$attr['id']."',conv_unit_price='$attr[conv_unit_price]'
				WHERE id = ".$attr['id']."";

        //echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($SqlQuote);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated!';
        }

        return $response;

    }

    function delete_credit_notes_item($attr)
    {

        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM credit_notes
				WHERE id = ".$attr['id']." ";

        //echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = "Record can't be deleted!";
        }

        return $response;

    }

    // Credit Note Finance
    //--------------------------------------

    function get_credit_note_finance_listings($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = "";
        $where_clause = "AND type =2 AND company_id =" . $this->arrUser['company_id'];
        if (!empty($attr['keyword'])) {
            $where_clause .= " AND name LIKE '%$attr[keyword]%' ";
        }
        if (empty($attr['all'])) {
            if (empty($attr['start'])) $attr['start'] = 0;
            if (empty($attr['limit'])) $attr['limit'] = 10;
            $limit_clause = " LIMIT $attr[start] , $attr[limit]";
        }
        $response = array();

        $Sql = "SELECT id, contact_person, email
				FROM finance
				WHERE 1 
				" . $where_clause . "
				ORDER BY id ASC";

       
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL; 

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['contact_person'] = $Row['contact_person'];
                $result['email'] = $Row['email'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_credit_note_finance($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "INSERT INTO finance
<<<<<<< HEAD
				SET order_id='$attr[order_id]',type='2',contact_person='$attr[contact_person]',phone='$attr[phone]',alt_contact_person='$attr[alt_contact_person]',alt_contact_email='$attr[alt_contact_email]',contact_id='$attr[contact_id]',fax='$attr[fax]',posting='$attr[posting]',bill_to_customer='$attr[bill_to_customer]',bill_to_customer_id='$attr[bill_to_customer_id]',payment_terms_id='$attr[payment_terms_id]',payment_method_id='$attr[payment_method_id]',email='$attr[email]',bank_account_id='$attr[bank_account_id]',generate='$attr[generate]',currency='$attr[currency]',gen_bus_posting_group='$attr[gen_bus_posting_group]',status='$attr[status]',vat_bus_posting_group='$attr[vat_bus_posting_group]',customer_posting_group='$attr[customer_posting_group]',company_reg_no='$attr[company_reg_no]',finance_charges_id='$attr[finance_charges_id]',insurance_charges_id='$attr[insurance_charges_id]',vat_id='$attr[vat_id]',customer_status='$attr[customer_status]',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
=======
				SET order_id='".$attr['order_id']."',type='2',contact_person='$attr[contact_person]',phone='$attr[phone]',alt_contact_person='$attr[alt_contact_person]',alt_contact_email='$attr[alt_contact_email]',contact_id='$attr[contact_id]',fax='$attr[fax]',posting='$attr[posting]',bill_to_customer='$attr[bill_to_customer]',bill_to_customer_id='$attr[bill_to_customer_id]',payment_terms_id='$attr[payment_terms_id]',payment_method_id='$attr[payment_method_id]',email='$attr[email]',bank_account_id='$attr[bank_account_id]',generate='$attr[generate]',currency='$attr[currency]',gen_bus_posting_group='$attr[gen_bus_posting_group]',status='$attr[status]',vat_bus_posting_group='$attr[vat_bus_posting_group]',customer_posting_group='$attr[customer_posting_group]',company_reg_no='$attr[company_reg_no]',finance_charges_id='$attr[finance_charges_id]',insurance_charges_id='$attr[insurance_charges_id]',vat_id='$attr[vat_id]',customer_status='$attr[customer_status]',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

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

    // Sales Statistics
    //----------------------------------------

    function get_sales_statistics($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = "";
        $where_clause = "AND orders.company_id =" . $this->arrUser['company_id'];
        if (!empty($attr['date_from']) && !empty($attr['date_to']))    $where_clause .= " AND orders.order_date BETWEEN '" . $this->objGeneral->convert_date($attr['date_from']) . "' AND '" . $this->objGeneral->convert_date($attr['date_to']) . "'";
       
        $response = array();

        $Sql = "SELECT CONCAT(brand.brandcode,product.productnumber) as number  ,brand.brandname as brand_name,  order_details.item_name as description,order_details.unit_measure as base_measure, AVG(order_details.unit_price) AS avg_price, SUM(qty) AS sales_qty, SUM(total_price) AS sales_lcy FROM  `orders`
				LEFT JOIN order_details
				ON order_details.order_id=orders.id
				LEFT JOIN product
				ON order_details.item_id=product.id
				LEFT JOIN brand
				ON product.brand_id=brand.id
				WHERE 1 
				" . $where_clause . "
			GROUP BY order_details.item_id";
       

        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['number'] = $Row['number'];
                $result['brand_name'] = $Row['brand_name'];
                $result['description'] = $Row['description'];
                $result['base_measure'] = $Row['base_measure'];
                $result['avg_price'] = $Row['avg_price'];
                $result['sales_qty'] = $Row['sales_qty'];
                $result['sales_lcy'] = $Row['sales_lcy'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }
}
<<<<<<< HEAD
?>
=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
